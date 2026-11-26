# Round 4 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_round4_720.mp4` (12:53.2, -14.0 LUFS; scene starts unchanged). Method: the round-3 word-level masking scan
re-run on the new `build/mix.wav` (voice x0.707, residual = mix minus voice; 2,029 words, flagged < 8 dB mean, then 50-ms listings at every flag
near a cue); frame-difference flash check at EVERY gun/volley cue of S01/S05/S06/S07 on `/tmp/wx_render5/SNN.mp4`; stills + 10-fps strips at
each changed spot (`/tmp/wx_critic_B4/`); seq.js diff 348a23f~1 -> HEAD.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | R3 | R4 | One line |
|---|---|---|---|---|---|
| S01 hook | 7.5 | 8.0 | 8.5 | 8.5 | 26.15 gun gone: "and not one American" now +36 dB, no sound under the 900 card. Plate "December 1776" on "dawn" (20.12). New cost: whoosh 12.45 now eats the tail of "Delaware." (the stakes line's place name). |
| S02 background | 7.5 | 7.5 | 7.5 | 7.5 | Unchanged, clean. |
| S03 move 1 | 7.0 | 8.0 | 8.0 | 8.5 | "ACROSS" now on "crossed" (125.52). Whoosh 1.2 moved the overlap from "Their" onto "simple." (no net gain). |
| S04 retreat | 7.0 | 7.5 | 8.0 | 8.0 | Unchanged. |
| S05 move 2 | 7.5 | 7.5 | 8.5 | 8.5 | Unchanged; all gun flashes on their sound (99.47, 100.90, 103.55 ...). "his" (main force) onset now +11 dB. |
| S06 trap | 7.0 | 8.0 | 8.5 | 8.5 | Clipped Washington banner fixed (in from 550.4, framed). "TEN DOLLARS EACH" on "ten" (8.24). Minor: Cornwallis banner enters cut at the TOP edge 552.4-553.0. |
| S07 move 3 | 7.5 | 8.0 | 7.5 | 8.5 | FLASH LAG FIXED: 51.23 -> 51.23, 74.38 -> 74.40, 87.0 -> 87.00, 90.4 -> 90.40 (all within 1 frame). New visible cost of the fix: the choice card dips at the S06/S07 join. |
| S08 ending | 8.0 | 8.5 | 8.5 | 9.0 | "2 TRENTON" now on "Two," (742.7). ~16 s clean map, subscribe on its word. |
| **Overall** | **7.3** | **7.9** | **8.2** | **8.5** | |

**Fit to publish? YES** (from the story/sync/sound side). The one sev-2 that a viewer can feel - S07's 11-frame bang-before-flash - is gone.
What is left is a 0.3 s card dip at a scene join and two whoosh tails; none breaks a rule a viewer would notice twice. Fix R4-1 if S07 is
rendered again anyway. Story, structure, facts and respect unchanged and still good (2,400 at 15.9 s, 900 + "not one killed" by 29 s, name slam
54.2 s, move 1 at 1:57.5, three set-ups paid off, no drunk-Hessian myth, the one quote sourced).

## Round-3 items

| # | Item | Status |
|---|---|---|
| R3-1 | S07 fx ~0.37 s late | FIXED. Flash check on `/tmp/wx_render5/S07.mp4`: volley 51.23 first flash 51.23; 74.38 -> 74.40; gun 87.0 -> 87.00 (n=598); gun 90.4 -> 90.40 (n=622); 82.0/82.3 on time. Cause and fix noted in S07 NOTES (decide card t 0.2). |
| R3-2 | S01 26.15 gun under the 900 card | FIXED (cue gone; 26.2-27.0 voice +19..+41 dB over the rest). |
| R3-3 | Whoosh tails on the next sentence's first word | PARTLY / traded. S01 12.45: "On" now +8.6..14 dB (was ~0) but the whoosh body (2.4 s sample, loud 0.3-1.6 s) now sits on the end of "Delaware." (12.80-13.15: -2 to -24 dB). S03 1.2: "Their" +3.5 dB (was 0.7) but "simple." -ple now masked (119.0-119.4: -7 to -11 dB). S05 32.25 unchanged; "his" onset +11 dB at 100 ms - acceptable. Root cause: the loud body (~1.3 s) is longer than the 0.5-0.7 s voice gaps; no placement fits. See R4-2. |
| R3-4 | S01 plate on "At" over the crossing | FIXED (month-only "December 1776" at 20.12 = "dawn"; reads over the last 0.2 s of the crossing dissolve - fine). |
| N9 | S06 Washington banner clipped bottom-left | FIXED (t0 51.0; 549.0 / 550.6 clean, framed from 550.4). |
| N11 | S03 "ACROSS" on "About" | FIXED (`.c1 .sd` at crossed2 - 0.1 = 125.52; header appears above the 9,000 without a layout jump). |
| N12 | S06 `ten`, S08 `two` | FIXED (8.24 at 507.67; 35.25 at 742.70 - frame 742.6 shows only card 1, 742.9 shows 2). |
| R3 #10 | Re-check the S06/S07 join | NOT OK - see R4-1. |

Full flash sweep (every gun/volley cue, all four battle scenes): every cue has a visible flash within -0.27..+0.07 s of its sound start (volley
ripple flashes inside the ripple window); the big frame changes at S05 99.20 / 100.97 and S07 82.0 are shot cuts, the guns at 99.45 / 100.9 flash
on their frames (99.47, 100.90). No sound without a visible cause found.

## NEW findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| R4-1 | S06/S07 join | S06 81.9-82.5 / S07 0-0.35 | 581.3-581.7 | The "WHAT WOULD YOU DO?" card dips at the dissolve: S06's card fades with the outgoing scene while S07's card only starts fading in at t 0.2 (moved there for the flash-lag fix). 10-fps strip: full 581.0-581.3, A/B boxes and note at ~30 % at 581.4-581.6, then A pops back to full and B lights blue at 581.7. Reads as a flicker right before the reveal. | Engine, not timing: give the washington `engage.decide` an `instant: true` option that `tl.set`s back, dim, card, both options, "OR" and note to their final state at `t` (no tween that starts before `t`, so nothing at negative time), then use S07 `t: 0, instant: true, tReveal: 0.45`. Re-render S07 and re-run the flash check (51.23 / 87.0 / 90.4 must stay within 1 frame). Alternative without engine work: S06 card and the S07 card both untouched, but set S07 `tA/tB/tNote: 0.2` (no separate 0.4 fade step) so the dip is one 0.2 s fade, not a dip + pop. | 2 |
| R4-2 | S01 / S03 | 12.45 / 1.2 | 12.45 / 118.72 | Whoosh body now on the sentence-final word: "Delaware." tail (the hook's place name, rule 1a "ending on the place name") 12.80-13.15 under the whoosh rise; "simple." 119.0-119.4. | Level is accepted (locked kit), so fix placement only: S01 `whooshAt: 12.75` (rise starts after "-ware" peaks; loud body 13.05-14.3 over the 13.2-13.9 gap, "On" gets the tail ~ +4 dB) - or keep 12.45 and accept. S03: back to 1.4 (round-3 value: "simple." clear, "Their" at +0.7) - "simple." matters more than "Their". Audio-only rebuild. | 1 |
| R4-3 | S06 | 53.0-53.6 | 552.4-553.0 | Cornwallis banner (top centre) slides in cut at the top frame edge for ~0.5 s before the camera settles. | Start it 0.6 s later (`t0` + 0.6) or 2 units south; audio-free, S06 re-render only if S06 is rendered again. | 1 |

Masking scan summary: of 2,029 words, real overlaps left are R4-2 only. Other < 8 dB flags are word-boundary artefacts (silence inside the
aligned word span: S05 "but" 440.4, S07 "and" 668.2, "door." 671.2, "The" 672.2, S06 "The" 542.8) or music under quiet word tails - same set as
round 3, unchanged by the S07 re-render (sounds did not move, only the flashes). Levels: voice ~20 dB over the music in quiet scenes; LUFS -14.0.

## Top 10 fixes

1. R4-1 S06/S07 join: `engage.decide` `instant` option (set, no backward tweens) -> S07 `t: 0, instant: true`; re-render S07; re-check flashes.
2. R4-2 S01 `whooshAt` 12.45 -> 12.75 (keep "Delaware." whole) - audio-only.
3. R4-2 S03 `whooshAt` 1.2 -> 1.4 - audio-only.
4. R4-3 S06 Cornwallis banner +0.6 s / 2 units south (only with a S06 re-render).
5. After 1: verify S07 51.23 / 74.38 / 87.0 / 90.4 flash within 1 frame (the lesson in S07 NOTES: no overlay tween below t 0).
6. After 2-3: re-run the masking scan on 12.4-14.3 and 118.5-120.4 (target: no 50-ms frame of a word below 0 dB).
7. Keep the S05 street-fight cues as they are (all flashes on their sounds; do not touch).
8. Keep the S01 hook timings (2,400 15.9 s, 900 + no deaths by 29 s) - no further changes needed there.
9. End screen: keep the ~16 s clean map; nothing to change.
10. Archive the flash-sweep script (`/tmp/wx_critic_B4/all.py`) idea into the build check: every gun/volley cue must have a frame-diff hit within 1 frame.
