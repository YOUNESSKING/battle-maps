"""Inline map data into the move 1 scenes: replaces every `/*@name*/<json>;` marker in scenes-src/move1a.js, move1b.js, move1c.js
with the content of assets/media/<name>.json (keeps the marker, so it can be re-run after the data changes).
usage (from peng/): python3 tools/make_nwkorea_inline.py"""
import json, re
for sp in ("scenes-src/move1a.js", "scenes-src/move1b.js", "scenes-src/move1c.js"):
    try: s = open(sp).read()
    except FileNotFoundError: continue
    def rep(m):
        data = json.load(open(f"assets/media/{m.group(1)}.json"))
        return f"/*@{m.group(1)}*/{json.dumps(data, separators=(',', ':'))};"
    s2 = re.sub(r"/\*@([a-z0-9_]+)\*/[^\n]*?;(?=\s*(//.*)?$)", rep, s, flags=re.M)
    open(sp, "w").write(s2); print("inlined", sp)
