# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 5

Inputs: `/tmp/wx_build/washington_round5_720.mp4` (12:53), `/tmp/wx_render6/S01..S08.mp4`, `washington/critics/drift_round5.jpg`,
`round4_A.md`, `worlds/previews/round4_fix.jpg`, scene NOTES. Frames: every 4 s over the whole film (7 contact sheets,
`/tmp/wx_critic_A5/sheet_*.jpg`), full-res stills of every round-4 item, 5 fps strips (S03 dive 120.8-123.4, S03 covering force
local 74-77, S05 Greene local 94.5-106, S06 decide card 558.5-561.5, S07 mud stamp 600-610), luma scan of the S03 dive, motion checker
on S03 brooklyn, S04 jersey, S05 trenton + jersey, S06 jersey, S07 princeton (`/tmp/wx_critic_A5/motion/`). Film t = scene A + local t.

## Drift check (drift_round5.jpg: this film | Jackson v4 | approved tests)
All six rows match the family: same date plate (day cell + weekday + note; clock plate at night), gold 3D numbers (2,400 / 4,999+),
gold 3D name slam over the map with the banner, navy ledger result card, line blocks + volleys + smoke (S07 70 vs troops v14),
cream method strip with the type-on line, the same end card (WHICH WAS HIS GREATEST MOVE? / three tiles / 1, 2 OR 3?) over a
clouded wide map. Clouds are the v6 cumulus tufts. Differences: the winter grade (allowed); the **jersey world still looks softer
than Jackson / v8**, with hard flat polygon field patches (S04 4:56-5:56, S06 8:20-8:48, S07 10:00-10:24). The round-4 re-bake
(feathered patches, detail 0.13) barely shows on screen: compare `round4_fix.jpg` BEFORE/AFTER, the facets are almost identical.
This is now the largest look gap left. The S03 result card has an empty right half at 9,000 (4:00-4:04, single-column ledger);
Jackson's single-number cards are laid out the same way, so this is not drift.

**The render fault is gone:** S02-S05 are clean all the way through (no ellipse, no cream frames outside the dive punch).

## Scores (R1 -> R5)

| Scene | R1 | R2 | R3 | R4 (as delivered / content) | R5 | Note |
|---|---|---|---|---|---|---|
| S01 | 6 | 7 | 7.5 | 8 / 8 | 8 | clean, unchanged |
| S02 | 5.5 | 7 | 7.5 | 2 / 7.5 | 8 | clean render; fleet + 32,000, flank arrow, 1,000 MEN CAPTURED all read |
| S03 | 6.5 | 7 | 7.5 | 2 / 7.5 | 7.5 | world edge after the dive (new, sev 2); covering-force shots tiny at 720p |
| S04 | 5 | 6.5 | 7 | 1.5 / 7 | 7.5 | clean; stamps read; jersey facets |
| S05 | 6 | 6.5 | 7 | 2 / 7.5 | 7.5 | Greene fixed; ring doughnut, NJ landing at the top edge, dark field trapezoid |
| S06 | 6 | 7 | 7 | 7.5 | 7.5 | Cornwallis banner fine, decide card no blink; jersey facets |
| S07 | 5.5 | 7 | 7.5 | 8 | 8 | clean; mud stamp still kisses the banner (sev 1) |
| S08 | 6 | 7.5 | 7.5 | 8 | 8 | end map + card a Jackson sibling, ~16 s clean map |
| **Overall** | **5.8** | **7.0** | **7.4** | **3 / 7.8** | **7.9** | |

**Fit to publish? NOT YET, one fix away.** Fix 1 (the S03 world edge, a camera/cloud-timing change) takes it to yes at ~8;
fix 2 (jersey facets) is the main remaining look gap to Jackson but does not block publishing.

## Round-4 item status

| # | Round-4 finding | Status | Evidence |
|---|---|---|---|
| 1 | S02-S05 corrupted renders | **FIXED** | every 4 s sheet clean 1:13-8:20; render_qa gate in place |
| 2 | Flat-frame gate | **FIXED** | `washington/tools/render_qa.py` |
| 3a | S03 dive end (2:01.4-2:01.7) | **NEW DEFECT** | no snap, but the landing shows the world edge, see N1 |
| 3b | S03 method card | **OK** | 4:11-4:16: "Move 1 · Brooklyn / THE WASHINGTON METHOD / 1. Save" types on, steps out cleanly |
| 3c | S05 method card | **OK** | 7:59-8:06: line 1 then "2. Hit them where they rest", map visible above |
| 4 | S05 Greene snaps 95.5 / 97.5 | **FIXED** | 5 fps 94.5-98.5: blocks walk straight, no snap; checker turn <= 48 deg/0.1 s only at the 95.4 dissolve (u4 75 deg at 95.5 = inside the dissolve, invisible) |
| 5 | jersey field facets | **NOT FIXED (on screen)** | re-bake visible only side by side; 5:04, 8:32, 10:12 still hard polygons |
| 6 | S05 crossing landing at the top 15 % | **NOT FIXED** | 6:36.4 (S05 59.9): NJ bank still a thin strip at y 10-14 % |
| 7 | Trenton ring wood doughnut | **NOT FIXED** | 7:04-7:10 (S05 88-94): the largest object in frame, empty centre |
| 8 | S07 mud stamp on the banner | **NOT FIXED** | 10:09.6: stamp's lower edge touches the banner finial/nameplate |
| 9 | S05 101.5+ slides | **OK** | after 95.4 the camera is on the town head; Greene's blocks are off frame; no sideways drift visible |
| 10 | S07 decide card blink (owner fix) | **FIXED** | 5 fps 558.5-561.5: banners fade, title in at once, no blink |
| - | S06 Cornwallis banner later | **OK** | 8:32 banner with the column, 9:12-9:16 at the head of the column, no edge cut |

