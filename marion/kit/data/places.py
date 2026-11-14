"""Marion 1780-81 map kit: every baked place, road, ferry and river, in lat/lon (checked against the relief, the TIGER county lines and the
USGS 1920 quads; see kit/PLACES.md). Read by kit/fetch_rivers.py (rivers), kit/water.py + kit/swamp.py (water, cypress swamp),
kit/make_w.py (woods, swamp woods) and kit/make_m.py (towns, carved names, rut roads, bridges, ferries, relief).

Per map (changes vs the Yorktown kit marked NEW):
  s        typical camera scale the baked art is drawn for (town sprites, names, ruts are sized in SCREEN px at this scale)
  water    land-mask clean-up (image px of the 5760 x 3240 basemap): blur, pier, chan, island, lake (as Yorktown). The land mask is elevation
           > 0.5 m, so Lake Marion / Moultrie / Wateree / Murray (all above sea level) are NEVER water here: only the sea + the rivers below.
  nhd      NEW: NHD flowline names fetched by kit/fetch_rivers.py (rivers the modern dams did not drown)
  county   NEW: rivers taken from the shared TIGER county lines {name: [(county A, county B), ...]} = the PRE-RESERVOIR channel (1780 Santee)
  rivers   rivers drawn as carved channels: (name in rivers_<map>.json, half-width image px, (lat0, lat1, lon0, lon1) keep box)
  wet      hand-set water lines (half-width image px, [(lat, lon), ...]) (creeks under Lake Marion traced on the 1920 quads)
  ponds    NEW: hand-set water polygons [(lat, lon), ...] (Scott's Lake, the oxbow beside Fort Watson)
  creeks   det_riv creeks (0 here: every creek is named and fetched)
  swamp    NEW (kit/swamp.py): cypress swamp = river floodplain from the DEM (height above the nearest story river <= hand m, within
           dist m of it), only along the rivers named in `on`; the drowned Lake Marion floodplain counts (it WAS the Santee swamp)
  towns    key: (name, lat, lon, size u, label?, label side, seed[, hand curve])   size u < 9 = a single plantation house sprite (unlabelled)
  roads    list of (id, [(lat, lon), ...]); a road that crosses water gets a ferry (wide) or a timber bridge (narrow) automatically
  ferries  explicit ferries (id, (lat, lon) bank A, (lat, lon) bank B): landings + flatboat; the roads end at the two landings
  relief   painted relief from the real DEM, only where the ground is named: polygons [(lat, lon), ...]
  mounds   NEW: synthetic relief bumps added to the DEM before the relief paint (lat, lon, radius m, height m): the Fort Watson Indian mound
  keep     woods keep-off: circles (lat, lon, radius m)
"""
# ---------------------------------------------------------------- shared nodes (lat, lon)
CHS = (32.776, -79.931)          # Charleston (the walled town on the tip of the neck)
CAM = (34.246, -80.607)          # Camden
GEO = (33.370, -79.283)          # Georgetown
KT = (33.667, -79.832)           # Kingstree
JB = (32.770, -80.460)           # Jacksonborough (west bank of the Edisto / Pon Pon)
MC = (33.196, -80.013)           # Monck's Corner
EUT = (33.408, -80.304)          # Eutaw Springs (the brick house by the springs; 1920 Eutawville quad "Eutaw Springs")
NEL_S, NEL_N = (33.4282, -80.3262), (33.4352, -80.3248)   # Nelson's Ferry landings (1920 quad: the road meets the river at 33.4307,-80.3256)
SAV = (33.4897, -80.3312)        # Great Savannah (Sumter's house): upland edge by "Savanna Branch" (1920 quad), ~6 mi up the road from the ferry
FTW = (33.5391, -80.4376)        # Fort Watson (Santee Indian Mound, Wright's Bluff)
RICH = (33.672, -80.470)         # Gen. Richardson's plantation (Rimini area; ~25 mi west of Ox Swamp, James)
OX = (33.716, -80.198)           # Ox Swamp (HMdb marker; where Tarleton stopped)
BEN_W, BEN_E = (33.7505, -79.9555), (33.7505, -79.9475)   # Benbow's Ferry (Black River ~10 mi above Kingstree; Marion camped on the EAST side)
SHEP_N, SHEP_S = (33.6255, -79.4370), (33.6195, -79.4330) # Shepherd's Ferry on Black Mingo Creek (LOW; snapped to the creek)
PARK_E, PARK_W = (32.8605, -80.3985), (32.8585, -80.4045) # Parker's Ferry on the Edisto (snapped to the river)
MUR_N, MUR_S = (33.4270, -79.8935), (33.4180, -79.8975)   # Murray's Ferry on the Santee (Kingstree - Monck's Corner road; LOW)
FTM = (33.7620, -80.6685)        # Fort Motte: the Motte house (Mount Joseph) on Buckhead hill above the Congaree (1946 Elloree quad bluff)
FARM = (33.7549, -80.6565)       # the old farmhouse on the hill opposite (east, across Buckhead Creek) where Rebecca Motte stayed (LOW)
MCCORD = (33.7905, -80.7300)     # McCord's Ferry on the Congaree (Fort Motte - Camden road; LOW)

