# v2 round 1 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_v2r1_720.mp4` (12:53.2, **-14.0 LUFS**, LRA 3.1, true peak -1.2 dBFS). Renders `/tmp/wx_v2r/SNN.mp4`.
Scope: regressions from the v2 look (new worlds, v14-scale troops, clocks, THE ARMIES key, wax-seal timeline, ledgers, carved names,
>= 2.2 s volleys, S06 bridge volleys once each). Voice, story and word times are unchanged, so the story/hook scores carry over from round 6
unless the picture under a line changed. Tools + stills in `/tmp/wx_critic_Bv2/` (cue sweep v2 vs v1 `v2.txt`/`v1.txt`, 10-30 fps crops of
every volley window, overlay crops, join strip, tail strip). Stem log read against `sound/troop_events_*.json(.vis.json)`.

## Scores (10 = Grand Maneuver polish)

| Scene | R6 (v1) | v2 r1 | One line |
|---|---|---|---|
| S01 hook | 8.5 | 8.5 | Unchanged sync: 22.45 gun + 3 volleys flash on the frame, 63.63 / 67.7 flashes on the blue blocks. Labels, 2,400 / 900, letter, name slam all on their words. Timeline + key from 1.4 / 1.9 s (furniture, accepted). |
| S02 background | 7.5 | 7.5 | No guns. Overlays on their words. |
| S03 move 1 | 8.5 | 8.2 | Ledger row 1 "9,000 ACROSS / in a single night" lands 4.2 s before "crossed ... in a single night" (B2-3). Clocks fine (notes spoken; times are watch faces). |
| S04 retreat | 8.0 | 8.0 | Unchanged. |
| S05 move 2 | 8.5 | 7.6 | Picket lost: "burst out of the storm onto the Hessian outposts" now shows no Hessians and no shot (B2-1). Hessian street volley 103.5 flashes from gardens with no troops (B2-4). "a future president" readable ~0.5 s (B2-5). Gun shots 99.45-108.2 on the frame. |
| S06 trap | 8.8 | 8.0 | Join steady. Bridge volleys 43.0 / 46.1 / 49.85 fire once, on the frame, BUT the two American firing lines sit in the gap between the narrower v14 blocks: flashes + 14-musket bangs from empty ground (B2-2). |
| S07 move 3 | 9.0 | 8.5 | Orchard / "Both sides fired" / advance volleys flash within 1 frame; the second-ripple cues (52.83, 75.98, 83.6...) show smoke only, no flash, no sound: consistent. Clock notes run ahead of or beyond the words (B2-6, B2-7). |
| S08 ending | 9.0 | 9.0 | ~19 s clean map 754-773 s with only the subscribe pop; letter + method cards fine. |
| **Overall** | **8.7** | **8.2** | |

**Fit to publish? NO (close).** No sound/level regression and the S06/S07 join is fine. But three sync rules broken by the new look (sound or
flash with no visible shooter in S05 / S06; a key line with no picture in S05). All are seq.js-only fixes, then a re-render of S05 + S06 (and
S03 / S07 for overlay times), stem re-export (`troop_stem.py`) and `assemble.py`.

## Checks that pass
- **-14.0 LUFS integrated**, TP -1.2 dBFS, LRA 3.1 (= v1). Voice/music levels untouched.
- **Flash <-> sound**, sounded events (stem log): S01 22.45-22.55, 63.63, 67.7; S05 guns 99.45 / 100.9 / 103.55 / 107.65 / 108.2, volleys
  107.75, 116.35, 116.65; S06 jersey riflemen 15.8 / 16.6 / 28.4 / 29.4 / 30.95, bridge 43.0-50.1; S07 51.23 / 51.48 / 53.71 / 54.01 / 74.38-75.13
  / 82.0 / 82.3, guns 87.0 / 90.4: first muzzle flash within 0-1 frame of the first shot in the 10-30 fps crops.
