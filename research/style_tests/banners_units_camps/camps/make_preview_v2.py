#!/usr/bin/env python3
"""camps/preview_v2.jpg: per kind, at the same screen scale on a vicksburg_w crop (S = 1.9 screen px per map px):
reference camp | v1 (*_v1.png) | v2 (current *.png), then a 3x zoom of each. Night rows use a K.night-like tint
with the *_glow.png layer screen-blended on top. Reference 1x = owner_ref_yarmouk bottom-left at ~1080p scale
(estimated x1.2 of the phone grab); reference 3x = ref_camp.png."""
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/battle-maps"
MAP = f"{ROOT}/grant/assets/vicksburg_w.jpg"
REF_FULL = f"{ROOT}/research/style_tests/roads_towns/owner_ref_yarmouk.png"
REF_ZOOM = f"{ROOT}/research/style_tests/banners_units_camps/ref_camp.png"
FONT = f"{ROOT}/research/style_tests/roads_towns/towns/fonts/eb-garamond-latin-600-normal.ttf"
SCREEN_PER_JPG, SPRITE_PPU = 0.95, 2.0
PW, PH = 400, 266           # 1x panel (screen px)
Z = 3                       # zoom panels = central (PW/Z x PH/Z) * 3 = 400 x 266 -> shown at 600 x 400
ZW, ZH = 600, 400
BASEMAP = Image.open(MAP).convert("RGBA")


def load(n):
    return Image.open(os.path.join(HERE, n)).convert("RGBA")


def map_panel(x0, y0, night=False):
    c = BASEMAP.crop((x0, y0, x0 + round(PW / SCREEN_PER_JPG), y0 + round(PH / SCREEN_PER_JPG))).resize((PW, PH), Image.LANCZOS)
    if night:
        a = np.array(c).astype(float)
        lum = a[..., :3].mean(axis=2, keepdims=True)
        a[..., :3] = (a[..., :3] * 0.45 + lum * 0.25) * np.array([0.78, 0.86, 1.08])
        c = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
    return c


def sprite_on(panel, name, glow=None):
    p = panel.copy()
    im = load(name)
    im = im.resize((round(im.width / SPRITE_PPU), round(im.height / SPRITE_PPU)), Image.LANCZOS)
    p.alpha_composite(im, ((PW - im.width) // 2, (PH - im.height) // 2))
    if glow and os.path.exists(os.path.join(HERE, glow)):
        g = load(glow)
        g = g.resize((round(g.width / SPRITE_PPU), round(g.height / SPRITE_PPU)), Image.LANCZOS)
        gl = Image.new("RGBA", p.size, (0, 0, 0, 0))
        gl.alpha_composite(g, ((PW - g.width) // 2, (PH - g.height) // 2))
        ga = np.array(gl).astype(float)
        rgb = Image.fromarray((ga[..., :3] * ga[..., 3:4] / 255).astype(np.uint8), "RGB")
        p = ImageChops.screen(p.convert("RGB"), rgb).convert("RGBA")
    return p


def zoom(panel):
    w, h = PW // Z, PH // Z
    x0, y0 = (PW - w) // 2, (PH - h) // 2
    return panel.crop((x0, y0, x0 + w, y0 + h)).resize((ZW, ZH), Image.LANCZOS)


ref = Image.open(REF_FULL).convert("RGBA")
k = 1.2
src = ref.crop((0, 2095 - round(PH / k / 2), round(PW / k), 2095 + round(PH / k / 2)))
ref1 = Image.new("RGBA", (PW, PH), (24, 24, 22, 255))
r = src.resize((PW, PH), Image.LANCZOS)
ref1.alpha_composite(r)
refz = Image.open(REF_ZOOM).convert("RGBA").resize((ZW, ZH), Image.LANCZOS)

KINDS = [("camp", "camp_union", (3080, 2420), False), ("wagon_park", "wagon_park", (3500, 2600), False),
         ("supply_depot", "supply_depot", (3150, 2750), False), ("camp at night", "camp_night", (3550, 2380), True)]
font = ImageFont.truetype(FONT, 26)
pad, head = 20, 44
row_h = head + PH + pad + ZH + pad
sheet = Image.new("RGBA", (3 * ZW + 4 * pad, len(KINDS) * row_h + pad), (24, 24, 22, 255))
d = ImageDraw.Draw(sheet)
for i, (label, name, (mx, my), night) in enumerate(KINDS):
    y = pad + i * row_h
    bg = map_panel(mx, my, night)
    glow = f"{name}_glow.png" if night else None
    glow1 = f"{name}_glow_v1.png" if night else None
    v1 = sprite_on(bg, f"{name}_v1.png", glow1)
    v2 = sprite_on(bg, f"{name}.png", glow)
    cols = [("reference camp", ref1, refz), ("v1", v1, zoom(v1)), ("v2 (new)", v2, zoom(v2))]
    for j, (t, p1, pz) in enumerate(cols):
        x = pad + j * (ZW + pad)
        d.text((x, y), f"{label}: {t}  (1x screen scale | 3x)", font=font, fill=(235, 225, 190))
        sheet.alpha_composite(p1, (x + (ZW - PW) // 2, y + head))
        sheet.alpha_composite(pz, (x, y + head + PH + pad))
sheet.convert("RGB").save(os.path.join(HERE, "preview_v2.jpg"), quality=88)
print("preview_v2", sheet.size)
