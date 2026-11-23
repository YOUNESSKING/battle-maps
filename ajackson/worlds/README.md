# Battle 20 (Andrew Jackson) worlds: the Vicksburg 3D engine on new places

Same engine, same look, same troops as Vicksburg #19 (`vicksburg/engine/`, `vicksburg/tools/gm_look.py` untouched). The tools are
**project-aware**: `VX_PROJECT=ajackson` (or `--project ajackson`, or a sequence under `ajackson/sequences/`, auto-detected) makes them read and
write `ajackson/` instead of `vicksburg/`. Without it every tool behaves exactly as before (proved: Vicksburg `raymond` re-baked byte-identical,
`S10_gm` built + snapped before/after the change: 0.0 mean pixel difference).

## The frame
One BASE frame for all geography: `ajackson/data/frame.json` = web mercator **zoom 10**, origin `[64288, 104976]` (world px of ~33.7 N, 91.7 W),
x east, y south, 1 base unit = 1 z10 pixel = 132.5 m at New Orleans, 128.3 m at Horseshoe Bend. `data/geo.json` (places, rivers, roads, works,
moves, units) is in base units (+ lat/lon on every place / unit).

A region may be baked at another **zoom**: its map units = base x `k`, `k = 2^(zoom - 10)`, same origin corner. So the gulf (z8) is base / 4 and
Horseshoe Bend (z11) is base x 2. Each region is its own three.js scene, so the cloud dives between regions of different zoom work natively
(`dives[].over` / `from` in the wide region's units, `to` in the close region's units). `region.js` carries `frame: {zoom, k, mpu_true, ll_box}`.

The engine keeps `GM3D_GEO.mpu = 129.36` (the Vicksburg value: smoke, clouds, banners, troops keep their approved size in map units); the baker
rescales each region's `exag` by `129.36 / mpu_true` so the relief stays true to the region's real metres per unit (`exag_cfg` in region.js = the
exaggeration over true scale).

### Coordinate helpers (seq.js, `engine/seqlib.js`)
```js
VX.place("Villere plantation house")            // base units (prefix match on geo.json place names, as in Vicksburg)
VX.place("Villere plantation house", "gulf")    // the same place in the gulf's z8 units (base / 4)
VX.ll(32.9727, -85.7354, "horseshoe")           // lat/lon -> that region's units (no region = base)
VX.toRegion("horseshoe", [x, y]) / VX.fromRegion(...)   VX.frameK("gulf") -> 0.25
```
Python: `vicksburg/tools/vx_project.py` (`Project("ajackson").to_map(lat, lon, zoom)`, `.to_ll(x, y, zoom)`, `.mpu(zoom, lat=)`).
`geo.json` units records keep the research fields (`battle`, `phase`, `side`, `facing`, `moves_to` + `moves_to_xy` in base units).

## Regions
| region | kind / zoom | box [x0, y0, w, h] (its own units) | size | hm / tex | content |
| --- | --- | --- | --- | --- | --- |
| gulf | wide, z8 (523 m/unit) | 20, 22, 1206, 1024 | 630 x 535 km, 33.6-28.8 N, 91.6-85.0 W | 1809x1536 / 8192x6955 | Natchez, Baton Rouge, New Orleans, Lakes Pontchartrain / Maurepas / Borgne, Mobile + Mobile Bay, Pensacola, Fort Mims, Fort Stoddert, St. Stephens, Fort Jackson, Tuckabatchee, the Mississippi, Pearl, Pascagoula, Tombigbee, Black Warrior, Alabama, Mobile, Tensaw, Coosa, Tallapoosa (Horseshoe Bend), Cahaba, Conecuh / Escambia, Perdido, Chattahoochee; Federal Road, Mobile - Pensacola, river roads; the Gulf of Mexico. Modern reservoirs filled from the banks (1814 rivers only); coast = DEM <= 0 m |
| neworleans | wide, z10 (= base) | 1010, 2924, 590, 462 | 78 x 61 km | 885x693 / 8192x6415 | the city (grid), the river to English Turn, Lake Borgne + Bayou Bienvenue + the Villere canal (British route), Lake Pontchartrain, the Rigolets, Chef Menteur road, the plantations, Jackson's line. Modern canals (Industrial Canal, MRGO, Intracoastal) erased from the water mask; city basins below sea level are land |
| chalmette | close, z10 (= base, 132.5 m/unit) | 1236, 3184, 70, 70 | 9.3 x 9.3 km | 560x560 / 4096 | the plantation strip between the Mississippi (5.8 units = 770 m) and the cypress swamp: Macarty (Jackson HQ), Jackson's line on the Rodriguez Canal (rampart + ditch, river to wood + the receding swamp leg), the advanced redoubt, the 1 Jan British batteries, Chalmette, Bienvenu, De la Ronde, Lacoste, Villere (big house, quarters, sugar house), river (levee) roads on both banks, long-lot cane fields, the swamp band, open marsh north with the Villere canal to Bayou Bienvenue; west bank with Patterson's battery and Morgan's line. Terrain = synthetic natural levee (4 m at the bank -> 0.3 m at the swamp): the modern DEM there is levees, canals, streets |
| horseshoe | close, z11 (64.1 m/unit) | 8670, 1255, 66, 48 | 4.2 x 3.1 km | 528x384 / 4096x2979 | the Tallapoosa loop round the Tohopeka peninsula (toe south), the Red Stick log breastwork across the neck closed bank to bank, Gun Hill, Cotton Patch Hill + Jackson's approach trail from the north, Tohopeka village at the toe, Coffee's bank (south / west), Hammond's bank (east), Emuckfaw Creek mouth. Wooded Piedmont, a few clearings. No reservoir (Lake Martin is downstream; flat DEM water filled) |

