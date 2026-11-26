# V2 LOOK RECIPE: Washington #21 back onto the owner-approved tests (OWNER_DECISIONS row 22)

Reference = `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` (+ its `index.html`), `gm3d_clip_v6_share.mp4` (clouds, opening),
`vicksburg/troops_test_v14_share.mp4` + `vicksburg/sequences/S09_gm|S10_gm/seq.js` (troops). The ground (all 7 worlds in the v8 palette)
is the ground agent's job; everything else is here. Test copies: `washington/sequences/_v2test_a|b|c|d/` (built to `washington/scenes/_v2test_*`),
sheet `washington/critics/v2_test_sheet.jpg`. Every line below is plain SEQ data: the engine (`vicksburg/engine/`) is NOT changed.

## 1. Troops = v14 (thin wide line blocks of small men)

### Measured (1280x720 frames)
| | v14 (S09_gm 95 s, dist 39.5, fov 22, troopScale 1.7, size 1.44) | v1 ours (S07 Princeton 1100, dist ~11.5, fov 30, ts 1.6, size 1.2, bw 1.0) | v2 test d (dist 18, ts 0.86) |
| --- | --- | --- | --- |
| block width on screen | **~70 px = 5.5 % of the frame width** | ~240 px = 19 % | 65-75 px = 5.1-5.9 % |
| block depth on screen (plate + men) | ~25 px | ~75 px | ~22-26 px |
| man height | ~8-10 px | ~25-30 px | ~8-10 px |
| men per block | 72 = **12 files x 6 ranks** (depthK 0.44) | 72 = 18 x 4 (depthK 0.3, the non-Vicksburg default) | 12 x 6 |
| blocks in a battle frame | ~16 (2 per brigade, ~2.4 block widths between the two sides' lines) | 4-6 | 15 |
| frame width in world units | 27.3 u (= 3.5 km in Vicksburg metres) | 11 u | 17 u |

Block world width = 0.7 x troopScale x size x 0.96-1.04 (u.bw default 0.7; with n = 3 boxes the gap term makes it x0.966). Frame width at the
look-at point = 2 x dist x tan(fov / 2) x 16/9 = **0.953 x dist** at fov 30. Hence (fov 30, size 1.44, measured on the renders, perspective included):

**troopScale = 0.048 x dist (close regions: blocks 5.5 % of the frame) and 0.020 x dist (wide regions: ~2.2 %, the v8 wide boxes)**,
dist = the camera distance of that region's MAIN troop framing in the scene. The m/unit of the region (z11 58 m, z12 29 m, z10 117 m, z9 233 m)
does not enter: the engine keeps mpu 129.36 and the target is the on-screen size.

### SEQ settings (every scene)
```js
troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44 },   // = v14 (S09_gm): 12 x 6 men, +44 %
```
Per region (`regionOpts`), from the scene's main framing:
| scene / region | v1 ts | main framing dist | **v2 troopScale** | **fxScale** (= 0.31 x dist close, 9 x k) | arrows `width` = `maxWidth` |
| --- | --- | --- | --- | --- | --- |
| S01 colonieswinter | 10 | 98-130 | 2.4 | (wide default 40) | 1.0 |
| S01 crossing | 1.6 | 20-23 | 1.0 | 6.6 | 0.43 |
| S01 trenton | 2.0 | 30-45 | 1.7 | 11 | 0.43 |
| S01 brooklyn | 1.4 | 26-28 | 1.3 | 8.4 | 0.43 |
| S01 princeton | 2.2 | 15-25 | 0.9 | 5.6 | 0.43 |
| S02 colonies | 10 | 128-300 | 4.5 | - | 1.0 |
| S02 brooklyn | 3.0 | 58-70 | 1.4 (wide-ish framing: 0.022 x dist) | 9 | 0.6 |
| S03 brooklyn | 1.6 | 22-28 (ferry / night) | **1.15 (tested, b)** | 7.5 | 0.43 |
| S03 / S04 colonies | 16 | 196-440 | **6 (tested, a)** | - | 0.85 (as v1: arrows shrink with ts) |
| S04 / S06 jersey | 7 | 54-112 | 2.0 | - | 1.0 |
| S05 jersey | 12 | 90-175 | **3.5 (tested, c)** | - | 1.0 |
| S05 crossing | (1) | 13.6-14.5 | **0.67 (tested, c)** | 4.4 | 0.43 |
| S05 trenton | 1.6 | 13-16.5 (streets) | **0.75 (tested, c)** | 4.9 | 0.43 |
| S05 colonieswinter | 6 | 390-410 | 8 | - | 1.0 |
| S06 trenton | 1.6 | 17-44 (the bridge fight ~20) | 1.0 | 6.2 | 0.43 |
| S07 trenton | 1.6 | 26-32 | 1.4 | 9 | 0.43 |
| S07 jersey | 6 | 74-100 | 1.8 | - | 1.0 |
| S07 princeton | 1.6 | 11.5-13 -> **18-20** (camera pulled out) | **0.86 (tested, d)** | **5.6** | 0.4 |
| S08 colonieswinter | 10 | 430-580 | 9 | - | 1.0 |

### Data changes that come with the small blocks
- Remove every per-unit `bw` / `bd` override (they were set for the v1 big blocks: S07 `bw: 0.9-1.0, bd: 0.2`). Defaults only.
- `n` (boxes per unit) up: infantry blocks = round(2n/3), so **n: 3 = 2 blocks, n: 4 = 3 blocks**. A brigade line = 2-3 blocks side by side;
  the two sides' lines ~2-3 block widths apart in battle frames (v14). Test d: Mercer / Mawhood / militia n 1 -> 4, lines unchanged in x.
- Camera: battle framings at least ~2.5 x the block spacing in view (v14 shows the whole field): S07 orchard dist 11.5-13 -> **18-20** (tilt 52-53).
  Pulling out is preferred to shrinking further (the map reads, more blocks in frame, like v14).
- troopScale also sets march speed (cruise 1.0 x ts u/s) and arrow width (w = width x ts x 0.66): re-run
  `node vicksburg/tools/check_troops_motion.mjs <scene> t0 t1 [region]` on every moving stretch (rectangle rules: front-first, <= 15 deg on screen,
  <= 45 deg/s, no overlaps) and re-check arrival times (an over-fast move now leaves up to 5 s earlier).
- Checker on test d (Princeton 45.5-83.8): shape 0 %, pops 0, NO overlaps, vmax 0.86 u/s; OPEN: turn rate 73-92 deg/s on 4 blocks (v1: 30-47)
  and Mawhood's left block 47 deg on screen at its 46.2 s entrance (v1: 26); front-vs-velocity 20-24 deg on the militia (v1 already failed it, 29-30).
  The turns are fixed-time wheels on smaller blocks seen by a camera that yaws +-2 deg: in the real S07 v2 hold the yaw while blocks wheel and
  give each wheel >= 2 s; the militia's diagonal walk-up needs a turn-first key.
- Musketry = v14's (`S09_gm` SMK) scaled by k = our frame width / 27.3 u (k = dist / 28.7 at fov 30) through `fxScale` (9 x k) and the opts:
```js
const KF = 0.63;   // dist 18
const VO = { size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * KF, windK: 1.1, rate: 2.9 / KF, volley: 1.6, roll: 0.9, height: 2.4 * KF, cluster: [2.6 * KF, 1.4 * KF] };
volleys: [{ region: PR, pts: [[x - 1.1, y], [x + 1.1, y]], t0, t1: t0 + 2.4, opts: { ...VO, dir: [0, 1] } }]   // >= 2.2 s each
```
  A v1 volley of 0.7 s with `rate: 3` drew ONE puff (puffs = rate x length x time / (100 U)): every volley lasts >= 2.2 s (a ripple + the next).
  The visible muzzle flashes come for free (`flashes` default on outside Vicksburg).

## 2. Overlays (v8 set; copy these calls)
Colours / sides: Americans blue `#3C6E9E`, British (and Hessians) red `#9C3A35`.
```js
// THE ARMIES key, bottom-left, during map shots; steps out for big cards (letter / decision / ledger)
["legend", tIn, tOut, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Howe", color: "#9C3A35" }] }],
//   sub = the opposing commander of THAT scene: Howe (S02-S04), Rall (S05 Trenton, name "Hessians"), Cornwallis (S06), Mawhood (S07 orchard)
// the wax-seal campaign timeline, bottom: ONE bar for the whole film, months Aug 1776 -> Jan 1777, seals on the 3 moves
["timeline.show", t, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: POS }],
["timeline.seal", t, { at: 0.95, name: "Brooklyn" }],    // move 1 (29-30 Aug)
["timeline.seal", t, { at: 4.72, name: "Trenton" }],     // move 2 (26 Dec)
["timeline.seal", t, { at: 5.25, name: "Princeton" }],   // move 3 (2-3 Jan); 4.72 / 5.25 keep the two seals apart
["timeline.go", t, { at: POS, d: 1.2 }],                 // POS: Aug 0.9, Sep 1.5, 16 Nov 3.5, 8 Dec 4.25, 25-26 Dec 4.8, 2-3 Jan 5.1-5.25
["timeline.hide", t],
// pocket-watch time plate, top-left, wherever a time of day is known (24 h input; after midnight write 24 + h so the hands run FORWARD: "26:00" = 2 a.m.)
["plaque.clock", t, { time: "20:00", note: "after dark · rain", header: "29 August 1776" }],
["plaque.note", t, "the wind changes"],                  // change only the note line (the watch stays through a fight, v8)
["plaque.run", t0, t1, "9:05"],                          // the hands run over a stretch (v8 9:00 -> 9:05)
// the plain date plate otherwise (as v1): ["plaque.date", t, { month, day, weekday, note }]
// the SMALL parchment result list, top-right (v8), INSTEAD of the big dark centred result card; one row per spoken figure, on its word
["ledger.show", t, { title: "Princeton", sub: "3 January 1777" }],
["ledger.add", T.word, { who: "Almost 200 prisoners", note: "optional second line", stamp: false }],
["ledger.note", T.word, rowIndex, "a future president"],   // a note that must wait for ITS word (nothing before the narrator says it)
["ledger.hide", t],
```
Carved place names on the map, on their words (SEQ `labels`, v8 "Vicksburg" / italic "Big Black River"):
`{ text: "Brooklyn ferry", region: BK, at: [x, y], size: 18, t0: T.ferry - 0.05, t1: T.ferry + 3.5 }` (+ `river: true` for water:
East River, Delaware River, Assunpink Creek, Stony Brook). Names leave after ~3.5 s (clean screen).
Rules kept: one big card at a time (the legend steps out for letter / decision cards; the ledger is small and shares the screen with the
timeline as in v8 60.5 s, the legend steps out when it comes), no `film.dim` under a ledger (v8 never dims for it; keep `film.dim` only under
the method `letter` and `engage.decide` cards), nothing before its word.

## 3. Clouds, grade, film, weather
- **Grade**: every scene's `grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } }` (Jackson's richer, darker wide look) ->
  **`grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 } }`** = the v8 clip's `GP.wide`. Close and night = engine defaults = v8 (close sat 0.98,
  toe 4, S 0.14, blue +7, veil 15 %->4 %). No other grade keys. `film.grain` default 0.04 (= v8); vignette default.
