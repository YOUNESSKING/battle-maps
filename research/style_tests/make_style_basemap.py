"""Full-size basemap in a test style (MAP ONLY; our units/fronts stay). usage (from a video folder):
  python3 ../research/style_tests/make_style_basemap.py <map> A|B OUT.jpg
A = flat illustrated (olive paper, white-edged light-blue rivers, grass tufts + pine clusters), B = muted green textured relief."""
import sys, numpy as np, math
from PIL import Image, ImageDraw, ImageOps
from scipy import ndimage
base, style, out = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 5760, 3240; rng = np.random.default_rng(7)
riv = np.asarray(Image.open(f'assets/media/{base}_det_riv.png'))[..., 3] > 25
big = np.asarray(Image.open(f'assets/media/{base}_det_rivS.png'))[..., 3] > 25
lab, n = ndimage.label(riv); sz = ndimage.sum(riv, lab, range(1, n + 1)); riv = np.isin(lab, 1 + np.nonzero(sz >= 15000)[0])
water = ndimage.binary_dilation(riv, iterations=1) | ndimage.binary_dilation(big, iterations=8)
def noise(s1, s2, amp):
    small = ndimage.gaussian_filter(rng.standard_normal((H // 4, W // 4)), s2 / 4)
    small = np.asarray(Image.fromarray(small.astype(np.float32)).resize((W, H), Image.BILINEAR))
    return ndimage.gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), s1) * amp + small * amp * 6
if style == 'A':
    a = np.zeros((H, W, 3), np.float32) + np.array([158, 153, 98], np.float32); a += noise(1.5, 60, 9)[..., None]
    edge = ndimage.binary_dilation(water, iterations=4) & ~water
    a[edge] = (238, 240, 236); a[water] = (176, 203, 214)
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img)
    dist = ndimage.distance_transform_edt(~ndimage.zoom(water, 0.25, order=0)) * 4
    S = 2.2
    def tuft(x, y, s):
        for k in range(5):
            dx = (k - 2) * 5 * s; h = (10 + rng.uniform(-3, 6)) * s; lean = rng.uniform(-3, 3) * s
            d.line([(x + dx, y), (x + dx + lean, y - h)], fill=(52, 48, 30), width=max(2, int(1.8 * s)))
        d.line([(x - 12 * s, y), (x + 12 * s, y)], fill=(52, 48, 30), width=max(1, int(s)))
    def pines(x, y):
        for k in range(rng.integers(5, 10)):
            px, py = x + rng.uniform(-24, 24) * S, y + rng.uniform(-18, 18) * S; s = rng.uniform(7, 11) * S
            d.polygon([(px, py - s * 1.6), (px - s * 0.7, py + s * 0.4), (px + s * 0.7, py + s * 0.4)], fill=(40, 42, 32))
    for _ in range(1700):
        x, y = rng.uniform(60, W - 60), rng.uniform(60, H - 60)
        if dist[min(int(y / 4), dist.shape[0] - 1), min(int(x / 4), dist.shape[1] - 1)] < 50: continue
        if rng.random() < 0.8:
            for k in range(rng.integers(2, 5)): tuft(x + rng.uniform(-30, 30) * S, y + rng.uniform(-20, 20) * S, S * rng.uniform(0.8, 1.2))
        else: pines(x, y)
else:
    relief = Image.open(f'assets/{base}_hd_lift.jpg').convert('L')
    r = np.asarray(ImageOps.autocontrast(relief, cutoff=2)).astype(np.float32) / 255
    a = np.stack([78 + 80 * r, 92 + 78 * r, 40 + 40 * r], -1) * (1 + noise(2, 80, 0.012)[..., None])
    a[water] = (70, 95, 95)
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
img.save(out, quality=92); print(out)
