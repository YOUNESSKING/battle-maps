"""1-minute TEST: the locked SFX/music vs Epidemic Sound SFX/music on the same minute of a finished video (owner 2026-11-01).
Does NOT touch the sound lock or any video. usage (from a video folder, e.g. cleburne/):
  python3 ../library/epidemic/tools/sfx_music_test.py T0 DUR locked|MUSIC.mp3 OUT.mp4   ("locked" = the channel's locked music bed, same level and position as the master)
Uses build/sfx_cues.json, audio/voice_owner.wav and build/<name>-v3.mp4 (or MASTER env)."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
sys.path.insert(0, "tools")
import sfx_mix_lib as L
t0, dur, music, out = float(sys.argv[1]), float(sys.argv[2]), sys.argv[3], sys.argv[4]
LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sfx")
SR = 48000
def load(p):
    a, sr = sf.read(p, dtype="float32", always_2d=True); a = a.mean(axis=1)
    if sr != SR: a = np.interp(np.arange(0, len(a) * SR / sr) * sr / SR, np.arange(len(a)), a).astype("float32")
    return a
def loud(a):  # RMS of the loudest 0.4 s window
    w = int(0.4 * SR); s = np.convolve(a * a, np.ones(w) / w, "valid"); return float(np.sqrt(s.max())) if len(s) else 1e-6
def trim(a, sec):
    a = a[: int(sec * SR)].copy(); f = int(0.3 * SR); a[-f:] *= np.linspace(1, 0, f); return a
def volley(files):  # a ragged rifle-musket volley from several real 1853 Enfield shots
    parts = [load(f"{LIB}/{f}") for f in files]; n = max(len(p) for p in parts) + int(0.4 * SR); v = np.zeros(n, "float32")
    rng = np.random.default_rng(3)
    for k in range(9):
        p = parts[k % len(parts)]; i = int(rng.uniform(0, 0.35) * SR); v[i:i + len(p)] += p * rng.uniform(0.5, 1.0)
    return v
EPI = {"fire": [trim(load(f"{LIB}/{f}"), 4.5) for f in ["cannon_fire_distant.flac", "cannon_fire_low01.flac", "cannon_fire_low03.flac"]],
       "impact": [trim(load(f"{LIB}/{f}"), 4.5) for f in ["impact_mortar_distant02.flac", "impact_mortar_distant04.flac"]],
       "explosion": [trim(load(f"{LIB}/explosion_artillery_distant_deep.flac"), 6.0)],
       "mg": [trim(volley(["rifle_enfield1853_60m01.flac", "rifle_enfield1853_60m02.flac", "rifle_enfield1853_30m01.flac", "rifle_enfield1853_30m02.flac"]), 5.0)]}
cues = [c for c in json.load(open("build/sfx_cues.json")) if t0 <= c[0] < t0 + dur]
total = dur
o = np.zeros(int((total + 6) * SR), "float32")
rng = np.random.default_rng(7); last = {}; used = {}
for t, kind, _ in cues:
    if kind not in L.KINDS: continue
    files, db, gap = L.KINDS[kind]
    if t - last.get(kind, -99) < gap: continue
    last[kind] = t
    ref = load(f"{L.D}/{files[0]}")
    if kind in EPI and os.environ.get("EPI", "1") == "1":                              # EPI=0 -> the locked sounds, same pipeline (fair A/B)
        cl = EPI[kind][used.get(kind, 0) % len(EPI[kind])]
        gk = min(loud(ref) / max(loud(cl), 1e-6), np.abs(ref).max() / max(np.abs(cl).max(), 1e-6))   # never louder or peakier than the locked sound
        cl = cl * gk
    else:
        cl = load(f"{L.D}/{files[used.get(kind, 0) % len(files)]}")
    used[kind] = used.get(kind, 0) + 1
    g = 10 ** ((db + rng.uniform(-2.0, 1.0)) / 20); i = int((t - t0) * SR); n = min(len(cl), len(o) - i)
    o[i:i + n] += cl[:n] * g
if os.environ.get("AMB") == "1":                                                     # optional faint battle bed (off by default)
    amb = load(f"{LIB}/ambience_naval_bombardment_cannons.flac")[: len(o)]
    o[: len(amb)] += amb * (10 ** (-34 / 20)) / max(loud(amb), 1e-6) * 0.25
pk = np.abs(o).max() or 1
if pk > 0.89: o *= 0.89 / pk
sf.write("build/_epi_sfx.wav", np.stack([o, o], 1)[: int(total * SR)], SR, subtype="PCM_16")
voice = "audio/voice_owner.wav" if os.path.exists("audio/voice_owner.wav") else "audio/voice.wav"
master = os.environ.get("MASTER") or sorted(f for f in os.listdir("build") if f.endswith("-v3.mp4"))[0]
master = master if "/" in master else f"build/{master}"
f = ["[1:a]aresample=48000,asplit=3[vo][key][key2]", "[2:a]aresample=48000[sx]", "[sx][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     "[3:a]aresample=48000,volume=0.08" + ("" if music == "locked" else ",afade=t=in:d=1.5") + "[mus]", "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false,loudnorm=I=-14:TP=-1.5:LRA=11[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0}", "-t", f"{dur}", "-i", master, "-ss", f"{t0}", "-t", f"{dur}", "-i", voice,
                "-i", "build/_epi_sfx.wav", *(["-stream_loop", "-1", "-ss", f"{t0 % sf.info('assets/media/music.wav').duration:.3f}", "-i", "assets/media/music.wav"] if music == "locked" else ["-stream_loop", "-1", "-i", music]), "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                "-t", f"{dur}", "-vf", "scale=1280:720", "-c:v", "libx264", "-crf", "22", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
print("wrote", out, len(cues), "cues")
