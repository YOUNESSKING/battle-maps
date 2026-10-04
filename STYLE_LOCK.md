# STYLE LOCK: the channel's fixed look, sound and music (owner-approved on Goose Green, 2026-09-29)

**Owner: "I love this video. Lock it in. Don't reinvent the wheel every time."**
Every new video uses EXACTLY what is below. Don't search for new music or sounds, don't restyle, and don't re-test
anything on this page. Only NEW ideas go through "test before applying" (snapshots / 1-min clip, then owner approval).
Everything here is already the default in `goosegreen/` (copy it; see HANDOVER 0b step 1), so doing nothing = locked style.

## 0. The reference clip (hear and see it before any new video)
`reference/style-reference-30s.mp4` (owner-approved 2026-09-30): Goose Green move 3, mixed with the locked sounds and levels:
artillery impacts, an Argentine jet + turboprop shot down by AA, helicopters, then the **Harrier bombing run with the camera
shake**. Every new video must sound and look like this. Before the final assemble, build a test clip of the new video's
busiest 30 s (`make_clip.py SCENE --from P --to P`) and compare it with this reference: same boom-on-impact, same aircraft
sounds, same shake (music is now quieter: 0.08, section 5). If it differs, fix the new video, never the reference.
Rebuild recipe: `python3 tools/make_clip.py move3 --from move3-1 --to move3-5`, then cut 8.5-29.5 s + 87.5-96.5 s.

## 1. Where it lives (copy from goosegreen/ into every new video)
| What | File |
|---|---|
| All visual effects + defaults | `lib/fx.js` (`const K = FXK(B)`) + `lib/battle.js` |
| Sound levels per effect | `tools/sfx_mix_lib.py` (KINDS) |
| Sound files | `assets/media/sfx/` (incl. `candidates/cand1-4_hit.wav`) + `SFX_CREDITS.md` |
| Music | `assets/media/music_src_*.mp3` -> `python3 tools/make_music_bed.py` |
| Final mix (levels, ducking, loudness) | `tools/assemble_full.py` (full video), `tools/make_clip.py` (tests) |
| Reference scenes to copy from | `goosegreen/scenes-src/move3.js` (Harrier bombing run, helicopters, AA, casualty card), `test-terr-f.js` (fronts + territory, final look), `move1.js` (night attack) |

## 2. Visuals (locked)
- **Opening:** every video opens on an animated MAP with units on screen in the first second. Never a photo. Photos only after the hook.
- **Map:** parchment shaded relief (`bake.py`), faint dashed grid (`K.grid`), vignette + grain, date top-left. Flat, no 3D tilt.
- **Colours:** counters/aircraft/arrows blue `#1f4fc4` (hero) / red `#c4121f` (enemy). Day front lines `#2c57b7` / `#bc2528` (30% muted from the counters). Night lines + territory tint `#4a6a9a` / `#a8503c`. Neutral grey `#77746c`, gold `#c9b48a`, text `#f7f3ea`, font Oswald.
- **Front lines (`K.front`):** glowing band, width 15, glow 0.47, drawn on, gentle pulse.
  - Only the REAL front (where the sides touch) is two-coloured. Lines behind it are one colour.
  - **Wide campaign maps** (a whole country or theatre: Korea, Sicily, Normandy, Holland): every front line between the two sides is **two-coloured, blue on our side and red on theirs, never one colour** (owner 2026-10-04). One-colour lines are only for reserve/depth lines on close-up battle maps.
  - When a front collapses, the two-colour band MOVES to the next line (`to` + `moveT`, moveDur 3.0).
