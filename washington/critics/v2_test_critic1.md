# v2 TEST CRITIC 1: Washington #21 v2 stills vs the owner-approved tests (2026-11-26)

Judged: `washington/critics/v2_test_sheet.jpg` + the full-size 1280x720 stills it was built from (scratchpad `fa|fb|fc|fd`), against
v8 3 / 5 / 20 / 35 / 50 / 60.5 s, v6 5 / 16 s, v14 20 / 40 / 55 s (extracted with ffmpeg). Each frame was split into a 3x3 grid; the numbers are
the sector means (R,G,B), lightness L and saturation S (HLS), plus the median colour of the darkest 15 % (= woods), the middle 70 % and
the brightest 15 % of the centre crop, and the mean chroma (max-min).
Allowed differences (brief): a LIGHT frost tint over the same warm patchwork in winter, sourced weather (rain 28-29 Aug, storm 25-26 Dec,
fog at Brooklyn dawn), night. They are not counted, unless they go beyond "light" or turn into a different look.

## Summary
| still | ref | score | verdict |
| --- | --- | --- | --- |
| (a) S04 colonies wide 22.8 s | v8 3 s / 5 s, v6 5 s | **6 / 10** | NOT YET |
| (b) S03 Brooklyn ferry 65.2 s, night | v8 35 s (overlays) + v8 50 s (night) | **4 / 10** | NOT YET |
| (c) S05 Trenton 8:00 a.m. 89.6 s | v8 60.5 s | **4 / 10** | NOT YET |
| (d) S07 Princeton orchard 75.9 s | v14 40 s (+ 20 / 55 s) | **7 / 10** | NOT YET |

**OK to re-render the film: NO.** The overlays (clock, THE ARMIES key, wax-seal timeline, banner) match v8 / v14 in size, position and
style, and the troop scale in (c) and (d) is right. Not ready yet: the date plate overflows (a), the night is not a night (b), Trenton is a grey,
almost woodless field (c), the wide arrows are 4x the width of the test arrows (a), and the ledger (the main new v8 overlay) is in no still.

## What matches (no action)
- Overlay geometry: legend box 33-185 x 602-686 px (v8 33-209: same corner, same margins, the width follows the names); timeline bar
  298-983 x 653-690 px = v8 exactly; seals with the gold ribbon and the italic name under the seal ("Brooklyn", "Trenton") = v8's
  "Champion Hill"; the clock plate (pocket watch, small-caps header, big time, "IN THE MORNING / AT NIGHT", italic note) = v8 35 s / v14.
- Washington's banner (d) = v8's Grant banner (gold eagle finial, name tab, portrait, flag under it).
- Troop scale (d): blue blocks 65-75 px wide (5.1-5.9 % of the frame), 22-28 px deep, men ~8-10 px, 12 x 6. v14 40 s: 70-75 px, 25-30 px, 8-10 px.
  Red blocks 55-60 px (they are further away). 15 blocks in frame, v14 ~16. Musket smoke = v14's soft low puffs.
- Troop scale (c): 75-80 px x 30-32 px at the bottom of the frame (nearest to the camera), within ~10 % of v14.
- (a) top-left and bottom sectors are within 2-6 levels of v8 3 s (TL 80,86,76 vs 82,89,81; BL 91,98,90 vs 101,106,95). The patchwork, the dark
  wood blots and the wide-cloud count (~14 in frame) are in the v8 family. Woods median (38,50,52) vs v8 (36,46,49): match.
- (d) the ground is the v14 family: woods (48,60,62) vs v14 55 s (41,57,59), mid tones (67,79,78) vs (70,80,73), sand fields with the frost
  tint (bright 123,118,99 vs 124,114,84: +15 blue = the allowed light frost).

## (a) S04 colonies wide, 22.8 s: 6 / 10, NOT YET
1. **Date plate overflows.** The "16" sits on the bottom border and the note "Fort Washington" is drawn BELOW the plate, over the map
   (zoom: plate 40-185 x 43-85 px; the note at y 88-96). v8's plate holds month / day / weekday / note inside the frame. Cause: the plate
   keeps the height of the earlier year-only plate (`["plaque.date", 0.4, { month: "1776", day: "", ... }]`) when the full plate rolls in at
   T.sixteenth. Fix: make `plaque.date` re-measure its height on every roll (overlay.js) or, without an engine change, replace the 0.4 s year-only
   plate by `["plaque.date", 0.4, { month: "1776", day: "", weekday: "", note: " " }]`-style full-height plate / a `plaque.hide` before T.sixteenth.
   Then grep every scene for a year-only plate followed by a day plate (S03 end -> S04, S05 "after dark", S06) and snap each roll.
