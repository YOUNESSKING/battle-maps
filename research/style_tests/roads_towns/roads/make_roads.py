#!/usr/bin/env python3
"""1863 roads overlay for a Style W basemap (Warhawk-style dusty cart tracks).

Usage (from anywhere):
  python3 make_roads.py                 # vicksburg_w: overlays + roads_px.json + preview + compare
  python3 make_roads.py S_WIDE=1.35 S_CLOSE=2.1

Look (sampled from research/style_tests/roads_towns/ref_roads_zoom.png): a thin double-rut track,
two dark olive ruts with a slightly dark dusty centre, a faint lighter edge, no glow, no dashes;
~4.4 px wide at 1080p (the reference zoom is a phone screenshot at ~2.26x of a 1080p frame,
where the track measures ~10 px). Width is set ON SCREEN: the wide overlay is drawn for the
camera scale S_WIDE (screen px per map px), the close overlay for S_CLOSE (the close map only shows
at s > ~1.5 in the Style W camera). For other scales draw roads_px.json as SVG paths instead.

Coordinates: map px = Web-Mercator world px at the basemap's zoom minus origin_world_px
(the same as GG.proj(z, ox, oy) in the scene kit); the image files are hd_scale x larger.
"""
import json, math, os, sys, zlib
import numpy as np
from PIL import Image, ImageFilter
import cv2
from scipy.spatial import cKDTree

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = "/home/user/battle-maps"
ARGS = dict(a.split("=", 1) for a in sys.argv[1:] if "=" in a)
MAP = ARGS.get("MAP", "vicksburg_w")
S_WIDE = float(ARGS.get("S_WIDE", 1.35))
S_CLOSE = float(ARGS.get("S_CLOSE", 2.1))
SEED = int(ARGS.get("SEED", 7))

meta = json.load(open(f"{REPO}/grant/assets/{MAP}.json"))
Z = meta["zoom"]; OX, OY = meta["origin_world_px"]; MW, MH = meta["size"]; HD = meta.get("hd_scale", 1)
WIDE_JPG = f"{REPO}/grant/assets/{MAP}.jpg"; CLOSE_JPG = f"{REPO}/grant/assets/{MAP}_close.jpg"


def proj(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)


