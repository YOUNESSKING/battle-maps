# Generals On The Map: per-video log (YouTube Studio numbers, read 2026-10-31)
Source: owner's Studio screens + Studio AI answers + screen recording of 2026-10-31. Retention at 0:30/1:00 is interpolated by Studio between data points (approx). Add one row per upload; check day 1-3 impressions on each upload.

| Video | Published | Subscribers that day | Impr. day 1 / 2 / 3 / 4 / 5 | Views | Impressions | CTR | Avg % viewed | Retention 0:30 / 1:00 | Subs gained | Opening style |
|---|---|---|---|---|---|---|---|---|---|---|
| Thomas | Oct 2 | ~16 or fewer (Oct 10: 16) | 38 / 638 / 73 / 13 / 4 | 123,309 | 703,265 | 3.85% (0.9% in first days, retitled ~Oct 5) | 35.6% | n/a | +536 | date + place, then a disaster |
| Smith | Oct 10 | 16 | 641 / 199 / 30 / 51 / 872 | 2,213 | 12,656 | 4.73% | 41.2% | n/a | +10 | not checked |
| 2 Para | Oct 17 | 256 | 1,008 / 13,176 / 41,806 / 27,708 / 13,675 | 39,136 | 180,068 | 4.55% | 23.1% | ~65.5% / ~30.4% | +43 | odds + "the enemy knew" |
| Morgan | Oct 21 | 478 | 9,700 / 13,430 / 33,515 / 35,230 / 29,063 | 44,921 | 240,529 | 4.06% | 33.8% | ~68.0% / ~45.5% | +169 | stakes of the war, then background |
| Gavin | Oct 26 | 732 | 1,971 / 1,103 / 209 / 205 / 226 | 669 | 3,720 | 3.90% | 25.9% | ~51.6% / ~31.9% | +1 | numbers and details (number-first) |
| Greene | Oct 28 | 795 | 8,217 / 4,711 / 5,076 / 416 (partial) | 3,351 | 18,225 | 3.77% | 31.8% | ~63.9% / ~39.3% | +7 | stakes first |
| Collins | Oct 30 | 848 | not yet | 518 | 2,402 | 4.20% | 22.8% | n/a | n/a | numbers (old-hook control) |

Traffic: 81-95% of views come from YouTube Home for every video except Smith (53% Home, 34% Up next). End screens: negligible (Morgan 4 views; channel end-screen click rate 0.6%).
What we have ruled out as the single cause: click-through (3.8-4.7% everywhere), retention depth (2 Para = Gavin at 1:00), subscriber count at launch (Gavin 732 vs 2 Para 256), the 2-day upload gap (Greene held ~5k/day when Collins launched on Oct 30).
Open question: what triggers YouTube to expand a video on day 2-3 (Morgan, 2 Para) versus cutting it (Gavin) or holding it flat (Greene).

