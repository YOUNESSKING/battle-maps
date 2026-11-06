# Grant #16 restyle into STYLE W: brief for scene agents (2026-11-06)

Owner authority: script, sheets and tests are pre-approved; the main session decides. Do NOT upload anything, do NOT commit (main session commits),
do NOT render full scenes (main session renders). Never edit locked sounds/music/levels. NEVER show the Confederate battle flag
(flags: `assets/media/us34_flag.png` until 31 May 1863, `us35_flag.png` from 1 Jun 1863; `csa1_13_flag.png` = Confederate First National). Sides: Union (Grant) = BLUE, Confederates = RED.

## Read first (in this order)
1. `/home/user/battle-maps/STYLE_LOCK.md` section **2d STYLE W** (the locked look; where older rules conflict, 2d wins) + 1a (hook) + 1c (on-screen text).
2. `research/style_tests/warhawk/CLEAN_SCREEN_CHECKLIST.txt` (C1-C15) and `CRITIC_NOTES.md` (every owner remark).
3. **The approved model: `cleburne/scenes-src/move1a.js`** (= `reference/style_w/index.html`, Tunnel Hill). It contains every helper: Style W kit (`box`, `unit`/`unitS`, solid `arw`, `legend`), `camera` with the lens transition wide->close (`#relief2`),
   `town` (permanent dot + serif name), `lay`/`loss` for hatch layers, BATCH 1 (`boxP`/`stampP` caps <= 3.5 s, `tagAt`, caption cap, legend only when a symbol is new), BATCH 2 (`focus` wash, `inkTrace`, `glowPath`/`K.target` overrides, `curveLabel`, `zoomBox`),
   BATCH 3 (`pinPortrait(id, photo, flag, name, t, until, keep, side)`, `smoke`, `profileStrip` once per move, `crosses`, time-of-day `todDiv`). Copy these blocks verbatim into your scene; adapt only places/times.
   A finished full-video example of the same job: `cleburne/scenes-src/*.js` (hook-a, hook-b, move2b, ending...) and `cleburne/README.md`.
4. Your scene's current source `grant/scenes-src/<scene>.js` (Grant v4, owner-approved story, hook, timing: KEEP the STORY, the beats, the cards, the camera story and every `B.at(...)` phrase; change the LOOK). The old kit code at the top of each file (`// @@KIT`, clean_screen_v11, LivingK, terrLoss, legend, scaleBar, north, flagS on units...) is what you replace with the Style W kit. The scene file is edited DIRECTLY (the old `tools/*_build.py` / `*_body_*.js` pipeline is retired for the restyle).
5. Script: `script.md`; timing `audio/timing.json` (regenerated, same as the old one); facts `research/FACT_NOTES.md` (use only what the narrator says).

