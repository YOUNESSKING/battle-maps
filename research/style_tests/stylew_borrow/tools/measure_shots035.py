"""The coordinator's gun-loudness metric: mean power (dB, stereo) over 0.35 s from each shot (cannon 34.63, impact 35.13, volleys 63.37 / 66.56 s),
the voice under the shots (34.6-35.6 s and 63.3-64.1 s are shot windows; 40-44 s voice only) — measure the mp4s.
usage: python3 measure_shots035.py LABEL=file ..."""
import subprocess, sys, numpy as np
T = [("cannon 34.63", 34.63, 0.35), ("impact 35.13", 35.13, 0.35), ("volley 63.37", 63.37, 0.35), ("volley 66.56", 66.56, 0.35), ("voice only 40-44", 40.0, 4.0)]
def load(f):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "2", "-ar", "48000", "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(r, np.float32).reshape(-1, 2)
print("| mix | " + " | ".join(n for n, _, _ in T) + " |"); print("|---" * (len(T) + 1) + "|")
for a in sys.argv[1:]:
    lab, f = a.split("=", 1); x = load(f); m = lambda t, d: 10 * np.log10(np.mean(x[int(t * 48000):int((t + d) * 48000)] ** 2) + 1e-12)
    print(f"| {lab} | " + " | ".join(f"{m(t, d):.1f}" for _, t, d in T) + " |")
