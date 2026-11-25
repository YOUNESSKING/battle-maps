#!/usr/bin/env python3
"""Build ajackson/data/geo.json (Battle 20, Andrew Jackson) for the 3D engine baker (VX_PROJECT=ajackson vicksburg/tools/bake_world.py).
Same schema as vicksburg/data/geo.json: places / rivers / roads / works / units; x, y = BASE frame map units (ajackson/data/frame.json:
web mercator z10, origin [64288, 104976], x east, y south). A region baked at another zoom scales them by 2^(zoom-10) (gulf z8: /4, horseshoe z11: x2).

Sources merged here (later wins on the same name):
  1. built-in lists below (gulf towns / forts / 1814 roads, the river roads, Chalmette helpers),
  2. ajackson/data/osm_lines.json (rivers + Bayou Bienvenue from OpenStreetMap, tools/fetch_osm_lines.py),
  3. ajackson/research/geo_neworleans.json + geo_horseshoe.json (research agents: places, lines, units), used as given EXCEPT the
     Rodriguez Canal line: the research line is a Latour-based estimate ("NOT surveyed"); here its shape (straight leg river -> wood, the
     receding elbow, the swamp leg; battery spacing) is fitted onto the canal as mapped in OSM (NPS park, way 161580549), and every 8 Jan
     item on / in front of the line (batteries, units, British columns, the British advance works) gets the same rigid move.
usage: python3 ajackson/tools/make_geo.py     (prints a table; rerun after the research files change, then rebake the worlds)"""
import json, math, os, sys
import numpy as np
REPO = "/home/user/battle-maps"; HERE = f"{REPO}/washington"
sys.path.insert(0, f"{REPO}/vicksburg/tools")
from vx_project import Project
P = Project("washington")
to_map = lambda la, lo: P.to_map(la, lo)
to_ll = lambda x, y: P.to_ll(x, y)
OSM = json.load(open(f"{HERE}/data/osm_lines.json"))
RES = {k: (json.load(open(f"{HERE}/research/geo_{k}.json")) if os.path.exists(f"{HERE}/research/geo_{k}.json") else {}) for k in ("neworleans", "horseshoe")}
W_MISS = 5.8   # Mississippi width at Chalmette, base units (~770 m)


def xy(la, lo): x, y = to_map(la, lo); return [round(x, 2), round(y, 2)]


def place(name, la, lo, kind, acc, src, note="", **kw):
    x, y = to_map(la, lo)
    return dict(name=name, lat=round(la, 6), lon=round(lo, 6), x=round(x, 2), y=round(y, 2), kind=kind, acc_m=acc, src=src, note=note, **kw)


def line(name, kind, ll, src, acc=500, note="", **kw):
    return dict(name=name, kind=kind, acc_m=acc, src=src, note=note, pts=[xy(a, b) for a, b in ll], **kw)


def mline(name, kind, pts, src, acc=500, note="", **kw):   # pts already in map units
    return dict(name=name, kind=kind, acc_m=acc, src=src, note=note, pts=[[round(float(a), 2), round(float(b), 2)] for a, b in pts], **kw)


def densify(L, step):
    L = np.asarray(L, float); out = [L[0]]
    for a, b in zip(L[:-1], L[1:]):
        n = max(1, int(math.ceil(np.hypot(*(b - a)) / step)))
        out += [a + (b - a) * k / n for k in range(1, n + 1)]
    return np.array(out)


def offset(L, d):
    """polyline offset by d units to the LEFT of its direction (map y south: left of an eastward line = north)"""
    L = np.asarray(L, float); t = np.gradient(L, axis=0); t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-9
    return L + np.stack([t[:, 1], -t[:, 0]], 1) * d


def smooth(L, k=3):
    L = np.asarray(L, float)
    if len(L) < 2 * k + 1: return L
    Lp = np.pad(L, ((k, k), (0, 0)), mode="edge"); ker = np.ones(2 * k + 1) / (2 * k + 1)
    out = np.stack([np.convolve(Lp[:, i], ker, mode="valid") for i in range(2)], 1); out[0], out[-1] = L[0], L[-1]; return out


