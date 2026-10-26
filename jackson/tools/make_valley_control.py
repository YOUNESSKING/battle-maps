"""MOVE 1 (Shenandoah Valley, Mar-Jun 1862) control maps on the `valley` basemap (z10), option 1 multiply look (same colours and
alphas as peng/tools/make_nwkorea_control.py): Confederate-held = blue (110,160,255) a=0.565 (hero); Union-held = red (232,52,52)
a=0.67 with the bright rim on the front. Maryland (north/east of the Potomac, real OSM line) is Union on every date.
Union ground per date = the polygons below (lat, lon); everything else on land = Confederate. Sources + notes per date:
research/FACT_NOTES_valley.md ("control map"). Approximate to ~3-8 km (the 1862 'front' was a picket screen, not a trench line).
usage (from jackson/): python3 tools/make_valley_control.py
 -> assets/media/valley_ctl_<date>_mx.png  (2880x1620 multiply overlay; dates mar23, may8, may20, may26, jun1, jun7)
 -> assets/media/valley_fronts.json  {"<date>": [[[x,y],...], ...]} map px: every Union/Confederate boundary inside the map,
    oriented so the CONFEDERATE side is on the LEFT of travel = K.front({ sideA: "carth", sideB: "rome" })"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

BASE = "valley"
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
NW, NE = (39.85, -80.45), (39.85, -76.35)
# Union-held ground. Each polygon starts on the map's south/west edge, runs along the front (Union on the LEFT of travel) and
# closes round the north. The front part = the vertices flagged between the "|" markers (FRONT[date] slices).
U = {
  # 23 Mar (Kernstown): Union holds the lower Valley to about Strasburg (Shields at Winchester, cavalry to Strasburg 19-20 Mar),
  # the Alleghenies west of the Valley (Milroy's Cheat Mountain district toward Monterey), and northern Virginia down to the
  # Confederate line behind the Rappahannock (Johnston left Manassas 9 Mar; Fredericksburg still Confederate until 18 Apr).
  "mar23": [[(38.0, -80.45), (38.0, -79.62), (38.33, -79.40), (38.60, -79.05), (38.85, -78.78), (39.00, -78.62), (38.97, -78.48),
             (38.95, -78.38), (38.93, -78.28), (38.97, -78.15), (38.95, -77.95), (38.75, -77.80), (38.60, -77.60), (38.50, -77.40),
             (38.45, -77.25), (38.40, -76.35), NE, NW]],
  # 8 May (McDowell): Milroy/Schenck at McDowell (Bullpasture valley); Banks's main body around New Market, falling back (reached
  # Strasburg 13 May); Union in the Luray valley; McDowell's corps at Falmouth/Fredericksburg since 18 Apr.
  "may8": [[(38.0, -80.45), (38.0, -79.62), (38.30, -79.43), (38.45, -79.22), (38.58, -78.95), (38.60, -78.72), (38.60, -78.63),
            (38.60, -78.55), (38.62, -78.35), (38.68, -78.15), (38.62, -77.95), (38.50, -77.80), (38.40, -77.62), (38.27, -77.50),
            (38.25, -77.30), (38.30, -76.35), NE, NW]],
  # ~20-22 May (the Massanutten beat): Banks dug in at Strasburg facing south, outposts toward Fisher's Hill; Kenly's 1st Maryland
  # at Front Royal with pickets south of the town; Geary on the Manassas Gap RR; Frémont back at Franklin after McDowell.
  "may20": [[(38.0, -80.45), (38.0, -79.75), (38.35, -79.55), (38.55, -79.30), (38.75, -79.05), (38.92, -78.80), (38.95, -78.55),
             (38.94, -78.42), (38.93, -78.33), (38.86, -78.26), (38.86, -78.12), (38.80, -77.95), (38.68, -77.82), (38.53, -77.75),
             (38.40, -77.60), (38.27, -77.50), (38.25, -77.30), (38.30, -76.35), NE, NW]],
  # 23 May evening (after Front Royal): Kenly's garrison destroyed, the Luray valley and Front Royal Confederate; Banks still at
  # Strasburg (left for Winchester on the morning of 24 May); Union pickets toward Cedarville / Winchester.
  "may23": [[(38.0, -80.45), (38.0, -79.75), (38.35, -79.55), (38.55, -79.30), (38.75, -79.05), (38.92, -78.80), (38.95, -78.55),
             (38.94, -78.42), (38.95, -78.33), (39.00, -78.27), (39.02, -78.17), (38.97, -78.05), (38.86, -78.00), (38.80, -77.95),
             (38.68, -77.82), (38.53, -77.75), (38.40, -77.60), (38.27, -77.50), (38.25, -77.30), (38.30, -76.35), NE, NW]],
  # 26 May (after First Winchester): Banks across the Potomac at Williamsport; the Valley Confederate to the river except the
  # Harpers Ferry garrison (Saxton); Frémont still west of the Valley (Franklin -> Moorefield); northern Virginia Union.
  "may26": [[(38.0, -80.45), (38.0, -79.75), (38.35, -79.55), (38.55, -79.30), (38.75, -79.05), (39.05, -78.75), (39.30, -78.50),
             (39.55, -78.32), (39.70, -78.22), (39.85, -78.22), NW],
            [(39.42, -77.70), (39.30, -77.79), (39.20, -77.83), (39.05, -77.88), (38.90, -78.02), (38.80, -77.95), (38.68, -77.82),
             (38.53, -77.75), (38.40, -77.60), (38.27, -77.50), (38.25, -77.30), (38.30, -76.35), NE, (39.85, -77.70)]],
  # 1 Jun (Strasburg): Frémont on the Wardensville road at the western edge of Strasburg; Shields at Front Royal (retaken 30 May)
  # and pushing toward Strasburg; Harpers Ferry still Union; the Valley Pike Strasburg -> south still Confederate.
  "jun1": [[(38.0, -80.45), (38.0, -79.75), (38.35, -79.55), (38.55, -79.30), (38.80, -78.90), (38.98, -78.48), (39.02, -78.40),
            (39.20, -78.40), (39.40, -78.35), (39.70, -78.22), (39.85, -78.22), NW],
           [(39.42, -77.70), (39.30, -77.79), (39.20, -77.83), (39.05, -77.95), (38.99, -78.15), (38.96, -78.27), (38.88, -78.31),
            (38.80, -78.33), (38.78, -78.20), (38.68, -77.82), (38.53, -77.75), (38.40, -77.60), (38.27, -77.50), (38.25, -77.30),
            (38.30, -76.35), NE, (39.85, -77.70)]],
  # 7 Jun (eve of Cross Keys): Frémont at Harrisonburg (6 Jun), Shields's division in the Luray valley near Conrad's Store /
  # Lewiston; the whole lower Valley behind them Union; Jackson's army around Port Republic / Cross Keys.
  "jun7": [[(38.0, -80.45), (38.0, -79.75), (38.30, -79.40), (38.42, -79.00), (38.41, -78.88), (38.45, -78.73), (38.43, -78.64),
            (38.36, -78.70), (38.33, -78.64), (38.42, -78.52), (38.50, -78.42), (38.55, -78.25), (38.62, -78.00), (38.53, -77.75),
            (38.40, -77.60), (38.27, -77.50), (38.25, -77.30), (38.30, -76.35), NE, NW]],
}

def mask_poly(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0
def chaikin(pts, k=2):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts
def resample(p, step=12.0):
    seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
    t = np.arange(0, s[-1] + 1e-6, step)
    return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in t]

if __name__ == "__main__":
    land = np.array(Image.open(f"assets/{BASE}_land.png").convert("L")) > 127
    H, W = land.shape
    pot = json.load(open(f"assets/media/{BASE}_geo.json"))["rivers"]["potomac"]   # map px, upstream -> downstream
    n = 256 * 2 ** Z
    def ll(x, y): return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + OY) / n)))), (x + OX) / n * 360 - 180
    potll = [ll(*q) for q in pot]
    md = mask_poly([potll + [(37.5, -75.5), (40.5, -75.5), (40.5, potll[0][1])]], W, H)       # Maryland side of the Potomac
    fronts = {}
    for date, polys in U.items():
        un = (mask_poly(polys, W, H) | md) & land
        com = land & ~un
        out = np.zeros((H, W, 4), np.float32)
        dist = ndimage.distance_transform_edt(~com)
        out[un, :3] = (232, 52, 52); out[un, 3] = (0.67 + 0.25 * np.exp(-dist / 40.0))[un]
        out[com, :3] = (110, 160, 255); out[com, 3] = 0.565
        rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(com, iterations=3)).astype(np.float32), 4) * 3.0
        rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
        out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
        Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{BASE}_ctl_{date}_mx.png", optimize=True)
        # fronts: polygon edges that are not on the map frame and not on the Maryland shore, reversed (Confederate on the left)
        fl = []
        for poly in polys:
            pts = [P(*q) for q in poly]
            inside = [(-5 < x < W + 5 and -5 < y < H + 5) and not (q[0] <= 38.0 or q[1] <= -80.45 or q[1] >= -76.35 or q[0] >= 39.85)
                      for (x, y), q in zip(pts, poly)]
            run = []
            for p_, ok in zip(pts, inside):
                if ok: run.append(p_)
                elif run: fl.append(run); run = []
            if run: fl.append(run)
        fr = []
        for run in fl:
            if len(run) < 2: continue
            r = resample(chaikin(run[::-1]))
            r = [q for q in r if 0 <= q[0] < W and 0 <= q[1] < H and not md[int(q[1]), int(q[0])]]
            if len(r) > 3: fr.append(r)
        fronts[date] = fr
        print("wrote", f"{BASE}_ctl_{date}_mx.png", "fronts", [len(f) for f in fr])
    json.dump(fronts, open(f"assets/media/{BASE}_fronts.json", "w"), separators=(",", ":"))
