"""Inline the river shimmer paths (assets/media/bobruisk_rivers.json, big rivers only, decimated) into the bobruisk scenes:
replaces the line starting with `window.BOB_RIVERS =` in scenes-src/hook-a.js and scenes-src/move3.js.
usage: python3 tools/make_bobruisk_inline.py"""
import json, math
R = json.load(open("assets/media/bobruisk_rivers.json"))
out = []
for p in R:
    L = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(p, p[1:]))
    if L < 60: continue
    q = p[::2] + ([p[-1]] if (len(p) - 1) % 2 else [])
    out.append([[round(x), round(y)] for x, y in q])
line = "window.BOB_RIVERS = " + json.dumps(out, separators=(",", ":")) + "; // RIVERS (tools/make_bobruisk_inline.py)\n"
# local Berezina / Dnieper ways around Bobruisk (for the river highlight in move3), map px, decimated
O = json.load(open("assets/src/bobruisk_osm.json"))
def P(lat, lon, z=9, ox=74836, oy=41886):
    n = 256 * 2 ** z; r = math.radians(lat); return [round((lon + 180) / 360 * n - ox), round((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)]
loc = {"BEREZINA": [], "DNIEPER": []}
for el in O["rivers"]:
    t = el.get("tags", {}); nm = {"Березина": "BEREZINA", "Днепр": "DNIEPER"}.get(t.get("name:ru") or t.get("name", ""))
    if not nm or t.get("waterway") != "river": continue
    g = [g for g in el.get("geometry", []) if g and 52.45 < g["lat"] < 53.75 and 28.9 < g["lon"] < 30.6]
    if len(g) > 2: loc[nm].append([P(q["lat"], q["lon"]) for q in g[::3] + [g[-1]]])
line2 = "window.BOB_LOCAL = " + json.dumps(loc, separators=(",", ":")) + "; // LOCAL RIVERS (tools/make_bobruisk_inline.py)\n"
for f in ("scenes-src/hook-a.js", "scenes-src/move3.js"):
    try: src = open(f).read().splitlines(keepends=True)
    except FileNotFoundError: continue
    src = [line if s.startswith("window.BOB_RIVERS =") else line2 if s.startswith("window.BOB_LOCAL =") else s for s in src]
    open(f, "w").write("".join(src)); print(f, len(out), "paths")
