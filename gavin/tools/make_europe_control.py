"""Who controls Europe at each of Gavin's four jumps (owner request 2026-10: territory + flags on the Europe map).
Writes assets/media/europe_ctl_<state>.png (2880x1620, europe basemap world px): Allied slate / Axis brick / neutral grey tint
(locked TINT colours; strongest at the bloc border, lighter inside), a two-colour front band where Allies meet Axis, thin
country borders; clipped to land with assets/europe_land.png.
Borders: aourednik/historical-basemaps world_1938 (GPL-3, assets/src/world_1938.geojson). Front lines: approximate, from
standard WWII situation maps (see research/FACT_NOTES.md "Europe control map")."""
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

Z, OX, OY, W, H = 6, 7093, 5051, 2880, 1620
def P(lon, lat):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

AXIS0 = {"Germany", "Czechoslovakia", "Poland", "France", "Belgium", "Netherlands", "Luxembourg", "Denmark", "Norway", "Yugoslavia",
         "Greece", "Albania", "Italy", "Hungary", "Romania", "Bulgaria", "Finland", "Estonia", "Latvia", "Lithuania"}
ALLIED0 = {"United Kingdom", "USSR", "Algeria (France)", "Tunisia", "Libya", "Morocco (France)", "Egypt", "Syria (France)",
           "Mandatory Palestine (GB)", "Mesopotamia (GB)", "Iran"}
NEUTRAL0 = {"Spain", "Portugal", "Switzerland", "Sweden", "Turkey", "Ireland", "Andorra"}

# Eastern front, north to south (lon, lat); Axis-held = west of the line. Finnish front first, then Leningrad to the Black Sea.
EAST = {
 "jul43": [(31.0, 71), (31.0, 69.4), (30.2, 67.0), (34.4, 62.9), (33.0, 61.0), (31.5, 60.6), (30.5, 59.8), (31.5, 59.4), (31.3, 58.3),
           (31.2, 57.1), (30.8, 56.2), (31.2, 55.6), (32.4, 55.2), (34.0, 54.4), (34.7, 53.75), (36.0, 53.45), (36.8, 53.2), (37.0, 52.8),
           (36.4, 52.4), (35.0, 52.3), (34.5, 52.1), (34.8, 51.5), (35.4, 51.0), (36.6, 50.5), (36.9, 50.0), (37.4, 49.2), (38.4, 48.9),
           (38.8, 48.1), (38.9, 47.2), (38.0, 46.5), (36.0, 45.5), (34.0, 44.0)],
 "sep43": [(31.0, 71), (31.0, 69.4), (30.2, 67.0), (34.4, 62.9), (33.0, 61.0), (31.5, 60.6), (30.5, 59.8), (31.5, 59.4), (31.3, 58.3),
           (31.2, 57.1), (30.8, 56.2), (31.2, 55.6), (32.4, 55.2), (33.0, 54.5), (34.6, 53.4), (33.6, 52.3), (33.9, 51.7), (33.0, 51.1),
           (33.8, 50.6), (35.3, 49.7), (35.4, 49.3), (36.0, 48.6), (37.0, 47.7), (37.4, 47.1), (37.0, 46.5), (35.5, 45.4), (34.0, 44.0)],
 "jun44": [(31.0, 71), (31.0, 69.4), (30.2, 67.0), (34.4, 62.9), (33.0, 61.0), (31.5, 60.6), (29.2, 60.2), (28.2, 59.4), (27.6, 58.9),
           (27.8, 58.0), (28.6, 57.8), (28.6, 56.6), (29.5, 55.7), (30.5, 55.2), (31.0, 54.5), (31.0, 53.9), (30.4, 53.1), (30.0, 52.6),
           (27.5, 52.0), (25.3, 51.2), (25.6, 50.5), (25.2, 49.6), (25.0, 48.5), (25.9, 47.9), (27.3, 47.3), (28.6, 47.1), (29.6, 46.8),
           (30.3, 46.3), (31.0, 45.5)],
 "sep44": [(27.5, 61.0), (28.2, 59.4), (27.6, 58.9), (26.7, 58.4), (26.0, 57.8), (25.3, 57.2), (24.5, 56.6), (23.3, 55.9), (22.3, 55.4),
           (22.6, 54.7), (22.0, 53.9), (21.5, 53.1), (21.05, 52.25), (21.4, 51.7), (21.6, 50.6), (21.6, 50.0), (21.7, 49.4), (23.0, 48.9),
           (24.5, 47.9), (25.3, 47.0), (24.6, 46.6), (23.0, 46.6), (21.5, 46.2), (22.5, 44.6), (22.7, 44.0), (22.4, 42.3), (24.0, 41.6),
           (26.3, 41.7), (26.0, 40.6)],
}
# Allied-held ground inside the Axis area (lon, lat polygons)
POCKETS = {
 "jul43": [],
 "sep43": [[(12.2, 38.3), (15.7, 38.3), (15.7, 39.0), (16.6, 38.95), (16.0, 37.85), (15.6, 37.9), (15.1, 36.6), (12.2, 37.5)],  # Sicily + toe
           [(14.75, 40.55), (14.85, 40.75), (15.05, 40.7), (15.0, 40.35), (14.85, 40.4)],  # Salerno beachhead
           [(17.1, 40.55), (17.4, 40.55), (17.3, 40.35), (17.0, 40.4)]],  # Taranto
 "jun44": [[(6, 36), (6, 41.15), (9.6, 41.15), (9.6, 43.1), (8.4, 43.1), (8.4, 41.3), (11.75, 42.1), (12.7, 42.25), (13.4, 42.1), (14.3, 42.3),
            (14.6, 42.3), (19, 40), (19, 36)],  # southern Italy, Sardinia, Corsica
           [(-1.3, 49.42), (-1.15, 49.36), (-0.75, 49.28), (-0.25, 49.25), (-0.2, 49.33), (-0.6, 49.36), (-1.1, 49.45)]],  # Normandy beachheads
 "sep44": [[(-6, 42), (-6, 51), (1.6, 50.9), (2.5, 51.1),  # France +
            (3.5, 51.3), (4.4, 51.35), (5.3, 51.25), (5.9, 51.0), (6.1, 50.8), (6.2, 50.2), (6.3, 49.6), (5.95, 49.1), (6.2, 48.7),     # Belgium
            (6.4, 48.2), (6.6, 47.7), (7.0, 47.4), (7.0, 46.2), (6.8, 45.0), (7.3, 43.8), (7.5, 43.6), (8.5, 41.0), (12.0, 40.0), (5, 40), (-6, 42)],
           [(6, 36), (6, 41.15), (9.6, 41.15), (9.6, 43.1), (8.4, 43.1), (8.4, 41.3), (10.2, 43.95), (10.9, 43.95), (11.6, 44.0),     # Italy to
            (12.4, 43.95), (12.65, 43.98), (14.0, 42.8), (19, 40), (19, 36)]],                                                        # Gothic Line
}
SWITCH = {"sep44": {"Romania": "allied", "Bulgaria": "allied", "Finland": "neutral"}}  # Romania 23 Aug, Bulgaria 9 Sep, Finland ceasefire 4 Sep 1944
COL = {"allied": (74, 106, 154), "axis": (168, 80, 60), "neutral": (119, 116, 108)}
LINE = {"allied": (44, 87, 183), "axis": (188, 37, 40)}

