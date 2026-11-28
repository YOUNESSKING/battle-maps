"""r21 opening seam (critics on r20: (a) a framing jump at ~8.25 s, (b) the date plate vanished for ~0.3 s).
(a) The dive frames are warped onto the 2D scene's framing (per-frame ECC affine fit dive -> scene for frames >= FIT0, before that the fit of
    FIT0 held), eased in over 7.0-8.4 s (r20: 8.0-8.4 s; its ~30 px correction in 0.33 s reversed the camera's vertical motion).
(b) The scene's plate (its HUD pixels, the plate box from the scene frame at 8.6 s, feathered 3 px) is laid over the dive frames with alpha
    rising over 8.0-8.3 s while the dive page fades its own plaque over the same 8.0-8.3 s: a plate is on screen the whole time.
Then the 8.4-8.6 crossfade (frames 252-257: weight of the scene = (f - 251) / 7). Scene frames = the new hook-a render (SCENE_FRAMES/fNNNN.png
or an mp4 whose frame 0 = share frame S0). Writes OUTDIR/fNNNN.png for 210..257.
usage: python3 opening_seam_r21.py DIVE_FRAMES_DIR SCENE.mp4 S0 OUTDIR"""
import os, subprocess, sys, cv2, numpy as np
DV, SC, S0, OUT = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]; os.makedirs(OUT, exist_ok=True); F0, F1, FIT0 = 210, 257, 244   # fits before ~8.1 s are unreliable (the dive is still far from the 2D framing)
def scene(i):
    a = ["ffmpeg", "-v", "error", "-i", SC, "-vf", f"select=eq(n\\,{i - S0})", "-vsync", "0", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"]
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.uint8).reshape(1080, 1920, 3)
ss = lambda a, b, x: (lambda k: k * k * (3 - 2 * k))(min(1, max(0, (x - a) / (b - a))))
g = lambda im: cv2.GaussianBlur(cv2.cvtColor(cv2.resize(im, (480, 270), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY), (0, 0), 2).astype(np.float32)
mask = np.full((270, 480), 255, np.uint8); mask[:45, :120] = 0
dive = lambda f: cv2.resize(cv2.imread(f"{DV}/f{f:04d}.jpg"), (1920, 1080), interpolation=cv2.INTER_LANCZOS4)
# the scene's plate: the cream box top-left of the frame at 8.6 s
ref = scene(258); b, gch, r = [ref[..., k].astype(int) for k in range(3)]; pm = (r > 195) & (gch > 185) & (b > 150); pm[300:] = False; pm[:, 500:] = False
ys, xs = np.nonzero(pm); y0, y1, x0, x1 = ys.min() - 3, ys.max() + 4, xs.min() - 3, xs.max() + 4
PA = np.zeros((1080, 1920), np.float32); PA[y0:y1, x0:x1] = 1; PA = cv2.GaussianBlur(PA, (0, 0), 1.5); print("plate box", x0, y0, x1, y1)
fits = {}
for f in range(FIT0, F1 + 1):
    M = np.eye(2, 3, dtype=np.float32)
    _, M = cv2.findTransformECC(g(scene(f)), g(dive(f)), M, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), mask, 5); M[:, 2] *= 4; fits[f] = M
for f in range(F0, F1 + 1):
    t = f / 30; d = dive(f); M = fits[max(f, FIT0)]; w = ss(7.0, 8.4, t); Mw = (1 - w) * np.eye(2, 3, dtype=np.float32) + w * M
    out = cv2.warpAffine(d, Mw, (1920, 1080), flags=cv2.INTER_LANCZOS4 | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REFLECT).astype(float)
    r = scene(f) if f >= 240 else None
    if r is not None: pa = PA * ss(8.0, 8.3, t); out = out * (1 - pa[..., None]) + r.astype(float) * pa[..., None]   # the scene's plate dissolves in
    if f >= 252: a = (f - 251) / 7; out = (1 - a) * out + a * r.astype(float)
    cv2.imwrite(f"{OUT}/f{f:04d}.png", np.clip(out, 0, 255).astype(np.uint8))
    print(f, f"w {w:.2f} shift ({Mw[0, 2]:+.1f},{Mw[1, 2]:+.1f})")
