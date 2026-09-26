# HANDOVER v2: faceless military-history channel (Tactical Genius style)

**Owner:** Youness Fakiri · **Updated:** 2026-09-25
**How to use:** start a new Claude Code cloud session on the repo `younessking/battle-maps` (environment with **Full** network access), attach the Gemini research file, and say: *"Read HANDOVER.md. Make the full video from this research."*

## 0. Repo layout (clone path must be /home/user/battle-maps)
| Path | What |
|---|---|
| `setup.sh`, `.claude/settings.json` | automatic tool install at session start (runs in background; wait for `/tmp/battle-maps-setup.done`) |
| `research/` | GEMINI_BRIEF_v3.md (paste into Gemini), NICHE_ANALYSIS.md, VIDEO_IDEAS_v2.md, COMPETITOR_ANALYSIS.md |
| `hannibal/` | video #1: script.md, audio/ (voice.mp3 + timing.json), scenes-src/ (hook-march.js, trebia.js), assets/ (terrain), portraits/, build/ (PDF guide, narration.txt), tools/ |
| `ridgway/` | 1-min style-match test. **Newest engine** in `ridgway/lib/` (portrait stakes, bio card, front lines, image layers, region overlays), `tools/mix.py` (voice + ducked music + SFX), `tools/make_masks.py`, assets/media/ (Ridgway photos, flag, synthesized music/SFX) |
| `chipyongni/` | first test map (hyperframes.json is reused by build_scene.py) |
| `tts/narrate.py` | Kokoro narration (model files downloaded by setup.sh) |
Renders, .wav files and terrain tile caches are not in git: re-render/re-bake as needed.

