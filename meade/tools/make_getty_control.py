"""Gettysburg control overlays (option 1, multiply) + front-line / position JSON (option 2) for `getty` (z14) and `getty15` (z15).
Colours (sides REVERSED from Jackson #11): Union-held = blue (110,160,255) a=0.565; Confederate-held = red (232,52,52), stronger near
the border + the bright rim (255,120,100) on the red side where the sides meet (same look as make_nova_control / make_virginia_control).
Control is drawn as ONE boundary per date (Confederate ground north/west of it, Union ground south/east), traced midway between the
two armies' lines where they faced each other (sources + notes: research/FACT_NOTES_getty.md; accuracy ~100-200 m in the core).
usage (from meade/): python3 tools/make_getty_control.py
-> assets/media/{getty,getty15}_ctl_<date>_mx.png  (2880x1620 multiply overlays)  dates:
     jul1am  1 Jul ~10 am: Heth's division coming down the Chambersburg Pike, Buford's cavalry west of town (Union holds the rest)
     jul1    1 Jul evening: Confederates hold the town, Seminary Ridge north part, the ground north + east; Union on the hills
     jul2am  2 Jul morning (before Sickles moves): the fishhook vs Seminary Ridge + the town + Johnson east of Rock Creek
     jul2s   2 Jul ~3 pm: Sickles's III Corps salient (Peach Orchard - Wheatfield - Devil's Den), Longstreet on Warfield Ridge
     jul2pm  2 Jul night: Peach Orchard, Wheatfield, Devil's Den, Houck's Ridge lost (front at Plum Run / foot of Little Round
             Top); Johnson's men in the empty lower Culp's Hill works near Spangler's Spring; main line held
     jul3    3 Jul ~1 pm (before the charge): lower Culp's Hill retaken in the morning; the south = jul2pm
-> assets/media/getty_fronts.json  {"fronts": {date: {"getty": [[x,y]...], "getty15": [...]}},   the boundary through the battle area
                                    (east of Culp's Hill -> around the barb -> down Cemetery Ridge front -> past the Round Tops),
                                    resampled every ~10 map px, TRACED WITH THE UNION ON THE LEFT OF TRAVEL:
                                    K.front({ pts, sideA: "carth", sideB: "rome", width: 15, glow: 0.47 }) gives blue inside the hook;
                                    same point count for every date -> usable as K.front `to` (moveT) for a collapsing front.
                                    "lines": {name: {"getty": [...], "getty15": [...]}}  unit positions (one colour each):
                                    union_hook_jul2   the Union main line 2 Jul (Spangler's Spring - Culp's Hill - Cemetery Hill -
                                                      Cemetery Ridge - Little Round Top), traced barb -> south
                                    csa_arc_jul2      the Confederate outer arc (Johnson east of Culp's Hill - Early/Rodes in + below
                                                      the town - Hill on Seminary Ridge - Longstreet on Warfield Ridge), east -> south
                                    sickles_jul2      III Corps forward line ~3 pm (Devil's Den - Rose Woods/Wheatfield - Peach Orchard -
                                                      Emmitsburg Road north to the Klingle/Codori farms), south -> north
                                    ridge_south       southern Cemetery Ridge (II Corps left -> Little Round Top): III Corps' assigned
                                                      place, empty after Sickles moved (the "hole"), north -> south
                                    plum_run_line     the evening stop line (McGilvery's guns + Willard + Lockwood + 1st Minnesota) along
                                                      Plum Run, north -> south
                                    chord             interior-lines chord Culp's Hill -> Little Round Top (inside the hook)
                                    outer_arc         the matching outside route (Benner's Hill - the town - Seminary Ridge - Warfield Ridge)"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

def chaikin(pts, n=2):
    for _ in range(n):
        out = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            out += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        out.append(pts[-1]); pts = out
    return pts

# ---------- boundaries (lat, lon), east edge -> south edge; Confederate ground on the RIGHT of travel (north/west) ----------
EAST_IN = [(39.8450, -77.100), (39.8380, -77.150), (39.8320, -77.180),       # Johnson + Stuart (2 Jul pm, Hunterstown) north; Gregg's
           (39.8270, -77.1980), (39.8235, -77.2085)]                         # Union cavalry on the Hanover Road (Brinkerhoff's Ridge) south
BARB = [(39.8200, -77.2090), (39.8150, -77.2095), (39.8110, -77.2110),     # Johnson's ground east of Rock Creek (Benner's Hill side)
        (39.8115, -77.2150), (39.8150, -77.2160), (39.8180, -77.2172),       # Rock Creek below Culp's Hill (Spangler's Spring Union)
        (39.8212, -77.2185),                                                 # up the east face of Culp's Hill (Rock Creek between)
        (39.8238, -77.2222), (39.8243, -77.2262), (39.8240, -77.2300),       # north of Culp's + East Cemetery Hill (Early at the foot)
        (39.8243, -77.2330), (39.8228, -77.2365)]                            # the south edge of the town (Rodes's men in the streets)
BARB_2PM = [(39.8200, -77.2090), (39.8150, -77.2095), (39.8110, -77.2110),   # 2 Jul night: Steuart's brigade in the empty lower works
            (39.8112, -77.2150), (39.8128, -77.2182), (39.8158, -77.2194),   # west of Rock Creek (Spangler's Spring, the lower hill)
            (39.8188, -77.2196), (39.8212, -77.2192),
            (39.8238, -77.2222), (39.8243, -77.2262), (39.8240, -77.2300), (39.8243, -77.2330), (39.8228, -77.2365)]
SOUTH_AM = [(39.8195, -77.2400), (39.8150, -77.2440), (39.8100, -77.2470),   # midway Cemetery Ridge / Seminary Ridge (Bliss farm,
            (39.8050, -77.2482), (39.8000, -77.2508), (39.7940, -77.2528),   # Emmitsburg Road pickets) -> Pitzer's Woods
            (39.7880, -77.2538), (39.7820, -77.2560), (39.7700, -77.2650), (39.7500, -77.2850)]
SOUTH_S = [(39.8195, -77.2400), (39.8150, -77.2440), (39.8110, -77.2465),    # 2 Jul ~3 pm: around Sickles's salient (Humphreys on the
           (39.8060, -77.2500), (39.8020, -77.2520), (39.7985, -77.2510),    # Emmitsburg Road, Graham at the Peach Orchard angle) ->
           (39.7950, -77.2490), (39.7910, -77.2465), (39.7870, -77.2445),    # facing Warfield Ridge (Longstreet) down to the Round Tops
           (39.7810, -77.2460), (39.7700, -77.2600), (39.7500, -77.2850)]
SOUTH_PM = [(39.8195, -77.2400), (39.8150, -77.2430), (39.8105, -77.2420),   # 2 Jul night: Emmitsburg Road at Codori held by neither ->
            (39.8065, -77.2405), (39.8035, -77.2392), (39.8000, -77.2390),   # Plum Run line (McGilvery, Willard, Lockwood) -> east of
            (39.7965, -77.2398), (39.7935, -77.2402), (39.7905, -77.2400),   # Trostle -> the Wheatfield/Houck's Ridge lost -> Plum Run
            (39.7875, -77.2408), (39.7840, -77.2425), (39.7790, -77.2470),   # below Little Round Top (Valley of Death) -> Big Round Top
            (39.7700, -77.2600), (39.7500, -77.2850)]                        # W slope (Union on top from the night of 2 Jul)
# 1 Jul
JUL1AM = [(39.9000, -77.2700), (39.8600, -77.2720), (39.8450, -77.2750), (39.8380, -77.2690), (39.8300, -77.2720), (39.8200, -77.2900),
          (39.7500, -77.3300)]   # ~10 am: Heth's division deploying on Herr Ridge astride the Chambersburg Pike (Buford on McPherson's Ridge)
JUL1_W = [(39.8195, -77.2400), (39.8230, -77.2470), (39.8200, -77.2560), (39.8100, -77.2650), (39.7900, -77.2800), (39.7500, -77.3100)]
# 1 Jul evening: Hill's corps on Seminary Ridge from the Fairfield Road north + Herr Ridge; the ground south of it not yet occupied

def boundary(date):
    if date == "jul1am": return JUL1AM
    if date == "jul1": return EAST_IN + BARB + JUL1_W
    if date == "jul2am": return EAST_IN + BARB + SOUTH_AM
    if date == "jul2s": return EAST_IN + BARB + SOUTH_S
    if date == "jul2pm": return EAST_IN + BARB_2PM + SOUTH_PM
    if date == "jul3": return EAST_IN + BARB + SOUTH_PM
CLOSE = [(39.7400, -77.4500), (39.9100, -77.4500), (39.9100, -77.0500), (39.8450, -77.0500)]   # north/west beyond the frame
CLOSE_AM = [(39.7400, -77.4500), (39.9100, -77.4500)]                                       # jul1am: only the far west

# ---------- unit-position lines ----------
LINES = {
    "union_hook_jul2": [(39.8125, -77.2165), (39.8160, -77.2180), (39.8198, -77.2205), (39.8218, -77.2240), (39.8222, -77.2275),
                        (39.8218, -77.2300), (39.8205, -77.2330), (39.8170, -77.2347), (39.8134, -77.2364), (39.8090, -77.2365),
                        (39.8040, -77.2362), (39.7990, -77.2360), (39.7950, -77.2360), (39.7918, -77.2362)],
    "csa_arc_jul2": [(39.8125, -77.2110), (39.8190, -77.2120), (39.8250, -77.2150), (39.8270, -77.2230), (39.8262, -77.2300),
                     (39.8270, -77.2380), (39.8250, -77.2440), (39.8200, -77.2465), (39.8130, -77.2500), (39.8060, -77.2530),
                     (39.8000, -77.2545), (39.7930, -77.2560), (39.7860, -77.2545)],
    "sickles_jul2": [(39.7905, -77.2430), (39.7935, -77.2440), (39.7958, -77.2452), (39.7975, -77.2470), (39.7995, -77.2488),
                     (39.8010, -77.2490), (39.8040, -77.2478), (39.8070, -77.2458), (39.8095, -77.2438)],
    "ridge_south": [(39.8060, -77.2360), (39.8020, -77.2360), (39.7985, -77.2360), (39.7950, -77.2361), (39.7925, -77.2362)],
    "plum_run_line": [(39.8070, -77.2378), (39.8045, -77.2380), (39.8020, -77.2378), (39.7995, -77.2376), (39.7970, -77.2380)],
    "chord": [(39.8198, -77.2211), (39.8150, -77.2290), (39.8060, -77.2335), (39.7960, -77.2355), (39.7918, -77.2362)],
    "outer_arc": [(39.8198, -77.2150), (39.8260, -77.2143), (39.8275, -77.2250), (39.8268, -77.2350), (39.8250, -77.2440),
                  (39.8150, -77.2500), (39.8050, -77.2540), (39.7950, -77.2560), (39.7880, -77.2530)],
}

def projector(base):
    J = json.load(open(f"assets/{base}.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** z; r = math.radians(lat); return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
    return P, J["size"]

def resample(pts, step):
    p = np.array(pts); s = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    t = np.linspace(0, s[-1], max(2, int(s[-1] / step) + 1))
    return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in t]

def front_part(b):
    """the battle-area part of a boundary: from just east of Culp's Hill to just south of Big Round Top, Union on the LEFT"""
    core = [q for q in b if q[1] <= -77.2085 and q[0] >= 39.7780] if b is not JUL1AM else [q for q in b if 39.80 < q[0] < 39.87]
    return core   # boundary runs east -> south with the Confederates on the right = Union on the left

