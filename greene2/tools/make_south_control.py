"""Southern campaign control maps (option 1, multiply look) on the `south` basemap (z8, 34.70N 79.60W), Greene remake.
SIDES: American-held = blue (110,160,255) (hero); British-held = red (232,52,52) with the alpha boost + bright rim on the red side
where the two meet (same treatment as meade/tools/make_penn_control.py).
1780-81 control = the posts and the country they dominate (research/FACT_NOTES.md control table), drawn as soft areas:
the colonies (VA, NC, SC, GA, Eastern Shore) east of ~83.1W; west of it (Cherokee / Creek country) stays untinted.
SC/GA line = the Savannah - Tugaloo river (Natural Earth, assets/src/south_rivers_ne.json); NC/SC line = the 1764/1772 boundary
(coast at Little River - NW to 34.82N 79.68W - west - the Waxhaws notch - 35.19N west to the Chattooga), approximate.
Sources + notes per date: research/FACT_NOTES_south.md.
-> assets/media/south_ctl_<date>_mx.png (2880x1620)   dates: may80, aug80, dec80, apr81, jul81, dec81
usage (from greene2/): python3 tools/make_south_control.py [date ...]"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/south.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; N = 256 * 2 ** Z
def P(lat, lon):
    r = math.radians(lat); return ((lon + 180) / 360 * N - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * N - OY)

def savannah_line():
    R = json.load(open("assets/src/south_rivers_ne.json"))
    pts = [(la, lo) for r in R if r["name"] in ("Savannah", "Tugaloo") for lo, la in r["pts"]]
    pts = [q for q in pts if q[0] > 32.0]
    pts.sort(key=lambda q: -q[0])                       # the river runs NW -> SE: order by latitude
    return [(34.99, -83.11)] + pts + [(32.03, -80.86)]

WEST = -83.1
NCSC = [(33.85, -78.54), (34.82, -79.68), (34.82, -80.78), (35.15, -80.93), (35.19, -81.04), (35.19, -82.30), (35.20, -83.11)]
def circle(lat, lon, km, n=48):
    out = []
    for k in range(n):
        a = 2 * math.pi * k / n
        out.append((lat + km / 111.0 * math.sin(a), lon + km / (111.0 * math.cos(math.radians(lat))) * math.cos(a)))
    return out

SAV = savannah_line()
# Georgia (settled + garrisoned: Savannah, Augusta, Ebenezer, Sunbury) = SW of the Savannah to 83.1W, down to the map edge
GA = SAV + [(31.60, -80.40), (30.90, -80.90), (30.90, WEST), (34.99, WEST)]
# South Carolina = between the Savannah and the NC line, to the sea
SC = SAV[::-1] + [(34.99, WEST), (35.20, WEST)] + NCSC[::-1][1:] + [(33.60, -78.20), (31.70, -80.20)]
SC = [(32.03, -80.86)] + SC[1:]
CHS_SIEGE = circle(32.84, -79.97, 30)        # Charleston under siege (29 Mar - 12 May 1780): the Neck, the islands, the siege lines
WILM = circle(34.24, -77.94, 24)             # Major Craig's Wilmington post, 29 Jan - 18 Nov 1781
CHS_81 = circle(32.84, -79.97, 24)            # Charleston lines + islands, Dec 1781
SAV_81 = circle(32.10, -81.12, 22)            # Savannah lines, Dec 1781
# July 1781: after Camden, Orangeburg, Fort Motte, Fort Watson, Augusta, Georgetown and Ninety Six: the low country between the
# Santee and the Edisto/Savannah (Charleston - Monck's Corner - Eutaw - Orangeburg belt), Beaufort, and Savannah's environs
BELT = [(33.60, -80.92), (33.60, -80.55), (33.50, -80.32), (33.38, -79.98), (33.24, -79.60), (33.10, -79.25), (32.60, -79.30),
        (31.80, -80.60), (31.85, -81.20), (32.25, -81.40), (32.60, -81.35), (33.10, -81.20)]

DATES = {"may80": [GA, CHS_SIEGE], "aug80": [GA, SC], "dec80": [GA, SC], "apr81": [GA, SC, WILM], "jul81": [BELT, WILM], "dec81": [CHS_81, SAV_81]}

def mask(polys, W, H):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for poly in polys: d.polygon([P(*q) for q in poly], fill=255)
    return np.array(im) > 0

def build(date, land, col):
    H, W = land.shape
    red = (ndimage.gaussian_filter(mask(DATES[date], W, H).astype(np.float32), 9) > 0.5) & land & col   # rounded, soft-cornered zones
    red = ndimage.binary_opening(red, iterations=2)
    blue = land & col & ~red
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~blue)
    out[red, :3] = (232, 52, 52); out[red, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[red]
    out[blue, :3] = (110, 160, 255); out[blue, 3] = 0.565
    rim = ndimage.gaussian_filter((red & ndimage.binary_dilation(blue, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    # soft western edge of the colonies (no hard cut into the Indian country)
    fade = np.clip((np.arange(W)[None, :] - P(34.5, WEST)[0]) / 60.0, 0, 1)
    out[..., 3] *= fade
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/south_ctl_{date}_mx.png", optimize=True)
    print("wrote south_ctl_%s_mx.png" % date)

if __name__ == "__main__":
    land = np.array(Image.open("assets/media/south_land.png").convert("L")) > 127
    H, W = land.shape
    col = np.zeros((H, W), bool); col[:, int(P(34.5, WEST)[0]):] = True
    for date in (sys.argv[1:] or list(DATES)):
        build(date, land, col)
