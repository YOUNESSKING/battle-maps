# v2 ROUND 4, CRITIC A (LOOK + DRIFT + TROOP MOTION): Washington #21 vs the owner-approved tests

Judged: `/tmp/wx_build/washington_v2r4_720.mp4` (12:53), scene renders `/tmp/wx_v2r4/S01..S08.mp4`, compared with the round-3 renders
`/tmp/wx_v2r3/` where a fix was claimed. Frames every 3 s (258, 8 contact sheets), ~35 full-res stills, 1-2 fps windows on S05 88-115,
S05 106.5-112.5, S06 0-30, S07 7-19, a 5-fps luma trace over the S02->S03 cloud dive (117-122), 3x3 sector L on S02 1:37,
low-frequency relief stats on S04 r3 vs r4 vs v8 3 s. Checker `check_troops_motion.mjs` on S01 princeton 55-74, S03 brooklyn 50-125,
S05 trenton 85-130, S06 trenton 0-82.4, S07 princeton 44-106. Drift sheet `critics/drift_v2_r4.jpg`.
Allowed (not counted): winter frost tint, rain 28-29 Aug / storm 25-26 Dec, Brooklyn dawn fog, night scenes, S05 dark night river.
Scratch: `/tmp/wx_critic_Av2r4/`.

## Scores (10 = indistinguishable from v8 / v6 / v14)
| scene | score | one line |
| --- | --- | --- |
| S01 hook | 8 | opening = v6; key + timeline now on the montage map shots 0:54-1:12 (fixed) |
| S02 background | 7.5 | unchanged; 1:37 top row still L 33/30/29 (v8 35-38) |
| S03 Brooklyn | 7.5 | unchanged; night-march residuals (u4 21 deg 6 fr, u9 25 deg 27 fr, u8/u12 turn spike at the 91.0 cut) |
| S04 retreat | 7.5 | comb streaks gone (fixed), Knyphausen label clear of the plate (fixed); but the jersey hills now read almost flat vs v8 relief |
| S05 crossing + Trenton | 7.5 | approach blocks now ~70-80 px, banner on screen (fixed); 96-104 blocks shrink back to ~25 px; blocks pass under the timeline 106-113; Assunpink still a flat navy band with a stilted, mis-aligned bridge; main streets still ~20-30 px rust bands; no field stripes |
| S06 Assunpink | 7.5 | ice sliver + terrace gone (fixed), checker clean; riflemen delaying action 20-30 s has 15-20 px blocks on the flat jersey world |
| S07 Princeton | 7.5 | key under the ledger (fixed), British spacing (fixed, 0 overlaps); NEW: Washington's banner + "ABOUT 500 MEN" plate slide down into the timeline and off frame 9:51-9:57 |
| S08 ending | 7.5 | unchanged; end map = v6 |
| **overall** | **7.6** | |

**Fit to publish: NOT YET (close).** Every round-3 issue except S02 1:37, the Trenton fields/streets and the Assunpink band is fixed,
and the troop motion is clean (0 slide, 0 FvV fails, 0 overlaps in S05-S07). What keeps it below 8: one framing defect a viewer
will notice (S07 banner through the timeline), the Trenton close-ups that still look unlike v8 (flat river, toy bridge, fat streets,
no stripes), small blocks on two shots, and the jersey world that traded its streaks for flatness.

## Round-3 issue status
| # | issue | status | evidence |
| --- | --- | --- | --- |
| R1 | S05 banner clipped at top 96-104 | FIXED | S05 100 full-res: banner + pole fully in frame, y 25-115 / 720 |
| R2 | S05 approach blocks 20-25 px | FIXED (89-95) / REGRESSED-ELSEWHERE | 92.5: blocks ~75 px, banner fades in on screen; but at 96-104 the camera pulls back over the town head and the three American blocks are ~25-30 px again (100: x 335-460, y 135-155) |
| R3 | blue block under the timeline | NOT FIXED (moved) | 106: block sits on the timeline top edge (x 410-480, y 630-650); 110-113 a block walks in under / behind the timeline |
| R4 | Knyphausen label vs plate | FIXED | 5:18 label at y 270, plate at y 195, clear |
| R5 | S07 key under the ledger | FIXED | 11:21-11:24 key visible with the ledger up |
| R6 | S07 British blocks touch | FIXED | checker S07 44-106: OVERLAPS none |
| R7 | Trenton fields / streets | PARTLY | Princeton-end Trenton 11:30 streets now thin (fixed); S05 close shots 7:12-7:40 King/Queen still 18-30 px soft rust bands (v8 8-12 px); fields still smooth polygons with no v8 furrow stripes |
| R8 | S01 montage key / timeline | FIXED | 0:54-1:12 key + timeline present |
| #3 | jersey comb streaks | FIXED, but see N1 | S04 29.2 / 59 r3 vs r4: pale diagonal bands gone |
| #4 | S02 1:37 top row dark | NOT FIXED | 3x3 L top row 33/30/29, mid 31/31/27 |
| N8 | Assunpink flat band, ice sliver, terrace | PARTLY | sliver (9:00) and terrace (11:30) gone; river at 7:36-7:42 and 9:00 still one flat navy band, no carved bank shading or highlight like v8 Big Black |
| 5 | S03 night-march residuals | UNCHANGED (minor) | u9 25 deg 27 fr from 79.3; u8/u12 turn 406-412 deg/s at 91.0 (at the cut); u4 21 deg 6 fr from 68.2 |

