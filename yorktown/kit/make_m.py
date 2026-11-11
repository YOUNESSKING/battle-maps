"""YORKTOWN MAP KIT: bake the STATIC 2e layers into NEW copies of the Style W basemaps (render speed: no overlay layers in the scenes).
usage (from yorktown/):  python3 kit/make_m.py <map>  [notex=1]
in : assets/<map>_w.jpg, assets/<map>_w_close.jpg (kit/make_w.py), assets/<map>.json, assets/src/<map>_hd_elev.npy, kit/data/places.py
out: assets/<map>_m[v].jpg, _m[v]_close.jpg, _m[v].json, _m[v]_water/_land.png  (v=N option; ALWAYS new files: never writes into a file a scene may hard-link)
     kit/data/<map>_bake.json (towns / labels / roads / crossings in map px, for the JS kit and the checks)
Layer order (STYLE_LOCK 2e item 9): basemap -> painted relief (DEM, named ground only) -> ground texture -> lanes -> roads + timber
bridges / ferry landings + flatboats -> painted towns -> carved arced town names. Everything is drawn for the map's typical camera
scale s (places.py): sizes below are SCREEN px at that scale (US = basemap image px per screen px = 2 / s)."""
import json, math, os, random, sys, time
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); YT = os.path.dirname(HERE)
for p in (HERE, os.path.join(HERE, "data"), os.path.join(HERE, "lib"), os.path.join(HERE, "lib", "towns")): sys.path.insert(0, p)
from proj import ll2px  # noqa
from places import MAPS  # noqa
from water import build_water  # noqa
from make_town import render_town, map_to_local  # noqa
from label import render_label_curve, FONTS  # noqa
Image.MAX_IMAGE_PIXELS = None
W, H = 5760, 3240
m = sys.argv[1]; OPT = dict(a.split("=", 1) for a in sys.argv[2:] if "=" in a)
VS = "_m" + OPT.get("v", "")   # output version: v=2 -> assets/<map>_m2*.jpg (new files; scenes built on _m keep their links). build_scene.py picks the highest version
C = MAPS[m]; S = C["s"]; US = 2.0 / S
J = json.load(open(f"{YT}/assets/{m}.json"))
P = lambda la, lo: tuple(v * 2 for v in ll2px(m, la, lo))            # lat/lon -> basemap image px
t0 = time.time()
WATER, _riv = build_water(m)
BASES = {k: np.asarray(Image.open(f"{YT}/assets/{m}_w{suf}.jpg").convert("RGB")).astype(np.float32) for k, suf in (("w", ""), ("close", "_close"))}
LOG = []


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ 1. painted relief (2e item 4) from the real DEM, named ground only
def relief(img, close):
    if not C["relief"]: return img
    e = np.load(f"{YT}/assets/src/{m}_hd_elev.npy").astype(np.float32); e[e < -100] = 0; e = np.maximum(e, 0)
    e = cv2.GaussianBlur(e, (0, 0), 2.2)
    mpp = J["meters_per_px"] / 2
    gy, gx = np.gradient(e, mpp)
    ex = 2.6                                                         # vertical exaggeration (low coastal bluffs, 10-25 m)
    nx, ny, nz = -gx * ex, -gy * ex, np.ones_like(gx); nn = np.sqrt(nx * nx + ny * ny + 1)
    L = np.array([-0.62, -0.62, 0.48]); L /= np.linalg.norm(L)
    sh = (nx * L[0] + ny * L[1] + nz * L[2]) / nn - L[2]             # 0 flat, + lit NW faces, - shaded SE faces
    sh = np.clip(sh * 1.6, -0.55, 0.45)
    mask = Image.new("L", (W // 4, H // 4), 0); d = ImageDraw.Draw(mask)
    for poly in C["relief"]: d.polygon([(P(la, lo)[0] / 4, P(la, lo)[1] / 4) for la, lo in poly], fill=255)
    mk = cv2.resize(cv2.GaussianBlur(np.asarray(mask).astype(np.float32) / 255, (0, 0), 18), (W, H)) * (~WATER)

    lit = np.clip(sh, 0, None)[..., None] * mk[..., None]; shd = np.clip(-sh, 0, None)[..., None] * mk[..., None]
    base_bl = cv2.GaussianBlur(img, (0, 0), 20)
    LITC = np.clip(base_bl * 0.55 + np.array([168, 156, 104], np.float32) * 0.45, 0, 255)      # olive-tan lit crest (colours from the grass)
    SHDC = np.clip(base_bl * 0.45 + np.array([40, 42, 22], np.float32) * 0.55, 0, 255)        # olive-charcoal shade
    out = img * (1 - lit * 0.75) + LITC * lit * 0.75
    out = out * (1 - shd * 0.85) + SHDC * shd * 0.85
    return out


# ------------------------------------------------------------------ 2. roads: period routes, densified + hand-wobbled, split at the water
def catmull(pts, step):
    if len(pts) < 3: q = pts
    else:
        q = []; ext = [pts[0]] + pts + [pts[-1]]
        for i in range(1, len(ext) - 2):
            p0, p1, p2, p3 = map(np.array, ext[i - 1:i + 3]); n = max(2, int(np.hypot(*(p2 - p1)) / step))
            for t in np.linspace(0, 1, n, endpoint=False):
                q.append(tuple(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)))
        q.append(pts[-1])
    out = [q[0]]
    for a in q[1:]:   # resample to ~step
        b = out[-1]; dd = math.hypot(a[0] - b[0], a[1] - b[1]); k = int(dd // step)
        for j in range(1, k + 1): out.append((b[0] + (a[0] - b[0]) * j * step / dd, b[1] + (a[1] - b[1]) * j * step / dd))
        if dd - k * step > step * 0.3: out.append(a)
    return out


TOWNS = {k: dict(key=k, name=t[0], c=P(t[1], t[2]), R=t[3] * US, label=t[4], side=t[5], seed=t[6], curve=(t[7] if len(t) > 7 else None)) for k, t in C["towns"].items()}


def meander(Pp, seed):
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(3)]; out, acc = [], 0.0
    for i, (x, y) in enumerate(Pp):
        if i: acc += math.hypot(x - Pp[i - 1][0], y - Pp[i - 1][1]) / US
        a, b = Pp[max(0, i - 2)], Pp[min(len(Pp) - 1, i + 2)]; Ln = math.hypot(b[0] - a[0], b[1] - a[1]) + 1e-9
        nx, ny = -(b[1] - a[1]) / Ln, (b[0] - a[0]) / Ln
        dt = min([math.hypot(x - T["c"][0], y - T["c"][1]) / US - T["R"] / US for T in TOWNS.values()] + [99])
        tap = min(1, max(0, dt / 20)) * min(1, i / 8, (len(Pp) - 1 - i) / 8)
        o = tap * US * (3.2 * math.sin(acc / 120 + ph[0]) + 1.4 * math.sin(acc / 40 + ph[1]) + 0.45 * math.sin(acc / 14 + ph[2]))
        out.append((x + nx * o, y + ny * o))
    return out


def wet(x, y):
    xi, yi = int(round(x)), int(round(y)); return 0 <= xi < W and 0 <= yi < H and WATER[yi, xi]


ROADS, CROSS = [], []
FER = [(fid, P(*a), P(*b)) for fid, a, b in C["ferries"]]


def snap_bank(p, q):
    """walk from p toward q and return the last dry point before the water (the landing on p's bank)"""
    n = int(math.hypot(q[0] - p[0], q[1] - p[1])); last = p
    for i in range(n + 1):
        x, y = p[0] + (q[0] - p[0]) * i / max(n, 1), p[1] + (q[1] - p[1]) * i / max(n, 1)
        if wet(x, y): return last
        last = (x, y)
    return last


for fid, a, b in FER:   # explicit ferries: landings snapped to the two banks, flatboat on the water between them
    la, lb = snap_bank(a, b), snap_bank(b, a)
    CROSS.append(dict(kind="ferry", id=fid, a=la, b=lb, x=(la[0] + lb[0]) / 2, y=(la[1] + lb[1]) / 2, ang=math.degrees(math.atan2(lb[1] - la[1], lb[0] - la[0])), w=math.hypot(lb[0] - la[0], lb[1] - la[1])))
for k, (rid, pts) in enumerate(C["roads"]):
    raw = [P(la, lo) for la, lo in pts]
    # a road that starts/ends at an explicit ferry bank ends at its landing
    lands = [l for c in CROSS if c["kind"] == "ferry" for l in (c["a"], c["b"])]
    for end in (0, -1):                                     # the NEAREST landing only (both banks can be close at a narrows)
        if lands:
            lnd = min(lands, key=lambda l: math.hypot(raw[end][0] - l[0], raw[end][1] - l[1]))
            if math.hypot(raw[end][0] - lnd[0], raw[end][1] - lnd[1]) < 40 * US: raw[end] = lnd
    path = meander(catmull(raw, 1.5 * US), 7 * k + 3)
    segs, cur, i = [], [], 0
    while i < len(path):
        x, y = path[i]
        if wet(x, y):
            j = i
            while j < len(path) and wet(*path[j]): j += 1
            kend = int(22 / 1.5) + 1                     # ~22 screen px: a wet run that close to a road end is the end (trim, no crossing)
            if j >= len(path) - kend and cur and j < len(path):   # the road wobbles into the water just before its end (a landing): stop at the bank
                segs.append(cur); CROSS.append(dict(kind="landing", id=rid, x=cur[-1][0], y=cur[-1][1], bank=cur[-1], ang=0, w=0)); cur = []; i = len(path); continue
            if i < kend and not cur:
                i = j; continue
            if j >= len(path) or not cur:   # the road runs off into water at an end: stop at the bank (landing)
                if cur: segs.append(cur); CROSS.append(dict(kind="landing", id=rid, x=cur[-1][0], y=cur[-1][1], bank=cur[-1], ang=0, w=0))
                cur = []; i = j; continue
            a, b = cur[-1], path[j]; wd = math.hypot(b[0] - a[0], b[1] - a[1])
            ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
            if wd < 34 * US:      # narrow (creek, river up to ~34 screen px): timber bridge, the road runs on over the deck
                CROSS.append(dict(kind="bridge", id=rid, x=(a[0] + b[0]) / 2, y=(a[1] + b[1]) / 2, ang=ang, w=wd))
                cur += path[i:j]
            else:                 # wide: ferry (landings on both banks + a flatboat)
                CROSS.append(dict(kind="ferry", id=rid, a=a, b=b, x=(a[0] + b[0]) / 2, y=(a[1] + b[1]) / 2, ang=ang, w=wd)); segs.append(cur); cur = []
            i = j; continue
        cur.append((x, y)); i += 1
    if len(cur) > 1: segs.append(cur)
    ROADS.append(dict(id=rid, paths=[s for s in segs if len(s) > 1]))


# ------------------------------------------------------------------ 3. drawing helpers
def draw_roads(img):
    """embossed double cart ruts (make_body.py layers): dusty band, darker band, each rut = dark groove (NW) + light rim (SE) + olive floor"""
    SS = 2; Wd, Hd = W * SS, H * SS
    def ruts(c, seed):
        rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(9)]; acc, pts = 0.0, []
        for i, (x, y) in enumerate(c):
            if i: acc += math.hypot(x - c[i - 1][0], y - c[i - 1][1]) / US
            a, b = c[max(0, i - 2)], c[min(len(c) - 1, i + 2)]; Ln = math.hypot(b[0] - a[0], b[1] - a[1]) + 1e-9
            pts.append((x, y, -(b[1] - a[1]) / Ln, (b[0] - a[0]) / Ln, acc))
        out = []
        for side, k0 in ((1, 0), (-1, 3)):
            sg, cur = [], []
            for (x, y, nx, ny, s_) in pts:
                sp = 1 + 0.3 * math.sin(s_ / 78 + ph[6]) * math.sin(s_ / 25 + ph[7])
                pinch = 0.25 + 0.75 * min(1, max(0, (math.sin(s_ / 120 + ph[8]) + 0.92) / 0.3))
                own = 0.42 * math.sin(s_ / (36 + 11 * k0) + ph[k0]) + 0.19 * math.sin(s_ / (13 + 2 * k0) + ph[k0 + 1])
                o = (side * 1.7 * C.get('roads_k', 1.0) * sp * pinch + own) * US
                if math.sin(s_ / (32 + 8 * k0) + ph[k0 + 2]) > 0.93:
                    if len(cur) > 1: sg.append(cur)
                    cur = []
                else: cur.append((x + nx * o, y + ny * o))
            if len(cur) > 1: sg.append(cur)
            out += sg
        return out
    D = [p for r in ROADS for p in r["paths"]]
    DR = [rp for k, r in enumerate(ROADS) for j, p in enumerate(r["paths"]) for rp in ruts(p, 100 * k + j)]
    RK = C.get("roads_k", 1.0)   # >1 on wide maps: wider + stronger ruts so the post roads read at full frame
    lay = [(D, (169, 156, 106), 10.4 * RK, min(0.4, 0.15 * RK), 0), (D, (74, 69, 34), 6.5 * RK, min(0.45, 0.17 * RK), 0), (DR, (36, 34, 12), 2.4 * RK, 0.86, -0.75),
           (DR, (221, 211, 160), 1.6 * RK, 0.31, 1.2), (DR, (70, 64, 30), 1.7 * RK, 0.7, 0)]
    for DD, col, w, a, off in lay:
        L_ = Image.new("L", (Wd, Hd), 0); d = ImageDraw.Draw(L_); wpx = max(1, int(round(w * US * SS * 0.5)))
        for c in DD:
            d.line([((x + off * US * 0.5) * SS, (y + off * US * 0.5) * SS) for x, y in c], fill=255, width=wpx, joint="curve")
        al = np.asarray(L_.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.35 * US))).astype(np.float32) / 255 * a
        al *= ~WATER
        img = img * (1 - al[..., None]) + np.array(col, np.float32) * al[..., None]
    return img


