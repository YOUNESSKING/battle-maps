# S05 MOVE 2: the night attack, 23 December 1814 (D 148.07 s)

Build: `python3 vicksburg/tools/make_scene.py ajackson/sequences/S05`. Regions: neworleans (wide) + chalmette (close); both in base z10 units,
so the same coordinates work in both. Sheet: `sheet.jpg`. Troop motion: `check_troops_motion.mjs ... 40 148.07 chalmette` = screen
long-side angle <= 7 deg, 0 overlaps, 0 pops (world "front-vs-velocity" 26-43 deg is the engine's on-screen correction under oblique cameras).

## Shot list (scene time, what appears on which word)
| t | shot |
| --- | --- |
| 0-6.2 | neworleans wide: British army marker at Villere, plate 23 DECEMBER 1814; red arrow up Villere's canal on "bring up the rest" (2.6); ruler 9 MILES to the city on "march" (4.15); "New Orleans" on "city" (4.7) |
| 6.25-14.6 | dissolve -> chalmette day, low over Keane's camp looking upriver; label "About 1,700 men" on "seventeen" (7.35); campfires lit on "fires" (12.07), light starts to fall |
| 14.65-25.4 | dissolve -> neworleans: Jackson banner at the city on "Jackson" (15.67), plate notes "news reaches the city" / "early afternoon"; quote card on "Gentlemen" (21.0): "Gentlemen, the British are below. We must fight them tonight." attr "Andrew Jackson · as later told" (FACT_NOTES 26: traditional) |
| 25.6-49.5 | WHAT WOULD YOU DO? (`O.engage.decide`): title on "Now stop" (25.65), A DIG IN AND WAIT FOR THEM on "dig" (38.1), B ATTACK TONIGHT on "attack" (41.0), TELL US IN THE COMMENTS on "Tell" (43.3) + ticks from "comments"; dusk falls; blue at the city on "militia", British barges up the canal on "enemy"; B lights up on "He did not wait" (48.4) inside the white-out |
| 45.5-52.65 | cloud dive 3 neworleans -> chalmette NIGHT (swap 49.3, land 52.65) |
| 50-61 | blue blocks down the river road (label "river road" on "road"); the Carolina (ship) drifts down and stops at her anchorage at 60.2; label "Carolina · US Navy schooner" follows her from "Carolina" (56.6) |
| 62.4-71.9 | clock plate 19:30 on "half past seven" (63.1); 8 broadside shots from 65.13 (flash + plume + impact in the camp, each a cue), campfires out on "out" (71.2) |
| 72.5-83.2 | Jackson banner + arrow along the road on "Then Jackson attacked"; the three blue lanes advance firing (volleys with flashes); Coffee banner on "Coffee's" (78.8), his blocks along the swamp edge + arrow on "swung" (79.7), volleys into the British flank on "struck" (81.5) |
| 83.7-96.7 | melee, camera low (dist 13-14): both sides push through each other's lanes (forward moves only) -> blue and red blocks mixed in small groups; 12 short ragged volleys all over the field |
| 97-107.75 | grey dawn; plate 24 DECEMBER "before dawn" on "dawn" (102.2); ledger "The night battle · 23 December 1814 · losses": British 277 / Americans 213 (killed, wounded or missing) on "lost" (99.5 / 100.2); the Americans leave by the river road (escapes) + arrow back to the canal on "pulled"; Jackson's line starts to rise; "Rodriguez Canal" on its word (106.5) |
| 107.8-129.5 | dissolve -> neworleans: label "Stung" on "stung"; red HALTED stamp (pinned west of Villere) on "wait" (116.2); Jackson banner at the Rodriguez line; label "Time" on "time" (121.8); method card = S03's letter card ("Move 2 · The night attack", THE OLD HICKORY METHOD, "1. Close every door" typed fast, "2. Strike first" typed on "hit him first" 126.5) over the map |
| 129.55-148.07 | dissolve -> chalmette day: plate 25 DECEMBER "Christmas Day" on "Christmas"; reinforcements walk out of the swamp onto Villere's (6 units staggered); Pakenham banner on "Pakenham" (133.9); medallion card "Sir Edward Pakenham · Wellington's brother-in-law" on "Wellington's" (134.7); plate "1815 · Jan · early January" on "January" (140.5); number 8,000 on "eight" (143.45); the camera keeps moving (last 0.6 s dissolves into S06) |

## Facts (FACT_NOTES_neworleans.md)
Villere ~9 miles from the city (25); advance guard ~1,700 (9, 30); Jackson learned ~1 p.m. (24); quote traditional (26); Carolina anchored
off Villere's batture, opened fire ~7:30 p.m. (27); Jackson on the river road, Coffee by the swamp side into the British right (28);
213 / 277 (31); withdrew 4 a.m. 24 Dec two miles to the Rodriguez Canal (32); Pakenham arrived 25 Dec, Wellington's brother-in-law (8);
~8,000 by early January (9). The rampart only exists from the 24th: the engine works are hidden until "pulled back" and rise slowly.

## Images
`jackson.png`, `coffee.png`, `pakenham.png` = `ajackson/assets/generals/` (S01 author's cuts of the PD portraits in `ajackson/assets/portraits/`,
see its SOURCES.md); flags `us15_flag.png`, `gb1801_union_flag.png` from `ajackson/assets/flags/`.

## Open issues
- Script tag "Keane's banner" not used: Keane is never named in S05 (nothing on screen before it is spoken) and has no portrait; the British
  side is the HALTED stamp + "Stung" label instead.
- The method card uses S03's `letter` device; line 1 is typed fast before line 2 (the letter device types the whole quote).
- The night is `night: 0.85` (a little lighter than 1.0) so the blocks stay readable at 720p.
- Escaping blue blocks turn on the road bend at ~107.4 s (turn 100 deg/s, during their 0.6 s fade out at the dissolve).
- The British ruler on the wide map counts 0 -> 9 (engine default); the S06 one uses the new `countFrom`.

## Round 1 fixes
- Retreats: engine `retreatTurn` (default in this project): the Americans' withdrawal (escapes from 98.2 s) now turns each block about in
  place (~6.5 s), then walks off front first up the river road. Melee and camp moves were already forward-only.
- Blocks are wide rectangles (engine `depthK` 0.3: 18 files x 4 ranks, ~3.3:1).
- Melee/attack/Christmas cameras turned to yaw ~0 (looking north, moves left-right / up-down on screen): less on-screen correction (crab).
- 108-129: the British side on chalmette by day (no Jackson banner): Keane's banner (initials JK, `keane.png`, plaque "Keane") on
  "commander" (115.0), red blocks halted in Lacoste's fields, label "Stung", HALTED stamp 2x over open ground in front of the camp on "wait".
  The camera then moves on (no cut) to the Christmas reinforcements.
- One Pakenham portrait at a time: medallion on "Pakenham" (133.9) to 140.3, banner from "January" (140.4).
- Method card: "1. Close every door" static in the sub, only "2. Strike first" types on "hit him first" (126.5).
- Decision card second beat: labels "Militia, volunteers · and a few regulars" (on "militia") and "British regulars · more landing every hour"
  (on "landing") on the dimmed map.
- Melee volleys: 8 groups at 1.7-2.1 s (was 12 at 1.05-1.45): fewer shots under the narration.
- Jackson's line at dawn rises to only ~45 % of its baked height (thin parapet, as S06/S07).

## Round 2 fixes
- 72.5-83: the attack volleys (Jackson's lanes, the British front) end by 77.75 (before "while" 77.87); Coffee's men fire after "side." (82.9):
  "while Coffee's ... struck the British from the side" is clear of shots.
- Jackson quote (21-25): 52 px on a dark backing with a thin gold rule (`.cq` styled after the call), y 640, dim 0.6.

## Round 3 fixes
- The British second row (r3/r4) holds in the melee (no 22-26 deg drift at 87-92 s); check 80-100: 0 flags, 0 overlaps.
- Jackson quote 62 px (+20 %).

## Owner fixes (blocks never cross)
- Night melee rebuilt: the Americans close to ~1.2 units of the British (x <= 1276.5 vs >= 1277.5, more than a block depth apart), stand
  and fire; Coffee's two blocks halt on the British right flank (x 1276.4-1276.9) and fire; nobody walks through or past the enemy. The
  confusion is the 8 small groups firing ragged volleys (each from its own block) + smoke. Before dawn the Americans turn about and leave.
- New check `node vicksburg/tools/check_side_gap.mjs <scene> <t0> <t1> <region> [gap 0.25]`: minimum outline gap between every red / blue
  block pair + pairs whose separation reverses (passed through each other). S05 40-148: 0 pairs closer than 0.25, 0 crossings.
