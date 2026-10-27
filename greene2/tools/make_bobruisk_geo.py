"""Geography layer for the bobruisk map (Belarus, z9), the make_geo_layer.py look ("ref" style) adapted to Belarus:
OSM names are Belarusian/Russian, so places are keyed on name:ru and given their 1944 English names (Bobruisk, Rogachev, Mogilev...);
towns founded after the war (Soligorsk, Svetlogorsk, Zhodino, Desnogorsk, suburbs) are left out; only the main rivers are drawn
(the Polesie drainage canals and the streams would clutter a z9 map).
usage: python3 tools/make_bobruisk_geo.py [MINPOP=20000]
-> assets/media/bobruisk_geo_ref.png (5760x3240, shown at 2880x1620), assets/media/bobruisk_rivers.json (shimmer paths, map px),
   assets/media/bobruisk_rivers_named.json ({river: [[x, y], ...]} longest named run, for river labels). Data (c) OSM contributors (ODbL)."""
import json, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont
J = json.load(open("assets/bobruisk.json")); O = json.load(open("assets/src/bobruisk_osm.json"))
z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
MINPOP = int(sys.argv[1]) if len(sys.argv) > 1 else 20000
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(water=(16, 27, 34, 255), river=(96, 150, 190, 245), small=(86, 136, 172, 200), ink=(240, 236, 226), halo=(10, 14, 16))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
geom = lambda el: [P(g["lat"], g["lon"]) for g in el.get("geometry", []) if g]
for el in O.get("lakes", []):
    g = geom(el)
    if len(g) > 3: d.polygon(g, fill=C["water"])
BIG = {"Днепр", "Березина", "Припять", "Сож"}
MID = {"Друть", "Птичь", "Свислочь", "Ола", "Проня", "Случь", "Неман", "Щара", "Березина (Западная)", "Западная Березина", "Беседь", "Уза", "Ипуть", "Ясельда", "Цна", "Лань", "Оресса"}
rivers, named = [], {}
for el in O.get("rivers", []):
    t = el.get("tags", {})
    if t.get("waterway") != "river": continue
    nm = t.get("name:ru") or t.get("name", "")
    if nm not in BIG and nm not in MID: continue
    g = geom(el)
    if len(g) < 2: continue
    d.line(g, fill=C["river"] if nm in BIG else C["small"], width=7 if nm in BIG else 4, joint="curve")
    sim = g[::4] + [g[-1]]; mp = [[round(x / S, 1), round(y / S, 1)] for x, y in sim]
    if nm in BIG: rivers.append(mp)
    named.setdefault(nm, []).append(mp)
json.dump(rivers, open("assets/media/bobruisk_rivers.json", "w"))
json.dump({k: max(v, key=len) for k, v in named.items()}, open("assets/media/bobruisk_rivers_named.json", "w"))
# 1944 names (Russian-style transliteration of the period); None = leave out (post-war town or suburb)
HIST = {"Минск": "Minsk", "Гомель": "Gomel", "Могилёв": "Mogilev", "Бобруйск": "Bobruisk", "Барановичи": "Baranovichi", "Борисов": "Borisov",
        "Пинск": "Pinsk", "Солигорск": None, "Мозырь": "Mozyr", "Молодечно": "Molodechno", "Жлобин": "Zhlobin", "Жодино": None,
        "Речица": "Rechitsa", "Клинцы": "Klintsy", "Слуцк": "Slutsk", "Светлогорск": None, "Рославль": "Roslavl", "Новозыбков": "Novozybkov",
        "Калинковичи": "Kalinkovichi", "Горки": "Gorki", "Рогачёв": "Rogachev", "Новогрудок": "Novogrudok", "Осиповичи": "Osipovichi",
        "Десногорск": None, "Дзержинск": "Dzerzhinsk", "Кричев": "Krichev", "Лунинец": "Luninets", "Унеча": "Unecha", "Марьина Горка": None,
        "Добруш": "Dobrush", "Стародуб": "Starodub", "Быхов": "Bykhov", "Колодищи": None, "Столбцы": "Stolbtsy", "Смолевичи": None,
        "Фаниполь": None, "Шклов": "Shklov", "Климовичи": "Klimovichi", "Костюковичи": None, "Несвиж": "Nesvizh", "Житковичи": None,
        "Заславль": None, "Лесной": None}
SKIP = {x.strip().upper() for x in (sys.argv[2] if len(sys.argv) > 2 else "BOBRUISK,ROGACHEV,ZHLOBIN,MINSK,MOGILEV").split(",")}
def popn(el):
    try: return int(str(el.get("tags", {}).get("population", "0")).replace(" ", ""))
    except ValueError: return 0
pl = []
for el in O.get("places", []):
    t = el.get("tags", {})
    if t.get("place") not in ("city", "town"): continue
    ru = t.get("name:ru") or t.get("name", "")
    if ru not in HIST or HIST[ru] is None or popn(el) < MINPOP: continue
    nm = HIST[ru]
    if nm.upper() in SKIP: continue
    x, y = P(el["lat"], el["lon"])
    if 0 <= x < W and 0 <= y < H: pl.append((popn(el), nm, x, y))
pl.sort(key=lambda q: -q[0])
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
taken = []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
shown = []
for pop, nm, x, y in pl:
    r = 6; lab = nm.upper()
    tb = td.textbbox((x + r + 6, y), lab, font=ft, anchor="lm"); b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8)
    if b[2] > W - 10:  # label to the left near the right edge
        tb = td.textbbox((x - r - 6, y), lab, font=ft, anchor="rm"); b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8); anc, tx = "rm", x - r - 6
    else: anc, tx = "lm", x + r + 6
    if not (free(b) and free((x - r - 8, y - r - 8, x + r + 8, y + r + 8))): continue
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    taken.append(b); shown.append(nm)
    hd.text((tx, y), lab, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), lab, font=ft, fill=C["ink"] + (240,), anchor=anc)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/bobruisk_geo_ref.png", optimize=True)
print("wrote assets/media/bobruisk_geo_ref.png", "towns:", shown, "rivers:", {k: len(v) for k, v in named.items()})
