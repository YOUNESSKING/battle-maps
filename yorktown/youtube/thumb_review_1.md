# Yorktown thumbnail review 1 (independent, 2026-11-13)
I looked at each file at full size, at 168x94 (PIL, LANCZOS) and at 3x zoom. I compared them with `thumbS_sheet.jpg`, the competitor sheets, `competitor_battle_thumbs.jpg` and Grant A/D.

## A: `yorktown-thumbF-THE_TRAP.jpg` (Peale face + THE TRAP): APPROVE, MAIN
- **Feed readability 8/10, sidebar click 7/10.** At 168x94 the face, the red banner and THE TRAP all read. This is the Grant A/D recipe: real face, golden battle scene, 2 words, one red accent. It matches summary item 1A and 0b rule 3.
- **Defects:**
  1. The `YORKTOWN · 1781` tag (right edge, y~240) can't be read at feed size. Its job is to show the place, and it fails at that size.
  2. The face (left, x 170-420) is a calm, neutral 1770s Peale portrait. Next to the AI Yorktown film's grim close-up in the sidebar, it has less tension.
  3. The background has no map move (no arrow, no ring). Grant D, the ~7 % one, had a blue arrow plus the GRANT tag. In the sidebar, A is close to the "Revolution AI" and "Yorktown AI film" looks, so it is not clearly different (DATA_RULES 3).
- **Fixes:**
  1. Make the tag 2x bigger (about 44 px caps), or put YORKTOWN in the banner's second line.
  2. Optional: add one thick white arrow that curves around the fort and the shore (x 450-900, y 300-600) so the trap shows as an action. Then check that no red unit sits under the arrow.
- **Titles:** fits A, B and C ("trap" or "trapped" is in all three). Pair it with title A as the main pair.

## B: `yorktown-thumbS-B_MAP.jpg` (map, YORKTOWN, 1781 + one arrow): APPROVE AFTER FIXES (test slot)
- **Feed readability 6/10, sidebar click 5/10.** The headline and the arrow read. The red THE TRAP plate (x 530-750, y 160-215) shrinks to about 3 px text and is lost. None of the sidebar videos uses a map, so this one is the most different. But the frame has about 15 unit boxes, 3 flags and 2 front lines, which is the "busy map" weakness HistoryMarche's weak thumbs show. Its winners (HATTIN) have far fewer marks.
- **Defects:**
  1. The headline covers the "Gloucester Point" label: "…cester Po…" shows between the letters (x 700-900, y 110-140). Rule 0b.3 says to fix a hidden label.
  2. A red box is cut off by the top edge (x 640, y 0-25).
  3. The arrow is white, not in a side colour. At feed size it isn't clear who is trapping whom.
  4. The arrowhead (x 830-880, y 540) covers a blue box, and the left start (x 190, y 430) half-covers another.
  5. There is no face (0b rule 3 asks for one). The study's option B allows a map, so this is only a test slot.
- **Fixes:**
  1. Remove the Gloucester label or move the headline.
  2. Remove the boxes that are cut off or covered, and drop to about 6-8 boxes.
  3. Colour the arrow allied blue with a white edge, about 1.5x thicker.
  4. Raise THE TRAP to about 70 px or remove it.
  5. Optional: add a small Washington head bottom-left.
- **Flags checked:** the Union flag is the 1781 version (no St Patrick saltire), so it is right.
- **Titles:** best with B ("The Battle of Yorktown…"). It works with C.

## C: `yorktown-thumbS-C_CIRCLE.jpg` (Trumbull, circled officer): REJECT as it stands
- **Feed readability 4/10, sidebar click 4/10.** At 168x94 the circled figure is about 12x25 px: a red speck in a brown painting. The PBS sidebar thumb already uses a surrender painting with red coats, so C does not stand out.
- **Circle check:**
  - It does sit on the foremost British officer on foot, in a red coat with a white sash, next to Lincoln's white horse. Common descriptions name the central British officer as O'Hara, so the placement is right.
  - The circle (x 120-415, y 285-655) also takes in the two officers behind him, so it is not "one detail".
  - Because of the crop, the circle sits in the left third of the frame, not the centre.
  - FACT_NOTES has no "Packaging TEST claims" table (0b.2). Add one: O'Hara = the figure in Trumbull's published key, with the Architect of the Capitol key as the source.
- **Why it fails:** the Felton/Dark Docs circle winners show a big, odd subject that reads without context. A man in a crowd needs the story ("Cornwallis didn't come") to make sense, and the thumb has no words to give it.
- **Fixes if kept:**
  1. Crop to about 2.2x on O'Hara and Lincoln's horse.
  2. Tighten the circle to O'Hara alone, with a 12-14 px stroke.
  3. Add a red arrow.
  4. Optionally add 1-2 words: "WHERE'S CORNWALLIS?"
- **Titles:** only with B ("Trapped Cornwallis's Army"). It doesn't fit A or C.

## Verdict
- **Main: A with title A.** Do the tag fix first; the arrow is optional.
- **Test & Compare: A + fixed B.** Replace C with the fixed version above, or leave it out.
- **Title pairs:** A with title A (also B and C), B with title B or C, C with title B only.

## Round 2 (v5 files, checked at full size and 168x94)
- **A `thumb5-A_MAIN`: APPROVE, MAIN.** Feed 9/10, click 8/10. THE TRAP and YORKTOWN both read at feed size, and the blue arrow shows the trap as a move.
  - Last defect (optional): the arrow starts at Washington's shoulder and ends pointing into open water at the upper right (x 1030, y 330). It looks like a route out to sea, not a ring.
  - Fix: bend the head back to the shore just right of the town (about x 760, y 300) so the arrow closes around Yorktown. Also smooth the two small seams in the arrow body (x~630 and ~810, y~490).
- **B `thumb5-B_MAP`: APPROVE after 2 small fixes.** Feed 7/10, click 6/10.
  1. The red THE TRAP plate covers the comma's tail, so the headline reads "YORKTOWN. 1781". Move the plate down about 15 px or use a 2-px gap.
  2. The arrow half-covers a red X box (x 450, y 595) and runs off the frame at the bottom right. Remove that box, or end the arrowhead on the river shore inside the frame (about x 1000, y 640).
  - A blue box ghosts through the dark band (x 130, y 140). It can stay.
- **C `thumb5-C_CIRCLE`: APPROVE (third test slot).** Feed 7/10, click 7/10.
  - At feed size the circle and WHERE'S CORNWALLIS? both read, and the question is true (FACT_NOTES: Cornwallis "ill", O'Hara came instead).
  - Minor: the circle still takes in the second officer's shoulder (x 380-460). Narrow it about 30 px on the right if that's easy.
  - Fits titles B and C ("Trapped Cornwallis"). It doesn't fit A.
- **Final:** A is the main thumbnail, with title A. B and C go into Test & Compare.
