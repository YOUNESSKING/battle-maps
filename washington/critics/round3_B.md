# Round 3 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_round3_720.mp4` (12:53.2, -14.0 LUFS; scene starts unchanged). Method: a word-level masking scan of the whole film
(voice stem x0.707 fitted against `build/mix.wav`, residual = mix minus voice; 2,029 words, flagged at < 8 dB mean or < 3 dB 50-ms peak,
then 50-ms frame listings at every flag to tell real overlaps from word-boundary artefacts); every cue in `scenes/SNN/cues.json` listed against
the words around it; flash detection (frame-difference) on the scene renders `/tmp/wx_render4/SNN.mp4` at each gun/volley cue; stills and
crops at every round-2 spot (`/tmp/wx_critic_B3/`); seq.js diff 9046bdd -> HEAD for S01-S08.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | R3 | One line |
|---|---|---|---|---|
| S01 hook | 7.5 | 8.0 | 8.5 | Trenton fire now only in the gaps with a visible flash at 22.45; "dawn", "In about", "some", "These" clear; plate "dawn" (no 25). Left: the 26.15 gun fires under the 900 / "Hessian prisoners" card (muzzle hidden). |
| S02 background | 7.5 | 7.5 | 7.5 | Unchanged, clean. |
| S03 move 1 | 7.0 | 8.0 | 8.0 | "commander, General William Howe" now clear (5.8 / 16.6 dB); the whoosh tail moved onto "simple." / "Their" (~0-1 dB at the onset). "ACROSS" still on "About". |
| S04 retreat | 7.0 | 7.5 | 8.0 | Stale "8 Sunday" plate gone ("December 1776" from 35.2). |
| S05 move 2 | 7.5 | 7.5 | 8.5 | Street fight fixed: one boom-less gun on "fired", the rest in the gaps, every gun with a flash on its sound (99.43, 100.90 ...). Marblehead label on "saved". Whoosh tail still on "his" (main force). |
| S06 trap | 7.0 | 8.0 | 8.5 | Waves 2-3 now start after "times." / "fire." (voice silent under them). Washington banner still clipped bottom-left at the bridge. |
| S07 move 3 | 7.5 | 8.0 | 7.5 | Banner gone from under the choice card; Nassau Hall gun moved to 87.0 and on screen. NEW (also present in round 2, missed): S07's 3D fx run ~0.37 s late - every volley and both guns flash 0.35-0.37 s AFTER their sound. |
| S08 ending | 8.0 | 8.5 | 8.5 | Unchanged; ~16 s clean map at the end, subscribe on its word. "Two," numeral 0.21 s early (minor). |
| **Overall** | **7.3** | **7.9** | **8.2** | |

**Fit to publish? NO, but only one sync fix away:** the S07 fx lag (R3-1) is the one thing a viewer will feel (11 frames between bang and flash
on every shot of the Princeton climax). Fix it with one S07 re-render and an audio rebuild. Everything else is sev 1 and can wait.
Story, structure, facts and respect are unchanged from round 2 and still good (2,400 at 15.9 s, 900 + "not one killed" by 29 s, name slam 54.6 s,
move 1 at 1:57.5, three set-ups paid off, no drunk-Hessian myth, the one quote is sourced).

## Round-2 items

| # | Item | Status |
|---|---|---|
| N1 | S01 Trenton gun before Trenton visible, fire on "dawn" / "In about" / "some" | FIXED (gun + 3 volleys 22.45-22.95, flash at 22.47; "In" 10.5 dB, "about" 16, "some" clear). Side effect R3-2 (26.15 under the card). |
| N2 | S05 street-fight wall of guns | FIXED (worst word now "but" 440.55: the 103.85 boom ends before it, ~9 dB; flashes on every gun) |
| N3 | S01 orchard gun on "These" | FIXED (field shot dropped, volley ends 67.98; "These" 32 dB) |
| N4 | S06 waves 2-3 on word tails | FIXED (voice silent 545.3-546.05 and 549.35-550.5 under the waves) |
| N5 | S07 Nassau Hall gun before its shot | FIXED for placement (87.0, on screen) - but the flash is 0.37 s late, see R3-1 |
| N6 | Whoosh placement | PARTLY: the key words are clear now (Howe +12 dB, "main force" +6), but the 1 s body still reaches the next word's onset: S01 "On" (~0 dB at 13.95), S03 "Their" (0.7), S05 "his" (0.6). See R3-3 |
| N7 | S01 plate "25" over Trenton | FIXED ("December 1776 / dawn"; "Christmas night" note on "Christmas") |
| N8 | S07 banner under the choice card | FIXED (t0 2.1; 581.8-583.8 clean) |
| N9 | S06 banner clipped at the bottom-left edge | NOT FIXED (548.9 / 549.35: only pole + name tab in the corner) |
| N10 | S04 "8 Sunday" plate over the winter posts | FIXED |
| N11 | S03 "ACROSS" header on "About" | NOT FIXED (`.c1 .sd` still `T.about - 0.1`; the `.vr` line was changed instead) |
| N12 | small 1c slips | PARTLY: Marblehead label now 50.5 (on "saved") and `colonel2` 108.85 FIXED; S06 `ten` 8.13 (word 8.24) and S08 `two` 35.04 (word "Two," 35.25) NOT FIXED |

