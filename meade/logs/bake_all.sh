cd /home/user/battle-maps/meade
for spec in "penn 39.40 -77.60 9" "prospect 38.258 -77.432 14" "getty 39.812 -77.235 14" "getty15 39.804 -77.238 15"; do
  set -- $spec
  python3 tools/bake.py $1 $2 $3 $4 && python3 tools/bake_hd.py $1 && python3 tools/make_land.py $1 || echo "FAIL $1"
done
touch logs/bake_all.done
