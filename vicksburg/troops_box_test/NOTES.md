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
