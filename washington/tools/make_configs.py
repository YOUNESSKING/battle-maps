#!/usr/bin/env python3
"""Write the world configs washington/worlds/configs/{colonies,jersey,brooklyn,crossing,trenton,princeton}.json from washington/data/geo.json.
usage: python3 washington/tools/make_configs.py   then   VX_PROJECT=washington python3 vicksburg/tools/bake_world.py <region>   (one by one: RAM)
Coordinates inside a config are in THAT region's frame (zoom): colonies z9 = base / 2, jersey z10 = base, brooklyn / trenton / princeton z11 =
base x 2, crossing z12 = base x 4. Season: "winter" on jersey / crossing / trenton / princeton (bake_world.winter_ground + engine bare woods,
shore ice, floes); colonies + brooklyn = the approved summer look (Brooklyn: 27-30 Aug 1776)."""
import json, math, sys
import numpy as np
REPO = "/home/user/battle-maps"; HERE = f"{REPO}/washington"; OUT = f"{HERE}/worlds/configs"
sys.path.insert(0, f"{REPO}/vicksburg/tools")
from vx_project import Project
P = Project("washington")
G = json.load(open(f"{HERE}/data/geo.json"))
WK = {w["name"]: w for w in G["works"]}
def work_geo(*names):   # the first works line present in geo.json (research names first, then the built-in)
    for n in names:
        for k in WK:
            if k.startswith(n): return k
    return names[-1]
PL = {p["name"]: p for p in G["places"]}


def pl(prefix, zoom=10):
    k = 2.0 ** (zoom - 10)
    for n, p in PL.items():
        if n.startswith(prefix): return [round(p["x"] * k, 2), round(p["y"] * k, 2)]
    raise KeyError(prefix)


def ll(la, lo, zoom): x, y = P.to_map(la, lo, zoom); return [round(x, 2), round(y, 2)]


def box_ll(S, W, N, E, zoom, r=1):
    """[x0, y0, w, h] in that zoom's units covering the lat/lon box, rounded to r"""
    x0, y0 = P.to_map(N, W, zoom); x1, y1 = P.to_map(S, E, zoom)
    x0, y0 = math.floor(x0 / r) * r, math.floor(y0 / r) * r; return [x0, y0, math.ceil((x1 - x0) / r) * r, math.ceil((y1 - y0) / r) * r]


def write(name, cfg):
    json.dump(cfg, open(f"{OUT}/{name}.json", "w"), indent=1); print("->", f"{OUT}/{name}.json", cfg["box"])


WINTER = {"snow": 0.6, "snow_alpha": 0.66, "desat": 0.45, "ice": 1.0, "conifers": 0.16}   # tuned on the winter test sheet (worlds/previews/winter_test.jpg)

# ============================================================ colonies (wide, zoom 9) ============================================================
Z = 9
CW = {"Delaware River": 1.4, "Schuylkill River": 0.7, "Raritan River": 0.7, "Passaic River": 0.6, "Hackensack River": 0.6, "Millstone River": 0.35,
      "Neshaminy Creek": 0.35, "Crosswicks Creek": 0.35, "Assunpink Creek": 0.25, "Saddle River": 0.25, "Bronx River": 0.25, "Pennypack Creek": 0.25}
