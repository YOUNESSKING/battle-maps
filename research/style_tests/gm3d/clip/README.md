# GM3D clip: Big Black River in the Grand Maneuver style, in real 3D (EXPERIMENT, free of STYLE_LOCK)

66 s test that puts the three gm3d parts together with our own troops, cut to the gm_test narration
(`../../gm_test/audio/voice.wav`, beats in `cues.js`). ONE paused GSAP timeline drives everything:
`world.update(t)` (camera, light, water, bridge) -> `fx.update(t)` (clouds, smoke, fire, cannon) -> render -> Style W troop boxes,
arrows and place names pinned to the ground with `world.projectMap` -> `O.update(t)` (GM overlay, authored at 1920x1080, scaled 2/3).
Composition 1280x720, 30 fps, software WebGL.

| File | What |
| --- | --- |
| `index.html` | the scene: camera beats, fx placement, troops/arrows/banners, every overlay on its word |
| `cues.js` | narration beats + battle events (gun shots, volleys, fires); the scene AND `assemble.py` read it, so every sound has a visible shot |
| `world.js` | copy of `../world/world.js` ported to three r169 (module, shared with fx), PCF soft shadows, PI-scaled lights, haze, soft round tree crowns, bigger red-roofed close houses, `update(t, {beforeRender})` hook for fx |
| `fx.js` | copy of `../fx/fx.js`: greyer thinner `gm` smoke, crisper cloud edges, fire options (`flameK`, `flameA`, `smokeAlpha/S0/Grow/Wind`), no tan day glow on fire smoke |
| `overlay.js` | copy of `../overlay/overlay.js` + `us`/`cs` sides, ledger rows without stamps (`stamp:false`), lighter night grade (the 3D world lights the night) |
| `bake_clip.py` | copy of `../world/bake_world.py` writing `assets/`: new GM close ground (`gm_fields`: strip fields of rust ploughland, ochre stubble, green and teal meadow, soil blotches, furrows, grass verges, hedgerows on ~30 % of field edges as 3D crowns + lone field trees), bigger Bovina, courtyard farmsteads |
| `assemble.py` | mix (voice, ducked Long Note Two bed, battle ambience on the day battle, cannon/impact/musketry/fire on the cue list) + concat of the chunks |
| `render_chunks.sh` | renders 6 x 11 s chunks (`--start/--end`, 3 workers), purging the HyperFrames history between chunks |
| `make_sheet.py` | `contact_sheet.jpg` (12 frames) + `compare_gm.jpg` (ours vs 6 GM frames; local only, git-ignored) |

Run: `python3 bake_clip.py` (20 s) -> `bash render_chunks.sh <chunkdir>` -> `python3 assemble.py <chunkdir> <out.mp4>` -> `python3 make_sheet.py <out.mp4>`.
The mp4 is not committed (git-ignored).
