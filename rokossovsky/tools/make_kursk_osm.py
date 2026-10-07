"""Light OSM fetch for the Kursk map (move 2): towns (no villages map-wide), rivers, villages + lakes + forests in the Ponyri battle box,
split into small Overpass queries (the shared fetch_osm.py timed out). -> assets/src/kursk_osm.json (same format as fetch_osm.py).
Data (c) OpenStreetMap contributors (ODbL)."""
import json, os, time, urllib.parse, urllib.request
URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
FULL = "50.97,32.34,53.69,40.25"; FOCUS = (52.05, 35.75, 52.55, 36.65)
path = "assets/src/kursk_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out.update({"bbox": FULL, "focus": ",".join(map(str, FOCUS))})
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
F = ",".join(map(str, FOCUS))
JOBS = {"places": [f'node["place"~"^(city|town)$"]({FULL});out;'],
        "villages": [f'node["place"~"^(village|hamlet)$"]({F});out;'],
        "rivers": [f'way["waterway"="river"]({b});out geom;' for b in tiles(50.97, 32.34, 53.69, 40.25, 3, 2)],
        "streams": [f'way["waterway"="stream"]({F});out geom;'],
        "lakes": [f'way["natural"="water"]["name"]({F});out geom;'],
        "forest": [f'(way["landuse"="forest"]({b});way["natural"="wood"]({b}););out geom;' for b in tiles(*FOCUS, 2, 2)]}
for k, bodies in JOBS.items():
    if k in out and out[k]: continue
    res = []
    for b in bodies:
        t = time.time(); r = q(b); res += r; print(k, len(r), f"{time.time() - t:.0f}s", flush=True)
    out[k] = res; json.dump(out, open(path, "w"))
print({k: len(v) for k, v in out.items() if isinstance(v, list)})
