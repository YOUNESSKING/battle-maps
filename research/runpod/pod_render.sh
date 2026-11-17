#!/bin/bash
# usage (on pod): pod_render.sh START END WORKERS TAG [extra hyperframes args]  -> /work/out/TAG.mp4, /work/out/TAG.log, /work/out/TAG.gpu.csv
S=$1 E=$2 W=$3 TAG=$4; shift 4; mkdir -p /work/out; cd /work/clip
nvidia-smi --query-gpu=timestamp,utilization.gpu,memory.used --format=csv,noheader -l 2 > /work/out/$TAG.gpu.csv & SMI=$!
t0=$(date +%s); echo "start $(date +%T) $S-$E w$W $*"
hyperframes render . --start $S --end $E --workers $W --quality looks --browser-gpu "$@" -o /work/out/$TAG.mp4 > /work/out/$TAG.log 2>&1; rc=$?
t1=$(date +%s); kill $SMI; rm -rf /root/.cache/hyperframes/history/* renders/.hf-segments 2>/dev/null
echo "END rc=$rc $TAG seconds=$((t1-t0)) $(date +%T)"; nproc; free -g | head -2
