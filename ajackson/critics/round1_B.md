# Round 1, Critic B (STORY + SYNC + SOUND): Andrew Jackson 3D film

Input: `/tmp/aj_build/jackson_round1_720.mp4` (858.8 s, -14.1 LUFS), scene renders `/tmp/aj_render/S01-S08.mp4`, word times
(`tools/scene_times.py --words`), `build/mix.wav`, `audio/voice_owner.wav` (24 kHz, resampled to 48 kHz for analysis),
`build/troop_stem.wav` + `troop_stem_log.json`, `scenes/SNN/cues.json`. Work files: `/tmp/aj_critic_B/` (contact sheets every 2 s,
5-fps sheets, per-word SNR, flash/onset match).

## Scores (10 = Grand Maneuver polish)

| Scene | Score | One line |
| --- | --- | --- |
| S01 hook | 7.0 | Strong story + Ghent twist + scar + name slam, but the number lands at 23 s, a 2 s white cloud-out in the hook, and the muskets bury the hook's key lines |
| S02 Creek War | 5.0 | Correct and respectful, but 16 s with nothing happening on a blotchy map; no beat every 2-4 s |
| S03 Horseshoe Bend | 7.5 | Best-told move: plan, "in other words", twist, Cherokee canoes, charge, honest cost + treaty, method, subscribe. Charge narration masked by volleys |
| S04 British come | 6.5 | Clear route story; Lake Borgne shows only the US boats firing, 6 s of empty map at 46-52 |
| S05 night attack | 7.0 | Good device use (quote, decision, reveal on "He did not wait", Carolina broadside); the melee narration is masked; British "stung" beat shows Jackson's banner |
| S06 mud line | 7.0 | Every beat has a picture on its word (8 batteries, Carolina burns, 28 Dec, fog on 1 Jan, LADDERS set-up) |
| S07 8 January | 7.0 | Payoffs land on their words (NO LADDERS, HALF AN HOUR, 2,037 / 71 / 6) but the ladders payoff is drowned by the musket stem (word SNR about 0 dB); 14 s of unreadable fog at the start |
| S08 ending | 7.5 | Honest removal beat, scar callback, 1-2-3 cards on their words, ~17 s clean living map |
| **Overall** | **6.8** | |

**Fit to publish? NO.** The story, facts and card timing are close to ready. The main blocker is the sound mix: the musket stem sits
at the same level as the voice in every big fight, so the film's key lines can't be understood.

## Method notes

- **Voice clarity:** the background (mix minus voice) was measured per word, over 2,261 words. The median voice-to-background ratio is
  25 dB, which is fine. But 146 words are under 6 dB and 80 are under 3 dB, almost all of them in volleys. Per-section integrated loudness
  of voice vs background (pre-normalisation): S02 -22.9 / -45.7, S04 -23.1 / -42.2, S03 -23.0 / -37.5, S05 -23.0 / -35.4,
  **S07 -22.8 / -29.9 (only 7 LU apart).**
- **Music:** S02/S04 (music only) sit 19-23 LU under the voice. That passes the "never within 15 dB" rule (HANDOVER lesson 14). It is
  quiet but acceptable; raising it 3-4 dB in the non-battle acts is optional.
- **Sound vs flash:** every `gun` cue and every logged musket shot was checked against frame-difference spikes (320x180, 30 fps), and the
  misses were looked at frame by frame at 5 fps. Every cannon and volley sound has visible smoke or a flash, with two exceptions: S01
  13.4 (inside the cloud) and S01 83.03 (in the dissolve to S02). No visible firing is silent. The other "silent spikes" the detector
  found repeat every 1.07-1.6 s, so they come from the water and cloud animation, not from fire. Flashes at Horseshoe (S03 88-92) are
  tiny at that camera distance (Critic A).
- **Cards vs words:** checked on the contact sheets and on exact frames at the risky times. Everything is on or after its word except
  the small items in the findings table.
- **History:** checked against the FACT_NOTES numbers and the standard sources:
  - casualties: 2,037 / 71 / 6 behind the wall; 277 / 213 on 23 Dec; 49 killed incl. 18 Cherokee; ~800 of ~1,000; ~350 women and
    children; 22 M acres;
  - dates: 14 Dec, 23 Dec, 27-28 Dec, 1 Jan, 8 Jan, 16 Feb;
  - people and places: Montgomery / Houston, the 44th's ladders, the 93rd and Dale, Rennie's redoubt, Thornton's late crossing,
    Pakenham's Salamanca charge;
  - wording: "signed but not yet ratified" is worded correctly.

  No factual error found. Respect: Horseshoe Bend and the removal ending are handled soberly; the result card sits on a dimmed map with
  no celebration stamps. Good.

## Findings

