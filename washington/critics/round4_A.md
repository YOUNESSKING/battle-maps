# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 4

Inputs: `/tmp/wx_build/washington_round4_720.mp4` (12:53), `/tmp/wx_render5/S01..S08.mp4`, `washington/critics/drift_round4.jpg`,
`round3_A.md`, scene NOTES.md round-3 lists, `worlds/previews/round3_fix.jpg`, render logs `/tmp/wx_podH.log` + `/tmp/wx_podI.log`.
Frames: every 4 s over the whole film (7 contact sheets in `/tmp/wx_critic_A4/`), full-res stills of every round-3 item, 5 fps Princeton
(S07 50-58), per-frame flat-region scan (signalstats on a centre crop) of every scene render, motion checker on the round-3 problem
regions (`/tmp/wx_critic_A4/motion/`). Film t = scene A (`audio/scenes.json`) + local t.

## STOP: four scene renders are corrupted (blocking, not a seq.js problem)

S02, S03, S04 and S05 are covered, for most of their length, by a **flat, opaque grey-blue ellipse** (Y 168-169, stair-stepped edges,
sometimes with a rectangular "hole" where the real frame shows through) or a **flat cream full frame with a vignette** (no map at all).
It strobes on/off in ~0.5-1.5 s bursts. Overlays (plate, cards, labels, stamps) draw on top of it; the 3D map is replaced.

