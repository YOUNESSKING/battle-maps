"""Weather overlay assets for a Style W basemap (visual only; no sounds).

python3 make_weather_assets.py <key> <basemap.jpg> [masks_dir] [rivers_overlay.png]
  key            output prefix, e.g. vicksburg_w  -> assets/<key>_{snow,mud,puddles,fog}.png + assets/<key>_data.js
  basemap.jpg    the Style W wide basemap (hd_scale 2: image px = 2 x map px), read only
  masks_dir      optional folder with the 2e exclusion masks (rivers_w.png, roads.png, towns.png, labels.png, woods_w.png),
                 same size as the basemap (e.g. research/style_tests/roads_towns/exclusion_masks)
  rivers_overlay optional 2e river layer (RGBA, same size), e.g. research/style_tests/roads_towns/rivers/rivers_w.png
Without masks the water comes from the basemap's own pale-blue river pixels and the woods from its dark ink; no roads/towns.

Outputs are in MAP px (the world box, 0..W x 0..H), so the scene places each one as <img> width W / height H at (0,0) in #world:
  <key>_snow.png    RGBA 2880x1620  white dusting on open grass (roads, rivers, towns, labels kept clear; woods/ink light)
  <key>_mud.png     RGBA 1440x810   brown wet grade, used with mix-blend-mode:multiply (roads darker = churned ruts)
  <key>_puddles.png RGBA 2880x1620  small sky-grey puddle glints on the roads (dark rim + light face)
  <key>_fog.png     RGBA 1440x810   soft low haze in the river valleys / bottoms
  <key>_data.js     WEATHER_DATA[key] = { w, h, water: [[x,y],..], puddles: [[x,y],..] }  (ripple seeds, map px)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
from skimage.morphology import skeletonize

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("WX_OUT", os.path.join(HERE, "assets"))   # yorktown kit: WX_OUT=kit/weather
os.makedirs(OUT, exist_ok=True)
key, base_p = sys.argv[1], sys.argv[2]
mdir = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "-" else None
riv_p = sys.argv[4] if len(sys.argv) > 4 else None
rng = np.random.default_rng(1862)

base = np.asarray(Image.open(base_p).convert("RGB")).astype(np.int16)
IH, IW = base.shape[:2]
MW, MH = IW // 2, IH // 2                       # map px
R, G, B = base[..., 0], base[..., 1], base[..., 2]
lum = 0.3 * R + 0.59 * G + 0.11 * B


def mask(name):
    if not mdir:
        return None
    p = os.path.join(mdir, name)
    return (np.asarray(Image.open(p).convert("L")) > 127) if os.path.exists(p) else None


water = (B > R + 45) & (B > G + 10)
m = mask("rivers_w.png")
if m is not None:
    water |= m
bank = water.copy()
if riv_p and os.path.exists(riv_p):
    ra = np.asarray(Image.open(riv_p))[..., 3]
    water |= ra > 200
    bank |= ra > 40
water = ndi.binary_opening(water, iterations=1)
woods = mask("woods_w.png")
if woods is None:
    woods = lum < 72
roads = mask("roads.png")
towns = mask("towns.png")
labels = mask("labels.png")
Z = np.zeros((IH, IW), bool)
roads = Z if roads is None else roads
towns = Z if towns is None else towns
labels = Z if labels is None else labels

# road centre lines (the roads mask is a 12 px corridor + 30 px circles at crossings)
dist_road = ndi.distance_transform_edt(roads)
sk = skeletonize(roads) & (dist_road <= 14) & ~towns


def blur(a, r):
    return ndi.gaussian_filter(a.astype(np.float32), r)


def noise(shape, scale, seed):
    """smooth value noise in 0..1 (bicubic upsample of random grid)"""
    r = np.random.default_rng(seed)
    gh, gw = max(2, shape[0] // scale + 2), max(2, shape[1] // scale + 2)
    g = Image.fromarray((r.random((gh, gw)) * 255).astype(np.uint8))
    return np.asarray(g.resize((shape[1] + scale, shape[0] + scale), Image.BICUBIC)).astype(np.float32)[:shape[0], :shape[1]] / 255


def fbm(shape, scales, seed):
    acc, wsum = 0, 0
    for i, s in enumerate(scales):
        w = 0.55 ** i
        acc = acc + w * noise(shape, s, seed + i)
        wsum += w
    return acc / wsum


def save_rgba(rgb, a, path, size, levels=0):
    a8 = np.clip(a * 255, 0, 255).astype(np.uint8)
    a8 = np.asarray(Image.fromarray(a8).resize(size, Image.LANCZOS))
    if levels:   # quantised alpha compresses ~4x; 1/levels steps are invisible under the grain
        q = 255 / (levels - 1)
        a8 = (np.round(a8 / q) * q).astype(np.uint8)
    im = np.dstack([np.broadcast_to(np.array(rgb, np.uint8), a8.shape + (3,)), a8])
    Image.fromarray(im, "RGBA").save(path, optimize=True)


# ---------- snow dusting (work at image res, save at map px) ----------
# a DUSTING, not a blanket: grass tone shows through; roads = dark trodden ruts; towns keep their roofs (soft, no hard shapes)
town_clear = np.clip((blur(towns, 10) - 0.72) * 3.5, 0, 1)   # roofs keep a light dusting; no green ring round the town
rut = blur(ndi.binary_dilation(sk, iterations=3), 1.6)
bank_clear = blur(bank, 2.5)
patch = fbm((IH, IW), [260, 110, 40], 7)             # drifts and thin spots
grain = noise((IH, IW), 3, 99)
a = 0.34 + 0.30 * np.clip((patch - 0.3) * 1.7, 0, 1)
a = a * (0.80 + 0.20 * grain)
a = np.where(woods, a * 0.35, a)                     # ink trees stay dark (light dusting only)
a = a * np.clip(1 - bank_clear, 0, 1) * (1 - 0.55 * town_clear) * np.clip(1 - 0.9 * rut, 0, 1)
# thin ice rim along the river banks (reads as cold, keeps the blue clear)
rim = blur(ndi.binary_dilation(bank, iterations=3) & ~bank, 1.2)
a = np.maximum(a, np.clip(rim * 0.9, 0, 0.5) * ~water)
save_rgba((238, 241, 243), a, f"{OUT}/{key}_snow.png", (MW, MH), levels=20)

# ---------- mud / wet ground (multiply grade) ----------
H2, W2 = IH // 4, IW // 4                            # save at half map px; soft
small = lambda b, r: ndi.gaussian_filter(np.asarray(Image.fromarray(b.astype(np.uint8) * 255).resize((W2, H2), Image.BILINEAR)).astype(np.float32) / 255, r)
wet = fbm((H2, W2), [60, 24, 8], 21)
near_w = small(ndi.binary_dilation(water, iterations=24), 10)   # bottoms near the rivers wetter
road_s = small(ndi.binary_dilation(sk, iterations=3), 0.8)
a = 0.40 + 0.24 * np.clip((wet - 0.4) * 2.2, 0, 1) + 0.14 * near_w
a = np.maximum(a, np.clip(road_s * 1.6, 0, 1) * 0.62)
a = a * (1 - small(water, 0.8))                     # never on the water
a = a * (1 - 0.6 * small(towns, 2))
rgb = np.zeros((H2, W2, 3), np.float32)
c_ground, c_road = np.array([152, 122, 86]), np.array([104, 78, 48])
t = np.clip(road_s * 1.6, 0, 1)[..., None]
rgb = c_ground * (1 - t) + c_road * t
im = np.dstack([rgb, np.clip(a, 0, 1) * 255]).astype(np.uint8)
Image.fromarray(im, "RGBA").save(f"{OUT}/{key}_mud.png", optimize=True)

# ---------- puddles on the roads (map px canvas x2 for crisp edges) ----------
ys, xs = np.nonzero(sk)
pud = []
if len(xs):
    order = rng.permutation(len(xs))
    CELL = 110
    taken = np.zeros((IH // CELL + 1, IW // CELL + 1), bool)
    for i in order:
        x, y = xs[i], ys[i]
        cx, cy = x // CELL, y // CELL
        if taken[cy, cx] or rng.random() > 0.3:
            continue
        taken[cy, cx] = True
        win = sk[max(0, y - 8):y + 9, max(0, x - 8):x + 9]
        py, px = np.nonzero(win)
        if len(px) < 4:
            continue
        cov = np.cov(np.vstack([px, py]))
        ev, evec = np.linalg.eigh(cov)
        ang = float(np.degrees(np.arctan2(evec[1, 1], evec[0, 1])))
        pud.append((x / 2.0, y / 2.0, ang, 1.1 + rng.random() * 1.6))
S2 = 2   # draw at 2x map px
pim = Image.new("RGBA", (MW * S2, MH * S2), (0, 0, 0, 0))
for (x, y, ang, L) in pud:
    w, h = L * S2 * 2.2, L * S2 * 0.9
    for col, grow, off in (((38, 30, 16, 120), 1.2, (-0.3, -0.3)), ((112, 122, 124, 170), 0.0, (0, 0)), ((176, 186, 190, 110), -0.55, (0.4, 0.3))):
        sp = Image.new("RGBA", (int(w + 12), int(w + 12)), (0, 0, 0, 0))
        d = ImageDraw.Draw(sp)
        cxs = sp.size[0] / 2
        ww, hh = max(1, w + grow * S2 - (w * 0.45 if grow < 0 else 0)), max(1, h + grow * S2 - (h * 0.45 if grow < 0 else 0))
        d.ellipse([cxs - ww / 2, cxs - hh / 2, cxs + ww / 2, cxs + hh / 2], fill=col)
        sp = sp.rotate(-ang, resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.5))
        pim.alpha_composite(sp, (int(x * S2 - sp.size[0] / 2 + off[0] * S2), int(y * S2 - sp.size[1] / 2 + off[1] * S2)))
pim.save(f"{OUT}/{key}_puddles.png", optimize=True)

# ---------- fog: low haze in the valleys / along the rivers ----------
water_s = np.asarray(Image.fromarray(water.astype(np.uint8) * 255).resize((W2, H2), Image.BILINEAR)) > 60
dist_w = ndi.distance_transform_edt(~water_s)
valley = np.exp(-dist_w / 15.0)                      # ~30 map px falloff from the water: low, in the bottoms
f = fbm((H2, W2), [90, 40, 14], 33)
a = valley * (0.55 + 0.45 * np.clip((f - 0.3) * 1.5, 0, 1))
a = np.minimum(ndi.gaussian_filter(np.clip(a, 0, 1), 2.5) * 0.8, 0.6)   # cap: the river blue stays readable under the haze
save_rgba((226, 229, 222), a, f"{OUT}/{key}_fog.png", (W2, H2))

# ---------- ripple seeds ----------
core = ndi.binary_erosion(water, iterations=2)
wy, wx = np.nonzero(core)
sel = rng.choice(len(wx), size=min(8000, len(wx)), replace=False) if len(wx) else []
data = {"w": MW, "h": MH,
        "water": [[round(wx[i] / 2, 1), round(wy[i] / 2, 1)] for i in sel],
        "puddles": [[round(p[0], 1), round(p[1], 1)] for p in pud]}
with open(f"{OUT}/{key}_data.js", "w") as fh:
    fh.write("window.WEATHER_DATA = window.WEATHER_DATA || {};\nwindow.WEATHER_DATA[%s] = %s;\n" % (json.dumps(key), json.dumps(data, separators=(",", ":"))))
print(key, MW, MH, "water seeds", len(data["water"]), "puddles", len(pud))
