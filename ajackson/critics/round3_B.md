# Round 3, Critic B (STORY + SYNC + SOUND): Andrew Jackson 3D film

Input: `/tmp/aj_build/jackson_round3_720.mp4` (855 s, **-14.1 LUFS, true peak -1.1 dBFS**), `/tmp/aj_render3/S01-S08.mp4`,
`build/mix.wav` (19:49), `audio/voice_owner.wav` (re-voiced S01), `scenes.json` (S01 79.89 s, everything after S01 3.8 s earlier),
the scene NOTES "Round 2 fixes" and "Owner fixes", `script.md`, `FACT_NOTES_neworleans.md` items 7 and 11.
Same methods as rounds 1-2:
- per-word voice SNR against everything else in the mix;
- per-section R128 loudness;
- shot-vs-flash matching, with every miss viewed on exact frames;
- 2-s contact sheets;
- frame brightness statistics for the dive.

Work files: `/tmp/aj_critic_B/r3/`.

## Scores

| Scene | R1 | R2 | R3 | One line |
| --- | --- | --- | --- | --- |
| S01 hook | 7.0 | 8.0 | 8.0 | Much stronger stakes (burned Washington -> New Orleans -> Mississippi -> peace table). Three small S01 regressions: the dive whoosh masks "peace table", the first cannon fires inside the fog, and the 71 card rides over the city after the cut. The white-out is longer (owner's look, not scored) |
| S02 Creek War | 5.0 | 6.5 | 7.0 | "Marched south" now points south on screen; re-baked map reads better |
| S03 Horseshoe Bend | 7.5 | 8.0 | 8.0 | Unchanged, fine (move 1 starts at 2:05) |
| S04 British come | 6.5 | 7.5 | 8.0 | Separate ships instead of one column; Lake Borgne both sides fire |
| S05 night attack | 7.0 | 8.0 | 8.5 | "while Coffee's... struck the British from the side" is now clear |
| S06 mud line | 7.0 | 8.0 | 8.0 | Unchanged, fine |
| S07 8 January | 7.0 | 8.0 | 8.5 | "rank after rank" clear; "hours late" readable at the boats |
| S08 ending | 7.5 | 8.0 | 8.0 | Unchanged, fine |
| **Overall** | **6.8** | **8.0** | **8.1** | |

**Fit to publish? YES.** Three cheap S01 fixes (findings 1-3) are recommended before upload; each is a cue or a key change, and
S01 is the hook.

## The new hook against STYLE_LOCK 1a

| 1a element | R3 | Verdict |
| --- | --- | --- |
| Stakes of THIS story, fresh, ending on the place | 0.5-12.2: "British troops who had burned Washington sailed to take New Orleans... the mouth of the Mississippi, a prize to bargain with at the peace table." It is concrete and only fits this story. It ends on "peace table" rather than the place name, but New Orleans is named on screen and in the line. | Pass (big improvement on the round-1 geography line) |
| Picture under the stakes | WASHINGTON BURNED tag rides with the fleet on "burned" (3.74); NEW ORLEANS on its word; the Mississippi glows on "mouth"; separate ships. The PEACE TABLE seal (11.4) is barely readable: faint, under a cloud, gone in the white-out by 12.0. | Pass, except the seal |
| One continuous zoom, no white flash | One push, then dive 1. Near-blank frames (std < 12 on a 0-255 scale) run 12.4-14.6, then pale haze to ~15.5; landing at 16.15. That is ~2.2 s of flat white (R2 ~1.3 s), because the round-2 trim of the flat phase did not carry over to the re-timed dive. | Owner's look, not scored. Re-applying the R2 trim is recommended (finding 4) |
| Number + result by ~15 s | 5,000+ counter on "five" (16.76, starts with the word), 2,000+ on "two thousand" (24.0), 71 on "seventy-one" (29.3). ~1 s later than R2 because the stakes line is longer. | Pass (accepted trade for real stakes) |
| A beat every 2-4 s | 0-12: plate, tag, label, glow, seal. 12-16: dive. 16-31: counter, advance, fire, counters. 32-43: Ghent card builds. 44-60: 23 Dec, 9 miles, banner, scar card. | Pass |
| Twist shown | Ghent card (SIGNED / NOT YET RATIFIED BY AMERICA) on its words | Pass |
| General enters as the turn, one human detail | 51.3 "The general sent to save it... worn down by illness", scar card on "sword", AGE 14 on "fourteen" | Pass |
| Name slam ~1:00 + 3 snap cuts | ANDREW JACKSON readable from 61.0 ("Andrew" 60.92); cuts on "trap" 62.68, "attack" 66.10, "stop" 70.38; THREE GREATEST TACTICAL MOVES on "three" (76.16) | Pass |
| Move 1 by ~2:00 | S03 starts at 2:05.2 (dive to the bend) | Pass |

## Accuracy of the new claims

- **"British troops who had burned Washington sailed to take New Orleans": true.** The 4th, 21st, 44th and 85th, Ross's Chesapeake
  brigade that burned Washington (24 Aug 1814), were in the New Orleans army (FACT_NOTES item 11). The 85th led the 23 Dec advance
  guard, and the 4th, 21st and 44th were on the 8 Jan field.
- **"a prize to bargain with at the peace table": supported** by item 7 ("seize the mouth of the Mississippi / New Orleans, win
  bargaining strength"; Bathurst did not intend permanent occupation). The line does not claim a planned annexation, so it stays clear
  of pitfall 11.
- **"In the winter of eighteen fourteen": acceptable.** The fleet left Jamaica on 26 Nov 1814 and landed in December; late November is
  loosely "winter". If you want it exact: "At the end of eighteen fourteen". Severity 1, optional.
- **Trimmed lines: correct.** "Two weeks before, a British army had come out of the swamps unseen, nine miles from the city" (23 Dec
  vs 8 Jan; Villeré ~8-9 miles below the city) and "worn down by illness". "a veteran British army" is not "Wellington's veterans",
  so it is consistent with item 11.

## Sound: re-measured

| Measure | R1 | R2 | R3 |
| --- | --- | --- | --- |
| Words < 10 dB (of ~2,255) | 254 | 144 | **124** |
| Words < 6 dB | 146 | 57 | **50** |
| Words < 3 dB | 80 | 29 | **23** |
| Median word SNR | 25.4 | 25.7 | 25.8 |
| Voice minus background, S01 / S03 / S05 / S06 / S07 (LU) | ~12 / 14.5 / 12.4 / n/a / 7.1 | 12.4 / 19.7 / 17.1 / 16.4 / 14.1 | **12.2 / 19.0 / 17.7 / 16.4 / 14.7** |

- **Fixed since R2:**
  - S05 "while Coffee's... the British" (no longer under 6 dB);
  - S07 "rank after rank";
  - S07 "Their" (93.5).
- **Still low (short words at sentence ends, where the moved shot now hits the end of the word):**
  - S07 64.91 "it." (-4.4 dB; gun moved to 65.55, the word's tail);
  - S07 71.89 "them." (-4.1 dB; gun at 72.25);
  - S07 102.5 "Its" and 104.75 "it," (-2.6 / -3.7 dB; redoubt volleys every 1.6 s from 102.0).

  Severity 1.
- **New, S01 11.40-11.64:** "**peace table.**" (the payoff of the new stakes line) drops to 5.1 / 2.6 dB. The cause is the dive whoosh
  cue at 11.25 (cues.json `["whoosh", 11.25]`), which lands right on those two words.
- **Shot vs flash:** every musket volley and every cannon cue in S02-S08 has visible fire or smoke (same misses as R2, all re-checked
  as visible). **New in S01: gun 15.3 (+ boom 15.85) fires in the dive's fog.** The frame at 15.3 shows haze and the bare world tile,
  with no line and no guns. This is the round-1 problem back again, because the first shot did not move with the re-timed landing
  (camera lands 16.15).
- Loudness -14.1 LUFS / TP -1.1 dBFS. Music unchanged (S02 voice 24.9 LU over the bed).

## Round-2 findings: status

| R2 finding | Status |
| --- | --- |
| S05 77.9-81.8 "while... the British" masked | **Fixed** |
| S07 50.5-52 "rank after rank" | **Fixed** |
| S07 single shots on "it." / "them." / "Their" / "it," | **Partly fixed**: "Their" clear; the three short sentence-final words still low (shots moved onto their tails). Sev 1 |
| S07 8-13 "hours late" / boats unreadable | **Fixed** (closer camera, thinner fog, label readable at 720p) |
| S02 "marched south" reads east | **Fixed** (the arrow runs top to bottom onto the bend) |
| S01 5,000+ counter early | **Fixed** (starts on "five" 16.76) |
| S01 white-out | Owner's look; now ~2.2 s flat (R2 ~1.3 s). See finding 4 |

## Findings (round 3)

| # | Scene | local t | film t | Problem | Fix | Sev |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | S01 | 11.25-11.9 | 11.25-11.9 | Dive whoosh on "peace table." (SNR 5 / 2.6 dB): the payoff of the new stakes line is smeared. | Move the whoosh cue to 11.95 (after "table." ends) in S01 seq, or drop it to -6 dB under words. Audio-only rebuild. | 2 |
| 2 | S01 | 15.3-15.85 | 15.3-15.85 | First cannon shot + impact sound while the screen is fog and the bare world edge (the camera lands 16.15). Sound with no visible cause in the hook. | First gun >= 16.5 (the camera has landed and the line is in frame); keep the 1.1 s spacing after it. | 2 |
| 3 | S01 | ~31.9-32.9 | 31.9-32.9 | Picture cuts from the battle to the New Orleans city view before the Ghent backdrop dims, and the "71 / Americans" card stays up over the city for ~1 s: the casualty card sits on the wrong place. | Card out at the cut (32.34), or delay the city key until the Ghent dim (~32.8). | 2 |
| 4 | S01 | 12.4-15.5 | 12.4-15.5 | White-out under "On the eighth of January" is ~2.2 s flat plus ~1 s haze (R2 ~1.3 s flat), and the bare world tile shows as a slanted rectangle in the haze at ~15.3. Owner's look, so not scored. | Re-apply the R2 flat-phase trim to the new dive timing (`dives[0].off`, flat <= 1.3 s); avoid the world edge in the emergence frame (Critic A). | 1 (owner) |
| 5 | S01 | 11.4-12.0 | 11.4-12.0 | The PEACE TABLE seal is barely readable (faint, under a cloud) before the white-out swallows it. | Bring the seal in at 1.3x, clear of the cloud, on "bargain" (10.42) so it has ~1.5 s on screen. | 1 |
| 6 | S07 | 64.9 / 71.9 / 102.5 / 104.75 | 688.5 / 695.5 / 726.1 / 728.3 | Short sentence-final words under shots ("it.", "them.", "Its", "it,"). | Move these shots +0.5 s more (65.55 -> 66.0, 72.25 -> 72.6) and start the redoubt volleys at 102.9. | 1 |
| 7 | S01 | 0.5-2.3 | 0.5-2.3 | "In the winter of eighteen fourteen" is loose (the fleet left Jamaica on 26 Nov). | Optional: "At the end of eighteen fourteen". Not worth a re-voice on its own. | 1 |

## Top 5

1. S01 whoosh off "peace table." (cue 11.25 -> 11.95). Audio-only.
2. S01 first cannon after the landing (>= 16.5), not in the fog.
3. S01 71 card out at the 32.34 cut (no casualty card over the city).
4. S01 dive: re-apply the R2 flat-phase trim (~1.3 s) and keep the world edge out of the emergence.
5. S07: nudge the four sentence-final shots off "it." / "them." / "Its" / "it,"; S01 PEACE TABLE seal bigger and earlier.
