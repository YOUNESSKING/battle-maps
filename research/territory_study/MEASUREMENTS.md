# Territory-colour study: how other channels colour who controls the ground

Sources: YouTube auto frames (hq/maxres/sd 1-3 = about 25/50/75 % of each video), 108 frames downloaded from 36 popular long-form videos in `research/territory_study/frames/` (6 to 9 videos per channel, picked with vidIQ `channel_videos` popular=true plus video H2xV6FnbSkQ = Kings and Generals "Why Spain Collapsed Into Civil War"). 25 frames kept (maps; 15 with territory fill, 10 map frames with no fill kept as reference). All frames normalised to 1280x720 before measuring. Ours: `sherman/scenes/test-E2-current/tone/` frames at 8 s, 19.5 s, 106 s.

**Method.** For each kept frame I placed one *base* box on unfilled ground (or on the sea when the frame has no unfilled land, marked "sea") and one box inside each side's fill (checked on an overlay), then took median RGB. Columns: luma = Rec.709 0-255; sat = HSV saturation 0-1; C* = CIELAB chroma; dC = fill C* minus base C*; dL = fill L* minus base L* (negative = fill darker than ground); dE = CIE76 distance fill-vs-base (about 2 is invisible, 10 clear, 40+ strong); tex = mean absolute high-pass luma (blur sigma 3, 1280 px) inside the box, a flat fill is below 2, real terrain 4-18; coloured share = fraction of the frame nearer to a fill colour than to the base (dE below 22). Box sampling is by eye, so treat single numbers as about +/-15 %. **Ours has no unfilled ground in the frame**, so its base is the documented close-up land median (104,116,107) from MAP_COLOUR_IDEAS 1.1.


## Tactical Genius (our format model)

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TG tVpl949Nk0M_2 (Korea) | 132 | #5e7d9a / 121 / 0.39 | (no fill) | - | - | - | - | - | - | - | 17.7 (base) | 0 % |
| TG BvJN3pyPL6E_2 (Moscow) | 166 | #8db4bb / 172 / 0.25 | (no fill) | - | - | - | - | - | - | - | 13.4 (base) | 0 % |
| TG 5EoX2EYJ_WI_1 (Patton) | 148 | #b39163 / 149 / 0.45 | (no fill) | - | - | - | - | - | - | - | 7.8 (base) | 0 % |
| TG aABPyQHW3tI_2 (Alamein) | 114 | #a97b44 / 129 / 0.60 | (no fill) | - | - | - | - | - | - | - | 2.8 (base) | 0 % |
| TG i1sWghFIvZE_2 (Kerch) | 137 | #75a365 / 149 / 0.38 | (no fill) | - | - | - | - | - | - | - | 10.7 (base) | 0 % |
| TG sS3zjo1Dibo_2 (Sedan) | 110 | #638b5a / 127 / 0.35 | (no fill) | - | - | - | - | - | - | - | 16.8 (base) | 0 % |

## The Operations Room

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| OpsRoom UoynTOzLD28_2 (Bulge) | 127 | #647e70 / 119 / 0.21 | enemy rim pink-red | #896356 | 106 | 0.37 | 19 | 6 | -5 | 28 | 11.6 | red-ish px (a*>8,C*>15) 6% |
|  |  |  | inside zone | #7d8b6c | 134 | 0.22 | 19 | 5 | 6 | 12 | 4.9 |  |
| OpsRoom HhVaI38dvco_2 (Guadalcanal) | 105 | #2f5b68 / 83 / 0.55 | land interior | #79a270 | 150 | 0.31 | 32 | 16 | 26 | 45 | 1.7 | red-ish px (a*>8,C*>15) 4% |
| OpsRoom 42Je15vVtlQ_2 (Carentan) | 209 | #c9d2bf / 207 / 0.09 | (no fill) | - | - | - | - | - | - | - | 4.2 (base) | 0 % |

