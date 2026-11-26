# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 3

Inputs: `/tmp/wx_build/washington_round3_720.mp4` (12:53), `/tmp/wx_render4/S01..S08.mp4`, `washington/critics/drift_round3.jpg`
(ours | Jackson v4 | approved gm3d v6/v8 + troops v14), round-2 review `round2_A.md`, scene NOTES.md round-2 fix lists,
`worlds/previews/round2_fix.jpg` + `round2b_fix.jpg`.
Frames: every 4 s over the whole film (6 contact sheets), full-res stills at 0:02, 0:24, 1:04, 4:07, 5:20, 6:24, 7:08, 9:00, 10:40,
11:08, 11:44, 12:44; 1-4 fps windows on S05 crossing/landing (6:24-6:40), night march (6:53-7:05), Trenton approach (7:07-7:13),
S06 Assunpink (8:56-9:11), S07 Princeton (10:34-10:46); 2.5x crops of the date plate, the night-march landing and the towns; luma trace of
the S03 dive (1:59.5-2:02.5). Motion checker on every scene x region (`/tmp/wx_critic_A3/motion/`; regions that do not exist in a
scene throw `T3` and are not counted). Film t = scene A (`audio/scenes.json`) + local t.

## Verdict on drift
The film now sits in the Jackson / v8 family on every row of the drift sheet: same plate, banners, gold 3D name slam, navy ledger cards,
cream method strip, end card, cloud tufts. Clear gains this round: **clouds are on every wide shot** (opening 0:00-0:10 has 4-6 in frame,
Long Island 1:12-1:30, S04 4:32-4:52, jersey 5:04, 5:36, 6:00, end map) and the **crossing floes are toned, small and irregular**
(6:20-6:40 no longer stickers). The Princeton close blocks are now thin 3-4-rank lines like troops v14.
What still separates us from Jackson / v8 (all visible on the drift sheet row 2 and on every jersey shot):
- **Wide woods remain soft-edged flat blobs** ("camouflage"). The 2b re-bake made them larger masses along the valleys, but there is still
  no canopy speckle and no crisp edge. Jackson J_S01_66 / J_S08_55 show dot-textured tree canopy with a hard edge; ours at 0:02 and 0:54 do
  not. Fields show visible Voronoi facets (polygon shading) on colonieswinter and jersey that Jackson's ground does not.
- **jersey is still blurry** (accepted as a hard limit: 16k texture / RAM). It is the single biggest look gap left: 4:56-6:08, 6:44-7:04,
  8:08-8:52, 9:58-10:27 read out of focus next to the sharp Trenton/Princeton close worlds they cut to. A framing fix is possible (below).
- winter ground pale grey-green (allowed).

## Scores (R1 -> R2 -> R3)

| Scene | R1 | R2 | R3 | Note |
|---|---|---|---|---|
| S01 | 6 | 7 | 7.5 | Opening clouds in, lamps halved, floes toned; empty day cell on the plate 0:20-0:44; woods still blobs |
| S02 | 5.5 | 7 | 7.5 | Long Island now has clouds; navy sea; reads like Jackson |
| S03 | 6.5 | 7 | 7.5 | Result card fixed (A FEW + divider together); dive hold down to ~0.3 s but ends in a luma snap; evac FvV only after the 70.9 dissolve |
| S04 | 5 | 6.5 | 7 | Colonies + clouds good; jersey 4:56-6:08 still blurry camouflage; posts readable now (troopScale 7) |
| S05 | 6 | 6.5 | 7 | Floes fixed, boats good; night march no longer races but blocks sit at the frame edge under the banner; Trenton approach walks THROUGH the ring wood; landing at the top edge |
| S06 | 6 | 7 | 7 | Bridge fight clean; Washington banner cut by the bottom edge 8:56-9:11; jersey part blurry |
| S07 | 5.5 | 7 | 7.5 | Princeton thin lines (v14-like), gun half size; Mawhood r4 + British leaving Trenton still oblique; blue/red lines touch at 10:34-10:40 |
| S08 | 6 | 7.5 | 7.5 | End map a Jackson sibling; unchanged |
| **Overall** | **5.8** | **7.0** | **7.4** | |

**Fit to publish? NO (close).** No single blocking defect left, but the S05 Trenton approach (blocks walking over the donut wood, 7:07-7:13),
the S06 banner cut off at the frame edge, the empty plate cell in the hook and the jersey blur together keep it under 8. Two of these are
one-line fixes.

