#!/usr/bin/env python3
"""Painted relief hills for Style W green maps (owner reference: ../ref_hill_zoom.png, Yarmouk film).

No contours, no hachures: a soft painted blob/ridge with a crumpled rocky surface, NW-lit hillshade
(tan-grey desaturated highlights, olive-charcoal shade), and a wide feathered dark halo / cast shadow.
All colours come from the basemap pixels under the hill, so it reads as part of the same painted ground.

API (all coordinates in IMAGE px of the basemap, i.e. css/map px x hd_scale 2 for vicksburg_w*.jpg):

    from make_hill import Blob, Ridge, render_hills
    rgba, composite, bbox = render_hills(base_rgb_array, shapes, clean=True, seed=1, rough=1.0, shadow=1.0)

    Blob(cx, cy, rx, ry, rot=0, height=1.0, irregular=0.35)     # rot in degrees, rx/ry = radii in image px
    Ridge(points, width, height=1.0, irregular=0.35, widths=None, heights=None, steep_west=0.0)
        points = polyline [(x, y), ...]; width = half-width in px (or per-point `widths`);
        `heights` per point lets a ridge rise to a summit; steep_west>0 makes the west face a scarp (bluffs).

    rgba      : uint8 HxWx4, same size as the base image; alpha 0 outside the hill + halo.
                Composited (normal "over") on the ORIGINAL base it reproduces `composite` exactly, including
                the removal of any ink hachures baked in the basemap under the hill (clean=True).
    composite : the base with the hill painted in (uint8 HxWx3).
    bbox      : (x0, y0, x1, y1) of the non-transparent region.

Knobs: height (relief strength / darkness of the body), rough (rocky crumple amount), shadow (halo strength),
       halo (halo width multiplier), seed.

CLI:  python3 make_hill.py            -> builds champion_hill*.png, vicksburg_bluffs*.png, compare.jpg in this folder.
"""
import json, os, sys
import numpy as np
import cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = '/home/user/battle-maps'
ASSETS = f'{REPO}/grant/assets'


