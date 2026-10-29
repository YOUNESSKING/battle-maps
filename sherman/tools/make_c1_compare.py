"""Side-by-side test clip: CURRENT (left) vs C1 lifted Frontlines + keylines (right), 3 segments, with the master's audio.
run from sherman/: python3 tools/make_c1_compare.py -> build/test-c1-compare.mp4"""
import subprocess
F = "tools/oswald-latin-700-normal.ttf"
SEG = [("hook-a", "test-c1-wide", 0, 20, 0.0, "WIDE MAP (hook)"), ("move1b", "test-c1-day", 8, 20, 168.52, "DAY CLOSE-UP (Rocky Face Ridge)"),
       ("move2d", "test-c1-night", 33, 18, 646.5, "NIGHT (Savannah, Hardee escapes)")]
parts = []
for i, (cur, test, ss, d, a0, title) in enumerate(SEG):
    out = f"build/c1seg{i}.mp4"
    txt = lambda s, x: f"drawtext=fontfile={F}:text='{s}':x={x}:y=40:fontsize=40:fontcolor=white"
    fc = (f"[0:v]scale=960:540,setsar=1[a];[1:v]scale=960:540,setsar=1[b];[a][b]hstack=2[h];"
          f"[h]pad=1920:1080:0:270:color=0x141619,{txt('CURRENT', 380)},{txt('TEST  C1 lifted + keylines', 1180)},"
          f"drawtext=fontfile={F}:text='{title}':x=(w-tw)/2:y=900:fontsize=44:fontcolor=0xffd25a[v]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-t", str(d), "-i", f"scenes/{cur}/renders/{cur}.mp4",
                    "-ss", str(ss), "-t", str(d), "-i", f"scenes/{test}/renders/{test}.mp4", "-ss", str(a0), "-t", str(d), "-i", "build/sherman.mp4",
                    "-filter_complex", fc, "-map", "[v]", "-map", "2:a", "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-r", "30",
                    "-c:a", "aac", "-b:a", "160k", out], check=True)
    parts.append(out)
open("build/c1list.txt", "w").write("".join(f"file '{p.split('/')[-1]}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/c1list.txt", "-c", "copy", "build/test-c1-compare.mp4"], check=True)
print("build/test-c1-compare.mp4")
