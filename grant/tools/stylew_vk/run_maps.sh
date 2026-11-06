set -e
cd /home/user/battle-maps/grant/tools/stylew_vk
flock /tmp/stylew_map.lock python3 msw_vk.py vicksburg_siege /home/user/battle-maps/grant/assets/vicksburg_siege_w.jpg close=/home/user/battle-maps/grant/assets/vicksburg_siege_w_close.jpg story=/home/user/battle-maps/grant/assets/src/vicksburg_siege_story.json green=1 tint=0 mult=1 main_r=32 prB=12 nB=1 creeks=5 prD=300
flock /tmp/stylew_map.lock python3 msw_vk.py grandgulf /home/user/battle-maps/grant/assets/grandgulf_w.jpg close=/home/user/battle-maps/grant/assets/grandgulf_w_close.jpg story=/home/user/battle-maps/grant/assets/src/grandgulf_story.json green=1 tint=0 mult=1 main_r=30 prB=12 nB=1 creeks=5 prD=300
flock /tmp/stylew_map.lock python3 msw_vk.py vicksburg /home/user/battle-maps/grant/assets/vicksburg_w.jpg close=/home/user/battle-maps/grant/assets/vicksburg_w_close.jpg story=/home/user/battle-maps/grant/assets/src/vicksburg_story.json green=1 tint=0 mult=1 main_r=8 prB=12 nB=1 creeks=6 prD=300
flock /tmp/stylew_map.lock python3 msw_vk.py mississippi /home/user/battle-maps/grant/assets/mississippi_w.jpg close=/home/user/battle-maps/grant/assets/mississippi_w_close.jpg green=1 tint=0 mult=1 main_r=7 prB=12 nB=1 creeks=8 prD=300 sea=/home/user/battle-maps/grant/assets/mississippi_land.png
for m in vicksburg_siege grandgulf vicksburg mississippi; do cp /home/user/battle-maps/grant/assets/${m}_hd_lift.json /home/user/battle-maps/grant/assets/${m}_w.json; done
echo DONE
