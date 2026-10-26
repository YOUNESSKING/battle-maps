cd /home/user/battle-maps/peng
while [ ! -f logs/render_all.done ]; do sleep 20; done
cp logs/render_all.log logs/render_all_1.log
bash tools/render_all.sh "hook-a nwkorea_hd_ref hook-1 hook-1" "move2a nwkorea_hd_ref move2-1 move2-5" "move2b kunuri_hd_ref move2-6 move2-7" "move2c korea_hd_ref move2-8 move2-9"