DATES = ["jul1am", "jul1", "jul2am", "jul2s", "jul2pm", "jul3"]
if __name__ == "__main__":
    fronts = {d: {} for d in DATES}; lines = {k: {} for k in LINES}
    for base in ("getty", "getty15"):
        P, (W, H) = projector(base)
        mpp = json.load(open(f"assets/{base}.json"))["meters_per_px"]
        for date in DATES:
            b = boundary(date); poly = chaikin(b + (CLOSE_AM if date == "jul1am" else CLOSE), 0)
            sm = chaikin(b, 3) + (CLOSE_AM if date == "jul1am" else CLOSE)
            im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([P(*q) for q in sm], fill=255)
            csa = np.array(im) > 0; un = ~csa
            out = np.zeros((H, W, 4), np.float32)
            d = ndimage.distance_transform_edt(~un)               # distance from the Union ground (for red pixels)
            fall = 40.0 * 7.34 / mpp
            out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / fall))[csa]
            out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
            rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
            sel = np.clip(rim, 0, 1) > 0.35
            out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
            Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{base}_ctl_{date}_mx.png", optimize=True)
            fp = [P(*q) for q in chaikin(front_part(b), 3)]
            fronts[date][base] = resample(fp, 10.0 if base == "getty" else 20.0)
        for k, v in LINES.items(): lines[k][base] = resample([P(*q) for q in chaikin(v, 2)], 8.0 if base == "getty" else 16.0)
        print("wrote", base)
    # same point count across the 2-3 July fronts (for K.front `to`): resample all to the jul2am count per map
    for base in ("getty", "getty15"):
        n = len(fronts["jul2am"][base])
        for date in ("jul2s", "jul2pm", "jul3"):
            p = np.array(fronts[date][base]); s = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]; t = np.linspace(0, s[-1], n)
            fronts[date][base] = [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in t]
    json.dump({"fronts": fronts, "lines": lines}, open("assets/media/getty_fronts.json", "w"), separators=(",", ":"))
    print({d: {b: len(v) for b, v in f.items()} for d, f in fronts.items()})
