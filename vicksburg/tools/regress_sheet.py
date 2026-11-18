"""Side-by-side regression sheet: original clip stills | engine scene stills (+ mean abs diff per frame, 0-255 over RGB).
usage: python3 vicksburg/tools/regress_sheet.py <orig snapshot dir> <engine snapshot dir> <out.jpg>
Both dirs hold `hyperframes snapshot --at` stills named frame-NN-at-<t>s.png."""
import glob, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

a_dir, b_dir, out = sys.argv[1:4]
tof = lambda f: float(re.search(r"at-([\d.]+)s", f).group(1))
A = {tof(f): f for f in glob.glob(f"{a_dir}/frame-*-at-*s.png")}
B = {tof(f): f for f in glob.glob(f"{b_dir}/frame-*-at-*s.png")}
ts = sorted(set(A) & set(B))
W, H = 640, 360
sheet = Image.new("RGB", (W * 3 + 40, (H + 30) * len(ts) + 40), (18, 18, 18))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except OSError:
    font = ImageFont.load_default()
d.text((10, 8), "v8 clip (original)", fill=(230, 230, 230), font=font); d.text((W + 20, 8), "engine scene test_v8", fill=(230, 230, 230), font=font)
d.text((2 * W + 30, 8), "|diff| x4", fill=(230, 230, 230), font=font)
rows = []
for k, t in enumerate(ts):
    a = np.asarray(Image.open(A[t]).convert("RGB")).astype(np.float32); b = np.asarray(Image.open(B[t]).convert("RGB")).astype(np.float32)
    diff = np.abs(a - b); mad = diff.mean(); p99 = np.percentile(diff.max(2), 99); share = (diff.max(2) > 24).mean() * 100
    rows.append((t, mad, p99, share))
    y = 40 + k * (H + 30)
    for j, im in enumerate([a, b, np.clip(diff * 4, 0, 255)]):
        sheet.paste(Image.fromarray(im.astype(np.uint8)).resize((W, H), Image.LANCZOS), (10 + j * (W + 10), y))
    d.text((10, y + H + 4), f"t = {t:g} s   mean |diff| = {mad:.2f}   p99 = {p99:.0f}   px > 24: {share:.2f} %", fill=(240, 220, 160), font=font)
sheet.save(out, quality=86)
print("t  mean|diff|  p99  share>24%")
for t, mad, p99, share in rows:
    print(f"{t:5g}  {mad:6.2f}  {p99:5.0f}  {share:6.2f}")
