# Critic A, round 2: THE LOOK (Vicksburg 3D, S01-S12 GPU renders `/tmp/vx_render2`, 1280x720)

Method: every scene sampled every 3 s as 4x4 contact sheets (`/tmp/vx_critic_A2/SNN_sheetK.jpg`), plus ~60 full-res stills and
2-2.5x sector crops (`/tmp/vx_critic_A2/fr/`). Compared against round 1 (`round1_A.md`), the v8 clip numbers and the GM measurements.
Times are scene-local seconds (sheet labels are offset by up to ~1 s by keyframe seeking; stills are exact).

Colour stats (central 700x450): wide frames still mean (76-83, 85-91, 74-79), darkest 5 % (33-37, 41-45, 44-48), dark share
(L<60) 0.22-0.31 (S02 3/100/110/125, S04 3/12, S06 72/90, S11 3/6). GM wide (90,96,84) / 0.11-0.15. Champion close now (82-92, 87-93,
75-81), dark share 0.03-0.04 (was (70,79,72)): fixed. S12 finale now warm dusk: fixed. Jackson close S08 36-54 (74-126, 66-97, 67-86):
a magenta/rust cast.

## Scores (10 = GM polish)

| Scene | R1 | R2 | One line |
| --- | --- | --- | --- |
| S01 cold open | 5 | 6.5 | action from frame 1, plaque stays, dive + dissolve good; red city carpet, red box on the burning Big Black bridge (41-43), thick arrows off frame |
| S02 fortress + plan | 5 | 5.5 | world edges + river march fixed; grey cauliflower clouds 0-18 and 105-136, march arrow off the bottom through the legend, red city carpet under Pemberton |
| S03 night run | 5 | 5 | night look good, dawn dissolve good; fleet still a comb of specks, Henry Clay fire a tiny spark, 22 April steamers = one giant brown "train", staircase wide river |
| S04 Grand Gulf + Bruinsburg | 5 | 6.5 | gunboats spaced, no dash, quote over a live map; Grierson card sits ON his line (44-49), staircase wide river |
| S05 Port Gibson | 4 | 6.5 | columns on the ridge roads read; red town blob at the bridge, smoke still small white puffs, bottom boxes cut |
| S06 cut loose | 5 | 6 | boxes upright, labels clean; thick arrows off both edges 69-93, the blue arrow runs through Grant's banner (90) |
| S07 Raymond | 4 | 6.5 | creek respected, dive good, 19 vs 5 boxes read; arrows 2x width from off-frame, arrowhead on top of its own box (36) |
| S08 Jackson | 4 | 5.5 | troops + factory + fire with column now; Jackson a red carpet with magenta cast, quote text across Grant's banner 36-45, pale-red road "X" |
| S09 Champion Hill | 5 | 6.5 | crest fight readable, woods lifted, banners in frame; smoke beads on the crest, boxes over the timeline/legend, 4 furniture items at 168-172 |
| S10 Big Black | 7 | 7.5 | lake fixed, fire after the last red box, morning dip; one arrow crosses the river with no bridge (43.5), seals on the day labels |
| S11 assaults | 4 | 6.5 | foil river + world edge fixed; trench smoke = a string of white beads 48-57, staircase wide river 0-20, labels over arrow/boxes (6) |
| S12 siege + surrender | 4 | 6.5 | mine, newspaper, surrender close, dusk finale fixed; callback gunboats 5x scale (129-135), blank cream card ~1 s (70.5), two big cards at once (63-70) |
| **Overall** | **4.8** | **6.2** | the big structural faults are gone; what is left is scale, palette and frame discipline |

## Round-1 findings: status

