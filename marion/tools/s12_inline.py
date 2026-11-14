"""Script-12 test: kit (vk|vx) + data + tools/s12_body_<SCENE>.js -> scenes-src/<SCENE>.js, then tools/build_scene_s12.py.
usage (from grant/): python3 tools/s12_inline.py KIT SCENE BASEMAP FIRST_TAG LAST_TAG START END
The kit's `at` is replaced by a corrected one: B.at (proportional estimate) mapped through SCENE_TIMING.anchors (measured sentence starts)."""
import json, subprocess, sys, glob, math, re
kitn, scene, base, first, last, t0, t1 = sys.argv[1:8]
m0 = base.replace("_hd_lift", "").removesuffix("_w")
GD = {"base": m0, "maps": {}}
for f in glob.glob("assets/*_hd_lift.json"):
    J = json.load(open(f)); GD["maps"][J["name"].replace("_hd_lift", "")] = {k: J[k] for k in ("zoom", "origin_world_px", "meters_per_px")}
for m, la, lo, z in re.findall(r"^bake (\w+) ([-\d.]+) ([-\d.]+) (\d+)", open("tools/bake_all.sh").read(), re.M):
    if m in GD["maps"]: continue
    la, lo, z = float(la), float(lo), int(z); n = 256 * 2 ** z
    x = (lo + 180) / 360 * n; y = (1 - math.asinh(math.tan(math.radians(la))) / math.pi) / 2 * n
    GD["maps"][m] = {"zoom": z, "origin_world_px": [int(x - 1440), int(y - 810)], "meters_per_px": 156543.03 * math.cos(math.radians(la)) / 2 ** z, "est": True}
kit = open(f"tools/{kitn}_kit.js").read()
AT = ("const at = (k, ph, off = 0) => { const e = B.at(k, ph), A = B.T.anchors || [[0, 0]]; let i = 0; while (i < A.length - 2 && e > A[i + 1][0]) i++;"
      " const a = A[i], b = A[Math.min(i + 1, A.length - 1)]; const v = b[0] > a[0] ? a[1] + (b[1] - a[1]) * Math.min(1.6, (e - a[0]) / (b[0] - a[0])) : a[1] + (e - a[0]); return v + off; };"
      "   // s12: B.at corrected by the measured sentence starts")
assert "const { at } = B;" in kit
kit = kit.replace("const { at } = B;", AT)
body = open(f"tools/s12_body_{scene}.js").read()
out = body.replace("// @@KIT", f"// @@KIT (tools/{kitn}_kit.js)\n" + kit + "// @@END-KIT").replace("// @@DATA", "// @@DATA (tools/s12_inline.py)\nconst GD = " + json.dumps(GD, separators=(",", ":")) + ";\n// @@END-DATA")
open(f"scenes-src/{scene}.js", "w").write(out)
print(f"scenes-src/{scene}.js", len(out) // 1024, "KB")
r = subprocess.run(["python3", "tools/build_scene_s12.py", scene, base, first, last, t0, t1], capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip()[-800:])
