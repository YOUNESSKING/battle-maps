"""Geography layer for the `chanc` map (Jackson MOVE 3 close-up, z13, 15 m/px), the make_geo_layer.py "ref" look.
Overpass was down (500 / connection reset, 2026-10-16), so the OSM data came from the OSM API 0.6 map calls (tiles of 0.04 deg):
assets/src/chanc_osm.json (roads, waterways, historic nodes; (c) OpenStreetMap contributors, ODbL).
Only the 1863 roads are drawn (modern roads that follow them, see ROADS); no modern suburbs. Fredericksburg = the only big town.
usage (from jackson/): python3 tools/make_chanc_geo.py
-> assets/media/chanc_geo_ref.png      (5760x3240, shown at 2880x1620): rivers, streams, the 1863 roads, Fredericksburg
-> assets/media/chanc_wilderness.png   the Wilderness texture (dense second-growth woods, soft-edged, for a glow-in at move3-2)
-> assets/media/chanc_roads.json       {name: [polyline map px, ...]} for glows / labels
-> assets/media/chanc_route.json       Jackson's march, 2 May: Furnace Road -> Catharine Furnace -> south (Jackson Trail East) ->
                                       Jackson Trail West -> Brock Road north (across the Plank Road) -> the Orange Turnpike
-> assets/media/chanc_rivers.json      big rivers (map px) for the living-map shimmer"""
import json, math, heapq
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/chanc.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
D = json.load(open("assets/src/chanc_osm.json"))
def P(lat, lon, s=S):
    n = 256 * 2 ** z; r = math.radians(lat); return (((lon + 180) / 360 * n - ox) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy) * s)
C = dict(river=(96, 150, 190, 245), stream=(80, 128, 160, 120), road=(226, 214, 186, 200), casing=(16, 14, 10, 150), ink=(240, 236, 226), halo=(10, 14, 16))
WAYS = list(D["ways"].values())

# ---- 1863 roads <- the modern roads on their line (checked against the Hotchkiss 2 May map + NPS FRSP maps)
def sel(name=None, ref=None, lon=(-99, 0), lat=(0, 99)):
    out = []
    for w in WAYS:
        t = w["tags"]
        if "highway" not in t: continue
        if name and t.get("name") != name: continue
        if ref and ref not in (t.get("ref") or ""): continue
        g = [p for p in w["geom"] if lon[0] <= p[1] <= lon[1] and lat[0] <= p[0] <= lat[1]]
        if len(g) > 1: out.append(g)
    return out
ROADS = {
    # Orange Turnpike: VA 20 west of Wilderness Tavern, VA 3 from the VA 20 junction past Wilderness Church to Chancellorsville and on
    # east toward Fredericksburg (the Turnpike's line; the Plank Road shared it from Dowdall's Tavern to Chancellorsville)
    "turnpike": sel("Constitution Highway") + sel(ref="VA 3", lon=(-77.7270, -77.46), lat=(38.25, 38.33)),
    "plank_w": sel("Orange Plank Road", lon=(-77.92, -77.6720)),                        # Orange Plank Road west of Wilderness Church
    "plank_e": sel("Old Plank Road"),                                                     # Plank Road east of Chancellorsville
    "brock": sel("Brock Road", lat=(38.24, 38.33)),
    "germanna": sel(ref="VA 3", lon=(-77.80, -77.7262), lat=(38.3255, 38.40)),           # Germanna Plank Road (to Germanna Ford)
    "elys": sel("Elys Ford Road", lat=(38.30, 38.3605)),                                  # road to Ely's Ford
    "bullock": sel("Bullock Road"),
    "catharpin": sel("Catharpin Road", lat=(38.24, 38.30)),
    "jte": sel("Jackson Trail East"), "jtw": sel("Jackson Trail West"),
}
# hand-drawn 1863 roads (no modern road on their line; Hotchkiss 2 May map + NPS FRSP "Jackson's flank attack" map, approximate)
HAND = {
    # Furnace Road: from the Plank Road at the Lee-Jackson bivouac west to Catharine Furnace
    "furnace": [[38.2955, -77.6255], [38.2948, -77.6300], [38.2942, -77.6330], [38.2930, -77.6375], [38.2912, -77.6425], [38.2893, -77.6465], [38.2887, -77.6480]],
    # the Mountain Road: branching off the Plank Road west of the wounding site, running just north of it toward the Bullock road
    "mountain": [[38.3101, -77.6570], [38.3110, -77.6535], [38.3117, -77.6500], [38.3122, -77.6465], [38.3130, -77.6430], [38.3140, -77.6400]],
    # the road from Chancellorsville past the Bullock house to US Ford (Hooker's line of retreat)
    "usford": [[38.3085, -77.6343], [38.3172, -77.6374], [38.3300, -77.6330], [38.3440, -77.6250], [38.3580, -77.6170], [38.3690, -77.6100]],
}
for k, v in HAND.items(): ROADS[k] = [v]

