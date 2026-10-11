"""Who holds the ground for Collins move 3 (Celles, Battle of the Bulge) and the ending, per date (STYLE_LOCK 2 + 2a, option 1,
the multiply `_mx` look of rokossovsky/tools/make_east_control.py + make_bobruisk_control.py).
usage (from collins/): python3 tools/make_bulge_control.py
-> assets/media/ard_ctl_<state>_mx.png     ardennes map (z10): dec16 (start line), dec24 (the Bulge at its deepest, Bastogne
                                           encircled), dec27 (Celles tip cut off, Bastogne relieved 26 Dec)
-> assets/media/ard_front_<state>.json     front polylines (ardennes map px) for option-2 close-ups (K.front)
-> assets/media/bulge_eu_<state>_mx.png    europe map (z6): jun44 (26 Jun, Cherbourg), jul44 (25 Jul, Cobra), dec16, dec24
Colours: Axis (232,52,52) strongest at the front with a light red rim, Allied (110,160,255), neutrals uncoloured; draw with
mixBlendMode = "multiply". Borders: world_1938 (aourednik/historical-basemaps, GPL-3, assets/src/world_1938.geojson).
Every front line and its sources: research/FACT_NOTES_ardennes.md (approximate, a few km on the ardennes map, ~10-20 km on europe)."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

AX, SO, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

# ---------------- the Western Front (lon, lat), north -> south; German-held = EAST of the line ----------------
NL_ROER = [(2.6, 53.6), (3.9, 51.78), (4.6, 51.70), (5.3, 51.76), (5.75, 51.90), (6.02, 51.85), (6.10, 51.60), (6.05, 51.40),
           (5.95, 51.15), (6.10, 51.00), (6.30, 50.92), (6.45, 50.80), (6.40, 50.66)]           # Maas / Nijmegen / Roer, Dec 1944
START = [(6.24, 50.55), (6.27, 50.42), (6.38, 50.30), (6.18, 50.18), (6.13, 50.06), (6.18, 49.94), (6.30, 49.84), (6.42, 49.80)]  # 16 Dec
SAAR_ALSACE = [(6.50, 49.68), (6.40, 49.48), (6.62, 49.38), (6.78, 49.30), (7.00, 49.15), (7.40, 49.10), (7.95, 49.03), (8.18, 48.97),
               (7.82, 48.62), (7.72, 48.40), (7.40, 48.30), (7.15, 48.10), (7.25, 47.82), (7.55, 47.59)]  # Saar bridgeheads, Colmar pocket
ALPS = [(7.0, 46.2), (6.85, 45.85), (7.10, 45.40), (6.65, 45.10), (6.95, 44.40), (7.45, 43.78)]   # Franco-Italian Alps (Germans hold the Italian side)
WEST = {"dec": NL_ROER + START + SAAR_ALSACE + ALPS}
# The German salient on 24 Dec (lon, lat), from the north shoulder (Monschau) round the tip at Foy-Notre-Dame / Celles to the
# south shoulder (Echternach); closed back along the 16 Dec start line. Bastogne (US) is cut out as a pocket.
BULGE24 = [(6.24, 50.55), (6.20, 50.46), (6.06, 50.44), (5.93, 50.41), (5.86, 50.36), (5.72, 50.31), (5.60, 50.29), (5.47, 50.25),
           (5.36, 50.21), (5.24, 50.21), (5.14, 50.24), (5.07, 50.26), (4.99, 50.265), (4.95, 50.245), (4.97, 50.21), (5.05, 50.17),
           (5.12, 50.12), (5.20, 50.08), (5.30, 50.01), (5.42, 49.96), (5.55, 49.95), (5.65, 49.90), (5.80, 49.87), (6.00, 49.86),
           (6.10, 49.84), (6.25, 49.82), (6.42, 49.80)] + START[::-1]
BASTOGNE = [(5.64, 50.03), (5.72, 50.055), (5.79, 50.03), (5.81, 49.99), (5.77, 49.95), (5.70, 49.945), (5.64, 49.97)]
# 27 Dec: the Celles / Foy tip destroyed (2nd Armored back to Humain - Rochefort road), Bastogne relieved from the south (26 Dec)
BULGE27 = BULGE24[:9] + [(5.28, 50.20), (5.22, 50.17), (5.19, 50.12)] + BULGE24[17:]
BASTOGNE27 = BASTOGNE[:4] + [(5.78, 49.86), (5.70, 49.86)] + BASTOGNE[4:]   # the 4th Armored corridor (Assenois) to the south

# Normandy lodgement (Allied, inside occupied France): 26 Jun 1944 and 25 Jul 1944 (the eve of Cobra)
NORM_JUN = [(-1.95, 49.80), (-1.66, 49.30), (-1.45, 49.27), (-1.30, 49.26), (-1.18, 49.22), (-1.05, 49.17), (-0.86, 49.10),
            (-0.72, 49.12), (-0.56, 49.17), (-0.42, 49.21), (-0.33, 49.22), (-0.22, 49.22), (-0.15, 49.30), (0.2, 49.6)]
NORM_JUL = [(-1.95, 49.80), (-1.62, 49.21), (-1.53, 49.22), (-1.32, 49.19), (-1.18, 49.13), (-1.09, 49.10), (-0.92, 49.07),
            (-0.80, 49.08), (-0.62, 49.08), (-0.45, 49.10), (-0.30, 49.11), (-0.15, 49.16), (-0.08, 49.28), (0.2, 49.6)]
# Italy: Allied-held south of the line (+ Sardinia, Corsica)
def italy(line): return [(7.6, 36.0), (7.6, 43.25), (9.9, 43.25)] + line + [(14.6, 42.6), (19.0, 40.0), (19.0, 36.0)]
ITALY = {"jun44": italy([(10.50, 42.95), (11.30, 43.00), (12.10, 43.15), (13.20, 43.20), (13.85, 43.10)]),      # Trasimeno line
         "jul44": italy([(10.30, 43.68), (11.25, 43.74), (12.20, 43.62), (13.30, 43.65), (13.55, 43.66)]),      # Arno, Ancona taken 18 Jul
         "dec44": italy([(10.15, 44.05), (11.00, 44.15), (11.55, 44.28), (12.20, 44.40), (12.30, 44.50)])}      # winter line, Ravenna 5 Dec
# Eastern Front (lon, lat), north -> south; Axis = WEST of it
EAST = {
 "jun44": [(31.0, 71), (31.0, 69.4), (30.2, 67.0), (34.4, 62.9), (33.0, 61.0), (31.5, 60.6), (29.2, 60.2), (28.2, 59.4), (27.6, 58.9),
           (27.8, 58.0), (28.6, 57.8), (28.6, 56.6), (29.5, 55.7), (28.9, 55.0), (28.0, 54.2), (27.6, 53.6), (27.5, 53.1), (27.5, 52.0),
           (25.3, 51.2), (25.6, 50.5), (25.2, 49.6), (25.0, 48.5), (25.9, 47.9), (27.3, 47.3), (28.6, 47.1), (29.6, 46.8), (30.3, 46.3), (31.0, 45.5)],
 "jul44": [(29.0, 71), (28.2, 59.4), (27.6, 58.9), (27.0, 57.6), (26.5, 56.0), (24.2, 54.9), (23.6, 53.9), (23.4, 52.9), (22.3, 52.3),
           (21.7, 51.5), (21.9, 50.8), (22.4, 50.0), (24.0, 49.6), (24.5, 48.8), (25.0, 48.3), (25.9, 47.9), (27.3, 47.3), (28.6, 47.1),
           (29.6, 46.8), (30.3, 46.3), (31.0, 45.5)],
 "dec44": [(25.0, 71), (22.0, 58.5), (21.3, 56.6), (21.6, 55.6), (22.3, 55.0), (22.6, 54.4), (21.9, 53.5), (21.2, 52.8), (21.05, 52.25),
           (21.35, 51.70), (21.85, 51.20), (21.30, 50.60), (21.30, 50.20), (21.50, 49.60), (21.90, 49.10), (21.30, 48.50), (20.70, 48.15),
           (19.60, 47.90), (18.80, 47.70), (18.70, 47.40), (18.10, 47.05), (17.40, 46.65), (17.60, 46.00), (18.70, 45.60), (19.30, 45.20),
           (19.40, 44.50), (19.25, 43.80), (18.95, 43.30), (19.30, 42.50), (19.00, 41.90), (18.0, 40.0)],
}
AXIS0 = {"Germany", "Czechoslovakia", "Poland", "France", "Belgium", "Netherlands", "Luxembourg", "Denmark", "Norway", "Yugoslavia",
         "Greece", "Albania", "Italy", "Hungary", "Romania", "Bulgaria", "Finland", "Estonia", "Latvia", "Lithuania"}
NEUTRAL = {"Spain", "Portugal", "Switzerland", "Sweden", "Turkey", "Ireland", "Andorra"}
SWITCH = {"dec44": {"Romania": "allied", "Bulgaria": "allied", "Finland": "neutral"}}   # 23 Aug / 9 Sep / 4 Sep 1944
COURLAND = [(21.0, 57.6), (22.6, 57.6), (23.3, 56.9), (22.6, 56.4), (21.0, 56.4)]           # Axis pocket, Dec 1944 (+ Memel)


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]; self.W, self.H = J["size"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L")) > 127
    def P(self, lon, lat):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)
    def poly(self, polys):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0

def countries(M, feats, state):
    side = {k: Image.new("L", (M.W, M.H), 0) for k in ("axis", "neutral", "ussr")}; dr = {k: ImageDraw.Draw(v) for k, v in side.items()}
    for f in feats:
        nm = str(f["properties"]["NAME"]); s = SWITCH.get(state, {}).get(nm) or ("axis" if nm in AXIS0 else "neutral" if nm in NEUTRAL else "ussr" if nm == "USSR" else None)
        if s not in dr: continue
        g = f["geometry"]
        for poly in (g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]):
            ring = [M.P(*c[:2]) for c in poly[0]]
            if len(ring) > 2: dr[s].polygon(ring, fill=255)
    return {k: np.array(v) > 0 for k, v in side.items()}

def save(M, path, axis, al, rim_it=3, rim_sig=6):   # europe: a thin rim (rim_it 1, rim_sig 2) so the narrow Bulge reads solid red
    land = M.land; axis &= land; al &= land & ~axis
    d_ax = ndimage.distance_transform_edt(~al) if al.any() else np.full(axis.shape, 1e9)
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[axis, :3] = AX; out[axis, 3] = (0.36 + 0.24 * np.exp(-d_ax / 40.0))[axis]
    out[al, :3] = SO; out[al, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((axis & ndimage.binary_dilation(al, iterations=rim_it)).astype(np.float32), rim_sig) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)          # the approved _mx strength
    out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "axis px", int(axis.sum()), "allied px", int(al.sum()))

def europe(feats):
    M = Map("europe")
    for state in ("jun44", "jul44", "dec16", "dec24"):
        key = "dec44" if state.startswith("dec") else state
        c = countries(M, feats, key)
        west_of_east = M.poly([EAST[key] + [(-30, 30), (-30, 75)]])
        axis = (c["axis"] | (c["ussr"] & west_of_east)) & west_of_east & ~c["neutral"]
        if key == "dec44":
            wl = WEST["dec"]; east_of_west = M.poly([wl + [(wl[-1][0], 30), (60, 30), (60, 75), (wl[0][0], 75)]])
            axis &= east_of_west
            if state == "dec24": axis |= M.poly([BULGE24]) & ~M.poly([BASTOGNE])
            axis |= M.poly([COURLAND])
        axis &= ~M.poly([ITALY[key]])
        if key == "jun44": axis &= ~M.poly([NORM_JUN])
        if key == "jul44": axis &= ~M.poly([NORM_JUL])
        axis &= M.poly([[(-12, 36.2), (40, 36.2), (40, 75), (-12, 75)]])   # not North Africa
        al = M.land & ~axis & ~c["neutral"]
        save(M, f"assets/media/bulge_eu_{state}_mx.png", axis, al, 1, 2)

def ardennes():
    M = Map("ardennes")
    wl = WEST["dec"]; base = M.poly([wl + [(wl[-1][0], 30), (60, 30), (60, 75), (wl[0][0], 75)]])
    states = {"dec16": (base, []), "dec24": (base | (M.poly([BULGE24]) & ~M.poly([BASTOGNE])), [BULGE24, BASTOGNE]),
              "dec27": (base | (M.poly([BULGE27]) & ~M.poly([BASTOGNE27])), [BULGE27])}
    for state, (axis, lines) in states.items():
        save(M, f"assets/media/ard_ctl_{state}_mx.png", axis.copy(), ~axis)
        fr = []
        if state == "dec16": fr.append([[round(c, 1) for c in M.P(*q)] for q in [(6.30, 50.95), (6.45, 50.80), (6.40, 50.66)] + START + [(6.50, 49.68), (6.40, 49.48), (6.62, 49.38)]])
        else:
            b = BULGE24 if state == "dec24" else BULGE27
            fr.append([[round(c, 1) for c in M.P(*q)] for q in [(6.30, 50.95), (6.45, 50.80), (6.40, 50.66)] + b[:len(b) - len(START) + 1] + [(6.50, 49.68), (6.40, 49.48), (6.62, 49.38)]])
            if state == "dec24": r = [[round(c, 1) for c in M.P(*q)] for q in BASTOGNE]; fr.append(r + [r[0]])
        json.dump(fr, open(f"assets/media/ard_front_{state}.json", "w"))

if __name__ == "__main__":
    feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    ardennes(); europe(feats)
