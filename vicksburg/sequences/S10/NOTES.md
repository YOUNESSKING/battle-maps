# S10 Big Black River Bridge (17 May 1863), D = 45.77 s

Region `bigblack_new` (the TRUE bridge 1509.8,683.5; troopScale 1.2). The v8 staging translated: red line behind the breastworks (works[0], x ~1521.5),
bayou in front, three red batteries (18 guns), a reserve by the bridge; Union Carr (Lawler N, Benton) + Osterhaus east of the bayou; Union guns.
Sheet: `sheet.jpg` (18 stills).

| t (s) | shot | on the words |
| --- | --- | --- |
| 0-13 | wide over the bend: river N and W, line in the loop, Gin Lake S, Union E | plaque 17 MAY DAY 18; Pemberton banner on his name (west bank); "Big Black River" on its word; "A loop of the river" (8.9); "breastworks" ground label; "The river at their backs" at the bridge (11.6) |
| 13-26 | north flank; artillery duel (11 shots), red volleys from the parapet; Lawler's brigade out of the meander scar SW through the works, the rest follow; line turns grey from the north (21.2-23.3) | clock 8:55 -> 9:05 on "nine"; Lawler card on his name; "The line is taken" (Grant's Memoirs) on "taken"; seal "Big Black" |
| 26-37 | flank boxes + reserve run west over the bridge (red arrow), Pemberton rides off; railroad bridge fire (30.3, collapses 33.5) + the steamboat Dot burning | "The bridges burn" on "fire"; ledger: 18 guns on "guns", 1,751 prisoners + 3D number on "prisoners", "Grant stopped a single day" |
| 37-45.8 | pan south to the three new-bridge sites; next morning (plaque 18 MAY DAY 19): smouldering trestle, three columns wait and cross as each bridge unrolls (42.1 / 42.5 / 42.9) | "three new bridges" + ledger row |

Portrait: Lawler = Wikimedia Commons "MKLawler_UA_ACW.jpg" (the Wikipedia lead image, from "The Union Army" 1908; low resolution 226x328, flat crop).
Open issues: Lawler photo is small/soft; the time jump to the next morning is a plaque change + fade-in of the columns (no dissolve).

## Round 2 fixes (critics A + B round 1)
| finding | what I did |
| --- | --- |
| B sev 3: the red column crosses the bridge after the fire starts (30-36 s) | Fire on the trestle now starts at 31.3 ("set them on fire"), the Dot at 31.7, the span burns at 34.5. The two flank columns and the reserve leave earlier and faster (t0 25.1 / 25.6 / 24.8, 3.4 u/s, 1.6 past the west end): simulated with the engine's escape maths, the last red box is past the west end of the bridge at 31.0 s (`esc_sim.js`, see report). The red retreat arrow is gone at 31.0, before the fire. |
| A sev 2: Gin Lake a straight-edged polygon | Repainted in `worlds/bigblack_new/ground.jpg` (only that lake: old shape in-painted, new outline = the config polygon offset 0.45 + Chaikin x5 + a low-frequency wobble, dark shore band, broken reed fringe). Original kept at the scratchpad path in the report. The baker itself is unchanged (a re-bake would bring the polygon back: smoothing lakes in `bake_world.py` is the lasting fix). |
| A sev 1: arrowhead without shaft at 43 s | Bridge arrows now run from 4.6 units east of each new bridge over it to 1.8 west (a real shaft), width 0.24, after the bridge has unrolled. |
| A + B: next morning = plaque change only; Grant banner on the burning bridge | Dip through dark (film.dim 40.5-42.1) with a CUT at 41.22 to the three bridge sites, plaque clock 18 May 1863 · Day 19 · 8:00 in the morning on "morning" (41.21), warm morning grade (dusk) 41.2-44.4, back to day before the dissolve into S11. Grant's banner jumps (inside the dark) to the east bank (1516.2, 689.4), never on the bridge. |
| A sev 1: boxes ~2 % of frame width (v8 ~3 %) | troopScale 1.2 -> 1.4 and the opening keys pulled in (44 -> 40, 34 -> 32): boxes ~1.3x bigger on screen. |
| check_paths | 3 crossings listed = Lawler's brigade and Benton's men wading the bayou in front of the breastworks (the bayou is the obstacle in front of the line, waded in the charge); no river crossings. |
Open: timeline seals still sit on the day labels (engine overlay, all scenes).
