# S06 The mud line (D 103.93 s)

Build: `python3 vicksburg/tools/make_scene.py ajackson/sequences/S06`. Region: chalmette only (day). Sheet: `sheet.jpg`. Troop motion
(`check_troops_motion.mjs ... 0 103.93 chalmette`): screen long-side angle <= 8 deg, turns <= 37 deg/s, 0 pops, 0 overlaps.

## Shot list (scene time, what appears on which word)
| t | shot |
| --- | --- |
| 0-16.6 | from above the British side looking back at the line; plate 24 DECEMBER 1814; Jackson's rampart rises out of the ground from 0.3 to 12.5 s (works[0] lifted by a custom emitter) while the diggers (regulars, Tennesseans) stand at it; "Rodriguez Canal" on its word (2.73), "Mississippi" on "river", "cypress swamp" on "cypress"; ruler 1 MILE river to swamp on "mile" (6.2, `countFrom: 1`); labels "Five feet high" (11.0) and "Twenty feet thick" (12.8); "the ditch" on "ditch" (15.5) |
| 17-30 | closer along the line: Jackson banner on "Jackson" (17.8); the eight batteries appear one by one from "eight" (18.25, every 0.32 s) at Latour's order/spacing; gold "8" on "eight"; "Baratarians" over Battery 3 on its word (22.2) |
| 30-46 | the defenders: Louisiana militia, two free-men-of-colour battalions, Kentucky riflemen, Choctaw walk in from the rear to their places on their words; small labels: regulars 31.4, Louisiana militia 33.1, free men of colour 35.9, Tennessee 36.9, Kentucky 37.6, Choctaw 39.35; "One of the strangest armies" on "strangest" (43.2) |
| 46.3-52.6 | across the river: plate 27 DECEMBER on "twenty-seventh" (48.5); British guns on the levee fire 4 shots at the Carolina from "their guns" (49.7), she burns (steamer fire) from 50.9; label "Carolina" on her name |
| 52.6-61 | plate 28 DECEMBER on "The next day"; two red columns (river road, swamp edge) advance + arrows on "advanced"; the line's guns fire from "American guns" (55.4), the Louisiana (ship, label on her name) fires from 57.0; riflemen volleys on the swamp leg; driven back on "drove" (59.5: escapes = about-face and walk off east) |
| 61-76 | plate 1 JANUARY 1815 "New Year's Day · fog" on "New Year's"; Pakenham banner on "Pakenham" (62.4); fog veil (screen canvas, thicker toward the horizon, drifting banks); the British parapet + 3 two-gun batteries built "in the night" (65.4-67.6); "sugar barrels" on "barrels" (67.45); fog lifts from "fog" (69.3) to 71.4; British guns open on "opened" (70.45), 6 shots; American guns answer 8 shots 71.2-75.4; British batteries turn grey + smoulder from "shot" (74.5) |
| 76.6-103.9 | up and wide over both banks: plate note "Pakenham's plan"; label "1 · West bank" + red arrow over the river to the west-bank battery on "Across" (82.0), barges crossing on "land", "west bank" on "west", arrow from the battery at Jackson's line on "turn" (85.1); "2 · River column" on "east" + arrow on "column" (89.8); "3 · Main column" on "main" + the widest arrow on "column" (92.7); bundle icon on "bundles" (98.1), ladder icon on "ladders" (99.8); red LADDERS stamp on "Remember" (101.0) |

## Facts (FACT_NOTES_neworleans.md)
Canal + rampart (33, 35: earth, 5 ft high, up to 20 ft thick, from the morning of the 24th); eight batteries in Latour's order, Battery 3 =
Dominique You + Beluche, Baratarians (37, 17); defenders (16, 19); Carolina burnt 27 Dec, Louisiana fired on 28 Dec (18, 39); 1 Jan fog, sugar
hogsheads, ~3 hours, British guns silenced (40); the plan (41: Thornton west bank -> Patterson's battery; Keane along the river; Gibbs by the
swamp; 44th with fascines and ladders).

## Images
`jackson.png`, `pakenham.png` (ajackson/assets/generals), flags from ajackson/assets/flags. Bundle and ladder icons are inline SVG.

## Open issues
- The 1 Jan British parapet, the advanced redoubt and the west-bank works are also painted in the baked ground texture (flat marks visible
  before their 3D parapets rise); a re-bake without them would be cleaner.
- The plan is shown with the real units' positions (red blocks at the start lines); the West India regiments / reserve are not shown.
- Carolina fire on 27 Dec reads weakly at 51.5 s (steamer preset, size 0.8): raise opts.size / glowSize if a critic flags it.

## Round 1 fixes
- Rodriguez line: the rampart rises to 55 % of its baked crest height (thin parapet, same as S07); the "plinth" was the full-height glacis
  seen from above. Exact crest arithmetic now (no over-sinking).
- Guns at about half size (`bw 0.24, bd 0.2`); defenders right behind the wall between the batteries (d -0.75) or in a second rank (-0.95/-1.0).
- 28 Dec probe: the road column starts on the bank (not the river); both columns hold, advance, stop, turn about in place (~6.5 s, engine
  `retreatTurn`) and walk off east, visible until 66.5 s.
- The Carolina burns (bigger steamer fire) and sinks over 2.2 s (boat `h(t)`), fire out with her; camera stays on her to 53.4.
- 1 Jan duel guns end at 73.75 (critic B: "shot most of them to pieces" clear of gunfire).
- Plan arrows 2.5-3x wider (`maxWidth`), labels at the arrow heads, LADDERS stamp 1.5x, gold "8" over the battery row.

## Round 3 fixes
- 28 Dec probe: the swamp column (r19) is already up by the swamp when it fades in on "The next day" (its approach = the arrow), then turns
  about and walks off as before: no 46 deg drift at 54-56 s (now <= 18 deg). The road column (r18) keeps its short advance (14 deg; one
  93 deg/s flag at 54.1 while the camera swings off the Carolina).
