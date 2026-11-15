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
- Round 2 (close ground): 9-crop palette incl. dark pasture / ploughed brown / rust, per-field x0.86-1.02 and per-strip +-10 %, crisp dark parcel boundaries (30 %), farm tracks on ~20 % of edges, tree lines on ~30 % of parcel edges, more small woodlots, close grade x(0.88,0.94,1.02): rendered close mean (116,118,100) -> ~(110,112,98) (his 670-950 s avg ~(103,105,96)), b-r -16 -> -10, open-field 16 px block sd 4-6 -> 7.5-15 (his 8-22). Haze 0.78 d .. 2.3 d, #a9b8c1 (~0.45 at the top edge). Bovina 6 cross streets + 2 parallel streets + back-lot infill (houses ~85 -> 171), three hamlets of 22-24 houses (one at the bottom-centre of the battle shots, one top-centre); close houses 140 -> 295, close trees 46k -> 51k.
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

**v6 grade + battle FX (2026-11-15, critics v5: B 1, 5, 6, 8, 9, 10, 13, 14; A 2, 10, 12):**
- Grade (`gradeAt` in `index.html`, per region / night): saturation 0.92 close / 0.95 wide / 0.95 night, per-channel tables (toe +4 / +11 / +2, S 0.14 / 0.10 / 0, blue +7 / +4 / +5 at mid), a `#veil` over the 3D image toward (150,160,165) growing with depth (15 % top -> 4 % bottom close), no warm day push (`overlay.js` GW.day 0). Final graded frames, central 700x450: close chroma 22-25.5 (his 21-29), b-g -11..-14 (his -3..-16), mean (112,110,97) at 26 s (his 670 s (115,112,99)), dark share 0.07-0.14 (his 0.11-0.15), p5 62-67 (his 58-60); wide 6 s chroma 17 (his 16-17.5), mean (88,95,81) (his (90,96,84)), darkest 5 % (29,38,40) (his (34,47,41)); night 50 s mean (39,51,55), p5 19 (his (21-50, 35-64, 44-68), p5 21-31).
- Musketry: neutral grey curtain (unlit sRGB ~(150,153,157)), alpha 0.27, 1.5x wider, rate x1.8, turbulence /2. Cannon: flash 3x, orange, no ground light, plume jets 0.7-1.5 units. Battery: 3x flash, 4 frames, glow on the water. Night roads darkened by the night factor (ground patch). Bridge smoke rises 1.6x, leans, fades from 15 % of its life (no flat cap); wide bridge smoke = thin dark column. Arrows: desaturated (#4f73c0 / #b8574c), 0.75x width; next-day arrows end 0.75 units short of the river (pontoons visible). Grant's card moved above-right of his flag.
- `TAG=v6 python3 make_battle_sectors.py <snapshots>` -> `battle_sectors_v6.jpg` (local) + `battle_ours_v6.jpg`.

**v5 battle FX, troops, night, ending, grade (2026-11-15, critic B 4-7, 9, 16, 17; critic A 3, 10; `fx.js` smoke/fire/cannon/impact, `index.html` 22-66 s + grade, `overlay.js`, `troops3d.js`):**
- Smoke (B4): `LOOKS.gm` = sprite mode 4.x "curtain": UNLIT cool grey (tint lin (0.205,0.23,0.262)), soft Gaussian body, stretched x1.6 vertically, slow sideways drift, fogged (all sprites now take the scene fog). Rendered over his fields ~(135,125,108) vs his (119,114,104) (was cream (166,160,149)).
- Cannon (B7): 0.095 s orange flash (2 frames at 30 fps, measured), small orange ground pool (was a 45-unit yellow-green light), 14-puff grey curtain plume jetting ~1 box length, life ~9 s. GM itself shows no muzzle flashes (orange-pixel scan of 500-955 s).
- Fire (B6): `tongues` = separate flame seats with their own flicker, `flameColor`/`glowColor` options; bridge flames peak (248,196,96), no white (was (250,243,233) slab); dark grey column, rise 36, wind 1.1.
- Troops/arrows (B5): Style W boxes + arrows drawn IN the close scene (`createBoxes3D`, `createArrows3D`: fogged, smoke and clouds draw over the boxes, arrows over the smoke as in his 684 s, soft contact shadow, set before the frame renders). `?troops=dom` = old DOM boxes. Deterministic push-apart between units (B16); day-battle brigades no longer stack by the bridge; next day ONE 4-box column per pontoon bridge (world `pontoons`), along its axis, arrows too.
- Night (B9): camera tilt 52/56 from vertical (was 44/46); 40 campfires in camps (small orange dots like his 187 s); battery flashes 2x size + 0.15 s orange glow on the water; boats with hull, house, stacks, deck lamp, moonlit wake.
- Ending (B17): camera settles at 64.6 s, HUD out at 63.9-64.4, world fades 64.95-65.95.
- Grade (A3/A10): the overlay's day grade / paper / grain / vignette live in an untransformed `#film` host (`filmHost`): inside the 2/3-scaled overlay their blend modes only saw the overlay's own group and rendered as flat veils (+40-60 on the darks). Plaques/HUD above them (paper (222,213,184), his (227,217,193); was (162,156,135)). `#gmgrade` levels 10-248 + 15 % S on the 3D image only, `?grade=0` for raw; darks never above the raw world; grain 0.04.
- Blocks option: shadows 0.95 block long, 0.84 dark (were 0.55 / 0.72).
- `make_battle_sectors.py <snapshot dir>` -> `battle_sectors_v5.jpg` (his | ours, local) + `battle_ours_v5.jpg`.

**v5 clouds + dive (2026-11-15, critic A 1-2, 4-9, 11-13; `fx.js` vclouds, `index.html` 0-22 s):**
- Texture: interleaved-gradient jitter + a 3x3 bilinear tent (~5x5 texels) on the premultiplied cloud target (alpha-weighted blur), no fine octave
  (`fine: 0`), rim tearing from the mid Worley octave (`weights`), big soft interior mottles; per-group multipliers (`group0`: smoother wide lobes).
- Colour/shadow: wide sun (1.0,0.95,0.85), ambient top (0.55,0.60,0.70) / bottom (0.30,0.34,0.42), ambK 0.25, lightK 2.4; shadows 0.8 cast down-left
  next to each cloud (`shadowDir` [0.3,1,0.65]). Wide cloud pixels (L>165) ~(193,186,170), p50 180 vs his (196-203,193-197,171-176), p50 188-191;
  grey-core fraction 0.067 vs his 0.065-0.105.
- Layout: rejection-sampled scatter, log-normal radii 12-85, clusters + clear areas, 4 big near-lens corner clouds, the deck footprint kept to the deck.
- Deck: flat sheets (`flatPow` 0.3, one flat base), no billow-up: a coverage FRONT (`deck(t)`) sweeps from the frame edges in to the camera's column
  while the density ramps up from translucent grey (`k`); neutral-cool tint during the deck (~(198,195,186) vs his (198,201,194) at full cover).
- Camera: one cubic ease-in from 12.6 s (dist 545 -> 115, tilt 44 -> 11) into the deck, then on at the same log-speed through the tops to the swap
  (16.4); close landing eases out over 3.4 s (to 19.8).
- Title: "ONE DAY", Cormorant 700, painted bevel face, 40 silhouette layers shaded gold x0.75 -> x0.45 (no contour rings), shadow on the map,
  motion-blur ghosts from sub-frame camera poses while it flies past the lens (~14.3 s).
- White-out: no veil until 16.05 (textured cloud tops, std 5.5 at 16.15 vs his 7.9), close map ghost at the swap, cream with a radial falloff
  (centre (217,215,202), edges (197,196,182), corner (186,184,170); his (215-218,215,203) / (192-197) / (191)), snap 17.25 -> 17.55 (mean L 203 -> 172).
- HUD: legend (1.9 s) + timeline (1.4 s) stay through the dive, date plaque -> clock inside the white (16.45), Grant card fades in in the cream.
- Emergence: flat torn grey stratus sheets (close system, tops ~22-26) just under the landing camera, ~50 % cover at 17.4, torn by ~20.6.
- Night: half the wide clouds eroded, flat grey-blue wisps around Vicksburg, night tint (0.12-0.40 blue-grey).
- Tools: `TAG=_v5 python3 make_dive.py <snapshot dir | mp4>` -> `dive_ours_v5.jpg`; `TAG=_v5 python3 make_sectors.py <dir>` -> `dive_sectors_v5.jpg` (local).

**v6 clouds (2026-11-15, critic A round 2):** the 3D title renders in its own pass after map + clouds (depth cleared) so nothing draws over it,
and pinned names under its screen box fade out; pinned names are dimmed by the cloud alpha under them (`fx.cloudAlphaAt`, 1-px readback of the
cloud target). Composite blur is edge-aware (full blur only on fringes, `sharp`), the mid octave is back (`fine` 0.12). Wide: Poisson clusters of
2-5 clouds (log-normal sigma 0.6), 3 big near-lens corner masses, deeper cores (lightK 3.2, ambK 0.18, sun (1,.95,.85) x1.4), shadow 0.75,
clusters kept off the night frame (only the flat wisps there). Deck opacity ramps from 0 at 14.7 s (no pop). Emergence: 10 torn flat sheets
(tops ~19-24, ~1.5x ground parallax), lit tops + grey-blue cores, clear off the troop line after ~18.2 s; camera exits at ~1/3 of the dive
log-speed (keys SW dist 93 -> 17.25 dist 61 lin -> 19.75 dist 40 cubic out); fog snaps 17.2-17.65. Sheets: `dive_ours_v6.jpg`, `dive_sectors_v6.jpg` (local).

Run: `python3 bake_clip.py` (20 s) -> `bash render_chunks.sh <chunkdir>` -> `python3 assemble.py <chunkdir> <out.mp4>` -> `python3 make_sheet.py <out.mp4>`.
The mp4 is not committed (git-ignored).
