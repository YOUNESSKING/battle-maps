# Zoom / dive transition candidates, round 3 ("more like #5", Mixkit "Cinematic tunnel reverb woosh")

Listening + viewing file: `smith/build/zoom_test3.mp4` (960x540, git-ignored). Same recipe as round 2: 14 s opening excerpt (voice + music 0.08 ducked + SFX track, old whoosh muted 8.6-10.6 s), candidate at 8.9 s (dive onto Chosin) at -12 dB from its -3 dBFS peak, loudnorm -14 LUFS, caption top-left, 1.6 s black gap between clips.

## Cue list (mm:ss -> label; the candidate plays 8.9 s into each excerpt)

| Excerpt starts | Candidate plays | Label |
|---|---|---|
| 00:00.0 | 00:08.9 | SOUND 5 (zoom2_5.wav, same level as round 2) |
| 00:15.6 | 00:24.5 | SOUND 5 (-4 dB) (zoom2_5.wav, 4 dB quieter) |
| 00:31.2 | 00:40.1 | NEW 1 |
| 00:46.8 | 00:55.7 | NEW 2 |
| 01:02.4 | 01:11.3 | NEW 3 |
| 01:18.0 | 01:26.9 | NEW 4 |
| 01:33.6 | 01:42.5 | NEW 5 |

Files: `zoom3_<n>.wav` (mono 48 kHz, 20 ms fade in / 40 ms fade out, -3 dBFS peak; WAV is git-ignored, `zoom3_<n>.flac` committed).

## What "like #5" means (measured on zoom2_5.wav)
2.4 s; almost all energy below 250 Hz (99 %), spectral centroid ~380 Hz (very dark, not hissy); envelope: 0.3 s swell, ~1 s plateau at the peak, then a slow reverb/tunnel decay (about -10 dB over the last 1.2 s, cut off at 2.4 s). The similarity column compares centroid, share of energy below 250 Hz and mean envelope difference (dB) to that.

## Sounds

| n | How it sounds | Similarity to #5 | Title | Author | URL | Popularity | Licence | Credit line |
|---|---|---|---|---|---|---|---|---|
| 0 | Full-quality original of #5 (same 0.1 s offset/trim as zoom2_5) | identical (env diff 1.2 dB) | Cinematic tunnel reverb woosh | Mixkit | https://mixkit.co/free-sound-effects/whoosh/ (id 1486, full WAV https://assets.mixkit.co/active_storage/sfx/1486/1486.wav, 44.1 kHz 24-bit stereo, 6.7 s) | #6 on Mixkit "whoosh" | Mixkit Sound Effects Free License | none required |
| 1 | Deep swell, soft plateau, long dark reverb tail; closest match | very high: centroid 484 Hz, 95 % < 250 Hz, env diff 2.8 dB | Sound Design Elements Whoosh SFX 037 | AudioPapkin | https://freesound.org/people/AudioPapkin/sounds/812672/ | 111 downloads (newer pack) | CC0 1.0 | none required |
| 2 | Same family, slightly brighter, a little more body in the plateau | high: centroid 614 Hz, 95 % < 250 Hz, env diff 3.1 dB | Sound Design Elements Whoosh SFX 002 | AudioPapkin | https://freesound.org/people/AudioPapkin/sounds/812637/ | 100 downloads | CC0 1.0 | none required |
| 3 | Sub-heavy "deep whoosh", boomy, shorter (2.2 s), decays faster, no plateau | medium: even darker (168 Hz, 100 % < 250 Hz), weight matches, envelope shorter | Deep whosh - Short | Khrinx | https://freesound.org/people/Khrinx/sounds/523978/ | 2,696 downloads (most popular of the set) | CC0 1.0 | none required |
| 4 | Cinematic whoosh into an echo tail, slower 0.6 s build, more air | medium: centroid 843 Hz, 64 % < 250 Hz, env diff 5.3 dB (airier than #5) | Whoosh transition explosion echo | Mixkit | https://mixkit.co/free-sound-effects/transition/ (id 1695, full WAV https://assets.mixkit.co/active_storage/sfx/1695/1695.wav) | #28 on Mixkit "transition" listing | Mixkit Sound Effects Free License | none required |
| 5 | Darker sustained whoosh, longer plateau, gentle tail | medium-high: centroid 630 Hz, 91 % < 250 Hz, env diff 4.0 dB (plateau longer than #5) | Sound Design Elements Whoosh SFX 030 | AudioPapkin | https://freesound.org/people/AudioPapkin/sounds/812665/ | 93 downloads | CC0 1.0 | none required |

Sources: Freesound HQ preview mp3s (originals need login; if one is chosen, download the original WAV from its page), Mixkit full WAVs for 0 and 4. Onsets trimmed automatically, 2.4 s window (#3 is 2.2 s, all it has).
Searched: Mixkit whoosh + transition lists (56 sounds measured), Freesound "cinematic whoosh reverb / deep whoosh / trailer whoosh / boom whoosh / cinematic whoosh" (CC0 + CC BY, sorted by downloads, 54 measured). Pixabay not tried (403 in round 2). Runners-up: Freesound 812641 (SFX 006), 812680 (SFX 043) too short (silent after ~1.2 s); Mixkit 2623 "Ghostly whoosh passing" (dark, slow rise), 2295 "Pulsating bass transition" (dark but pulsing).
