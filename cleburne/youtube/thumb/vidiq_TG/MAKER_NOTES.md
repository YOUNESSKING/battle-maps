# Cleburne #14 -- vidIQ thumbnails, round TG (Tactical Genius clarity)

Goal (owner): keep the cand_04_OUTNUMBERED idea from `../vidiq_W/` but make it CLEARER, like Tactical Genius:
desaturated steep top-down map, many small identical blue/red blocks in one readable shape, thin white arrows,
small framed pin portraits, face big on the right, one red brush banner bottom-left.

All 8 images generated whole by `vidiq_generate_thumbnail` (no compositing; Python only for download + checks).
- title = "Patrick Cleburne's Top 3 Legendary Tactical Moves | The Man Who Saved the Confederacy's Western Army"
- referenceImages = the 4 TG winners. NOTE: the tool now REJECTS bare video ids ("Provide a hosted image URL");
  pass `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` instead (tVpl949Nk0M, 5EoX2EYJ_WI, BvJN3pyPL6E, i1sWghFIvZE). Those work.

## Prompt (base, userQuery)
> Copy the Tactical Genius style of the references. LEFT 60%: high steep top-down aerial tactical map in DESATURATED muted
> grey-green and cold grey tones, low-contrast terrain so units pop. One long narrow wooded ridge running diagonally
> (Missionary Ridge); a small railroad entering a black tunnel mouth at its north (upper) end. Units = many small identical
> cube blocks as in the references: a SMALL tight cluster of ~25 saturated BLUE blocks on the hilltop above the tunnel, in a
> curved defensive line; a 4x larger mass of ~100 saturated RED blocks forming a wide ARC pressing on it from north and west.
> Two thin white curved arrows of the red attack curling toward the blue line and stopping short. Small white label
> "TUNNEL HILL" by the blue cluster. Small framed portrait pin on a stake by the blue blocks showing the same general as on
> the right, tiny label "CLEBURNE". No river, no photoreal clutter. RIGHT 40%: big chest-up realistic portrait of Confederate
> general Patrick Cleburne, serious, looking off-frame left, dark moody grade: long thin gaunt face, narrow jaw, hollow
> cheeks, deep-set eyes, long nose, high forehead, flat dark hair parted left and combed straight back, close full dark
> beard, thick moustache, unglamorous; grey frock coat, brass buttons, gold collar wreath with 3 stars; binoculars on chest.
> BOTTOM-LEFT: rough red brush banner with huge white bold condensed uppercase text reading exactly: WORD (no quotation marks).
> [variant line] NO FLAGS of any kind anywhere, no symbols on blocks, no other text besides the banner and the named labels.

Variant lines:
- 01: none (base).
- 02, 05, 06, 07: + "Add a second small framed pin by the red mass: grim Union general with short cropped red beard, tiny label "SHERMAN"."
- 03: tones -> "cold grey, frosty grey-white and dull olive, near monochrome" + "Even more top-down; blue in a tight horseshoe, red a thick half-ring around it."
- 04: + "Slightly larger blocks, very bold simple blue-vs-red shapes readable at tiny size; fewer trees."
- 07: banner "in matching curly quotes: “AT ALL HAZARDS”".
- 08: = 02 + "red never mixed into or behind the blue", "single-headed arrows FROM the red mass TO the blue line", "no stars or symbols on blocks or pin frames".

Lesson: adding the SHERMAN pin (02 onward) coincided with clean, correctly spelled labels; 01 (no Sherman pin) garbled its small labels.

## Candidates

| File | Word | Verdict | Why |
|---|---|---|---|
| cand_01_OUTNUMBERED.png | OUTNUMBERED | reject | Small labels GARBLED ("TUNNEL HILL" rendered as gibberish twice + a stray "HILL" sign); pin shows a different moustached man without a full beard. Map clarity good. |
| cand_02_OUTNUMBERED.png | OUTNUMBERED | **KEEP (1st)** | Clearest TG read: big red mass + 2 white arrows hitting a small blue cluster; labels TUNNEL HILL / CLEBURNE / SHERMAN spelled right; face gaunt, flat hair parted left, very close to the vidiq_W cand_04 face. Minor: tiny star ornament in the top-left corner of both pin frames (not a flag); tunnel present but small/faint at feed size. |
| cand_03_OUTNUMBERED.png | OUTNUMBERED | reject | Arrows point AWAY from the blue (red appears to retreat/encircle outward) -> wrong story; red ring mostly behind/below. Labels clean, face good. |
| cand_04_OUTNUMBERED.png | OUTNUMBERED | backup | Double-headed arrows (confusing); blue blocks spill along the rail into the tunnel. Labels clean, face good. |
| cand_05_4TO1.png | 4 TO 1 | backup | Clean read, tunnel clearly visible, labels correct, main face good (3 stars in wreath). But the CLEBURNE pin shows a different, thinner long-haired man; tiny star on pin frames. |
| cand_06_HOLDTHEHILL.png | HOLD THE HILL | **KEEP (3rd)** | Clean, labels correct, tunnel visible, pin = bearded general matching the portrait; main face fuller beard but recognisable. Tiny star on pin frames. |
| cand_07_ATALLHAZARDS.png | “AT ALL HAZARDS” | backup (fact) | Visually strong (matching curly quotes, clean labels, good gaunt face, clear red wedge vs blue line along the crest). BUT FACT_NOTES: Bragg's "at all hazards" order was for RINGGOLD GAP (27 Nov), not Tunnel Hill; image + label say TUNNEL HILL -> mismatch. Usable only if the label were Ringgold (would need a new generation). |
| cand_08_OUTNUMBERED.png | OUTNUMBERED | **KEEP (2nd)** | Tunnel mouth most visible of all; compact blue line centred on the hill, red arc + 2 arrows stopping at it; labels correct; pins match. Minus: collar insignia irregular (leaf branch + 3 loose stars, not a closed wreath); star ornament still on pin frames despite the prompt. |

Checks on all 8: no flags of any kind, no saltire, no symbols on the blocks; banner spelling exact on all; OUTNUMBERED without quotes on 01-04, 08.
Only recurring stray mark: a tiny 5-point star ornament in the corner of the pin frames (02, 05-08; red star on Sherman's red pin) -- critic should judge whether it counts as stray insignia.
Feed size (320x180): every TG-round candidate reads blue-small-vs-red-big far more clearly than vidiq_W cand_04 (whose units compete with forest, river, fire); the tunnel only reads at feed size on 05, 06, 08.

Facts: ~4,000 (Cleburne) vs ~16,000 (Sherman) at Tunnel Hill (FACT_NOTES: Wikipedia/NPS) -> OUTNUMBERED, 4 TO 1, HOLD THE HILL true.
"AT ALL HAZARDS" = verbatim Bragg order, but for Ringgold, not Tunnel Hill (see 07).

Credits: 8 generations x 22 = 176 (balance 2546 -> 2370). 4 initial calls with bare video ids were rejected by validation before submit (no charge).
