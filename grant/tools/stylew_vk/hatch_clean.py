"""Grant #16 move 2 STYLE W hatch (critic r1): like tools/make_hatch.py, but the captured patch is cleaned (no fragments, smooth edge),
land only (rivers/creeks of the Style W relief cut out with a margin), optional clip polygon (scene px).
usage: python3 tools/stylew_vk/hatch_clean.py IN_mx.png OUT.png RELIEF_W.jpg [minus=..] [side=blue|red] [step=9] [lw=2] [clip=x,y;x,y;...] [minpx=1500]"""
import sys, numpy as np, cv2
from PIL import Image
from scipy import ndimage
src, out, relief = sys.argv[1:4]; O = dict(kv.split('=', 1) for kv in sys.argv[4:]); side = O.get('side', 'red')
def owned(p):
    a = np.asarray(Image.open(p).convert('RGBA').resize((2880, 1620))).astype(np.int16)
    return (a[..., 3] > 40) & ((a[..., 0] > a[..., 2] + 40) if side == 'red' else (a[..., 2] > a[..., 0] + 40))
m = owned(src)
if 'minus' in O: m &= ~owned(O['minus'])
if 'clip' in O:
    c = np.zeros(m.shape, np.uint8); cv2.fillPoly(c, [np.array([[float(v) for v in q.split(',')] for q in O['clip'].split(';')], np.int32)], 1); m &= c.astype(bool)
rl = np.asarray(Image.open(relief).convert('RGB').resize((2880, 1620), Image.BILINEAR)).astype(np.int16)
water = cv2.dilate(((rl[..., 2] > rl[..., 0] + 25) & (rl[..., 2] > 110)).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((11, 11), np.uint8)).astype(bool) & ~water
m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 3) > 0.55
lab, n = ndimage.label(m); minpx = int(O.get('minpx', 1500))
if n: sz = ndimage.sum(m, lab, range(1, n + 1)); m = np.isin(lab, 1 + np.where(sz >= minpx)[0])
yy, xx = np.mgrid[0:1620, 0:2880]; STEP, LW = int(O.get('step', 9)), int(O.get('lw', 2))
col = (200, 50, 40) if side == 'red' else (40, 80, 190)
o = np.zeros((1620, 2880, 4), np.uint8); o[m & (((xx + yy) % STEP) < LW)] = col + (191,)
edge = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)).astype(bool)
o[edge] = col + (150,)
Image.fromarray(o).save(out, optimize=True); print(out, 'px', int(m.sum()), 'parts', int(ndimage.label(m)[1]))
