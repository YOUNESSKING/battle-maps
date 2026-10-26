# Daniel Morgan: analytics after 4 days (read 2026-10-25)

Video: *Daniel Morgan's Top 3 Legendary Tactical Moves | The Man Who Destroyed Britain's Elite in 1 Hour*, published 2026-10-21.
The owner's report is copied below in full. Our analysis comes first, with timestamps checked against `audio/timing_cut.json` (v6 master).

## Scorecard
| | Thomas (3 days) | **Morgan (4 days)** |
|---|---|---|
| Impressions | 750 | **101,336** |
| CTR | 0.9 % | **4.21 %** |
| Views | 26 | **19,857** |
| Avg view | 5:49 (31 %) | **5:57 (33.8 %)** |
| Retention at 0:30 | ~65 % | **~60 %** (70.1 % at 0:21, 46.8 % at 0:42) |
| Retention at 1:00 | n/a | **~44 %** |
| Biggest drop | minute 1 | **0:10-0:42 (-40 points)** |
| Traffic | 89 % recommendations | 97.2 % browse (93.2 % Home) |

## What it means
1. **Packaging works.** The Tactical Genius title pattern + TG-style thumbnail took CTR from 0.9 % to 4.21 % and impressions from 750 to 101K. HANDOVER §10 and PACKAGING_GUIDE §2 are confirmed.
2. **Maps hold viewers.** 2:00-6:30 stays flat at 38-39 %, then about -1 % per minute. Keep the map format and pacing.
3. **The opening loses 44 %.** The Morgan script was written before the hook lock (STYLE_LOCK 1a) and was kept unchanged on purpose:
   - 0:00 "By the autumn of 1780..." (a date + context as line 1), 0:05.7 Charleston, 0:16 Camden, 0:26 British columns.
   - The title promise is only spoken at 0:34.9-0:54 ("And then, on a cold January morning..." / "In less than an hour...").
   - Morgan is named at 0:54.4; the three moves are previewed from 1:32.7; Move 1 starts at 1:38.
   - No number card, no camera dive (old-style hook, never re-rendered).
4. **The subscribe line costs ~5 points.** "If you enjoy this kind of tactical breakdown, consider subscribing..." runs 6:28.20-6:38.05; retention drops 37.2 % → 32.5 % at 6:35-6:50. (Owner decision 2026-10-26: keep the mid-video subscribe ask in the formula for now.)
5. **Voice.** Comments mention the synthetic voice and the name "Nathanael Greene". Kokoro reads it as `nˈæθɐnˌeɪl` ("NATH-an-ail"); spelling it "Nathaniel" gives `nɐθˈænjəl`, the right sound. Now in `tts/PRONUNCIATION.md`.

Caution: the report's example opening line ("he backed his men against a river, ordered a planned retreat...") must be fact-checked before use: the Broad River was miles behind the line, and the Continental fall-back at Cowpens came from a misunderstood order (only the militia withdrawal was planned; see HANDOVER §8.12).

## Rules adopted from this read (owner-approved 2026-10-26)
- Line 1 states the title's promise as a result, within 10 s; background ≤ 15-20 s and only after it (STYLE_LOCK 1a, HANDOVER §1).
- The three moves are previewed by 0:45 (STYLE_LOCK 1a).
- Retention targets: ≥ 65 % at 0:30 and ≥ 55 % at 1:00 (HANDOVER §10).
- Pronunciation check + 20 s names clip for owner approval before every narration (`tts/PRONUNCIATION.md`, HANDOVER 0b).
- Not adopted: dropping the mid-video subscribe ask; a voice-A-on-every-video rule change; trimming 6:28-6:38 on the live video.

---

## The owner's report (verbatim)

