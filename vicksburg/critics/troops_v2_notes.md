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

# v6 (2026-11-18): owner round 4 ("sometimes they move sideways; through a bridge they move sideways; maybe they should just break rank")
Share (with the film's soundtrack for the same windows): `vicksburg/troops_test_v6_share.mp4`.

| Point | v6 |
| --- | --- |
| No sideways movement | every phase now turns first, then walks along the men's facing: line moves turn (1.0 s) BEFORE the block moves and turn back AFTER it stops, on each block's own (staggered) clock; column forming turns 0.9 s before stepping off; deploys = wheel (22 %), walk with the men facing the way they go (28-80 %), face front (86-100 %), no overlap between phases; retreats turn about first, then walk forward along the path (unwrapped tangent); heading low-pass cut to +-0.15 s so the facing never lags the path |
| New check | `check_troops_motion.mjs` reports per unit the max angle between the block's velocity and its men's facing and FAILS any frame > 20 deg while moving > 0.2 u/s. v6: S09 55-110 max 6 deg, S10 20-35 max 19 deg, 0 failing frames (the S10 reserve failed at 46 deg until its escape path was smoothed: moving average +-1.3 u, 3 passes) |
| Bridges: break ranks | within ~2.6 u of a bridge the escaping block dissolves: each man walks the escape path in a stream 3 abreast (rows 0.06 u apart, jittered), on the DECK height, facing along the deck; no plate, no halo, no shadow on the bridge; past it the men walk back into their rank spots over ~1-1.5 s (per-man staggered). No block shape slides across |
| Camera | S10_gm: close framing (dist 21) from the first retreat step (20.0 s) and held still to 32.6 s |
| Other | guns +30 %, arrows +20 % width, unit size variation reduced (0.96-1.04), the 55 s parapet volley = separate short-lived puffs |
| Sound | the film's own mix muxed for the same windows (film 728.252-783.252 + 871.788-886.788, 0.3 s fades) |

Checker v6: overlaps S09 2 frames (<= 0.15 u, Bowen's own blocks wheeling at the halt), S10 none; accel S09 <= 4.1, S10 <= 6.1 u/s^2;
column spacing sd S09 2.3 %, S10 0.4 %; every escaping block clear of the bridge before the fire (31.3 s).
Not done: units +25 % on WIDE shots (no wide shot in these excerpts).

# v7 (2026-11-18): owner round 5 ("still some sideways") - formation-front rule, march columns, calm turns
Share (with sound): `vicksburg/troops_test_v7_share.mp4`.

| Point | v7 |
| --- | --- |
| Move only front-first | a block may only move along its FORMATION's front normal. Only a short straight advance (<= 20 deg off its front, <= 3 u) stays in line (the line turns <= 20 deg first). Every other move: the men RE-FORM in place into a narrow march column, 4 files x 18 ranks (same 72 men, ~1.4 s, each man on his own clock, the plate fades through and comes back in the new shape), the column marches head first, then re-forms into line at the new spot. Columns form AHEAD of the line spot (the men walk to it) and end with the head on the new spot, so the block never moves backward or sideways |
| Retreats | the men turn about in place (0.5 s), re-form into a column whose head points away from the enemy, then walk off; escape paths smoothed (+-3 u) and the bridge blend 4 u long |
| Flank marches | blocks of one unit whose march lanes coincide wait their turn (re-form and step off nose to tail once the block ahead is a column length + gap away); blocks on different lanes march side by side |
| Turn rate | <= ~45 deg/s: path tangents over +-0.25 u (no quantisation jitter), smoothed paths; a re-forming (men walking) is not counted as a block turn |
| Checker | `check_troops_motion.mjs`: angle between velocity and the FORMATION front normal (FAIL > 20 deg while > 0.2 u/s), turn rate in deg/s (FAIL > 45), both skipped only while the men are re-forming (0.02 < f < 0.98). Screen space: an aligned motion stays aligned under the projection, so the world angle is the test |
| Bridge framing / arrow | S10_gm: hold at dist 21 from 20.0 s, push in 24.0-25.8 s to dist 13 on the bridge and hold to 32.6 s; the retreat arrow narrow (0.13) and unit red (#a8392b) |
| Data | S09_gm: Hovey's crest line at s 1.2 (columns clear the battery), Lee falls straight back, Logan's brigades 1.6 s apart and spread, Bowen's second brigade starts later and leaves the bottom earlier; S10_gm: escapes 1.2 s earlier (the re-forming takes time; still clear of the bridge before the fire) |

Checker v7: S09 55-110 front-vs-velocity max 4 deg (0 fails), turn <= 37 deg/s, pops 0, accel <= 2.0, overlaps 2 pairs (<= 0.16 u for 0.2-0.4 s);
S10 18-35 front-vs-velocity max 3 deg (0 fails), turn <= 45 deg/s, pops 0, accel <= 2.7, NO overlaps; last escaping block at x 1508.7 at 31.3 s (off the deck).

# v8 (2026-11-18): critic round 6 (motion 6.5 / look 7.5) - columns that read as columns, calm re-forming
Share (with sound): `vicksburg/troops_test_v8_share.mp4`. Sheet: `vicksburg/troops_test_ours_v8.jpg`.

| Point | v8 |
| --- | --- |
| Columns read as columns | 3 files x 24 ranks, rank spacing 0.55 x file spacing (dense along the march); plate under the column in the side colour (10 % coat tint vs 35 % for lines); a colour-bearer with pole + flag at the HEAD; walking bob 0.12-0.22; slight per-rank sway; coats tinted 30 % toward the unit colour; a faint LIGHT dust wake behind a marching column (own white-rgb soft texture: the shared shadow texture is black rgb, so the first try drew a dark slab) |
| Bridge re-forming | the deck stream uses the column's own row spacing (3 abreast, 0.55 x file spacing), so the column neither elongates on the deck nor morphs back on the far side; re-forming takes 2.0 s, each man on his own clock (per-file stagger 0.1-0.3 s + jitter) |
| Line <-> column elsewhere | same 2.0 s per-file staggered re-form; the run starts its march only after the column is formed (fOn ends at the run's t0) and re-forms into line only after it halts |
| Arrow on the deck | S10 retreat arrow ends at 23.8 s, before any column reaches the deck (first crossing ~25 s) |
| Framing | S10 camera holds the whole crossing; the columns leave the frame on the left only after crossing |
| Spacing | queue spacing jitter +13 % of a column length, minimum stagger 0.5 s |
| Turn-rate warp (new) | escape paths walk slower on bends (cost per 0.1 u = 1 + turn / turnMax-scale, max-filtered +-0.8 u then averaged +-0.8 u), so the turn rate stays <= ~40 deg/s without speed lurches |
| S10 data | vesc 2.1, turnMax 0.76, ESC_T [16.2, 16.0, 16.3]; both flank columns west of the deck at the fire (x 1507.9 / 1506.1 at 31.3 s, deck west end ~1510.2) |

Checker v8: S09 55-110 front-vs-velocity max 4 deg (0 fails), turn <= 39 deg/s, accel <= 2.1, pops 0, NO overlaps;
S10 15-35 front-vs-velocity max 6 deg (0 fails), turn <= 34 deg/s, accel <= 3.1, pops 0, NO overlaps.
Column spacing sd: S10 reserve 56 % = the gap between its two brigades opening from ~3.3 to ~5.4 u as the rear one follows (no compression); other units 2-9 %.

Own 5 fps inspection of every moving unit ("reads as column/line moving front-first"):
- S09 Hovey's two crest lines advancing SW (0-6 s): yes (line, front first; they shuffle into place for ~0.6 s at the halt)
- S09 Hovey's west-wing brigades at the wood edge (4-7 s): yes (column west, deploy into line at the halt)
- S09 Lee falling back south (5-12 s): yes (turn about, column, head first)
- S09 Barton going west (5-12 s): yes (column)
- S09 Logan's three brigades (8-15 s): yes (lines advancing front first, staggered)
- S09 Bowen's two brigades up from the road (25-34 s): yes (N-S columns, head first)
- S09 Bowen's left brigade past the battery (33-37 s): yes (column passes close to the guns, no contact)
- S09 Bowen's crest lines re-forming and falling back south (44-49 s): yes (men walk to their spots, then columns south head first, light wake behind)
- S09 Crocker / Union columns south to the crest (45-53 s): yes
- S10 north flank (0-12 s): yes (re-forms 1.4-2.4 s, column SW then W on the road, crosses 9-10.4 s)
- S10 south flank (0-12 s): yes (column on the road, crosses behind the north flank, clear before the fire)
- S10 reserve (3-7 s): yes (two columns over the bridge, stream 3 abreast on the deck, compact on the far side)
- S10 Union lines advancing on the works (0-4 s): yes (lines, front first)
Noticed, not fixed: the blue Union attack arrow crosses the retreating north-flank column at S10 2.6-4.2 s; a small yellow flash in the woods west of the bridge at S10 12.2-12.8 s.

# v9 (2026-11-18): owner rejected v8 ("it moved sideways ... move like a rectangle") + "boxes again, a professional box like we do in 2D"
Share (with sound): `vicksburg/troops_test_v9_share.mp4`. Sheet (old film boxes | new boxes): `vicksburg/troops_test_ours_v9.jpg`.
Switch: `troopsOpts: { look: "box" }` with `troops: "blocks"` (the GM soldier look and the film's own `boxes` mode are unchanged).

| Point | v9 |
| --- | --- |
| Look | the film's Style W box (createBoxes3D: flat side-colour rectangle, ink border, cream X for infantry, dot for guns, soft contact shadow, fogged, under smoke/clouds), same size as the film (one box per film box, film bw/bd/gap), captured boxes fade to grey; no soldiers, no columns. Style W arrows and colours (not the GM tint) |
| One formation | every box is a rectangle whose long side is its front. Every move (advance, march, retreat, reposition) = the box walks perpendicular to its long side |
| Change of direction | the box turns IN PLACE first (turn time (angle + 0.3 rad) / 0.44 rad/s, smoothstep: peak <= ~40 deg/s), walks, then turns back to its facing; two moves meeting at a corner > 30 deg never merge: the box stops, turns, then walks (the later moves shift, never squeezed) |
| Retreat | the box walks BACK, front still toward the enemy (no spin, no about-face of the symbol) |
| Screen space | each moving box's world heading is corrected through the camera's ground Jacobian so its ON-SCREEN long side is perpendicular to its ON-SCREEN travel (residual <= ~3 deg); boxes sit at a terrain height smoothed over ~1 u (a flat symbol jumping over the works' parapet read as a sideways drift) |
| Escape / bridge | each routing box crosses the fields on one gentle curve to the bridge mouth (roads don't constrain it), a straight first step, queue spacing by the effective (bend-slowed) path length; at the bridge it fades out over ~2.5 u and fades back in on the far side; all past the deck before the fire (last box x 1509.2 at 31.3 s, deck west end ~1510.2) |
| Checker | `check_troops_motion.mjs` now places the camera at every step (`world.placeCamAt`) and FAILS a frame where the angle between the box's on-screen velocity and the normal of its on-screen long side (box flat at its own height) exceeds 15 deg while it moves > 0.2 u/s |
| Data (test copies) | S09: crest battery moved to (1631.9, 698.9) clear of Bowen's two routes, Bowen's first waypoint at (1635.0, 698.8) (62 deg corner); S10: second battery y 684.5, escapes ESC_T [13.4, 13.3, 13.1] (reserve first), vesc 2.5, turnMax 0.62 |

Checker v9: S09 55-110: screen long-side angle max 15 deg (1 frame at 15.x, Crocker at 99.8 s), turn <= 42 deg/s, accel <= 2.1, vmax 2.1, pops 0, NO overlaps;
S10 10-35: screen max 14 deg (0 fails), turn <= 47 deg/s (the reserve, one 0.1 s step while fading on the bridge approach; all others <= 40), accel <= 3.7, pops 0, NO overlaps, no vanishing boxes.

Own 5 fps inspection ("rectangle moving long-side-first"):
- S09 Hovey's crest brigades (0-6 s): yes
- S09 Hovey's west wing at the wood edge: yes (turns in place, walks broadside)
- S09 Lee falling back south: yes (turns ~45 deg in place, walks broadside)
- S09 Barton going west: yes (box turned 90 deg, walks west broadside)
- S09 Logan's three brigades: yes (turn to the march, broadside down from the railroad)
- S09 Bowen's two brigades up from the road: yes
- S09 Bowen's crest lines falling back south: yes (walk back, front toward the enemy)
- S09 Union pursuit / Crocker to the crest: yes
- S10 north flank, south flank, reserve: yes (broadside across the fields, fade at the bridge mouth, back in on the far side)
- S10 Union lines advancing on the works: yes
Noticed: S10 escapes now start ~3 s earlier than v8 (the boxes are in the field from the first frame of the excerpt) so the whole queue clears the bridge before the fire.

# v10 (2026-11-18): critics on v9 (motion 8, look 7) - clean screen-plane boxes, stop-turn-walk escapes, still camera
Share (with sound): `vicksburg/troops_test_v10_share.mp4`. Sheet (old film boxes | new boxes): `vicksburg/troops_test_ours_v10.jpg`.

| Point | v10 |
| --- | --- |
| 1 rotate while translating | routing boxes walk STRAIGHT legs only: slot -> near deck end -> far deck end -> the road's end; each turns in place first ((angle + 0.1) / 0.44 rad/s, smoothstep), walks with a constant heading; the only other heading change happens on the deck while the box is faded out |
| 2 bridge fades | by path distance: out over the 1.25 u before the near deck end, back in over the 1.25 u past the far end (~0.5 s each at 2.5 u/s), same on both sides |
| 3 camera | S10: one still framing 20.0-32.6 s (at 1514.2, 684, dist 20.4): works, fields, bridge and exit all in frame; the 24-25.8 s push-in is gone |
| 4 exit fade | the routing boxes fade over ~300 px at the frame edge (~1.5-2 s) |
| 5 no shear | every box is a clean rectangle in the SCREEN plane (camera-facing quad), turned to its heading's on-screen direction; fixed slight tilt = short side x 0.8; the heading is the travel direction itself (the on-screen normal = the projected heading, so no camera correction) |
| 6 border | the ink border is drawn in the shader from screen-space derivatives: ~2 px at 1080 (~1.3 px at 720), anti-aliased, identical on every box |
| 7 contact shadow | soft dark quad behind every box, offset 3 px down-right (screen), 25 % |
| 8 smoke | S09 puffs back to ~50 % of the film's (size 0.85, alpha 0.09, slow drift windK 0.4) |
| 9 arrow edge | the pale outer edge fades out in three steps (no hard white rim) |
| 10 symbols | guns = the kit's approved gun box (fx.js `art_gun`), infantry X, cavalry = one slash, engineers = the gear (renderer ready for later scenes); the mask is drawn for each type's own box aspect (no stretched gun) |
| Timing | S10 escapes back to ESC_T [18.9, 18.8, 18.6] (the straight legs are quicker); last box past the far end ~29.4 s, fire 31.3 s |

Checker v10 (screen-space rule, billboard normal = projected heading): S09 55-110 screen max 5 deg, turn <= 30 deg/s, accel <= 2.1, pops 0, overlaps only within a unit while turning in place (<= 0.05 u);
S10 15-35 screen max 10 deg, turn <= 26 deg/s, accel <= 3.5, pops 0, overlaps <= 0.05 u (south flank's own boxes turning at 22.5 s), no vanishing boxes.

Own 5 fps inspection ("rectangle moving long-side-first"): every moving box yes - S09 Hovey crest + west wing, Lee, Barton, Logan x3, Bowen x2 up and back, Union pursuit / Crocker; S10 north flank, south flank, reserve (turn in place, straight walk, fade at the bridge, back in past it, soft exit), Union lines on the works.

# v11 (2026-11-19): owner rejected the boxes ("return to the soldier blocks and fix the problems I told you about")
Share (with sound): `vicksburg/troops_test_v11_share.mp4`. Sheet (old film boxes | new blocks): `vicksburg/troops_test_ours_v11.jpg`.
Switch: `troopsOpts.look = "lineblocks"` = the GM soldier blocks (plate, rows of 3D men, pale front line, guns with carriage / crew, banners) driven by the v10 rectangle motion. No march columns anywhere.

| Rule | v11 |
| --- | --- |
| One formation | every block stays the wide LINE rectangle (fixed plate size and shape: checker shape change 0.0 %) |
| Long side first | every move is perpendicular to the plate's long side, judged on screen (heading corrected through the camera Jacobian, residual <= 3 deg; checker FAIL > 15 deg) |
| Stop, turn, walk | the block turns in place (the plate and its men wheel together; the turn time comes from the real on-screen angle, <= ~40 deg/s), then walks a straight leg; corners > 30 deg = stop + turn (later moves shift, never squeezed) |
| Retreat | the men about-face in place (~1 s) and the block walks back long side first, front still toward the enemy (no spin) |
| Bridge | straight leg to the near deck end; ~1.7 u before it the block BREAKS RANKS and the men stream across the deck 3 abreast in order; past the far end they walk back to their rank spots over ~1.5 s (staggered per man) and the block walks on long side first |
| Ground | blocks stand on the terrain smoothed over ~1 u (no jump over the works' parapet / ditch, which read as a sideways drift) |
| Camera | S10: one still framing 20-32.6 s (at 1513.5, 684.5, dist 19): approach, crossing and far-side re-forming all in frame, men readable |
| Spacing | S10 Union lines stop 0.8-0.9 u further east of the captured works (the v10 stack at the railway); no overlaps between units in either excerpt |
| Look | S09 blocks +20 % (size 1.44 on the wide shot); coats 45 % toward the side colour; captured blocks a clear mid grey (coat 0x75726e, plate 0x8c8984); smoke ~50 % of the film's puffs |

Checker v11: S09 55-110: screen long-side angle max 16 deg (Crocker, 5 frames at 99.1 s; all others <= 15), turn <= 38 deg/s, accel <= 2.1, pops 0, shape 0 %, NO overlaps;
S10 15-35: screen max 9 deg, turn <= 39 deg/s, accel <= 2.8, pops 0, shape 0 %, overlaps only within the south flank while turning in place (0.05 u, 22.7 s). Frames where the ranks are broken at the bridge (no plate, the men walk) are not judged as block motion.

Own 5 fps inspection ("rectangle moving long-side-first, no stretch, no turn-while-moving"):
- S09 Hovey's crest brigades: yes / yes / yes
- S09 Hovey's west wing: yes / yes / yes
- S09 Lee falling back (men about-face): yes / yes / yes
- S09 Barton going west: yes / yes / yes
- S09 Logan's three brigades: yes / yes / yes
- S09 Bowen's two brigades up and back: yes / yes / yes
- S09 Union pursuit / Crocker: yes / yes / yes (Crocker 16 deg on screen for 0.5 s)
- S10 north flank, south flank, reserve: yes / yes / yes (break ranks at the bridge, stream 3 abreast, re-form on the far side in frame)
- S10 Union lines on the works: yes / yes / yes

# v12 (2026-11-19): critics on v11 (look 7.5, motion 7: rule 6.5, bridge 6.5) - visible bridge crossing, still close camera, no turn while moving
Share (with sound): `vicksburg/troops_test_v12_share.mp4`. Sheet: `vicksburg/troops_test_ours_v12.jpg`.

| Point | v12 |
| --- | --- |
| 1 camera | S10: one still framing 20-32.6 s at (1514.6, 684.6), dist 15 (blocks ~70 px long, men readable); works, fields, bridge and far side in frame. S09: the crest battery at (1632.4, 697.9), fully in frame at 35 s |
| 2 approach | each routing block walks broadside on ONE straight leg from its slot to a stop point just before the bridge mouth (never along the road, never rotated lengthwise), and STOPS there |
| 3 break ranks | the men file onto the deck 3 abreast, one row every 0.045 s (the block empties in ~1.4 s), ordered by distance to the deck entry; each man walks his own path (rank spot -> his lane on the deck -> deck exit -> his own rank spot in the re-formed block) at ~1.3 u/s; the plate fades out as its men leave and fades in as they arrive; the block walks on only when the last man is in place. No strip, no morph |
| 4 queue | one block at the mouth at a time (the next arrives >= 0.9 s after the last man of the previous one stepped onto the deck); re-form spots alternate left / right of the road so the far side never stacks; blocks start in frame; soft exit fade at the left edge (~300 px) |
| 5 turn while moving | every key is its own move (no merged polylines) and any corner > 5 deg = stop, turn in place, walk; the heading never follows a curve while walking |
| 6 arrow | the red retreat arrow runs from the road across the field to the deck, over the bridge and a short way past it (no V, not over forest / river) |
| 7 smoke | S09 puffs drift (wind x 2.75), ~50 % of the film's strength |
| Timing | S10 escapes ESC_T [16.9, 16.8, 15.6]: reserve x2 at the mouth 18.9 / 21.8 s, south flank 24.5 s, north flank 27.3 s; the last men leave the deck ~30.3 s, before the fire (31.3 s) |

Checker v12: S10 15-35: screen max 11 deg, turn <= 41 deg/s, accel <= 2.8, pops 0, shape 0 %, overlaps only within the south flank while turning in place (0.05 u); frames with ranks broken (men walking, no plate) are not judged as block motion.
S09 55-110: screen max 16 deg (Crocker, 5 frames at 99.1 s; all others <= 15), turn <= 38 deg/s, pops 0, shape 0 %, one brush 0.07 u at 106.2 s (units 1 x 3).

Own 5 fps inspection (block: "rectangle long-side-first / no stretch / no turn while moving"; crossing: "stops, men file across, re-form individually"):
- S10 reserve block 1, reserve block 2, south flank, north flank: yes / yes / yes; crossing yes (4 of 4)
- S10 Union lines on the works: yes / yes / yes
- S09 Hovey x2, Lee, Barton, Logan x3, Bowen x2, Union pursuit / Crocker: yes / yes / yes (Crocker 16 deg on screen for 0.5 s)

# v13 (2026-11-19): owner on v12 ("they go, stop, break rank, cross, reunite - too much: break rank GRADUALLY as they move in, pass, continue up the trail, vanish")
Share (with sound; S09 part unchanged from v12): `vicksburg/troops_test_v13_share.mp4`. Stills: `vicksburg/troops_test_ours_v13.jpg`.

| Point | v13 (S10 only) |
| --- | --- |
| No stop | each routing block walks broadside on one straight leg toward the bridge mouth; it never halts there |
| Gradual break | over the last ~1.3 s each man drifts out of his rank spot (moving with the block) toward his lane at the deck mouth - the flanks funnel inward, the plate fades out over ~1 s - and the men enter the deck one row of 3 every 0.06 s, so the block flows into the stream without a pause |
| Pass | the stream crosses the deck straight, 3 abreast, evenly spaced (0.075 u lanes, ~0.08 u between rows) |
| Up the trail, vanish | past the far end the men keep walking up the road (the trail west of the bridge) as a loosening stream (each at 90-110 % pace, lanes widening) and fade out one by one between 1.5 and 4 u past the bridge (~2 s); no regrouping, no far-side blocks |
| One at a time | a block starts funnelling only when the previous one's last row is on the deck (+0.4 s); last row of the last block on the deck 28.4 s, off it ~29.5 s, before the fire (31.3 s) |
| Camera | one still framing at (1513.9, 684.6), dist 16.2: the bridge and the start of the trail well inside the frame on the left, the works on the right |

Checker v13 S10 15-35: screen max 9 deg, turn <= 41 deg/s, pops 0, shape 0 %, overlaps only within the south flank while turning in place (0.05 u); a block that has broken up (plate gone, men streaming) no longer counts as a rectangle for the overlap test.
Own 5 fps inspection of every crossing (reserve x2, south flank, north flank): approach broadside without stopping, gradual funnel, straight stream over the deck, up the trail, fade - yes x4.
