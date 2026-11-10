#!/usr/bin/env python3
"""Procedural painted 1863 camps / wagon parks / supply depots for Style W maps (no AI imagery).

Same technique as the painted towns (research/style_tests/roads_towns/towns/make_town.py): tiny top-down
objects lit from the NW, soft SE drop shadows, ambient occlusion, a warm mottled dust patch feathered into
the grass, then a light painterly blur. Colours are sampled from the owner's reference camp
(banners_units_camps/ref_camp.png) and lifted to sit on the Style W green of grant/assets/vicksburg_w.jpg.

UNITS: geometry is in "u" = one pixel of the 1080p output frame; `ppu` = image pixels per u
(default 2.0 = a 2x PNG, as for the towns).

API
    render_camp(seed, kind="camp", size=None, orientation=0.0, side="union", date="1863-05-18",
                night=False, flag=True, n_fires=None, wind=-20.0, ppu=2.0, soft=0.25, feather=12.0)
        -> (PIL.Image RGBA, (cx, cy), glow)        glow = RGBA fire-glow layer (same size) or None
    kind         "camp" | "wagon_park" | "supply_depot"
    size         length along the road in u (default camp 200, wagon_park 170, supply_depot 150);
                 the depth across the road is ~0.6 x size
    orientation  road angle in degrees (0 = east, 90 = south, image coords); rows run along it
    side         "union" | "confederate" (same look; only the flag differs)
    date         ISO date -> the national flag of that date (never the battle flag)
    night        True = fires bigger + brighter, warm light on nearby tents, camp dimmed to a blue-muted night
    flag         False = no flag pole
    n_fires      1-3 (default 3 camp, 2 wagon park, 1 depot)
    wind         flag / smoke direction in degrees (image coords)
    (cx, cy)     image-pixel position of the camp centre (the layout origin) in the returned PNG

CLI:  python3 make_camp.py          (writes camp_union.png, wagon_park.png, supply_depot.png, camp_night.png
                                      + camp_night_glow.png; then run make_preview.py)
"""
import math
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

LIGHT = np.array([-1.0, -1.0]) / math.sqrt(2)  # light from the NW (image y down)

# --- palette: ref_camp.png patch (81,72,54) / grass (99,98,49); our grass (106,110,60) -> lift ~8-15 %,
#     kept on the warm side of the towns' GROUND_SOFT (104,91,67) so camps and towns read as one family
DUST = np.array([96, 86, 64], float)
DUST_LIGHT = np.array([126, 114, 87], float)
DUST_WARM = np.array([98, 79, 52], float)
DUST_DARK = np.array([70, 60, 45], float)
MUD = np.array([66, 55, 40], float)
CANVAS = np.array([172, 165, 143], float)      # off-white tent / wagon canvas
CANVAS_DIRTY = np.array([154, 146, 124], float)
ROOF_DARK = np.array([60, 48, 38], float)       # huts: the towns' dark brown roofs
ROOF_CHAR = np.array([47, 41, 35], float)
WOOD = np.array([92, 81, 64], float)            # weathered shed (ref shed 76,68,53 .. 96,88,75)
CRATE = np.array([124, 96, 62], float)
BARREL = np.array([96, 68, 44], float)
TARP = np.array([150, 146, 128], float)
HAY = np.array([136, 122, 80], float)
WHEEL = np.array([34, 28, 22], float)
MULE = np.array([52, 40, 31], float)
HORSE = np.array([74, 52, 36], float)
IRON = np.array([30, 28, 27], float)
FIRE_GLOW = np.array([255, 138, 48], float)
OUTLINE = np.array([25, 21, 18], float)

DEFAULT_SIZE = {"camp": 230.0, "wagon_park": 195.0, "supply_depot": 180.0}
DEFAULT_FIRES = {"camp": 3, "wagon_park": 2, "supply_depot": 1}


# ----------------------------------------------------------------- helpers (as in make_town.py)
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
    d = np.full(np.shape(px), 1e9)
    for (x0, y0), (x1, y1) in segs:
        vx, vy = x1 - x0, y1 - y0
        L2 = vx * vx + vy * vy + 1e-9
        t = np.clip(((px - x0) * vx + (py - y0) * vy) / L2, 0, 1)
        d = np.minimum(d, np.hypot(px - (x0 + t * vx), py - (y0 + t * vy)))
    return d


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


# ----------------------------------------------------------------- SDF shapes (s along the object, t across; u)
def sd_box(a, b):
    return lambda s, t: np.maximum(np.abs(s) - a, np.abs(t) - b)


def sd_rbox(a, b, r):
    def f(s, t):
        qx, qy = np.abs(s) - (a - r), np.abs(t) - (b - r)
        return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
    return f


def sd_circle(r):
    return lambda s, t: np.hypot(s, t) - r


def sd_ellipse(a, b):
    return lambda s, t: (np.hypot(s / a, t / b) - 1.0) * min(a, b)


class Canvas:
    """float RGBA canvas in image px with the layout origin at (cx, cy) and u -> px via ppu."""

    def __init__(self, W, H, ppu, cx, cy):
        self.W, self.H, self.ppu, self.cx, self.cy = W, H, ppu, cx, cy
        self.rgb = np.zeros((H, W, 3))
        self.a = np.zeros((H, W))

    def region(self, x, y, ang, rad):
        p = self.ppu
        px, py = self.cx + x * p, self.cy + y * p
        r = (rad + 1.5) * p
        x0, x1 = max(0, int(px - r)), min(self.W, int(px + r) + 2)
        y0, y1 = max(0, int(py - r)), min(self.H, int(py + r) + 2)
        if x0 >= x1 or y0 >= y1:
            return None
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(float)
        dx, dy = (xx + 0.5 - px) / p, (yy + 0.5 - py) / p
        ca, sa = math.cos(ang), math.sin(ang)
        return (slice(y0, y1), slice(x0, x1)), dx * ca + dy * sa, -dx * sa + dy * ca

    def mask(self, arr, x, y, ang, rad, sdf, val=1.0):
        r = self.region(x, y, ang, rad)
        if r is None:
            return
        sl, s, t = r
        cov = np.clip(0.5 - sdf(s, t) * self.ppu, 0, 1) * val
        arr[sl] = np.maximum(arr[sl], cov)

    def paint(self, x, y, ang, rad, sdf, colfn, outline=0.4, opacity=1.0):
        r = self.region(x, y, ang, rad)
        if r is None:
            return
        sl, s, t = r
        d = sdf(s, t)
        cov = np.clip(0.5 - d * self.ppu, 0, 1) * opacity
        if not cov.any():
            return
        col = np.broadcast_to(colfn(s, t, d), s.shape + (3,)).astype(float)
        if outline:
            edge = np.clip(1 - np.abs(d * self.ppu + 0.5) / 0.9, 0, 1)[..., None]
            col = col * (1 - outline * edge) + OUTLINE * outline * edge
        c = cov[..., None]
        self.rgb[sl] = self.rgb[sl] * (1 - c) + col * c
        self.a[sl] = np.maximum(self.a[sl], cov)


