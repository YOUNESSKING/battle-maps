# Map brief for the scene agents (Nathanael Greene remake, `greene2/`)

Project folder: `/home/user/battle-maps/greene2` (run every tool FROM this folder). Script: `script.md` (owner-approved; the
`[MAP: id | notes]` tags are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number
that isn't there; quote marks only on verbatim quotes listed there, with attribution). Narration timing: `audio/timing.json`
(Kokoro take, final; never regenerate it). Time every beat to the spoken words with `B.at("para-id", "spoken phrase")` and check every
phrase exists in the paragraph text (a missing phrase silently breaks the scene).

## Read first (in this order)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a, 1b, 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6.
2. THE LOCKED REFERENCE VIDEO: STYLE_LOCK 0b (Rokossovsky #8) + 1a (hook) + 1b (engagement beats). Inspect
   `reference/style-reference-rokossovsky-v8.mp4`, (hook agent) `reference/hook-reference-rokossovsky-v2.mp4` + `-sheet.jpg`, and
   `reference/engagement-test-peng.mp4` + `reference/engagement-examples/` by extracting a few frames with ffmpeg (don't watch everything).
3. **Closest worked examples (pre-aircraft wars, same pipeline): George Meade #12 `/home/user/battle-maps/meade/`** (newest; read
   `research/MAP_BRIEF.md`, `scenes-src/*.js`, `tools/make_penn_*.py`, `make_getty_*.py`, `build/sheet-*.json`) and **Stonewall
   Jackson #11 `/home/user/battle-maps/jackson/`** (cavalry icon `scenes-src/cavalry_icon.js`, owner-approved: copy its lines into your
   scene file as jackson/scenes-src/move2a.js does). Copy structure, helpers and pacing. Also the OLD Greene video
   (`/home/user/battle-maps/greene/scenes-src/*.js`, `_guilford/`, `_eutaw/`) for geography, positions and period roads ONLY, not its look.
   Rokossovsky `scenes-src/hook-a.js`/`hook-b.js` for the hook mechanics.
4. Engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js` (`const GG = GGK(B)`), `lib/living.js`, `lib/battle.js`, `lib/engage.js`
   (`const E = EngageK(B)`). Artillery to copy: `goosegreen/scenes-src/move1.js`, `meade/scenes-src/move3*.js` (rows of guns, canister).

## This video
- Period: American Revolution, Southern campaign, May 1780 - Dec 1781. Sides: **Greene / Americans = hero = blue (`side: "carth"`);
  British + loyalists = red (`side: "rome"`)**. Legend top-centre: AMERICANS (blue) / BRITISH (red).
- **FLAGS (period, on EVERY map):** US 13-star `assets/media/us_flag_13star.png` (name under it: UNITED STATES) and the British
  Union flag of 1606-1801 `assets/media/gb_flag_1606.png` (GREAT BRITAIN; no St Patrick's saltire: never the modern Union Jack).
  ~115 px on screen, on each side's ground. No emblem. Counter chips use the same two flags.
- Badges (`K.badge`): real licensed portraits `assets/media/<name>_head.png` (greene, cornwallis, williams, tarleton, morgan, rawdon,
  lee, william_washington, sumter, fox; see `assets/media/CREDITS.md`, `build/sheet-images.jpg`). Initials/name plates
  only for anyone without a portrait (Stewart, Marjoribanks, Davidson, Marion). Never a fake face.
- **NO AIRCRAFT, NO TANKS (1780-81).** No planes, no `K.bombRun`, no c47g, no jet/prop sounds. Artillery = `K.gun` -> arc -> `K.impact`
  (boom on impact, default shake on EVERY impact, never `shake: false`); grapeshot/canister = short flat arcs, several small close
  impacts. Musket volleys = muzzle-flash lines + smoke puffs with the `mg` sound, sparingly (one per volley beat, not per flash).
  Boats = small boat icons on the rivers. Rain = light rain overlay where the script says so.
- Counters: infantry X, artillery howitzer silhouette (fine for 18th-c. cannon), cavalry = jackson's cavalry icon, HQ flag; size marks in
  words where clearer ("1ST MARYLAND", "2ND GUARDS", "LIGHT CORPS", "MILITIA"). Unit sizes: brigade/regiment level on battlefields.
- Look: dark HD relief `<map>_hd_ref` (USE THIS), living map (`lib/living.js`: cloud shadows, river shimmer, scale bar, north arrow), DAY
  except: hook-3 (dark twist card), dan-8 (night crossing 14 Feb, `K.night`, dawn on the 15th), eutaw-4 (pre-dawn march, then dawn).
- Option 1 territory (multiply `_mx` control overlays, one per date, 1 s cross-fade) on the wide `south` / `carolinas` shots; option 2
  glowing two-colour fronts (`K.front` width 15, glow 0.47, never thinner) on the `guilford` / `eutaw` battlefields. Wide -> push-in ->
  wide per move. Control in 1780-81 = posts and the country they dominate, not modern borders: use the control table in
  `research/FACT_NOTES.md` (log every overlay you draw in `research/FACT_NOTES_<map>.md`). Show only period state lines lightly if at all
  (Virginia / North Carolina / South Carolina / Georgia names as small labels).
- Labels: 1780-81 places only (no modern towns, no Greensboro, no Lake Marion): Charleston, Savannah, Augusta, Ninety Six, Camden,
  Georgetown, Orangeburg, Fort Watson, Fort Motte, Eutaw Springs, Hobkirk's Hill, Cheraw, Charlotte, Salisbury, Cowpens, Ramsour's Mill,
  Cowan's Ford, Trading Ford, Guilford Courthouse, Hillsborough, Wilmington, Boyd's Ferry, Irwin's Ferry, Dix's Ferry, Halifax,
  Petersburg, Richmond, Williamsburg, Yorktown; rivers Catawba, Yadkin, Dan, Haw, Deep, Santee, Congaree, Wateree, Pee Dee, Cape
  Fear, Savannah, James. Big places only + story places as small white-box labels. Check every coordinate (Nominatim works;
  Overpass fails through the proxy; Natural Earth 10m rivers work; `tools/make_rivers_dem.py` traces rivers from the elevation).
- Casualty / RESULT cards and the method card exactly as the script + FACT_NOTES say (`GG.METHOD = ["MAKE THE LAND FIGHT FOR YOU",
  "MAKE EVERY VICTORY COST MORE THAN IT'S WORTH", "NEVER LOSE THE ARMY"]`, `GG.METHOD_TITLE = "GREENE'S METHOD"`).
- Engagement beats (STYLE_LOCK 1b, `reference/engagement-examples/`): `move1-sub` = `E.subscribe` (MOVE 1 agent); `move2-decide` =
  `E.decide` (BATTLEFIELD agent: A = THROW IN EVERYTHING FOR THE VICTORY, B = RETREAT AND SAVE THE ARMY; reveal B on "watch what Greene
  did"); `end-2` = `E.final` with "TELL US WHICH COMMANDER WE SHOULD COVER NEXT" instead of the family line + a NEXT: DANIEL MORGAN AT
  THE COWPENS card (HOOK/ENDING agent). Leave the last ~20 s of end-2 calm (YouTube end screen).

## Basemaps (baked: `assets/<name>.json`, `<name>_hd.jpg`, dark `<name>_hd_ref.jpg` = USE THIS; `assets/src/<name>_hd_elev.npy`)
| name | centre, zoom | covers | used by |
|---|---|---|---|
| `south` | 34.70N 79.60W, z8 | Georgia (Savannah, Augusta) - both Carolinas - Virginia to Yorktown/Chesapeake | hook-a, hook-b, move3a, move3d, ending |
| `carolinas` | 35.80N 80.20W, z9 | Cowpens/Ramsour's Mill - Charlotte - Cheraw (bottom) - Yadkin - Guilford - Dan ferries - Hillsborough; Wilmington at the bottom-right edge, Petersburg near the top | move1a, move1b, move1c, move2a, move2d |
| `guilford` | 36.131N 79.846W, z15 | Guilford Courthouse battlefield (~11 x 6 km frame) | move2b, move2c |
| `eutaw` | 33.405N 80.290W, z15 | Eutaw Springs battlefield (very flat coastal plain: draw woods, creek, road, the brick house + garden yourself) | move3b, move3c |
Land masks: `python3 tools/make_land.py <name>` if you need one (check usage in the file).

## Shared files (ownership)
- `south` geo layer, rivers, control overlays (`south_ctl_aug80_mx.png`, `dec80`, `apr81`, `jul81`, `dec81`): HOOK/SOUTH agent, early.
- `carolinas` geo layer, rivers (Catawba, Yadkin, Dan especially), control overlays (`carolinas_ctl_jan81`, `feb81`, `mar81`): MOVE 1 agent.
- `guilford` + `eutaw` geography (roads, clearings, woods, creek, courthouse, brick house): BATTLEFIELD agent.

## Scenes (must match `tools/assemble_full.py` SCENES; a scene has ONE basemap; match camera hand-offs)
hook-a (hook-1..hook-2, south) · hook-b (hook-3..hook-4, south) · move1a (dan-1..dan-5b, carolinas) · move1b (dan-6..dan-9,
carolinas) · move1c (method-1..move1-sub, carolinas) · move2a (guilford-1, carolinas) · move2b (guilford-2..guilford-3, guilford) ·
move2c (guilford-4..guilford-8, incl. move2-decide, guilford) · move2d (guilford-9, carolinas) · move3a (eutaw-1..eutaw-2b, south) ·
move3b (eutaw-3..eutaw-7, eutaw) · move3c (eutaw-8, eutaw) · move3d (eutaw-9, south) · ending (end-1..end-2, south).
Build: `python3 tools/build_scene.py SCENE BASE FIRST LAST` (BASE = e.g. `south_hd_ref`).

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map>_*.py`, `assets/media/<your map>_*`,
  `assets/src/<your map>_*`, `research/FACT_NOTES_<your map>.md`. Do NOT edit `lib/`, `script.md`, other agents' files or shared tools.
  If the engine truly lacks something, put a helper in your scene file. Do NOT git commit.
- NEVER render (`hyperframes render`, `render_all.sh`). Only build, `npx hyperframes lint scenes/SCENE`, and snapshot
  (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`; frames land in `scenes/SCENE/.hyperframes/artifacts/snapshots/<id>/`:
  COPY them into `scenes/SCENE/snapshots/` before make_sheet.py). Look at every snapshot yourself (as ONE contact sheet per round, max 3
  rounds) and fix overlaps, off-screen flags, unreadable labels, wrong geography, black edges.
- Every blast/shot/stamp has its sound (`SFX(kind, t)`; K.impact/K.gun do it automatically). Never switch the shake off. Zoom whoosh
  only on the 2-3 biggest camera moves of the hook.
- The CPU is shared with the voice conversion: snapshot only the frames you need.
- Deliverable: ONE labelled snapshot sheet per part: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (8-14 frames covering every paragraph; hook: a frame every ~2.5 s for the first 30 s; label = mm:ss in the video = abs_start + t, what
  happens, which sound). Keep the JSON spec. Final reply (under 200 words): scene names + build_scene.py arguments, sheet paths, open
  TODOs, any fact you were unsure of.
