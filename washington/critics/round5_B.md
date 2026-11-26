# Round 5 - Critic B (STORY + SYNC + SOUND)

Film: `/tmp/wx_build/washington_round5_720.mp4` (12:53.2, -14.0 LUFS; scene starts unchanged). Renders `/tmp/wx_render6/SNN.mp4`.
Method: the round-4 tools re-run on the new material (`/tmp/wx_critic_B5/`): frame-difference flash sweep at EVERY gun/volley cue of all 8
scenes, cross-checked against `build/troop_stem_log.json` (which cues actually make a sound); 50-ms voice-vs-residual listings on the two moved
whooshes (mix minus voice x0.707); 10-frame strip across the S06/S07 join from the film; 2.5x crops of the S05 picket and the S06 Cornwallis banner;
full-scene big-frame-change scan of S02-S05 (new pods); seq.js / overlay.js diff c93d605 -> HEAD.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | R3 | R4 | R5 | One line |
|---|---|---|---|---|---|---|
| S01 hook | 7.5 | 8.0 | 8.5 | 8.5 | 8.5 | Whoosh 12.75: "Delaware." now whole (12.60-12.85 +15..+35 dB; only the breath decay 13.0-13.2 under). Cost moved to "On Christmas" (+3..+10 dB). Net small gain. |
| S02 background | 7.5 | 7.5 | 7.5 | 7.5 | 7.5 | New pod render clean (no full-frame pops); no sound cues. |
| S03 move 1 | 7.0 | 8.0 | 8.0 | 8.5 | 8.5 | Whoosh 1.4: "simple." clear (119.05-119.15 +8..+22 dB); "Their" weak again (+1.4..+6 dB). Known trade, accepted. |
| S04 retreat | 7.0 | 7.5 | 8.0 | 8.0 | 8.0 | New pod render clean; unchanged. |
| S05 move 2 | 7.5 | 7.5 | 8.5 | 8.5 | 8.5 | Greene's blocks start on "burst" (92.07) and march on the moved march stem (428.89); every sounded gun/volley flashes on its frame (99.43/99.47, 100.90, 103.5, 107.65, 108.2, 116.35). Round-4 render's full-frame grey pops gone. |
| S06 trap | 7.0 | 8.0 | 8.5 | 8.5 | 8.5 | Flashes on cue (15.80, 43.0, 46.1, 49.85). Cornwallis banner +0.6 s did NOT fix the top-edge entry (see R5-1). |
| S07 move 3 | 7.5 | 8.0 | 7.5 | 8.5 | 9.0 | JOIN FIXED: card steady 580.9-582.3, B lights at 581.7. Flashes still exact: 51.23 -> 51.23, 74.38 -> 74.38, 87.0 -> 87.00 (n=594), 90.4 -> 90.40 (n=622). |
| S08 ending | 8.0 | 8.5 | 8.5 | 9.0 | 9.0 | Unchanged. |
| **Overall** | **7.3** | **7.9** | **8.2** | **8.5** | **8.6** | |

**Fit to publish? YES** (story/sync/sound). No sev-2 left. The only visible defect is a 1.4 s banner cut at the top frame edge in S06; the
rest are whoosh tails on unstressed words. Story, structure, facts and respect unchanged and still good (2,400 at 15.9 s, 900 + "not one killed"
by 29 s, name slam 54.2 s, move 1 at 1:57.5, three set-ups paid off, no drunk-Hessian myth, the one quote sourced, ~16 s clean end map).

## Round-4 items

| # | Item | Status |
|---|---|---|
| R4-1 | S06/S07 card dip at the join | FIXED. `engage.decide({instant: true})` sets dim/card/options/note on at t 0 with `tl.set` (no tween below 0). Film strip 580.9 / 581.1 / 581.3 / 581.4 / 581.5 / 581.6 / 581.7 / 581.8 / 582.0 / 582.3: card, both boxes, OR and note at full the whole way; only the map underneath dissolves; B glows blue from 581.7, A dims. Flash check on `/tmp/wx_render6/S07.mp4`: volley 51.23 first flash 51.23; 74.38 first 74.38 (ripple to 74.9); gun 87.0 -> 87.00; gun 90.4 -> 90.40; 74.93-75.13 ripple 74.92-75.32; 82.0/82.3 on the move shot as before. All within 1 frame. |
| R4-2 | Whoosh tails on "Delaware." / "simple." | FIXED as asked, trade as predicted. S01 12.75: "Delaware." 12.60-12.85 +15..+35 dB (was -2..-24 at 12.80-13.15); residual rises from 13.0 (voice already in breath decay, -41 dB). "On" 13.95-14.05 +3..+10 dB, "Christmas" +5 with -1..-12 in its own consonant dips (voice -33..-45 there). S03 1.4: "simple." 119.05-119.15 +8..+22; "Their" 120.00-120.05 +1.4/+6.4, "commander," 120.25-120.30 +8..+14. Both audible on headphones; acceptable with the locked whoosh level. |
| R4-3 | S06 Cornwallis banner cut at the top edge | NOT FIXED - see R5-1. |
| R4 #5 | S07 flashes within 1 frame after the engine change | DONE (above). |
| R4 #7 | Keep S05 street-fight cues | Kept; all on time on the new render. |