| R1 finding (global) | status | evidence |
| --- | --- | --- |
| Boxes rotate with facing | **fixed** (residual) | every scene upright; residual: off-centre boxes in low close shots are sheared parallelograms (S08 30-55, S12 60-96, S09 100-110), see N7 |
| Wide town glyphs red | **fixed** | S07 2, S08 55, S01 40: small brown buildings along the roads |
| World edges | **fixed** | none found in any sampled frame |
| Siege/Vicksburg foil water | **fixed** | S11 33, S12 6/21: flat dark slate. But the WIDE river now stair-steps (N2) |
| Cotton-puff smoke | **partly** | smaller and softer (S05 40, S07 25), but still isolated round puffs; S11 48-57 a string of white beads along the trench, S09 96-110 puffs on the boxes |
| Wide cauliflower clouds | **partly** | S04 fixed (keepClear); S02 0-18 + 105-136 (grey lobes, 15-20 % lower right), S09 0-12 lower left, S08 84-96 lower third unchanged |
| Wide map too dark | **not fixed** | wide mean ~(79,87,76), dark share 0.22-0.31 (GM 0.11-0.15); woods still black blobs. S11 wide toe +30 helped a little; S12 finale fixed |
| Close woods teal blanket (S09) | **fixed** | close mean (82-92,87-93,75-81) |
| Arrows 2x width, off frame | **not fixed** | S01 36-48, S02 105-136, S04 44-57, S06 21 + 69-93, S07 33-36, S09 87-90 |
| Plaque disappears (S01) | **fixed** | "Spring 1863" 0.7-55 |
| Quote cards dim/static | **fixed** (one overlap) | dim 0.4 over a moving map; S08 36-45 the quote runs across the Grant banner (N8) |
| Close towns red carpet | **not fixed** | S01 18-30, S02 21-75, S03 15-60, S05 48-63, S08 21-55, S11 30-40, S12 0-18 + 129-135 |
| Timeline seals on labels / inconsistent | **not fixed** | S09 145-172 ("17" under the seal), S10 all ("17", "18" hidden); bar still only in S09-S11 |

| R1 finding (scene) | status |
| --- | --- |
| S01 top-down/yaw 26-33; hard cut 33; pulse/glow colours; FAILED | fixed (all) |
| S02 banner + boxes on the river 96-104; diagonal red strings 42-60 | fixed |
| S03 fleet specks 0-15 | partly: closer at 0-12, but 18-45 the fleet is again a single overlapping comb of specks (S03 30) |
| S03 Henry Clay white blob | partly: no blob, but at 52-57 the fire is a ~10 px spark at the top edge, the smoke column does not read at 720p |
| S03 static dawn wide | fixed (animated 22 April run) - but see N3 (giant steamers) |
| S04 comb + weir, dashed road, quote over banner | fixed |
| S05 night, interleave, bridge arrow, label overlap | fixed; bottom boxes cut at 40-45 and 54-63: **not fixed** |
| S06 lone arrowhead; 84-93 clutter | fixed / partly (blue arrow through the Grant banner at 90) |
| S07 frame + world edge 12-15; creek crossing | fixed |
| S08 dive card; troops + factory + fire | fixed; wide pale-red road "X" 30-55: **not fixed** |
| S09 banners/cards cut; crest tangle; teal woods | fixed; "massed guns" still not in frame at 100-105 (partly) |
| S10 polygon lake; shaftless arrowhead; morning jump; camera | fixed |
| S11 letter size; quote across the cut | fixed |
| S12 mine, newspaper, Mexico plate, Grant card, finale | fixed |

## New findings (scene | t | sector | problem | fix | sev)

