"""JUDGE 2 refinement of the balanced detail look (variants F, G). usage: python3 tools/judge2_refine.py MAP CX CY [fetch|render]
Works on a 1920x1080 window (HD px 5760x3240 grid) + 60 px margin so fetching is fast. Cache: build/judge2_cache/MAP.pkl (WorldCover class, NLCD wetland, NHD json).
Writes assets/media/MAP_judge2_{F,G}_{riv,tree,swamp}.png (window size, margin included) and build/detail-hq/MAP_{F,G}.jpg."""
import json, math, os, sys, io, pickle, urllib.parse, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
base, CX, CY = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); mode = sys.argv[4] if len(sys.argv) > 4 else "all"
S = 2; M = 60
J = json.load(open(f"assets/{base}.json")); z = J["zoom"]; ox0, oy0 = J["origin_world_px"]
X0, Y0 = CX - 960 - M, CY - 540 - M; W, H = 1920 + 2 * M, 1080 + 2 * M
ox = ox0 + X0 / S; oy = oy0 + Y0 / S; n = 256 * 2 ** z
def px2ll(i, j):
    x = ox + i / S; y = oy + j / S
    return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n)))), x / n * 360 - 180
def ll2px(lat, lon): return ((((lon + 180) / 360 * n) - ox) * S, (((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n) - oy) * S)
n_lat, w_lon = px2ll(0, 0); s_lat, e_lon = px2ll(W, H)
CACHE = f"build/judge2_cache/{base}.pkl"; os.makedirs("build/judge2_cache", exist_ok=True)
if not os.path.exists(CACHE):
    import rasterio
    from rasterio.windows import from_bounds
    RES = 1 / 12000; pad = 0.002; bl, bb, br, bt = w_lon - pad, s_lat - pad, e_lon + pad, n_lat + pad
    NR, NC = int(round((bt - bb) / RES)), int(round((br - bl) / RES)); WC = np.zeros((NR, NC), np.uint8)
    for tl in range(math.floor(bb / 3) * 3, math.ceil(bt / 3) * 3, 3):
        for tn in range(math.floor(bl / 3) * 3, math.ceil(br / 3) * 3, 3):
            name = f"ESA_WorldCover_10m_2021_v200_{'N' if tl >= 0 else 'S'}{abs(tl):02d}{'E' if tn >= 0 else 'W'}{abs(tn):03d}_Map.tif"
            with rasterio.open("/vsicurl/https://esa-worldcover.s3.eu-central-1.amazonaws.com/v200/2021/map/" + name) as ds:
                b = (max(bl, tn), max(bb, tl), min(br, tn + 3), min(bt, tl + 3)); a = ds.read(1, window=from_bounds(*b, ds.transform))
                r0 = int(round((bt - b[3]) / RES)); c0 = int(round((b[0] - bl) / RES)); WC[r0:r0 + a.shape[0], c0:c0 + a.shape[1]] = a[:NR - r0, :NC - c0]
    cols = np.clip(((np.array([px2ll(i, 0)[1] for i in range(W)]) - bl) / RES).astype(int), 0, NC - 1)
    rows = np.clip(((bt - np.array([px2ll(0, j)[0] for j in range(H)])) / RES).astype(int), 0, NR - 1); CL = WC[np.ix_(rows, cols)]
    def nhd(layer):
        out, off = [], 0
        while True:
            q = {"geometry": f"{w_lon},{s_lat},{e_lon},{n_lat}", "geometryType": "esriGeometryEnvelope", "inSR": 4326, "outSR": 4326, "spatialRel": "esriSpatialRelIntersects",
                 "outFields": "FCode,FType,GNIS_Name", "returnGeometry": "true", "f": "geojson", "resultOffset": off, "resultRecordCount": 1000}
            u = f"https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/{layer}/query?" + urllib.parse.urlencode(q); d = None
            for k in range(4):
                try: d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "battle-maps-detail-test"}), timeout=90)); break
                except Exception as e: print("retry", e, flush=True)
            if not d: break
            fs = d.get("features", []); out += fs; off += len(fs)
            if len(fs) < 1000 and not d.get("exceededTransferLimit"): break
        return out
    flow, body, area = nhd(6), nhd(12), nhd(9)
    NL = {11: (70, 107, 159), 21: (222, 197, 197), 22: (217, 146, 130), 23: (235, 0, 0), 24: (171, 0, 0), 31: (179, 172, 159), 41: (104, 171, 95), 42: (28, 95, 44), 43: (181, 197, 143),
          52: (204, 184, 121), 71: (223, 223, 194), 81: (220, 217, 57), 82: (171, 108, 40), 90: (184, 217, 235), 95: (112, 163, 186)}
    LC = np.array(list(NL.values()), np.int32); LK = np.array(list(NL.keys())); EXT = 20037508.342789244
    x0 = ((ox) / n - 0.5) * 2 * EXT; y1 = (0.5 - oy / n) * 2 * EXT; x1 = ((ox + W / S) / n - 0.5) * 2 * EXT; y0 = (0.5 - (oy + H / S) / n) * 2 * EXT
    u = ("https://www.mrlc.gov/geoserver/mrlc_display/wms?service=WMS&version=1.1.1&request=GetMap&layers=NLCD_2021_Land_Cover_L48&styles=&srs=EPSG:3857"
         f"&bbox={x0},{y0},{x1},{y1}&width={W}&height={H}&format=image/png&transparent=false")
    im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "battle-maps-detail-test"}), timeout=120).read())).convert("RGB")
    a = np.array(im).astype(np.int32).reshape(-1, 3); idx = np.argmin(((a[:, None, :] - LC[None, :, :]) ** 2).sum(2), axis=1); cls = LK[idx].reshape(H, W)
    pickle.dump({"CL": CL, "NLW": (cls == 90) | (cls == 95), "flow": flow, "body": body, "area": area}, open(CACHE, "wb"))
    print("fetched", base, flush=True)
