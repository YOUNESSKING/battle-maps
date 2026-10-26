"""Inline the virginia river polylines (assets/media/virginia_rivers.json) and front lines (assets/media/virginia_front_<date>.json)
into the hook / background / ending scenes: rewrites the lines starting with `window.VA_RIVERS =` / `window.VA_FRONT =`.
usage (from jackson/): python3 tools/make_virginia_inline.py"""
import glob, json, os, re
R = [r for r in json.load(open("assets/media/virginia_rivers.json")) if len(r) >= 4]
F = {os.path.basename(p)[15:-5]: json.load(open(p)) for p in sorted(glob.glob("assets/media/virginia_front_*.json"))}
lines = {"VA_RIVERS": "window.VA_RIVERS = " + json.dumps(R, separators=(",", ":")) + ";  // tools/make_virginia_inline.py",
         "VA_FRONT": "window.VA_FRONT = " + json.dumps(F, separators=(",", ":")) + ";  // tools/make_virginia_inline.py"}
for n in ("hook-a", "hook-b", "bg-a", "bg-b", "ending"):
    p = f"scenes-src/{n}.js"
    if not os.path.exists(p): continue
    s = open(p).read()
    for k, line in lines.items():
        if f"window.{k} =" in s: s = re.sub(rf"^window\.{k} = .*$", lambda m: line, s, flags=re.M)
        else: s = s.replace("const B = Battle();", line + "\nconst B = Battle();", 1)
    open(p, "w").write(s); print("inlined", n, len(R), list(F))
