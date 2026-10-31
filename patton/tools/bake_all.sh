#!/bin/bash
# Cleburne maps: bake + HD lift + land mask + DEM rivers (run from cleburne/)
set -e
cd /home/user/battle-maps/patton
bake() { n=$1; python3 tools/bake.py $n $2 $3 $4 $5; LIFT=1 python3 tools/bake_hd.py $n; }
bake chatt 34.95 -85.10 10 2.0
bake tunnel 35.07 -85.24 13 2.0
bake ringgold 34.93 -85.10 13 2.0
bake pickett 33.99 -84.79 13 2.0
bake ga 34.4 -85.3 8 2.0
python3 tools/make_land.py chatt tunnel ringgold pickett ga
for n in chatt tunnel ringgold pickett; do python3 tools/make_rivers_dem.py $n || true; done
touch logs/bake.done