2. **Arrows 4x too wide.** The blue (Americans) and red ribbons are ~18-20 px wide and run 900 px across the frame, the blue one out at the
   bottom edge THROUGH the legend box. The test arrows (v14 20 / 55 s, same GM look and colours) are pale lines 4-6 px wide that end inside
   the frame; v8 wide shots carry no long arrows. Fix (`_v2test_a` / S04 `arrows`, colonies): `width` / `maxWidth` 0.95 / 0.85 / 0.8 / 0.7 ->
   **0.25-0.3** (w = width x ts 6 x 0.66 = 1.0-1.2 u = ~5-6 px at dist ~250), and pull the blue arrow's first point inside the frame and clear of
   the legend (start it at y <= 560 px on screen). The colour itself (106,162,205) / (199,119,106) = the GM `ARROW_GM` tint of v14: keep.
3. **Centre and right sectors cooler and darker than v8.** Centre (79,89,82) vs v8 (90,96,81): -11 R, +1 B; ML (82,89,79) vs (90,97,88); overall
   mean (79,88,82) vs (86,92,82). The v8 frame has sunlit yellow-green ridge highlights (L 39, warm) running through the middle; ours shows
   the furrow stripes but almost no lit slopes, so the relief reads flatter and the green turns blue-grey. Fix: confirm the colonies bake really
   carries the v8 defaults (`relief_k` 0.9, `lit_k` 0.85, `wideSunK` 0.35, `exag` 5; README "v2 ground" says so) and that the S04 camera's sun
   azimuth lights the slopes as v8 does (v8 3 s: low sun from the left, tilt ~36-40); if the bake is right, the remaining cool cast is the woods
   share: the centre crop is ~35 % woods vs ~20 % in v8 3 s -> colonies `wood_scale` 2.2 -> ~1.8 or a lower wood threshold.
4. **Clouds a touch greyer and softer, two stacks overlap.** v8 / v6 wide clouds: crisp cauliflower tops, cream-white highlights, a grey core,
   each puff separate. Ours: the left-centre group (220-340 x 360-530 px) is three clouds stacked into one blurred mass, and the tops are grey
   (138,143,138 brightest band vs v8 cloud tops ~200+). Fix: colonies `clouds.scatter` seed 5 -> another seed (or a `keepClear` around
   [520, 330] colonies units) so no two puffs overlap on screen; keep n 24 / med 15.
5. (check, not a defect) No carved names at 22.8 s. v8 wide frames always carry 3-5 carved names (Vicksburg, Big Black River, Edwards...);
   ours may only show a name on its word, so confirm "Manhattan", "Fort Washington", "Hudson" each appear carved on their word in S04.

## (b) S03 Brooklyn ferry, 65.2 s (8:00 p.m., rain): 4 / 10, NOT YET
6. **The night is not a night.** The clock says "8:00 AT NIGHT" but the land is lit like an overcast afternoon: bottom sectors L 32-33,
   warm sand / rose fields (86,88,81 / 87,85,76), only the water is dark. v8's night (50 s): every sector L 13-22, mean (36,46,52),
   one blue-grey world, warm lantern points the only colour. Cause: keys at night `NI = 0.7` (v8 / S09_gm use night 1) and no
   `film.grade` night (v8 `O.film.grade(t, "night", 0.8)`, S09_gm `["film.grade", T.night, "night", 0.8]`). Fix: `NI` 0.7 -> **1.0** on the
   62.4-104.6 s keys, add `["film.grade", T.dark - 0.1, "night", 0.8]` and `["film.grade", T.firstlight - 0.1, "day", 0.8]` (NG 0.45 at
   first light stays); keep the campfires / lanterns. Re-snap and measure: target sector L <= 22.
7. **Boat wakes read as chains of glowing white beads** (two rows of 6-8 bright dots behind each boat, 330-500 x 180-310 px). No test
   frame has this; v8's night boats show small warm lamp points (3-5 px, orange). Fix: S03 `boats`: `wake` -> only while under way at
   half strength, or `wake: false` and let the deck lamp carry it (scene.js boats: `a = 0.45 * (1 - k / 9)` per foam dot; with night 1
   they will glare more, so cut them now).
