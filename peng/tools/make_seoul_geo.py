"""Geography layer for the seoul map (Peng move 3, z10), the make_geo_layer.py "ref" look (collins/tools/make_ard_geo.py recipe).
Overpass was down (connection reset / dispatcher error, 2026-10-12), so rivers come from the HD elevation
(tools/make_rivers_dem.py seoul -> assets/src/seoul_dem_rivers.json) and the big towns are a hand list (1950 names, plain spelling as
in the narration; story places such as Munsan, Korangpo-ri, Tokchong, Ansong, Changhowon-ni are the scene's small white-box labels).
usage (from peng/): python3 tools/make_seoul_geo.py
-> assets/media/seoul_geo_ref.png (5760x3240, shown at 2880x1620)
-> assets/media/seoul_rivers.json (big rivers, map px, for the living-map shimmer)
-> assets/media/seoul_han.json / seoul_imjin.json (map px, DEM segments near each river's known course: for the glow / ice)"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/seoul.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(river=(96, 150, 190, 245), small=(86, 136, 172, 150), ink=(240, 236, 226), halo=(10, 14, 16))
R = json.load(open("assets/src/seoul_dem_rivers.json"))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
for o in R:
    if o["order"] == 2: d.line([tuple(p) for p in o["pts"]], fill=C["small"], width=3, joint="curve")
for o in R:
    if o["order"] == 3: d.line([tuple(p) for p in o["pts"]], fill=C["river"], width=7, joint="curve")
big = [[[round(x / S, 1), round(y / S, 1)] for x, y in (o["pts"][::4] + [o["pts"][-1]])] for o in R if o["order"] == 3]
json.dump(big, open("assets/media/seoul_rivers.json", "w"))

def pick(course, name, tol=60):
    CO = [P(*q) for q in course]
    def dist(p):
        best = 1e9
        for (ax, ay), (bx, by) in zip(CO, CO[1:]):
            dx, dy = bx - ax, by - ay; t = max(0, min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / (dx * dx + dy * dy)))
            best = min(best, math.hypot(p[0] - ax - t * dx, p[1] - ay - t * dy))
        return best
    out = []
    for o in R:
        if o["order"] < 3: continue
        pts = o["pts"]
        if sum(dist(p) < tol for p in pts) > 0.8 * len(pts): out.append([[round(x / S, 1), round(y / S, 1)] for x, y in pts[::2] + [pts[-1]]])
    json.dump(out, open(f"assets/media/seoul_{name}.json", "w")); return out
# the Han: Yangsu-ri (Pukhan junction) - Seoul - Haengju - the estuary; the Imjin: Jeongok - Korangpo-ri - Munsan - the Han mouth
HAN = pick([(37.53, 127.32), (37.545, 127.20), (37.53, 127.10), (37.515, 127.00), (37.53, 126.92), (37.57, 126.85), (37.61, 126.80),
            (37.67, 126.72), (37.75, 126.68)], "han")
IMJ = pick([(38.03, 127.07), (38.00, 126.98), (37.97, 126.91), (37.93, 126.85), (37.89, 126.77), (37.80, 126.69), (37.76, 126.67)], "imjin")
# big towns, 1950 names (plain spelling as in the narration)
TOWNS = [("INCHON", 37.47, 126.63), ("SUWON", 37.27, 127.01), ("KAESONG", 37.97, 126.55), ("CHUNCHON", 37.88, 127.73),
         ("WONJU", 37.34, 127.95), ("CHONAN", 36.81, 127.15), ("CHUNGJU", 36.97, 127.93), ("CHONGJU", 36.64, 127.49),
         ("PYONGTAEK", 36.99, 127.09), ("UIJONGBU", 37.74, 127.04), ("ICHON", 37.27, 127.44)]
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
shown = []
for nm, la, lo in TOWNS:
    x, y = P(la, lo)
    if not (40 < x < W - 40 and 40 < y < H - 40): continue
    r = 7; right = x > W - 420
    anc, tx = ("rm", x - r - 7) if right else ("lm", x + r + 7)
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    hd.text((tx, y), nm, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), nm, font=ft, fill=C["ink"] + (235,), anchor=anc)
    shown.append(nm)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/seoul_geo_ref.png", optimize=True)
print("towns:", shown, "big rivers:", len(big), "han segments:", len(HAN), "imjin segments:", len(IMJ))
