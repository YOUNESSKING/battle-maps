"""r21 share: the r18 share (frame-exact, 30 fps) with r18's audio stream-copied and
  share 210-257  = the opening seam frames (opening_seam_r21.py: OPENDIR/fNNNN.png)
  share 258-525  = the new hook-a render (8.0-17.8 s: hook frame = share frame - 240)
  share 526-533  = the hook -> hook-b crossfade recomposed: r18 + (1 - k/8) x (new hook - old hook), k = f - 526 (old hook = hook-a0, 17.5-17.8 s)
  share 740-2301 = new m3d xfaded into new m3f (PODDIR/DC.mp4: share frame - 732); 534-739 kept from r18 (no smoke there)
usage: python3 splice_r21.py R18.mp4 PODDIR OPENDIR OUT.mp4"""
import subprocess, sys, numpy as np
from PIL import Image
R18, PD, OPD, OUT = sys.argv[1:5]; W, H = 1920, 1080; N = W * H * 3
def rd(f): return subprocess.Popen(["ffmpeg", "-v", "error", "-i", f, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
def nxt(p): b = p.stdout.read(N); return np.frombuffer(b, np.uint8).reshape(H, W, 3) if len(b) == N else None
r, ha, h0, dc = rd(R18), rd(f"{PD}/test-bw-hook-a.mp4"), rd(f"{PD}/test-bw-hook-a0.mp4"), rd(f"{PD}/DC.mp4")
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-i", R18, "-map", "0:v", "-map", "1:a",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", "3200k", "-bufsize", "6400k", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
f = 0
while True:
    a = nxt(r)
    if a is None: break
    if 240 <= f <= 533: b = nxt(ha)
    if 525 <= f <= 533: o = nxt(h0)
    if f >= 732: c = nxt(dc)
    if 210 <= f <= 257: out = np.asarray(Image.open(f"{OPD}/f{f:04d}.png").convert("RGB"))
    elif 258 <= f <= 525: out = b
    elif 526 <= f <= 533: k = f - 526; out = np.clip(a.astype(np.int16) + (1 - k / 8) * (b.astype(np.int16) - o.astype(np.int16)), 0, 255).astype(np.uint8)
    elif f >= 740: out = c
    else: out = a
    enc.stdin.write(np.ascontiguousarray(out).tobytes()); f += 1
enc.stdin.close(); enc.wait(); print("frames", f)
