# S04 THE LONG RETREAT (D 66.32 s) — sheet.jpg (19 stills)
Regions colonies (z9, troopScale 11) -> jersey (z10 winter, troopScale 3.2, dissolve 23.2). No dive. Times local.
First key = S03's last camera (colonies at [610, 264], dist 285, tilt 35). Last camera: jersey at [640, 1010], dist 112, tilt 42 (S05 can start there).

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-8 | colonies, Manhattan -> White Plains | plate carries S03's 30 August; Washington banner + blue block off Manhattan, red block + arrow behind on "drove" 3.9; WHITE PLAINS stamp on "White" 6.85 |
| 8.5-16.4 | Fort Washington | plate 16 November 1776 (9.0); 3 red arrows converge on "stormed" 10.3; FORT WASHINGTON stamp 10.7; garrison block greys (11.5); 3,000 on "three" 14.3; label "Nearly 3,000 prisoners" on "prisoner" 15.4 |
| 16.4-23.2 | camera pulls back over New Jersey | red arrow on "chased" 17.1; blue arrow Fort Lee -> Trenton on "across" 18.8; blue block at Trenton + "Delaware River" on its word 21.7 |
| 23.2-35 | (dissolve) jersey winter, Trenton | plate 8 December, Sunday (24.3); three regiments break rank onto boats at three landings, the boats cross, the blocks land on the PA bank; 10 separate boats along the river pulled over to the PA bank one by one from "every boat" 27.3; Washington banner on the PA bank; plate note "Congress flees Philadelphia" 32.9 |
| 35-50 | wide posts -> Trenton | red blocks settle into Trenton (3), Bordentown, Princeton from "settled" 35.1; gold pulse + "Trenton" 40.1; label "Hessians / three regiments" 41.3; ground labels Rall 43.1, Lossberg 43.9, Knyphausen 45.2; "About 1,400 men" 46.2; Rall banner (initials JR, Union Flag) on "Colonel" 47.9 |
| 50-66.3 | the blue camp on the PA bank | Washington banner on "army" 51.9; 4 of the 8 blue blocks fade away 56-63; label "Enlistments end / 31 December" on "thirty-first" 60.2 |

Facts: FACT_NOTES_brooklyn.md 30-35, FACT_NOTES_jersey.md B1-B2. Rall banner = initials (no PD likeness), made like Jackson's keane.png (rall.png here).
Checks: check_troops_motion jersey + colonies: 0 overlaps, 0 pops; front-vs-velocity 31-45 deg on the Bordentown / Princeton blocks while the camera pans (35-42).
Open issues: blue camp blocks are small at dist 104-134 (troopScale 3.2 = Jackson's wide value); villages on the jersey wide map still read as small crosses (houses shrunk with `features.jersey.houseK 0.35`; creek bridges hidden); colonies has no East River (see S03).

## Round 1 fixes (critics A 5 / B 7.0)
- Plate: month-only "1776" at 0.4 (no stale 30 August over Manhattan / White Plains), 16 November on "sixteenth".
- Colonies army + British block move <= 4 u/s (0.6-12.0 s, the arrow carries the distance), troopScale 11 -> 16; no overlap with the Fort Washington garrison.
- Jersey troopScale 3.2 -> 5.2 (landing spacing widened, 0 overlaps); Bordentown / Princeton posts settle in place (no oblique walk); 38.4 key 8 units W, dist 196 -> 166 (world-edge wedge).
- Checks: jersey + colonies 0 FAIL, 0 overlaps.
- Left: the colonies/jersey glare and hillshade are the world re-bake (worlds agent).

## Round 2 fixes (A 6.5 / B 7.5)
- Plate rolls to month-only "December 1776" on "settled" (no "8 December" over the posts / Rall / 31 December).
- Jersey troopScale 5.2 -> 7, Hessian blocks spaced wider, landings / PA camp spacing 0.032 (0 overlaps).
- Colonies: red arrow re-routed west of the blue block; the NJ retreat arrow stops short of the Trenton block.
- Clouds block left as author A set it. Scene folder 25.9 MB after the jersey re-bake (world bundle size).
- Checker: jersey u3/u5 screen long-side 22-27 deg on the 2-u walk inland at 28-30 s (minor).

## Round 3
- No S04 rows; rebuilt on the latest jersey bake (folder 24.4 MB). Checker jersey + colonies 0 FAIL. No negative overlay times.

## V2 (owner decision 22)
- seq.js = the approved `_v2test_a` (built from this scene): v14 troopsOpts, v8 wide grade, colonies ts 6, arrows 0.34, clouds seed 11 / n 24 / med 15,
  legend (sub Howe) all through, timeline 1.5 -> 3.5 on "sixteenth" -> 4.25 on "eighth" (Brooklyn sealed), carved Manhattan / Fort Washington /
  Hudson River; plus jersey ts 2.0 (recipe table: 0.020 x dist 54-112). Checks jersey + colonies: 0 FAIL, 0 overlaps.
- Note: at ts 2.0 the jersey posts / camp are small (v8 wide size); the recipe value is kept.
