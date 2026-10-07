"""Geography layer + land mask for the `east` overview map (Eastern Front, z6), in the merged "Frontlines" look.
usage: python3 tools/make_east_geo.py   (run from rokossovsky/)
-> assets/east_land.png            2880x1620, white = land (elev > 0.5 from assets/src/east_hd_elev.npy, big lakes cut out)
-> assets/media/east_geo_ref.png   5760x3240 (shown at 2880x1620): big lakes, main rivers, BIG towns only with small 1941-44 names
-> assets/media/east_rivers.json   simplified main-river polylines (map px) for the living-map shimmer
Overpass was unreachable from this machine, and at z6 OpenStreetMap is far too dense anyway, so lakes and rivers come from
Natural Earth 10m (public domain; trimmed copies in assets/src/east_ne_*.geojson) and towns from the hand list below
(period names: Kalinin, Stalino, Kuibyshev, Gorky, Königsberg, Danzig, Breslau...). Story places (Moscow, Kursk, Bobruisk, Dubno,
Vyazma, Bryansk) are left out here: the scenes put them on as small white-box labels."""
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/east.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - ox) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * S)
C = dict(water=(16, 27, 34, 255), river=(96, 150, 190, 235), stream=(80, 128, 160, 150), ink=(240, 236, 226), halo=(10, 14, 16))

# ---- lakes (pre-war natural lakes only; Soviet reservoirs such as Rybinsk/Kiev/Kakhovka are post-1941 or later, left out) ----
lakes = [f for f in json.load(open("assets/src/east_ne_lakes.geojson"))["features"] if (9 if f["properties"]["scalerank"] is None else f["properties"]["scalerank"]) <= 6
         or (f["properties"]["name"] or "") in ("Lake Il'Men'", "Lake Pskov", "Lake Beloye", "Lake Balaton", "Syvash", "Zalew Wislany", "Kaliningradskiy Zaliv")]
def rings(g):
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    return [[P(c[1], c[0]) for c in poly[0]] for poly in polys]
lk = Image.new("L", (W, H), 0); ld = ImageDraw.Draw(lk)
for f in lakes:
    for ring in rings(f["geometry"]):
        if len(ring) > 2: ld.polygon(ring, fill=255)
lake = np.array(lk) > 0

