# START HERE: Battle 19, Vicksburg 1863, the first 3D campaign film (owner 2026-11-17)

You are the session "Battle 19 Vicksburg". Read this whole file before doing anything, then CLAUDE.md, HANDOVER.md and research/DATA_RULES.md for the general pipeline (voice, sound, git, lessons). Where this file conflicts with older rules, THIS FILE WINS: the owner pivoted the channel to a new 3D look.

## 0. The owner's decisions (all binding)
1. **Pivot:** from now on new videos are cinematic **3D campaign films in the style of the YouTube channel Grand Maneuver (GM)**, not "<Name>'s Top 3 Legendary Tactical Moves" 2D videos. Evidence: research/study/7_channel_lifecycle.md (the Top-3 format collapsed ~18x Sep→Nov under copycats), 8_grand_maneuver_pivot.md (no 3D channel covers the Civil War/Revolution; GM's worst video 9.4k, best 109k), 9_critic_strategy.md, 5_next_pick_2026-11-17.md + 6_critic.
2. **Topic order:** (1) **Vicksburg 1863 (this video)**, (2) Trenton–Princeton 1776-77 (publish 19-22 Dec for the anniversary), (3) Saratoga 1777. Reserve: Greene's Race to the Dan, Jackson's Valley.
3. **Research: do it YOURSELF this time** (no Gemini brief; the owner is asleep). Use web research + the existing Grant research (grant/research/FACT_NOTES.md, FACTCHECK_B_vicksburg.md, PRONUNCIATION.md), and run fact-check agents (lesson: every past dossier had errors).
4. **The owner pre-approved everything from now on** ("I approve everything from now"): script, look, render, packaging. Do NOT wait for his answers; make sensible decisions, log them in `vicksburg/OWNER_DECISIONS.md`, and keep working until the film is finished, assembled, packaged and on main.
5. **Quality gate (owner rule):** nothing is presented as finished before **two critics** have reviewed it frame by frame and sector by sector against GM. Structure: worker agents in parallel, ONE critic per area per round, max 3 agents at once.
6. **Look = the approved 3D test "v8"** (research/style_tests/gm3d/clip/, read its README.md top to bottom): the v6 cloud dive (owner: "keep the clouds of v6, not v7"), GM overlays (watch plaque/clock, wax-seal timeline, THE ARMIES legend, medallions, oval painting insets, letter/quote cards, 3D gold title, ledger), v7 terrain style (warm field patchwork, teal woods, rust roads, towns in rows, haze), battle FX (grey smoke curtains per battalion, flickering fire, cannon flash + plume), the grade matched to GM numbers, **troops = our Style W unit boxes in-scene** (the default `boxes`; the 3D blocks option exists but the owner never picked it), **generals = portrait banners on poles** (banner.js, Grant blue + US pennant, Pemberton red + Stars and Bars), Confederates captured in place / retreating in road columns (never vanishing).
   - Title rule the owner gave: the 3D title must land ON its spoken words (measure word times from the audio).
   - Owner liked v6/v8 ("perfect, a little adjustments"). Reference renders: `gm3d_clip_v8_share.mp4` (git), `gm3d_clip_v6_share.mp4`.
7. Reference study of GM's style (narration + visuals): research/competitors_top20/grand_maneuver/GM_STUDY.md + gm_criticA.md + gm_criticB.md (~140 wpm, short punch lines, mid-sentence sources, hedged numbers, time/place openers, dissolves not hard cuts, title-case town names).

## 1. The film
- **Working title:** "The Campaign That Split the Confederacy: 5 Battles in 18 Days | Vicksburg 1863" (do NOT use "Grant's Masterpiece": Warhawk used it). Make 3 title options (GM-style number+time promise; curiosity; hybrid) and 2-3 thumbnails per PACKAGING_GUIDE; pick the main ones yourself (owner pre-approved).
- **Length:** ~18-20 min (GM's breakout was 20:38).
- **Story:** the inland campaign 29 Apr – 4 Jul 1863: running the batteries (16 Apr night), the crossing at Bruinsburg, Port Gibson (1 May), Raymond (12 May), Jackson (14 May), Champion Hill (16 May), Big Black River Bridge (17 May), the assaults (19 + 22 May), the siege, surrender 4 Jul. GM narration style, campaign told as one story with a clock ("5 battles in 18 days"), the enemy plan, the twist (cut loose from his supply line), one set-up paid off later, cliffhangers between phases.
- **Opening rule:** open on an animated 3D map with the stakes (what was about to be won/lost) and a cloud dive within ~6-10 s; nothing on screen before it is said; no hero name before the name moment.
- **Narration:** Kokoro am_michael + voice A conversion (tts/convert_voice.py; HANDOVER line on voice A; `tts/voices/owner_ref.wav` may be missing → use `tts/voices/test_A_chatterbox.mp3` as reference, as Patton did). CLAUDE.md: voice A is the default.
- **Sound:** our locked sound kit (tools/sfx_mix_lib.py; gm3d clip assemble.py shows the 3D mix) + a quiet orchestral bed; every visible gun/volley/fire has its sound, nothing unseen.

## 2. Production plan
1. Research + FACT_NOTES (vicksburg/research/), fact-check agents.
2. Script (vicksburg/script.md, every paragraph tagged with its shot), voice, timing.json, word times.
3. **One-time engineering:** generalise the 3D world from the Big Black-only test (`bake_clip.py`, `world.js`) to any battlefield: DEM per area (the Grant video has `grant/assets/src/vicksburg_hd_elev.npy`; get other DEMs as the Grant/Marion tools did), rivers, roads, towns, period landscape; one wide campaign world (Mississippi from Milliken's Bend to Jackson) + close worlds per battle. Keep the v8 look.
4. Scenes: one HyperFrames scene per sequence driven by one timeline (as gm3d/clip/index.html); agents in parallel with a shared brief + LESSONS section; critics per round.
5. **Render on RunPod** (research/runpod/README.md: the tested recipe; RTX A5000 ~10x faster than here: 66 s clip in 6.6 min; 20-min film ≈ 2 h ≈ $0.55). Env var RUNPOD_API_KEY is set: NEVER print/log/commit it. Balance ~$2.77: budget ≤ $2.00 for this film (≈3 full renders); if you need more, render only changed chunks. ALWAYS terminate pods; after EVERY deploy call list pods (a failed deploy once created 7 pods). Check `myself { pods { id } }` is empty at the end of every render.
6. Assemble (sound, -14 LUFS), contact sheets, two critics, fixes, final render, packaging (titles, thumbnails, description without links, tags, chapters), PDF guide like Marion's, upload the master to Gofile (the owner downloads from there; no other external upload).

## 3. Hard rules and lessons
- Everything lands on main: work on your branch, PR + merge at every milestone and at the end (merge main into the branch first if behind).
- **Never commit Grand Maneuver frames or videos** (reference frames live only in /home/user/gm_ref/ on the old machine; you may need to re-download GM videos for study: the owner's Gofile link for "Napoleon's Last Masterpiece" was https://gofile.io/d/0clSF4KK, download only via a normal Playwright page load; GM study files in research/competitors_top20/grand_maneuver/ are fine). Comparison sheets with GM frames are git-ignored.
- **Never bypass YouTube's bot check** (no cookies, no stealth); use vidIQ MCP tools or web search instead.
- Never print secrets. Never `pkill -f` a pattern that matches your own shell. Never write into hard-linked assets.
- The cloud container PAUSES when idle: keep a Monitor/until-loop on long jobs (re-arm), don't trust `setsid nohup`.
- Disk is a fixed allowance (~2 GB free on the old machine): delete chunk files and big intermediates after assembly; mp4s are git-ignored except small share copies (force-add the final share copy, ≤ ~25 MB).
- Ask before deleting anything the owner made.
- Owner also wants published meanwhile (his to do in Studio, just remind in the final report): Sherman, Jackson, Meade (finished, older look); fix 3 live titles missing a space ("TheSwamp", "Confederacy'sWestern", "theSouth"); rotate the RunPod API key (it was pasted in chat; update the environment's saved key, never in chat).

## 4. Deliverables (final report to the owner, plain language)
Gofile link to the master + 720p preview + PDF guide + thumbnails; title options; the two critics' final scores; RunPod spend; what's next (Trenton–Princeton brief started).
