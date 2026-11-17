# 8. Grand Maneuver pivot study (2026-11-17)

Should we pivot from "<Name>'s Top 3 Legendary Tactical Moves" (15-17 min, 2D maps) to the Grand Maneuver (GM) style (3D terrain, cloud dives, one campaign per film)?

**Short answer: no full pivot.** Do option (c): make GM-style single-campaign films in our proven eras (Civil War and Revolution). Alternate them with the format, about one film every two weeks, and judge them by DATA_RULES (watch time per impression on days 1-3). Begin with **Vicksburg 1863, "5 battles in 18 days"**.

## Sources (every number below comes from one of these)
- `gm_channel/gm_vidiq_2026-11-17.json`: vidIQ `channel_videos` and `channel_stats` for GM (`UC8A3VXhKVNRp_fJt1dVrBAg`), pulled 2026-11-17 at about 18:00 UTC. It has per-video views, likes, comments, length, vph, and breakout score, plus the daily subscriber and view counts.
- `gm_channel/gm_flat_*.jsonl` and `rss_GM.xml`: yt-dlp `--flat-playlist` (videos, shorts and streams tabs) and GM's public RSS feed. These confirm 6 uploads, no Shorts, no streams, and the same dates.
- `gm_channel/flat/*.jsonl`, `rss/*.xml` and `niche_scan.md`: newest-60 lists for 16 niche channels, plus RSS for the last 15 uploads with dates and views. `build_tables.py` rebuilds the tables.
- `gm_channel/vidiq_channel_search_3d_campaign.json`: the vidIQ channel search (40 channels, with size, growth, cadence and average length).
- `gm_channel/vidiq_calls_2026-11-17.md`: the similar-channels call and two outlier searches, summarised.
- **vidIQ credits used: 30.** YouTube's bot check blocked yt-dlp's per-video pages ("Sign in to confirm you're not a bot"), and **I did not try to get around it**. The flat lists and the public RSS feeds are not blocked. `yt_channel_scan.py` was therefore not usable. A web search found nothing about GM.
- Our own numbers come from `research/CHANNEL_LOG.md` and `research/study/5_next_pick_2026-11-17.md`.

## 1. Grand Maneuver itself

### Upload history (as of 2026-11-17 18:00 UTC)
The median is 16,731 views (6 videos). "Views/day" is lifetime views divided by age.

| Published | Title | Length | Views | Age (d) | Views/day | x median | Current vph (vidIQ) | Likes/views |
|---|---|---|---|---|---|---|---|---|
| 16 Oct | Austerlitz 1805: How Napoleon Trapped a Larger Army | 12:40 | 18,368 | 32.3 | 568 | 1.10 | 25 | 1.11 % |
| 19 Oct | Did Napoleon Win the Wrong Battle? \| Jena-Auerstedt Explained | 12:07 | 9,379 | 29.1 | 323 | 0.56 | 6 | 1.47 % |
| 27 Oct | Berezina 1812 - The River That Became Napoleon's Worst Nightmare | 18:17 | 33,905 | 21.1 | 1,605 | 2.03 | 21 | 1.05 % |
| **6 Nov** | **Napoleon's Last Masterpiece: 4 Battles in 5 Days \| France 1814** | **20:38** | **109,228** | 11.3 | **9,709** | **6.53** | **185** | 0.89 % |
| 12 Nov | The Battle Napoleon Couldn't Afford to Win \| Borodino 1812 | 17:49 | 15,093 | 5.3 | 2,875 | 0.90 | 74 | 1.19 % |
| 17 Nov | Napoleon's First Masterpiece: 6 Victories in 15 Days \| Italy 1796 | 19:06 | 2,298 | 0.25 | (6 h) | n/a | **287** (vidIQ breakout 4.56) | 2.74 % |

