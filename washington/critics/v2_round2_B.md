# v2 round 2 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_v2r2_720.mp4` (12:53.2, **-14.0 LUFS**, LRA 3.1, true peak **-1.1 dBFS**). Renders `/tmp/wx_v2r2/SNN.mp4`
(13:43-13:55), stem + log rebuilt after them (14:01), film 14:13, so stem and picture match. Voice/story/word times unchanged since round 1.
Scratch + stills in `/tmp/wx_critic_Bv2r2/` (5-10 fps crops of every sounded volley window, ledger/clock sheets `ledA.jpg` `ledB.jpg`,
volley sheet `vol.jpg`, join strip `joins.jpg`). Stem log `washington/build/troop_stem_log.json` read against `sound/troop_events_*.json(.vis.json)`.

## Scores (10 = Grand Maneuver polish)

| Scene | v2 r1 | v2 r2 | One line |
|---|---|---|---|
| S01 hook | 8.5 | 8.5 | 22.45 gun + 3 volleys, 63.63 / 67.7 still flash on the frame with the new yaw-82 orchard framing. Overlays unchanged. |
| S02 background | 7.5 | 7.5 | Carved "White Plains" on its word; no pulse. No guns. |
| S03 move 1 | 8.2 | 8.6 | B2-3 fixed: "About 9,000 men" on "nine", "Nearly all their guns" 0.4 s before "guns" (after "nearly"), "across in a single night" on "single", "stragglers" on its word. Date plate 30 Friday matches the ledger. |
| S04 retreat | 8.0 | 8.0 | Unchanged sync; stamps replaced by carved names. |
| S05 move 2 | 7.6 | 7.9 | B2-1 picket fixed (in frame, fires + sounds at 92.5). B2-5 fixed ("a future president" ~1.8 s). B2-8 fixed (bigger flashes). B2-4 NOT fixed (King St volley still ~2 u west of the Hessian blocks). NEW find: Sullivan's "from the houses" volley 107.75 fires from an empty field at the left frame edge. Greene's block still walks through the farm. |
| S06 trap | 8.0 | 8.5 | B2-2 fixed: both American bridge lines flash on the block fronts / works. Jersey skirmish volleys (fxScale 24) now read well, but the first American flashes at 15.8 and 28.4 land ~1 block length west of the block in empty grass. |
| S07 move 3 | 8.5 | 9.0 | B2-6, B2-7, B2-9, B2-10, B2-11 fixed (clock on "road" / "orchard", "the roads froze" after the plate, ledger notes on their words, "college" carved). Cannon 87.0 / 90.4 flash + smoke on the reframed Nassau Hall shot. |
| S08 ending | 9.0 | 9.0 | Unchanged; clean end-screen map. |
| **Overall** | **8.2** | **8.5** | |

**Fit to publish? NO (one S05 pass away).** Everything round 1 asked for in S03 / S06 / S07 is fixed and the mix is on target. What stays
broken is the rule "sound only where the shooter is visible" in S05 at two moments (103.5 and 107.75: 31 musket shots from ground with no
troops). Both are seq.js-only fixes, then a re-render of S05 (95-110), `troop_stem.py`, `assemble.py`. With them I score S05 8.4 and the
film 8.7 = publishable.

## Checks that pass
- **Level**: -14.0 LUFS integrated, TP -1.1 dBFS, LRA 3.1 (= r1). Voice clear, music under it.
- **Flash <-> sound** (stem log, film t): S01 22.45-22.55, 63.63, 67.7; S05 428.99 (picket, now on screen, vis px [846, 71]), guns 99.45 /
  100.9 / 103.55 / 107.65 / 108.2, surrender 452.84 / 453.14 (flashes 3-5 px now, readable); S06 jersey 515.23 / 516.03 / 527.83 / 528.83 /
  530.38 (peaks -15 to -17 dB, right for the wide shot), bridge 542.43-549.53 with one cannon per wave (43.02 / 46.12 / 49.87, gun smoke
  visible); S07 632.55-663.62, guns 668.32 / 671.72. First flash within 0-1 frame of the first shot each time; no flash without a bang seen.
- **Overlays on or after their words**: S03 ledger rows + notes; S05 ledger (captured 129.32, killed 131.38, "No American killed" 134.58,
  "in the battle" 135.34, "a future president" 140.65 -> ledger out 142.2, letter 142.5; one card at a time kept, 0.3 s cross-fade only);
  S06 "5,500" count-up on "five thousand" (rolls through 4,000 by design), "American riflemen" on "riflemen", "Three attacks" on "three";
  S07 clock 2:00 on "road" (20.01), "The mud froze" plate on "froze", note "the roads froze" 28.1, 8:00 "an orchard" on "orchard" (49.45),
  ledger "killed, wounded or captured" 92.99, "Almost 200 prisoners" 97.17, "died nine days later" 103.19.
- **Joins** (72.9-74.3, 116.9-118.3, 270.1-271.6, 335.8-337.3, 498.8-500.3, 580.6-582.2, 706.8-708.3): clean dissolves, no flicker; the S06/S07
  decide card holds through the join and B turns blue on "slipped away".
