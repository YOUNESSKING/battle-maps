#!/usr/bin/env python3
"""Carved, muted rivers for the Style W basemaps (reference: owner_ref_yarmouk.png, ref_river_zoom.png,
ref_town_zoom.png). Builds RGBA overlays that REPLACE the saturated blue ribbons of the basemap.

Usage:  python3 make_rivers.py            (MAP=vicksburg_w by default; KEY=value options below)
Out:    rivers_w.png, rivers_close.png (5760x3240 RGBA, same box as the basemaps), preview.jpg, compare.jpg

How it works (all procedural, numpy/OpenCV):
 1. water mask = the basemap's blue pixels; skeleton -> centre-line distance d and the old half-width per pixel.
 2. the old ribbon (+ its dark outline) is covered with ground: a hole-filled low-frequency grass colour
    plus real grass grain copied from a nearby offset, so the new, thinner water sits in plain grass.
 3. a height field (a soft groove with banks) is shaded with light from the NW -> dark wall on the NW bank,
    light rim on the SE bank (the "carved" emboss); a soft darker bank band feathers into the grass.
 4. water: desaturated pale grey-blue, a bit deeper mid-channel on the Mississippi, faint shimmer streaks
    running along the flow. Small creeks become ~5 px carved lines; the Mississippi stays wide.
Inside the old ribbon the overlay is opaque; outside it only darkens/lightens (alpha) so the hills,
lanes and texture under it stay visible.
"""
import json, os, sys
import numpy as np
import cv2
from PIL import Image
from skimage.morphology import skeletonize

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = "/home/user/battle-maps"
ARGS = dict(a.split("=", 1) for a in sys.argv[1:] if "=" in a)
MAP = ARGS.get("MAP", "vicksburg_w")
BIG_HW = float(ARGS.get("BIG_HW", 9.0))      # old half-width (img px) above which a river counts as "big"
CREEK_HW = float(ARGS.get("CREEK_HW", 2.3))  # new water half-width of creeks (img px; ~0.95 screen px each at s 1.9)
BIG_K = float(ARGS.get("BIG_K", 1.0))        # Mississippi: new half-width = BIG_K * old
BLUE_MIX = float(ARGS.get("BLUE_MIX", 0.5))  # water colour: 0 = muted reference grey-blue, 1 = the old saturated Style W blue
WIDTH = float(ARGS.get("WIDTH", 0.65))        # creek width: 0 = thin reference line (CREEK_HW), 1 = the old ribbon width
SEED = int(ARGS.get("SEED", 5))

meta = json.load(open(f"{REPO}/grant/assets/{MAP}.json"))
HD = meta.get("hd_scale", 1)

# colours (sRGB 0..255), sampled toward the reference and set against our grass (~104,110,61)
WATER = np.array([112, 119, 102], np.float32)       # muted pale grey-blue (ref water ~ 96,100,81 on darker, yellower grass)
WATER_DEEP = np.array([88, 98, 90], np.float32)   # mid-channel tone of the big river
SHIMMER = np.array([132, 140, 130], np.float32)     # faint light streaks
DARK = np.array([34, 38, 20], np.float32)           # bank shadow tint (alpha outside the old ribbon)
LIGHT = np.array([168, 170, 146], np.float32)       # rim highlight tint (alpha outside the old ribbon)
LIGHT_DIR = np.array([-1.0, -1.0, 1.1]); LIGHT_DIR /= np.linalg.norm(LIGHT_DIR)   # from the NW, above


def blue_mask(a):
    a = a.astype(np.int16)
    return ((a[..., 2] - a[..., 0] > 40) & (a[..., 2] > 110)).astype(np.uint8)


def gblur(x, s):
    return cv2.GaussianBlur(x, (0, 0), s)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)


