# Audio Credits — Daniel Morgan video

All music tracks below are by Kevin MacLeod (incompetech.com), downloaded
directly from incompetech.com's own MP3 download links (not a third-party
mirror), and are licensed under Creative Commons Attribution. All SFX are
original synthesized audio (NumPy/SciPy, 48 kHz stereo WAV) created for this
project and carry no third-party license restriction.

## Music

### music_01_heavy_heart.mp3
- **Title**: "Heavy Heart"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 3.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heavy%20Heart.mp3 (track page: https://incompetech.com/wordpress/2016/01/heavy-heart/)
- **Duration**: 296.7 s (4:57)
- **YouTube description attribution line**:
  `Music: "Heavy Heart" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 3.0 License, http://creativecommons.org/licenses/by/3.0/`

### music_02_clash_defiant.mp3
- **Title**: "Clash Defiant"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 3.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Clash%20Defiant.mp3
- **Duration**: 375.59 s (6:16)
- **YouTube description attribution line**:
  `Music: "Clash Defiant" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 3.0 License, http://creativecommons.org/licenses/by/3.0/`

### music_03_ready_aim_fire.mp3
- **Title**: "Ready Aim Fire"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 4.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ready%20Aim%20Fire.mp3 (track page: https://incompetech.com/wordpress/2015/01/ready-aim-fire/)
- **Duration**: 216.95 s (3:37)
- **YouTube description attribution line**:
  `Music: "Ready Aim Fire" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/`

### music_04_fife_and_drum.mp3
- **Title**: "Fife and Drum"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 4.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fife%20and%20Drum.mp3 (track page: https://incompetech.com/wordpress/2016/05/fife-and-drum/)
- **Duration**: 58.93 s
- **YouTube description attribution line**:
  `Music: "Fife and Drum" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/`

### music_05_crusade.mp3
- **Title**: "Crusade"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 3.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crusade.mp3
- **Duration**: 198.74 s (3:19)
- **Notes**: Distinct from the reworked "Crusade - Heavy Industry" edit; this is the original "Crusade" track, direct-downloaded from incompetech's own MP3 link.
- **YouTube description attribution line**:
  `Music: "Crusade" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 3.0 License, http://creativecommons.org/licenses/by/3.0/`

### music_06_undaunted.mp3
- **Title**: "Undaunted"
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 3.0 License
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Undaunted.mp3 (track page: https://incompetech.com/wordpress/2014/06/undaunted/)
- **Duration**: 212.53 s (3:33)
- **YouTube description attribution line**:
  `Music: "Undaunted" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 3.0 License, http://creativecommons.org/licenses/by/3.0/`

**Total music runtime: 1359.4 s ≈ 22 min 39 s** (≥ 20 min requirement met).

All six tracks were verified after download with `ffprobe` (duration) and
`ffmpeg -af volumedetect` (mean/max volume) — none are silent and none clip
(max levels sit between -3.0 dB and 0.0 dB, mean levels between -12 dB and
-22 dB), consistent with normally mastered library music.

## Combined attribution block (paste into video description)

```
Music by Kevin MacLeod (incompetech.com)
"Heavy Heart" — Licensed under Creative Commons: By Attribution 3.0 License — http://creativecommons.org/licenses/by/3.0/
"Clash Defiant" — Licensed under Creative Commons: By Attribution 3.0 License — http://creativecommons.org/licenses/by/3.0/
"Ready Aim Fire" — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/
"Fife and Drum" — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/
"Crusade" — Licensed under Creative Commons: By Attribution 3.0 License — http://creativecommons.org/licenses/by/3.0/
"Undaunted" — Licensed under Creative Commons: By Attribution 3.0 License — http://creativecommons.org/licenses/by/3.0/
```

## SFX (all synthesized, original works — no attribution required)

A clean, unambiguously-licensed CC0/PD musket/cannon/cavalry recording was
not confidently located within this session's time budget (Wikimedia
Commons' relevant categories mostly hold unrelated drum-technique or
ambience clips, and Freesound requires a login to download), so per the
task's fallback allowance, all SFX were synthesized locally with
NumPy/SciPy — noise-shaped transients, resonant low-frequency bodies and
bandpass sweeps built to match each cue's real-world sonic signature. Each
file is 48 kHz stereo 16-bit PCM WAV, trimmed to its effect with no
leading/trailing silence, and peak-normalized to -3.0 dBFS (confirmed with
`ffmpeg -af volumedetect`: all files show `max_volume: -3.0 dB`, none show a
silent/near-zero mean).

- **sfx_musket_volley.wav** (2.6 s) — 26 staggered bandpassed-noise "crack"
  transients (ragged firing-line volley) over a short low-frequency rumble
  bed.
- **sfx_musket_single.wav** (1.2 s) — single bandpassed crack transient with
  a sub-bass thump and a faint decaying echo tail.
- **sfx_cannon.wav** (3.5 s) — falling-pitch sub-bass sine boom + fast noise
  crack + a longer lowpassed rumble tail.
- **sfx_drum_roll.wav** (3.2 s) — an accelerating sequence of snare-like
  bandpassed-noise hits (buzz-roll approximation) ending in a single accent
  hit; 3.2 s, within the requested 2-4 s range.
- **sfx_whoosh.wav** (1.1 s) — a bandpass filter sweeping center frequency
  up then down over white noise, shaped by a sine amplitude envelope.
- **sfx_thud.wav** (0.6 s) — two low decaying sine partials (90/140 Hz) plus
  a short bandpassed-noise knock transient, approximating a wooden stake
  striking the ground.
- **sfx_cavalry.wav** (4.5 s) — a four-beat accelerating hoofbeat pattern
  (low sine "impact" + bandpassed "click" per hoof) over a very low ambient
  bed; 4.5 s, within the requested 3-6 s range.
- **sfx_cheer.wav** (2.8 s, optional) — 18 layered bandpassed-noise "voice"
  bursts with per-voice vibrato and staggered onsets, swelling in and
  fading out (massed soldiers' cheer).

## Rejected / avoided sources

- Kevin MacLeod tracks mirrored on archive.org and some YouTube re-uploads
  were avoided; all six tracks here were pulled directly from
  incompetech.com's own `mp3-royaltyfree` download path to guarantee the
  correct, current CC BY licence terms (per the project brief's own
  guidance in `HANDOVER.md` §3 item 5 and the prior `ridgway` project's
  notes about ND-licensed archive.org mirrors).
- No NC or ND licensed material was used anywhere in this deliverable.
