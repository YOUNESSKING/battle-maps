#!/usr/bin/env python3
"""Painted ground texture overlay for the Style W green map (vicksburg_w / vicksburg_w_close).

Procedural only (numpy / OpenCV / PIL). Writes two RGBA overlays at 5760x3240 (same box as the basemaps,
1 image px = 0.5 map px; at camera s = 1.9 one image px is ~0.95 px on a 1080p screen):
  texture_w.png      -> above #relief   (wide look)
  texture_close.png  -> above #relief2  (close look, same opacity/mask as #relief2)
Layers, bottom to top:
  (d) large-scale soft mottle: lighter / darker grass patches, low opacity, domain-warped so it reads painted
  (c) faint dirt / dust patches with a soft grain inside
      tiny dark speckle trails (the ref's scattered grit)
  (a) small rock clusters (3-8 pebbles, 3-8 px) with light NW top, dark SE side, soft contact shadow
  (b) occasional larger single rocks
Placement: Poisson-disc spacing, gated by a low-frequency clump field x terrain (rougher relief = more,
far from water = more), none on rivers / roads / towns / labels / woods (exclusion_masks/), fewer near woods,
and off the hill hachure strokes. Colours are sampled from the blurred basemap at each spot.
Same seed for both outputs, so rocks sit at the same places when the scene lens-fades wide -> close.

Usage:  python3 make_texture.py            (writes texture_w.png, texture_close.png, preview.jpg, compare.jpg)
        SEED=7 DENS=1.0 MOTTLE=1.0 python3 make_texture.py
"""
import os, glob
import numpy as np, cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RT = os.path.dirname(HERE)
ASSETS = "/home/user/battle-maps/grant/assets"
MASKS = os.path.join(RT, "exclusion_masks")
W, H = 5760, 3240
SEED = int(os.environ.get("SEED", 1863))
DENS = float(os.environ.get("DENS", 1.0))      # rock / speckle density multiplier
MOTTLE = float(os.environ.get("MOTTLE", 1.0))  # mottle opacity multiplier
DIRT = float(os.environ.get("DIRT", 1.0))      # dirt patch opacity multiplier
SS = 4                                          # supersampling for the little sprites

rng = np.random.default_rng(SEED)


def load_L(path):
    if not os.path.exists(path):
        return None
    return np.asarray(Image.open(path).convert("L")).astype(np.float32) / 255.0


