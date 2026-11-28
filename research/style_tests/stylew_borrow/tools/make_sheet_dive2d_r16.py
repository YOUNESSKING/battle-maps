"""r16 still sheet: r15 (3D-engine clouds, left) | r16 painted 2D clouds (right) at 1.0 / 4.0 / 6.6 / 7.6 s + a 1:1 crop of one painted cloud.
usage: python3 make_sheet_dive2d_r16.py R15_SHARE.mp4 SNAPDIR OUT.jpg CROP_T CROP_X CROP_Y [CROP_W CROP_H]
SNAPDIR holds the r16 stills at-<t>s.png (hyperframes snapshot --keep)."""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

r15, snap, out = sys.argv[1:4]
ct, cx, cy = sys.argv[4], int(sys.argv[5]), int(sys.argv[6])
cw, ch = (int(sys.argv[7]), int(sys.argv[8])) if len(sys.argv) > 8 else (720, 405)
TS = os.environ.get("TS", "1.0,4.0,6.6,7.6").split(",")   # r16b: 7.7 (the local renderer crashes at 7.6, the r15 build too)
W, H = 960, 540
try:
    F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
except OSError:
    F = ImageFont.load_default()
tmp = tempfile.mkdtemp()


def r15f(t):
    p = f"{tmp}/r15_{t}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", r15, "-frames:v", "1", p], check=True)
    return Image.open(p).convert("RGB")


def r16f(t):
    n = t[:-2] if t.endswith(".0") else t
    return Image.open(f"{snap}/at-{n}s.png").convert("RGB")


rows = len(TS)
sheet = Image.new("RGB", (2 * W + 30, 60 + rows * (H + 10) + 70 + ch), (24, 22, 20))
d = ImageDraw.Draw(sheet)
d.text((10, 16), os.environ.get("LEFT", "r15 (3D engine clouds)"), fill=(230, 225, 210), font=F)
d.text((W + 30, 16), os.environ.get("RIGHT", "r16 painted 2D clouds"), fill=(230, 225, 210), font=F)
for i, t in enumerate(TS):
    y = 60 + i * (H + 10)
    sheet.paste(r15f(t).resize((W, H), Image.LANCZOS), (0, y))
    sheet.paste(r16f(t).resize((W, H), Image.LANCZOS), (W + 30, y))
    d.text((12, y + H - 40), f"{t} s", fill=(255, 255, 255), font=F)
    d.text((W + 42, y + H - 40), f"{t} s", fill=(255, 255, 255), font=F)
y = 60 + rows * (H + 10) + 10
if not os.environ.get("WIPE"): d.text((10, y + 10), f"r16 1:1 crop at {ct} s ({cx},{cy} {cw}x{ch})", fill=(230, 225, 210), font=F)
crop = r16f(ct).crop((cx, cy, cx + cw, cy + ch))
sheet.paste(crop, (W + 30, y + 50))
X = os.environ.get("WIPE")   # optional: the painted wipe at the swap (r16 only), left of the crop
if X:
    xs = X.split(","); k = len(xs); ww = (W - 20 - 10 * (k - 1)) // k; hh = ww * 9 // 16
    for j, f in enumerate(xs):   # r16b: the bank closing + the wipe parting, side by side
        sheet.paste(Image.open(f).convert("RGB").resize((ww, hh), Image.LANCZOS), (10 + j * (ww + 10), y + 50))
    d.text((10, y + 10), "r16b: " + " | ".join(os.path.basename(f).replace(".png", "").replace("_at-", " ") for f in xs), fill=(230, 225, 210), font=F)
    d.text((W + 30, y + 10), f"1:1 crop at {ct} s", fill=(230, 225, 210), font=F)
sheet = sheet.crop((0, 0, sheet.width, y + 60 + ch))
sheet.save(out, quality=88)
print("wrote", out, sheet.size)
