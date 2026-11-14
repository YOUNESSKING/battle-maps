"""Style W river layers for the tennessee theatre map (Grant #16), one clean line per river, no reservoirs (Kentucky Lake / Lake Barkley
did not exist in 1862). Main rivers = the DEM-traced Ohio, Tennessee, Cumberland (assets/media/gh_tennessee_rivers.json, map px) + the
Mississippi routed along the order-3 DEM streams (assets/src/tennessee_dem_rivers.json, 5760 px) from the top edge through Cairo to
the bottom edge along the east bluffs (Columbus). Creeks = the longest order-3 DEM streams (the generator keeps the 4 longest).
Writes tools/stylew_ten/assets/media/tennessee_det_rivS.png + tennessee_det_riv.png (5760x3240 RGBA) + mississippi.json (map px).
usage (from grant/): python3 tools/stylew_ten/make_ten_rivers.py ; then run tools/stylew_ten/msw_ten.py from tools/stylew_ten."""
import json, os
import numpy as np, cv2
from scipy import ndimage
from skimage.graph import route_through_array
OUT = "tools/stylew_ten/assets/media"; os.makedirs(OUT, exist_ok=True)
W, H = 5760, 3240
dem = json.load(open("assets/src/tennessee_dem_rivers.json"))
gh = json.load(open("assets/media/gh_tennessee_rivers.json"))
o3 = np.zeros((H // 2, W // 2), np.uint8)                     # order-3 streams, map px
for s in dem:
    if s["order"] >= 3: cv2.polylines(o3, [np.array([[x / 2, y / 2] for x, y in s["pts"]], np.int32)], False, 1, 3)
cost = np.where(o3 > 0, 1.0, 60.0)
def route(a, b):
    p, _ = route_through_array(cost, (a[1], a[0]), (b[1], b[0]), fully_connected=True, geometric=True)
    return [(c, r) for r, c in p]
def snap(p, r=30):
    y0, x0 = max(0, p[1] - r), max(0, p[0] - r); win = o3[y0:p[1] + r, x0:p[0] + r]
    ys, xs = np.nonzero(win)
    if not len(xs): return p
    k = np.argmin((xs + x0 - p[0]) ** 2 + (ys + y0 - p[1]) ** 2); return (int(xs[k] + x0), int(ys[k] + y0))
def ext(pts, n=800):   # straight run-out past the frame edge from the first point (direction of the first ~40 points)
    a, b = np.array(pts[min(40, len(pts) - 1)], float), np.array(pts[0], float); d = (b - a) / (np.linalg.norm(b - a) + 1e-6)
    return [list(b + d * k) for k in range(n, 0, -40)] + [list(map(float, q)) for q in pts]
CAIRO = tuple(int(v) for v in gh["ohio"][-1]) if gh["ohio"][-1][0] < gh["ohio"][0][0] else tuple(int(v) for v in gh["ohio"][0])
TOP, BOT = snap((540, 90)), snap((600, 1560))
MS = route(TOP, snap(CAIRO)) + route(snap(CAIRO), BOT)
MS = np.array(ext(MS[::-1], 300)[::-1], np.float32)
MS = np.stack([ndimage.gaussian_filter1d(MS[:, 0], 6, mode="nearest"), ndimage.gaussian_filter1d(MS[:, 1], 6, mode="nearest")], 1)[::4]
EXT = {"tennessee": (gh["tennessee"][0], (1320, 1612), True), "cumberland": (gh["cumberland"][0], (2740, 690), True), "ohio_up": (gh["ohio_up"][0], (2390, 205), True)}
for k, (a, b, pre) in EXT.items():
    r = route(snap(tuple(int(v) for v in a)), snap(b))[::-1]
    gh[k] = [list(map(float, q)) for q in r[:-1]] + gh[k]
json.dump(gh, open("tools/stylew_ten/main_rivers.json", "w"))
json.dump([[round(float(x), 1), round(float(y), 1)] for x, y in MS], open("tools/stylew_ten/mississippi.json", "w"))
def smooth(pts, s=3):
    a = np.array(pts, np.float32)
    return np.stack([ndimage.gaussian_filter1d(a[:, 0], s, mode="nearest"), ndimage.gaussian_filter1d(a[:, 1], s, mode="nearest")], 1)
big = np.zeros((H, W), np.uint8)
for line in [MS] + [smooth(v) for v in gh.values()]:
    cv2.polylines(big, [np.round(np.asarray(line) * 2).astype(np.int32)], False, 255, 14, cv2.LINE_AA)
det = big.copy()
for s in dem:
    if s["order"] >= 3 and len(s["pts"]) > 150 and np.mean([q[0] for q in s["pts"]]) > 2200:   # no creeks in the Mississippi floodplain (read as braids)
        cv2.polylines(det, [np.round(smooth(s["pts"], 4)).astype(np.int32)], False, 255, 8, cv2.LINE_AA)
for n, m in (("det_rivS", big), ("det_riv", det)):
    a = np.zeros((H, W, 4), np.uint8); a[..., 2] = 255; a[..., 3] = m
    cv2.imwrite(f"{OUT}/tennessee_{n}.png", cv2.cvtColor(a, cv2.COLOR_RGBA2BGRA))
print("MS pts", len(MS), "TOP", TOP, "CAIRO", CAIRO, "BOT", BOT)
