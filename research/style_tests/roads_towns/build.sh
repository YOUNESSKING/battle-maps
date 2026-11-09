set -e
R=/tmp/claude-0/-home-user-battle-maps/30cbeb75-6ac3-5d4d-bd68-7dfc496a4a58/scratchpad/rt
OUT=$1; shift
python3 $R/make_body.py $R/$OUT
cd /home/user/battle-maps/grant && python3 tools/s12_inline.py vx s12d_rt vicksburg_w s12-3 s12-4 31.2 63.8 >/dev/null
rm -rf scenes/s12d_rt/assets/rt && mkdir -p scenes/s12d_rt/assets/rt && cp $R/$OUT/*.png scenes/s12d_rt/assets/rt/ && H=/home/user/battle-maps/research/style_tests/roads_towns/hills/soft && for f in champion_hill champion_hill_close vicksburg_bluffs vicksburg_bluffs_close; do cp $H/$f.png scenes/s12d_rt/assets/rt/hill_$f.png; done
BID=$(cat $R/$OUT/buildid.txt); for f in lanes_w lanes_close bridges; do cp $R/$OUT/$f.png scenes/s12d_rt/assets/rt/${f}_$BID.png; done
cd scenes/s12d_rt && timeout 500 hyperframes snapshot . --at "$1" --no-end -o $R/$2 2>&1 | tail -1
