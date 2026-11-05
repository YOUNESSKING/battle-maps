# Deep study: owner's two reference map styles (maps only, not troops) — 2026-11-05

These are not locked. This is a test only, and nothing gets applied until the owner approves it.
Sheet: `STYLE_STUDY_sheet.jpg` (reference | first try | rebuilt). Generator: `make_style_v2.py <map> A|B OUT [creeks marsh pines]`.

## Reference A: flat illustrated map (ref_A_flat_illustrated.png)
| Element | Measured in reference | What my first try did wrong | v2 |
|---|---|---|---|
| Ground | khaki-olive mean (160,159,117); soft painterly blotches (std 7.6 at large scale, 15 at small scale), no grain, **no relief at all** | too yellow (158,153,98), flat, no blotches | measured colour + 3-scale blotch noise |
| Rivers | **few**: one main river + a handful of creeks per screen; uniform-width bands made of straight segments with sharp bends | drew every stream in the data (hundreds), plus the modern reservoir lake | main river + 11 longest creeks, uniform width (main 34 px / creek 15 px at 5760), outline simplified into straight segments; reservoir bulges become a normal river (pre-dam, Grant lock) |
| River colour | fill (217,229,235) that is lighter on the upper-left bank; blue-grey (157,170,182) **shadow on the lower-right bank only** | white rim on both sides | lit upper-left edge + offset shadow on the lower-right |
| Grass | black-ink **marsh symbol**: fans of 3-6 curved blades over 1-3 horizontal hatch lines, in clusters of 2-3 rows, ~120x90 px on screen, ~10 clusters per screen | tiny straight sticks, 10x too many | curved tapering blades + hatch lines, 360 clusters over the whole map, spaced apart |
| Pines | tight clumps of 15-40 dark cones with jagged sides, a lighter left flank, a ground shadow; ~3 clumps per screen | 5-10 plain triangles | 20-40 trees per clump, back rows drawn first, 115 clumps |
| Labels | white serif (Times-like) with a soft dark drop shadow; black town dot with a grey halo | n/a (scene labels kept) | NOT changed yet: optional next step |

## Reference B: green textured map with banners (ref_B_banners.png)
| Element | Measured | First try | v2 |
|---|---|---|---|
| Ground | dark olive-green ~ (110,105,52), fine grass-paint texture + soft lighter dry patches; relief barely visible | bright acid green with heavy hillshade relief | measured colour, fine grain + soft patches, faint relief only |
| Rivers | thin dark grey-blue line, slightly darker edge | thick dark fills, every stream | thin lines (main 9 px / creek 5 px), same 11 creeks |
| Extras | scrub/rock speckle clusters, thin double-line roads, small realistic rooftop villages, cream spaced serif labels | none | speckle clusters added; roads + villages NOT done yet |

## Not copied (owner: "only maps, not troops")
Commander banners on poles, portrait cards, X-block units: our units/fronts/territory stay as locked.
