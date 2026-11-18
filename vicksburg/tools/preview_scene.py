"""Preview one rendered scene with its narration slice + the locked sound kit on its cues + the act's music bed (quick check, not the master).
usage: python3 vicksburg/tools/preview_scene.py S05 IN.mp4 OUT.mp4"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
REPO = "/home/user/battle-maps"; V = f"{REPO}/vicksburg"; M = f"{REPO}/grant/assets/media"; GG = f"{REPO}/goosegreen/assets/media/sfx"; SR = 48000
sid, IN, OUT = sys.argv[1:4]
s = next(x for x in json.load(open(f"{V}/audio/scenes.json"))["scenes"] if x["id"] == sid); A, D = s["A"], s["D"]
def load(p, st=0.0, dur=None, af=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(st), "-i", p] + (["-t", str(dur)] if dur else []) + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
db = lambda x: 10 ** (x / 20); N = int(D * SR)
def place(o, c, t, g):
    i = int(t * SR); n = min(len(c), len(o) - i)
    if n > 0 and i >= 0: o[i:i + n] += c[:n] * g
vw = os.environ.get("VOICE") or next((f for f in (f"{V}/audio/voice_clone.wav", f"{V}/audio/voice_owner.wav") if os.path.exists(f)), f"{V}/audio/voice.wav")
vo = np.zeros((N, 2), np.float32); place(vo, load(vw, A, D), 0, 1)
mus = np.zeros((N, 2), np.float32); place(mus, load(f"{M}/music_src_long-note-two.mp3", A % 400, D), 0, 1)
KIT = {"gun": (load(f"{GG}/candidates/cand1_hit.wav"), -15), "boom": (load(f"{GG}/candidates/cand2_hit.wav"), -19),
       "fire": (load(f"{M}/sfx/candidates/bombs/bomb4_heavyexplosionreverbusc.mp3", 0, 5.6, "lowpass=f=900"), -17),
       "volley": (load(f"{REPO}/greene/assets/media/sfx_musket_volley.mp3", af="lowpass=f=2600,aecho=0.8:0.6:60:0.25"), -24),
       "whoosh": (load(f"{GG}/zoom_whoosh.wav"), -14)}
sfx = np.zeros((N, 2), np.float32); last = {}
for k, t in sorted(json.load(open(f"{V}/scenes/{sid}/cues.json"))["CUES"], key=lambda c: c[1]):
    if k in KIT and t - last.get(k, -9) >= 0.35: last[k] = t; place(sfx, KIT[k][0], t, db(KIT[k][1]))
mix = vo + mus * db(-19) + sfx * 0.8
tmp = f"/tmp/vx_prev_{sid}.wav"; sf.write(tmp, mix, SR, subtype="FLOAT")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", IN, "-i", tmp, "-map", "0:v", "-map", "1:a", "-af", "loudnorm=I=-14:TP=-1.5", "-c:v", "libx264",
                "-crf", "23", "-preset", "medium", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", OUT], check=True)
print("wrote", OUT, os.path.getsize(OUT) // 1e6, "MB", "voice", os.path.basename(vw))
