"""Kursk map (z9) control overlays + front lines for MOVE 2 (northern face of Kursk, 4-12 July 1943).
Front lines per date (lat, lon), north -> south, German-held ground WEST/NORTH of the line, Soviet EAST/SOUTH. Sources + notes:
research/FACT_NOTES_kursk.md ("control map").
-> assets/media/kursk_ctl_<state>_mx.png  option 1 (multiply overlay, axis (232,52,52) / allied (110,160,255), like europe_ctlm_jun5_mx)
-> assets/media/kursk_front_<state>.json   option 2 polylines in map px (north -> south: K.front sideA = blue = east side)
-> assets/media/kursk_pts.json             story places + railway in map px (used by scenes-src/move2.js)
usage (from the project folder): python3 tools/make_kursk_control.py"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/kursk.json"))
Z, (OX, OY), (W, H) = J["zoom"], J["origin_world_px"], J["size"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (round((lon + 180) / 360 * n - OX, 1), round((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY, 1))

# the front of 4 July 1943 (start of Citadel): Orel bulge (German) to the north-west, Kursk salient (Soviet) to the south-east
NORTH = [(53.85, 36.10), (53.69, 36.18), (53.57, 36.26), (53.45, 36.40), (53.33, 36.68), (53.18, 36.80), (53.02, 36.95),
         (52.85, 36.88), (52.68, 36.70), (52.52, 36.55), (52.45, 36.45)]
SOUTH = [(52.40, 35.78), (52.38, 35.55), (52.38, 35.25), (52.30, 34.90), (52.18, 34.62), (51.95, 34.55), (51.70, 34.78), (51.45, 34.95),
         (51.20, 35.05), (50.85, 35.12)]
SECTOR = {  # the 13th Army sector (Maloarkhangelsk -> Trosna), per date
    "jul4": [(52.41, 36.38), (52.40, 36.25), (52.40, 36.10), (52.40, 35.95)],
    "jul7": [(52.40, 36.40), (52.34, 36.33), (52.325, 36.30), (52.33, 36.22), (52.31, 36.16), (52.30, 36.08), (52.33, 36.00), (52.37, 35.90)],
    "jul11": [(52.40, 36.40), (52.33, 36.33), (52.315, 36.30), (52.30, 36.23), (52.285, 36.17), (52.28, 36.11), (52.262, 36.01), (52.29, 35.94),
              (52.36, 35.86)],
}
LINE = {s: NORTH + v + SOUTH for s, v in SECTOR.items()}

def axis_mask(line):
    im = Image.new("L", (W, H), 0)
    poly = [P(*q) for q in line] + [(-400, H + 400), (-400, -400)]
    ImageDraw.Draw(im).polygon(poly, fill=255)
    return np.array(im) > 0

def overlay(state):
    ax = axis_mask(LINE[state]); al = ~ax
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~al)
    a_ax = 0.67 + 0.25 * np.exp(-d / 40.0)
    out[ax, :3] = (232, 52, 52); out[ax, 3] = a_ax[ax]
    out[al, :3] = (110, 160, 255); out[al, 3] = 0.565
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/kursk_ctl_{state}_mx.png", optimize=True)

def chaikin(pts, k=2):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return [[round(float(x), 1), round(float(y), 1)] for x, y in pts]

if __name__ == "__main__":
    for s in LINE:
        overlay(s)
        json.dump(chaikin([P(*q) for q in LINE[s]]), open(f"assets/media/kursk_front_{s}.json", "w"))
        print("wrote", s)
    # local sector lines with a fixed point count (so K.front can morph jul4 -> jul7 -> jul11)
    def resample(line, n=40):
        p = np.array(chaikin([P(*q) for q in line]), float); seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
        u = np.linspace(0, s[-1], n); return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in u]
    sec = {s: resample([(52.68, 36.70), (52.52, 36.55), (52.45, 36.45)] + v + [(52.40, 35.78), (52.38, 35.55), (52.38, 35.25)], 70) for s, v in SECTOR.items()}
    json.dump(sec, open("assets/media/kursk_sector.json", "w"))
    PL = dict(Orel=(52.967, 36.069), Kursk=(51.730, 36.193), Ponyri=(52.319, 36.302), Olkhovatka=(52.256, 36.125), Teploye=(52.273, 36.006),
              Soborovka=(52.321, 36.087), Maloarkhangelsk=(52.400, 36.500), Fatezh=(52.090, 35.860), Kromy=(52.687, 35.790), Glazunovka=(52.499, 36.322),
              Trosna=(52.448, 35.780), Zmievka=(52.66, 36.36), Bolkhov=(53.44, 36.00), Mtsensk=(53.28, 36.57), Novosil=(52.97, 37.04),
              Sevsk=(52.15, 34.49), Dmitrovsk=(52.50, 35.14), Bryansk=(53.25, 34.37), Lgov=(51.66, 35.27), Livny=(52.42, 37.60), Shchigry=(51.88, 36.90))
    RAIL = [(53.05, 36.02), (52.967, 36.069), (52.85, 36.17), (52.66, 36.36), (52.499, 36.322), (52.42, 36.33), (52.319, 36.302), (52.20, 36.36),
            (52.08, 36.40), (51.92, 36.32), (51.73, 36.19), (51.60, 36.10)]
    json.dump({"places": {k: P(*v) for k, v in PL.items()}, "rail": chaikin([P(*q) for q in RAIL], 3)}, open("assets/media/kursk_pts.json", "w"), indent=0)
    print({k: P(*v) for k, v in PL.items()})
    # inline the data into the scene (build_scene.py copies only images): replaces the "const KD = ..." line of scenes-src/move2.js
    import os, re
    KD = {"north": chaikin([P(*q) for q in NORTH + [(52.45, 36.45)]]), "south": chaikin([P(*q) for q in [(52.40, 35.78)] + SOUTH]), "sector": sec,
          "rail": chaikin([P(*q) for q in RAIL], 3), "wide": {k: chaikin([P(*q) for q in LINE[k]]) for k in LINE}}
    rv = "assets/media/kursk_rivers.json"
    KD["rivers"] = json.load(open(rv)) if os.path.exists(rv) else []
    sp = "scenes-src/move2.js"
    if os.path.exists(sp):
        s = open(sp).read(); s = re.sub(r"^const KD = .*$", "const KD = " + json.dumps(KD, separators=(",", ":")) + ";", s, count=1, flags=re.M)
        open(sp, "w").write(s); print("inlined KD into", sp)
