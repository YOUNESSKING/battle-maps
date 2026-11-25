#!/usr/bin/env python3
"""Build washington/data/geo.json (Battle 21, George Washington) for the 3D engine baker (VX_PROJECT=washington vicksburg/tools/bake_world.py).
Same schema as ajackson/data/geo.json: places / rivers / roads / works / moves / units; x, y = BASE frame map units (washington/data/frame.json:
web mercator z10, origin [75952, 98000] = ~(41.3 N, 75.7 W), x east, y south; ~116 m per base unit here). A region baked at another zoom scales
them by 2^(zoom-10) (colonies z9: /2, brooklyn / trenton / princeton z11: x2, crossing z12: x4).

Sources merged here (later wins on the same name):
  1. built-in lists below (towns 1776, ferries, the 1776 roads as lat/lon waypoints, the Brooklyn works, Trenton / Princeton points:
     well-known coordinates, accuracy in acc_m),
  2. washington/data/osm_lines.json (rivers + creeks from OpenStreetMap, tools/fetch_osm_lines.py), parts chained into one line each,
  3. washington/research/geo_brooklyn.json + geo_jersey.json (research agents, schema of ajackson/research/geo_horseshoe.json: places, lines,
     units) when present: places / units as given; lines by kind (river -> rivers, road -> roads, *works* / fort / line with a side -> works,
     everything else -> moves). Rerun this + make_configs.py + the bakes when they change.
usage: python3 washington/tools/make_geo.py"""
import json, math, os, sys
import numpy as np
REPO = "/home/user/battle-maps"; HERE = f"{REPO}/washington"
sys.path.insert(0, f"{REPO}/vicksburg/tools")
from vx_project import Project
P = Project("washington")
to_map = lambda la, lo: P.to_map(la, lo)
to_ll = lambda x, y: P.to_ll(x, y)
OSM = json.load(open(f"{HERE}/data/osm_lines.json"))
RES = {k: (json.load(open(f"{HERE}/research/geo_{k}.json")) if os.path.exists(f"{HERE}/research/geo_{k}.json") else {}) for k in ("brooklyn", "jersey")}


def xy(la, lo): x, y = to_map(la, lo); return [round(x, 2), round(y, 2)]


def place(name, la, lo, kind, acc, src, note="", **kw):
    x, y = to_map(la, lo)
    return dict(name=name, lat=round(la, 6), lon=round(lo, 6), x=round(x, 2), y=round(y, 2), kind=kind, acc_m=acc, src=src, note=note, **kw)


def line(name, kind, ll, src, acc=500, note="", **kw):
    return dict(name=name, kind=kind, acc_m=acc, src=src, note=note, pts=[xy(a, b) for a, b in ll], **kw)


def mline(name, kind, pts, src, acc=500, note="", **kw):   # pts already in map units
    return dict(name=name, kind=kind, acc_m=acc, src=src, note=note, pts=[[round(float(a), 2), round(float(b), 2)] for a, b in pts], **kw)


def osm_parts(name):
    return [np.array([to_map(a, b) for a, b in part]) for part in OSM.get(name, {}).get("lines", []) if len(part) >= 2]


def chain(parts, start_ll=None, gap=6.0):
    """join OSM parts into one polyline: start at the part end nearest start_ll (or the longest part), then repeatedly append the nearest
    free part end within `gap` base units (reversing parts as needed)"""
    parts = [p for p in parts if len(p) >= 2]
    if not parts: return None
    if start_ll is not None:
        s = np.array(to_map(*start_ll)); best = min(((np.hypot(*(p[e] - s)), i, e) for i, p in enumerate(parts) for e in (0, -1)))
        cur = parts.pop(best[1]); cur = cur if best[2] == 0 else cur[::-1]
    else:
        i = int(np.argmax([len(p) for p in parts])); cur = parts.pop(i)
    while parts:
        end = cur[-1]; best = min(((np.hypot(*(p[e] - end)), i, e) for i, p in enumerate(parts) for e in (0, -1)))
        if best[0] > gap: break
        q = parts.pop(best[1]); q = q if best[2] == 0 else q[::-1]; cur = np.vstack([cur, q[1:] if best[0] < 1e-3 else q])
    return unloop(cur)


