"""Campaign control maps (option 1, multiply look) on the `carolinas` basemap (z9, 35.80N 80.20W), Greene #2 remake (MOVE 1 agent).
SIDES: American-held = blue (110,160,255) (hero); British-held = red (232,52,52) with the alpha boost + bright rim on the red side
where the two meet (same treatment as meade/tools/make_penn_control.py).
1781 control = posts + the country they dominate (research/FACT_NOTES.md control table): South Carolina is British (the post line
Camden - Ninety Six - Georgetown - Charleston; Cornwallis's base at Winnsboro), North Carolina + Virginia American, except the
British column's moving zone in NC during the race to the Dan, and Major Craig's Wilmington post (occupied 29 Jan 1781).
Every zone is logged with its source in research/FACT_NOTES_carolinas.md.
-> assets/media/carolinas_ctl_<date>_mx.png (2880x1620 multiply overlay)   dates: jan81, feb81a, feb81b, feb81d, feb81c, mar81, apr81
usage (from greene2/): python3 tools/make_carolinas_control.py [date ...]"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/carolinas.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; KM = J["meters_per_px"] / 1000
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)

# South Carolina = south of the NC/SC line (1735-37 + 1772 surveys; same line as the geo layer), closed far off the map
SC = [(33.85, -78.54), (34.33, -79.10), (34.81, -79.67), (34.82, -80.79), (35.08, -80.93), (35.15, -81.04), (35.17, -82.30),
      (35.21, -83.10), (35.0, -85.5), (32.5, -85.5), (32.5, -77.5)]
# Greene's "camp of repose" on the Pee Dee at Cheraw Hill (26 Dec 1780 - 28 Jan 1781): an American pocket in SC
CHERAW = [((34.70, -79.88), 22)]
# Wilmington post (Maj. James Craig, 29 Jan 1781 -> evacuated 18 Nov 1781): the town + the lower Cape Fear
WILM = [((34.24, -77.95), 22), ((34.42, -78.05), 16)]
WILM_APR = [((34.24, -77.95), 26), ((34.48, -78.10), 22)]   # Cornwallis's army there 7-25 Apr 1781
# the British column's moving zone (polyline + half-width km): late Jan - 3 Feb: Winnsboro -> Ramsour's Mill (25-27 Jan) ->
# Cowan's Ford (1 Feb) -> Salisbury (3 Feb), ending on the south-west bank of the Yadkin
COL_A = ([(34.38, -81.09), (34.95, -81.25), (35.47, -81.25), (35.43, -80.96), (35.66, -80.47)], 11)
# 6-13 Feb: up the Yadkin to the Shallow Ford (6-8 Feb) -> Salem (Moravian towns, 9-10 Feb) [feb81b]; 14-15 Feb: on north-east past
# Guilford to the south bank of the Dan at Irwin's / Boyd's ferries (15 Feb) [feb81d]
COL_B = ([(35.67, -80.47), (36.05, -80.51), (36.09, -80.24)], 12)
COL_D = ([(35.67, -80.47), (36.05, -80.51), (36.09, -80.24), (36.25, -79.95), (36.45, -79.50), (36.62, -79.10), (36.64, -78.95)], 12)
# 20-26 Feb: Cornwallis at Hillsborough (raised the King's standard, 20 Feb), then west toward the Haw
HILLS_FEB = [((36.075, -79.10), 16)]
# mid-March: Cornwallis's army around Guilford (camp at Deep River / Bell's Mill, then the battle, 15 Mar)
ARMY_MAR = [((35.97, -79.97), 11)]

DATES = {
    "jan81": dict(sc=True, blue=CHERAW, red_b=[], red_l=[]),
    "feb81a": dict(sc=True, blue=[], red_b=WILM, red_l=[COL_A]),
    "feb81b": dict(sc=True, blue=[], red_b=WILM, red_l=[COL_B]),
    "feb81d": dict(sc=True, blue=[], red_b=WILM, red_l=[COL_D]),
    "feb81c": dict(sc=True, blue=[], red_b=WILM + HILLS_FEB, red_l=[]),
    "mar81": dict(sc=True, blue=[], red_b=WILM + ARMY_MAR, red_l=[]),
    "apr81": dict(sc=True, blue=[], red_b=WILM_APR, red_l=[]),
}

def mask_poly(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def mask_blobs(blobs, lines, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for (la, lo), rkm in blobs:
        x, y = P(la, lo); r = rkm / KM; d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    for pts, hkm in lines:
        q = [P(*p) for p in pts]; w = 2 * hkm / KM; d.line(q, fill=255, width=int(w), joint="curve")
        for x, y in (q[0], q[-1]): d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    m = np.array(im).astype(np.float32) / 255
    return ndimage.gaussian_filter(m, 6) > 0.5      # rounded, soft-edged zone (18th-century control, not a trench line)

def land_mask():
    e = np.load("assets/src/carolinas_hd_elev.npy")
    e = e.reshape(e.shape[0] // 2, 2, e.shape[1] // 2, 2).mean(axis=(1, 3))
    land = e > 0.5
    lab, nl = ndimage.label(~land); sizes = ndimage.sum(np.ones_like(lab), lab, range(1, nl + 1))
    return land | np.isin(lab, [i + 1 for i in range(nl) if sizes[i] < 40000])   # reservoir voids are land

def build(date, land):
    H, W = land.shape; D = DATES[date]
    red = mask_poly([SC], W, H) if D["sc"] else np.zeros((H, W), bool)
    red = (red & ~mask_blobs(D["blue"], [], W, H)) | mask_blobs(D["red_b"], D["red_l"], W, H)
    red &= land; un = land & ~red
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[red, :3] = (232, 52, 52); out[red, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[red]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((red & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/carolinas_ctl_{date}_mx.png", optimize=True)
    print("wrote carolinas_ctl_%s_mx.png" % date)

if __name__ == "__main__":
    land = land_mask()
    for date in (sys.argv[1:] or list(DATES)):
        build(date, land)