```text
VIDEO PERFORMANCE & AUDIENCE RETENTION DEEP ANALYSIS
Channel: Generals On The Map
Video: Daniel Morgan's Top 3 Legendary Tactical Moves | The Man Who Destroyed Britain's Elite in 1 Hour
Publish Date: October 21, 2026
Data Snapshot: First 4 Days Post-Launch
================================================================================

1. EXECUTIVE METRICS OVERVIEW
--------------------------------------------------------------------------------
* Total Views: 19,857
* Impressions: 101,336
* Click-Through Rate (CTR): 4.21%
* Average View Duration (AVD): 5:57 (33.8%)
* Total Watch Time: ~841.8 hours
* Traffic Source: 97.2% Browse features (93.2% YouTube Home)
* Engagement: 213 Likes, 8 Comments

Summary Assessment:
The packaging (title/topic) has strong appeal across the Home feed, resulting in
over 100k impressions. The core video delivers high satisfaction for viewers who
stay past minute 1, but significant viewer drop-off in the first 45 seconds limits
total watch time.


2. RETENTION CURVE ANALYSIS
--------------------------------------------------------------------------------
Key Retention Benchmarks:
* 00:00 (Start):        91.0%
* 00:10 (Initial Hook): 86.5%
* 00:21 (Setup Phase):  70.1%
* 00:42 (Trough):       46.8%  <-- Drop of 44.2% in under 45 seconds
* 01:03 (Stabilizing):  44.4%
* 02:00 - 06:30:        38.0% - 39.0% (Exceptionally flat, highly engaged)
* 06:35 - 06:50:        Drops from 37.2% to 32.5% (Mid-video CTA prompt)
* 07:00 - 15:30:        Gradual, natural decline (~1% per minute)

Key Findings from the Curve:
A. The Premise Lag (0:00 - 0:45):
   Losing 44% of your viewers before minute one is steep. The intro focuses on
   broad Southern Campaign lore (Camden, Gates) before introducing Daniel Morgan
   at 0:54. Browse viewers click with short attention spans and need immediate
   confirmation of the title's promise.

B. The Tactical Hold (1:00 - 6:30):
   Once Morgan's tactics and the tactical map animations begin, retention barely
   moves. This proves your visual maps, tactical pacing, and explanations are
   working exceptionally well.

C. The CTA Friction Point (06:35):
   A noticeable dip occurs right when the narrative pauses for a subscription
   reminder ("consider subscribing because the war was about to call him back...").
   Breaking the immersion of historical storytelling causes viewer drop-off.


3. AUDIENCE SENTIMENT & FEEDBACK
--------------------------------------------------------------------------------
* Positive Feedback:
  Viewers who stayed heavily praised the clarity of the tactical breakdowns, the
  battlefield maps, and Morgan's legacy.

* Friction Points:
  Multiple viewers specifically noted distractions caused by synthetic voice
  delivery and mispronounced historical names (specifically Nathanael Greene).
  In military history niches, pronunciation errors can hurt perceived authority
  and cause sensitive viewers to click away early.


4. ACTIONABLE IMPROVEMENT ROADMAP
--------------------------------------------------------------------------------
[PRIORITY 1: Invert the First 30 Seconds]
- Current Method: Chronological context first (Gates, Camden, British victories),
  then Morgan arrives.
- Improved Method: Start directly at the peak of the action:
  "At Cowpens, Daniel Morgan did what no commander dared: he backed his men
  against a river, ordered a planned retreat, and obliterated Britain's elite
  in under an hour."
- Follow with a 10-second preview of the 3 tactical moves, then transition to
  the background. Keep lore setup under 20 seconds.

[PRIORITY 2: Seamless Transitions Over Direct CTAs]
- Avoid halting battle suspense to ask for subscribers.
- Instead, weave calls to action into the narrative flow:
  "Morgan's trap changed the course of the South—and if you want to see how
  Greene built on this victory, subscribe for next week's campaign breakdown."
- Alternatively, keep CTAs focused at the conclusion of the video.

[PRIORITY 3: Phonetic Narration Corrections]
- If using text-to-speech tools, spell names phonetically in your script
  (e.g., enter "Nuh-THAN-yul Green" instead of "Nathanael Greene").
- Review key military terminology and historical figure pronunciations before
  rendering audio.
================================================================================
```