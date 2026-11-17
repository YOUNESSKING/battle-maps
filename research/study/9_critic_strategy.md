# 9. Critic of the strategy studies 7 (channel lifecycle) and 8 (Grand Maneuver pivot), 2026-11-17

**Verdict: keep the channel and the format, but stop relying on the format alone. Do not make a full 3D pivot. Publish the finished Civil War backlog now, about every 5 days. Add one single-campaign film every ~2 weeks, built as a *hybrid*: Style W 2D for most of the film, with 3D only for the hook dive and one or two set pieces. The first film is Vicksburg, 1-17 May 1863. The second is Trenton-Princeton, published before 26 December.**

Both studies are careful, and almost every number I checked is right. Their weak points are:
- **Study 7:** the inference behind its cadence finding, and the cadence rule it then writes, which contradicts that finding.
- **Study 8:** its feasibility arithmetic.

Sources:
- Study 7 is on `claude/lifecycle-study`, with `lifecycle/summary.json`, `tables.md` and `analyze_output.txt`.
- Study 8 and `gm_channel/gm_vidiq_2026-11-17.json` are on the same branch, in commit 984b8b9. `claude/gm-channel-study` still points at main.
- I also used `research/style_tests/gm3d/*/README.md`, HANDOVER, CHANNEL_LOG, DATA_RULES, `4_meta`, `5_next_pick` and `6_critic`.
- **vidIQ credits used: 5** (one `get_videos_by_ids` call on 10 videos). I made no yt-dlp calls and did not try to get around YouTube's bot check.

## 1. Data spot-checks (14)
| # | Claim | Check | Verdict |
|---|---|---|---|
| 1 | GM Six Days 109,228 views, 20:38, "AI narration" | vidIQ today: 109,228, PT20M38S, and the description says "AI narration." | OK |
| 2 | GM Italy 1796: 2,298 views, 287 vph, breakout 4.56 | vidIQ: 2,298, vph 287.25, outlier score 4.56 | OK |
| 3 | GM median 16,731 | Median of the 6 views = (15,093 + 18,368) / 2 = 16,730.5 | OK |
| 4 | GM 33,814 views/day and 283 subs/day on 8 Nov; 8,300-9,300 views/day on 15-17 Nov | `daily`: 58,061 - 24,247 = 33,814; 585 - 302 = 283; 8,480 / 8,293 / 9,317 | OK |
| 5 | GM "raised floor about 9x the pre-hit level" | 9x is measured against October (~285/day). Against the week just before the hit (1-6 Nov, ~2,200-4,400/day, already lifted by Berezina), it is **~2.5-3x** | **Overstated** |
| 6 | Our Grant 8,516; Cleburne 4,049 | vidIQ: 8,516 and 4,052 (Grant's outlier score 8.7, Cleburne's 4.2) | OK |
| 7 | FH Jackson 1,556 (11 Nov) | vidIQ: 1,552, published 2026-11-11 | OK |
| 8 | C&T Manstein 538,210 | vidIQ: 538,412, with 222 vph still today | OK |
| 9 | TG Rokossovsky 2,819 | vidIQ: 2,819 | OK |
| 10 | FH "Grant and Sherman" (non-format) 4,615; "The Bridge Was Rigged" 82 | vidIQ: 4,615; 82. The second has since been retitled "The Bridge Was Supposed to Explode. It Didn't" | OK |
| 11 | Late/early ratio: ≤4-day posters 0.27, ≥6-day posters 1.49 | Recomputed from `lifecycle`. The ≤4-day group has 8 channels with a median of 0.268. The ≥6-day group is **n = 3** (TG 0.72, C&T 1.97, IBH 1.49), median 1.49 | Arithmetic OK, sample tiny (section 2) |
| 12 | Same-age format drop 22,081 → 456 (~48x) | `same_age_summary` agrees. But **8 of the 18 November videos are War Table Atlas**, a channel that never took off (median 312), and only 3 of the 20 October videos are. Without WTA, the medians are **22,242 (n=17) → 1,202 (n=10), about 18x** | **Inflated by composition** |
| 13 | Format uploads went 8 → 37 → 21 per month | `supply_format_titles_by_month` agrees. These are the 6 scanned channels only, so the real supply is higher, not lower | OK |
| 14 | Repeat generals beat first-time generals in October (20,983 vs 7,973) | `repeat_stats` agrees | OK, but confounded: the repeats are famous names (Rommel, Patton, Zhukov) |

## 2. Study 7: logic, bias and the cadence contradiction
**The cadence finding does not hold.**
- The "survivor" group (≥6 days between uploads) is 3 channels.
- One of them, Tactical Genius, is the format's clearest death: Rokossovsky got 2,819 views after the pause. It only counts as a survivor because its "late third" is Sep videos.
- The other two, C&T and IBH, have their *entire* late third before 20 Oct (their last uploads were 19 Oct and 17 Sep). So the ≥6-day group was never measured in November, when the format crashed, and the ≤4-day group was.
- **Cadence is confounded with the calendar.** It is also confounded with launch date (the three sharp-decay channels all launched 24 Sep-10 Oct) and with budget and length (IBH and HLE run 30-55 min films).
- Fast posters can be healthy. Ravelin posts every 2 days and has the best small-channel record (31 hits). Kings and Generals posts every 2 days with a late/early ratio of 2.92.
- So the data does not say "post less". At most it says "a flood of near-identical videos from one channel does not help".

