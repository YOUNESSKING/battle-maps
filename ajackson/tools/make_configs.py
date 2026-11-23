#!/usr/bin/env python3
"""Write the world configs ajackson/worlds/configs/{gulf,chalmette,horseshoe,neworleans}.json from ajackson/data/geo.json
(positions that depend on the research geography, e.g. plantation houses set back from the 1815 bank, are computed here).
usage: python3 ajackson/tools/make_configs.py   then   VX_PROJECT=ajackson python3 vicksburg/tools/bake_world.py all
Coordinates inside a config are in THAT region's frame (zoom): gulf z8 = base / 4, chalmette + neworleans z10 = base, horseshoe z11 = base x 2."""
import json, math, sys
import numpy as np
REPO = "/home/user/battle-maps"; HERE = f"{REPO}/ajackson"; OUT = f"{HERE}/worlds/configs"
G = json.load(open(f"{HERE}/data/geo.json"))
PL = {p["name"]: p for p in G["places"]}
RV = {r["name"]: np.array(r["pts"], float) for r in G["rivers"]}


def pl(prefix, k=1.0):
    for n, p in PL.items():
        if n.startswith(prefix): return [round(p["x"] * k, 2), round(p["y"] * k, 2)]
    for u in G.get("units", []):   # unit records (e.g. the 8 Jan advanced redoubt)
        if u["unit"].startswith(prefix): return [round(u["x"] * k, 2), round(u["y"] * k, 2)]
    raise KeyError(prefix)


def dens(L, step=0.2):
    out = [L[0]]
    for a, b in zip(L[:-1], L[1:]):
        n = max(1, int(math.ceil(np.hypot(*(b - a)) / step))); out += [a + (b - a) * i / n for i in range(1, n + 1)]
    return np.array(out)


MISS = dens(RV["Mississippi River (New Orleans)"]); W_MISS = 5.8
def bank_frame(p):
    """nearest river point, unit flow tangent, inland normal (toward p), distance"""
    d = np.hypot(MISS[:, 0] - p[0], MISS[:, 1] - p[1]); i = int(d.argmin())
    t = MISS[min(i + 3, len(MISS) - 1)] - MISS[max(i - 3, 0)]; t /= np.linalg.norm(t); n = np.array([t[1], -t[0]])
    if np.dot(np.asarray(p) - MISS[i], n) < 0: n = -n
    return MISS[i], t, n, float(d[i])


def plantation_at(p, inset=1.45, along=0.0):
    """a plantation house `inset` units inside the bank (behind the levee road), quarters lane running inland; returns (at, angle deg)"""
    c, t, n, _ = bank_frame(p); q = c + t * along + n * (W_MISS / 2 + inset)
    a = math.degrees(math.atan2(-n[0], n[1]))   # Settle.plantation: lane along v = (-sin a, cos a) = n
    return [round(float(q[0]), 2), round(float(q[1]), 2)], round(a, 1)


def write(name, cfg):
    json.dump(cfg, open(f"{OUT}/{name}.json", "w"), indent=1); print("->", f"{OUT}/{name}.json")


# ============================================================ gulf (wide, zoom 8) ============================================================
GW = {"Mississippi River": 3.2, "Alabama River": 1.3, "Tombigbee River": 1.2, "Mobile River": 1.6, "Tensaw River": 0.9, "Coosa River": 1.2,
      "Tallapoosa River": 1.0, "Pearl River": 0.9, "Pascagoula River": 1.0, "Black Warrior River": 1.0, "Chattahoochee River": 1.2,
      "Conecuh River": 0.8, "Escambia River": 0.9, "Cahaba River": 0.7, "Leaf River": 0.7, "Chickasawhay River": 0.7, "Choctawhatchee River": 0.8,
      "Perdido River": 0.6, "Yellow River": 0.6, "Amite River": 0.6}
