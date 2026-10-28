# Map brief for the scene agents (William T. Sherman #13)

Project folder: `/home/user/battle-maps/sherman` (run every tool FROM this folder). Script: `script.md` (OWNER-APPROVED 2026-10-28; the
`[MAP: id | notes]` tags are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number
that isn't there; quote marks only on the verbatim quotes in its "Quotes summary", with their attribution). Narration timing:
`audio/timing.json` (Kokoro take; wait for `logs/narrate.done`). Time every beat to the spoken words with `B.at("para-id", "spoken phrase")`
and check every phrase exists verbatim in timing.json's text (a missing phrase silently breaks the scene).

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a incl. the UPDATED 2026-10-28 block, 1b, 2,
   2a, 3, 3a are binding), HANDOVER.md §1b + §6.
2. THE LOCKED REFERENCE VIDEO: STYLE_LOCK 0b (Rokossovsky #8) + 1a (the hook) + 1b (engagement beats). Inspect
   `reference/style-reference-rokossovsky-v8.mp4`, (hook agent) `reference/hook-reference-meade-v3.mp4` + `-sheet.jpg` (THE NEW STAKES
   OPENING with ONE continuous geographic zoom: source `meade/scenes-src/hook-a.js`) and `reference/hook-reference-rokossovsky-v2.mp4`
   + `-sheet.jpg`, and `reference/engagement-test-peng.mp4` + `reference/engagement-examples/`, by extracting frames with ffmpeg.
3. **The closest worked example = George Meade #12, `/home/user/battle-maps/meade/`** (same war, same sides: Union = hero blue, same
   pipeline, newest tools): `scenes-src/*.js` (hook-a/b, bg-a, move1*-move3*, ending, `cavalry_icon.js`), `tools/make_*_control.py`,
   `make_*_geo.py`, `make_*_osm.py`, `make_*_inline.py`, `build/sheet-*.json/.jpg`, `research/FACT_NOTES_*.md`. Copy its structure,
   helpers and pacing. Also `jackson/` (Virginia 1862-63) and `greene2/` (Carolinas basemaps, 1780-81: same rivers).
4. Engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js` (`const GG = GGK(B)`), `lib/living.js`, `lib/battle.js`, `lib/engage.js`
   (`const E = EngageK(B)`: `E.subscribe`, `E.decide`, `E.final`). Artillery to copy: `goosegreen/scenes-src/move1.js` (barrage),
   `rokossovsky/scenes-src/move2.js` (night barrage, rows of guns), meade move 3 (bombardment, canister).

## This video
- Period: American Civil War, May 1864 - April 1865 (Atlanta campaign, March to the Sea, Carolinas). Sides: **Sherman / Union = hero =
  blue (`side: "carth"`); Confederates = red (`side: "rome"`)**. Territory option 1 multiply colours: Union-held ground = blue/allied
  colour, Confederate-held = red. Legend top-centre: UNION (blue) / CONFEDERATE (red).
- **FLAGS (owner's pick 2026-10-28: option A1, on EVERY map):** US 35-star `assets/media/us35_flag.png` for the Union; Confederate First
  National 13-star `assets/media/csa1_13_flag.png` for the Confederates. **Never the battle flag, never `csa2_flag.png` / `csa3_flag.png`,
  never `us34_flag.png`.** Flag ~115 px on screen with the name under it (UNITED STATES / CONFEDERATE STATES). No emblem. Unit counters
  use the same two flags as chips (`flag: "assets/media/us35_flag.png"` etc.). Both flags visible on every map shot.
- Badges: real licensed photos `assets/media/<name>_head.png` (rembg cut-outs; `<name>_head_flat.png` = uncut). See
  `assets/media/CREDITS.md` and `build/heads-sheet.jpg` for who exists (sherman, johnston, hood, thomas, mcpherson, schofield, howard,
  slocum, hardee, kilpatrick, hazen, mower, wheeler, hampton, beauregard, polk, davis (Jefferson), jcdavis, dahlgren, lincoln, grant).
  Name plates only for anyone without a photo; never a fake face. Badge colours follow the sides. In the hook, Sherman's badge is the
  mystery "?" until the name slam (hook-4).
- **NO AIRCRAFT (1864-65): no planes, no `K.bombRun`, no c47g, no jet/prop sounds.** Artillery = `K.gun` -> arc -> `K.impact` (boom on
  impact, default shake on EVERY impact, never `shake: false`). Rifle volleys = `mg` kind, sparingly. Big explosions (Hood's ammunition
  trains, 1 Sep 1864) = `K.impact` r >= 20 (explosion sound) in a ripple, fire glow + `K.smoke` columns.
- **Ships:** only off Fort McAllister / Ossabaw Sound (Dahlgren's fleet, a gunboat up the Ogeechee after the fort falls): side silhouettes
  (GG.ship), blue.
- Counters: infantry X, artillery howitzer silhouette, HQ flag, **cavalry = the owner-approved `scenes-src/cavalry_icon.js`** (copy its
  lines into your scene file, as meade/jackson do). Size marks: brigade = X, division = XX, corps = XXX, army/wing = XXXX; label in words
  where clearer ("ARMY OF THE CUMBERLAND", "RIGHT WING", "HAZEN"). Wagons (march scenes): a small wagon icon next to the columns.
- New visual beats in this video (keep them simple, in the locked style): **railroad lines** as thin dark lines with cross-ties (the W&A
  and the Macon & Western glow when they matter); **rail-twist "neckties"** = a short twisted-rail icon popping on the line (hit sound);
  **corduroy roads** = a log-stripe pattern laid ahead of each blue column (move 3); **flooded swamp** = blue-grey water shimmer
  (living.js style) over the low ground; **the march path** = a widening blue band ~60 miles wide (move 2); **foragers** = small blue
  dots fanning out; **freed people following** = a small column of neutral figures (no caricature; grey/gold dots are fine).
- Look: DAY on almost everything (dark HD relief `_hd_ref`, living map). `K.night` for: the night of 25 Aug (swing out of the trenches),
  the night of 1 Sep (Atlanta explosions), the Columbia fire (17-18 Feb), Hardee leaving Savannah (20 Dec), Bentonville nights, hook-3
  (dark twist). Rain streaks: Kennesaw (June) and Bentonville (21 Mar) only if cheap.
- Option 1 territory (multiply `_mx` control overlays per date) on wide shots; option 2 glowing two-colour fronts (`K.front` **width 15,
  glow 0.47, never thinner**) on close-ups. Wide -> push-in -> wide per move. Every map: flags of both sides + legend top-centre.
  **Control per date (fact-check and log it in `research/FACT_NOTES_<map>.md`)**: this is a war of moving armies, not fixed fronts:
  Union-held = Tennessee / north-west Georgia behind Sherman's line (Chattanooga to the front, per date), Atlanta from 2 Sep 1864,
  Savannah from 21 Dec 1864, the Georgia/SC coast posts (Beaufort, Port Royal, the Sea Islands, Fort Pulaski: Union since 1861-62),
  Charleston from 18 Feb 1865, Wilmington (Feb 1865), New Bern / coastal NC (Union since 1862), Goldsboro from 23 Mar 1865; the rest =
  Confederate. During the March to the Sea and the Carolinas march, show the ARMY's band (blue) moving through red ground, not a
  front line across the state (no two-colour front where there is none). On close-up battles (Dalton, Kennesaw, Atlanta/Jonesboro,
  Griswoldville, Fort McAllister, Rivers' Bridge, Bentonville) use `K.front` where the lines touch. State lines: Georgia, Tennessee,
  Alabama, South Carolina, North Carolina, Virginia as thin faint lines (1864 = today's lines here).
- Casualty / RESULT cards and the method card exactly as the script + FACT_NOTES say (`GG.METHOD = ["HIT THE RAILROAD, NOT THE WALL",
  "THREATEN TWO PLACES AT ONCE", "GO WHERE THEY SAY NO ARMY CAN"]`, `GG.METHOD_TITLE = "SHERMAN'S METHOD"`). Disputed figures as ranges
  with the source line (e.g. UNION 31,687-37,081).
- Labels: 1864-65 names, plain spelling matching the narration, big towns only + story places as small white-box labels: Chattanooga,
  Dalton, Rocky Face Ridge, Mill Creek Gap, Snake Creek Gap, Resaca, Oostanaula, Etowah, Allatoona, Dallas, New Hope Church, Pine
  Mountain, Kennesaw Mountain, Marietta, Chattahoochee, Peachtree Creek, Atlanta, Ezra Church, Jonesboro, Rough and Ready, Lovejoy's
  Station, Western & Atlantic RR, Macon & Western RR, Georgia RR; Macon, Griswoldville, Milledgeville, Augusta, Millen, Ebenezer Creek,
  Ogeechee, Savannah, Fort McAllister, Ossabaw Sound; Salkehatchie, Rivers' Bridge, Edisto, Orangeburg, Congaree, Columbia, Charleston,
  Cheraw, Pee Dee, Fayetteville, Cape Fear, Averasboro, Bentonville, Mill Creek, Goldsboro, Raleigh, Durham's Station / Bennett Place,
  Greensboro, Petersburg, Richmond, Appomattox, Nashville. No modern towns (no Smyrna sprawl, no modern Atlanta suburbs, no I-75).
  **Check every story-place coordinate against the sources** (NPS/ABT/LoC period maps, e.g. the LoC Atlanta campaign and Poe maps),
  not the basemap centre. Approx. reference points (verify): Dalton 34.77N 84.97W; Mill Creek Gap 34.78N 85.00W; Snake Creek Gap 34.68N
  85.08W; Resaca 34.58N 84.94W; Allatoona Pass 34.13N 84.71W; New Hope Church 33.95N 84.80W; Pine Mountain 34.00N 84.66W; Kennesaw
  Mountain 33.98N 84.58W; Cheatham Hill 33.95N 84.60W; Sope Creek mouth 33.92N 84.44W; Peachtree Creek battlefield 33.82N 84.40W; Battle
  of Atlanta (Bald Hill) 33.74N 84.34W; Ezra Church 33.75N 84.44W; Jonesboro 33.52N 84.35W; Griswoldville 32.87N 83.46W; Milledgeville
  33.08N 83.23W; Ebenezer Creek crossing 32.38N 81.18W; Fort McAllister 31.89N 81.19W; Rivers' Bridge 33.07N 81.10W; Columbia 34.00N
  81.03W; Averasboro 35.33N 78.66W; Bentonville 35.30N 78.32W; Bennett Place 36.03N 78.98W.

## Basemaps (baked by the main session: `assets/<name>.json`, `<name>_hd.jpg`, dark `<name>_hd_ref.jpg` (USE THIS), `<name>_land.png`)
| name | centre, zoom | covers | used by (provisional) |
|---|---|---|---|
| `south` | 34.50N 81.50W, z8 | theatre: Chattanooga - Atlanta - Savannah - Carolinas - Petersburg/Richmond | hook-1 start, bg-1, move1-9 end, move2-2, move2-9, move3-8, ending |
| `corridor` | 34.30N 84.85W, z10 | Chattanooga (top) - Dalton - Resaca - Allatoona - Kennesaw - Atlanta - Jonesboro (bottom) | move1-1, move1-4, move1-6, move2-1, hook-2 |
| `dalton` | 34.68N 85.00W, z11 | Rocky Face Ridge, Mill Creek Gap, Snake Creek Gap, Resaca, Oostanaula | move1-2, move1-3, move1-4 start |
| `kennesaw` | 33.95N 84.58W, z12 | Kennesaw Mountain, Pigeon Hill, Cheatham Hill, Marietta, Pine Mountain | move1-5 |
| `atlanta` | 33.64N 84.42W, z11 | Chattahoochee bridges - Atlanta - Ezra Church - Jonesboro - Lovejoy's | hook-1 zoom target, hook-2, move1-6..9, move1-sub |
| `georgia` | 32.95N 82.70W, z9 | Atlanta - Macon - Milledgeville - Augusta - Millen - Savannah | move2-3..6, hook-4 cut 2 |
| `savannah` | 31.98N 81.15W, z11 | Savannah, rice fields, Ogeechee, Fort McAllister, Ossabaw Sound | move2-7, move2-8 |
| `carolinas` | 34.25N 79.90W, z9 | (Savannah just off the bottom) Salkehatchie - Columbia - Charleston - Fayetteville - Bentonville - Raleigh - Durham | move3-1..5, move3-8, hook-4 cut 3 |
| `bentonville` | 35.30N 78.32W, z13 | the Bentonville battlefield, Mill Creek bridge, Goldsboro road | move3-6, move3-7 |
Bakes: `logs/bake_all.sh` (done marker `logs/bake_all.done`); if yours is not there yet, start with research/geometry/control work.
Griswoldville (move2-5) and Rivers' Bridge (move3-2) are short beats: push the camera in on `georgia` / `carolinas` (HD = one zoom deeper),
or ask the main session for an extra close-up bake. Geography layers: OSM via fetch_osm.py + make_geo_layer.py with HIST names (no towns
that did not exist in 1864), or a light per-map fetch like meade/tools/make_penn_geo.py; rivers from `make_rivers_dem.py` or Natural Earth.

## Shared files (ownership, to avoid two agents writing the same file)
- `south` geo layer, rivers, state lines and the theatre control overlays per date (`south_ctl_<date>_mx.png` for may64, aug64, sep64,
  dec64, feb65, apr65): the HOOK/BG/ENDING agent, FIRST (within its first ~20 minutes), logged in `research/FACT_NOTES_south.md`. The move
  agents reuse them read-only for their theatre shots (move1-9, move2-2, move2-9, move3-8).
- `corridor`, `dalton`, `kennesaw`, `atlanta`: MOVE 1 agent (the hook agent reuses `atlanta` + `corridor` geo/control read-only for
  hook-1's zoom target and hook-2: make `atlanta_*` and `corridor_*` control for aug64 / sep64 early and say so in FACT_NOTES_atlanta.md).
- `georgia`, `savannah`: MOVE 2 agent. `carolinas`, `bentonville`: MOVE 3 agent.
- If you need a variant of another agent's file, make your own with your prefix (`hook_*`, `m2_*`, ...).

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map/prefix>_*.py`, `assets/media/<your map/prefix>_*`,
  `assets/src/<your map/prefix>_*`, `research/FACT_NOTES_<your map>.md`. Do NOT edit `lib/`, `script.md`, other agents' files or shared
  tools. If the engine truly lacks something, put a helper in your scene file and say so in your report. Do NOT git commit.
