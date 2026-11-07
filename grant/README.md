# Grant #16: Style W restyle (v5, 2026-11-07)

The whole video is now in the locked **Style W** look (STYLE_LOCK 2d; reference `reference/style-reference-stylew-tunnelhill.mp4`).
Story, script, plain Kokoro `am_michael` narration (timing identical to v4, 973.9 s), hook beats, casualty/method cards and the Netflix archive inserts are unchanged; the look changed.

## What changed
- **Basemaps** (`*_w.jpg` + `*_w_close.jpg`, `make_style_w.py` green=1 tint=0 mult=1): tennessee, henry, donelson, mississippi, vicksburg, vicksburg_siege, grandgulf, richmond, jamesriver, petersburg.
  The stock generator drew reservoir combs / missing rivers on several of these, so rivers were rebuilt by hand-traced masks:
  `tools/w_rivers.py` + `tools/make_style_w_grant.py` (tennessee, henry, donelson), `tools/stylew_miss/` (mississippi; do NOT re-bake it with the stock command),
  `tools/stylew_m2_rivers.py` (vicksburg_siege, grandgulf), `tools/m3w_rivers.py` + `curated=1` flag in `make_style_w.py` (richmond, jamesriver, petersburg).
  Story ground per map: `assets/src/<map>_story.json`.
- **Scenes**: all 19 `scenes-src/*.js` rewritten onto the Style W kit (portrait cards at units for the whole battle, bare boxes, tags only once spoken, solid thin arrows, no unit flags,
  no legend/scale bar/north arrow, small serif labels, permanent towns, focus wash, ink traces, zoom box, one profile strip per move, smoke, crosses, time-of-day light). No `ref:*` sounds.
- **Territory** = red ink hatching only where ground changes hands (`tools/make_hatch.py`, `make_hatch_poly.py`, layers `assets/media/gn_*`), never at an opening.
- `tools/assemble_full.py`: `m1f` added to `_VIS_ARTY` (its three bluff batteries are visible). Needs `mkdir -p assets/media/sfx_ref` before the first assemble.
- **Process**: each scene went through independent critic agents (1-3 rounds, fix lists applied); look-checks against 2d + C1-C15.

## Rebuild / render / assemble
```
python3 tools/build_scene.py <scene> <map>_w <FIRST> <LAST>   # tags: tools/assemble_full.py SCENES
#  m3d needs: cp assets/richmond_w_close.jpg scenes/m3d/assets/ext_richmond.jpg
#  ending needs ext_mississippi(.jpg/_close.jpg) + ext_richmond(.jpg/_close.jpg) copied from assets/mississippi_w*, richmond_w*
bash tools/render_lean.sh <scene>...        # one at a time, frees assets (disk); ~6 fps
python3 tools/check_sound_lock.py; python3 tools/make_music_bed.py
bash tools/finalize.sh                      # then +0.7 dB through alimiter limit=0.79 level=disabled on build/mix_final.wav and remux
```
Needs `/opt/models/depth_anything_v2_small.onnx`.

## Result
- Master `grant/build/grant.mp4` (1080p, 974.1 s = 16:14, md5 7e86140d36cdef8292870e5de52bb1d9), preview `build/grant-720p.mp4`. Loudness -14.2 LUFS, true peak -1.3 dBFS. NOT uploaded (owner decides).

## Open / known
- Red hatching marks Union-won ground although red is the Confederate colour in this video (2d says red ink hatching): owner call (blue-ink option exists in `make_hatch.py`).
- Accepted as non-blocking: some big cards run >3.5 s where they follow long spoken lines (m1e quotes, ending build-up cards); m1e Floyd/terms captions over Union units; m3d river double-image during the Petersburg->Richmond cross-fade; m2g mid-zoom soft frame; Grant's ending card is on from frame 0; m2f Baker's Creek front line.
- Hook timing (result line at ~16-19 s, dive at ~8 s) is set by the voiced script, not the restyle.
- Scene renders were deleted after assembly where possible; rebuild with the commands above.
