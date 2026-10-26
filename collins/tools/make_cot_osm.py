"""Light OSM fetch for the Cotentin maps of MOVE 1 (normandy z10 'cot_' + cherbourg z12 'cbg_'): rivers + canals and towns.
-> assets/src/cot_osm.json (same format as fetch_osm.py). Data (c) OpenStreetMap contributors (ODbL)."""
import json, os, time, urllib.parse, urllib.request
URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
FULL = "48.95,-2.10,49.78,-0.70"
path = "assets/src/cot_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
out.update({"bbox": FULL})
def q(body):
    for k in range(6):
        url = URLS[k % len(URLS)]
        try:
            data = urllib.parse.urlencode({"data": "[out:json][timeout:170];" + body}).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"User-Agent": "battle-maps/1.0"}), timeout=190))["elements"]
        except Exception as ex:
            print("retry", k, url, ex, flush=True); time.sleep(4)
    raise SystemExit("overpass failed")
JOBS = {"places": f'node["place"~"^(city|town|village)$"]({FULL});out;',
        "rivers": f'way["waterway"="river"]({FULL});out geom;'}
for k, b in JOBS.items():
    if k in out and out[k]: continue
    t = time.time(); out[k] = q(b); json.dump(out, open(path, "w")); print(k, len(out[k]), f"{time.time() - t:.0f}s", flush=True)
print({k: len(v) for k, v in out.items() if isinstance(v, list)})
