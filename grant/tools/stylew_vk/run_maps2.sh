set -e
cd /home/user/battle-maps/grant/tools/stylew_vk
flock /tmp/stylew_map.lock python3 msw_vk.py vicksburg /home/user/battle-maps/grant/assets/vicksburg_w.jpg close=/home/user/battle-maps/grant/assets/vicksburg_w_close.jpg story=/home/user/battle-maps/grant/assets/src/vicksburg_story.json green=1 tint=0 mult=1 main_r=8 prB=12 nB=1 creeks=6 prD=300
flock /tmp/stylew_map.lock python3 msw_vk.py mississippi /home/user/battle-maps/grant/assets/mississippi_w.jpg close=/home/user/battle-maps/grant/assets/mississippi_w_close.jpg green=1 tint=0 mult=1 main_r=5 prB=12 nB=1 creeks=8 prD=300 sea=/home/user/battle-maps/grant/assets/mississippi_land.png
echo DONE