# ---------------------------------------------------------------- noise
def fbm(h, w, scale, octaves=5, seed=0, persistence=0.55, lacunarity=2.0):
    """zero-mean multi-octave value noise (bicubic-upsampled random grids), ~unit std. scale = largest feature px."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0.0; s = float(scale)
    for _ in range(octaves):
        gh, gw = max(2, int(h / s) + 3), max(2, int(w / s) + 3)
        g = rng.standard_normal((gh, gw)).astype(np.float32)
        up = cv2.resize(g, (int(gw * s), int(gh * s)), interpolation=cv2.INTER_CUBIC)
        oy, ox = rng.integers(0, max(1, up.shape[0] - h)), rng.integers(0, max(1, up.shape[1] - w))
        out += amp * up[oy:oy + h, ox:ox + w]; tot += amp * amp
        amp *= persistence; s /= lacunarity
        if s < 1.2: break
    return out / np.sqrt(tot)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- shapes
class Blob:
    def __init__(self, cx, cy, rx, ry, rot=0.0, height=1.0, irregular=0.35):
        self.cx, self.cy, self.rx, self.ry, self.rot, self.height, self.irregular = cx, cy, rx, ry, rot, height, irregular

    def extent(self): r = max(self.rx, self.ry); return self.cx - r, self.cy - r, self.cx + r, self.cy + r

    def field(self, X, Y, wx, wy):
        """returns (normalised distance d: 0 at centre, 1 at the edge; height scale; scarp side term)"""
        a = np.radians(self.rot); X2, Y2 = X + wx * self.irregular * min(self.rx, self.ry), Y + wy * self.irregular * min(self.rx, self.ry)
        u = (X2 - self.cx) * np.cos(a) + (Y2 - self.cy) * np.sin(a)
        v = -(X2 - self.cx) * np.sin(a) + (Y2 - self.cy) * np.cos(a)
        return np.sqrt((u / self.rx) ** 2 + (v / self.ry) ** 2), np.full_like(X, self.height), np.zeros_like(X)


class Ridge:
    def __init__(self, points, width, height=1.0, irregular=0.35, widths=None, heights=None, steep_west=0.0):
        self.p = np.asarray(points, np.float32); n = len(self.p)
        self.w = np.asarray(widths if widths is not None else [width] * n, np.float32)
        self.h = np.asarray(heights if heights is not None else [height] * n, np.float32)
        self.irregular, self.steep_west = irregular, steep_west

    def extent(self):
        m = self.w.max(); return self.p[:, 0].min() - m, self.p[:, 1].min() - m, self.p[:, 0].max() + m, self.p[:, 1].max() + m

    def field(self, X, Y, wx, wy):
        X2, Y2 = X + wx * self.irregular * self.w.mean(), Y + wy * self.irregular * self.w.mean()
        best = np.full(X.shape, 1e9, np.float32); W = np.zeros_like(X); Hh = np.zeros_like(X); side = np.zeros_like(X)
        for i in range(len(self.p) - 1):
            a, b = self.p[i], self.p[i + 1]; ab = b - a; L2 = float(ab @ ab) + 1e-6
            t = np.clip(((X2 - a[0]) * ab[0] + (Y2 - a[1]) * ab[1]) / L2, 0, 1)
            dx, dy = X2 - (a[0] + t * ab[0]), Y2 - (a[1] + t * ab[1]); d = np.sqrt(dx * dx + dy * dy)
            ww = self.w[i] + t * (self.w[i + 1] - self.w[i]); hh = self.h[i] + t * (self.h[i + 1] - self.h[i])
            # round caps that taper: beyond the ends the ridge narrows
            dn = d / ww; upd = dn < best
            best = np.where(upd, dn, best); W = np.where(upd, ww, W); Hh = np.where(upd, hh, Hh)
            nx, ny = -ab[1], ab[0]; nl = np.hypot(nx, ny) + 1e-6
            sd = (dx * nx + dy * ny) / nl; sd = np.where(nx / nl < 0, -sd, sd)   # + = east of the spine
            side = np.where(upd, np.sign(sd), side)
        return best, Hh, side * self.steep_west


# ---------------------------------------------------------------- helpers
def water_mask(rgb):
    f = rgb.astype(np.float32); r, g, b = f[..., 0], f[..., 1], f[..., 2]
    m = ((b > r + 18) & (b > g - 4)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    return cv2.dilate(m, np.ones((5, 5), np.uint8)).astype(bool)


def ink_mask(rgb, region):
    """dark ink marks (hachures etc.) inside `region` (bool), to be painted out."""
    lum = rgb.astype(np.float32).mean(2)
    sm = cv2.resize(np.clip(lum, 0, 255).astype(np.uint8), None, fx=0.25, fy=0.25, interpolation=cv2.INTER_AREA)
    sm = cv2.dilate(sm, np.ones((5, 5), np.uint8))                      # grass level ignoring dark ink (local upper envelope)
    med = cv2.resize(cv2.medianBlur(sm, 9), (lum.shape[1], lum.shape[0]), interpolation=cv2.INTER_LINEAR).astype(np.float32)
    m = ((lum < med * 0.74) & region).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    return m.astype(bool)


def clean_ground(full, ox0, oy0, crop, region, block=160):
    ys, xs = np.where(region); fb = (xs.min() + ox0 - 20, ys.min() + oy0 - 20, xs.max() + ox0 + 20, ys.max() + oy0 + 20)   # never copy from the area being cleaned
    """replace `region` (bool, crop coords; crop = full[oy0:, ox0:]) with grass texture copied block by block from nearby
    clean patches of the full basemap, low-frequency matched to the surroundings so the seams vanish."""
    f = crop.astype(np.float32); out = f.copy(); H, W = region.shape; FH, FW = full.shape[:2]
    lum = f.mean(2)
    # local colour from the clean surroundings (masked blur)
    keep = (~cv2.dilate(region.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool) & ~water_mask(crop)).astype(np.float32)
    sig = 18
    lowd = None
    for sg in (90, 45, sig):                                         # coarse-to-fine masked blur fills big holes without a dark spot
        den = cv2.GaussianBlur(keep, (0, 0), sg)[..., None]
        est = cv2.GaussianBlur(f * keep[..., None], (0, 0), sg) / np.maximum(den, 1e-6)
        if lowd is None: lowd = np.where(den > 1e-5, est, f.mean((0, 1)))
        else: wgt = np.clip(den / 0.25, 0, 1); lowd = est * wgt + lowd * (1 - wgt)
    for by in range(0, H, block):
        for bx in range(0, W, block):
            r = region[by:by + block, bx:bx + block]
            if not r.any(): continue
            bh, bw = r.shape; best = None
            gx0, gy0 = ox0 + bx, oy0 + by
            for rad in (1.5, 2.2, 3.0, 4.0, 5.5, 7.0, 9.0):
                for ang in range(0, 360, 30):
                    sx = int(gx0 + np.cos(np.radians(ang)) * rad * block); sy = int(gy0 + np.sin(np.radians(ang)) * rad * block)
                    if sx < 0 or sy < 0 or sx + bw > FW or sy + bh > FH: continue
                    if sx < fb[2] and sx + bw > fb[0] and sy < fb[3] and sy + bh > fb[1]: continue
                    src = full[sy:sy + bh, sx:sx + bw]
                    sl = src.astype(np.float32).mean(2)
                    inkq = cv2.dilate((sl < cv2.medianBlur(np.clip(sl, 0, 255).astype(np.uint8), 61) * 0.72).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
                    bad = 20 * (water_mask(src) | inkq)[r].mean() \
                        + abs(sl.mean() - lowd[by:by + bh, bx:bx + bw].mean()) / 255
                    if best is None or bad < best[0]: best = (bad, sx, sy)
                if best is not None and best[0] < 0.01: break
            if best is None: continue
            _, sx, sy = best
            src = full[sy:sy + bh, sx:sx + bw].astype(np.float32)
            patch = src - cv2.GaussianBlur(src, (0, 0), sig) + lowd[by:by + bh, bx:bx + bw]
            out[by:by + bh, bx:bx + bw] = np.where(r[..., None], patch, out[by:by + bh, bx:bx + bw])
    soft = cv2.GaussianBlur(region.astype(np.float32), (0, 0), 2.5)
    soft = np.maximum(soft, region.astype(np.float32))[..., None]
    return np.clip(out * soft + f * (1 - soft), 0, 255)


def rgba_from(base, comp, core):
    """alpha/colour such that comp = rgba over base (exact), alpha as small as possible but >= core."""
    B = base.astype(np.float32); F = comp.astype(np.float32); D = F - B
    need = np.where(D < 0, -D / np.maximum(B, 1), D / np.maximum(255 - B, 1)).max(2)
    need = np.where(np.abs(D).max(2) < 0.75, 0, need)
    m = np.clip(np.maximum(need * 1.04, core), 0, 1)
    m = np.maximum(m, cv2.GaussianBlur(m, (0, 0), 1.0) * 0.0)
    rgb = np.where(m[..., None] > 1e-4, B + D / np.maximum(m[..., None], 1e-4), 0)
    a = np.round(m * 255)
    # re-derive colour for the quantised alpha so the composite stays exact to ~1 level
    mq = a / 255.0
    rgb = np.where(mq[..., None] > 0, B + D / np.maximum(mq[..., None], 1 / 255), 0)
    return np.dstack([np.clip(np.round(rgb), 0, 255), a]).astype(np.uint8)


# ---------------------------------------------------------------- the painter
def render_hills(base, shapes, clean=True, erase=(), seed=1, rough=1.0, shadow=1.0, halo=1.0, light_az=315.0, light_el=38.0,
                 blur=0.7, warm=1.0, crest=0.0, weight=1.0, lit=1.0, hi_desat=0.7, mass=1.0, clean_extra=(), rim=0.0):
    """blur = softening of the painted colour in image px (0.7 default; ~1.2 = ~1 px at 1080p on s12d_rt);
    warm = highlight warmth (1.0 default; <1 cooler / greyer lit faces).
    crest = lighter tan-grey crumpled lit top (0 default; ~0.5 = like the reference);
    weight = body darkness + halo strength (1.0 default; 0.8 = ~20 % lighter, less heavy);
    lit = brightness of the lit faces + crest (1.0 default); hi_desat = greyness of the lit faces (0.7 default, lower = more olive-tan);
    mass = strength of the broad SE-dark / NW-light tonal mass (1.0 default); clean_extra = [(x, y, r), ...] image-px circles whose
    baked ink (old hachures) is painted out even where the hill itself is smaller; rim = faint warm light rim on the NW edge (0 default)."""
    base = np.asarray(base)[..., :3]
    Hh, Ww = base.shape[:2]
    ex = np.array([s.extent() for s in shapes]); size = max(ex[:, 2].max() - ex[:, 0].min(), ex[:, 3].max() - ex[:, 1].min())
    span = max(ex[:, 2] - ex[:, 0]).max() if len(shapes) else 100
    rsz = float(np.median([min(e[2] - e[0], e[3] - e[1]) for e in ex])) / 2      # typical radius / half-width
    pad = int(rsz * 2.4 * halo + 40)
    x0, y0 = max(0, int(ex[:, 0].min()) - pad), max(0, int(ex[:, 1].min()) - pad)
    x1, y1 = min(Ww, int(ex[:, 2].max()) + pad), min(Hh, int(ex[:, 3].max()) + pad)
    crop = base[y0:y1, x0:x1].astype(np.float32); h, w = crop.shape[:2]
    Y, X = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    wat = water_mask(base[y0:y1, x0:x1])
    # ---- heightfield
    wx = fbm(h, w, rsz * 0.9, 4, seed + 1); wy = fbm(h, w, rsz * 0.9, 4, seed + 2)          # outline wobble (domain warp)
    hgt = np.zeros((h, w), np.float32); body = np.zeros((h, w), np.float32)
    for s in shapes:
        d, sh, side = s.field(X, Y, wx, wy)
        prof = np.clip(1 - d * d, 0, 1) ** 1.25                                         # rounded dome / ridge section
        if np.any(side):                                                                 # scarp: west face steeper
            prof = np.where(side < 0, np.clip(1 - d, 0, 1) ** 0.7 * np.clip(1 - d * d, 0, 1) ** 0.5, prof) * 1.0
        hgt = np.maximum(hgt, sh * prof)
        body = np.maximum(body, smoothstep(1.15, 0.35, d))
    # keep the hill on its own bank: only the land pieces (between rivers) that hold the shape's anchor points
    nl, lab = cv2.connectedComponents((~cv2.dilate(wat.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)).astype(np.uint8), connectivity=4)
    anchors = []
    for s_ in shapes:
        anchors += [(s_.cx, s_.cy)] if isinstance(s_, Blob) else [tuple(q) for q in s_.p]
    ids = {int(lab[int(np.clip(ay - y0, 0, h - 1)), int(np.clip(ax - x0, 0, w - 1))]) for ax, ay in anchors} - {0}
    bank = np.isin(lab, list(ids)).astype(np.float32)
    bank = cv2.GaussianBlur(bank, (0, 0), 3) * bank
    hgt *= bank; body *= bank
    lumps = fbm(h, w, rsz * 0.45, 3, seed + 3)                                           # knolls and spurs
    n1 = fbm(h, w, rsz * 0.12, 5, seed + 4, persistence=0.62)
    crumple = (1 - np.abs(n1)) ** 3; crumple = crumple - crumple.mean()                         # ridged noise = crumpled rock
    fine = fbm(h, w, 4.0, 3, seed + 5, persistence=0.6)
    n2 = fbm(h, w, rsz * 0.05, 3, seed + 8, persistence=0.6); fine2 = (1 - np.abs(n2)) ** 3 - 0.35
    env = np.clip(hgt * 1.6, 0, 1) ** 0.6
    z = hgt * (1 + 0.18 * lumps) + env * rough * (0.10 * crumple + 0.05 * fine2 + 0.02 * fine)
    z = cv2.GaussianBlur(z, (0, 0), 1.0)
    relief = rsz * 0.55                                                                   # vertical exaggeration in px
    gy, gx = np.gradient(z * relief)
    az, el = np.radians(light_az), np.radians(light_el)
    lx, ly, lz = np.sin(az) * np.cos(el), -np.cos(az) * np.cos(el), np.sin(el)            # az 315 = from the NW (screen up-left)
    nrm = np.sqrt(gx * gx + gy * gy + 1)
    shade = (-gx * lx - gy * ly + lz) / nrm - lz                                          # 0 on flat ground, + lit, - shaded
    shade = np.clip(shade / 0.6, -1.0, 1.0)
    # ---- clean ground under the hill (paint out baked ink hachures)
    region = (body > 0.02) | (hgt > 0.01)
    region = cv2.dilate(region.astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
    inkreg = cv2.dilate((hgt > 0.02).astype(np.uint8), np.ones((45, 45), np.uint8)).astype(bool)
    for (ex_, ey_, er_) in clean_extra:
        inkreg |= (X - ex_) ** 2 + (Y - ey_) ** 2 < er_ ** 2
        region |= (X - ex_) ** 2 + (Y - ey_) ** 2 < (er_ + 8) ** 2
    G0 = crop
    if True:
        im = ink_mask(base[y0:y1, x0:x1], ~wat)
        # only ink marks lying wholly under the hill (the old hachures); marsh tufts, trees etc. that poke out stay
        er = np.zeros(im.shape, np.uint8)                                  # explicit footprint of the old hachure symbol
        for e in erase:
            if e[0] == 'circle': cv2.circle(er, (int(e[1] - x0), int(e[2] - y0)), int(e[3]), 1, -1)
            else: cv2.polylines(er, [np.array([[px - x0, py - y0] for px, py in e[1]], np.int32)], False, 1, int(2 * e[2]))
        im = im | (er.astype(bool) & ~wat)
        nl, lab = cv2.connectedComponents(im.astype(np.uint8))
        cnt_all = np.bincount(lab.ravel(), minlength=nl); cnt_in = np.bincount(lab[inkreg], minlength=nl)
        good = (cnt_in / np.maximum(cnt_all, 1)) >= 0.85; good[0] = False; im = good[lab]
        if clean and im.any(): G0 = clean_ground(base, x0, y0, base[y0:y1, x0:x1], im)
    # ---- colours from the ground itself
    G = cv2.GaussianBlur(G0, (0, 0), max(6, rsz * 0.12))                                  # local grass colour
    grain = np.clip(G0 / np.maximum(G, 1), 0.7, 1.3)                                       # painterly grain of the basemap
    lumG = G.mean(2, keepdims=True)
    desat = lambda c, k: c * (1 - k) + c.mean(2, keepdims=True) * k
    hi = (desat(G, hi_desat) * (1 + (np.array([1.12, 1.09, 1.0]) - 1) * warm) + np.array([12, 10, 6]) * (0.4 + 0.6 * warm)) * lit            # tan-grey lit faces
    bodyc = desat(G, 0.35) * (1 - 0.14 * weight)                                                          # the hill reads a touch darker than grass
    lo = desat(G, 0.25) * (1 - 0.45 * weight) * np.array([1.0, 1.0, 0.85])                                # olive-charcoal shade
    s3 = shade[..., None]
    col = np.where(s3 > 0, bodyc + (hi - bodyc) * np.clip(s3 * 1.25, 0, 1) ** 1.6, bodyc + (lo - bodyc) * np.clip(-s3, 0, 1))
    col = col * (grain ** 0.6)
    if crest > 0:   # lighter crumpled crest: tan-grey lift on the high ground, broken by the crumple, strongest on lit faces
        ck = crest * np.clip(hgt * 1.4 - 0.25, 0, 1) * np.clip(0.55 + crumple * 2.2, 0, 1) * np.clip(0.6 + shade, 0, 1.4)
        tan = (desat(G, 0.75 * hi_desat / 0.7) * np.array([1.2, 1.17, 1.05]) + np.array([16, 14, 6])) * lit
        col = col + (tan - col) * np.clip(ck, 0, 0.8)[..., None]
    col = cv2.GaussianBlur(col, (0, 0), blur)
    # broad tonal mass: SE half of the hill is darker overall, NW crest a little lighter
    big = cv2.GaussianBlur(hgt, (0, 0), rsz * 0.35); bgy, bgx = np.gradient(big)
    bm = np.hypot(bgx, bgy).max() + 1e-6; bshade = (-(bgx * lx + bgy * ly) / bm)[..., None]
    col = col * (1 + 0.42 * mass * np.clip(bshade * 1.3, -1, 1) - 0.05 * mass)
    col *= 1 - 0.04 * env[..., None] * height_scale(hgt)[..., None]
    # ---- alpha of the painted body: very soft, ragged edge
    edge_n = fbm(h, w, rsz * 0.25, 3, seed + 6)
    a_body = smoothstep(-0.08, 0.85, hgt + 0.12 * edge_n) ** 1.3
    a_body = np.clip(a_body * (0.9 + 0.1 * np.clip(crumple * 2 + 0.5, 0, 1)), 0, 1)
    if rim > 0:   # faint warm rim on the NW (lit) edge so the mound separates from the grass
        band = np.clip(4 * a_body * (1 - a_body), 0, 1) * np.clip(bshade[..., 0] * 1.6, 0, 1)
        band = cv2.GaussianBlur(band, (0, 0), 1.2)
        warmc = desat(G, 0.5) * np.array([1.22, 1.16, 1.0]) + np.array([18, 14, 4])
        col = col + (warmc - col) * np.clip(band * rim, 0, 0.7)[..., None]
    if blur > 0.7:
        a_body = cv2.GaussianBlur(a_body, (0, 0), blur)
    # ---- halo + cast shadow (wide feather into the grass, heavier to the SE)
    sup = smoothstep(0.0, 0.25, hgt)
    off = rsz * 0.22
    Mshift = np.float32([[1, 0, off * 0.7], [0, 1, off * 0.7]])
    cast = cv2.warpAffine(sup, Mshift, (w, h))
    halo_m = 0.95 * cv2.GaussianBlur(sup, (0, 0), rsz * 0.75 * halo) + 0.7 * cv2.GaussianBlur(cast, (0, 0), rsz * 0.5 * halo)
    halo_m = np.clip(halo_m, 0, 1) * (1 + 0.25 * fbm(h, w, rsz * 0.5, 3, seed + 7))
    halo_m = np.clip(halo_m * shadow * weight * 0.6, 0, 0.55) * cv2.GaussianBlur(bank, (0, 0), 6)
    dark = desat(G0, 0.2) * np.array([0.58, 0.58, 0.50])
    ground = G0 * (1 - halo_m[..., None]) + dark * halo_m[..., None]
    comp = ground * (1 - a_body[..., None]) + col * a_body[..., None]
    # rivers stay on top: no paint on water
    ws = cv2.GaussianBlur(wat.astype(np.float32), (0, 0), 1.5)[..., None]
    comp = comp * (1 - ws) + crop * ws
    comp = np.clip(comp, 0, 255)
    # ---- package
    full_comp = base.copy(); full_comp[y0:y1, x0:x1] = np.round(comp).astype(np.uint8)
    core = np.where(region & (G0 != crop).any(2), 1.0, 0.0)
    rgba_c = rgba_from(base[y0:y1, x0:x1], full_comp[y0:y1, x0:x1], core)
    rgba = np.zeros((Hh, Ww, 4), np.uint8); rgba[y0:y1, x0:x1] = rgba_c
    return rgba, full_comp, (x0, y0, x1, y1)


def height_scale(hgt):
    return np.clip(hgt, 0, 1)


# ---------------------------------------------------------------- scenes
def save_overlay(rgba, path, bbox, extra):
    Image.fromarray(rgba).save(path, optimize=True)
    x0, y0, x1, y1 = bbox
    Image.fromarray(rgba[y0:y1, x0:x1]).save(path.replace('.png', '_crop.png'), optimize=True)
    return dict(file=os.path.basename(path), crop=os.path.basename(path).replace('.png', '_crop.png'),
                crop_xy_image_px=[x0, y0], crop_xy_map_px=[x0 / 2, y0 / 2], crop_size_image_px=[x1 - x0, y1 - y0], **extra)


def champion_shapes(scale=1.0):
    # Champion Hill (32.333, -90.535) = map px (1634, 707) -> image px (3268, 1414). Crescent ridge, ~75 ft:
    # the hill crest at the north apex by the Jackson road, the ridge curving south on both wings (opening to the south).
    cx, cy = 3268, 1418
    k = scale
    arc = [(cx - 96 * k, cy + 70 * k), (cx - 84 * k, cy + 8 * k), (cx - 46 * k, cy - 40 * k), (cx + 8 * k, cy - 56 * k),
           (cx + 60 * k, cy - 36 * k), (cx + 92 * k, cy + 12 * k), (cx + 100 * k, cy + 72 * k)]
    return [Ridge(arc, 60 * k, widths=[44 * k, 62 * k, 72 * k, 76 * k, 70 * k, 60 * k, 42 * k],
                  heights=[0.5, 0.75, 0.95, 1.0, 0.9, 0.7, 0.48], irregular=0.26),
            Blob(cx - 4 * k, cy - 30 * k, 88 * k, 72 * k, rot=-15, height=1.0, irregular=0.28),
            Blob(cx + 2 * k, cy + 16 * k, 70 * k, 50 * k, rot=10, height=0.72, irregular=0.5)]   # saddle: keeps only a shallow notch


def bluffs_shapes():
    S = json.load(open(f'{REPO}/grant/assets/src/vicksburg_story.json'))
    pts = [(x * 2, y * 2) for x, y in S['ridge']]
    # extend a little south towards Warrenton
    (xa, ya), (xb, yb) = pts[-2], pts[-1]; pts.append((xb + (xb - xa) * 0.8, yb + (yb - ya) * 0.8))
    n = len(pts)
    widths = [52, 72, 82, 84, 80, 72, 46][:n]
    heights = [0.7, 0.9, 1.0, 1.0, 0.95, 0.85, 0.6][:n]
    return [Ridge(pts, 70, widths=widths, heights=heights, irregular=0.30, steep_west=0.6)]


def main():
    out = {}
    imgs = {k: np.asarray(Image.open(f'{ASSETS}/vicksburg_{k}.jpg').convert('RGB')) for k in ('w', 'w_close')}
    for key, suffix in (('w', ''), ('w_close', '_close')):
        base = imgs[key]
        rgba, comp, bb = render_hills(base, champion_shapes(), erase=[('circle', 3268, 1414, 74)], seed=11, rough=1.0, shadow=1.0)
        out[f'champion_hill{suffix}'] = save_overlay(rgba, f'{HERE}/champion_hill{suffix}.png', bb, dict(basemap=f'vicksburg_{key}.jpg'))
        Image.fromarray(comp[bb[1]:bb[3], bb[0]:bb[2]]).save(f'{HERE}/preview_champion{suffix}.jpg', quality=92)
        rgba2, comp2, bb2 = render_hills(base, bluffs_shapes(), erase=[('line', [(x * 2, y * 2) for x, y in json.load(open(f'{REPO}/grant/assets/src/vicksburg_story.json'))['ridge']], 46)], seed=5, rough=1.0, shadow=0.9)
        out[f'vicksburg_bluffs{suffix}'] = save_overlay(rgba2, f'{HERE}/vicksburg_bluffs{suffix}.png', bb2, dict(basemap=f'vicksburg_{key}.jpg'))
        Image.fromarray(comp2[bb2[1]:bb2[3], bb2[0]:bb2[2]]).save(f'{HERE}/preview_bluffs{suffix}.jpg', quality=92)
        if key == 'w':
            make_compare(base, comp, (3268, 1418))
    json.dump(out, open(f'{HERE}/hills_meta.json', 'w'), indent=1)


def make_compare(base, comp, c, s=1.9):
    """left: owner reference zoom; right: ours at the same on-screen scale (camera s=1.9 -> 1 image px = 0.95 screen px),
    and the old baked hachure hill. The ref zoom shows ~470 screen px of a phone frame across 1062 px (~2.26x of 1080p)."""
    ref = Image.open(f'{HERE}/../ref_hill_zoom.png').convert('RGB')
    Hh = ref.size[1]
    # the ref zoom is the owner's phone frame enlarged ~2.26x vs 1080p (README of the roads agent)... the brief puts the
    # reference hill at ~250x300 px at 1080p, which is ~0.47x of its size in the zoom (530 x 560 px). Match the zoom factor:
    zoom = 2.1
    half = int(Hh / zoom / (s / 2) / 2)          # image px half-window giving the same framing
    cx, cy = c
    def win(a):
        return Image.fromarray(a[cy - half:cy + half, cx - half:cx + half]).resize((Hh, Hh), Image.LANCZOS)
    tiles = [ref.resize((int(ref.size[0] * Hh / ref.size[1]), Hh)), win(comp), win(base)]
    W = sum(t.size[0] for t in tiles) + 40
    sheet = Image.new('RGB', (W, Hh + 50), (20, 20, 18)); x = 0
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    for t, lab in zip(tiles, ['owner reference (zoom)', 'NEW painted Champion Hill (vicksburg_w, s=1.9)', 'OLD hachure hill (same view)']):
        sheet.paste(t, (x, 50)); d.text((x + 10, 15), lab, fill=(230, 225, 200)); x += t.size[0] + 20
    sheet.save(f'{HERE}/compare.jpg', quality=90)


if __name__ == '__main__':
    main()
