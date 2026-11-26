# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 2

Inputs: `/tmp/wx_build/washington_round2_720.mp4` (12:53), `/tmp/wx_render3/S01..S08.mp4`, `washington/critics/drift_round2.jpg`
(ours | Jackson v4 | approved gm3d v6/v8 + troops v14), round-1 review `round1_A.md`, each scene's NOTES.md fix list.
Frames: every 4 s over the whole film (6 contact sheets), full-res stills at 0:02, 0:06, 0:17, 1:20, 2:00, 4:00, 4:28, 4:36, 4:50, 5:00,
6:20, 7:05, 7:20, 9:00, 10:16, 11:08, 12:40; 2 fps + 5 fps crops on S05 74-90 (night march); luma traces through the three cloud dives
(0:12, 2:00, 6:10). Motion checker on every scene x region (`/tmp/wx_critic_A2/motion/`). Film t = scene A (`audio/scenes.json`) + local t.

## Verdict on drift
Big step forward. The white/yellow ridge glare is gone on every wide map, the colonies sea is now Jackson's dark navy, troops on the
wide maps read (opening 0:06: blue/red line blocks 40-70 px, like Jackson's wide boxes), S08's end map now has dark woods + scattered
clouds and sits next to J_S08_55 as a sibling. The close worlds (Brooklyn, Trenton, Princeton) still match Jackson / troops v14.
What still separates the wide maps from Jackson / v8:
- **woods = flat soft-edged blobs** (a "camouflage / leopard" pattern of isotropic dark spots) with no canopy texture; Jackson's woods
  (J_S01_66) and v8 @3 s are speckled tree canopy with crisp edges. Worst on `colonieswinter` (0:00-0:13, 0:46-0:56) and `jersey`.
- **jersey is blurry** at the framings used (4:56-6:08, 6:44-7:04, 8:08-8:52, 9:58-10:27): ground, woods and roads look out of focus
  (texture too low-res for dist 160-270); Jackson's critics flagged the same on `neworleans` (round 1, sev 2) and it was fixed there.
- **clouds still missing on every wide shot except S08**: none visible on the opening map 0:00-0:12, Long Island 1:12-1:56, S04 4:16-4:52,
  any jersey shot. NOTES say `scatter { n 10, med 18 }` was added to S01/S02 (and S08, where they do show) - on colonies they are either
  culled by keepClear, too high, or off-frame. v6/v8 and Jackson always show 3-6 clouds in frame.
- winter fields pale grey-green with no warm field patchwork (allowed as winter ground; not counted).

## Scores (R1 -> R2)

| Scene | R1 | R2 | Note |
|---|---|---|---|
| S01 | 6 | 7 | Glare gone, troops readable on the opening; still no clouds, camouflage woods; crossing floes = flat grey hexagon stickers, lamp glows big |
| S02 | 5.5 | 7 | Navy sea + darker woods = right family; no clouds on Long Island; checker turns only at the 37.4 cut |
| S03 | 6.5 | 7 | Night evacuation readable; result card good; dive still holds a flat cream frame ~0.6 s at 2:00-2:01; units crab 3:08-3:14 |
| S04 | 5 | 6.5 | Colonies fixed; jersey 4:56-6:08 blurry camouflage, tiny posts; no clouds; checker clean |
| S05 | 6 | 6.5 | Crossing floes NOT fixed; night march blocks tiny and racing at 8 u/s (79 pops); ring "donut" wood still on Trenton approach; landing crab |
| S06 | 6 | 7 | Bridge fight clean (0 FAIL), banners leave before the choice card; jersey part blurry |
| S07 | 5.5 | 7 | Column + wedge fixed; Princeton close blocks deep (8-10 ranks) vs v14 thin lines; FvV 27-37 deg on r4, r0/r1, u4/u5, r11/r12 |
| S08 | 6 | 7.5 | End map now a Jackson sibling (dark woods, clouds); checker clean |
| **Overall** | **5.8** | **7.0** | |

**Fit to publish? NO** (close). Blocking: S05 night march speed/size, crossing floes, wide-map clouds + woods texture + jersey blur.

## Round-1 item status

| # | Round-1 finding | Status | Evidence |
|---|---|---|---|
| 1 | Wide relief glare / hillshade (all wide) | **FIXED** | 0:02, 1:20, 4:28, 4:50, 12:40: no specular streaks; soft relief |
| 2 | No dark woods mass on wide maps | **PARTLY** | Dark mass now present everywhere, but flat untextured blobs (camouflage), no canopy speckle like J_S01_66 / v8 |
| 3 | Colonies summer saturated + cyan shallows | **FIXED** | 1:20, 4:28: dark navy sea, muted greens |
| 4 | Wide-map clouds absent | **PARTLY** | S08 yes (12:00-12:50); none on S01 0:00-0:12, S02, S04, any jersey shot |
| 5 | Troops on colonies 5-25 px | **FIXED** | 0:06 blocks 40-70 px; S04 colonies 0 FAIL, no pops |
| 6 | S07 night march lengthwise column | **FIXED** | 10:00-10:24 one wide block long side first; jersey 16-40 clean |
| 7 | S07 u2-u7 crab + overlaps | **FIXED** | 0 overlaps; only r4 (Mawhood) 37 deg at 41.3-45.5 (new row below) |
| 8 | S07 world-edge wedge | **FIXED** | none seen 9:58-10:27 |
| 9 | S04 jersey world edge 5:07-5:13 | **FIXED** | none seen; r14/r15 clean |
| 10 | S05 night march smudge / overlaps | **PARTLY** | Two wide blocks, no overlaps, but tiny (~6x20 px), dark, and racing at 8 u/s with 71-79 pops (u3/u4) |
| 11 | Cloud dive flat grey hold | **PARTLY** | S05 6:10 fixed (no flat frame); S01 0:12 fine; S03 2:00.6-2:01.2 still flat luma 187 for ~0.6 s |
| 12 | Night crossing lamps + floe stickers | **NOT FIXED** (floes) / **FIXED** (boats) | 0:17, 6:12-6:40: boats bigger, men visible on S05; floes still uniform flat grey hexagons, too many; S01 lamp glows still large |
| 13 | S05 boarding backwards | **FIXED** | u0-u4 max 23-33 deg (was 148-176) |
| 14 | S05 NJ landing crab (u9/u11/u12art/u13art) | **NOT FIXED** | 44-48 deg, slide 0.43-0.59, 32-68 frames, 51-68 s (6:28-6:44); u12art screen 21 deg |
| 15 | S05 Trenton approach / ring wood | **PARTLY** | Blocks pass west of the wood (screen <= 13 deg), but the ring/donut wood is still on screen 7:04-7:10; overlap u1xu2 at the 95.5 cut |
| 16 | S01 hook Trenton FvV | **FIXED** | S01 trenton 0 FAIL |
| 17 | S01 crossing landing crab | **FIXED** | S01 crossing 0 FAIL |
| 18 | S06 Assunpink lines oblique | **FIXED** | S06 trenton 0 FAIL |
| 19 | S07 Princeton r0/r1, u4/u5 oblique | **NOT FIXED** | r0 27 deg 59 fr from 46.6, r1 28 deg, u4/u5 29 deg 55 fr from 63.5 (screen <= 13 deg, so mild) |
| 20 | S07 British leaving Trenton 115-120 | **NOT FIXED (worse)** | r11 32 deg 76 fr + slide 0.33, r12 27 deg 84 fr (11:39-11:41) |
| 21 | S06 banners on the choice card | **FIXED** | 9:20-9:40 clean |
| 22 | S04 stale date plate | **FIXED** | 4:28 "1776", 4:50 "16 Saturday Fort Washington" |
| 23 | S03 night evacuation too dark | **FIXED** | 3:16-3:24 readable boats + wakes |
| 24 | S06 5,500 on smoke; jersey troops tiny | **FIXED** / **PARTLY** | number clear 8:36; jersey posts still small at 4:56-5:32 |
| 25 | S06/S01 bridge lines small | **FIXED** | 9:00 closer, readable |
| 26 | S08 end map glare / no clouds | **FIXED** | 12:36-12:50 |

## NEW findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| S05 | 77.9-88.3 | 6:54-7:05 | Night march blocks u3/u4 move at 8 u/s (21 % frame width/s), 71-79 pops, turn 718-818 deg/s at 88.1; on screen they zip across the map and are only ~6x20 px dark slivers under rain | t1 later / shorter legs so v <= 2 u/s (the arrow carries the distance; let the blocks walk only the first third of each arrow before the 88.5 cut); troopScale 8 -> 12 on this shot; night unit tint +25 % lum; camera dist -20 % on 81-88 | 3 |
| ALL wide | - | 0:00-0:13, 1:12-1:56, 4:16-6:09, 8:08-8:52, 9:58-10:27 | Woods are flat soft blobs (camouflage), no canopy texture; Jackson/v8 woods are speckled tree canopy with crisp edges | world bake: apply the gulf/v8 wide-woods canopy texture (`wood_soft` tree-dot texture, edge softness halved) on colonies/colonieswinter/jersey; blob size ~-40 %, more small woods; compare one still vs J_S01_66 + v8 @12 s | 2 |
| jersey | - | 4:56-6:08, 6:44-7:04, 8:08-8:52, 9:58-10:27 | Jersey ground/woods/roads look out of focus at dist 160-270 (texture too low-res for these framings) | re-bake jersey texture at 2x resolution (or tile the field/woods detail texture like Jackson's neworleans fix); sharpen roads/rivers | 2 |
| S01, S02, S04, jersey | - | 0:00-0:12, 1:12-1:56, 4:16-4:52 | Wide clouds still absent (only S08 shows them) despite scatter n 10 in NOTES | check cloud height vs camera (`med` too high -> above the near plane?) and keepClear; target 3-6 clouds in frame like v8 @3 s; add jersey `scatter { seed 7, n 8, med 40 }` | 2 |
| S01, S05 | 14-19 / 36-66 | 0:14-0:19, 6:12-6:42 | Ice floes = identical flat grey hexagons, far too many, read as stickers (round-1 world item never done) | `winter.floes` -40 %, floe colour 30 % toward water + soft edge alpha, irregular outlines; S01 lamp glow radius -50 % (`lampK` as in S05) | 2 |
| S05 | 51-68 | 6:28-6:44 | NJ landing: u9/u11/u12art/u13art FvV 44-48 deg, slide 0.43-0.59 for 32-68 frames; u12art screen 21 deg | stream out of the boats, then form and turn in place; walk only along facing | 2 |
| S05 | 88.5-95 | 7:05-7:11 | Ring-shaped (donut) wood still dominates the Trenton approach shot | delete or reshape the ring wood in `trenton` (fill its centre) | 2 |
| S07 | 60-110 | 10:41-11:31 | Princeton close blocks are deep (8-10 ranks x ~12 files, near-square at 11:08) vs troops v14 thin 2-3-rank line blocks; the foreground gun at 11:08 is ~3x the size of a man | princeton blocks: ranks 3, width x1.5 (same men); move the gun out of the near foreground or scale to 0.6 | 2 |
| S07 | 41.3-45.5 | 10:22.6-10:26.8 | Mawhood r4 FvV 37 deg, slide 1.67, 40 frames, turn 331 deg/s | face r4 along the post road before t0 (turn in place, then walk) | 2 |
| S07 | 118-120 | 11:39-11:41 | British leaving Trenton r11/r12 FvV 27-32 deg, 76-84 frames, r11 slide 0.33 | face north before moving (they are set to walk north but the facing is ~30 deg off) | 1 |
| S05 | 122.5-123.1 | 7:39-7:40 | r13 FvV 145 deg (walks backwards) 7 frames | about-face before the retreat | 1 |
| S03 | 63-77 | 3:00-3:14 | Evacuation: u4/u5/u6 FvV 27-40 deg, slide 1.15-1.3, 28-39 frames; u9 23 deg; overlap u0 x u10 0.39 u at 63.4-64 | face each block along its path to the ferry; u10 path 1 box width away from u0 | 2 |
| S03 | 3.0-3.6 | 2:00.6-2:01.2 | Cloud dive still holds a flat cream frame (luma 187, no detail) ~0.6 s | same `off` values as S05 (`warm 0.05, emerge 0.1, clear 0.28, haze 0.85`) | 1 |
| S03 | 122-128 | 3:59-4:05 | Result card: right column empty with a divider for ~4 s before LEFT BEHIND lands; date plate shows an empty day box ("August 1776 / first light", no day) | divider + right column fade in with LEFT BEHIND; plate day "30" (spoken "first light" is 30 Aug) or month-only plate without the day cell | 1 |
| S01 | 16-19 | 0:16-0:19 | Date plate "25" with an empty weekday/note half (S05 shows "Wednesday / after dark") | fill the note ("Wednesday / Christmas night") or use the short plate | 1 |
| S04 | 6-12 | 4:22-4:28 | Blue unit block sits inside the blue arrow head (covered) | arrow start 2 units ahead of the block | 1 |
| S06 | 13.6-17 | 8:33-8:36 | r9 FvV 23 deg 33 frames | face along road | 1 |

## Top 10 fixes (in order)
1. S05 6:54-7:05 night march: blocks <= 2 u/s (no 8 u/s racing, no pops), troopScale 12, brighter night tint, camera 20 % closer.
2. Wide woods texture: canopy speckle + crisp edges like J_S01_66 / v8 (no camouflage blobs) on colonies, colonieswinter, jersey.
3. Jersey re-bake at 2x texture resolution (it is blurry on 4:56-6:08, 6:44-7:04, 8:08-8:52, 9:58-10:27).
4. Wide clouds actually visible on every wide shot (3-6 in frame): S01 opening, S02, S04, jersey; debug why S01/S02 scatter does not show.
5. Ice floes: -40 %, toned into the water, irregular soft edges; S01 lamp glow -50 % (0:14-0:19, 6:12-6:42).
6. Princeton close: thin 3-rank line blocks like troops v14; shrink/move the foreground gun (10:41-11:31).
7. S05 NJ landing (6:28-6:44): stream, form, turn in place, walk along facing (u9/u11/u12art/u13art 44-48 deg).
8. Trenton ring/donut wood removed (7:05-7:11).
9. Remaining FvV fails on visible shots: S03 3:00-3:14 (+ overlap u0xu10), S07 Mawhood 10:23-10:27, S07 British 11:39-11:41, S05 r13 7:39, S06 r9 8:33.
10. Small polish: S03 dive flat 0.6 s (2:00), S03 result card empty right column + blank plate day, S01 plate note at 0:16, S04 block under the arrow head.
