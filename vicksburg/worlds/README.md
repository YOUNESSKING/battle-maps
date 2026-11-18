# Vicksburg worlds (baked terrain bundles for the 3D engine)

Baker: `vicksburg/tools/bake_world.py` = the approved v8 clip baker (`research/style_tests/gm3d/clip/bake_clip.py`) made config-driven.
The look functions (`gm_fields` close patchwork, `wide_fields`, `paint_town`, `water_levels`, `fbm` ...) are verbatim copies in
`vicksburg/tools/gm_look.py`; do not restyle there.

```
python3 vicksburg/tools/bake_world.py <region> [<region> ...] | all     # 'all' = every configs/*.json not starting with '_'
python3 vicksburg/tools/world_stills.py <region> ...                    # 3D stills on the engine -> previews/<region>_3d.jpg
python3 vicksburg/tools/trace_mississippi1863.py                        # rebuild configs/_mississippi1863.json (needs data/geo.json)
```

## Bundle (contract, see `vicksburg/AGENT_BRIEF.md`)
`worlds/<region>/height.png` (16-bit packed: h_m = (R*256+G)/200 - 20; includes the canopy blanket, earthwork humps, cane brakes),
`ground.jpg`, `region.js` (`GM3D_REGIONS[name] = {name, kind: wide|close, box, hm, tex, exag, meshDiv, rivers[{name,w,pts[[x,y,wl_m]]}],
roads[{name,cls: pike|lane,pts}], railroads[{name,pts}], trees[[x,z,h,kind,scale,col,edge]], houses[[x,z,h,w,d,rot,roof,kind]], towns{name:[x,y]},
places{name:[x,y]}, features{bridges[{name,kind: rail|road,x,z,angle,len,wl,deck,river,burn}], pontoons[{x,z,angle,len,wl}],
works[{name,kind: breastwork|fort|redan|lunette|rifle|battery,side,closed,height_m,pts[[x,y,h]]}], batteries[{name,x,z,h,face,guns}]},
+ clip compatibility: bridge, pontoons, breastworks})`. `worlds/geo.js` = `GM3D_GEO {zoom, origin, mpu, towns, places, rivers, roads, railroads, works}`.
Works follow the engine convention: the glacis / ditch is on the RIGHT-hand side of the walking direction (closed works: outside).

## Regions (map units of the `vicksburg_hd_lift` frame, 1 unit = 129.36 m)
| region | box [x0,y0,w,h] | hm / tex | bundle | content |
| --- | --- | --- | --- | --- |
| wide | 1030,330,1080,780 | 1620x1170 / 8192x5916 | ~7.8 MB | Milliken's Bend + Haynes' Bluff -> Bruinsburg / Port Gibson -> Jackson + Brandon, Louisiana bank, 1863 Mississippi |
| vicksburg | 1312,640,110,75 | 880x600 / 4096 | ~5.6 MB | city (street grid), bluffs + 12 river batteries, Fort Hill, South Fort, the De Soto Point hairpin, Grant's Canal, Yazoo mouth |
| siege | 1350,648,85,72 | 680x576 / 4096 | ~4.4 MB | the 8 forts (geo.json), Confederate rifle-pit line on the ridges, Union siege line ~2.2 units out + zig-zag approaches, city |
| bigblack_new | 1471,655,84,56 | 672x448 / 4096 | ~3.9 MB | v8 look on the TRUE bridge (1509.8,683.5): bend, bridgehead breastworks behind a bayou, Gin Lake, Bovina, 3 pontoon sites |
| champion | 1572,668,100,68 | 800x544 / 4096 | ~5.1 MB | crest, crossroads, Champion house, Coker / Roberts houses, Baker's Creek (+2 bridges), Edwards, the three roads, railroad |
| portgibson | 1236,990,86,58 | 688x464 / 4096 | ~3.5 MB | Shaifer house fork, Rodney + Bruinsburg ridge roads, Magnolia Church, Port Gibson grid, Bayou Pierre + South Fork bridge |
| raymond | 1676,732,80,56 | 640x448 / 4096 | ~3.0 MB | Raymond grid, Fourteenmile Creek + Utica-road bridge, the battlefield |
| jackson | 1836,690,95,68 | 760x544 / 4096 | ~3.7 MB | Jackson grid, Pearl River, Clinton + Raymond roads, Wright farm, Lynch Creek bridge, railroad |
| bruinsburg | 1148,995,90,60 | 720x480 / 4096 | ~2.9 MB | landing, Windsor plantation, Bayou Pierre mouth, the road inland |
`configs/_bigblack_clipgeo.json` = the old clip geography (bridge at (1513,705)), not baked by `all` (`out: bigblack_clipgeo`).
`worlds/bigblack` + `_clip_wide` belong to the engine agent's regression test (clip conversion); never written by the baker.

## Config (configs/<region>.json)
`mode` close|wide, `box`, `hm_ppu` (8 close / 1.5 wide), `tex` (texture width), `exag`, `cell` (field size), `seed`, `relief_noise`,
`cell_zones` [{x_from, k}] (smaller fields east of x), `woods` (+ = more), `ravine_woods` (slope weight), `swamp` (back-swamp woods on the
Mississippi alluvial plain, patchy), `cane` (cane brakes along alluvial rivers / bayous), `clear` [[x,y,r]] (open ground),
`rivers` [{name, geo|pts|ll, w, step, smooth, meander, snap (default: w<2 -> snapped to the DEM valley floor), snap_r, join (extend ends to the
first river), wl_max}], `creeks` {paint_km2, ribbon_km2} (D8 creeks from the DEM, painted; the biggest become ribbons in close regions),
`roads` [{geo|pts, cls pike|lane, meander}], `lanes` [pts], `railroads` [{geo|pts | follow_road, offset, merge_at}], `lakes` [{pts}],
`towns` [{name, geo|at, kind street|grid|hamlet|plantation|farm (close) / rad, houses, grid{block,angle} (wide)}], `hamlets` [[x,y,ang,len]],
`farms_at`, `plantations_at`, `farm_density` / `plantation_density` (per 1000 unit^2, auto-placed near roads, with country lanes, `lane_p`),
`features` {bridges [{geo|at, kind, burn, len}] (+ automatic bridges at every road / rail crossing of a ribbon river), pontoons [{at}],
works [{name, kind, shape redan|lunette|redoubt|square|fort|battery, geo|at|pts, size, face (deg, 0 = east) | face_to, closed, height, clear}]},
`auto_works` {river_batteries {y0,y1,n,crest_m,x_min,back,size}}, `siege_lines` (forts + lines + approaches), `labels` (places for the preview + region.js).
Names in `geo` resolve against `data/geo.json` (research agent; fuzzy, first match) and then the built-in base (gm_test roads `gm0`..`gm12`,
gm_test rivers `big_black`, `pearl`, the 1863 `mississippi`).

**Add a region:** copy a close config, set `box` (60-110 x 40-75 units frames the action at camera dist 25-60), list rivers / roads / towns
by their geo.json names, bake, check `previews/<region>.jpg`, then `world_stills.py <region>`. A close bake takes ~20-75 s and ~2 GB RAM;
the wide bake ~3.5 min and ~6 GB.

## DEM edits (prep_dem, cached in /tmp/vx_bake/prep_dem.npy)
- Modern water filled (pull-push from the banks) everywhere except +-4.5 units of the 1863 Mississippi: the 1876 cut-off through the De Soto
  neck, Centennial Lake, the Davis Bend cut, the Ross Barnett reservoir, ponds. DEM no-data pits (-64 m) filled.
- Modern levees / embankments on the alluvial plain flattened (thin ridges > 0.8 m, grey opening).
- Alluvial plain mask = low ground (<35 m) connected to the 1863 Mississippi, without narrow valleys: drives swamp woods + cane brakes, no D8 creeks there.

## Lessons
- The clip's coordinates for the railroad corridor were ~3 km south of the truth; geo.json (the bridge sits on the DEM river) is the reference.
- Coarse geo.json polylines are Catmull-Rom smoothed; small rivers are snapped to the DEM valley floor (otherwise a DEM creek and the named
  river run side by side as two channels). DEM creeks within 3.5 units of a named river are dropped.
- Additive wood terms saturate quickly (`clip(fbase*12)`): +0.07 on fbase is already a big change.
- Round clearings read as fake: settlement clearings are noisy blobs.
- Close regions above ~100x70 units at 4096 px are at ~41 px/unit (clip: 49); fine at camera dist >= 25.
