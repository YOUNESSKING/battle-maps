# Smith video: continue here (fresh session)

Branch: `claude/lucid-tesla-qugecc`. Project folder: `smith/` (video #6, Maj. Gen. O.P. Smith: Inchon, Hagaru-ri, Chosin breakout).
**Read first, fully:** `HANDOVER.md` (v3) and `STYLE_LOCK.md`. Everything there is locked; don't invent looks, sounds or music.

## State (2026-09-29)
- Script `smith/script.md` (2,534 words), voice `smith/audio/voice.wav` + `timing.json` (16:21, am_michael 0.95; `tools/narrate.py`).
- 14 map scenes rendered in the OLD (ridgway-engine) look: `smith/scenes-src/*.js`, table of scenes/basemaps/tags in `smith/MAPS_BRIEF.md`.
  The hook is split in three: `hook-in` (korea, 0-7.0 s), `hook` (chosin, 6.4-55.5), `hook-out` (korea, 54.9-80.24), dissolves in `tools/assemble_full.py`.
- Archive: 9 ARCHIVE slots filled with PD photos (`assets/media/`, `CREDITS.md`) and 1950 film clips (`assets/film/`, `MANIFEST.md`, clips re-cut with `cut_clips.sh`).
- Audio redone with the LOCKED kit (goosegreen SFX library + levels, SFX() cues in the scenes, 4 MacLeod tracks via `make_music_bed.py`, MUSIC_VOL 0.18, -14 LUFS).
- `smith/YOUTUBE.md`: description, chapters, sources, credits.

## Owner feedback so far (all must stay fixed)
- Hook: open on the whole peninsula (red North/China, blue South), zoom into the battle, zoom back out after. (done in hook-in/hook-out; keep)
- Music too loud; sounds too loud; invented/out-of-place sounds (a loud sound on stationary Navy ships). -> locked kit only, sound only on visible beats.
- "When you say the Navy aircraft pounded it, SHOW the aircraft bombing it." Show every action the narration names.
- Wants the front lines (locked `K.front` look).
- Any render needs owner approval first -> snapshot sheets first (HANDOVER 0b step 5).

## New owner rule (2026-09-29, after the audio redo)
- **Sound library scope (owner, 2026-09-29):** keep using the locked SFX library in the right places, i.e. ONLY for the map events it was made for and only where its sound matches what is on screen (artillery/mortar impacts, bombs/explosions, gun launches, aircraft flybys, MG, whoosh/hit/tick/static on stamps, cards and camera moves). Don't force it onto anything else, and don't reuse the same few clips everywhere: it gets repetitive. For events the library doesn't cover (ships, trucks/columns, bugles/whistles, wind/blizzard, crowds, parachutes, bridges, trains, horses, etc.), source a fitting, correctly licensed sound (CC0/PD/CC BY, no NC/ND) for that specific moment, keep it at the library's levels (never louder than the voice), and add variants so repeated events don't sound identical. Test new sounds first (1-min clip, owner approval) per 0b step 5.
Apply it in this remake: e.g. ships firing/moving, the C-119 parachute drop, the breakout column of trucks, Chinese bugles, blizzard wind need their own fitting sounds (tested first), and the library clips should not repeat identically.

## DONE 2026-09-30 01:45 UTC: final video rendered + delivered
- Owner approved all sheets + sounds. Master: build/smith-full.mp4 = build/OP-Smith-Top3-1080p.mp4 (1920x1080, 30 fps, 16:09, -15.0 LUFS, 1.63 GB),
  uploaded to Gofile: https://gofile.io/d/3TLHn2QD (md5 84d5c245054ceeb48492966e53400981). 540p halves sent in chat.
- Publishing PDF: build/OP-Smith-publishing-guide.pdf (with the link). Renders/master are not in git (re-render with tools/render_all.sh).
- Lesson: the cloud machine rebooted 4 times during the render (every ~30-60 min, also while active); finished renders survive,
  the running step dies. Keep steps short and resumable; relaunch only the missing scenes.

## Progress 2026-09-29 (remake session)
- Done + pushed: locked fx.js in smith/lib (us/kpa/prc flags, Corsair `prop` + C-119 `cargo` art), land masks (`tools/make_land.py`),
  stakes-first hook + subscribe ask moved to inchon-9 (5 paragraphs re-voiced, 16:09, music bed rebuilt), all 16 map scenes remade
  (plan: SCENE_PLAN.md), hook hand-offs 9.8 / 56.2 s in assemble_full.py, description (build/youtube_description.txt), thumbnails A/B.
- Sent to the owner for approval: build/sheet_hook.png, sheet_move1.png, sheet_move2.png, sheet_move3.png, and the sound test
  build/sound_test_new_listen.mp3 (+ .txt cue list). NOTHING RENDERED YET.
- New sounds: assets/media/sfx/new/ (FLAC in git, credits CREDITS_NEW.md; 3 CC BY lines to add to the description once approved).
  Mixed only after approval: write the approved kind names (+ `vary`) into assets/media/sfx/new/APPROVED.txt.
- After approval: 1-min in-context clip (`SFX_TEST=1 python3 tools/make_clip.py ...`) -> owner OK -> copy render_all.sh from goosegreen,
  `bash tools/render_all.sh --assemble ...` (hook build commands are at the top of each hook scene file) -> ffprobe (1920x1080, -14 LUFS)
  -> two 540p halves -> publishing PDF (make_publish_guide.py) -> Gofile upload.
- To verify before publishing: Chosin casualty figures (Montross & Canzona vol. III, from memory), Almond helicopter + "12 divisions"
  (from memory), 27 Nov 1950 front positions (approximate).

## APPROVED work for this session (owner approved 1-6 on 2026-09-29)
Remake the map scenes in the LOCKED visual style (copy `goosegreen/lib/fx.js`, `const K = FXK(B)`; reference scenes goosegreen/scenes-src/move3.js, test-terr-f.js, move1.js):
1. **Inchon shown, not told:** destroyer/cruiser silhouettes firing (ship + `K.gun`) with `K.impact`s on Wolmi-do; Corsairs (`K.aircraft` kind turboprop/prop art) flying real bombing runs exactly like the Harrier strike (size 84, alt 30, dur 3.2, bombs = K.impact r 20 at t0+1.55+k*0.25); same for "Navy and Marine aircraft had pounded it" and every other named air/naval action (breakout-3 fighter-bombers on the ridges, C-47s landing at Hagaru-ri, C-119s dropping the bridge spans with parachutes).
2. **Front lines + territory (locked "E" look):** Pusan perimeter (inchon-1), Inchon beachhead (inchon-7/8), Hagaru-ri perimeter (hagaru-5..8), Yudam-ni/Hagaru-ri/Koto-ri pockets (hook, breakout), the moving breakout column. Land masks per basemap (elev > 0.5, like goosegreen/assets/isthmus_land.png). Night palette for the night attacks (hook-1/2, hagaru-6/7).
3. **Locked counters** (flag badge us/kpa/prc + size marks: 1st Marine Div = XX, regiments III, battalions II), **artillery** that fires with impacts (Hagaru-ri defence, Chinese mortars), **commander badges** (`K.badge`: Smith, Almond, Song Shilun, MacArthur, Ridgway), **casualty card** after each move (Inchon landing day ~20 KIA / ~175 WIA; Chosin: ~1,000 KIA, thousands wounded + frostbite vs Chinese tens of thousands), grid, target rings, smoke on burning places.
4. **Hook formula (HANDOVER 1):** stakes-first first line, e.g. "Fifteen thousand Marines. A hundred and twenty thousand Chinese. Thirty degrees below zero." + odds card (15,000 VS 120,000), flash-forward with counter, stamp punchline; keep the peninsula zoom-in/zoom-out. Re-voice only changed paragraphs with `tools/narrate_changed.py` (copy from goosegreen).
5. **Subscribe ask between Move 1 and Move 2** (move it from the end of hagaru-9 to the end of inchon-9; re-voice those two paragraphs).
6. **Rest of the no-skip checklist:** thumbnail (HANDOVER 1b formula, vidIQ, 2 variants, generic officer if no legal likeness), publishing PDF (`make_publish_guide.py`), description from `goosegreen/build/youtube_description.txt` layout, Gofile upload of the 1080p master.

Process: agents write scenes + snapshot sheets only (no rendering) -> send the owner ONE labelled snapshot sheet per move for approval -> after approval `bash tools/render_all.sh --assemble ...` (copy from goosegreen, detached) -> check master with ffprobe (1920x1080, -14 LUFS) -> two 540p halves for chat. Commit + push after every milestone.
