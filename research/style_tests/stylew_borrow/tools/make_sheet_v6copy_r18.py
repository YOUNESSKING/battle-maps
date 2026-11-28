"""r18 still sheet: gm3d v6 (approved) | r18 (the v6 opening copied, our ground / target / overlays) at matching moments (our t -> v6 time
tv = (t - TB) / TA, the r18 retime), + the hand-off: r18 3D landed frame | our 2D Style W frame it crossfades into.
usage: python3 make_sheet_v6copy_r18.py V6.mp4 R15_SHARE.mp4 R18_DIR OUT.jpg   (R18_DIR: at-<t>s.png stills, 1280x720)"""
import subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
v6, r15, rdir, out = sys.argv[1:5]
TA = 1.4 / 3.35; TB = 7.0 - TA * 16.4
TS = ["1.0", "4.0", "5.9", "6.3", "6.6", "7.0", "7.6"]
W, H, G = 640, 360, 12
try: F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 21)
except OSError: F = ImageFont.load_default()
tmp = tempfile.mkdtemp()
def grab(src, t, tag):
    p = f"{tmp}/{tag}_{t:.3f}.png"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", src, "-frames:v", "1", p], check=True); return Image.open(p).convert("RGB")
def rf(t): n = t[:-2] if t.endswith(".0") else t; return Image.open(f"{rdir}/at-{n}s.png").convert("RGB")
rows = len(TS) + 1
sheet = Image.new("RGB", (2 * W + 3 * G, 46 + rows * (H + G + 30)), (24, 22, 20)); d = ImageDraw.Draw(sheet)
d.text((G, 12), "gm3d v6 (approved), at the mapped v6 time", fill=(230, 225, 210), font=F); d.text((2 * G + W, 12), "r18: v6 opening copied (our map, Nelson's Ferry)", fill=(230, 225, 210), font=F)
y = 46
for t in TS:
    tv = (float(t) - TB) / TA
    sheet.paste(grab(v6, tv, "v6").resize((W, H), Image.LANCZOS), (G, y)); sheet.paste(rf(t).resize((W, H), Image.LANCZOS), (2 * G + W, y))
    d.text((G, y + H + 4), f"v6 {tv:.2f} s", fill=(230, 225, 210), font=F); d.text((2 * G + W, y + H + 4), f"r18 {t} s (ours)", fill=(230, 225, 210), font=F)
    y += H + G + 30
sheet.paste(rf("8.4").resize((W, H), Image.LANCZOS), (G, y)); sheet.paste(grab(r15, 8.5, "r15").resize((W, H), Image.LANCZOS), (2 * G + W, y))
d.text((G, y + H + 4), "hand-off: r18 3D landed 8.4 s", fill=(230, 225, 210), font=F); d.text((2 * G + W, y + H + 4), "-> our 2D Style W at 8.5 s (r15 frames)", fill=(230, 225, 210), font=F)
sheet.save(out, quality=86); print("wrote", out, sheet.size)
