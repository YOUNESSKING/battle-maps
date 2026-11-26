# Battle 21: George Washington's Top 3 Legendary Tactical Moves (3D, finished 2026-11-26)

The Andrew Jackson v4 pipeline (`ajackson/`) copied with new content: Brooklyn (29-30 Aug 1776), the Christmas crossing + Trenton (25-26 Dec 1776),
the Assunpink + the night march to Princeton (2-3 Jan 1777). 12:53, -14.0 LUFS, the owner's voice clone. Decisions: `OWNER_DECISIONS.md`.
Delivery (Gofile link, files, md5) at the end of this file.

Final critics (`critics/`): A (look + drift vs Jackson v4 / the approved 3D tests + troop motion) 5.8 -> 7.0 -> 7.4 -> 7.8* -> 7.9 -> **8.0**,
B (story + sync + sound) 7.3 -> 7.9 -> 8.2 -> 8.5 -> 8.6 -> **8.7**; both "fit to publish". (*round 4 judged on content: an RTX A4500 pod broke 4 renders.)
Drift sheets `critics/drift_round1..6.jpg` (this film | Jackson v4 | approved test).
RunPod for the film ~$1.14 (balance $9.98 -> $8.85); every pod terminated, list verified empty.

Packaging `youtube/`: title A "George Washington's Top 3 Legendary Tactical Moves | How He Kept the Revolution Alive" (vidIQ 88), B, C in
`TITLES.md`; word HE SNUCK OUT.; thumbnails `thumb_A_MAIN_HE_SNUCK_OUT.jpg` + `thumb_B_HE_SNUCK_OUT.jpg` (2 harsh critics: `THUMB_CRITIC_1/2.md`);
`DESCRIPTION.md`, `CHAPTERS.txt`, `TAGS.txt`, guide `Washington-publishing-guide.pdf` (`make_publish_guide.py`).

## How it was made
1. Research `research/FACT_NOTES_brooklyn.md` + `FACT_NOTES_jersey.md` + geo json; fact-check `research/FACTCHECK_SCRIPT.md`.
2. `script.md` -> `tools/narrate.py` (Kokoro am_michael 1.0) -> `tools/words.py` -> `tts/convert_voice.py` (owner clone) -> `tools/scene_times.py --all`;
   one section re-voiced with `tools/splice_section.py S01`.
3. Worlds (`worlds/README.md`, `VX_PROJECT=washington`): colonies (z9) + colonieswinter, jersey (z10 winter), brooklyn, crossing (z12 winter), trenton,
   princeton. Winter = `"season": "winter"` (the only new look element, tested vs Jackson: `worlds/previews/winter_test.jpg`).
4. Scenes `sequences/SNN/seq.js` (+ NOTES.md with every round) -> `vicksburg/tools/make_scene.py`.
5. Render on RunPod (`vicksburg/tools/render_pod.sh`, GPU list without RTX A4500) + `tools/render_qa.py` (flat-frame gate) + `tools/drift_sheet.py`.
6. Sound `tools/troop_stem.py` (TROOP_SHOTS = Jackson's flintlock set) + `tools/assemble.py` (Jackson v4 levels, -14 LUFS).

## Lessons
- Any overlay tween at a NEGATIVE time shifts the whole GSAP timeline, 3D clock included: every fx flash renders late (S07 was 0.37 s late). Use
  `engage.decide({ instant: true })` for a card that must be on at t 0.
- RTX A4500 community pods drew flat grey ellipses over 40-58 % of frames (twice); local and A5000/3090 renders were clean. Gate every render with
  `tools/render_qa.py` and keep A4500 off the list.
- Small wide maps need `clouds.<region>.diveClear` (default 118 units clears almost a 220-unit map) and an explicit scatter box.
- Wide maps: low exag (2-3), `wideSunK` 0.15, woods as large masses along valleys (`wide_near_k`, `wide_slope_k`), canopy speckle at scene distance,
  flattened/feathered field patches, the opt-in `detail` layer: otherwise they read as camouflage next to Jackson's wide maps.
- `troop_sfx`: unit ids repeat between scenes: pair stream start/end events within one scene only.
- Background jobs must be detached (`setsid nohup`), or a finished shell kills them mid-run.

## Delivery (2026-11-26)
Gofile: **https://gofile.io/d/9Fe1zD3P** (md5 checked against the server on upload)
- `Washington-Top3-1080p.mp4` master 1920x1080, 12:53, -14.0 LUFS, md5 56f48c09341e543043986b6566511cd5
- `Washington-Top3-720p-preview.mp4` md5 6d086b9a52c57d9cb199cb279320c1ea
- `Washington-publishing-guide.pdf`, `thumb_A_MAIN_HE_SNUCK_OUT.jpg`, `thumb_B_HE_SNUCK_OUT.jpg`
Publish around 19-22 December (the Trenton anniversary is 25-26 Dec), or earlier if the channel is hot.
