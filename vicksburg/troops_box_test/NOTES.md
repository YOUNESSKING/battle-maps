# Troops as boxes, professional (test, 2026-11-26)

Owner: "Make me a test of the soldiers as boxes again, and make them PROFESSIONAL this time."
Same scenes, camera, map and MOTION as the approved v14 test (`vicksburg/troops_test_v14_share.mp4`, look "lineblocks");
only the look of each unit changes. The rejected v9/v10 boxes (flat screen-plane stickers, tilted, cream X, no depth) are not reused.

## Design (round 1)
Reference idea: the unit counters of HistoryMarche / Kings and Generals maps, wargame counters and Total War unit cards: a solid
block in the side colour, a framed top, one clean NATO-style type symbol, real thickness and a shadow so it sits ON the map.
- **Solid slab**: a convex bevelled slab built in the engine (chamfer all round, vertical walls), side faces darker than the top
  (vertex shade 0.66 walls, 0.9 chamfer) and lit by the scene's sun (Lambert / Phong), fogged like the terrain, casts into the sun's
  shadow map, soft contact shadow (AO) round the footprint. Sits flat on the smoothed ground (gentle slope follow, clamped +-0.2); never
  billboarded, tilted toward the camera or sheared on screen.
- **Top face** (canvas texture, mask channels so captured counters fade to grey per instance): side colour = the channel's exact
  `SIDE_COL` (#2c57b7 / #be3a2a), ink hairline edge, gold or cream frame, centred NATO symbol box: infantry X, cavalry slash,
  artillery = the kit gun (fx.js `art_gun`), engineers = gear. The FRONT edge is marked (A: frame twice as strong at the front, C: a
  cream front band) so the facing reads like GM's pale front line.
- **Proportion**: frontage = the v14 block's width, depth = width / 3.2 (A), / 3.3 (B), / 3.1 (C); guns width / 2.2. Always inside the
  v14 footprint, so no new collisions; one size per unit type.
- **Draw order**: the counter is convex, so with back faces culled it draws correctly WITHOUT a depth test (like the old Style W boxes):
  it is never cut by tree crowns (round-1 first try: a thin tile was cut by the canopy and by single trees in front of it); smoke
  (renderOrder 10) and clouds still draw over it, arrows (GM style, 1.6-1.8) under it.
- **Bridge**: the v13/v14 crossing is kept exactly: as the block breaks ranks the counter dissolves (opacity x (1 - st)) and its 72
  men appear in its footprint (side-colour coats) and stream over the deck, up the trail and vanish, as approved. No counter on the deck.
- **Captured**: top and walls fade to a mid grey (#8b877e), symbol stays.

## Variants (`SEQ.troopsOpts: { look: "counter", counter: "A" | "B" | "C", counterOpts: {...} }`)
| | A raised enamel counter | B bevelled slab + gold frame + pennant | C thin tile + strong drop shadow |
| --- | --- | --- | --- |
| thickness / bevel (x width) | 0.075 / 0.018 (crisp) | 0.10 / 0.034 (chunky chamfer) | 0.028 / 0.008 |
| top | enamel (Phong, faint sheen + falloff), ink edge, gold hairline frame (front doubled), cream outline NATO box + X | gold frame, cream symbol plate with ink X | ink edge, cream front band, cream outline NATO box + X |
| extras | sun shadow + AO | sun shadow + AO, small swallow-tail pennant (side colour, pale) on a staff at the rear-left corner | no sun shadow; long soft drop shadow away from the sun + AO |
`counterOpts` overrides any field (`dk` depth/width, `h`, `bev`, `ao`, `drop`, `cast`, `phong`, `pen`, `tex`, `wood`).

## Engine switch
`vicksburg/engine/troops3d.js`: `CTR = o.look === "counter"` joins `BOXL` (the rectangle motion of "box"/"lineblocks"), so every
motion path is the lineblocks one; `update()` hands the drawing to `updCounter()` (new code path, meshes only created when CTR).
Looks "boxes", "box", "lineblocks", "blocks" are untouched: 7 lineblocks stills (S09 59.5/65/86.2/103.5, S10 22/25/28.5) are
byte-identical before and after the edit (md5).

## Motion check (`node vicksburg/tools/check_troops_motion.mjs`, S09 55-110 champion, S10 15-35 bigblack_new)
Counter output is IDENTICAL to v14 lineblocks (`checks/S09_A.txt` vs `checks/S09_LB.txt`, same for S10): zero new fails. Screen
long-side rule: 0 frames > 15 deg in S10, S09 as v14 (Crocker 5 frames at 99.1 s, known); pops 0; shape 0 %; overlaps as v14 (S09
units 1x3 0.07 u at 106.2 s, S10 unit 3 self 0.07 u at 22 s). (The world "front-vs-velocity" column was superseded by the screen rule
in v9 and reads the same as v14.)

## Files
`sheet_r1.jpg`: rows = S09 59.5 / 65 / 86.2 / 103.5 s, S10 28.5 s, then 2x crops (S09 59.5, S10 25 bridge break-up, S10 22 a counter
walking broadside); columns = v14 lineblocks | A | B | C. Reproduce: `tools/setlook.sh <S09_gm|S10_gm> <lineblocks|A|B|C>` (copies the
engine into the built scene and sets the look), `tools/run.sh <tag> <looks...>` (stills to /tmp/tbx), `tools/sheet.py`.
Scenes are built with `bash vicksburg/tools/make_troops_test.sh` (+ `SEQ=S10`).

## Open issues
- At 720p on the wide S09 shot the counters are ~45 x 15 px: the NATO box reads as a small cream square with an X; the B pennant is
  only a few pixels (reads at the S10 distance).
- C's drop shadow is subtle on the dark woods.
- During the break-up the half-faded counter and its men overlap for ~0.8 s (as the v14 plate did).

# Round 2 (2026-11-26): A2 + A2-L, from the critics' pick A (critic 1 A 5.5 / B 5 / C 4; critic 2 A 7 / C 6 / B 5)
Main warning: on the wide shot all three still read as the rejected v10 stickers. Judge on the WIDE rows at 1:1 and on the 640x360
phone downscale. Files: `sheet_r2.jpg` (columns v14 | A round 1 | A2 | A2-L, 5 moments + 3 crops at ~2x + a small phone row),
`phone_r2.jpg` (S09 103.5 s and 86.2 s downscaled to 640x360, shown 1:1), `motion_r2.mp4` (S09 82-92 s crest + S10 20-32 s bridge).
Switch: `troopsOpts: { look: "counter", counter: "A2", counterOpts: { scale } }`.

| Critic point | A2 |
| --- | --- |
| 1 painted, not plastic | matte Lambert (no specular); top #3a5a94 / #a8432f; walls #243b63 / #6e2a1f (instance colour of the body); 6 % paper grain multiplied into the top (2-octave value noise) |
| 2 outline | ink edge #2a1d16 drawn in the shader in SCREEN px (fwidth): 1.8 px at 720p on every counter, whatever its size; gold hairline removed; a 1 px light catch (+18 %) on the top edges that face the sun and a 1 px darker inset (x0.7) on the edges away from it (per-instance sun vector in the counter's frame) |
| 3 front | cream #efe6cf band along the front long side (~0.2 of the depth); front wall 15 % lighter than the back wall |
| 4 symbol | filled cream plate #e9dfc6 (40 % of the frontage x 56 % of the depth) with a solid ink X #1e1a16 (line 11.5 % of the depth, ~2 px at the wide shot); cavalry one ink slash, engineers the gear; ARTILLERY = the v14 gun models (carriage, barrel, wheels, limber, 4 crew, recoil), no gun counter |
| 5 size | see "Size" below |
| 6 ground | bevel 0.012 x width, height 0.06 x width, sun shadow kept; tight contact AO (own texture: solid under the counter, ~3-4 px falloff, 35 %); no drop shadow, no pennant |
| 7 bridge | the counter shrinks from its REAR edge (the one at the bridge mouth: a routing block walks back) to 45 % depth and fades out in 0.35 s (f0+0.1 to f0+0.45); the men appear only from f0+0.27 (counter < 50 % opacity) at their rank spots and then peel off as in v14 |
| 8 captured | top + walls #6e6a62, symbol stays cream, a 2.3 px edge in the old side colour |
| 9 occlusion | depth test ON (hills hide counters), but the counter's depth is pulled 1.2 units toward the camera in the vertex shader (screen position unchanged), so tree crowns standing round or in front of it never clip it; counters fade out before any corner leaves the frame (full opacity only when all four top corners are >= 26 px inside) |
| 10 ARMIES key | mini counters (wall + top colour, ink edge, cream front band, cream plate with X) in place of the arrow swatches when the counter look is on (`O.legendSwatch`) |

## Size (point 5): the honest limit
On this camera a 3:1 counter is foreshortened to ~5:1 on screen; the old blocks were ~70 x 14 px at 1280 (critic: 45 x 15 at the 720
sheet). Scaling the formations to hit 60 x 20 / 75 x 22 (scale 1.5 / 1.9) collides heavily (checker: 19 / 27 unit pairs, up to 1.4
units), because the v14 spacing has only a ~0.22-unit gap between blocks. What fits:
- **A2** (formation unchanged): frontage 1.06 x the block width (fills most of the gap), depth 0.40 x width (was 0.31 in round 1;
  the v14 plate was 0.44), so it reads ~25 % bigger in area than round 1. Checker (it now measures the drawn counter): S09 55-110 only
  the known v14 brush (units 1 x 3 at 106.1-106.6 s, 0.12 u vs v14's 0.07 u); S10 15-35 only the south flank's own blocks turning in
  place at 22 s (0.11 u vs 0.07 u). Screen long-side rule and pops are identical to v14 (0 new fails).
- **A2-L**: the same counter with the S09 formation scaled x1.15 (`counterOpts.scale`). It is visibly bigger but costs NEW
  overlaps (checker S09: 10 unit pairs, up to 0.5 u, mostly at the crest gun line 99-105 s and units 0 x 1 at 62-72 s); it would need
  the S09 test data re-spaced. S10 is the same as A2 (the bridge queue timing depends on block size; not re-timed).

## Round-2 open issues
- RunPod: no A5000/A4000/3090/A6000/3080 supply, a 4090 pod came up without Chrome (render failed in 3 s); pods terminated, list
  verified empty, cost ~$0.03. `render_pod.sh` no longer falls back to the A4500 (broken frames). The motion clip is a LOCAL render.
- The ink edge is in screen pixels: at the close S10 camera it is relatively thin next to the big counter (by design).
- `motion_r2.mp4` (22 s, 1280x720 30 fps, silent, 6.4 MB): 0-10 s = S09 82-92 s (Bowen's counters up the crest), 10-22 s = S10
  20-32 s (break-up at the bridge, captured line, edge fade top right). Rendered LOCALLY (SwiftShader, ~27 min).
- Regression after round 2: lineblocks stills at S09 59.5 and S10 22 / 25 / 28.5 s are byte-identical to the pre-edit render. At S09
  103.5 s only the DOM date plate differs (a 260x90 px box, the known plate font-timing flake in LESSONS); the 3D layer is identical.

# Round 3 (2026-11-26): A3 + the final share clip
Critics on A2: readability 7.5 ("ready after the guns fix"), professional look 6 / A2-L 6.5 ("owner would reject"). Both: at wide and phone
size the counters read as FLAGS (blue + white X = saltire, red = battle flag; lines = bunting). Owner rule: no unit flags.
Switch: `troopsOpts: { look: "counter", counter: "A3" }`. Files: `sheet_r3.jpg` (v14 | A2 | A3), `phone_r3.jpg` (640x360 at 1:1),
`troops_box_share.mp4` (FINAL: S09 55-110 s + S10 20-35 s, 1280x720 30 fps, 70 s, the v14 share's audio track, 22.9 MB).

| Point | A3 |
| --- | --- |
| 1 no flag read | no cream anywhere: the front band is gone; facing = 2.5 px ink front edge (1.4 x the 1.8 px edge elsewhere) + a slim front strip in a darker side colour (#2a4472 / #7f2f22, 0.17 of the depth) + the front wall 15 % lighter |
| 2 NATO symbol | plate 31 % of the frontage x 50 % of the depth in the lightened side colour (#8ea2c6 / #d39a8c), 1.3 px ink outline, thin crossed lines corner to corner (~1.5 px, ink at 85 %), all drawn in the shader in screen px (fwidth); cavalry one thin diagonal; engineers: plate only (no engineers in the test) |
| 3 guns | crew coats in the side colour; a flat side-colour ground disc under each gun (1.2 x gun scale, 0.35 opacity, thin ink rim); guns x1.3. The checker keeps the v14 nominal gun box (0.62 x block width), which equals the x1.3 model's width across the wheels. Scaling that box by 1.3 brushes the passing Union lines (units 10/11 x 18, 0.09 u at 99.6-102.7 s) and moving the guns in the test data only moved the brush (tried: middle gun p +-0.8, crest battery moved) |
| 4 captured | fully grey top #6e6a62 and walls, the old side colour as a 2.5 px edge, held grey (the round-2 capd faded back toward the side colour before the unit's fade: the "pink") |
| 5 edge width | 1.8 px + 0.015 px per px of on-screen frontage above 70 px, capped at 3 px (wide S09 ~1.8, close S10 ~3) |
| 6 size | A2 size kept. A x1.10 counter (wk 1.166, depth 0.44) gives new pairs (units 3 x 4, 15 x 19, 0 x 12, 10/11 x 18, own-unit brushes) and growing 1 x 3 (0.25 u): no clean fit, so A2-L is not shipped |
| key | THE ARMIES mini counter without cream (dark front strip, light plate, thin X) |

Checker A3: S09 55-110 = A2 (only units 1 x 3 at 106.1-106.6 s, 0.12 u; v14 0.07 u), S10 15-35 = A2 (south flank's own blocks at 22 s, 0.11 u);
screen long-side rule, pops, shape identical to v14.
Final clip: RunPod RTX 3090 community ($0.22/h, S09 146 s + S10 55 s render, ~$0.04 incl. setup); pod terminated, `myself { pods }` empty;
no broken frames (per-frame luma steps <= 0.4).

# Round 4 (2026-11-26): A4 = the shipped look (critics on A3: 8/10 "show the owner", 7.5/10 "after the guns fix")
Switch: `troopsOpts: { look: "counter", counter: "A4" }`. Files: `sheet_r4.jpg` (v14 | A3 | A4), `phone_r4.jpg` (S09 103.5 / 86.2, S10 28.5 at
640x360 1:1), `troops_box_share.mp4` (re-rendered with A4: S09 55-110 + S10 20-35, 1280x720 30 fps, v14 audio, 22.9 MB).
- Guns x1.0 (no checker-size mismatch), dark bronze (barrel #4a3a2c, carriage + limber #5a4432), ground disc removed; crews 1.6x in the
  bright side colour (#5b80d0 / #e0614c). At 640x360 the Union battery reads as dark guns with blue crew dots (no ink ellipse added).
- Facing: a LIGHTER saturated front strip (#5b80d0 / #e0614c, 0.22 of the depth) behind the 2.5 px ink front edge.
- Blue lifted: top #4466a6, walls #2a4577 (red unchanged); THE ARMIES key follows (`counter4`).
- NATO crossed lines: 100 % ink, 1.8 px.
- S10 end: Grant's banner (test sequence S10_gm only) holds at x 1518.3 (was 1521.4) from 32.6 s: clear of the captured counter, the guns and
  the "18 GUNS TAKEN" card.
Checker A4 = A2/A3 (S09 only units 1 x 3, 0.12 u at 106.1-106.6 s; S10 only the south flank's own blocks at 22 s, 0.11 u); 0 screen-rule fails.
Render: RunPod RTX 3090 community $0.22/h, ~$0.024; pod terminated, `myself { pods }` empty; luma steps <= 0.4 (no broken frames).

# Round 5 (2026-11-26): A5, owner "at the bridge the boxes must NOT break rank into men; each unit STAYS A BOX"
Switch: `troopsOpts: { look: "counter", counter: "A5" }` (= A4 + below). Sheet: `sheet_r5.jpg` (S10 21 / 23 / 25 / 27 / 29 / 30.5 s,
v14 lineblocks | A4 | A5, each with a ~1.8x bridge crop). Share clip re-rendered with A5.
- Bridge (per routing counter, `q.a5` built after the queue): walks to the mouth on one straight leg (trapezoid pace, stops exactly there),
  turns in place onto the deck axis while its frontage narrows to 0.18 u (the deck is 0.2 u) and its depth grows x1.35, steps up to deck level
  while turning, crosses as that narrow box straight along the bridge (front first, on-screen corrected), stops past the far end, steps down and
  turns in place onto the trail, walks up it, widens back over ~1 s after 0.8 u, fades 1.0-3.5 u up the trail. Ink edge, front strip and
  NATO plate stay (the plate hides when its on-screen width < ~10 px). NO men in this look (lineblocks keep their stream).
- Queue: a counter reaches the mouth >= 1.3 s after the one ahead stepped off it, and reaches the far end >= 1.4 s after the one ahead
  turned onto the trail: even gaps, no overlap (checker).
- The about-face is shown on the counter: its top markings (front strip, thick front edge) crossfade to the other long side over the
  men's ~1 s about-face (the box never spins), so the front strip leads a retreat; the body's lighter front wall follows at the midpoint.
- Crews in the counter wall colour (#2a4577 / #6e2a1f) at 1.3x (critic 1).
- Test data (S10_gm only): the escapes leave 4.0 s earlier (ESC_T [12.9, 12.8, 11.6], was [16.9, 16.8, 15.6]) because one-box-at-a-time
  crossings take longer; last counter off the deck ~30.1 s, before the fire (31.3 s). (The v14 / A4 columns of sheet_r5 use the old times.)
- Checker (`check_troops_motion.mjs` now accepts a per-block drawn height `zh` from the look, so a box on the deck is judged at deck level):
  S10 15-35 screen long-side rule max 13-14 deg, 0 fails, pops 0, turn <= 25 deg/s, overlaps only the known south-flank self brush at 20 s
  (0.11 u); S09 55-110 = A4 (only units 1 x 3, 0.12 u).

# Round 6 (2026-11-26): A6, owner "at the bridge do NOT change the box's shape"
Switch: `counter: "A6"`. The A5 bridge path is kept (walk to the mouth, turn in place onto the deck axis, step up, cross straight front
first, step down + turn onto the trail at the far end, walk up it, fade; same queue gaps) but the box keeps its normal size and shape
(it overhangs the 0.2 u deck); the NATO X stays drawn. Guns x1.0 bronze with a side-colour ground disc again (#2c57b7 / #be3a2a, 1.2 x
gun scale, 0.35, thin ink rim) and crews back in the side colour. THE ARMIES key uses the A4 mini counter for A4-A6.
Checker: S10 15-35 0 screen fails, pops 0, overlaps only the known south-flank self brush (0.11 u, 20 s); S09 = A4 (units 1 x 3, 0.12 u;
Crocker's known 5 frames at 99.1 s). `sheet_r6.jpg`: S10 21-30.5 s (+ bridge crops) and S09 103.5 s guns, v14 | A5 | A6.
Share: RunPod RTX A4000 ($0.17/h, ~$0.01), pod terminated, list empty; concat + v14 audio, crf 24, 12.5 MB.

# Round 7 (2026-11-26): A7, owner "at the bridge the boxes must NOT be elevated"
Switch: `counter: "A7"` = A6 + : no step up / down to the deck; across the river the box stays level at its walking height, the bank heights
at the mouth and past the far end blended linearly along the crossing (no jump); a tight soft 40 % contact shadow right under the box at
its own base height, pulled toward the camera like the box (shows on the planks / water / bank); gun discs at 0.55 (thin ink rim kept).
Checker: identical to A6 (S10 0 screen fails, pops 0, known brushes only). `sheet_r7.jpg`: v14 | A6 | A7 (S10 21-30.5 s + crops, S09 103.5 s guns).
Share: RunPod RTX 3090 ($0.22/h, ~$0.01; one retry), pod terminated, list empty; concat + v14 audio, crf 24.
