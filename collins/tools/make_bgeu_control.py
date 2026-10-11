"""BG-1 (Western Front overview, June 1944) on the europe basemap (z6): who holds the ground in mid-June 1944, option 1 multiply look.
Reuses tools/make_europe_control.py (read only: borders world_1938, eastern front 'jun44' = before Bagration, Italy north of Rome) with
the Normandy lodgement redrawn for ~12-14 June 1944 (Utah + Omaha linked at Carentan 12 June, Caumont 13 June, British short of Caen).
Also writes a small geography layer (capitals + big cities, small labels; 1944 names).
-> assets/media/bgeu_ctl_jun44_mx.png, assets/media/bgeu_geo.png      usage (from collins/): python3 tools/make_bgeu_control.py"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage
sys.path.insert(0, "tools")
import make_europe_control as EC

LODGE = [(-1.20, 49.53), (-1.285, 49.515), (-1.37, 49.48), (-1.44, 49.43), (-1.51, 49.395), (-1.46, 49.35), (-1.35, 49.30), (-1.24, 49.265),
         (-1.10, 49.22), (-0.95, 49.12), (-0.80, 49.10), (-0.60, 49.18), (-0.36, 49.23), (-0.15, 49.24), (-0.10, 49.30), (-0.10, 49.45)]
EC.POCKETS["jun44"] = [EC.POCKETS["jun44"][0], LODGE]
EC.RETURN_MASKS = True
AX, AL, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

if __name__ == "__main__":
    feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    land = np.array(Image.open("assets/europe_land.png").convert("L")) > 127
    m = EC.build("jun44", feats, land)
    axis, al = m["axis"] & land, m["allied"] & land
    ci = EC.poly_mask([[(-2.75, 49.15), (-1.95, 49.15), (-1.95, 49.75), (-2.75, 49.75)]]) & land   # Channel Islands: German-occupied
    axis |= ci; al &= ~ci
    H, W = land.shape
    d_ax = ndimage.distance_transform_edt(~al)
    a = np.where(axis, 0.36 + 0.24 * np.exp(-d_ax / 40.0), 0.0) + np.where(al, 0.30, 0.0)
    rim = ndimage.gaussian_filter((axis & ndimage.binary_dilation(al, iterations=2)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land
    out = np.zeros((H, W, 4), np.float32)
    out[axis, :3] = AX; out[al, :3] = AL; out[..., 3] = a
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255); out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save("assets/media/bgeu_ctl_jun44_mx.png", optimize=True)
    print("wrote bgeu_ctl_jun44_mx")
    # geography layer (2x), big cities only, small labels with a halo
    S = 2; im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); halo = Image.new("RGBA", im.size, (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(im), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    CITIES = [("LONDON", 51.507, -0.128, "r"), ("PARIS", 48.857, 2.352, "r"), ("BERLIN", 52.52, 13.405, "r"), ("ROME", 41.9, 12.5, "r"),
              ("MADRID", 40.417, -3.704, "r"), ("VIENNA", 48.208, 16.373, "r"), ("BRUSSELS", 50.85, 4.35, "r"), ("AMSTERDAM", 52.37, 4.9, "l"),
              ("WARSAW", 52.23, 21.01, "r"), ("PRAGUE", 50.075, 14.44, "l"), ("BUDAPEST", 47.5, 19.04, "r"), ("COPENHAGEN", 55.676, 12.568, "r"),
              ("LISBON", 38.72, -9.14, "r"), ("BERN", 46.95, 7.45, "l")]
    for nm, la, lo, side in CITIES:
        x, y = EC.P(lo, la); x, y = x * S, y * S
        if not (0 <= x < W * S and 0 <= y < H * S): continue
        r = 5; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=(10, 14, 16, 170))
        anc, tx = ("lm", x + 12) if side == "r" else ("rm", x - 12)
        hd.text((tx, y), nm, font=f, fill=(10, 14, 16, 220), anchor=anc); td.text((tx, y), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); halo.alpha_composite(im); halo.save("assets/media/bgeu_geo.png", optimize=True)
    print("wrote bgeu_geo")
