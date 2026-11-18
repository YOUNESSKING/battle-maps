# Critic B, round 1: story and sync (Vicksburg 3D film, renders of 2026-11-18)

Method: every render sampled every 2 s (S01 0-20 s every 0.5 s), full-res frames and crops where needed, each visual checked against
`tools/scene_times.py SNN --words`, `script.md` and `research/FACT_NOTES.md`. Frames in `/tmp/vx_critic_B/` (`SNN_sheet_NN.jpg`, `full/`).
Times are scene-local seconds. Severity: 3 = a viewer is misled / owner rule broken on screen, 2 = clearly weak or out of sync, 1 = polish.
Known issues already in CRITIC_QUEUE.md are only repeated when they hurt the story more than the queue says.

## Scores (10 = GM polish)
| Scene | Score | One line |
|---|---|---|
| S01 cold open | 5 | Words and title land on time, but 0-9 s is a slow empty push, 10-16 s static under the title, the dive comes at 17 s, a ~1 s flat white frame, the montage (split army, burning bridge) is too small to read, and the river glows white instead of blue |
| S02 fortress + plan | 6 | Good stepwise winter-of-failures ledger and the zealous-cooperation letter, but Grant's west-bank march is painted ON the river, labels and FAILED stamps land early |
| S03 night run | 5 | Plaque + Porter + Henry Clay labels are on cue, but the fleet is specks, no visible battery flash on "Guns opened", 30-38 s and 70-86 s are near-static, no dawn shot |
| S04 Grand Gulf + Bruinsburg | 6 | Strong 7,000->17,000 counter and feints, but the guide marker sits on the Confederate (east) bank and the Grant quote is a 16 s static full-paragraph card |
| S05 Port Gibson | 5 | Ridges/ravines story is told in words but contradicted on screen: Union lines stretch across ravines, red line tiny; an unspoken "flank turned" label; arrow over a burning bridge |
| S06 cut loose | 6.5 | The twist (ghost arrow north, real arrow north-east) works and every card is on its word; rotated boxes and a "Pemberton" label floating beside Grant's banner |
| S07 Raymond | 5 | Cards on time, but "several times his strength" is never shown (5-6 blue boxes vs 5 red), boxes tiny in the creek fight, Gregg's boxes vanish |
| S08 Jackson | 6 | Factory micro-story and the dispatch card are good; red boxes vanish instead of leaving north, Jackson stays Confederate red under the US flag, 64-86 s night section is dark and static |
| S09 Champion Hill | 6.5 | Best-paced battle: cards one at a time on their words, clock, 1,200, quotes; but crest fight is an unreadable overlap of red and blue boxes, clock contradicts narration, ledger shows "-3,800" |
| S10 Big Black | 6.5 | Clear: loop, breastworks, charge, grey captives, 1,751; but the red column crosses the bridge while it burns (owner rule) and the next morning is not marked |
| S11 assaults | 7 | Best scene: Chickasaw pay-off with ghost arrow, unquoted Sherman letter, three corps labelled in the right order, clean twenty-days recap |
| S12 siege + surrender | 6 | Newspaper card and mine land well; the surrender (the film's payoff) is a wide shot of specks, Gettysburg label 2.5 s early, river "turns blue" reads white, flat ending without the night-run callback |
| **Overall** | **6** | Sync of cards/labels to words is good (most within 0.5 s). The weaknesses are story readability: who is where (tiny boxes, overlaps, vanishing units), places drawn wrong (march on the river, guide on the wrong bank), owner movement rules (rotated boxes, crossings over burning bridges) and dead stretches of 6-16 s |

## Findings (scene | t | sector | problem | fix | sev)
| Scene | t | Sector | Problem | Fix | Sev |
|---|---|---|---|---|---|
| S01 | 0-9 | whole frame | Hook opens on a slow push over an empty map: no action, no stamp in the first second, units are specks; GM hook = something happening from frame 1 | From t=0: batteries on the bluffs flash (2-3 cues, SFX) + a gunboat silhouette in the bend; plaque SPRING 1863 as a stamp at 0.5; raise unit scale on the wide map x2 for S01 | 3 |
| S01 | 9.5-16.5 | centre | Title lands correctly on "eighteen" (9.80), but the camera is nearly static for 6 s under it; the dive the script puts at 9.16 only starts at ~17.0 | Start the dive at T.eighteen-0.3 (≈9.5) and let the title ride the dive and fly past the lens by ~15.5; keep the push-in continuous (no hold) | 2 |
| S01 | 18.2-19.3 | full | Flat grey-white frames ~1 s (reads as a white flash, hook lock says no white flash) | Shorten the white-out to ≤ 0.3 s, keep cloud texture visible in every frame of the dive (no flat fill), emerge from 19.0 | 2 |
| S01 | 20-24 | bluffs | "Its guns stood on high bluffs" (20.36): only faint white puffs; flashes not readable at this distance | Battery flash + muzzle glow scaled x3 on the close world, 3 flashes on 20.4/21.7/22.5 with SFX | 2 |
| S01 | 25-29, 50-54 | river | "closed to the North" pulse is pink, end glow is white/cyan: the colour story (red = Confederate river, blue = Union river) does not read | Pulse #be3a2a at ≥70 % opacity; final glow #2c57b7 (Union blue) at full strength, not additive white | 2 |
| S01 | 30-32 | De Soto point | "Every Union attempt ... had failed": blue arrows appear and fade, nothing says FAILED | Arrow stops short + bounce-back, or the red FAILED stamp from S02 on "failed" (32.54) | 1 |
| S01 | 39-43 | wide | Montage "red boxes splitting / bridge burning" is invisible at this altitude; viewer sees only a thin route line | Two short punch-ins (1.5 s each): red mass splits at Champion Hill, bridge fire at Big Black (preset "column", fxScale 40 as engine README warns), then back to the route | 2 |
| S01 | 44-48 | Vicksburg | Visual payoff (29,500 + white flags) arrives at 44-48 s, hook rule wants it by ~0:30 | Accept (the script orders it so) or move "nine weeks after ... stacked their arms" before the "Its guns stood" paragraph; flag for the lead | 1 |
| S02 | 104-124 | Louisiana shore | "Down the west bank, through the Louisiana swamps" is drawn as a thick blue line ON the Mississippi channel; it reads as the river turning Union, not as a land march (owner: columns follow roads) | Re-route the arrow on the west-bank road Milliken's Bend - Richmond - New Carthage - Hard Times (offset 8-15 units west of the channel, GEO.md) | 3 |
| S02 | 34-38 | south edge | "Yazoo swamps" label ~1 s before "Yazoo" (35.0); "Grand Gulf" label at ~36 before "Grand Gulf" (38.14) | label t0 = word time (35.0, 38.1) | 1 |
| S02 | 80-85 | ledger | Grant's canal and Yazoo routes stamped FAILED at ~80-83 s, before "Every attempt failed" (85.74); the Yazoo line is never spoken | Hold all stamps until 85.7 (one stamp per line, 0.25 s apart) | 2 |
| S02 | 32-42 | river | A lone steamer cruises past the batteries in winter, unexplained (looks like the April run happening early) | Remove the boat or park it upstream | 1 |
| S02 | 88-90 | mid swamp | "In the Northern papers: calls for his removal" label floats over an empty swamp | Anchor it under the Grant banner at Young's Point, or make it a small newspaper clipping card | 1 |
| S02 | 128-136 | letter card | Quote line ~11 px high at 720p and finishes typing at ~135 with 1.5 s left before the cut | Quote line ≥ 18 px; cps up so it completes by 133.8 ("cooperation"), hold to scene end | 2 |
| S03 | 0-14 | river | Fleet is a line of specks; no Vicksburg label anywhere in the scene, a first-time viewer does not know this is the city from S02 | Closer first key (dist ~60 % of now) so the boats read as boats; "Vicksburg" carved name on the town at ~2 s | 2 |
| S03 | 22-36 | bluffs | "Guns opened from the bluffs" (22.29): no flash visible at 22.6 or 33 s; rule 2 (every cue visible) | Battery flashes scaled for night + red glow on smoke; first at 22.3 | 2 |
| S03 | 22 | plaque | Plaque switches from "10:00 at night" to "Night · the batteries open" with the watch hands at ~6:30 | Keep the watch at 10:xx (e.g. 11:15 for the firing) | 1 |
| S03 | 64.5 | cut | Hard cut night close -> day wide while the quote is still fading; the script's dawn shot ("fleet at anchor below the city") is missing | 0.8 s dissolve to a dawn grade on the close world, fleet at anchor below the city, then pull to wide | 2 |
| S03 | 70-86 | wide | 16 s of a static wide map with only ledger lines; the 22 April second run is a ledger line only | Animate the second run (6 steamers ticking down the channel past the city on "Six nights later", one sinks = Tigress) | 2 |
| S04 | 0-3 | plaque | Plaque "29 April" is up from t=0, before "twenty-ninth" (3.50) | Roll the plaque on 3.4 | 1 |
| S04 | 20-27 | east bank | "A local man comes in with news" marker sits on the Confederate (Mississippi) bank SE of Grand Gulf; he came INTO Grant's camp on the Louisiana side (GM ch. XXXIII) | Put the marker at Hard Times / De Shroon's on the west bank, next to the blue transports | 3 |
| S04 | 44-48 | wide east | "Far to the east" pans over an empty, unlabelled map for ~4 s before Grierson's card | Show Jackson + the railroad labels during the pan; start the Grierson line at 44.8 ("east") | 1 |
| S04 | 70-86 | quote | Whole 3-sentence quote on screen at once for 16 s over a dimmed, near-static map (nothing new for 16 s) | Reveal sentence by sentence on 69.4 / 74.4 / 82.1; drift the camera upriver so the Vicksburg bluffs appear behind Grant (script tag) | 2 |
| S05 | 18-34 | ridges | Narration: "An army could only come at him along the ridge tops"; on screen the blue boxes stand in long lines ACROSS the ravines and between the roads | Put the blue boxes as two road columns on the Rodney and Bruinsburg ridges only; red line astride both roads in front of them | 3 |
| S05 | 0-18, 30-50 | all | Red boxes very small and few; Bowen's line is barely visible all scene (known for night; also true by day) | Unit scale x1.5-2 on this region; red line of 6-8 boxes across both ridges | 2 |
| S05 | 46-48 | left ridge | "The flank turned" label: the narration never says it (rule 1) | Drop the label, or add 4 words to the script ("and turned his flank") | 2 |
| S05 | 56-62 | Port Gibson | Blue "road inland is open" arrow runs through the bridge while it is still burning (owner rule) | Arrow t0 after the fire ends, or route it to the raft/ford crossing; keep the fire on the bridge only | 2 |
| S06 | 2 | supply line | "Supply line" label before any mention (supply line spoken first in S06 at 87.27) | Label "the road back to Grand Gulf" or drop | 1 |
| S06 | 16 | label | "A month lost" at ~16, word "month" 17.51 | t0 17.5 | 1 |
| S06 | 38-43 | letter | Card text "Stop all troops till your army is supplied with wagons" drops "partially ... and then act as quick as possible" (GM ch. XXXIV) | Use the exact text with an ellipsis: "Stop all troops till your army is partially supplied with wagons ... for this road will be jammed, as sure as life." | 1 |
| S06 | 44-94 | Grant's column | Several blue boxes stand rotated ~60-90° (portrait) next to flat ones (e.g. 58 s lower left; 76-94 near the banner) (owner: boxes never rotate) | Lock box yaw to the formation's default for columns (engine: no per-box heading along the road) | 3 |
| S06 | 86-90 | centre | "Pemberton · Vicksburg and the Big Black" label floats right next to Grant's banner; a first-time viewer reads it as Grant's name | Anchor it on the red boxes at Edwards / the Big Black | 2 |
| S07 | 0-6 | wide | Red cross town glyphs everywhere around Raymond read as Confederate units before any Confederate is named (also S02, S04, S06, S08) | Change the wide-map town glyph to a neutral dark dot/house (known queue item; it hurts every wide shot) | 2 |
| S07 | 14-21 | creek | "Most of McPherson's corps, several times his strength": 5-6 blue boxes vs ~5 red, no dust cloud | Dust column on the road at 14.3 + blue boxes multiplying to 12-15 behind the lead brigade by 18.4 | 2 |
| S07 | 36-38 | Raymond road | Gregg's red boxes disappear while the red arrow draws (rule 4: retreats leave frame) | Red boxes peel into a road column through Raymond and off the north edge | 2 |
| S07 | 3 | plaque | "hot and dusty": "hot" is not documented (FACT 15: only "heavy smoke and dust") | "dust and smoke" | 1 |
| S08 | 18-22 | Jackson west | Blue and red boxes overlap/interpenetrate; at 22 the red boxes have vanished instead of leaving north | Hold separation ≥ one box width; red columns leave north on the Canton road (visible) | 2 |
| S08 | 20-53 | city | After "the Stars and Stripes flew over the capital" Jackson stays rendered in Confederate red hatching | Recolour the town to neutral/blue hatch on 19.3 (territory changes hands = red/blue hatch per Style W) | 2 |
| S08 | 64-86 | wide night | 22 s dark and nearly static; the courier marker is a dot too small to follow; "McPherson sent it to Grant" not shown | Brighter night grade, rider marker x3 with a lamp glow, a short blue hand-off line Clinton -> Grant's banner on 84.8 | 2 |
| S08 | 90 | Edwards | "Pemberton's army" label at ~90, "Pemberton" spoken 94.37 | t0 94.3 (or "the enemy near Edwards") | 1 |
| S09 | 56-62 | plaque | Clock reads "12:14 · Hovey takes the crest" while the narrator says "By eleven o'clock" and FACT has the crest taken ~1 p.m. | 11:00 on "eleven" (53.6), then 1:00 P.M. on "took it" (58.9) | 2 |
| S09 | 88-112 | crest | Bowen's counterattack and the third contest are a tangle of overlapping red and blue boxes; the viewer cannot see who holds the crest | Keep lines apart (min gap), retreating blue boxes slide back down the slope as a line, crest hatch turns red then blue | 3 |
| S09 | 34-62 | ridge | Boxes in the ridge line and road columns at many angles, some portrait (owner: boxes never rotate) | Same yaw lock as S06 | 3 |
| S09 | 162-171 | ledger | "CONFEDERATES ~3,800" renders as "-3,800" (tilde looks like a minus in the font) | "About 3,800" | 2 |
| S09 | 118 | north | Logan arrow appears ~2 s before "Logan's men" (120.19) | t0 120.1 | 1 |
| S10 | 30-36 | bridge | Red column crosses the bridge through the flames (fire starts ~31.5 while boxes are still on the span) (owner: no crossing a burning bridge) | Last red box clears the west end by 31.4; bridge fire t0 ≥ 31.5 (or move the retreat to start on "ran" 27.4 at v2) | 3 |
| S10 | 40-44 | bridge | "By the next morning" has no time change; Grant's banner sits on the burning bridge | 0.8 s dissolve + plaque 18 MAY · 8 A.M. on "next morning" (41.2); banner moved east of the river | 2 |
| S11 | 30-40 | river | The river behind the siege lines renders as a white, scaly ribbon (reads as a road or snow) | Use the same water material as the other close worlds | 2 |
| S11 | 68-82 | left | A large cloud covers a third of the frame during the twenty-days recap | Move/remove the cloud for this camera | 1 |
| S12 | 80-90 | siege line | The surrender (the film's payoff): march out, stack arms, turn grey, march back, all at wide distance; boxes are specks | Close key over the 3rd Louisiana Redan / Jackson road (dist ~1/3 of now) for 80-90, then pull back for 29,500 | 3 |
| S12 | 104-112 | wide river | "The whole river was in Union hands": river glows white/cyan, not Union blue | Same fix as S01: #2c57b7 glow running south from Vicksburg to the Gulf edge | 2 |
| S12 | 110 | label | "Gettysburg" label ~2.5 s before "Gettysburg" (112.49) | t0 112.4 | 2 |
| S12 | 95-99 | newspaper | "The last issue announced ... caught our rabbit": the 4 July sheet was the 2 July issue reprinted by Union soldiers (FACT_NOTES last row) | Card sub-line "4 July, reprinted by Union soldiers"; narration may stay (Grant's wording) | 1 |
| S12 | 120-140 | ending | Flat grey-green wide map, no sunset grade, no callback image for "It began on a dark river ... burning bales of cotton" | On 129.7 dissolve to the S03 night shot (Henry Clay burning, 3 s), then back to the sunset pull-up + ledger | 2 |
| S12 | 20 | town | "ate mule meat" has no visual (the only line without one in this paragraph) | Tiny mule marker / ration note label on 20.4 | 1 |
| all | - | wide maps | Box scale on wide shots (dist 270-700) makes units unreadable in S01, S03, S05, S07, S12 (known queue item, but it is the main story-readability problem) | Distance-compensated box scale (min 14 px box height on screen at 720p) | 3 |

## Story and pacing vs GM
- **Cold open:** GM states a number in sentence 1 and the full outcome in ~38 s. Ours puts the stakes in sentence 1 and the number at 9.8 s, outcome (29,500 stack arms) at ~45 s and the title-promise at ~53 s. Narration is fine; the pictures are what lag: 0-9 s and 10-16 s are dead air under good words.
- **Refrain:** "no supply line / between two armies" is heard in S01 and S06 only. GM repeats its spine 6 times. Add one-line returns: S07 end ("Still no supply line.") and S09 open ("Between two armies, Grant turned on the nearer one."). Script change, lead's call.
- **Human micro-stories:** guide (S04), factory (S08), spy courier (S08), hill of death (S09), porch (S09), rabbit (S12): good, about one per scene. Unused verified gems that would cost one line each: Grant's borrowed horse + his son Fred (FACT 3), Lawler "in his shirt sleeves" while Halleck's order to turn back arrives at the Big Black (FACT 5/16: a ready-made twist for S10), "Hard tack! Hard tack!" (S11).
- **Number cards:** 7,000->17,000, 1,200, 1,751, 29,500 and the ledgers are GM-grade. Keep.
- **Cliffhangers:** S05 ("one more question") and S07 ("First Jackson. Then Vicksburg.") with the two arrows are the best transitions. S03->S04 and S10->S11 end on ledgers with no forward pull; S10 could end on the three bridges + Vicksburg arrow.
- **Something new every 2-4 s:** dead stretches of 6-22 s: S01 10-16, S03 30-38 and 70-86, S04 70-86, S08 64-86, S12 120-140.
- **Quote marks:** all checked cards match FACT_NOTES (Grant's relief, cut loose, make the country furnish, tent cloth, hill of death, Neither Logan nor I, Cold Harbor, Lincoln with attribution to the Conkling letter, Sherman's 18 May line correctly unquoted). Only the S06 Sherman letter is trimmed (see table).

## Top 10 fixes (in order)
1. **Boxes never rotate** (S06, S07, S08, S09, S12): lock box yaw; columns slide along roads without turning the box.
2. **No crossing a burning bridge**: S10 30-36 (red column in the flames) and S05 56-62 (blue arrow over the burning bridge): retime fire t0 after the last unit clears.
3. **S02 104-124: Grant's march is drawn on the river channel**: re-route on the west-bank road via Richmond / New Carthage / Hard Times.
4. **S01 hook**: action from frame 1 (battery flashes + gunboat), dive starting on "eighteen" (~9.5) with the title riding it, white-out ≤ 0.3 s, readable montage punch-ins (split army, bridge fire), red/blue river colours.
5. **Unit readability**: distance-compensated box scale on wide shots; S05 Union on the ridge roads (not across the ravines); S07 show the corps outnumbering Gregg.
6. **S09 88-112 crest fight**: separate the lines so the hill visibly goes blue -> red -> blue; fix the clock (11:00 then 1:00 P.M.) and the "-3,800" ledger glyph.
7. **S12 surrender close-up** (80-90) plus a real blue river line (S01 end, S12 104-112) and the night-run callback in the last paragraph.
8. **S04 guide on the wrong bank**: move the marker to the Louisiana side by the transports.
9. **Units vanish instead of leaving** (S07 36-38, S08 20-22) and **Jackson stays red** after the flag goes up.
10. **Rule 1 leaks**: S02 FAILED stamps before "failed", S05 unspoken "flank turned", S12 Gettysburg 2.5 s early, S04 plaque before the date, S08 "Pemberton's army" 4 s early; then fill the dead stretches (S03 70-86 second run, S04 70-86 quote reveal, S08 64-86 courier).