def osm_lines(name):
    return [np.array([to_map(a, b) for a, b in part]) for part in OSM.get(name, {}).get("lines", [])]


def longest(name): return max(osm_lines(name), key=len)


# ============================================================ the Mississippi at New Orleans (OSM, upstream first) ============================================================
MISS_NO = longest("Mississippi River (New Orleans)")
if np.hypot(*(MISS_NO[0] - to_map(30.0, -90.40))) > np.hypot(*(MISS_NO[-1] - to_map(30.0, -90.40))): MISS_NO = MISS_NO[::-1]
MISS_D = densify(MISS_NO, 0.25)


def nearest_on(L, p):
    d = np.hypot(L[:, 0] - p[0], L[:, 1] - p[1]); i = int(d.argmin()); return i, float(d[i])


# ============================================================ Jackson's line: research shape fitted onto the OSM canal ============================================================
CANAL = np.array([to_map(29.9425291, -89.9937485), to_map(29.9452798, -89.9917012)])   # OSM way 161580549 (SW -> NE), straight
dirv = (CANAL[1] - CANAL[0]) / np.linalg.norm(CANAL[1] - CANAL[0])
# walk from the canal's SW end back toward the river until 70 ft (~0.16 units) from the 1815 bank (Battery 1 'on the road 70 ft from the river', Latour p.147)
s = 0.0
while nearest_on(MISS_D, CANAL[0] - dirv * s)[1] > W_MISS / 2 + 0.16 and s < 12: s += 0.02
M0 = CANAL[0] - dirv * s
RN = {p["name"]: p for p in RES["neworleans"].get("places", [])}
def rpt(name, default):
    for k, v in RN.items():
        if k.startswith(name) and v.get("lat") is not None: return np.array(to_map(v["lat"], v["lon"]))
    return np.array(to_map(*default))
R0 = rpt("Line Jackson river end", (29.9396, -89.9917)); R1 = rpt("Line Jackson elbow", (29.94517, -89.98998)); R2 = rpt("Line Jackson swamp end", (29.94779, -89.99828))
ang = math.atan2(dirv[1], dirv[0]) - math.atan2(*(R1 - R0)[::-1])
ROT = np.array([[math.cos(ang), -math.sin(ang)], [math.sin(ang), math.cos(ang)]])
def fit(p, bank=True):
    """rigid move research -> OSM-canal frame; points the rotation pushed into the river go back onto the east bank (0.35 units inland)"""
    q = M0 + ROT @ (np.asarray(p, float) - R0)
    if bank:
        i, d = nearest_on(MISS_D, q)
        if d < W_MISS / 2 + 0.35:
            t = MISS_D[min(i + 2, len(MISS_D) - 1)] - MISS_D[max(i - 2, 0)]; n = np.array([t[1], -t[0]]) / np.linalg.norm(t)   # left of the flow = east bank
            q = MISS_D[i] + n * (W_MISS / 2 + 0.35)
    return q
M1, M2 = fit(R1), fit(R2)
LINE_PTS = np.vstack([M0, M1, M2])
FIT_NOTE = (f"fitted: research line (Latour shape, NOT surveyed) moved onto the OSM canal: rotated {math.degrees(ang):+.1f} deg about the river end, "
            f"river end moved {np.hypot(*(M0 - R0)) * 132.5:.0f} m")


def fit_ll(la, lo): x, y = fit(to_map(la, lo)); return to_ll(x, y)


