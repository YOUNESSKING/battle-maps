"""Inline the battlefield kit (scenes-src/battlefield_kit.js) and the map geography (assets/media/<map>_geo.json from
tools/make_guilford_geo.py / make_eutaw_geo.py) into the BATTLEFIELD agent's scenes (move2b, move2c, move3b, move3c).
Each scene file has a line `// @@MAP <map>` and the blocks `// @@KIT ... // @@END-KIT`, `// @@GEO ... // @@END-GEO`.
usage (from greene2/): python3 tools/make_battlefield_inline.py"""
import json, re
kit = open("scenes-src/battlefield_kit.js").read().rstrip() + "\n"
for name in ("move2b", "move2c", "move3b", "move3c"):
    f = f"scenes-src/{name}.js"
    try: s = open(f).read()
    except FileNotFoundError: continue
    m = re.search(r"// @@MAP (\w+)", s).group(1)
    geo = json.dumps(json.load(open(f"assets/media/{m}_geo.json")), separators=(",", ":"))
    s = re.sub(r"// @@KIT\n.*?// @@END-KIT", lambda _: "// @@KIT\n" + kit + "// @@END-KIT", s, flags=re.S)
    s = re.sub(r"// @@GEO\n.*?// @@END-GEO", lambda _: "// @@GEO\nconst GEO = " + geo + ";\n// @@END-GEO", s, flags=re.S)
    open(f, "w").write(s); print("inlined", name, m)
