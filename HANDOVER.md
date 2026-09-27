# HANDOVER v3: faceless military-history channel (Tactical Genius style)

**Owner:** Youness Fakiri · **Updated:** 2026-09-27
**How to use:** start a new Claude Code cloud session on the repo `younessking/battle-maps` (environment with **Full** network access), attach the Gemini research file, and say: *"Read HANDOVER.md. Make the full video from this research."*

## 0. Repo layout (clone path must be /home/user/battle-maps)
| Path | What |
|---|---|
| `setup.sh`, `.claude/settings.json` | automatic tool install at session start (runs in background; wait for `/tmp/battle-maps-setup.done`) |
| `research/` | GEMINI_BRIEF_v2.md (paste into Gemini), NICHE_ANALYSIS.md, VIDEO_IDEAS_v2.md, COMPETITOR_ANALYSIS.md |
| `hannibal/` | video #1: script.md, audio/ (voice.mp3 + timing.json), scenes-src/ (hook-march.js, trebia.js), assets/ (terrain), portraits/, build/ (PDF guide, narration.txt), tools/ |
| `ridgway/` | 1-min style-match test. **Newest engine** in `ridgway/lib/` (portrait stakes, bio card, front lines, image layers, region overlays), `tools/mix.py` (voice + ducked music + SFX), `tools/make_masks.py`, assets/media/ (Ridgway photos, flag, synthesized music/SFX) |
| `goosegreen/` | video #4 (Goose Green, 1982), **newest full pipeline: copy new videos from here**. lib/ (engine + `SFX()` sound cues), tools/ (`narrate.py`, `narrate_changed.py`, `bake.py`, `build_scene.py`, `render_all.sh`, `assemble_full.py`, `sfx_cues.py`, `sfx_mix.py`), assets/media/ (images + CREDITS.md, Kevin MacLeod music sources, `sfx/` synthesized sound library), archive.json |
| `chipyongni/` | first test map (hyperframes.json is reused by build_scene.py) |
| `tts/narrate.py` | Kokoro narration (model files downloaded by setup.sh) |
Renders, .wav files and terrain tile caches are not in git: re-render/re-bake as needed.

## 0b. Starting a NEW video from Gemini research
1. `mkdir <name>` and copy the skeleton from `goosegreen/`: `lib/ tools/ vendor/ assets/fonts assets/grain.png assets/media/sfx/` (goosegreen has the newest engine, tools and sound library). Edit SCENES/CHAPTERS in `tools/assemble_full.py`.
2. Write `<name>/script.md` from the research (formula + **hook formula** in section 1; tags `[MAP: id | notes]` / `[ARCHIVE: notes]`), ~2,400-2,700 words.
3. Voice: point SCRIPT/OUT in `tools/narrate.py` at the new folder, run it from `/home/user/battle-maps/tts` → `audio/voice.wav` + `timing.json`. After editing a few paragraphs, run `tools/narrate_changed.py` instead: it re-voices only changed paragraphs and reuses the rest (minutes instead of ~15 min).
4. Bake terrain per battle (`tools/bake.py`), write map scenes (agents in parallel, but agents only write + snapshot; they don't render), fill archive slots (`archive.json`), then render ALL scenes + assemble with ONE command: `bash tools/render_all.sh --assemble "SCENE BASEMAP FIRST LAST" ...` (detached, sequential; wait for `logs/render_all.done`). `assemble_full.py` collects the sound cues from every scene (`sfx_cues.py`), renders the SFX track (`sfx_mix.py`), mixes voice + ducked music + ducked SFX, and normalizes to -14 LUFS in two passes. Music: put the bed at `assets/media/music.wav` (see goosegreen CREDITS.md for how it was built). Commit + push after each milestone.
5. Preview for chat (30 MB limit): two 540p halves, e.g. `ffmpeg -ss 0 -t 515 -i build/<name>.mp4 -vf scale=960:540 -c:v libx264 -preset slow -b:v 360k -maxrate 600k -bufsize 1200k -c:a aac -b:a 64k part1.mp4` (and `-ss 514` for part 2).
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
| Goose Green (video #4): fact-checked script, voice 17:08, 7 map scenes, 14 licensed archive stills, CC BY music, synthesized SFX on every blast, stakes-first hook | done, assembled; waiting for owner feedback | goosegreen/ (mp4s not in git; rebuild with `bash tools/render_all.sh --assemble ...`) |
| Competitor + niche analysis, 30 ranked ideas, Gemini brief v2 | done | research/ |

## 3. What's next (in order)
0. **Goose Green:** get the owner's feedback on the preview (hook, SFX levels, pronunciation of Piaggi/Estévez, music level), fix, rebuild, and hand over the 1080p master (629 MB, lives only on the cloud machine: rebuild it with render_all.sh if the session is gone).
1. Collect the owner's feedback on the Ridgway test and the Hannibal test (map look, pacing, voice, music).
2. Hannibal: put portrait cut-outs on the stakes (Hannibal bust, Scipio bust; coins for Sempronius and Mago, where no likeness exists). Re-render Trebia.
3. Build the Trasimene and Cannae maps (2 agents in parallel; Sonnet for simple agents).
4. Fill the ~20 [ARCHIVE] slots with public-domain paintings, busts and coins (list in the PDF guide) using slow zooms.
5. Music: synthesized music is weak. Prefer a properly licensed track (YouTube Audio Library or Epidemic Sound, added by the owner in the edit) or a clearly CC BY / CC0 track.
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
- Render from ONE place only (`tools/render_all.sh`). Two things cost 30 min on Goose Green: (1) a render launched from a tool shell is killed (`render_cancelled_parent_exited`) when that shell exits, so it must be detached (setsid + nohup); (2) waiting with `pgrep -f "hyperframes render"` never ended because it matched another loop's command line. Wait on a PID or a done-marker file, never a pgrep pattern.
- Subagents stopped by the usage limit leave their background loops running. Before rendering, check `pgrep -af "hyperframes|while"` and kill leftovers (render_all.sh does this).
- Wikimedia: send a descriptive User-Agent, pause 2-3 s, retry on 429, and download only **standard thumbnail widths** (960/1280/1920) or you get long rate limits.
- Background removal: rembg with isnet-general-use.onnx from GitHub releases works.
- Tactical Genius's first minute (Ridgway video): 3 long map shots (31 s, 15 s, 19 s), a full-length commander photo cut-out with a bio card (big red name), and a portrait stake under a flag. No archive footage until 1:08.
- **Owner feedback (Goose Green): never open on a photo.** The first shot of every video is an animated map that hooks at once (units on screen in the first second, movement, a stamp/caption punchline). Archive photos come later.
- A photo of a flat public-domain painting is free to use; a photo of a 3D object (bust, coin) belongs to the photographer, so use CC-licensed ones and credit them. Avoid NC and ND licences.

## 7. Usage (subscription) notes
- This whole first session: ~63M tokens (97% cache re-reads) over two 5-hour windows, and it never hit the limit.
- The main cost driver is **conversation length**: late in the session each step re-read ~480K tokens. A fresh session re-reads ~30-60K.
- Use Sonnet for search/download/sound agents; Opus for script and maps.
- Estimated full video in a fresh session: ~25-45M tokens, which probably fits in one 5-hour window. Split it over two windows to be safe (window 1: script, voice, maps for moves 1-2; window 2: move 3, archive, assembly).
