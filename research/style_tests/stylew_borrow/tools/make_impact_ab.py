"""Impact A/B for the Fort Motte roof strike (35.13 s in the share): 3 s snippets (34.4-37.4 s) of the r14h mix (3D gun + 3D boom only) and the
same with one extra impact candidate on the strike; wavs + one mp4 with the video (labelled a / b / c / d in turn).
usage: python3 make_impact_ab.py MIX.wav SHARE.mp4 OUTDIR"""
import os, subprocess, sys, numpy as np, soundfile as sf
MIX, VID, OD = sys.argv[1:4]; R = "/home/user/battle-maps"; SR = 48000; T0, D, TS = 34.4, 3.0, 35.13
db = lambda x: 10 ** (x / 20)
def load(f, af=None, ss=0, t=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(ss), "-i", f] + (["-t", str(t)] if t else []) + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2)
def onset(x): e = np.abs(x).mean(1); return int(np.argmax(e > 0.1 * e.max()))
def rms(x): return 10 * np.log10(np.mean(x ** 2) + 1e-12)
base = load(MIX, ss=T0, t=D); boom = load(f"{R}/goosegreen/assets/media/sfx/candidates/cand2_hit.wav", t=1.0)
CANDS = [("b", "bomb6 'Blasts with Short Decay' (craigsmith / USC Cinema, CC0 1.0; grant/assets/media/sfx/candidates/bombs/), first blast, highpass 250 Hz: a sharp crack",
          load(f"{R}/grant/assets/media/sfx/candidates/bombs/bomb6_blastsshortdecayusccinema.mp3", "highpass=f=250,afade=t=out:st=0.5:d=0.6", 0, 1.1)),
         ("c", "sfx_thud.wav (our own synthesized low thump + click, belisarius/assets/audio/CREDITS.md): a heavy wooden thud",
          load(f"{R}/belisarius/assets/audio/sfx_thud.wav")),
         ("d", "cand4_hit 'Distant explosions' (Kostrava, CC0; goosegreen/assets/media/sfx/candidates/), 1 s, lowpass 1.2 kHz: an earthy hit",
          load(f"{R}/goosegreen/assets/media/sfx/candidates/cand4_hit.wav", "lowpass=f=1200,afade=t=out:st=0.6:d=0.4", 0, 1.0))]
out = [("a", "cand2_hit boom only (the 3D-film boom, as in r14h)", base.copy())]
for k, lab, c in CANDS:
    y = base.copy(); o = onset(c); i0 = int((TS - T0) * SR) - o; js = int((TS - T0) * SR); c = c * db((rms(base[js:js + int(0.4 * SR)]) - 3) - rms(c[o:o + int(0.4 * SR)]))   # candidate 3 dB under the strike's first 0.4 s IN THE MIX
    m = min(len(c), len(y) - i0); y[i0:i0 + m] += c[:m]; out.append((k, "boom + " + lab, y))
os.makedirs(OD, exist_ok=True); names = []
for k, lab, y in out:
    f = f"{OD}/impact_{k}.wav"; sf.write("/tmp/_ab.wav", y, SR, subtype="FLOAT")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/_ab.wav", "-af", f"alimiter=limit={db(-2.2):.4f}:level=false", "-c:a", "pcm_s16le", f], check=True); names.append((k, lab, f))
os.remove("/tmp/_ab.wav")
FONT = f"{R}/marion/tools/Anton-Regular.ttf"; ins, fc = [], ""
for i, (k, lab, f) in enumerate(names):
    ins += ["-ss", str(T0), "-t", str(D), "-i", VID, "-i", f]
    fc += f"[{2 * i}:v]drawtext=fontfile={FONT}:text='{k.upper()}':x=40:y=980:fontsize=64:fontcolor=white:box=1:boxcolor=black@0.6[v{i}];"
fc += "".join(f"[v{i}][{2 * i + 1}:a]" for i in range(len(names))) + f"concat=n={len(names)}:v=1:a=1[v][a]"
subprocess.run(["ffmpeg", "-v", "error", "-y"] + ins + ["-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "23", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k", f"{OD}/impact_ab.mp4"], check=True)
with open(f"{OD}/README.md", "w") as fh:
    fh.write("# Impact A/B: the Fort Motte roof strike (share 35.13 s)\n\n3 s snippets (share 34.4-37.4 s: the 3D gun at 34.63, the strike at 35.13) of the r14h mix; "
             "`impact_ab.mp4` plays a, b, c, d in turn with the video (letter bottom-left). Each candidate sits 3 dB under the strike's first 0.4 s in the mix; peaks <= -2.2 dBFS.\n\n")
    for k, lab, f in names: fh.write(f"- **{k}** `{os.path.basename(f)}`: {lab}\n")
print("\n".join(f"{k}: {f}" for k, _, f in names), f"\n{OD}/impact_ab.mp4")
