# S06 Cut loose (3-11 May 1863, DAY 4 -> DAY 12): D = 95.22 s, region `wide` only (no dive, no cuts)

troopScale 16. From the twist on (64.6 s, camera 360-470 units out) each blue corps swaps for a thicker copy of itself (`bw 1.0 / bd 0.62`,
same keys, same `group` so the two copies are not pushed apart); the red masses are thick from the start. No sound cues (no guns, volleys or fires).

| t (s) | shot | on the words |
| --- | --- | --- |
| 0-18.6 | wide over Grand Gulf (dist 300): Union box at Grand Gulf, McClernand at Willow Springs, McPherson at Hankinson's Ferry, Grant banner; thin pale-blue supply line Grand Gulf -> Willow Springs -> Hankinson's Ferry | plaque 3 MAY · DAY 4 · "Grand Gulf in Union hands" (0.35); "Supply line" (1.0); Banks card on "Banks" (2.94); pale arrow down the Mississippi + "Port Hudson" label on "Port Hudson" (5.7); letter card "News from Banks" on "word came" (7.38): Not at Port Hudson before the 10th of May, and then with only some 15,000 men (no quote marks: Grant's paraphrase); "A month lost" (16.0) |
| 18.6-33 | pull back north (dist 350): Pemberton's red masses appear at Vicksburg and on the Big Black on "enemy" (19.6) | Grant card (21.36); quote card "To move independently of Banks, cut loose from my base ..." (23.5-33.0, GM ch. XXXIV); the supply line fades on "cut loose" (26.1), plaque "cut loose from the base" |
| 33-43.6 | Grand Gulf (dist 230): Sherman's corps crosses from Hard Times (arrow) and marches up the one road; 11 wagons jam the road | Sherman card (33.78); "One road" (36.85); letter card "Sherman to Grant" (38.8): Stop all troops till your army is supplied with wagons: this road will be jammed, "as sure as life." (quote marks only around those words; engine `marks: false`) |
| 43.6-62.6 | inland over Rocky Springs (dist 250-220): a short wagon train, the corps move inland, cattle driven in from the plantations, 6 corn mills with turning wheels; a quick night dip 60.8-62.5 on "day and night" | plaque "hard bread, coffee, salt" (46.3); quote card "...and make the country furnish the balance." (48.75-52.2, Grant to Sherman, 9 May 1863); plaque 7 MAY · DAY 8 (52.4); "Two days' rations" (54.2); "Corn mills · turned by mules, grinding day and night" (57.9) |
| 62.6-82 | THE TWIST: pull back to Vicksburg + the army (dist 365): Pemberton banner (63.1); pale ghost arrow north to Vicksburg on "march north" (64.4), fades on "But instead" (67.8); the real blue arrow bends north-east on "turned north-east" (68.2, grows 4.8 s) and the corps follow it; pan east (dist 470) | "What Pemberton expected" (64.5); "North-east · away from the city" (68.6); red-brown railroad arrow Jackson -> Vicksburg + "The railroad · the line that fed Vicksburg" on "railroad" (71.8); "Jackson" + red pulse (73.75); "The state capital" (75.0); red arrows from east + north and the red force at Jackson on "Confederate reinforcements" (76.3-76.7); Johnston card on "Joseph Johnston" (80.3) |
| 82-95.2 | stakes (dist 440-456): Pemberton's mass edges toward Edwards, Johnston at Jackson, Grant's army between them | plaque 11 MAY · DAY 12 (82.25); "Pemberton" + "Johnston" labels on "two enemy armies" (84.9); "No supply line" (87.0); two red arrows close on the army on "joined" (90.9 / 91.3); red pulse on the army on "crushed" (92.4) |

Portrait: Nathaniel P. Banks, Library of Congress, Brady-Handy collection, "Gen. N.P. Banks" (tile.loc.gov cwpbh 01071), public domain;
cut with rembg, 400x400 like engine/assets/generals -> `banks.png`.

Open issues
- The Port Hudson arrow is mostly hidden behind the Banks letter card (it shows 5.7-7.4 only).
- Town glyphs on the wide map are red; red boxes are kept 20+ units away from them and every town in view is labelled.
- Sherman's letter wording before the quoted words is Grant's quotation of it, shown without quote marks (paraphrase status); the
  9 May date of Grant's reply comes from the letter itself (GM ch. XXXIV gives the text; FACT_NOTES section 5 lists it without a date).
- Rider/wagon/cattle/mill markers are DOM icons (engine `VX.markers`), not 3D: they do not dim under clouds.
