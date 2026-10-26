"""Who holds the ground for Meade #12 MOVE 1 (Fredericksburg, Dec 1862) on the `nova` map (z10, basemap from jackson), option 1
(the multiply `_mx` look) + front polylines for K.front. Adapted from jackson/tools/make_nova3_control.py WITH THE COLOURS SWAPPED:
Union (hero) = BLUE (110,160,255); Confederate = RED (232,52,52), strongest at the front with a light rim.
usage (from meade/): python3 tools/make_nova1_control.py
-> assets/media/nova1_dec62a_mx.png  before 11 Dec: the armies face each other across the Rappahannock (Union north/east of it)
-> assets/media/nova1_dec62b_mx.png  13 Dec: + the two Union bridgeheads (the town; Franklin's plain below Deep Run)
-> assets/media/nova1_front_dec62a.json / nova1_front_dec62b.json  the real front (map px, 2880x1620)
Dec 1862 (FACT_NOTES_prospect.md "nova1 control map"): Union = Maryland + the Potomac line (Harpers Ferry held; Winchester NOT yet,
Milroy only on 24 Dec), the Washington defences out to Fairfax/Centreville (Sigel), Stafford north of the Rappahannock (the Army of the
Potomac at Falmouth); Confederate = Virginia south/west of that (Loudoun/Fauquier left Confederate/contested; approximate there)."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

CS, US, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)
NORTH = [(-79.8, 39.66), (-78.8, 39.62), (-78.25, 39.64), (-77.95, 39.56), (-77.82, 39.45), (-77.75, 39.33), (-77.68, 39.22),
         (-77.55, 38.95), (-77.45, 38.86), (-77.44, 38.78), (-77.36, 38.70), (-77.45, 38.62), (-77.56, 38.50), (-77.60, 38.42),
         (-77.585, 38.36)]
def _rapp():
    try:
        c = json.load(open("assets/src/nova1_rivers_nominatim.json"))["rappahannock"][0]["geojson"]["coordinates"][0]
    except Exception:
        return None
    near = lambda q: min(range(len(c)), key=lambda i: (c[i][0] - q[0]) ** 2 + (c[i][1] - q[1]) ** 2)
    i0, i1 = near((-77.585, 38.355)), near((-77.18, 38.18))
    return [tuple(p) for p in c[i0:i1 + 1]]
RAPP_HAND = [(-77.585, 38.355), (-77.565, 38.335), (-77.53, 38.316), (-77.50, 38.318), (-77.47, 38.315), (-77.455, 38.30), (-77.43, 38.27),
             (-77.38, 38.245), (-77.30, 38.23), (-77.24, 38.215), (-77.18, 38.205)]
RAPP = _rapp() or RAPP_HAND
EAST = [RAPP[-1], (-77.10, 38.27), (-77.03, 38.33)]
TOWN = [(-77.478, 38.312), (-77.456, 38.316), (-77.448, 38.298), (-77.458, 38.290), (-77.470, 38.294)]       # Sumner in the town
PLAIN = [(-77.448, 38.290), (-77.425, 38.292), (-77.405, 38.262), (-77.422, 38.250), (-77.432, 38.262), (-77.444, 38.278)]   # Franklin


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]; self.W, self.H = J["size"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L").resize((self.W, self.H))) > 127
    def P(self, lon, lat):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)
    def poly(self, polys):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0


def save(M, path, us, cs, force=None):
    land = M.land; us &= land; cs &= land & ~us
    d_cs = ndimage.distance_transform_edt(~us) if us.any() else np.full(cs.shape, 1e9)
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[cs, :3] = CS; out[cs, 3] = (0.36 + 0.24 * np.exp(-d_cs / 40.0))[cs]
    out[us, :3] = US; out[us, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((cs & ndimage.binary_dilation(us, iterations=3)).astype(np.float32), 6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    out[sel & (rim > 0.35), :3] = RIM
    if force is not None:   # small bridgeheads: keep them plainly blue (the rim would swallow them at z10)
        f = force & land; out[f, :3] = US; out[f, 3] = 0.62
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "US px", int(us.sum()), "CS px", int(cs.sum()))


if __name__ == "__main__":
    M = Map("nova")
    line = NORTH + RAPP + EAST
    north = M.poly([line + [(-75.0, 38.33), (-75.0, 41.0), (-80.5, 41.0), (-80.5, 39.66)]])
    lab, _ = ndimage.label(M.land & ~north)
    seeds = [(-77.6, 38.0), (-78.6, 38.3), (-76.6, 37.95), (-77.2, 38.15), (-76.5, 37.8)]
    keep = {lab[int(M.P(*q)[1]), int(M.P(*q)[0])] for q in seeds if 0 <= M.P(*q)[1] < M.H} - {0}
    base_us = ~np.isin(lab, list(keep))
    bh = M.poly([TOWN, PLAIN])
    for state, us in (("dec62a", base_us), ("dec62b", base_us | bh)):
        save(M, f"assets/media/nova1_{state}_mx.png", us.copy(), ~us, bh if state == "dec62b" else None)
    px = lambda pts: [[round(c, 1) for c in M.P(*q)] for q in pts]
    ri = lambda lon: min(range(len(RAPP)), key=lambda i: abs(RAPP[i][0] - lon))
    json.dump([px(RAPP[ri(-77.585):ri(-77.20)])], open("assets/media/nova1_front_dec62a.json", "w"))
    # 13 Dec: the river above the town + the town rim + the river between + Franklin's plain rim + the river below
    a, b = ri(-77.462), ri(-77.415)
    json.dump([px(RAPP[ri(-77.585):a]), px(TOWN[:1] + TOWN[4:] + TOWN[3:4]), px(PLAIN[:1] + PLAIN[5:] + PLAIN[4:2:-1]), px(RAPP[b:ri(-77.20)])],
              open("assets/media/nova1_front_dec62b.json", "w"))
    print("fronts written")
