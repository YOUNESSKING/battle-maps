# S01 HOOK (D 83.69 s): notes

Regions: gulf, chalmette, neworleans, horseshoe. Note: I added **neworleans** (not in SCENES.md's S01 list). The 23 Dec flash-back needs the
city and Villeré's in one frame (9 MILES ruler, the general riding into the city), and chalmette doesn't contain the city.
Scene folder 30.5 MB (engine 12 MB + 4 regions); the sequence folder is ~180 KB.
One cloud dive (gulf -> chalmette). Everything else is a hard cut (Ghent card, 3 snap cuts).

## Shot list (local times; word = what triggers it)
| t | shot / event | word |
| --- | --- | --- |
| 0.0 | gulf from altitude, British fleet (9 `ship` boats, wakes) already sailing NW toward the Cat Island anchorage; one continuous push begins | clean first frame |
| 1.49 | plate NOVEMBER 1814 | "eighteen fourteen" |
| 2.96 | tag BRITISH FLEET (follows the lead ship) | "fleet" |
| 3.92 | NEW ORLEANS | "New Orleans" |
| 6.48 | the Mississippi glows gold from its mouth up to the city; MISSISSIPPI RIVER 7.13 | "mouth of the Mississippi" |
| 8.2-10.2 | the glow runs on up the valley and off the west edge | "main way to the sea ... American West" |
| 7.95-15.1 | cloud dive 1 (v8 white-out, swap 11.75, emerge 12.6, land 15.1) onto the field below the city | lands on "eighth of January" |
| 13.97 | plate 8 JANUARY 1815 | "eighteen fifteen" |
| 13.4- | American guns fire into the British lines (every shot visible) | |
| 15.97 / 16.6 | two red arrows / British lines advance | "five thousand" |
| 16.56 | tag BRITISH REGULARS, more than 5,000 | "regulars" |
| 17.5- | the whole American line fires (smoke lines + muzzle flashes, river leg + swamp leg) | "attacked" |
| 18.05 | tag A DITCH AND A WALL OF MUD | "ditch" |
| 21.0 | the British halt short of the ditch | |
| 21.53 | plate note "about half an hour" | "half an hour" |
| 23.13 | 2,000+ ticks | "two thousand" |
| 24.06 | tag BRITISH, killed, wounded or captured | "killed" |
| 24.5-30 | the British fall back (men about-face, walk back facing the line) | "killed / captured" |
| 28.38 | 71 ticks (blue) + tag AMERICANS, killed, wounded or missing (28.88) | "seventy-one" |
| 31.47 | HARD CUT: the city, dark backdrop | "And the strangest part?" |
| 33.06-38.3 | Ghent card: TWO WEEKS EARLIER (33.26), GHENT (34.36), two wax seals GB / US (35.10), SIGNED stamp (35.83), PEACE TREATY (36.34), NOT YET RATIFIED BY AMERICA (38.30) | each on its words |
| 40.9-41.3 | the card goes, the city comes up; NEW ORLEANS 41.92 | "no one in New Orleans knew" |
| 43.62 | plate 23 DECEMBER 1814; the camera travels down the river to Villeré's | "Two weeks before the battle" |
| 47.0-52 | two red line blocks walk out of the cypress swamp; red arrow down the Villeré canal | "come out of the swamps" |
| 50.46 | ruler 9 MILES, "from the city" (Villeré -> Place d'Armes, true positions) | "nine miles" |
| 52.98 | the general's banner, NO portrait ("?" silhouette, plaque "?"), rides into the city | "The general" |
| 55.46 | tag THE GENERAL, worn down by illness | "illness" |
| 58.62 | scar card: a red sabre cut drawn across it (58.79), A BRITISH OFFICER'S SWORD (60.40), AGE 14 + "by his own account" (62.95 / 63.2); the map is lightly dimmed | "scar" / "sword" / "fourteen" |
| 64.7 | 3D gold title ANDREW JACKSON (Cinzel), centred on "Jackson" | "Andrew Jackson" |
| 65.20 | banner reveal: the Jarvis portrait, plaque JACKSON | "Jackson" |
| 66.46 | SNAP 1: Horseshoe Bend (wall across the neck, guns on Gun Hill firing at the wall x3, blue blocks on both banks around the bend, Red Stick blocks inside, Jackson banner); plate 1814 - 1815 | "trap an enemy fortress" |
| 69.88 | SNAP 2: night of 23 Dec at Lacoste's: campfires (out at 71.7), the Carolina (ship) at anchor firing 5 shots, two blue lines advance and fire, Jackson banner | "attack a British army in the dark" |
| 74.18 | SNAP 3: the mud line in the smoke (guns + volleys), the British lines close up and stop short | "stop a veteran British army" |
| 79.94 | title THREE GREATEST / TACTICAL MOVES (out 81.9) | "three" |
| 83.09 | 0.6 s dissolve into S02 (picture alive: smoke, guns) | |

## Facts (FACT_NOTES / FACTCHECK_SCRIPT)
2,000+ (return 2,037) and 71 (13 k, 39 w, 19 m) captioned "killed, wounded or captured" / "killed, wounded or missing" (FACTCHECK 6-7);
treaty caption "NOT YET RATIFIED BY AMERICA" (FACTCHECK 8); 9 miles (Latour p.95); scar "by his own account" (FACTCHECK 12 hedge, not
spoken: shown as small source text); no "Jackson" on screen before the name slam (banner "?").

## Image sources
- `jackson.png`: John Wesley Jarvis, *General Andrew Jackson*, c. 1819, Metropolitan Museum of Art (CC0), Commons
  `General_Andrew_Jackson_MET_DT2851.jpg`; head crop of the 1280 px copy, cut out with rembg `birefnet-portrait`, 400x400 RGBA.
  Master copies of all three cut-outs: `ajackson/assets/generals/` (jackson.png, pakenham.png from Thomas Heaphy 1813, PD;
  coffee.png from the TSLA engraving, PD; all three cut with birefnet-portrait, Pakenham's grey wash removed by hand). See
  `ajackson/assets/portraits/SOURCES.md`.
- `us15_flag.png`, `gb1801_union_flag.png`: copies from `ajackson/assets/flags/`.

## Troop motion (`check_troops_motion.mjs`, 0-83.69)
- chalmette: no overlaps, no pops, no shape change, screen long-side-normal <= 5 deg. Reported FAILs are expected or artefacts:
  British front-vs-velocity 180 deg from ~24.8 = the retreat (men about-face, the block walks back facing the line, by design);
  "turn" 110-400 deg/s at 69.9 and 74.2 = the hard camera cuts (the on-screen heading correction jumps with the new camera, not seen
  as a turn).
- neworleans: front-vs-velocity 21-24 deg (world) while the camera pulls back; on screen 6-7 deg (pass).
- horseshoe: static units, clean.
- Engine lesson: two moves of one unit closer than 3.2 s merge into ONE run in lineblocks mode: an advance followed by a retreat then
  flips the block 160 deg in one frame (no about-face). Keep >= 3.3 s between them. A unit that starts a run while the camera is still
  landing from a dive can flip its heading for a frame (corr): start moves after `land`.

## Open issues
- The neworleans (z10 wide) texture is soft below dist ~80; the city/villeré shots stay at dist 66-112.
- The plate shows an empty day box for month-only dates (November 1814, 1814 - 1815), as in Vicksburg.
- The 8 Jan clash shows no fog (history: fog lifting as the British closed); no engine fog device yet.
- S03/S04 use their own copies of jackson.png (an older cut); the final cut-outs are in `ajackson/assets/generals/`.
