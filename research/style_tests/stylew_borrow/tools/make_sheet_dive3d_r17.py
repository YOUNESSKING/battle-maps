"""r17 still sheet: gm3d v6 (approved 3D film) | r17 A (v6 engine clouds, light warm grade) | r17 B (the same, toned to 2D) at matching moments
(v6 time = ours + 9.4 s), + 1:1 crops of one cloud from each.
usage: python3 make_sheet_dive3d_r17.py V6.mp4 A_DIR B_DIR OUT.jpg   (A_DIR/B_DIR: at-<t>s.png stills; 7.7 s may sit in <DIR>/hf/)"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

v6, adir, bdir, out = sys.argv[1:5]
TS = ["1.0", "4.0", "5.9", "6.3", "6.6", "7.7"]
W, H, G = 640, 360, 12
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except OSError:
    F = ImageFont.load_default()
tmp = tempfile.mkdtemp()


def v6f(t):
    p = f"{tmp}/v6_{t}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{float(t) + 9.4:.3f}", "-i", v6, "-frames:v", "1", p], check=True)
    return Image.open(p).convert("RGB")


def rf(d, t):
    n = t[:-2] if t.endswith(".0") else t
    for p in (f"{d}/at-{n}s.png", f"{d}/hf/at-{n}s.png"):
        if os.path.exists(p): return Image.open(p).convert("RGB")
    raise FileNotFoundError(f"{d} {t}")


CH = 300
sheet = Image.new("RGB", (3 * W + 4 * G, 50 + len(TS) * (H + G) + 40 + CH + G), (24, 22, 20))
d = ImageDraw.Draw(sheet)
for k, lab in enumerate(["gm3d v6 (approved, + 9.4 s)", "r17 A: v6 engine clouds + warm grade", "r17 B: v6 engine clouds toned to 2D"]):
    d.text((G + k * (W + G), 14), lab, fill=(230, 225, 210), font=F)
for i, t in enumerate(TS):
    y = 50 + i * (H + G)
    for k, im in enumerate([v6f(t), rf(adir, t), rf(bdir, t)]):
        sheet.paste(im.resize((W, H), Image.LANCZOS), (G + k * (W + G), y))
        d.text((G + k * (W + G) + 8, y + H - 32), f"{t} s" if k else f"{float(t) + 9.4:.1f} s (ours {t})", fill=(255, 255, 255), font=F)
y = 50 + len(TS) * (H + G) + 6
d.text((G, y), "1:1 crops at our 1.0 s (v6 10.4 s)", fill=(230, 225, 210), font=F)
y += 32
sheet.paste(v6f("1.0").crop((0, 300, W, 300 + CH)), (G, y))
sheet.paste(rf(adir, "1.0").crop((0, 280, W, 280 + CH)), (G + W + G, y))
sheet.paste(rf(bdir, "1.0").crop((0, 280, W, 280 + CH)), (G + 2 * (W + G), y))
sheet.save(out, quality=86)
print("wrote", out, sheet.size)
