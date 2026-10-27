"""Named rivers + a faint stream network for the `carolinas` basemap (z9, 35.80N 80.20W), traced from the HD elevation
(downsampled 2x to map px; D8 flow with pysheds, as tools/make_rivers_dem.py). Greene #2 remake, MOVE 1 agent.
Each named river is followed DOWNHILL from a checked point on its upper course (water flows downhill, so the trace follows the
real valley), and split by name at its checked confluence (Yadkin -> Pee Dee at the Uwharrie mouth, Catawba -> Wateree at the
Wateree dam site, Haw -> Cape Fear at the Deep River mouth, Dan -> Roanoke at the Staunton mouth). Modern reservoirs (Lake Norman,
High Rock, Kerr...) are flat in the DEM: the trace runs through them as a single channel, which is what the 1781 river was.
-> assets/src/carolinas_rivers.json  {"named": {name: [[x, y], ...] map px}, "net": [{"o": 1|2, "pts": [...]}]}
usage (from greene2/): python3 tools/make_carolinas_rivers.py"""
import json, math
import numpy as np
from scipy import ndimage
if not hasattr(np, "in1d"): np.in1d = np.isin
from affine import Affine
from pysheds.grid import Grid
from pysheds.sview import Raster, ViewFinder

J = json.load(open("assets/carolinas.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; N = 256 * 2 ** Z
def P(lat, lon):
    r = math.radians(lat)
    return ((lon + 180) / 360 * N - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * N - OY)

# main stems traced to the sea / map edge, then cut by name at checked confluences: (name, start lat/lon, [(lat, lon, next name)])
MAINS = [
    ("CATAWBA", (35.745, -81.70), [(34.33, -80.70, "WATEREE")]),          # Morganton -> Wateree dam site
    ("YADKIN", (36.150, -81.17), [(35.19, -80.06, "PEE DEE")]),           # Wilkesboro -> Uwharrie mouth
    ("DAN", (36.41, -80.22), [(36.62, -78.53, "ROANOKE")]),               # below Hanging Rock (Danbury) -> Staunton mouth
    ("HAW", (36.12, -79.62), [(35.63, -79.06, "CAPE FEAR")]),             # below Reedy Fork -> Deep River mouth (Moncure)
    ("BROAD", (35.42, -81.90), []),                                       # Rutherford Co. -> Columbia
    ("APPOMATTOX", (37.32, -78.40), []),                                  # -> Petersburg / City Point
]
# tributaries: traced until they join a main stem
TRIBS = [("DEEP", (35.95, -79.88)), ("STAUNTON", (37.06, -79.60)), ("SOUTH FORK", (35.62, -81.28))]
D8 = {64: (-1, 0), 128: (-1, 1), 1: (0, 1), 2: (1, 1), 4: (1, 0), 8: (1, -1), 16: (0, -1), 32: (-1, -1)}

def main():
    e = np.load("assets/src/carolinas_hd_elev.npy").astype(np.float64)
    e = e.reshape(e.shape[0] // 2, 2, e.shape[1] // 2, 2).mean(axis=(1, 3))
    land = e > 0.5; H, W = e.shape
    # DEM voids inside reservoirs (High Rock, Blewett Falls...) are not sea: fill them with the nearest land height
    lab, nl = ndimage.label(~land); sizes = ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1))
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    hole = np.isin(lab, [i + 1 for i in range(nl) if sizes[i] < 40000 and (i + 1) not in edge])
    idx = ndimage.distance_transform_edt(~land, return_distances=False, return_indices=True)
    e = np.where(hole, e[idx[0], idx[1]] - 0.5, e); land = land | hole
    print("filled", int(hole.sum()), "void cells", flush=True)
    e = np.where(land, e, -50.0)
    vf = ViewFinder(affine=Affine(1, 0, 0, 0, 1, 0), shape=e.shape, nodata=-9999.0)
    g = Grid(viewfinder=vf); d = g.resolve_flats(g.fill_depressions(g.fill_pits(Raster(e, viewfinder=vf))))
    fdir = np.asarray(g.flowdir(d)); acc = np.asarray(g.accumulation(g.flowdir(d)))
    np.savez_compressed("assets/src/carolinas_flow.npz", fdir=fdir.astype(np.int16), acc=acc.astype(np.float32))
    def trace(start, taken=None):
        x, y = P(*start); c, r = int(round(x)), int(round(y))
        r0, r1, c0, c1 = max(0, r - 8), r + 9, max(0, c - 8), c + 9          # snap onto the biggest channel nearby
        k = np.unravel_index(np.argmax(acc[r0:r1, c0:c1]), acc[r0:r1, c0:c1].shape); r, c = r0 + k[0], c0 + k[1]
        pts = [(c, r)]
        for _ in range(20000):
            dd = D8.get(int(fdir[r, c]))
            if dd is None: break
            r, c = r + dd[0], c + dd[1]
            if not (0 <= r < H and 0 <= c < W) or not land[r, c]: break
            pts.append((c, r))
            if taken is not None and (c, r) in taken: break
        return pts
    named, taken = {}, set()
    for name, start, cuts in MAINS:
        pts = trace(start); taken |= set(pts); cur = name
        for la, lo, nxt in cuts:
            sx, sy = P(la, lo); i = int(np.argmin([math.hypot(px - sx, py - sy) for px, py in pts]))
            named[cur] = pts[:i + 1]; pts = pts[i:]; cur = nxt
        named[cur] = pts
    for name, start in TRIBS: named[name] = trace(start, taken)
    for k, v in named.items():
        print(k, len(v), "steps, acc at end %.0f" % acc[v[-1][1], v[-1][0]], flush=True)
        named[k] = [[float(px), float(py)] for px, py in v]
    net = []
    for o, thr in ((1, 4000), (2, 20000)):
        fc = g.extract_river_network(g.flowdir(d), Raster(((acc > thr) & land).astype(bool), viewfinder=ViewFinder(affine=vf.affine, shape=e.shape, nodata=False)))
        for f in fc["features"]:
            pts = f["geometry"]["coordinates"]
            if len(pts) > 3: net.append({"o": o, "pts": [[round(x, 1), round(y, 1)] for x, y in pts]})
    json.dump({"named": named, "net": net}, open("assets/src/carolinas_rivers.json", "w"))
    print("wrote assets/src/carolinas_rivers.json", len(net), "network segments")

if __name__ == "__main__":
    main()
