"""Build vicksburg/data/geo.json (+ the tables in research/GEO.md) from the hand-checked lists below.
Coordinates: WGS84 lat/lon and 'vicksburg_hd_lift' map units (web mercator z10, origin_world_px [63513,105473], 129.36 m/unit).
acc = estimated position error in metres. src codes are explained in research/GEO.md (Sources).
usage: python3 vicksburg/tools/make_geo.py   (reads the DEM only to report ground height; writes data/geo.json + the tables at the end of research/GEO.md)"""
import json, math, os
import numpy as np

REPO = "/home/user/battle-maps"; HERE = f"{REPO}/vicksburg"
N = 256 * 2 ** 10; OX, OY = 63513, 105473

def to_map(lat, lon):
    la = math.radians(lat)
    return (lon + 180) / 360 * N - OX, (1 - math.log(math.tan(la) + 1 / math.cos(la)) / math.pi) / 2 * N - OY

def to_ll(x, y):
    X, Y = x + OX, y + OY
    return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * Y / N)))), X / N * 360 - 180

ELEV = np.load(f"{REPO}/grant/assets/src/vicksburg_hd_elev.npy", mmap_mode="r")
def elev(x, y):
    i, j = int(round(y * 2)), int(round(x * 2))
    return float(ELEV[i, j]) if 0 <= i < ELEV.shape[0] and 0 <= j < ELEV.shape[1] else None

def P(name, a, b, kind, acc, src, note="", mapu=False):
    """a,b = lat,lon (default) or x,y map units (mapu=True)"""
    if mapu: x, y = a, b; lat, lon = to_ll(x, y)
    else: lat, lon = a, b; x, y = to_map(lat, lon)
    return dict(name=name, lat=round(lat, 5), lon=round(lon, 5), x=round(x, 1), y=round(y, 1), kind=kind, acc_m=acc, src=src,
                note=note, ground_m=None if elev(x, y) is None else round(elev(x, y), 1))