def _lit(ang):
    """light factors for the long (u) and short (v) axis normals of an object rotated by ang"""
    u = np.array([math.cos(ang), math.sin(ang)])
    v = np.array([-math.sin(ang), math.cos(ang)])
    return float(u @ LIGHT), float(v @ LIGHT)


def _grain(rng, shape, k=0.05):
    return 1 + k * rng.standard_normal(shape)


# ----------------------------------------------------------------- object painters
# every object: dict(k=kind, x, y, ang, h=height for the shadow, plus its own sizes); x, y, ang already in image space
def shape_of(o):
    k = o["k"]
    if k in ("tent", "wall", "hut", "shed", "crate", "cord", "musket_row"):
        return sd_box(o["a"], o["b"]), math.hypot(o["a"], o["b"])
    if k in ("sibley", "barrel", "fire", "kettle", "pole"):
        return sd_circle(o["r"]), o["r"]
    if k == "wagon":
        return sd_rbox(o["a"], o["b"], o["b"] * 0.9), o["a"] + 2.0
    if k in ("tarp", "hay"):
        return sd_rbox(o["a"], o["b"], min(o["a"], o["b"]) * 0.8), math.hypot(o["a"], o["b"])
    if k in ("mule", "horse"):
        return sd_ellipse(o["a"], o["b"]), o["a"]
    if k == "stack":
        return sd_circle(0.75 * o.get("sc", 1.0)), 0.9 * o.get("sc", 1.0)
    return sd_circle(0.5), 0.5


