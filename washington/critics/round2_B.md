# Round 2 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_round2_720.mp4` (12:53.2, -14.0 LUFS). Method: contact sheets at every round-1 spot (S01 plate/letter/Trenton
guns, S03 result + method card + plate, S04 plate, S05 label/guns/method card, S06 bridge waves + choice card + S06/S07 join, S07 Nassau Hall guns +
arrow + method card, S08 letter/subscribe/tail), 5-fps strips on the gun cues; all seq.js `T` anchors re-checked against `scene_times.py --words`
(734 anchors: 720 within 0.08 s, the other 14 listed below); a frame-level masking scan of the whole film (voice stem x0.707 vs mix-minus-voice, 100 ms
frames where the voice is active, flagged < 8 dB; single 100-ms flags with no cue nearby are treated as subtraction artefacts and ignored).

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | One line |
|---|---|---|---|
| S01 hook | 7.5 | 8.0 | Letter card now complete 51.5 -> held to 53.7; plate hidden over the flashbacks; "an icy river" voiced. New: the first Trenton gun (20.0) fires while the crossing is still on screen and masks "dawn"; volleys/booms still sit on "In about", "some" and "These". Plate still "25" over the Trenton dawn. |
| S02 background | 7.5 | 7.5 | Unchanged, clean. |
| S03 move 1 | 7.0 | 8.0 | Big result card on its words (9,000 / A FEW), method card readable ~2.4 s, plate "1776" over the colonies tail, subscribe on its word. Dive whoosh still on "Their commander, General William Howe" (-6 dB). |
| S04 retreat | 7.0 | 7.5 | Stale August plate gone. "8 Sunday · into Pennsylvania" now stays over the winter posts, Rall and the 31 December line (minor). |
| S05 move 2 | 7.5 | 7.5 | Method card held 2.2 s after it completes, "The Marblehead men" label OK. But the street fight (99.4-110) is a wall of 6 guns + 6 booms + volleys: "straight down", "The Hessians", "to form", "by cannon", "the houses", "counterattack" all at 1-5 dB. Dive whoosh still masks "main force of about two" (-6 dB). |
| S06 trap | 7.0 | 8.0 | Three short waves, guns at the bridge with visible flashes, red blocks reach the bridge, nothing after 50.1 (silence under "stopped for the night"), plate "night", banners gone before the choice card. Waves 2-3 start on the tails of "times." and "fire." (3.6 / 6.3 dB). |
| S07 move 3 | 7.5 | 8.0 | Plate continuous across the join, "3 Friday sunrise" on "third", wider Cornwallis arrow, method card on "method". New: Nassau Hall gun 84.15 sounds 0.5 s before the Nassau Hall shot fades in (no flash on screen). Washington banner peeks out under the choice card at 581.8-583. |
| S08 ending | 8.0 | 8.5 | Subscribe on its word, lower-right clear for end tiles, ~16 s clean tail. |
| **Overall** | **7.3** | **7.9** | |

**Fit to publish? NO - one short timing round away.** No structural, story or fact problem is left; what remains is cue placement (four gun/volley
groups and one plate roll). Those need scene re-renders for S01, S05, S06 and S07 (the cues draw the flashes), then an audio rebuild.

Story/structure (unchanged, still good): stakes -> one continuous push -> 2,400 at 15.9 s -> 900 + "not one killed" 24.7-29 s -> Brooklyn twist ->
trapped again -> letter -> name slam 54.6 s -> 3 snap cuts; move 1 begins 1:57.5. Three set-ups pay off (Marblehead men, covering force, the
letter). Facts as round 1; respect OK (Hessians are soldiers, no drunk-Hessian myth, the only quote is sourced).

## Round-1 items