## Added 2026-10-31 (Studio AI answers)
- Views by subscription status since publish: Greene 3,229 not subscribed (95.7%) / 144 subscribed (4.3%), total 3,373. Morgan 44,630 (99.1%) / 414 (0.9%), total 45,044. Both videos reached almost only strangers; the difference is how many (3.2k vs 44.6k), not the share.
- Greene impressions: day 1 8,217 / day 2 4,711 / day 3 5,076 / day 4 416 (partial). Smith: 641 / 199 / 30 / 51 / 872. Thomas: 38 / 638 / 73 / 13 / 4 (dead for 5 days, then took off after the retitle).
- "Viewers also watch" is not available per video (Studio: not enough eligible audience data). Channel-level, Studio AI lists channels the audience watches: Footprints in History (2.5k), Warhawk (51.8k), Battle Logic (5.5k), Unearthed History Journal (5.9k), Civil War Dose (9.6k), Life on the Civil War Research Trail (50k), Ravelin (31.3k), The Generals' Oath (12.4k), The History Guy (1.65M), The Tank Museum (1.41M). Topics watched: Korean War and Pacific Marine battles (e.g. Chipyong-ni, "700 Marines waiting in the jungle"), commander profiles (Puller, Ridgway, Grant, Sherman), tactics/unit mechanics. Channel-level, so it is dominated by the hit videos' viewers.
- Still unanswered: viewers' active hours vs our publish times; which traffic source dropped for Gavin on Oct 28; Greene day 4-5 and Collins daily impressions; Collins retention.
- Publish times (UTC): Thomas Fri Oct 2 21:09, Smith Sat Oct 10 21:26, 2 Para Sat Oct 17 20:32, Morgan Wed Oct 21 19:56, Gavin Mon Oct 26 21:46, Greene Wed Oct 28 14:44, Collins Fri Oct 30 20:15. Audience peak: 21:00-02:00 UTC (US evening), quiet 07:00-11:00 UTC. Hits and flops uploaded at the same hours, so time of day is ruled out. Greene (the only afternoon upload) still had the second-best day 1.
- Gavin impressions by source (Oct 26 / 27 / 28): Browse 1,738 / 848 / 72; Suggested 184 / 170 / 33; Search 16 / 28 / 8; Channel pages 33 / 57 / 96; total 1,971 / 1,103 / 209. Browse (Home + subscription feeds) is 87% of the Oct 27 -> 28 drop. The Browse collapse fell on the same calendar day Greene was published.
- Ordering by retention at 0:30 (Studio, interpolated) vs day-3 impressions: Morgan ~68.0% -> 33,515 (expanded); 2 Para ~65.5% -> 41,806 (expanded); Greene ~63.9% -> 5,076 (held flat); Gavin ~51.6% -> 209 (cut). n=4; Smith, Thomas and Collins not yet checked at 0:30. Hypothesis only: below ~55-60% at 0:30 a video may be cut on day 2-3.
- Retention read from the screen-recording graphs by pixel measurement (method checked on 4 videos with Studio's exact values: within ~2 points; script research/tools/retention_from_frames.py): Smith ~69% at 0:30 / ~57% at 1:00; Thomas ~70% / ~50%. With the Studio values: every video that held or expanded had >= ~64% at 0:30 (Morgan 68, 2 Para 65.5, Greene 63.9); Gavin 51.6% was cut. Not sufficient: Thomas (CTR 0.9% until retitled) and Smith (best click-through and 1:00 retention, still no expansion; 16 subscribers on upload day) had high retention and no reach. Hypothesis: 0:30 retention is necessary, not sufficient. Test: a remade Gavin opening should reach >= ~64% at 0:30.

## Studio AI answer 2026-10-31 (evening): "why views stalled around 500"
- Avg view duration: Morgan 6:22 (36.1%), Greene 4:46 (32.3%), Gavin 3:19 (23.7%), Collins 3:04 (22.7%); CTR 4.0-4.2% on all.
- Gavin + Collins: retention falls from ~93% to ~34-36% by 0:42; after 1:00 the remaining ~20-25% stay to the end (the body is fine, the opening loses them). First Collins early-retention number we have.
- Studio AI advice: intro 20-25 s max, name + move 1 by 0:25; consequence titles; map early.
- Our check against the scripts' timings (timing.json): the videos that WORKED did NOT get to the man or move 1 fast. They told ONE continuous crisis story first and brought the hero in as its turn:
  Thomas (123k): battle disaster 0:00-0:47, "But one general does not leave the field" at 0:47. Morgan: war being lost -> villain Tarleton -> his defeat, man named at 1:20, move 1 at 2:20. Greene: named at 0:59. 2 Para: named at 1:42. Smith (69% at 0:30): numbers, then the trap story, named at 0:56.
  The two that FAILED left the story at ~0:25 for a CV: Gavin "He was an orphan..." at 0:26, name at 0:38, birth/orphanage at 0:52; Collins name + nickname + list of achievements at 0:45, birth/West Point at 1:06. The drop by 0:42 lines up with that switch from story to biography.
- Conclusion (hypothesis): the killer is leaving the story for a résumé/biography in the first minute, not the length of the intro. Draft opening-rule change proposed to the owner 2026-10-31 (not locked yet).

## Studio AI on Collins, 2026-11-01: "reignite" ideas (our check)
- Titles suggested: "The Forgotten General Who Saved D-Day in 1 Hour" = FALSE (Collins did not save D-Day in an hour; Cobra was 25 July), never use.
  "How One American General Broke the Normandy Stalemate" = accurate (Operation Cobra) -> worth a Test & Compare title test.
- Collins CTR was 4.2% (normal); his problem is the 0:42 cliff (CV at 0:45), which a title/thumbnail cannot fix.
- End screens: our own numbers say they barely work (Morgan 4 views, channel end-screen CTR 0.6%): free, but expect little.

## Studio AI 2026-11-01: "the 40-second bucket"
- 2 Para and Collins both had ~23.1% avg viewed, but at 0:40 2 Para kept >41% and Collins 36% (then <30%): 40k views vs ~600.
- The body (1:00-12:00) is flat for every video: each point gained at 0:40 carries through the whole video (36% -> 50% at 0:40 = ~+39% watch time).
- Its formula: 0:00-0:10 impossible stakes (no stats/logistics); 0:10-0:25 the impending catastrophe ("if the line broke here..."); 0:25-0:40 the
  commander + his unconventional move ("everyone expected him to retreat; instead...").
- Our check: fits the 2026-10-31 opening rule (stay in one story, no CV), except the hero enters a little earlier (by ~0:40 vs our ~0:45-1:00:
  Thomas 0:47 and Smith 0:56 kept 69-70% at 0:30, so the exact second is not proven). Being TESTED on Patton #15 (research/CONSIDERING.md); not a rule yet.

## Patton #15 (published ~2026-11-02, title "| The Man Who Broke the Siege of Bastogne"): Studio AI, first days
- 135 views. Retention at 0:40 = 48.2% (Collins 36.0%); avg view duration 5:06 = 29.6% (Collins 3:07). First video with the 2026-10-31/11-01
  opening (stay in the story, name ~0:40, no stats early): the opening fix WORKED on retention.
- Traffic: Browse (Home) 766 impressions, 116 views, CTR 4.96%; Suggested 530 impressions, 10 views, CTR 0.75%.
- Studio's reading: Suggested places us next to big Patton/Bulge documentaries where our thumbnail does not win the click; low Suggested CTR
  slows impressions everywhere. Saturated topic (Patton/Bulge) vs our hits (Thomas, Morgan: few strong competitors).
- Studio's thumbnail ideas checked against FACT_NOTES: "90°" is NOT sourced as an exact figure and "72-hour relief" is false (Verdun 19 Dec ->
  attack 22 Dec -> link-up 26 Dec = 7 days). Usable and sourced: THREE DAYS (promise to attack on 22 Dec), ONE WEEK, a map of the turn north.
