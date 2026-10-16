"""Geography layer + scene data for the `bullrun` close-up (z13, 38.815N 77.56W; Stonewall Jackson #11, MOVE 2 owner; the hook agent
reuses it read-only for First Bull Run / Henry Hill). make_geo_layer "ref" look: thin blue water, faint 1860s roads, the Manassas Gap
Railroad (dark line + ties) and the UNFINISHED RAILROAD (graded bed, dashed), small labels; story places are white boxes in the scenes.
Water: Bull Run / Broad Run / Cub Run = OSM geometry via Nominatim (assets/src/bullrun_nominatim.json; Overpass was down 2026-10-16);
small streams (Young's Branch, Catharpin Run, Holkum's Branch...) = traced from the HD elevation (tools/make_rivers_dem.py ->
assets/src/bullrun_dem_rivers.json). Roads + railroads: hand-traced through checked points (research/FACT_NOTES_nova.md): the 1862
Warrenton Turnpike = today's Lee Highway (US 29) Gainesville - Groveton - Stone House - Stone Bridge - Centreville; Manassas-Sudley Road
= VA 234 (old alignment); Manassas Gap RR = today's Norfolk Southern B-line Manassas - Gainesville - Haymarket - Thoroughfare Gap.
Data (c) OpenStreetMap contributors (ODbL); terrain Mapzen / AWS Terrain Tiles.
usage (from jackson/): python3 tools/make_bullrun_geo.py
 -> assets/media/bullrun_geo_ref.png (5760x3240, show at 2880x1620, ABOVE any territory layer)
 -> assets/media/bullrun_data.json {places, rivers (shimmer, map px), pike, sudley, mgrr, unfinished, labels}"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "bullrun"
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=1):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * s)

# ---- checked story places (lat, lon); sources in research/FACT_NOTES_nova.md ----
PLACES = dict(
    gainesville=(38.7961, -77.6126), haymarket=(38.8121, -77.6368), thoroughfare_gap=(38.8246, -77.7158), groveton=(38.8126, -77.5483),
    brawner=(38.8160, -77.5655), deep_cut=(38.8255, -77.5530), stone_house=(38.8124, -77.5278), stone_bridge=(38.8245, -77.5035),
    henry_hill=(38.8132, -77.5213), henry_house=(38.8148, -77.5227), chinn_ridge=(38.8095, -77.5327), matthews_hill=(38.8252, -77.5321),
    sudley_church=(38.8407, -77.5380), sudley_springs=(38.8412, -77.5378), battery_heights=(38.8119, -77.5572), dogan_house=(38.8129, -77.5493),
    centreville=(38.8388, -77.4316), manassas_jct=(38.7509, -77.4753), bristoe=(38.7225, -77.5405), catharpin=(38.8544, -77.5721),
    stony_ridge=(38.8300, -77.5800), new_market=(38.8050, -77.5800))
# ---- hand-traced 1862 roads / railroads (lat, lon), west/south -> east/north ----
PIKE = [(38.7710, -77.7000), (38.7840, -77.6500), (38.7961, -77.6126), (38.8030, -77.5900), (38.8078, -77.5700), (38.8105, -77.5580),
        (38.8126, -77.5483), (38.8126, -77.5380), (38.8124, -77.5278), (38.8150, -77.5180), (38.8205, -77.5090), (38.8245, -77.5035),
        (38.8290, -77.4900), (38.8330, -77.4700), (38.8370, -77.4480), (38.8388, -77.4316), (38.8460, -77.4000), (38.8550, -77.3600)]
SUDLEY = [(38.7509, -77.4753), (38.7650, -77.4850), (38.7800, -77.4990), (38.7950, -77.5120), (38.8050, -77.5220), (38.8124, -77.5278),
          (38.8200, -77.5320), (38.8300, -77.5350), (38.8412, -77.5378), (38.8544, -77.5721)]
MGRR = [(38.7509, -77.4753), (38.7560, -77.5050), (38.7640, -77.5350), (38.7740, -77.5650), (38.7850, -77.5900), (38.7935, -77.6115),
        (38.8040, -77.6260), (38.8115, -77.6360), (38.8180, -77.6600), (38.8220, -77.6900), (38.8246, -77.7158), (38.8300, -77.7400),
        (38.8420, -77.7600), (38.8625, -77.7741)]
OARR = [(38.7900, -77.3300), (38.7820, -77.3900), (38.7760, -77.4300), (38.7650, -77.4550), (38.7509, -77.4753), (38.7400, -77.5000),
        (38.7300, -77.5250), (38.7225, -77.5405), (38.7100, -77.5650), (38.6900, -77.6000)]
# the unfinished railroad (Independent Line of the Manassas Gap RR, graded 1850s, never laid): from near Gainesville NE past the Brawner
# farm (north of it), Stony Ridge, the Deep Cut, to Sudley; Jackson's line 28-30 Aug = Sudley Church -> Deep Cut -> Brawner farm area
UNFIN = [(38.7990, -77.6200), (38.8070, -77.6050), (38.8160, -77.5900), (38.8210, -77.5780), (38.8235, -77.5660), (38.8250, -77.5580),
         (38.8255, -77.5530), (38.8275, -77.5470), (38.8310, -77.5420), (38.8360, -77.5395), (38.8412, -77.5360), (38.8450, -77.5320)]

def chaikin(pts, k=3):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts
def px(line, s=1, smooth=True):
    pts = chaikin(line) if smooth else np.array(line, float)
    return [P(la, lo, s) for la, lo in pts]

im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
# ---- water ----
NM = json.load(open(f"assets/src/{BASE}_nominatim.json"))
def nlines(key):
    out = []
    for x in NM.get(key, []):
        if x["osm_type"] != "relation" or "river" not in x["type"] and "stream" not in x["type"]: continue
        g = x["geojson"]; out += g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    return [[(la, lo) for lo, la in l] for l in out]
shimmer = []
if os.path.exists(f"assets/src/{BASE}_dem_rivers.json"):
    for r in json.load(open(f"assets/src/{BASE}_dem_rivers.json")):
        if r["order"] >= 2 and len(r["pts"]) > 8:
            d.line([tuple(p) for p in r["pts"]], fill=(86, 136, 172, 110 if r["order"] == 2 else 150), width=3 if r["order"] == 2 else 4, joint="curve")
for key, wid in (("cubrun", 5), ("broadrun", 6), ("bullrun", 9)):
    for l in nlines(key):
        g = [P(la, lo, S) for la, lo in l]
        d.line(g, fill=(96, 150, 190, 240), width=wid, joint="curve")
        if len(g) > 6: shimmer.append([[round(x / S), round(y / S)] for x, y in g[::2] + [g[-1]]])
# ---- roads (faint, 1860s dirt roads) ----
for line, w in ((PIKE, 6), (SUDLEY, 4)):
    g = px(line, S); d.line(g, fill=(20, 16, 10, 120), width=w + 4, joint="curve"); d.line(g, fill=(222, 208, 176, 120), width=w, joint="curve")
# ---- railroads: dark line + ties; the unfinished one = a pale graded bed, dashed ----
def rail(line, s=S):
    g = px(line, s, smooth=False); d.line(g, fill=(16, 14, 10, 200), width=6, joint="curve"); d.line(g, fill=(196, 188, 170, 150), width=2)
    for a, b in zip(g[:-1], g[1:]):
        L = math.dist(a, b); ux, uy = (b[0] - a[0]) / (L or 1), (b[1] - a[1]) / (L or 1)
        for k in range(0, int(L), 22):
            x, y = a[0] + ux * k, a[1] + uy * k; d.line((x - uy * 7, y + ux * 7, x + uy * 7, y - ux * 7), fill=(16, 14, 10, 190), width=3)
rail(MGRR); rail(OARR)
gu = px(UNFIN, S)
acc = 0.0
for a, b in zip(gu[:-1], gu[1:]):          # dashes by cumulative length (16 on, 12 off, HD px)
    L = math.dist(a, b); ux, uy = (b[0] - a[0]) / (L or 1), (b[1] - a[1]) / (L or 1); k = 0.0
    while k < L:
        ph = (acc + k) % 28; on = ph < 16; e = min(L, k + ((16 - ph) if on else (28 - ph)))
        if on: d.line((a[0] + ux * k, a[1] + uy * k, a[0] + ux * e, a[1] + uy * e), fill=(214, 196, 150, 190), width=7)
        k = e + 1e-6
    acc += L
# ---- labels (small, along the feature) ----
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
def along(lab, line, lat, lon, off, col, smooth=True):
    pts = px(line, S, smooth); q = P(lat, lon, S)
    i = min(range(len(pts)), key=lambda k: math.dist(pts[k], q))
    a, b = pts[max(0, i - 3)], pts[min(len(pts) - 1, i + 3)]
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    nx, ny = -math.sin(math.radians(ang)), math.cos(math.radians(ang)); cx, cy = pts[i][0] + nx * off, pts[i][1] + ny * off
    tw = int(ImageDraw.Draw(txt).textlength(lab, font=ft)) + 40
    for layer, c in ((halo, (10, 14, 16, 220)), (txt, col)):
        t = Image.new("RGBA", (tw, 60), (0, 0, 0, 0)); ImageDraw.Draw(t).text((tw / 2, 30), lab, font=ft, fill=c, anchor="mm")
        t = t.rotate(-ang, resample=Image.BICUBIC, expand=True); layer.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
br = max(nlines("bullrun"), key=len) if nlines("bullrun") else None
if br: along("B U L L   R U N", br, 38.800, -77.4950, 34, (150, 195, 230, 240), smooth=False)
along("WARRENTON TURNPIKE", PIKE, 38.8050, -77.5850, 30, (232, 222, 196, 235))
along("MANASSAS GAP RAILROAD", MGRR, 38.7700, -77.5530, 30, (214, 206, 186, 225), smooth=False)
along("UNFINISHED RAILROAD", UNFIN, 38.8340, -77.5405, -30, (226, 206, 160, 240))
along("ORANGE & ALEXANDRIA RAILROAD", OARR, 38.7700, -77.4400, -30, (214, 206, 186, 225), smooth=False)
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
os.makedirs("assets/media", exist_ok=True)
im.save(f"assets/media/{BASE}_geo_ref.png", optimize=True)
r1 = lambda pts: [[round(x, 1), round(y, 1)] for x, y in pts]
data = {"places": {k: [round(v, 1) for v in P(*q)] for k, q in PLACES.items()}, "rivers": shimmer,
        "pike": r1(px(PIKE)), "sudley": r1(px(SUDLEY)), "mgrr": r1(px(MGRR, smooth=False)), "unfinished": r1(px(UNFIN))}
json.dump(data, open(f"assets/media/{BASE}_data.json", "w"), separators=(",", ":"))
print("wrote", BASE, "shimmer", len(shimmer), "places", {k: data["places"][k] for k in ("groveton", "brawner", "deep_cut", "stone_bridge", "thoroughfare_gap", "bristoe")})
