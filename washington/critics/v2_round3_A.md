# v2 ROUND 3, CRITIC A (LOOK + DRIFT + TROOP MOTION): Washington #21 vs the owner-approved tests

Judged: `/tmp/wx_build/washington_v2r3_720.mp4` (12:53), scene renders `/tmp/wx_v2r3/S01..S08.mp4`. Frames every 3 s (258, 8 contact
sheets), 28 full-res stills, 1.5-5 fps windows on S05 32.6-34.2 / 86-104 and S07 4.6-7, crops at 2-3x (timeline seals, bottom-left
corners), 3x3 sector L / chroma vs v8 3 / 35 s and v14 40 s. Checker `check_troops_motion.mjs` on S01 princeton 55-74, S02 brooklyn
20-44.7, S03 brooklyn 50-125, S05 trenton 85-130, S06 trenton 0-82.4, S07 princeton 44-106. Drift sheet `critics/drift_v2_r3.jpg`.
Allowed (not counted): winter frost tint, rain 28-29 Aug / storm 25-26 Dec, Brooklyn dawn fog, night scenes, S05 dark night river.
Scratch: `/tmp/wx_critic_Av2r3/`.

## Scores (10 = indistinguishable from v8 / v6 / v14)
| scene | score | one line |
| --- | --- | --- |
| S01 hook | 8 | opening = v6; Stony Brook now a frost-blue carved river with a smooth bend (fixed); montage 0:51-1:12 runs without key / timeline |
| S02 background | 7.5 | Long Island wide brighter and smooth (no facets), lines across the frame, no bay disc; 1:37 top row still a bit dark (L 28-32 vs v8 35-38) |
| S03 Brooklyn | 7.5 | unchanged and clean; night-march residuals (u9 25 deg 27 fr, u8 / u12 turn spike at the 91.0 cut) |
| S04 retreat | 7 | jersey relief still shows pale diagonal "comb" streaks (5:00, 5:30-5:45, and through the S05 dive); Knyphausen label cut by the count card at 5:18 |
| S05 crossing + Trenton | 7.5 | walks fixed (checker 0 slide / 0 FvV / 0 lengthwise), dive edge clean, plate keeps "8 Sunday", NO FORTIFICATIONS is a dark plate; but the approach shot 89-95 shows tiny pale blocks and Washington's banner is clipped at the top edge 96-104 |
| S06 Assunpink | 7 | checker clean; Assunpink softer but still a flat uniform blue band; white Delaware-ice sliver at the left edge (9:00) and a terraced field bank (11:30) remain |
| S07 Princeton | 8 | thin roads + clean Nassau Hall (fixed), seal clear of "Jan" (fixed), checker FvV clean; adjacent British blocks touch (overlap 0.06 u for 30 s); key hidden under the ledger at 11:20 |
| S08 ending | 7.5 | unchanged; end map = v6 |
| **overall** | **7.5** | |

**Fit to publish: NOT YET (close).** 13 of the 16 open round-2 issues are fixed or mostly fixed, including the only sev-3
motion issue (S05 Trenton approach), the faceted Long Island, the white Stony Brook and the Princeton road spaghetti. What is
left is mostly sev 1-2 world polish (jersey streaks, Assunpink band, edge slivers) and two new framing defects in S05.

## Round-2 issue status
| # | issue | status | evidence |
| --- | --- | --- | --- |
| 2 | S05 Greene / Sullivan / Knox slide 88-104 | FIXED | checker S05 85-130: every unit slide 0.00, FvV 0 deg, turn 0-5 deg/s, screen long-side <= 9 deg; 1.5-fps sheet: blocks walk front-first |
| 3 | jersey comb relief | NOT FIXED (residual) | 5:00 TL-TC and 5:30-5:45 TR: pale diagonal bands across the hills; same streaks in the S05 dive 32.6-33.4 |
| 4 / N3 | S02 Long Island dark / faceted | MOSTLY FIXED | 1:43 L 37/34/33 top row, 40/39/35 mid (v8 36-40); facets gone. 1:37 top row still 32/29/28 |
| 7 | S05 world edge 33.5 | FIXED | 5-fps 32.6-34.2: no wedge before the cloud whiteout |
| 12 | S05 Hessian block bottom 12 % | FIXED | 7:15 Hessians y 300-390 / 720 |
| 15 | S07 militia diagonal walk | FIXED | u12-u17 FvV 9-15 deg, 0 fr > 20 |
| 16 | S07 snap-turns in the 84.0 dissolve | FIXED | turn <= 12 deg/s at 83.0-83.1 for u12-u17; r0-r5 4-28 deg/s |
| 17 | S07 r0 / r5 entrance | FIXED | r0 / r5 FvV 8 deg, screen 3-4 deg |
| 18 | S07 seal on "Jan" | FIXED | 11:10 crop: seal sits right of "Jan", clear of "Princeton" |
| 20 | S02 bay disc | FIXED | 1:19-1:24 only soft cloud shadows |
| 21 | NO FORTIFICATIONS stamp | FIXED | 5:50 dark v8 plate |
| 23 | white pond rims | FIXED | 5:00 rims gone |
| N1 | S01 white tiled Stony Brook | FIXED | 1:08 frost-blue carved river, smooth bend |
| N2 | S07 Princeton road spaghetti / garbled college | FIXED | 11:05-11:20 two thin roads, clean Nassau Hall model |
| N4 | S02 blocks read as columns | FIXED | checker S02 screen long-side <= 12 deg; 1:43 lines across the frame |
| N5 | S05 blocks inside wood clumps | FIXED (not seen) | 89-95 no block inside a clump |
| N6 | key + timeline on every map shot | MOSTLY FIXED | present S03 night, S04-S05, S06, S07 night; still missing S01 0:51-1:12 montage and S07 11:20 (ledger up) |
| N7 | date plate day | FIXED | 5:30-5:52 "8 December Sunday" kept |
| N8 | S06 Assunpink flat band + ice sliver | PARTLY | banks softer, but river still one flat blue band; white sliver x 0-25, y 545-600 at 9:00 and pale wedge + terraced bank at 11:30 (S07 108.7) |
| 5 | S03 night march residuals | UNCHANGED (minor) | u9 FvV 25 deg 27 fr from 79.3; u8 / u12 turn 406-412 deg/s at 91.0 (at the cut, not visible) |

