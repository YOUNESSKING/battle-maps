# Vicksburg thumbnails v3: critic fixes, measured (2026-11-19)

Fixes every point of `critic_MAIN.md` and `critic_ALT.md` (both scored v2 5/10 "looks like the reference").
Outputs: `vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg`, `vicksburg-v3-ALT-GM-CUT_LOOSE.jpg`, `vicksburg-v3-OPT3-BD-5_BATTLES.jpg`,
`sheet_v3.jpg` (ours next to Marion MAIN / Marion ALT / Grant published at full, 360x202 and 168x94 + a v2 -> v3 strip), `sidebar_v3.jpg`.
Scripts (run from `vicksburg/`): `tools/make_thumb_v3_portrait.py`, `tools/make_thumb_v3_backdoor.py "CUT LOOSE." MAIN-BD`,
`tools/make_thumb_v3_backdoor.py "5 BATTLES." OPT3-BD`, `tools/make_thumb_v3_gm.py "CUT LOOSE." "THEN VICKSBURG FELL" ALT-GM`,
`tools/make_thumb_v3_sheet.py`, and `tools/measure_thumb_v3.py main|alt <img...>` (the numbers below). Inputs in `thumb/work_v3/`.

## New painted inputs (vidIQ `generate_thumbnail`, purpose "image", 3 x 22 = 66 credits)
Local reference files cannot be passed: `referenceImages` takes only a hosted URL or an inline base64 data URI (a library imageId is
refused), so the look was described. The ALT portrait repaint used the LoC-hosted jpeg as its reference (a hosted URL works).
1. `work_v3/bg_vidiq_champion_v3.jpg`: "Warm golden-sepia painted aerial view like a detailed historical oil painting. Steep oblique
   top-down camera, NO SKY and NO HORIZON ... Champion Hill, 16 May 1863, looking west ... dusty dirt roads with warm brown dust ... long
   wooded ridge crest with a burning wooden farmhouse, orange flames and a thick black smoke column, two smaller fires, white gunsmoke
   along the crest ... upper-left, far away, a small 1860s town of brick buildings and church steeples high on steep earthen bluffs, with
   the wide brown Mississippi running along the very top edge behind the town ... No soldiers, no people, no flags, no text."
   Checked: town on the EAST bank (river behind it, viewer = east), no sky, no people/flags/text/modern objects.
2. `work_v3/icon_vidiq_vicksburg_dusk_v3.png` (transparent): Vicksburg on its steep bluff at dusk, lamplit windows, a few buildings
   burning, smoke of the bombardment, oil-painting look, no people/flags/text.
