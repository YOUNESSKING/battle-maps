"""Map data for the Cleburne #14 scenes move2c (Ringgold Gap), move3a (Dalton -> New Hope, corridor) and move3b (Pickett's Mill).
usage (from cleburne/): python3 tools/m23_prep.py
-> assets/src/m23_data.json        creek polylines (map px) for ringgold / pickett (DEM-traced, order >= 2, cropped + simplified),
                                   the corridor lines (W&A railroad, rivers, Rocky Face) and the corridor fronts per date
   assets/media/m3a_corridor_ctl_jan64_mx.png, m3a_corridor_ctl_may26_mx.png   option-1 control overlays (multiply), SIDES SWAPPED
                                   for this video: Confederate ground = hero blue (110,160,255), Union ground = A4 light red (240,105,95)
   assets/media/m3a_corridor_geo_nolabels.png   the corridor geography layer without baked town labels (A2: labels are live pins)
Geometry of the control lines adapted from sherman/tools/make_m1_maps.py (same corridor basemap: z10, origin 67846,103644).
Winter 1863-64 line: Union at Ringgold / Cleveland / Chattanooga + north Alabama; Confederates at Dalton with outposts at Tunnel Hill.
25-26 May 1864: the Dallas - New Hope Church - Pickett's Mill line (Sherman FACT_NOTES_corridor, 'may25')."""
import json, math, shutil
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

S = "/home/user/battle-maps/sherman/"
BLUE, RED, RIM = (110, 160, 255), (240, 105, 95), (255, 140, 120)


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}_hd_lift.json")); self.name = name; self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]
        self.W, self.H = J["size"]; self.mpp = J["meters_per_px"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L").resize((self.W, self.H))) > 127

    def P(self, lat, lon):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)

    def poly(self, polys, lonlat=False):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(q[1], q[0]) if lonlat else self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0


def simplify(pts, tol=1.2):
    if len(pts) < 3: return pts
    a, b = np.array(pts[0]), np.array(pts[-1]); ab = b - a; L = np.hypot(*ab) or 1
    d = [abs(ab[0] * (p[1] - a[1]) - ab[1] * (p[0] - a[0])) / L for p in pts[1:-1]]; i = int(np.argmax(d)) + 1
    if d[i - 1] > tol: return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]


def creeks(base, box, minorder=2):
    x0, y0, x1, y1 = box; out = []
    for r in json.load(open(f"assets/src/{base}_dem_rivers.json")):
        if r["order"] < minorder: continue
        pts = [[round(x / 2, 1), round(y / 2, 1)] for x, y in r["pts"]]
        if not any(x0 <= x <= x1 and y0 <= y <= y1 for x, y in pts): continue
        out.append({"o": r["order"], "pts": simplify(pts, 0.8)})
    return out


def resample(pts, n=24):
    d = [0.0]
    for a, b in zip(pts, pts[1:]): d.append(d[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    out = []
    for k in range(n):
        t = d[-1] * k / (n - 1); j = min(max(i for i in range(len(d)) if d[i] <= t + 1e-9), len(pts) - 2)
        f = (t - d[j]) / ((d[j + 1] - d[j]) or 1); out.append([round(pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, 1), round(pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f, 1)])
    return out


def save(M, path, blue, red):
    land = M.land; red &= land; blue &= land & ~red
    d = ndimage.distance_transform_edt(~blue) if blue.any() else np.full(red.shape, 1e9)
    k = max(6.0, min(1260.0 / M.mpp, 26.0))
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[red, :3] = RED; out[red, 3] = (0.30 + 0.20 * np.exp(-d / (k * 6)))[red]
    out[blue, :3] = BLUE; out[blue, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((red & ndimage.binary_dilation(blue, iterations=3)).astype(np.float32), k * 0.6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path)


N_ALA = [(35.10, -88.30), (34.86, -88.10), (34.80, -87.68), (34.72, -87.30), (34.61, -86.98), (34.50, -86.60), (34.36, -86.29),
         (34.55, -86.15), (34.65, -86.03), (34.80, -85.85), (34.95, -85.71), (35.10, -85.60)]
GA = {  # Union-held Georgia lies north/west of this line
    "jan64": [(35.20, -86.0), (34.99, -85.62), (34.90, -85.45), (34.885, -85.30), (34.895, -85.14), (34.880, -85.075), (34.890, -85.010),
              (34.930, -84.90), (35.00, -84.70), (35.20, -84.60)],
    "may26": [(35.20, -86.0), (34.30, -86.0), (34.10, -85.30), (33.92, -84.90), (33.905, -84.845), (33.920, -84.835), (33.935, -84.815),
              (33.948, -84.800), (33.960, -84.785), (33.972, -84.765), (33.990, -84.745), (34.040, -84.735), (34.150, -84.760),
              (34.250, -84.700), (34.45, -84.55), (34.90, -84.60), (35.20, -84.60)],
}
FRONT = {  # contact line, Confederates (blue, hero) on the LEFT of the travel direction -> K.front sideA "carth"
    "jan64": [(34.880, -85.250), (34.888, -85.150), (34.884, -85.090), (34.882, -85.040), (34.892, -84.990), (34.915, -84.930)],
    "may26": [(33.870, -84.960), (33.900, -84.870), (33.905, -84.842), (33.920, -84.834), (33.935, -84.815), (33.948, -84.800),
              (33.960, -84.785), (33.972, -84.765), (33.990, -84.745), (34.040, -84.735)],
}


def corridor():
    M = Map("corridor")
    ST = {}
    for f in json.load(open(S + "assets/src/south_ne_states.geojson"))["features"]:
        g = f["geometry"]; ST[f["properties"]["name"]] = g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]
    ga = M.poly(ST["Georgia"], lonlat=True)
    tn = M.poly(ST["Tennessee"], lonlat=True) | M.poly(ST.get("North Carolina", []), lonlat=True)
    al = M.poly(ST["Alabama"], lonlat=True)
    nala = M.poly([N_ALA + [(35.5, -85.6), (35.5, -88.3)]]) & al
    other = M.land & ~(ga | tn | al)
    for date, line in GA.items():
        gu = M.poly([line + [(35.6, line[-1][1]), (35.6, -87.5), (line[0][0], -87.5)]])
        us = tn | nala | ((ga | other) & gu)
        save(M, f"assets/media/m3a_corridor_ctl_{date}_mx.png", ~us, us.copy())
    lines = json.load(open(S + "assets/media/corridor_lines.json"))
    fr = {d: resample([list(M.P(*q)) for q in pts], 24) for d, pts in FRONT.items()}
    shutil.copy(S + "assets/media/test_A2_corridor_geo_nolabels.png", "assets/media/m3a_corridor_geo_nolabels.png")
    return {"lines": lines, "fronts": fr, "rivers": json.load(open(S + "assets/media/corridor_rivers.json"))}


if __name__ == "__main__":
    data = {"ringgold": creeks("ringgold", (1180, 700, 1800, 1150)), "pickett": creeks("pickett", (1380, 620, 1820, 1120)), "corridor": corridor()}
    json.dump(data, open("assets/src/m23_data.json", "w"), separators=(",", ":"))
    print({k: (len(v) if isinstance(v, list) else list(v)) for k, v in data.items()})
