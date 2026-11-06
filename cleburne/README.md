# Cleburne #14: Style W restyle (v5, 2026-11-06)

The whole video is now in the locked **Style W** look (STYLE_LOCK 2d; reference `reference/style-reference-stylew-tunnelhill.mp4`).
Story, script, narration (plain Kokoro `am_michael`), hook beats, cards and the Netflix archive inserts are unchanged from v4; the look changed.

## What changed
- **Basemaps** (all `research/style_tests/make_style_w.py ... green=1 tint=0 mult=1 close=...`): `ga_w`, `chatt_w`, `tunnel_w` (the approved
  reference map), `tunnelbg_w` (bg-a: tunnel geography + Lookout Mountain), `ringgold_w`, `pickett_w`, `corridor_w`, each with a `_close` twin.
  Story ground per battle map in `assets/src/<map>_story.json` (Taylor's Ridge + gap + railroad; Pickett's Mill ravine + ridges; Tunnel Hill).
  River data cleaned by hand where the 2021 data showed modern reservoirs (Chickamauga Lake, Allatoona Lake) or blobs:
  `chatt_w` was made with `tools/stylew_chatt/` (do NOT re-run the stock generator on chatt), corridor/ringgold det layers edited in place.
- **Generator** `research/style_tests/make_style_w.py` generalised: ridge/ravine may be lists, tunnel/hills/rail/fields optional.
- **Build**: `tools/build_scene.py` uses `tools/scene_template_w.html` (lens cross-fade, no credit, no unit flags) when `assets/<basemap>_close.jpg` exists.
  Scenes: hook-a/hook-b/move2b/move2c `ringgold_w`, bg-a `tunnelbg_w`, move1a/move1e `tunnel_w`, move2a/ending `chatt_w`, move3a `corridor_w`, move3b `pickett_w`.
- **Territory** = red ink hatching only where ground changes hands (`tools/make_hatch.py`, layers `assets/media/gn_*`), never at the opening.
- **Every scene** (2d rules): clean screen (no legend/scale bar/north arrow/credit), units without flags, tags only once spoken, solid thin arrows,
  generals' portrait cards on stakes at their units for the whole battle, level cream-on-dark stamps <= 3.5 s with the narrator's words only,
  no source lines on cards, casualty figures only as spoken, focus wash / ink traces / zoom box / profile strip / smoke / crosses / time-of-day.
- **Process**: every scene passed two independent critic agents (both YES) on full snapshot sets before rendering (up to 5 rounds).

## Rebuild / render / assemble
```
python3 tools/build_scene.py <scene> <map>_w <FIRST> <LAST>        # or: bash tools/render_all.sh "<scene> <map>_w FIRST LAST" ...
python3 tools/check_sound_lock.py                                   # wavs are git-ignored: cp -rn ../goosegreen/assets/media/sfx/. assets/media/sfx/
python3 tools/make_music_bed.py                                     # music.wav (git-ignored)
bash tools/finalize.sh                                              # 1080p master + 720p preview, ~-14 LUFS
```
Needs `/opt/models/depth_anything_v2_small.onnx` (huggingface onnx-community/depth-anything-v2-small, onnx/model.onnx) + `pip install onnxruntime opencv-python-headless scikit-image rasterio`.

## v6 (2026-11-06): voice A (owner request)
Same video as v5 with the narration switched to **voice A** (Chatterbox conversion of the same Kokoro take, reference
`tts/voices/test_A_chatterbox.mp3` because `owner_ref.wav` is missing): `tts/convert_voice.py audio/voice.wav ... audio/voice_owner.wav`
(~23 min), `tools/assemble_full.py --audio-only` (+ `--preview`), finalize's +11.8 dB/limiter step, then -1.2 dB on `build/mix_final.wav`
(voice A came out at -12.8) and a remux. Result: `build/cleburne-v6-voiceA.mp4` (+ `-720p`), 14:26, -14.0 LUFS, true peak -2.5 dBFS,
md5 ce35f375d4e88ab2badbb106d90aa119. Timing identical (866.18 s), no re-render. v5 (plain Kokoro) kept as `build/cleburne-v5-kokoro*.mp4`.

## Open / known
- Master uploaded 2026-11-06: https://gofile.io/d/hWMzEbha (1080p + 720p preview). Local: `cleburne/build/cleburne.mp4` (1080p, 14:26 = 866.2 s, 394 MB, md5 a4336f0fe7a49a562d5ce44341ae3ecd)
  + preview `cleburne/build/cleburne-720p.mp4`. Loudness -14.1 LUFS integrated, true peak -1.3 dBFS (finalize.sh came out at -14.4;
  `build/mix_final.wav` + 0.7 dB through `alimiter limit=0.79 level=disabled`, remuxed).
- Scene renders and `build/seg` were deleted after assembly to save disk (rebuild with `render_all.sh`, ~2.5 h on 4 CPUs).
- Small items both critics accepted as non-blocking: bg-a Howard corner badge ~4.5 s (badge limit 4 s), move2a tiny "Dalton" label, two items just
  under the 2 s minimum because of short narration gaps (bg-a Hooker badge 1.7 s, ending Stonewall Jackson card 1.9 s); move3a close-ups are mostly
  plain turf with one drawn wood (no creek in the source data); move3b carries ~8 text items at its busiest beat because every named general's
  card stays up (owner rule 2d.6 outranks the C4 count); the move3a -> move3b and move2b -> move2c cuts are hard cuts between framings (as in v4).
- No Granbury photo exists in assets: he gets a name tag only.
- Thumbnails / title / description unchanged from v4 (`cleburne/youtube/`).
