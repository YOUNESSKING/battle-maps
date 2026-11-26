# S05 MOVE 2: Christmas night and Trenton (D 163.54 s)

Build: `python3 vicksburg/tools/make_scene.py washington/sequences/S05`. Regions: jersey (z10 wide, winter), crossing (z12, winter, night),
trenton (z11, winter), colonies (z9). Sheet: `sheet.jpg`. Built scene folder ~32 MB (4 regions; the seq folder itself < 1 MB).

## Shot list (scene time, what appears on which word)
| t | shot |
| --- | --- |
| 0-14.6 | jersey day: red posts (Trenton, Bordentown, Princeton, troopScale 8), plate "December 1776" (month only); "New Jersey" on "Jersey" (4.2); "Trenton" + red glow on "Trenton" (8.1); Rall initials banner (JR) on "Colonel" (11.5); red stamp NO FORTIFICATIONS on "fortifications" (13.0) |
| 14.9-30.7 | camera turns to the river (yaw -60), dusk falls; Washington banner at McConkey's on "Washington" (20.2); plate 25 DECEMBER on "Christmas night" (25.9); "Delaware River" on "river" (25.4); three blue crossing arrows on "three places" (27.1/27.4/27.7); main arrow to Trenton on "attack" (28.5) |
| 30.75-37.9 | cloud dive 3 jersey -> crossing (default dive offsets, `overTo` = crossing units), night 0.85 |
| 37.9-68.4 | the crossing: blue blocks on the PA bank break rank and stream onto separate Durham boats at three landings (each its own deck, queue, boat, schedule); boats shuttle with lamps + wakes, cargo (men) visible only when loaded; 3 more Durham boats on their own lanes; 2 ferry flats with a gun + horses; NJ: boatloads come off at Johnson's and walk to the assembly ground, guns come off the flats one by one; "McConkey's Ferry" (37.7); "Durham boats" label on "Durham" (43.0, follows a boat); "Glover's Marblehead men" on "Marblehead" (49.4, follows a boat); "Delaware River" (46.2); storm from "Around eleven": `VX.rain` sleet + grey veil, clock 23:00 (53.0); clock 3:00 (63.2); 18 GUNS on "eighteen" (66.5) |
| 68.4-88.0 | dissolve -> jersey night storm: "hours behind schedule" note; grey arrows stop at the river on "downriver"/"other" (70.8/71.6); Washington banner at Johnson's on "Washington" (74.6); 4 blue blocks march on the Bear Tavern road (77.3); ruler 9 MILES on "nine miles" (77.9); "Trenton"; "Birmingham" on "crossroads" (82.0); split arrows (Greene / Sullivan) on "split" (83.4) |
| 88.0-95.4 | dissolve -> trenton grey dawn (snow continues): clock 8:00 (88.5); plate 26 DECEMBER (90.6); the Pennington road picket fires (92.5), Greene's blocks answer (93.3); Washington banner on "burst" |
| 95.4-108.5 | dissolve -> the head of the town: Knox's two guns race to the head of King + Queen St (arrow on "raced"), 6 shots down both streets (flash + impact in the street) 99.45-107.0; two Hessian blocks form in the streets (101.3), fire (103.5), are raked, leave the streets east |
| 108.5-118.6 | Rall banner on "Colonel Rall" (108.7), counterattack arrow (109.8), banner greys and tips over on "shot" (110.8, engine `fall`); the Hessians end in the orchard east of town, three blue blocks close the ring, one volley each (116.4-116.7), blocks grey on "laid down" (117.4) |
| 118.65-127.7 | dissolve -> the Assunpink bridge: one red block breaks rank and streams over the bridge and up the road (escape over the region bridge) from 119.5; a blue block closes the north end on "closed" (124.6); the last red block greys on "trapped" (126.4); "Assunpink Creek" on "creek" (122.0) |
| 127.5-141.8 | centred result card (Jackson S07 recipe): Hessians 900 / about 900 captured / more than 100 killed or wounded; Americans NONE / killed in the battle / a handful wounded; "Among the wounded: James Monroe"; map dimmed |
| 142.4-149.0 | method card (Jackson letter recipe): "1. Save the army first" static, "2. Hit them where they rest" types on "hit" (147.0) |
| 149.0-163.5 | dissolve -> colonies: "New York" (152.1), Cornwallis banner (153.8), red arrow New York -> New Brunswick -> Princeton -> Trenton on "racing" (158.6), "Trenton" (159.2) |

## Facts
FACT_NOTES_jersey B1-B4 (posts, no earthworks, picket), C1-C7 (three crossings, 2,400 men, storm ~11 p.m., Durham boats + flats, 18 guns,
Glover's 14th Continental, 9 miles, Birmingham split), D1-D4 (guns at the head of King/Queen, Rall, ~900 captured, 22 killed + 83-92
wounded = "more than 100", 0 Americans killed in the fight, 5 wounded incl. Monroe). Weather: storm from ~11 p.m. through the battle.

