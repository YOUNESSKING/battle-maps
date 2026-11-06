"""STYLE W river masks for one map (Grant #16 restyle, 2026-11-06): keep ONLY the rivers/creeks the story needs.
The generator (research/style_tests/make_style_w.py) keeps the 2 largest 'big' river networks + the 4 longest creeks of
assets/media/<map>_det_rivS.png / _det_riv.png; on the henry/tennessee/donelson data that gave a comb of reservoir arms and
missed whole rivers. This tool writes clean masks under a NEW base name (the old masks stay untouched):
  python3 tools/w_rivers.py <map> <newbase> <spec.json>
spec.json: {"big": [route, ...], "creeks": [route, ...], "draw_big": [polyline, ...], "draw_creeks": [polyline, ...],
            "big_r": 9, "creek_r": 5}
  route    = waypoints in scene px (2880 x 1620); the path between them follows the existing river mask (cheapest path)
  polyline = drawn as given (already traced data)
Writes assets/media/<newbase>_det_rivS.png (big) and _det_riv.png (big + creeks), 5760 x 3240 RGBA (alpha = river).
Then bake:  python3 ../research/style_tests/make_style_w.py <newbase> assets/<map>_w.jpg close=assets/<map>_w_close.jpg story=... green=1 tint=0 mult=1 creeks=<n>"""
import sys, json
import numpy as np, cv2
from PIL import Image
from skimage.graph import route_through_array

mp, nb, spec = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
W, H = 5760, 3240
def load(n): return np.asarray(Image.open(f'assets/media/{mp}_{n}.png'))[..., 3] > 25
src = load('det_rivS') | load('det_riv')
half = cv2.resize(src.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0     # scene px
cost = np.where(half, 1.0, 40.0)
ys, xs = np.nonzero(half)

def snap(p, r=40):
    d = (xs - p[0]) ** 2 + (ys - p[1]) ** 2; i = int(np.argmin(d))
    return (int(ys[i]), int(xs[i])) if d[i] <= r * r else (int(np.clip(p[1], 0, H // 2 - 1)), int(np.clip(p[0], 0, W // 2 - 1)))

def route(wps):
    out = []
    for a, b in zip(wps[:-1], wps[1:]):
        path, _ = route_through_array(cost, snap(a), snap(b), fully_connected=True, geometric=True)
        out += [(c * 2 + 1, r * 2 + 1) for r, c in path]
    return out

def smooth(pts, k=9):
    if len(pts) < 2 * k: return pts
    a = np.array(pts, np.float32); b = cv2.blur(a[None], (k, 1))[0]; b[:k // 2] = a[:k // 2]; b[-(k // 2):] = a[-(k // 2):]
    return [tuple(q) for q in b]

big = np.zeros((H, W), np.uint8); cr = np.zeros((H, W), np.uint8)
R, r = int(spec.get('big_r', 9)), int(spec.get('creek_r', 5))
PATHS = {'big': [], 'creeks': []}
dec = lambda pts: [[round(float(x) / 2, 1), round(float(y) / 2, 1)] for x, y in list(pts[::8]) + [pts[-1]]]
for wps in spec.get('big', []):
    _p = smooth(route(wps)); PATHS['big'].append(dec(_p))
    cv2.polylines(big, [np.array(_p, np.int32)], False, 1, 2 * R)
for pl in spec.get('draw_big', []):
    cv2.polylines(big, [np.array([[x * 2, y * 2] for x, y in pl], np.int32)], False, 1, 2 * R)
X = np.zeros((H, W), np.uint8)
for c_ in spec.get('creeks', []):          # named creeks: {"route": [...], "w": [w_mouth, w_head]} map px, unpruned (assets/media/<nb>_det_rivX.png)
    pts = ([tuple(v * 2 for v in c_['mouth'])] if 'mouth' in c_ else []) + smooth(route(c_['route']));   # mouth: raw point inside the river (joins the creek to it)
    w0, w1 = c_.get('w', [2 * r, 2 * r]); n = len(pts); PATHS['creeks'].append(dec(pts))
    for i in range(n - 1):
        cv2.line(X, tuple(int(v) for v in pts[i]), tuple(int(v) for v in pts[i + 1]), 1, max(2, int(round(w0 + (w1 - w0) * i / max(1, n - 1)))))
for pl in spec.get('draw_creeks', []):
    cv2.polylines(cr, [np.array([[x * 2, y * 2] for x, y in pl], np.int32)], False, 1, 2 * r)
def save(m, n):
    o = np.zeros((H, W, 4), np.uint8); o[..., 2] = 255; o[..., 3] = m * 255
    Image.fromarray(o).save(f'assets/media/{nb}_{n}.png', optimize=True)
save(big, 'det_rivS'); save(big | cr, 'det_riv'); save(X, 'det_rivX')
json.dump(PATHS, open(f'assets/src/{mp}_wriv_paths.json', 'w'))   # river centrelines in scene px (for ink traces / boats in the scenes)
print(nb, 'big px', int(big.sum()), 'creek px', int(cr.sum()))
