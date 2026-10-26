"""Geography layers for the Kursk map (move 2), from assets/src/kursk_osm.json (tools/make_kursk_osm.py; Russian names -> English,
1943 names, big towns only). Two layers so the labels stay small at every camera zoom:
-> assets/media/kursk_geo_base.png  (2x HD, 5760x3240): forests (battle box), lakes, rivers (width by size), streams (battle box). No labels.
-> assets/media/kursk_geo_towns.png (2x HD): big towns (pop >= MINPOP) as dot + small name, sized for the wide shots; story places skipped
   (the scene shows them as white-box labels).
-> assets/media/kursk_rivers.json: simplified river polylines (map px) for the shimmer.
usage: python3 tools/make_kursk_geo.py [MINPOP=12000]   Data (c) OpenStreetMap contributors (ODbL)."""
import json, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
J = json.load(open("assets/kursk.json")); O = json.load(open("assets/src/kursk_osm.json"))
z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
MINPOP = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(forest=(34, 58, 40, 110), water=(16, 27, 34, 255), river=(96, 150, 190, 245), stream=(80, 128, 160, 130), ink=(240, 236, 226), halo=(10, 14, 16))
geom = lambda el: [P(g["lat"], g["lon"]) for g in el.get("geometry", []) if g]
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
fl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fl)
for el in O.get("forest", []):
    g = geom(el)
    if len(g) > 3: fd.polygon(g, fill=C["forest"])
im.alpha_composite(fl.filter(ImageFilter.GaussianBlur(1.5)))
for el in O.get("lakes", []):
    g = geom(el)
    if len(g) > 3: d.polygon(g, fill=C["water"])
for el in O.get("streams", []):
    g = geom(el)
    if len(g) > 1: d.line(g, fill=C["stream"], width=2, joint="curve")
BIG = {"Ока", "Сейм", "Десна", "Сосна", "Быстрая Сосна", "Зуша", "Свапа", "Тускарь", "Нерусса", "Нугрь", "Кромa", "Крома", "Оскол", "Неруч", "Цон", "Сев", "Навля", "Болва", "Жиздра", "Псёл", "Псел", "Ворскла", "Дон", "Снова", "Усожа"}
rivers = []
for el in O.get("rivers", []):
    g = geom(el)
    if len(g) > 1:
        nm = el.get("tags", {}).get("name", "")
        big = nm in BIG
        d.line(g, fill=C["river"], width=6 if big else 3, joint="curve")
        if big: sim = g[::4] + [g[-1]]; rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in sim])
im.save("assets/media/kursk_geo_base.png", optimize=True)
json.dump(rivers, open("assets/media/kursk_rivers.json", "w"))
# towns: English 1943 names; post-war towns left out (Zheleznogorsk 1957, Kurchatov 1968, Gubkin renamed 1955, Fokino 1964, Seltso 1990)
LAT = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя", ["a", "b", "v", "g", "d", "e", "yo", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "f", "kh", "ts", "ch", "sh", "shch", "", "y", "", "e", "yu", "ya"]))
def tr(s): return "".join(LAT.get(c.lower(), c) if c.lower() in LAT else c for c in s)
HIST = {"Oryol": "Orel", "Orël": "Orel", "Staryy Oskol": "Stary Oskol", "Novyy Oskol": "Novy Oskol", "Hlukhiv": "Glukhov", "Putyvl": "Putivl",
        "Novhorod-Siverskyi": "Novgorod-Seversky", "Bilopillia": "Belopolye", "navlya": "Navlya", "L'gov": "Lgov", "Ryl'sk": "Rylsk", "Oboyan'": "Oboyan"}
DROP = {"Novovoronezh", "Zheleznogorsk", "Kurchatov", "Gubkin", "Fokino", "Seltso", "Sel'tso", "Raduzhny", "Raduzhnyy"}
SKIP = {"Orel", "Kursk", "Ponyri", "Olkhovatka", "Maloarkhangelsk", "Fatezh", "Kromy", "Glazunovka"}
def popn(el):
    try: return int(str(el.get("tags", {}).get("population", "0")).replace(" ", ""))
    except ValueError: return 0
pl = []
for el in O.get("places", []):
    t = el.get("tags", {}); nm = t.get("name:en") or tr(t.get("name", "")); nm = HIST.get(nm, nm)
    if not nm or nm in DROP or nm in SKIP: continue
    x, y = P(el["lat"], el["lon"])
    if 40 <= x < W - 40 and 40 <= y < H - 40 and popn(el) >= MINPOP: pl.append((popn(el), nm, x, y))
pl.sort(key=lambda q: -q[0])
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34)
taken = []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
shown = []
for pop, nm, x, y in pl:
    r = 6; lab = nm.upper()
    tb = td.textbbox((x + r + 6, y), lab, font=ft, anchor="lm"); b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8)
    if free(b) and free((x - r - 8, y - r - 8, x + r + 8, y + r + 8)):
        td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
        taken.append(b); shown.append((nm, pop, round(x / S), round(y / S)))
        hd.text((x + r + 6, y), lab, font=ft, fill=C["halo"] + (220,), anchor="lm"); td.text((x + r + 6, y), lab, font=ft, fill=C["ink"] + (240,), anchor="lm")
halo = halo.filter(ImageFilter.GaussianBlur(4)); halo.alpha_composite(txt)
halo.save("assets/media/kursk_geo_towns.png", optimize=True)
print("towns", shown); print("rivers", len(rivers), {k: len(O.get(k, [])) for k in ("places", "rivers", "lakes", "streams", "forest")})
