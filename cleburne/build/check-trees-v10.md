# Tree test v10: compliance check (agent 3, 2026-10-31)

Measured on H10A/H10C-tunnel.jpg (1920 px) + closeups, vs REF-frame/REF-closeup-trees and H9 (rejected).

| Owner demand | Option A (real golf-course crowns) | Option C (canopy texture in crown outlines) |
|---|---|---|
| 1 Not dots, real shape, shadows | PASS: irregular photo crowns, cast shadow SE. But shadow too hard: ground SE of trees L=46 vs open ground 105 (ratio 0.44); REF 84/111 (0.76). Black rim around every ribbon. | PASS, same shadow problem (L=46 vs 105). |
| 2 Only around the river, placement free | PARTIAL: 81% of tree px within 90 px of water (60/40% split at 60 px). Fails on the east block (x 1600-1900, y 430-900): a ~250 px wide forest along a thin creek, not a riverside ribbon; plus 2 stray clumps near (960,480). | PARTIAL: same placement (82% within 90 px), same east block. |
| 3 Not one clump, detail | PARTIAL: 1308 lit crown cores (median 75 px) vs H9 1429/55; leaf detail real, but at wide scale crowns read as a crumbly broccoli mass, many ragged/flat-sided cut-outs. | PASS: 1436 crowns, median 77 px; each crown readable with real leaf texture. |
| 4 Independent, not fused, more detail | PARTIAL: crowns overlap heavily; ragged edges merge, hard to count trees in the wide view. (Mask connectivity: largest component 46% of tree px in closeup, REF 49%, so touching itself matches REF.) | PASS (closest to REF): round separate crowns with own shade; largest component 44%. |
| 5 Not sphere trees, another type | PASS: real aerial photos (USGS HRO). Note: a mild dome light is still added (`dome` term). | PASS-with-risk: real canopy texture, but generated round outlines + dome light; at closeup looks a bit like textured balls. |
| 6 Less cartoon; keep reference rivers | PASS: water code byte-identical to v9 (speckle, dirt bank, grass strip, creeks); water pixels differ from H9 by 2.3/255 (shadows only). Trees too dark: wide-view mean RGB 58,61,37 vs REF 76,82,52. | PASS, same; trees 59,63,37 (too dark). |
| No reference pixels | PASS: only USGS public-domain imagery, SOURCES.md has bboxes + licence. | PASS |
| Test only, locks untouched | PASS: commits 4facdcf/9a9efbc touch no STYLE_LOCK/HANDOVER; HANDOVER diff vs main is the earlier Battle-15 commit e1c0e00 (not tree work, but should be merged to main). | PASS |

## Must change before showing the owner
1. Soften/lighten cast shadows ~half (target SE-ground/ground ratio ~0.75, like REF); remove the black rim.
2. Lift tree brightness ~+25% in the wide view (target mean ~76,82,52).
3. Remove or thin the east forest block (x 1600-1900) and the 2 stray clumps: ribbons only along the river.
4. Option A: drop ragged/flat-sided sprites or slightly space crowns so trees read individually; otherwise lead with C.
5. Option C: vary outline shapes/sizes more and weaken the dome term so crowns don't read as textured balls.
6. Recommend showing C first (best on demands 3-4), A as the alternative.
