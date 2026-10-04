#!/bin/bash
# cut_clips.sh — regenerate gavin/assets/film/clips/*.mp4 from public-domain archive.org sources.
#
# Usage:
#   cd gavin/assets/film
#   bash cut_clips.sh            # downloads sources into src/ (if missing) and cuts all clips
#
# Sources are US-government / public-domain WWII archival film (NARA, Signal Corps, US Navy,
# OWI "United News" newsreels, Universal newsreels released to the public domain) on archive.org.
# See MANIFEST.md for identifiers, licence evidence, in/out timecodes and descriptions.
# Requires: curl, ffmpeg, python3.

set -e
cd "$(dirname "$0")"
mkdir -p src clips
UA="battle-maps-research/1.0 (contact: younessfakiri123@gmail.com)"

dl() {
  # dl IDENTIFIER REMOTE_FILENAME LOCAL_FILENAME
  id="$1"; remote="$2"; local="$3"
  if [ -s "src/$local" ]; then echo "skip src/$local"; return; fi
  echo "downloading $id -> src/$local"
  for i in 1 2 3; do
    curl -sS -L -A "$UA" -o "src/$local" \
      "https://archive.org/download/$id/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$remote")" \
      && [ -s "src/$local" ] && break
    echo "retry $id ($i)"; sleep $((i*5))
  done
}

# --- download sources (~1.5 GB total) ---
dl 1946-01-14_82nd_Airborne_Parades_for_GI_Victory 1946-01-14_82nd_Airborne_Parades_for_GI_Victory.mp4 parade82.mp4
dl ADC-9948   ADC-9948.mp4   ADC-9948.mp4
dl ARC-38910  ARC-38910.mp4  ARC-38910.mp4
dl ARC-38922  ARC-38922.mp4  ARC-38922.mp4
dl ARC-39014  ARC-39014.mp4  ARC-39014.mp4
dl ARC-39048  ARC-39048.mp4  ARC-39048.mp4
dl ADC-2325   ADC-2325.mp4   ADC-2325.mp4
dl ADC-2342c  ADC-2342c.mp4  ADC-2342c.mp4
dl ADC-2043   ADC-2043.mp4   ADC-2043.mp4
dl DDayMinu1945 DDayMinu1945.mp4 DDayMinu1945.mp4
dl ADC-1577b  ADC-1577b.mp4  ADC-1577b.mp4
dl ADC-1577d  ADC-1577d.mp4  ADC-1577d.mp4
dl CB-22      "CB-22 Combat Bulletin 22 1944.mp4" CB-22.mp4
dl CB-28      CB-28.mp4      CB-28.mp4
dl 1944-09-28_Battle_Rages_Along_Nazi_Wall 1944-09-28_Battle_Rages_Along_Nazi_Wall.mp4 nazi_wall.mp4
dl NPC-15676  NPC-15676.mp4  NPC-15676.mp4
dl NPC-1913   NPC-1913.mp4   NPC-1913.mp4
dl 428-npc-981  428-npc-981.mp4  428-npc-981.mp4
dl 428-npc-1088 428-npc-1088.mp4 428-npc-1088.mp4
dl NPC-15743  NPC-15743.mp4  NPC-15743.mp4

# --- cut: 1920x1080, 30 fps, libx264 crf20, no audio; 4:3 sources letterboxed (pillarbox) ---
VF_BASE="scale='iw*sar':'ih',setsar=1,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,fps=30"
cut() {   # cut SRC IN_SECONDS DURATION OUT
  ffmpeg -y -loglevel error -ss "$2" -i "src/$1" -t "$3" -vf "$VF_BASE" \
    -an -c:v libx264 -crf 20 -pix_fmt yuv420p "clips/$4"
}
cutc() {  # same, but first crops away the burned-in RTC timecode strip (NPC-1913, 640x360)
  ffmpeg -y -loglevel error -ss "$2" -i "src/$1" -t "$3" -vf "crop=499:281:70:0,$VF_BASE" \
    -an -c:v libx264 -crf 20 -pix_fmt yuv420p "clips/$4"
}

