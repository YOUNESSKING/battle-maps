"""Fetch the named rivers for the `valley` + `portrep` maps from OpenStreetMap via Nominatim (relation geometry; Overpass was down
2026-10-16). Data (c) OpenStreetMap contributors, ODbL.
usage (from jackson/): python3 tools/make_valley_osm.py  -> assets/src/valley_rivers_osm.json  {key: [[[lon,lat],...] per line]}"""
import json, os, time, urllib.parse, urllib.request
Q = {"nfork": "North Fork Shenandoah River", "sfork": "South Fork Shenandoah River", "shen": "Shenandoah River, West Virginia",
     "potomac": "Potomac River", "north": "North River, Rockingham County, Virginia", "south": "South River, Augusta County, Virginia",
     "bullpasture": "Bullpasture River", "cowpasture": "Cowpasture River"}
path = "assets/src/valley_rivers_osm.json"
out = json.load(open(path)) if os.path.exists(path) else {}
for k, q in Q.items():
    if k in out: continue
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode({"q": q, "format": "json", "polygon_geojson": 1, "limit": 8})
    for tr in range(8):
        try: d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "battle-maps/1.0 (map research)"}), timeout=120)); break
        except Exception as ex: print("retry", k, ex, flush=True); time.sleep(20 * (tr + 1))
    else: continue
    rel = [x for x in d if x["osm_type"] == "relation" and x["geojson"]["type"] in ("MultiLineString", "LineString")]
    src = rel[:1] if rel else [x for x in d if x["geojson"]["type"] == "LineString"]
    lines = []
    for x in src:
        g = x["geojson"]; lines += g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    out[k] = lines; print(k, q, "->", [x["display_name"][:50] for x in src[:1]], len(lines), flush=True)
    json.dump(out, open(path, "w")); time.sleep(6)
