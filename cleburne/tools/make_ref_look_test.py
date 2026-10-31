"""TEST (owner 2026-10-31): copy the MAP look of a reference battle film (warm sand relief, strong sunlit slopes, pale river, individual trees)
onto one of our maps as a still. usage: python3 tools/make_ref_look_test.py BASE CX CY OUT.png [TREE_MODE=riparian|forest]  (CX,CY = crop centre in the 5760x3240 HD grid)
Not applied to any video; locked look unchanged."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
base, cx, cy, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
mode = sys.argv[5] if len(sys.argv) > 5 else "riparian"
W, H = 1920, 1080
x0, y0 = max(0, min(5760 - W, cx - W // 2)), max(0, min(3240 - H, cy - H // 2))
box = (x0, y0, x0 + W, y0 + H)
el = np.load(f"assets/src/{base}_hd_elev.npy")[y0:y0 + H, x0:x0 + W].astype(np.float32)
el = ndimage.gaussian_filter(el, 1.2)
# --- relief: strong multi-direction shading, warm ramp
dz_dy, dz_dx = np.gradient(el * 6.5)
def shade(az, alt=38):
    a, l = np.radians(az), np.radians(alt)
    sl = np.pi / 2 - np.arctan(np.hypot(dz_dx, dz_dy) / 7.8); asp = np.arctan2(-dz_dx, dz_dy)
    return np.clip(np.sin(l) * np.sin(sl) + np.cos(l) * np.cos(sl) * np.cos(a - asp), 0, 1)
sh = 0.6 * shade(315) + 0.25 * shade(20) + 0.15 * shade(270)
sh = (sh - sh.min()) / (np.ptp(sh) + 1e-6)
slope = np.clip(np.hypot(dz_dx, dz_dy) / 7.8 / 1.2, 0, 1)
rel = (el - el.min()) / (np.ptp(el) + 1e-6)
SAND, TAN, ORANGE, DARK = np.array([186, 170, 120]), np.array([196, 158, 96]), np.array([222, 172, 92]), np.array([92, 68, 40])
col = SAND[None, None] * (1 - rel[..., None]) + TAN[None, None] * rel[..., None]
col = col * (1 - 0.32 * slope[..., None]) + ORANGE[None, None] * (0.32 * slope[..., None])
col = col * (0.32 + 1.15 * sh[..., None])
col = np.where((sh[..., None] < 0.35), col * 0.8 + DARK * 0.2, col)
# fine drainage lines: darker hairlines where flow accumulates (cheap proxy: local concavity)
conc = ndimage.gaussian_filter(el, 3) - ndimage.gaussian_filter(el, 9)
col *= (1 - 0.22 * np.clip(-conc / 6, 0, 1))[..., None]
lum = col.mean(2, keepdims=True); col = col * 0.85 + lum * 0.15 * np.array([1.0, 0.98, 0.86])
img = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).convert("RGBA")
# --- river: pale grey-blue with soft bank
riv = Image.open(f"assets/media/{base}_det_rivS.png").convert("RGBA").crop(box)
ra = np.array(riv)[..., 3] > 40
ra = ndimage.binary_dilation(ra, iterations=4)
bank = ndimage.binary_dilation(ra, iterations=3) & ~ra
rl = np.zeros((H, W, 4), np.uint8)
rl[bank] = (214, 205, 170, 150); rl[ra] = (146, 158, 160, 255)
rl_img = Image.fromarray(rl).filter(ImageFilter.GaussianBlur(0.8))
img = Image.alpha_composite(img, rl_img)
# --- trees: individual crowns with shadow + highlight
tree = np.array(Image.open(f"assets/media/{base}_det_tree.png").convert("RGBA").crop(box))[..., 3].astype(np.float32) / 255
tree = ndimage.gaussian_filter(tree, 4)
dist = ndimage.distance_transform_edt(~ra)
rng = np.random.default_rng(3)
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
step = 9
pts = []
for gy in range(0, H, step):
    for gx in range(0, W, step):
        x, y = gx + rng.integers(0, step), gy + rng.integers(0, step)
        if x >= W or y >= H: continue
        t = tree[y, x]
        if mode == "riparian":
            p = (0.92 if dist[y, x] < 48 else 0.0) * (t > 0.10)
        else:
            p = (0.92 if dist[y, x] < 48 else 0.12) * (t > 0.30)
        if rng.random() < p: pts.append((y, x))
pts.sort()
for y, x in pts:
    r = int(rng.integers(6, 9)); g = int(rng.integers(0, 3))
    d.ellipse((x - r + 3, y - r + 4, x + r + 3, y + r + 4), fill=(20, 24, 12, 105))          # drop shadow
    base_c = [(34, 62, 38), (44, 76, 44), (56, 88, 48)][g]
    d.ellipse((x - r, y - r, x + r, y + r), fill=base_c + (255,))
    d.ellipse((x - r + 2, y - r + 1, x + r - 3, y + r - 4), fill=(base_c[0] + 18, base_c[1] + 26, base_c[2] + 14, 255))   # lit side
    d.ellipse((x - r // 2, y - r // 2 - 1, x + 1, y + 1), fill=(base_c[0] + 40, base_c[1] + 52, base_c[2] + 26, 200))     # highlight
img = Image.alpha_composite(img, layer.filter(ImageFilter.GaussianBlur(0.6)))
# --- vignette + grain
yy, xx = np.mgrid[0:H, 0:W]
v = 1 - 0.45 * np.clip(((xx - W / 2) / (W / 1.5)) ** 2 + ((yy - H / 2) / (H / 1.5)) ** 2, 0, 1)
a = np.array(img.convert("RGB")).astype(np.float32) * v[..., None]
a += rng.normal(0, 3.0, a.shape[:2])[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(out)
print(out, len(pts), "trees")
