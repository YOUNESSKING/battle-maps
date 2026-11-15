# gm3d/fx: deterministic 3D smoke, fire, clouds, campfires, snow (three.js)

Free experiment (not bound by the locked channel style). The target is Grand Maneuver's 3D battle
maps: cloud-deck dives between scales, low cumulus with soft shadows, translucent blue-grey powder
smoke over the lines, burning buildings and bridges, night glows and falling snow. We matched it
against the real reference "France 1814" (`/home/user/gm_ref/`, not in the repo); see `compare.jpg`.

Files: `fx.js` (the module), `demo.html` (10 s HyperFrames showcase), `lib/three.module.min.js`
(three r169, MIT, vendored so renders never fetch it), `compare.jpg` (GM reference | ours),
`stills.jpg`. `demo.mp4` is rendered locally and is not committed.

## Determinism

Everything is a pure function of timeline time `t`:
- each emitter builds a **seeded spawn list** (mulberry32) when it is created; `fx.update(t)` binary
  searches the particles alive at `t` and evaluates them in closed form (drag, buoyancy, wind,
  sine turbulence, growth, fade). No frame-to-frame state, no `Math.random`, no rAF, so frames can
  be rendered in any order or in parallel workers;
- flicker, cloud drift (`wind * t`) and snow (`wrap(base + v*t)`) are closed-form too;
- start an effect before 0 (e.g. `smokeLine(..., -25, 10)`) to open a shot on a fully formed bank.

## API

```js
import { createFX } from './fx.js';          // needs an importmap entry for "three"
const fx = createFX({
  scene, camera, renderer,
  unitsPerMeter: 1,      // world units per metre (all sizes/speeds below are metres)
  fxScale: 1.25,         // size exaggeration so effects read at map scale
  wind: [4.5, 1.6],      // m/s on x,z: smoke, embers, snow and clouds drift downwind
  sunDir: [0.55, 0.62, 0.35],
  heightAt: (x, z) => 0, // terrain height (soft ground fade, impacts); pass the world's sampler
  duration: 60, seed: 1812,
});
fx.patchGround(terrainMaterial);   // MeshStandard/Lambert: cloud shadows + firelight pools
fx.smokeLine(points, t0, t1, { look: 'gm'|'billow', dir:[x,z], rate, volley, roll, size, alpha, tint, life });
fx.cannon(pos, tBurst, { dir:[x,z], size, puffs, dust, look });
fx.impact(pos, tHit, { size });                         // shell burst: dirt fountain + flash
fx.fire(pos, t0, t1, { to:[x,y,z] /*bridge*/, area:[w,d] /*building*/, size, light, smokeTint, ramp, fadeOut, smoulder });
fx.campfire(pos, { t0, t1, size, visible: (t)=>0..1, smoke });
fx.snow({ t0, t1, count, fall, size, alpha, intensity: (t)=>0..1 });
fx.clouds({ base, top, tile, coverage /* number or (t)=>number */, shadow, resolution: 0.5, steps: 44, opacity });
fx.setNight(k);                    // 0 day .. 1 night: smoke/cloud lighting (scene lights are yours)
// per frame:
fx.update(t, camera); renderer.render(scene, camera);
```

`update()` must run before `renderer.render()` (it renders the half-resolution cloud pass into its
own target and restores the renderer state). Integration with `gm3d/world/` (`initWorld/update(t)`):
create fx with the world's scene/camera/renderer, pass the world's height sampler as `heightAt`,
call `fx.patchGround(worldTerrainMaterial)`, then `world.update(t); fx.update(t); render`.

### What each effect is
- **Sprites** (smoke, flames, glows, embers, flashes, snow) share ONE instanced draw call, sorted
  back to front every frame on the CPU. Premultiplied blending, so emissive sprites (alpha 0) are
  additive and smoke (alpha > 0) is normal in the same sorted pass. A procedural 4x2 atlas holds four
  cauliflower puffs with baked normals (lit by the sun, wrap lighting + forward scatter), two flame
  tongues, a glow and a spark. Sprite modes: lit billow, emissive, flat (snow), soft haze (GM look:
  sampled at mip bias 2.6 so it reads as translucent haze, low normal contrast).
- **Smoke looks**: `gm` (default) = translucent cool blue-grey plumes that rise and drift (what GM
  shows in "France 1814"); `billow` = dense sunlit white cauliflower (Borodino paintings).
