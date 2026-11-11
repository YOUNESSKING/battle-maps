"""Contact sheet: kit test frames next to the reference clip. usage: python3 kit/make_sheet.py OUT.jpg A.png B.png [ref_t1 ref_t2]"""
import subprocess, sys, tempfile, os
from PIL import Image, ImageDraw, ImageFont
out, a, b = sys.argv[1:4]; ts = sys.argv[4:6] or ["2", "12"]
REF = "/home/user/battle-maps/reference/style-reference-living-map.mp4"
tmp = tempfile.mkdtemp()
refs = []
for t in ts:
    p = f"{tmp}/r{t}.png"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", REF, "-frames:v", "1", p], check=True); refs.append(p)
tiles = [(a, "KIT (a) east wide"), (b, "KIT (b) yorktown close, dusk"), (refs[0], f"REFERENCE living-map {ts[0]} s"), (refs[1], f"REFERENCE living-map {ts[1]} s")]
w, h, lab = 960, 540, 34
S = Image.new("RGB", (2 * w + 10, 2 * (h + lab) + 10), (16, 16, 16)); d = ImageDraw.Draw(S)
try: f = ImageFont.truetype("/home/user/battle-maps/yorktown/kit/fonts/eb-garamond-latin-600-normal.ttf", 24)
except Exception: f = ImageFont.load_default()
for i, (p, t) in enumerate(tiles):
    x, y = (i % 2) * (w + 10), (i // 2) * (h + lab + 10)
    d.text((x + 8, y + 4), t, fill=(235, 228, 200), font=f)
    S.paste(Image.open(p).convert("RGB").resize((w, h), Image.LANCZOS), (x, y + lab))
S.save(out, quality=90); print(out)
