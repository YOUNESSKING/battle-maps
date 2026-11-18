# Critic B, round 3 (final check): story and sync (renders `/tmp/vx_render3`, 2026-11-18)

Method: every round-2 finding re-checked on stills at its own time (plus frame-level crops where it hinged on 1-3 frames: S01 20.36-22.6
battery flashes, S03 47.2-47.6 Henry Clay burst, S10 31.3-33.5 bridge fire, S12 101-105 plaque), 8-15 stills per scene for regressions,
dive white-outs measured (centre crop, YMIN >= 100), every card/label checked against `tools/scene_times.py SNN --words` and FACT_NOTES.
Frames: `/tmp/vx_critic_B3/` (`sh_SNN.jpg`, `c*_*.jpg`). Times are scene-local seconds. Severity 3 = viewer misled / owner rule broken.

## Scores (10 = GM polish; round 2 in brackets)
| Scene | Score | One line |
|---|---|---|
| S01 cold open | 8 (7) | Montage bridge now legal: red column clears, fire after, blue arrow stops at the east bank; orange on-word muzzle flashes from the crest; no smoke pillar over the payoff |
| S02 fortress + plan | 8 (7.5) | Clouds gone, route on the Louisiana side, letter on its words |
| S03 night run | 7.5 (5) | Fleet mid-frame from frame 1, Benton + transports labels on boats, flashes on the town's river edge, shell bursts ON the Henry Clay at 47.5 ("burst" 47.47), dawn grade warm |
| S04 Grand Gulf + Bruinsburg | 8 (7) | Grierson line in frame with a rider on its head and rail-break sparks on "tearing up"; white-out ~0.9 s |
| S05 Port Gibson | 8 (7.5) | Curtains in front of the lines, nothing cut at the bottom, ledger + "road inland is open" clean |
| S06 cut loose | 8 (7.5) | Arrows inside the frame, Grant's banner off the arrow, every card on its word (Banks 3.47, Sherman 33.73) |
| S07 Raymond | 8 (7.5) | Short pushes to the creek, curtains on their own banks, Gregg retreats on "fell back"; dive white 0.8 s |
| S08 Jackson | 8 (7) | Close Jackson now grey-ochre with a light blue wash under the flag (no red town, no magenta); quote clear of the banner; dive 0.9 s |
| S09 Champion Hill | 8 (7.5) | McClernand card inside the frame; clock 11:00 held to the crest; no boxes on the cloud; "about 3,800" |
| S10 Big Black | 8 (7.5) | Last red box clears the west end ~31.5, fire visible from ~32.0 (after "fire" 31.45: on its word, rule kept); three new bridges with their own arrows |
| S11 assaults | 8 (7.5) | Trench curtains instead of beads, Cold Harbor quote exact, twenty-days timeline; dive 0.9 s |
| S12 siege + surrender | 8 (7.5) | Cards one at a time, terms band titled on its word, plaque rolls to 9 July on "Five days later", callback gunboats small and in frame |
| **Overall** | **8 (7)** | Every round-2 sev-3 is fixed; no new sev-3. Sync is tight (cards/labels within ~0.3 s of their words) |

## Round-2 findings: status
| # | Finding | Status | Evidence |
|---|---|---|---|
| N1 (3) | S01 41-43 crossing the burning Big Black bridge | FIXED | 41.5-42.0 red column on the road W of the bridge, red arrow 7 u north of the blue; 42.4 blue arrow ends at the east bank; fire 42.1-43.3 with nobody on the deck |
| N2 (3) | S03 0-16.5 empty river | FIXED | 1/4/9/14 s: the moored line mid-frame; "Benton" label on the lead boat at 9, "Three transports" on the transports at 14 |
| N3 (2) | S03 flashes in the town grid; 47.2 burst not on the boat | FIXED | Glows along the river edge 36/46; burst on the Henry Clay deck at 47.5, fire on her 48-58 |
| N4 (2) | Dive white-outs 1.3-1.5 s; boxes on the cloud | FIXED | Centre-covered: S01 0.87, S04 0.93, S07 0.80, S08 0.93, S09 0.90, S11 0.90 s (same profile everywhere); no boxes on the deck at S09 31.9/32.4 |
| N5 (2) | S01 20-24 battery flashes not readable | FIXED (just) | Orange muzzle flash + glow on the crest at 20.38 / 21.7 / 22.5; still small at 720p but now reads as guns, not white puffs |
| N6 (2) | S04 Grierson at the frame edge | FIXED | 48-54: line in the right third, rider at its head, sparks 51.5/52.2, card left of the line |
| N7 (1) | S09 McClernand card cut 66-70 | FIXED | 69: fully inside |
| N8 (2) | S08 close Jackson red under the Union flag | FIXED | 32/40/50: grey-ochre streets, blue tint, fire stays orange |
| N9 (1) | S01 smoke pillar over the payoff | FIXED | 44.6/47: clear |
| N10 (1) | S03 dawn graded midday | FIXED | 65-67 warm low light |
| N11 (1) | S09 clock 11:36 at 58.0 | FIXED | 58.2 reads 11:00; run starts on "took it" |
| N12 (1) | S02 cauliflower cloud | FIXED | 2/10/60/110/126: none |
| N13 (1) | Letter quote not in FACT_NOTES | FIXED (was already there, section 2) | |

Facts on screen re-checked (unchanged, all OK): plaque weekdays and day counts (e.g. 9 July Thu, Day 71), 870 / 2,441 / about 3,800 /
18 guns / 1,751 / 29,500, clock times, all quote cards. Script-level (locked, not a render issue): S03 "five more gunboats" vs S12 "seven
gunboats" (FACT 7 incl. Tuscumbia) as noted in round 2.

## New findings (none severity 3)
| # | Scene | t | Problem | Fix | Sev |
|---|---|---|---|---|---|
| R1 | S03 | 47-49 | The Henry Clay sails overlapping a second steamer (two hulls stacked) when she is hit; the burst is on both | Offset the following transport ~1 length astern (s - 1.5) for 45-50 | 1 |
| R2 | S07 | 36.5-38.0 | Gregg's retreat arrow runs off the top edge for ~1.5 s before it fades (6 % rule) | Shorten its head inside the frame or fade at 37.0 | 1 |
| R3 | S10 | 31.8 | "The bridges burn" label is up ~0.2 s before the first flame shows | Label in at 32.0 | 1 |
| R4 | S01 | 20.4-22.6 | Flashes are correct but small (crest is ~15 % of frame width); a viewer on a phone may miss them | Optional: flash size x1.5 | 1 |

## Story and pacing
- Hook: action from frame 1 (flash at 3 s), Vicksburg on its word, title rides the push, dive by ~15 s, FAILED on its word, montage now
  truthful (no burning-bridge crossing), 29,500 on "nearly thirty thousand", promise spoken by ~53 s. Passes HOOK LOCK / 1c.
- Something new every 2-4 s in every scene; the old dead stretches (S03 0-16, S04 44-54) are filled. Transitions (montage dissolves, S03
  dawn, S10 dip-to-morning, S12 callback) all work. Owner movement rules (columns on roads, water only on bridges, no burning-bridge
  crossing, boxes upright) hold on every still checked.

## Verdict
**Fit to publish from the story-and-sync side.** No must-fix item. R1-R4 are optional polish; do them only if another render happens
anyway (none justifies a re-render on its own).