def unloop(L, max_turn=100.0):
    """drop the zig-zags / back-tracks left where OSM parts overlap (a point whose path turns > max_turn deg), until none is left"""
    L = np.asarray(L, float); c = math.cos(math.radians(max_turn))
    while len(L) > 3:
        d = np.diff(L, axis=0); n = np.linalg.norm(d, axis=1); keep = n > 1e-6; L = np.vstack([L[0], L[1:][keep]]); d = np.diff(L, axis=0); n = np.linalg.norm(d, axis=1)
        cs = (d[:-1] * d[1:]).sum(1) / (n[:-1] * n[1:] + 1e-12); bad = np.nonzero(cs < c)[0]
        if not len(bad): break
        L = np.delete(L, bad[0] + 1, axis=0)
    return L


# ============================================================ places (1776-77) ============================================================
PL = [
 # --- colonies (wide) ---
 ("New York", 40.7075, -74.0110, "town", 300, "Wall St / Broad St (the 1776 city = lower Manhattan south of ~Chambers St)"),
 ("Brooklyn", 40.6925, -73.9875, "town", 500, "Brooklyn village (church at Fulton St), behind the Heights"),
 ("Philadelphia", 39.9496, -75.1503, "town", 300, "Independence Hall"),
 ("Trenton", 40.2215, -74.7650, "town", 200, "King (Warren) / Queen (Broad) St, the 1776 town"),
 ("Princeton", 40.3487, -74.6593, "town", 150, "Nassau Hall"),
 ("New Brunswick", 40.4974, -74.4455, "town", 400, "Raritan landing / the town"),
 ("Newark", 40.7357, -74.1724, "town", 400, "Military Park"),
 ("Elizabeth Town", 40.6640, -74.2107, "town", 400, "First Presbyterian Church"),
 ("Perth Amboy", 40.5068, -74.2654, "town", 400, "Proprietary House"),
 ("Hackensack", 40.8859, -74.0435, "town", 400, "The Green"),
 ("Morristown", 40.7968, -74.4815, "town", 400, "The Green"),
 ("Bordentown", 40.1462, -74.7118, "town", 400, "Farnsworth Ave"),
 ("Burlington", 40.0779, -74.8649, "town", 400, ""),
 ("Bristol", 40.1007, -74.8518, "town", 400, ""),
 ("White Plains", 41.0340, -73.7630, "town", 500, ""),
 ("Germantown", 40.0346, -75.1754, "town", 500, ""),
 ("Kingston", 40.3745, -74.6140, "town", 400, "Millstone bridge on the post road"),
 ("Pennington", 40.3284, -74.7910, "town", 400, "Pennington (Penny Town)"),
 ("Maidenhead", 40.2973, -74.7296, "town", 400, "Lawrenceville; Cornwallis's base 1-2 Jan 1777"),
 ("Woodbridge", 40.5576, -74.2846, "town", 500, ""),
 ("Flatbush", 40.6500, -73.9570, "town", 500, "Flatbush church"),
 ("Jamaica", 40.7020, -73.8010, "town", 700, ""),
 ("Harlem", 40.8100, -73.9450, "town", 700, "Harlem village"),
 ("Fort Washington", 40.8510, -73.9380, "fort", 200, "Bennett Park"),
 ("Fort Lee", 40.8510, -73.9700, "fort", 300, "Fort Lee Historic Park"),
 ("Kip's Bay", 40.7440, -73.9730, "bay", 400, "British landing 15 Sep 1776"),
 ("Gravesend Bay", 40.5960, -74.0050, "bay", 600, "British landing 22 Aug 1776"),
 ("Jamaica Pass", 40.6800, -73.8960, "pass", 600, "Howe's flank march, night 26-27 Aug 1776 (Evergreens cemetery)"),
 ("Staten Island", 40.5800, -74.1500, "island", 3000, "label point (British camp, July-Aug 1776)"),
 ("Long Island", 40.7300, -73.7600, "island", 5000, "label point"),
 ("Manhattan", 40.7800, -73.9650, "island", 3000, "label point"),
 ("Upper Bay", 40.6650, -74.0450, "bay", 2000, "label point (New York harbour)"),
 ("Lower Bay", 40.5250, -74.0300, "bay", 3000, "label point"),
 ("Newark Bay", 40.6700, -74.1350, "bay", 1500, "label point"),
 ("Raritan Bay", 40.4900, -74.1800, "bay", 3000, "label point"),
 ("Paulus Hook", 40.7160, -74.0350, "fort", 400, "Jersey City (ferry to New York)"),
 ("Cooper's Ferry", 39.9470, -75.1250, "ferry", 500, "Camden"),
 ("Coryell's Ferry", 40.3650, -74.9450, "ferry", 500, "New Hope / Lambertville"),
 # --- the crossing ---
 ("McConkey's Ferry", 40.2961, -74.8728, "ferry", 120, "McConkey's Ferry Inn, Washington Crossing Historic Park (PA): the embarkation landing 25 Dec 1776"),
 ("Johnson's Ferry", 40.2994, -74.8681, "ferry", 120, "Johnson Ferry House, Washington Crossing State Park (NJ): the landing"),
 ("Bear Tavern", 40.3167, -74.8430, "inn", 600, "on the Bear Tavern road (approx.)"),
 ("Jacobs Creek crossing", 40.2985, -74.8335, "ford", 500, "Bear Tavern road crosses Jacobs Creek (steep ravine; guns hauled by ropes)"),
 ("Birmingham", 40.2745, -74.8190, "hamlet", 600, "West Trenton: the army splits, Greene (Pennington road) / Sullivan (River road)"),
 # --- Trenton (26 Dec 1776 / 2 Jan 1777) ---
 ("King Street / Queen Street head (Five Points)", 40.2258, -74.7648, "crossroads", 80, "Battle Monument: Pennington + Princeton roads meet; Hamilton's / Forrest's guns"),
 ("Old Barracks", 40.2196, -74.7686, "building", 40, "Old Barracks Museum"),
 ("Assunpink bridge (foot of Queen St)", 40.2172, -74.7641, "bridge", 80, "the stone bridge, today S Broad St over the Assunpink"),
 ("Mill Hill", 40.2183, -74.7629, "hill", 150, "Mill Hill Park (OSM)"),
 ("Trenton Ferry", 40.2105, -74.7625, "ferry", 200, "foot of Ferry St"),
 ("Hessian picket (Pennington road)", 40.2350, -74.7850, "outpost", 400, "Howell's cooper shop, ~1 km out of town (approx.)"),
 ("Hermitage (Dickinson house)", 40.2385, -74.8020, "house", 500, "Hessian river-road outpost (approx.)"),
 ("Rall's headquarters (Stacy Potts house)", 40.2208, -74.7655, "house", 120, "King St (approx.)"),
 ("Hessian surrender field (orchard)", 40.2265, -74.7590, "field", 300, "the orchard east of town (approx.)"),
 ("Shabakunk Creek (Five Mile Run) bridge", 40.2820, -74.7405, "bridge", 400, "post road; Hand's riflemen delay Cornwallis 2 Jan"),
 # --- Princeton (3 Jan 1777) ---
 ("Nassau Hall", 40.3487, -74.6593, "building", 30, ""),
 ("Thomas Clarke house", 40.3305, -74.6787, "house", 40, "Princeton Battlefield State Park"),
 ("William Clarke orchard (clash point)", 40.3300, -74.6770, "field", 120, "Mercer vs Mawhood, 3 Jan 1777 ~8 am; Mercer Oak site"),
 ("Stony Brook bridge (Worth's Mill)", 40.3331, -74.6820, "bridge", 200, "post road over Stony Brook; Mawhood's column turned back here"),
 ("Frog Hollow", 40.3410, -74.6615, "ravine", 250, "ravine south of the college; British 55th / 40th line (approx.)"),
 ("Thomas Olden house", 40.3395, -74.6725, "house", 200, "on the post road (approx.)"),
 ("Quaker Bridge", 40.2770, -74.6870, "bridge", 600, "Quaker Bridge road over the Assunpink (the night-march crossing, approx.)"),
 # --- Brooklyn works (centres; the baker draws standard fort plans; 1776 plans: Ratzer / Kitchin on modern streets) ---
 ("Fort Putnam", 40.6918, -73.9748, "fort", 150, "Fort Greene Park (the 1776 Fort Putnam)"),
 ("Fort Greene (Brooklyn)", 40.6870, -73.9812, "fort", 250, "State St / Nevins St (approx.)"),
 ("Fort Box", 40.6848, -73.9870, "fort", 300, "approx., above Gowanus Creek"),
 ("Cobble Hill fort", 40.6880, -73.9927, "fort", 200, "Atlantic Ave / Court St ('Corkscrew fort')"),
 ("Fort Stirling", 40.6975, -73.9950, "fort", 250, "Brooklyn Heights over the East River"),
 ("Fort Defiance", 40.6760, -74.0130, "fort", 300, "Red Hook (approx.)"),
 ("Governors Island works", 40.6920, -74.0153, "fort", 300, "the 1776 island (north half)"),
 ("Fulton Ferry landing (Brooklyn ferry)", 40.7030, -73.9945, "ferry", 100, "the evacuation embarkation point, night 29-30 Aug 1776"),
 ("New York ferry stairs (Peck Slip / Fly Market)", 40.7075, -74.0025, "ferry", 200, "Manhattan landing of the Brooklyn ferry (approx.)"),
 ("Red Hook", 40.6765, -74.0120, "point", 400, "label point"),
 ("Wallabout Bay", 40.7010, -73.9730, "bay", 400, "label point (1776 bay; the Navy Yard is later fill)"),
 ("East River", 40.7045, -73.9985, "river", 200, "label point (~0.8-1.2 km wide here)"),
]
PLACES = [place(n, a, b, k, acc, src="built-in (well-known coordinates)", note=nt) for n, a, b, k, acc, nt in PL]
RPL = []
for k, J in RES.items():
    for p in J.get("places", []):
        if p.get("lat") is None: continue
        RPL.append(place(p["name"], p["lat"], p["lon"], p.get("kind", "place"), p.get("acc_m"), p.get("src", f"research {k}"), p.get("note") or ""))
