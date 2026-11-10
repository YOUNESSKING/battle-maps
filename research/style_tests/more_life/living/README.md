# Living map + river names (Style W / 2e test, vicksburg_w)

Test only: nothing here is wired into a scene or kit yet. Both scripts are plain JS over GSAP, like the scene kits. Every motion is a tween on the scene timeline: no rAF, no `Math.random`, no callbacks. The preview re-seeks its four frames in reverse order and gets byte-identical images (`render_preview.js` prints `deterministic re-seek: OK`).

## Files
- `river_label.js`: `riverLabel(id, text, polylineMapPx, t, opts)`, carved italic river names.
- `living.js`: `LivingW({tl, world, before, box})` returns `L.clouds`, `L.water`, `L.dust` and `L.light`.
- `extract_rivers.py`: builds the river centre-lines `rivers_px.json` / `rivers_px.js` (Mississippi, Big Black, Pearl, in map px) and the water mask `mask_water.png` (2880x1620, alpha = water of the 2e river overlay `roads_towns/rivers/rivers_w.png`).
- `preview.html`: an 11 s test on a crop of `grant/assets/vicksburg_w.jpg` + `rivers_w.png` at camera s = 1.7. It has one Union column marching west on the Jackson road and the light running morning -> afternoon -> dusk -> night. `?nolight` turns the light off.
- `render_preview.js` (`NODE_PATH=$(npm root -g) node render_preview.js`) writes `frames/`. `compose_preview.py` then writes:
  - `preview.jpg`: 2x2 of the 1080p frames at 1.6 / 4.0 / 6.6 / 9.6 s.
  - `preview_480.jpg`: the same four frames, 480 px wide.
  - `river_labels.jpg`: the Mississippi and Big Black labels at 1:1 and 2x.

## A. River names: `riverLabel(id, text, pts, t, opts)`
- The letters follow a smoothed, offset copy of the river's own centre-line (SVG `textPath`). Each letter is placed and rotated along it, letter-spaced 0.22 em.
- The label is pushed out wherever the smoothed line would cut a tight bend, so the letters keep `hw + gap` px of grass between them and the real water.
- Reading direction: left to right. A near-vertical reach reads from bottom to top.
- Font: EB Garamond 500 italic. Copy `rr_cards/fonts/eb-garamond-latin-500-italic.woff2` into the scene's `assets/fonts/`, or set `riverLabel.fontUrl` before the first call.
- Look: the same carving as the town labels (`label.py` render_label_curve). The face is pale ivory-blue `#d6e2dc` at 93 %, with an inset bevel (dark inner edge top-left, faint light edge bottom-right) and a tight soft dark shadow, all done in an SVG filter.
- Main options:
  - `s`: the camera scale while the label is up. All sizes are screen px at that scale.
  - `size`: 25 for creeks, 27 for the Mississippi. Rivers sit one step below the 28-34 px town names.
  - `near: [x, y]`: puts the word on the river point nearest to that map position. Pick a straight-ish reach on open grass.
  - `side`: `above`, `below`, `left` or `right`.
  - `hw`: the water half-width on screen. The Mississippi needs about 15 at s 1.7, the creeks about 4.5.
  - `gap`: 5 px.
- Timing (rule 1c): call with `t = B.at(para, "Big Black")`. The label fades in over 0.5 s on the word, holds 3.5 s (`hold` or `until`) and then fades out over 0.7 s. Give only words the narrator says.
- Layer: the label is appended to `#overlay`, so it sits above the hatching and arrows (2e item 9: labels on top).
  - Labels do not step out on their own when the camera crops them at the frame edge (2d.7). Keep the camera still while a label is up, or fade it out before the move.
  - Do not stack two river names. The preview overlaps them briefly only to show both.
- Centre-lines for other rivers or maps: add end points to `RIVERS` in `extract_rivers.py`. It routes along the skeleton of `roads_towns/exclusion_masks/rivers_w.png`; for another map, point it at that map's mask.

## B. Living map: `const L = LivingW({ tl })`
All layers are in map px inside `#world`, inserted before `#overlay`, in this fixed order: water, clouds, dust, light. Hatching, arrows, labels, units and cards stay above them at full strength.
1. **`L.clouds({ t0, t1, opacity: 0.08, wind: [9, -2.5], size: [380, 760], seed })`**
   - 3-5 soft ellipses per cloud. The group carries the opacity, so overlaps never get darker than 8 %.
   - The clouds drift about 15 screen px/s at s 1.7. Their start area is pushed upwind, so the map stays covered to `t1`.
   - In a still frame they are almost invisible; in motion they read as passing shade.
2. **`L.water(maskUrl, { paths, lanes, opacity: 0.2, speed: 12 })`**
   - Soft, blurred pale streaks (two dash rhythms) run downstream along each centre-line. `lanes: {0: [-5, 0, 5]}` gives the wide Mississippi three lanes.
   - A faint glint band sweeps across all the water every 26 s.
   - All of it is CSS-masked to `mask_water.png`. The mask matches the wide river overlay; for the close twin, build one from `rivers_close.png` the same way.
   - The page must be served over http, which hyperframes does; under `file://` the CSS mask may not load.
   - The streaks are blurred and long on purpose. Short sharp dashes read as a dashed line, and dashed lines are banned (2d.5).
3. **`L.dust(unitEl, t0, t1, { every: 0.2, life: 2.4, opacity: 0.34, size: 46 })`**
   - Tan puffs appear at the column's rear, only while it moves. Each grows, drifts downwind and fades.
   - Call it AFTER the unit's `B.move` tweens: it samples the unit's `left`/`top` by seeking the timeline once (events suppressed, time restored). Alternatively, pass `pos: (t) => [x, y]`.
   - The dust layer is under `#pins`, so the dust never covers a unit.
4. **`L.light(preset, t, { dur: 2, k: 1 })`**
   - Cross-fades from whatever is on to `morning`, `afternoon`, `dusk`, `night` or `day` (off).
   - It REUSES the kit values (`grant/tools/m3_kitw.js` `todDiv` + `nightWashMap`; m1/m3 bodies):
     - morning = soft-light `rgba(100,135,205,.55)` at .45
     - afternoon ("4 PM") = soft-light `rgba(255,165,80,.6)` at .2
     - night = `rgb(6,10,26)` at .4, plus a faint cool soft-light
   - Dusk is new: a warm low sun from the west plus a 22 % violet dim.
   - Map-only, like `nightWashMap`. Use either this or the kit's `todDiv`/`nightWash` on a shot, not both.

## Integration (when a video adopts it)
- Copy `living.js` and `river_label.js` into the scene's `lib/` and load them after `gsap`. The kit's `tl`, `#world` and `#overlay` are picked up as defaults. Never edit the shared kit; this is a scene add-on (2e item 9).
- Copy `mask_water.png` (or one rebuilt for the video's map) into `assets/`.
- Call order in a body: units and `B.move` -> `L.water` / `L.clouds` (whole scene) -> `L.dust` per marching column -> `L.light` at the clock beats -> `riverLabel` on spoken words.
- Run the two-critic snapshot review (2d.10) before showing it to the owner.
