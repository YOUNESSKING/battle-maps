"""r16b PAINTED CLOUDS (owner 2026-11-28: "the clouds should be suited for a 2D film"; coordinator r16 review: "cartoon clip-art, not painted
Style W"): soft translucent painted masses seen from above at an angle (matte-painting / Warhawk haze), no stickers. No photos, no AI images:
every sprite is made here from soft gaussian blobs + value noise.
  - density = a sum of soft blobs; the silhouette dissolves in a dry brush over ~20-40 px (wide feather + stroke noise), never a straight edge;
  - partial transparency: thin parts ~0.6, the thick core ~0.85 (wisps <= 0.6), so the map shows faintly through;
  - low-contrast painted shading from the upper left: lit (240,236,226) / mid (222,221,216) / cool shade (196,198,204), wide soft steps with
    brush-jittered boundaries; paper grain multiplied in;
  - kinds: p = puffy masses seen from above (6), w = long low stretched wisps (4), b = big bank masses (4, the bank + the wipe).
Out: marion/kit/paint_clouds/pc_<kind><i>.webp (RGBA), _s (soft half size, near the lens), _sh (shadow silhouette, RGBA alpha).
usage: python3 marion/tools/make_paint_clouds.py [OUTDIR]"""
import glob, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit", "paint_clouds")
os.makedirs(OUT, exist_ok=True)
for f in glob.glob(f"{OUT}/pc_*.webp"): os.remove(f)
TONES = np.array([[240, 236, 226], [222, 221, 216], [196, 198, 204]], float) / 255.0   # lit / mid / cool shade (low contrast)


def vnoise(rng, h, w, cell, octaves=3, aniso=(1.0, 1.0)):
    """value noise in [-1, 1]: random grids upsampled bicubic; aniso stretches the cells (brush strokes)"""
    acc, amp, tot = np.zeros((h, w)), 1.0, 0.0
    for o in range(octaves):
        cy, cx = max(2, int(h / (cell * aniso[0]) / 2 ** o) + 2), max(2, int(w / (cell * aniso[1]) / 2 ** o) + 2)
        g = rng.random((cy, cx)).astype(np.float32)
        acc += amp * (np.asarray(Image.fromarray(g, "F").resize((w, h), Image.BICUBIC)) * 2 - 1); tot += amp; amp *= 0.5
    return acc / tot


def smooth(e0, e1, x):
    k = np.clip((x - e0) / (e1 - e0), 0, 1); return k * k * (3 - 2 * k)


def mass(seed, W, H, kind):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    D = np.zeros((H, W))
    if kind == "w":   # a long low wisp: stretched blobs along a gently curved line
        n = 18 + int(rng.integers(0, 8)); bend = rng.uniform(-0.12, 0.12) * H
        for i in range(n):
            u = rng.uniform(-1, 1); x = W / 2 + u * W * 0.36; y = H / 2 + bend * (1 - u * u) + rng.normal(0, H * 0.07)
            sx, sy = W * rng.uniform(0.05, 0.10) * (1.1 - 0.5 * abs(u)), H * rng.uniform(0.07, 0.13) * (1.1 - 0.5 * abs(u))
            D += rng.uniform(0.5, 1.0) * np.exp(-((xx - x) ** 2 / (2 * sx * sx) + (yy - y) ** 2 / (2 * sy * sy)))
    else:             # p / b: soft lobes round an irregular ellipse, bigger + denser in the core, a few stray lobes
        n = (16 + int(rng.integers(0, 8))) if kind == "p" else (34 + int(rng.integers(0, 10)))
        ex, ey = (0.33, 0.30) if kind == "p" else (0.36, 0.33)
        for i in range(n):
            a, d = rng.uniform(0, 2 * np.pi), rng.random() ** 0.8
            x, y = W / 2 + np.cos(a) * d * W * ex, H / 2 + np.sin(a) * d * H * ey
            s = H * rng.uniform(0.06, 0.12) * (1.3 - 0.6 * d)
            D += rng.uniform(0.6, 1.0) * np.exp(-((xx - x) ** 2 + (yy - y) ** 2) / (2 * s * s))
    D /= np.percentile(D, 99.5)
    win = smooth(0, 0.12, np.minimum(np.minimum(xx, W - 1 - xx) / W, np.minimum(yy, H - 1 - yy) / H) * 2.2)   # never touches the border
    strokes = vnoise(rng, H, W, 40, 3, aniso=(0.65, 1.5)); fine = vnoise(rng, H, W, 6, 2)
    Dn = (D + 0.11 * strokes + 0.04 * fine) * win
    cov = smooth(0.12, 0.45, Dn)                                    # wide feather (~20-40 px at these blob sizes)
    core = smooth(0.45, 0.95, Dn)
    amax = 0.62 if kind == "w" else 0.85
    alpha = cov * (0.58 + (amax - 0.58) * core) if kind != "w" else cov * (0.40 + 0.22 * core)
    # dry brush: the thin outer band breaks into streaks
    band = 1 - smooth(0.25, 0.6, Dn)
    alpha *= 1 - 0.35 * band * smooth(-0.1, 0.5, vnoise(rng, H, W, 12, 2, aniso=(0.5, 1.8)))
    # shading: a soft height field lit from the upper left, low contrast, three wide soft steps
    hb = gaussian_filter(D, H * 0.012)
    gy, gx = np.gradient(hb * H * 0.5)
    nrm = np.dstack([-gx, -gy, np.ones_like(gx)]); nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    L = np.array([-0.55, -0.6, 0.58]); L /= np.linalg.norm(L)
    lam = np.clip(nrm @ L, 0, 1)
    val = 0.70 * lam + 0.30 * smooth(0.2, 0.9, D) - 0.10 + 0.05 * strokes + 0.04 * vnoise(rng, H, W, 50, 2)
    w = 0.07
    k1, k2 = smooth(0.62 - w, 0.62 + w, val), smooth(0.38 - w, 0.38 + w, val)
    col = TONES[2] * (1 - k2)[..., None] + TONES[1] * (k2 * (1 - k1))[..., None] + TONES[0] * k1[..., None]
    col = col * (1 + 0.03 * vnoise(rng, H, W, 1.6, 2) + 0.02 * vnoise(rng, H, W, 40, 3))[..., None]   # paper grain + wash mottling
    rgba = np.dstack([np.clip(col, 0, 1), np.clip(alpha, 0, 1)])
    im = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA")
    sh = np.zeros((H, W, 4)); sh[..., 3] = gaussian_filter(cov * win, H * 0.04)   # shadow: the feathered silhouette (alpha), colour set in JS
    return im, Image.fromarray((sh * 255 + 0.5).astype(np.uint8), "RGBA")


SPECS = [("p", 6, 768, 560, 101), ("w", 4, 1024, 300, 301), ("b", 4, 1024, 768, 501)]
for kind, n, W, H, s0 in SPECS:
    for i in range(n):
        im, sh = mass(s0 + 17 * i, W, H, kind)
        im.save(f"{OUT}/pc_{kind}{i}.webp", "WEBP", quality=86, method=6)
        im.filter(ImageFilter.GaussianBlur(8)).resize((W // 2, H // 2), Image.LANCZOS).save(f"{OUT}/pc_{kind}{i}_s.webp", "WEBP", quality=82, method=6)
        sh.resize((W // 4, H // 4), Image.BILINEAR).save(f"{OUT}/pc_{kind}{i}_sh.webp", "WEBP", quality=80)
        print("wrote", f"pc_{kind}{i}", im.size)
