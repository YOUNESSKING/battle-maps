#!/usr/bin/env python3
"""Procedural painted FARMSTEAD sprite for the Style W living map (2e), 1863 Mississippi (no AI imagery).

Same look, palette and tricks as the painted towns (roads_towns/towns/make_town.py, imported from there):
dark brown/charcoal NW-lit roofs with SE drop shadows, warm tan dust yard feathered into the grass,
~1 px painted softening. Around the farmhouse: 1-3 outbuildings (barn, corn crib, sheds; a plantation adds
a short row of cabins + a gin house), a kitchen garden, an orchard of round tree dots in rows, 2-6 fields
with fine crop furrows in tones taken from the map green (ploughed / cotton, green corn, pale wheat, pasture),
split-rail "worm" fences as thin dark zig-zags along the field edges, and a dusty lane to the road.

UNITS: all geometry is in "u" = one pixel of the 1080p output frame at the camera scale the sprite is made
for (s = 1.9 screen px per map px on vicksburg_w, like the towns). `ppu` = image px per u (default 2.0).

API
    render_farm(seed, size=60, orientation=None, n_fields=4, season="may", ppu=2.0,
                lane_to=None, roads=(), plantation=False, orchard=True, label=None, label_curve=None,
                label_size=20)
        -> (PIL.Image RGBA, (cx, cy), info)
    seed         int, deterministic
    size         long side of the field block in u (~45 small farm, ~60 farm, ~80 plantation)
    orientation  degrees of the field grid's long axis (0 = east, 90 = south, image coords); None = random.
                 Put it parallel to the road the farm sits on.
    n_fields     2-6 fields (plus the yard/orchard cell)
    season       "may" (default: May 1863 - ploughed cotton land, young corn, ripening wheat, pasture),
                 "summer", "autumn", "winter" (changes the crop mix and tones)
    lane_to      (x, y) in u relative to the block centre: the point on the road the lane runs to; the yard is
                 put in the cell nearest to it. None = a short lane off to one side.
    roads        road polylines in u (relative to the block centre): fields keep ~2.5 u clear of them.
    plantation   True = bigger house, a row of 3-5 cabins (quarters) and a gin house
    label        optional text -> info["label"] = (RGBA image, (ax, ay)) rendered with towns/label.py
                 render_label_curve (ivory engraved serif, the 2e town-name look; features use size 20-24)
    label_curve  Bezier control points in u relative to the block centre (default: gentle arc under the farm)
    (cx, cy)     image px of the block centre inside the returned image (the placement anchor)
    info         dict: house_px, lane_end_px, fields (type, furrow angle), ppu, size_u

Placing on a map (identical to the towns): k = map px per image px = map_ppu / ppu with map_ppu = map px per u
(= 1 / 1.9 on vicksburg_w). left = map_x - cx * k, top = map_y - cy * k, width = W * k, height = H * k.
`map_to_local(points, centre, map_ppu)` turns a map-px road polyline into the u coordinates `roads=` and
`lane_to` expect. Layer: with the towns (under the road SVG, above texture/rivers).

CLI:  python3 make_farm.py      -> coker_house.png, champion_house.png, generic_1.png, generic_2.png,
                                   label_*.png, farms.json (placement on vicksburg_w), then preview.jpg
"""
import json
import math
import os
import sys
sys.dont_write_bytecode = True   # never leave caches in the shared roads_towns folders

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

TW = "/home/user/battle-maps/research/style_tests/roads_towns/towns"
sys.path.insert(0, TW)
from make_town import (_fbm, _seg_dist, _segs, _wobbly, _draw_rect_cov, _draw_building,  # noqa: E402
                       map_to_local, ROOFS_SOFT, GROUND_SOFT, GROUND_SOFT_LIGHT, GROUND_SOFT_WARM,
                       GROUND_SOFT_DARK)

# the map green (vicksburg_w around Champion Hill: mean (101, 105, 56), light (112, 116, 64))
GRASS = np.array([103, 107, 57], float)
# field tones: all pulled from the grass so they sit in the map (owner ref: fields are quiet tone shifts)
FIELD = {
    #            ground rgb             furrow rgb          ridge rgb          spacing u, line w u, alpha
    "plough":  ((116, 97, 63),  (74, 60, 40),   (138, 120, 84),  1.9, 0.62, 0.86),
    "cotton":  ((112, 98, 64),  (78, 92, 44),   (134, 118, 82),  2.2, 0.70, 0.86),   # brown ground, young green rows
    "corn":    ((86, 100, 50),  (62, 76, 36),   (104, 116, 60),  2.3, 0.80, 0.82),
    "wheat":   ((140, 134, 84), (116, 108, 66), (154, 148, 98), 1.6, 0.52, 0.84),
    "stubble": ((146, 134, 88), (112, 100, 64), (160, 150, 104), 1.7, 0.45, 0.80),
    "pasture": ((112, 117, 62), None,           None,            0, 0, 0.55),
    "fallow":  ((104, 100, 58), (86, 82, 46),   None,            3.0, 0.5, 0.60),
}
SEASON = {   # crop weights
    "may":    dict(plough=2, cotton=3, corn=3, wheat=2, pasture=1),
    "summer": dict(cotton=3, corn=4, stubble=2, pasture=1),
    "autumn": dict(plough=2, stubble=3, corn=1, pasture=2, fallow=1),
    "winter": dict(plough=3, fallow=3, pasture=2, stubble=1),
}
FENCE = np.array([40, 33, 24], float)
VERGE = np.array([74, 82, 40], float)
TREE = np.array([62, 78, 36], float)
TREE_LIT = np.array([104, 116, 58], float)
DUST = GROUND_SOFT
LIGHT_SH = (1.0, 1.4)   # SE shadow offset in u, as the towns


