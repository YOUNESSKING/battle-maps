# Start prompt for "battle 15" (paste into a new session on main)
Make video #15: "George S. Patton's Top 3 Legendary Tactical Moves | <true result>".
- Repo: /home/user/battle-maps. Branch: the session's assigned branch, started from main. Folder: patton/.
- **LENGTH: 17:00 (owner 2026-10-31).** Script 2,750-2,800 spoken words (`tools/count_words.py`). Calibration: Cleburne's 2,406 words = 14:52 with am_michael speed 1.0 (~167 wpm incl. pauses). Budget: hook ~1:00, background ~0:40, each move ~4:50, ending ~0:45 (end-screen room in the last 20 s).
- RESEARCH: the owner attaches Gemini's Patton file in this session. Save it as research/GEMINI_PATTON.md. The prompt Gemini got: research/GEMINI_PATTON_PROMPT.md (moves: 1 Third Army breakout and wheel Avranches-Le Mans Aug 1944, 2 Bastogne relief Dec 1944, 3 Rhine crossing at Oppenheim Mar 1945; Gemini also ranks Sicily and Moselle/Metz as alternatives: if it recommends other moves, put that choice to the owner in the flags sheet).
- Uploads are PAUSED by the owner until this video is made and tested (research/OWNER_DIALOGUE_2026-10-31.md).

