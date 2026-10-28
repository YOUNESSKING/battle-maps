"""Hook-only control overlays on the `atlanta` basemap (z11, 33.64N 84.42W), Sherman #13 hook agent (the move-1 agent owns the real
atlanta_* files; these are the hook's own coarse versions so hook-1's zoom target and hook-2 do not wait for them).
Union-held = blue (110,160,255); Confederate-held = red (232,52,52). Same polygons as tools/make_south_control.py (GA_AUG64 / GA_SEP64)
refined around the city:
- aug64 (~23-25 Aug 1864): Union lines arc around the NORTH and WEST of Atlanta from the Georgia RR side (NE) to Utoy Creek (SW); the
  city, its east and south (East Point, Rough and Ready, Jonesboro, the Macon & Western RR) Confederate.
- sep64 (2-8 Sep 1864): Atlanta and East Point Union; Hood at Lovejoy's Station (red south of ~Rough and Ready).
Notes: research/FACT_NOTES_south.md (Hook section).
-> assets/media/hook_atl_ctl_<date>_mx.png (2880x1620 multiply overlay)
usage (from sherman/): python3 tools/make_hook_atl_control.py"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/atlanta.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

N, Wd, E = 34.40, -85.60, -83.20
# fronts (lat, lon), east -> south-west; Union ground = north/west of the line (closed round the north-west corner)
FRONT = {
    "aug64": [(34.05, -84.20), (33.80, -84.18), (33.80, -84.27), (33.805, -84.335), (33.797, -84.372), (33.792, -84.405), (33.778, -84.430),
              (33.752, -84.446), (33.726, -84.458), (33.703, -84.476), (33.685, -84.505), (33.660, -84.550), (33.620, -84.620),
              (33.550, -84.750), (33.450, -84.950), (33.300, -85.20), (33.20, -85.60)],
    "sep64": [(34.05, -84.20), (33.80, -84.18), (33.72, -84.24), (33.66, -84.30), (33.630, -84.360), (33.620, -84.430), (33.635, -84.510),
              (33.620, -84.620), (33.550, -84.750), (33.450, -84.950), (33.300, -85.20), (33.20, -85.60)],
}

def build(date, land):
    H, W = land.shape
    poly = FRONT[date] + [(34.6, -85.8), (34.6, -84.20)]
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon([P(*q) for q in poly], fill=255)
    un = (np.array(im) > 0) & land
    csa = land & ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/hook_atl_ctl_{date}_mx.png", optimize=True)
    print("wrote hook_atl_ctl_%s_mx.png" % date)

if __name__ == "__main__":
    land = np.array(Image.open("assets/atlanta_land.png").convert("L")) > 127
    for d in FRONT: build(d, land)
