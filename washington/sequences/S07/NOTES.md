# S07 MOVE 3b: the night march to Princeton (D 126.74 s)

Build: `python3 vicksburg/tools/make_scene.py washington/sequences/S07`. Regions: trenton (z11, night = S06's end), jersey (z10 wide),
princeton (z11). Sheet: `sheet.jpg`. Built scene ~26 MB.

## Shot list
| t | shot |
| --- | --- |
| 0-16.6 | trenton night = S06's last camera (dist 58) pushing down to the creek; `engage.decide` (same call as S06) shown from 0, B lights on tReveal 0.3 ("He slipped away"), out at 2.0; plate 2 JANUARY night; four blue blocks turn about (stop -> about-face -> walk) and leave south into the dark from ~6.8; two blocks + two guns stay with the fires; label "About 500 men / keep the fires burning and dig" on "five hundred" (8.2); Washington banner leaves with the column |
| 16.6-31.7 | dissolve -> jersey night: British camp + fires at Trenton; the column on the Sandtown -> Quaker Bridge road (blue arrow along the back road on "back road" 19.8); note "the wind changes · hard frost" (23.6); frost veil (VX.rain veil only) spreads from "wind"; stamp THE MUD FROZE on "froze" (27.7) |
| 31.75-45.5 | dissolve -> jersey dawn: plate 3 JANUARY sunrise on "third" (33.2); the column up the Saw Mill road; "Princeton" on its word (35.9); ruler 12 MILES "behind the British army" (36.7); Mawhood's red block leaves Princeton SW on the post road + red arrow on "marching" (41.1) |
| 45.5-83.9 | dissolve -> princeton orchard: Mercer's two blocks (N) v Mawhood's two (S); Mercer initials banner (HM) on "Mercer" (47.9); British volley (51.2), bayonet charge + arrow (52.3), Mercer's men answer (53.7); banner greys + tips over on "shot" (55.45, engine `fall`); his men about-face and fall back (63-67); two militia blocks arrive behind (63.6) and halt; Washington banner rides out between the lines on "rode" (67.7); ruler 30 YARDS (72.0); both sides fire (74.4-75.6); British turn about and break NW, the Americans advance + arrow (80-83.6) |
| 83.9-91 | dissolve -> Nassau Hall: label on "college" (85.3); a gun fires twice (86.5, 88.55); the last British block greys on "door" (89.8) |
| 90.9-104.6 | centred result card (Jackson S07 recipe): British HUNDREDS / killed, wounded or captured / almost 200 taken prisoner; Americans < 100 / fewer than a hundred lost; "General Mercer died of his wounds"; "nine days later" |
| 105-126.7 | dissolve -> trenton dawn: red army facing the empty works, fires dying (American fires out on "dying"); Cornwallis banner (106.2); note "guns heard from Princeton" (110.2, no gun sound); red blocks about-face and march NE + red arrow on "rushed" (115.7); method card: lines 1-2 static, "3. Go where they are not" types on "Go" (123.3) |

## Facts
FACT_NOTES_jersey G2 (500 men, fires, digging), G3 (Sandtown / Quaker Bridge / Saw Mill route), G4 + J (the freeze), H1-H6 (Mawhood
leaving, the orchard, Mercer, Washington at ~30 yards, Nassau Hall ~194 surrendered, losses), F5 (Cornwallis at Trenton).

## Images
`mercer.png` = initials HM made like Jackson's `keane.png` (no likeness of the general); `washington.png`, `cornwallis.png`, flags from washington/assets.

## Open issues
- `engage.decide` cannot start at a negative time (a gsap child at t < 0 shifts the whole timeline): the card fades in over its first ~0.5 s at t 0, so under the 0.6 s scene dissolve the card may dip slightly from S06's frame.
- Jersey dawn (34-45): a sliver of the world edge shows in the top-right corner; Mawhood's red block on the post road is small at that distance.
- Nassau Hall shot: the British block reads small among the village houses.
- `check_troops_motion` trenton 0-126.7: turn spikes only at the camera cuts; red dawn about-face front-vs-velocity 21-25 deg; princeton 45.5-83.5: on-screen correction 27-34 deg on the oblique withdrawals, no overlaps; `check_side_gap` princeton 45.5-105: 0 / 0.
