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

## 0b. THE COMPLETE REFERENCE VIDEO (LOCKED, owner 2026-10-10: "perfect, make sure this style is locked"): Rokossovsky #8
The finished Rokossovsky video is the channel's locked look + sound, end to end. Every new video copies it.
- **Watch first:** `reference/style-reference-rokossovsky-v8.mp4` (~1:37: wide option-1 overview with the invasion arrows and a bomb run,
  a tank ambush close-up, the night counter-barrage at Kursk, the bombing of the Bobruisk pocket, projector-frame archive film) and
  `reference/hook-reference-rokossovsky-v2.mp4` (the locked hook, section 1a). Final master: https://gofile.io/d/nWvp2ksX (15:29).
- **Skeleton to copy for every new video: `rokossovsky/`** (lib/, tools/, vendor/, assets/fonts, assets/grain.png, assets/media/sfx/,
  music, flags, emblem). It has every fix: hook lock, sound sync (`sfx_cues.py` reads the current timing), voice-A mix
  (`voice_owner.wav`), `make_clip.py` with voice A, archive builder, thumbnail compositor, publishing guide.
- **What is locked in it (all from sections 1a-5; do exactly this):**
  - Maps: HD dark relief (`bake.py` then `bake_hd.py` -> use `<map>_hd_ref`), 1941-44 names, big towns only, living map, both period
    flags on every map shot, emblem only on German land and never fading, legend top-centre.
  - Option 1 territory (multiply `_mx` control overlays, one per date, 1 s cross-fade) on wide shots; option 2 glowing two-colour fronts
    (`K.front`, **width 15, glow 0.47**, never thinner) on close-up battles; one wide shot -> push-in -> close-up -> zoom-out per move.
  - Units: silhouette counters with flag chips + size marks; commander badges with the REAL licensed photo (initials only if none);
    Stalin-type figures as text cards, never a likeness.
  - Action: `K.gun` -> arc -> `K.impact` (boom on impact, default shake); `K.bombRun` with glowing `c47g` planes (few, spaced, they
    leave); night beats with `K.night`; stamps (hit + shake), counters (ticks), fire sacks, rings.
  - Every move ends: casualty card (`K.casualties` style, real numbers only) or a RESULT card when no reliable figure exists, then the
    method card that adds one line per move.
  - Archive: Netflix look (headline card, 3D-depth photos, projector-frame film, headline date cards), licensed only: US government film
    (Signal Corps, Capra "Why We Fight"), NARA CC0, Commons CC BY / CC BY-SA / PD stills with credits. Never untagged uploads.
  - Sound: the locked kit (section 3/3a), music 0.08 (section 4-5), -14 LUFS; **after ANY timing change, `assemble_full.py --audio-only`
    and check one bomb run frame vs sound** (the Rokossovsky remix fixed a 7 s drift).
  - Voice A (section 6). Thumbnail: vidIQ battlefield (left 2/3, labels checked/redone) + the commander's REAL photo cut out on the
    right third + red brush banner, 1-3 words (`rokossovsky/tools/make_thumb.py`). Title: vidIQ >= 85, TG pattern.
- **Per-move snapshot sheets before any render; the owner approves; never render without the OK** (HANDOVER 0b step 7).

## 1. Where it lives (copy from goosegreen/ into every new video)
| What | File |
|---|---|
| All visual effects + defaults | `lib/fx.js` (`const K = FXK(B)`) + `lib/battle.js` |
| Sound levels per effect | `tools/sfx_mix_lib.py` (KINDS) |
| Sound files | `assets/media/sfx/` (incl. `candidates/cand1-4_hit.wav`) + `SFX_CREDITS.md` |
| Music | `assets/media/music_src_*.mp3` -> `python3 tools/make_music_bed.py` |
| Final mix (levels, ducking, loudness) | `tools/assemble_full.py` (full video), `tools/make_clip.py` (tests) |
| Reference scenes to copy from | `goosegreen/scenes-src/move3.js` (Harrier bombing run, helicopters, AA, casualty card), `test-terr-f.js` (fronts + territory, final look), `move1.js` (night attack) |

