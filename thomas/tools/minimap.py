"""Locator minimap for B.minimap(): a wider basemap with a red frame around the battlefield basemap and a named town.

usage: python3 tools/minimap.py BATTLE_BASEMAP WIDE_BASEMAP [TOWN LAT LON]  -> assets/media/BATTLE_BASEMAP_minimap.jpg (576x324)
example: python3 tools/minimap.py chick chatt CHATTANOOGA 35.046 -85.310
"""
import json, math, os, sys
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
small, big = sys.argv[1], sys.argv[2]
S, Bg = json.load(open(f"{ROOT}/assets/{small}.json")), json.load(open(f"{ROOT}/assets/{big}.json"))
f = 2 ** (S["zoom"] - Bg["zoom"]); bx, by = Bg["origin_world_px"]; sx, sy = S["origin_world_px"]
x0, y0, w, h = sx / f - bx, sy / f - by, 2880 / f, 1620 / f
im = Image.open(f"{ROOT}/assets/{big}.jpg").convert("RGB"); d = ImageDraw.Draw(im)
fnt = ImageFont.truetype(f"{ROOT}/tools/oswald-latin-700-normal.ttf", 78)
d.rectangle((x0, y0, x0 + w, y0 + h), outline=(196, 18, 31), width=14)
d.text((x0, y0 + h + 10), "BATTLEFIELD", font=fnt, fill=(196, 18, 31))
if len(sys.argv) > 5:
    name, lat, lon = sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
    n = 256 * 2 ** Bg["zoom"]
    cx = (lon + 180) / 360 * n - bx; cy = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - by
    d.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(30, 30, 30)); d.text((cx + 36, cy - 50), name, font=fnt, fill=(30, 26, 20))
os.makedirs(f"{ROOT}/assets/media", exist_ok=True)
im.resize((576, 324), Image.LANCZOS).save(f"{ROOT}/assets/media/{small}_minimap.jpg", quality=90)
print("wrote", f"assets/media/{small}_minimap.jpg")
