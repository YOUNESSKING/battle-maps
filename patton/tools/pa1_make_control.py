"""Map agent A (Patton #15, move1a..move1e): who-controls-the-ground overlays (option 1, multiply look) on `normandy` (z9),
front polylines for the option-2 close-ups (`avranches`, `lemans`) and a river layer from the DEM (look A: no other detail layers).
Allied (hero) = BLUE (110,160,255) alpha 0.565; German = RED, A4 lighter red (240,105,95) 0.62 + 0.25 near the border, red rim.
Fronts per date (lat, lon), approximate to ~3-5 km at z9, from Blumenson, Breakout and Pursuit (FACTCHECK_A rows 4-19):
  jul31  Avranches taken 30 Jul, Pontaubault bridge 31 Jul; Brecey - Villedieu - Percy - Tessy; British at Caumont / St-Martin-des-B.
  aug8   Brittany overrun except the ports (Brest, Lorient, St-Nazaire, St-Malo held out); Mortain attack (2nd SS holds Mortain, pushed
         west toward St-Barthelemy/Juvigny); Vire US 7 Aug; Mont Pincon British 6 Aug; Totalize south of Caen 8 Aug; XV Corps corridor
         Mayenne - Laval - Le Mans (Le Mans 8 Aug); the Loire = the southern flank (Nantes still German until 12 Aug).
  aug13  XV Corps halted just south of Argentan (French 2nd Armd at Ecouche, 5th Armd at Sees, Alencon bridges 11 Aug); First Army
         pushing east (Mortain retaken 12 Aug, Domfront); British at Thury-Harcourt / Conde; Canadians still short of Falaise;
         gap Argentan - Canadians under 25 miles; St-Malo still holding (fell 17 Aug); Nantes and Angers US.
  aug20  night 19-20 Aug: pocket closed at Chambois (19 Aug evening) with a small German remnant west of it; XV Corps at Dreux (16)
         and Mantes (19), the 79th across the Seine at Mantes (dam, 19-20 Aug); XX Corps Chartres (18); XII Corps Orleans (16-17);
         Paris still German; Loire = southern flank; St-Malo Allied.
German pockets on every date: Brest (with Crozon), Lorient (with Groix), St-Nazaire, the Channel Islands, Belle-Ile.
-> assets/media/pa1_nor_ctl_<date>_mx.png, pa1_nor_front_<date>.json (map px, Allied on the LEFT of travel = K.front sideA carth),
   pa1_nor_riv.png (2x river layer), pa1_avr_riv.png, pa1_avr_front.json, pa1_lem_*.json (if the lemans basemap exists)
usage (from patton/): python3 tools/pa1_make_control.py ; python3 tools/pa1_loss_layers.py pa1_nor_ctl jul24 jul31 jul31 aug8 aug8 aug13 aug13 aug20"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
from pa1_geo import proj, PLACES

def land_of(base):
    return np.array(Image.open(f"assets/{base}_land.png").convert("L").resize((2880, 1620))) > 127

def render(land, hero, name):
    hero = hero & land; un = land & ~hero
    out = np.zeros(land.shape + (4,), np.float32)
    d = ndimage.distance_transform_edt(~hero)
    out[un, :3] = (240, 105, 95); out[un, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[un]
    out[hero, :3] = (110, 160, 255); out[hero, 3] = 0.565
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(hero, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 130, 115); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}", optimize=True)
    print("wrote", name)

def poly(P, pts):
    im = Image.new("L", (2880, 1620), 0); ImageDraw.Draw(im).polygon([P(*q) for q in pts], fill=255); return np.array(im) > 0

def circle(P, lat, lon, km, mpp):
    x, y = P(lat, lon); r = km * 1000 / mpp
    yy, xx = np.mgrid[0:1620, 0:2880]; return (xx - x) ** 2 + (yy - y) ** 2 < r * r

def orient(P, pts, hero):
    """map px polyline with the Allied side on the LEFT of travel (K.front sideA)."""
    px = [P(*q) for q in pts]; score = 0
    for (x0, y0), (x1, y1) in zip(px, px[1:]):
        dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1; mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        lx, ly = int(mx + dy / L * 12), int(my - dx / L * 12)   # left of travel in screen coords (y down): (dy, -dx)
        if 0 <= lx < 2880 and 0 <= ly < 1620: score += 1 if hero[ly, lx] else -1
    if score < 0: px = px[::-1]
    return [[round(x, 1), round(y, 1)] for x, y in px]

def rivers(base, out, minorder, col=(96, 150, 190, 235), widths={1: 2, 2: 4, 3: 7}):
    W, H = 5760, 3240; im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); shimmer = []
    for seg in json.load(open(f"assets/src/{base}_dem_rivers.json")):
        o = seg["order"]
        if o < minorder: continue
        g = [tuple(q) for q in seg["pts"]]
        d.line(g, fill=col if o > 1 else (80, 128, 160, 150), width=widths[o], joint="curve")
        if o == 3: shimmer.append([[round(x / 2, 1), round(y / 2, 1)] for x, y in g[::6] + [g[-1]]])
    im.save(f"assets/media/{out}.png", optimize=True); json.dump(shimmer, open(f"assets/media/{out}.json", "w")); print("wrote", out)

# ---------------- normandy (z9) ----------------
EAST = [(49.335, -0.19), (49.287, -0.19), (49.240, -0.215), (49.180, -0.205)]          # Orne-mouth bridgehead (unchanged to mid-Aug)
JUL31 = EAST + [(49.140, -0.24), (49.108, -0.31), (49.118, -0.38), (49.105, -0.46), (49.115, -0.52), (49.122, -0.62), (49.105, -0.70),
                (49.050, -0.78), (48.995, -0.85), (48.985, -0.95), (48.965, -1.06), (48.920, -1.15), (48.840, -1.15), (48.745, -1.13),
                (48.680, -1.22), (48.628, -1.33), (48.615, -1.42), (48.630, -1.52)]
WEST31 = [(48.66, -1.66), (48.80, -1.75), (49.10, -1.78), (49.40, -1.96), (49.60, -2.00), (50.1, -2.0), (50.1, -0.19)]
AUG8 = EAST + [(49.10, -0.22), (49.05, -0.28), (49.04, -0.36), (49.02, -0.47), (48.97, -0.62), (48.92, -0.72), (48.84, -0.84),
               (48.76, -0.90), (48.71, -0.98), (48.675, -1.02), (48.64, -0.99), (48.60, -0.93), (48.50, -0.85), (48.40, -0.72),
               (48.32, -0.65), (48.29, -0.55), (48.22, -0.38), (48.13, -0.15), (48.07, 0.10), (48.05, 0.26), (48.00, 0.33),
               (47.90, 0.30), (47.70, 0.10), (47.45, -0.30), (47.40, -0.70), (47.33, -1.10), (47.29, -1.40), (47.30, -1.50),
               (47.33, -1.65), (47.35, -1.95), (47.40, -2.15), (47.40, -2.45), (47.33, -2.55)]
AUG13 = EAST + [(49.10, -0.21), (49.02, -0.20), (48.98, -0.25), (48.97, -0.33), (48.97, -0.48), (48.90, -0.55), (48.84, -0.62),
                (48.78, -0.70), (48.70, -0.68), (48.62, -0.60), (48.60, -0.45), (48.60, -0.27), (48.66, -0.16), (48.71, -0.10),
                (48.725, -0.02), (48.71, 0.08), (48.62, 0.22), (48.50, 0.35), (48.35, 0.40), (48.05, 0.42), (47.80, 0.35),
                (47.45, 0.05), (47.40, -0.30), (47.38, -0.80), (47.30, -1.20), (47.22, -1.45), (47.20, -1.60), (47.30, -1.80),
                (47.36, -2.00), (47.41, -2.20), (47.40, -2.45), (47.33, -2.55)]
AUG20 = [(49.300, -0.05), (49.20, 0.07), (49.10, 0.10), (48.95, 0.09), (48.87, 0.12), (48.84, 0.12), (48.815, 0.10),
         (48.79, 0.20), (48.75, 0.45), (48.72, 0.70), (48.74, 0.93), (48.80, 1.15), (48.90, 1.40), (48.98, 1.58), (49.035, 1.68),
         (49.04, 1.76), (49.00, 1.82), (48.93, 1.95), (48.78, 2.05), (48.60, 2.22), (48.42, 2.18), (48.15, 2.05), (47.95, 1.98),
         (47.85, 1.70), (47.60, 1.33), (47.43, 0.75), (47.40, 0.30), (47.40, -0.30), (47.38, -0.80), (47.30, -1.20), (47.22, -1.45),
         (47.20, -1.60), (47.30, -1.80), (47.36, -2.00), (47.41, -2.20), (47.40, -2.45), (47.33, -2.55)]
SOUTHWEST = [(47.20, -2.70), (46.80, -2.80), (46.80, -5.60), (50.1, -5.60)]          # offshore round Brittany, then the Channel
CLOSE_E = lambda la: [(50.1, la), (49.6, la)]
# 24 Jul, eve of Cobra (collins/tools/make_nor_control.py, FACT_NOTES_cobra): Ay river - north of Periers - Periers-St-Lo road - St-Lo - Caumont
JUL24 = EAST + [(49.140, -0.24), (49.108, -0.31), (49.118, -0.38), (49.105, -0.46), (49.115, -0.52), (49.122, -0.62), (49.110, -0.72),
                (49.088, -0.79), (49.090, -0.86), (49.085, -0.95), (49.095, -1.03), (49.103, -1.09), (49.128, -1.13), (49.152, -1.19),
                (49.166, -1.25), (49.186, -1.33), (49.205, -1.41), (49.222, -1.48), (49.234, -1.56), (49.235, -1.72)]
WEST24 = [(49.30, -1.85), (49.40, -1.96), (49.60, -2.00), (50.1, -2.0), (50.1, -0.19)]
STATES = {"jul24": (JUL24, WEST24, []), "jul31": (JUL31, WEST31, []),
          "aug8": (AUG8, SOUTHWEST + CLOSE_E(-0.19), ["stmalo"]),
          "aug13": (AUG13, SOUTHWEST + CLOSE_E(-0.19), ["stmalo"]),
          "aug20": (AUG20, SOUTHWEST + CLOSE_E(-0.05), ["pocket"])}

def normandy():
    P = proj("normandy"); land = land_of("normandy"); mpp = 202.19
    pockets = lambda: (circle(P, 48.40, -4.47, 17, mpp) | circle(P, 48.26, -4.45, 12, mpp) | circle(P, 47.74, -3.36, 15, mpp) |
                       circle(P, 47.64, -3.47, 6, mpp) | circle(P, 47.33, -3.17, 12, mpp) | circle(P, 49.21, -2.13, 14, mpp) |
                       circle(P, 49.46, -2.58, 14, mpp) | circle(P, 49.71, -2.20, 8, mpp) | circle(P, 49.43, -2.36, 6, mpp))
    PK = pockets()
    for name, (front, closing, extra) in STATES.items():
        hero = poly(P, front + closing)
        if not name.startswith("jul"): hero &= ~PK
        else: hero &= ~(circle(P, 49.21, -2.13, 14, mpp) | circle(P, 49.46, -2.58, 14, mpp) | circle(P, 49.71, -2.20, 8, mpp))
        if "stmalo" in extra: hero &= ~(circle(P, 48.638, -2.03, 8, mpp))
        if "pocket" in extra:   # the German remnant west of the Chambois link-up (19-20 Aug)
            hero &= ~(poly(P, [(48.86, -0.10), (48.87, 0.02), (48.845, 0.09), (48.83, 0.115), (48.815, 0.095), (48.80, 0.03), (48.79, -0.08), (48.82, -0.14)]))
        render(land, hero, f"pa1_nor_ctl_{name}_mx.png")
        json.dump([orient(P, front, hero)], open(f"assets/media/pa1_nor_front_{name}.json", "w"))
    pl = {k: [round(c, 1) for c in P(*v)] for k, v in PLACES.items()}
    json.dump(pl, open("assets/media/pa1_nor_places.json", "w"))
    rivers("normandy", "pa1_nor_riv", 2)

# ---------------- avranches (z12), option 2 front on 31 Jul - 1 Aug ----------------
AVR_FRONT = [(48.585, -1.53), (48.575, -1.45), (48.560, -1.38), (48.565, -1.30), (48.600, -1.24), (48.640, -1.20), (48.700, -1.16),
             (48.760, -1.12), (48.840, -1.13), (48.900, -1.15)]
def avranches():
    P = proj("avranches"); land = land_of("avranches")
    hero = poly(P, AVR_FRONT + [(49.2, -1.15), (49.2, -2.2), (48.585, -2.2)])
    json.dump([orient(P, AVR_FRONT, hero)], open("assets/media/pa1_avr_front.json", "w"))
    json.dump({k: [round(c, 1) for c in P(*v)] for k, v in PLACES.items()}, open("assets/media/pa1_avr_places.json", "w"))
    rivers("avranches", "pa1_avr_riv", 1, widths={1: 3, 2: 6, 3: 10})

# ---------------- lemans (z12), option 2 fronts 7-8 Aug ----------------
LEM_A = [(48.33, -0.29), (48.25, -0.10), (48.17, 0.05), (48.12, 0.20), (48.10, 0.35), (48.05, 0.50), (47.95, 0.55), (47.85, 0.50), (47.75, 0.40)]   # 7 Aug: closing on Le Mans from the west/south-west
LEM_B = [(48.33, -0.20), (48.24, -0.02), (48.15, 0.12), (48.09, 0.26), (48.04, 0.38), (47.98, 0.45), (47.90, 0.46), (47.82, 0.42), (47.75, 0.38)]   # 8 Aug evening: Le Mans taken, exits closed
def lemans():
    if not os.path.exists("assets/lemans_hd_lift.json"): print("lemans not baked yet"); return
    P = proj("lemans")
    for nm, fr in (("a", LEM_A), ("b", LEM_B)):
        hero = poly(P, fr + [(47.5, -1.0), (48.6, -1.0)])
        json.dump([orient(P, fr, hero)], open(f"assets/media/pa1_lem_front_{nm}.json", "w"))
    json.dump({k: [round(c, 1) for c in P(*v)] for k, v in PLACES.items()}, open("assets/media/pa1_lem_places.json", "w"))
    if os.path.exists("assets/src/lemans_dem_rivers.json"): rivers("lemans", "pa1_lem_riv", 1, widths={1: 3, 2: 6, 3: 10})

if __name__ == "__main__":
    which = sys.argv[1:] or ["normandy", "avranches", "lemans"]
    for w in which: globals()[w]()
