#!/bin/bash
# Render Vicksburg scenes on ONE RunPod GPU pod (recipe: research/runpod/README.md). The key stays in $RUNPOD_API_KEY (never printed).
# BW copy of vicksburg/tools/render_pod.sh (Style W borrow test): never an RTX A4500, no RTX 3090 and (r12) no RTX 4000 Ada (black-ellipse frames too) (its frames came out corrupted: black ellipse / blocky clouds, r4); a pod that does not answer within 10 min is terminated.
# usage: SCENES_DIR=marion/scenes bash research/style_tests/stylew_borrow/tools/render_pod_bw.sh OUTDIR S05 [S07 ...]   (or NAME:START-END for a window, e.g. S09_gm:55-110)     -> OUTDIR/S05.mp4 ...; the pod is ALWAYS terminated at exit.
# Env: GPU (default "NVIDIA RTX A5000"), WORKERS (3), POD (reuse an existing pod id; then it is not terminated), KEEP=1 (r9: keep the new pod alive for more iterations; terminate it yourself).
set -u
R=/home/user/battle-maps/research/runpod; V=/home/user/battle-maps/vicksburg; OUT=$1; shift; mkdir -p "$OUT"
W=/tmp/vx_pod/run_$$; mkdir -p $W; export CTL_TOKEN_FILE=${CTL_TOKEN_FILE:-$W/token.txt}   # to reuse a running pod pass POD + its CTL_TOKEN_FILE
[ -s $CTL_TOKEN_FILE ] || python3 -c "import secrets;print(secrets.token_hex(24))" > $CTL_TOKEN_FILE
rp() { (cd $R && ./rp.sh "$1"); }
ctl() { (cd $R && ./ctl.sh "$@"); }
OWN=0
if [ -z "${POD:-}" ]; then
  # budget (owner <= $2): only cards <= ~$0.30/h (A6000 / 4090 / SECURE 3090 were $0.5-0.7/h)
  for GC in "${GPU:-NVIDIA RTX A5000}:COMMUNITY" "NVIDIA RTX A4000:COMMUNITY" "NVIDIA RTX A5000:SECURE" "NVIDIA RTX A4000:SECURE"; do
    G=${GC%:*}; C=${GC##*:}; for _once in 1; do
      python3 $R/deploy.py "$G" $C $CTL_TOKEN_FILE 0.8.226 | sed 's/ gpus { id }//' > $W/m.gql
      rp "$(cat $W/m.gql)" > $W/deploy.json; POD=$(python3 -c "import json;d=json.load(open('$W/deploy.json'));print(((d.get('data') or {}).get('podFindAndDeployOnDemand') or {}).get('id',''))")
      echo "deploy $G $C -> pod '$POD'"; rp 'query { myself { pods { id costPerHr } } }'; echo
      [ -n "$POD" ] && break 2
    done
  done
  [ -n "$POD" ] || { echo "deploy failed: $(head -c 300 $W/deploy.json)"; exit 1; }
  OWN=1
fi
cleanup() { if [ $OWN = 1 ] && [ "${KEEP:-0}" != 1 ]; then rp "mutation { podTerminate(input: {podId: \"$POD\"}) }"; echo; fi
  [ "${KEEP:-0}" = 1 ] && echo "KEPT pod $POD (token $CTL_TOKEN_FILE): reuse with POD=$POD CTL_TOKEN_FILE=$CTL_TOKEN_FILE, terminate yourself"
  rp 'query { myself { clientBalance pods { id } } }'; echo; }
trap cleanup EXIT
echo "$POD" > $W/pod_id
UP=0; for i in $(seq 1 60); do [ "$(ctl $POD ping 2>/dev/null)" = "pong" ] && { UP=1; break; }; sleep 10; done
[ $UP = 1 ] || { echo "pod did not answer within 10 min: terminating"; exit 2; }   # BW: the trap terminates the pod
for i in $(seq 1 60); do ctl $POD tail /work/logs/setup.log 400 2>/dev/null | grep -q "SETUP DONE" && break; sleep 10; done
ctl $POD put $R/chrome_gpu_wrap.sh /work/chrome_gpu_wrap.sh; ctl $POD put $R/patch_hf_chunks_gpu.sh /work/patch_hf_chunks_gpu.sh
ctl $POD put $V/tools/pod_scene.sh /work/pod_scene.sh
ctl $POD run prep 'chmod +x /work/*.sh; bash /work/patch_hf_chunks_gpu.sh > /work/logs/patch.log 2>&1; mkdir -p /work/in /work/out; echo prepped'
sleep 5
for SA in "$@"; do
  S=${SA%%:*}; RANGE=""; [ "$SA" != "$S" ] && RANGE="${SA#*:}" && RANGE="${RANGE/-/ }"   # NAME:START-END renders only that window (troops test)
  tar czf $W/$S.tgz -C ${SCENES_DIR:-$V/scenes} $S || continue
  ctl $POD put $W/$S.tgz /work/in/$S.tgz
  ctl $POD run r$S "bash /work/pod_scene.sh $S ${WORKERS:-3} $RANGE > /work/logs/r$S.log 2>&1"
  t0=$(date +%s)
  until ctl $POD tail /work/logs/r$S.log 3 2>/dev/null | grep -q "^END"; do sleep 20; [ $(( $(date +%s) - t0 )) -gt 3600 ] && { echo "timeout $S"; break; }; done
  ctl $POD tail /work/logs/r$S.log 3
  ctl $POD get /work/out/$S.mp4 "$OUT/$S.mp4" && echo "got $S $(du -h "$OUT/$S.mp4" | cut -f1)" || { echo "FAILED $S"; ctl $POD tail /work/out/$S.log 30; }
  rm -f $W/$S.tgz
done