# ---- downstream / west-bank research items: their straight 'river' axis (river end -> Carolina anchorage) mapped onto the real river bank
# (the research extrapolated the plantations along a straight line; the river bends south below Chalmette, which put Villere 2.4 km inland).
# s (along the axis) is scaled so De la Ronde lands on the De la Ronde oaks (OSM); t (inland) is kept; west-bank items go to the far bank.
A_IDX = nearest_on(MISS_D, M0)[0]; ARC = np.r_[0, np.cumsum(np.hypot(*np.diff(MISS_D, axis=0).T))]
TAN = np.gradient(MISS_D, axis=0); TAN /= np.linalg.norm(TAN, axis=1, keepdims=True); NRM_L = np.stack([TAN[:, 1], -TAN[:, 0]], 1)   # left of the flow = east bank here
AX = rpt("USS Carolina anchorage", (29.94367, -89.94713)) - R0; AXL = np.linalg.norm(AX); AX /= AXL; AXN = np.array([AX[1], -AX[0]])   # inland (north)
OAKS = np.array(to_map(29.93555, -89.96843)); DLR = rpt("De la Ronde plantation", (29.94367, -89.96508))
K_S = (ARC[nearest_on(MISS_D, OAKS)[0]] - ARC[A_IDX]) / float(np.dot(DLR - R0, AX))
def river_frame(la, lo, west=False, inset=None):
    p = np.array(to_map(la, lo)) - R0; s_ = float(np.dot(p, AX)) * K_S; t_ = float(np.dot(p, AXN))
    i = int(np.clip(np.searchsorted(ARC, ARC[A_IDX] + s_), 0, len(ARC) - 1)); side = -1 if west else 1
    d = W_MISS / 2 + (inset if inset is not None else max(abs(t_), 0.4) if not west else 1.0)
    return to_ll(*(MISS_D[i] + NRM_L[i] * side * d))
RIVER_FRAME = ("Bienvenu", "De la Ronde", "Night-battle", "Lacoste", "Villere plantation", "Keane's vanguard", "Jackson's main force", "Coffee's brigade",
               "British reinforcements", "Coffee's flank", "Jackson's 23 Dec", "British route 23 Dec")
WEST = ("Marine Battery", "Morgan", "West bank", "Thornton")
def remap(name, la, lo):
    if any(name.startswith(k) for k in WEST):
        if name.startswith(("Marine Battery", "West bank: Patterson")): return river_frame(29.9396, -89.9917, west=True, inset=0.45)   # opposite the line's river end
        return river_frame(la, lo, west=True)
    if name.startswith("USS Carolina"): return river_frame(la, lo, inset=-0.9)   # in the river, near the east bank
    if any(name.startswith(k) for k in RIVER_FRAME): return river_frame(la, lo)
    return None
RF_NOTE = "remapped onto the real river bank (research placed it on a straight line; the river bends south below Chalmette)"


FIT_NAMES = ("Line Jackson", "Macarty house", "Chalmette plantation house", "British advance", "Gibbs", "Keane column", "Rennie column")
def needs_fit(name, battle=None, side=None):
    if battle == "8jan" and not name.startswith("West bank") and "Thornton" not in name: return True
    if "falls back to Rodriguez" in name: return True
    return any(name.startswith(k) for k in FIT_NAMES)


