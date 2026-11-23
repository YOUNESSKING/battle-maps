# S03 MOVE 1: HORSESHOE BEND (D 177.69 s) — sheet.jpg (24 stills)
Regions gulf (z8) + horseshoe (z11). Troops lineblocks, troopScale 1.6 (horseshoe). Times local.

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-7.35 | gulf over the bend -> cloud dive 2 (swap 4.0, land 7.35; `keys.swTo/emerge` aimed at the bend) | plaque Spring 1814 · Tohopeka |
| 7.6-20.9 | the bend, push toward the neck, back to the town | Tallapoosa River, Tohopeka (7.6); red wall pulses + "log wall" 8.74; Red Stick lines behind the wall; Red Sticks banner (plain cloth, dark-red pennant); canoes glow + label 17.04 |
| 20.9-33 | camera rises over the whole bend | wall pulses again; crossfire lines 25.2; red arrow across the river + canoe glow on "slip away" 30.3 |
| 33.4-45 | the neck from the north | plaque 27 March 1814 (34.17); Jackson's 3 lines + 2 guns walk in from Cotton Patch Hill; Jackson banner 37.0; allied inf + cav blocks 41.6; legend 44.3-59 |
| 45-59.5 | whole bend | wide blue arrow round the far bank on "back door" 49.4; allies leave west, far-bank blocks fade in 55-57; Coffee banner 52.4; canoe glows |
| 60-69.6 | close on the neck | clock 10:30 (60.7), runs to 12:30 over "two hours"; 5 gun shots 64.15-68.4 (flash, smoke, impacts on the logs); "Gun Hill" |
| 69.6-83.6 | dissolve to the toe | 3 swimmers 73.6; canoes paddled to the south bank 77.2-78.6, back loaded 79.3-80.7; allied block lands behind the town 80.7; house fires + smoke column 82.3 |
| 83.6-101 | dissolve to the neck | Jackson banner 84.4; charge on 87.56 (arrows, volleys both sides 88-92); "39th U.S. Infantry" 89.3, centre line over first (~93), flanks ~95.6; red lines about-face and fall back; "Sam Houston" 97.1 |
| 101-112.7 | inside the bend, camera rises | afternoon volleys 101-107; red lines back toward the river; far bank lined; Coffee banner 109.8 (no firing on the fleeing: respect rule) |
| 112.7-126.9 | still, dimmed map | ledger: Horseshoe Bend / About 800 Red Stick warriors killed (of about 1,000) 115.1 / ~350 women and children prisoner 120.7 / Jackson's army: 49 killed, 18 Cherokee 124.0 (154 wounded not spoken: not shown) |
| 126.9-148.6 | dissolve to the gulf | plaque Summer 1814; cession hatched red from 131.3 (approximate Royce cession 75 inside the map); letter TREATY OF FORT JACKSON 130.9, typed "some 22 million acres..." from 136.0; label "Even the allies' land" 140.8; method letter THE OLD HICKORY METHOD, typed "1. Close every door" on "close" 147.2 |
| 149-160 | gulf, toward the coast | Jackson banner Fort Jackson -> Mobile; plaque Autumn 1814 (156.6); "The whole Gulf coast" 154.7; 5 ships + red arrow from the SE on "British" 158.6 |
| 160-177.7 | drift toward New Orleans (= S04's first frame) | subscribe plate 171.0, click 172.25 ("subscribing" 171.58), out 175.6; "Next: the night attack" 174.7 |

Sources: FACT_NOTES_horseshoe.md C.17-26 (Gun Hill 80-250 yd, 10:30 cannonade ~2 h, Cherokee swim + canoes, charge ~12:30, Montgomery, Houston, 800/1,000, ~350 prisoners, 49 killed / 18 Cherokee). Portraits: jackson.png (Jarvis c.1819, Met, CC0; cut by S01), coffee.png (TSLA engraving, PD; cut here, also in ajackson/assets/generals/).
Checks: check_troops_motion horseshoe 0-127: no overlaps, no pops, shape 0 %, screen long-side <= 12 deg except the static far-bank blocks; red "front-vs-velocity" flags = the retreat (men about-faced, walking back facing north: intended); u17 turn flag at 83.7 = the camera dissolve cut (screen measure).
Open issues: frame 0 is a close gulf view (S02 must end on the same camera: gulf at [OV-10, OV+26], dist 300, tilt 36); gulf arrows render thin at dist 600-900 (width 1.2 still a hairline: wide-arrow width may be capped); the east map edge shows a sliver at the far right of the treaty shot; scene folder 25.1 MB (gulf bundle 8.7 MB).

## Round 1 fixes (critics A 5.5 / B 6.8)
- World edge / grey void (film 2:35-3:09, also the dive emergence): every horseshoe key is now at dist 22-46 with tilt 30-44, so the top of the frame stays inside the 66x48-unit world (dive `to`: dist 38, tilt 38). Sheet checked: no void in frame.
- Static start: push in on the wall on "wall of logs" (10.4), on the canoes on "Canoes" (18.6), pull back on "In other words" (25.6). The twist shot is re-aimed so the south bank, Coffee and the arrow stay in frame.
- Ledger collision: shorter rows ("About 800 killed" / note "Red Stick warriors, of about 1,000"; "About 350 prisoners" / "women and children"); nothing wraps now.
- The wall volleys now start after "Infantry" (90.5 / 90.9), so the narration is not masked.
- Gulf tail 162-177: a push-in toward New Orleans (the S04 first key matches the new end camera); ships 5.5 size (S04 the same).
- The NEXT label now reads "Next: the British come".
- NOT fixed here (world / engine): the smeared hill texture is the horseshoe bake's relief overlay (needs a re-bake, not a camera issue); the gulf blotchy texture is the gulf bake. Red Stick retreats 92-108: the engine about-faces the men, but at 720p the men are ~3 px and the plate (pale front edge) keeps facing north, so it still reads as backing away (checked the render at 5 fps). Left to the S05 author's engine check.
- check_troops_motion horseshoe 0-127: no overlaps, no pops, shape 0 %.

## Round 1 (S05-S07 author, engine retreatTurn)
- Red Stick lines: hold at the wall to 90.4-91.2 while each block turns about in place (~7 s), then ONE straight walk back toward the toe by 110.6-111.5 (no backward walk; front-vs-velocity <= 21 deg). Jackson's lines go over the wall ~1.2-2.6 s later (93.6-97.3) so nothing overlaps. check_troops_motion 0-177.69 horseshoe: 0 overlaps, 0 pops; one 49 deg/s turn (u17 @83.7).
