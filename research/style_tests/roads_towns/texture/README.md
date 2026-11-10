# Ground texture overlay (Style W "alive" ground) - vicksburg_w / vicksburg_w_close

Procedural painted ground detail after the owner's Yarmouk reference (`../owner_ref_yarmouk.png`): small rock clusters
(3-8 pebbles, 3-8 px, light NW top / dark SE side / soft contact shadow), occasional larger single rocks, dark grit
speckle trails on a faint pale dust haze, faint dirt/dust patches, and a large-scale soft mottle (lighter/darker grass).

## Files
- `texture_w.png` - RGBA 5760x3240, for the wide look (`vicksburg_w.jpg`)
- `texture_close.png` - RGBA 5760x3240, for the close look (`vicksburg_w_close.jpg`); rocks sit at the same places as in the wide one
- `make_texture.py` - generator (numpy / OpenCV / PIL only, ~2.5 min). Knobs: `SEED`, `DENS` (rocks/specks), `MOTTLE`, `DIRT`
- `preview.jpg` - close look + texture at camera s=1.9 around Vicksburg - Edwards, 1080p; `preview_wide.jpg` same crop on the wide look;
  `preview_before_after.jpg` (top before, bottom after); `compare.jpg` reference vs ours at 1:1; `zoom3x.jpg` pebble detail

Same box as the basemaps: 1 image px = 0.5 map px. Kept off rivers, roads (+12 px corridor), bridges, towns, labels and
woods (`../exclusion_masks/`) and off the hill hachure strokes (`../hills/*.png`); fewer near woods; more on rough/upland
ground (local relief of `vicksburg_hd_lift.jpg`) and away from water. Colours sampled from the blurred basemap.
If roads/towns/labels move, rebuild the masks then rerun `python3 make_texture.py`.

## Insert into the scene (inside #world, map px)
Layer order: basemap -> hills / lanes -> **texture** -> roads -> towns / labels / units.

```html
<img id="relief"  src="assets/relief.jpg" alt="" />
<img id="tex_w" src="assets/texture_w.png" alt=""
     style="position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none" />
<img id="relief2" src="assets/relief_close.jpg" alt="" style="position:absolute;left:0;top:0;width:2880px;height:1620px;opacity:0" />
<img id="tex_c" src="assets/texture_close.png" alt=""
     style="position:absolute;left:0;top:0;width:2880px;height:1620px;opacity:0;pointer-events:none" />
<!-- hills + lanes overlays, then the roads, towns, labels ... -->
```
If the hills/lanes images sit right above #relief / #relief2, put each texture after them but still before the roads.

`#tex_c` must follow `#relief2` exactly: in `lens()` copy the same opacity and mask:
```js
const TC = document.getElementById("tex_c");
if (TC && R2) { TC.style.opacity = R2.style.opacity; TC.style.webkitMaskImage = TC.style.maskImage = R2.style.maskImage; }
```
(`#tex_w` stays at opacity 1 under `#relief2`, so when the close art fades in, the close texture covers it at the same rock positions.)
Optional: tone it down globally with `opacity:0.8` on both images, or regenerate with `DENS=0.7` / `MOTTLE=0.8`.
