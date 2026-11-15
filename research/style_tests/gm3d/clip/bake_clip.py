"""GM3D world bake: real-elevation 3D terrain data for the Grand Maneuver experiment (Big Black River, 17 May 1863).
Reads (never writes) grant/assets/src/vicksburg_hd_elev.npy (3240x5760 m, 2 px per map unit of the 2880x1620 'vicksburg_hd_lift'
frame, geo in grant/assets/vicksburg_hd_lift.json) + gm_test river/road polylines; writes NEW files to world/assets/:
  height_<r>.png  16-bit height packed in R (high byte) + G (low byte): h_m = (R*256+G)/200 - 20  (canvas-readable, no colour mgmt)
  height_<r>_16.png  the same heights as a true 16-bit greyscale PNG (for other tools)
  ground_<r>.jpg  ochre/olive field patchwork, forest floor, banks, roads (no baked hillshade: three.js lights it)
  world_data.js   window.GM3D_DATA = {regions, rivers (ribbons with water level), trees, houses, bridge, breastworks, towns}
Regions: 'wide' (Vicksburg - Big Black - Jackson, 960 x 540 map units) and 'close' (the Big Black bridge, 84 x 56 units).
World space in three.js = map units (x east, z south), y = h_m * exag / 129.36.   usage: python3 bake_world.py"""
import json, os, math
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = f"{HERE}/assets"   # clip copy of world/bake_world.py: GM close ground (fields, hedgerows, photo texture, denser towns); os.makedirs(OUT, exist_ok=True)
REPO = "/home/user/battle-maps"; GMT = f"{REPO}/research/style_tests/gm_test"
ELEV = np.load(f"{REPO}/grant/assets/src/vicksburg_hd_elev.npy").astype(np.float32)   # 2 px per map unit
GEO = json.load(open(f"{REPO}/grant/assets/vicksburg_hd_lift.json"))
MPU = GEO["meters_per_px"]   # metres per map unit (129.36)
RIV = json.load(open(f"{GMT}/data/rivers.json"))
ROADS = [[[float(v) for v in q.split()] for q in sp.strip().split(" L")] for d in json.load(open(f"{GMT}/data/roads.json")) for sp in d.split("M") if sp.strip()]
CLOSE_PLANE = json.load(open(f"{GMT}/scene/assets/plane_close.json"))   # gm_test close river (meandered Big Black), plane px

REG = {"wide": dict(box=(1100, 370, 1000, 640), hm=(1500, 960), tex=(8192, 5243), cell=22.0, seed=11),
       "close": dict(box=(1474, 676, 84, 56), hm=(672, 448), tex=(4096, 2731), cell=5.2, seed=21)}
TOWNS = {   # map units, radius (units), houses; Bovina just west of the bridge on the Vicksburg road
    "Vicksburg": (1388, 681, 7.0, 90), "Jackson": (1885, 724, 7.5, 90), "Edwards": (1599.4, 716.4, 2.6, 26),
    "Bovina": (1495.5, 701.2, 2.2, 34), "Raymond": (1716, 759, 2.4, 22), "Bolton": (1700, 712, 1.6, 12)}
# v5 wide: more small towns (GM's wide map is dotted with small red towns); real 1863 places, snapped to the nearest road
TOWNS_EXTRA = {"Clinton": (1789, 700, 2.2, 22), "Warrenton": (1397, 798, 1.8, 16), "Brownsville": (1725, 587, 1.6, 12), "Utica": (1568, 890, 1.8, 14),
    "Rocky Springs": (1426, 908, 1.6, 12), "Mississippi Springs": (1780, 792, 1.6, 12), "Brandon": (2033, 747, 2.0, 18), "Cayuga": (1549, 856, 1.4, 10),
    "Auburn": (1513, 836, 1.4, 10), "Champion Hill": (1631, 702, 1.2, 8), "Dillon's": (1571, 793, 1.2, 8), "Haynes Bluff": (1404, 569, 1.4, 9)}
GRID_TOWNS = {"Vicksburg": 3.0, "Jackson": 3.2}   # street-grid towns (block size, units)
# v5 close: country lanes linking the hamlets and farms to the Vicksburg road (curved rust-brown roads, GM's most readable lines)
CLOSE_LANES = [[(1524.0, None), (1526.4, 699.0), (1528.2, 692.4), (1531.5, 686.0), (1534.0, 677.0)],
               [(1518.6, None), (1518.2, 709.6), (1517.2, 714.2), (1515.6, 722.0), (1514.0, 733.0)],
               [(1506.2, None), (1505.4, 707.8), (1504.0, 711.6), (1502.6, 718.0), (1500.0, 733.0)],
]   # v6: fewer side roads

def fbm(h, w, octaves=5, base=4, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((h, w), np.float32); amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o; g = r.random((max(2, n * h // w + 2), n + 2)).astype(np.float32)
        acc += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC); tot += amp; amp *= 0.5
    acc /= tot; return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)

def smooth(p, k):
    q = np.array(p, np.float32)
    for _ in range(k): q[1:-1] = 0.25 * q[:-2] + 0.5 * q[1:-1] + 0.25 * q[2:]
    return q

def densify(pts, step):
    pts = np.asarray(pts, np.float32); out = [pts[0]]
    for a, b in zip(pts[:-1], pts[1:]):
        n = max(1, int(np.linalg.norm(b - a) / step))
        for f in np.linspace(0, 1, n + 1)[1:]: out.append(a * (1 - f) + b * f)
    return np.array(out, np.float32)

def hexc(s): return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
FIELD = [hexc(c) for c in ("#B39967", "#C2B280", "#A8915E", "#BFA874", "#B39967", "#C2B280", "#9C9A62", "#7A8E6A", "#8B9A6B", "#C9B98A", "#A58B5A", "#B8A070")]
FOREST, BANK, ROAD = hexc("#22402a"), hexc("#6d6045"), hexc("#b3a283")

def catmull(P, step):
    """Catmull-Rom spline through control points, resampled every `step` units"""
    P = np.asarray(P, np.float32); P = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]]); out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]; n = max(2, int(np.linalg.norm(p2 - p1) / step))
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    out.append(P[-2]); return np.array(out, np.float32)

def close_roads(bridge_xy):
    """v5 close roads: the Vicksburg road with a gentle meander (none at the bridge) + curved country lanes (map units)"""
    rd = densify(ROADS[0], 0.08); rd = rd[(rd[:, 0] > 1460) & (rd[:, 0] < 1575)]
    arc = np.r_[0, np.cumsum(np.hypot(*np.diff(rd, axis=0).T))]
    t = np.diff(rd, axis=0, prepend=rd[:1]); t[0] = t[1]; t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-6; nrm = np.stack([-t[:, 1], t[:, 0]], 1)
    damp = np.clip((np.hypot(rd[:, 0] - bridge_xy[0], rd[:, 1] - bridge_xy[1]) - 1.5) / 3.0, 0, 1)
    off = (0.32 * np.sin(arc / 7.5 * 2 * np.pi + 0.6) + 0.14 * np.sin(arc / 3.1 * 2 * np.pi + 2.0)) * damp
    main = smooth(rd + nrm * off[:, None], 6)
    lanes = []; rr = np.random.default_rng(77)
    for L in CLOSE_LANES:
        x0_ = L[0][0]; j = int(np.abs(main[:, 0] - x0_).argmin()); P = [main[j]] + [np.array(p, np.float32) + rr.normal(0, 0.25, 2) for p in L[1:]]
        lanes.append(catmull(P, 0.08))
    return main, lanes

def elev_crop(box, W, H, blur=0.0):
    x0, y0, bw, bh = box
    xs = (x0 + (np.arange(W) + 0.5) / W * bw) * 2 - 0.5; ys = (y0 + (np.arange(H) + 0.5) / H * bh) * 2 - 0.5
    mx, my = np.meshgrid(xs.astype(np.float32), ys.astype(np.float32))
    src = cv2.GaussianBlur(ELEV, (0, 0), blur) if blur else ELEV
    return np.maximum(cv2.remap(src, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE), 0.0)

