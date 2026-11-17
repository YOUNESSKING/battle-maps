# 7. Channel lifecycle study: is "<Name>'s Top 3 Legendary Tactical Moves" dying? (2026-11-17)

Owner's observation: "new channels get their first hits at the beginning, then stop... small channels just die out (Warfare Genius, Footprints in History). I sense this format is dying out."

**Short answer.**
1. **The early-boost-then-decay pattern is real, but it is not universal.** It shows sharply in 3 of the 11 small channels that have at least 5 uploads older than 14 days: Warfare Genius, Footprints in History and us. All three launched between 24 Sep and 10 Oct into the same format and posted every 2-4 days. Four more decline mildly. Four are flat or rising, and so are all 5 big channels with enough data.
2. **The format did lose most of its reach in November, and the drop is much bigger than the niche-wide dip.** Compared at the same age (3-17 days), format uploads fell from a median of **22,081 views (Oct, n=20) to 456 (Nov, n=18), about 48x**. Non-format small history channels over the same window fell from **8,921 (n=7) to 2,515 (n=10), about 3.5x**.
3. **The main cause is the flood of uploads, not repeated generals.** The format went from 3 uploads in July and 8 in September to **37 in October** and 21 in the first 17 days of November. October's 37 uploads earned 1.91M views in total, while September's 8 earned 2.98M. In October, repeated generals did *better* than first-time ones (median 20,983 vs 7,973). In November, first-time generals also flopped.
4. **Recommendation: adjust, do not pivot yet.** Keep the map engine and our proven eras. Stop depending on the "Top 3" title. Alternate it with single-battle and campaign story videos. Never go silent for 10 days or more after a hit. Rules are in section 6.

