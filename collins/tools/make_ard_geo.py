"""Geography layer for the ardennes map (Collins move 3, z10), the make_geo_layer.py "ref" look. Overpass was down (HTTP 500 /
connection reset, see tools/make_ard_osm.py), so rivers come from the HD elevation (tools/make_rivers_dem.py ardennes ->
assets/src/ardennes_dem_rivers.json) and the big towns are a hand list (1944 names, population >= ~8,000; story villages such as
Celles or Foy-Notre-Dame are left to the scene's small white-box labels).
usage (from collins/): python3 tools/make_ard_geo.py
-> assets/media/ard_geo_ref.png (5760x3240, shown at 2880x1620)
-> assets/media/ard_rivers.json (big rivers, map px, for the living-map shimmer)
-> assets/media/ard_meuse.json  (the Meuse, Givet -> Liege, map px, traced segments near the river's course: for the glow)"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/ardennes.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(river=(96, 150, 190, 245), small=(86, 136, 172, 150), ink=(240, 236, 226), halo=(10, 14, 16))
R = json.load(open("assets/src/ardennes_dem_rivers.json"))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
for o in R:
    if o["order"] == 2: d.line([tuple(p) for p in o["pts"]], fill=C["small"], width=3, joint="curve")
for o in R:
    if o["order"] == 3: d.line([tuple(p) for p in o["pts"]], fill=C["river"], width=7, joint="curve")
big = [[[round(x / S, 1), round(y / S, 1)] for x, y in (o["pts"][::4] + [o["pts"][-1]])] for o in R if o["order"] == 3]
json.dump(big, open("assets/media/ard_rivers.json", "w"))
# the Meuse: DEM segments lying close to its known course (Givet - Dinant - Namur - Huy - Liege)
COURSE = [P(*q) for q in [(50.14, 4.825), (50.21, 4.83), (50.235, 4.905), (50.26, 4.912), (50.33, 4.88), (50.375, 4.87), (50.465, 4.87),
                         (50.49, 5.09), (50.52, 5.24), (50.58, 5.45), (50.63, 5.57)]]
def dist(p):
    best = 1e9
    for (ax, ay), (bx, by) in zip(COURSE, COURSE[1:]):
        dx, dy = bx - ax, by - ay; t = max(0, min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy)))
        best = min(best, math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy))
    return best
meuse = []
for o in R:
    if o["order"] < 3: continue
    pts = o["pts"]
    if sum(dist(p) < 70 for p in pts) > 0.8 * len(pts): meuse.append([[round(x / S, 1), round(y / S, 1)] for x, y in pts[::2] + [pts[-1]]])
json.dump(meuse, open("assets/media/ard_meuse.json", "w"))
# big towns, 1944 names (Belgian / French / Luxembourg / German spellings of the period)
TOWNS = [("LIÈGE", 50.633, 5.567), ("NAMUR", 50.465, 4.867), ("CHARLEROI", 50.411, 4.444), ("VERVIERS", 50.589, 5.862),
         ("AACHEN", 50.776, 6.084), ("LUXEMBOURG", 49.611, 6.130), ("ARLON", 49.683, 5.817), ("HUY", 50.519, 5.239),
         ("EUPEN", 50.630, 6.036), ("TRIER", 49.756, 6.641), ("SEDAN", 49.702, 4.940), ("CHARLEVILLE", 49.773, 4.720),
         ("DÜREN", 50.804, 6.483), ("MAASTRICHT", 50.851, 5.691)]
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
shown = []
for nm, la, lo in TOWNS:
    x, y = P(la, lo)
    if not (40 < x < W - 40 and 40 < y < H - 40): continue
    r = 6; right = x > W - 420
    anc, tx = ("rm", x - r - 6) if right else ("lm", x + r + 6)
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    hd.text((tx, y), nm, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), nm, font=ft, fill=C["ink"] + (235,), anchor=anc)
    shown.append(nm)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/ard_geo_ref.png", optimize=True)
print("towns:", shown, "big rivers:", len(big), "meuse segments:", len(meuse))
