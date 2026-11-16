#!/bin/bash
# Render the clip in 11 s chunks (a crash only loses one chunk), then concat losslessly. usage: bash render_chunks.sh OUTDIR [chunk indexes...]
cd "$(dirname "$0")"; OUT=${1:-/tmp/gm3d_chunks}; shift; mkdir -p "$OUT"
IDX=${@:-0 1 2 3 4 5}
for i in $IDX; do
  s=$((i*11)); e=$((s+11)); [ $e -gt 66 ] && e=66
  rm -rf /root/.cache/hyperframes/history/* 2>/dev/null
  echo "chunk $i $s-$e start $(date +%T)"
  timeout 3600 npx hyperframes render . --start $s --end $e --workers 3 --quality looks -o "$OUT/c$i.mp4" > "$OUT/c$i.log" 2>&1 && echo "chunk $i done $(date +%T)" || echo "chunk $i FAILED $(date +%T)"
  rm -rf renders/.hf-segments 2>/dev/null
done
rm -rf /root/.cache/hyperframes/history/* 2>/dev/null
echo ALLDONE
