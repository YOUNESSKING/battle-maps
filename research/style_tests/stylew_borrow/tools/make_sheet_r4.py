"""sheet_r4.jpg / sheet_r5.jpg (r5: XF = crossfade overlap at the joins, 4th argument): (1) the cloud dive, r4 next to the approved v6 clip at the same dive phase (v6 swap 16.4 s, r4 swap 7.0 s);
(2) musket smoke, r4 next to v8; (3) the gold name slam every 0.2 s next to v8's "ONE DAY" title every 0.2 s (it must land and sit still).
usage: python3 make_sheet_r4.py R4.mp4 OUT.jpg"""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
R4, OUT = sys.argv[1:3]; XF = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0; R5 = XF > 0
G = "/home/user/battle-maps/research/style_tests/gm3d/clip/"
V6, V8 = G + "gm3d_clip_v6_share.mp4", G + "gm3d_clip_v8_share.mp4"
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 24)
def fr(v, t, w, h):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGB").resize((w, h), Image.LANCZOS)
DIVE = [(0.05, 1.0, "high oblique overview"), (1.5, 4.0, "cumulus at 3 heights"), (3, 8.0, "'one road'"), (4.5, 13.9, "'Charleston' (keep-clear)"),
        (6, 15.4, "falling into the deck"), (7.5, 16.9, "white-out (swap underneath)"), (9, 18.4, "emerged on Nelson's Ferry")]
if R5: DIVE = [(0.05, 1.0, "high oblique overview"), (3, 8.0, "'one road' (corridor clear 2-6 s)"), (4.5, 13.9, "'Charleston'"), (6.3, 15.7, "'Santee River' still clear"),
        (6.9, 16.3, "short white-out (swap underneath)"), (7.4, 17.3, "'Nelson's Ferry': emerging, label on its word"), (7.6, 18.0, "landed clear")]
SEG0 = 17.8 + 3.6 + 4.4 - 3 * XF - 801.5   # clip time of film time ft in the Parker's Ferry window = ft + SEG0
SMOKE = [(16.0, 28.0, "guard: two short curtains (night)"), (17.2, 32.0, "guard curtains hanging"), (826.9 + SEG0, 36.0, "ambush ripple 1: one curtain"), (830.6 + SEG0, 40.0, "buckshot ripple 2 + curtain 1 thinning")]
TITLE = [round(18.85 - XF + 0.2 * i, 2) for i in range(10)]    # film 57.40 .. 59.20 in the r4 clip (the name window starts at clip 17.8 = film 56.35)
TV8 = [round(11.0 + 0.2 * i, 2) for i in range(10)]
w, h, pad, lab = 1180, 664, 12, 40
tw, th = 236, 133
rows = len(DIVE) + len(SMOKE)
H = 60 + rows * (h + lab + pad) + 2 * (th + lab) + 3 * pad + 60
S = Image.new("RGB", (2 * w + 3 * pad, H), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((pad, 16), ("STYLE W BORROW r5" if R5 else "STYLE W BORROW r4") + " (real engine clouds / dive / smoke over the 2D map)", font=F, fill=(250, 214, 120)); d.text((w + 2 * pad, 16), "APPROVED 3D CLIP (v6 dive, v8 smoke and title)", font=F, fill=(230, 220, 190))
y = 60
for t, tv, l in DIVE:
    d.text((pad, y + 6), f"DIVE {'r5' if R5 else 'r4'} {t:.2f} s | v6 {tv:.1f} s  {l}", font=F, fill=(235, 228, 210))
    S.paste(fr(R4, t, w, h), (pad, y + lab)); S.paste(fr(V6, tv, w, h), (w + 2 * pad, y + lab)); y += h + lab + pad
for t, tv, l in SMOKE:
    d.text((pad, y + 6), f"SMOKE {'r5' if R5 else 'r4'} {t:.1f} s | v8 {tv:.1f} s  {l}", font=F, fill=(235, 228, 210))
    S.paste(fr(R4, t, w, h), (pad, y + lab)); S.paste(fr(V8, tv, w, h), (w + 2 * pad, y + lab)); y += h + lab + pad
d.text((pad, y + 6), "GOLD NAME SLAM, every 0.2 s from 'Francis Marion' (must land, then sit still)", font=F, fill=(250, 214, 120)); y += lab
for i, t in enumerate(TITLE): S.paste(fr(R4, t, tw, th), (pad + i * (tw + 2), y))
y += th + pad
d.text((pad, y + 6), "v8 'ONE DAY' title, every 0.2 s from 11.0 s", font=F, fill=(230, 220, 190)); y += lab
for i, t in enumerate(TV8): S.paste(fr(V8, t, tw, th), (pad + i * (tw + 2), y))
S.save(OUT, quality=80); print(OUT, S.size)
