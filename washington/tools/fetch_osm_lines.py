#!/usr/bin/env python3
"""Fetch river / bayou centre lines from OpenStreetMap (Nominatim geometry, simplified) into ajackson/data/osm_lines.json
(committed: make_geo.py reads it offline). One request per second (Nominatim policy); raw answers cached in /tmp/ajx/osm/.
usage: python3 ajackson/tools/fetch_osm_lines.py            (re-fetches only missing entries; --force = all)
Each entry: name -> {"q": query, "thr": simplification (deg), "clip": [S, W, N, E] or null, "lines": [[[lat, lon], ...], ...]}"""
import json, os, sys, time, urllib.parse, urllib.request
OUT = "/home/user/battle-maps/washington/data/osm_lines.json"; CACHE = "/tmp/ajx/osm"
GULF = [28.6, -91.8, 33.8, -84.8]; CHAL = [29.85, -90.10, 30.02, -89.85]; HSB = [32.94, -85.79, 33.00, -85.70]; NOLA = [29.70, -90.35, 30.30, -89.40]
Q = {   # name: (query, threshold deg, clip box, pick: substring the display name must contain)
    "Mississippi River": ("Mississippi River", 0.004, GULF, "Mississippi River"),
    "Mississippi River (New Orleans)": ("Mississippi River", 0.0004, NOLA, "Mississippi River"),
    "Pearl River": ("Pearl River, Louisiana", 0.004, GULF, "Pearl River"),
    "Pascagoula River": ("Pascagoula River", 0.004, GULF, "Pascagoula"),
    "Leaf River": ("Leaf River Mississippi", 0.004, GULF, "Leaf River"),
    "Chickasawhay River": ("Chickasawhay River", 0.004, GULF, "Chickasawhay"),
    "Tombigbee River": ("Tombigbee River", 0.004, GULF, "Tombigbee"),
    "Black Warrior River": ("Black Warrior River", 0.004, GULF, "Black Warrior"),
    "Alabama River": ("Alabama River", 0.004, GULF, "Alabama River"),
    "Mobile River": ("Mobile River Alabama", 0.002, GULF, "Mobile River"),
    "Tensaw River": ("Tensaw River", 0.002, GULF, "Tensaw"),
    "Coosa River": ("Coosa River", 0.004, GULF, "Coosa"),
    "Tallapoosa River": ("Tallapoosa River", 0.003, GULF, "Tallapoosa"),
    "Tallapoosa River (Horseshoe Bend)": ("Tallapoosa River", 0.00004, HSB, "Tallapoosa"),
    "Cahaba River": ("Cahaba River", 0.004, GULF, "Cahaba"),
    "Conecuh River": ("Conecuh River", 0.004, GULF, "Conecuh"),
    "Escambia River": ("Escambia River, Santa Rosa County", 0.003, GULF, "Escambia"),
    "Chattahoochee River": ("Chattahoochee River", 0.004, GULF, "Chattahoochee"),
    "Choctawhatchee River": ("Choctawhatchee River", 0.004, GULF, "Choctawhatchee"),
    "Perdido River": ("Perdido River", 0.003, GULF, "Perdido"),
    "Yellow River": ("Yellow River Florida", 0.004, GULF, "Yellow River"),
    "Amite River": ("Amite River", 0.004, GULF, "Amite"),
    "Bayou Bienvenue": ("Bayou Bienvenue", 0.0001, NOLA, "Bienvenue"),
}


def get(name, q):
    f = f"{CACHE}/{name.replace(' ', '_').replace('(', '').replace(')', '')}.json"
    if os.path.exists(f): return json.load(open(f))
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(dict(q=q[0], format="json", polygon_geojson=1, polygon_threshold=q[1], limit=6))
    for a in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "battle-maps-geo/1.0"})
            J = json.load(urllib.request.urlopen(req, timeout=120)); break
        except Exception as e:
            print("  retry", name, e); time.sleep(5 * (a + 1))
    else: raise SystemExit("failed " + name)
    os.makedirs(CACHE, exist_ok=True); json.dump(J, open(f, "w")); time.sleep(1.2); return J


def lines_of(g):
    if g["type"] == "LineString": return [g["coordinates"]]
    if g["type"] == "MultiLineString": return g["coordinates"]
    if g["type"] in ("Polygon",): return [g["coordinates"][0]]
    if g["type"] == "MultiPolygon": return [p[0] for p in g["coordinates"]]
    return []


def clip(L, b):
    out, cur = [], []
    for lo, la in L:
        if b[0] <= la <= b[2] and b[1] <= lo <= b[3]: cur.append([round(la, 6), round(lo, 6)])
        elif cur: out.append(cur); cur = []
    if cur: out.append(cur)
    return [c for c in out if len(c) >= 2]


def main():
    D = json.load(open(OUT)) if os.path.exists(OUT) and "--force" not in sys.argv else {}
    for nm, q in Q.items():
        if nm in D and D[nm].get("lines"): continue
        J = get(nm, q); best = None
        for r in J:
            if q[3].lower() not in r["display_name"].lower() or r.get("class") not in ("waterway", "natural", "water"): continue
            L = [c for l in lines_of(r["geojson"]) for c in clip(l, q[2])]
            n = sum(len(c) for c in L)
            if L and (best is None or n > best[0]): best = (n, L, r["display_name"])
        if not best: print("  NOT FOUND", nm, [r["display_name"][:60] for r in J]); D[nm] = dict(q=q[0], thr=q[1], clip=q[2], lines=[]); continue
        D[nm] = dict(q=q[0], thr=q[1], clip=q[2], src=best[2][:120], lines=best[1]); print(f"  {nm}: {len(best[1])} parts, {best[0]} pts ({best[2][:60]})")
    json.dump(D, open(OUT, "w"), separators=(",", ":"))
    print("->", OUT, os.path.getsize(OUT) // 1024, "KB")


if __name__ == "__main__":
    main()
