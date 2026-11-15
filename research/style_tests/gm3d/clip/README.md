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
| `make_cloud_noise.py` | offline 3D cloud noise (`cloudtex/noise128.bin`) for `fx.vclouds` |
| `make_sectors.py` | `dive_sectors.jpg`: his vs ours dive, phase by phase, 4 sectors each at 2.5x (local only, git-ignored) |
| `make_dive.py` | `dive_ours.jpg` (12 frames of our dive) + `dive_compare.jpg` (his 636 s dive vs ours, phase-matched; local only, git-ignored) |
| `make_sheet.py` | `contact_sheet.jpg` (12 frames) + `compare_gm.jpg` (ours vs 6 GM frames; local only, git-ignored) |

**v3 (2026-11-15): the GM cloud dive + detail study** (`DETAIL_STUDY.md`: all 619 GM frames classified, every cloud transition found,
the four wide->battlefield dives measured at 15 fps, region-by-region tables). The dive (`DV` in `index.html`, 11.3-18.7 s) is built from what
his dives share: push-in under the floating 3D gold title (world space, extruded, casts its shadow on the map, flies past the lens) ->
sprite cumulus deck (`fx.cumulus`: lobed cloud atlas, darker lower lobes, one shadow per cloud on the ground) pops in at 14.85 and fills the
frame by ~15.4 -> cool off-white 15.6-16.35 (cut to the close map at 16.4 inside it) -> warm cream with dark wisps 16.35-17.2 ->
battlefield snaps in 17.2-17.6, haze gone by 18.7. Also: courtyard farmsteads (no more red crosses), wider browner roads, bigger bluer
musketry smoke, finer grain. `make_dive.py <mp4>` writes `dive_ours.jpg` (+ `dive_compare.jpg`, local only).

**v4 terrain (2026-11-15, world.js / bake_clip.py / assets): camera, haze, ground, woods, towns** (measured on GM 640-700, 780-820, 910-950 s close and 290-1140 s wide; sector-by-sector crops with `make_ground_sectors.py <snapshot dir>` -> `ground_sectors.jpg` (local, git-ignored) + `ground_ours.jpg`).
- Close camera: tilt 38-44 -> **50-54 deg from vertical, fov 32 -> 30** (keys p3-0.5 .. D in `index.html`; his scale gradient top/bottom ~2:1 = 50-52 deg at fov 30). Dive keys untouched; tilt eases 38 -> 50 over 18.6-27.7 s.
- Haze: close fog = smoothstep over view depth **0.85 d .. 2.6 d**, colour **#b2bec4** (pale sky blue-grey) -> ~0 at frame centre, ~0.3 at the top edge; the emergence fog in `index.html` now lands on these values.
- Ground: close fields in his k-means palette (olive / ochre / grey-green, rendered median ~(120,117,99) vs his (121,119,95)), soft edges, big damp mottles, visible strips, faint furrows, pale verges, river floodplain; wide map green-grey-olive (rendered pre-cooled x(0.78,0.85,0.88) -> his ~(84,93,77)), many small woods everywhere, baked multi-scale slope/aspect relief with pale sunlit valley sides.
- Woods: ~3 m canopy blanket raised under every wood + crown clusters (2-4 lumpy merged lobes, 4 variants, log-normal sizes, teal/olive jitter) half sunk in it, jagged outline + clearings; wide map has no instanced crowns any more. Hedgerows on ~15 % of parcel edges as continuous lines (dark under-canopy band + crowns every 0.075 units, gaps in runs).
- Towns: Bovina = main street + link to the Vicksburg road + 4 cross streets + 2 back lanes, packed row houses both sides (gable-on mixed in), sheds, back gardens, church + tower, 7 roof colours; 14 farmsteads = house + barn + 2-4 sheds round a yard, garden, orchard. Close houses 105 -> 140, close trees 25.6k -> ~46k (wide 889 -> 0).

