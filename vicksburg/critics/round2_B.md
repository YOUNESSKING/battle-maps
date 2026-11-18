# Critic B, round 2: story and sync (Vicksburg 3D film, renders `/tmp/vx_render2`, 2026-11-18)

Method: every render sampled every 2 s (S01 0-20 s every 0.5 s), full-res frames and 2-3x crops where a finding depended on detail
(S01 hook + montage, S02 march route, S03 fleet/batteries, S04 Grierson, S09 crest + dive, S10 bridge 30.6-32.5, S12 surrender/finale),
fully-covered white-out frames measured with ffmpeg signalstats (YMIN >= 100). Each visual checked against `tools/scene_times.py SNN --words`
and `research/FACT_NOTES.md` (dates/weekdays, numbers, quote wording). Frames: `/tmp/vx_critic_B2/` (`sheet_SNN_k.jpg`, `x_*.jpg`, `full/`).
Times are scene-local seconds. Severity: 3 = viewer misled / owner rule broken on screen, 2 = clearly weak or out of sync, 1 = polish.

## Scores (10 = GM polish; round 1 in brackets)
| Scene | Score | One line |
|---|---|---|
| S01 cold open | 7 (5) | Action from frame 1, title rides the dive, river reads red then Union blue, FAILED stamp on its word. But the montage's Big Black shot shows red boxes and BOTH arrows crossing the burning bridge (owner rule), and battery flashes on the close world are still faint puffs |
| S02 fortress + plan | 7.5 (6) | March now on the Louisiana side, stamps on "failed", letter readable and typed in time. Grey cauliflower cloud bottom-right 0-20 / 56-64 |
| S03 night run | 5 (5) | REGRESSION: 0-16 s shows an empty river; "Benton · the flagship" and "Three transports" labels point at empty water. The 22 April run and the dawn dissolve are good additions |
| S04 Grand Gulf + Bruinsburg | 7 (6) | Guide on the right bank, quote in three on-word cards, 7,000->17,000. Grierson = a bare line at the right frame edge, no rider; dive white-out 1.5 s |
| S05 Port Gibson | 7.5 (5) | Union now as columns on the two ridge roads, ravines empty, bridges burn after the last red column, arrow stops at the town. Red boxes still small at the top of the wide close |
| S06 cut loose | 7.5 (6.5) | Boxes upright, Pemberton plate on his boxes, exact Sherman text, every card on its word. Twist reads clearly |
| S07 Raymond | 7.5 (5) | 19 v 5 boxes reads "several times his strength", creek respected, Gregg's column visibly retreats through Raymond, cliffhanger arrows land on "First Jackson. Then Vicksburg." |
| S08 Jackson | 7 (6) | Units leave north, blue wash, factory + fire on "flames", courier readable. Dive white-out 1.3 s; close factory shot keeps the whole town brick-red under the Union flag |
| S09 Champion Hill | 7.5 (6.5) | Crest fight now readable (two separated lines, gap moves), clock 11:00 -> 1:00, "about 3,800". McClernand card cut by the right edge at 66-70; boxes drawn on top of the dive cloud at 31-33 |
| S10 Big Black | 7.5 (6.5) | Last red box clears the west end at ~31.3 as the fire starts (fixed, tight); dip-to-morning + 18 May 8:00 plaque; banner off the bridge |
| S11 assaults | 7.5 (7) | River no longer foil, Cold Harbor quote exact (22d), twenty-days recap clear. Dive white-out 1.4 s |
| S12 siege + surrender | 7.5 (6) | Surrender close-up now readable (march out, white flags, grey stacks, 29,500), blue river ribbon, Gettysburg on its word, dusk + night-run callback |
| **Overall** | **7 (6)** | Big step: almost every round-1 sev-3 is fixed and sync is tight (labels/cards within ~0.3 s of their words). What still hurts: the S03 opening has no boats at all, the hook montage breaks the burning-bridge rule, dive white-outs in S04/S08/S11 are 1.3-1.5 s, and the battery-flash beats (S01 20-24, S03 22-36) still do not read as guns on bluffs |

