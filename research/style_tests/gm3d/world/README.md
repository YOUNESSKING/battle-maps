# GM3D world: a real 3D battle-map world (Grand Maneuver experiment)

Free experiment (not bound by STYLE_LOCK). A three.js world of the Big Black River campaign (17 May 1863) built from the real
elevation, rendered deterministically by HyperFrames. Look tuned against Grand Maneuver's "Napoleon's Last Masterpiece"
(frames read in place from `/home/user/gm_ref/f2s`, never copied here): ochre/olive field mosaic with strip fields and furrows,
dark blue-green dense woods, red-roofed long houses along the roads, thin slate rivers, low north-west sun for strong relief,
soft light, grey-cool haze, tilt ~44 deg wide / ~30 deg close. `compare.jpg` shows our frames next to the matching GM frames.

| File | What |
| --- | --- |
| `bake_world.py` | Python bake: heightmaps, ground textures, rivers, trees, houses, bridge, breastworks -> `assets/` |
| `world.js` | ES module: `initWorld(canvas, opts)`, `update(t)`, projection hooks, camera beats (`GM_KEYS`) |
| `demo.html` (`index.html` -> symlink) | HyperFrames composition, 10 s camera move (wide drift, dive, close drift, bridge burns at 8.5 s) |
| `demo.mp4` | the rendered demo (not committed) |
| `stills.jpg` / `compare.jpg` | 4 demo frames / our frames next to matching GM frames (`make_stills.py`; compare.jpg is git-ignored) |
| `vendor/three.min.js` | three.js r149 (UMD, `window.THREE`), the same build the grant scenes use; no CDN needed |

## Data (`python3 bake_world.py`, ~12 s)

- Elevation: `grant/assets/src/vicksburg_hd_elev.npy` (read only; 2 px per map unit of the 2880x1620 `vicksburg_hd_lift` frame,
  web-mercator zoom 10, origin and metres per unit from `grant/assets/vicksburg_hd_lift.json`).
- **World space = map units** (x east, z = map y south, 1 unit = 129.36 m); height `y = metres * exag / 129.36`.
- Two regions in that same space: **wide** (box 1100,370 + 1000x640 units: Vicksburg - Big Black - Jackson, exag 14) and
  **close** (box 1474,676 + 84x56 units round the Big Black bridge, exag 6, plus gentle procedural relief because the DEM is ~65 m/px there).
- `height_<r>.png`: 16-bit height packed in R (high) + G (low) of an RGB PNG so a canvas can read it: `m = (R*256+G)/200 - 20`.
  `height_<r>_16.png` holds the same values as a true 16-bit greyscale PNG.
- Rivers: Mississippi, Big Black, Pearl (wide; real polylines from gm_test `data/rivers.json`) and the meandered Big Black of the
  gm_test close plane (close). Each gets a water level (low bank, never rising downstream), the channel and banks are carved into
  the heightmap, and three.js lays a water ribbon on it.
