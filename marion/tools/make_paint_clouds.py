"""r16 PAINTED CLOUDS (owner 2026-11-28: "the clouds should be suited for a 2D film"): gouache-style cloud sprites for the Style W map.
No photos, no AI images: every sprite is made here from circles + value noise.
  - silhouette = a union of lobes (flat-ish base, domed top), the edge broken by a dry-brush noise, feathered a few px;
  - shading = a sphere-cap height field lit from the upper left, cut into 4 flat tonal steps (lit top / mid / cool shade / deep base)
    with narrow soft steps whose boundaries are jittered by a brush-stroke noise (horizontal strokes);
  - pigment pooling: a slightly darker rim just inside the edge in the shade; a fine broken sepia ink edge (low alpha);
  - paper grain multiplied in; warm palette matched to the Style W map grade.
Out: marion/kit/paint_clouds/pc_<kind><i>.webp (RGBA) + pc_shadow<i>.webp (the blurred silhouette for the ground shadow).
usage: python3 marion/tools/make_paint_clouds.py [OUTDIR]"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit", "paint_clouds")
os.makedirs(OUT, exist_ok=True)
# palette (sRGB): lit top, mid, cool shade, deep base (Style W warm grade: cream lights, grey-blue shade like the map's carved rivers' cool side)
TONES = np.array([[249, 245, 233], [231, 228, 217], [197, 201, 204], [163, 171, 182]], float) / 255.0
STEPS = [0.70, 0.45, 0.20]        # shade value thresholds between the four tones (1 = full sun)
INK = np.array([62, 54, 44], float) / 255.0


def vnoise(rng, h, w, cell, octaves=3, aniso=(1.0, 1.0)):
    """value noise in [-1, 1]: random grids upsampled bicubic; aniso stretches the cells (brush strokes)"""
    acc, amp, tot = np.zeros((h, w)), 1.0, 0.0
    for o in range(octaves):
        cy, cx = max(2, int(h / (cell * aniso[0]) / 2 ** o) + 2), max(2, int(w / (cell * aniso[1]) / 2 ** o) + 2)
        g = rng.random((cy, cx)).astype(np.float32)
        im = Image.fromarray(g, "F").resize((w, h), Image.BICUBIC)
        acc += amp * (np.asarray(im) * 2 - 1); tot += amp; amp *= 0.5
    return acc / tot


def smooth(e0, e1, x):
    k = np.clip((x - e0) / (e1 - e0), 0, 1); return k * k * (3 - 2 * k)


def cloud(seed, W, H, kind):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    lobes = []
    if kind == "t":                                     # seen from above (the deck / the wipe): lobes all round an ellipse, no flat base
        for i in range(44 + int(rng.integers(0, 8))):
            a, d = rng.uniform(0, 2 * np.pi), rng.random() ** 0.7
            r = H * (0.11 + 0.07 * rng.random()) * (1.45 - 0.65 * d)
            lobes.append((W / 2 + np.cos(a) * d * (W * 0.47 - r * 1.05), H / 2 + np.sin(a) * d * (H * 0.47 - r * 1.05), r))
    base = H * (0.78 if kind == "m" else 0.70)                                     # the flat-ish base line
    span = W * (0.36 if kind == "c" else 0.40)          # half width of the cloud body
    nb = 0 if kind == "t" else 5 + int(rng.integers(0, 3)) if kind == "c" else 8 + int(rng.integers(0, 3))
    for i in range(nb):                                 # base row
        u = (i + 0.5) / nb * 2 - 1; x = W / 2 + u * span + rng.normal(0, W * 0.015)
        r = H * (0.15 + 0.06 * rng.random()) * (1.15 - 0.45 * abs(u))
        lobes.append((x, base - r * 0.55, r))
    nt = 0 if kind == "t" else 3 + int(rng.integers(0, 3)) if kind == "c" else 6 + int(rng.integers(0, 3))
    for i in range(nt):                                 # domes on top (bigger toward the middle)
        u = rng.uniform(-0.75, 0.75); x = W / 2 + u * span * 0.85
        r = H * (0.17 + 0.09 * rng.random()) * (1.1 - 0.5 * abs(u)) * (1.0 if kind == "m" else 1)
        lobes.append((x, base - r * (1.05 + 0.5 * rng.random()) - H * 0.05 * (1 - abs(u)), r))
    if kind == "m":                                     # big masses: a second, higher tier of domes
        for i in range(3 + int(rng.integers(0, 2))):
            u = rng.uniform(-0.5, 0.5); r = H * (0.15 + 0.06 * rng.random())
            lobes.append((W / 2 + u * span * 0.7, base - H * 0.33 - r * 0.6, r))
    # height field (sphere caps) + silhouette distance
    hgt = np.zeros((H, W)); inside = np.full((H, W), -1e9)
    for (cx, cy, r) in lobes:
        d2 = (xx - cx) ** 2 + ((yy - cy) * 1.05) ** 2
        cap = np.sqrt(np.clip(r * r - d2, 0, None)); hgt = np.maximum(hgt, cap + cy * -0.0)   # caps
        inside = np.maximum(inside, r - np.sqrt(d2))
    # flat-ish painted base: cut under the base line (a soft, slightly wavy bottom)
    wav = vnoise(rng, H, W, W / 6, 2) * H * 0.025
    if kind != "t": inside = np.minimum(inside, (base + H * 0.06 + wav) - yy)
    inside = np.minimum(inside, np.minimum(np.minimum(xx, W - 1 - xx), np.minimum(yy, H - 1 - yy)) - 6)   # never touch the sprite border
    # dry-brush edge: jitter the silhouette with stroke noise (horizontal strokes) + a finer bristle noise
    strokes = vnoise(rng, H, W, 26, 3, aniso=(0.35, 2.5)); fine = vnoise(rng, H, W, 5, 2)
    edge = inside + strokes * 7 + fine * 2.2
    feather = 3.2
    alpha = smooth(-feather, feather, edge)
    # light: normal from the height field (soft), sun from the upper left and a little toward the viewer
    hb = gaussian_filter(hgt, H * 0.035)
    gy, gx = np.gradient(hb)
    n = np.dstack([-gx, -gy, np.full_like(gx, 1.6)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
    L = np.array([-0.55, -0.62, 0.56]); L /= np.linalg.norm(L)
    lam = np.clip((n @ L), 0, 1)
    vert = 1 - smooth(base - H * 0.42, base + H * 0.05, yy) if kind != "t" else 0.40 - 0.18 * smooth(H * 0.2, H * 0.9, yy)   # bottoms darker (cloud bases in shade)
    val = 0.62 * lam + 0.48 * vert - 0.12
    val += strokes * 0.06 + vnoise(rng, H, W, 60, 2) * 0.05      # brush jitter on the tone boundaries
    # four flat tones, narrow soft steps
    w = 0.025
    k1, k2, k3 = smooth(STEPS[0] - w, STEPS[0] + w, val), smooth(STEPS[1] - w, STEPS[1] + w, val), smooth(STEPS[2] - w, STEPS[2] + w, val)
    col = TONES[3] * (1 - k3)[..., None] + TONES[2] * (k3 * (1 - k2))[..., None] + TONES[1] * (k2 * (1 - k1))[..., None] + TONES[0] * k1[..., None]
    # pigment pooling: a slightly darker band just inside the edge where the cloud is in shade
    rim = smooth(0, 3, edge) * (1 - smooth(4, 12, edge))
    col = col * (1 - (0.06 * rim * (1 - k1))[..., None])
    # paper grain (multiply) + a soft wash mottling
    grain = vnoise(rng, H, W, 1.6, 2); mott = vnoise(rng, H, W, 40, 3)
    col = col * (1 + 0.035 * grain + 0.025 * mott)[..., None]
    # fine broken ink edge (sepia, low alpha) on the outline
    ink = (smooth(-1.2, 0.2, edge) * (1 - smooth(0.4, 2.0, edge))) * smooth(-0.2, 0.5, vnoise(rng, H, W, 30, 2)) * 0.30
    col = col * (1 - ink[..., None]) + INK * ink[..., None]
    a = np.clip(alpha * 0.985 + ink * 0.0, 0, 1)
    rgba = np.dstack([np.clip(col, 0, 1), a])
    im = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA")
    sh = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(H * 0.045))
    return im, sh


SPECS = [("c", 6, 640, 400, 101), ("m", 4, 1024, 620, 501), ("t", 4, 1024, 720, 901)]   # c = cumulus (field), m = big side-lit masses, t = masses seen from above (the deck + the wipe)
for kind, n, W, H, s0 in SPECS:
    for i in range(n):
        im, sh = cloud(s0 + 17 * i, W, H, kind)
        im.save(f"{OUT}/pc_{kind}{i}.webp", "WEBP", quality=88, method=6)
        im.filter(ImageFilter.GaussianBlur(9)).resize((W // 2, H // 2), Image.LANCZOS).save(f"{OUT}/pc_{kind}{i}_s.webp", "WEBP", quality=85, method=6)   # soft (near the lens)
        sh.resize((W // 4, H // 4), Image.BILINEAR).save(f"{OUT}/pc_{kind}{i}_sh.webp", "WEBP", quality=80)
        print("wrote", f"pc_{kind}{i}", im.size)
