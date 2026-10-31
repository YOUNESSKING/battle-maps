# Tree redesign brief (owner 2026-10-31) — TEST ONLY, never applied to a video without the owner's OK

## Owner's words (all must hold)
1. "I don't like the shape of the trees, they look like dots, they don't have shadows."
2. "We don't have to be accurate in the placement of the trees... it is not necessary to put them always." / "the trees should be just around the river."
3. "Ours looked like one clump. There is no detail. Look at the trees in there (the reference)."
4. "They should not be fused one to another, they should be independent, like the reference. And a bit more detail."
5. (on v9, procedural round crowns built from spheres) "Not these type of trees. Another type of trees. Approach the problem from different angles."
6. Earlier: our look was "a bit cartoonic"; rivers copied from the reference are liked (keep them).

## Reference
- `cleburne/build/reflook/REF-frame.png` (owner's reference film frame, 1280x720) and `REF-closeup-trees.png` (2x close-up of the river + trees).
- Measured: tree mean RGB ~ (72,79,49), saturation ~0.40, hue spread small; crown pitch ~23 px at 1280 (~35 px at 1920); trees look PHOTOGRAPHIC (real aerial canopy: irregular crowns, fine leaf texture, soft natural shadow), not cartoon/vector/procedural spheres.
- Do NOT copy pixels from the reference film into our maps (it is someone else's work); match the look by other means.

## What exists (do not repeat)
- `cleburne/tools/ref_look_v9.py` = current pipeline (ground, river, creeks are good; keep them). Its tree block (search "TREES v8" and "v9: every tree is its own sprite") builds crowns from overlapping spheres + hillshade = rejected look (v3-v9 all variations of that).
- Run: `cd /home/user/battle-maps/cleburne && python3 tools/ref_look_v9.py tunnel 2300 1450 OUT.jpg` (~20 s). Placement of trees (`pts`, only around the river) can be reused.

## Angles to explore (builder picks at least 2, shows each)
- A. Real aerial tree crowns from PUBLIC-DOMAIN imagery (e.g. USGS NAIP 0.6-1 m orthophotos via a public source, or USGS/NASA public-domain aerials; or CC0 textures from ambientCG / Poly Haven): cut individual crowns (green mask), build a sprite library, regrade to the reference palette, stamp them with own cast shadow. Record source + licence.
- B. Painterly / illustrated-realistic crowns (brush-stamped leaf clusters, irregular outlines, not spheres).
- C. Any other idea (e.g. texture synthesis from a CC0 forest canopy photo inside a mask of independent crowns).
