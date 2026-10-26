"""Fetch the OSM data for the `prospect` map (Fredericksburg - Hamilton's Crossing) from the OSM API 0.6 map calls (Overpass was down,
2026-10-18), tiles of 0.04 deg, keeping railways, roads, waterways, woods and historic nodes.
-> assets/src/prospect_osm.json {"source", "ways": {id: {"tags", "geom": [[lat, lon], ...]}}, "nodes": [...]} ((c) OpenStreetMap contributors, ODbL)
usage (from meade/): python3 tools/make_prospect_osm.py [CACHE_DIR]"""
import json, os, sys, time, subprocess
import xml.etree.ElementTree as ET
CACHE = sys.argv[1] if len(sys.argv) > 1 else "/tmp/prospect_osm"
os.makedirs(CACHE, exist_ok=True)
ways, nodes_out = {}, []
lon0, lon1, lat0, lat1, st = -77.56, -77.30, 38.20, 38.32, 0.04
def tile(la, lo, st):
    f = f"{CACHE}/t_{la:.3f}_{lo:.3f}_{st:.3f}.xml"
    if not os.path.exists(f) or os.path.getsize(f) < 1000:
        subprocess.run(["curl", "-sS", "-m", "120", f"https://api.openstreetmap.org/api/0.6/map?bbox={lo:.3f},{la:.3f},{lo + st:.3f},{la + st:.3f}", "-o", f])
        time.sleep(1.5)
    if os.path.getsize(f) < 1000 and b"too many nodes" in open(f, "rb").read():   # dense town tile: split in four
        for a in (0, st / 2):
            for b in (0, st / 2): tile(la + a, lo + b, st / 2)
        return
    try:
        root = ET.parse(f).getroot()
    except Exception as e:
        print("bad tile", f, e); return
    nd = {}
    for n in root.iter("node"):
        nd[n.get("id")] = (float(n.get("lat")), float(n.get("lon")))
        tg = {t.get("k"): t.get("v") for t in n.iter("tag")}
        if "historic" in tg or tg.get("tourism") in ("information", "attraction", "viewpoint") or "place" in tg:
            nodes_out.append({"id": n.get("id"), "lat": nd[n.get("id")][0], "lon": nd[n.get("id")][1], "tags": tg})
    for w in root.iter("way"):
        tg = {t.get("k"): t.get("v") for t in w.iter("tag")}
        keep = ("railway" in tg) or ("waterway" in tg) or tg.get("natural") in ("wood", "wetland", "water") or tg.get("landuse") == "forest" \
            or tg.get("highway") in ("motorway", "trunk", "primary", "secondary", "tertiary", "unclassified", "residential", "track")
        if not keep: continue
        g = [nd[r.get("ref")] for r in w.iter("nd") if r.get("ref") in nd]
        if len(g) < 2: continue
        wid = w.get("id")
        if wid in ways and len(ways[wid]["geom"]) >= len(g): continue
        ways[wid] = {"tags": tg, "geom": [[round(a, 6), round(b, 6)] for a, b in g]}
    print("tile", la, lo, st, len(ways), flush=True)
la = lat0
while la < lat1 - 1e-9:
    lo = lon0
    while lo < lon1 - 1e-9:
        tile(la, lo, st); lo += st
    la += st
seen = set(); nodes_u = [n for n in nodes_out if not (n["id"] in seen or seen.add(n["id"]))]
json.dump({"source": "OpenStreetMap API 0.6 map calls, 2026-10-18 (c) OpenStreetMap contributors, ODbL", "ways": ways, "nodes": nodes_u},
          open("assets/src/prospect_osm.json", "w"))
print("ways", len(ways), "nodes", len(nodes_u))