| scene | t | sector | problem | fix | sev |
| --- | --- | --- | --- | --- | --- |
| ALL close towns (N1) | S01 18-30, S02 21-75, S03 15-60, S05 48-63, S08 21-55, S11 30-40, S12 0-18, 129-135 | towns | (carried) Vicksburg / Jackson / Port Gibson are carpets of red roofs on rust streets; red boxes on them vanish (S02 45 Pemberton's boxes over the banner, S05 50, S08 54); Jackson + the blue "flew" disc gives a magenta cast (S08 36-54 mean (74,66,67)). | Engine town palette: roofs weighted slate/brown/grey (red <= 20 %), streets + town ground grey-ochre (~(150,140,118)), not rust; the S08 blue wash at <= 0.15 or a flag-only signal on close shots. | 2 |
| S03, S04, S11, S02 wide (N2) | S03 66-84, S04 0-15, S11 0-20, S02 0-20 | wide river | Wide rivers have stair-stepped (aliased) banks and a coarse tiled grey "chain-mail" ripple (S03 78 crop, S04 12 lower left, S11 6 lower left). Probably the new per-river normal tiling (`world.js`) applied to wide worlds, plus no AA on the river mask. | Apply the 0.9-unit ripple tiling only to close worlds (as intended); on wide worlds ripple amplitude ~0 (flat slate as v8 wide); smooth the river mask edge (bilinear/feather 1-2 px, or MSAA on the river mesh). | 2 |
| S03 (N3) | 74-84 | river, wide | The six 22 April steamers are one brown block ~300 px long: hulls ~5x wide-map scale, nose-to-tail, lying on the inner bank; they read as a train, not a fleet. | Wide-map boat size ~0.35 of now, 3-4 lengths apart, centred in the channel; lamps + thin wakes only. | 2 |
| S12 (N3) | 129-135 | river | Callback gunboats are giant black toys (each ~110 px, as long as 8 city blocks), the last cut by the right edge. | Size x0.4, spaced 3 lengths, keep the column inside the frame; or frame wider. | 2 |
| S03 | 18-45 | fleet | Fleet passing the city is again a single overlapping dark comb (boats touch). | Spacing >= 2 lengths at this distance (as S04 now does). | 2 |
| S03 | 50-60 | fire | Henry Clay fire too small/at the top edge to read; no visible column. | Frame the burning boat mid-left, fire size x2.5, column alpha 0.6 (as S08 factory). | 2 |
| S01 (N4) | 41.3-43.3 | Big Black montage | A red box sits IN the fire on the burning bridge (owner rule: no crossing a burning bridge); red retreat arrow and blue pursuit arrow are drawn on top of each other along the same road (blue head inside the red shaft). | Fire t0 after the last box is west (as S10 now does), or boxes already west; offset the two arrows >= 1 arrow width apart or show only the red one in this beat. | 2 |
| S10 | 42-45 | bridges | Upper next-morning arrow crosses the Big Black where no bridge is visible (550,212); the lower new bridge has no arrow. | Run each arrow over a visible new bridge (place the bridge meshes under the arrow paths). | 2 |
| ALL arrows (N5) | S01 36-48, S02 105-136, S04 44-57, S06 21/69-93, S07 33-36, S09 87-90 | arrows | (carried) Arrows ~2x the v8 width, start or end outside the frame; S06 90 the blue arrow runs through the Grant banner; S07 36 an arrowhead covers its own box; S02 110-136 the march arrow exits through the legend. | `a.width` 0.32 -> 0.22-0.24 globally; clip arrow polylines to a 6 % safe margin (engine: trim pts whose projection is outside); arrows stop short of banners/boxes by 1 box width. | 2 |
| S04 | 44-49 | Grierson | Grierson card sits on top of his raid line; the line runs top edge to bottom edge with no head on screen. | Card top-left of the line (or line shifted west), line end + head inside the frame. | 2 |
| S02, S08, S09 (N6) | S02 0-18 + 105-136, S08 84-96, S09 0-12 | clouds | (carried) Smooth grey cauliflower clouds in the lower corners (15-20 % of frame) - the one cloud fault left. | S04's keepClear on these keys, or v8 wide cloud settings (lit cream tops, torn rims). | 2 |
| S11, S09, S05, S07 (smoke) | S11 48-57, S09 96-110, S05 39-48, S07 24-33 | battle | (carried) Smoke = separate round white puffs; S11 a "string of pearls" along the trench line; S09 puffs sit on top of the Union boxes. | v7 `smokeLine` curtains along each firing line (seated, grey (150,153,157), alpha 0.27, `fadeAfter` 6 s); no single sphere puffs; keep curtains in front of (not on) the boxes. | 2 |
| S08, S12, S09 (N7) | S08 30-55, S12 60-96, S09 100-110 | boxes | Boxes away from the frame centre in low close shots are sheared parallelograms (top edge offset ~10 px): they face the camera yaw, not the camera. | Billboard each box to the camera POSITION (or render as screen-aligned sprites anchored at the ground point), so every box is a true upright rectangle. | 2 |
| S08 (N8) | 36-45 | quote | Quote text runs straight across the Grant banner. | Hide the banner under the card, or move the card below it (y +60). | 2 |
| S05 | 40-45, 54-63 | frame | (carried) Bottom row of blue boxes cut by the frame; S05 60 a box under the legend. | Frame up 5 %; legend steps out while units sit there. | 1 |
| S09, S10 | S09 166-172, S10 30-45 | timeline | Boxes drawn under/over the timeline bar (S09 172 a box on "18"; S10 42 a column over the bar), and at 168-172 clock + ledger + legend + timeline = 4 furniture pieces at once. | Timeline out while the ledger is up (one big card at a time) or units framed above y 640. | 1 |
| S12 | 70.0-71.0 | card | "Grant's terms" letter band appears ~1 s empty before its title. | Title + first line in with the band (as S11). | 1 |
| S12 | 63-70 | cards | Pemberton + Grant cards + Mexico plate up together; Grant's leader dot points at empty ground; his card hides a red box. | Grant card in after Pemberton's leaves (or both small); dot on the oak. | 1 |
| S11 | 3-9 | labels | "Chickasaw Bayou" plate over the blue arrow head and a box; a box sits on "Walnut Hills". | Plate below-left; label 15 px higher. | 1 |
| S04 | 60-66 | Bruinsburg | The four landed boxes stand in a diagonal staircase across a field, not on the road. | Put them in a column on the landing road. | 1 |
| S06 | 90 | labels | A red box covers the "n" of "Jackson". | Name 12 px up. | 1 |

## Top 10 fixes (in order of viewer harm)
1. **Close towns out of red** (S01, S02, S03, S05, S08, S11, S12): slate/brown roofs, grey-ochre streets; S08 blue wash down to <= 0.15 (kills the magenta cast). Red must mean Confederates only.
2. **Wide river regression** (S02, S03, S04, S11): no 0.9-unit ripple tiling on wide worlds, feather/AA the river mask - no staircase banks, no chain-mail texture.
3. **Boat scale and spacing** (S03 18-45 and 74-84, S12 129-135): wide steamers x0.35 and 3-4 lengths apart; callback gunboats x0.4 inside the frame; Henry Clay fire readable (x2.5, mid-frame, column).
4. **Arrows: v8 width + safe margin** (all scenes): width 0.22-0.24, clip to a 6 % margin, stop short of banners/boxes; Grierson card off his line (S04 44-49).
5. **Owner bridge rules** (S01 41-43 red box in the burning bridge; S10 42-45 arrow crossing with no bridge): fire after the last box; every crossing over a visible bridge.
6. **Smoke curtains, not puffs** (S11 48-57 beads, S09 96-110, S05 39-48, S07 24-33).
7. **True billboard boxes** (S08, S09, S12 close): face the camera position so off-centre boxes stay upright rectangles.
8. **Clouds** (S02 0-18 + 105-136, S09 0-12, S08 84-96): keepClear on those keys or the v8 wide cloud look.
9. **Lift the wide grade** (all wide shots): woods +18-22 levels, dark share toward 0.15 (still 0.22-0.31).
10. **Frame/overlay discipline**: quote off the Grant banner (S08 36-45); boxes off the timeline + one big card at a time (S09 166-172, S10 30-45, S12 63-70); no blank letter band (S12 70); bottom boxes in frame (S05 40-63); timeline seals above the labels.
