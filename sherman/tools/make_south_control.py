"""Theatre control maps (option 1, multiply look) on the `south` basemap (z8, 34.50N 81.50W), Sherman #13 (hook/bg/ending agent;
the move agents reuse them read-only). Union-held ground = blue (110,160,255) (hero); Confederate-held = red (232,52,52).
Union = the Union states on the map (Kentucky, West Virginia, Missouri, Illinois, Indiana, Ohio, Maryland) + Tennessee (except upper
East Tennessee until 1865) + north Alabama above the Tennessee River + the per-date polygons below. Everything else in the seceded
states = Confederate. The marching armies (March to the Sea, Carolinas) are NOT territory: scenes draw the army's blue band.
Sources + notes per date: research/FACT_NOTES_south.md. Approximate to ~5-10 km (z8 = 504 m/px). State shapes = Natural Earth admin-1.
-> assets/media/south_ctl_<date>_mx.png   (2880x1620 multiply overlay)
usage (from sherman/): python3 tools/make_south_control.py [date ...]   dates: may64 aug64 sep64 dec64 feb65 apr65"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/south.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

UNION_STATES = {"Kentucky", "West Virginia", "Missouri", "Illinois", "Indiana", "Ohio", "Maryland", "Delaware", "District of Columbia",
                "Pennsylvania", "New Jersey"}
# ---- polygons (lat, lon), each tagged with the state it is clipped to ("*" = any land) ----
NE_TN = [(36.75, -83.15), (36.10, -83.15), (35.85, -82.95), (35.55, -82.30), (35.80, -81.40), (36.75, -81.40)]   # upper East TN (CSA in 1864)
N_ALA = [(35.10, -88.30), (34.86, -88.10), (34.80, -87.68), (34.72, -87.30), (34.61, -86.98), (34.50, -86.60), (34.36, -86.29),
         (34.55, -86.15), (34.65, -86.03), (34.80, -85.85), (34.95, -85.71), (35.10, -85.60)]               # above the Tennessee River
# Georgia, per date
GA_MAY64 = [(35.20, -86.0), (34.99, -85.62), (34.88, -85.45), (34.84, -85.12), (34.85, -84.98), (34.93, -84.80), (35.00, -84.65), (35.20, -84.6)]
GA_AUG64 = [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.82, -84.80), (33.72, -84.56), (33.73, -84.47), (33.80, -84.43),
            (33.82, -84.38), (33.80, -84.32), (33.76, -84.29), (33.80, -84.18), (34.05, -84.20), (34.45, -84.42), (34.90, -84.60), (35.20, -84.60)]
GA_SEP64 = [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.82, -84.80), (33.70, -84.56), (33.64, -84.46), (33.65, -84.34),
            (33.72, -84.24), (33.80, -84.16), (34.05, -84.20), (34.45, -84.42), (34.90, -84.60), (35.20, -84.60)]
GA_DEC64 = [(35.20, -86.0), (34.99, -85.62), (34.90, -85.40), (34.88, -85.05), (35.00, -84.85), (35.20, -84.8)]  # Chattanooga's fringe
SAV = [(32.24, -81.17), (32.12, -81.40), (31.98, -81.40), (31.86, -81.30), (31.82, -81.10), (31.92, -80.85), (32.04, -80.84), (32.12, -81.00)]
PULASKI = [(32.06, -80.82), (31.96, -80.82), (31.95, -80.95), (32.04, -80.93)]                                    # Fort Pulaski, Tybee
# South Carolina coast
PORT_ROYAL = [(32.04, -80.80), (32.20, -80.95), (32.38, -80.85), (32.52, -80.75), (32.56, -80.52), (32.40, -80.38), (32.12, -80.62)]
MORRIS = [(32.75, -79.90), (32.66, -79.89), (32.60, -79.97), (32.63, -80.02), (32.70, -79.97)]                    # Morris + Folly Islands
SC_FEB65 = [(32.04, -80.84), (32.22, -81.14), (32.55, -81.02), (32.72, -80.70), (32.88, -80.22), (33.00, -79.88), (32.88, -79.62),
            (32.70, -79.80), (32.55, -80.10), (32.30, -80.40)]                                                      # coast to Charleston
SC_APR65 = SC_FEB65[:6] + [(33.10, -79.75), (33.45, -79.35), (33.40, -79.05), (33.15, -79.20), (32.88, -79.62)] + SC_FEB65[7:]  # + Georgetown
# North Carolina
NEWBERN = [(35.30, -77.20), (35.05, -77.25), (34.80, -77.05), (34.68, -76.70), (34.72, -76.40), (35.00, -76.35), (35.25, -76.70)]
BANKS = [(36.00, -75.82), (35.85, -75.55), (35.20, -75.45), (35.15, -75.75), (35.80, -75.78), (35.95, -75.95)]     # Roanoke Is., Hatteras
PLYMOUTH = [(35.95, -76.85), (35.80, -76.85), (35.80, -76.60), (35.95, -76.60)]                                    # Union again 31 Oct 1864
WILM = [(34.36, -78.05), (34.38, -77.85), (34.00, -77.80), (33.84, -77.94), (33.88, -78.10), (34.10, -78.12)]      # Wilmington 22 Feb 1865
NC_APR65 = [(36.70, -79.05), (35.70, -79.10), (35.20, -79.05), (34.70, -79.10), (33.80, -78.60), (33.50, -77.0), (36.70, -75.0)]  # Durham-Raleigh-Goldsboro east
# Virginia
NORFOLK = [(37.00, -76.62), (36.96, -76.25), (36.88, -75.90), (36.54, -75.80), (36.54, -76.55), (36.78, -76.70)]
PENIN = [(37.32, -76.82), (37.34, -76.60), (37.26, -76.40), (37.10, -76.24), (36.98, -76.27), (36.98, -76.46), (37.12, -76.58), (37.22, -76.76)]
EASTERN_SHORE = [(38.10, -75.95), (38.10, -75.20), (36.90, -75.70), (37.05, -76.20), (37.70, -76.20)]
BERMUDA = [(37.38, -77.39), (37.28, -77.39), (37.29, -77.24), (37.33, -77.20), (37.36, -77.27)]                     # Butler, 5 May 1864
PBURG64 = [(37.43, -77.31), (37.38, -77.39), (37.29, -77.39), (37.25, -77.36), (37.20, -77.38), (37.17, -77.44), (37.12, -77.40),
           (37.08, -77.22), (37.22, -77.08), (37.32, -77.10), (37.40, -77.18)]                                       # siege lines Aug 1864
PBURG65 = [(37.48, -77.37), (37.43, -77.39), (37.38, -77.40), (37.29, -77.39), (37.25, -77.36), (37.21, -77.43), (37.17, -77.49),
           (37.12, -77.53), (37.07, -77.45), (37.07, -77.20), (37.25, -77.06), (37.40, -77.12), (37.48, -77.22)]      # to Hatcher's Run / Fort Harrison
VA_APR65 = [(38.20, -79.25), (37.40, -79.25), (36.54, -79.40), (36.54, -75.0), (38.20, -75.0)]                     # after Appomattox / Richmond

COAST = [("Georgia", PULASKI), ("South Carolina", PORT_ROYAL), ("South Carolina", MORRIS), ("North Carolina", NEWBERN), ("North Carolina", BANKS),
         ("Virginia", NORFOLK), ("Virginia", PENIN), ("Virginia", EASTERN_SHORE)]
UNION = {   # date -> ([(state, poly)...], upper East Tennessee Union?)
    "may64": (COAST + [("Georgia", GA_MAY64), ("Virginia", BERMUDA)], False),
    "aug64": (COAST + [("Georgia", GA_AUG64), ("Virginia", PBURG64)], False),
    "sep64": (COAST + [("Georgia", GA_SEP64), ("Virginia", PBURG64)], False),
    "dec64": (COAST + [("Georgia", GA_DEC64), ("Georgia", SAV), ("North Carolina", PLYMOUTH), ("Virginia", PBURG65)], False),
    "feb65": (COAST + [("Georgia", GA_DEC64), ("Georgia", SAV), ("South Carolina", SC_FEB65), ("North Carolina", PLYMOUTH),
                       ("North Carolina", WILM), ("Virginia", PBURG65)], True),
    "apr65": (COAST + [("Georgia", GA_DEC64), ("Georgia", SAV), ("South Carolina", SC_APR65), ("North Carolina", PLYMOUTH),
                       ("North Carolina", WILM), ("North Carolina", NC_APR65), ("Virginia", VA_APR65)], True),
}

def poly_mask(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def state_masks(W, H):
    out = {}
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        g = f["geometry"]; rings = [g["coordinates"][0]] if g["type"] == "Polygon" else [p[0] for p in g["coordinates"]]
        out[f["properties"]["name"]] = poly_mask([[(la, lo) for lo, la in r] for r in rings], W, H)
    return out

def build(date, land, SM):
    H, W = land.shape
    polys, ne_tn_union = UNION[date]
    un = np.zeros_like(land)
    for s in UNION_STATES:
        if s in SM: un |= SM[s]
    tn = SM["Tennessee"] & (True if ne_tn_union else ~poly_mask([NE_TN], W, H))
    un |= tn | (SM["Alabama"] & poly_mask([N_ALA], W, H))
    for st, poly in polys:
        un |= SM[st] & poly_mask([poly], W, H)
    un &= land
    csa = land & ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/south_ctl_{date}_mx.png", optimize=True)
    print("wrote south_ctl_%s_mx.png" % date)

if __name__ == "__main__":
    land = np.array(Image.open("assets/south_land.png").convert("L")) > 127
    H, W = land.shape
    SM = state_masks(W, H)
    for date in (sys.argv[1:] or list(UNION)):
        build(date, land, SM)
