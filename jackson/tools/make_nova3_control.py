"""Who holds the ground for Jackson MOVE 3 (Chancellorsville, Apr-May 1863) on the `nova` map (z10, move-2 agent's basemap, read-only),
option 1 (the multiply `_mx` look, peng/tools/make_seoul_control.py recipe) + option-2/front polylines for K.front.
usage (from jackson/): python3 tools/make_nova3_control.py
-> assets/media/nova3_apr28_mx.png  before the move: the armies face each other across the Rappahannock (Union north of it)
-> assets/media/nova3_apr30_mx.png  30 Apr: Hooker's main body over the Rappahannock + Rapidan at Chancellorsville (pocket from the
                                    fords), Sedgwick's bridgehead below Fredericksburg (Franklin's Crossing, 29 Apr)
-> assets/media/nova3_may6_mx.png   6 May: Hooker back over the river (= the 28 Apr line)
-> assets/media/nova3_front_<state>.json   the real front (map px) where the two armies touch (Rappahannock / the pocket)
Sides (Jackson video): Confederate (hero) = BLUE (110,160,255); Union = RED (232,52,52) strongest at the front with a light rim.
Lines + sources: research/FACT_NOTES_chanc.md ("nova3 control map"). Drawn plainly per date (no 1863 West Virginia line; Potomac = the
Virginia-Maryland border); approximate (~5-10 km) away from the Rappahannock front."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

US, CS, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

# Union-held ground NORTH of this line (lon, lat), west -> east, spring 1863:
#  the B&O corridor + the lower Shenandoah Valley (Milroy at Winchester until 14 Jun 1863, Harpers Ferry, Martinsburg);
#  Loudoun/Fauquier = Mosby's raiding ground, left Confederate/contested (south of the line);
#  the Washington defences with outposts at Centreville / Union Mills / the Occoquan;
#  Stafford + Fauquier east of the O&A RR up to the Rappahannock (Army of the Potomac at Falmouth, cavalry at Warrenton Jct / Bealeton);
#  then the Rappahannock downstream: Rappahannock Station - Kelly's Ford - US Ford - Banks Ford - Falmouth/Fredericksburg - Port Conway;
#  the Northern Neck east of the Army's left = Confederate; the Eastern Shore of Virginia + Maryland = Union.
NORTH = [(-79.8, 39.30), (-79.0, 39.22), (-78.60, 39.15), (-78.35, 39.06), (-78.18, 39.05), (-77.97, 39.10), (-77.85, 39.13),
         (-77.70, 39.02), (-77.55, 38.92), (-77.45, 38.84), (-77.44, 38.76), (-77.30, 38.69), (-77.48, 38.66), (-77.66, 38.66),
         (-77.80, 38.62), (-77.812, 38.535)]
# the Rappahannock (Rappahannock Station -> Kelly's Ford -> the Rapidan mouth -> US Ford -> Banks Ford -> Falmouth -> Port Conway),
# traced on the OSM river line (move-2 agent's assets/src/nova_rivers_nominatim.json, read-only); hand list kept as a fallback
def _rapp():
    try:
        c = json.load(open("assets/src/nova_rivers_nominatim.json"))["rappahannock"][0]["geojson"]["coordinates"][0]
    except Exception:
        return None
    near = lambda q: min(range(len(c)), key=lambda i: (c[i][0] - q[0]) ** 2 + (c[i][1] - q[1]) ** 2)
    i0, i1 = near((-77.812, 38.535)), near((-77.18, 38.18))
    return [tuple(p) for p in c[i0:i1 + 1]]
RAPP_HAND = [(-77.812, 38.535), (-77.79, 38.505), (-77.765, 38.477), (-77.745, 38.45), (-77.72, 38.43), (-77.69, 38.405), (-77.655, 38.39),
        (-77.635, 38.385), (-77.615, 38.375), (-77.595, 38.355), (-77.565, 38.335), (-77.53, 38.316), (-77.50, 38.318), (-77.47, 38.315),
        (-77.455, 38.30), (-77.43, 38.27), (-77.38, 38.245), (-77.30, 38.23), (-77.24, 38.215), (-77.18, 38.205)]
RAPP = _rapp() or RAPP_HAND
EAST = [RAPP[-1], (-77.10, 38.27), (-77.03, 38.33)]                    # back to the Potomac across the Northern Neck
# 30 Apr: the Chancellorsville pocket (V, XI, XII, then II + III Corps) south of the Rapidan / Rappahannock, from Germanna / Ely's /
# US Ford down to the Chancellorsville crossroads (Hooker's HQ), Wilderness Tavern on the west; + Sedgwick's bridgehead (VI Corps).
POCKET = [(-77.80, 38.385), (-77.78, 38.36), (-77.74, 38.335), (-77.70, 38.322), (-77.67, 38.312), (-77.64, 38.300), (-77.61, 38.300),
          (-77.585, 38.318), (-77.585, 38.345), (-77.60, 38.368), (-77.64, 38.392), (-77.70, 38.405), (-77.76, 38.43), (-77.80, 38.42)]
SEDG = [(-77.45, 38.285), (-77.445, 38.265), (-77.425, 38.255), (-77.405, 38.262), (-77.415, 38.285)]


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


def save(M, path, us, cs):
    land = M.land; us &= land; cs &= land & ~us
    d_us = ndimage.distance_transform_edt(~cs) if cs.any() else np.full(us.shape, 1e9)
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[us, :3] = US; out[us, 3] = (0.36 + 0.24 * np.exp(-d_us / 40.0))[us]
    out[cs, :3] = CS; out[cs, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((us & ndimage.binary_dilation(cs, iterations=3)).astype(np.float32), 6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "US px", int(us.sum()), "CS px", int(cs.sum()))


if __name__ == "__main__":
    M = Map("nova")
    line = NORTH + RAPP + EAST
    north = M.poly([line + [(-75.0, 38.33), (-75.0, 41.0), (-80.5, 41.0), (-80.5, 39.30)]])
    # land south of the line belongs to the Confederacy only where it is Virginia: keep the land pieces that hold a Virginia seed
    # (the Potomac + the Chesapeake separate southern Maryland and the Eastern Shore, which stay Union)
    lab, _ = ndimage.label(M.land & ~north)
    seeds = [(-77.6, 38.0), (-78.6, 38.3), (-76.6, 37.95), (-77.2, 38.15), (-76.5, 37.8)]
    keep = {lab[int(M.P(*q)[1]), int(M.P(*q)[0])] for q in seeds if 0 <= M.P(*q)[1] < M.H} - {0}
    base_us = ~np.isin(lab, list(keep))
    pocket, sedg = M.poly([POCKET]), M.poly([SEDG])
    for state, us in (("apr28", base_us), ("apr30", base_us | pocket | sedg), ("may6", base_us)):
        save(M, f"assets/media/nova3_{state}_mx.png", us.copy(), ~us)
    px = lambda pts: [[round(c, 1) for c in M.P(*q)] for q in pts]
    # the real front: the Rappahannock from Kelly's Ford to Port Conway (28 Apr / 6 May); the pocket rim + Sedgwick (30 Apr)
    ri = lambda lon: min(range(len(RAPP)), key=lambda i: abs(RAPP[i][0] - lon))
    json.dump([px(RAPP[ri(-77.78):ri(-77.30)])], open("assets/media/nova3_front_apr28.json", "w"))   # Kelly's Ford -> below Fredericksburg
    json.dump([px(POCKET[1:8] + [(-77.585, 38.345)]), px(RAPP[ri(-77.56):ri(-77.30)])], open("assets/media/nova3_front_apr30.json", "w"))
    print("fronts written")
