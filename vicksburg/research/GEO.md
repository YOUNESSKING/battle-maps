# GEO: Vicksburg 1863 campaign geodata for the 3D map builders

Machine-readable twin: `vicksburg/data/geo.json` (places, roads, rivers, unit positions; every entry has lat/lon, map x/y, an error radius `acc_m` and a source). Regenerate with `python3 vicksburg/tools/make_geo.py` (edit the lists there; it also refreshes the tables at the end of this file).

## Frame and conversion
Map units = the `vicksburg_hd_lift` frame (`grant/assets/vicksburg_hd_lift.json`): web mercator zoom 10, `map = world_px - [63513, 105473]`, 129.36 m per unit, x east, y south.
`world_px_x = (lon+180)/360*256*2^10`, `world_px_y = (1 - ln(tan(lat)+sec(lat))/pi)/2*256*2^10`.
Check: Old Court House (32.35219, -90.87872) -> (1383.1, 678.9). The brief's "~(1388,681)" is the city centre, fine.
DEM check: every place's `ground_m` in geo.json is the height of `grant/assets/src/vicksburg_hd_elev.npy` at that point.

## Read this first: three corrections to coordinates already in the repo
1. **The railroad corridor in the existing v8 world sits ~3 km too far south.** True positions (GNIS/Wikidata, and they fall exactly on the DEM river): Big Black railroad bridge **(1509.8, 683.5)**, not (1518, 705); Bovina **(1488.0, 678.9)** (WP town point (1480.6, 681.4)), not (1495.5, 701.2); Edwards **(1583.1, 697.4)**, not (1599.4, 716.4); Bolton **(1688.0, 681.4)**, not (1700, 712). Raymond (1714.7, 758.1), Jackson (1892.2, 724.1) and Vicksburg agree with the brief within ~5 units. The Southern Railroad ran almost due east at lat 32.33-32.35 (y 679-698) from Vicksburg to Bolton/Clinton, then SE to Jackson.
2. **The 1863 Mississippi is not today's river at Vicksburg.** In 1863 the river came SE from Milliken's Bend to Young's Point, turned NE up to a point just above the city, made a hairpin and ran SW along the foot of the bluff past the city to Warrenton (Grant ch. XXXII). The land inside the hairpin (Louisiana) was De Soto Point. In 1876 the river cut through the neck of the point (the E-W channel at y ~690-700 between x 1300 and 1368 on the DEM is that cut-off: it did NOT exist in 1863; it was dry land, the neck where Grant's canal ran). The city-front arm is today's Yazoo Diversion Canal. The geo.json `Mississippi, 1863 channel` polyline is an estimate (±800 m): trace the old channel on the DEM (low ground) before baking.
3. **At Grand Gulf / Hard Times / Bruinsburg the river has also moved** (up to 2-3 km). In 1863 it ran at the very foot of the Grand Gulf bluff (Grant: "the river runs at the very foot of it"), round a long tongue of Louisiana land (Coffee Point) opposite Grand Gulf, and Bayou Pierre entered it "just above Bruinsburg". Disharoon's and Hard Times were on the 1863 west bank.

## Sources (codes used in the tables)
GNIS = USGS place points via Wikidata (P625); WD = Wikidata; OSM = OpenStreetMap via Nominatim; WP = Wikipedia coordinates/text; NPS = Vicksburg NMP pages; ABT = American Battlefield Trust; GM = Grant's Memoirs; SM = Sherman's Memoirs; OR = Official Records vol. 24; DEM = the repo DEM and its stream network `grant/assets/src/vicksburg_dem_rivers.json` (order 3 = main rivers); EST = my estimate from the texts (always with an error radius). Bearss's troop-movement maps and the NPS/ABT battle-map images could not be reached as data; unit positions are placed from the battle texts (WP/ABT/GM/OR) on the DEM.

## How to use the accuracy column
- `acc_m` <= 300: place it exactly.
- 300-1000: fine for a close-up; nudge to the nearest ridge/road on the DEM.
- > 1000: wide shots only, or snap to the river/road named in the note. Villages of 1863 that no longer exist (New Carthage, Perkins', Mississippi Springs, Dillon's, Auburn, Bridgeport) are all > 1 km.
- Rivers: for any close region use the DEM stream trace (order >= 2) along the given waypoints; the waypoints were snapped to it where marked "DEM".