## New issues
| # | scene | local t | film t | sector | problem | exact fix | sev |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | S04 / S05 dive / S06 / S07 jersey shots | S04 all, S06 0-30 | 4:54-6:06, 8:21-8:48 | all | jersey relief now nearly flat: hills are barely shaded, the world reads as flat polygons + big black wood blobs, unlike v8's lit ridges (v8 3 s). Streaks gone, so the blur is right; the light is too weak | keep dem_blur 8, raise lit_k back to ~0.32-0.35 (between 0.22 and the old value) or add a low-frequency hillshade term; check S04 29 vs v8 3 s side by side | 2 |
| N2 | S07 | 8-16 | 9:49-9:57 | BC | Washington's banner walks south while the camera holds: the "ABOUT 500 MEN" plate overlaps the portrait at 8-9, then banner and plate slide into the timeline and the banner exits under it (pre-existing in r3, missed then) | camera target follows the banner (pan 1.5 u south over 8-16) or anchor the banner at the start pos and only move the blocks; plate offset +120 px right of the banner | 2 |
| N3 | S05 | 96-104 | 7:12-7:20 | TL | American blocks drop back to ~25-30 px at the head of town (approach shot fixed, this one not) | dist -20 % on this shot or target 1 u north so the blocks and the town head share a tighter frame | 1-2 |
| N4 | S05 | ~120-126 | 7:36-7:42 | MC | Assunpink bridge is a tall dark trestle on 50-60 px stilts, set diagonally to King St and longer than the river is wide; reads as a toy model next to v8's flat plank bridges | bridge deck height -70 %, align its axis to the road, length = river width + 10 % | 1 |
| N5 | S06 | 20-30 | 8:20-8:30 | MC | riflemen delaying action: blue and red blocks 15-20 px at 720p (v14 ~70 px) | camera dist -35 % on this shot, or cut to a close shot on "American riflemen" | 1-2 |
| N6 | S06 / S07 | S07 0-16 | 9:00, 9:41-9:57 | BC | a pale tan raised band (the American line along the creek) reads as a sand levee rather than earthworks | darken to the v8 earthwork brown and narrow ~40 % | 1 |

## Troop motion (checker)
S05 85-130: 11 units, slide 0, FvV max 0 deg, screen long-side <= 9 deg, no overlaps. S06 0-82.4: r8-r10 FvV <= 10 deg, turn <= 40 deg/s,
clean. S07 44-106: 18 units, FvV <= 17 deg (0 fr > 20), turn <= 44 deg/s, no overlaps (R6 fixed). S01 princeton 55-74: no units
reported (as round 3). S03: residuals as listed (#5), all at or near the night cut. 1-fps sheets confirm front-first walks in S05 and S07.

## Drift sheet
Row 1 (S01 3 s vs v6 5 s): same clouds, plate, key, timeline; ours flatter relief. Row 2 (S04 22.8 vs v8 3 s): same furniture; ours
flatter and paler, no ridge light (N1). Row 3 night (allowed). Row 4 (S03 130.7 ledger vs v8 60.5): matches. Row 5 (S05 100 vs v8
60.5): banner now in frame (fixed); streets wider, fields without stripes, blocks small (R7, N3). Row 6 (S07 75.9 vs v14 40): matches.

## Top fixes
1. S07 8-16 (9:49-9:57): keep Washington's banner and the "ABOUT 500 MEN" plate on screen and apart (N2).
2. jersey world: restore hill light (lit_k ~0.32, keep dem_blur 8) so S04/S06 read like v8 relief without streaks (N1).
3. trenton world close shots S05 96-126: King/Queen road_w_k 0.4, v8 field stripes, Assunpink carved shading, flat plank bridge aligned to the road (R7, N8, N4).
4. S05 96-104 tighter camera (N3); S05 106-113 keep the bottom 12 % clear (R3).
5. S06 20-30 riflemen shot closer (N5).
6. S02 1:37 top row +5 L (#4); S06/S07 earthwork band darker/narrower (N6).
