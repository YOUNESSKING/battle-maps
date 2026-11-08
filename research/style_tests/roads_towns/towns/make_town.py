#!/usr/bin/env python3
"""Procedural Warhawk-style miniature town for Style W maps (no AI imagery).

A town = an organic cluster of tiny top-down buildings (dark flat roofs, a few
terracotta and pale roofs, NW-lit bevels, SE drop shadows, dark alleys) on a
dusty ground patch with a feathered, slightly dark rim. Roads entering the
town become pale lanes inside it; a river polyline is cut out of the patch so
the map's own river shows through (buildings keep clear of it).

UNITS: all geometry is in "u" = one pixel of the 1080p output frame.
`ppu` = output-image pixels per u (default 2.0 = the 2x PNG the brief asks for).

API
    render_town(seed, size="town", river=None, river_width=6.0, one_bank=False,
                roads=(), grid=None, ppu=2.0, radius=None)
        -> (PIL.Image RGBA, (cx, cy))
    seed        int, deterministic
    size        "village" | "town" | "city" (or pass radius=u to override)
    river       list of (x, y) in u, relative to the town centre (y down)
    river_width river width in u (the cut-out = this width + a small bank)
    one_bank    True = keep the town only on the river bank holding the centre
    roads       entry angles in degrees (0 = east, 90 = south, image coords);
                each becomes a lane from the edge to the centre
    grid        None/False organic lanes; or an angle in degrees for a loose
                street grid (cities such as Vicksburg)
    (cx, cy)    pixel position of the town centre inside the returned image

Placing on a map: render with ppu = (map px per 1080p output px) * camera, or
render at ppu=2 and scale the PNG by (map_ppu / 2). The top-left corner on the
map is (map_x - cx*k, map_y - cy*k) with k = map_ppu / ppu. Use
`map_to_local(points, centre, map_ppu)` to turn a map-pixel river polyline
into the town-local u coordinates `river=` expects.

CLI:  python3 make_town.py demo     (writes the five Vicksburg-campaign towns)
"""
import math
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SIZES = {
    #          radius u, building count target, extra lanes, building scale
    "village": dict(R=46, n=60, lanes=1, bs=1.25),
    "town": dict(R=72, n=150, lanes=3, bs=1.3),
    "city": dict(R=104, n=420, lanes=5, bs=1.3),
}

# palette sampled from the reference (owner_ref_yarmouk / ref_town_zoom),
# lifted ~15 % because the reference frame is a soft, darkened video grab
GROUND = np.array([90, 80, 59], float)
GROUND_LIGHT = np.array([114, 103, 76], float)
GROUND_DARK = np.array([58, 49, 37], float)
RIM = np.array([62, 58, 36], float)
ROOFS = [  # (weight, base rgb, jitter)
    (0.56, (56, 47, 38), 10),     # dark brown / charcoal flat roofs
    (0.15, (42, 40, 40), 6),      # charcoal
    (0.14, (86, 71, 54), 10),     # mid brown
    (0.04, (116, 52, 40), 10),    # terracotta red (more inside the accent spots)
    (0.07, (176, 168, 148), 10),  # off-white
    (0.03, (72, 74, 76), 5),      # slate grey
]
LIGHT = np.array([-1.0, -1.0]) / math.sqrt(2)  # light from the NW (image y down)


# ----------------------------------------------------------------- helpers
def map_to_local(points, centre, map_ppu):
    """Map-pixel polyline -> town-local u coordinates."""
    cx, cy = centre
    return [((x - cx) / map_ppu, (y - cy) / map_ppu) for x, y in points]


def _fbm(shape, rng, scales=(64, 24, 8), amps=(1.0, 0.5, 0.25)):
    h, w = shape
    out = np.zeros(shape)
    for s, a in zip(scales, amps):
        gh, gw = max(2, int(h / s) + 2), max(2, int(w / s) + 2)
        g = rng.standard_normal((gh, gw))
        z = ndi.zoom(g, (h / (gh - 1) + 0.01, w / (gw - 1) + 0.01), order=3)[:h, :w]
        out += a * z
    return out / sum(amps)


