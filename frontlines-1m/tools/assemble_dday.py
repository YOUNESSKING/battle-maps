"""Assemble the Frontlines 1-min test: scenes + archive film -> build/frontlines-1m-test.mp4 (1080p, ~-14 LUFS).
Music: Kevin MacLeod "Five Armies" (incompetech, CC BY 4.0) from 1:00, ducked under the voice (Frontlines-style: prominent score)."""
import json, subprocess
T = json.load(open("audio/timing.json")); P = T["paragraphs"]; END = P[-1]["end"] + 2.4
st = {p["tag"].split("|")[0].split(":")[1].strip(): p["start"] for p in P}
run = lambda a: subprocess.run(a, check=True)
# 1. picture: globe (padded to start at 0), terrain, film f-1, f-2, river
segs = ["scenes/europe2/renders/europe2.mp4", "scenes/plan/renders/plan.mp4", "scenes/night/renders/night.mp4", "build/a-1.mp4", "build/a-2.mp4", "scenes/town/renders/town.mp4", "scenes/utah/renders/utah.mp4"]
inp = sum([["-i", s] for s in segs], [])
fc = f"[0:v]fps=30,format=yuv420p,tpad=start_duration={st['e-1']}:start_mode=clone[v0];" + "".join(f"[{i}:v]fps=30,format=yuv420p,setsar=1[v{i}];" for i in range(1, 7)) + "[v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0[v]"
run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", fc, "-map", "[v]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "build/video.mp4"])
# 2. sound effects: locked cues from the scenes (sfx_mix, locked levels) + the reference-style sound design on its own (kinds "ref:*",
#    Mixkit free licence / Public Domain, assets/media/sfx_ref/CREDITS.md) added into the same SFX track so it ducks under the voice too
run(["python3", "tools/sfx_cues.py"])
cues = json.load(open("build/sfx_cues.json"))
ref = [c for c in cues if c[1].startswith("ref:")]; json.dump([c for c in cues if not c[1].startswith("ref:")], open("build/sfx_cues.json", "w"))
run(["python3", "tools/sfx_mix.py"])
import numpy as np, soundfile as sf
fx, sr = sf.read("build/sfx.wav", always_2d=True)
def place(name, t, db, dur=None, fade=0.4):
    a, r = sf.read("assets/media/sfx_ref/" + name, always_2d=True)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if r != sr:
        idx = np.arange(0, len(a), r / sr); a = a[idx.astype(int).clip(0, len(a) - 1)]
    if dur: a = np.tile(a, (int(dur * sr / len(a)) + 1, 1))[:int(dur * sr)]
    n = min(int(fade * sr), len(a) // 2); a = a.copy(); a[-n:] *= np.linspace(1, 0, n)[:, None]
    s0 = int(t * sr); e = min(len(fx), s0 + len(a)); fx[s0:e] += a[:e - s0] * 10 ** (db / 20)
LV = {"ref:whoosh": ("whoosh_cinematic_tunnel.wav", -14), "ref:pop": ("label_pop_dry.wav", -20), "ref:boom": ("boom_big_cinematic_impact.wav", -11), "ref:riser": ("riser_reverse_swell.wav", -17)}
for t, k, _ in ref: place(LV[k][0], t, LV[k][1])
a1, a2, n1 = st["a-1"], st["a-2"], st["n-1"]; p1, e3 = st["p-1"], st["e-3"]
place("paper_newspaper_big_page.wav", a1 - 0.1, -12)
place("projector_loop.wav", a1 + 5.5, -27, dur=a2 - a1 - 5.5)
place("projector_loop.wav", a2 + 4.4, -27, dur=n1 - a2 - 4.4)
place("drone_tactical_ambience.wav", 0.0, -30, dur=e3, fade=1.5); place("drone_terror_ambience.wav", e3, -30, dur=a1 - e3, fade=1.5); place("drone_tactical_ambience.wav", n1, -30, dur=END - n1, fade=2.0)
sf.write("build/sfx.wav", fx, sr)
print("reference sound design:", len(ref), "map cues + paper, projector, drones")
# 3. mix: EXACTLY the channel's locked chain (gavin/tools/assemble_full.py + finalize.sh): raw voice, SFX at the locked levels ducked
#    under the voice, music at MUSIC_VOL 0.08 ducked, limiter 0.5; then the gain + limiter pass to ~-14 LUFS (gain measured, as in finalize)
MUSIC_VOL = 0.08
MATCH = 10 ** ((-19.7 - -11.8) / 20)  # bring Five Armies (-11.8 LUFS from 1:00) to the channel bed's loudness (gavin music.wav, -19.7 LUFS) first
f = ["[0:a]aresample=48000,asplit=3[vo][key][key2]", "[1:a]aresample=48000[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[2:a]aresample=48000,atrim=start=60,asetpts=PTS-STARTPTS,atrim=0:{END},volume={MUSIC_VOL * MATCH:.4f},afade=t=in:d=2,afade=t=out:st={END - 3}:d=3[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
run(["ffmpeg", "-v", "error", "-y", "-i", "audio/voice.wav", "-i", "build/sfx.wav", "-i", "assets/media/music_five_armies.mp3", "-filter_complex", ";".join(f),
     "-map", "[aout]", "-t", f"{END:.2f}", "-c:a", "pcm_s16le", "build/mix_raw.wav"])
r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix_raw.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(r[r.rindex("I:"):].split()[1]); gain = round(-14.4 - I + 0.6, 1)  # +0.6: the limiter takes back ~0.6 dB
for _ in range(3):  # the limiter eats a variable amount: measure the result and correct the gain until ~-14.3 LUFS
    run(["ffmpeg", "-v", "error", "-y", "-i", "build/mix_raw.wav", "-af", f"volume={gain}dB,alimiter=limit=0.8:attack=2:release=80:level=false,aresample=48000", "-c:a", "pcm_s16le", "build/mix.wav"])
    r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    got = float(r[r.rindex("I:"):].split()[1])
    if abs(got + 14.3) < 0.25: break
    gain = round(gain + (-14.3 - got), 1)
print("raw mix", I, "LUFS, gain", gain, "dB")
run(["ffmpeg", "-v", "error", "-y", "-i", "build/video.mp4", "-i", "build/mix.wav", "-map", "0:v", "-map", "1:a", "-t", str(END), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
     "-movflags", "+faststart", "build/dday-2m-test.mp4"])
print("wrote build/dday-2m-test.mp4", END)
