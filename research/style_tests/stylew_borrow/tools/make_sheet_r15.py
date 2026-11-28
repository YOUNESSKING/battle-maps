"""r15 musket burst/haze crop sheet: r14k share (left) vs the r15 m3f snapshots (right) at the same share times.
usage: python3 make_sheet_r15.py R14K.mp4 SNAPDIR OUT.jpg"""
import glob, io, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V, SD, OUT = sys.argv[1:4]; F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 24); C0 = 38.733333 - 3.26   # share = m3f scene t + C0
CR = (760, 150, 1560, 470); w, h = 800 * 3 // 2, 320 * 3 // 2
LAB = {63.52: "volley 1 +0.15 s: 5 jets, gaps", 63.77: "+0.4 s: grey starts", 63.97: "+0.6 s (critic: one bar)", 64.17: "+0.8 s: gaps held to here",
       64.37: "+1.0 s (critic: still white): grey", 64.87: "+1.5 s", 66.86: "buckshot +0.3 s", 67.3: "buckshot +0.74 s", 67.8: "67.8 s (critic: the rectangular patch)", 68.5: "68.5 s", 69.5: "69.5 s"}
snaps = sorted((float(re.search(r"at-([\d.]+)s", f).group(1)) + C0, f) for f in glob.glob(f"{SD}/frame-*-at-*s.png"))
S = Image.new("RGB", (2 * w + 30, 50 + len(snaps) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r14k (left)  |  r15 (right, local snapshot)   crop x 760-1560, y 150-470, 1.5x", font=F, fill=(250, 214, 120))
for i, (t, f) in enumerate(snaps):
    y = 50 + i * (h + 40); lab = min(LAB, key=lambda k: abs(k - t)); d.text((10, y + 6), f"{t:.2f} s  {LAB[lab]}", font=F, fill=(235, 228, 210))
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", V, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    S.paste(Image.open(io.BytesIO(png)).convert("RGB").crop(CR).resize((w, h), Image.LANCZOS), (10, y + 36))
    im = Image.open(f).convert("RGB"); k = im.size[0] / 1920; S.paste(im.crop(tuple(int(c * k) for c in CR)).resize((w, h), Image.LANCZOS), (w + 20, y + 36))
S.save(OUT, quality=88); print(OUT, S.size)