def draw_object(cv, o, rng):
    k, x, y, ang = o["k"], o["x"], o["y"], o["ang"]
    lu, lv = _lit(ang)
    tone = o.get("tone", 1.0)
    if k == "tent":  # A-frame / wedge tent: ridge along s, two canvas slopes lit by their facing
        a, b = o["a"], o["b"]
        base = o.get("col", CANVAS) * tone

        def col(s, t, d):
            n = np.where(t < 0, -1.0, 1.0)
            sh = 1 + 0.24 * n * lv - 0.10 * (np.abs(t) / b) ** 2
            sh = sh * (1 + 0.12 * np.clip(1 - np.abs(t) * cv.ppu / 0.8, 0, 1))      # ridge line
            door = (np.abs(s) > a - 0.45 * o.get("sc", 1.0)) & (np.abs(t) < b * 0.35) & (s * o.get("door", 1) > 0)
            sh = np.where(door, 0.55, sh)
            return base * (sh * _grain(rng, s.shape, 0.035))[..., None]
        cv.paint(x, y, ang, a + b, sd_box(a, b), col, outline=0.35)
    elif k == "wall":  # officers' wall tent with a fly sheet slightly larger and greyer
        a, b = o["a"], o["b"]
        fly = CANVAS_DIRTY * tone

        def colf(s, t, d):
            n = np.where(t < 0, -1.0, 1.0)
            return fly * (1 + 0.2 * n * lv)[..., None] * _grain(rng, s.shape, 0.03)[..., None]
        cv.paint(x, y, ang, a + b + 1, sd_box(a + 0.7, b + 0.35), colf, outline=0.3)
        base = CANVAS * tone * 1.03

        def col(s, t, d):
            n = np.where(t < 0, -1.0, 1.0)
            sh = 1 + 0.26 * n * lv - 0.08 * (np.abs(t) / b) ** 2
            sh = sh * (1 + 0.14 * np.clip(1 - np.abs(t) * cv.ppu / 0.8, 0, 1))
            return base * (sh * _grain(rng, s.shape, 0.03))[..., None]
        cv.paint(x, y, ang, a + b, sd_box(a, b * 0.92), col, outline=0.2)
    elif k == "sibley":  # conical Sibley tent: radial shading, dark smoke hole
        r = o["r"]
        base = CANVAS * tone

        def col(s, t, d):
            rr = np.hypot(s, t) + 1e-6
            # rotate back to image axes for the light
            ca, sa = math.cos(ang), math.sin(ang)
            nx, ny = (s * ca - t * sa) / rr, (s * sa + t * ca) / rr
            sh = 1 + 0.30 * (nx * LIGHT[0] + ny * LIGHT[1]) * np.clip(rr / r, 0, 1) ** 0.7
            sh = np.where(rr < 0.32 * o.get("sc", 1.0), 0.35, sh)
            return base * (sh * _grain(rng, s.shape, 0.03))[..., None]
        cv.paint(x, y, ang, r, sd_circle(r), col, outline=0.3)
    elif k in ("hut", "shed"):  # gable roof: dark huts (towns' roofs) / weathered plank shed
        a, b = o["a"], o["b"]
        base = (o.get("col", ROOF_DARK if k == "hut" else WOOD)) * tone
        plank = 0.55 if k == "shed" else 0.75

        def col(s, t, d):
            n = np.where(t < 0, -1.0, 1.0)
            sh = 1 + 0.28 * n * lv
            sh = sh * (1 + 0.10 * np.clip(1 - np.abs(t) * cv.ppu / 0.9, 0, 1))
            sh = sh * (1 - 0.10 * (np.abs(np.sin(s * math.pi / plank)) < 0.18))              # plank seams
            if k == "shed":
                sh = sh * (1 + 0.06 * np.sin(s * 1.7 + rng.uniform(0, 6)) * np.sin(t * 2.3))
            hip = np.abs(s) - (a - b * 0.6) > np.abs(t) * 0.6
            sh = np.where(hip, sh * (1 + 0.16 * np.where(s < 0, -1.0, 1.0) * lu), sh)
            return base * (sh * _grain(rng, s.shape, 0.06))[..., None]
        cv.paint(x, y, ang, a + b, sd_box(a, b), col, outline=0.45)
    elif k == "crate":
        a, b = o["a"], o["b"]
        base = o.get("col", CRATE) * tone

        def col(s, t, d):
            es = np.clip(1 - (a - np.abs(s)) / 0.3, 0, 1)
            et = np.clip(1 - (b - np.abs(t)) / 0.3, 0, 1)
            ls = np.where(s < 0, -1.0, 1.0) * lu
            lt = np.where(t < 0, -1.0, 1.0) * lv
            sh = 1 + 0.35 * np.where(es > et, es * ls, et * lt)
            return base * (sh * _grain(rng, s.shape, 0.05))[..., None]
        cv.paint(x, y, ang, a + b, sd_box(a, b), col, outline=0.5)
    elif k == "cord":  # cordwood stack: log ends as stripes
        a, b = o["a"], o["b"]

        def col(s, t, d):
            sh = 0.85 + 0.25 * (np.sin(s * 9.0) > 0) + 0.1 * np.where(t < 0, -1, 1) * lv
            return np.array([108, 80, 54.]) * tone * sh[..., None]
        cv.paint(x, y, ang, a + b, sd_box(a, b), col, outline=0.45)
    elif k == "barrel":
        r = o["r"]

        def col(s, t, d):
            rr = np.hypot(s, t)
            ca, sa = math.cos(ang), math.sin(ang)
            nx, ny = (s * ca - t * sa), (s * sa + t * ca)
            sh = 1 + 0.45 * (nx * LIGHT[0] + ny * LIGHT[1]) / r
            sh = sh * (1 - 0.35 * (np.abs(rr - r * 0.62) < 0.12))
            return BARREL * tone * sh[..., None]
        cv.paint(x, y, ang, r, sd_circle(r), col, outline=0.5)
    elif k in ("tarp", "hay"):
        a, b = o["a"], o["b"]
        base = (TARP if k == "tarp" else HAY) * tone

        def col(s, t, d):
            n = np.where(t < 0, -1.0, 1.0)
            sh = 1 + 0.25 * n * lv * np.clip(np.abs(t) / b, 0, 1) ** 0.6 - 0.12 * (np.abs(t) / b) ** 2
            if k == "tarp":
                sh = sh * (1 - 0.12 * (np.abs(np.sin(s * math.pi / 1.4)) < 0.12))            # ropes
            else:
                sh = sh * _grain(rng, s.shape, 0.12)
            return base * sh[..., None]
        cv.paint(x, y, ang, a + b, sd_rbox(a, b, min(a, b) * 0.8), col, outline=0.3)
    elif k == "wagon":  # covered wagon: wheels at the corners, hooped canvas hood, tongue (+ team)
        a, b = o["a"], o["b"]
        tongue = o.get("tongue", 1)       # +1 tongue towards +s
        ta = ang + (o.get("tongue_swing", 0.0))
        q = o.get("sc", 1.0)
        for ss in (-a * 0.68, a * 0.62):
            for tt in (-(b + 0.3 * q), b + 0.3 * q):
                wx = x + ss * math.cos(ang) - tt * math.sin(ang)
                wy = y + ss * math.sin(ang) + tt * math.cos(ang)
                cv.paint(wx, wy, ang, 0.9 * q, sd_box((0.62 if ss > 0 else 0.72) * q, 0.27 * q), lambda s, t, d: WHEEL, outline=0)
        tx = x + tongue * (a + 1.2 * q) * math.cos(ta)
        ty = y + tongue * (a + 1.2 * q) * math.sin(ta)
        cv.paint(tx, ty, ta, 1.6 * q, sd_box(1.3 * q, 0.13 * q), lambda s, t, d: np.array([70, 54, 38.]), outline=0)
        base = o.get("col", CANVAS) * tone
        bows = np.linspace(-a * 0.75, a * 0.75, 4)

        def col(s, t, d):
            sh = 1 + 0.32 * (t / b) * lv - 0.14 * (t / b) ** 2
            for bk in bows:
                sh = sh * (1 - 0.10 * np.exp(-((s - bk) / (0.2 * o.get("sc", 1.0))) ** 2))
            pucker = np.abs(s) > a - 0.45 * o.get("sc", 1.0)
            sh = np.where(pucker & (np.abs(t) < b * 0.45), sh * 0.62, sh)
            return base * (sh * _grain(rng, s.shape, 0.03))[..., None]
        cv.paint(x, y, ang, a + b, sd_rbox(a, b, b * 0.9), col, outline=0.35)
    elif k in ("mule", "horse"):
        base = (MULE if k == "mule" else HORSE) * tone

        def col(s, t, d):
            sh = 1 + 0.25 * (t / o["b"]) * lv + 0.15 * (s / o["a"]) * lu
            return base * sh[..., None]
        cv.paint(x, y, ang, o["a"], sd_ellipse(o["a"], o["b"]), col, outline=0.2)
    elif k == "stack":  # stacked muskets: three-legged tripod of barrels, tiny bright tips
        q = o.get("sc", 1.0)
        for i in range(3):
            aa = ang + i * 2.094
            mx, my = x + 0.38 * q * math.cos(aa), y + 0.38 * q * math.sin(aa)
            cv.paint(mx, my, aa, 0.6 * q, sd_box(0.42 * q, 0.09 * q), lambda s, t, d: np.array([58, 48, 38.]), outline=0)
        cv.paint(x, y, 0, 0.2 * q, sd_circle(0.16 * q), lambda s, t, d: np.array([150, 150, 140.]), outline=0)
    elif k == "kettle":
        cv.paint(x, y, 0, o["r"], sd_circle(o["r"]), lambda s, t, d: IRON * (1 + 0.4 * (s * -0.7 + t * -0.7) / o["r"])[..., None], outline=0.3)
    elif k == "pole":
        cv.paint(x, y, 0, 0.3, sd_circle(0.22), lambda s, t, d: np.array([40, 32, 26.]), outline=0)


# ----------------------------------------------------------------- flags (national flag of the date, never the battle flag)
def flag_design(side, date):
    if side == "union":
        return "stars_and_stripes"
    if date < "1863-05-01":
        return "stars_and_bars"          # First National
    if date < "1865-03-04":
        return "stainless_banner"        # Second National (white field)
    return "third_national"