## Sources and method (every number comes from these files)
- `lifecycle/raw/<handle>_flat.json`: yt-dlp `--flat-playlist` of each channel's /videos tab, scanned 2026-11-17 by `lifecycle/flat_scan.py`. These give the full upload list in order. Views are rounded to 2 significant figures. Dates are yt-dlp's `approximate_date`, which is coarse for old videos.
- **Exact dates and views** come from the 2026-11-17 and 2026-10-30/31 scans (`scan_2026-11-17/channels/*.json`, `research/competitors/*.json` and their git history). The older scans are also used as view **snapshots**: 30 Oct, 31 Oct, 1 Nov, 6 Nov and 17 Nov.
- **vidIQ** `get_videos_by_ids` covered the 70 videos whose page yt-dlp could not fetch, because YouTube's bot check said "Sign in to confirm you're not a bot". **I did not try to get around the bot check.** These results are in `lifecycle/raw/vidiq_videos_2026-11-17.json`. **vidIQ credits used: 10** (2 calls). Exact views for our Thomas and Smith videos come from `scan_2026-11-17/vidiq_2026-11-17.md`.
- `lifecycle/analyze.py` builds every number below. Its outputs are `lifecycle/channels.csv` (one row per long video, 713 videos), `lifecycle/summary.json`, `lifecycle/tables.md` (each channel's videos in upload order) and `lifecycle/analyze_output.txt`.
- Definitions:
  - **Long video**: at least 8 minutes.
  - **Hit**: at least 50,000 views.
  - **Mature**: at least 14 days old. A 15-30-day-old video gains a median of only **x1.10** more in the next 18 days (n=25), and a 31-60-day-old video gains **x1.02** (n=45), so mature view counts are close to final (`summary.json` `tail_18d`).
  - **Format title**: the title matches Top 3 / 3 Greatest / 3 Legendary / Tactical Masterpieces.
- Contrast channels: Kings and Generals, The Armchair Historian, Epic History and Mark Felton (newest 80 uploads each), Warhawk (100) and Redcoats & Rebels (all 7). Their dates are approximate, so their gap figures mean nothing; read only their view series.
- **Bias warning.** We found these channels *because* they had hits. A channel that never got an early hit is invisible to us. So "first hit within 3 uploads" says nothing about how many new channels get one.

## 1. Per channel (views per upload in order, oldest on the left)
Sparkline: one bar per long upload, on a log scale from 100 to ~3M views, using the same scale for every channel (big channels show their last 45 uploads). Full per-video tables with dates, views, length and titles are in `lifecycle/tables.md`.
"Late/early" = the median views of the last third of mature uploads divided by the median of the first third.

| Channel | Views per upload (oldest to newest) | Long videos | First upload | Median / max gap (d) | Days since last | Uploads last 30 d | Median views | Peak (upload #) | First hit at upload # | Hits | Late/early | Format title share, all / last 5 | Subs |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tactical Genius | `▄▆█▅▅▄▇▆█▇▅▆▆▃` | 14 | 2026-07-12 | 6 / 38 | 16 | 1 | 89,807 | 1,479,122 (#9 Ridgway) | #2 | 8 | 0.72 | 1.0 / 1.0 | 12,200 |
| Warfare Genius | `▄▇▆▇▅▅▅▅▅` | 9 | 2026-09-24 | 4 / 6 | 22 | 2 | 40,000 | 784,810 (#2 Guderian) | #2 | 3 | **0.19** | 1.0 / 1.0 | 5,840 |
| Footprints in History | `▆▅▅▅▆▆▄▄▅▄▅▄▂▃▃▃▂▂▁▁▃▃▂▁` | 24 | 2026-10-10 | 2 / 4 | 0 | 19 | 5,215 | 136,628 (#5 Puller) | #1 | 3 | **0.09** | 0.83 / 0.4 | 2,730 |
| War Table Atlas | `▃▃▆▂▂▁▁▃▁▂▁▁▃▁▁▁▁▁▁` | 19 | 2026-10-11 | 1 / 8 | 2 | 17 | 312 | 105,499 (#3 O'Connor) | #3 | 1 | 0.26 | 0.95 / 0.8 | 450 |
| Commanders and Tactics | `▇▇▆▇▆▅▇▆▇` | 9 | 2025-06-04 | 56 / 117 | 29 | 1 | 254,604 | 833,326 (#2 Napoleon) | #1 | 8 | 1.97 | 1.0 / 1.0 | 38,600 |
| Cloaked History | `▁▂▂▁▃▁▄▂▆▄▂▁▅▁▁▁▂▁▂▁▂▁▁▁▂▁▁▁▂▃▃▃▂▁▂▂▁▂▁▁` | 40 | 2026-03-26 | 4 / 36 | 10 | 1 | 382 | 77,000 (#9) | #11 | 1 | 0.65 | 0 / 0 | 3,640 |
| **Generals On The Map (us)** | `▆▃▅▅▂▃▂▁▂▃▄▂▁` | 13 | 2026-10-02 | 3.5 / 8 | 0 | 10 | 2,297 | 136,490 (#1 Thomas) | #1 | 2 | **0.01** | 0.92 / 0.8 | 922 |
| Handled Like Eggs | `▆▆▆` | 3 | 2026-01-16 | 111 / 130 | 83 | 0 | 165,000 | 174,117 (#3) | #1 | 3 | n<5 | 0 / 0 | 8,420 |
| Iron Breach History | `▇▆▆▆▆▇` | 6 | 2026-04-12 | 27 / 46 | 61 | 0 | 184,525 | 478,325 (#6) | #1 | 6 | 1.49 | 0 / 0 | 10,100 |
| The Generals' Oath | `▄▆▆▃▅▇▄▂▄▄▃▄▃▂▅▄▅▃▄▃▄▆▅▇▃▃▃▃▆▂▄▄▃▆▃▄▄▃▃▅▃▃▃▂▂` | 47 | 2025-12-31 | 4 / 47 | 7 | 4 | 5,392 | 358,785 (#26) | #2 | 10 | 0.28 | 0 / 0 | 12,500 |
| Civil War Dose (now "The Civil War Archive") | `▃▄▆▂▃▃▆▄▃▄▅▅▆▆▆▅▅▂▅▄▄▅▅▃▄▅▄▃▃▅▄▃▄▃▄▂▃▂▄▆▆▂▃▂` | 44 | 2026-03-07 | 4 / 34 | 3 | 3 | 8,647 | 192,148 (#41) | #3 | 9 | 0.43 | 0 / 0 | 9,760 |
| Ravelin | `▅▅▅▄▄▄▅▅▆▆▅▄▅▆▅▆▄█▄▅▄▅▄▆▄▆▆▅▄▄▆▅▆▅▄▆▄▅▅▄▅▄▃▄▃` (last 45 of 72) | 72 | 2026-05-11 | 2 / 9 | 2 | 10 | 33,109 | 1,388,203 (#2) | #2 | 31 | 0.32 | 0 / 0 | 31,800 |
| Redcoats & Rebels (new) | `▆▄▂▆▁▂▂` | 7 | ~2026-10-23 | ~3 | 0 | 7 | 1,300 | 156,000 (#4 Little Bighorn) | #1 | 2 | n<5 | 0 / 0 | ? |
| Warhawk | `▆▅▆▅▅▅▅▅▆▅▆▅▅▆▆▄▆▆▆▆▆▆▆▆▆▅▆▆▆▅▆▅▆▅▅▆▆▅▆▅▅▅▆▅▆` | 100 | ~2020 | approx | ~30 | 2 | 63,000 | 498,000 | #1 | 63 | 0.90 | 0 | ? |
| Kings and Generals | `▆▆▇▇▇▇▆▆▇▇▇█▇▇▇▇█▆▇▆▆▇▇▇▇▇▇▇▇▇▇▇▇▆▇▇▆▇▆▇▆▇▆▆▆` | 80 scanned | (window) | ~2 | 0 | 16 | 234,463 | 1.0M | n/a | 79/80 | 2.92 | 0 | 4.22M |
| The Armchair Historian | `▇▇▇▇▇▇▇█▆▇▇█▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▆▇▆▆▆▇▆▇▇▇▇▇▇▆` | 78 scanned | (window) | approx | 2 | 3 | 522,000 | 1.7M | n/a | 78/78 | 0.63 | 0 | 2.54M |
| Epic History | `█████▇████████▇▇▇▇█▇██▇▆▇█▇█▇▇▇▇▇█▇█▇█▇▆▇████` | 78 scanned | (window) | approx | ~20 | 2 | 1.0M | 24M | n/a | 78/78 | 0.58 | 0 | 3.2M |
| Mark Felton | `▆▇▇█▇▆▇▇██▇▇▇▇▆▇▆▇▇▇▇█▇▆▆▇█▆▇▇▇██▇█▆▇▇▇▇▇█▇▆▇` | 70 scanned | (window) | ~1 | 4 | 12 | 385,500 | 2.2M | n/a | 70/70 | 0.96 | 0 | 2.44M |

### Topics, titles and current state
| Channel | Topics | Title/packaging changes over time | State today (17 Nov) |
|---|---|---|---|
| Tactical Genius | WW2 + Korea generals, one Napoleonic (Wellington 8.1k) | Always "Top 3 (Legendary) Tactical Moves / The Man Who...". Dropped "Legendary" on Slim (224k) and Rokossovsky (2.8k): no consistent effect | **Paused/dying.** Was posting every 6 days. Went silent 24 Sep to 1 Nov (38 d), came back with Rokossovsky at **2,819 views (0.03x its median)**, then 16 days of silence |
| Warfare Genius | WW2 generals + Washington | Switched "Legendary Tactical Moves" to "Top 3 Genius Moves" (5-16 Oct: Eisenhower 300k, Rommel 50k, Manstein 40k, Montgomery 18k), then switched back (Zhukov 24k, Bradley 25.6k) | **Stopped.** 22 days silent after posting every 4 days; the last 5 mature uploads have a median of 25,611 |
| Footprints in History | Mixed eras: Civil War, WW2, Korea, Marines, Nelson | Moved away from the format: 2 of its last 5 titles are format titles, against 0.83 overall ("Chamberlain's Impossible Stand" 2.8k, "The Bridge Was Rigged" 82) | **Alive but decaying:** 19 uploads in 30 days, last 5 mature median 3,951 against 46,000 for its first 5 |
| War Table Atlas | Obscure WW2 generals (Maczek, Truscott, Patch, Leclerc, Bagramyan) | Always "3 Greatest Moves". The newest upload drops the format (U-boats: 45 views) | **Alive but never took off:** median 312, 1 hit in 19 uploads |
| Commanders and Tactics | The most famous names across all eras (Napoleon, Caesar, Zhukov, Manstein) | Constant title; "(No AI)" tag added from Dec 2025 | **Healthy:** 8 of 9 uploads are hits; Manstein 538k (19 Oct) is the format's biggest October video. Posts every 56 days (median) |
| Cloaked History | Civil War "what if" / myth videos | No format titles | Tiny (median 382), slowing (1 upload in 30 d) |
| **Us** | Civil War, Revolution, Korea, Falklands, WW2 | Format title on 12 of 13; Yorktown (non-format) got 373 | **Alive but decaying:** first 5 mature median 40,534, last 5 mature 694; Grant (9 Nov) 8,516 at 8 days |
| Handled Like Eggs / Iron Breach History | Congo 1964 / D-Day units, 30-55 min animated | No format titles | **Slow and healthy:** every upload is a hit; posts every 27-111 days |
| The Generals' Oath / Civil War Dose | Grant-Lee-Longstreet relationship stories (Civil War only) | Curiosity titles ("What X Knew...", "Why X Feared..."). CWD renamed itself "The Civil War Archive" | **Alive but declining** (late/early 0.28 / 0.43). Both still produce hits sometimes (CWD's 103-min Grant video got 192k, 29 Sep) |
| Ravelin | American Revolution + 1812 single actions (AI-labelled) | Pattern "The X That Destroyed Britain's Y" | **Alive:** 31 hits in 72 uploads, but the last 5 mature uploads have a median of 18,595 against its 33,109 median |

## 2. Is there a common lifecycle?
**First hits come early, at least for the channels we can see.** 12 of the 13 small channels got their first video over 50k within their first 3 uploads. The exception is Cloaked History, at upload #11. This is the biased sample described above, so it shows only that early hits are *possible*, not that they are typical.

**What happens after the first hit, for the 11 small channels with at least 5 mature uploads** (`summary.json` `lifecycle`):
| Pattern | Late/early | Channels |
|---|---|---|
| Sharp early boost then decay (late/early < 0.25, peak in the first 40 %) | 0.01-0.19 | **3: Warfare Genius, Footprints in History, us** |
| Mild decline | 0.26-0.43 | 4: War Table Atlas, The Generals' Oath, Ravelin, Civil War Dose |
| Flat or rising | 0.65-1.97 | 4: Tactical Genius (until its pause), Commanders and Tactics, Iron Breach History, Cloaked History (flat because it was always tiny) |
| Big channels (contrast) | 0.58-2.92 | 5 of 5 flat or rising (Redcoats & Rebels has too few uploads) |

So the owner's pattern is real for **3 of 11** (7 of 11 if mild decline counts) and **0 of 5** big channels. "Small channels die out" describes **two** channels that actually stopped: Warfare Genius (22 d silent) and Tactical Genius (16 d silent after a 38-day pause). Footprints in History is not dead. It posts nearly daily, but each video gets about **1/12** of what its early videos got (late/early 0.086).

### What separates the survivors from the decaying channels
| Factor | Evidence | Verdict |
|---|---|---|
| **Upload cadence** | Median late/early for channels posting every 4 days or less (WG, FH, WTA, us, Cloaked, TGO, CWD, Ravelin) is **~0.27**. For channels posting every 6 days or more (TG, C&T, IBH) it is **1.49**. C&T, IBH and HLE post every 27-111 days and every upload is a hit | Strongest signal, but confounded: the slow channels also make longer, costlier films and have bigger audiences |
| **Pausing after a hit** | When a hit (>= 3x the channel median) is followed by the next upload within 0-4 days, that upload gets a median **1.54x** the channel median (28 of 43 above median). Within 5-9 days: **1.71x** (11 of 17). After 10 days or more: **0.57x** (only 1 of 6 above median). Examples: CWD went silent 34 d after its 192k Grant video and came back to 1.0k / 3.7k / 0.8k; TG went silent 38 d and came back to 2.8k | Clear: a hit buys roughly one week of momentum. Overall, consecutive uploads barely track each other (Spearman **0.09**, 257 pairs), so each video is mostly judged on its own merits |
| **Launch timing / crowding** | All three sharp-decay channels launched 24 Sep to 10 Oct, exactly when the format's monthly uploads went from 8 to 37 | Strong (section 3) |
| **Owning one era or topic** | Ravelin (Revolution only: 31 hits, 31.8k subs) and TGO/CWD (Grant-Lee only: 10 and 9 hits) keep producing hits after 40-70 uploads. The mixed-era format channels (FH, WTA) decay fastest | Supports picking an era and sticking to it |
| **First on a general's name** | Being first does not decide it. Guderian: TG first (114k), WG second (785k). Manstein: TG 252k, WG 40k, then C&T third with 538k. Zhukov: C&T 598k, then TG second with 764k | Not a factor (in October) |
| **Format variation / titles** | WG's "Genius Moves" relabel did not stop its decline. FH's switch away from format titles got 82-2.8k. TG dropping "Legendary": no effect | Changing title wording alone does not rescue a channel |
| **Length / production** | Survivors are long and costly: IBH 9-30 min animated, HLE 43-55 min, C&T "(No AI)". The decaying ones are 14-25 min, posted every 1-4 days | Consistent with the cadence finding |

## 3. Is the FORMAT itself declining?
**Format uploads (format titles on TG, WG, FH, WTA, C&T and us), by publish month** (`summary.json` `cohorts`; views as of 17 Nov):
| Month | Uploads | Channels | Median views | Share >= 20k | Share >= 100k | Total views | Median age (d) |
|---|---|---|---|---|---|---|---|
| Jul | 3 | 1 | 114,265 | 0.67 | 0.67 | 1.22M | 118 |
| Aug | 6 | 2 | 70,437 | 0.67 | 0.50 | 1.17M | 92 |
| Sep | 8 | 2 | 180,681 | 0.88 | 0.62 | 2.98M | 58 |
| **Oct** | **37** | 5 | **18,323** | 0.49 | 0.19 | 1.91M | 27 |
| Nov (1-17) | 21 | 4 | 274 | 0.00 | 0.00 | 0.03M | 11 (young) |

Oct and earlier videos are mature, so the age bias is small there (gain after day 15 is about x1.1). **Supply went up 4.6x from Sep to Oct while total views went *down* (2.98M to 1.91M), so the median per upload fell about 10x.**

**Same-age test** (each video measured at 3-17 days old, `same_age_summary`):
| Group | Oct 13-27 uploads, views at the 30 Oct snapshot | Oct 31-Nov 14 uploads, views today | Drop |
|---|---|---|---|
| Format uploads (6 channels) | median **22,081** (n=20) | median **456** (n=18) | **~48x** |
| Control: non-format small history channels (Ravelin, TGO, CWD, Cloaked) | median **8,921** (n=7) | median **2,515** (n=10) | ~3.5x |
| Within the same channel (format) | FH 22,081 to 849 (26x); us 38,401 to 2,268 (17x); WTA 771 to 149 (5x) | | |
| Within the same channel (control) | Ravelin 15,037 to 5,629 (2.7x); TGO 3,076 to 1,045 (2.9x) | | |

**Separating the three possible causes:**
- **A niche-wide November dip** explains about 3x. It shows in the control channels and in our own day-1 test batches (CHANNEL_LOG: Patton 766 and Arnold 1,262 Browse impressions against Morgan 7,590).
- **Topic saturation (the same generals again) is NOT the driver.** In October, the second or later video on a general had a median of **20,983 (n=17)**, against **7,973 (n=20)** for first-time generals. Across Jul-Oct it was 22,492 (n=24) vs 23,241 (n=35) (`repeat_stats`). Patton has now been done 4 times, Rommel 5, Zhukov 4, Manstein 3, Montgomery 3 and MacArthur 3. In November, first-time generals also flopped: Nimitz 109, Kuribayashi 147, Leclerc 71 and Murphy 100.
- **Over-supply of the same package is the best-supported cause.** In 6 weeks the format went from one or two channels to 5-6 channels posting about 37 videos a month with identical titles ("X's Top 3 ... Moves | The Man Who ..."). Total format views did not grow with supply. They shrank.
- **"YouTube's new-channel push" is not supported as a separate cause.** New military-history channels *did* break out in November with other packaging:
  - Redcoats & Rebels: Little Bighorn 156k (about 4 Nov).
  - Grand Maneuver: "Napoleon's Last Masterpiece" 109k in 11 days (6 Nov, `8_grand_maneuver_pivot.md`).
  - Before the Order: 49x outlier (`vidiq_2026-11-17.md`).
  - AWM Vietnam: "Top 10 ... Generals Ranked", 152k.

  Our own log points to channel *momentum* (the size of the day-1 test batch after a hit), not channel *age*. That fits the after-hit-gap result in section 2.
- **One exception: big channels running the format.** C&T's Manstein (19 Oct, 538k) shows that the format still pays for a big, high-quality channel posting rarely. We have no format test from a healthy, *small* channel in November. The next C&T upload will be the clean test.

**Verdict:** the format is not dead. But **for small channels, the "Top 3 Legendary Tactical Moves" package lost most of its reach in November** (median 456 at 3-17 days), mainly because too many channels flooded it. The niche as a whole only dipped. Caveats: only one month of data, n of 18-20 per side, and the November group is made up mainly of channels that were already decaying (FH, WTA, us).

## 4. Our own channel in this light
- Upload order: Thomas 136,490, Smith 2,297, 2 Para 40,534, Morgan 51,254, Gavin 722, Greene 3,934, Collins 694, Patton 247, Arnold 486, Cleburne 4,049, Grant 8,516 (8 d), Yorktown 373 (non-format), Marion 0 (posted today).
- Our first-5 to last-5 mature drop is the steepest of any channel (late/early **0.012**). But we have the **best November video in the whole format cohort**: Grant at 8,516 (8 d), then Cleburne 4,049, FH Thomas 3,951 and TG Rokossovsky 2,819. Our recent videos are not worse than the others'. The whole format went cold, and our proven eras (Civil War) still lead it.
- After 2 Para and Morgan we kept a 2-5-day gap, so the momentum was not lost to a pause. It was lost to Gavin, Collins and Patton (all WWII; Gavin and Collins also had CV openings), which got small test batches (CHANNEL_LOG, DATA_RULES).

## 5. What it does NOT show
- It does not show that the format is permanently dead. That needs another 4-6 weeks of same-age cohorts (rerun `analyze.py` after the next scan).
- It does not show that cadence *causes* survival. The slow channels are also bigger and better funded.
- It cannot see channels that never had a hit (survivorship bias).
- It does not use thumbnails, apart from earlier contact-sheet notes in `1_research.md` A1/A2.

## 6. What it means for us: rules
1. **Keep the engine, adjust the package. Do not pivot fully yet.** Run the format as one *series* and stop using it as the whole channel. Alternate it about 1:1 with single-battle or campaign story videos in our proven eras, packaged the way the November breakouts were ("Lee Saw a Chance... Meade Saw It Coming", "Napoleon's Last Masterpiece: 4 Battles in 5 Days"). This matches option (c) in `8_grand_maneuver_pivot.md`.
2. **Own one era.** Civil War and Revolution only for the next 8 uploads. The channels that keep producing hits (Ravelin, TGO, CWD) each own one era. The mixed-era format channels decayed fastest.
3. **Do not chase the volume channels.** Upload every 3-5 days at most. Never let quantity push down the 18 s/impression bar (DATA_RULES). The data favours fewer, stronger videos: channels posting every 4 days or less have a median late/early of ~0.27, against 1.49 for channels posting every 6 days or more.
4. **Never go silent 10 days or more after a hit.** The next upload after a hit got 1.5-1.7x the channel median when it came within 9 days, and 0.57x after 10 days or more. Keep a finished video in reserve so that one can go out within about 4 days of any breakout.
5. **Topic choice: repeating a famous name is fine; a flooded package is not.** A repeated famous general did not do worse (Oct: 20,983 vs 7,973). Choose by demand (search and our audience list), not by whether the name is "untaken". But do not post a format video on a name that another format channel has posted in the last 14 days: those cases have no data in our favour.
6. **Packaging:** for every format video, put a non-format story title in the Test & Compare set alongside the format title (PACKAGING_GUIDE allows 3 titles). Log which one wins in CHANNEL_LOG. Title-wording swaps alone (WG's "Genius Moves") did not save anyone. The thumbnail and the topic carry the click.
7. **Kill and pivot test:** after the next 6 uploads (3 format, 3 story), compare day 1-3 watch time per impression and 14-day views. If the story videos beat the format videos by 3x or more on both, make story the main series and keep "Top 3" only for very famous names (Grant, Lee, Washington, Sherman).
8. **Rescan every 2 weeks:** run `flat_scan.py` for the 12 handles, then `analyze.py`. Watch the format-cohort median at 3-17 days and the next uploads from C&T and TG (the clean format tests).
