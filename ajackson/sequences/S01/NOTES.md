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
- S03/S04 use their own copies of jackson.png (an older cut); the final cut-outs are in `ajackson/assets/generals/`.

## Polish round (coordinator)
- Fleet path moved west + slower (3.2 u/s) and the pan narrowed: the ships stay in frame until the dive push takes over.
- 8 Jan ground fog: a light canvas veil (drifting soft patches + low band, <= ~0.3 alpha) from the emergence, thinning from "five
  thousand" (15.6 s) to gone at ~20.4 s as the British reach the ditch.
- Month-only plates (November 1814, 1814 - 1815) now show the month text alone (engine `plaque.date` month-only mode, see README).

## Round 1 fixes (critics A 5.5 / B 6.8)
- 5,000+ number card (gold, ticks) on "five thousand" (15.87) + BRITISH REGULARS under it on "regulars"; the later cards (2,000+, 71)
  moved up (y 250 / 360) so they no longer cover the blocks.
- First cannon shot moved from 13.4 to 14.4 s (after the cloud has cleared; cue list now starts at gun 14.4).
- Dive 1 keeps the owner's v8 white-out (same deck, cool and warm veils); only the flat phase is trimmed by ~0.35 s:
  `dives[0].off = { emerge: 0.5, clear: 0.8, haze: 1.45 }` (v8: 0.85 / 1.15 / 1.8). The emergence fog of the close region still reads
  pale until ~13.2 s; the ground-fog veil now starts at `clear` (12.55) instead of `emerge`.
- Blocks: wide rectangles via the engine's new `depthK` (0.3, 18 files x 4 ranks; set project-wide in scene.js by the lead).
- Retreat: with the engine's `retreatTurn` (v15) the whole block turns about in place (~7 s at <= ~36 deg/s), walks back front first,
  turns back at the halt. Timing adapted: halt 20.2, turn 20.2-27.8 (under "killed, wounded or captured"), walk back 27.8-31.8 (the
  last 0.3 s after the cut). check_troops_motion: front-vs-velocity now <= 15 deg (was 180).
- Muskets start after "mud" (19.6) so "attacked a ditch and a wall of mud" stays clear; snap 3 volleys stop at 76.98, guns at 76.78
  (last boom 77.33), the British halt by ~77.8: "These are ... three greatest tactical moves" plays over a calm, smoking line.
- Ghent: the dark backdrop now fades in 0.3 s before the card (32.76), no 2 s empty dim.
- Plate: "January / 8" on "eighth" (12.42), "January 1815 / 8" on "eighteen fifteen".
- ANDREW JACKSON readable from "Andrew" (tOn + 0.5: fade 64.65-65.15).
- Open: r9 (British, wood end) shows one 40 deg heading jump at 26.7 s during its about-turn (engine v15 retreatTurn + the on-screen
  heading correction); hard-cut "turn" spikes at 69.9 / 74.2 as before.

## Owner fixes (re-voiced opening, D 79.89 s)
- Every beat re-timed to the new word times (`scene_times.py S01 --words`): T table replaced; swap 12.8 (push 9.0, emerge 13.3 on
  "eighth"), Ghent cut 32.34, card out 42.16, name slam 60.92 / 61.40, snap cuts 62.68 / 66.10 / 70.38, title "three" 76.16.
- New first-shot beats: plate WINTER 1814 on "eighteen fourteen" (1.71); WASHINGTON BURNED tag riding with the fleet on "burned"
  (3.74); NEW ORLEANS (5.66); the Mississippi glows gold from its mouth up to the city on "mouth" (7.80) and on up the valley from
  8.76; a small wax seal + PEACE TABLE on "peace" (11.40), over the closing cloud deck.
- Fleet: 9 separate ships from the S03/S04/S08 helper (copied verbatim): own path per ship (sideways offset 24 u, drifting heading),
  own speed (+-10 %), leaders and stragglers (lag up to ~80 u); no column.
- British advance now starts at 17.9 (camera lands 16.15); the halt 21.3 -> about-turn -> walk back 28.7-32.7.
- Rebuilt on the re-baked gulf / neworleans / horseshoe worlds; scene folder 34.2 MB.
- check_troops_motion 0-79.89: no overlaps, pops or shape change; front-vs-velocity <= 16 deg; screen error <= 5 deg. Remaining
  "turn" flags: 8-16 deg per 0.1 s at 15.3-15.4 while the camera is still landing from the dive (on-screen heading correction), and the
  hard-cut frames 66.1 / 70.4. The r9 40-deg jump of round 1 is gone.
- Still pale white at ~13.5-14.5 s (the v8 emergence fog, kept as the owner's look).

## Round 3 fixes (critics A 7.6 / B 8.1)
- Dive: the long cream/fog was NOT the white-out itself: on this z8 -> z10 dive the swap / emerge camera keys looked at `over` in GULF
  units inside chalmette (fog over the void) until the land key. Fixed with `dives[0].overTo` (the over point in chalmette units).
  With `off = { push -4.0, deckIn -1.0, full -0.45, ..., emerge 0.35, clear 0.5, haze 1.0, land 2.0 }` and SW 13.5 the frame is fully
  covered ~13.05-14.0 (~1.0 s, same v8 deck + cool/warm white-out), the plain is in view at 14.1 s. The chalmette stratus sheets use the
  same look on a faster timeline (`clouds.chalmette.opts` erode / deck / opacity).
- Whoosh cue (default deckIn + 0.15) now 11.95, after "peace table" (11.64).
- PEACE TABLE seal: 168 px seal + 44 px caption, on "peace" (11.35) until the deck covers (12.95): ~1.0 s in clear air, ~1.6 s on screen.
- First cannon 16.95 s (camera lands 15.5; gun list 16.95, 17.8, ...); the British advance starts 18.8 (halt 22.4, about-turn, walk
  back from 29.7) so no turn starts while the camera is landing.
- 71 card + its label leave before the hard cut (out at 31.79, faded by 32.3).
- check_troops_motion S01 chalmette: no overlaps / pops / shape change, front-vs-velocity <= 16 deg; only the hard-cut frames (66.1,
  70.4) flag "turn".
