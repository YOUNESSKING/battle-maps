# 1863 roads overlay, Vicksburg campaign (Style W test)

Build: `python3 make_roads.py` (options `S_WIDE=1.35 S_CLOSE=2.1 SEED=7`). Input `roads_1863.json` (control points, lat/lon), basemaps `grant/assets/vicksburg_w.jpg` / `_close.jpg` (read only).

## Outputs
- `vicksburg_roads.png`, `vicksburg_close_roads.png`: RGBA 5760x3240 (= the basemap images, hd_scale 2), same world box as `vicksburg_w` (map px 0..2880 x 0..1620, `GG.proj(10, 63513, 105473)`).
  Place each one exactly like its basemap: an `<img>` of width 2880 / height 1620 at map px (0,0) inside WORLD, directly above `#relief` (wide) / `#relief2` (close, same opacity + mask as #relief2), below the hatching, units and labels.
- Wide overlay is drawn for camera scale s = 1.35, close for s = 2.1: the track is ~4.4 px on screen at those scales (scales with the camera elsewhere). Roads stop at the river banks (cut by the basemap's blue river pixels) and fade at the map frame.
- `roads_px.json`: smoothed polylines in map px (a point every ~3 px) + the control points, for SVG paths with a constant on-screen width
  (e.g. stroke #262308, stroke-width 4.4/s, opacity ~0.6, plus a wider #c4ba80 halo at low opacity).
- `preview.jpg` (wide, s 1.35, Vicksburg to Jackson), `preview_close.jpg` (close map, s 2.1), `preview_south.jpg` (Port Gibson / Grand Gulf / Bruinsburg), `preview_full.jpg` (whole map).
- `compare.jpg`: owner reference zoom (top) vs ours at the same magnification (wide, then close). `compare_1080p_x2.jpg`: both at 1080p scale, side by side, enlarged 2x.
  Assumption: the owner's phone screenshot shows a 1080p frame at ~2.26x (2436/1080), so its ~10 px track = ~4.4 px at 1080p.

## Look (sampled from ref_roads_zoom.png)
Double-rut cart track: two dark olive ruts (#26230c, alpha 0.74, ~1.2 px each at 1080p, 2 px apart), dusty darker centre (alpha 0.36), faint lighter edge (#c4ba80, alpha 0.16), light grain and strength variation along the road, no glow, no dashes. Catmull-Rom smoothing + a small 3-octave wobble (pinned to zero at towns, so roads meet in one point).

## Roads and how sure they are
- Jackson Road: Vicksburg - Mt Alban - Bovina - Big Black - Edwards - Champion Hill (over the hill) - Bolton - Clinton - Jackson, on east (Brandon, Morton, Forest, Newton) to the map edge. Towns certain, bends approximate. **The Big Black crossing is put where this basemap draws the river (32.325, -90.709), ~2 km south of the real railroad bridge (32.347, -90.716)**, because the baked river runs east-west at the true spot.
- Raymond Road (Raymond - Coker house area - Edwards): approximate.
- Raymond - Mississippi Springs - Jackson: approximate (Mississippi Springs placed by eye).
- Port Gibson - Grindstone Ford - Willow Springs - Rocky Springs - Cayuga - Dillon's - Raymond (McClernand / Sherman): approximate; Grindstone Ford, Willow Springs, Cayuga and Dillon's placed by eye from campaign maps.
- Rocky Springs - Utica - Raymond (McPherson): approximate.
- Bruinsburg - Windsor - Shaifer house - Port Gibson: approximate; Bruinsburg snapped to the Mississippi bank of the basemap.
- Grand Gulf - Port Gibson: approximate; the Grand Gulf end snapped to the river bank.
- Baldwin's Ferry and Hall's Ferry roads to Vicksburg: approximate; ferries snapped to the Big Black as drawn on this basemap.
- Extra long trails for the "roads run off the map" look: Port Gibson - Natchez (approximate), Jackson - Canton - north edge (approximate). Drop them in `roads_1863.json` if unwanted.
- Southern Railroad: left out (the reference has no railway; a rail with ties belongs in the Style W story layer).
- Town positions are the scene's own (`s12_body_s12d.js`); roads end on those points.

Known: the roads are drawn OVER the ink tree clumps near Rocky Springs and Port Gibson (no tree mask yet; dark on dark, reads fine at 1080p).
