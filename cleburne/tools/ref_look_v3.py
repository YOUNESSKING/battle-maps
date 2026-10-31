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

# ---------------- TERRAIN ----------------
L_AZ, L_ALT = np.radians(315), np.radians(42)
Lv = np.array([np.cos(L_ALT) * np.sin(L_AZ), -np.cos(L_ALT) * np.cos(L_AZ), np.sin(L_ALT)])  # x right, y down, z up
def illum(e, zx):
    gy, gx = np.gradient(e * zx / MPP)
    n = 1 / np.sqrt(gx * gx + gy * gy + 1)
    return (-gx * Lv[0] - gy * Lv[1] + Lv[2]) * n - Lv[2]           # 0 on flat ground, + lit, - shadow
e_f, e_m, e_b = G(el, 2.0), G(el, 5.0), G(el, 14.0)
I = 0.50 * illum(e_m, 2.6) + 0.32 * illum(e_b, 3.4) + 0.18 * illum(e_f, 2.0)
I = np.tanh(I * 2.4)                                               # soft compression: no plastic hot spots
I = G(I, 1.0)
gy, gx = np.gradient(e_m / MPP)
slope = ss(0.02, 0.35, np.hypot(gx, gy))
curv = G(el, 3) - G(el, 16)                                         # metres; + ridge, - valley
ridge = ss(0, 10, curv); valley = ss(0, 12, -curv)
SAND = np.array([176, 160, 112.]); EARTH = np.array([186, 148, 92.])
SHADOW = np.array([92, 72, 46.]); LIT = np.array([222, 172, 98.]); HI = np.array([238, 212, 156.])
basec = SAND * (1 - 0.7 * slope[..., None]) + EARTH * (0.7 * slope[..., None])
lit = np.clip(I, 0, 1)[..., None]; sh = np.clip(-I, 0, 1)[..., None]
col = basec + (LIT - basec) * np.clip(lit * 1.25, 0, 1) + (HI - LIT) * np.clip(lit * 1.25 - 1, 0, 1) * 0 \
      + (HI - basec) * ss(0.55, 1.0, lit) * 0.35
col = col * (1 - sh * 0.95) + SHADOW * (sh * 0.95)
col *= (1 + 0.07 * ridge - 0.16 * valley)[..., None]                # ridge emphasis + ambient occlusion
nz = rng.standard_normal((PH, PW)).astype(np.float32)
grain = 0.55 * G(nz, 1.0) / 0.28 + 0.45 * G(nz, 3.5) / 0.08
col *= (1 + 0.016 * grain)[..., None]

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
din = ndimage.distance_transform_edt(water)
dout, (niy, nix) = ndimage.distance_transform_edt(~water, return_indices=True)
wmax = ndimage.maximum_filter(din, 81) + 1
rel = np.clip(din / np.maximum(wmax, 4), 0, 1)                       # 0 bank -> 1 centre
WEDGE, WMID, WCEN = np.array([110, 122, 112.]), np.array([132, 146, 144.]), np.array([158, 170, 170.])
wcol = WEDGE + (WMID - WEDGE) * ss(0, 0.35, rel)[..., None] + (WCEN - WMID) * ss(0.3, 1, rel)[..., None]
wtex = G(rng.standard_normal((PH, PW)).astype(np.float32), [2.0, 7.0]) / 0.1
wcol *= (1 + 0.018 * wtex)[..., None]
bank = np.exp(-dout / 3.0) * (~water) * ss(0.5, 2.5, dout)
col = col * (1 - 0.45 * bank[..., None]) + np.array([206, 194, 152.]) * (0.45 * bank[..., None])
col = col * (1 - wa[..., None]) + wcol * wa[..., None]

# riparian meadow: a light green fringe on the floodplain next to the big water
mead = G(((dout < 60) & (dout > 0) & (slope < 0.35)).astype(np.float32), 10) * 0.30
col = col * (1 - mead[..., None]) + np.array([150, 156, 100.]) * mead[..., None]