- **Clouds** (`fx.vclouds`, white puffy cumulus with cores, as v6 / v8): wide regions `scatter` with `med` ~ 0.035-0.05 x the wide shot's camera
  dist (v8: med 30 at dist 545-640) and `n` so that ~10-14 clouds are in frame; keep `keepClear` over the story spot (the Fort Washington stamp,
  the Trenton posts) and `diveClear` on small wide boxes. Tested: colonies `{ scatter: { seed: 5, n: 24, med: 15 } }` (S04 dist 250-440; n 30 /
  med 18 was too many, n 34 / med 12 too small at dist 440). Jersey keeps `{ seed: 7, box: [560, 874, 220, 255], n: 9, med: 40 }`.
  Close regions on a fair day: `{ shadows: true }` (cloud shadows sweeping the fields, v8 close). Storm / overcast (S05 Trenton 26 Dec,
  the crossing at night): `shadows: false`.
- **Weather / grey look**: `VX.rain` draws a grey veil rgba(70,80,92, 0.2 x k) over the whole map: v1 ran k 0.8-0.95 = a 16-19 % grey
  sheet (the "grey fog look"). v2: **intensities x 0.5 and `n` x 2** (same streaks, veil <= 10 %), only where history confirms it
  (rain 28-29 Aug at Brooklyn; the Christmas nor'easter 25-26 Dec; nothing else). **Real fog only at Brooklyn first light** (S03 `fogDraw`,
  T.fog -> the last boats); S07's frost veil (`VX.rain(..., { n: 1, veil: "198,214,232" })`, a pale frost tint on "the mud froze") may stay.