## Battle notes (what the positions in the unit table mean)
**Port Gibson (1 May).** From the Shaifer house (where the roads split) two ridge roads run E to Port Gibson ~1-2 mi apart, separated by the impassable Centers Creek ravine (WP). South: Rodney road via Magnolia Church; north: Bruinsburg road. Dawn: Green across the Rodney road at Magnolia Church, Tracy across the Bruinsburg road. Carr (then Hovey in the centre, A. J. Smith in reserve) push E on the Rodney road; Osterhaus NE on the Bruinsburg road, stalled. ~Noon Logan's John E. Smith crosses a ravine N to a third ridge and turns the Confederate right. Afternoon: Baldwin's new line 1.5 mi E of Green's, Cockrell's counterattack on the Union right; retreat 5:30 p.m. through Port Gibson and over the bridges, which were burned. Positions ±600-1000 m.
**Raymond (12 May).** Gregg's brigade on rising ground N of Fourteenmile Creek, SW of town, Granbury's 7th Texas at the Utica/Port Gibson road junction, the 3rd Tennessee NE of the creek bridge, a flank force out on the Gallatin road; Logan comes from the SW on the Utica road and deploys S of the creek; Crocker behind. Gregg retreats NE through Raymond toward Mississippi Springs/Jackson. ±700 m.
**Jackson (14 May).** McPherson from the NW on the Clinton road (Crocker leads, Colquitt's stand at the O. P. Wright farm ~3 mi out); Sherman from the SW on the Mississippi Springs road (Confederate battery at the Lynch Creek bridge); Tuttle swings right toward the Pearl and finds the works empty. Confederate works ran from the Pearl N of the city round W and S to the Pearl again (GM). ±1 km.
**Champion Hill (16 May).** Three Union roads from the east: Jackson road (north; Hovey, then Logan and Crocker), Middle road (Osterhaus, Carr), Raymond road (A. J. Smith, Blair). The Jackson road comes W past the Champion house, turns S and climbs the hill (crest = DEM summit 109 m at (1638.5, 694.2)), follows the ridge to the crossroads 600 m S (WP marker (1636.8, 698.3)), turns W and descends ~2 km to the Baker's Creek bridge (1618.1, 696.3). Confederates face E: Stevenson on the left holding the hill and bending back along the Jackson road, Bowen in the centre on the Middle road, Loring on the right at the Coker house on the Raymond road. Phases: Hovey up the hill (to ~1 p.m.); Logan swings W round the north of the hill toward the Jackson road escape route; Bowen's counterattack retakes crossroads and crest and pushes Hovey back toward the Champion house (~1-2:30 p.m.); Crocker's brigades + Hovey's massed batteries retake the hill (~2:30-3 p.m.); Confederates escape SW by the Raymond road crossing of Baker's Creek (1606, 711) under Tilghman's rearguard; Loring cut off. ±500-1200 m.
**Big Black (17 May).** The river comes from the east, turns west and then south at the railroad bridge (1509.8, 683.5), hugging the west bluffs. The Confederate bridgehead lies on the flat bottom SE of the bend: a ~1-mile N-S line of cotton bales and earth behind a bayou, from the river on the north to Gin Lake on the south; Green on the north end, Vaughn's conscripts in the centre north of the railroad, Cockrell on the south at the Jackson road. Union: Carr (Lawler on the far right in a meander scar by the river), Osterhaus left of him, McPherson in column on the road. Lawler's charge from the NE corner, ~9 a.m.; Confederates run for the bridge and the steamboat Dot, both burned. Sherman crosses upstream at Bridgeport (est. (1574.5, 629.5), ±3.5 km). ±400 m (bridge ±100 m).
**Assaults (19 and 22 May).** Confederate line on the ridge crest from Fort Hill on the river (N) east to the Stockade Redan (Graveyard road), south past the 3rd Louisiana Redan (Jackson road), Great Redoubt, 2nd Texas Lunette (Baldwin's Ferry road), Railroad Redoubt (railroad), Square Fort, to South Fort on the river (S): ~7 miles. Union: Sherman on the right (N) attacking down the Graveyard road at the Stockade Redan (19 + 22 May), McPherson in the centre on the Jackson road (3rd La. Redan, Great Redoubt), McClernand on the left at the 2nd Texas Lunette and Railroad Redoubt (22 May; brief lodgment in the Railroad Redoubt). Union lines 50-600 yd out. Fort positions ±200-400 m except Fort Hill, Square Fort, South Fort, Shirley house, surrender site (OSM/GNIS, ±30-100 m).

<!-- TABLES (generated by tools/make_geo.py; do not edit by hand) -->

## Places
| Place | lat | lon | x | y | ±m | DEM m | source | note |
|---|---|---|---|---|---|---|---|---|
| Vicksburg (Warren County courthouse, 1858) | 32.35219 | -90.87872 | 1383.1 | 678.9 | 30 | 74.3 | OSM;WD | courthouse = Old Court House Museum; Logan's flag raised here 4 Jul |
| Pemberton's HQ (Willis-Cowan house, Crawford St) | 32.34824 | -90.87765 | 1383.9 | 682.3 | 30 | 72.9 | WD;NPS | surrender decided here night 3 Jul |
| Milliken's Bend (1863 landing, town since eroded) | 32.45583 | -91.10472 | 1218.6 | 589.6 | 2000 | 29.7 | GNIS | 1863 town lost to the river; approximate |
| Young's Point (Grant's HQ from 29 Jan 1863) | 32.32544 | -90.95444 | 1328 | 702 | 2500 | 26.3 | EST(GM: where the river turns NE toward the city; W end of the canal) | estimate, Louisiana bank at the neck of De Soto Point |
| Richmond, La. (burned June 1863) | 32.3858 | -91.1747 | 1167.6 | 650.0 | 500 | 25.4 | GNIS;WD |  |
| Duckport (Duckport canal head) | 32.3925 | -91.01389 | 1284.7 | 644.2 | 800 | 26.5 | GNIS | failed Duckport canal, Apr 1863 |
| New Carthage (flooded, Apr 1863) | 32.2 | -91.06 | 1251.1 | 810.0 | 4000 | 27.8 | EST(GM ch.XXXII-XXXIII; Roundaway/Vidal bayou mouth) | estimate |
| Perkins' plantation (Grant HQ 24 Apr) | 32.12 | -91.11 | 1214.7 | 878.8 | 4000 | 17.9 | EST(GM ch.XXXIII) | estimate; on the river below New Carthage |
| Hard Times plantation (corps assembly 27 Apr) | 32.0379 | -91.1242 | 1204.4 | 949.4 | 800 | 20.2 | GNIS;WD | 1863 landing was on the 1863 river bank: river has moved |
| Disharoon's (De Shroon's) plantation, embarkation 30 Apr | 31.9938 | -91.0398 | 1265.8 | 987.3 | 1500 | 36.7 | WD | 6 mi above Bruinsburg (GM); 1863 river bank |
| Coffee Point (tongue of land opposite Grand Gulf, levee march night 29 Apr) | 32.01 | -91.075 | 1240.2 | 973.3 | 3000 | 16.9 | EST(GM ch.XXXIII) | estimate |
| Grand Gulf (town site) | 32.0333 | -91.0525 | 1256.6 | 953.3 | 300 | 33.5 | GNIS | town largely gone by 1863 |
| Fort Cobun (upper battery, Point of Rock) | 32.04 | -91.0545 | 1255.1 | 947.6 | 500 | 20.6 | EST(Grand Gulf Military Park 32.0277,-91.0501 OSM) | north end of the Grand Gulf works; check on DEM bluff |
| Fort Wade (lower battery) | 32.0215 | -91.048 | 1259.9 | 963.5 | 600 | 55.8 | EST | ~1.3-2 km south of Fort Cobun; check on DEM bluff |
| Grand Gulf Military Park (today) | 32.02766 | -91.05011 | 1258.3 | 958.2 | 50 | 53.6 | OSM |  |
| Bruinsburg landing (30 Apr) | 31.9425 | -91.1572 | 1180.4 | 1031.3 | 800 | 23.6 | GNIS;WD | 1863 landing on the river; Bayou Pierre mouth just above |
| Windsor (plantation house, ruins) | 31.94081 | -91.13722 | 1194.9 | 1032.7 | 50 | 47.4 | WD;OSM | Union troops passed it on 30 Apr (tradition); house burned 1890 |
| Bayou Pierre mouth (1863 approx) | 31.92 | -91.19 | 1156.5 | 1050.6 | 1500 | 16.9 | GNIS(stream point) | Grant: enters the Mississippi just above Bruinsburg |
| Port Gibson | 31.95611 | -90.98306 | 1307.2 | 1019.6 | 200 | 38.0 | GNIS;WD | 'too beautiful to burn' is a later legend: do not quote |
| Shaifer house (opening shots ~midnight 30 Apr/1 May) | 31.9636 | -91.0444 | 1262.5 | 1013.2 | 900 | 73.8 | EST(WP/ABT text: fork of Rodney & Bruinsburg roads) | where the roads to Port Gibson split; check road fork |
| Magnolia Church (Green's line, Rodney road) | 31.95682 | -91.00344 | 1292.3 | 1019.0 | 900 | 72.1 | OSM (modern church on Rodney Rd; 1863 church site may differ) |  |
| Port Gibson battlefield marker | 31.95778 | -91.01889 | 1281.1 | 1018.2 | 100 | 41.2 | WD | GNIS 'Port Gibson Battle Site' |
| Foster farm (Confederate guns, Rodney road) | 31.96 | -91.03 | 1273.0 | 1016.3 | 1200 | 57.5 | EST(WP text) |  |
| Bayou Pierre South Fork bridge at Port Gibson (burned 1 May; raft bridge 2 May) | 31.961 | -90.979 | 1310.1 | 1015.4 | 600 | 25.1 | EST(GM ch.XXXIV) | on the Grand Gulf/Vicksburg road just N of town |
| Bayou Pierre North Fork bridge, Grindstone Ford (repaired night 2 May) | 32.0035 | -90.895 | 1371.3 | 978.9 | 1000 | 34.8 | GNIS(Grindstone Ford cemetery 32.0027,-90.8951);GM |  |
| Willow Springs (road junction) | 32.03599 | -90.89622 | 1370.4 | 951.0 | 1000 | 86.6 | OSM(Willow Springs church) | GM: McPherson held the road back to Willow Springs |
| Hankinson's Ferry (Big Black, ferry boat seized 3 May) | 32.11515 | -90.87959 | 1382.5 | 883 | 1500 | 21.4 | OSM(Hankinson hamlet 32.10654,-90.87955) snapped to the Big Black on the DEM |  |
| Rocky Springs | 32.08889 | -90.815 | 1429.5 | 905.6 | 300 | 91.9 | GNIS;WD | 10 mi from Hankinson's Ferry (GM) |
| Big Sandy Creek crossing (McClernand camp 8-10 May) | 32.12 | -90.73 | 1491.4 | 878.8 | 4000 | 52.9 | EST(GM) | estimate |
| Utica | 32.1033 | -90.6222 | 1569.9 | 893.2 | 300 | 85.8 | GNIS;WD |  |
| Cayuga | 32.15944 | -90.69389 | 1517.7 | 844.9 | 500 | 82.0 | GNIS;WD |  |
| Auburn (New Auburn, Hinds Co.; Blair arrived 14 May) | 32.2158 | -90.5872 | 1595.4 | 796.4 | 1500 | 51.7 | WD(Auburn cemetery) | 1863 village gone; cemetery point |
| Dillon's plantation | 32.235 | -90.56 | 1615.2 | 779.9 | 3000 | 51.7 | EST(GM ch.XXXV: McClernand by Dillon's to Raymond) | estimate; on the Auburn-Raymond road |
| Raymond (Hinds County courthouse, 1859) | 32.26028 | -90.42333 | 1714.7 | 758.1 | 50 | 97.7 | WD | Confederate hospital in the courthouse |
| Raymond battlefield (Raymond Military Park) | 32.23917 | -90.44861 | 1696.3 | 776.3 | 100 | 72.9 | WD;WP | ~2 mi SW of town on MS-18 |
| Fourteenmile Creek bridge on the Utica road (Raymond) | 32.22965 | -90.45319 | 1693 | 784.5 | 700 | 72.5 | EST(WP text; creek snapped on DEM) | just S of the Military Park |
| Mississippi Springs (Sherman's camp 13 May) | 32.26972 | -90.35706 | 1763 | 750 | 2500 | 97.1 | EST(WP: Gregg fell back 5 mi toward Jackson to it; GM) | village gone; estimate |
| Clinton | 32.3417 | -90.3217 | 1788.7 | 688.0 | 300 | 108.8 | WD | McPherson tore up the railroad here 13 May |
| O. P. Wright farm (Colquitt's stand, 14 May) | 32.315 | -90.24 | 1848.2 | 711.0 | 1500 | 97.5 | EST(WP: 3 mi out on the Clinton road) |  |
| Lynch Creek bridge (Sherman's road, 14 May) | 32.27843 | -90.19707 | 1879.5 | 742.5 | 900 | 78.2 | OSM(Lynch Creek);WP; snapped on DEM |  |
| Jackson (Old Capitol) | 32.29976 | -90.17964 | 1892.2 | 724.1 | 30 | 95.9 | WD;OSM | Crocker's men raised the flag over the capitol (GM) |
| Pearl River at Jackson (Confederate line anchors N and S) | 32.3 | -90.17 | 1899.2 | 723.9 | 800 | 78.7 | DEM | works ran from the Pearl north of the city to the Pearl south (GM) |
| Canton road (Johnston's retreat, camp 6 mi N of Jackson night 14 May) | 32.385 | -90.14 | 1921.1 | 650.7 | 3000 | 89.9 | EST(GM) |  |
| Bolton (Bolton's Depot) | 32.34931 | -90.4601 | 1688.0 | 681.4 | 300 | 67.1 | WD | Hovey here night 15 May |
| Brownsville | 32.448 | -90.435 | 1706.2 | 596.3 | 1500 | 85.9 | WD(Brownsville cemetery) | Johnston between Brownsville and the Big Black 1 Jul |
| Edwards (Edwards Station / Edwards Depot) | 32.33083 | -90.60417 | 1583.1 | 697.4 | 300 | 71.5 | GNIS;WD | existing bake_clip value (1599.4,716.4) is ~2.5 km SE of this |
| Mrs. Ellison's (Pemberton's camp night 15 May) | 32.3 | -90.585 | 1597.0 | 723.9 | 2500 | 48.7 | EST(Pemberton letter in Johnston's Narrative) | fork of the Raymond road |
| Champion Hill crest (the hill) | 32.33449 | -90.52803 | 1638.5 | 694.2 | 300 | 106.3 | DEM summit 109 m, 600 m N of the crossroads marker (WP: crossroads 1/3 mi S of crest) | higher ground (118 m) continues SE along the ridge |
| Crossroads (Jackson Road / Middle Road) | 32.3297 | -90.5303 | 1636.8 | 698.3 | 400 | 91.2 | WD/WP battle point (marker at Billy Fields Rd x DJ Johnson Rd) |  |
| Champion house (Hovey's start; site) | 32.344 | -90.518 | 1645.8 | 686.0 | 800 | 65.1 | EST(GM: road turns S at the hill's north end; ABT) | house burned after the battle |
| Jackson Road bridge over Baker's Creek | 32.332 | -90.556 | 1618.1 | 696.3 | 800 | 54.4 | EST(GM: ~1 mi W of crossroads) | snap to Baker's Creek on DEM |
| Raymond Road ford/bridge over Baker's Creek (Pemberton's escape) | 32.31499 | -90.57266 | 1606 | 711 | 1000 | 47.8 | EST (snapped to Baker's Creek on the DEM) |  |
| Coker house (Loring's position, Raymond Road) | 32.315 | -90.548 | 1624.0 | 711.0 | 800 | 79.0 | EST(MDAH/WP: S part of field, Raymond Rd) |  |
| Roberts house (Middle Road) | 32.322 | -90.513 | 1649.4 | 705.0 | 1500 | 94.4 | EST | Bowen/Osterhaus sector; estimate |
| Jackson Creek (Pemberton's initial line overlooked it) | 32.322 | -90.518 | 1645.8 | 705.0 | 1500 | 102.4 | WP/ABT text |  |
| Big Black railroad bridge (burned 17 May) | 32.34694 | -90.70472 | 1509.8 | 683.5 | 100 | 37.9 | WD;GNIS;WP | existing brief value (1518,705) is ~2.9 km S of this: the real bridge sits at the river's westward turn, y~683 |
| Steamboat 'Dot' bridge (just above rail bridge) | 32.348 | -90.7058 | 1509.1 | 682.6 | 400 | 42.7 | WP | ferry site; Dot turned crosswise as a bridge |
| Big Black battlefield (Confederate bridgehead) | 32.34516 | -90.69214 | 1519 | 685 | 600 | 36.4 | EST(WP/GM text; DEM bend) vs WD 32.36,-90.726 | bridgehead = the bottom SE of the bend, E of the bridge |
| Bovina (Bovina station) | 32.3522 | -90.7347 | 1488.0 | 678.9 | 1000 | 73.3 | WD (WP town 32.3489,-90.7458) | existing brief value (1495.5,701.2) is ~3 km SE of this |
| Bridgeport (Sherman's crossing, 17 May) | 32.40953 | -90.61592 | 1574.5 | 629.5 | 3500 | 34.1 | EST(GM: ~11 mi above the rail bridge; snapped to the Big Black on the DEM) | estimate |
| Mount Alban (Mt. Alban) | 32.3572 | -90.80677 | 1435.5 | 674.6 | 1500 | 111.0 | OSM(Mount Alban Road) | McClernand turned off here 18 May |
| Haynes' Bluff (Drumgould's Bluff) | 32.51625 | -90.78538 | 1451.1 | 537.4 | 800 | 49.3 | GNIS;WD | abandoned 18 May, cavalry took it (SM) |
| Snyder's Bluff (Snyder's Mill) | 32.4975 | -90.79806 | 1441.9 | 553.6 | 800 | 61.9 | GNIS;WD | Sherman's feint 29 Apr-1 May |
| Chickasaw Bayou battlefield (29 Dec 1862) | 32.40556 | -90.84778 | 1405.7 | 632.9 | 500 | 37.3 | WP;WD |  |
| Walnut Hills (bluff N of Vicksburg; Sherman looked down 18 May) | 32.42514 | -90.81677 | 1428.2 | 616.0 | 1000 | 49.3 | GNIS |  |
| Warrenton | 32.2475 | -90.92833 | 1347.0 | 769.1 | 500 | 32.1 | GNIS;WD | 6 mi below Vicksburg (GM) |
| Fort Hill (N anchor on the river) | 32.37015 | -90.86927 | 1390.0 | 663.5 | 100 | 94.4 | GNIS;OSM |  |
| Stockade Redan (Graveyard Road) | 32.3652 | -90.847 | 1406.2 | 667.7 | 300 | 90.6 | EST(between Conf. Ave node 32.36472,-90.84626 and Graveyard Rd) | Sherman 19 + 22 May |
| 3rd Louisiana Redan (Jackson Road; mined 25 Jun + 1 Jul) | 32.3592 | -90.8432 | 1409.0 | 672.9 | 200 | 109.1 | EST(Jackson Rd node 32.35938,-90.84200; W of Shirley house) | Union reports call it 'Fort Hill': do not confuse with the river Fort Hill |
| Great Redoubt | 32.3568 | -90.8468 | 1406.4 | 675.0 | 300 | 96.9 | EST(Louisiana Memorial 32.35711,-90.84697) |  |
| 2nd Texas Lunette (Baldwin's Ferry Road) | 32.3505 | -90.8515 | 1403.0 | 680.4 | 400 | 83.8 | EST | A. J. Smith (Burbridge) 22 May |
| Railroad Redoubt (Southern RR of Mississippi) | 32.3435 | -90.8555 | 1400.0 | 686.4 | 400 | 78.4 | EST(Texas Memorial 32.34291,-90.85631) | only work entered on 22 May (Lawler, 22nd Iowa) |
| Square Fort (Fort Garrott) | 32.33624 | -90.86287 | 1394.7 | 692.7 | 100 | 84.7 | OSM |  |
| South Fort (S anchor on the river) | 32.31609 | -90.89852 | 1368.7 | 710.1 | 100 | 69.5 | OSM |  |
| Shirley house (Union side, Jackson Road) | 32.35968 | -90.84055 | 1410.9 | 672.5 | 30 | 114.1 | OSM | the 'White House'; only wartime house left in the park |
| Surrender interview site (stunted oak, 3 Jul 3 p.m.) | 32.35749 | -90.84467 | 1407.9 | 674.4 | 50 | 98.1 | OSM;NPS | a few hundred feet from the Confederate line |
| Grant's HQ during the siege (approx) | 32.37 | -90.832 | 1417.2 | 663.6 | 1200 | 92.8 | EST(Grant equestrian statue at 32.37717,-90.83437 OSM) | Grant's camp on the Union right-centre; do not label exactly |
| Grant's canal (NPS unit) | 32.32056 | -90.93278 | 1343.8 | 706.2 | 300 | 27.8 | GNIS;WD | remnant on the old De Soto peninsula |
| Vicksburg City Cemetery (Graveyard Road name) | 32.36659 | -90.85798 | 1398.2 | 666.5 | 100 | 64.4 | OSM |  |

## Roads, railroad, rivers (map-unit waypoints; lat/lon for each point in geo.json)

| Line | kind | ±m | map-unit waypoints | source | note |
|---|---|---|---|---|---|
| West-bank route: Milliken's Bend - Richmond - Roundaway Bayou - New Carthage | road | 2500 | (1219,590) (1168,650) (1205,690) (1215,730) (1225,770) (1251,810) | GM ch.XXXII; WP; DEM | corduroy + bridges; follows Roundaway Bayou levee |
| West-bank route: New Carthage - Perkins' - west of Lake St. Joseph - Hard Times | road | 3000 | (1251,810) (1215,879) (1190,895) (1162,920) (1150,945) (1172,962) (1204,949) | GM ch.XXXIII (road west of Lake St. Joseph; 3 bayous bridged) | Lake St. Joseph at 32.048,-91.218 (OSM) |
| Levee across Coffee Point: Hard Times - Disharoon's (night 29 Apr) | road | 3000 | (1204,949) (1240,973) (1266,987) | GM ch.XXXIII |  |
| Bruinsburg - bluffs - Shaifer house (Bruinsburg road) | road | 1200 | (1180,1031) (1188,1030) (1195,1033) (1215,1025) (1240,1020) (1255,1016) (1262,1013) | GM ch.XXXIII; WP Port Gibson | ~2 mi of bottom then up onto the ridge (GM) |
| Rodney Road: Shaifer house - Magnolia Church - Port Gibson | road | 900 | (1262,1013) (1281,1019) (1292,1019) (1307,1020) | WP; OSM Rodney Road |  |
| Bruinsburg (north) road: Shaifer house - ridge - Port Gibson | road | 1200 | (1262,1013) (1276,1012) (1288,1009) (1298,1013) (1307,1020) | WP; GM ('two ridges, a mile or two apart, unite just outside the town') |  |
| Port Gibson - Grindstone Ford - Willow Springs - Rocky Springs - Utica - Raymond | road | 1500 | (1307,1020) (1310,1015) (1330,995) (1371,979) (1370,951) (1430,906) (1490,895) (1570,893) (1620,840) (1675,800) (1696,776) (1715,758) | GM ch.XXXIV; GNIS towns |  |
| Willow Springs - Hankinson's Ferry (road to Vicksburg) | road | 1500 | (1370,951) (1370,920) (1382,883) | GM |  |
| Grand Gulf - Willow Springs road (Logan to Grand Gulf 3 May) | road | 2000 | (1257,953) (1290,945) (1325,950) (1370,951) | GM |  |
| Rocky Springs - Cayuga - Auburn - Dillon's - Raymond | road | 2500 | (1430,906) (1475,885) (1518,845) (1595,796) (1615,780) (1655,780) (1715,758) | GM ch.XXXIV-XXXV |  |
| Auburn - Edwards (Raymond-Edwards road, Pemberton's 15 May target) | road | 2500 | (1595,796) (1597,760) (1597,724) (1590,710) (1583,697) | GM; Johnston's Narrative |  |
| Raymond - Clinton road | road | 1500 | (1715,758) (1735,740) (1760,712) (1789,688) | GM ch.XXXV |  |
| Raymond - Mississippi Springs - Jackson (Sherman, 14 May) | road | 2000 | (1715,758) (1740,754) (1763,750) (1820,744) (1880,742) (1888,732) (1892,724) | GM ch.XXXV; WP Jackson |  |
| Jackson road (upper): Jackson - Clinton - Bolton - Champion house | road | 1200 | (1892,724) (1848,711) (1835,690) (1789,688) (1745,683) (1688,681) (1665,685) (1646,686) | GM; railroad corridor |  |
| Jackson road at Champion Hill: Champion house - crest - crossroads - Baker's Creek - Edwards | road | 500 | (1646,686) (1638,694) (1637,698) (1618,696) (1600,699) (1583,697) | GM ch.XXXV (turns S, follows the ridge ~1 mi, turns W, ~1 mi to the creek) |  |
| Middle Road: Raymond-Bolton road - Roberts house - crossroads | road | 1500 | (1680,730) (1665,714) (1649,705) (1637,698) | GM ch.XXXV ('middle road comes into the northern road where the latter turns west') |  |
| Raymond Road: Raymond - Jackson Creek - Coker house - Baker's Creek - Edwards | road | 1500 | (1715,758) (1690,745) (1660,728) (1624,711) (1606,711) (1593,712) (1583,697) | GM; ABT |  |
| Jackson road west: Edwards - Big Black bridge - Bovina - Mount Alban - Vicksburg (Jackson Road) | road | 1200 | (1583,697) (1560,690) (1530,684) (1510,684) (1488,679) (1460,678) (1436,675) (1420,674) (1409,673) (1383,679) | GM ch.XXXVI; SM |  |
| Southern Railroad of Mississippi (Vicksburg & Jackson RR) | railroad | 800 | (1383,679) (1395,686) (1400,686) (1430,684) (1436,675) (1470,682) (1488,679) (1510,684) (1540,688) (1583,697) (1620,690) (1660,683) (1688,681) (1740,684) (1789,688) (1850,700) (1892,724) | GM; GNIS towns on the line |  |
| Upper Jackson road / Bridgeport road: Bolton - Bridgeport - Graveyard Road (Sherman 17-18 May) | road | 3000 | (1688,681) (1640,650) (1580,640) (1574,630) (1480,650) (1440,660) (1415,664) (1406,668) | SM; GM |  |
| Graveyard Road (into the city) | road | 300 | (1412,664) (1406,668) (1398,666) (1383,679) | SM; OSM |  |
| Baldwin's Ferry Road (into the city) | road | 400 | (1430,690) (1410,686) (1403,680) (1396,685) (1383,679) | NPS; OSM |  |
| Hall's Ferry Road (into the city) | road | 400 | (1400,720) (1388,700) (1384,690) (1383,679) | OSM |  |
| Vicksburg - Warrenton road | road | 800 | (1383,679) (1378,700) (1369,710) (1366,735) (1347,769) | GM |  |
| Valley road at the foot of the bluffs: Vicksburg - Chickasaw Bayou - Haynes' Bluff | road | 1500 | (1390,664) (1400,640) (1406,633) (1420,600) (1442,554) (1451,537) | SM (Steele reached it 18 May) |  |
| Mississippi, 1863 channel at Vicksburg (De Soto Point hairpin) | river | 800 | (1222,580) (1250,598) (1278,612) (1295,640) (1306,670) (1318,692) (1330,698) (1342,688) (1352,672) (1362,658) (1372,652) (1381,655) (1384,664) (1380,672) (1377,681) (1373,695) (1366,709) (1358,735) (1352,760) (1353,788) | GM ch.XXXII description + DEM old channels; river cut off the neck in 1876 | upstream first; from Young's Point NE to just above the city, then SW along the bluff past the city to Warrenton (GM). Modern Yazoo Diversion Canal follows the city-front arm. |
| Grant's canal (1862-63) across the neck of De Soto Point | canal | 1000 | (1334,702) (1346,706) (1355,711) | GM ('a little over a mile', Young's Point to the river below'); NPS unit point | orientation estimated; NPS remnant at (1344,706) |
| Yazoo River lower course + mouth (1863 approx) | river | 2000 | (1430,545) (1408,565) (1395,590) (1380,610) (1360,625) (1345,640) | GM (mouth 9 mi above Vicksburg; Haynes' Bluff 11 mi) | trace on DEM; mouth into the 1863 upper arm |
| Chickasaw Bayou | bayou | 1500 | (1399,601) (1402,616) (1406,633) | GNIS points 32.4428,-90.8572 / 32.4253,-90.8533; SM |  |
| Big Black River at the railroad bridge (bend) | river | 200 | (1574,630) (1565,660) (1557,687) (1535,681) (1518,676) (1510,678) (1510,683) (1508,690) (1510,705) (1512,717) (1508,736) | DEM streams (order 3) | river comes from the E, turns W then S at the bridge (GM: 'the river makes a turn to the west') |
| Big Black River lower course to the Mississippi at Grand Gulf | river | 800 | (1508,736) (1472,800) (1434,837) (1401,873) (1382,883) (1352,906) (1297,904) (1270,933) (1252,945) | DEM streams; GNIS |  |
| Bayou Pierre (main stem: Grindstone Ford - Port Gibson - Bruinsburg) | river | 800 | (1400,965) (1371,979) (1340,990) (1310,1000) (1290,1000) (1255,1005) (1240,1015) (1215,1008) (1190,1018) (1156,1051) | DEM streams; GNIS mouth |  |
| Little Bayou Pierre (South Fork) at Port Gibson | river | 1200 | (1330,1035) (1307,1020) (1295,1010) (1290,1003) | GNIS 31.98498,-91.00182; DEM | check on DEM |
| Fourteenmile Creek (Raymond - Big Black) | creek | 1500 | (1720,790) (1705,786) (1693,784) (1684,784) (1652,785) (1605,774) (1582,759) (1542,759) (1516,790) | GNIS/OSM; DEM | upstream first |
| Baker's Creek (Champion Creek) | creek | 600 | (1665,675) (1640,679) (1622,682) (1617,695) (1612,705) (1600,716) (1590,725) (1585,745) (1580,760) | DEM streams order 3; GNIS mouth 32.2614,-90.6089 | upstream first; W foot of Champion Hill |
| Pearl River at Jackson | river | 500 | (1913,640) (1909,667) (1904,718) (1892,741) (1884,788) | gm_test rivers.json (DEM) | use gm_test/data/rivers.json 'pearl' for the full trace |
| Roundaway Bayou / Bayou Vidal (west-bank route) | bayou | 2500 | (1168,650) (1215,730) (1225,756) (1251,810) | OSM points (Roundaway 32.26301,-91.09529; Vidal 32.24054,-91.19985) |  |
| Walnut Bayou (Duckport canal target) | bayou | 1500 | (1165,632) (1173,649) (1169,657) | OSM |  |

## Unit positions by battle and phase (US = Union, CS = Confederate)

| Battle | phase | side | unit | commander | x | y | lat,lon | faces | moves to (map) | ±m | source | note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| portgibson | dawn | CS | Green's brigade | Martin E. Green | 1289.3 | 1018.5 | 31.95741,-91.00758 | W |  | 600 | WP | astride the Rodney road at Magnolia Church |
| portgibson | dawn | CS | Tracy's brigade | Edward D. Tracy (killed) | 1282.5 | 1009.7 | 31.96766,-91.01692 | SW |  | 800 | WP | athwart the Bruinsburg road; Garrott after Tracy fell |
| portgibson | dawn | US | Carr's division (Benton, Stone) | Eugene A. Carr | 1266.5 | 1014.2 | 31.96242,-91.03889 | E | (1286,1019) | 600 | WP | attacks E on the Rodney road 6:30 a.m. |
| portgibson | morning | US | Hovey's division (McGinnis, Slack) | Alvin P. Hovey | 1271.5 | 1014.2 | 31.96242,-91.03203 | E | (1290,1019) | 700 | WP | into the centre; 10 a.m. general advance breaks Green |
| portgibson | morning | US | A. J. Smith's division (Burbridge, Landram) | Andrew J. Smith | 1264.5 | 1015.2 | 31.96125,-91.04164 | E |  | 800 | WP | reserve, then second line vs Baldwin 3 p.m. |
| portgibson | morning | US | Osterhaus's division (Garrard, Sheldon) | Peter J. Osterhaus | 1271.5 | 1011.2 | 31.96591,-91.03203 | NE | (1278,1010) | 800 | WP;GM | Bruinsburg road; repulsed until Logan came up |
| portgibson | noon | US | John E. Smith's brigade (Logan's division) | John E. Smith | 1272.0 | 1007.2 | 31.97057,-91.03134 | E | (1284,1007) | 1000 | GM;WP | sent N over a ravine to a third ridge, turns the CS right |
| portgibson | afternoon | CS | Baldwin's brigade | William E. Baldwin | 1300.3 | 1019.0 | 31.95682,-90.99248 | W |  | 800 | WP | behind a creek ~1.5 mi E of Green's second line |
| portgibson | afternoon | CS | Cockrell's Missouri brigade | Francis M. Cockrell | 1298.3 | 1021.0 | 31.95449,-90.99522 | SW |  | 1000 | WP | counterattack on the Union right, 40-min firefight, retreat 5:30 p.m. |
| raymond | noon | CS | Gregg's brigade (7th Texas, 3rd Tenn., 1st Tenn. Bn, 50th Tenn., 10/30th Tenn.) | John Gregg | 1700.5 | 772.5 | 32.24359,-90.44289 | SW |  | 700 | WP | on rising ground N of Fourteenmile Creek, Granbury at the Utica/Port Gibson road junction |
| raymond | noon | US | Logan's division (Dennis, J. E. Smith, J. D. Stevenson) | John A. Logan | 1692 | 780 | 32.23487,-90.45456 | NE | (1698,775) | 700 | GM;WP | deployed S of the creek, ~2 p.m. per Grant (WP: fight from ~10 a.m.) |
| raymond | afternoon | US | Crocker's division | Marcellus Crocker | 1684 | 786 | 32.2279,-90.46555 | NE |  | 1000 | GM | came up late; Gregg's bluff covered his withdrawal |
| raymond | evening | CS | Gregg retreating | John Gregg | 1719 | 761 | 32.25694,-90.41748 | NE | (1745,755) (1763,750) | 1000 | WP | through Raymond toward Jackson |
| jackson | morning | US | McPherson: Crocker's division (lead), Logan behind | James B. McPherson | 1855 | 698 | 32.33008,-90.23071 | E | (1848,711) (1880,708) | 1000 | GM | on the Clinton road; charge at ~11 a.m. drives Colquitt in |
| jackson | morning | US | Sherman: Steele + Tuttle | William T. Sherman | 1858 | 738 | 32.28365,-90.22659 | NE | (1880,742) (1878,728) | 1000 | GM | Mississippi Springs road, battery at the Lynch Creek bridge |
| jackson | noon | US | Tuttle's division flanking right to the Pearl | James M. Tuttle | 1885 | 740 | 32.28133,-90.18951 | N | (1895,730) | 1200 | GM | finds the works empty, captures the gunners + 10 guns |
| jackson | morning | CS | Gregg's rearguard (Colquitt; Walker; Thompson) | John Gregg | 1851.2 | 711.0 | 32.31499,-90.23593 | W |  | 1200 | WP | delay while wagons left for Canton; gone ~2-3 p.m. |
| championhill | 07:00-10:00 | CS | Stevenson's division (S. D. Lee on the hill; Cumming at the crossroads; Barton to the NW; Reynolds with the wagons) | Carter L. Stevenson | 1637.5 | 694.2 | 32.33449,-90.5294 | N/E |  | 600 | WP;ABT | line bent back along the hill to cover the Jackson road |
| championhill | 07:00-10:00 | CS | Bowen's division (Cockrell, Green) | John S. Bowen | 1638.8 | 704.3 | 32.32277,-90.52762 | E |  | 800 | ABT;WP | centre, covering the Middle Road |
| championhill | 07:00-10:00 | CS | Loring's division (Tilghman, Buford, Featherston) | William W. Loring | 1628.0 | 711.0 | 32.31499,-90.54245 | E |  | 800 | ABT;WP | right, on the Raymond Road near the Coker house |
| championhill | 07:00-10:00 | US | Hovey's division (McGinnis, Slack) | Alvin P. Hovey | 1645.8 | 686.0 | 32.344,-90.51801 | S/SW | (1640,692) | 500 | GM;OR Hovey | from the Champion house up the Jackson road; crest ~11:30-13:00 |
| championhill | 10:00-13:00 | US | Logan's division (J. E. Smith, Leggett, J. D. Stevenson) | John A. Logan | 1639.8 | 683.0 | 32.34748,-90.52625 | S/W | (1630,692) (1629,697) | 800 | GM | right of Hovey, swings W around the hill toward the Jackson road escape route |
| championhill | 13:00-14:30 | CS | Bowen's counterattack | John S. Bowen | 1638.8 | 704.3 | 32.32277,-90.52762 | N | (1637,698) (1638,694) (1645,684) | 600 | ABT;OR Hovey | retakes crossroads + crest, pushes Hovey nearly back to the Champion house |
| championhill | 13:00-14:30 | US | Crocker's division (Boomer, Holmes; Sanborn) | Marcellus Crocker | 1643.8 | 687.0 | 32.34284,-90.52075 | S | (1640,693) | 800 | OR Hovey;GM | ~2,000 men sent up the hill to Hovey |
| championhill | 14:30 | US | Hovey's massed batteries (1st Missouri, 16th Ohio, Dillon's Wisconsin) | Alvin P. Hovey | 1642.8 | 684.0 | 32.34632,-90.52213 | SW |  | 600 | OR Hovey | enfilade fire at ~2:30 p.m. turns the fight; ground 'contested for the third time' |
| championhill | 07:30-16:00 | US | Osterhaus + Carr (McClernand) on the Middle Road | John A. McClernand | 1657.4 | 709.0 | 32.31731,-90.50208 | W |  | 1200 | GM | in hearing of the battle, did not press (GM) |
| championhill | 07:30-16:00 | US | A. J. Smith + Blair on the Raymond Road | Andrew J. Smith / Frank P. Blair | 1638.0 | 715.0 | 32.31035,-90.52872 | W |  | 1200 | GM | confront Loring |
| championhill | 16:00-17:20 | CS | Retreat by the Raymond Road ford; Tilghman's rearguard | Lloyd Tilghman (killed 5:20 p.m.) | 1622.0 | 711.0 | 32.31499,-90.55069 | E | (1606,711) (1585,720) | 800 | ABT;OR | Loring cut off, turns S/E toward Johnston |
| bigblack | dawn | CS | Vaughn's brigade + 4th Mississippi (centre, N of the railroad) | John C. Vaughn | 1520 | 684 | 32.34632,-90.69077 | E |  | 400 | WP | cotton-bale parapet behind the bayou |
| bigblack | dawn | CS | Cockrell's brigade (S, at the Jackson road) | Francis M. Cockrell | 1519.5 | 690 | 32.33936,-90.69145 | E |  | 400 | WP | to Gin Lake on the right (S) |
| bigblack | dawn | CS | Green's brigade (far left, N, near the river) | Martin E. Green | 1522 | 680.5 | 32.35038,-90.68802 | E/NE |  | 400 | WP | N end near the river; 1st Mo. Cav. (dism.) in the work E of the bayou |
| bigblack | dawn | US | Carr's division (Benton; Lawler on the far right) | Eugene A. Carr | 1528 | 683 | 32.34748,-90.67978 | W |  | 500 | GM;WP | Lawler moved into a meander scar by the river on the N flank |
| bigblack | dawn | US | Osterhaus's division (Garrard, Lindsey) left of Carr | Peter J. Osterhaus (wounded) | 1528.5 | 690 | 32.33936,-90.67909 | W |  | 600 | GM;WP |  |
| bigblack | ~09:00 | US | Lawler's charge (21st + 23rd Iowa, 11th Wis., 22nd Iowa) | Michael K. Lawler | 1526 | 679.5 | 32.35154,-90.68253 | SW | (1521,682) (1510,684) | 400 | GM;WP | about three minutes (Bearss via WP); CS flee to the bridge, bridge + Dot burned |
| siege | 19 May 2 p.m. | US | Sherman's XV Corps (Blair's division; 13th US Infantry plants colors) | William T. Sherman | 1410 | 666 | 32.3672,-90.84183 | SW | (1406,668) | 400 | NPS;SM | Graveyard Road; ~1,000 Union losses (NPS) |
| siege | 22 May 10 a.m. | US | Sherman's XV Corps (Blair, Tuttle; Steele on the far right) | William T. Sherman | 1410 | 666 | 32.3672,-90.84183 | SW | (1406,668) | 500 | NPS;SM | 'forlorn hope' bridging party down Graveyard Road |
| siege | 22 May 10 a.m. | US | McPherson's XVII Corps (Logan; Quinby; McArthur's Ransom) | James B. McPherson | 1412 | 674 | 32.35792,-90.83908 | W | (1409,673) (1406,675) | 500 | NPS;GM | Jackson Road |
| siege | 22 May 10 a.m. | US | McClernand's XIII Corps (Carr: Lawler + Benton; A. J. Smith: Burbridge; Osterhaus) | John A. McClernand | 1408 | 688 | 32.34168,-90.84457 | W | (1400,686) (1403,680) | 500 | NPS;ABT | Baldwin's Ferry Rd + railroad; brief lodgment in Railroad Redoubt |
| siege | 19-22 May | CS | M. L. Smith's division (N: Shoup's 27th La. at Stockade Redan, Baldwin, Vaughn) + Bowen's Cockrell in support | Martin L. Smith | 1404.2 | 667.7 | 32.36523,-90.84979 | NE |  | 600 | ABT |  |
| siege | 19-22 May | CS | Forney's division (Hébert's brigade at 3rd La. Redan; Moore's brigade incl. 2nd Texas) | John H. Forney | 1404.4 | 675.0 | 32.35676,-90.84952 | E |  | 600 | OR;ABT |  |
| siege | 19-22 May | CS | Stevenson's division (S. D. Lee's Alabamians at Railroad Redoubt; Waul's Texas Legion counterattack) | Carter L. Stevenson | 1398.0 | 687.4 | 32.34238,-90.85831 | E |  | 700 | ABT;WP |  |
| siege | 25 Jun 3-3:30 p.m. | US | Mine under the 3rd La. Redan (Logan's division, Leggett's brigade; two regiments rush the crater) | John A. Logan | 1409.0 | 672.9 | 32.3592,-90.8432 | W |  | 200 | GM;OR (Hickenlooper journal 2,200 lb) | crater fight ~26 h (NPS) |