**The rule contradicts its own evidence.** Rule 3 says "upload every 3-5 days at most", and cites the ≥6-day group as support. Rule 4 says never go silent for 10 days or more after a hit. The defensible version is what the data actually shows:
- Consecutive uploads barely track each other (Spearman 0.09).
- A hit buys about a week of momentum: the next upload does 1.5-1.7x the channel median within 9 days, and 0.57x after 10 days or more (but that last figure is n = 6).

So: **post when a video is ready and meets the DATA_RULES bar, normally every 4-6 days. Always hold one finished video in reserve so that it can go out within 4 days of any upload that takes off.** Cadence is a constraint we set from production, not a growth lever.

**Survivorship and selection.**
- Every channel in study 7 was found because it had a hit. Study 7 says so.
- Study 8's niche channels came largely from vidIQ *outlier* searches, which are biased toward breakouts in the same way.
- Study 8 does list failures: Ruse & Ruin (median 259), Vellum Atlas (33 subs), Europe in the age of gunpowder (median 1,800). For every GM, there are visible channels doing the same thing that did not break out. The real base rate for "new 3D campaign channel gets a 100k video" is unknown, and probably low.

**What study 7 gets right, and what matters most.**
- The format's November collapse is real, even after the WTA correction: about 18x for the format, against about 3x for the control channels (Ravelin and TGO, within the same channel).
- Repeating a general is not the problem.
- **Inside the dead month, our Civil War videos are the format's best:** Grant has an outlier score of 8.7 and Cleburne 4.2, while Patton got 247, Arnold 486 and Yorktown 373.
- So the era signal is stronger than the format signal. Study 7 says this in its section 4, but none of its rules builds on it.

**The kill-switch test in rule 7 is too strict.** It asks for story videos to beat the format by 3x on two metrics, on n = 3 vs 3. A single breakout would decide it either way. Use DATA_RULES instead: compare day 1-3 watch time per Browse impression and Suggested CTR. If 2 of the 3 story or campaign films beat the median of the format videos published in the same window, make campaign films the main series.

## 3. Study 8: logic and feasibility
**Mostly right. No full pivot, for the reasons it gives:**
- The evidence is n = 1 hit.
- Napoleon is crowded.
- The era carries over to a new format, but a new style does not carry the era's audience with it.

**Points it under-weights:**
1. **GM's pipeline is not ours.** GM ships every 6.4 days with AI narration and an OSM, WorldCover and AWS-terrain data pipeline. Probably GPU-rendered, but that is not verified.
   - **Our renderer is software WebGL (SwiftShader) on 4 shared CPU cores.**
   - The gm3d READMEs measure 0.56 s/frame on a quiet machine (about 17 min of render per video minute at 30 fps) and 2.7 s/frame under load (about 80 min per minute). The owner's "1 h per minute" is the loaded case.
   - The machine also **pauses when the session is idle and reboots every 30-60 min** (HANDOVER: Marion, Patton). So 19 h of 3D render means 4-6 supervised sessions spread over several days, and the format videos need the same 4 cores at the same time.
   - The 66 s Big Black River test needed v3-v8 rounds of critics over about 3 days, and **every new campaign needs a new world.**
   - Conclusion: **a full-3D 19-min film every 2 weeks, next to format production, is not feasible.** A hybrid is.
2. **The hybrid fixes this.**
   - Use 3D only for (a) the hook (one continuous cloud dive onto the place, which is also what our hook lock asks for) and (b) one or two set-piece battles. That is about 3-5 min of 3D, or about 3-5 h of render.
   - Use Style W 2D for the rest, at our measured 2D cost: about 2-4 h for a 16-19 min video (Meade 2.6 h, Grant ~2.5 h, Marion ~2 h).
   - Total: about 6-9 h of render per film, which fits a 2-week slot alongside one or two format videos.
   - The look mostly comes from the campaign structure, the titles and the narration: GM's two "Masterpiece: N battles in N days" titles beat its two paradox titles.
3. **"No AI" risk is real but small.**
   - GM itself credits "AI narration" and still got 109k.
   - C&T's "(No AI)" tag shows that some viewers do care.
   - Our voice A is a converted TTS voice. Keep the descriptions honest, never claim "No AI", and never use AI images presented as period photos (our archive is real Library of Congress material, which is an advantage to state).
4. **Vicksburg overlap.**
   - Our Grant (9 Nov) already spends move 2, about 6 minutes, on Vicksburg.
   - 4_meta says "Never open a video on a battle a recent upload already used". Grant opens on Fort Donelson, so a Vicksburg film does not break that rule. It is still a re-tell for the people who watched Grant.
   - It is still the right first film, because it is the **cheapest**: the `vicksburg`, `grandgulf` and `mississippi` maps, the Style W reference scene for 17 May 1863 and the 3D Big Black River world all exist. Grant's sidebar is warm, and demand is proven (Warhawk 159k, Biography 387k, Context 106k).
   - Tell it day by day, from the crossing at Bruinsburg to Big Black River, with eyewitnesses and at least 70 % new material compared with Grant's move 2.
