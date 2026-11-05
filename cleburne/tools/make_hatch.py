"""STYLE W territory (STYLE_LOCK 2d item 3): red ink hatching instead of colour fills.
usage (from cleburne/):
  python3 tools/make_hatch.py IN_mx.png OUT.png RELIEF_W.jpg [minus=OTHER_mx.png] [side=red|blue]
IN_mx.png  = an existing territory layer (red = Union ground, blue = Confederate ground), 2880x1620 RGBA.
OUT.png    = assets/media/gn_<map>_ctl_<what>_mx.png: 45 deg hatch, 2 px every 9 px, (200,50,40) at 75 % alpha,
             rivers and woods on RELIEF_W.jpg (the Style W wide basemap) left clear.
minus=     = 'captured' layer: only ground that is <side> in IN but NOT <side> in OTHER (the patch that changed hands).
side=blue  = hatch the blue (Confederate) ground instead (still drawn in red ink only if colour=red; default colour follows side).
Load in a scene with blend 'normal' (lay() picks normal for files named gn_*)."""
import sys
import numpy as np, cv2
from PIL import Image

src, out, relief = sys.argv[1:4]
O = dict(kv.split('=') for kv in sys.argv[4:])
side = O.get('side', 'red')

def owned(path):
    a = np.asarray(Image.open(path).convert('RGBA').resize((2880, 1620))).astype(np.int16)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    m = (al > 40) & ((r > b + 40) if side == 'red' else (b > r + 40))
    return cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)).astype(bool)

m = owned(src)
if 'minus' in O:
    m &= ~owned(O['minus'])
    m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((7, 7), np.uint8)).astype(bool)
# keep rivers and woods clear (Style W relief: water is blue-ish, ink trees are dark)
rl = np.asarray(Image.open(relief).convert('RGB').resize((2880, 1620), Image.BILINEAR)).astype(np.int16)
water = (rl[..., 2] > rl[..., 0] + 25)
dark = rl.mean(-1) < 62
clear = cv2.dilate((water | dark).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
yy, xx = np.mgrid[0:1620, 0:2880]
hatch = np.isin((xx + yy) % 9, (1, 2))
on = m & hatch & ~clear
col = (200, 50, 40) if O.get('colour', 'red') == 'red' else (40, 80, 190)
o = np.zeros((1620, 2880, 4), np.uint8); o[on] = col + (191,)
# thin crisp edge line along the hand-over boundary (helps it read at 3 s)
edge = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)).astype(bool) & ~clear
o[edge] = col + (150,)
Image.fromarray(o).save(out, optimize=True)
print(out, 'px on', int(on.sum()))
