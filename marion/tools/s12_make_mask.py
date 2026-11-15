"""Script-12 TERRITORY TEST v2: a control layer -> two alpha masks (Confederate ground / Union ground), rivers and ink woods cut out.
The scene draws the stripes itself (constant on-screen width/spacing at any camera scale) through these masks.
usage (from grant/): python3 tools/s12_make_mask.py IN_mx.png OUT_PREFIX RELIEF_W.jpg [capture=gn_*.png]  -> OUT_PREFIX_red.png, OUT_PREFIX_blue.png"""
import sys
import numpy as np, cv2
from PIL import Image
src, pre, relief = sys.argv[1:4]
O = dict(kv.split('=') for kv in sys.argv[4:])
a = np.asarray(Image.open(src).convert('RGBA').resize((2880, 1620))).astype(np.int16)
r, b, al = a[..., 0], a[..., 2], a[..., 3]
op = lambda m: cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)
red, blue = op((al > 40) & (r > b + 40)), op((al > 40) & (b > r + 40))
if 'capture' in O:
    c = np.asarray(Image.open(O['capture']).convert('RGBA').resize((2880, 1620)))[..., 3] > 0
    c = cv2.morphologyEx(c.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8)).astype(bool)
    red |= c & blue; blue &= ~c
rl = np.asarray(Image.open(relief).convert('RGB').resize((2880, 1620), Image.BILINEAR)).astype(np.int16)
clear = cv2.dilate(((rl[..., 2] > rl[..., 0] + 25) | (rl.mean(-1) < 62)).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
for nm, m in (("red", red), ("blue", blue)):
    o = np.zeros((1620, 2880, 4), np.uint8); o[..., :3] = 255; o[..., 3] = ((m & ~clear) * 255).astype(np.uint8)
    o[..., 3] = cv2.GaussianBlur(o[..., 3], (3, 3), 0)
    Image.fromarray(o).save(f"{pre}_{nm}.png", optimize=True)
print(pre, int(red.sum()), int(blue.sum()))
