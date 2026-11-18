# S08 Jackson (13-14 May 1863, DAY 14-15): D = 96.78 s, regions `wide` -> (cloud dive) `jackson` -> (hard cut at 54.2, section change) `wide`

troopScale: wide 11 (the closing day shot uses thick boxes `bw 1.0 / bd 0.62`), jackson 2.4. Rain = engine `VX.rain` (streaks + grey veil on a
canvas under the overlay), 0.55 -> 1.0 on "downpour" -> off by "Stars and Stripes" (FACT_NOTES 7: rain in torrents the night of the 13th and the
fore part of the 14th). Dive: push 8.8, swap 12.6, land 15.95. 7 sound cues: the dive whoosh, Wright-farm volleys (visible), the factory fire.

| t (s) | shot | on the words |
| --- | --- | --- |
| 0-12.6 | wide in the rain over Clinton - Jackson (dist 255): McPherson's corps on the Clinton road, Sherman's on the Mississippi Springs road, Johnston's force north of Jackson | plaque 14 MAY · DAY 15 · rain in torrents (0.92); two blue arrows on "two Union corps" (1.95 / 2.45); Johnston card (6.24); red columns start north on the Canton road + red arrow on "decided" (10.1); "Cannot be held" (11.0) |
| 12.6-23 | dive into `jackson` over the O. P. Wright farm: Colquitt's thin rearguard across the Clinton road, Crocker's charge (arrow, volleys both sides), the main body already marching north out of the town; pan east along the Clinton road into the town | "O. P. Wright farm" (13.85); "The rearguard" (15.75); "Away north" (16.0); plaque "afternoon, the rain stops" (17.2); the Stars and Stripes rise on a pole over the capitol on "Stars and Stripes" (18.5-20.1, then wave); "The capitol" (20.3) |
| 23-29.4 | night dissolve over the town (23.2-24.0), back to day 28.6-29.4 | plaque "night" (23.4); "Grant's bed · in the room Johnston was said to have used" (25.2) |
| 29.4-54.2 | close on the cotton factory (dist 8-11, slow yaw): Grant banner at the factory | plaque "before they left"; Sherman card on "Grant and Sherman" (30.4); "Cotton factory · still working" (31.6); quote card (37.2-44.5): "We looked on for a while to see the tent cloth which they were making roll out of the looms, with 'C. S. A.' woven in each bolt." (GM ch. XXXV); plaque "done work enough" (47.3); six workers walk out with cloth (48.5); "Sent home · with what cloth they could carry"; the factory burns on "flames" (51.85, two house fires) |
| 54.2-86.6 | hard cut to the wide map (dist 190); night dissolve on "The night before" (58.8-59.7): Johnston's force at Jackson, McPherson at Clinton, Sherman on the Mississippi Springs road | plaque 13 MAY · DAY 14 · the night before (58.97); faint red arrow west on "sent Pemberton an order" (61.35); three riders leave Jackson by three roads on "three copies" (62.8 / 63.4 / 64.0) + "Three messengers"; letter card "Johnston to Pemberton" (65.4-71.3): "If practicable, come up in his rear at once. ... Time is all-important." (typed to reach "Time is all-important" ~69.3) |
| 71-86.6 | camera follows the first rider west along the Clinton road | rider turns blue + "A Union man" on "Union man" (73.5); "Thrown out of Memphis · with great public fuss, for disloyal talk" (76.8); plaque "it was an act" (81.1); the rider reaches McPherson's lines at Clinton (83.7), blue pulse there; McPherson card (83.8); blue arrow Clinton -> Grant banner on "sent it to Grant" (85.8 / 86.2) |
| 86.6-96.78 | day again, pull back west (dist 330-352): Clinton, Raymond, Jackson corps; Pemberton's red mass at Edwards | plaque 14 MAY · the army turns west (87.0); red mass + "Pemberton's army · near Edwards" on "his enemy" (89.2); three blue arrows west toward Bolton / Edwards on "turned his army around" (91.7-92.4); "West · to meet Pemberton" (93.4); Pemberton banner on "Pemberton" (94.4) |

No new portraits (johnston, sherman, mcpherson, grant, pemberton are engine portraits). The courier is not named (FACT_NOTES 17).

Open issues
- The three riders' routes are illustrative (Clinton road, Raymond road, the road north); sources only say three messengers.
- Riders are DOM icons with a soft light halo for the night; small at dist 180 (~30 px).
- The factory site inside Jackson is not sourced: an ordinary building on the town's west side is used; the capitol flag sits on the
  town's east side near the Pearl (approximate).
- Thompson's rearguard at Lynch Creek and Sherman's battery there are not shown (off camera, so no unseen gun sounds); only the Wright farm fight.
- The rain veil is a flat 2D layer: it does not follow the terrain or the camera.

## Round 2 fixes (critics round 1 -> what was done)
| Finding | Fix |
| --- | --- |
| A/B sev 2: no troops in Jackson 30-53 | the four Union units end in the streets around the factory; at 29.0 they crossfade (same `group`) into small copies (bw 0.2) that stay in the streets, drifting, until the cut |
| A sev 2: factory not distinguishable; fire = yellow blob 1 s before the end | a long brick mill with a dark roof and a tall chimney is built at the factory (`FACTORY` in seq.js, Three.js meshes; roof chars from "factory"); fire across the building + second fire, dark smoke column (`smokeRate 9, smokeAlpha 0.6, rise 38`) from "factory" (51.9); the cut moved 54.2 -> 55.3, so the fire holds 3.4 s; camera pulled back (dist 12-15.5) to show streets, troops, building and smoke |
| B sev 2: units vanish at 20-22 | the rearguard no longer has t1 23: they leave north over the frame edge (`fade: "north"`); Crocker follows behind them and never passes through them (19-21) |
| B sev 2: Jackson stays red under the flag | Union-blue wash over the town from "flew" (19.7; lighter on the close factory shot) and on the wide day map |
| B sev 2: courier invisible, night dark and static 64-86 | rider icons 9 units / 50-76 px with a warm lamp halo; night grade 1 -> 0.72; camera frames Clinton + Grant (Mississippi Springs) at 81-86 so the blue hand-off arrow McPherson -> Grant reads |
| B sev 1: "Pemberton's army" label early | on "Pemberton" (94.32) |
| A sev 1: Johnston card + "Cannot be held" inside the white-out | card out at 10.2 (before the deck closes); plate dropped (the red columns + arrow north tell it on "decided") |
| A: world edge at the landing (top-left) | dive target / landing re-aimed (1857, 713, dist 28, tilt 44, yaw 0) inside the jackson box; Crocker's start moved off the west edge |
| A: quote dims the map | tent-cloth quote `dim: 0.4` |
`check_paths.js S08`: OK. Open: the blue wash is a DOM disc over the canvas, so on the close factory shot it tints the fire slightly.
