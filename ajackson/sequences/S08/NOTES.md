# S08 ENDING (D 79.11 s) — sheet.jpg (16 stills)
Gulf only. Fix round 1: D 79.11; final cards leave 60.4, subscribe out by ~61.4; 61.5-79.1 = the living map alone (clouds, water, slow drift); fade over the last 1.5 s. Removal shading + arrows brighter warm tan (muted, no red), arrows 0.75 wide, Cherokee label 22 px.

| t | on screen |
| --- | --- |
| 0-6.4 | the British fleet (6 ships) sails away south-east + red arrow on "slipped away" 2.1; plaque January 1815 |
| 4.9-12 | plaque 16 February 1815 (Thursday) 5.3; S01's Ghent card returns over a dimmed map at 6.8 (16 FEBRUARY 1815 / GHENT / seals / PEACE TREATY), green APPROVED stamp on "approved" 7.36, BY THE UNITED STATES SENATE |
| 12-24 | soft push onto New Orleans; Jackson banner on "Jackson" 13.3; "Indian Removal Act · signed by President Jackson" label 21.6 |
| 24-32 | wide South: remaining Creek lands (east Alabama) + Choctaw lands (Mississippi) shaded in muted brown hatching (approximate); three thin muted arrows west across the Mississippi on "forced" 25.65 (one from the Cherokee country, off the map NE); "Cherokee" label 28.9; Mississippi River label. No red, no stamps |
| 32.7-37.2 | S01's scar card callback (cut on "cut", A BRITISH OFFICER'S SWORD, AGE 14) over the dimmed map |
| 37.5-43.3 | method letter with all three lines typed on "close / strike / make" |
| 43.6-59 | engage.final: WHICH WAS HIS GREATEST MOVE? (no "tell us" header before it is spoken), cards 1 HORSESHOE BEND 1814 / 2 THE NIGHT ATTACK 1814 / 3 NEW ORLEANS 1815 on "One / Two / three", 1, 2 OR 3? 54.5, "Tell us in the comments, and which commander we should cover next" 55.3 |
| 58.7-63.4 | corner subscribe, click on "Subscribe" 60.0 |
| 59-65.6 | clean living map (clouds, water), fade from 64.4 |

Open issues: the narration runs to 61.7 s, so the map is only clean for the last ~6.5 s, not 20. YouTube end-screen elements over the last 20 s will cover the final cards; set them to start at ~58.5 s, or shorten the final paragraph. The removal shading and arrows are deliberately muted and may read too faint at 720p. The land polygons are approximate (Royce cessions). There are no sound cues (no fx).

## Round 1 fixes
- Removal: arrows 0.75 wide, warm tan, shading brighter (still muted, no red); camera pulled north (at [600, 520], dist 1100) so the hatch and the arrows sit in frame. The Creek and Choctaw hatches still reach the map's top edge (33.6 N is the gulf world's limit).
- Final cards out 60.4, subscribe out by ~61.4, clean living map 61.5-79.1 with a slow drift, fade over the last 1.5 s.
- Optional items not done: the scar callback stays over the gulf (not cut to chalmette); the end window was not extended further.

## Round 2 fixes
- None needed beyond round 1 (the remaining items are the gulf bake, and the hatch reaching the world's top edge is the map limit).

## Owner fix: the fleet
- Ships are no longer one nose-to-tail column. `FLEET()` (the same helper in S03, S04 and S08) gives each ship its own path: the route offset sideways, the offset drifting a little so headings differ, its own start, a speed of ±10 %, and occasional stragglers. S03/S04 use 7 ships (seed 18, spread 32, depth 70); S04 continues S03 exactly (it adds the elapsed time). S08 uses 8 ships (seed 27, spread 28, depth 60). Sizes are unchanged. All scenes were rebuilt on the re-baked worlds.

## Round 3 fixes
- No severity-2 items in round 3. Nothing changed.