def lanes(img):
    """cleared, dusty winding lane where a road passes woods (make_w.py already keeps the trees off the road corridor)"""
    rd = Image.new("L", (W // 2, H // 2), 0); d = ImageDraw.Draw(rd)
    for r in ROADS:
        for c in r["paths"]: d.line([(x / 2, y / 2) for x, y in c], fill=255, width=max(2, int(9 * US / 2)), joint="curve")
    band = cv2.resize(cv2.GaussianBlur(np.asarray(rd).astype(np.float32) / 255, (0, 0), 2.5 * US), (W, H))
    lum = cv2.GaussianBlur(img.mean(2), (0, 0), 2); dark = cv2.GaussianBlur((lum < 72).astype(np.float32), (0, 0), 14 * US)
    a = np.clip(band * (0.06 + 0.9 * np.clip(dark * 3, 0, 1)) * 0.28, 0, 0.3) * (~WATER)
    return img * (1 - a[..., None]) + np.array([150, 132, 92], np.float32) * a[..., None]


TIMBER, TOP, BEAM, PLANK = (90, 70, 50), (122, 100, 72), (62, 48, 34), (84, 66, 46)


def rot(px, py, a, cx, cy):
    ca, sa = math.cos(a), math.sin(a); return (cx + px * ca - py * sa, cy + px * sa + py * ca)


def stamp(ov, c, fn, R, blur=0.55):
    SSb = 4; n = int(R * 2 * SSb); im = Image.new("RGBA", (n, n), (0, 0, 0, 0)); fn(im, ImageDraw.Draw(im), n / 2, n / 2, SSb)
    im = im.resize((n // SSb, n // SSb), Image.LANCZOS).filter(ImageFilter.GaussianBlur(blur)); ov.alpha_composite(im, (int(round(c[0] - R)), int(round(c[1] - R))))


def soft_shadow(im, poly, k, off=(1.6, 2.0), a=95, blur=1.4):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + off[0] * k, y + off[1] * k) for x, y in poly], fill=(14, 22, 26, a)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur * k)))


