# Media Credits — Ridgway / Korean War video

All images below are U.S. Army / U.S. government works and are in the
public domain (works of the U.S. federal government are not subject to
copyright; Wikimedia Commons lists them as "Public domain"). The flag SVG
is Wikimedia Commons original work released Public Domain.

## Images

### ridgway_full.png
- **Title**: "US Army General Matthew Ridgway, Ribera, Sicily, 25 July 1943" (cropped to isolate Gen. Ridgway; background removed with rembg)
- **Author**: U.S. Army Signal Corps (unattributed staff photographer)
- **Licence**: Public domain (U.S. government work)
- **Source**: https://commons.wikimedia.org/wiki/File:US_Army_General_Matthew_Ridgway,_Ribera,_Sicily,_25_July_1943.jpg
- **Notes**: Downloaded at the 1920px-wide standard Wikimedia thumbnail, cropped to isolate Ridgway from the group photo, background removed with `rembg` (isnet/bria model), edges cleaned with a slight alpha erosion + Gaussian feather, then upscaled slightly (Lanczos) to ~1250px tall. Original is black-and-white; colors were left unaltered (grayscale preserved). Photo dates to WWII (Sicily 1943) rather than Korea — no equally clean, high-resolution full-length Korea-era photo of Ridgway with unobstructed background was found on Commons; this is the same "grenade/gear-strapped, hands-on-hips" iconic Ridgway look used in Tactical-Genius-style videos.

### ridgway_head.png
- **Title**: "Lt. Gen. Matthew Ridgway" (official portrait; background removed)
- **Author**: U.S. Army (unattributed staff photographer)
- **Licence**: Public domain (U.S. government work)
- **Source**: https://commons.wikimedia.org/wiki/File:Lt._Gen._Matthew_Ridgway.jpg
- **Notes**: Head-and-shoulders official dress-uniform portrait, background removed with `rembg`, cropped tightly and resized to 700px tall, edges cleaned with slight alpha erosion + Gaussian feather. Black-and-white original preserved as-is.

### us_flag_48star.png
- **Title**: "Flag of the United States (1912-1959)" (48-star flag, in use 1950-51 during the Korean War)
- **Author**: Wikimedia Commons contributors (original SVG artwork)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1912-1959).svg
- **Notes**: Rendered from the Commons SVG at the standard 960px-wide thumbnail, then resized locally to 600px wide PNG.

## Audio

### music.wav (75 s, 48 kHz stereo)
- **Synthesized, not sourced.** A search of Wikimedia Commons audio files and archive.org (including the Kevin MacLeod / incompetech mirrors) did not turn up a clean CC0/CC-BY/CC-BY-SA track that matched the requested structure (solemn dark orchestral 0-35s, dramatic swell ~35s, building low war drums 50-70s) without licensing ambiguity (many Kevin MacLeod tracks on archive.org are CC-BY-ND, which forbids the derivative use/combination this project needs, or have no clear license field at all).
- Instead, the track was **synthesized locally with NumPy/SciPy**: a low sine-based drone (55/82/110 Hz), a lowpassed sawtooth string-like pad (A minor triad-ish voicing) with a scripted crescendo around 30-40s (rising bandpassed noise + rising sine "brass" layer), soft low-tom percussion under the first 50s, and a tempo-accelerating layered low drum pattern from 50-71s that increases in amplitude and pitch drop, with a final fade-out tail to 75s.
- Normalized with `ffmpeg loudnorm` to approximately **-18 LUFS** integrated (measured -17.6 LUFS), 48 kHz stereo, 16-bit PCM WAV.
- Because it is an original synthesized creation, it carries no third-party license restriction and is safe for a monetized upload.

### sfx_whoosh.wav (0.8 s), sfx_thud.wav (0.5 s), sfx_boom.wav (2.0 s)
- **Synthesized, not sourced**, per the task's fallback allowance for SFX.
- `sfx_whoosh.wav`: filtered noise with a time-varying bandpass sweep (rises then falls in center frequency) shaped by a sine amplitude envelope, slight stereo widening via a short delay on the right channel.
- `sfx_thud.wav`: a low-frequency resonant "body" (90/140 Hz decaying sines) layered with a short bandpassed noise "knock" transient (800-4000 Hz) and a lowpassed noise thump, approximating a wooden stake striking the ground.
- `sfx_boom.wav`: a short lowpassed noise crack, a deep pitch-dropping sub-bass sine sweep (90 Hz → 35 Hz) with exponential decay, and a lowpassed rumbling noise tail for a distant-explosion feel; slight stereo widening.
- All three are 48 kHz stereo 16-bit PCM WAV, each near its target duration.
