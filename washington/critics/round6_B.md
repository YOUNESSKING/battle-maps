# Round 6 - Critic B (STORY + SYNC + SOUND), confirmation pass

Film: `/tmp/wx_build/washington_round6_720.mp4` (12:53.2, **-14.0 LUFS**, LRA 3.1, peak -1.1 dBFS). Renders `/tmp/wx_render7/SNN.mp4`.
Scope: regressions only in what changed since round 5 (S01 whoosh 12.85; S03 dive + covering-force shots; S05 NJ landing / Trenton camera /
picket once at 92.5; S06 Cornwallis banner; S07 stamp; the tiled musket-stem loop). Tools in `/tmp/wx_critic_B6/`: the round-5 flash sweep on
render7 (every gun/volley cue of S03/S05/S06/S07, filtered by `build/troop_stem_log.json`), a 1280x720 crop sweep of the S05 picket, 50-ms
voice-vs-residual listings on both whooshes, film strip across the S06/S07 join, frames at the Cornwallis banner, the covering-force label and
THE MUD FROZE stamp, and a per-8-s level read of the troop stem against the mix over the long boarding stream.

## Scores (10 = Grand Maneuver polish)

| Scene | R1 | R2 | R3 | R4 | R5 | R6 | One line |
|---|---|---|---|---|---|---|---|
| S01 hook | 7.5 | 8.0 | 8.5 | 8.5 | 8.5 | 8.5 | Whoosh 12.85: "Delaware." clean (12.65-12.80 +35..+38 dB). "On" 13.95-14.05 +1.5/+8.6/+6.4 (R5 +3..+10): neutral, no gain, no loss. |
| S02 background | 7.5 | 7.5 | 7.5 | 7.5 | 7.5 | 7.5 | Unchanged. |
| S03 move 1 | 7.0 | 8.0 | 8.0 | 8.5 | 8.5 | 8.5 | Whoosh numbers identical to R5 ("simple." +19..+23, "Their" +1.4). "covering force" label fades in on "covering" (71.30), gone by 75. No gun cues. |
| S04 retreat | 7.0 | 7.5 | 8.0 | 8.0 | 8.0 | 8.0 | Picture unchanged; gets 35 s of the stray plank-footsteps bed (R6-1), inaudible. |
| S05 move 2 | 7.5 | 7.5 | 8.5 | 8.5 | 8.5 | 8.5 | Picket now ONE volley: crop flash at 92.50 (sound 92.50, ripple flashes to 93.4, shots to 93.27); nothing at 94.3 in sound or picture. All other guns/volleys within 1 frame or a ripple lead. |
| S06 trap | 7.0 | 8.0 | 8.5 | 8.5 | 8.5 | 8.8 | R5-1 FIXED: Cornwallis banner absent at 54.0, fades in fully framed at 54.2 (top centre, name plate whole), steady to the decide card. Flashes unchanged (15.80, 16.6, 28.4, 29.4, 30.95, 43.0, 46.1, 49.85). |
| S07 move 3 | 7.5 | 8.0 | 7.5 | 8.5 | 9.0 | 9.0 | Join steady (580.9-582.3: card, boxes, OR, note at full; B blue from ~581.7). THE MUD FROZE slams at 27.65 on "froze" (27.70), now clear of the banner. Guns 87.0/90.4 on frame. |
| S08 ending | 8.0 | 8.5 | 8.5 | 9.0 | 9.0 | 9.0 | Unchanged. |
| **Overall** | **7.3** | **7.9** | **8.2** | **8.5** | **8.6** | **8.7** | |

**Fit to publish? YES.** No visible or audible regression in the touched scenes. One sound-tool bug found (R6-1), harmless in this mix
(~45 dB under the programme), but it should be fixed in the tool before the next video.

## Round-5 items

| # | Item | Status |
|---|---|---|
| R5-1 | S06 Cornwallis banner cut at the top edge | FIXED (y 2059.4, t0 54.2). Named at 50.71, shown 54.2 - after the word, still during "His men were tired... the Americans" about his army. OK. |
| R5-2 | S01 whoosh tail on "On Christmas" | whooshAt 12.85 applied; listing equal to R5 within 2 dB. Accept as final. |
| R5-3 | S03 "Their" +1.4 dB | Unchanged, accepted. |
| R5 #7 | Dead cue S05 94.3 | Removed; picket t1 93.2. Sweep clean. |

## Flash sweep (render7, sounded cues only)
S05 99.45 / 100.9 / 103.5 / 103.55 / 103.6 / 107.65 / 107.75 / 108.2 / 116.35: first flash -0.27..0.00 s of the sound (all within the
ripple/lead tolerance of R5, several tighter than R5). S05 92.5: wide-frame sweep reads +0.53 (snow noise hides it), the picket crop shows
the muzzle flash at 92.50-92.60 and a second ripple 92.83-93.13 / 93.30-93.37 - matches the 6 shot times 92.50-93.27. S06 and S07 sweep
lines identical to R5 (pixel counts +-15). Unsounded cues S06 16.9/18.0/29.6/30.6/31.95 still in cues.json with no sound (no bang without a
cause; still worth dropping, R5 #7).

## NEW findings

| # | Scene | local t | film t | Problem | Exact fix | Sev |
|---|---|---|---|---|---|---|
| R6-1 | S03 -> S04 | S03 69.8 -> S04 35.0 | 187.33-305.71 | The "~118 s boarding stream" is a pairing bug, not a real stream: `troop_sfx.py` l.179 pairs S03 brooklyn unit 2 `bridge_stream_first_on_deck` (187.33) with the S04 **jersey** unit 2 `bridge_stream_last_off_deck` (305.71), because the search does not require the same scene/region. The new tiling (3f17a31) hid the crash that used to catch this. Result: plank footsteps under every S03 night shot after 69.8, across the scene cut and 35 s into S04. Level is sane: stem -57..-61 dB RMS (peak -35), x db(-12) in the mix = -70..-72 dB vs mix -25 dB, i.e. ~45 dB under the programme - inaudible in practice, so no audible regression. | In `vicksburg/tools/troop_sfx.py` l.179 add `and x.get("_scene", d["scene"]) == ...` i.e. only match an off-deck event from the SAME events file (scene + region), and cap `t1 = min(t1, e["tShare"] + 6)` like the march loop. Re-run `troop_stem.py` + `assemble.py --audio-only`. Optional for this upload; required before the next video. | 1 |
| R6-2 | S06 | 50.71-54.2 | 550.1-553.6 | Cornwallis banner arrives 3.5 s after his name. Allowed (on or after), slightly loose. | Accept. | 1 |

Masking: no new overlaps in the touched windows (S01 12.4-14.4, S03 118.8-120.4 re-listed; S05/S06/S07 picture-only changes, no cue moves near words).

## Top fixes
1. R6-1: fix the cross-scene stream pairing in `troop_sfx.py` (same events file only + 6 s cap); audio-only rebuild.
2. Keep all round-6 renders (S03, S05, S06, S07) - no re-render needed for sync.
3. Drop the unsounded fx cues S06 16.9 / 18.0 / 29.6 / 30.6 / 31.95 from cues.json (or mark silent) so the sweep reads clean.
4. Add the flash sweep + a "stream longer than 10 s" warning to `tools/render_qa.py` / `troop_stem.py`.
5. Final master: re-run `tools/check_sound_lock.py` and the LUFS check (now -14.0 LUFS, TP -1.1).
