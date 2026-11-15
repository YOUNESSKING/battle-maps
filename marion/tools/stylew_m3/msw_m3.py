"""GRANT MOVE 3 COPY of research/style_tests/make_style_w.py (2026-11-06): rivers from riv=<json> (see the river block). Style W v2: fresh copy of the Warhawk 'Dakota War' basemap (owner reference video NiXnbOO7Vt0, 2026-11-05),
rebuilt from two independent critic reports (warhawk/CRITIC_NOTES.md). Our map rules are deliberately NOT applied
(owner: 'start fresh, ditch the rules'). MAP ONLY; units stay ours.
usage (from a video folder): python3 ../research/style_tests/make_style_w.py <map> OUT.jpg [close=CLOSE.jpg] [key=value ...]
Glyph specs are SCREEN px (1920 wide) of the reference; K converts to 5760-map image px for the camera zoom where the
wide look is seen (s ~ 1.33 => 1 image px = 0.67 screen px => K = 1.5). The close look is tuned for s ~ 3 (1 image px = 1.5 screen px)."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from skimage.morphology import skeletonize
import cv2
base, out = sys.argv[1], sys.argv[2]
P = dict(riv='',rivonly='',mult=0, tint=1, green=0, story='', close='', creeks=4, main_r=6.5, creek_r=3.5, forest=0.12, patches=55, K=1.5, seed=5, ground='162,159,112')
for kv in sys.argv[3:]:
    k, v = kv.split('='); P[k] = type(P[k])(v) if not isinstance(P[k], str) else v
W, H = 5760, 3240; rng = np.random.default_rng(P['seed']); K = P['K']

def fbm(sig, shape=(H, W)):
    """normalised gaussian noise; large sigmas built on a reduced grid."""
    f = 8 if sig >= 24 else 1
    n = ndimage.gaussian_filter(rng.standard_normal((shape[0] // f + 1, shape[1] // f + 1)).astype(np.float32), sig / f)
    n /= n.std() + 1e-6
    return cv2.resize(n, (shape[1], shape[0]), interpolation=cv2.INTER_CUBIC) if f > 1 else n[:shape[0], :shape[1]]

# ---------- rivers: main river + a few long creeks, constant width, no glow ----------
def load(n): return np.asarray(Image.open(f'assets/media/{base}_{n}.png'))[..., 3] > 25
def skel_half(m):
    h = cv2.resize(m.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0
    return skeletonize(np.pad(h, 120, mode='edge'))
def prune(sk, it):
    k = np.ones((3, 3), np.uint8)
    for _ in range(it):
        nb = cv2.filter2D(sk.astype(np.uint8), -1, k, borderType=cv2.BORDER_CONSTANT) - sk
        sk = sk & ~(nb <= 1)
    return sk[120:-120, 120:-120]
def biggest(sk, n, minlen):
    lab, m = ndimage.label(sk, structure=np.ones((3, 3)))
    if m == 0: return sk
    ln = ndimage.sum(sk, lab, range(1, m + 1)); keep = 1 + np.argsort(ln)[::-1][:n]
    return np.isin(lab, keep[ln[keep - 1] > minlen])
def band(sk, r):
    full = cv2.resize(sk.astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST)
    full = cv2.GaussianBlur(full.astype(np.float32), (0, 0), 2.5) > 0.06
    dist = cv2.distanceTransform((~full).astype(np.uint8), cv2.DIST_L2, 5)
    return cv2.GaussianBlur(cv2.GaussianBlur(dist, (0, 0), 6) - r, (0, 0), 1.5) <= 0
# ---------- Grant move 3 (2026-11-06): rivers from a per-map config (riv=<json>, scene css px = map px / 2) ----------
# "lines": named rivers only: det_riv inside a corridor around a hand guide -> skeleton -> largest piece -> pruned -> constant ribbon
#          ("draw": true = the smoothed guide itself); "sea": tidal water / bay / ocean as real shapes from assets/<map>_land.png
#          (opened to drop creek fingers, small bits dropped, optional "keep" polygons). No reservoirs: they are simply not selected.
import json as _json
RC = _json.load(open(P['riv']))
det = load('det_riv')
def corridor(pts, hw):   # half-res mask
    m = np.zeros((H // 2, W // 2), np.uint8); cv2.polylines(m, [np.array([[x, y] for x, y in pts], np.int32)], False, 1, int(2 * hw)); return m.astype(bool)
def smooth_pts(pts, n=12):
    p = np.array(pts, np.float32); out = []
    P_ = np.vstack([p[0], p, p[-1]])
    for i in range(1, len(P_) - 2):
        p0, p1, p2, p3 = P_[i - 1], P_[i], P_[i + 1], P_[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(p[-1]); return np.array(out)
water = np.zeros((H, W), bool); wB = np.zeros((H, W), bool); wD = np.zeros((H, W), bool)
deth = cv2.resize(det.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0
for L in RC.get('lines', []):
    if L.get('route'):   # shortest path through det_riv (cheap) inside the corridor, waypoint to waypoint, then lightly smoothed
        from skimage.graph import route_through_array
        cor = corridor(L['pts'], L.get('corr', 14))
        cost = np.where(deth, 1.0, L.get('gap', 25.0)); cost[~cor] = 1e5
        path = []
        for (xa, ya), (xb, yb) in zip(L['pts'][:-1], L['pts'][1:]):
            x0_, x1_ = int(max(0, min(xa, xb) - 60)), int(min(W // 2, max(xa, xb) + 60)); y0_, y1_ = int(max(0, min(ya, yb) - 60)), int(min(H // 2, max(ya, yb) + 60))
            cl = lambda v, lo, hi: int(min(max(v, lo), hi - 1))
            idx, _ = route_through_array(cost[y0_:y1_, x0_:x1_], (cl(ya, y0_, y1_) - y0_, cl(xa, x0_, x1_) - x0_), (cl(yb, y0_, y1_) - y0_, cl(xb, x0_, x1_) - x0_), fully_connected=True, geometric=True)
            path += [(x0_ + c, y0_ + r) for r, c in idx]
        pa = np.array(path, np.float32); sg = L.get('smooth', 4)
        pa = np.stack([ndimage.gaussian_filter1d(pa[:, 0], sg, mode='nearest'), ndimage.gaussian_filter1d(pa[:, 1], sg, mode='nearest')], -1)
        if L['pts'][0][0] < 0 or L['pts'][0][1] < 0: pa = np.vstack([np.array(L['pts'][0], np.float32), pa])
        sk = np.zeros((H // 2, W // 2), np.uint8); cv2.polylines(sk, [pa.astype(np.int32)], False, 1, 1); sk = sk.astype(bool)
    elif L.get('draw'):
        sp_ = smooth_pts(L['pts'], 40)
        if L.get('wiggle'):   # gentle natural meander on a hand-drawn river (amplitude in css px)
            d_ = np.gradient(sp_, axis=0); nrm = np.stack([-d_[:, 1], d_[:, 0]], -1); nrm /= np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-6
            arc = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(sp_, axis=0), axis=1))])
            off = L['wiggle'] * (np.sin(arc / 9.0) * 0.6 + np.sin(arc / 4.3 + 1.3) * 0.4)
            sp_ = sp_ + nrm * off[:, None]
        sk = np.zeros((H // 2, W // 2), np.uint8); cv2.polylines(sk, [sp_.astype(np.int32)], False, 1, 1); sk = sk.astype(bool)
    else:
        m = deth & corridor(L['pts'], L.get('corr', 18))
        m = cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)).astype(bool)
        sk = skeletonize(np.pad(m, 120, mode='edge'))
        sk = prune(sk, L.get('prune', 20))
        sk = biggest(sk, 1, 10)
    bnd = band(sk, L.get('r', 3.5))
    water |= bnd; (wB if L.get('main') else wD).__ior__(bnd)
if RC.get('sea'):
    S_ = RC['sea']
    land = np.asarray(Image.open(f"assets/{base}_land.png").getchannel('A').resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    sea = cv2.GaussianBlur(1 - land, (0, 0), S_.get('blur', 4)) > 0.5
    r = S_.get('open', 8); k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    sea = cv2.morphologyEx(sea.astype(np.uint8), cv2.MORPH_OPEN, k)
    if S_.get('keep'):
        km = np.zeros((H, W), np.uint8)
        for poly in S_['keep']: cv2.fillPoly(km, [np.array([[x * 2, y * 2] for x, y in poly], np.int32)], 1)
        sea &= km
    lab, nl = ndimage.label(sea); sz = ndimage.sum(sea, lab, range(1, nl + 1))
    sea = np.isin(lab, 1 + np.where(sz >= S_.get('min_area', 20000))[0])
    sea = cv2.GaussianBlur(sea.astype(np.float32), (0, 0), S_.get('smooth', 3)) > 0.5
    water |= sea; wB |= sea
if P['rivonly']:
    pv = np.asarray(Image.open(f'assets/{base}_hd_lift.jpg').convert('L').resize((W // 4, H // 4))).astype(np.uint8)
    pv = np.stack([pv] * 3, -1); wq = cv2.resize(water.astype(np.uint8), (W // 4, H // 4)) > 0; pv[wq] = (40, 90, 230)
    Image.fromarray(pv).save(P['rivonly']); print('river preview', P['rivonly']); sys.exit(0)

# ---------- story ground (owner 2026-11-05: show what the narration talks about), critic round-3 recipe ----------
# contour-row hachures (rows along contours, strokes straight downslope, heavy on the shaded SE side, light on the lit NW side,
# blank summits and crest), a pale crest line on the narrow spine, a V-notch ravine, rail on a pale bed with jittered ties,
# outward-facing tunnel portals + pale dashed hidden tunnel, a crisp field with parallel furrows.
import json
from scipy.ndimage import maximum_filter
ST = json.load(open(P['story'])) if P['story'] else None
# generalised 2026-11-05 (Cleburne restyle): ridge/ravine may be ONE polyline or a LIST of polylines; hills/rail/fields/tunnel optional
_pl = lambda v: [] if not v else (v if isinstance(v[0][0], (list, tuple)) else [v])
if ST:
    RIDGES, RAVINES = _pl(ST.get('ridge')), _pl(ST.get('ravine'))
    for _k in ('hills', 'rail', 'fields'): ST.setdefault(_k, [])
    def dist_to(poly):
        m = np.ones((H // 4, W // 4), np.uint8); cv2.polylines(m, [np.array([[x / 2, y / 2] for x, y in poly], np.int32)], False, 0, 1)
        return cv2.resize(cv2.distanceTransform(m, cv2.DIST_L2, 5), (W, H)) * 4
    yy_, xx_ = np.mgrid[0:H, 0:W].astype(np.float32)
    hgt = np.zeros((H, W), np.float32)
    for i, (x, y, r) in enumerate(ST['hills']):                       # first hill = the highest (the real Tunnel Hill)
        hgt = np.maximum(hgt, (1.0 if i == 0 else 0.78) * np.exp(-(((xx_ - x * 2) ** 2 + (yy_ - y * 2) ** 2) / (r * 2 * 0.9) ** 2)))
    for _r in RIDGES: hgt = np.maximum(hgt, ST.get('ridge_h', 0.62) * np.exp(-(dist_to(_r) / ST.get('ridge_w', 28)) ** 2))   # the NARROW ridge spine(s)
    rvd = np.minimum.reduce([dist_to(_r) for _r in RAVINES]) if RAVINES else np.full((H, W), 1e4, np.float32)
    hgt -= 0.45 * np.exp(-(rvd / 11) ** 2)                                   # the ravine pinches the contours between the hills
    hgt = cv2.GaussianBlur(hgt, (0, 0), 4); del yy_, xx_
    gy, gx = np.gradient(hgt * 260)
    hs = np.clip((gx * 0.7 + gy * 0.7) / np.sqrt(gx * gx + gy * gy + 1), -1, 1)   # + = NW-facing (lit), - = SE-facing (shade)
    hmask = np.clip(hgt * 2.2, 0, 1)
    lmax = maximum_filter(hgt, size=121)
    sumthr = lmax * 0.86 + 0.04 * fbm(6)                               # ragged summit edge
    fmask = np.zeros((H, W), np.uint8)
    for poly in ST['fields']: cv2.fillPoly(fmask, [np.array([[x * 2, y * 2] for x, y in poly], np.int32)], 1)
    keepoff = cv2.dilate(fmask, np.ones((25, 25), np.uint8))
    for seg in ST['rail']: cv2.polylines(keepoff, [np.array([[x * 2, y * 2] for x, y in seg], np.int32)], False, 1, 30)
    treeoff = (keepoff | cv2.dilate((hgt > 0.12).astype(np.uint8), np.ones((90, 90), np.uint8))).astype(bool)   # woods keep the story ground open
    keepoff = keepoff.astype(bool)
def story_paint(a, close=False):
    """gentle painted light/shade on the story ground (<=15 % darkening), ravine band, crisp field tint (array stage)."""
    if not ST: return a
    k = (hmask * hs)[..., None]
    a = np.where(k < 0, a * (1 + k * 0.15), a * (1 + k * 0.12))
    a = a * (1 - 0.12 * np.exp(-(rvd / 10) ** 2))[..., None]
    f = fmask.astype(np.float32)[..., None]
    fcol = np.array([128, 128, 66] if P['green'] or close else [176, 168, 112], np.float32)
    return a * (1 - f * 0.35) + fcol * f * 0.35
def story_draw(d, SSf, ink, close=False):
    """ink layer (draw stage, coordinates x SSf). u = image px per screen px at the zoom this look is seen at."""
    if not ST: return
    u = 1.5 if not close else 0.6; Z = u * SSf
    c = lambda p: (p[0] * 2 * SSf, p[1] * 2 * SSf)
    rng2 = np.random.default_rng(3); gys, gxs = np.gradient(hgt)
    # 1) contour-row hachures
    step_lev = 0.09 if not close else 0.054; gmag = np.hypot(gxs, gys); p95 = np.percentile(gmag[hgt > 0.12], 95) if (hgt > 0.12).any() else 1.0
    for li, lev in enumerate(np.arange(0.10, 0.92, step_lev)):
        cs, _ = cv2.findContours((hgt > lev).astype(np.uint8), cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
        sp = max(1, round((3.2 if not close else 6.0) * u))
        for cnt in cs:
            if len(cnt) < 20: continue
            off_ = (sp // 2 if li % 2 else 0) if not close else int(rng2.integers(0, sp))
            for x, y in cnt[:, 0, :][off_::sp]:           # brick offset (wide) / random row start (close)
                if keepoff[y, x] or wdist(x, y) < 9 * K or lev > sumthr[y, x]: continue
                gxv, gyv = gxs[y, x], gys[y, x]; gm = np.hypot(gxv, gyv) + 1e-6
                if gm < 0.25 * p95: continue                                    # no rings on flat ground
                ux, uy = -gxv / gm, -gyv / gm
                L = np.clip(step_lev / gm, 5 * u, 11 * u) * 0.88 if not close else np.clip(step_lev / gm * 1.05, 5 * u, 24 * u)
                shd = np.clip(0.5 + 0.5 * (ux * 0.7 + uy * 0.7), 0, 1)        # 1 = facing SE (shade)
                sl = np.clip(gm / p95, 0, 1)
                lit = (ux * 0.7 + uy * 0.7) < -0.3 * 1.414 / 2 * 2 ** 0.5
                if close and lit and rng2.random() < 0.4: continue
                x0, y0 = x + rng2.normal(0, 0.3 * u), y + rng2.normal(0, 0.3 * u)
                wd0 = ((0.8 + 1.6 * sl) * (0.8 + 0.3 * shd) if not close else (0.9 if lit else 1.2 + 0.8 * sl)) * Z
                pts = [(x0 * SSf - uy * wd0 / 2, y0 * SSf + ux * wd0 / 2), (x0 * SSf + uy * wd0 / 2, y0 * SSf - ux * wd0 / 2),
                       ((x0 + ux * L) * SSf + uy * wd0 / 4, (y0 + uy * L) * SSf - ux * wd0 / 4), ((x0 + ux * L) * SSf - uy * wd0 / 4, (y0 + uy * L) * SSf + ux * wd0 / 4)]
                d.polygon(pts, fill=ink + ((int(100 + 100 * shd),) if not close else ((100,) if lit else (int(150 + 80 * shd),))))     # tapered stroke
    # 2) pale crest line along the spine (unhachured)
    # 3) ravine: slanted strokes from both banks running down into a faint broken thalweg (not a trench symbol)
    seg = []
    for (x0, y0), (x1, y1) in [pr for _r in RAVINES for pr in zip(np.array([c(p) for p in _r], np.float32)[:-1], np.array([c(p) for p in _r], np.float32)[1:])]:
        L = np.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        for t in np.arange(0, L, 6 * Z):
            mx, my = x0 + ux * t, y0 + uy * t
            for sgn in (1, -1):
                ang = np.radians(35); nx, ny = uy * sgn, -ux * sgn                # normal pointing to this bank
                sx, sy = mx + nx * 10 * Z, my + ny * 10 * Z
                dx, dy = -nx * np.cos(ang) + ux * np.sin(ang), -ny * np.cos(ang) + uy * np.sin(ang)
                d.line([(sx, sy), (sx + dx * (8 if not close else 6) * Z, sy + dy * (8 if not close else 6) * Z)], fill=ink + ((160 if not close else 110),), width=max(1, round(1.2 * Z)))
        for t in np.arange(0, L, 3 * Z): seg.append((x0 + ux * t + rng2.normal(0, 0.2 * Z), y0 + uy * t + rng2.normal(0, 0.2 * Z)))
    for i in range(0, len(seg) - 1, 1):
        if (i // 5) % 3 != 2: d.line([seg[i], seg[i + 1]], fill=ink + (110,), width=max(1, round(1.0 * Z)))
    # 4) field: crisp dashed border + parallel furrows along the long axis
    for poly in ST['fields']:
        P2 = np.array([c(p) for p in poly], np.float32)
        for _ in range(2): P2 = np.concatenate([[0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b] for a, b in zip(P2, np.roll(P2, -1, 0))])   # Chaikin rounding
        P2 = P2 + rng2.normal(0, 1.2 * Z, P2.shape).astype(np.float32); ctr = P2.mean(0); ev = np.linalg.eigh(np.cov((P2 - ctr).T))[1][:, -1]
        nx, ny = -ev[1], ev[0]
        fm = Image.new('L', (W * SSf, H * SSf), 0); ImageDraw.Draw(fm).polygon([tuple(p) for p in P2], fill=255)
        lay = Image.new('L', (W * SSf, H * SSf), 0); dl = ImageDraw.Draw(lay); R = np.abs(P2 - ctr).max() * 1.5
        for o in np.arange(-R, R, 5 * Z):
            pts = [(ctr[0] + ev[0] * t + nx * (o + np.sin(t / (80 * Z)) * Z), ctr[1] + ev[1] * t + ny * (o + np.sin(t / (80 * Z)) * Z)) for t in np.arange(-R, R, 6 * Z)]
            dl.line(pts, fill=90, width=max(1, round(1.0 * Z)))
        from PIL import ImageChops
        d.bitmap((0, 0), ImageChops.multiply(lay, fm), fill=ink + (255,))
        bd = [tuple(p) for p in P2] + [tuple(P2[0])]
        for (x0, y0), (x1, y1) in zip(bd[:-1], bd[1:]):
            L = np.hypot(x1 - x0, y1 - y0)
            for t in np.arange(0, L, 8 * Z): d.line([(x0 + (x1 - x0) * t / L, y0 + (y1 - y0) * t / L), (x0 + (x1 - x0) * min(t + 4 * Z, L) / L, y0 + (y1 - y0) * min(t + 4 * Z, L) / L)], fill=ink + (120,), width=max(1, round(1.0 * Z)))
    # 5) railroad: pale bed, rail, jittered ties (rail/tunnel drawn a bit bigger on the close image so they stay legible)
    Z = (1.5 if not close else 0.9) * SSf
    for seg_ in ST['rail']:
        pts = [c(p) for p in seg_]
        d.line(pts, fill=(196, 190, 146, 120), width=max(2, round(7 * Z)), joint='curve')
        for (x0, y0), (x1, y1) in zip(pts[:-1], pts[1:]):
            L = np.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
            for t in np.arange(0, L, 8 * Z):
                a_ = rng2.normal(0, 0.12); vx, vy = -uy * np.cos(a_) - ux * np.sin(a_), ux * np.cos(a_) - uy * np.sin(a_); hl = (3 + rng2.normal(0, 0.35)) * Z
                px, py = x0 + ux * t, y0 + uy * t; d.line([(px - vx * hl, py - vy * hl), (px + vx * hl, py + vy * hl)], fill=(40, 36, 16, 235), width=max(1, round(1.3 * Z)))
        d.line(pts, fill=(40, 36, 16, 255), width=max(1, round(2.2 * Z)), joint='curve')
    # 6) tunnel: pale dashed hidden line on top + outward-facing portals
    if not ST.get('tunnel'): return
    a_, b_ = [c(p) for p in ST['tunnel']]
    L = np.hypot(b_[0] - a_[0], b_[1] - a_[1]); ux, uy = (b_[0] - a_[0]) / L, (b_[1] - a_[1]) / L
    for t in np.arange(0, L, 11 * Z): d.line([(a_[0] + ux * t, a_[1] + uy * t), (a_[0] + ux * min(t + 6 * Z, L), a_[1] + uy * min(t + 6 * Z, L))], fill=(215, 205, 160, 220), width=max(1, round(2.2 * Z)))
    for (px, py), sgn in ((a_, -1), (b_, 1)):
        ox, oy = ux * sgn, uy * sgn; nx, ny = -oy, ox                       # o = outward along the track, n = across
        for side in (-1, 1):                                                # cutting walls leading into the portal
            for k in range(4):
                bx, by = px + ox * (6 + 4 * k) * Z + nx * side * (7 - k * 0.5) * Z, py + oy * (6 + 4 * k) * Z + ny * side * (7 - k * 0.5) * Z
                d.line([(bx, by), (bx + nx * side * 5 * Z, by + ny * side * 5 * Z)], fill=ink + (170,), width=max(1, round(1.2 * Z)))
        arch = [(px + nx * 5 * Z * np.cos(t) + ox * 4 * Z * np.sin(t), py + ny * 5 * Z * np.cos(t) + oy * 4 * Z * np.sin(t)) for t in np.linspace(0, np.pi, 14)]
        d.polygon(arch, fill=(20, 18, 10, 255))                            # horseshoe opening, 10 x 8 px
        d.line(arch, fill=(160, 150, 120, 255), width=max(1, round(1.5 * Z)), joint='curve')    # stone rim on the arch only
def sh2(m, dy, dx): return sh(sh(m, dy).T, dx).T
def sh(m, dy): o = np.zeros_like(m); (o.__setitem__(slice(dy, None), m[:-dy]) if dy > 0 else o.__setitem__(slice(None, dy), m[-dy:])); return o

# ---------- WIDE look: warm khaki paper ----------
g = np.array([float(c) for c in P['ground'].split(',')], np.float32)
v = fbm(120) * 2.0 + fbm(24 * K / 1.5) * 2.2 + fbm(9) * 3.0 + fbm(3) * 1.6
a = np.stack([g[0] + v + fbm(6) * 1.5, g[1] + v, g[2] + v * 0.75], -1) + rng.standard_normal((H, W, 1)).astype(np.float32) * 2
# river: cut-paper bevel. top inner band blue-grey (shadow side), pale fill, sharp lower edge + warm dark line under it
top = (wB & ~sh2(wB, round(3.5 * K), round(2 * K))) | (wD & ~sh2(wD, round(2.5 * K), round(1.5 * K))); below = sh(water, round(3 * K)) & ~water
a[below] = a[below] * 0.5 + np.array([148, 146, 122], np.float32) * 0.5
yy = np.cumsum(water, axis=0).astype(np.float32)          # depth into the river from its top edge (for the soft fill gradient)
if P['green']:                                            # owner 2026-11-05: one colour for the whole map, the greener (close) one
    lum_ = 4.0 * fbm(0.7) + 2.5 * fbm(1.6) + 3 * fbm(5) + 2.2 * fbm(40); fl_ = fbm(3); sp_ = (fbm(1.5) > 1.4)[..., None]   # critic r3: ref turf (107,112,62)
    a = np.stack([106 + lum_ + fl_ * 4, 111 + lum_ - fl_, 61 + lum_ * 0.75 - fl_ * 2], -1) + sp_ * np.array([6, 0, -4], np.float32); del lum_, fl_, sp_
    a[below] = a[below] * 0.6
    a = story_paint(a)
else:
    a = story_paint(a)
a = cv2.GaussianBlur(a, (0, 0), 0.6)
a[water] = (77, 125, 154) if P['green'] else (213, 229, 240); a[top] = (60, 100, 126) if P['green'] else (154, 173, 183)
wm = cv2.GaussianBlur(cv2.dilate(water.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 2)[..., None]
a = a * (1 - wm) + cv2.GaussianBlur(a, (0, 0), 1.0) * wm
img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

# ---------- vegetation (drawn at 2x, then softened) ----------
SS = 2; S = SS * K
G = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(G)
MULT = bool(P['mult'])
if MULT: F = Image.new('L', (W * SS, H * SS), 255); dF = ImageDraw.Draw(F)
INK, DARK, MID, LITE, UNDER = (50, 44, 20, 255), (86, 81, 52, 255), (118, 112, 82, 255), (150, 145, 108, 255), (70, 64, 35, 255)
if MULT: INK = (45, 40, 18, 255)
if P['green'] and P['tint']: INK, DARK, MID, LITE, UNDER = (30, 34, 14, 255), (58, 70, 34, 255), (84, 98, 50, 255), (120, 130, 70, 255), (44, 54, 24, 255)
wd = ndimage.distance_transform_edt(~cv2.resize(water.astype(np.uint8), (W // 8, H // 8), interpolation=cv2.INTER_NEAREST).astype(bool)) * 8
def wdist(x, y): return wd[min(int(y // 8), wd.shape[0] - 1), min(int(x // 8), wd.shape[1] - 1)]
fn = fbm(260) + fbm(90) * 0.6
fn += 0.9 * np.clip(1 - cv2.resize(wd.astype(np.float32), (W, H)) / (90 * K), 0, 1)      # woods hug the rivers
thr = np.quantile(fn, 1 - P['forest'])
def jit(pts, s, amt=0.08): return [(x + rng.normal(0, amt) * s, y + rng.normal(0, amt) * s) for x, y in pts]
def streak(x, y, s):
    if MULT: dF.line([(x - 2 * s, y + 1 * s), (x + 14 * s, y + 2 * s)], fill=150, width=max(2, round(3 * s))); return
    d.line([(x - 2 * s, y + 1 * s), (x + 14 * s, y + 2 * s)], fill=(60, 55, 30, 110), width=max(2, round(3 * s)))
def dome(x, y, s):                                   # mushroom dome ~21x15 screen px: thick dark arch, light hollow inside, open base, dark base smudge
    rx, ry = 8.5 * s * rng.uniform(0.85, 1.15), 8.5 * s * rng.uniform(0.85, 1.12); bump = rng.uniform(0, 6.28); lean = rng.uniform(-0.25, 0.25); arch = []
    cy = y - ry * 0.95
    for i in range(55):                                # lumpy ~300-degree crown, open at the bottom-left where the trunk goes
        t = 0.6 * np.pi + 1.8 * np.pi * i / 54; sc = 1 + 0.18 * abs(np.sin(1.5 * (t - 0.6 * np.pi) * 2 + bump)) - 0.06
        arch.append((x + rx * np.cos(t) * sc - lean * rx * np.sin(t) * 0.3, cy + ry * 0.92 * np.sin(t) * sc))
    arch = jit(arch, s * 5, 0.05)
    if MULT:                                         # ink-and-wash on green: fills shade the turf, outline stays sepia
        dF.polygon(arch, fill=186); dF.chord([x - rx * 0.6, cy - ry * 0.1, x + rx * 1.05, cy + ry * 1.05], -10, 120, fill=135)
        d.line(arch, fill=INK, width=max(2, round(2.0 * s)), joint='curve')
        d.line([(x - rx * 0.1, cy + ry * 0.7), (x, y + 2 * s)], fill=INK, width=max(2, round(2 * s)))
        for k in range(2):
            r = rx * rng.uniform(0.22, 0.32); px, py = x + rng.uniform(0.05, 0.45) * rx, cy + rng.uniform(-0.55, -0.1) * ry
            st = rng.uniform(170, 220); d.arc([px - r, py - r * 0.75, px + r, py + r * 0.75], st, st + rng.uniform(100, 150), fill=INK, width=max(1, round(1.4 * s)))
        return
    d.polygon(arch, fill=(MID[:3] + (235,)) if P['green'] and P['tint'] else (128, 122, 84, 235))
    d.chord([x - rx * 0.6, cy - ry * 0.1, x + rx * 1.05, cy + ry * 1.05], -10, 120, fill=(50, 44, 20, 255))   # dark crescent lower right
    d.line(arch, fill=INK if P['green'] and P['tint'] else (40, 35, 14, 255), width=max(2, round(2.4 * s)), joint='curve')
    d.line([(x - rx * 0.1, cy + ry * 0.7), (x, y + 2 * s)], fill=(40, 35, 14, 255), width=max(2, round(2 * s)))
    for k in range(rng.integers(1, 3)):
        r = rx * rng.uniform(0.3, 0.42); px, py = x + rng.uniform(-0.35, 0.3) * rx, cy + rng.uniform(-0.4, 0.15) * ry
        st = rng.uniform(170, 220); d.arc([px - r, py - r * 0.75, px + r, py + r * 0.75], st, st + rng.uniform(120, 170), fill=(40, 35, 14, 255), width=max(1, round(1.6 * s)))
def pine(x, y, s):                                   # plain A-frame ~15x24 screen px, light left half, dark right half
    h, w = 21 * s * rng.uniform(0.9, 1.1), 8.5 * s * rng.uniform(0.9, 1.1)
    tp, l, r, m = (x + rng.normal(0, 0.8) * s, y - h), (x - w, y), (x + w, y), (x, y)
    if MULT:
        dF.polygon([tp, l, r], fill=135); dF.polygon([tp, l, (x - 0.3 * w, y)], fill=240); dF.line([(x - w * 0.6, y + 1 * s), (x + w * 1.6, y + 1.8 * s)], fill=140, width=max(2, round(2.6 * s)))
        d.line(jit([tp, l, r], s * 4) + [tp], fill=INK, width=max(1, round(1.3 * s)), joint='curve'); d.line([(x, y), (x, y + 2.5 * s)], fill=INK, width=max(1, round(1.6 * s)))
        return
    d.polygon([tp, l, r], fill=DARK); d.polygon([tp, l, (x - 0.3 * w, y)], fill=MID)
    d.line([((tp[0] + r[0]) / 2 - 1.5 * s, (tp[1] + y) / 2 + 2 * s), (x + w * 0.45, y - 1 * s)], fill=INK, width=max(1, round(1.3 * s)))
    d.line([(x - w * 0.6, y + 1 * s), (x + w * 1.6, y + 1.8 * s)], fill=(44, 39, 16, 200), width=max(2, round(2.6 * s)))
    d.line(jit([tp, l, r], s * 4) + [tp], fill=INK, width=max(1, round(1.3 * s)), joint='curve')
    d.line([(x, y), (x, y + 2.5 * s)], fill=INK, width=max(1, round(1.6 * s)))
# clump centres by dart throwing inside the woods field; one tree type per clump
clumps = []; tries = 0
while tries < 60000:
    tries += 1; x, y = rng.uniform(30, W - 30), rng.uniform(60, H - 20)
    if fn[int(y), int(x)] < thr or wdist(x, y) < 10 * K or (ST and treeoff[int(y), int(x)]): continue
    R = rng.uniform(30, 60) * K
    if any((x - cx) ** 2 + (y - cy) ** 2 < (R + cr + rng.uniform(15, 50) * K) ** 2 for cx, cy, cr, _ in clumps): continue
    clumps.append((x, y, R, 'pine' if rng.random() < 0.45 else 'dome'))
trees, hatch = [], []
for cx, cy, R, t in clumps:
    step = (17 if t == 'pine' else 12.5) * K; ang = rng.uniform(0, 6.28); rng_k = rng.integers(3, 6); lob = rng.uniform(0.3, 0.5)
    for yy_ in np.arange(cy - R, cy + R, step * (0.65 if t == 'pine' else 0.7)):
        for xx_ in np.arange(cx - R * 1.2, cx + R * 1.2, step):
            x, y = xx_ + rng.uniform(-0.45, 0.45) * step, yy_ + rng.uniform(-0.45, 0.45) * step
            if rng.random() < (0.2 if t == 'pine' else 0.06): continue
            dx, dy = (x - cx) / (R * 1.2), (y - cy) / R; th = np.arctan2(dy, dx)
            if dx * dx + dy * dy > (1 + lob * np.sin(rng_k * th + ang) + 0.15 * np.sin(7 * th)) ** 2 or wdist(x, y) < (19 if t == 'pine' else 14) * K or (ST and treeoff[min(int(y), H - 1), min(int(x), W - 1)]): continue
            trees.append((y, x, t))
    for k in range(rng.integers(8, 14)):
        y = cy + rng.uniform(0.3, 1.1) * R; x0 = cx + rng.uniform(-1.0, 0.7) * R
        hatch.append((x0, y, rng.uniform(10, 30) * K))
for _ in range(8):                                     # a few lone pines near clumps
    cx, cy, R, _t = clumps[rng.integers(0, len(clumps))]; x, y = cx + rng.uniform(-1, 1) * (R + 60 * K), cy + rng.uniform(-1, 1) * (R + 40 * K)
    if 0 < x < W and 0 < y < H and wdist(x, y) > 14 * K: trees.append((y, x, 'pine'))
for x0, y, L in hatch:
    if MULT: dF.line([(x0 * SS, y * SS), ((x0 + L) * SS, y * SS)], fill=150, width=max(2, round(1.7 * S)))
    else: d.line([(x0 * SS, y * SS), ((x0 + L) * SS, y * SS)], fill=(70, 64, 35, 120), width=max(2, round(2.2 * S)))
for y, x, t in sorted(trees, key=lambda p: p[0]):
    s = S * rng.uniform(0.88, 1.12); streak(x * SS, y * SS, s); (pine if t == 'pine' else dome)(x * SS, y * SS, s)
# grass patches: faint long hatch rows first, calligraphic tufts sitting on them
def blade(x, y, h, bend, s):
    pts_l, pts_r = [], []
    for i in range(9):
        t = i / 8; px = x + bend * t ** 3; py = y - h * t; wdt = ((1.4 if MULT else 1.2) - (1.15 if MULT else 0.95) * t) * s
        pts_l.append((px - wdt, py)); pts_r.append((px + wdt, py))
    d.polygon(pts_l + pts_r[::-1], fill=(40, 36, 16, 255) if MULT else (50, 44, 20, 255))
def tuft(x, y, s):                                     # mixed asymmetric glyphs: hooked 'fr', straight 'il', curling fan
    kind = rng.choice(3, p=[0.15, 0.15, 0.7]) if MULT else rng.choice(3, p=[0.33, 0.33, 0.34]); h0 = rng.uniform(12, 16) * s * (1.25 if MULT else 1)
    if kind == 0:
        blade(x, y, h0, rng.choice([-1, 1]) * rng.uniform(0, 3) * s, s); blade(x + 1 * s, y - h0 * 0.45, h0 * 0.45, rng.choice([-1, 1]) * rng.uniform(7, 11) * s, s * 0.8)
    elif kind == 1:
        for k in range(rng.choice([2, 3])): blade(x + k * 2.6 * s, y, h0 * rng.uniform(0.7, 1.0), rng.uniform(-1.5, 1.5) * s, s)
    else:
        nb = rng.choice([3, 4]) if MULT else rng.choice([2, 3, 4], p=[0.35, 0.4, 0.25])
        for k in range(nb):
            o = (k - (nb - 1) / 2); sg = np.sign(o) if (o != 0 and rng.random() < 0.7) else rng.choice([-1, 1])
            blade(x + o * 2.2 * s, y, h0 * rng.uniform(0.7, 1.05), (sg * rng.uniform(7, 11) if abs(o) >= 0.5 else rng.uniform(-1.5, 1.5)) * s, s)
n = tries = 0
while n < P['patches'] and tries < 20000:
    tries += 1; x, y = rng.uniform(80, W - 200 * K), rng.uniform(80, H - 80)
    f = fn[int(y), int(x)]
    if f > thr - 0.1 or wdist(x, y) < 25 * K: continue
    pw, ph = rng.uniform(110, 170) * K, rng.uniform(70, 100) * K
    rows = rng.integers(7, 12)
    for j in range(rows):
        ry_ = y + j * 7 * K * rng.uniform(0.9, 1.2); x0 = x + rng.uniform(-0.15, 0.3) * pw; L = rng.uniform(25, 60) * K
        if MULT: dF.line([(x0 * SS, ry_ * SS), (min(x0 + L, x + pw) * SS, ry_ * SS)], fill=165, width=max(2, round(1.7 * S)))
        else: d.line([(x0 * SS, ry_ * SS), (min(x0 + L, x + pw) * SS, ry_ * SS)], fill=(105, 100, 66, 150), width=max(2, round(1.7 * S)))
    for k in range(rng.integers(6, 13)):
        j = rng.integers(0, rows); tuft((x + rng.uniform(0, pw)) * SS, (y + j * 7 * K) * SS, S * rng.uniform(0.85, 1.1))
    n += 1
story_draw(d, SS, (45, 40, 18))
G = G.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur((0.5 if MULT else 0.8) * K))
Ga = np.asarray(G).copy(); Ga[water, 3] = 0; G = Image.fromarray(Ga); del Ga                # no ink over the water
if MULT:
    Fa = np.asarray(F.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5 * K))).astype(np.float32)[..., None] / 255
    Fa[water] = 1.0
    img = Image.fromarray(np.clip(np.asarray(img).astype(np.float32) * Fa, 0, 255).astype(np.uint8)); del Fa, F
img.paste(G, (0, 0), G); img.save(out, quality=92); print(out, 'clumps', len(clumps), 'trees', len(trees), 'patches', n)

# ---------- CLOSE battle look (same woods + rivers; tuned for s ~ 3): mossy turf, top-down canopies; vignette is done in CSS ----------
if P['close']:
    q = 1 / 1.5                                        # screen px -> image px at s ~ 3
    lum = 5 * fbm(max(0.5, 0.7 * q)) + 4 * fbm(1.6 * q) + 3 * fbm(5 * q) + 2.5 * fbm(40 * q)
    fl = fbm(3 * q); sp = (fbm(1.0) > 1.4)[..., None]
    c = np.stack([106 + lum + fl * 4, 111 + lum - fl, 61 + lum * 0.75 - fl * 2], -1) + sp * np.array([6, 0, -4], np.float32); del sp
    c = story_paint(c, close=True)
    bank = (cv2.dilate(water.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0) & ~water
    bs = cv2.GaussianBlur(sh2(water, round(2 * K), round(1.5 * K)).astype(np.float32) * (~water), (0, 0), 2)[..., None]
    c = c * (1 - 0.35 * bs); c[water] = (77, 125, 154); c[top] = (60, 100, 126)
    img = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8))
    G = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(G)
    Sh = Image.new('L', (W * SS, H * SS), 0); ds = ImageDraw.Draw(Sh)
    cans = []
    ctrees = [(y + rng.uniform(-14, 14) * K, x + rng.uniform(-16, 16) * K, t) for y, x, t in trees for _ in range(3)]
    ctrees = [p_ for p_ in ctrees if wdist(p_[1], p_[0]) > 9 * K]
    for y, x, t in ctrees:
        R = rng.uniform(12, 20) * q * SS * (0.85 if t == 'pine' else 1); X, Y = x * SS, y * SS
        cs = [(X + rng.uniform(-0.45, 0.45) * R, Y + rng.uniform(-0.45, 0.45) * R, R * rng.uniform(0.3, 0.8)) for _ in range(rng.integers(8, 15))]
        cans.append(cs)
        for cx, cy, r in cs: ds.ellipse([cx - r + 3 * SS * q, cy - r + 3 * SS * q, cx + r + 3 * SS * q, cy + r + 3 * SS * q], fill=255)
    Sh = Sh.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(6 * q))
    img = Image.composite(Image.new('RGB', (W, H), (15, 20, 10)), img, Sh.point(lambda v: int(v * 0.35)))
    for cs in cans:                                    # dark rim on the south-east half of each lobe
        for cx, cy, r in cs: d.ellipse([cx - r + 1.2 * SS * q, cy - r + 1.2 * SS * q, cx + r + 1.2 * SS * q, cy + r + 1.2 * SS * q], fill=(34, 44, 24, 255))
    for cs in cans:
        for cx, cy, r in cs: d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(46, 58, 32, 255))
    for cs in cans:                                    # lit north-west disc + stipple only inside it
        for cx, cy, r in cs:
            lx, ly, lr = cx - 0.25 * r, cy - 0.25 * r, r * 0.7
            d.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], fill=(62, 76, 40, 160))
            for k in range(rng.integers(3, 8)):
                a_, rr = rng.uniform(0, 6.28), lr * np.sqrt(rng.uniform(0, 1)); pr = max(1.0, rng.uniform(0.7, 1.4) * q) * SS
                px, py = lx + rr * np.cos(a_), ly + rr * np.sin(a_); d.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(74, 90, 48, 220))
    story_draw(d, SS, (45, 40, 18), close=True)
    G = G.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.5)); img.paste(G, (0, 0), G)
    img.save(P['close'], quality=92); print(P['close'])
