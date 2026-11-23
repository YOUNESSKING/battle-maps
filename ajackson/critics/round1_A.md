# Andrew Jackson 3D: Critic A (LOOK + TROOP MOTION), round 1

Inputs: `/tmp/aj_build/jackson_round1_720.mp4`, `/tmp/aj_render/S01..S08.mp4`. Frames every 2 s per scene, 5-10 fps windows on each
troop-motion flag, 2.5x crops (in `/tmp/aj_critic_A/`). `check_troops_motion.mjs` run on S01 chalmette+horseshoe, S03 horseshoe, S04 chalmette+neworleans,
S05 chalmette+neworleans, S06 chalmette, S07 chalmette. Film t = scene A (`audio/scenes.json`) + local t.

## Scores (10 = Grand Maneuver polish)

| Scene | Score | One line |
|---|---|---|
| S01 hook | 6 | Strong 8 Jan clash and Ghent card, but a 2 s blank grey screen in the dive, deep square blocks, the British walk backward |
| S02 Creek War | 5 | Camouflage-blotch gulf map, banner and label jammed into the top-left corner and cut by the frame, nothing moves except one pulse |
| S03 Horseshoe Bend | 5 | Good beats (wall, guns, canoes, charge, result card) spoilt by the world edge in frame for ~30 s, smeared hill texture, Red Sticks backing away, a text collision on the ledger, a 15 s static gulf tail |
| S04 to New Orleans | 5 | Lake Borgne is blue emptiness with dots; the neworleans world is flat and blurry; the Bienvenue/Villeré beats read |
| S05 night attack | 6 | Night look and the Carolina work; melee blocks slide obliquely / walk backward; duplicate Pakenham portraits |
| S06 the line | 5 | The Rodriguez line is a raised table-top plinth, a British block stands in the river, the Carolina pops out, thin plan arrows |
| S07 8 January | 6 | Best-looking scene (fog, guns, NO LADDERS, result card) but deep British blocks, snap turns + backward retreats, giant guns |
| S08 ending | 6 | Clean, end screen OK; the removal arrow is a hairline; gulf map texture still blotchy |
| **Overall** | **5.5** | Under the Vicksburg 3D film (round 3 ~8). Fixable: mostly seq.js values + 3 engine/world fixes |

**Fit to publish? NO.**

## Troop-motion checker summary (FAILs worth fixing; screen long-side-normal is OK everywhere: max 13 deg, 0 frames > 15)

| Scene | Units | Flag | Local t | Meaning on screen |
|---|---|---|---|---|
| S01 | r6-r9 | front-vs-velocity 180 deg, ~50 fr | 24.8-30 | British break = blocks walk BACKWARD (no about-face) |
| S01 | r6-r9, u12-u13 | turn 110-723 deg/s | 69.9, 74.2 | at the snap cuts (hidden by the hard cut; verify each key starts already faced) |
| S03 | r0-r3 | front-vs-velocity 168-180 deg, 180-197 fr | 89-108 | Red Stick blocks back away from the wall for ~18 s without turning |
| S03 | u17 | turn 49 deg/s | 83.7 | mild snap turn |
| S05 | r0-r4, u5-u9 | front-vs-velocity 26-43 deg + slide 0.27-0.50 | 84-94 | night melee blocks drift diagonally (crab walk) |
| S05 | u7, u8 | 143-147 deg | 52.6, 85-93 | Americans step back without turning |
| S05 | u5 | turn 100 deg/s | 107.4 | snap turn |
| S05 | r12, r13, r15 | 27-34 deg, slide 0.56 (r13, 42 fr) | 133-142 | British reinforcements crab sideways into camp |
| S05 nwo | u1 | 28 deg | 46-49 | under the decide card/fog: invisible, ignore |
| S06 | r18, r19 | 163-166 deg + slide 0.75 (24 fr) | 52.6-61 | 28 Dec probe "beaten back" by walking backward + sliding |
| S06 | u12-u17 | 23-27 deg | 33-43 | defenders filing in at a slight crab angle (minor) |
| S07 | r19-r21 | turn 380-542 deg/s + slide, 165 fr backward | 69.8-75 | snap turns then walk back; at the 70.1 dissolve, both shots partly visible |
| S07 | r22 | 180 deg, 201 fr, slide 0.34 | 52-62 | walks backward for 20 s |
| S07 | r23, r24, r28 | turn 138-436 deg/s, 154-178 deg | 83.4-105, 113-116 | snap turns + backward walk (93rd and river column withdrawing) |
| S07 | u26, u27 | 160 deg | 119-124 | West-bank Americans retreat walking backward |
No overlaps, no pops, no shape changes reported in any scene.