## Kings and Generals (incl. Spanish Civil War H2xV6FnbSkQ)

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| KG Aupnv5n19K4_3 (Stalingrad) | 85 | #4c2c1d / 50 / 0.62 | Soviet red | #601411 | 36 | 0.82 | 41 | 20 | -2 | 22 | 0.1 | n/a (box unreliable) |
|  |  |  | Allied gold | #f8d362 | 211 | 0.60 | 59 | 39 | 64 | 79 | 7.9 |  |
| KG hHqJ6pgdE-c_3 (Six-Day) | 74 | #2a4354 / 63 / 0.50 | Arab rose | #9d4e53 | 95 | 0.50 | 36 | 22 | 16 | 48 | 1.7 | 40 % |
|  |  |  | Egypt yellow | #6e662b | 99 | 0.61 | 34 | 20 | 16 | 50 | 6.0 |  |
| KG H2xV6FnbSkQ_3 (Spain 1936) | 106 | #9b8877 / 139 / 0.23 | (no fill) | - | - | - | - | - | - | - | 15.8 (base) | 0 % |

## Epic History TV

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EHTV bhQe2cjr5XQ_1 (Austerlitz) | 114 | #a98a89 / 145 / 0.19 | France blue | #4f5d8a | 93 | 0.43 | 28 | 15 | -20 | 38 | 5.2 | 74 % |
|  |  |  | Russia red | #893b53 | 77 | 0.57 | 36 | 23 | -24 | 34 | 0.4 |  |
|  |  |  | Austria red | #9c3f51 | 84 | 0.60 | 41 | 29 | -20 | 36 | 0.4 |  |
| EHTV PbwH1ZBnYds_1 (WW1 1914) | 61 | #273749 / 53 / 0.47 | Serbia lighter grey | #636363 | 99 | 0.00 | 0 | -13 | 20 | 24 | 5.0 | 38 % |
| EHTV PbwH1ZBnYds_3 (S.Africa) | 79 | #5a493f / 76 / 0.30 | German SW Africa lilac | #807b9a | 126 | 0.20 | 18 | 8 | 21 | 32 | 2.3 | 22 % |
| EHTV lLvqZ1ufLwk_3 (Cold War) | 119 | #dce0e3 / 223 / 0.03 | USSR red | #9a2e3b | 70 | 0.70 | 49 | 47 | -53 | 73 | 1.9 | 65 % |
|  |  |  | West blue | #6a8aab | 134 | 0.38 | 21 | 19 | -33 | 38 | 2.2 |  |
| EHTV l0zRU35sovQ_2 (1814) | 88 | #6d503d / 85 / 0.44 | (no fill) | - | - | - | - | - | - | - | 8.3 (base) | 0 % |

## Historigraph

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Historigraph 725BIb0dtrQ_1 (Atlantic) | 50 | #082954 / 37 / 0.90 | Canada red | #802a27 | 60 | 0.70 | 43 | 13 | 14 | 61 | 0.8 | n/a (box unreliable) |
| Historigraph 725BIb0dtrQ_3 (Europe) | 103 | #cdcbf3 / 206 / 0.16 | Allies blue | #1d398c | 57 | 0.79 | 54 | 32 | -56 | 65 | 2.4 | 62 % |
|  |  |  | USSR red | #8f1d1c | 53 | 0.80 | 56 | 35 | -52 | 81 | 1.0 |  |
|  |  |  | Germany dark olive | #2b362c | 51 | 0.20 | 9 | -13 | -62 | 68 | 11.8 |  |
| Historigraph AlCf3OEe4ms_1 (Hungary) | 89 | #385338 / 75 / 0.33 | Hungary green | #47a934 | 140 | 0.69 | 71 | 50 | 29 | 58 | 12.4 | 53 % |
|  |  |  | Soviet red | #851d20 | 51 | 0.78 | 51 | 30 | -3 | 61 | 3.8 |  |
| Historigraph AlCf3OEe4ms_2 (front) | 80 | #51604a / 91 / 0.23 | Soviet red | #823834 | 71 | 0.60 | 36 | 21 | -5 | 43 | 4.9 | 71 % |
| Historigraph PBzsYDwftoo_2 (Bulge) | 64 | #283727 / 51 / 0.29 | Soviet red | #560b08 | 27 | 0.91 | 40 | 27 | -5 | 46 | 1.8 | 44 % |
| Historigraph PBzsYDwftoo_3 (Bulge) | 71 | #253624 / 49 / 0.33 | Soviet red | #560f11 | 30 | 0.83 | 37 | 23 | -3 | 45 | 6.4 | 39 % |
| Historigraph XtUi-VE558I_2 (Norway) | 57 | #1f2c4f / 44 / 0.61 | Norway green | #265b22 | 76 | 0.63 | 41 | 17 | 15 | 64 | 4.1 | 22 % |
|  |  |  | Britain blue | #334b7a | 73 | 0.58 | 30 | 6 | 14 | 15 | 7.7 |  |

