#!/usr/bin/env python3
"""Vicksburg 1863 world baker: config-driven generalisation of the approved GM3D clip baker
(research/style_tests/gm3d/clip/bake_clip.py, v8). Same look, same output formats, same map units.

  python3 vicksburg/tools/bake_world.py <region|all> [--no-preview]

Reads   vicksburg/worlds/configs/<region>.json          (box, sizes, towns, roads, rivers, works ... see worlds/README.md)
        vicksburg/worlds/configs/_mississippi1863.json  (the 1863 river course, upstream first)
        vicksburg/data/geo.json (optional, research agent: towns, roads, rivers, forts; merged over the built-in base geography)
        grant/assets/src/vicksburg_hd_elev.npy (DEM, 2 px per map unit of the 'vicksburg_hd_lift' frame)
Writes  vicksburg/worlds/<region>/height.png   16-bit height packed R (high) / G (low): h_m = (R*256+G)/200 - 20
        vicksburg/worlds/<region>/ground.jpg   ground texture (no hillshade on close regions: three.js lights it)
        vicksburg/worlds/<region>/region.js    (window.GM3D_REGIONS = ...)["<region>"] = {...}
        vicksburg/worlds/geo.js                window.GM3D_GEO = {geo frame, towns, places, rivers, roads, railroads}
        vicksburg/worlds/previews/<region>.jpg labelled top-down preview
Map units: x east, y south, 1 unit = 129.36 m; three.js y = h_m * exag / 129.36."""
import json, os, sys, math, time, heapq
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gm_look import fbm, smooth, densify, hexc, catmull, water_levels, wide_fields, gm_fields, paint_town, ROOFS, WT, HS, FS

REPO = "/home/user/battle-maps"; VX = f"{REPO}/vicksburg"; WORLDS = f"{VX}/worlds"; CFGDIR = f"{WORLDS}/configs"; TMP = "/tmp/vx_bake"
FRAME = json.load(open(f"{REPO}/grant/assets/vicksburg_hd_lift.json")); MPU = FRAME["meters_per_px"]
GMT = f"{REPO}/research/style_tests/gm_test"
PREP_BOX = (1000, 300, 1140, 840)   # the edited DEM covers the wide box + margin (all regions crop from it)
DPU = 2                              # DEM px per map unit (Vicksburg: the frame-wide z11 array)
CPU = 1                              # creek-network (D8) px per map unit
CREEK_KM2 = 2.0                      # project mode: catchment of a traced creek head
# ---- project mode (VX_PROJECT=<folder> or --project <folder>; see vx_project.py): own worlds / geo.json / frame, DEM fetched per region box.
# Without it nothing below changes (Vicksburg bakes exactly as before).
from vx_project import Project, project_name, fetch_dem
PROJ = Project(project_name()) if project_name() else None
CUR_ZOOM = None                      # zoom of the region being baked (project mode); None = the base frame
if PROJ:
    VX = PROJ.dir; WORLDS = PROJ.worlds; CFGDIR = PROJ.configs; TMP = PROJ.tmp; MPU = PROJ.engine_mpu
    FRAME = {"zoom": PROJ.zoom, "origin_world_px": PROJ.origin, "meters_per_px": PROJ.engine_mpu, "size": None, "name": PROJ.frame.get("name", PROJ.name)}
os.makedirs(TMP, exist_ok=True)
LOG = lambda *a: print(time.strftime("%H:%M:%S"), *a, flush=True)


def to_map(lat, lon):
    if PROJ: return PROJ.to_map(lat, lon, CUR_ZOOM)
    z = 256 * 2 ** FRAME["zoom"]; x = (lon + 180) / 360 * z; y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * z
    return x - FRAME["origin_world_px"][0], y - FRAME["origin_world_px"][1]


