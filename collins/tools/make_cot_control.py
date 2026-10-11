"""MOVE 1 (Cherbourg, June 1944) control maps + front lines, both basemaps:
  normandy z10 ('cot_' = Cotentin wide shots, option 1) and cherbourg z12 ('cbg_' = city battle, option 2 + final zoom-out option 1).
Allied ground per date = one lat/lon polygon (offshore vertices close it; everything is clipped to land). Sources + notes for every
line: research/FACT_NOTES_cotentin.md ("control map"). Approximate to ~1-2 km.
-> assets/media/cot_ctl_<date>_mx.png   (normandy, multiply overlay like europe_ctlm_jun5_mx: axis (232,52,52) / allied (110,160,255))
-> assets/media/cbg_ctl_<date>_mx.png   (cherbourg, same look)
-> assets/cbg_land.png is NOT written (land mask computed in memory from assets/src/cherbourg_hd_elev.npy)
-> inlines `const CD = {...}` (fronts + places in map px) into scenes-src/move1a.js and move1b.js
usage (from collins/): python3 tools/make_cot_control.py"""
import json, math, os, re
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

MAPS = {"cot": "normandy", "cbg": "cherbourg"}
def proj(base):
    J = json.load(open(f"assets/{base}.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** z; r = math.radians(lat)
        return (round((lon + 180) / 360 * n - ox, 1), round((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy, 1))
    return P

# ---- fronts (lat, lon) ----
# southern face of the lodgement (VIII Corps line along the Douve after the cut + V Corps / British line to the Orne), west -> east
SOUTH_CUT = [(49.345, -1.725), (49.360, -1.630), (49.372, -1.545), (49.350, -1.460), (49.315, -1.390), (49.300, -1.350)]
SOUTH_EAST = [(49.280, -1.290), (49.265, -1.240), (49.250, -1.160), (49.220, -1.100), (49.170, -1.070), (49.120, -0.950), (49.100, -0.800),
              (49.150, -0.680), (49.180, -0.600), (49.220, -0.450), (49.230, -0.360), (49.200, -0.250), (49.240, -0.150), (49.290, -0.100)]
# northern front, EAST -> WEST (K.front sideA = blue = south side)
N_JUN14 = [(49.520, -1.200), (49.515, -1.285), (49.500, -1.330), (49.480, -1.370), (49.455, -1.410), (49.430, -1.440), (49.410, -1.480),
           (49.395, -1.510)]
N_JUN18 = [(49.520, -1.200), (49.515, -1.285), (49.500, -1.330), (49.480, -1.370), (49.455, -1.410), (49.440, -1.470), (49.425, -1.530),
           (49.420, -1.600), (49.410, -1.700), (49.405, -1.790)]
N_JUN21 = [(49.625, -1.200), (49.615, -1.300), (49.600, -1.400), (49.605, -1.480), (49.610, -1.530), (49.595, -1.580), (49.590, -1.640),
           (49.600, -1.700), (49.625, -1.760), (49.640, -1.840), (49.645, -1.900)]
# Cherbourg close-up: 24 June (closing on the city), 26 June (arsenal pocket + the Hague line), EAST -> WEST
R24 = [(49.665, -1.540), (49.645, -1.565), (49.632, -1.585), (49.622, -1.610), (49.618, -1.640), (49.625, -1.672), (49.638, -1.720),
       (49.662, -1.800)]
ARSENAL = [(49.652, -1.618), (49.643, -1.626), (49.642, -1.640), (49.652, -1.650)]
HAGUE = [(49.675, -1.800), (49.655, -1.812), (49.635, -1.830), (49.620, -1.865)]

def allied_poly(state):
    off_e, off_w = [(49.45, -0.05)], []
    if state == "jun14":
        north = N_JUN14; south = [(49.370, -1.500)] + SOUTH_CUT[3:] + SOUTH_EAST
        return north + south + off_e + [(49.60, -1.10)]  # north front east->west, then the south face west->east, closing offshore
    if state == "jun18":
        north = N_JUN18
    elif state == "jun21":
        north = N_JUN21
    else:  # jul1: the whole peninsula north of the southern line
        north = [(49.85, -1.0), (49.85, -2.2)]
    west_off = [(north[-1][0], -2.25), (49.33, -2.25)]
    return [north[0][:1] + (-1.0,)] + north + west_off + SOUTH_CUT + SOUTH_EAST + off_e + [(49.62, -1.0)]

def mask(P, poly, W, H):
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([P(*q) for q in poly], fill=255); return np.array(im) > 0

def overlay(name, al, land):
    H, W = land.shape
    al = al & land; ax = land & ~al
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~al)
    a_ax = 0.67 + 0.25 * np.exp(-d / 40.0)
    out[ax, :3] = (232, 52, 52); out[ax, 3] = a_ax[ax]
    out[al, :3] = (110, 160, 255); out[al, 3] = 0.565
    rim = ndimage.gaussian_filter((ax & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), 5) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}.png", optimize=True)
    print("wrote", name)

def chaikin(pts, k=2):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts
def resample(P, line, n=48):
    p = chaikin([P(*q) for q in line]); seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
    u = np.linspace(0, s[-1], n); return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in u]