cb = box_ll(39.84, -75.36, 41.06, -73.54, Z)
write("colonies", {
 "mode": "wide", "zoom": Z,
 "note": "Strategic map 1776-77 (overview + the cloud dives): New York harbour, Manhattan, the west end of Long Island, Staten Island, the Hudson, "
         "New Jersey (Newark, Elizabeth Town, Perth Amboy, New Brunswick, Princeton, Trenton, Morristown) down the Delaware to Philadelphia. "
         "Zoom-9 frame: 1 unit = ~232 m (base units / 2). Harbour, sounds, the Hudson / East River and the tidal Delaware = DEM <= 0.5 m (sea mask); "
         "modern reservoirs filled from the banks. Summer-neutral ground (the approved look).",
 "box": cb,
 "stills": [{"at": [cb[0] + cb[2] / 2, cb[1] + cb[3] / 2], "dist": 760, "tilt": 30, "yaw": 0}, {"at": pl("New York", Z), "dist": 260, "tilt": 44, "yaw": 0},
            {"at": pl("Trenton", Z), "dist": 170, "tilt": 52, "yaw": -8}],
 "hm_ppu": 1.5, "tex": 8192, "exag": 6.0, "cell": 30.0, "seed": 1776,
 "dem_ppu": 2, "dem_margin": 24,
 "dem_edits": {"sea": {"level": 0.5, "min_px": 300, "island_px": 40, "open_px": 3,
                       "seeds": [[40.665, -74.045], [40.53, -74.03], [40.49, -74.18], [40.67, -74.135], [40.74, -73.968], [40.83, -73.93], [40.86, -73.78],
                                 [41.00, -73.905], [40.80, -73.99], [39.95, -75.13], [40.10, -74.85], [40.15, -74.73], [40.60, -74.20]]},
               "fill_water": True, "spike_m": 60.0, "sea_floor_m": 0.0},
 "sea_look": {"deep": "#33505f", "shallow": "#5f8288", "shelf_u": 6.0, "beach_u": 0.5, "line_u": 0.2},
 "creek_km2": 120.0, "creeks": {"paint_km2": 400, "ribbon_km2": 1e9},
 "woods": 0.04, "villages": 6, "wood_soft": {"blur_u": 0.5, "alpha": 0.85},
 "tex_grade": {"contrast": 1.22, "sat": 1.3, "gamma": 0.97}, "river_halo_u": 0.5,
 "rivers": [{"name": n, "geo": [n], "w": w, "step": 1.0, **({"snap": False} if w >= 1.0 else {})} for n, w in CW.items()],
 "roads": [{"geo": r["name"], "cls": "pike"} for r in G["roads"] if not r["name"].startswith(("Trenton streets", "Bear Tavern", "Birmingham", "Scotch", "Saw Mill", "Sandtown", "Quaker", "River road (PA)", "Gowanus road", "Jamaica road", "Brooklyn - Flatbush"))]
          + [{"geo": n, "cls": "lane"} for n in ("Gowanus road (Brooklyn - Gravesend)", "Jamaica road (Bedford - Jamaica Pass - Jamaica)", "Brooklyn - Flatbush - Jamaica roads")],
 "towns": [{"name": "New York", "geo": "New York", "rad": 1.7, "houses": 34, "grid": {"block": 0.75, "angle": -61}, "snap": False},
           {"name": "Philadelphia", "geo": "Philadelphia", "rad": 2.4, "houses": 44, "grid": {"block": 0.8, "angle": 0}},
           {"name": "Brooklyn", "geo": "Brooklyn", "rad": 0.6, "houses": 6},
           {"name": "Newark", "geo": "Newark", "rad": 0.9, "houses": 10}, {"name": "Elizabeth Town", "geo": "Elizabeth Town", "rad": 0.9, "houses": 10},
           {"name": "Perth Amboy", "geo": "Perth Amboy", "rad": 0.8, "houses": 9}, {"name": "New Brunswick", "geo": "New Brunswick", "rad": 0.9, "houses": 10},
           {"name": "Princeton", "geo": "Princeton", "rad": 0.7, "houses": 8}, {"name": "Trenton", "geo": "Trenton", "rad": 0.8, "houses": 10},
           {"name": "Bordentown", "geo": "Bordentown", "rad": 0.6, "houses": 6}, {"name": "Burlington", "geo": "Burlington", "rad": 0.7, "houses": 8},
           {"name": "Bristol", "geo": "Bristol", "rad": 0.6, "houses": 6}, {"name": "Hackensack", "geo": "Hackensack", "rad": 0.6, "houses": 6},
           {"name": "Morristown", "geo": "Morristown", "rad": 0.7, "houses": 7}, {"name": "White Plains", "geo": "White Plains", "rad": 0.6, "houses": 6},
           {"name": "Germantown", "geo": "Germantown", "rad": 0.6, "houses": 7}, {"name": "Flatbush", "geo": "Flatbush", "rad": 0.5, "houses": 5},
           {"name": "Jamaica", "geo": "Jamaica", "rad": 0.5, "houses": 5}, {"name": "Kingston", "geo": "Kingston", "rad": 0.4, "houses": 4},
           {"name": "Woodbridge", "geo": "Woodbridge", "rad": 0.5, "houses": 5}, {"name": "Pennington", "geo": "Pennington", "rad": 0.4, "houses": 4},
           {"name": "Maidenhead", "geo": "Maidenhead", "rad": 0.4, "houses": 4}, {"name": "Harlem", "geo": "Harlem", "rad": 0.4, "houses": 4}],
 "features": {"works": []},
 "labels": ["McConkey's Ferry", "Fort Washington", "Fort Lee", "Kip's Bay", "Gravesend Bay", "Jamaica Pass", "Staten Island", "Long Island", "Manhattan",
            "Upper Bay", "Lower Bay", "Newark Bay", "Raritan Bay", "Paulus Hook", "Coryell's Ferry"],
})