def draw_flag(cv, x, y, wind, design, rng, night=False, k=1.0):
    """flag seen from above-and-south: a small waving rectangle streaming downwind from the pole top"""
    L, H = 5.6 * k, 3.4 * k
    ang = math.radians(wind)
    fx, fy = x + (L / 2 + 0.25) * math.cos(ang), y + (L / 2 + 0.25) * math.sin(ang) - 2.2 * k  # pole top is ~2.2k u "up"
    red, white, blue = np.array([170, 44, 40.]), np.array([226, 220, 204.]), np.array([40, 52, 104.])

    def col(s, t, d):
        u = (s + L / 2) / L          # 0 at the hoist
        v = (t + H / 2) / H          # 0 at the top
        if design == "stars_and_stripes":
            c = np.where((np.floor(v * 7) % 2 == 0)[..., None], red, white)
            cant = (u < 0.42) & (v < 0.55)
            c = np.where(cant[..., None], blue, c)
            star = cant & (np.sin(u * 60) > 0.6) & (np.sin(v * 40) > 0.6)
            c = np.where(star[..., None], white, c)
        elif design == "stars_and_bars":
            c = np.where(((v > 1 / 3) & (v < 2 / 3))[..., None], white, red)
            cant = (u < 0.36) & (v < 2 / 3)
            c = np.where(cant[..., None], blue, c)
            ring = cant & (np.abs(np.hypot((u - 0.18) / 0.36 * 1.7, (v - 1 / 3) / 0.667) - 0.33) < 0.07)
            c = np.where(ring[..., None], white, c)
        elif design == "stainless_banner":
            c = np.broadcast_to(white, s.shape + (3,)).copy()
            cant = (u < 0.34) & (v < 0.62)
            c = np.where(cant[..., None], red, c)
        else:  # third national: white field, red vertical bar at the fly
            c = np.broadcast_to(white, s.shape + (3,)).copy()
            c = np.where((u > 0.82)[..., None], red, c)
            cant = (u < 0.34) & (v < 0.62)
            c = np.where(cant[..., None], red, c)
        wave = 1 + 0.16 * np.sin(u * 9.5 + 1.0) * np.clip(u * 3, 0, 1)
        return c * 0.88 * wave[..., None]
    # pole: shadow line on the ground (SE), the staff itself (rising to the north on screen)
    cv.paint(x + 1.6 * k, y + 1.4 * k, math.radians(42), 2.4 * k, sd_box(2.1 * k, 0.16 * k), lambda s, t, d: DUST_DARK * 0.8, outline=0, opacity=0.55)
    cv.paint(fx + 0.9 * k, fy + 1.6 * k, ang, L / 2 + 0.3, sd_box(L / 2, H / 2), lambda s, t, d: DUST_DARK * 0.7, outline=0, opacity=0.35)
    cv.paint(x, y - 1.1 * k, math.pi / 2, 1.3 * k, sd_box(1.15 * k, 0.15 * k), lambda s, t, d: np.array([62, 50, 38.]), outline=0)
    cv.paint(fx, fy, ang, L / 2 + 0.3, sd_box(L / 2, H / 2), col, outline=0.35)
    cv.paint(x, y - 2.3 * k, 0, 0.35 * k, sd_circle(0.28 * k), lambda s, t, d: np.array([190, 165, 90.]), outline=0)


# ----------------------------------------------------------------- layouts (local frame: x along the road, y across, +y away from the road)
def _obj(k, x, y, ang=0.0, **kw):
    d = dict(k=k, x=x, y=y, ang=ang)
    d.update(kw)
    return d


def _ragged(rng, L, W):
    """noisy elliptical keep-probability so rows thin out at the camp edge"""
    harm = [(k, rng.normal(0, 0.10 / k ** 0.5), rng.uniform(0, 6.28)) for k in range(2, 6)]

    def keep(x, y):
        th = math.atan2(y / W, x / L)
        r = 1.0 + sum(a * math.cos(k * th + p) for k, a, p in harm)
        e = math.hypot(x / (L / 2), y / (W / 2)) / r
        return 1.0 if e < 0.78 else max(0.0, 1 - (e - 0.78) / 0.3)
    return keep


