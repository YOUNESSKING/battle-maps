# Vicksburg GM3D engine

The approved v8 clip (`research/style_tests/gm3d/clip/`) turned into a data-driven scene engine. A scene is one `seq.js`
(`window.SEQ = {...}`); the engine builds the 3D world, clouds, the cloud dive, the 3D gold title, smoke / fire / guns, Style W
boxes and arrows, generals' banners, pinned place names, the GM overlay and the grade from it, all as a **pure function of t on ONE
paused GSAP timeline** (`window.__timelines.main`, `window.__hf.buildReady.vxScene`, `#root[data-composition-id=main][data-duration]`).
Scenes are silent; `window.CUES` / `cues.json` list a sound cue for every visible shot, volley, fire and dive.

**Regression:** `sequences/test_v8/seq.js` rebuilds the 66 s v8 clip from data. `regression_v8.jpg` = original | engine | diff x4 at
10 times: mean |diff| 0.00-0.57 (of 255), p99 <= 2; two engine runs are byte-identical. Details at the end.

## Files
| File | What |
| --- | --- |
| `scene.js` | the runtime (module): reads `window.SEQ`, builds everything, `window.__draw(t)` per frame |
| `template.html` | page skeleton (DOM layers, CSS, the timeline); `tools/make_scene.py` fills in the data scripts + duration |
| `seqlib.js` | `window.VX`: helpers for authors (march, line, deploy, place, town, river, road, dive timings) + `VX.cues(SEQ)` (also runs in node) |
| `world.js` | the 3D world (clip `world.js` generalised: any regions by name, `kind` wide/close, features from region data) |
| `fx.js`, `overlay.js`, `banner.js`, `troops3d.js` | verbatim copies of the clip's (smoke/fire/clouds, GM overlay, banners, boxes/arrows/blocks) |
| `vendor/` (three r169, gsap), `cloudtex/noise128.bin`, `assets/fonts/`, `assets/generals/*.png`, `assets/flags/*.png` | shared assets |

Tools (`vicksburg/tools/`): `make_scene.py <seqdir>` (build), `snap.sh <scene> <t,t,...> [out]` (stills), `regress_sheet.py`
(side-by-side + diff), `probe.mjs <scene> <t>` (headless Chrome with console output: use when a still comes out blank),
`clip_to_bundles.py` (clip assets -> `worlds/_clip_wide` + `worlds/bigblack`).

## Workflow
```bash
python3 vicksburg/tools/make_scene.py vicksburg/sequences/s09_champion     # -> vicksburg/scenes/s09_champion/ (+ cues.json)
bash vicksburg/tools/snap.sh vicksburg/scenes/s09_champion 3,20,47.5       # -> /tmp/vx_engine/snap_s09_champion/frame-*.png
tar czf /tmp/vx_s09.tgz -C vicksburg/scenes s09_champion                   # for the pod (research/runpod/README.md): ~20 MB
```
The scene folder holds COPIES of the engine, `worlds/geo.js`, `worlds/places.js` (from `data/geo.json`), only the regions the
scene uses, and `seq/` (the sequence folder: `seq.js` + its images, referenced as `"seq/<file>"`). `vicksburg/scenes/` is
git-ignored (generated). Rebuild after every engine / world / seq change. Render on the pod with `--start/--end` chunks as for the clip.

