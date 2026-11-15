"""GM3D clip mix: gm_test voice + quiet orchestral bed (ducked) + battle ambience on the day battle shots + cannon / impact / musketry / fire
on the visible shots only (cue list = cues.js, the same list the scene builds its fx from). Then muxes onto the concatenated video chunks.
Sound sources (read only, existing licensed/our library, same as gm_test/assemble.py): Kevin MacLeod 'Long Note Two' (CC BY 4.0),
Freesound 'Distant Warfare' (CC0), juskiddink 'Distant explosion' (CC BY 4.0), Aegersum 'Cannon artillery distant gunshots' (CC BY 3.0),
USC Cinema 'Heavy explosion with reverberation' (CC0), Mixkit zoom whoosh, greene/ synthesized musket volley (our own).
usage: python3 assemble.py CHUNK_DIR OUT.mp4 [--audio-only]"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = "/home/user/battle-maps"; M = f"{REPO}/grant/assets/media"; SR = 48000
CH, OUT = sys.argv[1], sys.argv[2]
cues_js = open(f"{HERE}/cues.js").read()
ev = json.loads(subprocess.run(["node", "-e", "const window={};" + cues_js + ";console.log(JSON.stringify({T:window.T,C:window.CUES}))"], capture_output=True, text=True, check=True).stdout)
T, CUES = ev["T"], ev["C"]; D = T["D"]

def load(path, start=0.0, dur=None, af=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", path] + (["-t", str(dur)] if dur else []) + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
db = lambda x: 10 ** (x / 20)
def fade(a, fin, fout):
    n = len(a); i = int(fin * SR); o = int(fout * SR)
    if i: a[:i] *= np.linspace(0, 1, i)[:, None]
    if o: a[n - o:] *= np.linspace(1, 0, o)[:, None]
    return a
def place(out, clip, t, g):
    i = int(t * SR); n = min(len(clip), len(out) - i)
    if n > 0 and i >= 0: out[i:i + n] += clip[:n] * g
env = lambda n, xs, ys: np.interp(np.arange(n) / SR, xs, ys)[:, None]

N = int(D * SR)
vo = np.zeros((N, 2), np.float32); place(vo, load(f"{REPO}/research/style_tests/gm_test/audio/voice.wav"), 0, 1.0)
mus = load(f"{M}/music_src_long-note-two.mp3", 0, D)
mus *= env(len(mus), [0, 2, T["p3"] - 1, T["p3"] + 1, T["p4"] - 1, T["p4"] + 1, T["p5"] - 1, T["p5"] + 1, D - 3, D], [0, 1.0, 1.0, 1.3, 1.3, 0.85, 0.85, 1.15, 1.15, 0])
amb = load(f"{M}/sfx/candidates/cand5_distant-warfare.mp3", 70, D)
amb *= env(len(amb), [0, T["dive"], T["dive"] + 1.5, T["p3"], T["p3"] + 1, T["p4"] - 1, T["p4"] - 0.3, T["p5"] - 0.6, T["p5"] + 0.5, D - 3, D],
           [0.15, 0.25, 0.7, 0.8, 1.0, 1.0, 0.15, 0.15, 0.35, 0.35, 0])
KIT = {"gun": (load(f"{M}/sfx/candidates/cand1_hit.wav"), -15), "boom": (load(f"{M}/sfx/candidates/cand2_hit.wav"), -19),
       "fire": (fade(load(f"{M}/sfx/candidates/bombs/bomb4_heavyexplosionreverbusc.mp3", 0, 5.6, "lowpass=f=900"), 0, 2.0), -17),
       "volley": (load(f"{REPO}/greene/assets/media/sfx_musket_volley.mp3", af="lowpass=f=2600,aecho=0.8:0.6:60:0.25"), -24),
       "whoosh": (load(f"{M}/sfx/zoom_whoosh.wav"), -14)}
sfx = np.zeros((N, 2), np.float32); last = {}
for k, t in sorted(CUES, key=lambda c: c[1]):
    if k not in KIT or t - last.get(k, -9) < 0.35: continue
    last[k] = t; g = db(KIT[k][1])
    if T["p4"] - 0.6 < t < T["p5"] - 0.6 and k == "gun": g *= db(-5)   # flashback guns: distant, at night
    place(sfx, KIT[k][0], t, g)
vabs = np.abs(vo).mean(1); k = int(0.25 * SR); venv = np.convolve(vabs, np.ones(k) / k, mode="same"); venv = np.clip(venv / (np.percentile(venv, 95) + 1e-9), 0, 1)
mix = vo + mus[:N] * db(-18) * (1 - 0.55 * venv)[:, None] + amb[:N] * db(-23) * (1 - 0.35 * venv)[:, None] + sfx * (1 - 0.3 * venv)[:, None]
B = f"{HERE}/build"; os.makedirs(B, exist_ok=True); sf.write(f"{B}/mix.wav", mix, SR, subtype="FLOAT")
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{B}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000"
if "--audio-only" in sys.argv: sys.exit(0)
chunks = sorted([f for f in os.listdir(CH) if re.fullmatch(r"c\d+\.mp4", f)], key=lambda f: int(f[1:-4]))
open(f"{B}/list.txt", "w").write("".join(f"file '{CH}/{c}'\n" for c in chunks))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{B}/list.txt", "-c", "copy", f"{B}/video.mp4"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{B}/video.mp4", "-i", f"{B}/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a", "-t", f"{D:.2f}",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT], check=True)
os.remove(f"{B}/video.mp4")
r = subprocess.run(["ffmpeg", "-nostats", "-i", OUT, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
print("chunks", chunks, "| cues", len(CUES), "| loudness", re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1], "LUFS")
