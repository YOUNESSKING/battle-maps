"""Chosin Reservoir water overlay (translucent blue PNG) for a basemap, from the cached Terrarium tiles.

usage: python3 tools/make_water.py [BASEMAP ...]   (default: chosin_close chosin)
writes assets/BASEMAP_water.png (2880x1620 RGBA). The reservoir is the flat surface at <= 1064 m
(SRTM water level ~1051 m; 1064 m brings the south tip up to Hagaru-ri as in 1950).
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    P = json.load(open(f"{HERE}/../assets/{name}.json"))
    Z, (OX, OY), (W, H) = P["zoom"], P["origin_world_px"], P["size"]
    def tile(x, y):
        a = np.asarray(Image.open(f"{HERE}/.tiles/{Z}_{x}_{y}.png").convert("RGB"), float)
        return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    tx0, ty0, tx1, ty1 = OX // 256, OY // 256, (OX + W) // 256, (OY + H) // 256
    m = np.vstack([np.hstack([tile(tx, ty) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
    return m[OY - ty0 * 256:OY - ty0 * 256 + H, OX - tx0 * 256:OX - tx0 * 256 + W]


for name in sys.argv[1:] or ["chosin_close", "chosin"]:
    e = load(name)
    m = (e <= 1064) & (e >= 1040)
    lab, n = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    keep = np.isin(lab, 1 + np.where(sizes > sizes.max() * 0.02)[0])
    keep = ndimage.binary_opening(ndimage.binary_closing(keep, iterations=2), iterations=1)
    a = np.asarray(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)))
    rgba = np.zeros(a.shape + (4,), np.uint8)
    rgba[..., :3] = (128, 160, 172)
    rgba[..., 3] = a
    Image.fromarray(rgba).save(f"{HERE}/../assets/{name}_water.png", optimize=True)
    print(name, "water px:", int(keep.sum()))