# research wins over a built-in point of the same name (built-in name = prefix of the research name) unless it is much vaguer (acc > 1.5 x)
def _superseded(b):
    for r in RPL:
        rn, bn = r["name"].lower(), b["name"].lower()
        if rn.startswith(bn) and rn[len(bn):len(bn) + 2] in ("", " (", ", ") and (r.get("acc_m") or 0) <= 1.5 * (b.get("acc_m") or 1e9):
            return r["name"]
    return None
for b in list(PLACES):
    r = _superseded(b)
    if r: PLACES.remove(b); print(f"  research supersedes built-in '{b['name']}' -> '{r}'")
PLACES += RPL

# ============================================================ rivers ============================================================
RIVERS = []
def add_osm(nm, start, w=None, out=None, note="modern course (OSM)"):
    L = chain(osm_parts(nm), start)
    if L is not None and len(L) >= 3: RIVERS.append(mline(out or nm, "river", L, "OSM (Nominatim geometry, parts chained)", 150, note, **({"w_base": w} if w else {})))
add_osm("Delaware River", (41.25, -74.95), 3.0, note="upstream first; modern course (1776 ~ the same); below Trenton tidal")
add_osm("Delaware River (fine)", (40.40, -74.97), 3.0, note="upstream first; detailed (~20 m) Coryell's Ferry - Bordentown")
add_osm("Schuylkill River", (40.24, -75.60), 1.2)
add_osm("Millstone River", (40.21, -74.55), 0.4)
add_osm("Assunpink Creek", (40.25, -74.56), 0.3, note="upstream first (east -> Trenton)")
add_osm("Stony Brook", (40.40, -74.84), 0.3, note="upstream first (Pennington -> Princeton -> Millstone)")
add_osm("Shabakunk Creek", (40.285, -74.774), 0.15)
add_osm("Jacobs Creek", (40.356, -74.83), 0.2)
add_osm("Crosswicks Creek", (40.06, -74.53), 0.5)
add_osm("Neshaminy Creek", (40.29, -75.20), 0.5)
add_osm("Pennypack Creek", (40.18, -75.10), 0.3)
add_osm("Hackensack River", (41.19, -73.97), 0.8)
add_osm("Saddle River", (41.08, -74.10), 0.3)
add_osm("Bronx River", (41.15, -73.77), 0.3)
add_osm("Harlem River", (40.881, -73.92), 0.8, note="tidal strait (also in the sea mask)")
# hand lines where Nominatim only returned a short piece (1776 course ~ the modern one)
RIVERS += [
 line("Raritan River", "river", [(40.565, -74.680), (40.555, -74.620), (40.556, -74.560), (40.553, -74.530), (40.535, -74.495), (40.515, -74.470), (40.499, -74.445),
      (40.488, -74.420), (40.483, -74.395), (40.487, -74.368), (40.478, -74.340), (40.481, -74.310), (40.497, -74.285), (40.503, -74.265)], "EST (modern course; OSM partial)", 300, w_base=0.8),
 line("Passaic River", "river", [(40.960, -74.255), (40.935, -74.215), (40.917, -74.182), (40.905, -74.160), (40.880, -74.130), (40.857, -74.128), (40.830, -74.140),
      (40.800, -74.152), (40.770, -74.162), (40.745, -74.165), (40.735, -74.150), (40.735, -74.130), (40.722, -74.120), (40.708, -74.115)], "EST (modern course; OSM partial)", 300, w_base=0.8),
 line("Hudson River", "river", [(41.25, -73.96), (41.10, -73.90), (41.00, -73.905), (40.90, -73.925), (40.83, -73.965), (40.77, -74.005), (40.72, -74.020), (40.695, -74.030)],
      "EST (centre line; the river itself = the sea mask, tidal)", 500, w_base=8.0),
 line("East River", "river", [(40.795, -73.930), (40.775, -73.940), (40.760, -73.957), (40.745, -73.968), (40.728, -73.970), (40.712, -73.975), (40.708, -73.990),
      (40.704, -73.999), (40.698, -74.008), (40.692, -74.010)], "EST (centre line; tidal strait = the sea mask)", 300, w_base=8.0),
 line("Gowanus Creek", "river", [(40.6850, -73.9855), (40.6820, -73.9880), (40.6790, -73.9905), (40.6760, -73.9935), (40.6735, -73.9960), (40.6715, -73.9990), (40.6695, -74.0030)],
      "EST (the 1776 creek ~ the canal line; marsh both sides)", 300, "Freeke's mill pond at the head; the retreat of 27 Aug crossed it near the mouth"),
]
for k, J in RES.items():
    for l in J.get("lines", []):
        if l.get("kind") == "river": RIVERS.append(line(l["name"], "river", l["pts"], l.get("src", f"research {k}"), l.get("acc_m", 200), l.get("note", "")))

