# Painted troop formations (TEST, not adopted)

Owner ask (2026-11-10): units should look like troops, like the Yarmouk reference
(`../ref_units.png`, full frame `../../roads_towns/owner_ref_yarmouk.png`). This folder is a test. No scene or kit file is touched.

Files: `units.js` (API + CSS), `preview.html` (demo over a crop of `grant/assets/vicksburg_w.jpg`, `bg_crop.jpg`),
`preview.jpg` (the sheet for the owner), `make_preview.sh` (re-render: Playwright Chromium via `shot.js`, then `sheet.py`).

## What it draws
| kind | look | default size on screen (1080p) |
|---|---|---|
| `line` | row of painted blocks laid edge to edge along the front, 5 px seams, optional brigade gaps (`groups:[4,4]`) | block 40 along the front x 38 deep |
| `column` | the same blocks in a single file along the march direction (`files:2` for a double file) | same blocks |
| `skirmish` | loose round dots in clusters (`cluster:3`/`4`) | 21 px dots |
| `cavalry` | dots with the NATO cavalry slash, in staggered ranks of 3 | 24 px dots |
| `battery` | small blocks with a gun (wheel dot + barrel pointing to the front), spaced apart | 32 x 30 |

Every block: Union blue `#1f4fc4` / Confederate red `#c4121f` (same as `battle.css` `--carth` / `--rome`), NATO infantry X
corner to corner, dark side-ink outline, matte bevel (light top-left, dark bottom-right), paint-grain texture, 0-2 bites torn
out of a side edge, one soft drop shadow per formation. As in the reference, the blocks' sides follow the line and their
top/bottom stay level on screen (a skew on top of the rotation, `U.maxSkew` 34 deg), so a slanted line reads as a row of
painted pieces, not a CAD bar. Light stays top-left whatever way the formation faces.

Style W rules kept: no flags on units, ONE echelon mark per formation (`mark:"XXX"`, beside the line on its rear side, above a
column, above a dot group), name tag only from `U.tag(h, name, t)` (the spoken word), no dashed anything (arrows stay the kit's).

## API (see the header of `units.js`)
```js
U.init({ tl, parent: WORLD, k: 1 / S_REF });            // once per scene, after the kit
const h = U.formation("u17", "carth", "column", { x, y, face: 0 }, 8, { mark: "XXX", groups: [4, 4], t: null });
U.move(h, t, dur, { x, y, face });                     // whole formation: translate + rotate (rigid)
U.morph(h, t, "line", { dur: 1.8, geom: { x, y, face } });   // column -> line: blocks slide sideways, then step up
U.skirmishers(h, 8, { ahead: 70, cluster: 4, t });     // a dot screen in front of a line
U.tag(h, "McPHERSON", T_NAME);                          // only when spoken
U.hide(h, t); U.center(h); h.hq                        // h.hq rides with the formation (hang portrait stakes on it)
```
Geometry: `{x, y, face}` (face = direction the troops face or march, deg, 0 = east, 90 = south), `{x, y, angle}` (angle = the
direction the front runs), optional `len` to stretch a line over a fixed frontage, or a polyline `[[x,y],...]` the front follows
(blocks follow its bends; `faceSide: "left"|"right"`). Ops on one formation run in time order and must not overlap.

## Converting an existing scene (e.g. `grant/tools/s12_body_s12d.js`)
1. Load `units.js` after the kit (e.g. a `vx_*_kit.js` copy, as 2e item 9 asks: never edit the shared kit) and call
   `U.init({ tl, parent: WORLD, k: 1 / S_REF })` with `S_REF` = the scene's usual camera scale (1.5 for s12d).
2. Replace each `U("u13", "carth", L(..), "", "XXX")` with
   `const u13 = U.formation("u13", "carth", "column", { ...xy(L(..)), face }, 6, { mark: "XXX" })`
   (`xy = ([x, y]) => ({ x, y })`; a moving corps starts as `column`, a corps in position as `line`).
3. `B.move("u13", t, dur, x, y)` -> `U.bmove(u13, t, dur, x, y)` (keeps facing) or `U.move(u13, t, dur, { x, y, face })` (turns);
   the kit's `along(id, pts, ...)` -> a chain of `U.move` calls over the same points with `face` = heading of each leg.
4. Deployment on the narration word: `U.morph(u13, T_DEPLOY, "line", { geom: { x, y, face } })`.
5. `tagAt(id, null)` -> nothing (no tag by default); `tagAt(id, T)` -> `U.tag(h, "NAME", T)`.
6. Portrait stake: hand `h.hq` to `pinPortrait` instead of a unit id (it takes a pinned element; the tag-hiding line only
   applies to string ids, so hide `h.tagEl` yourself while the card is up).
7. Guns: `K.gun(.., { unit })` needs a B unit; for now fire from `U.center(battery)` with `shoot(...)`.
8. `B.grey` (beaten unit) has no equivalent yet; fade with `U.hide` or move the formation back.

## Size relative to the map scale
The kit's boxes are constant on screen (54 x 36, counter-scaled by `SCL`). Formations are pieces ON the map: positions are
world px and the blocks grow and shrink with the camera like the map does (the reference does the same). Sizes are given in
screen px at the reference camera scale `S_REF`; `k = 1 / S_REF` turns them into world px. On the Style W world (2880 x 1620,
basemap baked at 2x) with cameras 1.3-1.9, `k = 1/1.5` keeps blocks 35-50 px on screen. If a scene zooms beyond ~1.4x its
`S_REF`, build that part's formations with a second `k` (or keep the camera inside the range): below ~30 px the X fades, above
~60 px the blocks start to look like tiles.

What a block means: on campaign maps (e.g. the Vicksburg campaign map, kilometres per block) the blocks are symbols, not frontage; use
1 block = 1 brigade, division = 3-4 blocks, corps = 8-12 blocks in 2-3 groups. On close battle maps where the true frontage
fits, 1 block = 1 regiment (a brigade = 4-5 blocks, gaps between brigades). Keep lines <= ~16 blocks per side on screen and
skirmish screens <= ~12 dots so the frame stays clean; at 480 px (phone) the lines and dot groups still read as lines and groups
(sheet panel 5), the X and the marks do not need to.

## Not done yet / open questions for the owner
- Sound: none needed (formations are silent; musketry stays on `SFX` calls in the scene).
- Two-critic review (2d item 10) and the owner's approval before any video adopts this.
- Possible next steps: `U.grey` for a beaten formation, wheel (rotate a line about one end), and `K.gun` support on batteries.
