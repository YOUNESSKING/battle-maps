"""quick review tile of the latest snapshot run: python3 tools/pa1_quick.py SCENE OUT.jpg [cols] ; also copies frames to scenes/SCENE/snapshots/"""
import glob, os, shutil, sys
from PIL import Image, ImageDraw
sc, out = sys.argv[1], sys.argv[2]; C = int(sys.argv[3]) if len(sys.argv) > 3 else 4
runs = sorted(glob.glob(f"scenes/{sc}/.hyperframes/artifacts/snapshots/*/"), key=os.path.getmtime)
fr = sorted(glob.glob(runs[-1] + "frame-*-at-*s.png"), key=lambda p: float(p.rsplit("-at-", 1)[1][:-5]))
shutil.rmtree(f"scenes/{sc}/snapshots", ignore_errors=True); os.makedirs(f"scenes/{sc}/snapshots", exist_ok=True)
for p in fr: shutil.copy(p, f"scenes/{sc}/snapshots/" + os.path.basename(p))
W, H = 640, 360; R = (len(fr) + C - 1) // C; im = Image.new("RGB", (C * W, R * H)); d = ImageDraw.Draw(im)
for i, p in enumerate(fr):
    x, y = (i % C) * W, (i // C) * H; im.paste(Image.open(p).convert("RGB").resize((W, H)), (x, y))
    d.rectangle([x, y, x + 70, y + 22], fill=(0, 0, 0)); d.text((x + 4, y + 4), p.rsplit("-at-", 1)[1][:-5], fill="white")
im.save(out, quality=85); print(out, len(fr))
