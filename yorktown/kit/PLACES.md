# Yorktown map kit: places (lat/lon -> map px)

Projection = tools/bake.py (web mercator; `x = (lon+180)/360*256*2^z - origin_x`, `y = (1-asinh(tan(lat))/pi)/2*256*2^z - origin_y`, origin from `assets/<map>.json`).
In a scene use `LYT(lat, lon)` or `PLACE("name")` (kit) instead of hard-coded px. Basemap image px = 2 x map px.

## Corrections against the relief / water (2026-11-11)
- **Redoubt 10**: dossier 37.2319,-76.4953 lies ~200 m out in the York River on our relief. Moved to **37.2319,-76.5000** (on the river bluff; matches the NPS site ~-76.500).
- **Redoubt 9**: moved by the same ~0.0047 deg west to **37.2292,-76.5025** (~400 yd SW of R10, as the sources say).
- **Fusiliers' Redoubt**: dossier 37.2464,-76.5261 lies in the river; moved ~270 m south onto the bluff edge, **37.2440,-76.5261**.
- **Yorktown** town centre 37.2382,-76.5098 (on the bluff above the waterfront); the York ferry landings are snapped to the two banks by make_m.py (narrows ~720 m = ~800 yd).
- The Bauman 1782 plan (`assets/archive/bauman_map.*`) was NOT yet delivered by the image agent: the siege works (parallels, redoubts, British line) are placed from the
  brief + relief only. Re-check them against Bauman when it arrives (the first parallel / British line are LIVE in the scenes: only scene coordinates change, no re-bake).
- Modern features removed from the water: piers/jetties (land opening), dredged cuts (water opening), spoil islands, ponds; reservoirs dried by hand boxes
  (Diascund + Little Creek on `peninsula`, Lee Hall on `yorktown` + `peninsula`). New York harbour + the East River drawn by hand on `east` (the z8 land mask has no harbour).

## Places

| place | lat, lon | east | chesapeake | peninsula | yorktown |
|---|---|---|---|---|---|
| yorktown | 37.2382, -76.5098 | 1075, 1288 | 1142, 684 | 1761, 853 | 1384, 720 |
| gloucester_point | 37.2468, -76.5025 | 1076, 1286 | 1148, 676 | 1782, 822 | 1469, 594 |
| the_hook | 37.2917, -76.4847 | 1079, 1276 | 1161, 635 | 1834, 657 | - |
| fusiliers_redoubt | 37.244, -76.5261 | 1072, 1287 | 1130, 678 | 1714, 832 | 1194, 635 |
| hornwork | 37.2325, -76.5092 | 1075, 1290 | 1143, 689 | 1763, 874 | 1391, 803 |
| british_line_east | 37.2352, -76.504 | 1076, 1289 | 1146, 687 | 1778, 864 | 1452, 764 |
| redoubt_9 | 37.2292, -76.5025 | 1076, 1290 | 1148, 692 | 1782, 886 | 1469, 852 |
| redoubt_10 | 37.2319, -76.5 | 1077, 1290 | 1149, 690 | 1790, 876 | 1498, 812 |
| first_parallel | 37.2244, -76.5006 | 1076, 1291 | 1149, 696 | 1788, 904 | 1491, 922 |
| first_parallel_w | 37.2262, -76.5185 | 1073, 1291 | 1136, 695 | 1736, 897 | 1283, 895 |
| first_parallel_e | 37.2262, -76.4952 | 1077, 1291 | 1153, 695 | 1804, 897 | 1554, 895 |
| moore_house | 37.2189, -76.4858 | 1079, 1293 | 1160, 701 | 1831, 924 | 1664, 1002 |
| surrender_field | 37.2111, -76.5131 | 1074, 1294 | 1140, 709 | 1751, 952 | 1346, 1116 |
| allied_hq | 37.2067, -76.535 | 1070, 1295 | 1124, 713 | 1688, 968 | 1091, 1181 |
| williamsburg | 37.2707, -76.7075 | 1039, 1281 | 998, 654 | 1185, 734 | - |
| halfway_house | 37.252, -76.64 | 1051, 1285 | 1047, 671 | 1382, 803 | - |
| trebells_landing | 37.2044, -76.6669 | 1046, 1296 **WATER** | 1028, 715 **WATER** | 1303, 977 **WATER** | - |
| jamestown | 37.2093, -76.7775 | 1026, 1295 | 947, 710 | 981, 959 | - |
| cape_henry | 36.9261, -76.0061 | 1167, 1359 | 1509, 969 | - | - |
| cape_charles | 37.1333, -75.9667 | 1174, 1312 | 1538, 780 | - | - |
| lynnhaven_bay | 36.9167, -76.0833 | 1152, 1362 **WATER** | 1453, 977 **WATER** | - | - |
| hampton | 37.03, -76.345 | 1105, 1336 | 1262, 874 | 2241, 1614 | - |
| dobbs_ferry | 41.01, -73.87 | 1555, 403 | - | - | - |
| kings_ferry | 41.25, -73.965 | 1538, 345 **WATER** | - | - | - |
| chatham | 40.74, -74.38 | 1463, 468 | - | - | - |
| trenton | 40.22, -74.76 | 1393, 592 | - | - | - |
| philadelphia | 39.952, -75.165 | 1320, 656 | - | - | - |
| chester | 39.85, -75.36 | 1284, 680 | - | - | - |
| head_of_elk | 39.608, -75.833 | 1198, 737 | - | - | - |
| baltimore | 39.29, -76.61 | 1057, 812 | - | - | - |
| annapolis | 38.978, -76.492 | 1078, 886 | - | - | - |
| mount_vernon | 38.71, -77.09 | 969, 948 | - | - | - |
| newport | 41.49, -71.31 | 2021, 287 | - | - | - |
| new_york | 40.712, -74.006 | 1531, 474 | - | - | - |
| staten_island | 40.58, -74.15 | 1504, 506 | - | - | - |

## Baked towns (permanent painted towns; label = carved permanent name)

- `east` (baked for camera scale 0.9): New York (name), Philadelphia (name), Williamsburg, Yorktown (name), Newport, Providence, Hartford, Princeton, Chatham, Dobbs Ferry, Trenton, Chester, Head of Elk, Baltimore, Annapolis, Alexandria, Fredericksburg, Richmond
- `chesapeake` (baked for camera scale 1.3): Williamsburg (name), Yorktown (name), Hampton, Norfolk, Richmond
- `peninsula` (baked for camera scale 1.3): Williamsburg (name), Yorktown (name), Gloucester, Jamestown
- `yorktown` (baked for camera scale 2.0): Yorktown (name), Gloucester (name)

Roads, bridges, ferries and the dead-end check per map: `kit/data/<map>_bake.json` (`roads`, `crossings`, `ends`).
