# v2 ROUND 1, CRITIC A (LOOK + DRIFT + TROOP MOTION): Washington #21 vs the owner-approved tests

Judged: `/tmp/wx_build/washington_v2r1_720.mp4` (12:53), frames every 3 s (258) + 40 full-res stills + 5-fps windows (S03 40-46,
S05 95-101, S06 40-46, S07 49-55 / 62-68 / 80-86), each split 3x3 (sector mean RGB, L, chroma) against v8 3 / 35 / 60.5 s, v6 (all 66 s at 1 fps)
and v14 40 s. Checker: `check_troops_motion.mjs` on S01 trenton, S03 brooklyn, S05 trenton, S06 trenton + jersey, S07 princeton.
Drift sheet `critics/drift_v2_r1.jpg`. Allowed (not counted): winter frost tint, rain 28-29 Aug / storm 25-26 Dec, Brooklyn dawn fog, night,
S05 dark night river, jersey night 0.85, colonies centre slightly cooler.

## Scores (10 = indistinguishable from v8 / v6 / v14)
| scene | score | one line |
| --- | --- | --- |
| S01 hook | 7 | opening wide + clouds = v6; Trenton wide good; Princeton flashback blocks read as columns (long side vertical on screen) |
| S02 background | 5.5 | Long Island wide is a dark, flat olive sheet with diagonal light bands, no patchwork (L 24-38 vs v8 29-40); hard dark cloud-shadow discs on the bay |
| S03 Brooklyn | 7 | ferry, night, fog, ledger = tests; puffy clouds over the close Brooklyn shot (v8 close: shadows only); 2 blocks slide sideways in the night march |
| S04 retreat | 6 | colonies wide OK; jersey wide relief is a comb of bright striated ridges (v8 / v6 relief is soft) |
| S05 crossing + Trenton | 6.5 | Trenton town / ledger = test c/e; but Greene's / Sullivan's blocks slide sideways 89-98 s, a world edge shows at 33.5 s, a cloud bank lies on the river, a red pulse at Trenton, a Hessian block beside the timeline |
| S06 Assunpink | 6 | comb relief again; one giant smoke blob on the post road; red glow pulses at the bridge (not a v8 effect); big blue block in the bottom 12 % |
| S07 Princeton | 6.5 | orchard = test d (scale, colours, banner); Nassau Hall shot has v1-size blocks (~150 px = 11.7 % fw, men ~20 px) and the gun on the timeline |
| S08 ending | 6.5 | clouds / map = v6; red territory polygon drawn OVER the clouds (pink clouds); comb ridges on the Palisades in the clean end map |
| **overall** | **6.3** | |

**Fit to publish: NO.** The overlays (date plate / pocket watch, THE ARMIES key, wax-seal timeline, ledger, carved names, banners, big gold
numbers) and the close-shot palette match v8 / v14. What still drifts: troop scale in two close shots, multi-block units that slide, the
striated wide relief in jersey / colonies, the flat dark Long Island wide, and three effects the tests never show (red pulses, a ground-level
cloud bank, territory over the clouds).

## What matches (no action)
- Overlay set and geometry = v8: legend 33-185 x 602-686 px, timeline 298-983 x 653-690 px, seals + italic names, clock plate top-left with
  the rolling hands, ledger top-right (S03 4:00, S05 7:45, S07 11:12) with the clock kept and no dim, carved names on their words.
- Opening (S01 0-12 s): v6 wide, white puffy clouds, sectors L 31-42 / C 8-19 vs v6/v8 L 29-40 / C 12-20.
- v6-style cloud whiteout dive (6:08-6:10) = v6 13-15 s. OK.
- S07 orchard (10:27-11:03): blocks 60-75 px, 15 in frame, steel blue / red, ~2.5 block widths between lines = v14 40 s; sectors L 37-41 vs v14 28-40.
- S05 Trenton 8:00 (7:06-7:42) = approved still c (frost wash, Greene's blocks, Knox's guns, carved "Trenton").
- Checker: 0 pops, 0 overlaps, shape 0 % in every run; S06 Assunpink (trenton) clean.