PLACES = dict(utah=(49.415, -1.175), car=(49.303, -1.248), sme=(49.408, -1.317), val=(49.509, -1.470), barn=(49.383, -1.752),
              ssv=(49.386, -1.532), chb=(49.639, -1.616), roule=(49.6315, -1.6115), oct=(49.627, -1.648), hague=(49.725, -1.940),
              vaast=(49.588, -1.268), quin=(49.513, -1.293), mont=(49.488, -1.379), stlo=(49.116, -1.090), caen=(49.180, -0.370),
              bayeux=(49.276, -0.703), omaha=(49.37, -0.88), tunnel=(49.6265, -1.6405), arsenal=(49.648, -1.633), equ=(49.646, -1.665),
              tourl=(49.640, -1.575), lhp=(49.289, -1.544), portbail=(49.335, -1.695), stjn=(49.425, -1.640), mesnil=(49.610, -1.530),
              stecroix=(49.625, -1.760), vauville=(49.638, -1.840), maupertus=(49.650, -1.480), quettehou=(49.594, -1.304))

if __name__ == "__main__":
    CD = {}
    # normandy (z10): land mask shared by the map agents (assets/normandy_land.png, read only)
    P = proj("normandy"); land = np.array(Image.open("assets/normandy_land.png").convert("L")) > 127
    H, W = land.shape
    for s in ("jun14", "jun18", "jun21", "jul1"): overlay(f"cot_ctl_{s}_mx", mask(P, allied_poly(s), W, H), land)
    CD["n"] = {"jun14": resample(P, N_JUN14), "jun18": resample(P, N_JUN18), "jun21": resample(P, N_JUN21),
               "places": {k: P(*v) for k, v in PLACES.items()}}
    # cherbourg (z12): land from the HD elevation (> 0.5 m, like bake.py with sea_below 0.5), downsampled 2x
    P = proj("cherbourg")
    if os.path.exists("assets/src/cherbourg_hd_elev.npy"):
        e = np.load("assets/src/cherbourg_hd_elev.npy")
        land = np.array(Image.fromarray(((e > 0.5) * 255).astype(np.uint8)).resize((2880, 1620), Image.BILINEAR)) > 127
    else:  # no HD cache (not in git): same rule from the z12 Terrarium tiles (bake.tile, cached in tools/.tiles)
        import sys; sys.path.insert(0, "tools"); from bake import tile
        J = json.load(open("assets/cherbourg.json")); z, (x0, y0), (W0, H0) = J["zoom"], J["origin_world_px"], J["size"]
        tx0, ty0, tx1, ty1 = x0 // 256, y0 // 256, (x0 + W0) // 256, (y0 + H0) // 256
        mos = np.vstack([np.hstack([tile(z, tx, ty) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
        land = mos[y0 - ty0 * 256:y0 - ty0 * 256 + H0, x0 - tx0 * 256:x0 - tx0 * 256 + W0] > J.get("sea_below", 0.5)
    H, W = land.shape
    for s in ("jun21", "jul1"): overlay(f"cbg_ctl_{s}_mx", mask(P, allied_poly(s), W, H), land)
    # a 26 June overlay for the zoom-out: city taken, arsenal + Hague still German
    al = mask(P, allied_poly("jul1"), W, H) & ~mask(P, HAGUE + [(49.62, -2.3), (49.80, -2.3), (49.80, -1.80)], W, H) \
         & ~mask(P, ARSENAL + [(49.70, -1.66), (49.70, -1.61)], W, H)
    overlay("cbg_ctl_jun26_mx", al, land)
    ring = N_JUN21[1:-1]
    CD["c"] = {"jun21": resample(P, ring, 56), "jun24": resample(P, R24, 56), "arsenal": resample(P, ARSENAL, 16), "hague": resample(P, HAGUE, 16),
               "places": {k: P(*v) for k, v in PLACES.items()}}
    js = json.dumps(CD, separators=(",", ":"))
    for sp in ("scenes-src/move1a.js", "scenes-src/move1b.js"):
        if os.path.exists(sp):
            s = open(sp).read(); s = re.sub(r"^const CD = .*$", lambda m: "const CD = " + js + ";", s, count=1, flags=re.M); open(sp, "w").write(s); print("inlined CD into", sp)
    json.dump(CD, open("assets/media/cot_fronts.json", "w"))