| Scene | flat frames (centre crop) | film span affected |
|---|---|---|
| S01 | 0 / 2219 | clean |
| S02 | 830 / 1342 (62 %) | 1:13-1:58 |
| S03 | 3125 / 4615 (68 %) | 1:58-4:31 (incl. the cloud dive, the evacuation, the method card) |
| S04 | 1066 / 1990 (54 %) + long cream whole-frame stretches | 4:31-5:37 (White Plains / Fort Washington stamps over blank cream, 4:36-5:44) |
| S05 | 3231 / 4906 (66 %) | 5:37-8:20 (crossing, night march, Trenton, the 900 / NONE card's lead-in) |
| S06 / S07 / S08 | 0 / 0 / 4 (last fade frames) | clean |

Cause (from the render logs): **every corrupted scene came from pod H** (`go9pipolnf9kd5`, RTX A4500 community: S05 03:59, S03 04:03,
S04 04:06, S02 04:09, also suspiciously fast: 81-181 s). **Every clean scene came from pod I** (RTX A4000 secure, S07/S01/S06/S08). The
scene builds are the same (`washington/scenes/S0N`, all carry the new `detail` layer, S01/S06-S08 render fine with it), so this is a
GPU/driver/capture fault on that pod, not the world or the seq. The drift sheet row 5 (S05 @148 method card) already shows the ellipse.
**Fix:** re-render S02-S05 on pod-I-class hardware (A4000 secure / A6000), then rebuild the film. **Add a gate to the render runner:**
after each scene, `ffmpeg -vf crop=160:80:560:320,signalstats` and reject the scene if > 1 % of frames have YMAX-YMIN <= 2 (a flat
centre) outside known card/white-out windows; that would have caught this in seconds. Also worth a 10-frame visual of the first 5 s of
every scene before assembly.

Because of this, S02-S05 can only be judged in the ~35 % of frames between the bursts. The scores below give two numbers for those
scenes: **as delivered** (what a viewer would see now) and **content** (what the clean frames show; what the re-render should deliver).

## Verdict on drift (clean frames + S01/S06-S08)
Where the frame is clean, the film still sits in the Jackson v4 / v8 family: same date plate, gold 3D name slam, banners, navy ledger
cards (S05 900 | NONE, S07 HUNDREDS | < 100 with the Mercer line), cream method strip, end card (WHICH WAS HIS GREATEST MOVE? + 1, 2 OR 3?),
cloud tufts on the wide maps, Princeton thin line blocks like troops v14. Round-3 world work is visible: **colonies / colonieswinter
woods now have a mottled canopy speckle** (S01 0:02, S08 end map) and read closer to J_S01_66. Remaining gaps vs Jackson / v8:
- **jersey is still soft with hard polygon facets** (S06 8:24-8:48, S07 10:12-10:24): the facets are the most visible "not Jackson"
  thing left on the clean scenes; the canopy detail layer does not show at those camera distances.
- The Trenton ring/donut wood still reads as a doughnut (S05 7:07-7:13), though nobody walks over it any more.
- winter grade (allowed).

## Scores (R1 -> R2 -> R3 -> R4)

| Scene | R1 | R2 | R3 | R4 as delivered | R4 content | Note |
|---|---|---|---|---|---|---|
| S01 | 6 | 7 | 7.5 | 8 | 8 | Plate month-only over Trenton (fixed), canopy speckle on colonieswinter, clean |
| S02 | 5.5 | 7 | 7.5 | 2 | 7.5 | 62 % of frames covered by the ellipse / cream |
| S03 | 6.5 | 7 | 7.5 | 2 | 7.5 | 68 % covered; dive-end fix and result card cannot be verified (A FEW column present at 2:08) |
| S04 | 5 | 6.5 | 7 | 1.5 | 7 | ellipse + whole-frame cream: stamps over a blank screen |
| S05 | 6 | 6.5 | 7 | 2 | 7.5 | 66 % covered; Trenton approach and plate/banner fixes are right in the clean frames |
| S06 | 6 | 7 | 7 | 7.5 | 7.5 | banner no longer cut; jersey facets |
| S07 | 5.5 | 7 | 7.5 | 8 | 8 | gap + Mercer banner fixed; clean |
| S08 | 6 | 7.5 | 7.5 | 8 | 8 | end map a Jackson sibling, speckled woods |
| **Overall** | **5.8** | **7.0** | **7.4** | **3** | **7.8** | |

**Fit to publish? NO (blocking: corrupted S02-S05 renders).** On content the film is at ~7.8 and would reach 8 with the re-render plus
the jersey facet fix; nothing in the sequences needs rework for that.

## Round-3 item status

| # | Round-3 finding | Status | Evidence |
|---|---|---|---|
| 1 | S05 Trenton approach over the ring wood | **FIXED** | S05 90.9 / 94 (7:07.4 / 7:10.5): three blocks abreast west of the road on open ground, nobody on the canopy; checker screen long-side <= 17 deg |
| 2 | S06 banner cut at the bottom edge 8:56-9:11 | **FIXED** | 9:00 no banner; 9:12 banner inside the frame |
| 3 | S01 hook plate empty day cell | **FIXED** | 0:22 "December 1776" month-only |
| 4 | S05 night march framing / banner on block | **FIXED (clean frames)** | S05 80 (6:56.5): banner north of the blocks, blocks ~30 % x; ellipse over most of the shot |
| 5 | Wide woods canopy speckle + crisp edges; field facets | **PARTLY** | colonies/colonieswinter: speckle + crisper edges visible (0:02, 12:36). jersey: facets still hard (8:24-8:48, 10:12) |
| 6 | Jersey blur workaround | **NOT FIXED** | S06 20 / S07 30 crops still soft at dist ~150-250 |
| 7 | S05 crossing landing at the top edge; label clip | **PARTLY** | S05 59.9 (6:36.4): NJ bank still in the top 15 % of frame; no label clip seen |
| 8 | S05 NJ landing crab (u9/u10/u12art/u13art) | **NOT VERIFIABLE on screen**; checker crossing 0 FAIL, jersey 2 turn-rate rows (u3/u4 47 deg/0.1 s at 88.1 = 7:04.6, during the 88.0 dissolve) |
| 9 | S07 Mawhood r4 + r11/r12 oblique | **NOT FIXED (minor, unchanged)** | r4 31 deg 31 fr from 42.2 (10:23.5), turn 225 deg/s; r11 32 deg 76 fr, r12 27 deg 84 fr (11:39-11:41); screen <= 4 deg, low visibility |
| 10 | S07 blue/red gap + Mercer banner; S03 dive snap | **FIXED / NOT VERIFIABLE** | 10:36 clear gap, fallen banner south of the block (5 fps 10:31-10:39: no pops, no slides); S03 dive end lies inside a corrupted burst |

## NEW findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| S02-S05 | whole | 1:13-8:20 | Corrupted renders (flat ellipse / cream frame strobing over 54-68 % of frames), see the STOP section | re-render S02-S05 on another pod; add the flat-frame gate to the runner; re-assemble | 3 |
| S05 | 95.5-97.5 | 7:12-7:14 | Checker: Greene's u1-u3 turn 88-95 deg in 0.1 s at 97.5 (and u4 75 deg, u6art/u7art 55 deg at 95.5): an instant snap, not a turn in place. 95.5 is the dissolve into the town-head shot, so it may be hidden; 97.5 is not | if on screen after the re-render: make the turn a >= 0.6 s tween (<= 150 deg/s), or finish it before 95.4 | 2 |
| S05 | 91.9-104 | 7:08-7:20 | Checker world front-vs-velocity 58-67 deg (u1-u3) + slides 1.3-1.5 u for 95-120 fr after 101.5; authors explain it as the yaw-14 oblique camera; screen long-side <= 17 deg | verify at 5 fps after the re-render; if a sideways drift shows after 101.5, face the blocks along the path | 1 |
| jersey | - | 8:24-8:48, 10:12-10:24 | Field facets still read as hard flat polygons at these distances (round-3 `field_patch_k` too weak on jersey), the most visible gap to Jackson on clean scenes | jersey `field_patch_k` 0.6 -> 0.35 and feather patch borders 2x; or raise the `detail` k 0.1 -> 0.18 with `far` 320 -> 420 so it reaches the S06/S07 cameras | 2 |
| S07 | 30 | 10:11 | THE MUD FROZE stamp sits on the top of Washington's banner (nameplate touches the stamp's lower edge) | stamp 0.06 screen-height higher, or banner hidden during the stamp | 1 |
| S05 | 90-97 | 7:07-7:13 | Ring wood still a doughnut (round dark ring with an empty centre), largest object in frame | fill its centre (world data) or crop it out with the camera 10 u west | 1 |

