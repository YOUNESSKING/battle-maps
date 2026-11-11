# Yorktown map kit (main style = STYLE_LOCK 2d + 2e + 2f, precedence 2f > 2e > 2d)

Reference look: `reference/style-reference-living-map.mp4`. Proof frames: `build/sheet-kit.jpg` (kit test a/b next to the reference).

## What is where
| file | what |
|---|---|
| `kit/data/places.py` | everything baked or named: per map the camera scale the art is drawn for, water clean-up, rivers, towns (+ carved names), period roads, ferries, painted relief areas, woods keep-off; `PLACES` (story points, lat/lon) and `RIVER_LINES` (for the carved river names) |
| `kit/water.py` | coastal water: cleaned land mask (no piers, grids, dredged cuts, spoil islands, ponds, modern reservoirs) + NHD rivers + few creeks; `carve()` paints the 2e carved middle blue |
| `kit/make_w.py` | Style W green basemaps (copy of `make_style_w.py`, green=1 tint=0 mult=1) with the coastal water: `assets/<map>_w.jpg`, `_w_close.jpg` |
| `kit/make_m.py` | bakes the STATIC 2e layers into NEW files `assets/<map>_m.jpg`, `_m_close.jpg`, `_m.json`, `_m_water.png`, `_m_land.png` + `kit/data/<map>_bake.json` (towns, label boxes, roads, crossings, dead-end check) |
| `kit/js/*.js` + `kit/make_kit.py` | sources of `kit/yt_kit.js` (generated; never edit it): Grant banner kit copy patched for 1781, LivingW, riverLabel, weather, `js/yt_block.js` (the Yorktown API) |
| `kit/build_scene.py` | `scenes-src/<scene>.js` -> `scenes/<scene>/index.html` (hard-linked assets, timing + anchors, GD data) |
| `kit/PLACES.md` | every place in px per map + the corrections made (`python3 kit/places_report.py`) |
| `kit/weather/` | weather.js assets for `yorktown_m` / `peninsula_m` (rain + storm scenes; `kit/lib/make_weather_assets.py` with `WX_OUT=kit/weather`, masks from `kit/data/masks_<map>/`) |
| `scenes-src/test-kit*.js` | the proof scenes (frames a/b, storm, inset) = worked examples of every call |

Baked into the basemaps (do NOT draw them again in a scene): painted towns, carved PERMANENT town names (east: New York, Philadelphia,
Williamsburg, Yorktown; chesapeake: Williamsburg, Yorktown; peninsula: Williamsburg, Yorktown, Gloucester; yorktown: Yorktown, Gloucester),
unlabelled town sprites (Newport, Providence, Hartford, Dobbs Ferry, Trenton, Chester, Head of Elk, Baltimore, Annapolis, Alexandria,
Fredericksburg, Richmond, Hampton, Norfolk, Jamestown), rut roads (no dead ends), timber bridges, the York ferry (Yorktown <-> Gloucester Point)
and King's Ferry (Hudson) with landings + flatboat, lanes through the woods, painted relief (Yorktown bluffs, Yorktown Creek + Wormley Creek
ravines), ground texture, carved water. Everything that changes with the story is LIVE in the scene (below).

## Build + snapshot
```bash
cd /home/user/battle-maps/yorktown
python3 kit/make_kit.py                                    # after editing kit/js/*.js
python3 kit/build_scene.py p3b yorktown p3-4 p3-9          # narrated scene (audio/timing.json + voice.wav anchors)
python3 kit/build_scene.py hook-a east hook-1 hook-2 --inset peninsula   # + a nested higher-zoom map for the one continuous zoom
python3 kit/build_scene.py test-kit-b yorktown --dur 10 --src test-kit   # test scene without narration
cd scenes/p3b && hyperframes snapshot . --at "2,6.5,11" --no-end -o /tmp/claude-0/.../scratchpad/snap_p3b   # then delete the snapshot folder
```
Basemap rebuild (only if places.py changes): `python3 kit/make_w.py <map> assets/<map>_w.jpg close=assets/<map>_w_close.jpg` (~1.5 min; only for
water / woods keep-off changes), then `python3 kit/make_m.py <map>` (~3 min). make_m always writes new files (unlinks a hard-linked target first),
so scene folders built earlier keep their old copy until rebuilt.

