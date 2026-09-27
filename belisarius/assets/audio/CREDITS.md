# Audio Credits — Belisarius Documentary

## Music

### music1.mp3 — "Crusade" (198.8s / ~3:19)
- Author: Kevin MacLeod (incompetech.com)
- License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
- Source: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crusade.mp3
- Required attribution: "Crusade" by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
- Mood/use: Slow, march-like epic theme with restrained brass/percussion swell — good as the main title / overarching theme, or under big-picture strategic narration (rise of Belisarius, opening of the video).

### music2.mp3 — "Killing Time" (204.1s / ~3:24)
- Author: Kevin MacLeod (incompetech.com)
- License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
- Source: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Killing%20Time.mp3
- Required attribution: "Killing Time" by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
- Mood/use: Dark, tense, low-key drone-and-pulse track with no melody to compete with narration — best under build-up-to-battle or political-intrigue segments (e.g. Belisarius's recall, court suspicion, sieges).

### music3.mp3 — "The Pyre" (233.4s / ~3:53)
- Author: Kevin MacLeod (incompetech.com)
- License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
- Source: https://incompetech.com/music/royalty-free/mp3-royaltyfree/The%20Pyre.mp3
- Required attribution: "The Pyre" by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License http://creativecommons.org/licenses/by/4.0/
- Mood/use: Solemn, mournful, ancient/ritual-sounding cue — well suited to reflective or tragic beats (aftermath of battle, Belisarius's fall from grace, closing/legacy segment).

All three tracks were converted to 48 kHz (from the original 44.1 kHz, 320 kbps MP3s) with ffmpeg; no other processing applied. None contain vocals or a busy lead melody, so all sit comfortably under narration.

## Sound Effects

All SFX below were **synthesized locally with numpy/soundfile** (procedural noise + bandpass filtering + envelope shaping), not sourced from a third party. This was a deliberate choice after Wikimedia Commons' search API returned persistent "too many requests" rate-limit errors from this environment's shared network egress across repeated attempts (with pauses and a descriptive User-Agent as required), and no other checked-and-confirmed CC0/CC BY sources turned up suitable short battle SFX in the time available. Because these are original, wholly synthesized files, they carry no license restriction (equivalent to CC0 / public domain) and require no attribution.

- `sfx_whoosh.wav` — 1.2s, mono, 48 kHz. Filtered-noise sweep (bell-shaped frequency rise/fall ~300 Hz→3.8 kHz→back) for a transition swoosh. Peak: -3.0 dBFS.
- `sfx_drum.wav` — 1.3s, mono, 48 kHz. Single deep 70 Hz fundamental + octave overtone with fast exponential decay and a short transient click, for a war-drum boom. Peak: -3.0 dBFS.
- `sfx_horses.wav` — 4.5s, mono, 48 kHz. Layered irregular 4-beat hoofbeat pattern (bandpassed noise thumps, 60–400 Hz) approximating a cavalry gallop. Peak: -3.0 dBFS.
- `sfx_swords.wav` — 4.0s, mono, 48 kHz. Seven randomly-timed metallic clashes (bandpassed noise 2.5–9 kHz plus a short resonant sine "ring") for sword-on-sword battle melee. Peak: -3.0 dBFS.
- `sfx_arrows.wav` — 2.5s, mono, 48 kHz. Five overlapping descending-pitch whistles (~5 kHz → ~1.5 kHz swept bandpass noise) for an arrow volley. Peak: -3.0 dBFS.
- `sfx_thud.wav` — 0.6s, mono, 48 kHz. Low 55 Hz thump with fast decay and a small transient click, for a low impact (e.g. a stamp/plaque hit). Peak: -3.0 dBFS.

All SFX are 16-bit PCM WAV, mono, 48 kHz, peak-normalized to approximately -3 dBFS, with short fade-in/out applied.

## Notes

- If cleaner, professionally-recorded CC0/CC BY battle SFX are found later (e.g. via Freesound with an account/API key, or a future Wikimedia Commons pass once rate limits clear), they can replace these synthesized placeholders — just keep the same filenames and update this CREDITS.md accordingly.
- Music files are NOT committed to git per instructions for this task; they exist only in the working tree at `belisarius/assets/audio/`.