- **Unsounded second ripples** (cues 52.83, 53.08, 55.31, 55.61, 75.98-76.73, 83.6, 83.9 in S07; 16.9, 18.0, 29.6, 30.6, 32.05 in S06): crops show
  no muzzle flash, only the smoke curtain building. No flash without a bang.
- **Flash size at 720p**: v14 flashes are 2-4 px warm dots with a soft glow; visible on 1:1 crops for every sounded event, readable but small
  on the wide S05 116.35/116.65 shot (see B2-8).
- **Carved names** all on (or 0.05-0.3 s before the onset of) their word; "Trenton" at S05 97.6 is the town named 19 s earlier: OK.
- **S06/S07 decide-card join** (film 578.6-583.4): card, boxes, OR, footer steady through the dissolve, B turns blue at ~581.8 on "slipped
  away" (581.74). No flicker.
- **Cards held**: S03 ledger rows >= 2.5 s, S07 ledger rows >= 2.7 s, letters/method cards as v1. Masking: no cue moved; v1 listings stand.
- **Respect / facts**: unchanged script; Hessians as soldiers; no new claims except overlay text (B2-6/7).

## Findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| B2-1 | S05 | 92.07-94.0 | 428.6-430.5 | REGRESSION. "they burst out of the storm onto the Hessian **outposts**": the picket (red unit at [1339.9, 2024.6], seq.js l.119) is above the top of the new 8 a.m. frame (key CUT2 at [1335.0, 2033.6] dist 16.5), so `troop_stem.py` drops its 92.5 volley as off screen. v1 showed the picket fire with a bang; v2 shows no Hessian at all on "Hessian outposts", and Greene's blue block walks through the farm buildings at 92.6-93.4. | Bring the picket into frame: move it to [1338.2, 2030.2] (and the volley pts l.178 to [[1337.9, 2029.9], [1338.5, 2030.1]]), or aim the CUT2 key at [1336.6, 2030.0]. Keep the volley at 92.5 (one fire). Move the blue start points (l.124 s0) 1.5 u west so the block clears the farm. Re-export the stem; confirm 92.5 is in `troop_stem_log.json`. | 2 |
| B2-2 | S06 | 43.0-50.4 | 542.4-549.8 | NEW. The American bridge volleys fire from empty ground: VOL pts x 1352.3-1354.7 and 1357.9-1360.3 at y 2075.6 (l.102-103) fall in the gap between the narrower v14 blocks at x 1352.4 and 1360.4 (y 2076.3, l.60); crop 43.25 s shows the two flash rows ~40 px in front of and beside the blocks, among a few loose figures. Each line carries a 14-shot sound (peak -10 dB) panned to the empty spot. | Put each firing line on a block front: l.102 pts [[1351.5, 2075.9], [1353.3, 2075.9]], l.103 pts [[1359.5, 2075.9], [1361.3, 2075.9]] (or add two blocks at x 1353.5 / 1359.1). Re-render S06 42-51, re-export stem. | 2 |
| B2-3 | S03 | 122.4-127.1 | 239.9-244.6 | NEW (ledger). Row 1 "9,000 ACROSS / *in a single night*" appears on "nine" (122.37); "crossed" is 125.62, "single night" 126.78. 4.2 s ahead of its words. | `ledger.add` at T.crossed2 - 0.05 (125.58) with the note, or split: row "9,000 men" at T.ninek, note "across in a single night" via `ledger.note` at T.single. | 2 |
| B2-4 | S05 | 103.5-104.3 | 440.0-440.8 | NEW. "Hessians tried to form up in the streets": their return volley (l.181, pts at KING(2058.8)) flashes among the gardens east of King Street; the Hessian blocks are further east by Queen Street (v14 n:3 blocks), so 15 shots come from no visible troops. | Move the volley pts onto the rH blocks' actual position at 103.5 (read their key at 103.5; ~[1356.6, 2059.6] Queen St), or key rH[0] into King St at 103.0. | 2 |
| B2-5 | S05 | 141.07-141.9 | 477.6-478.4 | NEW (ledger). `ledger.note` "a future president" fades in at 141.2 and the ledger fades out from 141.7: readable ~0.5 s. | `ledger.note` at T.future - 0.05 (140.68); `ledger.hide` 142.2; letter t0 142.5 (one card at a time kept). | 2 |
| B2-6 | S07 | 45.9-49.5 | 627.2-630.8 | Clock note "William Clarke's orchard" is up 3.6 s before "orchard" (49.50) and the name is never spoken. | Note "an orchard" (or "near Princeton") and set the `plaque.clock` at T.orchard - 0.05 (49.47); or keep 8:00 at CUT3 + 0.6 with note "Princeton" (spoken 35.88). | 2 |
| B2-7 | S07 | 23.6-27.7 | 604.9-609.0 | Note "hard frost" at T.changed (23.60) pre-empts and paraphrases "the muddy roads froze hard" (27.70) and THE MUD FROZE stamp. | `plaque.note` at T.froze + 0.4 (after the stamp), text "the roads froze". | 1 |
| B2-8 | S05 | 116.35-117.3 | 452.8-453.8 | Surrender volleys: flashes 2-3 px on the wide field (dist 13.5-14), barely readable at 720p while the bang is full level. | Raise `muzzle` for these two VOLs (x1.6) or drop their peak 3 dB in `troop_sfx` for wide shots. | 1 |
| B2-9 | S07 | 17.58-19.8 | 598.9-601.1 | Clock "2:00 AT NIGHT / the back road / 3 JANUARY 1777" 2.2 s before "back road"; "3 January" spoken only at 33.2. | `plaque.clock` at T.road - 0.05 (20.01); header "2 - 3 January 1777" or keep and accept. | 1 |
| B2-10 | S07 / S05 / S03 | ledger notes | | Notes running 1-2.7 s ahead of their words: S07 "killed, wounded or captured" (92.0 vs 93.04-94.64), "died nine days later" (101.3 vs 102.08-104.02), "Almost 200 prisoners" (95.2 vs "prisoner" 97.22); S05 "About 900 captured" (128.2 vs 129.37), "Over 100 killed or wounded" (130.45 vs 131.43), "in the battle" (133.55 vs 135.39); S03 "stragglers" (128.54 vs 129.26). | Add rows on the number and the note with `ledger.note` on its first word (e.g. S07 note at T.died 102.08). Low priority. | 1 |
| B2-11 | S07 | 85.3-88.9 | 666.6-670.2 | Carved "Nassau Hall" on "college"; the name is never spoken (carried over from v1). | Text "college" or accept. | 1 |
| B2-12 | S06 / S07 | cues.json | | The unsounded second-ripple cues still sit in cues.json (S06 16.9 / 18.0 / 29.6 / 30.6 / 32.05; S07 52.83 ... 83.9): no flash, no sound, but they make sweeps read dirty. | Drop or tag them `silent` in the engine cue export. | 1 |

## Top 10
1. B2-1: S05 picket back in frame + its 92.5 volley sounded ("Hessian outposts" must show Hessians).
2. B2-2: S06 bridge firing lines onto the blue block fronts.
3. B2-4: S05 Hessian street volley onto the Hessian blocks.
4. B2-3: S03 ledger row 1 on "crossed", note on "single night".
5. B2-5: S05 "a future president" held >= 1.5 s (note on "future", hide 142.2, letter 142.5).
6. B2-6: S07 8:00 clock note "an orchard" on "orchard".
7. B2-7: S07 "the roads froze" after the stamp.
8. B2-8: bigger muzzle flashes on the S05 wide surrender volleys.
9. B2-9 / B2-10: clock + ledger notes on their words.
10. After the fixes: re-run the flash crops on S05 92-95, 103-105 and S06 42-51, `troop_stem.py`, `assemble.py`, `tools/check_sound_lock.py`, LUFS (-14.0).
