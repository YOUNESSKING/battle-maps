# S05 Port Gibson (1 May 1863, DAY 2): D = 65.30 s, region `portgibson` only

Camera looks EAST along the two ridge roads all scene (yaw -66 -> -86 -> -75, so north = screen left, the town at the top);
no cuts. Night grade 0-19.6 s (camera keys `night: 1` + `film.grade night`), 0.8 s dissolve to day at 19.6-20.4 (sentence gap).

| t (s) | Words | Shot / action | Overlays |
| --- | --- | --- | --- |
| 0-8.6 | "They marched through the night ... farmhouse ... pickets" | night, low over the Bruinsburg road: the Union column (single boxes nose to tail) reaches the Shaifer house; a red picket box fires (2 small volleys 7.7 / 8.2) | plaque 30 April · DAY 1 · night march (0.4) -> 1 May · Friday · DAY 2 · after midnight on "midnight" (2.96); "Shaifer house" pin on "farmhouse" (4.1); label "First shots" on "pickets" (7.6) |
| 8.6-19.4 | "John Bowen, rushed down from Grand Gulf ... seven or eight thousand ... twice their size" | camera drifts east over the ridges: Bowen's division astride both roads (Green at Magnolia Church on the Rodney road, Tracy on the Bruinsburg road, 1 gun each); red arrow down from the Grand Gulf road (12.58) | Bowen card on "John Bowen" (11.22-14.7); label "7,000 - 8,000 men" (15.18); label "More than twice their size" on the Union deployment (18.58) |
| 19.6-35 | "But the ground was on Bowen's side ... ridge tops" | dawn; slow push along the ridges, Union divisions deployed at the fork | legend (20.8); pins Bruinsburg Road / Rodney Road on "Two roads" (23.6/24.0); "Port Gibson" on "town" (26.3); label "Ravines · choked with cane and vines" (28.2); two blue arrows along the ridge roads on "only come at him along the ridge tops" (31.7 / 32.3) |
| 35.5-46.6 | "All day ... held, counterattacked, and held again ... late afternoon, pressed on both ridges" | Hovey + Carr (Rodney road, 4 boxes each), A. J. Smith behind, Osterhaus (Bruinsburg road) advance in steps with smoke curtains per halt and gun flashes (3 batteries); Cockrell + Baldwin come up, counterattack on "counterattacked" (40.76: red arrows, blue lines recoil), lines hold (41.9); Logan's brigade (J. E. Smith) turns the north flank on "pressed" (44.8, blue arrow on a third ridge) | plaque note DAY 2 · morning (35.5) / late afternoon (43.3); label "Counterattack · Bowen strikes back" (40.8); label "The flank turned" (45.1) |
| 46.6-52.4 | "fell back through Port Gibson and burned the bridges over the bayou" | all red units peel off as road columns: south group through the town and over the South Fork bridge (bridge 0) north-east, north group through the town and up the Grand Gulf road (gm6) over bridge 2; camera follows to the town; bridge 0 fire on "burned" (49.24, collapses 52.4) | label "Bridges burned" (49.3) |
| 52.4-65.3 | "Grant lost about eight hundred and seventy men ... the whole campaign" | Union lines follow toward the town, Grant banner on "Grant" (52.6); bridge 2 fired behind the last column (55.4); blue arrow through the town onto the road north-east on "The road inland was open" (56.0); slow pull back to the end (no fade: dissolve at assembly) | ledger Port Gibson · Union loss: 131 killed / 719 wounded / 25 missing (53.4-54.3), final "About 870 men lost" (54.8), hidden 58.2; label "The road inland is open" (56.1) |

Units: Union 4 divisions x 4 boxes + 2-box brigade + 2 x 2 guns; Bowen 4 brigades (2+2+2+1 boxes) + 2 guns. troopScale 1.45.
Cues: 59 (volleys + guns + 2 bridge fires), all on screen.

Sources: positions FACT_NOTES section 4 + portgibson region roads (geo.json). Portrait: John S. Bowen, Brady studio, Library of Congress
cwpb-07423 (public domain), cut out with rembg (isnet), 400x400 RGBA -> `bowen.png`.

Open issues: the night shot is dark (by design; red boxes at Magnolia Church are small at night); "Bridges burned" label appears while only
the first bridge burns (the second burns at 55.4, behind the last column, so no boxes cross a burnt bridge); the "Bayou Pierre" pin names the
South Fork (Little Bayou Pierre) generically.

## Round 2 fixes (critics round 1 -> what was done)
| Finding | Fix |
| --- | --- |
| B sev 3: Union lines stretch across the ravines ("only along the ridge tops") | Union now stands as COLUMNS ON THE TWO RIDGE ROADS: Rodney road 6 rows x 2 boxes (Hovey, Carr, A. J. Smith), Bruinsburg road 3 rows x 2 (Osterhaus), each row keyed on the road with a lag; the ravines stay empty; guns on the ridge behind the column heads |
| B/A: red line tiny and few; night boxes small | troopScale 1.45 -> 1.9; Green and Tracy 3 boxes astride each road, Baldwin 2, Cockrell 2, 1 gun per road; night camera 15-20 % closer (dist 25/24/32) |
| A/B sev 2: red/blue interleaved at 47-49 | Bowen's whole line leaves at 46.2 (was 46.66 / 49.3 for Tracy) at v 4.2; Osterhaus follows 2 s later and slower; Logan's brigade moved 1 unit north and behind; >= 1 box depth between the sides at all times |
| A/B sev 2: "road inland is open" arrow crosses the burning bridge | Arrow ends on the town's bank (1307.8, 1018.1), short of the South Fork bridge; label moved beside the town |
| Bridges: only one burned / burn not on its word | Bridge 2 (Grand Gulf road, unused by any unit) fires on "burned" (49.24); bridge 0 at 53.4, after the last red column is over (checked on stills) |
| A sev 1: "Over the bayou" plate over the Port Gibson name | second "Port Gibson" pin ends at 50.06; plate on its words "over the bayou" (50.1-53.4), anchored north of bridge 2; river pin renamed "Little Bayou Pierre" (the South Fork), 50.3-53.6 |
| B sev 2: unspoken "The flank turned" label | now "Pressed on both ridges · Logan's brigade on a third ridge, north of the road" on "pressed" (45.0) |
| A sev 2: cotton-ball smoke | v8-style battalion curtains on the 2-box fronts (`size 0.75, rate 4, height 0.5, cluster [0.9, 0.5]`), gun plumes `size 0.6`, impacts 0.45 |
| A: world edge top-right 57-65 | end keys lower (tilt 50 -> 46, dist 37) |
| A sev 1: blue boxes cut at 40 s | ridge columns sit higher in frame; blue arrows start 6 units up the roads |
`node tools/check_paths.js S05`: OK. Open: the deployed columns bunch near the fork for ~2 s at the night -> dawn dissolve (19-21 s).
