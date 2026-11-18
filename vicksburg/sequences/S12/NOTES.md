# S12 The siege and the surrender + END, D = 142.19 s

Regions `siege` (troopScale 1.4) -> cut at 99.8 -> `wide` (troopScale 9). Ends on a 2.5 s fade to black (end.fadeAt 139.69).
Facts: FACT_NOTES sections 12-13. Sheet: `sheet.jpg` (28 stills).

| t (s) | shot | on the words |
| --- | --- | --- |
| 0-6.5 | siege world from above: six zigzag approach trenches grow toward the forts (custom ribbon meshes: dark cut + pale parapet), a blue sap-head box digging at each head | plaque JUNE 1863 "the siege" on "dug"; note "closer every week" |
| 6.5-21.6 | night (0.8 s dissolve): 3 mortar boats + 2 gunboats on the river, 12 shots with high glowing fuse arcs, bursts in the town, two houses burn; push onto the town's east-facing hillsides: 14 cave mouths with lamp glow, townspeople markers | "Mississippi River" on "river"; "Vicksburg" on "people of Vicksburg"; label "Caves in the hillsides" on "caves"; note "food runs out · mule meat" |
| 21.65-39.4 | cut + day: the 3rd Louisiana Redan; the mine fired 27.95 (flash, boom, dirt column, clods, crater decal), the redan's front garrison gone; two regiments rush into the crater on "rushed", held by the inner line (volleys) | plaque 25 JUNE · DAY 57, clock 3:00 -> 3:20 P.M.; "the mine"; "Held in the crater · about 26 hours" |
| 39.4-54.6 | the town by day, dimmed | custom card THE DAILY CITIZEN on wallpaper (pattern bleed + turned-up corner on "wallpaper"), boast line on "mocked", "First ketch your rabbit." on "first catch" (GM's spelling) |
| 54.6-69.4 | 3 July: eight white flags rise along the works; push to the oak | plaque 3 JULY · DAY 65; clock 3:00 P.M.; Pemberton / Grant cards facing (leader lines to the oak site) on their names; oak marker on "near a stunted oak"; "Mexico, 1846-48 · the same division" |
| 69.4-78.5 | night, campfires along both lines | clock 10:00 P.M.; letter card "Grant's terms" (no quote marks: the substance) |
| 78.5-99.8 | 4 July (cut + dissolve): the garrison marches out 1.5 units, stacks arms (grey stacks left on the ground, boxes turn grey), marches back; blue silent | plaque 4 JULY · DAY 66, clock 10:00; number 29,500 on "twenty-nine"; "Without a cheer"; small DAILY CITIZEN card "Caught our rabbit." |
| 99.8-119.6 | wide: pull up from the city to the whole river; the river glows blue to the south edge; steamers run down | plaque 9 JULY · DAY 71; Port Hudson label at the south edge; "Cut in two"; "Gettysburg" (screen label top-right, no marker); Lincoln quote card (Conkling, 26 Aug 1863) |
| 119.6-142.19 | dusk grade, slow pull-up; seven gunboats (lamps) run past the city again | Grant card on "Grant"; ledger The Vicksburg campaign: Seven gunboats / Five battles, 18 days / 29,500 surrendered / The Mississippi open; plaque hides; fade to black over the last 2.5 s |

Cues: 32 (12 mortar/gunboat shots + booms, 2 house fires, mine boom, crater volleys). Portraits: built-in grant, pemberton.

Open issues
- Masthead "THE DAILY CITIZEN" is not in FACT_NOTES (well documented: Vicksburg Daily Citizen, wallpaper editions July 1863); add a line or drop the name.
  The card's quoted words are GM's ("First ketch your rabbit", "caught our rabbit"); the narration says "catch".
- The siege region's west edge (beyond the river) is a flat field; the wide end shot (136-142 s) shows a sliver of the region edge at the left.
- Dusk is a grade + night 0.25-0.45, not a real sunset sky.
- Mortar boats use the gunboat model (smaller); no dedicated mortar-raft model.

## Round 2 fixes (critics A + B round 1)
| finding | what I did |
| --- | --- |
| B sev 3: the surrender 80-90 s at wide distance (specks) | Close key over the 3rd Louisiana Redan / Jackson road (dist 15.5 -> 14) for march out, stack arms (grey stacks), turn grey, march back; pull back (dist 34) by 93 s for the 29,500 and the newspaper. |
| B sev 2 / A: "the whole river in Union hands" glows white/cyan | Replaced the additive sprites with a Union-blue (#2c57b7) ribbon mesh on the wide river: north of the city at once, grown south from the city to the Gulf edge 103.3-105.4 ("whole river ... Union hands"), kept to the end ("the Mississippi open"). |
| A sev 2: newspaper grey placeholder bars, empty centre box at 42 s | Columns now real small period type (generic siege-town items: the situation, provisions, caves, the paper on what paper can be had, the lines, a notice; no words presented as quotes); the excerpt box fades in with its first line (44.3), so no empty box. |
| B sev 1: the 4 July sheet was the 2 July issue reprinted by Union soldiers | Second card dated "Thursday, July 2, 1863", ribbon "the 2 July issue, reprinted by Union soldiers on 4 July" (FACT_NOTES, Daily Citizen row). |
| A sev 2: the mine = a static pink pillar for ~15 s | New mine fx: a burst of dark earth and clods thrown up and falling back within ~3 s, then grey smoke drifting east and thinning over ~6 s; gone by ~36 s, the crater decal stays. |
| B sev 2: "Gettysburg" 2.5 s early | t0 112.44 (word 112.49). |
| A sev 2: Grant card cut by the right edge 120-128 | screen [1690, 232]. |
| A sev 1: "Mexico, 1846-48" plate over the blue boxes | moved to open ground right of the oak (x 1420, y 680). |
| A + B sev 2: finale muddy dark, no sunset, no callback | Warm low-sun dusk: dusk grade + a warm "screen" light from the upper left (low western sun, DOM layer under the cards) from "For Grant" on, world night 0-0.1 (was 0.25-0.45), wide toe +30. Callback on "It began on a dark river" (129.55-135.0): dip through dark, cut to the siege world at night: the seven gunboats run dark down past the city with wakes, De Soto Point houses burning, the Henry Clay on fire, five bluff-battery flashes (no booms), plaque 16 April "where it began · the night run"; dip back to the dusk pull-up over the city with the ledger, plaque 9 July "the Mississippi open", fade to black as before. The wide gunboats-with-lamps of round 1 removed. |
| A sev 3: world edge (wide 105-142 TL; siege 78.5 TR) | wide keys pulled in / east (dist 560-580 for the whole-river view, 250-380 at the end); siege keys checked: corner check OK at margin 1. |
| night foil river 6-18 s | engine water fix (see S11). |
| quote card dims | Lincoln quote `dim: 0.4`; the dim under the last-issue card 0.7 -> 0.45. |
Not done: "ate mule meat" visual (sev 1): kept the plaque note "food runs out · mule meat" on "ran out" (no new marker).

## Round 3 fixes (critics A + B round 2)
| Finding | Fix |
| --- | --- |
| A N3: callback gunboats ~5x too big, the last cut by the edge (129-135) | size 0.75 -> 0.3 (x0.4), 2.0 units nose to nose, speed 1.2, the 12-unit column centred on the camera's track (`CB_S`): all seven inside the frame through the shot; the bluff batteries' shots follow the new boat positions |
| A: "Grant's terms" band blank ~1 s before its title (70.5) | letter now in on "terms" (70.79) with title / header / sub fading in with the band (new backward-compatible `O.letter` options `lag`, `stagger`, `partDur`; S12 uses 0.05 / 0.06 / 0.35); the 10 p.m. plaque note is "that night" (was "Grant's terms" a second before the word) |
| A: Pemberton + Grant cards + Mexico plate up together 63-70; Grant's dot on empty ground; his card on a red box | one at a time: Pemberton 61.19-63.98, Grant on "a stunted oak" 64.4-66.2 with his leader dot ON the oak and the card below-right over the open Union side, then the Mexico plate 66.5-69.3 |
| A N7: slanted boxes 60-96 | keys 59.4-99.8 at fov 21, dist x1.43 (same framing): off-centre boxes stay upright rectangles |
Engine change: `engine/overlay.js` O.letter `lag` / `stagger` / `partDur` (defaults 0.3 / 0.15 / 0.5 = unchanged).
Checks: check_paths OK, check_edges OK, check_escapes n/a (no bridge in the siege world).
