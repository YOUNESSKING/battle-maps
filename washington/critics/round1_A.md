# Washington 3D: Critic A (LOOK + DRIFT + TROOP MOTION), round 1

Inputs: `/tmp/wx_build/washington_round1_720.mp4` (12:53), `/tmp/wx_render2/S01..S08.mp4`, `washington/critics/drift_round1.jpg` (3 columns:
ours | Jackson v4 | approved gm3d v6/v8 + troops v14), Jackson critiques `ajackson/critics/round1-4_A.md`, gm3d README.
Frames: every 2 s over the whole film (13 contact sheets), 5 fps / 2 fps windows on S01 15-21, S01 19-25, S04 0-6, S04 35-41, S05 74-89, S05 90-96,
S07 17-48 (all in `/tmp/wx_critic_A/`), luminance traces through the cloud dives (S03 ~119 s, S05 ~370 s).
Motion checker run on every scene x region (`/tmp/wx_critic_A/motion1.txt`, `motion2.txt`). Film t = scene A (`audio/scenes.json`) + local t.

## Verdict on drift (the owner's main worry)
The close battle worlds are siblings of Jackson / troops v14: Brooklyn (S02 1:52, S03), Trenton day (S05), Princeton (S07) have the same
ground, woods, boxes, banners, plates, ledger, method strip, casualty card and end cards. **The wide maps are NOT siblings.** Every wide shot on
`colonies`, `colonieswinter` and `jersey` (about 4 of the 13 minutes: 0:00-0:13, 0:30-0:38, 0:46-0:56, 1:14-1:51, 4:16-6:09, 6:46-7:05,
8:06-8:52, 9:58-10:27, 11:48-12:51) reads as a raw DEM hillshade, not the painted GM map:
- chalk-white / yellow-green specular streaks on every ridge (Watchung, Palisades, Sourland, the Hudson Highlands) - Jackson's gulf and the
  approved v8 wide have soft relief with no glare;
- no dark woods mass: Jackson / v8 wide = many small dark teal woods everywhere (v8 @3 s, J_S08_55); ours = a few flat grey-brown blobs that read
  as stains or holes (colonieswinter, jersey) or almost none (colonies);
- a pale grey-green "camouflage" field mosaic with frost wash, low contrast (winter is allowed, but the woods, relief and contrast are not the
  winter change: they are drift);
- colonies summer (S02, S04 0-22 s) is saturated green with bright cyan shallows, unlike Jackson's dark navy sea + olive land;
- the scattered wide-map clouds that Jackson and v8 always show are effectively absent (one cloud at the end, none on the opening map);
- troops on these maps are 5-25 px specks (Jackson wide boxes are ~40-60 px and always readable).
Allowed winter difference judged OK: Trenton / Princeton close ground (pale frozen fields, grey-teal woods) matches troops v14 in structure.

## Scores

| Scene | Score | Note |
|---|---|---|
| S01 | 6 | Hook map 0-13 s is the hillshade look; night crossing = lamps + floe stickers; Trenton hook shot 19-28 s good; name slam OK |
| S02 | 5.5 | Colonies summer saturated + glare ridges; fleet OK; Brooklyn close at 1:52 is a perfect sibling |
| S03 | 6.5 | Brooklyn day + ledger match Jackson; night/rain evacuation 3:08-3:42 too dark, boats are only white V wakes |
| S04 | 5 | Worst drift: colonies glare 4:16-4:52, jersey camouflage hillshade 4:54-6:09, world-edge wedge, troops invisible |
| S05 | 6 | Crossing at night unreadable (lamps), featureless 1 s grey hold, night march = overlapping smudge; Trenton day + casualty card good |
| S06 | 6 | Jersey wide again; Trenton night readable; banner collides with the WHAT WOULD YOU DO kicker |
| S07 | 5.5 | Night march as a lengthwise column + collisions + big world-edge wedge (sev 3); Princeton battle itself ~7.5 |
| S08 | 6 | End cards match Jackson; the map under them is the glare hillshade with no woods and one cloud |
| **Overall** | **5.8** | |

