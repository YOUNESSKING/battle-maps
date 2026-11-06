"""Fixed river layers for the Style W mississippi map (Grant #16 restyle, 2026-11-06).
big (det_rivS) = the 1863 Mississippi as ONE line (the course the scenes' boats follow: m2a RIV / m2c RIVM) + the Gulf coast water of the
original layer; det (det_riv) = the original tributaries with the original Mississippi corridor removed + the lower Yazoo as the scenes draw it.
Run from grant/: python3 tools/stylew_miss/make_masks.py"""
import math, numpy as np, cv2
from PIL import Image
from scipy import ndimage
def M(la, lo):
    n = 256 * 2 ** 8; s = math.sin(math.radians(la))
    return ((lo + 180) / 360 * n - 14798) * 2, ((0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n - 25587) * 2   # 5760 image px
RIVM = [[36.75, -89.30], [36.50, -89.52], [36.25, -89.56], [36.00, -89.72], [35.70, -89.95], [35.40, -90.02], [35.15, -90.07], [34.80, -90.30], [34.53, -90.58],
  [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12], [32.48, -91.06], [32.40, -91.00], [32.385, -90.93],
  [32.37, -90.885], [32.345, -90.893], [32.30, -90.91], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07], [31.95, -91.16], [31.80, -91.30], [31.56, -91.42],
  [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.6, -89.6], [29.2, -89.3]]
YAZ = [[33.52, -90.18], [33.20, -90.40], [32.85, -90.55], [32.60, -90.72], [32.52, -90.79], [32.47, -90.88], [32.43, -90.94], [32.40, -90.97]]
src = np.asarray(Image.open("assets/media/mississippi_det_riv.png"))[..., 3] > 25
H, W = src.shape
# the coast water = the thick parts of the original layer (open water), kept as it is
thick = cv2.morphologyEx(src.astype(np.uint8), cv2.MORPH_OPEN, np.ones((15, 15), np.uint8)) > 0
coast = ndimage.binary_dilation(thick, iterations=8) & src
coast[: int(H * 0.8)] = False                                  # only the Gulf coast (bottom of the map), not the upper-river pools
line = lambda pts, w: cv2.polylines(np.zeros((H, W), np.uint8), [np.array([M(*p) for p in pts], np.int32)], False, 1, w) > 0
big = line(RIVM, 7) | coast
# the original Mississippi corridor (the modern course, meanders and all) is removed from the creek layer
corr = ndimage.binary_dilation(line(RIVM, 3), iterations=70)
det = (src & ~corr & ~coast) | line(YAZ, 5) | big
for nm, m in (("det_rivS", big), ("det_riv", det), ("det_force", line(YAZ + [[32.386, -91.0]], 5) & ~ndimage.binary_dilation(line(RIVM, 3), iterations=3))):
    a = np.zeros((H, W, 4), np.uint8); a[..., 3] = m * 255
    Image.fromarray(a).save(f"tools/stylew_miss/assets/media/mississippi_{nm}.png")
print("ok", big.sum(), det.sum())
