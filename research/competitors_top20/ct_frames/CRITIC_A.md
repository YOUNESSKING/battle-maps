# CRITIC A: review of CT_FRAME_ANALYSIS.md (draft v1), 2026-11-07

**VERDICT: NO. Fix before it goes to the owner.** The structure, timestamps and most quotes hold up. Three claims are wrong or not supported, and they are the kind that would steer a decision: the speaking rate (theirs is NOT slower than ours), the causal "early move 1 makes them hold ~2x", and "they grow without a sponsor" (their newest video has a 90 s sponsor read). The fixes are small (see the end).

**Evidence used:** both raw `vidiq_video_watch` outputs (polled: Model `job_de289014…`, Napoleon `job_1d8727b3…`), both English transcripts (fetched once each with `vidiq_video_transcript`, 10 credits), `commandersandtactics.md` + `.json`, and our own calibration line in `research/START_BATTLE_15.md` (Cleburne: ~167 wpm with am_michael, pauses included).

**WPM check (transcripts, words counted between timestamps):** Model 2:50-4:24 = 246 words in 94 s = **157 wpm**. Napoleon 4:00-5:34 = 239 words in 94 s = **153 wpm**. Napoleon 0:00-0:31 = ~72 words = ~139 wpm (the slowest stretch, the hook). The averages over the whole video are lower only because of the music beats with no narration (the 23 s Goebbels cold open, 5-12 s at each title card, ~17 s of silence at the end of Napoleon).

## Claim-by-claim