## New issues
| # | scene | local t | film t | sector | problem | exact fix | sev |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | S05 | 96-104 | 7:12-7:20 | TC | Washington's banner sits on / above the top edge (only the flag and pole show at 7:16-7:20) while the blue arrow starts from it | at / camera target +1.5 u south for this beat, or move the banner pos 2 u south so it sits >= 60 px inside the frame | 2 |
| R2 | S05 | 89-95 | 7:05-7:11 | TL-MC | approach shot: American blocks are ~20-25 px pale lilac blobs on a busy patchwork; at 720p the march reads as empty ground (v14 blocks ~70 px); Washington's banner pops in at the right edge at 94 | camera dist -30 % (or fov 0.7x) on this shot so blocks are >= 50 px; fade the banner in on screen, not at the edge | 2 |
| R3 | S05 | 96-104 | 7:12-7:20 | BC | one blue block peeks out under the timeline (x 660-700, y 540-560 at 7:20) | keepClear the bottom 12 % for the last 2 s, or camera 0.5 u north | 1 |
| R4 | S04 | 47.5 | 5:18 | MC | "Knyphausen" carved label is cut by the "ABOUT 1,400 MEN" plate | label offset -40 px x, or plate +60 px right | 1 |
| R5 | S07 | 97-104 | 11:18-11:25 | BL | THE ARMIES key disappears while the result ledger is up (ledger is top-right, no conflict) | keep the key at 1.0 under the ledger | 1 |
| R6 | S07 | 53.5-83.2 | 10:35-11:04 | MC | British r0 / r1 / r2 blocks touch and interpenetrate (checker overlap 0.05-0.06 u for ~30 s) | spread the British line +0.12 u per block | 1 |
| R7 | S05 / S06 | Trenton close shots | 7:12-7:40, 9:05-9:16 | all | Trenton fields are huge soft polygons without the v8 furrow stripes, and King / Queen St are ~30 px rust bands (v8 roads ~8-12 px) | trenton world: road_w_k 0.4 as done for Princeton; field stripe texture on as in v8 | 1 |
| R8 | S01 | 51-72 | 0:51-1:12 | BL, BC | montage + title runs with no key / timeline (v6 keeps both) | accept for the name-slam card only; show key + timeline on the night-crossing and Princeton shots | 1 |

## Drift sheet
Rows 1-2 (S01 3 s vs v6 5 s, S04 22.8 s vs v8 3 s): same clouds, plate, key, timeline, grade; ours slightly flatter relief and fewer
woods (winter allowed). Row 3 (S03 night) allowed. Row 4 (S03 130.7 ledger vs v8 60.5): same ledger and clock card; our redoubt rings
and ring road read stronger than the v8 earthworks. Row 5 (S05 100 vs v8 60.5): see R1 / R7: banner off frame, wide rust streets,
no field stripes. Row 6 (S07 75.9 vs v14 40): blocks at v14 scale, banner pose and lines match; ground slightly flatter yellow.

## Top fixes
1. S05 96-104 (7:12-7:20): bring Washington's banner fully into the frame and keep the bottom 12 % clear (R1, R3).
2. S05 89-95 (7:05-7:11): tighten the approach camera so the blocks read at >= 50 px; banner fade on screen (R2).
3. jersey world: kill the remaining pale diagonal slope streaks (5:00, 5:30-5:45, S05 dive) with a wider dem_blur / lower lit_k (#3).
4. trenton world: Assunpink with v8 river shading (no flat band), remove the white ice sliver at 9:00 and the terraced bank at 11:30; thin Trenton roads + field stripes (N8, R7).
5. S02 1:37: lift the top row of the Long Island wide ~+5 L (#4).
6. Small overlays: key under the S07 ledger (R5), Knyphausen label vs plate (R4), British block spacing S07 (R6), key / timeline on the S01 montage map shots (R8).
