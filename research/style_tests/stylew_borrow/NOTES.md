# Style W + borrowed 3D elements: 1-minute TEST (2026-11-27)

Owner decision (2026-11-27): back to the 2D Style W main style (STYLE_LOCK 2d/2e/2f), but BORROW elements from our 3D films
(`vicksburg/engine/`, approved looks `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` + `gm3d_clip_v6_share.mp4`).
Where a borrowed element overlaps one of ours, the borrowed one REPLACES ours. Everything else stays locked Style W.
**This is a test: nothing here is in STYLE_LOCK yet; apply only after the owner approves.**

- `stylew_borrow_test_share.mp4`: 62.7 s, 1920x1080, 19 MB, -14.0 LUFS (TP -1.4). Four windows of the published Marion #18, same voice (voice A) and words:
  film 0:00.0-0:17.8 (hook-1/2: dive, watch, guard's muskets) | 0:56.35-0:58.85 (name slam) | 1:11.45-1:15.85 (title) |
  13:21.5-13:59.5 (move 3, Parker's Ferry: date + seal, ambush volleys, result list). Joins = 0.08 s fades.
- `sheet.jpg`: 9 matched moments, published Marion (left, side key burned in as in the film) | this test (right).

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
