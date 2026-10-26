"""Korea 1950-53 control maps (option 1, multiply look) + front polylines + 38th parallel, on the `korea` basemap (z7).
Communist-held ground (North Korea / PVA, and China + USSR on the mainland) = blue (110,160,255); UN-held = red (232,52,52);
Japan untinted. Front per date = one lat/lon polyline drawn WEST -> EAST (or south -> north -> east for Pusan): communist side on the
LEFT of travel = K.front sideA ("carth"). UN ground = polygon(front + offshore closing) & Korea & land.
Sources + notes for every line: research/FACT_NOTES_korea.md ("control map"). Approximate to ~5-10 km (z7 = ~1 km/px).
-> assets/media/korea_ctl_<date>_mx.png       (2880x1620 multiply overlay)
-> assets/media/korea_front_<date>.json       ([[x,y],...] map px, land part only, west -> east)
-> assets/media/korea_38th.json               ([[x,y],...] the 38th parallel across Korea, map px)
usage (from peng/): python3 tools/make_korea_control.py [date ...]
   --nw: same fronts on the nwkorea basemap (z9) for the hook -> assets/media/hknw_ctl_<date>_mx.png, hknw_front_<date>.json"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ARGS = sys.argv[1:]
BASE, PFX = ("nwkorea", "hknw") if "--nw" in ARGS else ("korea", "korea")
ARGS = [a for a in ARGS if a != "--nw"]
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

# Korea / China border: Yalu (mouth -> source) then Tumen (source -> mouth)
BORDER = [(39.80, 124.20), (39.86, 124.35), (40.10, 124.40), (40.30, 124.70), (40.46, 124.96), (40.62, 125.35), (40.83, 125.78),
          (41.15, 126.29), (41.45, 126.55), (41.78, 126.88), (41.65, 127.30), (41.45, 127.80), (41.40, 128.18), (41.75, 128.30),
          (42.00, 128.06), (42.10, 128.70), (42.23, 129.20), (42.44, 129.75), (42.95, 129.98), (42.75, 130.25), (42.50, 130.45),
          (42.29, 130.66), (42.20, 130.95)]
KOREA = BORDER + [(41.0, 131.4), (37.5, 131.2), (35.6, 129.9), (35.15, 129.55), (34.65, 129.0), (34.0, 128.4), (32.8, 127.3),
                  (32.8, 123.4), (39.6, 123.4)]
JAPAN = [(30, 128.9), (34.75, 128.9), (35.3, 129.7), (38, 131.5), (41.5, 137.5), (44, 139.0), (46, 140.5), (46, 150), (30, 150)]

E_CLOSE = lambda f: [(f[-1][0], 131.6), (32.6, 131.6), (32.6, 123.2), (f[0][0], 123.2)]
FRONTS = {
    # 25 Jun 1950: the invasion line = the 38th parallel (Ongjin peninsula south of it = ROK)
    "jun25": [(38.0, 124.3), (38.0, 125.0), (38.0, 126.0), (38.0, 127.0), (38.0, 128.0), (38.0, 128.65), (38.0, 129.2)],
    # ~15 Sep 1950: the Pusan perimeter (Naktong from the south coast to Waegwan, then east to Yongdok)
    "sep15": [(34.85, 128.33), (35.15, 128.40), (35.35, 128.45), (35.55, 128.38), (35.80, 128.40), (35.99, 128.40), (36.12, 128.55),
              (36.18, 128.80), (36.25, 129.10), (36.41, 129.37), (36.41, 129.85)],
    # 24 Oct 1950: UN north of the Chongchon, ROK 6th Div spearhead toward the Yalu (Kojang), ROK I Corps up the NE coast
    "oct24": [(39.62, 124.70), (39.70, 125.22), (39.73, 125.58), (39.96, 125.83), (40.10, 126.08), (40.50, 126.02), (40.62, 126.15),
              (40.40, 126.32), (40.15, 126.40), (40.10, 126.80), (40.30, 127.30), (40.60, 128.00), (40.78, 128.70), (40.85, 129.40),
              (40.85, 129.90)],
    # 24 Nov 1950: Eighth Army Chongju - Ipsok - Tokchon; the empty Taebaek gap; X Corps Yudam-ni (Chosin) - Hyesanjin; ROK I Corps near Chongjin
    "nov24": [(39.58, 124.70), (39.68, 125.20), (39.85, 125.45), (39.97, 125.80), (39.86, 126.05), (39.75, 126.30), (39.55, 126.55),
              (39.42, 126.90), (39.70, 127.05), (40.10, 127.02), (40.48, 127.11), (40.75, 127.35), (41.10, 127.80), (41.40, 128.18),
              (41.55, 128.80), (41.85, 129.40), (41.95, 129.85), (41.95, 130.30)],
    # ~15 Dec 1950: Eighth Army back near the 38th parallel; X Corps in the Hungnam perimeter (POCKETS)
    "dec15": [(38.00, 124.90), (38.00, 125.40), (37.98, 126.00), (38.00, 126.60), (38.10, 126.90), (38.20, 127.20), (38.25, 127.60),
              (38.15, 128.00), (38.10, 128.60), (38.10, 129.20)],
    # 26 Dec 1950: the Imjin / 38th parallel line north of Seoul (Hungnam evacuated 24 Dec)
    "dec26": [(37.72, 125.90), (37.76, 126.55), (37.95, 126.75), (38.08, 127.05), (38.18, 127.40), (38.10, 127.80), (38.05, 128.30),
              (38.08, 128.65), (38.08, 129.20)],
    # 7 Jan 1951: Line D, Pyongtaek - Ansong - Wonju - Samchok
    "jan7": [(36.92, 126.30), (36.98, 126.85), (36.99, 127.09), (37.01, 127.27), (37.15, 127.60), (37.34, 127.92), (37.40, 128.40),
             (37.45, 128.90), (37.45, 129.17), (37.45, 129.70)],
    # ~15 Mar 1951: Seoul retaken (14-15 Mar), UN line just north of the Han / Seoul to the east coast
    "mar15": [(37.66, 125.90), (37.72, 126.55), (37.66, 126.95), (37.68, 127.35), (37.70, 127.88), (37.80, 128.40), (37.95, 128.75),
              (37.95, 129.30)],
    # 27 Jul 1953: armistice line (Han estuary - Panmunjom - Chorwon - Kumhwa - Punchbowl - coast north of the parallel at Kosong)
    "jul53": [(37.70, 125.90), (37.76, 126.20), (37.92, 126.62), (37.96, 126.68), (38.10, 126.90), (38.25, 127.05), (38.30, 127.25),
              (38.32, 127.45), (38.28, 127.75), (38.30, 128.05), (38.40, 128.20), (38.61, 128.36), (38.62, 128.90)],
}
CLOSE = {"sep15": lambda f: [(36.41, 130.4), (34.2, 130.4), (34.2, 128.33)]}
POCKETS = {"dec15": [[(40.00, 127.40), (40.05, 127.62), (39.95, 127.85), (39.80, 127.90), (39.72, 127.55), (39.85, 127.40)]]}  # Hungnam

def mask(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def chaikin(pts, k=2):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts

def resample(line, step=14.0):
    p = chaikin([P(*q) for q in line]); seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
    t = np.arange(0, s[-1] + 1e-6, step)
    return np.c_[np.interp(t, s, p[:, 0]), np.interp(t, s, p[:, 1])]

def land_part(pts, land):
    H, W = land.shape; lw = ndimage.binary_dilation(land, iterations=4)
    ok = [0 <= x < W and 0 <= y < H and lw[int(y), int(x)] for x, y in pts]
    idx = [i for i, o in enumerate(ok) if o]
    return pts[idx[0]: idx[-1] + 1] if idx else pts

def build(date, land, korea, japan):
    H, W = land.shape
    f = FRONTS[date]; close = CLOSE.get(date, E_CLOSE)(f)
    un = mask([f + close] + POCKETS.get(date, []), W, H) & korea & land
    com = land & ~un & ~japan
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~com) * (4.0 if BASE == "nwkorea" else 1.0)  # rim falloff in km-ish          # strongest red right at the front
    out[un, :3] = (232, 52, 52); out[un, 3] = (0.67 + 0.25 * np.exp(-d / 40.0))[un]
    out[com, :3] = (110, 160, 255); out[com, 3] = 0.565
    far = com & ~korea                                 # China / USSR a little lighter than Korea's communist ground
    out[far, 3] = 0.42
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(com & korea, iterations=3)).astype(np.float32), 4) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{PFX}_ctl_{date}_mx.png", optimize=True)
    fl = land_part(resample(f), land)
    json.dump([[round(x, 1), round(y, 1)] for x, y in fl], open(f"assets/media/{PFX}_front_{date}.json", "w"))
    print("wrote %s_ctl_%s_mx.png + front (%d pts)" % (PFX, date, len(fl)))

if __name__ == "__main__":
    land = np.array(Image.open(f"assets/{BASE}_land.png").convert("L")) > 127
    H, W = land.shape
    korea, japan = mask([KOREA], W, H), mask([JAPAN], W, H)
    for date in (ARGS or ["nov24", "dec15", "dec26", "jan7", "jun25", "sep15", "oct24", "mar15", "jul53"]):
        build(date, land, korea, japan)
    p38 = land_part(resample([(38.0, 124.4), (38.0, 129.0)], 10.0), land)
    json.dump([[round(x, 1), round(y, 1)] for x, y in p38], open(f"assets/media/{PFX}_38th.json", "w"))
    print("wrote", PFX + "_38th.json")
