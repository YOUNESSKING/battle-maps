#!/bin/bash
# Cut the Collins archive clips from the NARA films on archive.org (US government, public domain).
# usage: bash assets/film/cut_clips.sh DL_DIR   (DL_DIR holds <identifier>.mp4 downloaded from https://archive.org/download/<id>/<id>.mp4)
D=${1:-/tmp/claude-0/s/dl}; O=/home/user/battle-maps/collins/assets/film/clips; mkdir -p $O
cut(){ # name id ss len [extra vf]
  ffmpeg -v error -y -ss $3 -i $D/$2.mp4 -t $4 -an -r 30 ${5:+-vf "$5"} -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p $O/$1.mp4; }
cut p4_gc_air   428-npc-90   0:00:07  5.0
cut p4_gc_gis   428-npc-90   0:02:16  5.0
cut p4_sol_beach 111-adc-5230 0:03:28 5.0
cut p4_ike      ARC-39153    0:04:26  4.0
cut p4_collins  111-adc-2651 0:01:40  4.5
cut p4_utah     NPC-4359     0:03:46  4.0 "crop=iw:ih*0.80:0:ih*0.12"   # drops letterbox + burned-in timecode
cut p35_snow    ARC-39153    0:06:34  4.0
cut p35_armor   111-adc-2131 0:00:44  3.5
cut p35_elbe    111-adc-4056 0:00:33  5.0
