"""smoke_fade_r13.jpg: one Parker's Ferry volley, r12 (left) vs r13 (right) at +0, +0.3, +1, +2, +4, +6 s after the first flash
(r13: grey-blue haze <= 0.40, carried downwind ~42 px/s with shear + stretch, gone 4-6 s after the volley).
usage: python3 make_smoke_fade.py R12.mp4 T0_R12 R13.mp4 T0_R13 OUT.jpg"""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
A, TA, B, TB, OUT = sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
CR = (500, 220, 1700, 700); w, h = 900, 360
def fr(v, t):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGB").crop(CR).resize((w, h), Image.LANCZOS)
OFF = [(0.0, "first flash"), (0.3, "burst out of the muzzles"), (1.0, "the ripple done: thin haze"), (2.0, "carried downwind, shearing"), (4.0, "1st ripple nearly gone; 2nd ripple (+0.9 s) starting"), (6.0, "r13: the 1st ripple is gone; the haze left is the 2nd (buckshot) ripple, 2.9 s old")]
S = Image.new("RGB", (2 * w + 30, 50 + len(OFF) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r12 (left: white, thick, hangs)  |  r13 (right: grey-blue haze <= 0.40, drifts ~42 px/s, gone in 4-6 s)", font=F, fill=(250, 214, 120))
for i, (dt, lab) in enumerate(OFF):
    y = 50 + i * (h + 40); d.text((10, y + 8), f"+{dt:.1f} s  {lab}", font=F, fill=(235, 228, 210))
    S.paste(fr(A, TA + dt), (10, y + 36)); S.paste(fr(B, TB + dt), (w + 20, y + 36))
S.save(OUT, quality=82); print(OUT, S.size)
