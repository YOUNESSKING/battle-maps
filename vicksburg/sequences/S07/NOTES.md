# S07 Raymond (12 May 1863, DAY 13): D = 52.42 s, regions `wide` -> `raymond` (cloud dive) -> `wide` (hard cut on the section change)

| t (s) | Words | Shot / action | Overlays |
| --- | --- | --- | --- |
| 0-4.2 | "On the twelfth of May, outside the little town of Raymond" | wide over Raymond (dist 250); McPherson's column (1 big box) coming up from the south-west | plaque 12 May 1863 · Tuesday · DAY 13 · hot and dusty (0.93); "Raymond" pin (3.33) |
| 4.2-11.35 | "a Confederate brigade lay in wait along a creek" | Gregg's brigade appears at the creek on "brigade" (4.6); cloud dive (push 4.2, swap 8.0, land 11.35) into `raymond` | "Fourteenmile Creek" (river, 9.0-12.6) |
| 9-14 | "Its commander, John Gregg ... a single brigade on the road" | close, looking north-east: Gregg (2 + 1 boxes + 1 gun) on the high ground north of the creek; ONE blue brigade comes up the Utica road on "single brigade" (11.67) | Gregg card (9.35-13.7); label "A single brigade? · what Gregg had been told" (11.7) |
| 14.2-19.7 | "In fact it was most of James McPherson's corps, several times his strength" | more brigades + Crocker's division (4 boxes) + guns march up the road under a dust cloud; Logan's division deploys south of the creek | McPherson card (15.59-19.4); label "Several times his strength" (17.43) |
| 19.8-35 | "Gregg attacked anyway. For hours the fight swayed ... smoke and dust ... the weight of McPherson's corps told" | red arrows across the creek (19.8), Gregg's men cross, Logan's lines bend back (24-25), hold, the fight sways twice (28-31) with volleys in the creek woods and both batteries firing; on "weight" (32.8) three blue arrows, the whole Union line fires and pushes over the creek | label "Gregg attacks · across the creek" (19.9); plaque note "smoke and dust" (21.7) |
| 35-39 | "Gregg fell back through Raymond, toward Jackson" | red boxes peel off as a road column up the Utica road; red arrow to Raymond (35.7), second arrow out of Raymond east on the Jackson road on "Jackson" (37.7); camera pans to the town | "Raymond" pin (36.6) |
| 39-52.42 | "It was a small battle ... First Jackson. Then Vicksburg." | hard cut (39.0) to the wide map: McPherson at Raymond, the rest of Grant's army south-west, Pemberton near Edwards, Gregg falling back east; on "gathering" (44.5) red arrows into Jackson + red force there; Jackson pulses red from "Jackson" (45.17); blue arrow Raymond -> Jackson on "First Jackson" (48.35); pull back west to Vicksburg, blue arrow Jackson -> Vicksburg along the railroad on "Then Vicksburg" (49.8) | ledger Raymond · Union loss 66 killed / 339 wounded / 39 missing (39.7-41.0, hidden 44.2); pins Jackson (45.17), Vicksburg (49.89) |

Cues: 49 (volleys, guns + impacts, the dive whoosh). The dust is smoke-only (no cue).
The Jackson pulse is a DOM disc in the `#pins` layer, positioned each frame with `world.projectMap` from `SEQ.draw` (pure function of t).
(An fx `custom` glow sprite did not show on the wide map; not investigated further.)

Sources: FACT_NOTES section 6 (Logan leading, Crocker behind, Gregg told one brigade, 7th Texas + 3rd Tennessee across the creek, smoke and
dust, retreat through Raymond); ledger = Grant's table (66 / 339 / 39). Portrait: John Gregg, Library of Congress cph 3c34003 (public domain),
cut out with rembg + a soft oval matte (pale original) -> `gregg.png`.

Open issues: wide-map boxes are small at dist 270-600 (troopScale 15); the 1st Tennessee bluff is not shown; Union units on the wide map
other than McPherson's are approximate (Sherman near Dillon's, McClernand toward Edwards) and unlabelled.

## Round 2 fixes (critics round 1 -> what was done)
| Finding | Fix |
| --- | --- |
| B sev 2: "several times his strength" not shown | Union now 19 boxes vs Gregg's 5: Logan 3 x 3, Crocker 4 + 3, 2 guns, arriving one after another under the road dust (13.0-20.4); label "Several times his strength" over Crocker's rear body on its word |
| A/B sev 2: arrows + boxes cross Fourteenmile Creek with no bridge | the creek stays between the lines: Gregg attacks down to the north bank, Logan holds the south bank; all arrows stop at the banks; after Gregg has gone, Logan's lead brigades march as road columns over the road bridge (36.0 / 37.6); `check_paths.js S07`: OK |
| A/B sev 2: label at 13 s points at a unit below the frame; world edge bottom-right | every close camera key re-aimed so all four corners stay inside the raymond box (south edge y 798: tilt 36-42, yaw -10..-14, checked with a frustum-corner script); the leading brigade is on the road mid-frame at 11.7 and the label sits on it |
| B sev 2: Gregg's boxes vanish 36-38 (covered by the retreat arrow) | the retreat arrows run 1.7 units beside the road, so the column stays visible all the way into Raymond; the cut frames Raymond (36.6) |
| B sev 1: plaque "hot and dusty" | "DAY 13 · dusty" |
| A: boxes tiny, cotton smoke | troopScale close 1.45 -> 1.9, wide 15 -> 20; battalion curtains as S05; gun plumes 0.6 |

## Round 3 fixes (critics round2_A + round2_B)
- Smoke puffs 24-33 (A, sev 2) -> battalion curtains (same settings as S05), each seated just in front of its line on its own bank (red curtains
  between Gregg's boxes and the creek, Union curtains between Logan / Crocker and the creek), never on the boxes: the Union step-ups at 33-35
  now stop short of their curtains (U1b 786.7, U2b 789.95, U3 788.7).
- Arrow width / creek 33-36 (A, sev 2): the three "weight of the corps" arrows are short (width 0.2) pushes from just in front of each line to
  the south bank of Fourteenmile Creek (creek points checked), gone (34.5-34.8) before the boxes step up: no arrowhead on its own box, none from
  off-frame.
- Arrows in the 6 % frame: Gregg's retreat arrow fades at 38.0 before the camera leaves its tail; the two reinforcement arrows into Jackson
  shortened and fade at 47.4 / 47.6 before the pull-back; wide keys 39-46 a little wider (dist 318) so McPherson at Raymond and Jackson's
  arrows sit inside; "rest of the army" unit nudged inside the left edge.
- Legend steps out 34.9-44.6 (Union boxes crossing under its corner, then the ledger).
- 35.6 key 1 unit south: the south line stays in frame while Gregg leaves.
- Dive (engine short white-out, boxes hidden in the deck): checked 7.6 / 8.1 / 8.4 / 9.0: fine.
- Checks: check_paths OK, check_edges OK, check_escapes as round 2, arrows inside 6 %.