def sample(field, box, pts):
    """bilinear sample of a region field at map-unit points"""
    x0, y0, bw, bh = box; H, W = field.shape
    px = ((pts[:, 0] - x0) / bw * W - 0.5).astype(np.float32); py = ((pts[:, 1] - y0) / bh * H - 0.5).astype(np.float32)
    n = len(px); m = -(-n // 1024) * 1024; px = np.pad(px, (0, m - n)).reshape(-1, 1024); py = np.pad(py, (0, m - n)).reshape(-1, 1024)
    return cv2.remap(field, px, py, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE).reshape(-1)[:n]

def rivers_for(name):
    if name == "wide":
        return [("mississippi", smooth(densify(RIV["mississippi"]["pts"], 1.5), 6), 5.0),
                ("big_black", smooth(densify(RIV["big_black"]["pts"], 1.0), 6), 1.3),
                ("pearl", smooth(densify(RIV["pearl"]["pts"], 1.0), 6), 1.1)]
    c = CLOSE_PLANE; pts = np.array(c["rivers"]["big_black"], np.float32) / c["s"] + [c["x0"], c["y0"]]
    pts = pts[(pts[:, 0] > 1440) & (pts[:, 0] < 1600) & (pts[:, 1] > 640) & (pts[:, 1] < 770)]
    return [("big_black", smooth(densify(pts, 0.12), 8), 0.36)]   # v5: half width (his rivers are thin dark lines)

def water_levels(pts, h_smooth_at):
    """water level (m) along a river polyline (upstream first): low bank height, never rising downstream"""
    wl = h_smooth_at(pts) - 1.2
    wl = np.convolve(np.pad(wl, 15, mode="edge"), np.ones(31) / 31, mode="valid")
    return np.minimum.accumulate(wl)

def bake(name):
    R = REG[name]; box = R["box"]; x0, y0, bw, bh = box; HW, HH = R["hm"]; TW, TH = R["tex"]; seed = R["seed"]
    upx_h = HW / bw   # height px per unit
    h = elev_crop(box, HW, HH, blur=1.0 if name == "wide" else 1.6)
    if name == "close":   # DEM is ~65 m per px here: add gentle procedural relief so the close ground is not glassy
        h += (fbm(HH, HW, 5, 4, seed + 5) - 0.5) * 7.0 + (fbm(HH, HW, 4, 16, seed + 6) - 0.5) * 1.6
    hs = cv2.GaussianBlur(h, (0, 0), 2.5 * upx_h)
    # ---- rivers: water level + carve channel and banks ----
    rivs = []; wlimg = np.full((HH, HW), 1e4, np.float32); cl = np.full((HH, HW), 255, np.uint8); widthimg = np.zeros((HH, HW), np.float32)
    for key, pts, w in rivers_for(name):
        wl = water_levels(pts, lambda p: sample(hs, box, p))
        P = np.stack([(pts[:, 0] - x0) * upx_h, (pts[:, 1] - y0) * upx_h], 1)
        tmp = np.full((HH, HW), 1e4, np.float32); th = max(2, int((w * 2.5 + 2.0) * upx_h))
        for i in range(len(P) - 1):   # flow order: downstream (lower) overwrites upstream
            a = tuple(int(v) for v in np.round(P[i] * 4)); b = tuple(int(v) for v in np.round(P[i + 1] * 4))
            cv2.line(tmp, a, b, float(wl[i]), th, cv2.LINE_8, shift=2); cv2.line(widthimg, a, b, float(w), th, cv2.LINE_8, shift=2)
        wlimg = np.minimum(wlimg, tmp)
        cv2.polylines(cl, [np.round(P * 4).astype(np.int32)], False, 0, 1, cv2.LINE_8, shift=2)
        rivs.append(dict(name=key, w=w, pts=[[round(float(p[0]), 3), round(float(p[1]), 3), round(float(l), 2)] for p, l in zip(pts[::2], wl[::2])]))
    dist = cv2.distanceTransform(cl, cv2.DIST_L2, 5) / upx_h   # units from a river centre line
    hw = np.maximum(widthimg, 0.3) / 2; depth = 2.5 if name == "wide" else 3.0
    bankslope = 9.0 if name == "wide" else 14.0   # metres per unit outside the channel
    target = np.where(dist < hw, wlimg - depth * (1 - (dist / hw) ** 2) - 0.4, wlimg - 0.4 + (dist - hw) * bankslope)
    h = np.where(wlimg < 1e3, np.minimum(h, target), h)
    if name == "wide":   # v5: GM's wide map is a flat plateau with relief only in the river valleys: exag 14 -> ~6 away from the rivers
        valley = np.clip(1 - (dist - hw - 3.0) / 10.0, 0, 1); valley = cv2.GaussianBlur(valley, (0, 0), 3 * upx_h)
        trend = cv2.GaussianBlur(h, (0, 0), 30 * upx_h); h = trend + (h - trend) * (6 / 14 + 0.3 * valley); del trend   # v5b: the valleys too stay gentler (his loess is soft)
    bridge_xy = None
    if name == "close":   # the railroad bridge site (where the Vicksburg road crosses the river), needed by the road meander
        rd_ = densify(ROADS[0], 0.05); rv_ = np.array([p[:2] for p in rivs[0]["pts"]], np.float32)
        dd_ = np.hypot(rd_[:, None, 0] - rv_[None, :, 0], rd_[:, None, 1] - rv_[None, :, 1]); k_ = np.unravel_index(dd_.argmin(), dd_.shape); bridge_xy = rv_[k_[1]]
        main_rd, lanes = close_roads(bridge_xy)
        riv_ = np.array(rivs[0]["pts"], np.float32); pons = []   # v5: the three new bridges of 18 May (index.html crossing arrows at y 702.0 / 707.8 / 709.6, east branch)
        for y_ in (702.0, 707.8, 709.6):
            i = int(np.argmin(np.abs(riv_[:, 1] - y_) + (riv_[:, 0] < 1500) * 99)); a_, c_ = riv_[max(0, i - 3)], riv_[min(len(riv_) - 1, i + 3)]
            ang = math.atan2(c_[1] - a_[1], c_[0] - a_[0]); pons.append(dict(x=round(float(riv_[i, 0]), 3), z=round(float(riv_[i, 1]), 3), angle=round(-ang, 4), len=round(rivs[0]["w"] * 1.08 + 0.34, 3), wl=round(float(riv_[i, 2]), 2)))
    # ---- breastworks (close): low earth parapet along the cotton-bale line ----
    bw_line = None
    if name == "close":
        ys = np.linspace(697.2, 712.4, 60); xs = 1520.6 + 0.9 * np.sin((ys - 697.2) / 15.2 * np.pi)
        bw_line = np.stack([xs, ys], 1)
        par = np.zeros((HH, HW), np.uint8)
        cv2.polylines(par, [np.round(np.stack([(xs - x0) * upx_h, (ys - y0) * upx_h], 1) * 4).astype(np.int32)], False, 255, int(0.5 * upx_h * 4) // 4 + 2, cv2.LINE_AA, shift=2)
        h += cv2.GaussianBlur(par.astype(np.float32) / 255, (0, 0), 0.12 * upx_h) * 1.0   # v5: low hump; the parapet itself is a 3D prism (world.js)
    # ---- ground texture (v5: GM's warm patchwork measured on 1814 640-700 s: sand / tan ~45 %, rust ~15 %, olive ~25 %, dark pasture ~15 %,
    #      no field outlines, rare clumped hedges, pale tracks, strips + furrows, rust-brown roads, dark hard-edged teal woods) ----
    s = TW / bw; Pt = lambda q_: ((q_[0] - x0) * s, (q_[1] - y0) * s)
    ht = cv2.resize(h, (TW, TH), interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) * s / MPU; gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) * s / MPU
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.006 * TW); slope /= np.percentile(slope, 99) + 1e-6
    del gx, gy
    r = np.random.default_rng(seed); cell = R["cell"] * s
    # Voronoi fields on a jittered grid, edges warped by noise (worked at 1/2 res, then upsampled nearest)
    LW, LH = (TW, TH) if name == "close" else (TW // 2, TH // 2); cs = cell * LW / TW   # v6: close labels at full res (no 2-px stair-steps)
    seeds = np.zeros((LH, LW), np.uint8) + 255
    for yy_ in np.arange(cs / 2, LH + cs, cs * 0.7):
        for xx_ in np.arange(cs / 2, LW + cs, cs * 1.35):
            px_, py_ = xx_ + r.uniform(-0.5, 0.5) * cs * 1.35, yy_ + r.uniform(-0.4, 0.4) * cs * 0.7
            if 0 <= px_ < LW and 0 <= py_ < LH: seeds[int(py_), int(px_)] = 0
    _, lab = cv2.distanceTransformWithLabels(seeds, cv2.DIST_L2, 5, labelType=cv2.DIST_LABEL_PIXEL)
    wx = (fbm(LH, LW, 4, 8, seed + 30) - 0.5) * cs * 0.5; wy = (fbm(LH, LW, 4, 8, seed + 31) - 0.5) * cs * 0.5
    my_, mx_ = np.mgrid[0:LH, 0:LW].astype(np.float32)
    lab = cv2.remap(lab.astype(np.float32), mx_ + wx, my_ + wy, cv2.INTER_NEAREST, borderMode=cv2.BORDER_REPLICATE)
    Mr = cv2.getRotationMatrix2D((LW / 2, LH / 2), 14, 1.12); lab = cv2.warpAffine(lab, Mr, (LW, LH), flags=cv2.INTER_NEAREST, borderMode=cv2.BORDER_REFLECT)
    lab = cv2.resize(lab, (TW, TH), interpolation=cv2.INTER_NEAREST).astype(np.int32); n = int(lab.max()) + 1
    del seeds, wx, wy, my_, mx_
    hedge_pts = None
    if name == "close":
        img, hedge_pts = gm_fields(lab, n, cell, s, r, TW, TH, seed)
    else:
        img = wide_fields(lab, n, cell, s, r, TW, TH, seed)
    del lab
    # rivers / banks (texture space)
    dist_t = cv2.resize(dist, (TW, TH), interpolation=cv2.INTER_LINEAR); hw_t = cv2.resize(hw, (TW, TH), interpolation=cv2.INTER_NEAREST)
    near = np.clip(1 - (dist_t - hw_t) / (10.0 if name == "wide" else 2.5), 0, 1)
    # towns (close): street plan, packed houses, church, gardens, farm courtyards (laid out before the woods so the woods keep clear)
    town = close_town(dist, hw, box, h) if name == "close" else None
    wplan = wide_plan(dist, hw, box, h) if name == "wide" else None
    townmask = np.zeros((TH, TW), np.float32)
    for nm, (tx, ty, rad) in (wplan["towns"] if wplan else [(k, (v[0], v[1], v[2])) for k, v in TOWNS.items()]):
        cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s * ((1.45 if nm in GRID_TOWNS else 2.6) if name == "wide" else 1.1)), 1.0, -1)
    if town:
        for (tx, ty, rad) in town["clear"]: cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s), 1.0, -1)
    if bw_line is not None:
        cv2.polylines(townmask, [np.round(np.array([Pt(p) for p in bw_line])).astype(np.int32)], False, 1.0, int(4.0 * s))   # clear field of fire
    RDS = [main_rd] + lanes if name == "close" else ROADS
    road0 = np.zeros((TH, TW), np.uint8)
    for rd in RDS: cv2.polylines(road0, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, max(3, int((1.6 if name == "wide" else 0.5) * s)), cv2.LINE_8, shift=2)
    # forest mask. close: jagged broken outline (fine noise in the threshold) + a few clearings; wide: many small woods everywhere (GM)
    fm = fbm(TH, TW, 6, 5, seed + 2)
    fm2 = fbm(TH, TW, 3, int(bw / (14 if name == "wide" else 1.6)), seed + 12)   # small woodlots
    if name == "close":
        jag = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.7), seed + 60), (TW, TH))
        fbase = np.maximum(fm * 0.7 + fm2 * 0.3 + near * 0.12 + slope * 0.5 - 0.72, fm2 * 0.85 + fm * 0.2 - 0.69) + (jag - 0.5) * 0.16   # v5: floodplain woods 0.3 -> 0.12 (fields reach the water)
        del jag
    else:
        fm3 = fbm(TH, TW, 4, int(bw / 10), seed + 13)   # v6: smaller, more numerous woods, ~25 % cover
        fbase = np.maximum(fm * 0.7 + fm2 * 0.3 + near * 0.35 + slope * 0.4 - WT[0], fm3 * 0.55 + fm * 0.45 - WT[1])   # clustered: big forests + scattered small woods
        del fm3
    forest = np.clip(fbase * 12, 0, 1); del fbase, fm2
    forest *= (1 - road0.astype(np.float32) / 255)
    forest *= (1 - cv2.GaussianBlur(townmask, (0, 0), 0.006 * TW)); forest *= (dist_t > hw_t + (0.6 if name == "wide" else 0.10))
    if name == "close":   # v6: clear the woods 0.3 units either side of each new-bridge crossing (the pontoons + columns must read)
        cm = np.zeros((TH, TW), np.uint8)
        for pb in pons:
            ax = np.array([-math.sin(-pb["angle"]), math.cos(-pb["angle"])])
            p1, p2 = Pt(np.array([pb["x"], pb["z"]]) + ax * 3.0), Pt(np.array([pb["x"], pb["z"]]) - ax * 3.0)
            cv2.line(cm, (int(p1[0]), int(p1[1])), (int(p2[0]), int(p2[1])), 1, int(0.6 * s))
        forest *= (1 - cm.astype(np.float32)); del cm
    else: print("  wide forest cover %.2f" % float((forest > 0.5).mean()))   # v6: ~0.25
    if name == "close":   # clearings / gaps inside the woods
        holes = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 1.4), seed + 61), (TW, TH)); forest *= (holes < 0.78); del holes
    forest = (cv2.GaussianBlur(forest, (0, 0), 0.5 if name == "close" else 0.3 * TW / 4096) > 0.5).astype(np.float32)   # v5: hard edges (his woods are crisp)
    forest = cv2.GaussianBlur(forest, (0, 0), 0.7 if name == "close" else 0.6 * TW / 4096)
    crown = fbm(TH, TW, 2, int(bw / (0.6 if name == "wide" else 0.09)), seed + 3)   # tree crowns speckle
    fdark = cv2.GaussianBlur(forest, (0, 0), 0.004 * TW)   # darker inside, lighter rim
    fcol = (hexc("#344f52") if name == "close" else hexc("#192e32"))[None, None] * (0.78 + 0.44 * crown[..., None]) * (1.08 - 0.16 * fdark[..., None])   # v5: GM teal woods ~(51,70,70)
    img = img * (1 - forest[..., None]) + fcol * forest[..., None]; del fcol, crown, fdark
    ao = np.clip(cv2.GaussianBlur(forest, (0, 0), 0.0025 * TW) - forest, 0, 1)   # shade on the ground next to woods
    img *= (1 - 0.45 * ao)[..., None]; del ao
    # river banks + floodplain: a little greener, damper ground along the water; v5: a thin dark bank line at the water edge (his rivers have a dark edge)
    flood = np.clip(1 - (dist_t - hw_t) / (6.0 if name == "wide" else 1.0), 0, 1)[..., None] * (1 - forest[..., None])
    img = img * (1 - 0.22 * flood) + (hexc("#6f7a62") if name == "wide" else hexc("#7f8462")) * 0.22 * flood
    bank = np.clip(1 - (dist_t - hw_t) / (0.7 if name == "wide" else 0.12), 0, 1)[..., None]
    bank *= (0.6 if name == "close" else 0.35); img = img * (1 - bank) + hexc("#5c5c4a") * bank
    bline = np.clip(1 - np.abs(dist_t - hw_t) / (0.35 if name == "wide" else 0.045), 0, 1)[..., None] * (0.0 if name == "wide" else 0.85)   # v6: wide river not a striped double line
    img = img * (1 - bline) + hexc("#33392f") * bline; del flood, bank, bline
    # town ground: yards, gardens, streets (close)
    if town: img = paint_town(img, town, Pt, s)
    # roads: v5 thick rust-brown dirt roads with a thin dark edge (GM: ~(150,90,70), the most readable lines on the map)
    road = np.zeros((TH, TW), np.uint8); rwpx = max(3, int((0.9 if name == "wide" else 0.16) * s))   # v6: thinner (main 0.16 / lanes 0.08 units close, 0.9 wide)
    for i_, rd in enumerate(RDS):
        pts = np.array([Pt(p) for p in rd], np.float32)
        cv2.polylines(road, [np.round(pts * 4).astype(np.int32)], False, 255, rwpx if (name == "wide" or i_ == 0) else max(3, int(0.08 * s)), cv2.LINE_AA, shift=2)
    if town:
        for st, wdt in town["streets"]: cv2.polylines(road, [np.round(np.array([Pt(p) for p in st], np.float32) * 4).astype(np.int32)], False, 255, max(3, int(wdt * s)), cv2.LINE_AA, shift=2)
    if name == "wide":
        for st, wdt in wplan["streets"]: cv2.polylines(road, [np.round(np.array([Pt(p) for p in st], np.float32) * 4).astype(np.int32)], False, 255, max(2, int(wdt * s)), cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32) / 255
    edge = np.clip(cv2.GaussianBlur(cv2.dilate(road, np.ones((3, 3), np.uint8), iterations=1 if name == "close" else 2).astype(np.float32) / 255, (0, 0), 0.8) - rdm, 0, 1)[..., None]
    img = img * (1 - 0.25 * edge) + hexc("#4a3a2e") * 0.25 * edge; del edge
    rdm = rdm[..., None]
    rcol = hexc("#8a5e48") if name == "close" else hexc("#7a4a35")   # v6: browner, greyer
    rdm = rdm * (0.85 if name == "close" else 0.7) * (0.85 + 0.3 * cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.5), seed + 71), (TW, TH))[..., None]).clip(0, 1.15)   # v6: mix 0.85 / 0.7, ragged edges
    img = img * (1 - rdm) + rcol * (1 + (cv2.resize(fbm(TH // 8, TW // 8, 3, 40, seed + 70), (TW, TH))[..., None] - 0.5) * 0.18) * rdm; del rdm, road
    tg = cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)[..., None] * (0.18 if name == "wide" else 0.0); img = img * (1 - tg) + hexc("#8c7b66") * tg
    if bw_line is not None:   # dark ditch right in front of the parapet + pale thrown-up spoil beyond it
        for dx_, wd_, col_, a_ in ((0.17, 0.09, "#3e3326", 0.75), (0.32, 0.16, "#9a8462", 0.45)):
            sp = np.zeros((TH, TW), np.uint8); cv2.polylines(sp, [np.round(np.array([Pt((p[0] + dx_, p[1])) for p in bw_line]) * 4).astype(np.int32)], False, 255, max(2, int(wd_ * s)), cv2.LINE_AA, shift=2)
            spf = cv2.GaussianBlur(sp.astype(np.float32) / 255, (0, 0), 1.2)[..., None] * a_; img = img * (1 - spf) + hexc(col_) * spf
    # baked relief shading (slope + aspect to the NW sun, multi-scale), on top of three.js lighting: GM's soft hills and sunlit valley sides
    exag = 14.0 if name == "wide" else 6.0
    shade = np.ones((TH, TW), np.float32)
    sun = np.array([-0.7, 0.48, -0.4], np.float32); sun /= np.linalg.norm(sun)
    for sig, wgt in ((0.0015, 0.22), (0.005, 0.6)) if name == "wide" else ((0.004, 0.6), (0.012, 0.4)):
        hb = cv2.GaussianBlur(ht, (0, 0), sig * TW) * exag / MPU
        dz, dx = np.gradient(hb); dx *= s; dz *= s
        lam = (-dx * sun[0] + sun[1] - dz * sun[2]) / np.sqrt(dx * dx + 1 + dz * dz)
        shade += wgt * (np.clip(lam, 0, 1) / sun[1] - 1)
        del hb, dz, dx, lam
    if name == "wide":
        k = 0.9; img *= (1 + k * (shade - 1))[..., None]   # v6: more relief shading (tonal spread)
        vt = np.clip(1 - (dist_t - hw_t - 2.0) / 14.0, 0, 1)   # v6: bright sunlit slopes along the river valleys
        lit = np.clip((shade - 1.04) * 2.4, 0, 1)[..., None] * (1 - 0.8 * forest[..., None]) * (0.3 + 0.7 * vt[..., None])   # GM: sunlit valley sides go pale lime-yellow ~(175,177,130)
        img = img * (1 - 0.75 * lit) + hexc("#d0cc96") * 0.75 * lit; del lit, vt
        img *= np.array([0.9, 0.95, 0.98], np.float32)   # the boosted wide sun lifts the map: pre-darken a little (v4 x(0.78,0.85,0.88) was too dark and cool)
    else:
        img *= (1 + 0.5 * (shade - 1))[..., None]
    del shade, ht
    img = np.clip(img + (fbm(TH, TW, 3, 60, seed + 9)[..., None] - 0.5) * 6, 0, 255)
    if name == "wide": lum = img.mean(-1, keepdims=True); img = np.clip(img * 0.92 + lum * 0.08, 0, 255); del lum
    cv2.imwrite(f"{OUT}/ground_{name}.jpg", img[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90]); del img
    # ---- heightmap out: woods raised as a canopy (wide: 9 m so they read from altitude; close: a ~3 m canopy blanket under the crowns,
    #      so the wood reads as one massed canopy with a shadowed edge, not as separate balls on bare ground) ----
    fh = cv2.resize(cv2.GaussianBlur(forest, (0, 0), (0.0012 if name == "wide" else 0.0010) * TW), (HW, HH), interpolation=cv2.INTER_AREA)
    h = h + fh * (9.0 if name == "wide" else 3.0)
    q = np.clip(np.round((h + 20) * 200), 0, 65535).astype(np.uint16)
    rgb = np.dstack([np.zeros_like(q, np.uint8), (q & 255).astype(np.uint8), (q >> 8).astype(np.uint8)])   # BGR: R = high, G = low
    cv2.imwrite(f"{OUT}/height_{name}.png", rgb); cv2.imwrite(f"{OUT}/height_{name}_16.png", q)
    # ---- trees (close only; the wide woods are texture + raised canopy). [x, z, h_m, kind, scale, colour, edge]
    #      kind 0 wood crown, 1 conifer, 2 hedgerow, 3 lone / garden / orchard tree; edge 0 = wood edge .. 1 = deep inside ----
    trees = []
    if name == "close":
        win = (1484, 1552, 678, 732); spacing = 0.17
        fb = cv2.resize((forest > 0.5).astype(np.uint8), (TW // 2, TH // 2), interpolation=cv2.INTER_NEAREST)
        fin = cv2.distanceTransform(fb, cv2.DIST_L2, 5) / (s / 2)   # units inside the wood
        gxs = np.arange(win[0], win[1], spacing); gys = np.arange(win[2], win[3], spacing * 0.87)
        G = np.array([(x + (0.5 * spacing if j % 2 else 0), y) for j, y in enumerate(gys) for x in gxs], np.float32)   # hex grid
        G += r.uniform(-0.42, 0.42, G.shape).astype(np.float32) * spacing
        fval = sample(cv2.resize(forest, (TW // 2, TH // 2), interpolation=cv2.INTER_AREA), box, G)
        fin_g = sample(fin, box, G); keep = r.random(len(G)) < np.clip((fval - 0.45) * 3.5, 0, 1) * np.where(fin_g > 0.5, 0.62, 1.0)   # deep inside: thinner, the speckled canopy blanket shows
        T = G[keep]; e = np.clip(sample(fin, box, T) / 0.7, 0, 1)
        kind = (r.random(len(T)) < 0.02).astype(int)   # v5: few conifers (the cones stuck out of the canopy)
        sc = np.exp(r.normal(0.12, 0.22, len(T))).clip(0.6, 1.9) * (0.9 + 0.15 * e)
        cv_ = r.uniform(0, 1, len(T))
        lists = [(T, kind, sc, cv_, e)]
        if hedge_pts is not None:   # hedgerow + lone field trees (texture px -> map units), kept off water/roads/towns
            HP = hedge_pts[:, :2] / s + [x0, y0]; hk_ = hedge_pts[:, 2].astype(int)
            ok = (sample(dist, box, HP.astype(np.float32)) > sample(hw, box, HP.astype(np.float32)) + 0.25)
            ok &= (sample(cv2.resize(townmask + road0.astype(np.float32) / 255, (TW // 2, TH // 2)), box, HP.astype(np.float32)) < 0.2)
            ok &= sample(cv2.resize(forest, (TW // 2, TH // 2)), box, HP.astype(np.float32)) < 0.3
            ok &= (HP[:, 0] > win[0]) & (HP[:, 0] < win[1]) & (HP[:, 1] > win[2]) & (HP[:, 1] < win[3])
            HP, hk_ = HP[ok], hk_[ok]
            lists.append((HP.astype(np.float32), hk_, np.where(hk_ == 2, r.uniform(0.7, 1.25, len(HP)), r.uniform(0.8, 1.3, len(HP))), r.uniform(0, 1, len(HP)), np.zeros(len(HP))))   # v5: hedge crowns x1.5
        if town and town["trees"]:
            TT = np.array(town["trees"], np.float32); lists.append((TT[:, :2], np.full(len(TT), 3), TT[:, 2], r.uniform(0, 1, len(TT)), np.zeros(len(TT))))
        for T_, k_, s_, c_, e_ in lists:
            th_ = sample(h, box, T_.astype(np.float32))
            trees += [[round(float(a), 3), round(float(b), 3), round(float(c), 1), int(k), round(float(sv), 2), round(float(f), 2), round(float(ev), 2)] for (a, b), c, k, sv, f, ev in zip(T_, th_, k_, s_, c_, e_)]
    # ---- houses: wide = long red-roofed houses lining the roads through each town; close = the town plan ([x, z, h, w, d, rot, roof, kind]) ----
    houses = []
    if name == "wide":
        houses = [[round(px, 3), round(py, 3), round(float(sample(h, box, np.array([[px, py]], np.float32))[0]), 1), round(w_, 3), round(d_, 3), round(rot, 3), rc, 0] for (px, py, w_, d_, rot, rc) in wplan["houses"]]
    else:
        for (px, py, w_, d_, ang, rc, kd) in town["build"]:
            houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, np.array([[px, py]], np.float32))[0]), 1), round(w_, 3), round(d_, 3), round(-ang, 3), int(rc), int(kd)])
    extra = {}
    if name == "close":
        # railroad bridge: where the Vicksburg road (road 0) crosses the close river
        rd = np.array(ROADS[0], np.float32); riv = np.array(rivs[0]["pts"], np.float32)
        best = None
        for p in rd[(rd[:, 0] > 1490) & (rd[:, 0] < 1540)]:
            dd = np.hypot(riv[:, 0] - p[0], riv[:, 1] - p[1]); i = int(dd.argmin())
            if best is None or dd[i] < best[0]: best = (dd[i], p, i)
        _, p, i = best; t_ = riv[min(i + 2, len(riv) - 1), :2] - riv[max(i - 2, 0), :2]; t_ /= np.linalg.norm(t_)
        wl = float(riv[i, 2]); bank_h = float(np.percentile(sample(h, box, np.array([p + [math.cos(a) * 0.9, math.sin(a) * 0.9] for a in np.linspace(0, 6.28, 16)], np.float32)), 70))
        extra["bridge"] = dict(x=round(float(riv[i, 0]), 3), z=round(float(riv[i, 1]), 3), angle=round(math.atan2(t_[1], t_[0]) + math.pi / 2, 4), len=round(0.62 * 2.6, 3), wl=round(wl, 2), deck=round(max(bank_h, wl + 4) + 1.0, 2))
        extra["pontoons"] = pons
        bl = bw_line; bh_ = sample(h, box, bl.astype(np.float32))
        extra["breastworks"] = [[round(float(a), 3), round(float(b), 3), round(float(c), 2)] for (a, b), c in zip(bl, bh_)]
    if name == "wide": extra["towns"] = {nm: [round(t_[0], 2), round(t_[1], 2)] for nm, t_ in wplan["towns"]}   # v5: every wide town (for labels)
    return dict(box=list(box), hm=[HW, HH], tex=[TW, TH], rivers=rivs, trees=trees, houses=houses, **extra)


def wide_plan(dist, hw, box, h):
    """v5 wide towns: Vicksburg / Jackson on a street grid (houses in rows along the streets), the others as small red 'star' towns
    lining their roads (GM's wide map). Returns towns [(name, (x, y, rad))], streets [(pts, width)], houses [(x, y, w, d, rot, roof)]."""
    x0, y0, bw, bh = box
    RDP = np.concatenate([densify(rd, 0.1) for rd in ROADS])
    wet = lambda x, y, m=1.0: sample(dist, box, np.array([[x, y]], np.float32))[0] < sample(hw, box, np.array([[x, y]], np.float32))[0] + m
    towns, streets, houses = [], [], []
    occ = []
    def put(px, py, w, d, rot, rc, gap=0.75):
        if wet(px, py, 1.2): return False
        if any((px - q[0]) ** 2 + (py - q[1]) ** 2 < (gap * min(w, 1.6)) ** 2 for q in occ[-160:]): return False
        occ.append((px, py)); houses.append((px, py, w, d, rot, rc)); return True
    for nm, (tx, ty, rad, cnt) in {**TOWNS, **TOWNS_EXTRA}.items():
        if not (x0 - rad < tx < x0 + bw + rad and y0 - rad < ty < y0 + bh + rad): continue
        if nm in TOWNS_EXTRA:   # snap to the nearest road (within 14 units)
            dd = np.hypot(RDP[:, 0] - tx, RDP[:, 1] - ty); j = int(dd.argmin())
            if dd[j] < 14: tx, ty = float(RDP[j, 0]), float(RDP[j, 1])
        if wet(tx, ty, 1.5): continue
        towns.append((nm, (tx, ty, rad)))
        rr = np.random.default_rng(sum(map(ord, nm)) + 11)
        near_rd = RDP[np.hypot(RDP[:, 0] - tx, RDP[:, 1] - ty) < rad * (1.6 if nm in GRID_TOWNS else 3.2)]
        if len(near_rd) > 4:
            j = int(np.hypot(near_rd[:, 0] - tx, near_rd[:, 1] - ty).argmin()); a_, b_ = near_rd[max(j - 5, 0)], near_rd[min(j + 5, len(near_rd) - 1)]
            ang = math.atan2(b_[1] - a_[1], b_[0] - a_[0])
        else: ang = rr.uniform(0, math.pi)
        u = np.array([math.cos(ang), math.sin(ang)]); v = np.array([-u[1], u[0]])
        if nm in GRID_TOWNS:   # street grid: long streets along the road direction, cross streets every block, houses fronting both sides
            B = GRID_TOWNS[nm]; R_ = rad * 1.35; m = int(R_ / B)
            for kind_, (du, dv) in ((0, (u, v)), (1, (v, u))):
                for k in range(-m, m + 1):
                    L = math.sqrt(max(R_ * R_ - (k * B) ** 2, 0)) * (1.0 if kind_ == 0 else 0.8)
                    if L < B: continue
                    pts = np.array([[tx, ty]], np.float32) + dv * k * B + du * np.linspace(-L, L, max(4, int(2 * L / 0.5)))[:, None]
                    ok = np.array([not wet(*q, 0.6) for q in pts])
                    if ok.sum() < 4: continue
                    pts = pts[ok]; streets.append((pts.astype(np.float32), 0.42))
                    if kind_ == 1: continue
                    for side in (1, -1):   # rows of houses along the long streets
                        a = rr.uniform(0, 0.6)
                        while a < 2 * L:
                            w = rr.uniform(0.7, 1.1); d = rr.uniform(0.42, 0.55)
                            c = np.array([tx, ty]) + dv * (k * B + side * (0.24 + d / 2 + 0.06)) + du * (-L + a + w / 2)
                            if rr.random() < 0.88: put(float(c[0]), float(c[1]), w, d, -ang, int(rr.integers(0, 4)), 0.5)
                            a += w + rr.uniform(0.15, 0.4)
                        # gable-on houses along the cross streets
            for k in range(-m, m + 1):
                for side in (1, -1):
                    for q in np.arange(-R_, R_, B):
                        c = np.array([tx, ty]) + u * (k * B + side * 0.6) + v * (q + B / 2)
                        if rr.random() < 0.3 and np.hypot(c[0] - tx, c[1] - ty) < R_: put(float(c[0]), float(c[1]), rr.uniform(0.6, 0.9), rr.uniform(0.42, 0.52), -ang - math.pi / 2, int(rr.integers(0, 4)), 0.55)
        else:   # star town: houses lining the roads through the centre, a short cross lane (v5b: bigger, so they read at wide scale)
            k = 0; tries = 0; cnt_ = int(cnt * 2.6); rad = rad * 2.4   # v6: 2-3x bigger star towns
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


def wide_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM wide ground: muted green-grey-olive mosaic that reads as mottled texture (GM 620/1090 s: ~(80,90,74), (98,106,87), (68,79,67))."""
    PAL = np.array([[72, 86, 66], [94, 104, 82], [108, 110, 88], [64, 78, 62], [124, 126, 102], [112, 104, 84], [86, 98, 82]], np.float32)   # v6: wider spread
    pr = np.array([0.24, 0.22, 0.14, 0.16, 0.10, 0.06, 0.08])
    ft = r.choice(len(PAL), n, p=pr / pr.sum())
    img = (PAL[ft] * r.uniform(0.94, 1.06, (n, 1)).astype(np.float32))[lab]
    img = cv2.GaussianBlur(img, (0, 0), cell * 0.12) * 0.6 + img * 0.4   # v5b: crisper field mosaic (push-in sharpness)
    m1 = fbm(TH // 4, TW // 4, 5, 6, seed + 8); m2 = fbm(TH // 4, TW // 4, 4, 30, seed + 14)
    mot = cv2.resize(m1 * 0.6 + m2 * 0.4, (TW, TH))
    img *= (1 + (mot[..., None] - 0.5) * 0.6)   # v6: more tonal spread (his wide SD ~30-37)
    img *= (1 + (cv2.resize(fbm(TH // 2, TW // 2, 3, 160, seed + 16), (TW, TH)) - 0.5)[..., None] * 0.16)   # v5b: fine mottle (his wide map is textured at every scale)
    # v6 detail layer for the push-in (14.6-15.5 s): each wide field split into strips / sub-parcels of slightly different tone
    ang = r.uniform(0, np.pi, n)[lab]; yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    si = np.floor((xx * np.cos(ang) + yy * np.sin(ang)) / (r.uniform(1.6, 3.6, n)[lab] * s)).astype(np.int64); del ang, yy, xx
    hv = ((((lab.astype(np.int64) * 131 + si * 7) * 2654435761) % 4294967296) / 4294967296.0).astype(np.float32); del si
    img *= cv2.GaussianBlur(1 + (hv - 0.5) * 0.08, (0, 0), 1.2)[..., None]; del hv
    g = cv2.resize(fbm(TH // 4, TW // 4, 4, 10, seed + 15), (TW, TH))[..., None]   # hue drift: olive <-> grey-green
    img = img * (1 - 0.25 * g) + np.array([86, 98, 88], np.float32) * 0.25 * g
    return img


def gm_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM close ground (v5), measured on GM 1814 640-700 s (k-means (157,134,112) (128,121,100) (94,100,90), woods (54,71,66)):
    big warm patches of sand / tan / stubble (~45 %), rust + ploughed brown (~15 %), olive (~25 %) and dark pasture (~15 %); neighbouring fields
    share a tone (large warm vs green regions), strip fields of alternating shades, brushed streaks + furrows along the strips, soft colour
    changes at the edges (no outlines), pale tracks on ~15 % of the edges + a few cart tracks across the fields, hedges as rare irregular
    clumps on ~8 % of the edges, small copses + lone trees, fine smooth grain. Returns (img, tree pts [x_px, y_px, kind])."""
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    hs_ = lambda v, k: (((v * 2654435761 + k * 40503) % 4294967296) / 4294967296.0).astype(np.float32)
    lab64 = lab.astype(np.int64); cnt = np.maximum(np.bincount(lab.ravel(), minlength=n), 1)
    cxf = np.bincount(lab.ravel(), xx.ravel(), minlength=n) / cnt; cyf = np.bincount(lab.ravel(), yy.ravel(), minlength=n) / cnt
    zone = cv2.resize(fbm(TH // 16, TW // 16, 3, 3, seed + 40), (TW, TH), interpolation=cv2.INTER_LINEAR)
    zf = zone[np.clip(cyf, 0, TH - 1).astype(int), np.clip(cxf, 0, TW - 1).astype(int)]   # zone at each field's centre
    # palette (texture values; the flat ground renders ~0.93 x): pale stubble, sand, sand 2, tan | rust, ploughed brown | olive, olive green | dark pasture x2
    PAL = np.array([[162, 152, 124], [158, 146, 118], [152, 140, 112], [144, 134, 108], [142, 110, 90], [130, 108, 94],
                    [118, 118, 102], [106, 110, 98], [88, 100, 92], [80, 94, 86]], np.float32)   # v6: lightest ~(150,140,108) rendered, less chroma   # v5b: sand less yellow, rust rarer and less orange
    PR = np.array([0.09, 0.14, 0.13, 0.10, 0.06, 0.07, 0.13, 0.12, 0.09, 0.07]); CUM = np.cumsum(PR / PR.sum())
    uf = np.clip(r.random(n) * 0.75 + (zf - 0.5) * 0.9 + 0.125, 0, 0.999)   # zone bias: warm regions vs green regions
    cf = np.minimum(np.searchsorted(CUM, uf), len(PAL) - 1)
    sang = r.uniform(0, np.pi, n); sw = r.uniform(0.2, 0.5, n) * s; split = r.random(n) < 0.6
    A = sang[lab]; vv = xx * np.cos(A) + yy * np.sin(A); uu = -xx * np.sin(A) + yy * np.cos(A); del A
    si = np.floor(vv / sw[lab]).astype(np.int64) * split[lab]
    sub = (lab64 * 131 + si * 7) % 1000003; del si
    # strip fields: most strips keep the field's crop at another shade, ~30 % take the neighbouring palette entry (tan <-> sand, olive <-> pasture)
    hop = np.where(hs_(sub, 7) < 0.18, np.where(hs_(sub, 8) < 0.5, -1, 1), 0) * split[lab]
    crop = np.clip(cf[lab] + hop, 0, len(PAL) - 1); del hop
    img = PAL[crop] * (0.94 + 0.10 * hs_(lab64, 4) + 0.07 * (hs_(sub, 3) - 0.5) * split[lab])[..., None]
    img = cv2.GaussianBlur(img, (0, 0), 1.8)   # v6: antialiased soft colour change at the edges (1.8 px at full res), no outline
    # brushed streaks along the strip direction (1-D noise across, slow drift along) + fine furrows
    nv = np.random.default_rng(seed + 50).random(int((TW + TH) * 2.2 / (0.025 * s)) + 8).astype(np.float32)
    nv = np.convolve(nv, np.ones(3) / 3, mode="same"); nv = (nv - nv.mean()) / (nv.std() + 1e-6)
    off = (hs_(lab64, 21) * 600).astype(np.int64)
    k_ = vv / (0.025 * s) + (TW + TH) * 1.05 / (0.025 * s)
    ki = np.clip(k_.astype(np.int64) + off, 0, len(nv) - 2); fr = k_ - np.floor(k_)
    streak = nv[ki] * (1 - fr) + nv[ki + 1] * fr; del ki, fr, k_, off
    drift = cv2.resize(fbm(TH // 8, TW // 8, 3, 18, seed + 52), (TW, TH))
    samp = np.array([0.016, 0.02, 0.02, 0.02, 0.026, 0.026, 0.014, 0.014, 0.01, 0.01], np.float32)[crop]   # v5b: subtle (his streaks are soft)
    fade = np.clip((cv2.resize(fbm(TH // 8, TW // 8, 3, 9, seed + 54), (TW, TH)) - 0.35) * 2.5, 0, 1)   # v6: streaks fade in and out
    img *= (1 + streak * samp * 0.5 * (0.5 + drift) * fade)[..., None]; del streak, drift
    fur = 0.6 * np.sin(vv / (0.075 * s) * np.pi * 2 + fbm(TH, TW, 3, 24, seed + 44) * 5) + 0.4 * np.sin(vv / (0.225 * s) * np.pi * 2 + cv2.resize(fbm(TH // 2, TW // 2, 3, 10, seed + 55), (TW, TH)) * 4)
    famp = np.array([0.008, 0.012, 0.012, 0.014, 0.028, 0.024, 0.008, 0.008, 0.005, 0.005], np.float32)[crop] * (0.5 + fbm(TH, TW, 3, 12, seed + 46))
    img *= (1 + fur * famp * 0.5 * fade)[..., None]; del fur, famp, vv, uu, fade
    # big soft damp / dry mottles (value only, no teal wash), mid mottles, fine smooth grain
    m1 = cv2.resize(fbm(TH // 4, TW // 4, 5, 5, seed + 41), (TW, TH)); m2 = cv2.resize(fbm(TH // 4, TW // 4, 4, 22, seed + 47), (TW, TH))
    mo = (m1 * 0.65 + m2 * 0.35 - 0.5)[..., None]; img *= (1 + mo * 0.33); del m1, m2, mo   # v6: big damp / dry patches back (x1.5)
    hz = cv2.resize(fbm(TH // 4, TW // 4, 4, 7, seed + 56), (TW, TH))[..., None]   # ... as hue shifts inside a field: damp olive <-> dry tan
    gw = np.clip((0.45 - hz) * 2.6, 0, 1) * 0.42; gd = np.clip((hz - 0.55) * 2.6, 0, 1) * 0.30
    img = img * (1 - gw - gd) + np.array([108, 112, 88], np.float32) * gw + np.array([158, 144, 110], np.float32) * gd; del hz, gw, gd
    img *= (1 + (fbm(TH, TW, 3, 90, seed + 42) - 0.5) * 0.05)[..., None]
    img += (cv2.GaussianBlur(np.random.default_rng(seed + 43).random((TH, TW), np.float32), (0, 0), 0.7)[..., None] - 0.5) * 4
    # parcel edges, one decision per edge (pair of fields), not per field outline
    lf = lab.astype(np.float32); k3 = np.ones((3, 3), np.uint8)
    lmax = cv2.dilate(lf, k3).astype(np.int64); lmin = cv2.erode(lf, k3).astype(np.int64); del lf
    edge = lmax != lmin; ph = hs_(lmin * 7919 + lmax, 12); del lmax, lmin
    # pale tracks on ~15 % of the edges
    tk = (edge & (ph < 0.15)).astype(np.float32)
    tk = np.clip(cv2.GaussianBlur(tk, (0, 0), 0.02 * s) * 1.6, 0, 1) * 0.7   # v6: soft, no scalloped verge
    # + a few curved cart tracks across the fields
    ct = np.zeros((TH, TW), np.uint8); rt = np.random.default_rng(seed + 53)
    for _ in range(int(TW * TH / (s * s) / 90)):
        p0 = rt.uniform(0, 1, 2) * [TW, TH]; a0 = rt.uniform(0, np.pi * 2); L = rt.uniform(3, 7) * s
        P = [p0 + np.array([math.cos(a0 + rt.normal(0, 0.25) * k), math.sin(a0 + rt.normal(0, 0.25) * k)]) * L * k / 3 for k in range(4)]
        cv2.polylines(ct, [np.round(catmull(P, 4) * 4).astype(np.int32)], False, 255, max(2, int(0.035 * s)), cv2.LINE_AA, shift=2)
    tk = np.maximum(tk, cv2.GaussianBlur(ct.astype(np.float32) / 255, (0, 0), 0.6) * 0.8)[..., None]; del ct
    img = img * (1 - 0.45 * tk) + np.array([168, 158, 128], np.float32) * 0.45 * tk; del tk
    # hedges: ~8 % of the edges, irregular clumps (clump 0.1-0.4 units, gaps 0.2-0.6), crowns placed by world.js (kind 2)
    hedge = (edge & (ph >= 0.15) & (ph < 0.23)).astype(np.uint8); del edge, ph
    ys_, xs_ = np.nonzero(hedge[::2, ::2]); P = np.stack([xs_ * 2, ys_ * 2], 1).astype(np.float32); del hedge
    rr = np.random.default_rng(seed + 45); step = 0.06 * s
    cellk = np.floor(P / step).astype(np.int64); _, first = np.unique(cellk[:, 0] * 100003 + cellk[:, 1], return_index=True); P = P[first]
    gc = 0.32 * s; G = rr.random((int(TH / gc) + 3, int(TW / gc) + 3)).astype(np.float32)
    clump = cv2.resize(G, (int(G.shape[1] * gc), int(G.shape[0] * gc)), interpolation=cv2.INTER_CUBIC)
    P = P[clump[P[:, 1].astype(int), P[:, 0].astype(int)] > 0.52]
    P += rr.uniform(-0.03, 0.03, P.shape).astype(np.float32) * s
    # copses (3-8 trees) + lone field trees
    nC = int(TW * TH / (s * s) * 0.012); C = rr.uniform(0, 1, (nC, 2)) * [TW, TH]
    cop = np.concatenate([c + rr.normal(0, 0.16, (int(rr.integers(3, 9)), 2)) * s for c in C]) if nC else np.zeros((0, 2))
    L = np.concatenate([cop, rr.uniform(0, 1, (int(TW * TH / (s * s) * 0.03), 2)) * [TW, TH]]).astype(np.float32)
    P = np.concatenate([np.c_[P, np.full(len(P), 2)], np.c_[L, np.full(len(L), 3)]]).astype(np.float32)
    return np.clip(img, 0, 255), P


ROOFS = 7   # roof colour index range (world.js: reds, orange, brown, slate)
WT = (0.86, 0.60)   # v6 wide forest thresholds (cover ~25 %)
HS, FS = 0.62, 0.66   # v5: town houses / farmsteads scaled down (critic: his houses are small, in dense rows)

def close_town(dist, hw, box, h):
    """Close-map settlements (GM: packed roofs along streets, varied colours and orientations, a church, gardens).
    Bovina = main street on the Vicksburg road + three cross streets + a back lane, rows of houses on both sides, sheds,
    back gardens, church with tower; farmsteads = house + barn + sheds round a yard, garden, small orchard.
    Returns build [(x, y, w, d, ang, roof, kind)] (ang = long axis map angle; kind 0 house, 1 church, 2 tower), streets, gardens, yards, trees, clear."""
    rr = np.random.default_rng(1863); x0, y0, bw, bh = box; G = 24   # occupancy grid px per unit
    occ = np.zeros((int(bh * G), int(bw * G)), np.uint8)
    build, streets, gardens, yards, trees, clear = [], [], [], [], [], []
    wet = lambda x, y: sample(dist, box, np.array([[x, y]], np.float32))[0] < sample(hw, box, np.array([[x, y]], np.float32))[0] + 0.35
    def rect(x, y, w, d, ang, pad=0.0):
        c, s_ = math.cos(ang), math.sin(ang); w2, d2 = w / 2 + pad, d / 2 + pad
        return np.array([[(x + c * a - s_ * b - x0) * G, (y + s_ * a + c * b - y0) * G] for a, b in ((-w2, -d2), (w2, -d2), (w2, d2), (-w2, d2))], np.int32)
    def free(x, y, w, d, ang):
        m = np.zeros_like(occ); cv2.fillPoly(m, [rect(x, y, w, d, ang, 0.004)], 1)
        return not (m & occ).any() and not wet(x, y)
    def put(x, y, w, d, ang, rc, kind=0, force=False):
        if not force and not free(x, y, w, d, ang): return False
        cv2.fillPoly(occ, [rect(x, y, w, d, ang)], 1); build.append((x, y, w, d, ang, rc, kind)); return True
    def street(pts, wdt):
        pts = np.asarray(pts, np.float32); streets.append((pts, wdt))
        cv2.polylines(occ, [np.round((pts - [x0, y0]) * G).astype(np.int32)], False, 1, max(1, int(wdt * G * 0.6)))   # v6: thinner on the occupancy grid (the rows failed against it)
    roof = lambda: int(rr.choice(ROOFS, p=[0.26, 0.22, 0.16, 0.12, 0.12, 0.06, 0.06]))
    # ---- Bovina ----
    bx, by = TOWNS["Bovina"][:2]; clear.append((bx, by, 4.5))
    # the Vicksburg road passes ~3.6 units north: main street through the centre, parallel to it, joined to it by a lane
    RD = densify(ROADS[0], 0.05); j = int(np.hypot(RD[:, 0] - bx, RD[:, 1] - by).argmin())
    td = RD[min(j + 20, len(RD) - 1)] - RD[max(j - 20, 0)]; td /= np.linalg.norm(td)
    u = np.linspace(-2.8, 2.8, 48)[:, None]; main = np.array([bx, by], np.float32) + td * u + np.array([-td[1], td[0]]) * (0.12 * np.sin(u[:, :1] * 0.9))
    main = main[[not wet(*q) for q in main]].astype(np.float32)
    street(main, 0.2)
    link = densify([main[int(len(main) * 0.62)], RD[j + 8]], 0.1); street(link, 0.16)
    streets_local = [(main, 0.2), (link, 0.16)]
    tang = lambda P, i: (lambda v: v / (np.linalg.norm(v) + 1e-6))(P[min(i + 2, len(P) - 1)] - P[max(i - 2, 0)])
    cross = []
    for f, L1, L2 in ((0.12, 1.3, 1.1), (0.28, 1.8, 1.6), (0.44, 2.2, 2.0), (0.6, 1.9, 2.2), (0.76, 1.6, 1.8), (0.9, 1.2, 1.3)):   # round 2: 6 cross streets
        i = int(f * (len(main) - 1)); p = main[i]; t = tang(main, i); nrm = np.array([-t[1], t[0]])
        for side, L in ((1, L1), (-1, L2)):
            u = np.linspace(0.12, L, 14)[:, None]; bend = rr.uniform(-0.15, 0.15)
            pts = p + nrm * side * u + t * bend * (u / L) ** 2
            ok = [not wet(*q) for q in pts]; k = len(ok) if all(ok) else ok.index(False)
            if k > 4: street(pts[:k], 0.15); streets_local.append((pts[:k], 0.15)); cross.append((p, nrm * side, t, pts[:k]))
    for sgn in (1, -1):   # back lanes joining the cross-street ends on each side
      ends = [c[3][-1] for c in cross if np.dot(c[1], [0, -1]) * sgn > 0]
      if len(ends) >= 2:
        ends = sorted(ends, key=lambda q: q[0]); lane = np.concatenate([densify([ends[k], ends[k + 1]], 0.1) for k in range(len(ends) - 1)])
        lane += rr.normal(0, 0.03, lane.shape).astype(np.float32)
        if not any(wet(*q) for q in lane[::3]): street(lane, 0.13); streets_local.append((lane, 0.13))
    # church on the middle cross street, set back on a small square
    if cross:
        p, nv, t, _ = cross[len(cross) // 2]; ang = math.atan2(nv[1], nv[0])
        c = p + nv * 0.55 + t * 0.42
        yards.append((float(c[0] - t[0] * 0.05), float(c[1] - t[1] * 0.05), 0.55, 0.4, ang, 1))
        put(float(c[0]), float(c[1]), 0.48, 0.21, ang, 5, 1)
        tw = c - nv * 0.3; put(float(tw[0]), float(tw[1]), 0.12, 0.12, ang, 5, 2, force=True)
    # parallel streets either side of the main street (round 2: packed quarters, his 800 s town)
    for off in (1.05, -1.05):
        nm_ = np.array([-(main[-1] - main[0])[1], (main[-1] - main[0])[0]]); nm_ /= np.linalg.norm(nm_)
        par = main[4:-4] + nm_ * off + rr.normal(0, 0.02, main[4:-4].shape).astype(np.float32)
        ok = [not wet(*q) for q in par]
        if sum(ok) > 8: par = par[np.array(ok)]; street(par, 0.14); streets_local.append((par, 0.14))
    # rows of houses along every street, both sides, gable-on houses mixed in, sheds and gardens behind
    def rows(slist, cx, cy, rad):
      for pts, wdt in slist:
        arc = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]; Ltot = arc[-1]
        for side in (1, -1):
            a = rr.uniform(0.05, 0.2)
            while a < Ltot - 0.15:
                i = int(np.searchsorted(arc, a)); i = min(i, len(pts) - 1); t = tang(pts, i); nrm = np.array([-t[1], t[0]]) * side
                ang = math.atan2(t[1], t[0])
                if rr.random() < 0.04: a += rr.uniform(0.15, 0.3); continue   # gap: a garden reaches the street
                gable = rr.random() < 0.28
                w = HS * (rr.uniform(0.17, 0.24) if gable else rr.uniform(0.22, 0.42)); d = HS * (rr.uniform(0.32, 0.44) if gable else rr.uniform(0.16, 0.22))   # v5: houses x0.62 (his are small)
                setb = wdt / 2 + d / 2 + rr.uniform(0.03, 0.05)
                i = min(int(np.searchsorted(arc, a + w / 2)), len(pts) - 1)   # centre the house on its own frontage
                c = pts[i] + nrm * setb
                inside = np.hypot(c[0] - cx, c[1] - cy) < rad
                ok_ = inside and put(float(c[0]), float(c[1]), w, d, ang, roof())
                if not ok_ and inside and not gable:   # squeeze a smaller house in
                    w, d = w * 0.7, d * 0.85; c = pts[i] + nrm * (wdt / 2 + d / 2 + 0.03); ok_ = put(float(c[0]), float(c[1]), w, d, ang, roof())
                if ok_:
                    if gable: build[-1] = (build[-1][0], build[-1][1], d, w, ang + math.pi / 2, build[-1][5], 0)   # long axis across the street
                    back = setb + d / 2
                    if rr.random() < 0.55:   # sheds / back houses behind (packed yards)
                        sc_ = pts[i] + nrm * (back + 0.09) + t * rr.uniform(-0.06, 0.06); put(float(sc_[0]), float(sc_[1]), HS * rr.uniform(0.16, 0.28), HS * rr.uniform(0.12, 0.17), ang + math.pi / 2, roof())
                    gc = pts[i] + nrm * (back + 0.24); gardens.append((float(gc[0]), float(gc[1]), w * 0.95, 0.3, ang, int(rr.integers(0, 4))))
                    if rr.random() < 0.18: q = gc + t * rr.uniform(-0.1, 0.1) + nrm * rr.uniform(0.0, 0.15); trees.append((float(q[0]), float(q[1]), float(rr.uniform(0.6, 0.95))))
                a += w + rr.uniform(0.008, 0.025)
    rows(streets_local, bx, by, 4.3)
    def infill(cx, cy, rad, base_ang, tries):   # packed back-lots: small houses / barns wherever the blocks still have room
        for _ in range(tries):
            r_ = rad * math.sqrt(rr.random()); th = rr.random() * 6.283; x_, y_ = cx + r_ * math.cos(th), cy + r_ * math.sin(th)
            put(x_, y_, HS * rr.uniform(0.2, 0.38), HS * rr.uniform(0.15, 0.21), base_ang + (math.pi / 2 if rr.random() < 0.4 else 0) + rr.uniform(-0.06, 0.06), roof())
    tdir = main[-1] - main[0]   # v6: no random back-lot infill (it made round 'wool balls'); rows along the streets only
    # ---- hamlets nearer the centre of the close shots (round 2): a lane + a short cross lane, packed rows ----
    for hx, hy, ha, hl in ((1517.2, 714.2, 0.1, 2.8), (1528.2, 692.4, -0.25, 2.6), (1504.0, 711.6, 1.2, 2.4)):
        clear.append((hx, hy, 1.9)); u_ = np.array([math.cos(ha), math.sin(ha)]); v_ = np.array([-u_[1], u_[0]])
        uu = np.linspace(-hl / 2, hl / 2, 24)[:, None]; lane = (np.array([hx, hy]) + u_ * uu + v_ * 0.12 * np.sin(uu * 1.3)).astype(np.float32)
        lane = lane[np.array([not wet(*q) for q in lane])]
        if len(lane) < 6: continue
        cl_ = (np.array([hx, hy]) + u_ * 0.25 + v_ * np.linspace(-0.7, 0.8, 10)[:, None]).astype(np.float32); cl_ = cl_[np.array([not wet(*q) for q in cl_])]
        hs_l = [(lane, 0.15)]; street(lane, 0.15)
        if len(cl_) > 4: street(cl_, 0.12); hs_l.append((cl_, 0.12))
        rows(hs_l, hx, hy, 1.9)
    # ---- farmsteads ----
    FARMS = [(1530.5, 701.5), (1534.0, 711.2), (1505.2, 693.4), (1541.8, 704.4), (1526.6, 719.6), (1537.5, 696.0), (1546.0, 712.5),
             (1509.0, 700.2), (1500.0, 716.5), (1536.0, 719.5), (1512.5, 690.0), (1548.5, 699.0)]
    for fx, fy in FARMS:
        a = rr.uniform(0, math.pi); u = np.array([math.cos(a), math.sin(a)]) * FS; v = np.array([-u[1], u[0]]); L = lambda p, q: np.array([fx, fy]) + u * p + v * q
        clear.append((fx, fy, 1.1)); yc = L(0.12, 0.38); yards.append((float(yc[0]), float(yc[1]), 0.55 * FS, 0.42 * FS, a, 0))
        for (p, q, ln, rot) in ((0.12, 0.38 - 0.42, 0.95, 0), (0.12 - 0.5, 0.38, 0.8, 1), (0.12 + 0.5, 0.38, 0.8, 1)):   # low courtyard walls round the yard (kind 3)
            c = L(p, q); build.append((float(c[0]), float(c[1]), ln * FS, 0.022, a + rot * math.pi / 2, 0, 3))
        c = L(0, 0); put(float(c[0]), float(c[1]), FS * rr.uniform(0.42, 0.55), FS * rr.uniform(0.19, 0.24), a, roof())
        c = L(0.62, 0.42); put(float(c[0]), float(c[1]), FS * rr.uniform(0.62, 0.8), FS * rr.uniform(0.26, 0.32), a + math.pi / 2, int(rr.choice([3, 4, 0])))   # barn
        for (p, q, w, d, rot) in [(0.05, 0.85, 0.34, 0.18, 0), (-0.45, 0.4, 0.28, 0.16, 1), (0.3, -0.35, 0.24, 0.15, 0), (-0.35, 0.95, 0.2, 0.14, 1)][: int(rr.integers(2, 5))]:
            c = L(p + rr.uniform(-0.04, 0.04), q + rr.uniform(-0.04, 0.04)); put(float(c[0]), float(c[1]), FS * w * rr.uniform(0.85, 1.15), FS * d, a + rot * math.pi / 2, roof())
        gc = L(-0.62, -0.32); gardens.append((float(gc[0]), float(gc[1]), 0.55 * FS, 0.42 * FS, a, int(rr.integers(0, 4))))
        for i in range(3):
            for j in range(3):
                if rr.random() < 0.7: q = L(1.05 + i * 0.2 + rr.uniform(-0.04, 0.04), -0.45 + j * 0.2 + rr.uniform(-0.04, 0.04)); trees.append((float(q[0]), float(q[1]), float(rr.uniform(0.5, 0.75))))
    return dict(build=build, streets=streets, gardens=gardens, yards=yards, trees=trees, clear=clear)


def paint_town(img, town, Pt, s):
    """yards (bare trodden earth), kitchen gardens (green / brown beds with a dark hedge edge) into the ground texture"""
    TH, TW = img.shape[:2]
    def poly(x, y, w, d, ang):
        c, s_ = math.cos(ang), math.sin(ang)
        return np.array([Pt((x + c * a - s_ * b, y + s_ * a + c * b)) for a, b in ((-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2))], np.float32)
    ym = np.zeros((TH, TW), np.float32)
    for (x, y, rx, ry, ang, kind) in town["yards"]:
        c = Pt((x, y)); cv2.ellipse(ym, (int(c[0]), int(c[1])), (int(rx * s), int(ry * s)), math.degrees(ang), 0, 360, 1.0 if kind == 0 else 0.8, -1)
    ym = cv2.GaussianBlur(ym, (0, 0), 0.06 * s)[..., None]
    img = img * (1 - 0.7 * ym) + np.array([132, 118, 94], np.float32) * 0.7 * ym; del ym
    GC = np.array([[92, 108, 72], [124, 112, 84], [84, 100, 68], [136, 124, 92]], np.float32)
    gm = np.zeros((TH, TW, 3), np.float32); ga = np.zeros((TH, TW), np.float32); ge = np.zeros((TH, TW), np.uint8)
    for (x, y, w, d, ang, k) in town["gardens"]:
        P = np.round(poly(x, y, w, d, ang) * 4).astype(np.int32)
        cv2.fillPoly(gm, [P], GC[k].tolist(), cv2.LINE_AA, shift=2); cv2.fillPoly(ga, [P], 1.0, cv2.LINE_AA, shift=2)
        cv2.polylines(ge, [P], True, 255, max(1, int(0.03 * s)), cv2.LINE_AA, shift=2)
    ga = ga[..., None] * 0.75; img = img * (1 - ga) + gm * ga; del gm, ga
    gef = cv2.GaussianBlur(ge.astype(np.float32) / 255, (0, 0), 1.0)[..., None] * 0.5
    img = img * (1 - gef) + np.array([64, 76, 56], np.float32) * gef
    return img

def to_map(lat, lon):
    z = 256 * 2 ** GEO["zoom"]; x = (lon + 180) / 360 * z; y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * z
    return x - GEO["origin_world_px"][0], y - GEO["origin_world_px"][1]

if __name__ == "__main__":
    data = {"geo": {"zoom": GEO["zoom"], "origin": GEO["origin_world_px"], "mpu": MPU}, "towns": {k: [v[0], v[1]] for k, v in TOWNS.items()}, "regions": {}}
    for nm in ("wide", "close"):
        d = bake(nm); data["regions"][nm] = d
        if nm == "wide": data["towns_wide"] = d.pop("towns")
        print(nm, "trees", len(d["trees"]), "houses", len(d["houses"]), "rivers", [(rv["name"], len(rv["pts"])) for rv in d["rivers"]], d.get("bridge"))
    open(f"{OUT}/world_data.js", "w").write("window.GM3D_DATA=" + json.dumps(data, separators=(",", ":")) + ";\n")
    print("data kB", os.path.getsize(f"{OUT}/world_data.js") // 1024)