Full flash sweep (`all.py` on render6, every gun/volley cue in cues.json, then filtered by the troop stem log): every SOUNDED volley/gun has a
visible flash from -0.27 to +0.07 s of its sound start. The cues with late or missing flashes (S05 94.3; S06 16.9, 18.0, 29.6, 30.6) are not in
the troop stem (no sound), so no bang without a cause. S05 94.3 (the picket's 2nd volley, fx every 1.8 s) has no visible flash in the 2.5x crop
and no sound - consistent, nothing to fix. Big-frame-change scan of S02-S05 at 320x180: 0 frames with > 20,000 changed pixels (the round-4
pods' grey-ellipse pops are gone). The ~1.47 s periodic small diffs in the S05 night/dawn shots are the falling snow, not flashes.

## NEW findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| R5-1 | S06 | 52.6-54.0 | 552.0-553.4 | Cornwallis banner (top centre) is on from 51.3 (t0 = T.stopped - 0.15) but the camera only brings it into frame from the top edge: 52.6 flag tip only, 52.8 flag, 53.2 portrait cut at the top, 53.6 name plate missing, 54.0 plate half cut, fully framed from ~54.2. The +0.6 s shift could not help because the reveal is the camera rise, not the fade. | Move the banner 3 u south: `keys: [[0, 1357.4, 2059.4]]` (still over the red blocks north of the creek), OR `t0: 54.2` (= T.stopped + 2.75; he is not named at that moment, so no word sync is lost). S06 re-render only. | 1 |
| R5-2 | S01 | 13.95-14.2 | 13.95-14.2 | Whoosh tail now under "On Christmas" (+3..+10 dB on "On"). Intelligible, slightly soft. | Accept (locked level, no gap long enough). If anything: `whooshAt: 12.85` (still after "-ware" peaks at 12.65-12.80) moves 0.1 s more of the body into the 13.2-13.9 gap. Audio-only. | 1 |
| R5-3 | S03 | 2.48-2.55 | 120.00-120.07 | "Their" onset +1.4 dB (the round-3 state). | Accept - "simple." matters more. No change. | 1 |

Masking scan summary (2,029 words, 313 flags < 8 dB mean or < 3 dB onset): the real overlaps are R5-2 / R5-3 only; the rest are the known
word-boundary artefacts (silence inside the aligned span) and quiet word tails over the music, same set as rounds 3-4. Levels: voice ~20 dB over
the music in quiet scenes, musket peaks -10..-15 dBFS on the stem, LUFS -14.0.

## Top 10 fixes

1. R5-1 S06 Cornwallis banner: 3 u south (y 2059.4) or `t0: 54.2` - only if S06 is rendered again; otherwise accept (sev 1).
2. R5-2 S01 `whooshAt` 12.85 (optional, audio-only); re-run the 50-ms listing on 12.4-14.6.
3. Keep S07 `instant: true` decide and the S07 render as is (join + flashes verified).
4. Keep the S05 render6 (Greene on "burst", flashes on sound, no pops) - do not re-render on an A4500.
5. Keep S03 whoosh 1.4.
6. Add the flash sweep (`/tmp/wx_critic_B5/all.py`, filtered by `troop_stem_log.json`) to `tools/render_qa.py`: every sounded volley/gun must have a frame-diff hit within 1 frame.
7. Drop the unsounded fx cues from cues.json (S05 94.3; S06 16.9, 18.0, 29.6, 30.6) or mark them silent, so the check reads clean.
8. Keep the S01 hook timings (2,400 15.9 s, 900 + no deaths by 29 s).
9. End screen: keep the ~16 s clean map.
10. Final assembly: re-run `tools/check_sound_lock.py` and the LUFS check on the upload master.
