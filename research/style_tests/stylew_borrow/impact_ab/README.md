# Impact A/B: the Fort Motte roof strike (share 35.13 s)

Each variant is a full mix of the Fort Motte window with the extra impact inside the pre-limited cannon stem (as the final would sound), cut to share 34.4-37.4 s (the 3D gun at 34.63, the strike at 35.13) and loudness-matched to -16 LUFS so only the timbre differs. `impact_ab.mp4` plays a, b, c, d in turn with the video (letter bottom-left).

- **a** `impact_a.wav`: 3D boom only (goosegreen/assets/media/sfx/candidates/cand2_hit.wav, Kostrava, CC0 1.0), no extra impact
- **b** `impact_b.wav`: boom + USC Cinema blast (grant/assets/media/sfx/candidates/bombs/bomb6_blastsshortdecayusccinema.mp3, the blast at 25.1 s, highpass 250 Hz; craigsmith / USC Cinema, CC0 1.0), level-matched to the boom -3 dB
- **c** `impact_c.wav`: boom + low thud (belisarius/assets/audio/sfx_thud.wav, our own synthesized sound, see belisarius/assets/audio/CREDITS.md), level-matched to the boom -3 dB
- **d** `impact_d.wav`: boom + second 3D-film hit (goosegreen/assets/media/sfx/candidates/cand4_hit.wav, lowpass 1.2 kHz; Kostrava, CC0 1.0), level-matched to the boom -3 dB

Rebuild the final with the pick (`tools/make_test_audio.py`, env `IMPACT`):
- b: `grant/assets/media/sfx/candidates/bombs/bomb6_blastsshortdecayusccinema.mp3|atrim=25.1:26.4,asetpts=PTS-STARTPTS,highpass=f=250,afade=t=out:st=0.7:d=0.6|13.4`
- c: `belisarius/assets/audio/sfx_thud.wav||5.6`
- d: `goosegreen/assets/media/sfx/candidates/cand4_hit.wav|atrim=0:1.0,lowpass=f=1200,afade=t=out:st=0.6:d=0.4|-1.2`
- a: no `IMPACT`.
