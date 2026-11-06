#!/usr/bin/env bash
# render scenes one by one and free each scene's copied assets afterwards (disk is tight). usage: bash tools/render_lean.sh SCENE...
cd "$(dirname "$0")/.."
rm -f logs/render_lean.done
for n in "$@"; do
  mkdir -p scenes/$n/renders
  echo "=== $(date -u +%T) render $n"
  (cd scenes/$n && nice -n 5 hyperframes render . -o renders/$n.mp4 > render.log 2>&1)
  if grep -q "Render complete" scenes/$n/render.log; then echo "=== $(date -u +%T) OK $n"; rm -rf scenes/$n/assets scenes/$n/snapshots scenes/$n/.hyperframes; else echo "=== $(date -u +%T) FAILED $n"; fi
done
echo "=== finished"; touch logs/render_lean.done
