"""MOVE 2 (Second Manassas campaign, Aug-Sep 1862) control maps on the `nova` basemap (z10), option 1 multiply look, same colours and
rim as tools/make_virginia_control.py (hook agent; its Washington-defences polygon is reused read-only): Confederate-held = blue
(110,160,255) a=0.565; Union-held = red (232,52,52) with the bright rim where the sides meet. Union = Maryland/Delaware (north of the
real Potomac, OSM via Nominatim) + the Union-held part of Virginia on that date. No state borders.
Sources + notes per date: research/FACT_NOTES_nova.md ("control map"). Approximate to ~2-4 km (z10 = 119 m/px).
usage (from jackson/): python3 tools/make_nova_control.py
 -> assets/media/nova_ctl_<date>_mx.png  (2880x1620 multiply overlay; aug25, aug27, aug28, sep02)
 -> assets/media/nova_fronts.json       {"aug25": [[x,y]...], "sep02": [[x,y]...]} map px, Confederate side on the LEFT of travel
                                         (K.front sideA "carth")"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_nova_geo import P, PLACES, MARCH, chaikin
import make_virginia_control as V  # read-only: the sep62 Washington-defences polygon + Eastern Shore

NM = json.load(open("assets/src/nova_rivers_nominatim.json"))
pot = next(x for x in NM["potomac"] if x["osm_type"] == "relation")["geojson"]["coordinates"]
POT = [(la, lo) for lo, la in pot]                    # downstream: Hancock -> Harpers Ferry -> Washington -> the bay
VA = POT + [(37.80, -76.00), (37.60, -75.60), (37.00, -75.60), (37.00, -80.20), (39.60, -80.20), (39.60, POT[0][1])]

FRONT = {
    # 25 Aug 1862: Pope's Army of Virginia on the Rappahannock from Kelly's Ford / Rappahannock Station up to Sulphur Springs and
    # Waterloo; Burnside's troops at Falmouth + Fredericksburg (town held, evacuated 31 Aug); above Waterloo the line bends north
    # along the Blue Ridge side (as virginia_ctl_aug62: Union cavalry screen, Winchester garrison under White).
    "aug25": [(38.18, -77.20), (38.27, -77.40), (38.285, -77.47), (38.33, -77.53), (38.40, -77.63), (38.46, -77.73), (38.479, -77.781),
              (38.534, -77.808), (38.58, -77.84), (38.62, -77.855), (38.66, -77.865), (38.696, -77.906), (38.72, -77.96), (38.85, -78.10),
              (38.98, -78.25), (39.06, -78.45), (39.10, -78.80), (39.05, -79.00), (39.00, -79.80)],
    # ~2 Sep 1862 (after Chantilly, 1 Sep): Pope inside the Washington defences (Arlington - Alexandria line); Fredericksburg evacuated
    # 31 Aug, Winchester 2 Sep; Harpers Ferry still Union (surrendered 15 Sep) = virginia_ctl_sep62.
    "sep02": [(38.70, -77.06), (38.75, -77.18), (38.84, -77.30), (38.93, -77.27), (38.98, -77.24)],
}
AUG_BACK = [(39.60, -79.80), (39.60, -75.50), (38.18, -75.50)]
JACKSON_27 = MARCH[2:]          # Hinson's Mill -> Bristoe: the corridor Jackson's wing held on 26-27 Aug
POCKET_27 = [(38.700, -77.560), (38.705, -77.505), (38.735, -77.440), (38.770, -77.430), (38.790, -77.470), (38.785, -77.540),
             (38.770, -77.600), (38.735, -77.600)]   # Bristoe Station - Manassas Junction (Ewell at Bristoe, Jackson + Hill at the Junction)

# 28 Aug: Jackson gone from Manassas to Stony Ridge (Groveton - Sudley); Longstreet following his route via Salem / Thoroughfare Gap
STONY_28 = [(38.800, -77.600), (38.812, -77.560), (38.835, -77.525), (38.855, -77.530), (38.850, -77.575), (38.830, -77.610)]
JACKSON_28 = MARCH[2:14] + [(38.815, -77.585)]
def mask_poly(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0
def mask_line(line, km, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im); w = int(km * 1000 / 119.47); pts = [P(*q) for q in chaikin(line, 2)]
    d.line(pts, fill=255, width=w, joint="curve")
    for x, y in (pts[0], pts[-1]): d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    return ndimage.gaussian_filter((np.array(im) > 0).astype(np.float32), 3) > 0.5
def resample(line, step=10.0):
    p = np.array([P(*q) for q in chaikin(line, 2)]); s = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    t = np.arange(0, s[-1] + 1e-6, step); return [[round(float(np.interp(v, s, p[:, 0])), 1), round(float(np.interp(v, s, p[:, 1])), 1)] for v in t]

if __name__ == "__main__":
    land = np.array(Image.open("assets/nova_land.png").convert("L")) > 127
    H, W = land.shape
    va = mask_poly([VA], W, H)
    east = mask_poly([V.EASTERN_SHORE], W, H)
    WDC = V.UNION_VA["sep62"][0]; HF = V.UNION_VA["sep62"][1]
    un = {"aug25": mask_poly([FRONT["aug25"] + AUG_BACK], W, H),
          "aug27": mask_poly([FRONT["aug25"] + AUG_BACK], W, H) & ~mask_line(JACKSON_27, 7, W, H) & ~mask_poly([POCKET_27], W, H),
          "aug28": mask_poly([FRONT["aug25"] + AUG_BACK], W, H) & ~mask_line(JACKSON_28, 7, W, H) & ~mask_poly([STONY_28], W, H),
          "sep02": mask_poly([WDC, HF], W, H)}
    for date, m in un.items():
        u = ((land & ~va) | (m & land) | (east & land))
        csa = land & ~u
        out = np.zeros((H, W, 4), np.float32)
        d = ndimage.distance_transform_edt(~csa)
        out[u, :3] = (232, 52, 52); out[u, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[u]
        out[csa, :3] = (110, 160, 255); out[csa, 3] = 0.565
        rim = ndimage.gaussian_filter((u & ndimage.binary_dilation(csa, iterations=3)).astype(np.float32), 3) * 3.0
        rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
        out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
        Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/nova_ctl_{date}_mx.png", optimize=True)
        print("wrote", f"nova_ctl_{date}_mx.png")
    json.dump({k: resample(v) for k, v in FRONT.items()}, open("assets/media/nova_fronts.json", "w"), separators=(",", ":"))
    print("wrote nova_fronts.json")
