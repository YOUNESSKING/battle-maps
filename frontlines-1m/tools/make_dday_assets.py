"""D-Day merged-style test assets: Europe (5 June 1944) + Normandy maps in the reference look (dark terrain, crimson Axis ground with a
red rim, blue Allied ground). Uses make_europe_control's historical borders + fronts and make_merge_assets' grade/build."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
import make_europe_control as EC
import make_merge_assets as MA   # (running it also refreshes the Holland/Nijmegen assets; harmless)
W, H = 2880, 1620
# Europe, night of 5 June 1944: the jun44 state without the Normandy beachhead (it does not exist yet)
EC.POCKETS["jun5"] = EC.POCKETS["jun44"][:1]; EC.EAST["jun5"] = EC.EAST["jun44"]
EC.RETURN_MASKS = True
feats = [f for f in json.load(open("assets/src/world_1938.geojson"))["features"] if f["geometry"]]
eland = np.array(Image.open("assets/europe_land.png").convert("L")) > 127
m = EC.build("jun5", feats, eland)
MA.grade("assets/europe.jpg", (~eland).astype(np.float32), "assets/europe_ref.jpg")
MA.build("europe_ctlm_jun5", eland & ~m["neutral"], m["allied"])
# Normandy (z10): all German-held on the night of 5 June; before dawn on 6 June, airborne pockets (approximate) around Sainte-Mere-Eglise
def P(lat, lon, z=10, ox=128794, oy=88848):
    n = 256 * 2 ** z; r = math.radians(lat); return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy)
nland = np.array(Image.open("assets/normandy_land.png").convert("L")) > 127
MA.grade("assets/normandy.jpg", (~nland).astype(np.float32), "assets/normandy_ref.jpg")
none = np.zeros((H, W), bool)
MA.build("normandy_ctlm_before", nland, none)
def pockets(d):
    for (lat, lon, r) in [(49.408, -1.317, 56), (49.385, -1.245, 30), (49.36, -1.215, 24), (49.40, -1.36, 22)]:
        x, y = P(lat, lon); d.ellipse((x - r, y - r, x + r, y + r), fill=255)
im = Image.new("L", (W, H), 0); pockets(ImageDraw.Draw(im))
MA.build("normandy_ctlm_dawn", nland, np.array(im) > 0)
print({k: [round(v, 1) for v in P(*c)] for k, c in {"SME": (49.408, -1.317), "UTAH": (49.415, -1.175), "CARENTAN": (49.303, -1.248), "CHERBOURG": (49.639, -1.616), "CAEN": (49.183, -0.37), "OMAHA": (49.37, -0.88)}.items()})
