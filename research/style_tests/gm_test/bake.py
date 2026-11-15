"""GM test: bake the two static terrain planes (GM 'realistic' look: ochre/olive field patchwork, dark forests, slate rivers, tan roads,
brown-roof villages, hillshade) from grant/assets/vicksburg_hd_lift.jpg (read only) into NEW, unlinked files in scene/assets/.
Map coordinates = the 2880x1620 'vicksburg_hd_lift' frame used by the grant scenes (rivers/roads from s12_body_s12d_full2.js, data/*.json).
usage: python3 bake.py   -> scene/assets/plane_wide.jpg, plane_close.jpg, clouds.png, grain.png, inset_run.png"""
import json, os
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = f"{HERE}/scene/assets"; os.makedirs(OUT, exist_ok=True)
LIFT = "/home/user/battle-maps/grant/assets/vicksburg_hd_lift.jpg"   # 5760x3240 = 2 px per map unit
RIV = json.load(open(f"{HERE}/data/rivers.json"))
ROADS = [[[float(v) for v in q.split()] for q in sp.strip().split(" L")] for d in json.load(open(f"{HERE}/data/roads.json")) for sp in d.split("M") if sp.strip()]
TOWNS = {"Vicksburg": (1388, 681, 26), "Jackson": (1885, 724, 22), "Edwards": (1599.4, 716.4, 9), "Raymond": (1716, 759, 9), "Bolton": (1700, 712, 6)}
# boxes (map units): x0, y0, width (16:9)
WIDE = (1180, 470, 840); CLOSE = (1490, 690.5, 52)

