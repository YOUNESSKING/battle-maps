# Battle 21 (George Washington) worlds: the Vicksburg 3D engine on new places

Same engine, same look, same troops as Jackson #20 / Vicksburg #19 (`vicksburg/engine/`, `vicksburg/tools/gm_look.py` untouched). Project mode:
`VX_PROJECT=washington` (or `--project washington`, or a sequence under `washington/sequences/`, auto-detected). The only new look element is
the **winter ground** (`"season": "winter"` in a region config; see below). Without it a bake is byte-identical to before (proved: Jackson
`chalmette` re-baked with the old and the new `bake_world.py`: `height.png`, `ground.jpg`, `region.js` identical).

## The frame
One BASE frame for all geography: `washington/data/frame.json` = web mercator **zoom 10**, origin `[75952, 98000]` (world px of ~41.3 N, 75.7 W,
rounded to 16), x east, y south, 1 base unit = 1 z10 pixel = ~116.7 m at Trenton, ~116 m at New York. `data/geo.json` (places, rivers, roads,
works, moves, units) is in base units (+ lat/lon on every place / unit).

A region baked at another **zoom** uses base x `k`, `k = 2^(zoom - 10)`, same origin corner: colonies (z9) = base / 2, brooklyn / trenton /
princeton (z11) = base x 2, crossing (z12) = base x 4. Each region is its own three.js scene, so cloud dives between regions of different zoom
work natively (`dives[].over` / `from` in the wide region's units, `to` in the close region's units). `region.js` carries `frame: {zoom, k, mpu_true, ll_box}`.
The engine keeps `GM3D_GEO.mpu = 129.36`; the baker rescales each region's `exag` to its true metres per unit (`exag_cfg` = the config value).

### Coordinate helpers (seq.js, `engine/seqlib.js`)
```js
VX.place("Johnson's Ferry")                  // base units (prefix match on geo.json place names)
VX.place("Johnson's Ferry", "crossing")      // the same place in the crossing's z12 units (base x 4)
VX.ll(40.2258, -74.7648, "trenton")          // lat/lon -> that region's units (no region = base)
VX.toRegion("colonies", [x, y]) / VX.fromRegion(...)   VX.frameK("colonies") -> 0.5
```
Python: `vicksburg/tools/vx_project.py` (`Project("washington").to_map(lat, lon, zoom)`, `.to_ll(x, y, zoom)`, `.mpu(zoom, lat=)`).

