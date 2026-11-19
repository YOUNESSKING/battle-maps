# Vicksburg 1863: packaging (owner pre-approved; lead's picks logged in OWNER_DECISIONS)

## Titles (vidIQ score_title, long-form, 2026-11-18)
| | Title | Score | Role |
| --- | --- | --- | --- |
| A | The Campaign That Split the Confederacy: 5 Battles in 18 Days \| Vicksburg 1863 | 87 | MAIN (GM's proven "N battles in N days \| Place Year" shape) |
| B | How Grant Took Vicksburg With No Supply Line \| 1863 | 87 | Test & Compare (curiosity) |
| C | Grant's Vicksburg Campaign: 5 Battles in 18 Days That Split the Confederacy | 86 | Test & Compare (hybrid) |

Claims: "5 battles in 18 days" = Port Gibson, Raymond, Jackson, Champion Hill, Big Black, 30 Apr - 17 May inclusive (FACT_NOTES; Grant's Memoirs
"five distinct battles"); "split the Confederacy" = the Mississippi opened (Vicksburg 4 Jul + Port Hudson 9 Jul); "no supply line" = Grant's own
"cut loose from my base" (wagon trains still followed for a time: the film hedges this in S06). Do not use "Grant's Masterpiece" (Warhawk).

## Thumbnails v4 = CURRENT (2026-11-19, critic round 2: v3 scored 8/10 on both; v4 applies the remaining fixes, `thumb/fixes_v4.md`)
Upload these: **MAIN** `thumb/vicksburg-v4-MAIN-BD-CUT_LOOSE.jpg`, **ALT** `thumb/vicksburg-v4-ALT-GM-CUT_LOOSE.jpg`, optional
`thumb/vicksburg-v4-OPT3-BD-5_BATTLES.jpg`. Sheet `thumb/sheet_v4.jpg` (vs Marion MAIN/ALT + Grant published, full/360/168 px, v3 -> v4 row), `thumb/sidebar_v4.jpg`.
Scripts (from `vicksburg/`): `tools/make_thumb_v4_portrait.py`, `tools/make_thumb_v4_backdoor.py "CUT LOOSE." MAIN-BD` (+ `"5 BATTLES." OPT3-BD`),
`tools/make_thumb_v4_gm.py "CUT LOOSE." "THEN VICKSBURG FELL" ALT-GM`, `tools/make_thumb_v4_sheet.py`.
- MAIN/OPT3: the arrow curves (80 px bulge) from the blue column over the red line, its tip in the town 55 px clear of the VICKSBURG tag (tag moved
  left, CHAMPION HILL tag moved under the crest on the left), no red block under the arrow; chunky blue formations (7 x 2 rows of 13x8 blocks,
  1.16 % of the field); battlefield contrast 1.06 (L sd 23.7, Grant pub 24); the faint blotch by Grant's ear softened.
- ALT: Grant 70 px lower (75 % of the height), the word takes the space above him: 196 px tall (27 %H), stems 27 %, letters 8 px apart, Os 16 px
  open, in front of the hair top and well clear of the face (GM style); the Mississippi touches the seal rim (86 px from its centre), so Bruinsburg
  sits on the river; beard toned sandy-brown, eyes 10 % darker; subtitle (240,228,200). 168 px luminance std 75 (target >= 72).
- Facts, portraits, AI disclosure and checks below are unchanged from v3 (same scene, words and sources; no new AI images, 0 credits).

## Thumbnails v3 (superseded by v4 above; 2026-11-19; fix every point of the two critic reports on v2, `thumb/critic_MAIN.md` + `thumb/critic_ALT.md`, 5/10 each)
Recipe: PACKAGING_GUIDE 0c (MAIN = Back Door, ALT = Grand Maneuver, same word), matched to the approved Marion #18 references.
Scripts (run from `vicksburg/`): `tools/make_thumb_v3_portrait.py`, `tools/make_thumb_v3_backdoor.py "CUT LOOSE." MAIN-BD`
(+ `"5 BATTLES." OPT3-BD`), `tools/make_thumb_v3_gm.py "CUT LOOSE." "THEN VICKSBURG FELL" ALT-GM`, `tools/make_thumb_v3_sheet.py`
(-> `thumb/sheet_v3.jpg` next to Marion MAIN/ALT + Grant published at full/360/168 px, `thumb/sidebar_v3.jpg`), `tools/measure_thumb_v3.py`.
Inputs in `thumb/work_v3/`. Before/after/target table of every critic number: `thumb/fixes_v3.md`.

| | File | Style | Words | Text type | Fits titles | Claim -> FACT_NOTES row |
|---|---|---|---|---|---|---|
| **MAIN** | `thumb/vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg` | Back Door: warm painted aerial of Champion Hill (16 May), no sky, the crest burning (farmhouse fire, black smoke, gunsmoke), dust on the roads; Pemberton's red line on the crest, Grant's blue columns on the roads from the east; ONE sweep arrow from the blue columns over the red line into Vicksburg on its bluff (river behind it); tags VICKSBURG 33 px + CHAMPION HILL; sepia Grant right (real photo, hard matte, strap painted out), red band | CUT LOOSE. | 1, the hero's decision in plain words (0c contradiction: an army deep in enemy country is expected to guard its supply line; he cut it) | A, B, C | §19 (= §5 Decision + §7 Turn east: Grant's "cut loose from my base"). No quote marks. |
| **ALT** (Test & Compare) | `thumb/vicksburg-v3-ALT-GM-CUT_LOOSE.jpg` | Grand Maneuver: navy map (north up-right), thin Mississippi, colour Grant left (oil repaint of the same LoC photo), heavy cream word (stems 27 % of height), wax seal at BRUINSBURG, ONE glowing arc left to right to a big burning VICKSBURG on its bluff at dusk (the hottest warm spot, far right); 2 labels, no blocks | CUT LOOSE. + "THEN VICKSBURG FELL" | 1 + twist line (0c item 3B) | A, B, C | §19: decision 3 May, surrender 4 July 1863 ("then" = afterwards). |
| optional 3rd | `thumb/vicksburg-v3-OPT3-BD-5_BATTLES.jpg` | Back Door, same scene as MAIN | 5 BATTLES. | 3, stakes / number | B (repeats A and C) | §19 / §13 Count of battles/days |

