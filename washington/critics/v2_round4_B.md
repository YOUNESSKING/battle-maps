# v2 round 4 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_v2r4_720.mp4` (12:53.2, **-14.0 LUFS**, LRA 3.1, true peak **-1.2 dBFS**). Renders `/tmp/wx_v2r4/SNN.mp4`
(durations match `audio/scenes.json` to one frame); stem log `build/troop_stem_log.json` (round-4 events). Voice/story/word times unchanged.
Scratch + stills in `/tmp/wx_critic_Bv2r4/` (`s06v1.jpg` / `s06v4.jpg` / `s06v3.jpg` jersey volleys at 5-10 fps, `s06br.jpg` bridge 36.5-46.5,
`s06b.jpg` bridge wide, `s07_sheet.jpg` S07 plates, `s05_sheet.jpg` + `s05g2.jpg` S05 volleys/guns, `s05_plate.jpg` New York plate,
`keys.jpg` S02/S03 key, `s01m.jpg` S01 montage, `s04_sheet.jpg` S04 labels, `joins.jpg`).

## Scores (10 = Grand Maneuver polish)

| Scene | v2 r3 | v2 r4 | One line |
|---|---|---|---|
| S01 hook | 8.5 | 8.5 | Key + timeline now on the three montage map shots (55.5-70.0), out for the title; 63.63 / 67.7 volleys flash on frame. No text before its word. |
| S02 background | 7.6 | 7.8 | B4-5 FIXED: British sub blank, no "Howe" before it is spoken. |
| S03 move 1 | 8.5 | 8.6 | B4-5 FIXED: "Howe" appears in the key at 4.1 (word 4.16), box height held. |
| S04 retreat | 8.0 | 8.0 | Hessian labels moved clear of "Knyphausen", still on "Hessian" (41.3) / "fourteen" (46.2). Old: Rall banner 1.2 s before "Rall". |
| S05 move 2 | 8.7 | 8.8 | Closer camera keeps every volley on a visible block (92.5 picket, 103.5/103.6 street groups, 107.75 Sullivan) and every gun cue on a flashing gun (99.45, 100.9, 103.55, 107.65, 108.2). B4-7 FIXED ("New York" in at ~152.3, word 152.13). New small one: "9:30 the battle over" clock sits 1.3 s on the New York map. |
| S06 trap | 8.4 | 8.7 | B4-1 FIXED: all five jersey skirmish volleys flash on (or at the skirmishers just off) their blocks, red on the front pair. B4-2 HALF FIXED: arrows now on "storm" / "three" / "Each", but the first assault block still walks to the bridge 39.5-41.5, ~3 s before "storm". |
| S07 move 3 | 8.9 | 9.0 | B4-3 FIXED (clock "the college" on its word 85.2). B4-4 FIXED (no "Mawhood"; British sub blank). Key kept under the side ledger (small plate, no clash). |
| S08 ending | 9.0 | 9.0 | Unchanged. |
| **Overall** | **8.7** | **8.8** | |

**Fit to publish? YES from the story/sync/sound side (8.8).** Every sev-2 item is gone. What is left is sev 1 timing polish. The
only one a viewer may notice is the S06 assault walking in before "storm". It needs only `AS` start times plus an S06 32-50 re-render.

## Checks that pass
- **Level**: -14.0 LUFS integrated, TP -1.2 dBFS (<= -1), LRA 3.1. Voice clear; jersey skirmish muskets quiet (-19 dB) as before.
- **Flash <-> sound**: S06 jersey volleys 15.8 / 16.6 / 28.4 / 29.4 / 30.95 (film 515.23 / 516.03 / 527.83 / 528.83 / 530.38). Blue flashes
  are on the block front at 15.8-16.2 and 28.4-31.2. At 17.1-17.3 they sit ~20 px E of the block among the skirmisher figures, which reads as
  the riflemen firing. Red 16.6 / 29.4 flash on the front red pair. Bridge waves 43.0 / 46.1 / 49.85 + guns 43.02 / 46.12 / 49.87 are
  unchanged and on the blocks/guns. S05 picket 92.5 flashes on the red picket (top-right, in frame). Street volleys 103.5 / 103.6 are on
  both Hessian groups, Sullivan's 107.75 is on his block (lower left), and guns 99.45 and 100.9 flash on the left and right gun
  (`s05g2.jpg`). S07 cues unchanged. No sounded cue without a flash and no flash without a cue was found.
