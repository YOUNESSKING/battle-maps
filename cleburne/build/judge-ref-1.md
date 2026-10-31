# Judge 1: GET THE IDEA (reference film map look)

Frames studied: /tmp/wa/ref_36.png (full res), crops of river/trees (3x), crops of ridge/creeks (3x), ref_6, ref_72. Ours: G1, G3, THREE-LOOKS-tunnel (A/C/E).

## 1. The film's map, ingredient by ingredient (ranked by contribution to "smooth, painted, premium")

1. **Tree crowns as a lit, shadowed 3D canopy (biggest single factor).** Each crown is a rounded blob ~12-20 px at 1280w, with a bright top-left highlight, darker lower-right side and a soft DROP SHADOW cast to the lower-right onto the ground/water. Crowns vary in size and in hue (olive, mid green, blue-green), overlap in layers, and the clump silhouette is lumpy/organic. Placement: continuous riparian ribbons hugging both banks 2-4 crowns wide, widening into dense groves on bends; open meadow gaps between; NO trees on the dry sand plain or on slopes. Dense along water only, so the ribbon reads as a design element, not noise.
2. **Relief: a soft, high-contrast hillshade with a single warm light from upper-left (NW).** Lit slopes are saturated orange-tan, shaded slopes are dark umber-brown; ridges have thin pale highlight crests, gullies are dark. The shading is multi-scale: broad forms plus fine erosion rills that look hand-sculpted, not DEM stair-steps. Plains are flat, near-uniform sand with almost no shading, so relief is a feature that "arrives" at the hills.
3. **Colour ramp: one warm hue family.** Plain = desaturated khaki-olive sand, mid slopes = tan/ochre, lit faces = orange-brown, shadow = brown-black. Hypsometric tint is subtle (lowlands slightly greener/olive, uplands warmer). Only two cool notes exist: river grey-blue and tree green. That restraint = premium.
4. **Surface texture: fine paper/grain noise over everything** (visible in the 3x crop on plains and slopes), plus faint mottling. It is uniform and low contrast, so it feels painted/printed rather than digital-flat. Smoothness comes from soft gradients plus this grain hiding banding.
5. **River: a wide, pale grey-blue ribbon with a soft darker inner edge, light sandy/grey bank strips (gravel bars) on the inside of bends, and a faint water-streak texture.** Not flat fill; value is slightly lighter in the middle, banks are feathered (no hard outline), and trees' shadows fall across it. It is calm, desaturated, no saturated blue.
6. **Hairline creeks: 1 px dark brown-grey dendritic lines, wiggly, branching, fading out, drawn over plains and slopes** (they follow the drainage). Very low contrast, but they add the "engraved map" detail without clutter.
7. **Vignette**: dark corners/edges, ~25-30% at the extreme corners; gives the cinematic frame.
8. **Labels**: serif small-caps with wide tracking, pale cream, faint shadow, very low-contrast on the plain ("VALLEY"). Date plate and scroll caption = parchment UI.

## 2. Comparison with our G1 / G3 / current look

**Captured:** warm tan palette, NW-style hillshade, green crown symbols with light shading, river in grey-blue, vignette-ish.
**Current look (A/E):** cold grey-green, low-contrast shading, flat blue river, patchy canopy mottling. Reads as a GIS render, the opposite of the film.
**G1:** relief is overly crisp and stepped (DEM terraces, road/field lines show as relief), too busy on the plains. Trees: thousands of tiny uniform balls, packed into a green carpet; they spill onto the river and read as beads/gravel, not a canopy.
**G3:** smoother, better, but still (a) plains still carry bumpy relief (film's plain is flat), (b) river is a flat uniform grey fill with a thin tan outline strip (no bank gradient, no gravel bars, no water texture, no shadows on it), (c) tree crowns: uniform size, no cast shadow on ground, no clumping/gaps, no colour variance, forests are solid blobs on slopes (film has none), (d) no creeks, (e) no grain, (f) shadow side too black-brown and flat-edged, no multi-scale softness.

Verdict on the owner's complaint: correct, G1/G3 are the film's PALETTE on our OLD geometry. The film differs in how each layer is drawn, not its colour.

## 3. Missing ingredients, by importance for "redesign, not recolour"

1. Tree rendering and placement (crown size variance 3x, hue variance, directional highlight, cast shadow, clumping, ribbons by water, gaps).
2. Flat plains + sculpted hills (tone-map/ease the hillshade by slope so low slopes go flat; blend 2-3 smoothed scales; drop micro-detail).
3. River as a rendered object (feathered banks, inner gravel/sand bars, light centre/dark edge, subtle streaks, tree shadow overlap).
4. Hairline creeks from the drainage (flow accumulation from our elevation, 1 px, brown-grey, low alpha).
5. Single warm ramp with orange lit faces and umber shadows (light from NW, ~315 deg).
6. Grain overlay + vignette.
7. Small-caps tracked serif labels (lowest priority; our labels are locked).

## 4. Must NOT copy
Their footage/frames, unit markers (blue squares, tent triangles), portrait/letter, date plate and scroll caption text/boxes, dashed arrows, wording. Do not reuse their exact map. Only the technique.

## 5. Conflicts with our locked look
- Their palette is monochrome tan; our territory multiply overlays and two-colour glowing fronts need a neutral, mid-value base: a warm orange base will tint the blue/grey territory colours (test multiply on it).
- Their dark umber shadows may swallow our 54 px counters and the glow fronts; keep shadow floor above ~30% luminance.
- Dense tree ribbons compete with unit counters and labels; keep crown contrast modest and ribbons narrow near action.
- The film's parchment UI conflicts with our locked labels/flags; do not adopt.
- Territory option 1/2 and night mode must still work over the new base.

## 6. Prioritised redesign list
1. New tree system: variable crowns (size 0.6-1.6x, 3-4 hues), highlight NW, soft shadow SE, ribbons within ~60 px of rivers/swamps at 2-4 deep, thinned elsewhere, none in open fields/slopes; never over the river.
2. Slope-weighted hillshade: flat floodplains, smooth multi-scale hills, light from NW, warm orange lit / umber shadow with a luminance floor.
3. Redraw the river: feathered banks, bars, centre-light gradient, grain, tree shadow.
4. Add hairline creeks from the elevation.
5. Warm single-hue ramp (olive plain, tan mid, orange lit).
6. Fine grain plus vignette.
7. Test the unit counters, fronts and territory multiply over it before approval.