## Findings
| # | scene | local t | film t | sector | problem | exact fix | sev |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S07 | 83.9-105 | 11:05-11:26 | BL, BR, BC | Nassau Hall shot: camera dist 9-9.5 with PR troopScale 0.86 -> blocks ~150 px (11.7 % fw), men ~20 px, deep square look (v14: 70 px, 8-10 px). Gun at BC touches the timeline (y 600-645) | S07 keys `K(CUT4, PR, [NH[0], 1822.8], 9.5, 56, 4 ...)` and `K(91.0 ... 9.0 ...)` -> dist **18-19**, tilt 52-53 (as the orchard), `K(CUT5...)` 24 stays; move the gun NG +1.2 u north (or out); delete the `bw: 0.6` (line 85) and `bw: 0.24, bd: 0.2` (line 89) overrides (recipe: defaults only) | 3 |
| 2 | S05 | 89.1-98.5 | 7:05-7:15 | ML, MC | Greene's (gPos, 3 units) and Sullivan's (sPos, 2) + Knox's guns: checker slide 0.69-0.88 u/s for 64-98 frames, front-vs-velocity 40-57 deg, turn 290-690 deg/s at 95.5 (inside the 95.4 dissolve). These units still use the default multi-block n (recipe: n 1) | add `n: 1` to the gPos / sPos / G1-G2 `add()` calls and to Greene's leading brigade (line 132 `n: 3` -> two `n: 1` units 1.07 u apart); give each a turn-first key (hold 1.5 s at s0 facing p before 95.4, or start the walk after 95.4 + 0.9); re-run `check_troops_motion.mjs washington/scenes/S05 89 130 trenton` | 3 |
| 3 | S04 / S05 / S06 / S07 / S08 (jersey, colonies) | S04 29, S05 20-60, S06 20-60, S07 50-60 (7:25), S08 50-65 | 4:59-5:33, 5:57-6:06, 8:21-8:48, 10:15-10:24, 12:33-12:51 | TL, TC, MC | wide relief = a comb of thin bright ridge highlights (striated "ribs" along every slope; Palisades streaks in colonies). v8 3 s / v6 0-10 s relief is soft rolling light and shade. Not a winter allowance | worlds agent: lower jersey / colonieswinter `exag` (~x0.6) and blur the heightmap (Gaussian 2-3 px) before baking the normal map, as v8's `vicksburg` world; check 4:59 vs v8 3 s sector TC | 2 |
| 4 | S02 | 22.6-37.6 | 1:36-1:51 | all 9 | Long Island wide: flat dark olive (TL L 24-28, C 12-15) with diagonal light bands across the ground, no patchwork farm fields, no relief; v8 3 s is L 29-40 with fields | worlds agent: give the S02 Long Island (colonies / BR wide) the v8 patchwork + relief; remove the banding (it is the sun-shaft / cloud-shadow band texture: set `clouds[CO].shadows: false` or soften); grade wide toe 14 / ct 0.96 / sat 0.95 already, lift with the world colours not the grade | 2 |
| 5 | S03 | 70.9-82, 93-95 | 3:08-3:20, 3:30 | MC | night ferry march: u5 / u6 slide 0.9-1.0 u/s for 38-58 frames from 76.6 (the 76.6 cut), front-vs-velocity 39-49 deg; u9 slides at 93.1; turn spikes 230-556 deg/s at each cut (70.9 / 76.6 / 90.9 / 118.3) | `n: 1` on every BK march unit; key a 1.5 s turn-in-place before each walk; start walks >= 0.9 s after each cut (dissolve). Re-run `check_troops_motion.mjs washington/scenes/S03 0 153.8 brooklyn` | 2 |
| 6 | S05 | 23.5-32.5 | 6:00-6:09 | ML, MC | a white cloud bank lies ON the Delaware at Washington's banner for ~9 s (ground fog look); fog is only sourced at Brooklyn dawn. (The whiteout dive at 6:08 itself = v6, OK) | move the dive clouds above the camera path only (`diveClear` 40 -> 60 on the CO/JE box, or raise their altitude) so nothing sits on the water before the dive | 2 |
| 7 | S05 | 33.5 | 6:10 | BL (x 0-80, y 420-720) | a flat, hard-edged pale polygon at the left edge: the world edge / unlit plane shows in the descent | widen the region or turn the yaw/at so the frame stays inside the baked area; check frames 33-35 s | 2 |
| 8 | S05 / S06 | S05 8.5, S06 42-45 | 5:45-5:48, 9:01-9:04 | MC | red glowing pulse blob at Trenton / the Assunpink bridge: no such effect in v8 / v6 (v8 marks a fight with muzzle flashes + smoke) | drop the red `pulse` / glow fx entries; use volleys (>= 2.2 s, fxScale) at the bridge | 2 |
| 9 | S08 | 4.5-25 | 11:48-12:16 | TR, MC | red territory polygon drawn over the clouds (the clouds turn pink) with a hard outline; v8 has no fill over clouds | render the territory under the cloud layer (cloud z-order) or `keepClear` the polygon box of clouds; soften the outline | 2 |
| 10 | S06 | 32.6 | 8:52 | MC | one giant soft smoke blob (~150 px) on the post road (Hand's delay): v8 smoke = a line of small puffs | set `fxScale` for JE in S06 regionOpts (0.02 x dist k: ~ 9 x 78/28.7 -> use the recipe's wide rule) and split the puff into 2-3 short volleys | 2 |
| 11 | S06 | 45.6 | 9:05 | BR (x 963-1063, y 628-668) | blue block ~100 px (7.9 % fw) in the bottom 12 % beside the timeline | move that unit 1.5 u north; rule: no block below y 634 while the timeline is up | 2 |
| 12 | S05 | 98.5 | 7:15 | BR (x 990-1100, y 650-710) | Hessian block in the bottom 12 % right of the timeline end | RPOS / Hessian keys in the lower town +1.4 u north, or framing at 95.4 tilt +2 | 2 |
| 13 | S03 | 5.5-12 | 2:03-2:09 | TL, MC | thick puffy cumulus over the close Brooklyn shot (TL L 53) hide the lines; v8 close = cloud shadows only | S03 `clouds[BK] = { shadows: true }` (no scatter) after the first wide frame | 2 |
| 14 | S01 | 63-72 | 1:03-1:12 | MC | Princeton flashback: red and blue lines stand with their long side vertical on screen, so they read as columns (owner: no columns); blue line inside a pale smoke streak | rotate the camera yaw ~90 deg (or the shot `at`) so the lines run across the frame as v14; or face the units N/S | 2 |
| 15 | S07 | 63.5-71 | 10:45-10:52 | BR | militia u12 / u16 / u17 front-vs-velocity 22-26 deg (73-75 frames): the diagonal walk-up (recipe asked for a turn-first key) | militia keys: turn to the walk heading at T.militia - 0.4, walk straight, turn back to N_ at MY | 2 |
| 16 | S07 | 83.4-84.8 | 11:04-11:06 | MC | all 18 orchard blocks snap-turn 150-420 deg/s at 84.0 (British about-face 81.8-85.6, Americans to AY) inside the 0.9 s dissolve: visible half-turn in the cross-fade | end the orchard keys at CUT4 - 1 (no move into the dissolve) or give the about-face >= 2 s before CUT4 | 1 |
| 17 | S07 | 46-47 | 10:28 | TL | British left block r0 enters at 54 deg on screen (22 frames), r5 26 deg front-vs-velocity (carry-over from test d) | enter r0 / r5 already facing S_ with `arrive: false` + fade only | 1 |
| 18 | S07 | 98.7 | 11:20 | BC (timeline) | Princeton seal (5.25) sits on "Jan" and its ribbon covers the name "Princeton"; Trenton and Princeton seals 56 px apart | seal at 5.4, name under the ribbon tails (as v8 "Champion Hill"), or Trenton 4.65 | 1 |
| 19 | S07 | 58.7 | 10:40 | MC | Mercer's banner lies tilted on the ground (fallen banner): looks like a glitch; v8 banners never tilt | fade Mercer's banner out on "fell" instead of tipping it | 1 |
| 20 | S02 | 4.6-15 | 1:18-1:30 | MC, MR | wide colonies: hard dark cloud-shadow discs on the bay; ships' wakes as dotted white bead lines | `clouds[CO].shadows: false` on the wide; ships `wake: false` (as the night boats) | 1 |
| 21 | S04 / S07 | S04 8-11, S07 27.7 | 4:38-4:42, 10:09 | TC, MC | red rubber stamps "WHITE PLAINS", "FORT WASHINGTON", "THE MUD FROZE": v8 labels are dark plates ("BIG BLACK BRIDGE") or carved names | carved names for places (White Plains, Fort Washington: `labels`), dark v8 plate for "the mud froze" (keep the stamp only in the hook) | 1 |
| 22 | S03 | 130-140 | 4:07-4:17 | TL | date plate "August 1776" (no day) while the ledger says 29-30 August | `plaque.date` day "30", weekday "Friday", note "first light" | 1 |
| 23 | S04 / S05 | S04 29, S05 83 | 5:00, 6:59 | MR | ponds with a bright white rim (v8 water has no rim) | worlds: pond bank colour = the river bank colour | 1 |

## Top 10
1. S07 Nassau Hall: dist 9-9.5 -> 18-19 (blocks to v14 size), gun off the timeline, drop the two `bw` overrides (#1).
2. S05 Trenton approach: `n: 1` + turn-first keys for Greene / Sullivan / Knox; re-run the checker (#2).
3. Worlds: soften the jersey / colonies relief (no striated ridges) to v8 / v6 (#3).
4. S02 Long Island wide: v8 patchwork + relief, remove the light bands, lift L to v8 (#4).
5. S03 night march: `n: 1`, turn in place, no walks inside dissolves (#5).
6. Remove the non-test effects: red pulses (S05 / S06), the river cloud bank (S05), territory over clouds (S08) (#6, #8, #9).
7. S05 world edge at 33.5 s (#7).
8. Bottom-12 % rule: S06 45.6 s blue block, S05 98.5 s Hessian block, S07 gun (#11, #12, #1).
9. Smoke scale in S06 jersey (fxScale) and close-shot clouds -> shadows only in S03 (#10, #13).
10. S01 Princeton lines across the frame; S07 militia turn-first and no snap-turns under the CUT4 dissolve (#14, #15, #16).
