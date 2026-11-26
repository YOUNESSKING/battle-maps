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

---

# Round 2 (sheet with 5 rows, recipe section 6, worlds r2)

Re-measured the same way (frame without furniture), and judged at 640x360 and 960 px (~1280x720):

| still | L | S | R-B | round 1 S |
| --- | --- | --- | --- | --- |
| (a) S04 colonies wide | 81 | 47 | -3 | 47 (v8 3 s: 41) |
| (b) S03 Brooklyn night | 49 | 85 | -17 | 72 (now a real night) |
| (c) S05 Trenton 100.3 s | 90 | **69** | **24** | 35 (v8 35 s: 63 / 17) |
| (d) S07 Princeton orchard | 87 | 62 | 2 | 51 (v14 40 s: 56 / 3) |
| (e) S05 Trenton ledger 130.7 s | 94 | 68 | 23 | new (v8 60.5 s: 66 / 15) |

## Owner points, round 2
1. **Murky grey ground -> FIXED** (all 5). Trenton went from S 35 to 69: warm green / ochre / rust patchwork, rust roads, dark teal woods,
   the storm only as faint streaks. At 360p it reads as the v8 map. **But the "winter = light frost over the same patchwork" half is NOT DONE:**
   Trenton (c, e) now reads as a late-summer day (R-B 24 is warmer than v8's 15), with no frost at all on 26 December in a snow / sleet storm.
   Princeton (d) is fine: the open ground is pale and cold and reads as frost.
2. **Giant men in thick blocks -> FIXED** (d = v14 scale; the Trenton Hessian blocks in c are small and thin, no `bw` overrides).
3. **Overlays -> FIXED.** The ledger is proven in (e): small parchment list top-right, "TRENTON / 26 December 1776", 2 rows, the same size and place
   as v8 60.5 s, no dim, legend stepped out, timeline with both seals. Clock (b, c, d, e), legend, timeline and carved names ("Brooklyn ferry",
   "Trenton") are all there.
4. **Grey fog -> white clouds: FIXED.** The colonies puffs are now separate (seed 11), as in v8.

## Round 1 defects
| # | defect | round 2 |
| --- | --- | --- |
| 1 | (a) date plate clipped | **FIXED**: "16 / Saturday / Fort Washington" fits the plate |
| 2 | winter ground grey | **FIXED for the grey, NOT FIXED for the frost** (see R2-1) |
| 3 | (c) empty frame, no Hessians, no Trenton | **FIXED**: the town, Hessian blocks in King / Queen St, Knox's guns at the fork, carved "Trenton" |
| 4 | (d) banner in the British line | **FIXED (just)**: the pole now stands in the open field between the lines; the flag base is still ~45 % of the way down from the red line, so it reads as "between", not "with the Americans" |
| 5 | (d) orchard house = empty red outline | **NOT FIXED**: still a roofless red footprint left of the road (left to the worlds agent) |
| 6 | (b) "Brooklyn ferry" in the fields | **FIXED**: on the landing, by the boats |
| 7 | (b) bead-chain wakes | **FIXED**: warm deck lamps, no wakes; reads as night boats at 360p |
| 8 | (b) block under the timeline | **NOT FIXED**: one blue block still sits under the right end of the timeline bar (x ~720/960, y ~490) and another is cut by the bottom-right corner |
| 9 | ledger unproven | **FIXED** (e) |
| 10 | no carved names in the wide shot | **FIXED in the seq** (Fort Washington, Hudson River, Manhattan on their words); none is on screen at 22.8 s, as expected |

## New in round 2
- **R2-1 (must): no frost on Trenton.** Fix (worlds / grade, Trenton + winter colonies, also S06 jersey 2 January): over the r2 patchwork lay a
  light frost: a cool white tint of ~12-18 % on the open fields only (woods, roads and rivers untouched), plus a pale rim on the furrows. Keep
  S >= 50 and bring R-B down to ~8-12, so it reads as "the same fields, cold" at 360p and not as August. Show one still (c) before the re-render.
- **R2-2 (should): (e) cloth fold on the right.** At 960 px the hill right of the town looks like a draped sheet: the field textures bend over a
  sharp ridge crease with a dark shadow band (x 640-760, y 180-330). Fix: soften that relief (smaller height or a wider smoothing kernel there) or
  frame the ledger shot so the crease is out of view.
- **R2-3 (minor): (a) arrows now very thin.** 5-6 px reads at 720p but at 360p the arrowheads almost disappear; width 0.35 would still be far below
  round 1 and keep the heads readable.
- **R2-4 (minor): (c) no American infantry in frame.** Only Knox's two guns and a thin arrow show the attackers; one blue block on the
  Pennington road at the fork would make the frame read as an attack at 360p.

## Round 2 scores (1-10)
| still | score |
| --- | --- |
| (a) S04 colonies wide | **8** |
| (b) S03 Brooklyn night | **8** |
| (c) S05 Trenton | **7** (8 with frost) |
| (d) S07 Princeton orchard | **8** |
| (e) S05 Trenton ledger | **8** |

## Round 2 verdict
**OK to re-render the film: YES for the summer and autumn scenes (Brooklyn, colonies: S02-S04 and the S01 hook shots that use them).
NO for the winter scenes (S05-S08 Trenton / Princeton / winter colonies / S06 jersey) until R2-1 is done:** add the light frost and show one
still of (c). The owner asked for frost by name, and adding it after a full re-render would mean rendering those scenes again. R2-2 and
defects 5 and 8 can go in with that re-render; R2-3 and R2-4 are optional.
