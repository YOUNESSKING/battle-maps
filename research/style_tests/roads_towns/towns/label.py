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


if __name__ == "__main__":
    names = sys.argv[1:] or ["Vicksburg", "Jackson", "Raymond", "Port Gibson", "Edwards"]
    for n in names:
        im, anc = render_label(n)
        fn = os.path.join(HERE, "label_" + n.lower().replace(" ", "_") + ".png")
        im.save(fn)
        print(fn, im.size, "baseline centre", tuple(round(v, 1) for v in anc))
