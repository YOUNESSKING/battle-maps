# Grant #16 move 2 STYLE W territory hatching (critic r1: only where ground is taken, land only, clean edges, no fragments).
# run from grant/: bash tools/stylew_vk/make_hatches.sh   (blue = ground the Union takes)
set -e
M=assets/media; H="python3 tools/stylew_vk/hatch_clean.py"
$H $M/vk_vick_ctl_apr20_mx.png $M/gn_vick_ctl_apr20cap_mx.png assets/vicksburg_w.jpg minus=$M/vk_vick_ctl_apr1_mx.png side=blue
$H $M/vk_gg_ctl_apr30_mx.png $M/gn_gg_ctl_apr30cap_mx.png assets/grandgulf_w.jpg side=blue "clip=1000,850;1060,840;1130,872;1162,945;1130,1016;1060,1048;985,1048;1000,960" largest=1
$H $M/vx_vick_may14_mx.png $M/gn_vick_may14cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may12_mx.png side=blue largest=1
$H $M/vx_vick_may16_mx.png $M/gn_vick_may16cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may14_mx.png side=blue largest=1
$H $M/vx_vick_may18_mx.png $M/gn_vick_may18cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may16_mx.png side=blue largest=1
$H $M/vx_siege_jul_mx.png $M/gn_siege_julcap_mx.png assets/vicksburg_siege_w.jpg minus=$M/vx_siege_may_mx.png side=blue minpx=3000 largest=1
$H $M/vx_miss_jul_mx.png $M/gn_miss_julcap_mx.png assets/mississippi_w.jpg minus=$M/vx_miss_apr_mx.png side=blue step=12 lw=3 minpx=400
ln -f assets/mississippi_w.jpg $M/vk_miss_w.jpg
python3 -c "from PIL import Image; Image.open('assets/mississippi_w.jpg').convert('RGB').resize((2880, 1620), Image.LANCZOS).save('assets/media/vx_miss_w.jpg', quality=92)"   # m2g: half-size copy for the 46080-px world layer
ln -f assets/vicksburg_w.jpg $M/vk_vick_w.jpg   # m2c: the z10 map inset at Vicksburg (the 1863 hairpin)