- **Overlays on or after their words**: S03 "Howe" 4.12 (4.16); S05 "New York" ~152.3 (152.13); S06 arrows 44.32 / 45.12 / 46.62 on
  "storm" / "three" / "Each", "Three attacks" on "three", "stone bridge" on "bridge"; S07 clock "the college" 85.21 (85.28), ledger rows on
  their words. S04 "Hessians" / "About 1,400 men" on their words, now clear of the carved regiment names.
- **One big card at a time**: S07 ledger is a corner plate, so the key staying under it is fine. Decision card, method cards and title
  are alone on screen.
- **Joins** (73.4, 117.5, 270.8, 336.5, 499.4, 581.3, 707.5): clean dissolves, plates carry across (`joins.jpg`).
- **Respect / facts**: script unchanged; overlays say only what is spoken.

## Findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| B5-1 | S06 | 39.5-44.3 | 538.9-543.7 | B4-2 half fixed. The arrows are on their words, but assault block 1 (`AS[0]` ta 37.6) walks down Queen St and stands at the bridge by ~41.5, while the voice still says "stood behind the Assunpink... guns covering the stone bridge". The arrow then lands on a block that is already there, and the first wave (43.0) fires at an attack nobody has announced. | l.~72 `AS` start times: `[1356.15, 2068.75, 39.4]`, `[1354.4, 2067.6, 41.2]`, `[1358.0, 2067.6, 44.6]` (block 1 arrives 44.4 on "storm", block 2 46.2, block 3 49.6). Keep `WAVE`: at 43.0 block 1 is 1 u short of the creek and in frame. Check the about-face holds (ta + 14.4) still end before the night shot 51. Re-render S06 32-51, `troop_stem.py`, `assemble.py`. | 1 |
| B5-2 | S05 | 150.8-152.3 | 487.3-488.8 | New since r3 moved the plate onto its word: the "9:30 in the morning / the battle over" clock stays 1.4 s over the New York (colonies) map after CUT3, then cross-fades. | Add `["plaque.date", CUT3 + 0.3, { month: "December 1776", day: "", weekday: "", note: "" }]` before the 152.08 entry, which sets the note. Or end the clock at CUT3 - 0.1. Overlay-only frames 150.5-153. | 1 |
| B5-3 | S04 | 47.95-49.16 | 318.7-319.9 | (Old, missed before) Rall banner (name "Rall") comes in on "Colonel" 47.95; "Rall" is spoken at 49.16. | Banner `t0: T.rall - 0.05` (49.11), l.93. | 1 |
| B5-4 | S05 | 152.3- | 488.8- | Date plate still shows an empty day box with only "New York" (B4-7 second half). | Optional: `day: "27"`-style day only if FACT_NOTES dates Cornwallis's recall. Otherwise leave it. | 1 |
| B5-5 | S07 | 85.2-104.5 | 666.5-685.8 | Clock keeps "8:00" for the college surrender (Nassau Hall fell later that morning). It is not wrong for the start of the fight, but it reads as exact. | Time "8:00" -> keep the note and drop the time, or use the FACT_NOTES time if one is given. Overlay-only. | 1 |
| B5-6 | S06 / S07 | cues.json | | B4-8 unchanged: unsounded second-ripple volley cues still listed. No visible effect. | Tag `silent` in the cue export. | 1 |

## Round-3 issue status
B4-1 FIXED - B4-2 HALF FIXED (arrows yes, blocks no; B5-1) - B4-3 FIXED - B4-4 FIXED - B4-5 FIXED (S02 + S03) - B4-6 not changed (optional,
Sullivan still reads well enough at the lower town) - B4-7 FIXED (small side effect B5-2) - B4-8 unchanged.
Regressions: none in sound, level or joins. The S05 camera re-frame keeps every volley and gun on screen.

## Top fixes
1. B5-1: S06 assault blocks start later (AS ta 39.4 / 41.2 / 44.6) so the first push reaches the bridge on "storm".
2. B5-2: S05 clear the 9:30 clock at CUT3 (blank date plate, note on "New York").
3. B5-3: S04 Rall banner on "Rall" (49.11).
4. B5-5: S07 college clock without the exact "8:00".
5. Then re-render S06 32-51 and the S04/S05/S07 overlay frames, run `troop_stem.py` and `assemble.py`, and check LUFS (-14.0, TP <= -1).
