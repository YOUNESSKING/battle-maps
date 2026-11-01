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