# ---------------------------------------------------------------- places (1863 sites)
PLACES = [
 # river front, west bank route
 P("Vicksburg (Warren County courthouse, 1858)", 32.35219, -90.87872, "town", 30, "OSM;WD", "courthouse = Old Court House Museum; Logan's flag raised here 4 Jul"),
 P("Pemberton's HQ (Willis-Cowan house, Crawford St)", 32.34824, -90.87765, "hq", 30, "WD;NPS", "surrender decided here night 3 Jul"),
 P("Milliken's Bend (1863 landing, town since eroded)", 32.45583, -91.10472, "town", 2000, "GNIS", "1863 town lost to the river; approximate"),
 P("Young's Point (Grant's HQ from 29 Jan 1863)", 1328, 702, "landing", 2500, "EST(GM: where the river turns NE toward the city; W end of the canal)", "estimate, Louisiana bank at the neck of De Soto Point", mapu=True),
 P("Richmond, La. (burned June 1863)", 32.3858, -91.1747, "town", 500, "GNIS;WD", ""),
 P("Duckport (Duckport canal head)", 32.3925, -91.01389, "landing", 800, "GNIS", "failed Duckport canal, Apr 1863"),
 P("New Carthage (flooded, Apr 1863)", 32.200, -91.060, "landing", 4000, "EST(GM ch.XXXII-XXXIII; Roundaway/Vidal bayou mouth)", "estimate"),
 P("Perkins' plantation (Grant HQ 24 Apr)", 32.120, -91.110, "plantation", 4000, "EST(GM ch.XXXIII)", "estimate; on the river below New Carthage"),
 P("Hard Times plantation (corps assembly 27 Apr)", 32.0379, -91.1242, "plantation", 800, "GNIS;WD", "1863 landing was on the 1863 river bank: river has moved"),
 P("Disharoon's (De Shroon's) plantation, embarkation 30 Apr", 31.9938, -91.0398, "landing", 1500, "WD", "6 mi above Bruinsburg (GM); 1863 river bank"),
 P("Coffee Point (tongue of land opposite Grand Gulf, levee march night 29 Apr)", 32.010, -91.075, "point", 3000, "EST(GM ch.XXXIII)", "estimate"),
 P("Grand Gulf (town site)", 32.0333, -91.0525, "town", 300, "GNIS", "town largely gone by 1863"),
 P("Fort Cobun (upper battery, Point of Rock)", 32.0400, -91.0545, "fort", 500, "EST(Grand Gulf Military Park 32.0277,-91.0501 OSM)", "north end of the Grand Gulf works; check on DEM bluff"),
 P("Fort Wade (lower battery)", 32.0215, -91.0480, "fort", 600, "EST", "~1.3-2 km south of Fort Cobun; check on DEM bluff"),
 P("Grand Gulf Military Park (today)", 32.02766, -91.05011, "park", 50, "OSM", ""),
 P("Bruinsburg landing (30 Apr)", 31.9425, -91.1572, "landing", 800, "GNIS;WD", "1863 landing on the river; Bayou Pierre mouth just above"),
 P("Windsor (plantation house, ruins)", 31.94081, -91.13722, "house", 50, "WD;OSM", "Union troops passed it on 30 Apr (tradition); house burned 1890"),
 P("Bayou Pierre mouth (1863 approx)", 31.920, -91.190, "river", 1500, "GNIS(stream point)", "Grant: enters the Mississippi just above Bruinsburg"),
 # Port Gibson
 P("Port Gibson", 31.95611, -90.98306, "town", 200, "GNIS;WD", "'too beautiful to burn' is a later legend: do not quote"),
 P("Shaifer house (opening shots ~midnight 30 Apr/1 May)", 31.9636, -91.0444, "house", 900, "EST(WP/ABT text: fork of Rodney & Bruinsburg roads)", "where the roads to Port Gibson split; check road fork"),
 P("Magnolia Church (Green's line, Rodney road)", 31.95682, -91.00344, "church", 900, "OSM (modern church on Rodney Rd; 1863 church site may differ)", ""),
 P("Port Gibson battlefield marker", 31.95778, -91.01889, "marker", 100, "WD", "GNIS 'Port Gibson Battle Site'"),
 P("Foster farm (Confederate guns, Rodney road)", 31.9600, -91.0300, "farm", 1200, "EST(WP text)", ""),
 P("Bayou Pierre South Fork bridge at Port Gibson (burned 1 May; raft bridge 2 May)", 31.9610, -90.9790, "bridge", 600, "EST(GM ch.XXXIV)", "on the Grand Gulf/Vicksburg road just N of town"),
 P("Bayou Pierre North Fork bridge, Grindstone Ford (repaired night 2 May)", 32.0035, -90.8950, "bridge", 1000, "GNIS(Grindstone Ford cemetery 32.0027,-90.8951);GM", ""),
 P("Willow Springs (road junction)", 32.03599, -90.89622, "crossroads", 1000, "OSM(Willow Springs church)", "GM: McPherson held the road back to Willow Springs"),
 P("Hankinson's Ferry (Big Black, ferry boat seized 3 May)", 1382.5, 883, "ferry", 1500, "OSM(Hankinson hamlet 32.10654,-90.87955) snapped to the Big Black on the DEM", "", mapu=True),
 P("Rocky Springs", 32.08889, -90.815, "town", 300, "GNIS;WD", "10 mi from Hankinson's Ferry (GM)"),
 P("Big Sandy Creek crossing (McClernand camp 8-10 May)", 32.120, -90.730, "camp", 4000, "EST(GM)", "estimate"),
 P("Utica", 32.1033, -90.6222, "town", 300, "GNIS;WD", ""),
 P("Cayuga", 32.15944, -90.69389, "town", 500, "GNIS;WD", ""),
 P("Auburn (New Auburn, Hinds Co.; Blair arrived 14 May)", 32.2158, -90.5872, "town", 1500, "WD(Auburn cemetery)", "1863 village gone; cemetery point"),
 P("Dillon's plantation", 32.235, -90.560, "plantation", 3000, "EST(GM ch.XXXV: McClernand by Dillon's to Raymond)", "estimate; on the Auburn-Raymond road"),
 # Raymond
 P("Raymond (Hinds County courthouse, 1859)", 32.26028, -90.42333, "town", 50, "WD", "Confederate hospital in the courthouse"),
 P("Raymond battlefield (Raymond Military Park)", 32.23917, -90.44861, "battlefield", 100, "WD;WP", "~2 mi SW of town on MS-18"),
 P("Fourteenmile Creek bridge on the Utica road (Raymond)", 1693, 784.5, "bridge", 700, "EST(WP text; creek snapped on DEM)", "just S of the Military Park", mapu=True),
 P("Mississippi Springs (Sherman's camp 13 May)", 1763, 750, "town", 2500, "EST(WP: Gregg fell back 5 mi toward Jackson to it; GM)", "village gone; estimate", mapu=True),
 P("Clinton", 32.3417, -90.3217, "town", 300, "WD", "McPherson tore up the railroad here 13 May"),
 P("O. P. Wright farm (Colquitt's stand, 14 May)", 32.315, -90.240, "farm", 1500, "EST(WP: 3 mi out on the Clinton road)", ""),
 P("Lynch Creek bridge (Sherman's road, 14 May)", 1879.5, 742.5, "bridge", 900, "OSM(Lynch Creek);WP; snapped on DEM", "", mapu=True),
 P("Jackson (Old Capitol)", 32.29976, -90.17964, "town", 30, "WD;OSM", "Crocker's men raised the flag over the capitol (GM)"),
 P("Pearl River at Jackson (Confederate line anchors N and S)", 32.300, -90.170, "river", 800, "DEM", "works ran from the Pearl north of the city to the Pearl south (GM)"),
 P("Canton road (Johnston's retreat, camp 6 mi N of Jackson night 14 May)", 32.385, -90.140, "road", 3000, "EST(GM)", ""),
 P("Bolton (Bolton's Depot)", 32.34931, -90.4601, "town", 300, "WD", "Hovey here night 15 May"),
 P("Brownsville", 32.448, -90.435, "town", 1500, "WD(Brownsville cemetery)", "Johnston between Brownsville and the Big Black 1 Jul"),
 P("Edwards (Edwards Station / Edwards Depot)", 32.33083, -90.60417, "town", 300, "GNIS;WD", "existing bake_clip value (1599.4,716.4) is ~2.5 km SE of this"),
 P("Mrs. Ellison's (Pemberton's camp night 15 May)", 32.300, -90.585, "farm", 2500, "EST(Pemberton letter in Johnston's Narrative)", "fork of the Raymond road"),
 # Champion Hill
 P("Champion Hill crest (the hill)", 1638.5, 694.2, "hill", 300, "DEM summit 109 m, 600 m N of the crossroads marker (WP: crossroads 1/3 mi S of crest)", "higher ground (118 m) continues SE along the ridge", mapu=True),
 P("Crossroads (Jackson Road / Middle Road)", 32.3297, -90.5303, "crossroads", 400, "WD/WP battle point (marker at Billy Fields Rd x DJ Johnson Rd)", ""),
 P("Champion house (Hovey's start; site)", 32.3440, -90.5180, "house", 800, "EST(GM: road turns S at the hill's north end; ABT)", "house burned after the battle"),
 P("Jackson Road bridge over Baker's Creek", 32.3320, -90.5560, "bridge", 800, "EST(GM: ~1 mi W of crossroads)", "snap to Baker's Creek on DEM"),
 P("Raymond Road ford/bridge over Baker's Creek (Pemberton's escape)", 1606, 711, "bridge", 1000, "EST (snapped to Baker's Creek on the DEM)", "", mapu=True),
 P("Coker house (Loring's position, Raymond Road)", 32.3150, -90.5480, "house", 800, "EST(MDAH/WP: S part of field, Raymond Rd)", ""),
 P("Roberts house (Middle Road)", 32.3220, -90.5130, "house", 1500, "EST", "Bowen/Osterhaus sector; estimate"),
 P("Jackson Creek (Pemberton's initial line overlooked it)", 32.3220, -90.5180, "creek", 1500, "WP/ABT text", ""),
 # Big Black
 P("Big Black railroad bridge (burned 17 May)", 32.34694, -90.70472, "bridge", 100, "WD;GNIS;WP", "existing brief value (1518,705) is ~2.9 km S of this: the real bridge sits at the river's westward turn, y~683"),
 P("Steamboat 'Dot' bridge (just above rail bridge)", 32.3480, -90.7058, "bridge", 400, "WP", "ferry site; Dot turned crosswise as a bridge"),
 P("Big Black battlefield (Confederate bridgehead)", 1519, 685, "battlefield", 600, "EST(WP/GM text; DEM bend) vs WD 32.36,-90.726", "bridgehead = the bottom SE of the bend, E of the bridge", mapu=True),
 P("Bovina (Bovina station)", 32.3522, -90.7347, "town", 1000, "WD (WP town 32.3489,-90.7458)", "existing brief value (1495.5,701.2) is ~3 km SE of this"),
 P("Bridgeport (Sherman's crossing, 17 May)", 1574.5, 629.5, "ferry", 3500, "EST(GM: ~11 mi above the rail bridge; snapped to the Big Black on the DEM)", "estimate", mapu=True),
 P("Mount Alban (Mt. Alban)", 32.3572, -90.80677, "town", 1500, "OSM(Mount Alban Road)", "McClernand turned off here 18 May"),
 # Yazoo front
 P("Haynes' Bluff (Drumgould's Bluff)", 32.51625, -90.78538, "fort", 800, "GNIS;WD", "abandoned 18 May, cavalry took it (SM)"),
 P("Snyder's Bluff (Snyder's Mill)", 32.4975, -90.79806, "fort", 800, "GNIS;WD", "Sherman's feint 29 Apr-1 May"),
 P("Chickasaw Bayou battlefield (29 Dec 1862)", 32.40556, -90.84778, "battlefield", 500, "WP;WD", ""),
 P("Walnut Hills (bluff N of Vicksburg; Sherman looked down 18 May)", 32.42514, -90.81677, "hill", 1000, "GNIS", ""),
 P("Warrenton", 32.2475, -90.92833, "town", 500, "GNIS;WD", "6 mi below Vicksburg (GM)"),
 # Vicksburg defence line (Confederate)
 P("Fort Hill (N anchor on the river)", 32.37015, -90.86927, "fort", 100, "GNIS;OSM", ""),
 P("Stockade Redan (Graveyard Road)", 32.3652, -90.8470, "fort", 300, "EST(between Conf. Ave node 32.36472,-90.84626 and Graveyard Rd)", "Sherman 19 + 22 May"),
 P("3rd Louisiana Redan (Jackson Road; mined 25 Jun + 1 Jul)", 32.3592, -90.8432, "fort", 200, "EST(Jackson Rd node 32.35938,-90.84200; W of Shirley house)", "Union reports call it 'Fort Hill': do not confuse with the river Fort Hill"),
 P("Great Redoubt", 32.3568, -90.8468, "fort", 300, "EST(Louisiana Memorial 32.35711,-90.84697)", ""),
 P("2nd Texas Lunette (Baldwin's Ferry Road)", 32.3505, -90.8515, "fort", 400, "EST", "A. J. Smith (Burbridge) 22 May"),
 P("Railroad Redoubt (Southern RR of Mississippi)", 32.3435, -90.8555, "fort", 400, "EST(Texas Memorial 32.34291,-90.85631)", "only work entered on 22 May (Lawler, 22nd Iowa)"),
 P("Square Fort (Fort Garrott)", 32.33624, -90.86287, "fort", 100, "OSM", ""),
 P("South Fort (S anchor on the river)", 32.31609, -90.89852, "fort", 100, "OSM", ""),
 P("Shirley house (Union side, Jackson Road)", 32.35968, -90.84055, "house", 30, "OSM", "the 'White House'; only wartime house left in the park"),
 P("Surrender interview site (stunted oak, 3 Jul 3 p.m.)", 32.35749, -90.84467, "site", 50, "OSM;NPS", "a few hundred feet from the Confederate line"),
 P("Grant's HQ during the siege (approx)", 32.3700, -90.8320, "hq", 1200, "EST(Grant equestrian statue at 32.37717,-90.83437 OSM)", "Grant's camp on the Union right-centre; do not label exactly"),
 P("Grant's canal (NPS unit)", 32.32056, -90.93278, "canal", 300, "GNIS;WD", "remnant on the old De Soto peninsula"),
 P("Vicksburg City Cemetery (Graveyard Road name)", 32.36659, -90.85798, "cemetery", 100, "OSM", ""),
]

