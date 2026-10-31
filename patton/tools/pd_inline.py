"""Assemble a map-agent-D scene (Patton #15: move2a, move2b, move3a-move3d): kit + map data + body -> scenes-src/<scene>.js, then build.
usage (from patton/): python3 tools/pd_inline.py SCENE MAP FIRST_TAG LAST_TAG
  reads tools/pd_kit.js, tools/pd_body_<SCENE>.js; MAP = ardennes | lorraine | rhine | oppenheim (rivers from assets/src/<MAP>_dem_rivers.json:
  order 3 = rivers (stroke + shimmer), order 2 = streams (faint); fronts from assets/media/pd_<short>_front.json / pd_opp.json)."""
import json, sys, os, subprocess
scene, base, first, last = sys.argv[1:5]


def simplify(pts, tol):
    if len(pts) < 3: return pts
    ax, ay = pts[0]; bx, by = pts[-1]; L = ((bx - ax) ** 2 + (by - ay) ** 2) ** 0.5 or 1
    d = [abs((bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax)) / L for p in pts[1:-1]]; i = max(range(len(d)), key=d.__getitem__) + 1
    if d[i - 1] > tol: return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]


riv, strm = [], []
for r in json.load(open(f"assets/src/{base}_dem_rivers.json")):
    if r["order"] < 2: continue
    pts = simplify([[round(x / 2, 1), round(y / 2, 1)] for x, y in r["pts"]], 1.0 if r["order"] == 3 else 1.6)
    if len(pts) >= 2: (riv if r["order"] == 3 else strm).append(pts)
short = {"ardennes": "ard", "lorraine": "lor", "rhine": "rhi", "oppenheim": "opp"}[base]
fp = f"assets/media/pd_{short}_front.json" if short != "opp" else "assets/media/pd_opp.json"
fronts = json.load(open(fp)) if os.path.exists(fp) else {}
if base == "oppenheim": riv, strm = [], []   # flat Rhine plain: the DEM traces only ditches here; the Rhine is drawn by the scene
data = "const GD = " + json.dumps({"base": base, "rivers": riv, "streams": strm, "fronts": fronts}, separators=(",", ":")) + ";"
kit = open("tools/pd_kit.js").read()
body = open(f"tools/pd_body_{scene}.js").read()
out = body.replace("// @@KIT", "// @@KIT\n" + kit + "// @@END-KIT").replace("// @@DATA", "// @@DATA (tools/pd_inline.py)\n" + data + "\n// @@END-DATA")
open(f"scenes-src/{scene}.js", "w").write(out)
print(subprocess.run(["python3", "tools/build_scene.py", scene, base + "_hd_lift", first, last], capture_output=True, text=True).stdout.strip())