SANTEE_COUNTY = [("Sumter", "Calhoun"), ("Clarendon", "Calhoun"), ("Clarendon", "Orangeburg"), ("Clarendon", "Berkeley"), ("Williamsburg", "Berkeley"), ("Georgetown", "Berkeley")]
CONGAREE_COUNTY = [("Calhoun", "Richland"), ("Lexington", "Richland")]
WATEREE_COUNTY = [("Sumter", "Richland"), ("Kershaw", "Richland"), ("Kershaw", "Fairfield")]

# the Charleston - Nelson's Ferry - Camden road (east bank of the Santee / Wateree after the ferry), the spine of the whole story
ROAD_CHS_NEL = [CHS, (32.800, -79.948), (32.870, -79.990), (32.980, -80.030), (33.080, -80.030), MC, (33.250, -80.100), (33.330, -80.200),
                (33.385, -80.270), EUT, (33.418, -80.318), NEL_S]
ROAD_NEL_CAM = [NEL_N, (33.448, -80.322), (33.470, -80.324), SAV, (33.505, -80.370), (33.522, -80.405), (33.533, -80.428), (33.548, -80.446),
                (33.580, -80.470), (33.630, -80.478), RICH, (33.750, -80.500), (33.850, -80.520), (33.950, -80.530), (34.100, -80.570), CAM]
ROAD_SAV_KT = [SAV, (33.505, -80.280), (33.530, -80.190), (33.570, -80.080), (33.615, -79.960), KT]
ROAD_KT_BEN = [KT, (33.690, -79.880), (33.720, -79.920), BEN_E]
ROAD_BEN_OX = [BEN_W, (33.745, -80.000), (33.735, -80.080), (33.722, -80.150), OX, (33.705, -80.260), (33.690, -80.360), (33.680, -80.430), RICH]
ROAD_OX_N = [(33.722, -80.150), (33.780, -80.140), (33.840, -80.150), (33.950, -80.190)]           # north past Tearcoat toward Salem / the High Hills
ROAD_KT_SHEP = [KT, (33.660, -79.700), (33.650, -79.560), (33.638, -79.480), SHEP_N]               # Kingstree - Black Mingo (Georgetown road)
ROAD_SHEP_GEO = [SHEP_S, (33.590, -79.410), (33.520, -79.360), (33.440, -79.310), GEO]
ROAD_KT_MUR = [KT, (33.600, -79.850), (33.520, -79.870), (33.460, -79.885), MUR_N]                 # Kingstree - Murray's Ferry - Monck's Corner
ROAD_MUR_MC = [MUR_S, (33.370, -79.920), (33.300, -79.960), (33.240, -79.990), MC]
ROAD_CHS_PARK = [CHS, (32.800, -79.948), (32.820, -80.030), (32.840, -80.150), (32.855, -80.260), (32.860, -80.340), PARK_E]   # Ashley ferry + the causeway
ROAD_PARK_JB = [PARK_W, (32.840, -80.425), (32.800, -80.450), JB, (32.720, -80.540), (32.640, -80.680), (32.560, -80.800)]
ROAD_CHS_FTM = [MC, (33.200, -80.250), (33.300, -80.550), (33.490, -80.860), (33.620, -80.760), FTM, MCCORD]   # Monck's Corner - Orangeburg - Fort Motte
ROAD_MCC_CAM = [(33.7935, -80.7360), (33.900, -80.700), (34.050, -80.650), CAM]                    # McCord's Ferry - Camden

