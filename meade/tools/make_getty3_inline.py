"""Inline the MOVE 3 kit (assets/src/getty3_kit.js) + map data into scenes-src/move3a.js, move3b.js, move3c.js
(between // @@KIT .. // @@END-KIT and // @@DATA .. // @@END-DATA).
Data: the MOVE 2 agent's shared front JSON (assets/media/getty_fronts.json, read-only) when it exists, else null (the scenes then use
the kit's own 3 July lines, tools/make_getty3_control.py). usage (from meade/): python3 tools/make_getty3_inline.py"""
import json, os, re
kit = open("assets/src/getty3_kit.js").read().rstrip() + "\n"
gf = json.load(open("assets/media/getty_fronts.json")) if os.path.exists("assets/media/getty_fronts.json") else None
data = "// shared fronts (move-2 agent, assets/media/getty_fronts.json; null = not baked yet -> kit lines)\nconst GF = " + json.dumps(gf, separators=(",", ":")) + ";\n"
for s in ("move3a", "move3b", "move3c"):
    p = f"scenes-src/{s}.js"
    if not os.path.exists(p): continue
    src = open(p).read()
    src = re.sub(r"// @@KIT\n.*?// @@END-KIT\n", lambda m: "// @@KIT\n" + kit + "// @@END-KIT\n", src, flags=re.S)
    src = re.sub(r"// @@DATA\n.*?// @@END-DATA\n", lambda m: "// @@DATA\n" + data + "// @@END-DATA\n", src, flags=re.S)
    open(p, "w").write(src); print("inlined", p, "fronts:", "move-2 JSON" if gf else "kit fallback")