## NEW findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| R3-1 | S07 | 51.23-90.4 | 632.5-671.7 | The 3D fx in S07 run ~0.37 s behind the scene clock: measured on the render, volley 51.23 -> first flash 51.60, volleys 74.38 -> 74.73, gun 87.0 -> flash 87.37, gun 90.4 -> 90.77 (the round-2 render shows the same 90.77). Overlays are on time (plate "3 Friday" rolls 33.17 vs 33.15), and S01/S05/S06 fx are in sync (22.47, 99.43, 43.00). So every Princeton shot is heard 11 frames before it is seen. | Likely cause: S07 is the only scene with fx children at negative time - the four `campfires` with `t0: -1` (lines 104-108; the S07 NOTES already warn that a negative child shifts the timeline). Set them to `t0: 0` (they sit under the choice card / dissolve anyway), re-render S07, re-run the flash check (`fl.py` style frame-diff at 87.0 / 90.4 must flash within 1 frame). Do NOT just shift the audio +0.37: the 87.37 boom would land on "surrendered". | 2 |
| R3-2 | S01 | 26.15-26.6 | 26.15-26.6 | Second Trenton gun fires while the "900 / Hessian prisoners" card covers the gun's muzzle (only an orange glimmer under the label) - a sound over a card without a clearly visible cause (1c); its boom 26.45 also runs into "and not one American" (onset ~5 dB). | Drop shot 26.15 (keep `shots: [22.45]`); the 22.45 gun + volleys carry the attack. | 2 |
| R3-3 | S01/S03/S05 | 13.95 / 2.48 / 33.03 | 13.95 / 120.0 / 369.5 | Whoosh tails still meet the first word of the next sentence ("On", "Their", "his": residual = voice at the onset). Big improvement over R2; gap after the dive is only ~0.5-0.7 s, shorter than the ~1 s whoosh body. | Either accept, or `whooshAt` another 0.2 s earlier (S01 12.45, S03 1.2, S05 32.05) so the tail sits on the sentence-final word ends instead of the next sentence's first word. Level unchanged. | 1 |
| R3-4 | S01 | 19.91 | 19.91 | Plate rolls to "dawn" on "At" (T.dawn = 19.96 is the "At" start) while the night crossing is still on screen (Trenton fades in ~20.35). | `T.dawn - 0.05` -> `20.12` ("dawn") or `CUT_C + 0.1`. | 1 |

Masking scan summary: of 2,029 words, the only real overlaps left are R3-2/R3-3 above; other flags were word-boundary artefacts (silence inside the
aligned word span: S07 "and" 86.86-87.50, S05 "but", S06 "times."/"fire.") or music under quiet word tails (S01 "fight." 29.0, S05 "it." 461.5) - not cues.
Levels: voice ~20 dB over the music in quiet scenes; LUFS -14.0; no other sound over a card.

## Top 10 fixes

1. R3-1 S07 fx clock: campfires `t0: -1` -> `0`, re-render S07, verify flashes on 51.23 / 74.38 / 87.0 / 90.4 within 1 frame.
2. R3-2 S01 drop the 26.15 Trenton gun (under the 900 card).
3. N9 S06 hide the Washington banner 40.0-51.0 (or move it 3 units north) - clipped at the bottom-left edge.
4. R3-3 whooshes 0.2 s earlier (S01 12.45, S03 1.2, S05 32.05) or accept.
5. N11 S03 `on(".c1 .sd", T.crossed2 - 0.1)` - "ACROSS" 3.9 s before "crossed".
6. N12 S08 `two` 35.04 -> 35.25 (the numeral before "Two,").
7. N12 S06 `ten` 8.13 -> 8.24.
8. R3-4 S01 plate "dawn" on "dawn" (20.12), not on "At" over the crossing.
9. After R3-1: re-run the masking scan on S07 (the flashes will move, the sounds stay; no word change expected).
10. Re-check the S06/S07 join once S07 is re-rendered (card dip at the dissolve, plate continuity).
