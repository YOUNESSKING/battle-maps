# CRITIC B: review of CT_FRAME_ANALYSIS.md (draft v1), 2026-11-07

**VERDICT: NO.** The recommendations must be fixed before they reach the owner. Five of the nine candidates are sound and fit the rules if
they carry the caveats below (1, 3, 4, 5, 7). Two of them break locked rules or rest on a wrong reading of the evidence (2: open on the
general's real world; 8: earlier move 1). The "Do NOT copy" list leaves out several things the owner has already rejected. The draft also
contradicts our own files on pace, and it leaves out the main finding of the competitor study: their in-video craft is the same on
their 815k video and their 43k video, so none of these devices can explain their views.

Checked against: CLAUDE.md, STYLE_LOCK 1a / 1b / 1c / 2c / 2d / 7, DATA_RULES, CHANNEL_LOG, competitors_top20/SUMMARY.md +
commandersandtactics.md, PACKAGING_GUIDE 0b. Our own spoken pace, measured from `audio/timing.json` (words / paragraph time):
Grant 170, Arnold 176, Cleburne 167, Patton 164, Morgan 159 wpm.

## How strong the evidence is (applies to every row)
- n = 2 videos from 1 channel. The "frames" are a vidIQ AI watcher's shot list (the draft itself says: +-2 s, details may be wrong, not
  checked against frames). No real frame was seen.
- We have **no retention, CTR or impressions for CT**. Views only. Any "they do X and get Y views" is correlation.
- **The format does not change between their hits and their flops.** The same title, the same structure and the same thumbnail recipe
  give Napoleon 815k and Lee 43k (19x apart). commandersandtactics.md 2b and SUMMARY put the gap down to name demand, topic (the Eastern
  Front), thumbnail contrast and the channel's momentum. So a device that appears in both studied videos (title cards, troop counters,
  props) cannot be credited with their views. At best it is "a successful channel does this and is not hurt by it".
- Our own data (CHANNEL_LOG, DATA_RULES) points to the click (Arnold Browse CTR 2.85%, Patton Suggested CTR 0.75%), to momentum, and to
  minutes watched per impression (~18 s). The opening is already fixed (Patton 48.2% at 0:40). In-video polish is the smaller lever.