def crossings_layer():
    """timber bridges + ferry landings + flatboats (crossings.py look), scaled to the map's camera scale (crossings.py was drawn for ~0.95 screen px / image px)"""
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for cr in CROSS:
        f = US / 1.05 * (C.get("ferry_scale", 1.0) if cr["kind"] != "bridge" else 1.0)
        a = math.radians(cr["ang"])
        if cr["kind"] == "bridge":
            span = max(cr["w"] + 6 * f, 9 * f); hw = 3.8 * f
            def fn(im, d, cx, cy, k):
                Pp = lambda x, y: rot(x * k, y * k, a, cx, cy); L0, L1 = -span / 2, span / 2
                soft_shadow(im, [Pp(L0, -hw), Pp(L1, -hw), Pp(L1, hw), Pp(L0, hw)], k * f); d = ImageDraw.Draw(im)
                d.polygon([Pp(L0, -hw), Pp(L1, -hw), Pp(L1, hw), Pp(L0, hw)], fill=TIMBER + (255,))
                d.polygon([Pp(L0 + 0.3, -hw + 0.6 * f), Pp(L1 - 0.3, -hw + 0.6 * f), Pp(L1 - 0.3, 0.3 * f), Pp(L0 + 0.3, 0.3 * f)], fill=TOP + (210,))
                for i in range(1, 6):
                    x = L0 + (L1 - L0) * i / 6; d.line([Pp(x, -hw + 0.4), Pp(x, hw - 0.4)], fill=PLANK + (110,), width=max(1, int(0.35 * k * f)))
                for sd in (-1, 1): d.line([Pp(L0, sd * (hw - 0.3 * f)), Pp(L1, sd * (hw - 0.3 * f))], fill=BEAM + (170,), width=max(1, int(0.55 * k * f)))
            stamp(ov, (cr["x"], cr["y"]), fn, span / 2 + 10 * f, 0.55 * f)
        else:
            def fn_land(im, d, cx, cy, k):
                Pp = lambda x, y: rot(x * k * f, y * k * f, a, cx, cy)
                soft_shadow(im, [Pp(-2.2, -2.4), Pp(2.2, -2.4), Pp(2.2, 2.4), Pp(-2.2, 2.4)], k * f, off=(1.0, 1.2), a=80); d = ImageDraw.Draw(im)
                d.polygon([Pp(-2.2, -2.4), Pp(2.2, -2.4), Pp(2.2, 2.4), Pp(-2.2, 2.4)], fill=TIMBER + (240,))
                d.polygon([Pp(-1.9, -2.0), Pp(1.9, -2.0), Pp(1.9, 0.2), Pp(-1.9, 0.2)], fill=TOP + (200,))
                for xx in (-1.0, 0, 1.0): d.line([Pp(xx, -2.2), Pp(xx, 2.2)], fill=PLANK + (110,), width=max(1, int(0.3 * k * f)))
            def fn_boat(im, d, cx, cy, k, sc=1.25):
                Pp = lambda x, y: rot(x * k * f * sc, y * k * f * sc, a, cx, cy)   # flatboat lies along the crossing, on the water
                wk = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(wk).polygon([Pp(-4.6, -1.6), Pp(-8.5, -2.6), Pp(-8.5, 2.6), Pp(-4.6, 1.6)], fill=(200, 214, 220, 60))
                im.alpha_composite(wk.filter(ImageFilter.GaussianBlur(1.0 * k * f))); soft_shadow(im, [Pp(-4.0, -1.8), Pp(4.0, -1.8), Pp(4.0, 1.8), Pp(-4.0, 1.8)], k * f, off=(1.2, 1.5), a=110)
                d = ImageDraw.Draw(im); d.polygon([Pp(-4.0, -1.8), Pp(4.0, -1.8), Pp(4.5, 0), Pp(4.0, 1.8), Pp(-4.0, 1.8), Pp(-4.5, 0)], fill=(46, 36, 26, 255))
                d.polygon([Pp(-3.2, -1.1), Pp(3.2, -1.1), Pp(3.2, 0.9), Pp(-3.2, 0.9)], fill=(84, 66, 46, 230))
                for xx in (-1.6, 0, 1.6): d.line([Pp(xx, -1.1), Pp(xx, 0.9)], fill=(58, 46, 32, 120), width=max(1, int(0.3 * k * f)))
            banks = [cr["a"], cr["b"]] if cr["kind"] == "ferry" else [cr["bank"]]
            for b in banks: stamp(ov, b, fn_land, 9 * f)
            if cr["kind"] == "ferry":   # the flatboat a third of the way across (it is crossing), never in the middle of a label
                bx, by = cr["a"][0] + (cr["b"][0] - cr["a"][0]) * 0.38, cr["a"][1] + (cr["b"][1] - cr["a"][1]) * 0.38
                stamp(ov, (bx, by), fn_boat, 16 * f)
    return np.asarray(ov).astype(np.float32)


