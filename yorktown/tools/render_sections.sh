#!/usr/bin/env bash
# Fast, reboot-safe render (owner 2026-11-11): each built scene is rendered in ~30 s sections with
# `hyperframes render --start/--end` (static map layers are already baked into the _m basemaps), then the
# sections are joined into scenes/<n>/renders/<n>.mp4 (+ render.log "Render complete" for assemble_full.py).
# Finished sections are kept, so a relaunch after a reboot only renders what is missing.
# usage: bash tools/render_sections.sh SCENE [SCENE ...]   progress logs/render_sections.log, marker logs/render_sections.done
cd "$(dirname "$0")/.."
if [ -z "${RS_DETACHED:-}" ]; then rm -f logs/render_sections.done; RS_DETACHED=1 setsid nohup bash "$0" "$@" > logs/render_sections.log 2>&1 < /dev/null & echo started $!; exit 0; fi
SEC=${SEC:-30}
# purge the hyperframes history cache while rendering (it grows to GBs)
( while [ ! -f logs/render_sections.done ]; do rm -rf /root/.cache/hyperframes/history 2>/dev/null; sleep 120; done ) &
F=0
for n in "$@"; do
  out=scenes/$n/renders/$n.mp4
  if [ -s $out ] && grep -q "Render complete" scenes/$n/render.log 2>/dev/null; then echo "skip $n"; continue; fi
  dur=$(grep -o 'data-duration="[0-9.]*"' scenes/$n/index.html | head -1 | grep -o '[0-9.]*')
  mkdir -p scenes/$n/renders/sec; : > scenes/$n/renders/sec/list.txt
  k=0; s=0
  while python3 -c "import sys; sys.exit(0 if $s < $dur - 0.01 else 1)"; do
    e=$(python3 -c "print(min($s + $SEC, $dur))")
    f=scenes/$n/renders/sec/s$(printf %03d $k).mp4
    if [ ! -s $f ]; then
      echo "=== $(date -u +%T) $n section $k [$s, $e]"
      (cd scenes/$n && nice -n 5 hyperframes render . --start $s --end $e -o renders/sec/tmp.mp4 > renders/sec/log_$k.txt 2>&1) \
        && mv scenes/$n/renders/sec/tmp.mp4 $f || { echo "FAILED $n section $k"; F=1; break; }
    fi
    echo "file 's$(printf %03d $k).mp4'" >> scenes/$n/renders/sec/list.txt
    k=$((k+1)); s=$e
  done
  if [ $F = 0 ]; then
    ffmpeg -y -loglevel error -f concat -safe 0 -i scenes/$n/renders/sec/list.txt -c copy $out \
      && echo "Render complete (sections)" > scenes/$n/render.log && echo "=== $(date -u +%T) OK $n" || { echo "FAILED concat $n"; F=1; }
  fi
done
echo "=== $(date -u +%T) finished failed=$F"; echo "failed=$F" > logs/render_sections.done
