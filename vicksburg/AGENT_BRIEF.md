# Shared brief for every Vicksburg agent (read first)

Project: the channel's first 3D campaign film, "Vicksburg 1863" (~19 min), in the Grand Maneuver (GM) style. The approved look is the 66 s
test clip "v8" in `research/style_tests/gm3d/clip/` (read its README.md top to bottom; reference render `gm3d_clip_v8_share.mp4`).
Binding brief: `research/START_BATTLE_19_VICKSBURG.md`. Plan: `vicksburg/PLAN.md`.

## Hard rules
- Work only inside `vicksburg/` unless your task says otherwise. Never modify `research/style_tests/gm3d/clip/` (it is the approved reference): copy from it.
- Do NOT git commit or push: the lead commits. Do not delete anything you did not create.
- Never print, log or commit secrets (`RUNPOD_API_KEY`). Never commit Grand Maneuver frames or videos. Never bypass YouTube's bot check.
- Never `pkill -f` a pattern that can match your own shell. Never write into hard-linked assets.
- Disk is a fixed allowance: keep big intermediates in `/tmp/vx_*` or your scratch dir and delete them when done; mp4/wav/npy are git-ignored.
- Long jobs: run in the background and poll (the container pauses when idle).
- Rendering locally is SwiftShader on 4 cores (~1 min per film-second); for checks render single frames/snapshots, not whole videos.
- Composition 1280x720, 30 fps, everything a pure function of t (deterministic, seekable), one paused GSAP timeline per scene.

## Coordinates (shared by everyone)
- Map units = the 'vicksburg_hd_lift' frame (`grant/assets/vicksburg_hd_lift.json`: web-mercator zoom 10, origin_world_px [63513,105473],
  2880x1620, 129.36 m per unit). x east, y (= three.js z) south. lat/lon -> map: `world.js latLonToMap` / `bake_clip.py to_map`.
  e.g. Vicksburg ~(1388,681), Bovina (1495.5,701.2), Edwards (1599.4,716.4), Raymond (1716,759), Jackson (1885,724), Big Black bridge ~(1518,705).
- DEM: `grant/assets/src/vicksburg_hd_elev.npy` (5760x3240 float32 metres, 2 px per map unit; rebuilt by `vicksburg/tools/fetch_dem.py`).

## World bundle contract (baker writes, engine reads)
`vicksburg/worlds/<region>/` per region, region names: `wide` (the campaign), `vicksburg` (river front + city + bluffs), `bruinsburg`,
`portgibson`, `raymond`, `jackson`, `champion`, `bigblack`, `siege` (the city's land defences).
- `height.png` (16-bit packed in R/G exactly as the clip: h_m = (R*256+G)/200 - 20), `ground.jpg`, `region.js` =
  `(window.GM3D_REGIONS = window.GM3D_REGIONS || {})["<region>"] = { box:[x0,y0,w,h], hm:[W,H], exag, rivers:[...], roads:[...], houses, trees,
  towns:{name:[x,y]}, features:{bridges:[], works:[], pontoons:[], ...}, ... }` with the same per-region fields the clip's `world_data.js` has
  for `wide`/`close` (so the clip's rendering code keeps working), plus `geo` once in `vicksburg/worlds/geo.js`.
- A scene copies (or the render tar includes) only the region folders it uses.