- **Territory ("E" look, `K.frontTint`):** alpha 0.34, depth 170 px behind the front (95 px for a forward zone that will be lost), soft 24, clipped to land with a land mask (`elev > 0.5`). Lost ground flickers then fades (`K.lose`). End every scene with `K.raiseTerritory()`.
- **Night (`K.night`):** fully muted palette + brightness boost on lines and territory; normal at dawn.
- **Unit symbols (`K.counter`):** infantry X · artillery = howitzer silhouette · tank/armour = tank silhouette · mech = X + track · AA = twin barrels · HQ = flag. Flag badge + size mark (••• platoon, I company, II battalion, III regiment).
- **Artillery:** the gun fires (`K.gun`: flash, smoke, recoil), shell arc, **impact** (`K.impact`: fireball, shock ring, smoke, small shake).
- **Aircraft (`K.aircraft`):** detailed top-down jets / turboprops / helicopters with ground shadow, spinning props/rotors, dotted flight path; shoot-downs smoke, spiral and crash; helicopters' shadows close in when they land.
- **Bombing run (owner's favourite, copy exactly):** jet flies the run (size 84, alt 30, dur 3.2); each bomb is `K.impact(x, y, t0 + 1.55 + k * 0.25, { r: 20, shake: first ? 5 : false })`, i.e. just after the jet passes, sticks 0.25 s apart. Code: `goosegreen/scenes-src/move3.js` ("the Harrier strike").
- **Also:** ship silhouettes with muzzle flashes, burning places with smoke columns (`K.smoke`), pulsing target rings on objectives (`K.target`), commander badge (`K.badge`, initials on dark tint if no legal photo), casualty card after every move with losses (`K.casualties`), captions bottom-centre.

## 3. Sound effects (locked files and levels)
Rule: every visual beat has a sound, and **the boom is always on the impact** (launches are quiet). Levels are dB in `sfx_mix_lib.py`:

| Kind (`SFX(kind, t)`) | Sound | Level | Min gap |
|---|---|---|---|
| impact (shells, mortars landing) | real distant artillery `cand3_hit`, `cand1_hit` | -7 | 0.25 s |
| explosion (bombs, big blasts, `K.impact` r >= 20) | real distant explosions `cand2_hit`, `cand4_hit` | -4 | 0.20 s |
| fire (gun launch) | `gun_fire` | -24 | 0.35 s |
| mortar (launch) | `mortar_thump` | -24 | 0.30 s |
| jet | `jet_flyby` (roar + Doppler, loudest mid-flight) | -11 | 1.2 s |
| prop (turboprop) | `prop_flyby` | -13 | 1.5 s |
| heli | `heli_flyby` (rotor thumps) | -14 | 2.0 s |
| missile | `missile_launch_hit` | -9 | 0.8 s |
| hit | `hit` | -8 | 0.5 s |
| whoosh (zoom) | `zoom_whoosh` (Mixkit "Cinematic tunnel reverb woosh", deep, reverb tail; owner pick 2026-09-30) | -12 | 0.5 s |

**Zoom / transition sound (owner 2026-09-30):** only on the BIGGEST camera moves (the hook dive, the flash-forward cut, the
hook zoom-out). No zoom sound on ordinary camera moves, arrows or commander badges (badges slide in silently). The sound is
`zoom_whoosh.wav` (owner picked it from 3 rounds of tests; Mixkit Sound Effects Free License, no credit needed), checked by the sound lock.
| mg | `mg_burst` | -18 | 1.0 s |
| tick (counters) | `counter_tick` | -20 | 0.12 s |
| static (radio) | `radio_static` | -21 | 3.0 s |

`K.impact`, `K.gun` and `K.aircraft` call `SFX()` automatically, so scenes get the right sound without extra code.

## 3a. THE BATTLE SOUNDS (owner's favourites, locked 2026-09-30; enforced by `tools/check_sound_lock.py`)
Hear them in `reference/style-reference-30s.mp4`. Every session must use exactly these; the build STOPS if they change.
| On screen | Code (does the sound automatically) | What you hear |
|---|---|---|
| Field artillery / mortars firing | `K.gun` (or the scene's `shoot()` helper) | quiet launch thud (-24 dB), never a boom |
| **Artillery shells landing** | `K.impact` r < 20 | **real distant-artillery boom** (cand3 / cand1, -7 dB) + fireball + smoke + small shake |
| **Ships' guns firing** (e.g. HMS Arrow) | same `K.gun` -> arc -> `K.impact` from the ship's bow | quiet launch, **same real artillery boom on impact** |
| **Planes bombing** | **`K.bombRun({ pts, t, bombs: [[x,y], ...] })`** (one line: jet + bombs 0.25 s apart + **SCREEN SHAKE** on the first bomb) | jet roar with Doppler (-11 dB), then **real distant-explosion booms** (cand2 / cand4, -4 dB) + **camera shake** |
| Jets / turboprops / helicopters | `K.aircraft` kind `jet` / `turboprop` / `heli` | engine flyby loudest mid-flight (-11 / -13 / -14 dB) |
| Aircraft shot down | `K.aircraft({ down: t })` | engine sound, then crash fireball |
Rule: **the boom is always on the impact.** **Bombing always SHAKES the screen** (first bomb of every run, strength 5; every big explosion shakes 6, shells 3). Never set `shake: false` on a bombing run, **and never switch the shake off on shell hits or explosions either** (owner 2026-10-03: every shell that lands shakes, also every shell of a volley; the O.P. Smith video lost it in 4 scenes this way). Leave `K.impact` at its default shake. Examples to copy: ship + field-gun barrage `goosegreen/scenes-src/move1.js`
("the barrage"), bombing run `move3.js` ("the Harrier strike").

## 4. Music (locked)
- Kevin MacLeod (incompetech.com, CC BY 4.0), in this order: **"Long Note One"** (hook + move 1) -> **"Wounded"** (move 2) -> **"Long Note Two"** (move 3) -> **"Anguish"** (ending).
- Build: `python3 tools/make_music_bed.py` (fits each track to its chapter, 5 s crossfades, -20 LUFS, 3 s fade-out).

## 5. Mix levels (locked, in assemble_full.py / make_clip.py)
- Music `MUSIC_VOL = 0.08` (owner 2026-09-30 chose option C of a 0.18 / 0.12 / 0.08 test; the reference clip still has the older 0.18 music), 2 s fade-in, 3 s fade-out.
- Music ducked under the voice: sidechain threshold 0.03, ratio 6, attack 20 ms, release 400 ms.
- SFX ducked lightly under the voice: threshold 0.03, ratio 3, attack 10 ms, release 300 ms.
- Limiter 0.5, then two-pass loudnorm to **-14 LUFS**, true peak -1.5 dB, LRA 11. Audio AAC 192k.
- Sound-only changes never need a re-render: `python3 tools/assemble_full.py --audio-only`.

## 6. Voice, hook, thumbnail, description
- Voice: Kokoro `am_michael` (`tools/narrate.py`).
- Hook: formula in HANDOVER section 1 (stakes-first line, flash-forward, change every 3-5 s, SFX on every beat).
- Thumbnail: formula in HANDOVER 1b (vidIQ + Tactical Genius references, 1-3 word text, generic officer).
- Description: copy the layout of `goosegreen/build/youtube_description.txt` (chapters, sources, map/music/SFX/image credits), but with **NO links at all** (owner rule 2026-10: new channels get flagged as spam; write "licensed under Creative Commons Attribution 4.0" instead of the URL). Full rules: `research/PACKAGING_GUIDE.md`.

## 7. Tried and REJECTED (don't offer these again)
- Opening on a photo.
- Synthesized artillery booms (replaced by real recordings).
- The `sfx/candidates/bombs/` clips (owner disliked them).
- Loud gun-launch sounds / boom at launch instead of impact.
- Bright, fully saturated front lines; flat territory fills over whole areas; tint spilling onto sea or distant land.
- Two-coloured lines behind the front.
- Simple flat aircraft icons.
- NATO dot/oval artillery and oval tank symbols (silhouettes chosen).
- Music at 0.35 (too loud).
- Licences: no NonCommercial / NoDerivatives (no IWM Non-Commercial, no BBC SFX). Never a fake likeness of a real person.