# ============================================================ roads (1776-77, lat/lon waypoints; acc ~300-1500 m) ============================================================
R = lambda n, pts, acc=800, note="": line(n, "road", pts, "EST (1776 route on its modern successor)", acc, note)
TR_HEAD = (40.2258, -74.7648); TR_BR = (40.2172, -74.7641); MILL = (40.2150, -74.7630); JF = (40.2994, -74.8681); BIRM = (40.2745, -74.8190)   # Trenton anchors: OSM (research geo_jersey)
ROADS = [
 # colonies
 R("Philadelphia - Trenton post road (PA)", [(39.9496, -75.1503), (39.985, -75.118), (40.017, -75.083), (40.045, -75.025), (40.070, -74.960), (40.100, -74.870), (40.1007, -74.8518),
   (40.140, -74.830), (40.180, -74.805), (40.205, -74.790), (40.2105, -74.7700)], 1500),
 R("New York post road (NJ): Trenton - New Brunswick - Elizabeth Town - Paulus Hook", [TR_HEAD, (40.2405, -74.7505), (40.2610, -74.7380), (40.2973, -74.7296), (40.3120, -74.7150),
   (40.3220, -74.6975), (40.3331, -74.6820), (40.3400, -74.6720), (40.3450, -74.6650), (40.3487, -74.6593), (40.3745, -74.6140), (40.4100, -74.5550), (40.4500, -74.5050), (40.4974, -74.4455),
   (40.5430, -74.3630), (40.5576, -74.2846), (40.6080, -74.2780), (40.6640, -74.2107), (40.7000, -74.1900), (40.7357, -74.1724), (40.7400, -74.1200), (40.7300, -74.0700), (40.7160, -74.0350)], 1000),
 R("Trenton - Bordentown - Burlington road", [MILL, (40.2000, -74.7450), (40.1800, -74.7250), (40.1462, -74.7118), (40.1250, -74.7700), (40.1050, -74.8150), (40.0779, -74.8649)], 1000),
 R("Burlington - Cooper's Ferry road", [(40.0779, -74.8649), (40.0400, -74.9400), (39.9950, -75.0300), (39.9600, -75.0900), (39.9470, -75.1250)], 1500),
 R("Perth Amboy - New Brunswick road", [(40.5068, -74.2654), (40.4900, -74.3300), (40.4900, -74.3900), (40.4974, -74.4455)], 1000),
 R("Morristown - Elizabeth Town road", [(40.7968, -74.4815), (40.7700, -74.4100), (40.7300, -74.3500), (40.7048, -74.3168), (40.6800, -74.2600), (40.6640, -74.2107)], 1500),
 R("Morristown - Newark road", [(40.7968, -74.4815), (40.8000, -74.4000), (40.7800, -74.3000), (40.7550, -74.2300), (40.7357, -74.1724)], 1500),
 R("Fort Lee - Hackensack - Newark road", [(40.8510, -73.9700), (40.8700, -74.0100), (40.8859, -74.0435), (40.8400, -74.0900), (40.7900, -74.1400), (40.7357, -74.1724)], 1500),
 R("Princeton - Morristown road", [(40.3487, -74.6593), (40.4300, -74.6200), (40.5300, -74.6000), (40.6200, -74.6100), (40.7000, -74.5600), (40.7968, -74.4815)], 2000),
 R("Boston post road (Manhattan)", [(40.7075, -74.0110), (40.7150, -74.0020), (40.7250, -73.9930), (40.7450, -73.9850), (40.7700, -73.9650), (40.7900, -73.9500), (40.8100, -73.9450),
   (40.8450, -73.9330), (40.8770, -73.9120), (40.9100, -73.8800), (40.9600, -73.8300), (41.0340, -73.7630)], 1500),
 R("Brooklyn - Flatbush - Jamaica roads", [(40.7030, -73.9945), (40.6925, -73.9875), (40.6800, -73.9700), (40.6650, -73.9620), (40.6500, -73.9570)], 800),
 R("Jamaica road (Bedford - Jamaica Pass - Jamaica)", [(40.6925, -73.9875), (40.6880, -73.9600), (40.6840, -73.9300), (40.6800, -73.8960), (40.6900, -73.8500), (40.7020, -73.8010)], 1000),
 R("Gowanus road (Brooklyn - Gravesend)", [(40.6925, -73.9875), (40.6780, -73.9920), (40.6600, -74.0000), (40.6400, -74.0150), (40.6150, -74.0200), (40.5960, -73.9900)], 1000),
 # jersey / crossing / trenton / princeton
 R("River road (NJ): Johnson's Ferry - Trenton", [JF, (40.2900, -74.8620), (40.2780, -74.8510), (40.2660, -74.8400), (40.2560, -74.8270), (40.2450, -74.8100), (40.2360, -74.7950),
   (40.2290, -74.7830), (40.2230, -74.7740), (40.2190, -74.7700)], 500, "Sullivan's column, 26 Dec; enters the lower town at King St / Front St"),
 R("River road (PA): McConkey's Ferry - Yardley - Morrisville", [(40.3400, -74.9300), (40.3150, -74.8980), (40.2952, -74.8760), (40.2750, -74.8620), (40.2450, -74.8460), (40.2200, -74.8000), (40.2110, -74.7880)], 700),
 R("Bear Tavern road", [JF, (40.3035, -74.8625), (40.3090, -74.8545), (40.3140, -74.8475), (40.3167, -74.8430), (40.3080, -74.8370), (40.2985, -74.8335),
   (40.2870, -74.8260), (40.2790, -74.8215), BIRM], 400,
   "from the ferry up the bank, via Bear Tavern and the Jacobs Creek ravine to Birmingham (night 25-26 Dec)"),
 R("Birmingham - River road (Sullivan)", [BIRM, (40.2700, -74.8240), (40.2620, -74.8320), (40.2560, -74.8290)], 600),
 R("Pennington road", [(40.3284, -74.7910), (40.3100, -74.7900), (40.2900, -74.7880), (40.2700, -74.7860), (40.2500, -74.7800), (40.2350, -74.7745), TR_HEAD], 500,
   "Greene's column (with Washington) entered the north end by it, 26 Dec"),
 R("Birmingham - Pennington road (Greene)", [BIRM, (40.2740, -74.8050), (40.2700, -74.7900), (40.2680, -74.7860)], 700),
 R("Scotch road", [(40.3200, -74.8300), (40.3000, -74.8200), (40.2850, -74.8180), BIRM], 900),
 R("Quaker Bridge road", [MILL, (40.2180, -74.7450), (40.2300, -74.7250), (40.2480, -74.7080), (40.2650, -74.6930), (40.2770, -74.6870), (40.2900, -74.6860), (40.3020, -74.6880)], 800,
   "the night march 2-3 Jan 1777 (with the Sandtown road)"),
 R("Saw Mill road", [(40.3020, -74.6880), (40.3120, -74.6850), (40.3220, -74.6800), (40.3300, -74.6760), (40.3380, -74.6700), (40.3450, -74.6630), (40.3487, -74.6593)], 600,
   "the back road from the Quaker Bridge road past the Thomas Clarke farm into Princeton (approx.)"),
 R("Sandtown road", [MILL, (40.2100, -74.7450), (40.2060, -74.7250), (40.2050, -74.7050), (40.2200, -74.6950), (40.2480, -74.7080)], 1200, "approx.: SE from Mill Hill then N to the Quaker Bridge road"),
 R("Trenton streets: King Street", [(40.2258, -74.7651), (40.2230, -74.7652), (40.2200, -74.7652), (40.2174, -74.7652)], 60, "today N Warren St (OSM, research geo_jersey)"),
 R("Trenton streets: Queen Street", [(40.2257, -74.7645), (40.2230, -74.7643), (40.2200, -74.7642), TR_BR, MILL], 60, "today N Broad St (OSM, research geo_jersey); over the stone bridge"),
]
for k, J in RES.items():
    for l in J.get("lines", []):
        if l.get("kind") == "road": ROADS.append(line(l["name"], "road", l["pts"], l.get("src", f"research {k}"), l.get("acc_m", 300), l.get("note", "")))

