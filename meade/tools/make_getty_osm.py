"""Fetch the Gettysburg geography (roads, streams, railroad, historic nodes) from the OSM API 0.6 map calls in 0.03-deg tiles
(Overpass was down 2026-10-18). -> assets/src/getty_osm.json {"ways": {id: {"tags", "geom": [[lat, lon], ...]}}, "nodes": [...]}
Data (c) OpenStreetMap contributors (ODbL). usage (from meade/): python3 tools/make_getty_osm.py"""
import json, os, time, urllib.request, xml.etree.ElementTree as ET
S, W, N, E = 39.757, -77.360, 39.867, -77.110; step = 0.03
path = "assets/src/getty_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {"ways": {}, "nodes": {}, "done": []}
KEEP = ("highway", "waterway", "railway", "natural", "historic")
la = S
while la < N:
    lo = W
    while lo < E:
        key = f"{la:.3f},{lo:.3f}"
        if key not in out["done"]:
            url = f"https://api.openstreetmap.org/api/0.6/map?bbox={lo:.4f},{la:.4f},{min(lo+step,E):.4f},{min(la+step,N):.4f}"
            for k in range(4):
                try:
                    x = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "battle-maps/1.0"}), timeout=120).read(); break
                except Exception as ex:
                    print("retry", key, ex, flush=True); time.sleep(5 * (k + 1))
            else: raise SystemExit("fail " + key)
            root = ET.fromstring(x); nd = {}
            for n in root.iter("node"):
                nd[n.get("id")] = [float(n.get("lat")), float(n.get("lon"))]
                tg = {t.get("k"): t.get("v") for t in n.iter("tag")}
                if "historic" in tg or "natural" in tg and tg.get("natural") in ("peak", "hill"):
                    out["nodes"][n.get("id")] = {"tags": tg, "ll": nd[n.get("id")]}
            for w in root.iter("way"):
                tg = {t.get("k"): t.get("v") for t in w.iter("tag")}
                if not any(k in tg for k in KEEP): continue
                g = [nd[r.get("ref")] for r in w.iter("nd") if r.get("ref") in nd]
                old = out["ways"].get(w.get("id"))
                if old is None or len(g) > len(old["geom"]): out["ways"][w.get("id")] = {"tags": tg, "geom": g}
            out["done"].append(key); json.dump(out, open(path, "w")); print(key, len(out["ways"]), flush=True)
        lo += step
    la += step
print("ways", len(out["ways"]), "nodes", len(out["nodes"]))
