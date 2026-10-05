"""Globe textures for the Frontlines test: assets/media/globe_earth.jpg (NASA Blue Marble, graded dark/desaturated like the series,
faint 1938 borders) + assets/media/globe_clouds.png (NASA cloud map as alpha). Both NASA Earth Observatory, public domain."""
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
W, H = 4096, 2048
e = Image.open("assets/src_bluemarble.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
e = ImageEnhance.Color(e).enhance(0.5); e = ImageEnhance.Brightness(e).enhance(0.72); e = ImageEnhance.Contrast(e).enhance(1.12)
a = np.asarray(e).astype(np.float32); a = a * np.array([0.92, 0.98, 1.06]); e = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
b = Image.new("L", (W, H), 0); d = ImageDraw.Draw(b)
for f in json.load(open("../gavin/assets/src/world_1938.geojson"))["features"]:
    g = f["geometry"]
    if not g: continue
    for poly in (g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]):
        ring = [((lon + 180) / 360 * W, (90 - lat) / 180 * H) for lon, lat in (c[:2] for c in poly[0])]
        if len(ring) > 2 and max(x for x, _ in ring) - min(x for x, _ in ring) < W / 2: d.line(ring + [ring[0]], fill=255, width=2)
b = b.filter(ImageFilter.GaussianBlur(0.8))
gold = Image.new("RGB", (W, H), (214, 190, 130)); e = Image.composite(gold, e, b.point(lambda v: int(v * 0.32)))
e.save("assets/media/globe_earth.jpg", quality=90)
c = Image.open("assets/src_clouds.jpg").convert("L").resize((W, H), Image.LANCZOS)
c = c.point(lambda v: max(0, min(255, int((v - 40) * 1.5))))
out = Image.new("RGBA", (W, H), (236, 238, 242, 0)); out.putalpha(c); out.save("assets/media/globe_clouds.png", optimize=True)
# soft cloud puffs for flying through: crops of the cloud map, feathered
for i, (x, y) in enumerate([(1200, 400), (2600, 500), (600, 1300), (3300, 1500)]):
    cr = c.crop((x, y, x + 700, y + 400)).resize((1400, 800), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
    m = Image.new("L", (1400, 800), 0); ImageDraw.Draw(m).ellipse((300, 200, 1100, 600), fill=255); m = m.filter(ImageFilter.GaussianBlur(150))
    al = Image.fromarray((np.asarray(cr, np.float32) / 255 * np.asarray(m, np.float32)).clip(0, 255).astype(np.uint8))
    p = Image.new("RGBA", (1400, 800), (232, 234, 238, 0)); p.putalpha(al); p.save(f"assets/media/cloud_puff{i}.png", optimize=True)
print("ok")