## Round-1 findings: status
| Round-1 finding (scene, t) | Status | Note |
|---|---|---|
| S01 0-9 empty push, no action | FIXED | Flash at 3.0 on the bluffs, gun groups visible at 0.5; plaque on "spring". (Gunboat in the bend is a 3-px speck: polish) |
| S01 9.5-16.5 static under title | FIXED | Title on 9.80 rides the push, leaves ~14.5, dive 14.7-16.4 |
| S01 18-19 ~1 s white | PARTLY | 0.73 s fully covered (15.97-16.67), cloud texture visible; within tolerance, better than every other dive |
| S01 20-24 flashes not readable | PARTLY | Still only small white puffs at the shore at 22-24; no read as "guns on high bluffs" |
| S01 25-29 / 50-54 river colours | FIXED | Red bands at 26-31, Union-blue river 50-55 |
| S01 30-32 FAILED | FIXED | Stamp on 32.54 |
| S01 39-43 montage invisible | PARTLY | Split and bridge shots now readable, but the bridge shot breaks the owner rule (new finding N1) |
| S02 104-124 march on the river | FIXED | Route west of the channel, then "Across the river" on the plan line |
| S02 34-38 labels early | FIXED | |
| S02 80-85 stamps early | FIXED | 85.7-86.2 |
| S02 32-42 lone steamer | FIXED | Holds in the hairpin |
| S02 88-90 newspaper label over swamp | FIXED | |
| S02 128-136 letter small/late | FIXED | |
| S03 0-14 fleet specks, no Vicksburg label | NOT FIXED / WORSE | No boats in frame 0-16 s (see N2). Vicksburg label on 66.55 is correct per rule 1 |
| S03 22-36 no battery flash | PARTLY | One glow inside the town grid at 22.35 (reads as a fire in the streets, not a gun on the bluff edge); boats still specks at the bottom-left |
| S03 22 plaque/clock | FIXED | 10:30 at night |
| S03 64.5 hard cut, no dawn | FIXED | 1 s dissolve, 17 April plaque, fleet below the city (grade reads full day, not dawn: polish) |
| S03 70-86 static wide | FIXED | Second run animated, steamers visible, volunteers stamp |
| S04 0-3 plaque early | FIXED (was already) | |
| S04 20-27 guide on wrong bank | FIXED | |
| S04 44-48 empty pan | PARTLY | Jackson pinned; Grierson is only a line on the right frame edge (N6) |
| S04 70-86 static full quote | FIXED | Three on-word cards, camera moving |
| S05 18-34 Union across ravines | FIXED | |
| S05 red boxes tiny | PARTLY | Better at night; on the 22-34 wide close the red line at the top is still ~8 px boxes |
| S05 46-48 unspoken "flank turned" | FIXED | "Pressed on both ridges" on its word |
| S05 56-62 arrow over burning bridge | FIXED | |
| S06 2 "Supply line" label | FIXED | |
| S06 16 "A month lost" | FIXED | |
| S06 38-43 Sherman text | FIXED | Exact text with ellipsis |
| S06 44-94 rotated boxes | FIXED | Engine: boxes face the camera (all scenes) |
| S06 86-90 Pemberton label by Grant | FIXED | |
| S07 0-6 red-cross town glyphs | FIXED / not visible | Wide towns now read as neutral brown hatch |
| S07 14-21 strength not shown | FIXED | |
| S07 36-38 Gregg vanishes | FIXED | |
| S07 3 "hot" | FIXED | |
| S08 18-22 overlap / vanish | FIXED | Rearguard leaves north |
| S08 20-53 Jackson stays red | PARTLY | Wide map blue-washed; the close factory shot 30-54 is still a brick-red town (N8) |
| S08 64-86 night dark/static | FIXED | Rider + lamp readable, McPherson card, hand-off |
| S08 90 Pemberton label early | FIXED | |
| S09 56-62 clock | FIXED | 11:00 then 1:00 (at 58.0 the hands already read 11:36: polish) |
| S09 88-112 crest tangle | FIXED | Separated lines; hill visibly changes hands |
| S09 34-62 rotated boxes | FIXED | |
| S09 162-171 "-3,800" | FIXED | |
| S09 118 Logan arrow early | FIXED | |
| S10 30-36 column through flames | FIXED | Last red box at the west abutment at 31.3 as the east end catches; gone by 31.8 |
| S10 40-44 next morning | FIXED | |
| S11 30-40 foil river | FIXED | |
| S11 68-82 cloud | FIXED | |
| S12 80-90 surrender at wide distance | FIXED | |
| S12 104-112 white river | FIXED | Blue ribbon (slightly violet under the dusk grade) |
| S12 110 Gettysburg early | FIXED | |
| S12 95-99 reprinted issue | FIXED | |
| S12 120-140 flat ending | FIXED | Dusk + night-run callback 129.5-135 |
| S12 20 mule meat | NOT DONE (sev 1, accepted) | Plaque note only |
| all: box scale on wide shots | PARTLY | Better in S01/S07/S10; still small in S03 wide close, S05 top line, S12 wide |

