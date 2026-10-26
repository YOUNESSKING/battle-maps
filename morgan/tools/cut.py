"""Shorten the video WITHOUT re-recording or re-rendering: drop whole sentences / paragraphs from picture + voice together.

usage (from morgan/, after `python3 tools/assemble.py --v5`):  python3 tools/cut.py
Writes audio/timing_cut.json (the new timeline: removed paragraphs gone, kept sentences shifted), audio/voice_cut.wav and
build/picture_cut.mp4. Then: CUT=1 python3 tools/make_music_bed.py && CUT=1 python3 tools/mix.py (music, SFX, chapters follow).
Owner 2026-10-21: "the introduction was way too long" -> intro 2:20 -> ~1:40.
"""
import json, os, subprocess
import numpy as np, soundfile as sf

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
T = json.load(open("audio/timing.json"))
P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
idx = {key(p): i for i, p in enumerate(P) if p["tag"].startswith("MAP")}
start = lambda i: P[i]["start"] if i < len(P) else T["duration"]
A01 = next(i for i, p in enumerate(P) if p["tag"].startswith("ARCHIVE"))  # first archive paragraph = Tarleton portrait
h2, h3 = P[idx["hook-2"]], P[idx["hook-3"]]
CUTS = [  # [t0, t1) on the original timeline
    (start(A01), start(A01 + 1)),                 # the Tarleton portrait paragraph, whole
    (h2["sents"][1][1], h2["sents"][2][1]),       # "He had almost no formal education."
    (h2["sents"][4][1], h3["start"]),             # "He liked to say the British still owed him one."
    (h3["sents"][1][1], h3["sents"][2][1]),       # "And yet the battle plan he drew up that January is still studied ..."
]
CUTS.sort()
removed = sum(b - a for a, b in CUTS)


def remap(t):
    """original time -> new time (None if t falls inside a cut)"""
    shift = 0.0
    for a, b in CUTS:
        if t >= b:
            shift += b - a
        elif t >= a:
            return None
    return round(t - shift, 3)


# 1) new timeline
paras = []
for i, p in enumerate(P):
    if remap(p["start"]) is None and remap(p["end"] - 0.01) is None:
        continue
    q = dict(p)
    q["sents"] = [[c, remap(a), remap(b - 0.001)] for c, a, b in p["sents"] if remap(a) is not None]
    q["start"], q["end"] = q["sents"][0][1], q["sents"][-1][2]
    paras.append(q)
json.dump({**T, "duration": round(T["duration"] - removed, 2), "paragraphs": paras, "cuts": CUTS},
          open("audio/timing_cut.json", "w"), indent=1)

# 2) voice: keep the gaps between cuts, 10 ms fades at every join
v, sr = sf.read("audio/voice.wav", dtype="float32")
keep, t = [], 0.0
for a, b in CUTS + [(T["duration"], T["duration"])]:
    keep.append((t, a)); t = b
parts = []
for a, b in keep:
    seg = v[int(a * sr):int(b * sr)].copy()
    n = min(int(0.01 * sr), len(seg) // 2)
    if n:
        seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n)
    parts.append(seg)
sf.write("audio/voice_cut.wav", np.concatenate(parts), sr)

# 3) picture: concat the assembled segments, dropping / trimming the cut ranges (only segments that contain a cut are re-encoded)
segs = [l.split("'")[1] for l in open("build/seg/list.txt") if l.strip()]
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
out, pos = [], 0.0
os.makedirs("build/cut", exist_ok=True)
for n, sg in enumerate(segs):
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", sg],
                             capture_output=True, text=True).stdout)
    s0, s1 = pos, pos + d; pos = s1
    inside = [(max(a, s0), min(b, s1)) for a, b in CUTS if a < s1 - 0.01 and b > s0 + 0.01]
    if not inside:
        out.append(sg); continue
    if inside[0][0] <= s0 + 0.05 and inside[-1][1] >= s1 - 0.05 and len(inside) == 1:
        continue  # whole segment cut
    k, t = 0, s0
    for a, b in inside + [(s1, s1)]:
        if a - t > 0.04:
            p = f"build/cut/{n:02d}_{k}.mp4"; k += 1
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t - s0:.3f}", "-i", sg, "-t", f"{a - t:.3f}", *ENC, p], check=True)
            out.append(os.path.abspath(p))
        t = b
open("build/cut/list.txt", "w").write("".join(f"file '{p}'\n" for p in out))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/cut/list.txt", "-c", "copy", "build/picture_cut.mp4"], check=True)
print(f"removed {removed:.1f} s -> {T['duration'] - removed:.1f} s; cuts: {[(round(a, 1), round(b, 1)) for a, b in CUTS]}")
