# Round 2, Critic B (STORY + SYNC + SOUND): Andrew Jackson 3D film

Input: `/tmp/aj_build/jackson_round2_720.mp4`, `/tmp/aj_render2/S01-S08.mp4`, `build/mix.wav` (17:45, the round-2 mix),
`build/troop_stem.wav` + log (17:18), `scenes/SNN/cues.json`, the sequences' "Round 1 fixes" notes.
Same methods as round 1:
- per-word voice-vs-background SNR (mix minus voice);
- per-section loudness (EBU R128);
- shot-vs-flash matching (frame-difference spikes, then 5-fps sheets on every miss);
- contact sheets every 2 s plus exact frames at each round-1 sync point.

Work files: `/tmp/aj_critic_B/r2/`.

## Scores

| Scene | R1 | R2 | One line |
| --- | --- | --- | --- |
| S01 hook | 7.0 | 8.0 | 5,000+ on "five thousand", the plate rolls on "eighth", the hook's key lines are now clear, calm title line. The white-out is kept (owner's choice, not scored) |
| S02 Creek War | 5.0 | 6.5 | Beats every 2-4 s now (militia tag, march arrow, Old Hickory, Creek Nation tint). The map texture is still the weak point (bake, Critic A) |
| S03 Horseshoe Bend | 7.5 | 8.0 | The opening push-ins make the plan readable; charge narration clear; "Next: the British come" |
| S04 British come | 6.5 | 7.5 | Lake Borgne: both sides fire, the boats grey on "captured"; the route starts on "wherever" |
| S05 night attack | 7.0 | 8.0 | Keane banner + HALTED on the British side; second beat in the decision card; the method card types only the new line; melee lighter |
| S06 mud line | 7.0 | 8.0 | Carolina burns and sinks on her words; duel guns end before "shot most of them to pieces" |
| S07 8 January | 7.0 | 8.0 | The ladders payoff is now heard (one sparse volley every 3 s); method card correct; fog lighter |
| S08 ending | 7.5 | 8.0 | Unchanged and fine; ~17.5 s clean living map |
| **Overall** | **6.8** | **8.0** | |

**Fit to publish? YES**, on story, sync and sound. The items left below are polish (severity 1). None blocks.

## Sound: re-measured

| Measure | Round 1 | Round 2 |
| --- | --- | --- |
| Words with SNR < 10 dB (of 2,261) | 254 | 144 |
| Words < 6 dB | 146 | **57** |
| Words < 3 dB | 80 | **29** |
| Median word SNR | 25.4 dB | 25.7 dB |
| Voice minus background, S01 (LU) | ~12 | 12.4 |
| S03 | 14.5 | **19.7** |
| S05 | 12.4 | **17.1** |
| S06 | n/a | 16.4 |
| S07 | **7.1** | **14.1** |
| Music only (S02) | 22.8 | 24.6 |

- **Character of the remaining low-SNR words:** nearly all are short, single function words or sentence-final syllables ("and", "the",
  "of", "it."), some measured on the voice's own decaying tail. The round-1 runs of masked content words are gone: the hook number line,
  "These are... three greatest tactical moves", "The Thirty-ninth United States Infantry", the ladders payoff, "shot most of them to
  pieces".
- **Short dips that remain (2-3 words, all severity 1):**
  - S05 77.9-81.8 (film 454.5-458.4): "while", "the British" at -1 to 0 dB;
  - S07 51.8-52.0 (679.1-679.4): "after rank" at -1 to 3 dB;
  - S07 64.9 (692.3): "it." at -6 dB;
  - S07 71.9 (699.3): "them." at -4 dB;
  - S07 93.5 (720.9): "Their" at -0.5 dB;
  - S07 104.7 (732.1): "it," at -3 dB.

  They are understandable from context, but one more pass would make them clean.
- **Sound vs flash:** every cannon cue and logged musket volley has visible fire or smoke. I re-checked each detector miss at 5 fps:
  - S01 14.4: the first gun now fires after the cloud has cleared, and its smoke is visible;
  - S04 33.9-36.2: the gunboat smoke and the barge flashes are visible;
  - S03 101-105 and S05 89-93: small flashes are visible inside the bend and in the melee.

  No sound sits in a dissolve or over a card without a visible cause. All cue lists end before `D - 0.7`.
- Music is unchanged (19-25 LU under the voice; rule >= 15). Fine.

## Round-1 findings: status

