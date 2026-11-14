"""Script-12 final: historically corrected Mississippi control layers for the form-2 stripes (mississippi z8 map px).
1 Apr 1863: the Union holds the Louisiana (west) bank from Lake Providence to Young's Point / Milliken's Bend (Grant's camps).
4 Jul 1863: the Union holds the whole west bank along the river, Vicksburg and the ground east of it to the Big Black, joined to the blue north
and to Baton Rouge / New Orleans; Port Hudson (fell 9 July) stays a small Confederate pocket.
usage (from grant/): python3 tools/s12_fix_ctl.py   -> assets/media/t12c_miss_apr1_mx.png, t12c_miss_jul_mx.png"""
import math, numpy as np, cv2
from PIL import Image
OX, OY = 14798, 25587
def P(la, lo):
    n = 256 * 2 ** 8; return ((lo + 180) / 360 * n - OX, (1 - math.asinh(math.tan(math.radians(la))) / math.pi) / 2 * n - OY)
RIV = [[35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07]]
BLUE, RED = (60, 100, 230, 255), (230, 110, 100, 255)
def strip(pts, west, east):   # polygon between the river shifted west and shifted east (degrees of longitude)
    return np.array([P(la, lo - west) for la, lo in pts] + [P(la, lo + east) for la, lo in reversed(pts)], np.int32)
def paint(src, out, polys, reds=()):
    a = np.array(Image.open(src).convert('RGBA'))
    for poly in polys: cv2.fillPoly(a, [poly], BLUE)
    for c, r in reds: cv2.circle(a, tuple(int(v) for v in P(*c)), int(r), RED, -1)
    Image.fromarray(a).save(out); print(out)
M = "assets/media/"
# 1 April: Lake Providence (32.80) to Young's Point / Milliken's Bend, the west bank only
paint(M + "vk_miss_ctl_apr1_mx.png", M + "t12c_miss_apr1_mx.png", [strip([p for p in RIV if 32.25 <= p[0] <= 33.10], 0.75, 0.0)])
# 4 July: the whole west bank (north of Baton Rouge), the river itself, Vicksburg and east to the Big Black; Port Hudson a red pocket
jul = [strip([p for p in RIV if p[0] >= 30.40], 0.55, 0.06), strip([p for p in RIV if p[0] <= 30.50], 0.20, 0.20),
       np.array([P(32.55, -90.95), P(32.55, -90.70), P(32.15, -90.70), P(32.15, -90.95)], np.int32)]
paint(M + "vx_miss_jul_mx.png", M + "t12c_miss_jul_mx.png", jul, reds=[((30.68, -91.20), 7)])