8. **"Brooklyn ferry" carved name is in the fields, not at the ferry.** It sits ~330 px right of the landing where the boats are
   (label `at: [2486.0, 1149.2]`; the landing = 2476.7, 1140.1). v8 names sit on their place (Vicksburg on the town, Big Black River on the
   river). Fix: `at: [2478.0, 1142.6]` (just inland of the stairs, clear of the boats), re-snap.
9. **Troop blocks seen end-on / under the timeline.** The right block (1050-1100 x 500-570 px) is a 50 x 70 px deep column at 60 deg on
   screen, and a block is cut by the timeline bar at bottom centre (605-700 x 690-720). v14: wide 70 x 25 px lines, nothing under the HUD.
   Fix: if these are march columns on the way to the stairs, keep them, but turn the waiting regiments into lines facing the river
   (`face` toward the landing) and move the bottom-centre block >= 40 px above the timeline (or start its walk later).
10. Woods slate-blue (33,50,55; B-R 25) vs v8 close teal (45,64,66). Re-measure after defect 6 (the night grade will set it); in day shots of
    S03 the woods must measure ~(45,64,66).

## (c) S05 Trenton, 89.6 s (26 Dec, 8:00 a.m., storm): 4 / 10, NOT YET
11. **Grey wash beyond "light frost + storm".** Chroma 13.6 vs v8 27.2; woods (64,72,69, B-R 4) vs v8 (43,62,65, B-R 23): the teal is gone;
    brightest fields (109,110,95) vs (130,121,100): the warm ochre / rust patchwork is grey-olive and mauve. Cause: the Trenton keys still carry
    night 0.32 -> 0.25 at 8 a.m. (sunrise 7:20) on top of the rain veil (0.85 x 0.5). Fix: `K(CUT2, TR, ..., 0.32)` / `K(95.0, ..., 0.25)` ->
    **0.10 / 0.08** (later keys 0.2 -> 0.06, 0.16 -> 0.05, ...); keep rain x 0.5 and `shadows: false` (the storm is sourced). Target chroma >= 20,
    woods B-R >= 15.
12. **Almost no woods.** v8 close frames (35 / 60.5 s) are ~30 % wood masses along the streams and field edges; ours is open field with
    hedge clumps (~5 %), so the frame reads empty. Fix: trenton config `woods` 0.0 -> **0.03** (= princeton) + `ravine_woods` 0.6 along the
    Assunpink / creeks, re-bake trenton (keep the town, the roads and the houses as they are).
13. **No anchor in frame.** One road, no town, no river, no name: v8 60.5 s always shows the river + road net + a carved name. Fix: frame the
    8:00 shot so the Trenton head (Five Points 1355.9, 2054.5) or the Pennington road picket is in the upper third, or carve "Pennington
    road" / "Trenton" on its word.
14. Blocks 75-80 px x 30-32 px = ~6.2 % of the frame (v14 5.5 %). Fix: TR `troopScale` 0.75 -> **0.68**.
15. **The ledger is untested.** v8 60.5 s is the ledger reference, but none of the four stills shows our ledger. Fix: snap `_v2test_c` at
    T.ninehundred + 2.5 s = ~130.7 s (the "Trenton / 26 December 1776" ledger with 2-3 rows) and add it to the sheet; check size (v8 958-1238 x 43-243 px,
    top-right), the numbered rows, the italic second lines and that the legend steps out / the timeline stays as in v8.

## (d) S07 Princeton orchard, 75.9 s: 7 / 10, NOT YET
16. **American blocks too saturated.** Blue block pixels (51,81,152) vs v14 (85,98,146): a royal blue against v14's grey steel blue.
    Red matches (148,95,86 vs 138,94,83). v14 was graded `close: { toe: 34, bl: -6, gl: -1 }` (S09_gm); ours uses the v8 close default.
    Fix without touching the ground: `troopsOpts.sideCol: { u: "#3f5aa0", r: "#be3a2a" }` (createTroops3D spreads `troopsOpts` after
    `sideCol`), re-measure until the blue block median is ~(85,98,146) +- 8; apply in every scene.
