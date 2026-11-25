# Battle 21: George Washington's Top 3 Legendary Tactical Moves (plan, 2026-11-25 22:15 UTC)

Brief: `research/START_BATTLE_21_WASHINGTON.md` (binding). **Reference film = Andrew Jackson v4 (`ajackson/`): copy its pipeline, change
only the content.** Same engine (`vicksburg/engine/`), overlays, fonts, colours, grade, v6 clouds, banners, cards, ledger, date plaque,
end-screen tail, line-block troops, muzzle flashes, flintlock musket stem, mix chain and -14 LUFS. Only new look element: the winter
ground for the Delaware / Trenton / Princeton regions (tested on 4 stills against Jackson first). Decisions: `OWNER_DECISIONS.md`.
**Deadline: deliver by 2026-11-26 18:00 UTC.** RunPod budget <= $3 (balance at start $9.98, pod list empty).

## Film (~13-14 min, ~2,000 words, owner voice clone exactly as Jackson)
| # | Scene | Worlds | ~len |
| --- | --- | --- | --- |
| S01 | Hook: the stakes of THIS story (December 1776: the army melting away, enlistments ending 31 Dec, the Revolution with days to live), one continuous dive onto the Delaware at McConkey's Ferry; the storm crossing; Trenton at dawn: the hard number (~900 Hessians captured) on its words; back into the danger; the general enters as the turn with ONE human detail ("the game is pretty near up", 18 Dec 1776 letter); name slam GEORGE WASHINGTON + 3 snap cuts (Brooklyn night river, the Delaware crossing, Princeton) | colonies (wide) -> crossing -> trenton | 1:10 |
| S02 | 20 s background right before move 1: summer 1776, the British armada at New York; 27 Aug the flank march through Jamaica Pass, the Americans beaten and pinned on Brooklyn Heights with the East River behind them | colonies -> brooklyn | 0:45 |
| S03 | MOVE 1 Brooklyn, 29-30 Aug 1776: the British plan (siege lines + the fleet closing the river), "in other words", "But... instead": the night evacuation, Glover's Marblehead mariners, boats as separate vessels shuttling all night, the wind turns, the fog at dawn, ~9,000 men across; result + method card 1; subscribe bridge | brooklyn (dive 2) | 2:15 |
| S04 | The long retreat: Kip's Bay, White Plains, Fort Washington lost (16 Nov), across New Jersey, over the Delaware (7-8 Dec) taking every boat; the Hessian garrison at Trenton under Rall; enlistments end 31 Dec | colonies -> jersey | 1:15 |
| S05 | MOVE 2 Christmas night + Trenton, 25-26 Dec 1776: the plan (three crossings), storm + sleet, Glover's boats again, 3 hours late, the 9-mile march in two columns, attack at 8 a.m., Rall falls, ~900 prisoners; result + method card 2 | crossing (dive 3, night/storm) -> jersey -> trenton | 2:30 |
| S06 | MOVE 3a Assunpink Creek, 2 Jan 1777: Cornwallis marches from Princeton, the delaying fight on the road, the bridge held at dusk; trapped against the Delaware; WHAT WOULD YOU DO? (A: fight at the creek / B: slip away in the night) | jersey -> trenton | 1:45 |
| S07 | MOVE 3b the night march + Princeton, 3 Jan 1777: fires left burning, frozen roads, Mercer meets Mawhood at the orchard, Mercer falls, Washington rides between the lines, the British break; result + method card 3 | jersey -> princeton | 2:15 |
| S08 | Ending (<= 45 s after the result): Morristown, the British pull back from most of New Jersey, the army re-enlists, callback to "the game is pretty near up", method recap, 1-2-3 question, ~19 s clean map for the end screen | colonies | 1:05 |
Only 3 cloud dives (S01, S03, S05); every other region change = 0.9 s dissolve or a hard cut. Americans BLUE, British + Hessians RED
(Hessian regiments labelled by name). Flags: Grand Union (1776) / Union Flag 1707-1801. Weather only where sourced: fog at Brooklyn
dawn 30 Aug, storm + sleet 25-26 Dec, frozen roads 2-3 Jan.

## Worlds (project mode `VX_PROJECT=washington`, base frame web mercator z10)
colonies (wide, z9: New York to Philadelphia), jersey (wide, z10: McConkey's Ferry - Trenton - Princeton, winter), brooklyn (close, z11:
Brooklyn Heights, the ferry, the East River, lower Manhattan, summer), crossing (close, z12: McConkey's Ferry / Johnson's Ferry, winter),
trenton (close, z11: the 1776 town, King/Queen streets, the Assunpink bridge, winter), princeton (close, z11: Clarke farm, the orchard,
Stony Brook bridge, Nassau Hall, winter).

## Timeline toward the deadline (UTC)
| When | Step | Who |
| --- | --- | --- |
| 25 Nov 22:15-23:00 | Plan, decisions log, copy `ajackson/` tools + briefs; launch research (2 Sonnet) + worlds/engine (Opus) | lead |
| 23:00-01:30 | FACT_NOTES + geo json (Brooklyn; Delaware/Trenton/Princeton), fact-check; worlds baked + winter test (4 stills vs Jackson); script v1 | agents + lead |
| 01:30-02:30 | Voice: Kokoro -> words -> owner clone -> scene windows | lead |
| 02:30-09:30 | Scenes S01-S08 (Opus authors, max 3 at once, 2-3 scenes each), motion checks, sheets; drift sheet vs Jackson | agents |
| 06:00-10:30 | RunPod renders as scenes finish (pods always terminated, list verified empty); musket stem + assembly | lead |
| 08:00-11:00 | Packaging in parallel: titles (vidIQ), word, thumbnails A + B, 2 thumbnail critics, description, chapters, tags | Sonnet + lead |
| 10:30-11:30 | Critics round 1 (A look + drift + 5-fps motion, B story + sync + sound) | 2 Opus |
| 11:30-14:30 | Fix round + re-render changed scenes; round 2 critics | agents + lead |
| 14:30-16:30 | Round 3 only if needed (max 3 rounds); otherwise final polish | |
| 16:30-18:00 | Final assembly, 720p preview, PDF guide, Gofile upload (md5), PR + merge to main, report | lead |
If time runs short: ship the best critic-passed version and list open issues.

## Milestone merges to main
plan -> research + script -> worlds + voice -> scenes -> final.
