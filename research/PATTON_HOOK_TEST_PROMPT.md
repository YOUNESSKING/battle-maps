# Prompt for Battle 15: Patton opening test (owner 2026-11-01). Copy everything below the line.
---
Opening TEST on Patton #15 (owner 2026-11-01). It is NOT a rule yet: do not write it into STYLE_LOCK.

First: git fetch origin main && git merge origin/main. Then read:
- research/CONSIDERING.md, section "The 40-second formula"
- research/CHANNEL_LOG.md, section "the 40-second bucket"
- research/competitors/openings/SYNTHESIS.md (how the 9 top competitor videos open)
- STYLE_LOCK 1a (2026-10-31 opening rule) and 1c (on-screen text rules)

Why: every video's body holds steady after 1:00, so the share of viewers left at 0:40 decides everything. 2 Para kept 41% at 0:40 and got 40k views; Collins kept 36% and stalled at ~600. None of the top competitor videos opens on a count. They name the general at ~0:30-0:45 as the turn of one crisis story, and give him ONE paradox line, never a CV.

Change ONLY Patton's hook paragraphs (now 0:00-1:18), keeping one continuous story:
1. 0:00-0:10, ONE PRECISE MOMENT + THE STAKES, no statistics. For example: "On the night of December twenty-first, nineteen forty-four, thousands of American paratroopers were surrounded in the Belgian town of Bastogne." Use the date only if FACT_NOTES supports it; otherwise "In the last days before Christmas, 1944...".
2. 0:10-0:25, THE IMPENDING CATASTROPHE: what is lost if Bastogne falls (the road hub, the German drive toward the Meuse), sourced. CUT "More than two hundred thousand Germans and about five hundred tanks"; keep at most ONE number in the first 25 s. Speak the title's promise as a result here ("One American general broke through to them in a week": 19 to 26 Dec, sourced). Change "turned his whole army ninety degrees" to "turned his army north" ("90 degrees" is not sourced).
3. 0:25-0:40, THE COMMANDER + HIS UNCONVENTIONAL MOVE, told IN ORDER (no "three days earlier" flashback): on 19 December, in a freezing barracks at Verdun, Eisenhower asked how soon he could attack; he said the morning of the twenty-second, with three divisions; his army was facing east in another battle and he would turn it north; some thought he was boasting. Use only claims labelled VERIFIED in research/GEMINI_PATTON.md and FACT_NOTES.
4. ~0:40, THE NAME + ONE PARADOX LINE (5-10 s): "His name was George S. Patton. A year earlier, he had been taken off the battlefield in disgrace. Now he was the only general promising to attack." Word the disgrace (the 1943 Sicily slapping incidents, relieved from combat command) strictly as the sources support, factual and neutral. CUT "and even he had misjudged the German attack at first". Then keep the three-move line, "These are George Patton's three greatest tactical moves", the name slam and the 3 snap cuts.
5. Move the surrender demand and the one-word answer ("Nuts") out of the hook and into move 2, where Bastogne is told in full.
6. The bridge into the background/move 1, one line: "But what exactly made him the one general who could do it? Let's take a closer look." Background stays at max ~20 s right before move 1, and move 1 starts by ~1:30-2:00.
7. Visuals:
   - Keep the Bastogne stakes zoom.
   - Add a road-hub beat: the roads into Bastogne glow, red arrows aim west at the Meuse.
   - The Verdun card plays in order.
   - The "disgrace" line gets one stamp, e.g. RELIEVED · 1943, only when spoken.
   - The name slam comes ~15 s earlier.
   - Follow STYLE_LOCK 1c: nothing on screen before the narrator says it, and one big card at a time.
   Do NOT change for this test: the pace, the sound effects, or saying the result early. Each of those needs its own test.

Steps:
1. Show me the old and new hook text side by side, with the second each beat lands (the result line, the name, the paradox line, move 1 start), plus the source for every new claim. Wait for my OK.
2. After OK, follow the Cleburne v3 method (cleburne/script.md, cleburne/scenes-src/hook-a.js, commits of 2026-10-31):
   - Back up the script, timing and master first.
   - Run narrate_changed.py, then voice A (convert_voice.py with tts/voices/test_A_chatterbox.mp3) on the changed paragraphs ONLY, spliced into voice_owner.wav.
   - Rebuild and re-render only the hook scenes that changed. Check the join into the name slam: no leftover captions, no hard cut.
   - Remove any temporary scenes from scenes/ before assembling (sfx_cues.py reads every scene folder).
   - Assemble, then the loudness fix (-14 LUFS, true peak about -1.1). Shift the chapters.
3. Send me the first ~2:15 as a preview first, then the master. Upload only when I say so.
4. After Patton is published, log retention at 0:30 AND 0:40 in research/CHANNEL_LOG.md, next to Cleburne v3.
