# SFX Credits — Goose Green (Falklands 1982) sound-effects library

All files in this folder are **fully original, synthesized in-house** — no third-party
recordings, samples, or archives were used. This sidesteps all licensing/Content-ID risk
(in particular, nothing here comes from the BBC Sound Effects archive or any other
NC-licensed source).

**Method**: generated with Python (`numpy` + `scipy.signal`) — layered filtered white
noise (Butterworth low/band/high-pass) for rumble, crackle and body, plus sine-wave
sub-bass thumps with exponential decay envelopes for weight, combined per-file with
custom envelopes and, where useful, a light per-shot randomized noise seed so repeated
"variant" files (e.g. the three artillery hits) don't sound identical. Final space/tail
character (distant vs. near-field ambience) was added with `ffmpeg`'s `aecho` filter,
and all files were peak-normalized to approximately -3 dBFS with `ffmpeg`'s `volume`
filter. No external audio input of any kind was used at any stage.

All files: 48 kHz, 16-bit PCM WAV, mono, trimmed to have no leading silence.

| File | Description | Duration | Source |
|---|---|---|---|
| `artillery_far_1.wav` | Distant artillery/naval-gun impact (thump + rumble), variant 1 | 3.0 s | synthesized (numpy/scipy/ffmpeg), original work |
| `artillery_far_2.wav` | Distant artillery/naval-gun impact, variant 2 (slightly lower pitch, shorter) | 2.6 s | synthesized (numpy/scipy/ffmpeg), original work |
| `artillery_far_3.wav` | Distant artillery/naval-gun impact, variant 3 (slightly higher pitch, longer tail) | 3.3 s | synthesized (numpy/scipy/ffmpeg), original work |
| `explosion_near_1.wav` | Closer/heavier explosion (bomb / air-strike impact) | 3.3 s | synthesized (numpy/scipy/ffmpeg), original work |
| `explosion_near_2.wav` | Closer/heavier explosion, variant 2 | 3.7 s | synthesized (numpy/scipy/ffmpeg), original work |
| `gun_fire.wav` | Single artillery-gun firing (sharp crack + short tail) | 1.6 s | synthesized (numpy/scipy/ffmpeg), original work |
| `mortar_thump.wav` | Mortar firing, hollow "thoomp" | 0.79 s | synthesized (numpy/scipy/ffmpeg), original work |
| `missile_launch_hit.wav` | Wire-guided missile: launch whoosh into impact | 2.2 s | synthesized (numpy/scipy/ffmpeg), original work |
| `mg_burst.wav` | Distant machine-gun burst, muffled/background level | 1.5 s | synthesized (numpy/scipy/ffmpeg), original work |
| `whoosh.wav` | Soft cinematic whoosh for camera moves | 1.0 s | synthesized (numpy/scipy/ffmpeg), original work |
| `hit.wav` | Deep cinematic impact/"stamp" for on-screen text slams | 1.6 s | synthesized (numpy/scipy/ffmpeg), original work |
| `radio_static.wav` | Shortwave radio static/tuning bed, loopable | 6.0 s | synthesized (numpy/scipy/ffmpeg), original work |
| `counter_tick.wav` | Subtle tick for number counters | 0.06 s | synthesized (numpy/scipy/ffmpeg), original work |

## Attribution needed in video description

**None.** Every file here is an original synthesized work created for this project;
no attribution, credit line, or licence notice is legally required for any of them.
(If a future asset is later pulled in from Wikimedia Commons, Freesound CC0, or Kenney.nl,
add its specific credit line here and, for CC BY items, into the video description.)
