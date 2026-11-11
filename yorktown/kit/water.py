"""Coastal water for the Yorktown Style W basemaps (2e middle-ground carved blue, rivers/make_rivers.py palette BLUE_MIX 0.5).
build_water(map) -> (water, rivers): bool masks on the 5760 x 3240 basemap grid
   water  = cleaned sea/estuaries from assets/<map>_land.png (smoothed coast, no piers / grids / dredged cuts / spoil islands /
            inland ponds and reservoirs) + the named rivers (NHD lines, kit/data/rivers_<map>.json) + a few det_riv creeks
   rivers = only the narrow river/creek channels (woods may hug these, not the sea coast)
carve(rgb, water, seed) -> rgb painted with the carved middle-blue water: groove banks lit from the NW (dark wall + light rim),
   feathered darker bank band, thin soft dark edge, deeper tone offshore, faint shimmer streaks parallel to the banks."""
import json, math, os, sys
import numpy as np, cv2
from PIL import Image, ImageDraw
from scipy import ndimage
from skimage.morphology import skeletonize

HERE = os.path.dirname(os.path.abspath(__file__))
YT = os.path.dirname(HERE)
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, "data"))
from proj import ll2px  # noqa
from places import MAPS  # noqa
Image.MAX_IMAGE_PIXELS = None
W, H = 5760, 3240

# 2e palette (make_rivers.py): muted grey-blue mixed 50/50 with the Style W blue
OB = np.array([77, 125, 154], np.float32)
MIX = lambda muted, old: muted * 0.5 + old * 0.5
WATER = MIX(np.array([112, 119, 102], np.float32), OB)
WATER_DEEP = MIX(np.array([88, 98, 90], np.float32), OB * 0.84)
SHIMMER = MIX(np.array([132, 140, 130], np.float32), np.minimum(OB * 1.22, 255))
DARK = np.array([34, 38, 20], np.float32)
LIGHT = np.array([168, 170, 146], np.float32)
LDIR = np.array([-1.0, -1.0, 1.1]); LDIR /= np.linalg.norm(LDIR)


def disk(r):
    r = max(1, int(round(r))); return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)


