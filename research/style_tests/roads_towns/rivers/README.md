# Carved rivers overlay (Style W test, vicksburg_w)

Build: `python3 make_rivers.py` (~1 min; options `CREEK_HW=2.3 BIG_K=0.9 BIG_HW=9 SEED=5 ONLY=rivers_w|rivers_close MAP=vicksburg_w`).
Input: the basemap JPGs `grant/assets/vicksburg_w.jpg` and `vicksburg_w_close.jpg`, read only. The script finds the water from their blue pixels itself, so it does not need the exclusion masks.

## Outputs
- `rivers_w.png`, `rivers_close.png`: RGBA, 5760x3240, the same world box as the basemaps (map px 0..2880 x 0..1620, hd_scale 2).
  They are **opaque over the old blue ribbon and its dark outline** (they repaint it as plain grass with the new, thinner water in it). Outside the ribbon there is only a soft alpha tint (the dark bank band on the NW side and a faint light lip on the SE side), so the layers under it still show through.
- `preview.jpg`: 1920x1080, wide overlay over the wide basemap, camera at map px (1440, 700), s = 1.9. Vicksburg is at the Mississippi bend and the Big Black crossing is at the centre right. `preview_before.jpg` is the same frame without the overlay. `preview_close.jpg` is the close map in the same frame.
- `compare.jpg`: the owner's reference crops on the left, ours on the right, all at the same magnification (2.26x, the phone shots' scale over a 1080p frame).
  Top row: reference streams, then the Big Black (wide), then the Big Black (close). Bottom row: the river through Jabiyah, then the Mississippi at Vicksburg.

## Insertion
- Add an `<img>` of 2880x1620 at map px (0,0) inside WORLD, the same way the basemap is placed:
  - wide: `rivers_w.png` directly above `#relief`;
  - close: `rivers_close.png` directly above `#relief2`, with the same opacity animation and mask as `#relief2`.
- Order: above the hills, the lanes and the ground texture. Below the bridges, the roads, the towns, the hatching, the units and the labels.
- Because of that order, the texture exclusion mask over the rivers can stay as it is (the overlay covers that area anyway).

## Look
- Water: muted pale grey-blue (#70776A). The Mississippi gets a deeper mid-channel tone (#58625A) and faint light streaks along the flow.
- Emboss lit from the NW: a dark wall and groove on the NW bank, a lighter wall and soft lip on the SE bank, and a thin soft dark edge on both sides of the water (heavier on the NW side).
- A soft darker bank band feathers into the grass, mostly on the NW side.
- Widths: creeks, including the Big Black, are now ~4-5 px of water at 1080p (was ~15 px of blue). The Mississippi keeps ~90 % of its width (~22 px at s 1.9), so it stays clearly the big river.

## Things to know when integrating
- The creeks are now narrower, so the old blue banks became grass. **Roads that were cut at the old banks now stop ~5 px short of the water** on each side. A bridge sprite covers the gap at a crossing. A ford or road end without a bridge may show a small grass gap: either extend those road ends a few px or rebuild the road cut with the new water mask (water = `d < hw` in the script).
- Width is set in image px, so the lines get thinner at smaller camera scales and thicker when zoomed in, like the rest of the basemap.
- A few creek ends and very tight bends still show a slightly rounded tip (skeleton ends). This is minor at 1080p.
