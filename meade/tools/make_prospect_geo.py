"""Geography layer for the `prospect` map (Meade #12 MOVE 1 close-up: Fredericksburg town south to Hamilton's Crossing, z14, 7.5 m/px),
the make_geo_layer.py "ref" look. OSM data from tools/make_prospect_osm.py (assets/src/prospect_osm.json, (c) OpenStreetMap contributors,
ODbL). Only the 1862 roads are drawn (modern roads on their line, see ROADS); no modern suburbs. Fredericksburg = the only town.
usage (from meade/): python3 tools/make_prospect_geo.py
-> assets/media/prospect_geo_ref.png   (5760x3240, shown at 2880x1620): Rappahannock, Deep Run / Hazel Run / Massaponax, the RF&P,
                                       the Richmond Stage Road, Mine Road, the Military Road, Lansdowne Road, Telegraph Road, the town
-> assets/media/prospect_woods.png     1862 woods on Jackson's ridge (2880x1620, soft dark crowns): the wooded ridge from Hamilton's
                                       Crossing to Deep Run + the swampy TONGUE of woods across the railroad (the gap)
-> assets/media/prospect_tongue.png    the tongue of woods alone (for a glow-in at move1-4)
-> assets/media/prospect_data.json     {places, roads, rr, rivers, streams, tongue, lines} in map px (2880x1620)
Positions checked against NPS FRSP (Prospect Hill stop 38.2481N 77.4357W; Union Breakthrough stop 38.2538N 77.4479W), the Meade
Pyramid on the RF&P (38.2525N 77.4379W, marks where Meade's men crossed into the gap), Pelham's Corner (38.2528N 77.4263W, HMDB N-3),
ABT Slaughter Pen Farm + the Fredericksburg (Prospect Hill) battle maps. See research/FACT_NOTES_prospect.md."""
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/prospect.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
D = json.load(open("assets/src/prospect_osm.json"))
WAYS = list(D["ways"].values())
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)
P1 = lambda la, lo: [round(v, 1) for v in P(la, lo, s=1)]
C = dict(river=(96, 150, 190, 245), stream=(80, 128, 160, 150), road=(226, 214, 186, 205), casing=(16, 14, 10, 150),
         rail=(30, 26, 20, 230), railtick=(222, 210, 182, 230), ink=(240, 236, 226), halo=(10, 14, 16))

def sel(name=None, lat=(0, 99), lon=(-99, 0), key="highway"):
    out = []
    for w in WAYS:
        t = w["tags"]
        if key not in t: continue
        if name and t.get("name") != name: continue
        g = [p for p in w["geom"] if lat[0] <= p[0] <= lat[1] and lon[0] <= p[1] <= lon[1]]
        if len(g) > 1: out.append(g)
    return out
# ---- the 1862 roads on their modern line (NPS FRSP battle maps, the 1863 Michler/Weyss survey of the field)
ROADS = {
    "stage": sel("Tidewater Trail") + sel("Dixon Street", lat=(38.27, 38.31)),      # Richmond Stage Road (Bowling Green Road), VA 2
    "telegraph": sel("Lafayette Boulevard", lat=(38.25, 38.302)),                 # Telegraph Road past Marye's Heights + Lee's Hill
    "mine": sel("Mine Road") + sel("Benchmark Road", lat=(38.236, 38.26)),        # Mine Road: Telegraph Rd - Hamilton's Crossing - Stage Rd
    "military": sel("Lee Drive"),                                                  # Lee's Military Road behind the line (Lee Drive follows it)
    "lansdowne": sel("Lansdowne Road"),
}
rr = sel("CSX RF&P Subdivision", key="railway")
# keep the main line south of the town only (one track: drop the parallel second track)
rr_main = max(rr, key=len)

im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
STREAMS = ("Deep Run", "Hazel Run", "Massaponax Creek", "Claiborne Run")
streams, rivers = {}, []
for w in WAYS:
    t = w["tags"]
    if t.get("waterway") == "stream" and t.get("name") in STREAMS:
        d.line([P(*p) for p in w["geom"]], fill=C["stream"], width=4, joint="curve")
        streams.setdefault(t["name"], []).append([P1(*p) for p in w["geom"]])
for w in WAYS:
    t = w["tags"]
    if t.get("waterway") == "river":
        g = [P(*p) for p in w["geom"]]; d.line(g, fill=C["river"], width=22, joint="curve")
        rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in g[::2] + [g[-1]]])
segs = [g for v in ROADS.values() for g in v]
for g in segs: d.line([P(*p) for p in g], fill=C["casing"], width=13, joint="curve")
for g in segs: d.line([P(*p) for p in g], fill=C["road"], width=6, joint="curve")
# the RF&P: dark line with light cross-ticks (period railroad symbol)
for g in rr:
    pts = [P(*p) for p in g]; d.line(pts, fill=C["rail"], width=8, joint="curve")
