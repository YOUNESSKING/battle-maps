"""3D flyover assets for a basemap: assets/<map>_height.png (sqrt-scaled elevation, 960x540) + assets/media/<map>_dark.jpg
(desaturated, darkened texture with a navy sea and a faint coastline glow). usage: python3 tools/make_fly_assets.py MAP [MAP ...]"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bake import tile
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
for name in sys.argv[1:]:
    P = json.load(open(f"{A}/{name}.json")); z = P["zoom"]; x0, y0 = P["origin_world_px"]; W, H = P["size"]
    tx0, ty0, tx1, ty1 = x0 // 256, y0 // 256, (x0 + W) // 256, (y0 + H) // 256
    m = np.vstack([np.hstack([tile(z, tx, ty) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
    e = m[y0 - ty0 * 256:y0 - ty0 * 256 + H, x0 - tx0 * 256:x0 - tx0 * 256 + W]
    sb = P.get("sea_below", 0.5)
    land = e > sb
    e = np.where(land, np.clip(e - min(sb, 0), 0, None), 0)
    Image.fromarray((np.sqrt(e / max(e.max(), 1)) * 255).astype(np.uint8)).resize((960, 540), Image.BILINEAR).save(f"{A}/{name}_height.png")
    t = Image.open(f"{A}/{name}.jpg").convert("RGB").resize((1920, 1080), Image.LANCZOS)
    lm = Image.fromarray((land * 255).astype(np.uint8)).resize((1920, 1080), Image.BILINEAR).filter(ImageFilter.GaussianBlur(2))
    a = np.asarray(t, np.float32); g = a.mean(-1, keepdims=True); a = (g * 0.4 + a * 0.6) * 0.72
    mm = np.asarray(lm, np.float32)[..., None] / 255
    out = a * mm + (np.zeros_like(a) + [16, 24, 36]) * (1 - mm)
    edge = np.asarray(lm.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(3)), np.float32)[..., None] / 255
    Image.fromarray((out + edge * [120, 100, 70] * 0.8).clip(0, 255).astype(np.uint8)).save(f"{A}/media/{name}_dark.jpg", quality=90)
    print(name, "max elev", round(float(e.max())), "land", round(float(land.mean()), 2))
