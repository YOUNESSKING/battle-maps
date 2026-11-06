"""Style W river masks for the m2b/m2d/m2g maps (vicksburg_siege, grandgulf), Grant #16 restyle 2026-11-06.
The stock bake of these z12 maps turned the Mississippi into a thin creek among the bayous. This writes clean masks under the
bases vicksburg_siegeW / grandgulfW (old masks untouched): the Mississippi as ONE smooth line (vicksburg_siege: the 1863 course, the
hairpin round De Soto Point past the city front, cut off in 1876; grandgulf: the channel Hard Times - Grand Gulf - Bruinsburg), plus the
named side rivers as smooth tapered creeks (det_rivX, unpruned): the lower Yazoo; the Big Black at Grand Gulf and Bayou Pierre to Port
Gibson. Creek centrelines = the water-layer routes of tools/w_rivers.py (assets/src/<map>_wriv_paths.json), heavily smoothed.
Writes assets/media/<map>W_det_rivS.png, _det_riv.png, _det_rivX.png and assets/src/<map>_rivW.json (scene px centrelines for the scenes).
usage (from grant/): python3 tools/stylew_m2_rivers.py
then bake:  python3 tools/make_style_w_grant.py <map>W assets/<map>_w.jpg close=assets/<map>_w_close.jpg story=assets/src/<map>_story.json green=1 tint=0 mult=1 noprune=1 main_r=20 creek_r=5"""
import json
import numpy as np, cv2
from PIL import Image
W, H = 5760, 3240
def spline(pts, n=10):
    P = [pts[0]] + pts + [pts[-1]]; o = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = map(np.array, P[i - 1:i + 3])
        for t in np.linspace(0, 1, n, endpoint=False):
            o.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    o.append(np.array(pts[-1])); return [[float(q[0]), float(q[1])] for q in o]
def smooth(pts, k=11, it=3):
    a = np.array(pts, np.float32)
    for _ in range(it):
        if len(a) < 2 * k: break
        b = np.stack([np.convolve(np.pad(a[:, i], k // 2, mode="edge"), np.ones(k) / k, mode="valid") for i in range(2)], -1); b[0], b[-1] = a[0], a[-1]; a = b
    return a.tolist()
MAIN = {
  # 1863 course (old m2b RIV63, calibrated on the NHD water layer) + the channel down from Milliken's Bend
  "vicksburg_siege": [[760, -30], [775, 150], [850, 300], [960, 410], [1060, 520], [1160, 560], [1260, 600], [1350, 630], [1400, 656], [1418, 676], [1392, 700],
                      [1365, 780], [1342, 860], [1310, 920], [1230, 980], [1180, 1060], [1140, 1160], [1100, 1280], [1060, 1400], [1020, 1520], [1000, 1650]],
  # the channel past Hard Times, under the Grand Gulf bluffs, by Disharoon's and Bruinsburg (traced on the NHD water layer)
  "grandgulf": [[1545, -20], [1490, 120], [1400, 235], [1280, 240], [1205, 285], [1210, 380], [1258, 480], [1280, 590], [1232, 688], [1120, 772], [1022, 842],
                [982, 940], [920, 1060], [840, 1160], [740, 1240], [580, 1340], [480, 1440], [400, 1650]]}
CREEK_W = [16, 7]
for m, pts in MAIN.items():
    river = spline(pts)
    big = np.zeros((H, W), np.uint8); cv2.polylines(big, [np.array([[x * 2, y * 2] for x, y in river], np.int32)], False, 1, 18)
    X = np.zeros((H, W), np.uint8); creeks = []
    for c in json.load(open(f"assets/src/{m}_wriv_paths.json"))["creeks"]:
        c = smooth(c); rv = np.array(river); c[0] = rv[np.argmin(((rv - np.array(c[0])) ** 2).sum(1))].tolist()   # the mouth snapped onto the river line
        creeks.append(c); n = len(c)
        for i in range(n - 1):
            w = CREEK_W[0] + (CREEK_W[1] - CREEK_W[0]) * i / max(1, n - 1)
            cv2.line(X, (int(c[i][0] * 2), int(c[i][1] * 2)), (int(c[i + 1][0] * 2), int(c[i + 1][1] * 2)), 1, int(round(w)))
    def save(mk, nm):
        o = np.zeros((H, W, 4), np.uint8); o[..., 2] = 255; o[..., 3] = mk * 255; Image.fromarray(o).save(f"assets/media/{m}W_{nm}.png", optimize=True)
    save(big, "det_rivS"); save(big, "det_riv"); save(X, "det_rivX")
    json.dump({"main": [[round(x, 1), round(y, 1)] for x, y in river], "creeks": [[[round(x, 1), round(y, 1)] for x, y in c] for c in creeks]}, open(f"assets/src/{m}_rivW.json", "w"))
    print(m, "ok", len(river), [len(c) for c in creeks])
