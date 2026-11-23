# Battle 20: Andrew Jackson's Top 3 Legendary Tactical Moves (plan, 2026-11-23)

Brief: `research/START_BATTLE_20_JACKSON.md` (binding). Look = the 3D Vicksburg engine (`vicksburg/engine/`) with the approved
line-block troops (`troopsOpts.look = "lineblocks"`, v13/v14), muzzle flashes on every shot, the musket sound design and only 3 cloud dives.
Folder `ajackson/` (the old `jackson/` folder is the Stonewall Jackson video; kept untouched). Decisions: `OWNER_DECISIONS.md`.

## Film (~13-14 min, ~1,950-2,050 words, owner voice clone)
| # | Scene | World | ~len |
| --- | --- | --- | --- |
| S01 | Hook: the stakes (British army of Wellington's veterans below New Orleans, the river and the whole West), one geographic zoom (dive 1) onto Chalmette; the hard number (British ~2,000 casualties vs a few dozen American, verified); twist: the peace treaty was already signed (not ratified); name slam ANDREW JACKSON | gulf wide -> chalmette close | 1:10 |
| S02 | Who he was in 20 s, then the Creek War: Fort Mims, the Red Sticks, the fortified bend of the Tallapoosa (enemy plan + stakes line) | gulf wide / horseshoe | 1:15 |
| S03 | MOVE 1 Horseshoe Bend, 27 Mar 1814: guns on the breastwork, Coffee + Cherokee/Lower Creek allies close the river, the canoes, the assault; honest cost; result + method cards; short archive block | horseshoe close (dive 2) | 2:15 |
| S04 | The British come: Pensacola, Lake Borgne gunboats (14 Dec), Jackson in New Orleans, the bayou nobody guarded | gulf wide -> neworleans wide | 1:15 |
| S05 | MOVE 2 the night attack, 23 Dec 1814: British at Villeré 9 miles from the city; "they shall not sleep on our soil"; the Carolina's broadside, Coffee's flank; the British stop; result + method cards | chalmette close, night (dive 3) | 2:00 |
| S06 | The mud line: Rodriguez Canal rampart, batteries (Lafitte's gunners), 28 Dec probe, 1 Jan artillery duel (set-up: the ladders) | chalmette close | 1:20 |
| S07 | MOVE 3, 8 Jan 1815: Pakenham's plan, the west bank delay, the missing ladders, the fog lifts, Gibbs' column, Pakenham falls, the 93rd; ~25 minutes; result + method cards | chalmette close | 2:30 |
| S08 | After: west bank, British withdraw, treaty ratified 16 Feb 1815, what the battle meant; Jackson's later record told honestly (Indian removal); final question + end | gulf wide | 1:15 |

## Steps and time estimates (wall time)
1. Research + `research/FACT_NOTES.md` + geo positions (2 Sonnet research agents in parallel): ~1.5 h. Fact-check agent on the script: ~0.5 h.
2. Engine/baker made multi-frame (new frames for the Gulf, New Orleans and Horseshoe Bend; same engine code; Opus agent, parallel with 1): ~2.5 h.
   Bake worlds: gulf (wide), neworleans (wide, optional), chalmette (close), horseshoe (close): ~0.5 h.
3. Script `script.md` (tagged paragraphs, STYLE_LOCK 1a/1d devices) by me: ~1.5 h.
4. Voice: Kokoro am_michael -> word times -> owner voice clone -> scene windows: ~0.5 h.
5. Scenes S01-S08 (Opus agents, max 3 at once; line-block troops, muzzle flashes, `check_troops_motion.mjs`, snapshot sheets): ~6 h.
6. Render on RunPod (budget <= $0.90: ~14 min x 6 s/s ~ 85 min of A5000 ~ $0.40; changed scenes only on re-renders; pods always terminated and listed): ~1 h.
7. Musket sound design (troop events export -> `troop_sfx.py`) + assembly (-14 LUFS, locked cannon kit, levels): ~1 h.
8. Two critics (A look + 5-fps troop motion, B story + sync), fix rounds until both >= 8 or no longer improving: ~3-4 h.
9. Packaging (3 titles, thumbnails A + B per PACKAGING_GUIDE 0c, 2 harsh thumbnail critics, description, chapters, tags), PDF guide,
   Gofile upload, PR + merge to main: ~2 h.
Total ~20 h of work, aimed to finish inside ~2 days. PR + merge to main at milestones: plan, research + script, worlds + engine, scenes, final.
