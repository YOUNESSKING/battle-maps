"""Script-12 TERRITORY TEST (owner request: hatching for BOTH sides): one territory layer -> two-colour ink hatching
(Union ground BLUE, Confederate ground RED; 45 deg, thin lines, semi-transparent, rivers and ink woods left clear).
usage (from grant/): python3 tools/s12_make_terr.py IN_mx.png OUT.png RELIEF_W.jpg [step=9] [lw=2] [alpha=140] [capture=gn_*.png]
IN_mx.png: a Grant control layer (red = Confederate ground, blue = Union ground). capture=: a gn_* captured-patch layer whose ground is
handed back to the Confederates (the 'before' state of that hand-over)."""
import sys
import numpy as np, cv2
from PIL import Image
src, out, relief = sys.argv[1:4]
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
yy, xx = np.mgrid[0:1620, 0:2880]
STEP, LW, A = int(O.get('step', 9)), int(O.get('lw', 2)), int(O.get('alpha', 140))
hatch = ((xx + yy) % STEP) < LW
o = np.zeros((1620, 2880, 4), np.uint8)
o[red & hatch & ~clear] = (200, 50, 40, A); o[blue & hatch & ~clear] = (40, 80, 190, A)
Image.fromarray(o).save(out, optimize=True)
print(out, int((red & hatch & ~clear).sum()), int((blue & hatch & ~clear).sum()))