# ---- land mask (map px) ----
elev = np.load("assets/src/east_hd_elev.npy")
land2 = (elev > 0.5) & ~lake
Image.fromarray((land2.astype(np.uint8) * 255)).resize((W // S, H // S), Image.BILINEAR).point(lambda v: 255 if v > 127 else 0).save("assets/east_land.png", optimize=True)

im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
# ---- rivers: Natural Earth main rivers (scalerank <= 8) + the Europe supplement's bigger ones ----
riv = json.load(open("assets/src/east_ne_rivers.geojson"))["features"]
shimmer = []
for f in riv:
    p = f["properties"]; sr = 12 if p["scalerank"] is None else p["scalerank"]; src = p["src"]
    if (src == "ne_10m_rivers_lake_centerlines" and sr > 8) or (src == "ne_10m_rivers_europe" and sr > 10): continue
    width = 7 if sr <= 4 else 5 if sr <= 7 else 3
    g = f["geometry"]; lines = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    for ln in lines:
        q = [P(c[1], c[0]) for c in ln]
        if len(q) > 1:
            d.line(q, fill=C["river"] if width > 3 else C["stream"], width=width, joint="curve")
            if width >= 5 and len(q) > 4: shimmer.append([[round(x / S, 1), round(y / S, 1)] for x, y in q[::3] + [q[-1]]])
for f in lakes:
    for ring in rings(f["geometry"]):
        if len(ring) > 2: d.polygon(ring, fill=C["water"])
json.dump(shimmer, open("assets/media/east_rivers.json", "w"))

# ---- big towns only, 1941-44 names (lat, lon, name); capitals and cities of ~250k+ in 1939, plus a few front-line cities ----
TOWNS = [
 (59.94, 30.31, "LENINGRAD"), (50.45, 30.52, "KIEV"), (49.99, 36.23, "KHARKOV"), (48.71, 44.51, "STALINGRAD"), (56.33, 44.00, "GORKY"),
 (53.20, 50.15, "KUIBYSHEV"), (55.79, 49.12, "KAZAN"), (47.23, 39.72, "ROSTOV"), (48.00, 37.80, "STALINO"), (48.46, 35.04, "DNEPROPETROVSK"),
 (46.48, 30.73, "ODESSA"), (53.90, 27.56, "MINSK"), (54.78, 32.05, "SMOLENSK"), (51.67, 39.20, "VORONEZH"), (51.53, 46.03, "SARATOV"),
 (57.63, 39.87, "YAROSLAVL"), (56.95, 24.10, "RIGA"), (59.44, 24.75, "TALLINN"), (54.69, 25.28, "VILNIUS"), (56.86, 35.90, "KALININ"),
 (54.19, 37.62, "TULA"), (52.97, 36.07, "OREL"), (49.84, 24.03, "LVOV"), (47.84, 35.14, "ZAPOROZHYE"), (44.60, 33.52, "SEVASTOPOL"),
 (45.04, 38.98, "KRASNODAR"), (52.44, 31.00, "GOMEL"), (55.19, 30.20, "VITEBSK"), (46.35, 48.04, "ASTRAKHAN"), (58.60, 49.66, "KIROV"),
 (52.52, 13.40, "BERLIN"), (54.71, 20.51, "KÖNIGSBERG"), (52.23, 21.01, "WARSAW"), (54.35, 18.65, "DANZIG"), (51.11, 17.03, "BRESLAU"),
 (50.06, 19.94, "KRAKAU"), (47.50, 19.04, "BUDAPEST"), (44.43, 26.10, "BUCHAREST"), (60.17, 24.94, "HELSINKI"), (59.33, 18.07, "STOCKHOLM"),
 (48.21, 16.37, "VIENNA"), (50.08, 14.42, "PRAGUE"), (44.79, 20.45, "BELGRADE"), (42.70, 23.32, "SOFIA"), (47.16, 27.59, "IASI"),
 (47.02, 28.84, "KISHINEV"), (53.68, 23.83, "GRODNO"), (52.10, 23.69, "BREST"), (51.25, 22.57, "LUBLIN"), (57.82, 28.33, "PSKOV"),
 (58.52, 31.27, "NOVGOROD"), (53.90, 30.33, "MOGILEV"),
]
F = "tools/oswald-latin-700-normal.ttf"
ft = ImageFont.truetype(F, 34)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
taken = []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
for lat, lon, nm in TOWNS:
    if not nm: continue
    x, y = P(lat, lon); r = 6
    if not (0 <= x < W and 0 <= y < H): continue
    left = nm in ("RIGA", "TALLINN", "DANZIG", "STOCKHOLM", "SOFIA", "BELGRADE", "VIENNA", "KRAKAU", "BRESLAU", "LUBLIN", "LVOV", "GRODNO")
    ax = x - r - 6 if left else x + r + 6
    tb = td.textbbox((ax, y), nm, font=ft, anchor="rm" if left else "lm"); b = (tb[0] - 8, tb[1] - 6, tb[2] + 8, tb[3] + 6)
    if not free(b): print("skip (collides)", nm); continue
    taken.append(b); taken.append((x - r - 4, y - r - 4, x + r + 4, y + r + 4))
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    hd.text((ax, y), nm, font=ft, fill=C["halo"] + (220,), anchor="rm" if left else "lm"); td.text((ax, y), nm, font=ft, fill=C["ink"] + (235,), anchor="rm" if left else "lm")
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/east_geo_ref.png", optimize=True)
print("wrote assets/east_land.png, assets/media/east_geo_ref.png, east_rivers.json", len(lakes), "lakes", len(shimmer), "river paths")
