# Andrew Jackson 3D: Critic A (LOOK + TROOP MOTION), round 3

Inputs: `/tmp/aj_build/jackson_round3_720.mp4` (14:15), `/tmp/aj_render3/S01..S08.mp4`. I extracted frames every 2 s for every scene, plus 2-10 fps windows
and crops on each flag. I ran `check_troops_motion.mjs` on the chalmette sections of S01 (0-79.8), S04, S05, S06 and S07 and on the horseshoe section
of S03 (frames are in `/tmp/aj_critic_A3/`). Film t = scene A from the new `audio/scenes.json` + local t; S01 is now 79.89 s, so every later scene starts 3.8 s earlier.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | R3 | One line |
|---|---|---|---|---|
| S01 hook | 6 | 7 | 7.5 | New stakes opening with loose ship groups, the WASHINGTON BURNED tag and the river route. The counting cards, retreat and title all work. The flat white-out in the dive is now ~2.5 s |
| S02 Creek War | 5 | 5.5 | 6.5 | The gulf map is calmer and the blotches are softer. The march arrow runs south. The Jackson banner's finial is cut by the top edge at 32-38 s |
| S03 Horseshoe Bend | 5 | 7 | 8 | No neck smear, a sharp Gun Hill clearing, clean ledger, plate rolls correctly, NEXT separated from SUBSCRIBED, ship groups at the end |
| S04 to New Orleans | 5 | 6 | 7.5 | The New Orleans world is fixed (no facets, painted levee, fields). The void is gone. Lake Borgne and the bayou route read; Villeré's son works |
| S05 night attack | 6 | 7 | 7.5 | The day/decide part now sits on a good-looking New Orleans map. The night is unchanged and good. A small crab walk remains (r3/r4 at 87 s, ~25 deg) |
| S06 the line | 5 | 7 | 7.5 | Unchanged and good. r19 still crab-walks 46 deg for ~2 s at 54-56 s (small in frame) |
| S07 8 January | 6 | 7.5 | 8 | The r19-r21 crab walk after the cut is gone. Remaining flags are cut spikes or <= 35 deg for < 3 s |
| S08 ending | 6 | 6.5 | 7 | Separate ships leave in loose groups. The Creek hatch still touches the top edge (world limit) |
| **Overall** | **5.5** | **6.8** | **7.6** | Every sev-3 and sev-2 look item from rounds 1-2 is fixed except the long white-out (an owner call). What is left is polish |

**Fit to publish? YES, conditionally:** it is publishable as is. To reach >= 8, do top fixes 1-3 below (all cheap seq.js values).

## Round-2 findings: status

| R2 finding | Status |
|---|---|
| New Orleans world low-poly facets | **FIXED.** Smooth ground, painted levee, fields and town (S01 42-62, S04 20-54, S05 0-48) |
| Gulf camouflage blotches | **MOSTLY FIXED.** The coast and the S03/S04/S08 wides look calm. S02 still has a visible patch pattern, but at half strength it now reads as woods |
| S04 20-24 s void | **FIXED** |
| S03 neck-hill smear | **FIXED** (with a small Gun Hill clearing) |
| S07 r19-r21 crab walk at 73.9-78 s | **FIXED.** No flags there now. r19/r20 still show 27-30 deg for ~2 s at 114.7 s, which falls on a cut |
| S07 r22 drift at 52-62 s | **FIXED** (no longer flagged) |
| S06 r19 at 54-56 s, 46 deg | **NOT FIXED** (sev 1) |
| S01 dive white-out | **WORSE (owner deck).** Full-frame YMIN >= 131 from 11.5 to ~14.0 s: 1.5 s of flat cream, then ~1 s of brown fog before the plain appears at 14.5 s. The new opening is ~4 s shorter, so this is now a larger share of the hook |
| S03 clock plate at the treaty dissolve | **FIXED** (it reads "1814 · the Creek lands") |
| S03 NEXT vs SUBSCRIBED; fleet at the frame edge | **FIXED** |
| S05 Jackson quote small | **NOT CHANGED.** The quote is still a thin italic, though it is on a dark backing bar and readable at 720p (sev 1) |
| S08 hatch at the top edge | **NOT CHANGED** (world limit; accepted) |

## New / remaining findings (ranked)

| Scene | local t | film t | Problem | Fix | Sev |
|---|---|---|---|---|---|
| S01 | 11.5-14.3 | 0:11-0:14 | **~2.5 s with no picture** in the hook (cream white-out, then brown fog). STYLE_LOCK 1a says "something new every 2-4 s", and this gap sits right on "On the eighth of January" | Keep the v8 deck but end the flat phase sooner: `dives[0].off.clear` 0.8 -> 0.5 and `haze` 1.45 -> 1.0, and start the ground-fog veil at 30 % opacity (the plain shows by ~13.0 s). Owner call | 2 |
| S01 | 11.0-11.5 | 0:11 | A red PEACE TABLE seal pops onto the gulf just as the clouds close, so it is visible for only ~0.5 s and then swallowed | Show the seal at "peace table" (~11.4 s) only if the dive starts >= 1.5 s later; otherwise drop it or put it at 9.8 s | 1 |
| S01 | 70.4 (66.1) | 1:10 | Checker turn spikes (300-715 deg/s) fall exactly on the snap cuts (checked at 10 fps: a hard cut from the night shot to the line). Invisible | none | 0 |
| S02 | 32-38 | 1:51-1:57 | The Jackson banner rides on the top edge; its finial and label are cut | Camera `at` 3-4 % north for those keys, or anchor the banner lower | 1 |
| S02 | 0-30 | 1:19-1:49 | The gulf still shows a patchy pattern in the hill country (better than round 2) | Optional: woods at 0.35 strength in the inland part | 1 |
| S06 | 54-56 | 9:34-9:36 | r19 crab-walks 46 deg for 2 s as the probe starts | Rotate r19's first key to face its move | 1 |
| S05 | 87-92 | 7:39-7:44 | r3/r4 drift 22-26 deg for ~4 s (night, small in frame) | Align the heading with the move | 1 |
| S04 | 28-30 | 5:30-5:32 | The three approach arrows enter from outside the frame. One comes down from the top edge, across the date plate area | Shorten the top arrow so it starts below the plate (y >= 0.15) | 1 |
| S05 | 21-25 | 6:34-6:38 | The quote reads but is thin | Quote size +20 % | 1 |

Troop checker overall: 0 overlaps, 0 pops and 0 shape changes in every scene. The on-screen long-side-first test passes everywhere (max 11 deg). No block walks backward.

## Top 10 fixes

1. S01 dive: cut the flat white or fog from ~2.5 s to <= 1.2 s (owner call; values above).
2. S01: the PEACE TABLE seal either reads or goes (it is visible for only 0.5 s before the clouds).
3. S02 32-38 s: bring the Jackson banner fully into frame.
4. S06 r19 at 54-56 s: face its move.
5. S05 r3/r4 at 87-92 s: align heading with motion.
6. S04 28 s: keep the top approach arrow clear of the date plate.
7. S02: soften the inland gulf woods a little more (optional).
8. S05 quote +20 %.
9. S08: fade the top of the Creek hatch (world limit) — optional.
10. Re-check the hook pacing against Critic B now that the opening is 4 s shorter and the white-out takes a larger share of it.
