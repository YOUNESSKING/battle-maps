# Painted camps, wagon parks, supply depots (1863, Style W + 2e)

## v2 (owner 2026-11-11, DEFAULT): the reference-camp look
`render_camp(..., style="v2")` (default). Matches `ref_camp.png` / `owner_ref_yarmouk.png` bottom-left: a compact,
chunky cluster on a dark trampled brown-grey patch (84,75,58) with a soft, irregular, feathered edge and a greyish
worn rim; FEW big simple objects: weathered khaki / grey-brown canvas tents and dark log huts, one long plank
shed (planks along its length), a few big crates and barrels, 1-2 warm fires with a soft halo and a thin smoke wisp;
low contrast (outlines x0.55), soft ~1.5 px painting. NO flag (pass `flag=True` to get the v1 pole flag).
- camp: one long shed at an end, 6-8 tents in two loose rows, 1-2 dull officers' wall tents, 2-3 huts, crates,
  barrels, cordwood, 1-2 horses, fires + kettle.
- wagon_park: 8-10 big covered wagons (dull canvas, dark wheels, tongue) in two loose rows, a few swung out,
  mules as small dark blobs in 2-3 loose groups, hay, crates, one fire.
- supply_depot: 1-2 long plank sheds, a short stockade of dark posts, 3-4 stacks of big crates, barrel groups,
  a tarpaulin pile, 2-3 wagons, a few mules, one fire.
v2 defaults: size camp 250 / wagon_park 240 / depot 230 u (layout built at size/obj_scale, obj_scale 2.5),
soft 0.75, feather 16, n_fires camp 2 / others 1. Night: blue-muted, moderate warm light + `*_glow.png`
(gentler than v1).

| file (ppu 2) | size px | centre px | on the 2880-px map at S 1.9 |
|---|---|---|---|
| `camp_union.png` | 570 x 373 | 291, 181 | 150 x 98 map px |
| `wagon_park.png` | 614 x 377 | 307, 187 | 162 x 99 |
| `supply_depot.png` | 512 x 383 | 276.5, 192.5 | 135 x 101 |
| `camp_night.png` + `camp_night_glow.png` | 586 x 397 | 285, 197 | 154 x 104 |
Old v1 sprites kept as `*_v1.png` (+ `camp_night_glow_v1.png`); `style="v1"` regenerates that look.
`preview_v2.jpg` (`make_preview_v2.py`): per kind, reference | v1 | v2 at 1x screen scale on vicksburg_w, then 3x.
(`preview.jpg` / `make_preview.py` are the v1 sheet; that script now shows the v2 PNGs.)
Placement, layer order and the night glow blend are as in the v1 notes below.

---
# v1 notes (first test, 2026-11-10)

v1 below is superseded by v2 above. Procedural (numpy/scipy/PIL, no AI images). Same method and palette family as the painted towns
(`research/style_tests/roads_towns/towns/make_town.py`): tiny top-down objects lit from the NW, soft SE drop
shadows scaled by object height, ambient occlusion, a warm mottled dust patch (sampled from `ref_camp.png`, lifted
to sit on the vicksburg_w green) feathered into the grass, pale trampled lanes, then a ~1 px premultiplied blur.

- `make_camp.py`: generator + demo (`python3 make_camp.py` writes the PNGs + `camps.json`)
- `make_preview.py`: `preview.jpg` (reference vs ours at screen scale on a vicksburg_w crop, 3x zooms, night)

