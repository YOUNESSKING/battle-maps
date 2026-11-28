"""smoke_closeup_r10.jpg: one Parker's Ferry volley, r11 (left) vs r12 (right) close crops at the same offsets from the first shot, 0-6 s.
usage: python3 make_smoke_closeup_r12.py R11.mp4 T0_R11 R12.mp4 T0_R12 OUT.jpg T_CANNON T_HIT T_WIPE T_ROUT
+ r9 rows (r9 only, two frames per row): the Fort Motte six-pounder shot, the hits, the wipe-out and the rout."""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V8, T8, V9, T9, OUT = sys.argv[1], float(sys.argv[2]), sys.argv[3], float(sys.argv[4]), sys.argv[5]
TC, TH, TW, TR = (float(x) for x in sys.argv[6:10])
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
OFF = [(-2 / 30, "pan spark (1 frame, 2 frames early)"), (0.0, "core + ragged tongue frame 1 (100 %) + glow + bang"), (1 / 30, "tongue frame 2 (50 %), sparks"), (0.12, "jets thrown 60-80 px"),
       (0.3, "ripple: 3-4 flashes per frame, red boxes shake"), (0.7, "ripple done: cauliflower puffs"), (1.5, "55-70 px bank, lumps on top, feathered bottom"), (3.0, "drifting north ~4 px/s"), (6.0, "6 s: thinning"), (9.0, "9 s: almost gone (gone by 12 s)")]
w, h = 1100, 520
EXTRA = [("CANNON", TC, (600, 180, 1500, 605), [(-1 / 30, "just before"), (0.0, "frame 1: white core + jagged 110x60 cone + 4-6 streaks + r120 glow + boom"), (1 / 30, "frame 2 (40 %)"), (0.1, "dense jet starts (alpha 0.9), dust ring on the ground"),
          (0.4, "the jet ends in a heavy head 160-200 px"), (0.55, "round shot lands: dirt/smoke burst on the gable"), (1.0, "the figures are driven off the roof"), (2.0, "dense cloud: tops ~230, undersides ~95-105, lumps r30-50"), (2.8, "drifting, lingering"), (3.9, "still hanging at the window end (lingers 12-19 s)")]),
         ("HIT", TH, (560, 240, 1460, 665), [(-0.3, "ripple flashes, the boxes shake"), (0.0, "hit: red-white flash on the box"), (0.15, "dims, a chunk lost, stagger back"), (0.6, "casualty marks (>= 8 px), smaller box")]),
         ("WIPE-OUT", TW, (560, 280, 1460, 705), [(0.0, "with KILLED (71.1 s): shudder, dims to dark"), (0.25, "40 % colour, ~40 px dust puff"), (0.9, "faded to a grey remnant + marks"), (2.2, "remnant holds 1.5 s, then fades")]),
         ("ROUT", TR, (560, 280, 1460, 705), [(0.0, "'wounded': the box shakes and breaks"), (0.4, "4 pieces 20x14 px ON SCREEN with the slash"), (1.0, "one wounded straggler stops, grey"), (1.3, "each piece visible >= 1.2 s; marks stay")])]
REF = "/home/user/battle-maps/ajackson/sequences/S07/sheet.jpg"   # the 3D film (Andrew Jackson S07 sheet, cannon plumes at 44 s / 92 s / 104 s)
NX = 2 + sum((len(o) + 1) // 2 for _, _, _, o in EXTRA)
S = Image.new("RGB", (2 * w + 30, 50 + len(OFF) * (h + 40) + len(EXTRA) * 50 + NX * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "r11 (left)  |  r12 (right): musket rows unchanged (bank approved); see the cannon and rout rows", font=F, fill=(250, 214, 120))
def crop(v, t, cr=(560, 240, 1460, 665)):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); k = im.size[0] / 1920
    return im.crop(tuple(int(c * k) for c in cr)).resize((w, h), Image.LANCZOS)
for i, (dt, lab) in enumerate(OFF):
    y = 50 + i * (h + 40); d.text((10, y + 8), f"{dt:+.3f} s  {lab}", font=F, fill=(235, 228, 210))
    S.paste(crop(V8, T8 + dt), (10, y + 36)); S.paste(crop(V9, T9 + dt), (w + 20, y + 36))
y = 50 + len(OFF) * (h + 40)
d.text((10, y + 12), "3D FILM REFERENCE (Andrew Jackson S07, cannon plumes) vs r12 Fort Motte", font=F, fill=(250, 214, 120)); y += 50
R_ = Image.open(REF).convert("RGB"); tw, th = R_.size[0] // 4, R_.size[1] // 6
for j, (c, r, lab) in enumerate([(2, 1, "3D film 44 s: gun plumes"), (2, 3, "3D film 92 s: grapeshot flash + plume")]):
    d.text((10 + j * (w + 10), y + 8), lab, font=F, fill=(235, 228, 210)); S.paste(R_.crop((c * tw, r * th, (c + 1) * tw, (r + 1) * th)).resize((w, h), Image.LANCZOS), (10 + j * (w + 10), y + 36))
y += h + 40
for j, (c, r, lab) in enumerate([(0, 4, "3D film 104 s: redoubt gun"), (None, None, "r12: +1.0 s after the shot")]):
    d.text((10 + j * (w + 10), y + 8), lab, font=F, fill=(235, 228, 210))
    S.paste(R_.crop((c * tw, r * th, (c + 1) * tw, (r + 1) * th)).resize((w, h), Image.LANCZOS) if c is not None else crop(V9, TC + 1.0, (600, 180, 1500, 605)), (10 + j * (w + 10), y + 36))
y += h + 40
for name, T0, cr, offs in EXTRA:
    d.text((10, y + 12), f"r12 {name}  (t0 = {T0:.3f} s in the share clip)", font=F, fill=(250, 214, 120)); y += 50
    for i in range(0, len(offs), 2):
        for j, (dt, lab) in enumerate(offs[i:i + 2]):
            d.text((10 + j * (w + 10), y + 8), f"{dt:+.3f} s  {lab}", font=F, fill=(235, 228, 210)); S.paste(crop(V9, T0 + dt, cr), (10 + j * (w + 10), y + 36))
        y += h + 40
S = S.resize((S.size[0] * 2 // 3, S.size[1] * 2 // 3), Image.LANCZOS); S.save(OUT, quality=80); print(OUT, S.size)
