"""stills.jpg (4 frames of demo.mp4, 2x2) + compare.jpg (our frame | matching Grand Maneuver reference frame, one pair per row).
The GM frames are read in place from /home/user/gm_ref/f2s (never copied into the repo); compare.jpg is git-ignored for that reason.
usage: python3 make_stills.py"""
import os, subprocess
import numpy as np, cv2

HERE = os.path.dirname(os.path.abspath(__file__)); TMP = "/tmp/gm3d_stills"; os.makedirs(TMP, exist_ok=True)
TIMES = [1.0, 4.0, 7.0, 9.5]
GM = {1.0: "f_0161.jpg", 4.0: "f_0306.jpg", 7.0: "f_0321.jpg", 9.5: "f_0336.jpg"}   # strategic relief, regional woods, battle fields x2
CAP = {1.0: "wide drift (tilt 44)", 4.0: "wide, Vicksburg - Big Black", 7.0: "close, after the dive (tilt 30)", 9.5: "close, bridge burnt (tilt 29)"}

def frame(t):
    p = f"{TMP}/f_{t:.1f}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f"{HERE}/demo.mp4", "-frames:v", "1", p], check=True)
    return cv2.imread(p)

def label(im, txt):
    cv2.rectangle(im, (0, 0), (len(txt) * 13 + 20, 34), (20, 20, 20), -1)
    cv2.putText(im, txt, (10, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (240, 240, 240), 1, cv2.LINE_AA); return im

ours = {t: frame(t) for t in TIMES}
tiles = [label(cv2.resize(ours[t], (960, 540), interpolation=cv2.INTER_AREA), f"{t:.1f}s  {CAP[t]}") for t in TIMES]
cv2.imwrite(f"{HERE}/stills.jpg", np.vstack([np.hstack(tiles[:2]), np.hstack(tiles[2:])]), [cv2.IMWRITE_JPEG_QUALITY, 88])
rows = []
for t in TIMES:
    g = cv2.imread(f"/home/user/gm_ref/f2s/{GM[t]}")
    if g is None: continue
    rows.append(np.hstack([label(cv2.resize(ours[t], (960, 540), interpolation=cv2.INTER_AREA), f"GM3D {t:.1f}s"),
                           label(cv2.resize(g, (960, 540), interpolation=cv2.INTER_AREA), f"Grand Maneuver {GM[t]}")]))
if rows: cv2.imwrite(f"{HERE}/compare.jpg", np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 85])
print("stills.jpg", "compare.jpg" if rows else "(no GM frames)")
