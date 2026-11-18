# S02 The fortress and the plan: D = 136.71 s, regions `wide` -> (cut 20.42) `vicksburg` -> (cut 56.95) `wide`

| t (s) | Words | Shot / action | Overlays |
| --- | --- | --- | --- |
| 0-20.4 | "By the winter of 1862 ... cut in two" | wide over the river from Young's Point to the south edge; Union boxes at Milliken's Bend / Young's Point on "Union" (2.68); river north of the city glows blue ("Mississippi" 3.5); the stretch from Vicksburg to the south edge glows + pulses red from "Confederate" (7.88); red arrow down the river off the map on "Port Hudson"; three red supply arrows from the West across the river (11.8-12.8), gone on "cut in two" (19.2) | plaque Winter 1862-63 (0.74); label "The last Confederate stretch" (6.6); "Port Hudson · Louisiana, further downriver" at the south edge (10.34); "Men, cattle, supplies · from the West" (13.3); pins Mississippi River (3.5), Vicksburg (9.1) |
| 20.4-39.5 | "Vicksburg was built for this ... more guns at Grand Gulf" | cut to `vicksburg`: the hairpin bend + city; a steamer comes down and slows to round the bend (23-37); the 11 bluff batteries appear one by one on "Above the bend, batteries" (29.4-31.6) and fire 4 shots at the steamer (31.0-33.6, splashes); camera pulls out for north/south | inset Harper's Weekly view of the city from the river (21.2-27.9); pins Vicksburg (20.8), Mississippi River (23.0), Yazoo River (33.8); labels "The hairpin bend" (24.2), "River batteries" (30.8), "The Yazoo swamps · to the north" (33.4), "Grand Gulf · more guns, downriver" (36.4) |
| 39.5-56.9 | "The man holding it was John Pemberton ... the swamps to the north" | push onto the city: red boxes in the city lines on "holding" (40.1), Pemberton banner at his HQ on "Pemberton" (41.5) | Pemberton card (41.04-46.6); legend (42.7-129.4); Davis card "orders: hold Vicksburg" (48.06-51.4); labels "The river in front" (53.96), "The swamps to the north" (55.24) |
| 56.9-64.9 | stakes: "In other words ... never be cut in two" | cut to wide, the map tilts (36 -> 28 deg) and the red stretch pulses again; blue arrow down the river from the north stops above the city on "the North" (60.0); red arrow from the West into the city on "the South" (62.4) | plaque note "Vicksburg holds the river" |
| 64.9-87.0 | winter of failures (no Grant name) | camera north of the city; Chickasaw Bayou: blue division attacks the bluffs on "attacked" (71.4) under red volleys, thrown back on "thrown back" (75.4); Grant's Canal arrow across De Soto Point on "canals" (80.0); Yazoo route arrow from the north stopped above Haynes' Bluff on "cut through" (82.0); arrows fade on "failed" | plaque 29 December 1862 · Chickasaw Bayou (69.2), back to Winter 1862-63 (77.9); Sherman card "Grant's friend" (70.28-74.2); ledger "A winter of failures": Chickasaw Bayou (FAILED on "losses"), Grant's Canal (FAILED 81.7), The Yazoo routes (FAILED 84.2), final stamp "Every attempt failed" (85.6), hidden 89.6; pins Chickasaw Bayou, Grant's Canal, Yazoo River |
| 87.4-103.2 | NAME MOMENT | over the Union boxes at Young's Point / Milliken's Bend | label "In the Northern papers · calls for his removal" (88.5, screen); Grant card on "Ulysses" (92.0-97.4), Grant banner on "Grant" (93.3); plaque Spring 1863 on "that spring" (96.5); label "The riskiest idea yet" (101.8) |
| 103.7-124.8 | the plan | blue division marches down the west-bank road Milliken's Bend -> New Carthage -> Hard Times with its arrow (104.1-110.6, Grant banner follows); the fleet (5 boats) + a light-blue route down the river past the city on "run" (112.2); crossing arrow Hard Times -> Grand Gulf on "carry" (115.5); Vicksburg pulses red on "fortress" (121.7) | labels "Through the Louisiana swamps" (107.5), "Far below the city · Hard Times" (109.6), "The navy runs the guns · at night" (112.2), "Across the river" (115.7), "On the enemy's side" (120.1), "Every supply he had" at Milliken's Bend (123.6) |
| 125.4-136.7 | Sherman + letter | thin ghost arrow north from Milliken's Bend on "back north" (127.0) | Sherman card (125.64-129.5); letter card 129.84 -> end: "8 April 1863 · near Vicksburg / Sherman to Grant's staff": "Whatever plan of action he may adopt will receive from me the same zealous co-operation and energetic support as though conceived by myself." (typed, cps 34; "zealous" types at ~132.9) |

