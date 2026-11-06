"""STYLE W hand-over hatching from a hand-drawn polygon (Grant #16 restyle, 2026-11-06). Same look as tools/make_hatch.py
(45 deg red ink hatch, 2 px every 9 px, (200,50,40) at 75 %, thin crisp edge, rivers + ink woods on the Style W relief left clear),
but the patch is a polygon in scene px instead of a difference of two old territory masks (those carry old creek holes as red lines).
usage: python3 tools/make_hatch_poly.py OUT.png RELIEF_W.jpg 'x,y x,y x,y ...' [step=9 lw=2]"""
import sys
import numpy as np, cv2
from PIL import Image

out, relief, poly = sys.argv[1:4]
O = dict(kv.split('=') for kv in sys.argv[4:])
P = np.array([[float(v) for v in q.split(',')] for q in poly.split()], np.int32)
m = np.zeros((1620, 2880), np.uint8); cv2.fillPoly(m, [P], 1); m = m.astype(bool)
rl = np.asarray(Image.open(relief).convert('RGB').resize((2880, 1620), Image.BILINEAR)).astype(np.int16)
water = (rl[..., 2] > rl[..., 0] + 25); dark = rl.mean(-1) < 62
clear = cv2.dilate((water | dark).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool)
yy, xx = np.mgrid[0:1620, 0:2880]
STEP, LW = int(O.get('step', 9)), int(O.get('lw', 2))
on = m & (((xx + yy) % STEP) < LW) & ~clear
col = (200, 50, 40)
o = np.zeros((1620, 2880, 4), np.uint8); o[on] = col + (191,)
edge = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)).astype(bool) & ~clear
o[edge] = col + (150,)
Image.fromarray(o).save(out, optimize=True)
print(out, 'px on', int(on.sum()))
