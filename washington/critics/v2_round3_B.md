# v2 round 3 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_v2r3_720.mp4` (17:32, **-14.0 LUFS**, LRA 3.1, true peak **-1.3 dBFS**). Renders `/tmp/wx_v2r3/SNN.mp4`
(16:38-17:14), stem log 17:20, film 17:32: stem and picture match. Voice/story/word times unchanged.
Scratch + stills in `/tmp/wx_critic_Bv2r3/` (`vol05.jpg` S05 volleys, `guns.jpg` S05 guns, `s06vol.jpg` + `c06.jpg` + `d.jpg` S06 jersey
volley crops, `s06c.jpg` bridge/label, `g2.jpg` S06/S07 guns, `s07.jpg` S07 overlays, `s05b.jpg` S05 plates, `joins.jpg`, `s03_leg.png`).
Sound cues read from `scenes/SNN/cues.json` (gun/boom/whoosh) and `build/troop_stem_log.json` (muskets).

## Scores (10 = Grand Maneuver polish)

| Scene | v2 r2 | v2 r3 | One line |
|---|---|---|---|
| S01 hook | 8.5 | 8.5 | Unchanged sync; 22.45 gun + volleys, 63.63 / 67.7 flash on frame. |
| S02 background | 7.5 | 7.6 | Troop lines across the frame; marches sound on visible walks (27.4-29.0, 38.3). Key shows "Howe" 47 s before the name is spoken (old). |
| S03 move 1 | 8.6 | 8.5 | Key + timeline from 0.2 s now; small regression: "Howe" in the key 3.9 s before "Howe" (4.16). |
| S04 retreat | 8.0 | 8.0 | Unchanged. |
| S05 move 2 | 7.9 | 8.7 | B3-1 FIXED (King St + Queen St volleys flash on the Hessian blocks, `vol05.jpg`), B3-2 FIXED (Sullivan's block in frame, fires at 107.75 on its block), B3-4 FIXED (Greene clear of the farm), B3-5 FIXED (9:30 "the battle over" under the ledger). "No fortifications" plate on its word (13.0 / 13.05). Guns flash on every cue. |
| S06 trap | 8.5 | 8.4 | B3-6 FIXED ("stone bridge" beside the bridge). B3-3 NOT FIXED and wider than I wrote: every jersey skirmish volley (blue AND red) shows a single flash point 30-55 px W/NW of its block, in empty grass. Assault arrows run ahead of "storm the bridge". |
| S07 move 3 | 9.0 | 8.9 | B3-7 FIXED (one "froze": plate only, clock keeps "the back road"). Princeton seal right of Jan. Clock "8:00 an orchard" now stale over the college + result ledger; key shows "Mawhood", a name never spoken. |
| S08 ending | 9.0 | 9.0 | Unchanged; clean end-screen map. |
| **Overall** | **8.5** | **8.7** | |

**Fit to publish? YES from the story/sync/sound side (8.7).** The two S05 "shots from nowhere" (round 2's blockers) are fixed and the mix
is on target. One sev-2 item is left (S06 jersey flashes off their blocks, 5 quiet volleys at -15 to -19 dB). It needs only a seq.js change and an
S06 11-33 re-render, and it should go in before upload if a render slot is free.

## Checks that pass
- **Level**: -14.0 LUFS integrated, TP -1.3 dBFS (<= -1), LRA 3.1. Voice clear, music under it.
- **Flash <-> sound**: S05 picket 92.5 (428.99), Hessian volleys 103.5 / 103.6 (439.99 / 440.09) on the King St / Queen St groups,
  Sullivan 107.75 (444.24) on his block, ring 116.35 / 116.65 (452.84 / 453.14); guns 99.45 / 100.9 / 103.55 / 107.65 / 108.2 each a visible
  muzzle flash at the street-head guns (`guns.jpg`; 99.45 gun cue, no impact boom, as asked in round 1). S06 cannon 43.02 / 46.12 / 49.87 flash +
  smoke on the south-bank guns, bridge lines fire on the block fronts. S07 orchard 51.2-54.0, 74.4-75.1, 82.4, guns 87.0 / 90.4 flash in frame.
  No sounded cue without a flash found; no flash without a cue found.
- **Overlays on or after their words**: S05 "No fortifications" 13.0 (word 13.05); clocks 18:00 / 23:00 / 3:00 / 8:00 / 9:30; ledger rows on
  "captured" / "killed" / "killed" / "battle" / "James" / "future"; method card after ledger.hide (one big card at a time). S06 "5,500" on "five",
  "American riflemen" on "riflemen", "stone bridge" 42.07 (word 42.17), "Three attacks" on "three". S07 "About 500 men" on "five", "The mud froze"
  27.65 (word 27.70), 7:25 after "sunrise", 8:00 "an orchard" on "orchard", seal "Princeton" on "surrendered", ledger rows on their words.
- **Key + timeline**: on every map shot, out for every big card (S05 ledger/letter, S06 decision card, S07 ledger/letter). No overlap of big cards.
- **Date plate**: S04 -> S05 keeps "8 December, Sunday" until "Christmas", as intended; 26 Dec on "schedule".
- **Joins** (73.4, 117.5, 270.8, 336.5, 499.4, 581.3, 707.5): clean dissolves, plates/key carry across, no flicker (`joins.jpg`).
- **Respect / facts**: script unchanged; Hessians as soldiers; overlays say only what is spoken (exceptions below).

## Findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| B4-1 | S06 | 15.8-17.7, 16.6-18.8, 28.4-31.6, 30.95 | 515.2-532.3 | NOT FIXED (B3-3), and wider: all five jersey skirmish volleys (blue 15.8 / 28.4 / 30.95, red 16.6 / 29.4) show ONE flash point 30-55 px W/NW of the block that fires, in open grass or across the road (`c06.jpg`, `d.jpg`); the E05 shift (+0.5 u x) did not move it onto the block. The skirmisher figures are E/NE of the blue blocks. Cause is likely the JK scaling (`cluster: [2.6*KJ, 1.4*KJ]` = [7.0, 3.8], `height 2.4*KJ`), which throws the flashes off the seg. | l.95-99: test `JK.cluster` at [2.6, 1.4] and `height` 2.4 (keep muzzle 5*KJ for size), then check a 16.0 / 28.6 still: the flashes must spread along the block front (blue) / the red pair's front. If still off, move each seg ~1 u E (blue) / onto `RD(52)` red front. Same times; re-render S06 11-33, `troop_stem.py`, `assemble.py`. | 2 |
| B4-2 | S06 | 38.8-43.4 | 538.2-542.8 | Red assault arrows (ta + 1.2 = 38.8, 41.4) and the first two assault blocks reach the bridge while the voice still says "Washington's army stood behind the Assunpink... guns covering the stone bridge"; the attack is shown 4.6 s before "tried to storm the bridge" (43.41) and the second arrow before "three". | l.80: arrow `t0: Math.max(ta + 1.2, T.storm - 0.05)` (43.36 for the first, 45.12 on "three" for the second, 45.2 third), or shift AS start times +3 s (37.6 -> 40.6) so the first push lands on "storm". | 1 |
| B4-3 | S07 | 84.0-105.0 | 665.3-686.3 | Clock "8:00 an orchard" stays over the college surrender and the whole result ledger (stale note, as B3-5 was in S05). | `["plaque.clock", T.college - 0.05, { time: "8:00", note: "the college", header: "3 January 1777" }]`, or a note "the battle over" at T.lost - 0.5 (time only if FACT_NOTES gives one). | 1 |
| B4-4 | S07 | 45.9-91.0 | 627.2-672.3 | Key sub "Mawhood": the name is never spoken (script says "a British brigade"). | l.252: sub "" (or "Princeton brigade"). | 1 |
| B4-5 | S03 / S02 | S03 0.3-4.16; S02 0.9-44.7 | 117.8-121.7; 74.3-118.1 | Key sub "Howe" before "Howe" is first spoken (S03 4.16). S03 regression from moving the key to 0.3; S02 had it already (missed in round 2). | S02 l.109 + S03 legend: sub "" for British until T.howe (S03 4.11), then a second legend entry with "Howe". | 1 |
| B4-6 | S05 | 107.75-109.9 | 444.2-446.4 | Better (in frame, on its block), but the block stands in open ground ~60-100 px west of the lower-town houses and fires east into an empty street: "shot at from the houses" is only half shown. | Optional: sPos[0] 0.8 u east ([1354.2, 2062.4]) so the block stands among the first houses; volley pts follow. | 1 |
| B4-7 | S05 | 150.8-152.1 | 487.3-488.6 | Date plate "New York" note at CUT3 + 0.3 (151.1), 1.0 s before "New York" (152.13); the plate's empty day box reads oddly. | `plaque.date` at T.newyork - 0.05 (152.08), or note "" at the cut and "New York" on its word. | 1 |
| B4-8 | S06 / S07 | cues.json | | B3-8 unchanged (unsounded second-ripple cues still in cues.json); no visible effect. | Tag `silent` in the cue export. | 1 |

## Round-2 issue status
B3-1 FIXED - B3-2 FIXED (partly, see B4-6) - B3-3 NOT FIXED (B4-1, also on the red volleys) - B3-4 FIXED - B3-5 FIXED - B3-6 FIXED -
B3-7 FIXED - B3-8 unchanged (B4-8). Regressions: S03 key "Howe" 3.9 s early (B4-5). No level, join or plate regression; the clock / date
plates otherwise all hold the right day.

## Top fixes
1. B4-1: S06 jersey skirmish flashes onto their blocks (JK cluster/height back to unscaled values, verify on 16.0 / 28.6 stills).
2. B4-2: S06 assault arrows / first push on "storm the bridge" (43.4), the second on "three".
3. B4-3 / B4-4: S07 clock note off "an orchard" from the college on; drop "Mawhood" from the key.
4. B4-5 / B4-7: no "Howe" before it is spoken (S02, S03); "New York" plate on its word (S05 152.1).
5. Then re-render S06 (11-50), S07 overlays (84-105), S02/S03/S05 overlay-only frames, `troop_stem.py`, `assemble.py`, LUFS check (-14.0, TP <= -1).
