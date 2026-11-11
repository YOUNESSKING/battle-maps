#!/usr/bin/env python3
"""River centre-lines for the river labels (vicksburg_w world box, map px 0..2880 x 0..1620).

Reads the water mask research/style_tests/roads_towns/exclusion_masks/rivers_w.png (5760x3240, 255 = water,
dilated 2 px), skeletonizes it and routes a minimum-cost path along the skeleton between two hand-picked
end points per river (route_through_array). Output: rivers_px.json  {id: {"name", "pts": [[x, y], ...]}}
in map px, simplified to ~6 px steps. Also writes mask_water.png (alpha mask, 2880x1620) for L.water().
Usage: python3 extract_rivers.py
"""
import json, os
import numpy as np
from PIL import Image
from skimage.morphology import skeletonize, dilation, disk
from skimage.graph import route_through_array

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = "/home/user/battle-maps"
M = np.asarray(Image.open(f"{REPO}/research/style_tests/roads_towns/exclusion_masks/rivers_w.png")) > 127
# end points in map px (from the basemap; Big Black = NE -> mouth at Grand Gulf, Pearl = past Jackson)
RIVERS = {
    "mississippi": ("Mississippi River", (1212, 2), (902, 1617)),
    "big_black": ("Big Black River", (2118, 104), (1268, 898)),
    "pearl": ("Pearl River", (1985, 642), (2125, 1615)),
}
sk = skeletonize(M)
sk = dilation(sk, disk(1)).astype(bool)
cost = np.where(sk, 1.0, np.where(M, 20.0, 5000.0))
out = {}
for rid, (name, a, b) in RIVERS.items():
    def snap(p):
        x, y = int(p[0] * 2), int(p[1] * 2)
        ys, xs = np.nonzero(sk[max(0, y - 60):y + 60, max(0, x - 60):x + 60])
        d = (xs + max(0, x - 60) - x) ** 2 + (ys + max(0, y - 60) - y) ** 2
        i = int(np.argmin(d)); return (int(ys[i] + max(0, y - 60)), int(xs[i] + max(0, x - 60)))
    path, c = route_through_array(cost, snap(a), snap(b), fully_connected=True, geometric=True)
    P = np.array(path, float)[:, ::-1] / 2.0            # (x, y) map px
    keep, last = [P[0]], P[0]
    for q in P[1:]:
        if np.hypot(*(q - last)) >= 6: keep.append(q); last = q
    keep.append(P[-1])
    out[rid] = {"name": name, "pts": [[round(float(x), 1), round(float(y), 1)] for x, y in keep]}
    print(rid, len(keep), "pts, cost", round(c, 1))
json.dump({"_note": "map px of vicksburg_w (2880x1620); centre-lines from the exclusion water mask", **out},
          open(os.path.join(HERE, "rivers_px.json"), "w"))
open(os.path.join(HERE, "rivers_px.js"), "w").write("window.RIVERS_PX = " + json.dumps(out) + ";\n")   # for file:// pages
# water alpha mask for L.water(), at map px (2880x1620): the WATER of the 2e river overlay (rivers/rivers_w.png,
# its pale grey-blue pixels; thinner than the old ribbon in the exclusion mask), feathered 1 px
import cv2
ov = np.asarray(Image.open(f"{REPO}/research/style_tests/roads_towns/rivers/rivers_w.png")).astype(np.int16)
wm = ((ov[..., 3] > 200) & (ov[..., 2] - ov[..., 0] > 12) & (ov[..., 2] > 90)).astype(np.uint8) * 255
wm = cv2.morphologyEx(wm, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
wm = cv2.resize(cv2.GaussianBlur(wm, (0, 0), 1.0), (2880, 1620), interpolation=cv2.INTER_AREA)
Image.fromarray(np.dstack([np.full_like(wm, 255)] * 3 + [wm]), "RGBA").save(os.path.join(HERE, "mask_water.png"))
print("ok")
