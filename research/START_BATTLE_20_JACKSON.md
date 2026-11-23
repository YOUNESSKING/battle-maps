# START HERE: Battle 20, Andrew Jackson (owner 2026-11-23)

You are the session "Battle 20 Jackson". Read this file completely, then CLAUDE.md, HANDOVER.md, research/DATA_RULES.md,
research/PACKAGING_GUIDE.md (section 0c = the LOCKED thumbnail + title recipe from Marion #18), vicksburg/README.md and
vicksburg/engine/README.md. Where this file conflicts with older rules, THIS FILE WINS.

## 0. Why this video, and the owner's decisions (binding)
- **Data (owner, 2026-11-23):** Marion #18 (2D, "Top 3" commander format, HE RAN. packaging) is our biggest hit: 83k views in 6 days.
  The 3D Vicksburg film had GOOD retention (~40 % average viewed, above the channel median) but a 3.1 % CTR, the same as our 2D Grant
  video: the TOPIC (Grant/Vicksburg) is burned, not the 3D look. Our single-battle Yorktown (no hero in the title) flopped.
  So: **a famous commander who is under-covered, in the "Top 3" commander format, in the 3D look, with commander-first packaging.**
- **Topic:** Andrew Jackson (research/study/10_next_commander_2026-11-23.md: ~20k searches/month "andrew jackson", ~25k "battle of new
  orleans"; none of the 50 newest "Top 3 Tactical Moves" uploads covers him; existing New Orleans videos are plain documentaries).
- **Moves (check and refine with research):** 1. Horseshoe Bend (27 Mar 1814); 2. the night attack of 23 Dec 1814; 3. the Rodriguez
  Canal line, 8 Jan 1815 (fog). Hook angle: the battle fought AFTER the peace treaty was signed (Ghent, 24 Dec 1814) — word it exactly:
  the treaty was signed but not yet ratified (16-17 Feb 1815), so never say "after the war ended". Verify every number (British
  casualties, American casualties) in FACT_NOTES; "71" must be checked before any thumbnail uses it.
- **Sensitivity:** Jackson is polarising (Indian removal, slavery, the Creek War). Keep the script on the military story, mention the
  darker side honestly and briefly where it belongs (Horseshoe Bend is a battle against the Red Stick Creeks: describe it respectfully,
  name both sides accurately), never celebrate atrocities, no Lost-Cause-style hero worship.
- **Title format:** "Andrew Jackson's Top 3 Legendary Tactical Moves | <hook>" (+ Test & Compare variants per PACKAGING_GUIDE 0c).
  Thumbnail per 0c (commander face pop + one context image + 1-3 words, e.g. AFTER PEACE.). CHECK every title for missing spaces
  (five of our live titles had typos like "TheSwamp", "Battlesin").
- **Look = 3D**, the Vicksburg engine (`vicksburg/engine/`) with:
  - only ~3 cloud dives (owner's Vicksburg v2 choice), v6 clouds, the approved overlays, banners on poles for generals;
  - **troops = the new soldier blocks approved after the troops test (v13/v14, owner: "Great")**: `troopsOpts.look = "lineblocks"`
    (see vicksburg/critics/troops_v2_notes.md and vicksburg/sequences/S09_gm, S10_gm): every unit is a WIDE RECTANGLE that moves only
    long side first (never lengthwise, no columns), stop → turn in place → walk straight, retreats = about-face then walk back,
    no stretching, no collisions, no pops; at bridges/narrow crossings the men break rank gradually as they walk in, stream across,
    continue up the trail and vanish (no regrouping). Use `tools/check_troops_motion.mjs` on every scene;
  - **muzzle flashes**: add small flashes along each firing line at the exact shot times (sound must belong to something visible);
  - **musket sound design** from vicksburg/tools/troop_sfx.py (Epidemic Sound Enfield recordings, ripple volleys, distance + pan,
    sources in vicksburg/sound/SOURCES.md) driven by the troop events export (vicksburg/tools/export_troop_events.mjs); keep the
    locked cannon kit and levels.
- **Voice:** the owner's own voice clone (as Vicksburg v2: `tts/convert_voice.py`, reference `tts/voices/owner_clone_test.mp3`).
- **Approval:** the owner pre-approves script, look and packaging; decide sensibly and log decisions in `jackson/OWNER_DECISIONS.md`.
- **Quality gate:** two critics (look + story/sync, plus a strict 5-fps troop-motion check) before anything is called finished;
  fix rounds until both ≥ 8 or no longer improving.
- **Speed matters:** the channel is hot from Marion and copycats are cloning our picks. Target: finished and uploaded within ~2 days.

## 1. Rules carried over
- Model per job: Haiku for trivial file jobs, Sonnet for search/download/checks/sheets/packaging drafts, Opus for scenes, engine and
  critics; up to 3 agents in parallel. The owner's weekly Max-plan limit was in "warning": work lean (reuse the Vicksburg engine,
  worlds tooling and assets; no exploratory rounds).
- Research yourself (web + fact-check agents), sources in `jackson/research/FACT_NOTES.md`.
- Render on RunPod (research/runpod/README.md; env RUNPOD_API_KEY, never print it). Balance is only ~$1.00: budget ≤ $0.90 for the
  whole film, render only changed scenes, use the local CPU fallback for short bits; ALWAYS terminate pods and verify the list is empty
  after every deploy (a failed deploy once created 7 pods). If the balance is not enough, tell the owner in the final report.
- Keep long jobs alive with Monitor/until-loops (the container pauses when idle); commit + push as you go; PR + merge to main at each
  milestone and at the end. Never commit Grand Maneuver frames. Never bypass YouTube bot checks. Never pkill -f a pattern matching your
  own shell. Ask before deleting the owner's files. Disk is tight: clean your own intermediates.

## 2. Deliverables (plain-language final report to the owner)
Gofile link (1080p master + 720p preview + PDF publishing guide + thumbnails), the 3 titles + thumbnails, the critics' final scores,
RunPod spend, and a reminder to publish within ~2 days while the channel is hot.
