# S03 MOVE 1: THE NIGHT ON THE EAST RIVER (D 153.84 s) — sheet.jpg (22 stills)
Regions colonies (z9) + brooklyn (z11). Troops lineblocks, troopScale 1.6 (brooklyn) / 11 (colonies). Times local. Structure = Jackson S03.

## HAND-OVER (S02 -> S03)
S03's first key (S02's last frame must equal it): `{ region: "colonies", at: [OV[0] - 6, OV[1] + 14], dist: 300, tilt: 36, yaw: 0, fov: 30 }`
with `OV = [2489.0 / 4, 1157.0 / 4] = [622.25, 289.25]` -> **at [616.25, 303.25]**. Plate at 0.4: month-only "August 1776".
S03 -> S04: S03 ends on colonies `at [610, 264], dist 285, tilt 35, yaw 0` (S04 starts there).

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-7.35 | colonies -> cloud dive 2 (swap 4.0, `overTo` the Heights) | plate August 1776 (0.4) |
| 7.4-16.4 | the Heights from the south: works + forts, blue regiments inside, red camp line outside | Howe banner 7.5; red saps creep at the lines on "dig" 8.85 (4 steps each, "trench by trench"); 5 warships anchored at the river mouth; red arrow up the East River on "sail" 12.3; "East River" 13.0; "New York" 15.6 |
| 16.4-25 | camera rises over the sack | 9,000 (gold number) on "nine thousand" 18.35; red pulses on the saps + ships on "pull the string" 24.0 |
| 25-32 | the ships in the rain | rain veil + slanted streaks from 26.3 (NE wind); ships anchored bows NE; plate note "rain · north-east wind" 27.2 |
| 32-44 | the Heights | plate 29 August, Thursday (32.9); Washington banner on "general" 34.1; blue arrow lines -> ferry -> New York on "take" 38.6 |
| 44-59 | the ferry landing | gold pulse on "boat"; 12 rowing boats arrive one by one from up- and down-river (44.3-61), each its own path and dock; Glover's block at the landing on "regiment"; labels "Marblehead Regiment / fishermen and sailors" 51.8, "Colonel John Glover / Marblehead, Massachusetts" 55.0 |
| 59-73 | night (0.85) + rain, close on the landing | plate note "after dark · rain"; Glover's men first, then the regiments one at a time: turn, walk to the two landing stairs, break rank, stream down and vanish into the boats (escape over troop-only decks, front first); boats shuttle as separate vessels |
| 73-76.6 | the front line | "covering force" label 71.3 on the 3 blocks left in the works |
| 76.6-90.9 | (dissolve) the river at night | boats cross and recross, rough crossings bulge downstream (wind + tide); after 85.6 straighter, faster; plate note "the wind changes" 87.8, rain stops; 3 small sail craft come down from up-river from 87.4 |
| 90.9-105.3 | (dissolve) the covering force | plate note "the middle of the night"; the 3 blocks turn about and walk out 93.4-96.6, the line empty; Washington banner on the road on "met" 99.8; they turn about (~7 s) and walk back into the line from 103.8 |
| 105.3-118.3 | (dissolve) first light at the landing (night 0.5 -> 0.3) | plate 30 August, Friday, first light; Washington banner at the landing; 3 last regiments stream onto the boats ~112-115; fog from "fog" 109.9 (note "fog"); last boats leave 115.6-116.8, the banner rides boat 3 |
| 118.3-131 | (dissolve) the empty works, fog thinning | red camp walks up to the works on "walked" 119.6; Howe banner; dim + ledger: Brooklyn 29-30 August 1776 / About 9,000 men (with nearly all their guns) / Across in one night (the East River) / Left behind (a handful of stragglers) |
| 131.5-138.9 | the Heights by day | letter THE WASHINGTON METHOD (Move 1 · Brooklyn), "1. Save the army first" typed on "Save" 136.2 |
| 138.9-153.84 | (dissolve) colonies | blue block + arrow up Manhattan from "beginning" 140.2; red block at Brooklyn; subscribe plate 147.0, click on "subscribing" (148.2), out 151.6; no NEXT label |