if mode == "fetch": sys.exit()
D = pickle.load(open(CACHE, "rb")); CL, NLW, flow, body, area = D["CL"], D["NLW"], D["flow"], D["body"], D["area"]
for _l in (flow, body, area):
    for _f in _l: _f["properties"] = {k.lower(): v for k, v in _f["properties"].items()}
def polys(f):
    g = f["geometry"]
    if not g: return []
    return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]] if g["type"] == "Polygon" else []
def lines(f):
    g = f["geometry"]
    if not g: return []
    return g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]] if g["type"] == "LineString" else []
def shoelace(p): x, y = zip(*p); return abs(sum(x[i] * y[i - 1] - x[i - 1] * y[i] for i in range(len(p)))) / 2
def comp_filter(m, minpx):
    lab, nl = ndimage.label(m)
    if nl == 0: return m
    sz = ndimage.sum(m, lab, range(1, nl + 1)); return np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= minpx])
def noise(sig, seed):
    r = np.random.default_rng(seed).normal(size=(H, W)).astype(np.float32); r = ndimage.gaussian_filter(r, sig); return (r - r.mean()) / (r.std() + 1e-6)

# parameters per variant. F = refined balanced; G = even quieter (water + forest edge only, hatch swamp for big wetlands only)
HP = 20
P = {"F": dict(lake_min=14000, creek_min=700, wline=3, wriv=5, tree_a=58, tree_edge=95, tree_min=30000, sw_min=45000, sw_fill=26, sw_hatch=70, sw_edge=110),
     "G": dict(lake_min=30000, creek_min=1400, wline=3, wriv=5, tree_a=40, tree_edge=80, tree_min=60000, sw_min=90000, sw_fill=22, sw_hatch=48, sw_edge=90)}
