"""Who holds the ground on the Eastern Front, per date, for the `east` overview map (option 1, STYLE_LOCK 2 + 2a).
Adapted from frontlines-1m/tools/make_europe_control.py + make_merge_assets.build (the approved europe_ctlm_jun5_mx look).
usage: python3 tools/make_east_control.py [STATE ...]     (run from rokossovsky/; default: every state)
-> assets/media/east_ctl_<state>_mx.png  2880x1620 RGBA, drawn with mixBlendMode "multiply": Axis (232,52,52) strongest at the front
   with a glowing red rim where it meets Soviet ground, Soviet (110,160,255), neutrals left as plain terrain; clipped to
   assets/east_land.png (big lakes cut out, see make_east_geo.py).
-> assets/media/east_ctl_<state>.png     the same in the plain overlay colours (Axis (140,12,20), Soviet (46,92,178)) for
   make_front_lines.py, if anyone needs option-2 lines from it.
Method: one front polyline per date (lon, lat), north to south; land west of it is Axis-held, east of it Soviet-held, minus
neutral countries (world_1938 borders: aourednik/historical-basemaps, GPL-3, assets/src/world_1938.geojson) and plus pocket
polygons (Soviet pockets behind the German front, Axis bridgeheads behind the Soviet front). Fronts are approximate (a few
km), drawn from standard situation maps; every line and its sources: research/FACT_NOTES_east.md."""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/east.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; W, H = J["size"]
def P(lon, lat):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

NEUTRAL = {"Sweden", "Switzerland", "Turkey", "Spain", "Portugal", "Ireland", "Andorra"}
NOSIDE = {"United Kingdom"}   # at war with Germany, but not part of this story: left uncoloured (kept off-screen by the cameras)
SWITCH = {"aug44": {"Bulgaria": "neutral"}}   # Bulgaria declared full neutrality on 26 Aug 1944 (Soviets invaded 8 Sep)

# shared pieces (lon, lat), north to south
FIN_1940 = [(30.9, 64.6), (31.4, 63.0), (30.9, 62.5), (30.67, 62.18), (30.1, 61.85), (29.55, 61.5), (29.1, 61.25), (28.75, 61.08),
            (28.3, 60.85), (27.85, 60.55)]                       # Moscow Peace border of March 1940 (Finland west of it)
