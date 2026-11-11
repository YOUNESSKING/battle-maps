"""Yorktown 1781 map kit: every baked place, road and crossing, in lat/lon (checked against the relief; see kit/PLACES.md).
Read by kit/make_w.py (woods keep-off, water) and kit/make_m.py (towns, carved names, rut roads, bridges, ferries, relief).

Per map:
  s        typical camera scale the baked art is drawn for (town sprites, names, ruts are sized in SCREEN px at this scale)
  water    land-mask clean-up (image px of the 5760 x 3240 basemap): blur = coast smoothing, pier = thin land removed,
           chan = thin water removed, island = smallest island kept, lake = smallest inland water body kept (modern ponds/reservoirs go)
  rivers   named rivers added as carved channels: (NHD name, half-width image px, (lat0, lat1, lon0, lon1) keep box)
  creeks   how many det_riv creeks to keep (narrow, few)
  towns    key: (name, lat, lon, size u, label? , label side, seed)   label side: 'S','N','E','W','SE','SW','NE','NW' (+ arc)
  roads    list of (id, [(lat, lon), ...]); a road that crosses water gets a ferry (wide) or a timber bridge (narrow) automatically
  ferries  explicit ferries (id, (lat, lon) bank A, (lat, lon) bank B) used instead of the automatic one on that crossing
  relief   painted relief from the real DEM, only where the ground is named: polygons [(lat, lon), ...]
  keep     woods keep-off: circles (lat, lon, radius m)
"""
# shared 1781 period roads around Yorktown (used on peninsula + yorktown)
Y = (37.2382, -76.5098)            # Yorktown (town centre, on the bluff above the waterfront)
G = (37.2468, -76.5025)            # Gloucester Point (the fortified point)
W = (37.2707, -76.7075)            # Williamsburg
HALF = (37.2520, -76.6400)         # Halfway House: the allied columns split here on 28 Sep
HAMPJ = (37.2060, -76.5112)        # where the southern (American) branch meets the Hampton road
ROADS_YT = [
    ("williamsburg_north", [W, (37.2640, -76.6800), HALF, (37.2450, -76.6000), (37.2360, -76.5650), (37.2318, -76.5450), (37.2338, -76.5250), (37.2365, -76.5150), Y]),
    ("hampton_branch", [HALF, (37.2320, -76.6100), (37.2140, -76.5780), (37.2040, -76.5480), (37.2035, -76.5250), HAMPJ]),
    ("hampton_road", [Y, (37.2312, -76.5088), (37.2200, -76.5108), (37.2125, -76.5120), HAMPJ, (37.1950, -76.5050), (37.1700, -76.4800), (37.1100, -76.4300), (37.0500, -76.3600), (37.0200, -76.3400)]),
    ("gloucester_north", [G, (37.2580, -76.5040), (37.2760, -76.4950), (37.2917, -76.4847), (37.3300, -76.4950), (37.4000, -76.5200), (37.4800, -76.5400)]),
]
FERRY_YT = [("york_ferry", (37.2395, -76.5070), (37.2455, -76.5040))]   # Yorktown waterfront <-> Gloucester Point (the narrows, ~800 yd)
# the siege ground (Yorktown Creek ravines west of the town, the river bluffs, Wormley Creek ravines to the south-east)
RELIEF_YT = [[(37.2520, -76.5600), (37.2440, -76.5300), (37.2400, -76.5130), (37.2330, -76.4980), (37.2260, -76.4880), (37.2200, -76.4750),
              (37.2120, -76.4660), (37.2000, -76.4700), (37.2000, -76.4950), (37.2150, -76.5150), (37.2200, -76.5400), (37.2350, -76.5650)]]
KEEP_YT = [(37.2290, -76.5040, 1400), (37.2382, -76.5098, 500), (37.2111, -76.5131, 450), (37.2468, -76.5025, 350)]