| R1 finding | Status |
| --- | --- |
| S07 56-69 ladders payoff masked (sev 3) | **Fixed.** Content words 2-6 dB+ or better between volleys; only "it." (64.9) remains low |
| S01 17-24 hook number line masked (sev 3) | **Fixed.** Muskets start after "mud"; only "and"/"In"/"of" under 4 dB |
| S01 74-81 title line masked (sev 3) | **Fixed.** Volleys stop at 76.98; "These" 5.9 dB, the rest clear |
| S05 76-96 melee masked (sev 2) | **Mostly fixed.** 84-96 clear; 77.9-81.8 still has 3 low words (sev 1) |
| S03 88-91 Thirty-ninth masked (sev 2) | **Fixed** (volleys after "Infantry") |
| S06 74-75 masked (sev 1) | **Fixed** (3 dB on "of"/"to", content clear) |
| S01 white-out in the hook (sev 2) | **Not changed on purpose** (owner's v8 look). Flat white is now ~1.3 s (11.9-13.2). Accepted; not counted |
| S01 13.4 cannon in the cloud (sev 2) | **Fixed** (first gun 14.4, visible) |
| S01 plate "November" under "eighth" (sev 1) | **Fixed** (8 January on "eighth") |
| S01 no number by ~15 s (sev 2) | **Fixed.** 5,000+ ticks up from ~15.6 and is complete on "five thousand", with BRITISH REGULARS on "regulars" |
| S01 83.03 boom in the dissolve (sev 1) | **Fixed** (last boom 77.33) |
| S01 ANDREW JACKSON early (sev 1) | **Fixed within tolerance** (readable ~64.5, word 64.70) |
| S02 0-16 no beats (sev 2) | **Fixed** |
| S02 "marched south" reads east (sev 1) | Not fixed (deliberate). Still sev 1 |
| S03 0-33 static (sev 1) | **Fixed** (push-ins on wall / canoes, pull-back on "In other words") |
| S03 NEXT label wrong (sev 1) | **Fixed** ("Next: the British come") |
| S04 Lake Borgne one-sided, no grey (sev 1) | **Fixed** |
| S04 46-52 empty map (sev 1) | **Fixed** (route on "wherever") |
| S05 decision card static 23 s (sev 2) | **Fixed** ("Militia, volunteers" on "militia", "British regulars" on "landing") |
| S05 108-122 wrong banner (sev 2) | **Fixed** (Keane JK banner on "commander", HALTED on "wait", label "Stung") |
| S05 / S07 method card re-typing (sev 1) | **Fixed** (old lines static, new line types on "hit" / "make") |
| S07 0-14 unreadable fog (sev 2) | **Partly fixed.** Fog -25 %, "hours late" label at the boats. The label is tiny at 720p and the boats barely read. Sev 1 now |
| S08 end hold 17 s (sev 1) | Unchanged (~17.5 s clean, 61.5-79.1). OK |
| S08 scar callback over the gulf (sev 1) | Unchanged (optional) |

## New or remaining findings

| Scene | local t | film t | Problem | Fix | Sev |
| --- | --- | --- | --- | --- | --- |
| S05 | 77.9-81.8 | 454.5-458.4 | "while Coffee's... struck the British" still has 3 words at -1 to 0 dB (night-attack volleys). | Gain the S05 musket shots in 77-82 down a further -4 dB, or move the 2 volleys that land on "while" (77.9) and "the British" (81.8) by +0.3 s into the word gaps. | 1 |
| S07 | 50.5-52.0 | 677.9-679.4 | "rank after rank": rank fire lands on "after" (-0.7 dB). | Start the rank-fire volley at 52.1 (after "rank.") or give the first volley -4 dB. | 1 |
| S07 | 64.9 / 71.9 / 93.5 / 104.7 | 692.3 / 699.3 / 720.9 / 732.1 | Single sentence-final words under a shot ("it.", "them.", "Their", "it,"). | Nudge those shots 0.3-0.5 s into the pauses. Optional. | 1 |
| S07 | 8-13 | 635-640 | The "hours late" label and the stuck boats are too small to read through the fog at 720p. | Label at 1.4x, camera a little lower on the boats from 9.3 ("west bank force"). | 1 |
| S02 | 30-44 | 113-127 | "Jackson marched south": the arrow still reads west to east on screen. | As round 1: turn the camera so north is up while the arrow draws. | 1 |
| S01 | 15.6 | 15.6 | The 5,000+ counter starts ~0.3 s before "five" (15.87). Tick-up counters may lead slightly; fine. | none needed (or `tOn = T.five`) | 1 |
| S01 | 11.9-13.2 | 11.9-13.2 | Flat white during dive 1. Owner's chosen v8 look: recorded, not scored. | none (owner decision) | - |

## Top fixes (all polish)

1. S05 77-82: lower or move 2-3 volleys so "while Coffee's... struck the British" is clean. Audio-only if done by gain.
2. S07 50-52: start the rank fire after "rank."; optionally nudge the single shots on "it." / "them." / "Their" / "it,".
3. S07 8-13: make the late west-bank boats and the "hours late" label readable.
4. S02 30-44: make "marched south" point south on screen.
5. Optional: S01 counter on `T.five`; S08 end hold +2 s; scar callback over the 8 January field.
