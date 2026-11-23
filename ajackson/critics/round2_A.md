# Andrew Jackson 3D: Critic A (LOOK + TROOP MOTION), round 2

Inputs: `/tmp/aj_build/jackson_round2_720.mp4`, `/tmp/aj_render2/S01..S08.mp4`. I extracted frames every 2 s for each scene, ran 1-2 fps windows and crops
on every troop and look flag, and ran `check_troops_motion.mjs` on the chalmette sections of S01 and S04-S07 and on the horseshoe section of S03
(frames are in `/tmp/aj_critic_A2/`). Film t = scene A + local t.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | One line |
|---|---|---|---|
| S01 hook | 6 | 7 | Wide blocks, a clean retreat, a counting number card and a well-timed Ghent card. The ~2 s flat white-out (owner v8) and the faceted New Orleans map remain |
| S02 Creek War | 5 | 5.5 | Banners and labels now sit inside the frame and more happens on screen. The gulf map still looks like camouflage (dark blotches), so the scene looks unfinished |
| S03 Horseshoe Bend | 5 | 7 | No void at the world edge, a sharper bend, no ledger collision, push-ins and a moving tail. The pink-brown hill smear at the neck is still there |
| S04 to New Orleans | 5 | 6 | Lake Borgne now reads (shore, gunboats, captured greys). The New Orleans world is still low-poly with large triangle facets and blur, and there is a pale void at bottom-left at 20-24 s |
| S05 night attack | 6 | 7 | Good night look, one Pakenham portrait at a time, a Keane banner and a big HALTED stamp. The 0-48 s day/decide part sits on the faceted New Orleans map |
| S06 the line | 5 | 7 | Thin parapet, half-size guns, the Carolina burns and sinks, the probe turns about, and the plan arrows and LADDERS stamp now read |
| S07 8 January | 6 | 7.5 | The best scene: fog, rank fire, NO LADDERS, Pakenham, the 93rd, HALF AN HOUR, and a clean ledger and method card. A little crab-walking is left after the cut at 73.9 s |
| S08 ending | 6 | 6.5 | The approval card, removal arrows and final cards work and the end map is clean. The gulf texture is still blotchy and the Creek hatch is cut by the top edge |
| **Overall** | **5.5** | **6.8** | Troop motion is now nearly clean. What remains is mostly the world bakes (gulf and New Orleans) plus a handful of small items |

**Fit to publish? NO, but close.** The New Orleans and gulf re-bakes are the only items above sev 2 that remain. With them, the film is >= 8.

## Round-1 findings: status

| R1 finding | Status |
|---|---|
| Retreats walk backward (S01/S03/S05/S06/S07) | **FIXED.** Worst front-vs-velocity is now 53 deg (was 180). At 5 fps the S07 main column (film 11:15-11:17) visibly turns about in place over ~2 s, then walks off front first. S01 shows no flags at all |
| Deep square or column blocks | **FIXED.** Lineblocks are now 18x4, wide on every scene sheet. In S07 the defenders read as wide blocks parallel to the parapet |
| S03 world edge in frame | **FIXED.** Checked 0-177 s: no void anywhere |
| S01 2 s grey cloud screen | **NOT FIXED (owner v8 kept).** YMIN >= 131 for the whole frame from 11.4 to ~13.6 s, still ~2 s of flat white. If the owner's white-out stays, accept it; otherwise lower the cloud peak opacity to ~0.85 so the plain shows through |
| S06 raised plinth | **FIXED.** The line now reads as a thin wall with the corner at the swamp |
| S06 block on the river / Carolina pop | **FIXED.** The probe starts on the bank, and the Carolina burns and sinks over ~2 s with a smoke column |
| S07 giant guns / defenders back | **FIXED.** Guns are half size and the infantry stands right behind the parapet |
| S03 smeared hill overlay | **NOT FIXED** (bake). The pink-brown smear on the neck hill is still visible at 6-30 s and 62-68 s (film 2:15-2:39, 3:11-3:17) |
| Gulf camouflage texture | **PARTLY.** Calmer and lighter at the coast (S03 end, S04 start, S08 0-20), but S02 (all of it) and S08 20-30 still show the dark blotch pattern |
| S02 banners cut by the frame | **FIXED** |
| New Orleans flat and blurry | **NOT FIXED.** More field patches now, but the large flat-shaded triangle facets are very visible (S01 42-62, S04 20-30 / 40-54, S05 0-48) |
| Lake Borgne empty | **FIXED** (shore in frame, 1.4x boats, shots, grey on "captured") |
| S05 crab walking | **MOSTLY FIXED.** S05 still has 20-37 deg flags on r3/r4 at 87 s and r10 at 130 s, but these are small in frame and acceptable |
| S07 snap turns | **HIDDEN.** The 69.9 / 83.4 / 107.6 s spikes fall on hard cuts (checked on the sheets: a different shot on each side). The 69.9 s spike now sits ~0.5 s before the cut, and the blocks turn gradually on screen |
| S03 ledger collision | **FIXED** |
| Two Pakenham portraits | **FIXED** (medallion 133.9-140.3 s, banner from 140.4 s) |
| S01 empty dim before Ghent | **FIXED** |
| S03 15 s static tail | **FIXED** (push-in toward New Orleans, ships 5.5) |
| S05 tiny stamp | **FIXED** (HALTED at 2x over open ground) |
| S06 plan arrows / LADDERS / the "8" | **FIXED** |
| S08 removal arrow hairline | **PARTLY.** The arrows are now readable cream lines, but the Creek and Choctaw hatches are still cut by the top edge (gulf world limit) |
| S07 fog 0-14 s | **FIXED** (units readable through it) |

