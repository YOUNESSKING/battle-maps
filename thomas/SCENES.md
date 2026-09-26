# Thomas: map scenes

Each scene = one contiguous run of `[MAP: ...]` paragraphs in script.md (no ARCHIVE paragraph inside a scene).
Build: `cd /home/user/battle-maps/thomas && python3 tools/build_scene.py SCENE BASEMAP FIRST_TAG LAST_TAG`
→ `scenes/SCENE/` (lint: `cd scenes/SCENE && hyperframes lint .`; snapshots: `hyperframes snapshot . --at 1,5,...`; render: `hyperframes render . -o renders/SCENE.mp4`, check the log for "Render complete").

| Scene | Basemap (assets/NAME.jpg, zoom) | Paragraphs | Notes |
|---|---|---|---|
| hook1 | chatt (z13) | hook-1 … hook-2 | Chickamauga, Sept 20 1863 11 AM: division leaves the line, Longstreet's column through the gap, Union right flees NW to Chattanooga, Thomas's remnant on Horseshoe Ridge; then bio card (thomas_full.png) over dimmed map |
| hook3 | theater (z9) | hook-3 | TN/KY/GA theater; Thomas stake under 35-star flag; 3 glowing markers: CHICKAMAUGA, CHATTANOOGA (Missionary Ridge), NASHVILLE |
| chick1 | theater (z9) | chick-1 … chick-2 | title card MOVE 1; Rosecrans's manoeuvre, Chattanooga falls; Longstreet by rail from Virginia; stats 60,000 vs 65,000 |
| chick2 | chick (z15) | chick-3 … chick-9 | main battlefield: Sept 19 fighting, Kelly Field breastworks, Wood's gap, breakthrough, Horseshoe Ridge stand, Steedman |
| chick3 | chatt (z13) | chick-10 … chick-11 | withdrawal via McFarland's Gap to Rossville/Chattanooga; casualty stats; method card |
| ridge1 | chatt (z13) | ridge-1 | title card MOVE 2; siege of Chattanooga, Confederates on Lookout + Missionary Ridge, supply cut |
| ridge2 | ridge (z14) | ridge-2 … ridge-6 | Orchard Knob, Lookout, Sherman stopped at Tunnel Hill; ridge profile inset; Thomas's 4 divisions take the rifle pits, then climb without orders |
| ridge3 | ridge (z14) | ridge-7 … ridge-9 | profile inset: crest trench on topographic crest, dead ground; breakthrough in 6 places; rout; stats; method card |
| nash1 | theater (z9) | nash-1 … nash-2 | title card MOVE 3; Sherman to the sea; Hood into Tennessee; Franklin; Hood before Nashville |
| nash2 | nash (z14) | nash-3 | Nashville: city, Union fort ring, Hood's line + 5 redoubts; stats 55,000 vs 30,000 |
| nash3 | nash (z14) | nash-4 … nash-11 | ice storm, relief order; Hood's belief; Dec 15 feint + great wheel; redoubts fall; Dec 16 Peach Orchard Hill, Shy's Hill, rout; stats; method card |

Projection: `assets/NAME.json` has zoom and origin_world_px; pixel of (lat, lon) = world_px(lat, lon, zoom) − origin (`python3 tools/px.py`-style maths; see the `G()` helper at the top of morgan/scenes-src/*.js; the constants differ per basemap).
Colors: Union = side "carth" (blue), Confederate = side "rome" (red).
Media (assets/media/): thomas_full.png, *_head.png portraits (thomas, rosecrans, bragg, longstreet, grant, hood, sherman, steedman, granger, schofield, wilson, cleburne, wood, garfield), us_flag_35star.png, csa_battle_flag.png. Check what exists before using; fall back to a plaque if a portrait is missing.
Method line: REFUSE TO BE HURRIED · HOLD THE GROUND THAT MATTERS · STRIKE TO DESTROY.

## Places (approximate lat, lon — verify with Nominatim / knowledge and against the relief)
Theater: Nashville 36.163,-86.782 · Franklin 35.925,-86.869 · Murfreesboro 35.846,-86.392 · Chattanooga 35.046,-85.310 · Chickamauga battlefield 34.93,-85.26 · LaFayette GA 34.705,-85.282 · Atlanta 33.749,-84.388 · Knoxville 35.961,-83.921 · Bridgeport AL 34.947,-85.714 · Decatur AL 34.606,-86.983 · Florence AL 34.80,-87.68 · Tennessee and Cumberland rivers from Natural Earth 10m.
Chickamauga: LaFayette Road roughly N-S (~-85.259) · Kelly Field ~34.935,-85.256 · Brotherton Field (breakthrough) ~34.924,-85.257 · Snodgrass Hill / Horseshoe Ridge ~34.931,-85.270 · Viniard Field ~34.905,-85.262 · West Chickamauga Creek east of the road (~-85.23/-85.24) · McFarland's Gap ~34.945,-85.296 · Rossville 34.983,-85.286.
Chattanooga: Orchard Knob 35.040,-85.276 · Missionary Ridge crest ~-85.262 from Rossville Gap 34.985 north to Tunnel Hill ~35.075,-85.238 · Bragg's HQ ~35.028,-85.255 · Lookout Mountain / Point Park 35.010,-85.344 · Brown's Ferry 35.050,-85.350 · Moccasin Point 35.025,-85.33.
Nashville: city 36.163,-86.782 · Fort Negley 36.143,-86.776 · Union fort ring ~2-3 mi south of the city, river to river · Hood's Dec 15 line from the Cumberland east of the city via Montgomery Hill ~36.118,-86.806 to the Hillsboro Pike, 5 redoubts along/west of Hillsboro Pike ~36.10-36.115,-86.82/-86.84 · Dec 16 line: Peach Orchard (Overton) Hill ~36.075,-86.770 to Shy's Hill 36.0833,-86.8325 · Franklin Pike south from the city (~-86.79), Granny White Pike and Hillsboro Pike west of it.
