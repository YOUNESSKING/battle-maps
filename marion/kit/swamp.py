"""MARION KIT: the cypress swamp mask (MAP_BRIEF: "swamps are the story ground"; STYLE_LOCK 2e woods kept, 2f no fields).
build_swamp(map, water) -> bool mask on the 5760 x 3240 basemap grid (call after water.build_water, which fills water.RIVMASK).
Swamp = the river floodplain from the DEM: height above the nearest story river (HAND) <= places.py swamp.hand metres, within swamp.dist
metres of it, only along the rivers listed in swamp.on. Under Lake Marion the DEM is the flat lake surface (HAND ~0), so the drowned Santee
swamp comes back as swamp, as on the 1920 Eutawville / Chicora quads ("SANTEE SWAMP"); a morphological close (swamp.close, quarter-grid px)
removes the thin modern embankments (I-95 causeway, dams) that would otherwise cut it. Woods never grow on the water itself."""
import os, sys
import numpy as np, cv2
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, "data"))
from places import MAPS  # noqa
import water as WM  # noqa
import json
W, H = 5760, 3240
_CACHE = {}


def build_swamp(m, water):
    if m in _CACHE: return _CACHE[m]
    C = MAPS[m]; S = C.get("swamp")
    if not S: _CACHE[m] = np.zeros((H, W), bool); return _CACHE[m]
    f = 4; h, w = H // f, W // f
    e = np.load(f"{ROOT}/assets/src/{m}_hd_elev.npy").astype(np.float32); e[e < -50] = 0
    e = cv2.resize(e, (w, h), interpolation=cv2.INTER_AREA); e = cv2.GaussianBlur(e, (0, 0), 1.5)
    R = np.zeros((h, w), bool)
    for nm in S["on"]:
        if nm in WM.RIVMASK: R |= cv2.resize(WM.RIVMASK[nm].astype(np.uint8), (w, h), interpolation=cv2.INTER_AREA) > 0
    if not R.any(): _CACHE[m] = np.zeros((H, W), bool); return _CACHE[m]
    lev = ndimage.minimum_filter(np.where(R, e, 1e4), size=7)          # river level: the low point of the channel (DEM noise / bank pixels)
    lev = np.where(R, np.minimum(lev, e), 1e4)
    dist, (iy, ix) = ndimage.distance_transform_edt(~R, return_indices=True)
    mpp = json.load(open(f"{ROOT}/assets/{m}.json"))["meters_per_px"] / 2 * f
    hand = e - lev[iy, ix]
    sw = (hand <= S["hand"]) & (dist * mpp <= S["dist"])
    k = S.get("close", 6)
    sw = cv2.morphologyEx(sw.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * k + 1, 2 * k + 1))).astype(bool)
    sw = cv2.morphologyEx(sw.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))).astype(bool)
    lab, n = ndimage.label(sw)
    if n:   # small pockets go (the swamp is a band along the river, not speckle)
        sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); sw = np.isin(lab, 1 + np.nonzero(sz >= 400)[0])
    ADD = np.zeros((h, w), np.float32); DRY = np.zeros((h, w), np.float32)
    for poly in S.get("add", []):   # forced swamp (lat/lon polygons): e.g. the Wilson dam embankment strip (a modern ridge in the DEM)
        from proj import ll2px
        from PIL import Image, ImageDraw
        im = Image.new("L", (w, h), 0); ImageDraw.Draw(im).polygon([(ll2px(m, la, lo)[0] * 2 / f, ll2px(m, la, lo)[1] * 2 / f) for la, lo in poly], fill=255); ADD = np.maximum(ADD, np.asarray(im) / 255.0)
    for nm, lo0, lo1, la_bot in S.get("dry_south", []):   # bluff side of the river (1920 quads): no swamp south of the channel in [lo0, lo1]
        from proj import ll2px
        Rj = json.load(open(f"{HERE}/data/rivers_{m}.json")).get(nm, [])
        pts = sorted([p for seg in Rj for p in seg if lo0 <= p[1] <= lo1], key=lambda p: p[1])
        if len(pts) > 1:
            from PIL import Image, ImageDraw
            im = Image.new("L", (w, h), 0); q = [(ll2px(m, la, lo)[0] * 2 / f, ll2px(m, la, lo)[1] * 2 / f + 6) for la, lo in pts]
            q += [(q[-1][0], ll2px(m, la_bot, lo1)[1] * 2 / f), (q[0][0], ll2px(m, la_bot, lo0)[1] * 2 / f)]
            ImageDraw.Draw(im).polygon(q, fill=255); DRY = np.maximum(DRY, np.asarray(im) / 255.0)
    for edge in S.get("dry_north", []):   # upland north of the 1920 swamp edge (Lake Marion drowned it; it was never swamp)
        from proj import ll2px
        from PIL import Image, ImageDraw
        q = [(ll2px(m, la, lo)[0] * 2 / f, ll2px(m, la, lo)[1] * 2 / f) for la, lo in edge]
        ytop = ll2px(m, max(la for la, lo in edge) + 0.012, 0)[1] * 2 / f   # close the polygon just above the edge (never the whole map north of it)
        q += [(q[-1][0], ytop), (q[0][0], ytop)]
        im = Image.new("L", (w, h), 0); ImageDraw.Draw(im).polygon(q, fill=255); DRY = np.maximum(DRY, np.asarray(im) / 255.0)
    # organic edge: blur + low-frequency noise before the threshold (no ruler-straight edges where a clip line cuts the floodplain)
    g_ = np.random.default_rng(7).standard_normal((h // 8 + 2, w // 8 + 2)).astype(np.float32)
    nz = cv2.resize(cv2.GaussianBlur(g_, (0, 0), 1.2), (w, h), interpolation=cv2.INTER_CUBIC); nz /= nz.std() + 1e-6
    # r3: the clip / add polygons are FEATHERED (~0.6 km) and noise-broken, never a ruler edge (critic: rectangular swamp blocks)
    soft = lambda a: cv2.GaussianBlur(a.astype(np.float32), (0, 0), S.get("feather", 14))
    swf = np.maximum(cv2.GaussianBlur(sw.astype(np.float32), (0, 0), 3.0), soft(ADD)) * (1 - np.clip(soft(DRY) * 1.15, 0, 1)) + 0.16 * nz
    sw = swf > 0.5; lab, n = ndimage.label(sw)
    if n: sz = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); sw = np.isin(lab, 1 + np.nonzero(sz >= 600)[0])
    full = cv2.resize(cv2.GaussianBlur(sw.astype(np.float32), (0, 0), 0.8), (W, H), interpolation=cv2.INTER_LINEAR) > 0.5
    full &= ~water
    _CACHE[m] = full
    return full


if __name__ == "__main__":
    from PIL import Image
    m = sys.argv[1]; wt, _ = WM.build_water(m); sw = build_swamp(m, wt)
    v = np.zeros((H, W, 3), np.uint8) + np.array([150, 160, 110], np.uint8); v[sw] = (40, 70, 50); v[wt] = (70, 120, 160)
    Image.fromarray(v).resize((1440, 810)).save(sys.argv[2] if len(sys.argv) > 2 else f"/tmp/{m}_swamp.png")
    print(m, "swamp %.1f%%" % (100 * sw.mean()), "water %.1f%%" % (100 * wt.mean()))
