"""Light OSM fetch for the MOVE 2 maps (Stonewall Jackson #11): `nova` (z10, 38.60N 77.70W) and `bullrun` (z13, 38.815N 77.56W).
Small Overpass queries (mail.ru mirror first, as peng/tools/make_kunuri_osm.py). Data (c) OpenStreetMap contributors (ODbL).
usage (from jackson/): python3 tools/make_nova_osm.py [nova|bullrun]
 -> assets/src/nova_osm.json    {rivers (named big rivers), rail}
 -> assets/src/bullrun_osm.json {rivers, streams, roads, rail}"""
import json, math, os, sys, time, urllib.parse, urllib.request
URLS = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter", "https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"]
MAPS = {"nova": (38.60, -77.70, 10), "bullrun": (38.815, -77.56, 13)}
W, H = 2880, 1620
def q(body):
    for k in range(9):
        url = URLS[k % len(URLS)]
        try:
            data = urllib.parse.urlencode({"data": "[out:json][timeout:170];" + body}).encode()
            return json.load(urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"User-Agent": "battle-maps/1.0 (history video maps)"}), timeout=190))["elements"]
        except Exception as ex:
            print("retry", k, url, ex, flush=True); time.sleep(4)
    raise SystemExit("overpass failed")
for name in (sys.argv[1:] or list(MAPS)):
    lat, lon, z = MAPS[name]
    n = 256 * 2 ** z
    wp = lambda la, lo: ((lo + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(la))) / math.pi) / 2 * n)
    cx, cy = wp(lat, lon); ox, oy = int(cx - W / 2), int(cy - H / 2)
    def ll(px, py): return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (py + oy) / n)))), (px + ox) / n * 360 - 180
    S, Wl = ll(0, H); N, E = ll(W, 0)
    BB = f"{S:.4f},{Wl:.4f},{N:.4f},{E:.4f}"
    path = f"assets/src/{name}_osm.json"
    out = json.load(open(path)) if os.path.exists(path) else {}
    out.update({"bbox": BB, "origin": [ox, oy], "zoom": z})
    if name == "nova":
        RIV = "Rappahannock River|Rapidan River|Potomac River|Bull Run|Occoquan River|Shenandoah River|North Fork Shenandoah River|South Fork Shenandoah River|Hazel River|Broad Run|Cedar Run|Goose Creek"
        JOBS = {"rivers": [f'way["waterway"="river"]["name"~"^({RIV})$"]({BB});out geom;', f'way["waterway"="stream"]["name"~"^(Bull Run|Broad Run)$"]({BB});out geom;'],
                "rail": [f'way["railway"="rail"]["usage"="main"]({BB});out geom;']}
    else:
        JOBS = {"rivers": [f'way["waterway"~"^(river|stream)$"]({BB});out geom;'],
                "roads": [f'way["highway"~"^(trunk|primary|secondary|tertiary)$"]({BB});out geom;'],
                "rail": [f'way["railway"="rail"]({BB});out geom;']}
    for k, bodies in JOBS.items():
        if k in out and out[k]: continue
        res = []
        for b in bodies:
            t = time.time(); r = q(b); res += r; print(name, k, len(r), f"{time.time() - t:.0f}s", flush=True)
        out[k] = res; os.makedirs("assets/src", exist_ok=True); json.dump(out, open(path, "w"))
    print(name, {k: len(v) for k, v in out.items() if isinstance(v, list)})