## SEQ schema
Coordinates are map units of the `vicksburg_hd_lift` frame (x east, y south, 1 unit = 129.36 m). Times in seconds of the scene.
Every list is optional except `D`, `regions`, `keys`.
```js
window.SEQ = {
  name: "s10_bigblack", D: 75, T: { ... },          // T: your narration beats (copied to cues.json for the assembler)
  date: "1863-05-17",                              // picks the US flag (34 stars before 4 Jul 1863, 35 from it)
  regions: ["wide", "bigblack"],                   // world bundles used (vicksburg/worlds/<name>/); kind "wide" | "close" from region.js
  regionOpts: { wide: { troopScale: 10 } },        // defaults: troopScale (box/arrow size) 10 wide / 1 close, fxScale 40 / 9, seed 1863 / 1517
  features: { bigblack: { bridges: [{ burn: 38.9 }], pontoons: [{ at: 58.8 }, { hidden: true }] } },
      // bridges intact unless burn (a fire on the bridge burns it at its t0 + 3.2 automatically); pontoons: missing = there from the start,
      // at = unrolls over 0.7 s from t, hidden = never. Works (breastworks / forts / rifle pits) always show.
  keys: [ { t: 0, region: "wide", at: [1560, 712], dist: 640, tilt: 46, yaw: -3, fov: 30, night: 0, ease: "io" }, ... ],
      // camera: tilt = deg from straight down, yaw 0 = north up, dist in units. ease of the segment ENDING at the key: io | in | out | lin | cut.
      // Two keys at the same t = a cut (second one wins: give it ease "cut"). night 0..1 (moonlit world, night grade).
  dives: [ { t: 16.4, over: [1518, 706], from: { region: "wide", at: [1532, 709], dist: 545, tilt: 44, yaw: 0 },
             to: { region: "bigblack", at: [1519.6, 704.6], dist: 40, tilt: 38, yaw: -2, fov: 32 }, keys: { emerge: { at: [...] } } } ],
  clouds: { wide: { scatter: {box, n, med, seed}, keepClear: [[x, y, R, ky, rk]], corners: [[x, y, r]], wisps: [[x, y, r]], extra, bounds,
                    nightErode: 0.4, keepDiveLook: false, opts: {} },  bigblack: { shadows: true } },   // false = no clouds in that region
  title: { text: "ONE DAY", tOn: 11.29, tGrow: 11.81, tOff, anchorT: 12.2, region, depth: 0.28, width: 0.62, up: 0.06,
           font: "cinzel-latin-700-normal.woff2" },   // font: optional woff2 in engine/assets/fonts (default Cormorant Garamond 700, whose figures are old-style)
  units: [ ... ], arrows: [ ... ], banners: [ ... ], labels: [ ... ], boats: [ ... ],
  fx: { fires: [], smokeLines: [], volleys: [], guns: [], impacts: [], flashes: [], campfires: [] },   // or one ordered list [{kind, ...}]
  overlay: [ ["plaque.date", 0.4, {...}], ["medallion", {...}], (O, ctx) => {...} ],
  generals: { mcclernand: { img: "seq/mcclernand.png", side: "us", name: "McClernand", full: "John A. McClernand", role: "Major General" } },
  grade: { close: { sat: 0.98 } }, film: { grain: 0.04 }, troops: "boxes" | "blocks",
  start: { fadeIn: 0.8 }, end: { fadeAt: 64.95, dur: 1.0 },          // fades from / to black (default none: scenes are concatenated)
  build: async (ctx) => {}, draw: (t, ctx) => {},                      // escape hatches (ctx = {THREE, world, FX, O, tl, G, ...})
};
```

### The dive (`dives`)
The v8 cloud dive, every phase relative to the swap time `t` (hidden in the white): `VX.diveTimes(t)` =
`push t-3.8` (push-in starts; the title flies past the lens) `deckIn t-1.7` (deck closes in; whoosh cue at +0.15) `full t-0.55`
`deck t-0.45` `wIn t-0.35` (cool veil) `SW t` (region swap, veil opaque 2 frames either side) `warm t+0.15` (cream) `emerge t+0.85`
(target snaps in) `clear t+1.15` `haze t+1.8` `land t+3.35` (camera lands, ease-out). The engine inserts the six camera keys
(`from` -> deck over `over` -> swap -> `to`), the wide cloud deck around `over`, the close stratus sheets around `to.at`, the white-out,
the emergence fog, the grade / grain / vignette changes and the overlay film grade (`none` inside, `day` or `night` after). Give one
ordinary key before the push (e.g. t = 0) and the next ordinary key after `land`. Keep wide labels' `t1` <= `full - 0.3` (the deck covers
them anyway) and close labels' `t0` >= `SW + 1`. Override any generated key with `keys: { push|deck|swFrom|swTo|emerge|land: {...} }`.
Default close-side distances scale with `to.dist / 40`. Dives go wide -> close (close -> close works; a reverse zoom-out is not built).

### Units
```js
{ side: "u" | "r", type: "inf" | "art", n: 4, region: "bigblack",       // n boxes side by side (region default: first close region)
  keys: [[t, x, y], [t, x, y, "lin"], ...],                             // centre; segments ease in-out, "lin" = constant pace (VX.march)
  face: "east" | Math.PI | ...,                                          // direction the line faces (default u: west, r: east)
  t0, t1,                                                                // fade in / out 0.6 s
  cap: 34.0, capN: 2,                                                    // the first capN boxes turn grey from cap (alias captured)
  escape: { road: [[x, y], ...] | "main", start: [x, y], t0, v: 2.1, v2: 1.2, slowX, join: "west", from: 2, fade: "west" },
      // boxes i >= from peel off into a road column at t0, nose to tail at v units/s, v2 past slowX (e.g. the west end of a bridge),
      // fade over the frame edge; escaping boxes ignore the push-apart. join west|east|north|south|nearest.
  march: true, bw, bd, gap, wob }                                        // march = column look in "blocks" mode; sizes x troopScale
```
Boxes of different units are pushed apart every frame (deterministic). Units only draw while the camera is in their region.

