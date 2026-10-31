"""Assemble a map-agent-B scene (Patton #15, move2c-move2g): kit + map data + body -> scenes-src/<scene>.js
usage (from patton/): python3 tools/m2b_inline.py SCENE MAP
  reads tools/m2b_kit.js, tools/m2b_body_<SCENE>.js; MAP = bastogne | ardennes | assenois (rivers traced from assets/src/<MAP>_dem_rivers.json,
  order 3 = rivers (main stroke + shimmer), order 2 = streams (faint), simplified, in map px)."""
import json, sys, os

sys.path.insert(0, os.path.dirname(__file__))
scene, base = sys.argv[1], sys.argv[2]


def simplify(pts, tol):
    if len(pts) < 3: return pts
    ax, ay = pts[0]; bx, by = pts[-1]; L = ((bx - ax) ** 2 + (by - ay) ** 2) ** 0.5 or 1
    d = [abs((bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax)) / L for p in pts[1:-1]]; i = max(range(len(d)), key=d.__getitem__) + 1
    if d[i - 1] > tol: return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]


riv, strm = [], []
src = f"assets/src/{base}_dem_rivers.json"
if os.path.exists(src):
    for r in json.load(open(src)):
        if r["order"] < 2: continue
        pts = [[round(x / 2, 1), round(y / 2, 1)] for x, y in r["pts"]]
        pts = simplify(pts, 1.0 if r["order"] == 3 else 1.6)
        if len(pts) < 2: continue
        (riv if r["order"] == 3 else strm).append(pts)
data = "const GD = " + json.dumps({"base": base, "rivers": riv, "streams": strm}, separators=(",", ":")) + ";"
kit = open("tools/m2b_kit.js").read()
body = open(f"tools/m2b_body_{scene}.js").read()
out = body.replace("// @@KIT", "// @@KIT\n" + kit + "// @@END-KIT").replace("// @@DATA", "// @@DATA (tools/m2b_inline.py)\n" + data + "\n// @@END-DATA")
open(f"scenes-src/{scene}.js", "w").write(out)
print(f"scenes-src/{scene}.js", len(out) // 1024, "KB", "rivers", len(riv), "streams", len(strm))
