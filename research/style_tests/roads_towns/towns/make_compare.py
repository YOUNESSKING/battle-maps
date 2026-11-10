#!/usr/bin/env python3
"""towns/compare.jpg: reference town vs our towns at the same on-screen scale.

Row 1 (3x zoom, the scale of ref_town_zoom.png): reference | Vicksburg on the
Mississippi (real river from vicksburg_w.jpg, cut through the patch) | Raymond.
Row 2 (1080p / phone size): the reference frame strip | the same map at 1:1.
vicksburg_w.jpg is 5760 px wide = 3 map px per 1080p px.
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from label import render_label
from make_town import map_to_local, render_town, CAMPAIGN

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "..")
MAP = "/home/user/battle-maps/grant/assets/vicksburg_w.jpg"
MAP_PPU = 3.0

base = Image.open(MAP).convert("RGB")
arr = np.array(base).astype(int)
blue = (arr[..., 2] > arr[..., 1] + 25) & (arr[..., 2] > arr[..., 0] + 60)


def river_line(y0, y1, x_lo, x_hi, step=40):
    pts = []
    for y in range(y0, y1 + 1, step):
        xs = np.where(blue[y, x_lo:x_hi])[0]
        if len(xs):
            pts.append((float(np.median(xs) + x_lo), float(y)))
    return pts


def place(canvas, im, centre, at, k):
    """Paste RGBA `im` (whose anchor is `centre`) scaled by k with anchor at `at`."""
    if k != 1:
        im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    canvas.alpha_composite(im, (int(round(at[0] - centre[0] * k)), int(round(at[1] - centre[1] * k))))


def scene(scale):
    """Map window (native map px) with towns + labels; scale 1 = native (3x), 1/3 = 1080p."""
    x0, y0, W, H = 2040, 1640, 1800, 1000
    win = base.crop((x0, y0, x0 + W, y0 + H)).convert("RGBA")
    # Vicksburg: east bank of the Mississippi
    vc = (2680, 2020)
    riv = river_line(1820, 2640, 1900, 2620)
    vk = dict(CAMPAIGN["vicksburg"][2])
    vk["river"] = map_to_local(riv, vc, MAP_PPU)
    vk["river_width"] = 7.0
    vk["grid"] = -57
    vk["roads"] = [0, -35, 55, 120]
    v, c = render_town(1863, "city", ppu=MAP_PPU, **vk)
    place(win, v, c, (vc[0] - x0, vc[1] - y0), 1)
    lab, a = render_label("Vicksburg", ppu=MAP_PPU, rotate=-6, arc=9)
    place(win, lab, a, (vc[0] - x0 + 20, vc[1] - y0 + 128 * MAP_PPU), 1)
    # a village further east
    rc = (3330, 1880)
    r, c = render_town(*CAMPAIGN["raymond"][:2], ppu=MAP_PPU, **CAMPAIGN["raymond"][2])
    place(win, r, c, (rc[0] - x0, rc[1] - y0), 1)
    lab, a = render_label("Raymond", ppu=MAP_PPU, rotate=-5, arc=8)
    place(win, lab, a, (rc[0] - x0 + 10 * MAP_PPU, rc[1] - y0 + 74 * MAP_PPU), 1)
    if scale != 1:
        win = win.resize((round(W * scale), round(H * scale)), Image.LANCZOS)
    return win


def main():
    ref = Image.open(os.path.join(REF, "ref_town_zoom.png")).convert("RGBA")  # ~3x zoom
    big = scene(1.0)
    H1 = ref.height
    k = H1 / big.height
    big_r = big.resize((round(big.width * k), H1), Image.LANCZOS)
    full = Image.open(os.path.join(REF, "owner_ref_yarmouk.png")).convert("RGBA")
    strip = full.crop((0, 0, 1125, 620))  # reference at phone/1080p scale
    small = scene(1 / 3)
    gap = 24
    Wt = ref.width + gap + big_r.width
    Ht = H1 + gap + 620 + 70
    out = Image.new("RGBA", (Wt, Ht), (24, 24, 22, 255))
    out.alpha_composite(ref, (0, 0))
    out.alpha_composite(big_r, (ref.width + gap, 0))
    out.alpha_composite(strip, (0, H1 + gap))
    out.alpha_composite(small.crop((0, 0, min(small.width, Wt - 1125 - gap), 620)) if small.height >= 620
                        else small, (1125 + gap, H1 + gap))
    d = ImageDraw.Draw(out)
    try:
        f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)
    except OSError:
        f = None
    d.text((12, Ht - 50), "left: reference (zoom ~3x, and phone frame)   right: generated towns on vicksburg_w.jpg "
           "(top: same ~3x zoom as the reference crop; bottom: 1080p size)", fill=(220, 215, 190), font=f)
    out.convert("RGB").save(os.path.join(HERE, "compare.jpg"), quality=90)
    big.convert("RGB").save(os.path.join(HERE, "compare_zoom3x.jpg"), quality=92)
    print("ok", out.size)


if __name__ == "__main__":
    main()