MAPS = {
    "east": dict(
        s=0.9, ferry_scale=1.6, roads_k=1.5,   # baked for the wide march shots (s ~0.9): towns + post-road ruts read at full frame
        water=dict(blur=3.0, pier=2, chan=3, island=900, lake=6000),
        rivers=[("Hudson River", 3.2, (40.55, 42.7, -74.4, -73.6)), ("Delaware River", 2.6, (39.6, 41.2, -75.6, -74.6)),
                ("Susquehanna River", 2.6, (39.5, 40.4, -77.0, -76.0)), ("Potomac River", 2.6, (38.2, 39.6, -77.6, -76.9)),
                ("Schuylkill River", 1.6, (39.9, 40.2, -75.6, -75.15)), ("James River", 2.4, (37.0, 37.7, -77.5, -76.6)),
                ("Rappahannock River", 2.0, (37.6, 38.4, -77.6, -76.4))],
        creeks=0,
        wet=[(3.2, [(40.88, -73.93), (40.80, -73.97), (40.74, -74.015), (40.70, -74.03)]), (5.5, [(40.70, -74.03), (40.665, -74.05), (40.62, -74.045), (40.58, -74.04)]),
             (2.2, [(40.70, -74.005), (40.745, -73.97), (40.785, -73.935), (40.80, -73.88), (40.805, -73.80)])],   # Hudson mouth, Upper Bay + Narrows, East River
        towns={
            "new_york": ("New York", 40.712, -74.006, 40, True, "E", 1776, [(34, 10), (102, -8), (170, -18), (240, -22)]),   # from the Manhattan tip along western Long Island (the only open land beside the city at z8)   # along Long Island, off the march route
            "philadelphia": ("Philadelphia", 39.952, -75.165, 52, True, "W", 1682, [(-322, 14), (-257, -16), (-182, -18), (-104, 6)]),   # west of the town, off the post road (which runs NE-SW through it)
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 22, False, "", 1699),   # 42 map px from Yorktown at z8: one name only (Yorktown)
            "yorktown": ("Yorktown", 37.2382, -76.5098, 26, True, "S", 1691),
            "newport": ("Newport", 41.49, -71.31, 24, False, "", 1639),
            "providence": ("Providence", 41.824, -71.412, 20, False, "", 1636),
            "hartford": ("Hartford", 41.764, -72.685, 20, False, "", 1635),
            "princeton": ("Princeton", 40.349, -74.659, 16, False, "", 1756), "chatham": ("Chatham", 40.741, -74.383, 14, False, "", 1781),
            "dobbs_ferry": ("Dobbs Ferry", 41.014, -73.872, 16, False, "", 1781),
            "trenton": ("Trenton", 40.22, -74.76, 22, False, "", 1719),
            "chester": ("Chester", 39.85, -75.36, 16, False, "", 1682),
            "head_of_elk": ("Head of Elk", 39.608, -75.833, 18, False, "", 1781),
            "baltimore": ("Baltimore", 39.29, -76.61, 26, False, "", 1729),
            "annapolis": ("Annapolis", 38.978, -76.492, 16, False, "", 1708),
            "alexandria": ("Alexandria", 38.805, -77.047, 15, False, "", 1749),
            "fredericksburg": ("Fredericksburg", 38.303, -77.46, 15, False, "", 1728),
            "richmond": ("Richmond", 37.54, -77.436, 18, False, "", 1737),
        },
        roads=[
            ("newport_providence", [(41.49, -71.31), (41.56, -71.27), (41.64, -71.255), (41.70, -71.28), (41.824, -71.412)]),
            ("providence_hartford", [(41.824, -71.412), (41.80, -71.70), (41.78, -72.10), (41.764, -72.685)]),
            ("hartford_philipsburg", [(41.764, -72.685), (41.67, -72.94), (41.50, -73.25), (41.39, -73.45), (41.20, -73.65), (41.04, -73.82), (41.014, -73.872)]),
            ("newyork_dobbs", [(40.712, -74.006), (40.80, -73.96), (40.878, -73.91), (40.95, -73.88), (41.014, -73.872)]),
            ("dobbs_kingsferry", [(41.014, -73.872), (41.10, -73.86), (41.20, -73.90), (41.258, -73.952)]),
            ("kingsferry_trenton", [(41.240, -73.985), (41.19, -73.985), (41.11, -74.15), (40.99, -74.29), (40.80, -74.40), (40.74, -74.38),
                                    (40.57, -74.53), (40.35, -74.66), (40.22, -74.76)]),
            ("newyork_chatham", [(40.712, -74.006), (40.716, -74.045), (40.735, -74.17), (40.74, -74.38)]),
            ("trenton_philadelphia", [(40.22, -74.76), (40.17, -74.83), (40.10, -74.92), (40.02, -75.04), (39.952, -75.165)]),
            ("philadelphia_elk", [(39.952, -75.165), (39.94, -75.21), (39.85, -75.36), (39.74, -75.55), (39.66, -75.70), (39.608, -75.833)]),
            ("elk_baltimore", [(39.608, -75.833), (39.57, -76.00), (39.55, -76.09), (39.50, -76.25), (39.40, -76.42), (39.29, -76.61)]),
            ("baltimore_annapolis", [(39.29, -76.61), (39.15, -76.60), (38.978, -76.492)]),
            ("baltimore_alexandria", [(39.29, -76.61), (39.12, -76.80), (38.94, -76.94), (38.905, -77.065), (38.805, -77.047)]),
            ("alexandria_fredericksburg", [(38.805, -77.047), (38.71, -77.12), (38.55, -77.30), (38.42, -77.40), (38.303, -77.46)]),
            ("fredericksburg_newkent", [(38.303, -77.46), (38.05, -77.35), (37.78, -77.20), (37.55, -77.00), (37.42, -76.86)]),
            ("richmond_newkent", [(37.54, -77.436), (37.50, -77.25), (37.45, -77.05), (37.42, -76.86)]),
            ("newkent_williamsburg", [(37.42, -76.86), (37.34, -76.78), (37.2707, -76.7075)]),
            ("williamsburg_yorktown", [(37.2707, -76.7075), (37.252, -76.640), (37.236, -76.565), Y]),
        ],
        ferries=[("kings_ferry", (41.258, -73.952), (41.240, -73.985))],
        relief=[], keep=[],
    ),
    "chesapeake": dict(
        s=1.0, label_k=1.25,   # r3: also the nested map of the east -> peninsula zoom: names read at 1080p
        water=dict(blur=3.0, pier=3, chan=4, island=1500, lake=20000),
        rivers=[("James River", 2.2, (36.8, 38.0, -78.1, -76.6)), ("Pamunkey River", 1.6, (37.4, 38.0, -77.6, -76.75)),
                ("Mattaponi River", 1.5, (37.5, 38.0, -77.6, -76.75)), ("Rappahannock River", 1.8, (37.9, 38.3, -78.1, -76.9))],
        creeks=0,
        towns={
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 20, True, "NW", 1699, [(-380, -30), (-260, -52), (-140, -56), (-20, -44)]),   # r3: apart from
            "yorktown": ("Yorktown", 37.2382, -76.5098, 15, True, "S", 1691),   # auto (land, clear of the Williamsburg name)
            "hampton": ("Hampton", 37.03, -76.345, 15, False, "", 1610),
            "norfolk": ("Norfolk", 36.848, -76.29, 18, False, "", 1682),
            "richmond": ("Richmond", 37.54, -77.436, 22, False, "", 1737),
        },
        roads=[
            ("richmond_williamsburg", [(37.54, -77.436), (37.55, -77.75), (37.56, -78.10)]),
            ("richmond_east", [(37.54, -77.436), (37.47, -77.20), (37.40, -77.00), (37.33, -76.85), (37.2707, -76.7075)]),
            ("williamsburg_yorktown", [(37.2707, -76.7075), (37.252, -76.640), (37.236, -76.565), Y]),
            ("yorktown_hampton", [Y, (37.2060, -76.5112), (37.17, -76.48), (37.11, -76.43), (37.03, -76.345)]),
            ("williamsburg_hampton", [(37.2707, -76.7075), (37.21, -76.62), (37.15, -76.55), (37.11, -76.43)]),
            ("hampton_norfolk", [(37.03, -76.345), (36.97, -76.33), (36.93, -76.32), (36.848, -76.29)]),
            ("norfolk_south", [(36.848, -76.29), (36.70, -76.27), (36.50, -76.25), (36.18, -76.22)]),
            ("gloucester_north", [G, (37.30, -76.49), (37.40, -76.52), (37.55, -76.60), (37.70, -76.72), (37.85, -76.85), (38.00, -76.95)]),
        ],
        ferries=[("york_ferry", (37.2395, -76.5070), (37.2455, -76.5040))],
        relief=[], keep=[(37.2382, -76.5098, 2500)],
    ),
    "peninsula": dict(
        s=1.0, ferry_scale=1.5, label_k=1.25,   # r3: nested map of the hook zoom (names readable)
        water=dict(blur=2.5, pier=3, chan=3, island=600, lake=12000, dry=[(37.30, 37.48, -76.95, -76.78), (37.176, 37.205, -76.615, -76.575)]),   # Diascund + Little Creek reservoirs (modern)
        rivers=[], creeks=0,
        towns={
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 30, True, "S", 1699),
            "yorktown": ("Yorktown", 37.2382, -76.5098, 20, True, "S", 1691),
            "gloucester": ("Gloucester", 37.2468, -76.5025, 12, False, "", 1707),   # 15 map px from Yorktown at z12: one name (Yorktown)
            "jamestown": ("Jamestown", 37.2093, -76.7775, 10, False, "", 1607),
        },
        roads=ROADS_YT + [
            ("williamsburg_jamestown", [W, (37.2450, -76.7350), (37.2200, -76.7650), (37.2093, -76.7775)]),
            ("williamsburg_trebell", [W, (37.2400, -76.6900), (37.2150, -76.6720), (37.2060, -76.6672)]),
            ("williamsburg_richmond", [W, (37.3000, -76.7600), (37.3500, -76.8500), (37.4000, -76.9500), (37.4800, -77.1200)]),
        ],
        ferries=FERRY_YT,
        relief=RELIEF_YT, keep=KEEP_YT + [(37.2707, -76.7075, 900)],
    ),
    "yorktown": dict(
        s=2.0, ferry_scale=3.6,
        water=dict(blur=26.0, pier=7, chan=7, island=6000, lake=60000, dry=[(37.176, 37.205, -76.615, -76.575)]),   # Lee Hall reservoir (modern)
        rivers=[], creeks=2, creek_pick=[(37.2290, -76.5200), (37.2130, -76.4800)],   # Yorktown Creek, Wormley Creek
        towns={
            "yorktown": ("Yorktown", 37.2382, -76.5098, 58, True, "S", 1691, [(-140, 72), (-55, 120), (55, 120), (140, 72)]),
            "gloucester": ("Gloucester", 37.2468, -76.5025, 30, True, "NE", 1707, [(70, -92), (145, -112), (220, -122), (300, -140)]),
        },
        roads=ROADS_YT,
        ferries=FERRY_YT,
        relief=RELIEF_YT, keep=KEEP_YT,
    ),
}

