"""Who-controls-the-ground overlays (option 1, multiply look) for the hook / background / ending scenes of Cleburne #14
(hook-a/hook-b/bg-a/ending agent; other agents may reuse them read-only). SIDES SWAPPED vs. Sherman #13: Confederate (hero) ground =
BLUE (110,160,255) alpha 0.565; Union ground = RED, A4 lighter red (240,105,95), 0.62 + 0.25 near the border, red rim at the front.
One lat/lon definition per date, rendered into every map's pixel space so the maps match during the continuous zoom:
  oct63   siege (before the Cracker Line, 27-28 Oct): Union = Chattanooga pocket; Confederates hold Lookout Valley, Lookout Mountain,
          Missionary Ridge and SE Tennessee (Cleveland - Loudon railroad to Longstreet).
  nov23   after the Cracker Line + Orchard Knob (23 Nov): Lookout Valley Union; pocket out to Orchard Knob.
  nov24   Lookout Mountain taken (24 Nov); Sherman's bridgehead at the north end (Billy Goat Hill) facing Tunnel Hill.
  nov25e  evening 25 Nov: the ridge centre Union (Thomas), Rossville Union (Hooker); Cleburne still holds Tunnel Hill (north end).
  nov27   27 Nov: Union pursuit at Ringgold (town Union, Taylor's Ridge / White Oak Mountain and the gap Confederate).
Upper East Tennessee (Longstreet at Knoxville, Nov 1863) Confederate; Knoxville city Union. North Alabama above the Tennessee River Union.
Approximate to ~1-3 km (fine enough for z8/z10; z13 fronts are drawn in the scenes). Notes: research/FACT_NOTES.md (control map).
-> assets/media/hka_<map>_ctl_<date>_mx.png ; ga = the hook crop (ga px 900..2100 x 300..975) -> also assets/media/hka_ga_crop.jpg
usage (from cleburne/): python3 tools/hka_make_control.py [map:date ...]"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

STATES = "/home/user/battle-maps/sherman/assets/src/south_ne_states.geojson"
GA_CROP = (900, 300, 2100, 975)
MAPS = {m: json.load(open(f"assets/{m}_hd_lift.json")) for m in ("ga", "chatt", "tunnel", "ringgold")}

def proj(m):
    J = MAPS[m]; Z = J["zoom"]; OX, OY = J["origin_world_px"]
    dx, dy = (GA_CROP[0], GA_CROP[1]) if m == "ga" else (0, 0)
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX - dx, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY - dy)
    return P

def rg_ll(x, y):   # ringgold map px -> lat, lon
    J = MAPS["ringgold"]; n = 256 * 2 ** J["zoom"]; X, Y = x + J["origin_world_px"][0], y + J["origin_world_px"][1]
    return (math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * Y / n)))), X / n * 360 - 180)

UNION_STATES = {"Kentucky", "West Virginia", "Missouri", "Illinois", "Indiana", "Ohio", "Maryland", "Delaware", "District of Columbia", "Pennsylvania", "New Jersey"}
NE_TN63 = [(36.75, -83.85), (36.10, -83.85), (35.99, -83.80), (35.80, -83.55), (35.55, -83.0), (35.55, -81.4), (36.75, -81.4)]
N_ALA = [(35.10, -88.30), (34.86, -88.10), (34.80, -87.68), (34.72, -87.30), (34.61, -86.98), (34.50, -86.60), (34.36, -86.29),
         (34.55, -86.15), (34.65, -86.03), (34.80, -85.85), (34.95, -85.71), (35.10, -85.60)]
# SE Tennessee Confederate pocket: west boundary (south -> north, ends at the Tennessee River) + the common east part
SE_EAST = [(35.20, -85.05), (35.45, -84.80), (35.75, -84.40), (35.95, -84.05), (36.10, -83.95), (36.75, -83.85), (36.75, -81.4), (34.985, -81.4)]
KNOX = [(35.96 + 0.05 * math.sin(a / 8 * math.pi), -83.92 + 0.06 * math.cos(a / 8 * math.pi)) for a in range(16)]   # Burnside besieged in Knoxville
SE_WEST = {
    "oct63": [(34.985, -85.62), (35.03, -85.50), (35.05, -85.42), (35.04, -85.37), (35.028, -85.345), (35.018, -85.33), (35.022, -85.305),
              (35.032, -85.29), (35.05, -85.285), (35.07, -85.27), (35.088, -85.236)],
    "nov23": [(34.985, -85.405), (35.005, -85.372), (35.024, -85.35), (35.016, -85.332), (35.02, -85.305), (35.035, -85.278), (35.058, -85.27),
              (35.075, -85.262), (35.088, -85.236)],
    "nov24": [(34.985, -85.312), (35.0, -85.298), (35.02, -85.285), (35.04, -85.274), (35.06, -85.262), (35.074, -85.256), (35.083, -85.246),
              (35.093, -85.228)],
    "nov25e": [(34.985, -85.262), (35.0, -85.258), (35.03, -85.255), (35.055, -85.25), (35.067, -85.256), (35.077, -85.259), (35.086, -85.246),
               (35.093, -85.228)],
}
SE_NOV27 = [(34.985, -85.082), (35.03, -85.06), (35.08, -85.02), (35.15, -84.97), (35.30, -84.80), (35.50, -84.70)] + SE_EAST[2:]
ALA_NE = [(35.0, -85.75), (34.85, -85.86), (34.72, -85.60), (35.0, -85.55)]
LOOKOUT_W = [(34.85, -85.45), (34.72, -85.53), (34.72, -86.2), (34.995, -86.2)]   # Union west of Lookout's crest (GA part)
# Ringgold, 27 Nov: the west face of White Oak Mountain / Taylor's Ridge (ringgold map px, north -> south), traced on the relief
RG_FRONT = [(1560, 0), (1520, 400), (1490, 760), (1465, 800), (1450, 900), (1440, 968), (1412, 1025), (1392, 1125)]
GA_UNION = {
    "oct63": [],
    "nov23": [[(34.995, -85.405)] + LOOKOUT_W],
    "nov24": [[(34.995, -85.312), (34.96, -85.33), (34.92, -85.38)] + LOOKOUT_W],
    "nov25e": [[(34.995, -85.262), (34.96, -85.275), (34.92, -85.31), (34.88, -85.38)] + LOOKOUT_W],
    "nov27": [[(34.995, -85.077)] + [rg_ll(*q) for q in RG_FRONT + [(1300, 1400), (1260, 1620)]] + [(34.72, -85.18), (34.74, -85.30), (34.73, -85.45)] + LOOKOUT_W[1:]],
}

def rings(g):
    return [g["coordinates"][0]] if g["type"] == "Polygon" else [p[0] for p in g["coordinates"]]

def poly_mask(P, polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def build(m, date):
    P = proj(m)
    land = np.array(Image.open(f"assets/{m}_land.png").convert("L")) > 127
    if m == "ga": land = land[GA_CROP[1]:GA_CROP[3], GA_CROP[0]:GA_CROP[2]]
    H, W = land.shape
    SM = {f["properties"]["name"]: poly_mask(P, [[(la, lo) for lo, la in r] for r in rings(f["geometry"])], W, H) for f in json.load(open(STATES))["features"]}
    un = np.zeros_like(land)
    for s in UNION_STATES: un |= SM.get(s, False)
    un |= SM["Tennessee"] & ~poly_mask(P, [NE_TN63], W, H)
    un |= SM["Alabama"] & poly_mask(P, [N_ALA], W, H)
    for poly in GA_UNION[date]: un |= SM["Georgia"] & poly_mask(P, [poly], W, H)
    if date != "oct63": un |= SM["Alabama"] & poly_mask(P, [ALA_NE], W, H)   # Sand Mountain / Wills Valley behind Hooker
    pocket = (SE_WEST[date] + SE_EAST) if date in SE_WEST else SE_NOV27
    un &= ~poly_mask(P, [pocket], W, H)
    un |= SM["Tennessee"] & poly_mask(P, [KNOX], W, H)
    un &= land; csa = land & ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~csa)
    out[un, :3] = (240, 105, 95); out[un, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[un]
    out[csa, :3] = (110, 160, 255); out[csa, 3] = 0.565
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(csa, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (240, 105, 95); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/hka_{m}_ctl_{date}_mx.png", optimize=True)
    print("wrote", f"hka_{m}_ctl_{date}_mx.png", W, H)

if __name__ == "__main__":
    if not sys.argv[1:] or "crop" in sys.argv[1:]:
        im = Image.open("assets/ga_hd_lift.jpg"); k = im.size[0] // 2880
        im.crop(tuple(v * k for v in GA_CROP)).save("assets/media/hka_ga_crop.jpg", quality=90); print("wrote hka_ga_crop.jpg")
    for a in sys.argv[1:] or ["ga:nov27", "ga:nov25e", "chatt:nov24", "chatt:nov27", "tunnel:nov24", "tunnel:nov27", "ringgold:nov24", "ringgold:nov27"]:
        if a == "crop": continue
        m, d = a.split(":"); build(m, d)