| Scene | local t | film t | Problem | Fix | Sev |
| --- | --- | --- | --- | --- | --- |
| S07 | 56.2-68.9 | 683.6-696.3 | **Ladders payoff inaudible.** "supposed to carry them had left them behind... reached the ditch with almost nothing to cross it" runs at a word SNR of -10 to +5 dB (volleys every ~0.5-1.5 s at -8.5 dBFS peak). The film's set-up/payoff is lost. | `assemble.py`: troop duck `troop * (1 - 0.5 * venv)` -> `(1 - 0.85 * venv)` (~-16 dB under words) and trim the whole stem -4 dB (`place(troop, tst, 0, db(-4))`). In S07 seq, thin the wall volleys between 56-69 (fewer `volleys`, longer `volley` interval) so the pauses carry the words. Target: every word >= 10 dB over the background. | 3 |
| S01 | 17.3-24.0 | 17.3-24.0 | Hook number line masked: "attacked a ditch... In about half an hour, more than two thousand of them were" is at 0-5 dB SNR (the 8 Jan volleys 17.5-25). | Same duck fix. Also start the musket volleys after "mud" (19.5), keeping only the cannon under 17-19. | 3 |
| S01 | 73.8-81.3 | 73.8-81.3 | The title promise "These are Andrew Jackson's three greatest tactical moves" is at 0-5 dB SNR (snap cut 3 volleys 74.2-81.2) under the gold title. | Same duck fix. Stop the snap-cut volleys at `T.these` (77.28) and let the map fall quiet under the title line. | 3 |
| S05 | 75.8-96.2 | 452.4-472.8 | Night attack + melee narration ("Coffee's Tennesseans... struck the British from the side", "a hundred small fights... friend from enemy") at -6 to +5 dB SNR; 76 volley cues. | Duck fix; halve the melee volley density between 84 and 96 (the flashes can stay; drop every other sound or lower the far groups' gain by 6 dB). | 2 |
| S03 | 87.9-91.0 | 216.9-220.0 | "The Thirty-ninth United States Infantry went over" masked (-3 to +6 dB). | Duck fix; start the wall volleys after "Infantry" (90.4). | 2 |
| S06 | 74.0-75.4 | 598.1-599.5 | "shot most of them to pieces" masked (capture/cheer events + guns 70.5-76). | Duck fix; end the duel guns at 73.8. | 1 |
| S01 | 10.0-13.6 | 10.0-13.6 | Hook rule 1a: "one continuous zoom, no cut, no white flash". The cloud dive whites out the screen fully for ~1.6 s (12.0-13.6) after 2 s of thick cloud. This dive is one of the 3 approved dives, but it reads as a white flash in the most critical seconds. | Shorten the full white-out: `VX.diveTimes(SWT)` with a shorter `full` hold (< 0.5 s), or a denser-but-grey cloud. Keep the dive. | 2 |
| S01 | 13.4 | 13.4 | First cannon sound (gun + boom 13.95) plays while the screen is still cloud: a sound with no visible cause. | Drop the 13.4 cue or move the first shot to >= 14.2 (clear at 13.8). | 2 |
| S01 | 12.4-14.0 | 12.4-14.0 | The date plate still reads "November 1814" while "the eighth of January" is spoken (12.42); it rolls only at 14.0. | Roll the plate at `T.eighth` (day + month), year on `T.e1815`. | 1 |
| S01 | 15.9-28.4 | 15.9-28.4 | Hook timing: 1a asks for the hard number + result by ~15 s. Here "five thousand" comes at 15.9 with no number on screen, 2,000+ at 23.1 and 71 at 28.4. | Show "5,000+ BRITISH REGULARS" as a number card on `T.five` (the first hard number on screen, on time). Optional script tightening for v2: cut "the main way to the sea for the whole American West" so everything moves up ~2.5 s. | 2 |
| S01 | 83.03 | 83.03 | The last boom (83.03) sounds inside the 0.6 s dissolve into S02's quiet Creek map. | Drop cues with `t > D - 0.7` in `assemble.py` (it uses `D - 0.05`). | 1 |
| S01 | 64.4 | 64.4 | Gold ANDREW JACKSON appears ~0.3 s before "Andrew" (64.70); "His name was" is at 63.94. | Title in at `T.andrew`. | 1 |
| S02 | 0-16 | 83.1-99.1 | No beat for 16 s: a slow pan over a blotchy green map with only the banner and the Old Hickory tag. Breaks "something new every 2-4 s" and invites drop-off right after the hook. | Add the Natchez march home as a blue arrow (Natchez -> Nashville) on "hard march home" (6.5), the Creek Nation shading on "civil war" (14.5) instead of at 16, and a slow push. | 2 |
| S02 | 30-44 | 113-127 | "Jackson marched south": the blue arrow reads left -> right (east) on screen, not south. | Yaw the camera so north is up while the arrow draws, or start the arrow at the Tennessee border at the top of the frame. | 1 |
| S03 | 0-33 | 129-162 | 33 s on one slowly drifting view of the bend (the wall pulse and the canoes are the only beats). | Push in on the wall on "wall of logs" (8.7), on the canoes on "Canoes" (17.0), and pull back on "In other words" (20.9). | 1 |
| S03 | 174-176 | 303-305 | The label "NEXT: THE NIGHT ATTACK" leads into S04, which is the British arrival, not the night attack. | "NEXT: THE BRITISH COME", or drop the label. | 1 |
| S04 | 33.9-37.6 | 340-343.7 | Lake Borgne: only the five US gunboats fire (smoke + sound); the British barges never fire, and the gunboats don't turn grey on "captured" (35.17). | Give the barges flashes, recolour the boats grey on `captured`. | 1 |
| S04 | 46-52 | 352-358 | ~6 s of empty marsh map under "In other words, the British could land wherever they liked". | Start the Bienvenue route trace on "wherever" (48.9). | 1 |
| S05 | 25.5-48.4 | 402-425 | Decision card ("WHAT WOULD YOU DO?") holds a static dimmed map for 23 s. The device is right, but the length hurts retention. | Under "militia, volunteers, a few regulars" and "more of them landing every hour", show small blue vs red unit counts in the card (e.g. icons ticking up), or bring option A in earlier (29) and B on "attack" (41.0) as now. | 2 |
| S05 | 107.8-122 | 484.4-498.6 | "But the British had been stung... Their commander decided to wait": the only banner on screen is Jackson's. There is no Keane banner and no HALTED stamp (script tag). Wrong picture under the line. | Add Keane's banner (initials) at Villeré on "commander" (115.1) and the HALTED stamp on "wait" (116.3); fade Jackson's banner out at 108. | 2 |
| S05 | 123.2-126.6 | 499.8-503.2 | Method card opens empty, then re-types line 1 before line 2. The recipe says the earlier lines are already there and only the new line types on its word. | Put "1. Close every door" in `sub` (static) and type "2. Strike first" from `qAt: hit` (126.57). | 1 |
| S07 | 0-14 | 627-641 | 14 s of thick fog in which nothing can be read; "the canal... had partly collapsed" and "the west bank force was hours late" have no visible picture (only a faint pink arrow at 10-12). | Thin the fog over the west-bank canal; show the stuck boats (a boat cluster + small "HOURS LATE" tag on "late", 10.99). | 2 |
| S07 | 143.7-148 | 771-775.4 | Method card shows only the header for ~4 s, then re-types lines 1-2 before line 3 lands on "make" (150.0). | As S05: old lines static in `sub`, type line 3 on `qAt: make`. | 1 |
| S08 | 61.3-78.5 | 841-858 | End-screen hold is ~17.2 s of clean map (owner decision ~17 s, STYLE_LOCK ~20 s), and the last ~0.5 s fades to black. | Fine; optionally +2 s on the S08 window so 20 s of end-screen elements fit. | 1 |
| S08 | 32-37 | 812-817 | The scar callback is set over the gulf map; the tag says "over the field of 8 January". | Optional: cut to the chalmette field for the callback. | 1 |
| All | | | Music beds sit 19-23 LU under the voice in quiet scenes (rule: >= 15 dB). OK, though the S02/S04 bed is barely audible. | Optional: +3 dB on the music for S02/S04 only. | 1 |

## Top 10 fixes (in order)

1. **Re-mix the musket stem under the voice:** in `assemble.py` use `troop * (1 - 0.85 * venv)` plus a global -4 dB on `troop_stem.wav`,
   and use `D - 0.7` as the cue cut-off. Re-check that every word is >= 10 dB over the background (S01 17-24 / 74-81, S03 88-91,
   S05 76-96, S06 74-75, S07 50-68 / 90-95 / 103-105). `--audio-only`, no re-render.
2. S07 56-69: thin the wall volleys so the ladders payoff is heard. A seq change, so S07 must be re-rendered.
3. S01: show a 5,000+ number card on "five thousand" (15.87), so a hard number is on screen by ~16 s.
4. S01: shorten the full white-out of dive 1 to < 0.5 s; drop the 13.4 gun (it fires inside the cloud).
5. S02: add beats in 0-16 s (Natchez march arrow, Creek Nation shading on "civil war"); make "marched south" read as south.
6. S05 108-122: show Keane's banner + the HALTED stamp instead of Jackson's banner.
7. S07 0-14: make the late west-bank boats visible through the fog.
8. S05 25-48: give the 23 s decision card a second visual beat.
9. Method cards S05/S07: earlier lines static, only the new line types on its word.
10. Small timing items: date plate on "eighth" (S01 12.42), ANDREW JACKSON on "Andrew" (S01 64.70), S03 "NEXT" label text,
    Lake Borgne barge fire + grey boats.
