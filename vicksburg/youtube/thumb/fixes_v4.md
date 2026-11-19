# Vicksburg thumbnails v4: critic round 2 fixes, measured (2026-11-19)

Round 2 scored v3 at 8/10 for both (critic_MAIN.md / critic_ALT.md, "Round 2" sections). v4 applies the remaining fixes.
Scripts (from `vicksburg/`): `tools/make_thumb_v4_portrait.py`, `tools/make_thumb_v4_backdoor.py "CUT LOOSE." MAIN-BD` (+ `"5 BATTLES." OPT3-BD`),
`tools/make_thumb_v4_gm.py "CUT LOOSE." "THEN VICKSBURG FELL" ALT-GM`, `tools/make_thumb_v4_sheet.py`, `tools/measure_thumb_v3.py`.
Outputs: `vicksburg-v4-MAIN-BD-CUT_LOOSE.jpg`, `vicksburg-v4-ALT-GM-CUT_LOOSE.jpg`, `vicksburg-v4-OPT3-BD-5_BATTLES.jpg`, `sheet_v4.jpg`
(same layout as v3, last row v3 -> v4), `sidebar_v4.jpg`. Portrait cut-outs: `work_v3/grant_sepia_cut_v4.png`, `work_v3/grant_oil_cut_v4.png`.
No new vidIQ images (0 credits).

## MAIN (and OPT3, same scene)
| Fix | v3 | **v4** | Target |
|---|---|---|---|
| R2-1 arrow curve (sagitta over the chord) | ~straight diagonal | **80 px** bulge, `[(735,505),(770,320),(540,222),(352,92)]` | >= 60 px |
| R2-1 arrow vs red blocks | covered the block at (490-520,285-300) | **blocks moved off the path** ((440,292)->(410,294); (500,240) 6 cols -> (474,244) 4 cols; (560,282) -> (500,284) 5 cols) | none covered |
| R2-2 head vs VICKSBURG tag | 0-5 px, tip on the tag corner | **55 px clearance; tip at (354,95) in the town**; tag moved to (34,112) | >= 15 px, tip y <= 115 |
| CHAMPION HILL tag | (560,300), would sit on the new arrow path | **(36,330)**, under the crest on the left, still 28 px | clear of the arrow |
| R2-3 blue formations | 1-2-row strings 11x7 | **7 formations of 2 x 5-6 blocks, 13x8, gap 2; blue 1.16 % of BF** | 6-7 formations, 12-13x8, 1.1-1.3 % |
| Red blocks | 1.39 % | **1.55 %** (Marion 0.99 on my detector) | threat |
| R2-4 contrast 1.06 on the battlefield | BF L sd 22.4 | **23.7** (Grant pub 24) | ~24 |
| R2-5 ear blotch (x 1190-1250, y 160-250) | faint darker patch at 4x | **2 px feathered blur in the source** (checked at 4x) | gone |
| Battlefield S / R-B / b* / L | 30.1 / +30.2 / +10.4 / 42.4 | **31.5 / +31.9 / +11.1 / 43.7** | 30-35 / +25-30 / 9-11 / 40-44 (the 1.06 contrast nudged R-B and b* ~1 up) |
| Fire / sky / tags / portrait / band | as v3 | unchanged (fire 0.51 %, no sky, VICKSBURG 33 px, hair 15 px from the top, right column L 34, sleeve over the band end) | |

## ALT
| Fix | v3 | **v4** | Target |
|---|---|---|---|
| Grant lowered | head top y 110, 85 %H | **head top y 179, 75 %H**; face (brow) at y ~333 | ~y 180, 75-78 %H |
| Word height | 173 px (24 %H) | **196 px (27.2 %H)** | >= 195 |
| Word width / slot | 977, x 290-1267 | **1123, x 145-1268**: in front of the hair top (as in GM "HE WON."), 115 px clear of the brow, never over the face | slot from x ~200 (1060) |
| Stem / height | 27 % (47 px) | **27.0 % (53 px)** | >= 27 % |
| O openings (mid-row) | 8-16 px slits | **16 px** | >= 18 |
| Letter gaps | 9 px | **8 px** | >= 8 |
| Word ink | 11.8 % | **14.9 %** (M 13.1, G 15.4) | ~ M/G |
| Dilation / tracking / stretch | MaxFilter 11, +12, 1.1x | **MaxFilter 7, +4, 1.22x** | MaxFilter 7, +6 |
| Mississippi to seal centre | 124 px | **86 px** (touches the rim on its north-west side: Bruinsburg on the river) | 75-90 |
| Beard | ginger | **sandy-brown: sat x0.8, red -3 %, beard outline only; mean RGB (141,101,69) -> (129,101,75)** | sat x0.8, red -6 % |
| Eyes | | **10 % darker** (RGB (122,88,64) -> (110,79,58)) | ~10 % |
| Subtitle fill | (232,220,192) | **(240,228,200)** | (240,228,200) |
| 168 px luminance std | 69.7 | **75.0** | >= 72 |
| Arrow / warm accent / payoff / seal | 1.02 % / 1.40 % at x 1041 / 380 px at x 1080 / R66 | **1.00 % / 1.40 % at x 1043 / same / same** | unchanged |
| Mean grey / sat | 74.1 / 129 | **79.8 / 129** (bigger cream word) | M 74 / 140 |

### Where v4 deliberately departs from the round-2 numbers
- **Word slot 1123 px instead of ~1060, tracking +4 instead of +6, O openings 16 instead of 18.** Anton is the only heavy condensed face
  available (the recipe font; nothing heavier is installed). An exhaustive search (height 180-216, stretch 1.0-1.3, tracking 4-8, MaxFilter 5-9)
  found no setting that gives a height of at least 195, stems of at least 27 % AND O openings of at least 18 inside 1060 px. Anton's O counter
  is the limit: even at 1.25x stretch it stays at 16-17 px. Inside 1060 px the best was 200 px tall but only 24.5 % stems and 14 px Os.
  I chose height + stems + gaps and placed the word from x 145, in front of the hair top. That is the critic's "word over the head, the GM way".
- **Beard red -3 % instead of -6 %.** With -6 % on top of the v3 skin calming, the beard read grey-olive next to the skin. With -3 %
  it reads sandy-brown, as in the Brady photo.
- **MAIN R-B +31.9, b* +11.1** after the optional contrast 1.06: about 1 over the round-1 bands. I kept the contrast because the critic
  asked for it at feed size.
