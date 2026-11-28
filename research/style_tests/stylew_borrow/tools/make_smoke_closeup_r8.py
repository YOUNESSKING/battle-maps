"""smoke_closeup_r8.jpg: one Parker's Ferry volley, r7 (left) vs r8 (right) close crops at the same offsets from the first shot, 0-6 s.
usage: python3 make_smoke_closeup_r8.py R7.mp4 T0_R7 R8.mp4 T0_R8 OUT.jpg"""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V7, T7, V8, T8, OUT = sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
OFF = [(-2 / 30, "pan flash (1 frame, 2 frames early)"), (0.0, "tongue frame 1 + glow + bang"), (1 / 30, "tongue frame 2 (60 %), sparks"), (0.12, "jet cones thrown forward"),
       (0.3, "ripple, jets billowing"), (0.7, "ripple done: one bank"), (1.5, "bank lifts, lumpy top"), (3.0, "drifting downwind with shear"), (4.5, "2nd ripple merges"), (6.0, "thinning (~0.35)")]
w, h = 1100, 520
S = Image.new("RGB", (2 * w + 30, 50 + len(OFF) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r7 (left)  |  r8 (right): noise-textured lit smoke particles, cone jets, frame-locked flashes", font=F, fill=(250, 214, 120))
def crop(v, t):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); k = im.size[0] / 1920
    return im.crop((int(560 * k), int(240 * k), int(1460 * k), int(665 * k))).resize((w, h), Image.LANCZOS)
for i, (dt, lab) in enumerate(OFF):
    y = 50 + i * (h + 40); d.text((10, y + 8), f"{dt:+.3f} s  {lab}", font=F, fill=(235, 228, 210))
    S.paste(crop(V7, T7 + dt), (10, y + 36)); S.paste(crop(V8, T8 + dt), (w + 20, y + 36))
S.save(OUT, quality=82); print(OUT, S.size)
