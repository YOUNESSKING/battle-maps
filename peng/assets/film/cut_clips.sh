#!/bin/bash
# Cut the Peng archive clips from NARA / DoD films on archive.org (US government, public domain / CC0 / PDM).
# usage: bash assets/film/cut_clips.sh DL_DIR   (DL_DIR holds <identifier>.mp4 downloaded from https://archive.org/download/<id>/)
D=${1:-/tmp/claude-0/s/dl}; O=/home/user/battle-maps/peng/assets/film/clips; mkdir -p $O
cut(){ # name id ss len [extra vf]
  ffmpeg -v error -y -ss $3 -i $D/$2.mp4 -t $4 -an -r 30 ${5:+-vf "$5"} -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p $O/$1.mp4; }
BP=gov.archives.arc.2569442   # Big Picture: Chinese Reds Enter the Korean War (NARA 111-TV-172, CC0)
DM=gov.dod.dimoc.20269        # Combat Bulletin 106 (DoD, CC0)
cut pg_pow_faces   $BP  0:04:01 3.5
cut pg_pow_column  $BP  0:04:33 3.5
cut pg_pow_road    CB-104 0:03:00 3.5
cut pg_snow_hills  CB-105 0:02:00 3.5
cut pg_snow_burn   CB-105 0:06:43 3.5
cut pg_snow_col    CB-105 0:08:45 4.0
cut pg_snow_trucks CB-105 0:09:44 3.5
cut pg_ret_tank    111-adc-9444 0:05:50 4.0
cut pg_ret_refug   111-adc-9444 0:06:34 3.5
cut pg_ret_col     111-adc-9444 0:07:48 3.5
cut pg_ret_men     111-adc-9444 0:08:36 3.5
cut pg_ref_cart    111-adc-8631 0:02:06 3.5
cut pg_ref_river   111-adc-8631 0:02:34 4.0
cut pg_ref_stop    111-adc-8634 0:01:36 3.5
cut pg_ref_column  111-adc-8634 0:02:06 3.5
cut pg_ref_bridge  $DM  0:09:18 4.0
cut pg_sign38      $DM  0:07:18 3.0
cut pg_hungnam_fire $DM 0:06:00 3.5
cut pg_ref_inchon  428-npc-135 0:00:38 3.5
cut pg_evac_inchon 428-npc-135 0:02:46 3.5
cut pg_ridgway_jeep 111-adc-8694 0:04:24 4.0
cut pg_ridgway_hill 111-adc-8694 0:05:46 3.5
cut pg_ridgway_arrive 111-adc-8631 0:08:20 3.5
cut pg_kaesong_heli CB-112 0:04:20 3.5
cut pg_kaesong_door CB-112 0:07:36 3.5
cut pg_kaesong_exit CB-112 0:08:00 3.5
cut pg_pmj_convoy  428-npc-16383 0:02:23 3.5
