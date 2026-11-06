# Grant #16 restyle into STYLE W: brief for scene agents (2026-11-06)

Owner authority: the owner asked for the restyle; script, narration, timing, story, hook beats, cards and archive inserts stay as they are
(approved v2); only the LOOK changes. Do NOT upload, do NOT commit (the main session commits), do NOT render. Never edit locked sounds.
NEVER show a Confederate battle flag or the Second National (flags: US star flag of the date + Confederate First National only).

## Read first
1. `/home/user/battle-maps/cleburne/STYLEW_BRIEF.md`: the full Style W rule set, the commands, the checklist and how to report. EVERYTHING in
   it applies here, with the Grant differences below. It points you to STYLE_LOCK 2d, the CLEAN_SCREEN_CHECKLIST and CRITIC_NOTES.
2. The approved models, in order: `cleburne/scenes-src/move1a.js` (= the owner-approved Style W reference) and the other finished Style W
   Cleburne scenes in `cleburne/scenes-src/` (all passed two critics: hook-a/hook-b for a hook, move2c/move3b for full battles with portrait cards,
   bg-a/ending for wide theatre maps). Copy their kit blocks (Style W box/flag/unit/arw, camera with the lens transition, town, lay/loss,
   BATCH 1/2/3 helpers, stampP cream-on-dark, tagAt, pinPortrait, focus/inkTrace, zoomBox, profileStrip, smoke, crosses, time-of-day).
3. Grant: `grant/SCENES.md` (scene list, maps, sides, flags, ships), `grant/script.md`, your scenes' current sources in `grant/scenes-src/` and
   their builder bodies in `grant/tools/` (`gh_*` hooks, `m1_*` move 1, `vk_*`/`vx_*` move 2, `m3_*` move 3 + ending).

## Grant differences
- SIDES: Grant / Union = hero BLUE (`carth`), Confederates = RED (`rome`). Flags: `us34_flag.png` until 31 May 1863, `us35_flag.png` from
  1 Jun 1863, `csa1_13_flag.png` (First National).
- TERRITORY HATCHING: ink hatching only at the moment ground changes hands, ~3 s, then dissolve; never at t=0. In the reference the side that
  took ground was red; here use the colour of the side that TAKES the ground (Union gains = blue hatch, `tools/make_hatch.py ... side=blue`
  writes blue lines; Confederate gains = red). Sources: the existing `*_ctl_*_mx.png` layers in `grant/assets/media/`.
- Ships (gunboats, ironclads, transports) stay as they are (no flags on them, solid trails only).
- Builders: all scenes end up in `grant/tools/build_scene.py`, which now switches to `tools/scene_template_w.html` when
  `assets/<basemap>_close.jpg` exists. `gh_inline.py` (hooks) and `m3_build.py` (move 3/ending) assemble their own HTML: make sure the built
  `index.html` gets the Style W head (the `#relief2` close image + the `<style>` line hiding vignette/grain/credit/unit flags, see
  `tools/scene_template_w.html`) and that the camera drives the lens cross-fade. Extra world layers (`gh_*_relief.jpg`, `ext_*.jpg` for the
  ending, `ghx_*`) must be replaced by the Style W versions of those maps (`assets/<map>_w.jpg`) in the same world box.
- Builders hard-link assets (`tools/_linkcopy.py`) because the disk is small; never edit a file inside `scenes/<scene>/assets/` (it is the
  same file as in `grant/assets/`). Snapshots: keep only what the critics need.
- Basemaps: `assets/<map>_w.jpg` + `<map>_w_close.jpg` + `<map>_w.json` (copy of `<map>_hd_lift.json`), made with
  `cd grant && flock /tmp/stylew_map.lock python3 ../research/style_tests/make_style_w.py <map> assets/<map>_w.jpg close=assets/<map>_w_close.jpg story=assets/src/<map>_story.json green=1 tint=0 mult=1`
  (river layers `assets/media/<map>_det_riv.png` + `_det_rivS.png` are being generated in the background; poll `ls`). No modern reservoirs or
  canals; the Mississippi on its 1863 course where the scene shows it (the existing scene already draws the De Soto Point hairpin: keep that
  logic). If a river layer is broken (fork, lake, blob), fix the mask (see `cleburne/tools/stylew_chatt/README.txt` for how chatt was fixed).
- Story ground per battle map (only what the narration names): Fort Donelson's ridge/works and the Dover road; Fort Henry's flooded low ground;
  the Vicksburg bluffs; Grand Gulf's bluffs; Petersburg's Dimmock Line works; Wilcox's Landing / the pontoon bridge site.
- Keep: the hook rules (STYLE_LOCK 1a), every SFX call, the casualty/result + method cards, the date scroll, the end-screen band.
- Snapshots: one run per scene into `/tmp/claude-0/-home-user-battle-maps/425685c4-6657-5109-8b39-25dbef768324/scratchpad/grant_snap/<scene>/`
  (a second run into the same folder wipes it); sheets `grant/build/sheetW-<scene>.jpg`.
