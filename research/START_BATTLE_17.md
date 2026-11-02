# Start prompt for "Battle 17" (Benedict Arnold). Written 2026-11-02 from the Cleburne/research session.
Make video #17: "Benedict Arnold's Top 3 Legendary Tactical Moves | The Man Who <true result>" (packaging: step 9).
- Repo: /home/user/battle-maps (must stay at this path). Start from `main`, work on the session's branch, folder `arnold/`. Everything lands on
  `main` by PR + merge at every milestone and at the end (CLAUDE.md, HANDOVER 0a). Uploads: the owner decides; Gofile only with his explicit OK.
- **Era = American Revolution** (data rules: our proven eras are the Revolution and the Civil War; Morgan #2 = 48k views, same era).
- **Moves (proposed, confirm against Gemini): 1 the march to Quebec + the assault on Quebec (Sep-Dec 1775), 2 Valcour Island on Lake
  Champlain (Oct 1776), 3 Saratoga: Freeman's Farm + Bemis Heights / Breymann's redoubt (Sep-Oct 1777).** Alternatives Gemini must rate:
  Ridgefield (Apr 1777), relief of Fort Stanwix (Aug 1777, Hon Yost Schuyler ruse). Overlap: our Daniel Morgan video covers Saratoga (Morgan's
  riflemen at Freeman's Farm): keep the camera on Arnold and say where the two videos meet.
- **Length: about 15-17 min** (~2,500-2,800 spoken words; `tools/count_words.py`).
- **RESEARCH: the Gemini prompt is `research/GEMINI_ARNOLD_PROMPT.md`. WAIT for the owner to attach Gemini's Arnold file; save it as
  `research/GEMINI_ARNOLD.md`** (raw, unverified). Note: on 2026-11-02 the owner pasted the GRANT file into the Battle 17 request by
  mistake (Grant #16 is already made): if what he attaches is about Grant, tell him and ask for the Arnold file. Do not start the fact-check
  or write anything about Arnold before the real file is here (you may set up the folder, maps and tools meanwhile).

## READ FIRST, in this order
1. `CLAUDE.md` (every bullet is binding) and `HANDOVER.md` (0a incl. the Grant #16 and Cleburne v3/v4 lines, 0b, 6, 10).
2. `research/DATA_RULES.md` (LOCKED 2026-11-02: two-stage reach model; write for MINUTES watched; win the sidebar click; publish order).
3. `STYLE_LOCK.md`, the whole file: 0b, **1a (the 2026-10-31 "stay in the story, no CV" block FIRST)**, 1b engagement, **1c on-screen text
   and clutter**, 2/2a, **2b map look v11 + clean screen**, **2c GRANT #16 LOCKS** (no trees, no modern reservoirs, territory colours only on
   wide overhead shots at half strength, plain Kokoro narration by default, complete Netflix archive style, move-end result + method cards).
4. `research/PACKAGING_GUIDE.md` 0b + `research/CHANNEL_LOG.md` (traffic sources table: what separates hits from flops) +
   `research/CONSIDERING.md` (ideas NOT in the rules) + `research/competitors/openings/SYNTHESIS.md` (how top competitors open).
5. **The Grant #16 project = the newest worked example of everything** (`grant/`: script, FACT_NOTES, FACTCHECK files, SCENES.md, tools
   incl. the scene builders, archive_inserts.json, ref_sounds.py, publishing PDF). Revolution look/flags examples: `greene2/` (Greene remake)
   and `morgan/` (Daniel Morgan, our Revolution hit: watch how its moves hold minutes).

## WHAT THE OWNER HAS DECIDED (do not re-ask)
- **Opening = ONE crisis story, no CV** (STYLE_LOCK 1a): stakes of THIS story first, ending on the place, the number, the title's promise by
  10-15 s, back into the danger, the general enters as the turn at ~0:40-1:00 with ONE human detail, name slam + 3 snap cuts, background
  max ~20 s right before move 1, move 1 by ~1:30-2:00. The treason (West Point 1780) is the twist everybody knows: use it in ONE line, as
  story, never as a biography detour in the first two minutes (Gemini is asked where it belongs).
- **Data rules**: hold viewers for minutes (each move opens on its own crisis, ends on a result card + method card + a question pulling into
  the next move); thumbnail must stand out next to the big Arnold videos in the sidebar (Extra History etc.).
- 1c rules on every scene (nothing on screen before it is said; clean first frame; one big card at a time; artillery only where visible;
  read the script cold; grep every `B.at()` phrase after any text change).
- Map look v11 per STYLE_LOCK 2b **as amended by 2c** (no trees, no modern reservoirs: Lake Champlain and the Hudson are natural, but check
  modern dams/reservoirs on the Kennebec/Dead River/Chaudière route to Quebec). NHD/NLCD are US-only: Quebec/Chaudière are in Canada ->
  use the WIDE mode (DEM rivers + WorldCover water) and check rivers by eye.
- Flags: Americans = hero blue, British = red, as in `greene2/`. Period flags change with the date (Continental Colours from Jan 1776, the
  13-star flag from the June 1777 Flag Act; Union Flag 1606 for Britain): **put the exact choice per move to the owner in the flags sheet.**
- Narration: plain Kokoro am_michael (2c), no voice A unless the owner asks. No spoken next-video pitch. Engagement beats (1b) as usual.
- Names: check them yourself on the web, exact phonemes in `arnold/tools/tts_names.py` (Valcour, Chaudière, Kennebec, Riedesel, Burgoyne,
  Breymann, Fraser, Carleton, Montgomery...), no waiting for approval.
- Tests = 1-minute clip or sheets; a full render needs the owner's explicit OK; preview the first ~2:15 after a render.

## NO-SKIP CHECKLIST + OWNER GATES (same as Grant #16, see `research/START_BATTLE_16.md` steps 1-10 for the detailed recipe)
1. Fact-check every claim in the Gemini file with 3 Sonnet agents against primary/serious sources -> `arnold/research/FACTCHECK_<X>.md`
   + `FACT_NOTES.md`. Suspects: "Valcour saved the Revolution", the Saratoga wound/leg, Gates relieving him, troop/ship/casualty numbers,
   every quote and page number (ignore page numbers).
2. Script `arnold/script.md` (tag format as `grant/script.md`, first paragraph = MAP). Read it cold.
3. **Send the owner the script + flags sheet and WAIT FOR APPROVAL.**
4. Names (tts_names.py). 5. Voice: plain Kokoro (`narrate.py`), music bed. 6. Maps (Opus agents for battle maps, Sonnet for simple ones,
   max 3 at once; `templates/MAP_AGENT_BRIEF.md`, `arnold/SCENES.md`, `arnold/research/AGENT_COMMON.md`; reuse Grant's builders/render_direct).
7. Archive: licensed only (LoC, NARA, Wikimedia PD paintings: Trumbull, Valcour engravings, Saratoga maps); complete Netflix style (2c).
8. Render only after the owner's OK; assemble; loudness fix (-14 LUFS, TP <= -1.1); check the first 12 s against 1c on the real render.
9. Packaging (0b): 3 titles (A locked format, B curiosity with a famous battle/twist, C hybrid), 2-3 thumbnails (map manoeuvre + face,
   1-3 TRUE words), every claim sourced; description without links; publishing PDF; end screen from the busiest video (Thomas or Morgan).
10. Gofile only with the owner's explicit OK; md5 check every file. After upload: log days 1-3 with the standard Studio prompt (DATA_RULES).

## PRACTICAL NOTES
- Wait for `/tmp/battle-maps-setup.done`. Depth model + `pip install affine pysheds` are not in setup.sh (see START_BATTLE_16 notes).
- Disk is a fixed allowance: delete old previews/backups before assembling (Cleburne v4 assembly died with "No space left").
- Stay in the turn during renders (the machine reboots when idle); relaunch only missing scenes.
- Epidemic Sound: the owner has a subscription; a local library + catalogue is in `library/epidemic/` (audio files are NOT in git: the
  repo is public). The sound lock is unchanged: Epidemic sounds only if the owner approves a test.
