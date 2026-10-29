# Review of STYLE_IDEAS.md (the 16 ideas), 2026-10-29

Reviewer stance: sceptical. An idea is worth doing if our own numbers support it or it applies a rule the owner has already approved.
An outside study counts only when it measures something close to "people keep watching a YouTube video". A study about learning,
charity giving or feature-film editing is a hint, not proof.

**What I checked myself:** I read all of `research/STYLE_IDEAS.md` and `research/STYLE_CRITIQUE.md`, STYLE_LOCK.md, HANDOVER §1, §6 and §10, PACKAGING_GUIDE,
LESSONS_PUBLISHING_AND_THUMBNAILS, TG_THUMBNAIL_TEXTS, and both analytics reads. On the Sherman files I checked
`sherman/youtube/youtube_title_and_description.txt`, `sherman/youtube/chapters.txt`, `sherman/build/chapters.txt`, `sherman/audio/timing.json`,
`sherman/archive.json` and the thumbnails. I took 22 frames from `sherman/build/sherman-720p.mp4` and 6 frames from the locked reference
`reference/style-reference-rokossovsky-v8.mp4` (`/tmp/claude-0/ideascritic_frames/`: `hook1.jpg`, `hook2.jpg`, `mid.jpg`, `ref.jpg`, `thumbs.jpg`).
I also ran my own motion scan (2 fps, 96×54 grey, mean frame difference below 0.35 against a median of 1.14). For the hook timings I compared the
locked reference hooks (`rokossovsky/audio/timing.json`, `meade/audio/timing.json`). I opened 8 of the cited sources: YouTube Help on
Test & compare and on key moments, the YouTube blog post on multi-language audio, 3Play/Verizon, the Cornell article on Cutting,
Search Engine Journal on 1of10, GIGAZINE on the MrBeast guide, and Nielsen's February 2025 report.

**Verdict counts:** 6 ADOPT (two of them with changes), 5 TEST FIRST, 5 REJECT.

---

## A. Factual errors and misread sources in STYLE_IDEAS.md

