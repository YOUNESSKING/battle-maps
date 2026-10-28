cd /home/user/battle-maps/meade
for b in penn prospect getty getty15; do
  for n in 1 2 3 4; do python3 tools/bake_hd.py $b && python3 tools/make_land.py $b && break; echo "retry $b"; sleep $((n*10)); done
done
touch logs/bake_hd2.done
