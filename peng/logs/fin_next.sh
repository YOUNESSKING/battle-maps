cd /home/user/battle-maps/peng
while [ ! -f logs/render_all.done ]; do sleep 20; done
bash tools/finalize.sh