- Small sample (1,296 impressions): read again at day 7 with Studio numbers (retention 0:30 too).

## Studio AI 2026-11-02: "it's the era" (did not answer the traffic-source question)
Views now: Thomas 125,206 (Civil War); Morgan 47,888, Greene 3,728 (Revolution); Smith 2,220 (Korea); 2 Para 39,662 (Falklands);
Gavin 674, Collins 615, Patton 135 at ~20 h (WWII). Thomas had 24 views / 0.94% CTR in its first 2 days, then ignited (after the retitle).
Studio's claim: 18th-19th-century American wars are our audience; WWII is the most saturated category. Our check: by era the record is
Civil War 1/1, Revolution 1/2 (+Greene still beats all WWII), Falklands 1/1, Korea 0/1, WWII 0/3. The WWII 0/3 is the strongest era signal,
but Gavin and Collins also had the CV openings; Patton (good opening, 48% at 0:40) is the clean WWII test: read it at day 7.
Its "saturation" reason is NOT supported by our search counts (research/saturation/SATURATION.md: Goose Green is crowded and a hit).
Studio's suggested topics: Hancock (Gettysburg), Jackson's Valley (made), Grant (Vicksburg), Benedict Arnold (Saratoga), Henry Knox.

## Traffic sources, days 1-3 (Studio, asked 2026-11-02)
| Video | Day | Browse impr. | Browse views | Browse CTR | Suggested impr. | Sugg. views | Sugg. CTR | Ret. 0:30 | Ret. 0:40 | AVD |
|---|---|---|---|---|---|---|---|---|---|---|
| Morgan | 1 (Oct 21) | 7,590 | 1,740 | 4.77% | 2,013 | 193 | 3.68% | 68.0% | 46.6% | 6:17 |
| Morgan | 2 | 10,158 | 2,098 | 3.74% | 3,104 | 217 | 3.32% | | | 6:29 |
| Morgan | 3 | 28,945 | 6,182 | 4.47% | 4,378 | 240 | 2.33% | | | 5:47 |
| Greene | 1 (Oct 28) | 6,250 | 1,312 | 4.50% | 1,892 | 108 | 2.54% | 60.5% | 50.4% | 4:43 |
| Greene | 2 | 3,640 | 811 | 4.09% | 997 | 36 | 1.81% | | | 4:46 |
| Greene | 3 | 4,784 | 917 | 3.28% | 350 | 14 | 2.86% | | | 4:35 |
| 2 Para | 1 (Oct 17) | 316 | 81 | 2.22% | 655 | 34 | 1.53% | 64.6% | 37.2% | 4:41 |
| 2 Para | 2 | 3,678 | 1,135 | 5.82% | 9,398 | 542 | 3.58% | | | 5:07 |
| 2 Para | 3 | 15,341 | 4,266 | 4.70% | 26,335 | 1,339 | 2.78% | | | 4:54 |
| Gavin | 1 (Oct 26) | 1,742 | 374 | 4.36% | 184 | 18 | 2.72% | 53.0% | 38.8% | 3:00 |
| Gavin | 2 | 856 | 155 | 3.39% | 169 | 7 | 2.96% | | | 3:04 |
| Gavin | 3 | 73 | 14 | 2.74% | 33 | 2 | 0.00% | | | (11:45 on 14 views) |
| Smith | 1 (Oct 11) | 50 | 13 | 4.00% | 114 | 12 | 7.02% | 67.8% | 63.8% | 8:31 |
| Smith | 2 | 9 | 6 | 0.00% | 6 | 0 | 0.00% | | | 7:26 |
| Smith | 3 | 12 | 5 | 16.67% | 26 | 7 | 7.69% | | | 8:06 |
| Patton | ~20 h | 766 | 116 | 4.96% | 530 | 10 | 0.75% | | 48.2% | 5:06 |
Reading: Patton's retention (48.2% at 0:40) is as good as Morgan's (46.6%) and its Browse CTR is as good (4.96% vs 4.77%). The two
differences: (1) day-1 Browse impressions ~10x lower (766 in 20 h vs 7,590), (2) Suggested CTR 0.75% vs 3.68%. Morgan launched 4 days after
2 Para, which was exploding (13-42k impressions/day), so YouTube showed the next video to that fresh audience; Patton launched after a pause
and two dead WWII videos. Hypothesis (to check with Greene/Gavin/Collins/Thomas rows): day-1 reach follows channel momentum + how close the
topic is to what our recent viewers watched; Suggested CTR is the topic/thumbnail match in the sidebar.