# ============================================================ jersey (wide, zoom 10 = base) ============================================================
jb = box_ll(40.120, -74.905, 40.370, -74.625, 10)
write("jersey", {
 "mode": "wide", "zoom": 10, "season": "winter", "winter": WINTER,
 "note": "The Ten Crucial Days, 25 Dec 1776 - 3 Jan 1777 (~24 x 28 km, winter): McConkey's Ferry -> the Bear Tavern road -> Birmingham -> Trenton (River "
         "road / Pennington road), the Assunpink, the post road to Maidenhead and Princeton (Shabakunk, Stony Brook), the night march (Sandtown / "
         "Quaker Bridge / Saw Mill roads), Bordentown. Base frame (zoom 10). Modern reservoirs / Carnegie Lake / the D&R canal filled from the banks.",
 "box": jb, "hm_ppu": 2.5, "meshDiv": 2, "tex": 8192, "exag": 3.5, "cell": 6.5, "seed": 1776,
 "wood_soft": {"blur_u": 0.5, "alpha": 0.85}, "field_look": "gm",
 "tex_grade": {"contrast": 1.2, "sat": 1.3, "gamma": 0.97}, "river_halo_u": 0.25,
 "stills": [{"at": [jb[0] + jb[2] / 2, jb[1] + jb[3] / 2], "dist": 330, "tilt": 32, "yaw": 0}, {"at": pl("Trenton"), "dist": 150, "tilt": 44, "yaw": 0},
            {"at": pl("Johnson's Ferry"), "dist": 70, "tilt": 52, "yaw": -8}],
 "dem_ppu": 2, "dem_margin": 24, "dem_edits": {"fill_water": True, "spike_m": 40.0},
 "creek_km2": 4.0, "creeks": {"paint_km2": 8, "ribbon_km2": 1e9},
 "woods": 0.02, "villages": 5,
 "rivers": [{"name": "Delaware River", "geo": "Delaware River (fine)", "w": 2.6, "step": 0.6, "snap": False, "keep": 2.4},
            {"name": "Assunpink Creek", "geo": "Assunpink Creek", "w": 0.35, "step": 0.5}, {"name": "Stony Brook", "geo": "Stony Brook", "w": 0.35, "step": 0.5},
            {"name": "Shabakunk Creek", "geo": "Shabakunk Creek", "w": 0.2, "step": 0.5}, {"name": "Jacobs Creek", "geo": "Jacobs Creek", "w": 0.25, "step": 0.5},
            {"name": "Crosswicks Creek", "geo": "Crosswicks Creek", "w": 0.45, "step": 0.5}, {"name": "Millstone River", "geo": "Millstone River", "w": 0.4, "step": 0.5}],
 "roads": [{"geo": n, "cls": "pike"} for n in ("River road (NJ)", "River road (PA)", "Bear Tavern road", "Pennington road", "New York post road", "Trenton - Bordentown",
                                              "Philadelphia - Trenton post road", "Quaker Bridge road", "Saw Mill road", "Sandtown road")]
          + [{"geo": n, "cls": "lane"} for n in ("Birmingham - River road", "Birmingham - Pennington road", "Scotch road")],
 "towns": [{"name": "Trenton", "geo": "Trenton", "rad": 1.3, "houses": 26, "grid": {"block": 0.55, "angle": -60}, "snap": False},
           {"name": "Princeton", "geo": "Princeton", "rad": 1.1, "houses": 18}, {"name": "Pennington", "geo": "Pennington", "rad": 0.6, "houses": 7},
           {"name": "Maidenhead", "geo": "Maidenhead", "rad": 0.6, "houses": 7}, {"name": "Bordentown", "geo": "Bordentown", "rad": 0.8, "houses": 10},
           {"name": "Birmingham", "geo": "Birmingham", "rad": 0.4, "houses": 4}, {"name": "McConkey's Ferry", "geo": "McConkey's Ferry", "rad": 0.3, "houses": 3, "snap": False},
           {"name": "Johnson's Ferry", "geo": "Johnson's Ferry", "rad": 0.3, "houses": 2, "snap": False}],
 "features": {"works": []},
 "labels": ["McConkey's Ferry", "Johnson's Ferry", "Bear Tavern", "Jacobs Creek crossing", "Birmingham", "Assunpink bridge", "Mill Hill", "Quaker Bridge",
            "Stony Brook bridge", "Thomas Clarke house", "Shabakunk Creek (Five Mile Run) bridge", "Hermitage"],
})

