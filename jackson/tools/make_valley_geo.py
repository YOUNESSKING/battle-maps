"""Geography layer for the `valley` (z10) and `portrep` (z12) basemaps (Jackson #11, MOVE 1 agent): make_geo_layer "ref" look,
thin blue rivers (real OSM geometry: North + South Fork of the Shenandoah, the Shenandoah, the Potomac, North River, South River;
assets/src/valley_rivers_osm.json via tools/make_valley_osm.py; Data (c) OpenStreetMap contributors, ODbL), BIG towns only
(1862 names), the 1862 roads of the story as faint lines, small labels that never collide.
Story places (Front Royal, Strasburg, New Market, Luray, Kernstown, McDowell, Cross Keys, Port Republic, Williamsport) are NOT
drawn here: the scenes put them in small white boxes (coordinates in PLACES, checked: see research/FACT_NOTES_valley.md).
usage (from jackson/): python3 tools/make_valley_geo.py [valley|portrep] [--check]
 -> assets/media/<base>_geo_ref.png (5760x3240, show at 2880x1620, ABOVE the territory layer)
 -> assets/media/<base>_geo.json {"places": {...}, "rivers": {...}, "roads": {...}, "massanutten": [...]} map px (2880x1620)"""
import json, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = sys.argv[1] if len(sys.argv) > 1 else "valley"
J = json.load(open(f"assets/{BASE}.json")); z, (ox, oy), S = J["zoom"], J["origin_world_px"], 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)

# story places (lat, lon): USGS GNIS town centres; battlefields per NPS / ABT (see FACT_NOTES_valley.md)
PLACES = dict(winchester=(39.1857, -78.1633), kernstown=(39.1415, -78.1833), kernstown_bf=(39.1480, -78.1990), newtown=(39.0834, -78.2181),
    middletown=(39.0276, -78.2803), strasburg=(38.9887, -78.3586), frontroyal=(38.9182, -78.1944), cedarville=(38.9890, -78.1830),
    woodstock=(38.8818, -78.5056), edinburg=(38.8210, -78.5653), mtjackson=(38.7457, -78.6417), newmarket=(38.6479, -78.6714),
    luray=(38.6654, -78.4594), harrisonburg=(38.4496, -78.8689), crosskeys=(38.3557, -78.8364), portrepublic=(38.2954, -78.8100),
    conradsstore=(38.4079, -78.6236), staunton=(38.1496, -79.0717), mcdowell=(38.3307, -79.4931), franklin=(38.6429, -79.3317),
    wardensville=(39.0759, -78.5944), williamsport=(39.6006, -77.8205), martinsburg=(39.4562, -77.9639), harpersferry=(39.3254, -77.7389),
    charlestown=(39.2890, -77.8597), washington=(38.8951, -77.0364), fredericksburg=(38.3032, -77.4605), warrenton=(38.7135, -77.7953),
    manassas=(38.7509, -77.4753), whitehousebr=(38.6560, -78.5080), columbiabr=(38.5590, -78.5800), lewis=(38.2990, -78.7820),
    signalknob=(38.9534, -78.3222))
# the Massanutten crest, north (Signal Knob) -> south end (above Keezletown), checked on the HD relief
MASS = [(38.952, -78.312), (38.890, -78.370), (38.830, -78.420), (38.780, -78.445), (38.735, -78.497), (38.695, -78.545),
        (38.655, -78.595), (38.603, -78.632), (38.555, -78.668), (38.505, -78.690), (38.467, -78.721)]