Greene vs Morgan: same era, same day-1 reach (6,250 vs 7,590 Browse impressions), Browse CTR as good (4.50% vs 4.77%), better retention at
0:40 (50.4% vs 46.6%). But day-2 Browse impressions FELL (3,640) where Morgan's ROSE (10,158, then 28,945). The visible difference: average
view duration 4:43 vs 6:17. Watch time per Browse impression (CTR x AVD): Morgan 4.77% x 377 s = 18.0 s; Greene 4.50% x 283 s = 12.7 s;
Patton 4.96% x 306 s = 15.2 s. Hypothesis: YouTube expands on day 2 when watch time per impression is high (~18 s+). Test it on 2 Para,
Thomas (after retitle), Gavin, Collins.

2 Para: tiny day 1 (316 Browse impressions), then it took off through SUGGESTED first (9,398 on day 2, 26,335 on day 3) with a 3.58% Suggested
CTR, and Browse followed (5.82% CTR on day 2). Retention at 0:40 was only 37.2% (worse than Greene's 50.4%), so 0:40 retention is NOT what
decided it. Watch time per impression on day 2: Browse 5.82% x 307 s = 17.9 s (Morgan day 1: 18.0 s; Greene: 12.7 s; Patton: 15.2 s),
and Suggested CTR 3.6-3.7% for both hits vs 2.5% Greene and 0.75% Patton. Updated hypothesis: a video grows when (a) clicks x minutes watched
per impression is high (~18 s+) AND/OR (b) Suggested CTR is ~3.5%+ (the sidebar next to related videos opens up). A crowded topic is not bad
by itself: it means a big sidebar audience, IF our thumbnail wins the click there (2 Para yes, Patton no).

Gavin: same 0:40 retention as 2 Para (38.8% vs 37.2%) but average view duration 3:00 vs ~5:00. Watch time per Browse impression on day 1:
4.36% x 180 s = 7.8 s -> cut on day 2. Ranking so far (watch time per impression, day 1-2): Morgan 18.0 s (hit), 2 Para 17.9 s (hit),
Patton 15.2 s (slow), Greene 12.7 s (flat), Gavin 7.8 s (cut). The order matches the outcomes exactly (n=5). The lever is MINUTES WATCHED
after the click, not the 0:40 number: 2 Para and Gavin had the same 0:40 retention and opposite fates.

Smith: YouTube barely tested it (164 Browse + Suggested impressions in day 1, ~240 in 3 days; the channel had 16 subscribers and no hit yet).
Its tiny sample looked excellent (watch time per impression 4.00% x 511 s = 20 s; Suggested CTR 7%; 63.8% at 0:40), but too small to
trigger anything. So there are TWO stages: (1) YouTube must give the video a test batch on day 1-2 (depends on the channel's state/momentum:
Smith 164, Patton 766 in 20 h vs Morgan 7,590 and Greene 6,250, both published in the weeks after 2 Para's explosion); (2) the batch decides:
~18 s of watch time per impression (CTR x average view duration) and ~3.5% Suggested CTR -> expansion (Morgan, 2 Para); 13 s (Greene) holds
flat; 8 s (Gavin) is cut. 2 Para itself started tiny (316) and broke out through Suggested on day 2.

## Benedict Arnold #17 (published 2026-11-03, "| America's Most Brilliant Traitor"), day ~1 (Studio)
Browse 1,262 impressions, 237 views, 2.85% CTR; Suggested 544 impressions, 20 views, 1.29% CTR; all sources 1,848 impressions, 269 views,
2.38% CTR, average view duration 4:48. Reading with DATA_RULES: stage 1 small batch (cold channel, like Patton 766), AND stage 2 weak: Browse
CTR 2.85% is the lowest of any recent upload (others 4.4-5.8%), so watch time per Browse impression = 2.85% x 288 s = 8.2 s (Gavin 7.8 s,
cut). The CLICK failed, not the opening (name 1:01, move 1 1:53). Action: Test & Compare a new thumbnail/title on Arnold now; make Grant's
packaging the priority before posting. vidIQ title scores for Grant (2026-11-04): current "| The Man Who Accepted Three Confederate
Surrenders" 87, "| The Man Who Took Vicksburg" 88, "| The Man Who Won the Civil War" 93, "How Grant Cut Loose From His Supplies and Took
Vicksburg" 86.
