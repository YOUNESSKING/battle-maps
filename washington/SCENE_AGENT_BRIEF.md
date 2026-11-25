# Scene author brief: George Washington film (Battle 21) (read fully before writing a seq.js)

Read, in order: `research/START_BATTLE_21_WASHINGTON.md` (owner rules, esp. section 2: copy Jackson, do not drift), `ajackson/OWNER_DECISIONS.md` rows 7-15 + `ajackson/critics/round*_*.md` (mistakes not to repeat), `washington/SCENES.md` (direction + global rules), `washington/script.md`
(your sections: text + shot tags = shot list), `vicksburg/engine/README.md` (SEQ schema, helpers, LESSONS), `washington/worlds/README.md`
(regions, coordinates, author commands), `vicksburg/sequences/S10_gm/seq.js` (line-block troops example), `washington/sequences/_smoke/seq.js`
(dive example in this project), the Jackson scenes `ajackson/sequences/S01`-`S08` (the REFERENCE: copy their overlay calls, cards, banners, camera style, fx settings), `vicksburg/critics/troops_v2_notes.md` (motion rules, the last sections), `washington/research/FACT_NOTES_*.md`
and `washington/data/geo.json` (positions; `VX.place(name, region)`). Look at a few Vicksburg film scenes for how the approved film used the
overlays (`vicksburg/sequences/S05`, `S09`, `S12`).

## Timing
`python3 washington/tools/scene_times.py SNN --words` = your scene's D and every word in LOCAL time. Scene = `washington/sequences/SNN/seq.js`,
D exactly as printed; the last 0.6 s dissolves into the next scene (keep the picture alive there; only S08 fades out at the end).

## Build + check loop
1. Write `washington/sequences/SNN/seq.js` (+ small assets in that folder).
2. `python3 vicksburg/tools/make_scene.py washington/sequences/SNN` -> `washington/scenes/SNN/`.
3. `bash vicksburg/tools/snap.sh washington/scenes/SNN <t1,t2,...> /tmp/wx_SNN` (SwiftShader ~5 s/still; the 4-core CPU is shared by 3 authors
   and a voice job: render 8-14 stills at a time). Look at them. Fix. Repeat.
4. `node vicksburg/tools/check_troops_motion.mjs washington/scenes/SNN 0 <D> <region>` for each region with troops: fix every flag.
5. Finish with `washington/sequences/SNN/sheet.jpg` (16-24 time-stamped stills, <= 2400 px wide, q80) + `NOTES.md` (shot list with times,
   what appears on which word, image sources, open issues).

## Quality bar
Two critics compare frame by frame: critic A checks DRIFT against the Jackson v4 film (same overlays, type, grade, troop look; any difference is a defect except the tested winter ground) + strict 5-fps troop motion; critic B story/sync/sound. Camera always moving
slowly, something new every 2-4 s, battles as action, clean screen, readable at 720p, historically right (FACT_NOTES), every on-screen word
spoken first. Keep each scene folder < 25 MB.

## Engine changes
Prefer small, general, backward-compatible additions in `vicksburg/engine/` (other authors work in parallel in the same checkout: re-read a
file right before editing it, keep edits surgical, document them in `vicksburg/engine/README.md` LESSONS, mention them in your report).
Vicksburg scenes must still build unchanged.

## Rules
Model choice: scenes = Opus; helpers Sonnet (search/download/checks) or Haiku (file jobs). Do NOT commit or push (the lead commits). Do not touch
other authors' sequences. Never print secrets. Temp files under /tmp/wx_SNN; delete big temp files when done. Report (<= 300 words): done,
sheet path, engine changes, open issues.

## Owner fixes from Jackson that apply from the start (binding)
- No idle units in action shots: every unit on screen during a fight takes part, or is framed out.
- No blocks crossing or touching opposing blocks (`node vicksburg/tools/check_side_gap.mjs` if present + `check_troops_motion.mjs`).
- Rich, detailed wide overhead maps (towns, roads, rivers named on their words, units moving).
- Boats and ships are SEPARATE vessels, each its own path, spacing and speed: never one column (Brooklyn evacuation, Delaware crossing).
- Something new every 2-4 s; camera always moving slowly.
- Retreats: stop -> about-face in place (`troopsOpts.retreatTurn`, plan ~7 s hold before a retreat key) -> walk; hold >= 3.3 s between opposite moves.
- Hessians are RED (side `r`), labelled by regiment name (RALL, LOSSBERG, KNYPHAUSEN). No third colour.
- Flags: Grand Union flag `washington/assets/flags/grand_union_flag.png` (US), Union Flag 1707-1801 `washington/assets/flags/gb1707_union_flag.png`.
- Weather only where sourced: rain + NE wind 28-29 Aug and fog at dawn 30 Aug (Brooklyn); snow/sleet/hail storm night 25-26 Dec; frozen roads night 2-3 Jan; otherwise clear winter light.