write("gulf", {
 "mode": "wide", "zoom": 8,
 "note": "Gulf strategic map 1813-15 (overview + the cloud dives): New Orleans, Lakes Borgne / Pontchartrain, Mobile, Pensacola, Fort Mims, the Alabama / "
         "Tombigbee / Coosa / Tallapoosa (Horseshoe Bend), the Gulf of Mexico. Zoom-8 frame: 1 unit = ~523 m (base units / 4). Modern reservoirs filled "
         "from the banks (1814 rivers only); coast + lakes = DEM <= 0 m (delta roughly as today).",
 "box": [20, 22, 1206, 1024],
 "stills": [{"at": [623, 560], "dist": 1150, "tilt": 30, "yaw": 0}, {"at": [300, 790], "dist": 330, "tilt": 44, "yaw": 0}, {"at": [1088, 165], "dist": 170, "tilt": 52, "yaw": -8}], "hm_ppu": 1.5, "tex": 8192, "exag": 14.0, "cell": 34.0, "seed": 1814,
 "dem_ppu": 2, "dem_margin": 24,
 "dem_edits": {"sea": {"level": 0.0, "min_px": 300, "island_px": 40,
                       "seeds": [[30.18, -90.10], [30.25, -90.45], [30.03, -89.62], [30.45, -88.00], [30.40, -87.10], [30.38, -86.40]]},
               "fill_water": True, "spike_m": 60.0, "sea_floor_m": 0.0},
 "sea_look": {"shelf_u": 6.0},
 "creek_km2": 150.0, "creeks": {"paint_km2": 600, "ribbon_km2": 1e9},
 "woods": -0.03, "villages": 0,
 "rivers": [{"name": n, "geo": [n], "w": w, "step": 1.0, **({"snap": False} if n in ("Mississippi River", "Mobile River", "Tensaw River") else {})} for n, w in GW.items()],
 "roads": [{"geo": n, "cls": "pike"} for n in ("Federal Road (1811)", "Mobile - Pensacola road", "Mobile - Fort Stoddert road", "River road, Baton Rouge - New Orleans",
                                              "Natchez - Baton Rouge road", "Gentilly road (Chef Menteur road)")],
 "towns": [{"name": "New Orleans", "geo": "New Orleans", "rad": 3.2, "houses": 40, "grid": {"block": 1.4, "angle": -38}},
           {"name": "Mobile", "geo": "Mobile", "rad": 2.0, "houses": 18, "grid": {"block": 1.3}},
           {"name": "Pensacola", "geo": "Pensacola", "rad": 1.8, "houses": 16, "grid": {"block": 1.3}},
           {"name": "Baton Rouge", "geo": "Baton Rouge", "rad": 1.4, "houses": 10},
           {"name": "Natchez", "geo": "Natchez", "rad": 1.6, "houses": 12},
           {"name": "St. Stephens", "geo": "St. Stephens", "rad": 1.0, "houses": 6},
           {"name": "Fort Stoddert", "geo": "Fort Stoddert", "rad": 0.7, "houses": 4},
           {"name": "Fort Mims", "geo": "Fort Mims", "rad": 0.6, "houses": 4},
           {"name": "Fort Jackson", "geo": "Fort Jackson", "rad": 0.7, "houses": 4},
           {"name": "Tuckabatchee", "geo": "Tuckabatchee", "rad": 0.9, "houses": 6, "snap": False}],
 "features": {"works": []},
 "labels": ["Horseshoe Bend", "Fort Bowyer", "Fort St. Philip", "Lake Borgne", "Lake Pontchartrain", "Mobile Bay", "Gulf of Mexico", "Pea Island", "Cat Island",
            "Fort Williams", "Fort Mims", "Chalmette Battlefield (park centre)"],
})

# ============================================================ chalmette (close, zoom 10) ============================================================
line_pts = next(w for w in G["works"] if w["name"].startswith("Jackson's line (Rodriguez"))["pts"]
front = [round(line_pts[0][0] + 8.0, 1), round(line_pts[0][1] - 1.0, 1)]   # a point on the British side (downstream) for the works' facing
plants = []
for nm, key, inset, along in (("Macarty", "Macarty house", 1.25, -0.8), ("Chalmette", "Chalmette plantation house", 1.35, 0.6), ("Bienvenu", "Bienvenu plantation", 1.45, 0),
                              ("De la Ronde", "De la Ronde plantation", 1.6, 0), ("Lacoste", "Lacoste plantation", 1.45, 0), ("Villere", "Villere plantation house", 1.45, 0)):
    at, a = plantation_at(pl(key), inset, along); plants.append({"name": nm, "at": at, "kind": "plantation", "angle": a})
# more long-lot plantations (houses on both banks every ~1.3-1.8 km; unnamed)
extra = []
for x in (1240.0, 1294.0, 1300.0):
    c = MISS[np.argmin(np.abs(MISS[:, 0] - x) + (MISS[:, 1] > 3250) * 99)]; at, a = plantation_at(c + [0, -6]); extra.append({"name": f"_p{int(x)}", "at": at, "kind": "plantation", "angle": a})
