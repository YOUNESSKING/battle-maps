#!/usr/bin/env python3
"""Fetch river / creek centre lines from OpenStreetMap (Nominatim geometry, simplified) into washington/data/osm_lines.json
(committed: make_geo.py reads it offline). One request per second (Nominatim policy); raw answers cached in /tmp/wx_osm/.
usage: python3 washington/tools/fetch_osm_lines.py            (re-fetches only missing entries; --force = all)
Each entry: name -> {"q": query, "thr": simplification (deg), "clip": [S, W, N, E] or null, "lines": [[[lat, lon], ...], ...]}"""
import json, os, sys, time, urllib.parse, urllib.request
OUT = "/home/user/battle-maps/washington/data/osm_lines.json"; CACHE = "/tmp/wx_osm"
COL = [39.70, -75.60, 41.25, -73.40]      # colonies (wide, z9) + margin   [S, W, N, E]
JER = [40.08, -74.98, 40.42, -74.55]      # jersey (Trenton - Princeton - McConkey's Ferry) + margin
Q = {   # name: (query, threshold deg, clip box, pick: substring the display name must contain)
    "Hudson River": ("Hudson River", 0.002, COL, "Hudson River"),
    "Harlem River": ("Harlem River", 0.0005, COL, "Harlem River"),
    "Raritan River": ("Raritan River", 0.001, COL, "Raritan River"),
    "Passaic River": ("Passaic River", 0.001, COL, "Passaic River"),
    "Hackensack River": ("Hackensack River", 0.001, COL, "Hackensack River"),
    "Delaware River": ("Delaware River", 0.0015, COL, "Delaware River"),
    "Delaware River (fine)": ("Delaware River", 0.0002, JER, "Delaware River"),
    "Schuylkill River": ("Schuylkill River", 0.001, COL, "Schuylkill"),
    "Millstone River": ("Millstone River", 0.0008, COL, "Millstone River"),
    "Assunpink Creek": ("Assunpink Creek", 0.0002, JER, "Assunpink"),
    "Stony Brook": ("Stony Brook, Mercer County, New Jersey", 0.0002, JER, "Stony Brook"),
    "Shabakunk Creek": ("Shabakunk Creek", 0.0002, JER, "Shabakunk"),
    "Jacobs Creek": ("Jacobs Creek, Hopewell Township", 0.0002, JER, "Jacobs Creek"),
    "Crosswicks Creek": ("Crosswicks Creek", 0.0008, COL, "Crosswicks"),
    "Rahway River": ("Rahway River", 0.0008, COL, "Rahway River"),
    "Neshaminy Creek": ("Neshaminy Creek", 0.0008, COL, "Neshaminy"),
    "Bronx River": ("Bronx River", 0.0008, COL, "Bronx River"),
    "Saddle River": ("Saddle River", 0.0008, COL, "Saddle River"),
    "South Branch Raritan River": ("South Branch Raritan River", 0.001, COL, "South Branch"),
    "Pennypack Creek": ("Pennypack Creek", 0.0008, COL, "Pennypack"),
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
