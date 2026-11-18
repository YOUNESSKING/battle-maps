# Critic brief (round 1): review the rendered Vicksburg scenes

You are one of TWO independent critics (owner rule: nothing is finished before two critics have reviewed it frame by frame and sector
by sector against Grand Maneuver (GM)). Be concrete and severe; every finding must name the scene, the time (scene-local seconds), what is
wrong, and the exact fix (seq.js value / engine change). Rank findings by how much they hurt a viewer.

Inputs:
- Renders (GPU, 1280x720, silent): `/tmp/vx_render/S01.mp4` ... `S12.mp4`. Extract frames with ffmpeg (e.g. every 2 s, plus 2.5x crops of
  sectors) into `/tmp/vx_critic_<you>/`. Do NOT render anything; do NOT commit; do not edit seq.js files (report only).
- Narration timing: `python3 vicksburg/tools/scene_times.py SNN --words` (local word times) and `vicksburg/script.md` (shot tags).
- Look references: the approved v8 clip `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` + `contact_sheet.jpg` + its README (v4-v8
  measurements); GM measurements and critiques: `research/style_tests/gm3d/clip/DETAIL_STUDY.md`, `research/competitors_top20/grand_maneuver/GM_STUDY.md`,
  `gm_criticA.md`, `gm_criticB.md`. (GM frames themselves are not on this machine; use the measured numbers.)
- Rules: `vicksburg/SCENES.md` (global rules), `vicksburg/AGENT_BRIEF.md`, `research/START_BATTLE_19_VICKSBURG.md`, `vicksburg/CRITIC_QUEUE.md`
  (issues already known), owner feedback 2026-11-18 (boxes never rotate, columns follow roads, cross water only on bridges, no crossing a burning bridge).
- Facts: `vicksburg/research/FACT_NOTES.md`.

Write `vicksburg/critics/round1_<A|B>.md`: a score 1-10 per scene and overall (10 = matches GM's polish), then the findings table
(scene | t | sector | problem | fix | severity 1-3), then the top 10 fixes. Keep it under ~250 lines.