# ============================================================ brooklyn (close, zoom 11) ============================================================
Z = 11
bb = box_ll(40.664, -74.030, 40.723, -73.960, Z)
NYC = pl("New York", Z)
# 1776 shoreline: modern landfill -> water (approx. from the 1766 Ratzer / 1776 maps: Manhattan's east shore ~ Water / Front St, west shore ~ Greenwich St,
# the Battery inside State St; Brooklyn's shore at the foot of the Heights (Furman St); the Navy Yard fill in Wallabout Bay; Governors Island's south half (1901-12 fill);
# Red Hook's Erie / Atlantic basins). The polygons only need the 1776 edge on the land side; their water side reaches out into the river.
FW = [
 [[40.7165, -74.0108], [40.7130, -74.0122], [40.7090, -74.0140], [40.7060, -74.0155], [40.7040, -74.0158], [40.7025, -74.0150], [40.7015, -74.0132],
  [40.6990, -74.0150], [40.7000, -74.0250], [40.7240, -74.0250], [40.7240, -74.0105]],                                   # Manhattan west + Battery
 [[40.7020, -74.0128], [40.7028, -74.0112], [40.7040, -74.0095], [40.7055, -74.0072], [40.7068, -74.0048], [40.7080, -74.0025], [40.7092, -74.0005],
  [40.7105, -73.9975], [40.7113, -73.9935], [40.7118, -73.9880], [40.7115, -73.9820], [40.7105, -73.9780], [40.7080, -73.9740], [40.7000, -73.9900], [40.6990, -74.0100]],   # Manhattan east
 [[40.7038, -73.9932], [40.7020, -73.9950], [40.6995, -73.9975], [40.6965, -73.9992], [40.6935, -74.0005], [40.6905, -74.0018], [40.6878, -74.0030],
  [40.6850, -74.0055], [40.6820, -74.0085], [40.6800, -74.0110], [40.6790, -74.0150], [40.6830, -74.0115], [40.6880, -74.0082], [40.6930, -74.0058],
  [40.6990, -74.0035], [40.7045, -73.9975]],   # Brooklyn piers / Atlantic basin (water side in Buttermilk Channel, east of Governors Island)
 [[40.6780, -74.0150], [40.6745, -74.0110], [40.6720, -74.0100], [40.6700, -74.0090], [40.6650, -74.0110], [40.6640, -74.0300], [40.6800, -74.0300]],   # Red Hook / Erie basin
 [[40.7010, -73.9850], [40.6995, -73.9810], [40.6990, -73.9750], [40.6985, -73.9700], [40.6995, -73.9640], [40.7030, -73.9610], [40.7100, -73.9620], [40.7080, -73.9830]],   # Wallabout Bay (Navy Yard fill)
 [[40.6880, -74.0300], [40.6884, -74.0230], [40.6877, -74.0190], [40.6872, -74.0150], [40.6880, -74.0110], [40.6890, -74.0080], [40.6800, -74.0080], [40.6800, -74.0300]],   # Governors Island, south part (1901-12 fill)
 [[40.6997, -74.0260], [40.6997, -74.0175], [40.7003, -74.0150], [40.6990, -74.0120], [40.6990, -74.0000], [40.6935, -74.0040], [40.6935, -74.0260]],   # harbour south of the Battery (DEM artefacts)
]
write("brooklyn", {
 "mode": "close", "zoom": Z,
 "note": "Brooklyn evacuation, 29-30 Aug 1776 (summer): Brooklyn Heights + the ferry landing (Fulton Ferry), the East River (~0.8-1.2 km), the 1776 town of New "
         "York (lower Manhattan south of ~Chambers St), Governors Island, Red Hook, Wallabout Bay, Gowanus Creek, the American works line Wallabout - Gowanus "
         "(Fort Putnam, Fort Greene, Fort Box, Cobble Hill, Fort Stirling, Fort Defiance). Zoom-11 frame: 1 unit = ~58 m. 1776 shoreline: modern landfill "
         "(Battery Park City, the Manhattan / Brooklyn piers, Navy Yard, Governors Island south, Red Hook basins) turned back into water (approx. polygons).",
 "box": bb, "focus": [round((pl("Brooklyn", Z)[0] + NYC[0]) / 2, 1), round((pl("Brooklyn", Z)[1] + NYC[1]) / 2, 1)],
 "stills": [{"at": [bb[0] + bb[2] / 2, bb[1] + bb[3] / 2], "dist": 120, "tilt": 34, "yaw": 0}, {"at": ll(40.7030, -73.9990, Z), "dist": 45, "tilt": 48, "yaw": -10},
            {"at": ll(40.6990, -73.9945, Z), "dist": 26, "tilt": 56, "yaw": 15}],
 "hm_ppu": 8, "tex": 4096, "exag": 2.4, "cell": 4.2, "seed": 1776, "relief_noise": [0.8, 0.3],
 "dem_ppu": 8, "dem_margin": 6,
 "dem_edits": {"sea": {"level": 0.6, "min_px": 4000, "open_px": 3, "close_px": 5, "island_px": 200, "seeds": [[40.705, -74.000], [40.690, -74.030], [40.700, -74.025]],
                       "force_water": FW},
               "fill_water": True, "spike_m": 25.0, "sea_floor_m": 0.0},
 "sea_look": {"deep": "#38545f", "shallow": "#52727a", "shelf_u": 3.0, "beach_u": 0.15, "line_u": 0.06},
 "creek_km2": 0.5, "creeks": {"paint_km2": 1.0, "ribbon_km2": 1e9},
 "woods": 0.02, "ravine_woods": 0.4, "tree_spacing": 0.25, "rust_k": 0.85, "clear_blur": 0.35, "clear_noise_u": 0.8,
 "rivers": [{"name": "Gowanus Creek", "geo": "Gowanus Creek", "w": 0.7, "step": 0.12, "snap": False, "smooth": 6, "meander": 0.15, "meander_wl": 2.0}],
 "roads": [{"name": "Brooklyn - Flatbush road", "geo": "Brooklyn - Flatbush - Jamaica roads", "cls": "pike", "meander": 0.15},
           {"name": "Jamaica road", "geo": "Jamaica road (Bedford", "cls": "pike", "meander": 0.15},
           {"name": "Gowanus road", "geo": "Gowanus road", "cls": "lane", "meander": 0.15},
           {"name": "Broadway / Bowery", "geo": "Boston post road (Manhattan)", "cls": "pike", "meander": 0.0}],
 "towns": [{"name": "New York", "at": ll(40.7070, -74.0100, Z), "kind": "grid", "rad": 7.5, "block": 1.15, "angle": -61},
           {"name": "Brooklyn Ferry", "at": ll(40.7015, -73.9915, Z), "kind": "hamlet", "len": 2.6, "angle": -30},
           {"name": "Brooklyn", "geo": "Brooklyn", "kind": "hamlet", "len": 3.0, "angle": -60},
           {"name": "_f1", "at": ll(40.6895, -73.9790, Z), "kind": "farm"}, {"name": "_f2", "at": ll(40.6830, -73.9750, Z), "kind": "farm"},
           {"name": "_f3", "at": ll(40.6950, -73.9890, Z), "kind": "farm"}, {"name": "_f4", "at": ll(40.6780, -73.9850, Z), "kind": "farm"},
           {"name": "_f5", "at": ll(40.6905, -74.0050 + 0.012, Z), "kind": "farm"}, {"name": "_f6", "at": ll(40.6800, -74.0050, Z), "kind": "farm"}],
 "farm_density": 0.6, "plantation_density": 0.0, "lane_p": 0.4,
 "features": {"works": [{"name": "Brooklyn lines", "geo": work_geo("Brooklyn Heights fortified line", "Brooklyn lines (Wallabout - Gowanus)"), "kind": "breastwork", "side": "us", "face_to": ll(40.680, -73.960, Z), "height": 1.6, "clear": 0.8}]
              + [{"name": n, "at": pl(n, Z), "shape": "fort", "kind": "fort", "side": "us", "size": sz, "closed": True, "height": 1.8, "clear": 0.6, "face": 0}
                 for n, sz in (("Fort Putnam", 1.0), ("Fort Greene", 0.9), ("Fort Box", 0.7), ("Cobble Hill fort", 0.7), ("Fort Stirling", 0.8),
                               ("Fort Defiance", 0.8), ("Governors Island works", 0.8), ("Oblong Redoubt", 0.6), ("Redoubt on the Left", 0.6))
                 if any(q.startswith(n) for q in PL)]},
 "labels": ["Fort Putnam", "Fort Greene", "Fort Box", "Cobble Hill fort", "Fort Stirling", "Fort Defiance", "Governors Island", "Upper Bay", "Oblong Redoubt",
            "Redoubt on the Left", "Brooklyn Ferry landing", "Manhattan landing, Peck Slip", "Fly Market", "Wallabout Bay", "Red Hook", "East River", "Gowanus Creek mouth",
            "Brouwer's Millpond", "Redoubt at the Mill"],
})

