"""Bocage (hedgerow) overlays for the Cobra move (Collins #9, move 2). Stylised, not surveyed: Normandy fields were ~100-200 m
across; here they are drawn bigger so they read on screen.
usage: python3 tools/make_cob_hedges.py
-> assets/media/cob_hedges.png (5760x3240, shown at 2880x1620 on the cobra map): a patch of hedged fields north of the
   Periers - St-Lo road (the hedgerow close-up, move2-1b), Voronoi fields, dark hedge band + light green crowns, soft edge.
-> assets/media/cob_hedges_cells.json: a few hedge segments (map px) near the patch centre for the Sherman to smash through.
-> assets/media/nor_bocage.png (2880x1620 on the normandy map): a faint hedgerow mesh over the bocage country of the US sector."""
import json, math
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import cKDTree
def proj(base):
    J = json.load(open(f"assets/{base}.json")); z = J["zoom"]; ox, oy = J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** z; r = math.radians(lat); return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
    return P
rng = np.random.default_rng(44)
def voronoi_edges(W, H, spacing, jitter, x0=0, y0=0):
    xs = np.arange(x0, x0 + W + spacing, spacing); ys = np.arange(y0, y0 + H + spacing, spacing)
    gx, gy = np.meshgrid(xs, ys); seeds = np.c_[gx.ravel(), gy.ravel()].astype(float)
    seeds += rng.uniform(-jitter, jitter, seeds.shape)
    yy, xx = np.mgrid[y0:y0 + H, x0:x0 + W]
    lab = cKDTree(seeds).query(np.c_[xx.ravel(), yy.ravel()])[1].reshape(H, W)
    edge = (lab != np.roll(lab, 1, 0)) | (lab != np.roll(lab, 1, 1))
    return edge, seeds
# ---- cobra close-up patch (2x HD px): fields by recursive splitting (irregular quadrilaterals, like real bocage) ----
from PIL import ImageDraw, ImageFilter
P = proj("cobra"); S = 2
cx, cy = P(49.172, -1.225); cx, cy = cx * S, cy * S
R = 300 * S
W, H = 5760, 3240
def clip(poly, a, b, c):   # keep a*x + b*y <= c
    out = []
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        fp, fq = a * p[0] + b * p[1] - c, a * q[0] + b * q[1] - c
        if fp <= 0: out.append(p)
        if fp * fq < 0:
            t = fp / (fp - fq); out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out
def area(poly): return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))) / 2
fields = []
def split(poly, depth=0):
    if area(poly) < (34 * S) ** 2 * rng.uniform(0.5, 1.3) or depth > 14: fields.append(poly); return
    xs, ys = [p[0] for p in poly], [p[1] for p in poly]
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    # split across the longest extent (PCA), tilted a little
    pts = np.array(poly); cov = np.cov((pts - pts.mean(0)).T); w, v = np.linalg.eigh(cov); ax = v[:, 1]
    ang = math.atan2(ax[1], ax[0]) + rng.uniform(-0.25, 0.25)
    a, b = math.cos(ang), math.sin(ang)
    c = a * mx + b * my + rng.uniform(-0.18, 0.18) * math.sqrt(area(poly))
    A, B2 = clip(poly, a, b, c), clip(poly, -a, -b, -c)
    if len(A) < 3 or len(B2) < 3: fields.append(poly); return
    split(A, depth + 1); split(B2, depth + 1)
th = math.radians(18); ca, sa = math.cos(th), math.sin(th)
sq = [(-R * 1.1, -R * 1.1), (R * 1.1, -R * 1.1), (R * 1.1, R * 1.1), (-R * 1.1, R * 1.1)]
split([(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in sq])
band = Image.new("L", (W, H), 0); crown = Image.new("L", (W, H), 0); fill = Image.new("L", (W, H), 0)
db, dc, dfl = ImageDraw.Draw(band), ImageDraw.Draw(crown), ImageDraw.Draw(fill)
for f in fields:
    v = int(rng.uniform(20, 60)); dfl.polygon(f, fill=v)
    db.line(f + [f[0]], fill=255, width=11, joint="curve"); dc.line(f + [f[0]], fill=255, width=5, joint="curve")
yy, xx = np.mgrid[0:H, 0:W]
fade = np.clip((1.0 - np.hypot(xx - cx, yy - cy) / R) / 0.3, 0, 1)
bn, cr, fl = np.array(band) / 255.0, np.array(crown) / 255.0, np.array(fill) / 255.0
blob = np.array(Image.fromarray((rng.uniform(0, 1, (H // 6, W // 6)) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)) / 255.0
out = np.zeros((H, W, 4), np.float32)
out[..., :3] = np.array((128, 150, 96)); out[..., 3] = fl * 255
sel = bn > 0; out[sel, :3] = (20, 36, 16); out[sel, 3] = np.maximum(out[sel, 3], 205 * bn[sel])
sel = cr > 0; tone = 0.7 + 0.5 * blob[sel]
out[sel, :3] = np.stack([62 * tone, 104 * tone, 44 * tone], -1); out[sel, 3] = 240
out[..., 3] *= fade
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save("assets/media/cob_hedges.png", optimize=True)
json.dump({"centre": [round(cx / S, 1), round(cy / S, 1)], "fields": len(fields)}, open("assets/media/cob_hedges_cells.json", "w"))
# ---- normandy: faint bocage mesh over the US sector (map px) ----
P = proj("normandy")
W, H = 2880, 1620
edge, _ = voronoi_edges(W, H, 7, 2.5)
land = np.array(Image.open("assets/normandy_land.png").convert("L")) > 127
from PIL import ImageDraw
m = Image.new("L", (W, H), 0)
ImageDraw.Draw(m).polygon([P(*q) for q in [(49.42, -1.72), (49.40, -1.10), (49.28, -0.75), (49.05, -0.70), (48.90, -0.95), (48.95, -1.70)]], fill=255)
mask = ndimage.gaussian_filter(np.array(m, np.float32) / 255, 40) * land
out = np.zeros((H, W, 4), np.float32); out[edge, :3] = (26, 52, 22); out[edge, 3] = 150
out[..., 3] *= np.clip(mask * 1.4, 0, 1)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save("assets/media/nor_bocage.png", optimize=True)
print("wrote cob_hedges.png (centre", round(cx / S), round(cy / S), len(fields), "fields) and nor_bocage.png")
