# S04 THE BRITISH COME (D 71.11 s) — sheet.jpg (18 stills)
Regions gulf -> neworleans (dissolve 19.95) -> chalmette (dissolve 56.35). No dive. Times local.

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-20 | gulf (starts on S03's last camera) | S03's 5 ships go on (same path, s continues); red fleet arrow from the SE to New Orleans on "Jamaica" 3.0; New Orleans 5.0; Mississippi River 8.7; Jackson banner at Mobile 10.15, "Mobile" 11.8; plaque November 1814 13.45; blue arrow + banner Mobile -> Pensacola 14.1; "Pensacola / Spanish Florida" 16.5; red unit at Pensacola 17.55, driven out 18.8; fleet arrow on to Lake Borgne 18.9 |
| 20-30.5 | New Orleans wide | plaque 1 December 1814 (Thursday) 21.0; Jackson banner into the city 22.1; "New Orleans"; a small blue unit on "few soldiers"; gold pulse on Fort Petites Coquilles on "old forts"; 4 red threat lines on "a dozen ways in" 27.25 |
| 30.5-42 | Lake Borgne | plaque 14 December (Wednesday) 31.1; 5 blue gunboat icons in line; 10 red boat icons row in 32.2+; 5 gunboat shots 33.9-36.2; gunboats turn grey 35.3-36.4 ("captured"); "Lake Borgne" 33.9; "Five gunboats captured" 35.5 |
| 42-56.35 | the city, then the bayou | Jackson banner; "Martial law" 42.7; militia blocks 44.6+; bayou glow on "bayou" 51.1; "A bayou no one had blocked" 52.1; barges + thin red route arrow up Bayou Bienvenue to the canal head 52.8 |
| 56.35-71.1 | Villeré's (chalmette, day) | plaque 23 December (Friday) late morning 56.6; barges on the Villeré canal; 3 red line blocks out of the swamp edge on "walked out" 58.75, halt in the cane fields; house pulse + "The owner's son" 64.4; the son (marker) out of the house 65.4, pirogue across the river 66.65-68.0, runs up the west bank toward the city; "To warn Jackson" 67.9 |

Sources: FACT_NOTES_neworleans.md. Approximations: the gunboat line is ~8 km west of the true Malheureux Island - Point Claire site (that site is off the neworleans map); the advance guard is shown as 3 line blocks (Thornton's ~1,600-1,800).
Checks: check_troops_motion chalmette 56-71, neworleans 20-57: no flags; gulf 0-20: the Pensacola unit's front-vs-velocity = its retreat (about-face, intended).
Open issues: gulf arrows read thin; ships are small at dist 560-860; the route arrow was thinned after the sheet (0.15). Last 0.6 s = chalmette day by the river, for S05's "chalmette by day".

## Round 1 fixes
- The first key matches S03's new last frame (gulf [590, 775], dist 640, tilt 39); ships 5.5 size.
- Lake Borgne: wider, lower camera (dist 125-135, tilt 36-37, yaw 8-10) with the north shore in frame and no world edge; gunboat icons 1.4x and British boats 1.4x; the British boats now arrive together and fire 5 visible shots (34.7-36.1, flashes + sound) while the gunboats fire; the gunboats turn grey in 0.4 s from "captured" (35.2).
- 46-52 empty map: the Bienvenue route arrow and the barges start on "wherever" (48.9).
- NOT fixed here: the flat, blurry neworleans ground is the neworleans bake (needs a re-bake); the date-plate month text size is an engine CSS value that also affects Vicksburg (left as is).
- check_troops_motion chalmette 56-71: no overlaps; gulf: no pops.

## Round 2 fixes
- 20-24 s pale void bottom-left: the New Orleans keys are now closer and flatter (CUT1 [1242, 3172] dist 190 tilt 38; 30.0 dist 215 tilt 36; 42.2 / 46.6 dist 175-180 tilt 38), so the near (south) world edge stays out of frame. Checked 20.6-44 s.
- Ships start where S03's (s0 380) end.

## Owner fix: the fleet
- Ships are no longer one nose-to-tail column. `FLEET()` (the same helper in S03, S04 and S08) gives each ship its own path: the route offset sideways, the offset drifting a little so headings differ, its own start, a speed of ±10 %, and occasional stragglers. S03/S04 use 7 ships (seed 18, spread 32, depth 70); S04 continues S03 exactly (it adds the elapsed time). S08 uses 8 ships (seed 27, spread 28, depth 60). Sizes are unchanged. All scenes were rebuilt on the re-baked worlds.
