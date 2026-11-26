# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 6

Inputs: `/tmp/wx_build/washington_round6_720.mp4` (12:53), `/tmp/wx_render7/S01..S08.mp4`, `washington/critics/drift_round6.jpg`,
`round5_A.md`, `worlds/previews/round5_fix.jpg`, scene NOTES (round-5 sections). Frames: every 4 s over the whole film (6 contact
sheets, `/tmp/wx_critic_A6/sheet_*.jpg`), 5 fps strips of the S03 dive (119-127) and the S05 dive (365.5-371.5), luma scan of the
S03 punch, full-res stills + top-right crops of the S03 landing (121.8-125.0), S03 covering force (189.5/196/210/219), S05 NJ landing
(396.5/401), S05 Trenton approach (425.5/429.5), S07 stamp (609.5/612), S06 Cornwallis banners (510-527 at 1 fps, 554.5), S04 3,000
(284.5), jersey fields (507.4/520/612). Motion checker on S03 brooklyn, S04 jersey, S05 trenton + jersey, S06 jersey + trenton,
S07 princeton + trenton. Film t = scene A + local t.

## Drift check (drift_round6.jpg: this film | Jackson v4 | approved tests)
All six rows match the family: same date plate (day cell + weekday + note; clock plate at night), gold 3D numbers (2,400 / 4,999+),
gold 3D name slam with the banner, navy ledger result card, line blocks + volleys + smoke (S07 70 vs troops v14), cream method strip
with the type-on line, the same end card over a clouded wide map. Clouds are the v6 cumulus tufts; dives punch through the same
cream deck as v6. Only difference: the winter grade (allowed). The jersey world is now noticeably flatter than round 5 (field
patches lower contrast, edges feathered: 8:27, 8:40, 10:12); facets are still faintly visible but no longer read as hard polygons
at 720p. It is the closest the film has been to Jackson v4 / v8. No drift.

## Scores (R1 -> R6)

| Scene | R1 | R2 | R3 | R4 (as delivered / content) | R5 | R6 | Note |
|---|---|---|---|---|---|---|---|
| S01 | 6 | 7 | 7.5 | 8 / 8 | 8 | 8 | unchanged, clean |
| S02 | 5.5 | 7 | 7.5 | 2 / 7.5 | 8 | 8 | unchanged, clean |
| S03 | 6.5 | 7 | 7.5 | 2 / 7.5 | 7.5 | 8 | covering force reads; dive edge now ~1 s in the top-right corner under haze (was 1.6 s, the whole right side) |
| S04 | 5 | 6.5 | 7 | 1.5 / 7 | 7.5 | 8 | jersey flatter; 3,000 clear of the arrowheads |
| S05 | 6 | 6.5 | 7 | 2 / 7.5 | 7.5 | 8 | NJ landing mid-frame, ring wood gone; 0.4 s edge wedge in the dive (old, minor) |
| S06 | 6 | 7 | 7 | 7.5 | 7.5 | 7.5 | Trenton banner fixed; jersey Cornwallis banner cut by the top edge for ~10 s (old, missed in R5) |
| S07 | 5.5 | 7 | 7.5 | 8 | 8 | 8.5 | stamp clear of the banner; jersey flatter |
| S08 | 6 | 7.5 | 7.5 | 8 | 8 | 8 | unchanged |
| **Overall** | **5.8** | **7.0** | **7.4** | **3 / 7.8** | **7.9** | **8.0** | |

**Fit to publish? YES (8.0).** The film reads as a sibling of Jackson v4 and the approved tests at publish quality. Two cheap framing
fixes (N1 S06 banner, N2 S03 corner) would take it to ~8.3; neither blocks publishing.

## Round-5 item status

| # | Round-5 finding | Status | Evidence |
|---|---|---|---|
| 1 | S03 dive landing world edge (N1) | **MOSTLY FIXED** | the east void after landing is gone (123.4, 125.0 clean to every edge). Left: a khaki world edge beyond the Manhattan strip in the top-right ~12 % x 25 % of the frame 121.75-122.75 (S03 4.2-5.2), seen through the thinning cloud haze; crisp at 122.0-122.4. See N2 |
| 2 | S03 flat cream at the punch (N2) | **SAME (ok)** | 7 frames YHIGH-YLOW <= 13 at 121.47-121.70; same as Jackson's punch, leave it |
| 3 | S03 covering force 25 % closer (N3) | **FIXED** | 189.5/210/219: blocks ~45-55 px wide, "covering force" label legible, the fort line and the blocks read |
| 4 | jersey facets (N4) | **IMPROVED (enough)** | 507.4, 520, 612: patch contrast clearly lower, edges soft; residual faint facets, not a defect at 720p |
| 5 | S05 NJ landing at the top edge | **FIXED** | 396.5/401: the bank sits at y 35-40 %, blocks and the road in the middle third |
| 6 | S05 Trenton ring wood | **FIXED** | 425.5/429.5: ring wood framed out, Greene's three blocks on open ground |
| 7 | S05 dark field trapezoid (N5) | **IMPROVED** | head-of-town shot shifted; the patch is a small soft area at 7:24-7:32, fine |
| 8 | S07 THE MUD FROZE vs banner | **FIXED** | 609.5/612: stamp ~60 px clear above-left of Washington's finial |
| 9 | S06 Cornwallis banner (Trenton map) | **FIXED** | 554.5: banner fully inside the frame at the head of the column, nameplate readable |
| 10 | S04 3,000 on the arrowheads (N6) | **FIXED** | 4:44: number below the pincer heads |
| 11 | S06 r9/u10 speed (N7) | **NOT FIXED (sev 1)** | checker still 3.7-3.8 u/s; reads as a quick fighting retreat, acceptable |