## Coordinates
`LYT(lat, lon)` -> map px of the scene's basemap (2880 x 1620 world). `LLYT([[lat, lon], ...])`. `PLACE("redoubt_10")` (names in places.py
`PLACES`: yorktown, gloucester_point, the_hook, fusiliers_redoubt, hornwork, british_line_east, redoubt_9, redoubt_10, first_parallel(_w/_e),
moore_house, surrender_field, allied_hq, williamsburg, halfway_house, trebells_landing, jamestown, cape_henry, cape_charles, lynnhaven_bay,
hampton, dobbs_ferry, kings_ferry, chatham, trenton, philadelphia, chester, head_of_elk, baltimore, annapolis, mount_vernon, newport, new_york,
staten_island). `GD.bake.towns[k].c` / `.label.box` = baked town centre / carved-name box in map px (keep units and cards >= 20 px off them).
Camera: `camera([[t, x, y, s], ...])` (kit); the close (canopy) look cross-fades in from s 1.5 to 2.2 (lens). The art is baked for
s = 1.2 (east), 1.3 (chesapeake, peninsula), 2.0 (yorktown): town names read ~27-30 px there and scale with the camera.

## API (all times in scene seconds; use `at(para, "spoken words")` for every beat)
| call | one-line example |
|---|---|
| `UNIT(id, side, p, type, o)` | `UNIT("lafa", "allies", PLACE("williamsburg"), "infantry", { ech: "XX", name: "LAFAYETTE", nameAt: at("p1-2", "Lafayette") })` types: infantry (X), cavalry (slash), engineers (white gear), artillery (kit gun box), supply (wheel), ship (sail); `ech` "II"/"X"/"XX"/"XXX"/""; `t` drop-in time (0 = on screen at frame 0) |
| `march(id, pts, t, dur, o)` | `march("am1", LLYT([[40.22,-74.76],[39.95,-75.17]]), at("p1-5","south"), 6)` moves along the road with dust behind (LIVING first; dust is sized for the camera scale at build time, `o.dustOp`, `o.dustSize`, `o.dust: false`) |
| `B.move(id, t, dur, x, y)` / `along(id, pts, t, dur)` | plain moves (no dust) |
| `BANNER(key, name, nation, at, t, o)` | `BANNER("washington", "George Washington", "us", "am1", at("p1-3","Washington"), { side: "right" })` nation us / fr / gb; `at` = unit id or [x, y]; `side` up / right / left / west / east / ne / nw / sw / se (stake offset off the action); stays (2d.6) unless `o.until`; `o.myst: tSlam` shows the "?" banner until the name slam; portrait `assets/media/<key>_head.png`, initials if missing |
| `SIDEFLAG(nation, p, t, until)` | `SIDEFLAG("us", LYT(37.21,-76.53))` 48 px nation flag behind a side's lines; auto-hidden while that side has a banner up (one flag per side) |
| `TRENCH(pts, t, o)` | `TRENCH(LLYT(PAR1), at("p3-5","first parallel"), { dur: 2.4 })` dug on its word (ditch + parapet, `o.face` +1/-1 parapet side) |
| `REDOUBT(id, p, t, o)` / `REDOUBT_TAKEN(el, t)` | `const r10 = REDOUBT("r10", PLACE("redoubt_10"), 0, { side: "british" }); REDOUBT_TAKEN(r10, at("p3-8","taken"))` |
| `HATCH(polys, side, t, o)` | FORM 1: `HATCH(LLYT(R10_GROUND), "allies", at("p3-8","Redoubt 10"))` taker's colour, ~3 s, water cut out |
| `STRIPES(blueP, redP, t)` | FORM 2 (p3-1 ring closes, end-1 only): whole map two-side stripes ~2.5 s |
| `LIVING(o)` | once per scene: `LIVING({ clouds: 0.1, light: "dusk" })` cloud shadows, water shimmer, enables `march` dust |
| `LIGHT(preset, t, dur)` | `LIGHT("night", at("p3-7","night"), 2)` presets day / morning / afternoon / dusk / night |
| `RAIN(t0, t1, k)` / `STORM(t0, t1)` | only 6-7 Oct night (rain) and 16-17 Oct from ~midnight (storm), FACT_NOTES; visual only |
| `RIVER(name, text, t, o)` | `RIVER("york", "York River", at("p2-2","York River"), { s: 1.3, near: PLACE("yorktown"), side: "below", hw: 14 })` carved italic, ~3.5 s; names: york, james, hudson, chesapeake |
| `PLACE_LABEL(text, p, t, o)` | story place on its spoken word (not a permanent town), ~3.5 s: `PLACE_LABEL("Head of Elk", PLACE("head_of_elk"), at("p1-6","Head of Elk"))` |
| `INSET(map, o)` | nested higher-zoom basemap for one continuous zoom (build with `--inset map`): `INSET("peninsula")` |
| kit (Grant) helpers still there | `shoot(from, to, t)` (K.gun -> arc -> K.impact: boom on impact + locked shake), `arw({...})` solid thin arrow, `focus(p, r, t)`, `inkTrace`, `crosses`, `smoke`, `stampP`, `B.caption`, `dateNow` / `B.date`, `declutter`, `GG.card`, engagement `E.decide/E.subscribe/E.final`, `K.casualties` |