5. **Seasonality, which study 8 missed: Trenton.**
   - Trenton and Princeton (25 Dec 1776 to 3 Jan 1777) have a natural anniversary push.
   - Epic History's video on it has 500k, and nobody does it in a GM-style campaign film.
   - Make it the second film and **publish it on 19-22 Dec**. Saratoga (Ravelin 365k) moves to January.

## 4. The backlog: what can actually go out
Sources: HANDOVER "Videos done", `5_next_pick`, `6_critic`.
| Video | Status | Era | Use |
|---|---|---|---|
| Sherman #13 | Finished, voice A, 15:45 | Civil War | **Next upload.** FH's Sherman is a month old (the 14-day rule is clear). Grant's own lieutenant, so it rides Grant's sidebar (6_critic agrees) |
| Jackson #11 | Finished, 17:05, stakes-hook v2 | Civil War | Upload 2, **not before 25 Nov**: FH posted Jackson on 11 Nov (study 7 rule 5, 14 days) |
| Meade #12 | Finished, 16:26 | Civil War | Upload 4. Gettysburg is crowded this month (CWD, FH Chamberlain, Before the Order's Meade on 10 Nov), so December is better |
| Peng #10 | Finished, 16:48 | Korea | Reserve. Only behind a hot upload (DATA_RULES 1) |
| Rokossovsky #8 | Finished (it is the reference video) | WWII East | Reserve. Warning sign: TG's Rokossovsky got 2,819 |
| Belisarius | Finished, early look | Byzantine | Reserve. It is an untested era |
| Hannibal | **Not finished:** a 6-min test (hook + move 1) only | Ancient | Not publishable |

Caveat for the owner:
- Sherman, Jackson and Meade are in the older locked look (Rokossovsky / Frontlines). Cleburne and Grant were restyled into Style W before they went out.
- I recommend publishing these three **as they are**. Thomas and Morgan were hits in the older look, and nothing in the data ties views to Style W.
- A restyle costs about 2.5 h of render plus scene work per video, and would delay the momentum window. **The owner must OK this.**

## 5. Corrected, combined recommendation
1. **Keep the channel, the eras and the format as a series. No full pivot. Add campaign films.** Civil War and Revolution only, as both studies say. The 4_meta rule of at most 2 Civil War uploads in any 4 cannot hold while the whole finished backlog is Civil War and the Revolution has no finished video. Relax it to "never 3 *format* Civil War videos in a row". The packages differ, and that is what matters for the sidebar.
2. **Cadence:** about every 5 days, set by what is ready, not by a target. Keep one finished video in reserve so that one can go out within 4 days of any upload that takes off. Never let the schedule push out a video below the DATA_RULES bar.
3. **Campaign films:** one every ~2 weeks, hybrid 2D Style W plus 3D for the hook dive and one or two set pieces, 18-20 min. Use GM's proven title shape (count + time + place). Each film opens on the stakes of the campaign (our hook lock) and ends by setting up the next film.
4. **Publish order for the next 6** (Marion went out today, 17 Nov):
   | # | Date (approx.) | Video | Type |
   |---|---|---|---|
   | 1 | 21-22 Nov | **Sherman** (Test & Compare a story title against the format title, e.g. "\| The March That Broke the Confederacy") | format, finished |
   | 2 | 26-27 Nov | **Jackson** | format, finished |
   | 3 | 2-4 Dec | **"Grant's Masterpiece: 5 Battles in 18 Days \| Mississippi 1863"** (Vicksburg) | campaign film #1 (new, hybrid) |
   | 4 | 8-10 Dec | **Meade**. If 1-3 were hot, Peng instead, and Meade moves to #6 | format, finished |
   | 5 | 19-22 Dec | **"10 Days That Saved the Revolution \| Trenton & Princeton 1776"** | campaign film #2 (new, hybrid, anniversary) |
   | 6 | late Dec / early Jan | A new format video: Puller per 6_critic, if the format is still alive by the numbers; otherwise campaign film #3, **Saratoga 1777** | depends on the gate |
5. **Gate, after #5:** compare #3 and #5 with #1, #2 and #4 on day 1-3 watch time per Browse impression and Suggested CTR (the standard Studio prompt, logged in CHANNEL_LOG). If both films win, campaign films become the main series every ~10-14 days, with format videos only for very famous names. If both lose, drop the 3D work and keep 2D story titles only.
6. **The 3D investment stays capped.** Make no full-3D film until a hybrid film has earned at least the format median at the same age. Before scaling up, measure the 3D render of the first film on a quiet machine. A GPU renderer would change this whole calculation, and is worth asking about.
7. **Do today:** log Studio day 1-3 numbers for Grant, Cleburne, Yorktown and Marion. Fix the three titles that are missing a space (6_critic). Rerun `analyze.py` around 1 Dec, excluding WTA as well as including it.
