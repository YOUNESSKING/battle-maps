"""Join archive placeholder cards + rendered map scenes + narration into one test video."""
import json, subprocess, os
T = json.load(open("audio/timing.json"))["paragraphs"]
END_IDX = next(i for i, p in enumerate(T) if p["tag"].startswith("MAP: trasimene-1"))  # test stops before move 2
starts = [0.0] + [p["start"] for p in T[1:END_IDX]] + [T[END_IDX]["start"]]
scenes = {"hook-march": "scenes/hook-march/renders/hook-march.mp4", "trebia-1": "scenes/trebia/renders/trebia.mp4"}
os.makedirs("build/seg", exist_ok=True)
segs, i = [], 0
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
while i < END_IDX:
    key = T[i]["tag"].split("|")[0].replace("MAP:", "").strip()
    if T[i]["tag"].startswith("ARCHIVE"):
        dur = starts[i + 1] - starts[i]
        out = f"build/seg/{i:02d}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", f"build/cards/p{i:02d}.png", "-t", f"{dur:.3f}", *enc, out], check=True)
        segs.append(out); i += 1
    else:
        src = scenes[key]
        j = i
        while j < END_IDX and not T[j]["tag"].startswith("ARCHIVE"):
            j += 1
        dur = starts[j] - starts[i]
        out = f"build/seg/{i:02d}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-t", f"{dur:.3f}", "-vf", "tpad=stop_mode=clone:stop_duration=2", "-t", f"{dur:.3f}", *enc, out], check=True)
        segs.append(out); i = j
open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
total = starts[END_IDX]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-i", "audio/voice.wav",
                "-t", f"{total:.3f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-map", "0:v", "-map", "1:a", "build/test-hook-trebia.mp4"], check=True)
print("wrote build/test-hook-trebia.mp4", round(total, 1), "s")