- **Channel:** 1,240 subscribers, 183,917 views, 6 videos. Country PL. The channel was created 2023-02-23 but posted nothing until 16 Oct 2026, and its Austerlitz description still says "History Reforged" (GM_STUDY). All 6 videos are long-form, with no Shorts and no streams.
- **Cadence:** 6 videos in 32 days, about 1 every 6.4 days. That is roughly weekly, with real 3D terrain and 12-21 min per film. Length has grown from 12 min (the first two) to 18-21 min (the last four).
- **Topics:** 100 % Napoleon, covering 1796, 1805, 1806, 1812 (twice) and 1814. The videos form a series: Borodino ends by naming the Berezina video.
- **Titles:** 4 of 6 end with "| Place Year" or start with "Place Year". The two "Masterpiece: N battles in N days" titles are the hit (6.5x) and the fastest launch (287 vph at 6 h, against Six Days' 185 vph today). The paradox titles ("Couldn't Afford to Win", "Win the Wrong Battle?") did 0.56-0.90x. Thumbnails (GM_STUDY and critic A): a navy map, one giant cream word ("ONE BY ONE"), wax-seal markers and arrows. The two best have no face.
- **Why Six Days broke out:** (1) It has a number-and-time promise in the title ("4 Battles in 5 Days"). (2) It is a lesser-known underdog campaign told as a masterpiece, not a famous battle retold. (3) It is the longest film (20:38). (4) It launched when the channel was warm: Berezina had lifted daily views from about 200 to 3,000-4,000 during 1-6 Nov. GM then reused the same title formula for its newest upload (Italy 1796), which tells us they read it the same way.
- **Growth curve (daily vidIQ snapshots):** For three weeks the channel ran at under 1,000 views/day and 2-10 subscribers/day. Six Days then lifted it to **33,814 views/day and 283 subscribers/day on 8 Nov**, and it decayed to **8,300-9,300 views/day and 30-70 subscribers/day by 15-17 Nov**. So the pattern is **early boost then decay on the hit, with a raised floor**: that floor is about 9x the pre-hit level, and each later launch starts higher (Borodino 2,875/day against Austerlitz's 568/day; Italy 287 vph at 6 h). This is the "hot channel" pattern described in DATA_RULES, not steady growth. Subscribers per 1,000 views: 6.7.
- **Production cost signal:** GM ships weekly. Its description credits OSM, ESA WorldCover, GeoNames, AWS terrain tiles and Sketchfab models, and it uses AI narration ("AI narration." credit on Six Days). That is a fast, data-driven 3D pipeline. **Our render costs about 1 h per minute at 720p (owner figure), so a 19 min film takes about 19 h of render alone,** before baking a new 3D world for each campaign. The gm3d test needed several rounds over days for 66 s (see the clip README v3-v8). I did not check GM's output resolution.

## 2. The 3D and cinematic campaign-map niche
The full tables are in `gm_channel/niche_scan.md`. "Cadence" is the average number of days between long uploads in the RSS feed.

| Channel | Subs (vidIQ) | Created | Median views, newest long (flat) | Cadence (d) | Typical length | Eras | What works (evidence) |
|---|---|---|---|---|---|---|---|
| Epic History | n/a (not in vidIQ search) | old | 994,000 | mostly Shorts in RSS | 27-35 min, plus multi-hour compilations | Napoleon, AmRev, ancient | Waterloo 924,752 at 26 d (35,482/day). Its AmRev series runs 431k-988k per part, but the newest 60 uploads stop at "1776: Brooklyn, Trenton & Princeton" (500k), with no Saratoga, South or Yorktown. Its new Lexington upload has only 26,339 at 24 d. |
| HistoryMarche | n/a | old | 372,000 | 12.5 | 25-46 min | pre-1870 battles, 3D-style terrain | Königgrätz 2,385,395 (6.4x). Denain 1712 is at 70,774/day at 3 d. |
| Real Time History | 769,000 | 2017 | 1,100,000 | 17.5 | 22-220 min | WWII, modern, War of 1812, Napoleon 1813 | US invasion of Canada 1812: 600,265. Napoleon 1813: 648k. |
| The Operations Room | 1,450,000 | 2019 | 542,000 | 12.0 | 31-48 min | WWII naval/air, 3D | 2-3 part series (Pearl Harbor, Midway). |
| Battle Guide | 511,000 | 2020 | 451,000 | 13.1 | 21-42 min | WWI and WWII, 3D terrain "virtual tours" | 5 straight uploads at 0.6-1.1M. **Every title says "No AI".** Waterloo 682k. |
| Kings and Generals | n/a | old | 265,500 | 2.3 | 16-107 min | everything | Volume. |
| Invicta | n/a | old | 158,000 | 13.9 | n/a | ancient to modern | |
| Warhawk | 51,900 | 2020 | 60,500 | 34.3 | 35-166 min | **Civil War**, Texas, 2D real-time maps | "Grant's Masterpiece: The Vicksburg Campaign (All Parts)" 159,353 (2.6x). Galveston 125k. |
| Iron Breach History | 10,100 | Jan 2026 | 184,000 | 31.4 | 9-39 min | WWII airborne/D-Day, animated, "No AI" | 6 videos with a monthly cadence and a 106k-478k range. This shows that slow, high-polish uploads can work. |
| American Battlefield Trust | 513,000 | old | 15,000 (newest) | 14.0 | 12-49 min | Civil War, AmRev | Its animated battle maps break out: Franklin 277.7k, 11x (vidIQ outliers). |
| Grand Maneuver | 1,240 | Oct 2026 (active) | 16,731 | 6.4 | 12-21 min | Napoleon | see section 1 |
| A Time Of Eagles | 7,910 | 2023 | 18,000 | 66.6 | 22-146 min | Napoleon (lectures) | 1-yr subscriber growth +45 %. |
| Europe in the age of gunpowder | 3,100 (outliers) | n/a | 1,800 | 54.1 | 9-20 min | Napoleon | "I created the 1815 Waterloo battlefield in 3D" 73.2k, 24x. |
| Ruse & Ruin | 1,100 (outliers) | 2026 | 259 | 4.5 | 25-45 min | **AmRev** long films | 39 videos, median 259. Greene/Springfield is its best at 1.2k, 5.6x. |

Other demand signals from vidIQ outliers (`vidiq_calls_2026-11-17.md`):
- Ravelin "The Day Britain Lost an Entire Army: Saratoga, 1777": 365.4k, 35x.
- Biography "Siege of Vicksburg": 387k, 15x.
- Context History "How the Union Conquered the Mississippi": 106k, 164x.
- The Lamas History Hub "The Night 2,400 Men Saved the American Revolution": 19.5k, 30x.
- Vellum Atlas (33 subscribers) "How Napoleon Retook France With 1,100 Men, Day by Day": 3.5k, 104x.

**Read-out:**
- **Napoleon is crowded at the top.** Epic History, HistoryMarche, Real Time History and Battle Guide already cover it, and four small 3D or Napoleonic channels have appeared this year. GM proves room for a fresh look, but on 6 videos and 1 hit.
- **3D cinematic Civil War and Revolution campaign films are open.** No channel in this scan does GM-style 3D terrain for the Civil War or the Revolution. Warhawk (2D, one upload every ~34 days, 35-166 min) and American Battlefield Trust (short battle maps) are the nearest. Demand is proven: Vicksburg (Warhawk 159k, Biography 387k, Context 106k) and Saratoga (Ravelin 365k).
- **Under-served topics:** Saratoga, the Southern campaign and Yorktown are missing from Epic History's newest 60 uploads. Jackson's Valley 1862 produced no breakout in the outlier search: demand there is not measured.
- **A warning:** long Revolution films do not sell on topic alone. Ruse & Ruin's median is 259.
- **The niche overall is growing.** GM, Iron Breach and A Time Of Eagles are new or fast-growing, and Battle Guide's views grew 88.6 % in a year (vidIQ). Two of the bigger 3D channels market "No AI", so AI narration is a visible risk for us (we use Kokoro voice A).

## 3. Pivot assessment

**What a GM-style channel needs** (GM_STUDY and section 1):
- 17-21 min films with ~13 chapters and ~150 wpm calm narration (about 2,600-2,700 words). Eyewitnesses are named inside the sentence about 20 times per film, there is a refrain spine, and the last words set up the next video.
- An honest NOTE block on sources.
- A weekly cadence.
- One 3D world per campaign.

**Would our audience carry over?** Mostly it doesn't matter. 81-95 % of our views come from Home, and 95.7-99.1 % come from non-subscribers (CHANNEL_LOG: Greene, Morgan). Our "audience" is the browse cluster for Civil War and Revolution topics, not subscribers. **What carries over is the era, not the format.** A GM-style film on a Civil War campaign sits in the same sidebar as Grant and Thomas, while a Napoleon film would start a new cluster from zero, as GM did.

**Risks:**
1. Render cost. About 19 h of render per film plus world building means at most ~1 film a week, realistically one every 2 weeks, against our current pace of about one video every 2-3 days (the ages in `5_next_pick`: Patton 16 d, Cleburne 11 d, Grant 8 d, Yorktown 4 d, Marion 1 d).
2. A thin evidence base. GM has 1 hit in 6 videos, 1 month old.
3. Competition in Napoleon.
4. "No AI" positioning by rivals.
5. Losing our proven format. Thomas 136k and Morgan 51k came from the format, and Grant (8.5k at 8 d) is hot now.

**Options:**
- **(a) Full pivot: no.** It throws away the 3-for-3 Civil War format record and bets on n=1. Weekly 3D output is not achievable on our render budget.
- **(b) The format rendered in the GM look: no.** Three moves usually means three campaigns, which means 3 different 3D worlds per video. That is triple the world-building cost of a single-campaign film, and our 2D format already earns.
- **(c) Recommended: GM-style single-campaign films in our eras, alternating with the format, about 1 every 2 weeks.**
  - The film uses one world, one campaign, and GM's proven title formula ("<Name>'s Masterpiece: N Battles in N Days | Place Year").
  - It can launch next to our hot Civil War video, as DATA_RULES requires.
  - The gm3d Big Black River test is already a piece of the first topic.
  - Review after 3 films against the format's day-1 to day-3 watch time per impression.
- **(d) Stay: second-best.** It is safe, but it ignores an open look-gap in our own eras.

**First topics (with demand evidence):**
1. **Vicksburg, 1-17 May 1863: "Grant's Masterpiece: 5 Battles in 18 Days \| Mississippi 1863"** (Port Gibson, Raymond, Jackson, Champion Hill, Big Black River). Evidence: Warhawk 159k (2.6x), Biography 387k (15x), Context History 106k (164x), our Grant is hot, and the Big Black River 3D test exists.
2. **Saratoga 1777.** Evidence: Ravelin 365k (35x), and it is absent from Epic History's newest 60.
3. **Trenton and Princeton: "10 Days That Saved the Revolution".** Evidence: Epic History 500k, Lamas History Hub 19.5k (30x).
4. **Greene's Race to the Dan, 1781.** Evidence: Extra History's Greene series 274.5k and 173.8k (`5_next_pick`). Caution: Ruse & Ruin's Greene film got 1k.
5. (Test only if 1-3 work) **Jackson's Valley Campaign 1862.** Demand is not measured here.
