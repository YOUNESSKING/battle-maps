import io, subprocess, sys
from PIL import Image, ImageDraw
# usage: grab.py VIDEO T0 CROP(x0,y0,x1,y1) OUT t1 t2 ... (times relative to the clip start)
v, cr, out = sys.argv[1], [int(x) for x in sys.argv[2].split(",")], sys.argv[3]; ts = [float(x) for x in sys.argv[4:]]
W = 640; H = int(W * (cr[3] - cr[1]) / (cr[2] - cr[0])); S = Image.new("RGB", (W * 2, H * ((len(ts) + 1) // 2))); d = ImageDraw.Draw(S)
for k, t in enumerate(ts):
    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.4f}", "-i", v, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    im = Image.open(io.BytesIO(png)).convert("RGB").crop(cr).resize((W, H), Image.LANCZOS); S.paste(im, ((k % 2) * W, (k // 2) * H)); d.text(((k % 2) * W + 4, (k // 2) * H + 2), f"{t:.3f}", fill=(255, 255, 0))
S.save(out, quality=88)
