# START HERE: Battle 21, George Washington (owner 2026-11-25)

You are the session **"Battle 21 Washington"**. Read this whole file first. Then read the files in section 1, in that order, before you write anything.
Where this file conflicts with older rules, THIS FILE WINS.

> **UPDATE (owner, 2026-11-26, v2): the LOOK reference is the approved 3D tests, NOT Jackson v4:** `research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4` (+ README: the look), `gm3d_clip_v6_share.mp4` (clouds + opening), `vicksburg/troops_test_v14_share.mp4` (+ `vicksburg/critics/troops_v2_notes.md`: the troops). Jackson v4 had drifted from them (darker, no key, no timeline). Copy Jackson's PIPELINE and SOUND, but match the tests' palette, troop scale and overlays (see `washington/OWNER_DECISIONS.md` row 22).

## 0. The owner's decisions (binding)
- **Pre-approval:** the owner pre-approves everything ("I approve everything"): script, look, render, packaging.
  - Do not wait for answers.
  - Make sensible decisions and log each one in `washington/OWNER_DECISIONS.md`.
  - Keep working until the film is finished, packaged, uploaded to Gofile and merged to main.
- **Deadline: the owner wants to watch it by tomorrow.** Deliver within ~24 h of your start (target 2026-11-26, 18:00 UTC).
  - Plan for that: a ~13-15 min film, no exploratory rounds, at most 3 critic rounds.
  - If time runs short, ship the best critic-passed version and list open issues, rather than miss the deadline.
- **Topic:** George Washington, in the "Top 3" commander format, in the **3D look of the Andrew Jackson film (Battle 20)**.
  - **Why Washington:**
    - He was the #2 pick in research/study/10_next_commander_2026-11-23.md.
    - The Trenton anniversary is 25-26 Dec; the owner publishes ~19-22 Dec.
    - Commander-first packaging beat battle/campaign titles on our channel: Yorktown got 583 views, Vicksburg 1,311, while Marion got 89k and Thomas 138k (channel-hit-analysis-brief.md).
- **Moves (verify each with research):**
  1. The night evacuation from Brooklyn, 29-30 Aug 1776: ~9,000 men across the East River in one night, fog at dawn, Glover's Marblehead mariners.
  2. The Christmas-night crossing of the Delaware and Trenton, 25-26 Dec 1776: McConkey's Ferry, storm, the Hessian garrison under Rall.
  3. Assunpink Creek and the night march around Cornwallis to Princeton, 2-3 Jan 1777: campfires left burning, Mercer falls, Washington rides between the lines.
  - These are the "Ten Crucial Days" plus Brooklyn.
  - **No Yorktown:** our own Yorktown video went out on 13 Nov.
- **Copycats already did Washington, so DO NOT copy their angle.**
  - Warfare Genius, "George Washington's Top 3 Legendary Tactical Moves | He Lost Almost Every Battle, Then Won the War" (24 Sep, 11.3k views, 21 min). Its moves were Brooklyn, Trenton/Princeton and Yorktown.
  - Never use "lost almost every battle" as the title or hook.
  - Four tiny copies (0-256 views) used "won by running away", "Ten Days", "invaded his own country" and "the weapons Britain never saw coming". Avoid these phrasings too.
  - Our difference: the 3D maps with real troop movement, the night/fog/winter weather as action, and a stakes hook built for THIS story.
- **Title format:** "George Washington's Top 3 Legendary Tactical Moves | <subtitle>".
  - Follow PACKAGING_GUIDE 0c: one contradiction word on the thumbnail, two thumbnail variants (Back Door A + Grand Maneuver B), and 2 harsh critic agents.
  - The word must flip what viewers believe about Washington and still be literally true. The Marion word was "HE RAN.", so do not reuse it.
  - **Check every title for missing spaces.** Our live titles have "TheSwamp", "Battlesin" and "WashingtonTrapped".
- **Sides:**
  - Americans BLUE.
  - British RED. Hessians also RED (no third colour), labelled by regiment name.
  - Flags of the period:
    - US: the Grand Union flag (1776). NOT the Stars and Stripes.
    - Britain: the 1707-1801 Union Flag, without St Patrick's cross.
- **Weather** only where the sources confirm it: fog at Brooklyn on 30 Aug, the storm and sleet on the night of 25-26 Dec, frozen roads on 2-3 Jan.
  - The winter ground for Trenton/Princeton is the ONLY new look element allowed.
  - Test it on 4 stills against the Jackson film before you use it.
  - It must look like the same film in winter, not a restyle.

## 1. Read these, in order (all of them, before writing)
1. `CLAUDE.md`. Read it, but the Jackson pipeline below overrides its 2D-only parts (Style W, territory plates).
2. `research/START_BATTLE_20_JACKSON.md`: the previous brief. Every rule in it carries over, except the topic.
3. **The reference film = Andrew Jackson v4.**
   - `ajackson/README.md`: the pipeline, step by step, plus its lessons.
   - `ajackson/OWNER_DECISIONS.md`: ALL 15 rows, especially 7-15, which are the owner's fixes after delivery.
   - `ajackson/SCENES.md`, `ajackson/SCENE_AGENT_BRIEF.md`, `ajackson/CRITIC_BRIEF.md`, `ajackson/critics/round*_*.md`. The critics' findings are mistakes you must not repeat.
   - `ajackson/script.md`: the tone, tags and devices to match.
