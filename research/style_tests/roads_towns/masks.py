import json, os, sys
import numpy as np, cv2
from PIL import Image
sys.path.insert(0, "/home/user/battle-maps/research/style_tests/roads_towns/hills")
import make_hill as MH
Image.MAX_IMAGE_PIXELS = None
OUT, D = sys.argv[1], sys.argv[2]
meta = json.load(open(f"{OUT}/rt_meta.json")); cx_ = json.load(open(f"{OUT}/crossings.json")); S = meta["S"]
A = "/home/user/battle-maps/grant/assets"
for key, f in (("w", "vicksburg_w"), ("close", "vicksburg_w_close")):
    base = np.asarray(Image.open(f"{A}/{f}.jpg").convert("RGB")); H, W = base.shape[:2]
    Image.fromarray(MH.water_mask(base).astype(np.uint8) * 255).save(f"{D}/rivers_{key}.png", optimize=True)
    lum = cv2.GaussianBlur(base.astype(np.float32).mean(2), (0, 0), 2)
    Image.fromarray(((lum < 72) & ~MH.water_mask(base)).astype(np.uint8) * 255).save(f"{D}/woods_{key}.png", optimize=True)
H, W = 3240, 5760
rd = np.zeros((H, W), np.uint8)
for r in cx_["roads"]:
    for p in r["paths"]:
        cv2.polylines(rd, [np.array([[x * 2, y * 2] for x, y in p], np.int32)], False, 255, 1)
roads = cv2.distanceTransform((rd < 128).astype(np.uint8), cv2.DIST_L2, 5) < 12          # road + lane corridor (~12 image px each side)
for c in cx_["crossings"]:
    cv2.circle(roads.view(np.uint8), (int(c["x"] * 2), int(c["y"] * 2)), 30, 1, -1)       # bridges, ferries, landings
Image.fromarray(roads.astype(np.uint8) * 255).save(f"{D}/roads.png", optimize=True)
tw = np.zeros((H, W), np.uint8); lb_ = np.zeros((H, W), np.uint8)
for t in meta["towns"].values():
    c, R = t["c"], t["R_u"] / S
    cv2.circle(tw, (int(c[0] * 2), int(c[1] * 2)), int(2 * R * 1.5), 255, -1)
    lb = t["label"]; x0, y0 = c[0] - lb["ax"] / S, c[1] - lb["ay"] / S
    cv2.rectangle(lb_, (int(x0 * 2 - 20), int(y0 * 2 - 20)), (int((x0 + lb["w"] / S) * 2 + 20), int((y0 + lb["h"] / S) * 2 + 20)), 255, -1)
Image.fromarray(tw).save(f"{D}/towns.png", optimize=True); Image.fromarray(lb_).save(f"{D}/labels.png", optimize=True)
print("ok")