Facts: FACT_NOTES_brooklyn.md 15 (rain, NE wind), 17 (~9,000, guns), 21 (start ~8 p.m., wind change ~11 p.m., sail boats), 22 (Mifflin blunder; Washington met them, they faced about), 23 (fog only from just before dawn), 26 (stragglers), 29.
Images: washington.png, howe.png (washington/assets/generals), grand_union_flag.png, gb1707_union_flag.png.
Checks: check_troops_motion brooklyn 0-153.84: 0 overlaps, 0 pops; turn spikes only at the three dissolve cuts (76.7, 91.0, 105.4 = camera cut frames); front-vs-velocity 20-40 deg on a few frames while the blocks funnel at the stairs. colonies: clean.

## Engine additions (backward compatible, documented in vicksburg/engine/README.md LESSONS)
`regionOpts[r].decks` (troop-only decks: the v13 break-rank stream at a landing, no mesh), unit `escape.vanish: [a, b]`, `escape.front: true`
(march front first over the deck, not a rout), boat `wake: (t, i) => bool`.

## Open issues
- **World: the colonies map has no East River** (Manhattan and Brooklyn are one land mass; Hudson only). The dive start and the tail show it. Needs a colonies `force_water` polygon + re-bake (world engineer).
- The colonies relief (Palisades) reads very bright / heavy at dist 285-300.
- Rowing boats are ~0.4 size: small at dist 30-35 (wakes carry them); the men streaming into the boats read only on the close landing shot (62-70).

## Round 1 fixes (critics A 6.5 / B 7.0)
- Result: the ledger is replaced by the big centred result card (S05/S07 recipe): BROOKLYN · 29-30 AUGUST 1776 / ACROSS 9,000 (crossed in a single night, with nearly all their guns) / LEFT BEHIND A FEW (a handful of stragglers), each on its words, card 121.5-131.0; Howe banner leaves before it.
- Method card 1: cps 30, held to 140.1 (fully readable ~3 s); the colonies dissolve moved to 140.2.
- Plates: no unspoken "30": first light = "August 1776 · first light"; month-only "1776" at the colonies dissolve (no stale August over the tail / S04).
- Night evacuation: night 0.85 -> 0.7, rain -30 %, boats 0.42 -> 0.6, the river shot 20 % closer (dist 28/26).
- Subscribe plate at "subscribing" - 0.1. Colonies troopScale 11 -> 16.
- Left: the dive whoosh over "Their commander" (assembler gain, lead); the colonies East River (world).

## Round 2 fixes (A 7 / B 8.0)
- Dive: `whooshAt 1.4` (body in the gap before "General William Howe"); `off` = S05's values (no flat cream hold).
- Evacuation: each camp regiment already faces its landing and walks straight there front first (escape t0 +6.4 s, same walk times); first regiment moved 1.4 u east (no u0 x Glover overlap); 70.9 = a dissolve to the covering force instead of a fast pan. Checker: the remaining FvV 21-41 deg rows are at/after the 70.9 cut while those blocks are off-frame.
- Result card: divider + right column now arrive with "A FEW" (no empty column); first-light plate = month-only "August 1776" (no empty day box).
- Boats have no lamps (`lamp: false`), so `lampK` n/a.

## Round 3 fixes (A 7.5 / B 8.0)
- Dive whoosh 1.4 -> 1.2 (tail off "Their"); `off.clear` 0.28 -> 0.4 (no one-frame luma snap at the dive end).
- Result card: "ACROSS" on "crossed" (125.5), not on "About".
- Negative-time check (lead): no overlay call / tween before 0.
- Checker: 8 FAIL rows, all at/after the 70.9 dissolve with the blocks off-frame (was 9).

## Round 4
- Dive whoosh back to 1.4 (1.2 covered "simple.").
