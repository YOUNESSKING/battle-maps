#!/usr/bin/env python3
"""camps/preview.jpg: the four camp sprites on a crop of grant/assets/vicksburg_w.jpg at screen scale
(S = 1.9 screen px per map px; vicksburg_w is 2x the 2880-px map -> 0.95 screen px per jpg px), next to the
owner's reference camp (owner_ref_yarmouk.png bottom-left at 1080p scale, and the ref_camp.png zoom).
Row 2 = 3x zoom of our camp beside the reference zoom. Night panel = the map under a blue-muted K.night-like
overlay with camp_night.png and camp_night_glow.png (screen blend) on top."""
import os

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/battle-maps"
MAP = f"{ROOT}/grant/assets/vicksburg_w.jpg"
REF_FULL = f"{ROOT}/research/style_tests/roads_towns/owner_ref_yarmouk.png"
REF_ZOOM = f"{ROOT}/research/style_tests/banners_units_camps/ref_camp.png"
FONT = f"{ROOT}/research/style_tests/roads_towns/towns/fonts/eb-garamond-latin-600-normal.ttf"
SCREEN_PER_JPG = 0.95
SPRITE_PPU = 2.0                     # sprite px per screen px


def load(name):
    return Image.open(os.path.join(HERE, name)).convert("RGBA")


def at_screen(im):
    k = 1 / SPRITE_PPU
    return im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)


def place(canvas, im, xy):
    canvas.alpha_composite(im, (int(xy[0] - im.width / 2), int(xy[1] - im.height / 2)))


def map_crop(x0, y0, w, h):
    m = Image.open(MAP).convert("RGBA")
    c = m.crop((x0, y0, x0 + round(w / SCREEN_PER_JPG), y0 + round(h / SCREEN_PER_JPG)))
    return c.resize((w, h), Image.LANCZOS)


font = ImageFont.truetype(FONT, 26)
small = ImageFont.truetype(FONT, 20)

# --- panel A: reference frame bottom-left, scaled to 1080p (phone grab 1125 px wide ~ 1920 px video width)
ref = Image.open(REF_FULL).convert("RGBA")
k = 1920 / 1125 * 0.62               # the grab is a portrait crop of the video: ~0.62 of the 16:9 width shown
refA = ref.crop((0, 1880, 380, 2200))
refA = refA.resize((round(refA.width * k * 1.4), round(refA.height * k * 1.4)), Image.LANCZOS)

# --- panel B: day map with the three day sprites at screen scale
W, H = 1180, 640
day = map_crop(3020, 2330, W, H)
camp, wag, dep = at_screen(load("camp_union.png")), at_screen(load("wagon_park.png")), at_screen(load("supply_depot.png"))
place(day, camp, (250, 330))
place(day, wag, (640, 420))
place(day, dep, (980, 230))

# --- panel C: night
night_bg = map_crop(1700, 2500, 560, 420)
arr = np.array(night_bg).astype(float)
lum = arr[..., :3].mean(axis=2, keepdims=True)
arr[..., :3] = (arr[..., :3] * 0.45 + lum * 0.25) * np.array([0.78, 0.86, 1.08])
night_bg = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
cn = at_screen(load("camp_night.png"))
place(night_bg, cn, (280, 210))
glow = at_screen(load("camp_night_glow.png"))
gl = Image.new("RGBA", night_bg.size, (0, 0, 0, 0))
place(gl, glow, (280, 210))
g = np.array(gl).astype(float)
glow_rgb = Image.fromarray((g[..., :3] * g[..., 3:4] / 255).astype(np.uint8), "RGB")
night_bg = Image.merge("RGBA", (*ImageChops.screen(night_bg.convert("RGB"), glow_rgb).split(), Image.new("L", night_bg.size, 255)))

# --- row 2: 3x zoom of our camp on the map vs the reference zoom
Z = 3
zbg = map_crop(3020 + 40, 2330 + 160, 300, 200)
zoom_src = zbg.copy()
place(zoom_src, at_screen(load("camp_union.png")), (210, 170))
zoom = zoom_src.crop((60, 70, 300, 230)).resize((240 * Z, 160 * Z), Image.LANCZOS)
refz = Image.open(REF_ZOOM).convert("RGBA").resize((720, 480), Image.LANCZOS)
dz_src = map_crop(3020 + 600, 2330 + 250, 300, 200)
place(dz_src, at_screen(load("wagon_park.png")), (150, 120))
dzoom = dz_src.crop((40, 40, 280, 200)).resize((240 * Z, 160 * Z), Image.LANCZOS)

pad = 20
sheet_w = refA.width + W + 3 * pad
row1_h = max(refA.height, H)
row2_h = 480
sheet_h = 60 + row1_h + 60 + row2_h + 60 + 420 + pad
sheet = Image.new("RGBA", (max(sheet_w, 3 * 720 + 4 * pad), sheet_h), (24, 24, 22, 255))
d = ImageDraw.Draw(sheet)
y = 15
d.text((pad, y), "REFERENCE (Yarmouk frame, ~1080p scale)", font=font, fill=(235, 225, 190))
d.text((2 * pad + refA.width, y), "OURS at screen scale (S 1.9): camp_union | wagon_park | supply_depot (Stars and Bars, Apr 1863)", font=font, fill=(235, 225, 190))
y = 60
sheet.alpha_composite(refA, (pad, y))
sheet.alpha_composite(day, (2 * pad + refA.width, y))
y += row1_h + 15
d.text((pad, y), "3x zoom: reference camp", font=font, fill=(235, 225, 190))
d.text((2 * pad + 720, y), "3x zoom: camp_union", font=font, fill=(235, 225, 190))
d.text((3 * pad + 1440, y), "3x zoom: wagon_park", font=font, fill=(235, 225, 190))
y += 45
sheet.alpha_composite(refz, (pad, y))
sheet.alpha_composite(zoom, (2 * pad + 720, y))
sheet.alpha_composite(dzoom, (3 * pad + 1440, y))
y += row2_h + 15
d.text((pad, y), "camp_night on a K.night-style map (sprite + camp_night_glow.png screen-blended above the night overlay)", font=font, fill=(235, 225, 190))
y += 45
sheet.alpha_composite(night_bg, (pad, y))
nz = night_bg.crop((140, 90, 420, 330)).resize((280 * 2, 240 * 2), Image.LANCZOS) if False else None
sheet.convert("RGB").save(os.path.join(HERE, "preview.jpg"), quality=90)
print("preview", sheet.size)
