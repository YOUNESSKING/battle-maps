# Grand Maneuver troops + arrows: study for the GM troops test (2026-11-18)

Source: `gm_1814.mp4` (1280x720, 24 fps, local only), close battles 500-542, 640-702, 780-822, 910-952 s; 10 fps clips
of 4 s at 516, 668, 684, 790, 924 s; crops at 2-3x. No GM image is committed (sheets are git-ignored / scratch only).
Sizes are relative to the 1280-px frame width (fw) on his close battle shots (camera tilt ~50 deg, the shots we copy).

## 1. The blocks (every zoom)
| Item | His look | Measured |
| --- | --- | --- |
| Battalion | a flat plate in the side colour (French blue, Russian green, Prussian dark) carrying a dense grid of tiny standing figures | close 684 s: 40-50 px = 3.1-3.9 % fw wide, 10-15 px deep (2.6-3.5 : 1); mid 516 s: 35-42 px; wide 790 s: 25-30 px x 7-8 px |
| Front edge | ONE bright pale line along the front long edge (white, ~1-2 px), a faint pale border elsewhere | brightest pixels of the block, reads at every zoom and tells you which way the block faces |
| Figures | files seen from above read as pale stripes running front-to-back (trousers / belts / faces) over the plate colour; coats in the side colour | ~10-12 files x 4-5 ranks per block |
| Facing | blocks sit at EVERY angle: each turns with its unit's front (lines oblique to the screen, columns along their road) | no camera-facing billboards |
| Columns | on the march a block narrows to a long column (4 abreast) and the blocks follow one another along the road with small gaps | 516 s: 6-8 blocks nose to tail on the Baye road |
| Shadows | long low-sun shadows: a dark smear beside each block about as long as the block is deep, on the sunward-away side | 684 s top: shadow ~1 block depth |
| Under smoke | battle smoke sprites draw OVER the blocks (blocks half hidden in the grey curtain at 684 s) | |
| Loose men | scattered single figures / dots between the lines (skirmishers, wounded, stragglers) | dark 2-3 px dots |
| Artillery | small dark guns with crew, limber behind; small side-colour rectangles with a pale edge at mid zoom | ~1/2 a block |
| Labels | no label on every block: a small flag + name tag (white flag with the arms, dark name plate) on key units; a round portrait medallion for the general | |

## 2. How they MOVE
- Slowly. In 4 s at 684 s the blocks move < 1 % fw; a whole advance takes many seconds. The MOVE is told by the arrow; the blocks
  creep after it. A general's medallion slides along the arrow in front of his men (684-686 s, Ney).
- Long moves are columns along roads (516 s), they deploy into line at the end (fan out to the sides); lines advance straight ahead.
- Blocks never pop in or out mid-field: they are on the map when the shot opens and stay; routs = blocks turned and loosened, moving away.
- Nothing slides sideways: a block always moves along its own long axis (line forward/back) or its column axis.

## 3. The movement arrows (924 s, 684 s, 520 s)
| Item | Measured |
| --- | --- |
| Colour | pale tint of the side colour: French body (105,172,192) after his grade; pale inner highlight (127,149,160) just inside the edge; thin darker edge |
| Width | shaft ~11 px at 720p = 0.86 % fw, constant along the arrow; long smooth curves (no dashes) |
| Head | broad triangle ~3x the shaft width, ~2x the shaft width long |
| Shadow | a soft dark drop shadow on one side (it floats a little above the map) |
| Over / under | over the smoke, under the clouds and the HUD |
| Animation | grows tail -> head in ~1-1.5 s with the head riding at the front, holds, fades |

## 4. What we built from it (`engine/troops3d.js` v2, `SEQ.troops = "blocks"`)
- Plate in the side colour tilted with the ground, pale border + bright front edge (13 % of depth), 12 x 5 figures in line,
  4 x 15 in column, one block per box of the unit data (~3 per brigade, 3.1 % fw each at the S09 close camera), no standards (GM has none).
- Blocks turn with their unit; heading = unit facing, column = road tangent, plus a turn toward where the block walks; low-pass
  over +-0.9 s so wheels take ~1-2 s; a line falling back keeps facing the enemy (men turned about) and squares up to its retreat line.
- Column runs (long / oblique / sideways moves, every `lin` march key): the leading block steps off, the others wait in their slots and
  file in behind it when their place passes, nose to tail along the path, then deploy into the new line slots.
- Pace cap: an over-fast move leaves up to 3 s earlier from its preceding hold (arrives on its word): <= 1.5 x troopScale units/s average.
- Push-apart: one continuous pass along each block's own heading (pressed lines give ground, never slide, never pop).
- Escape: blocks peel off one by one into the road column and fade over the frame edge; captured blocks stay, grey and loosened.
- Guns: small side-colour plate with a pale front, dark carriage + barrel + wheels, limber, 4 crew; limbered and turned on the move, recoil per shot.
- Arrows ("gm" style): pale side tint (Union #62a3db, Confederate #d4705f), darker thin edge, pale inner highlight, soft drop shadow, same head.
- Motion QA: `node vicksburg/tools/check_troops_motion.mjs <scene> t0 t1 [region]` (slides, pops, turn rates, top speeds, vanishing blocks).