# ============================================================ crossing (close, zoom 12) ============================================================
Z = 12
cr = box_ll(40.2875, -74.8830, 40.3185, -74.8400, Z)
write("crossing", {
 "mode": "close", "zoom": Z, "season": "winter", "winter": dict(WINTER, floes=0.3),
 "note": "The Delaware crossing, night 25-26 Dec 1776 (winter, night-capable): McConkey's Ferry (PA) and Johnson's Ferry (NJ) landings, the Delaware "
         "(~270 m = ~9 units), the river roads on both banks, the Bear Tavern road up the NJ bank towards Bear Tavern, the ferry houses. Zoom-12 frame: "
         "1 unit = ~29 m (base units x 4).",
 "box": cr, "focus": [round((pl("McConkey", Z)[0] + pl("Johnson", Z)[0]) / 2, 1), round((pl("McConkey", Z)[1] + pl("Johnson", Z)[1]) / 2, 1)],
 "stills": [{"at": [cr[0] + cr[2] / 2, cr[1] + cr[3] / 2], "dist": 110, "tilt": 34, "yaw": 0},
            {"at": [round((pl("McConkey", Z)[0] + pl("Johnson", Z)[0]) / 2, 1), round((pl("McConkey", Z)[1] + pl("Johnson", Z)[1]) / 2, 1)], "dist": 40, "tilt": 48, "yaw": -8},
            {"at": pl("Johnson", Z), "dist": 20, "tilt": 56, "yaw": 20}],
 "hm_ppu": 8, "tex": 4608, "exag": 2.0, "cell": 7.0, "seed": 1225, "relief_noise": [1.0, 0.35],
 "dem_ppu": 8, "dem_margin": 6, "dem_edits": {"fill_water": True, "flat_sd": 0.15, "flat_low": 0.6, "spike_m": 25.0},
 "creek_km2": 0.3, "creeks": {"paint_km2": 0.6, "ribbon_km2": 1e9},
 "woods": 0.06, "ravine_woods": 0.7, "tree_spacing": 0.3, "rust_k": 0.85, "clear_blur": 0.35, "clear_noise_u": 0.8,
 "rivers": [{"name": "Delaware River", "geo": "Delaware River (fine)", "w": 10.5, "step": 0.2, "snap": False, "smooth": 10, "keep": 7.0},
            {"name": "Jacobs Creek", "geo": "Jacobs Creek", "w": 0.6, "step": 0.15, "smooth": 6}],
 "roads": [{"name": "River road (NJ)", "geo": "River road (NJ)", "cls": "pike", "meander": 0.2},
           {"name": "River road (PA)", "geo": "River road (PA)", "cls": "pike", "meander": 0.2},
           {"name": "Bear Tavern road", "geo": "Bear Tavern road", "cls": "pike", "meander": 0.25}],
 "towns": [{"name": "McConkey's Ferry", "geo": "McConkey's Ferry", "kind": "farm"}, {"name": "Johnson's Ferry", "geo": "Johnson's Ferry", "kind": "farm"},
           {"name": "_f1", "at": ll(40.3055, -74.8800, Z), "kind": "farm"}, {"name": "_f2", "at": ll(40.2900, -74.8560, Z), "kind": "farm"}],
 "farm_density": 0.5, "plantation_density": 0.0, "lane_p": 0.4,
 "features": {"works": []},
 "labels": ["McConkey's Ferry", "Johnson's Ferry", "Bear Tavern"],
})

