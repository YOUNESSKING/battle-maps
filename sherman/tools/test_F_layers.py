"""TEST F layers (owner 2026-10-29, reference look). Reads the shipped atlanta_* files, writes ONLY assets/media/test_F_*.
usage (from sherman/): python3 tools/test_F_layers.py
- test_F_atlanta_geo.png        the atlanta geography layer with the rivers recoloured medium-dark teal (#236365) and the water names teal
- test_F1_<date>.png            F1: Union ground filled, muted blue wash (~50 %), Confederate ground plain (normal blending, not multiply)
- test_F2_<date>.png            F2: Confederate ground filled, crimson #8B2515 wash (~50 %), Union ground plain
- capture pieces per loss (jul03->jul10, jul10->jul22): test_F_lost_<before>.png (white, alpha = the lost ground),
  test_F1_<after>_flood.png (F1 fill of the lost ground), test_F2_<before>_rest.png / _lostpart.png (F2 fill outside / inside it)"""
import json, math
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = "assets/media/"
def save(arr, name):
    assert name.startswith("test_F"); Image.fromarray(arr.astype(np.uint8), "RGBA").save(OUT + name, optimize=True)
def ctl(d): return np.asarray(Image.open(f"assets/media/atlanta_ctl_{d}_mx.png").convert("RGBA")).astype(np.int32)
def sides(X):
    a = X[..., 3] > 30
    return (X[..., 2] > X[..., 0] + 40) & a, (X[..., 0] > X[..., 2] + 40) & a
F1C, F2C, ALPHA = (52, 84, 140), (0x8B, 0x25, 0x15), 0.5
def fill(mask, col):
    s = np.clip(ndimage.gaussian_filter(mask.astype(np.float32), 2.0), 0, 1)
    out = np.zeros(mask.shape + (4,), np.float32); out[..., :3] = col; out[..., 3] = 255 * ALPHA * s; return out

# geography: rivers teal
g = np.asarray(Image.open("assets/media/atlanta_geo_ref.png").convert("RGBA")).astype(np.int32)
riv = (np.abs(g[..., 0] - 96) < 30) & (np.abs(g[..., 1] - 150) < 30) & (np.abs(g[..., 2] - 190) < 30)
wat = (np.abs(g[..., 0] - 150) < 25) & (np.abs(g[..., 1] - 195) < 25) & (np.abs(g[..., 2] - 225) < 25)
g2 = g.copy(); g2[riv, :3] = (0x23, 0x63, 0x65); g2[wat, :3] = (0x3a, 0x9a, 0x96)
save(g2, "test_F_atlanta_geo.png")

for d in ("jul03", "jul10", "jul22", "aug64", "sep64"):
    us, cs = sides(ctl(d)); save(fill(us, F1C), f"test_F1_{d}.png"); save(fill(cs, F2C), f"test_F2_{d}.png")

J = json.load(open("assets/atlanta.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
BURST = {"jul03": (33.925, -84.440), "jul10": (33.830, -84.420)}     # Sope Creek crossing; Peachtree Creek / the advance on Atlanta
for b, a in (("jul03", "jul10"), ("jul10", "jul22")):
    usb, csb = sides(ctl(b)); usa, csa = sides(ctl(a))
    lost = ndimage.binary_opening(csb & usa, iterations=2)
    soft = np.clip(ndimage.gaussian_filter(lost.astype(np.float32), 3.0), 0, 1)
    m = np.zeros(lost.shape + (4,), np.float32); m[..., :3] = 255; m[..., 3] = 255 * soft; save(m, f"test_F_lost_{b}.png")
    fa = fill(usa, F1C); fa[..., 3] *= soft; save(fa, f"test_F1_{a}_flood.png")
    fb = fill(csb, F2C); r = fb.copy(); r[..., 3] *= (1 - soft); save(r, f"test_F2_{b}_rest.png")
    lp = fb.copy(); lp[..., 3] *= soft; save(lp, f"test_F2_{b}_lostpart.png")
    x, y = P(*BURST[b]); yy, xx = np.nonzero(lost)
    print(b, "->", a, "burst", (round(x, 1), round(y, 1)), "max radius", round(float(np.max(np.hypot(xx - x, yy - y))), 1), "lost px", int(lost.sum()))
