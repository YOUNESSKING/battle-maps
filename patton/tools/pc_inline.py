"""Map agent C (Patton #15): kit + river data + body -> scenes-src/<scene>.js, then build the scene.
usage (from patton/): python3 tools/pc_inline.py SCENE BASEMAP FIRST_TAG LAST_TAG
  reads tools/pc_kit.js (frozen copy of map agent B's m2b_kit.js) and tools/pc_body_<SCENE>.js; GD.rivers / GD.streams = rivers of the
  scene basemap; GD.R[<map>] = order-3 rivers of the other maps (map px) for the extra map layers (hook zooms / snap cuts)."""
import json, os, subprocess, sys
scene, base, first, last = sys.argv[1:5]

def simplify(pts, tol):
    if len(pts) < 3: return pts
    ax, ay = pts[0]; bx, by = pts[-1]; L = ((bx - ax) ** 2 + (by - ay) ** 2) ** 0.5 or 1
    d = [abs((bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax)) / L for p in pts[1:-1]]; i = max(range(len(d)), key=d.__getitem__) + 1
    if d[i - 1] > tol: return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]

def rivers(m, streams=True):
    riv, strm = [], []
    for r in json.load(open(f"assets/src/{m}_dem_rivers.json")):
        if r["order"] < (2 if streams else 3): continue
        pts = simplify([[round(x / 2, 1), round(y / 2, 1)] for x, y in r["pts"]], 1.0 if r["order"] == 3 else 1.6)
        if len(pts) >= 2: (riv if r["order"] == 3 else strm).append(pts)
    return riv, strm

m0 = base.replace("_hd_lift", "")
riv, strm = rivers(m0)
GD = {"base": m0, "rivers": riv, "streams": strm, "R": {}}
for m in ("ardennes", "bastogne", "avranches", "oppenheim", "europe"):
    if m != m0: GD["R"][m] = rivers(m, False)[0]
GD["F"] = {n: json.load(open(f"assets/media/{n}.json")) for n in ("m2b_bas_front_dec19", "m2b_bas_front_dec26", "m2b_ard_front", "pa1_avr_front")}
kit = open("tools/pc_kit.js").read()
body = open(f"tools/pc_body_{scene}.js").read()
out = body.replace("// @@KIT", "// @@KIT (tools/pc_kit.js)\n" + kit + "// @@END-KIT").replace("// @@DATA", "// @@DATA (tools/pc_inline.py)\nconst GD = " + json.dumps(GD, separators=(",", ":")) + ";\n// @@END-DATA")
open(f"scenes-src/{scene}.js", "w").write(out)
print(f"scenes-src/{scene}.js", len(out) // 1024, "KB")
print(subprocess.run(["python3", "tools/build_scene.py", scene, base, first, last], capture_output=True, text=True).stdout.strip())