READ FIRST, in this order:
1. CLAUDE.md
2. HANDOVER.md: the whole file, especially 0a (everything lands on main via PR + merge), 6 (lessons incl. Cleburne #14), 10 (analytics + the new "Reach study 2026-10-31" block).
3. STYLE_LOCK.md: the whole file (section 0b approved changes, 1a hook, 1b engagement, 2/2a look).
4. research/OWNER_DIALOGUE_2026-10-29.md and research/OWNER_DIALOGUE_2026-10-31.md.
5. research/CHANNEL_LOG.md (our own Studio numbers: what separates hits from flops) and research/study/4_meta.md (the final commander list; Patton is row 1 with its risk flags and title/banner options), plus 3_critic.md.
6. The locked reference: rokossovsky/ and reference/style-reference-rokossovsky-v8.mp4. The newest skeleton: cleburne/ (copy lib/ tools/ vendor/ assets/fonts, grain.png, assets/media/sfx and music; it has the names tool, names_clip.py, bake_E.py, make_thumb_labels.py, make_publish_guide.py, finalize loudness recipe). WWII Europe examples: collins/ and gavin/ (maps, period flags `us_flag_48star.png` + `ger_reich_flag.png`, STYLE_LOCK 2: Allies blue / Axis red, Reich flag is the owner's WWII choice).

WHAT OUR OWN DATA SAYS (so we do not repeat the mistakes; details in CHANNEL_LOG.md):
- Click-through (3.8-4.7%) is the same on every video. What differs is impressions (2.4k to 703k), and 81-95% of views come from YouTube Home.
- Every video that held or grew had >= ~64% retention at 0:30; Gavin (number-first opening) had 51.6% and was cut on day 2. 0:30 retention looks NECESSARY, not sufficient (Smith and Thomas had it and no reach).
- THEREFORE: line 1 is the STAKES of the story (never numbers, a date or a list), the title's promise is spoken by 10-15 s, the 0:30 moment lands on ACTION or the payoff (never biography), and the background block is short and comes late (2 Para lost ~35 points in the 20 s after its hook). Open on the Bulge / Bastogne even though it is move 2 in time order.
- Patton labels: Tactical Genius "Patton's Top 3 Legendary Tactical Moves" 953,823 (10.9x); Warfare Genius 131,951 (3.8x); Footprints in History has not done him yet. Banners that fit our data: stakes or defiance in 1-3 words (THREE DAYS; PLAY BALL only if the quote is verified); never "AMATEURS" (Tactical Genius's). Title A/B: no subtitle vs "| The Man Who Saved Bastogne" (vidIQ >= 85; check the vidIQ balance first, the connector may need re-authorising).
- Risks: the "48 hours" claim is disputed; Cobra belongs to our Collins video (never open on it, credit it as background); the slapping incidents only as a factual note; keep it tactical.

NO-SKIP CHECKLIST + OWNER GATES (same as Cleburne, in order):
1. Fact-check everything in Gemini's file against other sources (Official Records / Army histories / Steve Zaloga-type secondary works). The Cleburne research had many errors (Sherman 25,000 vs ~16,000, an invented quote, a wrong battle name, unverified "8 flags"): list every correction in patton/research/FACT_NOTES.md; only verified facts and numbers go in the script; hedge ranges.
2. Write the script: [MAP] first paragraph; 2,750-2,800 words; the 3 engagement beats (woven subscribe line "D2" written fresh, one "What would you do?" card, final 1-2-3 question); NO spoken next-video pitch; method line per move.
3. Send the owner the script + a flags sheet and WAIT FOR APPROVAL. Flags: US 48-star + Reich flag as in Collins/Gavin; ask whether Patton uses map look E (see caveat below); the move choice; the title.
4. Names clip (tts/PRONUNCIATION.md): Patton, Bastogne, McAuliffe, Manteuffel, Avranches, Le Mans, Argentan, Falaise, Oppenheim, Eisenhower, Bradley, Hodges, Wiltz, Arlon, Luxembourg, Ettelbruck. Exact phonemes per name (patton/tools/tts_names.py), 20 s clip to the owner, wait for OK.
5. Voice A (convert right after narrate.py, before any render); music bed.
6. Maps: _hd_lift basemaps; agents: Opus for battle maps, Sonnet for search/download, at most 3 at once; brief templates/MAP_AGENT_BRIEF.md + a cleburne-style research/AGENT_COMMON.md. Sheets need no approval.
7. Archive: moderate length rule; licensed only (US Army Signal Corps film, NARA, LoC). Real photos in badges.
8. Render ONLY after the owner's explicit OK. A TEST is a 1-minute clip or snapshot sheets, never a full render.
9. Packaging: thumbnails A/B made by vidIQ in one go with a colour portrait (HANDOVER 1b + Gavin lesson b; repaint garbled map labels, tools/make_thumb_labels.py); description with NO links; publishing PDF.
10. Gofile upload only with the owner's OK; check the md5 of every file.

PRACTICAL NOTES (what bit us on #14):
- Setup: wait for /tmp/battle-maps-setup.done. Also needed and NOT in setup.sh: the depth model (/opt/models/depth_anything_v2_small.onnx from huggingface onnx-community/depth-anything-v2-small, onnx/model.onnx; pip install onnxruntime opencv-python-headless) for the 3D archive photos, and `pip install affine pysheds` for make_rivers_dem.py. pip download leaves .whl files in the repo root: delete them.
- Map look E caveat: tools/make_detail_layers.py uses USGS NHD rivers and NLCD wetlands (US ONLY) plus ESA WorldCover (global). For France/Belgium/Luxembourg/Germany swap the river source for DEM-traced rivers (make_rivers_dem.py) or Natural Earth, and expect almost no swamp. Overpass (OSM) was unreachable all session; agents drew their own town labels.
- The machine reboots when idle: stay in the turn with short waits during renders and voice conversion; render_all.sh and convert_voice.py resume from finished parts.
- A re-voice of one paragraph: narrate_changed.py, convert only that paragraph, splice into voice_owner.wav, then grep every B.at() phrase against the new text.
- Loudness: the master came out at -14.4 LUFS; +0.4 dB with alimiter level=disabled on the master's own audio, remux = -14.1 (measure with ebur128).
- Research from Studio: owner relays Studio-AI answers; Gofile folder links cannot be listed (not premium): ask for attachments.
- Test plan after upload (owner): log in research/CHANNEL_LOG.md: impressions days 1-3, CTR, retention at 0:30 and 1:00, traffic sources. Target >= 64% at 0:30.
Commit and push as you go, and merge to main at every milestone.