def layout_camp(rng, L, W, n_fires):
    objs, lanes, fires = [], [], []
    keep = _ragged(rng, L, W)
    hl = L / 2
    # colour line on the road side: musket stacks + the flag pole
    yc = -W * 0.40
    x = -hl * 0.62
    while x < hl * 0.62:
        if rng.random() < 0.85:
            objs.append(_obj("stack", x + rng.normal(0, 0.3), yc + rng.normal(0, 0.4), rng.uniform(0, 6.28), h=0.9))
        x += rng.uniform(4.0, 5.5)
    pole = (rng.uniform(-0.1, 0.1) * L, yc - 4.0)
    # company streets: pairs of tent rows facing each other across a street, rows along the road
    y = -W * 0.30
    rows = []
    while y < W * 0.14:
        rows.append(y)
        rows.append(y + 9.0)
        lanes.append([(-hl * 0.8, y + 4.5), (hl * 0.8, y + 4.5)])
        y += 9.0 + rng.uniform(7.5, 9.0)
    for ri, ry in enumerate(rows):
        door = 1 if ri % 2 == 0 else -1          # doors face the street between the pair
        x = -hl * 0.78 + rng.uniform(0, 3)
        while x < hl * 0.78:
            jx, jy = x + rng.normal(0, 0.5), ry + rng.normal(0, 0.55)
            if rng.random() < keep(jx, jy) * 0.88:
                if rng.random() < 0.07:
                    objs.append(_obj("sibley", jx, jy, 0, r=2.7, h=2.0, tone=rng.uniform(0.92, 1.03)))
                else:
                    a = rng.uniform(1.9, 2.3)
                    objs.append(_obj("tent", jx, jy, math.pi / 2 + rng.normal(0, 0.09), a=a, b=a * rng.uniform(0.78, 0.9),
                                     door=door, h=1.2, tone=rng.uniform(0.86, 1.04),
                                     col=CANVAS if rng.random() < 0.8 else CANVAS_DIRTY))
            x += rng.uniform(5.6, 6.6)
    # officers' line behind the companies
    yo = W * 0.27
    x = -hl * 0.55
    while x < hl * 0.55:
        if rng.random() < keep(x, yo) * 0.9:
            objs.append(_obj("wall", x + rng.normal(0, 0.6), yo + rng.normal(0, 0.6), math.pi / 2 + rng.normal(0, 0.06),
                             a=3.4, b=2.6, h=1.7, tone=rng.uniform(0.95, 1.05)))
        x += rng.uniform(10.5, 13)
    lanes.append([(-hl * 0.6, yo - 5.5), (hl * 0.6, yo - 5.5)])
    # rear: cook fires with kettles, log huts, crates, a few wagons and mules
    yr = W * 0.40
    fx_list = list(np.linspace(-hl * 0.45, hl * 0.45, max(1, n_fires)) + rng.normal(0, 4, max(1, n_fires)))
    for fx in fx_list[:n_fires]:
        fy = yr + rng.normal(0, 2)
        fires.append((fx, fy, rng.uniform(0.85, 1.15)))
        for _ in range(rng.integers(1, 3)):
            aa = rng.uniform(0, 6.28)
            objs.append(_obj("kettle", fx + 1.6 * math.cos(aa), fy + 1.6 * math.sin(aa), r=0.45, h=0.5))
        for _ in range(rng.integers(2, 5)):
            objs.append(_obj("crate", fx + rng.normal(0, 3.5), fy + rng.normal(0, 2.5), rng.uniform(0, 3), a=0.62, b=0.55, h=0.6,
                             tone=rng.uniform(0.85, 1.1)))
        if rng.random() < 0.6:
            objs.append(_obj("cord", fx + rng.choice([-1, 1]) * rng.uniform(4, 6), fy + rng.uniform(-2, 2),
                             rng.normal(0, 0.2), a=1.6, b=0.7, h=0.8))
    for i in range(rng.integers(2, 4)):
        hx = rng.uniform(-hl * 0.6, hl * 0.6)
        objs.append(_obj("hut", hx, yr + rng.uniform(5, 9), rng.normal(0, 0.06), a=rng.uniform(3.2, 4.6), b=rng.uniform(2.3, 2.8),
                         h=1.6, col=ROOF_DARK if rng.random() < 0.6 else ROOF_CHAR, tone=rng.uniform(0.9, 1.1)))
    # a long commissary shed at one end, like the reference
    sx = rng.choice([-1, 1]) * hl * rng.uniform(0.6, 0.7)
    objs.append(_obj("shed", sx, yr + 2, math.pi / 2 + rng.normal(0, 0.05), a=9.5, b=3.0, h=1.9))
    for _ in range(3):
        objs.append(_obj("crate", sx + rng.uniform(4, 6) * -np.sign(sx), yr + rng.uniform(-4, 6), rng.uniform(0, 3), a=0.65, b=0.6, h=0.6))
    for i in range(rng.integers(2, 4)):
        wx = -sx * rng.uniform(0.6, 0.95) + rng.normal(0, 3)
        objs.append(_obj("wagon", wx + i * 5.5 * np.sign(-sx) * 0.0 + i * 5.5, yr + 10 + rng.normal(0, 1), -math.pi / 2 + rng.normal(0, 0.1),
                         a=3.0, b=1.45, h=1.3, tongue=1, tone=rng.uniform(0.9, 1.02)))
    for _ in range(rng.integers(3, 7)):
        objs.append(_obj("horse", rng.uniform(-hl * 0.6, hl * 0.6), yr + rng.uniform(12, 16), rng.uniform(0, 6.28), a=0.75, b=0.32, h=0.5))
    # paths: from the colour line out to the road, and a sink/water path out the back
    lanes.append([(pole[0] + rng.normal(0, 4), yc), (pole[0] + rng.normal(0, 6), -W * 0.72)])
    lanes.append([(rng.uniform(-hl * 0.3, hl * 0.3), yr), (rng.uniform(-hl * 0.5, hl * 0.5), W * 0.62)])
    return objs, lanes, fires, pole


def layout_wagon_park(rng, L, W, n_fires):
    objs, lanes, fires = [], [], []
    keep = _ragged(rng, L, W)
    hl = L / 2
    y = -W * 0.30
    rows = []
    while y < W * 0.22:
        rows.append(y)
        y += rng.uniform(13.5, 15.0)
    for ri, ry in enumerate(rows):
        x = -hl * 0.78 + rng.uniform(0, 3)
        while x < hl * 0.78:
            jx, jy = x + rng.normal(0, 0.4), ry + rng.normal(0, 0.6)
            if rng.random() < keep(jx, jy) * 0.9:
                odd = rng.random() < 0.12
                ang = -math.pi / 2 + (rng.normal(0, 0.45) if odd else rng.normal(0, 0.05))
                hitched = rng.random() < 0.13
                objs.append(_obj("wagon", jx, jy, ang, a=3.0, b=1.45, h=1.3, tongue=1,
                                 tongue_swing=0.0 if hitched else rng.normal(0, 0.35),
                                 tone=rng.uniform(0.86, 1.03), col=CANVAS if rng.random() < 0.75 else CANVAS_DIRTY))
                if hitched:   # six-mule team ahead of the tongue
                    for p in range(3):
                        d = 3.0 + 2.4 + p * 1.6
                        for side in (-0.55, 0.55):
                            mx = jx + d * math.cos(ang) - side * math.sin(ang)
                            my = jy + d * math.sin(ang) + side * math.cos(ang)
                            objs.append(_obj("mule", mx, my, ang + rng.normal(0, 0.08), a=0.62, b=0.28, h=0.5))
            x += rng.uniform(5.2, 6.0)
        # wheel-rutted lane in front of each row
        lanes.append([(-hl * 0.85, ry - 7.5), (hl * 0.85, ry - 7.5)])
    # picket lines with mules on both sides, behind the rows
    yp = rows[-1] + 11
    for seg in range(2):
        x0 = -hl * 0.6 + seg * hl * 0.65
        x1 = x0 + hl * rng.uniform(0.45, 0.55)
        objs.append(_obj("crate", (x0 + x1) / 2, yp, 0.0, a=(x1 - x0) / 2, b=0.1, h=0.4, col=np.array([120, 100, 72.])))
        x = x0 + 0.6
        while x < x1:
            for side in (-1, 1):
                if rng.random() < 0.8:
                    objs.append(_obj("mule", x + rng.normal(0, 0.2), yp + side * rng.uniform(1.0, 1.3), side * math.pi / 2 + rng.normal(0, 0.35),
                                     a=0.72, b=0.32, h=0.5, tone=rng.uniform(0.85, 1.25)))
            x += rng.uniform(1.3, 2.0)
    # forage, a few horses wandering, fires at the edge, a forge cart crate pile
    for _ in range(2):
        objs.append(_obj("hay", rng.uniform(-hl * 0.6, hl * 0.6), yp + rng.uniform(5, 8), rng.normal(0, 0.3), a=rng.uniform(2.2, 3.2), b=1.6, h=1.1))
    for _ in range(rng.integers(5, 9)):
        objs.append(_obj("horse", rng.uniform(-hl * 0.8, hl * 0.8), rng.uniform(-W * 0.4, W * 0.4), rng.uniform(0, 6.28),
                         a=0.75, b=0.32, h=0.5, tone=rng.uniform(0.85, 1.2)))
    for i in range(n_fires):
        fx = (1 if i % 2 == 0 else -1) * hl * rng.uniform(0.9, 0.98)
        fy = rng.uniform(-W * 0.1, W * 0.25)
        fires.append((fx, fy, rng.uniform(0.85, 1.1)))
        objs.append(_obj("kettle", fx + 1.6, fy + 0.3, r=0.45, h=0.5))
        for _ in range(3):
            objs.append(_obj("crate", fx + rng.normal(0, 3), fy + rng.normal(0, 2.5), rng.uniform(0, 3), a=0.62, b=0.55, h=0.6))
    pole = (rng.uniform(-0.2, 0.2) * L, rows[0] - 9)
    lanes.append([(rng.uniform(-hl * 0.3, hl * 0.3), rows[0] - 7.5), (rng.uniform(-hl * 0.4, hl * 0.4), -W * 0.75)])
    return objs, lanes, fires, pole


