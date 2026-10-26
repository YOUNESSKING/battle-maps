"""Geography layer + scene data for the Kunu-ri close-up (move 2b, Peng #10), make_geo_layer.py "ref" look: thin blue rivers, faint
roads, big towns only with small labels (story places are white boxes in the scene). Data (c) OpenStreetMap contributors (ODbL),
from assets/src/kunuri_osm.json (tools/make_kunuri_osm.py); elevation assets/src/kunuri_hd_elev.npy (bake_hd).
usage (from peng/): python3 tools/make_kunuri_geo.py
 -> assets/media/kunuri_geo_ref.png (5760x3240, shown at 2880x1620)
 -> assets/media/kunuri_data.json {road (Kunu-ri -> Sunchon, map px, north -> south), west (Kunu-ri -> Anju -> Sinanju -> Sukchon: the
    23rd Infantry's way out), rivers (shimmer paths), places {...}, pass [x, y] (highest point of the road 8-12 mi below Kunu-ri)}
The 1950 Kunu-ri = modern Kaechon (Mossman: Pugwon 5 mi above Kunu-ri, Wawon ~10 mi east; the road Kunu-ri - Sunchon ~20 mi)."""
import json, math
import numpy as np, networkx as nx
from PIL import Image, ImageDraw, ImageFilter, ImageFont
O = json.load(open("assets/src/kunuri_osm.json")); ox, oy = O["origin"]; Z = 12; S = 2; W, H = 2880 * S, 1620 * S
def P(lat, lon, s=1):
    n = 256 * 2 ** Z; return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy) * s)
PL = dict(kunuri=(39.700, 125.900), sunchon=(39.4226, 125.9373), anju=(39.6173, 125.6611), sinanju=(39.5962, 125.6063), sukchon=(39.413, 125.648),
          pugwon=(39.784, 125.943), wawon=(39.721, 126.069), pukchang=(39.572, 126.301), kaechon_r=(39.700, 125.900))
# ---- road graph (primary / secondary / tertiary), shortest paths ----
G = nx.Graph(); W8 = {"trunk": 1.0, "primary": 1.0, "secondary": 1.25, "tertiary": 1.6}
for w in O["roads"]:
    h = w["tags"].get("highway")
    if h not in W8: continue
    g = [(round(q["lon"], 6), round(q["lat"], 6)) for q in w.get("geometry", []) if q]
    for a, b in zip(g[:-1], g[1:]):
        pa, pb = P(a[1], a[0]), P(b[1], b[0]); G.add_edge(a, b, weight=math.dist(pa, pb) * W8[h])
nodes = list(G.nodes)
def near(lat, lon):
    x, y = P(lat, lon); return min(nodes, key=lambda n: math.dist(P(n[1], n[0]), (x, y)))
def path(*pts):
    out = []
    for a, b in zip(pts[:-1], pts[1:]):
        seg = nx.shortest_path(G, near(*a), near(*b), weight="weight"); out += seg if not out else seg[1:]
    return [[round(v, 1) for v in P(n[1], n[0])] for n in out]
def thin(line, d=8):
    o = [line[0]]
    for p in line[1:]:
        if math.dist(p, o[-1]) >= d: o.append(p)
    if o[-1] != line[-1]: o.append(line[-1])
    return o
road = thin(path(PL["kunuri"], PL["sunchon"]))
west = thin(path(PL["kunuri"], PL["anju"], PL["sinanju"], PL["sukchon"]))
# the pass: highest road point 8-12 miles (430-650 px at ~29.5 m/px) along the road from Kunu-ri
e = np.load("assets/src/kunuri_hd_elev.npy")
cum = np.r_[0, np.cumsum([math.dist(a, b) for a, b in zip(road[:-1], road[1:])])]
best = max((i for i in range(len(road)) if 430 <= cum[i] <= 650), key=lambda i: e[min(int(road[i][1] * 2), e.shape[0] - 1), min(int(road[i][0] * 2), e.shape[1] - 1)])
# ---- drawing ----
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
shimmer = []
for w in O["rivers"]:
    g = [P(q["lat"], q["lon"], S) for q in w.get("geometry", []) if q]
    if len(g) < 2: continue
    big = w["tags"].get("name") in ("청천강", "대동강", "대령강")
    d.line(g, fill=(96, 150, 190, 235) if big else (86, 136, 172, 120), width=7 if big else 3, joint="curve")
    if big and len(g) > 6: shimmer.append([[round(x / S), round(y / S)] for x, y in g[::3] + [g[-1]]])
for w in O["roads"]:
    if w["tags"].get("highway") not in ("primary", "secondary", "trunk"): continue
    g = [P(q["lat"], q["lon"], S) for q in w.get("geometry", []) if q]
    if len(g) > 1: d.line(g, fill=(214, 202, 176, 70), width=3, joint="curve")
for w in O["rail"]:
    g = [P(q["lat"], q["lon"], S) for q in w.get("geometry", []) if q]
    if len(g) > 1: d.line(g, fill=(20, 18, 14, 110), width=4); d.line(g, fill=(200, 196, 186, 90), width=2)
TOWNS = [("Mundok", 39.575, 125.33, 9000), ("Pyongwon", 39.24, 125.86, 9000)]   # big towns only; story places boxed
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
for nm, la, lo, _ in TOWNS:
    x, y = P(la, lo, S)
    if not (40 < x < W - 300 and 40 < y < H - 40): continue
    td.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(240, 236, 226, 235)); hd.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(10, 14, 16, 170))
    hd.text((x + 14, y), nm.upper(), font=ft, fill=(10, 14, 16, 220), anchor="lm"); td.text((x + 14, y), nm.upper(), font=ft, fill=(240, 236, 226, 240), anchor="lm")
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/kunuri_geo_ref.png", optimize=True)
data = {"road": road, "west": west, "rivers": shimmer, "pass": road[best], "pass_i": best, "road_len_px": round(float(cum[-1])),
        "places": {k: [round(v, 1) for v in P(*q)] for k, q in PL.items()}}
json.dump(data, open("assets/media/kunuri_data.json", "w"), separators=(",", ":"))
print("road pts", len(road), "len px", round(cum[-1]), "(~%.1f mi)" % (cum[-1] * 29.5 / 1609), "pass", road[best], "at %.1f mi" % (cum[best] * 29.5 / 1609),
      "west pts", len(west), "shimmer", len(shimmer))
