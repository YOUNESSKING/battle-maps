# FACT NOTES: Guilford Courthouse battlefield map (`guilford`, BATTLEFIELD agent)

Scenes: move2b (guilford-2..3), move2c (guilford-4..8 incl. move2-decide). Option 2 (glowing two-colour fronts, no territory fill).
Geography: `tools/make_guilford_geo.py` -> `assets/media/guilford_1781_ref.jpg` + `guilford_geo.json`; kit `scenes-src/battlefield_kit.js`
(inlined by `tools/make_battlefield_inline.py`).

## Geography (lat, lon) and sources
Sources: NPS Guilford Courthouse NMP park map + tour stops, American Battlefield Trust battle map, Babits & Howard *Long, Obstinate,
and Bloody* (memory), OSM/Nominatim checks (Hoskins House 36.1300 N 79.8524 W; park 36.1315 N 79.8436 W).
- **Great Salisbury road** (New Garden road): from New Garden (WSW, off the frame) east up a gentle slope to the courthouse; drawn from
  36.105 N 79.913 W through the Hoskins farm (36.130, -79.855) to the courthouse and on ENE. Modern New Garden Rd roughly on its line.
- **Reedy Fork road**: north / NNW from the courthouse (Greene's line of retreat toward the Troublesome Creek ironworks).
- **Courthouse** drawn at 36.1341 N 79.8374 W (approximate: the 1781 courthouse site lies in the NMP, east of the Continental line).
- **Three clearings**: (1) Hoskins farm fields (British deployment, the rail fence on their east edge), (2) a small field in the
  second-line woods, (3) the courthouse clearing with its hollow (the 3rd line on the rise at its west/centre). Woods everywhere else.
- **Rail fence** (1st line) along the east edge of the Hoskins fields, both sides of the road.
- Creeks traced from the elevation (`tools/make_rivers_dem.py guilford`, order 3 only).
- **Exaggeration:** the three lines are drawn ~105-130 map px (~400-500 m) apart (real ~300-550 yd); brackets say "~400 YARDS"
  (FACT_NOTES: Gemini "roughly 400 yards", script "a few hundred yards").
- 1781 control (option 2): no fill; one-colour blue bands for the depth lines, red band for the British line, two-colour band only where
  the sides touch (rail fence -> 2nd line -> three separate fights in the woods -> 3rd line).

## Units shown (Babits & Howard / NPS order of battle)
- British (west -> east, deployed at the Hoskins farm): right wing (south of the road) 71st Highlanders, Regiment von Bose (Hessians);
  left wing (north) 23rd (Royal Welch Fusiliers), 33rd; Guards light infantry + jägers far left; 2nd Guards battalion + Guards
  grenadiers behind the left/centre, 1st Guards battalion behind the right; Royal Artillery (McLeod's guns) on the road; Tarleton's
  Legion in reserve on the road.
- Americans: 1st line N. Carolina militia (Butler, Eaton) at the fence + Singleton's 2 six-pounders on the road; flanks: Washington's
  dragoons + Lynch's riflemen (+ Kirkwood's Delawares) north, Lee's Legion + Campbell's riflemen south; 2nd line Virginia militia
  (Stevens, Lawson) in the woods; 3rd line Continentals: Huger's 4th + 5th Virginia (north), Williams's 1st + 2nd Maryland (south).
- Woods fight: von Bose + 1st Guards drawn off south after Campbell + Lee (a separate battle) - standard accounts.
- 3rd line: the 2nd Guards broke the newly raised 2nd Maryland and took 2 guns; the 1st Maryland + Washington's dragoons cut them up
  (FACT_NOTES.md correction row). The 2 captured guns are drawn as Singleton's pair that fell back from the 1st line (memory).
- Grapeshot: **"ACCORDING TO TRADITION"** caption (FACT_NOTES.md: evidence thin; Babits & Howard doubt it).

## Cards / numbers (exactly as FACT_NOTES.md)
- Quote (guilford-4): “ONE HALF OF THE HIGHLANDERS DROPPED ON THAT SPOT” - Capt. Dugald Stuart, 71st, later letter (memory, in
  FACT_NOTES.md); script says "one British officer".
- Casualty card (guilford-8): AMERICAN 79 killed, 185 wounded, + militia gone home | BRITISH 93 killed, 413 wounded, 26 missing;
  line "BRITISH: 532 = 27 % OF THE ARMY".
- British ~2,000 counter (Cornwallis's ~1,924-2,000).
- Wounded left at the New Garden meeting house (FACT_NOTES.md, memory).

## Unsure
- The exact courthouse site and the exact line positions are approximated (no Overpass; NPS map from memory); spacing exaggerated.
- Lee vs Tarleton dawn clash location shown "near New Garden meeting house" at the SW edge of the frame (the meeting house itself is
  ~6 km WSW, off the frame).
