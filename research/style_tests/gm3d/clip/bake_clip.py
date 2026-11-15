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
    # ---- ground texture (GM look: irregular field mosaic, ploughed tan + olive meadows, dark dense forest) ----
    s = TW / bw; Pt = lambda q_: ((q_[0] - x0) * s, (q_[1] - y0) * s)
    ht = cv2.resize(h, (TW, TH), interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) * s / MPU; gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) * s / MPU
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.006 * TW); slope /= np.percentile(slope, 99) + 1e-6
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
    hedge_pts = None
    if name == "close":
        img, hedge_pts = gm_fields(lab, n, cell, s, r, TW, TH, seed)
    else:
        # field types: 0 ploughed tan, 1 olive meadow, 2 pale stubble, 3 green pasture; big zones of tan vs green
        zone = fbm(TH // 8, TW // 8, 3, 3, seed + 32); cy_, cx_ = np.zeros(n), np.zeros(n)
        ys_, xs_ = np.mgrid[0:TH:8, 0:TW:8]; lab8 = lab[::8, ::8]
        cnt = np.bincount(lab8.ravel(), minlength=n) + 1e-6
        zone = cv2.resize(zone, (lab8.shape[1], lab8.shape[0])); zf = np.bincount(lab8.ravel(), weights=zone.ravel(), minlength=n) / cnt
        u_ = r.random(n); ptan = np.clip(0.05 + (zf - 0.35) * 1.6, 0.03, 0.7)
        ftype = np.where(u_ < ptan, 0, np.where(u_ < ptan + 0.06, 2, np.where(u_ < ptan + 0.06 + 0.26, 3, 1)))
        PAL = {0: ["#8b7667", "#93806a", "#857060", "#9a8670", "#8e7a62"], 1: ["#7f7b5c", "#787a64", "#7c7a5e", "#83805f"], 2: ["#8d8764", "#958e6c", "#9a9070"], 3: ["#6f7a5a", "#687458", "#727c5c"]}
        pal = np.stack([hexc(PAL[t][int(r.integers(0, len(PAL[t])))]) for t in ftype]) * r.uniform(0.95, 1.05, (n, 1))
        img = pal[lab].astype(np.float32)
        # strip farming: about half the fields are split into parallel strips of slightly different tone (GM look)
        sang = r.uniform(0, np.pi, n); sw = r.uniform(0.12, 0.3, n) * cell; split = r.random(n) < 0.55
        yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32); A = sang[lab]
        si = np.floor((xx * np.cos(A) + yy * np.sin(A)) / sw[lab]).astype(np.int64)
        tone = 1 + (((si * 7919 + lab * 104729) % 1000) / 1000.0 - 0.5) * 0.2 * split[lab]
        img *= tone[..., None]; del si, tone
        # furrows: each field its own direction; strong on ploughed fields, faint elsewhere
        fang = r.uniform(0, np.pi, n); per = (0.075 if name == "close" else 1.6) * s
        yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32); A = fang[lab]
        fur = np.sin((xx * np.cos(A) + yy * np.sin(A)) / per * np.pi)
        famp = np.array([0.06, 0.012, 0.03, 0.008])[ftype][lab] * (1.0 if name == "close" else 0.0)
        img *= (1 + fur * famp)[..., None]; del fur, A
        edge = cv2.GaussianBlur((cv2.Laplacian(lab.astype(np.float32), cv2.CV_32F) != 0).astype(np.float32), (0, 0), 1.0)
        img *= (1 - 0.06 * np.clip(edge * 2, 0, 1))[..., None]
        img *= (1 + (fbm(TH, TW, 5, 6, seed + 8)[..., None] - 0.5) * 0.16)   # large tonal variation
        if name == "wide": img = img * 0.5 + cv2.GaussianBlur(img, (0, 0), cell * 0.6) * 0.3 + np.array([112, 116, 88], np.float32) * 0.2   # wide: fields read as texture
    # rivers / banks (texture space)
    dist_t = cv2.resize(dist, (TW, TH), interpolation=cv2.INTER_LINEAR); hw_t = cv2.resize(hw, (TW, TH), interpolation=cv2.INTER_NEAREST)
    near = np.clip(1 - (dist_t - hw_t) / (10.0 if name == "wide" else 2.5), 0, 1)
    # forest mask: bottomland along rivers + steep slopes + noise; none in water, towns, on the breastworks
    fm = fbm(TH, TW, 6, 5, seed + 2)
    fm2 = fbm(TH, TW, 3, int(bw / (14 if name == "wide" else 1.6)), seed + 12)   # small woodlots
    forest = np.clip((fm * 0.7 + fm2 * 0.3 + near * (0.5 if name == "wide" else 0.3) + slope * 0.5 - (0.80 if name == "wide" else 0.72)) * 12, 0, 1)
    townmask = np.zeros((TH, TW), np.float32)
    for nm, (tx, ty, rad, _) in TOWNS.items():
        cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s * 1.1), 1.0, -1)
    if bw_line is not None:
        cv2.polylines(townmask, [np.round(np.array([Pt(p) for p in bw_line])).astype(np.int32)], False, 1.0, int(4.0 * s))   # clear field of fire
    road0 = np.zeros((TH, TW), np.uint8)
    for rd in ROADS: cv2.polylines(road0, [np.round(np.array([Pt(p) for p in rd], np.float32) * 4).astype(np.int32)], False, 255, max(3, int((1.6 if name == "wide" else 0.5) * s)), cv2.LINE_8, shift=2)
    forest *= (1 - road0.astype(np.float32) / 255)
    forest *= (1 - cv2.GaussianBlur(townmask, (0, 0), 0.006 * TW)); forest *= (dist_t > hw_t + (0.6 if name == "wide" else 0.12))
    forest = (cv2.GaussianBlur(forest, (0, 0), 1.0) > 0.5).astype(np.float32); forest = cv2.GaussianBlur(forest, (0, 0), 0.8)
    crown = fbm(TH, TW, 2, int(bw / (0.6 if name == "wide" else 0.09)), seed + 3)   # tree crowns speckle
    fdark = cv2.GaussianBlur(forest, (0, 0), 0.004 * TW)   # darker inside, lighter rim
    fcol = (hexc("#26382f") if name == "close" else hexc("#2f4540"))[None, None] * (0.72 + 0.55 * crown[..., None]) * (1.12 - 0.22 * fdark[..., None])
    img = img * (1 - forest[..., None]) + fcol * forest[..., None]
    ao = np.clip(cv2.GaussianBlur(forest, (0, 0), 0.0025 * TW) - forest, 0, 1)   # shade on the ground next to woods
    img *= (1 - 0.35 * ao)[..., None]
    bank = np.clip(1 - (dist_t - hw_t) / (0.7 if name == "wide" else 0.18), 0, 1)[..., None]
    img = img * (1 - bank * 0.85) + hexc("#7d7a68") * bank * 0.85
    # roads: thin red-brown dirt roads
    road = np.zeros((TH, TW), np.uint8); rwpx = max(3, int((0.7 if name == "wide" else 0.15) * s))
    for rd in ROADS:
        pts = np.array([Pt(p) for p in rd], np.float32)
        cv2.polylines(road, [np.round(pts * 4).astype(np.int32)], False, 255, rwpx, cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32)[..., None] / 255
    img = img * (1 - rdm * 0.92) + hexc("#8a6050") * rdm * 0.92
    tg = cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)[..., None] * 0.18; img = img * (1 - tg) + hexc("#8c7b66") * tg
    if bw_line is not None:   # trench spoil in front of the parapet
        sp = np.zeros((TH, TW), np.uint8); cv2.polylines(sp, [np.round(np.array([Pt((p[0] + 0.3, p[1])) for p in bw_line]) * 4).astype(np.int32)], False, 255, int(0.25 * s), cv2.LINE_AA, shift=2)
        spf = cv2.GaussianBlur(sp.astype(np.float32) / 255, (0, 0), 2)[..., None] * 0.7; img = img * (1 - spf) + hexc("#6e5a44") * spf
    img = np.clip(img + (fbm(TH, TW, 3, 60, seed + 9)[..., None] - 0.5) * 7, 0, 255)
    lum = img.mean(-1, keepdims=True); img = np.clip((img * 0.8 + lum * 0.2) * np.array([0.97, 1.0, 1.04], np.float32), 0, 255)   # GM: greyer, slightly cool
    cv2.imwrite(f"{OUT}/ground_{name}.jpg", img[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])
    # ---- heightmap out (wide: forests raised as a canopy so they read as 3D woods from altitude) ----
    if name == "wide":
        fh = cv2.resize(cv2.GaussianBlur(forest, (0, 0), 0.0012 * TW), (HW, HH), interpolation=cv2.INTER_AREA)
        h = h + fh * 9.0
    q = np.clip(np.round((h + 20) * 200), 0, 65535).astype(np.uint16)
    rgb = np.dstack([np.zeros_like(q, np.uint8), (q & 255).astype(np.uint8), (q >> 8).astype(np.uint8)])   # BGR: R = high, G = low
    cv2.imwrite(f"{OUT}/height_{name}.png", rgb); cv2.imwrite(f"{OUT}/height_{name}_16.png", q)
    # ---- trees: jittered grid on the forest mask ----
    spacing = 2.2 if name == "wide" else 0.2
    if name == "close" and hedge_pts is not None:   # hedgerow + lone field trees (texture px -> map units), kept off water/roads/towns
        HP = hedge_pts / s + [x0, y0]
        ok = (sample(dist, box, HP.astype(np.float32)) > sample(hw, box, HP.astype(np.float32)) + 0.25)
        HP = HP[ok]; HP = HP[(sample(cv2.resize(townmask + road0.astype(np.float32) / 255, (TW // 2, TH // 2)), box, HP.astype(np.float32)) < 0.2)]
    if name == "wide":   # wide: only the wood edges get instanced crowns (the canopy itself is texture + raised terrain)
        rim = np.clip(forest - cv2.erode(forest, np.ones((9, 9), np.uint8)), 0, 1); tmask = rim * 0.6
        win = (1300, 1760, 560, 860)
    else:
        tmask = forest; win = (1488, 1548, 682, 726)
    gxs = np.arange(win[0], win[1], spacing); gys = np.arange(win[2], win[3], spacing)
    G = np.array([(x, y) for y in gys for x in gxs], np.float32); G += r.uniform(-0.45, 0.45, G.shape).astype(np.float32) * spacing
    fval = sample(cv2.resize(tmask, (TW // 2, TH // 2), interpolation=cv2.INTER_AREA), box, G)
    keep = r.random(len(G)) < np.clip((fval - 0.3) * 2.5, 0, 1)
    T = G[keep]; th_ = sample(h, box, T)
    kind = (r.random(len(T)) < (0.12 if name == "close" else 0.0)).astype(int)   # a few conifers
    sc = r.uniform(0.75, 1.3, len(T)); cv_ = r.uniform(0, 1, len(T))
    if name == "close" and hedge_pts is not None:
        HP = HP[(HP[:, 0] > win[0]) & (HP[:, 0] < win[1]) & (HP[:, 1] > win[2]) & (HP[:, 1] < win[3])]
        T = np.concatenate([T, HP.astype(np.float32)]); kind = np.concatenate([kind, np.zeros(len(HP), int)])
        sc = np.concatenate([sc, r.uniform(0.55, 1.0, len(HP))]); cv_ = np.concatenate([cv_, r.uniform(0, 1, len(HP))]); th_ = sample(h, box, T)
    trees = [[round(float(a), 3), round(float(b), 3), round(float(c), 1), int(k), round(float(e), 2), round(float(f), 2)] for (a, b), c, k, e, f in zip(T, th_, kind, sc, cv_)]
    # ---- houses: long red-roofed houses lining the roads through each town ----
    houses = []; hsz = (2.2, 0.9) if name == "wide" else (0.5, 0.18)
    RDP = np.concatenate([densify(rd, 0.1) for rd in ROADS])
    for nm, (tx, ty, rad, cnt) in TOWNS.items():
        if not (x0 - rad < tx < x0 + bw + rad and y0 - rad < ty < y0 + bh + rad): continue
        rr = np.random.default_rng(sum(map(ord, nm)) + seed); k = 0; tries = 0
        rad_ = rad * (1.25 if name == "wide" else 0.9); cnt_ = cnt if name == "wide" else cnt * 2
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
            houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, P_)[0]), 1), round(hsz[0] * rr.uniform(0.6, 1.3), 3), round(hsz[1] * rr.uniform(0.8, 1.2), 3), round(rot, 3), int(rr.integers(0, 4))]); k += 1
    if name == "close":   # scattered farmsteads
        rr = np.random.default_rng(5)
        for fx, fy in [(1530.5, 701.5), (1534.0, 711.2), (1503.6, 711.8), (1505.2, 693.4), (1541.8, 704.4), (1526.6, 719.0), (1537.5, 696.0), (1546.0, 712.5), (1509.0, 700.2), (1527.5, 692.0), (1500.0, 716.5), (1536.0, 719.5), (1512.5, 690.0), (1548.5, 699.0)]:
            for j in range(int(rr.integers(3, 5))):
                ang_ = j * math.pi / 2 + math.radians(11); px, py = fx + math.cos(ang_) * 0.28 + rr.uniform(-0.05, 0.05), fy + math.sin(ang_) * 0.22 + rr.uniform(-0.05, 0.05)
                houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, np.array([[px, py]], np.float32))[0]), 1), round(hsz[0] * rr.uniform(0.7, 1.2), 3), round(hsz[1] * rr.uniform(0.7, 1.1), 3), round(math.radians(11 + rr.uniform(-4, 4) + 90 * (j % 2)), 3), int(rr.integers(0, 4))])
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


