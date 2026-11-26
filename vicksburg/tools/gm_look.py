"""Verbatim copies of the approved GM look functions from research/style_tests/gm3d/clip/bake_clip.py (v8, 2026-11-15).
Generated once by copying the source; do not restyle here: the look is approved. Used by bake_world.py."""
import math
import numpy as np, cv2

def fbm(h, w, octaves=5, base=4, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((h, w), np.float32); amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o; g = r.random((max(2, n * h // w + 2), n + 2)).astype(np.float32)
        acc += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC); tot += amp; amp *= 0.5
    acc /= tot; return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)

def smooth(p, k):
    q = np.array(p, np.float32)
    for _ in range(k): q[1:-1] = 0.25 * q[:-2] + 0.5 * q[1:-1] + 0.25 * q[2:]
    return q

def densify(pts, step):
    pts = np.asarray(pts, np.float32); out = [pts[0]]
    for a, b in zip(pts[:-1], pts[1:]):
        n = max(1, int(np.linalg.norm(b - a) / step))
        for f in np.linspace(0, 1, n + 1)[1:]: out.append(a * (1 - f) + b * f)
    return np.array(out, np.float32)

def hexc(s): return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], np.float32)

FIELD = [hexc(c) for c in ("#B39967", "#C2B280", "#A8915E", "#BFA874", "#B39967", "#C2B280", "#9C9A62", "#7A8E6A", "#8B9A6B", "#C9B98A", "#A58B5A", "#B8A070")]
def catmull(P, step):
    """Catmull-Rom spline through control points, resampled every `step` units"""
    P = np.asarray(P, np.float32); P = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]]); out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]; n = max(2, int(np.linalg.norm(p2 - p1) / step))
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(P[-2]); return np.array(out, np.float32)

def water_levels(pts, h_smooth_at):
    """water level (m) along a river polyline (upstream first): low bank height, never rising downstream"""
    wl = h_smooth_at(pts) - 1.2
    wl = np.convolve(np.pad(wl, 15, mode="edge"), np.ones(31) / 31, mode="valid")
    return np.minimum.accumulate(wl)

