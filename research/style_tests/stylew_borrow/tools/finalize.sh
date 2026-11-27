#!/bin/bash
# Join the 4 rendered windows (0.08 s fades at the joins), mux the test audio, encode the <= 25 MB share mp4.
# usage: finalize.sh RENDER_DIR AUDIO.wav OUT.mp4   (RENDER_DIR: segA segB segB2 segC .mp4 from hyperframes render --start/--end)
set -e; R=$1; A=$2; O=$3; F=0.08
ins=""; fc=""; i=0
for s in segA segB segB2 segC; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $R/$s.mp4)
  ins="$ins -i $R/$s.mp4"
  FI=""; [ $i -gt 0 ] && FI="fade=t=in:st=0:d=$F,"   # r4: no fade from black on the first frame (clean frame 0)
  fc="$fc[$i:v]fps=30,format=yuv420p,${FI}fade=t=out:st=$(python3 -c "print($d-$F)"):d=$F[v$i];"; i=$((i+1))
done
fc="$fc[v0][v1][v2][v3]concat=n=4:v=1:a=0[v]"
ffmpeg -v error -y $ins -i $A -filter_complex "$fc" -map "[v]" -map 4:a -c:v libx264 -preset slow -crf 21 -maxrate 3400k -bufsize 6800k \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest $O
ls -la $O; ffprobe -v error -show_entries format=duration -of csv=p=0 $O