def layout_supply_depot(rng, L, W, n_fires):
    objs, lanes, fires = [], [], []
    hl = L / 2
    # two long sheds along the road
    for i, sy in enumerate((-W * 0.12, W * 0.12)):
        if i == 1 and rng.random() < 0.25:
            continue
        sx = rng.normal(0, 4) - hl * 0.15
        objs.append(_obj("shed", sx, sy, rng.normal(0, 0.03), a=hl * rng.uniform(0.32, 0.42), b=3.2, h=2.0, tone=rng.uniform(0.92, 1.05)))
    # crate stacks: tidy piles of small crates
    for _ in range(rng.integers(7, 10)):
        px, py = rng.uniform(-hl * 0.8, hl * 0.8), rng.uniform(-W * 0.4, W * 0.4)
        if abs(py) < 7 or abs(abs(py) - W * 0.12) < 6:
            py += 9 * np.sign(py or 1)
        nx, ny = rng.integers(2, 5), rng.integers(2, 4)
        cs = rng.uniform(0.7, 0.85)
        ang = rng.normal(0, 0.05)
        tone = rng.uniform(0.85, 1.1)
        for i in range(nx):
            for j in range(ny):
                if rng.random() < 0.9:
                    objs.append(_obj("crate", px + (i - nx / 2) * cs * 2.15, py + (j - ny / 2) * cs * 2.15, ang,
                                     a=cs, b=cs, h=0.9, tone=tone * rng.uniform(0.92, 1.08)))
    # barrel clusters (hex packed)
    for _ in range(rng.integers(3, 5)):
        px, py = rng.uniform(-hl * 0.75, hl * 0.6), rng.choice([-1, 1]) * rng.uniform(W * 0.24, W * 0.4)
        n = rng.integers(3, 6)
        for i in range(n):
            for j in range(rng.integers(2, 4)):
                objs.append(_obj("barrel", px + i * 1.2 + (j % 2) * 0.6, py + j * 1.05, 0, r=0.55, h=0.7, tone=rng.uniform(0.85, 1.1)))
    # tarpaulin-covered piles, cordwood, hay
    for _ in range(rng.integers(2, 4)):
        objs.append(_obj("tarp", rng.uniform(-hl * 0.7, hl * 0.7), rng.choice([-1, 1]) * rng.uniform(W * 0.25, W * 0.4),
                         rng.normal(0, 0.1), a=rng.uniform(2.6, 3.8), b=rng.uniform(1.6, 2.2), h=1.1, tone=rng.uniform(0.9, 1.05)))
    for _ in range(2):
        objs.append(_obj("cord", rng.uniform(hl * 0.4, hl * 0.75) * rng.choice([-1, 1]), rng.uniform(-W * 0.3, W * 0.3),
                         rng.normal(0, 0.1), a=2.0, b=0.8, h=0.8))
    objs.append(_obj("hay", hl * rng.uniform(0.5, 0.7), W * rng.uniform(0.2, 0.35), 0.2, a=3.0, b=1.8, h=1.2))
    # wagons loading along the front lane
    for i in range(rng.integers(3, 6)):
        wx = -hl * 0.55 + i * rng.uniform(8, 11)
        objs.append(_obj("wagon", wx, -W * 0.3 + rng.normal(0, 1), rng.normal(0, 0.15) + (math.pi if rng.random() < 0.5 else 0),
                         a=3.0, b=1.45, h=1.3, tongue=1, tone=rng.uniform(0.88, 1.02)))
        if rng.random() < 0.4:
            w = objs[-1]
            ang, wy = w["ang"], w["y"]
            for p in range(2):
                d = 5.4 + p * 1.6
                for side in (-0.55, 0.55):
                    objs.append(_obj("mule", wx + d * math.cos(ang) - side * math.sin(ang),
                                     wy + d * math.sin(ang) + side * math.cos(ang), ang, a=0.62, b=0.28, h=0.5))
    for _ in range(n_fires):
        fires.append((rng.choice([-1, 1]) * hl * rng.uniform(0.55, 0.7), rng.uniform(W * 0.0, W * 0.25), 0.9))
    lanes.append([(-hl * 0.85, -W * 0.3 - 4), (hl * 0.85, -W * 0.3 - 4)])
    lanes.append([(-hl * 0.6, 0), (hl * 0.6, 0)])
    lanes.append([(rng.uniform(-hl * 0.3, hl * 0.3), -W * 0.3), (rng.uniform(-hl * 0.3, hl * 0.3), -W * 0.75)])
    pole = (hl * rng.uniform(-0.4, 0.4), -W * 0.42)
    return objs, lanes, fires, pole


LAYOUTS = {"camp": layout_camp, "wagon_park": layout_wagon_park, "supply_depot": layout_supply_depot}


