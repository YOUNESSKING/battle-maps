"""r13b review sheets from LOCAL STILLS (owner workflow: the critics check sheets before any render):
sheet_clouds_r13b.jpg (dive stills vs gm3d v6 at matching moments + in-scene clouds + 1:1 crops), smoke_fade_r13b.jpg (one volley r12 | r13b
at +0 ... +6 s + the buckshot ripple), focus_r13b.jpg (the focus light circle: full frame, 1:1 crop, phone view).
usage: python3 make_sheets_r13b.py HOOK_STILLS_DIR M3F_STILLS_DIR R12_SHARE.mp4 R13_SHARE.mp4 OUTDIR"""
import glob, io, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
HD, MD, R12, R13, OD = sys.argv[1:6]; V6 = "/home/user/battle-maps/research/style_tests/gm3d/clip/gm3d_clip_v6_share.mp4"
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
def vid(v, t, crop=None, size=(800, 450)):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); return (im.crop(crop) if crop else im).resize(size, Image.LANCZOS)
def still(d, t, crop=None, size=(800, 450)):
    f = [p for p in glob.glob(f"{d}/frame-*.png") if abs(float(re.search(r"at-([\d.]+)s", p).group(1)) - t) < 0.005][0]
    im = Image.open(f).convert("RGB"); return (im.crop(crop) if crop else im).resize(size, Image.LANCZOS)
def sheet(title, rows, out, w=800, h=450, scale=0.75):
    S = Image.new("RGB", (2 * w + 30, 50 + len(rows) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S); d.text((10, 12), title, font=F, fill=(250, 214, 120))
    for i, (lab, a, b) in enumerate(rows):
        y = 50 + i * (h + 40); d.text((10, y + 8), lab, font=F, fill=(235, 228, 210)); S.paste(a, (10, y + 36)); S.paste(b, (w + 20, y + 36))
    S = S.resize((int(S.size[0] * scale), int(S.size[1] * scale)), Image.LANCZOS); S.save(out, quality=82); print(out, S.size)
# --- clouds
CL = [("early field: 10-14 lit cumulus on 2 heights (near layer drifts 1.6x), shadows 25 %", 1.0), ("early field, the camera tilts down", 4.0),
      ("deck builds: 3 big masses merging (~30 %)", 5.9), ("deck ~65 %", 6.3), ("deck ~95 %, soft edges, grey hollows", 6.6), ("inside: even grey ~(205,205,200), soft lumps", 6.9),
      ("swap: even cream white-out", 7.1), ("emerge: wisps part over the target", 7.55), ("landed: clear", 8.6)]
rows = [(f"r13b {t:.2f} s (local still) | v6 {t + 9.4:.1f} s   {lab}", still(HD, t), vid(V6, t + 9.4)) for lab, t in CL]
rows += [(f"r13 {t:.1f} s (share) | v6 {tv:.1f} s   in scene (name slam): slow drift, never on the plate / key (unchanged)", vid(R13, t), vid(V6, tv)) for t, tv in ((18.2, 2.0), (19.6, 6.0))]
rows += [(f"1:1 crop r13b {t:.1f} s | v6 {t + 9.4:.1f} s (no tiling / banding)", still(HD, t, cr), vid(V6, t + 9.4, cr)) for t, cr in ((6.3, (600, 300, 1400, 750)), (6.6, (500, 200, 1300, 650)))]
sheet("STYLE W BORROW r13b CLOUDS (left)  |  APPROVED 3D CLIP gm3d v6 (right)", rows, f"{OD}/sheet_clouds_r13b.jpg")
# --- smoke fade: one volley (first flash 27.9 s scene = 63.367 s r12 share)
CR = (500, 220, 1700, 700); w, h = 900, 360
OFF = [(0.0, "first flash"), (0.3, "the dense burst (~0.8, own pass)"), (1.0, "burst eased into the 0.40 milky haze"), (2.0, "carried downwind ~42 px/s, shearing"),
       (4.0, "1st ripple nearly gone; the 2nd (buckshot) ripple +0.9 s"), (6.0, "1st ripple gone; the haze left is the 2nd ripple (2.9 s old)")]
rows = [(f"+{dt:.1f} s  {lab}   (r12 share | r13b local still)", vid(R12, 63.367 + dt, CR, (w, h)), still(MD, round(27.9 + dt, 2), CR, (w, h))) for dt, lab in OFF]
rows += [(f"r13b 2nd ripple (buckshot) +2.1 s | +4.1 s  (+6.1 s: see the 3rd image below)", still(MD, 33.13, CR, (w, h)), still(MD, 35.13, CR, (w, h))),
         ("r13b 2nd ripple +6.1 s: gone, no build-up | r12 at the same moment", still(MD, 37.13, CR, (w, h)), vid(R12, 63.367 + 9.23, CR, (w, h)))]
sheet("SMOKE r12 (left: thick, hangs)  |  r13b (right: milky white haze <= 0.40, dense burst 0.8 for 0.4 s, drifts ~42 px/s, gone ~5 s)", rows, f"{OD}/smoke_fade_r13b.jpg", w, h, 0.8)
# --- focus
im = still(MD, 10.0, None, (1920, 1080)); Fo = Image.new("RGB", (1950, 1700), (18, 18, 16)); d = ImageDraw.Draw(Fo)
d.text((10, 10), "r13b focus light circle on 'in a thick wood' (m3f 10.0 s, local still): core 380 px + 200 px feather, ~30 % darker outside, warm light 0.15, the dim UNDER the units / labels", font=F, fill=(250, 214, 120))
Fo.paste(im, (10, 50)); d.text((10, 1140), "1:1 crop at the circle's edge (left)  |  phone view 640x360 (right)", font=F, fill=(250, 214, 120))
Fo.paste(im.crop((1000, 500, 1820, 1020)), (10, 1180)); Fo.paste(im.resize((640, 360), Image.LANCZOS), (860, 1180)); Fo.save(f"{OD}/focus_r13b.jpg", quality=85); print("focus ok")