def towns_layer():
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); meta = {}
    landk = cv2.erode((~WATER).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
    landk = cv2.GaussianBlur(landk, (0, 0), 1.5)
    for k, T in TOWNS.items():
        c = T["c"]; Ru = T["R"] / US; ppu = US
        rl, angs = [], []
        for r in ROADS:
            for pth in r["paths"]:
                dd = [math.hypot(x - c[0], y - c[1]) for x, y in pth]
                if min(dd) < T["R"] * 1.2:
                    rl.append(map_to_local([(x / 2, y / 2) for x, y in pth], (c[0] / 2, c[1] / 2), 1 / S))
                    i0 = int(np.argmin(dd))
                    for dirn in (-1, 1):
                        j = i0
                        while 0 <= j + dirn < len(pth) and dd[j] < T["R"]: j += dirn
                        if j != i0 and dd[j] >= T["R"] * 0.7: angs.append(round(math.degrees(math.atan2(pth[j][1] - c[1], pth[j][0] - c[0])), 1))
        size = "city" if Ru >= 30 else "town" if Ru >= 18 else "village"
        im, (cx, cy) = render_town(T["seed"], size, roads=angs, ppu=ppu, radius=Ru, road_lines=rl, lobes=True, soft=0.9, feather=min(18, Ru * 0.5), palette="soft")
        bb = im.getbbox(); im = im.crop(bb); cx -= bb[0]; cy -= bb[1]
        x0, y0 = int(round(c[0] - cx)), int(round(c[1] - cy))
        a = np.asarray(im).astype(np.float32).copy()
        ya, yb, xa, xb = max(0, y0), min(H, y0 + im.height), max(0, x0), min(W, x0 + im.width)
        a = a[ya - y0:yb - y0, xa - x0:xb - x0]; a[..., 3] *= landk[ya:yb, xa:xb]                 # no houses on the water
        ov.alpha_composite(Image.fromarray(a.astype(np.uint8)), (xa, ya))
        meta[k] = dict(name=T["name"], c=[round(c[0] / 2, 1), round(c[1] / 2, 1)], R=round(T["R"] / 2, 1), box=[xa / 2, ya / 2, xb / 2, yb / 2])
    return np.asarray(ov).astype(np.float32), meta


SIDES = {"S": (0, 1), "N": (0, -1), "E": (1, 0), "W": (-1, 0), "SE": (0.75, 0.75), "SW": (-0.75, 0.75), "NE": (0.75, -0.75), "NW": (-0.75, -0.75)}


def labels_layer(tmeta, occupied):
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); out = {}
    for k, T in TOWNS.items():
        if not T["label"]: continue
        size = (30 if T["R"] / US >= 28 else 27) * C.get("label_k", 1.0); trk = 0.3
        f = ImageFont.truetype(FONTS["garamond600"], 100); Lt = (f.getlength(T["name"]) / 100 + trk * (len(T["name"]) - 1)) * size   # u
        Ru = T["R"] / US; best = None
        order = [T["side"]] + [s for s in ("S", "N", "SW", "SE", "W", "E", "NW", "NE") if s != T["side"]]
        for side, gm in ([("hand", 1)] if T["curve"] else []) + [(sd, g) for g in (1.0, 1.5, 2.1) for sd in order]:
            if side == "hand": curve = T["curve"]   # hand-set curve (u, from the town centre), places.py
            elif SIDES[side][0] == 0:
                sx, sy = SIDES[side]; gap = (Ru * 0.78 + 8) * gm                                    # under / over the town: a gentle arc hugging its edge
                yb = sy * (gap + (size * 0.72 if sy > 0 else 4)); arc = 0.13 * Lt * sy
                curve = [(-Lt / 2 - 6, yb), (-Lt / 6, yb + arc), (Lt / 6, yb + arc), (Lt / 2 + 6, yb)]
            else:                                          # beside
                sx, sy = SIDES[side]; gap = (Ru * 0.78 + 8) * gm   # the word runs away from the town, slight rise/fall
                x_a = sx * gap; x_b = x_a + (1 if sx > 0 else -1) * (Lt + 12); yy = sy * gap * 0.75 + size * 0.3
                p0, p3 = (min(x_a, x_b), yy + (6 if sx > 0 else -6) * (1 if sy >= 0 else -1)), (max(x_a, x_b), yy)
                curve = [p0, (p0[0] + (p3[0] - p0[0]) / 3, p0[1] - 0.09 * Lt), (p0[0] + 2 * (p3[0] - p0[0]) / 3, p3[1] - 0.09 * Lt), p3]
            li, (ax, ay) = render_label_curve(T["name"].upper() if False else T["name"], curve, size=size, ppu=US, tracking=trk, seed=T["seed"], shadow=0.62)
            x0, y0 = int(round(T["c"][0] - ax)), int(round(T["c"][1] - ay))
            alpha = np.asarray(li)[..., 3] > 40
            ya, yb, xa, xb = max(0, y0), min(H, y0 + li.height), max(0, x0), min(W, x0 + li.width)
            if yb <= ya or xb <= xa: continue
            sub = alpha[ya - y0:yb - y0, xa - x0:xb - x0]
            wetf = (WATER[ya:yb, xa:xb] & sub).sum() / max(1, sub.sum())
            occ = (occupied[ya:yb, xa:xb] & sub).sum() / max(1, sub.sum())
            edge = xa != x0 or ya != y0 or xb != x0 + li.width or yb != y0 + li.height
            woodf = (WOODS[ya:yb, xa:xb] & sub).sum() / max(1, sub.sum())
            if side == "hand": best = (0, side, li, x0, y0, wetf, occ); break
            score = wetf * 3 + occ * 2 + woodf * 1.5 + (1 if edge else 0) + (0.05 if side != T["side"] else 0) + 0.04 * (gm - 1)
            if best is None or score < best[0]: best = (score, side, li, x0, y0, wetf, occ)
            if score < 0.06: break
        score, side, li, x0, y0, wetf, occ = best
        if (side != T["side"] and side != "hand") or wetf > 0.02: LOG.append(f"label {k}: side {T['side']} -> {side} (water {wetf:.0%}, overlap {occ:.0%})")
        ov.alpha_composite(li, (max(0, x0), max(0, y0)), (max(0, -x0), max(0, -y0)))
        a = np.asarray(li)[..., 3] > 20; ys, xs = np.nonzero(a)
        out[k] = dict(side=side, box=[round((x0 + xs.min()) / 2, 1), round((y0 + ys.min()) / 2, 1), round((x0 + xs.max()) / 2, 1), round((y0 + ys.max()) / 2, 1)])
        occupied[max(0, y0):y0 + li.height, max(0, x0):x0 + li.width] |= a[max(0, -y0):, max(0, -x0):][:min(H, y0 + li.height) - max(0, y0), :min(W, x0 + li.width) - max(0, x0)]
    return np.asarray(ov).astype(np.float32), out


