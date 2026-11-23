"""Slice the Epidemic Sound Pattern-Enfield 1853 recordings (5/10/20/30/60 m, 5 shots each) into single-shot FLAC files.
usage: python3 vicksburg/tools/troop_sfx_lib.py RAW_DIR   (RAW_DIR holds enf05.wav enf10.wav enf20.wav enf30a/b enf60a/b march.wav cheer.wav)"""
import os, sys, numpy as np, soundfile as sf, subprocess
RAW = sys.argv[1]; OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sound", "shots"); os.makedirs(OUT, exist_ok=True)
SR = 48000
def rd(f):
    p = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(p, np.float32).reshape(-1, 2).copy()
def onsets(x):
    m = np.abs(x).max(1); w = int(SR * .005); e = np.sqrt(np.convolve(m ** 2, np.ones(w) / w, "same")); thr = e.max() * .15; on = []; i = 0
    while i < len(e):
        if e[i] > thr and e[i] > 3 * np.median(e[max(0, i - int(SR * .4)):max(1, i - int(SR * .05))] + 1e-6):
            # walk back to the true rise (envelope below 10 % of the local peak)
            j = i
            while j > 0 and e[j] > thr * .08: j -= 1
            on.append(j); i += SR
        else: i += 1
    return on
n = 0
for name in sorted(os.listdir(RAW)):
    if not name.startswith("enf"): continue
    x = rd(os.path.join(RAW, name)); on = onsets(x); tag = name[:-4]
    for k, o in enumerate(on):
        a = max(0, o - int(.01 * SR)); b = on[k + 1] - int(.12 * SR) if k + 1 < len(on) else len(x)
        b = min(b, a + int(2.0 * SR)); seg = x[a:b].copy(); f = int(.12 * SR); seg[-f:] *= np.linspace(1, 0, f)[:, None]
        sf.write(os.path.join(OUT, f"{tag}_{k}.flac"), seg, SR, subtype="PCM_16"); n += 1
for nm, nn in (("march", "march_loop"), ("cheer", "cheer_charge")):
    sf.write(os.path.join(OUT, nn + ".flac"), rd(os.path.join(RAW, nm + ".wav")), SR, subtype="PCM_16")
print("wrote", n, "shots to", OUT)
