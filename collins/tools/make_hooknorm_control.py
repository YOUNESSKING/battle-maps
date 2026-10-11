"""Who holds the ground in the Collins hook (STYLE_LOCK 2 + 2a option 1, the Rokossovsky multiply `_mx` look).
usage: python3 tools/make_hooknorm_control.py
Normandy (z10, origin 128794,88848; basemap normandy_hd_ref):
  -> assets/media/hooknorm_ctl_<state>_mx.png  (jul24 = eve of Cobra, jul31 = Avranches reached)
  -> assets/media/hooknorm_front_<state>.json  the front polyline (map px, west -> east, Allied side on the LEFT of travel =
     K.front sideA "carth") for option 2 close-ups.
Europe (z6, origin 7093,5051; basemap europe_hd_ref), for hook-b's three snap cuts:
  -> assets/media/hooknorm_eu_ctl_<state>_mx.png  (jun26 = Cherbourg falls, jul25 = Cobra, dec24 = the Bulge at its deepest)
Look: Axis (232,52,52) strongest at the front with a light red rim, Allied (110,160,255), neutrals plain terrain; draw with
mixBlendMode "multiply". Fronts (lon, lat) are approximate (standard situation maps, US Army green books) and logged in
research/FACT_NOTES_hook.md. Europe borders: world_1938 (aourednik/historical-basemaps, GPL-3) via tools/make_europe_control.py."""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, "tools")
import make_europe_control as EC

W, H = 2880, 1620
AX, SO, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

def proj(z, ox, oy):
    def P(lon, lat):
        n = 256 * 2 ** z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
    return P
PN = proj(10, 128794, 88848)

def build(name, land, allied, axis=None):
    axis = (land & ~allied) if axis is None else (land & axis & ~allied); al = land & allied
    d_ax = ndimage.distance_transform_edt(~al) if al.any() else np.full((H, W), 1e9)
    a = np.where(axis, 0.36 + 0.24 * np.exp(-d_ax / 40.0), 0.0) + np.where(al, 0.30, 0.0)
    out = np.zeros((H, W, 4), np.float32)
    out[axis, :3] = AX; out[al, :3] = SO; out[..., 3] = np.minimum(a * 1.9, 234 / 255)
    if al.any() and axis.any():
        rim = np.clip(ndimage.gaussian_filter((axis & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), 6) * 3.0, 0, 1) * land
        sel = rim > 0.02
        out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM) * rim[sel, None]
        out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
        out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}.png", optimize=True)
    print("wrote", name, "axis px", int(axis.sum()), "allied px", int(al.sum()))

# ---------------- Normandy fronts (lon, lat), west -> east; Allied ground = north of the line ----------------
# 24 July 1944, eve of Cobra: VIII Corps north of Lessay / Periers, VII Corps just north of the Saint-Lo - Periers road (pulled
# back ~1,200 yd for the bombing), Saint-Lo in US hands (since 18-19 July), Caumont, British/Canadian line south of Caen after
# Goodwood (Bourguebus ridge German), east of the Orne to the coast near Franceville.
JUL24 = [(-1.66, 49.245), (-1.56, 49.24), (-1.47, 49.215), (-1.40, 49.20), (-1.32, 49.17), (-1.24, 49.15), (-1.16, 49.13),
         (-1.10, 49.105), (-1.03, 49.10), (-0.95, 49.10), (-0.86, 49.09), (-0.78, 49.09), (-0.70, 49.10), (-0.62, 49.12),
         (-0.52, 49.13), (-0.42, 49.13), (-0.34, 49.135), (-0.27, 49.12), (-0.21, 49.14), (-0.17, 49.17), (-0.17, 49.21),
         (-0.13, 49.26), (-0.10, 49.31)]
# 31 July 1944: Avranches taken (30-31 July), Pontaubault bridge (31 July), VII Corps at Villedieu / Percy / Tessy,
# British Bluecoat (from 30 July) south of Caumont; the rest of the line as on 24 July.
JUL31 = [(-1.55, 48.64), (-1.42, 48.635), (-1.33, 48.66), (-1.24, 48.72), (-1.20, 48.80), (-1.17, 48.88), (-1.10, 48.93),
         (-1.03, 48.96), (-0.94, 48.99), (-0.86, 48.97), (-0.78, 49.00), (-0.68, 49.05), (-0.60, 49.10),
         (-0.52, 49.13), (-0.42, 49.13), (-0.34, 49.135), (-0.27, 49.12), (-0.21, 49.14), (-0.17, 49.17), (-0.17, 49.21),
         (-0.13, 49.26), (-0.10, 49.31)]
NSTATES = {"jul24": JUL24, "jul31": JUL31}

def north_of(front, P):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    pts = [P(*q) for q in front]
    # close over the top of the map (the Channel)
    # (west closure at lon -1.98: the Channel Islands stay German-occupied)
    wx = P(-1.98, 49.5)[0]
    west = [P(-1.98, 49.0), P(-1.70, 48.75)] if front[0][1] < 48.9 else [(wx, pts[0][1])]   # keep Cancale / Saint-Malo German
    poly = [(wx, -400)] + west + pts + [(pts[-1][0], -400)]
    d.polygon(poly, fill=255)
    return np.array(im) > 0