# 1862 roads of the story (lat, lon), through the towns they joined
ROADS = {
    "pike": ["staunton", "harrisonburg", "newmarket", "mtjackson", "edinburg", "woodstock", "strasburg", "middletown", "newtown", "kernstown",
             "winchester", "martinsburg", "williamsport"],
    "gap": ["newmarket", (38.646, -78.600), (38.650, -78.540), "luray"],                      # New Market - Luray: the one road over the mountain
    "luray_fr": ["luray", (38.745, -78.390), (38.840, -78.280), "frontroyal"],                  # Luray valley road (east of the mountain)
    "fr_win": ["frontroyal", "cedarville", (39.080, -78.175), "winchester"],                   # Front Royal - Winchester road
    "fr_str": ["frontroyal", (38.960, -78.270), "strasburg"],                                 # Front Royal - Strasburg road
    "luray_south": ["luray", (38.560, -78.560), "conradsstore", "lewis", "portrepublic"],     # east-side road south to Port Republic
    "hb_pr": ["harrisonburg", "crosskeys", "portrepublic"],                                    # Harrisonburg - Cross Keys - Port Republic
    "staunton_mcd": ["staunton", (38.230, -79.250), "mcdowell"],                               # Staunton - Parkersburg pike to McDowell
    "str_ward": ["strasburg", (39.020, -78.470), "wardensville"],                              # Frémont's road from the west
}
def ll(q): return PLACES[q] if isinstance(q, str) else q

def merge(lines, mouth):
    segs = [[(la, lo) for lo, la in l] for l in lines if len(l) > 1]
    d = lambda a, b: math.hypot(a[0] - b[0], (a[1] - b[1]) * 0.78)
    _, i, e = min(((d(s[e], mouth), i, e) for i, s in enumerate(segs) for e in (0, -1)))
    cur = segs.pop(i); chain = list(cur if e == 0 else cur[::-1])
    while segs:
        tip = chain[-1]
        k, e2, dd = min(((k, e2, d(s[e2], tip)) for k, s in enumerate(segs) for e2 in (0, -1)), key=lambda q: q[2])
        if dd > 0.03: break
        s = segs.pop(k); chain += (s if e2 == 0 else s[::-1])[1:]
    return chain[::-1]   # source -> mouth
MOUTH = {"nfork": (38.944, -78.188), "sfork": (38.944, -78.188), "shen": (39.323, -77.726), "potomac": (37.87, -76.16),
         "north": (38.296, -78.808), "south": (38.296, -78.808)}
R = json.load(open("assets/src/valley_rivers_osm.json"))
rivers = {k: merge(R[k], MOUTH[k]) for k in MOUTH}

C = dict(river=(96, 150, 190, 245), ink=(240, 236, 226), halo=(10, 14, 16), rlab=(150, 195, 230), road=(214, 196, 150, 120))
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
k = 1 if BASE == "valley" else 2.2
for key, pts in ROADS.items():
    d.line([P(*ll(q)) for q in pts], fill=C["road"], width=int(3 * k), joint="curve")
WID = {"potomac": 8, "shen": 7, "nfork": 6, "sfork": 6, "north": 4, "south": 4}
out = {"places": {}, "rivers": {}, "roads": {}, "massanutten": [[round(v, 1) for v in P(*q, 1)] for q in MASS]}
def thin(line, step):
    pm = [P(la, lo, 1) for la, lo in line]; o, last = [], None
    for x, y in pm:
        if last is None or math.hypot(x - last[0], y - last[1]) > step: o.append([round(x, 1), round(y, 1)]); last = (x, y)
    o.append([round(pm[-1][0], 1), round(pm[-1][1], 1)]); return o
for key, line in rivers.items():
    d.line([P(la, lo) for la, lo in line], fill=C["river"], width=int(WID[key] * (1 if k == 1 else 1.8)), joint="curve")
    t = thin(line, 4); out["rivers"][key] = [q for q in t if -50 < q[0] < 2930 and -50 < q[1] < 1670]
out["places"] = {n: [round(v, 1) for v in P(*q, 1)] for n, q in PLACES.items()}
for key, pts in ROADS.items():
    out["roads"][key] = [[round(v, 1) for v in P(*ll(q), 1)] for q in pts]

TOWNS = [("Washington", 38.8951, -77.0364, 600), ("Winchester", 39.1857, -78.1633, 80), ("Harrisonburg", 38.4496, -78.8689, 60),
         ("Staunton", 38.1496, -79.0717, 70), ("Martinsburg", 39.4562, -77.9639, 50), ("Hagerstown", 39.6418, -77.7200, 55),
         ("Frederick", 39.4143, -77.4105, 80), ("Alexandria", 38.8048, -77.0469, 120), ("Leesburg", 39.1157, -77.5636, 20),
         ("Fredericksburg", 38.3032, -77.4605, 50), ("Warrenton", 38.7135, -77.7953, 15), ("Culpeper", 38.4732, -77.9967, 15)]
