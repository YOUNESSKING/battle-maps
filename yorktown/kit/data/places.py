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
        s=1.2, ferry_scale=1.4,
        water=dict(blur=3.0, pier=2, chan=3, island=900, lake=6000),
        rivers=[("Hudson River", 3.2, (40.55, 42.7, -74.4, -73.6)), ("Delaware River", 2.6, (39.6, 41.2, -75.6, -74.6)),
                ("Susquehanna River", 2.6, (39.5, 40.4, -77.0, -76.0)), ("Potomac River", 2.6, (38.2, 39.6, -77.6, -76.9)),
                ("Schuylkill River", 1.6, (39.9, 40.2, -75.6, -75.15)), ("James River", 2.4, (37.0, 37.7, -77.5, -76.6)),
                ("Rappahannock River", 2.0, (37.6, 38.4, -77.6, -76.4))],
        creeks=0,
        towns={
            "new_york": ("New York", 40.712, -74.006, 34, True, "E", 1776),
            "philadelphia": ("Philadelphia", 39.952, -75.165, 34, True, "W", 1682),
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 22, True, "W", 1699),
            "yorktown": ("Yorktown", 37.2382, -76.5098, 18, True, "SE", 1691),
            "newport": ("Newport", 41.49, -71.31, 20, False, "", 1639),
            "providence": ("Providence", 41.824, -71.412, 18, False, "", 1636),
            "hartford": ("Hartford", 41.764, -72.685, 18, False, "", 1635),
            "dobbs_ferry": ("Dobbs Ferry", 41.014, -73.872, 13, False, "", 1781),
            "trenton": ("Trenton", 40.22, -74.76, 16, False, "", 1719),
            "chester": ("Chester", 39.85, -75.36, 13, False, "", 1682),
            "head_of_elk": ("Head of Elk", 39.608, -75.833, 13, False, "", 1781),
            "baltimore": ("Baltimore", 39.29, -76.61, 22, False, "", 1729),
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
        s=1.3,
        water=dict(blur=3.0, pier=3, chan=4, island=1500, lake=20000),
        rivers=[], creeks=0,
        towns={
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 20, True, "W", 1699),
            "yorktown": ("Yorktown", 37.2382, -76.5098, 15, True, "NE", 1691),
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
        s=1.3, ferry_scale=1.5,
        water=dict(blur=2.5, pier=3, chan=3, island=600, lake=12000, dry=[(37.30, 37.48, -76.95, -76.78), (37.176, 37.205, -76.615, -76.575)]),   # Diascund + Little Creek reservoirs (modern)
        rivers=[], creeks=0,
        towns={
            "williamsburg": ("Williamsburg", 37.2707, -76.7075, 30, True, "S", 1699),
            "yorktown": ("Yorktown", 37.2382, -76.5098, 20, True, "SW", 1691),
            "gloucester": ("Gloucester", 37.2468, -76.5025, 12, True, "NE", 1707),
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
        s=1.6, ferry_scale=2.4,
        water=dict(blur=26.0, pier=7, chan=7, island=6000, lake=60000, dry=[(37.176, 37.205, -76.615, -76.575)]),   # Lee Hall reservoir (modern)
        rivers=[], creeks=2, creek_pick=[(37.2290, -76.5200), (37.2130, -76.4800)],   # Yorktown Creek, Wormley Creek
        towns={
            "yorktown": ("Yorktown", 37.2382, -76.5098, 50, True, "SE", 1691),
            "gloucester": ("Gloucester", 37.2468, -76.5025, 26, True, "N", 1707),
        },
        roads=ROADS_YT,
        ferries=FERRY_YT,
        relief=RELIEF_YT, keep=KEEP_YT,
    ),
}
