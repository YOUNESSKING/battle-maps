"""Geography layers for the Gettysburg maps `getty` (z14, 7.3 m/px) and `getty15` (z15, 3.7 m/px), make_geo_layer "ref" look.
OSM data: assets/src/getty_osm.json (tools/make_getty_osm.py, OSM API 0.6; (c) OpenStreetMap contributors, ODbL).
Only the 1863 roads (the town's "spokes": modern roads on their line, checked against the 1863 Bachelder / Warren maps and the NPS +
ABT battle maps), the 1858 Gettysburg Railroad east of town, streams (Rock Creek, Marsh Creek, Willoughby Run, Plum Run, Stevens Run,
Spangler Spring Run + small unnamed ones faint), the 1863 town (a compact block pattern of the old street grid; no modern suburbs).
Story places are NOT burnt in: they are in assets/media/getty_places.json for the scenes' small white-box labels.
usage (from meade/): python3 tools/make_getty_geo.py
-> assets/media/{getty,getty15}_geo_ref.png   (5760x3240, shown at 2880x1620; put ABOVE the territory layer)
-> assets/media/{getty,getty15}_roads.json    {name: [[x, y], ...] polylines in map px}
-> assets/media/{getty,getty15}_rivers.json   streams (map px) for the living-map shimmer
-> assets/media/getty_places.json             {key: {"name", "ll": [lat, lon], "getty": [x, y], "getty15": [x, y] | null}}"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = json.load(open("assets/src/getty_osm.json")); WAYS = list(D["ways"].values())
FONT = "tools/oswald-latin-700-normal.ttf"

def sel(name=None, ref=None, lon=(-99, 0), lat=(0, 99), hw=True):
    out = []
    for w in WAYS:
        t = w["tags"]
        if hw and "highway" not in t: continue
        if name and t.get("name") not in (name if isinstance(name, tuple) else (name,)): continue
        if ref and ref not in (t.get("ref") or ""): continue
        g = [p for p in w["geom"] if lon[0] <= p[1] <= lon[1] and lat[0] <= p[0] <= lat[1]]
        if len(g) > 1: out.append(g)
    return out

SQ = (39.8309, -77.2311)   # the Diamond (Lincoln Square), centre of the 1863 town
# 1863 roads <- modern roads on their line
ROADS = {
    "chambersburg_pike": sel(("Chambersburg Road", "Chambersburg Street")),                         # US 30 west (Cashtown, Lee's approach)
    "york_pike": sel(("York Road", "York Street")),                                                  # US 30 east
    "mummasburg_road": sel(("Mummasburg Road", "Mummasburg Street")),
    "carlisle_road": sel(ref="PA 34", lat=(39.8315, 99)) + sel("Carlisle Street", lat=(39.8315, 99)),  # north (Ewell's approach)
    "harrisburg_road": sel(("Old Harrisburg Road", "Harrisburg Street")),                            # northeast, Barlow's Knoll
    "hanover_road": sel(ref="PA 116", lon=(-77.2300, 0)) + sel(("Hanover Road", "East Hanover Street", "Hanover Street")),
    "fairfield_road": sel(("Fairfield Road", "West Middle Street")),                                 # the Hagerstown (Fairfield) road
    "baltimore_pike": sel(("Baltimore Pike", "Baltimore Street"), lat=(0, 39.8309)),
    "taneytown_road": sel("Taneytown Road"),
    "emmitsburg_road": sel(("Emmitsburg Road", "Steinwehr Avenue")),
    "wheatfield_road": sel(("Wheatfield Road", "Millerstown Road")),                                # the Peach Orchard - Wheatfield road
    "granite_schoolhouse": sel("Granite Schoolhouse Lane"),                                         # Taneytown Rd - Baltimore Pike (behind the line)
}
MAIN = {"chambersburg_pike", "york_pike", "baltimore_pike", "taneytown_road", "emmitsburg_road", "carlisle_road", "harrisburg_road",
        "hanover_road", "fairfield_road", "mummasburg_road"}
RAIL = sel("Hanover Subdivision", hw=False, lon=(-77.2290, 0), lat=(0, 39.8400))   # the Gettysburg Railroad (1858) east to Hanover
# Junction (only east of the depot: the line west of town through the railroad cut was finished only in the 1880s)

def _d(a, b): return math.hypot((a[0] - b[0]) * 111.0, (a[1] - b[1]) * 85.3)   # km
def join(segs, tol=0.30):
    """close small gaps between the pieces of one road (OSM splits ways at bridges / town limits)"""
    ends = [(i, g[0]) for i, g in enumerate(segs)] + [(i, g[-1]) for i, g in enumerate(segs)]
    extra = []
    for a in range(len(ends)):
        best = None
        for b in range(len(ends)):
            if ends[a][0] == ends[b][0]: continue
            dd = _d(ends[a][1], ends[b][1])
            if 0.004 < dd < tol and (best is None or dd < best[0]): best = (dd, ends[b][1])
        if best: extra.append([ends[a][1], best[1]])
    return segs + extra
# hand joins in the town (the modern one-way streets leave gaps; 1863 the spokes all met in the town grid)
HANDJ = {
    "chambersburg_pike": [[39.8346, -77.2447], [39.8326, -77.2408], [39.8309, -77.2367]],
    "mummasburg_road": [[39.8381, -77.2356], [39.8352, -77.2331]],
    "mummasburg_town": [[39.8337, -77.2320], [39.8318, -77.2312]],
}
for _k, _v in HANDJ.items(): ROADS[_k.replace("_town", "_road")].append(_v)
for _k in ROADS: ROADS[_k] = join(ROADS[_k])
# 1863: the Taneytown Road met the Emmitsburg Road at the foot of Cemetery Hill: join its north end to the nearest Emmitsburg point
_tn = max((p for g in ROADS["taneytown_road"] for p in g), key=lambda p: p[0])
ROADS["taneytown_road"].append([_tn, min((p for g in ROADS["emmitsburg_road"] for p in g), key=lambda p: _d(p, _tn))])
TOWN_BOX = (39.8262, 39.8360, -77.2395, -77.2245)  # 1863 town: about 10 blocks around the Diamond (~2,400 people)
TOWN_STREETS = []
for w in WAYS:
    t = w["tags"]
    if t.get("highway") in ("residential", "tertiary", "secondary", "primary", "trunk", "unclassified"):
        g = [p for p in w["geom"] if TOWN_BOX[0] <= p[0] <= TOWN_BOX[1] and TOWN_BOX[2] <= p[1] <= TOWN_BOX[3]]
        if len(g) > 1: TOWN_STREETS.append(g)
# town outline (the 1863 built-up area, approx. from the 1858 Adams County map + Bachelder's map)
TOWN = [(39.8360, -77.2350), (39.8352, -77.2290), (39.8340, -77.2255), (39.8318, -77.2245), (39.8290, -77.2252), (39.8268, -77.2275),
        (39.8262, -77.2310), (39.8268, -77.2350), (39.8282, -77.2385), (39.8305, -77.2395), (39.8330, -77.2390), (39.8350, -77.2375)]
STREAMS = {"Rock Creek": 7, "Marsh Creek": 7, "Willoughby Run": 5, "Plum Run": 5, "Stevens Run": 4, "Spangler Spring Run": 4,
           "Pitzer Run": 3, "White Run": 4, "Rose Run": 3, "Guinn Run": 3, "Winebrenner Run": 3, "Plum Creek": 4}

# story places (coordinates checked against OSM historic nodes = NPS monument / farm positions; see research/FACT_NOTES_getty.md)
PLACES = {
    "gettysburg": ("GETTYSBURG", SQ),
    "leister": ("LEISTER HOUSE", (39.8145, -77.2321)),          # OSM "Leister House" building; NPS Meade HQ monument 39.8145,-77.2323
    "angle": ("THE ANGLE", (39.8134, -77.2364)),               # OSM/NPS "The Angle" memorial
    "copse": ("COPSE OF TREES", (39.8127, -77.2357)),          # ~70 m S of the Angle (NPS High Water Mark)
    "cemetery_hill": ("CEMETERY HILL", (39.8217, -77.2295)),   # OSM peak; Evergreen gatehouse 39.8208,-77.2293
    "east_cemetery_hill": ("EAST CEMETERY HILL", (39.8222, -77.2275)),
    "culps_hill": ("CULP'S HILL", (39.8198, -77.2211)),        # OSM peak
    "cemetery_ridge": ("CEMETERY RIDGE", (39.8060, -77.2355)), # label point: mid-ridge (1st Minnesota / Hancock wounded area)
    "seminary_ridge": ("SEMINARY RIDGE", (39.8140, -77.2510)), # label point: Pickett's Division monument area
    "seminary": ("LUTHERAN SEMINARY", (39.8315, -77.2445)),
    "little_round_top": ("LITTLE ROUND TOP", (39.7918, -77.2362)),  # OSM node 39.7911,-77.2357; Warren statue 39.7925,-77.2367
    "big_round_top": ("BIG ROUND TOP", (39.7867, -77.2394)),   # OSM peak
    "devils_den": ("DEVIL'S DEN", (39.7914, -77.2426)),        # OSM
    "wheatfield": ("THE WHEATFIELD", (39.7968, -77.2440)),     # between Rose Woods (39.7952,-77.2446) and Trostle Woods
    "peach_orchard": ("THE PEACH ORCHARD", (39.8010, -77.2482)),  # Sherfy orchard SE of the house (39.8038,-77.2491); McGilvery mon. 39.8009,-77.2476
    "trostle": ("TROSTLE FARM", (39.8017, -77.2421)),
    "plum_run_gap": ("PLUM RUN", (39.8040, -77.2385)),         # McGilvery's Plum Run line (mon. 39.8040,-77.2347); Willard KIA 39.8064,-77.2391
    "codori": ("CODORI FARM", (39.8109, -77.2404)),
    "spanglers_spring": ("SPANGLER'S SPRING", (39.8145, -77.2173)),
    "powers_hill": ("POWERS HILL", (39.8060, -77.2211)),
    "benners_hill": ("BENNER'S HILL", (39.8260, -77.2143)),
    "mcpherson_ridge": ("McPHERSON'S RIDGE", (39.8370, -77.2513)),  # E. McPherson barn
    "barlows_knoll": ("BARLOW'S KNOLL", (39.8450, -77.2265)),
    "oak_hill": ("OAK HILL", (39.8457, -77.2450)),
}

def layer(base):
    J = json.load(open(f"assets/{base}.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]; S = 2
    W, H = J["size"][0] * S, J["size"][1] * S
    k = 2 if base == "getty15" else 1          # line widths scale with the zoom
    def P(lat, lon, s=S):
        n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    # town: soft pale block + the old street grid in dark
    tl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(tl)
    td.polygon([P(*q) for q in TOWN], fill=(196, 186, 160, 70))
    im.alpha_composite(tl.filter(ImageFilter.GaussianBlur(6 * k)))
    for g in TOWN_STREETS: d.line([P(*p) for p in g], fill=(34, 30, 24, 150), width=2 * k, joint="curve")
    # streams
    rivers = []
    for w in WAYS:
        t = w["tags"]
        if t.get("waterway") not in ("stream", "river"): continue
        nm = t.get("name"); wd = STREAMS.get(nm, 0)
        g = [P(*p) for p in w["geom"]]
        if wd:
            d.line(g, fill=(70, 120, 160, 230), width=wd * k, joint="curve")
            rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in g[::2] + [g[-1]]])
        else:
            d.line(g, fill=(70, 120, 160, 110), width=2 * k, joint="curve")
    # railroad: thin dark line with ties
    for g in RAIL:
        pts = [P(*p) for p in g]; d.line(pts, fill=(30, 26, 22, 190), width=2 * k)
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            L = math.hypot(x1 - x0, y1 - y0); nx, ny = (-(y1 - y0) / (L or 1), (x1 - x0) / (L or 1)); m = int(L // (14 * k))
            for i in range(m):
                cx, cy = x0 + (x1 - x0) * i / max(m, 1), y0 + (y1 - y0) * i / max(m, 1)
                d.line((cx - nx * 4 * k, cy - ny * 4 * k, cx + nx * 4 * k, cy + ny * 4 * k), fill=(30, 26, 22, 170), width=k)
    # 1863 roads: thin dark lines (spokes a little wider), faint light edge so they read on the grey relief
    for name, segs in ROADS.items():
        wd = (5 if name in MAIN else 3) * k
        for g in segs: d.line([P(*p) for p in g], fill=(205, 196, 170, 60), width=wd + 3 * k, joint="curve")
    for name, segs in ROADS.items():
        wd = (5 if name in MAIN else 3) * k
        for g in segs: d.line([P(*p) for p in g], fill=(30, 26, 20, 215), width=wd, joint="curve")
    # town label (the only town)
    ft = ImageFont.truetype(FONT, 44 * k if base == "getty" else 60)
    x, y = P(*SQ)
    halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo); txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); tx = ImageDraw.Draw(txt)
    lx, ly = (x + 150, y - 120) if base == "getty" else (x - 40, y - 70)
    if 0 < ly < H - 40:
        hd.text((lx, ly), "GETTYSBURG", font=ft, fill=(10, 14, 16, 230), anchor="lm"); tx.text((lx, ly), "GETTYSBURG", font=ft, fill=(240, 236, 226, 240), anchor="lm")
        im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(5))); im.alpha_composite(txt)
    im.save(f"assets/media/{base}_geo_ref.png", optimize=True)
    P1 = lambda la, lo: [round(v, 1) for v in P(la, lo, s=1)]
    json.dump({n: [[P1(*p) for p in g] for g in segs] for n, segs in ROADS.items()}, open(f"assets/media/{base}_roads.json", "w"), separators=(",", ":"))
    json.dump(rivers, open(f"assets/media/{base}_rivers.json", "w"), separators=(",", ":"))
    return P1, J["size"]

if __name__ == "__main__":
    out = {key: {"name": nm, "ll": list(ll)} for key, (nm, ll) in PLACES.items()}
    for base in ("getty", "getty15"):
        P1, (Wm, Hm) = layer(base)
        for key, (nm, ll) in PLACES.items():
            p = P1(*ll); out[key][base] = p if (0 <= p[0] <= Wm and 0 <= p[1] <= Hm) else None
        print("wrote", base)
    json.dump(out, open("assets/media/getty_places.json", "w"), indent=0)
    print({k: (v["getty"], v["getty15"]) for k, v in out.items()})
