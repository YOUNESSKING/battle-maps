# Map scene brief: George Thomas video

Read first: `/home/user/battle-maps/HANDOVER.md` (sections 5 and 6), `thomas/script.md` (the `[MAP: id | notes]` tag of each paragraph is the storyboard for it), `thomas/lib/battle.js` (engine API), `ridgway/scenes-src/test.js` (newest example scene) and `hannibal/scenes-src/trebia.js` (a full battle example).

## Conventions
- Union = side `"carth"` (blue), Confederate = side `"rome"` (red). Colors come from `lib/battle.css`.
- Time everything from the narration: `B.P("chick-5")`, `B.end(...)`, `B.at("chick-5", "spoken phrase")`. Timing is in `thomas/audio/timing.json`.
- Basemaps (2880x1620, in `thomas/assets/`): `theater` (z9, TN/GA region), `chick` (z14, Chickamauga battlefield), `chatt` (z13, Chickamauga to Chattanooga), `ridge` (z14, Chattanooga basin / Missionary Ridge), `nash` (z13, Nashville). lat/lon → pixels: `python3 thomas/tools/px.py BASEMAP LAT LON ...`, or a `G(lat, lon)` helper in the scene like `ridgway/scenes-src/test.js` (origin_world_px + zoom are in `assets/BASEMAP.json`).
- Coordinates below are approximate: verify key places (web search NPS / HMdb / Wikipedia coordinates) and check them against the relief (ridges are visible on the basemap).
- Method card: `B.method(t, until)` already shows REFUSE TO BE HURRIED · HOLD THE GROUND THAT MATTERS · STRIKE TO DESTROY. Time each row to when it is spoken if you can (the helper staggers rows 1.1 s apart; you may add an optional row-time param in the engine only if you keep the default behaviour).
- Media (being fetched by another agent into `thomas/assets/media/`): `thomas_full.png`, `thomas_head.png`, `rosecrans_head.png`, `bragg_head.png`, `longstreet_head.png`, `grant_head.png`, `hood_head.png`, `sherman_head.png`, `steedman_head.png`, `granger_head.png`, `schofield_head.png`, `wilson_head.png`, `cleburne_head.png`, `wood_head.png`, `garfield_head.png`, `us_flag_35star.png`, `csa_battle_flag.png`. Use them in `B.portraitStake` / `B.plaque` / `B.bio`. If a file is missing when you build, check again later (`ls`); if still missing at render time, drop that stake rather than show a broken image.
- Engine changes: `thomas/lib/battle.js` is shared by 3 agents working at the same time. Prefer scene-local helpers in your scene file. If you must change the engine, make additive changes only (new function or new optional param), and re-read the file right before editing.
- Build: `cd thomas && python3 tools/build_scene.py SCENE BASEMAP FIRST_TAG LAST_TAG` → `thomas/scenes/SCENE/`. Then `hyperframes lint .` in that folder, `hyperframes snapshot . --at ...` at the key beats, LOOK at every snapshot (overlapping labels, units bunched, labels off-screen, black map edges), fix, rebuild.
- Render: ONLY one render at a time on this 4-core machine, so always wrap it: `flock /tmp/thomas-render.lock hyperframes render ...` and write to `thomas/renders/SCENE.mp4` (1920x1080, 30 fps). Check the log for "Render complete". Renders are gitignored.
- Style (Tactical Genius): long slow camera moves, clear big labels, title card at the start of each move, stats card for numbers, portrait stakes with flags for commanders, arrows that draw on. Never leave the screen static for more than ~5 s.
- Commit + push your `scenes-src/*.js` (and any engine change) after each scene works: `cd /home/user/battle-maps && git add thomas/scenes-src thomas/lib && git commit -m "..." && git push -u origin claude/george-thomas-civil-war-2epkux` (end commit messages with a blank line + `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`). If the push is rejected because another agent pushed, `git pull --rebase origin claude/george-thomas-civil-war-2epkux` then push again. Only add your own files.

## Scenes
| Scene | Basemap | Paragraphs | Agent |
|---|---|---|---|
| hook-a | chatt | hook-1 .. hook-2 (hook-2 = full-screen bio cut-out `thomas_full.png` + bio card over a dimmed map) | 1 |
| hook-b | theater | hook-3 | 1 |
| chick-a | theater | chick-1 .. chick-2 | 1 |
| chick-b | chick | chick-3 .. chick-9 | 1 |
| chick-c | chatt | chick-10 .. chick-11 | 1 |
| ridge-a | chatt | ridge-1 | 2 |
| ridge-b | ridge | ridge-2 .. ridge-6 | 2 |
| ridge-c | ridge | ridge-7 .. ridge-9 | 2 |
| nash-a | theater | nash-1 .. nash-2 | 3 |
| nash-b | nash | nash-3 | 3 |
| nash-c | nash | nash-4 .. nash-11 | 3 |

## Places (approximate lat, lon — verify)
Theater: Nashville 36.163,-86.782 · Franklin 35.925,-86.869 · Murfreesboro 35.846,-86.392 · Chattanooga 35.046,-85.310 · Chickamauga battlefield 34.93,-85.26 · LaFayette GA 34.705,-85.282 · Atlanta 33.749,-84.388 · Knoxville 35.961,-83.921 · Tennessee River (Chattanooga → Bridgeport 34.947,-85.714 → Guntersville → Decatur AL 34.606,-86.983 → Florence 34.80,-87.68) · Cumberland River through Nashville · Cumberland Plateau / Lookout Mountain visible in relief.
Chickamauga: LaFayette Road runs roughly N-S (~-85.259) · Kelly Field ~34.935,-85.256 · Brotherton Field (breakthrough) ~34.924,-85.257 · Snodgrass Hill / Horseshoe Ridge ~34.931,-85.270 · Lee and Gordon's Mill 34.882,-85.268 · Viniard Field ~34.905,-85.262 · West Chickamauga Creek east of the road (~-85.23 to -85.24) · McFarland's Gap ~34.945,-85.296 · Rossville 34.983,-85.286 (and Rossville Gap).
Chattanooga: Orchard Knob 35.040,-85.276 · Missionary Ridge crest ~-85.262 from Rossville Gap 34.985 north to Tunnel Hill ~35.075,-85.238 · Bragg's HQ ~35.028,-85.255 · Lookout Mountain / Point Park 35.010,-85.344 · Brown's Ferry 35.050,-85.350 · Moccasin Point (river loop) 35.025,-85.33.
Nashville: city 36.163,-86.782 · Fort Negley 36.143,-86.776 · Union line: a ring of forts ~2-3 mi south of the city from the river west (~36.16,-86.85) around to the river east (~36.17,-86.72) · Hood's Dec 15 line: from the Cumberland east of the city around Montgomery Hill ~36.118,-86.806 to the Hillsboro Pike, with 5 redoubts along/west of Hillsboro Pike ~36.10-36.115, -86.82 to -86.84 · Dec 16 line: Peach Orchard (Overton) Hill ~36.075,-86.770 in the east to Shy's Hill 36.0833,-86.8325 in the west · Franklin Pike runs south from the city (~-86.79) · Granny White Pike, Hillsboro Pike west of it.