MAPS = {
    "lowcountry": dict(
        s=1.0, ferry_scale=1.5, roads_k=1.4, label_k=1.1,   # baked for the wide opening framing (Charleston - Nelson's Ferry - Camden at s ~1.0-1.2)
        water=dict(blur=3.0, pier=2, chan=3, island=1500, lake=20000),
        nhd=["Wateree River", "Broad River", "Saluda River", "Great Pee Dee River", "Little Pee Dee River", "Lynches River", "Black River",
             "Black Mingo Creek", "Pocotaligo River", "Edisto River", "North Fork Edisto River", "South Fork Edisto River", "Cooper River",
             "West Branch Cooper River", "Ashley River", "Waccamaw River", "North Santee River", "South Santee River", "Sampit River"],
        county={"Santee 1780": SANTEE_COUNTY, "Congaree 1780": CONGAREE_COUNTY, "Wateree 1780": WATEREE_COUNTY},
        rivers=[("Santee 1780", 3.4, (32.9, 34.2, -80.75, -79.30)), ("North Santee River", 2.6, (33.0, 33.4, -79.6, -79.1)), ("South Santee River", 2.4, (33.0, 33.4, -79.6, -79.1)),
                ("Congaree 1780", 2.8, (33.6, 34.1, -81.2, -80.55)), ("Wateree 1780", 2.6, (33.7, 34.7, -81.0, -80.55)),
                ("Broad River", 2.2, (33.95, 34.7, -81.6, -80.9)), ("Saluda River", 2.0, (33.9, 34.3, -82.2, -81.0)),
                ("Great Pee Dee River", 3.0, (33.3, 34.7, -80.2, -79.0)), ("Little Pee Dee River", 2.0, (33.6, 34.7, -79.7, -79.0)),
                ("Lynches River", 2.2, (33.8, 34.7, -80.6, -79.3)), ("Black River", 2.2, (33.3, 34.2, -80.4, -79.1)), ("Pocotaligo River", 1.6, (33.6, 33.9, -80.4, -79.9)),
                ("Black Mingo Creek", 1.5, (33.5, 33.75, -79.7, -79.3)), ("Edisto River", 2.6, (32.4, 33.5, -81.5, -80.2)),
                ("North Fork Edisto River", 1.8, (33.2, 34.0, -82.2, -80.9)), ("South Fork Edisto River", 1.8, (33.0, 34.0, -82.2, -80.9)),
                ("Cooper River", 2.6, (32.75, 33.25, -80.05, -79.85)), ("West Branch Cooper River", 2.0, (33.0, 33.25, -80.05, -79.9)),
                ("Ashley River", 2.2, (32.75, 33.1, -80.3, -79.9)), ("Waccamaw River", 2.6, (33.3, 34.0, -79.4, -78.6)), ("Sampit River", 1.6, (33.3, 33.45, -79.5, -79.25))],
        creeks=0,
        swamp=dict(on=["Santee 1780", "Congaree 1780", "Wateree 1780", "Great Pee Dee River", "Lynches River", "Black River", "Black Mingo Creek",
                       "Pocotaligo River", "Edisto River", "Little Pee Dee River", "Waccamaw River", "Cooper River", "West Branch Cooper River"],
                   hand=3.5, dist=3500, close=4),
        towns={
            "charleston": ("Charleston", *CHS, 34, True, "W", 1670, [(-330, 30), (-250, 6), (-160, -4), (-70, 6)]),   # west of the neck over the Ashley marshes
            "camden": ("Camden", *CAM, 24, True, "E", 1733),
            "georgetown": ("Georgetown", *GEO, 20, True, "N", 1729),
            "kingstree": ("Kingstree", *KT, 13, False, "", 1732),
            "jacksonborough": ("Jacksonborough", *JB, 11, False, "", 1735),
            "moncks_corner": ("Monck's Corner", *MC, 11, False, "", 1735),
        },
        roads=[("chs_nelson", ROAD_CHS_NEL), ("nelson_camden", ROAD_NEL_CAM), ("savannah_kingstree", ROAD_SAV_KT), ("kingstree_shepherd", ROAD_KT_SHEP),
               ("shepherd_georgetown", ROAD_SHEP_GEO), ("kingstree_murray", ROAD_KT_MUR), ("murray_moncks", ROAD_MUR_MC), ("chs_parker", ROAD_CHS_PARK),
               ("parker_jacksonborough", ROAD_PARK_JB), ("moncks_fortmotte", ROAD_CHS_FTM), ("mccord_camden", ROAD_MCC_CAM)],
        ferries=[("nelsons_ferry", NEL_S, NEL_N), ("murrays_ferry", MUR_N, MUR_S), ("shepherds_ferry", SHEP_N, SHEP_S), ("parkers_ferry", PARK_E, PARK_W),
                 ("mccords_ferry", MCCORD, (33.7935, -80.7360))],
        relief=[], mounds=[], keep=[],
    ),
    "santee": dict(
        s=1.6, ferry_scale=1.6, label_k=1.0,
        water=dict(blur=6.0, pier=4, chan=4, island=3000, lake=40000),
        nhd=["Halfway Swamp Creek", "Eutaw Creek"],
        county={"Santee 1780": SANTEE_COUNTY},
        rivers=[("Santee 1780", 8.5, (33.30, 33.65, -80.70, -80.00)), ("Halfway Swamp Creek", 2.6, (33.50, 33.70, -80.70, -80.50)),
                ("Eutaw Creek", 2.4, (33.38, 33.43, -80.33, -80.28))],
        wet=[(2.6, [(33.4947, -80.3054), (33.4900, -80.3020), (33.4819, -80.3007), (33.4718, -80.3089), (33.4589, -80.3174), (33.4518, -80.3213),   # Horse Creek
                    (33.4489, -80.3380), (33.4543, -80.3638), (33.4614, -80.3895), (33.4704, -80.4084), (33.4826, -80.4213), (33.4962, -80.4290), (33.5015, -80.4333), (33.5030, -80.4362)])],
        ponds=[[(33.5452, -80.4458), (33.5440, -80.4472), (33.5416, -80.4492), (33.5390, -80.4503), (33.5370, -80.4509), (33.5345, -80.4507), (33.5327, -80.4499),
                (33.5300, -80.4480), (33.5294, -80.4470), (33.5304, -80.4466), (33.5330, -80.4484), (33.5368, -80.4490), (33.5410, -80.4476), (33.5440, -80.4456)]],   # Scott's Lake
        creeks=0,
        swamp=dict(on=["Santee 1780", "Halfway Swamp Creek", "wet0"], hand=4.0, dist=5200, close=10),
        towns={
            "great_savannah": ("Great Savannah", *SAV, 5, False, "", 1754),     # Sumter's house (single house sprite)
            "eutaw": ("Eutaw Springs", *EUT, 5, False, "", 1781),               # the brick house by the springs
        },
        roads=[("chs_nelson", ROAD_CHS_NEL), ("nelson_camden", ROAD_NEL_CAM), ("savannah_kingstree", ROAD_SAV_KT),
               ("eutaw_west", [EUT, (33.415, -80.340), (33.440, -80.400), (33.475, -80.460), (33.500, -80.540), (33.520, -80.640)])],
        ferries=[("nelsons_ferry", NEL_S, NEL_N)],
        relief=[[(33.5480, -80.6000), (33.5280, -80.5600), (33.5100, -80.5000), (33.4850, -80.4550), (33.4560, -80.4100), (33.4330, -80.3650), (33.4230, -80.3300),
                 (33.4100, -80.3000), (33.3950, -80.2950), (33.4000, -80.3400), (33.4200, -80.3850), (33.4450, -80.4300), (33.4750, -80.4750), (33.5000, -80.5200),
                 (33.5200, -80.5700), (33.5350, -80.6050)]],     # the Santee bluffs on the south bank (Eutawville - Vance, 1920 quad)
        mounds=[(33.5391, -80.4376, 70, 11)],                      # the Santee Indian Mound (Fort Watson), ~11 m high
        keep=[(*SAV, 500), (*EUT, 450), (*FTW, 350), (*NEL_S, 300), (*NEL_N, 300)],
    ),
    "blackriver": dict(
        s=1.3, ferry_scale=1.7, label_k=1.0,
        water=dict(blur=4.0, pier=3, chan=3, island=2000, lake=30000),
        nhd=["Black River", "Pocotaligo River", "Ox Swamp", "Tearcoat Branch", "Jacks Creek", "Pudding Swamp", "Halfway Swamp Creek"],
        county={"Santee 1780": SANTEE_COUNTY},
        rivers=[("Santee 1780", 6.0, (33.30, 33.80, -80.80, -80.00)), ("Black River", 4.6, (33.45, 34.00, -80.40, -79.50)),
                ("Pocotaligo River", 3.4, (33.60, 33.95, -80.40, -79.90)), ("Ox Swamp", 2.6, (33.66, 33.75, -80.25, -80.10)),
                ("Tearcoat Branch", 2.4, (33.78, 33.90, -80.30, -80.10)), ("Jacks Creek", 2.2, (33.60, 33.70, -80.50, -80.38)),
                ("Pudding Swamp", 2.2, (33.60, 33.90, -80.20, -79.90)), ("Halfway Swamp Creek", 2.2, (33.55, 33.75, -80.70, -80.50))],
        creeks=0,
        swamp=dict(on=["Santee 1780", "Black River", "Pocotaligo River", "Ox Swamp", "Tearcoat Branch", "Jacks Creek", "Pudding Swamp"], hand=3.5, dist=2600, close=6),
        towns={
            "kingstree": ("Kingstree", *KT, 18, True, "SE", 1732),
            "richardson": ("Richardson's", *RICH, 5, False, "", 1758),          # Gen. Richardson's plantation house (burns at m2-3: the glow is live)
        },
        roads=[("savannah_kingstree", ROAD_SAV_KT), ("nelson_camden", ROAD_NEL_CAM), ("kingstree_benbow", ROAD_KT_BEN), ("benbow_richardson", ROAD_BEN_OX),
               ("ox_north", ROAD_OX_N), ("kingstree_shepherd", ROAD_KT_SHEP), ("kingstree_murray", ROAD_KT_MUR)],
        ferries=[("benbows_ferry", BEN_W, BEN_E)],
        relief=[], mounds=[], keep=[(*KT, 900), (*RICH, 400), (*BEN_E, 300)],
    ),
    "blackmingo": dict(   # NEW map (the brief's blackriver z12 cannot hold both Richardson's and Black Mingo): Shepherd's Ferry + the plank bridge
        s=1.6, ferry_scale=1.7, label_k=1.0,
        water=dict(blur=6.0, pier=4, chan=4, island=3000, lake=40000),
        nhd=["Black River", "Black Mingo Creek", "Indiantown Swamp", "Pudding Swamp"],
        rivers=[("Black River", 7.0, (33.40, 33.80, -79.80, -79.10)), ("Black Mingo Creek", 4.2, (33.50, 33.80, -79.80, -79.30)),
                ("Indiantown Swamp", 2.4, (33.60, 33.80, -79.70, -79.45))],
        creeks=0,
        swamp=dict(on=["Black River", "Black Mingo Creek", "Indiantown Swamp"], hand=3.5, dist=2200, close=8),
        towns={"dollard": ("Dollard's", 33.6150, -79.4400, 5, False, "", 1780)},   # Dollard's tavern (the Red House) by Shepherd's Ferry, south side
        roads=[("kingstree_shepherd", ROAD_KT_SHEP), ("shepherd_georgetown", ROAD_SHEP_GEO)],   # + the plank-bridge road (added after the creek check)
        ferries=[("shepherds_ferry", SHEP_N, SHEP_S)],
        relief=[], mounds=[], keep=[(*SHEP_N, 300), (*SHEP_S, 300)],
    ),
    "congaree": dict(
        s=1.6, ferry_scale=1.6, label_k=1.0,
        water=dict(blur=6.0, pier=4, chan=4, island=3000, lake=40000),
        nhd=["Buckhead Creek", "Halfway Swamp Creek"],
        county={"Santee 1780": SANTEE_COUNTY, "Congaree 1780": CONGAREE_COUNTY, "Wateree 1780": WATEREE_COUNTY},
        rivers=[("Santee 1780", 9.0, (33.40, 33.80, -80.70, -80.30)), ("Congaree 1780", 7.6, (33.60, 33.95, -81.00, -80.55)),
                ("Wateree 1780", 7.0, (33.70, 34.00, -80.75, -80.50)), ("Buckhead Creek", 2.4, (33.70, 33.765, -80.70, -80.64)),
                ("Halfway Swamp Creek", 2.6, (33.55, 33.75, -80.80, -80.50))],
        creeks=0,
        swamp=dict(on=["Santee 1780", "Congaree 1780", "Wateree 1780", "Halfway Swamp Creek"], hand=4.0, dist=5000, close=10),
        towns={"motte": ("Fort Motte", *FTM, 6, False, "", 1767), "farm": ("Motte farmhouse", *FARM, 4, False, "", 1770)},
        roads=[("moncks_fortmotte", ROAD_CHS_FTM), ("mccord_camden", ROAD_MCC_CAM), ("fortmotte_farm", [FTM, (33.758, -80.662), FARM, (33.740, -80.640), (33.700, -80.620), (33.640, -80.610)])],
        ferries=[("mccords_ferry", MCCORD, (33.7935, -80.7360))],
        relief=[[(33.7700, -80.7000), (33.7690, -80.6800), (33.7690, -80.6550), (33.7620, -80.6420), (33.7480, -80.6420), (33.7460, -80.6650), (33.7520, -80.6900), (33.7600, -80.7050)]],   # Buckhead hill + the Congaree bluff
        mounds=[], keep=[(*FTM, 380), (*FARM, 250)],
    ),
    "edisto": dict(
        s=1.6, ferry_scale=1.6, label_k=1.0,
        water=dict(blur=6.0, pier=4, chan=4, island=3000, lake=60000),
        nhd=["Edisto River", "Horse Pen Creek", "Cypress Swamp", "Penny Creek"],
        rivers=[("Edisto River", 8.0, (32.60, 33.10, -80.70, -80.20)), ("Penny Creek", 2.4, (32.80, 33.0, -80.45, -80.20)), ("Cypress Swamp", 2.4, (32.80, 33.0, -80.45, -80.20))],
        creeks=0,
        swamp=dict(on=["Edisto River", "Penny Creek", "Cypress Swamp"], hand=3.0, dist=3600, close=10),
        towns={"jacksonborough": ("Jacksonborough", *JB, 12, False, "", 1735)},
        roads=[("chs_parker", ROAD_CHS_PARK), ("parker_jacksonborough", ROAD_PARK_JB)],
        ferries=[("parkers_ferry", PARK_E, PARK_W)],
        relief=[], mounds=[], keep=[(*PARK_E, 250), (*PARK_W, 250)],
        causeway=True,
    ),
}

