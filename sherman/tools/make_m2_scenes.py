"""Assemble the MOVE 2 scene sources (Sherman #13, MOVE 2 agent): scenes-src/move2X.js = header of assets/src/move2X_body.js + GD (rivers
in map px for that basemap) + assets/src/m2_kit.js + the body.  usage (from sherman/): python3 tools/make_m2_scenes.py [move2a ...]"""
import json, os, sys
BASE = {"move2a": "corridor", "move2b": "south", "move2c": "georgia", "move2d": "savannah", "move2e": "south"}
kit = open("assets/src/m2_kit.js").read()
for sc in (sys.argv[1:] or BASE):
    b = BASE[sc]; rf = f"assets/media/{b}_rivers.json"
    gf = f"assets/media/{b}_geo_ref.png"
    gd = {"base": b, "rivers": json.load(open(rf)) if os.path.exists(rf) else [], "geo": gf if os.path.exists(gf) else None}
    body = open(f"assets/src/{sc}_body.js").read()
    head = body[:body.index("\n// ==== BODY")] if "\n// ==== BODY" in body else ""
    open(f"scenes-src/{sc}.js", "w").write(head + "\nconst GD = " + json.dumps(gd, separators=(",", ":")) + ";\n" + kit + body[len(head):])
    print("wrote", sc)
