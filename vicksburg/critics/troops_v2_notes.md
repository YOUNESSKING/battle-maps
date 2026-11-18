# GM troops v3: motion rework after the owner's feedback (2026-11-18)

Owner on the v2 test: "I like the new style, but how they move: they're stretching, they're colliding, and then fleeing in a way
I don't like. I want it more professional." Look kept; MOTION rebuilt (`engine/troops3d.js` `createTroops3D` v3). Not self-scored:
for the two independent critics. Same excerpts: S09 Champion Hill 55-110 s, S10 Big Black 20-35 s.

## What changed, against each owner point
| Owner point | v2 (what he saw) | v3 |
| --- | --- | --- |
| 1. No stretching | the plate morphed between a 12x5 line and a long thin 4x15 column (it elongated / squashed), column gaps opened and closed | **fixed shape**: plate + 60 men never change size; a column is the same block marching BY THE FLANK (men face along the march, plate's long side along the road). Line <-> column = the men turn in place (~0.9 s) and the plate wheels; deploy = (1) every block wheels in place, (2) walks to its slot along its long side with the men facing where it goes, (3) men face front. Column spacing = block length + gap, constant (measured sd 2.3-3.3 %) |
| 2. No collisions | push-apart shoved blocks sideways / through each other; data put brigades on top of each other | push-apart REMOVED (it made blocks slide). Overlaps measured (oriented-rectangle penetration, every pair, every 0.1 s) and fixed in the test copies of the data (`sequences/S09_gm`, `S10_gm`). Escapes: ONE queue per road, blocks set off in order, never closer than one spacing (gap can only open) |
| 3. Calm pace | moves up to 15-17 % frame width / s, sstep easing (peak 1.5x average) | trapezoid speed profile (1 s ease in / cruise / 1 s ease out), cruise <= 1.0 x troopScale u/s (~4.5 % frame width / s); an over-fast move leaves up to 5 s earlier from its hold (still arrives on its word); a move right after a column move stays in column (no deploy-on-the-move); arrivals walk in 1.6 x troopScale over 3 s with a 1.2 s opacity fade-in |
| 4. Retreat / rout | blocks loosened, plate shrank, sudden dash, men scattered | escape = the men turn about, the block steps straight back out of the line, bends onto the road on a smooth curve (cubic, Chaikin-rounded), joins the road queue at a steady 1.25 x troopScale u/s (S10: 1.6, a brisk walk to clear the bridge before the fire), plate turns exactly with the path (unwrapped tangent: no flips); fades over the frame edge in a long gradual band; NO loosening / shrinking; captured blocks stay put, grey, tidy ranks. Fades are now real per-instance opacity (no scale tricks); skirmishers walk back into the front rank instead of shrinking |
| 5. Bigger units | blocks ~3 % of frame width, 3 per brigade | **+20 %** per block and GM's count (about half as many): infantry n boxes -> round(2n/3) blocks; a brigade's frontage is a little SMALLER than the film's boxes, which is what removed most collisions |

## Measurements (`node vicksburg/tools/check_troops_motion.mjs <scene> t0 t1 [region]`, 10 fps)
New checks: plate shape change, overlap / penetration between ANY two blocks, column spacing variance, max speed AND acceleration,
sliding = motion across both the plate's long side and the men's facing.

| Check | v2 (S09 55-110) | v3 S09 55-110 | v3 S10 20-35 |
| --- | --- | --- | --- |
| shape change | line <-> column morph (not measured) | 0.0 % | 0.0 % |
| overlaps (penetration > 0.02 u) | 9-11 unit pairs, up to 0.47 u (= a third of a block), e.g. 13-308 frame-pairs | 1 frame, 0.05 u (Bowen's own blocks wheeling at the halt) | 3 frames, 0.12 u (the north flank's escaping block brushing its captured neighbour at 24.5 s) |
| max speed | 4.2-6.6 u/s (11-17 % fw/s) | 2.06 u/s (5.4 % fw/s); most units 1.70 (4.5 %) | 2.24 u/s (5.9 %, the rout) |
| max acceleration | 13-25 u/s^2 | 4.3 u/s^2 | 12 u/s^2 (escape curves) |
| sliding | 6-213 frames per unit | 1 frame (0.18 u/s) | 2-6 frames per escaping unit, while the men turn about |
| turn rate (plate) | up to 76 deg / 0.1 s, 180 deg flips | <= 9 deg / 0.1 s | <= 21 deg / 0.1 s |
| column spacing sd | (accordion) | 2.3-2.4 % | 3.3 % |
| pops (> 0.5 u / frame) | up to 12 | 0 | 0 |
| bridge before fire (S10) | - | - | every escaping block west of the bridge at 31.3 s (fire start) |

## Data changes (test copies only; the film's S09 / S10 are untouched)
- S09_gm: ONE crest battery (caps: taken 59.8 -> retaken 88.7 -> lost 107.7) set behind the crest, Hovey's crest line short of it;
  Bowen's two brigades start on his card (80.7 s), Cockrell swings onto the axis by the flank first, then both come down in line; Lee
  stays clear of Bowen until he has passed; Barton goes west first, round Lee, then south; Crocker arrives in line on Hovey's left
  (walk-in) and climbs with him to s -2 instead of a 2 s oblique dash; Hovey's retreat is one move (no stop-start).
- S10_gm: the Union lines close round the works instead of marching through the captured line; Lawler stops at the works; Union guns
  behind the supports (they sat inside Benton's line); two Confederate batteries re-sited clear of the escape roads (the north one sat
  on the flank's way out); the flanks and the reserve leave as the line falls (21.4-22.4 s) at a brisk walk.

## Known residuals (for the critics to judge)
- Arrows are unchanged (the S10 Lawler arrow still points past the works where his brigade now stops).
- The escape approach curves still show short accelerations (~12 u/s^2) and 2-6 frames where the block moves before the men have
  fully turned about.
- Champion Hill is heavily wooded: blocks in woods are partly hidden by tree crowns (no route-around-woods logic).
- Units appearing mid-scene still fade in (now real opacity, 1.2 s) while they walk in.

Files: `vicksburg/troops_test_v3_share.mp4` (new: S09 55-110 s then S10 20-35 s, 1280x720 30 fps), `vicksburg/troops_test_ours_v3.jpg` (film boxes | v3 at 5 matched moments), `vicksburg/troops_test_film_share.mp4` (finished film, same excerpts),
`vicksburg/troops_test_gm_share.mp4` (v2, the one the owner saw).
