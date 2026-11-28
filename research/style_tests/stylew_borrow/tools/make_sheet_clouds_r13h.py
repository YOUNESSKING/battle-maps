"""r13h clouds sheet: the hook dive (RunPod GPU clip of the 0-17.8 s window, r13h clouds) next to gm3d v6 at matching moments (v6 = ours + 9.4 s)
+ the in-scene name-slam clouds (unchanged, r13 share) + 1:1 crops. Coverage numbers come from a mask render (map hidden, clouds over black).
usage: python3 make_sheet_clouds_r13h.py HOOK_CLIP.mp4 R13_SHARE.mp4 OUT.jpg [COVERAGE.json]"""
import io, json, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
CLIP, R13, OUT = sys.argv[1:4]; COV = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
V6 = "/home/user/battle-maps/research/style_tests/gm3d/clip/gm3d_clip_v6_share.mp4"
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
def vid(v, t, crop=None, size=(800, 450)):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB").resize((1920, 1080)); return (im.crop(crop) if crop else im).resize(size, Image.LANCZOS)
CL = [("early field: AUTHORED (gm3d v6 clouds traced at 10.4 s)", 1.0), ("early field, corridor fade starting", 3.5), ("early field while ONE ROAD is on screen (road clear)", 4.5),
      ("deck builds: 5.5 s", 5.5), ("deck builds, no ring (5.7 s)", 5.7), ("deck ~35 % target", 5.9), ("deck ~45 % target", 6.1), ("deck ~57 % target, no notch", 6.3), ("deck ~95 %, soft edges, no gaps", 6.6), ("inside: even grey (205,205,200), soft lumps", 6.9),
      ("swap: cream white-out (unchanged)", 7.1), ("emerge (unchanged)", 7.55), ("landed: clear (unchanged)", 8.6)]
cov = lambda t: f"  [cover {COV[str(t)]:.0f} %]" if str(t) in COV else ""
rows = [(f"r13h {t:.2f} s | v6 {t + 9.4:.1f} s   {lab}{cov(t)}", vid(CLIP, t), vid(V6, t + 9.4)) for lab, t in CL]
rows += [(f"r13 {t:.1f} s (share) | v6 {tv:.1f} s   in scene (name slam): unchanged", vid(R13, t), vid(V6, tv)) for t, tv in ((18.2, 2.0), (19.6, 6.0))]
rows += [(f"1:1 crop r13h {t:.1f} s | v6 {t + 9.4:.1f} s", vid(CLIP, t, cr), vid(V6, t + 9.4, cr)) for t, cr in ((5.9, (560, 240, 1360, 690)), (6.3, (600, 300, 1400, 750)), (6.6, (500, 200, 1300, 650)))]
w, h = 800, 450; S = Image.new("RGB", (2 * w + 30, 50 + len(rows) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "STYLE W BORROW r13h CLOUDS (left, RunPod GPU)  |  APPROVED 3D CLIP gm3d v6 (right)", font=F, fill=(250, 214, 120))
for i, (lab, a, b) in enumerate(rows):
    y = 50 + i * (h + 40); d.text((10, y + 8), lab, font=F, fill=(235, 228, 210)); S.paste(a, (10, y + 36)); S.paste(b, (w + 20, y + 36))
S = S.resize((int(S.size[0] * 0.75), int(S.size[1] * 0.75)), Image.LANCZOS); S.save(OUT, quality=82); print(OUT, S.size)
