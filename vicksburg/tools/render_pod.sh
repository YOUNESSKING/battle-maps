#!/bin/bash
# Render Vicksburg scenes on ONE RunPod GPU pod (recipe: research/runpod/README.md). The key stays in $RUNPOD_API_KEY (never printed).
# usage: bash vicksburg/tools/render_pod.sh OUTDIR S05 [S07 ...]     -> OUTDIR/S05.mp4 ...; the pod is ALWAYS terminated at exit.
# Env: GPU (default "NVIDIA RTX A5000"), WORKERS (3), POD (reuse an existing pod id; then it is not terminated).
set -u
R=/home/user/battle-maps/research/runpod; V=/home/user/battle-maps/vicksburg; OUT=$1; shift; mkdir -p "$OUT"
W=/tmp/vx_pod; mkdir -p $W; export CTL_TOKEN_FILE=$W/token.txt
[ -s $CTL_TOKEN_FILE ] || python3 -c "import secrets;print(secrets.token_hex(24))" > $CTL_TOKEN_FILE
rp() { (cd $R && ./rp.sh "$1"); }
ctl() { (cd $R && ./ctl.sh "$@"); }
OWN=0
if [ -z "${POD:-}" ]; then
  for G in "${GPU:-NVIDIA RTX A5000}" "NVIDIA RTX A4500" "NVIDIA RTX A4000" "NVIDIA GeForce RTX 3090" "NVIDIA RTX 4000 Ada Generation" "NVIDIA GeForce RTX 4090" "NVIDIA RTX A6000"; do
    for C in COMMUNITY SECURE; do
      python3 $R/deploy.py "$G" $C $CTL_TOKEN_FILE 0.8.226 | sed 's/ gpus { id }//' > $W/m.gql
      rp "$(cat $W/m.gql)" > $W/deploy.json; POD=$(python3 -c "import json;d=json.load(open('$W/deploy.json'));print(((d.get('data') or {}).get('podFindAndDeployOnDemand') or {}).get('id',''))")
      echo "deploy $G $C -> pod '$POD'"; rp 'query { myself { pods { id costPerHr } } }'; echo
      [ -n "$POD" ] && break 2
    done
  done
  [ -n "$POD" ] || { echo "deploy failed: $(head -c 300 $W/deploy.json)"; exit 1; }
  OWN=1
fi
cleanup() { if [ $OWN = 1 ]; then rp "mutation { podTerminate(input: {podId: \"$POD\"}) }"; echo; fi
  rp 'query { myself { clientBalance pods { id } } }'; echo; }
trap cleanup EXIT
echo "$POD" > $W/pod_id
for i in $(seq 1 90); do [ "$(ctl $POD ping 2>/dev/null)" = "pong" ] && break; sleep 10; done
for i in $(seq 1 60); do ctl $POD tail /work/logs/setup.log 5 2>/dev/null | grep -q "SETUP DONE" && break; sleep 10; done
ctl $POD put $R/chrome_gpu_wrap.sh /work/chrome_gpu_wrap.sh; ctl $POD put $R/patch_hf_chunks_gpu.sh /work/patch_hf_chunks_gpu.sh
ctl $POD put $V/tools/pod_scene.sh /work/pod_scene.sh
ctl $POD run prep 'chmod +x /work/*.sh; bash /work/patch_hf_chunks_gpu.sh > /work/logs/patch.log 2>&1; mkdir -p /work/in /work/out; echo prepped'
sleep 5
for S in "$@"; do
  tar czf $W/$S.tgz -C $V/scenes $S || continue
  ctl $POD put $W/$S.tgz /work/in/$S.tgz
  ctl $POD run r$S "bash /work/pod_scene.sh $S ${WORKERS:-3} > /work/logs/r$S.log 2>&1"
  t0=$(date +%s)
  until ctl $POD tail /work/logs/r$S.log 3 2>/dev/null | grep -q "^END"; do sleep 20; [ $(( $(date +%s) - t0 )) -gt 3600 ] && { echo "timeout $S"; break; }; done
  ctl $POD tail /work/logs/r$S.log 3
  ctl $POD get /work/out/$S.mp4 "$OUT/$S.mp4" && echo "got $S $(du -h "$OUT/$S.mp4" | cut -f1)" || { echo "FAILED $S"; ctl $POD tail /work/out/$S.log 30; }
  rm -f $W/$S.tgz
done
