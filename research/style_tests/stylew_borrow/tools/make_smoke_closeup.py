"""smoke_closeup_sheet.jpg: one volley (Parker's Ferry, 'every shot found a target') over ~6 s, close crops from the r7 clip, each frame
next to the spec line it should show (NOTES.md musket smoke + flash spec). usage: python3 make_smoke_closeup.py R7.mp4 OUT.jpg T0 (clip time of the first shot)"""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V, OUT, T0 = sys.argv[1], sys.argv[2], float(sys.argv[3])
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
ROWS = [(-0.07, "priming pan: lock flash 70 ms before"), (0.0, "first shot: tongue + white core + sparks"), (0.1, "ripple: next muzzles, jets thrown forward"),
        (0.3, "jets decelerate, billow"), (0.6, "ripple done: shots merge along the line"), (1.0, "one lumpy bank in front of the line"), (1.6, "bank swells, sunlit tops"),
        (2.5, "drifting downwind"), (3.5, "second ripple (buckshot) on top"), (4.5, "bank thickest, units still readable"), (6.0, "thinning, more transparent")]
w, h = 1100, 520
S = Image.new("RGB", (2 * w + 30, 50 + ((len(ROWS) + 1) // 2) * (h + 44)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r7 musket volley close-up (Parker's Ferry), crops of the share clip; each frame against the reference spec in NOTES.md", font=F, fill=(250, 214, 120))
for i, (dt, lab) in enumerate(ROWS):
    t = T0 + dt
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", V, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); W_, H_ = im.size; k = W_ / 1920
    im = im.crop((int(560 * k), int(240 * k), int(1460 * k), int(665 * k))).resize((w, h), Image.LANCZOS)
    x, y = 10 + (i % 2) * (w + 10), 50 + (i // 2) * (h + 44)
    d.text((x, y + 8), f"+{dt:.2f} s  {lab}", font=F, fill=(235, 228, 210)); S.paste(im, (x, y + 40))
S.save(OUT, quality=82); print(OUT, S.size)