4. `vicksburg/engine/README.md` (SEQ schema, helpers, LESSONS), `vicksburg/README.md`, `vicksburg/critics/troops_v2_notes.md` (troop motion rules).
5. `research/START_BATTLE_20_TRENTON.md`: the older engineering notes for this exact ground (Delaware valley DEM, worlds, winter, Hessians). Use its engineering only; the film is the Top 3 format, not that campaign film.
6. `research/PACKAGING_GUIDE.md` sections 0b and 0c, `research/DATA_RULES.md`, `channel-hit-analysis-brief.md` (what makes our hits).
7. `STYLE_LOCK.md` sections 1a (hook), 1c (on-screen text), 1d (script devices).
8. `research/runpod/README.md` (GPU render recipe).

## 2. STYLE: copy Jackson, do not drift (the owner's main worry)
The owner approved the Jackson v4 look and sound. **Your film must look and sound like a sibling of it.**

- **Copy the project, don't rebuild it.**
  - Make `washington/` by copying `ajackson/`'s structure and tools: `tools/*`, `SCENE_AGENT_BRIEF.md`, `CRITIC_BRIEF.md`, the worlds config pattern.
  - Use the same engine (`vicksburg/engine/`), the same overlays, fonts, colours, grade, clouds, banners, cards, ledger, date plaque, end-screen tail, mix chain and loudness.
  - Change only the content: places, units, dates, text, portraits.
- **Do not invent new looks or overlays, and do not restyle.**
  - No new fonts, card styles, colours, map palettes (except the tested winter ground), camera styles or sound sources.
  - If something seems to need a new element, reuse the nearest Jackson element.
- **The look:**
  - ~3 cloud dives (v6 clouds).
  - Generals as portrait banners on poles. Washington: the Charles Willson Peale or Gilbert Stuart portrait, public domain.
  - Line-block troops (`troopsOpts.look = "lineblocks"`) with the rectangle rules:
    - long side first, never sideways, no columns;
    - stop → turn in place → walk;
    - retreats about-face, then walk;
    - at bridges and narrow crossings the men break rank gradually, stream across, go up the trail and vanish.
  - Run `check_troops_motion.mjs` on every scene.
  - Boats and ships as separate vessels, never one column (owner, Jackson decision 11). This matters for the Brooklyn evacuation and the Delaware crossing.
- **Owner fixes from Jackson that apply from the start:**
  - no idle units during action shots;
  - no blocks crossing each other;
  - rich, detailed wide overhead maps;
  - the hook states the STAKES first;
  - something new every 2-4 s.
- **Sound (Jackson v4 = the reference mix):**
  - Every musket shot is the flintlock construction (lock snap + pan flash + black-powder bang), on its muzzle flash. Muzzle flashes are drawn on every shot.
  - Muskets come from the troop events stem.
  - Cannon is the locked kit at ~8 dB above a musket volley, ducked 25 % under the voice.
  - -14 LUFS.
  - Sound only for what is visible.
  - Reuse `ajackson/tools/assemble.py` and `troop_stem.py` settings as they are.
- **Voice:** the owner's voice clone, exactly as Jackson.
- **Opening rules:**
  - The stakes of THIS story, written fresh.
  - One continuous dive onto the place.
  - The hard number on its words.
  - Washington enters as the turn of the crisis story (no CV).
  - Move 1 by ~1:30.
  - Nothing appears on screen before it is said.
- **Drift check after every round:** put 6 stills of your film next to 6 matching stills of Jackson v4 on one sheet. Critic A must confirm the two match (same overlays, type, grade, troop look). Any difference counts as a defect unless it is the winter ground.

## 3. Production (lean: the weekly usage limit is tight)
- **Research:** `washington/research/FACT_NOTES.md` plus geo, then fact-check agents.
  - Verify every number: the men evacuated; the Trenton prisoners (~900 Hessians); the American losses at Trenton; the Princeton numbers; the dates; the weather.
  - Do not use the unsourced Frederick the Great quote or the "drunk Hessians" myth.
- **Agents:** model per job as before (Haiku for file jobs, Sonnet for search/checks/packaging drafts, Opus for scenes, engine and critics), at most 3 at once.
- **Quality gate: two critics.**
  - Critic A: look, drift vs Jackson, and the strict 5-fps troop motion check.
  - Critic B: story, sync and sound.
  - Target ≥ 8 from both, at most 3 rounds (deadline).
- **RunPod:**
  - **Check the balance FIRST** with the GraphQL `myself { clientBalance pods { id } }` query, using `$RUNPOD_API_KEY`. Never print the key.
  - The owner is adding ~$10. **Budget ≤ $3 for this film.**
  - If the balance is below what a render needs, render on the local CPU (slower; plan the time) and say so in the report.
  - Render only changed scenes on re-renders.
  - ALWAYS terminate pods and verify that the pod list is empty after every deploy.
  - Keep a Monitor/until-loop alive while pods run (an idle session must never leave pods billing).
- **Git:**
  - Commit and push as you go.
  - PR + merge to main at milestones and at the end.
  - Never commit Grand Maneuver frames.
  - Never bypass YouTube's bot check.
  - Never `pkill -f` a pattern that matches your own shell.
  - Ask before deleting the owner's files.

## 4. Deliverables (plain-language final report to the owner)
- Gofile link: 1080p master, 720p preview, PDF publishing guide, thumbnails A and B.
- The 3 titles with vidIQ scores, and the thumbnail word.
- The critics' final scores and the drift-check sheet.
- RunPod spend and the remaining balance.
- A reminder to publish around 19-22 Dec, or earlier if the channel is hot.