def value_noise(h, w, cell, rng):
    """smooth noise in -1..1 with features ~cell px."""
    g = rng.standard_normal((h // cell + 3, w // cell + 3)).astype(np.float32)
    n = cv2.resize(g, (w + 2 * cell, h + 2 * cell), interpolation=cv2.INTER_CUBIC)[cell:cell + h, cell:cell + w]
    return n / (n.std() + 1e-6)


def old_blue(img):
    """median colour of the old ribbon's core (the saturated Style W blue)."""
    m = blue_mask(img); dt = cv2.distanceTransform(m, cv2.DIST_L2, 5)
    return np.median(img[dt > 2.5].reshape(-1, 3), axis=0).astype(np.float32)


def build(img, rng, blue_mix=None, width=None, ob=None, big_k=None):
    big_k = BIG_K if big_k is None else big_k
    blue_mix = BLUE_MIX if blue_mix is None else blue_mix; width = WIDTH if width is None else width
    H, W, _ = img.shape
    base = img.astype(np.float32)
    ob = old_blue(img) if ob is None else ob
    mixc = lambda muted, old: muted * (1 - blue_mix) + old * blue_mix
    WATER_ = mixc(WATER, ob); WATER_DEEP_ = mixc(WATER_DEEP, ob * 0.84); SHIMMER_ = mixc(SHIMMER, np.minimum(ob * 1.22, 255))
    m = blue_mask(img)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    # old ribbon incl. its dark outline stroke -> what we cover
    cover = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))
    # centre line, its half-width, distance to it
    dt_in = cv2.distanceTransform(m, cv2.DIST_L2, 5)
    sk = skeletonize(m > 0).astype(np.uint8)
    sk &= (dt_in > 1.5).astype(np.uint8)                       # drop spurs at the ragged edges
    inv = (1 - sk).astype(np.uint8)
    d, lab = cv2.distanceTransformWithLabels(inv, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    ys, xs = np.nonzero(sk)
    hw_sk = np.zeros(lab.max() + 1, np.float32)
    # label index of each skeleton pixel
    # smooth the width ALONG the skeleton (tight bends otherwise read as fat corners -> blobs)
    skf = sk.astype(np.float32)
    num = cv2.blur(dt_in * skf, (41, 41)); den = cv2.blur(skf, (41, 41))
    hw_sk[lab[ys, xs]] = np.minimum(dt_in[ys, xs], num[ys, xs] / np.maximum(den[ys, xs], 1e-6))
    old_hw = hw_sk[lab]
    old_hw = cv2.blur(old_hw, (15, 15))                       # steadier width along the river
    big = smoothstep(BIG_HW - 1.5, BIG_HW + 1.0, old_hw)        # 0 creek .. 1 Mississippi
    creek_hw = CREEK_HW + width * np.maximum(old_hw - CREEK_HW, 0)
    hw = creek_hw * (1 - big) + big_k * old_hw * big           # new water half-width
    hw *= 1 + 0.10 * value_noise(H, W, 40, rng)                 # slight natural width variation
    d = d.astype(np.float32)

    # ---------------- 1. ground over the old ribbon (hole fill + borrowed grass grain)
    keep = (1 - cover).astype(np.float32)
    lo = np.zeros_like(base)
    acc_w = np.zeros((H, W), np.float32)
    for s in (6, 14, 30):                                       # multi-scale normalised convolution
        wsum = gblur(keep, s)[..., None]
        est = gblur(base * keep[..., None], s) / np.maximum(wsum, 1e-4)
        take = (wsum[..., 0] > 0.15).astype(np.float32) * (1 - acc_w)
        lo += est * take[..., None]; acc_w += take
    lo = np.where(acc_w[..., None] > 0, lo, base)
    hp = base - gblur(base, 2.5)
    lum = base.mean(2)
    bad = (cover > 0) | (lum < 72)                               # don't borrow water or ink trees
    grain = np.zeros_like(base); got = np.zeros((H, W), bool)
    for ox, oy in ((23, 41), (-37, 19), (45, -29), (-19, -47), (61, 7)):
        sh = np.roll(np.roll(hp, oy, 0), ox, 1); shb = np.roll(np.roll(bad, oy, 0), ox, 1)
        use = (~shb) & (~got); grain[use] = sh[use]; got |= use
    grain = np.clip(grain, -25, 25)
    ground = lo + grain
    soft_cover = gblur(cover.astype(np.float32), 1.2)
    ground = base * (1 - soft_cover[..., None]) + ground * soft_cover[..., None]

    # ---------------- 2. height field of the carved channel, lit from the NW
    bank_w = 3.0 + 4.0 * big                                    # groove wall width beyond the water edge
    depth = 1.0 + 1.2 * big
    h = -depth * (1 - smoothstep(hw - 0.6, hw + bank_w, d))     # groove (flat water floor)
    h += -0.35 * (1 - smoothstep(0, hw + bank_w + 4, d)) * (0.4 + big)   # broad soft valley
    hs = gblur(h, 0.9)
    gx = cv2.Sobel(hs, cv2.CV_32F, 1, 0, ksize=3) / 8; gy = cv2.Sobel(hs, cv2.CV_32F, 0, 1, ksize=3) / 8
    k = 2.6
    nx, ny, nz = -gx * k, -gy * k, np.ones_like(gx)
    nn = np.sqrt(nx * nx + ny * ny + 1)
    lam = (nx * LIGHT_DIR[0] + ny * LIGHT_DIR[1] + nz * LIGHT_DIR[2]) / nn
    shade = lam - LIGHT_DIR[2]                                  # 0 on flat ground, <0 shadow wall, >0 lit wall
    shade = np.clip(shade * 1.1, -0.30, 0.26)

    # soft darker bank band feathering into the grass
    band_w = 8.0 + 8.0 * big
    band = (1 - smoothstep(hw, hw + band_w, d)) * (0.15 + 0.05 * big)
    band *= 1 + 0.25 * value_noise(H, W, 25, rng)
    # directional: the bank band lies mostly on the NW side (the bank's shadow falls into the groove)
    dg = gblur(d, 2.0)
    dx = cv2.Sobel(dg, cv2.CV_32F, 1, 0, ksize=3) / 8; dy = cv2.Sobel(dg, cv2.CV_32F, 0, 1, ksize=3) / 8
    side = np.clip(-(dx + dy) / 1.414 / np.maximum(np.hypot(dx, dy), 1e-3), -1, 1)   # +1 NW bank, -1 SE bank
    band *= 1 + 0.65 * side * (d > hw)

    # ---------------- 3. water colour
    rel = np.clip(d / np.maximum(hw, 0.5), 0, 1)
    deep = big * (1 - smoothstep(0.0, 0.85, rel)) * 0.75
    water = WATER_ * (1 - deep[..., None]) + WATER_DEEP_ * deep[..., None]
    water *= (1 + 0.035 * value_noise(H, W, 18, rng))[..., None]
    # shimmer: streaks parallel to the flow (iso-lines of the centre distance), broken by low-freq noise
    ph = value_noise(H, W, 90, rng) * 1.2
    streak = 0.5 + 0.5 * np.sin(2 * np.pi * d / 5.5 + ph)
    streak = streak ** 6
    brk = smoothstep(0.2, 1.4, value_noise(H, W, 70, rng))
    shim = streak * brk * (0.05 + 0.20 * big) * (1 - smoothstep(0.8, 1.0, rel))
    water = water * (1 - shim[..., None]) + SHIMMER_ * shim[..., None]
    walpha = np.clip(hw - d + 0.5, 0, 1)                         # anti-aliased water edge

    # ---------------- 4. compose the final look
    gshade = ground * (1 - band[..., None])
    # soft light feather on the SE bank (the reference's pale lip beyond the water)
    halo = (1 - smoothstep(hw + 1.0, hw + 7.0 + 4.0 * big, d)) * 0.13 * np.clip(-side, 0, 1) * (d > hw)
    gshade = gshade * (1 - halo[..., None]) + LIGHT * halo[..., None]
    final = gshade * (1 - walpha[..., None]) + water * walpha[..., None]
    # emboss: multiply by (1 + shade); highlight leans to a light tint, shadow to dark olive
    pos = np.clip(shade, 0, None)[..., None]; neg = np.clip(-shade, 0, None)[..., None]
    final = final * (1 - neg) + DARK * neg
    # thin soft dark water outline (the reference's ink-like edge), heavier on the NW bank
    edge = np.exp(-((d - hw - 0.4) / (1.1 + 0.6 * big)) ** 2) * (0.26 + 0.14 * np.clip(side, 0, 1))
    final = final * (1 - edge[..., None]) + DARK * edge[..., None]
    final = final * (1 - pos) + LIGHT * pos
    final = np.clip(final, 0, 255)

    # ---------------- 5. overlay: opaque over the old ribbon, alpha tint outside it
    inside = soft_cover
    out = np.zeros((H, W, 4), np.float32)
    # outside: express final as  base over-composited with DARK (or LIGHT) at alpha a
    fl = final.mean(2); bl = base.mean(2)
    dl, ll = DARK.mean(), LIGHT.mean()
    a_dark = np.clip((bl - fl) / np.maximum(bl - dl, 1), 0, 1)
    a_light = np.clip((fl - bl) / np.maximum(ll - bl, 1), 0, 1)
    out_rgb = np.where((fl < bl)[..., None], DARK, LIGHT)
    out_a = np.where(fl < bl, a_dark, a_light)
    zone = (d < hw + band_w + bank_w + 10)                        # keep the alpha tint local
    out_a *= zone
    rgb = final * inside[..., None] + out_rgb * (1 - inside[..., None])
    a = inside + out_a * (1 - inside)
    # premultiplied-safe mix of rgb where both contribute
    mix = np.where(a[..., None] > 0, (final * inside[..., None] + out_rgb * (out_a * (1 - inside))[..., None]) / np.maximum(a, 1e-4)[..., None], 0)
    out[..., :3] = mix; out[..., 3] = a * 255
    return np.clip(out, 0, 255).astype(np.uint8)


def crop_view(base, ov, cx, cy, s):
    """1920x1080 camera frame at map px (cx, cy), scale s (screen px per map px)."""
    w, h = 1920 / s * HD, 1080 / s * HD
    box = (int(cx * HD - w / 2), int(cy * HD - h / 2), int(cx * HD + w / 2), int(cy * HD + h / 2))
    im = base.crop(box).convert("RGBA")
    if ov is not None: im.alpha_composite(ov.crop(box))
    return im.convert("RGB").resize((1920, 1080), Image.LANCZOS)


def main():
    rng = np.random.default_rng(SEED)
    outs = {}
    for suf, name in (("", "rivers_w"), ("_close", "rivers_close")):
        if ARGS.get("ONLY") and ARGS["ONLY"] != name: continue
        src = Image.open(f"{REPO}/grant/assets/{MAP}{suf}.jpg").convert("RGB")
        ov = Image.fromarray(build(np.asarray(src), rng), "RGBA")
        ov.save(f"{HERE}/{name}.png", optimize=True)
        outs[name] = (src, ov); print("wrote", name)
    S = 1.9; CX, CY = 1440, 700            # map px: Vicksburg (1382,681) .. Big Black crossing (1507,702)
    if "rivers_w" in outs:
        src, ov = outs["rivers_w"]
        pv = crop_view(src, ov, CX, CY, S); pv.save(f"{HERE}/preview.jpg", quality=92)
        crop_view(src, None, CX, CY, S).save(f"{HERE}/preview_before.jpg", quality=88)
        # compare: columns old | middle (this build) | reference-like (BLUE_MIX 0, WIDTH 0) | owner reference,
        # rows Big Black meander / Mississippi at Vicksburg; all at the phone shots' magnification (~2.26x a 1080p frame)
        from PIL import ImageDraw, ImageFont
        mag = 2.26
        w_, h_ = 1920 / S * HD, 1080 / S * HD; x0, y0 = int(CX * HD - w_ / 2), int(CY * HD - h_ / 2)
        pad = 120; arr = np.asarray(src)
        sub = arr[y0 - pad:y0 + int(h_) + pad, x0 - pad:x0 + int(w_) + pad]
        refl = Image.fromarray(build(sub, np.random.default_rng(SEED), blue_mix=0.0, width=0.0, ob=old_blue(arr), big_k=0.9), "RGBA")
        bl = Image.fromarray(sub).convert("RGBA"); bl.alpha_composite(refl)
        pr = bl.crop((pad, pad, pad + int(w_), pad + int(h_))).convert("RGB").resize((1920, 1080), Image.LANCZOS)
        pr.save(f"{HERE}/preview_reflike.jpg", quality=88)
        pb = crop_view(src, None, CX, CY, S)
        refs = [Image.open(f"{HERE}/../{f}").convert("RGB") for f in ("ref_river_zoom.png", "ref_town_zoom.png")]
        boxes = ((1060, 120, 292, 708), (420, 330, 491, 358))
        cols = [("old (current)", pb), ("middle (BLUE_MIX %.2g, WIDTH %.2g)" % (BLUE_MIX, WIDTH), pv), ("reference-like", pr)]
        rows = []
        for k, (fx, fy, fw, fh) in enumerate(boxes):
            tl = [im.crop((fx, fy, fx + fw, fy + fh)).resize((int(fw * mag), int(fh * mag)), Image.LANCZOS) for _, im in cols] + [refs[k]]
            rows.append(tl)
        gap, lab = 20, 60
        Wc = max(sum(t.width for t in r) + gap * (len(r) - 1) for r in rows)
        Hc = sum(max(t.height for t in r) + lab for r in rows) + gap
        cmp_ = Image.new("RGB", (Wc, Hc), (18, 18, 18)); dr = ImageDraw.Draw(cmp_)
        try: font = ImageFont.load_default(size=40)
        except TypeError: font = ImageFont.load_default()
        names = [c[0] for c in cols] + ["owner reference"]
        y = 0
        for r in rows:
            x = 0
            for t, nm in zip(r, names):
                dr.text((x + 10, y + 8), nm, fill=(235, 235, 235), font=font); cmp_.paste(t, (x, y + lab)); x += t.width + gap
            y += max(t.height for t in r) + lab + gap
        cmp_.save(f"{HERE}/compare.jpg", quality=90)


if __name__ == "__main__":
    main()