## NEW findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| N1 S03 | 4.5-6.1 | 2:02.0-2:03.6 | After the cloud punch the brooklyn region lands with its **east and north-east world edge visible**: a flat khaki void to the right of the map and in the top-right corner for ~1.6 s (dive.jpg frames 6-13). Looks unfinished at the start of move 1. | in `sequences/S03/seq.js` dives[0]: `to.dist` 74 -> 60 and `to.at` x 2493 -> 2488 (and the t 11.0 key dist 72 -> 62, at x 2492 -> 2488) so the frustum stays inside the region; or keep the framing and hold the clouds longer: `off.clear` 0.4 -> 0.75 so the cloud deck covers the edge until the camera has settled. Check one frame at local 4.6 before re-render | 2 |
| N2 S03 | 3.6-3.85 | 2:01.43-2:01.63 | 7 frames of near-flat cream (YLOW-YHIGH <= 13) at the punch; round-2 note says "no flat cream hold" | `off.emerge` 0.1 -> 0.05 or start the map fade 0.1 s earlier; minor, Jackson's punch is also near-white | 1 |
| N3 S03 | 70.9-104.6 | 3:08-3:42 | Covering-force shots (dist 29-33, tilt 48-50): blue blocks are 10-15 px wide at 720p, "covering force" label ~7 px, the lines read as specks; checker u5/u6 slides 1.2-1.3 u at 75.5-76.6 invisible at this size | dist 33 -> 24 and 29 -> 22, centre on the fort line (2499, 1164); label size +40 % | 2 |
| N4 jersey | - | 4:56-5:56, 8:20-8:48, 10:00-10:24 | Field patches still flat hard-edged polygons; the round-4 feathering is not visible at camera dist 150-300 | stronger change than round 4: patch contrast k 0.35 -> 0.2 (or 0) on jersey, feather radius x3, and add the colonies canopy speckle to jersey woods; verify with a 720p crop at S06 8 s, not a full-res preview | 2 |
| N5 S05 | 90-104 | 7:06-7:20 | trenton world: a dark, hard-edged trapezoid field (lower right, ~25 % of frame) beside the town; reads as a render hole in the grey dawn | trenton field patch contrast as N4, or shift the camera 6 u west to frame it out | 1 |
| N6 S04 | 13-16 | 4:44-4:47 | "3,000" sits on top of the red pincer arrowheads at Fort Washington | number 0.08 screen-height lower-right, or show it after the arrows fade | 1 |
| N7 S06 | 14-27 | 8:34-8:47 | checker r9 / u10 3.7-3.8 u/s (2x the other blocks) on the fighting retreat; fast but readable | cap at 2.4 u/s (lengthen the leg by ~1.5 s) | 1 |

## Troop motion (checker; R4 -> R5)
S05 trenton 12 FAIL (same units; turn rows only at the 95.4 dissolve now, the 97.5 snap is gone; front-vs-velocity rows are the
yaw-14 oblique, screen long-side fine), S05 jersey 2 (at the 88.0 dissolve), S07 princeton 6 (unchanged, cut rows), S03 brooklyn 8
(u5/u6 slides 75.5-76.6 + turns at the 70.9 / 76.6 / 91.0 / 105.3 cuts; invisible at N3 size), S06 jersey 5 (speed rows, N7),
S04 jersey 0. 0 pops and 0 overlaps in every region run. 5 fps checks: Greene walks straight, Princeton lines hold their gap,
Hessians form in Trenton's streets as wide blocks, Cornwallis's column is wide blocks stacked on the road (long side first, correct).

## Top 10 fixes
1. S03 2:02-2:03.6: hide the brooklyn world edge after the dive (to.dist 74 -> 60 or clouds clear 0.4 -> 0.75).
2. jersey look: a much stronger patch flatten + feather + canopy speckle; judge it at 720p in S06 8:30 / S07 10:12.
3. S03 covering-force shots 3:08-3:42: camera 25 % closer so the blocks and the label read at 720p.
4. S05 6:36 crossing: tilt toward the NJ bank so the landing is not a strip at the top edge.
5. S05 7:04-7:10: fill the ring wood's centre or frame it out (camera 10 u west).
6. S05 7:06-7:20: soften the dark field trapezoid next to Trenton.
7. S07 10:09: lift THE MUD FROZE 0.06 screen-height clear of Washington's banner.
8. S04 4:44: move 3,000 off the pincer arrowheads.
9. S06 8:34-8:47: slow r9 / u10 to the pace of the other blocks.
10. S03 2:01.4: shorten the 0.2 s flat cream at the cloud punch. Leave S01, S02, S07, S08 alone.
