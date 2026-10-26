"""Geography layers for the Cobra move (Collins #9, move 2), make_geo_layer.py "ref" look: thin blue rivers, big towns only, small
1944 labels that never collide. Overpass timed out on 2026-10-10, so rivers come from the elevation (tools/make_cob_rivers.py) and
towns are placed from their known coordinates (1944 names; population = rough modern size, only used to rank labels).
usage: python3 tools/make_cob_geo.py nor|cob
  nor -> assets/media/nor_geo_ref.png (5760x3240, shown at 2880x1620) + assets/media/nor_rivers.json (shimmer paths, map px)
  cob -> assets/media/cob_geo_ref.png + assets/media/cob_rivers.json + assets/media/cob_road.json (the Periers - St-Lo road,
         OSM ref D 900 = the 1944 N 800, from assets/src/cob_d900.json, map px, west -> east). Road data (c) OSM contributors (ODbL).
Story places (Saint-Lo, Caen, Coutances, Avranches, Periers, Marigny...) are NOT drawn here: the scenes put them in white boxes."""
import json, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
key = sys.argv[1]; base = {"nor": "normandy", "cob": "cobra"}[key]
J = json.load(open(f"assets/{base}.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)
C = dict(river=(96, 150, 190, 245), small=(86, 136, 172, 190), ink=(240, 236, 226), halo=(10, 14, 16))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
R = json.load(open(f"assets/src/{key}_dem_rivers.json"))
MINO = 2 if key == "cob" else 2
shimmer = []
for r in R:
    if r["order"] < MINO: continue
    g = [(x * S, y * S) for x, y in r["pts"]]
    big = r["order"] == 3
    col = C["river"] if big else (C["small"] if key == "nor" else (86, 136, 172, 110))
    d.line(g, fill=col, width=(6 if big else 3) if key == "nor" else (8 if big else 3), joint="curve")
    if big and len(r["pts"]) > 8: shimmer.append([[round(x), round(y)] for x, y in r["pts"][::3] + [r["pts"][-1]]])
json.dump(shimmer, open(f"assets/media/{key}_rivers.json", "w"))
if key == "cob":   # the Periers - St-Lo road: casing + light centre (the scene makes it glow on top)
    O = json.load(open("assets/src/cob_d900.json"))
    nodes = {}
    for w in O["elements"]:
        for g in w.get("geometry", []):
            if g: nodes[(round(g["lon"], 5), round(g["lat"], 5))] = 1
    pts = sorted(nodes)                                    # the road runs west -> east (Lessay - Periers - St-Lo): sort by lon
    line, last = [], None
    for lon, lat in pts:
        x, y = P(lat, lon, 1)
        if last is None or math.hypot(x - last[0], y - last[1]) > 6: line.append([round(x, 1), round(y, 1)]); last = (x, y)
    json.dump(line, open("assets/media/cob_road.json", "w"))
    g = [(x * S, y * S) for x, y in line]
    d.line(g, fill=(30, 22, 12, 170), width=14, joint="curve"); d.line(g, fill=(226, 214, 186, 230), width=6, joint="curve")
# big towns only (1944 names); story places are boxed in the scenes, so they are skipped here
TOWNS = {"nor": [("Cherbourg", 49.639, -1.616, 80000), ("Le Havre", 49.494, 0.108, 170000), ("Bayeux", 49.276, -0.703, 13000),
                 ("Lisieux", 49.146, 0.226, 22000), ("Granville", 48.838, -1.597, 13000), ("Vire", 48.838, -0.889, 12000),
                 ("Falaise", 48.895, -0.196, 8000), ("Flers", 48.75, -0.57, 15000), ("Argentan", 48.744, -0.020, 14000),
                 ("Saint-Malo", 48.649, -2.026, 46000), ("Valognes", 49.509, -1.470, 7000), ("Carentan", 49.303, -1.248, 6000),
                 ("Honfleur", 49.419, 0.233, 7000), ("Saint-Hélier", 49.186, -2.106, 33000), ("Saint-Peter Port", 49.455, -2.536, 16000)],
         "cob": [("Carentan", 49.303, -1.248, 6000)]}[key]
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30 if key == "nor" else 34)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
taken, shown = [], []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
for nm, lat, lon, pop in sorted(TOWNS, key=lambda q: -q[3]):
    x, y = P(lat, lon)
    if not (20 <= x < W - 20 and 20 <= y < H - 20): continue
    r = 6; lab = nm.upper()
    anc, tx = ("lm", x + r + 6)
    tb = td.textbbox((tx, y), lab, font=ft, anchor=anc)
    if tb[2] > W - 10: anc, tx = "rm", x - r - 6; tb = td.textbbox((tx, y), lab, font=ft, anchor=anc)
    b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8)
    if not free(b): continue
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    taken.append(b); shown.append(nm)
    hd.text((tx, y), lab, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), lab, font=ft, fill=C["ink"] + (240,), anchor=anc)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save(f"assets/media/{key}_geo_ref.png", optimize=True)
print("wrote", key, "towns:", shown, "shimmer paths:", len(shimmer))
