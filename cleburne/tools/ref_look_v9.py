"""JUDGE 2 TEST (owner 2026-10-31, not applied anywhere): REDESIGN of how the basemap is DRAWN, after the reference film's smooth,
painterly map (warm sand relief, soft shadow sides, natural pale river, hairline creeks, 3D tree canopies in ribbons along the water).
Copy of make_ref_look_test.py, rewritten. Not a recolour: every layer is rendered by a different method.
usage (from cleburne/): python3 tools/judge_ref2.py BASE CX CY OUT.jpg [VARIANT]   (CX,CY = crop centre in the 5760x3240 HD grid)
  VARIANT: A = riparian ribbons + sparse groves, B = denser groves, C = A without DEM gullies
  env OVERLAY=out.jpg : also write an overlay-compatibility test (territory multiply + 54 px counters + 15 px glowing front)
Method (per layer):
  terrain  : 3-scale smoothed DEM (sigma 2 / 5 / 14 px) -> illumination RELATIVE TO FLAT (flats = one calm sand tone), soft tanh
             compression, gradient-mapped (shadow brown -> sand -> sunlit orange -> pale highlight), slope-warmed base, ridge lift +
             valley ambient occlusion from a difference of Gaussians, 2-octave paper grain (+-3 %).
  water    : data mask (rivS + wide parts of det_riv) blurred and re-thresholded (smooth banks), colour by distance from the bank
             (darker grey-green edge -> pale grey-blue centre), soft pale sand bank strip, faint low-frequency water texture.
  creeks   : mapped creeks (det_riv minus wide water) as soft dark hairlines + DEM-flow gullies (D8 accumulation on the
             smoothed DEM, numba) traced as Chaikin-smoothed polylines, width ~ log(area), drawn 4x supersampled.
  trees    : crowns placed only where det_tree says forest: dense ribbons within ~34 px of the river, single/double rows on
             creeks, clustered groves elsewhere (smooth noise field, thinner where forest cover thins). Each crown = a bumpy
             dome (main hemisphere + 4-7 sub-lobes) stamped into a CANOPY HEIGHT FIELD at 2x; the field is hill-shaded (NW sun),
             height-darkened at crown gaps (AO), tinted per crown, cast-shadowed to the SE onto ground/water, area-downsampled.
  grade    : warm sand balance, gentle S-curve, soft vignette, fine grain."""
import sys, os, time, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import numba

