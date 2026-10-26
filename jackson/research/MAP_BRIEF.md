# Map brief for the scene agents (Stonewall Jackson #11)

Project folder: `/home/user/battle-maps/jackson` (run every tool FROM this folder). Script: `script.md` (the `[MAP: id | notes]` tags
are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number that isn't there; quote
marks only on the verbatim quotes listed there, with their attribution). Narration timing: `audio/timing.json` (Kokoro take; wait for
`logs/narrate.done`). Time every beat to the spoken words with `B.at("para-id", "spoken phrase")`.

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a, 1b, 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6.
2. THE LOCKED REFERENCE VIDEO: STYLE_LOCK 0b (Rokossovsky #8) + 1a (the hook) + 1b (engagement beats). Inspect
   `reference/style-reference-rokossovsky-v8.mp4`, (hook agent) `reference/hook-reference-rokossovsky-v2.mp4` + `-sheet.jpg`, and
   `reference/engagement-test-peng.mp4` + `reference/engagement-examples/` by extracting frames with ffmpeg.
   The most recent worked example of the same pipeline is `/home/user/battle-maps/peng/` (scenes-src/*.js, tools/make_*_control.py,
   make_*_geo.py, make_*_inline.py, build/sheet-*.json) and `collins/`: copy their structure, helpers and pacing. Also
   `rokossovsky/scenes-src/` (hook-a.js / hook-b.js = the locked hook; move2.js night barrage). Do not invent a new look.
3. Engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js` (`const GG = GGK(B)`), `lib/living.js`, `lib/battle.js`, `lib/engage.js`
   (`const E = EngageK(B)`: `E.subscribe`, `E.decide`, `E.final`). Artillery to copy: `goosegreen/scenes-src/move1.js` (barrage).

## This video
- Period: 1861-63 American Civil War, Virginia. Sides: **Jackson / Confederates = hero = blue (`side: "carth"`); Union = red
  (`side: "rome"`)**. Territory option 1 multiply colours: Confederate-held ground = the blue/allied colour, Union-held = red.
- **FLAGS (owner's pick, 2026-10-16: option A1):** US 34-star `assets/media/us34_flag.png` for the Union; Confederate First National
  13-star `assets/media/csa1_13_flag.png` for the Confederates, on EVERY map incl. Chancellorsville. **Never the Confederate battle flag,
  never `csa2_flag.png` (Second National, not in the field on 2 May 1863).** Flag ~115 px on screen with the name under it
  (UNITED STATES / CONFEDERATE STATES), legend top-centre CONFEDERATE (blue) / UNION (red). No emblem (no national emblem exists for
  these; skip the emblem rule). Unit counters use the same two flags as chips (`flag: "assets/media/us34_flag.png"` etc.).
- Badges: real photos `assets/media/<name>_head.png` (rembg cut-outs; `<name>_head_flat.png` = uncut): jackson, lee, longstreet
  (blue side); banks, fremont, shields, mcdowell, pope, hooker, howard, lincoln (red side). Initials only for anyone else (Ewell,
  Stuart, Trimble, Rodes, A.P. Hill, Kenly, Tyler, King, Porter, Sickles, Imboden, Bee): name plates / captions, no fake faces.
- **NO AIRCRAFT (1862-63): no planes, no `K.bombRun`, no c47g, no jet/prop sounds.** Artillery = `K.gun` -> arc -> `K.impact`
  (boom on impact, default shake on EVERY impact, never `shake: false`). Rifle fire = `mg` kind is OK for close volleys (sparingly).
  Ships only on the move-1 overview (McClellan's transports at Fort Monroe) if you want, silhouettes, no gunfire.
- Counters: infantry X, artillery howitzer silhouette, HQ flag. **Cavalry has no locked icon:** the MOVE 1 agent builds a cavalry
  silhouette (horse + rider, side view, same counter style) as a helper in its own scene file, shows it as a TEST snapshot on its sheet
  (labelled "NEW: cavalry icon, owner to approve"), and the other agents copy that helper. Size marks: brigade = X, division = XX,
  corps = XXX, army = XXXX (Civil War units: label them in words where clearer, e.g. "EWELL'S DIVISION").
- Look: DAY on almost everything (dark HD relief `_hd_ref`, living map). `K.night` only for: night 26-27 Aug at Bristoe/Manassas,
  night 1-2 May (Stuart's report, cracker boxes), and 2 May from ~7 pm (the halt, the wounding), plus the hook-3 wounding flash.
  Dawn/dusk tints where the script says (Brawner's Farm at dusk).
- Option 1 territory (multiply `_mx` control overlays per date) on wide shots; option 2 glowing two-colour fronts (`K.front` width 15,
  glow 0.47) on close-ups. Wide -> push-in -> wide per move. Every map: flags of both sides + legend top-centre. Fact-check every front
  line / control area per date and log it in `research/FACT_NOTES_<map>.md` (sources: NPS maps, ABT maps, Hotchkiss maps in
  `assets/media/archive_hotchkiss_*.jpg`, Henderson). Control in Virginia 1862-63 is NOT a modern border: Union-held = northern Virginia
  near Washington / the lower Valley when occupied / Fort Monroe & the Peninsula; draw it plainly per date, no state borders except
  Virginia-Maryland (the Potomac) and the 1863 West Virginia line is NOT drawn (WV statehood 20 Jun 1863 is after our dates).
- Labels: 1862-63 names, plain spelling matching the narration: Shenandoah Valley, Massanutten Mountain, Strasburg, Front Royal,
  Winchester, New Market, Luray, Harrisonburg, Port Republic, Cross Keys, McDowell, Kernstown, Williamsport, Potomac, Washington,
  Richmond, Fredericksburg, Rappahannock, Rapidan, Bull Run, Manassas Junction, Bristoe Station, Thoroughfare Gap, Salem, Gainesville,
  Groveton, Centreville, Warrenton Turnpike, Orange & Alexandria Railroad, Chancellorsville, the Wilderness, Catharine Furnace, Hazel
  Grove, Brock Road, Orange Turnpike, Wilderness Church, Guinea Station, Gettysburg (ending). Big towns only + story places as small
  white-box labels. Railroads of 1862 as thin dark lines where the story needs them (O&A RR, Manassas Gap RR, the unfinished railroad).
  **Check every story-place coordinate against the sources** (NPS/ABT/Hotchkiss), not the basemap centre.
- Rivers: Shenandoah North + South Fork, Potomac, Rappahannock, Rapidan, Bull Run (traced from the DEM with make_rivers_dem.py, or by
  hand if the DEM misses them), with the living-map shimmer.
- Casualty / RESULT cards and the method card exactly as the script + FACT_NOTES say (`GG.METHOD = ["MOVE FAST", "MYSTIFY",
  "HIT THE WEAKEST PART"]`, `GG.METHOD_TITLE = "JACKSON'S METHOD"`).
- Engagement beats (STYLE_LOCK 1b, examples in `reference/engagement-examples/`): `move1-sub` = `E.subscribe` (MOVE 1 agent),
  `move3-3` = `E.decide` (MOVE 3 agent), `end-3` = `E.final` with "TELL US WHICH COMMANDER WE SHOULD COVER NEXT" instead of the
  family line (HOOK/ENDING agent).

## Basemaps (baked by the main session: `assets/<name>.json`, `<name>_hd.jpg`, dark `<name>_hd_ref.jpg` (USE THIS), `<name>_land.png`)
| name | centre, zoom | covers | used by |
|---|---|---|---|
| `virginia` | 38.55N 78.15W, z9 | Valley + northern Virginia + Washington/Maryland + Richmond (bottom) | hook (wide), bg, move1-1, ending |
| `valley` | 38.95N 78.40W, z10 | McDowell village - Harrisonburg - Port Republic to Winchester/Williamsport + Front Royal, Luray, Washington edge | hook-1/2, move1 |
| `portrep` | 38.33N 78.82W, z12 | Port Republic, Cross Keys, the South Fork bridge | move1-7 |
| `nova` | 38.60N 77.70W, z10 | Rappahannock line, Jeffersonton, Salem, Thoroughfare Gap, Bristoe, Manassas, Washington; also Fredericksburg + Chancellorsville | move2 wide, move3 wide, hook-4 cut |
| `bullrun` | 38.815N 77.56W, z13 | Brawner Farm, Groveton, the unfinished railroad, Deep Cut, Stone Bridge, Henry Hill (bg-1) | bg-1, move2 close |
| `chanc` | 38.305N 77.665W, z13 | Chancellorsville, Hazel Grove, Catharine Furnace, Brock Road, Orange Turnpike, Wilderness Church | move3 close |
Bakes run in `logs/bake_all.sh` (done marker `logs/bake.done`); if yours is not there yet, start with research/geometry/control work.
Geography layers: OSM via fetch_osm.py + make_geo_layer.py with HIST names (no modern towns that did not exist: e.g. no "Manassas
Park", no "Dale City"; Washington is fine), or a light per-map Overpass fetch like peng/tools/make_*_geo.py.

## Shared files (ownership, to avoid two agents writing the same file)
- `virginia` geo layer + rivers + control overlays `virginia_ctl_<date>_mx.png`: the HOOK/OVERVIEW agent (dates: jul61, mar62, jun62,
  aug62, sep62, may63, jul63). Make them early and say so in `research/FACT_NOTES_virginia.md`; the move agents reuse them read-only.
- `valley` + `portrep`: MOVE 1 agent. `nova` + `bullrun`: MOVE 2 agent (the hook agent reuses `bullrun` read-only for bg-1; make its
  geo layer early). `chanc` + the `nova` control overlays for May 1863 (prefix `nova3_`): MOVE 3 agent.

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map/prefix>_*.py`, `assets/media/<your map/prefix>_*`,
  `assets/src/<your map/prefix>_*`, `research/FACT_NOTES_<your map>.md`. Do NOT edit `lib/`, `script.md`, other agents' files or shared
  tools. If the engine truly lacks something, put a helper in your scene file and say so in your report. Do NOT git commit.
- NEVER render (`hyperframes render`) and never run `render_all.sh`. Only build (`python3 tools/build_scene.py SCENE BASE FIRST LAST`),
  `npx hyperframes lint scenes/SCENE`, and snapshot (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`; the frames land in
  `scenes/SCENE/.hyperframes/artifacts/snapshots/<id>/`: COPY them into `scenes/SCENE/snapshots/` before make_sheet.py).
  Look at every snapshot yourself and fix overlaps, off-screen flags, unreadable labels, wrong geography before finishing.
- Every blast/shot/stamp has its sound (`SFX(kind, t)`; K.impact/K.gun do it automatically). Never switch the shake off. Zoom whoosh
  only on the 2-3 biggest camera moves of the hook.
- Deliverable: ONE labelled snapshot sheet per part: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (8-14 frames covering every paragraph, hook: a frame every ~2.5 s for the first 30 s; label = mm:ss in the video = abs_start + t, what
  happens, which sound). Keep the JSON spec too. Final reply: scene names + `build_scene.py` arguments (SCENE BASE FIRST LAST), the
  sheet path, open TODOs, any fact you were unsure of.
