#!/bin/bash
# Grant maps, v11 look (run from anywhere). bake -> HD elevation -> detail layers -> ref_look_v11 FULL -> land mask -> DEM rivers
cd /home/user/battle-maps/grant
bake() { n=$1; python3 tools/bake.py $n $2 $3 $4 $5 && LIFT=1 python3 tools/bake_hd.py $n && python3 tools/make_detail_layers.py $n && FULL=1 python3 tools/ref_look_v11.py $n 2880 1620 assets/${n}_hd_lift.jpg && touch logs/$n.done; }
bake donelson 36.48 -87.85 13 2.0
bake henry 36.50 -87.95 11 2.0
bake tennessee 36.70 -87.90 9 2.0
bake vicksburg 32.20 -90.80 10 2.0
bake grandgulf 31.98 -91.02 12 2.0
bake vicksburg_siege 32.33 -90.87 12 2.0
bake mississippi 33.00 -90.80 8 2.0
bake jamesriver 37.30 -77.05 12 2.0
bake petersburg 37.24 -77.38 12 2.0
bake richmond 37.60 -77.30 9 2.0
python3 tools/make_land.py donelson henry tennessee vicksburg grandgulf vicksburg_siege mississippi jamesriver petersburg richmond
for n in donelson henry tennessee vicksburg grandgulf vicksburg_siege mississippi jamesriver petersburg richmond; do python3 tools/make_rivers_dem.py $n || true; done
touch logs/bake.done
