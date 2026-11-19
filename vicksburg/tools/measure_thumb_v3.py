"""Re-measure the two critics' numbers (critic_MAIN.md / critic_ALT.md, 2026-11-19) on any thumbnail.
usage: python3 tools/measure_thumb_v3.py main <img> [...]   |   python3 tools/measure_thumb_v3.py alt <img> [...]
MAIN metrics (1280x720; BF = battlefield x<780, y<520; Lab L 0-100, HSV S 0-100):
  L/sd whole frame; BF S, R-B, b*, L; top-15% bright window (300x60 with >=90% px L>58); fire / blue-block / red-block % of BF;
  right column (x>=1200) L.
ALT metrics: grey mean (0-255), HSV S mean (0-255), light-blue arrow area %, warm accent % + centroid x."""
import sys, numpy as np, cv2
from PIL import Image

def load(p):
    im = Image.open(p).convert("RGB")
    if im.size != (1280, 720): im = im.resize((1280, 720), Image.LANCZOS)
    return np.array(im)

def lab(a): return cv2.cvtColor(a, cv2.COLOR_RGB2LAB).astype(np.float32)

def main_metrics(a):
    L = lab(a)[..., 0] * 100 / 255; bstar = lab(a)[..., 2] - 128
    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV).astype(np.float32); S = hsv[..., 1] * 100 / 255
    r, g, b = [a[..., i].astype(np.float32) for i in range(3)]
    bf = (slice(0, 520), slice(0, 780)); n = 520 * 780
    fire = ((r > 235) & (g > 100) & (g < 210) & (b < 100))[bf].sum() / n * 100          # hot flame core
    blue = ((b > r + 35) & (b > g + 15) & (b > 70) & (hsv[..., 1] > 90))[bf].sum() / n * 100
    red = ((r > 100) & (r - g > 80) & (r - b > 70) & (g < 75))[bf].sum() / n * 100
    top = (L[:108] > 58).astype(np.float32); ii = cv2.integral(top)
    win = (ii[60:, 300:] - ii[:-60, 300:] - ii[60:, :-300] + ii[:-60, :-300]) / (300 * 60)
    return dict(L=L.mean(), Lsd=L.std(), BF_S=S[bf].mean(), BF_RB=(r - b)[bf].mean(), BF_bstar=bstar[bf].mean(), BF_L=L[bf].mean(),
                top_bright_win=float(win.max()), fire=fire, blue=blue, red=red, rightcol_L=L[:, 1200:].mean())

def alt_metrics(a):
    grey = cv2.cvtColor(a, cv2.COLOR_RGB2GRAY).astype(np.float32); hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
    r, g, b = [a[..., i].astype(np.int32) for i in range(3)]
    arrow = (b > 225) & (g > 160) & (g < 225) & (r > 85) & (r < 175)
    warm = (r > 150) & (r - b > 80) & (g < r - 25) & (g > 0.42 * r); warm[:, :420] = False   # outside the portrait zone
    ys, xs = np.nonzero(warm)
    return dict(grey=grey.mean(), sat=hsv[..., 1].mean(), arrow=arrow.mean() * 100, warm=warm.mean() * 100, warm_cx=xs.mean() if len(xs) else -1)

if __name__ == "__main__":
    mode = sys.argv[1]; f = main_metrics if mode == "main" else alt_metrics
    for p in sys.argv[2:]:
        m = f(load(p)); print(p.split("/")[-1][:44].ljust(44), "  ".join(f"{k}={v:.2f}" for k, v in m.items()))
