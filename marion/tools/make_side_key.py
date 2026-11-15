"""Side colour key (owner 2026-11-15: "show which colours belong to whom on the map").
Draws build/side_key.png: a small plate in the date-plate style (warm charcoal, gold hairline, gold left bar, ivory Cinzel caps)
with a blue unit box = AMERICANS and a red unit box = BRITISH & LOYALISTS. assemble_full.py overlays it bottom-left on map stretches."""
from PIL import Image, ImageDraw, ImageFont
import os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."); os.chdir(ROOT)
F = ImageFont.truetype("tools/cinzel-600.ttf", 30)
rows = [((31, 79, 196), "AMERICANS"), ((196, 18, 31), "BRITISH & LOYALISTS")]
pad, box, gap, rh = 26, (46, 30), 18, 50
tw = max(F.getbbox(t)[2] for _, t in rows)
W, H = 5 + pad + box[0] + gap + tw + pad + 6, pad + rh * len(rows) - 6 + pad - 10
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
d.rectangle([0, 0, W - 1, H - 1], fill=(21, 17, 12, 217), outline=(200, 168, 106, 140), width=1)
d.rectangle([0, 0, 4, H - 1], fill=(200, 168, 106, 255))
for i, (col, txt) in enumerate(rows):
    y = pad - 4 + i * rh; x = 5 + pad
    d.rectangle([x, y, x + box[0], y + box[1]], fill=col + (255,), outline=(245, 240, 228, 255), width=2)
    d.line([x + 4, y + box[1] - 4, x + box[0] - 4, y + 4], fill=(245, 240, 228, 255), width=3)   # cavalry slash = Marion's mounted men / the Legion
    d.text((x + box[0] + gap, y + box[1] / 2), txt, font=F, fill=(239, 227, 200, 255), anchor="lm")
im.save("build/side_key.png"); print("build/side_key.png", im.size)