for x in (1242.0, 1256.0, 1268.0, 1281.0, 1293.0):
    c = MISS[np.argmin(np.abs(MISS[:, 0] - x) + (MISS[:, 1] > 3255) * 99)]; at, a = plantation_at(c + [0, 6], 1.5); extra.append({"name": f"_w{int(x)}", "at": at, "kind": "plantation", "angle": a})
pat = pl("Marine Battery"); c, t, n, _ = bank_frame(pat); pb = c + n * (W_MISS / 2 + 0.45)
mor = pl("Morgan's forward"); c2, t2, n2, _ = bank_frame(mor); m0 = c2 + n2 * (W_MISS / 2 + 0.7); m1 = c2 + n2 * (W_MISS / 2 + 7.5)
redoubt = pl("Advanced redoubt")
write("chalmette", {
 "mode": "close", "zoom": 10,
 "note": "Chalmette (Dec 1814 - Jan 1815): the sugar plantations between the Mississippi and the cypress swamp, from the Macarty house (Jackson HQ) "
         "past Jackson's line on the Rodriguez Canal down to Villere (British HQ), the Villere canal north to Bayou Bienvenue, the west bank "
         "(Patterson's battery, Morgan's line). Terrain = a synthetic natural levee (the modern DEM is levees, canals and streets): 4 m at the bank "
         "to 0.3 m at the swamp. Long-lot cane fields, cypress swamp band, open marsh beyond.",
 "box": [1236, 3184, 70, 70], "focus": [1254.5, 3226.5], "hm_ppu": 8, "tex": 4096, "exag": 6.0, "cell": 5.2, "seed": 1815, "relief_noise": [0.35, 0.12],
 "dem_ppu": 8, "dem_margin": 6,
 "dem_edits": {"synth_levee": {"river": "Mississippi River (New Orleans)", "crest_m": 4.0, "base_m": 0.3, "half_w": W_MISS / 2, "width_u": 9.0, "pow": 1.25, "noise_m": 0.2}},
 "creeks": {"paint_km2": 1e9, "ribbon_km2": 1e9},
 "longlots": {"river": "Mississippi River (New Orleans)", "w": 1.5, "depth": 2.6, "bank": 3.5},
 "swamp_band": {"river": "Mississippi River (New Orleans)", "from_x": [[1236, 9.0], [1246, 8.2], [1252, 7.9], [1262, 9.0], [1276, 11.0], [1306, 12.5]],
                "to_x": [[1236, 15.0], [1262, 17.0], [1306, 21.0]], "jag": 2.0, "hummock": 0.8},
 "woods": -0.25,
 "rivers": [{"name": "Mississippi River", "geo": "Mississippi River (New Orleans)", "w": W_MISS, "step": 0.12, "snap": False, "smooth": 8},
            {"name": "Bayou Bienvenue", "geo": "Bayou Bienvenue", "w": 0.45, "step": 0.12, "snap": False, "smooth": 6, "meander": 0.12, "meander_wl": 2.5},
            {"name": "Villere canal", "geo": "Villere canal", "w": 0.12, "step": 0.1, "snap": False, "smooth": 4}],
 "roads": [{"name": "River road, east bank", "geo": "River road, east bank (levee road)", "cls": "pike", "meander": 0},
           {"name": "River road, west bank", "geo": "River road, west bank (levee road)", "cls": "pike", "meander": 0}],
 "towns": plants + extra,
 "farm_density": 0.0, "plantation_density": 0.0, "lane_p": 0.0,
 "features": {"works": [
     {"name": "Jackson's line (Rodriguez Canal rampart)", "geo": "Jackson's line (Rodriguez Canal rampart)", "kind": "breastwork", "side": "us", "face_to": front, "height": 1.8, "clear": 0.6},
     {"name": "advanced redoubt", "at": redoubt, "shape": "redan", "kind": "redan", "side": "us", "size": 0.32, "face": 15, "height": 1.4, "clear": 0.3},
     {"name": "British batteries (1 Jan)", "geo": "British advance redoubt/battery line", "kind": "breastwork", "side": "gb", "face_to": line_pts[1], "height": 1.0, "clear": 0.3},
     {"name": "Patterson's battery", "at": [round(float(pb[0]), 2), round(float(pb[1]), 2)], "shape": "battery", "kind": "battery", "side": "us", "size": 0.45,
      "face": round(math.degrees(math.atan2(-n[1], -n[0])), 1), "height": 1.2, "clear": 0.3, "guns": 3},
     {"name": "Morgan's line (west bank)", "pts": [[round(float(m0[0]), 2), round(float(m0[1]), 2)], [round(float(m1[0]), 2), round(float(m1[1]), 2)]], "kind": "breastwork", "side": "us",
      "face": round(math.degrees(math.atan2(t2[1], t2[0])), 1), "height": 1.0, "clear": 0.4}]},
 "labels": ["Chalmette Monument", "Chalmette National Cemetery", "Rodriguez Canal (NPS preserved section)", "Jackson's line, river end", "Jackson's line, elbow",
            "Jackson's line, swamp end", "Macarty house", "Villere plantation house", "De la Ronde plantation", "Lacoste plantation", "Bienvenu plantation",
            "USS Carolina anchorage", "Villere canal head", "Marine Battery", "Morgan's forward", "Pakenham Oaks"],
})

