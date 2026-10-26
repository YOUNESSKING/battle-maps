"""Inline the move-2 map data into the scene sources (the scenes can't fetch JSON at render time; same idea as
collins/tools/make_ard_inline.py). Rewrites one `const NW = ...;` / `const KR = ...;` / `const KU = ...;` line in each scene.
usage (from peng/): python3 tools/make_nwk2_inline.py   (after make_nwk2_control.py / make_kunuri_geo.py)
  move2a <- assets/media/nwk2_fronts.json (24/26/28 Nov fronts, resampled to the same point count so K.front can morph) +
            assets/media/nwkorea_rivers.json (move 1 agent, read-only: river shimmer)
  move2b <- assets/media/kunuri_data.json (road, rivers, places; tools/make_kunuri_geo.py)
  move2c <- assets/media/korea_front_nov24.json / korea_front_dec15.json / korea_38th.json / korea_rivers.json (hook agent, read-only)"""
import json, os, re
import numpy as np
def rs(pts, n):
    p = np.array(pts, float); s = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]; u = np.linspace(0, s[-1], n)
    return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in u]
def sub(pts, k): return [[round(x), round(y)] for x, y in (pts[::k] + [pts[-1]])]
def put(path, name, data):
    if not os.path.exists(path): print("skip", path); return
    s = open(path).read(); js = json.dumps(data, separators=(",", ":"))
    s, n = re.subn(rf"^const {name} = .*$", lambda m: f"const {name} = {js};", s, count=1, flags=re.M)
    open(path, "w").write(s); print(path, name, "inlined" if n else "MARKER NOT FOUND", len(js) // 1024, "KB")
F = json.load(open("assets/media/nwk2_fronts.json")); RV = json.load(open("assets/media/nwkorea_rivers.json"))
put("scenes-src/move2a.js", "NW", {"f24": rs(F["nov24"], 140), "f26": rs(F["nov26"], 140), "f28": rs(F["nov28"], 140),
    "rivers": [sub(RV[k], 2) for k in ("chongchon", "kuryong", "taedong", "taeryong") if k in RV]})
if os.path.exists("assets/media/kunuri_data.json"): put("scenes-src/move2b.js", "KU", json.load(open("assets/media/kunuri_data.json")))
KF = lambda d: json.load(open(f"assets/media/korea_front_{d}.json"))
KRV = json.load(open("assets/media/korea_rivers.json"))
KRV = KRV if isinstance(KRV, list) else list(KRV.values())
put("scenes-src/move2c.js", "KR", {"f24": rs(KF("nov24"), 90), "f15": rs(KF("dec15"), 90), "p38": json.load(open("assets/media/korea_38th.json")),
    "rivers": [sub(r, 3) for r in KRV if len(r) > 6]})
