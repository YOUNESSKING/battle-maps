# Carved rivers overlay (Style W test, vicksburg_w)

Build: `python3 make_rivers.py` (~1 min; options `BLUE_MIX=0.5 WIDTH=0.65 CREEK_HW=2.3 BIG_K=1.0 BIG_HW=9 SEED=5 ONLY=rivers_w|rivers_close MAP=vicksburg_w`).
**Version 2 is the owner's middle ground** ("I like how blue they are, a middle ground").
- `BLUE_MIX`: water colour, 0 = muted reference grey-blue, 1 = the old saturated Style W blue (sampled from the basemap, ~#4D7C9A). Default 0.5.
- `WIDTH`: creek width, 0 = thin reference line (~4-5 px at 1080p), 1 = the old ribbon (~15 px). Default 0.65, about 9 px of water at 1080p.
- `BIG_K`: Mississippi half-width as a fraction of the old one. Default 1.0 (full width)..
Input: the basemap JPGs `grant/assets/vicksburg_w.jpg` and `vicksburg_w_close.jpg`, read only. The script finds the water from their blue pixels itself, so it does not need the exclusion masks.

## Outputs
- `rivers_w.png`, `rivers_close.png`: RGBA, 5760x3240, the same world box as the basemaps (map px 0..2880 x 0..1620, hd_scale 2).
  They are **opaque over the old blue ribbon and its dark outline** (they repaint it as plain grass with the new, thinner water in it). Outside the ribbon there is only a soft alpha tint (the dark bank band on the NW side and a faint light lip on the SE side), so the layers under it still show through.
- `preview.jpg`: 1920x1080, wide overlay over the wide basemap, camera at map px (1440, 700), s = 1.9. Vicksburg is at the Mississippi bend and the Big Black crossing is at the centre right. `preview_before.jpg` is the same frame without the overlay. `preview_close.jpg` is the close map in the same frame.
- `compare.jpg`: four columns: old (current basemap) | middle (this build) | reference-like (`BLUE_MIX=0 WIDTH=0 BIG_K=0.9`) | owner reference. All at the same magnification (2.26x, the phone shots' scale over a 1080p frame).
  Top row: the Big Black meander next to the reference streams. Bottom row: the Mississippi at Vicksburg next to the river through Jabiyah. `preview_reflike.jpg` is the reference-like version of the preview frame.

## Insertion
- Add an `<img>` of 2880x1620 at map px (0,0) inside WORLD, the same way the basemap is placed:
  - wide: `rivers_w.png` directly above `#relief`;
  - close: `rivers_close.png` directly above `#relief2`, with the same opacity animation and mask as `#relief2`.
- Order: above the hills, the lanes and the ground texture. Below the bridges, the roads, the towns, the hatching, the units and the labels.
- Because of that order, the texture exclusion mask over the rivers can stay as it is (the overlay covers that area anyway).

## Look
- Water: halfway between the muted reference grey-blue (#70776A) and the old blue (#4D7C9A), about #5F7A80: clearly blue, softer than before. The Mississippi gets a deeper mid-channel tone and faint light streaks along the flow.
- Emboss lit from the NW: a dark wall and groove on the NW bank, a lighter wall and soft lip on the SE bank, and a thin soft dark edge on both sides of the water (heavier on the NW side).
- A soft darker bank band feathers into the grass, mostly on the NW side.
- Widths: creeks, including the Big Black, are now ~9 px of water at 1080p (was ~15 px of blue). The Mississippi keeps its full old width (~28 px at s 1.9).

## Things to know when integrating
- The creeks are now narrower, so the old blue banks became grass. **Roads that were cut at the old banks now stop ~3 px short of the water** on each side. A bridge sprite covers the gap at a crossing. A ford or road end without a bridge may show a small grass gap: either extend those road ends a few px or rebuild the road cut with the new water mask (water = `d < hw` in the script).
- Width is set in image px, so the lines get thinner at smaller camera scales and thicker when zoomed in, like the rest of the basemap.
- A few creek ends and very tight bends still show a slightly rounded tip (skeleton ends). This is minor at 1080p.
