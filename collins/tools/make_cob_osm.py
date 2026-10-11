"""Light OSM fetch for the Cobra move (move 2, Collins #9): the cobra map (z12) and the normandy map (z10).
Small Overpass queries on the mail.ru mirror (overpass-api.de / private.coffee / kumi reset or 500 on 2026-10-10).
usage: python3 tools/make_cob_osm.py cob|nor   -> assets/src/cob_osm.json / assets/src/nor_osm.json (fetch_osm.py format + roads).
Data (c) OpenStreetMap contributors (ODbL)."""
import json, math, os, sys, time, urllib.parse, urllib.request
URLS = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
key = sys.argv[1]
base = {"cob": "cobra", "nor": "normandy"}[key]
J = json.load(open(f"assets/{base}.json")); z = J["zoom"]; ox, oy = J["origin_world_px"]; W, H = J["size"]
def ll(px, py):
    n = 256 * 2 ** z; lon = (px + ox) / n * 360 - 180; lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (py + oy) / n)))); return lat, lon
S, Wl = ll(0, H); N, E = ll(W, 0)
FULL = f"{S:.4f},{Wl:.4f},{N:.4f},{E:.4f}"
def q(body):
    for k in range(8):
        url = URLS[k % len(URLS)]
        try:
            data = urllib.parse.urlencode({"data": "[out:json][timeout:170];" + body}).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"User-Agent": "battle-maps/1.0"}), timeout=190))["elements"]
        except Exception as ex:
            print("retry", k, url, ex, flush=True); time.sleep(4)
    raise SystemExit("overpass failed")
def tiles(nx, ny):
    for i in range(nx):
        for j in range(ny):
            yield f"{S + (N - S) * j / ny:.4f},{Wl + (E - Wl) * i / nx:.4f},{S + (N - S) * (j + 1) / ny:.4f},{Wl + (E - Wl) * (i + 1) / nx:.4f}"
path = f"assets/src/{key}_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out.update({"bbox": FULL})
if key == "nor":
    JOBS = {"places": [f'node["place"~"^(city|town)$"]({FULL});out;'],
            "rivers": [f'way["waterway"="river"]({b});out geom;' for b in tiles(3, 2)]}
else:
    JOBS = {"places": [f'node["place"~"^(city|town|village)$"]({FULL});out;'],
            "rivers": [f'way["waterway"="river"]({b});out geom;' for b in tiles(2, 1)],
            "roads": [f'way["highway"~"^(primary|secondary)$"]({b});out geom;' for b in tiles(2, 2)]}
for k, bodies in JOBS.items():
    if k in out and out[k]: continue
    res = []
    for b in bodies:
        t = time.time(); r = q(b); res += r; print(k, len(r), f"{time.time() - t:.0f}s", flush=True)
    out[k] = res; json.dump(out, open(path, "w"))
print(key, {k: len(v) for k, v in out.items() if isinstance(v, list)})