# ---------------------------------------------------------------- polylines (map units unless noted); acc in metres
def L(name, kind, acc, src, pts, note="", ll=False):
    if ll: pts = [to_map(a, b) for a, b in pts]
    return dict(name=name, kind=kind, acc_m=acc, src=src, note=note,
                pts=[[round(x, 1), round(y, 1)] for x, y in pts],
                latlon=[[round(a, 5), round(b, 5)] for a, b in (to_ll(x, y) for x, y in pts)])

T = {p["name"].split(" (")[0]: (p["x"], p["y"]) for p in PLACES}
def t(k): return T[k]

ROADS = [
 L("West-bank route: Milliken's Bend - Richmond - Roundaway Bayou - New Carthage", "road", 2500, "GM ch.XXXII; WP; DEM",
   [t("Milliken's Bend"), t("Richmond, La."), (1205, 690), (1215, 730), (1225, 770), t("New Carthage")], "corduroy + bridges; follows Roundaway Bayou levee"),
 L("West-bank route: New Carthage - Perkins' - west of Lake St. Joseph - Hard Times", "road", 3000, "GM ch.XXXIII (road west of Lake St. Joseph; 3 bayous bridged)",
   [t("New Carthage"), t("Perkins' plantation"), (1190, 895), (1162, 920), (1150, 945), (1172, 962), t("Hard Times plantation")], "Lake St. Joseph at 32.048,-91.218 (OSM)"),
 L("Levee across Coffee Point: Hard Times - Disharoon's (night 29 Apr)", "road", 3000, "GM ch.XXXIII", [t("Hard Times plantation"), t("Coffee Point"), t("Disharoon's")]),
 L("Bruinsburg - bluffs - Shaifer house (Bruinsburg road)", "road", 1200, "GM ch.XXXIII; WP Port Gibson",
   [t("Bruinsburg landing"), (1188, 1030), t("Windsor"), (1215, 1025), (1240, 1020), (1255, 1016), t("Shaifer house")], "~2 mi of bottom then up onto the ridge (GM)"),
 L("Rodney Road: Shaifer house - Magnolia Church - Port Gibson", "road", 900, "WP; OSM Rodney Road", [t("Shaifer house"), (1281, 1019), t("Magnolia Church"), t("Port Gibson")]),
 L("Bruinsburg (north) road: Shaifer house - ridge - Port Gibson", "road", 1200, "WP; GM ('two ridges, a mile or two apart, unite just outside the town')",
   [t("Shaifer house"), (1276, 1012), (1288, 1009), (1298, 1013), t("Port Gibson")]),
 L("Port Gibson - Grindstone Ford - Willow Springs - Rocky Springs - Utica - Raymond", "road", 1500, "GM ch.XXXIV; GNIS towns",
   [t("Port Gibson"), t("Bayou Pierre South Fork bridge at Port Gibson"), (1330, 995), t("Bayou Pierre North Fork bridge, Grindstone Ford"), t("Willow Springs"), t("Rocky Springs"), (1490, 895), t("Utica"), (1620, 840), (1675, 800), t("Raymond battlefield"), t("Raymond")]),
 L("Willow Springs - Hankinson's Ferry (road to Vicksburg)", "road", 1500, "GM", [t("Willow Springs"), (1370, 920), t("Hankinson's Ferry")]),
 L("Grand Gulf - Willow Springs road (Logan to Grand Gulf 3 May)", "road", 2000, "GM", [t("Grand Gulf"), (1290, 945), (1325, 950), t("Willow Springs")]),
 L("Rocky Springs - Cayuga - Auburn - Dillon's - Raymond", "road", 2500, "GM ch.XXXIV-XXXV", [t("Rocky Springs"), (1475, 885), t("Cayuga"), t("Auburn"), t("Dillon's plantation"), (1655, 780), t("Raymond")]),
 L("Auburn - Edwards (Raymond-Edwards road, Pemberton's 15 May target)", "road", 2500, "GM; Johnston's Narrative", [t("Auburn"), (1597, 760), t("Mrs. Ellison's"), (1590, 710), t("Edwards")]),
 L("Raymond - Clinton road", "road", 1500, "GM ch.XXXV", [t("Raymond"), (1735, 740), (1760, 712), t("Clinton")]),
 L("Raymond - Mississippi Springs - Jackson (Sherman, 14 May)", "road", 2000, "GM ch.XXXV; WP Jackson", [t("Raymond"), (1740, 754), t("Mississippi Springs"), (1820, 744), t("Lynch Creek bridge"), (1888, 732), t("Jackson")]),
 L("Jackson road (upper): Jackson - Clinton - Bolton - Champion house", "road", 1200, "GM; railroad corridor", [t("Jackson"), t("O. P. Wright farm"), (1835, 690), t("Clinton"), (1745, 683), t("Bolton"), (1665, 685), t("Champion house")]),
 L("Jackson road at Champion Hill: Champion house - crest - crossroads - Baker's Creek - Edwards", "road", 500, "GM ch.XXXV (turns S, follows the ridge ~1 mi, turns W, ~1 mi to the creek)",
   [t("Champion house"), t("Champion Hill crest"), t("Crossroads"), t("Jackson Road bridge over Baker's Creek"), (1600, 699), t("Edwards")]),
 L("Middle Road: Raymond-Bolton road - Roberts house - crossroads", "road", 1500, "GM ch.XXXV ('middle road comes into the northern road where the latter turns west')", [(1680, 730), (1665, 714), t("Roberts house"), t("Crossroads")]),
 L("Raymond Road: Raymond - Jackson Creek - Coker house - Baker's Creek - Edwards", "road", 1500, "GM; ABT", [t("Raymond"), (1690, 745), (1660, 728), t("Coker house"), t("Raymond Road ford/bridge over Baker's Creek"), (1593, 712), t("Edwards")]),
 L("Jackson road west: Edwards - Big Black bridge - Bovina - Mount Alban - Vicksburg (Jackson Road)", "road", 1200, "GM ch.XXXVI; SM",
   [t("Edwards"), (1560, 690), (1530, 684), t("Big Black railroad bridge"), t("Bovina"), (1460, 678), t("Mount Alban"), (1420, 674), t("3rd Louisiana Redan"), t("Vicksburg")]),
 L("Southern Railroad of Mississippi (Vicksburg & Jackson RR)", "railroad", 800, "GM; GNIS towns on the line",
   [t("Vicksburg"), (1395, 686), t("Railroad Redoubt"), (1430, 684), t("Mount Alban"), (1470, 682), t("Bovina"), t("Big Black railroad bridge"), (1540, 688), t("Edwards"), (1620, 690), (1660, 683), t("Bolton"), (1740, 684), t("Clinton"), (1850, 700), t("Jackson")]),
 L("Upper Jackson road / Bridgeport road: Bolton - Bridgeport - Graveyard Road (Sherman 17-18 May)", "road", 3000, "SM; GM",
   [t("Bolton"), (1640, 650), (1580, 640), t("Bridgeport"), (1480, 650), (1440, 660), (1415, 664), t("Stockade Redan")]),
 L("Graveyard Road (into the city)", "road", 300, "SM; OSM", [(1412, 664), t("Stockade Redan"), t("Vicksburg City Cemetery"), t("Vicksburg")]),
 L("Baldwin's Ferry Road (into the city)", "road", 400, "NPS; OSM", [(1430, 690), (1410, 686), t("2nd Texas Lunette"), (1396, 685), t("Vicksburg")]),
 L("Hall's Ferry Road (into the city)", "road", 400, "OSM", [(1400, 720), (1388, 700), (1384, 690), t("Vicksburg")]),
 L("Vicksburg - Warrenton road", "road", 800, "GM", [t("Vicksburg"), (1378, 700), t("South Fort"), (1366, 735), t("Warrenton")]),
 L("Valley road at the foot of the bluffs: Vicksburg - Chickasaw Bayou - Haynes' Bluff", "road", 1500, "SM (Steele reached it 18 May)", [t("Fort Hill"), (1400, 640), t("Chickasaw Bayou battlefield"), (1420, 600), t("Snyder's Bluff"), t("Haynes' Bluff")]),
]