**Fit to publish? NO.** (Wide-map drift + the S07 column march + night readability.)

## Findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| ALL wide | - | see list above | Wide relief = hillshade with white/yellow specular streaks on ridges; nothing like Jackson gulf / v8 wide | `worlds/configs/colonies.json` + `colonieswinter.json` `exag` 6.0 -> 3.0 (eff 3.34 -> ~1.7); `jersey.json` `exag` 3.5 -> 2.0; in `world.js` line 359-361 the wide boost `(1 + 0.35*wk)` -> `(1 + 0.15*wk)` for project washington only (or a region key `wideSunK: 0.15`); winter `lit_col` (frost-pale sunlit slopes) 50 % toward the field mosaic. Re-bake the 3 wide regions, compare one still against J_S08_55 + v8 @3 s before rendering | 3 |
| ALL wide | - | " | No dark woods mass (wide woods = flat grey-brown stains #4b4641 on winter, almost none on colonies summer) | `woods` colonies/colonieswinter 0.04 -> 0.08, jersey 0.02 -> 0.07; winter wide woods colour #4b4641 -> dark teal-grey ~#34403f with the v8 multi-tone texture (`winter.conifers` 0.16 -> 0.4 on WIDE maps only so the mass keeps teal); `wood_soft.alpha` jersey 0.72 -> 0.85 like gulf | 3 |
| S02, S04 | 0-45 / 0-22 | 1:14-1:51, 4:16-4:52 | Colonies summer: saturated green fields, bright cyan shallow band; Jackson sea is dark navy | colonies `tex_grade.sat` 1.3 -> 1.1, `contrast` 1.22 -> 1.12; `sea_look.shallow` #5f8288 -> #4a6a75, `shelf_u` 6 -> 3 (z9 shelf is 2x wider on screen than gulf z8 at the same value) | 2 |
| ALL wide | - | 0:00-0:13, 4:16-6:09, 11:48-12:51 | Wide-map clouds (Jackson/v8 signature) barely visible: keepClear radii cover the framed area and `med` 30 is small at z9/z10 | colonies/colonieswinter `scatter: { seed, n: 10, med: 18 }` with keepClear only on the action (radius <= 60); jersey `scatter: { seed: 7, n: 8, med: 40 }`; S08 add 3-4 clouds in the top-right third like J_S08_55 | 2 |
| S04, S01, S02 | 0-8 / 0-12 / 25-40 | 4:16-4:24, 0:00-0:12, 1:39-1:54 | Troops on colonies are 5-25 px specks (S04 the army north of Harlem is invisible; checker: u0/r2 16 u/s with 59-67 pops while it races) | colonies units `size`/scale x2 (match Jackson gulf ~40-60 px at the same framing) or bring camera `dist` in 30 %; S04 u0/r2 move at <= 4 u/s (lengthen t1) - the arrow carries the speed, not the box | 2 |
| S07 | 17-31 | 9:58-10:12 | Night march to Princeton: the 4 blue boxes walk in single file along the road = LENGTHWISE column (owner rule: never) | Make it one wide line block (or 2 side by side) moving long side first along the arrow; or show the march only as the arrow + banner with the boxes waiting at Trenton and appearing at the Stony Brook | 3 |
| S07 | 23-48 | 10:04-10:29 | Checker: u2-u7 slide 4.8-4.9 u/s, front-vs-velocity 78-99 deg (200+ frames), overlaps u2xu3xu4 (27.7-31.4 s, 1.5 u) and u6xu7 (34.3-48 s, 1.5 u) - boxes crab sideways through each other near Stony Brook | Give u2-u7 `face` along their path (stop -> turn in place -> walk), space their paths >= 2 box widths apart (u6/u7 laterally 3 u), t1 later so v <= 2 u/s | 3 |
| S07 | 16-45 | 9:57-10:26 | Big dark world-edge wedge top-right (much larger than the flagged sliver; ~15 % of the frame on 10:14-10:26) | jersey camera keys in this span: `at` ~12 units SW (toward Trenton) or `dist` -15 %, or yaw so the NE box edge leaves the frame; check with `snap.sh` at 18, 25, 33, 40 | 3 |
| S04 | 36-42 | 5:07-5:13 | Jersey world edge visible top-right; checker r15 slide 1.16, front-vs-vel 45 deg (47 fr), r14 31 deg | camera `at` 8 units W at that key; r14/r15 face along velocity (turn first) | 2 |
| S05 | 74-88 | 6:51-7:05 | Night march from McConkey's: 4 blue boxes = an unreadable dark smudge behind the banner; checker u3-u6 slide 3.3, front-vs-vel 68-78 deg, overlaps (75-88 s, up to 1.2 u) | One or two wide line blocks spaced >= 2 widths; turn first, walk along the two routes (Sullivan River road / Greene Pennington road) under each arrow; night unit tint +25 % lum (Jackson S05 night boxes stay bright blue) | 3 |
| S05 | 33-35 | 6:10-6:12 (also S03 2:00) | Cloud dive ends in a flat, featureless grey (mean luma 199) held ~1.0 s; v6 dive shows textured cream + dark wisps | dive `hold` -0.4 s and keep vclouds erosion visible (group 1 deck torn remnants) through the cut; no pure flat frame > 0.4 s | 2 |
| S05, S01 | 0-35 / 14-19 | 5:51-6:45, 0:14-0:19, 0:56-1:03 | Night crossing: boats read only as lamps + wakes; ice floes = flat grey polygons all the same tone, too many, read as stickers | crossing `winter.floes` -40 %, floe colour 30 % toward the water colour + soft edge alpha; boat hull scale x1.5, lamp glow radius -50 %, add a faint lit hull/men silhouette (boat `halo` smaller, hull emissive 0.15); camera dist on the 2,400 shot 15 % closer | 2 |
| S05 | 37-66 | 6:13-6:43 | Checker: u0-u5 front-vs-velocity 148-176 deg (4-14 fr) = boxes back onto the boats; u9/u11/u12art/u13art 38-46 deg + slide 0.4-0.6 on the NJ landing, u13art long-side-normal 88 deg | boarding = break rank and stream forward (no backward walk); landing units turn in place before moving inland (Johnson's Ferry men must not land as formed blocks: stream out, then form) | 2 |
| S05 | 88-97 | 7:04-7:13 | Trenton approach: blue lines wheel round the ring-shaped wood and vanish INTO it; checker u1/u3/u4/u6art/u7art turn 476-755 deg/s @95.5 + slide 1.0-1.4 + overlap u1xu2 | route the blocks west of the wood (or delete the ring wood: it reads as a donut artifact also at 7:06-7:10); turns <= 60 deg/s | 2 |
| S01 | 19-25 | 0:19-0:25 | Hook Trenton shot: checker u0/u1 front-vs-vel 28-33 deg (34-38 fr), u0 slide 1.09; r4/r5 21-24 deg | face u0/u1/r4/r5 along their velocity before t0 (turn, then walk) | 2 |
| S01 | 17-19, 61-63 | 0:17-0:19, 1:01-1:03 | Crossing: u3/u7 front-vs-vel 29-37 deg, u3 slide 0.58 (Johnson's Ferry landing blocks crab) | same: turn first; land as a stream | 2 |
| S06 | 34-41 | 8:53-9:00 | Hessian / British lines r11-r14 oblique 23-36 deg + slide 0.55-0.61 approaching the Assunpink | face along velocity; walk straight | 2 |
| S07 | 46-84 | 10:27-11:05 | Princeton: r0/r1 27-34 deg (51-56 fr), u4/u5 29 deg + long-side-normal 29-30 deg | same; u4/u5 advance long side first | 2 |
| S07 | 115-120 | 11:36-11:41 | British leaving Trenton r8-r13 21-25 deg (80 fr) | face along velocity | 1 |
| S06 | 60-83 | 9:20-9:43 | WHAT WOULD YOU DO: Cornwallis banner sits on the kicker line; Washington banner under the HOLD THE CREEK box | hide both banners from the card's in to out (`banners[k].hide: [60.4, 83]`) or camera `at` so banners sit below 40 % frame height | 2 |
| S04 | 0-8 | 4:16-4:38 | Date plate still shows "30" (August) on White Plains / Fort Washington (Oct-Nov) until 4:40 | roll the plate to month-only "October 1776" on `white` (6.85), then "16 November" on `sixteenth` (9.07) | 2 |
| S03 | 70-104 | 3:08-3:42 | Night + rain evacuation: frame mean too dark, boats only white V wakes, units 10 px | night grade +15 % (Jackson S05 7:30 shot level), rain alpha -30 %, boats with hull + 2-3 men visible, camera 20 % closer on 3:14-3:26 | 2 |
| S06 | 10-20 | 8:29-8:39 | "5,500" number drawn over a white smoke puff; troops on jersey tiny | move the number 10 % up/right off the smoke; same unit scale fix as the wide maps | 1 |
| S06/S01 | - | 8:52-9:10, 0:40-0:44 | Trenton 2 Jan: red lines on the bridge / in town small and hard to read at 720p | camera dist -20 % on the bridge attacks; keep banner + arrow out of the bridge itself | 1 |
| S08 | 0-65 | 11:48-12:51 | End map = the glare hillshade (white ridge streaks) with grey woods; Jackson end map dark teal woods + clouds | fixed by the wide-world items above; add 3-4 scatter clouds right third | 2 |
| S02, S03 | 37.4, 91.0, 105.4 | 1:51, 3:28, 3:43 | Checker turn 300-500 deg/s - these fall on cuts (hidden region), not visible | none | - |

## Top 10 fixes (in order)
1. Re-bake the three wide worlds to the Jackson / v8 wide look: `exag` colonies/colonieswinter 6 -> 3, jersey 3.5 -> 2; wide sun boost 0.35 -> 0.15; frost `lit_col` halfway to the fields (kills the white ridge streaks). Sign off on one still vs J_S08_55 and v8 @3 s before rendering.
2. Wide woods: `woods` 0.04 -> 0.08 (colonies x2), jersey 0.02 -> 0.07; winter wide woods dark teal-grey (~#34403f, conifers 0.4 on wide) instead of flat #4b4641 stains.
3. S07 9:58-10:29 night march: no lengthwise column; one/two wide line blocks moving long side first, spaced, no overlaps; fix the u2-u7 crab slide.
4. S07 9:57-10:26 + S04 5:07-5:13: move the jersey camera off the world edge (at 8-12 units SW / dist -15 %).
5. S05 6:51-7:05 night march: readable wide blocks under each arrow, no overlaps, brighter night unit tint.
6. Colonies summer grade: `sat` 1.3 -> 1.1, `contrast` -> 1.12, `sea_look.shallow` darker, `shelf_u` 3.
7. Wide-map clouds on every wide shot (scatter n ~10, med 18 colonies / 40 jersey, small keepClear) + S08 end map.
8. Wide-map unit scale x2 (colonies/jersey) so boxes read like Jackson's wide boxes; S04 army moves at <= 4 u/s.
9. Night crossing (S01 0:14-0:19, S05 5:51-6:45) + S03 evacuation: floes -40 % and toned into the water; bigger boats with lit hulls, smaller lamp glows; land and board as streams, never backwards.
10. Every checker FAIL over 20 deg on a visible shot (S01 0:17-0:25, S05 7:04-7:13 incl. the ring wood, S06 8:53-9:00, S07 10:27-11:05): face along velocity before moving (stop -> turn in place -> walk); plus hide banners under the S06 choice card and roll the S04 date plate to October / 16 November.
