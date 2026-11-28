#!/bin/bash
# r5: join the 4 rendered windows with straight crossfades (xfade, XF s overlap, no dip to black), mux the audio made with the same XF
# (make_test_audio.py with XF=...), encode the <= 25 MB share mp4.   usage: finalize_xf.sh RENDER_DIR AUDIO.wav OUT.mp4 [XF]
set -e; R=$1; A=$2; O=$3; XF=${4:-0.25}
d() { ffprobe -v error -show_entries format=duration -of csv=p=0 $R/$1.mp4; }
dA=$(d segA); dB=$(d segB); dB2=$(d segB2)
o1=$(python3 -c "print($dA-$XF)"); o2=$(python3 -c "print($dA+$dB-2*$XF)"); o3=$(python3 -c "print($dA+$dB+$dB2-3*$XF)")
fc="[0:v]fps=30,format=yuv420p,settb=AVTB[a];[1:v]fps=30,format=yuv420p,settb=AVTB[b];[2:v]fps=30,format=yuv420p,settb=AVTB[c];[3:v]fps=30,format=yuv420p,settb=AVTB[e];"
fc="$fc[a][b]xfade=transition=fade:duration=$XF:offset=$o1[ab];[ab][c]xfade=transition=fade:duration=$XF:offset=$o2[abc];[abc][e]xfade=transition=fade:duration=$XF:offset=$o3[v]"
ffmpeg -v error -y -i $R/segA.mp4 -i $R/segB.mp4 -i $R/segB2.mp4 -i $R/segC.mp4 -i $A -filter_complex "$fc" -map "[v]" -map 4:a \
  -c:v libx264 -preset slow -crf 21 -maxrate 3400k -bufsize 6800k -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest $O
ls -la $O; ffprobe -v error -show_entries format=duration -of csv=p=0 $O