## Findings, round 2 (ranked)

| Scene | local t | film t | Problem | Fix | Sev |
|---|---|---|---|---|---|
| S01, S04, S05 (New Orleans world) | S01 42-62, S04 20-30 / 40-54, S05 0-48 | 0:42-1:02, 5:26-5:36, 5:46-6:00, 6:17-7:05 | **Low-poly terrain:** large flat-shaded triangle facets, soft blur and no ground detail. Next to the painted chalmette world it looks unfinished (~90 s of the film) | Re-bake with smooth normals (or flat terrain height x0.3) and the chalmette ground texture/fields at 50 % opacity; at least disable the facet shading | 2 |
| S02, S08 (gulf world) | S02 0-46, S08 20-30 | 1:23-2:09, 13:20-13:30 | **Camouflage blotches** (dark forest patches with hard edges) | Blur the forest mask x3 and lower its opacity to ~0.5 (the coast part of the bake already looks right) | 2 |
| S04 | 20-24 | 5:26-5:30 | **Pale grey void** at the bottom-left, inside the river loop (the world edge or a missing tile under the dissolve) | Move the camera `at` +3-4 % to the east/north on the first New Orleans key, or extend the world margin | 2 |
| S03 | 6-30, 62-68 | 2:15-2:39, 3:11-3:17 | **Smeared pink-brown blob** on the neck hill (relief overlay) | Re-bake the overlay at 2x or set its opacity to 0.4 | 2 |
| S07 | 73.9-78 | 11:41-11:45 | After the cut, r19-r21 crab-walk 34-39 deg for ~5-8 s (slide 0.35-0.38); visible in the Pakenham shot | Re-key so the heading follows the velocity: turn first (<= 30 deg/s), then walk straight | 2 |
| S07 | 52-62 | 11:19-11:29 | r22 drifts at up to 53 deg off its front for ~10 s at the ditch | Hold r22 still at the ditch, or align its heading to the drift | 1 |
| S06 | 54-56 | 9:38-9:40 | Probe column r19 crab-walks 46 deg for 2 s as it starts | Rotate r19's first key to face the move | 1 |
| S01 | 11.4-13.6 | 0:11-0:14 | ~2 s flat white-out in the dive (owner v8 deck) | Accept if this is the owner's choice; otherwise cloud peak opacity 0.85 | 1 |
| S03 | 128-129 | 4:17 | The "12:30" clock plate stays on for ~1 s over the treaty map before it changes to "Fort Jackson" | Roll the plate at the dissolve | 1 |
| S03 | 170-177 | 4:59-5:06 | The fleet sits on the right frame edge; the NEXT label and the SUBSCRIBED button share the bottom-right corner | Bring the fleet 10 % into frame; show NEXT after the subscribe button leaves, or move it to bottom-left | 1 |
| S05 | 21-25 | 6:38-6:42 | The Jackson quote is a thin, small italic over the map (hard to read at 720p) | Quote size +30 % with a dark backing, or use the parchment letter device | 1 |
| S08 | 20-30 | 13:20-13:30 | Creek and Choctaw hatches run off the top edge | Accept (world limit) or fade the hatch top with a gradient | 1 |

## Top 10 fixes

1. Re-bake the New Orleans world (no triangle facets; chalmette-like ground) — S01/S04/S05, ~90 s of the film.
2. Re-bake the gulf forest mask (no camouflage blotches) — S02 and S08.
3. S04 20-24 s: keep the pale void at the bottom-left out of frame.
4. S03: re-bake the neck-hill relief overlay or lower its opacity.
5. S07 73.9-78 s: remove the r19-r21 crab walk after the cut.
6. S07 r22 drift at 52-62 s and S06 r19 at 54-56 s: align heading with motion.
7. S01 dive white-out: owner call (keep v8, or lower the peak to 0.85).
8. S03 end: separate the NEXT label from the subscribe button; bring the fleet into frame.
9. S03 4:17: roll the clock plate at the treaty dissolve.
10. S05 Jackson quote: larger, on a backing.
