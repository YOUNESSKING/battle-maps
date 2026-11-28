"""Per-shot loudness of the test mixes (r14 audio check): short-term RMS maxima (100 ms and 500 ms windows) at the cannon (gun 34.63 s,
boom 35.13 s), the two Parker's Ferry volleys (63.37 s, 66.56 s), the first ambush shot, and a voice-only stretch (40-44 s) for reference.
usage: python3 measure_shots.py LABEL=file.wav ..."""
import sys, numpy as np, soundfile as sf
def m(f):
    x, sr = sf.read(f); x = x.mean(1) if x.ndim > 1 else x; c = np.concatenate([[0], np.cumsum(x.astype(np.float64) ** 2)])
    def pk(w, a, b):
        n = int(w * sr); i = np.arange(int(a * sr), int(b * sr) - n); return 10 * np.log10((c[i + n] - c[i]).max() / n + 1e-12)
    return [pk(0.1, 34.6, 35.1), pk(0.5, 34.6, 35.6), pk(0.1, 35.05, 35.6), pk(0.1, 63.3, 64.1), pk(0.5, 63.3, 64.6), pk(0.1, 66.5, 67.4), pk(0.5, 66.5, 67.9), pk(0.1, 63.3, 63.5), pk(0.1, 40, 44), pk(0.5, 40, 44), 20 * np.log10(np.abs(x).max())]
print("| mix | cannon gun 100 ms | cannon 500 ms | boom 100 ms | volley 1 100 ms | volley 1 500 ms | volley 2 100 ms | volley 2 500 ms | first shot 100 ms | voice 100 ms | voice 500 ms | peak |")
print("|---" * 12 + "|")
for a in sys.argv[1:]:
    lab, f = a.split("=", 1); print(f"| {lab} | " + " | ".join(f"{v:.1f}" for v in m(f)) + " |")