def wide_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM wide ground: muted green-grey-olive mosaic that reads as mottled texture (GM 620/1090 s: ~(80,90,74), (98,106,87), (68,79,67))."""
    PAL = np.array([[72, 86, 66], [94, 104, 82], [108, 110, 88], [64, 78, 62], [124, 126, 102], [112, 104, 84], [86, 98, 82]], np.float32)   # v6: wider spread
    pr = np.array([0.24, 0.22, 0.14, 0.16, 0.10, 0.06, 0.08])
    ft = r.choice(len(PAL), n, p=pr / pr.sum())
    img = (PAL[ft] * r.uniform(0.94, 1.06, (n, 1)).astype(np.float32))[lab]
    img = cv2.GaussianBlur(img, (0, 0), cell * 0.12) * 0.6 + img * 0.4   # v5b: crisper field mosaic (push-in sharpness)
    m1 = fbm(TH // 4, TW // 4, 5, 6, seed + 8); m2 = fbm(TH // 4, TW // 4, 4, 30, seed + 14)
    mot = cv2.resize(m1 * 0.6 + m2 * 0.4, (TW, TH))
    img *= (1 + (mot[..., None] - 0.5) * 0.6)   # v6: more tonal spread (his wide SD ~30-37)
    img *= (1 + (cv2.resize(fbm(TH // 2, TW // 2, 3, 160, seed + 16), (TW, TH)) - 0.5)[..., None] * 0.16)   # v5b: fine mottle (his wide map is textured at every scale)
    # v6 detail layer for the push-in (14.6-15.5 s): each wide field split into strips / sub-parcels of slightly different tone
    ang = r.uniform(0, np.pi, n)[lab]; yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    si = np.floor((xx * np.cos(ang) + yy * np.sin(ang)) / (r.uniform(1.6, 3.6, n)[lab] * s)).astype(np.int64); del ang, yy, xx
    hv = ((((lab.astype(np.int64) * 131 + si * 7) * 2654435761) % 4294967296) / 4294967296.0).astype(np.float32); del si
    img *= cv2.GaussianBlur(1 + (hv - 0.5) * 0.12, (0, 0), 1.0)[..., None]; del hv
    g = cv2.resize(fbm(TH // 4, TW // 4, 4, 10, seed + 15), (TW, TH))[..., None]   # hue drift: olive <-> grey-green
    img = img * (1 - 0.25 * g) + np.array([86, 98, 88], np.float32) * 0.25 * g
    return img

def gm_fields(lab, n, cell, s, r, TW, TH, seed, track_k=1.0, strip_k=1.0):   # strip_k (Battle 21 v2 r6, default 1 = unchanged): strip + fine furrow contrast x k   # track_k (Battle 21 v2, default 1 = unchanged): pale tracks count / opacity x k
    """GM close ground (v5), measured on GM 1814 640-700 s (k-means (157,134,112) (128,121,100) (94,100,90), woods (54,71,66)):
    big warm patches of sand / tan / stubble (~45 %), rust + ploughed brown (~15 %), olive (~25 %) and dark pasture (~15 %); neighbouring fields
    share a tone (large warm vs green regions), strip fields of alternating shades, brushed streaks + furrows along the strips, soft colour
    changes at the edges (no outlines), pale tracks on ~15 % of the edges + a few cart tracks across the fields, hedges as rare irregular
    clumps on ~8 % of the edges, small copses + lone trees, fine smooth grain. Returns (img, tree pts [x_px, y_px, kind])."""
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    hs_ = lambda v, k: (((v * 2654435761 + k * 40503) % 4294967296) / 4294967296.0).astype(np.float32)
    lab64 = lab.astype(np.int64); cnt = np.maximum(np.bincount(lab.ravel(), minlength=n), 1)
    cxf = np.bincount(lab.ravel(), xx.ravel(), minlength=n) / cnt; cyf = np.bincount(lab.ravel(), yy.ravel(), minlength=n) / cnt
    zone = cv2.resize(fbm(TH // 16, TW // 16, 3, 3, seed + 40), (TW, TH), interpolation=cv2.INTER_LINEAR)
    zf = zone[np.clip(cyf, 0, TH - 1).astype(int), np.clip(cxf, 0, TW - 1).astype(int)]   # zone at each field's centre
    # palette (texture values; the flat ground renders ~0.93 x): pale stubble, sand, sand 2, tan | rust, ploughed brown | olive, olive green | dark pasture x2
    PAL = np.array([[150, 139, 96], [142, 132, 92], [136, 126, 88], [130, 122, 86], [134, 104, 76], [124, 102, 78],
                    [116, 114, 86], [106, 108, 82], [88, 98, 78], [80, 92, 72]], np.float32)   # v7: ochre-olive, lightest renders ~(138,128,96)   # v6: lightest ~(150,140,108) rendered, less chroma   # v5b: sand less yellow, rust rarer and less orange
    PR = np.array([0.09, 0.14, 0.13, 0.10, 0.06, 0.07, 0.13, 0.12, 0.09, 0.07]); CUM = np.cumsum(PR / PR.sum())
    uf = np.clip(r.random(n) * 0.75 + (zf - 0.5) * 0.9 + 0.125, 0, 0.999)   # zone bias: warm regions vs green regions
    cf = np.minimum(np.searchsorted(CUM, uf), len(PAL) - 1)
    sang = r.uniform(0, np.pi, n); sw = r.uniform(0.15, 0.3, n) * s; split = r.random(n) < 0.6   # v7: narrow strips (his 8-12 px)
    A = sang[lab]; vv = xx * np.cos(A) + yy * np.sin(A); uu = -xx * np.sin(A) + yy * np.cos(A); del A
    si = np.floor(vv / sw[lab]).astype(np.int64) * split[lab]
    sub = (lab64 * 131 + si * 7) % 1000003; del si
    # strip fields: most strips keep the field's crop at another shade, ~30 % take the neighbouring palette entry (tan <-> sand, olive <-> pasture)
    hop = 0   # v7: no palette hop inside a field (no candy stripes)
    crop = np.clip(cf[lab] + hop, 0, len(PAL) - 1); del hop
    img = PAL[crop] * (0.94 + 0.10 * hs_(lab64, 4) + 0.12 * strip_k * (hs_(sub, 3) - 0.5) * split[lab])[..., None]   # strips: brightness only, +-6 %
    img = cv2.GaussianBlur(img, (0, 0), 1.8)   # v6: antialiased soft colour change at the edges (1.8 px at full res), no outline
    # brushed streaks along the strip direction (1-D noise across, slow drift along) + fine furrows
    nv = np.random.default_rng(seed + 50).random(int((TW + TH) * 2.2 / (0.025 * s)) + 8).astype(np.float32)
    nv = np.convolve(nv, np.ones(3) / 3, mode="same"); nv = (nv - nv.mean()) / (nv.std() + 1e-6)
    off = (hs_(lab64, 21) * 600).astype(np.int64)
    k_ = vv / (0.025 * s) + (TW + TH) * 1.05 / (0.025 * s)
    ki = np.clip(k_.astype(np.int64) + off, 0, len(nv) - 2); fr = k_ - np.floor(k_)
    streak = nv[ki] * (1 - fr) + nv[ki + 1] * fr; del ki, fr, k_, off
    drift = cv2.resize(fbm(TH // 8, TW // 8, 3, 18, seed + 52), (TW, TH))
    samp = np.array([0.016, 0.02, 0.02, 0.02, 0.026, 0.026, 0.014, 0.014, 0.01, 0.01], np.float32)[crop]   # v5b: subtle (his streaks are soft)
    fade = np.clip((cv2.resize(fbm(TH // 8, TW // 8, 3, 9, seed + 54), (TW, TH)) - 0.35) * 2.5, 0, 1)   # v6: streaks fade in and out
    img *= (1 + streak * samp * 0.5 * (0.5 + drift) * fade)[..., None]; del streak, drift
    fur = 0.6 * np.sin(vv / (0.075 * s) * np.pi * 2 + fbm(TH, TW, 3, 24, seed + 44) * 5) + 0.4 * np.sin(vv / (0.225 * s) * np.pi * 2 + cv2.resize(fbm(TH // 2, TW // 2, 3, 10, seed + 55), (TW, TH)) * 4)
    famp = np.array([0.008, 0.012, 0.012, 0.014, 0.028, 0.024, 0.008, 0.008, 0.005, 0.005], np.float32)[crop] * (0.5 + fbm(TH, TW, 3, 12, seed + 46))
    img *= (1 + fur * famp * 0.5 * fade)[..., None]; del fur, famp, fade
    ff = np.sin(vv / (0.055 * s) * np.pi * 2 + fbm(TH, TW, 2, 30, seed + 57) * 3)   # v7: fine furrow octave (~0.055 units), on ~half the ground
    fm_ = np.clip((cv2.resize(fbm(TH // 8, TW // 8, 3, 7, seed + 58), (TW, TH)) - 0.45) * 4, 0, 1)
    fa = np.array([0.03, 0.04, 0.045, 0.05, 0.06, 0.055, 0.035, 0.03, 0.015, 0.015], np.float32)[crop]
    img *= (1 + ff * fa * strip_k * fm_)[..., None]; del ff, fm_, fa, vv, uu
    # big soft damp / dry mottles (value only, no teal wash), mid mottles, fine smooth grain
    m1 = cv2.resize(fbm(TH // 4, TW // 4, 5, 5, seed + 41), (TW, TH)); m2 = cv2.resize(fbm(TH // 4, TW // 4, 4, 22, seed + 47), (TW, TH))
    mo = (m1 * 0.65 + m2 * 0.35 - 0.5)[..., None]; img *= (1 + mo * 0.33); del m1, m2, mo   # v6: big damp / dry patches back (x1.5)
    hz = cv2.resize(fbm(TH // 4, TW // 4, 4, 7, seed + 56), (TW, TH))[..., None]   # ... as hue shifts inside a field: damp olive <-> dry tan
    gw = np.clip((0.45 - hz) * 2.6, 0, 1) * 0.42; gd = np.clip((hz - 0.55) * 2.6, 0, 1) * 0.30
    img = img * (1 - gw - gd) + np.array([108, 112, 88], np.float32) * gw + np.array([158, 144, 110], np.float32) * gd; del hz, gw, gd
    img *= (1 + (fbm(TH, TW, 3, 90, seed + 42) - 0.5) * 0.05)[..., None]
    img += (cv2.GaussianBlur(np.random.default_rng(seed + 43).random((TH, TW), np.float32), (0, 0), 0.7)[..., None] - 0.5) * 4
    # parcel edges, one decision per edge (pair of fields), not per field outline
    lf = lab.astype(np.float32); k3 = np.ones((3, 3), np.uint8)
    lmax = cv2.dilate(lf, k3).astype(np.int64); lmin = cv2.erode(lf, k3).astype(np.int64); del lf
    edge = lmax != lmin; ph = hs_(lmin * 7919 + lmax, 12); del lmax, lmin
    # pale tracks on ~15 % of the edges
    tk = (edge & (ph < 0.15)).astype(np.float32)
    tk = np.clip(cv2.GaussianBlur(tk, (0, 0), 0.02 * s) * 1.6, 0, 1) * 0.7   # v6: soft, no scalloped verge
    # + a few curved cart tracks across the fields
    ct = np.zeros((TH, TW), np.uint8); rt = np.random.default_rng(seed + 53)
    for _ in range(int(TW * TH / (s * s) / 40 * track_k)):   # v7: 2x more tracks across the fields
        p0 = rt.uniform(0, 1, 2) * [TW, TH]; a0 = rt.uniform(0, np.pi * 2); L = rt.uniform(3, 7) * s
        P = [p0 + np.array([math.cos(a0 + rt.normal(0, 0.25) * k), math.sin(a0 + rt.normal(0, 0.25) * k)]) * L * k / 3 for k in range(4)]
        C_ = catmull(P, 4)
        if rt.random() < 0.5: cv2.polylines(ct, [np.round(C_ * 4).astype(np.int32)], False, 255, max(2, int(0.045 * s)), cv2.LINE_AA, shift=2)
        else:   # wheel ruts: two thin parallel lines
            d_ = np.gradient(C_, axis=0); nn_ = np.stack([-d_[:, 1], d_[:, 0]], 1) / (np.linalg.norm(d_, axis=1, keepdims=True) + 1e-6) * 0.03 * s
            for sg in (-1, 1): cv2.polylines(ct, [np.round((C_ + sg * nn_) * 4).astype(np.int32)], False, 255, max(1, int(0.018 * s)), cv2.LINE_AA, shift=2)
    tk = np.maximum(tk, cv2.GaussianBlur(ct.astype(np.float32) / 255, (0, 0), 0.6) * 0.8)[..., None]; del ct
    tk *= min(1.0, track_k); img = img * (1 - 0.6 * tk) + np.array([172, 162, 130], np.float32) * 0.6 * tk; del tk
    # v7: dark scrub / bush dots, 1-3 px (GM 682 s)
    sd_ = np.zeros((TH, TW), np.uint8); rs_ = np.random.default_rng(seed + 59); nS = int(TW * TH / (s * s) * 2.2)
    for (x_, y_), r_ in zip(rs_.uniform(0, 1, (nS, 2)) * [TW, TH], rs_.uniform(0.012, 0.035, nS) * s): cv2.circle(sd_, (int(x_ * 4), int(y_ * 4)), max(1, int(r_ * 4)), 255, -1, cv2.LINE_AA, shift=2)
    sdm = cv2.GaussianBlur(sd_.astype(np.float32) / 255, (0, 0), 0.5)[..., None] * 0.7; del sd_
    img = img * (1 - sdm) + np.array([62, 72, 56], np.float32) * sdm; del sdm
    # hedges: ~8 % of the edges, irregular clumps (clump 0.1-0.4 units, gaps 0.2-0.6), crowns placed by world.js (kind 2)
    hedge = (edge & (ph >= 0.15) & (ph < 0.23)).astype(np.uint8); del edge, ph
    ys_, xs_ = np.nonzero(hedge[::2, ::2]); P = np.stack([xs_ * 2, ys_ * 2], 1).astype(np.float32); del hedge
    rr = np.random.default_rng(seed + 45); step = 0.06 * s
    cellk = np.floor(P / step).astype(np.int64); _, first = np.unique(cellk[:, 0] * 100003 + cellk[:, 1], return_index=True); P = P[first]
    gc = 0.32 * s; G = rr.random((int(TH / gc) + 3, int(TW / gc) + 3)).astype(np.float32)
    clump = cv2.resize(G, (int(G.shape[1] * gc), int(G.shape[0] * gc)), interpolation=cv2.INTER_CUBIC)
    P = P[clump[P[:, 1].astype(int), P[:, 0].astype(int)] > 0.52]
    P += rr.uniform(-0.03, 0.03, P.shape).astype(np.float32) * s
    # copses (3-8 trees) + lone field trees
    nC = int(TW * TH / (s * s) * 0.012); C = rr.uniform(0, 1, (nC, 2)) * [TW, TH]
    cop = np.concatenate([c + rr.normal(0, 0.16, (int(rr.integers(3, 9)), 2)) * s for c in C]) if nC else np.zeros((0, 2))
    L = np.concatenate([cop, rr.uniform(0, 1, (int(TW * TH / (s * s) * 0.03), 2)) * [TW, TH]]).astype(np.float32)
    P = np.concatenate([np.c_[P, np.full(len(P), 2)], np.c_[L, np.full(len(L), 3)]]).astype(np.float32)
    return np.clip(img, 0, 255), P

ROOFS = 7
WT = (0.86, 0.57)
HS, FS = 0.40, 0.43
def paint_town(img, town, Pt, s):
    """yards (bare trodden earth), kitchen gardens (green / brown beds with a dark hedge edge) into the ground texture"""
    TH, TW = img.shape[:2]
    def poly(x, y, w, d, ang):
        c, s_ = math.cos(ang), math.sin(ang)
        return np.array([Pt((x + c * a - s_ * b, y + s_ * a + c * b)) for a, b in ((-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2))], np.float32)
    ym = np.zeros((TH, TW), np.float32)
    for (x, y, rx, ry, ang, kind) in town["yards"]:
        c = Pt((x, y)); cv2.ellipse(ym, (int(c[0]), int(c[1])), (int(rx * s), int(ry * s)), math.degrees(ang), 0, 360, 1.0 if kind == 0 else 0.8, -1)
    ym = cv2.GaussianBlur(ym, (0, 0), 0.06 * s)[..., None]
    img = img * (1 - 0.7 * ym) + np.array([132, 118, 94], np.float32) * 0.7 * ym; del ym
    GC = np.array([[92, 108, 72], [124, 112, 84], [84, 100, 68], [136, 124, 92]], np.float32)
    gm = np.zeros((TH, TW, 3), np.float32); ga = np.zeros((TH, TW), np.float32); ge = np.zeros((TH, TW), np.uint8)
    for (x, y, w, d, ang, k) in town["gardens"]:
        P = np.round(poly(x, y, w, d, ang) * 4).astype(np.int32)
        cv2.fillPoly(gm, [P], GC[k].tolist(), cv2.LINE_AA, shift=2); cv2.fillPoly(ga, [P], 1.0, cv2.LINE_AA, shift=2)
        cv2.polylines(ge, [P], True, 255, max(1, int(0.03 * s)), cv2.LINE_AA, shift=2)
    ga = ga[..., None] * 0.75; img = img * (1 - ga) + gm * ga; del gm, ga
    gef = cv2.GaussianBlur(ge.astype(np.float32) / 255, (0, 0), 1.0)[..., None] * 0.5
    img = img * (1 - gef) + np.array([64, 76, 56], np.float32) * gef
    return img