def _seg_dist(px, py, segs):
    """Distance field from (px, py) arrays to a list of segments."""
    d = np.full(np.shape(px), 1e9)
    for (x0, y0), (x1, y1) in segs:
        vx, vy = x1 - x0, y1 - y0
        L2 = vx * vx + vy * vy + 1e-9
        t = np.clip(((px - x0) * vx + (py - y0) * vy) / L2, 0, 1)
        d = np.minimum(d, np.hypot(px - (x0 + t * vx), py - (y0 + t * vy)))
    return d


def _segs(poly):
    return [(poly[i], poly[i + 1]) for i in range(len(poly) - 1)]


def _nearest_dir(x, y, segs):
    best, bd = None, 1e9
    for (x0, y0), (x1, y1) in segs:
        vx, vy = x1 - x0, y1 - y0
        L2 = vx * vx + vy * vy + 1e-9
        t = min(1, max(0, ((x - x0) * vx + (y - y0) * vy) / L2))
        d = math.hypot(x - (x0 + t * vx), y - (y0 + t * vy))
        if d < bd:
            bd, best = d, math.atan2(vy, vx)
    return best, bd


def _wobbly(p0, p1, rng, amp, n=6):
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0) + 1e-9
    nx, ny = -(y1 - y0) / L, (x1 - x0) / L
    ph = rng.uniform(0, 6.28)
    pts = []
    for i in range(n + 1):
        t = i / n
        o = amp * math.sin(ph + t * 3.1) * math.sin(math.pi * t) + rng.normal(0, amp * 0.15) * (0 < i < n)
        pts.append((x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o))
    return pts


def _side(x, y, segs):
    """Sign of the side of a polyline (cross product with the nearest segment)."""
    bd, s = 1e9, 1
    for (x0, y0), (x1, y1) in segs:
        vx, vy = x1 - x0, y1 - y0
        L2 = vx * vx + vy * vy + 1e-9
        t = min(1, max(0, ((x - x0) * vx + (y - y0) * vy) / L2))
        d = math.hypot(x - (x0 + t * vx), y - (y0 + t * vy))
        if d < bd:
            bd, s = d, 1 if vx * (y - y0) - vy * (x - x0) > 0 else -1
    return s