Measured (details in `thumb/fixes_v3.md`): MAIN battlefield S 30, R-B +30, b* +10, L 42 (Grant-published band), no sky, flame core 0.49 %
of the field, blue 1.1 %, red 1.4 % (1.4x Marion on the same detector), arrow from the troops into the town, VICKSBURG tag 33 px, hair 15 px
from the top, brow-chin 264 px, right column L 34, face p95 L 86, no halo, no strap. ALT: stems 47 px = 27 % of the word height (v2 19 %),
letters >= 9 px apart, arrow 1.02 % of the frame (v2 2.4 %), payoff 380 px at x 1080, warm accent 1.40 % centred at x 1041, seal R66,
2 labels, 0 blocks, Mississippi 124 px from the seal, no blue halo, skin RGB (199,149,110). Trade-off: the 9-glyph word is 173 px tall
(Marion's 7-glyph word 214 px); the tallest size that keeps 27 % stems and open letters in the 960 px slot. No shorter true word
(<= 6 characters) in FACT_NOTES passes the 0c test ("NO BASE." = 8), so none is offered.

Portrait: MAIN = LoC 2018666428 "[Portrait of Maj. Gen. Ulysses S. Grant, officer of the Federal Army]", Brady, 1860-65, master TIFF cwpb 06941
(public domain), sepia, flipped to face the action, the two-star strap painted out (it would fall cut at the frame edge), dust removed.
ALT = vidIQ oil repaint of the same photo (reference = the LoC-hosted jpeg; face, pose, uniform and the two-star major-general strap kept,
checked side by side): an AI-altered image of a real photograph, disclose it. Never the 1864 three-star strap.
AI images (disclose under altered content): MAIN painted aerial (`work_v3/bg_vidiq_champion_v3.jpg`), ALT Vicksburg dusk vignette
(`work_v3/icon_vidiq_vicksburg_dusk_v3.png`), ALT oil repaint (`work_v3/grant_oil_vidiq_v3.jpg`). Troops, arrows, tags, seal, words are ours.
vidIQ credits: v2 71; v3 66 (3 images x 22); total 137.

Checks (0b item 3 + 0c):
- Spelling: CUT LOOSE., 5 BATTLES., THEN VICKSBURG FELL, VICKSBURG, CHAMPION HILL, BRUINSBURG: correct.
- Geography: MAIN: Vicksburg on its bluffs on the EAST bank, river behind it; the viewer looks west, Union blue comes from the east (true
  for 16 May); Pemberton's red line on the hill. ALT: map turned (north up-right), Bruinsburg and Vicksburg both on the east (lower-right)
  bank, Vicksburg NNE of Bruinsburg, the arc runs inland east of the river. No tag hidden by the portrait or the band.
- Insignia/flags: no stray strap on the MAIN; ALT keeps the true two-star strap (toned to button level); no flags; the AI painted no
  people, boats, guns or modern objects. The burning farmhouse and city fires are illustration (shells "dropped into the city night
  and day" during the siege), not a claim about a named building.
- Face: whole face in frame on all three; hard 2 px matte, no halo; shoulders bleed off the bottom.
- Feed size: `thumb/sheet_v3.jpg` (168x94 + 2x) and `thumb/sidebar_v3.jpg`: the left 2/3 of the MAIN reads as warm battlefield + burning
  red line + one arrow; the ALT reads as word + seal + arrow + glowing town, like Marion's.
- Different from the published Grant "THE BACK DOOR" (city + river close-up, frontal photo): new scene (Champion Hill, Vicksburg far off),
  new word, the arrow from the troops over the hill, different Grant photograph. Same recipe.
- Superseded: v2 files (`thumb/vicksburg-v2-*.jpg`, `sheet_v2.jpg`, `sidebar_v2.jpg`) and the first set (`A_5battles.jpg`, `B_nosupply.jpg`,
  `C_split.jpg`) are kept for the record only; upload the v3 files.

## Upload settings
Category Education; Altered or synthetic content = Yes (AI narration); description `description.txt` (no links); tags `tags.txt`;
end screen from the busiest video (Morgan) over the last ~20 s.
