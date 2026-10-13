"""Light OSM fetch for the Kunu-ri close-up (move 2b, Peng #10): the kunuri map (z12, centre 39.50N 125.93E).
Small Overpass queries (mail.ru mirror first, as collins/tools/make_cob_osm.py).
usage (from peng/): python3 tools/make_kunuri_osm.py  -> assets/src/kunuri_osm.json {places, rivers, roads, rail}
Data (c) OpenStreetMap contributors (ODbL)."""
import json, math, os, time, urllib.parse, urllib.request
URLS = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
z, W, H = 12, 2880, 1620
def wp(lat, lon):
    n = 256 * 2 ** z; return (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
cx, cy = wp(39.50, 125.93); ox, oy = round(cx - W / 2), round(cy - H / 2)
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
path = "assets/src/kunuri_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out.update({"bbox": FULL, "origin": [ox, oy], "zoom": z})
JOBS = {"places": [f'node["place"~"^(city|town|village)$"]({FULL});out;'],
        "rivers": [f'way["waterway"="river"]({b});out geom;' for b in tiles(2, 1)],
        "roads": [f'way["highway"~"^(trunk|primary|secondary|tertiary)$"]({b});out geom;' for b in tiles(2, 2)],
        "rail": [f'way["railway"="rail"]({FULL});out geom;'],
        "stations": [f'node["railway"="station"]({FULL});out;']}
for k, bodies in JOBS.items():
    if k in out and out[k]: continue
    res = []
    for b in bodies:
        t = time.time(); r = q(b); res += r; print(k, len(r), f"{time.time() - t:.0f}s", flush=True)
    out[k] = res; json.dump(out, open(path, "w"))
print({k: len(v) for k, v in out.items() if isinstance(v, list)})
