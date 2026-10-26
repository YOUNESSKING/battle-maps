"""Gettysburg campaign control maps (option 1, multiply look) on the `penn` basemap (z9, 39.40N 77.60W), Meade #12.
SIDES (Meade video): Union-held = blue (110,160,255) (hero); Confederate-held = red (232,52,52) with the alpha boost + bright rim on the
red side where the two meet (same treatment as the jackson tools, colours swapped).
Confederate-held = 1861 Virginia minus the Union-held pockets of that date + the ground Lee's army occupies north of the Potomac on
that date. Everything else on land (Pennsylvania, Maryland, Delaware, New Jersey, Ohio, Union West Virginia) = Union.
No state borders drawn. Sources + notes per date: research/FACT_NOTES_penn.md (approximate to ~3-5 km; z9 = 236 m/px).
-> assets/media/penn_ctl_<date>_mx.png  (2880x1620 multiply overlay)       dates: jun63 (28 Jun), jul12 (12-13 Jul), jul63 (15 Jul)
usage (from meade/): python3 tools/make_penn_control.py [date ...]"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_virginia_control as VC          # geometry only (Potomac, 1861 Virginia, Union pockets); read-only reuse

J = json.load(open("assets/penn.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

# Washington's defences (Arlington/Alexandria) to Fairfax (Hooker's army left Virginia by 27 Jun; the defences stayed)
WASH_DEF = [(38.70, -77.06), (38.76, -77.25), (38.84, -77.40), (38.95, -77.38), (39.02, -77.30), (38.98, -77.24), (38.93, -77.12), (38.80, -77.03)]
# Harpers Ferry + Maryland Heights (French's garrison; Maryland Heights evacuated 30 Jun, reoccupied 7 Jul)
HARPERS = [(39.36, -77.77), (39.30, -77.80), (39.29, -77.70), (39.35, -77.66), (39.38, -77.70)]
# Lee's army north of the Potomac on ~28 Jun 1863: Cumberland Valley (Hagerstown, Greencastle, Chambersburg [Longstreet, Hill],
# Shippensburg, Carlisle [Rodes, Johnson 27 Jun], Jenkins' cavalry to Mechanicsburg/Oyster Point opposite Harrisburg 28-29 Jun),
# McConnellsburg (raids), and Early's route Cashtown - Gettysburg (26 Jun) - York (28 Jun) - Wrightsville on the Susquehanna (28 Jun).
INV_JUN63 = [(39.58, -78.12), (39.76, -78.08), (39.93, -78.06), (40.06, -77.78), (40.16, -77.47), (40.26, -77.22), (40.27, -76.96),
             (40.19, -76.90), (40.10, -76.80), (40.07, -76.52),
             (39.97, -76.48), (39.90, -76.68), (39.87, -76.98), (39.80, -77.20), (39.78, -77.42), (39.68, -77.55), (39.52, -77.64),
             (39.40, -77.73), (39.30, -77.95), (39.40, -78.25)]
# Lee's entrenched bridgehead 7-13 Jul: Potomac near Downsville - St James College - west of Hagerstown - Conococheague - Williamsport
POCKET_JUL12 = [(39.545, -77.80), (39.555, -77.765), (39.585, -77.742), (39.645, -77.738), (39.672, -77.80), (39.64, -77.86),
                (39.60, -77.85), (39.56, -77.86)]

DATES = {
    "jun63": dict(inv=[INV_JUN63], union_va=[WASH_DEF, HARPERS, VC.NW_63, VC.EASTERN_SHORE, VC.NORFOLK, VC.LOWER_PEN, VC.GLOUCESTER]),
    "jul12": dict(inv=[POCKET_JUL12], union_va=[WASH_DEF, HARPERS, VC.NW_63, VC.EASTERN_SHORE, VC.NORFOLK, VC.LOWER_PEN, VC.GLOUCESTER]),
    "jul63": dict(inv=[], union_va=[WASH_DEF, HARPERS, VC.NW_63, VC.EASTERN_SHORE, VC.NORFOLK, VC.LOWER_PEN, VC.GLOUCESTER]),
}

def mask(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def snap_potomac():
    f = "assets/src/penn_dem_rivers.json"
    if not os.path.exists(f): return list(VC.POTOMAC)
    R = json.load(open(f)); pts = np.array([q for r in R if r["order"] == 3 for q in r["pts"]], float) / 2
    n = 256 * 2 ** Z; out = []
    for la, lo in VC.POTOMAC:
        x, y = P(la, lo); d = np.hypot(pts[:, 0] - x, pts[:, 1] - y); i = int(d.argmin())
        if d[i] < 14: x, y = pts[i]
        out.append((math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + OY) / n)))), (x + OX) / n * 360 - 180))
    return out

def build(date, land, va):
    H, W = land.shape; D = DATES[date]
    csa = ((va & ~mask(D["union_va"], W, H)) | mask(D["inv"], W, H)) & land
    csa &= ~(mask([HARPERS], W, H))
    un = land & ~csa
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/penn_ctl_{date}_mx.png", optimize=True)
    print("wrote penn_ctl_%s_mx.png" % date)

if __name__ == "__main__":
    land = np.array(Image.open("assets/penn_land.png").convert("L")) > 127
    H, W = land.shape
    if land.shape != (1620, 2880):
        land = np.array(Image.open("assets/penn_land.png").convert("L").resize((2880, 1620))) > 127; H, W = land.shape
    POT = snap_potomac()
    VA = list(VC.VIRGINIA); VA[18:18 + len(POT)] = POT[::-1]
    va = mask([VA], W, H)
    for date in (sys.argv[1:] or list(DATES)):
        build(date, land, va)
