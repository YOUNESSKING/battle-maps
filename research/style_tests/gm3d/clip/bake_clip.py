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

REG = {"wide": dict(box=(1100, 370, 1000, 640), hm=(1500, 960), tex=(4096, 2622), cell=22.0, seed=11),
       "close": dict(box=(1474, 676, 84, 56), hm=(672, 448), tex=(4096, 2731), cell=5.2, seed=21)}
TOWNS = {   # map units, radius (units), houses; Bovina just west of the bridge on the Vicksburg road
    "Vicksburg": (1388, 681, 7.0, 90), "Jackson": (1885, 724, 7.5, 90), "Edwards": (1599.4, 716.4, 2.6, 26),
    "Bovina": (1495.5, 701.2, 2.2, 34), "Raymond": (1716, 759, 2.4, 22), "Bolton": (1700, 712, 1.6, 12)}

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
    return [("big_black", smooth(densify(pts, 0.12), 8), 0.62)]

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
    # ---- breastworks (close): low earth parapet along the cotton-bale line ----
    bw_line = None
    if name == "close":
        ys = np.linspace(697.2, 712.4, 60); xs = 1520.6 + 0.9 * np.sin((ys - 697.2) / 15.2 * np.pi)
        bw_line = np.stack([xs, ys], 1)
        par = np.zeros((HH, HW), np.uint8)
        cv2.polylines(par, [np.round(np.stack([(xs - x0) * upx_h, (ys - y0) * upx_h], 1) * 4).astype(np.int32)], False, 255, int(0.5 * upx_h * 4) // 4 + 2, cv2.LINE_AA, shift=2)
        h += cv2.GaussianBlur(par.astype(np.float32) / 255, (0, 0), 0.12 * upx_h) * 2.4
    # ---- ground texture (v4: palette, mottling and relief measured on GM 1814, close 640-700 / 910-950 s, wide 290-1140 s) ----
    s = TW / bw; Pt = lambda q_: ((q_[0] - x0) * s, (q_[1] - y0) * s)
    ht = cv2.resize(h, (TW, TH), interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) * s / MPU; gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) * s / MPU
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.006 * TW); slope /= np.percentile(slope, 99) + 1e-6
    del gx, gy
    r = np.random.default_rng(seed); cell = R["cell"] * s
    # Voronoi fields on a jittered grid, edges warped by noise (worked at 1/2 res, then upsampled nearest)
    LW, LH = TW // 2, TH // 2; cs = cell / 2
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
    townmask = np.zeros((TH, TW), np.float32)
    for nm, (tx, ty, rad, _) in TOWNS.items():
        cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s * 1.1), 1.0, -1)
    if town:
        for (tx, ty, rad) in town["clear"]: cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s), 1.0, -1)
    if bw_line is not None:
        cv2.polylines(townmask, [np.round(np.array([Pt(p) for p in bw_line])).astype(np.int32)], False, 1.0, int(4.0 * s))   # clear field of fire
    road0 = np.zeros((TH, TW), np.uint8)
    for rd in ROADS: cv2.polylines(road0, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, max(3, int((1.6 if name == "wide" else 0.5) * s)), cv2.LINE_8, shift=2)
    # forest mask. close: jagged broken outline (fine noise in the threshold) + a few clearings; wide: many small woods everywhere (GM)
    fm = fbm(TH, TW, 6, 5, seed + 2)
    fm2 = fbm(TH, TW, 3, int(bw / (14 if name == "wide" else 1.6)), seed + 12)   # small woodlots
    if name == "close":
        jag = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 0.7), seed + 60), (TW, TH))
        fbase = fm * 0.7 + fm2 * 0.3 + near * 0.3 + slope * 0.5 - 0.72 + (jag - 0.5) * 0.22
        del jag
    else:
        fm3 = fbm(TH, TW, 4, int(bw / 16), seed + 13)
        fbase = np.maximum(fm * 0.7 + fm2 * 0.3 + near * 0.45 + slope * 0.5 - 0.82, fm3 * 0.75 + fm * 0.25 - 0.62)
        del fm3
    forest = np.clip(fbase * 12, 0, 1); del fbase, fm2
    forest *= (1 - road0.astype(np.float32) / 255)
    forest *= (1 - cv2.GaussianBlur(townmask, (0, 0), 0.006 * TW)); forest *= (dist_t > hw_t + (0.6 if name == "wide" else 0.12))
    if name == "close":   # clearings / gaps inside the woods
        holes = cv2.resize(fbm(TH // 4, TW // 4, 3, int(bw / 1.4), seed + 61), (TW, TH)); forest *= (holes < 0.76); del holes
    forest = (cv2.GaussianBlur(forest, (0, 0), 0.5 if name == "close" else 1.0) > 0.5).astype(np.float32); forest = cv2.GaussianBlur(forest, (0, 0), 0.7)
    crown = fbm(TH, TW, 2, int(bw / (0.6 if name == "wide" else 0.09)), seed + 3)   # tree crowns speckle
    fdark = cv2.GaussianBlur(forest, (0, 0), 0.004 * TW)   # darker inside, lighter rim
    fcol = (hexc("#22362f") if name == "close" else hexc("#33463a"))[None, None] * (0.70 + 0.6 * crown[..., None]) * (1.12 - 0.22 * fdark[..., None])
    img = img * (1 - forest[..., None]) + fcol * forest[..., None]; del fcol, crown, fdark
    ao = np.clip(cv2.GaussianBlur(forest, (0, 0), 0.0025 * TW) - forest, 0, 1)   # shade on the ground next to woods
    img *= (1 - 0.40 * ao)[..., None]; del ao
    # river banks + floodplain: greener, damper ground along the water, muddy bank at the edge
    flood = np.clip(1 - (dist_t - hw_t) / (6.0 if name == "wide" else 1.4), 0, 1)[..., None] * (1 - forest[..., None])
    img = img * (1 - 0.35 * flood) + (hexc("#6f7a62") if name == "wide" else hexc("#7d8466")) * 0.35 * flood
    bank = np.clip(1 - (dist_t - hw_t) / (0.7 if name == "wide" else 0.18), 0, 1)[..., None]
    img = img * (1 - bank * 0.85) + hexc("#77765f") * bank * 0.85; del flood, bank
    # town ground: yards, gardens, streets (close)
    if town: img = paint_town(img, town, Pt, s)
    # roads: red-brown dirt roads
    road = np.zeros((TH, TW), np.uint8); rwpx = max(3, int((0.9 if name == "wide" else 0.24) * s))
    for rd in ROADS:
        pts = np.array([Pt(p) for p in rd], np.float32)
        cv2.polylines(road, [np.round(pts * 4).astype(np.int32)], False, 255, rwpx, cv2.LINE_AA, shift=2)
    if town:
        for st, wdt in town["streets"]: cv2.polylines(road, [np.round(np.array([Pt(p) for p in st], np.float32) * 4).astype(np.int32)], False, 255, max(3, int(wdt * s)), cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32)[..., None] / 255
    rcol = hexc("#7a5940") if name == "close" else hexc("#7d6650")
    img = img * (1 - rdm * 0.85) + rcol * (1 + (cv2.resize(fbm(TH // 8, TW // 8, 3, 40, seed + 70), (TW, TH))[..., None] - 0.5) * 0.25) * rdm * 0.85; del rdm, road
    tg = cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)[..., None] * (0.18 if name == "wide" else 0.0); img = img * (1 - tg) + hexc("#8c7b66") * tg
    if bw_line is not None:   # trench spoil in front of the parapet
        sp = np.zeros((TH, TW), np.uint8); cv2.polylines(sp, [np.round(np.array([Pt((p[0] + 0.3, p[1])) for p in bw_line]) * 4).astype(np.int32)], False, 255, int(0.25 * s), cv2.LINE_AA, shift=2)
        spf = cv2.GaussianBlur(sp.astype(np.float32) / 255, (0, 0), 2)[..., None] * 0.7; img = img * (1 - spf) + hexc("#6e5a44") * spf
    # baked relief shading (slope + aspect to the NW sun, multi-scale), on top of three.js lighting: GM's soft hills and sunlit valley sides
    exag = 14.0 if name == "wide" else 6.0
    shade = np.ones((TH, TW), np.float32)
    sun = np.array([-0.7, 0.48, -0.4], np.float32); sun /= np.linalg.norm(sun)
    for sig, wgt in ((0.0015, 0.5), (0.005, 0.5)) if name == "wide" else ((0.004, 0.6), (0.012, 0.4)):
        hb = cv2.GaussianBlur(ht, (0, 0), sig * TW) * exag / MPU
        dz, dx = np.gradient(hb); dx *= s; dz *= s
        lam = (-dx * sun[0] + sun[1] - dz * sun[2]) / np.sqrt(dx * dx + 1 + dz * dz)
        shade += wgt * (np.clip(lam, 0, 1) / sun[1] - 1)
        del hb, dz, dx, lam
    if name == "wide":
        k = 0.55; img *= (1 + k * (shade - 1))[..., None]
        lit = np.clip((shade - 1.06) * 2.2, 0, 1)[..., None] * (1 - 0.6 * forest[..., None])   # GM: sunlit valley sides go pale grey-green
        img = img * (1 - 0.55 * lit) + hexc("#c4c4ae") * 0.55 * lit; del lit
    else:
        img *= (1 + 0.45 * (shade - 1))[..., None]
    del shade, ht
    img = np.clip(img + (fbm(TH, TW, 3, 60, seed + 9)[..., None] - 0.5) * 7, 0, 255)
    lum = img.mean(-1, keepdims=True); img = np.clip((img * 0.86 + lum * 0.14) * np.array([0.98, 1.0, 1.02], np.float32), 0, 255)   # GM: muted, slightly cool
    cv2.imwrite(f"{OUT}/ground_{name}.jpg", img[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90]); del img, lum
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
        keep = r.random(len(G)) < np.clip((fval - 0.25) * 3.0, 0, 1)
        T = G[keep]; e = np.clip(sample(fin, box, T) / 0.7, 0, 1)
        kind = (r.random(len(T)) < 0.08).astype(int)
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
            lists.append((HP.astype(np.float32), hk_, np.where(hk_ == 2, r.uniform(0.55, 1.05, len(HP)), r.uniform(0.8, 1.3, len(HP))), r.uniform(0, 1, len(HP)), np.zeros(len(HP))))
        if town and town["trees"]:
            TT = np.array(town["trees"], np.float32); lists.append((TT[:, :2], np.full(len(TT), 3), TT[:, 2], r.uniform(0, 1, len(TT)), np.zeros(len(TT))))
        for T_, k_, s_, c_, e_ in lists:
            th_ = sample(h, box, T_.astype(np.float32))
            trees += [[round(float(a), 3), round(float(b), 3), round(float(c), 1), int(k), round(float(sv), 2), round(float(f), 2), round(float(ev), 2)] for (a, b), c, k, sv, f, ev in zip(T_, th_, k_, s_, c_, e_)]
    # ---- houses: wide = long red-roofed houses lining the roads through each town; close = the town plan ([x, z, h, w, d, rot, roof, kind]) ----
    houses = []; hsz = (2.2, 0.9)
    if name == "wide":
        RDP = np.concatenate([densify(rd, 0.1) for rd in ROADS])
        for nm, (tx, ty, rad, cnt) in TOWNS.items():
            if not (x0 - rad < tx < x0 + bw + rad and y0 - rad < ty < y0 + bh + rad): continue
            rr = np.random.default_rng(sum(map(ord, nm)) + seed); k = 0; tries = 0
            rad_ = rad * 1.25; cnt_ = cnt
            near_rd = RDP[np.hypot(RDP[:, 0] - tx, RDP[:, 1] - ty) < rad_]
            while k < cnt_ and tries < cnt_ * 30:
                tries += 1
                if len(near_rd) > 4 and rr.random() < 0.7:
                    j = int(rr.integers(1, len(near_rd) - 1)); a_, b_ = near_rd[j - 1], near_rd[j + 1]; ra = math.atan2(b_[1] - a_[1], b_[0] - a_[0])
                    off = (hsz[1] * rr.uniform(1.0, 2.6)) * rr.choice([-1, 1]); px, py = near_rd[j][0] - math.sin(ra) * off, near_rd[j][1] + math.cos(ra) * off
                    rot = -ra + (rr.choice([0, math.pi / 2]) if rr.random() < 0.25 else 0)
                else:
                    d = rad_ * math.sqrt(rr.random()); t = rr.random() * 6.283; px, py = tx + d * math.cos(t), ty + d * math.sin(t); rot = math.radians(rr.uniform(0, 180))
                if math.hypot(px - tx, py - ty) > rad_: continue
                P_ = np.array([[px, py]], np.float32)
                if sample(dist, box, P_)[0] < sample(hw, box, P_)[0] + hsz[0]: continue
                if any((px - q[0]) ** 2 + (py - q[1]) ** 2 < (hsz[0] * 0.8) ** 2 for q in houses[-60:]): continue
                houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, P_)[0]), 1), round(hsz[0] * rr.uniform(0.6, 1.3), 3), round(hsz[1] * rr.uniform(0.8, 1.2), 3), round(rot, 3), int(rr.integers(0, 4)), 0]); k += 1
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
        bl = bw_line; bh_ = sample(h, box, bl.astype(np.float32))
        extra["breastworks"] = [[round(float(a), 3), round(float(b), 3), round(float(c), 2)] for (a, b), c in zip(bl, bh_)]
    return dict(box=list(box), hm=[HW, HH], tex=[TW, TH], rivers=rivs, trees=trees, houses=houses, **extra)