# ============================================================ places ============================================================
PLACES = [
 # --- Gulf / campaign (gulf region; built-in where the research files have none) ---
 place("New Orleans", 29.9575, -90.0629, "town", 150, "Jackson Square (OSM)", "1815 city = the Vieux Carre + faubourgs"),
 place("Baton Rouge", 30.4515, -91.1871, "town", 1000, "WD", ""),
 place("Natchez", 31.5604, -91.4032, "town", 1000, "WD", ""),
 place("Mobile", 30.6912, -88.0425, "town", 800, "Fort Charlotte site (OSM), the 1814 town", "Spanish until Apr 1813"),
 place("Pensacola", 30.4107, -87.2112, "town", 1000, "Wikipedia Battle of Pensacola (1814)", "Spanish West Florida; Jackson took it 7 Nov 1814"),
 place("Fort Stoddert", 31.085, -88.005, "fort", 2500, "EST (Mount Vernon, Ala.; Tombigbee-Alabama junction area)", "US fort on the Mobile River, 1799"),
 place("St. Stephens", 31.5446, -88.0547, "town", 1500, "WD (Old St. Stephens)", "Tombigbee territorial town"),
 place("Fort Jackson (Hickory Ground)", 32.5079, -86.2508, "fort", 500, "Fort Toulouse-Jackson Park (OSM)", "Treaty of Fort Jackson, 9 Aug 1814"),
 place("Tuckabatchee", 32.523, -85.856, "town", 4000, "EST (Upper Creek town on the Tallapoosa near Tallassee)", "VERIFY"),
 place("Fort Bowyer", 30.2281, -88.0229, "fort", 800, "Fort Morgan (OSM)", "repulsed the British 15 Sep 1814; taken 12 Feb 1815"),
 place("Fort St. Philip", 29.3626, -89.4653, "fort", 300, "OSM", "bombarded 9-18 Jan 1815"),
 place("Lake Borgne", 30.03, -89.62, "lake", 5000, "label point", ""),
 place("Lake Pontchartrain", 30.18, -90.10, "lake", 5000, "label point", ""),
 place("Gulf of Mexico", 29.30, -88.30, "sea", 20000, "label point", ""),
 place("Mobile Bay", 30.45, -88.00, "bay", 5000, "label point", ""),
 place("Horseshoe Bend", 32.97, -85.7385, "battlefield", 300, "research geo_horseshoe", "the Tohopeka peninsula"),
 # --- Chalmette (fixed real points) ---
 place("Chalmette Monument", 29.94245, -89.99414, "marker", 40, "OSM", "modern (1908); stands just behind the line"),
 place("Rodriguez Canal (NPS preserved section)", 29.9439, -89.99272, "canal", 30, "OSM way 161580549", "the line ran along it"),
 place("Malus-Beauregard House", 29.94064, -89.99417, "house", 30, "OSM", "built 1833: NOT an 1815 building (no house drawn here)"),
 place("Chalmette National Cemetery", 29.9408, -89.98836, "marker", 80, "OSM", "modern; British side of the line"),
 place("Pakenham Oaks (De la Ronde oak alley)", 29.93555, -89.96843, "marker", 60, "OSM", "the De la Ronde oaks"),
]
ll = to_ll(*M0); PLACES.append(place("Jackson's line, river end (Battery 1)", ll[0], ll[1], "work", 120, "OSM canal extended to 70 ft from the 1815 bank", FIT_NOTE))
ll = to_ll(*M1); PLACES.append(place("Jackson's line, elbow (wood edge)", ll[0], ll[1], "work", 250, "research shape on the OSM canal", FIT_NOTE))
ll = to_ll(*M2); PLACES.append(place("Jackson's line, swamp end", ll[0], ll[1], "work", 400, "research shape on the OSM canal", FIT_NOTE))

# research places (fitted where they belong to the line)
for k, J in RES.items():
    for p in J.get("places", []):
        if p.get("lat") is None: continue
        la, lo = (fit_ll(p["lat"], p["lon"]) if k == "neworleans" and needs_fit(p["name"]) else (p["lat"], p["lon"]))
        note = (p.get("note") or "") + (" | " + FIT_NOTE if k == "neworleans" and needs_fit(p["name"]) else "")
        rm = remap(p["name"], p["lat"], p["lon"]) if k == "neworleans" else None
        if rm: la, lo = rm; note = (p.get("note") or "") + " | " + RF_NOTE
        PLACES.append(place(p["name"], la, lo, p.get("kind", "place"), p.get("acc_m"), p.get("src", f"research {k}"), note))

# ============================================================ rivers ============================================================
GULF_W = {"Mississippi River": 5.0, "Alabama River": 1.0, "Tombigbee River": 0.9, "Mobile River": 1.3, "Tensaw River": 0.8, "Coosa River": 0.9,
          "Tallapoosa River": 0.7, "Pearl River": 0.7, "Pascagoula River": 0.8, "Black Warrior River": 0.8, "Chattahoochee River": 0.9,
          "Conecuh River": 0.6, "Cahaba River": 0.5, "Leaf River": 0.5, "Chickasawhay River": 0.5, "Choctawhatchee River": 0.6,
          "Perdido River": 0.4, "Yellow River": 0.4, "Amite River": 0.4}
