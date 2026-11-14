#!/bin/bash
# Marion basemaps: relief + HD lift + land mask (Style W inputs). One map at a time (an out-of-memory kill leaves a half-baked map).
# Rivers come from NHD by name (kit/fetch_rivers.py) + the TIGER county lines for the 1780 Santee (kit/PLACES.md); no det_* layers needed.
cd /home/user/battle-maps/marion
bake() { n=$1; [ -f logs/$n.done ] && return; python3 tools/bake.py $n $2 $3 $4 $5 && LIFT=1 python3 tools/bake_hd.py $n \
  && cp assets/${n}_hd_lift.jpg assets/${n}_hd_lift_plain.jpg && python3 tools/make_land.py $n && touch logs/$n.done; }
mkdir -p assets/src logs
for m in "$@"; do
  case $m in
    lowcountry) bake lowcountry 33.55 -80.15 10 2.0 ;;
    santee)     bake santee 33.47 -80.35 13 2.0 ;;
    blackriver) bake blackriver 33.72 -80.12 12 2.0 ;;   # widened west for Richardson's (Rimini) .. Kingstree (kit/PLACES.md)
    blackmingo) bake blackmingo 33.63 -79.47 13 2.0 ;;   # NEW: Black Mingo / Shepherd's Ferry + the plank bridge (off the blackriver map)
    congaree)   bake congaree 33.75 -80.66 13 2.0 ;;
    edisto)     bake edisto 32.86 -80.40 13 2.0 ;;
  esac
done
