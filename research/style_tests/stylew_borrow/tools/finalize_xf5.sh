#!/bin/bash
# r9: join the 5 rendered windows (segA segB segB2 segD segC: hook, name slam, title, Fort Motte cannon, Parker's Ferry) with straight
# crossfades (xfade, XF s), mux the audio made with the same XF (make_test_audio.py), encode the <= 25 MB share mp4.
# usage: finalize_xf5.sh RENDER_DIR AUDIO.wav OUT.mp4 [XF]
set -e; R=$1; A=$2; O=$3; XF=${4:-0.25}; S=(segA segB segB2 segD segC)
d() { ffprobe -v error -show_entries format=duration -of csv=p=0 $R/$1.mp4; }
ins=""; fc=""; acc=0; prev="v0"
for i in 0 1 2 3 4; do ins="$ins -i $R/${S[$i]}.mp4"; fc="$fc[$i:v]fps=30,format=yuv420p,settb=AVTB[v$i];"; done
for i in 1 2 3 4; do acc=$(python3 -c "print($acc+$(d ${S[$((i-1))]})-$XF)"); fc="$fc[$prev][v$i]xfade=transition=fade:duration=$XF:offset=$acc[x$i];"; prev="x$i"; done
ffmpeg -v error -y $ins -i $A -filter_complex "${fc%;}" -map "[$prev]" -map 5:a \
  -c:v libx264 -preset slow -crf 22 -maxrate 3200k -bufsize 6400k -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest $O
ls -la $O; ffprobe -v error -show_entries format=duration -of csv=p=0 $O
