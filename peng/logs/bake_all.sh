cd /home/user/battle-maps/peng
for spec in "korea 38.6 127.0 7" "nwkorea 39.9 126.0 9" "seoul 37.4 127.0 10" "unsan 39.98 125.85 12" "kunuri 39.5 125.93 12"; do
  set -- $spec
  python3 tools/bake.py $1 $2 $3 $4 > logs/bake_$1.log 2>&1
  python3 tools/bake_hd.py $1 > logs/hd_$1.log 2>&1
  python3 tools/make_land.py $1 >> logs/bake_$1.log 2>&1
done
touch logs/bake.done