| # | Round-1 item | Status |
|---|---|---|
| 1 | S01 plate "25" over the Brooklyn flashback / 2 Jan | FIXED (hidden 30.1-46.2, "1776 - 1777" at the snap cuts) |
| 2 | S01 letter card ~0.5 s readable | FIXED (complete 51.5, held to 53.7) |
| 3 | S01 "frozen river" | FIXED ("an icy river", 59.72) |
| 4 | S01 Trenton guns on "the Hessians at Trenton" | PARTLY: that phrase is clear now, but see N1 (gun 20.0 off-picture on "dawn"; volleys on "In about") |
| 5 | S01 orchard volleys on "strike behind it." | FIXED for "it."; NEW mask on "These" (N3) |
| 6 | S01 no dive by ~6 s | NOT FIXED (optional, sev 1; the push is continuous and starts closer now) |
| 7 | S01 NYE sub early | FIXED (sub dropped) |
| 8 | Dive whooshes mask words | Level ACCEPTED (locked kit). Placement unchanged: S01 13.9 (-1.8 dB), S03 120.5 (-6.3), S05 369.8 (-6.0) - see N6 |
| 9 | S03 move-1 result only a ledger | FIXED (big card, every part on its word) |
| 10 | S03 method card 1 < 1 s | FIXED (~2.4 s readable) |
| 11 | S03/S04 stale "30 August first light" plate | FIXED ("first light" without day, "1776" from 140.25 and in S04) |
| 12 | S03 subscribe 0.6 s early | FIXED |
| 13 | S05 "black Durham boats" | ACCEPTED (decision 15) |
| 14 | S05 method card 2 ~0.6 s | FIXED (held to 150.7, ~2.2 s complete) |
| 15 | S05 guns on "them." / "and shot at" | PARTLY: moved 0.2-0.4 s but the whole street fight still masks (N2) |
| 16 | S05 "Glover's" label | FIXED ("The Marblehead men") |
| 17 | S06 bridge wall of fire, firing after "stopped for the night" | FIXED (3 waves, nothing after 50.1); waves 2-3 clip word tails (N4) |
| 18 | S06 no assault on the bridge, guns far back | FIXED (red blocks reach the bridge with a red glow, guns at its south end) |
| 19 | S06 plate note at night | FIXED |
| 20 | S06/S07 plate ghost | FIXED (one-frame dip only) |
| 21 | S07 Nassau Hall guns on words | PARTLY: 90.4 fine; 84.15 now fires before its shot is visible (N5) |
| 22 | S07 Cornwallis arrow thin / covered | FIXED (width 0.5; card from 119.3) - the arrow runs off the top-right edge, acceptable |
| 23 | S08 subscribe 1.25 s early | FIXED |
| 24 | S08 cloud over the end-screen corner | FIXED |

