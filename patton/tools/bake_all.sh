#!/bin/bash
# Patton maps: bake + HD lift + land mask + DEM rivers (run from patton/). Look A = plain _hd_lift (owner 2026-10-31).
cd /home/user/battle-maps/patton
bake() { n=$1; python3 tools/bake.py $n $2 $3 $4 $5 && LIFT=1 python3 tools/bake_hd.py $n; }
bake ardennes 50.2 5.5 9 2.0
bake bastogne 49.85 5.75 11 2.0
bake lorraine 49.3 6.3 10 2.0
bake normandy 48.6 -0.8 9 2.0
bake avranches 48.68 -1.36 12 2.0
bake rhine 50.7 7.4 9 2.0
bake oppenheim 49.88 8.33 13 2.0
python3 tools/make_land.py ardennes bastogne lorraine normandy avranches rhine oppenheim
for n in ardennes bastogne lorraine normandy avranches rhine oppenheim; do python3 tools/make_rivers_dem.py $n || true; done
touch logs/bake.done
