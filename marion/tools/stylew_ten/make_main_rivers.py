"""Style W river layers for the henry (z11) and donelson (z13) maps (Grant #16 move 1): the stock generator keeps the 2 longest
skeleton pieces of <map>_det_rivS.png, which on these maps picks branchy creek networks and loses the rivers (the Tennessee and
Cumberland valleys are flat reservoir surfaces in the DEM: Kentucky Lake / Lake Barkley did not exist in 1862). Here each main river
and each kept creek is ROUTED along the existing river layer between hand-picked points (PREVIEW px = 1/4 of the 5760 image), then drawn
as one clean line. Writes tools/stylew_ten/assets/media/<map>_det_rivS.png (main) + <map>_det_riv.png (main + creeks) +
tools/stylew_ten/<map>_rivers.json (map px polylines). Then: cd tools/stylew_ten && python3 msw_ten.py <map> ... mprune=20 mkeep=6 cprune=6 cmin=40 cgap=10
usage (from grant/): python3 tools/stylew_ten/make_main_rivers.py henry|donelson"""
import json, os, sys
import numpy as np, cv2
from PIL import Image
from scipy import ndimage
from skimage.graph import route_through_array
m = sys.argv[1]
OUT = "tools/stylew_ten/assets/media"; os.makedirs(OUT, exist_ok=True)
W, H = 5760, 3240
L = {   # name: ([preview points ...], main?)
 "henry": {"tennessee": ([(540, 0), (600, 170), (640, 300), (650, 390), (630, 480), (690, 560), (735, 690), (700, 810)], 1),
           "cumberland": ([(665, 0), (695, 170), (760, 340), (800, 410), (860, 420), (930, 490), (1000, 470), (1080, 420), (1130, 375), (1185, 430), (1225, 530), (1265, 572), (1320, 595), (1440, 662)], 1),
           "c1": ([(465, 92), (487, 195), (470, 330), (455, 370)], 0), "red": ([(1385, 314), (1300, 350), (1240, 362), (1160, 372)], 0), "c2": ([(1185, 180), (1150, 300), (1148, 330)], 0),
           "c3": ([(1000, 500), (1020, 570), (1015, 660)], 0), "c4": ([(345, 440), (200, 440), (130, 490), (0, 490)], 0)},
 "donelson": {"tennessee": ([(135, 0), (160, 150), (165, 290), (110, 440), (105, 600), (235, 740), (270, 810)], 1),
              "cumberland": ([(555, 0), (600, 100), (645, 190), (650, 280), (700, 350), (760, 365), (900, 310), (970, 320), (1060, 420), (1150, 550), (1260, 690), (1340, 710), (1430, 625), (1440, 618)], 1),
              "lick": ([(806, 346), (803, 380), (800, 400), (770, 440)], 0), "c3": ([(1048, 412), (1030, 450), (1005, 540)], 0)},
}[m]
riv = np.asarray(Image.open(f"assets/media/{m}_det_rivS.png"))[..., 3] > 25
riv = cv2.resize(riv.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0
dist = cv2.distanceTransform(riv.astype(np.uint8), cv2.DIST_L2, 5)
cost = np.where(dist > 3, 1.0, np.where(riv, 4.0, 80.0))
def route(a, b):
    p, _ = route_through_array(cost, (a[1], a[0]), (b[1], b[0]), fully_connected=True, geometric=True)
    return [(c, r) for r, c in p]
def snap(p, r=14):
    x, y = min(max(int(p[0]), 0), W // 2 - 1), min(max(int(p[1]), 0), H // 2 - 1)
    y0, x0 = max(0, y - r), max(0, x - r); win = dist[y0:y + r, x0:x + r]
    if win.max() <= 0: return (x, y)
    iy, ix = np.unravel_index(np.argmax(win), win.shape); return (int(ix + x0), int(iy + y0))
lines = {}
for nm, (pts, main) in L.items():
    q = [snap((x * 2, y * 2)) for x, y in pts]
    path = []
    for a, b in zip(q[:-1], q[1:]): path += route(a, b)[(1 if path else 0):]
    a = np.array(path, np.float32); s = 10 if main else 5
    a = np.stack([ndimage.gaussian_filter1d(a[:, 0], s, mode="nearest"), ndimage.gaussian_filter1d(a[:, 1], s, mode="nearest")], 1)[::3]
    for end in (0, -1):   # a main river that starts/ends at the frame edge runs out past it (no stub at the edge)
        e = np.array(pts[end], float) * 2
        if main and (e[0] <= 2 or e[1] <= 2 or e[0] >= W // 2 - 2 or e[1] >= H // 2 - 2):
            ex = e + (e - np.array([W / 4, H / 4])) * 0.02
            a = np.vstack([ex[None], a]) if end == 0 else np.vstack([a, ex[None]])
    lines[nm] = (a, main)
json.dump({k: [[round(float(x), 1), round(float(y), 1)] for x, y in a] for k, (a, mn) in lines.items()}, open(f"tools/stylew_ten/{m}_rivers.json", "w"))
big = np.zeros((H, W), np.uint8); det = np.zeros((H, W), np.uint8)
for nm, (a, main) in lines.items():
    pl = [np.round(a * 2).astype(np.int32)]
    if main: cv2.polylines(big, pl, False, 255, 14, cv2.LINE_AA)
    cv2.polylines(det, pl, False, 255, 14 if main else 8, cv2.LINE_AA)
for n, mk in (("det_rivS", big), ("det_riv", det)):
    o = np.zeros((H, W, 4), np.uint8); o[..., 2] = 255; o[..., 3] = mk
    cv2.imwrite(f"{OUT}/{m}_{n}.png", cv2.cvtColor(o, cv2.COLOR_RGBA2BGRA))
print(m, {k: len(a) for k, (a, _) in lines.items()})