# ============================================================ works ============================================================
W = lambda n, pts, side, acc=300, note="": line(n, "breastwork", pts, "EST (1776 plans: Ratzer / Kitchin; modern streets)", acc, note, side=side)
WORKS = [
 W("Brooklyn lines (Wallabout - Gowanus)", [(40.6985, -73.9805), (40.6935, -73.9790), (40.6905, -73.9765), (40.6880, -73.9800), (40.6860, -73.9845), (40.6845, -73.9880),
   (40.6852, -73.9910)], "us", 300, "Fort Putnam (Fort Greene Park) - redoubt - Fort Greene - Fort Box - to Gowanus Creek; ~1.5 mi"),
 W("American line, Assunpink (2 Jan 1777)", [(40.2120, -74.7640), (40.2150, -74.7600), (40.2166, -74.7575), (40.2180, -74.7545), (40.2200, -74.7510), (40.2225, -74.7470)], "us", 300,
   "south bank of the Assunpink from the Delaware past the bridge and Mill Hill upstream (~3 mi of fords); guns at the bridge"),
]
for k, J in RES.items():
    for l in J.get("lines", []):
        kd = l.get("kind", "")
        if any(s in kd for s in ("works", "breastwork", "fort", "redoubt")) or (kd.endswith("_line") and l.get("side")) or (kd == "line" and l["name"].startswith(("American line", "British line"))):
            side = l.get("side") or ("gb" if kd.startswith(("gb", "br")) or l["name"].startswith("British") else "us")
            WORKS.append(line(l["name"], "breastwork", l["pts"], l.get("src", f"research {k}"), l.get("acc_m", 300), l.get("note", ""), side=side))