## New findings (scene | t | sector | problem | fix | sev)
| # | Scene | t | Sector | Problem | Fix | Sev |
|---|---|---|---|---|---|---|
| N1 | S01 | 41.3-43.3 | centre (Big Black bridge) | Hook montage: the bridge burns (fire t0 38.2, ablaze from the start of the shot) while 4 red boxes stand stacked across it and the red retreat arrow AND the blue pursuit arrow run straight through the flames. Owner rule: no crossing a burning bridge; also reads as the Union army crossing a burning bridge | Show the red boxes already on the WEST bank and the fire starting after they clear (e.g. boxes cross 41.3-42.2, fire t0 42.3); end the blue arrow at the east bank (the new bridges come in S10), or drop the blue arrow from this shot | 3 |
| N2 | S03 | 0-16.5 | whole frame | No boat is visible at all: camera looks at empty water while the plaque says "the boats cast off" and the "Benton · the flagship" (8-10) and "Three transports" (14-17) labels sit at the bottom edge pointing at nothing. The fleet first appears ~17 s as specks. The scene's subject is missing for 16 s | Re-aim the first keys so the moored line is in the middle third of the frame (the label anchors show it is just below/behind the lens: move target ~8-12 units upstream of the label points, or raise tilt), keep boat size 0.68; verify with a still at 4, 9, 14 s that Benton + 6 gunboats + 3 transports are all in frame | 3 |
| N3 | S03 | 22.3-36 / 46-47.5 | town | The battery flashes land INSIDE the town grid (glow at 22.35 mid-town; a big orange burst in the streets at ~46 just before "a shell burst in the cotton around her boilers" 47.19). A first-time viewer reads the city being hit / set on fire, and the Henry Clay's cotton burst is not on the boat | Place battery flash emitters on the bluff edge over the water (river side of the town, the batteries above the bend), not in the street grid; put the 47.2 burst on the Henry Clay herself (fire t0 47.2 on the boat) | 2 |
| N4 | S04 / S08 / S11 (and S09) | S04 59.1-60.6, S08 12.3-13.6, S11 28.2-29.6, S09 ~32 | full | Dive white-outs fully cover the frame 1.3-1.5 s (S01 is 0.73 s with the new `dives[].off`). S08 12-13 and S09 32 are a flat cream fill; in S09 the unit boxes are drawn ON TOP of the cloud (31.8-32.4) | Apply the S01 `off` profile to every dive (warm +0.05, emerge +0.15, clear +0.4, haze +1.05); hide DOM unit boxes / labels while the cloud deck is closed | 2 |
| N5 | S01 | 20-24 | bluffs | "Its guns stood on high bluffs over the river": the close shot shows only faint white puffs at the shoreline; no flash/plume reads as artillery at 720p (round 1, partly fixed) | 3 shots on 20.36 / 21.66 / 22.48 with a bright 2-3 frame muzzle flash + an orange glow ring (not the white blob of x3), placed on the bluff crest above the water line | 2 |
| N6 | S04 | 44.8-54.5 | right edge | Grierson's raid = a bare blue line hugging the right frame edge, its head off frame; the Grierson card sits on the line; no rider/unit, "tearing up railroads" has a tiny label only | Pan 15-20 % further east so the line runs in the right third, a cavalry box (or rider icon as in S08) riding its head, 2-3 small rail-break sparks on the railroads on "tearing up" (51.4); card offset left of the line | 2 |
| N7 | S09 | 66-70 | right edge | McClernand card enters cut by the right frame edge (66-69) | screen x <= 1690 like the S12 Grant fix | 1 |
| N8 | S08 | 30-54 | town | Close factory shot: the whole of Jackson is brick-red while the Union holds it (the blue wash is only on the wide map); red town + red factory reads as Confederate ground | Light Union-blue wash on the close world too (alpha ~0.15, under the fire layer so the fire stays orange), or desaturate the roofs on this shot | 2 |
| N9 | S01 | 44-55 | right (Big Black) | A tall grey-violet smoke pillar stands at the Big Black for the whole payoff/end shot (left over from the montage fire); on the wide map it reads as an unexplained blob next to the surrender | Fire/smoke t1 at the end of the bridge shot (43.3), or fade the plume by 44.5 | 1 |
| N10 | S03 | 64.5-69.5 | grade | "By morning" dawn shot is graded as full midday | Warm low dawn grade (dusk preset) 64.5-69.5, as S10's 18 May morning | 1 |
| N11 | S09 | 58.0 | plaque | Clock reads 11:36 at 58.0 (spin starts before 58.6); harmless but visible | Hold 11:00 until 58.6 | 1 |
| N12 | S02 | 0-20, 56-64 | lower right | Large grey cauliflower cloud covers ~1/6 of the opening wide map of the scene (looks like a blob, not weather) | keepClear for the S02 wide keys | 1 |
| N13 | S02 | 128-136 | FACT_NOTES | The letter quote ("Whatever plan of action he may adopt will receive from me the same zealous co-operation and energetic support as though conceived by myself.", Sherman to Rawlins 8 Apr 1863) is correct but not recorded in FACT_NOTES | Add a FACT_NOTES row with source (Sherman Memoirs / OR) | 1 |