## 0b. Starting a NEW video from Gemini research
1. `mkdir <name>` and copy the skeleton from **`morgan/`** (newest): `lib/ tools/ vendor/ assets/fonts assets/grain.png assets/audio/` (the music library + SFX are reusable; add the CC BY lines from assets/audio/CREDITS.md to the description). In tools/narrate.py point SCRIPT/OUT at the new folder and extend the SAY pronunciation dict; in tools/assemble.py set the SCENES dict.
2. Write `<name>/script.md` from the research (formula below; tags `[MAP: id | notes]` / `[ARCHIVE: notes]`), ~2,600-2,800 words (≈18 min at speed 1.0). Scenes = contiguous runs of MAP paragraphs; write `<name>/SCENES.md` (see morgan/SCENES.md).
3. Voice: `cd tts && python3 ../<name>/tools/narrate.py am_michael` (per-sentence timing). Bake terrain: `tools/bake.py` (region z7-8, battlefield z15-16).
4. **Image agent first (Sonnet)**, so portraits exist before maps start: archive/aNN.jpg + slots.json + assets/media cut-outs + flags.
5. **Map agents** with the brief in `templates/MAP_AGENT_BRIEF.md` (fill in <GENERAL>, <name> and each agent's scene list). Model choice to save usage: **Sonnet for simple regional/overview scenes** (hook, campaign maps, ending), **Opus only for the main battlefield scenes**. Run at most 3 agents at once. The brief limits snapshot reviews (one contact sheet per round, max 3 rounds), which was the biggest usage cost in the Morgan run.
6. `python3 tools/assemble.py && python3 tools/mix.py` → build/<name>-1080p.mp4 (edit the MUSIC plan and SFX cues in mix.py). Write <name>/YOUTUBE.md. Commit + push after each milestone.
To stay inside one 5-hour usage window, split big videos over two sessions: (1) script, voice, terrain, images, maps for hook + move 1; (2) moves 2-3, ending, assembly, mix.
Use a fresh session for each video: it uses 5-10x less of your plan's usage than one long conversation.

---

## 1. The plan (unchanged)
- Niche: famous generals' top 3 tactical moves, modelled on **Tactical Genius** (@tacticalgeniuss). Copy the *structure*, not the look or words.
- Format: 16-19 min, ~80% animated battle maps, ~20% archival (film for the 20th century; paintings, busts and coins for ancient generals), calm documentary voice.
- Script formula: hook (disaster, then the hero, then "his three greatest tactical moves") → 3 moves (situation with numbers → what the enemy believed → "X saw something different" → execution → result as a number) → the general's 3-part method repeated after every move → subscribe ask between moves 1 and 2 → ending (callback, legacy, "which commander next?").
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
| Competitor + niche analysis, 30 ranked ideas, Gemini brief v2 | done | research/ |
| **Daniel Morgan full video (18:21)**: script, voice, 11 map scenes, 11 archive slots, licensed music + SFX, mix at -14 LUFS | done | morgan/ (master build/morgan-1080p.mp4 is not in git; rebuild: `python3 tools/assemble.py && python3 tools/mix.py`, after re-rendering scenes). Upload text: morgan/YOUTUBE.md |

## 3. What's next (in order)
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
5. **Map scenes**: `scenes-src/NAME.js` using the engine; animations timed with `B.at("para-id", "spoken phrase")`. Build: `tools/build_scene.py NAME BASEMAP FIRST_TAG LAST_TAG`. Then `hyperframes lint .`, `hyperframes snapshot . --at ...`, look at every snapshot, fix, and render.
6. **Archive slots**: placeholder cards (assemble.py) until real images/footage replace them.
7. **Assembly**: `tools/assemble.py` (cards + renders + voice) and `ridgway/tools/mix.py` (voice + music ducked with sidechain + SFX + loudnorm -14 LUFS).
8. **Deliver**: chat file limit is 30 MB, so send a 720p preview; keep the 1080p master for YouTube.

## 6. Lessons learned (avoid repeating these)
- Headless Chrome can't load CDNs during render: GSAP, fonts etc. must be local files. @font-face goes inside the page, not ../ paths.
- Register `window.__timelines["main"]` in the page's inline script (lint requires it).
- No DOM measurement (getPointAtLength etc.) inside timeline callbacks: pre-sample paths at build time.
- The camera must be clamped inside the 2880x1620 map, or black edges appear.
- Always look at snapshots: the first versions always had overlapping labels and units bunched in camps.
- Rendering runs at ~3-5x real time on the cloud machine (a 4 min scene takes ~13 min). A render "failed" status can come from a later command; check the log for "Render complete".
- Wikimedia: send a descriptive User-Agent, pause 2-3 s, retry on 429, and download only **standard thumbnail widths** (960/1280/1920) or you get long rate limits.
- Background removal: rembg with isnet-general-use.onnx from GitHub releases works.
- Tactical Genius's first minute (Ridgway video): 3 long map shots (31 s, 15 s, 19 s), a full-length commander photo cut-out with a bio card (big red name), and a portrait stake under a flag. No archive footage until 1:08.
- A photo of a flat public-domain painting is free to use; a photo of a 3D object (bust, coin) belongs to the photographer, so use CC-licensed ones and credit them. Avoid NC and ND licences.

- (Morgan) `morgan/` is now the newest skeleton: narrate.py records **per-sentence timing** (B.at is sentence-accurate), pronunciation fixes via the SAY dict, bake.py supports zoom 16 (upsampled z15) and no fake snow on low hills, assemble.py handles archive Ken Burns + captions and any scene order (SCENES dict), mix.py = music plan + SFX cues keyed to spoken phrases.
- (Morgan) Scenes must be contiguous runs of MAP paragraphs (no ARCHIVE inside), otherwise render time is wasted.
- (Morgan) 5 agents in parallel (4 Opus map agents + Sonnet) hit the 5-hour session limit mid-way; they resume cleanly with SendMessage after the reset. Overpass (OSM geometry) fails through the proxy; Nominatim and Natural Earth work.
- (Morgan) Archive Ken Burns via zoompan at 4K is slow (~20 min for the full assembly on 4 cores).

## 8. Faster and cheaper without losing quality (lessons from the Morgan video)
Morgan took ~2 h of real work (plus 2 h 15 min stuck on the usage limit). With the items below, a video should take ~1.5-2 h.
**Already built in (templates/MAP_AGENT_BRIEF.md, morgan/tools):**
1. Visual review via ONE contact sheet per round (tile all snapshots into one image), max 3 rounds per scene. Opening snapshots one by one was the biggest usage cost.
2. Right model for the job: Sonnet for simple regional/overview scenes, Opus only for the main battlefield scenes. Max 3 agents at once.
3. Image agent BEFORE map agents, so portraits exist at build time (no waiting, no rebuild + re-render).
4. Per-sentence narration timing (narrate.py) so B.at() lands on the right word: fewer fix-and-re-render rounds and better sync.
5. Scenes = contiguous runs of MAP paragraphs, so no render time is wasted behind archive slots.
6. Reuse: bake.py, assemble.py, mix.py, the music library (licences already checked) and SFX, the SAY pronunciation dict.
7. Check pronunciation without listening: `k.tokenizer.phonemize(word, "en-us")` in Kokoro; respell in SAY before recording.
8. No 720p preview; archive zooms at 1.5x internal resolution (~10 min instead of 21); deliver the master through a file host (gofile.io: `curl -F "file=@X.mp4" https://upload.gofile.io/uploadfile`, then check the md5 in the reply) because the chat limit is 30 MB. The link is public to anyone who has it; gofile deletes files after a period without downloads.
9. Network: Overpass (OSM geometry) fails through the proxy; Nominatim (places) and Natural Earth 10m (rivers, lakes) work.
**Still to do (not built yet):**
10. Promote the helpers the agents wrote locally (volley/muzzle-flash line, range ring, officer target + cross-out, glowing numbered marker, encirclement ring, stat rows timed to speech, water overlays) from morgan/scenes-src/*.js into lib/battle.js, so agents stop re-writing them and every video looks consistent.
11. A render queue (one `hyperframes render` at a time). 4 parallel renders on 4 cores were no faster overall and one crashed ("FFmpeg cannot start") and had to be re-run.
**Owner feedback on the Morgan video (fixed in morgan/tools, keep for every video):**
14. Music was too loud: the bed was normalised to -21 LUFS, as loud as the Kokoro voice (~-24 LUFS). mix.py now sets `MUSIC_LUFS = -41` (~17 dB under the narration; -37 was still judged a bit loud) plus a gentle sidechain duck, and `SFX_DB = -3` trims all sound effects a notch. Never set the music bed within 15 dB of the voice.
15. Archive images stayed on screen too long without change (one still with a slow 13 % zoom for 10-25 s). assemble.py now cuts every archive slot into ~6 s shots (full view → push-in on the main point → other images / details, stronger moves, 0.4 s dissolves). Each slot needs 2-3 images, and slots.json lists points of interest per image (`{"slot", "images": [{"file", "title", "points": [[fx, fy], ...]}]}`) — ask the image agent for this from the start. Rebuild only the archive slots with `python3 tools/assemble.py --archive`.

**Research accuracy:**
12. Use research/GEMINI_BRIEF_v3.md: it makes Gemini cite a source for every claim, label claims VERIFIED / SINGLE SOURCE / TRADITION / DISPUTED, and end with a fact-check list. The v2 Morgan research had errors I had to fix: Guilford called a "strategic victory" (it was a British tactical win), the Cowpens Continental withdrawal described as planned (it was a misunderstood order), the "devil of a whipping" letter given the wrong recipient, an unsourced "still taught at West Point", and a Morgan quote to Greene paraphrased inside quotation marks.
**Sessions:**
13. One fresh session per video. Each step in a long conversation costs more than the last.

## 7. Usage (subscription) notes
- This whole first session: ~63M tokens (97% cache re-reads) over two 5-hour windows, and it never hit the limit.
- The main cost driver is **conversation length**: late in the session each step re-read ~480K tokens. A fresh session re-reads ~30-60K.
- Use Sonnet for search/download/sound agents; Opus for script and maps.
- Estimated full video in a fresh session: ~25-45M tokens, which probably fits in one 5-hour window. Split it over two windows to be safe (window 1: script, voice, maps for moves 1-2; window 2: move 3, archive, assembly).