def sample(field, box, pts):
    """bilinear sample of a region field at map-unit points"""
    x0, y0, bw, bh = box; H, W = field.shape
    pts = np.asarray(pts, np.float32).reshape(-1, 2)
    px = ((pts[:, 0] - x0) / bw * W - 0.5).astype(np.float32); py = ((pts[:, 1] - y0) / bh * H - 0.5).astype(np.float32)
    n = len(px)
    if n == 0: return np.zeros(0, np.float32)
    m = -(-n // 1024) * 1024; px = np.pad(px, (0, m - n)).reshape(-1, 1024); py = np.pad(py, (0, m - n)).reshape(-1, 1024)
    return cv2.remap(field.astype(np.float32), px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).reshape(-1)[:n]


def curvy(L, seg=2.0):
    """coarse waypoint polylines (geo.json: a point every few km) -> smooth Catmull-Rom curves; dense traced lines pass unchanged"""
    L = np.asarray(L, np.float32)
    if len(L) < 3: return L
    d = np.hypot(*np.diff(L, axis=0).T)
    return catmull(L, 0.25).astype(np.float32) if d.mean() > seg else L


def snap_valley(P, L, r=4.0):
    """move a coarse river polyline (geo.json, +-1 km) onto the valley floor of the edited DEM: each vertex (every 0.5 units) goes to the
    lowest point within +-r units across the line, then the path is smoothed"""
    px0, py0 = PREP_BOX[:2]; hb = cv2.GaussianBlur(P, (0, 0), 1.5 * DPU / 2)
    L = densify(np.asarray(L, np.float32), 0.5)
    if len(L) < 3: return L
    t = np.gradient(L, axis=0); t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-6; n = np.stack([-t[:, 1], t[:, 0]], 1)
    off = np.linspace(-r, r, int(r * 4) + 1)
    C = L[:, None, :] + n[:, None, :] * off[None, :, None]
    hv = sample(hb, (px0, py0, hb.shape[1] / DPU, hb.shape[0] / DPU), C.reshape(-1, 2)).reshape(len(L), -1)
    hv += np.abs(off)[None] * 0.15   # prefer the original line when the floor is flat
    k = hv.argmin(1).astype(np.float32)
    k = np.convolve(np.pad(k, 6, mode="edge"), np.ones(13) / 13, mode="valid")   # no zig-zags across the floor
    S = L + n * np.interp(k, np.arange(len(off)), off)[:, None]
    return smooth(S, 8).astype(np.float32)


def chaikin(P, n=3):
    P = np.asarray(P, np.float64)
    for _ in range(n):
        if len(P) < 3: break
        Q = np.empty((len(P) * 2 - 2, 2)); Q[0::2] = 0.75 * P[:-1] + 0.25 * P[1:]; Q[1::2] = 0.25 * P[:-1] + 0.75 * P[1:]
        P = np.vstack([P[:1], Q, P[-1:]])
    return P.astype(np.float32)


def clip_poly(P, box, m=0.0):
    """longest run of a polyline inside box (+ margin m)"""
    x0, y0, bw, bh = box; P = np.asarray(P, np.float32)
    ins = (P[:, 0] > x0 - m) & (P[:, 0] < x0 + bw + m) & (P[:, 1] > y0 - m) & (P[:, 1] < y0 + bh + m)
    runs, cur = [], []
    for p, i in zip(P, ins):
        if i: cur.append(p)
        elif cur: runs.append(cur); cur = []
    if cur: runs.append(cur)
    return [np.array(r, np.float32) for r in runs if len(r) >= 2]


def seg_intersections(A, B):
    """intersections of polylines A and B: [(point, ia, ib)]"""
    out = []
    for i in range(len(A) - 1):
        p, r = A[i], A[i + 1] - A[i]
        q, s = B[:-1], B[1:] - B[:-1]
        den = r[0] * s[:, 1] - r[1] * s[:, 0]; ok = np.abs(den) > 1e-9
        qp = q - p
        t = np.where(ok, (qp[:, 0] * s[:, 1] - qp[:, 1] * s[:, 0]) / np.where(ok, den, 1), -1)
        u = np.where(ok, (qp[:, 0] * r[1] - qp[:, 1] * r[0]) / np.where(ok, den, 1), -1)
        for j in np.nonzero(ok & (t >= 0) & (t <= 1) & (u >= 0) & (u <= 1))[0]: out.append((p + r * t[j], i, int(j)))
    return out


# ============================================================ geography ============================================================
def _parse_svg_roads():
    return [[[float(v) for v in q.split()] for q in sp.strip().split(" L")] for d in json.load(open(f"{GMT}/data/roads.json")) for sp in d.split("M") if sp.strip()]


def base_geo():
    """Built-in geography (map units): used when geo.json lacks an item. Sources: gm_test data (Big Black, Pearl, 11 road paths),
    the clip's towns, lat/lon of 1863 places (approx.), the 1863 Mississippi (configs/_mississippi1863.json)."""
    G = {"towns": {}, "places": {}, "rivers": {}, "roads": {}, "railroads": {}, "works": {}, "lakes": {}}
    if PROJ: return G   # project mode: everything comes from <proj>/data/geo.json
    for k, v in json.load(open(f"{GMT}/data/rivers.json")).items():
        if k != "mississippi": G["rivers"][k] = np.array(v["pts"], np.float32)
    G["rivers"]["mississippi"] = np.array(json.load(open(f"{CFGDIR}/_mississippi1863.json"))["pts"], np.float32)
    for i, r in enumerate(_parse_svg_roads()): G["roads"][f"gm{i}"] = np.array(r, np.float32)
    T = {"Vicksburg": (1386, 680), "Jackson": (1885, 724), "Edwards": (1599.4, 716.4), "Bovina": (1495.5, 701.2), "Raymond": (1716, 759),
         "Bolton": (1700, 712), "Clinton": (1789, 700), "Warrenton": (1404.2, 796.6), "Port Gibson": (1306.5, 1016.0), "Grand Gulf": (1255.0, 953.0),
         "Bruinsburg": (1180.5, 1022.0), "Utica": (1567.8, 889.4), "Rocky Springs": (1427.0, 909.2), "Cayuga": (1542.3, 844.0), "Auburn": (1513, 836),
         "Brownsville": (1725, 587), "Mississippi Springs": (1780, 792), "Brandon": (2033.2, 749.0), "Champion Hill": (1630, 701),
         "Dillon's": (1571, 793), "Willow Springs": (1381, 935), "Hard Times": (1221.5, 914.0)}
    LL = {"Milliken's Bend": (32.48, -91.07), "Young's Point": (32.385, -91.0), "Richmond": (32.388, -91.178), "New Carthage": (32.09, -91.13),
          "Haynes' Bluff": (32.516, -90.785), "Delta": (32.33, -90.92)}
    for k, (la, lo) in LL.items(): T[k] = to_map(la, lo)
    G["towns"] = {k: [float(v[0]), float(v[1])] for k, v in T.items()}
    G["places"] = {"Shaifer house": list(to_map(31.9845, -91.0432)), "Magnolia Church": list(to_map(31.9827, -91.0350)),
                   "Grant's Canal": list(to_map(32.32097, -90.93300)), "Fort Hill": [1383.0, 662.0], "Big Black bridge": [1513.0, 705.1]}
    # Southern Railroad of Mississippi (approx. until geo.json): Vicksburg depot - Bovina - Big Black bridge - Edwards - Bolton - Clinton - Jackson
    G["railroads"]["Southern Railroad of Mississippi"] = np.array([(1386.5, 683.5), (1396, 686.5), (1410, 689.5), (1428, 692), (1450, 696), (1472, 699.5),
        (1494, 699.8), (1505, 702.5), (1513.0, 705.1), (1530, 708.5), (1555, 712.5), (1580, 715.5), (1599.4, 717.6), (1630, 716.5), (1665, 714),
        (1700, 713.2), (1740, 708), (1770, 702), (1789, 701.5), (1820, 707), (1850, 716), (1872, 722), (1884, 725.5)], np.float32)
    return G


def _pts_of(v):
    """geo.json item -> Nx2 map units (accepts map / map_pts / pts / xy / latlon / ll / coords [lon,lat] GeoJSON)"""
    if isinstance(v, dict):
        if "x" in v and "y" in v and v["x"] is not None: return np.array([[v["x"], v["y"]]], np.float32)
        for k in ("map", "map_pts", "pts_map", "xy", "map_xy", "pts", "points", "path"):
            if k in v and v[k] is not None:
                a = np.array(v[k], np.float32).reshape(-1, 2)
                if np.abs(a).max() > 200: return a        # map units
                return np.array([to_map(la, lo) for la, lo in a], np.float32)
        for k in ("latlon", "ll", "lat_lon", "latlng"):
            if k in v: return np.array([to_map(la, lo) for la, lo in np.array(v[k], np.float64).reshape(-1, 2)], np.float32)
        if "lat" in v and "lon" in v: return np.array([to_map(v["lat"], v["lon"])], np.float32)
        if "geometry" in v: return _pts_of(v["geometry"])
        if "coordinates" in v:
            a = np.array(v["coordinates"], np.float64).reshape(-1, 2); return np.array([to_map(la, lo) for lo, la in a], np.float32)
    a = np.array(v, np.float32).reshape(-1, 2)
    return a if np.abs(a).max() > 200 else np.array([to_map(la, lo) for la, lo in a], np.float32)


def load_geo():
    G = base_geo(); path = f"{VX}/data/geo.json"; G["_src"] = "base"
    if not os.path.exists(path): return G
    try: J = json.load(open(path))
    except Exception as e: LOG("geo.json unreadable:", e); return G
    G["_src"] = "geo.json"; G["_raw"] = J
    def items(sec):
        S = J.get(sec)
        if S is None: return []
        if isinstance(S, dict) and S.get("type") == "FeatureCollection": S = S["features"]
        if isinstance(S, dict): return [(k, v) for k, v in S.items() if not k.startswith("_")]
        return [((v.get("name") or v.get("id") or f"{sec}{i}") if isinstance(v, dict) else f"{sec}{i}", v) for i, v in enumerate(S)]
    short = lambda k: k.split(" (")[0].strip()
    for sec, key in (("towns", "towns"), ("places", "places"), ("points", "places"), ("landmarks", "places"), ("positions", "places")):
        for k, v in items(sec):
            try: p = _pts_of(v)[0]
            except Exception: continue
            xy = [float(p[0]), float(p[1])]; kind = v.get("kind", "") if isinstance(v, dict) else ""
            for nm in {k, short(k), short(k).replace(", La.", "")}:
                G[key][nm] = xy
                if kind == "town": G["towns"][nm] = xy
                if kind == "fort": G["works"][nm] = dict(pts=np.array([xy], np.float32), kind="fort", side="cs")
    for sec, key in (("rivers", "rivers"), ("creeks", "rivers"), ("bayous", "rivers"), ("roads", "roads"), ("railroads", "railroads"), ("railroad", "railroads"),
                     ("lakes", "lakes")):
        for k, v in items(sec):
            try:
                a = _pts_of(v)
                if len(a) < 2: continue
                kind = v.get("kind", "") if isinstance(v, dict) else ""
                G["railroads" if kind == "railroad" else "lakes" if kind == "lake" else key][k] = a
            except Exception: pass
    for sec in ("forts", "works", "earthworks", "batteries", "fortifications"):
        for k, v in items(sec):
            try:
                a = _pts_of(v); G["works"][k] = dict(pts=a, kind=(v.get("kind") or v.get("type") or sec.rstrip("s")) if isinstance(v, dict) else sec.rstrip("s"),
                                                     side=(v.get("side") if isinstance(v, dict) else None))
            except Exception: pass
    return G


def gfind(G, sec, name):
    D = G[sec]
    if name in D: return D[name]
    low = {k.lower(): k for k in D}
    n = name.lower()
    if n in low: return D[low[n]]
    for k in D:
        if n in k.lower() or k.lower() in n: return D[k]
    return None


def resolve_line(G, e, sec):
    """config entry -> Nx2 map units, or None"""
    if "pts" in e: return np.array(e["pts"], np.float32)
    if "ll" in e: return np.array([to_map(a, b) for a, b in e["ll"]], np.float32)
    names = e["geo"] if isinstance(e.get("geo"), list) else [e.get("geo")]
    for nm in names:
        if nm is None: continue
        v = gfind(G, sec, nm)
        if v is not None: return np.asarray(v, np.float32)
    return None


def resolve_pt(G, e):
    if isinstance(e, (list, tuple)): return np.array(e[:2], np.float32)
    if "at" in e: return np.array(e["at"], np.float32)
    if "ll" in e: return np.array(to_map(*e["ll"]), np.float32)
    for sec in (("places", "towns") if e.get("prefer") == "places" else ("towns", "places")):
        v = gfind(G, sec, e.get("geo", e.get("name")))
        if v is not None: return np.array(v, np.float32)
    return None


# ============================================================ DEM preparation ============================================================
def prep_dem(G):
    """Edited DEM over PREP_BOX at 2 px/unit (cached): modern water filled (the 1876 cut-off, Centennial Lake, the Davis Bend cut, reservoirs,
    ponds) except along the 1863 Mississippi; modern levees / embankments on the alluvial plain flattened."""
    f = f"{TMP}/prep_dem.npy"; src = f"{REPO}/grant/assets/src/vicksburg_hd_elev.npy"
    stamp = f"{os.path.getmtime(src)}-{os.path.getmtime(f'{CFGDIR}/_mississippi1863.json')}-v7"
    if os.path.exists(f) and open(f + ".stamp").read() == stamp: return np.load(f)
    LOG("prep DEM ...")
    E = np.load(src, mmap_mode="r"); x0, y0, bw, bh = PREP_BOX
    h = np.array(E[y0 * 2:(y0 + bh) * 2, x0 * 2:(x0 + bw) * 2], np.float32)
    H, W = h.shape
    m = cv2.blur(h, (5, 5)); sd = np.sqrt(np.maximum(cv2.blur(h * h, (5, 5)) - m * m, 0))
    low = cv2.GaussianBlur(h, (0, 0), 12) - h
    water = ((sd < 0.12) & (low > 0.4)).astype(np.uint8)
    water = cv2.morphologyEx(water, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(water, 8)
    keep = np.zeros(n, bool); keep[1:] = st[1:, cv2.CC_STAT_AREA] >= 12; water = keep[lab].astype(np.uint8)
    water = cv2.dilate(water, np.ones((5, 5), np.uint8))   # + the banks
    corr = np.zeros((H, W), np.uint8)
    P = np.round((G["rivers"]["mississippi"] - [x0, y0]) * 2 * 4).astype(np.int32)
    cv2.polylines(corr, [P], False, 1, int(2 * 2 * 4.5), cv2.LINE_8, shift=2)   # keep +-4.5 units of the 1863 channel
    void = cv2.dilate((h < 5).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0   # DEM no-data holes (tiles with -64 m pits)
    LOG("  DEM voids %.3f %%" % (void.mean() * 100))
    fillm = ((water > 0) & (corr == 0)) | void
    # pull-push fill from the surrounding land
    wgt = (~fillm).astype(np.float32); val = h * wgt; pyr = []
    v, w = val, wgt
    while min(v.shape) > 4:
        pyr.append((v, w)); v = cv2.resize(v, (v.shape[1] // 2, v.shape[0] // 2), interpolation=cv2.INTER_AREA); w = cv2.resize(w, (w.shape[1] // 2, w.shape[0] // 2), interpolation=cv2.INTER_AREA)
    est = v / np.maximum(w, 1e-6)
    for v_, w_ in reversed(pyr):
        up = cv2.resize(est, (v_.shape[1], v_.shape[0]), interpolation=cv2.INTER_LINEAR)
        vb = cv2.GaussianBlur(v_, (0, 0), 1.5); wb = cv2.GaussianBlur(w_, (0, 0), 1.5)
        a = np.clip(wb * 3, 0, 1); est = a * vb / np.maximum(wb, 1e-6) + (1 - a) * up
    noise = (fbm(H // 4, W // 4, 4, 40, 7) - 0.5); noise = cv2.resize(noise, (W, H)) * 1.2
    h = np.where(fillm, est + noise, h)
    LOG("  filled %.1f %% of the DEM area (modern water)" % (fillm.mean() * 100))
    # levees: thin ridges on the alluvial plain (smoothed h < 42 m) -> flattened
    alluv = cv2.GaussianBlur(h, (0, 0), 16) < 42
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    th = h - cv2.morphologyEx(h, cv2.MORPH_OPEN, k)
    cut = np.where(alluv & (th > 0.8), th, 0); h -= cv2.GaussianBlur(cut, (0, 0), 0.8)
    LOG("  levees flattened on %.1f %% of the area" % ((cut > 0).mean() * 100))
    # alluvial plain = the low ground connected to the 1863 Mississippi (not the Big Black / Pearl bottoms)
    lowm = (cv2.GaussianBlur(h, (0, 0), 10) < 35).astype(np.uint8)
    lowm = cv2.morphologyEx(lowm, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61)))   # no narrow valleys (Big Black / Bayou Pierre bottoms)
    n, lab = cv2.connectedComponents(lowm, connectivity=8)
    ids = np.unique(lab[(corr > 0) & (lowm > 0)]); ids = ids[ids > 0]
    np.save(f"{TMP}/prep_alluv.npy", np.isin(lab, ids))
    np.save(f, h.astype(np.float32)); open(f + ".stamp", "w").write(stamp)
    return h


def crop_prep(P, box, W, H, blur=0.0):
    x0, y0, bw, bh = box; px0, py0 = PREP_BOX[:2]
    xs = (x0 - px0 + (np.arange(W) + 0.5) / W * bw) * DPU - 0.5; ys = (y0 - py0 + (np.arange(H) + 0.5) / H * bh) * DPU - 0.5
    mx, my = np.meshgrid(xs.astype(np.float32), ys.astype(np.float32))
    src = cv2.GaussianBlur(P, (0, 0), blur) if blur else P
    return np.maximum(cv2.remap(src, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE), 0.0)


# ============================================================ project mode: per-region DEM ============================================================
def pullpush(h, fillm):
    """fill the masked cells smoothly from the surrounding unmasked ones (the legacy prep_dem fill, as a function)"""
    wgt = (~fillm).astype(np.float32); val = h * wgt; pyr = []; v, w = val, wgt
    while min(v.shape) > 4:
        pyr.append((v, w)); v = cv2.resize(v, (v.shape[1] // 2, v.shape[0] // 2), interpolation=cv2.INTER_AREA); w = cv2.resize(w, (w.shape[1] // 2, w.shape[0] // 2), interpolation=cv2.INTER_AREA)
    est = v / np.maximum(w, 1e-6)
    for v_, w_ in reversed(pyr):
        up = cv2.resize(est, (v_.shape[1], v_.shape[0]), interpolation=cv2.INTER_LINEAR)
        vb = cv2.GaussianBlur(v_, (0, 0), 1.5); wb = cv2.GaussianBlur(w_, (0, 0), 1.5)
        a = np.clip(wb * 3, 0, 1); est = a * vb / np.maximum(wb, 1e-6) + (1 - a) * up
    return est


def poly_mask(shape, lines, half_u, box0, val=1):
    """mask (DEM grid of PREP_BOX) of polylines (map units) drawn half_u units either side"""
    m = np.zeros(shape, np.uint8)
    for L, hu in zip(lines, half_u):
        Pq = np.round((np.asarray(L, np.float32) - box0) * DPU * 4).astype(np.int32)
        cv2.polylines(m, [Pq], False, val, max(1, int(round(2 * hu * DPU))), cv2.LINE_8, shift=2)
    return m


def prep_dem_project(G, cfg, close):
    """Project mode: the region's own DEM (AWS terrain tiles over its box + margin at dem_ppu px/unit), edited per `dem_edits`:
    sea {level, min_px}: open water at/below level connected to the box edge (the Gulf, the lakes) -> flat 0 m + a sea mask (painted water);
    fill_water (default true): modern flat water (reservoirs, canals, ponds) filled from the banks, except +-keep units of the config rivers;
    synth_levee {river, crest_m, base_m, width_u, pow, noise_m}: replace the terrain by a natural-levee profile (heights fall from the bank to the
    back swamp) for alluvial ground covered by modern works (no levee walls, canals, streets); flatten_levees {below_m}: thin ridges flattened;
    alluvial_below: low ground mask (swamp woods / cane). Cached in TMP (one folder per region)."""
    global PREP_BOX, DPU
    box = cfg["box"]; E = cfg.get("dem_edits", {})
    DPU = int(cfg.get("dem_ppu", 8 if close else 2)); m = cfg.get("dem_margin", 6 if close else 30)
    PREP_BOX = (int(math.floor(box[0] - m)), int(math.floor(box[1] - m)), int(math.ceil(box[2] + 2 * m)), int(math.ceil(box[3] + 2 * m)))
    f = f"{TMP}/prep_dem.npy"
    keep = []
    for e in cfg.get("rivers", []):
        L = resolve_line(G, e, "rivers")
        if L is not None: keep.append((densify(curvy(L), 0.25), e.get("keep", e["w"] / 2 + 0.8)))
    stamp = json.dumps([PREP_BOX, DPU, E, [round(float(np.asarray(L).sum()), 2) for L, _ in keep], "p3"])
    if os.path.exists(f) and os.path.exists(f + ".stamp") and open(f + ".stamp").read() == stamp: return np.load(f)
    LOG("prep DEM (project) ...", PREP_BOX, "dpu", DPU)
    h = fetch_dem(PROJ, PREP_BOX, CUR_ZOOM if CUR_ZOOM is not None else PROJ.zoom, DPU).astype(np.float32)
    H, W = h.shape; b0 = np.array(PREP_BOX[:2], np.float32); q = max(1.0, DPU / 2)
    med = cv2.medianBlur(h, 5); h = np.where(np.abs(h - med) > E.get("spike_m", 40.0), med, h)   # single-pixel spikes (tile seams)
    sea = np.zeros((H, W), bool)
    if E.get("sea"):
        S = E["sea"] if isinstance(E["sea"], dict) else {}
        s0 = (h <= S.get("level", 0.0)).astype(np.uint8)
        s0 = cv2.morphologyEx(s0, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (S.get("open_px", 3),) * 2))   # open_px: erase channels narrower (modern canals)
        n, lab, st, _ = cv2.connectedComponentsWithStats(s0, 8)
        edge = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]]).tolist()) - {0}
        ok = np.zeros(n, bool); ok[1:] = st[1:, cv2.CC_STAT_AREA] >= S.get("min_px", 400)
        for i in edge: ok[i] = True
        for la, lo in S.get("seeds", []):   # lakes not touching the edge (map them by a point inside)
            x, y = to_map(la, lo); i, j = int((y - b0[1]) * DPU), int((x - b0[0]) * DPU)
            if 0 <= i < H and 0 <= j < W and lab[i, j]: ok[lab[i, j]] = True
        sea = ok[lab]
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (S.get("close_px", 5),) * 2); sea = cv2.morphologyEx(sea.astype(np.uint8), cv2.MORPH_CLOSE, k) > 0   # close_px: thin land strips in the water (causeways, tile seams)
        land = (~sea).astype(np.uint8); n, lab, st, _ = cv2.connectedComponentsWithStats(land, 8)   # no tiny islands / marsh specks
        small = np.zeros(n, bool); small[1:] = st[1:, cv2.CC_STAT_AREA] < S.get("island_px", 30); sea |= small[lab]
        for key_, val_ in (("force_water", True), ("force_land", False)):   # project mode: period shorelines (modern landfill -> water, ...), polygons [[lat, lon], ...]
            for poly in S.get(key_, []):
                pm = np.zeros((H, W), np.uint8); Q = np.array([to_map(a, b) for a, b in poly], np.float32)
                cv2.fillPoly(pm, [np.round((Q - b0) * DPU * 4).astype(np.int32)], 1, cv2.LINE_8, shift=2); sea = np.where(pm > 0, val_, sea)
        LOG("  sea %.1f %%" % (sea.mean() * 100))
    sl = E.get("synth_levee")
    if sl:
        L = gfind(G, "rivers", sl["river"]); L = densify(curvy(np.asarray(L, np.float32)), 0.25)
        cl = np.full((H, W), 255, np.uint8); cv2.polylines(cl, [np.round((L - b0) * DPU * 4).astype(np.int32)], False, 0, 1, cv2.LINE_8, shift=2)
        d = cv2.distanceTransform(cl, cv2.DIST_L2, 5) / DPU - sl.get("half_w", 3.0)
        prof = np.clip(1 - np.maximum(d, 0) / sl.get("width_u", 11.0), 0, 1) ** sl.get("pow", 1.3)
        nz = (cv2.resize(fbm(max(8, H // 8), max(8, W // 8), 4, 6, 17) - 0.5, (W, H)) * sl.get("noise_m", 0.35))
        h = (sl.get("base_m", 0.3) + (sl.get("crest_m", 4.0) - sl.get("base_m", 0.3)) * prof + nz).astype(np.float32)
        LOG("  synthetic natural-levee terrain (%s)" % sl["river"])
    elif E.get("fill_water", True):
        mm = cv2.blur(h, (5, 5)); sd = np.sqrt(np.maximum(cv2.blur(h * h, (5, 5)) - mm * mm, 0)); low = cv2.GaussianBlur(h, (0, 0), 12 * q) - h
        water = ((sd < E.get("flat_sd", 0.12)) & (low > E.get("flat_low", 0.4)) & ~sea).astype(np.uint8)
        water = cv2.morphologyEx(water, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
        n, lab, st, _ = cv2.connectedComponentsWithStats(water, 8)
        kp = np.zeros(n, bool); kp[1:] = st[1:, cv2.CC_STAT_AREA] >= 12 * q * q; water = kp[lab].astype(np.uint8)
        water = cv2.dilate(water, np.ones((int(2 * q) * 2 + 1,) * 2, np.uint8))
        corr = poly_mask((H, W), [L for L, _ in keep], [k_ for _, k_ in keep], b0) if keep else np.zeros((H, W), np.uint8)
        void = cv2.dilate((h < E.get("void_below", -15.0)).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        fillm = (((water > 0) & (corr == 0)) | void) & ~sea
        if fillm.any():
            est = pullpush(np.where(sea, 0, h).astype(np.float32), fillm | sea)
            nz = cv2.resize(fbm(max(8, H // 4), max(8, W // 4), 4, 40, 7) - 0.5, (W, H)) * 1.2
            h = np.where(fillm, est + nz, h)
        LOG("  filled %.2f %% of the DEM area (modern water)" % (fillm.mean() * 100))
    if E.get("flatten_levees"):
        alluv0 = cv2.GaussianBlur(h, (0, 0), 16 * q) < E["flatten_levees"].get("below_m", 42)
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(9 * q) | 1,) * 2); th = h - cv2.morphologyEx(h, cv2.MORPH_OPEN, k)
        cut = np.where(alluv0 & (th > 0.8), th, 0); h -= cv2.GaussianBlur(cut, (0, 0), 0.8 * q)
    h = np.where(sea, E.get("sea_floor_m", 0.0), h).astype(np.float32)
    al = np.zeros((H, W), bool)
    if E.get("alluvial_below") is not None: al = (cv2.GaussianBlur(h, (0, 0), 10 * q) < E["alluvial_below"]) & ~sea
    np.save(f"{TMP}/prep_alluv.npy", al); np.save(f"{TMP}/prep_sea.npy", sea)
    np.save(f, h); open(f + ".stamp", "w").write(stamp)
    if os.path.exists(f"{TMP}/creeks.json"): os.remove(f"{TMP}/creeks.json")
    return h


def scale_geo(G, k):
    """geography in the base frame -> a region frame of zoom base+log2(k) (same origin corner)"""
    if k == 1: return G
    S = {}
    for sec, v in G.items():
        if not isinstance(v, dict) or sec.startswith("_"): S[sec] = v; continue
        S[sec] = {}
        for nm, a in v.items():
            if isinstance(a, dict) and "pts" in a: S[sec][nm] = dict(a, pts=np.asarray(a["pts"], np.float32) * k)
            elif isinstance(a, (list, tuple)) and len(a) == 2 and not hasattr(a[0], "__len__"): S[sec][nm] = [float(a[0]) * k, float(a[1]) * k]
            else: S[sec][nm] = np.asarray(a, np.float32) * k
    return S


# ============================================================ creeks (D8 flow on the edited DEM, 1 px per unit) ============================================================
def creek_net(P, G):
    f = f"{TMP}/creeks.json"
    if os.path.exists(f) and os.path.getmtime(f) > os.path.getmtime(f"{TMP}/prep_dem.npy"): return json.load(open(f))
    LOG("creek network (D8) ...")
    x0, y0, bw, bh = PREP_BOX
    CW, CH = (bw, bh) if CPU == 1 else (int(round(bw * CPU)), int(round(bh * CPU)))
    h = cv2.resize(cv2.GaussianBlur(P, (0, 0), 1.0 * DPU / 2 / CPU), (CW, CH), interpolation=cv2.INTER_AREA).astype(np.float64)
    H, W = h.shape; N = H * W; hf = h.ravel().copy()
    # priority-flood depression filling (epsilon)
    done = np.zeros(N, bool); pq = []
    for i in list(range(W)) + list(range(N - W, N)) + list(range(0, N, W)) + list(range(W - 1, N, W)):
        if not done[i]: done[i] = True; heapq.heappush(pq, (hf[i], i))
    D = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    while pq:
        z, i = heapq.heappop(pq); r, c = divmod(i, W)
        for dr, dc in D:
            rr, cc = r + dr, c + dc
            if 0 <= rr < H and 0 <= cc < W:
                j = rr * W + cc
                if not done[j]:
                    done[j] = True
                    if hf[j] <= z: hf[j] = z + 1e-4
                    heapq.heappush(pq, (hf[j], j))
    hz = hf.reshape(H, W)
    pad = np.pad(hz, 1, constant_values=-1e9); best = np.zeros((H, W)); rec = np.full((H, W), -1, np.int64)
    rr_, cc_ = np.mgrid[0:H, 0:W]
    for dr, dc in D:
        dist = math.hypot(dr, dc); s = (hz - pad[1 + dr:1 + dr + H, 1 + dc:1 + dc + W]) / dist
        nr, nc = rr_ + dr, cc_ + dc; inside = (nr >= 0) & (nr < H) & (nc >= 0) & (nc < W)
        better = (s > best) & inside; best = np.where(better, s, best); rec = np.where(better, nr * W + nc, rec)
    rec = rec.ravel(); order = np.argsort(-hf, kind="stable"); acc = np.ones(N)
    for i in order:
        j = rec[i]
        if j >= 0: acc[j] += acc[i]
    acc = acc.reshape(H, W)
    alluv = cv2.resize(np.load(f"{TMP}/prep_alluv.npy").astype(np.float32), (CW, CH), interpolation=cv2.INTER_AREA) > 0.3   # no creeks traced on the Mississippi alluvial plain (bayous come from geo)
    thr = 120 if not PROJ else max(8, int(CREEK_KM2 * 1e6 / (MPU / CPU) ** 2))   # ~2 km^2 (1 unit^2 = 0.0167 km^2)
    ch = (acc >= thr) & ~alluv
    chf = ch.ravel(); recv = rec
    donors = np.zeros(N, np.int32)
    idx = np.nonzero(chf)[0]
    for i in idx:
        j = recv[i]
        if j >= 0 and chf[j]: donors[j] += 1
    heads = [i for i in idx if donors[i] == 0]
    seen = np.zeros(N, bool); lines = []
    heads.sort(key=lambda i: -acc.ravel()[i])
    for hd in heads:
        i = hd; pts = []
        while i >= 0 and chf[i]:
            r, c = divmod(i, W)
            if CPU == 1: pts.append([round(x0 + c + 0.5, 2), round(y0 + r + 0.5, 2), round(float(acc[r, c]) * MPU * MPU / 1e6, 2)])
            else: pts.append([round(x0 + (c + 0.5) / CPU, 3), round(y0 + (r + 0.5) / CPU, 3), round(float(acc[r, c]) * (MPU / CPU) ** 2 / 1e6, 3)])
            if seen[i]: break
            seen[i] = True; i = recv[i]
        if len(pts) >= 4: lines.append(pts)
    json.dump(lines, open(f, "w"))
    LOG("  %d creek segments" % len(lines))
    return lines


# ============================================================ close settlements ============================================================
class Settle:
    """Close-map settlements on an occupancy grid (the clip's close_town, generalised)."""
    def __init__(self, box, dist, hw, h, slope, seed):
        self.box = box; self.dist, self.hw, self.h, self.slope = dist, hw, h, slope
        self.rr = np.random.default_rng(seed); x0, y0, bw, bh = box; self.G = G = 24
        self.occ = np.zeros((int(bh * G), int(bw * G)), np.uint8)
        self.build, self.streets, self.gardens, self.yards, self.trees, self.clear = [], [], [], [], [], []

    def wet(self, x, y, m=0.35):
        p = np.array([[x, y]], np.float32)
        return sample(self.dist, self.box, p)[0] < sample(self.hw, self.box, p)[0] + m

    def steep(self, x, y, lim=34.0):
        return sample(self.slope, self.box, np.array([[x, y]], np.float32))[0] > lim

    def inside(self, x, y, m=0.5):
        x0, y0, bw, bh = self.box; return x0 + m < x < x0 + bw - m and y0 + m < y < y0 + bh - m

    def rect(self, x, y, w, d, ang, pad=0.0):
        x0, y0 = self.box[:2]; G = self.G; c, s_ = math.cos(ang), math.sin(ang); w2, d2 = w / 2 + pad, d / 2 + pad
        return np.array([[(x + c * a - s_ * b - x0) * G, (y + s_ * a + c * b - y0) * G] for a, b in ((-w2, -d2), (w2, -d2), (w2, d2), (-w2, d2))], np.int32)

    def free(self, x, y, w, d, ang):
        if not self.inside(x, y, 0.3): return False
        R = self.rect(x, y, w, d, ang, 0.004); lo = np.maximum(R.min(0) - 1, 0); hi = R.max(0) + 2
        sub = self.occ[lo[1]:hi[1], lo[0]:hi[0]]
        if sub.size == 0: return False
        m = np.zeros_like(sub); cv2.fillPoly(m, [R - lo], 1)
        return not (m & sub).any() and not self.wet(x, y) and not self.steep(x, y)

    def put(self, x, y, w, d, ang, rc, kind=0, force=False):
        if not force and not self.free(x, y, w, d, ang): return False
        cv2.fillPoly(self.occ, [self.rect(x, y, w, d, ang)], 1); self.build.append((x, y, w, d, ang, rc, kind)); return True

    def street(self, pts, wdt):
        x0, y0 = self.box[:2]; pts = np.asarray(pts, np.float32); self.streets.append((pts, wdt))
        cv2.polylines(self.occ, [np.round((pts - [x0, y0]) * self.G).astype(np.int32)], False, 1, max(1, int(wdt * self.G * 0.6)))

    def block_road(self, pts, wdt):   # roads occupy the grid (houses keep off them) but are drawn by the road pass
        x0, y0 = self.box[:2]
        cv2.polylines(self.occ, [np.round((np.asarray(pts) - [x0, y0]) * self.G).astype(np.int32)], False, 1, max(1, int(wdt * self.G)))

    def roof(self): return int(self.rr.choice(ROOFS, p=[0.26, 0.22, 0.16, 0.12, 0.12, 0.06, 0.06]))

    def dry_line(self, pts):
        ok = [not self.wet(*q) and self.inside(*q, 0.2) for q in pts]
        k = len(ok) if all(ok) else ok.index(False)
        return pts[:k]

    @staticmethod
    def tang(P, i):
        v = P[min(i + 2, len(P) - 1)] - P[max(i - 2, 0)]; return v / (np.linalg.norm(v) + 1e-6)

    def rows(self, slist, cx, cy, rad, gap_p=0.04, gable_p=0.28, shed_p=0.55, tree_p=0.18):
        rr, tang = self.rr, self.tang
        for pts, wdt in slist:
            if len(pts) < 2: continue
            arc = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]; Ltot = arc[-1]
            for side in (1, -1):
                a = rr.uniform(0.05, 0.2)
                while a < Ltot - 0.15:
                    i = min(int(np.searchsorted(arc, a)), len(pts) - 1); t = tang(pts, i); nrm = np.array([-t[1], t[0]]) * side
                    ang = math.atan2(t[1], t[0])
                    if rr.random() < gap_p: a += rr.uniform(0.15, 0.3); continue
                    gable = rr.random() < gable_p
                    w = HS * (rr.uniform(0.17, 0.24) if gable else rr.uniform(0.22, 0.42)); d = HS * (rr.uniform(0.32, 0.44) if gable else rr.uniform(0.16, 0.22))
                    setb = wdt / 2 + d / 2 + rr.uniform(0.03, 0.05)
                    i = min(int(np.searchsorted(arc, a + w / 2)), len(pts) - 1); c = pts[i] + nrm * setb
                    ins = np.hypot(c[0] - cx, c[1] - cy) < rad
                    ok_ = ins and self.put(float(c[0]), float(c[1]), w, d, ang, self.roof())
                    if not ok_ and ins and not gable:
                        w, d = w * 0.7, d * 0.85; c = pts[i] + nrm * (wdt / 2 + d / 2 + 0.03); ok_ = self.put(float(c[0]), float(c[1]), w, d, ang, self.roof())
                    if ok_:
                        b = self.build[-1]
                        if gable: self.build[-1] = (b[0], b[1], d, w, ang + math.pi / 2, b[5], 0)
                        back = setb + d / 2
                        if rr.random() < shed_p:
                            sc_ = pts[i] + nrm * (back + 0.09) + t * rr.uniform(-0.06, 0.06); self.put(float(sc_[0]), float(sc_[1]), HS * rr.uniform(0.16, 0.28), HS * rr.uniform(0.12, 0.17), ang + math.pi / 2, self.roof())
                        gc = pts[i] + nrm * (back + 0.24); self.gardens.append((float(gc[0]), float(gc[1]), w * 0.95, 0.3, ang, int(rr.integers(0, 4))))
                        if rr.random() < tree_p: q = gc + t * rr.uniform(-0.1, 0.1) + nrm * rr.uniform(0.0, 0.15); self.trees.append((float(q[0]), float(q[1]), float(rr.uniform(0.6, 0.95))))
                    a += w + rr.uniform(0.008, 0.025)

    def church(self, p, nv, t):
        ang = math.atan2(nv[1], nv[0]); c = p + nv * 0.55 + t * 0.42
        self.yards.append((float(c[0] - t[0] * 0.05), float(c[1] - t[1] * 0.05), 0.55, 0.4, ang, 1))
        if self.put(float(c[0]), float(c[1]), 0.48, 0.21, ang, 5, 1):
            tw = c - nv * 0.3; self.put(float(tw[0]), float(tw[1]), 0.12, 0.12, ang, 5, 2, force=True)

    # ---- town kinds ----
    def street_town(self, c, road, halfL=2.8, cross=6, rad=4.3, parallel=True):
        """Bovina: main street parallel to the road, a link lane, cross streets, back lanes, parallel streets, church, rows of houses"""
        rr = self.rr; bx, by = c; self.clear.append((bx, by, rad + 0.2))
        RD = densify(road, 0.05); j = int(np.hypot(RD[:, 0] - bx, RD[:, 1] - by).argmin())
        td = RD[min(j + 20, len(RD) - 1)] - RD[max(j - 20, 0)]; td /= np.linalg.norm(td)
        u = np.linspace(-halfL, halfL, int(halfL * 17))[:, None]
        main = np.array([bx, by], np.float32) + td * u + np.array([-td[1], td[0]]) * (0.12 * np.sin(u[:, :1] * 0.9))
        main = main[[not self.wet(*q) and self.inside(*q) for q in main]].astype(np.float32)
        if len(main) < 6: return
        self.street(main, 0.2); loc = [(main, 0.2)]
        if np.hypot(*(RD[j] - [bx, by])) > 0.6:
            link = densify([main[int(len(main) * 0.62)], RD[min(j + 8, len(RD) - 1)]], 0.1); self.street(link, 0.16); loc.append((link, 0.16))
        cr = []
        fr = np.linspace(0.12, 0.9, cross) if cross > 1 else [0.5]
        for f in fr:
            L1, L2 = rr.uniform(1.2, 2.2), rr.uniform(1.1, 2.2)
            i = int(f * (len(main) - 1)); p = main[i]; t = self.tang(main, i); nrm = np.array([-t[1], t[0]])
            for side, L in ((1, L1), (-1, L2)):
                u_ = np.linspace(0.12, L, 14)[:, None]; bend = rr.uniform(-0.15, 0.15)
                pts = self.dry_line(p + nrm * side * u_ + t * bend * (u_ / L) ** 2)
                if len(pts) > 4: self.street(pts, 0.15); loc.append((pts, 0.15)); cr.append((p, nrm * side, t, pts))
        for sgn in (1, -1):
            ends = [q[3][-1] for q in cr if np.dot(q[1], [0, -1]) * sgn > 0]
            if len(ends) >= 2:
                ends = sorted(ends, key=lambda q: q[0]); lane = np.concatenate([densify([ends[k], ends[k + 1]], 0.1) for k in range(len(ends) - 1)])
                lane += rr.normal(0, 0.03, lane.shape).astype(np.float32)
                if not any(self.wet(*q) for q in lane[::3]): self.street(lane, 0.13); loc.append((lane, 0.13))
        if cr: p, nv, t, _ = cr[len(cr) // 2]; self.church(p, nv, t)
        if parallel:
            for off in (1.05, -1.05):
                nm_ = np.array([-(main[-1] - main[0])[1], (main[-1] - main[0])[0]]); nm_ /= np.linalg.norm(nm_)
                par = main[4:-4] + nm_ * off + rr.normal(0, 0.02, main[4:-4].shape).astype(np.float32)
                ok = np.array([not self.wet(*q) and self.inside(*q) for q in par])
                if ok.sum() > 8: par = par[ok]; self.street(par, 0.14); loc.append((par, 0.14))
        self.rows(loc, bx, by, rad)

    def grid_town(self, c, ang, rad, block=0.9, squares=1, public=None):
        """street grid (Vicksburg, Port Gibson, Raymond, Jackson): long + cross streets every block, rows of houses on every street,
        a courthouse square in the middle, churches"""
        rr = self.rr; cx, cy = c; self.clear.append((cx, cy, rad + 0.3))
        u = np.array([math.cos(ang), math.sin(ang)]); v = np.array([-u[1], u[0]]); m = int(rad / block); loc = []
        for du, dv, wdt in ((u, v, 0.2), (v, u, 0.17)):
            for k in range(-m, m + 1):
                L = math.sqrt(max(rad * rad - (k * block) ** 2, 0))
                if L < block * 0.8: continue
                pts = np.array([cx, cy], np.float32) + dv * k * block + du * np.linspace(-L, L, max(6, int(2 * L / 0.08)))[:, None]
                ok = np.array([not self.wet(*q) and self.inside(*q) and not self.steep(*q, 40) for q in pts])
                # keep the longest dry run
                best, cur, bs = (0, 0), 0, 0
                for i, o in enumerate(ok):
                    if o:
                        if cur == 0: bs = i
                        cur += 1
                        if cur > best[1] - best[0]: best = (bs, i + 1)
                    else: cur = 0
                if best[1] - best[0] < 6: continue
                pts = pts[best[0]:best[1]].astype(np.float32); self.street(pts, wdt); loc.append((pts, wdt))
        # courthouse square: a big public building on a yard at the centre
        self.yards.append((cx, cy, block * 0.42, block * 0.42, ang, 1))
        self.put(cx, cy, 0.42, 0.3, ang, 5, 1, force=True); self.put(cx + v[0] * 0.02, cy + v[1] * 0.02, 0.12, 0.12, ang, 5, 2, force=True)
        for k in range(max(1, int(rad / 2.2))):   # churches on corners
            q = np.array([cx, cy]) + u * block * rr.integers(-m + 1, m) + v * block * rr.integers(-m + 1, m) + (u + v) * block * 0.3
            if np.hypot(*(q - [cx, cy])) < rad * 0.8:
                if self.put(float(q[0]), float(q[1]), 0.44, 0.2, ang, 5, 1): self.put(float(q[0] - u[0] * 0.28), float(q[1] - u[1] * 0.28), 0.11, 0.11, ang, 5, 2, force=True)
        for (px, py, w, d, rc) in (public or []): self.put(px, py, w, d, ang, rc, 1, force=True)
        self.rows(loc, cx, cy, rad * 1.02, gap_p=0.03, gable_p=0.32, shed_p=0.6, tree_p=0.22)

    def hamlet(self, c, ang, L):
        hx, hy = c; self.clear.append((hx, hy, 1.9)); u_ = np.array([math.cos(ang), math.sin(ang)]); v_ = np.array([-u_[1], u_[0]])
        uu = np.linspace(-L / 2, L / 2, 24)[:, None]; lane = (np.array([hx, hy]) + u_ * uu + v_ * 0.12 * np.sin(uu * 1.3)).astype(np.float32)
        lane = lane[np.array([not self.wet(*q) and self.inside(*q) for q in lane])]
        if len(lane) < 6: return None
        cl_ = (np.array([hx, hy]) + u_ * 0.25 + v_ * np.linspace(-0.7, 0.8, 10)[:, None]).astype(np.float32); cl_ = cl_[np.array([not self.wet(*q) for q in cl_])]
        hs_l = [(lane, 0.15)]; self.street(lane, 0.15)
        if len(cl_) > 4: self.street(cl_, 0.12); hs_l.append((cl_, 0.12))
        self.rows(hs_l, hx, hy, 1.9); return lane

    def farmstead(self, fx, fy, a=None):
        rr = self.rr; a = rr.uniform(0, math.pi) if a is None else a
        u = np.array([math.cos(a), math.sin(a)]) * FS; v = np.array([-u[1], u[0]]); L = lambda p, q: np.array([fx, fy]) + u * p + v * q
        if not self.free(fx, fy, 0.6, 0.6, a): return False
        self.clear.append((fx, fy, 1.1)); yc = L(0.12, 0.38); self.yards.append((float(yc[0]), float(yc[1]), 0.55 * FS, 0.42 * FS, a, 0))
        for (p, q, ln, rot) in ((0.12, 0.38 - 0.42, 0.95, 0), (0.12 - 0.5, 0.38, 0.8, 1), (0.12 + 0.5, 0.38, 0.8, 1)):
            c = L(p, q); self.build.append((float(c[0]), float(c[1]), ln * FS, 0.022, a + rot * math.pi / 2, 0, 3))
        c = L(0, 0); self.put(float(c[0]), float(c[1]), FS * rr.uniform(0.42, 0.55), FS * rr.uniform(0.19, 0.24), a, self.roof())
        c = L(0.62, 0.42); self.put(float(c[0]), float(c[1]), FS * rr.uniform(0.62, 0.8), FS * rr.uniform(0.26, 0.32), a + math.pi / 2, int(rr.choice([3, 4, 0])))
        for (p, q, w, d, rot) in [(0.05, 0.85, 0.34, 0.18, 0), (-0.45, 0.4, 0.28, 0.16, 1), (0.3, -0.35, 0.24, 0.15, 0), (-0.35, 0.95, 0.2, 0.14, 1)][: int(rr.integers(2, 5))]:
            c = L(p + rr.uniform(-0.04, 0.04), q + rr.uniform(-0.04, 0.04)); self.put(float(c[0]), float(c[1]), FS * w * rr.uniform(0.85, 1.15), FS * d, a + rot * math.pi / 2, self.roof())
        gc = L(-0.62, -0.32); self.gardens.append((float(gc[0]), float(gc[1]), 0.55 * FS, 0.42 * FS, a, int(rr.integers(0, 4))))
        for i in range(3):
            for j in range(3):
                if rr.random() < 0.7: q = L(1.05 + i * 0.2 + rr.uniform(-0.04, 0.04), -0.45 + j * 0.2 + rr.uniform(-0.04, 0.04)); self.trees.append((float(q[0]), float(q[1]), float(rr.uniform(0.5, 0.75))))
        return True

    def plantation(self, fx, fy, a=None):
        """1863 cotton plantation: big house in a grove facing the road, kitchen + office, gin house and barns, the quarters = two rows of
        small cabins on a lane behind"""
        rr = self.rr; a = rr.uniform(0, math.pi) if a is None else a
        u = np.array([math.cos(a), math.sin(a)]); v = np.array([-u[1], u[0]]); L = lambda p, q: np.array([fx, fy]) + u * p + v * q
        if not self.free(fx, fy, 0.8, 0.8, a): return False
        self.clear.append((fx, fy, 2.2)); self.yards.append((fx, fy, 0.5, 0.36, a, 1))
        self.put(fx, fy, 0.34, 0.2, a, int(rr.choice([5, 4, 0])), 0)                         # big house
        for p, q in ((-0.3, 0.25), (0.3, 0.25)): c = L(p, q); self.put(float(c[0]), float(c[1]), 0.12, 0.1, a, self.roof())
        for k in range(10): q_ = L(rr.uniform(-0.7, 0.7), rr.uniform(-0.75, -0.3)); self.trees.append((float(q_[0]), float(q_[1]), float(rr.uniform(0.8, 1.15))))
        lane = np.array([L(0, 0.55 + 0.12 * k) for k in range(14)], np.float32)
        lane = self.dry_line(lane)
        if len(lane) > 5:
            self.street(lane, 0.11)
            for k in range(1, len(lane), 2):
                for side in (1, -1):
                    c = lane[k] + u * side * 0.2; self.put(float(c[0]), float(c[1]), 0.1, 0.08, a, int(rr.choice([3, 4, 5])))
        c = L(0.9, 0.9); self.put(float(c[0]), float(c[1]), 0.3, 0.2, a + math.pi / 2, 3)    # gin house
        c = L(-0.85, 1.0); self.put(float(c[0]), float(c[1]), 0.28, 0.14, a, 4)              # barn
        gc = L(-0.75, 0.2); self.gardens.append((float(gc[0]), float(gc[1]), 0.35, 0.3, a, int(rr.integers(0, 4))))
        return True

    def result(self): return dict(build=self.build, streets=self.streets, gardens=self.gardens, yards=self.yards, trees=self.trees, clear=self.clear)


# ============================================================ wide settlements (the clip's wide_plan, config-driven) ============================================================
def wide_plan(cfg, G, dist, hw, box, roads, sea=None):
    x0, y0, bw, bh = box
    RDP = np.concatenate([densify(rd, 0.1) for rd in roads]) if roads else np.zeros((1, 2), np.float32) - 1e4
    wet = lambda x, y, m=1.0: sample(dist, box, np.array([[x, y]], np.float32))[0] < sample(hw, box, np.array([[x, y]], np.float32))[0] + m
    if sea is not None:
        wet0 = wet; wet = lambda x, y, m=1.0: wet0(x, y, m) or sample(sea, box, np.array([[x, y]], np.float32))[0] > 0.2
    towns, streets, houses, occ = [], [], [], []
    def put(px, py, w, d, rot, rc, gap=0.75):
        if wet(px, py, 1.2): return False
        if any((px - q[0]) ** 2 + (py - q[1]) ** 2 < (gap * min(w, 1.6)) ** 2 for q in occ[-160:]): return False
        occ.append((px, py)); houses.append((px, py, w, d, rot, rc)); return True
    TT = {}; CLU = {}
    if PROJ and cfg.get("village_cluster"): CLU["_v*"] = cfg["village_cluster"]
    for t in cfg.get("towns", []):
        p = resolve_pt(G, t)
        if p is None: LOG("  town not found:", t.get("name")); continue
        TT[t["name"]] = (float(p[0]), float(p[1]), t.get("rad", 1.6), t.get("houses", 12), t.get("grid"), t.get("snap", True))
        if PROJ and t.get("cluster"): CLU[t["name"]] = t["cluster"]   # project mode: compact cluster of small houses (no long houses strung along crossing roads)
    VIL = {}; rv_ = np.random.default_rng(cfg.get("seed", 5)); allT = [v[:2] for v in TT.values()]
    for p_ in RDP[rv_.permutation(len(RDP))]:
        if len(VIL) >= cfg.get("villages", 14): break
        if not (x0 + 20 < p_[0] < x0 + bw - 20 and y0 + 20 < p_[1] < y0 + bh - 20): continue
        if min(math.hypot(p_[0] - q[0], p_[1] - q[1]) for q in allT) < 28: continue
        VIL["_v%d" % len(VIL)] = (float(p_[0]), float(p_[1]), 1.0, 7, None, True); allT.append(p_[:2])
    for nm, (tx, ty, rad, cnt, grid, snap) in {**TT, **VIL}.items():
        if not (x0 - rad < tx < x0 + bw + rad and y0 - rad < ty < y0 + bh + rad): continue
        if snap and not grid:
            dd = np.hypot(RDP[:, 0] - tx, RDP[:, 1] - ty); j = int(dd.argmin())
            if dd[j] < 14: tx, ty = float(RDP[j, 0]), float(RDP[j, 1])
        if wet(tx, ty, 1.5) and not grid: continue
        towns.append((nm, (tx, ty, rad)))
        rr = np.random.default_rng(sum(map(ord, nm)) + 11)
        near_rd = RDP[np.hypot(RDP[:, 0] - tx, RDP[:, 1] - ty) < rad * (1.6 if grid else 5.5)]
        if len(near_rd) > 4:
            j = int(np.hypot(near_rd[:, 0] - tx, near_rd[:, 1] - ty).argmin()); a_, b_ = near_rd[max(j - 5, 0)], near_rd[min(j + 5, len(near_rd) - 1)]
            ang = math.atan2(b_[1] - a_[1], b_[0] - a_[0])
        else: ang = rr.uniform(0, math.pi)
        if isinstance(grid, dict) and "angle" in grid: ang = math.radians(grid["angle"])
        u = np.array([math.cos(ang), math.sin(ang)]); v = np.array([-u[1], u[0]])
        if grid:
            B = grid["block"] if isinstance(grid, dict) else float(grid); R_ = rad * 1.35; m = int(R_ / B)
            for kind_, (du, dv) in ((0, (u, v)), (1, (v, u))):
                for k in range(-m, m + 1):
                    L = math.sqrt(max(R_ * R_ - (k * B) ** 2, 0)) * (1.0 if kind_ == 0 else 0.8)
                    if L < B: continue
                    pts = np.array([[tx, ty]], np.float32) + dv * k * B + du * np.linspace(-L, L, max(4, int(2 * L / 0.5)))[:, None]
                    ok = np.array([not wet(*q, 0.6) for q in pts])
                    if ok.sum() < 4: continue
                    pts = pts[ok]; streets.append((pts.astype(np.float32), 0.42))
                    if kind_ == 1: continue
                    for side in (1, -1):
                        a = rr.uniform(0, 0.6)
                        while a < 2 * L:
                            w = rr.uniform(0.7, 1.1); d = rr.uniform(0.42, 0.55)
                            c = np.array([tx, ty]) + dv * (k * B + side * (0.24 + d / 2 + 0.06)) + du * (-L + a + w / 2)
                            if rr.random() < 0.88: put(float(c[0]), float(c[1]), w, d, -ang, int(rr.integers(0, 4)), 0.5)
                            a += w + rr.uniform(0.15, 0.4)
            for k in range(-m, m + 1):
                for side in (1, -1):
                    for q in np.arange(-R_, R_, B):
                        c = np.array([tx, ty]) + u * (k * B + side * 0.6) + v * (q + B / 2)
                        if rr.random() < 0.3 and np.hypot(c[0] - tx, c[1] - ty) < R_: put(float(c[0]), float(c[1]), rr.uniform(0.6, 0.9), rr.uniform(0.42, 0.52), -ang - math.pi / 2, int(rr.integers(0, 4)), 0.55)
        elif CLU.get(nm) or (nm.startswith("_v") and CLU.get("_v*")):
            cl = CLU.get(nm) or CLU["_v*"]; R_ = rad * cl.get("spread", 1.6) if isinstance(cl, dict) else rad * 1.6
            n_ = int(cnt * (cl.get("k", 1.5) if isinstance(cl, dict) else 1.5)); k = 0; tries = 0
            while k < n_ and tries < n_ * 40:
                tries += 1; q = rr.uniform(0, 2 * math.pi); r_ = R_ * math.sqrt(rr.uniform(0, 1))
                px, py = tx + math.cos(q) * r_, ty + math.sin(q) * r_; rot = -ang + (math.pi / 2 if rr.random() < 0.4 else 0) + rr.normal(0, 0.08)
                if put(px, py, rr.uniform(0.45, 0.8), rr.uniform(0.35, 0.5), rot, int(rr.integers(0, 4)), 0.55): k += 1
        else:
            k = 0; tries = 0; cnt_ = int(cnt * 5); rad = rad * 4.5
            cross = np.array([tx, ty], np.float32) + v * np.linspace(-rad * 0.8, rad * 0.8, 12)[:, None]
            if not any(wet(*q, 0.6) for q in cross): streets.append((cross.astype(np.float32), 0.3))
            while k < cnt_ and tries < cnt_ * 40:
                tries += 1
                if len(near_rd) > 4 and rr.random() < 0.8:
                    j = int(rr.integers(1, len(near_rd) - 1)); a_, b_ = near_rd[j - 1], near_rd[j + 1]; ra = math.atan2(b_[1] - a_[1], b_[0] - a_[0])
                    off = rr.uniform(0.75, 1.3) * rr.choice([-1, 1]); px, py = near_rd[j][0] - math.sin(ra) * off, near_rd[j][1] + math.cos(ra) * off
                    rot = -ra + (math.pi / 2 if rr.random() < 0.15 else 0)
                else:
                    q = rr.uniform(-rad * 0.8, rad * 0.8); off = rr.uniform(0.7, 1.1) * rr.choice([-1, 1]); c = np.array([tx, ty]) + v * q + u * off
                    px, py = float(c[0]), float(c[1]); rot = -ang - math.pi / 2
                if math.hypot(px - tx, py - ty) > rad * 1.3: continue
                if put(px, py, rr.uniform(1.3, 2.3), rr.uniform(0.7, 0.95), rot, int(rr.integers(0, 4)), 0.62): k += 1
    return dict(towns=towns, streets=streets, houses=houses)


# ============================================================ the bake ============================================================
def meander(rd, keep, amp=0.32, wl=7.5, seed=0):
    """the clip's close-road meander (gentle, damped near `keep` points: bridges, town centres)"""
    if len(rd) < 4: return rd
    arc = np.r_[0, np.cumsum(np.hypot(*np.diff(rd, axis=0).T))]
    t = np.diff(rd, axis=0, prepend=rd[:1]); t[0] = t[1]; t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-6; nrm = np.stack([-t[:, 1], t[:, 0]], 1)
    damp = np.ones(len(rd))
    for (kx, ky, kr) in keep: damp = np.minimum(damp, np.clip((np.hypot(rd[:, 0] - kx, rd[:, 1] - ky) - kr) / 3.0, 0, 1))
    damp = np.minimum(damp, np.clip(arc / 2.0, 0, 1) * np.clip((arc[-1] - arc) / 2.0, 0, 1))
    ph = (seed % 97) * 0.37
    off = (amp * np.sin(arc / wl * 2 * np.pi + 0.6 + ph) + amp * 0.44 * np.sin(arc / (wl * 0.41) * 2 * np.pi + 2.0 + ph)) * damp
    return smooth(rd + nrm * off[:, None], 6)


def bake(rname, G, P, creeks, preview=True):
    cfg = json.load(open(f"{CFGDIR}/{rname}.json")); t0 = time.time()
    close = cfg.get("mode", "close") == "close"; out = f"{WORLDS}/{cfg.get('out', rname)}"; os.makedirs(out, exist_ok=True)
    box = tuple(float(v) for v in cfg["box"]); x0, y0, bw, bh = box
    ppu = cfg.get("hm_ppu", 8.0 if close else 1.5); HW, HH = int(round(bw * ppu)), int(round(bh * ppu))
    TW = int(cfg.get("tex", 4096 if close else 8192)); TH = int(round(TW * bh / bw)); seed = cfg.get("seed", 21); exag = cfg.get("exag", 6.0 if close else 14.0)
    LOG(f"== {rname}: box {box} hm {HW}x{HH} tex {TW}x{TH} ({'close' if close else 'wide'})")
    global WINTER
    WINTER = (cfg.get("winter") or {}) if (PROJ and cfg.get("season") == "winter") else None   # project mode: winter ground (configs without 'season' unchanged)
    if WINTER is not None and not WINTER: WINTER = {"on": True}
    upx_h = HW / bw
    h = crop_prep(P, box, HW, HH, blur=1.0 if not close else 1.6)
    if close:
        rn = cfg.get("relief_noise", [7.0, 1.6])
        h += (fbm(HH, HW, 5, 4, seed + 5) - 0.5) * rn[0] + (fbm(HH, HW, 4, 16, seed + 6) - 0.5) * rn[1]
    SEA = None
    if PROJ and os.path.exists(f"{TMP}/prep_sea.npy"):
        SEA = cv2.GaussianBlur(crop_prep(np.load(f"{TMP}/prep_sea.npy").astype(np.float32), box, HW, HH), (0, 0), 0.6)
        if SEA.max() < 0.5: SEA = None
        else: h = np.where(SEA > 0.5, cfg.get("dem_edits", {}).get("sea_floor_m", 0.0), h)
    hs = cv2.GaussianBlur(h, (0, 0), 2.5 * upx_h)
    # ---------------- rivers: named ribbons + DEM creeks ----------------
    riv_in = []; main_riv = None
    for e in cfg.get("rivers", []):
        L = resolve_line(G, e, "rivers")
        if L is None: LOG("  river not found:", e.get("geo")); continue
        L = curvy(L)
        if PROJ and e.get("reverse"): L = L[::-1].copy()   # pin a direction (keeps pts order stable when the terrain changes)
        if PROJ and e.get("orient", True) and len(L) > 3:   # project mode: lines from OSM / research run either way; water_levels needs upstream first
            hb_ = cv2.GaussianBlur(P, (0, 0), 2.0 * DPU); ev = sample(hb_, (PREP_BOX[0], PREP_BOX[1], P.shape[1] / DPU, P.shape[0] / DPU), L[[0, -1]])
            if ev[0] < ev[1] - 0.5: L = L[::-1].copy(); LOG("  river reversed (upstream first):", e.get("name", e.get("geo")))
        if e.get("snap", e["w"] < 2.0) and e.get("geo") and not e.get("pts"): L = snap_valley(P, L, e.get("snap_r", 4.0))
        if main_riv is None: main_riv = densify(L, 0.5)
        elif e.get("join"):   # extend the ends that stop short of the main river onto it
            for end in (0, -1):
                dd = np.hypot(main_riv[:, 0] - L[end, 0], main_riv[:, 1] - L[end, 1]); j = int(dd.argmin())
                if 0.3 < dd[j] < 25: L = np.vstack([L, main_riv[j][None]]) if end == -1 else np.vstack([main_riv[j][None], L])
        step = e.get("step", 1.5 if not close else 0.12)
        for run in clip_poly(densify(L, min(step, 1.0)), box, (1.5 if close else 6) + e["w"]):
            pts = smooth(densify(run, step), e.get("smooth", 6 if not close else 8))
            if close and e.get("meander", 0): pts = meander(pts, [], amp=e["meander"], wl=e.get("meander_wl", 2.2), seed=len(riv_in) + seed)
            riv_in.append((e.get("name", e.get("geo")), pts, float(e["w"]), e))
    ck = cfg.get("creeks", {"ribbon_km2": 60 if close else 1e9, "paint_km2": 3 if close else 25})
    named = [p for _, p, _, _ in riv_in]
    creek_lines = []   # painted only (thin dark lines + small carve)
    for cl in creeks:
        A = np.array(cl, np.float32)
        A = A[(A[:, 0] > x0 - 2) & (A[:, 0] < x0 + bw + 2) & (A[:, 1] > y0 - 2) & (A[:, 1] < y0 + bh + 2)]
        if len(A) < 4: continue
        A = A[A[:, 2] >= ck.get("paint_km2", 3)]
        if len(A) < 4: continue
        if named:   # drop parts within 1.6 units of a named river
            dmin = np.min([np.min(np.hypot(A[:, None, 0] - q[None, ::3, 0], A[:, None, 1] - q[None, ::3, 1]), 1) for q in named], 0)
            A = A[dmin > (6.0 if close else 6)]
            if len(A) < 4: continue
        creek_lines.append(A)
    # ribbon creeks (close): the biggest painted creeks become water ribbons
    for A in list(creek_lines):
        big = A[A[:, 2] >= ck.get("ribbon_km2", 1e9)]
        if close and len(big) >= 8:
            pts = smooth(densify(chaikin(big[:, :2], 2), 0.12), 8); pts = meander(pts, [], amp=0.16, wl=1.6, seed=len(riv_in))
            riv_in.append(("creek", pts, float(np.clip(0.14 + 0.0016 * big[:, 2].mean(), 0.16, 0.32)), {"auto": True}))
    rivs = []; wlimg = np.full((HH, HW), 1e4, np.float32); cl = np.full((HH, HW), 255, np.uint8); widthimg = np.zeros((HH, HW), np.float32)
    for key, pts, w, e in riv_in:
        wl = water_levels(pts, lambda p: sample(hs, box, p))
        if "wl_max" in e: wl = np.minimum(wl, e["wl_max"])
        Pp = np.stack([(pts[:, 0] - x0) * upx_h, (pts[:, 1] - y0) * upx_h], 1)
        tmp = np.full((HH, HW), 1e4, np.float32); th = max(2, int((w * 2.5 + 2.0) * upx_h))
        for i in range(len(Pp) - 1):
            a = tuple(int(v) for v in np.round(Pp[i] * 4)); b = tuple(int(v) for v in np.round(Pp[i + 1] * 4))
            cv2.line(tmp, a, b, float(wl[i]), th, cv2.LINE_8, shift=2); cv2.line(widthimg, a, b, float(w), th, cv2.LINE_8, shift=2)
        wlimg = np.minimum(wlimg, tmp)
        cv2.polylines(cl, [np.round(Pp * 4).astype(np.int32)], False, 0, 1, cv2.LINE_8, shift=2)
        stride = 2 if close or w < 3 else 1
        rivs.append(dict(name=key, w=round(w, 3), pts=[[round(float(p[0]), 3), round(float(p[1]), 3), round(float(l), 2)] for p, l in zip(pts[::stride], wl[::stride])]))
    dist = cv2.distanceTransform(cl, cv2.DIST_L2, 5) / upx_h
    hw = np.maximum(widthimg, 0.3) / 2; depth = 2.5 if not close else 3.0
    bankslope = 9.0 if not close else 14.0
    target = np.where(dist < hw, wlimg - depth * (1 - (dist / hw) ** 2) - 0.4, wlimg - 0.4 + (dist - hw) * bankslope)
    h = np.where(wlimg < 1e3, np.minimum(h, target), h)
    # creek troughs (painted creeks): 0.6-2 m
    cm = np.zeros((HH, HW), np.float32)
    for A in creek_lines:
        Pp = np.round((chaikin(A[:, :2], 2) - [x0, y0]) * upx_h * 4).astype(np.int32)
        cv2.polylines(cm, [Pp], False, float(np.clip(0.6 + A[:, 2].mean() * 0.02, 0.6, 2.0)), max(1, int(0.5 * upx_h)), cv2.LINE_AA, shift=2)
    h -= cv2.GaussianBlur(cm, (0, 0), max(0.6, 0.35 * upx_h))
    if not close:   # GM wide: flat plateau, relief only in the river valleys (clip v7)
        valley = np.clip(1 - (dist - hw - 12.0) / 11.0, 0, 1); valley = cv2.GaussianBlur(valley, (0, 0), 3 * upx_h)
        trend = cv2.GaussianBlur(h, (0, 0), 30 * upx_h); h = trend + (h - trend) * (5 / 14 + (1.5 - 5 / 14) * valley); del trend
        h = np.where(wlimg < 1e3, np.minimum(h, target), h)
    # ---------------- roads, railroads ----------------
    bridges_cfg = cfg.get("features", {}).get("bridges", [])
    keep_pts = [(float(b["at"][0]), float(b["at"][1]), 1.5) for b in bridges_cfg if "at" in b]
    town_pts = []
    for t in cfg.get("towns", []):
        p = resolve_pt(G, t)
        if p is not None: town_pts.append((float(p[0]), float(p[1]), t.get("rad", 2.0) + 0.5))
    RDS = []   # (pts, cls, name)
    for e in cfg.get("roads", []):
        L = resolve_line(G, e, "roads")
        if L is None: LOG("  road not found:", e.get("geo")); continue
        L = curvy(L)
        for run in clip_poly(densify(L, 0.5), box, 3):
            if close:
                rd = densify(run, 0.08)
                # crossings with the ribbons stay straight (bridges)
                kp = keep_pts + town_pts
                for _, rp, rw, _ in riv_in:
                    for (q, _, _) in seg_intersections(rd[::4], rp[::2]): kp.append((float(q[0]), float(q[1]), 1.2 + rw))
                rd = meander(rd, kp, amp=e.get("meander", 0.32 if e.get("cls", "pike") == "pike" else 0.22), wl=e.get("meander_wl", 7.5), seed=len(RDS) + seed) if e.get("meander", 1) else smooth(rd, 6)
            else: rd = smooth(densify(run, 0.5), 3)
            if PROJ and SEA is not None:   # project mode: no road on the sea (ferries = the two landings): keep the dry runs only
                dry = sample(SEA, box, rd) < 0.35; cuts = np.split(np.arange(len(rd)), np.nonzero(np.diff(dry.astype(np.int8)))[0] + 1)
                for ix in cuts:
                    if dry[ix[0]] and len(ix) >= 4: RDS.append((rd[ix].astype(np.float32), e.get("cls", "pike"), e.get("name", e.get("geo"))))
                continue
            RDS.append((rd.astype(np.float32), e.get("cls", "pike"), e.get("name", e.get("geo"))))
    RAILS = []
    for e in cfg.get("railroads", []):
        L = resolve_line(G, e, "railroads")
        if e.get("follow_road"):   # the railroad alongside a road (offset to one side, merging at the given points, e.g. a shared bridge)
            R0 = densify(resolve_line(G, {"geo": e["follow_road"]}, "roads"), 0.1); t_ = np.gradient(R0, axis=0); t_ /= np.linalg.norm(t_, axis=1, keepdims=True) + 1e-6
            dmp = np.ones(len(R0))
            for mx, my in e.get("merge_at", []): dmp = np.minimum(dmp, np.clip((np.hypot(R0[:, 0] - mx, R0[:, 1] - my) - 0.6) / 2.5, 0, 1))
            L = smooth(R0 + np.stack([-t_[:, 1], t_[:, 0]], 1) * (e.get("offset", 0.5) * dmp)[:, None], 8)
        if L is None: LOG("  railroad not found:", e.get("geo")); continue
        L = curvy(L)
        for run in clip_poly(densify(L, 0.5), box, 3):
            rd = catmull(run[::max(1, int(len(run) / 60))] if len(run) > 120 else run, 0.08 if close else 0.5)
            RAILS.append((smooth(rd, 4).astype(np.float32), e.get("name", e.get("geo"))))
    # ---------------- works (earthworks) ----------------
    WORKS = []
    for e in cfg.get("features", {}).get("works", []):
        L = resolve_line(G, e, "works") if "pts" in e or "ll" in e else np.array([e["at"]], np.float32) if "at" in e else None
        if L is None and e.get("geo"):
            v = gfind(G, "works", e["geo"]); L = None if v is None else np.asarray(v["pts"], np.float32)
        if L is None: LOG("  work not found:", e.get("name")); continue
        if len(L) == 1 or e.get("shape"):   # point -> standard plan (redan / lunette / redoubt / square / battery / fort)
            L = work_shape(L[0], e)
        L = densify(L, 0.04 if close else 0.4)
        if e.get("closed") and np.hypot(*(L[0] - L[-1])) > 0.05: L = np.vstack([L, L[:1]])
        L = orient_work(L, e)
        WORKS.append(dict(e=e, pts=L.astype(np.float32)))
    if cfg.get("siege_lines"): WORKS += siege_works(G, h, box, close, cfg)
    for nm, sp in cfg.get("auto_works", {}).items():
        WORKS += auto_works(nm, sp, G, h, box, close)
    # ---------------- ground texture ----------------
    s = TW / bw; Pt = lambda q_: ((q_[0] - x0) * s, (q_[1] - y0) * s)
    ht = cv2.resize(h, (TW, TH), interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) * s / MPU; gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) * s / MPU
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.006 * TW); slope /= np.percentile(slope, 99) + 1e-6
    del gx, gy
    hg = np.gradient(h, 1 / upx_h); sl_u = np.hypot(*hg)   # metres per unit, heightmap grid
    r = np.random.default_rng(seed); cell = cfg.get("cell", 5.2 if close else 22.0) * s
    LW, LH = (TW, TH) if close else (TW // 2, TH // 2); cs = cell * LW / TW
    zones = cfg.get("cell_zones", [])   # [{x_from, k}] smaller fields east of x_from (clip: east of the breastworks)
    seeds = np.zeros((LH, LW), np.uint8) + 255
    xz = min([z["x_from"] for z in zones], default=None)
    for yy_ in np.arange(cs / 2, LH + cs, cs * 0.7):
        for xx_ in np.arange(cs / 2, LW + cs, cs * 1.35):
            px_, py_ = xx_ + r.uniform(-0.5, 0.5) * cs * 1.35, yy_ + r.uniform(-0.4, 0.4) * cs * 0.7
            if 0 <= px_ < LW and 0 <= py_ < LH and not (xz is not None and px_ > (xz - x0) * s * LW / TW): seeds[int(py_), int(px_)] = 0
    for z in zones:
        ce = cs * z["k"]
        for yy_ in np.arange(ce / 2, LH + ce, ce * 0.7):
            for xx_ in np.arange((z["x_from"] - x0) * s * LW / TW + ce / 2, LW + ce, ce * 1.35):
                px_, py_ = xx_ + r.uniform(-0.5, 0.5) * ce * 1.35, yy_ + r.uniform(-0.4, 0.4) * ce * 0.7
                if 0 <= px_ < LW and 0 <= py_ < LH: seeds[int(py_), int(px_)] = 0
    _, lab = cv2.distanceTransformWithLabels(seeds, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    wx = (fbm(LH, LW, 4, 8, seed + 30) - 0.5) * cs * 0.5; wy = (fbm(LH, LW, 4, 8, seed + 31) - 0.5) * cs * 0.5
    my_, mx_ = np.mgrid[0:LH, 0:LW].astype(np.float32)
    lab = cv2.remap(lab.astype(np.float32), mx_ + wx, my_ + wy, cv2.INTER_NEAREST, borderMode=cv2.BORDER_REPLICATE)
    Mr = cv2.getRotationMatrix2D((LW / 2, LH / 2), 14, 1.12); lab = cv2.warpAffine(lab, Mr, (LW, LH), flags=cv2.INTER_NEAREST, borderMode=cv2.BORDER_REFLECT)
    lab = cv2.resize(lab, (TW, TH), interpolation=cv2.INTER_NEAREST).astype(np.int32); n = int(lab.max()) + 1
    if PROJ and cfg.get("longlots"): lab, n = longlot_labels(cfg["longlots"], G, box, TW, TH, s, seed)
    del seeds, wx, wy, my_, mx_
    LOG("  fields ...")
    hedge_pts = None
    if close: img, hedge_pts = gm_fields(lab, n, cell, s, r, TW, TH, seed)
    elif PROJ and cfg.get("field_look") == "gm": img, _ = gm_fields(lab, n, cell, s, r, TW, TH, seed)   # project mode: the close (chalmette) field look on a wide map
    else: img = wide_fields(lab, n, cell, s, r, TW, TH, seed)
    if PROJ and cfg.get("field_patch_k") is not None:   # project: field patch-to-patch contrast x k (soft Voronoi facets), the strip / mottle detail kept
        lp_ = cv2.GaussianBlur(img, (0, 0), cell * 0.5); img = img - (1 - cfg["field_patch_k"]) * (lp_ - img.reshape(-1, 3).mean(0)); del lp_
    if PROJ and cfg.get("rust_k"):   # project mode: pull the rust / ploughed-brown field tones toward the sand tones (reads as a pink smear on hills)
        red = np.clip((img[..., 0] - img[..., 1] - 12.0) / 14.0, 0, 1)[..., None] * cfg["rust_k"]
        img = img * (1 - red) + np.array([138, 128, 90], np.float32) * (img.mean(-1, keepdims=True) / 119.0) * red; del red
    del lab
    dist_t = cv2.resize(dist, (TW, TH), interpolation=cv2.INTER_LINEAR); hw_t = cv2.resize(hw, (TW, TH), interpolation=cv2.INTER_NEAREST)
    near = np.clip(1 - (dist_t - hw_t) / (10.0 if not close else 2.5), 0, 1)
    # alluvial plain + Louisiana side (west of the 1863 Mississippi): swamp woods in the back-swamps, cane brakes along the bayous
    AL = np.load(f"{TMP}/prep_alluv.npy").astype(np.float32)
    alluv = cv2.resize(cv2.GaussianBlur(crop_prep(AL, box, HW, HH), (0, 0), 1.5 * upx_h), (TW, TH), interpolation=cv2.INTER_LINEAR)
    # settlements
    LOG("  settlements ...")
    town = None; wplan = None
    if close:
        if PROJ and SEA is not None and cfg.get("settle_sea", True): town = settle_close(cfg, G, box, np.where(SEA > 0.35, 0.0, dist).astype(np.float32), hw, h, sl_u, RDS, seed)   # project mode: no houses / streets on the sea
        else: town = settle_close(cfg, G, box, dist, hw, h, sl_u, RDS, seed)
        RDS += [(ln, "lane", "lane") for ln in town.pop("lanes")]
    else:
        wplan = wide_plan(cfg, G, dist, hw, box, [rd for rd, c, _ in RDS if c == "pike"] or [rd for rd, _, _ in RDS], *([SEA] if SEA is not None else []))
    townmask = np.zeros((TH, TW), np.float32)
    if wplan:
        for nm, (tx, ty, rad) in wplan["towns"]:
            gt = any(t.get("grid") for t in cfg.get("towns", []) if t["name"] == nm)
            cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s * (1.45 if gt else 4.8)), 1.0, -1)
    if town or cfg.get("clear"):   # irregular clearings round the settlements + cfg 'clear' (fields reach into the woods; no round discs)
        cm_ = np.zeros((TH // 4, TW // 4), np.float32)
        for (tx, ty, rad) in (town["clear"] if town else []) + [tuple(c_[:3]) for c_ in cfg.get("clear", [])]:
            cx, cy = Pt((tx, ty)); cv2.circle(cm_, (int(cx / 4), int(cy / 4)), int(rad * 1.6 * s / 4), 1.0, -1)
        cm_ = cv2.GaussianBlur(cm_, (0, 0), (cfg.get("clear_blur", 1.0) if PROJ else 1.0) * s / 4); nz = fbm(TH // 4, TW // 4, 4, int(bw / (cfg.get("clear_noise_u", 2.0) if PROJ else 2.0)), seed + 90)
        cm_ = np.clip((cm_ - 0.3 - (nz - 0.5) * 1.1) * 6, 0, 1)
        townmask = np.maximum(townmask, cv2.resize(cm_, (TW, TH), interpolation=cv2.INTER_LINEAR)); del cm_, nz
    for W_ in WORKS:   # fields of fire in front of the works
        cv2.polylines(townmask, [np.round(np.array([Pt(p) for p in W_["pts"]])).astype(np.int32)], False, 1.0, int(W_["e"].get("clear", 4.0 if close else 2.0) * s))
    road0 = np.zeros((TH, TW), np.uint8)
    for rd, c_, _ in RDS: cv2.polylines(road0, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, max(3, int((1.6 if not close else 0.5) * s)), cv2.LINE_8, shift=2)
    for rd, _ in RAILS: cv2.polylines(road0, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, max(3, int((1.4 if not close else 0.45) * s)), cv2.LINE_8, shift=2)
    # ---------------- woods ----------------
    LOG("  woods ...")
    wd = cfg.get("woods", 0.0); LOG("  alluvial %.3f creeks %d" % (float(alluv.mean()), len(creek_lines)))
    ws_ = cfg.get("wood_scale", 1.0) if PROJ else 1.0   # project mode: >1 = smaller, more numerous woods (wide maps of small boxes)
    fm = fbm(TH, TW, 6, int(round(5 * ws_)), seed + 2)
    fm2 = fbm(TH, TW, 3, int(bw / (14 if not close else 1.6) * ws_), seed + 12)
    swamp = alluv * np.clip((dist_t - hw_t - (3.0 if close else 7.0)) / (4.0 if close else 10.0), 0, 1) * cfg.get("swamp", 0.1) * np.clip(cv2.resize(fbm(TH // 8, TW // 8, 3, int(bw / (6 if close else 40)), seed + 95), (TW, TH)) * 2.2 - 0.5, 0, 1.4)   # back-swamp woods away from the rivers, in patches
    if close:
        jag = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.7), seed + 60), (TW, TH))
        fbase = np.maximum(fm * 0.7 + fm2 * 0.3 + near * 0.12 + slope * cfg.get("ravine_woods", 0.5) - 0.72, fm2 * 0.85 + fm * 0.2 - 0.69) + (jag - 0.5) * 0.16 + wd + swamp
        del jag
    else:
        fm3 = fbm(TH, TW, 4, int(bw / 18 * ws_), seed + 13)
        nk_, sk_ = (cfg.get("wide_near_k", 0.12), cfg.get("wide_slope_k", 0.3)) if PROJ else (0.12, 0.3)   # project: woods biased to river valleys / steep ground
        fbase = np.maximum(fm * 0.7 + fm2 * 0.3 + near * nk_ + slope * sk_ - WT[0], fm3 * 0.55 + fm * 0.45 - WT[1]) + wd + swamp
        del fm3
    forest = np.clip(fbase * 12, 0, 1); del fbase, fm2, swamp
    MARSH = None
    if PROJ and cfg.get("swamp_band"): forest, MARSH = swamp_band(cfg["swamp_band"], G, forest, box, TW, TH, s, seed)
    if SEA is not None: sea_t = cv2.resize(SEA, (TW, TH), interpolation=cv2.INTER_LINEAR); forest *= (sea_t < 0.3)
    forest *= (1 - road0.astype(np.float32) / 255)
    forest *= (1 - cv2.GaussianBlur(townmask, (0, 0), 0.006 * TW)); forest *= (dist_t > hw_t + (0.6 if not close else 0.10))
    for pb in cfg.get("features", {}).get("pontoons", []):   # clear the woods either side of each pontoon crossing
        pass
    if close:
        holes = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 1.4), seed + 61), (TW, TH)); forest *= (holes < 0.78); del holes
    forest = (cv2.GaussianBlur(forest, (0, 0), 0.5 if close else 0.3 * TW / 4096) > 0.5).astype(np.float32)
    forest = cv2.GaussianBlur(forest, (0, 0), 0.7 if close else 0.6 * TW / 4096)
    if PROJ and cfg.get("wood_soft"):   # project mode: softer, lighter wood patches (blur x k, paint opacity a; the canopy height keeps the full mask)
        ws = cfg["wood_soft"]; forest_paint = cv2.GaussianBlur(forest, (0, 0), ws.get("blur_u", 1.5) * s) * ws.get("alpha", 0.5)
    else: forest_paint = forest
    LOG("  forest cover %.3f" % float((forest > 0.5).mean()))
    crown = fbm(TH, TW, 2, int(bw / ((cfg.get("crown_u", 0.6) if PROJ else 0.6) if not close else 0.09)), seed + 3)   # project: crown_u = canopy speckle size (units) on wide maps
    fdark = cv2.GaussianBlur(forest, (0, 0), 0.004 * TW)
    fcol = (hexc("#2e4645") if close else hexc("#192e32"))[None, None] * (0.78 + 0.44 * crown[..., None]) * (1.08 - 0.16 * fdark[..., None])
    if WINTER: fcol = winter_woods(fcol, crown, close, TW, TH, bw, seed)
    img = img * (1 - forest_paint[..., None]) + fcol * forest_paint[..., None]; del fcol, crown, fdark
    ao = np.clip(cv2.GaussianBlur(forest_paint, (0, 0), 0.0025 * TW) - forest_paint, 0, 1); img *= (1 - 0.45 * ao)[..., None]; del ao, forest_paint
    # cane brakes: pale yellow-green speckled thickets in bands along the alluvial rivers / bayous (not on fields near towns)
    cane = None
    if cfg.get("cane", 0) > 0:
        band = np.clip(1 - np.abs(dist_t - hw_t - (1.2 if close else 4.0)) / (1.0 if close else 3.5), 0, 1) * alluv
        cn = cv2.resize(fbm(TH // 4, TW // 4, 4, int(bw / (2.0 if close else 25)), seed + 80), (TW, TH))
        cane = np.clip((band * cfg["cane"] + (cn - 0.55) * 1.2) * 4, 0, 1) * (1 - forest) * (1 - cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)) * (1 - road0 / 255.0)
        sp = cv2.resize(fbm(TH // 2, TW // 2, 2, int(bw / (0.12 if close else 1.0)), seed + 81), (TW, TH))
        ccol = hexc("#7d8452")[None, None] * (0.8 + 0.35 * sp[..., None])
        img = img * (1 - 0.85 * cane[..., None]) + ccol * 0.85 * cane[..., None]; del band, cn, sp, ccol
    # river banks + floodplain + dark bank line
    flood = np.clip(1 - (dist_t - hw_t) / (6.0 if not close else 1.0), 0, 1)[..., None] * (1 - forest[..., None])
    img = img * (1 - 0.22 * flood) + (hexc("#6f7a62") if not close else hexc("#7f8462")) * 0.22 * flood
    bank = np.clip(1 - (dist_t - hw_t) / (0.7 if not close else 0.12), 0, 1)[..., None]
    bank *= (0.6 if close else 0.35); img = img * (1 - bank) + hexc("#5c5c4a") * bank
    bline = np.clip(1 - np.abs(dist_t - hw_t) / (0.35 if not close else 0.045), 0, 1)[..., None] * (0.0 if not close else 0.85)
    img = img * (1 - bline) + hexc("#33392f") * bline; del flood, bank, bline
    # wide: the water itself painted under the ribbon (reads from altitude even where the ribbon is thin)
    # creeks: thin dark blue-grey lines with a damp green margin
    if creek_lines:
        cr = np.zeros((TH, TW), np.float32); cm2 = np.zeros((TH, TW), np.float32)
        for A in creek_lines:
            C = chaikin(A[:, :2], 3)
            if close: C = meander(densify(C, 0.1), [], amp=0.1, wl=1.2, seed=int(A[0, 0] * 7))
            Pp = np.round(np.array([Pt(p) for p in C], np.float32) * 4).astype(np.int32)
            wpx = (0.05 + min(A[:, 2].mean(), 60) * 0.0012) * s if close else (0.25 + min(A[:, 2].mean(), 200) * 0.0015) * s
            cv2.polylines(cr, [Pp], False, 1.0, max(1, int(wpx)), cv2.LINE_AA, shift=2)
            cv2.polylines(cm2, [Pp], False, 1.0, max(2, int(wpx * 5)), cv2.LINE_AA, shift=2)
        cm2 = cv2.GaussianBlur(cm2, (0, 0), 0.08 * s if close else 0.5 * s)[..., None] * 0.18 * (1 - forest[..., None])
        img = img * (1 - cm2) + hexc("#6c7a5a") * cm2
        cr = cv2.GaussianBlur(cr, (0, 0), 0.7)[..., None] * (0.9 if close else 0.7)
        img = img * (1 - cr) + hexc("#3b4a4c") * cr; del cr, cm2
    # lakes (geo polygons only; no modern reservoirs)
    for e in cfg.get("lakes", []):
        L = resolve_line(G, e, "lakes")
        if L is None: continue
        lm = np.zeros((TH, TW), np.uint8); cv2.fillPoly(lm, [np.round(np.array([Pt(p) for p in L]) * 4).astype(np.int32)], 255, cv2.LINE_AA, shift=2)
        lm = cv2.GaussianBlur(lm.astype(np.float32) / 255, (0, 0), 1.0)[..., None]; img = img * (1 - lm) + hexc("#3e5560") * lm
    if MARSH is not None: img = paint_marsh(img, MARSH, forest, TW, TH, bw, seed, cfg.get("swamp_band", {}))
    if PROJ and cfg.get("river_halo_u") and not close:   # project mode (wide): paint water just past the ribbon edge so the rivers read bolder from altitude
        hl = np.clip(1 - (dist_t - hw_t) / cfg["river_halo_u"], 0, 1)[..., None] * 0.9
        img = img * (1 - hl) + hexc(cfg.get("river_halo_col", "#4d6876")) * hl; del hl
    sea_w = sea_t.copy() if (WINTER and SEA is not None) else None   # winter: no snow / frost on the sea
    if SEA is not None: img = paint_sea(img, sea_t, close, s, cfg.get("sea_look", {})); del sea_t
    if town: img = paint_town(img, town, Pt, s)
    # ---------------- roads ----------------
    road = np.zeros((TH, TW), np.uint8); rwpx = max(3, int((1.1 if not close else 0.32) * s))
    for rd, c_, _ in RDS:
        wpx = rwpx if (not close and c_ == "pike") or (close and c_ == "pike") else (max(2, int(0.7 * s)) if not close else max(3, int(0.2 * s)))
        cv2.polylines(road, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, wpx, cv2.LINE_AA, shift=2)
    if town:
        for st, wdt in town["streets"]: cv2.polylines(road, [np.round(np.array([Pt(p) for p in st], np.float32) * 4).astype(np.int32)], False, 255, max(3, int(wdt * s)), cv2.LINE_AA, shift=2)
    if wplan:
        for st, wdt in wplan["streets"]: cv2.polylines(road, [np.round(np.array([Pt(p) for p in st], np.float32) * 4).astype(np.int32)], False, 255, max(2, int(wdt * s)), cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32) / 255
    edge = np.clip(cv2.GaussianBlur(cv2.dilate(road, np.ones((3, 3), np.uint8), iterations=1 if close else 2).astype(np.float32) / 255, (0, 0), 0.8) - rdm, 0, 1)[..., None]
    img = img * (1 - 0.5 * edge) + hexc("#4a3a2e") * 0.5 * edge; del edge
    rdm = rdm[..., None]; rcol = hexc("#8a5a44") if close else hexc("#7e5644")
    if WINTER: rcol = hexc(WINTER.get("road_col", "#7a5c48" if close else "#735646")); road_w = rdm[..., 0].copy()   # muddy / frozen ruts: less red
    rdm = rdm * (1.0 if close else 0.9) * (0.85 + 0.3 * cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.5), seed + 71), (TW, TH))[..., None]).clip(0, 1.15)
    img = img * (1 - rdm) + rcol * (1 + (cv2.resize(fbm(TH // 8, TW // 8, 3, 40, seed + 70), (TW, TH))[..., None] - 0.5) * 0.18) * rdm; del rdm, road
    tg = cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)[..., None] * (0.18 if not close else 0.0); img = img * (1 - tg) + hexc("#8c7b66") * tg; del tg
    # ---------------- railroads: dark ballast line with ties (distinct from the rust roads) ----------------
    for rd, _ in RAILS:
        Pp = np.array([Pt(p) for p in rd], np.float32)
        bal = np.zeros((TH, TW), np.uint8); ties = np.zeros((TH, TW), np.uint8)
        cv2.polylines(bal, [np.round(Pp * 4).astype(np.int32)], False, 255, max(2, int((0.09 if close else 0.45) * s)), cv2.LINE_AA, shift=2)
        arc = np.r_[0, np.cumsum(np.hypot(*np.diff(rd, axis=0).T))]; step = 0.075 if close else 1.0; tl = (0.12 if close else 0.75) / 2
        for a in np.arange(step / 2, arc[-1], step):
            i = min(int(np.searchsorted(arc, a)), len(rd) - 1); t = rd[min(i + 1, len(rd) - 1)] - rd[max(i - 1, 0)]; t /= np.linalg.norm(t) + 1e-6
            nn = np.array([-t[1], t[0]]); p1, p2 = Pt(rd[i] + nn * tl), Pt(rd[i] - nn * tl)
            cv2.line(ties, (int(p1[0] * 4), int(p1[1] * 4)), (int(p2[0] * 4), int(p2[1] * 4)), 255, max(1, int((0.022 if close else 0.18) * s)), cv2.LINE_AA, shift=2)
        bed = cv2.GaussianBlur(cv2.dilate(bal, np.ones((3, 3), np.uint8), iterations=2).astype(np.float32) / 255, (0, 0), 1.0)[..., None] * 0.45
        img = img * (1 - bed) + hexc("#9a8c74") * bed   # pale graded bed
        tf = cv2.GaussianBlur(ties.astype(np.float32) / 255, (0, 0), 0.5)[..., None] * 0.8; img = img * (1 - tf) + hexc("#3a3028") * tf
        bf = cv2.GaussianBlur(bal.astype(np.float32) / 255, (0, 0), 0.5)[..., None] * 0.85; img = img * (1 - bf) + hexc("#2e2a27") * bf
        del bal, ties, bed, tf, bf
    # ---------------- earthworks: pale raw-earth parapet, dark ditch outside, pale spoil ----------------
    for W_ in WORKS:
        e = W_["e"]; L = W_["pts"]
        nrm = np.gradient(L, axis=0); nrm = np.stack([nrm[:, 1], -nrm[:, 0]], 1) / (np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-6)   # front = right-hand side (engine convention)
        sc = (1.0 if close else 6.0) * e.get("scale", 1.0)
        for dx_, wd_, col_, a_ in ((0.0, 0.14, "#a48a64", 0.8), (0.17, 0.09, "#3e3326", 0.75), (0.32, 0.16, "#9a8462", 0.45)):
            sp = np.zeros((TH, TW), np.uint8); Q = L + nrm * dx_ * sc
            cv2.polylines(sp, [np.round(np.array([Pt(p) for p in Q]) * 4).astype(np.int32)], False, 255, max(2, int(wd_ * sc * s)), cv2.LINE_AA, shift=2)
            spf = cv2.GaussianBlur(sp.astype(np.float32) / 255, (0, 0), 1.2)[..., None] * a_; img = img * (1 - spf) + hexc(col_) * spf
        W_["nrm"] = nrm
    if WINTER: img = winter_ground(img, forest, road_w, dist_t, hw_t, close, TW, TH, bw, s, seed, WINTER, sea_w); del road_w, sea_w
    # ---------------- baked relief shading ----------------
    shade = np.ones((TH, TW), np.float32)
    sun = np.array([-0.7, 0.48, -0.4], np.float32); sun /= np.linalg.norm(sun)
    for sig, wgt in ((0.0015, 0.22), (0.005, 0.6)) if not close else ((0.004, 0.6), (0.012, 0.4)):
        hb = cv2.GaussianBlur(ht, (0, 0), sig * TW) * exag / MPU
        dz, dx = np.gradient(hb); dx *= s; dz *= s
        lam = (-dx * sun[0] + sun[1] - dz * sun[2]) / np.sqrt(dx * dx + 1 + dz * dz)
        shade += wgt * (np.clip(lam, 0, 1) / sun[1] - 1); del hb, dz, dx, lam
    if not close:
        k = cfg.get("relief_k", 0.9) if PROJ else 0.9; img *= (1 + k * (shade - 1))[..., None]
        vt = np.clip(1 - (dist_t - hw_t - 6.0) / 18.0, 0, 1)
        lit = np.clip((shade - 1.02) * 3.0, 0, 1)[..., None] * (1 - 0.8 * forest[..., None]) * (0.25 + 0.75 * vt[..., None])
        lk_ = cfg.get("lit_k", 0.85) if PROJ else 0.85
        img = img * (1 - lk_ * lit) + hexc(WINTER.get("lit_col", "#c4c5bc") if WINTER else "#bcbe8a") * 1.12 * lk_ * lit; del lit, vt   # winter: frost-pale (not yellow) sunlit slopes
        img *= np.array([0.9, 0.95, 0.98], np.float32)
    else: img *= (1 + 0.5 * (shade - 1))[..., None]
    del shade, ht
    img = np.clip(img + (fbm(TH, TW, 3, 60, seed + 9)[..., None] - 0.5) * 6, 0, 255)
    if not close: lum = img.mean(-1, keepdims=True); img = np.clip(img * 0.92 + lum * 0.08, 0, 255); del lum
    if PROJ and cfg.get("tex_grade"):   # project mode: richer ground (contrast about the mean, saturation, gamma); Vicksburg never sets it
        tg_ = cfg["tex_grade"]; mu = img.reshape(-1, 3).mean(0)
        img = (img - mu) * tg_.get("contrast", 1.0) + mu * tg_.get("level", 1.0)
        lum = img.mean(-1, keepdims=True); img = lum + (img - lum) * tg_.get("sat", 1.0); del lum
        img = 255.0 * (np.clip(img, 0, 255) / 255.0) ** tg_.get("gamma", 1.0)
    img8 = np.clip(img, 0, 255)[..., ::-1].astype(np.uint8); del img
    cv2.imwrite(f"{out}/ground.jpg", img8, [cv2.IMWRITE_JPEG_QUALITY, cfg.get("jpeg_q", 88 if close else 90)])
    LOG("  ground.jpg %.1f MB" % (os.path.getsize(f"{out}/ground.jpg") / 1e6))
    # ---------------- heightmap: canopy + earthwork berms ----------------
    fh = cv2.resize(cv2.GaussianBlur(forest, (0, 0), (0.0012 if not close else 0.0010) * TW), (HW, HH), interpolation=cv2.INTER_AREA)
    h = h + fh * (9.0 if not close else 3.0)
    if cane is not None:
        h = h + cv2.resize(cv2.GaussianBlur(cane, (0, 0), 0.002 * TW), (HW, HH), interpolation=cv2.INTER_AREA) * (1.4 if close else 3.0)
    if WORKS:
        bm = np.zeros((HH, HW), np.float32)
        for W_ in WORKS:
            Q = np.round((W_["pts"] - [x0, y0]) * upx_h * 4).astype(np.int32)
            cv2.polylines(bm, [Q], False, float(W_["e"].get("height", 1.0 if close else 2.5)), max(2, int((0.45 if close else 2.0) * upx_h)), cv2.LINE_AA, shift=2)
        h += cv2.GaussianBlur(bm, (0, 0), max(0.6, 0.12 * upx_h))
    q = np.clip(np.round((h + 20) * 200), 0, 65535).astype(np.uint16)
    cv2.imwrite(f"{out}/height.png", np.dstack([np.zeros_like(q, np.uint8), (q & 255).astype(np.uint8), (q >> 8).astype(np.uint8)]))
    # ---------------- trees (close) ----------------
    trees = []
    if close:
        win = cfg.get("tree_window") or [x0 + 1.5, x0 + bw - 1.5, y0 + 1.5, y0 + bh - 1.5]; spacing = cfg.get("tree_spacing", 0.17)
        fb = cv2.resize((forest > 0.5).astype(np.uint8), (TW // 2, TH // 2), interpolation=cv2.INTER_NEAREST)
        fin = cv2.distanceTransform(fb, cv2.DIST_L2, 5) / (s / 2)
        gxs = np.arange(win[0], win[1], spacing); gys = np.arange(win[2], win[3], spacing * 0.87)
        Gd = np.array([(x + (0.5 * spacing if j % 2 else 0), y) for j, y in enumerate(gys) for x in gxs], np.float32)
        Gd += r.uniform(-0.42, 0.42, Gd.shape).astype(np.float32) * spacing
        fval = sample(cv2.resize(forest, (TW // 2, TH // 2), interpolation=cv2.INTER_AREA), box, Gd)
        fin_g = sample(fin, box, Gd); keep = r.random(len(Gd)) < np.clip((fval - 0.45) * 3.5, 0, 1) * np.where(fin_g > 0.5, 0.62, 1.0)
        T = Gd[keep]; e_ = np.clip(sample(fin, box, T) / 0.7, 0, 1)
        kind = (r.random(len(T)) < 0.02).astype(int)
        sc = np.exp(r.normal(0.12, 0.22, len(T))).clip(0.6, 1.9) * (0.9 + 0.15 * e_)
        lists = [(T, kind, sc, r.uniform(0, 1, len(T)), e_)]
        if hedge_pts is not None:
            HP = hedge_pts[:, :2] / s + [x0, y0]; hk_ = hedge_pts[:, 2].astype(int)
            ok = (sample(dist, box, HP) > sample(hw, box, HP) + 0.25)
            ok &= (sample(cv2.resize(townmask + road0.astype(np.float32) / 255, (TW // 2, TH // 2)), box, HP) < 0.2)
            ok &= sample(cv2.resize(forest, (TW // 2, TH // 2)), box, HP) < 0.3
            if cane is not None: ok &= sample(cv2.resize(cane, (TW // 2, TH // 2)), box, HP) < 0.3
            ok &= (HP[:, 0] > win[0]) & (HP[:, 0] < win[1]) & (HP[:, 1] > win[2]) & (HP[:, 1] < win[3])
            HP, hk_ = HP[ok], hk_[ok]
            lists.append((HP.astype(np.float32), hk_, np.where(hk_ == 2, r.uniform(0.7, 1.25, len(HP)), r.uniform(0.8, 1.3, len(HP))), r.uniform(0, 1, len(HP)), np.zeros(len(HP))))
        if town and town["trees"]:
            TT = np.array(town["trees"], np.float32); lists.append((TT[:, :2], np.full(len(TT), 3), TT[:, 2], r.uniform(0, 1, len(TT)), np.zeros(len(TT))))
        for T_, k_, s_, c_, ev_ in lists:
            if PROJ and SEA is not None and len(T_):   # project mode: no hedge / lone trees on the sea
                ok_ = sample(SEA, box, np.asarray(T_, np.float32)) < 0.3; T_, k_, s_, c_, ev_ = T_[ok_], np.asarray(k_)[ok_], np.asarray(s_)[ok_], np.asarray(c_)[ok_], np.asarray(ev_)[ok_]
            th_ = sample(h, box, T_)
            trees += [[round(float(a), 3), round(float(b), 3), round(float(c), 1), int(k), round(float(sv), 2), round(float(f), 2), round(float(ev), 2)] for (a, b), c, k, sv, f, ev in zip(T_, th_, k_, s_, c_, ev_)]
    # ---------------- houses ----------------
    houses = []
    if wplan:
        HP_ = np.array([[q_[0], q_[1]] for q_ in wplan["houses"]], np.float32).reshape(-1, 2); hh_ = sample(h, box, HP_)
        houses = [[round(px, 3), round(py, 3), round(float(z), 1), round(w_, 3), round(d_, 3), round(rot, 3), rc, 0] for (px, py, w_, d_, rot, rc), z in zip(wplan["houses"], hh_)]
    elif town:
        HP_ = np.array([[b[0], b[1]] for b in town["build"]], np.float32).reshape(-1, 2); hh_ = sample(h, box, HP_)
        houses = [[round(px, 3), round(py, 3), round(float(z), 1), round(w_, 3), round(d_, 3), round(-ang, 3), int(rc), int(kd)] for (px, py, w_, d_, ang, rc, kd), z in zip(town["build"], hh_)]
    # ---------------- features ----------------
    feat = {"bridges": [], "pontoons": [], "works": [], "batteries": [], "ferries": []}
    def river_at(p, maxd=3.0, include_wide=False):
        best = None
        for rv in rivs:
            if rv["w"] >= 2.5 and not include_wide: continue
            A = np.array(rv["pts"], np.float32); dd = np.hypot(A[:, 0] - p[0], A[:, 1] - p[1]); i = int(dd.argmin())
            if dd[i] < maxd and (best is None or dd[i] < best[0]): best = (dd[i], rv, A, i)
        return best
    def bridge_at(p, kind, name, burn=False, length=None):
        b = river_at(p)
        if b is None: return None
        _, rv, A, i = b; t_ = A[min(i + 2, len(A) - 1), :2] - A[max(i - 2, 0), :2]; t_ /= np.linalg.norm(t_) + 1e-6
        wl = float(A[i, 2]); ring = np.array([A[i, :2] + [math.cos(a) * (rv["w"] / 2 + 0.6), math.sin(a) * (rv["w"] / 2 + 0.6)] for a in np.linspace(0, 6.28, 16)], np.float32)
        bank_h = float(np.percentile(sample(h, box, ring), 70))
        return dict(name=name, kind=kind, x=round(float(A[i, 0]), 3), z=round(float(A[i, 1]), 3), angle=round(math.atan2(t_[1], t_[0]) + math.pi / 2, 4),
                    len=round(length or max(1.0, rv["w"] * 1.08 * 1.6 + 1.0), 3), wl=round(wl, 2), deck=round(max(bank_h, wl + 4) + 1.0, 2), river=rv["name"], burn=burn)
    done_b = []
    for b in bridges_cfg:
        p = resolve_pt(G, b)
        if p is None: continue
        bb = bridge_at(p, b.get("kind", "road"), b.get("name", "bridge"), b.get("burn", False), b.get("len"))
        if bb: feat["bridges"].append(bb); done_b.append((bb["x"], bb["z"]))
    if cfg.get("auto_bridges", True):   # every road / railroad crossing of a ribbon river (not the Mississippi)
        for (lines, kind) in (([(rd, nm) for rd, c_, nm in RDS if c_ != "lane" or close], "road"), ([(rd, nm) for rd, nm in RAILS], "rail")):
            for rd, nm in lines:
                for rv in rivs:
                    if rv["w"] >= 2.5: continue
                    for (q_, _, _) in seg_intersections(rd[::2] if close else rd, np.array(rv["pts"], np.float32)[:, :2]):
                        if any(math.hypot(q_[0] - a, q_[1] - b_) < 1.5 for a, b_ in done_b): continue
                        bb = bridge_at(q_, kind, f"{nm} x {rv['name']}")
                        if bb:
                            if not close: bb["len"] = round(max(2.5, rv["w"] * 1.6 + 1.5), 3)
                            feat["bridges"].append(bb); done_b.append((bb["x"], bb["z"]))
    for pb in cfg.get("features", {}).get("pontoons", []):
        p = resolve_pt(G, pb); b = river_at(p, 4.0, include_wide=True)
        if b is None: continue
        _, rv, A, i = b; a_, c_ = A[max(0, i - 3)], A[min(len(A) - 1, i + 3)]; ang = math.atan2(c_[1] - a_[1], c_[0] - a_[0])
        feat["pontoons"].append(dict(name=pb.get("name", "pontoon"), x=round(float(A[i, 0]), 3), z=round(float(A[i, 1]), 3), angle=round(-ang, 4),
                                     len=round(rv["w"] * 1.08 + 0.34, 3), wl=round(float(A[i, 2]), 2), river=rv["name"]))
    for W_ in WORKS:
        e = W_["e"]; hh = sample(h, box, W_["pts"])
        L = W_["pts"][::max(1, int(len(W_["pts"]) / 400))]; hh = hh[::max(1, int(len(W_["pts"]) / 400))]
        feat["works"].append(dict(name=e.get("name", ""), kind=e.get("kind", "breastwork"), side=e.get("side", "cs"), closed=bool(e.get("closed", False)),
                                  height_m=e.get("height", 1.0), pts=[[round(float(a), 3), round(float(b), 3), round(float(c), 2)] for (a, b), c in zip(L, hh)]))
        if e.get("kind") == "battery":
            c_ = W_["pts"].mean(0); nv = W_["nrm"].mean(0)
            feat["batteries"].append(dict(name=e.get("name", ""), x=round(float(c_[0]), 3), z=round(float(c_[1]), 3), h=round(float(sample(h, box, c_[None])[0]), 1),
                                          face=round(math.atan2(nv[1], nv[0]), 3), guns=e.get("guns", 3)))
    towns_out = {}
    for t in cfg.get("towns", []):
        p = resolve_pt(G, t)
        if p is not None and x0 <= p[0] <= x0 + bw and y0 <= p[1] <= y0 + bh and not t["name"].startswith("_"): towns_out[t["name"]] = [round(float(p[0]), 2), round(float(p[1]), 2)]
    if wplan:
        for nm, t_ in wplan["towns"]:
            if not nm.startswith("_v"): towns_out[nm] = [round(t_[0], 2), round(t_[1], 2)]
    places = {}
    for k in cfg.get("labels", []):
        p = resolve_pt(G, {"geo": k, "prefer": "places"}) if isinstance(k, str) else resolve_pt(G, dict(k, prefer="places"))
        nm = k if isinstance(k, str) else k["name"]
        if p is not None: places[nm] = [round(float(p[0]), 2), round(float(p[1]), 2)]
    if PROJ: exag = round(exag * PROJ.engine_mpu / MPU, 4)   # the engine lifts heights by exag / GM3D_GEO.mpu: keep the relief true to this region's metres per unit
    D = dict(name=rname, kind="close" if close else "wide", box=list(box), hm=[HW, HH], tex=[TW, TH], exag=exag, meshDiv=cfg.get("meshDiv", 1.6 if close else 3),
             rivers=rivs, roads=[dict(name=nm, cls=c_, pts=[[round(float(a), 2 if not close else 3), round(float(b), 2 if not close else 3)] for a, b in rd[::(3 if close else 2)]]) for rd, c_, nm in RDS if c_ != "lane" or close],
             railroads=[dict(name=nm, pts=[[round(float(a), 3), round(float(b), 3)] for a, b in rd[::3]]) for rd, nm in RAILS],
             trees=trees, houses=houses, towns=towns_out, places=places, features=feat)
    if PROJ: D["frame"] = PROJ.frame_info(CUR_ZOOM, list(box)); D["exag_cfg"] = cfg.get("exag", 6.0 if close else 14.0)
    if PROJ and cfg.get("wideSunK") is not None: D["wideSunK"] = cfg["wideSunK"]
    if PROJ and cfg.get("detail"): D["detail"] = cfg["detail"]   # engine: procedural ground detail near the camera (opt-in)
    if WINTER: D["season"] = "winter"; D["winter"] = {k: v for k, v in WINTER.items() if k in ("ice", "floes", "trees")}   # engine: bare woods, ice on the rivers
    # compatibility with the clip's world.js (single bridge / pontoons / breastworks)
    rb = [b for b in feat["bridges"] if b.get("burn")] or [b for b in feat["bridges"] if b["kind"] == "rail"]
    if rb: D["bridge"] = {k: rb[0][k] for k in ("x", "z", "angle", "len", "wl", "deck")}
    if feat["pontoons"]: D["pontoons"] = [{k: p[k] for k in ("x", "z", "angle", "len", "wl")} for p in feat["pontoons"]]
    bwk = [w for w in feat["works"] if w["kind"] in ("breastwork", "breastworks", "parapet")]
    if bwk: D["breastworks"] = bwk[0]["pts"]
    js = f'(window.GM3D_REGIONS = window.GM3D_REGIONS || {{}})["{rname}"] = ' + json.dumps(D, separators=(",", ":"), default=lambda o: o.item() if hasattr(o, "item") else float(o)) + ";\n"
    open(f"{out}/region.js", "w").write(js)
    tot = sum(os.path.getsize(f"{out}/{f}") for f in ("height.png", "ground.jpg", "region.js"))
    LOG(f"  {rname}: trees {len(trees)} houses {len(houses)} rivers {len(rivs)} roads {len(RDS)} rails {len(RAILS)} bridges {len(feat['bridges'])} works {len(feat['works'])}"
        f" | bundle {tot / 1e6:.2f} MB | {time.time() - t0:.0f} s")
    if preview: make_preview(rname, D, out, cfg)
    return D


# ============================================================ project-mode look helpers (period ground; gm_look untouched) ============================================================
WINTER = None   # set per region by bake() from cfg "season": "winter" (+ optional cfg "winter": {...} tuning); None = the approved summer look


def winter_woods(fcol, crown, close, TW, TH, bw, seed):
    """bare deciduous woods: the same dark speckled canopy mass, but a dark grey-brown twig colour (low chroma) with scattered conifer
    (cedar / pine) clumps that keep the teal"""
    bare = hexc("#433d37" if close else WINTER.get("wood_col", "#34403f"))[None, None] * ((0.86 + 0.28 * crown[..., None]) if close else (1 - 0.26 * WINTER.get('crown_k', 1.0) + 0.52 * WINTER.get('crown_k', 1.0) * crown[..., None]))   # wide: the Jackson canopy speckle contrast   # wide: dark teal-grey (critic A r1: Jackson-like wood mass)
    con = np.clip((cv2.resize(fbm(TH // 8, TW // 8, 3, int(bw / (1.2 if close else 10)), seed + 501), (TW, TH)) - (0.62 if close else 0.62 - 0.6 * (WINTER.get("conifers_wide", 0.4) - 0.16))) * 6, 0, 1)[..., None]
    return bare * (1 - con) + fcol * con


def winter_ground(img, forest, road, dist_t, hw_t, close, TW, TH, bw, s, seed, W, sea=None):
    """late-December ground, the same film in winter: the field mosaic kept (same texture density and warm/cool field contrast), a little
    greyer and lighter (dormant grass, frozen stubble), a THIN snow / frost dusting that lies in the furrows and hollows (never a white sheet),
    fading in soft large patches, none under the woods or on the roads; a frost rim on the river banks"""
    k = W.get("k", 1.0); img0 = img
    lum = img.mean(-1, keepdims=True)
    # 1) dormant ground: desaturate a little, cool slightly, lift
    g = lum + (img - lum) * (1 - W.get("desat", 0.35) * k)
    g = g * np.array([1.0 - 0.035 * k, 1.0, 1.0 + 0.045 * k], np.float32) * (1 + 0.04 * k) + 4 * k
    # 2) frost / thin snow: fine dusting in the furrows + soft large-scale variation (no blotches)
    m1 = cv2.resize(fbm(TH // 8, TW // 8, 3, int(bw / (8 if close else 80)) + 2, seed + 511), (TW, TH))
    m2 = cv2.resize(fbm(TH // 2, TW // 2, 3, int(bw / (0.25 if close else 2.5)) + 2, seed + 512), (TW, TH))
    cov = np.clip(0.35 + (m1 - 0.5) * 0.9 + (W.get("snow", 0.55) - 0.55), 0, 1)
    fine = cv2.GaussianBlur(img.mean(-1), (0, 0), 0.6); hol = np.clip((cv2.GaussianBlur(fine, (0, 0), 3.0) - fine) / 8 + 0.5, 0, 1)   # furrows / hollows hold the snow
    snow = cov * np.clip(0.5 + 0.5 * hol + (m2 - 0.5) * 0.5, 0, 1) * W.get("snow_alpha", 0.5)
    snow *= (1 - 0.9 * forest) * (1 - 0.85 * road)
    snow *= np.clip((dist_t - hw_t) / (0.08 if close else 0.6), 0, 1)   # not on the water
    snow = snow[..., None]; scol = hexc(W.get("snow_col", "#c4c5bd"))[None, None]
    g = g * (1 - snow) + scol * snow
    # 3) frost rim on the banks (shore ice / frozen mud)
    rim = np.clip(1 - np.abs(dist_t - hw_t - (0.05 if close else 0.4)) / (0.10 if close else 0.6), 0, 1)[..., None] * 0.35 * W.get("ice", 1.0)
    g = g * (1 - rim) + hexc("#b9c0c2") * rim
    if sea is not None:   # the painted sea stays as it was (no grey-down, no snow)
        sm = np.clip((sea - 0.35) * 3.3, 0, 1)[..., None]; g = g * (1 - sm) + img0 * sm
    return np.clip(g, 0, 255)


def _river_coords(L, box, TW, TH, s, f=4):
    """for every texel (at 1/f resolution): arc length along polyline L (map units), signed distance (units, + = left of the flow), nearest index"""
    x0, y0 = box[:2]; w4, h4 = TW // f, TH // f; s4 = s / f
    L = densify(np.asarray(L, np.float32), 0.5 / s4); arc = np.r_[0, np.cumsum(np.hypot(*np.diff(L, axis=0).T))]
    pix = np.round((L - [x0, y0]) * s4).astype(np.int64); ok = (pix[:, 0] >= 0) & (pix[:, 0] < w4) & (pix[:, 1] >= 0) & (pix[:, 1] < h4)
    img = np.ones((h4, w4), np.uint8); img[pix[ok, 1], pix[ok, 0]] = 0
    d, lab = cv2.distanceTransformWithLabels(img, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    lut = np.zeros(int(lab.max()) + 1, np.int64); idx = np.nonzero(ok)[0]; lut[lab[pix[idx, 1], pix[idx, 0]]] = idx
    ii = lut[lab]; T = np.gradient(L, axis=0); T /= np.linalg.norm(T, axis=1, keepdims=True) + 1e-6
    yy, xx = np.mgrid[0:h4, 0:w4].astype(np.float32); px = (xx + 0.5) / s4 + x0 - L[ii, 0]; py = (yy + 0.5) / s4 + y0 - L[ii, 1]
    side = np.sign(T[ii, 0] * py - T[ii, 1] * px)   # the two banks get opposite signs
    return arc[ii].astype(np.float32), (d / s4 * side).astype(np.float32), ii, L


def longlot_labels(cfg_l, G, box, TW, TH, s, seed):
    """French long lots (arpent strips) along a river: strips perpendicular to the bank (frontage `w` units +- 40 %), cut into fields every
    `depth` units, out to `max_d` units; beyond = ordinary label noise (covered by the swamp band). Returns (lab, n) for gm_fields."""
    L = gfind(G, "rivers", cfg_l["river"]); arc, sd, _, _ = _river_coords(curvy(np.asarray(L, np.float32)), box, TW, TH, s)
    rr = np.random.default_rng(seed + 7); lab = np.zeros(arc.shape, np.int64); amax = float(arc.max()) + 1
    for k_, sg in enumerate((1, -1)):
        b = np.cumsum(rr.uniform(0.6, 1.4, int(amax / cfg_l.get("w", 1.4) * 2) + 10) * cfg_l.get("w", 1.4)); b = b[b < amax + 5]
        si = np.searchsorted(b, arc)
        dep = cfg_l.get("depth", 2.6) * rr.uniform(0.75, 1.3, len(b) + 1)[si]
        di = np.floor(np.maximum(np.abs(sd) - cfg_l.get("bank", 3.2), 0) / dep).astype(np.int64)
        m = np.sign(sd) == sg; lab[m] = (k_ * 100000 + si[m] * 64 + np.minimum(di[m], 63)) + 1
    _, lab = np.unique(lab, return_inverse=True); lab = lab.reshape(arc.shape).astype(np.int32)
    lab = cv2.resize(lab, (TW, TH), interpolation=cv2.INTER_NEAREST); return lab, int(lab.max()) + 1


def swamp_band(cb, G, forest, box, TW, TH, s, seed):
    """Lower-Mississippi plantation strip: no woods within `from` units of the river (fields to the levee), a cypress swamp band from `from`
    to `to` units (ragged edges), open marsh beyond with a few wooded hummocks. Returns (forest, marsh mask)."""
    L = gfind(G, "rivers", cb["river"]); _, sd, ii, Ld = _river_coords(curvy(np.asarray(L, np.float32)), box, TW, TH, s)
    d = np.abs(sd); h4, w4 = d.shape; rx = Ld[ii, 0]   # map x of the nearest river point: from_x / to_x vary the band along the river
    prof = lambda key, dflt: (np.interp(rx, [q[0] for q in cb[key + "_x"]], [q[1] for q in cb[key + "_x"]]) if key + "_x" in cb else cb.get(key, dflt))
    j1 = (fbm(h4, w4, 4, int(box[2] / 3), seed + 301) - 0.5) * cb.get("jag", 3.0); j2 = (fbm(h4, w4, 4, int(box[2] / 4), seed + 302) - 0.5) * cb.get("jag", 3.0) * 1.4
    a, b = prof("from", 9.5) + j1, prof("to", 15.0) + j2
    band = ((d > a) & (d < b)).astype(np.float32)
    hum = (fbm(h4, w4, 4, int(box[2] / 1.2), seed + 303) > cb.get("hummock", 0.68)).astype(np.float32) * (d >= b)
    near = (d <= a).astype(np.float32) * cb.get("keep_near", 0.0)
    f4 = cv2.resize(forest, (w4, h4), interpolation=cv2.INTER_AREA)
    f4 = np.maximum(f4 * near, np.maximum(band, hum)) if True else f4
    marsh = cv2.GaussianBlur((d >= b).astype(np.float32) * (1 - hum), (0, 0), 1.0)
    return cv2.resize(f4, (TW, TH), interpolation=cv2.INTER_LINEAR), cv2.resize(marsh, (TW, TH), interpolation=cv2.INTER_LINEAR)


def paint_marsh(img, marsh, forest, TW, TH, bw, seed, cb=None):
    """open marsh: pale olive-tan sedge with darker streaks and small dark pools (Lake Borgne side of the swamp)"""
    m = (marsh * (1 - forest))[..., None]
    n1 = cv2.resize(fbm(TH // 4, TW // 4, 4, int(bw / 1.5), seed + 310), (TW, TH)); n2 = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.35), seed + 311), (TW, TH))
    cb = cb or {}
    col = hexc(cb.get("marsh_col", "#8f8c66"))[None, None] * (0.86 + 0.26 * n1[..., None]) * (0.95 + 0.1 * n2[..., None])
    col = col * (1 - 0.35 * np.clip((n2 - 0.62) * 6, 0, 1))[..., None] + hexc(cb.get("marsh_dark", "#6c7556")) * 0.35 * np.clip((n2 - 0.62) * 6, 0, 1)[..., None]
    pool = np.clip((n1 * 0.6 + n2 * 0.4 - 0.71) * 14, 0, 1)[..., None]
    col = col * (1 - pool) + hexc("#4d6268") * pool
    return img * (1 - m) + col * m


def paint_sea(img, sea, close, s, look):
    """open water (the Gulf, the lakes, the sounds): flat painted water, a little lighter in the shallows, a dark wet coast line + pale beach"""
    sm = np.clip((sea - 0.35) * 3.3, 0, 1)
    land = (sm < 0.5).astype(np.uint8); dsea = cv2.distanceTransform(1 - land, cv2.DIST_L2, 5) / s   # units into the sea
    dl = cv2.distanceTransform(land, cv2.DIST_L2, 5) / s                                             # units onto the land
    deep, shal = hexc(look.get("deep", "#4b6371")), hexc(look.get("shallow", "#5f7a84"))
    k = np.clip(1 - dsea / look.get("shelf_u", 6.0 if not close else 1.5), 0, 1)[..., None]
    col = deep * (1 - k) + shal * k
    tex = cv2.resize(fbm(max(8, img.shape[0] // 8), max(8, img.shape[1] // 8), 3, 30, 977), (img.shape[1], img.shape[0]))[..., None]
    col = col * (0.97 + 0.06 * tex)
    out = img * (1 - sm[..., None]) + col * sm[..., None]
    beach = np.clip(1 - dl / look.get("beach_u", 0.5 if not close else 0.08), 0, 1)[..., None] * 0.35 * (1 - sm[..., None])
    out = out * (1 - beach) + hexc("#b4a886") * beach
    cl = np.clip(1 - np.abs(dsea - dl) / look.get("line_u", 0.18 if not close else 0.04), 0, 1)[..., None] * 0.55
    return out * (1 - cl) + hexc("#34413f") * cl


def bake_project(rname, G, preview=True):
    """project mode: one region = its own DEM, frame (zoom) and caches"""
    global CUR_ZOOM, TMP, MPU, CPU, CREEK_KM2
    cfg = json.load(open(f"{CFGDIR}/{rname}.json")); close = cfg.get("mode", "close") == "close"
    CUR_ZOOM = cfg.get("zoom", PROJ.zoom); k = PROJ.k(CUR_ZOOM); box = cfg["box"]
    TMP = f"{PROJ.tmp}/{rname}"; os.makedirs(TMP, exist_ok=True)
    MPU = PROJ.mpu(CUR_ZOOM, y=box[1] + box[3] / 2)
    CPU = cfg.get("creek_ppu", 4 if close else 1); CREEK_KM2 = cfg.get("creek_km2", 2.0 if close else 60.0)
    LOG(f"== project {PROJ.name} region {rname}: zoom {CUR_ZOOM} (k {k:g}), {MPU:.1f} m/unit")
    Gr = scale_geo(G, k); P = prep_dem_project(Gr, cfg, close); CR = creek_net(P, Gr)
    D = bake(rname, Gr, P, CR, preview); CUR_ZOOM = None; return D


# ============================================================ works ============================================================
def orient_work(L, e):
    """the engine builds the glacis / ditch on the RIGHT-hand side of the walking direction: closed works run so that side is outside,
    open lines so it faces e['face_to'] (a map point, e.g. the enemy) or e['face'] (deg, 0 = east, 90 = south); 'reverse': true flips"""
    L = np.asarray(L, np.float32)
    if len(L) < 2: return L
    t = np.gradient(L, axis=0); rn = np.stack([t[:, 1], -t[:, 0]], 1)
    if e.get("closed"):
        if ((L - L.mean(0)) * rn).sum() < 0: L = L[::-1]
    elif "face_to" in e or "face" in e:
        d = (np.array(e["face_to"], np.float32) - L.mean(0)) if "face_to" in e else np.array([math.cos(math.radians(e["face"])), math.sin(math.radians(e["face"]))])
        if (rn.mean(0) * d).sum() < 0: L = L[::-1]
    if e.get("reverse"): L = L[::-1]
    return L


def work_shape(c, e):
    """standard plan for a fort given by its centre: redan (V), lunette (V + flanks), redoubt / fort (closed polygon), square, battery (arc)"""
    k = e.get("shape", e.get("kind", "redan")); sz = e.get("size", 0.6); a = math.radians(e.get("face", 90))   # face = direction to the enemy (deg, 0 = east, 90 = south)
    u = np.array([math.cos(a), math.sin(a)]); v = np.array([-u[1], u[0]]); c = np.asarray(c, np.float32)
    if k == "redan": P = [c - u * sz * 0.4 + v * sz, c + u * sz * 0.6, c - u * sz * 0.4 - v * sz]
    elif k == "lunette": P = [c - u * sz * 0.6 + v * sz, c + v * sz * 0.9, c + u * sz * 0.5, c - v * sz * 0.9, c - u * sz * 0.6 - v * sz]
    elif k in ("redoubt", "square", "fort"):
        n = 4 if k == "square" else 6 if k == "fort" else 5
        P = [c + (u * math.cos(t) + v * math.sin(t)) * sz * (1.0 if n == 4 else 0.85) for t in np.linspace(math.pi / n, 2 * math.pi + math.pi / n, n + 1)]
    elif k == "battery": P = [c + (u * math.cos(t) + v * math.sin(t)) * sz * 0.5 for t in np.linspace(-1.0, 1.0, 9)]
    else: P = [c - v * sz, c + v * sz]
    return chaikin(np.array(P, np.float32), 1) if k in ("lunette", "battery") else np.array(P, np.float32)


SIEGE_FORTS = [   # Confederate line, north -> south (approx. from the park's positions until geo.json gives them): name, lat, lon, shape, size
    ("Fort Hill", None, None, "fort", 0.9, (1384.2, 662.6)), ("Stockade Redan", 32.3646, -90.8537, "redan", 0.7, None),
    ("3rd Louisiana Redan", 32.3571, -90.8510, "redan", 0.6, None), ("Great Redoubt", 32.3540, -90.8480, "redoubt", 0.85, None),
    ("2nd Texas Lunette", 32.3446, -90.8448, "lunette", 0.6, None), ("Railroad Redoubt", 32.3383, -90.8433, "redoubt", 0.6, None),
    ("Square Fort", 32.3305, -90.8469, "square", 0.55, None),
    ("South Fort", None, None, "fort", 0.8, (1373.5, 714.0))]


def siege_works(G, h, box, close, cfg):
    """Vicksburg land defences: the forts (geo.json works if present, else SIEGE_FORTS), the Confederate rifle-pit line along the ridges
    between them, the Union siege line ~2 units out and zig-zag approach saps toward the main forts"""
    x0, y0, bw, bh = box; H, W = h.shape; upx = W / bw; city = np.array(G["towns"].get("Vicksburg", [1386, 680]), np.float32)
    hs = cv2.GaussianBlur(h, (0, 0), 0.4 * upx); forts = []
    for nm, la, lo, shp, sz, xy in SIEGE_FORTS:
        v = gfind(G, "works", nm) if G["works"] else None
        p = np.asarray(v["pts"], np.float32).mean(0) if v is not None else np.array(xy if xy else to_map(la, lo), np.float32)
        forts.append((nm, p, shp, sz, v))
    def ridge(p, nrm, r=0.9):   # move a point to the high ground along its normal
        cand = p[None] + nrm[None] * np.linspace(-r, r, 19)[:, None]; return cand[int(sample(hs, box, cand).argmax())]
    out = []
    for nm, p, shp, sz, v in forts:
        face = math.degrees(math.atan2(p[1] - city[1], p[0] - city[0]))
        e = dict(name=nm, kind="fort" if shp in ("fort", "redoubt", "square") else shp, side="cs", height=2.2, clear=3.0, closed=shp in ("fort", "redoubt", "square"), face=face)
        L = np.asarray(v["pts"], np.float32) if v is not None and len(v["pts"]) > 2 else work_shape(p, dict(shape=shp, size=sz, face=face))
        L = densify(L, 0.04 if close else 0.4)
        if e["closed"]: L = np.vstack([L, L[:1]])
        out.append(dict(e=e, pts=orient_work(L, e)))
    # Confederate line through the forts, on the ridges
    C = catmull(np.array([f[1] for f in forts], np.float32), 0.25)
    t = np.gradient(C, axis=0); t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-6; nr = np.stack([-t[:, 1], t[:, 0]], 1)
    C = smooth(np.array([ridge(p, n) for p, n in zip(C, nr)], np.float32), 4)
    keep = np.min([np.hypot(C[:, 0] - f[1][0], C[:, 1] - f[1][1]) for f in forts], 0) > 0.75   # gaps at the forts
    runs, cur = [], []
    for p, k in zip(C, keep):
        if k: cur.append(p)
        elif cur: runs.append(cur); cur = []
    if cur: runs.append(cur)
    for rn in runs:
        if len(rn) < 3: continue
        e = dict(name="", kind="rifle", side="cs", height=1.0, clear=2.0, face_to=[float(city[0]) + 60, float(city[1])])
        L = densify(np.array(rn, np.float32), 0.04 if close else 0.4); e.pop("face_to"); 
        # face away from the city
        tt = np.gradient(L, axis=0); rn_ = np.stack([tt[:, 1], -tt[:, 0]], 1)
        if (rn_ * (L - city)).sum() < 0: L = L[::-1]
        out.append(dict(e=e, pts=L))
    # Union siege line ~2 units out (outer arc), approach saps (zig-zags) toward the main forts
    off = cfg.get("union_offset", 2.2)
    U = C + (C - city) / (np.linalg.norm(C - city, axis=1, keepdims=True) + 1e-6) * off
    U = smooth(np.array([ridge(p, n, 0.6) for p, n in zip(U, nr)], np.float32), 6)
    U = U[(np.hypot(U[:, 0] - forts[0][1][0], U[:, 1] - forts[0][1][1]) > 2.0) & (np.hypot(U[:, 0] - forts[-1][1][0], U[:, 1] - forts[-1][1][1]) > 2.5)]
    L = densify(U, 0.04 if close else 0.4); tt = np.gradient(L, axis=0); rn_ = np.stack([tt[:, 1], -tt[:, 0]], 1)
    if (rn_ * (L - city)).sum() > 0: L = L[::-1]   # Union parapets face the city
    out.append(dict(e=dict(name="Union siege line", kind="rifle", side="us", height=1.0, clear=0.5), pts=L))
    rr = np.random.default_rng(63)
    for nm, p, shp, sz, v in forts[1:-2]:
        d = (p - city) / np.linalg.norm(p - city); j = int(np.hypot(U[:, 0] - p[0] - d[0] * off, U[:, 1] - p[1] - d[1] * off).argmin()); a = U[j]
        b = p + d * (sz + 0.35); n = np.array([-d[1], d[0]]); k = 6; Z = []
        for i in range(k + 1):
            q = a + (b - a) * i / k + n * (0.28 if i % 2 else -0.28) * (0 < i < k); Z.append(q)
        L = densify(np.array(Z, np.float32), 0.04 if close else 0.4)
        out.append(dict(e=dict(name=f"approach to the {nm}", kind="rifle", side="us", height=0.8, clear=0.3, face_to=[float(p[0]), float(p[1])]), pts=orient_work(L, dict(face_to=[float(p[0]), float(p[1])]))))
    return out


def auto_works(kind, spec, G, h, box, close):
    """generated works: 'river_batteries' = gun emplacements along the bluff crest facing the river between y0..y1"""
    out = []; x0, y0, bw, bh = box; H, W = h.shape; upx = W / bw
    if kind == "river_batteries":
        for k, y in enumerate(np.linspace(spec["y0"], spec["y1"], spec.get("n", 9))):
            row = int((y - y0) * upx)
            if not 0 <= row < H: continue
            prof = h[row]; xs = x0 + (np.arange(W) + 0.5) / upx
            ok = np.nonzero((prof > spec.get("crest_m", 50)) & (xs > spec.get("x_min", x0)))[0]
            if not len(ok): continue
            cx = xs[ok[0]] + spec.get("back", 0.6)
            e = dict(name=f"battery {k + 1}", kind="battery", side="cs", height=1.2, clear=0.8, guns=int(2 + (k % 3)), face=180)
            out.append(dict(e=e, pts=orient_work(densify(work_shape([cx, y], dict(shape="battery", size=spec.get("size", 0.5), face=180)), 0.04 if close else 0.4), e)))
    return out


# ============================================================ close settlement driver ============================================================
def settle_close(cfg, G, box, dist, hw, h, slope, RDS, seed):
    S = Settle(box, dist, hw, h, slope, cfg.get("settle_seed", 1863)); x0, y0, bw, bh = box
    for rd, c_, _ in RDS: S.block_road(rd, 0.35 if c_ == "pike" else 0.25)
    pikes = [rd for rd, c_, _ in RDS if c_ == "pike"] or [rd for rd, _, _ in RDS]
    def nearest_road(p):
        best = None
        for rd in pikes:
            dd = np.hypot(rd[:, 0] - p[0], rd[:, 1] - p[1]); i = int(dd.argmin())
            if best is None or dd[i] < best[0]: best = (dd[i], rd, i)
        return best
    for t in cfg.get("towns", []):
        p = resolve_pt(G, t)
        if p is None: continue
        if not (x0 < p[0] < x0 + bw and y0 < p[1] < y0 + bh): continue
        kind = t.get("kind", "street"); nr = nearest_road(p)
        if t.get("angle") is not None: ang = math.radians(t["angle"])
        elif nr: rd, i = nr[1], nr[2]; d_ = rd[min(i + 8, len(rd) - 1)] - rd[max(i - 8, 0)]; ang = math.atan2(d_[1], d_[0])
        else: ang = 0.0
        if kind == "street" and nr: S.street_town(p, nr[1], t.get("halfL", 2.8), t.get("cross", 6), t.get("rad", 4.3), t.get("parallel", True))
        elif kind == "grid": S.grid_town(p, ang, t.get("rad", 3.0), t.get("block", 0.9))
        elif kind == "hamlet": S.hamlet(p, ang if t.get("angle") is None else math.radians(t["angle"]), t.get("len", 2.6))
        elif kind == "plantation": S.plantation(float(p[0]), float(p[1]), None if t.get("angle") is None else math.radians(t["angle"]))
        elif kind == "farm": S.farmstead(float(p[0]), float(p[1]))
    for hm in cfg.get("hamlets", []): S.hamlet(np.array(hm[:2], np.float32), hm[2], hm[3])
    for f in cfg.get("farms_at", []): S.farmstead(f[0], f[1])
    for f in cfg.get("plantations_at", []): S.plantation(f[0], f[1])
    rr = np.random.default_rng(cfg.get("seed", 1) + 404)
    nF = int(round(cfg.get("farm_density", 2.5) * bw * bh / 1000)); nP = int(round(cfg.get("plantation_density", 0.0) * bw * bh / 1000))
    placed = [(c[0], c[1]) for c in S.clear]; lanes = []
    for want, fn, gap in ((nP, S.plantation, 6.0), (nF, S.farmstead, 3.0)):
        k = tries = 0
        while k < want and tries < want * 60:
            tries += 1; p = np.array([rr.uniform(x0 + 2, x0 + bw - 2), rr.uniform(y0 + 2, y0 + bh - 2)], np.float32)
            if any(math.hypot(p[0] - a, p[1] - b) < gap for a, b in placed): continue
            nr = nearest_road(p)
            if nr is None or nr[0] > 6.5 or (nr[0] > 2.5 and rr.random() < 0.5) or nr[0] < 0.9: continue
            if fn(float(p[0]), float(p[1])):
                placed.append((p[0], p[1])); k += 1
                if nr[0] > 1.2 and rr.random() < cfg.get("lane_p", 0.55):   # country lane from the yard to the road (curved)
                    q = nr[1][nr[2]]; m_ = (p + q) / 2 + rr.normal(0, 0.35, 2); ln = catmull([p, m_, q], 0.08)
                    if not any(S.wet(*z_, 0.2) for z_ in ln[::4]): lanes.append(ln.astype(np.float32))
    for L in cfg.get("lanes", []): lanes.append(catmull(np.array(L, np.float32), 0.08))
    R = S.result(); R["lanes"] = lanes
    return R


# ============================================================ previews + geo.js ============================================================
def make_preview(rname, D, out, cfg):
    img = cv2.imread(f"{out}/ground.jpg"); x0, y0, bw, bh = D["box"]; Wp = 1600 if D["kind"] == "wide" else 1200
    img = cv2.resize(img, (Wp, int(Wp * bh / bw)), interpolation=cv2.INTER_AREA); s = Wp / bw
    P = lambda x, y: (int((x - x0) * s), int((y - y0) * s))
    def lab(txt, x, y, col=(255, 255, 255), sc=0.45):
        p = P(x, y); cv2.putText(img, txt, (p[0] + 4, p[1] - 4), cv2.FONT_HERSHEY_SIMPLEX, sc, (0, 0, 0), 3, cv2.LINE_AA); cv2.putText(img, txt, (p[0] + 4, p[1] - 4), cv2.FONT_HERSHEY_SIMPLEX, sc, col, 1, cv2.LINE_AA)
    for rv in D["rivers"]:
        A = np.array(rv["pts"]);
        if rv["name"] != "creek" and len(A) > 4: m = A[len(A) // 2]; lab(rv["name"], m[0], m[1], (255, 220, 160), 0.4)
    for b in D["features"]["bridges"]: cv2.circle(img, P(b["x"], b["z"]), 4, (0, 200, 255), 2)
    for b in D["features"]["pontoons"]: cv2.circle(img, P(b["x"], b["z"]), 4, (255, 120, 255), 2)
    for w in D["features"]["works"]:
        if w["kind"] != "battery" and w["name"]: q = np.array(w["pts"])[:, :2].mean(0); lab(w["name"], q[0], q[1], (160, 200, 255), 0.35)
    for nm, (x, y) in D["towns"].items(): cv2.circle(img, P(x, y), 3, (255, 255, 255), -1); lab(nm, x, y)
    for nm, (x, y) in D["places"].items(): cv2.drawMarker(img, P(x, y), (200, 255, 200), cv2.MARKER_TILTED_CROSS, 8, 2); lab(nm, x, y, (200, 255, 200), 0.38)
    for k in range(int(math.ceil(x0 / 10)) * 10, int(x0 + bw), 10 if D["kind"] == "close" else 100):
        cv2.putText(img, str(k), (P(k, y0)[0], 12), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 0), 1)
    for k in range(int(math.ceil(y0 / 10)) * 10, int(y0 + bh), 10 if D["kind"] == "close" else 100):
        cv2.putText(img, str(k), (2, P(x0, k)[1]), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (255, 255, 0), 1)
    os.makedirs(f"{WORLDS}/previews", exist_ok=True); cv2.imwrite(f"{WORLDS}/previews/{rname}.jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 85])


def write_geo_js(G):
    r2 = lambda a: [[round(float(x), 2), round(float(y), 2)] for x, y in np.asarray(a)[:, :2]]
    D = dict(zoom=FRAME["zoom"], origin=FRAME["origin_world_px"], mpu=MPU, frame=FRAME.get("name", "vicksburg_hd_lift"), size=FRAME["size"], source=G["_src"],
             towns={k: [round(v[0], 2), round(v[1], 2)] for k, v in G["towns"].items()}, places={k: [round(v[0], 2), round(v[1], 2)] for k, v in G["places"].items()},
             rivers={k: r2(v) for k, v in G["rivers"].items()}, roads={k: r2(v) for k, v in G["roads"].items()}, railroads={k: r2(v) for k, v in G["railroads"].items()},
             works={k: dict(kind=v.get("kind"), side=v.get("side"), pts=r2(v["pts"])) for k, v in G["works"].items()})
    open(f"{WORLDS}/geo.js", "w").write("window.GM3D_GEO = " + json.dumps(D, separators=(",", ":"), default=lambda o: o.item() if hasattr(o, "item") else float(o)) + ";\n")


if __name__ == "__main__":
    argv = [a for i, a in enumerate(sys.argv) if not (a == "--project" or (i and sys.argv[i - 1] == "--project"))]
    args = [a for a in argv[1:] if not a.startswith("--")]; prev = "--no-preview" not in sys.argv
    if not args: print(__doc__); sys.exit(1)
    regs = sorted(f[:-5] for f in os.listdir(CFGDIR) if f.endswith(".json") and not f.startswith("_")) if args[0] == "all" else args
    G = load_geo(); LOG("geography:", G["_src"], {k: len(v) for k, v in G.items() if isinstance(v, dict)})
    if PROJ:
        write_geo_js(G)
        for rn in regs: bake_project(rn, G, prev)
        sys.exit(0)
    P = prep_dem(G); CR = creek_net(P, G)
    write_geo_js(G)
    for rn in regs: bake(rn, G, P, CR, prev)