- **Fire**: flame tongues (heat colour ramp white-yellow > orange > red), embers on curling paths,
  pulsing glow halos, a dark smoke column bending downwind and lit orange from below at night, a
  flickering PointLight and a ground light pool. Ramps up, burns, dies down, smoulders.
- **Clouds**: a raymarched slab (`base..top`) through a tileable 64^3 Perlin-Worley texture generated
  at start-up (~0.7 s), 3-tap light march toward the sun, Beer + powder, Henyey-Greenstein phase,
  interleaved-gradient jitter (static, so no temporal flicker). Drawn in a separate half-res pass
  and composited, so it never needs scene depth (the slab is above the terrain). The camera can fly
  through it: animate `coverage` up while diving (deck closes, whiteout), down after emerging.
  Cloud shadows on the ground sample the same density field projected along the sun.
- **Campfires**: a few flame sprites, a small glow, a faint smoke wisp and a light pool. Cheap
  enough for hundreds; only the 24 strongest light pools near the camera are lit per frame.
- **Snow**: flakes in a wrapping box anchored ahead of the camera, constant screen size.

## Render cost (SwiftShader software WebGL, the HyperFrames renderer here has no GPU; 1920x1080)

Per frame, one page, GPU work forced to finish (machine shared with other agents, load ~4):

| Shot | ms / frame | Notes |
| --- | --- | --- |
| Battle, day (2,100 sprites: 2 musket lines, 6 guns, 2 fires) | ~600-700 | cloud pass skipped (camera under the deck looking down) |
| Cloud dive (raymarch at 0.36 res, 36 steps) | ~1,300-1,600 | only while clouds are in view |
| Night (4,300 sprites incl. 1,600 snowflakes, 40 campfires) | ~1,200-1,400 | |

The 10 s demo (300 frames, `--workers 2`) rendered in 16 min 49 s, but with load average ~15 from
other agents' renders on the same 4 cores (≈4x contention). Unloaded estimate for a 60 s 1080p clip
of mostly battle shots: 1,800 frames x ~0.7 s / ~1.5 effective workers ≈ 15-25 min; keep cloud
dives short (2-3 s) and snow/campfire counts moderate. Biggest levers: sprite count and size
(fill rate), `clouds({ resolution, steps })`, and `antialias: false` on the renderer (MSAA is very
expensive in SwiftShader). Start-up: atlas + 64^3 cloud noise ≈ 1 s.

## Matching Grand Maneuver (see compare.jpg)

What matches: the top-down dive (scattered cumulus casting shadows, the deck closing in, whiteout,
emerging over the battlefield), drifting cloud shadows, smoke plumes drifting downwind, burning
bridge/house with dark columns, small orange night glows, snow.
Known gaps / tuning knobs:
- GM clouds are crisper cauliflower: raise `clouds({ resolution: 0.5, steps: 48 })` for hero dives
  (about 2x the cost) or `detail`.
- GM battle smoke is thinner and bluer than our demo: lower `rate` (puffs per 100 m per s) and
  `alpha`, e.g. `smokeLine(..., { rate: 4, alpha: 0.14, tint: [0.56, 0.62, 0.72] })`.
- GM fires at map scale are just small orange flecks + glow; ours read the same at distance.
- `look: 'billow'` gives the dense white Borodino-painting smoke instead.

## Sources and licences

| What | Source | Licence | How used |
| --- | --- | --- | --- |
| three.js r169 (`lib/`) | github.com/mrdoob/three.js | MIT (`lib/THREE_LICENSE.txt`) | renderer |
| Volume cloud raymarch structure (ray/box entry-exit, jittered start, front-to-back accumulation) | three.js `examples/webgl_volume_cloud.html` (r169) | MIT | adapted to an infinite slab + sun light march |
| Perlin-Worley noise, height-profile + coverage remap, detail erosion, Beer-powder | Schneider & Vos, "The Real-time Volumetric Cloudscapes of Horizon Zero Dawn" (SIGGRAPH 2015 talk) | technique (no code copied) | re-implemented |
| Henyey-Greenstein phase function | standard physics | public domain | formula |
| Interleaved gradient noise | Jimenez, "Next Generation Post Processing in Call of Duty: AW" (2014) | technique | one-line formula |
| mulberry32 PRNG | Tommy Ettinger | public domain | seeded spawn lists |
| Lit smoke sprites (normal-baked puffs), soft ground fade, premultiplied additive/alpha in one pass | common real-time VFX techniques | technique | written from scratch |

All atlas and cloud textures are generated procedurally at start-up: no third-party image assets.