3. `work_v3/grant_oil_vidiq_v3.jpg`: oil repaint of LoC 2018666428 (reference https://tile.loc.gov/storage-services/service/pnp/cwpb/06900/06941v.jpg),
   face, pose, uniform and the two-star strap kept (checked side by side with the photo); cut with rembg isnet (`grant_oil_cut_isnet.png`).

## MAIN (Back Door) before / after / target
Same detectors on all images (`measure_thumb_v3.py`). Where my detector reads a reference differently from the critic's, the reference
value on MY detector is given so the comparison stays like for like. BF = battlefield x<780, y<520.

| Metric | v2 (critic) | v2 (re-measured) | **v3** | Target (critic) | Marion / Grant pub (my detector) | |
|---|---|---|---|---|---|---|
| BF saturation S | 15 | 15.2 | **30.1** | 30-35 | 49.5 / 34.9 | OK |
| BF warmth R-B | +9 | +8.7 | **+30.2** | +25-30 | +64.4 / +27.0 | OK (top edge; fire + red blocks add ~1) |
| BF b* | +3.8 | +3.8 | **+10.4** | +9-11 | +22.8 / +9.7 | OK |
| BF lightness L | ~40 | 40.4 | **42.4** | 40-44 | 48.8 / 36.0 | OK |
| Whole frame L / sd | 42 / 27 | 42.5 / 27.3 | **46.0 / 25.1** | ~ Marion 44 / 25 | 44.0 / 25.5 | OK (2 brighter) |
| Sky | grey sky y 0-95, L61 | top-15% bright window 0.77 | **no sky; window 0.30** | no 300x60 region of L>58 in the top 15% | 0.67 / 0.39 | OK |
| Fire (hot flame core, % BF) | 0.00 | 0.00 | **0.49** | >= 0.3 | 0.15 / 0.02 | OK: burning farmhouse on the crest + black column + glow |
| Smoke / dust | 1 column | | **black column + gunsmoke along the crest + 5 musket puffs + dust under the blue** | fire + smoke + dust | | OK |
| Blue blocks (% BF) | 2.4 | 2.55 | **1.09** | 1.0-1.3 | 0.63 / 0.29 | OK, 2 rows, on the two roads, colour (40,66,135) |
| Red blocks (% BF) | 0.6 | 0.64 | **1.39** | 1.5-2 on the critic's scale (Marion 1.9) | 0.99 / 0.36 | OK: 1.4x Marion on the same detector; 9 formations on the crest + slope, 11x7 blocks |
| Arrow | vertical hook out of the band at x 610, from no unit | | **starts at the blue column (735,500), one diagonal sweep over the red line, head at (372,178) beside the VICKSBURG tag under the town; 62 -> 44 px** | from the troops, over the line, into the town | | OK |
| White plantation house (L44) | at (430,400) | | **gone** (new scene) | nothing brighter than troops/arrow mid-field | | OK |
| VICKSBURG tag | 44 px | | **33 px** | 32-34 | 30 | OK |
| CHAMPION HILL tag | 28 px | | **28 px** | 28 | | OK |
| Band / word | h185, to x815, collides with the sleeve | | **word kept at 168 (cap 145 = 20 %H); portrait drawn AFTER the band: sleeve (x 764) overlaps the band end (x 819) cleanly with its shadow** | >= 40 px gap OR sleeve overlapping cleanly (critic fix 11, 2nd option) | | OK |
| Portrait scale / brow-chin | s 0.60, ~240 px | | **s 0.66, ~264 px (37 %H)** | ~265 (37 %H) | | OK |
| Headroom (hair to top) | ~65 px black | | **15 px** | <= 15 | | OK |
| Panel | from x800, alpha 1.0 | | **from x840, ramp 180, alpha 0.85** | same | | OK |
| Right column L (x>=1200) | 21 | 26.9 | **34.0** | 28-34 | 37.2 / 15.6 | OK |
| Halo | soft matte + warm rim 0.6 | | **hard matte (erode 7x7, threshold 128, Gaussian 3x3), no rim; ring 1-2 px L 12.5 vs 9.9 further out = no light ring** | no ring > 1 px at 4x | | OK (checked at 3x/4x zoom) |
| Insignia | mirrored strap box at x 1215-1280 | | **strap painted out with sleeve texture; dust specks at the ear removed** | none | | OK |
| Face highlights | L mean 82, p95 93 | | **76 / 86** | p95 ~86 | 45 / 67 (oil) | OK |

## ALT (Grand Maneuver) before / after / target

| Metric | v2 (critic) | v2 (re-measured) | **v3** | Target | Marion M (my detector) | |
|---|---|---|---|---|---|---|
| Mean grey | 75.5 | 73.3 | **74.1** | ~ M | 74.0 | OK |
| Mean saturation (HSV 0-255) | 143 | 143.6 | **129.0** | ~ M 140 | 140.5 | a little lower (smaller arrow, calmer portrait) |
| Letter stem | 38 px = 19 % of height | 38 = 18 % | **47 px = 27 %** | >= 27 % | 57 = 27 % | OK |
| Gap between letters | | | **>= 9 px, counters open** | >= 8 px | | OK |
| Word size | 897x203 (28 %H) | | **977x173 (76 %W, 24 %H)**, ink 11.8 % of frame | ~ M 930x214 | ink 12.8 % | trade-off: 9 glyphs cannot take M's 1.35x stretch in the 960 px slot. Searched height/stretch/tracking/dilation: the tallest word with stems >= 27 % and gaps >= 8 px is 173 px (tracking +12, 1.1x, MaxFilter 11). MaxFilter 17 at full height (critic option b) closed the O counters and merged letters (rejected after a look) |
| Subtitle | 5 BATTLES IN 18 DAYS | | **THEN VICKSBURG FELL** | a "THEN ..." twist | THEN TARLETON TURNED BACK | OK (true: decision 3 May, surrender 4 July 1863) |
| Light-blue arrow area | 2.42 % | 2.50 % | **1.02 %** | 0.9-1.2 % | 0.89 % | OK |
| Arrow shape | loop east and back west, head pointing LEFT mid-frame | | **one arc from the seal bowing down (inland, east of the river) to the payoff, left to right; head ~130 px before the icon centre** | one L-to-R arc | | OK |
| Payoff | 236 px at x 735 (under the word), daylight | | **380 px at x 1080, dusk, burning, bloom + hot core** | >= 360 px, x > 1000 | ~380 at x 1090 | OK |
| Warm accent | 0.34 % at x 748 | 0.41 % at x 738 | **1.40 % at x 1041** | >= 1.0 %, centroid x > 1000 | 0.39 % at x 1070 | OK |
| Seal | R58 | | **R66** at (615,590) | R66 | R66 at (560,585) | OK (55 px right of M so Grant's broad coat leaves BRUINSBURG clear) |
| Labels / blocks / star | 4 labels + star, 4 blocks | | **2 labels (BRUINSBURG, VICKSBURG, Cinzel 40), 0 blocks, no star** | 2 / 0 / 0 | 2 / 0 | OK |
| Mississippi | 7 px core, 26 px glow, crowds the seal | | **5 px core, 20 px glow (alpha 120), 124 px from the seal**; map turned north up-right, both towns on the east bank | thinner, >= 70 px from the seal | | OK |
| Portrait | synthetic tint, blue rim, ear fringe, specks, cream strap blob | | **oil repaint of the same LoC photo, hard 2 px matte, no rim; ring 1-2 px RGB (20,22,31) vs (12,23,41) further out = no blue halo** | no halo >= 2 px at 400 % | | OK (checked at 4x zoom) |
| Skin | pale, flat | | **mean RGB (199,149,110)** | ~ (200,150,115) | | OK |
| Strap at the left edge | cream blob | | **toned: p99 grey 183 (buttons 173)** | ~ button level (~190) | | OK |
| Coat | saturated royal blue | | **navy, saturation x0.8; the arrow is the only bright blue** | darker than the arrow | | OK |
| Portrait height | 89 %H | | **85 %H** | ~ M 89 % | | close |

## Words
- MAIN: **CUT LOOSE.** kept (FACT_NOTES §19: Grant's "cut loose from my base", 3 May; "cut loose altogether from my base", 12-13 May).
- ALT: **CUT LOOSE.** + **THEN VICKSBURG FELL** (§19). Thick word as above.
- OPT3 (Back Door, same scene): **5 BATTLES.** (§19 / §13 Count of battles/days).
- Shorter ALT word (<= 6 characters): none offered. No true word of that length in FACT_NOTES passes the 0c contradiction test;
  "NO BASE." (true paraphrase of the same Grant line) is 8 characters, so it would not fix the width problem either.
