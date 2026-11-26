# Round 1 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_round1_720.mp4` (12:53, -14 LUFS, owner voice clone). Method: 2-s contact sheets of the whole film, 4-10 fps strips at the
letter card, method cards, decision card join and gun cues; every seq.js `T` anchor checked against `scene_times.py --words` (all 741 anchors match
their word within 0.06 s, no stale times); per-word SNR = voice stem vs (mix.wav - voice) per word window, then checked at 100 ms resolution on the
low hits (most <10 dB hits are pauses inside the word window, not masking; the real masking spots are listed below); cannon cues vs visible flashes;
musket stem log vs scene cues; facts vs FACT_NOTES_* + FACTCHECK_SCRIPT.

## Scores (10 = Grand Maneuver polish)

| Scene | Score | One line |
|---|---|---|
| S01 hook | 7.5 | Strong stakes -> one continuous push -> dive -> 2,400 (15.9 s) -> 900 + "not one killed" (24.7-29 s) -> Brooklyn twist -> trapped again -> letter -> name slam 53.8 s -> 3 snap cuts. Loses points: wrong date plate over the flashbacks, the key letter line readable ~0.5 s, cannon on "the Hessians at Trenton", "frozen river". |
| S02 background | 7.5 | Clean, every card on its word; ~45 s (rule <= ~20 s, but it is the Brooklyn set-up, acceptable). |
| S03 move 1 | 7.0 | Plan -> "in other words" -> twist -> Glover set-up -> covering force set-up all on their words. Result shown only as a small top-right ledger (moves 2-3 get the big result card); method card 1 fully readable < 1 s. |
| S04 retreat | 7.0 | Good; the plate "30 AUGUST, FRIDAY, first light" hangs over Manhattan/White Plains for ~30 s. |
| S05 move 2 | 7.5 | Best-told move; Glover pay-off works; guns flash on their sounds. Method card 2 readable ~0.6 s; "black Durham boats" still voiced (fact-check said drop "black"). |
| S06 trap | 7.0 | Decision card well paced (A on "hold", B on "slip"). Bridge fight is a 12-s wall of 27 volleys + 10 guns that masks "three times" and keeps firing after "Cornwallis stopped for the night". |
| S07 move 3 | 7.5 | Reveal lands on "He slipped away"; "covering force, just as at Brooklyn" pays off; volleys exactly on "fired a volley" / "Both sides fired"; NO gun sound under "heard cannon" (correct). Nassau Hall guns land on words. |
| S08 ending | 8.0 | Letter returns (pay-off 3), method recap typed on its words, 1-2-3 cards on their words, ~17.4 s clean tail. Subscribe button 1.25 s early. |
| **Overall** | **7.3** | |

**Fit to publish? NO** (close: no structural problem, about a dozen timing/level fixes, two voice word fixes).

Set-up / pay-off check: (1) Glover's Marblehead men: S03 label on "Marblehead" (film 169) -> S05 spoken + label "Glover's Marblehead men" (film 386-389) OK.
(2) Covering force: S03 spoken + "covering force" label (film 188-190) + the mistaken withdrawal -> S07 "a covering force, just as at Brooklyn" + "About 500 men" label (film 589-597) OK.
(3) "The game is pretty near up": S01 letter (film 49.6-52.5) -> S08 letter returns on "wrote" (film 718.3-722.2) OK, but the S01 card is too short (finding 2).
Decision card S06 -> S07: no blink. The card is carried across the 0.6 s dissolve (only a ~1-frame luminance dip at 581.6); B lights at 581.7, 0.1 s before
"He slipped away" (581.79). The DATE PLATE does ghost out/in across that join (finding 16).
Sound vs flash: every musket volley in the stem is generated from on-screen flash events (troop_stem.py visibility filter); spot checks of the cannon cues
(S05 99.45 -> flash at film 436.0; S06 40.9 -> flashes at 540.4-541) show a flash with each sound. No cannon cue after S07 88.55, so nothing is heard
under "heard cannon behind him, at Princeton" (film 691.6). Correct.

## Findings

| Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|
| S01 | 30.1-46.2 | 30.1-46.2 | Date plate still reads "25" (December) over the late-summer Brooklyn flashback ("four months earlier") and over 2 January at Trenton: the wrong date sits on screen for 16 s (FACTCHECK B row S01 already flagged it). | Add `["plaque.hide", CUT_D - 0.1]` and let the existing `["plaque.date", SN1, {month:"1776 - 1777"}]` bring it back (or show `{month:"1776"}` at CUT_D). | 2 |
| S01 | 49.6-52.5 | 49.6-52.5 | Letter card: the quote finishes typing at ~51.9 and the card leaves at 52.5 (`T.his - 0.5`), so "I think the game is pretty near up" is complete for ~0.5 s. That is the set-up for the S08 pay-off. | `letter` end -> `T.george - 0.1` (53.7), `film.dim` end -> same; `cps: 40` so it completes by ~51.4. | 2 |
| S01 | 59.72 | 59.72 | "He would cross a **frozen** river in a storm": the Delaware was not frozen (ice floes; the script's own S01 line says "icy river"). | Re-voice/splice one word: "an icy river" (tools/splice_section.py). | 2 |
| S01 | 21.15 / 21.7 | 21.15 / 21.7 | Cannon `boom` 21.15 + `gun` 21.7 land on "the Hessians at Trenton": residual -26 dB vs voice -22...-33 dB, so "the"/"at" are masked and "Trenton" partly masked. | Move the S01-C gun cues into word gaps: 20.0, 22.4, 24.0, 26.2 (gaps after "dawn", "Trenton.", "hour,", "prisoners,"), boom +0.45 each. | 2 |
| S01 | 66.4-67.7 | 66.4-67.7 | Orchard volleys + gun 66.04 under "and strike behind it." ("it." -3 dB). The end of the promise line is lost. | G3 volleys only at 63.0-63.6 and 67.8-68.4 (gaps); drop gun 66.04. | 2 |
| S01 | 0-6 | 0-6 | 1a wants a dive within ~6 s; the dive swap is at 14.5 (the push is continuous, so it reads as one zoom). 0-6.5 s has only the plate (1.65) as a new beat. | Optional: start the boats moving down the Delaware at 2.5 s, or bring `DV.push` to ~8 s. | 1 |
| S01 | 6.48 | 6.48 | NEW YEAR'S EVE tag sub "most of the army can go home" shows 3 s before "go home" (9.46). | sub "" at 6.48, then a second label with the sub at `T.home - 0.3`, or drop the sub. | 1 |
| S01/S03/S05 | S01 12.95, S03 2.45, S05 33.0 | 12.95, 120.0, 369.6 | Dive `whoosh` (-14 dB, only 25 % ducked) masks the next words: "On Christmas night" (SNR 5-7 dB), "Their commander" (5 dB), "main force of about" (2-5 dB). | whoosh KIT gain -14 -> -20 in assemble.py, or place cues so the peak sits in the gap (S05 cue 32.3, S03 1.6). | 2 |
| S03 | 121.8-131.1 | 239.4-248.7 | Move 1's result is a small top-right "ledger", while moves 2-3 end on the big centred result card (CLAUDE.md: every move ends on a result card). Inconsistent; the Brooklyn result (9,000 across, a handful left) reads weakest of the three. | Use the S05/S07 `buildResult` card: header "BROOKLYN · 29-30 AUGUST 1776", left "ABOUT 9,000 / crossed in one night", right "LEFT BEHIND / a handful of stragglers"; on the same words as the ledger rows. | 2 |
| S03 | 136.2-138.75 | 253.8-256.3 | Method card 1: "1. Save the army first" (cps 14) completes ~255.4; card out 256.3, so under 1 s fully readable. | `cps: 30`; card end -> `T.beginning` (140.2) and dissolve the camera after it. | 2 |
| S03->S04 | S03 105.3 -> S04 9.1 | 222.9-280.0 | Plate "30 AUGUST, FRIDAY, first light" stays over the subscribe bridge, the Manhattan retreat and White Plains (Sept-Oct). The "30" is never spoken either. | S03: plate day "" note "Brooklyn" at first light; S04 0.4: `{month:"Autumn 1776"}` (or `plaque.hide` at S03 139.3 until "sixteenth"). | 2 |
| S03 | 146.99 | 264.6 | Subscribe button 0.6 s before "subscribing". | `T.subscribing - 0.1`. | 1 |
| S05 | 41.3-43.4 | 377.8-380.0 | "long, **black** Durham boats": FACTCHECK S05 row said drop "black" (unverified); still voiced. | Splice "The boats were long Durham boats". | 1 |
| S05 | 142.4-148.95 | 478.9-485.5 | Method card 2: the quote completes ~484.9, the card leaves 485.5 (about 0.6 s). | Card end -> `T.letgo` (150.7); `cps: 40`. | 2 |
| S05 | 100.75 / 105.6 | 437.3 / 442.2 | Guns on "them." (peak -12 dB) and "and shot at". | Guns at 100.95 and 105.5 -> 106.0 (gaps); keep their flashes. | 1 |
| S05 | 49.38 | 385.9 | Label "Glover's Marblehead men": "Glover" is not said in S05 (only in S03). Pay-off still reads; strictly a 1c slip. | Name "The Marblehead men", sub "who saved the army at Brooklyn". | 1 |
| S06 | 40.8-52.7 | 540.3-552.2 | Bridge fight: 27 volleys + 10 guns, a continuous wall under narration: "three" (2 dB), "times." , "musket fire." (3 dB) masked; gun 51.4 / boom 51.9 and volleys to 52.7 keep firing over "Then Cornwallis stopped for the night" ("for" -5 dB): the picture contradicts the words. | Three waves, one per attack: 43.0-43.4, 45.6-46.5, 49.4-50.3; no cue after 50.3. | 2 |
| S06 | 43.5-49.3 | 543-549 | "Tried to storm the bridge three times": only arrows reach the bridge; no red block steps onto it, and the American guns sit far back from it, so "guns covering the bridge" is not visible (overlaps critic A). | Red line-block advances onto the bridge on each arrow and about-faces; guns placed at the south bridge end. | 2 |
| S06 | 59.5 | 559.0 | Plate note still "the road from Princeton" at night (the `plaque.note` "dusk"/"night" calls do not update the plate). | `["plaque.date", T.night - 0.1, {month:"January 1777", day:"2", weekday:"Thursday", note:"night"}]`. | 1 |
| S06/S07 | S07 0-0.7 | 581.4-582.1 | Date plate ghosts out and in across the dissolve (S06 plate fades with the scene, S07 plate animates in at 0.4) and swaps note/width. The decision card itself does not blink. | S07 plate at t=0 with no entry animation and the same content as S06's last plate (after the fix above both say "night"). | 1 |
| S07 | 86.5 / 88.55 | 667.9 / 669.9 | Nassau Hall guns on "town," (peak -2.6 dB) and "Americans broke". | Gun cues at 83.2 and 90.1 (gaps). | 1 |
| S07 | 115.65-117.9 | 697.0-699.3 | Cornwallis's march back north: arrow width 0.22, barely visible at 720p, then covered by method card 3 at 117.9. | Arrow `width: 0.5`; method card from `T.method - 0.15` (119.3). | 1 |
| S08 | 45.37 | 752.9 | Subscribe button 1.25 s before "Subscribe" (754.1). | `tSub: T.subscribe - 0.1`. | 1 |
| S08 | 48.3-65.7 | 755.8-773.2 | Tail: voice ends 755.8, button out ~756, clean map until the fade (1.5 s): ~17.4 s. OK. A large white cumulus sits bottom-right (where end-screen tiles go) for the whole tail. | `clouds keepClear` for the lower-right quarter in S08. | 1 |

Facts otherwise check out against FACT_NOTES (2,400 / 9 miles / 18 guns / ~900 + 100+ / none killed in the battle / Monroe / 6 weeks + $10 / 5,500 /
3 bridge assaults / ~500 at the creek / 12 miles / 30 yards / Mercer died 9 days later / ~200 prisoners / "less than three weeks"). Respect: Hessians are
soldiers throughout, no drunk-Hessians myth, the only quote (18 Dec letter) is sourced. Levels: voice sits ~20 dB over the music bed in the quiet scenes;
musket stem ducked correctly except in the dense S06 bridge fight.

## Top 10 fixes

1. S06 bridge fight: three volley/gun waves in word gaps, nothing after 50.3 (no firing over "stopped for the night"; unmask "three times").
2. S01 date plate: hide it over the Brooklyn flashback and 2 January (30.1-46.2); never show "25 December" over August.
3. Method cards 1 and 2: type faster and hold >= 2 s after the line completes (S03 end -> 140.2; S05 end -> 150.7).
4. S01 letter card: hold to 53.7 and type at cps 40 (the key set-up line must be readable).
5. Voice: "frozen river" -> "icy river" (S01 59.7); drop "black" (S05 42.6).
6. S01 Trenton guns and the S01 G3 orchard volleys into word gaps ("the Hessians at Trenton", "strike behind it").
7. Move 1 result as the big result card (same component as S05/S07).
8. Dive whooshes -6 dB or moved into gaps (S01 12.95, S03 2.45, S05 33.0).
9. S03/S04 stale plate "30 August first light" over Manhattan/White Plains: "Autumn 1776" or hide.
10. S06/S07 join: plate with no fade at S07 t=0 and the "night" note; then the small ones (subscribe buttons on their word, S05/S07 gun cues into gaps, Cornwallis arrow width, end-tail cloud).
