"""Map agent A (Patton #15): inline the shared kit (tools/pa1_kit.js) + scene data into scenes-src/<scene>.js, then build.
usage: python3 tools/pa1_inline.py SCENE BASEMAP FIRST_TAG LAST_TAG
- replaces the block between '// @@KIT' and '// @@END-KIT' with tools/pa1_kit.js (PHOTO entries point to the real photo when the
  image agent delivered it: <name>_head.png, else <name>_head_flat.png, else null -> initials)
- replaces the line starting '// @@DATA' (and the 'const D = ' line after it) with const D = {fronts, places, rivers} (map px)"""
import json, os, re, subprocess, sys
scene, base, first, last = sys.argv[1:5]
src = f"scenes-src/{scene}.js"; s = open(src).read()
kit = open("tools/pa1_kit.js").read()
def photo(n):
    for f in (f"{n}_head.png", f"{n}_head_flat.png"):
        if os.path.exists(f"assets/media/{f}"): return f'"assets/media/{f}"'
    return "null"
kit = re.sub(r"const PHOTO = \{.*?\};", "const PHOTO = { " + ", ".join(f"{n}: {photo(n)}" for n in ("patton", "bradley", "collins", "middleton", "haislip", "kluge")) + " };", kit, flags=re.S)
a, b = s.index("// @@KIT"), s.index("// @@END-KIT")
s = s[:a] + "// @@KIT (tools/pa1_kit.js, inlined by tools/pa1_inline.py)\n" + kit.rstrip() + "\n" + s[b:]
pre = {"normandy_hd_lift": "nor", "avranches_hd_lift": "avr", "lemans_hd_lift": "lem"}[base]
D = {"places": json.load(open(f"assets/media/pa1_{pre}_places.json")), "fronts": {}}
for f in sorted(os.listdir("assets/media")):
    m = re.match(rf"pa1_{pre}_front_?(\w*)\.json$", f)
    if m: D["fronts"][m.group(1) or "main"] = json.load(open("assets/media/" + f))[0]
if os.path.exists(f"assets/media/pa1_{pre}_riv.json"): D["rivers"] = json.load(open(f"assets/media/pa1_{pre}_riv.json"))
s = re.sub(r"// @@DATA.*?\nconst D = .*?\n", "// @@DATA (map px, tools/pa1_make_control.py)\nconst D = " + json.dumps(D, separators=(",", ":")) + ";\n", s, flags=re.S)
open(src, "w").write(s)
print(subprocess.run(["python3", "tools/build_scene.py", scene, base, first, last], capture_output=True, text=True).stdout.strip())