# ----------------------------------------------------------------- layout
def _split(rng, cells, n):
    """guillotine split: always cut the biggest cell across its long side"""
    while len(cells) < n:
        i = max(range(len(cells)), key=lambda j: cells[j][2] * cells[j][3])
        x, y, w, h = cells.pop(i)
        t = rng.uniform(0.36, 0.64)
        if w >= h:
            cells += [(x, y, w * t, h), (x + w * t, y, w * (1 - t), h)]
        else:
            cells += [(x, y, w, h * t), (x, y + h * t, w, h * (1 - t))]
    return cells


class Frame:
    """local field-grid frame (rotated by the orientation, gently warped) <-> u around the block centre"""

    def __init__(self, ang, rng, amp):
        self.c, self.s = math.cos(ang), math.sin(ang)
        self.w = [(rng.uniform(0.02, 0.05), rng.uniform(0.02, 0.05), rng.uniform(0, 6.3), amp * rng.uniform(0.5, 1.0))
                  for _ in range(3)]

    def _d(self, x, y):
        dx = sum(a * np.sin(fx * x + fy * y + p) for fx, fy, p, a in self.w)
        dy = sum(a * np.sin(fy * x - fx * y + p + 1.7) for fx, fy, p, a in self.w)
        return dx, dy

    def fwd(self, x, y):           # local -> u
        dx, dy = self._d(x, y)
        x, y = x + dx, y + dy
        return x * self.c - y * self.s, x * self.s + y * self.c

    def inv(self, X, Y):           # u -> local (first order; the warp is small and smooth)
        x, y = X * self.c + Y * self.s, -X * self.s + Y * self.c
        dx, dy = self._d(x, y)
        return x - dx, y - dy


def _layout(rng, size, n_fields, ang, lane_to, plantation, orchard):
    A = size
    B = size * rng.uniform(0.62, 0.82)
    fr = Frame(ang, rng, size * 0.04)
    cells = _split(rng, [(-A / 2, -B / 2, A, B)], n_fields + 1)
    # trim the outline: outer cells lose a little depth so the block is not a perfect rectangle
    out = []
    for (x, y, w, h) in cells:
        if x <= -A / 2 + 1e-6 and rng.random() < 0.5:
            d = w * rng.uniform(0.0, 0.22); x += d; w -= d
        if x + w >= A / 2 - 1e-6 and rng.random() < 0.5:
            w -= w * rng.uniform(0.0, 0.22)
        if y <= -B / 2 + 1e-6 and rng.random() < 0.5:
            d = h * rng.uniform(0.0, 0.22); y += d; h -= d
        if y + h >= B / 2 - 1e-6 and rng.random() < 0.5:
            h -= h * rng.uniform(0.0, 0.22)
        out.append((x, y, w, h))
    cells = out
    # the yard cell: nearest the road (lane_to) - the house stands by the lane; else nearest the centre
    if lane_to is not None:
        lx, ly = fr.inv(np.array(lane_to[0], float), np.array(lane_to[1], float))
        key = lambda c: math.hypot(c[0] + c[2] / 2 - float(lx), c[1] + c[3] / 2 - float(ly)) + 0.3 * max(c[2], c[3])
    else:
        key = lambda c: math.hypot(c[0] + c[2] / 2, c[1] + c[3] / 2) + 0.2 * c[2] * c[3] / size
    yi = min(range(len(cells)), key=lambda j: key(cells[j]))
    ycell = cells.pop(yi)
    return fr, cells, ycell, (A, B)


# ----------------------------------------------------------------- painting helpers
def _poly_mask(shape, pts_px, width_px, ss=3):
    """anti-aliased polyline coverage (0..1) via a supersampled cv2 raster"""
    H, W = shape
    m = np.zeros((H * ss, W * ss), np.uint8)
    for pts in pts_px:
        P = np.round(np.asarray(pts, float) * ss * 16).astype(np.int32).reshape(-1, 1, 2)
        cv2.polylines(m, [P], False, 255, max(1, int(round(width_px * ss))), cv2.LINE_AA, shift=4)
    return cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(float) / 255


def _disc_soft(arr, x, y, r, ppu, cxp, cyp, val=1.0):
    px, py = cxp + x * ppu, cyp + y * ppu
    R = r * ppu + 2
    x0, x1 = max(0, int(px - R)), min(arr.shape[1], int(px + R) + 2)
    y0, y1 = max(0, int(py - R)), min(arr.shape[0], int(py + R) + 2)
    if x0 >= x1 or y0 >= y1:
        return
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(float)
    d = np.hypot(xx + 0.5 - px, yy + 0.5 - py)
    arr[y0:y1, x0:x1] = np.maximum(arr[y0:y1, x0:x1], np.clip(r * ppu + 0.5 - d, 0, 1) * val)


