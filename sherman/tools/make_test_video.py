# Owner test videos (2026-10-29): stitch windows of rendered test-* scenes with the master's audio at the same moment + a label.
# Usage: python3 tools/make_test_video.py AC   -> build/test-video-AC.mp4
#        python3 tools/make_test_video.py F    -> build/test-video-F.mp4
import json, os, subprocess, sys
MASTER = "build/sherman.mp4"; FONT = "tools/oswald-latin-700-normal.ttf"
SETS = {
 "AC": [("C1 · the first-second stamp states the stakes", "test-C1-stamp", 0, 9),
        ("C2 · hook: one big text block at a time", "test-C2-onetext", 11, 22),
        ("A1 + A2 · bigger units and bigger labels", "test-A2-labels", 5, 20),
        ("A1 + A2 · bigger units and bigger labels", "test-A2-labels", 38, 14),
        ("A4 · lighter Confederate red", "test-A4-red", 0, 14),
        ("B3 · decision card keeps moving + black outline", "test-B3-decide", 10, 18),
        ("B1 · March to the Sea: no red fill", "test-B1-march", 45, 18),
        ("B1 · March to the Sea: no red fill", "test-B1-march", 95, 16),
        ("B2 · wider overview of the South", "test-B2-frame", 0, 22),
        ("C3 · room for the YouTube end screen", "test-C3-endscreen", 18, 26)],
 "F": [("F1 · Union coloured, Confederate plain", "test-F1-ref", 0, 20),
       ("F1 · Union coloured, Confederate plain", "test-F1-ref", 98, 12),
       ("F2 · Confederate coloured, Union plain", "test-F2-ref", 0, 20),
       ("F2 · Confederate coloured, Union plain", "test-F2-ref", 98, 12)],
}
key = sys.argv[1]; os.makedirs("build/tv", exist_ok=True); parts = []
for i, (lab, sc, t, d) in enumerate(SETS[key]):
    abs0 = json.loads(open(f"scenes/{sc}/timing.js").read().split("=", 1)[1].rstrip().rstrip(";"))["abs_start"]
    vid = f"scenes/{sc}/renders/{sc}.mp4"; out = f"build/tv/{key}{i:02d}.mp4"
    lab_e = lab.replace(":", "\\:").replace("'", "")
    vf = (f"drawbox=x=30:y=h-150:w=iw*0.62:h=80:color=black@0.72:t=fill,"
          f"drawtext=fontfile={FONT}:text='TEST {lab_e}':x=50:y=h-135:fontsize=46:fontcolor=0xFFD25A")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-t", str(d), "-i", vid, "-ss", str(abs0 + t), "-t", str(d), "-i", MASTER,
                    "-map", "0:v", "-map", "1:a", "-vf", vf, "-af", "afade=in:d=0.3,afade=out:st=%g:d=0.4" % (d - 0.4),
                    "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", out], check=True)
    parts.append(out)
open("build/tv/list.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", "build/tv/list.txt", "-c", "copy", f"build/test-video-{key}.mp4"], check=True)
print("build/test-video-%s.mp4" % key)
