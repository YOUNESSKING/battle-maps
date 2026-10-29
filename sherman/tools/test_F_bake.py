"""TEST F (owner 2026-10-29, copy of a reference video's look): a sepia 'reference grade' of an existing HD basemap.
Shading code copied from tools/bake_hd.py (not imported, not edited); uses the elevation already saved by bake_hd
(assets/src/<base>_hd_elev.npy), so nothing is downloaded.
Colours (vidIQ description of the reference): land dark desaturated brown-grey / sepia #4A3F35 -> #6E5D4F with high-contrast
hillshade; sea deep dark teal #0A2A2D with a faint coordinate grid #1D4A4D; coastline glow cyan/teal #2BE4C6 (~20 px feather);
subtle grain. (Rivers / roads / borders are drawn by the test geography layer, tools/test_F_layers.py.)
usage (from sherman/): python3 tools/test_F_bake.py BASE [EXAG]  -> assets/BASE_hd_tg.jpg + .json"""
import json, math, sys
import numpy as np
from PIL import Image
from scipy import ndimage
base = sys.argv[1]; exag = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
J = json.load(open(f"assets/{base}.json")); z = J["zoom"] + 1; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
elev = np.load(f"assets/src/{base}_hd_elev.npy").astype(np.float32)[:H, :W]
lat = J["center"][0]; mpp = 156543.03392 * math.cos(math.radians(lat)) / 2 ** z
land = elev > J.get("sea_below", 0.5); le = np.where(land, elev, 0).astype(np.float32)
sm = ndimage.gaussian_filter(le, 1.2)
gy, gx = np.gradient(sm * exag, mpp)
slope, aspect = np.arctan(np.hypot(gx, gy)), np.arctan2(-gx, gy)
def shade(az, alt):
    az, alt = math.radians(az), math.radians(alt)
    return np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)
hs = 0.45 * shade(315, 38) + 0.25 * shade(260, 45) + 0.18 * shade(15, 50) + 0.12 * shade(135, 60)
sl = np.clip(np.degrees(slope) / 25, 0, 1)
ao = np.clip((ndimage.gaussian_filter(le, 18) - le) / 40, -1, 1)
fine = np.clip((le - ndimage.gaussian_filter(le, 2.5)) * exag / 6, -1, 1)
light = np.clip(0.42 + 0.72 * hs - 0.16 * sl - 0.18 * np.clip(ao, 0, 1) + 0.08 * np.clip(-ao, 0, 1) + 0.08 * fine, 0, 1.25)
# high-contrast photoreal-ish hillshade: stretch around the land median
a = np.clip(light * 0.9, 0, 1.2)
med = float(np.median(a[land])) if land.any() else 0.5
a = np.clip(0.55 + (a - med) * 2.6, 0, 1.15)
dark, mid, lite = np.array([0x2a, 0x23, 0x1d], np.float32), np.array([0x4A, 0x3F, 0x35], np.float32), np.array([0x8a, 0x76, 0x63], np.float32)
rgb = np.where(a[..., None] < 0.5, dark + (mid - dark) * (a[..., None] / 0.5), mid + (lite - mid) * ((a[..., None] - 0.5) / 0.65))
coast = ndimage.gaussian_filter(land.astype(np.float32), 2.0)[..., None]
sea = np.full((H, W, 3), (0x0A, 0x2A, 0x2D), np.float32)
yy, xx = np.mgrid[0:H, 0:W]; grid = ((xx % 240) < 2) | ((yy % 240) < 2)              # faint coordinate grid on the sea only
sea[grid] = sea[grid] * 0.6 + np.array([0x1D, 0x4A, 0x4D]) * 0.4
rgb = sea * (1 - coast) + rgb * coast
if (~land).any() and land.any():                                                  # luminous teal coastline glow (sea side)
    d = ndimage.distance_transform_edt(~land); glow = np.exp(-d / 20.0)[..., None] * (1 - coast)
    rgb = rgb * (1 - glow * 0.85) + np.array([0x2B, 0xE4, 0xC6]) * glow * 0.85
g = np.asarray(Image.fromarray(np.random.default_rng(7).normal(128, 40, (H // 2, W // 2)).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32)
rgb = rgb + (g[..., None] - 128) * 0.06
out = f"assets/{base}_hd_tg.jpg"
Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(out, quality=90)
json.dump(dict(J, name=base + "_hd_tg", hd_scale=S), open(f"assets/{base}_hd_tg.json", "w"), indent=1)
print("wrote", out, "land", round(float(land.mean()) * 100), "%")
