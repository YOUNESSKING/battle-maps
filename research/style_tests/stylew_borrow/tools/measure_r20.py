"""r20 smoke numbers, each still against the smoke-free reference at the same time (build --var smoke3dhide=1):
  house contrast = std of luma (0-255) in the ~150 x 110 house crop (found from the cream walls in the reference), and its loss vs the reference
  box visibility = mean chroma (max - min RGB) of each blue / red box's reference pixels now / in the reference (min over the boxes)
  haze offset    = centroid y of |frame - reference| (boxes excluded) minus the blue boxes' centre y (+ = in front, toward the road), px
usage: python3 measure_r20.py KIND(m3d|m3f) REFDIR LABEL=SRC:OFFSET ...   SRC = a snapshot dir (OFFSET 0) or a share mp4 (OFFSET = share - scene)"""
import glob, io, re, subprocess, sys, numpy as np
from PIL import Image
from scipy import ndimage
KIND, REF = sys.argv[1:3]
def snaps(d): return {round(float(re.search(r"at-([\d.]+)s", f).group(1)), 3): f for f in glob.glob(f"{d}/frame-*-at-*s.png")}
def img(src, off, t):
    if src.endswith(".mp4"):
        png = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t + off:.4f}", "-i", src, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
        im = Image.open(io.BytesIO(png)).convert("RGB")
    else: im = Image.open(snaps(src)[round(t, 3)]).convert("RGB")
    return np.asarray(im.resize((1920, 1080))).astype(float)
R = snaps(REF); lum = lambda a: a @ np.array([0.299, 0.587, 0.114]); chroma = lambda a: a.max(2) - a.min(2)
def boxes(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    out = []
    for m, nm in (((b > 150) & (b - r > 60), "blue"), ((r > 150) & (r - b > 70) & (r - g > 70), "red")):
        lb, n = ndimage.label(m)
        for i in range(1, n + 1):
            s = lb == i
            if s.sum() > 300: out.append((nm, s))
    return out
def house(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; m = (r > 200) & (g > 190) & (b > 150) & (r - b < 70); m[:300] = False; m[700:] = False; m[:, :700] = False; m[:, 1200:] = False
    lb, n = ndimage.label(m); s = max(range(1, n + 1), key=lambda i: (lb == i).sum()); ys, xs = np.nonzero(lb == s); cx, cy = int(xs.mean()), int(ys.mean())
    return (cy - 55, cy + 55, cx - 75, cx + 75)
for arg in sys.argv[3:]:
    lab, sp = arg.split("=", 1); src, off = sp.rsplit(":", 1); off = float(off)
    for t in sorted(R):
        ref = np.asarray(Image.open(R[t]).convert("RGB").resize((1920, 1080))).astype(float); a = img(src, off, t)
        if KIND == "m3d":
            y0, y1, x0, x1 = house(ref); c0, c1 = lum(ref[y0:y1, x0:x1]).std(), lum(a[y0:y1, x0:x1]).std()
            print(f"{lab} t={t:.3f}: house contrast {c1:.1f} (ref {c0:.1f}, loss {100 * (1 - c1 / c0):.0f} %)")
        else:
            bx = boxes(ref); vis = [(nm, chroma(a)[s].mean() / chroma(ref)[s].mean()) for nm, s in bx]
            bm = np.zeros(ref.shape[:2], bool)
            for _, s in bx: bm |= ndimage.binary_dilation(s, iterations=6)
            d = np.abs(lum(a) - lum(ref)); d[bm] = 0; by = np.mean([np.nonzero(s)[0].mean() for nm, s in bx if nm == "blue"]) if any(nm == "blue" for nm, _ in bx) else np.nan
            ys = np.nonzero(d > 6)[0]; w = d[d > 6]; cy = (ys * w).sum() / w.sum() if len(ys) else np.nan
            vb = min([v for nm, v in vis if nm == "blue"] or [np.nan]); vr = min([v for nm, v in vis if nm == "red"] or [np.nan])
            print(f"{lab} t={t:.3f}: min box visibility blue {100 * vb:.0f} % red {100 * vr:.0f} %   haze centroid {cy - by:+.0f} px from the blue line   smoke px {len(ys)}")