# ============================================================ horseshoe (close, zoom 11) ============================================================
K = 2.0
bw = next(w for w in G["works"] if w["name"].startswith("Red Stick breastwork"))["pts"]
bw = (np.array(bw) * K).tolist()
gun = pl("Gun Hill", K)
TAL = dens(np.array(next(r for r in G["rivers"] if r["name"] == "Tallapoosa River (Horseshoe Bend)")["pts"]) * K, 0.1); W_TAL = 1.7
def to_bank(p, d, gap=0.25):   # walk from p along d until the Tallapoosa's bank
    p = np.asarray(p, float); d = np.asarray(d, float) / np.linalg.norm(d)
    for _ in range(400):
        if np.hypot(TAL[:, 0] - p[0], TAL[:, 1] - p[1]).min() < W_TAL / 2 + gap: break
        p = p + d * 0.05
    return [round(float(p[0]), 2), round(float(p[1]), 2)]
bw = [to_bank(bw[0], np.subtract(bw[0], bw[1]))] + bw + [to_bank(bw[-1], np.subtract(bw[-1], bw[-2]))]   # close the neck bank to bank (research: ends met the banks)
cen = np.array(pl("Horseshoe Bend (Tohopeka", K)); vil = np.array(pl("Tohopeka village", K))
vil = vil + (cen - vil) / np.linalg.norm(cen - vil) * 2.6   # research point sits on the toe's channel: the houses go just inside the bank
write("horseshoe", {
 "mode": "close", "zoom": 11,
 "note": "Horseshoe Bend (27 Mar 1814): the Tallapoosa's loop round the Tohopeka peninsula (toe south), the Red Stick log breastwork across the neck, "
         "Gun Hill north of it, Tohopeka village at the toe, Coffee's bank south / west, Bean's island. Zoom-11 frame: 1 unit = ~64 m (base units x 2). "
         "The 1814 river (no reservoir: Lake Martin lies downstream; wide flat water in the DEM filled from the banks).",
 "box": [8656, 1243, 92, 70], "focus": [8704.5, 1281.0], "hm_ppu": 8, "tex": 7168, "exag": 3.0, "cell": 2.8, "seed": 1814, "relief_noise": [1.0, 0.35],
 "dem_ppu": 8, "dem_margin": 6, "dem_edits": {"fill_water": True, "flat_sd": 0.15, "flat_low": 0.6},
 "creek_km2": 0.4, "creeks": {"paint_km2": 0.8, "ribbon_km2": 1e9},
 "woods": 0.14, "ravine_woods": 0.6, "tree_spacing": 0.25,
 "clear": [[float(vil[0]), float(vil[1]), 2.6], [gun[0], gun[1], 1.6], [bw[3][0], bw[3][1], 1.5], [pl("Cotton Patch Hill", K)[0], pl("Cotton Patch Hill", K)[1], 1.8]],
 "rivers": [{"name": "Tallapoosa River", "geo": "Tallapoosa River (Horseshoe Bend)", "w": 1.7, "step": 0.12, "snap": False, "smooth": 6, "keep": 1.6}],
 "roads": [{"name": "Jackson's approach", "geo": "Jackson's approach (1814 trail)", "cls": "lane", "meander": 0.15}],
 "towns": [{"name": "Tohopeka", "at": [round(float(vil[0]), 2), round(float(vil[1]), 2)], "kind": "hamlet", "len": 2.4, "angle": 20}],
 "farm_density": 0.0, "plantation_density": 0.0, "lane_p": 0.0,
 "features": {"works": [{"name": "Red Stick breastwork", "pts": bw, "kind": "breastwork", "side": "rs", "face_to": gun, "height": 1.6, "clear": 0.8}]},
 "labels": ["Breastwork (barricade) centre", "Tohopeka village site", "Gun Hill", "Cotton Patch Hill", "Bean's island", "Cherokee canoe crossing",
            "Coffee's mounted brigade", "Hammond's rangers", "Emuckfaw Creek mouth"],
})

