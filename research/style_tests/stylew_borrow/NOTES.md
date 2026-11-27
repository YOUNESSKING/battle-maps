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
