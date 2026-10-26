#!/usr/bin/env bash
# Re-render the given scenes, then rebuild the master (finalize.sh) and the Frontlines edition (finalize_frontlines.sh), one after the other.
# Detached; log logs/rebuild_both.log, marker logs/rebuild_both.done.  usage: bash tools/rebuild_both.sh "SCENE MAP FIRST LAST" ...
set -u
cd "$(dirname "$0")/.."
if [ -z "${RB_DETACHED:-}" ]; then
  mkdir -p logs; rm -f logs/rebuild_both.done
  RB_DETACHED=1 setsid nohup bash "$0" "$@" > logs/rebuild_both.log 2>&1 < /dev/null &
  echo "rebuild_both started (pid $!)"; exit 0
fi
waitfor() { while [ ! -f "$1" ]; do sleep 15; done; }
ok=1
if [ $# -gt 0 ]; then bash tools/render_all.sh "$@"; waitfor logs/render_all.done; cat logs/render_all.log; grep -q "failed=0" logs/render_all.done || ok=0; fi
if [ $ok = 1 ]; then bash tools/finalize.sh; waitfor logs/finalize.done; cat logs/finalize.done; grep -q "ok=1" logs/finalize.done || ok=0; fi
if [ $ok = 1 ]; then bash tools/finalize_frontlines.sh; waitfor logs/finalize_fl.done; cat logs/finalize_fl.done; grep -q "ok=1" logs/finalize_fl.done || ok=0; fi
echo "ok=$ok" > logs/rebuild_both.done
