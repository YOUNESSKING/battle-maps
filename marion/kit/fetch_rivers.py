"""Fetch the 1780 rivers for a Marion map -> kit/data/rivers_<map>.json {name: [[[lat, lon], ...], ...]}.
usage (from marion/): python3 kit/fetch_rivers.py <map>
Two sources:
  NHD flowlines by GNIS name (USGS; layer 4 small scale for the z10 map, layer 6 large scale for z12-13), for every river the
  modern dams did NOT drown;
  THE 1780 SANTEE (+ the Congaree below Columbia): the legal county lines in kit/data/tiger_counties.json (Census TIGERweb). The county
  boundaries were drawn on the river channel long before the 1941-42 Santee-Cooper dams and still follow the OLD channel under Lake Marion;
  checked against the USGS 1:48,000 Eutawville + Chicora (1920) and 1:62,500 Elloree (1946, old channel shown in the lake) quadrangles
  (overlay proof in kit/PLACES.md). NHD "Santee River" is never used (its artificial path runs through the reservoir).
Creeks under the lake (Horse Creek, Scott's Lake) are hand-traced from the 1920 quads in places.py (HAND_WATER)."""
import json, math, sys, urllib.parse, urllib.request
import numpy as np
from scipy.spatial import cKDTree
sys.path.insert(0, "kit"); sys.path.insert(0, "kit/data")
from places import MAPS   # noqa
m = sys.argv[1]; J = json.load(open(f"assets/{m}.json")); C = MAPS[m]
z = J["zoom"]; ox, oy = J["origin_world_px"]; n = 256 * 2 ** z
p2l = lambda x, y: (math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (oy + y) / n)))), (ox + x) / n * 360 - 180)
la1, lo0 = p2l(-200, -200); la0, lo1 = p2l(3080, 1820)
LAYER = 4 if z <= 10 else 6
out = {}
for nm in C.get("nhd", []):
    segs, off = [], 0
    while True:
        q = {"where": f"gnis_name='{nm}'", "geometry": f"{lo0},{la0},{lo1},{la1}", "geometryType": "esriGeometryEnvelope", "inSR": 4326, "outSR": 4326,
             "spatialRel": "esriSpatialRelIntersects", "outFields": "gnis_name", "returnGeometry": "true", "maxAllowableOffset": J["meters_per_px"] / 111000 / 3,
             "f": "geojson", "resultOffset": off, "resultRecordCount": 1000}
        u = f"https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/{LAYER}/query?" + urllib.parse.urlencode(q)
        d = None
        for k in range(4):
            try: d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "map-kit"}), timeout=120)); break
            except Exception as e: print("retry", nm, e, flush=True)
        if not d: break
        fs = d.get("features", [])
        for f in fs:
            g = f["geometry"]
            if not g: continue
            ls = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
            segs += [[[round(la, 5), round(lo, 5)] for lo, la in l] for l in ls]
        off += len(fs)
        if len(fs) < 1000 and not d.get("exceededTransferLimit"): break
    out[nm] = segs; print("nhd", nm, len(segs), sum(len(s) for s in segs), flush=True)
# county-line rivers (shared boundary runs of two counties)
T = json.load(open("kit/data/tiger_counties.json")); R = {}
for f in T["features"]:
    g = f["geometry"]; R[f["properties"]["BASENAME"]] = [np.array(r) for r in (g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p])]
CK = math.cos(math.radians(33.5))
for nm, pairs in C.get("county", {}).items():
    segs = []
    for a, b in pairs:
        t = cKDTree(np.vstack(R[b]) * [CK, 1])
        for ring in R[a]:
            dd, _ = t.query(ring * [CK, 1]); on = dd < 0.0006; cur = []
            for p, o in zip(ring.tolist(), on):
                if o: cur.append([round(p[1], 5), round(p[0], 5)])
                elif cur:
                    if len(cur) > 5: segs.append(cur)
                    cur = []
            if len(cur) > 5: segs.append(cur)
    # keep only the part inside the map (+ margin)
    segs = [[p for p in s if la0 - 0.05 <= p[0] <= la1 + 0.05 and lo0 - 0.05 <= p[1] <= lo1 + 0.05] for s in segs]
    out[nm] = [s for s in segs if len(s) > 1]; print("county", nm, len(out[nm]), sum(len(s) for s in out[nm]), flush=True)
json.dump(out, open(f"kit/data/rivers_{m}.json", "w"))