| # | Claim in draft | Verdict | Evidence |
|---|---|---|---|
| 1 | Model cold open = 23 s real archive (Goebbels), red-tinted rounded frame, German audio + subtitles, quote "defend it like a fortress to the last breath" | OK (AI only) | Shot list 0:00-0:23; the transcript starts at [0:22], so there is no English narration before then. The audio and subtitle wording are AI-reported and not checked. |
| 2 | Model 0:23 3D globe, red/blue arrows, fortress icons | OK (AI only) | Shot list 0:23-0:34. |
| 3 | Model general named 0:35, "Hitler's Fireman", archive film of Model in a trench | OK | Transcript [0:22] segment: "Walther Model became known as Hitler's fireman" (~0:32-0:37). Shot list 0:34-0:46. |
| 4 | Model promise ~1:00 "Let's take a closer look…" | OK (±5 s) | In the transcript segment [0:55]-[1:13] the line comes at its end, ~1:05; the shot list puts it at 0:56-1:06. |
| 5 | Model move 1 title card at 1:06 | OK | Shot list 1:06-1:14; narration resumes at [1:13]. |
| 6 | Model title cards: greyscale photo, white serif + red Place/Year, the three titles | OK (AI only) | Shot list 1:06, 6:48, 11:51. The draft does not say that **none of the three labels is spoken** (transcripts) or that each card plays in a narration gap of ~7-12 s (6:46-6:58, 11:48-11:58). |
| 7 | Napoleon 0:00-0:06 portraits Rommel, Montgomery, Hitler, Patton, "all had a strong fixation on Napoleon" | OK | Transcript [0:00] (ASR: "RML") and shot list. |
| 8 | Napoleon "stakes" row 0:06-0:21, quote "still studied in military academies 200 years later… what made him so legendary?" | OK content / quote stitched | The transcript has two sentences merged into one quote: "Even more than 200 years after… modern military leaders still study his campaigns" + "continues to be studied in military academies". This is legacy/curiosity, **not stakes**, so the row label is misleading. |
| 9 | Napoleon promise 0:22 "three phenomenal tactical manoeuvres… still shapes modern strategy" | OK | Transcript [0:00] segment, last sentence; shot list 0:21-0:31. |
| 10 | Napoleon move 1 card 0:32, cards "Divide & Conquer / Montenotte 1796", "The Perfect Envelopment / Ulm 1805", "The Perfect Trap / Austerlitz 1805" + sub-bass thud | OK (AI only) | Shot list 0:32, 3:55, 7:10. None of the labels is spoken (transcript). |
| 11 | Inside a Model move: macro map -> tactical satellite -> archive + hard number "almost 1,000 Soviet casualties every single hour", "17,000 Allies killed or wounded" | OK | Transcript 4:24-4:41 ("up to 200,000 killed or wounded in the mere 10 days… almost a thousand Soviet casualties every single hour") and 18:07 ("over 17,000 Allies killed or wounded"). The numbers are spoken; the shot list shows no on-screen number card for them. |
| 12 | Napoleon troop counts that add up on screen, 38,000 vs 25,000 + 30,000 -> 55,000 | OK as AI report, **partly unspoken** | Shot list 1:04-1:47. The transcript speaks 38,000, 25,000 and 30,000 but **never says 55,000**: the sum appears on screen only. Under our STYLE_LOCK 1c, a copy must speak the sum. |
| 13 | One-line lesson "dividing his enemies, striking rapidly and decisively, and using deception" | OK | Transcript [3:28]. |
| 14 | No mid-video asks in either video, outro only | OK | Both transcripts. |
| 15 | Model ending ~25 s over archive, 2 questions + soft subscribe | OK | Transcript 18:33-18:45 (spoken ~12 s); shot list 18:35-19:00. |
| 16 | Napoleon ending: quote typed on a dark still | OK, detail | Shot list 10:40: "cinematic silhouette… night campfires" (possibly a film still) plus the typed quote. **The quote is not narrated** (transcript): it is on-screen text only, under the outro questions. Audio falls silent at ~10:52 (≈17 s of silent end screen). |
| 17 | General named within ~35 s; move 1 at 0:32-1:06 | OK | Rows 3, 5, 7, 10. |
| 18 | Move titles are "named like chapters with an emotional label" | OVERSTATED (mild) | "Meatgrinder" and "Corridor of Death" are emotional; "Divide & Conquer" and "Perfect Envelopment" are descriptive. More importantly, the labels are never spoken. |
| 19 | Scale ladder "in every move", props: mines, wire, AT obstacles, canvas boats, crossed sabres | OK, with one fix | Shot list 3:00-3:17, 2:28 (sabres). The canvas boat is a **photo inset** of a real boat (16:39), not a drawn map prop. |
| 20 | Visual metaphors: checkerboard lattice, funnels/kill zones with dashed fire lines, fog question marks | OK (AI only) | Shot list 3:17-4:22 (Model), 8:44-8:54 (Napoleon). The checkerboard is also spoken (transcript 3:30 "checkerboard-like pattern"), so it meets 1c. |
| 21 | People: cut-outs of Zhukov, Stalin, Montgomery, Frost; speech bubble "Monty, you're nuts!"; Frost's last message as text; Hitler handshake + Knight's Cross | OK | Shot list 1:33, 10:49, 11:58, 14:50, 12:42, 17:06, 11:35. The bubble and the Frost text are **both read by the narrator** (transcript 12:46, 17:18), which supports candidate 6. |
| 22 | Archive/film B-roll between map beats "every ~30-60 s" | OVERSTATED for Model | Model has ~12 archive blocks in 19 min (0:46, 2:07, 4:22, 4:47, 6:20, 6:56, 7:49, 11:18, 13:06, 13:27, 15:34, 18:12), each 10-40 s: about one every 1-2 min, with longer map-only stretches in move 3. Napoleon cuts to paintings or film every ~10-30 s. |
| 23 | Napoleon film clips from Napoleon (2023) and Waterloo (1970) | UNSUPPORTED (AI identification) | AI-only identification. The draft's caveat covers this, but the copyright warning should rest on "looks like feature film" rather than on named titles. |
| 24 | **Pacing ~130-140 wpm (slower than ours at ~150-160)** | **WRONG** | Measured narration: 157 wpm (Model), 153 wpm (Napoleon). Our calibration is ~167 wpm (Cleburne, START_BATTLE_15.md), not "150-160". The 130-140 figure is the AI's guess. It also contradicts our own earlier study (160-170). Correct reading: **about the same speed as ours (~150-160 vs ~165), with more music-only breathing beats.** |
| 25 | "a change every 2-6 s, no static shot over ~5 s, continuous slow camera drift" | UNSUPPORTED / OVERSTATED | AI self-estimates: Model "2-4 s", ASL "4-7 s"; Napoleon "3.5-6 s", longest static "4.5 s". The same shot list has single map shots of 37-41 s (3:17-3:54, 7:08-7:49, 15:34-16:13). So "change" means an element moving inside a shot, not a cut. Say so, and label it an AI estimate. |
| 26 | No sponsor/subscribe interruption in either video | OK for these 2 | But see #33. |
| 27 | Ours better: they promise at ~0:22-1:00, Napoleon opens on name-dropping | OK | Rows 4, 9. |
| 28 | Theirs: "flags on units, mixed map styles, dashed arrows, overlapping dots" | Partly WRONG | Their arrows are solid curves; the dashed lines are fire/ballistic lines (shot list 3:54, Map Craft). The mixed map styles are **Napoleon only** (satellite + 2D political + parchment). Model is consistently dark satellite. The "AI critique calls it inconsistent" refers to Napoleon. |
| 29 | Ours: mid-move engagement; theirs: none; effect unknown | OK | Honest hedge. |
| 30 | Candidate 2: open on the general's real world (Model's speech) | Framing WRONG | The Goebbels speech is not Model's world, it is the regime's. It runs 23 s, not 3-6 s, and it is archive film first, which breaks our "opens on an animated map" rule (the draft does handle that). Napoleon opens with portraits, not a primary source. The candidate is fine as our own idea, but it is not what they did. |
| 31 | Candidate 3: troop counts that add up | OK, add the fix | Must speak the total (see #12). |
| 32 | **Candidate 8: "theirs starts at 0:32-1:06 and they hold ~2x their median"** | **UNSUPPORTED / causal OVERSTATED** | "2x the median" is a **view** count (Model 1.99x, Napoleon 3.26x), not retention: we have no retention data for them. The same channel's formula starts move 1 early in its flops too (Lee 0.17x, Alexander 0.57x share the format; Manstein goes straight into move 1). Our own earlier study credits name demand, thumbnail and era. Drop the causal link; keep "test only". |
| 33 | **Candidate 9: "they prove a Top-3 channel can grow without [a sponsor]"** | **WRONG / OVERSTATED** | `commandersandtactics.md` §5: their newest video, Manstein (Oct 2026, 1.93x), has a ~90 s Freecash read inside move 1 (2:30-4:10). They grew without one and have now added one. Rephrase. |
| 34 | Do-not-copy: "Nazi-leader portraits as hooks (Model's opening is Goebbels)" | OK, incomplete | Napoleon's first 6 s also show a Hitler portrait (0:02-0:06). |
| 35 | Method caveat | Mostly honest, not enough | The caveat says times are ±2 s and nothing was checked against real frames. **Missing:** (a) the AI also produces numeric estimates (wpm, ASL, "no static shot") that are guesses, and wpm proved ~15 % wrong; (b) its narrator quotes are paraphrased and elided ("…"); (c) the "transcript cross-check" cites `commandersandtactics.md`, which had **no Napoleon transcript**, said "no on-screen title card is described" and "20-40 s silent gap", and gave 160-170 wpm. The draft contradicts all three without saying so. (d) Transcripts are auto-captions with ASR errors ("RML", "Monteneath", "Protzen"). |

## Missed in the raw evidence (worth adding)

1. **Narration gaps at each title card:** the narrator stops for ~5-12 s per card (Model 6:46-6:58, 11:48-11:58; Napoleon 0:31-0:36, ~3:54-4:00), with a sub-bass hit and music. This "breath" beat conflicts with our "something new every 2-4 s" rule. Note it, don't copy it blindly.
2. **Labels on cards are never spoken.** This matters for candidate 1 under STYLE_LOCK 1c.
3. **Bridge/cliffhanger line closing each move** (an open loop into the next): "Model would be sent to confront a catastrophe on a scale never seen before…" (6:31), "He would now be sent to the Western Front to deal with… Eisenhower and Montgomery" (11:45). This is a retention device we can copy at no cost.
4. **The thumbnail promise is paid off in the narration:** the thumbnail asks "Prolonged WW 2 by a YEAR?"; the narration answers with "prolong the war by a staggering margin" at ~0:42 and "hold off the Soviet Army for up to another year" at ~11:30.
5. **Stakes do appear, inside each move rather than in the hook:** "the entire German Army Group Center could literally collapse" (2:30), "Stalin's army might reach Berlin by the end of the summer" (7:35), "end the war by Christmas" / "strangled in just a single choke point" (12:35, 13:15). Section 3 implies they have no stakes at all; they have them per move.
6. **Turning a total into a vivid rate:** "to put the sheer brutality… into perspective… almost a thousand… every single hour" (200,000 over 10 days, re-expressed per hour).
7. **Set-up and pay-off inside a move:** Eisenhower's warning (12:46) is paid off with "as Eisenhower predicted, huge amounts of armor… had to be left behind" (16:31).
8. **A personal-habit segment about the general** (~30 s at 4:47-5:19): Model scouting by plane and landing to move MG positions, compared with Rommel's half-track. Also the Tafelberg Hotel moment, where Model thought the landing was an attempt to capture him (14:30). These are human details mid-move.
9. **Honesty hedges that build trust:** "which was likely exaggerated for propaganda effects" (Austerlitz ice, 10:10); "some arguments are, of course, made that Stalin deliberately held off reserves" (10:48). This fits our FACT_NOTES discipline.
10. **First-person narrator:** "There are certainly many battles I could have begun with, but I chose Montenotte because…" (0:36); "which commander should I cover next?"
11. **Sound design (Napoleon):** a distinct SFX for every map action (musket fire on feints, sword clang on crossed sabres, water under river shots, metal clang when roads are sealed, ice cracking, an underwater sound, wind in winter) plus music that changes per beat. Model is sparse (artillery rumble; the AI lists "underutilized sound" as a weakness). The draft says nothing on sound beyond the card thud. Note: under our lock this is "do not copy" (no synthesized ref sounds), but the owner should see it.
12. **Text styles:** blue serif captions top-left naming each painting ("Colonel Rampon defending Monte Legino…", "The Chaos at Mondovì", "Austerlitz: The Pratzen Heights today"); a calligraphy date caption ("ROYALIST INSURRECTION / 5 October 1795"); troop numbers in a bold serif coloured by side.
13. **Modern-day location footage** (Pratzen Heights today, 7:46), and **inset photos of real objects on the map** (canvas assault boat 16:39, Jagdpanther 17:39). Our maps could take an inset of the real object in 3D-depth archive style.
14. **Archive PiP inside rounded, glowing red/blue frames placed over the map sector** (Model, throughout), and a **round portrait icon of the general at his HQ on the map** (14:20).
15. **Move length and order:** Model's moves run ~5:40 / ~5:00 / ~7:00, with the most famous battle (Arnhem) last and longest. Napoleon's run ~3:20 / ~3:15 / ~3:30.
16. **Background sits inside move 1, not before it** (Napoleon 0:50: the 1795 uprising and his promotion). This is consistent with our ≤20 s background rule.
17. **Silent end screen of ~17 s** on Napoleon (audio to silence at ~10:52).

## Concrete fixes

1. Replace the pacing line with: "Narration ~150-160 wpm when speaking (measured: Model 157, Napoleon 153), about the same as ours (~165, Cleburne calibration), with music-only beats of 5-23 s (cold open, each title card, outro). Shot-change figures (2-6 s, no static >5 s) are the AI's estimates; the shot list itself has single map shots of 35-40 s with motion inside them."
2. Candidate 8: delete "and they hold ~2x their median". Write instead: "Their move 1 starts at 0:32-1:06 in hits and flops alike; we have no retention data, so this is a test idea, not a finding."
3. Candidate 9: "They grew to ~0.5-0.8M views per hit without sponsors; their newest video (Manstein, Oct 2026) added a ~90 s sponsor read inside move 1. Keep ours sponsor-free."
4. Candidates 1, 3 and 7: add "they show it without saying it (card labels, the 55,000 sum, the closing quote); under 1c we must speak it."
5. Candidate 2: reword to "a famous primary-source line read over the map", and drop "the general's real world" (Model's open is Goebbels, 23 s, film-first).
6. Section 3: "dashed arrows" -> "dashed fire lines". Say that the mixed map styles are the Napoleon video only. Change the Napoleon "stakes" row to "legacy/curiosity".
7. Section 2: archive "every ~30-60 s" -> "Model about every 1-2 min (10-40 s blocks); Napoleon a painting or clip every ~10-30 s". Canvas boat = photo inset.
8. Add the missed items above, at least 3, 4, 5, 6, 7, 9 and 11, as candidates or notes.
9. Method caveat: add (a)-(d) from row 35. State that both transcripts were checked (this review), and that the draft corrects three points of the earlier study (title cards exist; gaps are ~5-12 s, not 20-40 s; wpm is ~155, not 130-140 or 160-170).

## Round 2 (v2 re-check, 2026-11-07)

**VERDICT: YES. v2 is accurate enough to give the owner.** All nine Round 1 fixes are in: wpm, the dropped causal claim, the Manstein sponsor, the unspoken labels/sum/quote, the reworded cold-open candidate, dashed fire lines, mixed maps (Napoleon only), archive frequency, and the method caveat (a)-(d). The new numbers check out against the raw outputs. Move lengths: Model 5:41 / 5:02 / 6:44, Napoleon 3:22 / 3:14 / 3:29. "Ours 159-176 wpm" is sourced in CRITIC_B.md. The cited STYLE_LOCK rules (no globe, open on the 2D map) exist.

Remaining real errors, all small (fix in one line each, not blocking):
1. **§2 header "all verified in the shot lists/transcripts" overstates.** The visual items (lattice/funnel/question-mark drawings, props, glowing PiP frames, sound effects per action, film clips) come from the AI watcher only; transcripts cannot verify visuals. Write "spoken items verified in transcripts; visual items are AI-reported".
2. **§2 names the feature films as fact** ("Napoleon 2023, Waterloo 1970"). That is the AI's identification. Write "clips that look like feature films (AI names Napoleon 2023 / Waterloo 1970)".
3. **§1 Napoleon "move close" row:** the one-line lesson closes move 1 only. Move 2 closes on the Mack anecdote ("seen the world collapse on him") and move 3 on the legacy line ("most feared and respected general").
4. **Minor:** the Napoleon card pauses are ~4-6 s (0:31-0:36, 3:54-4:00, ~7:09-7:13), shorter than Model's ~8-12 s. "Same pause" is close enough.