def smooth_noise(scale, octaves=3, warp=0.0, seed_off=0):
    """Fractal value noise in [-1, 1] at feature size ~scale px, optionally domain-warped (painted blotches)."""
    r = np.random.default_rng(SEED + 101 + seed_off)
    acc = np.zeros((H, W), np.float32); amp, tot, sc = 1.0, 0.0, scale
    for _ in range(octaves):
        gh, gw = max(2, int(H / sc) + 3), max(2, int(W / sc) + 3)
        g = r.standard_normal((gh, gw)).astype(np.float32)
        up = cv2.resize(g, (int(gw * sc), int(gh * sc)), interpolation=cv2.INTER_CUBIC)[:H, :W]
        up = cv2.GaussianBlur(up, (0, 0), sc * 0.35)
        acc += amp * up; tot += amp; amp *= 0.5; sc /= 2.1
    acc /= tot
    if warp > 0:
        wx = cv2.resize(r.standard_normal((H // 64 + 2, W // 64 + 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
        wy = cv2.resize(r.standard_normal((H // 64 + 2, W // 64 + 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_CUBIC)
        wx = cv2.GaussianBlur(wx, (0, 0), 20) * warp; wy = cv2.GaussianBlur(wy, (0, 0), 20) * warp
        gx, gy = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
        acc = cv2.remap(acc, gx + wx, gy + wy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    acc /= (np.abs(acc).max() + 1e-6)
    return acc


def poisson(min_d, n_try, prob):
    """Dart-throwing Poisson-disc samples, each accepted with probability prob[y, x]."""
    cell = min_d / np.sqrt(2); gw, gh = int(W / cell) + 1, int(H / cell) + 1
    grid = -np.ones((gh, gw), np.int32); pts = []
    xs = rng.uniform(0, W, n_try); ys = rng.uniform(0, H, n_try); us = rng.uniform(0, 1, n_try)
    for x, y, u in zip(xs, ys, us):
        if u > prob[int(y), int(x)]:
            continue
        cx, cy = int(x / cell), int(y / cell); ok = True
        for j in range(max(0, cy - 2), min(gh, cy + 3)):
            for i in range(max(0, cx - 2), min(gw, cx + 3)):
                k = grid[j, i]
                if k >= 0 and (pts[k][0] - x) ** 2 + (pts[k][1] - y) ** 2 < min_d * min_d:
                    ok = False; break
            if not ok:
                break
        if ok:
            grid[cy, cx] = len(pts); pts.append((x, y))
    return pts


# ---------------------------------------------------------------- canvas (premultiplied RGBA float)
class Canvas:
    def __init__(self):
        self.c = np.zeros((H, W, 3), np.float32); self.a = np.zeros((H, W), np.float32)

    def over_full(self, rgb, alpha):          # full-frame layer
        a = alpha[..., None]
        self.c = rgb * a + self.c * (1 - a); self.a = alpha + self.a * (1 - alpha)

    def over_patch(self, x0, y0, rgb, alpha):  # small sprite layer, rgb (h,w,3) 0..1, alpha (h,w)
        h, w = alpha.shape
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
        if xa >= xb or ya >= yb:
            return
        al = alpha[ya - y0:yb - y0, xa - x0:xb - x0]; rg = rgb[ya - y0:yb - y0, xa - x0:xb - x0]
        cs = self.c[ya:yb, xa:xb]; as_ = self.a[ya:yb, xa:xb]
        self.c[ya:yb, xa:xb] = rg * al[..., None] + cs * (1 - al[..., None])
        self.a[ya:yb, xa:xb] = al + as_ * (1 - al)

    def rgba(self):
        a = np.clip(self.a, 0, 1)
        rgb = np.where(a[..., None] > 1e-4, self.c / np.maximum(a[..., None], 1e-4), 0)
        out = np.dstack([np.clip(rgb, 0, 1) * 255, a * 255]).round().astype(np.uint8)
        return out


# ---------------------------------------------------------------- sprites
LIGHT = np.array([-0.62, -0.62, 0.48]); LIGHT /= np.linalg.norm(LIGHT)   # from the NW, a bit above


def blob_mask(rx, ry, rot, jag, n=11):
    """Irregular stone outline at SS x scale, returns float mask + dome shading."""
    pad = 4 * SS
    w = int(2 * rx * SS + 2 * pad); h = int(2 * ry * SS + 2 * pad); s = max(w, h)
    cx = cy = s / 2
    ang = np.sort(rng.uniform(0, 2 * np.pi, n)); rr = 1 + rng.uniform(-jag, jag, n)
    px = cx + np.cos(ang) * rx * SS * rr; py = cy + np.sin(ang) * ry * SS * rr
    c, sn = np.cos(rot), np.sin(rot)
    qx = cx + (px - cx) * c - (py - cy) * sn; qy = cy + (px - cx) * sn + (py - cy) * c
    m = np.zeros((s, s), np.uint8)
    cv2.fillPoly(m, [np.stack([qx, qy], 1).round().astype(np.int32)], 255)
    m = cv2.GaussianBlur(m, (0, 0), SS * 0.45)  # rounded painted edge
    return m.astype(np.float32) / 255.0


def stone_sprite(r, base_rgb, elong=1.0, flat=0.55):
    """Shaded stone: returns (rgb, alpha) for the stone and (rgb, alpha) for its contact shadow, at 1x."""
    rx, ry = r * elong, r / elong
    m = blob_mask(rx, ry, rng.uniform(0, np.pi), 0.22)
    s = m.shape[0]
    d = cv2.distanceTransform((m > 0.5).astype(np.uint8), cv2.DIST_L2, 5)
    hgt = np.sqrt(np.clip(d / (d.max() + 1e-6), 0, 1)) * flat * r * SS
    hgt = cv2.GaussianBlur(hgt, (0, 0), SS * 0.8)
    gy, gx = np.gradient(hgt)
    nz = np.ones_like(gx); nrm = np.sqrt(gx * gx + gy * gy + nz)
    shade = (-gx * LIGHT[0] - gy * LIGHT[1] + nz * LIGHT[2]) / nrm   # 0..1
    shade = np.clip(shade, 0, 1)
    lit = 0.55 + 0.75 * shade                                        # dark SE side ~0.6, NW top ~1.25
    rgb = np.clip(base_rgb[None, None, :] * lit[..., None], 0, 1)
    # thin darker rim on the SE (painted outline feel)
    rim = np.clip(m - cv2.erode(m, np.ones((SS + 1, SS + 1), np.uint8)), 0, 1)
    yy, xx = np.mgrid[0:s, 0:s]; se = np.clip(((xx - s / 2) + (yy - s / 2)) / (s / 2), 0, 1)
    rgb = rgb * (1 - 0.35 * (rim * se)[..., None])
    # contact shadow: offset SE, soft, darker than ground
    M = np.float32([[1, 0, 1.3 * SS], [0, 1, 1.6 * SS]])
    sh = cv2.warpAffine(m, M, (s, s)); sh = cv2.GaussianBlur(sh, (0, 0), SS * 1.1)
    sh = np.clip(sh * 1.15, 0, 1) * (1 - m * 0.0)
    down = lambda z: cv2.resize(z, (s // SS, s // SS), interpolation=cv2.INTER_AREA)
    return down(rgb), down(m), down(sh)


def place_stone(cv, x, y, r, base, shadow_rgb, alpha_mul=1.0, shadow_a=0.42, elong=None):
    rgb, a, sh = stone_sprite(r, base, elong if elong else rng.uniform(1.0, 1.45))
    s = a.shape[0]; x0, y0 = int(round(x - s / 2)), int(round(y - s / 2))
    cv.over_patch(x0, y0, np.broadcast_to(shadow_rgb, rgb.shape), sh * shadow_a * alpha_mul)
    cv.over_patch(x0, y0, rgb, a * 0.92 * alpha_mul)


# ---------------------------------------------------------------- inputs
def build(key):
    bm_path = f"{ASSETS}/vicksburg_w.jpg" if key == "w" else f"{ASSETS}/vicksburg_w_close.jpg"
    base = np.asarray(Image.open(bm_path).convert("RGB")).astype(np.float32) / 255.0
    base_blur = cv2.GaussianBlur(base, (0, 0), 24)

    # exclusion masks (255 = keep the texture off)
    riv = load_L(f"{MASKS}/rivers_{key}.png"); wood = load_L(f"{MASKS}/woods_{key}.png")
    others = [load_L(f"{MASKS}/{n}.png") for n in ("roads", "towns", "labels")]
    if riv is None:   # fallback: blue pixels of the basemap
        b = base
        riv = ((b[..., 2] > b[..., 1] + 0.06) & (b[..., 2] > b[..., 0] + 0.15)).astype(np.float32)
        riv = cv2.dilate(riv, np.ones((5, 5), np.uint8))
    if wood is None:
        wood = (base.mean(2) < 72 / 255).astype(np.float32)
    hard = riv.copy()
    for o in others:
        if o is not None:
            hard = np.maximum(hard, o)
    # hill hachure strokes (keep rocks off the ink)
    hill = np.zeros((H, W), np.float32)
    suffix = "_close" if key == "close" else ""
    for f in glob.glob(os.path.join(RT, "hills", f"*{suffix}.png")):
        nm = os.path.basename(f)
        if "crop" in nm or (key == "w" and "_close" in nm):
            continue
        im = Image.open(f)
        if im.size == (W, H) and im.mode == "RGBA":
            hill = np.maximum(hill, np.asarray(im)[..., 3].astype(np.float32) / 255)
    hill = (hill > 0.3).astype(np.float32)

    k = lambda n: np.ones((n, n), np.uint8)
    rock_off = np.maximum(cv2.dilate((hard > 0.5).astype(np.uint8), k(41)), cv2.dilate((wood > 0.5).astype(np.uint8), k(25)))
    rock_off = np.maximum(rock_off, cv2.dilate(hill.astype(np.uint8), k(9))).astype(np.float32)
    near_wood = cv2.GaussianBlur(wood, (0, 0), 70); near_wood = np.clip(near_wood / (near_wood.max() * 0.35 + 1e-6), 0, 1)

    # terrain: rougher relief (uplands) = more; distance from water = drier = more
    lift = np.asarray(Image.open(f"{ASSETS}/vicksburg_hd_lift.jpg").convert("L")).astype(np.float32) / 255
    m1 = cv2.GaussianBlur(lift, (0, 0), 10); m2 = cv2.GaussianBlur(lift * lift, (0, 0), 10)
    rough = cv2.GaussianBlur(np.sqrt(np.clip(m2 - m1 * m1, 0, None)), (0, 0), 60)
    rough = np.clip((rough - np.percentile(rough, 10)) / (np.percentile(rough, 95) - np.percentile(rough, 10)), 0, 1)
    dist = cv2.distanceTransform((1 - (riv > 0.5)).astype(np.uint8), cv2.DIST_L2, 5)
    dry = np.clip(dist / 260.0, 0, 1)
    terr = (0.25 + 0.75 * rough) * (0.45 + 0.55 * dry) * (1 - 0.75 * near_wood)
    return base, base_blur, riv, wood, hard, rock_off, terr


# ---------------------------------------------------------------- shared random layout (same for both keys)
def layout(terr, rock_off):
    clump = smooth_noise(520, 2, seed_off=7)                       # where stony ground gathers
    clump = np.clip((clump + 0.15) * 1.6, 0, 1) ** 1.4
    p = np.clip(terr * clump * (1 - rock_off), 0, 1)
    clusters = poisson(95, int(30000 * DENS), np.clip(p * 1.6, 0, 1))
    big = poisson(300, int(6000 * DENS), np.clip(p * 1.0, 0, 1))
    trails = poisson(170, int(14000 * DENS), np.clip(p * 1.4, 0, 1))
    dirt_p = np.clip(terr * (0.35 + 0.65 * clump), 0, 1)
    dirt = poisson(650, 1400, dirt_p * 0.5)
    return clusters, big, trails, dirt


def stone_colour(local, light=True):
    """Stone tone from the local ground: desaturated grey-tan (light stones) or earthy brown (dark pebbles)."""
    grey = local.mean()
    c = 0.40 * local + 0.60 * np.array([grey * 1.05, grey * 0.98, grey * 0.80])
    if light:
        c = c * rng.uniform(1.15, 1.40) + np.array([0.05, 0.04, 0.015])
    else:
        c = c * rng.uniform(0.62, 0.80) + np.array([0.01, 0.0, -0.01])
    return np.clip(c, 0, 1)


def render(key, lay, base, base_blur, riv, wood, hard, rock_off):
    clusters, big, trails, dirt = lay
    cv = Canvas()
    soft_hard = cv2.GaussianBlur(hard, (0, 0), 6)

    # (d) mottle: big light / dark grass patches + a finer painted layer
    mean = base_blur
    m = smooth_noise(420, 3, warp=60, seed_off=1) * 0.75 + smooth_noise(140, 2, warp=25, seed_off=2) * 0.25
    m = np.tanh(m * 2.2) / np.tanh(2.2)                            # slightly firmer blotch edges, painted
    light = np.clip(mean * 1.16 + np.array([0.045, 0.04, -0.01]), 0, 1)        # sunny yellow-olive
    dark = np.clip(mean * 0.74 + np.array([0.0, 0.005, -0.01]), 0, 1)           # deeper green-brown
    keep = (1 - cv2.GaussianBlur(riv, (0, 0), 3)) * (1 - 0.6 * wood)
    a_l = np.clip(m, 0, 1) * 0.36 * MOTTLE * keep
    a_d = np.clip(-m, 0, 1) * 0.40 * MOTTLE * keep
    cv.over_full(light, a_l)
    cv.over_full(dark, a_d)
    del light, dark, m, a_l, a_d

    # (c) dirt / dust patches: irregular, soft, grain inside
    grain = rng.random((H, W)).astype(np.float32)
    grain = cv2.GaussianBlur(grain, (0, 0), 0.8); grain = (grain - grain.mean()) / (grain.std() + 1e-6)
    for (x, y) in dirt:
        R = rng.uniform(70, 210); s = int(R * 2.6); x0, y0 = int(x - s / 2), int(y - s / 2)
        yy, xx = np.mgrid[0:s, 0:s].astype(np.float32)
        ang = rng.uniform(0, np.pi); el = rng.uniform(1.2, 2.2)
        u = ((xx - s / 2) * np.cos(ang) + (yy - s / 2) * np.sin(ang)) / (R * el / 1.3)
        v = (-(xx - s / 2) * np.sin(ang) + (yy - s / 2) * np.cos(ang)) / (R / el * 1.3)
        n = cv2.resize(rng.standard_normal((9, 9)).astype(np.float32), (s, s), interpolation=cv2.INTER_CUBIC)
        n2 = cv2.resize(rng.standard_normal((24, 24)).astype(np.float32), (s, s), interpolation=cv2.INTER_CUBIC)
        f = 1 - np.sqrt(u * u + v * v) + 0.32 * n + 0.12 * n2
        a = np.clip(f / 0.6, 0, 1) ** 1.5
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + s), min(H, y0 + s)
        if xa >= xb or ya >= yb:
            continue
        sl = (slice(ya - y0, yb - y0), slice(xa - x0, xb - x0))
        a = a[sl] * (1 - soft_hard[ya:yb, xa:xb]) * (1 - wood[ya:yb, xa:xb])
        g = grain[ya:yb, xa:xb]
        loc = base_blur[int(y), int(x)]
        dusty = rng.random() < 0.7
        if dusty:   # pale dust: ochre-tan
            col = np.clip(0.55 * loc + 0.45 * np.array([0.66, 0.58, 0.38]), 0, 1); amax = rng.uniform(0.24, 0.36)
        else:       # darker bare earth smudge (like the ref's top-right patch)
            col = np.clip(loc * 0.62 + np.array([0.02, 0.0, -0.01]), 0, 1); amax = rng.uniform(0.22, 0.34)
        rgb = np.clip(col[None, None, :] * (1 + 0.10 * g[..., None]), 0, 1)
        cv.over_patch(xa, ya, rgb, np.clip(a * amax * DIRT * (1 + 0.35 * g), 0, 1))
    del grain

    # tiny dark speckle trails (grit): 10-30 specks along a gentle curve
    for (x, y) in trails:
        n = rng.integers(10, 30); L = rng.uniform(40, 130); ang = rng.uniform(0, np.pi); bend = rng.uniform(-0.6, 0.6)
        loc = base_blur[int(y), int(x)]; col = np.clip(loc * 0.40 + np.array([0.01, 0.0, -0.01]), 0, 1)
        for i in range(n):
            t = rng.uniform(-0.5, 0.5); a2 = ang + bend * t
            px = x + np.cos(a2) * L * t + rng.normal(0, 7); py = y + np.sin(a2) * L * t + rng.normal(0, 7)
            if not (0 <= px < W and 0 <= py < H) or rock_off[int(py), int(px)] > 0.5:
                continue
            r = rng.uniform(0.9, 2.3)
            s = int(np.ceil(r * 2 + 4)) * SS; mm = np.zeros((s, s), np.uint8)
            cv2.ellipse(mm, (s // 2, s // 2), (max(1, int(r * SS * rng.uniform(0.8, 1.4))), max(1, int(r * SS))),
                        rng.uniform(0, 180), 0, 360, 255, -1)
            mm = cv2.resize(mm, (s // SS, s // SS), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
            cv.over_patch(int(px - s / SS / 2), int(py - s / SS / 2), np.broadcast_to(col, mm.shape + (3,)),
                          mm * rng.uniform(0.6, 0.88))

    # (a) rock clusters
    for (x, y) in clusters:
        n = rng.integers(3, 9); spread = rng.uniform(7, 22)
        loc = base_blur[int(y), int(x)]; shadow_rgb = np.clip(loc * 0.35, 0, 1)
        pts = []
        for i in range(n):
            for _ in range(8):
                px, py = x + rng.normal(0, spread), y + rng.normal(0, spread * 0.7)
                r = rng.uniform(1.5, 4.0) if i else rng.uniform(2.6, 4.2)
                if all((px - qx) ** 2 + (py - qy) ** 2 > (r + qr + 0.8) ** 2 for qx, qy, qr in pts):
                    break
            if not (0 <= px < W and 0 <= py < H) or rock_off[int(py), int(px)] > 0.5:
                continue
            pts.append((px, py, r))
        lt = rng.random() < 0.45                                    # light grey stones or dark earthy pebbles
        for px, py, r in sorted(pts, key=lambda p: p[1]):          # back to front
            place_stone(cv, px, py, r, stone_colour(base_blur[int(py), int(px)], lt), shadow_rgb)

    # (b) occasional larger single rocks (sometimes with 1-2 chips)
    for (x, y) in big:
        if rock_off[int(y), int(x)] > 0.5:
            continue
        loc = base_blur[int(y), int(x)]; shadow_rgb = np.clip(loc * 0.32, 0, 1)
        r = rng.uniform(5.0, 8.0)
        place_stone(cv, x, y, r, stone_colour(loc), shadow_rgb, shadow_a=0.5, elong=rng.uniform(1.05, 1.5))
        for _ in range(rng.integers(0, 3)):
            a = rng.uniform(0, 2 * np.pi); d = r + rng.uniform(3, 9)
            place_stone(cv, x + np.cos(a) * d, y + np.sin(a) * d, rng.uniform(1.5, 2.6), stone_colour(loc), shadow_rgb)
    return cv.rgba()


# ---------------------------------------------------------------- previews
def composite(base_rgb_u8, tex_rgba):
    a = tex_rgba[..., 3:4].astype(np.float32) / 255
    return (base_rgb_u8.astype(np.float32) * (1 - a) + tex_rgba[..., :3].astype(np.float32) * a).round().astype(np.uint8)


def over_png(img, path):
    if not os.path.exists(path):
        return img
    o = np.asarray(Image.open(path).convert("RGBA"))
    if o.shape[:2] != img.shape[:2]:
        return img
    return composite(img, o)


def previews(tex_w, tex_c):
    S = 1.9; cx, cy = 1500, 700            # map px: Vicksburg (1388,681) - Edwards (1599,716)
    hw, hh = 960 / S * 2, 540 / S * 2      # half-size in image px
    box = (int(2 * cx - hw), int(2 * cy - hh), int(2 * cx + hw), int(2 * cy + hh))
    rows = []
    for key, tex in (("w", tex_w), ("close", tex_c)):
        bm = np.asarray(Image.open(f"{ASSETS}/vicksburg_w{'_close' if key == 'close' else ''}.jpg").convert("RGB"))
        crop_b = bm[box[1]:box[3], box[0]:box[2]]
        crop_t = composite(crop_b, tex[box[1]:box[3], box[0]:box[2]])
        rows.append((key, crop_b, crop_t))
    # preview.jpg: close look (the scene's look at s=1.9) with texture, 1080p; plus the wide look
    _, b_c, t_c = rows[1]; _, b_w, t_w = rows[0]
    Image.fromarray(t_c).resize((1920, 1080), Image.LANCZOS).save(os.path.join(HERE, "preview.jpg"), quality=92)
    Image.fromarray(t_w).resize((1920, 1080), Image.LANCZOS).save(os.path.join(HERE, "preview_wide.jpg"), quality=92)
    bc = Image.fromarray(b_c).resize((1920, 1080), Image.LANCZOS)
    tc = Image.fromarray(t_c).resize((1920, 1080), Image.LANCZOS)
    ab = Image.new("RGB", (1920, 2160)); ab.paste(bc, (0, 0)); ab.paste(tc, (0, 1080))
    ab.save(os.path.join(HERE, "preview_before_after.jpg"), quality=90)
    # compare.jpg: reference crop next to ours, both 1:1 on screen, plus 2x zooms
    ref = Image.open(os.path.join(RT, "owner_ref_yarmouk.png")).convert("RGB")
    r1 = ref.crop((440, 330, 1125, 1000))                             # ref: rock trails + mottle + dark patch
    r2 = ref.crop((330, 1700, 1015, 2370 if ref.size[1] >= 2370 else ref.size[1]))
    tcs = tc
    o1 = tcs.crop((560, 120, 1245, 790)); o2 = tcs.crop((1100, 300, 1785, 970))
    pw, ph = 685, 670
    sheet = Image.new("RGB", (pw * 2 + 30, ph * 2 + 90), (24, 22, 18))
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    d.text((10, 8), "REFERENCE (owner phone screenshot, 1:1)", fill=(235, 225, 200))
    d.text((pw + 40, 8), "OURS (vicksburg_w_close + texture, 1080p at camera s=1.9, 1:1)", fill=(235, 225, 200))
    sheet.paste(r1.resize((pw, ph)), (10, 30)); sheet.paste(o1, (pw + 20, 30))
    sheet.paste(r2.resize((pw, ph)), (10, ph + 60)); sheet.paste(o2, (pw + 20, ph + 60))
    sheet.save(os.path.join(HERE, "compare.jpg"), quality=92)
    # 3x zoom of a small patch (to judge the pebble shading)
    al = tex_c[box[1]:box[3], box[0]:box[2], 3]
    al = cv2.resize((al > 140).astype(np.float32), (1920, 1080), interpolation=cv2.INTER_AREA)
    dens = cv2.boxFilter(al, -1, (320, 180), normalize=False)
    zy, zx = np.unravel_index(np.argmax(dens[90:-90, 160:-160]), dens[90:-90, 160:-160].shape)
    z = tc.crop((zx, zy, zx + 320, zy + 180)).resize((960, 540), Image.LANCZOS)
    z.save(os.path.join(HERE, "zoom3x.jpg"), quality=92)


def main():
    global rng
    data = {}
    for key in ("w", "close"):
        data[key] = build(key)
    # one layout from the union of both exclusion sets, so positions are shared
    terr = data["w"][6]; rock_off = np.maximum(data["w"][5], data["close"][5])
    rng = np.random.default_rng(SEED)
    lay = layout(terr, rock_off)
    print("clusters", len(lay[0]), "big", len(lay[1]), "trails", len(lay[2]), "dirt", len(lay[3]))
    out = {}
    for key in ("w", "close"):
        base, base_blur, riv, wood, hard, ro, _ = data[key]
        rng = np.random.default_rng(SEED + 5)                       # same sprites/jitter for both looks
        out[key] = render(key, lay, base, base_blur, riv, wood, hard, rock_off)
        Image.fromarray(out[key], "RGBA").save(os.path.join(HERE, f"texture_{'w' if key == 'w' else 'close'}.png"), optimize=True)
        print("wrote", key)
    previews(out["w"], out["close"])


if __name__ == "__main__":
    main()