def poly_mask(polys):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for pts in polys: d.polygon([P(*q) for q in pts], fill=255)
    return np.array(im) > 0

def build(state, feats, land):
    bloc = {k: Image.new("L", (W, H), 0) for k in COL}; dr = {k: ImageDraw.Draw(v) for k, v in bloc.items()}
    border = Image.new("L", (W, H), 0); bd = ImageDraw.Draw(border)
    for f in feats:
        nm = str(f["properties"]["NAME"]); g = f["geometry"]
        side = SWITCH.get(state, {}).get(nm) or ("axis" if nm in AXIS0 else "allied" if nm in ALLIED0 else "neutral" if nm in NEUTRAL0 else None)
        if not side: continue
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            ring = [P(*c[:2]) for c in poly[0]]
            if len(ring) > 2:
                dr[side].polygon(ring, fill=255); bd.line(ring + [ring[0]], fill=255, width=2)
    m = {k: np.array(v) > 0 for k, v in bloc.items()}
    ussr_west = poly_mask([EAST[state] + [(-30, 30), (-30, 75)]])
    m["axis"] |= m["allied"] & ussr_west & ~m["neutral"] & (np.array(bloc["allied"]) > 0) & poly_mask([[(15, 40), (45, 40), (45, 75), (15, 75)]])
    if state == "sep44":  # Soviet-held ground west of the old border (east Poland, Baltics)
        m["allied"] |= m["axis"] & ~ussr_west & poly_mask([[(19.5, 40), (45, 40), (45, 75), (19.5, 75)]]) & ~poly_mask([[(19, 45.6), (22.2, 45.6), (22.2, 48.6), (19, 48.6)]])  # not Hungary
    m["allied"] &= ~(m["axis"] & poly_mask([[(15, 40), (45, 40), (45, 75), (15, 75)]]) & ussr_west)
    pk = poly_mask(POCKETS[state]) if POCKETS[state] else np.zeros((H, W), bool)
    m["allied"] |= pk & m["axis"]; m["axis"] &= ~pk
    m["allied"] &= ~m["axis"]; m["neutral"] &= ~(m["axis"] | m["allied"])
    out = np.zeros((H, W, 4), np.float32)
    for side in ("neutral", "allied", "axis"):
        other = m["axis"] if side == "allied" else m["allied"] if side == "axis" else (m["axis"] | m["allied"])
        dist = ndimage.distance_transform_edt(~other) if side != "neutral" else np.full((H, W), 999.0)
        a = (0.30 + 0.22 * np.exp(-dist / 60.0)) if side != "neutral" else np.full((H, W), 0.26)
        a = np.where(m[side] & land, a, 0).astype(np.float32)
        a = np.array(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), np.float32) / 255
        c = np.array(COL[side], np.float32)
        sel = a > 0.004; out[sel, :3] = c; out[sel, 3] = a[sel]
    # two-colour front band where the blocs touch (Axis side red, Allied side blue), on land only
    for side, other in (("axis", "allied"), ("allied", "axis")):
        band = m[side] & ndimage.binary_dilation(m[other], iterations=5) & land
        out[band, :3] = LINE[side]; out[band, 3] = 0.85
    bb = (np.array(border) > 0) & land & (out[..., 3] < 0.8)
    out[bb, :3] = (40, 34, 26); out[bb, 3] = np.maximum(out[bb, 3], 0.28)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/europe_ctl_{state}.png", optimize=True)
    print("wrote", state)

if __name__ == "__main__":
    feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    land = np.array(Image.open("assets/europe_land.png").convert("L")) > 127
    for s in EAST: build(s, feats, land)