**Troops option (2026-11-15): GM 3D formation blocks** (`troops3d.js`, switch `window.TROOPS = 'boxes' | 'blocks'` or `index.html?troops=blocks`; default `boxes`,
our Style W boxes untouched). Built from the same `UNITS` (keys, face, n, cap) and pure in t. Measured from his close battlefields (515, 682-700, 925 s, 2-6x crops):
each battalion = flat plate in the side colour (Union #2f5bc0, Confederate #b23a2c) with a pale rim, wider on the front edge, carrying 60 tiny 3D soldiers
(coat in the side colour, pale trousers/belts/face, dark musket; Confederates grey coats); 12 files x 5 ranks in line (block ~2.4:1, ~4 % of frame width), 4 files x 15
on the march (column turns along its road on moves > ~6 units or `u.march`), short moves forward = advance in line with a step bob, short moves backward = routing
(men turn, ranks scatter, plate shrinks, colours drop), captured = grey + scattered; guns = side-coloured carriage + barrel + wheels, limber behind (ahead when limbered),
4 crew, recoil on each cue shot; options `form:'square'` (hollow plate, dark inner court, men on the four faces) and `type:'cav'` (2 ranks of riders);
low-sun shadow = the block footprint swept along the sun (multiply quads) on top of the real shadow map; blocks never overlap (deterministic push-apart);
smoke draws over them. Infantry merges 2 boxes into 1 block (GM has ~half as many, ~2x bigger blocks). Cost: +~1.5 ms JS + ~0.2 M triangles per frame.
`troops_ours.jpg` = boxes vs blocks at 22 / 31.5 / 35.2 / 60.5 s (2x); `troops_sectors.jpg` (his vs ours, 3x) is local only (git-ignored).

**v4 (2026-11-15): true volumetric clouds** (owner on v3: "The clouds are off. They look fake."). `fx.vclouds` replaces the sprite cumulus:
- **Raymarched volume** over an offline, tileable 128^3 RGBA8 noise volume (`make_cloud_noise.py` -> `cloudtex/noise128.bin`, numpy, deterministic):
  R Perlin-Worley, G inverted Worley fbm 4/8/16, B inverted Worley fbm 8/16/32, A Perlin fbm (domain warp).
- **Shape** = a 2D cloud map built at load from the cloud list (each cloud = main dome + 5 satellite domes, lumpy outline; R top, G base, B group,
  A horizontal distance for empty-space skipping) -> slope-corrected signed distance below the dome, displaced by the noise (big Perlin-Worley lumps,
  Worley billows at two scales, a fine octave near the lens), domain-warped, soft-clamped (translucent fringes), torn wispy rims, mottled interior.
  Group 1 (the dive deck / the close deck) has its own erosion curve (`erode(t)`): the deck billows up 14.6-15.2, the close deck tears into remnants 16.4-21.5.
- **Lighting**: 6-tap jittered light march toward the sun (self-shadowed creases, grey-blue undersides), Beer + two-octave multiple scattering
  (`ms(t)` rises inside the cloud -> bright grey-white interior), powder term, dual-lobe Henyey-Greenstein phase, height-graded sky/ground ambient with
  depth occlusion, scene-fog aerial haze. **Ground shadows** from the same density (3 samples along a steep shadow direction, `shadowDir`).
- **Cost** (SwiftShader, 4 cores): cloud pass at 0.7 x resolution, bilinear premultiplied upsample, white-noise jitter, <= 260 steps with map-distance
  skipping; only the current region's system marches; close system off after 21.6 s (its battle shadows come from the old shadow-only noise layer).
- **White-out**: no oval (the overlay vignette fades out inside the cloud, flat cool veil (208,211,204), near-flat warm cream (218,215,202) -> (211,208,193)),
  film grain 0.08 -> 0.03 inside; the cool phase is the real cloud interior; DOM wisps removed (the real close deck tears past instead).
- Camera: dive key at 15.2 s now dist 160 (was 122) so the deck is seen from above before the camera sinks into its tops at ~16.0 s.
- Method: `make_sectors.py <snapshot dir | mp4>` -> `dive_sectors.jpg` (local, git-ignored): 6 phases x 4 sectors, his | ours at 2.5x.
  `TAG=_v4 OFFSET=0 python3 make_dive.py <mp4>` -> `dive_ours_v4.jpg` (+ `dive_compare_v4.jpg`, local).

Run: `python3 bake_clip.py` (20 s) -> `bash render_chunks.sh <chunkdir>` -> `python3 assemble.py <chunkdir> <out.mp4>` -> `python3 make_sheet.py <out.mp4>`.
The mp4 is not committed (git-ignored).
