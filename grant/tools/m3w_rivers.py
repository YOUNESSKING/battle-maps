"""Grant #16 Style W, move-3 maps (richmond / jamesriver / petersburg): curated river masks for make_style_w.py.
The raw OSM water masks (assets/media/<map>_det_riv*.png) on these tidal Virginia maps bake into dense creek networks (and the Bay/Atlantic
as a branched skeleton) while the James near Richmond drops out. This traces ONLY the rivers the narration names (the James, the
Chickahominy) + the Appomattox (Petersburg's river) along the real water (route through the OSM mask between lat/lon waypoints),
smooths them, and writes assets/media/<map>W_det_rivS.png (main river) + <map>W_det_riv.png (main + creeks).
Bake with:  python3 ../research/style_tests/make_style_w.py <map>W assets/<map>_w.jpg close=assets/<map>_w_close.jpg [story=...] green=1 tint=0 mult=1 curated=1 main_r=.. creek_r=..
usage: python3 tools/m3w_rivers.py MAP [preview.jpg]"""
import json, os, sys, math
import numpy as np, cv2
from PIL import Image, ImageDraw
from skimage.graph import route_through_array
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from m3_proj import proj
# waypoints (lat, lon) along each river, downstream order; the route follows the OSM water between them
JAMES = [(37.66, -78.10), (37.56, -77.60), (37.533, -77.44), (37.424, -77.425), (37.31, -77.27), (37.22, -76.80), (36.99, -76.33)]
APPOM = [(37.30, -78.39), (37.33, -77.95), (37.232, -77.40), (37.31, -77.275)]
CHICK = [(37.70, -77.62), (37.64, -77.52), (37.60, -77.43), (37.57, -77.36), (37.545, -77.30), (37.51, -77.25), (37.47, -77.20), (37.452, -77.17),
         (37.42, -77.11), (37.39, -77.03), (37.33, -76.96), (37.27, -76.90), (37.235, -76.875)]
CHICK_Z12 = [(37.70, -77.62), (37.64, -77.52), (37.60, -77.43), (37.545, -77.30), (37.235, -76.875)]
APPOM_Z12 = [(37.226, -77.54), (37.232, -77.40), (37.31, -77.275)]
RIV = {"richmond": {"main": [JAMES], "creek": [APPOM, CHICK]},
       "jamesriver": {"main": [JAMES], "creek": [APPOM_Z12, CHICK_Z12]},
       "petersburg": {"main": [JAMES], "creek": [APPOM]}}
W, H = 2880, 1620

def water(m):
    a = np.asarray(Image.open(f"{ROOT}/assets/media/{m}_det_riv.png"))[..., 3] > 25
    return cv2.resize(a.astype(np.uint8), (W, H), interpolation=cv2.INTER_AREA) > 0

def clip(pts, m=0):
    """keep the part of the polyline inside the map (+m), cutting segments at the frame edge"""
    out = []
    for a, b in zip(pts[:-1], pts[1:]):
        t0, t1, dx, dy = 0.0, 1.0, b[0] - a[0], b[1] - a[1]; ok = True
        for p, q in ((-dx, a[0] + m), (dx, W - 1 + m - a[0]), (-dy, a[1] + m), (dy, H - 1 + m - a[1])):
            if p == 0:
                if q < 0: ok = False
            else:
                r = q / p
                if p < 0: t0 = max(t0, r)
                else: t1 = min(t1, r)
        if not ok or t0 > t1: continue
        A, Bp = (a[0] + dx * t0, a[1] + dy * t0), (a[0] + dx * t1, a[1] + dy * t1)
        if not out or math.hypot(out[-1][0] - A[0], out[-1][1] - A[1]) > 1: out.append(A)
        out.append(Bp)
    return out

def spline(pts, n=12):
    P = [pts[0]] + pts + [pts[-1]]; o = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = map(np.array, P[i - 1:i + 3])
        for t in np.linspace(0, 1, n, endpoint=False):
            o.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    o.append(np.array(pts[-1])); return [list(map(float, q)) for q in o]

def trace(m, wps, wat, cost):
    P = proj(m); pts = clip([P(*q) for q in wps])
    if len(pts) < 2: return []
    path = []
    for a, b in zip(pts[:-1], pts[1:]):
        ca = [int(np.clip(a[1], 0, H - 1)), int(np.clip(a[0], 0, W - 1))]; cb = [int(np.clip(b[1], 0, H - 1)), int(np.clip(b[0], 0, W - 1))]
        for c in (ca, cb):                                            # snap each end to the nearest water within 25 px
            y0, x0 = c; win = wat[max(0, y0 - 25):y0 + 26, max(0, x0 - 25):x0 + 26]
            ys, xs = np.nonzero(win)
            if len(ys): k = np.argmin((ys + max(0, y0 - 25) - y0) ** 2 + (xs + max(0, x0 - 25) - x0) ** 2); c[0], c[1] = ys[k] + max(0, y0 - 25), xs[k] + max(0, x0 - 25)
        p, _ = route_through_array(cost, tuple(ca), tuple(cb), fully_connected=True, geometric=True)
        path += [(x, y) for y, x in p]
    onw = np.mean([wat[int(y), int(x)] for x, y in path])
    if onw < 0.6: return spline(pts)                                  # river not in the OSM mask at this zoom: smooth curve through the waypoints
    a = np.array(path, np.float32)
    k = 9 if m == "richmond" else 25                                  # smooth (moving average), keep the ends
    if len(a) > 2 * k:
        ker = np.ones(k) / k; s = np.stack([np.convolve(np.pad(a[:, i], k // 2, mode="edge"), ker, mode="valid") for i in range(2)], -1); a = s
    return a[::3].tolist() + [a[-1].tolist()]

def main(m, prev=None):
    wat = water(m)
    d = cv2.distanceTransform(wat.astype(np.uint8), cv2.DIST_L2, 5)
    cost = np.where(wat, 1.0 / (1.0 + d), 40.0).astype(np.float64)   # water is cheap, its centre cheapest
    out = {}
    for kind in ("main", "creek"):
        out[kind] = [t for t in (trace(m, wps, wat, cost) for wps in RIV[m][kind]) if t]
    for fn, kinds in (("det_rivS", ("main",)), ("det_riv", ("main", "creek"))):
        im = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
        for kd in kinds:
            for pl in out[kd]: dr.line([(x * 2, y * 2) for x, y in pl], fill=(30, 60, 120, 255), width=4, joint="curve")
        im.save(f"{ROOT}/assets/media/{m}W_{fn}.png", optimize=True)
    json.dump(out, open(f"{ROOT}/assets/src/{m}W_rivers.json", "w"))
    if prev:
        bg = Image.open(f"{ROOT}/assets/{m}_hd_lift.jpg").convert("RGB").resize((W // 2, H // 2)); dr = ImageDraw.Draw(bg)
        ov = (np.asarray(Image.fromarray(wat.astype(np.uint8) * 255).resize((W // 2, H // 2))) > 0)
        a = np.asarray(bg).copy(); a[ov] = (a[ov] * 0.4 + np.array([60, 120, 255]) * 0.6).astype(np.uint8); bg = Image.fromarray(a); dr = ImageDraw.Draw(bg)
        for kd, col in (("main", (255, 40, 40)), ("creek", (255, 220, 0))):
            for pl in out[kd]: dr.line([(x / 2, y / 2) for x, y in pl], fill=col, width=2)
        bg.save(prev)
    print(m, {k: [len(p) for p in v] for k, v in out.items()})

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