## Engine changes (backward-compatible, documented in vicksburg/engine/README.md LESSONS)
- `scene.js` boats: kinds `durham` (long dark Durham boat, pale gunwale, oars + pole, cargo of standing blue men) and `flat` (ferry flat with a gun + 2 horses);
  `B.load(t, i)` shows / hides the cargo; `B.wl` = water level in metres (hull floats on the water plane, not on the river bed).
- `scene.js` banners: `fall: t` = the banner greys and tips over (~0.9 s) from t (a general falls).
- Uses the S03 author's `regionOpts[r].decks` (virtual landing piers) + `escape.vanish` for the boarding streams.

## Images
`washington.png`, `cornwallis.png` = `washington/assets/generals/`; `rall.png` = initials JR made like Jackson's `keane.png` (DejaVu Serif Bold, gold);
flags from `washington/assets/flags/`.

## Open issues
- Durham boats read mostly by lamp + wake at 720p at night (hulls are small, dark on dark water).
- The NJ boatloads fade in as blocks at the landing and walk up (no reverse stream off the boat).
- Jersey wide: town house clusters (Maidenhead, Pennington, Birmingham...) still read a little like crosses from far away; the 7 bridge meshes are hidden.
- Cadwalader's grey arrow is drawn on the river below Trenton (Bristol is outside the jersey box).
- `check_troops_motion` trenton/crossing: remaining flags = turn spikes at the cuts (95.4, 118.65) and world front-vs-velocity 30-45 deg on oblique moves (on-screen correction); the boarding blocks report ~160 deg (men about-face, plate stays, as the bridge streams); 0 opposing-block overlaps (`check_side_gap` 88-128: 0 / 0).

## Round 1 fixes (critics A 5.8 / B 7.3)
- Night march (68.4-88): two WIDE line blocks side by side (4.6 u apart, n 1, troopScale 8) Johnson's Ferry -> Birmingham long side first, stop, turn, then each walks under its own arrow (Greene east, Sullivan south); night 0.8 -> 0.6 (brighter units). Jersey check 68-88: 0 overlaps, max 20 deg.
- Crossing: boarding blocks face the river and walk FRONT FIRST into the stream (`escape.front`, no backward walk: 23-33 deg, was 148-176); Durham boats x1.5 (size 0.75) with half-size lamp glow (new boat `lampK`); camera 15 % closer. Floes are world data (not touched).
- Dive: `off { warm 0.05, emerge 0.1, clear 0.28, haze 0.85 }` (shorter flat grey).
- Trenton: Greene's blocks walk straight down past the WEST side of the ring wood, facing the way they walk (no wheel into the wood); guns moved off words (100.95, 106.0).
- Method card 2: held to 150.7 (T.letgo), colonies cut moved 149.0 -> 150.8. Label "The Marblehead men / who saved the army at Brooklyn". `plaque.note` calls (which do not update the plate) replaced with `plaque.date` notes.
- Remaining: front-vs-velocity 40-60 deg (world) on the Trenton approach after the 95.4 cut = engine on-screen correction under the oblique camera (screen long-side <= 13 deg); NJ landing blocks still fade in formed. "black Durham boats" voice kept (lead).

## Round 2 fixes (critics A 7.0 / B 7.9)
- Night march: troopScale 12, both wide blocks walk <= 2 u/s (10.6 u to the split, then 6.4 u each along its own arrow; the arrows carry the distance), night 0.6 -> 0.45, camera ~20 % closer on 80-88. Check 68-88: no pops, no overlaps (only the halt turn at the 88.0 cut).
- Street fight (99-110): gun 99.45 on "fired" with no boom; the rest at 100.9, 103.55, 107.65, 108.2 (boom +0.3, in the word gaps); Hessian volleys 103.5-103.9, Sullivan's 107.75-108.6.
- Dive whoosh cue at 32.25 (`dives[].whooshAt`, look unchanged).
- NJ landing: boatloads and guns walk straight up the bank along their facing (no along-bank component). The motion check still reports 44-55 deg world front-vs-velocity there, but on screen the blocks stay within 17 deg: this is the engine's on-screen correction under the oblique camera, not a crab walk.
- Assunpink escape walks front first (faces the bridge, `escape.front`): 37 deg (was 145).
- Ferry flats lamp glow halved (`lampK` 0.5); Marblehead label at 50.5 (on "saved"); Rall banner anchor 108.85.
- Trenton approach camera shifted west (ring wood toward the frame edge; the wood itself is world data). Greene's three blocks walk parallel paths (no crossing).
