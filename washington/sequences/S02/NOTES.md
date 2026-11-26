# S02 BACKGROUND: NEW YORK, 1776 (D 44.74 s): notes (author A)

## HAND-OVER (S02 last frame = S03 first camera)
S02 ends with a 0.9 s dissolve (at local 42.75 s) from the brooklyn close shot to the colonies wide map, then HOLDS S03's own first
camera exactly (two identical keys, 42.75 -> D 44.74; the last 0.6 s dissolve into S03). Matched to what S03 (author B) already uses:
```js
const OVB = [2489.0, 1157.0], OV = [OVB[0] / 4, OVB[1] / 4];   // S03's dive point (brooklyn units / 4 = colonies)
{ region: "colonies", at: [OV[0] - 6, OV[1] + 14], dist: 300, tilt: 36, yaw: 0, fov: 30 }   // = S03 keys[0]
```
If S03 changes its first key, change `HAND` in S02/seq.js to the same values. Grade: Jackson `grade.wide`. Clouds: S02 uses colonies
`scatter seed 3` + keepClear (S03 uses seed 5): the cross-scene dissolve hides the difference. Date plate at S02's end: "August 1776 / 27".

## Shot list (local times)
| t | event | word |
| --- | --- | --- |
| 0.0 | colonies over the harbour (dist 300), summer: the British fleet as separate ships: 9 sailing in past Sandy Hook (own lane/speed/start), 10 anchored off Staten Island, 6 in Gravesend Bay | clean first frame |
| 3.05 | plate SUMMER 1776 | "seventeen seventy-six" |
| 8.30 | NEW YORK | "New York" |
| 11.47 / 12.43 | 32,000 (gold, counts) / SOLDIERS | "thirty-two thousand" / "soldiers" |
| 17.36 | tag THE HESSIANS, Germans hired from their princes (on the anchored ships) | "the Hessians" |
| 18.6-20.5 | drift onto the west end of Long Island (ships fade as the bay leaves the frame); three blue lines on the ridge facing south, Grant + Heister (red) in front | |
| 19.74 | plate AUGUST 1776 / 27 | "twenty-seventh of August" |
| 20.48 | LONG ISLAND | "Long Island" |
| 22.2-25.8 | night falls (0.55); red arrow of the flank march Flatlands -> Jamaica Pass -> west along the Jamaica road | "marched through the night around the American left" |
| 25.74 | gold pulse + tag A PASS ALMOST UNGUARDED at Jamaica Pass | "a pass" |
| 27.0-29.8 | first light; a red line comes in behind the American left from the east | "fell on the Americans from behind" |
| 25-32 | the blue lines turn about in place (retreatTurn) | |
| 32.2-37.3 | they fall back north toward the Heights; Grant + Heister close up 2.4 units and halt | "The American line broke" |
| 33.57 / 34.47 | 1,000 (gold, counts) / MEN CAPTURED | "a thousand" / "captured" |
| 37.4 | dissolve: brooklyn by day: three blue lines walk into the works (forts, the line) | "The rest fell back" |
| 40.0 / 41.5 | BROOKLYN HEIGHTS / EAST RIVER (italic); the camera pulls back to show the river behind | "Brooklyn Heights" / "East River" |
| 42.75 | dissolve to the hand-over camera (= S03 keys[0]), held to the end | |

Deviation from the tag: the 27 Aug fight (ridge, passes, flank march) is on the colonies map, because the brooklyn world's box ends at
y 1216 (the Heights of Guan, Battle Pass and Jamaica Pass lie south / east of it); brooklyn is used for the fall-back into the works.

## Facts
32,000 soldiers, ~1,000 captured (spoken; FACT_NOTES_brooklyn). Positions are research estimates (geo.json acc 400-800 m).

## Troop motion (`check_troops_motion.mjs`, 0-44.74)
colonies + brooklyn: no overlaps, no pops, no shape change, screen long-side-normal <= 6 deg. Only the 37.4 dissolve cut frame shows
"turn" spikes (camera cut). The retreat uses retreatTurn (7 s hold before the run, about-face in place, walk front first).

## Open issues
- No banners (no general is named in S02). No sound cues (no fire on screen; the fight is shown as movement only).
- Night on the wide map (0.55) is subtle.

## Round 1 fixes (critics A 5.5 / B 7.5 on S02)
- Readable troops on the Long Island shot: lines bw 0.45 -> 0.56; ridge spaced 10 units (no blue overlaps), the British front lines close
  up only 1 unit on "fell on" (they touched the blue at 2.4), flank line ends at 645.
- Wide clouds: `scatter { seed 3, n 10, med 18 }`, keepClear radius <= 45 on the action.
- Colonies (summer) re-baked by the worlds agent (lower relief, darker woods); no world files touched here.
- Checks: check_troops_motion colonies + brooklyn clean (only the 37.4 dissolve frame); check_side_gap 0 pairs.