im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
# water: streams thin, the two rivers wide (the Rappahannock tidal below Fredericksburg)
rivers = []
for w in WAYS:
    t = w["tags"]
    if t.get("waterway") == "stream":
        d.line([P(*p) for p in w["geom"]], fill=C["stream"], width=2, joint="curve")
for w in WAYS:
    t = w["tags"]
    if t.get("waterway") == "river" or t.get("name") in ("Rappahannock River", "Rapidan River"):
        if t.get("waterway") not in ("river", "riverbank"): continue
        g = [P(*p) for p in w["geom"]]; d.line(g, fill=C["river"], width=9, joint="curve")
        rivers.append([[round(x / S, 1), round(y / S, 1)] for x, y in g[::3] + [g[-1]]])
    # (natural=water polygons skipped: the lakes here are modern reservoirs: Lake Wilderness, Lake of the Woods, Fawn Lake)
json.dump(rivers, open("assets/media/chanc_rivers.json", "w"))
# roads: dark casing + light core (1863 roads only)
segs = [g for k, v in ROADS.items() for g in v]
for g in segs: d.line([P(*p) for p in g], fill=C["casing"], width=9, joint="curve")
for g in segs: d.line([P(*p) for p in g], fill=C["road"], width=4, joint="curve")
# Fredericksburg (the only big town on the map), period name
ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 44)
x, y = P(38.3032, -77.4605); r = 9
halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo); txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt)
hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=C["halo"] + (170,)); td.ellipse((x - r, y - r, x + r, y + r), fill=C["ink"] + (235,))
hd.text((x - r - 10, y + 26), "FREDERICKSBURG", font=ft, fill=C["halo"] + (220,), anchor="rm"); td.text((x - r - 10, y + 26), "FREDERICKSBURG", font=ft, fill=C["ink"] + (235,), anchor="rm")
im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
im.save("assets/media/chanc_geo_ref.png", optimize=True)

# ---- the Wilderness texture: dense, tangled second-growth woods (tiny dark crowns + light speckle), a soft-edged area west and south
# of Chancellorsville (Hotchkiss's woods symbols; NPS: "about 70 square miles" of scrub), cleared ground left open at the farms
WILD = [[38.338, -77.775], [38.345, -77.700], [38.340, -77.660], [38.332, -77.625], [38.318, -77.600], [38.300, -77.592], [38.282, -77.600],
        [38.262, -77.625], [38.250, -77.675], [38.252, -77.740], [38.268, -77.790], [38.300, -77.800], [38.325, -77.795]]
CLEAR = [(38.3085, -77.6343, 22), (38.3072, -77.6431, 18), (38.3033, -77.6520, 16), (38.3117, -77.6707, 16), (38.2887, -77.6482, 14),
         (38.3170, -77.6880, 14), (38.3246, -77.7228, 16), (38.3172, -77.6374, 12)]   # Chancellorsville, Fairview, Hazel Grove, Wilderness Church, furnace, Talley, Wilderness Tavern, Bullock
S1 = 1
mask = Image.new("L", (2880, 1620), 0); md = ImageDraw.Draw(mask)
md.polygon([P(*p, s=S1) for p in WILD], fill=255)
for la, lo, rr in CLEAR:
    cx, cy = P(la, lo, s=S1); md.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=0)