Sounds: only the locked kit (`K.gun` quiet launch, `K.impact` boom on impact + shake; `SFX("hit")` on a banner/name pop). No `ref:*` sounds
(the old `box()` label helper calls `SFX("ref:pop")`: do not use `box`/`boxS`; use `PLACE_LABEL`).

## Gotchas
- One basemap per scene (`relief`/`relief_close`); a cross-map zoom uses `INSET` (feathered nested image, fades in by camera scale).
  Tested east -> peninsula (16x, `build/kit-inset-strip.jpg`): end the zoom with the frame INSIDE the inset box (centre it on the inset,
  s >= ~0.75 x 2^dz), else the feathered edge and the blurry east map show at the frame edge. east -> yorktown (64x) untested.
- Baked names are FIXED art: keep units, banners, cards >= 20 px off `GD.bake.towns[k].label.box`; never place a live label for a baked town.
- Banners are 124 x 209 screen px: put them on a side stake (`side: "right"|"left"|"ne"|"west"`) off towns and labels.
- `PLACE` coordinates for the siege works were checked against the relief, NOT yet against the Bauman plan (not delivered): see PLACES.md.
- `B.at` is a proportional estimate; the kit's `at` corrects it with the measured sentence starts. Re-grep every `at(...)` phrase after any script change (1c.5).
- Weather needs `kit/weather/<base>_m_*` (made for yorktown + peninsula); calling `RAIN` on another base shows only the screen rain.
- A march through a town crosses its baked name: pick the frame times / unit spacing so no box sits on a name when it matters (2f.2: boxes
  >= ~60 px apart; a 350 px route holds ~5 boxes).
- Banners: Clinton has no portrait yet (initials "HC" show automatically); the French pennant is the white royal flag (reads as a white
  rectangle at banner size: historically right). Generals not in the image agent's list get initials until a `<key>_head.png` exists.
- The builder runs `node --check` on the page script (prints "SCENE SCRIPT SYNTAX ERROR"); an inline `</script>` anywhere (even in a comment)
  breaks the page: make_kit.py escapes it in the kit, keep it out of scene sources.
- Snapshots: `hyperframes snapshot` only; never render full scenes in the kit; delete snapshot folders after looking.

## CHANGES
**r2 (2026-11-11, critic round 1 `build/critic-kit.md`; proof `build/sheet-kit-r2.jpg`).** API is backwards-compatible; rebuild a scene to pick up the new art.
- New basemap version `assets/<map>_m2*.jpg|png|json` for `east` and `yorktown` (written as NEW files; `_m` files untouched, so scenes
  built earlier keep working). `build_scene.py` now picks the newest version per map (`_m9` .. `_m2`, else `_m`) for the base and every `--inset`,
  and the matching `kit/data/<map>_bake_m2.json`. `make_m.py <map> v=N` writes version N.
- `east` baked for the wide march shots (s 0.9): bigger painted towns (+ Princeton, Chatham as sprites), stronger and wider post-road ruts
  (`roads_k` 1.5); names arced (Philadelphia west of the town, off the post road; New York along Long Island).
- `yorktown`: the Yorktown name arcs under the town; the Gloucester name moved inland off the shoreline; the York ferry landings + flatboat
  are 1.8x bigger (visible at s 2.4).
- Label keep-out: `LABEL_BOXES()`, `NUDGE(p, { s })` (move a static position >= 20 px off every carved name, also names on insets),
  `LABEL_AUDIT(times, { show })` (lists units within 20 px of a name; `--var audit=1` in the test scene), and `march()` no longer drops dust on names.
- Banners: the default stake is `ne` (off the key spot; extra stakes `nw`, `sw`, `se`, `east`); British cloth + streamers are now clear red;
  the French pennant is `assets/media/fr_royal_pennant.png` (big gold fleurs-de-lis, gold edge; `kit/make_pennant.py`), also used by `SIDEFLAG("fr")`.