17. **Stony Brook is a flat slate-blue band with hard edges** (0-110 x 120-720 px, uniform (95,110,135)), no darker channel, no bank line,
    no sheen. v8 / v14 rivers: dark navy-teal water, a lighter carved rim, wood fringe on the banks. Fix: princeton bake: use the same river
    style as brooklyn / the v8 close river (water colour + bank rim; check that the creek is not drawn as the `ice` sheet: winter `ice` 0.6 makes
    a flat pale band, use `ice` 0.25 for a creek this narrow), re-bake princeton.
18. **Milky haze in the top-right sector** (L 37, S 4, (95,102,97)) while v14 has none at a similar tilt. Fix: camera tilt 53 -> 55-56 at the
    55-74 s keys (less horizon), or lift the frost veil if any is still active there (FROST ends at 31.6 s, so check the engine distance haze
    for close regions at dist 18).
19. Wood crowns read ~1.5x coarser than v14 40 s (crowns 12-15 px vs 6-9 px; v14 55 s is closer to ours). Minor; if the lead wants it, expose
    `world.treeScale` (world.js already has it, `ts = 0.125 * O.treeScale`) through SEQ and set ~0.75 on princeton, or pull the orchard
    camera to dist 22 with ts 0.048 x 22 = 1.05.

## Overall
**OK to re-render the film: NO.** Fix 1, 2, 6, 11, 16 (these are visible on every scene of their kind). Fix 7, 8, 12, 17 in the worlds / seqs they belong to.
Then re-snap the four stills plus a fifth one with the ledger (15) and run a second look. Defects 3, 4, 9, 13, 14, 18 and 19 are small but visible
and should be fixed in the same pass. No change is asked for the overlay set itself (key, timeline, seals, clock, banner); it already matches v8.

---

# Round 2 (2026-11-26, sheet 11:44, 5 rows; worlds r2 baked 11:32-11:39, scenes rebuilt 11:41)

Measured the same way as round 1 (3x3 sector means, woods / mid / bright medians, chroma, block pixel colours), on the full-size r2
stills (`looklead/r2/a-e`), against v8 3 / 35 / 50 / 60.5 s and v14 40 / 55 s.

## Round-1 defects
| # | defect | status | evidence (r2) |
| --- | --- | --- | --- |
| 1 | date plate overflow (a) | **FIXED** | "16 / SATURDAY / Fort Washington" all inside the plate; the reframe fix covers every roll |
| 2 | wide arrows 4x too wide, through the legend (a) | **FIXED** | pale lines ~4-5 px (v14 4-6 px), the blue one ends at ~475, 480 px, clear of the legend |
| 3 | colonies centre cooler / flatter (a) | **NOT FIXED** (minor) | centre (76,86,78) vs v8 (90,96,81), ML (81,87,77) vs (90,97,88); overall (79,87,80) vs (86,92,82); the sunlit yellow-green ridge highlights of v8 are still missing |
| 4 | cloud stacks (a) | **FIXED** | seed 11: separate puffs, cream tops; one puff (370-500 x 460-580 px) sits next to the blue arrowhead but does not hide it |
| 5 | carved names in wide (check) | **FIXED** (labels added on their words; none due at 22.8 s) | |
| 6 | night not a night (b) | **PARTLY FIXED** | mean (45,54,60) vs v8 night (36,46,52) (was 64,72,73); top + middle sectors L 15-23 = v8; the bottom row is still L 27-28 (v8 13-24) and the rose / olive field patches still read as colour |
| 7 | bead-chain wakes (b) | **FIXED** | warm deck lamps with a soft glow = v8 night lamp points |
| 8 | "Brooklyn ferry" in the fields (b) | **FIXED** | on the landing, by the boats |
| 9 | blocks under the timeline / end-on (b) | **PARTLY FIXED** | the centre block now clears the bar (605-670 x 595-650), but a block at 945-995 x 640-672 touches the bar's right end and another sits at 1240-1280 x 660-720 under the bottom 12 % (the rule in recipe 6) |
| 10 | slate woods (b) | **OK at night** | (20,34,43) B-R 26 = the night grade; in day shots woods measure (47,62,65) (d) = v8 (45,64,66) |
| 11 | Trenton grey (c) | **FIXED** | chroma 30.7 (v8 27.2), mid (101,94,74) vs v8 35 s (114,102,84), warm ochre / rust / green patchwork, frost only a light tint |
| 12 | Trenton no woods (c) | **FIXED** (acceptable) | woods 0.06 + ravine woods; wood masses along the top and the creek valley (e), less than v8 but the frame no longer reads empty |
| 13 | no anchor (c) | **FIXED** | the town on its two streets, Knox's guns at the head, Hessians in the streets, carved "Trenton", the creek |
| 14 | Trenton block size (c) | **FIXED** | ts 0.68; the Hessians stand as columns in the streets (35-40 x 55 px, end-on): right for "forming in the streets", not a scale fault |
| 15 | ledger untested | **FIXED** | (e) top-right parchment list 958-1238 x 43-143 px = v8 position / width, title + italic date, numbered caps rows, hairlines; legend steps out, timeline + clock stay = v8 60.5 s. (v8 rows carry italic second lines; ours have none: optional, the recipe allows `note`) |
| 16 | American blocks too saturated (d) | **FIXED** | blue block median (94,109,154) vs v14 (85,98,146) (was 51,81,152); red (144,94,82) vs (138,94,83) |
| 17 | Stony Brook flat band (d) | **NOT FIXED** | at the orchard camera the brook is still a flat, evenly textured slate band (62,78,90) with hard edges and no bank rim (0-110 x 130-720 px). The r2 world still 2 shows a natural teal creek further upstream, so this stretch is the winter `ice` sheet. Fix: princeton `winter.ice` 0.6 -> 0.25 (or no ice on creeks < 15 u wide), re-bake princeton |
| 18 | milky haze top-left / top-right (d) | **NOT FIXED** | TL (97,103,99) L 39 S 3, TC (88,95,89) S 3 (round 1: 95,102,97 / 83,90,88): the far woods are still grey-white, v14 keeps its teal to the top edge. Tilt 55.5 did not remove it, so it is the engine's close distance haze / frost over the far third. Fix: S07 orchard keys `at` y -1.5 u (put less far ground in frame) and check whether `FROST` or the world `snow_alpha 0.22` (r2 raised it from 0.16) whitens the far woods; target TL saturation >= 8 |
| 19 | coarse crowns (d) | open (minor, accepted as v14 55 s-like) | |

