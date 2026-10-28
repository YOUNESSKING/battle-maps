"""Named rivers + faint stream network for the MOVE 3 basemaps (Sherman #13, MOVE 3 agent), traced from the HD elevation (downsampled 2x
to map px; D8 flow with pysheds), copied from greene2/tools/make_carolinas_rivers.py. Each named river is followed DOWNHILL from a
checked point on its upper course, and cut by name at its checked confluence.
  carolinas (z9, 34.25N 79.90W): the six rivers across Sherman's path in the order he met them (SAVANNAH, SALKEHATCHIE (-> COMBAHEE),
    EDISTO (North Fork, Orangeburg), CONGAREE (Broad above Columbia -> Congaree -> Santee), PEE DEE (Cheraw), CAPE FEAR (Fayetteville))
    + WATEREE, NEUSE for context.
  bentonville (z13, 35.30N 78.32W): MILL CREEK (start = OSM/Nominatim stream head 35.2918N 78.4053W; the bridge behind Johnston), NEUSE, FALLING CREEK.
-> assets/src/<base>_m3_rivers.json  {"named": {name: [[x, y], ...] map px}, "net": [{"o": 1|2, "pts": [...]}]}
usage (from sherman/): python3 tools/make_m3_rivers.py [carolinas|bentonville]"""
import json, math, sys
import numpy as np
from scipy import ndimage
if not hasattr(np, "in1d"): np.in1d = np.isin
from affine import Affine
from pysheds.grid import Grid
from pysheds.sview import Raster, ViewFinder

CFG = {
    "carolinas": dict(
        mains=[("SAVANNAH", (33.62, -82.18), []),                                          # above Augusta -> the sea
               ("SALKEHATCHIE", (33.33, -81.33), [(32.80, -80.84, "COMBAHEE")]),            # near Barnwell -> Rivers' Bridge -> Combahee
               ("EDISTO", (33.80, -81.42), []),                                            # North Fork (Orangeburg) -> the sea
               ("CONGAREE", (34.30, -81.20), [(33.80, -80.63, "SANTEE")]),                  # Broad above Columbia -> Congaree -> Santee
               ("PEE DEE", (35.15, -80.06), []),                                           # below the Uwharrie mouth -> Cheraw -> sea
               ("CAPE FEAR", (35.62, -79.06), []),                                         # Deep River mouth -> Fayetteville -> sea
               ("NEUSE", (35.95, -78.70), []), ("WATEREE", (34.33, -80.70), [])],
        tribs=[], thr=((1, 4000), (2, 20000)), down=2),
    "bentonville": dict(
        mains=[("NEUSE", (35.412, -78.24), []), ("MILL CREEK", (35.2918, -78.4053), []), ("FALLING CREEK", (35.2614, -78.2768), [])],
        tribs=[], thr=((1, 3000), (2, 15000)), down=2),
}
D8 = {64: (-1, 0), 128: (-1, 1), 1: (0, 1), 2: (1, 1), 4: (1, 0), 8: (1, -1), 16: (0, -1), 32: (-1, -1)}

def main(base):
    c = CFG[base]
    J = json.load(open(f"assets/{base}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; N = 256 * 2 ** Z
    def P(lat, lon):
        r = math.radians(lat)
        return ((lon + 180) / 360 * N - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * N - OY)
    e = np.load(f"assets/src/{base}_hd_elev.npy").astype(np.float64)
    e = e[: e.shape[0] // 2 * 2, : e.shape[1] // 2 * 2]
    e = e.reshape(e.shape[0] // 2, 2, e.shape[1] // 2, 2).mean(axis=(1, 3))
    land = e > 0.5; H, W = e.shape
    lab, nl = ndimage.label(~land); sizes = ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1))
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    hole = np.isin(lab, [i + 1 for i in range(nl) if sizes[i] < 40000 and (i + 1) not in edge])
    idx = ndimage.distance_transform_edt(~land, return_distances=False, return_indices=True)
    e = np.where(hole, e[idx[0], idx[1]] - 0.5, e); land = land | hole
    e = np.where(land, e, -50.0)
    vf = ViewFinder(affine=Affine(1, 0, 0, 0, 1, 0), shape=e.shape, nodata=-9999.0)
    g = Grid(viewfinder=vf); d = g.resolve_flats(g.fill_depressions(g.fill_pits(Raster(e, viewfinder=vf))))
    fdir = np.asarray(g.flowdir(d)); acc = np.asarray(g.accumulation(g.flowdir(d)))
    def trace(start):
        x, y = P(*start); cc, r = int(round(x)), int(round(y)); r = min(max(r, 0), H - 1); cc = min(max(cc, 0), W - 1)
        r0, r1, c0, c1 = max(0, r - 10), r + 11, max(0, cc - 10), cc + 11
        k = np.unravel_index(np.argmax(acc[r0:r1, c0:c1]), acc[r0:r1, c0:c1].shape); r, cc = r0 + k[0], c0 + k[1]
        pts = [(cc, r)]
        for _ in range(40000):
            dd = D8.get(int(fdir[r, cc]))
            if dd is None: break
            r, cc = r + dd[0], cc + dd[1]
            if not (0 <= r < H and 0 <= cc < W) or not land[r, cc]: break
            pts.append((cc, r))
        return pts
    named = {}
    for name, start, cuts in c["mains"]:
        pts = trace(start); cur = name
        for la, lo, nxt in cuts:
            sx, sy = P(la, lo); i = int(np.argmin([math.hypot(px - sx, py - sy) for px, py in pts]))
            named[cur] = pts[:i + 1]; pts = pts[i:]; cur = nxt
        named[cur] = pts
    for k, v in named.items():
        print(k, len(v), "steps", v[0], "->", v[-1], flush=True)
        named[k] = [[float(px), float(py)] for px, py in v[::2]] + ([[float(v[-1][0]), float(v[-1][1])]] if len(v) % 2 == 0 else [])
    net = []
    for o, thr in c["thr"]:
        fc = g.extract_river_network(g.flowdir(d), Raster(((acc > thr) & land).astype(bool), viewfinder=ViewFinder(affine=vf.affine, shape=e.shape, nodata=False)))
        for f in fc["features"]:
            pts = f["geometry"]["coordinates"]
            if len(pts) > 3: net.append({"o": o, "pts": [[round(x, 1), round(y, 1)] for x, y in pts[::2]]})
    json.dump({"named": named, "net": net}, open(f"assets/src/{base}_m3_rivers.json", "w"))
    print("wrote", base, len(named), "named,", len(net), "net")

if __name__ == "__main__":
    for b in (sys.argv[1:] or ["carolinas", "bentonville"]): main(b)
