# Painted farms + fenced fields (Style W 2e test, "more life")

Procedural farmstead sprites (numpy / PIL / OpenCV, no AI images) to go with the painted towns
(`research/style_tests/roads_towns/towns/make_town.py`). Same tools and palette: the town building drawer
(`_draw_building`, NW-lit gable/flat roofs, thin dark outline), the "soft" roof colours (dark brown/charcoal,
some muted red), warm tan dust yard feathered into the grass, SE drop shadows, ~0.3 u painted softening.
1863 Mississippi look: worm (split-rail) fences, cotton/corn/wheat, an orchard, a plantation with quarters.

Build: `python3 make_farm.py` (writes every PNG + `farms.json`, then runs `make_preview.py` -> `preview.jpg`, ~2 s).

## API
```python
from make_farm import render_farm, map_to_local
im, (cx, cy), info = render_farm(seed, size=60, orientation=None, n_fields=4, season="may", ppu=2.0,
                                 lane_to=None, roads=(), plantation=False, orchard=True,
                                 label=None, label_curve=None, label_size=20)
```
| param | meaning |
|---|---|
| `seed` | int, deterministic |
| `size` | long side of the field block in u (1 u = 1 px of the 1080p frame at the camera scale the sprite is made for). ~45 small farm, ~60 farm, ~80 plantation |
| `orientation` | degrees of the field grid (0 = east, 90 = south). Put it parallel to the road; None = random |
| `n_fields` | 2-6 fields (+ the yard/orchard cell) |
| `season` | `may` (default, May 1863: ploughed land, cotton rows, young corn, ripening wheat, pasture), `summer`, `autumn`, `winter` |
| `ppu` | image px per u (2.0 = the 2x PNG, as the towns) |
| `lane_to` | (x, y) u relative to the block centre: point on the road the lane runs to; the yard goes in the cell nearest it. None = the lane leaves the block along the grass strips (never across a crop) |
| `roads` | road polylines in u (block-centre relative): fields keep ~2.6 u clear of them, fences stop there |
| `plantation` | bigger house, a row of 3-5 cabins (quarters) along the back of the yard, a gin house |
| `label`, `label_curve`, `label_size` | optional name hook: `info["label"] = (RGBA, (ax, ay))` via `towns/label.py render_label_curve` (ivory engraved serif, the 2e look). Curve = Bezier points in u relative to the block centre (default: gentle arc under the farm). Features use 20-24 px; show only on the spoken word (~3.5 s) |

Returns `(cx, cy)` = image px of the block centre (the placement anchor), and `info` with `house_px`,
`lane_end_px`, `fields` (crop + furrow angle per field), `orientation_deg`, `n_buildings`, `n_trees`.

What a sprite holds: farmhouse (gable roof, brick chimneys) + 1-3 outbuildings (barn, sheds/crib), kitchen
garden, 1-3 shade trees, orchard of round tree dots in rows (shadow + NW-lit canopy), 2-6 fields with fine
furrows at varied angles and a turning headland, worm fences as thin dark zig-zags (some runs broken, a weedy
verge, a gate where the lane passes), a dusty lane with two ruts to the road. Fields are 0.8-0.86 alpha so the
painted hill relief still shows through a little.

## Sizes (ppu 2, cropped to content)
| sprite | px | size u | fields | notes |
|---|---|---|---|---|
| `coker_house.png` | 123 x 134 | 62 | 4 | Coker house, Raymond road SE of Champion Hill (fight site 16 May 1863) |
| `champion_house.png` | 182 x 165 | 82 | 5 | Champion plantation, NE shoulder of the hill by the Jackson road; quarters row |
| `generic_1.png` | 155 x 128 | 58 | 3 | orientation 24 |
| `generic_2.png` | 122 x 122 | 48 | 6 | orientation -62 |
| `label_coker_house.png`, `label_champion_house.png` | | | | label hook output (u = px / 2) |

## Placement (same convention as the towns' `RTM` in `grant/tools/s12_body_s12d_rt.js`)
Made for `grant/assets/vicksburg_w.jpg` at camera s = 1.9 (map px 0..2880 x 0..1620; map_ppu = 1/1.9 map px per u).
`k = map px per image px = map_ppu / ppu = 0.263158`; `left = map_x - cx*k`, `top = map_y - cy*k`, `w = W*k`, `h = H*k`.
All of it is in `farms.json` (`left/top/w/h`, `c`, `centre_px`, `house_px`, fields, label anchor):

| farm | block centre (map px) | left | top | w | h |
|---|---|---|---|---|---|
| Coker house | (1652, 768) | 1635.93 | 750.73 | 32.37 | 35.26 |
| Champion house | (1666, 700) | 1642.61 | 677.93 | 47.89 | 43.42 |

Positions are by eye from the campaign maps (Coker ~ south of the Raymond road between Champion Hill and Raymond,
Champion house on the hill's NE shoulder); the lane runs to the nearest point of `road_fix.fixed_roads()`
(`raymond_edwards_road` / `jackson_road`), and the field grid follows that road's direction.
Label: place the label image so its `(ax, ay)` (u) sits on the block centre: `left = c_x - ax/1.9`, `top = c_y - ay/1.9` (map px).

Layer (2e item 9): with the towns, i.e. `RTL.insertBefore(img, RTSV)` - above texture/rivers/hills, under the
road SVG (the road draws over the lane end), under hatching, units, labels and cards. Generic farms: pick a spot
on open grass next to a road, pass `lane_to`/`roads` from `map_to_local(road_pts, centre, 1/1.9)` and the road's
direction as `orientation`; keep them off woods, rivers, towns, hill crests and the action.

## Preview
`preview.jpg`: (1) screen scale, Edwards - Champion Hill - Coker - Raymond on vicksburg_w with the 2e overlays
(painted hill, lanes, texture, rivers, town sprites; roads approximated from `roads_px.json`), (2) 3x zoom,
(3) 1.5x with the two names, (4) the four sprites on the map green at 3x.
`python3 make_preview.py some.json --bare` writes `_bare.jpg` (the same crop without farms).
Reads only; nothing in `roads_towns/` or `grant/` is changed.
