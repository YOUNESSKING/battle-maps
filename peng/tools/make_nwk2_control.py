"""MOVE 2 (Second Phase, 24-28 Nov 1950) control maps on the `nwkorea` basemap (z9), option 1 multiply look. Same colours, Yalu border
and helpers as tools/make_nwkorea_control.py (move 1 agent; imported read-only): communist-held = blue (110,160,255) a=0.565 (China 0.42);
UN-held = red (232,52,52) with the bright rim on the front.
Sources + notes for every line: research/FACT_NOTES_move2.md ("control map"). Approximate to ~3-5 km.
usage (from peng/): python3 tools/make_nwk2_control.py
 -> assets/media/nwk2_ctl_<date>_mx.png  (2880x1620 multiply overlay; dates nov24, nov26, nov28)
 -> assets/media/nwk2_fronts.json       {"places": {...}, "<date>": [[x,y]...]} map px, fronts WEST -> EAST (communist side on the LEFT
    of travel = K.front({ sideA: "carth", sideB: "rome" }))"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_nwkorea_control as M

# X Corps + the Taebaek gap, shared by all three dates (Mossman ch. III-V, map 3-5): the empty mountains between the ROK II Corps right
# flank and the X Corps (the line dips to ~39.35N), then Yudam-ni (Chosin) north-east to Hyesanjin on the Yalu and up the NE coast.
GAP_XCORPS = [(39.35, 126.85), (39.38, 127.02), (39.70, 127.10), (40.10, 127.05), (40.48, 127.11), (40.75, 127.35), (41.10, 127.80),
              (41.40, 128.18), (41.55, 128.80), (41.85, 129.40), (41.95, 129.85), (41.95, 130.40)]
FRONTS = {
    # 24 Nov (H-hour 1000): I Corps on Route 1 half-way to Chongju + ROK 1st Div 4 mi short of Taechon; 25th Div astride the Kuryong
    # ~4 mi SE of Unsan; 2nd Div massed on the Paengnyong River in the Chongchon valley (its 15-mile front ~20 mi N of Kunu-ri on the
    # 25th); ROK II Corps (7th, 8th Divs) in the mountains north of Tokchon, its right flank open.
    "nov24": [(39.52, 124.90), (39.62, 125.15), (39.70, 125.30), (39.82, 125.42), (39.87, 125.52), (39.90, 125.68), (39.92, 125.82),
              (39.97, 125.94), (40.00, 126.04), (39.98, 126.14), (39.93, 126.26), (39.88, 126.40), (39.80, 126.52), (39.62, 126.64),
              (39.45, 126.75)] + GAP_XCORPS,
    # 26 Nov noon: the I Corps in Chongju, the US divisions hit but holding; the ROK II Corps front has folded: Chinese 10 mi south in
    # Tokchon by late morning; the line now bends back south-west from the 2nd Division's right (open flank).
    "nov26": [(39.52, 124.90), (39.64, 125.18), (39.72, 125.30), (39.84, 125.43), (39.88, 125.53), (39.90, 125.68), (39.91, 125.82),
              (39.95, 125.93), (39.96, 126.02), (39.88, 126.07), (39.78, 126.10), (39.68, 126.15), (39.58, 126.24), (39.48, 126.42),
              (39.40, 126.62)] + GAP_XCORPS,
    # 28 Nov: withdrawal ordered. I Corps pulling back to the Chongchon bridgehead (Pakchon), 25th Div on the Ipsok line, 2nd Div
    # below Pugwon (lost night 27-28), Turks thrown back from Wawon to Sinnim-ni; Chinese 38th Army heading for Kunu-ri and the
    # Samso-ri area, 42nd Army swinging south-west toward Sunchon (via Pukchang).
    "nov28": [(39.52, 125.05), (39.62, 125.30), (39.70, 125.48), (39.77, 125.58), (39.82, 125.72), (39.86, 125.85), (39.80, 125.93),
              (39.75, 125.98), (39.72, 126.03), (39.64, 126.04), (39.55, 126.06), (39.47, 126.10), (39.40, 126.22), (39.33, 126.45),
              (39.30, 126.65)] + GAP_XCORPS,
}
PLACES = dict(M.PLACES, wawon=(39.721, 126.069), pugwon=(39.784, 125.943), pukchang=(39.572, 126.301), ipsok=(39.88, 125.88),
              yudamni=(40.48, 127.11), hagaru=(40.38, 127.25), hyesanjin=(41.40, 128.18), maengsan=(39.65, 126.68), samsori=(39.55, 126.00))

if __name__ == "__main__":
    BASE = M.BASE; P = M.P
    land = np.array(Image.open(f"assets/{BASE}_land.png").convert("L")) > 127
    H, W = land.shape
    R = json.load(open(f"assets/src/{BASE}_rivers_osm.json"))["압록강"]
    yalu = [l for x in R if x["osm_type"] == "relation" for l in x["geojson"]["coordinates"]]
    yalu = max(yalu, key=len); yalu = [(la, lo) for lo, la in yalu]
    if yalu[0][1] < yalu[-1][1]: yalu = yalu[::-1]
    korea = M.mask_poly([yalu + [(39.6, 124.25), (39.3, 123.6), (37.4, 123.6), (37.4, 131.5), (42.6, 131.5), (42.6, yalu[0][1])]], W, H)
    out_json = {"places": {k: [round(v, 1) for v in P(*q)] for k, q in PLACES.items()}}
    for date, f in FRONTS.items():
        un = M.mask_poly([f + [(f[-1][0], 131.6), (37.0, 131.6), (37.0, 123.2), (f[0][0], 123.2)]], W, H)
        un &= korea & land
        com = land & ~un
        out = np.zeros((H, W, 4), np.float32)
        d = ndimage.distance_transform_edt(~com)
        out[un, :3] = (232, 52, 52); out[un, 3] = (0.67 + 0.25 * np.exp(-d / 40.0))[un]
        out[com, :3] = (110, 160, 255); out[com, 3] = 0.565
        far = com & ~korea; out[far, 3] = 0.42
        rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(com & korea, iterations=3)).astype(np.float32), 4) * 3.0
        rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
        out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
        Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/nwk2_ctl_{date}_mx.png", optimize=True)
        out_json[date] = M.land_part(M.resample(f, 10.0), land)
        print("wrote", f"nwk2_ctl_{date}_mx.png")
    json.dump(out_json, open("assets/media/nwk2_fronts.json", "w"), separators=(",", ":"))
    print("wrote nwk2_fronts.json")
