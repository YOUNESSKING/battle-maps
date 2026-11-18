# GM troops test: critic rounds (2026-11-18)

Excerpt: S09 Champion Hill 55-110 s (Hovey takes the crest, Logan swings north, Bowen retakes it, massed guns, the third push) +
S10 Big Black 20-35 s (line taken, flanks over the bridge). Critic A = look of troops / arrows vs GM (3x sector crops, matched moments,
`troops_test_compare.jpg`, local only). Critic B = motion realism (10 fps / 4 fps strips + `tools/check_troops_motion.mjs`: slides,
pops, turn rates, speeds, vanishing blocks). Both critics were run in this session (no separate Sonnet subagent tool was available here).

| Round | A (look) | B (motion) | Main findings -> fixes |
| --- | --- | --- | --- |
| 0 (pre-render QA) | - | - | push-apart popped blocks 1.3 units in a frame (-> one continuous pass along each block's heading); column forming slid sideways / snapped 50-75 deg per 0.1 s (-> file-off behind the leader, heading low-pass +-0.9 s, turn toward walking direction); 10 u/s advances (-> pace cap, leave earlier from the hold) |
| 1 | 6.5 | 6.5 | A: white rim all round (GM: dark border, ONE bright front line), men too fat (plate colour hidden), guns = big red squares, thin dark line artefacts off every block (swept shadow quads). B: Crocker + massed guns pop in mid-field, retaken guns vanish grey, sideways slide when forming column |
| 2 | 7.5 | 7.5 | A: no loose men between the lines (GM has skirmishers / stragglers), arrow rim too white. B: blocks still start to walk before they have turned (crab start) |
| 3 | 8.0 | 8.0 | A: dark slab shadows under columns (fixed: figure-high shadows). Residual: GM blocks ~20 % bigger / deeper; at mid zoom (103 s) our thin blocks read a little less clearly than the old boxes. B residual: data-driven moves still peak at ~15 % frame width / s (Crocker, 2.2 s for 8 units on the word), forming columns slide <= 1.6 u/s for ~0.2 s |
