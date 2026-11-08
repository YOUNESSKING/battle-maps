#!/usr/bin/env python3
"""Warhawk-style town label: cream classical serif, very wide tracking, gently
arced + rotated, soft dark shadow, no box. PNG renderer (PIL).

    render_label(text, size=30, ppu=2.0, font="garamond", tracking=0.62,
                 arc=10, rotate=-8, colour=(234, 226, 172))
        -> (PIL.Image RGBA, (ax, ay))

size      font size in 1080p output px (style lock: towns ~28-30)
ppu       output pixels per 1080p px (2.0 = 2x PNG)
font      "garamond" (EB Garamond 500, mixed case like the reference "Jabiyah")
          or "cinzel" (Cinzel 600, all small caps) or a .ttf path
tracking  extra space between letters, in em (reference ~0.6)
arc       total bend in degrees along the word (+ = bows upward, 0 = straight)
rotate    rotation of the whole word in degrees (+ = clockwise, image coords)
(ax, ay)  pixel position of the centre of the baseline inside the image; place
          it on the map beside the town (e.g. 0.6-0.8 town radius below/aside).
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = {
    "garamond": os.path.join(HERE, "fonts", "eb-garamond-latin-500-normal.ttf"),
    "garamond600": os.path.join(HERE, "fonts", "eb-garamond-latin-600-normal.ttf"),
    "cinzel": os.path.join(HERE, "fonts", "cinzel-latin-600-normal.ttf"),
}


def render_label(text, size=30, ppu=2.0, font="garamond", tracking=0.62, arc=10,
                 rotate=-8, colour=(234, 226, 172), shadow=(18, 16, 8), shadow_alpha=0.75):
    ss = 3  # supersample
    px = size * ppu * ss
    f = ImageFont.truetype(FONTS.get(font, font), int(round(px)))
    adv = [f.getlength(ch) for ch in text]
    gap = tracking * px
    total = sum(adv) + gap * (len(text) - 1)
    asc, desc = f.getmetrics()
    # letter centres along the baseline (x from the word centre)
    xs, x = [], -total / 2
    for a in adv:
        xs.append(x + a / 2)
        x += a + gap
    arc_r = math.radians(arc)
    R = total / arc_r if abs(arc_r) > 1e-4 else None
    rot = math.radians(rotate)
    pad = int(px * 1.2)
    W = int(total + 2 * pad)
    H = int(W * (abs(math.sin(rot)) + 0.25) + asc + desc + 2 * pad)
    W = int(W * max(1.0, abs(math.cos(rot))) + 0)
    canvas = Image.new("L", (W, H), 0)
    ox, oy = W / 2, H / 2
    for ch, xc, a in zip(text, xs, adv):
        if ch == " ":
            continue
        if R:
            phi = xc / R  # angle along the arc
            # arc > 0 bows upward (the word's ends drop), arc < 0 sags
            bx, by, tang = R * math.sin(phi), R * (1 - math.cos(phi)), phi
        else:
            bx, by, tang = xc, 0.0, 0.0
        ang = tang + rot
        # rotate baseline point by the word rotation
        X = bx * math.cos(rot) - by * math.sin(rot)
        Y = bx * math.sin(rot) + by * math.cos(rot)
        g = Image.new("L", (int(a + px), int(asc + desc + px)), 0)
        ImageDraw.Draw(g).text((px / 2, px / 2), ch, font=f, fill=255)
        # glyph baseline-centre in g
        gx, gy = px / 2 + a / 2, px / 2 + asc
        gr = g.rotate(-math.degrees(ang), resample=Image.BICUBIC, expand=True,
                      center=(gx, gy))
        # after expand the centre moves: compute where (gx, gy) lands
        cxg, cyg = g.width / 2, g.height / 2
        dx, dy = gx - cxg, gy - cyg
        ca, sa = math.cos(ang), math.sin(ang)
        rx, ry = dx * ca - dy * sa + gr.width / 2, dx * sa + dy * ca + gr.height / 2
        px0, py0 = int(round(ox + X - rx)), int(round(oy + Y - ry))
        canvas.paste(255, (px0, py0, px0 + gr.width, py0 + gr.height), gr)
    # shadow
    so = (0.9 * ppu * ss, 1.3 * ppu * ss)
    sh = canvas.filter(ImageFilter.GaussianBlur(1.3 * ppu * ss))
    shm = np.zeros((H, W))
    a_sh = np.array(sh, float) / 255
    sx, sy = int(so[0]), int(so[1])
    shm[sy:, sx:] = a_sh[:H - sy, :W - sx]
    txt = np.array(canvas, float) / 255
    shm = np.clip(shm * 1.4, 0, 1) * shadow_alpha
    out_a = txt + shm * (1 - txt)
    col = np.array(colour, float)
    shc = np.array(shadow, float)
    rgb = (col * txt[..., None] + shc * (shm * (1 - txt))[..., None]) / np.maximum(out_a, 1e-6)[..., None]
    arr = np.dstack([np.clip(rgb, 0, 255), out_a * 255]).astype(np.uint8)
    im = Image.fromarray(arr, "RGBA")
    im = im.resize((W // ss, H // ss), Image.LANCZOS)
    bb = im.getbbox()
    im = im.crop(bb)
    return im, (ox / ss - bb[0], oy / ss - bb[1])


# ----------------------------------------------------------------- round 3: carved label on a free curve
def _bez(P, t):
    """cubic (4 pts) or quadratic (3 pts) Bezier point"""
    if len(P) == 3:
        (x0, y0), (x1, y1), (x2, y2) = P
        u = 1 - t
        return (u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2)
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = P
    u = 1 - t
    return (u ** 3 * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x3,
            u ** 3 * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y3)


def _shift(a, dx, dy):
    out = np.zeros_like(a)
    H, W = a.shape
    xs, xd = (slice(0, W - dx), slice(dx, W)) if dx >= 0 else (slice(-dx, W), slice(0, W + dx))
    ys, yd = (slice(0, H - dy), slice(dy, H)) if dy >= 0 else (slice(-dy, H), slice(0, H + dy))
    out[yd, xd] = a[ys, xs]
    return out


def render_label_curve(text, curve, size=34, ppu=2.0, font="garamond600", tracking=0.34, align=0.5,
                       colour=(232, 220, 160), face_alpha=0.93, seed=1, jitter=1.0):
    """Hand-lettered, ENGRAVED town name (owner 2026-11-08: "carved into the map in an arc, natural").

    curve   3 or 4 control points (quadratic / cubic Bezier) in 1080p px, relative to the anchor (0, 0)
            (usually the town centre); the letters' baseline follows it (left -> right reading order).
    align   where the word's centre sits along the curve (0..1 of its length).
    Each letter is placed by arc length and rotated to the local tangent (+ tiny hand jitter).
    Look: translucent cream face (map texture shows through), inset bevel (dark inner edge top-left,
    faint light edge bottom-right), a tight soft dark shadow hugging the strokes, slightly worn edges.
    Returns (RGBA image, (ax, ay)) = pixel position of the curve's (0, 0) in the image."""
    from scipy import ndimage as ndi
    rng = np.random.default_rng(seed)
    ss = 3
    k = ppu * ss                       # image px per u (supersampled)
    f = ImageFont.truetype(FONTS.get(font, font), int(round(size * k)))
    adv = [f.getlength(ch) / k for ch in text]           # in u
    gap = tracking * size
    total = sum(adv) + gap * (len(text) - 1)
    # arc-length table of the curve
    N = 400
    pts = [_bez(curve, i / N) for i in range(N + 1)]
    cum = [0.0]
    for i in range(1, N + 1):
        cum.append(cum[-1] + math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    Ltot = cum[-1]

    def at(sv):
        sv = min(max(sv, 0.0), Ltot)
        j = int(np.searchsorted(cum, sv))
        j = min(max(j, 1), N)
        t0 = (sv - cum[j - 1]) / max(cum[j] - cum[j - 1], 1e-9)
        x = pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * t0
        y = pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * t0
        return x, y, math.atan2(pts[j][1] - pts[j - 1][1], pts[j][0] - pts[j - 1][0])

    s0 = align * Ltot - total / 2
    asc, desc = f.getmetrics()
    place, sv = [], s0
    for ch, a in zip(text, adv):
        x, y, ang = at(sv + a / 2)
        place.append((ch, a, x, y, ang + math.radians(rng.normal(0, 1.2 * jitter)), rng.normal(0, 0.35 * jitter)))
        sv += a + gap
    xs = [p[2] for p in place]; ys = [p[3] for p in place]
    pad = size * 1.3
    x0, y0 = min(xs) - pad, min(ys) - pad * 1.2
    W, H = int((max(xs) - x0 + pad) * k), int((max(ys) - y0 + pad * 0.9) * k)
    canvas = Image.new("L", (W, H), 0)
    for ch, a, x, y, ang, dn in place:
        if ch == " ":
            continue
        gp = int(size * k)
        g = Image.new("L", (int(a * k + 2 * gp), int(asc + desc + 2 * gp)), 0)
        ImageDraw.Draw(g).text((gp, gp), ch, font=f, fill=255)
        gx, gy = gp + a * k / 2, gp + asc          # baseline centre of the glyph in g
        gr = g.rotate(-math.degrees(ang), resample=Image.BICUBIC, expand=True, center=(gx, gy))
        dx, dy = gx - g.width / 2, gy - g.height / 2
        ca, sa = math.cos(ang), math.sin(ang)
        rx, ry = dx * ca - dy * sa + gr.width / 2, dx * sa + dy * ca + gr.height / 2
        nx, ny = -sa, ca                            # small hand-set wobble off the baseline
        px0 = int(round((x - x0 + nx * dn) * k - rx)); py0 = int(round((y - y0 + ny * dn) * k - ry))
        canvas.paste(255, (px0, py0, px0 + gr.width, py0 + gr.height), gr)
    M = np.asarray(canvas, float) / 255
    # worn edges: noise eats a little of the stroke edge
    nz = ndi.gaussian_filter(rng.standard_normal(M.shape), 0.9 * k) * 5.0
    Mb = ndi.gaussian_filter(M, 0.35 * k)
    M = np.clip((Mb - 0.42 + 0.08 * nz) * 3.0 + 0.5, 0, 1) * (Mb > 0.05)
    # inset bevel: light from the top-left, so the cut's top-left wall is in shade, bottom-right wall catches light
    o = max(1, int(round(0.55 * k)))
    inner_dark = np.clip(M - _shift(M, o, o), 0, 1)         # pixels whose top-left neighbour is outside
    inner_lite = np.clip(M - _shift(M, -o, -o), 0, 1)
    inner_dark = ndi.gaussian_filter(inner_dark, 0.3 * k)
    inner_lite = ndi.gaussian_filter(inner_lite, 0.3 * k)
    col = np.array(colour, float)
    face = col[None, None, :] * (1 + 0.05 * np.clip(nz, -2, 2)[..., None])     # a little mottling
    face = face * (1 - 0.42 * inner_dark[..., None]) + np.array([92, 82, 50]) * 0.42 * inner_dark[..., None]
    face = face * (1 - 0.35 * inner_lite[..., None]) + np.array([252, 246, 214]) * 0.35 * inner_lite[..., None]
    a_face = M * face_alpha
    # tight soft shadow hugging the strokes (outside only), slightly toward the bottom-right
    sh = ndi.gaussian_filter(_shift(M, int(0.35 * k), int(0.45 * k)), 0.7 * k)
    sh = np.clip(sh * 1.6, 0, 1) * 0.5 * (1 - M)
    out_a = a_face + sh * (1 - a_face)
    shc = np.array([24, 22, 10], float)
    rgb = (face * a_face[..., None] + shc * (sh * (1 - a_face))[..., None]) / np.maximum(out_a, 1e-6)[..., None]
    arr = np.dstack([np.clip(rgb, 0, 255), np.clip(out_a, 0, 1) * 255]).astype(np.uint8)
    im = Image.fromarray(arr, "RGBA").resize((W // ss, H // ss), Image.LANCZOS)
    bb = im.getbbox()
    im = im.crop(bb)
    return im, (-x0 * ppu - bb[0], -y0 * ppu - bb[1])


if __name__ == "__main__":
    names = sys.argv[1:] or ["Vicksburg", "Jackson", "Raymond", "Port Gibson", "Edwards"]
    for n in names:
        im, anc = render_label(n)
        fn = os.path.join(HERE, "label_" + n.lower().replace(" ", "_") + ".png")
        im.save(fn)
        print(fn, im.size, "baseline centre", tuple(round(v, 1) for v in anc))