RIVERS = []
for nm in GULF_W:
    for i, L in enumerate(sorted(osm_lines(nm), key=len, reverse=True)):
        if len(L) < 3: continue
        RIVERS.append(mline(nm if i == 0 else f"{nm} ({i + 1})", "river", L, "OSM (Nominatim geometry, simplified ~300-400 m)", 400,
                            "modern course; reservoirs on the Alabama / Coosa / Tallapoosa are filled in the DEM (1814 rivers only)", w_base=GULF_W[nm]))
RIVERS.append(line("Escambia River", "river", [(31.0, -87.235), (30.85, -87.22), (30.7, -87.2), (30.6, -87.17), (30.56, -87.16)], "EST (Conecuh continued to Escambia Bay)", 2000))
RIVERS.append(mline("Mississippi River (New Orleans)", "river", MISS_NO, "OSM centre line (simplified ~40 m)", 60, "upstream first; 1815 course ~ modern here", w_base=W_MISS))
BB = longest("Bayou Bienvenue")
RIVERS.append(mline("Bayou Bienvenue", "bayou", BB, "OSM (modern bayou)", 300, "British boat route 22-23 Dec (then Bayou Mazant / Villere canal); 1815 course approx."))
# the Villere canal: from the Villere house north to the bayou (research landing point = canal head)
vp = next((q for q in PLACES if q["name"].startswith("Villere plantation house")), None)   # the remapped house (on the real bank)
vh = np.array([vp["x"], vp["y"]]) if vp else rpt("Villere plantation house", (29.94711, -89.94256)); ch = rpt("Villere canal head", (29.9897, -89.95123))
RIVERS.append(mline("Villere canal", "canal", [vh + (ch - vh) * 0.12, vh + (ch - vh) * 0.55, ch], "research geo_neworleans (Villere house -> canal head)", 1200,
                    "plantation drainage canal the British boats came up on 23 Dec; starts behind the house (not into the river)"))
for J in RES.values():
    for l in J.get("lines", []):
        if l.get("kind") == "river":
            RIVERS.append(line(l["name"], "river", l["pts"], l.get("src", "research"), l.get("acc_m", 100), l.get("note", "")))
# Horseshoe Bend: one Tallapoosa (upstream part + the bend), upstream first
up = [l for l in RES["horseshoe"].get("lines", []) if l["name"].startswith("Tallapoosa River upstream")]
bend = [l for l in RES["horseshoe"].get("lines", []) if l["name"].startswith("Tallapoosa River at Horseshoe")]
if up and bend:
    A = [tuple(p) for p in up[0]["pts"]]; B = [tuple(p) for p in bend[0]["pts"]]
    j = int(np.argmin([math.hypot(a - A[-1][0], b - A[-1][1]) for a, b in B]))
    RIVERS.append(line("Tallapoosa River (Horseshoe Bend)", "river", A + B[j + 1:], "research geo_horseshoe (USGS NHD), joined", 60,
                       "upstream first: NE arm -> loop round the peninsula -> NW; the 1814 river, no reservoir here (Lake Martin is downstream)"))
else:
    for i, L in enumerate(osm_lines("Tallapoosa River (Horseshoe Bend)")): RIVERS.append(mline(f"Tallapoosa River (Horseshoe Bend){'' if i == 0 else ' ' + str(i + 1)}", "river", L, "OSM", 80))

