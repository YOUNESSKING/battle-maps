#!/bin/bash
# cut_clips.sh — regenerate smith/assets/film/clips/*.mp4 from public-domain archive.org sources.
#
# Usage:
#   cd smith/assets/film
#   bash cut_clips.sh            # downloads sources into src/ (if missing) and cuts all clips
#
# Sources are US government / public-domain Korean War archival film (National Archives via
# archive.org's FedFlix / opensource_movies collections). See MANIFEST.md for full source
# identifiers, in/out timecodes and one-line descriptions of each clip.
#
# Requires: curl, ffmpeg, ffprobe.

set -e
cd "$(dirname "$0")"
mkdir -p src clips
UA="battle-maps-research/1.0 (contact: younessfakiri123@gmail.com)"

dl() {
  # dl IDENTIFIER REMOTE_FILENAME LOCAL_FILENAME
  id="$1"; remote="$2"; local="$3"
  if [ -f "src/$local" ] && [ -s "src/$local" ]; then
    echo "skip src/$local (already downloaded)"
    return
  fi
  echo "downloading $id -> src/$local"
  for i in 1 2 3; do
    curl -sS -L -A "$UA" -o "src/$local" \
      "https://archive.org/download/$id/$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$remote")" \
      && [ -s "src/$local" ] && break
    echo "retry $id ($i)"; sleep $((i*5))
  done
}

# --- download sources (~1.3 GB total) ---
dl 111-adc-8251 "111-adc-8251.mp4"              111-adc-8251.mp4
dl 111-adc-8289 "111-adc-8289.mp4"              111-adc-8289.mp4
dl 111-adc-8328 "111-adc-8328.mp4"              111-adc-8328.mp4
dl 111-adc-8579 "111-adc-8579.mp4"              111-adc-8579.mp4
dl 111-adc-8580 "111-adc-8580.mp4"              111-adc-8580.mp4
dl 111-adc-8632 "111-adc-8632.mp4"              111-adc-8632.mp4
dl 428-npc-173  "428-npc-173.mp4"               428-npc-173.mp4
dl ADC-10271    "ADC-10271.mp4"                 ADC-10271.mp4
dl ADC-9438     "ADC-9438.mp4"                  ADC-9438.mp4
dl ADC-9439     "ADC-9439.mp4"                  ADC-9439.mp4
dl TheHungnamStory "The Hungnam Story 1950.mp4" hungnam_story.mp4

# --- cut clips: 1920x1080, 30fps, libx264 crf20, no audio ---
# normalizes non-square-pixel 4:3 NARA transfers (SAR 10:11) to square pixels first,
# then letterboxes/pillarboxes to 16:9.
cut() {
  src="$1"; in="$2"; dur="$3"; out="$4"
  ffmpeg -y -loglevel error -ss "$in" -i "src/$src" -t "$dur" \
    -vf "scale='iw*sar':'ih',setsar=1,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,fps=30" \
    -an -c:v libx264 -crf 20 -pix_fmt yuv420p "clips/$out"
}

# INCHON
cut 111-adc-8289.mp4  54  12 inchon_wolmido_01.mp4     # destroyer firing on Inchon/Wolmi-do
cut 111-adc-8289.mp4 186  12 inchon_wolmido_02.mp4     # shell splashes / smoke, naval bombardment
cut 111-adc-8289.mp4 206  12 inchon_ships_01.mp4       # LST beached, unloading beach materiel
cut 111-adc-8328.mp4   6  12 inchon_seawall_01.mp4     # Marines climbing down cargo nets into landing craft
cut 111-adc-8328.mp4 118  12 inchon_city_01.mp4        # flag ceremony, Seoul Capitol building, crowds
cut 111-adc-8328.mp4 422  12 macarthur_01.mp4          # MacArthur/dignitaries at podium, Seoul turnover ceremony
cut 111-adc-8251.mp4  60  12 macarthur_02.mp4          # MacArthur ashore meeting officers at Inchon
cut 111-adc-8251.mp4 140  12 officers_01.mp4           # MacArthur and staff officers conferring outdoors

# CHOSIN
cut 111-adc-8579.mp4 128  12 chosin_snow_march_01.mp4  # Marine column marching through snowy mountain pass
cut ADC-10271.mp4     32  12 chosin_snow_march_02.mp4  # column marching in snowy valley
cut hungnam_story.mp4 568 12 chosin_snow_march_03.mp4  # clean shot of Marine column marching
cut ADC-10271.mp4    578  10 chosin_cold_01.mp4        # Marines prone in snow with rifles, hunkered down
cut 111-adc-8579.mp4 180  12 chosin_cold_02.mp4        # Marines close-up in cold weather gear
cut ADC-9439.mp4     160  12 hagaru_airstrip_01.mp4    # C-119/C-47 taxiing on snow airstrip
cut ADC-9439.mp4     440  12 hagaru_airstrip_02.mp4    # wounded on stretcher loaded into plane door
cut ADC-10271.mp4    224  12 hagaru_airstrip_03.mp4    # C-47 taxiing close-up on runway
cut 111-adc-8328.mp4 448  12 corsair_01.mp4            # Corsair (VMF-212) taxi and takeoff, Kimpo airfield
cut 111-adc-8328.mp4 466  12 corsair_02.mp4            # Corsairs parked close-up, props spinning, ground crew
cut ADC-10271.mp4    352  12 airdrop_01.mp4            # C-119 crew at open cargo door, aerial resupply drop
cut 111-adc-8580.mp4  24  12 vehicles_dead_01.mp4      # destroyed/wrecked vehicles buried in snow
cut 111-adc-8632.mp4    8 12 artillery_snow_01.mp4     # howitzers firing in snow near buildings
cut ADC-10271.mp4     96  12 foxholes_snow_01.mp4      # Marines in foxholes/trench positions

# HUNGNAM
cut ADC-9438.mp4      24  12 hungnam_ships_01.mp4      # transports/merchant ships at Hungnam harbor
cut ADC-9438.mp4     200  12 hungnam_ships_02.mp4      # LVTs/amtracs moving at dockside, cargo
cut 111-adc-8632.mp4 300  12 hungnam_explosion_01.mp4  # explosion/smoke plume, port demolition Dec 24-25
cut 111-adc-8632.mp4 352  12 hungnam_explosion_02.mp4  # explosion clusters over harbor with ships
cut 428-npc-173.mp4  248  12 hungnam_explosion_03.mp4  # mushroom-cloud explosion, bombardment of Hungnam Dec 9

echo "done. clips written to clips/"