pts = [P(*p) for p in rr_main]; acc = 0
for a, b in zip(pts, pts[1:]):
    L = math.hypot(b[0] - a[0], b[1] - a[1]); ux, uy = (b[0] - a[0]) / (L or 1), (b[1] - a[1]) / (L or 1); s = acc
    while s < acc + L:
        k = s - acc; x, y = a[0] + ux * k, a[1] + uy * k
        if int(s / 34) % 2 == 0: d.line((x - uy * 7, y + ux * 7, x + uy * 7, y - ux * 7), fill=C["railtick"], width=3)
        s += 34
    acc += L
# Fredericksburg: the only town on the map
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 46)
x, y = P(38.3032, -77.4605); r = 10
halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo); txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt)
hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=C["halo"] + (170,)); td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,))
hd.text((x + r + 14, y - 4), "FREDERICKSBURG", font=ft, fill=C["halo"] + (220,), anchor="lm"); td.text((x + r + 14, y - 4), "FREDERICKSBURG", font=ft, fill=C["ink"] + (235,), anchor="lm")
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/prospect_geo_ref.png", optimize=True)

# ---- 1862 woods: Jackson's ridge was wooded from Hamilton's Crossing to Deep Run, the plain open farmland; the boggy tongue of woods
# jutted east across the railroad between Lane and Archer (NPS wayside; the Meade Pyramid stands at its railroad crossing)
RIDGE = [[38.2440, -77.4300], [38.2470, -77.4325], [38.2500, -77.4372], [38.2556, -77.4405], [38.2600, -77.4440], [38.2650, -77.4490],
         [38.2700, -77.4545], [38.2740, -77.4580], [38.2735, -77.4680], [38.2650, -77.4700], [38.2560, -77.4640], [38.2480, -77.4560],
         [38.2420, -77.4450], [38.2405, -77.4350]]
TONGUE = [[38.2508, -77.4420], [38.2500, -77.4390], [38.2507, -77.4360], [38.2522, -77.4338], [38.2541, -77.4334], [38.2556, -77.4349],
          [38.2560, -77.4378], [38.2556, -77.4410], [38.2548, -77.4440], [38.2528, -77.4450]]