rng = np.random.default_rng(7)
def noise(scale, seed):   # smooth value noise in 0..1
    r = np.random.default_rng(seed).random((1620 // scale + 2, 2880 // scale + 2)).astype(np.float32)
    return np.array(Image.fromarray((r * 255).astype(np.uint8)).resize((2880 + 2 * scale, 1620 + 2 * scale), Image.BICUBIC))[scale:scale + 1620, scale:scale + 2880] / 255.0
m = np.array(mask.filter(ImageFilter.GaussianBlur(30)), np.float32) / 255
m = np.clip((m + (noise(40, 3) - 0.5) * 0.7 - 0.25) * 2.2, 0, 1)                  # ragged edge
den = 0.55 + 0.45 * noise(18, 5)                                                  # patchy density
tex = Image.new("RGBA", (2880, 1620), (0, 0, 0, 0)); tdw = ImageDraw.Draw(tex)
for _ in range(150000):   # tiny dark crowns, packed
    x, y = rng.uniform(0, 2880), rng.uniform(0, 1620); r = rng.uniform(0.8, 2.0)
    g = int(rng.uniform(40, 70)); tdw.ellipse((x - r, y - r, x + r, y + r), fill=(14, g, 26, int(rng.uniform(150, 230))))
for _ in range(26000):   # the tangle: short twiggy strokes, light and dark
    x, y = rng.uniform(0, 2880), rng.uniform(0, 1620); a = rng.uniform(0, math.pi); L = rng.uniform(2.5, 6)
    c = (110, 150, 96, 120) if rng.random() < 0.5 else (8, 22, 12, 150)
    tdw.line((x, y, x + L * math.cos(a), y + L * math.sin(a)), fill=c, width=1)
arr = np.array(tex).astype(np.float32)
base = np.zeros_like(arr); base[..., :3] = (16, 40, 22); base[..., 3] = 90          # dark undergrowth wash
a1 = arr[..., 3:] / 255; out = arr.copy(); out[..., :3] = arr[..., :3] * a1 + base[..., :3] * (1 - a1)
out[..., 3] = np.maximum(arr[..., 3], base[..., 3]) * m * den * 0.85
arr = np.clip(out, 0, 255).astype(np.uint8)
Image.fromarray(arr, "RGBA").save("assets/media/chanc_wilderness.png", optimize=True)

# ---- polylines in map px (S=1) + the march route (Dijkstra along the road graph between waypoints)
P1 = lambda la, lo: [round(v, 1) for v in P(la, lo, s=1)]
json.dump({k: [[P1(*p) for p in g] for g in v] for k, v in ROADS.items()}, open("assets/media/chanc_roads.json", "w"))
G = {}
def add(a, b):
    dd = math.hypot((a[0] - b[0]) * 111.0, (a[1] - b[1]) * 87.2); G.setdefault(a, []).append((b, dd)); G.setdefault(b, []).append((a, dd))
for k in ("furnace", "jte", "jtw", "brock", "turnpike"):
    for g in ROADS[k]:
        g = [tuple(p) for p in g]
        for a, b in zip(g, g[1:]): add(a, b)
# join hand-drawn ends to the nearest OSM node (Furnace Road -> Jackson Trail East at the furnace)
nodes = list(G)
def near(q): return min(nodes, key=lambda p: (p[0] - q[0]) ** 2 + ((p[1] - q[1]) * 0.79) ** 2)
for k in ("furnace",):
    e = tuple(ROADS[k][0][-1]); n2 = min((p for p in nodes if p not in ROADS[k][0] and p != e), key=lambda p: (p[0] - e[0]) ** 2 + (p[1] - e[1]) ** 2); add(e, n2)
def path(a, b):
    a, b = near(a), near(b); dist = {a: 0}; prev = {}; pq = [(0, a)]
    while pq:
        dd, u = heapq.heappop(pq)
        if u == b: break
        if dd > dist[u]: continue
        for v, w in G[u]:
            if dd + w < dist.get(v, 1e18): dist[v] = dd + w; prev[v] = u; heapq.heappush(pq, (dd + w, v))
    out = [b]
    while out[-1] != a: out.append(prev[out[-1]])
    return out[::-1], dist[b]
WP = [(38.2955, -77.6255), (38.2887, -77.6480), (38.2823, -77.6469), (38.2671, -77.6745), (38.2631, -77.6754), (38.2750, -77.6870),
      (38.2883, -77.6970), (38.3010, -77.7094), (38.3229, -77.7091)]
route, km = [], 0
for a, b in zip(WP, WP[1:]):
    p, dk = path(a, b); route += p if not route else p[1:]; km += dk
pts = [P1(*p) for p in route]
json.dump(pts, open("assets/media/chanc_route.json", "w"))
print("roads", {k: len(v) for k, v in ROADS.items()}, "rivers", len(rivers), "route pts", len(pts), f"route {km:.1f} km = {km / 1.609:.1f} mi")