## Basemaps (Style W)
- Baseline Style W maps are already baked WITHOUT story ground: `assets/<map>_w.jpg` + `<map>_w_close.jpg` + `<map>_w.json` for tennessee, henry, donelson, mississippi, vicksburg, vicksburg_siege, grandgulf, richmond, jamesriver, petersburg.
- Add the ground the narration names (Vicksburg bluffs, the Mississippi, bayous, railroads, ridges, fields, roads, Fort Donelson's ridge/ravines, the Dimmock Line...) in `assets/src/<map>_story.json` (scene css px = map px / 2; `hills` [[x,y,r],...] first = highest, `ridge` polyline or list, `ravine`, `rail` (list), `tunnel` optional, `fields` (list of polygons); ONLY ground the narration names; example `research/style_tests/warhawk/tunnel_story.json`; generator header `research/style_tests/make_style_w.py`), then re-bake (about 30 s):
  `cd /home/user/battle-maps/grant && python3 ../research/style_tests/make_style_w.py <map> assets/<map>_w.jpg close=assets/<map>_w_close.jpg story=assets/src/<map>_story.json green=1 tint=0 mult=1`
  (the `_w.json` already exists). Look at the result (`Read` the jpg; downscale first with PIL) and fix coordinates. Map px = the same px the old scene used for places (its `FH`, `DON`... constants are in map css px of the old hd_lift basemap: the Style W maps have the SAME geometry/size, so place coordinates carry over).
- Several scenes share maps: only ONE agent edits a map's story json (the owner listed in your task); others only read it.
- Territory = RED INK HATCHING only, only at the moment ground changes hands (~3 s, then dissolve), never at the opening, no blue fill:
  `python3 tools/make_hatch.py assets/media/<old>_mx.png assets/media/gn_<map>_<what>_mx.png assets/<map>_w.jpg [minus=<before>_mx.png]`
  (old territory masks `m1_*_mx.png`, `gh_*_mx.png`, `vk_*`, `vx_*`, `m3_*` are in assets/media; `minus=` = only the captured patch). Show with `lay(...)` + opacity tweens like move1a `GCAP`; copy the `terr-on` line from move1a if you use hatch layers. Wide country/theatre views may show it a bit stronger (2d item 3), still hatching, short, never at t=0.
- Build: `cd /home/user/battle-maps/grant && python3 tools/build_scene.py <scene> <map>_w <FIRST_TAG> <LAST_TAG>` (tags in SCENES.md / `tools/assemble_full.py` SCENES). It switches to the Style W template automatically.

## The 2d rules to apply to EVERY shot
- One green map (no old sand/v11 look, no old multiply territory fills left on screen).
- No flags on units (CSS hides `.fxk-flag`), no units split into dots/rings, unit name tag only from the spoken name (`tagAt`), unspoken units = bare box; groups = one tag.
- Arrows solid and thin (`arw`, width 6..13), NO dashed arrows/trails (remove `dash:` and dotted `trail()`); real moves = thin trail fading ~2 s after arrival. Gunboats/transports stay as simple top-down ship counters (blue), fired with K.gun -> arc -> K.impact (locked ship sounds).
- Generals: portrait card (`pinPortrait(..., true)`) on a stake at his unit for the whole battle once named; side stake when it would cover the fight; corner badges only for commanders with no unit on the map (<= 3.5 s, one per person). Grant's "?" mystery badge stays until the name slam in hook-4 (then his portrait card).
- Labels: small white serif + soft shadow, no box (towns 28 px, features 20-24 px); towns the armies head for = permanent `town()`; labels/units step out when the camera crops them at the frame edge; flags 48 px behind each side's lines, no country names.
- Clean screen: always on = date scroll + map + units + two small flags. No scale bar, no north arrow, no credit, no source text on cards, legend only ~6 s when a symbol is new. One big card at a time. Every caption/stamp/passing label <= 3.5 s; captions ~1 per 25 s, only for claims to remember; stamps = narrator's own words, cream on dark, on empty ground. Nothing on screen before the narrator says it. NO synthesized `ref:*` sounds (owner 2026-11-03): delete every `SFX("ref:...")` call; only the locked kit via K.impact/K.gun/K.bombRun.
- Map tools: focus wash instead of rings/glows; ink trace along a named feature (river, ridge, road); zoom box before a dive; ONE profile strip per move (the terrain beat; not in every scene: if the move has more scenes, put it where the terrain is explained); powder smoke at firing beats; ink crosses where attacks broke; time-of-day light (cool morning, warm 4 PM, night wash; m2b night mode).
- Keep: hook rules (STYLE_LOCK 1a: stakes, one continuous zoom, stamp in the first second, dive by ~6 s, something new every 2-4 s), every `SFX(kind,t)` for map blasts (locked sounds; artillery shots only where visible), the casualty + method cards at each move end, the date scroll. Archive inserts are added by the assembler (`archive.json`, `archive_inserts.json`): leave them alone.
- Grant specifics: quote marks ONLY on verbatim quotes in the script; "Unconditional and immediate surrender" etc. as in the old scene. Ship counters, rivers in flood, snow (m1c) and night mode (m2b) stay.

## Check your work
- `cd grant/scenes/<scene> && hyperframes lint .` then `hyperframes snapshot . --at t1,t2,... -o /tmp/claude-0/-home-user-battle-maps/ccfa5c40-96d1-52e5-b792-b52d5a7ef42f/scratchpad/snap/<scene>` (one frame per beat: every card, hand-over, portrait, first and last frame). Look at them yourself against 2d + C1-C15 and fix before reporting. Make a contact sheet (ImageMagick `montage` or PIL) into `grant/build/sheetW-<scene>.jpg`.
- 4 CPUs shared with other agents: snapshot only the frames you need (`--at`); delete snapshot PNGs you no longer need; keep `scenes/<scene>/` (the main session renders from it). Keep the history cache small: a background loop already deletes /root/.cache/hyperframes/history.
- Report back (short): files changed, snapshot times + sheet path, what you could not do or are unsure about.
