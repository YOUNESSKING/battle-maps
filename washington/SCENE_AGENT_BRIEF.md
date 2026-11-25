# Scene author brief: Andrew Jackson film (read fully before writing a seq.js)

Read, in order: `research/START_BATTLE_20_JACKSON.md` (owner rules), `ajackson/SCENES.md` (direction + global rules), `ajackson/script.md`
(your sections: text + shot tags = shot list), `vicksburg/engine/README.md` (SEQ schema, helpers, LESSONS), `ajackson/worlds/README.md`
(regions, coordinates, author commands), `vicksburg/sequences/S10_gm/seq.js` (line-block troops example), `ajackson/sequences/_smoke/seq.js`
(dive example in this project), `vicksburg/critics/troops_v2_notes.md` (motion rules, the last sections), `ajackson/research/FACT_NOTES_*.md`
and `ajackson/data/geo.json` (positions; `VX.place(name, region)`). Look at a few Vicksburg film scenes for how the approved film used the
overlays (`vicksburg/sequences/S05`, `S09`, `S12`).

## Timing
`python3 ajackson/tools/scene_times.py SNN --words` = your scene's D and every word in LOCAL time. Scene = `ajackson/sequences/SNN/seq.js`,
D exactly as printed; the last 0.6 s dissolves into the next scene (keep the picture alive there; only S08 fades out at the end).

## Build + check loop
1. Write `ajackson/sequences/SNN/seq.js` (+ small assets in that folder).
2. `python3 vicksburg/tools/make_scene.py ajackson/sequences/SNN` -> `ajackson/scenes/SNN/`.
3. `bash vicksburg/tools/snap.sh ajackson/scenes/SNN <t1,t2,...> /tmp/aj_SNN` (SwiftShader ~5 s/still; the 4-core CPU is shared by 3 authors
   and a voice job: render 8-14 stills at a time). Look at them. Fix. Repeat.
4. `node vicksburg/tools/check_troops_motion.mjs ajackson/scenes/SNN 0 <D> <region>` for each region with troops: fix every flag.
5. Finish with `ajackson/sequences/SNN/sheet.jpg` (16-24 time-stamped stills, <= 2400 px wide, q80) + `NOTES.md` (shot list with times,
   what appears on which word, image sources, open issues).

## Quality bar
Two critics compare frame by frame (look vs Grand Maneuver + the Vicksburg film; story/sync; strict 5-fps troop motion). Camera always moving
slowly, something new every 2-4 s, battles as action, clean screen, readable at 720p, historically right (FACT_NOTES), every on-screen word
spoken first. Keep each scene folder < 25 MB.

## Engine changes
Prefer small, general, backward-compatible additions in `vicksburg/engine/` (other authors work in parallel in the same checkout: re-read a
file right before editing it, keep edits surgical, document them in `vicksburg/engine/README.md` LESSONS, mention them in your report).
Vicksburg scenes must still build unchanged.

## Rules
Model choice: scenes = Opus; helpers Sonnet (search/download/checks) or Haiku (file jobs). Do NOT commit or push (the lead commits). Do not touch
other authors' sequences. Never print secrets. Temp files under /tmp/aj_SNN; delete big temp files when done. Report (<= 300 words): done,
sheet path, engine changes, open issues.
