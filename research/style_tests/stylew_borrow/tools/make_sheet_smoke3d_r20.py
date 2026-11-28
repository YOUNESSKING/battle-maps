"""sheet_smoke3d_r20.jpg: r15 (left, its share) | r19 (middle, its share) | r20 (right, local snapshots, build --smoke3d) at the same times, 1:1 crops.
usage: python3 make_sheet_smoke3d_r20.py R15.mp4 R19.mp4 M3D_SNAPS M3F_SNAPS OUT.jpg"""
import glob, io, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
R15, R19, SD, SF, OUT = sys.argv[1:6]; F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 24); w, h = 630, 360
ROWS = [("CANNON (Fort Motte; share = scene - 15.633)", SD, -15.6333, (785, 220, 1415, 580), [(50.767, "+0.5 s"), (51.267, "+1 s"), (52.267, "+2 s"), (53.267, "+3 s"), (53.1, "white flag (share 37.47)")]),
        ("MUSKET VOLLEY 1 (Parker's Ferry; share = scene + 35.44)", SF, 35.44, (835, 150, 1465, 510), [(28.897, "+1 s"), (29.897, "+2 s"), (31.897, "+4 s")])]
def vid(v, t, cr):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.4f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGB").crop(cr)
def snap(d, t, cr): f = min(glob.glob(f"{d}/frame-*-at-*s.png"), key=lambda p: abs(float(re.search(r"at-([\d.]+)s", p).group(1)) - t)); return Image.open(f).convert("RGB").crop(cr)
n = sum(len(r[4]) for r in ROWS); S = Image.new("RGB", (3 * w + 40, 50 + len(ROWS) * 44 + n * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r15 (locked)  |  r19 (engine copy, PPU 150 / cannon 110)  |  r20 (engine smoke at the guns, PPU 60)", font=F, fill=(250, 214, 120)); y = 50
for name, sd, off, cr, ts in ROWS:
    d.text((10, y + 8), name, font=F, fill=(250, 214, 120)); y += 44
    for t, lab in ts:
        d.text((10, y + 6), f"{lab}   (scene {t:.3f} s, share {t + off:.2f} s)", font=F, fill=(235, 228, 210))
        S.paste(vid(R15, t + off, cr), (10, y + 36)); S.paste(vid(R19, t + off, cr), (w + 20, y + 36)); S.paste(snap(sd, t, cr), (2 * w + 30, y + 36)); y += h + 40
S.save(OUT, quality=88); print(OUT, S.size)
