# Cleburne #14 -- thumbnail critic verdict (vidIQ, WarfareGeniuss formula)

Checked at 1280x720, zoomed crops (collar, pin portrait), and `feed_strip.jpg` (top row 246x138, bottom row 168x94; order 06, 04, 08, 02, 07).
Reference: `research/competitors/thumbs/WarfareGeniuss_sheet.jpg`, real photo `cleburne/assets/media/_src_cleburne_oppenheimer.jpg`.

Common to all five: formula matched (portrait right with binoculars, 3D diorama left, white curved arrow, fire + black smoke,
white "TUNNEL HILL" tag, framed portrait pin on a stake, red brush banner with curly quotes). They would sit naturally in his grid.
**No flags or saltires anywhere, so no automatic fail.** No garbled or extra text. Spelling is exact.
Faces are an idealised AI version of Cleburne: the same lean face, high forehead, hair combed back and beard as the photo, but darker and fuller-bearded. That is acceptable for this formula, because WG's faces are idealised too.

| # | Word | Verdict | Score | Notes |
|---|---|---|---|---|
| 04 | "OUTNUMBERED" | **PASS: MAIN** | 8/10 | Collar = 3 stars in a wreath (correct CS general insignia, slightly messy: one star pokes out of the wreath; invisible at feed size). Best small-blue-on-hilltop vs big-red-columns read; tunnel + rail clear; pin = bearded general. A single emotional word, which is pure WG formula. True (FACT_NOTES ~4,000 vs ~16,000). Readable at 168 px. The river at right is plausible (Tennessee River). Weakness: "outnumbered" is a little generic. |
| 06 | "4 TO 1" | **PASS (fix advised): Test & Compare A** | 7.5/10 | Strongest word at feed size (biggest letters) and the most concrete claim, true per FACT_NOTES. Good likeness. Defect: insignia = ONE star in a wreath plus a stray loose star or two on the right collar edge (a stray insignia, PACKAGING_GUIDE 0b). It is a number, not a quoted word, so it is less WG-like and gives less of an emotion hook. Blue block is fairly large, but red is clearly bigger. |
| 08 | "SILENCED" | **PASS (weakest): Test & Compare B** | 6/10 | Best curiosity word. True only for the Dalton memorandum (Davis ordered it suppressed), but the image shows the Tunnel Hill battle, so the picture does not support the word and it does not fit Title A's "saved the Western Army". It fits only a title about the memorandum. Insignia = a single star in a wreath on both sides (wrong rank form, but symmetric, with no stray). Pin is the best of the three (grey CS coat). |
| 02 | "UNBREAKABLE" | backup | 6/10 | Weak likeness (wavy actor hair). Good diorama. |
| 07 | "UNBREAKABLE" | backup | 6/10 | Good face, 3-star collar, but the blue army is almost as big as the red, which kills the 4:1 read. |

Ranking: 04 > 06 > 08 > 07 > 02.

## Fixes (optional, before launch)
- 06: `vidiq_refine_thumbnail` -> "Keep everything identical; on the general's collar show exactly three gold stars inside a gold wreath on each side, remove all other loose stars."
- 08: use it only with a title that mentions the suppressed proposal/memorandum (Title B/C); otherwise swap it for 07.
