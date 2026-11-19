# Vicksburg thumbnails v7: ALT critic round 4 fixes (2026-11-19)

Round 4: MAIN v6 PASSED (9/8) and is kept. Only its JACKSON tag moved, 12 px left and 8 px up to (664,14), so it sits more than 30 px clear of the hair; nothing else changed.
ALT v6 failed narrowly (8/7.5) on Jackson: drawn south-east of Vicksburg and under the duration badge. v7 ALT fixes that.
Outputs: `vicksburg-v7-ALT-GM-WRONG_WAY.jpg`, `vicksburg-v6-MAIN-BD-WRONG_WAY.jpg` (tag nudge), `sheet_v7.jpg` (v6 MAIN + v7 ALT next to the 3 locked
references; every 360 px / 168 px copy carries a simulated "18:46" duration badge; last row v6 -> v7 ALT), `sidebar_v7.jpg`.
Scripts (from `vicksburg/`): `tools/make_thumb_v7_gm.py "WRONG WAY." "THEN VICKSBURG FELL" ALT-GM`, `tools/make_thumb_v6_backdoor.py "WRONG WAY." MAIN-BD`,
`tools/make_thumb_v7_sheet.py`. 0 vidIQ credits.

| Round-4 condition | v6 | **v7** | Target |
|---|---|---|---|
| A. Jackson level with Vicksburg | flame (1236,640), 200 px below the town | **flame (1196,436): dy -4 px from the town's y 440, 256 px east of its centre** | y within ±40, >= 220 px to the right |
| Jackson flame | ~46 px | **~60 px painted flame (from the vidIQ fire, no plate), brightened 1.35x, small bloom** | ~60 px + small glow |
| JACKSON label | 24 px, bottom-right corner | **Cinzel 27 above the flame, right-aligned to x 1262 (box 1132-1262, y 378-406)** | 26-28 px, above, x <= 1262 |
| B. Badge zone (x>1140, y>650) | label + flame inside it | **0 arrow px, no flame, no label** | empty |
| Arrow route | east along the bottom, apex low at Jackson | **east along the bottom, north up the right side (x ~1196, y 610 -> 500), just under the Jackson flame, then due WEST into the town's right flank** | Bruinsburg -> east/north-east -> Jackson -> due west |
| Head heading | 207 deg | **190 deg** | 170-200 |
| Arrow area | 1.48 % | **1.38 %** (1.35 % by polygon) | <= 1.6 % |
| East extent past the town centre | +264 px | **+262 px** | U-turn readable at 168 px (sheet, with the badge) |
| Mississippi | ran north-east to (1280,300), north of Jackson | **leaves the town to the north/north-west and fades out under the subtitle (alpha ramp y 250-320)**; 0 river px east of town centre +60 for y < 440; still touches the seal (86 px from its centre) | west/north of the town only |
| Optional: bigger word | 162 px, x 151-1259 | **171 px tall (23.8 %H), x 99-1266; stem 25.7 %, O 18 px, letter gaps >= 11 px; word bottom y 185 vs hair 199 = 14 px clear** | >= 170 px, keep weight/openings/gaps, head clear |
| Clearances BRUINSBURG / VICKSBURG / seal | 58 / 57 / 72 px | **59 / 48 / 72 px** (waived by the critic: nothing crowded) | |
| 168 px luminance std | 71.5 | **73.7** | M 73.2 |
| Mean grey / sat | 76 / 130 | **78.6 / 128.7** | M 74 / 140 |
| Warm accent | 1.32 % | **1.35 % (centroid x 918)** | town = hottest spot, Jackson second |

In north-up terms the arrow now draws the real campaign shape: Bruinsburg -> east and north-east -> Jackson (level with Vicksburg, linked
by the east-west railroad, 32.30 N vs 32.35 N) -> due west into Vicksburg.
