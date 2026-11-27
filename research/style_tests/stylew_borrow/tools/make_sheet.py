"""sheet.jpg: matched moments, original Marion scene (left, + the side key burned in where the film shows it) | borrow test (right).
usage: python3 make_sheet.py SNAPDIR OUT.jpg [R2_VIDEO R2_STARTS]   (SNAPDIR/<scene>/frame-*-at-<t>s.png from hyperframes snapshot)
With R2_VIDEO (the r2 share mp4) a third column is cut from it: published | test r1 | test r2 (sheet_r2.jpg)."""
import glob, sys
from PIL import Image, ImageDraw, ImageFont
D, OUT = sys.argv[1:3]; M = "/home/user/battle-maps/marion"
ROWS = [  # film time, label, original scene, borrow scene, scene time, side key shown in the film
    (0.5, "cloud dive: the lens falls through the white deck (orig: clean frame 0)", "hook-a", "test-bw-hook-a", "0.5", False),
    (6.6, "dive: through the low cumulus onto Nelson's Ferry (one continuous zoom kept)", "hook-a", "test-bw-hook-a", "6.6", True),
    (11.0, "'before dawn': pocket watch replaces the black date plate; THE ARMIES key", "hook-a", "test-bw-hook-a", "11", False),
    (15.64, "'under the guns': one muzzle flash + flintlock shot per musket", "hook-a", "test-bw-hook-a", "15.64", False),
    (57.9, "name slam: 3D gold title over the 2D map (replaces the name card)", "hook-b", "test-bw-hook-b", "30.7", True),
    (73.8, "title: 3D gold + gold Cinzel subtitle (replaces the title card)", "hook-b", "test-bw-hook-b2", "46.6", True),
    (803.9, "30 August 1781: watch plaque date + the wax seal drops on the timeline", "m3f", "test-bw-m3f", "5.7", True),
    (826.3, "'every shot found a target': ripple of 18 flashes, one shot each", "m3f", "test-bw-m3f", "28.1", True),
    (838.9, "result: parchment list top-right replaces the big casualty card", "m3f", "test-bw-m3f", "40.7", True),
]
key = Image.open(f"{M}/build/side_key.png").convert("RGBA")
R2 = sys.argv[3] if len(sys.argv) > 3 else None
SEG = [(0.0, 17.8), (56.35, 59.95), (71.45, 75.85), (801.5, 839.5)]   # r2 windows (film time) in the r2 clip, back to back
def clip_t(ft):
    o = 0.0
    for a, b in SEG:
        if a <= ft < b: return o + ft - a
        o += b - a
NC = 3 if R2 else 2
w, h, pad, lab = (786, 442, 10, 40) if R2 else (1180, 664, 12, 46)
F = ImageFont.truetype(f"{M}/tools/Anton-Regular.ttf", 26)
sheet = Image.new("RGB", (NC * w + (NC + 1) * pad, len(ROWS) * (h + lab + pad) + 70), (18, 18, 16)); d = ImageDraw.Draw(sheet)
d.text((pad, 18), "PUBLISHED MARION #18", font=F, fill=(230, 220, 190)); d.text((w + 2 * pad, 18), "BORROW TEST r1" if R2 else "STYLE W + BORROWED 3D ELEMENTS (test)", font=F, fill=(240, 200, 110))
if R2: d.text((2 * w + 3 * pad, 18), "BORROW TEST r2 (critic fixes)", font=F, fill=(250, 214, 120))
y = 70
for t, label, a, b, st, k in ROWS:
    fa = glob.glob(f"{D}/{a}/frame-*-at-{st}s.png")[0]; fb = glob.glob(f"{D}/{b}/frame-*-at-{st}s.png")[0]
    A = Image.open(fa).convert("RGBA")
    if k: A.alpha_composite(key, (1920 - key.width - 90, 80))
    m, s = divmod(t, 60)
    d.text((pad, y + 6), f"{int(m)}:{s:05.2f}  {label}", font=F, fill=(235, 228, 210))
    sheet.paste(A.convert("RGB").resize((w, h), Image.LANCZOS), (pad, y + lab)); sheet.paste(Image.open(fb).convert("RGB").resize((w, h), Image.LANCZOS), (w + 2 * pad, y + lab))
    if R2:
        import subprocess, io
        png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{clip_t(t):.3f}", "-i", R2, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
        sheet.paste(Image.open(io.BytesIO(png)).convert("RGB").resize((w, h), Image.LANCZOS), (2 * w + 3 * pad, y + lab))
    y += h + lab + pad
sheet.save(OUT, quality=80); print(OUT, sheet.size)