Cues: 8 (4 battery shots at the steamer, Chickasaw volleys). troopScale wide 17, vicksburg 3.2.
Sources: FACT_NOTES 1-3; FACTCHECK_SCRIPT rows 6-18; letter = Sherman to Rawlins (Grant's chief of staff), 8 Apr 1863, Sherman's Memoirs (FACTCHECK_B #12).
Inset: "The city of Vicksburg, Mississippi, where the battery was raised to stop passing vessels", Harper's Weekly [1861], Library of Congress
(LoC item 2022650245, cph 3a34160, "No known restrictions on publication"), master TIFF cropped (caption removed), sepia toned -> `inset_vicksburg.jpg`.

Open issues: the far top-left corner of the first wide frames shows a sliver of the off-map border; the letter quote is a word-for-word line from memory of
Sherman's Memoirs (FACTCHECK says "the same zealous cooperation and energetic support" - please verify the rest of the sentence); "The navy runs the guns"
uses a lighter blue route colour (`color: "#86AEDC"`) to separate it from the army's march arrow; the 29 Dec date on the plaque is the main assault day.

## Round 2 fixes (critics round1_A / round1_B)
| Finding | Fix |
| --- | --- |
| B 104-124 march painted ON the river (sev 3) | New west-bank route polyline (Louisiana side, 12-30 units off the channel everywhere): Milliken's Bend - Richmond - down the west side of Roundaway Bayou - round the river's western loop - New Carthage - Hard Times (the baked road 0/1 runs on the channel between New Carthage and Perkins'). Units, arrow (w 0.28) and the Grant banner follow it. `check_paths S02`: only Chickasaw Bayou (Sherman's attack crossed the bayou under fire: legit ford). |
| B 80-85 FAILED stamps early (sev 2) | Stamps at 85.7 / 85.95 / 86.2 on "Every attempt failed", final card 86.5. |
| B 34-38 labels early (sev 1) | "Yazoo River" + "The Yazoo swamps" on "Yazoo" 35.0; "Grand Gulf" on 38.14. |
| B 32-42 lone steamer looks like the April run (sev 1) | She rounds into the hairpin, comes under the guns and holds there (no passage of the city). |
| B 88-90 newspaper label over empty swamp (sev 1) | Pinned to the Union camps at Young's Point. |
| B 128-136 letter line 11 px, finishes late (sev 2) | `qSize` 30 (20 px at 720p), cps 56: typed by ~133.6 ("cooperation" 133.78); Grant banner leaves under the card (no half-cut banner at the edge). |
| A 96-104 banner + boxes on the river (sev 2) | Camps moved 15-25 units west onto the Louisiana bank; Grant banner at (1262, 664) then with the column head. |
| A world edges 0-5 TL, 21-60 TR, 102-136 L (sev 3) | Every key re-framed with a frustum check (corners inside the wide / vicksburg boxes): wide overview at x 1352, dist 505-545; close B keys yaw +6..+12 (camera SE of the bend), C keys yaw -12..-16, dist 36-56; plan + letter keys at x 1320-1360. |
| A 42-60 red boxes diagonal strings | Engine now draws upright boxes; the three city-line groups stand in clean rows east of the city. |
| Also | "Far below the city" label moved off the legend. |
Open: close B framing keeps the city at the right third (the vicksburg bundle ends at x 1422; a wider look would show the world edge).

## Round 3 fixes (critics round 2)
- A N6 / B N12 (cauliflower clouds 0-18, 56-64, 105-136): keepClear over the east of the map ([1495, 800, 150, 0.5]) and the lower-left corner of the plan shot.
- A N5 (arrows): every arrow at width 0.24 and inside the frame (new `tools/check_arrows.js`, 3.5 % margin: only the start of the long west-bank route
  and the ghost arrow touch 2-3 %): supply arrows from the West start/end inside, the Port Hudson pointer is the river stretch above the bottom edge,
  the stakes arrows trimmed to the frame, Grant's Canal arrow leaves before the camera pans north, Yazoo route starts in frame.
- Plan shot (104-136): camera re-framed (still inside the world box), the legend steps out at the march (103.5) so nothing exits "through the legend";
  the plan arrows step out on "Sherman" (126.0); Sherman's "go back north" ghost arrow is a short arrow from the camps, no longer under the
  "Every supply he had" label (that label ends 126.9).
- Port Hudson label ends before "Men, cattle, supplies" comes in (no stacked labels at 13.4-14.1).
- B N13: the letter row already exists in FACT_NOTES (section 2).
