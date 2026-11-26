# S07 MOVE 3b: the night march to Princeton (D 126.74 s)

Build: `python3 vicksburg/tools/make_scene.py washington/sequences/S07`. Regions: trenton (z11, night = S06's end), jersey (z10 wide),
princeton (z11). Sheet: `sheet.jpg`. Built scene ~26 MB.

## Shot list
| t | shot |
| --- | --- |
| 0-16.6 | trenton night = S06's last camera (dist 58) pushing down to the creek; `engage.decide` (same call as S06) shown from 0, B lights on tReveal 0.3 ("He slipped away"), out at 2.0; plate 2 JANUARY night; four blue blocks turn about (stop -> about-face -> walk) and leave south into the dark from ~6.8; two blocks + two guns stay with the fires; label "About 500 men / keep the fires burning and dig" on "five hundred" (8.2); Washington banner leaves with the column |
| 16.6-31.7 | dissolve -> jersey night: British camp + fires at Trenton; the column on the Sandtown -> Quaker Bridge road (blue arrow along the back road on "back road" 19.8); note "the wind changes · hard frost" (23.6); frost veil (VX.rain veil only) spreads from "wind"; stamp THE MUD FROZE on "froze" (27.7) |
| 31.75-45.5 | dissolve -> jersey dawn: plate 3 JANUARY sunrise on "third" (33.2); the column up the Saw Mill road; "Princeton" on its word (35.9); ruler 12 MILES "behind the British army" (36.7); Mawhood's red block leaves Princeton SW on the post road + red arrow on "marching" (41.1) |
| 45.5-83.9 | dissolve -> princeton orchard: Mercer's two blocks (N) v Mawhood's two (S); Mercer initials banner (HM) on "Mercer" (47.9); British volley (51.2), bayonet charge + arrow (52.3), Mercer's men answer (53.7); banner greys + tips over on "shot" (55.45, engine `fall`); his men about-face and fall back (63-67); two militia blocks arrive behind (63.6) and halt; Washington banner rides out between the lines on "rode" (67.7); ruler 30 YARDS (72.0); both sides fire (74.4-75.6); British turn about and break NW, the Americans advance + arrow (80-83.6) |
| 83.9-91 | dissolve -> Nassau Hall: label on "college" (85.3); a gun fires twice (86.5, 88.55); the last British block greys on "door" (89.8) |
| 90.9-104.6 | centred result card (Jackson S07 recipe): British HUNDREDS / killed, wounded or captured / almost 200 taken prisoner; Americans < 100 / fewer than a hundred lost; "General Mercer died of his wounds"; "nine days later" |
| 105-126.7 | dissolve -> trenton dawn: red army facing the empty works, fires dying (American fires out on "dying"); Cornwallis banner (106.2); note "guns heard from Princeton" (110.2, no gun sound); red blocks about-face and march NE + red arrow on "rushed" (115.7); method card: lines 1-2 static, "3. Go where they are not" types on "Go" (123.3) |

## Facts
FACT_NOTES_jersey G2 (500 men, fires, digging), G3 (Sandtown / Quaker Bridge / Saw Mill route), G4 + J (the freeze), H1-H6 (Mawhood
leaving, the orchard, Mercer, Washington at ~30 yards, Nassau Hall ~194 surrendered, losses), F5 (Cornwallis at Trenton).

## Images
`mercer.png` = initials HM made like Jackson's `keane.png` (no likeness of the general); `washington.png`, `cornwallis.png`, flags from washington/assets.

## Open issues
- `engage.decide` cannot start at a negative time (a gsap child at t < 0 shifts the whole timeline): the card fades in over its first ~0.5 s at t 0, so under the 0.6 s scene dissolve the card may dip slightly from S06's frame.
- Jersey dawn (34-45): a sliver of the world edge shows in the top-right corner; Mawhood's red block on the post road is small at that distance.
- Nassau Hall shot: the British block reads small among the village houses.
- `check_troops_motion` trenton 0-126.7: turn spikes only at the camera cuts; red dawn about-face front-vs-velocity 21-25 deg; princeton 45.5-83.5: on-screen correction 27-34 deg on the oblique withdrawals, no overlaps; `check_side_gap` princeton 45.5-105: 0 / 0.

## Round 1 fixes (critics A 5.8 / B 7.3)
- Night march: no column. ONE wide line block (2 boxes) out of Trenton east on the Sandtown road (stop -> turn -> walk, <= 2 u/s), then after the dawn dissolve the same wide block up the Saw Mill road; arrows rebuilt along the visible legs. Jersey check 16-46: 0 overlaps, no slides (only the cut spike + Mawhood 37 deg fixed by facing along his road).
- Jersey cameras moved SW / closer: no world-edge wedge at 18-45 (checked 18, 25, 28.5, 33, 37, 40, 42.5, 44.5). Mawhood's column now starts further down the post road (in frame).
- Princeton: British withdraw and militia advance straight along their facing (no lateral shift, militia `arrive: false`); side gap 0/0.
- Nassau Hall guns off words (84.15, 90.4), grey at 90.55; Cornwallis arrow width 0.5; method card from 119.3; plate at t 0 = S06's last ("2 Thursday night"); `plaque.note` -> `plaque.date` notes (hard frost, Princeton, dawn at the creek, guns heard from Princeton).
- British leaving Trenton at dawn walk straight north (along their facing axis).

## Round 2 fixes (critics A 7.0 / B 7.9)
- Nassau Hall gun 84.15 -> 87.0 (in the gap "town," -> "surrendered", on screen); 90.4 kept. The gun is half size (bw 0.24, bd 0.2).
- Washington's banner in the first trenton shot from 2.1 (not under the choice card).
- Princeton blocks: wider and shallower (bw x1.5, bd 0.2 = thin lines, same men); side gap 0/0.
- Mawhood's block now starts AT Princeton and walks SW down the post road (n 1); arrow moved with it.
- Remaining checker items: Princeton 27-29 deg and the dawn withdrawal at Trenton 27-32 deg = on-screen correction (screen <= 13 deg).

## Round 3 fixes (critics A 7.4 / B 8.2)
- FLASH LAG (critic B R3-1): cause = `engage.decide` at t 0 inserts tweens at negative times (`film.dim` at t - 0.2 and the "OR" at tB - 0.15); GSAP then shifts every earlier child of the timeline, including the scene clock tween that drives the 3D draw (`__clk`, added first at 0), by +0.35-0.37 s, so all 3D fx ran late while the overlays (added later) stayed on time. Fix: decide `t: 0.2`, `tA/tB/tNote/tCount: 0.4`, `tReveal: 0.45` (nothing below 0; the campfires' `t0: -1` are fx data, not timeline children, and are harmless). Verified: the clock tween starts at 0 (was shifted); local snaps show the flash appearing between 51.20 and 51.27 (volley 51.23) and between 86.95 and 87.04 (gun 87.0). LESSON: never pass a time < ~0.2 to an overlay device that offsets backwards.
- Princeton: red line held 0.6 u further from the blue (RY2 1851.3); the fallen Mercer banner 1 u south of the block.

## Round 4 fixes
- S06 -> S07 join: the card no longer fades in from 0.2 (it dipped to ~30 % across the dissolve). New engine option `engage.decide({ instant: true })` (overlay.js): card, options, note, ticks and dim set fully on AT t = 0 with `tl.set` (no tween before 0, so the clock tween is not shifted). Verified: card fully visible at 0.0 / 0.1 / 0.3; flashes still on cue (brightening between 51.20 -> 51.27 for volley 51.23 and 86.95 -> 87.04 for gun 87.0).

## Round 5 fixes
- THE MUD FROZE stamp moved to [702, 1021] (clear of Washington's banner). `instant: true` decide kept; no negative times.

## V2 (owner decision 22; `washington/V2_LOOK_RECIPE.md`)
Base = `_v2test_d` (critic-approved: orchard dist 18-20, tilt 55.5, yaw held, ONE block per unit x 3 per v1 line (LX), ts 0.86 / fxScale 5.6,
v14 musketry KF 0.63 with >= 2.2 s volleys, clock 8:00 "William Clarke's orchard", legend (Mawhood), timeline + seal "Princeton" on
"surrendered", ledger instead of the big card, Washington's banner at RY2 + 3.4 + the 30 YARDS ruler from there).
Added for the film: trenton troopScale 1.4 / fxScale 9 (table), jersey 2.2 (table 1.8: a touch bigger to read at night 0.85); the night
march and the dawn march = two single-block units abreast each; the British camp at Trenton 4 single blocks; clocks 2:00 "the back road"
(on "marched", FACT G3) and 7:25 "sunrise" (FACT J) before the orchard 8:00; "hard frost" as a plate note; night 1.0 + `grade.night` on
the Trenton night, jersey night 0.85 (blocks readable); Trenton dawn night <= 0.08; arrows: jersey 1.0, trenton 0.43, princeton 0.4;
timeline hidden at 119.0 for the method card. Kept: decide `instant: true` at t 0 (no negative times), cues in word gaps.
Checks: princeton 46.5-83.5 turns <= 45 deg/s, no overlaps (residual: the leftmost red block 54 deg on screen at its 46 s entrance under the
dissolve, front-vs-velocity 21-26 deg on the outer blocks); jersey: Mawhood 32 deg world (8 on screen); side gap 0 / 0.