def _worm(p0, p1, period, amp, phase_axis):
    """split-rail worm fence along a straight local segment: zig-zag with the phase pinned to the absolute
    coordinate along the axis, so two fields sharing an edge draw the very same fence"""
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0)
    if L < 1:
        return []
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    nx, ny = -uy, ux
    s0 = (x0 if phase_axis == 0 else y0) * (1 if (ux if phase_axis == 0 else uy) >= 0 else -1)
    k0 = math.ceil(s0 / (period / 2))
    first = k0 * period / 2 - s0
    pts = [(x0, y0)]
    t = first
    while t < L:
        k = int(round((s0 + t) / (period / 2)))
        o = amp if k % 2 else -amp
        pts.append((x0 + ux * t + nx * o, y0 + uy * t + ny * o))
        t += period / 2
    pts.append((x1, y1))
    return pts


def _route_lane(rng, fr, house, ycell, cells, A, B):
    """lane from the house (local) out past the block edge: straight or one dog-leg along a cell boundary;
    the path that crosses the least crop wins. Returns u points."""
    hx, hy = house
    yx, yy, yw, yh = ycell
    out_x, out_y = A / 2 + 5, B / 2 + 5

    def crop_len(path):
        n = 0
        for (x0, y0), (x1, y1) in zip(path, path[1:]):
            L = math.hypot(x1 - x0, y1 - y0)
            for i in range(int(L) + 1):
                t = i / max(1, int(L))
                x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                if any(cx + 1.2 < x < cx + cw - 1.2 and cy + 1.2 < y < cy + ch - 1.2 for cx, cy, cw, ch in cells):
                    n += 1
        return n + 0.02 * sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(path, path[1:]))

    cands = [[(hx, hy), (out_x * sx, hy)] for sx in (-1, 1)] + [[(hx, hy), (hx, out_y * sy)] for sy in (-1, 1)]
    for ex in (yx, yx + yw):           # to a vertical yard edge, then along it
        for sy in (-1, 1):
            cands.append([(hx, hy), (ex, hy), (ex, out_y * sy)])
    for ey in (yy, yy + yh):
        for sx in (-1, 1):
            cands.append([(hx, hy), (hx, ey), (out_x * sx, ey)])
    best = min(cands, key=crop_len)
    pts = []
    for a, b in zip(best, best[1:]):
        seg = _wobbly(a, b, rng, 0.6, 5)
        pts += seg if not pts else seg[1:]
    return [fr.fwd(x, y) for x, y in pts]