## New in round 2
20. **(d) the Stony Brook bridge floats on tall stilts beside the road.** The trestle deck stands ~60 px above the water on long legs and
    meets the post road only at its right end; the road on the left bank runs ~90 px below the deck. v14 / v8 bridges lie flat on the river at
    road level. Fix: the princeton bridge feature: height / `lift` to road level and its span centred on the post road crossing (1476.5, 1849.7).
21. **(e) a "cloth fold" ridge at the right** (880-1280 x 180-580 px): the Assunpink bank rises as one sharp crease with the field texture
    stretched over it and the woods draped on the crest. v8 relief is rounded. Fix: trenton `exag` 3.6 -> **3.0** (or `relief_noise` [2.0, 0.6]
    -> [1.4, 0.4]); re-bake trenton.
22. (c) minor: the 8:00 a.m. clock note says "Trenton" while the carved "Trenton" is on screen: the same word twice. Use a different note
    (e.g. "the storm still blowing", as round 1) or keep it; no test rule, cosmetic.

## Round 2 scores
| still | score | verdict |
| --- | --- | --- |
| (a) S04 colonies wide | **8 / 10** | MATCH (defect 3 is small; fix it in the worlds pass, no re-test) |
| (b) S03 Brooklyn ferry night | **7 / 10** | NOT YET (defect 6 bottom row, defect 9) |
| (c) S05 Trenton 8:00 a.m. | **8.5 / 10** | MATCH |
| (d) S07 Princeton orchard | **7 / 10** | NOT YET (defects 17, 18, 20) |
| (e) S05 Trenton ledger | **8 / 10** | MATCH (defect 21 small) |

**OK to re-render the film: NO, not yet. Only (b) and (d) need another check.** Overlays, troop scale and troop colours now match the tests
everywhere; the day palette matches in (c) / (e). Remaining before the re-render:
- (b) night: lower the land under the night grade (bottom row L 27-28 -> <= 22: `film.grade` night 0.8 -> 0.9, or the S03 night keys' `at` so
  less of the lit near field is in frame) and keep every block out of the bottom 12 % / off the timeline (defect 9).
- (d) princeton `winter.ice` 0.25 (17), the bridge at road level (20), the far-field haze (18), then re-snap (b) 65.2 s and (d) 75.9 s.
If those two re-snaps clear, the film may be re-rendered with defects 3 and 21 fixed in the same worlds pass (no further test round needed).

---

# Round 3 (2026-11-26, sheet 12:07; r3 worlds: princeton 11:52, scenes rebuilt 12:04)

