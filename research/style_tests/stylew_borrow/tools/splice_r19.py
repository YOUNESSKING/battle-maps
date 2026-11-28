"""r19 share: the r18 share with the --smoke3d windows spliced in (frame-exact, 30 fps), r18's audio stream-copied.
  share 405-525  = the new hook-a render (13.5-17.8 s, frame f -> hook f - 405)
  share 526-533  = the hook -> hook-b crossfade, recomposed: r18 + (1 - k/8) x (new hook - old hook), k = f - 526 (ffmpeg xfade fade weights;
                   old hook = the locked build rendered on the same pod, hook-a0 17.5-17.8 s)
  share 740-2301 = new m3d (40.0-54.6) xfaded (0.266667 s at 14.333 s, as finalize_xf5.sh) into new m3f (3.26-41.26) = DC.mp4 frame f - 732
                   (share 732-739 = the hook-b2 -> m3d crossfade, before the cannon: kept from r18)
usage: python3 splice_r19.py R18.mp4 PODDIR OUT.mp4"""
import subprocess, sys, numpy as np
R18, PD, OUT = sys.argv[1:4]; W, H = 1920, 1080; N = W * H * 3
def rd(f): return subprocess.Popen(["ffmpeg", "-v", "error", "-i", f, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
def nxt(p): b = p.stdout.read(N); return np.frombuffer(b, np.uint8).reshape(H, W, 3) if len(b) == N else None
r, ha, h0, dc = rd(R18), rd(f"{PD}/test-bw-hook-a.mp4"), rd(f"{PD}/test-bw-hook-a0.mp4"), rd(f"{PD}/DC.mp4")
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", "30", "-i", "-", "-i", R18, "-map", "0:v", "-map", "1:a",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", "3200k", "-bufsize", "6400k", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
f = 0
while True:
    a = nxt(r)
    if a is None: break
    if 405 <= f <= 533: b = nxt(ha)
    if 525 <= f <= 533: o = nxt(h0)
    if f >= 732: c = nxt(dc)
    if 405 <= f <= 525: out = b
    elif 526 <= f <= 533: k = f - 526; out = np.clip(a.astype(np.int16) + (1 - k / 8) * (b.astype(np.int16) - o.astype(np.int16)), 0, 255).astype(np.uint8)
    elif f >= 740: out = c
    else: out = a
    enc.stdin.write(np.ascontiguousarray(out).tobytes()); f += 1
enc.stdin.close(); enc.wait(); print("frames", f)
