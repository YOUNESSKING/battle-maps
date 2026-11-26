# v2 test critic 2: viewer at 720p / 360p on a phone + the owner's eye

Judged: `washington/critics/v2_test_sheet.jpg` (4 stills, 960 px each, cut out and downscaled to 640x360), the approved frames
(v8 3 s / 35 s / 60.5 s, v14 40 s, v6 5 s) and our rejected v1 frames `/tmp/wx_v2ref/ours_735.png`, `ours_1100.png` at the same sizes.
Measured each frame with the top and bottom furniture cropped out (mean luma L, mean HSV saturation S, warmth = mean R - mean B):

| frame | L | S | R-B | read at 640x360 |
| --- | --- | --- | --- | --- |
| v1 ours 735 (Trenton) | 95 | **22** | 3 | grey-blue sheet, the rejected look |
| v1 ours 1100 (Princeton) | 87 | 34 | -2 | flat, giant blocks |
| (a) S04 colonies wide | 82 | 47 | -4 | = v8 3 s (84 / 41 / 3) |
| (b) S03 Brooklyn night | 65 | 72 | -11 | night, land warm, water navy |
| (c) S05 Trenton winter | 89 | **35** | 8 | still grey-olive under the storm veil; v8 close = 94 / 66 / 15 |
| (d) S07 Princeton orchard | 83 | 51 | -3 | = v14 40 s (80 / 56 / 3) |

## Owner points

1. **Dark, murky, flat, blue-grey ground with grey haze** -> **FIXED on a, b, d; NOT YET on c.**
   a matches the v8 wide almost value for value (relief, dark woods, white clouds). b and d show the warm patchwork, dark teal woods and rust road.
   c (the winter / storm world) is better than v1 (S 22 -> 35, the field shapes and rust road are now visible) but at 640x360 it still reads as a
   grey-olive sheet with a pale washed top third: saturation is half of v8 close (35 vs 66) and there is no "light frost over the patchwork"; it is
   the old grey look, only lighter. d's frost reads as one pale cream tone with no field patchwork in the open ground (acceptable, but see defect 5).
2. **Giant men in thick deep blocks** -> **FIXED.** d's blocks are thin wide 12 x 6 lines of small men, same width/depth on screen as v14 40 s
   (blocks ~5-6 % of the frame width vs v1's ~19 %), 15 blocks in frame, both lines readable. c's three blocks are the same scale. Visible at 360p.
3. **Missing overlays** -> **FIXED where shown, two items unproven.** THE ARMIES key bottom-left (all 4, correct opposing commander: Howe / Rall /
   Mawhood), wax-seal timeline along the bottom (all 4; seals Brooklyn, then Trenton in d), pocket-watch clock (b 8:00 at night, c 8:00 morning,
   d 8:00 morning; a correctly uses the date plate), carved place name on its word (b "Brooklyn ferry"). **Not shown in any still: the small
   parchment ledger top-right** (it is in the recipe but no test still proves it replaces the big dark panel), and no carved name in the wide still a.
4. **Grey fog -> white puffy v6/v8 clouds** -> **FIXED.** a's clouds are the v8 cumulus (cores, soft edges, same size and count in frame).
   No grey fog sheet in a, b or d; c's grey veil is the storm rain (historical) but see point 1.

## Scores (1-10, at phone size, vs the approved test)

| still | score | note |
| --- | --- | --- |
| (a) S04 colonies wide | **8** | looks like v8 3 s; date plate clipped (defect 1) |
| (b) S03 Brooklyn ferry night | **7** | overlays right; label off the landing, LED-string wakes, block under the timeline |
| (c) S05 Trenton winter | **5** | still grey/murky; empty frame; no Hessians, no place name |
| (d) S07 Princeton orchard | **7** | troops = v14; banner sits inside the British line; empty-outline house |

## Defects and exact fixes

1. **(a) Date plate clipped.** At 22.8 s (13.7 s after the 16 November roll at 9.07 s) the "16" is cut by the plate's bottom edge and the
   note line "Fort Washington" is hidden below it; v8's plate shows day + weekday + note in full. Fix: make the `plaque.date` plate tall enough for
   the day numeral + weekday + note (or drop `note` for this plate), and check that the roll has finished; re-check every date plate with a note.
2. **(c) Winter ground still grey (owner point 1).** Fix in the ground agent's winter worlds (trenton winter, colonieswinter, the S07 jersey/princeton
   frost): start from the v8 summer patchwork (same green / ochre / rust field hues), then a light frost = cool white tint of ~15-20 % on open fields
   only (woods stay dark teal, roads stay rust); target S >= 50 and R-B >= 5 measured as above; kill the haze over the upper third (haze only at the
   horizon line). Keep the storm veil (rain x 0.5) on top: with a coloured ground under it, it reads as weather, not as fog.
3. **(c) Empty frame.** 80 % of the frame is empty field; only 3 blue blocks at the bottom edge, no Hessians, no "Trenton" carved name. Fix: frame
   the march so Trenton (houses + the Hessian posts) is in the upper third, blocks in the middle third; carve "Trenton" on its word.
4. **(d) Washington's banner inside the British line.** The pole stands in the gap of Mawhood's red blocks; at 360p it reads as Washington in the
   British ranks. Fix: put the banner on the American side of the gap (between the two lines but clearly nearer the blue line, below the orchard),
   or lift it into the open field until the "rode between the lines" beat is spoken.
5. **(d) Orchard house is an empty red outline** (centre-left of the field), reads as a missing model at 720p. Fix: use the painted town building,
   or remove it. Optional: give the open ground two or three frosted field tones so the patchwork still reads.
6. **(b) "Brooklyn ferry" sits in the middle of the fields**, ~200 px right of where the boats land. Fix: carve it at the ferry landing (the shore point
   where the road meets the water / the boats beach).
7. **(b) Boat wakes are rows of bright dots** (they read as fairy lights at 360p). Fix: soften to a continuous faint V-wake (lower alpha, longer, no
   discrete dots) or drop the wakes at night.
8. **(b) A blue block sits half under the timeline bar** at the bottom edge. Fix: camera target up a little or that unit out of the bottom 12 %
   while the timeline is up.
9. **(all) Ledger unproven.** Add one test still with `ledger.show` + 2-3 `ledger.add` rows (e.g. S04 Fort Washington ~2,800 prisoners, or S07
   Princeton) to confirm the small parchment list replaces the big dark panel at the v8 60.5 s size and position, with the legend stepped out.
10. **(a) No carved name in the wide still** (v8 3 s carries Vicksburg / Big Black River / Edwards). Fine if no place is spoken at 22.8 s;
    make sure "Fort Washington" / "Hudson" carve on their words (labels exist in the seq at T.manhattan / T.delaware only: add Fort Washington and
    Hudson River at `T.fortw` / `T.hudson`).

## Verdict

**OK to re-render the film: NO (not yet).** Troops, clouds, overlays and the summer/night ground now match the approved tests (a, b, d pass the
owner's eye with small fixes). The blocker is defect 2: the winter ground (c) is still the grey, murky look the owner rejected, and the winter
worlds cover the whole second half of the film (Trenton, Princeton, winter colonies). Fix 2 (+ 1, 3, 4, and a ledger still for 9), re-shoot still c
and one ledger still, then re-render. Defects 5-8 and 10 can be fixed during the re-render.
