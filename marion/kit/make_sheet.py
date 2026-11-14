"""Kit proof sheets. usage (from marion/):
  python3 kit/make_sheet.py build/sheet-kit.jpg a.png b.png c.png d.png                      labelled 2x2 sheet, 1920 px wide
  python3 kit/make_sheet.py build/sheet-kit-ref.jpg a.png b.png c.png d.png --ref 2 12      the same frames next to reference/style-reference-living-map.mp4 frames"""
import subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
a = sys.argv[1:]; ref = None
if "--ref" in a: i = a.index("--ref"); ref = a[i + 1:]; a = a[:i]
out, frames = a[0], a[1:5]
LAB = ["(a) lowcountry wide: the opening framing (Charleston - Nelson's Ferry - Camden road, red wagons, the two flags)",
       "(b) santee close, night 25 Aug 1780: Nelson's Ferry + the Great Savannah house, cypress swamp, Marion banner",
       "(c) blackriver close, 8 Nov 1780: Tarleton's Legion at Ox Swamp, Marion at Benbow's Ferry",
       "(d) the continuous zoom lowcountry -> santee (INSET) mid-way, hook (spoken: \"seventeen eighty\")"]
tiles = list(zip(frames, LAB))
if ref:
    REF = "/home/user/battle-maps/reference/style-reference-living-map.mp4"; tmp = tempfile.mkdtemp()
    for t in ref:
        p = f"{tmp}/r{t}.png"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", REF, "-frames:v", "1", p], check=True)
        tiles.append((p, f"REFERENCE style-reference-living-map.mp4 at {t} s"))
cols = 2; w = 955; h = w * 9 // 16; lab = 30; rows = (len(tiles) + 1) // 2
S = Image.new("RGB", (1920, rows * (h + lab + 10)), (16, 16, 16)); d = ImageDraw.Draw(S)
try: f = ImageFont.truetype("/home/user/battle-maps/marion/kit/fonts/eb-garamond-latin-600-normal.ttf", 19)
except Exception: f = ImageFont.load_default()
for i, (p, t) in enumerate(tiles):
    x, y = (i % cols) * (w + 10), (i // cols) * (h + lab + 10)
    d.text((x + 6, y + 4), t, fill=(235, 228, 200), font=f)
    S.paste(Image.open(p).convert("RGB").resize((w, h), Image.LANCZOS), (x, y + lab))
S.save(out, quality=90); print(out, S.size)