def over(img, rgba):
    a = rgba[..., 3:4] / 255; return img * (1 - a) + rgba[..., :3] * a


# ------------------------------------------------------------------ 4. ground texture (texture/make_texture.py, our masks)
def textures():
    import make_texture as MT
    MT.W, MT.H = W, H
    rd = Image.new("L", (W // 2, H // 2), 0); d = ImageDraw.Draw(rd)
    for r in ROADS:
        for c in r["paths"]: d.line([(x / 2, y / 2) for x, y in c], fill=255, width=max(2, int(12 * US / 2)))
    for T in TOWNS.values(): d.ellipse([(T["c"][0] - T["R"] * 1.6) / 2, (T["c"][1] - T["R"] * 1.6) / 2, (T["c"][0] + T["R"] * 1.6) / 2, (T["c"][1] + T["R"] * 1.6) / 2], fill=255)
    hard_ = cv2.resize(np.asarray(rd).astype(np.float32) / 255, (W, H))
    riv = cv2.dilate(WATER.astype(np.uint8), np.ones((5, 5), np.uint8)).astype(np.float32)
    data = {}
    for key, base in BASES.items():
        b = base / 255; wood = (cv2.GaussianBlur(b.mean(2), (0, 0), 2) < 72 / 255).astype(np.float32) * (1 - riv)
        hard = np.maximum(riv, hard_)
        k_ = lambda n: np.ones((n, n), np.uint8)
        rock_off = np.maximum(cv2.dilate((hard > 0.5).astype(np.uint8), k_(41)), cv2.dilate((wood > 0.5).astype(np.uint8), k_(25))).astype(np.float32)
        data[key] = (b, cv2.GaussianBlur(b, (0, 0), 24), riv, wood, hard, rock_off)
    dist = cv2.distanceTransform((1 - (riv > 0.5)).astype(np.uint8), cv2.DIST_L2, 5)
    near_wood = cv2.GaussianBlur(data["w"][3], (0, 0), 70); near_wood = np.clip(near_wood / (near_wood.max() * 0.35 + 1e-6), 0, 1)
    terr = (0.55) * (0.45 + 0.55 * np.clip(dist / 260.0, 0, 1)) * (1 - 0.75 * near_wood)
    MT.rng = np.random.default_rng(1781)
    lay = MT.layout(terr, np.maximum(data["w"][5], data["close"][5]))
    out = {}
    for key in ("w", "close"):
        MT.rng = np.random.default_rng(1786)
        b, bb, riv_, wood, hard, ro = data[key]
        out[key] = MT.render(key, lay, b, bb, riv_, wood, hard, np.maximum(data["w"][5], data["close"][5])).astype(np.float32)
    return out


# ------------------------------------------------------------------ 5. dead-end check (ends.py): every road end reaches a town, a road, a landing or the edge
def ends_check():
    land = [c["a"] for c in CROSS if c["kind"] == "ferry"] + [c["b"] for c in CROSS if c["kind"] == "ferry"] + [c["bank"] for c in CROSS if c["kind"] == "landing"]
    paths = [(r["id"], i, p) for r in ROADS for i, p in enumerate(r["paths"])]; res = []
    for rid, i, p in paths:
        for e in (p[0], p[-1]):
            x, y = e; why = None
            for k, T in TOWNS.items():
                if math.hypot(x - T["c"][0], y - T["c"][1]) < T["R"] * 1.3: why = "town " + k
            if not why and (x < 16 or y < 16 or x > W - 16 or y > H - 16): why = "map edge"
            if not why:
                for lx, ly in land:
                    if math.hypot(x - lx, y - ly) < 12 * US: why = "landing"
            if not why:
                for rid2, j, q in paths:
                    if (rid2, j) == (rid, i): continue
                    if min(math.hypot(x - a, y - b) for a, b in q) < 6 * US: why = "joins " + rid2
            res.append((rid, i, round(x / 2), round(y / 2), why))
    return res


# ------------------------------------------------------------------ main
ok = ends_check(); dead = [r for r in ok if not r[4]]
for r in dead: LOG.append(f"DEAD END road {r[0]}[{r[1]}] at map px ({r[2]}, {r[3]})")
print(m, "roads", len(ROADS), "crossings", {k: sum(1 for c in CROSS if c["kind"] == k) for k in ("bridge", "ferry", "landing")}, "dead ends", len(dead), flush=True)
for r in dead: print("  DEAD END", r, flush=True)
if OPT.get("check") == "1": sys.exit(0)   # check=1: roads / crossings / dead ends only (fast)
TEX = textures() if OPT.get("notex") != "1" else None
print("texture", round(time.time() - t0), flush=True)
cross = crossings_layer(); tw, tmeta = towns_layer()
occupied = cv2.dilate((tw[..., 3] > 90).astype(np.uint8), np.ones((int(8 * US), int(8 * US)), np.uint8)).astype(bool)   # town houses (+ ~4 px)
_rd = Image.new("L", (W, H), 0); _d = ImageDraw.Draw(_rd)
for c in CROSS: _d.ellipse([c["x"] - 14 * US, c["y"] - 14 * US, c["x"] + 14 * US, c["y"] + 14 * US], fill=255)
occupied |= np.asarray(_rd) > 0
WOODS = cv2.dilate((cv2.GaussianBlur(BASES["w"].mean(2), (0, 0), 2) < 74).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)
lb, lmeta = labels_layer(tmeta, occupied)
for key, base in BASES.items():
    img = relief(base, key == "close")
    if TEX: img = over(img, TEX[key])
    img = lanes(img); img = draw_roads(img); img = over(img, cross); img = over(img, tw); img = over(img, lb)
    suf = "" if key == "w" else "_close"
    out = f"{YT}/assets/{m}{VS}{suf}.jpg"
    if os.path.exists(out) and os.stat(out).st_nlink > 1: os.unlink(out)   # never write through a hard link into a scene folder
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out + ".tmp.jpg", quality=92); os.replace(out + ".tmp.jpg", out)
    print("wrote", out, round(time.time() - t0), flush=True)
J2 = dict(J); J2.update(name=f"{m}{VS}", hd_scale=2, baked_for_scale=S, credit=J.get("credit", ""))
json.dump(J2, open(f"{YT}/assets/{m}{VS}.json", "w"), indent=1)
bake = dict(map=m, s=S, towns={k: dict(**tmeta[k], label=lmeta.get(k)) for k in tmeta},
            roads=[dict(id=r["id"], paths=[[[round(x / 2, 1), round(y / 2, 1)] for x, y in p[::3] + [p[-1]]] for p in r["paths"]]) for r in ROADS],
            crossings=[{k: (round(v / 2, 1) if isinstance(v, float) and k in ("x", "y", "w") else ([round(v[0] / 2, 1), round(v[1] / 2, 1)] if k in ("a", "b", "bank") else v)) for k, v in c.items()} for c in CROSS],
            ends=[dict(road=r[0], seg=r[1], px=[r[2], r[3]], ok=r[4]) for r in ok], log=LOG)
json.dump(bake, open(f"{HERE}/data/{m}_bake{VS[2:] and VS}.json", "w"), indent=1)
# exclusion masks for the weather assets (weather.js / make_weather_assets.py): water, roads, towns, labels, woods
MD = f"{HERE}/data/masks_{m}"; os.makedirs(MD, exist_ok=True)
Image.fromarray(WATER.astype(np.uint8) * 255).save(f"{MD}/rivers_w.png", optimize=True)
Image.fromarray((tw[..., 3] > 60).astype(np.uint8) * 255).save(f"{MD}/towns.png", optimize=True)
Image.fromarray((lb[..., 3] > 60).astype(np.uint8) * 255).save(f"{MD}/labels.png", optimize=True)
Image.fromarray(WOODS.astype(np.uint8) * 255).save(f"{MD}/woods_w.png", optimize=True)
_r = Image.new("L", (W, H), 0); _d = ImageDraw.Draw(_r)
for r in ROADS:
    for c in r["paths"]: _d.line(c, fill=255, width=max(2, int(8 * US)))
_r.save(f"{MD}/roads.png", optimize=True)
# map-px water / land alpha masks for the scenes (living-map water shimmer, hatching kept off the water): assets/<map>_m_water.png, _m_land.png
_wm = cv2.resize(WATER.astype(np.float32), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
for nm_, a_ in (("water", _wm), ("land", 1 - _wm)):
    rgba = np.zeros((H // 2, W // 2, 4), np.uint8); rgba[..., :3] = 255; rgba[..., 3] = (np.clip(a_, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(rgba).save(f"{YT}/assets/{m}{VS}_{nm_}.png", optimize=True)
for l in LOG: print("  !", l)
print("done", m, round(time.time() - t0), "s")
