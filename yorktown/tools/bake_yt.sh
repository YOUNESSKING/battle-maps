#!/bin/bash
# Yorktown basemaps: relief + HD lift + river/detail layers (Style W inputs). One map at a time.
cd /home/user/battle-maps/yorktown
bake() { n=$1; [ -f logs/$n.done ] && return; python3 tools/bake.py $n $2 $3 $4 $5 && LIFT=1 python3 tools/bake_hd.py $n \
  && cp assets/${n}_hd_lift.jpg assets/${n}_hd_lift_plain.jpg \
  && (NO_RESERVOIR=1 python3 tools/make_detail_layers.py $n; NO_RESERVOIR=1 SIMPLE=1 python3 tools/make_detail_layers.py $n; true) && touch logs/$n.done; }
mkdir -p assets/src
bake yorktown 37.232 -76.505 14 2.0
bake peninsula 37.250 -76.620 12 2.0
bake chesapeake 37.100 -76.100 10 2.0
bake east 39.300 -74.500 8 2.0
python3 tools/make_land.py yorktown peninsula chesapeake east
touch logs/bake.done