RIVERS = [
 L("Mississippi, 1863 channel at Vicksburg (De Soto Point hairpin)", "river", 800, "GM ch.XXXII description + DEM old channels; river cut off the neck in 1876",
   [(1222, 580), (1250, 598), (1278, 612), (1295, 640), (1306, 670), (1318, 692), (1330, 698), (1342, 688), (1352, 672), (1362, 658), (1372, 652), (1381, 655), (1384, 664), (1380, 672), (1377, 681), (1373, 695), (1366, 709), (1358, 735), (1352, 760), (1353, 788)],
   "upstream first; from Young's Point NE to just above the city, then SW along the bluff past the city to Warrenton (GM). Modern Yazoo Diversion Canal follows the city-front arm."),
 L("Grant's canal (1862-63) across the neck of De Soto Point", "canal", 1000, "GM ('a little over a mile', Young's Point to the river below'); NPS unit point", [(1334, 702), (1346, 706), (1355, 711)], "orientation estimated; NPS remnant at (1344,706)"),
 L("Yazoo River lower course + mouth (1863 approx)", "river", 2000, "GM (mouth 9 mi above Vicksburg; Haynes' Bluff 11 mi)", [(1430, 545), (1408, 565), (1395, 590), (1380, 610), (1360, 625), (1345, 640)], "trace on DEM; mouth into the 1863 upper arm"),
 L("Chickasaw Bayou", "bayou", 1500, "GNIS points 32.4428,-90.8572 / 32.4253,-90.8533; SM", [to_map(32.4428, -90.8572), to_map(32.4253, -90.8533), to_map(32.4056, -90.8478)]),
 L("Big Black River at the railroad bridge (bend)", "river", 200, "DEM streams (order 3)", [(1574.5, 629.5), (1565, 660), (1557, 687), (1535, 681), (1518.5, 676.5), (1510, 678), (1509.5, 683), (1508, 690), (1510.5, 705), (1512.5, 717), (1507.5, 736)], "river comes from the E, turns W then S at the bridge (GM: 'the river makes a turn to the west')"),
 L("Big Black River lower course to the Mississippi at Grand Gulf", "river", 800, "DEM streams; GNIS", [(1507.5, 736), (1472, 800), (1434, 837), (1401, 873), (1382.5, 883), (1352.5, 906), (1297, 904), (1270.5, 933), (1251.5, 945)]),
 L("Bayou Pierre (main stem: Grindstone Ford - Port Gibson - Bruinsburg)", "river", 800, "DEM streams; GNIS mouth", [(1400, 965), t("Bayou Pierre North Fork bridge, Grindstone Ford"), (1340, 990), (1310, 1000), (1290, 1000), (1255, 1005), (1240, 1015), (1215, 1008), (1190, 1018), t("Bayou Pierre mouth")]),
 L("Little Bayou Pierre (South Fork) at Port Gibson", "river", 1200, "GNIS 31.98498,-91.00182; DEM", [(1330, 1035), t("Port Gibson"), (1295, 1010), (1290, 1003)], "check on DEM"),
 L("Fourteenmile Creek (Raymond - Big Black)", "creek", 1500, "GNIS/OSM; DEM", [(1720, 790), (1705, 786), t("Fourteenmile Creek bridge on the Utica road"), (1684, 784.5), (1651.5, 785), (1605, 773.5), (1581.5, 759), (1541.5, 759), (1516, 789.5)], "upstream first"),
 L("Baker's Creek (Champion Creek)", "creek", 600, "DEM streams order 3; GNIS mouth 32.2614,-90.6089", [(1665, 675), (1640, 679), (1622, 682), (1617, 695), (1612, 705), (1600, 716), (1590, 725), (1585, 745), (1580, 760)], "upstream first; W foot of Champion Hill"),
 L("Pearl River at Jackson", "river", 500, "gm_test rivers.json (DEM)", [(1913, 640), (1909, 667), (1904.5, 718), (1892.5, 741), (1883.5, 787.5)], "use gm_test/data/rivers.json 'pearl' for the full trace"),
 L("Roundaway Bayou / Bayou Vidal (west-bank route)", "bayou", 2500, "OSM points (Roundaway 32.26301,-91.09529; Vidal 32.24054,-91.19985)", [t("Richmond, La."), (1215, 730), to_map(32.26301, -91.09529), t("New Carthage")]),
 L("Walnut Bayou (Duckport canal target)", "bayou", 1500, "OSM", [to_map(32.40717, -91.17835), to_map(32.38734, -91.16778), to_map(32.37719, -91.17297)]),
]

