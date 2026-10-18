"""HOOK variants for the `getty` basemap (z14, 39.812N 77.235W), Meade #12 (hook agent; the move-2 agent owns the getty_* layers).
-> assets/media/hook_getty_roads.png (5760x3240, shown at 2880x1620): the 1863 road "spokes" into Gettysburg (OSM ways with the period
   road names: Chambersburg Pike, Mummasburg Rd, Carlisle Rd, Harrisburg Rd, York Pike, Hanover Rd, Baltimore Pike, Taneytown Rd,
   Emmitsburg Rd, Fairfield Rd, Hunterstown Rd) + the Gettysburg Railroad east of town; thin light lines with a dark casing.
-> assets/media/hook_getty_ctl_jul2_mx.png (2880x1620 multiply): night 1-2 July / morning 2 July: Union (blue) = the fishhook and the
   ground south-east of it; Confederate (red) = the town, the ground north and west, Seminary Ridge. Boundary drawn between the lines
   (Emmitsburg Road), north of Cemetery Hill / Culp's Hill and along Rock Creek; approximate (NPS/ABT 2 July maps).
-> assets/media/hook_getty_ctl_jul3_mx.png: 3 July: as jul2 but the Peach Orchard, Wheatfield, Devil's Den (taken 2 July) and the
   lower slope of Culp's Hill red.
usage (from meade/): python3 tools/make_hook_getty.py"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

J = json.load(open("assets/getty.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
def P(lat, lon, s=1):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * s)

ROADS = {"Chambersburg Road", "Chambersburg Street", "Mummasburg Road", "Biglerville Road", "Carlisle Street", "Old Harrisburg Road",
         "Harrisburg Street", "York Street", "York Road", "Hanover Road", "West Hanover Street", "Baltimore Street", "Baltimore Pike",
         "Taneytown Road", "Steinwehr Avenue", "Emmitsburg Road", "Fairfield Road", "West Middle Street", "Hunterstown Road", "Lincoln Square"}

def roads():
    O = json.load(open("assets/src/getty_osm.json")); ways = O["ways"].values() if isinstance(O["ways"], dict) else O["ways"]
    W, H = 5760, 3240
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sel, rail = [], []
    for el in ways:
        t = el.get("tags", {}); g = el.get("geom") or []
        if len(g) < 2: continue
        pts = [P(a, b, 2) for a, b in g]
        if t.get("highway") and t.get("name") in ROADS and t.get("highway") not in ("motorway", "motorway_link"): sel.append(pts)
        elif t.get("railway") == "rail" and t.get("name") == "Hanover Subdivision": rail.append(pts)
    for pts in sel: d.line(pts, fill=(12, 14, 14, 150), width=9, joint="curve")
    for pts in rail: d.line(pts, fill=(12, 14, 14, 140), width=7, joint="curve")
    for pts in sel: d.line(pts, fill=(226, 214, 186, 175), width=4, joint="curve")
    for pts in rail: d.line(pts, fill=(170, 160, 140, 150), width=2, joint="curve")
    im.save("assets/media/hook_getty_roads.png", optimize=True)
    print("wrote hook_getty_roads.png (%d road ways, %d rail)" % (len(sel), len(rail)))

# Union ground boundary (lat, lon), north-east -> south-west; Union on the right of travel (south/east)
B_JUL2 = [(39.822, -77.100), (39.824, -77.170), (39.823, -77.204), (39.8225, -77.221), (39.8238, -77.2285), (39.8212, -77.2362),
          (39.8150, -77.2398), (39.8060, -77.2440), (39.7990, -77.2500), (39.7900, -77.2580), (39.7750, -77.2620), (39.7500, -77.2700)]
B_JUL3 = [(39.822, -77.100), (39.824, -77.170), (39.8215, -77.204), (39.8195, -77.2135), (39.8222, -77.2230), (39.8238, -77.2285),
          (39.8212, -77.2362), (39.8150, -77.2398), (39.8080, -77.2410), (39.8015, -77.2425), (39.7960, -77.2405), (39.7915, -77.2415),
          (39.7860, -77.2440), (39.7750, -77.2560), (39.7500, -77.2660)]

def ctl(name, bnd):
    W, H = 2880, 1620
    poly = [P(*q) for q in bnd] + [(W + 50, H + 50), (W + 50, -50)]
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon(poly, fill=255)
    un = np.array(im) > 0; csa = ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    sel = np.clip(rim, 0, 1) > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}", optimize=True)
    print("wrote", name)

if __name__ == "__main__":
    roads()
    ctl("hook_getty_ctl_jul2_mx.png", B_JUL2)
    ctl("hook_getty_ctl_jul3_mx.png", B_JUL3)