# ----------------------------------------------------------------- render
def render_farm(seed, size=60, orientation=None, n_fields=4, season="may", ppu=2.0, lane_to=None, roads=(),
                plantation=False, orchard=True, label=None, label_curve=None, label_size=20):
    rng = np.random.default_rng(seed)
    n_fields = int(min(6, max(2, n_fields)))
    ang = math.radians(orientation if orientation is not None else rng.uniform(0, 180))
    fr, cells, ycell, (A, B) = _layout(rng, size, n_fields, ang, lane_to, plantation, orchard)

    # canvas: block + lane end + margin
    ext = [fr.fwd(x, y) for (x, y, w, h) in cells + [ycell] for x, y in ((x, y), (x + w, y), (x, y + h), (x + w, y + h))]
    if lane_to is not None:
        ext.append(tuple(lane_to))
    xs = [p[0] for p in ext]; ys = [p[1] for p in ext]
    m = 6.0
    ux0, ux1, uy0, uy1 = min(xs) - m, max(xs) + m, min(ys) - m, max(ys) + m
    W, H = int((ux1 - ux0) * ppu), int((uy1 - uy0) * ppu)
    cxp, cyp = -ux0 * ppu, -uy0 * ppu
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    X, Y = (xx + 0.5 - cxp) / ppu, (yy + 0.5 - cyp) / ppu
    LX, LY = fr.inv(X, Y)
    nz = _fbm((H, W), rng, scales=(16 * ppu, 6 * ppu, 2.2 * ppu), amps=(1, 0.6, 0.35))
    nz2 = _fbm((H, W), rng, scales=(26 * ppu, 9 * ppu), amps=(1, 0.5))
    wob = _fbm((H, W), rng, scales=(9 * ppu, 3 * ppu), amps=(1, 0.4))

    col = np.zeros((H, W, 3)) + GRASS
    alpha = np.zeros((H, W))
    road_segs = [s for p in roads for s in _segs(p)]
    road_clear = np.clip((_seg_dist(X, Y, road_segs) - 2.6) / 1.2, 0, 1) if road_segs else np.ones((H, W))

    def over(c, a):
        nonlocal col, alpha
        a = np.clip(a, 0, 1)
        na = a + alpha * (1 - a)
        col = (np.asarray(c, float) * a[..., None] + col * (alpha * (1 - a))[..., None]) / np.maximum(na, 1e-6)[..., None]
        alpha = na

    def box_sd(x, y, w, h, rad=0.9):
        qx = np.abs(LX - (x + w / 2)) - (w / 2 - rad)
        qy = np.abs(LY - (y + h / 2)) - (h / 2 - rad)
        return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - rad

    # ---------------- fields
    weights = SEASON.get(season, SEASON["may"])
    kinds = list(weights); pw = np.array([weights[k] for k in kinds], float); pw /= pw.sum()
    finfo = []
    gaps = []
    last = None
    for (x, y, w, h) in cells:
        k = kinds[rng.choice(len(kinds), p=pw)]
        if k == last and rng.random() < 0.7:     # neighbours rarely share a crop
            k = kinds[rng.choice(len(kinds), p=pw)]
        last = k
        base, fur, ridge, sp, lw, fa = FIELD[k]
        g = rng.uniform(0.9, 1.6)               # grass strip (fence row) half-width
        gaps.append(g)
        sd = box_sd(x + g, y + g, w - 2 * g, h - 2 * g) + 0.45 * wob
        cov = np.clip(0.5 - sd * ppu / 1.4, 0, 1) * road_clear
        if cov.max() <= 0:
            continue
        c = np.zeros((H, W, 3)) + np.asarray(base, float) * rng.normal(1, 0.025)
        c = c * (1 + 0.06 * nz[..., None]) + 6 * nz2[..., None]
        fang = 0.0
        if fur is not None:
            # furrow direction: with the long side, across it, or a contour slant
            r_ = rng.random()
            fang = (0 if w >= h else 90) if r_ < 0.45 else ((90 if w >= h else 0) if r_ < 0.75 else rng.choice([-1, 1]) * rng.uniform(14, 38))
            fa_r = math.radians(fang)
            proj = LX * -math.sin(fa_r) + LY * math.cos(fa_r) + 0.25 * wob + rng.uniform(0, sp)
            fr_ = np.mod(proj / sp, 1.0)
            d = np.abs(fr_ - 0.5) * sp                       # u from the furrow centre
            line = np.clip((lw / 2 - d) * ppu + 0.5, 0, 1)
            rid = np.clip((lw / 2 - np.abs(d - lw * 0.75)) * ppu + 0.5, 0, 1) * 0.0
            if ridge is not None:                            # lit edge on the NW side of each furrow
                rid = np.clip((0.35 - np.abs(np.mod(proj / sp, 1.0) * sp - (sp / 2 - lw * 0.9))) * ppu + 0.3, 0, 1) * 0.45
            # headland: the furrows stop ~1 u inside the field edge (a turning strip)
            head = np.clip((-sd - 1.2) * ppu / 1.5, 0, 1)
            strength = (0.78 + 0.22 * nz2) * head
            c = c * (1 - (line * strength)[..., None]) + np.asarray(fur, float) * (line * strength)[..., None]
            if ridge is not None:
                c = c * (1 - (rid * head)[..., None]) + np.asarray(ridge, float) * (rid * head)[..., None]
        if k == "pasture":   # a few dark grazing tufts
            for _ in range(int(w * h / 60)):
                px, py = rng.uniform(x + 2, x + w - 2), rng.uniform(y + 2, y + h - 2)
                qx, qy = fr.fwd(px, py)
                t_ = np.zeros((H, W)); _disc_soft(t_, qx, qy, rng.uniform(0.4, 0.7), ppu, cxp, cyp)
                c = c * (1 - 0.4 * t_[..., None]) + VERGE * 0.4 * t_[..., None]
        # soft inner shade along the edge (painted rim, light from the NW)
        rim = np.clip(1 - (-sd) / 1.6, 0, 1) * (sd < 0.5)
        c = c * (1 - 0.10 * rim[..., None])
        over(c, cov * fa * (0.94 + 0.06 * nz))
        finfo.append(dict(rect=[round(v, 1) for v in (x, y, w, h)], crop=k, furrows_deg=round(math.degrees(ang) + fang, 1)))

    # ---------------- yard (dust), garden, orchard
    yx, yy_, yw, yh = ycell
    g = 1.3
    # yard takes the part of its cell nearest the lane, orchard the rest
    split_along_x = yw >= yh
    if lane_to is not None:
        lx, ly = fr.inv(np.array(lane_to[0], float), np.array(lane_to[1], float))
        near_low = (float(lx) < yx + yw / 2) if split_along_x else (float(ly) < yy_ + yh / 2)
    else:
        near_low = rng.random() < 0.5
    t = (rng.uniform(0.66, 0.74) if plantation else rng.uniform(0.5, 0.62)) if orchard else 1.0
    if split_along_x:
        yard = (yx, yy_, yw * t, yh) if near_low else (yx + yw * (1 - t), yy_, yw * t, yh)
        orch = (yx + yw * t, yy_, yw * (1 - t), yh) if near_low else (yx, yy_, yw * (1 - t), yh)
    else:
        yard = (yx, yy_, yw, yh * t) if near_low else (yx, yy_ + yh * (1 - t), yw, yh * t)
        orch = (yx, yy_ + yh * t, yw, yh * (1 - t)) if near_low else (yx, yy_, yw, yh * (1 - t))

    # house position: in the yard, toward the lane side
    ax_, ay_, aw, ah = yard
    hx = ax_ + aw * rng.uniform(0.38, 0.62)
    hy = ay_ + ah * rng.uniform(0.38, 0.62)
    if lane_to is not None:
        lx, ly = fr.inv(np.array(lane_to[0], float), np.array(lane_to[1], float))
        hx = hx * 0.75 + float(np.clip(lx, ax_ + 4, ax_ + aw - 4)) * 0.25
        hy = hy * 0.75 + float(np.clip(ly, ay_ + 4, ay_ + ah - 4)) * 0.25

    # buildings in local frame: (x, y, rot (local rad), a, b, style, colour index, chimneys)
    bs = []
    ha, hb = (5.0, 3.0) if plantation else (4.0, 2.5)
    bs.append((hx, hy, 0.0, ha, hb, "gable", 0, True))
    occupied = [(hx, hy, ha + 1.5)]

    def put(a, b, style, ci, near=(hx, hy), rmin=7, rmax=13, rot=None, tries=60):
        for _ in range(tries):
            th = rng.uniform(0, 6.283)
            r = rng.uniform(rmin, rmax)
            x, y = near[0] + math.cos(th) * r, near[1] + math.sin(th) * r
            if not (ax_ + a * 0.6 < x < ax_ + aw - a * 0.6 and ay_ + a * 0.6 < y < ay_ + ah - a * 0.6):
                continue
            if any(math.hypot(x - ox, y - oy) < rr + max(a, b) + 0.9 for ox, oy, rr in occupied):
                continue
            ro = rot if rot is not None else (rng.choice([0.0, math.pi / 2]) + rng.normal(0, 0.04))
            bs.append((x, y, ro, a, b, style, ci, False))
            occupied.append((x, y, max(a, b)))
            return (x, y)
        return None

    if plantation:
        # quarters: a short straight row of small cabins behind the house + a gin house
        # along the yard edge farthest from the house, one straight street of cabins
        long_x = aw >= ah
        if long_x:
            ry = ay_ + 3.0 if hy - ay_ > ay_ + ah - hy else ay_ + ah - 3.0
            row = [(ax_ + 3.0 + i * 4.0, ry) for i in range(int((aw - 6) / 4.0) + 1)]
        else:
            rx = ax_ + 3.0 if hx - ax_ > ax_ + aw - hx else ax_ + aw - 3.0
            row = [(rx, ay_ + 3.0 + i * 4.0) for i in range(int((ah - 6) / 4.0) + 1)]
        nc = 0
        for (cx_, ry_) in row:
            if nc < 5 and not (abs(cx_ - hx) < ha + 2.6 and abs(ry_ - hy) < hb + 2.6):
                bs.append((cx_, ry_, 0.0 if not long_x else math.pi / 2, 1.5, 1.2, "gable", 3, True))
                occupied.append((cx_, ry_, 1.5)); nc += 1

    n_out = int(rng.integers(1, 4))
    barn = put(rng.uniform(4.6, 5.8), rng.uniform(2.8, 3.4), "gable", 1, rmin=9, rmax=15)
    if plantation:
        put(3.6, 3.0, "gable", 1, rmin=8, rmax=17)        # gin house
    for _ in range(n_out - 1):
        put(rng.uniform(1.6, 2.6), rng.uniform(1.3, 1.9), rng.choice(["flat", "gable"]), 2, rmin=6, rmax=13)

    # yard dust patch: blob around the buildings, feathered (as the towns' dust patch, smaller)
    foot = np.zeros((H, W))
    for (bx, by, ro, a, b, st, ci, ch) in bs:
        qx, qy = fr.fwd(bx, by)
        _draw_rect_cov(foot, qx, qy, ang + ro, a, b, ppu, cxp, cyp, value_only=True)
    ysd = box_sd(ax_ + g, ay_ + g, aw - 2 * g, ah - 2 * g, rad=3.0) + 0.6 * wob
    yard_m = np.clip(0.5 - ysd * ppu / 3.0, 0, 1)
    dust = np.maximum(ndi.gaussian_filter(foot, 3.2 * ppu) * 2.6, 0)
    dust = np.clip(np.maximum(dust, yard_m * (0.55 + 0.2 * nz)), 0, 1)
    dust = np.clip(ndi.gaussian_filter(dust, 1.0 * ppu) * (1 + 0.25 * nz), 0, 1)
    dc = DUST[None, None, :] * 0.93 * (1 + 0.07 * nz[..., None]) + 8 * nz2[..., None]
    warm = np.clip(0.5 - 1.2 * nz, 0, 1)[..., None] * 0.4
    dc = dc * (1 - warm) + GROUND_SOFT_WARM * warm
    li = np.clip(0.5 + 0.9 * nz2, 0, 1)[..., None]
    dc = dc * (1 - 0.3 * li) + GROUND_SOFT_LIGHT * 0.3 * li
    over(dc, np.clip(dust * 1.15, 0, 1) * 0.92)

    # kitchen garden: small furrowed square beside the house
    gx, gy = hx + rng.choice([-1, 1]) * (ha + 4.5), hy + rng.choice([-1, 1]) * rng.uniform(0, 3)
    if ax_ + 3 < gx < ax_ + aw - 3 and not any(math.hypot(gx - ox, gy - oy) < rr + 3.2 for ox, oy, rr in occupied[1:]):
        gs = box_sd(gx - 2.6, gy - 2.2, 5.2, 4.4, rad=0.4)
        gm = np.clip(0.5 - gs * ppu, 0, 1)
        rows = np.clip((0.4 - np.abs(np.mod(LY - gy, 1.3) - 0.65)) * ppu + 0.3, 0, 1)
        gc = np.zeros((H, W, 3)) + np.array([104, 86, 56], float)
        gc = gc * (1 - 0.6 * rows[..., None]) + np.array([70, 90, 40], float) * 0.6 * rows[..., None]
        over(gc, gm * 0.9)
        occupied.append((gx, gy, 3.0))

    # orchard: rows of round trees (shadow + NW-lit canopy), on a mown, slightly darker ground
    trees = []
    if orchard:
        ox_, oy_, ow, oh = orch
        osd = box_sd(ox_ + g, oy_ + g, ow - 2 * g, oh - 2 * g, rad=1.2)
        om = np.clip(0.5 - osd * ppu / 1.4, 0, 1) * road_clear
        over(np.zeros((H, W, 3)) + GRASS * np.array([0.93, 0.97, 0.9]) + 5 * nz2[..., None], om * 0.45)
        sp = rng.uniform(3.0, 3.4)
        tr = sp * rng.uniform(0.38, 0.43)
        nx_ = int((ow - 2 * g - 1.2) / sp); ny_ = int((oh - 2 * g - 1.2) / sp)
        offx = ox_ + g + (ow - 2 * g - (nx_ - 1) * sp) / 2
        offy = oy_ + g + (oh - 2 * g - (ny_ - 1) * sp) / 2
        for i in range(max(0, nx_)):
            for j in range(max(0, ny_)):
                if rng.random() < 0.06:
                    continue
                trees.append(fr.fwd(offx + i * sp + rng.normal(0, 0.12), offy + j * sp + rng.normal(0, 0.12)) + (tr * rng.uniform(0.85, 1.1),))
        # shade trees around the house (two or three big ones)
        for _ in range(int(rng.integers(1, 4))):
            th = rng.uniform(0, 6.28); r = rng.uniform(ha + 3, ha + 7)
            tx, ty = hx + math.cos(th) * r, hy + math.sin(th) * r
            if not any(math.hypot(tx - ox, ty - oy) < rr + 2.4 for ox, oy, rr in occupied):
                trees.append(fr.fwd(tx, ty) + (rng.uniform(1.7, 2.3),))
    tsh = np.zeros((H, W)); tcan = np.zeros((H, W))
    for (tx, ty, r) in trees:
        _disc_soft(tsh, tx + 0.7, ty + 0.95, r * 1.02, ppu, cxp, cyp)
        _disc_soft(tcan, tx, ty, r, ppu, cxp, cyp)
    tsh = ndi.gaussian_filter(tsh, 0.45 * ppu)
    over(np.zeros((H, W, 3)) + np.array([34, 38, 20], float), tsh * 0.5 * (1 - tcan))
    # canopy shading: NW highlight from a blurred, offset copy of the mask
    hi = np.clip(tcan - _shift(tcan, 0.55 * ppu, 0.55 * ppu), 0, 1)
    hi = ndi.gaussian_filter(hi, 0.4 * ppu)
    dk = np.clip(tcan - _shift(tcan, -0.5 * ppu, -0.5 * ppu), 0, 1)
    tc = np.zeros((H, W, 3)) + TREE * (1 + 0.08 * nz[..., None])
    tc = tc * (1 - 0.65 * hi[..., None]) + TREE_LIT * 0.65 * hi[..., None]
    tc = tc * (1 - 0.35 * dk[..., None])
    over(tc, tcan * 0.97)

    # ---------------- lane to the road (pale dusty track with two faint ruts)
    house_u = fr.fwd(hx, hy)
    lane_pts = None
    if lane_to is None:
        # route out of the block along the yard / the grass strips between fields, never across a crop
        lane_pts = _route_lane(rng, fr, (hx, hy), ycell, cells, A, B)
        lane_to_ = lane_pts[-1]
    else:
        lane_to_ = tuple(lane_to)
        lane_pts = _wobbly(house_u, lane_to_, rng, 1.2, 8)
    ld = _seg_dist(X, Y, _segs(lane_pts))
    lane_band = np.clip(1.0 - (ld - 0.6) / 1.2, 0, 1) ** 0.8 * (0.8 + 0.2 * nz)
    lane_band *= np.clip(np.hypot(X - house_u[0], Y - house_u[1]) / 3.0, 0, 1)
    over(np.zeros((H, W, 3)) + (GROUND_SOFT_LIGHT + 12) * (1 + 0.05 * nz[..., None]), lane_band * 0.85)
    for sgn in (-1, 1):
        rut = []
        for i, (px, py) in enumerate(lane_pts):
            a_, b_ = lane_pts[max(0, i - 1)], lane_pts[min(len(lane_pts) - 1, i + 1)]
            tx, ty = b_[0] - a_[0], b_[1] - a_[1]; n_ = math.hypot(tx, ty) + 1e-9
            rut.append((cxp + (px - ty / n_ * 0.5 * sgn) * ppu, cyp + (py + tx / n_ * 0.5 * sgn) * ppu))
        rm = _poly_mask((H, W), [rut], 0.4 * ppu) * (0.7 + 0.3 * nz)
        over(np.zeros((H, W, 3)) + np.array([70, 62, 36], float), rm * 0.75)

    # ---------------- worm fences along the field edges (+ yard / orchard), broken at the lane
    fence_lines = []
    fence_lines_extra = []
    for (x, y, w, h) in cells + [orch] + ([ycell] if not orchard else []):
        edges = [((x, y), (x + w, y), 0), ((x + w, y), (x + w, y + h), 1), ((x, y + h), (x + w, y + h), 0), ((x, y), (x, y + h), 1)]
        for p0, p1, axis in edges:
            if rng.random() < 0.3:
                continue
            per = 2.6
            pts = _worm(p0, p1, per, 0.55, axis)
            # broken runs: a rail section down here and there
            if len(pts) > 8 and rng.random() < 0.5:
                i0 = int(rng.integers(2, len(pts) - 4)); pts_b = pts[i0 + int(rng.integers(2, 4)):]
                fence_lines_extra.append(pts_b); pts = pts[:i0]
            # sub-sample each straight piece through the warp
            out = []
            for i in range(len(pts) - 1):
                for s in range(3):
                    tt = s / 3
                    out.append(fr.fwd(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * tt, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * tt))
            out.append(fr.fwd(*pts[-1]))
            fence_lines.append([(cxp + u * ppu, cyp + v * ppu) for u, v in out])
    for pts in fence_lines_extra:
        if len(pts) > 1:
            out = [fr.fwd(*p_) for p_ in pts]
            fence_lines.append([(cxp + u * ppu, cyp + v * ppu) for u, v in out])
    fm = _poly_mask((H, W), fence_lines, 0.42 * ppu)
    gap = np.clip((ld - 1.6) / 0.6, 0, 1) * road_clear      # gate where the lane passes, none on the road
    fm *= gap * (0.85 + 0.15 * nz)
    fsh = _shift(ndi.gaussian_filter(fm, 0.35 * ppu), 0.45 * ppu, 0.6 * ppu)
    verge = ndi.gaussian_filter(fm, 1.1 * ppu)                    # weedy fence row
    over(np.zeros((H, W, 3)) + VERGE, np.clip(verge * 1.3, 0, 1) * 0.28 * gap)
    over(np.zeros((H, W, 3)) + np.array([30, 30, 16], float), fsh * 0.22)
    over(np.zeros((H, W, 3)) + FENCE, fm * 0.62)

    # ---------------- buildings (towns' drawing code: NW-lit roofs, dark outline) + SE shadows
    sh = np.zeros((H, W))
    for (bx, by, ro, a, b, st, ci, ch) in bs:
        qx, qy = fr.fwd(bx, by)
        _draw_rect_cov(sh, qx + LIGHT_SH[0], qy + LIGHT_SH[1], ang + ro, a, b, ppu, cxp, cyp, value_only=True)
    sh = np.clip(ndi.gaussian_filter(sh, 0.7 * ppu), 0, 1)
    over(np.zeros((H, W, 3)) + GROUND_SOFT_DARK * 0.55, sh * 0.62)
    img = np.dstack([col, alpha])
    palette = {0: [(0.6, (60, 48, 38)), (0.25, (47, 41, 35)), (0.15, (112, 56, 42))],    # house: dark shingle, some red
               1: [(0.55, (86, 71, 54)), (0.3, (60, 48, 38)), (0.15, (104, 92, 76))],    # barn: weathered boards
               2: [(0.5, (60, 48, 38)), (0.3, (86, 71, 54)), (0.2, (47, 41, 35))],
               3: [(0.7, (66, 54, 42)), (0.3, (78, 66, 52))]}
    for (bx, by, ro, a, b, st, ci, ch) in bs:
        ws = np.array([w_ for w_, _ in palette[ci]]); ws /= ws.sum()
        base = np.array(palette[ci][rng.choice(len(ws), p=ws)][1], float) * rng.normal(1, 0.06)
        base = base * 0.82 + GROUND_SOFT * 0.18          # the towns' "soft" pull toward the dust colour
        base[1] = min(base[1], base[0]); base[2] = min(base[2], base[1] * 0.97)
        qx, qy = fr.fwd(bx, by)
        _draw_building(img, qx, qy, ang + ro, a, b, ppu, cxp, cyp, base, st, rng)
        if ch:   # brick chimney(s) at the gable ends
            for e in ((-1, 1) if ci == 0 else (rng.choice([-1, 1]),)):
                ex, ey = bx + e * (a - 0.7) * math.cos(ro), by + e * (a - 0.7) * math.sin(ro)
                ex_, ey_ = fr.fwd(ex, ey)
                _draw_building(img, ex_, ey_, ang + ro, 0.5, 0.5, ppu, cxp, cyp, np.array([98, 54, 40], float), "flat", rng)

    # ---------------- painted softening (as the towns), straight alpha out
    pm = img[..., :3] * img[..., 3:4]
    sig = 0.32 * ppu
    a_s = ndi.gaussian_filter(img[..., 3], sig)
    pm = np.dstack([ndi.gaussian_filter(pm[..., i], sig) for i in range(3)])
    out = np.dstack([pm / np.maximum(a_s, 1e-4)[..., None], a_s])
    out[..., :3] = np.clip(out[..., :3], 0, 255)
    out[..., 3] = np.clip(out[..., 3], 0, 1) * 255
    im = Image.fromarray(out.astype(np.uint8), "RGBA")

    info = dict(ppu=ppu, size_u=size, season=season, orientation_deg=round(math.degrees(ang), 1),
                house_px=[round(cxp + house_u[0] * ppu, 1), round(cyp + house_u[1] * ppu, 1)],
                lane_end_px=[round(cxp + lane_to_[0] * ppu, 1), round(cyp + lane_to_[1] * ppu, 1)],
                fields=finfo, n_buildings=len(bs), n_trees=len(trees))
    if label:
        from label import render_label_curve
        hw = max(size * 0.5, len(label) * label_size * 0.62) * 0.75   # the curve must be longer than the word
        curve = label_curve or [(-hw, B * 0.5 + 12), (0, B * 0.5 + 22), (hw, B * 0.5 + 14)]
        li, (lax, lay) = render_label_curve(label, curve, size=label_size, ppu=ppu, tracking=0.22, seed=seed, shadow=0.62)
        info["label"] = (li, (lax, lay))
    return im, (cxp, cyp), info


