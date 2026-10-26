"""Light OSM fetch for the Moscow map (move 1): towns only (no villages), rivers, lakes + forests in the battle box, split into
small Overpass queries (the shared fetch_osm.py timed out on Moscow oblast's villages). -> assets/src/moscow_osm.json (same format).
Data (c) OpenStreetMap contributors (ODbL)."""
import json, os, sys, time, urllib.parse, urllib.request
URLS = ["https://overpass.private.coffee/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
FULL = "55.33,34.92,56.57,38.88"
path = "assets/src/moscow_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out.update({"bbox": FULL, "focus": "55.60,35.70,56.40,37.80"})
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
JOBS0 = {"places": [f'node["place"~"^(city|town)$"]({FULL});out;'],
        "rivers": [f'way["waterway"="river"]["name"]({b});out geom;' for b in tiles(55.40, 35.30, 56.50, 38.20, 4, 3)],
        "lakes": [f'way["natural"="water"]["name"]({b});out geom;' for b in tiles(55.60, 35.70, 56.40, 37.80, 4, 2)],
        "forest": [f'(way["landuse"="forest"]({b});way["natural"="wood"]({b}););out geom;' for b in tiles(55.85, 35.70, 56.15, 36.50, 4, 2)]}   # woods of the Volokolamsk sector only
JOBS = {k: JOBS0[k] for k in ("places", "lakes", "forest", "rivers")}
for k, bodies in JOBS.items():
    if k in out and out[k]: continue
    res = []
    for b in bodies:
        t = time.time(); r = q(b); res += r; print(k, len(r), f"{time.time() - t:.0f}s", flush=True)
    out[k] = res; json.dump(out, open(path, "w"))
out.setdefault("streams", [])
json.dump(out, open(path, "w"))
print({k: len(v) for k, v in out.items() if isinstance(v, list)})
