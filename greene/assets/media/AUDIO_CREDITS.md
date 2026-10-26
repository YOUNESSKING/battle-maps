# Audio Credits — Nathanael Greene / American Revolution video

All music beds below were downloaded directly from **incompetech.com**, Kevin
MacLeod's own site — the canonical source for his CC BY 4.0 licence (many
third-party mirrors carry ambiguous or CC-BY-ND copies, which this project
avoids). Kevin MacLeod requires attribution; the exact line to paste into the
YouTube description is given under each track. The fife & drum track is a US
Army recording, CC0/public domain, no attribution legally required (credited
anyway as good practice). SFX are original synthesized creations (numpy/scipy)
and carry no third-party licence restriction.

All files normalized to 48 kHz stereo. Music beds normalized to ~-18 LUFS
integrated with `ffmpeg loudnorm`; SFX peak-normalized to -3 dBFS. `.wav` is
git-ignored; an `.mp3` (192 kbps) copy of every file is committed instead.

## Music beds

### music_bed_1.wav — "Crusade" (3:18, trimmed source; used ~2-3 min under narration)
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Crusade.mp3 (via https://incompetech.com/music/royalty-free/music.html)
- **Mood**: ominous-building — dark, dramatic orchestral swell. Use for the hook and the "disaster, then the hero" opening.
- **Attribution line (paste in description)**: `"Crusade" by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/`

### music_bed_2.wav — "Five Armies" (2:36)
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: CC BY 4.0
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Five%20Armies.mp3
- **Mood**: tense-battle — driving low strings and drums, epic-battle feel. Use under combat/execution beats of each of the 3 tactical moves.
- **Attribution line**: `"Five Armies" by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/`

### music_bed_3.wav — "Heroic Age" (1:37)
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: CC BY 4.0
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heroic%20Age.mp3
- **Mood**: reflective-triumphant — swelling, uplifting orchestral. Use for the ending / legacy section. Short (1:37): loop or crossfade if the ending runs longer.
- **Attribution line**: `"Heroic Age" by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/`

### music_bed_4.wav — "Darkest Child" (3:59)
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: CC BY 4.0
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3
- **Mood**: ominous/tense alternate — dark eerie strings, good for a second "what the enemy believed" or retreat beat, or as an alternate to music_bed_1 for variety across the video's 17 min.
- **Attribution line**: `"Darkest Child" by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/`

### music_bed_5.wav — "Dark Walk" (1:26)
- **Author**: Kevin MacLeod (incompetech.com)
- **Licence**: CC BY 4.0
- **Source**: https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dark%20Walk.mp3
- **Mood**: tense ambient — low suspenseful walking bass, minimal, sits well under narration for slower "situation with numbers" sections. Short (1:26): loop as needed.
- **Attribution line**: `"Dark Walk" by Kevin MacLeod (incompetech.com) — Licensed under Creative Commons: By Attribution 4.0 License — http://creativecommons.org/licenses/by/4.0/`

## Period flavour sting

### fife_drum.wav — "Boys of Bluehill" (50 s, used in full)
- **Title**: "Boys of Bluehill" (fife & drum performance)
- **Author/Performer**: Old Guard Fife and Drum Corps (U.S. Army, Continental-Army-era repertoire)
- **Licence**: Public domain — the item's own rights statement: "All information on this site (The United States Army Old Guard Fife and Drum Corps) is considered public information (PUBLIC DOMAIN)... works created by U.S. Government employees are not eligible for copyright protection." The underlying 18th-century composition (pre-1820) is separately public domain by age.
- **Source**: https://archive.org/details/BluehillFifeAndDrum (audio file `fife_and_drum_64kb.mp3`; licenceurl on the item: http://creativecommons.org/licenses/publicdomain/)
- **Notes**: A companion Wikimedia Commons recording by the same corps, "Brandywine Quickstep" (CC0, https://commons.wikimedia.org/wiki/File:The_United_States_Army_Old_Guard_Fife_and_Drum_Corps_-_10_-_Brandywine_Quickstep_from_the_Minstrel_Boy_Show.ogg, ~112 s), is period- and battle-appropriate (Brandywine, 1777) and can be swapped in as an alternate/second sting — Wikimedia's upload servers were rate-limiting downloads (HTTP 429) repeatedly during this session even after long backoff, so it was not pulled down; the archive.org "Boys of Bluehill" recording by the same fife-and-drum corps was used instead, no attribution legally required either way (credited here anyway).

## SFX (synthesized — no licence restriction)

All six SFX below (`sfx_musket_volley.wav`, `sfx_cannon.wav`, `sfx_drums_march.wav`,
`sfx_river.wav`, `sfx_whoosh.wav`, `sfx_thud.wav`) were **synthesized locally with
NumPy/SciPy**, per the task's fallback allowance (a targeted search of Wikimedia
Commons audio and freesound.org did not turn up clean CC0/PD items downloadable
without a login in the time available). Because they are original synthesized
creations they carry no third-party licence restriction and are safe for a
monetized upload.
- `sfx_musket_volley.wav` (2.6 s): 8-9 overlapping bandpassed-noise "cracks" with a low-frequency body and a soft low-pass tail, approximating a ragged musket volley.
- `sfx_cannon.wav` (2.6 s): a broadband noise crack, a pitch-dropping sub-bass sine, and a low-passed rumbling tail for a single cannon shot.
- `sfx_drums_march.wav` (16 s loop-able): a 100 BPM snare pattern (strong beat + subdivision taps + periodic roll flourish) approximating a military fife-and-drum march feel, suitable for looping under a marching/approach sequence.
- `sfx_river.wav` (18 s loop-able): filtered/modulated broadband noise shaped into a continuous flowing-water/rain ambience bed.
- `sfx_whoosh.wav` (1.0 s): a swept bandpass noise transition with a sine amplitude envelope and slight stereo widening, for scene transitions.
- `sfx_thud.wav` (0.5 s): a low resonant "body" thump plus a short bandpassed "knock" transient, approximating a stake striking the ground.