# ---------------- CREEKS (mapped + DEM flow) ----------------
SSx = 4
cre = rivA & ~ndimage.binary_dilation(water, iterations=2)
cre_a = G(cre.astype(np.float32), 0.7)
cre_a = np.clip(cre_a * 1.3, 0, 1) * 0.8

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
col = col * (1 - 0.8 * cre_a[..., None]) + np.array([72, 64, 46.]) * (0.8 * cre_a[..., None])

# ---------------- TREES: canopy height field ----------------
tr = np.array(Image.open(f"assets/media/{base}_det_tree.png").convert("RGBA").crop(box))[..., 3].astype(np.float32) / 127
tsm = G(tr, 3.0)
dcre = ndimage.distance_transform_edt(~cre)
field = G(rng.standard_normal((PH, PW)).astype(np.float32), 22); field /= field.std()
grove_thr = {"A": 1.6, "B": 0.85, "C": 1.6}.get(VAR, 0.95)
K = 2
KER = []
for i in range(48):
    R = (7.5 + 7.5 * (i / 47) ** 1.1) * K
    s = int(np.ceil(R * 1.25)); yy, xx = np.mgrid[-s:s + 1, -s:s + 1].astype(np.float32)
    hgt = np.sqrt(np.clip(R * R - xx * xx - yy * yy, 0, None)) * 0.8
    for _ in range(int(rng.integers(4, 8))):
        a = rng.uniform(0, 2 * np.pi); d = rng.uniform(0.25, 0.62) * R; r = rng.uniform(0.32, 0.55) * R
        cx_, cy_ = np.cos(a) * d, np.sin(a) * d
        q = r * r - (xx - cx_) ** 2 - (yy - cy_) ** 2
        hgt = np.maximum(hgt, np.where(q > 0, np.sqrt(np.clip(q, 0, None)) + 0.55 * R * (1 - d / R), 0))
    KER.append((s, hgt.astype(np.float32), R))
sp = 7
halfw = wmax[niy, nix] - 1                                            # half-width of the nearest water (data)
fld2 = G(rng.standard_normal((PH, PW)).astype(np.float32), 9); fld2 /= fld2.std()
gap = G(rng.standard_normal((PH, PW)).astype(np.float32), 45); gap /= gap.std()          # owner 2026-10-31: not always, not data-accurate: broken ribbons
band = np.clip(10 + 1.0 * halfw, 12, 40) * (1 + 0.22 * fld2)
pts = []
for gy_ in range(0, PH, sp):
    for gx_ in range(0, PW, sp):
        x, y = gx_ + rng.uniform(0, sp), gy_ + rng.uniform(0, sp)
        if x >= PW or y >= PH: continue
        iy, ix = int(y), int(x)
        if water[iy, ix] or dout[iy, ix] < 2.5: continue
        t = tsm[iy, ix]
        if dout[iy, ix] < band[iy, ix] + 6:
            bw = band[iy, ix]
            p = 0.95 * ss(-0.9, -0.1, gap[iy, ix]) * (1 - ss(bw - 8, bw + 6, dout[iy, ix]))   # dense riverside ribbon, width ~ river width
        elif dcre[iy, ix] < 6 and slope[iy, ix] < 0.5:
            p = 0.12 * ss(-0.6, 0.4, field[iy, ix] + 0.3 * np.sin(x / 37) )                                      # creek gallery
        else:
            g = field[iy, ix] - grove_thr
            p = 0.8 * ss(0.0, 0.5, g)                  # groves; thinner where cover thins
        if rng.random() < p: pts.append((x, y, dout[iy, ix] < band[iy, ix]))
