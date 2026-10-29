"""Candidate basemap grades for the map-colour study (research only, nothing shipped).
usage: python3 grades.py BASE OUTDIR   (run from /home/user/battle-maps/sherman)
Reads assets/BASE_hd_ref.jpg (current dark grade), assets/BASE_hd.jpg (parchment), assets/src/BASE_hd_elev.npy.
Recovers the shading value a in [0,1] from the dark grade (rgb = dark + (lite-dark)*a), then re-colours it.
Writes OUTDIR/BASE_c{0..5}.jpg."""
import json, sys, os
import numpy as np
from PIL import Image
from scipy import ndimage
Image.MAX_IMAGE_PIXELS = None
base, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
J = json.load(open(f"assets/{base}.json"))
ref = np.asarray(Image.open(f"assets/{base}_hd_ref.jpg").convert("RGB"), np.float32)
elev = np.load(f"assets/src/{base}_hd_elev.npy")
land = elev > J.get("sea_below", 0.5)
le = np.where(land, elev, 0).astype(np.float32)
hi = max(np.percentile(le[land], 99.5) if land.any() else 1, 1); t = np.clip(le / hi, 0, 1)
coast = ndimage.gaussian_filter(land.astype(np.float32), 2.0)[..., None]
depth = np.clip(-elev / 2500, 0, 1)[..., None]
D0, L0 = np.array([16, 22, 22], np.float32), np.array([138, 154, 140], np.float32)
a = np.clip(((ref - D0) / (L0 - D0)).mean(axis=2), 0, 1)          # current shading value (grain included)
med = float(np.median(a[land]))
print(base, "median a on land (current):", round(med, 3))

def norm(a, target):  # exposure normalisation: gamma so the land median lands on `target` (same look on every map)
    g = np.log(target) / np.log(max(med, 1e-3)); return np.clip(a, 1e-4, 1) ** g

def ramp(a, dark, lite):
    return np.array(dark, np.float32) + (np.array(lite, np.float32) - np.array(dark, np.float32)) * a[..., None]

def save(rgb, k):
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(f"{out}/{base}_c{k}.jpg", quality=90)

# C0 current
Image.fromarray(ref.astype(np.uint8)).save(f"{out}/{base}_c0.jpg", quality=90)
# C1 lifted frontlines: same hue family, normalised exposure (land median a -> 0.70), higher white point, sea kept dark
an = norm(a, 0.70)
rgb = ramp(an, (24, 31, 31), (190, 202, 184))
rgb = np.array([18, 33, 44], np.float32) * (1 - coast) + rgb * coast
save(rgb, 1)
# C2 stone: warm neutral grey mid-key, normalised (median -> 0.60), dark slate sea for a strong coast
an2 = norm(a, 0.62)
rgb = ramp(an2, (58, 54, 46), (222, 214, 194))
sea = np.array([44, 62, 72], np.float32) * (1 - depth) + np.array([30, 44, 54], np.float32) * depth
rgb = sea * (1 - coast) + rgb * coast
save(rgb, 2)
# C3 parchment HD: the existing _hd.jpg, unchanged
Image.open(f"assets/{base}_hd.jpg").save(f"{out}/{base}_c3.jpg", quality=90)
# C4 topo daylight: light hypsometric tint (sage lowland -> tan -> brown upland), shading as a multiplier, blue sea
lo, md, up = np.array([200, 208, 182.]), np.array([196, 186, 150.]), np.array([158, 144, 108.])
tt = t[..., None]
hyp = np.where(tt < 0.4, lo * (1 - tt / 0.4) + md * (tt / 0.4), md * (1 - (tt - 0.4) / 0.6) + up * ((tt - 0.4) / 0.6))
rgb = hyp * (0.50 + 0.62 * an2[..., None])
sea = np.array([112, 152, 176.]) * (1 - depth) + np.array([78, 116, 146.]) * depth
rgb = sea * (1 - coast) + rgb * coast
save(rgb, 4)
# C5 = C2 base + screen-space spotlight vignette (applied after compositing, see compose step)
save(np.asarray(Image.open(f"{out}/{base}_c2.jpg"), np.float32), 5)