- Scene names must match `tools/assemble_full.py` SCENES (provisional split; if you need a different split, say so in your report and
  the main session will update it): hook-a (hook-1..3), hook-b (hook-4), bg-a (bg-1), move1a (move1-1), move1b (move1-2..4), move1c
  (move1-5), move1d (move1-6..9), move1e (move1-sub), move2a (move2-1), move2b (move2-2), move2c (move2-3..6), move2d (move2-7..8),
  move2e (move2-9), move3a (move3-1..5), move3b (move3-6..7), move3c (move3-8), ending (end-1..2). The background ARCHIVE paragraph sits
  between hook-4 and bg-1 (no map scene for it). A scene has ONE basemap (the hook-1 zoom needs two maps on one camera: copy meade hook-a's
  technique): match camera hand-offs between scenes.
- NEVER render (`hyperframes render`) and never run `render_all.sh`. Only build (`python3 tools/build_scene.py SCENE BASE FIRST LAST`),
  `npx hyperframes lint scenes/SCENE`, and snapshot (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`; the frames land in
  `scenes/SCENE/.hyperframes/artifacts/snapshots/<id>/`: COPY them into `scenes/SCENE/snapshots/` before make_sheet.py).
  Look at every snapshot yourself and fix overlaps, off-screen flags, unreadable labels, wrong geography before finishing.
- Every blast/shot/stamp has its sound (`SFX(kind, t)`; K.impact/K.gun do it automatically). Never switch the shake off. Zoom whoosh
  only on the 2-3 biggest camera moves of the hook.
- The CPU is shared with the voice-A conversion: snapshot only the frames you need (no full-length preview renders).
- Deliverable: ONE labelled snapshot sheet per part: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (10-16 frames covering every paragraph, hook: a frame every ~2.5 s for the first 30 s; label = mm:ss in the video = abs_start + t, what
  happens, which sound). Keep the JSON spec too. Final reply: scene names + `build_scene.py` arguments (SCENE BASE FIRST LAST), the
  sheet path, open TODOs, any fact you were unsure of.
