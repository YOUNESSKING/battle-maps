"""Inline the korea river polylines (assets/media/korea_rivers.json, map px, from make_korea_geo.py) into the overview scenes for the
living-map shimmer: rewrites the line starting with `window.KOREA_RIVERS =` in scenes-src/{hook-b,bg,ending-a,ending-b}.js.
usage (from peng/): python3 tools/make_korea_inline.py"""
import json, os, re
R = json.load(open("assets/media/korea_rivers.json"))
R = [r for r in R if len(r) >= 4]
line = "window.KOREA_RIVERS = " + json.dumps(R, separators=(",", ":")) + ";  // tools/make_korea_inline.py"
for n in ("hook-b", "bg", "ending-a", "ending-b"):
    p = f"scenes-src/{n}.js"
    if not os.path.exists(p): continue
    s = open(p).read()
    if "window.KOREA_RIVERS =" in s:
        s = re.sub(r"^window\.KOREA_RIVERS = .*$", lambda m: line, s, flags=re.M)
    else:
        s = s.replace("const B = Battle();", line + "\nconst B = Battle();", 1)
    open(p, "w").write(s); print("inlined", n, len(R))
