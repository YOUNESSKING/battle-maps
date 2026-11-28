"""r20 opening seam (critic B: two plates / labels / markers + a doubled river in the 8.4-8.6 crossfade). The dive frames (dive_v6copy, its
own plaque / place label / wagons now fading out over 8.0-8.3 s, rendered with tools/frames18.mjs N0=234 N1=258 at 1280 x 720) are warped
onto r15's framing: per frame an affine fit (OpenCV ECC on blurred grey, 480 x 270) dive -> r15, eased in over 8.0-8.4 s (identity before),
then the r18 crossfade 8.4-8.6 (frames 252-257: weight of r15 = (f - 251) / 7). Writes OUTDIR/fNNNN.png for 234..257 (1920 x 1080).
usage: python3 opening_seam_r20.py DIVE_FRAMES_DIR R15.mp4 OUTDIR"""
import os, subprocess, sys, cv2, numpy as np
DV, R15, OUT = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
def r15(i):
    a = ["ffmpeg", "-v", "error", "-i", R15, "-vf", f"select=eq(n\\,{i})", "-vsync", "0", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"]
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.uint8).reshape(1080, 1920, 3)
ss = lambda a, b, x: (lambda k: k * k * (3 - 2 * k))(min(1, max(0, (x - a) / (b - a))))
g = lambda im: cv2.GaussianBlur(cv2.cvtColor(cv2.resize(im, (480, 270), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY), (0, 0), 2).astype(np.float32)
mask = np.full((270, 480), 255, np.uint8); mask[:45, :120] = 0   # the plaque corner out of the fit
for f in range(234, 258):
    t = f / 30; d = cv2.resize(cv2.imread(f"{DV}/f{f:04d}.jpg"), (1920, 1080), interpolation=cv2.INTER_LANCZOS4); r = r15(f)
    M = np.eye(2, 3, dtype=np.float32)
    try: _, M = cv2.findTransformECC(g(r), g(d), M, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), mask, 5)
    except cv2.error as e: print(f, "ECC failed", e)
    M[:, 2] *= 4; w = ss(8.0, 8.4, t); Mw = (1 - w) * np.eye(2, 3, dtype=np.float32) + w * M   # 480 -> 1920 px translation
    dw = cv2.warpAffine(d, Mw, (1920, 1080), flags=cv2.INTER_LANCZOS4 | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT)
    a = (f - 251) / 7 if f >= 252 else 0; out = np.clip((1 - a) * dw.astype(float) + a * r.astype(float), 0, 255).astype(np.uint8)
    e0, e1 = np.abs(g(d) - g(r)).mean(), np.abs(g(dw) - g(r)).mean()
    print(f, f"w {w:.2f} scale {np.sqrt(abs(np.linalg.det(M[:, :2]))):.4f} shift ({M[0, 2]:+.1f},{M[1, 2]:+.1f}) px   grey diff vs r15: raw {e0:.1f} -> warped {e1:.1f}")
    cv2.imwrite(f"{OUT}/f{f:04d}.png", out)