## API
```python
from make_camp import render_camp, crop
im, (cx, cy), glow = render_camp(seed, kind="camp", size=None, orientation=0.0, side="union",
                                 date="1863-05-18", night=False, flag=True, n_fires=None, wind=-20.0,
                                 ppu=2.0, soft=0.25, feather=12.0, obj_scale=1.8)
im, (cx, cy), glow = crop(im, (cx, cy), glow)    # trim to the bounding box
```
| param | meaning |
|---|---|
| `kind` | `"camp"` (rows of A-frame tents facing company streets, a few Sibley tents, officers' wall tents with flies, musket stacks on the colour line, cook fires + kettles, log huts, a commissary shed, crates, cordwood, a few wagons/horses) · `"wagon_park"` (rows of covered wagons: hooped canvas + dark wheels + tongue, some swung out of line, ~13 % hitched to 6-mule teams, mules on picket lines, hay, horses, rutted dust) · `"supply_depot"` (1-2 long plank sheds, crate stacks, barrel clusters, tarpaulin piles, cordwood, hay, wagons loading, some with teams) |
| `size` | length along the road in u (1 u = 1 px of the 1080p frame). Defaults camp 230, wagon_park 195, depot 180; depth ~0.6 x size. Finished sprites are ~190-300 u across incl. the feather (~150-250 u of visible camp). |
| `orientation` | road angle, degrees, image coords (0 = east, 90 = south). Rows run along it; the colour line / flag is on the -y side (towards the road, i.e. to the LEFT of the road direction); rear (fires, huts) on the far side. Use orientation+180 to put the camp on the other side of the road. |
| `side`, `date` | flag on a small pole. Union: Stars and Stripes. Confederate: national flag of the date: before 1 May 1863 the First National (Stars and Bars); 1 May 1863 - 4 Mar 1865 the Second National (Stainless Banner: white field, red canton); after that the Third National. Never the battle flag as a flag. NOTE: the real Stainless Banner's canton carries the battle-flag saltire; we paint it as a plain red canton. If the owner wants to avoid any doubt, pass a date before 1863-05-01 (Stars and Bars, what most Western units still carried at Vicksburg) or `flag=False`. |
| `night` | camp dimmed to a blue-muted night tone, fires bigger and brighter, warm light on nearby tents, no smoke; also returns `glow` = a separate fire-glow RGBA layer. |
| `n_fires` | 0-3 (default camp 3, wagon park 2, depot 1). |
| `obj_scale` | object size vs layout (1.8 = chunky readable tents ~8 u long, like the reference's objects; 1.0 = realistic but specks). |
| `soft`, `feather` | extra blur (u) and dust-edge feather (u). |

## Files (all ppu = 2: 2 PNG px per 1080p screen px)
| file | size px | centre px | what |
|---|---|---|---|
| `camp_union.png` | 588 x 411 | 295, 206 | seed 1863, camp, road -12 deg, Union |
| `wagon_park.png` | 529 x 336 | 256.5, 176.5 | seed 518, wagon park, road 8 deg, Union |
| `supply_depot.png` | 375 x 325 | 193, 176 | seed 522, depot, road -25 deg, Confederate, 1863-04-20 (Stars and Bars) |
| `camp_night.png` + `camp_night_glow.png` | 621 x 466 | 309, 211 | seed 1864, camp, night, Confederate 1863-04-20 |
(`camps.json` holds the same metadata.)

## Placement on a map (e.g. vicksburg_w, 2880 x 1620 map px, camera S = 1.9 screen px per map px)
- size on the map: `w_map = png_w / (ppu * S)` -> camp_union = 588 / 3.8 = **155 x 108 map px** (wagon_park 139 x 88, depot 99 x 86, night 163 x 123).
- top-left: `left = map_x - cx / (ppu * S)`, `top = map_y - cy / (ppu * S)` where (map_x, map_y) is the camp centre. Same convention as the towns (`RTM` in `grant/tools/s12_body_s12d_rt.js`: img `width: w` map px).
- for a wider camera (smaller S) the camp shrinks with the map; re-render with a bigger `size` / `obj_scale` if it must stay readable.
- Layer order (STYLE_LOCK 2e item 9): with the towns (after roads/bridges, before hatching/units). Keep >= 20 px from labels and units.
- Night: put `camp_night.png` in the map layer (under the `K.night` overlay is fine, it is already dark) and `camp_night_glow.png` ABOVE the night overlay with `mix-blend-mode: screen` so the fires keep glowing.
