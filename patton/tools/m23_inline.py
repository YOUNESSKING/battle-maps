"""Inline the m23 kit (assets/src/m23_kit.js) and the map data (assets/src/m23_data.json, tools/m23_prep.py) into the scene files
move2c / move3a / move3b (Cleburne #14), between the // @@KIT ... // @@END-KIT and // @@DATA ... // @@END-DATA markers.
usage (from cleburne/): python3 tools/m23_inline.py"""
import json, os, re
kit = open("assets/src/m23_kit.js").read().strip()
D = json.load(open("assets/src/m23_data.json"))
SC = {"move2c": "ringgold", "move3a": "corridor", "move3b": "pickett"}
for name, base in SC.items():
    p = f"scenes-src/{name}.js"
    if not os.path.exists(p): continue
    s = open(p).read()
    data = f"// {base} map data (tools/m23_prep.py)\nconst MD = {json.dumps(D[base], separators=(',', ':'))};"
    s = re.sub(r"// @@KIT\n.*?// @@END-KIT", lambda m: "// @@KIT\n" + kit + "\n// @@END-KIT", s, flags=re.S)
    s = re.sub(r"// @@DATA\n.*?// @@END-DATA", lambda m: "// @@DATA\n" + data + "\n// @@END-DATA", s, flags=re.S)
    open(p, "w").write(s); print("inlined", p)
