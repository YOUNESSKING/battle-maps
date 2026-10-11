"""Inline the ardennes river paths into scenes-src/move3b.js (the scene can't fetch JSON at render time; same idea as
rokossovsky/tools/make_bobruisk_inline.py). Rewrites the two `window.ARD_* = ...;` lines.
usage (from collins/): python3 tools/make_ard_inline.py   (after tools/make_ard_geo.py)"""
import json, re
p = "scenes-src/move3b.js"; s = open(p).read()
riv = json.load(open("assets/media/ard_rivers.json")); meu = json.load(open("assets/media/ard_meuse.json"))
riv = [[[round(x), round(y)] for x, y in r[::2] + [r[-1]]] for r in riv if len(r) > 3]
meu = [[x, y] for seg in meu for x, y in seg]  # one path in order from Givet to Liege (segments sorted by y then x below)
segs = json.load(open("assets/media/ard_meuse.json")); segs.sort(key=lambda g: -max(q[1] for q in g))
line = []
for g in segs:
    if line and abs(g[-1][0] - line[-1][0]) + abs(g[-1][1] - line[-1][1]) < abs(g[0][0] - line[-1][0]) + abs(g[0][1] - line[-1][1]): g = g[::-1]
    line += [[round(x, 1), round(y, 1)] for x, y in g]
L1 = "window.ARD_RIVERS = " + json.dumps(riv, separators=(",", ":")) + ";  // RIVERS (tools/make_ard_inline.py)"
L2 = "window.ARD_MEUSE = " + json.dumps(line, separators=(",", ":")) + ";  // MEUSE (tools/make_ard_inline.py)"
s = re.sub(r"^window\.ARD_RIVERS = .*$\n?", "", s, flags=re.M); s = re.sub(r"^window\.ARD_MEUSE = .*$\n?", "", s, flags=re.M)
s = s.replace("// ---------- the Bulge fronts", L1 + "\n" + L2 + "\n// ---------- the Bulge fronts", 1)
open(p, "w").write(s); print("inlined", len(riv), "rivers,", len(line), "meuse pts,", len(L1) // 1024, "KB")
