# Cleburne #14 restyle into STYLE W: brief for scene agents (2026-11-05)

Owner authority for this job: the script, sheets and tests are pre-approved by the owner; the main session decides. Do NOT upload anything,
do NOT commit (the main session commits), do NOT render full scenes (the main session renders). Never edit locked sounds/music/levels.
NEVER show the Confederate battle flag (flags: `FL.us` = US 35-star, `FL.cs` = Confederate First National 13 stars only).

## Read first (in this order)
1. `/home/user/battle-maps/STYLE_LOCK.md` section **2d STYLE W** (the locked look; where older rules conflict, 2d wins) and sections 1a + 1c (hook / on-screen text).
2. `research/style_tests/warhawk/CLEAN_SCREEN_CHECKLIST.txt` (C1-C15) and `CRITIC_NOTES.md` (every owner remark).
3. **The approved model: `cleburne/scenes-src/move1a.js`** (= `reference/style_w/index.html`, Tunnel Hill, owner-approved). Every helper you need is in it:
   the Style W kit (`box` = white serif label with soft shadow, no box; `unit`/`unitS`; solid `arw`; `legend`), the A1/A2 layers (`camera` with the
   **lens transition** wide->close (`#relief2`), `town` = permanent dot + serif name, `lay`/`loss` for `gn_*` hatch layers), BATCH 1
   (`boxP`/`stampP` caps <= 3.5 s, `tagAt` = unit name tag only once spoken, caption cap, legend only when a symbol is new), BATCH 2 (`focus` wash,
   `inkTrace`, `glowPath`/`K.target` overrides -> focus + ink trace, `curveLabel`, `zoomBox`), BATCH 3 (`pinPortrait(id, photo, flag, name, t, until,
   keep=true, side)` = general's portrait card on a stake at HIS unit for the whole battle, `smoke`, `profileStrip` once per move, `crosses`,
   time-of-day `todDiv`). Copy these blocks verbatim into your scene; adapt only places/times.
4. Your scene's current source `cleburne/scenes-src/<scene>.js` (Cleburne v4, owner-approved story, hook and timing: keep the STORY, the beats, the
   cards, the camera story and every `B.at(...)` phrase; change the LOOK).
5. Pipeline: `HANDOVER.md` (lessons) only if stuck.

## Basemaps (Style W)
- Built with `research/style_tests/make_style_w.py` (green=1 tint=0 mult=1 + close=) into `cleburne/assets/<map>_w.jpg` + `<map>_w_close.jpg`
  (+ `<map>_w.json`). `tools/build_scene.py` switches to the Style W template automatically when `<basemap>_close.jpg` exists.
- Build: `cd /home/user/battle-maps/cleburne && python3 tools/build_scene.py <scene> <map>_w <FIRST> <LAST>` (FIRST/LAST from the scene header).
- Story ground (`assets/src/<map>_story.json`, scene css px = map px / 2): `hills` [[x,y,r],...] (first = highest), `ridge` (one polyline or a list of
  polylines; optional `ridge_w` width px default 28, `ridge_h`), `ravine` (one or a list, may be []), `rail` (list of polylines), `tunnel` (optional
  [[x,y],[x,y]]), `fields` (list of polygons). Put ONLY ground the narration names. Example: `research/style_tests/warhawk/tunnel_story.json`.
  Generate: `cd cleburne && python3 ../research/style_tests/make_style_w.py <map> assets/<map>_w.jpg close=assets/<map>_w_close.jpg story=assets/src/<map>_story.json green=1 tint=0 mult=1`
  (needs `assets/media/<map>_det_riv.png` + `_det_rivS.png` + `assets/<map>_hd_lift_plain.jpg`; takes a few minutes; `cp assets/<map>_hd_lift.json assets/<map>_w.json`).
- Territory = RED INK HATCHING only, only at the moment ground changes hands (~3 s, then dissolve), never at the opening, no blue fill:
  `python3 tools/make_hatch.py assets/media/<old>_mx.png assets/media/gn_<map>_ctl_<what>_mx.png assets/<map>_w.jpg [minus=<before>_mx.png]`
  (`minus=` = only the captured patch). Show with `lay("assets/media/gn_....png", on, off)` + opacity tweens like move1a `GCAP`. Wide country/theatre
  views may show who holds what a bit stronger (2d item 3) but still hatching, short, and never at t=0.

## The 2d rules to apply to EVERY shot (checklist for your own pass)
- One green map (no old sand/v11 basemaps, no old multiply territory fills `m1_/m2_/hka_*_mx.png` left on screen; replace with hatching or nothing).
- No flags on units (CSS already hides `.fxk-flag`), no units split into dots/rings (`ringLine` is NOT used), unit name tag only from the spoken name
  (`tagAt`), unspoken units = bare box; groups = one tag.
- Arrows solid and thin (`arw`, width `AW(s, 6..13)`), NO dashed arrows/trails anywhere (remove `dash:` and dotted `trail()`); real moves = thin trail
  that fades ~2 s after arrival.
- Generals: portrait card on a stake at his unit for the whole battle once named (`pinPortrait(..., true)`), side stake when it would cover the fight;
  corner badges only for commanders with no unit on the map (<= 3.5 s, one per person).
- Labels: small white serif + soft shadow, no box (towns 28 px, features 20-24 px); towns the armies head for = permanent `town()`; labels/units step
  out when the camera crops them at the frame edge; flags 48 px behind each side's lines, no country names.
- Clean screen: always on = date scroll + map + units + two small flags. No scale bar, no north arrow, no credit, no source text on cards, legend only
  ~6 s when a symbol is new. One big card at a time (legend/badges step out). Every caption/stamp/passing label <= 3.5 s; captions ~1 per 25 s, only
  for claims to remember; stamps = narrator's own words, cream on dark, on empty ground. Nothing on screen before the narrator says it.
- Map tools: focus wash instead of rings/glows; ink trace along a named feature; zoom box before a dive; one profile strip per move on the terrain
  beat; powder smoke at firing beats; ink crosses where attacks broke; time-of-day light (cool morning, warm 4 PM, night wash).
- Keep: hook rules (STYLE_LOCK 1a: stakes, one continuous zoom, stamp in first second, dive by ~6 s, something new every 2-4 s), every SFX(kind,t)
  call for map blasts (the locked sounds), the casualty + method cards at each move end, the date scroll. Archive inserts are added by the assembler
  (`archive.json`), not in scenes: leave them alone.

## Check your work
- `cd cleburne/scenes/<scene> && hyperframes lint .` then `hyperframes snapshot . --at t1,t2,... -o /tmp/claude-0/-home-user-battle-maps/425685c4-6657-5109-8b39-25dbef768324/scratchpad/snap/<scene>`
  (one frame per beat: every card, every hand-over, every portrait, first and last frame). Look at them yourself against 2d + C1-C15 and fix before
  reporting. Make a contact sheet: `python3 tools/make_sheet.py` if it fits, else any montage (ImageMagick `montage`) into `cleburne/build/sheetW-<scene>.jpg`.
- The machine has 4 CPUs shared with renders: snapshot only the frames you need (`--at`, `--no-end` when not needed); delete snapshot PNGs you no
  longer need; keep `scenes/<scene>/` (the main session renders from it).
- Report back: files changed, the snapshot times + sheet path, what you could not do. Keep the report short.