## Round-2 item status

| # | Round-2 finding | Status | Evidence |
|---|---|---|---|
| 1 | S05 night march racing 8 u/s, tiny blocks | **FIXED (speed) / NEW (framing)** | 6:53-7:05: no racing, no pops, troopScale 12; but the two blocks stay at x 0-20 % of frame, half under Washington's banner, and barely leave before the cut (see NEW 2) |
| 2 | Wide woods flat blobs, no canopy | **NOT FIXED (partly improved)** | round2b: larger valley masses; still no speckle / crisp edge (0:02, 0:54, 4:28, 12:44 vs J_S01_66) |
| 3 | Jersey blurry | **NOT FIXED (declared impossible)** | 5:20, 8:20, 10:16 still soft; framing workaround below |
| 4 | Wide clouds absent | **FIXED** | 0:00-0:10 4-6 clouds, 1:12-1:30, 4:32-4:52, 5:04/5:36/6:00, 11:48-12:48 |
| 5 | Ice floes stickers; S01 lamp glow | **FIXED** | 0:16-0:19, 6:20-6:40: small toned irregular floes; glows halved |
| 6 | S05 NJ landing crab (u9/u11/u12art/u13art) | **NOT FIXED (checker) / mild on screen** | u9 55 deg 40 fr, u10 51 deg 47 fr, u12art 44 deg; u13art screen long-side 90 deg 32 fr from 70.4 (6:46.9); the landing is at the top frame edge and tiny, so it reads mildly |
| 7 | Trenton ring/donut wood | **NOT FIXED (worse in effect)** | 7:04-7:13: camera shift west did not help; the wood is centre-right and Greene's blocks now walk across its canopy (NEW 1) |
| 8 | Princeton deep blocks; big foreground gun | **FIXED** | 10:28-11:00 thin lines; 11:08 gun ~man-scale x1.5 |
| 9 | Mawhood r4 FvV 37 deg | **PARTLY** | now 31 deg 31 fr from 42.2 (10:23.5), turn 225 deg/s |
| 10 | British leaving Trenton r11/r12 | **NOT FIXED** | r11 32 deg 76 fr, r12 27 deg 84 fr (11:39-11:41); screen <= 4 deg so low visibility |
| 11 | S05 r13 walks backwards | **FIXED** | 37 deg 7 fr (was 145) |
| 12 | S03 evacuation FvV + overlap | **FIXED on screen** | remaining u4/u5/u6 21-41 deg rows start at the 70.9 dissolve; 0 overlaps |
| 13 | S03 dive flat cream hold | **PARTLY** | flat (YDIF < 7) only ~0.3 s at luma 187, but then a one-frame snap 189 -> 142 at 2:01.7 (YDIF 47) |
| 14 | S03 result card empty right column / plate day | **FIXED** | 4:07 9,000 | A FEW together; plate month-only |
| 15 | S01 plate note at 0:16 | **FIXED** | "25 / Christmas night" |
| 16 | S04 block under arrow head | **FIXED** | 4:20-4:28 block visible below the arrow |
| 17 | S06 r9 FvV 23 deg | **NOT FIXED (minor)** | 23 deg 34 fr from 13.6 (camera pan), screen 4 deg |