# ============================================================ roads (1814-15) ============================================================
ROADS = []
# river roads on the levee, both banks of the Mississippi below the city (the 'levee road'), 0.55 units inside the bank
for side, nm in ((1, "River road, east bank (levee road)"), (-1, "River road, west bank (levee road)")):
    Lr = smooth(offset(MISS_D, side * (W_MISS / 2 + 0.55)), 6)[::4]
    a, b = to_map(29.99, -90.13), to_map(29.80, -89.80)
    keep = (Lr[:, 0] > a[0]) & (Lr[:, 0] < b[0])
    ROADS.append(mline(nm, "road", Lr[keep], "derived: OSM river centre line offset to the levee (Latour: the road ran along the levee)", 150,
                       "east bank = Jackson's road from the city to the line and on to Villere; west bank = Morgan's / Thornton's road"))
# Baton Rouge -> New Orleans along the east bank (gulf map scale: the gulf ribbon is 3.2 z8 units wide -> offset 2.2 z8 units = 8.8 base units)
_M = longest("Mississippi River"); _M = _M if _M[0][1] < _M[-1][1] else _M[::-1]
_R = smooth(offset(densify(_M, 2.0), 8.8), 3); _br, _no = np.array(to_map(30.4515, -91.1871)), np.array(to_map(29.9575, -90.0629))
_i0 = int(np.argmin(np.hypot(*(_R - _br).T))); _i1 = int(np.argmin(np.hypot(*(_R - _no).T)))
ROADS.append(mline("River road, Baton Rouge - New Orleans", "road", np.vstack([_br, _R[min(_i0, _i1):max(_i0, _i1) + 1], _no]), "derived: OSM river offset to the east-bank levee (gulf scale)", 3000))
ROADS += [
 line("Federal Road (1811)", "road", [(32.347, -85.02), (32.36, -85.25), (32.33, -85.47), (32.42, -85.69), (32.37, -86.09), (32.17, -86.40),
      (31.86, -86.75), (31.55, -87.17), (31.38, -87.50), (31.20, -87.82), (31.085, -88.005)], "EST (Fort Mitchell - Fort Bainbridge - Fort Hull - Mount Meigs - Burnt Corn - Fort Mims area - Fort Stoddert)", 6000, "VERIFY waypoints"),
 line("Mobile - Pensacola road", "road", [(30.6912, -88.0425), (30.74, -87.92), (30.70, -87.75), (30.55, -87.50), (30.4107, -87.2112)], "EST (via Blakeley, round the bay heads)", 6000),
 line("Mobile - Fort Stoddert road", "road", [(30.6912, -88.0425), (30.85, -88.06), (31.085, -88.005)], "EST", 4000),
 line("Natchez - Baton Rouge road", "road", [(31.5604, -91.4032), (31.20, -91.30), (30.85, -91.25), (30.4515, -91.1871)], "EST", 6000),
 line("Gentilly road (Chef Menteur road)", "road", [(29.9575, -90.0629), (29.99, -89.98), (30.03, -89.88), (30.0648, -89.8046)], "EST", 2500, "Jackson guarded it against a landing at Chef Menteur"),
]
for l in RES["horseshoe"].get("lines", []):
    if l["name"].startswith("Jackson's approach"):
        ROADS.append(line("Jackson's approach (1814 trail)", "road", l["pts"], l.get("src", "research"), 1500, "schematic trail from the 26 Mar camp to the neck"))
for J in RES.values():
    for l in J.get("lines", []):
        if l.get("kind") == "road" and "river road" not in l["name"].lower():
            ROADS.append(line(l["name"], "road", l["pts"], l.get("src", "research"), l.get("acc_m", 300)))

# ============================================================ works ============================================================
WORKS = [mline("Jackson's line (Rodriguez Canal rampart)", "breastwork", LINE_PTS, "research Latour shape fitted onto the OSM canal", 200, FIT_NOTE, side="us"),
         mline("Jackson's line, straight leg (river to wood)", "breastwork", LINE_PTS[:2], "as above", 200, side="us"),
         mline("Jackson's line, swamp leg", "breastwork", LINE_PTS[1:], "as above", 400, side="us")]
