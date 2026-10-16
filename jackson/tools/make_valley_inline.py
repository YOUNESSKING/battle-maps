"""Inline the MOVE 1 kit + map data into the move 1 scenes (Jackson #11, MOVE 1 agent).
 - replaces the block between `// @kit-begin` and `// @kit-end` with scenes-src/move1_kit.js + scenes-src/cavalry_icon.js
 - replaces every `/*@name*/<json>;` marker with assets/media/<name>.json (keeps the marker, re-runnable)
usage (from jackson/): python3 tools/make_valley_inline.py"""
import json, re
kit = open("scenes-src/move1_kit.js").read() + open("scenes-src/cavalry_icon.js").read()
for n in "abcde":
    sp = f"scenes-src/move1{n}.js"
    try: s = open(sp).read()
    except FileNotFoundError: continue
    s = re.sub(r"// @kit-begin\n.*?// @kit-end\n", lambda m: "// @kit-begin\n" + kit + "// @kit-end\n", s, flags=re.S)
    def rep(m):
        data = json.load(open(f"assets/media/{m.group(1)}.json"))
        return f"/*@{m.group(1)}*/{json.dumps(data, separators=(',', ':'))};"
    s = re.sub(r"/\*@([a-z0-9_]+)\*/[^\n]*?;(?=\s*(//.*)?$)", rep, s, flags=re.M)
    open(sp, "w").write(s); print("inlined", sp)