rng = np.random.default_rng(1863)
def fbm(h, w, octaves=5, base=4, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((h, w), np.float32); amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o; g = r.random((n * h // w + 2, n + 2)).astype(np.float32)
        acc += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC); tot += amp; amp *= 0.5
    acc /= tot; return (acc - acc.min()) / (acc.max() - acc.min() + 1e-6)

def hexc(s): return np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
FIELD = [hexc(c) for c in ("#B39967", "#C2B280", "#A8915E", "#BFA874", "#B39967", "#C2B280", "#9C9A62", "#7A8E6A", "#8B9A6B", "#C9B98A", "#A58B5A", "#B8A070")]
FOREST, WATER, ROAD, ROOF = hexc("#1F3A27"), hexc("#6A8D9D"), hexc("#A89679"), hexc("#6B3A26")

def bake(box, W, H, cell, name, seed):
    x0, y0, bw = box; bh = bw * 9 / 16; s = W / bw   # px per map unit
    P = lambda q: ((q[0] - x0) * s, (q[1] - y0) * s)
    # relief from the plain lift (luminance only), blurred to kill its print texture
    lift = cv2.imread(LIFT); sx0, sy0 = int(x0 * 2) - 8, int(y0 * 2) - 8; sw, sh = int(bw * 2) + 16, int(bh * 2) + 16
    L = cv2.cvtColor(lift[sy0:sy0 + sh, sx0:sx0 + sw], cv2.COLOR_BGR2GRAY).astype(np.float32)
    L = cv2.GaussianBlur(L, (0, 0), 2.2 if bw > 200 else 4)
    L = cv2.resize(L, (int(sw * s / 2), int(sh * s / 2)), interpolation=cv2.INTER_CUBIC); o = int(8 * s / 2); L = L[o:o + H, o:o + W]
    # hillshade from the lift luminance treated as height + procedural fine relief
    hgt = L / 255.0 * (1.0 if bw > 200 else 0.6) + fbm(H, W, 6, 6, seed + 1) * (0.15 if bw > 200 else 0.5)
    hgt = cv2.GaussianBlur(hgt, (0, 0), 3)
    gx = cv2.Sobel(hgt, cv2.CV_32F, 1, 0, ksize=5); gy = cv2.Sobel(hgt, cv2.CV_32F, 0, 1, ksize=5)
    k = 18.0 if bw > 200 else 40.0
    nx, ny, nz = -gx * k, -gy * k, np.ones_like(gx); nn = np.sqrt(nx * nx + ny * ny + nz * nz)
    lx, ly, lz = -0.6, -0.55, 0.58; shade = (nx * lx + ny * ly + nz * lz) / nn
    shade = 0.62 + 0.55 * (shade - shade.mean()) / (shade.std() * 3 + 1e-6) + 0.38
    # field patchwork: BSP rectangles in a slightly rotated frame
    ang = 11.0; big = int(max(W, H) * 1.5); lab = np.zeros((big, big), np.int32); ori = {}
    stack = [(0, 0, big, big)]; idx = 1; r = np.random.default_rng(seed)
    while stack:
        a, b, w, h = stack.pop()
        if (w < cell * 2.2 and h < cell * 1.6) or (w < cell * 0.7 or h < cell * 0.5):
            lab[b:b + h, a:a + w] = idx; ori[idx] = r.integers(0, 2); idx += 1; continue
        if w > h * 1.3 or (w >= h and r.random() < 0.6):
            c = int(w * r.uniform(0.35, 0.65)); stack += [(a, b, c, h), (a + c, b, w - c, h)]
        else:
            c = int(h * r.uniform(0.35, 0.65)); stack += [(a, b, w, c), (a, b + c, w, h - c)]
    M = cv2.getRotationMatrix2D((big / 2, big / 2), ang, 1.0); M[0, 2] -= (big - W) / 2; M[1, 2] -= (big - H) / 2
    lab = cv2.warpAffine(lab.astype(np.float32), M, (W, H), flags=cv2.INTER_NEAREST).astype(np.int32)
    n = idx; pal = np.stack([FIELD[i % len(FIELD)] for i in r.integers(0, len(FIELD), n)]) * r.uniform(0.95, 1.04, (n, 1))
    img = pal[lab]
    if bw > 200: img = img * 0.5 + img.reshape(-1, 3).mean(0) * 0.5   # wide: fields read as texture, not a checkerboard
    # furrows inside each field (stripes along / across the field, rotated frame)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); c, sn = np.cos(np.radians(ang)), np.sin(np.radians(ang))
    u, v = xx * c - yy * sn, xx * sn + yy * c; per = max(3.0, cell / 9)
    oa = np.array([ori.get(i, 0) for i in range(n)])[lab]
    fur = np.where(oa == 1, np.sin(u / per * np.pi), np.sin(v / per * np.pi)) * (0.03 if bw > 200 else 0.05)
    img *= (1 + fur)[..., None]
    # field edges: thin darker hedge lines
    edge = (cv2.Laplacian(lab.astype(np.float32), cv2.CV_32F) != 0).astype(np.float32)
    edge = cv2.GaussianBlur(edge, (0, 0), 0.8); img *= (1 - 0.28 * np.clip(edge * 2, 0, 1))[..., None]
    # rivers (+ bottomland forest along them)
    saved = {}; rmask = np.zeros((H, W), np.uint8); rw = {"mississippi": 22, "big_black": 7, "pearl": 6} if bw > 200 else {"big_black": 46}
    for key, wu in rw.items():
        if not wu: continue
        pts = np.array([P(q) for q in RIV[key]["pts"]], np.float32)
        if bw < 200:
            pts = cv2.approxPolyDP(pts, 0.8 * s, False).reshape(-1, 2); pts = smooth(np.repeat(pts, 1, 0), 2)
            dense = [];
            for i in range(len(pts) - 1):
                for f in np.linspace(0, 1, 40, endpoint=False): dense.append(pts[i] * (1 - f) + pts[i + 1] * f)
            pts = smooth(np.array(dense, np.float32), 30); d = np.gradient(pts, axis=0); nrm = np.stack([-d[:, 1], d[:, 0]], 1); nrm /= np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-6
            arc = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))])
            pts = pts + nrm * (np.sin(arc / 420.0) * 150 + np.sin(arc / 130.0 + 1) * 30)[:, None]
        pts = smooth(pts, 3 if bw > 200 else 6)
        saved[key] = np.round(pts[::4], 1).tolist()
        cv2.polylines(rmask, [np.round(pts * 4).astype(np.int32)], False, 255, int(wu), cv2.LINE_AA, shift=2)
    rm = rmask.astype(np.float32) / 255; near = cv2.GaussianBlur(rm, (0, 0), 0.02 * W); near = near / (near.max() + 1e-6)
    slope = cv2.GaussianBlur(np.sqrt(gx * gx + gy * gy), (0, 0), 0.01 * W); slope = slope / (np.percentile(slope, 99) + 1e-6)
    fm = fbm(H, W, 6, 5, seed + 2); forest = np.clip((fm * 0.75 + near * 0.6 + slope * 0.55 - (0.78 if bw > 200 else 0.62)) * 10, 0, 1)
    forest = cv2.GaussianBlur(forest, (0, 0), 1.2)
    canopy = fbm(H, W, 3, int(W / (6 if bw > 200 else 14)), seed + 3)   # crown texture
    fcol = FOREST[None, None] * (0.75 + 0.55 * canopy[..., None])
    ao = cv2.GaussianBlur(forest, (0, 0), 6); img = img * (1 - 0.35 * np.clip(ao - forest + 0.3, 0, 1) * (1 - forest))[..., None]
    img = img * (1 - forest[..., None]) + fcol * forest[..., None]
    img *= shade[..., None]
    bank = cv2.GaussianBlur(rm, (0, 0), 3.5); img = img * (1 - 0.3 * np.clip(bank * 2, 0, 1))[..., None]
    wcol = WATER[None, None] * (0.92 + 0.12 * cv2.GaussianBlur(rm, (0, 0), 2)[..., None])
    rs = cv2.GaussianBlur(rm, (0, 0), 0.9)[..., None]; img = img * (1 - rs) + wcol * rs
    # roads: thin tan
    road = np.zeros((H, W), np.uint8); rwpx = 3 if bw > 200 else 9
    for rd in ROADS:
        pts = np.array([P(q) for q in rd], np.float32)
        cv2.polylines(road, [np.round(pts * 4).astype(np.int32)], False, 255, rwpx, cv2.LINE_AA, shift=2)
    rdm = road.astype(np.float32)[..., None] / 255; img = img * (1 - rdm * 0.85) + ROAD * 1.05 * rdm * 0.85
    # villages: brown roofs with a little shadow
    vill = np.zeros((H, W, 3), np.float32); va = np.zeros((H, W), np.float32)
    for nm, (tx, ty, rad) in TOWNS.items():
        cx, cy = P((tx, ty)); rr = rad * s / (4 if bw > 200 else 1)
        if not (-200 < cx < W + 200 and -200 < cy < H + 200): continue
        for i in range(int(18 + rad * 4)):
            d = rr * np.sqrt(r.random()); t = r.random() * 6.283; px, py = cx + d * np.cos(t), cy + d * np.sin(t)
            ws = r.uniform(0.6, 1.4) * (6 if bw > 200 else 18); hs = ws * r.uniform(0.5, 0.9)
            box = cv2.boxPoints(((px, py), (ws, hs), ang + r.choice([0, 90]))).astype(np.int32)
            cv2.fillPoly(va, [box + 2], 0.45); cv2.fillPoly(vill, [box], (ROOF * r.uniform(0.8, 1.25)).tolist()); cv2.fillPoly(va, [box], 1.0)
    va = va[..., None]; roofm = (vill.sum(-1, keepdims=True) > 0).astype(np.float32)
    img = img * (1 - va * 0.5 * (1 - roofm)) ; img = img * (1 - roofm) + vill * roofm
    img = np.clip(img + (fbm(H, W, 3, 40, seed + 9)[..., None] - 0.5) * 10, 0, 255)
    cv2.imwrite(f"{OUT}/{name}.jpg", img[..., ::-1].astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90])
    json.dump({"x0": x0, "y0": y0, "bw": bw, "W": W, "H": H, "s": s, "rivers": saved}, open(f"{OUT}/{name}.json", "w"))
    print(name, W, H, "px/unit", round(s, 2))

