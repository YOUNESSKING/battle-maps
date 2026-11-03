"""Arnold #17 map agent a1_ (m1a, ending): who-controls-the-ground overlay, 1775 (option 1, multiply; shown at HALF strength, 2c).
British = the Province of Quebec (Canada) north of 45 N and of the Maine highlands + Nova Scotia; everything else on land = American.
Sea (DEM <= 0) and big lakes (det_riv) left clear. -> assets/media/a1_ctl_<map>_1775.png   usage: python3 tools/a1_make_control.py maine northeast"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
W, H = 2880, 1620
CANADA = [(49, -82), (45.0, -82), (45.0, -71.5), (45.3, -70.8), (45.9, -70.25), (46.4, -70.05), (47.45, -69.2), (47.1, -67.8), (45.6, -67.8),
          (45.1, -67.1), (44.5, -66.9), (43.5, -66.0), (40.0, -63.0), (49, -60)]
def proj(m):
    J = json.load(open(f"assets/{m}_hd_lift.json")); Z = J["zoom"]; OX, OY = J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P
def build(m):
    P = proj(m); land = np.ones((H, W), bool)
    if os.path.exists(f"assets/src/{m}_hd_elev.npy"):
        e = np.load(f"assets/src/{m}_hd_elev.npy").astype(np.float32); e = e.reshape(H, e.shape[0] // H, W, e.shape[1] // W).mean(axis=(1, 3)); land &= e > 0.5
    if os.path.exists(f"assets/media/{m}_det_riv.png"):
        a = np.array(Image.open(f"assets/media/{m}_det_riv.png").convert("RGBA").resize((W, H), Image.BILINEAR))[:, :, 3]; land &= a <= 110
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([P(*q) for q in CANADA], fill=255)
    gb = ndimage.gaussian_filter((np.array(im) > 0).astype(np.float32), 2) > 0.5; gb &= land; us = land & ~gb
    out = np.zeros((H, W, 4), np.float32); dU = ndimage.distance_transform_edt(~gb); dG = ndimage.distance_transform_edt(~us)
    out[us, :3] = (110, 160, 255); out[us, 3] = 0.565
    out[gb, :3] = (240, 105, 95); out[gb, 3] = (0.62 + 0.2 * np.exp(-dG / 40.0))[gb]
    rimU = us & (dU < 5); rimG = gb & (dG < 5)
    out[rimU, :3] = (70, 120, 235); out[rimU, 3] = 0.85; out[rimG, :3] = (215, 60, 55); out[rimG, 3] = 0.88
    a = ndimage.gaussian_filter(out[:, :, 3], 1.0); out[:, :, 3] = np.where(land, np.maximum(a, out[:, :, 3] * 0.9), a * 0.5)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/a1_ctl_{m}_1775.png", optimize=True)
    print("wrote", f"a1_ctl_{m}_1775.png", int(us.sum()), int(gb.sum()))
for m in sys.argv[1:]: build(m)
