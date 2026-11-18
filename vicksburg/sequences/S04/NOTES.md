# S04 Grand Gulf and Bruinsburg: D = 88.59 s, regions `wide` -> (cut 55.1, then cloud dive, swap 59.6) `bruinsburg`

| t (s) | Words | Shot / action | Overlays |
| --- | --- | --- | --- |
| 0-17.7 | "Now the army needed a landing ... not silence a single gun" | wide over Grand Gulf: the two forts (Fort Cobun, Fort Wade: red gun boxes) + Bowen's infantry on the bluffs, transports waiting off Hard Times; 8 gunboats come down on "Porter's gunboats" (4.65) and duel with the forts 5.5-17.6 (every shot visible: gunboat flash -> impact on the fort, fort flash -> splash at a boat); boxes of men over the transports on "ten thousand" | plaque 29 April 1863 · Wednesday · Grand Gulf (3.5); Porter card "eight gunboats" (4.65-8.3); pin Grand Gulf (6.7); label "10,000 men · waiting on the transports" (8.4); clock 8:00 -> 13:30 on "five and a half hours" (12.1-14.8); label "Not a single gun silenced" (15.8) |
| 17.85-35.1 | "That night ... found correct" | 0.8 s dissolve to night; boats + men pull back upstream; camera drifts south to Bruinsburg / Port Gibson | plaque "that night" (18.45); marker + label "A local man · comes in with news" at Disharoon's (20.6, unnamed per FACT_NOTES); label "A good landing · a few miles further down" (23.6); pin Bruinsburg (26.8); distance ruler Bruinsburg -> Port Gibson "12 MILES · a good road inland" on "road" (29.25); pin Port Gibson (30.5); plaque note "the news is found correct" (34.1) |
| 35.25-55.1 | feints | dissolve to day; Sherman's 6 boats up the Yazoo to Haynes' Bluff (37.3), 4 gunboat shots at the bluff + blue boxes landing on "show of attacking" (40.3-42.5); Pemberton banner at Vicksburg + red force + arrow north on "Pemberton" (42.0); pan east: Grierson's thin blue arrow from the north edge down the east of the state on "rode" (48.7); red boxes + arrow from Jackson east on "drawing" (52.7) | Sherman card (36.7-41.2); label "A show of attack" (40.6); legend (42.0-54.9); pins Yazoo River, Haynes' Bluff, Vicksburg, Jackson; Grierson card "a cavalry raid · 17 April - 2 May" (47.65-51.4); label "Railroads torn up · far to the east" (51.4) |
| 55.1-68.7 | "On the morning of the thirtieth ... Mississippi shore" | cut (section change) to the wide map over the crossing: a blue division + 6 boats run down from Disharoon's to Bruinsburg with an arrow; cloud dive (push 55.8, swap 59.6, land 62.95) into `bruinsburg`: transports + 2 gunboats along the bank, 4 divisions (4 boxes) + guns come ashore one after another and form on the fields; from "end of the day" the column takes the road inland (arrow 63.1) | plaque 30 April 1863 · Thursday · DAY 1 · morning (56.76); pin Bruinsburg (60.6); label "Nobody waiting · the landing is unopposed" (60.8); 3D number 17,000 on "seventeen thousand" (64.8-68.4); plaque note "DAY 1 · by the end of the day" (63.1) |
| 69.3-88.6 | the Grant quote | camera rises slowly over the landing, column moving inland, more boxes landing; Grant banner at the landing on "Grant wrote" (73.3) | quote card (69.46-87.7, dimmed map, low on screen): "I felt a degree of relief scarcely ever equalled since. … I was now in the enemy's country, with a vast river and the stronghold of Vicksburg between me and my base of supplies. But I was on dry ground on the same side of the river with the enemy." · Ulysses S. Grant · Personal Memoirs |

Cues: 29 shot cues (the Grand Gulf duel + the Yazoo show) + the dive whoosh. troopScale wide 13, bruinsburg 1.6; wide boats size 5.
Sources: FACT_NOTES section 3 (Grand Gulf 8 a.m.-1:30 p.m., eight gunboats, ~10,000 on the transports, the guide's words "a good landing ... Bruinsburg ...
a good road leading to Port Gibson some twelve miles in the interior", Sherman's feint, Grierson 17 Apr - 2 May, ~17,000 on 30 April); FACTCHECK_SCRIPT row 32
(ellipsis). No new portraits (Porter, Sherman, Grierson, Pemberton, Grant are engine portraits).

Open issues: the guns are compressed (5.5 h into 12 s); the gunboats sit as a line in front of the forts rather than circling; the wide-map Grierson arrow is
schematic (the real route ran east of the map's edge from La Grange to Baton Rouge); the night segment is dark by design; Disharoon's (geo.json) is used
for the guide marker (Grant does not say where the man came in).

## Round 2 fixes (critics round1_A / round1_B)
| Finding | Fix |
| --- | --- |
| B 20-27 guide on the Confederate bank (sev 3) | Marker + "A local man · comes in with news" at Hard Times on the Louisiana side, next to the blue transports' men. |
| A 0-15 gunboat comb + foam weir (sev 2) | Gunboats size 3 (was 5), 8.6 units apart in line (~1.4 lengths), no wake foam on the wide map; transports size 3, 7.5 apart; Yazoo + crossing boats size 3.4, no wake. |
| A 30-35 dashed road (sev 2) | `O.distance(..., { dash: false })`: a solid thin cream line (engine option). |
| A/B 69-87 quote over the banner, 16 s static (sev 2) | Three cards, one sentence each, on 69.46 / 74.39 / 82.13 (out 73.6 / 81.7 / 87.9), dim 0.45, low on screen (y 820-840) under the Grant banner; camera keeps rising, the column marches inland and boxes keep landing under them. |
| B 0-3 plaque before the date (sev 1) | Checked: the plaque appears on "twenty-ninth" (3.50); nothing at 1.0 s. |
| B 44-48 empty pan before Grierson (sev 1) | Grierson's line starts on "east" 44.81 (dur 4.5); "Jackson" pinned during the pan (44.8-48.8) and again on "drawing". |
| A 36-48 cloud cauliflowers (sev 2) | keepClear over the Haynes' Bluff / Vicksburg view and the eastward pan. |
`check_paths S04`: the landing units cross the Mississippi / Bayou Pierre mouth from the transports at Bruinsburg (legit landing, unchanged).
Open: the S04 dive still uses the default white-out (~0.9 s; `off` could shorten it like S01 if the lead wants it everywhere); the wax-seal timeline is not shown in S04 (lead's call for all scenes).
