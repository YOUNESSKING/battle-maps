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
troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44,   // = v14 (S09_gm): 12 x 6 men, +44 %
  sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // r2: steel blue = v14 (block median (78-85, 91-100, 136-145) vs v14 (87, 99, 132))
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
| S05 trenton | 1.6 | 13-16.5 (streets) | **0.68 (tested, c; 0.75 measured 6.2 %)** | 4.4 | 0.43 |
| S05 colonieswinter | 6 | 390-410 | 8 | - | 1.0 |
| S06 trenton | 1.6 | 17-44 (the bridge fight ~20) | 1.0 | 6.2 | 0.43 |
| S07 trenton | 1.6 | 26-32 | 1.4 | 9 | 0.43 |
| S07 jersey | 6 | 74-100 | 1.8 | - | 1.0 |
| S07 princeton | 1.6 | 11.5-13 -> **18-20** (camera pulled out) | **0.86 (tested, d)** | **5.6** | 0.4 |
| S08 colonieswinter | 10 | 430-580 | 9 | - | 1.0 |

### Data changes that come with the small blocks
- Remove every per-unit `bw` / `bd` override (they were set for the v1 big blocks: S07 `bw: 0.9-1.0, bd: 0.2`). Defaults only.
- **ONE block per unit (`n: 1`) and more units** (round 3: multi-block units wheel at 86-119 deg/s at the small troopScale, single blocks <= 41 deg/s):
  a brigade line = 2-3 single-block units side by side, ~1.25 block widths apart (`LX` helper in `_v2test_d`: x0 + k x 1.07 u, staggered 0.12 s);
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

