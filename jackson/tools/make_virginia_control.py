"""Virginia 1861-63 control maps (option 1, multiply look) + main front polylines, on the `virginia` basemap (z9).
Confederate-held ground = blue (110,160,255) (hero, Jackson's side); Union-held = red (232,52,52). Union = every Union state on the map
(Pennsylvania, Maryland, Delaware, New Jersey, Ohio, Kentucky) + the parts of 1861 Virginia the Union held on that date
(UNION_VA polygons). No state borders drawn (the 1863 West Virginia line is NOT drawn). The rim (brightest red) sits where the sides meet.
Sources + notes per date: research/FACT_NOTES_virginia.md. Approximate to ~2-5 km (z9 = 239 m/px); the Potomac vertices are snapped
to the DEM-traced river (assets/src/virginia_dem_rivers.json) so the colour edge sits on the drawn river.
-> assets/media/virginia_ctl_<date>_mx.png   (2880x1620 multiply overlay)
-> assets/media/virginia_front_<date>.json   ([[x,y],...] map px: the main front in northern Virginia, Confederate side on the LEFT
                                               of travel = K.front sideA "carth")
usage (from jackson/): python3 tools/make_virginia_control.py [date ...]   dates: jul61 mar62 jun62 aug62 sep62 may63 jul63"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/virginia.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

# the Potomac, mouth -> Harpers Ferry -> Cumberland -> Fairfax Stone (Virginia = south bank; Arlington was Virginia since 1846)
POTOMAC = [(38.03, -76.32), (38.13, -76.62), (38.23, -76.90), (38.30, -77.00), (38.40, -77.05), (38.47, -77.20), (38.53, -77.29),
           (38.60, -77.18), (38.68, -77.12), (38.72, -77.05), (38.80, -77.04), (38.87, -77.06), (38.93, -77.12), (38.98, -77.24),
           (39.06, -77.38), (39.08, -77.48), (39.20, -77.47), (39.27, -77.54), (39.32, -77.73), (39.40, -77.78), (39.43, -77.80),
           (39.53, -77.82), (39.60, -77.82), (39.63, -78.00), (39.70, -78.18), (39.62, -78.32), (39.53, -78.46), (39.54, -78.62),
           (39.62, -78.72), (39.65, -78.76), (39.55, -78.85), (39.44, -78.98), (39.48, -79.07), (39.30, -79.30), (39.195, -79.487)]
# 1861 Virginia (incl. the later West Virginia) = south bank of the Potomac + the Ohio River + the Kentucky line, closed off-map
VIRGINIA = ([(36.40, -82.40), (37.46, -82.40), (37.46, -82.106), (37.54, -81.97), (37.66, -82.20), (38.60, -82.40), (38.85, -82.15),
             (39.03, -82.03), (39.27, -81.56), (39.40, -81.25), (39.56, -81.00), (39.65, -80.86), (39.92, -80.74), (40.06, -80.72),
             (40.30, -80.64), (40.40, -80.52), (39.72, -80.52), (39.72, -79.48)] + POTOMAC[::-1] +
            [(37.90, -76.10), (37.95, -75.90), (38.00, -75.62), (38.03, -75.24), (36.40, -75.00)])

# Union-held ground inside Virginia, per date. Polygons in (lat, lon); land outside Virginia is Union anyway.
NW_61 = [(40.4, -80.4), (39.72, -80.4), (39.72, -79.48), (39.30, -79.30), (39.10, -79.45), (38.85, -79.80), (38.70, -79.95),
         (38.60, -80.40), (38.55, -80.90), (38.45, -81.40), (38.50, -82.40), (40.4, -82.4)]                    # McClellan's NW Virginia (Rich Mtn 11 Jul 61)
NW_62 = [(40.4, -80.4), (39.72, -80.4), (39.72, -79.48), (39.48, -79.07), (39.44, -78.98), (39.55, -78.85), (39.40, -78.75),
         (39.05, -78.95), (38.80, -79.20), (38.62, -79.45), (38.45, -79.70), (38.25, -80.10), (37.95, -80.55), (37.65, -81.00),
         (37.40, -81.60), (37.30, -82.40), (40.4, -82.4)]                                                   # Mountain Dept (Frémont/Milroy/Cox)
NW_63 = [(40.4, -80.4), (39.72, -80.4), (39.72, -79.48), (39.48, -79.07), (39.44, -78.98), (39.55, -78.85), (39.35, -78.80),
         (39.05, -79.00), (38.85, -79.35), (38.65, -79.75), (38.40, -80.10), (38.10, -80.60), (37.75, -81.10), (37.50, -81.70),
         (37.35, -82.40), (40.4, -82.4)]
MONROE_61 = [(37.10, -76.47), (37.08, -76.30), (36.99, -76.28), (36.96, -76.35), (36.97, -76.44)]           # Fort Monroe, Hampton, Newport News
ARL_61 = [(38.94, -77.13), (38.90, -77.20), (38.84, -77.22), (38.76, -77.13), (38.71, -77.06), (38.80, -77.03), (38.88, -77.05)]  # Arlington + Alexandria
PATTERSON_61 = [(39.60, -77.82), (39.53, -77.83), (39.46, -77.99), (39.29, -77.90), (39.24, -77.80), (39.32, -77.72), (39.43, -77.79)]  # Charlestown-Martinsburg
EASTERN_SHORE = [(38.05, -75.95), (38.05, -75.20), (36.90, -75.70), (37.05, -76.20), (37.70, -76.20)]       # Union from Nov 1861
LOWER_PEN = [(37.30, -76.80), (37.33, -76.62), (37.25, -76.42), (37.10, -76.25), (36.98, -76.27), (36.98, -76.45), (37.10, -76.55), (37.20, -76.74)]  # Williamsburg-Yorktown-Fort Monroe
NORFOLK = [(36.99, -76.45), (36.95, -76.25), (36.93, -75.95), (36.70, -75.90), (36.70, -76.65), (36.88, -76.60)]          # Norfolk/Portsmouth/Suffolk (May 1862 on)
LOWER_VALLEY_62 = [(39.33, -77.73), (39.15, -77.85), (39.08, -78.10), (39.06, -78.45), (39.10, -78.80), (39.05, -79.00), (39.00, -79.80),
                   (39.85, -79.80), (39.85, -77.70)]   # White at Winchester, Miles at Harpers Ferry (= nova LOWER_VALLEY)
GLOUCESTER = [(37.25, -76.42), (37.30, -76.55), (37.40, -76.48), (37.35, -76.35)]

# northern Virginia front lines (lat, lon), travel so that Confederate ground is on the LEFT (K.front sideA = carth)
FRONT = {
    # 21 Jul 1861: Washington's bridgehead only (after First Bull Run the Confederates stood at Centreville / Fairfax)
    "jul61": [(38.71, -77.06), (38.76, -77.13), (38.84, -77.22), (38.90, -77.20), (38.94, -77.13)],
    # ~23 Mar 1862: Confederates back behind the Rappahannock (9 Mar); Banks at Winchester-Strasburg (Kernstown 23 Mar)
    "mar62": [(38.48, -77.30), (38.55, -77.55), (38.62, -77.75), (38.72, -77.85), (38.88, -78.05), (38.95, -78.25), (38.97, -78.45),
              (39.00, -78.62), (39.10, -78.85), (39.05, -78.95)],
    # ~20 May 1862: Banks dug in at Strasburg, Kenly's 1st Maryland at Front Royal, McDowell at Fredericksburg, Frémont at Franklin
    "may62": [(38.18, -77.20), (38.29, -77.44), (38.36, -77.62), (38.48, -77.88), (38.62, -78.05), (38.80, -78.12), (38.88, -78.25),
              (38.95, -78.40), (38.97, -78.60), (38.85, -78.95), (38.68, -79.30), (38.55, -79.55)],
    # ~26 May 1862: after Front Royal (23) + Winchester (25): Banks over the Potomac, the Valley Confederate to the river
    # (Harpers Ferry still held by Saxton)
    "may62b": [(38.18, -77.20), (38.29, -77.44), (38.36, -77.62), (38.48, -77.88), (38.62, -78.05), (38.85, -77.95), (39.05, -77.80),
               (39.25, -77.80), (39.30, -77.76)],
    # ~12 Jun 1862: Union on the Rappahannock (Fredericksburg occupied 18 Apr), Shields at Luray, Frémont at Mount Jackson
    "jun62": [(38.18, -77.20), (38.29, -77.44), (38.36, -77.62), (38.48, -77.88), (38.56, -78.10), (38.62, -78.30), (38.66, -78.46),
              (38.72, -78.62), (38.78, -78.82), (38.80, -79.20)],
    # 25 Aug 1862: Pope's line on the Rappahannock (Kelly's Ford - Rappahannock Station - Waterloo), then the east foot of the Bull Run
    # Mountains to the Potomac; Burnside at Falmouth; lower Valley = separate Union pocket (LOWER_VALLEY_62). Same as tools/make_nova_control.py
    "aug62": [(38.18, -77.20), (38.27, -77.40), (38.285, -77.47), (38.33, -77.53), (38.40, -77.63), (38.46, -77.73), (38.479, -77.781),
              (38.534, -77.808), (38.58, -77.84), (38.62, -77.855), (38.66, -77.865), (38.696, -77.906), (38.74, -77.84), (38.785, -77.755),
              (38.83, -77.70), (38.90, -77.665), (38.975, -77.64), (39.10, -77.60), (39.27, -77.55)],   # = nova_ctl_aug25 (move-2 agent)
    # ~5 Sep 1862: only Washington's defences + Harpers Ferry left to the Union in northern Virginia
    "sep62": [(38.70, -77.06), (38.75, -77.18), (38.84, -77.30), (38.93, -77.27), (38.98, -77.24)],
    # 2 May 1863: Hooker's base north of the Rappahannock (Falmouth), Fairfax/Centreville; Milroy at Winchester
    "may63": [(38.18, -77.20), (38.30, -77.46), (38.40, -77.62), (38.53, -77.81), (38.72, -77.70), (38.85, -77.60), (39.00, -77.70),
              (39.08, -77.90), (39.10, -78.20), (39.15, -78.55), (39.30, -78.80)],
    # 1 Jul 1863: Lee's army in Pennsylvania (arrows in the scenes, no fill); Union: Washington's defences to Fairfax
    "jul63": [(38.70, -77.06), (38.76, -77.25), (38.84, -77.40), (38.95, -77.38), (39.02, -77.30)],
}
def front_zone(f, back):  # Union ground north/east of a front: front + a closing path round the north (back = extra pts)
    return f + back
NOVA_BACK = lambda f: [(39.6, f[-1][1]), (39.6, -76.0), (f[0][0], -76.0)]
UNION_VA = {
    "jul61": [ARL_61, MONROE_61, PATTERSON_61, NW_61],
    "mar62": [front_zone(FRONT["mar62"], [(39.8, -79.0), (39.8, -76.5), (38.48, -76.9)]), MONROE_61, EASTERN_SHORE, NW_62],
    "may62": [front_zone(FRONT["may62"], [(39.8, -79.6), (39.8, -76.3), (38.18, -76.6)]), EASTERN_SHORE, NW_62, NORFOLK, GLOUCESTER,
              [(37.60, -77.30), (37.52, -77.27), (37.40, -77.20), (37.30, -77.05), (37.20, -76.74), (37.10, -76.55), (36.98, -76.45),
               (36.98, -76.27), (37.10, -76.25), (37.25, -76.42), (37.53, -76.79), (37.62, -77.02), (37.66, -77.18)]],
    "may62b": [front_zone(FRONT["may62b"], [(39.33, -77.72), (39.8, -77.5), (39.8, -76.3), (38.18, -76.6)]), EASTERN_SHORE, NW_62, NORFOLK, GLOUCESTER,
              [(37.60, -77.30), (37.52, -77.27), (37.40, -77.20), (37.30, -77.05), (37.20, -76.74), (37.10, -76.55), (36.98, -76.45),
               (36.98, -76.27), (37.10, -76.25), (37.25, -76.42), (37.53, -76.79), (37.62, -77.02), (37.66, -77.18)]],
    "jun62": [front_zone(FRONT["jun62"], [(39.8, -79.2), (39.8, -76.3), (38.18, -76.6)]), EASTERN_SHORE, NW_62, NORFOLK, GLOUCESTER,
              # McClellan on the Chickahominy, 6 miles from Richmond; base at White House on the Pamunkey
              [(37.60, -77.30), (37.52, -77.27), (37.40, -77.20), (37.30, -77.05), (37.20, -76.74), (37.10, -76.55), (36.98, -76.45),
               (36.98, -76.27), (37.10, -76.25), (37.25, -76.42), (37.53, -76.79), (37.62, -77.02), (37.66, -77.18)]],
    "aug62": [front_zone(FRONT["aug62"], [(39.60, -77.55), (39.8, -76.3), (38.18, -76.6)]), LOWER_VALLEY_62, EASTERN_SHORE, NW_62, NORFOLK, LOWER_PEN, GLOUCESTER],
    "sep62": [[(38.70, -77.06), (38.75, -77.18), (38.84, -77.30), (38.93, -77.27), (38.98, -77.24), (38.93, -77.12), (38.80, -77.03)],
              [(39.33, -77.76), (39.28, -77.80), (39.27, -77.70), (39.32, -77.68)],                 # Harpers Ferry (surrendered 15 Sep)
              EASTERN_SHORE, NW_62, NORFOLK, LOWER_PEN, GLOUCESTER],
    "may63": [front_zone(FRONT["may63"], [(39.8, -78.8), (39.8, -76.3), (38.18, -76.6)]), EASTERN_SHORE, NW_63, NORFOLK, LOWER_PEN, GLOUCESTER],
    "jul63": [[(38.70, -77.06), (38.76, -77.25), (38.84, -77.40), (38.95, -77.38), (39.02, -77.30), (38.98, -77.24), (38.93, -77.12), (38.80, -77.03)],
              EASTERN_SHORE, NW_63, NORFOLK, LOWER_PEN, GLOUCESTER],
}

def mask(polys, W, H):
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

def resample(line, step=10.0):
    p = chaikin([P(*q) for q in line]); seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
    t = np.arange(0, s[-1] + 1e-6, step)
    return np.c_[np.interp(t, s, p[:, 0]), np.interp(t, s, p[:, 1])]

def snap_potomac():
    R = json.load(open("assets/src/virginia_dem_rivers.json")); pts = np.array([q for r in R if r["order"] == 3 for q in r["pts"]], float) / 2
    n = 256 * 2 ** Z; out = []
    for la, lo in POTOMAC:
        x, y = P(la, lo); d = np.hypot(pts[:, 0] - x, pts[:, 1] - y); i = int(d.argmin())
        if d[i] < 14:
            x, y = pts[i]
        lon = (x + OX) / n * 360 - 180; lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + OY) / n))))
        out.append((lat, lon))
    return out

def build(date, land, va):
    H, W = land.shape
    un = (land & ~va) | (mask(UNION_VA[date], W, H) & land)
    csa = land & ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~csa)
    out[un, :3] = (232, 52, 52); out[un, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[un]
    out[csa, :3] = (110, 160, 255); out[csa, 3] = 0.565
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(csa, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/virginia_ctl_{date}_mx.png", optimize=True)
    fl = resample(FRONT[date])
    json.dump([[round(x, 1), round(y, 1)] for x, y in fl], open(f"assets/media/virginia_front_{date}.json", "w"))
    print("wrote virginia_ctl_%s_mx.png + front (%d pts)" % (date, len(fl)))

if __name__ == "__main__":
    land = np.array(Image.open("assets/virginia_land.png").convert("L")) > 127
    H, W = land.shape
    POTOMAC[:] = snap_potomac()
    VIRGINIA[18:18 + len(POTOMAC)] = POTOMAC[::-1]
    va = mask([VIRGINIA], W, H)
    for date in (sys.argv[1:] or list(UNION_VA)):
        build(date, land, va)
