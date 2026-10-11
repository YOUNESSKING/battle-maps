"""Replace `/*@name*/<json>;` markers in collins/scenes-src/<scene>.js with assets/media/<name>.json (keeps the marker)."""
import json, re, sys
ROOT = "/home/user/battle-maps/collins"
for scene in sys.argv[1:]:
    p = f"{ROOT}/scenes-src/{scene}.js"
    s = open(p).read()
    def rep(m):
        data = json.load(open(f"{ROOT}/assets/media/{m.group(1)}.json"))
        return f"/*@{m.group(1)}*/{json.dumps(data, separators=(',', ':'))};"
    s2 = re.sub(r"/\*@(\w+)\*/.*?;(?=\s*(//[^\n]*)?\n)", rep, s)
    open(p, "w").write(s2); print("injected", scene)
