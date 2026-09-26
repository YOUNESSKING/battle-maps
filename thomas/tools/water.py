"""River/lake overlay from the cached elevation tiles: pixels at (almost) the lowest water level, largest connected blobs.

usage: python3 tools/water.py BASEMAP LEVEL_M [MIN_AREA_PX]   → assets/BASEMAP_water.png (2880x1620 RGBA, feathered blue)
Use it in a scene with B.image("assets/BASEMAP_water.png", 0, 0, 2880, 1620, { t: 0 }).
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bake import tile, world_px, W, H
from scipy import ndimage

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
name, level = sys.argv[1], float(sys.argv[2])
min_area = int(sys.argv[3]) if len(sys.argv) > 3 else 4000
P = json.load(open(f"{ROOT}/assets/{name}.json"))
z = P["zoom"]; x0, y0 = P["origin_world_px"]
zt = min(z, 15); f = 2 ** (z - zt)
wx0, wy0 = x0 / f, y0 / f
tx0, ty0, tx1, ty1 = int(wx0) // 256, int(wy0) // 256, int(wx0 + W / f) // 256, int(wy0 + H / f) // 256
mosaic = np.vstack([np.hstack([tile(zt, tx, ty) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
im = Image.fromarray(mosaic.astype(np.float32), mode="F")
elev = np.asarray(im.transform((W, H), Image.AFFINE, (1 / f, 0, wx0 - tx0 * 256, 0, 1 / f, wy0 - ty0 * 256), resample=Image.BILINEAR), float)
m = elev <= level
m = ndimage.binary_opening(m, iterations=1)
lab, n = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1, n + 1))
keep = np.isin(lab, 1 + np.where(sizes >= min_area)[0])
keep = ndimage.binary_closing(keep, iterations=2)
a = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
rgba = Image.new("RGBA", (W, H), (120, 158, 178, 0)); rgba.putalpha(a.point(lambda v: int(v * 0.85)))
rgba.save(f"{ROOT}/assets/{name}_water.png")
print(name, "water px", int(keep.sum()), "blobs kept", int((sizes >= min_area).sum()))
