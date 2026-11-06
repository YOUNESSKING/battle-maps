"""Style W hand-over hatching drawn from a REGION (critic r1, 2026-11-06): 45 deg ink lines only inside the ground actually taken,
rivers / water left clear, soft feathered edge (no hard polygon edge), thin crisp boundary line omitted.
usage (from grant/): python3 tools/stylew_ten/hatch_region.py OUT.png RELIEF_W.jpg colour=blue|red (poly='[[x,y],...]' | ell=cx,cy,rx,ry | from=LAYER_mx.png)
       [step=9] [lw=2] [feather=10] [alpha=200]      coordinates in map px (2880 x 1620)"""
import json, sys
import numpy as np, cv2
from PIL import Image
out, relief = sys.argv[1:3]
O = dict(kv.split("=", 1) for kv in sys.argv[3:])
W, H = 2880, 1620
m = np.zeros((H, W), np.uint8)
if "poly" in O: cv2.fillPoly(m, [np.array(json.loads(O["poly"]), np.int32)], 255)
if "ell" in O:
    cx, cy, rx, ry = map(float, O["ell"].split(",")); cv2.ellipse(m, (int(cx), int(cy)), (int(rx), int(ry)), 0, 0, 360, 255, -1)
if "from" in O:
    a = np.asarray(Image.open(O["from"]).convert("RGBA").resize((W, H)))[..., 3] > 0
    a = cv2.morphologyEx(a.astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((31, 31), np.uint8))
    a = cv2.morphologyEx(a, cv2.MORPH_OPEN, np.ones((41, 41), np.uint8)); m = np.maximum(m, a)
f = float(O.get("feather", 10))
soft = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), f) if f > 0 else m / 255.0
soft = np.clip((soft - 0.15) / 0.7, 0, 1) * (m > 0 if f == 0 else 1)
rl = np.asarray(Image.open(relief).convert("RGB").resize((W, H), Image.BILINEAR)).astype(np.int16)
water = cv2.dilate(((rl[..., 2] > rl[..., 0] + 20) & (rl[..., 2] > rl[..., 1] - 5)).astype(np.uint8), np.ones((7, 7), np.uint8)).astype(bool)
yy, xx = np.mgrid[0:H, 0:W]
step, lw = int(O.get("step", 9)), int(O.get("lw", 2))
on = (((xx + yy) % step) < lw) & ~water
col = (40, 80, 190) if O.get("colour", "red") == "blue" else (200, 50, 40)
o = np.zeros((H, W, 4), np.uint8); o[on] = col + (0,)
o[..., 3] = (on * soft * float(O.get("alpha", 200))).astype(np.uint8)
Image.fromarray(o).save(out, optimize=True); print(out, int((o[..., 3] > 30).sum()))
