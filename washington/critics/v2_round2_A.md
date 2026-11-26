# v2 ROUND 2, CRITIC A (LOOK + DRIFT + TROOP MOTION): Washington #21 vs the owner-approved tests

Judged: `/tmp/wx_build/washington_v2r2_720.mp4` (12:53), scene renders `/tmp/wx_v2r2/S01..S08.mp4`. Frames every 3 s (258, 8 contact
sheets), 32 full-res stills, 1-2 fps windows on S05 88-104, crops at 2-2.5x, 3x3 sector L / chroma vs v8 3 / 35 / 60.5 s and v14 40 s,
a same-time v2r1 vs v2r2 comparison (126 / 140 / 350 / 400 / 540 / 612 s). Checker `check_troops_motion.mjs` on S01 princeton 55-74,
S02 brooklyn 20-44.7, S03 brooklyn 50-125, S04 jersey 0-66, S05 trenton 0-88 + 85-130, S06 trenton + jersey 0-82.4, S07 princeton 44-106.
Drift sheet `critics/drift_v2_r2.jpg`. Allowed (not counted): winter frost tint, rain 28-29 Aug / storm 25-26 Dec, Brooklyn dawn fog,
night scenes, S05 dark night river. Scratch: `/tmp/wx_critic_Av2r2/`.

## Scores (10 = indistinguishable from v8 / v6 / v14)
| scene | score | one line |
| --- | --- | --- |
| S01 hook | 7.5 | opening = v6; Princeton lines now run across the frame (fixed), but the frozen Stony Brook is a bright white tiled "highway" with a 90-deg bend |
| S02 background | 5.5 | Long Island wide still dark flat olive (TL-TR L 23-28 vs v8 33-35) with faceted triangle shading; dark cloud-shadow discs still on the bay; wakes gone |
| S03 Brooklyn | 7.5 | close-shot puffs gone, night march clean on the checker (u9 25 deg / 27 fr only), first-light plate = 30 Aug |
| S04 retreat | 7 | stamps -> carved names (fixed); jersey relief clearly softer, a few bright slope streaks left; plate drops back to "December 1776" |
| S05 crossing + Trenton | 6 | river cloud bank + red pulse gone; Greene / Sullivan / guns STILL slide 88-104 s (checker 0.73-0.90 u/s, 72-98 fr, u4 lengthwise 67 deg); world-edge sliver at 33.5; "NO FORTIFICATIONS" rubber stamp |
| S06 Assunpink | 7 | pulses, smoke blob and bottom block fixed; checker clean (trenton); Assunpink a flat tiled blue band with a terraced cut bank |
| S07 Princeton | 7 | Nassau Hall at v14 scale (fixed, ~60 px blocks); but the town is a spaghetti of wide rust roads, the college model is a dark garbled glyph, Princeton seal still covers "Jan" |
| S08 ending | 7.5 | territory no longer over clouds (fixed); end map = v6 |
| **overall** | **6.8** | |

**Fit to publish: NO.** Twelve of 23 round-1 issues are fixed, the biggest look gain is the softer jersey relief and the Nassau Hall
scale. Still blocking: the S05 Trenton approach slide (the sev-3 motion issue was not fixed: same units, same 95.5 s spike), the dark
faceted Long Island wide, and three new world defects (white tiled frozen creek, Princeton road spaghetti / garbled college, S05 edge sliver).

## Round-1 issue status
| # | issue | status | evidence |
| --- | --- | --- | --- |
| 1 | S07 Nassau Hall block scale, gun on timeline | FIXED | 11:07 blocks ~60 px, men ~8 px, gun at y 440; checker princeton 84.5-105 clean |
| 2 | S05 Greene / Sullivan / Knox slide 89-98 | NOT FIXED | u1 slide 0.90 u/s 91 fr FvV 59 deg; u3 0.73 98 fr FvV 58 (170 fr from 88.3); u4 0.73 78 fr + screen long-side 67 deg 72 fr (lengthwise); u5 0.85 72 fr; guns u6/u7 0.84 27-30 fr; turn 340-780 deg/s at 95.5. Frames 96-103: Greene's 3 blocks drift sideways under the blue arrow |
| 3 | jersey / colonies comb relief | MOSTLY FIXED | 4:59 / 5:29 slopes soft; residual bright slope streaks right of the Delaware 5:24-5:36 (sev 1) |
| 4 | S02 Long Island wide dark / flat | NOT FIXED | 1:37 sectors L 23-29 (top) vs v8 3 s 33-37; triangle facets across the island |
| 5 | S03 night march slides | FIXED (minor rest) | no slides except u8 4 fr at the 91.0 cut; u9 FvV 25 deg 27 fr from 79.3; u4 / u12 21 deg |
| 6 | S05 cloud bank on the river | FIXED | 6:00-6:06 clear |
| 7 | S05 world edge 33.5 | PARTLY | a 15-30 px slanted pale wedge at x 0-30, y 300-500 on 33.5 (1-3 frames before the whiteout) |
| 8 | red pulses S05 / S06 | FIXED | 5:45, 9:01-9:04 clean |
| 9 | S08 territory over clouds | FIXED | 11:52-12:00 no clouds on the belt |
| 10 | S06 smoke blob | FIXED | 8:52 small puffs |
| 11 | S06 blue block in bottom 12 % | FIXED | 9:05 block at y 580-610 |
| 12 | S05 Hessian block in bottom 12 % | PARTLY | 7:15 three Hessian blocks y 610-645 at x 1000-1280, right next to the timeline end; blocks ~95 px (v14 70) |
| 13 | S03 puffs over close Brooklyn | FIXED | 2:04-2:08 shadows only |
| 14 | S01 Princeton lines as columns | FIXED | 1:06 lines across the frame; checker clean |
| 15 | S07 militia diagonal walk | NOT FIXED | u12 / u16 / u17 FvV 22-26 deg, 73-75 fr from 63.5 (unchanged, noted sev 1 by the build) |
| 16 | S07 snap-turns in the 84.0 dissolve | NOT FIXED | r0-r5, u6-u17 turn 50-236 deg/s at 84.0 |
| 17 | S07 r0 / r5 entrance | NOT FIXED | r0 screen 54 deg 22 fr from 46; r5 FvV 22 deg 55 fr |
| 18 | S07 Princeton seal on "Jan" | NOT FIXED | 11:20 crop: seal still sits on "Ja|n", ribbon tails over "Princeton" |
| 19 | S07 tilted Mercer banner | FIXED | fades out |
| 20 | S02 cloud-shadow discs / bead wakes | PARTLY | wakes gone; a hard, pixel-edged dark disc still on the bay at 1:19-1:24 (x 800-910, y 460-520) |
| 21 | rubber stamps outside the hook | PARTLY | WHITE PLAINS / FORT WASHINGTON / THE MUD FROZE fixed; "NO FORTIFICATIONS" red stamp still at 5:50 (S05 13.5) |
| 22 | S03 plate day missing | FIXED | 30 Friday first light |
| 23 | white pond rims | NOT CHECKED-CHANGED | rims still visible at 5:00 (sev 1, unchanged) |