WATER = (94, 134, 160); EDGE = (58, 86, 106)
def layers(v):
    p = P[v]; SS = 2
    riv = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(riv); sc = lambda pts: [(x * SS, y * SS) for x, y in pts]
    tot = {}
    for f in flow:
        pr = f["properties"]; nm = pr.get("gnis_name")
        if not nm or (pr.get("fcode") or 46006) in (46003, 46007): continue
        for ln in lines(f):
            pts = [ll2px(la, lo) for lo, la in ln]
            tot[nm] = tot.get(nm, 0) + sum(math.dist(pts[i], pts[i - 1]) for i in range(1, len(pts)))
    keep = {k for k, v in tot.items() if v >= p["creek_min"]}; print(base, v, "creeks kept", {k: int(tot[k]) for k in keep}, flush=True)
    for f in flow:
        pr = f["properties"]; nm = pr.get("gnis_name")
        if nm not in keep or (pr.get("fcode") or 46006) in (46003, 46007): continue
        w = p["wriv"] if tot[nm] > 4000 else p["wline"]
        for ln in lines(f):
            pts = sc([ll2px(la, lo) for lo, la in ln])
            if len(pts) > 1: d.line(pts, fill=EDGE + (120,), width=(w + 1) * SS, joint="curve"); d.line(pts, fill=WATER + (225,), width=w * SS, joint="curve")
    for f in area + body:
        if (f["properties"].get("ftype") or 0) == 466: continue
        isarea = f in area
        for pg in polys(f):
            pts = [ll2px(la, lo) for lo, la in pg[0]]
            if len(pts) < 3 or (not isarea and shoelace(pts) < p["lake_min"]): continue
            d.polygon(sc(pts), fill=WATER + (225,)); d.line(sc(pts + [pts[0]]), fill=EDGE + (170,), width=2 * SS // 1, joint="curve")
    riv = riv.resize((W, H), Image.LANCZOS)
    # forest: soft tint, crisp edge, smooth shapes
    tree = ndimage.gaussian_filter((CL == 10).astype(np.float32), 5) > 0.5
    tree = comp_filter(tree, p["tree_min"]); tree = ~comp_filter(~tree, p["tree_min"] // 2)
    sw = (CL == 90) | (CL == 95) | NLW; sw = ndimage.gaussian_filter(sw.astype(np.float32), 6) > 0.5; sw = comp_filter(sw, p['sw_min'])
    tree = tree & ~ndimage.binary_dilation(sw, iterations=3)
    soft = ndimage.gaussian_filter(tree.astype(np.float32), 3.5)
    edge = ndimage.gaussian_filter((tree & ~ndimage.binary_erosion(tree, iterations=2)).astype(np.float32), 0.8)
    m = 0.6 * noise(6, 1) + 0.4 * noise(14, 2); mot = np.clip(1 + 0.10 * m, 0.85, 1.15)
    tl = np.zeros((H, W, 4), np.float32); tl[..., 0], tl[..., 1], tl[..., 2] = 26, 56, 32
    tl[..., 3] = soft * p["tree_a"] * mot
    # edge: composite darker line
    ea = np.clip(edge, 0, 1) * p["tree_edge"]; a0 = tl[..., 3]; a1 = a0 + ea * (1 - a0 / 255)
    col = np.where(a1[..., None] > 0, (tl[..., :3] * a0[..., None] + np.array([18, 42, 24]) * ea[..., None] * (1 - a0[..., None] / 255)) / np.maximum(a1[..., None], 1e-3), 0)
    treeL = Image.fromarray(np.dstack([col, a1]).clip(0, 255).astype(np.uint8))
    # swamp: smoothed shapes, restrained diagonal hatch, only large
    yy, xx = np.mgrid[0:H, 0:W]; hatch = (((xx + yy) % HP) < 2) & ndimage.binary_erosion(sw, iterations=4)
    se = ndimage.gaussian_filter((sw & ~ndimage.binary_erosion(sw, iterations=2)).astype(np.float32), 0.8)
    sl = np.zeros((H, W, 4), np.float32); sl[..., :3] = (70, 120, 120); sl[..., 3] = sw * p["sw_fill"]
    sl[hatch] = (52, 112, 120, p["sw_hatch"]); ee = se * p["sw_edge"]; sl[..., 3] = np.maximum(sl[..., 3], ee); sl[(ee > 20) & ~hatch, :3] = (44, 94, 100)
    swL = Image.fromarray(sl.clip(0, 255).astype(np.uint8))
    return riv, treeL, swL
for v in "FG":
    riv, treeL, swL = layers(v)
    for nm, l in (("riv", riv), ("tree", treeL), ("swamp", swL)): l.save(f"assets/media/{base}_judge2_{v}_{nm}.png")
    bim = Image.open(f"assets/{base}_hd_lift.jpg").convert("RGB").resize((5760, 3240)).crop((X0, Y0, X0 + W, Y0 + H)).convert("RGBA")
    for l in (treeL, swL, riv): bim = Image.alpha_composite(bim, l)
    bim.convert("RGB").crop((M, M, M + 1920, M + 1080)).save(f"build/detail-hq/{base}_{v}.jpg", quality=92)
print("done", base)