SVIR_41 = [(35.6, 64.6), (35.0, 63.2), (34.6, 62.85), (35.2, 62.0), (35.45, 61.3), (34.6, 60.95), (33.55, 60.72), (32.95, 60.52)]  # Finns on the Svir / Onega
ISTHMUS_41 = [(31.0, 60.6), (30.55, 60.45), (30.25, 60.32), (29.95, 60.17), (29.75, 60.12)]   # Finns on the old 1939 border N of Leningrad
SIEGE_41 = [(29.95, 59.98), (30.15, 59.86), (30.33, 59.77), (30.6, 59.7), (30.85, 59.74), (30.98, 59.86), (31.05, 59.95)]  # Strelna-Pulkovo-Kolpino-Neva-Shlisselburg
VOLKHOV_N = [(31.27, 58.52), (31.3, 58.25), (31.45, 57.98)]        # Novgorod - Lake Ilmen
EAST = {
 # 22 June 1941: the Soviet border (Baltics, eastern Poland, Bessarabia + N. Bukovina, Karelian Isthmus all Soviet since 1939-40)
 "jun41": [(31.5, 75)] + FIN_1940 + [(26.5, 60.1), (24.5, 59.95), (22.0, 59.75), (20.6, 58.8), (20.4, 57.3), (20.8, 56.3), (21.06, 55.87),
           (21.3, 55.9), (21.75, 55.62), (21.95, 55.3), (22.1, 55.12), (22.6, 55.07), (22.85, 54.9), (22.75, 54.45), (23.1, 54.2),
           (22.8, 53.9), (22.4, 53.6), (22.0, 53.3), (21.85, 53.0), (22.03, 52.7), (22.6, 52.6), (23.2, 52.3), (23.62, 52.08), (23.62, 51.7),
           (23.55, 51.52), (23.65, 51.2), (23.95, 50.95), (24.1, 50.6), (24.0, 50.42), (23.44, 50.38), (23.1, 50.15), (22.97, 49.95),
           (22.77, 49.78), (22.55, 49.6), (22.25, 49.5), (22.6, 49.15), (22.86, 48.98), (23.4, 48.85), (24.0, 48.45), (24.6, 48.05),
           (24.9, 47.75), (25.4, 47.78), (25.9, 47.95), (26.4, 48.15), (26.8, 48.25), (27.25, 47.95), (27.6, 47.45), (27.85, 47.15),
           (28.1, 46.8), (28.15, 46.35), (28.2, 45.9), (28.2, 45.47), (28.7, 45.45), (29.3, 45.38), (29.7, 45.22), (30.6, 44.9), (31.0, 44.0), (31.0, 40.0)],
 # ~10 Oct 1941: Finns on the Svir, Leningrad besieged, Typhoon's pockets closed at Vyazma and Bryansk (7-9 Oct), Orel taken
 # 3 Oct, Mariupol 8 Oct, Crimea still Soviet behind Perekop, Odessa still holding (pocket)
 "oct41": SVIR_41 + [(31.6, 60.6)] + ISTHMUS_41 + SIEGE_41 + [(31.2, 59.9), (31.1, 59.75), (31.6, 59.62), (32.0, 59.45), (31.75, 59.05)]
          + VOLKHOV_N + [(31.75, 57.75), (32.2, 57.55), (32.7, 57.45), (33.0, 57.15), (33.4, 56.75), (34.1, 56.45), (34.25, 56.1),
          (34.6, 55.75), (35.15, 55.5), (35.4, 55.15), (35.5, 54.8), (36.1, 54.45), (36.2, 54.0), (36.3, 53.6), (36.75, 53.3), (36.6, 52.9),
          (36.3, 52.5), (35.7, 52.0), (35.2, 51.55), (34.9, 51.1), (34.95, 50.55), (35.3, 50.0), (35.6, 49.5), (35.9, 48.9), (36.2, 48.3),
          (36.9, 47.75), (37.75, 47.25), (37.8, 46.9), (36.0, 46.3), (34.8, 46.15), (33.7, 46.2), (33.0, 46.05), (31.6, 45.2), (31.0, 40.0)],
 # 5 Dec 1941: the high-water mark - Kalinin, Yakhroma/Krasnaya Polyana (~30 km from the Kremlin), Naro-Fominsk, Tula held on three
 # sides; Tikhvin (taken 8 Nov, retaken 9 Dec) still German; Rostov retaken 29 Nov (Mius line); all Crimea but Sevastopol German
 "dec41": SVIR_41 + [(31.6, 60.6)] + ISTHMUS_41 + SIEGE_41 + [(31.2, 59.9), (31.45, 59.82), (31.8, 59.9), (32.2, 59.85), (32.8, 59.75),
          (33.55, 59.8), (34.0, 59.6), (33.6, 59.3), (32.6, 59.22), (32.0, 59.15), (31.75, 59.0)] + VOLKHOV_N + [(31.75, 57.75),
          (32.3, 57.85), (32.9, 57.6), (33.0, 57.2), (33.6, 56.95), (34.6, 57.05), (35.5, 57.05), (36.15, 56.92), (36.45, 56.6),
          (36.9, 56.45), (37.35, 56.4), (37.5, 56.25), (37.42, 56.05), (37.25, 55.98), (37.05, 55.85), (36.88, 55.72), (36.7, 55.5),
          (36.85, 55.32), (36.95, 55.12), (37.1, 54.85), (37.15, 54.6), (37.4, 54.35), (37.7, 54.38), (38.1, 54.6), (38.4, 54.55),
          (38.7, 54.25), (39.1, 54.0), (38.9, 53.5), (38.55, 53.0), (38.75, 52.55), (38.1, 52.2), (37.6, 51.9), (37.4, 51.4), (37.2, 50.9),
          (37.1, 50.4), (37.05, 49.85), (37.3, 49.3), (37.8, 49.0), (38.3, 48.7), (38.7, 48.3), (38.85, 47.9), (38.85, 47.5), (39.05, 47.25),
          (38.0, 46.6), (36.8, 45.6), (36.55, 45.2), (36.2, 44.6), (35.0, 43.0), (31.0, 40.0)],
 # 4 July 1943, eve of Kursk: Leningrad land corridor (Jan 43), Rzhev and Demyansk salients gone (Mar 43), the Orel bulge and
 # the Kursk salient, Belgorod-Kharkov, the Donets and the Mius; Crimea and the Kuban bridgehead (pocket) German
 "jul43": SVIR_41 + [(31.6, 60.6)] + ISTHMUS_41 + [(29.95, 59.98), (30.15, 59.86), (30.33, 59.77), (30.6, 59.7), (30.85, 59.74), (31.0, 59.8),
          (31.15, 59.84), (31.4, 59.82), (31.6, 59.7), (32.0, 59.45), (31.75, 59.05)] + VOLKHOV_N + [(31.4, 57.7), (31.2, 57.3), (31.0, 56.9),
          (30.7, 56.45), (30.35, 56.3), (30.6, 56.0), (31.2, 55.65), (31.7, 55.35), (32.4, 55.2), (33.2, 54.75), (34.0, 54.45), (34.4, 54.15),
          (34.7, 53.75), (35.6, 53.75), (36.3, 53.6), (36.75, 53.3), (36.95, 53.0), (36.75, 52.6), (36.5, 52.38), (36.1, 52.3), (35.6, 52.2),
          (35.2, 52.25), (34.85, 52.1), (34.6, 51.8), (34.8, 51.4), (35.2, 51.05), (35.6, 50.78), (36.1, 50.62), (36.75, 50.55), (36.95, 50.3),
          (36.85, 49.95), (37.1, 49.5), (37.4, 49.15), (38.0, 49.0), (38.6, 48.85), (39.0, 48.4), (38.85, 47.9), (38.9, 47.5), (39.05, 47.25),
          (38.0, 46.6), (36.75, 45.6), (36.55, 45.2), (36.4, 44.7), (35.0, 43.0), (31.0, 40.0)],
 # 22 June 1944, eve of Bagration: Finns pushed back on the Isthmus (Vyborg fell 20 June), Narva-Pskov-Ostrov line, the
 # Belarus "balcony" (Vitebsk-Orsha-Mogilev-Bobruisk) bulging east of the Pripyat marshes, Kovel, the Carpathians, north Romania
 "jun44": SVIR_41 + [(31.6, 60.6), (30.45, 60.55), (29.9, 60.62), (29.4, 60.78), (28.9, 60.8), (28.6, 60.72), (28.0, 60.4), (27.6, 59.65),
          (28.0, 59.45), (28.15, 59.33), (28.0, 59.0), (27.6, 58.85), (27.5, 58.3), (27.9, 57.95), (28.4, 57.8), (28.55, 57.5), (28.7, 57.0),
          (29.1, 56.5), (29.4, 56.0), (29.9, 55.6), (30.55, 55.35), (30.75, 55.0), (31.0, 54.55), (31.05, 54.15), (31.0, 53.85), (30.55, 53.5),
          (30.2, 53.2), (30.05, 52.95), (29.75, 52.65), (29.3, 52.45), (28.6, 52.15), (27.6, 51.95), (26.4, 51.75), (25.3, 51.45), (25.05, 51.15),
          (25.15, 50.75), (25.0, 50.4), (25.35, 50.1), (25.25, 49.7), (25.0, 49.2), (24.95, 48.6), (24.7, 48.2), (25.2, 47.75), (26.0, 47.45),
          (26.8, 47.25), (27.5, 47.3), (28.2, 47.35), (29.0, 47.25), (29.5, 46.9), (29.9, 46.6), (30.25, 46.35), (30.7, 45.8), (31.0, 40.0)],
 # ~31 Aug 1944: Belarus and eastern Poland gone; Vistula from Warsaw-Praga (uprising since 1 Aug) to the Magnuszew, Pulawy and
 # Sandomierz bridgeheads; Tartu (25 Aug) and Jelgava held, Riga + Courland German; Romania changed sides 23 Aug (blue)
 "aug44": [(32.6, 64.6), (31.5, 63.3), (31.2, 62.7), (31.9, 62.15), (31.5, 61.6), (30.45, 60.55), (29.9, 60.62), (29.4, 60.78), (28.9, 60.8),
          (28.6, 60.72), (28.0, 60.4), (27.4, 59.75), (27.6, 59.42), (27.45, 58.95), (27.2, 58.45), (26.75, 58.42), (26.4, 58.15), (26.55, 57.75),
          (26.4, 57.35), (25.7, 57.05), (25.1, 56.8), (24.6, 56.55), (24.15, 56.35), (23.85, 56.72), (23.35, 56.8), (22.9, 56.5), (22.75, 56.1),
          (22.6, 55.75), (22.7, 55.35), (22.8, 54.95), (22.75, 54.6), (22.85, 54.35), (23.15, 54.1), (23.05, 53.85), (22.6, 53.5), (22.25, 53.2),
          (22.0, 52.95), (21.7, 52.65), (21.35, 52.45), (21.15, 52.3), (21.22, 52.1), (21.2, 51.92), (21.0, 51.85), (20.95, 51.72), (21.15, 51.6),
          (21.5, 51.62), (21.85, 51.48), (21.72, 51.38), (21.85, 51.25), (21.75, 50.95), (21.35, 50.95), (21.05, 50.75), (20.8, 50.5),
          (21.0, 50.3), (21.3, 50.15), (21.35, 49.95), (21.7, 49.68), (22.05, 49.45), (22.45, 49.2), (23.5, 48.75), (24.3, 48.25), (24.95, 47.75),
          (25.5, 47.35), (25.75, 46.95), (26.1, 46.5), (26.2, 46.0), (25.85, 45.75), (25.45, 45.85), (24.9, 46.2), (24.4, 46.35), (23.9, 46.5),
          (23.4, 46.5), (22.85, 46.6), (22.3, 46.75), (21.9, 46.95), (21.5, 46.6), (21.25, 46.2), (21.1, 45.85), (21.4, 44.8), (22.5, 44.62),
          (22.85, 43.95), (24.0, 43.72), (25.5, 43.65), (27.0, 44.05), (28.0, 43.95), (28.6, 43.73), (30.0, 43.0), (31.0, 40.0)],
}
SOVIET_POCKETS = {   # Soviet-held ground inside the Axis area
 "oct41": [[(33.15, 55.3), (33.6, 55.55), (34.15, 55.45), (34.35, 55.15), (34.05, 54.85), (33.45, 54.85)],          # Vyazma pocket (7-13 Oct)
           [(33.75, 53.55), (34.2, 53.85), (34.75, 53.75), (34.65, 53.45), (34.2, 53.35)],                          # Bryansk north pocket (50th Army)
           [(32.75, 52.5), (33.05, 52.85), (33.65, 52.9), (33.95, 52.6), (33.6, 52.3), (33.1, 52.25)],               # Bryansk south (Trubchevsk) pocket
           [(29.05, 59.98), (29.85, 59.98), (29.85, 59.82), (29.45, 59.75), (29.05, 59.8)],                          # Oranienbaum
           [(30.15, 46.35), (30.3, 46.75), (30.9, 46.8), (31.15, 46.62), (31.0, 46.45)]],                            # Odessa (evacuated 16 Oct)
 "dec41": [[(29.05, 59.98), (29.85, 59.98), (29.85, 59.82), (29.45, 59.75), (29.05, 59.8)],                          # Oranienbaum
           [(33.45, 44.72), (33.62, 44.76), (33.88, 44.63), (33.8, 44.45), (33.55, 44.45), (33.4, 44.55)]],           # Sevastopol
 "jul43": [[(29.05, 59.98), (29.85, 59.98), (29.85, 59.82), (29.45, 59.75), (29.05, 59.8)]],                          # Oranienbaum
}
AXIS_POCKETS = {     # Axis-held ground inside the Soviet area
 "jul43": [[(36.62, 45.48), (37.3, 45.58), (37.95, 45.45), (38.0, 44.95), (37.8, 44.66), (37.3, 44.78), (36.62, 45.05)]],   # Kuban bridgehead
}
STATES = list(EAST)
AX, SO, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)
AX0, SO0 = (140, 12, 20), (46, 92, 178)

