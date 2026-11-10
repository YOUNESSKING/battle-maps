#!/usr/bin/env python3
"""frames/f_*.png (render_preview.js) -> preview.jpg (2x2 of the 1080p frames), preview_480.jpg (the four
frames at 480 px wide, feed-size check), river_labels.jpg (Mississippi + Big Black labels, 1:1 and 2x)."""
import glob, os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
fs = sorted(glob.glob(os.path.join(HERE, "frames", "f_*.png")), key=lambda p: float(os.path.basename(p)[2:-4]))
ims = [Image.open(p).convert("RGB") for p in fs]
cap = ["morning + Mississippi label", "afternoon + Big Black label", "dusk + Pearl label", "night"]
g = Image.new("RGB", (3840, 2160))
for i, im in enumerate(ims[:4]):
    g.paste(im, ((i % 2) * 1920, (i // 2) * 1080))
    ImageDraw.Draw(g).text(((i % 2) * 1920 + 24, (i // 2) * 1080 + 1040), cap[i], fill=(255, 255, 255))
g.save(os.path.join(HERE, "preview.jpg"), quality=88)
s = Image.new("RGB", (480 * len(ims) + 8 * (len(ims) - 1), 270), (20, 20, 20))
for i, im in enumerate(ims):
    s.paste(im.resize((480, 270), Image.LANCZOS), (i * 488, 0))
s.save(os.path.join(HERE, "preview_480.jpg"), quality=90)
f = Image.open(os.path.join(HERE, "frames", "f_4.0.png")).convert("RGB")
crops = [f.crop((560, 0, 1010, 330)), f.crop((1140, 90, 1500, 350))]
W = sum(c.width for c in crops) + 20
top = Image.new("RGB", (W, max(c.height for c in crops)), (20, 20, 20)); x = 0
for c in crops: top.paste(c, (x, 0)); x += c.width + 20
z = [c.resize((c.width * 2, c.height * 2), Image.LANCZOS) for c in crops]
out = Image.new("RGB", (max(W, sum(c.width for c in z) + 20), top.height + 20 + max(c.height for c in z)), (20, 20, 20))
out.paste(top, (0, 0)); x = 0
for c in z: out.paste(c, (x, top.height + 20)); x += c.width + 20
out.save(os.path.join(HERE, "river_labels.jpg"), quality=92)
print("ok", [os.path.basename(p) for p in fs])