### Arrows, banners, labels, boats
```js
arrows:  { side: "u" | "r" | color: "#...", pts: [[x, y], ...], t0, dur, t1, region, width: 0.32 }   // grows over dur (ease-out), fades at t1
banners: { general: "grant" | {img, flag, name, side}, keys: [[t, x, y]], t0, t1, region, escape: {...} }   // one per side on screen
labels:  { text, at: [x, y] | town: "Bovina", size, t0, t1, region, river: true }   // pinned to the ground; dimmed under clouds / the title
boats:   { region, kind: "steamer" | "gunboat" | [kinds], n, t0, t1, lamp, wake, size,
           river: 0 | "mississippi", y0, vy, dy, lane }     // v8 mode: follows the river by map-y (north-south rivers), boats dy apart
           // or path: [[x, y], ...], s0, speed, spacing   // any route at constant speed
           // or path + sAt: (t, i) => arc length of boat i at t (any schedule: slowing for a bend, a disabled boat drifting); h: height above the ground
```
Generals built in (`engine/assets/generals/`): grant, pemberton, sherman, mcpherson, porter (acting rear admiral), grierson, johnston,
lincoln, davis, halleck. Any other: `generals: { key: { img, flag?, side, name, full, role } }` (img path relative to the scene root,
e.g. a PNG in the sequence folder -> `"seq/x.png"`; flag defaults by side + `date`).

### fx (positions `[x, y, h]`, h = height above the ground in units, defaults per kind)
```js
fires:      { region, at: [x, y, h] | bridge: 0, to: [x, y, h], t0, t1, preset: "bridge" | "smoulder" | "column" | "steamer" | "house",
              opts: {...fx.fire options}, waterGlow: { t1 }, cue: t | false, burn: t | false }
smokeLines: { region, pts: [[x, y]], t0, t1, opts: { dir, rate, volley, size, height, ... }, cue: true }   // GM battalion curtains
volleys:    same as smokeLines, cue on by default (one "volley" cue every opts.volley or 1.6 s)
guns:       { region, at: [x, y], dir: [dx, dy], preset: "field" | "battery", size, h, opts,
              shots: [t, ... | { t, at, dir, impact: [x, y], delay, flash: { at, h, opts } }], impact, delay: 0.85, impactOpts, boom: true }
              // cues: "gun" per shot + "boom" at the impact
impacts / flashes: { region, at, t, opts }    campfires: { region, pts: [[x, y]], t0, t1, opts }    custom: { region, fn(t, push) }
```
Only put fx where the camera sees them: every gun / volley / fire makes a sound cue.

### Overlay (`O` = `GMOverlay`, 1920x1080 space; API in `research/style_tests/gm3d/overlay/README.md`)
`["path.to.method", ...args]` calls `O.path.to.method(...args)` in order; an object arg with `general: "grant"` gets its `img`, `side`,
`name` (full) and `role` filled in. `world: [x, y]` anchors follow the ground; `world: (t) => [x, y, h]` follows anything moving (a boat). Devices: `plaque.date / clock / run / note / hide`,
`timeline.show / go / seal / hide` (wax seals), `legend` (THE ARMIES), `medallion` (card / plate), `inset` (oval painting), `place`,
`label`, `letter`, `quote`, `title`, `number` (3D-style gold number), `distance`, `ledger.show / add / final / hide`,
`film.grade / dim / set`.

## Helpers (`window.VX`, usable inside seq.js)
`VX.place("Raymond")` -> [x, y] from `data/geo.json` (full name, name before " (", or prefix; `VX.placeInfo` = full record) ·
`VX.town(name, region?)` (region / geo.js towns) · `VX.region(name)` · `VX.river(region, i|name)` · `VX.riverAtY(region, river, y)` ·
`VX.road(region, i|name)` · `VX.bridge(region, i)` · `VX.work(region, i)` (works polyline) ·
`VX.march(path, t0, speed, {hold, from, to, step})` -> keys at constant pace · `VX.marchEnd(...)` · `VX.line(a, b, n)` (n centres on a line) ·
`VX.deploy([a, b], t, k, n)` -> key [t, x, y] for unit k of n on a line · `VX.along(path, s)` · `VX.sub(path, s0, s1)` · `VX.reverse` · `VX.len` ·
`VX.faceTo(from, to)` · `VX.FACE.east...` · `VX.diveTimes(t)` · `VX.hsh(i, k)` (deterministic hash) · `VX.cues(SEQ)`.

