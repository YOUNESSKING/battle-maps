"""Geography layer for the Moscow map (move 1), 1941 names (adapted from the shared make_geo_layer.py, which keeps 1944 Normandy names).
usage: python3 tools/make_moscow_geo.py   -> assets/media/moscow_geo_ref.png (5760x3240, shown at 2880x1620) + assets/media/moscow_rivers.json
and refreshes the inline river list (shimmer) between the RIVERS markers in scenes-src/move1.js.
Only the 1941 towns in KEEP are drawn (no post-war towns such as Zelenograd, Dolgoprudny, Lobnya, Odintsovo); the story places
(Volokolamsk, Ruza, Istra, Solnechnogorsk, Klin, Kryukovo, Krasnaya Polyana, Khimki, Moscow) are the scene's own white-box labels.
Rivers: OpenStreetMap if fetched (tools/make_moscow_osm.py), else traced from the HD elevation (make_rivers_dem.py).
Data (c) OpenStreetMap contributors (ODbL)."""
import json, math, os, re
from PIL import Image, ImageDraw, ImageFilter, ImageFont
base = "moscow"
J = json.load(open(f"assets/{base}.json")); O = json.load(open(f"assets/src/{base}_osm.json")) if os.path.exists(f"assets/src/{base}_osm.json") else {}
z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(forest=(30, 54, 36, 120), water=(18, 36, 50, 255), river=(96, 150, 190, 245), stream=(80, 128, 160, 150), ink=(240, 236, 226), halo=(10, 14, 16))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
geom = lambda el: [P(g["lat"], g["lon"]) for g in el.get("geometry", []) if g]
fl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fl)
for el in O.get("forest", []):
    g = geom(el)
    if len(g) > 3: fd.polygon(g, fill=C["forest"])
im.alpha_composite(fl.filter(ImageFilter.GaussianBlur(1.5)))
for el in O.get("lakes", []):
    g = geom(el)
    if len(g) > 3: d.polygon(g, fill=C["water"])
rivers = []
BIG = ("Москва", "Истра", "Руза", "Лама", "Озерна", "Малая Истра", "Сестра", "Яуза", "Клязьма", "Moskva", "Istra")
if O.get("rivers"):
    for el in O["rivers"]:
        g = geom(el)
        if len(g) > 1:
            nm = el.get("tags", {}).get("name", ""); big = nm in BIG
            d.line(g, fill=C["river"], width=6 if big else 4, joint="curve")
            if big or len(g) > 40: sim = g[::4] + [g[-1]]; rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in sim])
elif os.path.exists(f"assets/src/{base}_dem_rivers.json"):
    for seg in json.load(open(f"assets/src/{base}_dem_rivers.json")):
        g = [tuple(q) for q in seg["pts"]]; o = seg["order"]
        if o == 1: continue   # streams clutter a z10 map
        d.line(g, fill=C["stream"] if o == 2 else C["river"], width={2: 3, 3: 6}[o], joint="curve")
        if o == 3: sim = g[::6] + [g[-1]]; rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in sim])
json.dump(rivers, open(f"assets/media/{base}_rivers.json", "w"))
# 1941 towns only (Russian OSM name -> 1941 English label)
KEEP = {"Можайск": "MOZHAISK", "Звенигород": "ZVENIGOROD", "Дмитров": "DMITROV", "Наро-Фоминск": "NARO-FOMINSK", "Красногорск": "KRASNOGORSK",
        "Яхрома": "YAKHROMA", "Шаховская": "SHAKHOVSKAYA", "Лотошино": "LOTOSHINO", "Дедовск": "DEDOVSK", "Конаково": "KONAKOVO", "Верея": "VEREYA"}
f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 28)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
shown = []
for el in O.get("places", []):
    nm = el.get("tags", {}).get("name", "")
    if nm not in KEEP: continue
    x, y = P(el["lat"], el["lon"])
    if not (0 <= x < W and 0 <= y < H): continue
    lab, r = KEEP[nm], 5
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    hd.text((x + r + 6, y), lab, font=f, fill=C["halo"] + (220,), anchor="lm"); td.text((x + r + 6, y), lab, font=f, fill=C["ink"] + (235,), anchor="lm")
    shown.append(lab)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save(f"assets/media/{base}_geo_ref.png", optimize=True)
# inline the shimmer paths into the scene (only those inside the action area, to keep the page small)
keep = [p for p in rivers if any(500 < x < 2300 and 250 < y < 1400 for x, y in p)]
src = open("scenes-src/move1.js").read()
src = re.sub(r"// RIVERS-BEGIN\n.*?// RIVERS-END", "// RIVERS-BEGIN\nconst RIV = " + json.dumps(keep, separators=(",", ":")) + ";\n// RIVERS-END", src, flags=re.S)
open("scenes-src/move1.js", "w").write(src)
print("towns", shown, {k: len(O.get(k, [])) for k in ("places", "rivers", "lakes", "forest")}, "river paths", len(rivers), "inlined", len(keep))
