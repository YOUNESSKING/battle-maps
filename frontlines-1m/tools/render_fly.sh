#!/usr/bin/env bash
# render the 9.5 s flyover pages (their data-duration is patched after build_scene) detached; marker logs/render_fly.done
cd "$(dirname "$0")/.."; rm -f logs/render_fly.done
for n in "$@"; do (cd scenes/$n && hyperframes render . -o renders/$n.mp4 > render.log 2>&1 < /dev/null); grep -q "Render complete" scenes/$n/render.log && echo "OK $n" || echo "FAIL $n"; done
touch logs/render_fly.done