# ============================================================ trenton (close, zoom 11) ============================================================
Z = 11
tb = box_ll(40.1985, -74.8020, 40.2440, -74.7370, Z)
head = pl("King Street / Queen Street head", Z); qs = pl("Assunpink bridge", Z)
qang = round(math.degrees(math.atan2(qs[1] - head[1], qs[0] - head[0])), 1)
write("trenton", {
 "mode": "close", "zoom": Z, "season": "winter", "winter": WINTER,
 "note": "Trenton, 26 Dec 1776 and 2 Jan 1777 (winter): the 1776 town (King St + Queen St converging at the north end where the Pennington and Princeton roads "
         "come in; ~100 houses; the Old Barracks), the Assunpink Creek with the stone bridge at the foot of Queen St, Mill Hill south of it, the Delaware, the "
         "River road from the NW, the Pennington road from the N, the post road NE; the American line of 2 Jan on the Assunpink's south bank. Zoom-11 frame.",
 "box": tb, "focus": pl("Trenton", Z),
 "stills": [{"at": [tb[0] + tb[2] / 2, tb[1] + tb[3] / 2], "dist": 95, "tilt": 34, "yaw": 0}, {"at": pl("Trenton", Z), "dist": 40, "tilt": 48, "yaw": -8},
            {"at": qs, "dist": 22, "tilt": 56, "yaw": 15}],
 "hm_ppu": 8, "tex": 4096, "exag": 2.4, "cell": 4.2, "seed": 1226, "relief_noise": [0.9, 0.3],
 "dem_ppu": 8, "dem_margin": 6, "dem_edits": {"fill_water": True, "flat_sd": 0.15, "flat_low": 0.6, "spike_m": 25.0},
 "creek_km2": 0.4, "creeks": {"paint_km2": 0.8, "ribbon_km2": 1e9},
 "woods": 0.0, "ravine_woods": 0.6, "tree_spacing": 0.28, "rust_k": 0.85, "clear_blur": 0.35, "clear_noise_u": 0.8,
 "rivers": [{"name": "Delaware River", "geo": "Delaware River (fine)", "w": 5.5, "step": 0.15, "snap": False, "smooth": 10, "keep": 4.0},
            {"name": "Assunpink Creek", "geo": "Assunpink Creek", "w": 0.45, "step": 0.12, "snap": False, "smooth": 6}],
 "roads": [{"name": "River road", "geo": "River road (NJ)", "cls": "pike", "meander": 0.15},
           {"name": "Pennington road", "geo": "Pennington road", "cls": "pike", "meander": 0.15},
           {"name": "Princeton road", "geo": "New York post road", "cls": "pike", "meander": 0.15},
           {"name": "Bordentown road", "geo": "Trenton - Bordentown", "cls": "pike", "meander": 0.15},
           {"name": "Quaker Bridge road", "geo": "Quaker Bridge road", "cls": "pike", "meander": 0.15},
           {"name": "Sandtown road", "geo": "Sandtown road", "cls": "lane", "meander": 0.15},
           {"name": "King Street", "geo": "Trenton streets: King Street", "cls": "pike", "meander": 0},
           {"name": "Queen Street", "geo": "Trenton streets: Queen Street", "cls": "pike", "meander": 0},
           {"name": "River road (PA)", "geo": "River road (PA)", "cls": "pike", "meander": 0.15},
           {"name": "Philadelphia road (PA)", "geo": "Philadelphia - Trenton post road", "cls": "pike", "meander": 0.15}],
 "towns": [{"name": "Trenton", "at": ll(40.2215, -74.7652, Z), "kind": "street", "halfL": 7.0, "cross": 3, "rad": 6.5, "parallel": True},   # main street = King St, parallel = Queen St + a back lane
           {"name": "_mill", "at": pl("Mill Hill", Z), "kind": "hamlet", "len": 2.4, "angle": qang + 70},
           {"name": "_ferry", "at": pl("Trenton Ferry", Z), "kind": "farm"}],
 "farm_density": 0.8, "plantation_density": 0.0, "lane_p": 0.45,
 "features": {"works": [{"name": "American line (Assunpink, 2 Jan)", "geo": work_geo("American line along the Assunpink", "American line, Assunpink"), "kind": "breastwork", "side": "us", "face_to": head, "height": 1.0, "clear": 0.5}],
              "bridges": [{"name": "Assunpink bridge (stone)", "geo": "Assunpink bridge", "kind": "road"}]},
 "labels": ["King Street / Queen Street head", "Old Barracks", "Assunpink bridge", "Mill Hill", "Trenton Ferry", "Hessian picket", "Rall's headquarters",
            "Hessian surrender field", "Hermitage"],
})