Same measurements on the r3 stills (`looklead/r2/a-e`, overwritten 12:04-12:06 with r3).

## Round-2 open items
| # | item | status | evidence (r3) |
| --- | --- | --- | --- |
| 3 | colonies centre cooler (a) | **NOT FIXED (minor, carry-over)** | centre (78,86,76) vs v8 (90,96,81); TL (84,89,77) vs (82,89,81) and BC (103,105,93) vs (104,107,92) match. The warm ridge light is still weaker; it does not change the read of the frame. Worlds pass, no re-test |
| 6 | night land too light (b) | **FIXED** | sectors L 13-24 (v8 night 13-24), mean (38,46,53) vs v8 (36,46,52); the field patches are now only faint shapes; lamps remain the only warm colour = v8 |
| 9 | blocks at the timeline / bottom edge (b) | **FIXED** | lowest block 1060-1115 x 545-610 px; nothing below y 610 and nothing under the bar |
| 17 | Stony Brook flat band (d) | **CLOSED (not a world-texture issue)** | the band is the engine water ribbon (`world.js` `wmat` 0x2f4552 with its ripple normal map, w 0.6 u), the same material v8 / v14 use; ice 0.25 changed nothing because the band is not ground ice. At (62,78,90) it reads a little lighter than v8's rivers under the morning sky, but it is the approved engine look |
| 18 | far-field haze (d) | **CLOSED** | TL (98,105,100) L 39 S 3; v14 40 s TL is also L 39 (104,107,94, S 6): same engine haze, only ~3 points less warm. Lead's call accepted |
| 20 | Stony Brook bridge (d) | **PARTLY FIXED (minor)** | the bridge now stands on the post road (1476.4, 1849.8) and its east end meets the road; the deck still stands on ~35 px legs (deck 28.6 m over wl 23.6 m) and the west road joins below the deck. Fix in the worlds pass: `deck` = the road height at both ends (or wl + 2 m), so the deck lies at road level like the v14 / v8 bridges |
| 21 | cloth-fold ridge (e) | **FIXED** | trenton exag 3.0: the Assunpink bank is a rounded rise; fields and woods sit on it naturally |
| 22 | clock note repeats "Trenton" (c) | **FIXED** | note "the storm still blowing" |

## Also checked in round 3
- (a) arrows 0.34: pale GM lines ~6 px, ending inside the frame and clear of the legend and the timeline = v14. OK.
- (c) Greene's brigade: 2 steel-blue blocks on the Pennington road in the upper third (575-690 x 115-135 px) behind Knox's guns, the thin pale
  arrow on to the head, the Hessians forming in King / Queen St, carved "Trenton", the creek: the frame now tells the 8 a.m. story as v8 35 s
  does. Palette chroma 27.8 (v8 27.2), mid (106,103,86) vs v8 (114,102,84). OK.
- (d) one block per unit: 15 blocks in frame (v14 ~16), blue (steel) and red as round 2, line gap ~2.5-3 block widths. OK.
- (e) ledger = v8 60.5 s position / width / rows; legend out, timeline + clock in; the Trenton seal is set. OK.
- No new defects.

## Round 3 scores
| still | score | verdict |
| --- | --- | --- |
| (a) S04 colonies wide | **8.5 / 10** | MATCH (carry-over 3) |
| (b) S03 Brooklyn ferry night | **9 / 10** | MATCH |
| (c) S05 Trenton 8:00 a.m. | **9 / 10** | MATCH |
| (d) S07 Princeton orchard | **8.5 / 10** | MATCH (carry-over 20) |
| (e) S05 Trenton ledger | **9 / 10** | MATCH |

**OK to re-render the film: YES.** Palette, troop scale and colours, and every overlay (clock / date plate, THE ARMIES key, wax-seal timeline,
ledger, carved names, banner) now match v8 / v6 / v14 within the allowed winter / weather / night differences. Two small carry-overs go
into the worlds pass before the render, with no further test round: (3) warmer light on the colonies centre ridges, and (20) the Stony Brook bridge deck at road level.
Apply the recipe rules to every scene in the film, not only the test copies: night 1 + the night veil grade, no block in the bottom 12 %, arrows 0.3-0.35, sideCol / pal steel blue,
dawn keys <= 0.1 after sunrise, ledger instead of the big card. Then re-run the troop-motion checker per scene.
