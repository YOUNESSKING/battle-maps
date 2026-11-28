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
TONES = np.array([[242, 238, 228], [222, 220, 214], [188, 192, 202]], float) / 255.0   # r16c: lit / mid / cool shade
SEPIA = np.array([176, 158, 136], float) / 255.0   # the faint warm rim on the shade side


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


def lobed(seed, W, H, kind):
    """r16c: an illustrated-map cloud = 3-7 (g) / 10-16 (b) soft rounded lobes of different sizes seen from above at the map's tilt, each painted
    with its own shading (lit top-left / mid / cool shade lower-right, wide soft steps, a faint warm sepia rim on the shade side), laid one over
    the other front to back like brush dabs; a 10-20 px dry-brush feather; cores ~0.9, a few thin outer wisps ~0.6; no glare, no hot centre."""
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    lobes = []
    if kind == "g":
        n = int(rng.integers(3, 8)); R0 = H * rng.uniform(0.20, 0.26)
        cx, cy = W / 2, H / 2
        for k in range(n):
            r = R0 * (rng.uniform(0.38, 0.95) if k else 1.0)
            if k:   # grow the group outward from lobes already placed (a recognisable cumulus cluster)
                b = lobes[int(rng.integers(0, len(lobes)))]; a = rng.uniform(0, 2 * np.pi); d = (b[2] + r) * rng.uniform(0.45, 0.7)
                x, y = b[0] + np.cos(a) * d * 1.25, b[1] + np.sin(a) * d * 0.8
            else: x, y = cx, cy
            lobes.append([x, y, r])
    else:   # b: a big bank mass
        n = int(rng.integers(11, 17))
        for k in range(n):
            a, d = rng.uniform(0, 2 * np.pi), rng.random() ** 0.7
            r = H * rng.uniform(0.13, 0.22) * (1.25 - 0.45 * d)
            lobes.append([W / 2 + np.cos(a) * d * W * 0.30, H / 2 + np.sin(a) * d * H * 0.26, r])
    L = np.array(lobes)   # fit inside the sprite (margin for the feather)
    x0, x1, y0, y1 = (L[:, 0] - L[:, 2]).min(), (L[:, 0] + L[:, 2]).max(), (L[:, 1] - L[:, 2] * 0.8).min(), (L[:, 1] + L[:, 2] * 0.8).max()
    k = min((W - 60) / (x1 - x0), (H - 60) / (y1 - y0), 1.0)
    L[:, :2] = (L[:, :2] - [(x0 + x1) / 2, (y0 + y1) / 2]) * k + [W / 2, H / 2]; L[:, 2] *= k
    order = np.argsort(L[:, 1] + 0.3 * L[:, 2])   # far (upper) lobes first, near lobes painted over them
    strokes = vnoise(rng, H, W, 22, 3, aniso=(0.7, 1.4)); fine = vnoise(rng, H, W, 4, 2); wob = vnoise(rng, H, W, 34, 2)
    C = np.zeros((H, W, 3)); A = np.zeros((H, W))
    Ld = np.array([-0.55, -0.62, 0.56]); Ld /= np.linalg.norm(Ld)
    feather = 7.0
    for li in order:
        x, y, r = L[li]
        dx, dy = (xx - x) / r, (yy - y) / (r * 0.8)   # seen at the map's tilt: lobes a little flattened
        d = np.sqrt(dx * dx + dy * dy)
        edge = (1 - d) * r + wob * r * 0.10 + strokes * 5 + fine * 2   # px inside the lobe edge: an irregular rim + dry-brush jitter
        a = smooth(-feather, feather, edge)
        if a.max() < 1e-3: continue
        nz = np.sqrt(np.clip(1 - np.minimum(d, 1) ** 2, 0, 1))
        lam = np.clip(dx * Ld[0] * 0.9 + dy * Ld[1] * 0.9 + nz * Ld[2] + 0.02, 0, 1)   # sphere normal (dx, dy, nz) . sun (upper left)
        val = lam + 0.07 * strokes + 0.05 * wob
        w = 0.08
        k1, k2 = smooth(0.76 - w, 0.76 + w, val), smooth(0.52 - w, 0.52 + w, val)
        col = TONES[2] * (1 - k2)[..., None] + TONES[1] * (k2 * (1 - k1))[..., None] + TONES[0] * k1[..., None]
        rim = smooth(0.55, 0.95, d) * smooth(0.1, 0.7, dx * 0.6 + dy * 0.8) * 0.22   # faint warm sepia rim, shade side
        col = col * (1 - rim[..., None]) + SEPIA * rim[..., None]
        C = C * (1 - a[..., None]) + col * a[..., None]; A = A + a * (1 - A)
    Cc = np.where(A[..., None] > 1e-4, C / np.maximum(A, 1e-4)[..., None], TONES[1])   # un-premultiplied colour (no dark fringes)
    # opacity: cores ~0.9, the thin outer band ~0.6 broken by the dry brush
    band = 1 - smooth(0.25, 0.9, A)
    alpha = A * (0.92 - 0.3 * band) * (1 - 0.35 * band * smooth(-0.1, 0.5, vnoise(rng, H, W, 10, 2, aniso=(0.5, 1.8))))
    if kind == "b": alpha = np.minimum(1, alpha * 1.06)
    Cc = Cc * (1 + 0.03 * vnoise(rng, H, W, 1.6, 2) + 0.02 * vnoise(rng, H, W, 40, 3))[..., None]   # paper grain + wash mottling
    rgba = np.dstack([np.clip(Cc, 0, 1), np.clip(alpha, 0, 1)])
    im = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA")
    sh = np.zeros((H, W, 4)); sh[..., 3] = gaussian_filter(A, H * 0.03)
    return im, Image.fromarray((sh * 255 + 0.5).astype(np.uint8), "RGBA")


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


SPECS = [("g", 10, 640, 480, 701, lobed), ("w", 3, 1024, 300, 301, mass), ("b", 5, 1024, 768, 901, lobed)]   # r16c: g = lobed cumulus groups, w = wisps (r16b), b = bank masses
for kind, n, W, H, s0, fn in SPECS:
    for i in range(n):
        im, sh = fn(s0 + 17 * i, W, H, kind)
        im.save(f"{OUT}/pc_{kind}{i}.webp", "WEBP", quality=86, method=6)
        im.filter(ImageFilter.GaussianBlur(6)).resize((W // 2, H // 2), Image.LANCZOS).save(f"{OUT}/pc_{kind}{i}_s.webp", "WEBP", quality=82, method=6)
        sh.resize((W // 4, H // 4), Image.BILINEAR).save(f"{OUT}/pc_{kind}{i}_sh.webp", "WEBP", quality=80)
        print("wrote", f"pc_{kind}{i}", im.size)