def vnoise(cell, rng):
    g = rng.standard_normal((H // cell + 3, W // cell + 3)).astype(np.float32)
    n = cv2.resize(g, (W + 2 * cell, H + 2 * cell), interpolation=cv2.INTER_CUBIC)[cell:cell + H, cell:cell + W]
    return n / (n.std() + 1e-6)


def build_water(m):
    C = MAPS[m]; wc = C["water"]
    land = np.asarray(Image.open(f"{YT}/assets/{m}_land.png").convert("L")).astype(np.float32) / 255
    land = cv2.resize(land, (W, H), interpolation=cv2.INTER_LINEAR)
    land = cv2.GaussianBlur(land, (0, 0), wc["blur"]) > 0.5
    land = cv2.morphologyEx(land.astype(np.uint8), cv2.MORPH_OPEN, disk(wc["pier"])).astype(bool)        # piers, jetties, causeways
    sea = cv2.morphologyEx((~land).astype(np.uint8), cv2.MORPH_OPEN, disk(wc["chan"])).astype(bool)        # dredged cuts, canals, thin modern channels
    lab, n = ndimage.label(~sea)                                                                              # spoil islands / small islets -> water
    if n:
        sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); small = np.isin(lab, 1 + np.nonzero(sz < wc["island"])[0]); sea |= small
    lab, n = ndimage.label(sea)                                                                               # inland ponds + modern reservoirs go
    if n:
        sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
        edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        keep = [i + 1 for i in range(n) if sz[i] >= wc["lake"] or (i + 1) in edge]
        sea = np.isin(lab, keep)
    for la0, la1, lo0, lo1 in wc.get("dry", []):                                                            # named modern reservoirs -> land
        x0, y0 = ll2px(m, la1, lo0); x1, y1 = ll2px(m, la0, lo1)
        sea[max(0, int(y0 * 2)):int(y1 * 2), max(0, int(x0 * 2)):int(x1 * 2)] = False
    sea = cv2.GaussianBlur(sea.astype(np.float32), (0, 0), 1.5) > 0.5
    riv = np.zeros((H, W), np.uint8)
    rj = f"{HERE}/data/rivers_{m}.json"
    if C["rivers"] and os.path.exists(rj):
        R = json.load(open(rj)); im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
        for name, hw, (la0, la1, lo0, lo1) in C["rivers"]:
            for seg in R.get(name, []):
                pts = [(ll2px(m, la, lo)[0] * 2, ll2px(m, la, lo)[1] * 2) for la, lo in seg if la0 <= la <= la1 and lo0 <= lo <= lo1]
                if len(pts) > 1: d.line(pts, fill=255, width=int(round(2 * hw)), joint="curve")
                for p in pts[:1] + pts[-1:]: d.ellipse([p[0] - hw, p[1] - hw, p[0] + hw, p[1] + hw], fill=255)
        riv = np.asarray(im).copy()
        riv = (cv2.GaussianBlur(riv.astype(np.float32), (0, 0), 1.2) > 110).astype(np.uint8)
    if C["creeks"]:   # a few long creeks from det_riv (Style W recipe: skeleton, prune spurs, keep the longest), narrow constant width
        det = np.asarray(Image.open(f"{YT}/assets/media/{m}_det_riv.png"))[..., 3] > 25
        det &= ~cv2.dilate(sea.astype(np.uint8), disk(30)).astype(bool)
        h = cv2.resize(det.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0
        sk = skeletonize(np.pad(h, 120, mode="edge")); k3 = np.ones((3, 3), np.uint8)
        for _ in range(160):
            nb = cv2.filter2D(sk.astype(np.uint8), -1, k3, borderType=cv2.BORDER_CONSTANT) - sk; sk = sk & ~(nb <= 1)
        sk = sk[120:-120, 120:-120]
        lab, n = ndimage.label(sk, structure=np.ones((3, 3)))
        if n:
            ln = ndimage.sum(sk, lab, range(1, n + 1)); keep = 1 + np.argsort(ln)[::-1][:C["creeks"]]
            if C.get("creek_pick"):   # keep only the named creeks: the skeleton component nearest each named point
                ys, xs = np.nonzero(sk); keep = []
                for la, lo in C["creek_pick"]:
                    px, py = ll2px(m, la, lo); i = int(np.argmin((xs - px) ** 2 + (ys - py) ** 2)); keep.append(lab[ys[i], xs[i]])
                keep = np.array(sorted(set(keep)))
            sk = np.isin(lab, keep[ln[keep - 1] > 150])
            full = cv2.resize(sk.astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST)
            dist = cv2.distanceTransform((1 - (cv2.GaussianBlur(full.astype(np.float32), (0, 0), 2.5) > 0.06)).astype(np.uint8), cv2.DIST_L2, 5)
            creek = cv2.GaussianBlur(cv2.GaussianBlur(dist, (0, 0), 6) - 2.6, (0, 0), 1.5) <= 0
            # tie each creek to the river it drains into (the coast smoothing can leave a gap at the mouth)
            dsea, (iy, ix) = ndimage.distance_transform_edt(~sea, return_indices=True)
            lab2, n2 = ndimage.label(full, structure=np.ones((3, 3)))
            cim = Image.fromarray(creek.astype(np.uint8) * 255); cd = ImageDraw.Draw(cim)
            for k in range(1, n2 + 1):
                ys, xs = np.nonzero(lab2 == k); j = int(np.argmin(dsea[ys, xs]))
                if dsea[ys[j], xs[j]] < 260: cd.line([(xs[j], ys[j]), (ix[ys[j], xs[j]], iy[ys[j], xs[j]])], fill=255, width=6)
            creek = np.asarray(cim) > 0
            riv |= creek.astype(np.uint8)
    if C.get("wet"):   # hand-set water the land mask misses at this zoom (New York harbour, the East River): (half-width image px, [(lat, lon), ...])
        im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
        for hw, pts in C["wet"]:
            q = [(ll2px(m, la, lo)[0] * 2, ll2px(m, la, lo)[1] * 2) for la, lo in pts]; d.line(q, fill=255, width=int(2 * hw), joint="curve")
            for p in q: d.ellipse([p[0] - hw, p[1] - hw, p[0] + hw, p[1] + hw], fill=255)
        sea |= cv2.GaussianBlur(np.asarray(im).astype(np.float32), (0, 0), 1.5) > 110
    water = sea | riv.astype(bool)
    return water, riv.astype(bool) & ~cv2.erode(sea.astype(np.uint8), disk(2)).astype(bool)


def carve(img, water, seed=5):
    """img float32 HxWx3 (0..255); returns the carved-water composite (float32)."""
    rng = np.random.default_rng(seed)
    wm = water.astype(np.uint8)
    dl = cv2.distanceTransform(1 - wm, cv2.DIST_L2, 5)            # land px: distance to water
    dw = cv2.distanceTransform(wm, cv2.DIST_L2, 5)                # water px: distance to the shore
    sd = dl - dw                                                   # signed: + land, - water
    # bigness (0 creek .. 1 wide water) from the local channel half-width
    small = cv2.resize(dw, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    hwl = cv2.resize(ndimage.maximum_filter(small, 9), (W, H), interpolation=cv2.INTER_LINEAR)
    big = smoothstep(3.0, 12.0, hwl)
    # carved groove height field, lit from the NW
    bank_w = 3.0 + 4.0 * big; depth = 1.0 + 1.2 * big
    h = -depth * (1 - smoothstep(-0.6, bank_w, sd)) - 0.35 * (1 - smoothstep(0, bank_w + 4, sd)) * (0.4 + big)
    hs = cv2.GaussianBlur(h, (0, 0), 0.9)
    gx = cv2.Sobel(hs, cv2.CV_32F, 1, 0, ksize=3) / 8; gy = cv2.Sobel(hs, cv2.CV_32F, 0, 1, ksize=3) / 8
    nx, ny = -gx * 2.6, -gy * 2.6; nn = np.sqrt(nx * nx + ny * ny + 1)
    shade = np.clip(((nx * LDIR[0] + ny * LDIR[1] + LDIR[2]) / nn - LDIR[2]) * 1.1, -0.30, 0.26)
    del gx, gy, nx, ny, nn, hs, h
    # bank band (mostly on the NW bank), light lip on the SE bank
    dg = cv2.GaussianBlur(sd, (0, 0), 2.0)
    ddx = cv2.Sobel(dg, cv2.CV_32F, 1, 0, ksize=3); ddy = cv2.Sobel(dg, cv2.CV_32F, 0, 1, ksize=3)
    side = np.clip((ddx + ddy) / 1.414 / np.maximum(np.hypot(ddx, ddy), 1e-3), -1, 1)   # on land: +1 water lies to the NW... flip below
    side = -side
    del ddx, ddy, dg
    band_w = 8.0 + 8.0 * big
    band = (1 - smoothstep(0, band_w, sd)) * (0.15 + 0.05 * big) * (1 + 0.25 * vnoise(25, rng)) * (sd > 0)
    band *= 1 + 0.65 * side
    halo = (1 - smoothstep(1.0, 7.0 + 4.0 * big, sd)) * 0.13 * np.clip(-side, 0, 1) * (sd > 0)
    # water colour: deeper away from the shore, faint shimmer streaks parallel to the banks (kept near the shore on open water)
    deep = smoothstep(2.0, 40.0, dw) * (0.35 + 0.4 * big)
    wcol = WATER[None, None] * (1 - deep[..., None]) + WATER_DEEP[None, None] * deep[..., None]
    wcol = wcol * (1 + 0.018 * vnoise(60, rng))[..., None]
    streak = (0.5 + 0.5 * np.sin(2 * np.pi * dw / 5.5 + vnoise(90, rng) * 1.2)) ** 6
    shim = streak * smoothstep(0.2, 1.4, vnoise(70, rng)) * (0.05 + 0.18 * big) * (1 - smoothstep(30, 90, dw)) * (dw > 1.5)
    wcol = wcol * (1 - shim[..., None]) + SHIMMER * shim[..., None]
    del streak, shim, deep
    walpha = np.clip(0.5 - sd, 0, 1)[..., None]
    g = img * (1 - band[..., None]); g = g * (1 - halo[..., None]) + LIGHT * halo[..., None]
    out = g * (1 - walpha) + wcol * walpha
    pos = np.clip(shade, 0, None)[..., None]; neg = np.clip(-shade, 0, None)[..., None]
    out = out * (1 - neg) + DARK * neg
    edge = np.exp(-((sd - 0.4) / (1.1 + 0.6 * big)) ** 2) * (0.26 + 0.14 * np.clip(side, 0, 1))
    out = out * (1 - edge[..., None]) + DARK * edge[..., None]
    out = out * (1 - pos) + LIGHT * pos
    return np.clip(out, 0, 255)


if __name__ == "__main__":
    m = sys.argv[1]; wt, rv = build_water(m)
    Image.fromarray((wt * 255).astype(np.uint8)).resize((1440, 810)).save(sys.argv[2] if len(sys.argv) > 2 else f"/tmp/{m}_water.png")
    print(m, "water %.1f%%" % (100 * wt.mean()), "rivers px", int(rv.sum()))
