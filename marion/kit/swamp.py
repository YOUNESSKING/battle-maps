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
    full = cv2.resize(cv2.GaussianBlur(sw.astype(np.float32), (0, 0), 1.2), (W, H), interpolation=cv2.INTER_LINEAR) > 0.5
    full &= ~water
    _CACHE[m] = full
    return full


if __name__ == "__main__":
    from PIL import Image
    m = sys.argv[1]; wt, _ = WM.build_water(m); sw = build_swamp(m, wt)
    v = np.zeros((H, W, 3), np.uint8) + np.array([150, 160, 110], np.uint8); v[sw] = (40, 70, 50); v[wt] = (70, 120, 160)
    Image.fromarray(v).resize((1440, 810)).save(sys.argv[2] if len(sys.argv) > 2 else f"/tmp/{m}_swamp.png")
    print(m, "swamp %.1f%%" % (100 * sw.mean()), "water %.1f%%" % (100 * wt.mean()))
