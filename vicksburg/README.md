# Battle 19: Vicksburg 1863, the first 3D campaign film (finished 2026-11-18)

Master 1080p (18:46, -14.0 LUFS, voice A) + 720p preview + PDF guide + thumbnails: https://gofile.io/d/HLalJHnA (md5 checked).
Final critics (round 3): A (look vs Grand Maneuver) 7.2/10, B (story + sync) 8.0/10, both "fit to publish" (round 1: 4.8 / 6.0).
RunPod spend for the film: ~$0.93 (balance $2.77 -> $1.84). Decisions taken without the owner: `OWNER_DECISIONS.md`.

## How it was made (reuse this for Trenton-Princeton)
1. Research: `research/FACT_NOTES.md`, `GEO.md`, `data/geo.json` (places, roads, rivers, unit positions; `tools/make_geo.py`), fact-check `FACTCHECK_SCRIPT.md`.
2. Script `script.md` (tagged paragraphs) -> `tools/narrate.py` (Kokoro am_michael 0.94) -> `tools/words.py` (faster-whisper word times)
   -> voice A (`tts/convert_voice.py`, ref `tts/voices/test_A_chatterbox.mp3`) -> `tools/scene_times.py --all` (scene windows + 0.6 s dissolve overlap).
3. Worlds: `tools/bake_world.py <region>` from `worlds/configs/*.json` (DEM `tools/fetch_dem.py`; 1863 Mississippi `tools/trace_mississippi1863.py`).
4. Engine `engine/` (README = SEQ schema + LESSONS): one paused GSAP timeline per scene, regions by name, dives, units, banners, overlays, fx, cues.
5. Scenes `sequences/SNN/seq.js` (+ sheet.jpg, NOTES.md with round fixes) -> `tools/make_scene.py` -> `scenes/SNN/` (git-ignored copies).
   QA before every render: `tools/check_paths.js` (water only on bridges), `check_edges.js` (map edge), `check_escapes.js` (bridge fire after
   the last box), `check_arrows.js` / `check_arrows_frame.js`; stills `tools/snap.sh`.
6. Render: `tools/render_all.sh OUT N [scenes]` (N cheap pods, each terminated by its driver; `render_pod.sh`, GPU list <= ~$0.30/h).
7. Critics: `CRITIC_BRIEF.md` -> `critics/round{1,2,3}_{A,B}.md`; fixes via `FIX_BRIEF.md`.
8. Assembly `tools/assemble.py RENDER_DIR OUT.mp4` (dissolves, voice A, act beds, cue sounds, -14 LUFS); previews `tools/preview_scene.py`.
9. Packaging `youtube/` (titles, description, chapters, tags, thumbnails `make_thumbs.py`, guide `make_publish_guide.py`); upload `tools/gofile_upload.py`.

## Lessons
- Owner rules learned here: boxes never rotate (they face the camera), road marches are columns along the road, water only on bridges,
  never across a burning bridge, red = Confederates only (towns weathered brown/slate).
- Check map edges with `check_edges.js` before rendering; a too-small region forces bad cameras (we re-baked `vicksburg` larger).
- Wait loops must not `pgrep -f` a pattern contained in their own command line (it matched itself and never ended).
- 1080p x264 'slow' on the shared 4-core box timed out; 'medium' with a long background timeout works (~45 min for 19 min).
- Free the disk (old renders ~1.7 GB per pass) before the final assembly.
