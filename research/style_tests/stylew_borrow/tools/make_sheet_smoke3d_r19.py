"""sheet_smoke3d_r19.jpg: the 3D film (gm3d clip v8, left) next to our --smoke3d copy (right) at the same offsets from the shot.
Film crops = its native 1280x720 pixels shown at 1.5x (the same share of the frame as ours); ours = 1:1 crops of the 1080p frames.
usage: python3 make_sheet_smoke3d_r19.py FILM.mp4 M3F_SNAPDIR M3D_SNAPDIR OUT.jpg [LABEL] [M3F_B M3D_B LABEL_B]   (r19b: a third column)"""
import glob, io, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
FILM, SF, SD, OUT = sys.argv[1:5]; LAB = sys.argv[5] if len(sys.argv) > 5 else "ours (--smoke3d)"
SFB, SDB, LABB = (sys.argv[6:9] if len(sys.argv) > 8 else (None, None, None)); NCOL = 3 if SFB else 2
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 24)
w, h = 630, 360
ROWS = [("MUSKET VOLLEY", 28.3, (SF, SFB), 27.897, (470, 260, 890, 500), (835, 150, 1465, 510), [0, 0.3, 1, 2, 4]),
        ("CANNON + IMPACT", 24.633, (SD, SDB), 50.267, (640, 160, 1060, 400), (785, 220, 1415, 580), [0, 0.5, 0.9, 2, 5])]
def film(t, cr):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", FILM, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGB").crop(cr).resize((w, h), Image.LANCZOS)
def ours(d, t, cr):
    f = min(glob.glob(f"{d}/frame-*-at-*s.png"), key=lambda p: abs(float(re.search(r"at-([\d.]+)s", p).group(1)) - t))
    im = Image.open(f).convert("RGB"); k = im.size[0] / 1920; return im.crop(tuple(int(c * k) for c in cr)).resize((w, h), Image.LANCZOS)
n = sum(len(r[6]) for r in ROWS)
S = Image.new("RGB", (NCOL * w + 10 * (NCOL + 1), 50 + len(ROWS) * 44 + n * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S); y = 12
d.text((10, y), f"3D film: gm3d clip v8 (720p crop at 1.5x)  |  {LAB} (1:1)" + (f"  |  {LABB} (1:1)" if SFB else ""), font=F, fill=(250, 214, 120)); y = 50
for name, tf, sd, to, crf, cro, offs in ROWS:
    d.text((10, y + 8), name, font=F, fill=(250, 214, 120)); y += 44
    for dt in offs:
        d.text((10, y + 6), f"+{dt:g} s   (film {tf + dt:.2f} s, ours scene {to + dt:.2f} s)", font=F, fill=(235, 228, 210))
        S.paste(film(tf + dt, crf), (10, y + 36)); S.paste(ours(sd[0], to + dt, cro), (w + 20, y + 36))
        if sd[1]: S.paste(ours(sd[1], to + dt, cro), (2 * w + 30, y + 36))
        y += h + 40
S.save(OUT, quality=88); print(OUT, S.size)
