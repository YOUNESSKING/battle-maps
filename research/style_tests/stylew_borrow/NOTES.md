# Style W + borrowed 3D elements: 1-minute TEST (2026-11-27)

Owner decision (2026-11-27): back to the 2D Style W main style (STYLE_LOCK 2d/2e/2f), but BORROW elements from our 3D films
(`vicksburg/engine/`, approved looks `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` + `gm3d_clip_v6_share.mp4`).
Where a borrowed element overlaps one of ours, the borrowed one REPLACES ours. Everything else stays locked Style W.
**This is a test: nothing here is in STYLE_LOCK yet; apply only after the owner approves.**

- `stylew_borrow_test_share.mp4` (r1): 62.7 s, 1920x1080, 19 MB, -14.0 LUFS (TP -1.4). Four windows of the published Marion #18, same voice (voice A) and words:
  film 0:00.0-0:17.8 (hook-1/2: dive, watch, guard's muskets) | 0:56.35-0:58.85 (name slam) | 1:11.45-1:15.85 (title) |
  13:21.5-13:59.5 (move 3, Parker's Ferry: date + seal, ambush volleys, result list). Joins = 0.08 s fades.
- `sheet.jpg`: 9 matched moments, published Marion (left, side key burned in as in the film) | this test (right).
- **r2 (critics A 6/10, B 5/10):** `stylew_borrow_test_r2_share.mp4` (63.8 s, 20 MB, -14.0 LUFS; same windows, the name window now runs to 0:59.95 so the
  caption follows the gold slam) + `sheet_r2.jpg` (published | r1 | r2). r1 files are kept for comparison.

## r2 changes (critic round 1)
1. Dive: 8 soft v6 cumulus in all (#EDEBE4 tops, #9AA3AD undersides, 7-8 px blurred lobes); no deck, NO white veil (1a); two large
   clouds pass the lens in the first second and thin out; clouds fade off the screen box x 850-1400 / y 360-1000 while "one road ...
   Nelson's Ferry" is spoken (2.0-6.3 s, `clear` option); four low clouds beside the descent after 6.3 s.
2. Gold name: fades in exactly on "Francis Marion", map dimmed 35 % under it, 3 px #1a1208 outline + drop-shadow(0 8 24 .6); the banner
   name plate hides while it is up; the PAINTED LONG AFTER HIS DEATH caption comes after it. Title card: units / flags under the letters fade to 0.
3. 70 / 150 cards = ivory/gold Cinzel plaques (~300 x 130, top-right, watch-plaque style); 70 lands on "seventy" (+0.15 s).
4. THE ARMIES: enters at 8.5 s (after the dive), "Americans / British" until the name slam, "Marion's men" after it; steps out 0.15 s
   before each card / the gold slam / the result list and comes back after.
5. Timeline: only around the date beat (slides in on the date roll, holds ~4 s, slides out); three seals, one per move (Parker's Ferry is
   move 3: no 4th seal, so no seal drops in these windows); seals on the progress line, labels never covered, 13 cells x 72 px
   (AUG 1780 - AUG 1781), year tabs 1780 / 1781 above the cells + a divider before JAN; no seal text.
6. Date plaque: one 310 x 95 plaque for every scene (readable year line + "30 August" / "1780" / "Before dawn"); the watch dial only
   with a spoken clock time (none in these windows), no hands; no place note under the date.
7. Result list: 1.35x, no row numbers, lining numerals, each value on its word ("about 20" then "killed", ...), "3 wounded" ~0.9 s before the cut.
8. Flashes: directional cones (~40 x 18 px, white-hot #FFF6D0 -> #FF9A2A, 2 frames) aimed at the target + a grey 60-90 px puff that
   hangs ~1.5 s (smoke line); sync unchanged (shot cue = the flash frame).
9. Musket mix: the first shot of each ripple at full level on its word, the ripple tail ducked 6 dB while the voice speaks; -14 LUFS.
10. Tilt capped at rotateX 7 deg / scale 1.06 (sharper map edges).
11. Crossed sabres moved east of the jammed boxes (off the FRASER tag); at the end only the result list + the date plaque + the banner.

## The borrowed elements (where each one replaced ours)
| # | element | replaces | how (2D) |
|---|---|---|---|
| 1 | **cloud dive** (v6 white cumulus) | nothing (new) | `BW.clouds`: cumulus sprites (cauliflower lobes lit from the upper left, grey-blue undersides) in true perspective over the flat map: each cloud has an altitude, screen scale = 1/(1 - h*s); a white deck passes the lens in 0-2.6 s, a fair-weather field + clouds along the existing ONE continuous zoom pass it on the way down (with soft shadows on the ground), white veil when a cloud covers the lens; lands clear on "Nelson's Ferry" (~8 s). Clouds keep clear of the Charleston road + the ONE ROAD stamp side. No 3D world. |
| 2 | **pocket-watch plaque** (GM overlay 1) | the black date plate | `BW.date` (= `B.date` in borrow scenes): ivory plaque top-left, day + month/year, rolls on each spoken date; year-only = month-only plate; the place under the day on its word (`BW.note`). The watch (`BW.time`) only where the script gives a time: hook-2 "before dawn" (label BEFORE DAWN, hands ~4:30). |
| 3 | **wax-seal timeline** (GM overlay 2) | nothing (new) | bottom, months AUG 1780 - SEP 1781; the seals of moves 1-3 already down, the progress line runs to August 1781 and the Parker's Ferry seal drops on "thirtieth of August" (named under the cell). Shown on the move segment only (not in the hook). |
| 4 | **parchment result list** (GM overlay 10, ledger) | the big casualty / result card | top-right, rows on their spoken words with a unit-colour chip: ~20 killed (Loyalist cavalry), ~80 wounded, Marion 1 killed + "and 3 wounded"; "by Marion's own count" subtitle. |
| 5 | **3D gold title** (scene.js v5-v8) | the name card + the title card | `BW.gold`: the 3D films' own painted gold face (gradient, bevel highlights, spec band) + 40 darker stacked layers = extrusion, CSS 3D over the 2D map, soft shadow on the map, grows 0.94->1 while the name is spoken, slow turn. Title card subtitle in gold Cinzel on "three greatest tactical moves". |
| 6 | **muzzle flash per shot + flintlock sound** | the kit's single `mg` volley sample in these scenes | `BW.shot` / `BW.volley`: one flash + powder puff per musket (guard 6 shots; ambush ripple 18 + buckshot ripple 13); each logs its time + screen x; `tools/make_test_audio.py` renders one Jackson flintlock shot per flash (lock snap + pan flash + real black-powder Enfield bang, `ajackson/sound/shots_flint`, `vicksburg/tools/troop_sfx.render_volley`, attack on the flash frame, pan from screen x). Level: a 16-shot volley = locked cannon impact - 8 dB (measured; stem gain -4.7 dB). |
| 7 | (unit motion) | - | unchanged, as asked. |
| 8 | **tilted camera** | flat top-down | `BW.tilt`: CSS 3D wrapper around `#world` + `#fx` + clouds (rotateX 0 -> ~9 deg, scale 1.04-1.12 to cover the corners, transform-origin 50% 62%), flat during the fall, tilt eases in during the zoom; HUD + cards stay flat and sharp. |
| 9 | weather overlays | - | **not used**: no rain / fog / snow is confirmed for these windows (Great Savannah: before dawn, no weather in FACT_NOTES; Parker's Ferry: "very hot", sunset = the scene's existing warm dusk light only). |
| + | **THE ARMIES** (GM overlay 3) | the side-colour key plate top-right | bottom-left, "Marion's men / South Carolina" blue, "British / and Loyalists" red; from 1.2 s; steps out for the title. The side key is not burned in. |

## Files / switches
- `marion/kit/js/borrow.js` (new): the BW module. `marion/kit/build_scene.py --borrow` (opt-in) adds `vicksburg/engine/overlay.js` (unchanged, `GMOverlay`) + borrow.js between the kit and the scene, copies the GM fonts to `assets/gmfonts/`, and appends `BW.finish()` (writes `data-shots`). **Without `--borrow` scenes build byte-identical** (checked: hook-a, m3f `index.html` identical to the old builder's).
- Test scenes (copies, changes marked `BW:`): `marion/scenes-src/test-bw-hook-a.js`, `test-bw-hook-b.js`, `test-bw-m3f.js`. Build:
  `python3 kit/build_scene.py test-bw-hook-a lowcountry hook-1 hook-2 --inset santee --borrow` (hook-b: `lowcountry hook-3 hook-5 --inset santee --inset blackriver`; m3f: `edisto m3-11 m3-12`).
- Voice: `tools/voice_clip.py` re-voices only the needed paragraphs with Kokoro (identical lengths to timing.json, checked), then voice A
  (`tts/convert_voice.py`, ref `tts/voices/test_A_chatterbox.mp3`) on the three windows. Music = `marion/tools/make_music_bed.py`. Kit cues = the scenes' own `SFX()` through `sfx_mix_lib` (SOUND LOCK OK; locked wavs hard-linked from goosegreen, not committed). Mix chain = `assemble_full.py` (music 0.08 ducked, SFX ducked, limiter, two-pass loudnorm) -> -14.0 LUFS.
- `tools/make_test_audio.py` (sound), `tools/finalize.sh` (join + mux + share encode), `tools/make_sheet.py` (sheet), rendered locally (hyperframes `--start/--end`, 4 windows), no RunPod spend.

## Open issues for the critics / owner
1. HUD scale: the GM plaques are their 1920-px size (smaller than our black plate / side key); at phone size the ledger and the timeline labels are small. Option: scale the HUD 1.2x.
2. The hook keeps its two number cards (70 MEN / 150 PRISONERS) top-right: they are hook stamps, not result cards; could move into the ledger.
3. The watch hands at ~4:30 are a stand-in for "before dawn" (no clock time is spoken); the plaque says BEFORE DAWN.
4. Clouds are 2D sprites (no volumetric light); they read as v6 from above but are softer/rounder; the deck is short (~2.5 s) because the hook's first beats (1780, the road, Charleston) must stay readable.
5. Seal ribbons partly cover the month names under them; 14 month cells are tight (cell 67 px).
6. Cannon level rule (~8 dB over a volley) is applied by measurement; no cannon fires in these windows (Parker's Ferry gun is not fired, FACT_NOTES), so it is not audible here.
7. Muzzle flashes are round (not directional); powder puffs are small at this zoom.

## r3 changes (critic round 2: A 7.5, B 7) -> `stylew_borrow_test_r3_share.mp4` (63.8 s, 20 MB, -14.0 LUFS) + `sheet_r3.jpg` (published | r2 | r3)
1. Smoke: r2's fog bank was a bug (the puff's grow tween scaled the counter-scaled pin, so at 15x zoom a 60 px puff became ~900 px). Now the
   inner puff grows, 40-90 px, peak opacity ~0.48, gone in ~1.25 s, <= 6 puffs per volley; the kit smoke calls in these two scenes are replaced.
2. Mix: first shot of each ripple -4 dB, tail -6 dB under the voice. Measured: the musket stem peaks at -16 dBFS (guard) / -13 dBFS
   (ambush) in the final mix; the -3 / -1.5 dBFS peaks at those moments are the VOICE (identical with the muskets muted).
3. 70 plaque starts on "seventy" (10.50 s). 4. Timeline slides in just after the spoken date (26.6 s clip). 5. Year line 24 px; every
   date plaque 310 x 95. 6. Low clouds fade before they blur into grey blobs (`bigFadeAfter`). 7. Sheet labels in r3 wording.

## r4 (owner: "the dive, the clouds and the smoke don't look right like the film") -> `stylew_borrow_test_r4_share.mp4` (63.8 s, 20 MB, -14.0 LUFS) + `sheet_r4.jpg`
The CSS sprite clouds and the 2D puffs are gone. The REAL 3D engine now draws clouds, the dive and the smoke: `marion/kit/js/bwgl.mjs`
(ES module, `--borrow` builds add it with three r169, `vicksburg/engine/fx.js` (unchanged except one extra look `bwTall` = gmTall stretched
x3.4) and `cloudtex/noise128.bin`) renders a transparent three.js canvas over the 2D Style W map. Its camera is solved every frame from the
DOM camera (#world translate/scale inside #bw-tilt perspective(1700) rotateX(deg) scale(k), origin 50 % 62 %): eye at
((960-wx)/ws, P cos/(k ws), (669.6 + P sin/k - wy)/ws), fov 2 atan(669.6/P) with a view offset, so ground shadows and smoke sit on the map.
World units = base-map px (lowcountry z10 ~ the engine's own map px; every engine length x F because our camera is F x farther).
- Dive (hook): high oblique (38 deg) over the Lowcountry with `fx.vclouds` fair-weather cumulus at 3 heights (49/78/108 x F), soft ground
  shadows (`patchGround` on a transparent shadow-only plane), the road / Charleston / ONE ROAD kept clear; then the engine's v8 deck over
  Nelson's Ferry with `VX.DIVE_OFF_V8` timings (swap SW = 7.0 s: deck in 5.3, white 6.45-7.85, emerge 7.85, clear 8.15, haze 8.75, landed 8.9),
  the DOM camera falls with it (scale 1 -> 8, tilt 38 -> 10) and lands on the santee map under the white; the engine's close stratus tear away
  on the landing. "Nelson's Ferry" label from its word (7.4 s, under the white) held to ~11.6 s.
- Clouds in every map shot: a few big soft cumulus + shadows (name slam, title, Parker's Ferry), placed off the banner, the titles, the
  action and the result list.
- Smoke: `fx.smokeLine` with SMOKE_GM {cluster [1,1], fadeAfter 6, fadeTo 0.12} and the `bwTall` look: 2 short night curtains east of the
  guard (alpha 0.11), one curtain per ripple at Parker's Ferry behind the hidden line, west / east of the banner (alpha 0.2); flashes +
  flintlock shots unchanged (r3 audio reused: same shots); the 1.25 s puffs and the charge's road dust are dropped.
- Gold titles (owner: "it swings"): no turn, no drift, no shake: they land on the word with a 0.45 s 0.94 -> 1 settle and sit still
  (sheet_r4: every 0.2 s next to v8's ONE DAY); they are screen-space (not inside the tilted map).
- First frame: no fade from black.
- Rendered on RunPod (`tools/render_pod_bw.sh`: no A4500, no RTX 3090 (a 3090 render came out corrupted: black ellipse / blocky clouds,
  discarded), 10-min no-answer kill): RTX A4000 + RTX 4000 Ada + one bad 3090 run, ~25 pod-minutes, ~$0.08; pods list verified empty.
Open: smoke curtains are single columns (v8 has many along long lines); the far side of the map at 38 deg is a haze band (the 2D map ends).

## r5 (critics r4: A 7.5, B 6 "the dive hides the spoken places") -> `stylew_borrow_test_r5_share.mp4` (63.05 s, 20 MB, -14.0 LUFS) + `sheet_r5.jpg`
- Dive timing: SW 7.0 with short offsets (deck from 6.55 s, white ~6.75-7.25 s, emerge 7.25, clear 7.4, haze gone 7.7, landed 7.75);
  the deck does not exist before deckIn (erosion 9) and the landing stratus only from under the white (one world: r4 showed them early);
  stratus tear away 2.2x faster (`stratus.speed` 0.45). Fair clouds: whole clusters dropped when they project into the screen box
  x 550-1000 / y 380-560 at any time 2-6.4 s (`fair.screenClear`); dive column clear radius 110 F. Overview a bit closer (s 1.05 -> 1.15)
  so the map fills the top; haze band thinner (`hazeK` 0.6).
- Smoke: Parker's Ferry: `cluster [26, 24]` = 3 curtains along each ripple (gap over Marion's banner), from just north of the boxes, bottom above
  the causeway, leaning downwind (wind west-north), ~90 x 300 px; guard: 2 wider gmTall curtains east of the guard (boxes visible).
- Close battle map: no cumulus on screen at Parker's Ferry (vclouds opacity 0), only faint shadows (`shadowK` 0.3); no clouds under the title.
- Joins: straight 0.25 s crossfades (`tools/finalize_xf.sh`; the audio crossfades with the same overlap: `XF=0.25 make_test_audio.py`).
- RunPod: one RTX A4000 run (~10 min, ~$0.03), pods list verified empty.

## r6 (critics r5: B 8, A 7 "the white-out reads as a flash") -> `stylew_borrow_test_r6_share.mp4` (62.45 s, 20 MB, -14.0 LUFS) + `sheet_r6.jpg`
- Deck build-up: deckIn = SW - 1.2 (5.8 s): the engine's deck front closes in from the frame edges toward the column over Nelson's Ferry
  (crossing still visible ~6.45 s), full by ~6.75-7.0; white-out ~6.75-7.2 with the swap under it; emerge 7.2, clear 7.35, haze gone 7.6.
  sheet_r6: dive every 0.25 s 5.5-8.0 s next to v6 at the same dive phase.
- Hook smoke: both curtains WEST of the guard (upwind), drifting east-north; the red guard box stays clear.
- Joins: the name window starts at film 56.55 and ends at 59.55, and the test copy drops the hook's own black snap-cut frame at T_NAME
  (it read as a dip at the join); no dark frames left in the clip (checked: no frame darker than 30/255).
- RunPod: no community GPU for ~15 min (retried every ~2.5 min), then one RTX A5000 SECURE ($0.27/h, ~12 min, ~$0.06); pods list empty.

## Musket smoke + flash spec (r7, owner: "the smoke and the shooting are not convincing")
Reference (descriptions only, nothing downloaded or committed): Wikimedia Commons "Musket volley by Sealed Knot.JPG" (Fernhurst, 2010) and
"Musketeers.jpg" (Thirty Years' War reenactment, CC BY 4.0, M. Maňas); NPS / state-park black-powder demonstration pages; reenactor accounts
(civilwartalk: damp still air keeps the smoke low and lingering; after a few volleys a whole line is hidden except for the flashes).
| phase | real black powder | r7 (bwgl.mjs volley smoke + borrow.js shot) |
|---|---|---|
| priming pan | small puff + flash at the lock ~50-100 ms before the shot | yellow pan flash at the lock (1-2 frames) 70 ms before + a small lit puff (life 1.4 s) |
| flash | short orange-yellow tongue, white-hot core, 1-2 frames, sparks of burning powder | tongue 34 x 12 px (x k) aimed at the target, white core dot, 2 frames; 3 sparks thrown 26-48 px forward in 0.16 s |
| jet | dense white-grey jet 1-2 m forward from the muzzle in 0.1-0.2 s, decelerating | 4 lit puffs per shot thrown 13-31 screen px forward, decay k 5-10 /s (90 % out in ~0.25 s), start 7-16 px |
| billow | the jet slows, swells, rises slightly | 4 billows per shot 0.1-0.5 s after, swelling 12 -> 60-90 px, rise ~5 px over the life |
| bank | neighbouring muzzles merge into one thick lumpy bank IN FRONT of the line | ~9 overlapping lit puffs per shot along the ripple (lateral spread +-11 px) = one bank between the line and the target |
| drift / linger | drifts downwind, lingers 5-15 s, thinner and more transparent | wind 4-7 px/s after 0.25 s; alpha x (0.35 + 0.65 e^(-age/4.5-5)), fade to 0 at 10-17 s |
| look | bright sunlit tops, grey undersides, soft edges, never a column | the engine's lit sprite mode 0 (normal-mapped cauliflower puffs: sun-lit tops, grey-blue undersides), tint 0.92; night: setNight 0.45 |
| ripple | volleys roll along the line | ragged ripple (BW.volley): first flank on its word, the rest over 0.6-0.8 s; each shot = one flash + one sound + its own smoke |
| clarity | (film rule) | bank alpha capped (x 0.7): units, banner, tags stay >= ~50 % visible; the guard company's bank x2 per-shot size at night |
Sizes are screen px at the scene's camera scale (`volley.K` = 1 / camera scale). The r4-r6 tall curtains (`smokeGL`) are no longer used.
r7 deliverables: `stylew_borrow_test_r7_share.mp4` (62.45 s, 20 MB, -14.0 LUFS; hook + Parker's Ferry re-rendered, name/title windows = r6),
`sheet_r7.jpg` (dive every 0.25 s vs v6, smoke vs v8, titles), `smoke_closeup_sheet.jpg` (one volley over 6 s against the spec above).
RunPod: one RTX A4000 SECURE ($0.25/h, ~10 min, ~$0.04); pods list verified empty.

## r8 (critics r7: A 5/5, B 6.5: "string of pearls", "cotton roll", cartoon flashes) -> new TECHNIQUE
`stylew_borrow_test_r8_share.mp4` (62.45 s, 20 MB, -14.0 LUFS), `sheet_r8.jpg`, `smoke_closeup_r8.jpg` (one Parker's Ferry volley, r7 | r8, -0.07 .. +6 s).
- Smoke = soft noise-textured billboards (bwgl.mjs `SMOKE`): 8 procedural smoke textures (4-octave value-noise fbm with domain warp =
  wisps, feathered radial falloff, normals from the density), instanced particles in their own render target, lit from the screen top
  (sunlit tops (235,232,222), mid (200,200,205), undersides (140,145,155)); per shot 9 jet particles (one cone thrown 70-110 px in 0.15 s
  ease-out, 18 -> 45 px, alpha 0.9) + 9 billows (log-normal 40-140 px, heights +-40 %), rise 10 px/s for 2 s, wind 15 px/s with shear (top
  faster), spread ~x2.5 by 6 s, alpha falls monotonically (~0.35 at 6 s, gone by 12-14 s).
- Visibility: the smoke target is composited with an alpha cap read from the DOM every frame: <= 0.55 over any unit, <= 0.3 over red
  boxes, ~0.1 over name tags (FRASER), 0.45 over the banner (34 px soft edges), 0.75 elsewhere.
- Flashes on 2D canvases above the smoke: pan flash 12 px 1 frame 2 frames early; tongue 55-70 x 16-24 px #FFFBE0 -> #FFB030 -> #E04A10,
  frame 1 100 % / frame 2 60 %; screen-blended glow r 45 px 32/22/12 % over 3 frames; 8 motion-blurred streak sparks over 0.2 s.
  Shot times snapped to the video frame, so the bang lands on the tongue frame (audio rebuilt with the snapped times).
- Hook: the guard fires north-west over the riders' approach, wind north 5 px/s: the smoke stays off the boxes.
- RunPod: one RTX A4000 (micro-clip 4 s + both scenes, ~10 min, ~$0.03) after ~25 min of "no instances" retries; pods list empty.

## r9 (critics r8: B 8.5, A 6.5/6: flash = comet, smoke = TV grain, bank = flat big haze; owner: + artillery, + the effect of fire)
`stylew_borrow_test_r9_share.mp4` (76.8 s, 21.6 MB, -14.0 LUFS, TP -1.3), `sheet_r9.jpg`, `smoke_closeup_r9.jpg` (r8 | r9 musket rows, then r9-only
rows: CANNON, HIT, WIPE-OUT, ROUT). Five windows: hook 0-17.8, name slam, title, **Fort Motte six-pounder (film 750.21-764.81, new)**, Parker's Ferry.
- Smoke (bwgl.mjs `SMOKE`, rewritten): 8 baked cauliflower textures = a union of 5-7 round lobes, outline wobble + tone from ONE low-frequency
  noise octave (period >= 30 px on screen, no grain), edges softened over ~8 px; colour baked from the lobes' height field, light from the
  screen top: rims (240,236,226), undersides (130,135,145). Per shot: 5 jet puffs 60-80 px in 0.15 s, alpha 0.85 and whiter for 0.3 s, ray-
  marched to stop >= 10 px (+ puff radius) short of any red box; 6-8 puffs r 25-33 px (squashed 0.82), growth ~1.1x, rise <= 10 px, wind
  north 4 px/s + east 3 px/s, alpha exp(-t/2.5), gone by ~11 s. Muzzles at the line front (y 790), aimed along the road side.
- Visibility: unit boxes, name tags and banners are CUT OUT of the smoke (1.5 px edge): they read as drawn above it, never pink or veiled;
  a fading unit lets the smoke back in. Cap 0.6 elsewhere. Hook guard smoke fades out by 17.0 s (`volley.gone`).
- Flash: 8 px white core AT the muzzle + ragged tongue 35 x 10 px (jittered outline, 2-3 side lobes), x0.7; frame 1 100 % / frame 2 50 %;
  pan spark 2 frames early; screen glow r 40 px 30/18/8 %; 8 spark streaks.
- Cannon (`BW.cannon` -> `vcannon`): fireball (3 ragged blobs, ~70 px) + 20 px white core, 2 frames; glow r 110 px for 3 frames; 14 sparks;
  ground dust ring (tan) at the muzzle; smoke ring + burst thrown 150-200 px; heavy low cloud (darker grey, undersides darkest, rise <= 6 px,
  wind 6 px/s, lingers 13-19 s); round shot impact on the gable 0.5 s later: dirt burst + lingering smoke; the gun box recoils 2.2 map px.
  Sound = the scene's own locked kit cues ("fire" on the flash frame, "impact" on landing), SOUND LOCK OK. History: the six-pounder fired
  once at Fort Motte and no one was killed, so the roof figures flinch and are driven off (no casualty marks there).
- Effect of fire (`BW.hit / wipe / rout / captured / dip`, borrow.js): hit = shudder, colour dims ~0.6 s, frontage/depth loss, stagger back,
  ragged edges when shaken, small dark casualty marks (screen-px sized); wipe = the box breaks into 6 chunks that scatter, tumble and fade to grey
  remnants + marks; rout = chunks flee along a direction, 2 wounded stragglers fall behind and stop grey; captured = grey + side-colour edge.
  Parker's Ferry: both ripples hit the jammed boxes; "killed on the spot" -> fr2 wiped out; "wounded" -> fr routs toward the ferry. Hook: on
  "British guard" the guard is hit (shaken) and overrun (captured grey, red edge).
- Process: local stills for quick checks; RunPod micro-clips x3 (musket 6.4 s, wipe/rout 4 s, cannon 4 s, hook guard 2.4 s), then the full
  windows, all on ONE RTX A4000 pod kept alive between iterations (`KEEP=1` / `POD=` in render_pod_bw.sh); pods terminated, list empty; r9 ~$0.12.
- Known weak spots: rout/wipe chunks still read small at this zoom; cannon cloud could be darker/denser; bank is still a fairly even band.

## r10 (critics r9: A 7 / 6.5, B 8.5; "cannon not found", "thin tidy tube", "pixel confetti"; owner: the 3D films' artillery look + sound)
`stylew_borrow_test_r10_share.mp4` (76.7 s, 21.7 MB, -14.0 LUFS, TP -1.2), `sheet_r10.jpg`, `smoke_closeup_r10.jpg` (r9 | r10 musket rows, a 3D-FILM
REFERENCE row from `ajackson/sequences/S07/sheet.jpg` next to the r10 cannon, then r10 CANNON, HIT, WIPE-OUT, ROUT frame by frame).
- Joins: crossfades of 8 frames (XF = 0.2667 s), so every window starts on a whole frame and the cannon cue lands exactly on the flash frame
  (34.633 s in the share; the r9 joins were half-frame offsets).
- Musket bank: puffs spread ~20 px across the line, density varies +-40 % along the line, ~1 shot in 4 adds a cauliflower lump (r 25-40 px)
  on the top edge, puff textures feathered in their lower third (soft ~20 px bottom), undersides (125,130,140): 55-70 px tall at 1-3 s.
  28 muskets in the first ripple (0.6 s) and 20 in the buckshot ripple -> 3-4 flashes per frame. Each flash lifts the bank's underside +20 % for its 2 frames.
- Flashes: tongue 40 x 12 px (x1.2), 8 px core at the muzzle, ground glow r 50 px at 35 %.
- Cannon: 2D fireball 3 ragged blobs ~120 px + 20 px white core (frames 1-2: 100 / 60 %), glow r 110 px 3 frames, 14 sparks; then (from frame 3)
  the 3D films' own plume (`fx.cannon` from vicksburg/engine/fx.js, field-gun settings, flash off, x3 for the 2D map, darker tint) + my jet
  150-200 px in 0.3 s + a dark-bottomed cloud (undersides ~(110,112,118)) lingering ~15 s + a 140 px tan dust ring; recoil kept. The roof fire:
  the big orange wash is replaced by a local flicker glow (r 70 px, alpha 0.4) + a dark soot column (`vcolumn`, 3D layer).
- Cannon sound as in the 3D films (owner): Andrew Jackson's gun sound (goosegreen `candidates/cand1_hit.wav`, -15 dB) +4 dB, ducked only 25 %
  under the voice (ajackson/tools/assemble.py, OWNER_DECISIONS row 14), onset on the flash frame; the locked kit files untouched (SOUND LOCK OK).
- Hits: the target boxes shake ~2 px on the flashes (every 2nd shot); a hit = a 0.25 s red-white flash on the box + shake, dims, a chunk lost,
  stagger back, 2-3 casualty marks 9-13 px. Wipe-out (with the KILLED ledger row, +0.133 s): shudder + flash, 40 % colour, ~40 px dust puff,
  fades over 0.8 s to a grey remnant that holds 1.5 s. Rout: 4 box-coloured pieces 18-21 x 12-14 px scatter 60-120 px away from Marion's line
  and fade over 1.5 s; one wounded straggler stops at ~40 px and turns grey. Captured = grey "color"-blend overlay + side-colour edge (no
  filter fight): the hook guard is grey at 17.03 s, right after "guard".
- RunPod: one RTX A4000 kept alive per round (micro-clips: 4 windows, then a 0.6 s cannon check, then the full windows); r10 ~$0.08; pods
  terminated, list empty.

## r11 (critics r10: B 9 YES; A 7.5 / 7 NO)
`stylew_borrow_test_r11_share.mp4` (76.7 s, 21.6 MB, -14.0 LUFS, peak -2.9 dBFS before AAC / -2.7 after), `sheet_r11.jpg`, `smoke_closeup_r11.jpg`
(r10 | r11 musket rows, 3D-film reference row, CANNON / HIT / WIPE-OUT / ROUT frame by frame).
- Cannon fireball: ONE ragged cone 110 x 60 px from the muzzle (white -> yellow -> orange -> red edge) + 20 px white core, frames 1-2
  (100 / 60 %); ground glow r 120 px at 40 / 26 / 11 % over 3 frames.
- Cannon smoke: a dense jet 180-220 x 70-90 px reached in 0.3 s (16 big puffs, alpha 0.92) + a muzzle cloud, billowing to a ~140-180 px cloud
  (tops ~(235,232,225), undersides ~(105,108,115)), wind ~6 px/s, 12-15 s; the 3D films' plume (fx.cannon) kept underneath, its dust off.
  The dust blobs are replaced by a flat ground ring (a canvas under the smoke): 120-160 px across, alpha 0.35, (150,130,100), spreads in 0.4 s.
- Musket bank: 15-25 px IN FRONT of the line (`volley.front` 20 px toward the road), lumps on ~40 % of shots with heights varying +-15 px,
  denser (a0 0.55-0.65, cap 0.8) and darker undersides (116,121,131): >= 80 levels between lit tops and undersides on the map.
- Wipe-out: no white pop; the box dims from red to dark (brightness 0.38), then to grey remnants (0.55) inside the dust puff, holds 1.5 s.
- Rout: 4 pieces 20 x 14 px (screen) that keep the white slash, scattering 80-140 px over 1.2 s, 0.1 s apart; one straggler stops grey.
- Casualty marks: 18-23 px on screen (>= 6 px at 640x360), lighter brown (62-70,50-58,38-44), soft edge, held until the line slips away.
- Audio: a -3 dBFS peak limiter after the loudness pass (loudnorm target -13.8 -> -14.0 LUFS out); the cannon boom stays on the flash frame
  with the Jackson-style mix.
- RunPod: one RTX A4000 kept alive (3 micro-clips, then the 3 full windows), ~$0.04; pods terminated, list empty.

## r12 (critics r11: B 9 YES; A 8 / 8 "close": the musket bank is right, the cannon is the weak part)
`stylew_borrow_test_r12_share.mp4` (76.7 s, 21.6 MB, -14.0 LUFS, peak -2.7 dBFS; audio = r11's, unchanged), `sheet_r12.jpg`, `smoke_closeup_r12.jpg`.
Only these changed (hook window = r11 render):
- Cannon cloud: denser and darker: jet lumps r 30-50 px, alpha ~0.9, almost no "white" boost; shading for cannon smoke now tops ~(230,227,220),
  undersides ~(95,98,105); the jet ends in a heavy head (7 big lumps r 40-55 px round the jet's end, 160-200 px across) within 0.4 s; the 3D-film
  plume underneath at alpha 0.25 with a darker tint; composite cap 0.9 in this window. Drift / linger as in r11.
- Cannon fireball: the cone outline is jagged and irregular (random tongues), 4-6 spark streaks 20-30 px; frame 1 full, frame 2 at 40 %;
  white core and the r 120 px ground glow kept.
- Rout pieces: x1.5 (measured 12-14 px in r11) = 20 x 14 px on screen; each visible >= 1.2 s.
- Wipe-out starts 0.15 s earlier: with "KILLED" (71.10 s in the share).
- RunPod: the first pod came up as an RTX 4000 Ada and rendered black-ellipse frames (like the 3090 in r4): terminated, the Ada is now excluded
  in render_pod_bw.sh; a kept-alive RTX A4000 did the micro-clips + both windows. r12 ~$0.04; pods terminated, list empty.

## r13 sheets (before the full render; owner workflow: critics check the sheets first)
- `smoke_fade_r13.jpg`: one volley r12 | r13 at +0 / +0.3 / +1 / +2 / +4 / +6 s (r13 frames = a RunPod micro-clip, RTX A5000), + the buckshot
  ripple at +2.1 / +4.1 / +6.1 s (local stills). Musket smoke r13: grey-blue haze (core ~(196,198,200), shadows ~(150,152,158), faint rim,
  jets only a little brighter), composite cap 0.40, puff alpha 0.36, carried downwind ~42 px/s from +0.5 s with shear (x0.6-1.4) and stretch,
  every puff gone 4.7-5.5 s after its shot (no build-up). Volleys: 1st ripple 27.89-28.49 s scene = 63.37-63.97 s share (28 shots);
  buckshot 31.08-31.78 s scene = 66.56-67.26 s share (20 shots); hook guard 6 shots ~16.0-16.6 s share (gone by 17.0).
- `focus_r13.jpg`: the soft focus light circle (coordinator commit bc575917: K.FOCUS_DIM 1.9, K.FOCUS_LIT 0.10) at "in a thick wood"
  (m3f 10.0 s), full frame, a 1:1 crop and the 640x360 phone view.
- `sheet_clouds_r13.jpg`: r13 clouds (dive, swap, emerge, in-scene) next to gm3d v6 at matching moments (v6 = r13 + 9.4 s in the dive) + 1:1 crops.
  r13 clouds: bigger merging deck lumps on two heights (parallax), whiter lit tops / softer grey undersides (v6), resolution 0.75, near-fade 9F
  and slab floor 28F (no flat-cut cloud edges), an even cream white-out (the map vignette fades out inside it), keep-clear boxes for the date
  plate and THE ARMIES key in the hook and name-slam windows. Cloud moments in the share: scattered cumulus 0-5.5 s, deck builds 5.8-6.4 s,
  inside 6.5-6.9 s, white-out ~7.0-7.2 s, emerge 7.25-7.9 s, landed 8 s; name-slam clouds 17.55-20.55 s and 20.3-24.7 s.
- Cannon (m3d): fireball frame 2 at 60 %; over the house front the cannon smoke is capped at 0.6 from +1.5 s for 4 s (soft 30 px edge);
  the cannon cloud drifts ~17 px/s and is gone in ~8 s (clife 7.5).
- Audio (no re-render needed), 3D-film mix: see the A/B table below.

### A/B audio: Jackson v4 (ajackson/tools/assemble.py) | r13 test (make_test_audio.py)
| cue | Jackson v4 | r13 |
|---|---|---|
| cannon shot | KIT "gun" cand1_hit -15 dB, sfx stem +4 dB, ducked 25 % | cand1_hit -15 +4 dB, ducked 25 %, onset on the flash frame (760.44 film s) |
| impact / ground strike | KIT "boom" cand2_hit -19 dB (+4, 25 %) | cand2_hit -19 +4 dB on the visible impact (760.94) |
| burning house | KIT "fire" bomb4 lowpass 900, 5.6 s, 2 s fade, -17 dB (+4, 25 %) | same, when the roof catches fire (754.93) |
| battle ambience | cand5 distant-warfare -24 dB, ducked 35 % (gm3d clip: -23) | cand5 -23 dB, ducked 35 %, battle windows only (Fort Motte from 759.44, Parker's Ferry from 825.34), 1 s fades |
| muskets | troop stem (Jackson flintlock set) -12 dB, ducked 85 % | the same flintlock set (troop_sfx), one shot per flash, a volley 8 dB under the cannon (stem gain -14.1 dB), first shot -4 dB, tail ducked 50 % |
| old 2D kit gun cues | - | dropped in the borrow windows ("fire" 760.44, "impact" 760.94); the locked kit files and check_sound_lock untouched (SOUND LOCK OK) |
| loudness | -14 LUFS | -14.0 LUFS, peaks -2.9 dBFS (limiter -3 dBFS) |

## r19 share -> `stylew_borrow_test_r19_share.mp4` (76.733 s, 2302 frames, r18 audio stream-copied: identical; -14.0 LUFS, -1.9 dBTP)
- Coordinator: muskets at PPU 150 (the film's smoke-to-box ratio); the cannon alone at PPU 110 (`--var smoke3dcanppu=110`: a second film-unit
  engine world for the gun, seed 1518) so the fort and the white flag stay readable; the impact in the fort yard (`smoke3dimpoff=-46,10`) at
  `smoke3dimpk=4` (the engine's impact, scaled only) so the dirt burst reads.
- Builds: m3d `--smoke3d --var smoke3dppu=150 --var smoke3dcanppu=110 --var smoke3dimpoff=-46,10 --var smoke3dimpk=4`; m3f and hook-a
  `--smoke3d --var smoke3dppu=150`; hook-a0 = the locked hook build (for the crossfade only).
- RunPod: one RTX A4000 (community, 2nd deploy try), m3d 40.0-54.6, m3f 3.26-41.26, hook-a 13.5-17.8, hook-a0 17.5-17.8; ~$0.046; pod terminated,
  pods list empty.
- Splice (`tools/splice_r19.py`, frame-exact): share 405-525 = new hook; 526-533 = the hook->hook-b crossfade recomposed (r18 + (1 - k/8) x (new
  hook - old hook), xfade fade weights); 740-2301 = new m3d xfaded into new m3f exactly as finalize_xf5.sh (732-739, before the cannon, kept).
  Alignment: new hook frame 0 vs r18 405 = 2.1 grey levels, old hook vs r18 525 = 2.25 (render/encode only). Seams (frame-to-frame mean
  difference at 480 x 270): 405 1.40 (baseline 0.54), 740 3.49 (2.7-3.0 in the incoming crossfade), crossfades ramp normally.
- The hook guard at night: small orange flashes, the engine smoke dimmed by the night (fx setNight 1), faint.

## r19b stills (coordinator: r19 too small and weak next to our bigger boxes) -> `sheet_smoke3d_r19b.jpg` (film | r19 PPU 60 | r19b PPU 150)
- Build: `--smoke3d --var smoke3dppu=150` (+ for m3d `--var smoke3dimpoff=-46,10`): the same engine code and numbers, scaled to the film's
  smoke-to-box ratio (his boxes ~25 px on screen, ours ~65 px).
- Musket: the curtains become big film-like banks over the line, the blue boxes veiled by +2-4 s as in the film.
- Cannon: the flash ~2.5x bigger; the plume jets from the gun to the fort and spreads over the whole fort (house + garrison box veiled from ~+0.5 s).
- Impact (engine fx.impact { size 0.9 } at the 150 scale; `--var smoke3dimpk=N` scales only the impact, unused): at the gable it was under the
  house icon and inside the cannon plume; moved to open ground in the fort yard west of the house (`smoke3dimpoff=-46,10` map px): an orange
  pin-flash on the impact frame and a small dark dirt puff at +0.5-0.9 s, then the plume covers it. Still faint: the engine's impact is small.
- The r19 column has no 51.17 still (its +0.9 row repeats its +0.5 frame).

## r19 stills (owner: "the gun smoke exactly like the 3D film: COPY it") -> `sheet_smoke3d_r19.jpg` (build `--smoke3d`; stills only, no render yet)
- Sources (copied, not re-created): `vicksburg/engine/fx.js` (= `gm3d/clip/fx.js` + the v8 per-shot muzzle flashes; the smoke's random
  sequence is identical with or without them), already shipped as `gl/fx.js` by build_scene.py. Musket = `fx.smokeLine` + `SMOKE_GM`
  (`vicksburg/engine/scene.js`: cluster [1, 1], fadeAfter 6, fadeTo 0.12, look gmTall) + the gm3d clip v8 volley options
  (`gm3d/clip/index.html` 209-212: rate 2.9, volley 1.6, size 1.45, height 3, muzzle 6, windK 0.45) + `muzzleFlash: {}` (scene.js MZF.musket,
  troops test v14). Cannon = `fx.cannon` + GUN_PRESET.field (size 1) + MZF.cannon (flashHold 0.4, flashCore 0.7, nightPool 7); impact =
  `fx.impact { size: 0.9 }` (scene.js / clip index.html 214). The engine setup = the clip's close region (unitsPerMeter 1 / 129.36, fxScale 9,
  wind [20, -7], sun [-0.7, 0.48, -0.4], seed 1517).
- Only scale + placement changed: the engine runs in film units; our map px / Z -> film units and a copy of our camera with its position / Z
  (same projection). Z = PPU x K: PPU 60 = the film's px per unit at 1080p at the clip's battle camera (fov 30, dist 30-36), so a puff has the
  film's size on screen; K = the scene's map px per screen px (m3f 1 / 3.1, m3d 1 / 3.6, hook 1 / 15.2). `--var smoke3dppu=N` tries another
  scale (e.g. ~150 = the film's smoke-to-box ratio: his boxes ~25 px, ours ~65 px).
- Fired from our logged shots: each ripple of `vshots` (< 0.9 s apart) = one smokeLine from its first muzzle to the farthest one, t0 = the first
  shot (the engine fires the shot at pts[0] exactly on t0, the rest ripple over our ripple's span); each `vcannon` = fx.cannon at the muzzle
  on its flash frame (the same frame as r15) + fx.impact at the target at its impact time (`--var smoke3dimpup=N` moves it N map px north).
- Opt-in, all in `LOOK-LOCK pending smoke3d` regions (bwgl.mjs, build_scene.py): without `--smoke3d` nothing changes; the gate says LOOK LOCK OK.
  With it the r15 puffs / flashes / cannon plume are off; the burning roof's soot column stays.
- Seen: musket = the film's grey curtains in battalion clusters (ours read rounder: our line runs across the screen, his up it) with tiny v8
  flashes, thinning after 6 s; smoke draws over the boxes (as in the film; r15 cut the boxes out). Cannon = the film's white-orange flash +
  a soft grey cloud drifting downwind. The impact (10 dark-brown puffs, alpha 0.42) is under the house icon / over dark woods: barely visible.
- The hook guard (6 shots, night) is built with `--smoke3d` too, but the hook scene times out in the local snapshot (with and without the flag):
  its stills come from the render.

## r18 share -> `stylew_borrow_test_r18_share.mp4` (76.733 s, 2302 frames at 30 fps, 21 MB; r15 audio stream-copied, MD5 identical)
- Hand-off grade match: over 7.8-8.4 s the 3D image eases onto the 2D landed frame's levels (per-channel slope/intercept from the two landed
  frames, centre 900 x 600: 3D mean (79.4, 82.6, 54.4) sd (21.7, 23.4, 16.7) -> 2D (71.8, 74.5, 43.1) sd (23.3, 24.5, 20.1)); measured after:
  3D (71.7, 74.6, 42.3) sd (23.3, 24.6, 20.0).
- RunPod: no supply for ~10 min (A5000 / A4000 community + secure, RTX 2000 Ada); the loop was stopped while asleep (no pod deploying)
  and the pods list verified empty: $0 spent. Rendered locally instead: `dive_v6copy/tools/frames18.mjs` (headless Chrome, SwiftShader,
  the same page and seek as the stills): 276 frames 0-9.2 s at 1280 x 720, ~1 s/frame.
- Splice: the 3D frames (lanczos to 1920 x 1080) for 0-8.4 s, a 0.2 s crossfade 8.4-8.6 s into r15 (r15 from frame 252), then r15 unchanged.
  x264 slow crf 22 (as r15), audio `-c:a copy`.
- Seam 248-263: the framing lines up (ferry, rivers, woods, the wagon). Visible in the blend for ~6 frames: the 3D's smaller 1780 plaque
  and label vs r15's; then THE ARMIES enters (r15, 8.5 s).
- Frames after the splice match r15 (frame 270 / 400: mean diff 0.76 / 0.42 grey levels, encode only).

## r18 (owner: "3D didn't work like that": COPY how the 3D film did it) -> `dive_v6copy/` + `sheet_v6copy_r18.jpg` (stills only)
- `dive_v6copy/` is a literal copy of the gm3d clip project: world.js, fx.js, vendor/, cloudtex/, and index.html cut from the clip's own
  index.html. Kept verbatim (v6 clip time): its camera beats and easing (DV + the keys), fx + the wide clouds, the deck and the close stratus
  (vclouds), the grade, the white-out (+ the v8 cut fix), the emerge fog and the film settings.
- Removed: the 3D title, the battle, the boats, the fires, the flashback.
- Only the content is swapped (`tools/make_assets.py`):
  - The ground: our Lowcountry Style W basemap as v6's wide ground texture, scaled 1/2.9 into v6's map units (it fills v6's 1000 x 640 box),
    with Nelson's Ferry on v6's dive target (1518, 706).
  - The landing: the Santee basemap as v6's close ground, at its true place.
  - Flat heights; no rivers / trees / houses / bridge meshes (the painted maps carry them).
- world.js change: a hidden bridge anchor is not drawn.
- Retime (linear, v6's proportions kept): ours = TA * v6 + TB, TA = 1.4/3.35, TB = 7.0 - TA * 16.4. So v6 SW 16.4 -> 7.0, land 19.75 -> 8.4,
  push 12.6 -> 5.41, deck in 14.7 -> 6.29.
- Our overlays, on r15's words, drawn the way v6 pins its DOM boxes / names (`world.projectMap`, dimmed by the cloud alpha there):
  - the four British boxes (II pair drops in on "Britain"), the two wagons rolling up the Charleston road, the two flags;
  - the road trace + ONE ROAD on "one road", "Nelson's Ferry" (v6's `.pl` label) on its word;
  - the pocket-watch plaque (vicksburg/engine/overlay.js, as r15) "1780".
- Hand-off: v6's land key (dist 40, tilt 38) is replaced by our 2D camera's framing at 8.5 s: map (1310.9, 893.4), scale 13.34, tilt 7 ->
  at [1517.41, 698.66], dist 48.7, tilt 7, fov 32. The 3D landed frame lines up with r15's 2D frame (ferry, rivers, woods in place);
  the plan is a crossfade 8.4 -> 8.6 s into r15.
- Stills: puppeteer harness at 1280 x 720 (v6's composition size).
- `--paint` and `--cloud3d` are kept, unused; the gate still says LOOK LOCK OK (r18 touches no locked file).

## r17 (owner rejected the painted r16: "I like something like 3D more" / "maybe tone it to 2D or make it work") -> `sheet_dive3d_r17.jpg` (stills only)
- Back to the REAL engine clouds of the approved gm3d v6 clip. The new path sits behind `build_scene.py --cloud3d` (GD.var.cloud3d), with
  `--var tone=2d` for variant B. `--paint` is kept as it was (opt-in, unused). All code is inside the LOOK-LOCK pending cloud sections; the gate
  says LOOK LOCK OK.
- Config = v6's own values: CW_DAY light (sun [1,0.95,0.85], ambTop [0.50,0.55,0.65], ambBot [0.24,0.28,0.36], sunK 1.4, ambK 0.18,
  lightK 3.2), the vclouds options (blur 1, sharp 1, sigma 0.75, soft 1.7, warp 0.06, ...), heights 49-58 (+0-9), drift [0.10,-0.035], and
  v6's dive deck (`deckV6`: the 22-unit grid of sheet cumulus r 13-25 round the target, ragged to the rim, + the 6 column lumps; one base
  height). Its colours/erosion/ms/expo/sigmaK follow v6's dive functions on r15's dive timings. Lengths x F 3.3.
- The field is v6's own wide field as it appears on screen at its 10.4 s (the r13h trace, re-placed by screen position).
- Removed from r13-r15: deckLook, sunK0 2.05 / ambK0 0.24, lumpK, baseRound, erode0, the masses deck, nearTier, edgeKeep.
- Kept: skirtCut (ring fix), the road / stamp corridor dip, the close stratus and the white-out.
- Fix: `slabTop` (opt-in, 170 x F). The default slab top (113 x F) cut big near clouds flat: straight translucent sheets and notches at 6.6 s.
- Grades (SVG filter on the engine canvas, only until SW + 1.5 s; the later musket smoke is untouched):
  - A = v6 + a light warm grade (R x1.03, B x0.93).
  - B = toned to 2D: luminance -> 3 soft bands (shade < ~0.57 < mid < ~0.73 < lit) -> the map palette, i.e. shade (180,186,198),
    mid (214,212,206), lit (240,234,220); a faint grain (feTurbulence, +-3.5 %); a slightly crisper edge (alpha S-curve).
- Sheet: v6 | A | B at our 1.0 / 4.0 / 5.9 / 6.3 / 6.6 / 7.7 s (v6 + 9.4 s), + 1:1 crops at 1.0 s.
  - 7.7 s stands for 7.6 s: local Chrome crashes at 7.6 s, the r15 build too.
  - The 1.0-6.6 s stills come from the puppeteer harness; the 7.7 s ones from hyperframes.
- Known gaps vs v6:
  1. At 6.3-6.6 s v6 is already INSIDE a soft close deck. With r15's timings our camera is still high (ws 1.5-2.3), so the deck reads as
     separate cumulus over the map, not v6's close soft bank.
  2. A few wedge / hook fragments at the deck rim while its erosion front sweeps in (6.3 s).
  3. The early field is smaller and sparser on screen than v6's big soft corner masses.

## r16 share (r16c + polish) -> `stylew_borrow_test_r16_share.mp4` (76.733 s, 2302 frames at 30 fps, 21 MB; r15 audio stream copied bit-exact)
- Polish (coordinator): the field is warmed toward the map grade (`fieldTint` [0.983, 0.975, 0.956]: lit tops ~(238,232,218), ~4 % darker).
  The bank masses are jittered (`jitter`: per mass a random mirror, +-20 deg, +-15 % scale, a small hue/brightness shift; same 5 sprites).
  The bank's hole is centred on the wagons (dx 60 / dy 110 px from the ferry), so the boxes stay visible until it closes (~6.75 s).
  Cover: 1.0 s 13 %, 6.4 s 58 %, 6.6 s 72 %, 6.8 s 99 %, 6.95-7.05 s 100 %, 7.2 s 62 %, 7.5 s 0.
- Render: hook window 0-17.8 s (`test-bw-hook-a:0-17.8`, build `--borrow --paint`, LOOK LOCK OK). RunPod: no community A5000/A4000 for
  the first try; then one RTX A5000 SECURE ($0.27/h, render 241 s, ~6 min up, ~$0.03). The pod was terminated and the pods list verified empty.
- Splice: share frames 0-526 = the new render (r15's first crossfade, hook -> name slam, starts at 17.55 s = frame 527); frames 527-2301 =
  r15. Re-encoded as r15 (x264 slow crf 22, maxrate 3.2 Mb/s); audio `-c:a copy` (stream MD5 identical to r15). Alignment checked: render vs
  r15 at frames 300/450/520/526 differ by a mean 0.7-1.1 grey levels (encode only). Seam 524-531 is continuous.

## r16c (owner: the direction is right; halfway between r16 clip-art and r16b fog, "an old illustrated map") -> `sheet_dive2d_r16c.jpg` (r15 | r16b | r16c at 1.0 / 4.0 / 6.6 / 7.7 s, + the bank at 6.85, the wipe parting at 7.2, a 1:1 crop)
- Merged origin/main (look lock v1, PR #154). The `--paint` additions in build_scene.py now sit inside `LOOK-LOCK pending-begin/-end clouds`
  sections; the gate prints LOOK LOCK OK, with only the expected cloud warnings. No locked preset was touched.
- Sprites (`make_paint_clouds.py`, `lobed()`): each cloud is 3-7 soft rounded lobes (bank masses 11-16) of different sizes, seen from above at the
  map's tilt (lobes flattened 0.8). Each lobe gets its own painted shading: lit top-left (242,238,228), mid (222,220,214), cool shade lower right
  (188,192,202), wide soft steps, and a faint warm sepia rim on the shade side. Lobes are laid far to near like brush dabs, on an irregular rim.
  The dry-brush feather is ~10-20 px. Cores ~0.9, the thin outer band ~0.6. Paper grain; no glare. The colour is un-premultiplied (first try
  had dark fringes). Kinds: `g` = cumulus groups (10), `w` = r16b wisps (3), `b` = bank masses (5).
- Field: 13 groups + 3 long low wisps, sprite radius 72-361 px (5x), off the road / stamp / Charleston / British boxes. Cover measured on the
  cloud canvas (alpha > 0.5, the warm top haze excluded): 13 % at 1.0 s, 12 % at 4.0 s. Ground shadows ~18 %, offset down-right.
- Bank + wipe (screen space round the ferry): 9 lobed masses grow in from all edges from 6.0 s (radius 1450 -> 900 px by 6.6 s, then close to
  ~450 px by SW - 0.08). The painted backing shows for <= ~0.13 s; then they part outward into soft wisps (0.6 s).
  Measured cover: 6.2 s 24 %, 6.4 s 66 %, 6.6 s 80 % (a hole over the wagons), 6.8 s 97 %, 6.95-7.05 s 100 %, 7.1 s 93 %, 7.2 s 61 %, 7.3 s 31 %, 7.5 s 0.

## r16b (coordinator on r16: "cartoon clip-art, not painted Style W") -> `sheet_dive2d_r16b.jpg` (r15 | r16b at 1.0 / 4.0 / 6.6 / 7.7 s, + the bank at 6.85, the wipe parting at 7.2, a 1:1 crop)
- Sprites rebuilt (`make_paint_clouds.py`): soft painted masses seen from above. The density is a sum of gaussian blobs; edges dissolve
  in a dry brush over ~20-40 px (a wide feather, stroke noise, a broken outer band); never a straight bottom. Translucent: thin parts ~0.6,
  the core ~0.85, wisps <= 0.62. Low contrast: lit (240,236,226) / mid (222,221,216) / shade (196,198,204), wide soft steps, paper grain.
  Kinds: `p` = puffs seen from above (6), `w` = long low wisps (4), `b` = big bank masses (4). The old side-on `c/m/t` stickers are gone.
- Field: 15 clouds, log-normal sizes (sprite radius 64-450 px, 7x), 3 wisps, near layer only at the frame edges.
- Ground shadows now visible. In r16 they never drew: the tinted shadow is a canvas and the sprite drawer only accepted loaded images.
  Now a feathered cool wash (~18 % darkening) under each cloud as seen, offset down-right.
- The 6.6 s clump (8 puffs + the world-space deck) is replaced by a BANK. 6 big translucent masses slide in from beyond the frame edges
  (6.0-6.6 s) toward the ferry and grow as the camera falls. The wagons stay visible until they close (6.85 s still).
- Wipe: the same masses. A warm painted backing (cream + cool washes) closes the last gaps only around SW (full cover ~6.95-7.07 s, about
  0.12 s); then they part outward, grow and thin into soft wisps (7.2 s), clear by ~7.5 s.
- Local renderer: hyperframes' Chrome crashes at exactly 7.6 s on this machine, for the r15 build too (environment, not the clouds), so
  the sheet uses 7.7 s. The 1.0 / 4.0 / 6.6 / 6.85 s stills come from a small puppeteer harness (same page, same seek). At high zoom that
  harness leaves the inset map blurry, so the 7.2 / 7.7 s stills are hyperframes'.

## r16 (painted 2D clouds; owner 2026-11-28) -> `sheet_dive2d_r16.jpg` (stills first; the hook render + splice into r15 wait for the owner / critics)
- **Redirect.** The first brief was "r16 (3D dive)": the real engine clouds (vicksburg/engine vclouds as in gm3d v6) over our basemap. Before
  anything was built the owner clarified: "the clouds should be suited for a 2D film". The current clouds read as realistic 3D volumes pasted
  on a painted 2D map and do not belong to Style W, and the dive is "not up to the level". So r16 drops the 3D-engine route (and the r13c-h
  emulation): the clouds are now PAINTED, made to match the Style W ink map.
- **Look** (`marion/tools/make_paint_clouds.py` -> `marion/kit/paint_clouds/*.webp`, 660 KB, no photos, no AI images): gouache sprites
  built from lobes (a union of circles) and value noise. Each has a soft dry-brush edge (stroke noise, 3 px feather) and 4 flat tones with narrow
  soft steps: a cream lit top (249,245,233), a mid tone (231,228,217), a cool shade (197,201,204) and a deep base (163,171,182). The light comes
  from the upper left, and the tone boundaries are jittered by horizontal brush strokes. There is slight pigment pooling inside the shaded edge,
  a faint broken sepia ink edge (alpha 0.3) and paper grain. Kinds: `c` = side-lit cumulus (6, the field), `m` = big side-lit masses (4, the
  near layer), `t` = masses seen from above (4, the deck and the wipe). Each kind has a `_s` soft half-size copy (blur 9 px; near the lens, at
  most 50-55 %) and a `_sh` silhouette for the ground shadow.
- **Engine** (`marion/kit/js/paint_clouds.js`, `PC.dive`): one 2D canvas between the map and the HUD. Each cloud has a map point and an altitude,
  and goes through the SAME transform as the map (#world translate/scale inside #bw-tilt perspective(1700) rotateX scale, origin 960 / 669.6),
  so the layers slide at their own speeds as the camera pushes in. Clouds grow, soften and fade near the lens. Their soft painted shadows
  (a cool wash, multiply, 22 %) sit down-right on the map. Layouts are authored in SCREEN px at a given time and placed by inverse projection.
  No canvas `filter` is used (it is unreliable on the GPU pods), and the sprites are a `buildReady` promise.
- **Dive** (camera path, tilt, narration, stamps, units, plaque all unchanged from r15):
  - 0-5.3 s: 12 painted cumulus in 3 layers (far 330 / mid 640 / near 1150 map px). The near layer is big and only at the frame edges.
    They are placed off the road, the ONE ROAD stamp, Charleston and the British boxes.
  - From "across the Santee" (5.25 s): 8 more clouds round the ferry (altitudes 300 / 460). They rush out past the lens during the fall, giving
    the parallax of falling through.
  - 5.75 s on: a painted deck of 7 top-view masses (altitude 150) grows in over Nelson's Ferry, and the lens falls into it.
  - SW 7.0 s +- 0.05: the wipe, 7 screen-space masses round the ferry plus a painted backing. They cover the swap, then part outward (ease-out,
    0.8 s) onto the ferry. This replaces the grey white-out.
  - Also new: a warm painted haze over the far edge while the view is steep (it replaces the engine's grey haze band).
- **Opt-in:** `build_scene.py --borrow --paint` (adds paint_clouds.js + the sprites, sets `GD.var.paint`). In `test-bw-hook-a.js` the old
  BW.gl clouds / dive / stratus block runs only without the flag. With the flag, BW.gl keeps only the guard's musket smoke (`hazeK` 0,
  `shadowK` 0). Other scenes and builds without `--paint` are unchanged.

## r15 musket smoke (critic A 8.5 on r14k) -> `stylew_borrow_test_r15_share.mp4` (m3f re-rendered on one RunPod RTX A5000; the rest = r14k frames 0-1169, the cut at 39.0 s after the D->C crossfade; audio = r14j stream-copied; 76.733 s, -14.0 LUFS, -1.9 dBTP)
- Sheet `sheet_smoke_r15.jpg` (r14k left, r15 right, crops at the critic's times); zoom `patch_6780_r14k_vs_r15.jpg` (67.8 s, x 1050-1500, y 250-400).
- Jets / one bar: volley 1 in 4 clumps (was 5; 5 merged) with groupW 0.18 (both volleys), the haze puffs' sideways offset x0.35 (`latK`),
  puffR 16-24, the wind from 0.8 s (`windAt`, `jetWindAt`): the clumps keep visible gaps through +0.8 s; jet cards grow <= 1.3x (`jetGrow`).
- Colour: jets and haze go white (235,233,228) -> grey (175,178,182) from 0.4 to 0.9 s of each shot (`greyAt`, `burstWhite`, `burstGrey`, `hazeGrey`).
- The rectangular patch: the haze pass hard-clamped its summed alpha at the 0.40 cap, so a wide overlap drew a flat slab with straight edges
  wherever the density crossed 0.40. Now a soft knee from 0.6 x cap (`capKnee`), and every haze card has a round mask feathered 30 px
  (`cardFeather`), a random rotation +-35 deg (`cardRot`; the textures are lit from the top, so not a full turn) and +-12 px vertical jitter (`jitterY`).
  All knobs opt-in (m3f only); m3d / hook scenes build unchanged.

## r14j audio (critic B 8.5 on r14i) -> `stylew_borrow_test_r14j_share.mp4` (r14 video stream-copied, 76.733 s, -14.0 LUFS, -1.9 dBTP)
- Why the buckshot ripple (66.56) escaped the tail rule: the rule did apply, but the ripple's quiet front (-27.5 dB vs -25.0) was pushed to the
  +2 dB later-ripple target (MUSKET_REL2), i.e. +17.9 dB into 5.5 dB of limiting: the 0.35 s front became a wall and its tail rode +12.4 dB,
  ringing into the narrator's pause (67.0-67.7). Fixes: MUSKET_REL2 0; the front limiter capped at 1.5 dB of reduction (`MUSKET_GRMAX`; the gain
  stops rising instead); the later ripples' front ducked 90 % under the voice after the limiter (`LATER_FRONT_DUCK`, r13's voice-keyed
  compressor did this); every tail fades -12 dB from its ripple's last shot (`TAIL_END_DB`), later ripples' tails -10 dB more (`LATER_TAIL_DB`).
- `tools/measure_buckshot.py` (fits the raw voice stem from scratchpad/vc into ANY mix, so r13 is measured the same way; 0.25 s windows;
  voice margin full band / 1-4 kHz; the mix's 2-4 kHz level after the ripple):

| mix | 66.5 | 66.75 | 67.0 | 2-4 kHz 67.3-67.7 |
|---|---|---|---|---|
| r13 | +23.4 / +14.1 | +5.6 / +8.1 | -1.7 / +1.9 | -52.3 |
| r14i | -1.6 / -7.4 | -9.5 / -3.1 | -14.2 / -9.8 | -40.5 |
| r14j | +13.3 / +5.6 | +1.2 / +6.9 | -2.2 / +1.7 | -58.3 |

- Gun: the crack was already on the final limiter's ceiling (+2 dB on its first 0.1 s changed nothing), so the first 0.1 s is made denser: a
  tanh soft clip at the gun stem's own peak (`CRACK_DRIVE` 3, 20 ms ramps); final limiter -2.2 dBFS. 50 ms peaks (mp4, stereo mean power):
  crack -4.4 (r14i -7.0), impact -7.1, narrator's loudest -8.6.
- Shot table (mp4, 0.35 s; vs r13): cannon -7.0 (+7.0), impact -11.1 (+3.9), volley 63.37 -12.0 (+5.2), volley 66.56 -16.9 (-0.1: the buckshot
  ripple is under the narrator now, as r13), voice only 40-44 -16.7 (-0.4).

## r14i audio (critic B 6.5 on r14h; impact pick = a, the 3D boom only) -> `stylew_borrow_test_r14i_share.mp4` (r14 video stream-copied, 76.733 s)
- Fire bed (29.2-33.6): the bomb4 fire left the pre-limited cannon stem (it was lifted ~4.5 dB there) and is its own stem at -13 dB (r13), ducked
  60 % under the voice: window total -15.8 dB (r13 -15.5, r14h -11.9); voice over the fire +19 dB in 1-4 kHz, +5 dB full band.
- Muskets: the loud "front" of a ripple = its first 0.35 s (`FRONT_S`; a 20-shot ripple's second shot comes 33 ms in, so the old front was one
  shot); the front is pushed to voice -1 dB (later ripples +2); the tail -12 dB and 75 % under the voice (`TAIL_DB`, `TAIL_DUCK`) and follows its
  front's gain minus the limiting (no squash-up). The tail after 63.75 s is back at r13's level (-14.2 vs -14.4).
- Cannon: the 3D gun is its own stem (voice +10 dB, ceiling -2 dBFS), its body after 0.30 s eased -12 dB over 0.2 s (it filled the strike's
  window, so the strike read as loud as the crack); the boom stem voice +1.5 dB. The crack is 2.8 dB over the impact window and 2.0 dB over the
  narrator's loudest 0.35 s (-10.4). Final limiter -2.6 dBFS (true peak -2.2 on the mp4).
- Shot table (mp4, mean stereo power over 0.35 s; change vs r13):

| mix | cannon 34.63 | impact 35.13 | volley 63.37 | volley 66.56 | voice only 40-44 s | LUFS | true peak |
|---|---|---|---|---|---|---|---|
| r13 share | -14.0 | -15.0 | -17.2 | -16.8 | -16.3 | -14.0 | -2.6 |
| r14h test | -8.8 (+5.2) | -8.4 (+6.6) | -12.9 (+4.3) | -12.9 (+3.9) | -17.7 (-1.4) | -14.1 | -2.7 |
| r14i share | -8.4 (+5.6) | -11.2 (+3.8) | -12.3 (+4.9) | -11.7 (+5.1) | -16.8 (-0.5) | -14.2 | -2.2 |

- Voice margins (`tools/measure_margins.py`: the final minus the gain-scaled pure voice stem = the rest; aligned for the limiter's 47-sample lookahead):
  hook-a 16.0-16.6 +17.3 dB (+12.0 in 1-4 kHz); fire 29.2-33.6 +5.1 (+19.3); tail only 63.75-64.1 -2.0 (+11.2); 66.95-67.8 is mostly a voice
  pause (the tail fills it; +0.7 dB in 1-4 kHz at the 67.0 word, was about -17).

## r14h audio (owner: the guns clearly louder, ONLY the 3D-film gun sounds) — audio only, not remuxed yet (the judges pick the impact first)
- Gun sounds: the 3D gun (goosegreen candidates/cand1_hit) on the flash frame, the 3D boom (cand2_hit) on the visible impact, the 3D fire
  (bomb4 lowpass 900) when the roof catches; the Jackson flintlock set for the muskets. No Style W kit cannon / impact cues (dropped).
- Mix chain rebuilt (advisor): loudnorm had fallen back to dynamic gain around the shots and cancelled every boost. Now: the compressors are
  keyed by the voice ONLY; the cannon stem and the musket stem are each pushed into their own limiter to a short-term level set against the
  window's voice (cannon = voice +11 dB, gun +4 over its boom; muskets = voice -2 dB per ripple, later ripples +2 (`MUSKET_REL2`), 100 ms max RMS);
  music bed 0.05 (was 0.08), ambience -27 dB (was -23); a static gain to -14.0 LUFS + one brick-wall limiter at -3.0 dBFS (AAC adds ~1 dB of
  true peak: -2.2 read -1.1 dBTP in the mp4). Temp files are per process and BLAS single-threaded (parallel builds had clobbered / spun).
- Coordinator's metric on the MP4s (mean stereo power over 0.35 s from each shot; `tools/measure_shots035.py`; dB, change vs r13):

| mix | cannon 34.63 | impact 35.13 | volley 63.37 | volley 66.56 | voice only 40-44 s | LUFS | true peak |
|---|---|---|---|---|---|---|---|
| r13 share | -14.0 | -15.0 | -17.2 | -16.8 | -16.3 | -14.0 | -2.6 |
| r14 share | -13.6 | -14.0 | -15.9 | -16.0 | -16.4 | -14.0 | -2.6 |
| r14h test (impact a) | -8.8 (+5.2) | -8.4 (+6.6) | -12.9 (+4.3) | -12.9 (+3.9) | -17.7 (-1.4) | -14.1 | -2.7 |

- Impact A/B (`impact_ab/`, README there): each variant is a full mix of the Fort Motte window (ONLY=test-bw-m3d, the extra inside the
  pre-limited cannon stem via IMPACT=path|filter|dB), cut to share 34.4-37.4 s and loudness-matched to -16 LUFS; extras level-matched to the
  boom -3 dB (100 ms max RMS). a = boom only; b = + bomb6 blast at 25.1 s, highpass 250 (CC0, USC Cinema / craigsmith); c = + sfx_thud (our own
  synthesized, belisarius); d = + cand4_hit lowpass 1.2 kHz (Kostrava, CC0). `impact_ab.mp4` plays a-d with the video (letter bottom-left).
- Final (after the judges' pick): rebuild with IMPACT=<pick>, stream-copy the video from the r14 share, verify 76.733 s and true peak <= -1.5.

## r13c clouds (critic A 7/7 on r13b) -> `sheet_clouds_r13c.jpg` + `clouds_r13c_hook_0-17.8.mp4` (RunPod A4000, 30 fps) + `clouds_r13c_dive_0-9s_25fps.mp4`
Coverage from a mask render (map hidden, clouds over black; `clouds_r13c_coverage.json`): 1-3 s 18 %, 4-5.3 s 11 % (corridor clear), 5.6 s 28 %,
5.9 s 35 %, 6.3 s 57 %, 6.45 s 85 %, 6.6 s 99 % (middle third 100 %). Fair tops ~(243,241,237), deck tops ~(222,224,224) (~10 % darker).
- Early field: n 56, med 30 (radius clamp rMin 12 / rMax 48 x F), diveClear 40 (the middle third gets clouds); no screenClear deletion. The road /
  ONE ROAD / Charleston corridor (`fair.corridor`): only the lumps that APPEAR over it (camera ray through the lump onto the ground, sampled over
  T_ROAD-0.6 .. TZ0+0.4) live in their own system that fades out while the trace/stamp/focus are on screen and back after. Brighter early light
  (sunK0 2.2, ambK0 0.3), bluer undersides (ambBot [0.42,0.46,0.54]). Two heights kept (near layer 1.6x drift); near + corridor fade 5.75-6.15 s.
- Ring artefacts fixed (opt-in `skirtCut`, build-time patch of the copied fx.js only): empty height-map columns had their base at the slab floor,
  so the noise drew faint white rings round every cloud at the floor.
- Round hole in the deck fixed: a fair cluster over a deck mass is moved to the top tier (its own system); on the far map its footprint replaced the
  deck columns (`__bwglDeckOverlap`).
- Deck: 6 big masses (massStep 22, lumps 28-40 x F, groupScale 2.2 = bigger lobes), no centre front erosion; density 0 -> 1 over 5.3-5.75 s and the
  erosion shrinks 0.8 -> 0.28 (5.9) -> 0.04 (6.3) -> 0 (6.45), so masses grow round (no stringy rims, no pop-in); `deckLook` grey hollows
  (ambBot [0.30,0.33,0.40], lightK 3.4). Inside: WO base rgb(205,205,200) at 0.8 (deck lumps show through); cream white-out unchanged.
- New knobs (all opt-in; hook-b / m3 scenes have no nearTier/corridor and build unchanged): corridor, skirtCut, rMin/rMax, sunK0/ambK0, ambBot[2],
  deckK/deckErode/deckFront, deckLook, massStep/massLump, groupScale, soft/group0, nearOp, dive.greyCol.
- Weak spot: at ~6.2-6.35 s a darker flat underside with a stepped lower edge shows at the bottom of the big mass for ~0.2 s.

## r13d clouds (critic A r13c 7.5 / 8) -> `sheet_clouds_r13d.jpg` + `clouds_r13d_hook_0-17.8.mp4` + `clouds_r13d_dive_0-9s_25fps.mp4` + `clouds_r13d_coverage.json`
- Ring / C-shape at 5.6-6.0 s: in r13c `deckFront`, `soft`, `group0` had landed inside a // comment, so the default centre front erosion (3.5 until
  6.5 s) ate the deck round the target. Now a small front (0.7 -> 0 by 5.8 s); soft/group0 stay at the defaults.
- Stepped notch / flat cut at 6.2-6.35 s: the deck lumps sat on two base heights (56 / 72 x F); now one deck base (`deckY` 62). The vclouds map
  bounds now always hold every lump.
- Ramp measured (mask): 5.3 10 %, 5.5 22 %, 5.7 32 %, 5.9 33 %, 6.1 41 %, 6.3 59 %, 6.45 88 %, 6.6 99.7 %; deck p15 undersides ~(141,143,147) at 6.3.
- Early field: units kept clear (`unitKeep`: lumps that APPEAR within 45 px + radius of the four British boxes, 0.3-5.3 s, are dropped), tighter
  clusters (`kidD`), n 84. NOT reached: 10 % (target 15-18 %), middle third ~0-2 % (units + road + diveClear sit there); near-layer clouds fade
  5.6-5.8 s as see-through ghosts; some right-side fair cumulus show radial shading streaks; one flat pillow top-left.

## r13e clouds: early field only (deck untouched) -> `sheet_clouds_r13e.jpg` + `clouds_r13e_hook_0-17.8.mp4` + `clouds_r13e_dive_0-9s_25fps.mp4` + `clouds_r13e_coverage.json`
- Why more clusters gave less cover (r13d): not the count. (a) Uniform WORLD placement crowds the far top of the 38-deg view and leaves the near
  half empty; (b) lumps whose world size is under ~2x the noise amplitude (5 x F) are eaten by the noise (debug overlay: many placed lumps drew
  nothing), worst on the 100 x F upper layer (smaller world size for the same screen size) - it rendered almost nothing; (c) r13d's hK 1.15 -> 1
  in the same step thinned every dome. Bounds clipping was ruled out (fitted bounds now opt-in `fitBounds`, off).
- Fix: `screenPlace` (clusters spread evenly over the frame at t 2.6, screen radius 45-110 px, each put where its pixel's ray meets its height),
  world floor rMin 22 x F, hMin 8 x F, upper layer 74 x F (nearTier 66, still 1.6x drift), erode0 -0.2, lumpK 0.22 (opt-in build patch: smaller
  dome-outline wobble, fewer radial ridges), kidZ 1.3 (rounder clusters in the tilted view). Taller domes (hMin 14, hK 1.5) gave striped/streaked
  clouds; erode0 <= -0.6 gave bubbly balls + crescent flakes: avoided.
- Upper layer fades 5.8-6.1 s, when the deck lies under it (no see-through ghosts over the map).
- Mask cover: 0.5-2 s 15 %, 3 s 14 %, 3.5-5.3 s 12.5-13 % (corridor fade), middle third 8-11 %; deck as r13d (5.5 24 %, 5.9 41 %, 6.3 63 %, 6.6 99.6 %).
- Debug: `window.BWGL_DEBUG` draws every fair lump (kept / corridor / upper / dropped / rejected) over the frame; `ct/dbgsnap.sh`-style local stills.

## r13f clouds: early field in loose groups + deck underside -> `sheet_clouds_r13f.jpg` + `clouds_r13f_hook_0-17.8.mp4` (30 fps) + `clouds_r13f_dive_0-9s_25fps.mp4` + `clouds_r13f_coverage.json`
- Field: 14 cumulus in 6 loose Poisson groups (`screenPlace.groups`: centres >= 460 px apart, keep off the British boxes, clouds within 160 px
  of their centre, lobes may overlap 0.55), log-normal radii 40-160 px (med 116, sigma 0.45), big clouds built from 4-5 lobes, mid 2-3, small 1-2
  (`lobes`). Drift raised to [0.8, -0.27] x F/s (far ~3 px/s, near layer 1.6x). Unit drop, corridor fade and the world size floor kept.
- Deck underside: deckLook ambBot [0.34,0.37,0.43] (the 6.3 s base patch lighter). A softer base (baseSharp 1.6) made the cumulus look like
  jellyfish (grey skirts): not used.
- Mask cover: 0.5-3 s 15.5 %, 3.5-5.3 s 13.7 % (corridor fade); deck 5.9 40 %, 6.3 60 %, 6.6 99.6 %.
- Weak spots: a few upper-layer clouds show a flat grey base (mushroom look) and some wedge / hook fragments; the bottom third has no group.

## r13g clouds: right-edge wings, bases, light -> `sheet_clouds_r13g.jpg` + `clouds_r13g_hook_0-17.8.mp4` (30 fps) + `clouds_r13g_dive_0-9s_25fps.mp4` + `clouds_r13g_coverage.json`
- `edgeKeep` {near 120, far 40, maxPx 260}: lumps checked at 0.5 / 2.5 / 5.0 s; upper-layer lumps must stay 120 px inside the right edge, lower
  ones 40 px, and any lump over 260 px on screen (too near the lens) is dropped: the torn paper wings at x 1600-1920 are gone.
- Bases: opt-in `baseRound` 0.3 (build patch: each lobe's base curves up toward its rim instead of the flat 0.06), undersides lifted
  (ambBot [0.46,0.50,0.58]); a few flat grey bases remain (the mushroom-like cloud north of the river crossing).
- Light: warm sun (sun0 [1.0,0.95,0.85], sunK0 2.05), cooler shade (ambTop0 [0.50,0.55,0.64], ambK0 0.24): lit tops ~(235,230,224) measured;
  ground shadows 25 % cast down-right (shadowDir [-0.22,1,0.56]; before they fell left).
- Mask cover: 0.5-3 s 10.3-10.7 %, 3.5-5.3 s 8.8 % (corridor fade): BELOW the 13-15 % target (edge + lens culling removed clouds; n 21 placed
  fewer than asked). Next: more groups (7-8) or larger med.

## r13h clouds (final cloud round): AUTHORED early field -> `sheet_clouds_r13h.jpg` + `clouds_r13h_hook_0-17.8.mp4` (30 fps) + `clouds_r13h_dive_0-9s_25fps.mp4` + `clouds_r13h_coverage.json`
- gm3d v6's field is procedural (gm3d/clip/index.html: 14 Poisson parents of 2-5 kids, lnr med 30 sigma 0.6, seed via hsh, 3 near-lens corner
  masses) in its own world; ported exactly (`v6Field`, kept, off) it lands mostly off our frame (different camera / map scale): not used.
- Used: `authored` = the v6 frame at 10.4 s traced into 12 clouds [screen x, y, radius px, lobes, layer] placed at screenPlace.t (x1.6 radius,
  `authoredK`); no unit / maxPx culling (only the right-edge cull); the corridor fade is a soft dip to 40 %; r13g light, round bases, shadows kept.
  Deck / inside / white-out / emerge unchanged from r13g.
- Mask cover: 0.5-3 s 8.0-8.7 %, 3.5-5.3 s 7.7 %; middle third ~1-2 % (v6's own layout is edge-heavy). The cloud moved off the Camden box still
  touches it in the render (its nudge used the probe camera, not the 2.6 s camera). Deck 5.9 39 %, 6.3 61 %, 6.6 99.7 %.