# ---------------------------------------------------------------- named story points (lat, lon) for PLACE("...") in the scenes
# corrected against the relief (kit/PLACES.md): Redoubt 10 + 9 moved ~400 m west onto the river bluff (the dossier values fall in the river),
# the Fusiliers' Redoubt moved ~270 m south onto the bluff edge.
PLACES = {
    "yorktown": (37.2382, -76.5098), "gloucester_point": (37.2468, -76.5025), "the_hook": (37.2917, -76.4847),
    "fusiliers_redoubt": (37.2440, -76.5261), "hornwork": (37.2325, -76.5092), "british_line_east": (37.2352, -76.5040),
    "redoubt_9": (37.2292, -76.5025), "redoubt_10": (37.2319, -76.5000), "first_parallel": (37.2244, -76.5006),
    "first_parallel_w": (37.2262, -76.5185), "first_parallel_e": (37.2262, -76.4952),
    "moore_house": (37.2189, -76.4858), "surrender_field": (37.2111, -76.5131), "allied_hq": (37.2067, -76.5350),
    "williamsburg": (37.2707, -76.7075), "halfway_house": (37.2520, -76.6400), "trebells_landing": (37.2044, -76.6669), "jamestown": (37.2093, -76.7775),
    "cape_henry": (36.9261, -76.0061), "cape_charles": (37.1333, -75.9667), "lynnhaven_bay": (36.9167, -76.0833), "hampton": (37.03, -76.345),
    "dobbs_ferry": (41.01, -73.87), "kings_ferry": (41.25, -73.965), "chatham": (40.74, -74.38), "trenton": (40.22, -74.76), "philadelphia": (39.952, -75.165),
    "chester": (39.85, -75.36), "head_of_elk": (39.608, -75.833), "baltimore": (39.29, -76.61), "annapolis": (38.978, -76.492), "mount_vernon": (38.71, -77.09),
    "newport": (41.49, -71.31), "new_york": (40.712, -74.006), "staten_island": (40.58, -74.15),
}
# river / bay centre-lines (lat, lon) for the carved river names (RIVER(...) in the kit); York + James traced on the peninsula water mask
RIVER_LINES = {
    "york": [(37.4601, -76.7505), (37.4302, -76.7093), (37.3901, -76.6681), (37.3451, -76.6269), (37.3101, -76.5857), (37.2765, -76.5445), (37.2425, -76.5060),
             (37.2339, -76.4621), (37.2437, -76.4209), (37.2582, -76.3797)],
    "james": [(37.235, -76.8741), (37.2251, -76.8329), (37.2082, -76.7917), (37.1726, -76.7505), (37.157, -76.6681), (37.1187, -76.6269), (37.0749, -76.5857)],
    "hudson": [(41.70, -73.94), (41.50, -73.98), (41.35, -73.97), (41.24, -73.96), (41.10, -73.90), (41.00, -73.89), (40.88, -73.93), (40.75, -74.01)],
    "chesapeake": [(39.40, -76.20), (39.00, -76.40), (38.60, -76.40), (38.20, -76.30), (37.80, -76.18), (37.40, -76.10), (37.10, -76.05)],
}
