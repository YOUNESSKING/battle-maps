# Vicksburg thumbnails v5: owner feedback on v4 (2026-11-19)

Owner on v4: "The colors doesn't match ... it looks washed off, and the background photo doesn't match too ... the character of that one
[the published Grant] was great. Cut loose. Why cut loose? Something that would spark curiosity."
v5 follows the locked PACKAGING_GUIDE 0c and the 3 references in `reference/thumbnails/`.
Outputs: `vicksburg-v5-MAIN-BD-WRONG_WAY.jpg`, `vicksburg-v5-ALT-GM-WRONG_WAY.jpg`, `sheet_v5.jpg` (ours vs the 3 references at full, 360, 168x94 + 2x; v4 -> v5 row),
`sidebar_v5.jpg`. Scripts (from `vicksburg/`): `tools/make_thumb_v5_backdoor.py "WRONG WAY." MAIN-BD`,
`tools/make_thumb_v5_gm.py "WRONG WAY." "THEN VICKSBURG FELL" ALT-GM`, `tools/make_thumb_v5_sheet.py`. Inputs `thumb/work_v5/`.

## 1. The word (0c item 1)
| Candidate | What the viewer believes | Does it flip it? | Literally true? (FACT_NOTES) | Verdict |
|---|---|---|---|---|
| **WRONG WAY.** | A general takes a fortress by marching AT it | Yes: Grant marched EAST, away from Vicksburg, took Jackson first, then turned back and shut the city in | Yes, as direction: §7 Turn east ("turned the whole army toward Jackson"), §5 Strategy, §19 new row | **PICK** (lead's pick too) |
| HE TURNED AWAY. | same | yes | yes | 3 words / 13 letters: too long for the band, weaker than 2 words |
| HE WENT EAST. | same | only if you know where Vicksburg is | yes | needs geography to land |
| NO SUPPLIES. | armies need supplies | yes | NO: wagon trains still followed; Blair's 200 wagons (§5 Living off the land) | rejected (not literally true) |
| NO BASE. | armies need a base | yes, weakly | yes ("cut loose altogether from my base") | weaker hook, needs explanation |
| CUT LOOSE. (v2-v4) | | | yes | rejected by the owner ("why cut loose?") |
B's Cinzel line completes the twist: WRONG WAY. / THEN VICKSBURG FELL.

## 2. MAIN colours vs the PUBLISHED Grant "Back Door" (battlefield x<780, y<520; HSV S 0-100, Lab)
| Metric | Published Grant (target) | v4 (owner: washed) | **v5** | v5 vs target |
|---|---|---|---|---|
| Saturation S | 34.9 | 31.5 | **35.6** | +2 % |
| Warmth R-B | +27.0 | +31.9 | **+27.7** | +3 % |
| b* (yellow) | +9.6 | +11.1 | **+10.8** | +12 % |
| Lightness L | 36.0 | 43.7 | **38.2** | +6 % |
| Contrast (L sd) | 23.6 | 23.7 | **23.7** | 0 % |
| Green woods (hue 30-85, % of field) | 4.8 | 0.0 | **3.8** | -21 % |
| Warm hues (% of field) | 64.7 | 87.5 (monochrome sepia) | **58.9** | -9 % |
| Orange fire (% of field) | 3.2 | 1.4 | **1.8** | -44 % (painted fires in Vicksburg + Jackson, 5 muzzle bursts; the published one has many more fires) |
| Blue hue (% of field) | 6.9 (dense navy troop carpet + river) | 1.7 | **1.6** | our recipe uses fewer, bigger blocks (0c: OUR unit blocks) |
| Grant panel x>=880: mean abs difference to the published thumbnail | 0 | 65.6 | **1.2** | the same portrait |

How: new vidIQ painted aerial (purpose "image"; described in the published look, as local files cannot be passed and the account has no
authorised channel to fetch the i.ytimg URL), only a light grade (Color 1.20, Contrast 1.20, Brightness 0.77, slight cool channel trim),
painted fires protected from the darkening. No sepia wash. Prompt (2nd of 2 tries; the 1st put Jackson under the portrait):
"Realistic painted aerial view in the style of a moody history-documentary thumbnail: high oblique bird's-eye camera looking north over
the Mississippi countryside in May 1863, highly detailed digital oil painting, natural colours only slightly desaturated: dark olive-green
woods, grey-blue river water, brown dirt roads, bright orange fires with thick black smoke ... far left the Mississippi with a paddle steamer;
upper-left Vicksburg on steep eroded clay bluffs ... a railroad and road run east to a smaller burning town in the upper centre (Jackson) ...
No people, no soldiers, no horses, no flags, no text." Checked: Vicksburg on the EAST bank, river to its west, Jackson east.

## 3. MAIN portrait
The published thumbnail's own Grant panel (`reference/thumbnails/ref-A-backdoor-PUBLISHED-grant.jpg`, x >= ~880 plus head and coat),
same photo, tone, size and place, feathered into the new scene (rembg head mask + coat polygon + 90 px ramp). Its source file is not in
`grant/` (the published image is the only copy), so it is reused from the published image itself.

## 4. MAIN move
ONE grungy arrow: up from Grant's columns, swinging EAST toward Jackson, then hooking back WEST into Vicksburg (the "wrong way" shown).
Tags VICKSBURG + JACKSON (30 px). Red = Pemberton between the two towns; blue = Grant's columns on the road turning east. Word band
Anton 150 so the band ends at x ~846 like the published one (~829); the coat overlaps its end.

## 5. ALT (Grand Maneuver)
As v4 (Grant lowered, oil repaint of LoC 2018666428, Mississippi touching the seal, payoff 380 px at x 1080). New word: WRONG WAY. at 192 px tall,
tracking +10, MaxFilter 9 (stroke weight 24 % of height by skeleton measure; Marion "HE RAN." 25.7 %, v4 26.1 %), letters >= 13 px apart.
MaxFilter 11 gave 25 % but clogged the O/G/R counters. The glowing arrow swings EAST (down-right on this north-up-right map) before it
reaches Vicksburg. Arrow 1.07 %, warm accent 1.40 % at x 1043. Subtitle THEN VICKSBURG FELL.

vidIQ credits v5: 44 (2 background images x 22). Total for the Vicksburg thumbnails: 71 (v2) + 66 (v3) + 44 (v5) = 181.
