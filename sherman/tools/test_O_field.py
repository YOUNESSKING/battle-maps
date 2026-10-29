"""TEST O ("the orange effect", under consideration; owner rule: test files only). Bakes, for each capture on the atlanta map, a
cheap ARRIVAL-TIME FIELD over the lost ground + the colours the flood canvas cross-fades between. Reads shipped files, writes only
assets/media/test_O_* (+ test_O_meta.json).
usage (from sherman/): python3 tools/test_O_field.py
Captures (before -> after): jul03->jul10 (Chattahoochee), jul10->jul22 (the advance on Atlanta), aug64->sep64 (2 Sep, the tide).
Field = cost-weighted distance (skimage MCP_Geometric) from the seeds, on a half-resolution grid (1440x810):
  cost 1.0; x0.6 within 3 half-px of a railroad (faster along the rails); x3 within 3 half-px of a river (slower across it), except the
  river being crossed in that capture; x(1 +- 0.06) smooth value noise (2 octaves); then Gaussian-smoothed (O2 sigma 6, O3/O5 sigma 8 half-px).
  Seeds: O2 = the burst point; O3 and O5 = the old front line (+ the burst point first for O3).
Output per capture C (crop = the lost ground's bounding box, half resolution, all alpha 255 so the browser keeps the bytes exact):
  test_O_<v>_<C>_field.png  R,G = arrival time 0..1 as 16 bits (R high byte), B = lost-ground coverage (0..255)
  test_O_<C>_colA.png / colB.png  RGB = before / after territory colour with the E1 saturate(0.8) baked in
  test_O_<C>_alph.png       R = before alpha x 0.4 (E2 pale stage), G = after alpha (multiply-layer alphas)
  test_O_<C>_rest/lostR/lostB_mx.png (full size) for aug64 only: the E2 pieces for the 2 Sep capture
  test_O_meta.json          bbox (half px) and Tmax (cost units in half px) per field, for the band-width conversion"""
import json, math
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.graph import MCP_Geometric
from skimage.draw import line as dline

OUT = "assets/media/"
def save(arr, name, mode="RGBA"):
    assert name.startswith("test_O_"); Image.fromarray(arr.astype(np.uint8), mode).save(OUT + name, optimize=True)
def ctl(d): return np.asarray(Image.open(f"assets/media/atlanta_ctl_{d}_mx.png").convert("RGBA")).astype(np.float32)
def sides(X):
    a = X[..., 3] > 30
    return (X[..., 2] > X[..., 0] + 40) & a, (X[..., 0] > X[..., 2] + 40) & a
def sat(rgb, s=0.8):  # the CSS saturate() matrix
    M = np.array([[0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s], [0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s],
                  [0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s]])
    return np.clip(rgb @ M.T, 0, 255)
def half(X): return np.asarray(Image.fromarray(np.clip(X, 0, 255).astype(np.uint8)).resize((1440, 810), Image.BOX)).astype(np.float32)