## NEW findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| S05 | 90-97 | 7:06.5-7:13 | Greene's blue blocks walk diagonally across the ring/donut wood and sit ON its canopy (row 3-4 of the 4-fps sheet); the wood is the biggest object in frame. Checker: u3 62 deg 143 fr, u4 40 deg 92 fr, u1 37 deg 91 fr, u6art/u7art 42-44 deg (unchanged from R2) | delete the ring wood from `trenton` world data (or fill its centre and shrink it 50 %); re-route u1-u4 paths to stay on open ground west of it, each block facing its path before t0 (turn in place, then walk) | 2 |
| S05 | 77-88 | 6:53-7:05 | Night march: both blocks stay at the left frame edge (x < 20 %), the top block is half hidden under Washington's banner; the arrows do the march, the troops do not visibly leave | camera target ~4 u east (landing at ~30 % x); banner anchor 2 u north of the block (`banner.dy`) or hide it after 80.5; let each block walk the first 25 % of its arrow before 88.5 | 2 |
| S06 | 36.5-52 | 8:56-9:11 | Washington's banner sits on the bottom frame edge: only the nameplate shows, the portrait is cut off for ~15 s | move the banner anchor ~3 u north (inside frame) or hide it until the 52 s shot where he is framed (9:11.5 shows him correctly) | 2 |
| S01 | 20-44 | 0:20-0:44 | Hook date plate shows "DECEMBER 1776 | [empty day cell] | dawn" for 24 s, right in the hook | "26 / Thursday / dawn" (dawn of 26 Dec) or the month-only short plate used in S03 (no empty cell) | 2 |
| S05 | 48-64 | 6:24-6:40 | Crossing: ~16 s of mostly empty dark water; the NJ landing happens on the top frame edge and is unreadable at 720p | tilt/push the camera 30 % toward the NJ bank from 58 s so the landing sits mid-frame; or cut the shot 4 s earlier | 1 |
| S07 | 53-59 | 10:34-10:40 | Blue lines are pressed against the red lines (no visible gap, red blocks partly behind blue at 10:40); the fallen Mercer banner lies on the blue block as a flat black card | keep a 0.6 u gap until the melee beat; lay the fallen banner 1 u south of the block, fade it to 70 % | 1 |
| S03 | 3.9-4.2 | 2:01.4-2:01.7 | Dive ends with a one-frame luma snap (189 -> 142) instead of a dissolve | lengthen `off.clear` 0.28 -> 0.4 or ease the haze out over 6 frames | 1 |
| S05 | 50 | 6:24 | Carved river name "...aware River" clipped at the left frame edge | anchor the label 3 u east or show it only on the wide 6:12 framing | 1 |
| wide maps | - | 0:00-0:13, 4:56-6:08 | Fields show hard Voronoi polygon facets (each patch a flat shaded polygon) - Jackson's fields are striped patches with soft borders | field-patch noise blend at the bake (border feather 2x), or tone patch contrast -40 % on colonieswinter/jersey | 1 |
| jersey | - | 4:56-6:08, 8:08-8:52, 9:58-10:27 | Blur remains (texture limit). Workaround: it is most visible at dist < 200 | keep jersey cameras at dist >= 230 (the blur reads as atmosphere there), add 6-10 % haze/vignette, and add the woods canopy detail texture as a tiled overlay (the engine's detail tile is resolution-independent) | 2 |

Troop-motion summary (checker, R2 -> R3 FAIL counts): S01 1->1, S02 6->6 (turn-rate only), S03 11->9 (all after the 70.9 dissolve),
S05 22->23 (crossing 9, trenton 12, jersey 2 turn-rate), S06 4->5 (turn-rate + r9), S07 15->15 (Princeton r0/r1 27-28 deg, u4/u5 29 deg
from 63.5; Mawhood r4; r11/r12). 0 pops, 0 overlaps anywhere. The 4-fps check shows the Princeton retreat (10:38-10:44) as a correct
turn-in-place then walk back. On screen, the only motion a viewer will notice is S05 7:06-7:13 (over the wood).

## Top 10 fixes (in order)
1. S05 Trenton approach 7:06-7:13: remove/fill the ring wood; Greene's blocks on open ground, faced along their paths (u1-u4, u6/u7art).
2. S06 8:56-9:11: Washington's banner inside the frame (or hidden) instead of cut at the bottom edge.
3. S01 hook 0:20-0:44: plate "26 / Thursday / dawn" or month-only; no empty day cell.
4. S05 night march 6:53-7:05: camera ~4 u east, banner off the block, blocks walk the first quarter of each arrow.
5. Wide woods canopy speckle + crisp edges (colonies, colonieswinter, jersey) vs J_S01_66 / v8 @12 s; feather field facets.
6. Jersey blur workaround: dist >= 230, light haze, tiled canopy detail overlay.
7. S05 crossing 6:24-6:40: frame the NJ landing mid-frame (or trim 4 s); clip-free "Delaware River" label.
8. S05 NJ landing u9/u10/u12art/u13art: stream out, form, turn in place, walk along facing (u13art 90 deg screen at 6:47).
9. S07 Mawhood r4 (10:23) + British leaving Trenton r11/r12 (11:39): face along the road before t0.
10. S07 10:34-10:40 gap between blue and red lines + fallen Mercer banner off the block; S03 dive snap at 2:01.7.
