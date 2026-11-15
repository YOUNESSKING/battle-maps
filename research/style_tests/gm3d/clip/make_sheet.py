"""contact_sheet.jpg (12 frames of the clip) + compare_gm.jpg (6 of our frames next to 6 matching Grand Maneuver frames; local only,
git-ignored, never commit it: GM frames are read in place from /home/user/gm_ref/f2s). usage: python3 make_sheet.py CLIP.mp4"""
import os, subprocess, sys, io
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); V = sys.argv[1]
def frame(t, w=640):
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", V, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True, check=True).stdout
    im = Image.open(io.BytesIO(b)).convert("RGB"); return im.resize((w, int(w * im.height / im.width)), Image.LANCZOS)
def tag(im, s):
    d = ImageDraw.Draw(im); d.rectangle([0, 0, 9 * len(s) + 12, 22], fill=(0, 0, 0)); d.text((6, 5), s, fill=(255, 255, 255)); return im
TS = [1.5, 9.5, 12.8, 15.1, 15.9, 16.8, 17.5, 21.5, 31.5, 38.0, 50.5, 62.0]   # v3: the dive gets five frames
sheet = Image.new("RGB", (640 * 4, 360 * 3))
for i, t in enumerate(TS): sheet.paste(tag(frame(t), f"{t:.1f}s"), ((i % 4) * 640, (i // 4) * 360))
sheet.save(f"{HERE}/contact_sheet.jpg", quality=86)
PAIRS = [(6.0, 526), (15.1, 243), (17.5, 321), (31.5, 336), (38.0, 401), (50.5, 300)]   # ours t -> GM frame number
cmp_ = Image.new("RGB", (640 * 2, 360 * len(PAIRS)))
for i, (t, n) in enumerate(PAIRS):
    cmp_.paste(tag(frame(t), f"GM3D clip {t:.1f}s"), (0, i * 360))
    g = Image.open(f"/home/user/gm_ref/f2s/f_{n:04d}.jpg").convert("RGB").resize((640, 360), Image.LANCZOS); cmp_.paste(tag(g, f"Grand Maneuver f_{n:04d}"), (640, i * 360))
cmp_.save(f"{HERE}/compare_gm.jpg", quality=86)
print("ok")
