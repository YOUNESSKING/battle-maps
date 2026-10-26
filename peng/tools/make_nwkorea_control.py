"""MOVE 1 (Unsan, First Phase, Oct-Nov 1950) control maps on the `nwkorea` basemap (z9), option 1 multiply look (same colours as
tools/make_korea_control.py): communist-held = blue (110,160,255) a=0.565 (China lighter, 0.42); UN-held = red (232,52,52) with the bright
rim on the front. Korea/China border = the real Yalu (OSM, assets/src/nwkorea_rivers_osm.json).
UN ground per date = (south of a base front, west -> east) + valley "fingers" (the separate columns, buffered road corridors).
Sources + notes for every line: research/FACT_NOTES_nwkorea.md ("control map"). Approximate to ~2-5 km.
usage (from peng/): python3 tools/make_nwkorea_control.py
 -> assets/media/nwkorea_ctl_<date>_mx.png  (2880x1620 multiply overlay; dates oct24, nov1, nov6)
 -> assets/media/nwkorea_fronts.json       {"places": {...}, "<date>": {"base": [[x,y]...], "fingers": [[[x,y]...]...]}} map px
    (base fronts run WEST -> EAST, communist side on the LEFT of travel = K.front({ sideA: "carth", sideB: "rome" }))"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

BASE = "nwkorea"
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; MPP = J["meters_per_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

PLACES = dict(unsan=(39.968, 125.825), ipsok=(39.895, 125.86), yongbyon=(39.814, 125.805), onjong=(40.06, 125.99), huichon=(40.171, 126.276),
              kojang=(40.57, 125.92), chosan=(40.831, 125.805), kujang=(39.869, 126.028), kunuri=(39.700, 125.900), anju=(39.617, 125.661),
              pakchon=(39.723, 125.582), taechon=(39.922, 125.494), kusong=(39.979, 125.252), chongju=(39.693, 125.210),
              chonggo=(39.93, 124.68), sinuiju=(40.100, 124.398), manpojin=(41.155, 126.288), pyongyang=(39.019, 125.738),
              tokchon=(39.766, 126.313), sunchon=(39.420, 125.948), wonni=(39.60, 126.05), hamhung=(39.918, 127.536),
              hungnam=(39.832, 127.618), wonsan=(39.153, 127.443), sudong=(40.08, 127.33), pukchong=(40.198, 128.335),
              songjin=(40.670, 129.193), iwon=(40.32, 128.65), pukchin=(40.202, 125.748), sinanju=(39.596, 125.606),
              yongsandong=(39.80, 125.66), kanggye=(40.971, 126.594), antung=(40.124, 124.392))

# ---- base fronts (lat, lon), WEST -> EAST: the sea at both ends; UN ground = south of the line ----
FRONTS = {
    # 24 Oct: the columns had only just crossed the Chongchon (27th Bde at Pakchon, ROK 1st at Yongbyon, ROK 6th/8th up the
    # Chongchon valley); the base is the Chongchon line, the columns are the fingers below. X Corps: Wonsan - Hamhung coast.
    "oct24": [(39.58, 124.95), (39.66, 125.30), (39.73, 125.50), (39.74, 125.62), (39.72, 125.80), (39.66, 125.98), (39.55, 126.10),
              (39.42, 126.30), (39.30, 126.55), (39.22, 126.85), (39.25, 127.10), (39.45, 127.25), (39.80, 127.30), (39.98, 127.45),
              (40.05, 127.75), (40.15, 128.05), (40.25, 128.40), (40.45, 128.85), (40.62, 129.15), (40.80, 129.45), (40.85, 129.95)],
    # 1 Nov: the high-water mark in the west (24th Div at Chonggo-dong, 5th RCT N of Kusong), the Unsan salient, then the ROK II
    # Corps collapse: the line pivots south at Kunu-ri (ROK 7th Div pushed back to Won-ni), the open right flank, the gap, X Corps.
    "nov1": [(39.86, 124.50), (39.93, 124.68), (39.86, 124.92), (39.98, 125.12), (40.12, 125.24), (40.02, 125.40), (39.93, 125.52),
             (39.88, 125.66), (39.98, 125.78), (40.00, 125.84), (39.95, 125.90), (39.86, 125.93), (39.76, 125.96), (39.66, 126.03),
             (39.56, 126.04), (39.44, 126.08), (39.32, 126.30), (39.24, 126.60), (39.20, 126.90), (39.30, 127.15), (39.60, 127.25),
             (39.95, 127.25), (40.10, 127.33), (40.05, 127.55), (40.15, 127.90), (40.25, 128.30), (40.45, 128.80), (40.65, 129.12),
             (40.82, 129.40), (40.88, 129.95)],
    # 6 Nov: Eighth Army back behind the Chongchon with a bridgehead north of it (river mouth - Pakchon - S of Yongsan-dong / Ipsok
    # - back to the river near Kunu-ri), then east along the river's south bank into the Taebaek; X Corps as on 1 Nov.
    "nov6": [(39.55, 125.30), (39.66, 125.42), (39.76, 125.52), (39.80, 125.62), (39.82, 125.74), (39.80, 125.86), (39.74, 125.95),
             (39.68, 126.02), (39.64, 126.20), (39.60, 126.42), (39.45, 126.60), (39.28, 126.80), (39.25, 127.05), (39.45, 127.22),
             (39.80, 127.27), (40.02, 127.30), (40.05, 127.55), (40.15, 127.90), (40.25, 128.30), (40.45, 128.80), (40.65, 129.12),
             (40.82, 129.40), (40.88, 129.95)],
}
# ---- valley fingers (the separate columns): road corridors (lat, lon), width km ----
FINGERS = {
    "oct24": [([(39.62, 125.58), (39.72, 125.58), (39.75, 125.52)], 7),                       # 27th Bde / 24th Div at Pakchon
              ([(39.66, 125.72), (39.814, 125.805), (39.90, 125.82)], 6),                     # ROK 1st Div: Yongbyon, toward Unsan
              ([(39.62, 125.95), (39.70, 125.90), (39.869, 126.028), (40.02, 126.15), (40.171, 126.276)], 7),  # ROK 6th/8th: Chongchon valley to Huichon
              ([(40.171, 126.276), (40.12, 126.12), (40.06, 125.99)], 5),                     # ROK 6th Div west to Onjong
              ([(39.918, 127.536), (40.00, 127.42), (40.08, 127.33)], 6)],                    # ROK 3rd Div NW from Hamhung toward Sudong
    "nov1": [([(39.918, 127.536), (40.00, 127.42), (40.08, 127.33)], 6)],
    "nov6": [([(39.918, 127.536), (40.00, 127.42), (40.08, 127.33)], 6)],
}

def mask_poly(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0
def mask_lines(lines, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for line, km in lines:
        w = max(4, int(km * 1000 / MPP)); pts = [P(*q) for q in line]
        d.line(pts, fill=255, width=w, joint="curve")
        for x, y in (pts[0], pts[-1]): d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    return ndimage.gaussian_filter((np.array(im) > 0).astype(np.float32), 2) > 0.5

def chaikin(pts, k=2):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts
def resample(line, step=12.0):
    p = chaikin([P(*q) for q in line]); seg = np.hypot(*np.diff(p, axis=0).T); s = np.r_[0, np.cumsum(seg)]
    t = np.arange(0, s[-1] + 1e-6, step)
    return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in t]
def land_part(pts, land):
    H, W = land.shape; lw = ndimage.binary_dilation(land, iterations=3)
    ok = [0 <= x < W and 0 <= y < H and lw[int(y), int(x)] for x, y in pts]
    idx = [i for i, o in enumerate(ok) if o]
    return pts[idx[0]: idx[-1] + 1] if idx else pts

if __name__ == "__main__":
    land = np.array(Image.open(f"assets/{BASE}_land.png").convert("L")) > 127
    H, W = land.shape
    R = json.load(open(f"assets/src/{BASE}_rivers_osm.json"))["압록강"]
    yalu = [l for x in R if x["osm_type"] == "relation" for l in x["geojson"]["coordinates"]]
    yalu = max(yalu, key=len); yalu = [(la, lo) for lo, la in yalu]
    if yalu[0][1] < yalu[-1][1]: yalu = yalu[::-1]                    # source (east) -> mouth (west)
    korea = mask_poly([yalu + [(39.6, 124.25), (39.3, 123.6), (37.4, 123.6), (37.4, 131.5), (42.6, 131.5), (42.6, yalu[0][1])]], W, H)
    out_json = {"places": {k: [round(v, 1) for v in P(*q)] for k, q in PLACES.items()}}
    for date, f in FRONTS.items():
        un = mask_poly([f + [(f[-1][0], 131.6), (37.0, 131.6), (37.0, 123.2), (f[0][0], 123.2)]], W, H)
        un |= mask_lines(FINGERS[date], W, H)
        un &= korea & land
        com = land & ~un
        out = np.zeros((H, W, 4), np.float32)
        d = ndimage.distance_transform_edt(~com)
        out[un, :3] = (232, 52, 52); out[un, 3] = (0.67 + 0.25 * np.exp(-d / 40.0))[un]
        out[com, :3] = (110, 160, 255); out[com, 3] = 0.565
        far = com & ~korea; out[far, 3] = 0.42                         # China a little lighter (same as the korea overlays)
        rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(com & korea, iterations=3)).astype(np.float32), 4) * 3.0
        rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
        out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
        Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{BASE}_ctl_{date}_mx.png", optimize=True)
        out_json[date] = {"base": land_part(resample(f), land), "fingers": [resample(l, 10.0) for l, _ in FINGERS[date]]}
        print("wrote", f"{BASE}_ctl_{date}_mx.png")
    json.dump(out_json, open(f"assets/media/{BASE}_fronts.json", "w"), separators=(",", ":"))
    print("wrote", f"{BASE}_fronts.json")