Facts re-checked on screen (all OK): weekdays on every plaque (17 Apr Fri, 22 Apr Wed, 29 Apr Wed,
3 May Sun, 7 May Thu, 11 May Mon, 14 May Thu, 16 May Sat, 17 May Sun, 18 May Mon, 2/9 July Thu); 7,000->17,000; 870; 1,200; 2,441 / about
3,800; 18 guns / 1,751; 29,500; 2:00 p.m. (19 May), 10:00 a.m. (22 May), 3:00 p.m. mine, 10:00 a.m. surrender; quote cards (relief, enemy's
country, dry ground, cut loose, Sherman warning, furnish the balance, tent cloth, Johnston dispatch, highest points, hill of death, Neither
Logan nor I, Cold Harbor/22d, Father of Waters with the Conkling attribution) match FACT_NOTES/GM; Sherman's 18 May line and Grant's terms
are correctly unquoted with "the substance" subtitles. Script note (locked, not a render fix): S03 says "five more gunboats" (6) and S12
says "seven gunboats" (FACT: 7 incl. Tuscumbia); the S12 ledger "Seven gunboats" follows FACT.

## Story and pacing
- Cold open now hits GM rhythm in the first 15 s: flash at 3 s, Vicksburg label on its word, title on "eighteen" riding the push, dive by 15 s. The montage still carries the one rule break (N1).
- Something new every 2-4 s holds everywhere except S03 0-16 (empty river, N2) and S04 44-54 (edge-hugging line, N6). The round-1 dead stretches (S03 70-86, S04 70-86, S08 64-86, S12 120-140) are all filled.
- Transitions: the dissolves (S01 montage, S03 dawn, S10 dip-to-morning, S12 callback) work. Cliffhangers S05, S07, S10 (three bridges + arrows) now pull forward.

## Top fixes (in order, all worth the re-render)
1. **S03 0-16.5: put the fleet in frame** (N2, sev 3): the opening of the night run shows no boats and two labels point at empty water.
2. **S01 41.3-43.3: no crossing the burning Big Black bridge in the hook montage** (N1, sev 3): fire after the red boxes clear; blue arrow stops at the east bank.
3. **Dive white-outs 1.3-1.5 s in S04/S08/S11 (+S09 boxes over the cloud)** (N4): apply S01's `dives[].off` everywhere; hide DOM boxes while the deck is closed.
4. **Battery flashes read as guns on the bluffs** (N3, N5): S03 emitters on the bluff edge (not in the streets), the 47.2 cotton burst on the Henry Clay; S01 20-24 three on-word flashes with glow.
5. **S04 Grierson** (N6): line in frame, a rider on its head, rail-break sparks on "tearing up".
6. **S08 30-54 close Jackson still red under the Union flag** (N8).
7. Polish if cheap: S09 McClernand card edge (N7), S01 Big Black smoke pillar in the payoff (N9), S03 dawn grade (N10), S09 clock 58.0 (N11), S02 cloud (N12), FACT_NOTES row for the zealous-cooperation letter (N13).