## Regions
| region | kind / zoom / season | box [x0, y0, w, h] (its own units) | size | hm / tex | bundle | content |
| --- | --- | --- | --- | --- | --- | --- |
| colonies | wide, z9 (233 m/unit), summer | 122, 113, 663, 585 | 154 x 136 km, 39.84-41.06 N, 75.36-73.54 W | 994x878 / 8192x7228 | ~5.2 MB | New York harbour (Upper / Lower / Raritan / Newark bays), Manhattan, Long Island west end, Staten Island, the Hudson, East River, Harlem; New Jersey: Newark, Elizabeth Town, Perth Amboy, New Brunswick, Princeton, Trenton, Morristown, Hackensack, Bordentown, Burlington, Bristol, Philadelphia, Germantown, White Plains; rivers Delaware, Schuylkill, Raritan, Millstone, Passaic, Hackensack, Neshaminy, Crosswicks, Assunpink, Saddle, Bronx; the 1776 post roads. Water = DEM <= 0.5 m (sea mask, incl. the tidal Delaware below Trenton) |
| jersey | wide, z10 (= base), WINTER | 560, 874, 220, 255 | 24 x 28 km | 512x600 / 8192x9590 | ~6.6 MB | the Ten Crucial Days: McConkey's / Johnson's Ferry, Bear Tavern road, Birmingham, River road + Pennington road into Trenton, the Assunpink, the post road (Shabakunk, Maidenhead, Stony Brook) to Princeton, Sandtown / Quaker Bridge / Saw Mill roads (night march), Bordentown, Crosswicks Creek, Millstone. Modern lakes (Carnegie Lake, reservoirs) filled |
| brooklyn | close, z11 (58 m/unit), summer | 2425, 1102, 103, 114 | 6.0 x 6.6 km | 824x912 / 4096x4533 | ~3.2 MB | Brooklyn Heights + the Brooklyn ferry landing (Fulton Ferry), the East River (~0.8-1.2 km = 14-20 units), the 1776 town of New York (grid south of ~Chambers St), Governors Island (north part), Red Hook, Wallabout Bay, Gowanus Creek + mill pond, the American works line (research line Wallabout -> Gowanus) with Fort Putnam, Fort Greene, Oblong Redoubt, Redoubt on the Left, Fort Box, Cobble Hill fort, Fort Stirling, Fort Defiance, Governors Island works. 1776 shoreline: modern landfill turned back into water by `force_water` polygons (approx.) |
| crossing | close, z12 (29 m/unit), WINTER, night-capable | 2367, 3755, 126, 119 | 3.7 x 3.5 km | 1008x952 / 4608x4352 | ~5.6 MB | McConkey's Ferry (PA) + Johnson's Ferry (NJ) landings and houses, the Delaware (10.5 units = ~300 m) with shore ice + drifting floes, the River roads on both banks, the Bear Tavern road up the NJ bank to Bear Tavern, Jacobs Creek |
| trenton | close, z11 (58 m/unit), WINTER | 1301, 2019, 96, 88 | 5.6 x 5.1 km | 768x704 / 4096x3755 | ~3.3 MB | the 1776 town on King St (main street) + Queen St (parallel) + a back lane and 3 cross streets, the head where the Pennington + Princeton roads come in, the Old Barracks, the Assunpink with the stone bridge at the foot of Queen St, Mill Hill, the Delaware (5.5 units), the River road from the NW, Pennington road from the N, post road NE, Bordentown / Quaker Bridge / Sandtown roads, the American line of 2 Jan (research line) |
| princeton | close, z11 (58 m/unit), WINTER | 1426, 1798, 103, 100 | 6.0 x 5.8 km | 824x800 / 4096x3977 | ~4.4 MB | Princeton village on the post road (Nassau St) + Nassau Hall, the post road SW over the Stony Brook bridge (Worth's Mill), the Quaker Bridge / Saw Mill road from the south, Thomas Clarke house + William Clarke's farm / orchard (the clash point), Olden house, Frog Hollow; Carnegie Lake + the D&R canal (modern) filled |

Previews: `previews/<region>.jpg` (labelled top-down, grid in that region's units) and `previews/<region>_3d.jpg` (engine: overview, battle
camera, low oblique). Winter test: `previews/winter_test.jpg`. Smoke test: `previews/smoke_sheet.jpg`.

### Key positions (region units; lat/lon in geo.json)
- **colonies (z9 = base / 2):** New York 613.4, 283.1; Brooklyn ferry 619.2, 285.0; Fort Washington 640.0, 213.2; Fort Lee 629.3, 213.9;
  Morristown 442.1, 240.2; New Brunswick 452.9, 389.2; Princeton 377.4, 455.0; **McConkey's Ferry 299.6, 480.1**; **Trenton 338.9, 515.7**; Philadelphia 193.2, 643.6.
- **jersey (z10 = base):** McConkey's Ferry 599.3, 960.2; Johnson's Ferry 602.7, 957.0; Bear Tavern 621.0, 940.5; Birmingham 638.5, 980.8;
  Trenton head (King / Queen) 677.9, 1027.3; Assunpink bridge 678.4, 1035.5; Maidenhead 702.0, 960.9; Stony Brook bridge 738.2, 924.8;
  Thomas Clarke house 740.6, 927.3; Princeton 754.8, 909.9; Quaker Bridge 747.0, 993.7; Bordentown 716.8, 1103.0.
- **brooklyn (z11):** Brooklyn ferry landing (Fulton Ferry) **2476.7, 1140.1** -> Manhattan landing (Peck Slip) **2467.1, 1131.3** (~1.1 km,
  the evacuation track); Fly Market 2463.6, 1134.1; Fort Stirling 2474.5, 1151.6; Cobble Hill fort 2480.3, 1169.9; Fort Box 2488.9, 1172.2;
  Fort Putnam 2505.4, 1166.6; Wallabout Bay 2509.0, 1144.9; Governors Island 2445.7, 1167.0; Fort Defiance (Red Hook) 2447.8, 1191.0;
  Gowanus Creek mouth 2465.3, 1196.7; Brouwer's mill pond crossing 2485.3, 1197.1. New York (town centre) ~2455, 1134.
- **crossing (z12 = base x 4):** McConkey's Ferry (inn) **2397.2, 3840.7** (research landing point 2390.2, 3831.6 is inland: put the boats at the
  water's edge ~2401, 3838); Johnson's Ferry (house) **2410.8, 3828.1** (research landing 2401.0, 3828.9 is in the river); the river runs NW -> SE
  (~10.5 units wide; west bank ~2401, east bank ~2412 at y 3840); Bear Tavern 2484.0, 3762.0 (NE corner).
- **trenton (z11):** King / Queen St head (Five Points, Knox's guns) **1355.9, 2054.5**; King St foot 1355.3, 2070.5; Queen St foot / Assunpink
  bridge **1356.9, 2070.9**; Old Barracks 1350.3, 2066.3; Rall's HQ 1354.8, 2064.1; Mill Hill (research: north rise) 1358.6, 2068.8; Pennington
  road picket 1339.6, 2023.6; Hessian surrender field 1364.3, 2053.2; Trenton Ferry 1359.2, 2083.7.
- **princeton (z11):** Nassau Hall **1509.5, 1819.9**; Thomas Clarke house 1481.3, 1854.7; William Clarke orchard / Mercer Oak **1485.9, 1852.6**
  (built-in clash point 1483.7, 1855.6); Stony Brook bridge (Post Road) 1476.5, 1849.7; Saw Mill road turn 1477.8, 1852.7; Olden house 1490.3, 1837.5; Frog Hollow 1506.3, 1834.6.

## Rebuild
```bash
python3 washington/tools/fetch_osm_lines.py      # only when adding rivers (OSM centre lines -> data/osm_lines.json, committed)
python3 washington/tools/make_geo.py              # built-ins + OSM + research/geo_brooklyn.json + geo_jersey.json -> data/geo.json
python3 washington/tools/make_configs.py          # data/geo.json -> worlds/configs/*.json
VX_PROJECT=washington python3 vicksburg/tools/bake_world.py crossing       # one region at a time (RAM); 'all' bakes every config
VX_PROJECT=washington python3 vicksburg/tools/world_stills.py crossing     # -> previews/crossing_3d.jpg
```
Times / RAM (4 cores): close regions 35-70 s (~2-3 GB); jersey ~3.5 min, colonies ~3.5 min (~6 GB). DEM tiles from the AWS terrain tiles
(`vx_project.fetch_dem`), cached as `worlds/_dem/*.npy` (git-ignored); edited DEM + creeks cached in `/tmp/vx_bake/washington/<region>/`.

### make_geo.py merge rules
Built-in places / 1776 roads (lat/lon waypoints on their modern successors, acc 300-1500 m) + OSM rivers (parts chained, back-tracks removed,
resampled every 0.5 base units) + the research files. A research place **replaces** a built-in one when its name starts with the built-in name
followed by " (" or ", " (e.g. "Fort Putnam (hill, later Fort Greene), ...") and its acc_m is not > 1.5 x the built-in's (the console lists
every replacement). Research lines: kind river -> rivers, road -> roads, *works* / fort / redoubt / "American line ..." -> works (side us
unless the name starts "British"), the rest -> moves; units as given (+ `moves_to_xy`). Rerun make_geo + make_configs + the bakes after any research change.

### Baker / engine additions (project mode only; backward-compatible)
- **Winter** (`"season": "winter"`, tuning `"winter": {snow, snow_alpha, desat, ice, floes, conifers, road_col, snow_col, lit_col}`):
  `bake_world.winter_ground` (after roads, before the relief shading + `tex_grade`): the same field mosaic a little greyer / cooler / lighter
  (`desat` 0.45), a thin snow / frost dusting held in the furrows and hollows (alpha <= 0.66, none on roads, under woods or on water), a frost
  rim on the river banks; `winter_woods`: bare woods = dark grey-brown twig mass with teal conifer clumps; roads muddy brown (less red); wide
  maps: frost-pale (not yellow) sunlit slopes. `region.js` gets `season: "winter"` + `winter: {ice, floes, conifers}`. Engine (`world.js`,
  only when `season === "winter"`): crown colours grey-brown bare (16 % conifers keep the green), a thin pale shore-ice rim inside both banks
  and flat ice floes drifting downstream (rivers >= 1 unit wide; `floes` per square unit of water; drift is a pure function of t).
- **`dem_edits.sea.force_water` / `force_land`**: lat/lon polygons forced into / out of the sea mask (the 1776 shoreline of New York / Brooklyn).
- Settlements and hedge / lone trees keep off the sea mask (close regions with a sea mask only; Jackson's close regions have none).
- Roads keep only their dry runs over a sea mask (no road across the East River; a ferry = its two landings). Winter keeps the painted sea unfrosted.
- Wide maps: `towns[].cluster {spread, k}` / `village_cluster` = a compact cluster of small houses instead of long houses strung along the
  crossing roads (jersey; Jackson's wide maps never set it). Wide winter woods = bare grey-brown (#4b4641), jersey `wood_soft` blur 1.1 / alpha 0.72.
- Wide look after critic A r1 (project keys, defaults = the approved values): `relief_k` (baked relief, default 0.9), `lit_k` (sunlit-slope
  highlight, default 0.85), `wideSunK` (-> region.js; engine wide sun boost, default 0.35), `wood_scale` (>1 = smaller, more numerous woods),
  winter `wood_col` / `conifers_wide` (wide winter woods dark teal-grey #34403f). colonies / colonieswinter: exag 3, relief_k 0.5, lit_k 0.3,
  wideSunK 0.15, woods 0.08 x2.5 scale, tex_grade 1.12 / 1.1, shallow sea #4a6a75; jersey: exag 2, same relief keys, woods 0.07 x3, the gulf
  wide field mosaic (no `field_look gm`), box extended 15 units W + N to [560, 874, 220, 255] (same frame: coordinates unchanged).
- Round 3 (critic A): config `crown_u` (canopy speckle size, wide; 0.4 jersey / 0.55 colonies so it reads at dist 100-300), winter `crown_k`
  (speckle contrast x1.45), `wood_soft` blur 0.08 / 0.15 (crisp edges), `field_patch_k` (patch-to-patch contrast x0.6-0.65: soft Voronoi
  facets, strips kept; jersey 0.4 + `field_feather` 0.5 units = blur blended in along the patch borders only, round 4), `wide_near_k` / `wide_slope_k` (woods along valleys / steep ground). **Engine `detail`** (opt-in, region.js
  `detail: {k, u, far}` from the config): procedural high-frequency ground detail in the terrain shader, stronger on the dark wood canopy,
  faded out beyond `far` units from the camera (jersey k 0.1 u 0.35 far 320; colonies k 0.08 u 0.6 far 420). Regions without it render
  unchanged (Jackson `_smoke` snapped before/after: 0.0 mean pixel difference).
- `colonieswinter` = colonies + winter (same frame, box, geography; generated by make_configs.py). Colonies (both): the East River and the
  Harlem River / Spuyten Duyvil are `force_water` strips (z9: the DEM loses them; ~1 km / ~0.4 km wide).

## Scene authors
```bash
python3 vicksburg/tools/make_scene.py washington/sequences/_smoke        # -> washington/scenes/_smoke/ (git-ignored)
bash vicksburg/tools/snap.sh washington/scenes/_smoke 2,9,13 /tmp/wx_smoke
node vicksburg/tools/check_troops_motion.mjs washington/scenes/S05 0 40 trenton   # 4th arg = the region
```
- Start from `washington/sequences/_smoke/seq.js` (colonies -> cloud dive -> crossing, line-block troops, `date: "1776-12-25"`).
- Units, arrows, labels, fx, `dives[].to` are in the units of the region they belong to: always `VX.place(name, region)` / `VX.ll(lat, lon, region)`.
- Give flags explicitly (`generals: {key: {img, flag, side, name, full, role}}`): Grand Union flag (US 1776, `washington/assets/flags/`) and the
  1707 Union Flag; `date` alone picks a Civil-War flag. Hessians = red (`r`), labelled by regiment.
- Camera distances: crossing (z12): the river is ~10.5 units; dist 20-45 frames the landings, ~110 the whole box. Trenton / Princeton / Brooklyn
  (z11): dist 25-60, the whole box at ~100-120. Colonies dive targets: `over` = `VX.place(name, "colonies")`, `from.dist` ~200-300; jersey ~120-330.
- Night (crossing): use the keys' `night` like Jackson S05; the winter ground darkens with the same grade.

## Author notes / open issues
- Positions are research estimates (acc_m in geo.json). Trenton anchors (King / Queen St, bridge, Old Barracks, Battle Monument) and the Stony
  Brook bridge come from the research's OSM anchors; the research puts **Mill Hill north of the Assunpink** (Mill Hill Park) - check against the
  fact notes before a label says "Mill Hill" for the American position south of the creek.
- Roads are 1776 routes drawn on their modern successors from waypoints (acc 300-1500 m): fine on wide shots; in close shots trust the
  research `moves` for the columns. The PA River road and the Bear Tavern road routing near Bear Tavern are approximate.
- Brooklyn 1776 shoreline: hand polygons (Manhattan east ~ Water St, west ~ Greenwich St, Brooklyn ~ Furman St, Wallabout without the Navy
  Yard, Governors Island north part); edges are approximate (100-200 m). The ferry track (research `moves`) spans ~1.1 km of water.
- Colonies: the Hudson / East River / tidal Delaware are the sea mask (no ribbon); Meadowlands marsh partly reads as water; modern fill at Newark
  Bay accepted. The Atlantic fills the SE quarter (true geography; frame the camera on NY - Philadelphia).
- Trenton has ~530 houses incl. farmsteads (the 1776 town ~100 houses + outbuildings): reads as a town on two streets, not a city.

## v2 ground (2026-11-26, OWNER_DECISIONS row 22): the approved v8 test look
Reference = `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` (+ `vicksburg/troops_test_v14_share.mp4`), not Jackson. Sheet: `previews/v2_ground.jpg`
(each region at a real scene camera next to the matching v8 / v14 frame). All 7 regions re-baked; boxes, frames, coordinates, rivers, roads, towns,
the East River fix and the village clusters unchanged.
- **Removed (the dark / flat / grey settings):** `rust_k` (rust ploughland back), `field_patch_k` / `field_feather` (patchwork contrast back),
  `tex_grade`, wide `relief_k 0.5` / `lit_k 0.3` / `wideSunK 0.15` (back to the v8 defaults 0.9 / 0.85 / 0.35), the heavy winter
  (`desat 0.45`, `snow_alpha 0.66`; and `conifers` never reached the engine, so 84 % of the close crowns were grey).
- **Winter = light frost over the same patchwork:** `WINTER = {snow 0.45, snow_alpha 0.16, desat 0.10, ice 0.6, conifers 0.55, bare_mix 0.35,
  road_col #84583f, snow_col #d2d0c2}`; wide `snow_alpha 0.10, desat 0.08, lit_col #c6c4a0`; crossing floes 0.18.
  `bare_mix` (new, project only): bare woods = the summer teal canopy lerped 35 % toward the twig colour (baker `winter_woods`, engine crowns
  `world.js`; absent = the old full grey-brown). With `bare_mix` set, no frost rim under the woods. `conifers` / `bare_mix` now pass to region.js.
- **Close regions** (brooklyn / trenton / princeton / crossing): our scene cameras sit 2-4x nearer (in metres) than v8's close camera, so the gm
  field look is scaled to read like v8 at 35-60 s: `cell` 4.2-7 -> 1.8-2.0 (fields ~100-120 m), `gm_unit` 0.45 (new: strips / furrows / tracks /
  scrub at 0.45x their unit size; hedge / lone trees thinned to keep the old tree density), `track_k` 0.5 (new `gm_fields` kwarg, default 1 =
  Vicksburg unchanged: half the pale cart tracks, half opacity). Relief: `exag` 2.0-2.6 -> 3.0-3.8, `relief_noise` [2.0, 0.6].
- **jersey (wide z10):** `field_look: "gm"` (the v8 close patchwork, ~700 m fields) with `cell` 6, `gm_unit` 1.5, `exag` 4, tex 7168 (gm_fields
  peak RSS ~7.5 GB at 7168; 8192 would exceed the 8 GB budget), speckled winter canopy (`crown_k` 1.8, `wood_col` #4b4a40, `bare_mix` 0.45).
- **colonies / colonieswinter (wide z9):** v8 wide look (wide_fields, `exag` 5, default relief / lit / sun), `wood_scale` 2.2, `woods` 0 (smaller,
  more numerous woods like v8 3 s).
- Vicksburg / Jackson configs never set the new keys: their bakes are unchanged.
