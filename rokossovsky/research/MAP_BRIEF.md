# Map brief for the scene agents (Rokossovsky #8)

Project folder: `/home/user/battle-maps/rokossovsky` (run every tool FROM this folder). Script: `script.md` (the `[MAP: id | notes]` tags
are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number that isn't there).
Narration timing: `audio/timing.json` (Kokoro take; wait for it if missing: `logs/narrate.log` ends when done). Time every beat to the
spoken words with `B.at("para-id", "spoken phrase")`.

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6 lessons.
2. Reference kit `/home/user/battle-maps/frontlines-1m/`: `scenes-src/europe_hd.js` (wide map, option 1: multiply territory `_mx`
   overlay, emblem on Germany, flags, living map, c47g planes), `scenes-src/normandy_hd.js` (HD close-up), `scenes-src/test-opt2.js`
   (option 2: front lines only), `tools/make_europe_control.py`, `make_front_lines.py`, `make_geo_layer.py`, `fetch_osm.py`,
   `make_rivers_dem.py`, `bake_hd.py`. Locked engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js`, `lib/living.js`, `lib/battle.js`.
   Bombing run / artillery to copy: `/home/user/battle-maps/goosegreen/scenes-src/move3.js` (Harrier strike), `move1.js` (barrage).

## This video
- Soviets = hero = blue (`side: "carth"`), Germans = red (`side: "rome"`). Flags: `assets/media/ussr_flag.png` (1936-55 USSR),
  `assets/media/ger_reich_flag.png`; emblem `assets/media/emblem_ger.png` on German land only (never over sea/labels, never fades).
  Counter flag chips: use whatever FLAGS keys lib/fx.js has for USSR / Germany (check `flagSrc`); if missing, pass the png path.
- Every map shows who holds the ground + both period flags, changing with the dates. **Option 1 (territory colours, multiply `_mx`)
  on wide shots; option 2 (two-colour glowing `K.front` lines only, no fill) on close-up battle shots.** Legend card top-centre.
- Basemaps (already baked, HD versions `assets/<name>_hd.jpg` by `tools/bake_hd.py`; check `logs/hd.done`):
  `east` (z6, Eastern Front overview), `moscow` (z10), `kursk` (z9), `bobruisk` (z9). Land masks: `python3 tools/make_land.py <name>`.
- Geography: big towns only (MINPOP ~8000-20000 to taste), small labels, 1941-44 names (e.g. Kalinin not Tver, Stalino not Donetsk,
  Königsberg, Bobruisk not Babruysk), via `fetch_osm.py` + `make_geo_layer.py` (fallback: `make_rivers_dem.py` if Overpass fails).
  Story places as small white-box labels. Layer ABOVE territory.
- Living map on every map (`LivingK`: clouds, river shimmer, scale bar, north arrow). Flat 2D, no globe, no 3D tilt.
- Sound: every beat has its SFX (`SFX(kind, t)`; K.impact/K.gun/K.aircraft add theirs). Bombing = `K.bombRun` (shake on first bomb);
  never `shake: false` on impacts. Aircraft = `c47g` glowing planes (blue Soviet bombers here), few, spaced out, they bomb and fly off.
  Aircraft sound only when a plane is on screen. Zoom whoosh only on the hook's biggest camera moves. Stamps/slams = `SFX("hit")`,
  counters = `SFX("tick")`. Frontlines sound design kinds are used as in europe_hd.js (`ref:pop`, `ref:whoosh`, `ref:boom`, `ref:riser`).
- Commander badges (`K.badge`): Rokossovsky / Zhukov / Hoepner / Model / Busch. Use `assets/media/<name>_head.png` if present,
  else initials on dark tint (another agent is fetching licensed photos; leave a TODO, don't fetch photos yourself).
  Stalin: no likeness (text card only).
- Casualty cards (`K.casualties`) after moves 2 and 3 with the FACT_NOTES numbers; move 1 ends with a RESULT card instead.

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
