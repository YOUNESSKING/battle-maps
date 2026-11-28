"""sheet_smoke3d_r21.jpg: r15 | r20 | r21 (stills) at the cannon frames 1039 / 1040, +1 s, +3 s, volley 1 +0.1 / +0.5 s, and the opening seam 8.0-9.2 s.
usage: python3 make_sheet_r21.py R15.mp4 R20.mp4 M3D_SNAPS M3F_SNAPS OPEN_DIR HOOK_PREVIEW.mp4 HOOK_S0 OUT.jpg [M3F_DEBUG_SNAPS]"""
import glob, io, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
R15, R20, SD, SF, OD, HK, HS0, OUT = sys.argv[1:9]; HS0 = int(HS0); DBGD = sys.argv[9] if len(sys.argv) > 9 else None
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22); w, h = 600, 340
def vf(v, n, cr):
    a = ["ffmpeg", "-v", "error", "-i", v, "-vf", f"select=eq(n\\,{n})", "-vsync", "0", "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"]
    return Image.open(io.BytesIO(subprocess.run(a, capture_output=True).stdout)).convert("RGB").crop(cr).resize((w, h), Image.LANCZOS)
def sn(d, t, cr): f = min(glob.glob(f"{d}/frame-*-at-*s.png"), key=lambda p: abs(float(re.search(r"at-([\d.]+)s", p).group(1)) - t)); return Image.open(f).convert("RGB").crop(cr).resize((w, h), Image.LANCZOS)
def r21seam(n, cr): return Image.open(f"{OD}/f{n:04d}.png").convert("RGB").crop(cr).resize((w, h), Image.LANCZOS) if n <= 257 else vf(HK, n - HS0, cr)
CC, CV, CS = (735, 200, 1455, 610), (835, 150, 1465, 510), (0, 0, 1920, 1080)
rows = [("cannon frame 1039 (34.633 s, the gun's sound frame)", 1039, lambda cr: sn(SD, 50.267, cr), CC), ("cannon frame 1040", 1040, lambda cr: sn(SD, 50.3, cr), CC),
        ("cannon +1 s (frame 1069)", 1069, lambda cr: sn(SD, 51.267, cr), CC), ("cannon +3 s (frame 1129)", 1129, lambda cr: sn(SD, 53.267, cr), CC),
        ("volley 1 +0.1 s (frame 1903)", 1903, lambda cr: sn(SF, 27.997, cr), CV), ("volley 1 +0.5 s (frame 1915)", 1915, lambda cr: sn(SF, 28.397, cr), CV),
        ("volley 2 +0.1 s (frame 1999)", 1999, lambda cr: sn(SF, 31.187, cr), CV), ("volley 2 +0.5 s (frame 2011)", 2011, lambda cr: sn(SF, 31.587, cr), CV)]
if DBGD: rows += [(f"AIM CHECK (r21 debug copy: magenta = each shot's aim) {lab}", n, (lambda t: lambda cr: sn(DBGD, t, cr))(t), CV) for lab, n, t in
                  (("volley 1 +0.1 s", 1903, 27.997), ("volley 1 +0.5 s", 1915, 28.397), ("volley 2 +0.1 s", 1999, 31.187), ("volley 2 +0.5 s", 2011, 31.587))]
rows += [(f"opening seam {n / 30:.2f} s (frame {n})", n, (lambda n: lambda cr: r21seam(n, cr))(n), CS) for n in (240, 246, 249, 252, 255, 258, 270, 276)]
S = Image.new("RGB", (3 * w + 40, 50 + len(rows) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r15 (locked)  |  r20 (share)  |  r21 (stills: r15's fireball / tongues / white bursts + the engine cloud / haze at the guns; seam fixes)", font=F, fill=(250, 214, 120))
for i, (lab, n, f21, cr) in enumerate(rows):
    y = 50 + i * (h + 40); d.text((10, y + 6), lab, font=F, fill=(235, 228, 210))
    S.paste(vf(R15, n, cr), (10, y + 34)); S.paste(vf(R20, n, cr), (w + 20, y + 34)); S.paste(f21(cr), (2 * w + 30, y + 34))
S.save(OUT, quality=86); print(OUT, S.size)
