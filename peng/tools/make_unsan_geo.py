"""Geography layer for the `unsan` close-up basemap (z12; Peng #10 move 1b): make_geo_layer "ref" look.
Rivers: the Kuryong + Chongchon from OpenStreetMap (assets/src/nwkorea_rivers_osm.json, (c) OSM contributors, ODbL); the smaller
streams (the Samtan north of Unsan, the Nammyon at the Camel's Head Bend, ...) traced from the elevation (tools/make_rivers_dem.py unsan
-> assets/src/unsan_dem_rivers.json, Mapzen/AWS Terrain Tiles). Small towns only; the story places are boxed in the scene.
usage (from peng/): python3 tools/make_unsan_geo.py
 -> assets/media/unsan_geo_ref.png (5760x3240, show at 2880x1620)
 -> assets/media/unsan_rivers.json {"kuryong": [[x,y]...], "chongchon": [...], "streams": [[[x,y]...], ...]} map px"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "unsan"
J = json.load(open(f"assets/{BASE}.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)

R = json.load(open("assets/src/nwkorea_rivers_osm.json"))
def osm_lines(kr):
    out = []
    for x in R[kr]:
        g = x["geojson"]
        if g["type"] == "LineString": out.append(g["coordinates"])
        elif g["type"] == "MultiLineString": out += g["coordinates"]
    return out
C = dict(river=(96, 150, 190, 245), small=(86, 136, 172, 170), ink=(240, 236, 226), halo=(10, 14, 16), rlab=(150, 195, 230))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
# DEM streams first (under the named rivers): order 3 = rivers (Samtan, Nammyon, ...), order 2 = faint creeks
D = json.load(open(f"assets/src/{BASE}_dem_rivers.json"))
streams = []
for r in D:
    if r["order"] < 2: continue
    big = r["order"] == 3
    d.line([tuple(p) for p in r["pts"]], fill=C["small"] if big else (86, 136, 172, 95), width=5 if big else 2, joint="curve")
    if big and len(r["pts"]) > 30: streams.append([[round(x / 2), round(y / 2)] for x, y in r["pts"][::6] + [r["pts"][-1]]])
named = {}
for kr, key, wd in (("구룡강", "kuryong", 12), ("청천강", "chongchon", 14)):
    lines = osm_lines(kr)
    for l in lines:
        g = [P(la, lo) for lo, la in l]
        if any(0 <= x < W and 0 <= y < H for x, y in g): d.line(g, fill=C["river"], width=wd, joint="curve")
    named[key] = [[[round(a / 2, 1), round(b / 2, 1)] for a, b in [P(la, lo) for lo, la in l][::2]] for l in lines]
# small towns (1950 names); Unsan, Ipsok, Yongsan-dong etc. are boxed in the scene
TOWNS = [("Yongbyon", 39.814, 125.805, 30000), ("Kujang-dong", 39.869, 126.028, 20000), ("Taechon", 39.922, 125.494, 20000)]
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34); fr = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
for nm, lat, lon, pop in TOWNS:
    x, y = P(lat, lon); r = 7; lab = nm.upper()
    if not (20 <= x < W - 20 and 20 <= y < H - 20): continue
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    hd.text((x + r + 8, y), lab, font=ft, fill=C["halo"] + (220,), anchor="lm"); td.text((x + r + 8, y), lab, font=ft, fill=C["ink"] + (240,), anchor="lm")
# river names along the river (rotated); (lat, lon) = where, side = which bank
def rlabel(lab, pts, lat, lon, side):
    q = P(lat, lon); i = min(range(len(pts)), key=lambda k: math.hypot(pts[k][0] - q[0], pts[k][1] - q[1]))
    a, b = pts[max(0, i - 6)], pts[min(len(pts) - 1, i + 6)]
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    ang = ang - 180 if ang > 90 else ang + 180 if ang < -90 else ang
    nx, ny = -math.sin(math.radians(ang)), math.cos(math.radians(ang)); cx, cy = pts[i][0] + nx * 40 * side, pts[i][1] + ny * 40 * side
    tw = int(td.textlength(lab, font=fr)) + 40
    for layer, col in ((halo, C["halo"] + (210,)), (txt, C["rlab"] + (240,))):
        t = Image.new("RGBA", (tw, 64), (0, 0, 0, 0)); ImageDraw.Draw(t).text((tw / 2, 32), lab, font=fr, fill=col, anchor="mm")
        t = t.rotate(-ang, resample=Image.BICUBIC, expand=True); layer.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
kur = [P(la, lo) for l in osm_lines("구룡강") for lo, la in l]
rlabel("K U R Y O N G   R .", kur, 39.86, 125.77, 1)
chg = [P(la, lo) for l in osm_lines("청천강") for lo, la in l]
rlabel("C H O N G C H O N   R .", chg, 39.90, 126.07, -1)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save(f"assets/media/{BASE}_geo_ref.png", optimize=True)
json.dump({"kuryong": named["kuryong"], "chongchon": named["chongchon"], "streams": streams}, open(f"assets/media/{BASE}_rivers.json", "w"), separators=(",", ":"))
print("wrote", BASE, "streams:", len(streams))
