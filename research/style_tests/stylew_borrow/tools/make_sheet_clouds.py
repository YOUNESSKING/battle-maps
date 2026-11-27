"""sheet_clouds_r13.jpg: the r13 clouds next to the approved 3D clip (gm3d v6) at matching moments: the dive (v6 = r13 + 9.4 s, swap 16.4 s =
r13 7.0 s), the in-scene drifting clouds, and 1:1 crops (tiling / banding check).
usage: python3 make_sheet_clouds.py R13.mp4 OUT.jpg"""
import io, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
V, OUT = sys.argv[1], sys.argv[2]; V6 = "/home/user/battle-maps/research/style_tests/gm3d/clip/gm3d_clip_v6_share.mp4"
F = ImageFont.truetype("/home/user/battle-maps/marion/tools/Anton-Regular.ttf", 22)
def fr(v, t, crop=None, size=(800, 450)):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB"); return (im.crop(crop) if crop else im).resize(size, Image.LANCZOS)
ROWS = [("dive: scattered lit cumulus over the wide map", 1.0, 10.4), ("dive: the camera tilts down, clouds at 2 heights", 4.0, 13.4),
        ("dive: the deck builds (parallax layers)", 5.9, 15.3), ("dive: big lumpy masses, lit tops / grey undersides", 6.3, 15.7),
        ("dive: inside the cloud", 6.7, 16.1), ("swap: even cream white-out (no dark oval)", 7.1, 16.5), ("emerge: wisps part over the target", 7.55, 17.0),
        ("landed: clear, a few clouds at the edges", 8.6, 18.0), ("in scene (name slam window): drifting clouds, never on the plate / key", 18.2, 2.0),
        ("in scene: slow drift, consistent shadows", 19.6, 6.0)]
CROPS = [("1:1 crop (no tiling / banding)", 6.3, 15.7, (600, 300, 1400, 750)), ("1:1 crop", 6.7, 16.1, (500, 200, 1300, 650))]
w, h = 800, 450; S = Image.new("RGB", (2 * w + 30, 50 + (len(ROWS) + len(CROPS)) * (h + 40)), (18, 18, 16)); d = ImageDraw.Draw(S)
d.text((10, 12), "STYLE W BORROW r13 CLOUDS (left)  |  APPROVED 3D CLIP gm3d v6 (right)", font=F, fill=(250, 214, 120))
for i, (lab, t, tv) in enumerate(ROWS):
    y = 50 + i * (h + 40); d.text((10, y + 8), f"r13 {t:.2f} s | v6 {tv:.1f} s   {lab}", font=F, fill=(235, 228, 210))
    S.paste(fr(V, t), (10, y + 36)); S.paste(fr(V6, tv), (w + 20, y + 36))
for j, (lab, t, tv, cr) in enumerate(CROPS):
    y = 50 + (len(ROWS) + j) * (h + 40); d.text((10, y + 8), f"r13 {t:.2f} s | v6 {tv:.1f} s   {lab}", font=F, fill=(235, 228, 210))
    S.paste(fr(V, t, cr, (w, h)), (10, y + 36)); S.paste(fr(V6, tv, cr, (w, h)), (w + 20, y + 36))
S = S.resize((S.size[0] * 3 // 4, S.size[1] * 3 // 4), Image.LANCZOS); S.save(OUT, quality=82); print(OUT, S.size)
