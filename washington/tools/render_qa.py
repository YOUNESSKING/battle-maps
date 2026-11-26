"""Render QA: reject scene renders with flat / blank frames (a faulty GPU pod once drew grey ellipses over 54-68 % of frames, round 4).
Samples 2 fps, measures the luma std-dev of the centre 50 % crop; a frame with std < 4 is "flat". FAIL if > 1 % of sampled frames are flat.
usage: python3 washington/tools/render_qa.py RENDER_DIR [S01 S02 ...]"""
import subprocess, sys, numpy as np
RD = sys.argv[1]; SC = sys.argv[2:] or [f"S0{i}" for i in range(1, 9)]
bad = 0
for s in SC:
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{RD}/{s}.mp4", "-vf", "fps=2,crop=iw/2:ih/2,scale=160:90,format=gray", "-f", "rawvideo", "-"], capture_output=True)
    f = np.frombuffer(r.stdout, np.uint8).reshape(-1, 90, 160).astype(np.float32)
    flat = (f.std(axis=(1, 2)) < 4).mean() if len(f) else 1.0
    ok = flat <= 0.01; bad += not ok
    print(f"{s}: {len(f)} frames, flat {flat * 100:.1f} % -> {'OK' if ok else 'FAIL'}")
sys.exit(1 if bad else 0)
