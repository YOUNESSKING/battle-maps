"""python3 compose_preview.py <dir with wx_*.png from render.js> -> preview.jpg
Top: 2 rows x 3 looks, the SAME 960x540 crop of each 1080p frame at 1:1 (1080p scale). Bottom: the six full frames at 480 px wide
(feed / phone size) to check readability small."""
import os, sys
from PIL import Image, ImageDraw, ImageFont
src = sys.argv[1]
LOOKS = [("clear", "CLEAR"), ("rain", "RAIN"), ("mud", "MUD"), ("snow", "SNOW"), ("fog", "FOG"), ("rainmud", "RAIN + MUD")]
CROP = (480, 230, 1440, 770)            # Vicksburg label, Big Black creek, roads, two units, Edwards/Raymond
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf", 30)
    f2 = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf", 18)
except OSError:
    F = f2 = ImageFont.load_default()
G = 6
out = Image.new("RGB", (3 * 960 + 2 * G, 2 * 540 + G + 34 + 270 + 8), (24, 22, 18))
d = ImageDraw.Draw(out)
for i, (k, name) in enumerate(LOOKS):
    im = Image.open(os.path.join(src, f"wx_{k}.png")).convert("RGB")
    x, y = (i % 3) * (960 + G), (i // 3) * (540 + G)
    out.paste(im.crop(CROP), (x, y))
    d.rectangle([x + 14, y + 14, x + 24 + d.textlength(name, font=F), y + 54], fill=(20, 18, 12))
    d.text((x + 19, y + 17), name, font=F, fill=(240, 233, 208))
    sx, sy = i * 480 + (i and 0), 2 * 540 + G + 34
    out.paste(im.resize((480, 270), Image.LANCZOS), (sx, sy))
    d.text((sx + 8, sy + 6), name, font=f2, fill=(240, 233, 208), stroke_width=2, stroke_fill=(20, 18, 12))
d.text((10, 2 * 540 + G + 6), "480 px downscale (full frames, feed size)  |  above: same 960x540 crop at 1080p scale, t = 7 s, camera s 1.9 on vicksburg_w + 2e layers",
       font=f2, fill=(190, 182, 158))
out.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview.jpg"), quality=88)
print(out.size)
