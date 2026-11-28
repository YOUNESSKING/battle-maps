# LOOK LOCK: the Style W "borrow" look (lock v1 = test r15, owner 2026-11-28)

**What this is.** The owner approved test r15 as THE reference for Style W films that borrow elements from our 3D films
(2026-11-28: "I like everything, clouds and opening now"). The same day he corrected one part: **"The clouds and the opening, I
don't like them."** So everything in r15 is locked **except the clouds and the opening cloud dive**. Those two are being redone and are
**not** part of the lock.

**Why a lock.** The owner's goal, in his words: "make a system that this version would be repeatable in longer videos and not getting
worse like we did in 3D movie, like we keep drifting. I want everything to be up to the quality of the test."
The 3D films drifted because each session re-tuned the look by eye and compared it with the PREVIOUS film, not with the approved test.
This lock stops that. Every film is compared with r15 itself, through the golden frames and the numbers. No session may tune the look.

## 1. What is locked

| block | what you see | where the values live |
|---|---|---|
| musket fire, daylight (`musket.day`) | one flash per musket on its frame; the ripple in 4 clumps with gaps; white jets that turn grey 0.4-0.9 s after each shot; a soft grey haze carried downwind and gone ~5.5 s after the shot; no straight-edged slab | `BW.LOCK.smoke["musket.day"]` + `BW.LOCK.volleyCall` |
| musket fire, night (`musket.night`) | the hook's guard volley before dawn: night-tinted jets + haze, gone by the end of the beat | `BW.LOCK.smoke["musket.night"]` + `BW.LOCK.shotCall` |
| cannon (`cannon`) | ragged fireball cone + white core + ground glow (2 frames), dense dark-bottomed jet and cloud, gone in ~8 s, the round shot's strike 0.5 s later, gun recoil | `BW.LOCK.smoke.cannon` + `BW.LOCK.capBox` (keep-readable caps) + bwgl.mjs |
| burning-roof soot column | dark soot column over a fire | `BW.LOCK.soot` |
| effect of fire | `BW.hit` (shudder, dim, chunk lost, casualty marks), `BW.wipe` (dark box, dust puff, grey remnants), `BW.rout` (4 pieces scatter, one straggler) | borrow.js |
| focus light circle | the soft circle: ~30 % darker outside, faint warm light inside | `BW.LOCK.focus` (sets `K.FOCUS_*`) + the focus block of the kit |
| pocket-watch date plaque | ivory plaque top-left (replaces the black date plate), rolls on each spoken date | borrow.js + `vicksburg/engine/overlay.js` |
| THE ARMIES key | bottom-left side key (replaces the side-colour key plate) | same |
| wax-seal timeline | bottom, one seal per move, slides in on the spoken date | same |
| parchment ledger | the small result list top-right, each value on its word (replaces the big result card) | same |
| 3D gold title | the name slam (map dimmed 35 %) and the title card with its subtitle | `BW.LOCK.gold` + borrow.js |
| tilt | gentle perspective tilt (6-7 deg on battle maps) | `BW.tilt` (camera keys are content) |
| sound | the 3D-film gun + boom + fire, the Jackson flintlock set (one shot per flash), the r14j mix: levels, ducking, limiters, -14.0 LUFS, true peak <= -1.5 dBTP | `research/style_tests/stylew_borrow/tools/make_test_audio.py` + the sound files in `lock.json` |

The exact numbers are in `lock.json` (`params.blocks` = `BW.LOCK`, `params.audio` = the mix values and the r15 measurements),
together with the sha256 of every locked source and sound file.

## 2. NOT locked: the clouds and the opening dive (NOT APPROVED, being redone)

- The cloud dive (r13g/r13h: deck, inside-the-cloud grey, white-out, emerge), the fair-weather cumulus field, the stratus on the landing,
  the name-slam clouds and the cloud shadows are **NOT APPROVED** (owner 2026-11-28). **No film may use the r13g dive.**
- Their code is marked `LOOK-LOCK pending-begin clouds` ... `pending-end clouds` in `marion/kit/js/bwgl.mjs`, `borrow.js` and
  `marion/kit/build_scene.py`. The gate does not lock those regions: a new cloud test may change them. The values stay in the test scene
  `marion/scenes-src/test-bw-hook-a.js` (`fair`, `dive`, `diveOff`, `stratus`), and they are NOT presets.
- The gate's lint prints **"WARNING: cloud dive not approved"** for any scene with `dive` / `diveOff` / `stratus`, and "clouds not
  approved (pending, not locked)" for `fair` / `BW.clouds` / `shadowK`. Until the owner approves a new cloud test, open films the
  Style W way (STYLE_LOCK 1a: one continuous geographic zoom), without the borrow cloud dive.
