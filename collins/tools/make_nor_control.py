"""Who holds the ground on the normandy map (z10), 24 July and 31 July 1944 (STYLE_LOCK 2 + 2a option 1, multiply `_mx` look).
usage: python3 tools/make_nor_control.py
-> assets/media/nor_ctl_<state>_mx.png (2880x1620): Axis (232,52,52) alpha 172 -> 234 at the front + a bright rim on the German side,
   Allied (110,160,255) alpha 144; draw with mixBlendMode = "multiply". Clipped to land (assets/normandy_land.png).
-> assets/media/nor_front_<state>.json: [front polyline] in map px, west -> east, Allied side on the LEFT of travel (K.front sideA "carth").
Fronts (lat, lon) are approximate situation-map lines, logged with sources in research/FACT_NOTES_cobra.md.
The Channel Islands stay German (occupied 1940-45): the Allied polygon closes offshore between the Cotentin and the islands."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
J = json.load(open("assets/normandy.json")); Z = J["zoom"]; OX, OY = J["origin_world_px"]; W, H = J["size"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
# 24 July 1944, eve of Cobra: Ay river (US north of Lessay) - north of Periers - north of the Periers-St-Lo road - south of St-Lo -
# Caumont (US) - north of Villers-Bocage (German) - Hill 112 - Caen southern suburbs (Goodwood, 18-20 July) - west of Troarn - Breville - coast
JUL24 = [(49.235, -1.72), (49.234, -1.56), (49.222, -1.48), (49.205, -1.41), (49.186, -1.33), (49.166, -1.25), (49.152, -1.19),
         (49.128, -1.13), (49.103, -1.09), (49.095, -1.03), (49.085, -0.95), (49.090, -0.86), (49.088, -0.79), (49.110, -0.72),
         (49.122, -0.62), (49.115, -0.52), (49.105, -0.46), (49.118, -0.38), (49.108, -0.31), (49.140, -0.24), (49.180, -0.205),
         (49.240, -0.215), (49.287, -0.19), (49.33, -0.19)]
# 31 July 1944: Avranches taken (30 July), Pontaubault bridge on the Selune (31 July) - Brecey - Villedieu - Percy - Tessy-sur-Vire -
# St-Martin-des-Besaces (British, Bluecoat 30-31 July) - Caumont, then the British/Canadian line as on 24 July
JUL31 = [(48.655, -1.62), (48.640, -1.45), (48.628, -1.35), (48.680, -1.22), (48.745, -1.13), (48.840, -1.15), (48.920, -1.15),
         (48.965, -1.06), (48.985, -0.95), (48.995, -0.85), (49.050, -0.78), (49.105, -0.70),
         (49.122, -0.62), (49.115, -0.52), (49.105, -0.46), (49.118, -0.38), (49.108, -0.31), (49.140, -0.24), (49.180, -0.205),
         (49.240, -0.215), (49.287, -0.19), (49.33, -0.19)]
# the Allied polygon closes offshore: east side up past the Orne mouth, west side up the Cotentin coast, east of Jersey / Alderney
EAST_UP = [(49.40, -0.19), (49.60, -0.45), (50.3, -0.45)]
WEST_UP_24 = [(50.3, -2.06), (49.75, -2.06), (49.60, -2.00), (49.40, -1.96), (49.30, -1.85)]
WEST_UP_31 = [(50.3, -2.06), (49.75, -2.06), (49.60, -2.00), (49.40, -1.96), (49.10, -1.75), (48.90, -1.70), (48.70, -1.66)]
STATES = {"jul24": (JUL24, WEST_UP_24), "jul31": (JUL31, WEST_UP_31)}
land = np.array(Image.open("assets/normandy_land.png").convert("L")) > 127
for name, (front, west) in STATES.items():
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    d.polygon([P(*q) for q in front + EAST_UP + west], fill=255)
    al = (np.array(im) > 0) & land; ax = land & ~al
    out = np.zeros((H, W, 4), np.float32)
    d_ax = ndimage.distance_transform_edt(~al)
    out[ax, :3] = (232, 52, 52); out[ax, 3] = (172 + 62 * np.exp(-d_ax / 40.0))[ax]
    out[al, :3] = (110, 160, 255); out[al, 3] = 144
    rim = ndimage.gaussian_filter((ax & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), 5) * 3.0
    rim = np.clip(rim, 0, 1) * land
    sel = rim > 0.05; out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array([255, 120, 100]) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], 234 * rim[sel])
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/nor_ctl_{name}_mx.png", optimize=True)
    json.dump([[[round(c, 1) for c in P(*q)] for q in front]], open(f"assets/media/nor_front_{name}.json", "w"))
    print("wrote", name)