- Night shots keep the engine night grade (v8 50 s), campfires and lanterns.

## 4. What each scene must change (S01-S08)
Common to all: the `troopsOpts` line, the `regionOpts` from the table, the `grade` line, remove `bw`/`bd` overrides and raise `n`, rescale
volleys (section 1), re-check troop motion, legend + timeline on map shots, carved names on their words.
| scene | clocks (FACT_NOTES) | legend / timeline | result -> ledger | other |
| --- | --- | --- | --- | --- |
| S01 hook | date plates (the hook says no clock time); optional: none | legend in ~1.9 s, timeline in ~1.4 s at 4.8 (Dec) - as v8's opening; both step out for the letter card | the 900 / NOT ONE AMERICAN KILLED tags stay (hook stamps, not a result card) | rain x0.5; colonieswinter clouds as section 3 |
| S02 background | none (27 Aug night march: date plate) | legend from the first map shot (sub Howe); timeline at 0.8 (Aug) | none | "32,000" number stays |
| S03 Brooklyn | **20:00** on "After dark" (T.dark), **23:00** on "changed" (wind dies ~11 p.m.), **26:00 = 2 a.m.** on "middle of the night" (Mifflin), date plate at first light (or 6:00 on the last boats, FACT row 8 is B-grade) | legend T.d29 + 0.4 -> T.about - 0.6; timeline from T.d29 at 0.9; **seal "Brooklyn" on "the last of the army crossed"** | big card -> ledger "Brooklyn / 29 - 30 August 1776": 9,000 across (in a single night) / Nearly all the guns / A handful left behind (stragglers); drop the `film.dim` | rain x0.5 n x2; fog at first light only; carved "Brooklyn ferry" on "ferry", "Brooklyn" on "Brooklyn" (+ East River, New York as v1) |
| S04 retreat | date plates (16 Nov, 8 Dec) | legend all through (sub Howe); timeline go 3.5 on "16 November", 4.25 on "8 December" | "Nearly 3,000 prisoners" label stays (not a result card) | colonies clouds n 24 / med 15; "Manhattan" carved on its word; ts colonies 6, jersey 2 |
| S05 crossing + Trenton | **18:00** on "After dark" (crossing 6 p.m.-3 a.m., FACT C2) replacing the "after dark" date plate; 23:00 storm and 3:00 last guns as v1; **8:00** at Trenton and **keep the watch through the fight** (plaque.note "Trenton" instead of the 26 Dec date plate) | legend from CUT2 + 0.6 (entry "Hessians", sub Rall) to T.about - 0.6; timeline at 4.8; **seal "Trenton" on "About nine hundred"** | big card -> ledger "Trenton / 26 December 1776": About 900 captured / Over 100 killed or wounded / No American killed (in the battle) / James Monroe wounded + `ledger.note` "a future president" on "president"; drop the `film.dim` | rain x0.5 n x2; Trenton cloud shadows off (storm) |
| S06 Assunpink | 2 Jan: date plate on "second of January"; dusk at the bridge: date plate "dusk" unless the lead accepts ~"5:00 in the evening" (Stockton Hollow ~3 p.m. is sourced, F2; dusk is not timed in FACT_NOTES) | legend (sub Cornwallis) on the map shots, out for the decision card; timeline go 5.1 | none (decision card stays) | three assaults: volleys >= 2.2 s each, scaled smoke |
| S07 night march + Princeton | **2:00** (as "26:00" if after a p.m. clock) on the march ("on the road by 2 a.m.", G3); **8:00** "William Clarke's orchard" at the orchard cut (H2 "before 8 a.m."), kept through the fight | legend CUT3 + 1.0 -> T.lost - 0.5 (sub Mawhood); timeline go 5.25 on "Mercer"; **seal "Princeton" on "surrendered"** | big card -> ledger "Princeton / 3 January 1777": British: hundreds lost (killed, wounded or captured) / Almost 200 prisoners / Americans: under 100 lost / General Mercer (died nine days later); drop the `film.dim` | orchard camera dist 18-20; units n 4; ts 0.86; volleys as section 1 |
| S08 ending | none | timeline (all three seals already set: show with the seals at t, `at: 5.25`) through the living map, out before the end-screen tiles; legend out for the letter cards | none | colonieswinter clouds; ts 9 |

## 5. The four test stills (`washington/critics/v2_test_sheet.jpg`)
(a) `_v2test_a` 22.8 s (S04 colonies, wide, legend + timeline + date plate + clouds + arrows) vs v8 3 s; (b) `_v2test_b` 65.2 s (S03 Brooklyn,
night ferry, clock 8:00, carved "Brooklyn ferry") vs v8 35 s; (c) `_v2test_c` 89.6 s (S05 Trenton, winter dawn, clock 8:00, troops walking) vs
v8 60.5 s; (d) `_v2test_d` 75.9 s (S07 Princeton orchard: 15 v14-scale blocks, volleys, Washington's banner, legend, clock, timeline) vs v14 40 s.
Rebuild + snap: `python3 vicksburg/tools/make_scene.py washington/sequences/_v2test_d && bash vicksburg/tools/snap.sh washington/scenes/_v2test_d 75.9 <out>`.
