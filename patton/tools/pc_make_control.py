"""Map agent C (Patton #15: hook-a, hook-b, move1f, ending). Who holds the ground on the `europe` map (z7) on 22-24 March 1945, the
option-1 multiply `_mx` look of tools/m2b_make_control.py (A4 light red Germany, Allied blue, red rim at the front; E1 tone-down in CSS);
neutral countries (Switzerland, Spain, Portugal, Ireland, Sweden) a faint grey.
Front 22 Mar 1945 (MacDonald, The Last Offensive; approximate to a few km, fine at z7): the Allies on the west bank of the Rhine from the
Waal/Maas line in the Netherlands (north Holland still German) to Switzerland, with the Remagen bridgehead (since 7 Mar) and the Oppenheim
bridgehead (night 22-23 Mar); Alsace Allied (Colmar pocket cleared Feb 1945); Italy: the Gothic Line (Massa - Senio - Comacchio);
the Soviets on the Oder (Kuestrin, Stettin) and in Hungary. Germany, Austria, Czechoslovakia, Denmark, Norway German-held.
Also copies the basemaps the hook scenes place as extra layers (build_scene copies only assets/media jpgs):
  assets/media/pc_<ard|bas|avr|opp>_relief.jpg
-> assets/media/pc_eur_ctl_mar45_mx.png
usage (from patton/): python3 tools/pc_make_control.py"""
import json, math, shutil
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

DE, AL, RIM, NEU = (240, 105, 95), (110, 160, 255), (255, 140, 120), (205, 202, 192)
J = json.load(open("assets/europe.json")) if False else json.load(open("assets/europe_hd_lift.json"))
Z, (OX, OY) = J["zoom"], J["origin_world_px"]; W, H = J["size"]
def P(lon, lat):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
def poly(polys):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for pts in polys: d.polygon([P(*q) for q in pts], fill=255)
    return np.array(im) > 0

# the western front, north -> south (lon, lat): Maas/Waal line, the Rhine, Remagen bridgehead, Oppenheim bridgehead, Basel, the Alps
WEST = [(2.6, 52.6), (3.9, 51.86), (4.6, 51.74), (5.3, 51.80), (5.85, 51.86), (6.15, 51.84), (6.45, 51.74), (6.62, 51.64), (6.74, 51.44),
        (6.78, 51.22), (6.97, 50.94), (7.12, 50.74), (7.20, 50.70), (7.40, 50.72), (7.52, 50.56), (7.40, 50.44), (7.60, 50.36),
        (7.75, 50.13), (7.90, 49.97), (8.27, 50.00), (8.32, 49.92), (8.44, 49.93), (8.46, 49.83), (8.37, 49.79), (8.38, 49.63),
        (8.45, 49.45), (8.40, 49.20), (8.20, 48.98), (7.95, 48.75), (7.75, 48.45), (7.58, 48.10), (7.58, 47.58), (7.0, 47.3),
        (6.9, 46.4), (7.0, 45.9), (6.65, 45.1), (7.0, 44.2), (7.52, 43.78), (7.6, 43.3)]
# Liguria and the Gothic Line, then the Adriatic, Yugoslavia/Hungary, the Oder, the Baltic, Scandinavia (Sweden neutral cut out)
EAST = [(8.6, 43.9), (10.15, 43.98), (10.6, 44.10), (11.2, 44.22), (11.7, 44.28), (12.0, 44.36), (12.25, 44.62), (13.4, 44.62),
        (15.5, 45.3), (17.5, 46.6), (18.9, 48.3), (17.6, 49.9), (16.6, 50.9), (15.0, 51.4), (14.65, 52.55), (14.55, 53.45), (14.3, 54.4),
        (16.0, 57.0), (20.0, 72.0), (2.0, 72.0)]
NEUTRAL = {"Switzerland", "Spain", "Portugal", "Ireland", "Sweden", "Andorra"}

def main():
    land = np.array(Image.open("assets/europe_land.png").convert("RGBA").resize((W, H)))
    land = (land[..., 3] > 127) if land[..., 3].min() < 255 else (land[..., :3].mean(-1) > 127)
    feats = [f for f in json.load(open("/home/user/battle-maps/gavin/assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for f in feats:
        if str(f["properties"]["NAME"]) not in NEUTRAL: continue
        g = f["geometry"]; ps = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for pp in ps: d.polygon([P(*c[:2]) for c in pp[0]], fill=255)
    neu = (np.array(im) > 0) & land
    axis = poly([WEST + EAST]) & land & ~neu
    al = land & ~axis & ~neu
    dist = ndimage.distance_transform_edt(~al)
    k = 6.0
    out = np.zeros((H, W, 4), np.float32)
    out[axis, :3] = DE; out[axis, 3] = (0.32 + 0.22 * np.exp(-dist / (k * 6)))[axis]
    out[al, :3] = AL; out[al, 3] = 0.30
    out[neu, :3] = NEU; out[neu, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((axis & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), k * 0.6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save("assets/media/pc_eur_ctl_mar45_mx.png", optimize=True)
    print("wrote assets/media/pc_eur_ctl_mar45_mx.png", int(axis.sum()), int(al.sum()), int(neu.sum()))
    for m, s in (("ardennes", "ard"), ("bastogne", "bas"), ("avranches", "avr"), ("oppenheim", "opp")):
        shutil.copy(f"assets/{m}_hd_lift.jpg", f"assets/media/pc_{s}_relief.jpg")


if __name__ == "__main__":
    main()
