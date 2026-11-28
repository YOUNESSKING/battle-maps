"""The coordinator's gun-loudness metric: mean power (dB) over 0.35 s from each shot (cannon 34.63, impact 35.13, volleys 63.37 / 66.56 s)
+ a voice-only reference (mean over 40-44 s) and the sample peak. usage: python3 measure_shots035.py LABEL=file ..."""
import subprocess, sys, numpy as np
T = [("cannon 34.63", 34.63), ("impact 35.13", 35.13), ("volley 63.37", 63.37), ("volley 66.56", 66.56)]
def load(f):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(r, np.float32)
print("| mix | " + " | ".join(n for n, _ in T) + " | voice 40-44 s | peak |"); print("|---" * (len(T) + 3) + "|")
for a in sys.argv[1:]:
    lab, f = a.split("=", 1); x = load(f); m = lambda t, d: 10 * np.log10(np.mean(x[int(t * 48000):int((t + d) * 48000)] ** 2) + 1e-12)
    print(f"| {lab} | " + " | ".join(f"{m(t, 0.35):.1f}" for _, t in T) + f" | {m(40, 4):.1f} | {20 * np.log10(np.abs(x).max()):.1f} |")