# ============================================================ neworleans (wide, zoom 10: shares coordinates with chalmette) ============================================================
write("neworleans", {
 "mode": "wide", "zoom": 10,
 "note": "New Orleans approaches, Dec 1814 (~78 x 61 km): the city, the river to English Turn, Lake Borgne + Bayou Bienvenue (the British route), "
         "Lake Pontchartrain, the Rigolets, Chef Menteur. Base frame (zoom 10), so units / places match chalmette directly. Modern canals "
         "(Industrial Canal, MRGO, Intracoastal) erased from the water mask (opening) and filled; city basins below sea level are land.",
 "box": [1010, 2924, 590, 462], "hm_ppu": 2.5, "tex": 8192, "exag": 14.0, "cell": 9.0, "seed": 1814,
 "stills": [{"at": [1305, 3155], "dist": 640, "tilt": 30, "yaw": 0}, {"at": [1290, 3200], "dist": 300, "tilt": 44, "yaw": 0}, {"at": [1258, 3222], "dist": 150, "tilt": 52, "yaw": -8}],
 "dem_ppu": 2, "dem_margin": 24,
 "dem_edits": {"sea": {"level": 0.1, "min_px": 1e12, "open_px": 7, "close_px": 11, "island_px": 60,
                       "seeds": [[30.18, -90.10], [30.25, -90.45], [30.03, -89.62], [30.10, -89.75], [29.72, -90.25]]},
               "fill_water": True, "spike_m": 40.0, "sea_floor_m": 0.0},
 "creek_km2": 1e6, "creeks": {"paint_km2": 1e9, "ribbon_km2": 1e9},
 "woods": 0.0, "villages": 0, "swamp": 0.0,
 "rivers": [{"name": "Mississippi River", "geo": "Mississippi River (New Orleans)", "w": 5.0, "step": 1.0, "snap": False},
            {"name": "Pearl River", "geo": "Pearl River", "w": 1.4, "step": 1.0, "snap": False},
            {"name": "Bayou Bienvenue", "geo": "Bayou Bienvenue", "w": 0.9, "step": 0.6, "snap": False},
            {"name": "Villere canal", "geo": "Villere canal", "w": 0.3, "step": 0.5, "snap": False}],
 "roads": [{"geo": "River road, east bank (levee road)", "cls": "pike"}, {"geo": "River road, west bank (levee road)", "cls": "pike"},
           {"name": "Gentilly road (Chef Menteur road)", "cls": "pike", "ll": [[29.9575, -90.0629], [29.968, -90.045], [29.982, -90.03], [29.996, -90.008], [30.008, -89.985],
             [30.019, -89.958], [30.031, -89.93], [30.042, -89.9], [30.051, -89.868], [30.058, -89.835], [30.0648, -89.8046]]}],
 "towns": [{"name": "New Orleans", "geo": "New Orleans", "rad": 6.5, "houses": 90, "grid": {"block": 2.6, "angle": -38}}]
          + [{"name": nm, "at": t["at"], "rad": 0.7, "houses": 3} for nm, t in ((q["name"], q) for q in plants)],
 "features": {"works": [{"name": "Jackson's line", "geo": "Jackson's line (Rodriguez Canal rampart)", "kind": "breastwork", "side": "us", "face": 30, "height": 2.0, "clear": 0.5}]},
 "labels": ["Lake Borgne", "Lake Pontchartrain", "Chef Menteur", "Fort Petites Coquilles", "English Turn", "Villere plantation house", "Villere canal head",
            "Bayou Bienvenue mouth", "Jackson's line, river end"],
})