- There are no golden frames of clouds, the dive or the white-out. The gold-name golden frame is cropped to the title only.
- The replacement being worked on (coordinator note, 2026-11-28): PAINTED clouds in the 2D Style W look (gouache / watercolour,
  stepped tones, paper grain) plus a cleaner 2D camera dive, not 3D-engine clouds. It stays pending until a new owner-approved test exists.
- When the owner approves a new cloud/opening test, it becomes lock v2 (see section 7).

## 3. The reference clip and the golden frames

- Reference clip: `research/style_tests/stylew_borrow/stylew_borrow_test_r15_share.mp4` (76.7 s; windows: hook 0-17.8, name slam
  17.5-20.5, title 20.3-24.7, Fort Motte cannon 24.4-39.0, Parker's Ferry 38.7-76.7).
- Golden frames: `golden/` holds 19 stills from r15, each as a full-resolution crop of the effect (`<id>_crop.png`) and the whole frame
  at 960 x 540 (`<id>_full.png`). `golden/golden.json` lists for each: the r15 frame and time, the test scene and its own time, the
  block it shows, a description and the crop box.

| id | r15 time | shows |
|---|---|---|
| musket_night_jets | 16.37 | the hook guard's night volley (musket.night) |
| gold_name_slam | 19.50 | gold name slam (crop = the title only) |
| gold_title | 23.50 | gold title + THREE GREATEST TACTICAL MOVES |
| plaque_key_day | 30.00 | pocket-watch plaque 1781 / 12 May + THE ARMIES key |
| cannon_flash, cannon_flash2 | 34.63, 34.67 | cannon flash frames 1 and 2 |
| cannon_strike | 35.13 | the strike on the gable (+0.5 s) |
| cannon_cloud_1s5, cannon_cloud_4s | 36.13, 38.63 | cannon cloud +1.5 s and +4 s |
| timeline_seals | 42.00 | wax-seal timeline + the plaque rolled to 30 August |
| focus_circle | 45.60 | the focus light circle on "in a thick wood" |
| musket_flash | 63.40 | first musket flashes of the ambush ripple |
| musket_jets_0s3, musket_jets_0s8 | 63.67, 64.17 | jets +0.3 s and +0.8 s (clumps with gaps, white -> grey) |
| musket_haze_2s | 65.37 | haze +2 s |
| musket_haze_5s | 68.37 | volley 1 +5 s: its haze gone (the buckshot ripple's haze still drifting) |
| wipe_out | 71.40 | wipe-out of the second red box |
| rout | 73.97 | rout: pieces scatter, one straggler |
| ledger | 76.33 | parchment ledger with 3 rows + the plaque |

## 4. The building blocks (how a scene calls them)

Build with `python3 kit/build_scene.py SCENE BASE FIRST LAST --borrow`. A scene passes **content only**: positions, times, unit lists,
the camera scale `K` (= 1 / the camera's scale at the shot), and the wind DIRECTION (its speed is locked). Nothing else.

```js
// smoke config of the 3D layer: ONE preset per scene (the presets set different caps)
BW.gl({ mpu: 16, volley: BW.smoke("musket.day", { K: 1 / 3.1, wind: [42, -6] }) });      // daylight muskets
BW.gl({ mpu: 128, volley: BW.smoke("musket.night", { K: 1 / 15.2, wind: [-14, -36], gone: 17.0 }) });   // night muskets
BW.gl({ mpu: 16, volley: BW.smoke("cannon", { K: 1 / 3.6, cwind: [16, -5],
  capBoxes: [BW.capBox("target", box, t0, t1), BW.capBox("strike", box, t0, t1)] }) });  // keep the defenders / the strike readable
// muskets
BW.musketVolley(pts, t0, span, n, { seed, aim: (x, y) => [x2, y2], shake: ["unitId"] });   // a ragged ripple, 4 clumps
BW.musketShot(p, t, { aim: [x, y] });                                                       // one shot (small groups, night)
// cannon + fire
BW.cannon(muzzle, tFlash, aim, { unit: "gun", impact: 0.5, target: aim });   // flash + jet + cloud + strike + recoil
BW.soot(p, t0, t1, { wind: [12, -6] });                                      // soot column over a fire
// effect of fire (amounts and times are content: how hard the unit was hit is the story)
BW.hit(id, t, { from, at, loss: 0.1, marks: 2, shaken: true, until });
BW.wipe(id, t, { from, at, marks: 3, until });
BW.rout(id, t, { dir: [-0.5, 0.87], n: 4 });
BW.captured(id, t);
// focus (kit): the locked look is set by borrow.js
focus([x, y], r, t, until);
// HUD
BW.date("30 AUGUST 1781", t); BW.dateNow("JUNE 1781"); BW.time(t, { label: "Before dawn", header: "1780" });
BW.legend(tIn, tOut, [{ name, sub, color: "#2c57b7" }, { name, sub, color: "#bc2528" }]);    // THE ARMIES
BW.O.timeline.show(t, {...}); BW.O.timeline.seal(t, {...}); BW.O.timeline.go(t, {...});
BW.O.ledger.show(t, { title, sub }); BW.rowParts("red", [["about 20", t1], [" killed", t2]]); BW.O.ledger.hide(t);
BW.goldSlam("FRANCIS MARION", tOn, tOff, { y: 850, w: 1240, tGrow });        // name slam, map dimmed 35 %
BW.goldTitle("FRANCIS MARION", tOn, tOff, { y: 470, w: 1420, tGrow, sub: ["THREE GREATEST TACTICAL MOVES", t] });
BW.tilt([[0, 6, 1.05], [END, 7, 1.06]]);
```

`BW.smoke` throws "LOOK LOCK: ... is a locked smoke value" when a scene passes anything but content, and the named calls refuse their
locked knobs. Do not call `BW.volley`, `BW.shot`, `BW.gold` or write `BWGL_CFG.volley` directly: the gate's lint fails on it.

Known limits of v1 (the test never had them, so they are NOT covered by the lock; each needs an owner-approved test first):
- a scene with BOTH musket fire and a cannon (the two presets use different smoke caps: split the scene or test it);
- muskets at a camera scale far from the test's (K 1/3.1 day, 1/15.2 night) or a cannon far from K 1/3.6;
- the mix chain in `make_test_audio.py` is wired to the test's windows; a film needs it generalized with exactly these values
  (the gate's audio check then proves the levels match r15).

## 5. The gate: `tools/check_look_lock.py` (run before ANY render of a `--borrow` film)

```bash
cd /home/user/battle-maps
python3 research/look_lock_stylew/tools/check_look_lock.py --lint marion/scenes-src/<every scene of the film>.js
python3 research/look_lock_stylew/tools/check_look_lock.py --frames                      # ~15 min, local SwiftShader stills
python3 research/look_lock_stylew/tools/check_look_lock.py --audio <film or pilot>.mp4 --cues cannon=T,impact=T,volley=T,later=T --voice A-B
```

- **(a) hashes**: the sha256 of every locked file in `lock.json` (the kit files with their pending cloud regions cut out; the focus
  block of the kit; overlay.js, fx.js, three, the GM fonts; make_test_audio.py, troop_sfx.py, sfx_mix_lib.py; the flintlock set and the
  3D-film gun/boom/fire/ambience sounds) + `BW.LOCK` evaluated against `lock.json` + the mix defaults of make_test_audio.py + no
  audio override in the environment (`CANNON_DB`, `MUSKET_DB`, `LIMIT_DB`, ...). Prints **LOOK LOCK OK** or **LOOK LOCK BROKEN: <file>**.
  A missing (uncommitted) sound file is reported separately as missing. If it says BROKEN: restore the file from `main`
  (`git checkout origin/main -- <file>`); never "fix" the hash.
- **(b) lint**: fails on any per-scene smoke / focus / gold / overlay tuning (a literal `volley: {...}`, a locked key in `BW.smoke`,
  a wind speed off the locked speed by > 25 %, `BW.volley` / `BW.shot` / `BW.gold` / `BW.smokeGL`, `K.FOCUS_* =`, `BWGL_CFG.v*`,
  `.gmo` CSS, `recoil` / `dust` / `hold` / `back` / `flashScale`). Warns (does not fail) on the pending clouds: **"cloud dive not approved"**.
- **(c) frames**: `--frames` rebuilds the 4 test scenes from the current kit, renders local SwiftShader stills at the golden times
  (`vicksburg/tools/snap.sh`, ~25 min for all 19) and checks two tiers:
  1. **vs r15 (`golden/<id>_crop.png` + `_full.png`)**: SSIM, mean colour, tone percentiles, share of pixels off by > 40 levels, on the
     effect crop and the whole frame. GPU h264 and local SwiftShader never match exactly, so this tier is coarse (calibrated on v1: worst
     crop SSIM 0.964, full 0.973): it proves the kit still LOOKS like r15.
  2. **vs the local reference (`golden/local/<id>.png`)**: the same renderer is deterministic (0 pixels differ run to run, checked), so
     any blurred difference > 6 levels on > 0.5 % of the crop fails. This is the drift detector: a musket.day cap 0.4 -> 0.6 + haze 30
     levels darker passes tier 1 but FAILS here (checked when the lock was built).
  The pending clouds are not tested: in the hook scenes the local copy renders them at low resolution (hook-b) or switches them off
  (hook-a, none on screen at the golden time) so SwiftShader stays inside the snapshot timeout. `--mp4 FILE` runs tier 1 on a render in
  the r15 layout (a re-render of the test windows). If every still fails tier 2 by a small even amount after a Chrome / hyperframes
  update, the renderer changed, not the look: tier 1 must still pass; then only the owner may refresh `golden/local/` (section 7).
- **audio**: `--audio FILE` measures the mean power over 0.35 s from each cue and compares it with the voice-only stretch: cannon +9.7 dB,
  impact +5.6, the first ripple +4.7, a later ripple under the narrator -0.2 (+-1.5 dB), -14.0 LUFS (+-0.3), true peak <= -1.5.
  Self-test on r15: cannon -7.0, impact -11.1, volleys -12.0 / -16.9, voice -16.7, -14.0 LUFS, -1.9 dBTP (the r14j row).
  `--voice-dir DIR` (r15 layout only, needs the voice stems `out_c.wav`) adds the buckshot-ripple voice margins (r14j: +13.3/+5.6,
  +1.2/+6.9, -2.2/+1.7, 2-4 kHz -58.3).

**Automatic:** `kit/build_scene.py ... --borrow` runs (a) + (b) on its own scene source before every build (like the sound lock inside
the SFX render) and STOPS on LOOK LOCK BROKEN or a lint error; the cloud warnings only print. An owner look TEST of a changed value builds
with `--look-test` (prints "LOOK TEST BUILD: NOT for a film"); a film never uses it. Once the lock is on `main`, the gate also warns
when `research/look_lock_stylew/` or `borrow.js` differ from `origin/main` (lock.json, the golden files and the gate script are not
hashed by themselves: changing them is a relock, section 7).

## 6. Pilot first (any film over ~5 minutes)

1. Build the film's scenes with `--borrow`; run the gate (a) + (b) on every scene: LOOK LOCK OK, lint ok (cloud warnings only if the owner
   has approved a new cloud test by then).
2. Run `--frames`: the kit still renders r15 exactly (PASS).
3. Render a **~60 s pilot window** that has a volley, a cannon shot and the opening (the dive, once a new one is approved), with the full mix.
4. Run `--audio` on the pilot with its own cue times.
5. Two critic agents compare the pilot with `golden/` and the r15 clip, side by side at matching moments (smoke at +0.3 / +0.8 / +2 / +5 s,
   cannon at +0 / +0.5 / +1.5 / +4 s, plaque, key, ledger, gold title). Both must say it matches r15; they judge against r15, never
   against an earlier film.
6. Only then render the full film. If the full film is long, re-check one later window the same way.

## 7. Who may change the lock: ONLY the owner

- No session may change a locked value, preset or file "to improve it", even if a critic asks. Critics' ideas go to the backlog below.
- A change needs an owner-approved test (a short clip against r15), then a NEW lock version: update the code, run
  `check_look_lock.py --relock "owner YYYY-MM-DD: '<his exact words>'"` (writes lock v2, keeps v1 in `history`), bump `BW.LOCK.v`,
  re-extract golden frames from the newly approved clip, refresh `golden/local/` with `--frames --save-local-refs`, and note it in STYLE_LOCK 2g. Never re-lock without the owner's words.

## 8. Known polish backlog (NOT applied: each changes the approved look, so each needs an owner-approved test first)

- (a) Critic A: lift the darkest second-volley haze tone from about (110,112,115) to about (140,143,148).
- (b) Critic B: apply the final limiter to the effects only, so it never pulls the voice down under a cannon shot.
- (c) The cloud dive (scored about 8, known weak spots: flat grey bases on a few cumulus, edge-heavy field, the deck's darker underside
  at ~6.2 s): **NOT APPROVED, being redone; any film must not use the r13g dive.**

## 9. Open owner decision (not part of this lock)

- v14 soldiers vs the professional unit boxes: this is for the 3D films. Style W uses the unit boxes (STYLE_LOCK 2d item 4, 2f item 2),
  so this lock is not affected.

## 10. Files

- `lock.json`: version, approvals, locked files + sha256, locked values (`params.blocks` = `BW.LOCK`, `params.audio`), pending items, frame thresholds.
- `golden/`: the 19 golden stills from r15 + `golden.json`; `golden/local/`: the same moments rendered locally from the locked code (tier 2).
- `tools/check_look_lock.py`: the gate.
- Code: `marion/kit/js/borrow.js` (`BW.LOCK`, the named blocks), `marion/kit/js/bwgl.mjs`, `marion/kit/build_scene.py --borrow`.
- History of every test round r1-r15: `research/style_tests/stylew_borrow/NOTES.md`.