# ---------------- Europe (Western Front) ----------------
NORM_JUN26 = [(-2.2, 49.30), (-1.66, 49.30), (-1.45, 49.28), (-1.30, 49.27), (-1.10, 49.20), (-0.80, 49.13), (-0.62, 49.17),
              (-0.45, 49.19), (-0.33, 49.22), (-0.20, 49.22), (-0.10, 49.29), (-0.2, 49.8), (-2.2, 49.8)]
NORM_JUL25 = [(-2.2, 49.24), (-1.56, 49.24), (-1.40, 49.20), (-1.10, 49.105), (-0.86, 49.09), (-0.62, 49.12), (-0.42, 49.13),
              (-0.27, 49.12), (-0.17, 49.17), (-0.10, 49.31), (-0.2, 49.8), (-2.2, 49.8)]
ITALY_JUN = EC.POCKETS["jun44"][0]
# 24 Dec 1944: everything west of this line Allied (France, Belgium, Luxembourg, the Netherlands south of the Maas), with the
# Ardennes salient at its deepest (tip at Celles / Foy-Notre-Dame, 4-5 miles from the Meuse at Dinant), Bastogne encircled,
# the Saar front, northern Alsace, the Colmar pocket German, French Alps border, Italy at the winter line south of Bologna.
WEST_DEC24 = [(-6, 51.75), (3.9, 51.75), (4.6, 51.72), (5.3, 51.75), (5.9, 51.84), (5.98, 51.6), (6.05, 51.35), (5.95, 51.1),
              (6.1, 50.92), (6.35, 50.8), (6.27, 50.55), (6.2, 50.45), (5.95, 50.40), (5.70, 50.32), (5.45, 50.27), (5.30, 50.25),
              (5.05, 50.27), (4.93, 50.23), (5.02, 50.17), (5.20, 50.12), (5.33, 50.02), (5.50, 49.90), (5.85, 49.87), (6.13, 49.86),
              (6.42, 49.80), (6.50, 49.60), (6.62, 49.45), (6.75, 49.32), (7.0, 49.20), (7.43, 49.08), (7.95, 49.04), (8.18, 48.97),
              (7.85, 48.62), (7.68, 48.38), (7.30, 48.27), (7.12, 48.10), (7.22, 47.85), (7.50, 47.72), (7.58, 47.55), (6.95, 47.25),
              (6.9, 46.4), (6.8, 45.0), (7.3, 43.8), (7.52, 43.78), (8.5, 41.0), (5, 40), (-6, 42)]
BASTOGNE = [(5.62, 50.05), (5.80, 50.05), (5.82, 49.96), (5.62, 49.95)]
ITALY_DEC = [(6, 36), (6, 41.15), (9.6, 41.15), (9.6, 43.1), (8.4, 43.1), (8.4, 41.3), (10.2, 44.0), (10.7, 44.08), (11.3, 44.22),
             (11.9, 44.30), (12.25, 44.45), (14.0, 42.8), (19, 40), (19, 36)]
EU = {"jun26": ("jun44", [ITALY_JUN, NORM_JUN26], {}),
      "jul25": ("jun44", [ITALY_JUN, NORM_JUL25], {}),
      "dec24": ("sep44", [WEST_DEC24, ITALY_DEC, BASTOGNE], {"Romania": "allied", "Bulgaria": "allied", "Finland": "neutral", "Greece": "allied"})}

if __name__ == "__main__":
    nland = np.array(Image.open("assets/normandy_land.png").convert("L")) > 127
    for s, fr in NSTATES.items():
        build(f"hooknorm_ctl_{s}_mx", nland, north_of(fr, PN))
        line = [[round(c, 1) for c in PN(*q)] for q in fr]
        # K.front sideA = LEFT of travel; travelling west -> east with the Allies to the north puts blue on the left (screen up)
        json.dump(line, open(f"assets/media/hooknorm_front_{s}.json", "w"))
    feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    eland = np.array(Image.open("assets/europe_land.png").convert("L")) > 127
    EC.RETURN_MASKS = True
    for s, (east, pockets, switch) in EU.items():
        EC.EAST[s] = EC.EAST[east]; EC.POCKETS[s] = pockets; EC.SWITCH[s] = switch
        m = EC.build(s, feats, eland)
        if s == "dec24":   # Soviet-held ground west of the old border (east Poland, Baltics), as EC does for sep44
            west = EC.poly_mask([EC.EAST[s] + [(-30, 30), (-30, 75)]])
            add = m["axis"] & ~west & EC.poly_mask([[(19.5, 40), (45, 40), (45, 75), (19.5, 75)]]) & ~EC.poly_mask([[(19, 45.6), (22.2, 45.6), (22.2, 48.6), (19, 48.6)]])
            m["allied"] |= add; m["axis"] &= ~add
        build(f"hooknorm_eu_ctl_{s}_mx", eland & ~m["neutral"], m["allied"] & ~m["neutral"], m["axis"])