## Ours (test-E2-current, Sherman/Atlanta)

| frame | frame luma | base (hex / luma / sat) | side | fill hex | luma | sat | C* | dC | dL | dE | tex in fill | coloured share |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| frame-00-at-8s.png | 82 | #68746b / 113 / 0.10 | Union blue | #5a6d78 | 106 | 0.25 | 10 | 2 | -3 | 12 | 7.0 | 86 % |
|  |  |  | Confed red | #673c37 | 69 | 0.47 | 21 | 14 | -17 | 31 | 9.4 |  |
| frame-01-at-19.5s.png | 78 | #68746b / 113 / 0.10 | Union blue | #50626e | 95 | 0.27 | 10 | 3 | -7 | 15 | 8.9 | 87 % |
|  |  |  | Confed red | #5e342f | 61 | 0.50 | 21 | 14 | -21 | 33 | 6.2 |  |
| frame-02-at-106s.png | 79 | #68746b / 113 / 0.10 | Union blue | #627783 | 115 | 0.25 | 10 | 3 | 1 | 13 | 6.6 | 88 % |
|  |  |  | Confed red | #76443e | 78 | 0.47 | 24 | 17 | -13 | 32 | 5.0 |  |
## What each channel does (from the numbers and from looking at the frames)

| channel | fill type | flat or see-through | saturation / key | borders |
|---|---|---|---|---|
| **Tactical Genius** (format model) | **No territory fill at all** in 6 of 6 map frames. Control is shown by flag + portrait on a pole and square unit icons (red/blue/grey). The only area marks are thin pink dashed front lines (Sedan) and orange route lines | the map is 100 % real shaded relief, texture 3-18 | **bright daylight base**: frame luma 110-166, base chroma C* 14-39 (earthy tan, teal sea, green) | none needed; dashed pink line only |
| **The Operations Room** | **No fill.** Bulge: a single white curved front line and a soft red-pink *gradient rim* just inside it (rim dC +6, dE 28, inside zone dE 12 from base). Guadalcanal: faint red glow on the coast only. Carentan: no colour on the ground at all, only unit boxes | fully see-through (relief texture 5-12) | **light and desaturated**: frame luma 105-209, base sat 0.09-0.55, ground C* 11-16 | one white line, soft gradient, no hard edge |
| **Kings and Generals** | flat saturated political fills (Stalingrad Europe: red USSR, gold neutrals, black Axis regions on parchment; Six-Day rose/yellow); Spanish Civil War H2xV6FnbSkQ itself has **no fill** (muted brown relief, portraits, unit chips) | flat (tex under 2 on the fills) with a parchment grain and strong vignette | dark and warm: frame luma 74-106, fills C* 34-59 | dark ink outlines per region |
| **Epic History TV** | Austerlitz/Cold War: political pastel-to-medium fills; WW1 and 1814: tone shift only, no colour fill, campaign arrows carry the story | Austerlitz: fills carry the ocean texture (France tex 5, Russia 0.4: mixed); Africa: translucent lilac over relief | the **gentlest fills**: Austerlitz C* 28-41, dC +15 to +29 on a pale warm base (luma 145); Cold War red is much stronger (C* 49, dE 73) | thin same-hue outline with soft inner edge |
| **Historigraph** | translucent saturated red over satellite (Hungary, Bulge) and flat opaque political colours (Atlantic, Europe 1944) | satellite fills: see-through (tex 4-5); political maps: flat | **strongest in the sample**: frame sat 0.47-0.77, fills C* 36-71, dE 43-81 (Hungary green C* 71) | thin white outline on the highlighted country, dashed front line |

## Which channels look cleanest, in measurable terms