## 1a. THE HOOK (LOCKED, owner 2026-10-09, Rokossovsky hook v2: "I do like it... I want all videos to have strong hooks like this")
Reference: `reference/hook-reference-rokossovsky-v2.mp4` (0:00-1:04, voice + music + SFX) and its beat sheet
`reference/hook-reference-rokossovsky-v2-sheet.jpg`. Every video's first minute must match it. v1 of that hook was REJECTED as
"boring, not visual": a belief as line 1, no card, 7-10 s with nothing new, an 18 s static badge. Never ship a hook like that again.
**Script (first ~60 s, 4 paragraphs):**
1. **Line 1 = a hard number + the disaster/stakes in 3 short sentences** ("Four hundred thousand German soldiers. Lost in a single summer.
   And it all began in a swamp the Germans were sure no army could cross."). Never a date + place, never a belief or background first.
2. **Flash-forward / payoff by ~0:20-0:25** (the title + thumbnail promise paid: "Three days later, a whole German army was trapped...").
3. **The human twist as ACTION, not a portrait** (prison, wound, disgrace, odds against the man), every detail its own beat.
4. **Name reveal + the three moves as quick cuts**, then "These are <Name>'s three greatest tactical moves." Hook total ~60-65 s.
**Visuals + sound (check each on the snapshot sheet before rendering):**
- Frame 0: map with units ALREADY MOVING (guns firing, counters advancing), flags + territory on screen.
- **A big number card slams in within the first second** (hit + shake) and ticks up (ticks); a stamp on the punchline (hit + shake).
- **A hard zoom-whoosh camera DIVE within the first ~6 s** onto the place of the story.
- **Something new every 2-4 s, never more than 4 s without a change** (camera move, stamp, counter, units moving, impacts, cut).
  Make the snapshot sheet every ~2.5 s for the first 30 s to prove it.
- **White-flash cut into the flash-forward**; the trap/victory slams shut with boom + shake; zoom-out whoosh to the big picture.
- **Twist sequence:** hard cut to dark, the year rolls back with ticks, an overlay that SLAMS (e.g. prison bars) over the real photo badge,
  one stamp per spoken detail (hit + small shake + red pulse), caveats as a small caption ("by his family's account").
- **Name slams in** (hit + shake), then 3 snap cuts (~3 s each, whoosh + hit) of the three battles, then the title card (riser + boom).
- SFX on every beat; the zoom whoosh only on the 2-3 biggest camera moves (dive, flash-forward, zoom-out).
**Source to copy:** `rokossovsky/scenes-src/hook-a.js` + `hook-b.js` on branch `claude/rokossovsky-video-8` (script: `rokossovsky/script.md` HOOK).

## 2. Visuals (locked)
- **Opening:** every video opens on an animated MAP with units on screen in the first second. Never a photo. Photos only after the hook. The whole first minute follows the LOCKED HOOK (section 1a).
- **Map:** parchment shaded relief (`bake.py`), faint dashed grid (`K.grid`), vignette + grain, date top-left. Flat, no 3D tilt.
- **Colours:** counters/aircraft/arrows blue `#1f4fc4` (hero) / red `#c4121f` (enemy). Day front lines `#2c57b7` / `#bc2528` (30% muted from the counters). Night lines + territory tint `#4a6a9a` / `#a8503c`. Neutral grey `#77746c`, gold `#c9b48a`, text `#f7f3ea`, font Oswald.
- **Front lines (`K.front`):** glowing band, width 15, glow 0.47, drawn on, gentle pulse.
  - Only the REAL front (where the sides touch) is two-coloured. Lines behind it are one colour.
  - **Wide campaign maps** (a whole country or theatre: Korea, Sicily, Normandy, Holland): every front line between the two sides is **two-coloured, blue on our side and red on theirs, never one colour** (owner 2026-10-04). One-colour lines are only for reserve/depth lines on close-up battle maps.
  - When a front collapses, the two-colour band MOVES to the next line (`to` + `moveT`, moveDur 3.0).
- **Territory ("E" look, `K.frontTint`):** alpha 0.34, depth 170 px behind the front (95 px for a forward zone that will be lost), soft 24, clipped to land with a land mask (`elev > 0.5`). Lost ground flickers then fades (`K.lose`). End every scene with `K.raiseTerritory()`.
- **WHO CONTROLS THE GROUND + NATION FLAGS, ON EVERY MAP (owner 2026-10-05, Gavin):** every map scene, the overview maps AND
  every battle map, shows which side holds which ground and whose flag it is:
  - **Territory colours (strong, not faded):** Allies/hero `#2e5cb2`, Axis/enemy `#be3a2a`, neutral `#807c72`; alpha 0.46 inside,
    up to 0.66 right at the border, clipped to land; a two-colour front band where the sides meet; thin country borders.
    Generator: `gavin/tools/make_europe_control.py` (historical borders `world_1938.geojson` + front polylines per date ->
    `assets/media/<map>_ctl_<date>.png`, placed with `B.image(...)` and cross-faded when the date changes).
  - **The map changes with time:** one overlay per date the narration reaches (e.g. Jul 43 / Sep 43 / Jun 44 / Sep 44), cross-fade 1 s.
  - **Nation flags on the map** with the name under them (flag ~115 px on screen, white Oswald name), one per power on screen;
    "NEUTRAL" labels on neutral countries; legend card ALLIES / AXIS / NEUTRAL top-centre. Use the PERIOD national flags:
    Germany 1933-45 = the red flag with the white disc and swastika (`ger_reich_flag.png`, owner's choice), Kingdom of Italy
    with the Savoy shield (`italy_flag.png`), USSR 1936-55 (`ussr_flag.png`), UK, US 48-star. Unit counters keep their small flag chips.
  - Battle maps: the same colours fill each side's ground behind its front (on top of the `K.front` lines), with the flags of
    the nations fighting placed on their ground. Reference: `gavin/scenes-src/intro.js` (hook-3) and `ending.js`.
  - Fact-check every front line per date and log it in FACT_NOTES ("control map").
- **Night (`K.night`):** fully muted palette + brightness boost on lines and territory; normal at dawn.
- **Unit symbols (`K.counter`):** infantry X · artillery = howitzer silhouette · tank/armour = tank silhouette · mech = X + track · AA = twin barrels · HQ = flag. Flag badge + size mark (••• platoon, I company, II battalion, III regiment).
- **Artillery:** the gun fires (`K.gun`: flash, smoke, recoil), shell arc, **impact** (`K.impact`: fireball, shock ring, smoke, small shake).
- **Aircraft (`K.aircraft`):** detailed top-down jets / turboprops / helicopters with ground shadow, spinning props/rotors, dotted flight path; shoot-downs smoke, spiral and crash; helicopters' shadows close in when they land.
- **WW2 transport / plane symbol (locked, owner 2026-10-06): the glowing C-47, `K.aircraft({ kind: "c47g", side })`.** White body with a soft glow; the **outline and glow take the side colour: blue = Allies (`side: "carth"`), red = Germans/enemy (`side: "rome"`)**. Size ~30 on wide maps. Planes **fly in spaced out (few, not swarms), do their job (drop / bomb) and fly off the map**; never stop or fade in mid-air. Preview: `frontlines-1m/build/plane-glow-sides.png`; used in the 1-min D-Day test (`frontlines-1m/scenes-src/europe_hd.js`). The old twin-boom `cargo` and the striped `c47` icons were rejected (looked like drones / didn't convince).
- **Bombing run (owner's favourite, copy exactly):** jet flies the run (size 84, alt 30, dur 3.2); each bomb is `K.impact(x, y, t0 + 1.55 + k * 0.25, { r: 20, shake: first ? 5 : false })`, i.e. just after the jet passes, sticks 0.25 s apart. Code: `goosegreen/scenes-src/move3.js` ("the Harrier strike").
- **Also:** ship silhouettes with muzzle flashes, burning places with smoke columns (`K.smoke`), pulsing target rings on objectives (`K.target`), commander badge (`K.badge`, initials on dark tint if no legal photo), casualty card after every move with losses (`K.casualties`), captions bottom-centre.

## 2a. MERGED "FRONTLINES" LOOK (owner-approved 2026-10-06, the 1-min D-Day test; lessons from Netflix "WWII: From the Frontlines")
Our locked style (sections 2-5) stays the base; these are ADDED on top. Reference build: `frontlines-1m/` (scenes `europe_hd`, `normandy_hd`, archive `a-1`/`a-2`; `ONEMIN=1 python3 tools/assemble_dday.py`); final test video https://gofile.io/d/YX3zQBqK.
- **Open on a 2D map, no globe.** The owner dropped the globe/cloud dive: start straight on the dark 2D map with units moving in the first second (the 3D tilt is out too: maps stay flat).
- **Detailed maps (HD relief):** `tools/bake_hd.py` = zoom+1 terrain tiles, 5760x3240 shown at 2880x1620, 4-direction hillshade + slope + ambient occlusion + fine texture. Rivers traced from the elevation data (`make_rivers_dem.py`), places from OSM (`fetch_osm.py`).
- **Geography layer (`make_geo_layer.py BASE STYLE SKIP MAXV MINPOP`):** only BIG towns (population >= MINPOP, e.g. 8000; no villages, no suburbs), small labels, period names (1944 names, HIST dict), labels never collide. Put it ABOVE the territory layer (else it turns pink). Story places (e.g. Sainte-Mère-Église, Utah Beach) as small white-box labels; keep them small.
- **Territory:** strong colours drawn with `mixBlendMode = "multiply"` (`_mx` overlays: axis (232,52,52) / allied (110,160,255)) so the relief shows through the colour.
- **Living map (`lib/living.js`, `LivingK`):** drifting cloud shadows, shimmer on rivers, scale bar, north arrow. Always on.
- **Flags + emblem:** the period national emblem sits ON its country's land (e.g. the Nazi emblem centred on Germany): never over the sea, over labels, or cut by the frame edge; it STAYS for the whole map (never fades). No country-name label next to it (the flag says it). Every power in the story has its flag visible (UK, USA, USSR...); widen the camera if one is off-screen.
- **BOTH OPTIONS ARE LOCKED AND KEPT (owner 2026-10-06): never delete either one.** Choose per shot:
  - **Option 1 = territory colours** (each side's ground filled with strong colour + flags) -> **overhead / wide shots** (a continent, a country, a campaign overview).
  - **Option 2 = two glowing front lines only** (no fill) -> **close-up battle maps** (a town, a river crossing, a beachhead), where the fill would hide the terrain, roads and units.
  - Use your eye: if a close-up reads better with fill (or a wide shot with lines), pick that; a video can use both (wide shots option 1, then option 2 when the camera goes in close). If the owner names one ("use option 1/2"), use it everywhere they say.
- **OPTION 2 details: "front lines only".** Drop the territory fill entirely (no `_mx` / control overlay) and show who holds what ONLY with the **two-colour glowing front lines** (`K.front`, width 15, glow 0.47: blue band on the Allied side, red band on the Axis side) wherever the sides touch; the legend shows two short glowing lines instead of squares. Flags, emblem, labels, planes and everything else stay the same. Lines come from the same control map: `python3 frontlines-1m/tools/make_front_lines.py OVERLAY.png OUT.json [MINLEN]` (traces the axis/allied border, drops coast rims, orients blue to the Allied side). Example: `frontlines-1m/scenes-src/test-opt2.js`; comparison sheet `frontlines-1m/build/territory-options.jpg`.
- **Planes:** the glowing C-47 (`c47g`, section 2), few and spaced out; they drop/bomb and then fly off the map.
- **Archive sections (Netflix look, `tools/build_film_dday.py` + `archive_shots.py`):** (1) a **newspaper headline card** (`make_headline_dday.py`) with a paper-page sound; (2) **photos with 3D depth** (parallax, `"depth": True`) with a small caption (unit · place · date); (3) restored, tinted **film inside a projector frame** (`"frame": True`) with a quiet projector loop; (4) **date cards in headline style** ("6 JUNE 1944 / NORMANDY, FRANCE"). Never a slideshow.
- **Sound design (Frontlines-style, mixed separately from the locked SFX, `assemble_dday.py`):** cinematic whoosh on camera moves (-14 dB), dry pop on labels (-20), big cinematic boom on key beats (-11), reverse riser into reveals (-17), newspaper page (-12), projector loop under film (-27), low tactical/tension drone bed (-30). The locked battle sounds (section 3a), plane sound B, music 0.08 + the locked mix chain are unchanged.
- **Voice:** voice A (section 6); option 2 = plain am_michael. **Music:** the channel bed; Kevin MacLeod "Five Armies" (CC BY 4.0, from 1:00) matched to the bed loudness is approved for this look.

## 3. Sound effects (locked files and levels)
Rule: every visual beat has a sound, and **the boom is always on the impact** (launches are quiet). **Aircraft sounds only when an aircraft is on screen** (owner 2026-10-06): never a plane/jet/heli sound over parachutes or an empty sky; give `K.aircraft` the sound (its default) or show the planes. Levels are dB in `sfx_mix_lib.py`:

| Kind (`SFX(kind, t)`) | Sound | Level | Min gap |
|---|---|---|---|
| impact (shells, mortars landing) | real distant artillery `cand3_hit`, `cand1_hit` | -7 | 0.25 s |
| explosion (bombs, big blasts, `K.impact` r >= 20) | real distant explosions `cand2_hit`, `cand4_hit` | -4 | 0.20 s |
| fire (gun launch) | `gun_fire` | -24 | 0.35 s |
| mortar (launch) | `mortar_thump` | -24 | 0.30 s |
| jet | `jet_flyby` (roar + Doppler, loudest mid-flight) | -11 | 1.2 s |
| prop (turboprop / transport) | `prop_flyby` = Mixkit "Low airplane flying over" (owner pick "sound B", 2026-10-06; replaced the old prop sound) | -13 | 1.5 s |
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
- **Voice (DEFAULT, owner-locked 2026-10-06): voice A** = the Kokoro am_michael narration converted to the owner's reference voice with `tts/convert_voice.py` (ref `tts/voices/owner_ref.wav`, sample `tts/voices/test_A_chatterbox.mp3`; setup `bash tts/setup_clone.sh`). Same pacing and timestamps as the Kokoro take. **Option 2 (fallback only, or when the owner asks):** the plain Kokoro am_michael narration.
  Steps: `tools/narrate.py` (am_michael) → `audio/voice.wav` + `timing.json` → `/home/user/cb-venv/bin/python /home/user/battle-maps/tts/convert_voice.py audio/voice.wav /home/user/battle-maps/tts/voices/owner_ref.wav audio/voice_owner.wav` (~15-20 min per 18 min) → mix `voice_owner.wav`.
- Hook: formula in HANDOVER section 1 (stakes-first line, flash-forward, change every 3-5 s, SFX on every beat).
- Thumbnail: formula in HANDOVER 1b (vidIQ + Tactical Genius references, 1-3 word text, generic officer).
- Description: copy the layout of `goosegreen/build/youtube_description.txt` (chapters, sources, map/music/SFX/image credits), but with **NO links at all** (owner rule 2026-10: new channels get flagged as spam; write "licensed under Creative Commons Attribution 4.0" instead of the URL). Full rules: `research/PACKAGING_GUIDE.md`.

## 7. Tried and REJECTED (don't offer these again)
- Voice: Chatterbox text-to-speech cloning (`tts/clone_voice.py`, pacing off); Seed-VC conversion (B: ~4 h per video on CPU, not preferred by ear).
- Opening on a photo.
- Synthesized artillery booms (replaced by real recordings).
- The `sfx/candidates/bombs/` clips (owner disliked them).
- Loud gun-launch sounds / boom at launch instead of impact.
- Bright, fully saturated front lines; tint spilling onto sea or distant land. (Faded territory is also out: since 2026-10-05 territory is strong, see section 2.)
- Two-coloured lines behind the front.
- Globe / cloud-dive openings and 3D tilted maps (owner 2026-10-06: open on the flat 2D map). Village-level labels, big labels, modern merged town names, emblems over the sea or fading away.
- Simple flat aircraft icons, drone-like twin-boom transports, planes that stop in mid-air (exception: the glowing C-47 `c47g` is the approved WW2 plane symbol).
- NATO dot/oval artillery and oval tank symbols (silhouettes chosen).
- Music at 0.35 (too loud).
- Licences: no NonCommercial / NoDerivatives (no IWM Non-Commercial, no BBC SFX). Never a fake likeness of a real person.
