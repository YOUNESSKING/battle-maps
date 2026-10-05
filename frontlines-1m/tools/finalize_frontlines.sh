#!/usr/bin/env bash
# Frontlines-edition test: assemble build/gavin-frontlines.mp4 (+720p) with tinted restored film, depth parallax, date cards and the
# three 3D flyovers, then the same loudness pass as the master. Detached; log logs/finalize_fl.log, marker logs/finalize_fl.done
set -u
cd "$(dirname "$0")/.."
if [ -z "${FL_DETACHED:-}" ]; then
  mkdir -p logs; rm -f logs/finalize_fl.done
  FL_DETACHED=1 setsid nohup bash "$0" > logs/finalize_fl.log 2>&1 < /dev/null &
  echo "finalize_frontlines started (pid $!)"; exit 0
fi
export NAME=gavin-frontlines ARCHIVE=build/frontlines/archive_frontlines.json
export FLY='{"move1-1": "scenes/fly1/renders/fly1.mp4", "move2-1": "scenes/fly2/renders/fly2.mp4", "move3-1": "scenes/fly3/renders/fly3.mp4"}'
ok=1
python3 tools/assemble_full.py || ok=0
python3 tools/assemble_full.py --preview || ok=0
if [ $ok = 1 ]; then
  ffmpeg -v error -y -i build/mix.wav -af "volume=11.8dB,alimiter=limit=0.8:attack=2:release=80:level=false,aresample=48000" -c:a pcm_s16le build/mix_final_fl.wav || ok=0
  for H in 1080 720; do
    OUT=$([ $H = 1080 ] && echo build/gavin-frontlines.mp4 || echo build/gavin-frontlines-720p.mp4)
    D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 build/gavin-frontlines_video_only_${H}p.mp4)
    ffmpeg -v error -y -i build/gavin-frontlines_video_only_${H}p.mp4 -i build/mix_final_fl.wav -map 0:v -map 1:a -t "$D" -c:v copy -c:a aac -b:a 192k -movflags +faststart build/tmpfl_$H.mp4 && mv build/tmpfl_$H.mp4 $OUT || ok=0
  done
fi
echo "ok=$ok" > logs/finalize_fl.done
