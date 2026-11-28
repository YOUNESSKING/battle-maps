"""smoke_closeup_r9.jpg: one Parker's Ferry volley, r8 (left) vs r9 (right) close crops at the same offsets from the first shot, 0-6 s.
usage: python3 make_smoke_closeup_r9.py R8.mp4 T0_R8 R9.mp4 T0_R9 OUT.jpg T_CANNON T_HIT T_WIPE T_ROUT
+ r9 rows (r9 only, two frames per row): the Fort Motte six-pounder shot, the hits, the wipe-out and the rout."""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V8, T8, V9, T9, OUT = sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
TC, TH, TW, TR = (float(x) for x in sys.argv[6:10])
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
OFF = [(-2 / 30, "pan spark (1 frame, 2 frames early)"), (0.0, "core + ragged tongue frame 1 (100 %) + glow + bang"), (1 / 30, "tongue frame 2 (50 %), sparks"), (0.12, "jets thrown 60-80 px"),
       (0.3, "ripple: 2-3 flashes per frame, white jets"), (0.7, "ripple done: cauliflower puffs"), (1.5, "lit tops, grey undersides"), (3.0, "drifting north ~4 px/s"), (6.0, "6 s: <= 70 px tall, alpha <= 0.4"), (9.0, "9 s: almost gone (gone by 12 s)")]
w, h = 1100, 520
EXTRA = [("CANNON", TC, (600, 180, 1500, 605), [(-1 / 30, "just before"), (0.0, "flash frame 1: core + fireball + glow + bang"), (1 / 30, "frame 2 (50 %), sparks, dust ring"), (0.1, "smoke ring + burst thrown forward"),
          (0.3, "burst 150-200 px, dust ring"), (0.55, "round shot lands: dirt/smoke burst on the gable"), (1.0, "the figures are driven off the roof"), (2.0, "heavy low cloud: lit tops, dark undersides"), (2.8, "drifting, lingering"), (3.9, "still hanging at the window end (lingers 12-19 s)")]),
         ("HIT", TH, (560, 240, 1460, 665), [(-0.3, "ripple flashes"), (0.0, "hit: shudder + dims"), (0.15, "a chunk lost, stagger back"), (0.6, "colour returns, smaller box")]),
         ("WIPE-OUT", TW, (560, 280, 1460, 705), [(0.0, "'killed on the spot': the box breaks"), (0.15, "fragments scatter"), (0.5, "tumbling, casualty marks"), (1.5, "grey remnants")]),
         ("ROUT", TR, (560, 280, 1460, 705), [(0.0, "'wounded': the next box breaks"), (0.4, "fragments flee to the ferry"), (1.0, "two wounded stragglers fall behind"), (1.8, "stragglers grey, the rest gone")])]
NX = sum((len(o) + 1) // 2 for _, _, _, o in EXTRA)
S = Image.new("RGB", (2 * w + 30, 50 + len(OFF) * (h + 40) + len(EXTRA) * 50 + NX * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r8 (left)  |  r9 (right): low-frequency lit cauliflower puffs, muzzle-anchored ragged flashes, boxes above the smoke", font=F, fill=(250, 214, 120))
def crop(v, t, cr=(560, 240, 1460, 665)):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); k = im.size[0] / 1920
    return im.crop(tuple(int(c * k) for c in cr)).resize((w, h), Image.LANCZOS)
for i, (dt, lab) in enumerate(OFF):
    y = 50 + i * (h + 40); d.text((10, y + 8), f"{dt:+.3f} s  {lab}", font=F, fill=(235, 228, 210))
    S.paste(crop(V8, T8 + dt), (10, y + 36)); S.paste(crop(V9, T9 + dt), (w + 20, y + 36))
y = 50 + len(OFF) * (h + 40)
for name, T0, cr, offs in EXTRA:
    d.text((10, y + 12), f"r9 {name}  (t0 = {T0:.3f} s in the share clip)", font=F, fill=(250, 214, 120)); y += 50
    for i in range(0, len(offs), 2):
        for j, (dt, lab) in enumerate(offs[i:i + 2]):
            d.text((10 + j * (w + 10), y + 8), f"{dt:+.3f} s  {lab}", font=F, fill=(235, 228, 210)); S.paste(crop(V9, T0 + dt, cr), (10 + j * (w + 10), y + 36))
        y += h + 40
S = S.resize((S.size[0] * 2 // 3, S.size[1] * 2 // 3), Image.LANCZOS); S.save(OUT, quality=80); print(OUT, S.size)