t0 = time.time()
base, cx, cy, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
VAR = sys.argv[5] if len(sys.argv) > 5 else "A"
W, H, PAD = 1920, 1080, 48
x0, y0 = max(0, min(5760 - W, cx - W // 2)), max(0, min(3240 - H, cy - H // 2))
# padded window (filters need context; the full-map bake has no crop at all)
px0, py0 = max(0, x0 - PAD), max(0, y0 - PAD)
px1, py1 = min(5760, x0 + W + PAD), min(3240, y0 + H + PAD)
ox, oy = x0 - px0, y0 - py0
PW, PH = px1 - px0, py1 - py0
box = (px0, py0, px1, py1)
rng = np.random.default_rng(7)
G = ndimage.gaussian_filter
MPP = 7.82                                         # metres per HD px

def ss(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

el = np.load(f"assets/src/{base}_hd_elev.npy")[py0:py1, px0:px1].astype(np.float32)
_rA = np.array(Image.open(f"assets/media/{base}_det_riv.png").convert("RGBA").crop(box))[..., 3] > 40
_rS = np.array(Image.open(f"assets/media/{base}_det_rivS.png").convert("RGBA").crop(box))[..., 3] > 40
_burn = ndimage.binary_dilation(_rA & ~ndimage.binary_dilation(_rS, iterations=4), iterations=5)
el = np.where(_burn, G(ndimage.grey_closing(el, size=11), 1.5), el)   # v7: no straight ghost trench under the creek hairline

# ---------------- TERRAIN ----------------
L_AZ, L_ALT = np.radians(315), np.radians(42)
Lv = np.array([np.cos(L_ALT) * np.sin(L_AZ), -np.cos(L_ALT) * np.cos(L_AZ), np.sin(L_ALT)])  # x right, y down, z up
def illum(e, zx):
    gy, gx = np.gradient(e * zx / MPP)
    n = 1 / np.sqrt(gx * gx + gy * gy + 1)
    return (-gx * Lv[0] - gy * Lv[1] + Lv[2]) * n - Lv[2]           # 0 on flat ground, + lit, - shadow
e_f, e_m, e_b = G(el, 2.0), G(el, 5.0), G(el, 14.0)
I = 0.50 * illum(e_m, 2.6) + 0.32 * illum(e_b, 3.4) + 0.18 * illum(e_f, 2.0)
I = np.tanh(I * 1.5) * 0.62                                               # soft compression: no plastic hot spots
I = G(I, 1.0)
gy, gx = np.gradient(e_m / MPP)
slope = ss(0.02, 0.35, np.hypot(gx, gy))
curv = G(el, 3) - G(el, 16)                                         # metres; + ridge, - valley
ridge = ss(0, 10, curv); valley = ss(0, 12, -curv)
SAND = np.array([190, 178, 134.]); EARTH = np.array([178, 156, 108.])
SHADOW = np.array([112, 96, 66.]); LIT = np.array([208, 188, 132.]); HI = np.array([226, 212, 166.])
basec = SAND * (1 - 0.7 * slope[..., None]) + EARTH * (0.7 * slope[..., None])
lit = np.clip(I, 0, 1)[..., None]; sh = np.clip(-I, 0, 1)[..., None]
col = basec + (LIT - basec) * np.clip(lit * 1.25, 0, 1) + (HI - LIT) * np.clip(lit * 1.25 - 1, 0, 1) * 0 \
      + (HI - basec) * ss(0.55, 1.0, lit) * 0.35
col = col * (1 - sh * 0.95) + SHADOW * (sh * 0.95)
col *= (1 + 0.07 * ridge - 0.16 * valley)[..., None]                # ridge emphasis + ambient occlusion
nz = rng.standard_normal((PH, PW)).astype(np.float32)
grain = 0.55 * G(nz, 1.0) / 0.28 + 0.45 * G(nz, 3.5) / 0.08
paper = G(nz, 0.6) / 0.35
col *= (1 + 0.016 * grain + 0.022 * paper)[..., None]

# swamps: damp olive ground
swa = np.array(Image.open(f"assets/media/{base}_det_swamp.png").convert("RGBA").crop(box))[..., 3].astype(np.float32) / 255
swa = G(swa, 2.5)
col = col * (1 - 0.45 * swa[..., None]) + np.array([118, 128, 88.]) * (0.45 * swa[..., None])

if os.environ.get("NEUTRAL") == "1":                                 # territory-friendly: pull the sand toward its luminance
    lum = col @ np.array([0.3, 0.59, 0.11]); col = col * 0.55 + lum[..., None] * 0.45 * np.array([1.02, 1.0, 0.94])
# ---------------- WATER ----------------
rivS = np.array(Image.open(f"assets/media/{base}_det_rivS.png").convert("RGBA").crop(box))[..., 3] > 40
rivA = np.array(Image.open(f"assets/media/{base}_det_riv.png").convert("RGBA").crop(box))[..., 3] > 40
wide = ndimage.binary_opening(rivA, iterations=3)
water0 = rivS | wide
water0 = water0 | (ndimage.binary_dilation(rivS, iterations=1) & (G(rivS.astype(np.float32), 3) < 0.35))
wsm = G(water0.astype(np.float32), 2.2)
wa = ss(0.38, 0.62, wsm)                                            # smooth antialiased banks
water = wa > 0.5
_lab, _n = ndimage.label(water); _sz = ndimage.sum(water, _lab, range(1, _n + 1))
water = np.isin(_lab, 1 + np.nonzero(_sz >= 400)[0]); wa = wa * G(water.astype(np.float32), 1.0) / np.maximum(G(water.astype(np.float32), 1.0), 1e-3) * water + wa * 0 * (~water)
din = ndimage.distance_transform_edt(water)
dout, (niy, nix) = ndimage.distance_transform_edt(~water, return_indices=True)
wmax = ndimage.maximum_filter(din, 81) + 1
rel = np.clip(din / np.maximum(wmax, 4), 0, 1)                       # 0 bank -> 1 centre
WEDGE, WMID, WCEN = np.array([118, 122, 114.]), np.array([142, 148, 144.]), np.array([160, 166, 162.])
wcol = WEDGE + (WMID - WEDGE) * ss(0, 0.35, rel)[..., None] + (WCEN - WMID) * ss(0.3, 1, rel)[..., None]
wtex = G(rng.standard_normal((PH, PW)).astype(np.float32), [2.0, 7.0]) / 0.1
spk = G(rng.standard_normal((PH, PW)).astype(np.float32), 0.6); spk /= spk.std()
wcol *= (1 + 0.012 * wtex + 0.055 * spk)[..., None]                 # stony speckle like the reference
bn = G(rng.standard_normal((PH, PW)).astype(np.float32), 6); bn /= bn.std()
_bigw = ndimage.binary_opening(water, iterations=3)
_dbig = ndimage.distance_transform_edt(~_bigw)
dirt = (1 - ss(2.0, np.maximum(5.5 + 1.5 * bn, 3.2), _dbig)) * (~water) * (_dbig < 9)
col = col * (1 - 0.75 * dirt[..., None]) + np.array([150, 132, 98.]) * (0.75 * dirt[..., None])
grass = ss(1.5, 4.0, _dbig) * (1 - ss(12 + 5 * bn, 20 + 5 * bn, _dbig)) * (~water) * (_dbig < 30)
col = col * (1 - 0.55 * grass[..., None]) + np.array([128, 138, 88.]) * (0.55 * grass[..., None])
rim = np.exp(-((din - 1.0) ** 2) / 1.5) * water

col = col * (1 - wa[..., None]) + wcol * wa[..., None]
col = col * (1 - 0.45 * rim[..., None]) + np.array([92, 86, 70.]) * (0.45 * rim[..., None])

# riparian meadow: a light green fringe on the floodplain next to the big water
mead = np.zeros((PH, PW), np.float32)
col = col * (1 - mead[..., None]) + np.array([150, 156, 100.]) * mead[..., None]

# ---------------- CREEKS (mapped + DEM flow) ----------------
SSx = 4
cre = rivA & ~ndimage.binary_dilation(water, iterations=2)
from skimage.morphology import skeletonize
_sk = skeletonize(cre).astype(np.float32)                           # thin hairline like the reference creeks
_wy = G(rng.standard_normal((PH, PW)).astype(np.float32), 3.0); _wx = G(rng.standard_normal((PH, PW)).astype(np.float32), 3.0)
_wy *= 2.2 / _wy.std(); _wx *= 2.2 / _wx.std()                       # wiggle: no ruler-straight creeks
_yy, _xx = np.mgrid[0:PH, 0:PW].astype(np.float32)
_sk = ndimage.map_coordinates(G(_sk, 0.6), [_yy + _wy, _xx + _wx], order=1)
cre_a = np.clip(_sk * 3.2, 0, 1) * 0.75

@numba.njit(cache=True)
def d8(e):
    h, w = e.shape; rec = -np.ones(h * w, np.int64)
    for y in range(1, h - 1):
        for x in range(1, w - 1):
            best = 0.0; bi = -1; z = e[y, x]
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dy == 0 and dx == 0: continue
                    d = (z - e[y + dy, x + dx]) / (1.4142 if dx != 0 and dy != 0 else 1.0)
                    if d > best: best = d; bi = (y + dy) * w + x + dx
            rec[y * w + x] = bi
    order = np.argsort(-e.ravel())
    acc = np.ones(h * w)
    for i in order:
        r = rec[i]
        if r >= 0: acc[r] += acc[i]
    return rec, acc

paths = []
if VAR != "C":
    DS = 2
    ed = G(el, 3.0)[::DS, ::DS].astype(np.float64)
    rec, acc = d8(ed)
    hd, wd = ed.shape
    TH = 260                                                         # cells (~ 0.25 km^2 at 15.6 m) -> a gully
    ch = acc >= TH
    wdn = ndimage.binary_dilation(water, iterations=6)[::DS, ::DS].ravel()
    credn = ndimage.binary_dilation(cre, iterations=7)[::DS, ::DS].ravel()
    ch &= ~wdn & ~credn                                             # mapped creeks are drawn from data; DEM adds the gullies
    has_up = np.zeros(hd * wd, bool)
    idx = np.nonzero(ch)[0]
    r = rec[idx]; ok = r >= 0
    has_up[r[ok][ch[r[ok]]]] = True
    seen = np.zeros(hd * wd, bool)
    for h0 in idx[~has_up[idx]]:
        p = [h0]; c = h0
        while True:
            seen[c] = True; n = rec[c]
            if n < 0 or not ch[n]: break
            p.append(n)
            if seen[n]: break
            c = n
        if len(p) > 3: paths.append([(int(q % wd) * DS + DS / 2, int(q // wd) * DS + DS / 2, acc[q]) for q in p])

def chaikin(pts, it=3):
    for _ in range(it):
        if len(pts) < 3: return pts
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]):
            q.append(tuple(0.75 * u + 0.25 * v for u, v in zip(a, b))); q.append(tuple(0.25 * u + 0.75 * v for u, v in zip(a, b)))
        q.append(pts[-1]); pts = q
    return pts

gl = Image.new("L", (PW * SSx, PH * SSx), 0); gd = ImageDraw.Draw(gl)
for p in paths:
    p = chaikin(p)
    for a, b in zip(p[:-1], p[1:]):
        wdt = 0.5 + 0.32 * np.log10(max(a[2], 1) / TH + 1) * 3        # 0.5 .. ~1.4 px
        gd.line([(a[0] * SSx, a[1] * SSx), (b[0] * SSx, b[1] * SSx)], fill=int(min(255, 140 + 60 * np.log10(a[2] / TH + 1))), width=max(1, int(wdt * SSx)))
gully = np.array(gl.resize((PW, PH), Image.BOX)).astype(np.float32) / 255
gully = G(gully, 0.5) * ss(0, 30, dout)
HAIR = np.array([78, 62, 42.])
col = col * (1 - 0.55 * gully[..., None]) + HAIR * (0.55 * gully[..., None])
col = col * (1 - 0.8 * cre_a[..., None]) + np.array([58, 52, 40.]) * (0.8 * cre_a[..., None])

# ---------------- TREES v8 (owner 2026-10-31): only around the river, not data-accurate,
# every tree a separate crown built from many small leaf clusters (the reference canopy)
K = 2
TR = np.random.default_rng(23)
def crown(R):
    s = int(np.ceil(R * 1.25)); yy, xx = np.mgrid[-s:s + 1, -s:s + 1].astype(np.float32)
    rr = np.sqrt(xx * xx + yy * yy)
    core = R * 0.88
    h = np.sqrt(np.clip(1 - (rr / core) ** 2, 0, None)) * R * 0.7
    lob = np.zeros_like(h)
    for _ in range(int(R * 1.2)):                                    # leaf clusters, also on the rim: a soft scalloped outline
        a_ = TR.uniform(0, 2 * np.pi); d = (TR.uniform(0, 1) ** 0.4) * R * 0.74; r = TR.uniform(0.22, 0.32) * R
        q = r * r - (xx - np.cos(a_) * d) ** 2 - (yy - np.sin(a_) * d) ** 2
        base_h = np.sqrt(np.clip(1 - (d / R) ** 2, 0, None)) * R * 0.7
        lob = np.maximum(lob, np.where(q > 0, base_h * 0.85 + np.sqrt(np.clip(q, 0, None)), 0))
    h = np.maximum(h, lob)
    return s, h.astype(np.float32)
KER = [crown(R) for R in np.linspace(10, 17, 24) * K for _ in range(2)]
# placement: a ribbon on each bank of the real water, set back behind the grass strip, with gaps
gap = G(rng.standard_normal((PH, PW)).astype(np.float32), 55); gap /= gap.std()
fld2 = G(rng.standard_normal((PH, PW)).astype(np.float32), 12); fld2 /= fld2.std()
halfw = wmax[niy, nix] - 1
band = np.clip(34 + 1.2 * halfw, 38, 80) * (1 + 0.25 * fld2)
cand = []
for _ in range(int(PW * PH / 25)):
    x, y = rng.uniform(0, PW), rng.uniform(0, PH); iy, ix = int(y), int(x)
    d = _dbig[iy, ix]
    if water[iy, ix] or d < 13 + 4 * fld2[iy, ix] or d > band[iy, ix]: continue
    if rng.random() > ss(-0.75, -0.15, gap[iy, ix]) * (1 - ss(0.7, 1.0, d / band[iy, ix]) * 0.8): continue
    cand.append((x, y))
from scipy.spatial import cKDTree
pts = []
if cand:                                                             # spacing ~ 1.3 crown radii: crowns touch, ground shows through
    cand = np.array(cand); TR.shuffle(cand); tree_ = []
    kd_pts = []
    occ = {}
    for x, y in cand:
        gx_, gy_ = int(x // 17.5), int(y // 17.5); bad = False
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for (u, w) in occ.get((gx_ + dx, gy_ + dy), ()):
                    if (u - x) ** 2 + (w - y) ** 2 < 300: bad = True
        if bad: continue
        occ.setdefault((gx_, gy_), []).append((x, y)); kd_pts.append((x, y))
    pts = kd_pts
_a = np.array(pts); _cnt = cKDTree(_a).query_ball_point(_a, r=60, return_length=True)
pts = [p_ for p_, c_ in zip(pts, _cnt) if c_ >= 4]                  # no lone trees
# v9: every tree is its own sprite (own light, own leaf detail, own shadow), drawn one by one,
# so neighbours never fuse: the front tree's edge and shadow fall on the tree behind (reference look)
TD, TM, TL, TH_ = np.array([28, 38, 20.]), np.array([60, 76, 38.]), np.array([104, 120, 60.]), np.array([158, 168, 100.])
def sprite(s, h):
    m = h > 0
    leaf = G(TR.standard_normal(h.shape).astype(np.float32), 0.7 * K); leaf /= leaf.std()
    leaf2 = G(TR.standard_normal(h.shape).astype(np.float32), 1.6 * K); leaf2 /= leaf2.std()
    hs = G(h, 0.45 * K) + (0.25 * leaf + 0.30 * leaf2) * K * m
    gy_, gx_ = np.gradient(hs)
    nn = 1 / np.sqrt(gx_ ** 2 + gy_ ** 2 + 1)
    li = np.clip((-gx_ * Lv[0] - gy_ * Lv[1] + Lv[2]) * nn, 0, 1)
    cav = ss(0.0, 2.5 * K, hs - ndimage.minimum_filter(np.where(m, hs, 0), size=int(4 * K)))
    hn = np.clip(h / h.max(), 0, 1)
    v = np.clip(li * (0.35 + 0.65 * ss(0.0, 0.7, hn)) * (0.6 + 0.4 * cav), 0, 1)[..., None]
    c = TD + (TM - TD) * ss(0.0, 0.42, v) + (TL - TM) * ss(0.38, 0.78, v) + (TH_ - TL) * ss(0.78, 1.0, v) * 0.9
    spk = (TR.random(h.shape) < 0.035) & (v[..., 0] > 0.6)              # sunlit leaf glints
    c = c + spk[..., None] * 22
    rim = ss(0.0, 1.6 * K, ndimage.distance_transform_edt(m))            # dark outline edge: each crown reads alone
    c = c * (0.50 + 0.50 * rim)[..., None]
    a = np.clip(G(m.astype(np.float32), 0.5), 0, 1) * m
    return c.astype(np.float32), a.astype(np.float32)
SPR = [(s, *sprite(s, h)) for s, h in KER]
YS, XS = PH * K, PW * K
big = np.repeat(np.repeat(col, K, 0), K, 1)                          # draw trees at 2x on top of the ground
pts.sort(key=lambda p_: (p_[1] + TR.uniform(-12, 12)))                 # draw order varies: no regular stacking
SH = (int(7 * K), int(5.5 * K))
for x, y in pts:
    s, c, a = SPR[int(TR.integers(0, len(SPR)))]
    if TR.random() < 0.5: c, a = c[:, ::-1], a[:, ::-1]
    if TR.random() < 0.5: c, a = c[::-1], a[::-1]
    c = c * (1 + 0.07 * TR.normal() * np.array([1.0, 0.95, 0.7])) + np.array([4, 2, -2.]) * TR.normal()
    X, Y = int(x * K), int(y * K)
    sa = G(a, 2.2 * K)
    for (dy, dx, arr, strength) in ((SH[0], SH[1], sa, 0.50), (0, 0, a, None)):
        ya, xa = Y - s + dy, X - s + dx; yb, xb = ya + a.shape[0], xa + a.shape[1]
        ky0, kx0 = max(0, -ya), max(0, -xa); ya2, xa2 = max(ya, 0), max(xa, 0); yb2, xb2 = min(yb, YS), min(xb, XS)
        if yb2 <= ya2 or xb2 <= xa2: continue
        sub = big[ya2:yb2, xa2:xb2]; aa = arr[ky0:ky0 + yb2 - ya2, kx0:kx0 + xb2 - xa2][..., None]
        if strength is not None: sub *= (1 - strength * aa)
        else: sub[:] = sub * (1 - aa) + c[ky0:ky0 + yb2 - ya2, kx0:kx0 + xb2 - xa2] * aa
col = big.reshape(PH, K, PW, K, 3).mean((1, 3))
# ---------------- GRADE ----------------
col = col[oy:oy + H, ox:ox + W]
c = np.clip(col / 255, 0, 1)
c = c + 0.06 * (c - c * c * (3 - 2 * c)) * -1                      # gentle S-curve
c = c * np.array([1.02, 1.0, 0.95])
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.52 * ss(0.30, 1.25, np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2))
c = c * vig[..., None] + rng.normal(0, 0.004, (H, W))[..., None]
img = Image.fromarray(np.clip(c * 255, 0, 255).astype(np.uint8))
img.save(out, quality=93)
print(out, "variant", VAR, len(pts), "crowns", len(paths), "gullies", f"{time.time() - t0:.1f}s")

# ---------------- OVERLAY COMPATIBILITY TEST ----------------
ovp = os.environ.get("OVERLAY")
if ovp:
    ctl = Image.open(os.environ.get("CTL", f"assets/media/hka_{base}_ctl_nov25e_mx.png")).convert("RGBA")
    ctl = ctl.resize((5760, 3240), Image.BILINEAR).crop((x0, y0, x0 + W, y0 + H))
    o = np.array(ctl).astype(np.float32) / 255
    b = np.array(img).astype(np.float32) / 255
    b = b * (1 - o[..., 3:]) + b * o[..., :3] * o[..., 3:]                       # CSS mix-blend-mode: multiply
    im2 = Image.fromarray(np.clip(b * 255, 0, 255).astype(np.uint8)).convert("RGBA")
    # 15 px two-colour glowing front (blue #2c57b7 / red #bc2528, glow 0.47)
    fr = [(int(W * (0.30 + 0.12 * np.sin(f * 6.0))), int(H * f)) for f in np.linspace(0.10, 0.90, 40)]
    fr = [(x + int(W * 0.25), y) for x, y in fr]
    fx = [(x + 0.0, y) for x, y in fr]
    def off(pl, d):
        q = []
        for i, (x, y) in enumerate(pl):
            a, bb = pl[max(i - 1, 0)], pl[min(i + 1, len(pl) - 1)]
            dx, dy = bb[0] - a[0], bb[1] - a[1]; L = np.hypot(dx, dy) + 1e-6
            q.append((x - dy / L * d, y + dx / L * d))
        return q
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gdw = ImageDraw.Draw(glow)
    gdw.line(off(fx, -6), fill=(44, 87, 183, 255), width=18, joint="curve"); gdw.line(off(fx, 6), fill=(188, 37, 40, 255), width=18, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(7)); ga = np.array(glow); ga[..., 3] = np.clip(ga[..., 3] * 0.47 * 1.6, 0, 255).astype(np.uint8)
    im2 = Image.alpha_composite(im2, Image.fromarray(ga))
    band = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(band)
    bd.line(off(fx, -3.75), fill=(44, 87, 183, 255), width=8, joint="curve"); bd.line(off(fx, 3.75), fill=(188, 37, 40, 255), width=8, joint="curve")
    im2 = Image.alpha_composite(im2, band)
    d = ImageDraw.Draw(im2)
    def counter(x, y, colr):
        d.rectangle((x - 30, y - 22, x + 30, y + 22), fill=(0, 0, 0, 90))
        d.rectangle((x - 27, y - 20, x + 27, y + 20), fill=colr, outline=(20, 20, 20, 255), width=2)
        d.line((x - 18, y - 12, x + 18, y + 12), fill=(247, 243, 234, 255), width=3); d.line((x - 18, y + 12, x + 18, y - 12), fill=(247, 243, 234, 255), width=3)
    for f, s in [(0.35, -1), (0.45, -1), (0.55, -1), (0.40, 1), (0.52, 1), (0.64, 1)]:
        i = int((f - 0.28) / 0.44 * 39); x, y = fr[i]
        counter(int(x + s * 60), int(y), (31, 79, 196, 255) if s < 0 else (196, 18, 31, 255))
    im2.convert("RGB").save(ovp, quality=93)
    print(ovp)
