"""Rivers traced from the elevation (D8 flow accumulation, pysheds) for the Cobra move maps: offline fallback for OSM
waterways (Overpass timed out on 2026-10-10). Same method as tools/make_rivers_dem.py, own outputs.
usage: python3 tools/make_cob_rivers.py cob|nor
  cob: assets/src/cobra_hd_elev.npy (5760x3240) -> assets/src/cob_dem_rivers.json
  nor: z10 elevation tiles (tools/.tiles cache, same as bake.py) at map resolution 2880x1620 -> assets/src/nor_dem_rivers.json
Output: [{"order": 1|2|3, "pts": [[x, y], ...]}] in MAP px (2880x1620). Elevation: Mapzen / AWS Terrain Tiles (open data)."""
import json, os, sys
import numpy as np
if not hasattr(np, "in1d"): np.in1d = np.isin
from affine import Affine
from pysheds.grid import Grid
from pysheds.sview import Raster, ViewFinder
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
key = sys.argv[1]
if key == "cob":
    e = np.load("assets/src/cobra_hd_elev.npy").astype(np.float64); S = 2.0; THR = ((1, 4000), (2, 30000), (3, 200000))
else:
    from bake import tile
    J = json.load(open("assets/normandy.json")); z = J["zoom"]; W, H = J["size"]; x0, y0 = J["origin_world_px"]
    tx0, ty0, tx1, ty1 = x0 // 256, y0 // 256, (x0 + W) // 256, (y0 + H) // 256
    mos = np.vstack([np.hstack([tile(z, tx, ty).astype(np.float32) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
    e = mos[y0 - ty0 * 256:y0 - ty0 * 256 + H, x0 - tx0 * 256:x0 - tx0 * 256 + W].astype(np.float64); S = 1.0
    THR = ((1, 2500), (2, 12000), (3, 60000))
land = e > 0.5
e = np.where(land, e, -50.0)
vf = ViewFinder(affine=Affine(1, 0, 0, 0, 1, 0), shape=e.shape, nodata=-9999.0)
dem = Raster(e, viewfinder=vf); g = Grid(viewfinder=vf)
d = g.resolve_flats(g.fill_depressions(g.fill_pits(dem)))
fdir = g.flowdir(d); acc = np.asarray(g.accumulation(fdir))
out = []
for order, thr in THR:
    fc = g.extract_river_network(fdir, Raster(((acc > thr) & land).astype(bool), viewfinder=ViewFinder(affine=vf.affine, shape=e.shape, nodata=False)))
    for f in fc["features"]:
        pts = f["geometry"]["coordinates"]
        if len(pts) > 3: out.append({"order": order, "pts": [[round(x / S, 1), round(y / S, 1)] for x, y in pts]})
    print("order", order, "segments", sum(1 for o in out if o["order"] == order), flush=True)
json.dump(out, open(f"assets/src/{key}_dem_rivers.json", "w"))
