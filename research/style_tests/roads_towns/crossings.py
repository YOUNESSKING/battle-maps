"""s12d_rt: river crossings (plank bridges, ferries, landings) + cleared lanes through the woods for the 1863 roads.
usage: python3 crossings.py OUTDIR   (OUTDIR holds rt_meta.json from gen_rt.py)
writes OUTDIR/crossings.json (final road subpaths in map px + the crossing list), OUTDIR/bridges.png (5760x3240 RGBA, map box x2),
OUTDIR/lanes_w.png + lanes_close.png (RGBA overlays painting a grassy cart-track lane over the trees of each basemap)."""
import json, math, os, random, sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, "/home/user/battle-maps/research/style_tests/roads_towns/hills")
from road_fix import fixed_roads  # noqa
import make_hill as MH  # noqa  (water_mask, ink_mask, clean_ground, rgba_from)

Image.MAX_IMAGE_PIXELS = None
OUT = sys.argv[1]
meta = json.load(open(os.path.join(OUT, "rt_meta.json")))
TC = [t["c"] for t in meta["towns"].values()]
A = "/home/user/battle-maps/grant/assets"
BW = np.asarray(Image.open(f"{A}/vicksburg_w.jpg").convert("RGB"))
BC = np.asarray(Image.open(f"{A}/vicksburg_w_close.jpg").convert("RGB"))
f = BW.astype(np.int32)
WATER = (f[..., 2] > f[..., 0] + 30) & (f[..., 2] > f[..., 1] + 4)          # image px (2 per map px)
WATER = cv2.morphologyEx(WATER.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)).astype(bool)
H2, W2 = WATER.shape


def wet(x, y):
    xi, yi = int(round(x * 2)), int(round(y * 2))
    return 0 <= xi < W2 and 0 <= yi < H2 and WATER[yi, xi]


def meander(P, seed):          # identical to make_body.py (same seeds = same final roads)
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    out, acc = [], 0.0
    for i, (x, y) in enumerate(P):
        if i: acc += math.hypot(x - P[i - 1][0], y - P[i - 1][1])
        a, b = P[max(0, i - 2)], P[min(len(P) - 1, i + 2)]
        L = math.hypot(b[0] - a[0], b[1] - a[1]) + 1e-9; nx, ny = -(b[1] - a[1]) / L, (b[0] - a[0]) / L
        dt = min(math.hypot(x - cx, y - cy) for cx, cy in TC)
        tap = min(1, max(0, (dt - 26) / 30)) * min(1, i / 8, (len(P) - 1 - i) / 8)
        o = tap * (2.6 * math.sin(acc / 70 + ph[0]) + 1.1 * math.sin(acc / 23 + ph[1]) + 0.35 * math.sin(acc / 8 + ph[2]))
        out.append((x + nx * o, y + ny * o))
    return out