## 5. The test stills (5 after round 2) (`washington/critics/v2_test_sheet.jpg`)
(a) `_v2test_a` 22.8 s (S04 colonies wide: legend, timeline, date plate, clouds, GM-width arrows) vs v8 3 s; (b) `_v2test_b` 65.2 s
(S03 Brooklyn ferry at night 1: clock 8:00, "Brooklyn ferry", lamps) vs v8 35 s; (c) `_v2test_c` 100.3 s (S05 Trenton 8 a.m.: town, Hessians,
Knox's guns, "Trenton", clock) vs v8 35 s; (d) `_v2test_d` 75.9 s (S07 orchard, v14 blocks, steel blue) vs v14 40 s; (e) `_v2test_c` 130.7 s
(the Trenton ledger top-right) vs v8 60.5 s.
Sheet: `python3 /tmp/claude-0/-home-user-battle-maps/60769b45-58c2-54c2-9881-6e0959cf686a/scratchpad/looklead/v2sheet_looklead.py` (round 2: on the r2 worlds). Rebuild + snap: `python3 vicksburg/tools/make_scene.py washington/sequences/_v2test_d && bash vicksburg/tools/snap.sh washington/scenes/_v2test_d 75.9 <out>`.

## 6. Round 2 (critics `critics/v2_test_critic1.md` 6/4/4/7, `v2_test_critic2.md` 8/7/5/7): every finding -> fix
Engine (opt-in / bug fix only, default output unchanged for other films):
- `vicksburg/engine/overlay.js` `O.update`: `reframe()` also AFTER the updaters. The plate frame was measured before the text of the new
  key was set, so a still (single seek) right after a roll kept the previous plate's size ("16" on the border, note under the plate). Fixes
  every `plaque.date` / `plaque.clock` roll in every scene; no plate calls need changing. (C1 #1, C2 #1)
- `vicksburg/engine/troops3d.js`: `troopsOpts.pal = { u: {...}, r: {...} }` merged over the soldier palette (lineblocks do NOT read
  `sideCol`, which only colours the `box` look). v2: `pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } }` + `sideCol u "#3f5aa0"` in every scene. (C1 #16)

| finding | fix (tested in `_v2test_*`) | in the film |
| --- | --- | --- |
| C1 #2 wide arrows 4x too wide, through the legend | colonies arrows `width` = `maxWidth` **0.25-0.3** (w = width x ts x 0.66 ~ 5-6 px); the blue retreat arrow ends halfway NB -> Trenton, clear of the legend | every wide arrow: width 0.25-0.3; no arrow point in the bottom-left 200 x 130 px (legend) or under the timeline |
| C1 #3 colonies centre cooler / flatter | ground agent (relief / woods share) | worlds |
| C1 #4 cloud stacks overlap | colonies `scatter.seed` 5 -> **11** (n 24, med 15): separate puffs | per scene: pick a seed with no on-screen overlap |
| C1 #5, C2 #10 no carved name in wide | `labels` "Fort Washington" (T.fortw) + "Hudson River" (T.hudson, river) added; "Manhattan" (T.manhattan) | S04 |
| C1 #6 night not a night | S03 `NI` 0.7 -> **1.0** + `["film.grade", T.dark - 0.1, "night", 0.8]`, `["film.grade", T.firstlight - 0.1, "day", 0.8]`; land luma 50 (v8 50 s: 41; ~20 % L) | every night shot: night 1 + film.grade night 0.8 (S01 crossing, S03, S05 crossing, S06 / S07 night) |
| C1 #7, C2 #7 bead-chain wakes | Brooklyn boats `wake: false`, `lamp: true` (warm deck lamp as v8 night) | S03, S05 crossing, S01, S04, S06 boats at night |
| C1 #8, C2 #6 "Brooklyn ferry" in the fields | label at [2479.0, 1145.0] (off the landing, by the boats) | S03 |
| C1 #9, C2 #8 block under the timeline | 62.4 / 67.4 s keys target +1.4 u south (the bottom block rises above the bar) | rule: no block in the bottom 12 % while the timeline is up |
| C1 #10 slate woods | re-measure on the r2 worlds | worlds |
| C1 #11, C2 #2 Trenton grey | Trenton keys night 0.32 / 0.25 / 0.2 / 0.16 / 0.14 / 0.12 / 0.1 / 0.08 / 0.06 -> **0.10 / 0.08 / 0.06 / 0.05 / 0.04 / 0.03** (8 a.m., sunrise 7:20); rain x0.5 kept; ground = worlds agent (r2) | S05 / S01 Trenton keys; S06-S07 dawn keys <= 0.1 after sunrise |
| C1 #12 Trenton no woods | worlds agent (r2) | worlds |
| C1 #13, C2 #3 no anchor / no Hessians / no TRENTON | still (c) moved to 100.3 s: the town, Knox's guns at the head, the Hessians forming in King / Queen St (shown from the 95.4 s cut, n 3, positions 2 u up the streets), carved **"Trenton" on "the town's two main streets"** (97.6-101.1 s; "Trenton" itself is not spoken in the Trenton close shots) | S05 |
| C1 #14 Trenton blocks 6.2 % | TR ts 0.75 -> **0.68**, fxScale 4.4; all `bw` overrides removed (Hessian blocks were bw 0.55) | S05 |
| C1 #15, C2 #9 ledger unproven | 5th still (e): `_v2test_c` 130.7 s Trenton ledger (2 rows by then) vs v8 60.5 s | S03 / S05 / S07 |
| C1 #17 Stony Brook flat band | worlds agent (r2) | worlds |
| C1 #18 haze top-right | S07 orchard keys tilt 53 -> **55.5** (55-74 s) | S07 |
| C1 #19 coarse crowns | open (needs `world.treeScale` through SEQ, not done) | open |
| C2 #4 banner in the British line | Washington's banner at RY2 + 3.4 (between the lines, nearer the American line); the 30 YARDS ruler from there | S07 |
| C2 #5 orchard house = empty red outline | world feature (farmstead footprint without roof) -> worlds agent | worlds |
| check_troops_motion turn-rate fails (d) | orchard keys yaw held at 0 (was +-2) while blocks wheel | S07 |

## 7. Round 3 (critic 1 r2: b 7, d 7; critic 2 r2: c 7, arrows at 360p)
| finding | fix (tested) | in the film |
| --- | --- | --- |
| (b) night land too light (bottom row L 27-28 vs v8 13-24) | SEQ `grade.night = { veil: [12, 18, 28], vt: 0.12, vb: 0.5, sat: 0.85 }` (the engine's night veil, dark blue, growing to the bottom; the overlay `film.grade night` only weighs 0.12 and its 4th arg is a DURATION, not an amount); land sectors now L 14-16 top / middle; the bottom row carries the legend + timeline (v8 50 s has neither) | every night scene: the same `grade.night` + night 1 keys |
| (b) blocks touching the timeline / bottom edge | the 62.4 / 67.4 s ferry keys target 0.8 u NORTH of v1 (south brought the marching regiments into the bottom 12 %); still 65.2 s: no block below y 610 | rule: check every troop still for blocks in the bottom 12 % |
| (d) check_troops_motion (Princeton 45.5-83.8) | one block per unit (above): turn <= 41 deg/s on 17 of 18 units (one 45), 0 pops, shape 0 %, no overlaps; residual: front-vs-velocity 21-26 deg on the OUTER militia / red blocks (frame-edge Jacobian; v1 had 29-30) and the leftmost red block 54 deg on screen during its entrance under the 0.9 s dissolve | S07 data as `_v2test_d`; give the militia a turn-first key |
| (c) no American infantry | Greene's leading brigade (2 blocks at [1353.2, 2051.6]) on the Pennington road behind Knox's guns, in the upper third, from the 95.4 s cut; the clock note no longer repeats "Trenton" | S05 |
| (a) arrows thin at 360p | colonies arrows width = maxWidth **0.34** (6-7 px at 720p); GM tint kept | all wide arrows 0.3-0.35 |
