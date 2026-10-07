"""Marsh layer (OSM wetlands + low flat ground from the DEM, see below) for the bobruisk map: OSM natural=wetland (Overpass; (c) OpenStreetMap contributors, ODbL) in the Parichi - Ptich -
Pripyat area, drawn as a soft dark-teal fill with small reed-tuft hatching.
usage: python3 tools/make_bobruisk_marsh.py [fetch]
-> assets/src/bobruisk_wetland.json (raw ways), assets/media/bobruisk_marsh.png (2880x1620 map px, RGBA),
   assets/media/bobruisk_marsh_mask.png (white = marsh, for highlights)."""
import json, math, os, sys, time, urllib.parse, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
Z, OX, OY, W, H = 9, 74836, 41886, 2880, 1620
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
SRC = "assets/src/bobruisk_wetland.json"
BOX = "51.75,27.3,53.05,30.4"
if not os.path.exists(SRC) or "fetch" in sys.argv:
    body = f'[out:json][timeout:240];way["natural"="wetland"]({BOX});out geom qt;'
    for k in range(4):
        try:
            data = urllib.parse.urlencode({"data": body}).encode()
            els = json.load(urllib.request.urlopen(urllib.request.Request("https://overpass.private.coffee/api/interpreter", data=data), timeout=300))["elements"]
            break
        except Exception as ex:
            print("retry", k, ex, flush=True); time.sleep(8 * (k + 1))
    else: raise SystemExit("overpass failed")
    json.dump([[[round(g["lat"], 4), round(g["lon"], 4)] for g in el.get("geometry", []) if g] for el in els], open(SRC, "w"))
ways = json.load(open(SRC)); print("wetland ways", len(ways))
S = 2
m = Image.new("L", (W * S, H * S), 0); d = ImageDraw.Draw(m)
for w in ways:
    g = [tuple(c * S for c in P(lat, lon)) for lat, lon in w]
    if len(g) > 3: d.polygon(g, fill=255)
m = m.filter(ImageFilter.MaxFilter(3)).resize((W, H), Image.LANCZOS)
mask = np.asarray(m, np.float32) / 255
# 1944 extent: most Polesie bogs were drained after the war, so OSM wetland under-shows them. Add the low, flat ground of the
# Berezina / Ptich / Pripyat basins from the HD elevation (smoothed elev < 145 m and slope < 0.3 %) = approximate 1944 marsh.
from scipy import ndimage
e = np.load("assets/src/bobruisk_hd_elev.npy")[::2, ::2].astype(np.float32); sm = ndimage.gaussian_filter(e, 3)
gy, gx = np.gradient(sm, 184.0); low = (sm < 145) & (np.hypot(gx, gy) < 0.003)
low = ndimage.binary_closing(ndimage.binary_opening(low, iterations=2), iterations=3)
low = ndimage.gaussian_filter(low.astype(np.float32), 3)
mask = np.clip(np.maximum(mask, low), 0, 1)
mk = np.zeros((H, W, 4), np.uint8); mk[..., :3] = 255; mk[..., 3] = (mask * 255).astype(np.uint8)   # RGBA: CSS mask-image uses alpha
Image.fromarray(mk, "RGBA").save("assets/media/bobruisk_marsh_mask.png", optimize=True)
# fill + reed tufts (short vertical strokes in a staggered grid), only inside the marsh
out = np.zeros((H, W, 4), np.float32)
out[..., :3] = (38, 74, 70); out[..., 3] = mask * 110
tuft = Image.new("L", (W, H), 0); td = ImageDraw.Draw(tuft)
for j, y in enumerate(range(4, H, 11)):
    for x in range(4 + (j % 2) * 7, W, 14):
        td.line((x, y, x, y - 5), fill=255, width=1); td.line((x - 3, y, x - 4, y - 3), fill=200, width=1); td.line((x + 3, y, x + 4, y - 3), fill=200, width=1)
t = np.asarray(tuft, np.float32) / 255 * mask
sel = t > 0.05
out[sel, :3] = (150, 196, 180); out[sel, 3] = np.maximum(out[sel, 3], t[sel] * 150)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGBA").save("assets/media/bobruisk_marsh.png", optimize=True)
print("wrote marsh", round(float(mask.mean()), 3))