1. **The Operations Room and Tactical Genius** are the cleanest, and they get there by *not painting the ground*. Coloured-ground share: TG 0 %, Ops Room about 5-12 % red-ish pixels on its two fill frames (a gradient rim only; Carentan 0 %). The territory edge is one thin line plus a soft rim (rim dC +6 against the base). Their bases are mid/high-key (Ops Room 105-209, TG 110-166) with low ground chroma (Ops Room C* 11-16), so a small amount of red or blue reads at once.
2. **Epic History TV Austerlitz** is the cleanest of the "painted" looks: pale warm base (luma 145, C* 13), fills of C* 28-41 (dC +15 to +29, about 1.5x the ground), outline thin and same-hue, neutral states left grey.
3. **The strongest and busiest** are Historigraph and the flat Kings and Generals / EHTV Cold War maps: fills C* 36-71, dE 43-81 from the ground, and 40-70 % of the frame covered. Even these keep a **third colour (grey, gold or green) so no frame is only red + blue**.
4. A clear pattern across painted maps: the two sides are **balanced** (dE ratio red : blue between 1.1 and 1.9: Austerlitz 34-36 vs 38, Cold War 73 vs 38, Europe 1944 81 vs 65).

## How ours differs (test-E2-current, three frames)

| measure | ours | painted competitors | no-fill competitors (TG / Ops Room) |
|---|---|---|---|
| coloured share of the frame | **86-88 %** (no unfilled ground anywhere) | 22-75 %, mean about 45 % | 0-12 % |
| red fill: C* / dC / dE vs ground / dL | 22 / +15 / **32** / -17 (luma 69 vs base 113) | mean of 11 red fills: 41 / +25 / 48 / -14 (luma 61) | rim only: dC +6, dE 28 |
| blue fill: C* / dE vs ground | **10 / 13** (luma 105, nearly the ground colour) | blue fills C* 21-54, dE 38-65 | TG blue icons only |
| red : blue strength (dE) | **2.4 : 1** | 1.1 : 1 to 1.9 : 1 | n/a |
| base ground: luma / saturation | **113 / 0.10** (grey-green) | 116 / 0.29 (EHTV), 79-84 / 0.41-0.45 (Historigraph, KG) | 105-209 / 0.09-0.55 (Ops Room), 110-166 / 0.25-0.63 (TG) |
| terrain in fill (tex) | 5-9 (see-through, same as TG relief 3-18) | flat (0.4-2) or see-through (4-5) | 3-18 |
| frame luma | 78-82 | 50-127 (mean 90) | 105-209 |
| border | red/blue edge is hard and wide-mass, with front glow | thin outline or white line | one white line + soft rim |

**Reading.** Ours is *not* more saturated than the competitors (red C* 22 vs 41; blue almost grey). What the owner sees as "too strong / not clean" comes from three measurable things:
1. **Coverage:** 87 % of every frame is a red or blue wash, so there is no quiet ground left. Competitors paint 22-75 % (mean 45 %), and the cleanest paint 0-12 %.
2. **Imbalance and darkness of the red:** red is 2.4x stronger than blue (dE 32 vs 13) and is a dark maroon (luma 61-78, 35-50 levels below the ground) against a blue that is just the ground slightly cooled. One heavy dark mass sits next to a nearly invisible one. Competitors keep the pair within 1.1-1.9x.
3. **Grey, dark base with no chroma of its own** (sat 0.10, luma 113): the fill is the only colour in the frame. TG/Ops Room/EHTV bases carry earthy chroma and are 15-100 luma levels brighter, so their colour sits *on* the terrain instead of *over* it.

## Options the numbers suggest (not applied; test before applying per CLAUDE.md)
- Ops Room style: keep only the front line + a 5-10 % wide soft rim on the enemy side, leave the rest of the ground unpainted (our "option 2" territory look is already close).
- If a painted look is kept (option 1): cut the share to the contested half of the frame, bring red up to blue strength (target red dE about 20-25, blue about 15-20, ratio under 1.5), lift red from luma 61-78 to about 85-95, and keep a thin same-hue outline.

## Caveats
- vidIQ spend: 30 credits. Frames are YouTube auto thumbnails at the fixed 25/50/75 % marks, so many are portraits, not maps; 25 of 108 were kept.
- Box placement is manual; one-off numbers are about +/-15 %. The Stalingrad base and the Six-Day base sit in vignette/sea (flagged "n/a" where they distort the share); sea-based rows (Atlantic, WW1, Norway, Six-Day, Guadalcanal) measure fills against water, so use their C*/hex rather than dE.
- TG icon colours (red/blue squares) were not measured; they are small blocks, not territory.
- The ours-vs-base numbers use the documented base (104,116,107), because no unfilled ground is visible in the frames.