def wide_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM wide ground: muted green-grey-olive mosaic that reads as mottled texture (GM 620/1090 s: ~(80,90,74), (98,106,87), (68,79,67))."""
    PAL = np.array([[84, 96, 74], [96, 104, 82], [104, 106, 84], [78, 90, 72], [114, 116, 94], [110, 102, 84], [90, 100, 84]], np.float32)
    pr = np.array([0.24, 0.22, 0.14, 0.16, 0.10, 0.06, 0.08])
    ft = r.choice(len(PAL), n, p=pr / pr.sum())
    img = (PAL[ft] * r.uniform(0.94, 1.06, (n, 1)).astype(np.float32))[lab]
    img = cv2.GaussianBlur(img, (0, 0), cell * 0.25) * 0.7 + img * 0.3
    m1 = fbm(TH // 4, TW // 4, 5, 6, seed + 8); m2 = fbm(TH // 4, TW // 4, 4, 30, seed + 14)
    mot = cv2.resize(m1 * 0.6 + m2 * 0.4, (TW, TH))
    img *= (1 + (mot[..., None] - 0.5) * 0.30)
    g = cv2.resize(fbm(TH // 4, TW // 4, 4, 10, seed + 15), (TW, TH))[..., None]   # hue drift: olive <-> grey-green
    img = img * (1 - 0.25 * g) + np.array([86, 98, 88], np.float32) * 0.25 * g
    return img


def gm_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM close ground (v4): soft-edged, low-contrast field mosaic in olive / ochre / grey-green (k-means of GM 660-670 s:
    (151,145,114) (141,131,100) (128,123,95) (116,114,91) (102,110,96) (82,97,90)), big damp mottles, faint strips and furrows,
    faint boundaries; continuous hedgerows on ~20 % of parcel edges. Returns (img, tree pts [x_px, y_px, kind])."""
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    zone = cv2.resize(fbm(TH // 16, TW // 16, 3, 3, seed + 40), (TW, TH), interpolation=cv2.INTER_LINEAR)
    sang = r.uniform(0, np.pi, n); sw = r.uniform(0.18, 0.45, n) * cell; split = r.random(n) < 0.55
    A = sang[lab]; si = np.floor((xx * np.cos(A) + yy * np.sin(A)) / sw[lab]).astype(np.int64) * split[lab]
    sub = (lab.astype(np.int64) * 131 + si * 7) % 1000003
    del A, si
    hs_ = lambda v, k: (((v * 2654435761 + k * 40503) % 4294967296) / 4294967296.0).astype(np.float32)
    up = hs_(lab.astype(np.int64), 1); us = hs_(sub, 1)
    PAL = np.array([[140, 130, 101], [130, 120, 93], [121, 116, 91], [110, 110, 89], [98, 105, 90], [84, 96, 86], [134, 113, 90]], np.float32)
    p0 = np.clip(0.18 + (zone - 0.45) * 0.8, 0.05, 0.4)   # ochre/tan share follows a big zone
    def cp(u_):
        c = np.full(u_.shape, 3, np.int64)
        c = np.where(u_ < p0 + 0.48, 4, c); c = np.where(u_ < p0 + 0.32, 3, c); c = np.where(u_ < p0 + 0.16, 2, c)
        c = np.where(u_ < p0, 1, c); c = np.where(u_ < p0 * 0.45, 0, c); c = np.where(u_ > 0.9, 5, c); c = np.where(u_ > 0.975, 6, c)
        return c
    crop = np.where(hs_(sub, 7) < 0.25, cp(us), cp(up)); del up, us
    img = PAL[crop] * (0.96 + 0.08 * hs_(sub, 3))[..., None]
    img = cv2.GaussianBlur(img, (0, 0), 0.05 * s)   # soft field edges
    # big damp / dry mottles (green-grey patches drifting across fields), mid mottles, fine grain
    m1 = cv2.resize(fbm(TH // 4, TW // 4, 5, 5, seed + 41), (TW, TH)); m2 = cv2.resize(fbm(TH // 4, TW // 4, 4, 22, seed + 47), (TW, TH))
    img *= (1 + (m1 * 0.6 + m2 * 0.4 - 0.5)[..., None] * 0.20)
    g = np.clip((cv2.resize(fbm(TH // 4, TW // 4, 4, 8, seed + 48), (TW, TH)) - 0.45) * 2.0, 0, 1)[..., None]
    img = img * (1 - 0.30 * g) + np.array([98, 108, 94], np.float32) * 0.30 * g; del g, m1, m2
    img *= (1 + (fbm(TH, TW, 3, 90, seed + 42) - 0.5) * 0.08)[..., None]
    img += (np.random.default_rng(seed + 43).random((TH, TW), np.float32)[..., None] - 0.5) * 6
    # furrows / drill rows: faint, direction follows the strip
    fang = np.where(r.random(n) < 0.7, sang, r.uniform(0, np.pi, n))[lab]
    fur = np.sin((xx * np.cos(fang) + yy * np.sin(fang)) / (0.07 * s) * np.pi + fbm(TH, TW, 3, 24, seed + 44) * 6)
    famp = np.array([0.014, 0.014, 0.011, 0.006, 0.005, 0.004, 0.018], np.float32)[crop] * (0.4 + 1.2 * fbm(TH, TW, 3, 12, seed + 46))
    img *= (1 + fur * famp)[..., None]; del fur, fang, famp, xx, yy
    # boundaries: faint light grass verge + thin darker line on parcel edges, very faint on strip edges
    edge_sub = (cv2.Laplacian(sub.astype(np.float32), cv2.CV_32F) != 0).astype(np.float32)
    edge_par = (cv2.Laplacian(lab.astype(np.float32), cv2.CV_32F) != 0).astype(np.uint8)
    verge = np.clip(cv2.GaussianBlur(edge_sub, (0, 0), 0.015 * s) * 2.5, 0, 1)[..., None]
    img = img * (1 - 0.10 * verge) + np.array([150, 148, 120], np.float32) * 0.10 * verge
    pl = cv2.GaussianBlur(edge_par.astype(np.float32), (0, 0), 0.01 * s)[..., None]
    img *= (1 - 0.10 * np.clip(pl * 2, 0, 1)); del verge, pl, edge_sub
    # hedgerows: ~20 % of parcel edges, continuous tree lines (gaps come in runs, not single dots)
    pid = lab.astype(np.int64); keep = (hs_(pid, 9) < 0.16) | (hs_(pid, 10) < 0.06)
    hedge = cv2.dilate((edge_par * keep).astype(np.uint8), np.ones((3, 3), np.uint8)); del pid, keep, edge_par
    hb = np.clip(cv2.GaussianBlur(hedge.astype(np.float32), (0, 0), 0.04 * s) * 2.2, 0, 1)[..., None]
    img = img * (1 - 0.45 * hb) + np.array([52, 68, 56], np.float32) * 0.45 * hb   # dark under-canopy band so the line reads continuous
    ys_, xs_ = np.nonzero(hedge[::2, ::2]); P = np.stack([xs_ * 2, ys_ * 2], 1).astype(np.float32)
    rr = np.random.default_rng(seed + 45); step = 0.075 * s
    cellk = np.floor(P / step).astype(np.int64); _, first = np.unique(cellk[:, 0] * 100003 + cellk[:, 1], return_index=True)
    P = P[first]
    run = cv2.resize(fbm(TH // 8, TW // 8, 3, int(TW / s / 1.2), seed + 49), (TW, TH))
    P = P[(run[P[:, 1].astype(int).clip(0, TH - 1), P[:, 0].astype(int).clip(0, TW - 1)] > 0.28) & (rr.random(len(P)) < 0.95)]
    P += rr.uniform(-0.025, 0.025, P.shape).astype(np.float32) * s
    L = rr.uniform(0, 1, (int(TW * TH / (s * s) * 0.12), 2)).astype(np.float32) * [TW, TH]   # lone field trees
    P = np.concatenate([np.c_[P, np.full(len(P), 2)], np.c_[L, np.full(len(L), 3)]]).astype(np.float32)
    lum = img.mean(-1, keepdims=True); img = img * 0.9 + lum * 0.1
    return np.clip(img, 0, 255), P


ROOFS = 7   # roof colour index range (world.js: reds, orange, brown, slate)

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
        cv2.polylines(occ, [np.round((pts - [x0, y0]) * G).astype(np.int32)], False, 1, max(1, int(wdt * G)))
    roof = lambda: int(rr.choice(ROOFS, p=[0.26, 0.22, 0.16, 0.12, 0.12, 0.06, 0.06]))
    # ---- Bovina ----
    bx, by = TOWNS["Bovina"][:2]; clear.append((bx, by, 3.9))
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
    for f, L1, L2 in ((0.2, 1.4, 1.2), (0.4, 2.0, 1.8), (0.6, 1.6, 2.1), (0.8, 1.3, 1.5)):
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
        put(float(c[0]), float(c[1]), 0.62, 0.27, ang, 5, 1)
        tw = c - nv * 0.39; put(float(tw[0]), float(tw[1]), 0.15, 0.15, ang, 5, 2, force=True)
    # rows of houses along every street, both sides, gable-on houses mixed in, sheds and gardens behind
    for pts, wdt in streets_local:
        arc = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]; Ltot = arc[-1]
        for side in (1, -1):
            a = rr.uniform(0.05, 0.2)
            while a < Ltot - 0.15:
                i = int(np.searchsorted(arc, a)); i = min(i, len(pts) - 1); t = tang(pts, i); nrm = np.array([-t[1], t[0]]) * side
                ang = math.atan2(t[1], t[0])
                if rr.random() < 0.06: a += rr.uniform(0.25, 0.4); continue   # gap: a garden reaches the street
                gable = rr.random() < 0.28
                w = rr.uniform(0.17, 0.24) if gable else rr.uniform(0.24, 0.44); d = rr.uniform(0.34, 0.46) if gable else rr.uniform(0.16, 0.23)
                setb = wdt / 2 + d / 2 + rr.uniform(0.04, 0.08)
                c = pts[i] + nrm * setb
                ok_ = np.hypot(c[0] - bx, c[1] - by) < 3.7 and put(float(c[0]), float(c[1]), w, d, ang, roof())
                if not ok_ and np.hypot(c[0] - bx, c[1] - by) < 3.7 and not gable:   # squeeze a smaller house in
                    w, d = w * 0.6, d * 0.85; c = pts[i] + nrm * (wdt / 2 + d / 2 + 0.04); ok_ = put(float(c[0]), float(c[1]), w, d, ang, roof())
                if ok_:
                    if gable: build[-1] = (build[-1][0], build[-1][1], d, w, ang + math.pi / 2, build[-1][5], 0)   # long axis across the street
                    back = setb + d / 2
                    if rr.random() < 0.4:
                        sc_ = pts[i] + nrm * (back + 0.13) + t * rr.uniform(-0.1, 0.1); put(float(sc_[0]), float(sc_[1]), rr.uniform(0.16, 0.26), rr.uniform(0.12, 0.16), ang + math.pi / 2, roof())
                    gc = pts[i] + nrm * (back + 0.32); gardens.append((float(gc[0]), float(gc[1]), w * 0.95, 0.42, ang, int(rr.integers(0, 4))))
                    if rr.random() < 0.22: q = gc + t * rr.uniform(-0.1, 0.1) + nrm * rr.uniform(0.0, 0.15); trees.append((float(q[0]), float(q[1]), float(rr.uniform(0.6, 0.95))))
                a += w + rr.uniform(0.012, 0.045)
    # ---- farmsteads ----
    FARMS = [(1530.5, 701.5), (1534.0, 711.2), (1503.6, 711.8), (1505.2, 693.4), (1541.8, 704.4), (1526.6, 719.0), (1537.5, 696.0), (1546.0, 712.5),
             (1509.0, 700.2), (1527.5, 692.0), (1500.0, 716.5), (1536.0, 719.5), (1512.5, 690.0), (1548.5, 699.0)]
    for fx, fy in FARMS:
        a = rr.uniform(0, math.pi); u = np.array([math.cos(a), math.sin(a)]); v = np.array([-u[1], u[0]]); L = lambda p, q: np.array([fx, fy]) + u * p + v * q
        clear.append((fx, fy, 1.3)); yc = L(0.12, 0.38); yards.append((float(yc[0]), float(yc[1]), 0.55, 0.42, a, 0))
        c = L(0, 0); put(float(c[0]), float(c[1]), rr.uniform(0.42, 0.55), rr.uniform(0.19, 0.24), a, roof())
        c = L(0.62, 0.42); put(float(c[0]), float(c[1]), rr.uniform(0.62, 0.8), rr.uniform(0.26, 0.32), a + math.pi / 2, int(rr.choice([3, 4, 0])))   # barn
        for (p, q, w, d, rot) in [(0.05, 0.85, 0.34, 0.18, 0), (-0.45, 0.4, 0.28, 0.16, 1), (0.3, -0.35, 0.24, 0.15, 0), (-0.35, 0.95, 0.2, 0.14, 1)][: int(rr.integers(2, 5))]:
            c = L(p + rr.uniform(-0.04, 0.04), q + rr.uniform(-0.04, 0.04)); put(float(c[0]), float(c[1]), w * rr.uniform(0.85, 1.15), d, a + rot * math.pi / 2, roof())
        gc = L(-0.62, -0.32); gardens.append((float(gc[0]), float(gc[1]), 0.55, 0.42, a, int(rr.integers(0, 4))))
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
        print(nm, "trees", len(d["trees"]), "houses", len(d["houses"]), "rivers", [(rv["name"], len(rv["pts"])) for rv in d["rivers"]], d.get("bridge"))
    open(f"{OUT}/world_data.js", "w").write("window.GM3D_DATA=" + json.dumps(data, separators=(",", ":")) + ";\n")
    print("data kB", os.path.getsize(f"{OUT}/world_data.js") // 1024)