# 1. AIRBORNE TRAINING (US Army airborne training newsreels 1942-45)
cut ARC-38910.mp4  80 7 airborne_training_01.mp4
cut ARC-38910.mp4  88 7 airborne_training_02.mp4
cut ARC-38910.mp4  40 7 airborne_training_03.mp4
cut ARC-39014.mp4 420 7 airborne_training_04.mp4
cut ARC-39014.mp4 475 7 airborne_training_05.mp4
cut ARC-39014.mp4 514 7 airborne_training_06.mp4
cut ARC-38922.mp4 462 7 airborne_training_07.mp4
cut ARC-38922.mp4 478 7 airborne_training_08.mp4
cut ARC-39048.mp4  32 7 airborne_training_09.mp4
cut ARC-39048.mp4  86 7 airborne_training_10.mp4
cut ARC-39048.mp4  96 7 airborne_training_11.mp4
cut ARC-38922.mp4 516 7 airborne_training_12.mp4

# 2. SICILY / Mediterranean amphibious (US Navy NPC film)
cut 428-npc-981.mp4  132 7 sicily_ships_01.mp4
cut 428-npc-981.mp4  144 7 sicily_ships_02.mp4
cut 428-npc-981.mp4  192 7 sicily_smoke_01.mp4
cut 428-npc-981.mp4  252 7 sicily_smoke_02.mp4
cut 428-npc-1088.mp4 125 7 sicily_convoy_01.mp4
cut 428-npc-1088.mp4 132 7 sicily_convoy_02.mp4
cut 428-npc-1088.mp4 204 7 sicily_convoy_03.mp4
cut 428-npc-1088.mp4 320 7 sicily_shore_01.mp4
cut NPC-15676.mp4    372 7 sicily_troops_01.mp4
cut NPC-15676.mp4    396 7 sicily_landingcraft_01.mp4
cut NPC-15676.mp4    444 7 sicily_landingcraft_02.mp4
cutc NPC-1913.mp4    180 7 sicily_palermo_01.mp4
cutc NPC-1913.mp4    252 7 sicily_palermo_02.mp4
cutc NPC-1913.mp4    408 7 sicily_palermo_03.mp4

# 3. NORMANDY AIRBORNE (Army Air Forces "D-Day Minus One", Signal Corps, Navy)
cut DDayMinu1945.mp4 300 7 normandy_c47_01.mp4
cut DDayMinu1945.mp4 360 7 normandy_ike_01.mp4
cut DDayMinu1945.mp4 400 7 normandy_march_01.mp4
cut DDayMinu1945.mp4 420 7 normandy_march_02.mp4
cut DDayMinu1945.mp4 450 7 normandy_faces_01.mp4
cut DDayMinu1945.mp4 476 7 normandy_boarding_01.mp4
cut DDayMinu1945.mp4 516 7 normandy_dusk_01.mp4
cut DDayMinu1945.mp4 550 7 normandy_dusk_02.mp4
cut DDayMinu1945.mp4 619 7 normandy_drop_01.mp4
cut DDayMinu1945.mp4 636 7 normandy_planes_01.mp4
cut DDayMinu1945.mp4 700 7 normandy_aerial_01.mp4
cut DDayMinu1945.mp4 718 7 normandy_glider_01.mp4
cut DDayMinu1945.mp4 760 7 normandy_gliders_air_01.mp4
cut DDayMinu1945.mp4 868 7 normandy_gliders_air_02.mp4
cut DDayMinu1945.mp4 900 7 normandy_glider_wreck_01.mp4
cut DDayMinu1945.mp4 916 7 normandy_glider_wreck_02.mp4
cut DDayMinu1945.mp4 966 6 normandy_roadsign_01.mp4
cut ADC-1577d.mp4      5 7 normandy_amfreville_01.mp4
cut ADC-1577d.mp4     24 7 normandy_amfreville_02.mp4
cut ADC-1577b.mp4      0 7 normandy_carentan_01.mp4
cut ADC-1577b.mp4      9 7 normandy_carentan_02.mp4
cut NPC-15743.mp4    100 8 normandy_beach_01.mp4
cut NPC-15743.mp4    280 7 normandy_beach_02.mp4
cut NPC-15743.mp4    114 7 normandy_beach_03.mp4
cut ADC-2043.mp4       0 7 normandy_greenham_01.mp4
cut ADC-2043.mp4      20 7 normandy_greenham_02.mp4

