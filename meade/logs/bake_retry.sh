cd /home/user/battle-maps/meade
while [ ! -f logs/bake_all.done ]; do sleep 15; done
for n in 1 2 3 4; do python3 tools/bake_hd.py penn && python3 tools/make_land.py penn && break; sleep $((n*10)); done
touch logs/bake_retry.done
