"""Impact A/B for the Fort Motte roof strike (share 35.13 s). Each variant is a full make_test_audio.py run of the Fort Motte window
(ONLY=test-bw-m3d, the extra impact inside the pre-limited cannon stem via IMPACT=...), so it sounds exactly as the final would.
Snippet = share 34.4-37.4 s (= 10.0-13.0 s into the window), the four loudness-matched (-16 LUFS) so only the timbre differs; wavs + one mp4.
usage: python3 make_impact_ab.py SHARE.mp4 OUTDIR a=ab_a.wav:LABEL b=... """
import os, re, subprocess, sys
VID, OD = sys.argv[1:3]; ITEMS = [a.split("=", 1) for a in sys.argv[3:]]; R = "/home/user/battle-maps"; T0, D, W0 = 34.4, 3.0, 10.0
def lufs(f):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", f, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr; return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
os.makedirs(OD, exist_ok=True); names = []
for k, spec in ITEMS:
    src, lab = spec.split(":", 1); f = f"{OD}/impact_{k}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(W0), "-t", str(D), "-i", src, "-c:a", "pcm_f32le", "/tmp/_ab.wav"], check=True); g = -16.0 - lufs("/tmp/_ab.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/_ab.wav", "-af", f"volume={g:.2f}dB,alimiter=limit=0.776:level=false", "-c:a", "pcm_s16le", f], check=True)
    names.append((k, lab, f)); print(k, f"{lufs(f):.1f} LUFS")
os.remove("/tmp/_ab.wav"); FONT = f"{R}/marion/tools/Anton-Regular.ttf"; ins, fc = [], ""
for i, (k, lab, f) in enumerate(names):
    ins += ["-ss", str(T0), "-t", str(D), "-i", VID, "-i", f]
    fc += f"[{2 * i}:v]drawtext=fontfile={FONT}:text='{k.upper()}':x=40:y=980:fontsize=64:fontcolor=white:box=1:boxcolor=black@0.6[v{i}];"
fc += "".join(f"[v{i}][{2 * i + 1}:a]" for i in range(len(names))) + f"concat=n={len(names)}:v=1:a=1[v][a]"
subprocess.run(["ffmpeg", "-v", "error", "-y"] + ins + ["-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "23", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k", f"{OD}/impact_ab.mp4"], check=True)
with open(f"{OD}/README.md", "w") as fh:
    fh.write("# Impact A/B: the Fort Motte roof strike (share 35.13 s)\n\nEach variant is a full mix of the Fort Motte window with the extra impact inside the pre-limited cannon stem "
             "(as the final would sound), cut to share 34.4-37.4 s (the 3D gun at 34.63, the strike at 35.13) and loudness-matched to -16 LUFS so only the timbre differs. "
             "`impact_ab.mp4` plays a, b, c, d in turn with the video (letter bottom-left).\n\n")
    for k, lab, f in names: fh.write(f"- **{k}** `{os.path.basename(f)}`: {lab}\n")