## Region bundles (from the baker)
`worlds/<name>/region.js`: `kind`, `box`, `hm`, `exag`, `rivers [{name, w, pts [[x, y, h_m]]}]`, `roads [{name, pts}]`, `houses`, `trees`,
`towns`, `features: { bridges: [{x, z, angle, len, wl, deck, spans}], works: [{kind: "breastwork" | "fort" | "redan" | "lunette" | "rifle",
pts, closed, height_m}], pontoons: [{x, z, angle, len, wl}] }` (+ `meshDiv`; `height_m` scales the parapet profile). Works: the glacis faces the RIGHT-hand side of the walking direction
(a line drawn north -> south faces east). Nothing in the engine knows any coordinate: positions come from region data or seq.js.
`_clip_wide` / `bigblack` are the clip's own bakes (the clip's Big Black corridor is ~3 km south of the real one: use the baker's
corrected bundle for the film, keep these two for the regression only).

## Performance (SwiftShader, 4 cores)
Build ~8 s after the world loads (cloud noise 4 s), a still ~5 s; `snap.sh` of 10 stills ~50 s. The cloud raymarch (wide, deck) and
the shadow maps dominate; dive frames are the slowest. Pod: ~6 s per film second (runpod README). Close regions with 40k trees are fine;
keep units <= ~250 boxes per region (instanced, `max` 256 in `createBoxes3D`), smoke sprites <= 24k per region.

## LESSONS
- fx seeds come from the creation ORDER inside one region's fx instance: reordering `fx` entries changes the smoke (still deterministic).
  The grouped order is fires, smokeLines, volleys, guns (cannon, flash, impact per shot), impacts, flashes, campfires.
- Never `await` font or image loading inside the build: on this SwiftShader set-up `document.fonts.load` / image loads did not settle
  during the module's build and the snapshot came out with a blank 3D canvas. HyperFrames waits for fonts and images itself.
- A still that comes out blank / grey with the overlay alone = the build threw or stalled: run `node tools/probe.mjs <scene> <t>`
  (prints the page console) and set `debug: true` in SEQ for build-stage timings.
- After a dive the wide clouds return to their pre-dive look (v8 kept the "inside the cloud" parameters for the rest of the clip;
  `keepDiveLook: true` reproduces that, the regression uses it).
- The v8 clip's date plaque sometimes measured its text before the fonts were in (text overflowing the frame at 3 s); the engine draws
  the first frame after the overlay exists, so its plaque is the correct size (this is the 3 s difference in the regression).
- Camera keys default to fov 30, yaw 0, tilt 45, night 0 (a key without fov used to give NaN projections: a blank fog-grey frame).
- Wide clouds scatter automatically over the region (Poisson clusters, ~14 per 860x640 units); at camera dist < ~400 a cluster can sit
  right over the subject: add `keepClear: [[x, y, R, ky, rk]]` (or `clouds: { wide: { scatter: { seed: 3 } } }`, or `false`).
- Baker bundles checked on the engine: `sequences/_wide_smoke`, `_siege_smoke` (wide + siege), `_engine_demo` (clip bundles: march,
  deploy, wide-scale units, title without a dive, gunboats, house fire, volleys, Sherman banner). Batteries in `features.batteries`
  are not drawn by the engine: put `type: "art"` units on them.
- Labels on wide shots: names under the 3D title hide, names under clouds dim; keep river names italic (`river: true`).
- Boxes / arrows sizes are map units scaled by `troopScale`: a close camera at dist 25-40 suits 1, the wide map at 400-650 suits ~10.

- `S.draw(t, ctx)` runs AFTER the frame has rendered: anything that must change in the 3D scene for this frame (a mesh's visibility, a
  custom moving fire) belongs in an fx custom emitter (`ctx.FX[region].custom((t, push) => ...)` from `build`), which runs in beforeRender.
  `fx.custom` entries are not part of the grouped `fx` object (fires/smokeLines/...): register them in `build` (S01, S03 do).
- The ordered-list form of `fx` (`[{kind, ...}]`) gets NO sound cues from `VX.cues` (it looks for kind "guns"/"fires", the scene for
  "gun"/"fire"): use the grouped object form until that is reconciled.
