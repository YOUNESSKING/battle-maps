"""Inline the move-1 kit (scenes-src/move1_kit.js) and the map data into the MOVE 1 scene files (Meade #12), between the
// @@KIT ... // @@END-KIT and // @@DATA ... // @@END-DATA markers. Run after make_prospect_geo.py / make_nova1_control.py.
usage (from meade/): python3 tools/make_move1_inline.py"""
import json, re
kit = open("scenes-src/move1_kit.js").read().strip()
NF_A = json.load(open("assets/media/nova1_front_dec62a.json")); NF_B = json.load(open("assets/media/nova1_front_dec62b.json"))
PD = json.load(open("assets/media/prospect_data.json"))
nova = "// nova fronts (tools/make_nova1_control.py)\nconst NF_A = %s;\nconst NF_B = %s;" % (json.dumps(NF_A), json.dumps(NF_B))
pros = "// prospect map data (tools/make_prospect_geo.py)\nconst PD = %s;" % json.dumps(PD)
DATA = {"move1a": nova, "move1b": pros, "move1c": nova + "\n" + pros}
for name, data in DATA.items():
    p = f"scenes-src/{name}.js"
    try: s = open(p).read()
    except FileNotFoundError: continue
    s = re.sub(r"// @@KIT\n.*?// @@END-KIT", lambda m: "// @@KIT\n" + kit + "\n// @@END-KIT", s, flags=re.S)
    s = re.sub(r"// @@DATA\n.*?// @@END-DATA", lambda m: "// @@DATA\n" + data + "\n// @@END-DATA", s, flags=re.S)
    open(p, "w").write(s); print("inlined", p)