## NEW findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| N1 | S01 | 20.0 / 22.0-24.4 | 20.0 / 22.0-24.4 | Gun 20.0 sounds while the crossing (2,400) is still on screen: Trenton only fades in ~20.35, so no flash is visible, and the hit masks "dawn" (-3.8 dB). Volleys 22.9/23.25 sit on "In about" (0.1 dB), volley 24.3 + boom 24.4 on "some" (0.1 dB), just before the hook's hard number. | Trenton field shots `[22.45, 26.15]` (gaps after "Trenton." 22.42 and "prisoners," 26.06) with impact delay 0.3; volleys only 22.45-22.95 and 26.1-26.5; no fire 19.9-22.4 or 23.0-26.0. | 2 |
| N2 | S05 | 99.4-110.3 | 435.9-446.8 | Street fight = 6 guns + 6 booms + volleys back to back under narration: "straight down" (-2.7 dB), "The Hessians" (3.7), "to form" (2.3), "by cannon" (4.6), "shot" (4.9), "the houses." (1.4), "counterattack" (2.8). Same problem S06 had in round 1. | Keep gun 99.45 on "fired" but give it no boom (impact delay 0 or drop `boom` 99.8); move the rest into gaps: guns 100.9, 103.55, 107.65, 108.2 (gaps 100.85-101.35, 103.51-103.91, 107.61-108.85), boom delay 0.3; volleys only 103.5-103.9 and 107.6-108.6. | 2 |
| N3 | S01 | 67.7-68.3 | 67.7-68.3 | Orchard gun 67.8 + boom 68.3 + volley 67.7 land on "These" (0.7 dB), the first word of the title line. | Drop the G3 field shot (`T.it2 + 0.4`); keep the volley, end it at `T.these - 0.4`. | 2 |
| N4 | S06 | 45.6 / 49.4 | 545.0 / 548.8 | Waves 2 and 3 start on the tails of "times." (45.45-46.07, 3.6 dB) and "fire." (49.31-49.77, 6.3 dB). (My round-1 gap times were word starts, not ends.) | `WAVE = [[43.0, 43.4], [46.1, 46.6], [49.85, 50.4]]` (stays clear of "Then" 50.53). | 1 |
| N5 | S07 | 84.15 | 665.5 | Nassau Hall gun fires 0.5 s before its shot is visible (orchard shot still up, dissolve reaches the gun ~84.7): a sound with no flash (1c). | Shot 84.15 -> 87.0 (gap "town," 86.86 -> "surrendered" 87.50); keep 90.4. | 2 |
| N6 | S01/S03/S05 | 12.95 / 2.45 / 33.0 | 12.95 / 120.0 / 369.5 | Whoosh level is accepted, but its 0.3-1.3 s body still covers "On Christmas night" (-1.8 dB), "commander, General William Howe" (-6.3) and "main force of about two" (-6.0). | Placement only: whoosh cue 12.65 (S01), 1.4 (S03), 32.25 (S05), so the body sits in the word gap; the dive itself stays. | 2 |
| N7 | S01 | 19.9-29.5 | 19.9-29.5 | Plate still reads "25 December" over the Trenton dawn battle (fought 26 Dec), on the hook's key result. | `["plaque.date", T.dawn - 0.05, {month:"December 1776", day:"", weekday:"", note:"dawn"}]` (no unspoken day; S05 still gives the 26th). | 1 |
| N8 | S07 | 0-1.7 | 581.3-583.0 | Washington banner (t0 -1) shows under the choice card, between the B box and "Tell us in the comments" (S06 removed its banners for the card). | S07 banner 1 `t0` -> the card's end + 0.1. | 1 |
| N9 | S06 | 48.5-50.6 | 548.0-550.1 | Washington banner clipped at the bottom-left frame edge during the bridge waves (only the pole and name tab show). | Hide it 40.0-51.0, or pull it 3 units north for that shot. | 1 |
| N10 | S04 | 35.2-64.7 | 306-335 | Plate "8 · Sunday · into Pennsylvania" stays over the winter posts, Rall's brigade and "the thirty-first of December". | `["plaque.date", 35.2, {month:"December 1776", day:"", weekday:"", note:""}]`. | 1 |
| N11 | S03 | 121.7 | 239.2 | Result-card header "ACROSS" appears on "About", 3.9 s before "crossed" (125.62). | `on(".c1 .sd", T.crossed2 - 0.1)`. | 1 |
| N12 | S05/S08 | S05 49.4; S08 45-48 | 385.9; 752-756 | Small 1c slips: label sub "who saved the army at Brooklyn" shows 1.1 s before "saved"; anchors `colonel2` (Rall banner 0.4 s before "Colonel"), S06 `ten` (label 0.16 s early), S08 `two` (0.2 s early); end card "26 December 1776" / plate "26" never spoken. | Sub at `T.saved - 0.05`; re-snap `colonel2` 108.85, S06 `ten` 8.24, S08 `two` 35.25. | 1 |

Anchors outside 0.08 s that drive nothing visible on screen (no action): S05 `snow` `hail` `ice` `horse` `after`, S05 `several` (escape start, fine), S06 `december` `many` `south`, S04 `lossberg` (0.09).
Levels: voice ~20 dB over the music in the quiet scenes; LUFS -14.0; no sound over cards without a visible cause apart from N5.

## Top 10 fixes

1. N1 S01 Trenton fire into the gaps (22.45, 26.15): no gun before Trenton is visible, nothing on "dawn" / "In about" / "some".
2. N2 S05 street fight: one boom-less gun on "fired", the rest in the 3 word gaps.
3. N5 S07 Nassau Hall gun 84.15 -> 87.0 (on screen, in the gap).
4. N6 whoosh cues 0.3-1 s earlier (S01 12.65, S03 1.4, S05 32.25); level unchanged.
5. N3 S01 drop the orchard field shot under "These".
6. N4 S06 waves 2-3 at 46.1 and 49.85.
7. N7 S01 plate to "dawn" (no "25") over Trenton.
8. N8 S07 banner off under the choice card.
9. N9 S06 Washington banner clipped at the frame edge.
10. N10-N12 small plate/label/anchor slips (S04 plate, S03 "ACROSS", Marblehead sub, `colonel2` / `ten` / `two`).