# ----------------------------------------------------------------- layout
def _layout(rng, R, n_target, n_lanes, bs, river, river_w, one_bank, roads, grid):
    lanes = []  # polylines in u
    hub = (rng.uniform(-0.12, 0.12) * R, rng.uniform(-0.12, 0.12) * R)
    for a in roads:
        r = math.radians(a)
        edge = (math.cos(r) * R * 1.35, math.sin(r) * R * 1.35)
        end = hub if (grid is None or grid is False) else (math.cos(r) * R * 0.5, math.sin(r) * R * 0.5)
        lanes.append(_wobbly(edge, end, rng, R * 0.06))
    if grid is not None and grid is not False:
        g = math.radians(float(grid))
        ux, uy = math.cos(g), math.sin(g)
        vx, vy = -uy, ux
        step = R * rng.uniform(0.26, 0.3)
        k = int(1.1 * R / step)
        for i in range(-k, k + 1):
            o = i * step + rng.normal(0, step * 0.06)
            half = R * math.sqrt(max(0.0, 1.05 - (o / (1.1 * R)) ** 2)) * rng.uniform(0.75, 1.05)
            for (ax, ay), (bx, by) in (((ux, uy), (vx, vy)), ((vx, vy), (ux, uy))):
                c = (hub[0] + bx * o, hub[1] + by * o)
                lanes.append(_wobbly((c[0] - ax * half, c[1] - ay * half),
                                     (c[0] + ax * half, c[1] + ay * half), rng, R * 0.012, 4))
    base_angles = list(roads) or [rng.uniform(0, 360)]
    for i in range(n_lanes):
        a = math.radians(rng.choice(base_angles) + rng.uniform(55, 150) * rng.choice([-1, 1]))
        L = R * rng.uniform(0.45, 0.85)
        st = hub if rng.random() < 0.6 else (hub[0] + rng.normal(0, R * 0.2), hub[1] + rng.normal(0, R * 0.2))
        lanes.append(_wobbly(st, (st[0] + math.cos(a) * L, st[1] + math.sin(a) * L), rng, R * 0.05, 5))
    lane_segs = [s for p in lanes for s in _segs(p)]
    riv_segs = _segs(river) if river else []
    centre_side = _side(0, 0, riv_segs) if riv_segs else 1

    # organic outline: noisy radius, swollen along roads (arms)
    harm = [(k, rng.normal(0, 0.11 / k ** 0.5), rng.uniform(0, 6.28)) for k in range(2, 7)]
    road_r = [math.radians(a) for a in roads]

    def outline(theta):
        r = 1.0 + sum(a * math.cos(k * theta + p) for k, a, p in harm)
        for ar in road_r:
            dth = math.atan2(math.sin(theta - ar), math.cos(theta - ar))
            r += 0.28 * math.exp(-(dth / 0.38) ** 2)
        return R * 0.82 * r

    def inside_p(x, y):
        rr = math.hypot(x, y)
        e = rr / outline(math.atan2(y, x))
        if e > 1.15:
            return 0.0
        p = 1.0 if e < 0.55 else max(0.0, 1 - (e - 0.55) / 0.6) ** 1.4
        _, dl = _nearest_dir(x, y, lane_segs) if lane_segs else (0, 99)
        p *= 0.45 + 0.55 * math.exp(-dl / (R * 0.18))
        if riv_segs:
            if one_bank and _side(x, y, riv_segs) != centre_side:
                return 0.0
        return p

    # occupancy raster at 0.25 u
    Q = 4
    S = int(R * 1.6 * Q)
    occ = np.zeros((S * 2, S * 2), bool)
    off = S

    def rect_cells(cx, cy, ang, a, b, pad):
        ca, sa = math.cos(ang), math.sin(ang)
        rad = math.hypot(a, b) + pad
        x0, x1 = int((cx - rad) * Q + off), int((cx + rad) * Q + off) + 1
        y0, y1 = int((cy - rad) * Q + off), int((cy + rad) * Q + off) + 1
        if x0 < 0 or y0 < 0 or x1 >= 2 * S or y1 >= 2 * S:
            return None
        yy, xx = np.mgrid[y0:y1, x0:x1]
        X, Y = (xx - off) / Q - cx, (yy - off) / Q - cy
        s, t = X * ca + Y * sa, -X * sa + Y * ca
        m = (np.abs(s) <= a + pad) & (np.abs(t) <= b + pad)
        return (slice(y0, y1), slice(x0, x1)), m

    # keep lanes and river clear
    yy, xx = np.mgrid[0:2 * S, 0:2 * S]
    X, Y = (xx - off) / Q, (yy - off) / Q
    if lane_segs:
        occ |= _seg_dist(X, Y, lane_segs) < 1.5 * bs
    if riv_segs:
        occ |= _seg_dist(X, Y, riv_segs) < river_w / 2 + 3.0

    blds, yards = [], []

    def try_place(cx, cy, ang, a, b, gap=0.55):
        rc = rect_cells(cx, cy, ang, a, b, max(0.05, gap - 0.3))
        if rc is None:
            return False
        sl, m = rc
        if (occ[sl] & m).any():
            return False
        rc2 = rect_cells(cx, cy, ang, a, b, 0.0)
        occ[rc2[0]] |= rc2[1]
        blds.append((cx, cy, ang, a, b))
        return True

    def orient(x, y):
        ang, d = _nearest_dir(x, y, lane_segs) if lane_segs else (rng.uniform(0, 3.14), 99)
        if riv_segs:
            ra, rd = _nearest_dir(x, y, riv_segs)
            if rd < d * 0.8:
                ang, d = ra, rd
        if d > R * 0.35:
            ang += rng.normal(0, 0.35)
        else:
            ang += rng.normal(0, 0.06)
        if rng.random() < 0.18:
            ang += math.pi / 2
        return ang

    # compounds (courtyard houses) first, then free buildings
    n_comp = max(1, n_target // 22)
    for _ in range(n_comp * 6):
        if len(yards) >= n_comp:
            break
        x, y = rng.normal(0, R * 0.42, 2)
        if rng.random() > inside_p(x, y):
            continue
        ang = orient(x, y)
        L = rng.uniform(9, 15) * bs
        th = rng.uniform(2.6, 3.6) * bs
        ca, sa = math.cos(ang), math.sin(ang)
        sides = rng.choice([2, 3, 3, 4])
        placed = 0
        for k in range(sides):
            phi = ang + k * math.pi / 2
            nx, ny = math.cos(phi + math.pi / 2), math.sin(phi + math.pi / 2)
            if try_place(x + nx * (L / 2 - th / 2), y + ny * (L / 2 - th / 2), phi,
                         L / 2 * rng.uniform(0.7, 1.0), th / 2, gap=0.2):
                placed += 1
        if placed:
            yards.append((x, y, ang, L / 2 - th, L / 2 - th))

    tries = 0
    while len(blds) < n_target and tries < n_target * 250:
        tries += 1
        grow = blds and rng.random() < 0.7
        if grow:
            # grow a terrace / cluster off an existing building
            px_, py_, pang, pa, pb = blds[len(blds) - 1 - min(len(blds) - 1, int(rng.exponential(len(blds) * 0.3)))]
            ang = pang + rng.normal(0, 0.05)
            a = rng.uniform(2.6, 5.2) * bs
            b = a * rng.uniform(0.5, 0.9)
            gap = rng.choice([0.3, 0.45, 0.7, 1.1])
            cu, su = math.cos(pang), math.sin(pang)
            if rng.random() < 0.55:
                d = (pa + gap + a) * rng.choice([-1, 1])
                sh = rng.normal(0, pb * 0.4)
                x, y = px_ + cu * d - su * sh, py_ + su * d + cu * sh
            else:
                d = (pb + gap + b) * rng.choice([-1, 1])
                sh = rng.normal(0, pa * 0.5)
                x, y = px_ - su * d + cu * sh, py_ + cu * d + su * sh
            if rng.random() > inside_p(x, y) ** 0.7:
                continue
        else:
            big = rng.random() < 0.08
            a = rng.uniform(2.8, 5.4) * bs * (1.45 if big else 1)
            b = a * rng.uniform(0.5, 0.85)
            gap = rng.choice([0.45, 0.8])
            on_lane = lane_segs and rng.random() < 0.7
            if on_lane:
                (x0, y0), (x1, y1) = lane_segs[rng.integers(len(lane_segs))]
                t = rng.random()
                L = math.hypot(x1 - x0, y1 - y0) + 1e-9
                nx, ny = -(y1 - y0) / L, (x1 - x0) / L
                o = (1.5 * bs + b + gap + 0.2 + rng.exponential(R * 0.04)) * rng.choice([-1, 1])
                x, y = x0 + (x1 - x0) * t + nx * o, y0 + (y1 - y0) * t + ny * o
                ang = math.atan2(y1 - y0, x1 - x0) + rng.normal(0, 0.04)
            else:
                x, y = rng.normal(0, R * 0.5, 2)
                ang = orient(x, y)
            if rng.random() > inside_p(x, y):
                continue
        try_place(x, y, ang, a, b, gap=gap)
    return lanes, blds, yards, outline, riv_segs, centre_side


# ----------------------------------------------------------------- render
def render_town(seed, size="town", river=None, river_width=6.0, one_bank=False,
                roads=(), grid=None, ppu=2.0, radius=None):
    rng = np.random.default_rng(seed)
    cfg = dict(SIZES[size])
    if radius:
        cfg["n"] = int(cfg["n"] * (radius / cfg["R"]) ** 2)
        cfg["R"] = radius
    R = cfg["R"]
    lanes, blds, yards, outline, riv_segs, cside = _layout(
        rng, R, cfg["n"], cfg["lanes"], cfg["bs"], river, river_width, one_bank, list(roads), grid)

    half = R * 1.45
    W = H = int(2 * half * ppu)
    cx = cy = W / 2
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    X, Y = (xx + 0.5 - cx) / ppu, (yy + 0.5 - cy) / ppu
    nz = _fbm((H, W), rng, scales=(18 * ppu, 7 * ppu, 2.5 * ppu), amps=(1, 0.6, 0.35))
    nz2 = _fbm((H, W), rng, scales=(30 * ppu, 10 * ppu), amps=(1, 0.5))

    # building footprint mask (coarse, for the patch + occlusion)
    foot = np.zeros((H, W))
    for (bx, by, ang, a, b) in blds:
        _draw_rect_cov(foot, bx, by, ang, a, b, ppu, cx, cy, value_only=True)
    th = np.arctan2(Y, X)
    rad = np.hypot(X, Y)
    out_r = np.vectorize(outline)(th)
    core = np.clip(1.0 - rad / (out_r * 1.0), 0, 1)
    patch = np.maximum(core * 0.8, np.maximum(ndi.gaussian_filter(foot, 3.0 * ppu) * 2.4, ndi.gaussian_filter(foot, 7.0 * ppu) * 3.2))
    patch = ndi.gaussian_filter(patch, 1.6 * ppu) + 0.14 * nz
    solid = ndi.binary_fill_holes(patch > 0.42)
    patch = np.maximum(patch, ndi.gaussian_filter(solid.astype(float), 1.5 * ppu) * 0.75)
    alpha = np.clip((patch - 0.16) / 0.55, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    if riv_segs:
        rd = _seg_dist(X, Y, riv_segs)
        cut = np.clip((rd - river_width / 2 + 0.3) / 1.2, 0, 1)
        if one_bank:
            # signed: drop the far bank entirely
            s = np.ones_like(X)
            segs = riv_segs
            best = np.full(X.shape, 1e9)
            for (x0, y0), (x1, y1) in segs:
                vx, vy = x1 - x0, y1 - y0
                L2 = vx * vx + vy * vy + 1e-9
                t = np.clip(((X - x0) * vx + (Y - y0) * vy) / L2, 0, 1)
                d = np.hypot(X - (x0 + t * vx), Y - (y0 + t * vy))
                m = d < best
                best = np.where(m, d, best)
                s = np.where(m, np.sign(vx * (Y - y0) - vy * (X - x0)), s)
            cut = np.where(s == cside, cut, 0)
        alpha *= cut
    alpha *= np.clip(1.0 + 0.0 * nz, 0, 1)

    # ground colour
    g = GROUND[None, None, :] * (1 + 0.07 * nz[..., None]) + 9 * nz2[..., None]
    lightness = np.clip(0.5 + 0.9 * nz2, 0, 1)[..., None]
    g = g * (1 - 0.35 * lightness) + GROUND_LIGHT * 0.35 * lightness
    # pale dusty lanes
    if lanes:
        ld = _seg_dist(X, Y, [s for p in lanes for s in _segs(p)])
        lane = np.clip(1 - (ld - 0.6) / 1.2, 0, 1)[..., None] * (0.32 + 0.15 * nz[..., None])
        g = g * (1 - lane) + (GROUND_LIGHT + 8) * lane
    # yards: light trodden earth
    for (yx, yy_, ang, a, b) in yards:
        m = np.zeros((H, W))
        _draw_rect_cov(m, yx, yy_, ang, a, b, ppu, cx, cy, value_only=True)
        m = ndi.gaussian_filter(m, 0.6 * ppu)[..., None] * 0.7
        g = g * (1 - m) + np.array([150, 136, 104]) * m
    # dark alleys / ambient occlusion around buildings
    occl = np.clip(ndi.gaussian_filter(foot, 1.3 * ppu) * 1.6, 0, 1)[..., None]
    g = g * (1 - 0.82 * occl) + GROUND_DARK * 0.82 * occl
    # dark rim on the feathered edge
    rim = np.clip(1 - np.abs(alpha - 0.45) / 0.45, 0, 1)[..., None]
    g = g * (1 - 0.3 * rim) + RIM * 0.3 * rim

    # drop shadows (SE)
    sh = np.zeros((H, W))
    for (bx, by, ang, a, b) in blds:
        _draw_rect_cov(sh, bx + 1.0, by + 1.4, ang, a, b, ppu, cx, cy, value_only=True)
    sh = np.clip(ndi.gaussian_filter(sh, 0.7 * ppu), 0, 1)
    g = g * (1 - 0.6 * sh[..., None])
    sh_alpha = sh * 0.6

    img = np.dstack([g, np.maximum(alpha, sh_alpha * 0)])
    # buildings
    weights = np.array([w for w, _, _ in ROOFS])
    weights /= weights.sum()
    # a few accent spots where the red / pale roofs gather (as in the reference)
    spots = [blds[i][:2] for i in rng.choice(len(blds), size=min(len(blds), 1 + len(blds) // 60), replace=False)]
    for (bx, by, ang, a, b) in blds:
        near = min(math.hypot(bx - sx, by - sy) for sx, sy in spots) < 11
        k = rng.choice(len(ROOFS), p=weights)
        if near and rng.random() < 0.5:
            k = 3 if rng.random() < 0.6 else (4 if rng.random() < 0.5 else 2)
        base = np.array(ROOFS[k][1], float) * rng.normal(1, ROOFS[k][2] / 120) + rng.normal(0, 2.5, 3)
        style = "gable" if (rng.random() < 0.35 and a > 3.2) else "flat"
        _draw_building(img, bx, by, ang, a, b, ppu, cx, cy, base, style, rng)

    # soften a touch: the reference reads as a painted miniature, not vector art
    pm = img[..., :3] * img[..., 3:4]
    sig = 0.28 * ppu
    a_s = ndi.gaussian_filter(img[..., 3], sig)
    pm = np.dstack([ndi.gaussian_filter(pm[..., i], sig) for i in range(3)])
    img = np.dstack([pm / np.maximum(a_s, 1e-4)[..., None], a_s])
    img[..., :3] = np.clip(img[..., :3], 0, 255)
    img[..., 3] = np.clip(img[..., 3], 0, 1) * 255
    return Image.fromarray(img.astype(np.uint8), "RGBA"), (cx, cy)


def _draw_rect_cov(arr, bx, by, ang, a, b, ppu, cx, cy, value_only=False):
    ca, sa = math.cos(ang), math.sin(ang)
    r = (math.hypot(a, b) + 1.5) * ppu
    px, py = cx + bx * ppu, cy + by * ppu
    x0, x1 = max(0, int(px - r)), min(arr.shape[1], int(px + r) + 2)
    y0, y1 = max(0, int(py - r)), min(arr.shape[0], int(py + r) + 2)
    if x0 >= x1 or y0 >= y1:
        return None
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(float)
    dx, dy = (xx + 0.5 - px) / ppu, (yy + 0.5 - py) / ppu
    s, t = dx * ca + dy * sa, -dx * sa + dy * ca
    sd = np.maximum(np.abs(s) - a, np.abs(t) - b) * ppu
    cov = np.clip(0.5 - sd, 0, 1)
    if value_only:
        arr[y0:y1, x0:x1] = np.maximum(arr[y0:y1, x0:x1], cov)
        return None
    return (slice(y0, y1), slice(x0, x1)), cov, s, t


def _draw_building(img, bx, by, ang, a, b, ppu, cx, cy, base, style, rng):
    res = _draw_rect_cov(img[..., 0], bx, by, ang, a, b, ppu, cx, cy)
    if res is None:
        return
    sl, cov, s, t = res
    ca, sa = math.cos(ang), math.sin(ang)
    u = np.array([ca, sa])      # long axis (s)
    v = np.array([-sa, ca])     # short axis (t)
    shade = np.ones_like(s)
    if style == "gable":
        # ridge along the long axis: each half lit by its facing
        n = np.where(t < 0, -1.0, 1.0)
        lit = n * float(v @ LIGHT)
        shade *= 1 + 0.26 * lit
        ridge = np.clip(1 - np.abs(t) * ppu / 0.9, 0, 1)
        shade *= 1 + 0.10 * ridge
        # hip ends
        hip = np.abs(s) > a - b * 0.8
        nh = np.where(s < 0, -1.0, 1.0) * float(u @ LIGHT)
        shade = np.where(hip & (np.abs(s) - (a - b) > np.abs(t)), 1 + 0.22 * nh, shade)
    else:
        bev = 0.75
        es = np.clip(1 - (a - np.abs(s)) / bev, 0, 1)
        et = np.clip(1 - (b - np.abs(t)) / bev, 0, 1)
        ls = np.where(s < 0, -1.0, 1.0) * float(u @ LIGHT)
        lt = np.where(t < 0, -1.0, 1.0) * float(v @ LIGHT)
        shade *= 1 + 0.32 * np.where(es > et, es * ls, et * lt)
        # parapet line just inside the edge
        shade *= 1 - 0.10 * np.clip(1 - np.abs(np.maximum(np.abs(s) - a, np.abs(t) - b) + 0.9) * ppu / 0.6, 0, 1)
    grain = 1 + 0.05 * rng.standard_normal(s.shape)
    col = base[None, None, :] * (shade * grain)[..., None]
    # thin dark outline
    sd = np.maximum(np.abs(s) - a, np.abs(t) - b) * ppu
    edge = np.clip(1 - np.abs(sd + 0.5) / 0.9, 0, 1)[..., None]
    col = col * (1 - 0.45 * edge) + np.array([25, 21, 18]) * 0.45 * edge
    c = cov[..., None]
    reg = img[sl]
    reg[..., :3] = reg[..., :3] * (1 - c) + col * c
    reg[..., 3] = np.maximum(reg[..., 3], cov)


# ----------------------------------------------------------------- demo
CAMPAIGN = {
    # name: (seed, size, kwargs)
    "vicksburg": (1863, "city", dict(
        river=[(-150, -170), (-118, -80), (-106, 0), (-112, 80), (-140, 170)],
        river_width=10, one_bank=True, roads=[0, 60, -50, 150], grid=-82)),
    "jackson": (1822, "town", dict(
        river=[(78, -110), (66, -30), (72, 40), (60, 110)], river_width=5,
        one_bank=True, roads=[180, 90, -90, 20, 145])),
    "raymond": (1829, "village", dict(roads=[0, 180, 100, -70])),
    "port_gibson": (1803, "village", dict(
        river=[(-80, 30), (-30, 14), (10, 22), (80, 8)], river_width=3.5,
        roads=[-100, 80, 160, 20])),
    "edwards": (1840, "village", dict(roads=[5, 185, -95])),
}

if __name__ == "__main__":
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    names = sys.argv[1:] if len(sys.argv) > 1 and sys.argv[1] != "demo" else list(CAMPAIGN)
    import json
    meta = {}
    for name in names:
        seed, size, kw = CAMPAIGN[name]
        im, c = render_town(seed, size, ppu=2.0, **kw)
        bb = im.getbbox()
        im = im.crop(bb)
        c = (c[0] - bb[0], c[1] - bb[1])
        im.save(os.path.join(here, f"{name}.png"))
        meta[name] = dict(png=f"{name}.png", ppu=2.0, size_px=im.size, centre_px=[round(c[0], 1), round(c[1], 1)])
        print(name, im.size, "centre px", meta[name]["centre_px"])
    mp = os.path.join(here, "towns.json")
    old = json.load(open(mp)) if os.path.exists(mp) else {}
    old.update(meta)
    json.dump(old, open(mp, "w"), indent=1)