if BASE == "portrep": TOWNS = [("Harrisonburg", 38.4496, -78.8689, 60)]
fs = 30 if BASE == "valley" else 40
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", fs); fr = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", fs - 4)
txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
taken, shown = [], []
def free(b): return all(b[2] < a[0] or b[0] > a[2] or b[3] < a[1] or b[1] > a[3] for a in taken)
for nm, lat, lon, pop in sorted(TOWNS, key=lambda q: -q[3]):
    x, y = P(lat, lon)
    if not (20 <= x < W - 20 and 20 <= y < H - 20): continue
    r = 6; lab = nm.upper()
    anc, tx = ("rm", x - r - 6) if nm in ("Alexandria", "Winchester", "Martinsburg") else ("lm", x + r + 6)
    if nm == "Alexandria": y += 18
    tb = td.textbbox((tx, y), lab, font=ft, anchor=anc)
    b = (tb[0] - 10, tb[1] - 8, tb[2] + 10, tb[3] + 8)
    if not free(b): continue
    td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=C["halo"] + (170,))
    taken.append(b); shown.append(nm)
    hd.text((tx, y), lab, font=ft, fill=C["halo"] + (220,), anchor=anc); td.text((tx, y), lab, font=ft, fill=C["ink"] + (240,), anchor=anc)
RLAB = {"valley": [("P O T O M A C", "potomac", 39.55, -77.80, 1), ("N O R T H   F O R K", "nfork", 38.80, -78.56, -1),
                   ("S O U T H   F O R K", "sfork", 38.75, -78.36, 1), ("S H E N A N D O A H", "shen", 39.17, -77.95, -1)],
        "portrep": [("S O U T H   F O R K", "sfork", 38.355, -78.735, 1), ("N O R T H   R I V E R", "north", 38.335, -78.89, -1),
                    ("S O U T H   R I V E R", "south", 38.245, -78.835, 1)]}[BASE]
for lab, key, lat, lon, side in RLAB:
    pts = [P(la, lo) for la, lo in rivers[key]]; q = P(lat, lon)
    i = min(range(len(pts)), key=lambda k2: math.hypot(pts[k2][0] - q[0], pts[k2][1] - q[1]))
    a, b = pts[max(0, i - 25)], pts[min(len(pts) - 1, i + 25)]
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    nx, ny = -math.sin(math.radians(ang)), math.cos(math.radians(ang))
    cx, cy = pts[i][0] + nx * 34 * side, pts[i][1] + ny * 34 * side
    tw = int(td.textlength(lab, font=fr)) + 40
    for layer, col in ((halo, C["halo"] + (210,)), (txt, C["rlab"] + (240,))):
        t = Image.new("RGBA", (tw, 70), (0, 0, 0, 0)); ImageDraw.Draw(t).text((tw / 2, 35), lab, font=fr, fill=col, anchor="mm")
        t = t.rotate(-ang, resample=Image.BICUBIC, expand=True)
        layer.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save(f"assets/media/{BASE}_geo_ref.png", optimize=True)
json.dump(out, open(f"assets/media/{BASE}_geo.json", "w"), separators=(",", ":"))
print("wrote", BASE, "towns:", shown, "rivers:", {k: len(v) for k, v in out["rivers"].items()})
if "--check" in sys.argv:   # debug: basemap + layer + every story place as a red dot with its key
    bg = Image.open(f"assets/{BASE}_hd_ref.jpg").convert("RGBA"); bg.alpha_composite(im); dd = ImageDraw.Draw(bg)
    for n, q in PLACES.items():
        x, y = P(*q); dd.ellipse((x - 7, y - 7, x + 7, y + 7), fill=(255, 40, 40)); dd.text((x + 10, y - 24), n, font=fr, fill=(255, 230, 120))
    dd.line([P(*q) for q in MASS], fill=(255, 200, 0), width=4)
    bg.convert("RGB").resize((W // 2, H // 2)).save(f"/tmp/claude-0/-home-user-battle-maps/d5e75307-9856-5b7c-823e-84e1dfcbfe1e/scratchpad/{BASE}_check.jpg", quality=85)
