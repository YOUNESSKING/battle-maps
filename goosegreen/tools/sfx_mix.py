"""Render build/sfx_cues.json (from tools/sfx_cues.py) into one sound-effects track: build/sfx.wav.

usage (from the project folder): python3 tools/sfx_mix.py
Each cue kind maps to one or more clips in assets/media/sfx/ (variants rotate so repeats differ), with a
per-kind level and a minimum gap so rapid barrages don't turn into noise. Deterministic (fixed seed).
assemble_full.py mixes the result under the voice (ducked a little, like the music).
"""
import json, os
import numpy as np, soundfile as sf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
SR = 48000
D = "assets/media/sfx"
KINDS = {  # kind: (clips, level dB, min gap between two cues of this kind in s)
    "fire":      (["gun_fire.wav"], -13, 0.35),
    "mortar":    (["mortar_thump.wav"], -15, 0.30),
    "impact":    (["artillery_far_1.wav", "artillery_far_2.wav", "artillery_far_3.wav"], -12, 0.40),
    "explosion": (["explosion_near_1.wav", "explosion_near_2.wav"], -7, 0.60),
    "missile":   (["missile_launch_hit.wav"], -9, 0.80),
    "mg":        (["mg_burst.wav"], -18, 1.00),
    "whoosh":    (["whoosh.wav"], -15, 0.50),
    "hit":       (["hit.wav"], -8, 0.50),
    "static":    (["radio_static.wav"], -21, 3.00),
    "tick":      (["counter_tick.wav"], -20, 0.12),
}
total = json.load(open("audio/timing.json"))["duration"]
cues = json.load(open("build/sfx_cues.json"))
clips = {}
for kind, (files, _, _) in KINDS.items():
    arr = []
    for f in files:
        a, sr = sf.read(f"{D}/{f}", dtype="float32", always_2d=True)
        assert sr == SR, f
        arr.append(a.mean(axis=1))
    clips[kind] = arr
out = np.zeros(int((total + 5) * SR), dtype="float32")
rng = np.random.default_rng(7)
last, used, count = {}, {k: 0 for k in KINDS}, 0
for t, kind, _scene in cues:
    if kind not in KINDS:
        continue
    _, db, gap = KINDS[kind]
    if t - last.get(kind, -99) < gap:
        continue
    last[kind] = t
    clip = clips[kind][used[kind] % len(clips[kind])]; used[kind] += 1
    gain = 10 ** ((db + rng.uniform(-2.0, 1.0)) / 20)
    i = int(t * SR)
    n = min(len(clip), len(out) - i)
    out[i:i + n] += clip[:n] * gain
    count += 1
peak = np.abs(out).max() or 1
if peak > 0.89:
    out *= 0.89 / peak
sf.write("build/sfx.wav", np.stack([out, out], axis=1)[: int(total * SR)], SR, subtype="PCM_16")
print(f"placed {count} of {len(cues)} cues -> build/sfx.wav", {k: v for k, v in used.items() if v})
