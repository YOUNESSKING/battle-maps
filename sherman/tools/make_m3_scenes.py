"""Assemble the MOVE 3 scene sources (Sherman #13, MOVE 3 agent): scenes-src/move3X.js = header of assets/src/move3X_body.js + GD (rivers
in map px for that basemap, the named rivers from tools/make_m3_rivers.py) + assets/src/m3_kit.js + the body.
usage (from sherman/): python3 tools/make_m3_scenes.py [move3a ...]"""
import json, os, sys
BASE = {"move3a": "carolinas", "move3b": "bentonville", "move3c": "south"}
kit = open("assets/src/m3_kit.js").read()
for sc in (sys.argv[1:] or BASE):
    b = BASE[sc]; rf = f"assets/media/{b}_rivers.json"; gf = f"assets/media/{b}_geo_ref.png"; nf = f"assets/src/{b}_m3_rivers.json"
    named = {k: [[round(x), round(y)] for x, y in v[::2]] for k, v in json.load(open(nf))["named"].items()} if os.path.exists(nf) else {}
    gd = {"base": b, "rivers": json.load(open(rf)) if os.path.exists(rf) else [], "geo": gf if os.path.exists(gf) else None, "named": named}
    body = open(f"assets/src/{sc}_body.js").read()
    head = body[:body.index("\n// ==== BODY")] if "\n// ==== BODY" in body else ""
    open(f"scenes-src/{sc}.js", "w").write(head + "\nconst GD = " + json.dumps(gd, separators=(",", ":")) + ";\n" + kit + body[len(head):])
    print("wrote", sc)
