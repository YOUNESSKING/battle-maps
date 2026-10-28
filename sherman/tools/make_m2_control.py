"""MOVE 2 control overlays (option 1, multiply look; Sherman #13, MOVE 2 agent). Union-held = blue (110,160,255), Confederate-held = red
(232,52,52) + the bright rim on the red side where they meet (same treatment as meade/tools/make_penn_control.py).
This is a war of a MOVING army: the March to the Sea itself is NOT in these overlays (the scenes draw the army's blue band moving through
red ground). The overlays only hold the fixed Union ground per date. Sources + notes: research/FACT_NOTES_georgia.md (~5-10 km accuracy).
Outputs (assets/media/, 2880x1620):
  m2_corridor_ctl_oct64_mx.png  corridor: Tennessee + north Alabama (Tennessee Valley garrisons) + the W&A railroad garrisons Chattanooga-Atlanta
                                + Rome + Atlanta (held since 2 Sep 1864); the rest of Georgia/Alabama Confederate.
  georgia_ctl_oct64_mx.png      georgia: same Union ground as above (to mid-Nov 1864) + the coast posts (Fort Pulaski/Tybee, Hilton Head,
                                Port Royal-Beaufort Sea Islands, Morris/Folly Islands).
  georgia_ctl_nov64_mx.png      georgia after 15 Nov 1864: Atlanta + the railroad south of Dalton abandoned; Tennessee + Chattanooga's fringe +
                                coast posts only.
  georgia_ctl_dec64_mx.png      georgia after 21 Dec 1864: + Savannah.
  savannah_ctl_dec10_mx.png / savannah_ctl_dec21_mx.png (savannah basemap, when baked)
usage (from sherman/): python3 tools/make_m2_control.py [corridor georgia savannah south]"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

# ---- geometry (lat, lon) ----
WA_RR = [(35.046, -85.310), (34.916, -85.109), (34.840, -85.042), (34.770, -84.970), (34.670, -84.930), (34.580, -84.944), (34.503, -84.951),
         (34.369, -84.934), (34.234, -84.944), (34.165, -84.800), (34.125, -84.715), (34.066, -84.678), (34.023, -84.616), (33.953, -84.550),
         (33.860, -84.470), (33.749, -84.388)]
ROME_BR = [(34.234, -84.944), (34.257, -85.165)]
N_ALABAMA = [(35.0, -85.60), (34.95, -85.72), (34.66, -86.05), (34.36, -86.30), (34.55, -86.60), (34.61, -87.00), (34.75, -87.60), (35.0, -87.60)]
COAST_POSTS = [  # land inside these polygons = Union (since 1861-62)
    [(32.06, -80.95), (32.06, -80.82), (31.96, -80.82), (31.96, -80.95)],                           # Cockspur Is. (Fort Pulaski) + Tybee Is.
    [(32.30, -80.85), (32.30, -80.62), (32.09, -80.62), (32.09, -80.85)],                           # Hilton Head Is.
    [(32.55, -80.78), (32.55, -80.40), (32.30, -80.40), (32.30, -80.72)],                           # Port Royal, Beaufort, Lady's + St Helena Is.
    [(32.72, -80.00), (32.72, -79.86), (32.62, -79.86), (32.62, -80.00)],                           # Folly + Morris Is. (Charleston siege)
]
CHATT_DALTON = [(35.10, -85.45), (35.10, -85.05), (34.93, -85.05), (34.90, -85.25), (35.0, -85.45)]   # Chattanooga's fringe (as south_ctl_dec64)
# the army's ~60-mile band (OR 44: "thirty miles on either side of a line from Atlanta to Savannah"), by stage
MARCH_MID = [(33.749, -84.388), (33.35, -83.75), (33.080, -83.232), (32.95, -82.55), (32.804, -81.949), (32.45, -81.50), (32.20, -81.33)]
BAND_STAGES = {"band1": 3, "band2": 5, "band3": 7}     # vertices included: to Milledgeville (23 Nov), to Millen (~3 Dec), to Savannah's lines (10 Dec)
SAVANNAH_DEC21 = [(32.20, -81.20), (32.20, -80.85), (31.95, -80.85), (31.88, -81.10), (31.86, -81.30), (32.05, -81.30)]

def proj(base):
    J = json.load(open(f"assets/{base}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P, J["meters_per_px"]

def states_mask(P, names, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        if f["properties"].get("name") not in names: continue
        g = f["geometry"]; polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for p in polys: d.polygon([P(la, lo) for lo, la in p[0]], fill=255)
    return np.array(im) > 0

def mask(P, W, H, polys=(), lines=(), circles=()):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    for pts, w in lines: d.line([P(*q) for q in pts], fill=255, width=int(w), joint="curve")
    for (la, lo), r in circles:
        x, y = P(la, lo); d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    return np.array(im) > 0

def render(land, un, name):
    csa = land & ~un; un = land & un
    out = np.zeros(land.shape + (4,), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}", optimize=True)
    print("wrote", name)

def load_land(base):
    return np.array(Image.open(f"assets/{base}_land.png").convert("L").resize((2880, 1620))) > 127

def km(mpp, k): return k * 1000 / mpp

def corridor_like(base, P, mpp, W, H, date):
    north = states_mask(P, {"Tennessee", "Kentucky", "Ohio", "Indiana", "Illinois", "Virginia", "West Virginia", "Maryland", "Pennsylvania"}, W, H) if base != "georgia" else states_mask(P, {"Tennessee"}, W, H)
    un = north | mask(P, W, H, polys=[N_ALABAMA] + COAST_POSTS)
    if date == "oct64":
        un |= mask(P, W, H, lines=[(WA_RR, km(mpp, 16)), (ROME_BR, km(mpp, 12))], circles=[((33.749, -84.388), km(mpp, 18)), ((34.257, -85.165), km(mpp, 8))])
    else:
        un |= mask(P, W, H, polys=[CHATT_DALTON])
    if date == "dec64": un |= mask(P, W, H, polys=[SAVANNAH_DEC21])
    return un

def main(which):
    if "corridor" in which:
        P, mpp = proj("corridor"); land = load_land("corridor")
        render(land, corridor_like("corridor", P, mpp, 2880, 1620, "oct64"), "m2_corridor_ctl_oct64_mx.png")
    if "georgia" in which:
        P, mpp = proj("georgia"); land = load_land("georgia")
        for dt in ("oct64", "nov64", "dec64"): render(land, corridor_like("georgia", P, mpp, 2880, 1620, dt), f"georgia_ctl_{dt}_mx.png")
        r = km(mpp, 48.3)                                   # 30 miles
        for nm, n in BAND_STAGES.items():
            pts = MARCH_MID[:n]
            un = corridor_like("georgia", P, mpp, 2880, 1620, "nov64") | mask(P, 2880, 1620, lines=[(pts, 2 * r)], circles=[(q, r) for q in pts[:-1]])
            if n == 7: un &= ~mask(P, 2880, 1620, circles=[((32.081, -81.091), km(mpp, 18))])
            render(land, un, f"georgia_ctl_{nm}_mx.png")
    if "savannah" in which and os.path.exists("assets/savannah_land.png"):
        import make_m2_savannah_ctl as SV
        P, mpp = proj("savannah"); land = load_land("savannah")
        for dt in ("dec10", "dec21"): render(land, SV.union(P, mask, 2880, 1620, dt, COAST_POSTS), f"savannah_ctl_{dt}_mx.png")
    if "south" in which:
        P, mpp = proj("south"); land = load_land("south")
        for dt in ("oct64", "dec64"): render(land, corridor_like("south", P, mpp, 2880, 1620, dt), f"m2_south_ctl_{dt}_mx.png")

if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    main(sys.argv[1:] or ["corridor", "georgia", "savannah"])