- **Respect / facts**: unchanged script; Hessians as soldiers; overlay texts now only say what is spoken.

## Findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| B3-1 | S05 | 103.5-104.4 | 440.0-440.9 | NOT FIXED (B2-4). "The Hessians tried to form up in the streets": the King St volley (seq.js l.181, pts HG[0] +-1.1 = x 1352.9-1355.1) flashes among the houses west of the streets; the three Hessian blocks of that group render ~190 px (~1.9 u) further east, between the two east streets (crop `hv.jpg`). 16 shots from no visible troops. The Queen St volley (103.6) is on its block. | Put l.181 pts on the rendered blocks: [[1355.0, 2058.6], [1357.0, 2058.6]] (check on a 103.75 still; flashes must sit on the block fronts), or bind the volley to units 11-13 if the engine allows. Keep 103.5. | 2 |
| B3-2 | S05 | 107.75-109.9 | 444.2-446.4 | "...and shot at from the houses": Sullivan's volley (l.183, pts [1350.8, 2062.2]-[1351.2, 2063.0]) fires from open grass at x ~50 px, the very left frame edge; Sullivan's block is clipped by the edge; the nearest houses are ~400 px east (`h107.jpg`). Bang at full level for an off-picture shooter. | Move Sullivan's first stop sPos[0] to [1353.4, 2062.4] (west edge of the lower town) and the volley pts to [[1353.9, 2062.0], [1354.3, 2062.8]], dir [1, 0]; or move the CUT key (l.320) 2 u west so the block is in frame. Re-export the stem. | 2 |
| B3-3 | S06 | 15.8-16.1, 28.4-28.7 | 515.2-515.5, 527.8-528.1 | First American skirmish flashes land ~60-75 px west of the blue block in empty grass (the seg straddles the road, `RD(44.8, 1.0)` / `RD(29.8, -2.4)` length 1.0); the later flashes sit among the skirmisher figures east of the block, which reads right. | l.94 and l.96: shorten the seg to 0.5 and shift it 0.5 u east onto the skirmisher screen (`RD(44.8, 1.5)`, `RD(29.8, -1.9)`), same times. | 1 |
| B3-4 | S05 | 92.6-93.8 | 429.1-430.3 | Carried over (B2-1 second half): Greene's west block walks straight through the farm buildings (`farm.jpg`), on "burst out of the storm". | Shift gPos s0 for i=0 1.5 u west (l.124: `1333.0 - 1.5 + i * 2.2` for i 0 only) or move the farm prop. | 1 |
| B3-5 | S05 | 127-142 | 463-479 | Clock still "8:00 in the morning / the storm still blowing" under the result ledger, ~40 s after it was set; the surrender is ~9 a.m. Stale plate. | `plaque.clock` at T.about (127.77) "9:30" note "the battle over", or `plaque.date` 26 December. | 1 |
| B3-6 | S06 | 42.1-45.9 | 541.5-545.3 | Carved "stone bridge" sits on the creek ~270 px east of the bridge (at [1360.2, 2069.9] vs BR [1356.3, 2069.3]); reads as naming an empty stretch of water. | at [1357.6, 2070.4] (just SE of the bridge, clear of the red arrows). | 1 |
| B3-7 | S07 | 28.0-31.3 | 609.3-612.6 | "The mud froze" plate and the clock note "the roads froze" are on screen together: same fact twice. | Drop the clock note change (keep "the back road"), or drop the plate. | 1 |
| B3-8 | S06 / S07 | cues.json | | B2-12 not changed: unsounded second-ripple cues still in cues.json; no visible flash without sound found in the crops, so cosmetic. | Tag them `silent` in the cue export. | 1 |

## Round-1 issue status
B2-1 fixed (picket) / farm walk-through not fixed (B3-4) - B2-2 fixed - B2-3 fixed - B2-4 NOT fixed (B3-1) - B2-5 fixed - B2-6 fixed -
B2-7 fixed (now doubled with the plate, B3-7) - B2-8 fixed - B2-9 fixed - B2-10 fixed - B2-11 fixed - B2-12 unchanged (B3-8). No level or
join regression.

## Top fixes
1. B3-1: S05 King St Hessian volley onto the Hessian blocks (pts ~[[1355.0, 2058.6], [1357.0, 2058.6]], verify on a still).
2. B3-2: S05 Sullivan's "from the houses" volley in frame and at the houses (sPos[0] [1353.4, 2062.4], pts [[1353.9, 2062.0], [1354.3, 2062.8]]).
3. B3-3: S06 jersey American skirmish segs shifted onto the skirmish screen.
4. B3-4: S05 Greene's block clear of the farm.
5. B3-5 / B3-6 / B3-7: S05 clock after the battle, S06 "stone bridge" on the bridge, S07 one "froze" text.
6. Then re-render S05 (88-110) (+ S06 15-31 for B3-3), `troop_stem.py`, `assemble.py`, LUFS check (-14.0, TP <= -1).