- Fires on the wide map (fxScale 40) are tiny with the default presets: a burning bridge seen at dist 250-700 needs `preset: "column",
  opts: { size: 16 }` (S01) to read as a flame at the river.
- `title.font` picks another woff2 for the 3D title: Cormorant's figures are old-style ("5", "18" look like lowercase), use Cinzel for digits.

- `O.letter(..., { marks: false })` types the quote text as given (no automatic curly quotes around it): for a paraphrased
  message with only a few words in quote marks (S06 Sherman: this road will be jammed, "as sure as life."). Default unchanged.
- `O.letter(..., { qSize: 30, height: 250, top: 680 })`: optional bigger typed body (default 18 px is ~12 px at 720p; a `\n` in the quote
  breaks the line) and a taller card to hold it (S11 round 2). Defaults unchanged.

- Units with the same `group` key are not pushed apart from each other: lets a scene swap one unit for a bigger copy of itself
  (own `bw` / `bd`) with a short crossfade when the camera pulls far back (S06: thicker boxes on the 450-unit wide shots).
- `VX.markers(list)` (wagons, cattle, corn mills, a courier rider, people; ground-pinned DOM icons moving along paths, pure function of t),
  `VX.pulses(list)` (S07's pulsing disc, generalised) and `VX.rain(keys)` (streaks + grey veil on a canvas under the overlay):
  each returns `{ build(ctx), draw(t, ctx) }`, called from `SEQ.build` / `SEQ.draw` (see S06 / S08).

## Regression numbers (t: mean |diff| / p99 / % px > 24)
3 s 0.32 / 2 / 0.26 (plaque size, see LESSONS) · 9 s 0.01 · 12 s 0.00 · 15.5 s 0.00 · 17.5 s 0.57 / 1 / 0.11 · 22 s 0.24 / 1 / 0.30 ·
31.5 s 0.09 · 35.2 s 0.07 · 50 s 0.01 · 60.5 s 0.05. The remaining diffs are the banner portraits' resampling (sub-pixel) and
whole-frame noise of 1 level; the original clip itself varies run to run by up to 0.2 mean at 17.5 / 60.5 s.

- Round 2 (S01-S04 agent), all backward-compatible: `dives[].off` = per-dive phase offsets from the swap that override `VX.DIVE_OFF`
  (S01: `{ push: -6.9, warm: 0.05, emerge: 0.15, clear: 0.4, haze: 1.05 }` = the push starts on its word, white-out ~0.27 s; the whoosh cue
  still uses the default deckIn). A cut key with `dissolve: dur` crossfades from the frozen last frame before the cut into the new shot
  (an extra render per frame while it runs; S01 montage, S03 night -> dawn -> wide). Boats: `h` may be a function `(t, i)` (a sinking boat).
  `O.distance(..., { dash: false })` draws a solid ruler line (Style W: no dashed lines). `O.letter(..., { qSize, height })` = a larger,
  wrapping quote line and the card height (1920 space). Custom fx sprites with `mode` 2 (`push(..., cell, 2)`) are flat unlit with normal
  alpha: use them for TRUE colours on water (#be3a2a red river, #2c57b7 Union-blue river); mode 1 is additive and washes out to pink/cyan.
- Wide-map fires: a `column` fire needs ~3 s to build; start it before the shot that shows it (S01 Big Black: t0 38.2, `cue: 41.3`).

- Round 3 (S09-S12 agent): `O.letter(..., { lag, stagger, partDur })` = when the header / title / sub / ornament fade in after the band
  (defaults 0.3 / 0.15 / 0.5 s, unchanged); S12 uses 0.05 / 0.06 / 0.35 so the title arrives with the band (no empty cream band).
  Scene-level fix for sheared off-centre boxes in low close shots: a narrower lens from further away (fov 21-22, dist x tan(15)/tan(fov/2)).
- Round 3 (S01-S04 agent): the dive DEFAULT is now S01's short white-out (`VX.DIVE_OFF` warm +0.05, emerge +0.15, clear +0.4, haze +1.05; ~0.7 s
  fully covered); `VX.DIVE_OFF_V8` keeps the original v8 profile (test_v8 passes it as `dives[].off` and in its DV). Unit boxes, arrows and banners
  fade out while a dive's deck closes (deckIn+0.2 -> full-0.1) and back in as the target clears (emerge -> clear+0.35); `S.diveHide = false` keeps them.
  New `tools/check_arrows.js SNN [margin]`: reports arrow points (while drawing and drawn) outside a frame safe margin (default 6 %, ground plane).