## Findings (ranked by harm to a viewer)

| Scene | local t | film t | Problem | Fix | Sev |
|---|---|---|---|---|---|
| ALL troop scenes | see table above | 0:25, 3:38, 7:41, 9:37, 11:19, 11:50, 12:26 | **Retreats walk backward** (front-vs-velocity 160-180 deg) instead of about-face then walk; owner rule broken in 7 places | For every retreat key add the turn: hold position, rotate heading +180 deg over >= 1.5 s (<= 30 deg/s), then walk; i.e. insert a key `[t, x, y, heading+180]` at the stop point before the backward keys (S01 r6-r9 @24.8; S03 r0-r3 @89; S05 u7/u8 @85; S06 r18/r19 @52.6; S07 r19-r22 @52/69.8, r23/r24 @83/96.8, u26/u27 @119) | 3 |
| S01, S05, S07 (British everywhere) | e.g. S07 69-72, S01 24-27 | 11:16, 0:25 | **Blocks are deep squares / columns** (6 files x 6 ranks, as deep as wide; S07 crop shows 4 near-square red blocks). Rule: wide rectangles only, no columns | British lineblocks: set width:depth >= 3:1 (e.g. `troopsOpts.lineblocks: { files: 12, ranks: 3 }` or per-unit `w`/`d`); historically the columns still read as several wide blocks one behind the other | 3 |
| S03 | 26-60 (also 4-6) | 2:35-3:09 | **World edge in frame**: grey void, jagged terrain rim and a flat grey slab along the top of the frame for ~30 s while the camera is at its widest | Lower tilt or `dist` on the horseshoe keys 26-60 so the top edge stays inside the world (e.g. tilt 36 -> 46, dist -15 %), or extend the horseshoe world margin / add edge fog (`regionOpts.horseshoe.edgeFog`) | 3 |
| S01 | 11.4-13.4 | 0:11-0:13 | **2 s of an empty pale grey screen** in the hook dive (YMIN >= 140 the whole frame); hook rule = no white flash, something new every 2-4 s | Shorten the cloud phase of dive 1: `dives[0].clear` - `emerge` <= 0.5 s, cloud opacity peak 0.85 so the map shows through; S03 dive at 4 s has the same veil (shorter) | 3 |
| S06 | 0-45 | 8:44-9:29 | **The Rodriguez line is a raised table-top**: the whole American position sits on a rectangular plinth with vertical walls ~1 block high; reads as a stage, not a mud rampart behind a canal (S07 shows the right thin wall) | Use the S07 works geometry in S06 (thin parapet + ditch in front, ground level behind); in the "works growing" device animate wall height only, not the enclosed area | 3 |
| S06 | 52.4-54 | 9:36-9:38 | A **British block stands on the river** surface left of the levee road; at 53.0 the **Carolina vanishes in one frame** (pop) leaving a brown smudge and its label | Move r19's first key 0.6-0.8 units east onto the bank; Carolina: burn 2-3 s (fire + smoke grow), then explode/sink with an opacity fade >= 0.8 s; fade the "Carolina" label with it | 3 |
| S07 | 16-24, 40-70 | 10:43-11:37 | Defenders stand 1 block back **behind giant guns** (barrels as long as a unit is wide); men don't line the parapet; gun scale fights unit scale | Guns at 0.5x scale (`guns.scale`), infantry blocks in 2-3 ranks directly on the parapet between batteries | 2 |
| S03 | 0-60, 100-125 | 2:09-3:09 | Gun Hill / neck hills are a **blurred pink-brown smear** (low-res overlay stretched) | Re-bake the horseshoe relief overlay at 2x or drop its opacity to 0.4 so the painted ground shows | 2 |
| S02, S03 end, S04 start, S08 | all | 1:23-2:09, 4:39-5:40, 13:00-14:20 | **Gulf world = camouflage blotches** (dark green/olive/beige noise), low contrast, nothing reads at 720p; looks unfinished next to chalmette | Re-bake gulf land with fewer, softer forest patches (blur radius x3, forest opacity 0.5) and lighten the land 15 %; or use the painted-map base from STYLE_LOCK 2e | 2 |
| S02 | 2-12 | 1:25-1:35 | Jackson banner and the OLD HICKORY label **jammed against the date plate and cut by the left/top frame edge** | Move the banner anchor ~8 % into frame (or pan camera so Nashville is at x >= 0.15, y >= 0.2); the label must not touch the plate | 2 |
| S02 | 18-30 | 1:41-1:53 | Red Sticks banner **cut by the top edge** | Shift the camera `at` 5 % north or anchor the banner lower | 2 |
| S04, S05 | S04 20-54, S05 0-4, 16-48, 116-128 | 5:26-6:00, 6:17-6:21, 6:33-7:05, 8:12-8:25 | **neworleans world is flat and blurry** (untextured green, low-poly, stray vertical grey "bayou" ribbons that read as glitches, a ruler-straight red road across it) | Add the chalmette ground texture/fields to neworleans at 50 % or raise its texture res; give the bayou ribbons water shading/blue; soften the straight road | 2 |
| S04 | 32-38 | 5:38-5:44 | Lake Borgne = **featureless blue screen** with tiny boat dots; no shore, no context | Tilt/zoom out so a shoreline + Pass Christian/St Joseph's Island are in frame; boats 2x scale | 2 |
| S05 | 84-94, 133-142 | 7:41-7:51, 8:30-8:39 | Night melee + camp: blocks **crab diagonally** (26-43 deg off their front, slide up to 0.56) | Re-key so every move is along the heading; turn in place first (<= 30 deg/s) | 2 |
| S07 | 69.8-70.2, 83.4, 96.8, 113-116 | 11:17, 11:50, 12:04, 12:21 | **Snap turns 138-542 deg/s**; 69.9 falls inside the 70.1 dissolve so it can be seen | Turns over >= 1.5 s; or move the re-key 0.6 s after the cut | 2 |
| S03 | ~124 | 4:13 | Result ledger: the sub-line "out of about 1,000" is **overlapped by row 2** (text collision) | Ledger row gap +10 px (`ledger.rowGap`) or drop the sub-line | 2 |
| S05 | 136-140 | 8:32-8:37 | **Two Pakenham portraits at once** (gold medallion + banner) | Show the medallion only, raise the banner after the medallion leaves | 2 |
| S01 | 32-34 | 0:32-0:34 | ~2 s of a **dimmed map with nothing** before the Ghent card | Start the card dimmer 0.3 s before the card, not 2 s | 1 |
| S03 | 162-177 | 4:51-5:06 | **15 s static wide gulf**, only a tiny fleet and the subscribe button | Slow push-in toward Mobile/New Orleans + fleet 2x scale; keep ~one change every 3 s | 2 |
| S05 | ~116-120 | 8:12-8:17 | The red stamp near the river is **tiny and blurry** (unreadable at 720p) | Stamp size 2x, place over open ground | 1 |
| S06 | 80-102 | 10:04-10:26 | Pakenham's 3-part plan arrows are **pink hairlines**; labels "1 West bank" etc. sit far from their arrows; LADDERS stamp small | Arrow width 3x, opacity 0.9, labels on the arrow heads; LADDERS 1.5x | 2 |
| S06 | 18-20 | 8:42-8:44 | Gold "8" (batteries) floats in an empty field away from the guns | Anchor the number over the battery row | 1 |
| S08 | 22-30 | 13:22-13:30 | Removal arrow west is a **single faint hairline**, Creek-land hatch cut by the top edge | 2-3 muted arrows at 2x width; pull camera north 5 % | 1 |
| S07 | 0-14 | 10:27-10:41 | Fog very heavy for 14 s with almost no readable units (rocket arrow is the only event) | Fog density -25 % at 6 s and the British columns visible moving by 8 s | 1 |
| S01, S04, S08 | various | | Date plate number cell shows "Jan" / tiny month text; fine at 1080, borderline at 720 | Month text +2 px | 1 |

## Top 10 fixes

1. About-face on every retreat (S01, S03, S05, S06, S07: keys listed above): no block may walk backward.
2. British (and American) blocks as WIDE rectangles (>= 3:1); no square/deep blocks anywhere.
3. S03: keep the horseshoe world edge out of frame (2:35-3:09).
4. S01: cut the 2 s blank grey cloud screen in the hook dive (0:11-0:13).
5. S06: replace the raised plinth with the thin parapet + canal used in S07.
6. S06: British block off the river; the Carolina burns and sinks instead of popping.
7. Snap turns (S07 69.9/83.4/96.8/113, S05 107.4) and crab-walking (S05 84-94, 133-142) -> turn in place then walk straight.
8. Re-bake the gulf and neworleans worlds (blotchy/flat) and the smeared horseshoe hill overlay.
9. S07 defenders on the parapet, guns at half scale; S02 banners inside the frame; one Pakenham portrait at a time.
10. Readability: S04 Lake Borgne context, S06 plan arrows/LADDERS, S03 ledger collision, S03 15 s static tail, S08 removal arrows.
