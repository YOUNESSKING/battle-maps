"""Assemble the HOOK/SOUTH scene files: scenes-src/<scene>.js = assets/src/south_<scene>_body.js with its `// @@KIT` line replaced by
the shared kit (assets/src/south_kit.js) + the `south` river shimmer paths (assets/src/south_rivers_shimmer.json, map px, every 2nd
point, rounded) as `const SOUTH_RIVERS = [...]`. Edit the body/kit files, then rerun this before build_scene.py.
usage (from greene2/): python3 tools/make_south_inline.py [scene ...]   (default: hook-a hook-b move3a move3d ending)"""
import json, os, sys
R = json.load(open("assets/src/south_rivers_shimmer.json"))
R = [[[round(x), round(y)] for x, y in (p[::2] + [p[-1]])] for p in R if len(p) > 3]
kit = open("assets/src/south_kit.js").read().rstrip() + "\nconst SOUTH_RIVERS = " + json.dumps(R, separators=(",", ":")) + ";\n"
for name in (sys.argv[1:] or ["hook-a", "hook-b", "move3a", "move3d", "ending"]):
    f = f"assets/src/south_{name}_body.js"
    if not os.path.exists(f): continue
    s = open(f).read()
    assert "// @@KIT\n" in s, name
    open(f"scenes-src/{name}.js", "w").write(s.replace("// @@KIT\n", kit, 1)); print("wrote scenes-src/%s.js" % name)