## Table
| # | Candidate | Rule conflict | Evidence strength | Cheapest test | Impact |
|---|---|---|---|---|---|
| 1 | Named move titles "<LABEL> / <Place> / <Year>" | **None, if**: the label is spoken on the card (1c.1); the card stays on the Style W map, alone, with a date that does not clash with the date scroll (2d.8: "title card alone, no clashing date"). Our card already says `MOVE 1 · TUNNEL HILL · 25 NOVEMBER 1863`, so add the label and keep the place and date. **Do not copy** their full-screen greyscale photo or black card (that breaks the Style W map continuity), **nor the sub-bass thud** (2c.5: no synthesized `ref:*` boom; use the locked hit only). The label must be true (no "Corridor of Death" hype unless sourced, PACKAGING 0b.2 spirit). | Weak: vidIQ's AI saw cards in both videos; the transcript agent saw no card (it only had text). No outcome data. | One `quick_sheet` snapshot of the move-1 card on the next video, two critics YES (2d.10), then ship. Free extra: use the same labels as YouTube **chapter titles** (chapters show in search and on the progress bar). | Low-medium |
| 2 | Open on the general's "real world" (speech, admirers, a quote) for 3-6 s | **Conflicts.** 1a: the opening is the STAKES of this story, then one continuous zoom, then the number, with the promise spoken by 10-15 s and nothing else allowed before it ("The stakes frame is the ONLY thing allowed before the promise"). 1c.5: no hero name before the name slam (a quote "by the general" names him). 1c.2: clean first frame. CLAUDE.md: the video opens on an animated map, never on a photo or film. STYLE_LOCK 7: "Opening on a photo" was rejected. Both CT openings break these rules (23 s of Goebbels film; a parade of portraits). | Weak and against us: our analysis rates CT's hook below ours (commandersandtactics.md 5, 7). Our hits opened on a crisis story, and the flops (Gavin, Collins) lost viewers when they opened on name and résumé (CHANNEL_LOG). | None needed: drop it. A real order or line that IS the stakes ("hold to the last man"), spoken by the narrator over the map, is already allowed under 1a, with no hero name and sourced in FACT_NOTES. | High **risk** (it could break the hook that works) |
| 3 | Troop counts that add up on screen at each move's setup (odds) | None, if every number is spoken (1c.1), sourced in FACT_NOTES (2c.6), is one big card at a time (1c.3, 2d.8 <= 3.5 s), and is not a repeated statistic (1c.5). Keep it out of the 0:00-0:10 stakes frame. | Medium-weak (1 example, Napoleon). It fits DATA_RULES 2 ("each move opens on its own crisis"). | Put an odds counter on moves 1 and 2 of the next video. In Studio, compare the retention slope over the first 60 s of each move with the same stretch in Grant and Arnold. Confounded (n = 1), but free. | Medium |
| 4 | One ink-drawn metaphor per move (checkerboard, funnel, fog "?") | None. It fits the 2d.9 map tools (ink trace, zoom box) and 2d.5 (solid lines only; the funnel or kill zone may not be dashed, unlike CT's dashed fire lines). | Weak (AI description). It is good teaching craft, but there is no data. | Snapshot sheet of one move with the drawing, two critics YES (2d.10). | Low-medium |
| 5 | Custom props on the tactical map (wire, mines, boats, crossed sabres) | None if they are hand-inked in Style W, small, and appear only on their spoken word (1c.1). 2d already has crosses and smoke puffs. Never flags on units (2d.4). | Weak. | A snapshot with 2-3 props in one scene. | Low |
| 6 | Speech-bubble quote on a portrait | **Partial conflict.** A cartoon bubble on the 2d.6 portrait card goes against the clean screen (2d.8: captions <= 3.5 s, stamps cream on dark on empty ground, one big card). Make it the existing stamp or caption in the narrator's own words, timed on the quote, <= 3.5 s. The quote must be sourced. | Weak (1 example). | A snapshot of the stamp version. | Low |
| 7 | Closing quote card before the final question | None if the ending stays <= 45 s after the final result (1b ending rule), the quote is spoken, and the final question card (1b.3) and end-screen room stay. **Sourcing risk:** CT's own example ("Never interrupt your enemy when he is making a mistake") is a famously **unsourced** Napoleon attribution: it would fail FACT_NOTES. | Weak. Endings cost us points (Thomas 81 s ending -6.4). | Read the ending retention in Studio on the next video against Grant and Arnold. Only with a quote that has a primary source. | Low |
| 8 | Earlier move 1 (theirs 0:32-1:06) | **Conflicts** with 1a ("Do NOT follow 'intro 20-25 s, name + move 1 by 0:25': our hits did the opposite"; move 1 by ~1:30-2:00) and 1c.6. | **Wrong as stated.** "They hold ~2x their median" compares VIEWS, not retention. Their Model and Zhukov intros are 1:13-1:18 (commandersandtactics.md 5), so they are not much earlier than ours. Our own data: Morgan moved at 2:20 and was a hit; Gavin and Collins cut to the man early and were flops. | Drop it. If the owner wants it anyway, he can trim the background to the 1a minimum (~1:30) without changing the rule. | Medium **risk** |
| 9 | Keep no mid-roll sponsor | None (not a change). But the draft's reason ignores that CT's newest video (Manstein) **does** carry a 90 s sponsor read inside move 1. | n/a | n/a | n/a |

## Do NOT copy: errors and gaps
The list is right as far as it goes. Add these:
1. **Archive film or photos as the opening** (Model 0:00-0:23) and **portraits as the opening** (Napoleon 0:00-0:06): CLAUDE.md
   "every video opens on an animated map, never a photo"; STYLE_LOCK 7 "Opening on a photo".
2. **The 3D globe** (Model 0:23): STYLE_LOCK 7 "Globe / cloud-dive openings and 3D tilted maps" was rejected.
3. **Nickname or thesis hook** ("Hitler's Fireman ... prolonged the war"; "all had a fixation on Napoleon"): 1a forbids a nickname plus
   an achievement list in the first two minutes.
4. **Sub-bass thud and other "cinematic" stingers** on cards: 2c.5 (only the locked sound kit).
5. **Full-screen photo or black move cards**: 2d.8 (the title card sits alone on the map). Their 20-40 s **music-only gaps** between
   moves (commandersandtactics.md 5) cost minutes watched (DATA_RULES 2).
6. **Colourised cut-out portraits that slide in, and corner badges of people with no unit**: 2d.6 (a portrait card on a stake at the
   unit; corner badges <= 3.5 s). AI colourisation must not become a "fake likeness" (STYLE_LOCK 7, licences).
7. **Nazi insignia** (Knight's Cross icon, a photo of Hitler shaking hands, SS insignia), not just "Nazi-leader portraits": SUMMARY "Never" 5.
8. **Their abrupt "Thank you for watching ... which commander next?" ending and their missing recap**: we keep the 1b.3 final
   question card and the method/result cards (2c.6).
9. **Unit counters split into dots, and overlapping dots**: 2d.4.
10. **Uncheckable quotes and figures from the AI watcher** (e.g. the Montenotte 38,000 / 55,000): re-source them before any use.

## What the draft should say but does not
- **Pace: the draft is wrong, or at least contradicts our own files.** It says CT speaks at ~130-140 wpm, "slower than ours at ~150-160".
  commandersandtactics.md estimates CT at 160-170 wpm, and our measured pace is 159-176 wpm. The lower figure probably counts their silent
  music gaps. Result: no evidence that they speak slower. Remove the claim. A slower Kokoro speed is not a recommendation.
- **Mid-video asks vs our locked 1b:** CT has none, and that proves nothing either way (no retention data). 1b stays locked: the owner
  kept both subscribe asks. Free check on every upload: in Studio, read the retention dip at the D2 subscribe line and at the "What would
  you do?" card. Raise it with the owner only if the dip is more than ~2-3 points.
- **Length:** their best video is the shortest (11:09), but they grew longer (19-24 min) and still had hits; the correlation is -0.41
  with Manstein 22:02 as a hit, so it is not causal. DATA_RULES counts minutes watched, so keep ~14-17 min. Do not shorten because of CT.
- **Title cards vs Style W:** say clearly that only the WORDS of their cards may be copied, never the look.
- **The real lever is not in the frames:** CT's views follow the name, the topic and the thumbnail (SUMMARY ch. 21, commandersandtactics
  2b, 3). Our Studio data agrees: the click failed on Arnold and Patton. The draft should point to the thumbnail test (one big face pop
  + our red front-line map + 1-3 words + a curiosity line, Test & Compare, PACKAGING 0b) and to topic order (famous names, proven eras
  first, DATA_RULES 1). It should warn that none of candidates 1-7 is expected to move views by itself.
- **Fix the factual slips:** "hold ~2x their median" (views, not retention); "no sponsor" (true for these two videos, false for the
  channel).

## Concrete fixes to the draft
1. Delete candidate 2, or rewrite it as "a spoken real order or line that IS the stakes, inside 1a, over the map, no name".
2. Delete candidate 8, or restate it as "no change: 1a stands; CT's intros are 1:06-1:18 anyway".
3. Candidate 1: state "spoken label, on the Style W map card, locked hit sound, true label"; add the chapter-title use.
4. Candidate 6: turn it into a narrator-worded stamp of <= 3.5 s, not a bubble.
5. Candidate 7: add "primary-source quote only; the Napoleon example is unsourced; ending <= 45 s".
6. Add the 10 Do-NOT items above.
7. Correct the pace claim, add a section on asks, length and Style W, and add the "format is constant across their hits and flops"
   caveat at the top of section 4.

## Ranked: what to test first
1. **Thumbnail in CT's recipe** (big face pop + red front-line map + 1-3 words + a curiosity line) in Test & Compare on the next
   upload, or on Arnold now. It is outside the frame study but has the strongest evidence and the highest impact (CTR is our failing
   stage).
2. **Odds counter at the start of moves 1-2** (candidate 3): medium impact, low cost, fits DATA_RULES 2. Read the move-start
   retention in Studio.
3. **Named move titles + matching chapters** (candidate 1): nearly free, one snapshot.
4. **One ink metaphor per move** (candidate 4) and a few props (candidate 5): snapshot plus two critics, a craft upgrade.
5. **Closing quote card** (candidate 7) only when a primary-source quote exists; a stamp instead of the bubble (candidate 6).
6. **Free monitoring, no change:** the retention dip at our 1b asks, to settle the "they have no asks" question with our own data.
- Dropped: candidates 2 and 8 (they conflict with 1a, and the evidence points the other way). Candidate 9 needs no test.
