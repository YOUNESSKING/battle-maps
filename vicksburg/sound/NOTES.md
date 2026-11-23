# Troop sound test (Vicksburg S09 55-110 s + S10 20-35 s) -- 2026-11-19

Output: `vicksburg/troops_test_sound_share.mp4` (video of `troops_test_v14_share.mp4`, new audio). A TEST: the locked kit is untouched.

## What is in the stem (`tools/troop_sfx.py`, seeded, repeatable)
* **musket_volley** (12 events): K = men/9 (3-16) real Enfield shots, one flank fires first (first shot = the event time exactly), the rest
  ripple over 0.6-1.1 s with ragged gaps; pan sweeps from the line's `from` to `to` end; recording distance class (5/10/20/30/60 m), low-pass
  (11 kHz close -> 2.7 kHz far), level (-9 dBFS peak close -> -15 far) and reverb tail (0.5/0.9/1.5 s, wet 5-21 %) follow camera distance;
  per-shot jitter: pitch +-4.5 %, gain -3.5..+1.5 dB, pan +-0.04, random recording.
* **independent_fire** (S10 skirmishers, only when on screen): sparse single shots, quieter, own random recordings.
* **march_start** (on-screen columns): `march_loop`, low-passed, -34..-43 dB, gated to the march, panned to the unit; **bridge stream**:
  planks/steps (high-passed footsteps) from first-on-deck to last-off-deck; **capture / retaken**: 2.6 s distant cheer, -31..-36 dB.
* **cannon** (`stem --kit`): the LOCKED kit exactly as `assemble.py` (cand1_hit -15 dB at the shot, cand2_hit -19 dB at the impact). The test
  mix keeps the film's own cannon/fire/ambience/music and ADDS only the troop stem, so the locked sounds are not doubled.
* Not added on purpose: a generic battle-noise bed or any sound without a visible cause.

## Mix (`troop_sfx.py mix`)
Film audio of the windows (Gofile preview, lag 0 to v13/v14 audio) minus the old single volley (19 cues from `scenes/S09_gm/cues.json`,
gain fitted by least squares = 0.15, stable 0.12-0.19) + troop stem ducked -6 dB while a word is spoken (word times from `voice_words.json`),
then loudnorm -14 LUFS / TP -1.5 (same chain as `assemble.py`).
Note: the old cue list had 19 volleys in these windows, the visible event list only 12; the 7 old ones had no matching event and are gone.

## Measured (`tools/troop_sfx_verify.py`, `verify.json`)
* **Time base (A):** cannon muzzle flashes (orange sprites, clearly visible) vs the event list: 10 of 11 detected flashes within +-1 frame
  (offsets 0/+1 frame; one -3 is a mis-detection next to another flash; 3 flashes too small to detect). So `tShare` = video frame time.
* **Onset (B):** placement is sample-accurate (57 test shots into silence: max error 1.3 ms); the first shot of all 12 volleys sits on the event
  time (0.0 ms), all other shots lie inside the ripple window [t, t+R]. In-situ per-shot onsets inside a ripple cannot be read from the audio.
* **Musket flashes are NOT individually visible in the render** (0.07 s sprites, moving camera: no brightness/orange transient found), and the
  musket smoke wisp becomes detectable ~0.4-0.5 s after the event time (alpha 0.09, 0.25 s fade-in). The engine emits puffs/flashes at
  t0 + roll + 0-0.25 s, the same window the ripple uses, but a viewer sees the smoke late. If it feels early, add 0.15-0.25 s to
  musket events (`render_volley`) or make the flashes visible; this is an owner/eyes call.
* **Levels (C):** voice RMS in word regions -15.8 dBFS; musket volley peaks in the ducked mix -17.6 dBFS on average (-20.7..-12.0), skirmish
  shots about -19 dBFS, cannons -2..-8 dBFS (locked); no clipped sample; integrated -14.0 LUFS, sample/true peak -1.5 dBFS.
* **Repetition (D):** 185 placed shots from 35 recordings; 0 identical samples within 2 s (a recording heard again within 2 s differs in pitch
  by >= 3.5 %); 14 same-recording pairs within 2 s, all pitch-shifted (two volleys 0.8 s apart need more shots than the 35 recorded).
* I could not listen: judge the ripple density and the cheer level by ear.

## Rebuild
`python3 vicksburg/tools/troop_sfx_lib.py RAW_DIR` (once, needs the Epidemic WAVs), then `troop_sfx.py stem|mix|mux`, then `troop_sfx_verify.py`.
For the full film: export events for every battle scene, run the stem per scene window, replace the `volley` entry of `assemble.py`.