- Forests: procedural layer (bottomland along rivers + steep slopes + noise, cleared from roads, towns and the breastworks' field of fire).
  `grant/assets/vicksburg_w.jpg` only has a few decorative tree symbols, so it was not usable as a woods mask.
  Wide: dark canopy texture + the woods raised 9 m in the heightmap + ~1,000 instanced crowns on the wood edges.
  Close: ~21,000 instanced low-poly crowns (icosahedra, 12 % conifers).
- Villages: Vicksburg, Jackson, Edwards, Bovina, Raymond, Bolton (houses lining the roads) + farmsteads near the bridge.
- Big Black railroad bridge (timber trestle where the Vicksburg road crosses the close river) and the cotton-bale breastworks
  (two rows of bales on a raised parapet, east bank).
- `world_data.js` sets `window.GM3D_DATA` (geo, towns, per region: box, rivers, trees, houses, bridge, breastworks). ~850 kB.

## API (`world.js`)

```html
<script src="vendor/three.min.js"></script>
<script src="assets/world_data.js"></script>
<script type="module">
  import { initWorld, GM_KEYS, gmKeys } from "./world.js";
  const world = initWorld(canvas, { base: "assets/", keys: GM_KEYS });
  window.__hf.buildReady.gm3d = world.ready;          // wait for textures + meshes (register the promise before the runtime looks)
  tl.to(st, { t: D, duration: D, ease: "none", onUpdate: () => world.update(st.t) }, 0);   // paused GSAP clock
</script>
```

- `initWorld(canvas, opts)` -> `world`. opts: `base` (assets path), `keys` (camera beats), `exag` ({wide, close}),
  `shadowSize` (2048), `shadows`, `antialias`, `bridgeBurnT` (s; centre spans vanish, timber chars), `treeScale`, `width/height`.
- `world.ready`: promise, resolves when both regions are built.
- `world.update(t)`: draws the frame for `t` seconds. Pure function of `t` (camera, light, water motion, bridge state); no clock, no
  `Math.random`, no rAF.
- Camera keys: `{t, region: "wide"|"close", at: [mapX, mapY], dist, tilt (deg from straight down), yaw (deg, 0 = north up), fov, night (0..1), ease}`.
  `ease` belongs to the segment ending at that key: `io` (default), `in`, `out`, `lin`, `cut`. Distance is interpolated in log space.
  The region is the one of the segment's first key, so a dive is `wide` key -> `close` key with `ease: "in"` (the swap happens there)
  -> `close` key with `ease: "out"`. `GM_KEYS = gmKeys(GM_T)` reproduces the gm_test beats (wide cold open, dive at 17.46 s with the swap at
  17.81 s, close battle, night flashback over Vicksburg at 44.08 s, close again at 57.18 s, 66 s).
- Overlay hook: `world.projectMap(x, y, h)` / `world.project(lat, lon, h)` -> `{x, y, visible, depth, ppu}` in canvas px
  (1920x1080), on the ground of the current region (`h` = extra height in world units). `ppu` = screen px per world unit there
  (scale unit boxes with it if wanted). `world.onFrame((w, t) => ...)` runs after every update: move HTML pins there.
  `world.latLonToMap`, `world.mapToLatLon`, `world.heightAt(x, y, region)`, `world.worldPos(x, y, h)`.
- Cloud / fx hook: `world.anchors.dive = {start, swap, end, map}` (camera times + the map point it dives onto; a cloud must fill the
  frame at `swap`), `world.anchors.bridge` / `vicksburg` (`map`, `latlon`), `world.cameraAt(t)` (camera state at any t),
  `world.camera`, `world.regions.<r>.scene` and `world.addToScene(obj, region)` (after `ready`) for 3D clouds, smoke or fire
  in the same space.

## Performance and render

- HyperFrames renders WebGL here with **software GL (SwiftShader, 4 CPU cores)**, so the frame cost depends on what else runs.
  Measured: 0.56 s/frame on a quiet machine (first 1-s test, 1 worker); the final 10 s demo (300 frames) took **16 min = 3.1 s/frame**
  while two other agents were rendering (load average 13-17). Snapshots of 2-5 stills take 20-60 s.
- Cost: wide = terrain (~160k verts) + ~900 crowns + 125 houses; close = ~21k crowns (20 tris each) + ~48k-vert terrain.
  Lambert materials (water: Standard + env map), PCF shadow map 2048 following the view, MSAA on.
  Profiled (under load): shadows ~40 % of a frame, MSAA ~25 %, close tree instances ~50 %.
  Faster options: `antialias: false`, `shadowSize: 1024` or `shadows: false`, `meshDiv: {wide: 4, close: 3}`, fewer trees
  (bake `spacing`), or render at 1280x720 and upscale.
- Commands (from this folder; purge `/root/.cache/hyperframes/history` before long renders):
  `npx hyperframes snapshot . --at 1,4,7,9.5 --no-end -o <dir>` and `npx hyperframes render . -c demo.html -o demo.mp4`.

## Known limits / next

- Clouds, smoke, fire come from `../fx/`; HTML unit boxes and cards from `../overlay/` (stick them with `projectMap`).
- Night mode only dims and cools the light (no town lights yet).
- The wide texture is ~4 px per unit, so the dive must swap to the close region (behind a cloud) below ~150 units of distance.
