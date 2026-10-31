"""MOVE 1 / MOVE 2 control overlays (option 1, multiply look; Cleburne #14, map agent for move1a/move1e/move2a/move2b).
Hero = Confederate = BLUE (110,160,255); Union = RED (A4 lighter red 240,105,95) + bright rim on the red side where they meet.
Adapted from sherman/tools/make_m3_control.py (render) with the colours swapped for this video (hero always blue).
Fronts are hand-placed (~1 km accuracy on `tunnel`, ~5 km on `chatt`) from research/maps_ref (Jespersen Missionary Ridge, Sholl 1865):
  m1_tunnel_ctl_nov24_mx.png  evening 24 Nov 1863: Union holds Chattanooga, the plain to the west foot of Missionary Ridge, Lookout,
                              the north bank and Sherman's bridgehead (Billy Goat Hill); Confederates hold the ridge and all ground east.
  m1_tunnel_ctl_nov25_mx.png  night 25 Nov: the ridge lost; Confederates east of South Chickamauga Creek (Cleburne the rear guard).
  m2_chatt_ctl_nov26_mx.png   26 Nov: Union up to Chickamauga Creek / Graysville; Confederates retreating toward Ringgold - Dalton.
  m2_chatt_ctl_nov27_mx.png   27 Nov: Hooker at Ringgold; front on Taylor's Ridge (Ringgold Gap).
  m2_ringgold_ctl_nov27_mx.png 27 Nov morning on `ringgold`: Union in the town, Confederates on Taylor's Ridge / White Oak Mountain and east.
usage (from cleburne/): python3 tools/m1m2_make_control.py ; then python3 tools/make_loss_layers.py m1_tunnel_ctl nov24 nov25 ;
                        python3 tools/make_loss_layers.py m2_chatt_ctl nov26 nov27"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

def proj(base):
    J = json.load(open(f"assets/{base}_hd_lift.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P

def render(land, hero, name):
    hero = hero & land; un = land & ~hero
    out = np.zeros(land.shape + (4,), np.float32)
    d = ndimage.distance_transform_edt(~hero)
    out[un, :3] = (240, 105, 95); out[un, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[un]
    out[hero, :3] = (110, 160, 255); out[hero, 3] = 0.565
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(hero, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 130, 115); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}", optimize=True)
    print("wrote", name)

def poly(pts):
    im = Image.new("L", (2880, 1620), 0); ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255); return np.array(im) > 0

def land_of(base):
    a = np.array(Image.open(f"assets/{base}_land.png").convert("L").resize((2880, 1620))); return a > 127

# ---------- tunnel (z13), world px ----------
RIVER_NE = [(2045, 0), (2010, 150), (1960, 300), (1880, 390), (1800, 470), (1700, 520), (1600, 545), (1530, 585), (1505, 620)]   # lake -> creek mouth
SADDLE_W = [(1515, 760), (1495, 792), (1462, 800), (1440, 801), (1418, 806)]                                                     # south of Billy Goat Hill
RIDGE_FOOT = [(1398, 840), (1372, 900), (1345, 965), (1318, 1040), (1295, 1105), (1268, 1170), (1220, 1270), (1170, 1360), (1128, 1430), (1095, 1520), (1075, 1620)]
CREEK = [(1505, 620), (1525, 700), (1515, 760), (1530, 800), (1570, 835), (1610, 900), (1650, 1000), (1720, 1080), (1800, 1180), (1880, 1300), (1964, 1429), (2050, 1620)]
def tunnel():
    land = land_of("tunnel")
    c24 = poly(RIVER_NE + [(1525, 700)] + SADDLE_W + RIDGE_FOOT + [(2880, 1620), (2880, 0)])
    render(land, c24, "m1_tunnel_ctl_nov24_mx.png")
    c25 = poly(RIVER_NE + CREEK[1:] + [(2880, 1620), (2880, 0)])
    render(land, c25, "m1_tunnel_ctl_nov25_mx.png")

# ---------- chatt (z10), lat/lon ----------
def chatt():
    P = proj("chatt"); land = land_of("chatt")
    NE = [(36.05, -83.10), (35.62, -84.10), (35.40, -84.80), (35.25, -84.98), (35.13, -85.12), (35.095, -85.225)]   # east TN front -> creek mouth
    SW = [(34.90, -85.27), (34.84, -85.38), (34.70, -85.50), (34.55, -85.65), (34.42, -85.85), (34.36, -86.20), (34.45, -86.60), (34.62, -86.95), (34.66, -87.20)]
    LL = lambda pts: [P(*q) for q in pts]
    tail = LL([(34.66, -87.20), (33.30, -87.20), (33.30, -83.00), (36.05, -83.00)])
    n26 = NE + [(35.035, -85.165), (34.980, -85.140), (34.930, -85.180)] + SW
    render(land, poly(LL(n26) + tail), "m2_chatt_ctl_nov26_mx.png")
    n27 = NE + [(35.040, -85.110), (34.975, -85.085), (34.918, -85.098), (34.880, -85.150), (34.900, -85.230)] + SW
    render(land, poly(LL(n27) + tail), "m2_chatt_ctl_nov27_mx.png")

# ---------- ringgold (z13), world px: 27 Nov morning, Hooker in the town, Cleburne on the ridges east of it ----------
RG_FOOT = [(1585, 0), (1540, 300), (1500, 600), (1452, 800), (1440, 950), (1432, 978), (1415, 1040), (1390, 1110), (1350, 1250), (1300, 1400), (1260, 1620)]
def ringgold():
    render(land_of("ringgold"), poly(RG_FOOT + [(2880, 1620), (2880, 0)]), "m2_ringgold_ctl_nov27_mx.png")

if __name__ == "__main__":
    tunnel(); chatt(); ringgold()
