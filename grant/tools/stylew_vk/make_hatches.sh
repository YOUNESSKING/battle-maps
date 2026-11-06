# Grant #16 move 2 STYLE W territory hatching (run from grant/: bash tools/stylew_vk/make_hatches.sh). blue = ground the Union takes, red = Confederate ground.
set -e
M=assets/media; H="python3 tools/make_hatch.py"
$H $M/vk_vick_ctl_apr20_mx.png $M/gn_vick_ctl_apr20cap_mx.png assets/vicksburg_w.jpg minus=$M/vk_vick_ctl_apr1_mx.png side=blue colour=blue
$H $M/vk_miss_ctl_apr1_mx.png $M/gn_miss_ctl_apr1cs_mx.png assets/mississippi_w.jpg side=red step=14 lw=3
$H $M/vk_gg_ctl_apr30_mx.png $M/gn_gg_ctl_apr30cap_mx.png assets/grandgulf_w.jpg side=blue colour=blue
python3 - <<'PY'
# keep only the Bruinsburg bridgehead (east bank) of the 30 April layer: the ground that changed hands
import numpy as np, cv2
from PIL import Image
p = "assets/media/gn_gg_ctl_apr30cap_mx.png"; a = np.asarray(Image.open(p)).copy()
m = np.zeros(a.shape[:2], np.uint8)
cv2.fillPoly(m, [np.array([[980, 860], [1060, 846], [1130, 876], [1160, 945], [1130, 1014], [1060, 1046], [950, 1046], [935, 960], [960, 900]], np.int32)], 1)
a[m == 0] = 0; Image.fromarray(a).save(p, optimize=True); print(p, "bridgehead px", int((a[..., 3] > 0).sum()))
PY
$H $M/vx_vick_may03_mx.png $M/gn_vick_may03cs_mx.png assets/vicksburg_w.jpg side=red
$H $M/vx_vick_may14_mx.png $M/gn_vick_may14cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may12_mx.png side=blue colour=blue
$H $M/vx_vick_may16_mx.png $M/gn_vick_may16cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may14_mx.png side=blue colour=blue
$H $M/vx_vick_may18_mx.png $M/gn_vick_may18cap_mx.png assets/vicksburg_w.jpg minus=$M/vx_vick_may16_mx.png side=blue colour=blue
$H $M/vx_siege_jul_mx.png $M/gn_siege_julcap_mx.png assets/vicksburg_siege_w.jpg minus=$M/vx_siege_may_mx.png side=blue colour=blue
$H $M/vx_miss_jul_mx.png $M/gn_miss_julcap_mx.png assets/mississippi_w.jpg minus=$M/vx_miss_apr_mx.png side=blue colour=blue step=12 lw=3
ln -f assets/mississippi_w.jpg $M/vk_miss_w.jpg
python3 -c "from PIL import Image; Image.open(\"assets/mississippi_w.jpg\").convert(\"RGB\").resize((2880, 1620), Image.LANCZOS).save(\"assets/media/vx_miss_w.jpg\", quality=92)"   # m2g: the 46080-px world layer needs the half-size copy (the full one crashes the page)