def dens(P, step=0.5):
    out = [P[0]]
    for (x0, y0), (x1, y1) in zip(P, P[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        out += [(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n) for k in range(1, n + 1)]
    return out


FERRY_ROADS = {"baldwins_ferry_road", "halls_ferry_road"}       # history: ferries over the Big Black
roads = fixed_roads()
final, crossings = [], []
for k, r in enumerate(roads):
    P = dens(meander(r["pts"], k))
    # a road that stops at a river bank: ferry roads continue across (ferry), the Mississippi ends get a landing
    for end in (0, -1):
        e, q = P[end], P[end + 1 if end == 0 else end - 1]
        dx, dy = e[0] - q[0], e[1] - q[1]; L = math.hypot(dx, dy) + 1e-9; dx, dy = dx / L, dy / L
        hit = next((s for s in np.arange(0, 6, 0.5) if wet(e[0] + dx * s, e[1] + dy * s)), None)
        if hit is None:
            continue
        s = hit
        while s < 60 and wet(e[0] + dx * s, e[1] + dy * s):
            s += 0.5
        span = s - hit
        if r["id"] in FERRY_ROADS and span < 40:
            ext = [(e[0] + dx * t, e[1] + dy * t) for t in np.arange(0.5, s + 12, 0.5)]
            P = (ext[::-1] + P) if end == 0 else (P + ext)
        else:
            crossings.append(dict(kind="landing", road=r["id"], x=e[0] + dx * (hit + 1.5), y=e[1] + dy * (hit + 1.5),
                                  ang=math.degrees(math.atan2(dy, dx)), w=span, bank=(e[0] + dx * hit, e[1] + dy * hit)))
    # walk the road: runs over water = crossings
    flags = [wet(x, y) for x, y in P]
    i, runs = 0, []
    while i < len(P):
        if flags[i]:
            j = i
            while j < len(P) and flags[j]:
                j += 1
            runs.append((i, j - 1)); i = j
        else:
            i += 1
    for (a, b) in runs:
        if a == 0 or b == len(P) - 1:
            continue
        (x0, y0), (x1, y1) = P[max(a - 1, 0)], P[min(b + 1, len(P) - 1)]
        wid = math.hypot(x1 - x0, y1 - y0)
        if wid < 0.8:
            continue
        kind = "ferry" if r["id"] in FERRY_ROADS else "bridge"
        big = r["id"] == "jackson_road" and abs((x0 + x1) / 2 - 1511) < 25 and abs((y0 + y1) / 2 - 704) < 25   # Big Black bridge (railroad/road)
        crossings.append(dict(kind=kind, road=r["id"], x=(x0 + x1) / 2, y=(y0 + y1) / 2, ang=math.degrees(math.atan2(y1 - y0, x1 - x0)),
                              w=wid, big=bool(big)))
    # subpaths: split at ferry water runs only
    fr = [(a, b) for (a, b) in runs if r["id"] in FERRY_ROADS and a > 0 and b < len(P) - 1]
    cuts, start = [], 0
    for a, b in fr:
        cuts.append(P[start:a]); start = b + 1
    cuts.append(P[start:])
    final.append(dict(id=r["id"], paths=[[(round(x, 2), round(y, 2)) for x, y in c[::2] + [c[-1]]] for c in cuts if len(c) > 1]))

# ---- draw the crossings (image px = 2 x map px; drawn for camera s ~1.9: 1 image px ~ 0.95 screen px) ----
SS = 4
ov = Image.new("RGBA", (W2, H2), (0, 0, 0, 0))


def stamp(c, fn, R):
    """draw fn(draw, cx, cy, k) supersampled into a patch, paste into the overlay at map point c"""
    cx, cy = c[0] * 2, c[1] * 2
    n = int(R * 2 * SS)
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fn(im, d, n / 2, n / 2, SS)
    im = im.resize((n // SS, n // SS), Image.LANCZOS)
    ov.alpha_composite(im, (int(round(cx - R)), int(round(cy - R))))


def rot(px, py, a, cx, cy):
    ca, sa = math.cos(a), math.sin(a)
    return (cx + px * ca - py * sa, cy + px * sa + py * ca)


def bridge(cr):
    a = math.radians(cr["ang"])
    span = max(1.5 * cr["w"] * 2, 9) * (1.15 if cr.get("big") else 1.0)      # image px
    hw = 3.6 if cr.get("big") else 2.7                                          # deck half-width, image px (road ~2.7 px)
    R = span / 2 + 8

    def fn(im, d, cx, cy, k):
        P = lambda x, y: rot(x * k, y * k, a, cx, cy)
        # shadow on the water (SE, soft)
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
        ds.polygon([(px + 1.6 * k, py + 1.9 * k) for px, py in (P(-span / 2, -hw), P(span / 2, -hw), P(span / 2, hw), P(-span / 2, hw))], fill=(10, 18, 22, 120))
        sh = sh.filter(ImageFilter.GaussianBlur(1.2 * k)); im.alpha_composite(sh); d = ImageDraw.Draw(im)
        # deck
        d.polygon([P(-span / 2, -hw), P(span / 2, -hw), P(span / 2, hw), P(-span / 2, hw)], fill=(176, 150, 106, 255))
        # plank ticks (light boards with dark gaps) across the deck
        x = -span / 2 + 0.6
        while x < span / 2:
            d.line([P(x, -hw + 0.3), P(x, hw - 0.3)], fill=(78, 60, 38, 255), width=max(1, int(0.45 * k)))
            x += 1.5
        # two thin dark rails (side beams)
        for s in (-1, 1):
            d.line([P(-span / 2 - 0.6, s * hw), P(span / 2 + 0.6, s * hw)], fill=(30, 22, 12, 255), width=int(1.15 * k))
        if cr.get("big"):   # abutment piers at both banks + a centre pier shadow
            for xx in (-span / 2, 0, span / 2):
                d.line([P(xx, -hw - 1.4), P(xx, hw + 1.4)], fill=(48, 38, 26, 255), width=int(1.0 * k))
    stamp((cr["x"], cr["y"]), fn, R)


def boat_and_landings(cr, banks):
    a = math.radians(cr["ang"])

    def fn_boat(im, d, cx, cy, k):
        P = lambda x, y: rot(x * k, y * k, a + math.pi / 2, cx, cy)   # flatboat lies across the road line, beside it
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
        ds.polygon([(px + 1.2 * k, py + 1.4 * k) for px, py in (P(-4.2, -2.0), P(4.2, -2.0), P(4.2, 2.0), P(-4.2, 2.0))], fill=(8, 16, 20, 110))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(1.0 * k))); d = ImageDraw.Draw(im)
        d.polygon([P(-4.2, -2.0), P(4.2, -2.0), P(4.6, 0), P(4.2, 2.0), P(-4.2, 2.0), P(-4.6, 0)], fill=(58, 42, 26, 255))
        d.polygon([P(-3.4, -1.2), P(3.4, -1.2), P(3.4, 1.2), P(-3.4, 1.2)], fill=(146, 120, 82, 255))
        for xx in (-2.0, -0.6, 0.8, 2.2):
            d.line([P(xx, -1.2), P(xx, 1.2)], fill=(96, 76, 50, 255), width=max(1, int(0.3 * k)))

    def fn_land(im, d, cx, cy, k):
        P = lambda x, y: rot(x * k, y * k, a, cx, cy)
        d.polygon([P(-2.2, -2.4), P(2.2, -2.4), P(2.2, 2.4), P(-2.2, 2.4)], fill=(150, 126, 88, 235))
        for xx in (-1.2, 0, 1.2):
            d.line([P(xx, -2.4), P(xx, 2.4)], fill=(92, 74, 50, 255), width=max(1, int(0.3 * k)))
        d.line([P(-2.2, -2.4), P(-2.2, 2.4)], fill=(40, 30, 18, 255), width=int(0.6 * k))
    for b in banks:
        stamp(b, fn_land, 8)
    nx, ny = -math.sin(a), math.cos(a)
    stamp((cr["x"] + nx * 2.2, cr["y"] + ny * 2.2), fn_boat, 10)


for cr in crossings:
    if cr["kind"] == "bridge":
        bridge(cr)
    elif cr["kind"] == "ferry":
        a = math.radians(cr["ang"]); dx, dy = math.cos(a), math.sin(a); h = cr["w"] / 2
        boat_and_landings(cr, [(cr["x"] - dx * (h + 0.8), cr["y"] - dy * (h + 0.8)), (cr["x"] + dx * (h + 0.8), cr["y"] + dy * (h + 0.8))])
    else:   # landing on the Mississippi bank + a moored boat
        boat_and_landings(cr, [cr["bank"]])
ov.save(os.path.join(OUT, "bridges.png"), optimize=True)

# ---- cleared lanes through the woods (one overlay per basemap) ----
road_img = np.zeros((H2, W2), np.uint8)
for rr in final:
    for c in rr["paths"]:
        pts = np.array([[x * 2, y * 2] for x, y in c], np.int32)
        cv2.polylines(road_img, [pts], False, 255, 1, cv2.LINE_AA)
dist = cv2.distanceTransform((road_img < 128).astype(np.uint8), cv2.DIST_L2, 5)     # image px from the road centre line
CORE, EDGE = float(os.environ.get("LANE_CORE", 8.0)), float(os.environ.get("LANE_EDGE", 13.0))   # half-widths, image px (road ~2.7)
lane_n = MH.fbm(H2 // 4, W2 // 4, 12, 3, 7)
lane_n = cv2.resize(lane_n, (W2, H2))
for key, base in (("w", BW), ("close", BC)):
    lum = cv2.GaussianBlur(base.astype(np.float32).mean(2), (0, 0), 2)       # painted canopies + ink: clearly darker than the grass
    bf = cv2.GaussianBlur(base.astype(np.float32), (0, 0), 2)
    green = (bf[..., 1] > bf[..., 0] + 7)                                       # canopies are green; bluff/hill ink is sepia
    trees = cv2.morphologyEx(((lum < 80) & (green | (key == "close")) & ~MH.water_mask(base)).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(bool)
    if key == "w":   # the wide map's ink pines (sepia line drawings): only where the ink sits in a pine clump, away from the hills
        trees |= MH.ink_mask(base, np.ones(base.shape[:2], bool)) & ~MH.water_mask(base) & (cv2.blur(green.astype(np.float32), (41, 41)) > 0.05)
    yy_, xx_ = np.ogrid[:H2, :W2]
    for T_ in meta["towns"].values():                                          # never clear inside a town sprite
        tcx, tcy, rr_ = T_["c"][0], T_["c"][1], 1.1 * T_["R_u"] / meta["S"]
        trees &= ((xx_ - tcx * 2) ** 2 + (yy_ - tcy * 2) ** 2) > (2 * rr_) ** 2
    corridor = dist < EDGE + 3
    hitm = cv2.dilate((trees & corridor).astype(np.uint8), np.ones((5, 5), np.uint8)).astype(bool) & corridor
    comp = base.astype(np.float32).copy()
    BAD = trees | MH.water_mask(base)
    okm = (~cv2.dilate(BAD.astype(np.uint8), np.ones((9, 9), np.uint8)).astype(bool)).astype(np.float32)
    bfl = base.astype(np.float32)
    small = lambda a: cv2.resize(a, (W2 // 8, H2 // 8), interpolation=cv2.INTER_AREA)
    den = cv2.GaussianBlur(small(okm), (0, 0), 6)[..., None]
    GRASS = cv2.resize(cv2.GaussianBlur(small(bfl * okm[..., None]), (0, 0), 6) / np.maximum(den, 1e-4), (W2, H2), interpolation=cv2.INTER_LINEAR)
    GRAIN = bfl - cv2.GaussianBlur(bfl, (0, 0), 3)
    GRAIN = np.roll(GRAIN, (97, 131), (0, 1))           # grain from elsewhere (no tree edges under the lane)
    blend = np.zeros((H2, W2), np.float32)
    nl, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(hitm.astype(np.uint8), np.ones((15, 15), np.uint8)))
    # tile big components (a long forest road) so each piece finds a clean grass patch nearby
    TL = 56
    tiles_ = []
    for i in range(1, nl):
        x, y, w, h, _a = st[i]
        for ty in range(y, y + h, TL):
            for tx in range(x, x + w, TL):
                tiles_.append((i, tx, ty, min(TL, x + w - tx), min(TL, y + h - ty)))
    for (i, x, y, w, h) in tiles_:
        x0, y0, x1, y1 = x, y, min(W2, x + w), min(H2, y + h)
        reg = (lab[y0:y1, x0:x1] == i) & corridor[y0:y1, x0:x1]
        if reg.sum() < 4:
            continue
        # grass for the lane: the local open-grass colour (masked blur of the non-tree, non-water ground) + the basemap's fine grain
        clean = GRASS[y0:y1, x0:x1] + np.clip(GRAIN[y0:y1, x0:x1], -10, 10)
        dd = dist[y0:y1, x0:x1] + 3.0 * lane_n[y0:y1, x0:x1]             # ragged lane edge (trees thin out)
        shade = np.clip((dd - CORE * 0.5) / (EDGE - CORE * 0.5), 0, 1)[..., None] * 0.12   # canopy shade at the lane edges
        clean = clean * (1 - shade)
        b = np.clip((EDGE - dd) / (EDGE - CORE), 0, 1) * reg
        b = b * b * (3 - 2 * b)
        comp[y0:y1, x0:x1] = comp[y0:y1, x0:x1] * (1 - b[..., None]) + clean * b[..., None]
        blend[y0:y1, x0:x1] = np.maximum(blend[y0:y1, x0:x1], b)
    Image.fromarray((np.clip(blend, 0, 1) * 255).astype(np.uint8)).save(os.path.join(OUT, f"blend_{key}.png")); Image.fromarray((hitm * 255).astype(np.uint8)).save(os.path.join(OUT, f"hitm_{key}.png"))
    rgba = MH.rgba_from(base, np.clip(np.round(comp), 0, 255).astype(np.uint8), np.clip(blend * 1.5, 0, 1))   # opaque lane (robust in the browser)
    Image.fromarray(rgba).save(os.path.join(OUT, f"lanes_{key}.png"), optimize=True)
    print(key, "lane px", int((blend > 0.05).sum()), "segments", nl - 1)

json.dump(dict(roads=final, crossings=crossings), open(os.path.join(OUT, "crossings.json"), "w"))
print(len(crossings), "crossings:", {k: sum(1 for c in crossings if c["kind"] == k) for k in ("bridge", "ferry", "landing")})
for c in crossings:
    print(c["kind"], c["road"], round(c["x"]), round(c["y"]), "w", round(c["w"], 1), "BIG" if c.get("big") else "")
