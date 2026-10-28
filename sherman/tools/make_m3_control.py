"""MOVE 3 control overlays (option 1, multiply look; Sherman #13, MOVE 3 agent). Union-held = blue (110,160,255), Confederate-held = red
(232,52,52) + the bright rim on the red side where they meet (same render as make_south_control.py / make_m2_control.py).
A war of a MOVING army: Sherman's march through the Carolinas is NOT in these overlays (the scenes draw the army's blue band moving through
red ground); the overlays hold only the fixed Union ground per date. Polygons reuse tools/make_south_control.py (HOOK agent, read-only:
coast posts, SC_FEB65, SC_APR65 (Georgetown), WILM, NEWBERN, BANKS, PLYMOUTH, NE_TN) + the MOVE 3 additions below.
Sources + notes: research/FACT_NOTES_carolinas.md (~5-10 km accuracy).
Outputs (assets/media/, 2880x1620):
  carolinas_ctl_feb01_mx.png  ~1 Feb 1865: Savannah, Fort Pulaski, Port Royal/Beaufort Sea Islands + the Pocotaligo bridgehead (Howard, 14-15 Jan),
                              Morris/Folly Is.; NC: New Bern-Beaufort, Roanoke Is./Hatteras, Plymouth, Fort Fisher/Federal Point (15 Jan).
  carolinas_ctl_feb18_mx.png  + the SC coast to Charleston (evacuated 17 Feb, occupied 18 Feb).
  carolinas_ctl_mar15_mx.png  + Wilmington (22 Feb), Georgetown (25 Feb), Kinston (Schofield, 14 Mar).
  carolinas_ctl_mar23_mx.png  + Goldsboro (Schofield 21 Mar, Sherman 23 Mar) and the railroad to Kinston/New Bern.
  carolinas_ctl_band{1,2,2b,3,3b,4}_mx.png  the base date + the army's swath to that stage (BAND_STAGES below).
  m3_south_ctl_mar23_mx.png   `south` theatre on 23 Mar - 8 Apr 1865 (HOOK agent's feb65 ground + mar15/mar23 additions), for move3c before
                              the HOOK agent's south_ctl_apr65_mx (26 Apr) takes over.
usage (from sherman/): python3 tools/make_m3_control.py [carolinas south]"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_south_control as SC   # polygons only (its module code just reads assets/south.json)

POCO = [(32.30, -80.95), (32.52, -80.98), (32.70, -80.93), (32.72, -80.80), (32.58, -80.60), (32.40, -80.55), (32.20, -80.70)]   # Beaufort -> Pocotaligo
FISHER = [(34.10, -77.98), (34.10, -77.86), (33.88, -77.92), (33.86, -77.99)]                                                      # Federal Point (15 Jan)
KINSTON = [(35.33, -77.66), (35.18, -77.66), (35.00, -77.22), (35.10, -77.05), (35.32, -77.30)]                                    # New Bern - Kinston (14 Mar)
GOLDS = [(35.48, -78.10), (35.30, -78.12), (35.18, -77.66), (35.33, -77.62), (35.45, -77.85)]                                     # Goldsboro (21-23 Mar)
# the army's swath through the Carolinas (both wings; ~45 km wide band around this centre line), drawn by stage (vertices included)
BAND_MID = [(32.40, -81.05), (33.06, -81.12), (33.50, -81.00), (34.00, -81.08), (34.38, -80.85), (34.62, -80.20), (34.70, -79.88), (34.92, -79.40),
            (35.05, -78.88), (35.22, -78.62), (35.30, -78.34), (35.385, -77.993)]
BAND_STAGES = {"band1": (3, "feb01"), "band2": (4, "feb01"), "band2b": (4, "feb18"), "band3": (9, "mar15"), "band3b": (10, "mar15"), "band4": (12, "mar23")}
# band1 = to Orangeburg (~12 Feb), band2 = to Columbia (17 Feb), band2b = same + Charleston (18 Feb), band3 = to Fayetteville (11 Mar),
# band3b = to Averasboro (16 Mar), band4 = to Bentonville + Goldsboro (19-23 Mar)
GA_SAV = [("Georgia", SC.SAV), ("Georgia", SC.PULASKI)]
NC_BASE = [("North Carolina", SC.NEWBERN), ("North Carolina", SC.BANKS), ("North Carolina", SC.PLYMOUTH), ("North Carolina", FISHER)]
SC_BASE = [("South Carolina", SC.PORT_ROYAL), ("South Carolina", SC.MORRIS), ("South Carolina", POCO)]
DATES = {
    "feb01": GA_SAV + SC_BASE + NC_BASE,
    "feb18": GA_SAV + SC_BASE + NC_BASE + [("South Carolina", SC.SC_FEB65)],
    "mar15": GA_SAV + SC_BASE + NC_BASE + [("South Carolina", SC.SC_APR65), ("North Carolina", SC.WILM), ("North Carolina", KINSTON)],
    "mar23": GA_SAV + SC_BASE + NC_BASE + [("South Carolina", SC.SC_APR65), ("North Carolina", SC.WILM), ("North Carolina", KINSTON), ("North Carolina", GOLDS)],
}

def proj(base):
    J = json.load(open(f"assets/{base}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P

def poly_mask(P, polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def state_masks(P, W, H):
    out = {}
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        g = f["geometry"]; rings = [g["coordinates"][0]] if g["type"] == "Polygon" else [p[0] for p in g["coordinates"]]
        out[f["properties"]["name"]] = poly_mask(P, [[(la, lo) for lo, la in r] for r in rings], W, H)
    return out

def render(land, un, name):
    un = un & land; csa = land & ~un
    out = np.zeros(land.shape + (4,), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}", optimize=True)
    print("wrote", name)

def union(P, SM, W, H, polys, ne_tn=True):
    un = np.zeros((H, W), bool)
    for s in SC.UNION_STATES:
        if s in SM: un |= SM[s]
    if "Tennessee" in SM: un |= SM["Tennessee"] & (True if ne_tn else ~poly_mask(P, [SC.NE_TN], W, H))
    if "Alabama" in SM: un |= SM["Alabama"] & poly_mask(P, [SC.N_ALA], W, H)
    for st, poly in polys: un |= SM[st] & poly_mask(P, [poly], W, H)
    return un

def main(which):
    if "carolinas" in which:
        P = proj("carolinas"); land = np.array(Image.open("assets/carolinas_land.png").convert("L").resize((2880, 1620))) > 127
        SM = state_masks(P, 2880, 1620)
        base = {}
        for dt, polys in DATES.items():
            base[dt] = union(P, SM, 2880, 1620, polys + [("Virginia", SC.NORFOLK)]); render(land, base[dt], f"carolinas_ctl_{dt}_mx.png")
        r = 22.5 * 1000 / 252.73
        for nm, (n, dt) in BAND_STAGES.items():
            pts = BAND_MID[:n]; im = Image.new("L", (2880, 1620), 0); d = ImageDraw.Draw(im)
            d.line([P(*q) for q in pts], fill=255, width=int(2 * r), joint="curve")
            for q in pts: x, y = P(*q); d.ellipse((x - r, y - r, x + r, y + r), fill=255)
            render(land, base[dt] | (np.array(im) > 0), f"carolinas_ctl_{nm}_mx.png")
    if "south" in which:
        P = proj("south"); land = np.array(Image.open("assets/south_land.png").convert("L")) > 127; H, W = land.shape
        SM = state_masks(P, W, H)
        polys = [p for p in SC.UNION["feb65"][0]] + [("South Carolina", SC.SC_APR65), ("North Carolina", KINSTON), ("North Carolina", GOLDS),
                                                    ("South Carolina", POCO), ("North Carolina", FISHER)]
        render(land, union(P, SM, W, H, polys), "m3_south_ctl_mar23_mx.png")

if __name__ == "__main__":
    main(sys.argv[1:] or ["carolinas", "south"])
