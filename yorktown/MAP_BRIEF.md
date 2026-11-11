# Yorktown 1781: brief for map agents (shared by every map agent)

Owner authority: script approved 2026-11-11 (yorktown/script.md). Do NOT commit, do NOT render, do NOT upload, never edit locked sounds
(`tools/check_sound_lock.py` must stay OK), never edit other videos' folders or `research/style_tests/` (copy what you need into yorktown/).
The main session commits. Max size discipline: hard-link/copy assets per scene, delete snapshot folders you no longer need.

## Locked look you MUST follow (read these first, in order)
1. STYLE_LOCK.md sections **1a, 1c, 1d, 2d (Style W), 2e (living painted map), 2f (map extras)**, 3/3a (sounds). Where they conflict: 2f > 2e > 2d > older.
2. Code + references:
   - Style W base: `research/style_tests/make_style_w.py`, `reference/style_w/index.html`, `cleburne/STYLEW_BRIEF.md`, `grant/STYLEW_BRIEF.md`,
     finished Style W scenes `cleburne/scenes-src/move1a.js` etc.
   - 2e painted towns / carved arced names / rut roads (no dead ends, timber bridges, ferries, lanes through woods) / painted hills / middle-blue
     carved rivers / ground texture: `research/style_tests/roads_towns/` (gen_rt.py, make_body.py, make_kit.py, towns/, roads/, hills/,
     rivers/, texture/, crossings.py, ends.py, masks.py), worked scene `grant/tools/s12_body_s12d_rt.js`, build `research/style_tests/roads_towns/build.sh`.
   - 2f banners on poles: `research/style_tests/banners_units_camps/banners/` (banner.js pinBanner + BN.reveal, README);
     living map `research/style_tests/more_life/living/` (living.js, river_label.js); weather `research/style_tests/more_life/weather/`;
     the full worked example `grant/tools/s12_body_s12d_full.js` + `research/style_tests/full/build_full.sh` (IGNORE its camps and farms: dropped).
3. **NOT used:** camps / wagon parks / farms / fields / block-formation units; R&R-style date/statement cards (use our date scroll + our cards);
   synthesized `ref:*` sounds; dashed arrows; flags on unit boxes; legend except ~6 s when a symbol is new; country names under flags.

