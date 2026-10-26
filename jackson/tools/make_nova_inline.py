"""Inline the MOVE 2 map data into the scene sources (scenes can't fetch JSON at render time; as peng/tools/make_nwk2_inline.py).
Rewrites the single line `const NV = ...;` (move2a, move2c) and `const BR = ...;` (move2b).
usage (from jackson/): python3 tools/make_nova_inline.py   (after make_nova_geo.py, make_nova_control.py, make_bullrun_geo.py)"""
import json, os, re
def put(path, name, data):
    if not os.path.exists(path): print("skip", path); return
    s = open(path).read(); js = json.dumps(data, separators=(",", ":"))
    s, n = re.subn(rf"^const {name} = .*$", lambda m: f"const {name} = {js};", s, count=1, flags=re.M)
    open(path, "w").write(s); print(path, name, "inlined" if n else "MARKER NOT FOUND", len(js) // 1024, "KB")
def sub(pts, k): return [[round(x), round(y)] for x, y in (pts[::k] + [pts[-1]])]
D = json.load(open("assets/media/nova_data.json")); F = json.load(open("assets/media/nova_fronts.json"))
NV = {"pl": D["places"], "march": D["march"], "mi": D["march_mi"], "oarr": D["oarr"], "mgrr": D["mgrr"], "rfp": D["rfp"],
      "rivers": [sub(r, 2) for r in D["rivers"] if len(r) > 6], "f25": F["aug25"], "f02": F["sep02"]}
put("scenes-src/move2a.js", "NV", NV); put("scenes-src/move2c.js", "NV", NV)
B = json.load(open("assets/media/bullrun_data.json"))
put("scenes-src/move2b.js", "BR", {"pl": B["places"], "rivers": [sub(r, 2) for r in B["rivers"]], "pike": B["pike"], "sudley": B["sudley"],
    "mgrr": B["mgrr"], "unf": B["unfinished"]})
