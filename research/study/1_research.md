# 1. Research: thumbnail + title wording, channel scans, master top-video table (Agent 1, 2026-10-30)

Data: yt-dlp scans (research/competitors/*.md/.json), run today. "x med" = views / that channel's own median long video (>= 8 min). Views are live counts, so young videos are understated; views/day (v/d) is given where it matters. Thumbnails were LOOKED AT as contact sheets (WG 9, TG 13, Footprint 13). Quotes are exact. "Why it worked" is MY INFERENCE from title/thumbnail/era, not channel analytics.
Extend: `python3 research/tools/yt_channel_scan.py @Handle 40`, then add rows to section C.

## A. Thumbnail + title wording study

### A1. Warfare Genius (WG, 5.4k subs, median 35,096; 9 long videos, ages 4-37 days)
Layout, all 9: map on the left 60 % (3D tile blocks, blue vs red, burning town + smoke, white curved arrow, place labels, small portrait badge of the general), big photoreal general portrait on the right, red brush banner bottom-left, ALWAYS ONE WORD in quotes (or "?"). Same template every time.
| Banner | Type | Video / subtitle | Views | x med | v/d | Len | Age |
|---|---|---|---|---|---|---|---|
| "PUNISHED" | injustice / stakes | Guderian: "Fired for Being Right" | 717,105 | 20.4 | 21,091 | 19:21 | 34 |
| "HOPELESS" | stakes | Eisenhower: "The General Who Never Saw Combat" | 294,518 | 8.4 | 11,781 | 18:41 | 25 |
| "A DECOY" | enemy-trick / mechanism | Patton (no subtitle) | 131,951 | 3.8 | 4,256 | 20:36 | 31 |
| "BETRAYED" | betrayal | Rommel: "Admired by His Enemies, Destroyed by His Own" | 45,946 | 1.3 | 2,088 | 20:15 | 22 |
| "BURIED" | forgotten/suppressed | Manstein: "The Plan They Tried to Bury" | 35,096 | 1.0 | 2,507 | 19:27 | 14 |
| "BETRAYED" | betrayal | Zhukov: "Why Stalin Exiled His Best General" | 20,711 | 0.6 | 2,301 | 19:24 | 9 |
| "FORGOTTEN" | forgotten | Bradley: "The Quiet General Who Out-Planned Them All" | 20,115 | 0.6 | 5,029 | 20:03 | 4 |
| "OVERRATED?" | question / contempt | Montgomery: "The General Who Ended Germany's Winning Streak" | 16,673 | 0.5 | 926 | 19:01 | 18 |
| NO WAY OUT | stakes | Washington: "He Lost Almost Every Battle, Then Won the War" | 10,726 | 0.3 | 298 | 21:18 | 36 |
Title patterns: "<Name>'s Top 3 Legendary Tactical Moves" (Guderian, Patton, Zhukov, Bradley, Washington) then switched to "Top 3 Genius Moves" (Eisenhower, Rommel, Manstein, Montgomery); subtitle = a fate/injustice clause ("Fired for Being Right", "Destroyed by His Own", "Why Stalin Exiled..."). Top two have a hard outcome word ("Fired", "Never Saw Combat"); the 2 "forgotten" ones and the "Quiet General" flopped.

### A2. Tactical Genius (TG, 11.6k subs, median 87,944 over the 12 scanned; Zhukov is missing from the scan and was fetched separately)
Layout, all 13: map FULL width behind (dark, desaturated, grey/brown, small diamond/cluster unit markers, white arrows, named portrait badges for both commanders, one or two place labels), portrait right, red brush banner bottom-left, 1-4 words, quotes only on real quotes.
| Banner | Type | Video / subtitle | Views | x med | v/d | Len | Age |
|---|---|---|---|---|---|---|---|
| LET THEM COME | hero defiance | Ridgway: "The Man Who Turned Korea Around" | 1,363,832 | 15.5 | 23,116 | 18:59 | 59 |
| "AMATEURS" | enemy contempt (quote) | Patton (no subtitle) | 953,823 | 10.9 | 10,147 | 16:53 | 94 |
| AT THE GATES | stakes | Zhukov: "The Man Who Broke Hitler" | 744,454 | 8.5 | ~10,500 | 16:38 | 71 |
| "IMPASSABLE" | enemy belief | Manstein: "The Man Who Broke France" | 250,587 | 2.9 | 4,556 | 26:10 | 55 |
| LET THEM GO HUNGRY | decision | Slim: "The General Better Than Montgomery" | 222,662 | 2.5 | 5,178 | 17:28 | 43 |
| THE SWINE ISN'T ATTACKING | quote, 4 words | Montgomery: "The Victor of El Alamein" | 113,546 | 1.3 | 1,135 | 15:10 | 100 |
| TRAPPED | stakes | Guderian: "The Father of Blitzkrieg" | 112,747 | 1.3 | 1,790 | 16:42 | 63 |
| WORSE THAN STALINGRAD | stakes | Bradley: "The Man Who Outranked Patton" | 63,142 | 0.7 | 1,754 | 20:13 | 36 |
| "DUGOUT DOUG" | nickname | MacArthur: "The General Truman Fired" | 30,759 | 0.35 | 628 | 27:27 | 49 |
| "NOT A SUPERMAN" | nickname/insult + negation | Rommel: "The General Churchill Admired" | 26,072 | 0.3 | 322 | 14:49 | 81 |
| NO ROAD OUT | stakes | O'Connor: "The Man Who Almost Won North Africa" | 18,755 | 0.2 | 218 | 12:50 | 86 |
| "SEPOY GENERAL" | nickname | Wellington: "The Man Who Beat Napoleon" | 7,722 | 0.09 | 70 | 20:45 | 112 |
| "IMPASSABLE" | enemy belief | Yamashita: "The Tiger of Malaya" | 6,464 | 0.07 | 84 | 15:31 | 77 |
Title patterns: "<Name>'s Top 3 Legendary Tactical Moves | The Man Who <result>" (Ridgway "Turned Korea Around", Manstein "Broke France", Zhukov "Broke Hitler", Bradley "Outranked Patton") or "The General <Churchill Admired / Truman Fired / Better Than Montgomery>". Best two: Ridgway (result in subtitle) and Patton (NO subtitle). Slim's "Better Than Montgomery" (a rivalry/ranking) did 2.5x.

### A3. Footprints in History (FH, 2.5k subs, median 21,919; 13 videos, 1-22 days old, so v/d matters). Owner-added channel.
Layout: TILTED PAPER MAP with terrain relief on the left (a "war table" look, not 3D blocks), portrait right, red brush banner bottom-left with 2-3 words, 9 of 13 end in "?" . This is a third template distinct from WG and TG; it copies TG's title formula and adds an em-dash result clause.
| Banner | Type | Video | Views | x med | v/d | Len | Age |
|---|---|---|---|---|---|---|---|
| HE NEVER RETREATED | hero defiance (statement) | Chesty Puller: "The Most Decorated Marine in History" | 128,077 | 5.8 | 5,852 | 22:54 | 22 |
| "TOO CLEVER?" | question/contempt | "3 Moves That Saved Hitler's Army  Then Hitler Fired Him" (Manstein) | 105,465 | 4.8 | 5,273 | 24:26 | 20 |
| HE'S INSANE? | question/contempt | Sherman: "He Cut Himself Off From Supply and Won the War" | 101,154 | 4.6 | 8,430 | 23:02 | 12 |
| WRITTEN OFF? | question | Grant: "The "Drunk" Who Won the Civil War" | 38,849 | 1.8 | 2,285 | 24:22 | 17 |
| THEY WERE FINISHED? | question/stakes | Ridgway: "He Saved the Army MacArthur Almost Lost" | 32,228 | 1.5 | 4,604 | 24:37 | 7 |
| STALIN TRUSTED HIM? | question | Rokossovsky: "The General Stalin Imprisoned, Then Trusted" | 22,242 | 1.0 | 1,483 | 22:26 | 15 |
| TURN BACK, MEN! | quote | Sheridan: "He Rode Into a Rout and Turned It Into Victory" | 21,919 | 1.0 | 5,480 | 21:03 | 4 |
| TOO POWERFUL? | question | Zhukov: "The General Stalin Feared More Than Hitler" | 18,663 | 0.9 | 982 | 24:27 | 19 |
| MAD GENIUS? | question | Rommel: "The General Hitler Feared" | 15,437 | 0.7 | 3,087 | 24:33 | 5 |
| IMPOSSIBLE? | question | Nelson: "3 Greatest Gambles" | 8,106 | 0.4 | 811 | 28:52 | 10 |
| (none; collage of scenes) | none | Smedley Butler: "He Tried to Give His Medal of Honor Back" | 7,053 | 0.3 | 2,351 | 22:17 | 3 |
| GENIUS OR DISASTER? | question | MacArthur: "Genius at Inchon, Disaster at the Yalu" | 5,612 | 0.3 | 624 | 25:08 | 9 |
| THEY WERE SURROUNDED | stakes | Chosin: ""Retreat, Hell!" - How the Marines Fought Their Way Out" | 180 | 0.01 | 180 | 22:46 | 1 (new) |
Note: its three top videos are the statement/loaded ones (HE NEVER RETREATED, a hook title, a provocation); the generic "X?" banners (IMPOSSIBLE?, GENIUS OR DISASTER?) sit at the bottom. Its Sherman (101k in 12 days) beats our Sherman-era TG-style expectation; check our own Sherman number.

### A4. Same-subject A/B across channels (banner + subtitle vs views; channel size differs, so only a rough read)
| Subject | TG | WG | FH | Commanders and Tactics (no thumbs seen) |
|---|---|---|---|---|
| Guderian | TRAPPED / "Father of Blitzkrieg" 113k | "PUNISHED" / "Fired for Being Right" 717k | - | - |
| Patton | "AMATEURS" 954k | "A DECOY" 132k | - | - |
| Zhukov | AT THE GATES 744k | "BETRAYED" 21k | TOO POWERFUL? 19k | 595k |
| Manstein | "IMPASSABLE" 251k | "BURIED" 35k | "TOO CLEVER?" 105k | 396k |
| Rommel | "NOT A SUPERMAN" 26k | "BETRAYED" 46k | MAD GENIUS? 15k | 244k |
| Ridgway | LET THEM COME 1.36M | - | THEY WERE FINISHED? 32k | - |
| Montgomery | "THE SWINE ISN'T ATTACKING" 114k | "OVERRATED?" 17k | - | - |
| Bradley | WORSE THAN STALINGRAD 63k | "FORGOTTEN" 20k | - | - |
| MacArthur | "DUGOUT DOUG" 31k | - | GENIUS OR DISASTER? 5.6k | - |

### A5. Derived wording rules (evidence-based, with the limits stated)
1. **Winners name a concrete situation or enemy line, not an abstract feeling.** Top banners: LET THEM COME (1.36M), "AMATEURS" (954k), AT THE GATES (744k), "PUNISHED" (717k, with "Fired for Being Right"), "HOPELESS" (295k), "IMPASSABLE" (251k), LET THEM GO HUNGRY (223k), HE NEVER RETREATED (128k). Four types carry the top: (a) hero defiance/decision, (b) enemy contempt or belief (real quote), (c) ominous stakes at a place or a lost position, (d) injustice to the hero (WG's "PUNISHED"/"Fired for Being Right").
2. **Betrayal / buried / forgotten / "Underrated" words did NOT carry**: WG "BETRAYED" 46k and 21k, "BURIED" 35k, "FORGOTTEN" 20k; Bradley "FORGOTTEN" and "Quiet General" sat at 0.6x. These are the words that describe an after-the-war biography, not a fight, so the viewer can't picture the story. (Caveat: all four are weak subjects too, and young.)
3. **Nicknames and insults needing background flop**: "DUGOUT DOUG" 0.35x, "NOT A SUPERMAN" 0.3x, "SEPOY GENERAL" 0.09x, "OVERRATED?" 0.5x. Quote marks only on a line the subject actually said.
4. **Question-mark banners are a mixed bag** (FH): the loaded ones (HE'S INSANE? 101k, "TOO CLEVER?" 105k) did well; the generic ones (IMPOSSIBLE?, GENIUS OR DISASTER?) lost. Question works only when it names a specific accusation.
5. **Length**: 1-3 words won; the 4-word quote (THE SWINE ISN'T ATTACKING) landed at 1.3x. WORSE THAN STALINGRAD (3 words, big comparison) is untested (36 days, 0.7x).
6. **Subject outweighs banner**: Rommel flopped on all four channels with every banner (15k-46k) except Commanders and Tactics (244k, 513 days old); Wellington, Yamashita, MacArthur, O'Connor flopped on every wording. WWII Allied/Korea/Eastern-Front comeback or siege stories won (Ridgway, Patton, Zhukov, Guderian, Eisenhower, Slim). Same-subject A/B shows 6-7x swings (Guderian TG 113k vs WG 717k; Patton TG 954k vs WG 132k) in BOTH directions, so wording is not the sole driver (channel authority, upload date and the algorithm also differ). Do not over-read a single banner.
7. **Subtitle**: the best two TG videos use either a result "The Man Who Turned Korea Around" or nothing (Patton). Subtitles that point at an after-war fate ("Destroyed by His Own", "Why Stalin Exiled...", "The Plan They Tried to Bury") did not beat result subtitles. The one great WG subtitle states a hard fact ("Fired for Being Right").
8. **Length**: no sign that longer wins; all winners 16-21 min; the 26-27 min ones (Manstein 250k, MacArthur 31k) are mid/low.

### A6. Visual formula differences
| | TG | WG | FH |
|---|---|---|---|
| Map | full-bleed, dark, desaturated, grey/brown realistic terrain; unit diamonds; relief + fog | left 60 %, bright 3D tile blocks, burning town + smoke, place labels, flag | tilted paper war-table map with relief, red/blue blocks, white arrows |
| Portrait | right 35-40 %, photoreal, grim | right 40 %, photoreal, slightly brighter | right 35 %, photoreal, face lit |
| Badge | both commanders' portrait badges on the map | usually 1 badge | none |
| Banner | red brush, bottom-left, 1-4 words, mostly quotes | red brush, ONE WORD in quotes, huge | red brush, 2-3 words, "?" on most |
| Mood | darkest, most "documentary" | most saturated, game-like | grittier collage, snow/sparks |
Take-away for us: WG and FH use the same bones as TG (map + portrait + red banner); none of the three has a recognizable face/pose difference; the differentiator is the WORDS. Our look already matches. (Cannot verify our CTR vs these; only Morgan 4.21 % / Thomas 3.84 % known.)

## B. Per-channel scans (top 5 long videos, latest ~40 uploads; x med vs own channel median)
**Ravelin** (@ravelin.history, 31.3k subs, median 29,031, 40 vids, 24-27 min American Revolution / War of 1812, title = "How <small band> <humiliated/destroyed> Britain")
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| The Genius Trap That Destroyed A British Army (Guilford Courthouse / Greene) | 1,119,638 | 38.6 | 25:37 | 63 d |
| How America Built a Tower Overnight and Took a British Fort | 212,566 | 7.3 | 25:08 | 67 |
| How 400 Americans Annihilated Britain's Elite Hessians - Red Bank, 1777 | 165,785 | 5.7 | 24:13 | 81 |
| How One Regiment Held a Bridge Against a British Army | 160,097 | 5.5 | 25:40 | 71 |
| The Polish Colonel Who Trapped a British Army at Saratoga (Kosciuszko) | 106,693 | 3.7 | 25:27 | 36 |
Pattern: one 1M hit, the other 39 videos sit 4k-212k; "Genius Trap" is reused 3x (Washington 52k, Navy 104k) = diminishing returns. "The General Britain Whipped 499 Times - Then He Destroyed Their Army" (Greene) 51.6k.

**Commanders and Tactics** (@CommandersAndTactics, 36.7k subs, median 243,536, 9 vids; the closest format clone: "<Name>'s Top 3 Tactical Masterpieces", 11-24 min, "(No AI)" tag)
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| Napoleon's Top 3 Tactical Masterpieces | 801,459 | 3.3 | 11:08 | 396 d |
| Zhukov's Top 3 Tactical Masterpieces (No AI) | 594,910 | 2.4 | 15:45 | 324 |
| Walter Model's Top 3 Defensive Masterpieces (No AI) | 490,186 | 2.0 | 19:00 | 146 |
| Manstein's Top 3 Tactical Masterpieces (No AI) | 395,628 | 1.6 | 22:02 | 11 (36k v/d) |
| Rommel's Top 3 Tactical Masterpieces | 243,536 | 1.0 | 11:15 | 513 |
Also: Suvorov 228k (63 d), Caesar 227k, Alexander 140k, Robert E. Lee 41.7k (the only Civil War one: lowest).

**The Generals' Oath** (@TheGeneralOath, 12.4k subs, median 5,028, 36 vids, 25-49 min Grant/Lee/Civil War character essays, quote-in-caps titles)
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| What Longstreet Understood About Grant That Lee Refused to Accept Until It Was Too Late | 343,833 | 68.4 | 38:43 | 155 |
| "The Empty Chair" - What Grant Felt When Lee Walked Out of Appomattox | 295,459 | 58.8 | 31:56 | 232 |
| The MEMO That Could Have Changed The Civil War | 138,944 | 27.6 | 35:19 | 66 |
| "I TREMBLE FOR THE RESULT" - WHAT SHERMAN TOLD GRANT BEFORE VICKSBURG | 92,456 | 18.4 | 33:11 | 161 |
| What Grant Didn't Understand About George H. Thomas | 72,131 | 14.4 | 43:44 | 87 |
Note: not a battle-map channel; the draw is the Grant-vs-Lee human drama; it also did Thomas.

**Civil War Dose** (@CivilWarDose, 9.6k subs, median 6,942, 39 vids)
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| How Ulysses S. Grant Broke Lee's Army, and Why No Other Union General Could | 161,147 | 23.2 | 103:31 | 31 |
| What Happened to The Man Who Vanished After Gettysburg: Pickett | 104,769 | 15.1 | 9:53 | 41 |
| What James Longstreet Truly Thought of Robert E. Lee | 88,638 | 12.8 | 23:58 | 183 |
| The Battle Lee Should Have Won - And Why He Threw It Away | 68,994 | 9.9 | 32:52 | 180 |
| What George Pickett Truly Thought of Robert E. Lee | 63,490 | 9.2 | 28:16 | 166 |
Demand = Grant / Lee / Longstreet / Pickett (personality, "what X really thought"); not a map channel.

**Cloaked History** (@CloakedHistory1, 3.6k subs, median 377, 36 vids; high x because the median is tiny)
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| Grant Warned Us About Lee - Nobody Believed Him for 100 Years | 77,345 | 205 | 22:32 | 159 |
| The Only Civil War General Who Never Lost a Single Battle - History Never Gave Him the Glory (Thomas) | 48,912 | 130 | 15:51 | 145 |
| Joshua Chamberlain & Little Round Top - Explained Like You're 5 | 11,778 | 31 | 19:09 | 156 |
| William T. Sherman Is What Robert E. Lee WARNED Us About | 9,320 | 25 | 23:18 | 171 |
| What If Meade Had Pursued Lee After Gettysburg | 2,744 | 7.3 | 15:03 | 54 |

**War Table Atlas** (@WarTableAtlas, 371 subs, median 747; "<Name>'s 3 Greatest Moves | ..." clone, 9 vids). ONE outlier: O'Connor 74,689 (100x, 17:46, 46 d: "The Forgotten General Who Won Britain's First Victory"); the rest 150-2,219 (Model "Hitler's Fireman" 2.2k, Manteuffel 1.0k, Montgomery 771, Mannerheim 747, Rommel 621). Not a pattern, a single hit (TG's own O'Connor did only 18.8k).

**Iron Breach History** (@IronBreachHistory, 10k subs, median 180,324; only 6 long videos listed; D-Day / Normandy animated battles, 9-39 min, unit/operation focus, not single-commander)
| Title | Views | x med | Len | Age |
|---|---|---|---|---|
| D-Day's First Battle: The British Airborne's Fight for Pegasus Bridge | 460,708 | 2.6 | 29:33 | 43 |
| D-Day: The 82nd Airborne's Battle for Normandy (Animated Documentary) | 263,052 | 1.5 | 39:14 | 201 |
| The Battle of Juno Beach D-Day 1944: Canada's Longest Day | 181,711 | 1.0 | 16:10 | 70 |
| Rangers Lead the Way: Pointe du Hoc and Omaha Beach | 178,938 | 1.0 | 15:30 | 155 |
| The 101st Airborne's Assault on Carentan (Cole's Charge) | 140,014 | 0.8 | 9:16 | 131 |
Gavin/airborne, Cole, Pegasus Bridge (Maj. John Howard) are single-person stories for us.

**Handled Like Eggs** (@HandledLikeEggs, 8.3k subs; only 3 long videos, median 164k): Siegfried Muller "Fails to Save The Congo - The 2nd Battle of Boende, 1964" 172,513 (42:38, 65 d); "From German Artilleryman to Congo Mercenary" 164,361 (55:16, 287 d); "When Belgium, The Congo, and the CIA fought Cannibals in the Jungle - The 1st Battle of Boende" 158,001 (48:31, 195 d). 40-55 min long-form, niche (Congo 1964).

**Kings and Generals** (@KingsandGenerals, 4.22M subs, median 205,214 over 93; NOT a single-commander channel; single-commander videos only): Skanderbeg's 25-Year War Against the Ottomans - All Battles EXPLAINED 440,250 (2.15x, 61:17, 33 d); Nader Shah: The Napoleon of Iran - How One General Rebuilt the Empire 242,150 (1.18x, 106:51, 75 d); Nader Shah vs. the Ottomans 231,334 (1.13x, 18:25, 227 d); Cyrus the Great 54,767 (0.27x). Channel top is multi-hour war documentaries (War of the Spanish Succession 990k, 290 min), so not comparable.

**Footprints in History**: see A3. **Own channel** ("Generals On The Map" @GeneralsOnTheMap, 838 subs, 7 long videos listed): Thomas 121,557 (46x its median, 18:50, 28 d); Morgan 41,779; 2 Para/Goose Green 38,401; Greene 2,640; O.P. Smith 2,200; Gavin 641; Collins 1. Our other 8 videos are not in that scan (Rokossovsky, Peng, Jackson, Meade, Sherman, Cleburne, Hannibal, Belisarius): the owner must supply them.

## C. MASTER TOP-VIDEO TABLE (commander/topic; channel; their title; views; x med; age; length; why it worked [inference]; ours?)
"OURS" = one of our 15 (excluded from the next pick, shown for reference/overlap). "2+" = commander appears on 2+ channels (names in brackets). Age in days.
| # | Commander / topic | Channel | Title | Views | x med | Age | Len | Why it likely worked | Ours? / 2+ |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ridgway (Korea) | Tactical Genius | Matthew Ridgway's Top 3 Legendary Tactical Moves \| The Man Who Turned Korea Around | 1,363,832 | 15.5 | 59 | 18:59 | Korea comeback, LET THEM COME defiance, result in subtitle | No. 2+ (TG 1.36M, FH 32k) |
| 2 | Greene / Guilford (AWI) | Ravelin | The Genius Trap That Destroyed A British Army | 1,119,638 | 38.6 | 63 | 25:37 | "lose a battle, win the war" paradox + "Genius Trap" mechanism hook | OURS (Greene). 2+ (Ravelin x several, Generals On The Map) |
| 3 | Patton (Bulge) | Tactical Genius | Patton's Top 3 Legendary Tactical Moves | 953,823 | 10.9 | 94 | 16:53 | "AMATEURS" contempt quote, most famous US general, Bulge relief | No. 2+ (TG 954k, WG 132k) |
| 4 | Napoleon | Commanders and Tactics | Napoleon's Top 3 Tactical Masterpieces | 801,459 | 3.3 | 396 | 11:08 | Biggest name; evergreen (12-month cume), short | No |
| 5 | Zhukov (Moscow) | Tactical Genius | Zhukov's Top 3 Legendary Tactical Moves \| The Man Who Broke Hitler | 744,454 | 8.5 | 71 | 16:38 | AT THE GATES: Moscow at stake; Eastern-Front result subtitle | No. 2+ (TG 744k, C&T 595k, WG 21k, FH 19k) |
| 6 | Guderian | Warfare Genius | Heinz Guderian's Top 3 Legendary Tactical Moves \| Fired for Being Right | 717,105 | 20.4 | 34 | 19:21 | "PUNISHED"/"Fired for Being Right" injustice; Sedan/Blitz; fast growth 21k v/d | No. 2+ (WG 717k, TG 113k) |
| 7 | Zhukov | Commanders and Tactics | Zhukov's Top 3 Tactical Masterpieces (No AI) | 594,910 | 2.4 | 324 | 15:45 | Eastern Front, "No AI" claim | No (see 5) |
| 8 | Walter Model | Commanders and Tactics | Walter Model's Top 3 Defensive Masterpieces (No AI) | 490,186 | 2.0 | 146 | 19:00 | Defensive "firefighter" angle, fresh name vs the Zhukov/Manstein crowd | No. 2+ (C&T 490k, WAT 2.2k) |
| 9 | Skanderbeg | Kings and Generals | Skanderbeg's 25-Year War Against the Ottomans - All Battles EXPLAINED | 440,250 | 2.15 | 33 | 61:17 | Underdog vs Ottomans, huge channel | No (K&G only) |
| 10 | Manstein | Commanders and Tactics | Manstein's Top 3 Tactical Masterpieces (No AI) | 395,628 | 1.6 | 11 | 22:02 | Still accelerating (36k v/d) | No. 2+ (C&T 396k, TG 251k, FH 105k, WG 35k) |
| 11 | Longstreet / Grant vs Lee | The Generals' Oath | What Longstreet Understood About Grant That Lee Refused to Accept Until It Was Too Late | 343,833 | 68.4 | 155 | 38:43 | Civil War insider drama, "the one who was right" angle | No. 2+ (Oath 344k, CWD 89k) |
| 12 | Eisenhower | Warfare Genius | Eisenhower's Top 3 Genius Moves \| The General Who Never Saw Combat | 294,518 | 8.4 | 25 | 18:41 | "HOPELESS" Overlord stakes + myth-busting subtitle | No |
| 13 | Grant (Appomattox) | The Generals' Oath | "The Empty Chair" - What Grant Felt When Lee Walked Out of Appomattox | 295,459 | 58.8 | 232 | 31:56 | Emotional scene | No. 2+ (Oath, CWD 161k, Cloaked 77k, FH 39k) |
| 14 | Manstein | Tactical Genius | Manstein's Top 3 ... \| The Man Who Broke France | 250,587 | 2.9 | 55 | 26:10 | "IMPASSABLE" belief | No (see 10) |
| 15 | Rommel | Commanders and Tactics | Rommel's Top 3 Tactical Masterpieces | 243,536 | 1.0 | 513 | 11:15 | Name recognition, old (513 d) | No. 2+ (C&T 244k, WG 46k, TG 26k, FH 15k) |
| 16 | Nader Shah | Kings and Generals | Nader Shah: The Napoleon of Iran - How One General Rebuilt the Empire | 242,150 | 1.2 | 75 | 106:51 | "Napoleon of X" tag + K&G reach | No |
| 17 | Suvorov | Commanders and Tactics | Suvorov's Top 3 Tactical Masterpieces | 228,450 | 0.9 | 63 | 23:53 | "Never lost a battle" Russian | No |
| 18 | Slim | Tactical Genius | William Slim's Top 3 Tactical Moves \| The General Better Than Montgomery | 222,662 | 2.5 | 43 | 17:28 | Rivalry ranking, LET THEM GO HUNGRY | No |
| 19 | Fort Watson / Mayham tower (AWI) | Ravelin | How America Built a Tower Overnight and Took a British Fort | 212,566 | 7.3 | 67 | 25:08 | Gadget/engineering hook ("overnight") | No (Marion/Lee story; topic inferred from the title) |
| 20 | Caesar | Commanders and Tactics | Caesar's Top 3 Tactical Masterpieces | 227,179 | 0.9 | 258 | 19:28 | Name | No |
| 21 | Red Bank 1777 (Christopher Greene) | Ravelin | How 400 Americans Annihilated Britain's Elite Hessians - Red Bank, 1777 | 165,785 | 5.7 | 81 | 24:13 | David v Goliath numbers | No |
| 22 | Grant (overall) | Civil War Dose | How Ulysses S. Grant Broke Lee's Army, and Why No Other Union General Could | 161,147 | 23.2 | 31 | 103:31 | Grant rank-ordering, 100-minute | No (Grant on 4 channels) |
| 23 | Kosciuszko (Saratoga) | Ravelin | The Polish Colonel Who Trapped a British Army at Saratoga | 106,693 | 3.7 | 36 | 25:27 | Foreign-born hero angle | No |
| 24 | Chesty Puller | Footprints in History | Chesty Puller's Top 3 Legendary Tactical Moves \| The Most Decorated Marine in History | 128,077 | 5.8 | 22 | 22:54 | HE NEVER RETREATED; Marines are a strong niche | No (FH only; Chosin overlap with Smith) |
| 25 | Patton | Warfare Genius | George S. Patton's Top 3 Legendary Tactical Moves | 131,951 | 3.8 | 31 | 20:36 | Name; "A DECOY" | No (see 3) |
| 26 | Manstein | Footprints in History | 3 Moves That Saved Hitler's Army  Then Hitler Fired Him | 105,465 | 4.8 | 20 | 24:26 | "Fired by Hitler" outcome-first title | No (see 10) |
| 27 | Sherman | Footprints in History | William T. Sherman's Top 3 Legendary Tactical Moves - He Cut Himself Off From Supply and Won the War | 101,154 | 4.6 | 12 | 23:02 | HE'S INSANE? + supply gamble hook | OURS (Sherman). 2+ |
| 28 | Thomas | Generals On The Map (ours) | George Thomas's Top 3 Legendary Tactical Moves \| The Man Who Saved the Union Army | 121,557 | 46 | 28 | 18:50 | Own result, TG-style title | OURS. 2+ (Cloaked 49k, Oath 72k) |
| 29 | Pegasus Bridge (Maj. Howard) | Iron Breach History | D-Day's First Battle \| The British Airborne's Fight for Pegasus Bridge | 460,708 | 2.6 | 43 | 29:33 | D-Day brand + first-hour hook | No (Gavin-adjacent airborne) |
| 30 | Pickett | Civil War Dose | What Happened to The Man Who Vanished After Gettysburg: Pickett | 104,769 | 15.1 | 41 | 9:53 | Mystery question | No |
| 31 | Thomas (never lost) | Cloaked History | The Only Civil War General Who Never Lost a Single Battle - History Never Gave Him the Glory | 48,912 | 130 | 145 | 15:51 | "Never lost a battle" trope | OURS (Thomas) |
| 32 | O'Connor | War Table Atlas | Richard O'Connor's 3 Greatest Moves \| The Forgotten General Who Won Britain's First Victory | 74,689 | 100 | 46 | 17:46 | Single outlier on a 371-sub channel | No. 2+ (TG 18.8k) |
| 33 | Daniel Morgan | Generals On The Map (ours) | Daniel Morgan's Top 3 ... \| The Man Who Destroyed Britain's Elite in 1 Hour | 41,779 | 15.8 | 9 | 17:39 | Own | OURS |
| 34 | 2 Para / Goose Green | Generals On The Map (ours) | 2 Para's Top 3 Legendary Tactical Moves \| The Bluff That Won the Falklands' First Land Battle | 38,401 | 14.6 | 13 | 17:08 | Own | OURS. External: Simple History "Battle of Goose Green" 1.9M, Element 18 "Fix Bayonets" 1.29M (search view counts, not scanned) |
| 35 | Grant | Footprints in History | Ulysses S. Grant's Top 3 Legendary Tactical Moves \| The "Drunk" Who Won the Civil War | 38,849 | 1.8 | 17 | 24:22 | "Drunk" myth | No |
| 36 | Robert E. Lee | Commanders and Tactics | Robert E. Lee's Top 3 Tactical Masterpieces | 41,750 | 0.17 | 198 | 20:37 | Flop on a Civil-War-free channel (evidence Lee alone doesn't pull) | No |
| 37 | Montgomery | Tactical Genius | ... \| The Victor of El Alamein | 113,546 | 1.3 | 100 | 15:10 | Average | No. 2+ |
| 38 | Muller (Congo 1964) | Handled Like Eggs | Siegfried Müller Fails to Save The Congo - The 2nd Battle of Boende, 1964 | 172,513 | 1.05 | 65 | 42:38 | Niche; Cold-War mercenary | No |
| 39 | Longstreet | Civil War Dose | What James Longstreet Truly Thought of Robert E. Lee | 88,638 | 12.8 | 183 | 23:58 | "what he truly thought" | No (see 11) |
Appended TG/WG flops (so the table shows both ends): Wellington 7.7k, Yamashita 6.5k (TG); Washington 10.7k, Montgomery 16.7k (WG); Smedley Butler 7.1k, Nelson 8.1k (FH). Napoleonic, Pacific/Japan and Revolution-War-for-another-channel are weakest.

### C1. Commanders on 2+ channels (competitor interest, excluding our own 15 for the pick)
Zhukov (TG 744k, C&T 595k, WG 21k, FH 19k) | Manstein (C&T 396k, TG 251k, FH 105k, WG 35k) | Patton (TG 954k, WG 132k) | Guderian (WG 717k, TG 113k) | Rommel (C&T 244k, WG 46k, TG 26k, FH 15k, WAT 621) | Ridgway (TG 1.36M, FH 32k) | Montgomery (TG 114k, WG 17k, WAT 771) | Bradley (TG 63k, WG 20k) | MacArthur (TG 31k, FH 5.6k) | Grant (FH 39k, Oath, CWD 161k, Cloaked 77k) | Longstreet (Oath 344k, CWD 89k) | O'Connor (TG 18.8k, WAT 75k) | Model (C&T 490k, WAT 2.2k) | Yamashita (TG 6.5k, WAT 153) | Washington (WG 10.7k, Ravelin many). Our own that were also done elsewhere: Greene (Ravelin 1.12M), Sherman (FH 101k, Cloaked, Oath), Rokossovsky (FH 22k), Thomas (Cloaked 49k, Oath 72k), Morgan (Ravelin/other), Goose Green (Simple History, Element 18). Single-channel but high: Chesty Puller (FH 128k), Skanderbeg (K&G 440k), Nader Shah (K&G 242k), Suvorov (C&T 228k), Napoleon (C&T 801k), Caesar, Alexander, Kosciuszko (Ravelin 107k), Pickett (CWD 105k), Slim (TG 223k), Eisenhower (WG 295k).

### C2. Whose story is easy to SHOW (our owner constraint), from these hits only (my read)
Strong: Ridgway-type (a siege + a counterattack), Slim (Imphal), Model (pocket + river lines), Suvorov (Alps/Italian campaign), Chesty Puller (Chosin overlaps our Smith; Guadalcanal/Peleliu maps), Pegasus Bridge/Howard (one night, one bridge, one map). Weak: Eisenhower (staff, no maps), Lee-only, character-essay topics (Longstreet/Pickett/Grant "what he thought"), Congo.

## D. Gaps and data limits (honest)
- yt-dlp only: no impressions, CTR or retention for anyone; no vidIQ. Views are cumulative, so videos of different age are not comparable: use v/d. x-median is by each channel's own scan, not equal across channels (tiny channels like Cloaked 377 and WAT 747 give silly x of 100-205).
- Scan windows: latest ~40 uploads per channel (K&G 100). Ravelin has 63+ videos (scan got 40); Iron Breach 6 and Handled Like Eggs 3 long videos listed. "sort by popular" was not used, so a channel's old mega-hit outside the window would be missed.
- Tactical Genius scan lists 12 videos; Zhukov (BvJN3pyPL6E) failed in the scan and was fetched manually (744,454 views). I used the 12-video median (87,944), so x for Zhukov (8.5) is not strictly comparable. Rommel, Slim etc. ages changed vs older notes (Ridgway 986k -> 1.36M).
- Thumbnails: Seen: WG 9, TG 13, FH 13 (contact sheets, full-width views not opened one by one). NOT seen: Ravelin, C&T, Oath, CWD, Cloaked, WAT, Iron Breach, HLE, K&G (only titles/views). So banner-wording evidence = only 3 channels (35 thumbnails, tiny sample; one cell per subject).
- Channel names/handles: found Cloaked History (@CloakedHistory1) and The Generals' Oath (@TheGeneralOath) by yt-dlp search; "Real History" (Goose Green 9.8x, NICHE_ANALYSIS) and "Historical Club" (80 Samurai 207k) not scanned. Others that surfaced and not scanned: The Staff Genius (@TheStaffMap, "3 Greatest Tactical Moves" clone, tiny views: Jackson 13.8k, Ridgway 463, Grant 12), Tactical Minds, Map of War, History Gone Wilder (Cowpens 228k), Epic History. Kosciuszko/"tower" topic names in Ravelin rows are inferred from titles.
- Own-channel scan (@GeneralsOnTheMap) lists only 7 of our 15 (14-19 min). The earlier-recorded Morgan CTR 4.21 % and Thomas 3.84 % are the only analytics: we still have no read on our other videos.
- "Why it worked" is inference from title/thumbnail/era. The same banner flopped or won depending on the subject, so treat wording rules as tie-breakers behind subject choice.
