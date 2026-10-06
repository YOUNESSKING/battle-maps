# HANDOVER v3: faceless military-history channel (Tactical Genius style)

**Owner:** Youness Fakiri · **Updated:** 2026-10-03 (after the O.P. Smith video)
**How to use:** start a new Claude Code cloud session on the repo `younessking/battle-maps` (environment with **Full** network access), attach the Gemini research file, and say: *"Read HANDOVER.md. Make the full video from this research."*

## 0a. NEXT VIDEO: quick start (read this first)
**Videos done:** Hannibal (test), Daniel Morgan, Nathanael Greene, Goose Green (2 Para), Belisarius, **O.P. Smith (#6, branch `claude/lucid-tesla-qugecc`, folder `smith/`)**, George H. Thomas (branch `claude/george-thomas-civil-war-2epkux`), **James M. Gavin (#7, branch `claude/gavin-video-7`, folder `gavin/`)**. The owner picks the next topic.
**Style = STYLE_LOCK.md, exactly** (the O.P. Smith / Goose Green look and sound: fx.js effects, front lines + territory, night, counters with flags, aircraft + `K.bombRun` with shake, locked battle sounds, music 0.08, zoom sound only on the 3 biggest moves). The George Thomas branch's "detailed map style" (demo3, thomas/lib) is NOT the channel style; don't use it.
**Owner rules learned on Smith (binding):**
- Follow the no-skip checklist (0b step 7) in order; send ONE labelled snapshot sheet per move and wait for approval; **never render without the owner's OK**.
- Sound = the locked kit only. Don't source extra sounds, don't pitch-shift or swap the battle sounds, don't raise the music. `tools/check_sound_lock.py` must say OK.
- Commander badges: real public-domain photo when one exists (crop it; Wikimedia blocks this machine's IP after a while: fetch through `https://images.weserv.nl/?url=upload.wikimedia.org/...` or use the Library of Congress API). Quote marks only on verbatim quotes, also in speech bubbles.
- **The cloud machine reboots** (every ~30-60 min, and whenever the session goes idle): a running render or assembly dies, finished renders survive. Start renders detached (`render_all.sh`), stay in the turn watching them with <10-min foreground waits, relaunch only the missing scenes.
- Research: use `research/GEMINI_BRIEF_v3.md` (sources + VERIFIED/DISPUTED labels); log every fact correction in `<name>/research/FACT_NOTES.md`; list any figure that is from memory in the publishing PDF's "facts to double-check" box.
- Packaging: `research/PACKAGING_GUIDE.md` (vidIQ-scored title >= 85 with the hook in the first ~60 characters, thumbnail = same promise, chapters from timing.json, 12-18 tags). **Descriptions contain NO links at all** (new channels get flagged as spam): name licences in words. Thumbnail = HANDOVER 1b formula (2 variants, commander name tags on the map, check spelling/geography).

## 0. Repo layout (clone path must be /home/user/battle-maps)
| Path | What |
|---|---|
| `setup.sh`, `.claude/settings.json` | automatic tool install at session start (runs in background; wait for `/tmp/battle-maps-setup.done`) |
| `research/` | **GEMINI_BRIEF_v3.md** (paste into Gemini), **PACKAGING_GUIDE.md** (titles, thumbnails, descriptions, chapters, tags), TG_THUMBNAIL_TEXTS.md, NICHE_ANALYSIS.md, VIDEO_IDEAS_v2.md, COMPETITOR_ANALYSIS.md |
| `hannibal/` | video #1: script.md, audio/ (voice.mp3 + timing.json), scenes-src/ (hook-march.js, trebia.js), assets/ (terrain), portraits/, build/ (PDF guide, narration.txt), tools/ |
| `ridgway/` | 1-min style-match test. **Newest engine** in `ridgway/lib/` (portrait stakes, bio card, front lines, image layers, region overlays), `tools/mix.py` (voice + ducked music + SFX), `tools/make_masks.py`, assets/media/ (Ridgway photos, flag, synthesized music/SFX) |
| `goosegreen/` | video #4 (Goose Green, 1982), **newest full pipeline: copy new videos from here**. lib/ (engine + `SFX()` sound cues), tools/ (`narrate.py`, `narrate_changed.py`, `bake.py`, `build_scene.py`, `render_all.sh`, `assemble_full.py`, `sfx_cues.py`, `sfx_mix.py`), assets/media/ (images + CREDITS.md, Kevin MacLeod music sources, `sfx/` synthesized sound library), archive.json |
| `chipyongni/` | first test map (hyperframes.json is reused by build_scene.py) |
| `tts/narrate.py` | Kokoro narration (model files downloaded by setup.sh) |
Renders, .wav files and terrain tile caches are not in git: re-render/re-bake as needed.

## 0b. Starting a NEW video from Gemini research
1. `mkdir <name>` and copy the skeleton from `goosegreen/` (engine updated with the Smith improvements: any nation's flags via FLAGS in lib/fx.js, `prop` and `cargo` aircraft art, `K.bombRun`, `tools/make_land.py` land masks; the full Smith project is on branch `claude/lucid-tesla-qugecc` for reference): `lib/ tools/ vendor/ assets/fonts assets/grain.png assets/media/sfx/ assets/media/music_src_*.mp3` (goosegreen has the newest engine, tools, **default sound library and default music**, see 1b "Default sound & music kit"). Edit SCENES/CHAPTERS in `tools/assemble_full.py`. Don't search for new music or sounds: the kit is approved.
2. Write `<name>/script.md` from the research (formula + **hook formula** in section 1; tags `[MAP: id | notes]` / `[ARCHIVE: notes]`), ~2,400-2,700 words.
3. Voice: point SCRIPT/OUT in `tools/narrate.py` at the new folder, run it from `/home/user/battle-maps/tts` → `audio/voice.wav` + `timing.json`. After editing a few paragraphs, run `tools/narrate_changed.py` instead: it re-voices only changed paragraphs and reuses the rest (minutes instead of ~15 min).
4. Bake terrain per battle (`tools/bake.py`), write map scenes (agents in parallel, but agents only write + snapshot; they don't render), fill archive slots (`archive.json`), then render ALL scenes + assemble with ONE command: `bash tools/render_all.sh --assemble "SCENE BASEMAP FIRST LAST" ...` (detached, sequential; wait for `logs/render_all.done`). `assemble_full.py` collects the sound cues from every scene (`sfx_cues.py`), renders the SFX track (`sfx_mix.py`), mixes voice + ducked music + ducked SFX, and normalizes to -14 LUFS in two passes. Music: after the voice exists, run `python3 tools/make_music_bed.py` (builds `assets/media/music.wav` from the four default tracks, fitted to this video's length and chapters). Commit + push after each milestone.
5. **Test before applying (owner rule):** any new look or sound is shown first as snapshots (`hyperframes snapshot . --at ...`, several options in ONE labelled sheet) and/or a 1-minute test clip (`python3 tools/make_clip.py SCENE --from PARA --to PARA`), and only applied to the video after approval. Sound-only changes never need a re-render: rebuild the scene pages (`build_scene.py`) and run `python3 tools/assemble_full.py --audio-only` (~5 min).
6. Preview for chat (30 MB limit): two 540p halves, e.g. `ffmpeg -ss 0 -t 515 -i build/<name>.mp4 -vf scale=960:540 -c:v libx264 -preset slow -b:v 360k -maxrate 600k -bufsize 1200k -c:a aac -b:a 64k part1.mp4` (and `-ss 514` for part 2).
7. **No-skip checklist (every video, in order):** research brief -> script (hook formula, first paragraph = `[MAP]`) -> voice (`narrate.py`) -> music bed (`make_music_bed.py`) -> terrain + land mask -> map scenes in the LOCKED style (1b: fx.js defaults, front lines, territory, night, symbols, aircraft, artillery, SFX on every beat) -> archive stills (licensed only, never before the hook) -> snapshot check -> `render_all.sh --assemble` -> check master with ffprobe (1920x1080, ~-14 LUFS) -> description (chapters + sources + music, SFX and image credits) -> thumbnail (formula in 1b) -> publishing PDF (`make_publish_guide.py`) -> upload (Gofile) -> commit + push.
Use a fresh session for each video: it uses 5-10x less of your plan's usage than one long conversation.

---

## 1. The plan (unchanged)
- Niche: famous generals' top 3 tactical moves, modelled on **Tactical Genius** (@tacticalgeniuss). Copy the *structure*, not the look or words.
- Format: 16-19 min, ~80% animated battle maps, ~20% archival (film for the 20th century; paintings, busts and coins for ancient generals), calm documentary voice.
- Script formula: hook (FIRST PARAGRAPH IS ALWAYS A [MAP] SHOT, never an archive photo; disaster, then the hero, then "his three greatest tactical moves") → 3 moves (situation with numbers → what the enemy believed → "X saw something different" → execution → result as a number) → the general's 3-part method repeated after every move → subscribe ask between moves 1 and 2 → ending (callback, legacy, "which commander next?").
- **Hook formula (first ~40 s), from web research + owner feedback (Goose Green):**
  - **Stakes before context.** Line 1 is the odds or the disaster in a few words ("Five hundred men. A thousand dug in against them. And the enemy knew they were coming."). No date/setting first, no channel intro.
  - **Open a loop and preview the payoff** within ~30 s: flash-forward to the result ("Thirty-six hours later, nearly a thousand … would surrender to a battalion half their size. And the man who planned the attack would be dead.").
  - **Visual:** first frame is a map with units already on screen (never a photo); a big on-screen odds card (500 VS ~1,000); something changes every 3-5 s (camera dive, rings, stamp, counter); one stamp punchline; a white-flash cut into the flash-forward with a counter ticking up.
  - **Sound on every beat:** hit on each slam/stamp, whoosh on camera dives and the flash-forward, static under the radio moment, ticks on counters (`SFX("hit"|"whoosh"|"static"|"tick", t)` in the scene).
  - The hero's bio cards come after the stakes (~1:00-2:00). Background (how the war started) comes after the hook, kept short. Target: keep ~65%+ of viewers at 30 s.
- First video: **Hannibal** (Trebia, Lake Trasimene, Cannae). Next candidates: see research/VIDEO_IDEAS_v2.md (top: Nathanael Greene, Daniel Morgan, Francis Marion, George Thomas).

**All locked decisions with exact numbers (and what was rejected) are in one file: `STYLE_LOCK.md`.**

## 1b. LOCKED VISUAL STYLE (owner-approved, Goose Green v3; use `lib/fx.js` = `const K = FXK(B)` in every scene)
Inspired by Kings and Generals, kept flat (no 3D camera tilt). Every new video must use all of these:
- **Map:** parchment shaded relief (bake.py), faint dashed lat/long grid (`K.grid`), vignette + grain, date scroll top-left.
- **Colours (fixed):** counters/aircraft/arrows: British/hero **blue `#1f4fc4`**, enemy **red `#c4121f`**; neutral/destroyed grey `#77746c`; gold `#c9b48a`; text `#f7f3ea`. **Front lines (day): blue `#2c57b7` / red `#bc2528`** (30% muted); **front lines at night + territory tint: slate `#4a6a9a` / brick `#a8503c`** (fully muted). These are the defaults in `lib/fx.js` (LINE_DAY, LINE_NIGHT, TINT): don't override them.
- **Front lines (`K.front`, defaults = locked look):** glowing band, width ~15, glow ~0.47, drawn on like an arrow, gentle pulse.
  - **Only the REAL front line (where the two sides touch) is two-coloured** (blue glow on the hero's side, red on the enemy's). Lines behind a front (reserve / depth / main lines not yet in contact) are **one colour only** (sideA = sideB = that side).
  - **When a front collapses, the two-colour band MOVES to the next line** (`to` + `moveT`), replacing that line's one-colour band; the ground in between is lost (see Territory).
- **Territory (locked "E" look):** `K.frontTint` = muted colour strongest right behind each front edge, fading out within ~100-170 px (NOT flat fills over whole areas). Clip it to land with a land mask (`assets/<map>_land.png`, built from the elevation tiles with the same `elev > 0.5` rule as bake.py; see goosegreen/assets/isthmus_land.png). Lost ground: `K.lose` (flicker then fade); advancing ground: `to`/`moveT`. Call `K.raiseTerritory()` at the end of the scene.
- **Control map + flags (owner 2026-10-05):** on EVERY map (overview and battle maps), strong territory colours for who holds the ground (Allies `#2e5cb2` / Axis `#be3a2a` / neutral `#807c72`), changing with the dates, plus the period nation flags (German 1933-45 national flag, etc.) and a legend. Details + generator: STYLE_LOCK section 2, `gavin/tools/make_europe_control.py`.
- **Night (locked):** at night the lines switch to the fully muted palette and lines + territory get a brightness boost so they stay readable (`K.night({ lines: [...fronts], tOn, tOff })`); daytime returns at dawn.
- **Unit counters (locked symbols, owner-approved 2026-09-28):** coloured block + **flag badge** (uk/arg or the video's nations) + **size mark** above (••• platoon, I company, II battalion, III regiment) + a symbol that fills the counter (`K.counter(id, { icon, flag, size })`):
  - **infantry** = X (NATO) · **artillery** = side-view **howitzer silhouette** (barrel, shield, wheel, trail) · **tank / armour** = side-view **tank silhouette** (hull, turret, gun, road wheels) · **mech** (mechanised infantry) = X + track outline · **aa** = twin-barrel AA gun · **hq** = flag.
  - Silhouettes (Kings and Generals style) were chosen over the NATO dot/oval because anyone can read them without military knowledge. Comparison sheet: goosegreen/build/symbol-options.png.
- **Artillery & mortars:** the gun visibly fires (`K.gun`: muzzle flash, smoke, recoil), a shell arc flies, and the **impact** (`K.impact`: fireball, shock ring, rising smoke, small camera shake) carries the loud boom. Launch sounds are quiet; **the boom is always on the impact**.
- **Aircraft:** detailed top-down art (`K.aircraft`, kinds `jet`, `turboprop`, `heli`) with ground shadow (altitude), spinning rotors/props, burner flicker, dotted flight path; helicopters' shadows close in when they land (`land: true`); shoot-downs trail smoke, spiral and crash in a fireball (`down: t`). Never simple flat icons.
  - **Engine sound on every aircraft (locked):** each `K.aircraft` automatically plays its flyby sound, loudest mid-flight: `jet` = jet roar with Doppler sweep, `turboprop` = propeller drone, `heli` = rotor thumps (sfx kinds jet / prop / heli).
  - **Bombing runs (locked):** use `K.bombRun({ pts, t, bombs })` (it SHAKES the screen on the first bomb). Same as: jets fly the run with `K.aircraft`; each bomb is a `K.impact` (r ~20) at its target, timed just after the jet passes. **No sound on release; the bomb's boom plays on impact** (real distant-explosion recordings) with fireball, smoke and camera shake. Sticks / cluster bombs = several impacts 0.2-0.3 s apart (the mixer lets explosions through 0.2 s apart). Example: the Harrier strike in goosegreen/scenes-src/move3.js.
- **Ships:** side silhouettes with muzzle flashes when firing (GG.ship + K.gun).
- **Smoke & fire:** burning places get a continuous smoke column (`K.smoke` repeated).
- **Objectives:** pulsing target rings (`K.target`) on the key hill/house/town of each move.
- **Commanders:** round **badge** with portrait (or initials if no legal photo) on the nation's flag, name plate, slides in at a corner (`K.badge`) whenever a commander is introduced or takes over.
- **Casualties:** at the end of every move with losses, a **casualty card** with flags and pictograms (skull killed, cross wounded, bars captured, plane aircraft) (`K.casualties`).
- **Text:** captions bottom-centre, stamps/punchline cards, stat counters; Oswald font.
- **Thumbnail (locked formula, from all 13 Tactical Genius videos, studied 2026-09-27):**
  - **Picture (identical on every TG thumbnail):** dark, desaturated, moody realistic aerial battlefield on the left 2/3 (red/blue unit blocks, big curved white arrows, fires + black smoke, small place labels and commander name tags on the map); realistic commander portrait on the right 1/3 (3/4 view, looking toward the map, binoculars, stern); red brush-stroke banner bottom-left with big white text. Make it with vidIQ `vidiq_generate_thumbnail`, passing 2-3 of TG's top thumbnails as `referenceImages` (Ridgway tVpl949Nk0M, Patton 5EoX2EYJ_WI, Zhukov BvJN3pyPL6E: `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`). No legal photo -> a generic officer of the right unit/era, never a fake likeness of a real person.
  - **Text = what decides the click.** Winners: 1-3 words, understandable with ZERO context, creating tension. Three winning types: (1) the hero's defiance/decision in plain words, "LET THEM COME" (Ridgway 1.0M, 9.9x); (2) the enemy's contempt as a real quote, "AMATEURS" (Patton 773k, 11.9x); (3) ominous stakes, "AT THE GATES" (Zhukov 585k, 24.7x). Losers: nicknames/insults about the general that need background ("DUGOUT DOUG" 29k, "SEPOY GENERAL" 6k, "NOT A SUPERMAN" 23k) and lines of 4+ words ("THE SWINE ISN'T ATTACKING" 111k, 1.7x). Quote marks ONLY on verbatim quotes.
  - Make 2 variants of different text types for YouTube's A/B test; check the AI image for wrong geography, labels or equipment (e.g. tanks where there were none).
  - Goose Green used: SURRENDER OR ELSE (type 1, main), THEY KNEW (type 3, alternative).
- **Sound (locked):** every visual beat has its SFX. **The boom is always on the impact** (launches are quiet). Shell impacts = real distant-artillery recordings, bombs/explosions = real distant explosions (sfx_mix_lib KINDS; credits in `assets/media/sfx/SFX_CREDITS.md`, copy the credit line into the video description). Every `K.aircraft` plays its engine sound (jet / propeller / helicopter flyby) mid-flight. Music bed at `MUSIC_VOL = 0.08` (owner 2026-09-30, option C), ducked under the voice.
- **Default sound & music kit (locked, owner-approved on Goose Green 2026-09-29: reuse on EVERY video, don't re-search):**
  - **SFX library** = `goosegreen/assets/media/sfx/` with the levels in `tools/sfx_mix_lib.py` (KINDS): impact = real distant artillery (`candidates/cand3_hit.wav`, `cand1_hit.wav`), explosion/bomb = real distant explosions (`cand2_hit.wav`, `cand4_hit.wav`), aircraft = `jet_flyby` / `prop_flyby` (since 2026-10-06 Mixkit "Low airplane flying over", owner's pick) / `heli_flyby`, heard only when the aircraft is on screen, plus gun fire, mortar, MG, whoosh, hit, radio static, counter tick. The `candidates/bombs/` clips were REJECTED by the owner: never use them.
  - **Music** = Kevin MacLeod (CC BY 4.0), in this order: "Long Note One" (hook + move 1), "Wounded" (move 2), "Long Note Two" (move 3), "Anguish" (ending). Sources: `goosegreen/assets/media/music_src_*.mp3`; build the bed with `tools/make_music_bed.py` (loops/trims each track to its chapter, 5 s crossfades).
  - **Effects** = everything in `lib/fx.js` at its defaults (front lines, territory, night, counters, artillery, aircraft, smoke, impacts, badges, casualty cards).
  - **Credits to paste into every description** (copy from goosegreen/build/youtube_description.txt): the music credit (Kevin MacLeod, incompetech.com, the four titles, CC BY 4.0 link) and the SFX credit line from `SFX_CREDITS.md`.

## 2. What's finished
| Item | Status | Where (repo path) |
|---|---|---|
| Chipyong-ni 28 s test map | done | chipyongni/ |
| Hannibal script (2,363 words, [MAP]/[ARCHIVE] tags) | done | hannibal/script.md |
| Hannibal narration, Kokoro voice `am_michael`, speed 0.95, 15:52 | done | hannibal/audio/voice.wav + timing.json |
| Map engine (units, arrows, camera, stakes, cards, snow, fog) | done | hannibal/lib/battle.js + .css (newer copy with more helpers: ridgway/lib/) |
| Hook map (march over the Alps) + Move 1 Trebia maps (3:52) | done, rendered | hannibal/scenes/ |
| Test video: hook + Move 1 (6:08) with placeholder cards | done | hannibal/build/ (mp4 not in git; rebuild with tools/assemble.py after rendering scenes) |
| PDF production guide (9 pages) | done | hannibal/build/Hannibal-production-guide.pdf |
| Ridgway style-match test (1:10: maps, photo cut-out, bio card, portrait stake, music, SFX) | done | ridgway/ (mp4 not in git; re-render scene 'test' + tools/mix.py) |
| Hannibal and Scipio portraits (public domain / CC BY-SA) | downloaded, not placed | hannibal/portraits/ (*.src.jpg) |
| Goose Green (video #4) v3: fact-checked script, voice 17:08, 7 map scenes remade in the LOCKED style (section 1b), 13 licensed archive stills, CC BY music, synthesized SFX (boom on impact), stakes-first hook, casualty card | done, assembled 2026-09-27; waiting for owner feedback | goosegreen/ (mp4s not in git; rebuild with `bash tools/render_all.sh --assemble ...`) |
| Competitor + niche analysis, 30 ranked ideas, Gemini brief v2 | done | research/ |

## 3. What's next (in order)
0. **Goose Green:** get the owner's feedback on the preview (hook, SFX levels, pronunciation of Piaggi/Estévez, music level), fix, rebuild, and hand over the 1080p master (629 MB, lives only on the cloud machine: rebuild it with render_all.sh if the session is gone).
1. Collect the owner's feedback on the Ridgway test and the Hannibal test (map look, pacing, voice, music).
2. Hannibal: put portrait cut-outs on the stakes (Hannibal bust, Scipio bust; coins for Sempronius and Mago, where no likeness exists). Re-render Trebia.
3. Build the Trasimene and Cannae maps (2 agents in parallel; Sonnet for simple agents).
4. Fill the ~20 [ARCHIVE] slots with public-domain paintings, busts and coins (list in the PDF guide) using slow zooms.
5. Music: DONE, use the default kit (section 1b, Kevin MacLeod, `make_music_bed.py`) for Hannibal too.
6. Assemble the full 16-min video with voice, music (ducked under the voice), SFX cues, and chapters. Final loudness -14 LUFS.

## 4. Cloud environment setup (now automatic via setup.sh; kept for reference)
- **Network access: Full** (environment menu → gear → Network access). Needed for Wikimedia, archive.org, Hugging Face and ElevenLabs.
- **Setup script** (so every new session has the tools):
```bash
npm install -g hyperframes
apt-get update -qq && apt-get install -y -qq ffmpeg
pip install -q numpy pillow kokoro-onnx soundfile "rembg[cpu]" reportlab fonttools brotli pypdfium2
cd /tmp && npx -y skills add heygen-com/hyperframes -g -a claude-code -s '*' -y --copy
npx -y skills add remotion-dev/skills -g -a claude-code -s '*' -y --copy
hyperframes browser ensure
mkdir -p /opt/kokoro && cd /opt/kokoro && for f in kokoro-v1.0.onnx voices-v1.0.bin; do [ -f $f ] || curl -sSL -o $f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
```
- Permission mode: not "Auto" when installing skills (the auto classifier blocks installs from third-party repos). Use "ask" mode and approve.
- Save work to a GitHub repo as you go. The cloud machine is temporary.

## 5. Pipeline (how a video is made)
1. **Research**: Gemini (see GEMINI_PROMPT.md) or web search. Verify numbers; ancient sources disagree, so give ranges.
2. **Script**: formula in section 1, every paragraph tagged `[MAP: scene-id | notes]` or `[ARCHIVE: description]`. ~2,400-2,700 words.
3. **Voice**: `narrate.py VOICE` (Kokoro, per paragraph) → `audio/voice.wav` + `audio/timing.json` (start/end of every paragraph). Voice: **am_michael**, speed 0.95 (1.05 for faster pacing).
4. **Terrain**: `tools/bake.py NAME LAT LON ZOOM EXAG` → 2880x1620 parchment shaded relief from open AWS Terrarium tiles (sea colored by depth). Zoom 7-8 = region, 12-13 = battlefield. Convert lat/lon to pixels with the formula in bake.py and the NAME.json origin.
5. **Map scenes** (every blast/shot/stamp calls `SFX(kind, t)`; `GG.flash`/`burst`/`shell`/`missile` do it automatically, pass `sfx: false` for silent highlight flashes; kinds: fire, mortar, impact, explosion, missile, mg, whoosh, hit, static, tick): `scenes-src/NAME.js` using the engine; animations timed with `B.at("para-id", "spoken phrase")`. Build: `tools/build_scene.py NAME BASEMAP FIRST_TAG LAST_TAG`. Then `hyperframes lint .`, `hyperframes snapshot . --at ...`, look at every snapshot, fix, and render.
6. **Archive slots**: placeholder cards (assemble.py) until real images/footage replace them.
7. **Assembly** (current: `goosegreen/tools/render_all.sh --assemble` → `assemble_full.py` with SFX + two-pass loudness; older: `tools/assemble.py` (cards + renders + voice) and `ridgway/tools/mix.py` (voice + music ducked with sidechain + SFX + loudnorm -14 LUFS).)
8. **Deliver**: chat file limit is 30 MB, so send a 720p preview; keep the 1080p master for YouTube.

## 6. Lessons learned (avoid repeating these)
- Headless Chrome can't load CDNs during render: GSAP, fonts etc. must be local files. @font-face goes inside the page, not ../ paths.
- Register `window.__timelines["main"]` in the page's inline script (lint requires it).
- No DOM measurement (getPointAtLength etc.) inside timeline callbacks: pre-sample paths at build time.
- The camera must be clamped inside the 2880x1620 map, or black edges appear.
- Always look at snapshots: the first versions always had overlapping labels and units bunched in camps.
- Rendering runs at ~3-5x real time on the cloud machine (a 4 min scene takes ~13 min). A render "failed" status can come from a later command; check the log for "Render complete".
- `assemble_full.py` keeps one video track per resolution (`build/video_only_1080p.mp4` / `_720p.mp4`); before 2026-09-27 the 720p preview overwrote the shared track and an `--audio-only` remix silently turned the master into 720p. Always check the master with ffprobe (1920x1080) before delivering.
- Render from ONE place only (`tools/render_all.sh`). Two things cost 30 min on Goose Green: (1) a render launched from a tool shell is killed (`render_cancelled_parent_exited`) when that shell exits, so it must be detached (setsid + nohup); (2) waiting with `pgrep -f "hyperframes render"` never ended because it matched another loop's command line. Wait on a PID or a done-marker file, never a pgrep pattern.
- Subagents stopped by the usage limit leave their background loops running. Before rendering, check `pgrep -af "hyperframes|while"` and kill leftovers (render_all.sh does this).
- Wikimedia: send a descriptive User-Agent, pause 2-3 s, retry on 429, and download only **standard thumbnail widths** (960/1280/1920) or you get long rate limits.
- Background removal: rembg with isnet-general-use.onnx from GitHub releases works.
- Tactical Genius's first minute (Ridgway video): 3 long map shots (31 s, 15 s, 19 s), a full-length commander photo cut-out with a bio card (big red name), and a portrait stake under a flag. No archive footage until 1:08.
- **Owner feedback (Gavin, binding): archive sections must never be a slideshow.** Use real public-domain FILM for 20th-century subjects (NARA / Signal Corps / OWI / Universal newsreels via archive.org; recipe: `gavin/assets/film/cut_clips.sh` + MANIFEST.md). Change the picture every ~3-5 s. Every photo MOVES (clear push-in or pan, ~15-20 %). Portraits get a 2.5D parallax (rembg cut-out over a blurred plate). Film FILLS 16:9 (crop 4:3, no black bars). A short place/date label goes on new shots. Tool: `gavin/tools/archive_shots.py` (shot lists in archive.json; assemble_full.py uses it). Show a 1-min archive test first.
- **Gavin (#7) lessons:** (1) rename or move old test scenes out of `scenes/` (prefix `test-`): `sfx_cues.py` collects cues from every built scene, and the 1-minute test's explosions were mixed into the real hook until `scenes/biazza` was renamed `scenes/test-biazza`. (2) The two-pass linear loudnorm can stop at about -15 LUFS when the TTS voice is peaky (true peak caps it). Fix used: `volume=+11.8dB,alimiter=limit=0.8:attack=2:release=80` on `build/mix.wav`, then mux with the video-only track, which gives -14.4 LUFS (the approved test clip's level). Always measure the master with ebur128. (3) The Dutch polders are below sea level: bake Holland with `SEA_BELOW=-7.5` (bake.py/make_land.py), and draw the rivers by hand. Rivers and floods are not in the elevation tiles: build water masks from low elevation (gavin `assets/*_water.png`). (4) Shared map helpers now live in `gavin/lib/gg.js` (`const GG = GGK(B)`), not copied into every scene.
- **Owner feedback (Goose Green): never open on a photo.** The first shot of every video is an animated map that hooks at once (units on screen in the first second, movement, a stamp/caption punchline). Archive photos come later.
- A photo of a flat public-domain painting is free to use; a photo of a 3D object (bust, coin) belongs to the photographer, so use CC-licensed ones and credit them. Avoid NC and ND licences.

## 7. Usage (subscription) notes
- This whole first session: ~63M tokens (97% cache re-reads) over two 5-hour windows, and it never hit the limit.
- The main cost driver is **conversation length**: late in the session each step re-read ~480K tokens. A fresh session re-reads ~30-60K.
- Use Sonnet for search/download/sound agents; Opus for script and maps.
- Estimated full video in a fresh session: ~25-45M tokens, which probably fits in one 5-hour window. Split it over two windows to be safe (window 1: script, voice, maps for moves 1-2; window 2: move 3, archive, assembly).