from scipy.spatial import cKDTree
_a = np.array([(x, y) for x, y, _r in pts]); _cnt = cKDTree(_a).query_ball_point(_a, r=30, return_length=True)
pts = [p_ for p_, c_ in zip(pts, _cnt) if c_ >= 5]                      # no lone 'dot' trees: groves and ribbons only
Hc = np.zeros((PH * K, PW * K), np.float32); Tn = np.zeros_like(Hc)
for x, y, rip in pts:
    k = int(rng.integers(0, 48)) if not rip else int(rng.integers(8, 48))
    dw = dout[min(int(y), PH - 1), min(int(x), PW - 1)]
    while k > 0 and KER[k][2] / K > dw + 1.5: k -= 4 if k >= 4 else k
    s, ker, R = KER[k]
    if R / K > dw + 2.5: continue
    X, Y = int(x * K), int(y * K)
    ya, yb, xa, xb = Y - s, Y + s + 1, X - s, X + s + 1
    ky0, kx0 = max(0, -ya), max(0, -xa); ya, xa = max(ya, 0), max(xa, 0); yb, xb = min(yb, PH * K), min(xb, PW * K)
    if yb <= ya or xb <= xa: continue
    kk = ker[ky0:ky0 + yb - ya, kx0:kx0 + xb - xa]
    kk = np.where(kk > 0, kk + rng.uniform(0, 3) * K, 0)
    sub = Hc[ya:yb, xa:xb]; win = kk > sub
    sub[win] = kk[win]; Tn[ya:yb, xa:xb][win] = rng.normal(0, 1)
cm = Hc > 0
leaf = G(rng.standard_normal(Hc.shape).astype(np.float32), 2.4 * K); leaf /= leaf.std()
Hc = np.where(cm, Hc + 0.6 * K * leaf * ss(0, 2 * K, Hc), 0)                 # leafy micro-relief inside the canopy
cgy, cgx = np.gradient(G(Hc, 0.6 * K))
n = 1 / np.sqrt(cgx ** 2 + cgy ** 2 + 1)
ci = np.clip((-cgx * Lv[0] - cgy * Lv[1] + Lv[2]) * n, 0, 1)
hn = np.clip(Hc / (18 * K), 0, 1)
ao = 0.30 + 0.70 * ss(0.05, 0.7, hn)
TD, TM, TL, TH_ = np.array([28, 40, 22.]), np.array([58, 80, 44.]), np.array([102, 124, 66.]), np.array([146, 156, 98.])
v = np.clip(ci * ao, 0, 1)[..., None]
ccol = TD + (TM - TD) * ss(0.0, 0.45, v) + (TL - TM) * ss(0.4, 0.8, v) + (TH_ - TL) * ss(0.82, 1.0, v) * 0.6
tint = np.clip(Tn, -2, 2)[..., None]
ccol = ccol * (1 + 0.07 * tint * np.array([1.0, 0.8, 0.4])) + np.array([6, 4, -4.]) * tint
calpha = np.clip(Hc / (0.8 * K), 0, 1)
crgba = np.dstack([np.clip(ccol, 0, 255) * calpha[..., None], calpha])            # premultiplied at 2x
crgba = np.stack([ndimage.zoom(crgba[..., c], 1 / K, order=1, prefilter=False) if False else crgba[..., c].reshape(PH, K, PW, K).mean((1, 3)) for c in range(4)], -1)
ca = crgba[..., 3]
# cast shadow to the SE (onto ground and water)
shadow = ndimage.shift(G(calpha.reshape(PH, K, PW, K).mean((1, 3)), 3.0), (9.0, 7.0), order=1)
col *= (1 - 0.62 * np.clip(shadow, 0, 1) * (1 - ca))[..., None]
col = col * (1 - ca[..., None]) + crgba[..., :3]

# ---------------- GRADE ----------------
col = col[oy:oy + H, ox:ox + W]
c = np.clip(col / 255, 0, 1)
c = c + 0.06 * (c - c * c * (3 - 2 * c)) * -1                      # gentle S-curve
c = c * np.array([1.02, 1.0, 0.95])
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.30 * ss(0.35, 1.25, np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2))
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
