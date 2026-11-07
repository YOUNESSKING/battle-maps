# Grant #16: Style W restyle (v3, 2026-11-07)

The whole video is now in the locked **Style W** look (STYLE_LOCK 2d; reference `reference/style-reference-stylew-tunnelhill.mp4`), same
process as Cleburne v5. Story, script, narration (plain Kokoro `am_michael`, `audio/voice.wav`), hook beats, cards and the Netflix archive
inserts are unchanged from v2 (https://gofile.io/d/bZlvwa4F); only the look changed.

## What changed
- **Basemaps** (`research/style_tests/make_style_w.py ... green=1 tint=0 mult=1 close=...`): `donelson_w`, `henry_w`, `tennessee_w`,
  `vicksburg_w`, `vicksburg_siege_w`, `mississippi_w`, `grandgulf_w`, `richmond_w`, `jamesriver_w`, `petersburg_w`, each with a `_close` twin.
  Story ground per map in `assets/src/<map>_story.json`; helper scripts in `tools/stylew_ten/`, `tools/stylew_vk/`, `tools/stylew_m3/`.
- **Builders** (Style W head + lens cross-fade): hooks `tools/gh_inline.py` (+ `gh_kitw.js`), move 1 `tools/m1_build.py` (+ `m1_kit.js`),
  move 2 `tools/vk_inline.py` / `vx_inline.py` (+ `vk_kit.js` / `vx_kit.js`), move 3 + ending `tools/m3_build.py` (+ `m3_kitw.js`);
  commands in `STYLEW_BRIEF.md` and the session notes. Assets are hard-linked (`tools/_linkcopy.py`): never edit files in `scenes/<s>/assets/`.
- **Territory** = ink hatching only where ground changes hands, in the colour of the side that TAKES it (Union = blue, `tools/make_hatch.py side=blue`),
  kept >= 19 px off water and woods (move 2: `tools/stylew_vk/hatch_clean.py`), never at the opening.
- **Every scene** (2d rules): clean screen, units without flags, tags only once spoken, thin solid trails, generals' portrait cards on stakes at their
  units for the whole battle, cream-on-dark stamps <= 3.5 s with the narrator's words, one stamp at a time, date scroll always filled, both side flags
  always on screen (m1d slides the US flag instead of hiding it under the scroll), counters under the date scroll step out.
- **Process**: all 20 scenes passed two independent critic agents (both YES) on full snapshot sets before rendering (up to 16 rounds for move 1/2).
  A strict "// comment trap" check (`tools/stylew_vk/trapcheck.py`) caught several lines of code silently disabled by a comment typed before them.

## Master
`build/grant.mp4` (1080p, 16:14 = 974.1 s, md5 30db202f4f9d6c27eccc265c89e4161f) + `build/grant-720p.mp4`. Loudness -14.1 LUFS integrated, true peak -1.2 dBFS
(finalize.sh gave -14.5; +0.5 dB and +0.3 dB on `build/mix_final.wav` through `alimiter level=disabled`, remuxed). Not uploaded yet (owner decides).
Scene renders deleted after assembly to save disk (rebuild: `cd scenes/<s> && hyperframes render . -o renders/<s>.mp4`).

## Rebuild notes
- Before assembly: `cp -rn ../goosegreen/assets/media/sfx/. assets/media/sfx/` (wavs are git-ignored; then `python3 tools/check_sound_lock.py`),
  `python3 tools/make_music_bed.py`, `mkdir -p assets/media/sfx_ref` (ref_sounds.py writes there; the synthesised ref sounds stay OFF unless
  REF_SOUNDS=1), depth model `/opt/models/depth_anything_v2_small.onnx`. Then `bash tools/finalize.sh` (detached; ~1 h).
- Non-blocking items both critics accepted: m2b yawl icons ~10 px from Porter's card at 28 s; m2e Banks's fading trail within 40 px of the bottom
  edge at 12 s; m2f Vicksburg dot ~8 px from a red box at 81-85 s; m1d blue hatch close to a wood patch at 31.5 s; m2g caption end over the fading front at 6.5 s.
- Packaging (titles/thumbnails/description) unchanged from v2 (`grant/youtube/` and the v2 PDF).
