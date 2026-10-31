# Judge 2 — tree looks v10 (A vs C) vs reference

Measured on tree pixels (REF frame cols 600-1050; ours full 1920x1080 tunnel frames):
- Mean RGB: REF (73,81,51) | A (54,58,35) | C (56,60,36). Both are ~25 % too dark at full frame, and the hue is ~5 deg too yellow (71 vs 76). The close-ups (73,79,46) are fine, so the darkening happens in the full-frame pass (vignette/grade on top of the trees).
- Fine-detail energy (high-pass, REF rescaled to 1080p): REF 5.4 | A 8.4 (+58 %) | C 7.0 (+31 %) | v9 13.1. Both are calmer than v9, but both are still busier than the reference.
- Near-black crown pixels (lum<25): A 5.5 % | C 3.0 % | REF 0.5 %. Both have dark holes and gaps, A twice as many as C.

## Option A: real USGS crown photos as sprites (5/10)
1. Real: the texture is real, but the outlines are jagged, angular cut-outs with straight chopped notches. Many crowns read as mossy rocks or broccoli, not trees.
2. Independent: no. Crowns are irregular and big, and they interlock into continuous jagged bands. At full frame it is "one clump" again.
3. Detail: high, but noisy.
4. Shadows: present and directional. OK.
5. Colour: big tone swings from crown to crown (yellow-olive next to blue-green). The reference is uniform.
6. Defects: cut-out edges, a few teal-grey crowns (left of the close-up), dark gaps.
7. At 1080p: the busiest look. It will fight with unit counters and front lines.

## Option C: canopy texture inside independent crown shapes (7/10)
1. Real: closest to the reference. The crowns are rounded and irregular in size, and the texture reads as leaves. Up close it is a bit blurry and camouflage-like.
2. Independent: yes. Each crown is separable, like the reference.
3. Detail: medium, but the crowns are flat. They lack the reference's lit top-left / dark bottom-right shading, which gives each crown volume.
4. Shadows: soft and correct direction. Slightly heavy.
5. Colour: hue OK, too dark at full frame.
6. Defects: a thin dark outline ring around crowns gives a sticker look. Some crowns have the same mottling (texture repetition is visible on the bigger stands). Dark gaps between packed crowns.
7. At 1080p: reads cleanly as tree lines along the river. It sits quietly under counters. This is the safer look.

## Winner: C. Three fixes
1. **Per-crown volume:** multiply each crown by a radial light ramp (+18 % at top-left, -22 % at bottom-right, centre offset about 0.3 r). Add 2-4 sub-lobe highlights per crown so the crowns read as rounded canopies like the reference, not flat discs.
2. **Kill the outline and the darkness:** remove the dark edge ring by feathering the alpha 1-1.5 px with no dark stroke. Composite the trees AFTER the vignette/grade, or exempt them from it. Then regrade the tree layer to mean RGB (73,81,51) and hue about 76 deg. Fill the gaps under the crowns with a mid-green understory (about 0.6x the crown luminance), not shadow-black, to get near-black pixels below 1 %.
3. **Calm and de-repeat the texture:** blur the canopy texture about 0.7 px and cut its contrast about 25 % to reach detail energy of about 5.5. Give each crown a random rotation, flip and texture offset from 3 or more source photos. Vary crown radius ±30 % so packed stands look less uniform.

Also missing: no v10 frame was shown with counters and front lines over the trees. Render one before the owner sees it.
