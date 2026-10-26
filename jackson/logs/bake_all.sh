cd /home/user/battle-maps/jackson
for spec in "valley 38.95 -78.40 10" "portrep 38.33 -78.82 12" "nova 38.60 -77.70 10" "bullrun 38.815 -77.56 13" "chanc 38.305 -77.665 13"; do
  set -- $spec
  python3 tools/bake.py $1 $2 $3 $4 && python3 tools/bake_hd.py $1 && python3 tools/make_land.py $1 || echo "FAIL $1"
done
python3 tools/make_land.py virginia || echo "FAIL land virginia"
