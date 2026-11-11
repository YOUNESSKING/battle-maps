"""Fetch the named 1781 rivers (USGS NHD small-scale flowlines, layer 4) as lat/lon polylines -> kit/data/rivers_<map>.json.
usage: python3 kit/fetch_rivers.py east   (from yorktown/). Only the rivers the story needs (few, clean)."""
import json, sys, urllib.parse, urllib.request
NAMES = {"east": ["Hudson River", "Delaware River", "Susquehanna River", "Potomac River", "Schuylkill River", "Elk River", "Raritan River", "Passaic River", "Rappahannock River", "James River", "York River", "Pamunkey River"],
         "chesapeake": ["James River", "York River", "Pamunkey River", "Mattaponi River", "Rappahannock River", "Chickahominy River"]}
m = sys.argv[1]; J = json.load(open(f"assets/{m}.json"))
import math
z = J["zoom"]; ox, oy = J["origin_world_px"]; n = 256 * 2 ** z
p2l = lambda x, y: (math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (oy + y) / n)))), (ox + x) / n * 360 - 180)
la1, lo0 = p2l(0, 0); la0, lo1 = p2l(2880, 1620)
out = {}
for nm in NAMES[m]:
    q = {"where": f"gnis_name='{nm}'", "geometry": f"{lo0},{la0},{lo1},{la1}", "geometryType": "esriGeometryEnvelope", "inSR": 4326, "outSR": 4326,
         "spatialRel": "esriSpatialRelIntersects", "outFields": "gnis_name,lengthkm", "returnGeometry": "true", "maxAllowableOffset": J["meters_per_px"] / 111000 / 2, "f": "geojson"}
    u = "https://hydro.nationalmap.gov/arcgis/rest/services/nhd/MapServer/4/query?" + urllib.parse.urlencode(q)
    d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "map-kit"}), timeout=120))
    segs = []
    for f in d.get("features", []):
        g = f["geometry"]; ls = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        segs += [[[round(la, 5), round(lo, 5)] for lo, la in l] for l in ls]
    out[nm] = segs; print(nm, len(segs), sum(len(s) for s in segs))
json.dump(out, open(f"kit/data/rivers_{m}.json", "w"))
