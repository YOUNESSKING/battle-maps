"""Light OSM fetch for the ardennes map (Collins move 3, Celles, z10): towns + rivers map-wide, split into small Overpass queries
(same approach as rokossovsky/tools/make_kursk_osm.py). -> assets/src/ard_osm.json. Data (c) OpenStreetMap contributors (ODbL).
usage (from collins/): python3 tools/make_ard_osm.py"""
import json, os, time, urllib.parse, urllib.request
URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
S, W, N, E = 49.30, 3.20, 51.05, 7.30
path = "assets/src/ard_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out["bbox"] = f"{S},{W},{N},{E}"
def q(body):
    for k in range(6):
        url = URLS[k % len(URLS)]
        try:
            data = urllib.parse.urlencode({"data": "[out:json][timeout:170];" + body}).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"User-Agent": "battle-maps/1.0"}), timeout=190))["elements"]
        except Exception as ex:
            print("retry", k, url, ex, flush=True); time.sleep(4)
    raise SystemExit("overpass failed")
def tiles(s, w, n, e, nx, ny):
    for i in range(nx):
        for j in range(ny):
            yield f"{s + (n - s) * j / ny:.3f},{w + (e - w) * i / nx:.3f},{s + (n - s) * (j + 1) / ny:.3f},{w + (e - w) * (i + 1) / nx:.3f}"
B = f"{S},{W},{N},{E}"
JOBS = {"places": [f'node["place"~"^(city|town)$"]({B});out;'],
        "rivers": [f'way["waterway"="river"]({b});out geom;' for b in tiles(S, W, N, E, 3, 2)],
        "lakes": [f'way["natural"="water"]["water"~"^(lake|reservoir)$"]({B});out geom;']}
for k, bodies in JOBS.items():
    if k in out and out[k]: continue
    res = []
    for b in bodies:
        t = time.time(); r = q(b); res += r; print(k, len(r), f"{time.time() - t:.0f}s", flush=True)
    out[k] = res; json.dump(out, open(path, "w"))
print({k: len(v) for k, v in out.items() if isinstance(v, list)})