## New issues
| # | scene | local t | film t | sector | problem | exact fix | sev |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | S01 (and S07 left edge) | 60-72 | 1:00-1:12 | TR, TC | frozen Stony Brook renders as a bright white tiled band (L ~85) with a hard 90-deg bend: reads as a concrete highway, not a v8 carved river; exposed by the new 82-89 deg yaw | princeton world: winter water = v8 river blue with the frost tint (ice lightness <= +15 %), drop the tile/stripe ice texture; smooth the creek polyline bend (Chaikin 2x) | 2 |
| N2 | S07 | 84-105 | 11:05-11:26 | MC | Princeton town = 5-6 wide rust roads crossing at odd angles (spaghetti grid, ~35 px wide) and Nassau Hall is a dark garbled glyph; v8 / test c towns = one or two thin roads + clean houses | princeton world: keep only the post road + Witherspoon St, road width to the v8 rut width (~0.35 x now); replace the college mesh with the clean town-house model scaled x3 (or the test-c church model) | 2 |
| N3 | S02 | 22.6-37.6 | 1:36-1:51 | all | Long Island ground shows flat-shaded triangles (faceted lighting) | colonies / brooklyn wide: smooth vertex normals (or bake the normal map from a blurred DEM as done for jersey: dem_blur, lit_k) | 2 |
| N4 | S02 | 29-37 | 1:43-1:51 | MC | the three American blocks turn to face east, so on screen their long side is vertical: read as columns (owner: no columns) | camera yaw +60-90 for this beat, or keep them facing south and show the flank with the red arrow only | 1 |
| N5 | S05 | 88-95 | 7:04-7:11 | MC | blocks walk through the 3D wood clumps (block half inside a clump at 90.0) | route gPos / sPos keys around the clumps or keepClear the woods along the walk | 1 |
| N6 | S03 / S04-S05 / S06 / S07 | S03 5-30, S04 65-S05 87, S06 31-56, S07 0-43 | 2:03-2:27, 5:36-7:03, 8:51-9:16, 9:41-10:24 | BL, BC | THE ARMIES key and/or the wax-seal timeline absent for long stretches (up to ~90 s); v8 keeps both on every map shot (unchanged since r1; not flagged then) | keep key + timeline on every map shot (dimmed 0.7 at night), hide only under a full card / the poll | 1 |
| N7 | S04 / S05 | S04 59, S05 0-15 | 5:30, 5:37-5:52 | TL | date plate falls back from "8 December, Sunday" to month-only "December 1776" | keep the last spoken day until the next one (8 Dec -> 25 Dec) | 1 |
| N8 | S06 | 31-56 | 8:51-9:16 | MC, BL | Assunpink is a flat blue tiled band with a terraced cut bank on the left; pale sliver of the Delaware ice beside the key (x 10-30, y 520-600) | trenton world: river shading as v8 (no tile stripes), bank blend 2 px; frame 1.5 u east | 1 |

## Top fixes
1. S05 85-104 (7:01-7:20): Greene's / Sullivan's single blocks and Knox's guns: turn in place first (hold 1.2-1.5 s), then walk along
   their front normal; no walk across the 95.4 dissolve; u4 must not march lengthwise. Re-run `check_troops_motion.mjs washington/scenes/S05 85 130 trenton` until 0 slide / 0 FvV FAIL (#2).
2. S02 Long Island wide (1:36-1:51): lift ground to v8 L 33-40 with v8 patchwork colours, smooth the faceted normals, remove the
   bay shadow discs (1:19-1:24) for real (#4, N3, #20).
3. S01 1:00-1:12: frozen Stony Brook as frost-tinted v8 blue, no white tile texture, smooth bend (N1).
4. S07 11:05-11:26: Princeton town to two thin roads, clean college model (N2); seal off "Jan" / "Princeton" (#18).
5. S05 33.5 (6:10): yaw / at so the wedge at x 0-30 never shows before the whiteout (#7).
6. S05 7:15: Hessian blocks +1 u north (all above y 610), size to v14 70 px (#12); S05 5:50: "NO FORTIFICATIONS" -> dark v8 plate (#21).
7. S07 10:45 / 11:04: militia turn-first; end orchard moves by CUT4 - 1 (#15, #16).
8. Overlays: keep key + timeline on map shots at night and dusk (N6); keep the day on the date plate S04 end / S05 start (N7).
