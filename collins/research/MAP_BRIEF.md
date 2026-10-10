# Map brief for the scene agents (Collins #9)

Project folder: `/home/user/battle-maps/collins` (run every tool FROM this folder). Script: `script.md` (the `[MAP: id | notes]` tags
are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number that isn't there).
Narration timing: `audio/timing.json` (Kokoro take; wait for it if missing: `logs/narrate.log` ends when done). Time every beat to the
spoken words with `B.at("para-id", "spoken phrase")`.

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a, 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6 lessons.
2. Reference kit `/home/user/battle-maps/frontlines-1m/`: `scenes-src/europe_hd.js` (wide map, option 1: multiply territory `_mx`
   overlay, emblem on Germany, flags, living map, c47g planes), `scenes-src/normandy_hd.js` (HD close-up), `scenes-src/test-opt2.js`
   (option 2: front lines only), `tools/make_europe_control.py`, `make_front_lines.py`, `make_geo_layer.py`, `fetch_osm.py`,
   `make_rivers_dem.py`, `bake_hd.py`. Locked engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js`, `lib/living.js`, `lib/battle.js`.
   Bombing run / artillery to copy: `/home/user/battle-maps/goosegreen/scenes-src/move3.js` (Harrier strike), `move1.js` (barrage).

## This video
- **THE LOCKED REFERENCE: STYLE_LOCK.md section 0b (the Rokossovsky video) + 1a (the hook).** Before writing anything, watch/inspect
  `reference/style-reference-rokossovsky-v8.mp4` (extract frames with ffmpeg) and read the matching scenes in
  `rokossovsky/scenes-src/` (move2.js = close-up battle with night barrage + fire sack, move3.js = bombing runs + pocket, hook-a.js =
  the locked hook, bg.js / ending.js = overview). Copy their structure, helpers and pacing. Do not invent a new look.
- Americans = hero = blue (`side: "carth"`), Germans = red (`side: "rome"`). Flags (lib/fx.js FLAGS keys or png paths):
  US 48-star `assets/media/us_flag_48star.png`, Germany `flag: "reich"` (`assets/media/ger_reich_flag.png`), UK `assets/media/uk_flag.png`
  (Montgomery, British tanks at the Meuse). Emblem `assets/media/emblem_ger.png` only on German land, never fading.
- Basemaps (HD versions `<name>_hd.jpg` + dark `<name>_hd_ref.jpg`; use the `_hd_ref` dark grade like Rokossovsky):
  `europe` (Western Front overview, z6), `normandy` (z10: Cotentin + Saint-Lô), `cherbourg` (z12 close-up), `cobra` (z12: Saint-Lô -
  Périers road, Marigny, Coutances), `ardennes` (z10: Dinant, Celles, Foy-Notre-Dame, Marche, Rochefort, Bastogne). Land masks:
  `python3 tools/make_land.py <name>`. Geography via fetch_osm.py + make_geo_layer.py (or the light per-map OSM fetch the Rokossovsky
  agents wrote, e.g. rokossovsky/tools/make_kursk_osm.py, if Overpass times out), 1944 names, big towns only.
- Option 1 territory (multiply `_mx` control overlays per date, generator adapted from rokossovsky/tools/make_bobruisk_control.py or
  frontlines-1m/tools/make_europe_control.py) on wide shots; option 2 glowing two-colour fronts (`K.front` width 15, glow 0.47) on
  close-ups. Wide -> push-in -> wide per move. Living map always on.
- Badges: real photos `assets/media/<name>_head.png` (another agent is fetching them; CREDITS.md lists them) else initials + TODO.
- Bombers/fighter-bombers = glowing `c47g` planes in blue (`side: "carth"`), `K.bombRun` (shake on the first bomb), few and spaced, they
  fly off. Artillery `K.gun` -> arc -> `K.impact`. Every beat has its SFX.
- Casualty / RESULT cards and the method card exactly as FACT_NOTES / script say (GG.METHOD + GG.METHOD_TITLE = "COLLINS'S METHOD").

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map>_*.py`, `assets/media/<your map>_*`,
  `assets/src/<your map>_*`, `research/FACT_NOTES_<your map>.md` (front lines per date with sources = the "control map" log).
  Do NOT edit `lib/`, `script.md`, other agents' files or shared tools. If the engine truly lacks something, put a helper in your scene
  file and say so in your report. Do NOT git commit (the main session commits).
- NEVER render (`hyperframes render`) and never run `render_all.sh`. Only build (`python3 tools/build_scene.py SCENE BASE FIRST LAST`),
  `npx hyperframes lint scenes/SCENE`, and snapshot (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`).
  Look at every snapshot yourself and fix overlaps, off-screen flags, unreadable labels, wrong geography before finishing.
- Deliverable: ONE labelled snapshot sheet per move: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (8-12 frames covering every paragraph: mm:ss in the video = abs_start + t, what happens, which sound). Keep the JSON spec too.