# ----------------------------------------------------------------- render
def render_camp(seed, kind="camp", size=None, orientation=0.0, side="union", date="1863-05-18",
                night=False, flag=True, n_fires=None, wind=-20.0, ppu=2.0, soft=0.25, feather=12.0, obj_scale=1.8):
    rng = np.random.default_rng(seed)
    L = float(size or DEFAULT_SIZE[kind])
    W = L * (0.62 if kind != "supply_depot" else 0.6)
    nf = int(np.clip(DEFAULT_FIRES[kind] if n_fires is None else n_fires, 0, 3))
    # the layout is built at 1/obj_scale and blown up, so objects read at map scale like the reference
    # (a few dozen chunky tents per camp, not hundreds of specks)
    ks = float(obj_scale)
    objs, lanes, fires, pole = LAYOUTS[kind](rng, L / ks, W / ks, nf)
    for o in objs:
        o["x"] *= ks; o["y"] *= ks
        o["sc"] = ks
        for key in ("a", "b", "r", "h"):
            if key in o:
                o[key] *= ks
    lanes = [[(x * ks, y * ks) for x, y in pl] for pl in lanes]
    fires = [(x * ks, y * ks, f) for x, y, f in fires]
    pole = (pole[0] * ks, pole[1] * ks)

    # local frame -> image frame (rows follow the road angle)
    th = math.radians(orientation)
    ct, st = math.cos(th), math.sin(th)

    def tr(x, y):
        return x * ct - y * st, x * st + y * ct
    for o in objs:
        o["x"], o["y"] = tr(o["x"], o["y"])
        o["ang"] = o["ang"] + th
    lanes = [[tr(*p) for p in _wobbly(pl[0], pl[-1], rng, 1.5 * ks, 6)] for pl in lanes]
    fires = [(*tr(fx, fy), k) for fx, fy, k in fires]
    pole = tr(*pole)

    half = max(L, W) / 2 * 1.12 + 1.6 * feather + 8
    Wpx = Hpx = int(2 * half * ppu)
    cx = cy = Wpx / 2
    cv = Canvas(Wpx, Hpx, ppu, cx, cy)
    yy, xx = np.mgrid[0:Hpx, 0:Wpx].astype(float)
    X, Y = (xx + 0.5 - cx) / ppu, (yy + 0.5 - cy) / ppu
    nz = _fbm((Hpx, Wpx), rng, scales=(18 * ppu, 7 * ppu, 2.5 * ppu), amps=(1, 0.6, 0.35))
    nz2 = _fbm((Hpx, Wpx), rng, scales=(30 * ppu, 10 * ppu), amps=(1, 0.5))

    # footprints -> dust patch
    foot = np.zeros((Hpx, Wpx))
    for o in objs:
        sdf, rad = shape_of(o)
        cv.mask(foot, o["x"], o["y"], o["ang"], rad, sdf)
    for fx, fy, _ in fires:
        cv.mask(foot, fx, fy, 0, 3 * ks, sd_circle(2.5 * ks))
    lx, ly = X * ct + Y * st, -X * st + Y * ct          # back to the layout frame for the ellipse core
    core = np.clip(1.0 - np.hypot(lx / (L * 0.47), ly / (W * 0.47)), 0, 1) * 1.6 + 0.25 * nz
    patch = np.maximum(np.clip(core, 0, 1) * 0.85, np.maximum(ndi.gaussian_filter(foot, 3.0 * ppu) * 2.4,
                                                              ndi.gaussian_filter(foot, 7.0 * ppu) * 3.2))
    patch = ndi.gaussian_filter(patch, 1.6 * ppu) + 0.16 * nz
    solid = ndi.binary_fill_holes(patch > 0.42)
    patch = np.maximum(patch, ndi.gaussian_filter(solid.astype(float), 1.5 * ppu) * 0.75)
    alpha = np.clip((patch - 0.16) / 0.55, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    alpha = np.clip(ndi.gaussian_filter(alpha, feather / 2.5 * ppu) * 1.15 * (1 + 0.25 * nz), 0, 1)
    alpha = np.maximum(alpha, np.clip(ndi.gaussian_filter(foot, 2.0 * ppu) * 1.5, 0, 1) * 0.92)
    lane_segs = [(pl[i], pl[i + 1]) for pl in lanes for i in range(len(pl) - 1)]
    ld = _seg_dist(X, Y, lane_segs) if lane_segs else np.full(X.shape, 1e9)
    lane = np.clip(1 - (ld - 0.8) / 1.6, 0, 1) * (0.75 + 0.25 * nz2)
    e_out = np.hypot(lx / (L * 0.5), ly / (W * 0.5))
    alpha = np.maximum(alpha, np.clip((0.95 - e_out) / 0.35, 0, 1) * (0.88 + 0.12 * nz))       # solid trampled core
    alpha = np.maximum(alpha, lane * 0.55 * np.clip((1.45 - np.hypot(lx / (L * 0.62), ly / (W * 0.62))) / 0.6, 0, 1))

    alpha *= np.clip((1.45 - e_out) / 0.35, 0, 1)             # nothing stray far outside the camp
    # ground colour: warm mottled dust, darker trampled mud, pale paths
    g = DUST[None, None, :] * (1 + 0.07 * nz[..., None]) + 9 * nz2[..., None]
    lightness = np.clip(0.5 + 0.9 * nz2, 0, 1)[..., None]
    g = g * (1 - 0.32 * lightness) + DUST_LIGHT * 0.32 * lightness
    warm = np.clip(0.5 - 1.2 * nz, 0, 1)[..., None] * 0.42
    g = g * (1 - warm) + DUST_WARM * warm
    trample = np.clip(ndi.gaussian_filter(foot, 4.0 * ppu) * 2.0, 0, 1) * np.clip(0.6 + nz, 0, 1)
    g = g * (1 - 0.25 * trample[..., None]) + MUD * 0.25 * trample[..., None]
    if kind == "wagon_park":   # wheel ruts: faint dark streaks across the rows
        rut = np.clip(np.sin(lx * 1.9 + 3 * nz) * 3 - 2.2, 0, 1) * np.clip(nz2 + 0.3, 0, 1) * 0.22
        g = g * (1 - rut[..., None]) + MUD * rut[..., None]
    g = g * (1 - lane[..., None] * 0.42) + (DUST_LIGHT + 8) * lane[..., None] * 0.42
    for fx, fy, _ in fires:   # ash circle round each fire
        d = np.hypot(X - fx, Y - fy)
        ash = np.clip(1 - d / (2.6 * ks), 0, 1)[..., None] * 0.55
        g = g * (1 - ash) + np.array([62, 56, 50.]) * ash
    occl = np.clip(ndi.gaussian_filter(foot, 1.2 * ppu) * 1.5, 0, 1)[..., None]
    g = g * (1 - 0.42 * occl) + DUST_DARK * 0.42 * occl
    # soft SE drop shadows (offset by object height)
    sh = np.zeros((Hpx, Wpx))
    for o in objs:
        sdf, rad = shape_of(o)
        h = o.get("h", 1.0)
        cv.mask(sh, o["x"] + 0.65 * h, o["y"] + 0.9 * h, o["ang"], rad, sdf)
    sh = np.clip(ndi.gaussian_filter(sh, 0.6 * ppu), 0, 1)
    g = g * (1 - 0.5 * sh[..., None])
    cv.rgb[:] = g
    cv.a[:] = alpha

    # objects (big first so small ones sit on top)
    order = {"shed": 0, "hut": 0, "wall": 1, "sibley": 1, "tent": 2, "tarp": 2, "hay": 2, "wagon": 3, "cord": 3,
             "crate": 4, "barrel": 4, "mule": 5, "horse": 5, "stack": 5, "kettle": 6}
    for o in sorted(objs, key=lambda o: order.get(o["k"], 5)):
        draw_object(cv, o, rng)
    if flag:
        draw_flag(cv, pole[0], pole[1], wind, flag_design(side, date), rng, night, ks)

    # night: dim to a blue-muted moonlit tone before the fire light goes on
    if night:
        lum = cv.rgb.mean(axis=2, keepdims=True)
        cv.rgb = (cv.rgb * 0.45 + lum * 0.25) * np.array([0.78, 0.86, 1.08])

    # fire light: warm glow on the ground and the nearby tents, ember core on top
    glow = np.zeros((Hpx, Wpx))
    for fx, fy, k in fires:
        d2 = (X - fx) ** 2 + (Y - fy) ** 2
        s1, s2 = (2.4 * ks, 6.0 * ks) if not night else (3.2 * ks, 11.0 * ks)
        glow += k * (np.exp(-d2 / (2 * s1 ** 2)) * 0.9 + np.exp(-d2 / (2 * s2 ** 2)) * (0.35 if not night else 0.75))
    glow = np.clip(glow, 0, 1.6)
    gk = (0.7 if not night else 1.25) * glow[..., None]
    warmlight = np.array([1.0, 0.62, 0.28])
    cv.rgb = cv.rgb * (1 + gk * warmlight * (0.6 if not night else 1.6)) + FIRE_GLOW * gk * (0.22 if not night else 0.35)
    cv.a = np.maximum(cv.a, np.clip(glow * (0.25 if not night else 0.75), 0, 1) * np.clip(cv.a * 2 + 0.3, 0, 1))
    for fx, fy, k in fires:
        k = k * ks
        cv.paint(fx, fy, 0, 1.3 * k, sd_circle(1.05 * k), lambda s, t, d: np.array([44, 32, 24.]), outline=0)     # char ring
        cv.paint(fx, fy, 0, 1.0 * k, sd_circle(0.72 * k), lambda s, t, d: np.array([236, 118, 36.]) * (1.0 + 0.25 * np.clip(-d, 0, 1))[..., None], outline=0)
        cv.paint(fx + 0.1, fy - 0.05, 0, 0.6 * k, sd_circle(0.36 * k), lambda s, t, d: np.array([255, 214, 120.]), outline=0)
        # thin drifting smoke wisp downwind
        wa = math.radians(wind)
        for i in range(0 if night else 5):
            dd = (1.8 + i * 1.7) * k
            sx_, sy_ = fx + dd * math.cos(wa), fy + dd * math.sin(wa) - i * 0.25 * k
            cv.paint(sx_, sy_, wa, 2.2 * k, sd_circle((0.8 + i * 0.3) * k), lambda s, t, d: np.array([150, 146, 140.]) * (1.3 if night else 1.0),
                     outline=0, opacity=(0.16 if not night else 0.09) * (1 - i / 6))

    # painterly softening (premultiplied blur, as the towns)
    img = np.dstack([cv.rgb, cv.a])
    pm = img[..., :3] * img[..., 3:4]
    sig = (0.25 + soft) * ppu
    a_s = ndi.gaussian_filter(img[..., 3], sig)
    pm = np.dstack([ndi.gaussian_filter(pm[..., i], sig) for i in range(3)])
    out = np.dstack([pm / np.maximum(a_s, 1e-4)[..., None], a_s])
    out[..., :3] = np.clip(out[..., :3], 0, 255)
    out[..., 3] = np.clip(out[..., 3], 0, 1) * 255
    out[..., 3] = np.where(out[..., 3] < 4, 0, out[..., 3])
    im = Image.fromarray(out.astype(np.uint8), "RGBA")

    glow_im = None
    if night:   # separate additive layer to put ABOVE the K.night overlay (mix-blend-mode: screen)
        gl = ndi.gaussian_filter(glow, 0.8 * ppu)
        ga = np.clip(gl * 0.85, 0, 1)
        grgb = np.broadcast_to(FIRE_GLOW, gl.shape + (3,)) * np.clip(0.75 + 0.35 * gl, 0, 1.2)[..., None]
        glow_im = Image.fromarray(np.dstack([np.clip(grgb, 0, 255), ga * 255]).astype(np.uint8), "RGBA")
    return im, (cx, cy), glow_im


def crop(im, c, glow=None):
    a = np.array(im)
    a[..., 3] = np.where(a[..., 3] < 3, 0, a[..., 3])
    im = Image.fromarray(a, "RGBA")
    bb = im.getbbox()
    if glow is not None:
        gb = glow.getbbox()
        bb = (min(bb[0], gb[0]), min(bb[1], gb[1]), max(bb[2], gb[2]), max(bb[3], gb[3]))
    return im.crop(bb), (c[0] - bb[0], c[1] - bb[1]), (glow.crop(bb) if glow is not None else None)


# ----------------------------------------------------------------- demo
DEMO = {
    # name: kwargs
    "camp_union": dict(seed=1863, kind="camp", orientation=-12, side="union"),
    "wagon_park": dict(seed=518, kind="wagon_park", orientation=8, side="union"),
    "supply_depot": dict(seed=522, kind="supply_depot", orientation=-25, side="confederate", date="1863-04-20"),
    "camp_night": dict(seed=1864, kind="camp", orientation=20, side="confederate", date="1863-04-20", night=True),
}

if __name__ == "__main__":
    import json
    here = os.path.dirname(os.path.abspath(__file__))
    names = sys.argv[1:] or list(DEMO)
    meta = {}
    mp = os.path.join(here, "camps.json")
    for name in names:
        kw = DEMO[name]
        im, c, glow = render_camp(**kw)
        im, c, glow = crop(im, c, glow)
        im.save(os.path.join(here, f"{name}.png"))
        if glow is not None:
            glow.save(os.path.join(here, f"{name}_glow.png"))
        meta[name] = dict(png=f"{name}.png", ppu=2.0, size_px=list(im.size), centre_px=[round(c[0], 1), round(c[1], 1)],
                          glow=(f"{name}_glow.png" if glow is not None else None), **{k: v for k, v in kw.items()})
        print(name, im.size, "centre px", meta[name]["centre_px"])
    old = json.load(open(mp)) if os.path.exists(mp) else {}
    old.update(meta)
    json.dump(old, open(mp, "w"), indent=1)
