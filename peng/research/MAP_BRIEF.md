# Map brief for the scene agents (Peng #10)

Project folder: `/home/user/battle-maps/peng` (run every tool FROM this folder). Script: `script.md` (the `[MAP: id | notes]` tags
are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number that isn't there; no quote
marks except on the verbatim quotes listed there). Narration timing: `audio/timing.json` (Kokoro take; wait for `logs/narrate.done`).
Time every beat to the spoken words with `B.at("para-id", "spoken phrase")`.

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a, 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6 lessons.
2. THE LOCKED REFERENCE VIDEO: STYLE_LOCK 0b (Rokossovsky #8) + 1a (the hook). Inspect `reference/style-reference-rokossovsky-v8.mp4`
   and (hook agent) `reference/hook-reference-rokossovsky-v2.mp4` + `reference/hook-reference-rokossovsky-v2-sheet.jpg` by extracting frames
   with ffmpeg. The most recent worked example of the same pipeline is `/home/user/battle-maps/collins/` (scenes-src/*.js, tools/make_*_control.py,
   make_*_osm.py, make_*_geo.py, build/sheet-*.json): copy its structure, helpers and pacing. Also `rokossovsky/scenes-src/` (move2.js night
   barrage + fire sack, move3.js bombing runs + pocket, hook-a.js the locked hook, bg.js / ending.js overview). Do not invent a new look.
3. Korea reference from the O.P. Smith video (Chosin, same war, winter): `git show origin/claude/lucid-tesla-qugecc:smith/scenes-src/<file>.js`
   (files: breakout-*.js, hagaru-*.js, ending-*.js ...) for how PVA/US counters, snow and night looked on Korea maps. The LOOK must still be
   the locked Rokossovsky/Collins one (dark HD relief, option 1/2 territory, living map), not Smith's older parchment.
4. Engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js` (`const GG = GGK(B)`), `lib/living.js`, `lib/battle.js`. Bombing run / artillery
   to copy: `goosegreen/scenes-src/move3.js` (Harrier strike), `move1.js` (barrage); `collins/scenes-src/move2b.js` (Cobra carpet bombing).

## This video
- Sides: **Peng / Chinese People's Volunteer Army = hero = blue (`side: "carth"`); UN / US / ROK = red (`side: "rome"`)**. North Korean (KPA)
  units are on the blue side. Territory option 1 multiply colours: Communist-held ground = the blue/allied colour, UN-held = the red colour.
- Flags (png paths, `flag: "assets/media/<file>"`): PRC `prc_flag.png` (five-star flag; units may use `smith_pva_flag.png` = PLA flag only if
  prc is missing), USA 48-star `us_flag_48star.png`, ROK `rok_flag_1949.png`, UN `un_flag.png` (overview maps: the UN Command), North Korea
  `nk_flag.png` (or `smith_kpa_flag.png`), Turkey `turkey_flag.png`, UK `uk_flag.png` (British 29th Brigade, Seoul). A Sonnet agent is
  fetching these right now; if one is missing, use the closest existing file and leave a TODO line in your report.
  Emblem: `emblem_prc.png` on Chinese land (Manchuria) on the wide maps, never over sea/labels, never fading (skip if the file is missing).
- Badges: real photos `assets/media/<name>_head.png`: peng, macarthur, walker, ridgway, gay (+ keiser if found). Initials only if no photo.
  **Mao Zedong and Kim Il Sung: TEXT CARDS ONLY, never a likeness** (STYLE_LOCK 0b item 5, like Stalin in Rokossovsky).
- Winter + NIGHT: most battle beats are at night (`K.night`, snow/frost overlays as in Smith/Rokossovsky). Day returns at dawn where the
  script says so (Gauntlet 30 Nov is daytime with US aircraft).
- Aircraft: US planes = glowing `c47g` in RED (`side: "rome"`), few and spaced, they bomb/strafe and leave (`K.bombRun`, shake on first bomb).
  Chinese have NO aircraft (never show a blue plane). Recon planes = red c47g flying over, no bombs.
- Option 1 territory (multiply `_mx` control overlays per date, generator adapted from collins/tools/make_cot_control.py /
  rokossovsky/tools/make_bobruisk_control.py) on wide shots; option 2 glowing two-colour fronts (`K.front` width 15, glow 0.47) on close-ups.
  Wide -> push-in -> wide per move. Living map always on. Every map: flags of the powers on screen + legend top-centre.
- Labels: 1950 names in plain spelling matching the narration: Unsan, Chongchon, Kunu-ri, Sunchon, Anju, Tokchon, Onjong, Chosan, Yalu,
  Pyongyang, Seoul, Han, Imjin, Uijongbu, Suwon, Pyongtaek, Wonju, Wawon, Ipsok, Kuryong, Hungnam, Inchon, Pusan, Sinuiju, Manpojin.
  Big towns only + story places as small white-box labels. 38th parallel as a thin dashed labelled line on Korea-wide maps.
- Casualty / RESULT cards and the method card exactly as the script + FACT_NOTES say (`GG.METHOD = ["OWN THE NIGHT", "BAIT THE TRAP",
  "HIT THE SEAMS"]`, `GG.METHOD_TITLE = "PENG'S METHOD"`).

## Basemaps (baked by the main session: `assets/<name>.json`, `<name>_hd.jpg`, dark `<name>_hd_ref.jpg` (USE THIS), `<name>_land.png`)
| name | centre, zoom | covers | used by |
|---|---|---|---|
| `korea` | 38.6N 127.0E, z7 | whole peninsula + Manchuria border + west Japan | hook, bg, move2c, move3 overview, ending |
| `nwkorea` | 39.9N 126.0E, z9 | Yalu (Sinuiju-Chosan-Manpojin) to Pyongyang, Chongchon, Unsan, Tokchon, Kunu-ri, Hungnam/Chosin edge | move1a/c, move2a |
| `unsan` | 39.98N 125.85E, z12 | Unsan, Kuryong River, Ipsok, the road junction south of town, Bugle Hill area | move1b |
| `kunuri` | 39.50N 125.93E, z12 | Kunu-ri -> Sunchon road, the pass, Anju to the west | move2b |
| `seoul` | 37.4N 127.0E, z10 | Imjin, Uijongbu, Seoul, Han, Inchon/Kimpo, Suwon, Pyongtaek, Wonju (Line D) | move3 |
If a bake is not finished yet (`logs/bake.done`), start with research/geometry/control-map work and come back. Geography layers: OSM via
fetch_osm.py + make_geo_layer.py, or a light per-map Overpass fetch like collins/tools/make_cob_osm.py if Overpass times out.

## Shared files (ownership, to avoid two agents writing the same file)
- `korea` geo layer + rivers + 38th parallel + control overlays `korea_ctl_<date>_mx.png`: the HOOK/OVERVIEW agent. Dates needed by others:
  `korea_ctl_nov24`, `korea_ctl_dec15`, `korea_ctl_dec26`, `korea_ctl_jan7` (move2c, move3, ending): make these early and say so in
  `research/FACT_NOTES_korea.md`. Other agents reuse them read-only (wait if missing).
- `nwkorea` geo layer + rivers (`assets/media/nwkorea_geo_ref.png`, `nwkorea_rivers.json`): the MOVE 1 agent, early. The move 2 agent
  reuses them read-only and makes its own control overlays with prefix `nwk2_`.

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map/prefix>_*.py`, `assets/media/<your map/prefix>_*`,
  `assets/src/<your map/prefix>_*`, `research/FACT_NOTES_<your map>.md` (front lines per date with sources = the "control map" log).
  Do NOT edit `lib/`, `script.md`, other agents' files or shared tools. If the engine truly lacks something, put a helper in your scene
  file and say so in your report. Do NOT git commit (the main session commits).
- NEVER render (`hyperframes render`) and never run `render_all.sh`. Only build (`python3 tools/build_scene.py SCENE BASE FIRST LAST`),
  `npx hyperframes lint scenes/SCENE`, and snapshot (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`).
  Look at every snapshot yourself and fix overlaps, off-screen flags, unreadable labels, wrong geography before finishing.
- Every blast/shot/stamp has its sound (`SFX(kind, t)`; K.impact/K.gun/K.aircraft do it automatically). Never switch the shake off.
- Deliverable: ONE labelled snapshot sheet per part: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (8-14 frames covering every paragraph: mm:ss in the video = abs_start + t, what happens, which sound). Keep the JSON spec too.
  Final reply: scene names + `build_scene.py` arguments (SCENE BASE FIRST LAST), the sheet path, open TODOs, any fact you were unsure of.
