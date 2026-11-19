# Vicksburg thumbnails v6: critic round 3 fixes (2026-11-19)

Round 3: MAIN narrow FAIL (8/10 look, 7/10 click), ALT FAIL (7/7). In both, the arrow did not show the "wrong way" move.
Outputs: `vicksburg-v6-MAIN-BD-WRONG_WAY.jpg`, `vicksburg-v6-ALT-GM-WRONG_WAY.jpg`, `sheet_v6.jpg` (ours vs the 3 locked references at full/360/168 px,
v5 -> v6 row), `sidebar_v6.jpg` (MAIN under an A-style title stating the win: "Grant's Vicksburg Campaign | The Man Who Took Vicksburg", mock only).
Scripts (from `vicksburg/`): `tools/make_thumb_v6_backdoor.py "WRONG WAY." MAIN-BD`, `tools/make_thumb_v6_gm.py "WRONG WAY." "THEN VICKSBURG FELL" ALT-GM`,
`tools/make_thumb_v6_sheet.py`. No new vidIQ images (0 credits).

## MAIN
| Fix | v5 | **v6** | Target |
|---|---|---|---|
| M1 arrow = the move | curve into Vicksburg, apex ~200 px below JACKSON | **one arrow from the blue columns (470,505) EAST under burning Jackson, back WEST along the railroad; `[(470,505),(900,300),(790,78),(318,118)]`, 60 -> 44 px** | east to Jackson, then back west |
| Rightmost arrow pixel | 745 | **766** | < 850 (portrait) |
| Arrowhead tip | (400,130) | **(383,111), on the Vicksburg buildings** | on the town (330-400, 110-130) |
| Clear of the VICKSBURG tag | | **115 px** | >= 15 |
| Clear of the JACKSON tag | | **50 px**; the burning town lies between tag and arrow | 10-20 px: I kept 50 so the arrow does not cover the Jackson fire. At 168x94 the bend still visibly runs under JACKSON (sheet) |
| M2 glow discs | 5 round orange radial glows | **gone**: 3 small irregular 9-point muzzle flashes (6-7 px, no halo) + grey gunsmoke puffs (blur 7) | no radial falloff |
| S1 Jackson reads east | tag (560,60), over the town | **tag moved to (676,22), right of / above the fires**; Jackson's painted flames brightened 1.35x = the 2nd warm spot after the band | further right, brighter fire |
| R3-risk (twin of the published Grant) | same panel pixel for pixel | **panel 5 % tighter** (zoom 1.05 about the face) + the new arrow + the burning Jackson focal | differs from Back Door |
| Colours vs published Grant (BF) | S 35.6, R-B +27.7, b* 10.8, L 38.2, sd 23.7, green 3.8 % | **S 35.2, R-B +25.7, b* 10.2, L 38.3, sd 25.0, green 4.5 %** | 34.9 / +27.0 / 9.6 / 36.0 / 23.6 / 4.8 (all within ~6 %) |
| Orange (% BF) | 1.8 (incl. the discs) | **0.7** (fires only) | published 3.2: lower now that the fake discs are gone |
| Band / word / portrait | | unchanged (critic: pass) | |

## ALT
| Fix | v5 | **v6** | Target |
|---|---|---|---|
| 1 One hooked arrow | sagging hop from seal to town | **seal -> EAST along the bottom -> apex at Jackson (~1196, 630) -> curls back WEST into the town's right flank** | the U-turn |
| East extent past the payoff centre | 0 | **+264 px** (x 1204 vs 940) = 35 px at 168 px wide | >= 200 px |
| Head heading | ~0 deg (east) | **207 deg** (west-north-west) | 150-240 deg |
| Arrow area | 0.96 % | **1.48 %** (my detector; 1.41 % by polygon) | 1.1-1.5 % |
| Clearance BRUINSBURG / VICKSBURG / seal centre | | **58 / 57 / 72 px** | >= 70. The labels sit 58/57 px clear: the outbound leg has to pass between the seal label and the town label in ~120 px of height. With a lower leg, BRUINSBURG fell to 46 px |
| Jackson | none | **small painted flame at the apex (cropped from the vidIQ fire, no plate, ~46 px) + JACKSON 24 px** | optional, <= 26 px |
| Payoff | 380 px at x 1080 | **330 px, centre ~(940,440)**, VICKSBURG label (Cinzel 40) under the town at y 528 | ~330 px at (930-960,440) |
| 2 Word vs head | word over the crown (y 213 vs hair 180) | **word bottom y 178, hair top y 199 = 21 px clear** (Grant 20 px lower, 72 %H; word top y 16) | >= 12 px |
| 3 Word weight (critic's run measure) | 191 px, stem 23.6 %, O ~10-12, mid-row gaps 2-4 px | **162 px tall, stem 25.9 % (42 px), O opening 16 px, mid-row letter gaps >= 11 px, G and R open** (Anton, stroke 1, 1.25x stretch, tracking +2, no dilation; 1108 px wide) | stem >= 26 %, O/G >= 16, gaps >= 8 |
| Word height | 26.5 %H | **22.5 %H** | 27-30 % |
| Nice-to-have river cue | | 2 px bright core on the Mississippi, which runs off the bottom-left past Bruinsburg | |

### Word trade-off
I searched every combination of height 156-188, stretch 1.0-1.4, tracking 0-16 and stroke 0-6 within the ~1130 px slot above the lowered Grant.
No setting meets stems >= 26 % AND O/G >= 16 px AND gaps >= 8 px at 185-195 px tall. Anton's O and G counters close as soon as the
strokes thicken. The critic's suggestion (stroke 4, 1.15x, 184 px) measured stem 25.9 %, O 11 px, gaps 3 px: letters touching.
I chose weight, open counters and spacing, at 162 px tall. The word is still the biggest element in the frame and reads first at 168 px.
The hair stays clear of it.