## NEW findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| N1 S06 | 13.6-23.6 | 8:33.0-8:43.0 | Jersey shot: **Cornwallis's banner is cut by the top edge** for ~10 s: nameplate and finial off frame at 8:33-8:39, nameplate half-cut 8:40-8:43, exactly while he is introduced ("Cornwallis marched... 5,500 men"). Same in round 5 (I missed it). | `sequences/S06/seq.js` banners: the JE Cornwallis keys `[[0, ...RD(70,-3.0)], [13.4, ...RD(70,-3.0)], [29.6, ...RD(48,-3.0)]]` -> place him ~6 road-units further down the column during the intro: `[13.4, ...RD(64,-3.0)]` and add `[24.0, ...RD(60,-3.0)]` before the 29.6 key (or tilt the 13-24 s camera 3 deg down / `at` 4 u north). Check one still at local 15 and 22: the finial must be >= 20 px below the top edge | 2 |
| N2 S03 | 4.2-5.2 | 2:01.75-2:02.75 | Residual of R5 N1: a flat khaki world edge (beyond the Manhattan strip) in the top-right corner while the cloud haze clears; crisp for ~0.4 s at 2:02.0-2:02.4 | `dives[0].off.clear` 0.75 -> 1.0 (the deck covers the corner until 122.8), or the mid key yaw 4 deg toward the south-west; robust engine option for N2 + N3: paint the beyond-world plane in the region's water/ground tone so an edge never reads as a void | 1.5 |
| N3 S05 | 33.3-33.7 | 6:09.8-6:10.2 | During the dive into the cloud a khaki world-edge wedge (3-6 % of width) shows at the left edge, growing until the cloud covers it; same in round 5 (old). Fast and dark, minor | `dives[0].from` yaw -60 -> -64 or dist 150 -> 140 so the left frustum stays inside JE, or the engine edge fill above | 1 |
| N4 S06 | 13.6-27.4 | 8:33-8:47 | (= R5 N7) r9/u10 at 3.7-3.8 u/s, 2x the other blocks | lengthen those legs ~1.5 s (cap 2.4 u/s) | 1 |

## Troop motion (checker; R5 -> R6)
0 pops and 0 overlaps in every region run. S03 brooklyn 7 FAIL (was 8; all turn rows at the 70.9 / 76.6 / 91.0 / 105.3 cuts or
off-frame after 70.9), S04 jersey 0, S05 trenton 12 (unchanged: 95.4 dissolve turns + yaw-14 oblique front-vs-velocity, screen
long-side <= 11 deg), S05 jersey 2 (88.0 dissolve only), S06 jersey 5 (speed rows N4 + the 32.5 cut), S06 trenton 0, S07 princeton 6
(unchanged: on-screen correction 29 deg on the oblique withdrawals, screen long-side <= 6 deg; turn spikes at the 83.9 cut),
S07 trenton 7 (u0-u5 turn spikes exactly at CUT1 16.6; r11/r12 front-vs-velocity 27-32 deg 118-120 = oblique correction, screen
long-side <= 4 deg, the blocks march as wide rectangles in the streets, checked at 2.5 fps 697.5-701.5). Every remaining FAIL row is
a cut, a dissolve or the documented oblique correction; nothing visible as a slide, a stretch, a column or a collision.

## Top 5 fixes
1. S06 8:33-8:43: bring Cornwallis's banner fully into the frame during his intro (keys 6 road-units down the column, N1).
2. S03 2:01.75-2:02.75: hide the top-right world edge behind the cloud deck (`off.clear` 0.75 -> 1.0) or fill beyond-world with water tone.
3. S05 6:09.8-6:10.2: keep the dive's left frustum inside the jersey world (yaw -60 -> -64).
4. S06 8:33-8:47: slow r9/u10 to <= 2.4 u/s.
5. Leave everything else: S01, S02, S04, S07, S08 and the jersey look are done.