## Story, sides, flags
- Allies (Americans AND French) = BLUE (`carth`); British + their German troops = RED (`rome`).
- Flags (48 px behind each side's lines; while banners are up, one flag per side): US = `assets/media/us_flag_13star.png` (generic US symbol),
  France = `assets/media/fr_royal_flag.png` (white, gold fleurs-de-lis), Britain = `assets/media/gb_flag_1606.png` (no St Patrick's cross).
  Allied side shows the US flag; French units/fleet get the French flag where the narration is about the French (p1-3, Part 2 fleet, French wing).
- Banners on poles (2f item 1, side colour + sepia portrait + lower pennant with the national flag): Washington, Rochambeau, Lafayette, Hamilton,
  Laurens, Lincoln, Lauzun, de Grasse, Barras (blue; French ones with the French pennant); Cornwallis, Clinton, Graves, Hood, Tarleton (red).
  Each appears ONLY on/after its spoken name (1c). Portraits: `assets/media/<key>_head.png` / `_head_flat.png` (image agent; if missing, the
  banner shows initials). O'Hara: no banner unless a real portrait exists.
- Unit boxes (2f item 2): several boxes per army (max ~12/side), infantry X, cavalry slash, engineers white GEAR, artillery = the kit gun box,
  echelon marks. Ships = the kit ship boxes/silhouettes (Part 2), no flags on them.
- Weather ONLY where FACT_NOTES confirm: 5 Sep clear (light NNE wind streaks ok); night 6-7 Oct gentle rain (p3-4); night 16-17 Oct violent storm
  of wind and rain from ~midnight (p3-11). Night 14 Oct = clear night (p3-7/p3-8). Everything else clear.
- Territory: 2d 3b. FORM 1 (hatching only on ground that is taken, at that moment, ~3 s, in the TAKER's colour: allied gains = blue); FORM 2
  (whole-map two-side stripes, ~2.5 s, sparing; never in the first minute): p3-1 (the ring closes) and end-1 only.

## Maps (basemaps in `assets/`, json gives origin/zoom: lat/lon -> px with the bake.py formula)
| map | zoom | centre | covers |
|---|---|---|---|
| `east` | 8 | 39.30 N, -74.50 | Newport RI .. Dobbs Ferry .. New York .. Philadelphia .. Head of Elk .. Mount Vernon .. Chesapeake capes |
| `chesapeake` | 10 | 37.10, -76.10 | lower Chesapeake, Cape Henry/Charles, Lynnhaven Bay, York + James rivers, Williamsburg, Yorktown |
| `peninsula` | 12 | 37.25, -76.62 | Williamsburg, Jamestown, the James, Yorktown, Gloucester Point, the Hook |
| `yorktown` | 14 | 37.232, -76.505 | the siege: town, Gloucester Point, Yorktown Creek, Wormley Creek, parallels, Redoubts 9/10, Moore House, Surrender Field |
Coordinates (from the Gemini dossier, citing NPS; CHECK each against the relief and the Bauman 1782 plan `assets/archive/bauman_map.*` before use):
Yorktown 37.2388,-76.5097; Gloucester Point 37.2483,-76.5008; the Hook 37.2917,-76.4847; Fusiliers' Redoubt 37.2464,-76.5261; British inner line/hornwork
37.2325,-76.5092; Redoubt 9 37.2292,-76.4978; Redoubt 10 37.2319,-76.4953 (on the river bluff, ~400 yd NE of R9); first parallel centre 37.2244,-76.5006
(~2,000 yd, from the Yorktown Creek ravine to the river bluff, 600-800 yd from the British line); second parallel ~300 yd closer, joins R9/R10 to the
river; Moore House 37.2189,-76.4858; Surrender Field 37.2111,-76.5131; allied HQs 37.2067,-76.5350; Williamsburg 37.2707,-76.7075; Trebell's Landing
37.2044,-76.6669; Cape Henry 36.9261,-76.0061; Cape Charles 37.1333,-75.9667 (the real cape tip; check); Lynnhaven Bay 36.9167,-76.0833;
Dobbs Ferry 41.01,-73.87; King's Ferry 41.24,-73.97; Chatham NJ 40.74,-74.38; Trenton 40.22,-74.76; Philadelphia 39.95,-75.16; Chester 39.85,-75.36;
Head of Elk 39.61,-75.83; Baltimore 39.29,-76.61; Annapolis 38.98,-76.49; Mount Vernon 38.71,-77.09; Newport 41.49,-71.31; New York 40.71,-74.01; Staten Island 40.58,-74.15.
- Modern features must NOT show (no piers, runways, naval-station grids, modern channels/reservoirs, the Coleman Bridge): 1781 only.
- Period roads (2e rut roads, no dead ends): Williamsburg-Yorktown road(s) (two converging roads on 28 Sep: the northern road and the Hampton road),
  Hampton Road south from Yorktown past Surrender Field, the road from Gloucester Point north past the Hook; on `east` the main post roads of the march
  (Hudson - King's Ferry - Morristown/Chatham - Princeton - Trenton - Philadelphia - Chester - Head of Elk).
- Ferries: York River Yorktown <-> Gloucester Point (ferry landing + flatboat); King's Ferry on the Hudson. Rivers named (carved river names) only on their spoken word: YORK RIVER, HUDSON, the Chesapeake (bay label).

## Scenes (contiguous runs of MAP paragraphs; `B.at(para, "spoken phrase")` from audio/timing.json; every phrase MUST exist in script.md)
| scene | paragraphs | basemap(s) |
|---|---|---|
| hook-a | hook-1, hook-2 | east -> (one continuous zoom) peninsula |
| hook-b | hook-3, hook-4 | east (+ 3 snap cuts: east march, chesapeake ships, yorktown night redoubt) |
| p1a | p1-1, p1-2 | east -> peninsula |
| p1b | p1-3 .. p1-8 | east |
| p2a | sub, p2-1 .. p2-7 | chesapeake |
| p2b | p2-8 | east -> peninsula |
| p3a | p3-1 .. p3-3 | peninsula -> yorktown |
| p3b | p3-4 .. p3-9 | yorktown |
| p3c | p3-10 .. p3-13 | yorktown |
| p3d | p3-14, end-1, end-2 | east |
Cards on spoken words only (1c); one big card at a time; captions/stamps <= 3.5 s; date scroll always on; every move/part ends on the casualty or
result card + method card (`THE TRAP` · 1. FOOL NEW YORK / 2. CLOSE THE SEA / 3. CLOSE THE LAND). Artillery cues only where the guns are visible
(1c item 4). Engagement: `E.decide` in p1-4, `E.subscribe` in sub, `E.final` in end-2 (lib/engage.js).

## Process
Snapshots per scene in a contact sheet `build/sheet-<scene>.jpg` (hook: every ~2.5 s for the first 30 s); ONE critic agent reviews before the owner sees it.
