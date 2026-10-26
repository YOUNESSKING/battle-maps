"""Who holds the ground at Gettysburg for MOVE 3 (night 2 July - 3 July 1863) on the `getty` map (z14), option 1 (multiply `_mx` look).
Fallback/variant of the MOVE 2 agent's getty_ctl_* overlays (prefix getty3_, used only if theirs are missing or differ in date).
usage (from meade/): python3 tools/make_getty3_control.py
-> assets/media/getty3_ctl_jul2n_mx.png  night 2-3 July: the fishhook; Johnson's lodgement in the lower Culp's Hill works (Spangler's Spring)
-> assets/media/getty3_ctl_jul3_mx.png   3 July: Union line restored on Culp's Hill (by ~11 am); Pickett's Charge front
Sides (Meade video): Union (hero) = BLUE (110,160,255); Confederate = RED (232,52,52); the fields between the two lines
(Emmitsburg Road valley, ~3/4 mile) are left uncoloured (no-man's land, skirmishers only).
Lines (lat, lon), checked against: NPS Gettysburg "Battle of Gettysburg July 3" map, ABT "Gettysburg: Pickett's Charge" + "July 3" maps,
Bachelder 1876 isometric map (LoC), OSM monument nodes (Angle, HQ markers). Accuracy ~100-200 m at the main front, ~0.5-1 km at the
edges (cavalry fields east and south-west drawn plainly). See research/FACT_NOTES_getty3.md."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

US, CS, RIM = (110, 160, 255), (232, 52, 52), (150, 185, 255)

# Union line, 3 July (Culp's Hill -> Cemetery Hill -> Cemetery Ridge -> the Angle -> Little Round Top -> Big Round Top)
UNION = [(39.8130, -77.2140), (39.8165, -77.2160), (39.8195, -77.2185), (39.8215, -77.2225), (39.8222, -77.2265), (39.8222, -77.2300),
         (39.8195, -77.2330), (39.8165, -77.2350), (39.8141, -77.2352), (39.8136, -77.2364), (39.8110, -77.2366), (39.8080, -77.2368),
         (39.8040, -77.2375), (39.8000, -77.2385), (39.7960, -77.2380), (39.7925, -77.2370), (39.7890, -77.2385), (39.7860, -77.2400)]
UNION_REAR = [(39.7800, -77.2440), (39.7600, -77.2520), (39.7600, -77.1000), (39.8700, -77.1000), (39.8700, -77.1620), (39.8440, -77.1720),
              (39.8290, -77.1850), (39.8160, -77.2010)]
# Confederate line, 3 July (Ewell east of Culp's Hill on Rock Creek / Benner's Hill -> the town's south edge -> Seminary Ridge ->
# Spangler's Woods -> the Emmitsburg Road ridge (Rogers farm) -> the Peach Orchard -> Rose farm -> Devil's Den -> west of Big Round Top)
CONF = [(39.8700, -77.1680), (39.8440, -77.1765), (39.8290, -77.1895), (39.8160, -77.2055), (39.8115, -77.2108), (39.8170, -77.2122),
        (39.8215, -77.2150), (39.8260, -77.2250), (39.8265, -77.2330), (39.8270, -77.2400), (39.8285, -77.2440), (39.8240, -77.2448),
        (39.8190, -77.2470), (39.8145, -77.2497), (39.8100, -77.2510), (39.8080, -77.2490), (39.8060, -77.2462), (39.8030, -77.2470),
        (39.8003, -77.2482), (39.7960, -77.2470), (39.7930, -77.2440), (39.7880, -77.2440), (39.7850, -77.2455), (39.7790, -77.2480),
        (39.7600, -77.2580)]
CONF_REAR = [(39.7600, -77.4000), (39.8700, -77.4000)]
# night 2 July: Johnson's men hold the empty lower works on Culp's Hill (Greene's brigade still holds the summit)
LODGE = [(39.8118, -77.2128), (39.8128, -77.2155), (39.8150, -77.2172), (39.8178, -77.2180), (39.8188, -77.2160), (39.8165, -77.2130)]


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]; self.W, self.H = J["size"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L").resize((self.W, self.H))) > 127
    def P(self, lat, lon):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)
    def poly(self, pts):
        im = Image.new("L", (self.W, self.H), 0); ImageDraw.Draw(im).polygon([self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0


def save(M, path, us, cs):
    land = M.land; us = us & land; cs = cs & land & ~us
    d_cs = ndimage.distance_transform_edt(~cs) if cs.any() else np.full(us.shape, 1e9)
    d_us = ndimage.distance_transform_edt(~us) if us.any() else np.full(us.shape, 1e9)
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[us, :3] = US; out[us, 3] = (0.34 + 0.26 * np.exp(-d_cs / 60.0))[us]
    out[cs, :3] = CS; out[cs, 3] = (0.34 + 0.26 * np.exp(-d_us / 60.0))[cs]
    out[..., 3] = ndimage.gaussian_filter(out[..., 3], 2.0)
    out[..., 3] = np.minimum(out[..., 3] * 1.6, 220 / 255)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "US px", int(us.sum()), "CS px", int(cs.sum()))


if __name__ == "__main__":
    M = Map("getty")
    us = M.poly(UNION + UNION_REAR); cs = M.poly(CONF + CONF_REAR)
    save(M, "assets/media/getty3_ctl_jul3_mx.png", us.copy(), cs.copy())
    lodge = M.poly(LODGE)
    save(M, "assets/media/getty3_ctl_jul2n_mx.png", us & ~lodge, cs | lodge)