# ---------------------------------------------------------------- unit positions by battle/phase (map units, acc ~ given)
def U(battle, phase, side, unit, cmdr, x, y, facing, acc, src, move=None, note=""):
    lat, lon = to_ll(x, y)
    d = dict(battle=battle, phase=phase, side=side, unit=unit, commander=cmdr, x=round(x, 1), y=round(y, 1), lat=round(lat, 5), lon=round(lon, 5),
             facing=facing, acc_m=acc, src=src, note=note)
    if move: d["move_to"] = [[round(a, 1), round(b, 1)] for a, b in move]
    return d

sx, sy = t("Shaifer house"); mx_, my_ = t("Magnolia Church"); pgx, pgy = t("Port Gibson")
chx, chy = t("Champion Hill crest"); crx, cry = t("Crossroads"); hx, hy = t("Champion house"); cox, coy = t("Coker house")
bbx, bby = t("Big Black railroad bridge")
UNITS = [
 # Port Gibson 1 May
 U("portgibson", "dawn", "CS", "Green's brigade", "Martin E. Green", mx_ - 3, my_ - 0.5, "W", 600, "WP", note="astride the Rodney road at Magnolia Church"),
 U("portgibson", "dawn", "CS", "Tracy's brigade", "Edward D. Tracy (killed)", sx + 20, sy - 3.5, "SW", 800, "WP", note="athwart the Bruinsburg road; Garrott after Tracy fell"),
 U("portgibson", "dawn", "US", "Carr's division (Benton, Stone)", "Eugene A. Carr", sx + 4, sy + 1, "E", 600, "WP", move=[(mx_ - 6, my_)], note="attacks E on the Rodney road 6:30 a.m."),
 U("portgibson", "morning", "US", "Hovey's division (McGinnis, Slack)", "Alvin P. Hovey", sx + 9, sy + 1, "E", 700, "WP", move=[(mx_ - 2, my_)], note="into the centre; 10 a.m. general advance breaks Green"),
 U("portgibson", "morning", "US", "A. J. Smith's division (Burbridge, Landram)", "Andrew J. Smith", sx + 2, sy + 2, "E", 800, "WP", note="reserve, then second line vs Baldwin 3 p.m."),
 U("portgibson", "morning", "US", "Osterhaus's division (Garrard, Sheldon)", "Peter J. Osterhaus", sx + 9, sy - 2, "NE", 800, "WP;GM", move=[(sx + 15.5, sy - 2.7)], note="Bruinsburg road; repulsed until Logan came up"),
 U("portgibson", "noon", "US", "John E. Smith's brigade (Logan's division)", "John E. Smith", sx + 9.5, sy - 6, "E", 1000, "GM;WP", move=[(sx + 21.5, sy - 6.5)], note="sent N over a ravine to a third ridge, turns the CS right"),
 U("portgibson", "afternoon", "CS", "Baldwin's brigade", "William E. Baldwin", mx_ + 8, my_, "W", 800, "WP", note="behind a creek ~1.5 mi E of Green's second line"),
 U("portgibson", "afternoon", "CS", "Cockrell's Missouri brigade", "Francis M. Cockrell", mx_ + 6, my_ + 2, "SW", 1000, "WP", note="counterattack on the Union right, 40-min firefight, retreat 5:30 p.m."),
 # Raymond 12 May
 U("raymond", "noon", "CS", "Gregg's brigade (7th Texas, 3rd Tenn., 1st Tenn. Bn, 50th Tenn., 10/30th Tenn.)", "John Gregg", 1700.5, 772.5, "SW", 700, "WP", note="on rising ground N of Fourteenmile Creek, Granbury at the Utica/Port Gibson road junction"),
 U("raymond", "noon", "US", "Logan's division (Dennis, J. E. Smith, J. D. Stevenson)", "John A. Logan", 1692, 780, "NE", 700, "GM;WP", move=[(1698, 775)], note="deployed S of the creek, ~2 p.m. per Grant (WP: fight from ~10 a.m.)"),
 U("raymond", "afternoon", "US", "Crocker's division", "Marcellus Crocker", 1684, 786, "NE", 1000, "GM", note="came up late; Gregg's bluff covered his withdrawal"),
 U("raymond", "evening", "CS", "Gregg retreating", "John Gregg", 1719, 761, "NE", 1000, "WP", move=[(1745, 755), t("Mississippi Springs")], note="through Raymond toward Jackson"),
 # Jackson 14 May
 U("jackson", "morning", "US", "McPherson: Crocker's division (lead), Logan behind", "James B. McPherson", 1855, 698, "E", 1000, "GM", move=[t("O. P. Wright farm"), (1880, 708)], note="on the Clinton road; charge at ~11 a.m. drives Colquitt in"),
 U("jackson", "morning", "US", "Sherman: Steele + Tuttle", "William T. Sherman", 1858, 738, "NE", 1000, "GM", move=[t("Lynch Creek bridge"), (1878, 728)], note="Mississippi Springs road, battery at the Lynch Creek bridge"),
 U("jackson", "noon", "US", "Tuttle's division flanking right to the Pearl", "James M. Tuttle", 1885, 740, "N", 1200, "GM", move=[(1895, 730)], note="finds the works empty, captures the gunners + 10 guns"),
 U("jackson", "morning", "CS", "Gregg's rearguard (Colquitt; Walker; Thompson)", "John Gregg", t("O. P. Wright farm")[0] + 3, t("O. P. Wright farm")[1], "W", 1200, "WP", note="delay while wagons left for Canton; gone ~2-3 p.m."),
 # Champion Hill 16 May
 U("championhill", "07:00-10:00", "CS", "Stevenson's division (S. D. Lee on the hill; Cumming at the crossroads; Barton to the NW; Reynolds with the wagons)", "Carter L. Stevenson", chx - 1, chy, "N/E", 600, "WP;ABT", note="line bent back along the hill to cover the Jackson road"),
 U("championhill", "07:00-10:00", "CS", "Bowen's division (Cockrell, Green)", "John S. Bowen", crx + 2, cry + 6, "E", 800, "ABT;WP", note="centre, covering the Middle Road"),
 U("championhill", "07:00-10:00", "CS", "Loring's division (Tilghman, Buford, Featherston)", "William W. Loring", cox + 4, coy, "E", 800, "ABT;WP", note="right, on the Raymond Road near the Coker house"),
 U("championhill", "07:00-10:00", "US", "Hovey's division (McGinnis, Slack)", "Alvin P. Hovey", hx, hy, "S/SW", 500, "GM;OR Hovey", move=[(chx + 1, chy - 2)], note="from the Champion house up the Jackson road; crest ~11:30-13:00"),
 U("championhill", "10:00-13:00", "US", "Logan's division (J. E. Smith, Leggett, J. D. Stevenson)", "John A. Logan", hx - 6, hy - 3, "S/W", 800, "GM", move=[(chx - 8, chy - 2), (crx - 8, cry - 1)], note="right of Hovey, swings W around the hill toward the Jackson road escape route"),
 U("championhill", "13:00-14:30", "CS", "Bowen's counterattack", "John S. Bowen", crx + 2, cry + 6, "N", 600, "ABT;OR Hovey", move=[(crx, cry), (chx, chy), (hx - 1, hy - 2)], note="retakes crossroads + crest, pushes Hovey nearly back to the Champion house"),
 U("championhill", "13:00-14:30", "US", "Crocker's division (Boomer, Holmes; Sanborn)", "Marcellus Crocker", hx - 2, hy + 1, "S", 800, "OR Hovey;GM", move=[(chx + 1, chy - 1)], note="~2,000 men sent up the hill to Hovey"),
 U("championhill", "14:30", "US", "Hovey's massed batteries (1st Missouri, 16th Ohio, Dillon's Wisconsin)", "Alvin P. Hovey", hx - 3, hy - 2, "SW", 600, "OR Hovey", note="enfilade fire at ~2:30 p.m. turns the fight; ground 'contested for the third time'"),
 U("championhill", "07:30-16:00", "US", "Osterhaus + Carr (McClernand) on the Middle Road", "John A. McClernand", t("Roberts house")[0] + 8, t("Roberts house")[1] + 4, "W", 1200, "GM", note="in hearing of the battle, did not press (GM)"),
 U("championhill", "07:30-16:00", "US", "A. J. Smith + Blair on the Raymond Road", "Andrew J. Smith / Frank P. Blair", cox + 14, coy + 4, "W", 1200, "GM", note="confront Loring"),
 U("championhill", "16:00-17:20", "CS", "Retreat by the Raymond Road ford; Tilghman's rearguard", "Lloyd Tilghman (killed 5:20 p.m.)", cox - 2, coy, "E", 800, "ABT;OR", move=[t("Raymond Road ford/bridge over Baker's Creek"), (1585, 720)], note="Loring cut off, turns S/E toward Johnston"),
 # Big Black 17 May
 U("bigblack", "dawn", "CS", "Vaughn's brigade + 4th Mississippi (centre, N of the railroad)", "John C. Vaughn", 1520, 684, "E", 400, "WP", note="cotton-bale parapet behind the bayou"),
 U("bigblack", "dawn", "CS", "Cockrell's brigade (S, at the Jackson road)", "Francis M. Cockrell", 1519.5, 690, "E", 400, "WP", note="to Gin Lake on the right (S)"),
 U("bigblack", "dawn", "CS", "Green's brigade (far left, N, near the river)", "Martin E. Green", 1522, 680.5, "E/NE", 400, "WP", note="N end near the river; 1st Mo. Cav. (dism.) in the work E of the bayou"),
 U("bigblack", "dawn", "US", "Carr's division (Benton; Lawler on the far right)", "Eugene A. Carr", 1528, 683, "W", 500, "GM;WP", note="Lawler moved into a meander scar by the river on the N flank"),
 U("bigblack", "dawn", "US", "Osterhaus's division (Garrard, Lindsey) left of Carr", "Peter J. Osterhaus (wounded)", 1528.5, 690, "W", 600, "GM;WP", note=""),
 U("bigblack", "~09:00", "US", "Lawler's charge (21st + 23rd Iowa, 11th Wis., 22nd Iowa)", "Michael K. Lawler", 1526, 679.5, "SW", 400, "GM;WP", move=[(1521, 682), (1510, 683.5)], note="about three minutes (Bearss via WP); CS flee to the bridge, bridge + Dot burned"),
 # Vicksburg assaults
 U("siege", "19 May 2 p.m.", "US", "Sherman's XV Corps (Blair's division; 13th US Infantry plants colors)", "William T. Sherman", 1410, 666, "SW", 400, "NPS;SM", move=[t("Stockade Redan")], note="Graveyard Road; ~1,000 Union losses (NPS)"),
 U("siege", "22 May 10 a.m.", "US", "Sherman's XV Corps (Blair, Tuttle; Steele on the far right)", "William T. Sherman", 1410, 666, "SW", 500, "NPS;SM", move=[t("Stockade Redan")], note="'forlorn hope' bridging party down Graveyard Road"),
 U("siege", "22 May 10 a.m.", "US", "McPherson's XVII Corps (Logan; Quinby; McArthur's Ransom)", "James B. McPherson", 1412, 674, "W", 500, "NPS;GM", move=[t("3rd Louisiana Redan"), t("Great Redoubt")], note="Jackson Road"),
 U("siege", "22 May 10 a.m.", "US", "McClernand's XIII Corps (Carr: Lawler + Benton; A. J. Smith: Burbridge; Osterhaus)", "John A. McClernand", 1408, 688, "W", 500, "NPS;ABT", move=[t("Railroad Redoubt"), t("2nd Texas Lunette")], note="Baldwin's Ferry Rd + railroad; brief lodgment in Railroad Redoubt"),
 U("siege", "19-22 May", "CS", "M. L. Smith's division (N: Shoup's 27th La. at Stockade Redan, Baldwin, Vaughn) + Bowen's Cockrell in support", "Martin L. Smith", t("Stockade Redan")[0] - 2, t("Stockade Redan")[1], "NE", 600, "ABT", note=""),
 U("siege", "19-22 May", "CS", "Forney's division (Hébert's brigade at 3rd La. Redan; Moore's brigade incl. 2nd Texas)", "John H. Forney", t("Great Redoubt")[0] - 2, t("Great Redoubt")[1], "E", 600, "OR;ABT", note=""),
 U("siege", "19-22 May", "CS", "Stevenson's division (S. D. Lee's Alabamians at Railroad Redoubt; Waul's Texas Legion counterattack)", "Carter L. Stevenson", t("Railroad Redoubt")[0] - 2, t("Railroad Redoubt")[1] + 1, "E", 700, "ABT;WP", note=""),
 U("siege", "25 Jun 3-3:30 p.m.", "US", "Mine under the 3rd La. Redan (Logan's division, Leggett's brigade; two regiments rush the crater)", "John A. Logan", t("3rd Louisiana Redan")[0], t("3rd Louisiana Redan")[1], "W", 200, "GM;OR (Hickenlooper journal 2,200 lb)", note="crater fight ~26 h (NPS)"),
]