def poly_mask(polys):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for pts in polys: d.polygon([P(*q) for q in pts], fill=255)
    return np.array(im) > 0

def country_masks(feats, state):
    neu = Image.new("L", (W, H), 0); nos = Image.new("L", (W, H), 0); dn, dx = ImageDraw.Draw(neu), ImageDraw.Draw(nos)
    for f in feats:
        nm = str(f["properties"]["NAME"]); side = SWITCH.get(state, {}).get(nm) or ("neutral" if nm in NEUTRAL else "noside" if nm in NOSIDE else None)
        if not side: continue
        g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            ring = [P(*c[:2]) for c in poly[0]]
            if len(ring) > 2: (dn if side == "neutral" else dx).polygon(ring, fill=255)
    return np.array(neu) > 0, np.array(nos) > 0

def masks(state, feats, land):
    neutral, noside = country_masks(feats, state)
    west = poly_mask([EAST[state] + [(-30, 30), (-30, 75)]])
    axis = land & west & ~neutral & ~noside
    sov = land & ~west & ~neutral & ~noside
    if SOVIET_POCKETS.get(state):
        pk = poly_mask(SOVIET_POCKETS[state]) & land; sov |= pk & axis; axis &= ~pk
    if AXIS_POCKETS.get(state):
        pk = poly_mask(AXIS_POCKETS[state]) & land; axis |= pk & sov; sov &= ~pk
    if state == "aug44":   # Romania changed sides on 23 Aug 1944: shown with the Soviet side
        ro = Image.new("L", (W, H), 0); dr = ImageDraw.Draw(ro)
        for f in feats:
            if str(f["properties"]["NAME"]) == "Romania":
                g = f["geometry"]
                for poly in (g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]): dr.polygon([P(*c[:2]) for c in poly[0]], fill=255)
        ro = (np.array(ro) > 0) & ~west & land; sov |= ro; axis &= ~ro
    return axis, sov