| # | Claim in the ideas file | What is actually true | Consequence |
|---|---|---|---|
| F1 | "Chapters: **5** dry labels" (table §0, idea 8) | Sherman already has **16 chapters** in `sherman/youtube/youtube_title_and_description.txt` and `sherman/youtube/chapters.txt`, and most of them already read as small hooks ("His Mistake at Kennesaw Mountain", "The Trap at Bentonville", "Two Wings, Two Targets"). The author read `build/chapters.txt`, which holds the 5 music sections. LESSONS 1.4 warns about exactly this mix-up (Meade). | Idea 8 is already done. |
| F2 | "Even woven, it cost 2.5 points (Thomas)" (idea 15) | The Thomas line used the old stock wording "If you enjoy these kinds of tactical breakdowns, consider subscribing". STYLE_LOCK 1b says this explicitly: "the 7:25 subscribe dip used the old wording, made before this section, so beat 1 stays as it is". **No live video has the locked wording yet.** Sherman, at 6:46.7, will be the first. | Idea 15 has no evidence behind it. |
| F3 | Seam dips "Morgan -4.7 at 6:35, Thomas -2.5 at 7:25, right at a move boundary" (idea 3) | Both dips are the **subscribe asks**, so this is the same data already used for idea 15, counted twice. Morgan's curve is flat (38-39 %) from 2:00 to 6:30, and that stretch contains seams without any dip. | Idea 3 has no seam evidence of its own. |
| F4 | "Per-sentence timings already exist" in `audio/timing.json` (idea 7) | Sherman's `timing.json` is **per paragraph only** (keys: section, tag, start, end, text; paragraphs of ~20-35 s). Its text is also normalised for TTS ("eighteen sixty-four"). | An SRT made from it would be badly timed. Upload the clean script as a transcript and let Studio auto-sync it instead (see idea 7). |
| F5 | "Sherman misses [the 0:45 preview rule] by about 35 s" | This is true against the rule. But **both locked reference hooks miss it too**: Rokossovsky v2 slams the name at 0:58.4 and Meade v3 at 1:02.9. Sherman (1:02.7) matches the references. STYLE_LOCK 1a contradicts itself ("Hook total ~60-65 s" and "moves previewed by 0:45"), and the 2026-10-28 stakes frame added about 9 s on top. | Idea 1 is a rule conflict the owner has to settle, not simply "missed by 35 s". |
| F6 | "Archive 2.3 % against the plan's ~20 %" | The ~20 % is HANDOVER §1's plan. The **locked reference** Rokossovsky has about 59 s of archive in 15:29 (≈ 6 %, 3 slots), and Meade has 48.5 s. | The real gap is Sherman's 22 s against about 60 s in the reference, not against 20 %. A sensible target is 6-10 %. |
| F7 | "Rokossovsky v8 alternates ... close-up **grey-green** and night beats" (idea 10) | The reference close-ups are **dark navy/slate** with glowing fronts (`ref.jpg`: Volokolamsk, Kursk, Bobruisk). Sherman's pale grey-green close-ups (e.g. the march map at 0:50 in `hook2.jpg`) are the drift. The critique's P10 is right. | Idea 10 must say "dark `_hd_ref` close-ups". |
| F8 | Verizon/Publicis: "80 % more likely to finish with captions; 69 % sound off in public" | The cited page (3Play Media, **a captioning vendor's blog**) contains **neither figure**. It reports n = 5,616 US adults aged **18-54**, April 2019, an online survey about mobile **ad** performance. The figures circulate from other write-ups of the same survey, and they are self-reported intentions. | The source does not support the claim. It is also outdated and from a vendor, and it excludes the 65+ viewers the ideas file says are our audience. |
| F9 | MrBeast guide: "re-engagement every ~3 min" | GIGAZINE's summary says "at 3 and 6 minutes", and it summarises a leaked document about entertainment videos; it does not quote it. | This is misquoted, and it is about a format far from ours. |
| F10 | Cutting et al.: "attention follows the rhythm of change, not raw cutting speed" | The Cornell article measures **shot lengths in 150 feature films** (a 1/f pattern). It **did not measure viewers' attention**: "Our result is not about goodness of films, but about the possibility of these films harnessing our attention." The article names only Cutting. | The study makes no claim about viewer attention, so it cannot be cited for one. |
| F11 | Nielsen: "Our audience skews older and watches on TVs" | Nielsen says YouTube viewing **on TV screens** by adults 65+ grew +96 % in two years. That is a growth rate across all of YouTube. It says nothing about our audience's age or device share. | Check our own Studio Audience tab (age, device type) before using this as a design reason (ideas 11 and "do not" #1). |
| F12 | Mayer's segmenting principle supports a ①②③ tracker (idea 14) | Segmenting means **learner-paced** chunks (the learner controls when to continue). It is not a progress indicator. | The principle is misapplied. |
| F13 | YouTube multi-language audio: "> 25 % of watch time" (idea 16) | The quote is correct ("as of July 2025"). But it is YouTube's own self-reported average over creators who **chose** to dub, mostly large channels with human dubs. It is not an incremental lift. | Treat it as an upper-bound hope, not an expected effect. |
| F14 | Test & compare (idea 9) | Correct: the winner is chosen by watch time, up to 3 variants. The ideas file leaves out that it is **desktop Studio only** and needs **advanced features** enabled. | Small omission. |
| F15 | Static stretches (idea 4) | Mostly reproduced. At my threshold I find 7:41-7:53.5, 8:23-8:29, 9:00-9:06.5, 9:33.5-9:42.5, 10:07-10:13, 11:13.5-11:19.5 and 15:22-15:29.5. I did **not** reproduce 12:57-13:05, or 9:56-10:07 as low motion. The list depends on the threshold. | The finding holds. Tune the tool's threshold on the reference video first. |

Sources that check out as cited: YouTube Help on key moments (Intro = retention at 30 s; a high value means the opening matched the title
and thumbnail), Test & compare (watch-time winner), and 1of10 via Search Engine Journal (faces matter depending on the niche; 300K videos).
That last one has **no history/education data**, so its only value for us is "don't drop the face on vidIQ's say-so".

---

## B. Verdicts, idea by idea

**1. Name slam + 3 moves by 0:40-0:45: ADOPT for the next script (it applies a rule). REJECT the retrofit to Sherman.**
"Moves previewed by 0:45" is an owner-approved rule (STYLE_LOCK 1a), so the next script should meet it. But the evidence is weaker than the
ideas file says. Thomas and Morgan both opened on a date with the promise late, so we cannot tell whether "the hero arrives late" or "the opening was dull"
caused the 0:45 bottom. Sherman already pays the promise by 0:14, and the locked references slam the name at 0:58-1:03 (F5).
Do not gut the Kentucky "INSANE" twist to get there: the critique calls it the best-designed sequence in the video, and Thomas's best-rated
moment was also the twist (0:47). Cut words, not action beats. Drop the "200,000 MEN / Secretary of War" detail, keep LEAKED + INSANE.
Re-rendering Sherman's hook-c/d costs a re-voice + splice + render for an unproven gain. Instead use Sherman as the **baseline**
(stakes + promise at 0:14, slam at 1:03) and compare the next video (slam ≤ 0:45) at 0:30, 0:45 and 1:00. The owner should also
fix the line "Hook total ~60-65 s" in STYLE_LOCK 1a so the lock stops contradicting itself.

**2. Stakes words in the first-second stamp, not the date: ADOPT (next video; optional for Sherman only if the hook is re-rendered anyway).**
Confirmed on frame 0:00.5: the largest text is "AUGUST 1864 · THE CIVIL WAR · YEAR FOUR", and the date scroll top-left already says AUGUST 1864,
so the stamp only repeats it. This is the same failure as "never a date + place first" (HANDOVER §10), only in text instead of voice. It costs one
string. The supporting statistic is bad (F8), but the argument doesn't need it: mobile Home-feed previews play muted with captions, so
on-screen words are what a scroller reads. Note that the Lincoln quote card ("EXCEEDINGLY PROBABLE ... NOT BE RE-ELECTED") is already up by 0:05, so the
gain is small.

**3. A cold open at the start of each move: REJECT the flash-forward. TEST FIRST a one-line open loop.**
The only evidence is the double-counted subscribe dips (F3), and Morgan's flat 2:00-6:30 shows that our move seams do not leak by themselves. A 5-8 s
"LATER" flash-forward breaks the chronology on a channel whose promise is "follow the move on the map". It also costs about 6 s of animation per move,
and TG does not do it. What is cheap and testable is a single open-loop sentence per move, script only and zero render cost.
**Test:** put it in at the move-2 and move-3 seams of the next video. Decide on the slope of the retention curve over the 20 s after each seam compared
with Sherman's same seams. Keep it if the curve is ≥ 1 point better at both seams. Treat smaller differences as noise.

**4. Static-stretch detector + "breathing camera": ADOPT.**
I reproduced the finding (F15), and the critique (P4) finds the same holds independently, which makes it one of the two strongest signals in this review.
It applies the existing "never more than 4 s without a change" rule, which so far is only checked in the hook. The tool is about 30 lines and runs on
previews. Two limits: low pixel change ≠ boring (a decision card needs reading time), and the fix should be a living map under the card +
card length = spoken length + 1 s. Do not add more motion graphics for their own sake. Calibrate the threshold so that the Rokossovsky reference passes.

**5. Archive punch-ins of 3-6 s inside the moves: ADOPT in a modified form (blocks, not punch-ins). TEST FIRST the punch-ins.**
Both reviews agree that archive nearly disappears after 1:47. That is a strong signal and it applies the locked archive look (0b item 8).
But adopt the critique's form: 3-4 blocks of 12-20 s at move boundaries, which the pipeline already supports (ARCHIVE paragraphs, archive.json),
with a target of about 6-10 % of runtime, the same as the reference (F6). The ideas file's 3-6 s overlays in the middle of a map paragraph need a new
assembler feature. They also cut away from the map while the viewer is tracking units, which is a real cost on a tactics channel.
**Punch-in test:** one 1-minute clip (Sherman 5:30-6:30 with the Barnard rail-yard insert) next to the current version. Only the owner's eye
decides it, because no metric can isolate a 4 s insert.

**6. The number card shrinks to a corner chip after ≤ 4 s: ADOPT, through the usual snapshot OK.**
Frames at 0:12-0:20 confirm it: the 98,797 card covers the top-right while four other text blocks are on screen, and the payoff move happens at the edge of the frame.
The critique (P6) asks for the same thing ("one text card at a time"), so two independent reviews agree. It changes the behaviour of a locked
hook element (not its look), so it goes through the test-before-applying snapshot. It costs a small helper option.

**7. Exact captions: ADOPT, with a corrected method.**
This needs no lock change, costs almost nothing, and protects credibility (Morgan's comments complained about names, and auto-captions will mangle
Oostanaula, Schofield and McAllister). It also improves what the muted Home-feed preview shows. The cited statistics don't support it (F8),
and per-sentence timings don't exist (F4). The cheapest correct method: upload the **clean script text as a transcript** (digits, real spellings) in
Studio → Subtitles → "Upload file → Without timing" and let YouTube auto-sync it, then spot-check 10 cues. LESSONS 1.1 already asks to list hard
names for captions, so this finishes an existing step.

**8. 10-14 curiosity chapters: REJECT (already done, F1).**
Sherman has 16 chapters that follow PACKAGING_GUIDE §5. At most, rename the four "Move N: ... (dates)" labels into hooks. The ideas file itself calls the
evidence mixed. Chapters also make it easy to skip the setup.

**9. Thumbnail = hook scene + 3-way Test & compare including an "own map" variant: TEST FIRST (needs the owner's approval for variant C).**
Part (a), the "mismatch", is overstated. The title promise ("Broke the Confederacy") is broad, and the March to the Sea is the most famous part of it.
The real problem is inside the thumbnail: the picture is the Atlanta swing and the text is the March quote. Part (b) is the right tool, and it is free.
Note that **Sherman's current A/B already are the "own map frame" variant** (black-and-white photo, interim because vidIQ has no credits). So the test runs itself:
when credits return on 22 Nov, upload the vidIQ colour version and keep the interim one as a variant.
**Test:** Studio Test & compare (desktop, advanced features): vidIQ A "MAKE GEORGIA HOWL" / vidIQ B "CUT LOOSE" / own-frame colour C.
YouTube's watch-time-share verdict decides. Only switch the channel default if C wins by the margin Studio reports as "preferred". A tie keeps the TG formula.
Separately, the critique's fixes to the interim frame (cut-off "LAST LINE INTO" label, flat grey face) can be applied at no risk.

**10. More changes of scale and colour per move: ADOPT (it applies 0b item 3 "wide → close → wide per move"), with the colour corrected.**
Both reviews agree (critique P3, P10). Minutes 8-14 are mostly red-washed wide frames. The correction (F7): the close-ups must use the dark
`_hd_ref` grade like the reference, not pale grey-green. The critique adds two points the ideas file misses: use option 2 or no fill for an
army marching through enemy country (no Union "capsule" territory), and never cross-fade two maps of different scale (14:30).
Night and rain stay where history supports them; don't add them just for variety.

**11. Bigger units, fewer words (pinned tags instead of captions): ADOPT the bigger units (to the reference size, about 2×, not 1.4×). REJECT replacing the captions.**
Unit size is the critique's top problem (P1): counters about 14-16 px at 720p against 32-40 px in the reference, which I confirmed in `ref.jpg` against Sherman's wide shots.
Matching the locked reference is not a style change. But the critique also found that the bottom caption bars are the **most phone-legible element**
in the video. Turning them into small pinned tags would make phone legibility worse. The Mayer redundancy principle is about learning, not about muted
scrolling. The TV/older-audience argument is unverified (F11).

**12. One named human per move: REJECT as a per-move rule.**
The cited study (identifiable victims) measures charitable giving, not watch time. The Thomas "best moment" was the *general's* paradox, not a
private soldier's. The idea adds 8-12 s × 3 of research-heavy material (diary quotes are a fact-check risk) to a format whose promise is
tactics. Where the research naturally gives a strong human beat (Ebenezer Creek is already in the Sherman script), show it with a real photo or
a letter card, as an archive block (idea 5). Don't make it a quota.

**13. Sound bridge (J-cut) + 1 s silence before the biggest reveal: TEST FIRST (a). REJECT (b).**
(a) is cheap (audio-only remix, locked sounds, only the timing moves earlier) and is ordinary craft, though there is no evidence for it.
**Test:** a 30 s audio-only A/B of the move-2 seam for the owner. The owner's ear decides. It is too small to show on a retention curve.
(b) touches the sound lock for almost no gain. With music at 0.08 and ducked under the voice, a 1 s music dip is barely audible. The flat mix
(LRA 2.7 LU, critique P12) comes from the limiter, not from the music.

**14. A ①②③ move tracker: REJECT.**
It is a new permanent element in a frame that already carries the date, legend, N arrow, scale bar, credit and badges. The critique's P9 already complains about
illegible clutter. The move title cards, the chapters and the progress bar already tell the viewer where they are, and the evidence is misapplied (F12).

**15. Spoken subscribe line ≤ 6 s: REJECT for now. Re-check once Sherman is live.**
The evidence is wrong (F2). The owner kept the line twice (2026-10-26). Sherman's woven line (6:46.7-6:59.7, 13 s) is the first live test of the
locked wording. If Sherman's dip there is > 2 points at day 7, bring this back to the owner with that number. If it is ≤ 1.5, drop the idea.

**16. Second-language audio tracks: REJECT for now.**
It is L effort for a channel with 2 videos that have data. Voice A is English-only, so the dub would use a different voice. Every stamp, card and caption
is English. The 25 % figure is self-reported and self-selected (F13). If reach becomes the goal later, first try YouTube's own automatic dubbing
(no pipeline work) on Morgan, and read watch time by audio track after 28 days.

---

## C. Where this agrees or conflicts with STYLE_CRITIQUE.md

| Topic | Ideas | Critique | Reading |
|---|---|---|---|
| Static holds under cards | 4 | P4 | **Agree. Strongest signal** (also reproduced by me) |
| Archive gap after 1:47 | 5 | P2 | **Agree on the problem.** Critique's blocks beat the ideas file's punch-ins |
| Number card / text overload in the hook | 6 | P6 | **Agree** |
| Unit size on phones | 11 (×1.4) | P1 (×2, to the reference) | **Agree on direction.** Use the critique's size |
| Scale and colour variety | 10 | P3, P10 | Agree on more close-ups; **conflict on colour** (critique right: dark grade) |
| Kentucky twist | 1: cut it to ~10 s | "Best-designed sequence ... a model for every twist" | **Conflict.** Tighten the words, keep the action beats |
| Bottom captions | 11: replace with pinned tags | "The most phone-legible element" | **Conflict.** Keep the captions |
| End screen collision | not covered | P5 | Critique-only. Cheap, applies STYLE_LOCK 1b, and Up Next was 12.7 % of Thomas traffic. **Do it** |
| Front width, cross-dissolves, tiny secondary text, capsule territory shapes | not covered | P7, P8, P9, P3 | Critique-only. All lock enforcement, worth doing |
| Thumbnail | 9 (test framework) | P11 (clean the frame, face, labels) | Complementary |

---

## D. Action plan for the NEXT video (max 8, in priority order)

1. **Story layer at the reference's on-screen size.** About 2× counters with readable unit names, more counters on close-ups, dark `_hd_ref` grade on close-ups,
   fronts that stay at the locked width 15 *on screen* (the Sherman lesson: 15·1.3/s). Bottom captions stay. Check every move sheet next to `ref.jpg`
   at 390 px wide. *Applies an existing rule (STYLE_LOCK 0b: match the reference).*
2. **Hook timing: name slam ≤ 0:45, snap cuts done by ~0:50.** Tighten the twist's words, not its action. Promise spoken by 0:15, as Sherman already does.
   Owner to remove the contradicting "Hook total ~60-65 s" line. *Applies an existing rule (STYLE_LOCK 1a, 0:45).*
3. **Run the static-hold detector on every scene preview.** No hold ≥ 5 s, living map + push-in under the decision/result/final cards, card length =
   spoken length + 1 s. *Applies an existing rule (STYLE_LOCK 1a "never more than 4 s").*
4. **3-4 archive blocks of 12-20 s at move boundaries** (Netflix look, no reused still, no grey pillarbox), about 6-10 % of runtime. *Applies an existing
   rule (STYLE_LOCK 0b item 8, HANDOVER §1).*
5. **Clear the last 20 s for the end screen.** Final card fades or shrinks to a top band at -20 s, NEXT chip gone before then, map keeps moving. *Applies an
   existing rule (STYLE_LOCK 1b ending).*
6. **One text block at a time in the hook.** First-second stamp = the stakes in 2-4 words (not the date), number card shrinks to a corner chip after
   its beat. *Needs owner approval (changes the behaviour of locked hook elements). Show one snapshot sheet.*
7. **Exact captions.** Upload the clean script as a transcript ("without timing", YouTube auto-syncs), check 10 cues and every hard name. *Applies an
   existing rule (LESSONS 1.1 upload settings; no lock touched).*
8. **Thumbnail Test & compare with 3 variants.** vidIQ formula A + B text + one own-map colour C. The watch-time winner decides. *Needs owner approval (changes a
   lock: the "vidIQ in one go" rule, test slot only).*

Not on the list on purpose: cold opens, a human per move, the tracker, the shorter subscribe line, the music dip and dubbing.

---

## E. What to measure in YouTube Studio (read at day 4, day 7 and day 28, same days as earlier reads; add a row to the HANDOVER §10 scorecard)

- **Intro key moment (retention at 0:30)** and the curve at **0:45 and 1:00**. Compare Sherman (baseline: stakes + promise at 0:14, slam at 1:03), the next video
  (slam ≤ 0:45) and Collins (the old-hook control). Targets ≥ 65 % / ≥ 55 %. Call a difference real only if it is ≥ 5 points at 0:30 (topics differ).
- **Mid-video slope, 2:00 to the last move** (points per minute). Morgan is the benchmark: flat 2:00-6:30, then about -1 pt/min. Archive blocks and the removal
  of static holds should show as a flatter slope, and as no local dips at 7:40-8:00-type card holds.
- **Local dips:** the subscribe line (first data on the locked wording: Sherman 6:47), the decision card, each move seam (≤ 1.5 points), the ending (≤ 3 points).
- **End-screen element click rate** and **Up Next / suggested** share of traffic (does the clean end screen send viewers on?).
- **CTR at ~1k and at ~10k impressions** (target ≥ 4 %), and the **Test & compare** verdict (watch-time share) once the vidIQ thumbnail is in.
- **Audience tab: age and device type** (TV / mobile / computer). This settles the "older viewers on TVs" assumption behind several ideas before anyone designs for it.
- **Advanced mode → Subtitles/CC:** the share of views with captions on, to see whether the exact-caption upload matters at all.