geo = dict(_doc="Vicksburg 1863 film geodata. See vicksburg/research/GEO.md. x,y = map units of the vicksburg_hd_lift frame (web mercator z10, origin [63513,105473], 129.36 m/unit, x east, y south). acc_m = estimated error. ground_m = DEM height at the point. EST = estimate from text, check on the DEM.",
           frame=dict(name="vicksburg_hd_lift", zoom=10, origin_world_px=[OX, OY], meters_per_unit=129.36, size=[2880, 1620]),
           places=PLACES, roads=ROADS, rivers=RIVERS, units=UNITS)
os.makedirs(f"{HERE}/data", exist_ok=True)
json.dump(geo, open(f"{HERE}/data/geo.json", "w"), indent=1, ensure_ascii=False)

# markdown tables for GEO.md
md = ["| Place | lat | lon | x | y | ±m | DEM m | source | note |", "|---|---|---|---|---|---|---|---|---|"]
for p in PLACES: md.append(f"| {p['name']} | {p['lat']} | {p['lon']} | {p['x']} | {p['y']} | {p['acc_m']} | {p['ground_m']} | {p['src']} | {p['note']} |")
md += ["", "## Roads, railroad, rivers (map-unit waypoints; lat/lon for each point in geo.json)", "", "| Line | kind | ±m | map-unit waypoints | source | note |", "|---|---|---|---|---|---|"]
for l in ROADS + RIVERS: md.append(f"| {l['name']} | {l['kind']} | {l['acc_m']} | {' '.join(f'({a:.0f},{b:.0f})' for a, b in l['pts'])} | {l['src']} | {l['note']} |")
md += ["", "## Unit positions by battle and phase (US = Union, CS = Confederate)", "", "| Battle | phase | side | unit | commander | x | y | lat,lon | faces | moves to (map) | ±m | source | note |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
for u in UNITS: md.append(f"| {u['battle']} | {u['phase']} | {u['side']} | {u['unit']} | {u['commander']} | {u['x']} | {u['y']} | {u['lat']},{u['lon']} | {u['facing']} | {' '.join(f'({a:.0f},{b:.0f})' for a, b in u.get('move_to', []))} | {u['acc_m']} | {u['src']} | {u['note']} |")
MARK = "<!-- TABLES (generated by tools/make_geo.py; do not edit by hand) -->"
gp = f"{HERE}/research/GEO.md"; head = open(gp).read().split(MARK)[0] if os.path.exists(gp) else "# GEO\n\n"
open(gp, "w").write(head + MARK + "\n\n## Places\n" + "\n".join(md) + "\n")
print(len(PLACES), "places,", len(ROADS), "roads,", len(RIVERS), "rivers,", len(UNITS), "unit positions")
