"""Andrew Jackson film assembly (copy of vicksburg/tools/assemble.py): 8 scene renders -> one master with 0.6 s dissolves between scenes, voice A, a quiet Kevin MacLeod bed
(one track per act, cross-faded), battle ambience on the battle scenes, and the locked sound kit on every VISIBLE cue (scenes/SNN/cues.json,
the same list each scene draws its guns/volleys/fires from). Loudness -14 LUFS, TP -1.5.
Sources (read only): Kevin MacLeod 'Long Note Two', 'Long Note One', 'Anguish', 'Wounded' (CC BY 4.0, incompetech); Freesound 'Distant Warfare'
(CC0); goosegreen locked kit (cand1_hit / cand2_hit / zoom_whoosh); USC heavy explosion (CC0); greene musket volley (ours).
usage: python3 vicksburg/tools/assemble.py RENDER_DIR OUT.mp4 [--audio-only] [--720]    (RENDER_DIR holds S01.mp4 ... S12.mp4)"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
REPO = "/home/user/battle-maps"; V = f"{REPO}/ajackson"; M = f"{REPO}/grant/assets/media"; GG = f"{REPO}/goosegreen/assets/media/sfx"; SR = 48000
RD, OUT = sys.argv[1], sys.argv[2]
SC = json.load(open(f"{V}/audio/scenes.json")); TAIL = SC["tail"]; S = SC["scenes"]
D = S[-1]["A"] + S[-1]["D"]
BATTLE = {"S03", "S05", "S06", "S07"}
NIGHT = {"S05"}

def load(path, start=0.0, dur=None, af=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", path] + (["-t", str(dur)] if dur else []) + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()
db = lambda x: 10 ** (x / 20)
def place(out, clip, t, g):
    i = int(t * SR); n = min(len(clip), len(out) - i)
    if n > 0 and i >= 0: out[i:i + n] += clip[:n] * g
def ramp(n, fin, fout):
    e = np.ones(n, np.float32); i, o = int(fin * SR), int(fout * SR)
    if i: e[:i] = np.linspace(0, 1, i)
    if o: e[n - o:] = np.minimum(e[n - o:], np.linspace(1, 0, o))
    return e[:, None]
N = int(D * SR)

# voice (voice A if converted, else Kokoro)
vw = os.environ.get("VOICE") or next((f for f in (f"{V}/audio/voice_clone.wav", f"{V}/audio/voice_owner.wav") if os.path.exists(f)), f"{V}/audio/voice.wav")   # owner 2026-11-18: his own voice clone
vo = np.zeros((N, 2), np.float32); place(vo, load(vw), 0, 1.0)

# music: one bed per act, 3 s cross-fades at act boundaries
ACTS = [("S01", "long-note-two", 0), ("S03", "long-note-one", 0), ("S05", "anguish", 0), ("S08", "wounded", 0)]
mus = np.zeros((N, 2), np.float32)
for i, (sid, name, off) in enumerate(ACTS):
    a = next(s["A"] for s in S if s["id"] == sid); b = next((s["A"] for s in S if s["id"] == ACTS[i + 1][0]), D) if i + 1 < len(ACTS) else D
    src = load(f"{M}/music_src_{name}.mp3"); need = int((b - a + 3) * SR)
    while len(src) < need: src = np.concatenate([src, src])
    seg = src[:need] * ramp(need, 3 if i else 1.5, 3); place(mus, seg, max(0, a - 1.5), 1.0)
mus *= ramp(N, 0, 4)
# ambience under the battle scenes
amb_src = load(f"{M}/sfx/candidates/cand5_distant-warfare.mp3")
amb = np.zeros((N, 2), np.float32)
for s in S:
    if s["id"] not in BATTLE: continue
    n = int(s["D"] * SR); src = amb_src
    while len(src) < n: src = np.concatenate([src, amb_src])
    place(amb, src[:n] * ramp(n, 1.5, 1.5), s["A"], 1.0)
KIT = {"gun": (load(f"{GG}/candidates/cand1_hit.wav"), -15), "boom": (load(f"{GG}/candidates/cand2_hit.wav"), -19),
       "fire": (load(f"{M}/sfx/candidates/bombs/bomb4_heavyexplosionreverbusc.mp3", 0, 5.6, "lowpass=f=900") * ramp(int(5.6 * SR), 0, 2.0)[:int(5.6 * SR)], -17),
       "whoosh": (load(f"{GG}/zoom_whoosh.wav"), -14)}
sfx = np.zeros((N, 2), np.float32); ncue = 0
for s in S:
    cj = f"{V}/scenes/{s['id']}/cues.json"
    if not os.path.exists(cj): print("no cues for", s["id"]); continue
    last = {}
    for k, t in sorted(json.load(open(cj))["CUES"], key=lambda c: c[1]):
        if k not in KIT or t - last.get(k, -9) < 0.35 or t > s["D"] - 0.05: continue
        last[k] = t; g = db(KIT[k][1]) * (db(-5) if s["id"] in NIGHT and k == "gun" else 1)
        place(sfx, KIT[k][0], s["A"] + t, g); ncue += 1
vabs = np.abs(vo).mean(1); k = int(0.25 * SR); venv = np.convolve(vabs, np.ones(k) / k, mode="same"); venv = np.clip(venv / (np.percentile(venv, 95) + 1e-9), 0, 1)
# musket / march / cheer stem from the visible troop events (tools/troop_stem.py; replaces the old single volley sample), -6 dB under words
tst = load(f"{V}/build/troop_stem.wav") if os.path.exists(f"{V}/build/troop_stem.wav") else np.zeros((N, 2), np.float32)
troop = np.zeros((N, 2), np.float32); place(troop, tst, 0, 1.0)
mix = vo + mus * db(-19) * (1 - 0.55 * venv)[:, None] + amb * db(-24) * (1 - 0.35 * venv)[:, None] + sfx * (1 - 0.5 * venv)[:, None] + troop * db(-4) * (1 - 0.85 * venv)[:, None]   # critic B r1: words were masked by the battle sound
mix *= ramp(N, 0, 2.5)
B = f"{V}/build"; os.makedirs(B, exist_ok=True); sf.write(f"{B}/mix.wav", mix, SR, subtype="FLOAT")
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{B}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{B}/mix.wav", "-af", af, "-c:a", "pcm_s16le", f"{B}/mix_norm.wav"], check=True)
print(f"audio: {D:.1f} s, cues {ncue}, voice {os.path.basename(vw)}")
if "--audio-only" in sys.argv: sys.exit(0)

# video: xfade chain (each scene's last TAIL s dissolves into the next scene's first TAIL s)
ins, fl, prev, acc = [], [], "0:v", 0.0
for i, s in enumerate(S):
    ins += ["-i", f"{RD}/{s['id']}.mp4"]
for i, s in enumerate(S[:-1]):
    acc += s["D"] - TAIL
    lab = f"v{i}"; fl.append(f"[{prev}][{i + 1}:v]xfade=transition=fade:duration={TAIL}:offset={acc:.3f}[{lab}]"); prev = lab
scale = "" if "--720" in sys.argv else ",scale=1920:1080:flags=lanczos"
fl.append(f"[{prev}]fps=30,format=yuv420p{scale}[vout]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-i", f"{B}/mix_norm.wav", "-filter_complex", ";".join(fl), "-map", "[vout]", "-map", f"{len(S)}:a",
                "-t", f"{D:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT], check=True)
r = subprocess.run(["ffmpeg", "-nostats", "-i", OUT, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
print("wrote", OUT, "| loudness", re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1], "LUFS")
