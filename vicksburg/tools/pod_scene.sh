#!/bin/bash
# ON THE POD: render one Vicksburg scene from its tar. usage: pod_scene.sh NAME [WORKERS] [START END]
# expects /work/in/NAME.tgz (tar of vicksburg/scenes/NAME); writes /work/out/NAME.mp4 + .log; prints END rc=...
N=$1; W=${2:-3}; mkdir -p /work/scenes /work/out; rm -rf /work/scenes/$N; tar xzf /work/in/$N.tgz -C /work/scenes; cd /work/scenes/$N || exit 9
D=$(python3 -c "import json;print(json.load(open('cues.json'))['D'])"); S=${3:-0}; E=${4:-$D}
t0=$(date +%s); echo "start $N $S-$E w$W $(date +%T)"
HYPERFRAMES_BROWSER_PATH=/work/chrome_gpu_wrap.sh hyperframes render . --start $S --end $E --workers $W --quality looks --browser-gpu -o /work/out/$N.mp4 > /work/out/$N.log 2>&1; rc=$?
t1=$(date +%s); rm -rf /root/.cache/hyperframes/history/* renders/.hf-segments 2>/dev/null
echo "END rc=$rc $N seconds=$((t1-t0)) $(date +%T)"
