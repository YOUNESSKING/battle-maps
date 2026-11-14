# Francis Marion #18: brief for map agents (shared by every map agent)

Owner authority: script approved 2026-11-14 (`marion/script.md`). Do NOT commit, do NOT render full scenes, do NOT upload; never edit locked
sounds (`tools/check_sound_lock.py` must stay OK); never edit other videos' folders or `research/style_tests/` (copy what you need into `marion/`).
The main session commits. Hard-linked assets: never write INTO a file that may be hard-linked (scene assets, other videos' basemaps): always write
new files / unlink first. Delete snapshot folders after looking; purge `/root/.cache/hyperframes/history` when it grows.

## Locked look (read first, in order)
1. STYLE_LOCK.md **1a, 1c, 1d, 2c (items 1, 2, 4, 6, 10), 2d (Style W), 2e (living painted map), 2f (map extras)**, 3/3a (sounds). Where they conflict: 2f > 2e > 2d > older.
2. The newest worked example of the MAIN STYLE is **Yorktown**: `yorktown/kit/README.md` (kit, API, gotchas, CHANGES r2-r5), `yorktown/kit/PLACES.md`,
   `yorktown/scenes-src/*.js`, sheets `yorktown/build/sheet-*.jpg`. Reference film: `reference/style-reference-living-map.mp4`.
   Code sources behind it: `research/style_tests/make_style_w.py`, `research/style_tests/roads_towns/`, `research/style_tests/banners_units_camps/banners/`,
   `research/style_tests/more_life/` (living, river_label, weather), `grant/tools/s12_body_s12d_full2.js`.
3. **NOT used:** camps / wagon parks / farms / fields / block formations; Redcoats & Rebels style cards (use our parchment date scroll + our cards);
   synthesized `ref:*` sounds (no `box`/`boxS` helpers); dashed arrows; flags on unit boxes; legend except ~6 s when a symbol is new; country names under flags;
   NO modern reservoirs (Lake Marion, Lake Moultrie: see Maps) and no modern features (highways, I-95, dams, canals, towns that did not exist).

## Story, sides, flags
- Americans = BLUE (`allies` in the kit); British + Loyalists = RED (`british`).
- Flags (48 px behind each side's lines; while banners are up, one flag per side):
  - Marion's partisans (moves 1-2, and Marion's own units in move 3) = **the Moultrie flag**: indigo-blue field, white crescent in the upper hoist
    corner (canton) (2nd South Carolina Regiment, 1775). No public-domain file exists: DRAW OUR OWN (`assets/media/moultrie_flag.png` + pennant).
    It is a representative symbol (Marion's men carried no flag on raids): no caption claims otherwise.
  - Greene / Lee / the Continental army (move 3 only) = **US 13-star** `assets/media/us_flag_13star.png`.
  - British + Loyalists = **Union Flag 1606** `assets/media/gb_flag_1606.png` (no St Patrick's cross).
- Banners on poles (2f item 1), each only on/after its spoken name (1c): Marion (blue, Moultrie pennant; portrait = posthumous engraving, the scene shows
  the caption PAINTED LONG AFTER HIS DEATH once, hook-5), Greene (blue, 13-star), Henry Lee (blue, 13-star), Cornwallis, Tarleton, Rawdon (red, Union);
  Wemyss (red, initials, no portrait). Others = name tags on unit boxes (Hugh Horry, Maham, Fraser, Pickens, Rebecca Motte) on their spoken word.
  Portraits `assets/media/<key>_head.png` (image agent): keys `marion, greene, lee, cornwallis, tarleton, rawdon`.
- Unit boxes (2f item 2): Marion's men = mostly mounted militia = **cavalry slash**; Loyalist militia = infantry X or cavalry; Tarleton's Legion =
  cavalry + infantry + two small gun boxes; Maham's tower builders = **engineers (white gear)**; the Fort Motte six-pounder = the kit **gun box**.
  Max ~12 boxes per side, lines >= ~60 px apart.
- Weather ONLY where FACT_NOTES confirm: NONE in the hook, move 1 or move 2 (dark nights only: Great Savannah pre-dawn, Black Mingo + Tearcoat
  moonless nights, 7 Nov "profound darkness"); **bright scorching sun at Fort Motte noon 12 May 1781**; hot dusk at Parker's Ferry 30 Aug; hot day at
  Eutaw 8 Sep. Light presets only (no rain/fog/snow anywhere).
- Territory (2d 3b): FORM 1 hatching only on ground that changes hands, ~3 s, taker's colour; FORM 2 stripes only at m3-14 ("Charleston") and end-1. Never in the first minute except the hook-2 FORM 1 flash "between two rivers" (blue hatching).
- **Swamps are the story ground**: cypress swamp along the rivers and creeks (Santee, Black River, Pee Dee, Lynches Creek, Ox Swamp, Woodyard,
  Tearcoat, Horse Creek, the Edisto causeway): show them as dark, wet woods (darker canopy, water glints between trees) distinct from upland woods.
- **Ferries are central**: Nelson's Ferry (Santee), Benbow's Ferry (Black River), Parker's Ferry (Edisto), Shepherd's Ferry (Black Mingo),
  Murray's Ferry (Santee, upriver), plus the plank bridge over Black Mingo Creek a mile above Shepherd's: painted landings + flatboat (2e item 3).

## Maps (bake.py web mercator; 2880 x 1620 map px; propose final centres after checking the relief)
| map | zoom | centre (lat, lon) | covers |
|---|---|---|---|
| `lowcountry` | 10 | 33.52, -80.15 | Camden, Charleston, Georgetown, the Santee + Wateree/Congaree, Pee Dee, Lynches Creek, Black River, Kingstree, Snow's Island, Nelson's Ferry, Eutaw, Fort Motte, Parker's Ferry/Edisto; Winnsborough + NC off the edge (arrows from the edge) |
| `santee` | 13 | 33.47, -80.35 | Nelson's Ferry, Great Savannah (Sumter's house), Horse Creek, Fort Watson + Scott's Lake, Eutaw Springs |
| `blackriver` | 12 | 33.70, -79.85 | Richardson's, Woodyard swamp, Jack's Creek, Ox Swamp, Tearcoat Swamp (fork of the Black River), Benbow's Ferry, Kingstree, Black Mingo / Shepherd's Ferry |
| `congaree` | 13 | 33.75, -80.66 | Fort Motte (Motte house on Buckhead hill), the Congaree/Wateree fork, the old farmhouse opposite |
| `edisto` | 13 | 32.86, -80.40 | Parker's Ferry on the Edisto (Pon Pon), the causeway road through the swamp |
**THE 1780 SANTEE (critical):** today Lake Marion (from near Fort Motte down to Santee dam) and Lake Moultrie flood exactly where the story happens.
Draw the PRE-RESERVOIR river: the Santee channel + its swamp from the Congaree/Wateree fork past Nelson's Ferry, Fort Watson (on Scott's Lake, a
natural oxbow beside the river) and Eutaw to the coast; no reservoir water, no dams, no diversion canal. Sources for the old course: USGS historical
topo maps (topoView / ngmdb, pre-1941 quads), NHD flowlines that run under the lake (if any), the Mouzon 1775 map (Commons / LoC) for shape; drawn
smooth (2e rivers). Log what you used in `kit/PLACES.md`. Same for the Congaree/Wateree near Fort Motte if the lake reaches the map.
Period roads (2e rut roads, no dead ends): the Charleston - Nelson's Ferry - Camden road (east bank past the Great Savannah), the road Nelson's Ferry -
Kingstree - Georgetown, the Black River roads (Kingstree - Benbow's - Ox Swamp - Richardson's - Jack's Creek), the road down to Black Mingo /
Shepherd's Ferry, the Charleston road at Fort Motte, the Parker's Ferry road with its causeway (Edisto) toward Jacksonborough, Charleston - Monck's
Corner - Eutaw. Towns (1780, painted 2e): Charleston (city), Camden, Georgetown (towns), Kingstree, Jacksonborough, Monck's Corner (villages).
Permanent carved names: Charleston, Camden, Georgetown (lowcountry); Kingstree (blackriver). Others only on their spoken word (~3.5 s).

## Coordinates (FACT_NOTES; CHECK each against the relief + the old river; certainty in brackets)
Nelson's Ferry 33.431,-80.326 (fair) · Great Savannah / Sumter's house ~33.47,-80.25 (LOW: east bank, "six miles above Nelson's Ferry", on the main road) ·
Horse Creek pass (LOW, on the road near the house) · Fort Watson 33.539,-80.438 (good; Santee Indian Mound) · Eutaw Springs 33.407,-80.299 (good) ·
Fort Motte 33.761,-80.670 (±5 km) · Parker's Ferry 32.859,-80.401 (fair; ambush ~1 mile before the ferry on the road) · Ox Swamp 33.716,-80.198 (MED) ·
Kingstree 33.667,-79.832 · Benbow's Ferry ~33.75,-79.95 (LOW; Black River ~10 mi above Kingstree) · Black Mingo / Shepherd's Ferry ~33.62,-79.43 (LOW) ·
Tearcoat Swamp 33.803,-80.125 (MED; fork of the Black River) · Snow's Island 33.828,-79.344 (MED) · Richardson's (Rimini area) ~33.70,-80.20 (LOW) ·
Camden 34.246,-80.607 · Charleston 32.78,-79.93 · Georgetown 33.37,-79.28 · Monck's Corner 33.196,-80.013 · Jacksonborough 32.77,-80.46 ·
Winnsborough 34.38,-81.09 (off-map) · Amis's Mill (Drowning Creek NC) ~34.7,-79.3 (off-map).

## Scenes (contiguous runs of MAP paragraphs; times via the kit's `at(para, "spoken words")` from `audio/timing.json`; every phrase MUST exist in script.md)
| scene | paragraphs | basemap |
|---|---|---|
| hook-a | hook-1, hook-2 | lowcountry -> (one continuous zoom, INSET) santee; back out to lowcountry at "Within four months" |
| hook-b | hook-3, hook-4, hook-5 | lowcountry (Charleston close for the flashback; 3 snap cuts: santee night ferry, blackriver chase, santee tower) |
| m1a | m1-1, m1-2 | lowcountry |
| m1b | m1-3, m1-4 | santee |
| m1c | m1-5, m1-6 | lowcountry |
| m1d | m1-7, m1-8, m1-9 | blackriver |
| m1e | m1-10, sub | lowcountry |
| m2a | m2-1 .. m2-5 | blackriver |
| m2b | m2-6 .. m2-8 | blackriver |
| m2c | m2-9 .. m2-11 | lowcountry |
| m3a | m3-1, m3-2 | lowcountry |
| m3b | m3-3 .. m3-5 | santee |
| m3c | m3-6 | lowcountry |
| m3d | m3-7 .. m3-9 | congaree |
| m3e | m3-10 | lowcountry |
| m3f | m3-11, m3-12 | edisto |
| m3g | m3-13 | santee |
| m3h | m3-14, end-1, end-2 | lowcountry |
Cards on spoken words only (1c); one big card at a time; captions/stamps <= 3.5 s; date scroll always on; each move ends on the casualty/result card +
the method card `THE SWAMP FOX METHOD` (1. STRIKE IN THE DARK / 2. LET THE SWAMP FIGHT / 3. HIT THE CHAIN WITH THE ARMY). Artillery cues only where
guns are visible (Tarleton's two light guns are NOT fired; Fort Motte six-pounder fires once, visible; Parker's Ferry field gun not fired). Musketry
= visual flashes + `mg`/hit only on visible beats. Engagement: `E.subscribe` (sub), `E.decide` (m2-4, reveal on m2-5 start), `E.final` (end-2).
Snapshots per scene: contact sheet `build/sheet-<scene>.jpg` (hook: every ~2.5 s for the first 30 s); ONE critic agent reviews before the owner sees it.