# 4. MARKET GARDEN (Sept 1944)
cut ADC-2325.mp4  33 7 mg_gliders_01.mp4
cut ADC-2325.mp4  84 7 mg_gliders_02.mp4
cut ADC-2325.mp4 156 7 mg_paras_march_01.mp4
cut ADC-2325.mp4 182 7 mg_c47_01.mp4
cut ADC-2325.mp4 200 7 mg_c47_02.mp4
cut ADC-2325.mp4 258 7 mg_flight_01.mp4
cut ADC-2325.mp4 270 7 mg_flight_02.mp4
cut ADC-2325.mp4 418 7 mg_flight_03.mp4
cut ADC-2342c.mp4 24 7 mg_landing_01.mp4
cut ADC-2342c.mp4 42 7 mg_drop_01.mp4
cut ADC-2342c.mp4 52 7 mg_drop_02.mp4
cut ADC-2342c.mp4 63 7 mg_landing_02.mp4
cut CB-22.mp4   1232 7 mg_assemble_01.mp4
cut CB-22.mp4   1263 7 mg_c47_03.mp4
cut CB-22.mp4   1289 7 mg_takeoff_01.mp4
cut CB-22.mp4   1322 7 mg_flight_04.mp4
cut CB-22.mp4   1409 7 mg_gliders_03.mp4
cut CB-22.mp4   1426 7 mg_gliders_04.mp4
cut CB-22.mp4   1438 7 mg_flight_05.mp4
cut CB-22.mp4   1502 7 mg_glider_landing_01.mp4
cut CB-22.mp4   1524 7 mg_landing_03.mp4
cut CB-22.mp4   1531 7 mg_landing_04.mp4
cut nazi_wall.mp4  5 7 mg_airtrain_01.mp4
cut nazi_wall.mp4 27 6 mg_airtrain_02.mp4
cut nazi_wall.mp4 38 7 mg_chutes_01.mp4
cut nazi_wall.mp4 44 7 mg_sherman_01.mp4
cut CB-28.mp4   35 7 mg_sherman_02.mp4
cut CB-28.mp4   55 7 mg_sherman_03.mp4
cut CB-28.mp4   65 7 mg_gun_01.mp4
cut CB-28.mp4   98 7 mg_boats_01.mp4
cut CB-28.mp4  214 7 mg_gliders_05.mp4
cut CB-28.mp4  257 7 mg_gliders_06.mp4

# 5. GAVIN / 82nd Airborne victory parade, New York, 12 Jan 1946
cut ADC-9948.mp4   6 7 gavin_parade_01.mp4
cut ADC-9948.mp4  13 7 gavin_parade_02.mp4
cut ADC-9948.mp4  25 7 gavin_parade_03.mp4
cut ADC-9948.mp4  35 7 gavin_parade_04.mp4
cut ADC-9948.mp4  45 7 gavin_parade_05.mp4
cut ADC-9948.mp4  55 7 gavin_parade_06.mp4
cut ADC-9948.mp4 103 7 gavin_parade_07.mp4
cut ADC-9948.mp4 128 7 gavin_parade_08.mp4
cut ADC-9948.mp4 138 7 gavin_parade_09.mp4
cut ADC-9948.mp4 165 7 gavin_parade_10.mp4
cut parade82.mp4   5 7 gavin_parade_11.mp4
cut parade82.mp4  14 7 gavin_parade_12.mp4
cut parade82.mp4  20 7 gavin_parade_13.mp4
cut parade82.mp4  64 7 gavin_parade_14.mp4
cut parade82.mp4  69 7 gavin_parade_15.mp4
cut parade82.mp4  85 7 gavin_parade_16.mp4
echo "done: $(ls clips | wc -l) clips"
