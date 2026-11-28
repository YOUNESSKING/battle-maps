"""Voice margin under the effects: the final mix minus the (gain-scaled) pure voice stem = everything else. Per window: voice vs rest, full band
and 1-4 kHz (energy over the window), and the worst 100 ms frame where the voice speaks (voice frame within 10 dB of its window max).
usage: python3 measure_margins.py FINAL.wav VK.wav   (VK.wav + VK.wav.json from make_test_audio.py DUMP_VK=...)"""
import json, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt
fin, vk = sys.argv[1:3]; g = json.load(open(vk + ".json"))["gain_db"]; SR = 48000
x, _ = sf.read(fin, dtype="float32"); v, _ = sf.read(vk, dtype="float32"); a0, a1 = 40 * SR, 44 * SR; lags = range(-200, 201)   # the final limiter's lookahead delays the mix: align the voice to it (best lag over 40-44 s)
lag = max(lags, key=lambda q: float(np.dot(x[a0:a1, 0], v[a0 - q:a1 - q, 0])))
v = np.roll(v, lag, axis=0); n = min(len(x), len(v)); x, v = x[:n], v[:n] * 10 ** (g / 20); r = x - v; print(f"voice aligned by {lag} samples")
sos = butter(4, [1000, 4000], "bandpass", fs=SR, output="sos"); vb, rb = sosfiltfilt(sos, v, axis=0), sosfiltfilt(sos, r, axis=0)
W = [("hook-a tail 16.0-16.6", 16.0, 16.6), ("fire bed 29.2-33.6", 29.2, 33.6), ("cannon 34.6-35.6", 34.6, 35.6), ("voice only 40-44", 40.0, 44.0),
     ("volley 63.4-64.1", 63.4, 64.1), ("volley 66.5-67.8", 66.5, 67.8),
     ("tail only 63.75-64.1", 63.75, 64.1), ("tail only 66.95-67.8", 66.95, 67.8)]   # the first 0.35 s of each ripple is the loud front by design
E = lambda y, a, b: float(np.mean(y[int(a * SR):int(b * SR)] ** 2)) + 1e-12
L = lambda y, a, b: 10 * np.log10(E(y, a, b))
print("| window | voice dB | rest dB | margin | margin 1-4 kHz | worst 100 ms (1-4 kHz) |"); print("|---|---|---|---|---|---|")
for lab, a, b in W:
    fr = [(t, L(vb, t, t + 0.1) - L(rb, t, t + 0.1), L(v, t, t + 0.1)) for t in np.arange(a, b - 0.099, 0.05)]; vm = max(f[2] for f in fr)
    worst = min((f for f in fr if f[2] > vm - 10), key=lambda f: f[1])   # frames where the voice speaks (within 10 dB of its window peak)
    print(f"| {lab} | {L(v, a, b):.1f} | {L(r, a, b):.1f} | {L(v, a, b) - L(r, a, b):+.1f} | {L(vb, a, b) - L(rb, a, b):+.1f} | {worst[1]:+.1f} at {worst[0]:.2f} |")
c = np.concatenate([[0], np.cumsum(np.mean(v.astype(np.float64) ** 2, 1))]); k = int(0.35 * SR)
print(f"voice loudest 0.35 s: {10 * np.log10((c[k:] - c[:-k]).max() / k):.1f} dB (mean power, stereo)")