def smooth(p, k):
    if len(p) < 4: return p
    q = np.array(p, np.float32)
    for _ in range(k): q[1:-1] = 0.25 * q[:-2] + 0.5 * q[1:-1] + 0.25 * q[2:]
    return q

def clouds():
    W, H = 2400, 1350; a = fbm(H, W, 7, 3, 77); b = fbm(H, W, 5, 6, 78)
    al = np.clip((a * 0.75 + b * 0.25 - 0.42) * 3.2, 0, 1) ** 1.2
    yy, xx = np.mgrid[0:H, 0:W]; e = np.minimum(np.minimum(xx, W - 1 - xx) / (0.18 * W), np.minimum(yy, H - 1 - yy) / (0.18 * H)); al *= np.clip(e, 0, 1) ** 1.5   # no hard edge
    sh = cv2.GaussianBlur(al, (0, 0), 18); col = 236 + 18 * np.clip(al - sh * 0.6, 0, 1)
    rgba = np.dstack([col, col, col * 0.985, al * 255]).astype(np.uint8)
    cv2.imwrite(f"{OUT}/clouds.png", rgba[..., [2, 1, 0, 3]])
    sa = cv2.GaussianBlur(cv2.resize(al, (1920, 1080)), (0, 0), 14); z = np.zeros_like(sa)   # cloud shadows for the living map
    cv2.imwrite(f"{OUT}/cshadow.png", np.dstack([z, z, z, sa * 255]).astype(np.uint8))

def grain():
    g = np.random.default_rng(5).normal(128, 26, (540, 960)).astype(np.float32)
    g = cv2.GaussianBlur(g, (0, 0), 0.7); paper = fbm(540, 960, 5, 12, 6) * 40 - 20
    cv2.imwrite(f"{OUT}/grain.png", np.clip(g + paper, 0, 255).astype(np.uint8))

def inset():   # oval painting inset: LoC 'Grant's transports running the batteries' (public domain), paper grain + vignette baked in
    im = cv2.imread("/home/user/battle-maps/grant/assets/media/arch_vicksburg_run.jpg").astype(np.float32)
    im = cv2.resize(im, (960, int(960 * im.shape[0] / im.shape[1])), interpolation=cv2.INTER_LANCZOS4)
    h, w = im.shape[:2]; sep = np.array([0.80, 0.95, 1.10], np.float32)   # warm, slightly sepia (BGR)
    g = im.mean(-1, keepdims=True); im = (im * 0.55 + g * 0.45) * sep
    yy, xx = np.mgrid[0:h, 0:w]; d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    im *= (1 - 0.55 * np.clip(d - 0.45, 0, 1) ** 1.3)[..., None]
    gr = np.random.default_rng(3).normal(0, 9, (h, w, 1)).astype(np.float32); im = np.clip(im + gr + (fbm(h, w, 4, 10, 4)[..., None] - 0.5) * 22, 0, 255)
    cv2.imwrite(f"{OUT}/inset_run.jpg", im.astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])

if __name__ == "__main__":
    import sys
    if "--fx" not in sys.argv:
        bake(WIDE, 3840, 2160, 34, "plane_wide", 11)
        bake(CLOSE, 3840, 2160, 210, "plane_close", 21)
    clouds(); grain(); inset()
