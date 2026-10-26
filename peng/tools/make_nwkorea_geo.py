"""Geography layer for the `nwkorea` basemap (z9; Peng #10, move 1 owner, reused read-only by move 2): make_geo_layer "ref" look,
thin blue rivers, BIG towns only, small 1950 labels that never collide.
Rivers = the real OpenStreetMap geometry of the five named rivers (Yalu, Chongchon, Kuryong, Taedong, Taeryong), fetched once via
Nominatim (Overpass timed out 2026-10-12) into assets/src/nwkorea_rivers_osm.json. Data (c) OpenStreetMap contributors, ODbL.
usage (from peng/): python3 tools/make_nwkorea_geo.py
 -> assets/media/nwkorea_geo_ref.png (5760x3240, show at 2880x1620, ABOVE the territory layer)
 -> assets/media/nwkorea_rivers.json  {"yalu": [[x,y],...], "chongchon": ..., ...} map px (2880x1620), downstream order, for
    LivingK.shimmer(Object.values(R)) or for labels/arrows along a river.
Story places (Unsan, Onjong, Chosan, Kojang, Ipsok, Anju, Kunu-ri, Sunchon, Tokchon, Kujang-dong, Manpojin) are NOT drawn here:
the scenes put them in small white boxes."""
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "nwkorea"
J = json.load(open(f"assets/{BASE}.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)

KEYS = {"압록강": "yalu", "청천강": "chongchon", "구룡강": "kuryong", "대동강": "taedong", "대령강": "taeryong"}
# downstream end of each river (mouth / confluence), used to orient + order the merged OSM ways
MOUTH = {"yalu": (39.85, 124.30), "chongchon": (39.58, 125.46), "kuryong": (39.72, 125.74), "taedong": (38.70, 125.20),
         "taeryong": (39.59, 125.45)}

def merge(lines, mouth):
    """chain OSM ways (each a lon/lat list) into one line running from the source to the mouth (greedy endpoint matching)."""
    segs = [[(la, lo) for lo, la in l] for l in lines if len(l) > 1]
    d = lambda a, b: math.hypot(a[0] - b[0], (a[1] - b[1]) * 0.77)
    # start at the segment end closest to the mouth and walk upstream
    best = min(((d(s[e], mouth), i, e) for i, s in enumerate(segs) for e in (0, -1)))
    _, i, e = best; cur = segs.pop(i); cur = cur if e == 0 else cur[::-1]
    chain = list(cur)
    while segs:
        tip = chain[-1]
        k, e2, dd = min(((k, e2, d(s[e2], tip)) for k, s in enumerate(segs) for e2 in (0, -1)), key=lambda q: q[2])
        if dd > 0.06: break                                   # ~5 km gap: the rest is a side branch
        s = segs.pop(k); s = s if e2 == 0 else s[::-1]
        chain += s[1:]
    return chain[::-1]                                        # source -> mouth

R = json.load(open(f"assets/src/{BASE}_rivers_osm.json"))
rivers = {}
for kr, key in KEYS.items():
    els = R[kr]
    rel = [x for x in els if x["osm_type"] == "relation"]
    if rel:  # relation = the whole river: keep its longest member chain(s)
        g = rel[0]["geojson"]; lines = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    else:
        lines = [x["geojson"]["coordinates"] for x in els if x["geojson"]["type"] == "LineString"]
    rivers[key] = merge(lines, MOUTH[key])

C = dict(river=(96, 150, 190, 245), ink=(240, 236, 226), halo=(10, 14, 16), rlab=(150, 195, 230))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
WID = {"yalu": 8, "chongchon": 6, "taedong": 6, "kuryong": 4, "taeryong": 4}
out = {}
for key, line in rivers.items():
    g = [P(la, lo) for la, lo in line]
    d.line(g, fill=C["river"], width=WID[key], joint="curve")
    pm = [P(la, lo, 1) for la, lo in line]
    thin, last = [], None
    for x, y in pm:
        if last is None or math.hypot(x - last[0], y - last[1]) > 4: thin.append([round(x, 1), round(y, 1)]); last = (x, y)
    thin.append([round(pm[-1][0], 1), round(pm[-1][1], 1)])
    out[key] = thin
json.dump(out, open(f"assets/media/{BASE}_rivers.json", "w"), separators=(",", ":"))

# big towns only (1950 names); population = rough modern size, only used to rank labels
TOWNS = [("Pyongyang", 39.019, 125.738, 2500000), ("Sinuiju", 40.100, 124.398, 350000), ("Antung", 40.124, 124.330, 700000),
         ("Hamhung", 39.918, 127.536, 700000), ("Hungnam", 39.832, 127.618, 250000), ("Wonsan", 39.153, 127.443, 360000),
         ("Chinnampo", 38.737, 125.407, 360000), ("Kanggye", 40.971, 126.594, 250000), ("Chongju", 39.693, 125.210, 190000),
         ("Huichon", 40.171, 126.276, 170000), ("Songjin", 40.670, 129.193, 200000), ("Pukchong", 40.198, 128.335, 100000),
         ("Hyesanjin", 41.398, 128.178, 190000)]
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
fr = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
taken, shown = [], []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
for nm, lat, lon, pop in sorted(TOWNS, key=lambda q: -q[3]):
    x, y = P(lat, lon)
    if not (20 <= x < W - 20 and 20 <= y < H - 20): continue
    r = 6; lab = nm.upper()
    anc, tx = ("rm", x - r - 6) if nm == "Antung" else ("lm", x + r + 6)
    tb = td.textbbox((tx, y), lab, font=ft, anchor=anc)
    if tb[2] > W - 10: anc, tx = "rm", x - r - 6; tb = td.textbbox((tx, y), lab, font=ft, anchor=anc)
    b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8)
    if not free(b): continue
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    taken.append(b); shown.append(nm)
    hd.text((tx, y), lab, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), lab, font=ft, fill=C["ink"] + (240,), anchor=anc)
# river names (small, light blue, letter-spaced, rotated along the river, offset to one side): the three big rivers only;
# Kuryong / Taeryong are labelled in the scenes. (lat, lon) = where along the river; side = +1/-1 which bank.
RLAB = [("Y A L U", "yalu", 40.45, 124.90, -1), ("C H O N G C H O N", "chongchon", 39.95, 126.10, 1), ("T A E D O N G", "taedong", 39.30, 125.95, 1)]
for lab, key, lat, lon, side in RLAB:
    pts = [P(la, lo) for la, lo in rivers[key]]; q = P(lat, lon)
    i = min(range(len(pts)), key=lambda k: math.hypot(pts[k][0] - q[0], pts[k][1] - q[1]))
    a, b = pts[max(0, i - 25)], pts[min(len(pts) - 1, i + 25)]
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    nx, ny = -math.sin(math.radians(ang)), math.cos(math.radians(ang))
    cx, cy = pts[i][0] + nx * 34 * side, pts[i][1] + ny * 34 * side
    tw = int(td.textlength(lab, font=fr)) + 40
    for layer, col, blur in ((halo, C["halo"] + (210,), True), (txt, C["rlab"] + (240,), False)):
        t = Image.new("RGBA", (tw, 60), (0, 0, 0, 0)); ImageDraw.Draw(t).text((tw / 2, 30), lab, font=fr, fill=col, anchor="mm")
        t = t.rotate(-ang, resample=Image.BICUBIC, expand=True)
        layer.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save(f"assets/media/{BASE}_geo_ref.png", optimize=True)
print("wrote", BASE, "towns:", shown, "rivers:", {k: len(v) for k, v in out.items()})