# ============================================================ princeton (close, zoom 11) ============================================================
pb = box_ll(40.3080, -74.7160, 40.3600, -74.6460, Z)
write("princeton", {
 "mode": "close", "zoom": Z, "season": "winter", "winter": WINTER,
 "note": "Princeton, 3 Jan 1777 (winter, frozen ground): the village on the post road + Nassau Hall, the post road to Trenton (SW) over the Stony Brook bridge "
         "(Worth's Mill), the Quaker Bridge / Saw Mill road from the south (the night march), the Thomas Clarke house and William Clarke's orchard (the "
         "clash point), the Olden house, Frog Hollow. Zoom-11 frame. Carnegie Lake (1906) and the D&R canal (1834) are modern: filled.",
 "box": pb, "focus": pl("William Clarke orchard", Z),
 "stills": [{"at": [pb[0] + pb[2] / 2, pb[1] + pb[3] / 2], "dist": 100, "tilt": 34, "yaw": 0}, {"at": pl("William Clarke orchard", Z), "dist": 42, "tilt": 48, "yaw": -8},
            {"at": pl("Nassau Hall", Z), "dist": 24, "tilt": 56, "yaw": 12}],
 "hm_ppu": 8, "tex": 4096, "exag": 2.6, "cell": 4.4, "seed": 1777, "relief_noise": [0.9, 0.3],
 "dem_ppu": 8, "dem_margin": 6, "dem_edits": {"fill_water": True, "flat_sd": 0.15, "flat_low": 0.5, "spike_m": 25.0},
 "creek_km2": 0.4, "creeks": {"paint_km2": 0.8, "ribbon_km2": 1e9},
 "woods": 0.03, "ravine_woods": 0.6, "tree_spacing": 0.28, "rust_k": 0.85, "clear_blur": 0.8, "clear_noise_u": 1.6,
 "rivers": [{"name": "Stony Brook", "geo": "Stony Brook", "w": 0.45, "step": 0.12, "snap": False, "smooth": 6}],
 "roads": [{"name": "Post road (King's Highway)", "geo": "New York post road", "cls": "pike", "meander": 0.12},
           {"name": "Quaker Bridge road", "geo": "Quaker Bridge road", "cls": "pike", "meander": 0.15},
           {"name": "Saw Mill road", "geo": "Saw Mill road", "cls": "lane", "meander": 0.15},
           {"name": "Princeton - Morristown road", "geo": "Princeton - Morristown road", "cls": "pike", "meander": 0.12}],
 "towns": [{"name": "Princeton", "geo": "Princeton", "kind": "street", "halfL": 4.5, "cross": 4, "rad": 5.0},
           {"name": "Thomas Clarke house", "geo": "Thomas Clarke house", "kind": "farm"}, {"name": "_wclarke", "at": ll(40.3318, -74.6745, Z), "kind": "farm"},
           {"name": "Olden house", "geo": "Thomas Olden house", "kind": "farm"}, {"name": "_worth", "at": ll(40.3215, -74.6950, Z), "kind": "farm"}],
 "farm_density": 0.8, "plantation_density": 0.0, "lane_p": 0.45,
 "features": {"works": [], "bridges": [{"name": "Stony Brook bridge (Worth's Mill)", "geo": "Stony Brook bridge", "kind": "road"}]},
 "labels": ["Nassau Hall", "Thomas Clarke house", "William Clarke orchard", "Stony Brook bridge", "Frog Hollow", "Thomas Olden house"],
})
