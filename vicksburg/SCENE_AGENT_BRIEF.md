# Scene author brief (read fully before writing a seq.js)

You build film scenes for "Vicksburg 1863" (~19 min 3D campaign film, Grand Maneuver style, our approved v8 look).
Read, in this order: `vicksburg/AGENT_BRIEF.md` (rules), `vicksburg/engine/README.md` (SEQ schema, helpers, LESSONS),
`vicksburg/SCENES.md` (creative direction per scene + global rules), `vicksburg/script.md` (your sections' text and shot tags),
`vicksburg/sequences/test_v8/seq.js` (a complete working example = the approved clip), `vicksburg/worlds/README.md` (regions, coordinates;
previews in `vicksburg/worlds/previews/`), `vicksburg/data/geo.json` (+ `VX.place(name)`), `vicksburg/research/FACT_NOTES.md` (facts, unit positions).
Look at `research/style_tests/gm3d/clip/contact_sheet.jpg` to see the target look.

## Timing
`python3 vicksburg/tools/scene_times.py SNN --words` prints your scene's duration D and every word in LOCAL scene time.
Scene SNN = `vicksburg/sequences/SNN/seq.js`, D exactly as printed (the last 0.6 s is dissolved into the next scene: keep the picture alive there,
no fade to black unless it is S12's end). Overlays, labels, cards, banners, numbers appear ON or just after their words (never before).
The 3D gold title (S01) must land on its spoken words. Narration and sound are mixed later from `window.CUES`: every gun/volley/fire
you add makes a sound, so only add effects the camera sees.

## Build + check loop
1. Write `vicksburg/sequences/SNN/seq.js` (+ any small assets in that folder: inset images, portraits).
2. `python3 vicksburg/tools/make_scene.py vicksburg/sequences/SNN` -> `vicksburg/scenes/SNN/`.
3. `bash vicksburg/tools/snap.sh SNN <t1,t2,...> /tmp/vx_SNN` renders stills (SwiftShader, ~5 s per still; the CPU is shared with other
   agents + a voice job, so be patient and render ~8-14 stills at a time, not hundreds). Look at them (Read the jpg). Fix. Repeat.
4. Finish with a contact sheet `vicksburg/sequences/SNN/sheet.jpg` (16-24 stills spread over the scene, time-stamped, max ~2400 px wide,
   jpg q80) and a short `vicksburg/sequences/SNN/NOTES.md` (shot list with times, what is shown on which words, sources of images, open issues).

## Quality bar (critics will compare frame by frame with GM and the v8 clip)
- Camera always moving slowly; something new every 2-4 s; one continuous idea per shot; dives only where SCENES.md says.
- Battles shown as action: lines advance in steps, smoke curtains per battalion, gun flashes with plumes, units recoil/rout as road columns,
  captured units grey in place. Unit counts: a division = 4-6 boxes, a brigade = 2-3 boxes on close maps; on the wide map fewer, bigger groups.
- Clean screen: one big card at a time; labels leave after ~3.5 s; no overlapping text; nothing cut by the frame edge.
- Readable at 1280x720: unit boxes not lost in woods (camera framing and tilt), labels not over clouds.
- Historically right: positions from geo.json/FACT_NOTES; dates on the plaque; DAY N on the plaque sub-line from S04 on (DAY 1 = 30 Apr).
- Portraits: available in `vicksburg/engine/assets/generals/`. If you need another (Bowen, Gregg, Loring, Tilghman, Hovey, Logan,
  McClernand, Lawler, Banks, Crocker), fetch a PUBLIC-DOMAIN photo from Wikimedia Commons (Brady/LoC), cut it like the existing ones
  (same size/crop style), save in your sequence folder and pass it via `SEQ.generals`. Paintings/prints for oval insets: public domain
  only (LoC, Harper's Weekly, Commons), credit in the caption ("Library of Congress"). Never use Grand Maneuver frames.
- Keep each scene folder small (< 25 MB incl. world bundles).
- If the engine lacks something you need, prefer a small, general addition to `vicksburg/engine/` (documented in its README LESSONS);
  other authors work in parallel, so keep engine changes backward-compatible and tell the lead in your report.

## Rules
Model choice (owner 2026-11-18): scene authoring = Opus; if you spawn helpers, Sonnet for search/downloads/checks, Haiku for mechanical file jobs.
Do not commit. Do not touch other authors' sequences. Never print secrets. Temp files in /tmp/vx_SNN. Report: what is done, sheet path,
engine changes, open issues.
