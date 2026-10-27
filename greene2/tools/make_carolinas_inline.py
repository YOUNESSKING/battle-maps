"""Inline the carolinas kit (scenes-src/carolinas_kit.js) and the river data (assets/media/carolinas_rivers.json, from
make_carolinas_geo.py) into the scenes on the `carolinas` map (Greene #2 remake, MOVE 1 agent), between the
// @@KIT ... // @@END-KIT and // @@DATA ... // @@END-DATA markers. Run after make_carolinas_geo.py.
usage (from greene2/): python3 tools/make_carolinas_inline.py"""
import json, re
kit = open("scenes-src/carolinas_kit.js").read().strip()
R = json.load(open("assets/media/carolinas_rivers.json"))
data = "// rivers traced from the elevation (tools/make_carolinas_rivers.py + make_carolinas_geo.py), map px\nconst RIV = %s;" % json.dumps(R, separators=(",", ":"))
for name in ("move1a", "move1b", "move1c", "move2a", "move2d"):
    p = f"scenes-src/{name}.js"
    try: s = open(p).read()
    except FileNotFoundError: continue
    s = re.sub(r"// @@DATA\n.*?// @@END-DATA", lambda m: "// @@DATA\n" + data + "\n// @@END-DATA", s, flags=re.S)
    s = re.sub(r"// @@KIT\n.*?// @@END-KIT", lambda m: "// @@KIT\n" + kit + "\n// @@END-KIT", s, flags=re.S)
    open(p, "w").write(s); print("inlined", p)