J = json.load(open("assets/atlanta.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
LN = json.load(open("assets/media/atlanta_lines.json")); FR = json.load(open("assets/media/atlanta_fronts.json"))
DEM = json.load(open("assets/src/atlanta_dem_rivers.json"))
H2, W2 = 810, 1440
def raster(polys, width):
    im = Image.new("L", (W2, H2), 0); from PIL import ImageDraw; d = ImageDraw.Draw(im)
    for p in polys:
        if len(p) > 1: d.line([(x / 2, y / 2) for x, y in p], fill=255, width=width)
    return np.asarray(im) > 0
RAIL = raster([p for p in LN["rail"].values()], 6)
RIV_CH = raster([p for p in LN["river"]["CHATTAHOOCHEE"]], 6)
RIV_OTHER = raster([p for p in LN["river"]["FLINT"]] + [[(x / 2, y / 2) for x, y in r["pts"]] for r in DEM if r["order"] == 3], 6)
rng = np.random.default_rng(13)
def noise(cell):
    g = rng.uniform(-1, 1, (H2 // cell + 2, W2 // cell + 2)); return ndimage.zoom(g, cell, order=3)[:H2, :W2]
NZ = 0.67 * noise(60) + 0.33 * noise(20); NZ = NZ / (np.abs(NZ).max() + 1e-6)

CAPS = [("jul03", "jul10", "chattahoochee", (33.925, -84.440)), ("jul10", "jul22", None, (33.774, -84.296)), ("aug64", "sep64", None, (33.7525, -84.391))]
meta = {}
for b, a, crossing, burst in CAPS:
    B_, A_ = ctl(b), ctl(a); usb, csb = sides(B_); usa, csa = sides(A_)
    lost = ndimage.binary_opening(csb & usa, iterations=2)
    soft = np.clip(ndimage.gaussian_filter(lost.astype(np.float32), 2.0), 0, 1)
    if b == "aug64":   # E2 pieces for the 2 Sep capture (full size)
        def part(X, w): Y = X.copy(); Y[..., 3] = Y[..., 3] * w; return Y
        save(part(B_, 1 - soft), "test_O_aug64_rest_mx.png"); save(part(B_, soft), "test_O_aug64_lostR_mx.png"); save(part(A_, soft), "test_O_sep64_lostB_mx.png")
    s2 = half(soft[..., None].repeat(3, 2) * 255)[..., 0] / 255
    ys, xs = np.nonzero(s2 > 0.01); x0, x1, y0, y1 = max(xs.min() - 4, 0), min(xs.max() + 5, W2), max(ys.min() - 4, 0), min(ys.max() + 5, H2)
    bh, bw = y1 - y0, x1 - x0
    # colours + alphas (half res, crop)
    cA, cB = sat(half(B_[..., :3])), sat(half(A_[..., :3]))
    aA, aB = half(B_[..., 3:].repeat(3, 2))[..., 0], half(A_[..., 3:].repeat(3, 2))[..., 0]
    crop = lambda X: X[y0:y1, x0:x1]
    full = lambda rgb: np.dstack([rgb, np.full(rgb.shape[:2], 255.0)])
    save(full(crop(cA)), f"test_O_{b}_colA.png"); save(full(crop(cB)), f"test_O_{b}_colB.png")
    save(full(np.dstack([crop(aA) * 0.4, crop(aB), np.zeros((bh, bw))])), f"test_O_{b}_alph.png")
    meta[b] = {"bbox": [int(x0), int(y0), int(bw), int(bh)], "burst": [round(v, 1) for v in P(*burst)]}
    cost = np.ones((H2, W2), np.float32)
    cost[RAIL] *= 0.6
    riv = RIV_OTHER | (RIV_CH if crossing != "chattahoochee" else np.zeros_like(RIV_CH))
    cost[riv & ~RAIL] *= 3.0
    cost *= (1 + 0.06 * NZ)
    bx, by = P(*burst)
    for v, sig in (("O2", 6), ("O3", 8), ("O5", 8)):
        if v == "O5" and b != "aug64": continue
        if v != "O5" and b == "aug64": continue
        seeds = []
        if v in ("O2", "O3"): seeds.append((int(by / 2), int(bx / 2)))
        if v in ("O3", "O5"):
            pts = FR[b]
            for p, q in zip(pts, pts[1:]):
                rr, cc = dline(int(p[1] / 2), int(p[0] / 2), int(q[1] / 2), int(q[0] / 2))
                seeds += [(r_, c_) for r_, c_ in zip(rr, cc) if 0 <= r_ < H2 and 0 <= c_ < W2]
        m = MCP_Geometric(cost); T, _ = m.find_costs(seeds)
        T = ndimage.gaussian_filter(T, sig)
        lt = T[s2 > 0.3]; t0, t1 = float(np.percentile(lt, 0.5)), float(lt.max())
        Tn = np.clip((T - t0) / (t1 - t0), 0, 1)
        q = (crop(Tn) * 65535).astype(np.uint32)
        save(np.dstack([q >> 8, q & 255, crop(s2) * 255, np.full((bh, bw), 255)]), f"test_O_{v}_{b}_field.png")
        meta[b][v] = {"Tmax": round(t1 - t0, 1)}
    print(b, "->", a, meta[b])
json.dump(meta, open(OUT + "test_O_meta.json", "w"), indent=1)
