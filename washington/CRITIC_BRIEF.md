# Critic brief: George Washington's Top 3 Legendary Tactical Moves (3D, Vicksburg engine)

You are one of TWO independent critics (owner rule: nothing is finished before two critics have reviewed it; fix rounds until both >= 8 or no
longer improving). Be concrete and severe; every finding names the scene, the time (scene-local seconds AND film time), what is wrong and the
exact fix (seq.js value / engine change). Rank by how much it hurts a viewer. Do NOT render, do NOT commit, do NOT edit seq.js (report only).

Inputs
- The assembled film with sound: `/tmp/wx_build/washington_round<N>_720.mp4` (14:20 approx). Per-scene silent renders: `/tmp/wx_render2/S01.mp4` ... `S08.mp4` (round 2+)
  (1280x720). Scene start times in the film: `washington/audio/scenes.json` (A = film start of each scene; the last 0.6 s of a scene dissolves into the next).
- Extract frames with ffmpeg into `/tmp/wx_critic_<you>/` (every 2 s for the overview; 5 fps for troop-motion windows; 2.5x crops of sectors).
- Narration word times: `python3 washington/tools/scene_times.py SNN --words`; script + shot tags `washington/script.md`; direction `washington/SCENES.md`;
  per-scene notes `washington/sequences/SNN/NOTES.md`; facts `washington/research/FACT_NOTES_*.md` + `FACTCHECK_SCRIPT.md`.
- Rules: `research/START_BATTLE_21_WASHINGTON.md` (binding), STYLE_LOCK.md 1a (hook), 1b (engagement), 1c (on-screen text: nothing before its word,
  one big card at a time, artillery/sound only where visible), 1d (script devices). Look references: the finished Vicksburg 3D film's critiques
  `vicksburg/critics/round3_A.md` / `round3_B.md`, the approved troops test notes `vicksburg/critics/troops_v2_notes.md`, GM measurements
  `research/style_tests/gm3d/clip/DETAIL_STUDY.md`, `research/competitors_top20/grand_maneuver/GM_STUDY.md` (GM frames are not on this machine).

Critic A (LOOK + DRIFT + TROOP MOTION): FIRST the drift check: `washington/critics/drift_round<N>.jpg` puts 6 stills of this film next to 6 matching stills of the Jackson v4 film (`ajackson/`); confirm they match (same overlays, type, card styles, grade, clouds, banners, troop look); every difference is a defect unless it is the tested winter ground. Then composition, camera, readability at 720p, clutter, maps/worlds, flashes + smoke, cards/banners vs Grand Maneuver polish
and the Vicksburg film. PLUS a strict 5-fps troop-motion check of every troop shot (owner rules: wide rectangles that move long side first only, never
lengthwise / no columns; stop -> turn in place -> walk straight; retreats = about-face then walk back; no stretching, no collisions, no pops, no
sliding sideways; crossings: break rank gradually, stream, continue). Also run `node vicksburg/tools/check_troops_motion.mjs washington/scenes/SNN 0 D <region>`.
Critic B (STORY + SYNC + SOUND): hook rules (stakes -> zoom -> number + result by ~15 s, a beat every 2-4 s, name slam ~1:00, move 1 by ~2:00),
every on-screen word/card/banner on or after its spoken word, the right picture under each line, the method cards, engagement beats, the ending
(~19 s clean map for the end screen), historical accuracy vs FACT_NOTES, respect (Hessians as soldiers, not caricatures; no 'drunk Hessians' myth; no unsourced quotes), sound: every musket/cannon sound
has a visible flash and vice versa, levels (voice clear, music quiet), no sound over cards without a visible cause.

Write `washington/critics/round<N>_<A|B>.md`: a score 1-10 per scene and overall (10 = GM polish), "fit to publish?" yes/no, then the findings
table (scene | local t | film t | problem | fix | severity 1-3), then the top 10 fixes. Keep it under ~250 lines. Report the scores + top 5 in <= 200 words.