# ---------------------------------------------------------------- named story points (lat, lon) for PLACE("...") in the scenes
PLACES = {
    "charleston": CHS, "camden": CAM, "georgetown": GEO, "kingstree": KT, "jacksonborough": JB, "moncks_corner": MC,
    "nelsons_ferry": (33.4307, -80.3256), "nelsons_ferry_s": NEL_S, "nelsons_ferry_n": NEL_N, "great_savannah": SAV, "horse_creek_pass": (33.4880, -80.3050),
    "fort_watson": FTW, "scotts_lake": (33.5370, -80.4495), "eutaw_springs": EUT, "wrights_bluff": (33.545, -80.440),
    "fort_motte": FTM, "motte_farmhouse": FARM, "buckhead_hill": (33.7640, -80.6720), "congaree_wateree_fork": (33.7399, -80.6084), "mccords_ferry": MCCORD,
    "parkers_ferry": (32.8595, -80.4015), "parkers_ambush": (32.8600, -80.3830), "edisto_causeway": (32.8600, -80.3700),
    "richardsons": RICH, "jacks_creek_mill": (33.660, -80.420), "woodyard_swamp": (33.665, -80.445), "ox_swamp": OX,
    "tearcoat_swamp": (33.803, -80.125), "benbows_ferry": (33.7505, -79.9515), "shepherds_ferry": (33.6225, -79.4350), "black_mingo_bridge": (33.6330, -79.4520),
    "dollards_tavern": (33.6150, -79.4400), "snows_island": (33.828, -79.344), "murrays_ferry": (33.4225, -79.8955),
    "winnsborough": (34.38, -81.09), "ninety_six": (34.175, -82.024), "amis_mill": (34.70, -79.30), "fishing_creek": (34.62, -80.87), "waxhaws": (34.83, -80.71),
}
# river centre-lines (lat, lon) for the carved river names (RIVER(...) in the kit): sampled from kit/data/rivers_<map>.json by kit/river_lines.py
# (the 1780 Santee / Congaree / Wateree from the TIGER county lines), plus the hand-set lines below
RIVER_LINES = {}
