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

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = f"{HERE}/assets"; os.makedirs(OUT, exist_ok=True)
REPO = "/home/user/battle-maps"; GMT = f"{REPO}/research/style_tests/gm_test"
ELEV = np.load(f"{REPO}/grant/assets/src/vicksburg_hd_elev.npy").astype(np.float32)   # 2 px per map unit
GEO = json.load(open(f"{REPO}/grant/assets/vicksburg_hd_lift.json"))
MPU = GEO["meters_per_px"]   # metres per map unit (129.36)
RIV = json.load(open(f"{GMT}/data/rivers.json"))
ROADS = [[[float(v) for v in q.split()] for q in sp.strip().split(" L")] for d in json.load(open(f"{GMT}/data/roads.json")) for sp in d.split("M") if sp.strip()]
CLOSE_PLANE = json.load(open(f"{GMT}/scene/assets/plane_close.json"))   # gm_test close river (meandered Big Black), plane px

REG = {"wide": dict(box=(1120, 430, 960, 540), hm=(1440, 810), tex=(4096, 2304), cell=11.0, seed=11),
       "close": dict(box=(1474, 676, 84, 56), hm=(672, 448), tex=(4096, 2731), cell=2.85, seed=21)}
TOWNS = {   # map units, radius (units), houses; Bovina just west of the bridge on the Vicksburg road
    "Vicksburg": (1388, 681, 7.0, 150), "Jackson": (1885, 724, 7.5, 150), "Edwards": (1599.4, 716.4, 2.6, 26),
    "Bovina": (1495.5, 701.2, 1.6, 16), "Raymond": (1716, 759, 2.4, 22), "Bolton": (1700, 712, 1.6, 12)}

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
    # ---- heightmap out ----
    q = np.clip(np.round((h + 20) * 200), 0, 65535).astype(np.uint16)
    rgb = np.dstack([np.zeros_like(q, np.uint8), (q & 255).astype(np.uint8), (q >> 8).astype(np.uint8)])   # BGR: R = high, G = low
    cv2.imwrite(f"{OUT}/height_{name}.png", rgb); cv2.imwrite(f"{OUT}/height_{name}_16.png", q)
    # ---- ground texture ----
    s = TW / bw; Pt = lambda q_: ((q_[0] - x0) * s, (q_[1] - y0) * s)
    ht = cv2.resize(h, (TW, TH), interpolation=cv2.INTER_CUBIC)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) * s / MPU; gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) * s / MPU
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.006 * TW); slope /= np.percentile(slope, 99) + 1e-6
    r = np.random.default_rng(seed); cell = R["cell"] * s; ang = 11.0
    big = int(max(TW, TH) * 1.5); lab = np.zeros((big, big), np.int32); ori = {}; stack = [(0, 0, big, big)]; idx = 1
    while stack:
        a, b, w, hh = stack.pop()
        if (w < cell * 2.2 and hh < cell * 1.6) or (w < cell * 0.7 or hh < cell * 0.5):
            lab[b:b + hh, a:a + w] = idx; ori[idx] = r.integers(0, 2); idx += 1; continue
        if w > hh * 1.3 or (w >= hh and r.random() < 0.6): c = int(w * r.uniform(0.35, 0.65)); stack += [(a, b, c, hh), (a + c, b, w - c, hh)]
        else: c = int(hh * r.uniform(0.35, 0.65)); stack += [(a, b, w, c), (a, b + c, w, hh - c)]
    M = cv2.getRotationMatrix2D((big / 2, big / 2), ang, 1.0); M[0, 2] -= (big - TW) / 2; M[1, 2] -= (big - TH) / 2
    lab = cv2.warpAffine(lab.astype(np.float32), M, (TW, TH), flags=cv2.INTER_NEAREST).astype(np.int32)
    n = idx; pal = np.stack([FIELD[i % len(FIELD)] for i in r.integers(0, len(FIELD), n)]) * r.uniform(0.94, 1.05, (n, 1))
    img = pal[lab]
    if name == "wide": img = img * 0.6 + img.reshape(-1, 3).mean(0) * 0.4
    yy, xx = np.mgrid[0:TH, 0:TW].astype(np.float32); c_, sn = np.cos(np.radians(ang)), np.sin(np.radians(ang))
    u, v = xx * c_ - yy * sn, xx * sn + yy * c_; per = max(2.5, cell / 10)
    oa = np.array([ori.get(i, 0) for i in range(n)])[lab]
    img *= (1 + np.where(oa == 1, np.sin(u / per * np.pi), np.sin(v / per * np.pi)) * (0.03 if name == "wide" else 0.05))[..., None]
    edge = cv2.GaussianBlur((cv2.Laplacian(lab.astype(np.float32), cv2.CV_32F) != 0).astype(np.float32), (0, 0), 0.8)
    img *= (1 - 0.25 * np.clip(edge * 2, 0, 1))[..., None]
    img *= (1 + (fbm(TH, TW, 5, 6, seed + 8)[..., None] - 0.5) * 0.18)   # large tonal variation
    # water + banks (texture space)
    dist_t = cv2.resize(dist, (TW, TH), interpolation=cv2.INTER_LINEAR); hw_t = cv2.resize(hw, (TW, TH), interpolation=cv2.INTER_NEAREST)
    near = np.clip(1 - (dist_t - hw_t) / (12.0 if name == "wide" else 3.0), 0, 1)
    # forest mask: bottomland along rivers + steep slopes + noise; none in water, towns, on the breastworks
    fm = fbm(TH, TW, 6, 5, seed + 2)
    forest = np.clip((fm * 0.8 + near * 0.55 + slope * 0.5 - (0.73 if name == "wide" else 0.70)) * 9, 0, 1)
    townmask = np.zeros((TH, TW), np.float32)
    for nm, (tx, ty, rad, _) in TOWNS.items():
        cx, cy = Pt((tx, ty)); cv2.circle(townmask, (int(cx), int(cy)), int(rad * s * 1.15), 1.0, -1)
    if bw_line is not None:
        cv2.polylines(townmask, [np.round(np.array([Pt(p) for p in bw_line])).astype(np.int32)], False, 1.0, int(4.0 * s))   # clear field of fire
    forest *= (1 - cv2.GaussianBlur(townmask, (0, 0), 0.01 * TW)); forest *= (dist_t > hw_t + 0.15)
    forest = cv2.GaussianBlur(forest, (0, 0), 1.2)
    canopy = fbm(TH, TW, 3, int(bw / (1.5 if name == "wide" else 0.25)), seed + 3)
    img = img * (1 - forest[..., None]) + FOREST * (0.7 + 0.5 * canopy[..., None]) * forest[..., None]
    bank = np.clip(1 - (dist_t - hw_t) / (0.8 if name == "wide" else 0.35), 0, 1)[..., None]
    img = img * (1 - bank * 0.8) + BANK * bank * 0.8
    # roads (rut road tan + slightly darker edges)
    road = np.zeros((TH, TW), np.uint8); rwpx = max(3, int((0.55 if name == "wide" else 0.16) * s))
    for rd in ROADS:
        pts = np.array([Pt(p) for p in rd], np.float32)
        cv2.polylines(road, [np.round(pts * 4).astype(np.int32)], False, 255, rwpx, cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32)[..., None] / 255; edge_r = cv2.GaussianBlur(rdm[..., 0], (0, 0), rwpx * 0.6)[..., None]
    img = img * (1 - 0.18 * np.clip(edge_r * 2 - rdm, 0, 1)); img = img * (1 - rdm * 0.9) + ROAD * rdm * 0.9
    # town ground: worn earth under the houses
    tg = cv2.GaussianBlur(townmask, (0, 0), 0.004 * TW)[..., None] * 0.35; img = img * (1 - tg) + hexc("#9c8664") * tg
    if bw_line is not None:   # trench spoil in front of the parapet
        sp = np.zeros((TH, TW), np.uint8); cv2.polylines(sp, [np.round(np.array([Pt((p[0] + 0.32, p[1])) for p in bw_line]) * 4).astype(np.int32)], False, 255, int(0.3 * s), cv2.LINE_AA, shift=2)
        spf = cv2.GaussianBlur(sp.astype(np.float32) / 255, (0, 0), 2)[..., None] * 0.7; img = img * (1 - spf) + hexc("#7a6446") * spf
    img = np.clip(img + (fbm(TH, TW, 3, 60, seed + 9)[..., None] - 0.5) * 9, 0, 255)
    cv2.imwrite(f"{OUT}/ground_{name}.jpg", img[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])
    # ---- trees: jittered grid on the forest mask ----
    spacing = 2.6 if name == "wide" else 0.36
    gxs = np.arange(x0 + spacing / 2, x0 + bw, spacing); gys = np.arange(y0 + spacing / 2, y0 + bh, spacing)
    G = np.array([(x, y) for y in gys for x in gxs], np.float32); G += r.uniform(-0.45, 0.45, G.shape).astype(np.float32) * spacing
    fval = sample(cv2.resize(forest, (TW // 4, TH // 4), interpolation=cv2.INTER_AREA), box, G)
    keep = r.random(len(G)) < np.clip((fval - 0.35) * 2.2, 0, 1)
    if name == "wide":   # only where the camera looks (Vicksburg - Big Black - Edwards): keeps the instance count low
        keep &= (G[:, 0] > 1300) & (G[:, 0] < 1760) & (G[:, 1] > 560) & (G[:, 1] < 860)
    else:
        keep &= (G[:, 0] > 1484) & (G[:, 0] < 1552) & (G[:, 1] > 680) & (G[:, 1] < 728)
    T = G[keep]; th_ = sample(h, box, T)
    kind = (r.random(len(T)) < (0.18 if name == "close" else 0.0)).astype(int)   # a few pines
    sc = r.uniform(0.75, 1.3, len(T)); cv_ = r.uniform(0, 1, len(T))
    trees = [[round(float(a), 3), round(float(b), 3), round(float(c), 1), int(k), round(float(e), 2), round(float(f), 2)] for (a, b), c, k, e, f in zip(T, th_, kind, sc, cv_)]
    # ---- houses ----
    houses = []; hsz = (0.75, 0.55) if name == "wide" else (0.2, 0.14)
    for nm, (tx, ty, rad, cnt) in TOWNS.items():
        if not (x0 - rad < tx < x0 + bw + rad and y0 - rad < ty < y0 + bh + rad): continue
        rr = np.random.default_rng(hash(nm) % 9999 + seed); k = 0; tries = 0
        while k < cnt and tries < cnt * 20:
            tries += 1; d = rad * math.sqrt(rr.random()) * (1 if name == "wide" else 0.5); t = rr.random() * 6.283
            px, py = tx + d * math.cos(t), ty + d * math.sin(t)
            if sample(dist, box, np.array([[px, py]], np.float32))[0] < sample(hw, box, np.array([[px, py]], np.float32))[0] + 0.6: continue
            if any((px - q[0]) ** 2 + (py - q[1]) ** 2 < (hsz[0] * 1.4) ** 2 for q in houses[-40:]): continue
            w_ = hsz[0] * rr.uniform(0.7, 1.3); dd = hsz[1] * rr.uniform(0.7, 1.2)
            houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, np.array([[px, py]], np.float32))[0]), 1), round(w_, 3), round(dd, 3),
                           round(math.radians(ang + rr.choice([0, 90]) + rr.uniform(-6, 6)), 3), int(rr.integers(0, 4))]); k += 1
    if name == "close":   # scattered farmsteads
        rr = np.random.default_rng(5)
        for fx, fy in [(1530.5, 701.5), (1534.0, 711.2), (1503.6, 711.8), (1505.2, 693.4), (1541.8, 704.4), (1526.6, 719.0)]:
            for j in range(int(rr.integers(2, 4))):
                px, py = fx + rr.uniform(-0.5, 0.5), fy + rr.uniform(-0.4, 0.4)
                houses.append([round(px, 3), round(py, 3), round(float(sample(h, box, np.array([[px, py]], np.float32))[0]), 1), round(hsz[0] * rr.uniform(0.7, 1.2), 3), round(hsz[1] * rr.uniform(0.7, 1.1), 3), round(math.radians(ang + rr.uniform(-8, 8) + 90 * j), 3), int(rr.integers(0, 4))])
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
