# Marion map kit (main style = STYLE_LOCK 2d + 2e + 2f, precedence 2f > 2e > 2d)

A copy of the Yorktown kit (`yorktown/kit`, r6) adapted for "Francis Marion's Top 3" (#18). Reference look: `reference/style-reference-living-map.mp4`.
Proof frames: `build/sheet-kit.jpg` (a-d), `build/sheet-kit-ref.jpg` (the same frames next to the reference), `build/santee_1780_proof.jpg`
(the 1780 Santee on the 1920 / 1946 USGS quads). Places, map extents and every correction: `kit/PLACES.md`.

## What changed vs the Yorktown kit
- **Maps**: `lowcountry` z10, `santee` z13, `blackriver` z12 (centre moved WEST to 33.72,-80.12), **NEW `blackmingo` z13** (Black Mingo / Shepherd's
  Ferry / plank bridge: one z12 map cannot hold both Richardson's and Black Mingo), `congaree` z13, `edisto` z13. Baked by `tools/bake_marion.sh <map>`
  (bake.py + bake_hd.py LIFT + make_land.py; no det_* layers needed), then `tools/make_w_all.sh <map> ...` (make_w + make_m, one map at a time).
- **Rivers by name** (`kit/fetch_rivers.py`): NHD flowlines (layer 4 on z10, layer 6 on z12-13) + **the 1780 Santee / Congaree / Wateree from the TIGER
  county lines** (`county` in places.py; the boundaries still follow the pre-reservoir channel; checked on the 1920 quads). The land mask is elevation
  > 0.5 m, so Lake Marion / Moultrie / Wateree / Murray are never water; inland maps set `water.nosea` (DEM tile seams are not water). Creeks are tied to
  the river they drain into (`tie`); hand water: `wet` lines (Horse Creek, smooth) and `ponds` (Scott's Lake).
- **Cypress swamp** (`kit/swamp.py`, `swamp` in places.py): river floodplain from the DEM (HAND), trimmed to the 1920 swamp edge on the Santee
  (`dry_north` = SANTEE_N_EDGE, `dry_south`, `add`). make_w paints it: darker wet olive-teal ground, pale water glints in the gaps, dense smaller dark
  domes (wide) / cooler darker crowns (close) right down to the bank; upland woods unchanged. Scenes get `assets/<base>_m_swamp.png` (alpha, map px).
- **make_m**: `mounds` (synthetic relief bump: the Fort Watson Indian mound), plantation houses (a town with size u < 9 = one painted house + dust yard:
  Great Savannah, Eutaw Springs, Richardson's, Dollard's, the Motte house + farmhouse), `causeway` (edisto: a pale raised bank under the ruts where the
  road crosses the swamp), writes `assets/<map>_m_swamp.png`.
- **Flags**: nation `"sc"` = the Moultrie flag (`assets/media/moultrie_flag.png`, side flag) with the gold-edged `moultrie_pennant.png` on the banners
  (`kit/make_moultrie.py`); `"us"` = 13-star (Greene, Lee); `"gb"` = Union 1606. Marion: `BANNER("marion", "Francis Marion", "sc", unit, t, o)`.
- `GD.rivers` (carved river names) = `kit/data/river_lines.json` (`kit/river_lines.py`): santee, congaree, wateree, wateree_low, pee_dee, black_river,
  lynches_creek, black_mingo, edisto, cooper, ashley, pocotaligo. The 1780 name is "Lynches Creek": `RIVER("lynches_creek", "Lynches Creek", t, o)`.

Baked into the basemaps (do NOT draw them again): painted towns + carved PERMANENT names (lowcountry: Charleston, Camden, Georgetown; blackriver:
Kingstree), unlabelled towns (Kingstree, Jacksonborough, Monck's Corner on lowcountry; Jacksonborough on edisto), plantation houses (above), rut roads
(no dead ends: `kit/data/<map>_bake.json` `ends`), timber bridges (incl. the Black Mingo plank bridge, Horse Creek, Ox Swamp country), ferries with
landings + flatboat (Nelson's, Murray's, Benbow's, Shepherd's, Parker's, McCord's), painted relief (the Santee bluffs Eutaw - Vance, Buckhead hill at
Fort Motte, the Fort Watson mound), the cypress swamp, ground texture, carved water. Everything that changes with the story is LIVE in the scene.

## What is where
| file | what |
|---|---|
| `kit/data/places.py` | maps, rivers (NHD names + county pairs), swamp, towns, roads, ferries, relief, mounds; `PLACES` (story points) and `RIVER_LINES` |
| `kit/data/tiger_counties.json`, `rivers_<map>.json`, `river_lines.json`, `<map>_bake.json` | fetched county lines / rivers, carved-name lines, baked towns + roads |
| `kit/fetch_rivers.py`, `kit/river_lines.py` | rivers for a map; river centre-lines |
| `kit/water.py`, `kit/swamp.py` | water mask (+ `RIVMASK` per river), cypress swamp mask (`python3 kit/swamp.py <map> out.png` previews both) |
| `kit/make_w.py`, `kit/make_m.py` | Style W green basemaps (+ swamp), baked 2e layers -> `assets/<map>_m*.jpg`, `_m_water/_land/_swamp.png` |
| `kit/js/*.js` + `kit/make_kit.py` -> `kit/yt_kit.js` | the JS kit (never edit yt_kit.js) |
| `kit/build_scene.py` | `scenes-src/<scene>.js` -> `scenes/<scene>/index.html` (hard-linked assets, timing anchors) |
| `kit/make_moultrie.py`, `kit/make_sheet.py`, `kit/places_report.py` | flags, proof sheets, PLACES.md (notes in `kit/PLACES_NOTES.md`) |
| `scenes-src/test-kit.js`, `test-kit-inset.js` | proof scenes a-c and d = worked examples of every call |

## Build + snapshot
```bash
cd /home/user/battle-maps/marion
python3 kit/make_kit.py                                                     # after editing kit/js/*.js
python3 kit/build_scene.py m1b santee m1-3 m1-4                             # narrated scene (audio/timing.json + voice.wav anchors)
python3 kit/build_scene.py hook-a lowcountry hook-1 hook-2 --inset santee   # + the nested map for the one continuous zoom
python3 kit/build_scene.py test-kit-b santee --dur 8 --src test-kit         # test scene without narration
cd scenes/test-kit-b && hyperframes snapshot . --at "5" --no-end -o <scratch>/snap_b   # look, then delete the snapshot folder
```
Basemap rebuild (only if places.py changes): `bash tools/make_w_all.sh <map>` (~2-4 min per map; make_w only matters for water / swamp / woods
keep-off changes; `python3 kit/make_m.py <map> check=1` = fast road / dead-end check). make_m writes NEW files (unlinks a hard-linked target first);
`make_m.py <map> v=2` writes a version 2 that build_scene.py picks up (scenes built earlier keep their copy).

## Coordinates
`LYT(lat, lon)` -> map px of the scene's basemap; `LLYT([[lat, lon], ...])`; `PLACE("nelsons_ferry")` (names in places.py `PLACES`: charleston, camden,
georgetown, kingstree, jacksonborough, moncks_corner, nelsons_ferry(_s/_n), great_savannah, horse_creek_pass, fort_watson, scotts_lake, eutaw_springs,
wrights_bluff, fort_motte, motte_farmhouse, buckhead_hill, congaree_wateree_fork, mccords_ferry, parkers_ferry, parkers_ambush, edisto_causeway,
richardsons, jacks_creek_mill, woodyard_swamp, ox_swamp, tearcoat_swamp, benbows_ferry, shepherds_ferry, black_mingo_bridge, dollards_tavern,
snows_island, murrays_ferry, winnsborough, ninety_six, amis_mill, fishing_creek, waxhaws). Camera scales the art is baked for: lowcountry 0.8 (Charleston - Camden framing s ~0.77), blackriver
1.3, santee / blackmingo / congaree / edisto 1.6; the close (canopy) look cross-fades in from s 1.5 to 2.2.

## API (all times in scene seconds; use `at(para, "spoken words")` for every beat)
| call | one-line example |
|---|---|
| `UNIT(id, side, p, type, o)` | `UNIT("lafa", "allies", PLACE("williamsburg"), "infantry", { ech: "XX", name: "LAFAYETTE", nameAt: at("p1-2", "Lafayette") })` types: infantry (X), cavalry (slash), engineers (white gear), artillery (kit gun box), supply (wheel), ship (sail); `ech` "II"/"X"/"XX"/"XXX"/""; `t` drop-in time (0 = on screen at frame 0) |
| `march(id, pts, t, dur, o)` | `march("am1", LLYT([[40.22,-74.76],[39.95,-75.17]]), at("p1-5","south"), 6)` moves along the road with dust behind (LIVING first; dust is sized for the camera scale at build time, `o.dustOp`, `o.dustSize`, `o.dust: false`) |
| `B.move(id, t, dur, x, y)` / `along(id, pts, t, dur)` | plain moves (no dust) |
| `BANNER(key, name, nation, at, t, o)` | `BANNER("marion", "Francis Marion", "sc", "m1", at("m1-3","Marion"), { side: "sw" })` nation sc (Moultrie) / us / gb; `at` = unit id or [x, y]; `side` up / right / left / west / east / ne / nw / sw / se (stake offset off the action); stays (2d.6) unless `o.until`; `o.myst: tSlam` shows the "?" banner until the name slam; portrait `assets/media/<key>_head.png`, initials if missing |
| `SIDEFLAG(nation, p, t, until)` | `SIDEFLAG("sc", LYT(33.86,-79.55))` or `SIDEFLAG("gb", "unitId")` 48 px nation flag behind a side's lines; auto-hidden while that side has a banner up (one flag per side) |
| `TRENCH(pts, t, o)` | `TRENCH(LLYT(PAR1), at("p3-5","first parallel"), { dur: 2.4 })` dug on its word (ditch + parapet, `o.face` +1/-1 parapet side) |
| `REDOUBT(id, p, t, o)` / `REDOUBT_TAKEN(el, t)` | `const r10 = REDOUBT("r10", PLACE("redoubt_10"), 0, { side: "british" }); REDOUBT_TAKEN(r10, at("p3-8","taken"))` |
| `HATCH(polys, side, t, o)` | FORM 1: `HATCH(LLYT(R10_GROUND), "allies", at("p3-8","Redoubt 10"))` taker's colour, ~3 s, water cut out |
| `STRIPES(blueP, redP, t)` | FORM 2 (p3-1 ring closes, end-1 only): whole map two-side stripes ~2.5 s |
| `LIVING(o)` | once per scene: `LIVING({ clouds: 0.1, light: "dusk" })` cloud shadows, water shimmer, enables `march` dust |
| `LIGHT(preset, t, dur)` | `LIGHT("night", at("p3-7","night"), 2)` presets day / morning / afternoon / dusk / night |
| `RAIN(t0, t1, k)` / `STORM(t0, t1)` | NOT used on Marion (no rain/fog/snow anywhere, MAP_BRIEF); weather assets are not built |
| `RIVER(name, text, t, o)` | `RIVER("santee", "Santee", at("m1-2","Santee"), { s: 1.1, near: PLACE("nelsons_ferry"), side: "below", hw: 6 })` carved italic, ~3.5 s; names: santee, congaree, wateree, pee_dee, black_river, lynches_creek, black_mingo, edisto, cooper, ashley, pocotaligo |
| `PLACE_LABEL(text, p, t, o)` | story place on its spoken word (not a permanent town), ~3.5 s: `PLACE_LABEL("Head of Elk", PLACE("head_of_elk"), at("p1-6","Head of Elk"))` |
| `INSET(map, o)` | nested higher-zoom basemap for one continuous zoom (build with `--inset map`): `INSET("santee")` (lowcountry -> santee = 8x; end the zoom inside the inset, s >= ~5.3) |
| kit (Grant) helpers still there | `shoot(from, to, t)` (K.gun -> arc -> K.impact: boom on impact + locked shake), `arw({...})` solid thin arrow, `focus(p, r, t)`, `inkTrace`, `crosses`, `smoke`, `stampP`, `B.caption`, `dateNow` / `B.date`, `declutter`, `GG.card`, engagement `E.decide/E.subscribe/E.final`, `K.casualties` |

Sounds: only the locked kit (`K.gun` quiet launch, `K.impact` boom on impact + shake; `SFX("hit")` on a banner/name pop). No `ref:*` sounds
(the old `box()` label helper calls `SFX("ref:pop")`: do not use `box`/`boxS`; use `PLACE_LABEL`).

## Gotchas (Marion; the Yorktown gotchas below still apply)
- **One z12 map cannot hold Richardson's and Black Mingo**: m1-7 (Black Mingo) is on `blackmingo`; m1-8 / m1-9 (Tearcoat) on `blackriver`. Split m1d.
- Snow's Island (33.83,-79.34) is only on `lowcountry` (east of `blackmingo` and `blackriver`).
- Fort Watson's stockade, the Maham tower, the Motte house's trench / parapet / burning roof, the Fort Motte six-pounder, Richardson's glow, the felled
  trees at Benbow's, the Parker's Ferry ambush line: all LIVE (scene) on the baked mound / houses / roads.
- The cypress swamp is baked art: units can stand in it (dark ground: keep unit boxes, banners and labels on the swamp edge when they must read at a
  glance; night scenes dim the live layers with NIGHT_DIM, so check contrast in the snapshot).
- `SIDEFLAG("sc", ...)` shows the plain Moultrie flag; the banner pennant is the gold-edged version (reads at 60 px). Do not caption the flag as
  carried by Marion's men (MAP_BRIEF: representative symbol).
- LOW-certainty places (Great Savannah, Richardson's, Woodyard, Jack's Creek mill, Shepherd's Ferry, Benbow's, McCord's, Murray's, Scott's Lake shape,
  the Motte farmhouse, the Parker's ambush point): see PLACES.md before captioning distances.
- `INSET("santee")` shows the santee WIDE (ink) art; for a zoom that ends full-frame on the close canopy look use `INSET("santee", { close: true })`
  (tested: `scenes-src/test-kit-inset.js`, frames 2.6 / 3.4 / 4.3 / 6 s; the mid-way frame is (d) on the sheet).
- Horse Creek (the hand trace under Lake Marion) is narrow and reads slightly beaded at s ~2: places.py now has hw 3.0 (not yet re-baked into santee_m).
- Proof frames were checked for lowcountry, santee, blackriver (+ the inset); blackmingo, congaree and edisto are baked (roads: no dead ends) but not yet
  snapshot-tested in a scene.
- `nelsons_ferry` on `lowcountry` is only ~2 map px wide: the ferry there is a symbol; the real crossing scenes are on `santee`.

## Gotchas inherited from the Yorktown kit
- One basemap per scene (`relief`/`relief_close`); a cross-map zoom uses `INSET` (feathered nested image, fades in by camera scale).
  Tested east -> peninsula (16x, `build/kit-inset-strip.jpg`): end the zoom with the frame INSIDE the inset box (centre it on the inset,
  s >= ~0.75 x 2^dz), else the feathered edge and the blurry east map show at the frame edge. east -> yorktown (64x) untested.
- Baked names are FIXED art: keep units, banners, cards >= 20 px off `GD.bake.towns[k].label.box`; never place a live label for a baked town.
- Banners are 124 x 209 screen px: put them on a side stake (`side: "right"|"left"|"ne"|"west"`) off towns and labels.
- `PLACE` coordinates for the siege works were checked against the relief, NOT yet against the Bauman plan (not delivered): see PLACES.md.
- `B.at` is a proportional estimate; the kit's `at` corrects it with the measured sentence starts. Re-grep every `at(...)` phrase after any script change (1c.5).
- Weather needs `kit/weather/<base>_m_*` (made for yorktown + peninsula); calling `RAIN` on another base shows only the screen rain.
- A march through a town crosses its baked name: pick the frame times / unit spacing so no box sits on a name when it matters (2f.2: boxes
  >= ~60 px apart; a 350 px route holds ~5 boxes).
- Banners: Clinton has no portrait yet (initials "HC" show automatically); the French pennant is the white royal flag (reads as a white
  rectangle at banner size: historically right). Generals not in the image agent's list get initials until a `<key>_head.png` exists.
- The builder runs `node --check` on the page script (prints "SCENE SCRIPT SYNTAX ERROR"); an inline `</script>` anywhere (even in a comment)
  breaks the page: make_kit.py escapes it in the kit, keep it out of scene sources.
- Snapshots: `hyperframes snapshot` only; never render full scenes in the kit; delete snapshot folders after looking.


## Yorktown kit history
See `yorktown/kit/README.md` CHANGES r2-r6 (all included in this copy: versions `_m2`.., LABEL_BOXES / NUDGE / LABEL_AUDIT, NIGHT_DIM, INSET r3, BOAT, side-coloured TRENCH / FRONT, LIGHT palette switch, ships option A).

## CHANGES r2 (2026-11-14, critic round 1; proof `build/sheet-kit.jpg`, `build/sheet-kit-ref.jpg`). Rebuild scenes to pick up the new art.
- Towns crisp (render_town soft 0.3, feather <= 7 u; was 0.9 / 18) and bigger: Charleston 60 u, Camden 38, Georgetown 32 (lowcountry, s 0.8),
  Jacksonborough 30 (edisto); roofs only on the town centre's own land (no Georgetown houses across Winyah Bay).
- Carved names snug (gap 0.8-1.25 x), never on water (x40), a road (x6) or across a river from their town; Charleston's far hand curve removed.
- Crossings closer than 15 screen px merge into one bridge; roads re-routed off the rivers (lowcountry McCord's - Camden road crosses the Wateree
  once and joins the Camden road; Black Mingo - Georgetown; blackriver Ox Swamp - north road). No Congaree bridge at Fort Motte: the Monck's Corner road
  runs below the Motte house to McCord's Ferry (moved to 33.759 / 33.771, -80.721, a straight reach), `motte_spur` up to the house.
- Swamp roads: wider cleared lane (`lane` u) + causeway (pale raised bank, `causeway_w`) on santee, blackriver, blackmingo, congaree, edisto; the close
  canopies keep off the lane; Nelson's Ferry road winds through the swamp. Flatboats never span the river (<= 42 % of the crossing), landings stronger.
- TIGER county-line rivers (Santee / Congaree / Wateree) smoothed (5-point moving average: no sawtooth loops). Horse Creek re-baked (hw 3.0, smooth).
- Relief stronger where named (`relief_ex`: santee 7, congaree 6). Santee swamp on both banks below Nelson's Ferry (`dry_south` only -80.40 .. -80.30,
  the Eutaw / Vance bluffs; Chicora 1920 shows swamp both sides further down).
- lowcountry wide woods lighter (`w_args`: forest 0.07, 12 grass patches; the tufts read as marsh).
- Banners: every banner has the plain gilt SPEAR finial (the US eagle is the 1782 Great Seal); no guy-rope line; portraits get `contrast(o.pop ?? 1.25)
  brightness(o.bright ?? 1.08)` (night scenes: `{ pop: 1.4, bright: 1.18 }`).
- INSET: the hook zoom uses `INSET("santee", { s0: 2.2, s1: 2.8 })` (the nested map takes over early and fast; the two maps' roads are never doubled
  for long). Per-map make_w options: `w_args` in places.py.

## CHANGES r3 (2026-11-14; proof `build/sheet-kit.jpg`)
- Swamp clip / add polygons are feathered (`swamp.feather`, default 14 quarter-px) and noise-broken: no straight or rectangular swamp edges.
  `dry_south` now runs to the dam line (-80.40 .. -80.15: the drowned south basin was upland on the 1920 quads; below the dam both banks are swamp);
  `SANTEE_N_EDGE` east end wobbled and extended to -79.70; `SWAMP_DAM` widened and also on blackriver; blackriver Santee keep box to -79.00.
- lowcountry roads `meander_k` 0.3 (they register with the nested maps' roads in the hook zoom).
- INSET: wider feather (52 %); while the first nested map grows in, the outer basemap is softened (CSS blur up to 1.4 px) so its magnified rut
  pairs and names do not read as doubled roads.
- Town names: Camden now on the east (NE) side, away from the Wateree.
