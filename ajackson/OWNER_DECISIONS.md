# Decisions taken without the owner (pre-approved in research/START_BATTLE_20_JACKSON.md)

| # | Date | Decision | Why |
| --- | --- | --- | --- |
| 1 | 2026-11-23 | Andrew Jackson film lives in `ajackson/` (not `jackson/`) | `jackson/` already holds the Stonewall Jackson video; writing there would mix or overwrite the owner's files |
| 2 | 2026-11-23 | 8 scenes (hook, Creek War set-up, Horseshoe Bend, British arrival, 23 Dec night attack, the mud line, 8 Jan, ending), ~13-14 min | Top 3 format; Marion (our hit) ran a similar length; shorter film = less RunPod spend |
| 3 | 2026-11-23 | New web-mercator map frames for the Gulf (strategic), New Orleans and Horseshoe Bend, same engine + baker made frame-aware | the Vicksburg baker is tied to one frame around Vicksburg |
| 4 | 2026-11-23 | Musket sound design (`vicksburg/tools/troop_sfx*.py`, `vicksburg/sound/`) brought in from the unmerged branch `claude/gm-troops-test` (commit 13d9cbe3), without its share video | the start brief points at these files, but they never reached main |
| 5 | 2026-11-23 | Andrew Jackson banner portraits = Jarvis c.1819 uniform portrait (Met, CC0); Red Sticks shown as a banner with no portrait and a plain dark-red pennant (no documented flag) | sensitivity + no invented flags |
| 6 | 2026-11-23 | Thumbnail word "HE DUG." with title A "... \| He Won a Battle After the Peace Was Signed" (vidIQ 94) | 0c: contradicts the brawler image, true (the mud line), pairs with the title as a "how" |
| 7 | 2026-11-23 | The 3D look keeps the engine's own overlays (date plaque, THE ARMIES legend, result ledger) instead of burning in the 2D side-colour key plate | the approved 3D overlay set (Vicksburg film); the top-right corner holds the result cards and banners |
| 8 | 2026-11-23 | Musket sound for the whole film = troop_sfx stem from the engine's exported troop events (visible volleys only, exact flash times); cannon stays on the locked kit via scene cues; the old single volley sample is dropped | start brief (musket sound design), sound only for what is visible |
| 9 | 2026-11-23 | ~17 s of clean living map after the last word (S08 window extended) for YouTube's end screen | STYLE_LOCK 1b ending rule (last ~20 s) |
| 10 | 2026-11-23 | GPU supply shortage on RunPod: the second pod could not deploy, so the first pod was kept alive (its driver killed without the terminate trap) and reused for S04-S08 via POD + CTL_TOKEN_FILE; terminated by a wrapper trap, pod list verified empty. Render round 1 spend $0.24 | no duplicate pods, budget |
| 11 | 2026-11-23 | Owner: the hook must state the stakes; ships as separate ships. Hook line 1 rewritten (troops who burned Washington; the mouth of the Mississippi as a prize to bargain with at the peace table; FACT_NOTES N items 7, 11), two hook lines trimmed; only S01 re-voiced and spliced (tools/splice_section.py, delta -3.8 s); fleets in S01/S03/S04/S08 re-made as loose groups of separate ships | owner chat |