Previews: `previews/<region>.jpg` (labelled top-down, grid in that region's units) and `previews/<region>_3d.jpg` (engine: overview, battle
camera, low oblique). Smoke test: `previews/smoke_sheet.jpg`.

### Key positions (region units; base for chalmette / neworleans; lat/lon in geo.json)
Chalmette (z10): Jackson's line river end (Battery 1) **1251.3, 3228.3** -> elbow at the wood **1254.0, 3224.2** -> swamp end **1248.9, 3220.3**
(the line faces ESE; front = `face` 0.58 rad); advanced redoubt just in front of the river end; Macarty house 1250.0, 3227.3; Chalmette Monument
1252.3, 3226.5; Chalmette house 1255.1, 3228.8; Bienvenu 1261.5, 3234.8; De la Ronde 1270.2, 3236.3; Lacoste 1281.3, 3238.1; **Villere house
1288.2, 3237.9**; Villere canal head (British landing, 23 Dec) 1283.5, 3186.8; USS Carolina anchorage 1283.9, 3241.2 (in the river);
Patterson's Marine Battery (west bank) 1247.5, 3233.4; Morgan's forward position (west bank) 1255.9, 3240.1; Thornton's west-bank advance
1273.2, 3245.3 -> 1243.8, 3231.4; New Orleans (Place d'Armes) 1202.2, 3213.8 (neworleans region only).
In the gulf (z8) divide by 4: Jackson's line ~ **312.8, 807.1**, New Orleans 300.6, 803.5, Mobile 668.4, 648.7, Pensacola 819.7, 708.0,
Fort Mims 705.6, 544.7, Fort Bowyer 671.9, 746.5, Fort Jackson 994.5, 260.4, Horseshoe Bend **1087.8, 160.4**.
Horseshoe (z11): breastwork centre **8706.8, 1278.4** (ends on the banks ~8700.0, 1276.6 and ~8709.5, 1278.2); Gun Hill 8705.9, 1276.4;
Cotton Patch Hill 8706.6, 1267.5; Tohopeka village (houses) ~8699.5, 1288.2 (research point 8698.0, 1290.4 is on the toe's channel); Cherokee
canoe crossing 8699.3, 1290.9 (toe); Bean's island 8699.3, 1274.8 (west arm; the ribbon has no island: put Bean's men on the bank or add a
boat/label); Coffee's south-bank line 8688.4, 1294.4; Hammond's rangers 8714.6, 1284.9; Coffee's ford 8665.6, 1270.8 (just outside the box).

## Rebuild
```bash
python3 ajackson/tools/fetch_osm_lines.py      # only when adding rivers (OSM centre lines -> data/osm_lines.json, committed)
python3 ajackson/tools/make_geo.py              # research/geo_*.json + OSM -> data/geo.json (rerun when the research files change)
python3 ajackson/tools/make_configs.py          # data/geo.json -> worlds/configs/*.json (plantation set-backs, breastwork closure, ...)
VX_PROJECT=ajackson python3 vicksburg/tools/bake_world.py all          # or: gulf chalmette horseshoe neworleans
VX_PROJECT=ajackson python3 vicksburg/tools/world_stills.py chalmette  # -> previews/chalmette_3d.jpg
```
Times / RAM (4 cores): chalmette ~40 s, horseshoe ~30 s (~2 GB); gulf ~2.5 min, neworleans ~2 min (~6-7 GB). DEM tiles are fetched per region
box from the AWS terrain tiles (`vx_project.fetch_dem`, tile cache `cleburne/tools/.tiles`) and cached as `worlds/_dem/*.npy` (git-ignored);
edited DEM + creeks are cached in `/tmp/vx_bake/ajackson/<region>/` (delete the folder to force a re-prep).

### Project-mode config keys (on top of the Vicksburg ones in `vicksburg/worlds/README.md`)
`zoom` (region frame), `dem_ppu` (DEM px per unit: 2 wide / 8 close), `dem_margin`, `focus` / `stills` (world_stills cameras),
`dem_edits`: `sea {level, open_px, min_px, island_px, seeds [[lat, lon]]}` (open water = DEM <= level connected to the edge or a seed ->
flat, painted with `sea_look {deep, shallow, shelf_u, beach_u, line_u}`), `fill_water` (+ `flat_sd`, `flat_low`, `void_below`: modern flat
water filled from the banks except +-`keep` units of the config rivers), `synth_levee {river, crest_m, base_m, half_w, width_u, pow, noise_m}`,
`flatten_levees {below_m}`, `alluvial_below`, `spike_m`, `sea_floor_m`; `creek_ppu`, `creek_km2`; `longlots {river, w, depth, bank}`
(French arpent strips perpendicular to the river instead of the Voronoi fields); `swamp_band {river, from | from_x [[x, d]], to | to_x,
jag, hummock, keep_near}` (no woods in the plantation strip, cypress band, open marsh beyond). River lines are turned upstream-first by the DEM.

## Scene authors
```bash
python3 vicksburg/tools/make_scene.py ajackson/sequences/S05            # auto-detects the project -> ajackson/scenes/S05/ (git-ignored)
bash vicksburg/tools/snap.sh ajackson/scenes/S05 3,20,47.5 /tmp/s05     # stills (SwiftShader)
node vicksburg/tools/check_troops_motion.mjs ajackson/scenes/S05 0 40 chalmette     # GM block motion QA (4th arg = the region!)
node vicksburg/tools/export_troop_events.mjs ajackson/scenes/S05 chalmette 0 40 <shareOffset> <filmStart> out.json   # musket sound events
node vicksburg/tools/probe.mjs ajackson/scenes/S05 3                    # console output when a still comes out blank
```
- Copy the troop set-up of `vicksburg/sequences/S10_gm`: `troops: "blocks", troopsOpts: { look: "lineblocks" }`; sides `u` (American, blue) /
  `r` (British, red; also the Red Sticks unless the lead picks another colour). Example with a dive: `ajackson/sequences/_smoke/seq.js`.
- Units, arrows, labels, fx, `dives[].to` are in the units of the region they belong to: always go through `VX.place(name, region)` or
  `VX.ll(lat, lon, region)`; never mix gulf (z8) and close numbers.
- troopScale defaults (10 wide / 1 close) and fxScale are per map unit as in Vicksburg; the gulf is 4x bigger in km per unit, so a "regiment"
  box on the gulf is an army-sized marker (use few, big units there; `regionOpts.gulf.troopScale` 10-14).
- Built-in generals and flags are the Civil War set: add Jackson / Pakenham / Coffee etc. with `generals: {key: {img, flag, side, name, full,
  role}}` and give `flag` explicitly (1814-15 US flag = 15 stars / 15 stripes, British Union Flag 1801; `date` alone picks a 34/35-star flag).
- Chalmette wide shots: the river is 5.8 units; keep camera dist >= 25 (41 px/unit at 4096). Horseshoe at z11: the whole bend fits at dist ~45-60.
- Gulf dive targets: `over` = the target's gulf position (e.g. `VX.place("Jackson's line, river end", "gulf")`), `from.dist` ~200-300.
- Positions are research estimates (acc_m in geo.json): Jackson's line = the research's Latour shape fitted onto the OSM Rodriguez Canal
  (rotated +17.8 deg, river end moved 366 m); the downstream plantations, the Carolina and the west-bank items were remapped onto the real
  river bank (the research had them on a straight line, 2 km inland). Rebake after research corrections (rerun the three tools above).
