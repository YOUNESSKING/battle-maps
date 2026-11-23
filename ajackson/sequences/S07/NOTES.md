# S07 MOVE 3: 8 JANUARY 1815 (D 152.86 s) — sheet.jpg (23 stills)
One region: chalmette. troopScale 1.15. The opening state is S06's ending: the same `onS` / `onL` helpers, the 8 batteries at the same positions, the defenders (n 1) at S06's POS, the camera on S06's last key, now before dawn (night 0.5 -> 0 by the fog lift).

| t | shot | on screen (on its word) |
| --- | --- | --- |
| 0-4.6 | S06's frame, pre-dawn fog | plaque 8 January 1815 · before dawn; red lines fade in on the plain |
| 4.6-15 | dissolve: Villeré's | 4 barges stuck in the new cut; "collapsed canal" 8.0; 2 barges cross late, red arrow + "west bank" 9.35 |
| 15-26 | dissolve: eye level along the silent wall | Jackson banner 15.5 at Macarty's; fog |
| 26-40 | dissolve: from behind the line across the field | plaque "first light" 26.6; rocket from the wood's edge 27.0-29.1 (silent); British advance 28.5 (arrows); fog lifts 32-34.7; 500 YARDS ruler 37.15 |
| 40-56 | same, closing in | batteries 41.1-48.7 (12 shots with impacts); rank fire along the parapet + the receding leg 50.4-69 (visible flash ripples) |
| 56-70 | the ditch | main column at the ditch 63.1; NO LADDERS stamp 60.25; more guns |
| 70-83 | Pakenham | banner rides forward 70.75, out on "killed" 74.7; front lines fall back 69.3-78; labels "The main column's general · mortally wounded" 77.9, "A third general · badly wounded" 80.7 (names are not spoken, so none are shown) |
| 83-96 | the 93rd | crosses obliquely 84.4-87.2 (arrow), halts in front of the guns; label; grapeshot 89.5-94.9 + volleys |
| 96.8-107 | the river end | the river column storms the advanced redoubt 97.2-99.5 (the US company turns grey), shot down 102.7-104 (guns + volleys), driven out 105-107.4 (redoubt back to blue, column gone) |
| 107.8-114.6 | the field | all British lines back; HALF AN HOUR stamp 110.3 |
| 114.6-127 | dissolve: the west bank, seen from over the river | Morgan's two lines fire, break on "broke through" 118.4 (red arrow), red halts 122, ordered back 126; "Morgan's line" label |
| 127-143.4 | dissolve: still field, dimmed | ledger "8 January 1815 / Lambert's and Butler's returns": British 2,037 (killed, wounded or captured) 131.4 + "three generals among them" 132.8; American 71 casualties (killed, wounded or missing · both banks) 137.8; Behind the wall: 6 killed 142.6 |
| 143.6-end | method letter (S03/S05 design) | lines 1-2 typed fast, "3. Make them come to you" types on "make" 150.0 |

Facts: FACT_NOTES_neworleans.md 43-54 (rocket, fog, the 44th's ladders, Gibbs' column, Pakenham, the 93rd, Rennie at the redoubt, Lambert, the west bank, 2,037 / 71 = both banks, 6 killed on the east bank).
Checks: check_troops_motion 0-152.86: no overlaps, no pops, shape 0 %. The flags are retreats (men about-faced) and screen-space turns at the camera cuts (114.6). Two exceptions I could not explain: the 44th from 57.4 and the 93rd's oblique crossing from 83.9 are flagged front-vs-velocity ~178 deg. The screen long-side check passes for both.
Open issues: blocks are small at dist 20-30 (kept near S06's size for the dissolve); the fog puffs read as soft white blotches; the 500-yard ruler at 37.5 was not visible in the still (check it); the British 1 Jan parapet (works[2]) stays on the field.
