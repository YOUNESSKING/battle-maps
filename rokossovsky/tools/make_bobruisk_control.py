"""Who holds the ground on the bobruisk map (z9 Belarus), per date (STYLE_LOCK 2 + 2a option 1, multiply `_mx` look).
usage: python3 tools/make_bobruisk_control.py
-> assets/media/bobruisk_ctl_<state>_mx.png (2880x1620, map px): Axis (232,52,52) alpha 172 -> 234 at the front, a bright red
   rim on the German side of the front, Soviet (110,160,255) alpha 144; draw with mixBlendMode = "multiply".
-> assets/media/bobruisk_front_<state>.json: the front polylines (map px, north -> south, Soviet side on the LEFT of travel =
   K.front sideA "carth") for option 2 close-ups.
Fronts (lon, lat) are logged with sources in research/FACT_NOTES_bobruisk.md (approximate, standard situation maps)."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

Z, OX, OY, W, H = 9, 74836, 41886, 2880, 1620
def P(lon, lat):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

# 22 June 1944, the eve of Bagration (north -> south; German-held = west of the line)
JUN22 = [(31.05, 54.45), (31.0, 54.2), (30.85, 53.98), (30.78, 53.80), (30.62, 53.62), (30.45, 53.45), (30.25, 53.33),
         (30.05, 53.27), (29.90, 53.20), (29.86, 53.10), (29.93, 53.00), (30.08, 52.93), (30.10, 52.84), (30.02, 52.76),
         (29.85, 52.72), (29.66, 52.70), (29.52, 52.71), (29.36, 52.70), (29.18, 52.62), (29.02, 52.52), (28.80, 52.38),
         (28.62, 52.22), (28.45, 52.10), (28.0, 52.10), (27.5, 52.06), (27.0, 51.98), (26.55, 51.80), (26.2, 51.55)]
# 4 July 1944: Minsk freed (3 July); German 4th Army pocket east of Minsk; front west of Minsk - Stolbtsy - Nesvizh - Pripyat
JUL4 = [(26.95, 54.45), (27.10, 54.10), (27.20, 53.85), (27.05, 53.60), (26.80, 53.40), (26.62, 53.15), (26.75, 52.85),
        (27.05, 52.55), (27.35, 52.25), (27.55, 52.05), (27.20, 51.90), (26.55, 51.80), (26.2, 51.55)]
MINSK_POCKET = [(27.78, 53.98), (28.20, 54.07), (28.75, 53.98), (28.95, 53.80), (28.70, 53.60), (28.20, 53.58), (27.85, 53.72)]
STATES = {"jun22": (JUN22, []), "jul4": (JUL4, [MINSK_POCKET]), "jul31": (None, [])}

def soviet_mask(front, pockets):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    if front is None: d.rectangle((0, 0, W, H), fill=255)
    else:
        pts = [P(*q) for q in front]
        d.polygon(pts + [(W + 400, pts[-1][1]), (W + 400, -400), (pts[0][0], -400)], fill=255)
    for pk in pockets: d.polygon([P(*q) for q in pk], fill=0)
    return np.array(im) > 0

def build(name, sov):
    land = np.ones((H, W), bool)
    lp = "assets/bobruisk_land.png"
    try: land = np.array(Image.open(lp).convert("L")) > 127
    except FileNotFoundError: pass
    ax = land & ~sov; al = land & sov
    out = np.zeros((H, W, 4), np.float32)
    d_ax = ndimage.distance_transform_edt(~al) if al.any() else np.full((H, W), 1e9)
    out[ax, :3] = (232, 52, 52); out[ax, 3] = (172 + 62 * np.exp(-d_ax / 40.0))[ax]
    out[al, :3] = (110, 160, 255); out[al, 3] = 144
    if al.any() and ax.any():
        rim = ndimage.gaussian_filter((ax & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), 5) * 3.0
        rim = np.clip(rim, 0, 1) * land
        sel = rim > 0.05; out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array([255, 120, 100]) * rim[sel, None]
        out[sel, 3] = np.maximum(out[sel, 3], 234 * rim[sel])
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/bobruisk_ctl_{name}_mx.png", optimize=True)

for name, (front, pockets) in STATES.items():
    build(name, soviet_mask(front, pockets))
    lines = []
    if front: lines.append([[round(c, 1) for c in P(*q)] for q in front])
    for pk in pockets:  # pocket ring, clockwise on screen so the Soviet side (outside) is on the left of travel
        ring = [[round(c, 1) for c in P(*q)] for q in pk]; ring.append(ring[0]); lines.append(ring)
    json.dump(lines, open(f"assets/media/bobruisk_front_{name}.json", "w"))
    print("wrote", name)