- Night: `NIGHT_DIM(t, k)` dims units, banners and works with the night (they stay on screen); `LIVING({ light: "night" })` calls it.
- `INSET`: several nested maps in a row (`--inset chesapeake --inset peninsula`), each at its own resolution; once an inset covers the frame its
  edge is hard and the maps under it (and their carved names) are hidden, so no stray giant letters or blurred bands. End the zoom inside the inset.
- Builder: `--var key=value` -> `GD.var.key` (one source, several test variants).
- Test scenes: `test-kit-a`, `test-kit-b`, `test-kit-storm` (`--var mode=storm`), `test-kit-inset` (`scenes-src/test-kit.js`, `test-kit-inset.js`).

**r3 (2026-11-11, critic round 2 `build/critic-kit-r2.md` + hook-agent bug list; proof `build/sheet-kit-r3.jpg`).** Backwards-compatible.
- `chesapeake_m3` (Williamsburg name set NW, Yorktown auto: the two names no longer run together; supersedes `chesapeake_m2`).
- `INSET` fades in later (0.6..0.85 of the fill scale) so a nested map is opaque before it fills the frame; pass quickly through the
  in-between scales (the outer map's carved names grow there). Proof strip frames: 1 s, 3.2 s, 6 s.
- New basemaps: `east_m4` (New York name from the Manhattan tip along western Long Island; bigger Philadelphia town), `chesapeake_m2` and
  `peninsula_m2` (baked for camera scale 1.0 with names 1.25x: readable as nested maps in the hook zoom; arcs match). `east_m3` was an
  intermediate bake (its New York name fell on the harbour): never use it (the builder skips to m4). `make_m.py <map> check=1` = fast road/dead-end check.
- `at()` (builder): past the last measured anchor a phrase keeps that anchor's correction (no more 1.6 clamp collapsing late phrases onto one time).
- `camera()` is now ONE timeline-driven path (a pure function of time, `CAM_AT(t)`), so seeking any frame shows the right camera; same keys as before.
- Unit moves (`B.move`, `along`, `march`) are transforms (x/y) instead of left/top (lint `gsap_non_transform_motion`); `UPOS(id)` = current centre.
  The drop-in (`UNIT(..., { t })`) falls a constant ~45 px on screen at any camera scale.
- `INSET`: the layers under a covering inset are now really hidden (opacity check fixed: the browser stores "1"); `INSET(map, { close: true })`
  uses the close art; the builder copies `inset_<map>_close.jpg` too.
- Living map: the water glint band is feathered (no hard vertical edges on wide frames); dust follows transform moves.
- Flags: `FL.fr` and `BN.flagFor("fr")` = `fr_royal_pennant.png`; `SIDEFLAG(nation, unitId)` plants a pole flag at a wing's lead box (no lone flags on grass).
- Redoubts: the garrison colour now fills the work (`REDOUBT_TAKEN` turns it allied blue).
- `BOAT(pts, t, dur, o)`: live flatboats on the water (e.g. the failed escape across the York, night 16-17 Oct; `o.drift` = blown downstream).
- `LABEL_AUDIT` also checks live river names (`RIVER`) while they are visible.

**r4 (2026-11-11, owner: "the front lines would be in colours"; proof `build/sheet-kit-r4.jpg`).** Backwards-compatible (same signatures); rebuild scenes.
- `TRENCH(pts, t, o)` now draws in the SIDE COLOUR with the locked glow (15 px on screen, 0.47) + coloured line + thin dark ink core + pale parapet
  (still reads as a trench). Side: `o.side` "allies" | "british"; old calls without it: `face: 1` = British, else allies. `o.front = [x, y]` (a point on the
  British side) makes that trench the REAL front: the two-colour band (red toward the British, blue toward the allies).
- New `FRONT(pts, t, { enemy | red: "left"|"right" })` (two-colour band, constant 15 px), `SIDECOL(side)`, `LINE_LAYERS(...)` (generic constant-width lines).
- Colours: allies #2c57b7 / British #bc2528 by day; slate #4a6a9a / brick #a8503c at night (`LIVING({ light: "night" })` sets the night palette).
- `REDOUBT` is filled + glowing in its garrison colour; `REDOUBT_TAKEN` switches fill + glow to allied blue.
- `march()` draws the advance trail in the side colour (solid, thin, fades ~2 s after arrival); `{ trail: false }` turns it off. `arw()` arrows were already solid side colour.