def build(state, feats, land):
    axis, sov = masks(state, feats, land)
    # merged "Frontlines" look (make_merge_assets.build): crimson Axis ground, strongest near the front, red rim, blue Soviet ground
    d_ax = ndimage.distance_transform_edt(~sov)
    a_ax = np.where(axis, 0.36 + 0.24 * np.exp(-d_ax / 40.0), 0.0)
    a_so = np.where(sov, 0.30, 0.0)
    rim = ndimage.gaussian_filter((axis & ndimage.binary_dilation(sov, iterations=3)).astype(np.float32), 6) * 3.0
    rim = np.clip(rim, 0, 1) * land
    for mx in (True, False):
        out = np.zeros((H, W, 4), np.float32)
        out[axis, :3] = AX if mx else AX0; out[sov, :3] = SO if mx else SO0
        out[..., 3] = a_ax + a_so
        sel = rim > 0.02
        col = np.array(RIM if mx else (235, 55, 45), np.float32)
        out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + col * rim[sel, None]
        out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
        if mx:   # the approved _mx overlays: alpha x1.9, capped at 0.92; rim pixels in the light rim colour
            out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
            out[sel & (rim > 0.35), :3] = RIM
        name = f"assets/media/east_ctl_{state}{'_mx' if mx else ''}.png"
        Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(name, optimize=True)
    print("wrote", state, "axis px", int(axis.sum()), "soviet px", int(sov.sum()))

if __name__ == "__main__":
    feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
    land = np.array(Image.open("assets/east_land.png").convert("L")) > 127
    for s in (sys.argv[1:] or STATES): build(s, feats, land)
