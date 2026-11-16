"""GM test: voice + orchestral bed + continuous battle ambience + deep booms on card reveals -> gm_test.mp4 (~-14 LUFS).
Only existing files from our licensed library (read only): Kevin MacLeod 'Long Note Two' (CC BY 4.0), Freesound 'Distant Warfare'
(CC0, cand5), 'Distant explosion' juskiddink (CC BY 4.0, cand2_hit), 'Cannon artillery distant gunshots' Aegersum (CC BY 3.0, cand1_hit),
USC Cinema 'Heavy explosion with reverberation' (CC0, bomb4), Mixkit zoom whoosh + counter tick (locked kit). No new synthesis.
Cue times come from the scene itself (data-sfx written by index.html). usage: python3 assemble.py [--audio-only]"""
import glob, html, json, os, re, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); B = f"{HERE}/build"; M = "/home/user/battle-maps/grant/assets/media"; SR = 48000
T = json.load(open(f"{B}/times.json")); D = T["D"]

def load(path, start=0.0, dur=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", path] + (["-t", str(dur)] if dur else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
db = lambda x: 10 ** (x / 20)
def fade(a, fin, fout):
    n = len(a); i = int(fin * SR); o = int(fout * SR)
    if i: a[:i] *= np.linspace(0, 1, i)[:, None]
    if o: a[n - o:] *= np.linspace(1, 0, o)[:, None]
    return a
def place(out, clip, t, g):
    i = int(t * SR); n = min(len(clip), len(out) - i)
    if n > 0: out[i:i + n] += clip[:n] * g

N = int(D * SR)
voice = load(f"{HERE}/audio/voice.wav"); vo = np.zeros((N, 2), np.float32); place(vo, voice, 0, 1.0)
# orchestral bed: brooding strings, swells into the assault (envelope) and dips for the night flashback
mus = load(f"{M}/music_src_long-note-two.mp3", 0, D)
env = np.interp(np.arange(len(mus)) / SR, [0, 2, T["p3"] - 1, T["p3"] + 1, T["p4"] - 1, T["p4"] + 1, T["p5"] - 1, T["p5"] + 1, D - 3, D],
                [0, 1.0, 1.0, 1.35, 1.35, 0.8, 0.8, 1.15, 1.15, 0])
mus *= env[:, None]
# continuous low battle ambience (real recording, pitched-down fireworks rumble): day battle shots only, a faint bed in the flashback
amb = load(f"{M}/sfx/candidates/cand5_distant-warfare.mp3", 70, D)
aenv = np.interp(np.arange(len(amb)) / SR, [0, 2, T["p3"] - 0.5, T["p3"] + 0.5, T["p4"] - 1, T["p4"] + 0.5, T["p5"] - 1, T["p5"] + 0.5, D - 3, D],
                 [0, 0.7, 0.8, 1.0, 1.0, 0.35, 0.35, 0.6, 0.6, 0])
amb *= aenv[:, None]
# cues from the scene
CH = glob.glob("/root/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell")[0]
dom = subprocess.run([CH, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=3000", "--dump-dom",
                      "file://" + f"{HERE}/scene/index.html"], capture_output=True, text=True, timeout=180).stdout
cues = json.loads(html.unescape(re.search(r'<html[^>]*data-sfx="([^"]*)"', dom).group(1)))
KIT = {"boom": (load(f"{M}/sfx/candidates/cand2_hit.wav"), -13), "fireboom": (fade(load(f"{M}/sfx/candidates/bombs/bomb4_heavyexplosionreverbusc.mp3", 0, 5.6), 0, 1.5), -15),
       "gun": (load(f"{M}/sfx/candidates/cand1_hit.wav"), -16), "whoosh": (load(f"{M}/sfx/zoom_whoosh.wav"), -12), "tick": (load(f"{M}/sfx/counter_tick.wav"), -20)}
sfx = np.zeros((N, 2), np.float32); last = {}
for k, t in sorted(cues, key=lambda c: c[1]):
    if k not in KIT or t - last.get(k, -9) < 0.4: continue
    last[k] = t; place(sfx, KIT[k][0], t, db(KIT[k][1]))
json.dump(cues, open(f"{B}/sfx_cues.json", "w"))
# mix: bed and ambience ducked under the voice (envelope follower on the voice)
vabs = np.abs(vo).mean(1); k = int(0.25 * SR); venv = np.convolve(vabs, np.ones(k) / k, mode="same"); venv = np.clip(venv / (np.percentile(venv, 95) + 1e-9), 0, 1)
duck = 1 - 0.55 * venv
mix = vo * 1.0 + mus[:N] * db(-17) * duck[:, None] + amb[:N] * db(-22) * (1 - 0.35 * venv)[:, None] + sfx
sf.write(f"{B}/mix.wav", mix, SR, subtype="FLOAT")
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{B}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000"
if "--audio-only" in sys.argv: sys.exit(0)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{B}/gm_video.mp4", "-i", f"{B}/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a", "-t", f"{D:.2f}",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", f"{HERE}/gm_test.mp4"], check=True)
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{HERE}/gm_test.mp4", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
print("cues", len(cues), "| loudness", re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1], "LUFS")
