"""MOVE 1 map layers (Sherman #13, the Atlanta campaign, May - Sep 1864) for the basemaps `corridor` (z10), `kennesaw` (z12) and
`atlanta` (z11): geography layer, railroads, named-river glow paths, control overlays (option 1, multiply) and front polylines.
Owner of these files: the MOVE 1 agent (the hook agent reuses corridor_* / atlanta_* read-only). Facts: research/FACT_NOTES_corridor.md,
research/FACT_NOTES_atlanta.md.

usage (from sherman/):  python3 tools/make_m1_maps.py [geo] [ctl] [BASE ...]
  needs assets/src/<base>_dem_rivers.json (tools/make_rivers_dem.py <base>) and assets/src/south_ne_rivers.json / south_ne_states.geojson
-> assets/media/<base>_geo_ref.png      2x (5760x3240) shown at 0,0,2880,1620: state lines, rivers (traced from the HD elevation, the big
                                         ones routed along Natural Earth), 1864 railroads (thin dark line + cross-ties), 1860 big towns
   assets/media/<base>_rivers.json       map px polylines for LV.shimmer
   assets/media/<base>_lines.json        {"rail": {W&A, M&W, ...}, "river": {CHATTAHOOCHEE, ...}, "ridge": {...}} map px (glows in scenes)
   assets/media/<base>_ctl_<date>_mx.png  who holds the ground (Union blue (110,160,255) / Confederate red (232,52,52), multiply)
   assets/media/<base>_fronts.json       {date: [[x, y], ...]} the contact line per date, resampled to 24 points (K.front `to` morphs)
"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

FONT = "tools/oswald-latin-700-normal.ttf"
CS, US, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

# ---------------------------------------------------------------- geography (lat, lon) ----------------------------------------------
# 1864 railroads (stations checked against period maps / modern alignments of the same lines; +-300 m)
RAIL = {
    "WA": [(35.0456, -85.3097), (35.035, -85.285), (35.022, -85.255), (35.005, -85.215), (34.985, -85.160), (34.960, -85.130),
           (34.916, -85.109), (34.885, -85.085), (34.849, -85.044), (34.825, -85.025), (34.800, -85.010), (34.787, -84.995),
           (34.770, -84.970), (34.735, -84.955), (34.700, -84.940), (34.668, -84.928), (34.630, -84.935), (34.600, -84.942),
           (34.577, -84.943), (34.540, -84.948), (34.502, -84.951), (34.460, -84.945), (34.420, -84.940), (34.369, -84.934),
           (34.330, -84.938), (34.290, -84.942), (34.236, -84.944), (34.222, -84.905), (34.215, -84.865), (34.195, -84.835),
           (34.165, -84.801), (34.150, -84.775), (34.138, -84.748), (34.124, -84.725), (34.112, -84.712), (34.090, -84.695),
           (34.066, -84.678), (34.045, -84.643), (34.023, -84.615), (34.000, -84.588), (33.985, -84.566), (33.968, -84.556),
           (33.953, -84.550), (33.930, -84.540), (33.905, -84.527), (33.884, -84.514), (33.866, -84.490), (33.852, -84.470),
           (33.838, -84.455), (33.822, -84.442), (33.805, -84.430), (33.785, -84.413), (33.765, -84.398), (33.7525, -84.3910)],
    "GARR": [(33.7525, -84.3910), (33.754, -84.360), (33.762, -84.325), (33.774, -84.296), (33.785, -84.255), (33.796, -84.215),
             (33.806, -84.172), (33.760, -84.135), (33.712, -84.105), (33.668, -84.017), (33.630, -83.940), (33.597, -83.860),
             (33.625, -83.790), (33.656, -83.718), (33.680, -83.600), (33.700, -83.450), (33.720, -83.300), (33.740, -83.100)],
    "MW": [(33.7525, -84.3910), (33.735, -84.405), (33.712, -84.420), (33.695, -84.432), (33.679, -84.439), (33.660, -84.425),
           (33.645, -84.412), (33.632, -84.405), (33.622, -84.375), (33.600, -84.352), (33.583, -84.339), (33.555, -84.345),
           (33.521, -84.354), (33.490, -84.340), (33.465, -84.328), (33.437, -84.315), (33.410, -84.298), (33.387, -84.283),
           (33.330, -84.272), (33.247, -84.264), (33.150, -84.230), (33.050, -84.180)],
    "AWP": [(33.679, -84.439), (33.660, -84.455), (33.640, -84.475), (33.617, -84.497), (33.600, -84.520), (33.587, -84.542),
            (33.567, -84.581), (33.545, -84.625), (33.518, -84.669), (33.470, -84.720), (33.420, -84.770), (33.381, -84.800),
            (33.300, -84.870), (33.200, -84.960)],
    "ETG": [(34.770, -84.970), (34.810, -84.960), (34.855, -84.945), (34.910, -84.930), (34.990, -84.915), (35.080, -84.895), (35.159, -84.877),
            (35.250, -84.860)],
    "ROME": [(34.236, -84.944), (34.240, -84.990), (34.250, -85.050), (34.252, -85.110), (34.257, -85.165)],
    "NC": [(35.0456, -85.3097), (35.030, -85.360), (35.010, -85.430), (34.985, -85.550), (34.948, -85.714), (34.900, -85.790),
           (34.868, -85.839), (34.800, -85.950), (34.700, -86.100), (34.650, -86.300), (34.640, -86.586), (34.650, -86.900)],
}
RAIL_NAME = {"WA": "WESTERN & ATLANTIC RR", "GARR": "GEORGIA RR", "MW": "MACON & WESTERN RR", "AWP": "ATLANTA & WEST POINT RR"}
# big towns of 1860 only (Atlanta 9,554; Chattanooga 2,545; Rome 4,010; Marietta ~2,700; Griffin ~3,400; Newnan, Covington, Cleveland,
# Gainesville = county seats; Dalton is a story place, added in scenes as a white box)
TOWNS = {
    "corridor": [("CHATTANOOGA", 35.046, -85.310, "l"), ("CLEVELAND", 35.159, -84.877, "r"), ("ROME", 34.257, -85.165, "l"),
                 ("MARIETTA", 33.953, -84.550, "r"), ("ATLANTA", 33.749, -84.388, "r"), ("GAINESVILLE", 34.297, -83.824, "r"),
                 ("HUNTSVILLE", 34.730, -86.586, "r")],
    "kennesaw": [("MARIETTA", 33.953, -84.550, "r")],
    "atlanta": [("ATLANTA", 33.749, -84.388, "r"), ("MARIETTA", 33.953, -84.550, "r"), ("GRIFFIN", 33.247, -84.264, "r"),
                ("NEWNAN", 33.381, -84.800, "l"), ("COVINGTON", 33.597, -83.860, "r"), ("DECATUR", 33.774, -84.296, "a")],
}
# named rivers routed along the traced streams (Natural Earth vertices as guides)
NAMED = {"corridor": ["Chattahoochee", "Etowah", "Oostanaula", "Coosawattee", "Conasauga", "Tennessee"],
         "kennesaw": ["Chattahoochee", "Etowah"], "atlanta": ["Chattahoochee", "Flint"]}
WATER = {"corridor": [("TENNESSEE R.", 35.02, -85.62, 18), ("ETOWAH R.", 34.215, -85.03, 4), ("OOSTANAULA R.", 34.40, -85.06, 58),
                      ("CHATTAHOOCHEE R.", 33.66, -84.72, 36), ("COOSA R.", 34.20, -85.50, 10)],
         "kennesaw": [("CHATTAHOOCHEE R.", 33.80, -84.56, 33), ("ETOWAH R.", 34.165, -84.86, 6)],
         "atlanta": [("CHATTAHOOCHEE RIVER", 33.69, -84.66, 40), ("FLINT R.", 33.40, -84.42, 70)]}
# Rocky Face Ridge crest (traced from the corridor HD elevation, max along E-W profiles 34.70-34.86N) + Mill Creek Gap
RIDGE = {"ROCKY_FACE": [(34.700, -85.026), (34.720, -85.020), (34.740, -85.016), (34.760, -85.0175), (34.780, -85.015), (34.794, -85.010),
                        (34.800, -85.009), (34.820, -85.009), (34.840, -85.008), (34.860, -85.003), (34.880, -84.996)],
         "SNAKE_GAP": [(34.716, -85.137), (34.700, -85.105), (34.685, -85.085), (34.668, -85.068), (34.652, -85.050), (34.635, -85.025),
                       (34.616, -85.000), (34.598, -84.975), (34.584, -84.955)],
         "KENNESAW": [(33.940, -84.614), (33.9446, -84.6125), (33.955, -84.607), (33.968, -84.600), (33.975, -84.590), (33.9826, -84.5778),
                      (33.992, -84.567), (34.003, -84.558)]}

# ---------------------------------------------------------------- control per date (FACT_NOTES_corridor.md) ------------------------
# Georgia ground held by the Union = west/north of each line (lat, lon), closed along the north; Tennessee + north Alabama above the
# Tennessee River = Union on every date; the rest of Alabama and Georgia = Confederate. Same convention as tools/make_south_control.py.
N_ALA = [(35.10, -88.30), (34.86, -88.10), (34.80, -87.68), (34.72, -87.30), (34.61, -86.98), (34.50, -86.60), (34.36, -86.29),
         (34.55, -86.15), (34.65, -86.03), (34.80, -85.85), (34.95, -85.71), (35.10, -85.60)]
EAST = [(34.45, -84.42), (34.90, -84.60), (35.20, -84.60)]
GA = {
    "may64": [(35.20, -86.0), (34.99, -85.62), (34.88, -85.45), (34.80, -85.30), (34.725, -85.13), (34.712, -85.045), (34.722, -85.030), (34.740, -85.024), (34.760, -85.024),
              (34.784, -85.020), (34.797, -85.016), (34.820, -85.014), (34.842, -85.012), (34.860, -84.985), (34.875, -84.95), (34.93, -84.80),
              (35.00, -84.65), (35.20, -84.60)],
    "may13": [(35.20, -86.0), (34.99, -85.62), (34.75, -85.40), (34.62, -85.12), (34.570, -84.985), (34.572, -84.962), (34.585, -84.958),
              (34.600, -84.955), (34.615, -84.945), (34.628, -84.928), (34.638, -84.910), (34.650, -84.890), (34.75, -84.80), (34.93, -84.72),
              (35.20, -84.60)],
    "may19": [(35.20, -86.0), (34.99, -85.62), (34.45, -85.40), (34.29, -85.30), (34.24, -85.05), (34.225, -84.875), (34.240, -84.848),
              (34.255, -84.838), (34.275, -84.825), (34.40, -84.70), (34.70, -84.63), (35.20, -84.60)],
    "may25": [(35.20, -86.0), (34.30, -86.0), (34.10, -85.30), (33.92, -84.90), (33.905, -84.845), (33.920, -84.835), (33.935, -84.815),
              (33.948, -84.800), (33.960, -84.785), (33.972, -84.765), (33.990, -84.745), (34.040, -84.735), (34.150, -84.760),
              (34.250, -84.700), (34.45, -84.55), (34.90, -84.60), (35.20, -84.60)],
    "jun15": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.88, -84.85), (33.915, -84.735), (33.935, -84.715), (33.965, -84.695),
              (34.000, -84.668), (34.015, -84.630), (34.030, -84.592), (34.042, -84.560), (34.06, -84.52), (34.25, -84.45)] + EAST,
    "jun27": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.86, -84.85), (33.895, -84.660), (33.910, -84.628), (33.925, -84.620),
              (33.9446, -84.6155), (33.958, -84.610), (33.968, -84.603), (33.975, -84.593), (33.983, -84.581), (33.993, -84.568),
              (34.005, -84.556), (34.025, -84.530), (34.25, -84.45)] + EAST,
    "jul03": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.82, -84.80), (33.840, -84.600), (33.865, -84.555), (33.878, -84.530),
              (33.890, -84.505), (33.905, -84.480), (33.940, -84.450), (34.000, -84.400), (34.25, -84.40)] + EAST,
    "jul10": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.80, -84.80), (33.745, -84.610), (33.775, -84.560), (33.800, -84.525),
              (33.818, -84.485), (33.835, -84.457), (33.860, -84.447), (33.885, -84.425), (33.920, -84.400), (33.975, -84.365),
              (34.020, -84.330), (34.10, -84.30)] + EAST,
    "jul22": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.80, -84.80), (33.745, -84.610), (33.790, -84.520), (33.800, -84.470),
              (33.806, -84.430), (33.812, -84.395), (33.805, -84.365), (33.785, -84.345), (33.760, -84.337), (33.740, -84.335),
              (33.722, -84.322), (33.735, -84.270), (33.780, -84.220), (33.800, -84.160), (34.05, -84.20)] + EAST[:1] + EAST[1:],
    "aug64": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.82, -84.80), (33.720, -84.560), (33.708, -84.490), (33.722, -84.462),
              (33.742, -84.447), (33.765, -84.432), (33.785, -84.420), (33.800, -84.400), (33.806, -84.380), (33.802, -84.360),
              (33.788, -84.345), (33.770, -84.338), (33.760, -84.300), (33.780, -84.230), (33.800, -84.160), (34.05, -84.20)] + EAST,
    "sep64": [(35.20, -86.0), (34.30, -86.0), (34.00, -85.30), (33.82, -84.80), (33.62, -84.62), (33.50, -84.48), (33.440, -84.370),
              (33.428, -84.335), (33.430, -84.305), (33.445, -84.285), (33.50, -84.25), (33.62, -84.22), (33.72, -84.20), (33.80, -84.16),
              (34.05, -84.20)] + EAST,
}
# the contact line per date (where the armies touch; Union on the LEFT of the travel direction -> K.front sideA "carth")
FRONT = {
    "may64": [(34.700, -85.028), (34.720, -85.021), (34.740, -85.017), (34.760, -85.018), (34.780, -85.016), (34.797, -85.011),
              (34.820, -85.010), (34.840, -85.008), (34.855, -84.990), (34.862, -84.960)],
    "may13": [(34.680, -85.110), (34.620, -85.060), (34.585, -85.000), (34.572, -84.968), (34.585, -84.958), (34.600, -84.955), (34.615, -84.945),
              (34.628, -84.928), (34.638, -84.910), (34.650, -84.890), (34.700, -84.840)],
    "may19": [(34.300, -85.120), (34.250, -85.020), (34.228, -84.890), (34.232, -84.855), (34.245, -84.843), (34.258, -84.836), (34.275, -84.825),
              (34.340, -84.740)],
    "may25": [(33.870, -84.960), (33.900, -84.870), (33.905, -84.842), (33.920, -84.834), (33.935, -84.815), (33.948, -84.800), (33.960, -84.785),
              (33.972, -84.765), (33.990, -84.745), (34.040, -84.735)],
    "jun15": [(33.930, -84.722), (33.962, -84.698), (34.000, -84.668), (34.015, -84.630), (34.030, -84.592), (34.042, -84.560)],
    "jun27": [(33.905, -84.627), (33.925, -84.621), (33.9446, -84.6150), (33.958, -84.609), (33.968, -84.602), (33.975, -84.592),
              (33.983, -84.580), (33.993, -84.567), (34.005, -84.556)],
    "jul03": [(33.840, -84.600), (33.865, -84.555), (33.878, -84.530), (33.890, -84.505), (33.905, -84.480)],
    "jul10": [(33.775, -84.560), (33.800, -84.525), (33.818, -84.485), (33.835, -84.457), (33.860, -84.447), (33.885, -84.425), (33.920, -84.400)],
    "jul22": [(33.800, -84.470), (33.806, -84.430), (33.812, -84.395), (33.805, -84.365), (33.785, -84.345), (33.760, -84.337), (33.740, -84.335),
              (33.722, -84.322)],
    "aug64": [(33.708, -84.490), (33.722, -84.462), (33.742, -84.447), (33.765, -84.432), (33.785, -84.420), (33.800, -84.400), (33.806, -84.380),
              (33.802, -84.360), (33.788, -84.345), (33.770, -84.338)],
    "sep64": [(33.440, -84.370), (33.428, -84.335), (33.430, -84.305), (33.445, -84.285)],
    # close-up battles (option 2)
    "jon31": [(33.490, -84.374), (33.502, -84.372), (33.515, -84.370), (33.528, -84.368), (33.538, -84.364), (33.544, -84.356)],
    "jon01": [(33.490, -84.370), (33.502, -84.366), (33.515, -84.364), (33.526, -84.361), (33.532, -84.356), (33.533, -84.348)],
}
DATES = {"corridor": ["may64", "may13", "may19", "may25", "jun15", "jun27", "jul10", "aug64", "sep64"],
         "kennesaw": ["jun15", "jun27", "jul03"],
         "atlanta": ["jul03", "jul10", "jul22", "aug64", "sep64"]}


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.name = name; self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]
        self.W, self.H = J["size"]; self.mpp = J["meters_per_px"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L").resize((self.W, self.H))) > 127
    def P(self, lat, lon, s=1):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return (((lon + 180) / 360 * n - self.ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy) * s)
    def inv(self, x, y, s=1):
        n = 256 * 2 ** self.z; lon = (x / s + self.ox) / n * 360 - 180; yy = (y / s + self.oy) / n
        return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * yy)))), lon
    def poly(self, polys, lonlat=False):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(q[1], q[0]) if lonlat else self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0


def states():
    out = {}
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        g = f["geometry"]; rings = g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]
        out[f["properties"]["name"]] = rings
    return out


def resample(pts, n=24):
    d = [0.0]
    for a, b in zip(pts, pts[1:]): d.append(d[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    out = []
    for k in range(n):
        t = d[-1] * k / (n - 1); j = max(i for i in range(len(d)) if d[i] <= t + 1e-9); j = min(j, len(pts) - 2)
        f = (t - d[j]) / ((d[j + 1] - d[j]) or 1); out.append([round(pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, 1), round(pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f, 1)])
    return out


# ---------------------------------------------------------------- control overlays -------------------------------------------------
def save(M, path, us, cs):
    land = M.land; us &= land; cs &= land & ~us
    d_cs = ndimage.distance_transform_edt(~us) if us.any() else np.full(cs.shape, 1e9)
    k = 1260.0 / M.mpp        # rim scale in px: ~1.3 km at z10 ... wider in px on the close maps
    k = max(6.0, min(k, 26.0))
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[cs, :3] = CS; out[cs, 3] = (0.36 + 0.24 * np.exp(-d_cs / (k * 6)))[cs]
    out[us, :3] = US; out[us, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((cs & ndimage.binary_dilation(us, iterations=3)).astype(np.float32), k * 0.6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "US px", int(us.sum()), "CS px", int(cs.sum()))


def control(M):
    ST = states()
    ga = M.poly([r for r in ST["Georgia"]], lonlat=True)
    tn = M.poly([r for r in ST["Tennessee"]], lonlat=True) | M.poly([r for r in ST.get("North Carolina", [])], lonlat=True)
    al = M.poly([r for r in ST["Alabama"]], lonlat=True)
    nala = M.poly([N_ALA + [(35.5, -85.6), (35.5, -88.3)]]) & al
    # anything outside GA/TN/AL inside the frame (none expected) follows Georgia
    other = M.land & ~(ga | tn | al)
    fr = {}
    for date in DATES[M.name]:
        line = GA[date]
        poly = line + [(35.6, line[-1][1]), (35.6, -87.5), (line[0][0], -87.5)]
        gu = M.poly([poly])
        us = (tn | nala | ((ga | other) & gu)).copy()
        save(M, f"assets/media/{M.name}_ctl_{date}_mx.png", us, ~us)
    for date, pts in FRONT.items():
        fr[date] = resample([M.P(*q) for q in pts], 24)
    json.dump(fr, open(f"assets/media/{M.name}_fronts.json", "w"))
    print("fronts ->", f"assets/media/{M.name}_fronts.json")


# ---------------------------------------------------------------- geography layer --------------------------------------------------
def route_named(M, dem, S):
    """route each named Natural Earth river along the traced streams: shortest path on a cost raster (streams cheap)."""
    from skimage.graph import route_through_array
    H, W = M.H * S, M.W * S
    riv = Image.new("L", (W, H), 0); d = ImageDraw.Draw(riv)
    for r in dem:
        if r["order"] >= 2: d.line([tuple(p) for p in r["pts"]], fill=255, width=3)
    riv = np.array(riv) > 0
    cost = np.where(riv, 1.0, 40.0).astype(np.float32)
    NE = json.load(open("assets/src/south_ne_rivers.json"))
    out = {}
    for nm in NAMED[M.name]:
        segs = [r["pts"] for r in NE if (r["name"] or "") == nm]
        paths = []
        for pts in segs:
            px = [M.P(la, lo, S) for lo, la in pts]
            inside = [(x, y) for x, y in px if -200 < x < W + 200 and -200 < y < H + 200]
            if len(inside) < 2: continue
            # densify the guide (NE vertices can be far apart) and clamp into the frame
            g = []
            for a, b in zip(inside, inside[1:]):
                n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / 120))
                g += [(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n) for k in range(n)]
            g.append(inside[-1])
            g = [(min(W - 2, max(1, x)), min(H - 2, max(1, y))) for x, y in g]
            full = []
            for a, b in zip(g, g[1:]):
                x0, x1 = int(min(a[0], b[0])) - 150, int(max(a[0], b[0])) + 150
                y0, y1 = int(min(a[1], b[1])) - 150, int(max(a[1], b[1])) + 150
                x0, y0, x1, y1 = max(0, x0), max(0, y0), min(W - 1, x1), min(H - 1, y1)
                sub = cost[y0:y1 + 1, x0:x1 + 1]
                # snap the guide points onto the nearest stream pixel nearby
                def snap(p):
                    px_, py_ = int(p[0]) - x0, int(p[1]) - y0
                    yy, xx = np.nonzero(riv[y0:y1 + 1, x0:x1 + 1])
                    if len(xx) == 0: return (py_, px_)
                    i = int(np.argmin((xx - px_) ** 2 + (yy - py_) ** 2))
                    return (yy[i], xx[i]) if (xx[i] - px_) ** 2 + (yy[i] - py_) ** 2 < 90 ** 2 else (py_, px_)
                path, _ = route_through_array(sub, snap(a), snap(b), fully_connected=True, geometric=True)
                full += [(x + x0, y + y0) for y, x in path]
            # thin the polyline
            th = [full[0]]
            for p in full[1:]:
                if math.hypot(p[0] - th[-1][0], p[1] - th[-1][1]) >= 6: th.append(p)
            paths.append(th)
        out[nm.upper()] = paths
        print("routed", nm, [len(p) for p in paths])
    return out


def geo(M):
    S = 2; W, H = M.W * S, M.H * S
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # state lines (thin, faint)
    st = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    for nm, rings in states().items():
        for ring in rings: sd.line([M.P(la, lo, S) for lo, la in ring], fill=(236, 230, 214, 80), width=3, joint="curve")
    im.alpha_composite(st)
    rd = ImageDraw.Draw(im)
    dem = json.load(open(f"assets/src/{M.name}_dem_rivers.json"))
    small = {"corridor": (2, 2, 70), "atlanta": (2, 2, 60), "kennesaw": (3, 2, 70)}[M.name]   # (min order, width, alpha) of the streams
    for r in dem:
        if r["order"] < small[0]: continue
        pts = [tuple(p) for p in r["pts"]]
        if r["order"] == 3: rd.line(pts, fill=(96, 150, 190, 150), width=3 if M.name == "corridor" else 4, joint="curve")
        else: rd.line(pts, fill=(96, 150, 190, small[2]), width=small[1], joint="curve")
    named = route_named(M, dem, S)
    shimmer, lines = [], {"river": {}, "rail": {}, "ridge": {}}
    for nm, paths in named.items():
        lines["river"][nm] = [[[round(x / S, 1), round(y / S, 1)] for x, y in p[::2]] for p in paths]
        for p in paths:
            rd.line(p, fill=(96, 150, 190, 235), width=7 if nm in ("CHATTAHOOCHEE", "TENNESSEE") else 6, joint="curve")
            shimmer.append([[round(x / S), round(y / S)] for x, y in p[::4]])
    # railroads: thin dark line with a faint light casing + cross-ties
    rl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rld = ImageDraw.Draw(rl)
    for key, pts in RAIL.items():
        px = [M.P(la, lo, S) for la, lo in pts]
        lines["rail"][key] = [[round(x / S, 1), round(y / S, 1)] for x, y in px]
        rld.line(px, fill=(225, 215, 190, 70), width=9, joint="curve")
        rld.line(px, fill=(24, 20, 16, 235), width=4, joint="curve")
        acc, step = 0.0, 16.0
        for a, b in zip(px, px[1:]):
            L = math.hypot(b[0] - a[0], b[1] - a[1])
            if L == 0: continue
            ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
            s = step - acc
            while s < L:
                cx, cy = a[0] + ux * s, a[1] + uy * s
                rld.line([(cx - uy * 6, cy + ux * 6), (cx + uy * 6, cy - ux * 6)], fill=(24, 20, 16, 235), width=3)
                s += step
            acc = (acc + L) % step
    im.alpha_composite(rl)
    for nm, pts in RIDGE.items(): lines["ridge"][nm] = [[round(c, 1) for c in M.P(*q)] for q in pts]
    # towns + water names
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo)
    fsz = {"corridor": 30, "atlanta": 30, "kennesaw": 30}[M.name]
    f = ImageFont.truetype(FONT, fsz)
    for nm, la, lo, side in TOWNS[M.name]:
        x, y = M.P(la, lo, S); r = 6
        td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    fw = ImageFont.truetype(FONT, 24)
    for nm, la, lo, rot in WATER[M.name]:
        x, y = M.P(la, lo, S); t = Image.new("RGBA", (900, 120), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((450, 60), " ".join(nm), font=fw, fill=(150, 195, 225, 205), anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    im.save(f"assets/media/{M.name}_geo_ref.png", optimize=True)
    json.dump(shimmer, open(f"assets/media/{M.name}_rivers.json", "w"))
    json.dump(lines, open(f"assets/media/{M.name}_lines.json", "w"))
    print("wrote", f"assets/media/{M.name}_geo_ref.png", "+ rivers/lines json")


if __name__ == "__main__":
    args = sys.argv[1:]
    do_geo, do_ctl = ("geo" in args or not ({"geo", "ctl"} & set(args))), ("ctl" in args or not ({"geo", "ctl"} & set(args)))
    bases = [a for a in args if a not in ("geo", "ctl")] or ["corridor", "kennesaw", "atlanta"]
    for b in bases:
        M = Map(b)
        if do_ctl: control(M)
        if do_geo: geo(M)
