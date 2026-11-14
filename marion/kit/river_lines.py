"""River centre-lines for the carved river names (RIVER(...) in the kit): chains the fetched segments of each story river into one ordered
polyline (longest chain), resampled to ~60 points -> kit/data/river_lines.json (read by places.py RIVER_LINES).
usage (from marion/): python3 kit/river_lines.py   (after kit/fetch_rivers.py for the maps below)"""
import json, math
SRC = {   # key: (rivers_<map>.json, name, keep box lat0, lat1, lon0, lon1)
    "santee": ("lowcountry", "Santee 1780", 33.0, 33.9, -80.75, -79.30), "congaree": ("congaree", "Congaree 1780", 33.6, 34.1, -81.2, -80.55),
    "wateree": ("congaree", "Wateree 1780", 33.7, 34.3, -81.0, -80.5), "pee_dee": ("lowcountry", "Great Pee Dee River", 33.3, 34.6, -80.2, -79.0),
    "black_river": ("blackriver", "Black River", 33.40, 34.0, -80.40, -79.50), "lynches_creek": ("lowcountry", "Lynches River", 33.8, 34.6, -80.6, -79.3),
    "black_mingo": ("blackmingo", "Black Mingo Creek", 33.5, 33.8, -79.8, -79.3), "edisto": ("edisto", "Edisto River", 32.6, 33.1, -80.7, -80.2),
    "wateree_low": ("lowcountry", "Wateree 1780", 33.7, 34.7, -81.0, -80.5), "cooper": ("lowcountry", "Cooper River", 32.75, 33.25, -80.05, -79.85),
    "ashley": ("lowcountry", "Ashley River", 32.75, 33.1, -80.3, -79.9), "pocotaligo": ("blackriver", "Pocotaligo River", 33.6, 33.95, -80.4, -79.9),
}
D = lambda a, b: math.hypot(a[0] - b[0], (a[1] - b[1]) * 0.83)
out = {}
for key, (m, nm, la0, la1, lo0, lo1) in SRC.items():
    segs = [[tuple(p) for p in s if la0 <= p[0] <= la1 and lo0 <= p[1] <= lo1] for s in json.load(open(f"kit/data/rivers_{m}.json")).get(nm, [])]
    segs = [s for s in segs if len(s) > 1]
    if not segs: print("none", key); continue
    L = lambda s: sum(D(s[i], s[i + 1]) for i in range(len(s) - 1))
    segs.sort(key=L, reverse=True); chain = list(segs.pop(0))
    while segs:
        best = None
        for i, s in enumerate(segs):
            for rev in (False, True):
                q = s[::-1] if rev else s
                for end in ("head", "tail"):
                    d = D(chain[-1], q[0]) if end == "tail" else D(chain[0], q[-1])
                    if best is None or d < best[0]: best = (d, i, q, end)
        if best[0] > 0.02: break
        _, i, q, end = best; segs.pop(i); chain = chain + list(q) if end == "tail" else list(q) + chain
    tot = L(chain); step = tot / 60; res = [chain[0]]; acc = 0
    for a, b in zip(chain, chain[1:]):
        acc += D(a, b)
        if acc >= step: res.append(b); acc = 0
    res.append(chain[-1]); out[key] = [[round(a, 5), round(b, 5)] for a, b in res]; print(key, len(chain), "->", len(res), "len %.2f deg" % tot)
json.dump(out, open("kit/data/river_lines.json", "w"))
