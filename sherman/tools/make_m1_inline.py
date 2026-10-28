"""Inline the move-1 kit (scenes-src/move1_kit.js) and the map data (assets/media/<base>_lines.json + <base>_fronts.json, from
tools/make_m1_maps.py) into the MOVE 1 scene files (Sherman #13), between the // @@KIT ... // @@END-KIT and // @@DATA ... // @@END-DATA
markers. usage (from sherman/): python3 tools/make_m1_inline.py"""
import json, os, re
kit = open("scenes-src/move1_kit.js").read().strip()
def data(base):
    out = []
    for nm, f in (("LN", f"assets/media/{base}_lines.json"), ("FR", f"assets/media/{base}_fronts.json")):
        out.append(f"const {nm} = {json.dumps(json.load(open(f)), separators=(',', ':'))};" if os.path.exists(f) else f"const {nm} = {{}};")
    return f"// {base} map data (tools/make_m1_maps.py)\n" + "\n".join(out)
SC = {"move1a": "corridor", "move1b": "corridor", "move1c": "kennesaw", "move1d": "atlanta", "move1e": "atlanta"}
for name, base in SC.items():
    p = f"scenes-src/{name}.js"
    if not os.path.exists(p): continue
    s = open(p).read()
    s = re.sub(r"// @@KIT\n.*?// @@END-KIT", lambda m: "// @@KIT\n" + kit + "\n// @@END-KIT", s, flags=re.S)
    s = re.sub(r"// @@DATA\n.*?// @@END-DATA", lambda m: "// @@DATA\n" + data(base) + "\n// @@END-DATA", s, flags=re.S)
    open(p, "w").write(s); print("inlined", p)
