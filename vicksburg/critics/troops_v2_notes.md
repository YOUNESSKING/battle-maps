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

# v4 (2026-11-18): fixes for the critics on v3 (look 5.5, motion 6.5)
Test time = S09 55-110 s (0-55 s of the test), then S10 20-35 s (55-70 s). Share: `vicksburg/troops_test_v4_share.mp4`.

| Critic point | v4 |
| --- | --- |
| LOOK 1 cardboard tokens: thick saturated base bar + bright front rail | plate 0.007 x troopScale thick (was 0.018), fill desaturated toward the coat colour, a 1-px darker edge (0.014 u), a thin warm-pale front line (3.5 % of the depth, was 7.5 % pure white); ranks 30 % deeper (block 2.3:1, 12 x 6 men) |
| LOOK 2 Union too navy, lost over woods | Union coat + plate ~20 % lighter (#3557a8 / #4a78d6); a faint pale halo under every block, in woods tinted with the side colour |
| LOOK 3 crude guns | guns 30 % smaller, NO base plate, lighter wood carriage + trail + wheels + barrel + 4 crew in the side's coats |
| LOOK 4 arrows thick / glossy / covering units | width -45 %, matte (body 80 %, edge 60 %, highlight 30 %), no drop-shadow offset, tail fades in over its first 40 %, drawn UNDER the troops (render order below the blocks) |
| LOOK 5 smoke = blurry white discs | test data: musketry curtains with smaller (x0.7), fainter (alpha 0.12-0.14), denser, wider-clustered, taller sprites (grey wisps) |
| LOOK 6 one shadow direction | the block's own shadow is now a soft CENTRED contact shadow; the only directional shadows are the real sun's shadow map |
| LOOK 7 + MOTION 1 units on the canopy | blocks inside a wood (mask from the region's wood trees) stand IN it: sunk ~70 % of a man's height into the canopy blanket (plate hidden, heads and shoulders among the crowns), halo tinted with the side colour so they stay readable |
| MOTION 2 arrow over the retreating column | arrows under the troops + thinner + tail fade |
| MOTION 3 bunching at the bridge | queue gap + 30 % of a block length; the reserve no longer stands still on the bridge approach (it leaves first, 20.0 s) |
| MOTION 4 camera pan during the retreat | S10_gm camera holds 26.4-32.6 s (was a 4-unit pan + zoom) |
| MOTION 5 group moves in unison | queue starts staggered front to back (>= 0.7 s apart) |
| MOTION 6 abrupt exit fade | edge fade = 150 px band ending at the frame edge (~1.8 s at walking pace) |
| S10 bridge | escapes 20.0-20.8 s (as Lawler reaches the works); every escaping block is off the bridge before the fire starts (31.3 s) |

Checker (v4): S09 55-110 overlaps 2 frames (0.13 u, Bowen's own blocks wheeling at the halt), vmax 2.06 u/s, amax 4.3, column spacing sd 2.3-2.4 %;
S10 20-35 overlaps 3 frames (0.09 u, the north flank's block passing its captured neighbour), vmax 2.24 u/s (the rout), amax 8.7-15 (escape curves), spacing sd 4.9 %.
Not done: arrows are not shortened to end before the column (they now pass under it instead); woods still cover parts of S09 (units are in them, not moved out).

# v5 (2026-11-18): round-3 fixes (critics on v4: look 6.5, motion 7.5). Share: `vicksburg/troops_test_v5_share.mp4`
| Point | v5 |
| --- | --- |
| L1 saturated bar / rail | the plate is smaller than the men's footprint (99 % x 86 %): only a ~2 px tint shows round the men, 1-px darker edge, 1-px pale front line (2.2 % of the depth, set just inside); fill desaturated 35 % toward the coat colour |
| L2 woods: lost colour, ghosted | the plate stays ON the surface (full opacity, its side tint visible); only the rear ~30 % of the ranks sink into the canopy; halo in woods weaker |
| L3 guns too small | guns +40 % (now ~1.0x the v3 size), barrel pale grey, wheels larger (r 0.16) and lighter brown |
| L4 smoke smears / grey slab | test data: musketry alpha 0.075-0.085, smaller (0.6-0.7), shorter life (8 s), wider broken clusters [3.2, 1.6], half the rate; the S10 parapet volley that made the slab at 55 s: rate 2.9 -> 1.4, size 0.95 -> 0.7 |
| L5 dark halo / shadow holes | contact shadow 0.45 -> 0.27, halo 0.16-0.46 -> 0.10-0.22, both off on bridge decks |
| L6 game-like | per-man height (+-7 %), facing (+-10 deg) and coat brightness (+-10 %) jitter; infantry block size varies by unit (0.92-1.06, deterministic) |
| M7 clipping the bridge | escape paths are densified, pulled onto the deck CENTRELINE within 2 u of the bridge, then resampled + smoothed (moving average +-0.9 u); on the deck the men close into a narrow file (across-deck spread 0.17 u) and the plate/halo/shadow fade out |
| M8 retreat too small | S10_gm camera 25.6-32.6 s: dist 19.5 (was 26.5) on the road + bridge, held still |
| M9 lockstep | blocks of a line start their moves 0.25-0.6 s apart (deterministic) |
| M10 tail block shrinks at exit | no sinking of the plate any more; edge fade only changes opacity |

Checker v5: S09 55-110: overlaps 3 frames (<= 0.09 u, Bowen's own blocks wheeling), vmax 1.99 u/s, amax 4.1, spacing sd 2.3 %;
S10 20-35: NO overlaps, vmax 2.24 u/s, amax 5-6 for the flanks, 20 for the reserve (it starts right at the bridge), spacing sd 3.5 %;
every escaping block is off the bridge before the fire (31.3 s: last one at x 1508.4, the deck ends at ~1510.2).
