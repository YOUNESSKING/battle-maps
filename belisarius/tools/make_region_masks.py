"""Translucent political overlays for the Belisarius map scenes (c. 527 AD).

usage: python3 tools/make_region_masks.py   (uses cached tiles in tools/.tiles)
writes assets/emp_rome.png, emp_persia.png, emp_vandal.png, emp_goth.png  (for med.jpg)
       assets/meso_rome.png, meso_persia.png                              (for mesopotamia.jpg)
Region shapes are hand-drawn lat/lon polygons clipped to land, feathered, with a slightly darker rim.
"""
import json, math, os
import numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
BLUE, RED = (36, 86, 200), (196, 24, 32)


def load(name):
    P = json.load(open(f"{ROOT}/assets/{name}.json"))
    Z, (OX, OY), (W, H) = P["zoom"], P["origin_world_px"], P["size"]
    N = 256 * 2 ** Z

    def px(lat, lon):
        return (lon + 180) / 360 * N - OX, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * N - OY

    def tile(x, y):
        a = np.asarray(Image.open(f"{HERE}/.tiles/{Z}_{x}_{y}.png").convert("RGB"), float)
        return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768

    tx0, ty0, tx1, ty1 = OX // 256, OY // 256, (OX + W) // 256, (OY + H) // 256
    mosaic = np.vstack([np.hstack([tile(tx, ty) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
    elev = mosaic[OY - ty0 * 256:OY - ty0 * 256 + H, OX - tx0 * 256:OX - tx0 * 256 + W]
    land = elev > 0.5
    lab, n = ndimage.label(~land)  # low basins and lakes smaller than ~12k px count as land (no holes)
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
    small = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v < 12000])
    return px, land | small, (W, H)


def overlay(px, land, size, polys, rgb, alpha, name, feather=4):
    W, H = size
    poly = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(poly)
    for P in polys:
        d.polygon([px(la, lo) for la, lo in P], fill=255)
    sel = land & (np.asarray(poly) > 0)
    m = Image.fromarray((sel * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(feather))
    fill = np.asarray(m, float) / 255
    # rim: darker band along the region edge (inside), makes borders read cleanly
    inner = np.asarray(Image.fromarray((sel * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(7)), float) / 255
    rim = np.clip(fill - inner, 0, 1)
    rim = np.asarray(Image.fromarray((rim * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float) / 255
    a = np.clip(fill * alpha + rim * 0.45, 0, 1)
    out = np.zeros((H, W, 4), np.uint8)
    col = np.array(rgb, float)
    dark = col * 0.6
    out[..., :3] = (col * (1 - rim[..., None]) + dark * rim[..., None]).astype(np.uint8)
    out[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(f"{ROOT}/assets/{name}.png", optimize=True)
    print(name, "px", int(sel.sum()))


# shared Roman-Persian frontier, north to south
FRONTIER = [(41.45, 42.0), (40.6, 42.3), (39.9, 42.0), (39.2, 41.9), (38.6, 41.6), (37.9, 41.35),
            (37.12, 41.08), (36.6, 40.85), (36.0, 40.6), (35.15, 40.45)]
# Ostrogoth / Roman line in the Balkans (Sirmium Gothic, Singidunum Roman), north to south
DAL = [(45.0, 19.9), (44.6, 19.4), (43.9, 19.5), (43.0, 19.3), (42.1, 19.3)]

ROME = ([(45.25, 29.8), (44.2, 28.2), (43.75, 25.5), (43.95, 22.8), (44.7, 21.0)] + DAL +
        [(41.5, 19.2), (39.8, 19.1), (37.2, 20.3), (33.8, 19.3), (30.3, 19.2), (29.0, 20.6), (29.6, 25.0),
         (27.5, 29.3), (24.0, 31.8), (22.0, 31.8), (22.0, 33.6), (24.0, 35.4), (27.5, 34.6), (29.4, 35.1), (30.2, 36.5), (32.0, 37.6),
         (34.3, 38.8), (35.1, 40.2)] + FRONTIER[::-1] +
        [(42.0, 41.5), (42.6, 39.0), (43.2, 34.0), (43.6, 30.0)])
PERSIA = (FRONTIER + [(34.3, 41.1), (33.2, 42.3), (31.5, 44.0), (30.3, 46.0), (29.4, 47.6), (26.0, 50.0),
                      (25.0, 57.0), (37.8, 57.0), (38.5, 53.8), (42.0, 50.0), (43.0, 47.5), (42.8, 44.5), (42.6, 43.0)])
VANDAL = [[(36.9, 0.9), (35.9, 1.0), (35.2, 5.0), (34.5, 7.4), (33.6, 9.6), (32.4, 11.2), (31.6, 13.6),
           (30.9, 16.0), (30.2, 18.8), (31.6, 19.3), (33.6, 15.6), (36.2, 12.6), (37.6, 11.3), (37.9, 9.9),
           (37.4, 5.0), (37.1, 1.0)],
          [(43.3, 8.3), (43.3, 9.8), (38.7, 10.0), (38.7, 7.9)],
          [(40.3, 1.1), (40.3, 4.6), (38.4, 4.6), (38.4, 1.1)]]
GOTH = ([(43.7, 7.3), (44.1, 7.6), (45.1, 6.8), (46.0, 7.0), (46.5, 8.6), (47.0, 10.2), (47.2, 12.2), (46.9, 14.2),
         (46.4, 16.0), (45.6, 17.8)] + DAL +
        [(40.4, 19.2), (39.0, 17.4), (37.6, 16.4), (36.5, 15.3), (36.4, 14.4), (37.2, 12.1), (38.3, 12.1),
         (39.2, 12.4), (41.1, 11.3), (42.5, 10.15), (43.9, 9.2)])

px, land, size = load("med")
overlay(px, land, size, [ROME], BLUE, 0.36, "emp_rome")
overlay(px, land, size, [PERSIA], RED, 0.36, "emp_persia")
overlay(px, land, size, VANDAL, RED, 0.36, "emp_vandal")
overlay(px, land, size, [GOTH], RED, 0.36, "emp_goth")

px, land, size = load("mesopotamia")
W_EDGE = [(41.5, 30.0), (41.5, 38.0)] + [(la, lo) for la, lo in FRONTIER] + [(30.0, 40.45), (30.0, 30.0)]
E_EDGE = [(41.5, 50.0), (41.5, 42.0)] + FRONTIER[1:] + [(30.0, 40.45), (30.0, 50.0)]
overlay(px, land, size, [W_EDGE], BLUE, 0.22, "meso_rome", feather=3)
overlay(px, land, size, [E_EDGE], RED, 0.22, "meso_persia", feather=3)
