"""r16c still sheet: r15 (3D engine clouds) | r16b (soft fog, cut from sheet_dive2d_r16b.jpg) | r16c (illustrated-map lobed clouds)
at 1.0 / 4.0 / 6.6 / 7.7 s, + a bottom row: the r16c bank at 6.85 s, the wipe parting at 7.2 s and a 1:1 crop of the clouds at 1.0 s.
usage: python3 make_sheet_dive2d_r16c.py R15_SHARE.mp4 SHEET_R16B.jpg R16C_DIR OUT.jpg   (R16C_DIR: at-<t>s.png stills)"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

r15, r16b_sheet, cdir, out = sys.argv[1:5]
TS = ["1.0", "4.0", "6.6", "7.7"]
W, H, G = 640, 360, 12
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except OSError:
    F = ImageFont.load_default()
tmp = tempfile.mkdtemp()
SB = Image.open(r16b_sheet).convert("RGB")   # r16b sheet: rows at y = 60 + i * 550, its r16b column at x = 990 (960 x 540)


def r15f(t):
    p = f"{tmp}/r15_{t}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", r15, "-frames:v", "1", p], check=True)
    return Image.open(p).convert("RGB")


def cf(t):
    n = t[:-2] if t.endswith(".0") else t
    return Image.open(f"{cdir}/at-{n}s.png").convert("RGB")


sheet = Image.new("RGB", (3 * W + 4 * G, 50 + 4 * (H + G) + 40 + H + G), (24, 22, 20))
d = ImageDraw.Draw(sheet)
for k, lab in enumerate(["r15 (3D engine clouds)", "r16b (soft fog)", "r16c (illustrated-map clouds)"]):
    d.text((G + k * (W + G), 14), lab, fill=(230, 225, 210), font=F)
for i, t in enumerate(TS):
    y = 50 + i * (H + G)
    b = SB.crop((990, 60 + i * 550, 990 + 960, 60 + i * 550 + 540))
    for k, im in enumerate([r15f(t), b, cf(t)]):
        sheet.paste(im.resize((W, H), Image.LANCZOS), (G + k * (W + G), y))
        if k != 1: d.text((G + k * (W + G) + 8, y + H - 32), f"{t} s", fill=(255, 255, 255), font=F)   # r16b panels carry their own label
y = 50 + 4 * (H + G) + 10
d.text((G, y), "r16c bank 6.85 s", fill=(230, 225, 210), font=F)
d.text((G + W + G, y), "r16c wipe parting 7.2 s", fill=(230, 225, 210), font=F)
d.text((G + 2 * (W + G), y), "r16c 1:1 crop at 1.0 s", fill=(230, 225, 210), font=F)
y += 32
sheet.paste(cf("6.85").resize((W, H), Image.LANCZOS), (G, y))
sheet.paste(cf("7.2").resize((W, H), Image.LANCZOS), (G + W + G, y))
sheet.paste(cf("1.0").crop((80, 140, 80 + W, 140 + H)), (G + 2 * (W + G), y))
sheet = sheet.crop((0, 0, sheet.width, y + H + G))
sheet.save(out, quality=88)
print("wrote", out, sheet.size)
