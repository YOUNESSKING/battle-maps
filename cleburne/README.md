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

## Open / known
MASTER_NOTES_PLACEHOLDER
