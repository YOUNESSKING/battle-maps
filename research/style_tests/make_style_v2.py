"""Style v2 basemaps, rebuilt from the measured study (research/style_tests/STYLE_STUDY.md). MAP ONLY; units/fronts stay ours.
usage (from a video folder): python3 ../research/style_tests/make_style_v2.py <map> A|B OUT.jpg
Glyph sizes are in 5760-px image px, tuned for the camera zooms we use most (s 2-3.5 => 1 image px ~ 1-1.75 screen px)."""
import sys, numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from skimage.morphology import skeletonize
import cv2
base, style, out = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = 5760, 3240; rng = np.random.default_rng(11)

# ---------- rivers: only the main river + the longest creeks, uniform width, pre-dam (no reservoir bulges) ----------
def load(n): return np.asarray(Image.open(f'assets/media/{base}_{n}.png'))[..., 3] > 25
big, det = load('det_rivS'), load('det_riv')
def skel_half(m):
    h = cv2.resize(m.astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA) > 0
    h = np.pad(h, 120, mode='edge'); return skeletonize(h)
def prune(sk, it):
    k = np.ones((3, 3), np.uint8)
    for _ in range(it):
        nb = cv2.filter2D(sk.astype(np.uint8), -1, k, borderType=cv2.BORDER_CONSTANT) - sk
        sk = sk & ~(nb <= 1)
    return sk