def gm_fields(lab, n, cell, s, r, TW, TH, seed):
    """GM close ground: strip-field mosaic (rust ploughland, ochre stubble, green and teal meadow), photo-like soil texture,
    grass verges and hedgerows on field edges. Returns (img float RGB 0..255, hedge tree points in texture px)."""
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32)
    zone = cv2.resize(fbm(TH // 16, TW // 16, 3, 3, seed + 40), (TW, TH), interpolation=cv2.INTER_LINEAR)
    # split ~70 % of the parcels into strips of their own crops
    sang = r.uniform(0, np.pi, n); sw = r.uniform(0.18, 0.45, n) * cell; split = r.random(n) < 0.7
    A = sang[lab]; si = np.floor((xx * np.cos(A) + yy * np.sin(A)) / sw[lab]).astype(np.int64) * split[lab]
    sub = (lab.astype(np.int64) * 131 + si * 7) % 1000003
    del A
    hs_ = lambda v, k: (((v * 2654435761 + k * 40503) % 4294967296) / 4294967296.0).astype(np.float32)
    up = hs_(lab.astype(np.int64), 1); us = hs_(sub, 1); zf = zone
    # crop: 0 rust ploughed, 1 ochre stubble, 2 green meadow, 3 teal pasture, 4 pale grey-green; strips mostly keep the parcel crop
    p0 = np.clip(0.30 + (zf - 0.45) * 1.4, 0.08, 0.62)
    cp = lambda u_: np.where(u_ < p0, 0, np.where(u_ < p0 + 0.10, 1, np.where(u_ < p0 + 0.10 + 0.42, 2, np.where(u_ < p0 + 0.10 + 0.42 + 0.12, 3, 4))))
    crop = np.where(hs_(sub, 7) < 0.28, cp(us), cp(up))
    PAL = np.array([[[152, 116, 86], [146, 110, 82], [158, 122, 90], [140, 106, 80]],
                    [[160, 140, 106], [154, 136, 102], [164, 144, 110], [150, 130, 98]],
                    [[100, 118, 88], [94, 112, 84], [106, 122, 90], [98, 114, 82]],
                    [[82, 104, 90], [78, 100, 86], [86, 106, 92], [80, 102, 88]],
                    [[114, 122, 100], [118, 126, 104], [108, 118, 98], [116, 124, 100]]], np.float32)
    v = (hs_(lab.astype(np.int64), 2) * 4).astype(np.int64)
    img = PAL[crop, v] * (0.95 + 0.10 * hs_(sub, 3))[..., None]
    # soil / growth variation inside each field (moisture blotches), fine grain
    img *= (1 + (fbm(TH, TW, 5, 10, seed + 41) - 0.5) * 0.22)[..., None]
    img *= (1 + (fbm(TH, TW, 3, 90, seed + 42) - 0.5) * 0.10)[..., None]
    img += (np.random.default_rng(seed + 43).random((TH, TW), np.float32)[..., None] - 0.5) * 9
    # furrows / drill rows: strong on ploughland + stubble, faint on meadows; direction follows the strip
    fang = np.where(r.random(n) < 0.7, sang, r.uniform(0, np.pi, n))[lab]
    per = 0.11 * s
    fur = np.sin((xx * np.cos(fang) + yy * np.sin(fang)) / per * np.pi + fbm(TH, TW, 3, 24, seed + 44) * 6)
    famp = np.array([0.045, 0.03, 0.012, 0.008, 0.015], np.float32)[crop] * (0.4 + 1.2 * fbm(TH, TW, 3, 12, seed + 46))
    img *= (1 + fur * famp)[..., None]; del fur, fang
    # tractor-less streaks: a few broad light/dark bands across the bigger fields
    img *= (1 + 0.05 * np.sin((xx * 0.8 + yy * 0.6) / (0.9 * s) + hs_(lab.astype(np.int64), 5) * 6.283))[..., None]
    # field boundaries: grass verge on every strip edge, hedgerows on ~55 % of parcel edges
    edge_sub = (cv2.Laplacian(sub.astype(np.float32), cv2.CV_32F) != 0).astype(np.float32)
    edge_par = (cv2.Laplacian(lab.astype(np.float32), cv2.CV_32F) != 0).astype(np.uint8)
    verge = cv2.GaussianBlur(edge_sub, (0, 0), 0.012 * s)
    verge = np.clip(verge / (verge.max() + 1e-6) * 1.6, 0, 1)
    img = img * (1 - 0.22 * verge[..., None]) + np.array([104, 112, 88], np.float32) * 0.22 * verge[..., None]
    pid = lab.astype(np.int64); keep = (hs_(pid, 9) < 0.30) | (hs_(pid, 10) < 0.12)
    hedge = (edge_par * keep).astype(np.uint8)
    hedge = cv2.dilate(hedge, np.ones((3, 3), np.uint8))
    hb = cv2.GaussianBlur(hedge.astype(np.float32), (0, 0), 0.05 * s); hb = np.clip(hb / (hb.max() + 1e-6) * 1.8, 0, 1)
    img *= (1 - 0.22 * hb)[..., None]    # hedge shade on the ground (the 3D crowns sit on top)
    ys_, xs_ = np.nonzero(hedge[::3, ::3]); P = np.stack([xs_ * 3, ys_ * 3], 1).astype(np.float32)
    rr = np.random.default_rng(seed + 45); step = 0.13 * s
    # thin to one crown per ~0.13 units along the hedges (grid hashing), with gaps
    cellk = np.floor(P / step).astype(np.int64); _, first = np.unique(cellk[:, 0] * 100003 + cellk[:, 1], return_index=True)
    P = P[first]; P = P[rr.random(len(P)) < 0.82]
    P += rr.uniform(-0.035, 0.035, P.shape).astype(np.float32) * s
    # lone field trees (GM dark dots)
    L = rr.uniform(0, 1, (int(TW * TH / (s * s) * 0.9), 2)).astype(np.float32) * [TW, TH]
    P = np.concatenate([P, L])
    img = cv2.GaussianBlur(img, (0, 0), 0.7)
    lum = img.mean(-1, keepdims=True); img = img * 0.85 + lum * 0.15
    return np.clip(img, 0, 255), P

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
