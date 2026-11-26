# S01 HOOK (D 74.04 s): notes (author A)

Regions: colonies (z9 wide), crossing (z12, winter, night), trenton (z11, winter), brooklyn (z11, night snap), princeton (z11, winter).
Structure, cards, dive profile (`DOFF` = Jackson S01 round 3), title, banner reveal, snap-cut recipe copied from `ajackson/sequences/S01`.
One cloud dive (colonies -> crossing, `overTo` in crossing units). Dissolves (0.9 s) at 19.9, 39.5, 46.2; hard cuts at 30.06 and the snaps.
Scene folder 33 MB (5 regions; Jackson S01 was 34 MB with 4). Sequence folder < 1 MB.

## Shot list (local times; word = what triggers it)
| t | shot / event | word |
| --- | --- | --- |
| 0.0 | colonies from altitude (dist 420), winter grade as Jackson; red lines already walking into their posts (Trenton, Bordentown, Princeton, New Brunswick, Perth Amboy), two blue lines walking up to the PA bank, separate boats pulled down the Delaware | clean first frame |
| 1.65 | plate DECEMBER 1776 (month-only) | "seventeen seventy-six" |
| 6.48 | tag NEW YEAR'S EVE / most of the army can go home (at the blue army) | "On New Year's Eve" |
| 10.5-14.5 | dive push onto McConkey's Ferry; night creeps in (0.15 -> 0.35) | |
| 12.6 | the Delaware glows gold down to the ferry + DELAWARE RIVER (italic) | "Delaware" |
| 13.9 | plate DECEMBER 1776 / 25 | "Christmas night" |
| 14.05-15.0 | white-out (Jackson profile, ~1 s) -> crossing at night (NI 0.85), sleet streaks (`VX.rain` 0.8), ice floes, shore ice | |
| 15.0-19.9 | 7 separate Durham boats (barge + lantern, own lane / speed / start, 2 coming back), blue lines waiting on the PA bank (one walks down to the water), a gun, a line landed on the NJ bank walking up | |
| 15.86 | 2,400 (gold number, counts in hundreds) | "two thousand four hundred" |
| 19.9 | dissolve: Trenton grey dawn (night 0.22, sleet 0.45: FACT_NOTES_jersey C3 / table: sleet through the battle) | "At dawn" |
| 20.4-23.8 | Greene's line down the Pennington road, Sullivan's down the River road, a third line closes the Princeton road; Knox's guns at the head of King/Queen St fire down the streets (20.7, 21.7, 22.8, 23.7, 24.4); musket volleys 22.0-24.6 | "fell on the Hessians" |
| 21.3 | tag HESSIANS; three red lines spill out of the town east toward the Princeton road and halt | "Hessians" |
| 21.9 | TRENTON | "Trenton" |
| 24.64 | 900 (gold, counts); the red lines turn grey (captured) 25.5-25.8 | "nine hundred" / "prisoners" |
| 25.6 / 26.76 | HESSIAN PRISONERS / NOT ONE AMERICAN KILLED, in the fight | "prisoners" / "not one American" |
| 30.06 | HARD CUT: colonies, summer light: blue at Brooklyn, red lines closing from Long Island, British ships in the Upper Bay; plate unchanged | "And the strangest part?" |
| 34.7 | three red arrows close the ring on the Heights | "trapped" |
| 36.2 / 36.74 | gold pulse on the Heights / BROOKLYN | "hill" / "Brooklyn" |
| 37.7 | the East River glows behind the Heights | "a river at its back" |
| 39.5 | dissolve: Trenton by day (2 Jan): three red lines down the Princeton road (+ red arrow on "British army" 43.1, tag BRITISH ARMY), three blue lines settle behind the Assunpink line | "a week after Trenton" |
| 41.6 | the stone bridge pulses gold | "trapped again" |
| 44.74 | DELAWARE RIVER (italic) | "the river behind" |
| 46.2 | dissolve: colonies over the PA bank (McConkey's) | "A week before Christmas" |
| 48.3 | the general's banner, NO portrait ("?" silhouette, plaque "?") | "its general" |
| 49.4-52.5 | map dimmed; letter card (Jackson `letter` recipe): A WEEK BEFORE CHRISTMAS / TO HIS BROTHER; "I think the game is pretty near up." typed from 50.5 (cps 24); no date line | "brother" / "I think..." |
| 53.8-55.2 | 3D gold GEORGE WASHINGTON (Cinzel), portrait revealed on the banner (Peale 1776, plaque WASHINGTON) at 54.22 | "George Washington" |
| 55.46 | SNAP 1: brooklyn night: 9 separate boats (1 sloop) shuttling Brooklyn ferry <-> Peck Slip, blue line at the landing, Washington banner; plate 1776 - 1777 | "He would steal his army" |
| 58.81 | SNAP 2: the Delaware in the storm (sleet, ice, 7 separate boats), blue lines on both banks, banner on the NJ bank | "cross a frozen river" |
| 63.64 | SNAP 3: Princeton orchard, clear cold day: red (Mawhood) and blue (Mercer) lines firing, a gun, smoke, banner; quiet from 68.0 | "slip away" |
| 70.24 | THREE GREATEST / TACTICAL MOVES (out 72.2) | "three" |
| 73.44 | 0.6 s dissolve into S02 (map alive) | |

## Facts
2,400 (FACT_NOTES_jersey C1/C4), "about nine hundred" prisoners (D table, HEDGE), no American killed in the fight (spoken; card says "in the fight"),
sleet at dawn (C3 + weather table), letter quote = the 5-word core + "I think" exactly as FACT_NOTES A2 ("I think the game is pretty near up.").
No Washington name or portrait before "His name was George Washington".

## Image sources
`washington.png` = `washington/assets/generals/washington.png` (Charles Willson Peale 1776, Brooklyn Museum, see `washington/assets/portraits/SOURCES.md`);
flags copied from `washington/assets/flags/` (Grand Union, 1707 Union Flag - unused here, kept for consistency).

## Troop motion (`check_troops_motion.mjs`, 0-74.04)
- colonies, trenton, brooklyn, princeton: no overlaps, no pops, no shape change, screen long-side-normal <= 15 deg.
- crossing: world front-vs-velocity 20-37 deg on the NJ landing line (u3/u7) and the PA line's short walk; on screen 7-11 deg (the engine's
  on-screen heading correction, as Jackson S01 neworleans); u0 16 deg on screen for 2 frames at the end of its 1.3-unit walk. Accepted.
- Hard cuts / dissolves show as "turn" spikes at the cut frame only.

## Open issues
- The colonies world is summer-baked: the winter opening (0-14 s) and F (46-55 s) look green; grade kept = Jackson (as asked).
- E (39.5-46 s): the red lines at the top of the frame are small at dist 51-56; the arrow + BRITISH ARMY tag carry the beat.
- Boats show big dotted wakes at night (engine wake look); Durham boats are drawn at ~2x true size for readability.
- `VX.rain` streaks are a 2D canvas: during the 19.9 dissolve the streak density drops at the cut (0.8 -> 0.45) rather than crossfading.
- Brooklyn ferry points: the research landing points lie in the river; boats use the 1776 waterline (2479.4, 1146.4) / (2467.6, 1131.6).
