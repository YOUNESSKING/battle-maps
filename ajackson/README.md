# Battle 20: Andrew Jackson's Top 3 Legendary Tactical Moves (3D, finished 2026-11-23)

Master 1080p (14:15, -14.1 LUFS, owner's own voice clone) + 720p preview + PDF publishing guide + thumbnails A/B: **https://gofile.io/d/YkjzrvSY**
(md5 checked on upload). **Use the `_v2` files** (2026-11-24, owner fixes after delivery: no idle units in action shots, no blocks crossing in the night attack, richer wide overhead maps; master md5 54b32f1c3b103ed7996794a9554e94b1). The folder also holds the older cut without `_v2` and two PDFs with the same name: the newer one mentions v2.
Final critics: A (look + troop motion) 5.5 -> 6.8 -> 7.6 -> **8.1**, B (story + sync + sound) 6.8 -> 8.0 -> **8.1**; both "fit to publish" (`critics/`).
RunPod spend for the film ~$1.01 incl. the owner-fix pass (balance $0.996 -> -$0.02, about 2 cents overdrawn; S02 + S08 of v2 rendered on the local CPU); every pod terminated, list verified empty. Decisions: `OWNER_DECISIONS.md`.

Packaging: title A "Andrew Jackson's Top 3 Legendary Tactical Moves | He Won a Battle After the Peace Was Signed" (vidIQ 94), B and C in
`youtube/TITLES.md`; thumbnails `youtube/thumb_A_MAIN_HE_DUG.jpg` (main) + `thumb_B_HE_DUG.jpg` (Test & Compare); description, chapters, tags,
guide `youtube/Jackson-publishing-guide.pdf` (`youtube/make_publish_guide.py`).

## How it was made (reuse for the next 3D film)
1. Research `research/FACT_NOTES_*.md` + `geo_*.json`, script fact-check `research/FACTCHECK_SCRIPT.md`.
2. Script `script.md` -> `tools/narrate.py` (Kokoro am_michael 1.0, name phonemes) -> `tools/words.py` -> owner voice (`tts/convert_voice.py`) ->
   `tools/scene_times.py --all`. Re-voice ONE section without redoing the whole film: `narrate.py am_michael 1.0 S01`, convert that file, `tools/splice_section.py S01`.
3. Worlds: project mode of the Vicksburg baker (`VX_PROJECT=ajackson`, `worlds/README.md`): gulf (z8), neworleans, chalmette (z10), horseshoe (z11).
4. Scenes `sequences/SNN/seq.js` (+ sheet.jpg, NOTES.md with every fix round) -> `vicksburg/tools/make_scene.py` -> `scenes/` (git-ignored).
5. Render: `SCENES_DIR=.../ajackson/scenes vicksburg/tools/render_pod.sh OUT S01 ...` (pod reuse: POD + CTL_TOKEN_FILE; retry on GPU shortage).
6. Sound: `tools/troop_stem.py` (visible musket volleys from the engine's troop events, vicksburg/tools/troop_sfx.py) + `tools/assemble.py` (locked kit, music, -14 LUFS).
7. Critics `CRITIC_BRIEF.md` -> `critics/round{1..4}_{A,B}.md`.

## Lessons
- Musket smoke alone is not a visible shot: the engine now draws a flash on every musket/cannon shot at its exact frame (sound follows only flashes).
- The line-block look needs whole-block about-turns for retreats (`troopsOpts.retreatTurn`) and wide blocks (`depthK`); the men's own about-face is invisible at 720p.
- Battle sound must duck hard under the voice (musket stem -4 dB, 1 - 0.85 x voice envelope) or the narration is masked.
- Dives between regions of different zoom need `dives[].overTo` (else ~1.5 s of empty fog).
- A fleet is never one column: give every ship its own path, spacing and speed (owner).
- RunPod GPUs can be scarce: keep a pod alive and reuse it, or loop the deploy with retries; never leave a pod running.
- Scenes rendered locally (hyperframes 0.9.x) and on the pod (0.8.226) have different timebases: `tools/assemble.py` now normalises fps + timebase per scene before the dissolves.
- Opposing blocks must never touch or swap places: `vicksburg/tools/check_side_gap.mjs`; every unit in an action shot takes part or is framed out (owner).
