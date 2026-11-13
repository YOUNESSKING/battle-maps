# Yorktown thumbnails: independent review 2 (2026-11-13)
Each image checked at 1280x720 and at 168x94 (PIL Lanczos), next to `competitor_battle_thumbs.jpg` and Grant D/A.

## A `yorktown-thumbF-THE_TRAP.jpg`: APPROVE (main), small fixes
Feed readability **8/10**, click appeal vs sidebar **6/10**.
- Good: one big face, 2 words with one red accent, true claim (Cornwallis's own 8 Jul letter: a post "for ever liable to become a prey" to a superior fleet). Reads instantly at 168x94.
- Defect 1 (sidebar): Washington with a bright harbour panorama looks almost the same as the "Revolution AI · 1.3M" thumbnail in the Yorktown sidebar. DATA RULES 3 asks for something visibly different: our map + face.
- Defect 2 (whole background): the context is bright gold and saturated. PACKAGING 0b.3 asks for a dark, desaturated context, so the face pops less than Grant's.
- Defect 3 (top-left, about x 200-280, y 0-60): a black smoke plume touches the top of the wig.
- Defect 4 (right, under the banner): "YORKTOWN · 1781" is about 5 px tall at feed size and cannot be read. Either make it 1.6x bigger or drop it.
- Fix: keep the face and the banner. Darken the background by about 25 % and pull saturation down by about 30 %, or, better, swap in our Style W Yorktown map with B's arc arrow (the Grant D recipe that earned about 7 %). Clone out the plume.

## B `yorktown-thumbS-B_MAP.jpg`: REJECT until fixed
Feed readability **6/10**, click appeal **6/10**. No other Yorktown thumbnail in the sidebar is a map, which is good for differentiation.
- Defect 1 (right of the "1781" text, about x 770-860, y 120-130): the cut fragment "ester Po" of "Gloucester Point" shows. At the top, "Gloucester" is half hidden by the title.
- Defect 2 (top centre, x 620-660, y 0-25): a red unit box is cut off by the frame edge.
- Defect 3 (centre, x 500-560, y 300): the small serif "Yorktown" label repeats the headline. Remove it.
- Defect 4 (bottom, x 480-700, y 540-580): red X and gun boxes with red lines sit on the allied arc next to the US flag. At feed size they read as British units outside the trap. Check them against FACT_NOTES: recolour them if they are allied, or delete them.
- Defect 5 (left and right): the arrow covers blue boxes at about x 195 / y 430 and x 830 / y 550.
- Defect 6 (feed size): about 15 small boxes turn into red and blue confetti. SUMMARY item 3 allows one named place, one arrow and one front line.
- Defect 7 (under the headline): the "THE TRAP" bar is about 6 px tall at feed size. Make it 1.5x bigger.
- Fix: keep the headline, the arrow, the British red line, the two flags and at most 4 boxes. Hide the Gloucester labels.

## C `yorktown-thumbS-C_CIRCLE.jpg`: REJECT
Feed readability **4/10**, click appeal **4/10**.
- Fact check passes: the circle is on the leading British officer in red, walking in front of Lincoln's white horse. In Trumbull's composition this is O'Hara. The ring also takes in the two officers behind him, which is acceptable.
- Defect 1 (left third, x 120-415): at 168x94 the circled man is a red blob about 15 px tall. The white horse in the centre pulls the eye away from it.
- Defect 2 (whole image): this is the most familiar Yorktown painting, and the PBS sidebar thumbnail uses the same scene. With no text it does not explain why anyone should click.
- Defect 3 (whole image): the upscale leaves halos on the horse outlines. A white flag fragment smears the top-left corner (x 0-60, y 0-100), and a rider is cut off at the far left edge.
- Fix: crop about 1.7x onto O'Hara, Lincoln and the horse so that O'Hara fills about 60 % of the height. Darken and desaturate everything outside the ring (Dark Docs style) and thicken the ring to about 12 px. Optionally add one line, "NOT CORNWALLIS". It is true, but it is a negation, so test it.

## Main thumbnail and title pairing
- **Main: A**, ideally rebuilt on our map as in Grant D. It is the only one that passes the feed test and follows the channel's proven face + 1-3 words recipe.
- **A ↔ Title A.** The harbour picture and THE TRAP complete "Safe Harbor ... Turned It Into a Trap". Note: "TRAP" appears in all three titles (SUMMARY item 7 says not to repeat words). Test the existing `yorktown-thumbF-NO_WAY_OUT.jpg` as the alternative.
- **B (fixed) ↔ Title B.** Plain subject + year is the HistoryMarche / Operations Room pair.
- **C (fixed) ↔ Title B.** Neither the surrender painting nor C shows the secret march or the sea battle. Title C has no thumbnail that fits it well. If C must be used, pair it with a map or fleet image.

## Round 2 (thumb5 set, checked at 1280x720 and 168x94)
- **A `thumb5-A_MAIN`: APPROVE after one fix.** Readability 9, click 7. "THE TRAP / YORKTOWN" now reads at feed size, and the arrow makes this thumbnail different from the Revolution AI one. Last defect: the blue arrow starts at Washington's shoulder (x 410, y 330) and points out to sea (x 1030, y 330). It reads as an *escape* by sea, the opposite of the trap. There are also two visible seam lines in the arrow body (about x 630 and x 810, y 490). Fix: reverse the arrow so it comes in from the sea and closes on the town or the river, or curve it round the town. Render it as one seamless path.
- **B `thumb5-B_MAP`: REJECT (two must-fixes).**
  1. The headline reads "YORKTOWN**.** 1781" with a full stop instead of the comma. That is a spelling defect.
  2. The arrowhead runs off the bottom-right edge (x 1210-1280, y 650-720), and the arrow now runs *outside* the allied line instead of closing the ring. It also covers the "XX" box under the US flag (about x 570, y 640) and half of the red box at about x 450, y 590.
  Smaller issues: the THE TRAP banner cuts the British gun box at about x 585, y 240, and a ghost blue box shows through the dark band at about x 130, y 145. Fix: use the comma; end the arrow inside the frame, on the river east of the redoubts; move it off the boxes; nudge the banner or the box.
- **C `thumb5-C_CIRCLE`: APPROVE.** Readability 8, click 7. The circle is correctly on O'Hara. "WHERE'S CORNWALLIS?" is true (FACT_NOTES: Cornwallis "ill"; O'Hara surrendered for him), creates a curiosity gap and reads at feed size. Optional polish: Lincoln's hat is cut at the top edge (x 540-640), and "WHERE'S" sits over Washington's figure. Move the text about 40 px down and right, or leave it. This thumbnail now fits **Title B** ("...Trapped Cornwallis's Army").
- **Main:** A (after the arrow fix). Test C second; it is the strongest curiosity option. Test B only after its fixes.
