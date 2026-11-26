# S06 MOVE 3: THE TRAP AT THE CREEK (D 82.49 s) — sheet.jpg (20 stills)
Regions jersey (z10 winter, troopScale 3.2) -> trenton (z11 winter, troopScale 1.6, dissolve 32.45). Times local.

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-11.4 | jersey, Trenton crossing | plate "December 1776" (month only: no day spoken); 3 regiments break rank onto boats on the PA bank, 7 separate boats cross, blocks land on the NJ bank; Washington banner 0.5; blue arrow on "crossed" 1.2; labels "Six more weeks" 5.8, "Ten dollars each / to stay" 8.1 |
| 11.4-32.45 | the post road Maidenhead -> Trenton | plate 2 January 1777, Thursday (12.0); Cornwallis banner 13.3; 4 red blocks down the road (halting in front of each rifle group); 5,500 on "five" 15.7; plan arrow to the river on "trap" 20.6; Hand's riflemen: G1 fires 15.8-18 (red head answers), about-faces in place, falls back 24.4-28.4; G2 fires 28.4-29.8 and again on "again" 31.0 (red answers 29.4); label "American riflemen" 26.3 |
| 32.45-55 | (dissolve) trenton dusk (night 0.3 -> 0.5) | "Trenton" 34.4; red regiments into the town 33.6-39; Washington banner south of the creek 35.7; the blue line + 2 guns SOUTH of the Assunpink behind the 2 Jan works; "Assunpink Creek" 37.9; pulse on the bridge + "stone bridge" 42.1; three assaults (36.4 / 40.6 / 44.6): walk to the creek by the bridge (red arrow), guns (3 shots each) + blue volleys + red answer, hold ~9 s while turning about, walk back; "Three attacks" on "three" 45.1; extra gun shot on "cannon" 48.3 |
| 50-60 | night (0.8), camera rises | Cornwallis banner in the town on "Cornwallis" 50.7; red campfires in the town + fields north, blue campfires along the south bank (from "night" 52.0) |
| 60-82.49 | decision card on the dimmed map | engage.decide: 2 JANUARY 1777 · YOU ARE WASHINGTON / A HOLD THE CREEK AND FIGHT (71.2) / B SLIP AWAY IN THE NIGHT (74.3), TELL US IN THE COMMENTS 76.0, ticks 76.7+; real "b" but NO reveal here (tReveal after the end): the card stays to the end, S07 shows B lighting on "He slipped away"; labels "Better trained / more troops coming" 66.7, "A river full of ice" + gold pulses on the Delaware 69.4 |

Mill Hill: the Americans are put SOUTH of the creek (the 2 Jan works polyline in the bake is on the south bank); no "Mill Hill" label.
Facts: FACT_NOTES_jersey.md E2, F1-F3, F5. Images: washington.png, cornwallis.png, flags.
Checks: check_troops_motion trenton + jersey: 0 overlaps, 0 pops; check_side_gap trenton + jersey: 0 pairs. Turn flags only at the cut (32.5) and mild (46-81 deg/s) on the landing blocks / third assault; front-vs-velocity 23-36 deg on the red regiments walking into the town while the camera moves.
Open issues: the town houses (two dense rows on King / Queen St) partly hide the red blocks in the town; campfires are small dots at dist 44-58 (size 2, glow 7); the red bridge assaults read best at 41-50 s.

## Round 1 fixes (critics A 6 / B 7.0)
- Bridge fight: three short waves in the word gaps only (43.0-43.4, 45.6-46.5, 49.4-50.3): 5 gun shots + 9 volleys in all, nothing after 50.3 (cues checked). The first attack steps onto the bridge, the other two to its mouth; each holds ~9.4 s turning about, then walks back. The guns now sit at the south end of the bridge. The bridge camera is 20 % closer.
- Red regiments in the town fade in in place (no oblique walk; trenton 0 FAIL).
- Banners out before the choice card (Washington + Cornwallis t1 59.9); the "Better trained" label (sat on the kicker) dropped.
- Plates: 2 January "dusk" (33.0) and "night" (52.0) as full plate rolls (plaque.note did not update the plate).
- "5,500" moved up/right off the smoke; jersey troopScale 3.2 -> 5.2.
- Checks: trenton 0 FAIL; jersey: turn flags only at the 32.5 cut and 46-61 deg/s on the landing blocks while the camera pans; side gap 0.

## Round 2 fixes (A 7 / B 8.0)
- Waves after the word ends: [43.0-43.4], [46.1-46.6], [49.85-50.4]; cues 43.0-50.12, nothing after 50.4.
- Red column blocks face along their own stretch of road; jersey troopScale 5.2 -> 7, landing spacing 0.032 (0 overlaps).
- Jersey clouds (lead): scatter box/n 9/med 40, diveClear 40, keepClear r 35/30 over the crossing + road targets (a cloud sat on the 0-11 s camera without it).
- Checks: trenton 0 FAIL, side gap 0; jersey r9 FvV 23 deg (13.6, camera pan), u10 at the 32.5 cut.

## Round 3 fixes (A 7 / B 8.5)
- Washington's banner on the Trenton map only from 51.0 (the dusk + bridge shots framed it off the bottom edge) until the choice card.
- `T.ten` 8.13 -> 8.24 ("Ten dollars each" label on its word).
- No negative overlay times. Checks: trenton 0 FAIL, side gap 0; jersey 5 turn-rate rows (landing blocks during the pan, the 32.5 cut).

## Round 4
- Cornwallis banner on the Trenton map enters 0.6 s later (T.stopped - 0.15), once the rising camera has it inside the frame.

## Round 5
- Cornwallis banner (Trenton) 3 u south (y 2059.4) and in at 54.2, inside the frame.
