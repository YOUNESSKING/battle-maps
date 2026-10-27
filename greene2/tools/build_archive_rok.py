"""Rokossovsky archive test: builds a-4, a-37, a-38 from archive.json -> build/archive_test/a-<i>.mp4 (1280x720) + build/sheet-archive.jpg
usage: python3 tools/build_archive_rok.py [index ...]   (run from rokossovsky/)"""
import json, os, subprocess, sys
sys.path.insert(0, "tools")
import archive_shots
from PIL import Image, ImageDraw, ImageFont
T = json.load(open("audio/timing.json"))["paragraphs"]; A = json.load(open("archive.json"))
W, H = 1280, 720; OUT = "build/archive_test"; os.makedirs(OUT, exist_ok=True)
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
idx = [int(a) for a in sys.argv[1:]] or [4, 37, 38]
for i in idx:
    dur = round(T[i + 1]["start"] - T[i]["start"], 3) if i + 1 < len(T) else round(T[i]["end"] - T[i]["start"], 3)
    out = f"{OUT}/a-{i}.mp4"; archive_shots.build(A[str(i)], dur, out, W, H, enc); print(i, dur)
# contact sheet: 5 frames per section, labelled
F = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26); tw, th = 384, 216
rows = []
for i in [4, 37, 38]:
    p = f"{OUT}/a-{i}.mp4"
    if not os.path.exists(p): continue
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)
    row = []
    for k in range(5):
        t = d * (k + 0.5) / 5; fp = f"{OUT}/_f.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", p, "-frames:v", "1", "-vf", f"scale={tw}:{th}", fp], check=True)
        im = Image.open(fp).convert("RGB"); ImageDraw.Draw(im).text((8, 6), f"{i}  {t:.1f}s", font=F, fill=(255, 220, 90), stroke_width=2, stroke_fill=(0, 0, 0)); row.append(im)
    rows.append(row)
sheet = Image.new("RGB", (tw * 5, th * len(rows)))
for r, row in enumerate(rows):
    for c, im in enumerate(row): sheet.paste(im, (c * tw, r * th))
sheet.save("build/sheet-archive.jpg", quality=88)
