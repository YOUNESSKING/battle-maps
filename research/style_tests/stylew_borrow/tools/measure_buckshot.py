"""The buckshot ripple (share 66.56) check for any mix (r13 included): the raw voice stem (scratchpad/vc out_c.wav) is fitted into the mix
(lag by cross-correlation, gain by least squares over 64.4-66.4 s, just before the ripple), the rest = mix - voice. Prints the voice margin
(full band and 1-4 kHz) over 0.25 s windows from 66.5 / 66.75 / 67.0 s, and the mix's 2-4 kHz level over 67.3-67.7 s (after the ripple).
usage: python3 measure_buckshot.py VC_DIR LABEL=mix.(mp4|wav) ..."""
import subprocess, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfiltfilt
SR = 48000; VC = sys.argv[1]; C0 = 38.733333; F0 = 801.5 - 797.5   # m3f window starts at share 38.733 = film 801.5; out_c.wav starts at film 797.5
def load(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "2", "-ar", "48000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)
vc = load(f"{VC}/out_c.wav"); b14 = butter(4, [1000, 4000], "bandpass", fs=SR, output="sos"); b24 = butter(4, [2000, 4000], "bandpass", fs=SR, output="sos")
L = lambda y: 10 * np.log10(np.mean(y ** 2) + 1e-12)
print("| mix | lag | margin 66.5 | 66.75 | 67.0 (full / 1-4 kHz) | 2-4 kHz 67.3-67.7 |"); print("|---|---|---|---|---|---|")
for arg in sys.argv[2:]:
    lab, f = arg.split("=", 1); x = load(f); t0, t1 = 64.4, 66.4; i0, i1 = int(t0 * SR), int(t1 * SR); j0 = int((F0 + t0 - C0) * SR)
    lag = max(range(-400, 401), key=lambda q: float(np.dot(x[i0:i1, 0], vc[j0 - q:j0 - q + i1 - i0, 0])))
    v = np.zeros_like(x); s0 = int((F0 - C0) * SR) - lag; a = max(0, -s0); m = min(len(x) - a, len(vc) - (s0 + a)); v[a:a + m] = vc[s0 + a:s0 + a + m]
    k = float(np.sum(x[i0:i1] * v[i0:i1]) / np.sum(v[i0:i1] ** 2)); v *= k; r = x - v; vb, rb = sosfiltfilt(b14, v, axis=0), sosfiltfilt(b14, r, axis=0)
    W = lambda y, t: y[int(t * SR):int((t + 0.25) * SR)]
    cells = [f"{L(W(v, t)) - L(W(r, t)):+.1f} / {L(W(vb, t)) - L(W(rb, t)):+.1f}" for t in (66.5, 66.75, 67.0)]
    print(f"| {lab} | {lag} | " + " | ".join(cells) + f" | {L(sosfiltfilt(b24, x, axis=0)[int(67.3 * SR):int(67.7 * SR)]):.1f} |")