for J, k in ((RES["neworleans"], "neworleans"), (RES["horseshoe"], "horseshoe")):
    for l in J.get("lines", []):
        if l.get("kind") in ("gb_works", "breastwork"):
            pts = [fit_ll(a, b) for a, b in l["pts"]] if k == "neworleans" and needs_fit(l["name"]) else l["pts"]
            WORKS.append(line(l["name"], "breastwork", pts, l.get("src", "research"), l.get("acc_m", 300), side="gb" if "gb" in l["kind"] else "rs"))

# ============================================================ moves (research lines: routes / columns) + units ============================================================
MOVES = []
for k, J in RES.items():
    for l in J.get("lines", []):
        if l.get("kind") in ("river", "road", "gb_works", "breastwork", "us_line"): continue
        pts = [fit_ll(a, b) for a, b in l["pts"]] if k == "neworleans" and needs_fit(l["name"]) else l["pts"]
        if k == "neworleans" and remap(l["name"], *l["pts"][0]):
            pts = [remap(l["name"], a, b) if np.hypot(*(np.array(to_map(a, b)) - R0)) > 4 else fit_ll(a, b) for a, b in l["pts"]]
        MOVES.append(line(l["name"], l.get("kind", "move"), pts, l.get("src", "research"), l.get("acc_m", 500)))
UNITS = []
for k, J in RES.items():
    for u in J.get("units", []):
        if u.get("lat") is None: continue
        f = k == "neworleans" and needs_fit(u["unit"], u.get("battle"), u.get("side"))
        la, lo = fit_ll(u["lat"], u["lon"]) if f else (u["lat"], u["lon"])
        mv = [fit_ll(a, b) if f else (a, b) for a, b in (u.get("moves_to") or [])]
        if k == "neworleans" and remap(u["unit"], u["lat"], u["lon"]):
            la, lo = remap(u["unit"], u["lat"], u["lon"]); mv = [remap(u["unit"], a, b) for a, b in (u.get("moves_to") or [])]; f = "river_frame"
        x, y = to_map(la, lo)
        UNITS.append(dict(u, lat=round(la, 6), lon=round(lo, 6), x=round(x, 2), y=round(y, 2), moves_to_xy=[xy(a, b) for a, b in mv],
                          fitted=f, battle=u.get("battle", k)))

geo = dict(_doc="Battle 20 (Andrew Jackson) geodata for the 3D worlds. x, y = BASE frame units (ajackson/data/frame.json: web mercator z10, origin [64288,104976], "
                "x east, y south; 132.5 m/unit at New Orleans, 128.3 m at Horseshoe Bend). A region of zoom z uses x * 2^(z-10). Built by ajackson/tools/make_geo.py "
                "from OSM lines + the research files; Jackson's line fitted onto the OSM Rodriguez Canal (see the places' notes).",
           frame=dict(name=P.frame["name"], zoom=P.zoom, origin_world_px=P.origin, engine_mpu=P.engine_mpu),
           places=PLACES, rivers=RIVERS, roads=ROADS, works=WORKS, moves=MOVES, units=UNITS)
json.dump(geo, open(f"{HERE}/data/geo.json", "w"), indent=1, ensure_ascii=False)
print(f"{len(PLACES)} places, {len(RIVERS)} rivers, {len(ROADS)} roads, {len(WORKS)} works, {len(MOVES)} moves, {len(UNITS)} units -> ajackson/data/geo.json")
print(FIT_NOTE)
for nm in ("Jackson's line, river end", "Jackson's line, elbow", "Jackson's line, swamp end", "Villere plantation house", "De la Ronde plantation",
           "Lacoste plantation", "Macarty house", "Breastwork (barricade) centre", "Tohopeka village site", "Gun Hill", "Cherokee canoe crossing"):
    p = next((q for q in PLACES if q["name"].startswith(nm)), None)
    if p: print(f"  {p['name'][:60]:60s} base ({p['x']:.1f}, {p['y']:.1f})  lat/lon {p['lat']:.5f}, {p['lon']:.5f}")
