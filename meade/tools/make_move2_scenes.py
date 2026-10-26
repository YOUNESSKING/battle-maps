"""Assemble the MOVE 2 scene sources: scenes-src/move2X.js = GD data (map px for that basemap) + assets/src/move2_kit.js + assets/src/move2X_body.js
usage (from meade/): python3 tools/make_move2_scenes.py [move2a move2b ...]"""
import json, sys
BASE = {"move2a": "penn", "move2b": "getty", "move2c": "getty15", "move2d": "getty"}
P = json.load(open("assets/media/getty_places.json")); F = json.load(open("assets/media/getty_fronts.json"))
kit = open("assets/src/move2_kit.js").read()
for sc in (sys.argv[1:] or BASE):
    b = BASE[sc]
    if b == "penn":
        gd = {"places": {}, "names": {}, "rivers": json.load(open("assets/media/penn_rivers.json"))}
    else:
        gd = {"places": {k: v[b] for k, v in P.items() if v[b]}, "names": {k: v["name"] for k, v in P.items()},
              "fronts": {d: v[b] for d, v in F["fronts"].items()}, "lines": {k: v[b] for k, v in F["lines"].items()},
              "rivers": json.load(open(f"assets/media/{b}_rivers.json"))}
    body = open(f"assets/src/{sc}_body.js").read()
    head = body[:body.index("\n// ==== BODY")] if "\n// ==== BODY" in body else ""
    rest = body[len(head):]
    open(f"scenes-src/{sc}.js", "w").write(head + "\nconst GD = " + json.dumps(gd, separators=(",", ":")) + ";\n" + kit + rest)
    print("wrote", sc)