# ============================================================ moves + units (research) ============================================================
MOVES, UNITS = [], []
done = {r["name"] for r in RIVERS} | {r["name"] for r in ROADS} | {w["name"] for w in WORKS}
for k, J in RES.items():
    for l in J.get("lines", []):
        if l["name"] in done: continue
        MOVES.append(line(l["name"], l.get("kind", "move"), l["pts"], l.get("src", f"research {k}"), l.get("acc_m", 500), l.get("note", "")))
    for u in J.get("units", []):
        if u.get("lat") is None: continue
        x, y = to_map(u["lat"], u["lon"])
        UNITS.append(dict(u, x=round(x, 2), y=round(y, 2), moves_to_xy=[xy(a, b) for a, b in (u.get("moves_to") or [])], battle=u.get("battle", k)))

geo = dict(_doc="Battle 21 (George Washington) geodata for the 3D worlds. x, y = BASE frame units (washington/data/frame.json: web mercator z10, origin [75952, 98000], "
                "x east, y south; ~116 m/unit). A region of zoom z uses x * 2^(z-10). Built by washington/tools/make_geo.py from OSM lines + built-in 1776 points / roads "
                "+ the research files (research/geo_brooklyn.json, geo_jersey.json) when present.",
           research=[k for k, J in RES.items() if J],
           frame=dict(name=P.frame["name"], zoom=P.zoom, origin_world_px=P.origin, engine_mpu=P.engine_mpu),
           places=PLACES, rivers=RIVERS, roads=ROADS, works=WORKS, moves=MOVES, units=UNITS)
json.dump(geo, open(f"{HERE}/data/geo.json", "w"), indent=1, ensure_ascii=False)
print(f"{len(PLACES)} places, {len(RIVERS)} rivers, {len(ROADS)} roads, {len(WORKS)} works, {len(MOVES)} moves, {len(UNITS)} units -> washington/data/geo.json"
      f" (research merged: {[k for k, J in RES.items() if J] or 'none yet'})")