# ---------------------------------------------------------------- geometry
def catmull(pts, step=0.8):
    """centripetal Catmull-Rom through pts (map px), sampled ~every `step` px."""
    P = [pts[0] * 2 - pts[1]] + list(pts) + [pts[-1] * 2 - pts[-2]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        def tj(ti, a, b): return ti + max(np.linalg.norm(b - a), 1e-6) ** 0.5
        t0 = 0; t1 = tj(t0, p0, p1); t2 = tj(t1, p1, p2); t3 = tj(t2, p2, p3)
        n = max(2, int(np.linalg.norm(p2 - p1) / step))
        for t in np.linspace(t1, t2, n, endpoint=False):
            a1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            a2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            a3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            b1 = (t2 - t) / (t2 - t0) * a1 + (t - t0) / (t2 - t0) * a2
            b2 = (t3 - t) / (t3 - t1) * a2 + (t - t1) / (t3 - t1) * a3
            out.append((t2 - t) / (t2 - t1) * b1 + (t - t1) / (t2 - t1) * b2)
    out.append(pts[-1])
    return np.array(out)


def noise1d(s, rng, wl):
    """smooth value noise along arc length s (map px), wavelength wl, range ~[-1, 1]."""
    k = int(np.max(s) / wl) + 3; v = rng.uniform(-1, 1, k); x = s / wl; i = np.floor(x).astype(int); f = x - i
    f = f * f * (3 - 2 * f); return v[i] * (1 - f) + v[i + 1] * f


def wobble(line, rng, fixed):
    """natural wobble perpendicular to the road (map px); zero at the towns (control points in `fixed`)."""
    d = np.diff(line, axis=0); seg = np.hypot(d[:, 0], d[:, 1]); s = np.concatenate([[0], np.cumsum(seg)])
    tng = np.gradient(line, axis=0); tng /= np.maximum(np.hypot(tng[:, 0], tng[:, 1]), 1e-9)[:, None]
    nrm = np.stack([-tng[:, 1], tng[:, 0]], 1)
    off = 1.6 * noise1d(s, rng, 46) + 0.55 * noise1d(s, rng, 13) + 0.18 * noise1d(s, rng, 4.5)
    # pin the wobble to zero at towns so roads still meet in one point
    damp = np.ones_like(s)
    for p in fixed:
        dd = np.hypot(*(line - p).T); damp = np.minimum(damp, np.clip(dd / 30, 0, 1))
    return line + nrm * (off * damp)[:, None], s


def snap_to_river(p, rgb, r=40):
    """move a ferry/bridge point onto the nearest river pixel (pale blue) within r map px."""
    x0, y0 = int(p[0] * HD), int(p[1] * HD); R = r * HD
    sub = rgb[max(0, y0 - R):y0 + R, max(0, x0 - R):x0 + R].astype(int)
    blue = (sub[..., 2] - sub[..., 0] > 45) & (sub[..., 2] > 120)
    ys, xs = np.nonzero(blue)
    if not len(xs): print("  no river near", p); return p
    xs = xs + max(0, x0 - R); ys = ys + max(0, y0 - R); k = np.argmin((xs - x0) ** 2 + (ys - y0) ** 2)
    return np.array([xs[k] / HD, ys[k] / HD])


# ---------------------------------------------------------------- look (screen px units)
RUT = 1.0          # rut centre offset from the track centre
RUT_HW = 0.62       # rut half width
GAP_A = 0.36        # alpha of the dusty centre between the ruts
RUT_A = 0.74        # alpha of a rut
HALO_IN, HALO_OUT, HALO_A = 1.45, 2.7, 0.16   # faint lighter edge
DARK = np.array([38, 35, 12], float)    # dark olive / charcoal ink
LIGHT = np.array([196, 186, 128], float)  # dusty light edge


def band(d, a, b, aa):
    """1 inside [a, b], anti-aliased over aa on each side."""
    return np.clip((d - a) / aa + 0.5, 0, 1) * np.clip((b - d) / aa + 0.5, 0, 1)


def render(roads, W, H, scale, rng_seed, water=None):
    """RGBA overlay W x H image px; scale = image px per map px; s_cam = screen px per map px."""
    s_cam = scale_cam[0]
    k = scale / s_cam                      # image px per screen px
    aa = 1.0 / k                           # one image px, in screen units
    ad = np.zeros((H, W), np.float32); al = np.zeros((H, W), np.float32)
    reach = HALO_OUT + aa
    for rd in roads:
        line = rd["line"] * scale
        mask = np.zeros((H, W), np.uint8)
        cv2.polylines(mask, [np.round(line * 4).astype(np.int32)], False, 255, thickness=int(2 * reach * k + 6) * 4 // 4 * 1, shift=2)
        ys, xs = np.nonzero(mask)
        if not len(xs): continue
        # dense samples for an exact distance (0.25 image px)
        d = np.diff(line, axis=0); seg = np.hypot(d[:, 0], d[:, 1]); s = np.concatenate([[0], np.cumsum(seg)])
        ss = np.arange(0, s[-1], 0.25); dense = np.stack([np.interp(ss, s, line[:, 0]), np.interp(ss, s, line[:, 1])], 1)
        dist, idx = cKDTree(dense).query(np.stack([xs, ys], 1).astype(float))
        dsc = dist / k                                   # screen px
        sm = ss[idx] / scale                             # arc length, map px
        rng = np.random.default_rng(rng_seed + zlib.crc32(rd["id"].encode()) % 1000)
        # dusty: rut spacing breathes a little, strength varies along the road
        sep = RUT * (1 + 0.12 * noise1d(np.maximum(sm, 0), rng, 70))
        dust = 0.80 + 0.20 * noise1d(np.maximum(sm, 0), rng, 35)
        a_d = np.maximum(band(dsc, sep - RUT_HW, sep + RUT_HW, aa) * RUT_A, band(dsc, -9, sep, aa) * GAP_A)
        a_l = band(dsc, HALO_IN, HALO_OUT, aa * 2.2) * HALO_A
        # fade: tapered ends inside the map + the map frame
        L = s[-1] / scale; f = np.ones_like(sm)
        if 0 in rd.get("end_fade", []): f *= np.clip(sm / rd.get('fade_px', 22), 0, 1)
        if 1 in rd.get("end_fade", []): f *= np.clip((L - sm) / rd.get('fade_px', 22), 0, 1)
        px, py = xs / scale, ys / scale
        edge = np.minimum.reduce([px, py, MW - px, MH - py]); f *= np.clip(edge / 110, 0, 1) ** 1.3
        a_d *= f * dust; a_l *= f * dust
        ad[ys, xs] = np.maximum(ad[ys, xs], a_d); al[ys, xs] = np.maximum(al[ys, xs], a_l)
    # fine grain (dusty track), kept subtle
    g = np.random.default_rng(rng_seed).normal(1, 0.10, (H, W)).astype(np.float32)
    ad = np.clip(ad * g, 0, 1); al = al * (1 - ad)       # light edge never on top of the ink
    if water is not None: ad *= 1 - water; al *= 1 - water   # roads go under the rivers (fords / ferries)
    a = ad + al * (1 - ad)
    rgb = (DARK[None, None] * ad[..., None] + LIGHT[None, None] * (al * (1 - ad))[..., None]) / np.maximum(a, 1e-6)[..., None]
    out = np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


scale_cam = [1.0]


def water_mask(img):
    """soft mask of the pale-blue river ribbons (1 = water), slightly grown so a road stops at the bank."""
    a = np.asarray(img).astype(np.int16)
    m = ((a[..., 2] - a[..., 0] > 40) & (a[..., 2] > 110)).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((3, 3), np.uint8)); m = cv2.GaussianBlur(m, (0, 0), 1.0)
    return (m / 255.0).astype(np.float32)


def crop_view(base, ov, cx, cy, s):
    """1920x1080 frame of the scene camera at map px (cx, cy), scale s (as the Style W camera)."""
    w, h = 1920 / s * HD, 1080 / s * HD; box = (int(cx * HD - w / 2), int(cy * HD - h / 2), int(cx * HD + w / 2), int(cy * HD + h / 2))
    im = base.crop(box).convert("RGBA"); im.alpha_composite(ov.crop(box)); return im.convert("RGB").resize((1920, 1080), Image.LANCZOS)


def main():
    cfg = json.load(open(f"{HERE}/roads_1863.json"))
    wide = Image.open(WIDE_JPG).convert("RGB"); rgb = np.asarray(wide)
    W, H = wide.size; assert (W, H) == (MW * HD, MH * HD), (W, H)
    rng = np.random.default_rng(SEED); roads = []
    for r in cfg["roads"]:
        pts = np.array([proj(*p) for p in r["pts"]], float)
        for i in r.get("snap", []): pts[i] = snap_to_river(pts[i], rgb)
        line = catmull(pts); line, _ = wobble(line, rng, pts)
        roads.append({**r, "line": line, "ctrl": pts})
    # map-px polylines for SVG use
    js = {"_note": "map px of %s (GG.proj(%d, %d, %d)); world box 0..%d x 0..%d, same as the basemap. Draw as SVG paths: "
                   "stroke #262308 at 4.4/s px (s = camera scale) with a #c4ba80 halo, or use the PNG overlays." % (MAP, Z, OX, OY, MW, MH),
          "map": MAP, "size": [MW, MH], "roads": []}
    for r in roads:
        ln = r["line"]; d = np.hypot(*np.diff(ln, axis=0).T); s = np.concatenate([[0], np.cumsum(d)]); keep = [0]
        for i in range(1, len(ln)):
            if s[i] - s[keep[-1]] >= 3: keep.append(i)
        if keep[-1] != len(ln) - 1: keep.append(len(ln) - 1)
        js["roads"].append({"id": r["id"], "name": r["name"], "approx": r["approx"], "end_fade": r.get("end_fade", []),
                            "ctrl_px": [[round(x, 1), round(y, 1)] for x, y in r["ctrl"]],
                            "pts": [[round(float(ln[i, 0]), 1), round(float(ln[i, 1]), 1)] for i in keep]})
    json.dump(js, open(f"{HERE}/roads_px.json", "w"), separators=(",", ":"))
    close = Image.open(CLOSE_JPG).convert("RGB")
    scale_cam[0] = S_WIDE; ovw = render(roads, W, H, HD, SEED, water_mask(wide)); ovw.save(f"{HERE}/vicksburg_roads.png", optimize=True)
    scale_cam[0] = S_CLOSE; ovc = render(roads, W, H, HD, SEED, water_mask(close)); ovc.save(f"{HERE}/vicksburg_close_roads.png", optimize=True)
    # previews: the Vicksburg - Jackson area as the scene camera frames it
    P = lambda la, lo: proj(la, lo)
    v1 = crop_view(wide, ovw, *P(32.22, -90.58), S_WIDE); v1.save(f"{HERE}/preview.jpg", quality=90)
    v2 = crop_view(close, ovc, *P(32.31, -90.60), S_CLOSE); v2.save(f"{HERE}/preview_close.jpg", quality=90)
    v3 = crop_view(wide, ovw, *P(32.10, -90.85), S_WIDE); v3.save(f"{HERE}/preview_south.jpg", quality=90)
    full = wide.convert("RGBA"); full.alpha_composite(ovw); full.convert("RGB").resize((1920, 1080), Image.LANCZOS).save(f"{HERE}/preview_full.jpg", quality=88)
    # compare: reference zoom vs ours at the same on-screen scale (ref = phone shot ~2.26x of a 1080p frame)
    ref = Image.open(f"{HERE}/../ref_roads_zoom.png").convert("RGB")
    mag = 2.26; cw, ch = int(ref.width / mag), int(ref.height / mag)
    cx, cy = P(32.343, -90.79)   # the Jackson Road between Mt Alban and Bovina, wide look
    x0 = int(960 + (cx - P(32.22, -90.58)[0]) * S_WIDE - cw / 2); y0 = int(540 + (cy - P(32.22, -90.58)[1]) * S_WIDE - ch / 2)
    ours = v1.crop((x0, y0, x0 + cw, y0 + ch)).resize(ref.size, Image.LANCZOS)
    cx2, cy2 = P(32.333, -90.58)
    x1 = int(960 + (cx2 - P(32.31, -90.60)[0]) * S_CLOSE - cw / 2); y1 = int(540 + (cy2 - P(32.31, -90.60)[1]) * S_CLOSE - ch / 2)
    ours2 = v2.crop((x1, y1, x1 + cw, y1 + ch)).resize(ref.size, Image.LANCZOS)
    cmp_ = Image.new("RGB", (ref.width, ref.height * 3 + 40), (20, 20, 20)); cmp_.paste(ref, (0, 0)); cmp_.paste(ours, (0, ref.height + 20)); cmp_.paste(ours2, (0, 2 * ref.height + 40))
    cmp_.save(f"{HERE}/compare.jpg", quality=90)
    print("ok", W, H, "roads", len(roads))


if __name__ == "__main__":
    main()
