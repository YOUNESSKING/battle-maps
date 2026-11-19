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

## Thumbnails v2 (2026-11-19; replace `thumb/A_5battles.jpg`, `B_nosupply.jpg`, `C_split.jpg`, which broke the channel rules)
Recipe: PACKAGING_GUIDE 0c (MAIN = Back Door, ALT = Grand Maneuver, same word). Scripts (run from `vicksburg/`):
`tools/make_thumb_v2_portrait.py` (cut-out + tones), `tools/make_thumb_v2_backdoor.py "CUT LOOSE."`, `tools/make_thumb_v2_gm.py`,
`tools/make_thumb_v2_sheet.py` (-> `thumb/sheet_v2.jpg` + `thumb/sidebar_v2.jpg`). Inputs in `thumb/work_v2/`.

| | File | Style | Words | Text type | Fits titles | Claim -> FACT_NOTES row |
|---|---|---|---|---|---|---|
| **MAIN** | `thumb/vicksburg-v2-MAIN-BD-CUT_LOOSE.jpg` | Back Door: painted aerial of Champion Hill (16 May) with Vicksburg on its bluffs beyond, red line on the crest, blue columns from the east, one sweep arrow over the hill to Vicksburg, tags VICKSBURG + CHAMPION HILL, sepia Grant right, red band | CUT LOOSE. | 1, the hero's decision in plain words; the 0c contradiction (an army deep in enemy country is expected to guard its supply line; he cut it) | A, B, C (title = the result, the word = the surprising how) | §5 "Decision": Grant, 3 May, "cut loose from my base"; §6 "Turn east": "to cut loose altogether from my base"; §5 "Living off the land". Plain words, no quote marks (not presented as a quote). |
| **ALT** (Test & Compare) | `thumb/vicksburg-v2-ALT-GM-CUT_LOOSE.jpg` | Grand Maneuver: navy map, glowing Mississippi, colour Grant left, wax seal at BRUINSBURG, one blue arrow east to JACKSON and back west via CHAMPION HILL to a painted VICKSBURG | CUT LOOSE. + "5 BATTLES IN 18 DAYS" | 1 (+ number subtitle) | A, C (B ok) | as MAIN + §"Count of battles/days": "five distinct battles", 30 Apr-17 May = 18 days inclusive. No "THEN": Port Gibson (1 May) came before the 3 May decision. |
| optional 3rd | `thumb/vicksburg-v2-OPT3-BD-5_BATTLES.jpg` | Back Door, same scene | 5 BATTLES. | 3, stakes / number | B (repeats A and C, so 0c would reject it next to them) | §"Count of battles/days" |

Portrait: LoC 2018666428 "[Portrait of Maj. Gen. Ulysses S. Grant, officer of the Federal Army]", Brady's National Photographic Portrait Galleries,
1860-65, master TIFF cwpb 06941 (public domain, no known restrictions); rembg isnet cut-out, dust specks removed. MAIN: sepia (0c), flipped to face
the action. ALT: hand-tinted by us (skin, brown hair/beard, navy coat, brass buttons): a colourised photograph, disclose it.
AI images (disclose under altered content): MAIN painted aerial (vidIQ purpose image, no people/flags/text; `work_v2/bg_vidiq_champion_v2.jpg`,
second pass moved the river behind the town so Vicksburg stands on the east bank); ALT Vicksburg vignette (`work_v2/icon_vidiq_vicksburg_v1.png`).
Troops, arrows, tags, seal and words are ours. vidIQ credits used: 66 (3 images x 22) + 5 (youtube_search) = 71.

Checks (0b item 3 + 0c):
- Spelling: CUT LOOSE., 5 BATTLES., 5 BATTLES IN 18 DAYS, VICKSBURG, CHAMPION HILL, BRUINSBURG, JACKSON: all correct.
- Labels: VICKSBURG on its bluffs on the EAST bank, river behind it (the first vidIQ pass had the town across the river: rejected);
  CHAMPION HILL on the hill with Pemberton's red line; Union blue comes from the east (Bolton/Raymond side) = true for 16 May.
  ALT: Vicksburg east of the river hairpin, Bruinsburg south on the east bank, Jackson east, Champion Hill between Jackson and Vicksburg.
  No tag hidden by the portrait or the band.
- Insignia/flags: Maj. Gen. strap with two stars (checked on the master TIFF), never the 1864 three-star strap; no flags anywhere; the AI painted
  no people, boats, guns or modern objects. Red = Confederate, blue = Union (video convention).
- Anachronisms: none (1863 farmhouse, dirt roads, brick town with a domed courthouse, period-plausible; the AI vignette is not an exact copy of the real courthouse).
- Face: whole face in frame on all three; shoulders bleed off the bottom; no white glow (thin warm/blue rim only).
- Feed size: 360 px and 168x94 strips on `thumb/sheet_v2.jpg`; CUT LOOSE. and 5 BATTLES. read at 168 px; the ALT subtitle and map labels do not
  (by design, the word carries it).
- Different from the published Grant "THE BACK DOOR" (city + river close-up, frontal photo): new scene (Champion Hill, Vicksburg far off),
  new word, arrow over the hill, different Grant photograph. Same recipe.
- Comparison row (3 TG + Marion MAIN/ALT + published Grant) and sidebar mock (`thumb/sidebar_v2.jpg`, vs HISTORY 2.3M, ABT 1.5M, Biography 387k,
  ABT 217k, Warhawk 160k, Threads 87k): four of six neighbours are a big Grant face or bright painting; ours is the only one with a word hook +
  arrow map. Weak point: ours is darker than HISTORY/Threads and has no big NAME (Arnold lesson); VICKSBURG tag enlarged for that.
- Not done: the 0c "2 harsh critic agents" round (no agent tool in this session); the owner's eye is the next check.

## Upload settings
Category Education; Altered or synthetic content = Yes (AI narration); description `description.txt` (no links); tags `tags.txt`;
end screen from the busiest video (Morgan) over the last ~20 s.