## Troop motion (checker; R3 -> R4)
S05 trenton 12 FAIL (as R3; turn-rate snaps above are new to look at), S05 jersey 2 (turn-rate in the 88.0 dissolve), S05 crossing 0.
0 pops, 0 overlaps in every region run. 5 fps on S07 Princeton 10:31-10:39: lines hold their gap, retreat/stand correct, no stretching.
S07: princeton 6 FAIL (r0/r1 27-28 deg from 46.6, u4/u5 29 deg from 63.5, all turn-rate rows at the 84.0 cut), trenton 7 (u0-u5 turn-rate at
the 16.7 cut; r11/r12 as R3), jersey 2 (r4 Mawhood). Same as R3; screen long-side <= 13 deg everywhere. S01/S02/S03/S06 not re-run this
round (no seq changes to their troops; S03/S02 renders unusable anyway); re-run all regions on the re-render.

## Top 10 fixes (in order)
1. Re-render S02, S03, S04, S05 on a known-good pod (pod I class) and re-assemble; the film is unwatchable from 1:13 to 8:20 as it is.
2. Add the flat-frame gate (signalstats centre crop, > 1 % flat frames = reject) to the render runner, plus a first-5-s visual per scene.
3. After the re-render, re-check the S03 dive end (2:01.4-2:01.7) and the S03/S05 method cards, which this round could not verify.
4. S05 7:12-7:14: Greene's blocks u1-u3 (and u4, u6art/u7art at 95.5) snap 75-95 deg in 0.1 s; make it a visible turn in place.
5. jersey field facets: `field_patch_k` 0.35 + feathered borders (or stronger/longer-reach `detail`) for S06 8:24-8:48 and S07 10:12-10:24.
6. S05 crossing 6:36: NJ landing still at the top 15 % of frame; tilt 10 % more toward the NJ bank.
7. S05 Trenton ring wood: fill the doughnut centre or frame it out.
8. S07 10:11: lift THE MUD FROZE stamp off Washington's banner.
9. S05 7:08-7:20: confirm on the 5 fps re-render that the 101.5+ slides do not read sideways.
10. Keep everything else: S01, S06, S07, S08 are at or near 8 and should not be touched.