def _shift(a, dx, dy):
    return ndi.shift(a, (dy, dx), order=1, mode="constant")


# ----------------------------------------------------------------- the Champion Hill farms (vicksburg_w, s = 1.9)
MAP_PPU = 1.0 / 1.9          # map px per u
FARMS = {
    # name: (label, block centre map px, seed, size u, n_fields, plantation, which road the lane runs to, extra)
    # Coker house: on the Raymond road SE of Champion Hill (Loring's line; Tilghman killed near it, 16 May 1863)
    "coker_house": ("Coker House", (1652.0, 768.0), 516, 62, 4, False, "raymond_edwards_road", {}),
    # Champion plantation (Sid and Matilda Champion): on the hill's NE shoulder by the Jackson road
    "champion_house": ("Champion House", (1666.0, 700.0), 1863, 82, 5, True, "jackson_road", {}),
    "generic_1": (None, None, 7, 58, 3, False, None, dict(orientation=24)),
    "generic_2": (None, None, 42, 48, 6, False, None, dict(orientation=-62)),
}


def _road_info(road_id, c):
    sys.path.insert(0, "/home/user/battle-maps/research/style_tests/roads_towns")
    from road_fix import fixed_roads
    roads = fixed_roads()
    rd = next(r for r in roads if r["id"] == road_id)
    P = rd["pts"]
    i = int(np.argmin([math.hypot(x - c[0], y - c[1]) for x, y in P]))
    a, b = P[max(0, i - 3)], P[min(len(P) - 1, i + 3)]
    tang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    near = [r["pts"] for r in roads if min(math.hypot(x - c[0], y - c[1]) for x, y in r["pts"]) < 90]
    return P[i], tang, near


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    meta = {"_note": "placement on grant/assets/vicksburg_w.jpg map px (0..2880 x 0..1620), sprites made for camera s = 1.9; "
                     "left/top/w/h = the <img> box in map px (as the towns' RTM); layer with the towns (under the road SVG)",
            "S": 1.9, "ppu": 2.0, "farms": {}}
    for name, (lab, c, seed, size, nf, plant, road, extra) in FARMS.items():
        kw = dict(extra)
        if c is not None and road:
            p, tang, near = _road_info(road, c)
            kw["lane_to"] = map_to_local([p], c, MAP_PPU)[0]
            kw["roads"] = [map_to_local(pl, c, MAP_PPU) for pl in near]
            kw.setdefault("orientation", tang)   # field grid parallel to the road
        im, (cx, cy), info = render_farm(seed, size=size, n_fields=nf, plantation=plant, ppu=2.0, label=lab, **kw)
        bb = im.getbbox(); im = im.crop(bb); cx -= bb[0]; cy -= bb[1]
        im.save(os.path.join(here, f"{name}.png"))
        k = MAP_PPU / 2.0
        ent = dict(png=f"{name}.png", label=lab, size_px=list(im.size), centre_px=[round(cx, 1), round(cy, 1)],
                   house_px=[round(info["house_px"][0] - bb[0], 1), round(info["house_px"][1] - bb[1], 1)],
                   map_px_per_img_px=round(k, 6), size_u=size, n_fields=nf, season=info["season"],
                   orientation_deg=info["orientation_deg"], fields=info["fields"])
        if c is not None:
            ent.update(c=list(c), left=round(c[0] - cx * k, 2), top=round(c[1] - cy * k, 2),
                       w=round(im.width * k, 2), h=round(im.height * k, 2))
        if "label" in info:
            li, (lax, lay) = info["label"]
            lb = li.getbbox(); li = li.crop(lb)
            li.save(os.path.join(here, f"label_{name}.png"))
            ent["label_png"] = dict(png=f"label_{name}.png", w=li.width / 2, h=li.height / 2,
                                    ax=(lax - lb[0]) / 2, ay=(lay - lb[1]) / 2,
                                    note="ax/ay = the farm block centre inside the label image, in 1080p px (u)")
        meta["farms"][name] = ent
        print(name, im.size, {k_: ent.get(k_) for k_ in ("left", "top", "w", "h")})
    json.dump(meta, open(os.path.join(here, "farms.json"), "w"), indent=1)
    import subprocess
    subprocess.run([sys.executable, os.path.join(here, "make_preview.py")], check=False)


if __name__ == "__main__":
    main()