def unpad(sk): return sk[120:-120, 120:-120]
skB = unpad(prune(skel_half(big), 110))
skD = unpad(prune(skel_half(det & ~ndimage.binary_dilation(big, iterations=6)), 110))
lb, nb_ = ndimage.label(skB, structure=np.ones((3, 3))); lnb = ndimage.sum(skB, lb, range(1, nb_ + 1)); skB = np.isin(lb, 1 + np.nonzero(lnb > 150)[0])
lab, n = ndimage.label(skD, structure=np.ones((3, 3)))
ln = ndimage.sum(skD, lab, range(1, n + 1))
keep = 1 + np.argsort(ln)[::-1][:int(sys.argv[4]) if len(sys.argv) > 4 else 11]
skD = np.isin(lab, keep[ln[keep - 1] > 250])
def band(sk, r):
    full = cv2.resize(sk.astype(np.uint8), (W, H), interpolation=cv2.INTER_NEAREST)
    m = cv2.dilate(full, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))) > 0
    # hand-drawn look: straight segments with sharp bends (approxPolyDP on the outline)
    cs, _ = cv2.findContours(m.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    o = np.zeros((H, W), np.uint8)
    cv2.drawContours(o, [cv2.approxPolyDP(c, 3.2, True) for c in cs], -1, 1, -1)
    return o > 0
main_r, creek_r = (17, 7) if style == 'A' else (4, 2)
water = band(skB, main_r) | band(skD, creek_r)

def mottle(amps):
    acc = np.zeros((H, W), np.float32)
    for sig, amp in amps:
        sm = rng.standard_normal((H // 4 + 1, W // 4 + 1)).astype(np.float32)
        sm = ndimage.gaussian_filter(sm, max(sig / 4, 0.6)); sm /= sm.std() + 1e-6
        acc += cv2.resize(sm, (W, H), interpolation=cv2.INTER_CUBIC) * amp
    return acc

if style == 'A':
    # paper: measured mean (160,159,117); low-freq std ~7.6, fine std ~15 (soft painterly blotches, not grain)
    m1, m2 = mottle([(70, 3.5), (18, 4.5), (5, 4)]), mottle([(40, 2)])
    a = np.stack([160 + m1 + m2 * 0.5, 159 + m1, 117 + m1 * 0.8 - m2], -1)
    a += rng.standard_normal((H, W, 1)).astype(np.float32) * 3
    # river: pale fill (217,229,235) lighter toward the upper-left bank, blue-grey (157,170,182) shadow on the lower-right bank
    sh = np.zeros_like(water); sh[5:, 4:] = water[:-5, :-4]; shadow = (sh | ndimage.binary_dilation(water, iterations=1)) & ~water
    shadow = ndimage.gaussian_filter(shadow.astype(np.float32), 1.2)
    hl = np.zeros_like(water); hl[:-4, :-3] = water[4:, 3:]; lit = water & ~hl
    a = a * (1 - shadow[..., None] * 0.9) + np.array([150, 164, 178], np.float32) * shadow[..., None] * 0.9
    a[water] = (214, 227, 234); a[lit] = (236, 242, 244)
    a[water] += rng.standard_normal((int(water.sum()), 1)).astype(np.float32) * 2
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    # ---------- glyphs drawn at 2x then reduced (anti-aliased ink) ----------
    SS = 2; G = Image.new('LA', (W * SS, H * SS), (0, 0)); d = ImageDraw.Draw(G)
    INK = 34
    dist = ndimage.distance_transform_edt(~cv2.resize(water.astype(np.uint8), (W // 4, H // 4), interpolation=cv2.INTER_NEAREST).astype(bool)) * 4
    occ = np.zeros((H // 40 + 1, W // 40 + 1), bool)
    def free(x, y, r):
        gx, gy, k = int(x // 40), int(y // 40), max(1, int(r // 55))
        if dist[min(int(y // 4), dist.shape[0] - 1), min(int(x // 4), dist.shape[1] - 1)] < r * 0.55: return False
        if occ[max(0, gy - k):gy + k + 1, max(0, gx - k):gx + k + 1].any(): return False
        occ[max(0, gy - k):gy + k + 1, max(0, gx - k):gx + k + 1] = True; return True
    def blade(x, y, h, lean, wdt):
        pts = []
        for i in range(7):
            t = i / 6; pts.append((x + lean * t * t, y - h * t))
        for i in range(6): d.line([pts[i], pts[i + 1]], fill=(INK, 255), width=max(1, int(wdt * (1 - i / 7) + 0.5)))
    def tuft(x, y, s):                      # marsh/grass symbol: fan of 3-6 blades over 1-3 horizontal ink lines
        nb = rng.integers(3, 7)
        for k in range(nb):
            off = (k - (nb - 1) / 2) * 3.0 * s
            hgt = (11 + 6 * (1 - abs(k - (nb - 1) / 2) / max(1, nb / 2)) + rng.uniform(-3, 3)) * s
            blade(x + off, y, hgt, (off * 0.9 + rng.uniform(-2, 2) * s), 2.2 * s)
    def hatch(x, y, s):
        for j in range(rng.integers(1, 4)):
            L = rng.uniform(18, 46) * s; x0 = x + rng.uniform(-14, 6) * s; yy = y + (2 + 4.5 * j) * s
            d.line([(x0, yy), (x0 + L, yy)], fill=(INK, 235), width=max(1, int(1.1 * s)))
    def marsh(x, y):                        # one cluster ~ 90 x 60 image px (ref ~ 120 x 90 screen px at ref zoom)
        s = 1.4 * SS * rng.uniform(0.9, 1.15); rows = rng.integers(2, 4)
        for r in range(rows):
            yy = y + r * 16 * s; xs = x + rng.uniform(-10, 10) * s
            for c in range(rng.integers(1, 4)):
                xx = xs + c * rng.uniform(16, 24) * s
                if rng.random() < 0.85: tuft(xx, yy, s)
            hatch(xs - 6 * s, yy, s)
    def pine(x, y, s):                      # dark cone, jagged sides, lighter left flank, soft ground shadow
        h, w = 19 * s, 6.5 * s
        d.ellipse([x - w * 0.9, y - 1.5 * s, x + w * 1.3, y + 2.5 * s], fill=(INK, 90))
        pts = [(x, y - h)]
        for i in range(1, 4):
            t = i / 3.6; pts += [(x + w * t + 1.5 * s, y - h + h * t), (x + w * t * 0.75, y - h + h * t + 1.2 * s)]
        pts += [(x + w, y), (x - w, y)]
        for i in range(3, 0, -1):
            t = i / 3.6; pts += [(x - w * t * 0.75, y - h + h * t + 1.2 * s), (x - w * t - 1.5 * s, y - h + h * t)]
        d.polygon(pts, fill=(INK, 255))
        d.polygon([(x - 0.4 * s, y - h + 2 * s), (x - w * 0.55, y - 1.5 * s), (x - w * 0.15, y - 1.5 * s)], fill=(105, 200))
        d.line([(x, y), (x, y + 2 * s)], fill=(INK, 255), width=max(1, int(1.2 * s)))
    def clump(x, y):                        # 15-35 trees, tight, back rows drawn first
        s = 1.3 * SS * rng.uniform(0.9, 1.1); n = rng.integers(20, 40); R = (5 + n * 0.75) * s
        ps = []
        while len(ps) < n:
            px, py = rng.uniform(-1, 1, 2)
            if px * px + py * py <= 1: ps.append((x + px * R * 1.15, y + py * R * 0.8))
        for px, py in sorted(ps, key=lambda p: p[1]): pine(px, py, s * rng.uniform(0.85, 1.15))
    nm, npn = int(sys.argv[5]) if len(sys.argv) > 5 else 190, int(sys.argv[6]) if len(sys.argv) > 6 else 60
    placed = [0, 0]; tries = 0
    while (placed[0] < nm or placed[1] < npn) and tries < 40000:
        tries += 1; x, y = rng.uniform(80, W - 80), rng.uniform(80, H - 80)
        isP = placed[1] < npn and (placed[0] >= nm or rng.random() < 0.25)
        if not free(x, y, 95 if isP else 85): continue
        (clump if isP else marsh)(x * SS, y * SS); placed[isP] += 1
    print("placed", placed)
    G = G.resize((W, H), Image.LANCZOS)
    ink = Image.new('RGB', (W, H), (INK, INK - 2, INK - 8))
    lum, alpha = G.split()
    ink = Image.merge('RGB', [lum.point(lambda v: v), lum.point(lambda v: max(0, v - 2)), lum.point(lambda v: max(0, v - 8))])
    img.paste(ink, (0, 0), alpha)
else:
    # B: dark olive grass (measured ~ (110,105,52)), strong soft mottle (low-freq std ~25, fine ~28), faint relief only,
    # thin dark river lines, rock/scrub speckle clusters
    relief = np.asarray(Image.open(f'assets/{base}_hd_lift.jpg').convert('L')).astype(np.float32)
    relief = (relief - relief.mean()) / (relief.std() + 1e-6)
    relief = ndimage.gaussian_filter(relief, 3)
    m1 = mottle([(90, 6), (25, 5), (8, 3)]); fine = rng.standard_normal((H, W)).astype(np.float32)
    fine = ndimage.gaussian_filter(fine, 0.9) * 13 + ndimage.gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), 2.5) * 10
    v = m1 + fine + relief * 6
    a = np.stack([110 + v * 0.95, 110 + v * 1.05, 50 + v * 0.5], -1)
    hi = np.clip(m1 / 10, 0, 1)[..., None]                        # lighter dry-grass patches
    a = a * (1 - hi * 0.3) + np.array([150, 150, 78], np.float32) * hi * 0.3
    edge = ndimage.binary_dilation(water, iterations=2) & ~water
    a[edge] = a[edge] * 0.6; a[water] = (96, 112, 112)
    img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img)
    for _ in range(140):                                          # speckle clusters (scrub/rocks)
        cx, cy = rng.uniform(0, W), rng.uniform(0, H); R = rng.uniform(25, 70)
        for _ in range(rng.integers(25, 70)):
            px, py = cx + rng.normal(0, R), cy + rng.normal(0, R * 0.6); r = rng.uniform(0.8, 2.6)
            c = int(rng.uniform(40, 70)); d.ellipse([px - r, py - r * 0.7, px + r, py + r * 0.7], fill=(c, c - 4, c - 18))
img.save(out, quality=92); print(out, 'creeks kept', int(skD.any() and ndimage.label(skD, structure=np.ones((3, 3)))[1]))