def noise(scale, seed):
    r = np.random.default_rng(seed).random((1620 // scale + 2, 2880 // scale + 2)).astype(np.float32)
    return np.array(Image.fromarray((r * 255).astype(np.uint8)).resize((2880 + 2 * scale, 1620 + 2 * scale), Image.BICUBIC))[scale:scale + 1620, scale:scale + 2880] / 255.0
def woods(polys, seed, n_crowns, wet=False):
    mask = Image.new("L", (2880, 1620), 0); md = ImageDraw.Draw(mask)
    for pl in polys: md.polygon([P(*p, s=1) for p in pl], fill=255)
    m = np.array(mask.filter(ImageFilter.GaussianBlur(10)), np.float32) / 255
    m = np.clip((m + (noise(14, seed) - 0.5) * 0.6 - 0.2) * 2.4, 0, 1)
    rng = np.random.default_rng(seed)
    tex = Image.new("RGBA", (2880, 1620), (0, 0, 0, 0)); tdw = ImageDraw.Draw(tex)
    ys, xs = np.nonzero(np.array(mask) > 0)
    for i in rng.integers(0, len(xs), n_crowns):
        x, y = xs[i] + rng.uniform(-1, 1), ys[i] + rng.uniform(-1, 1); r = rng.uniform(1.6, 3.6)
        g = int(rng.uniform(46, 80)); tdw.ellipse((x - r, y - r, x + r, y + r), fill=(16, g, 28, int(rng.uniform(170, 235))))
    if wet:   # bog: short light-blue reed strokes and standing-water glints
        for i in rng.integers(0, len(xs), 1800):
            x, y = xs[i], ys[i]; tdw.line((x - 2.5, y, x + 2.5, y), fill=(120, 170, 200, 170), width=1)
    arr = np.array(tex).astype(np.float32)
    base = np.zeros_like(arr); base[..., :3] = (18, 44, 26) if not wet else (20, 46, 44); base[..., 3] = 110
    a1 = arr[..., 3:] / 255; out = arr.copy(); out[..., :3] = arr[..., :3] * a1 + base[..., :3] * (1 - a1)
    out[..., 3] = np.maximum(arr[..., 3], base[..., 3]) * m * 0.85
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA")
woods([RIDGE], 3, 26000).save("assets/media/prospect_woods.png", optimize=True)
woods([TONGUE], 5, 3500, wet=True).save("assets/media/prospect_tongue.png", optimize=True)

# ---- data for the scenes (map px, 2880x1620)
PLACES = {
    "fredericksburg": (38.3032, -77.4605), "stone_wall": (38.2955, -77.4685), "maryes": (38.2948, -77.4728), "lees_hill": (38.2850, -77.4763),
    "prospect": (38.2481, -77.4357), "pyramid": (38.2525, -77.4379), "breakthrough": (38.2538, -77.4479), "bernard": (38.2597, -77.4543),
    "pelham": (38.2528, -77.4263), "slaughter_pen": (38.2590, -77.4320), "hamilton": (38.2462, -77.4318), "deep_run_mouth": (38.2795, -77.4245),
    "smithfield": (38.2700, -77.4205), "franklin_x": (38.2805, -77.4275), "bridge_up": (38.3085, -77.4570), "bridge_mid": (38.3015, -77.4535),
    "bridge_low": (38.2965, -77.4500),
}
lines = {
    # Union line before the attack: Franklin on the plain along the Stage Road (Pelham's Corner - Deep Run), Sumner in the town
    "us_franklin": [(38.2540, -77.4252), (38.2600, -77.4300), (38.2660, -77.4352), (38.2720, -77.4400), (38.2775, -77.4440)],
    "us_town": [(38.3075, -77.4665), (38.3030, -77.4650), (38.2985, -77.4625), (38.2950, -77.4590)],
}
# Confederate front, 13 Dec morning (NPS / ABT maps): Hamilton's Crossing - Prospect Hill (Archer) along the RF&P - the gap - Lane along
# the railroad - Pender - Deep Run (Hood) - Lee's Hill - Marye's Heights (the stone wall) - Taylor's Hill; south -> north.
def rr_seg(la0, la1, off=0.0):   # the railroad between two latitudes, offset `off` px to the west (map px)
    g = [p for p in rr_main if la0 <= p[0] <= la1]; g.sort(key=lambda p: p[0])
    pts = [P(*p, s=1) for p in g]; out = []
    for i, q in enumerate(pts):
        a, b = pts[max(0, i - 1)], pts[min(len(pts) - 1, i + 1)]; dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
        nx, ny = dy / L, -dx / L          # left normal of the northward direction = west side
        out.append([round(q[0] + nx * off, 1), round(q[1] + ny * off, 1)])
    return out[::3] + [out[-1]]
def nearest_rr(la, lo):
    q = min(rr_main, key=lambda p: (p[0] - la) ** 2 + ((p[1] - lo) * 0.79) ** 2); return q
HC = nearest_rr(38.2462, -77.4318); PLACES["hamilton"] = tuple(HC)
cs_main = rr_seg(HC[0], 38.2720, 9) + [P1(38.2780, -77.4640), P1(38.2850, -77.4715), P1(38.2905, -77.4695), P1(38.2955, -77.4690), P1(38.3010, -77.4722), P1(38.3070, -77.4750)]
mil = sorted([p for g in ROADS["military"] for p in g if 38.2500 <= p[0] <= 38.2560 and -77.4512 <= p[1] <= -77.4440], key=lambda p: p[1])
lines_px = {k: [P1(*p) for p in v] for k, v in lines.items()}
lines_px.update({"cs_front": cs_main, "archer": rr_seg(HC[0] + 0.0012, 38.2506, 9), "gap": rr_seg(38.2506, 38.2556, 9),
                 "lane": rr_seg(38.2556, 38.2612, 9), "gregg": [P1(*p) for p in mil[::2]]})
data = {"places": {k: P1(*v) for k, v in PLACES.items()},
        "roads": {k: [[P1(*p) for p in g] for g in v] for k, v in ROADS.items()},
        "rr": [P1(*p) for p in rr_main][::2], "rivers": rivers, "streams": streams,
        "tongue": [P1(*p) for p in TONGUE], "lines": lines_px}
json.dump(data, open("assets/media/prospect_data.json", "w"))
print("roads", {k: len(v) for k, v in ROADS.items()}, "rr", len(rr_main), "rivers", len(rivers), "streams", list(streams))
# ---- snap the bridge sites onto the river line; Deep Run's mouth = the Deep Run end nearest the river; Franklin's two bridges just below it
riv = [q for g in rivers for q in g]
def snap(q): return min(riv, key=lambda r: (r[0] - q[0]) ** 2 + (r[1] - q[1]) ** 2)
dr = [q for g in streams["Deep Run"] for q in (g[0], g[-1])]
mouth = min(dr, key=lambda q: min((r[0] - q[0]) ** 2 + (r[1] - q[1]) ** 2 for r in riv))
data["places"]["deep_run_mouth"] = snap(mouth)
ri = riv.index(data["places"]["deep_run_mouth"])
for k in ("bridge_up", "bridge_mid", "bridge_low"): data["places"][k] = snap(data["places"][k])
data["places"]["franklin_x"] = riv[min(len(riv) - 1, ri + 2)] if riv[min(len(riv) - 1, ri + 2)][1] > mouth[1] else riv[max(0, ri - 2)]
json.dump(data, open("assets/media/prospect_data.json", "w"))
print("snapped", {k: data["places"][k] for k in ("deep_run_mouth", "franklin_x", "bridge_up", "bridge_mid", "bridge_low")})
