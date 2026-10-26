"""Who holds the ground for Peng move 3 (Third Phase Offensive, Seoul, 26 Dec 1950 - 7 Jan 1951) on the `seoul` map (z10),
option 1 (the multiply `_mx` look of collins/tools/make_bulge_control.py) + option-2 front polylines.
usage (from peng/): python3 tools/make_seoul_control.py
-> assets/media/seoul_ctl_<state>_mx.png   dec26 (line B: Imjin + 38th parallel), jan1 (the wedge in the ROK 1st Div sector),
                                           jan3 (the Seoul bridgehead + line C), jan4 (Seoul lost, UN on the south bank of the Han),
                                           jan7 (line D: Pyongtaek - Ansong - Changhowon-ni - Wonju)
-> assets/media/seoul_front_<state>.json   front polylines (seoul map px) for option-2 close-ups (K.front)
Sides (Peng video): UN-held = RED (232,52,52) strongest at the front with a light rim; Communist-held = BLUE (110,160,255).
Draw with mixBlendMode = "multiply". Fronts + sources: research/FACT_NOTES_seoul.md (approximate: ~2-5 km near Seoul, the
eastern sector beyond Chunchon ~10-20 km; Mossman, Ebb and Flow ch. VIII-XI + maps 15-16)."""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

UN, CO, RIM = (232, 52, 52), (110, 160, 255), (255, 120, 100)

# Fronts (lon, lat), west -> east. UN-held = SOUTH of the line (closed along the bottom of the map).
# 26-31 Dec, line B: Kanghwa Island + the Kimpo peninsula (Rangers, Turks), the lower bank of the Imjin (25th Div at Route 1,
# ROK 1st Div up to Route 33), the 38th parallel (ROK 6th on Route 33, US 24th on Route 3), ROK III Corps above Chunchon,
# the North Korean salient in the Hongchon area (ROK II Corps / 3rd Div on Route 24), ROK I Corps to the east coast.
WEST_B = [(125.95, 37.62), (126.30, 37.80), (126.47, 37.80), (126.58, 37.78), (126.68, 37.77)]   # north of Kanghwa, Han estuary
IMJIN = [(126.70, 37.795), (126.75, 37.842), (126.80, 37.868), (126.845, 37.925), (126.90, 37.958), (126.955, 37.978), (127.01, 37.995),
         (127.06, 38.004)]  # the Imjin's course (DEM-traced, tools/make_seoul_geo.py -> seoul_imjin.json)
PARALLEL = [(127.13, 38.01), (127.25, 38.00), (127.40, 37.99), (127.55, 37.99), (127.70, 38.00), (127.85, 37.98)]
EAST_B = [(127.97, 37.93), (128.00, 37.82), (128.08, 37.74), (128.20, 37.78), (128.32, 37.92), (128.50, 38.02), (128.70, 38.10),
          (129.30, 38.15)]
DEC26 = WEST_B + IMJIN + PARALLEL + EAST_B
# 1 Jan, daylight: the 116th Div's V-shaped wedge through the ROK 1st Div (deepest point ~8 mi below the Imjin, between Routes 5Y
# and 11, just west of the I-IX Corps boundary); the ROK 6th shoved back a little; the US 24th backed 2 mi; dents at the ROK 5th / 2nd.
JAN1 = WEST_B + IMJIN[:3] + [(126.84, 37.885), (126.88, 37.87), (126.95, 37.84), (126.99, 37.83), (127.02, 37.88), (127.06, 37.93),
       (127.10, 37.96)] + [(127.25, 37.97), (127.40, 37.95), (127.52, 37.92), (127.60, 37.95), (127.70, 37.91), (127.85, 37.95)] + EAST_B
# 2-3 Jan: the Seoul bridgehead (I Corps: 25th Div west, British 29th Bde east; IX Corps: 24th Div from Uijongbu to the Han) +
# line C along the lower Han to the Pukhan junction, then north-east toward Hongchon (ROK forces in disarray; Chunchon lost 2 Jan).
WEST_C = [(125.95, 37.50), (126.45, 37.60), (126.60, 37.64), (126.72, 37.61)]                 # Kanghwa + the Kimpo tip given up
BRIDGEHEAD = [(126.80, 37.63), (126.86, 37.70), (126.96, 37.735), (127.04, 37.765), (127.12, 37.71), (127.19, 37.63), (127.22, 37.57)]
LINE_C = [(127.31, 37.535), (127.45, 37.58), (127.62, 37.62), (127.80, 37.64), (127.95, 37.66), (128.15, 37.70), (128.45, 37.82),
          (128.75, 37.92), (129.30, 37.98)]
JAN3 = WEST_C + BRIDGEHEAD + LINE_C
# 4 Jan (afternoon): Seoul abandoned, the last Han bridge blown ~14:00; UN on the south bank (Kimpo, Yongdungpo) until the night.
HAN_S = [(125.95, 37.45), (126.50, 37.55), (126.70, 37.59), (126.80, 37.58), (126.88, 37.545), (126.96, 37.51), (127.03, 37.515),
         (127.12, 37.53), (127.22, 37.545), (127.31, 37.525)]
JAN4 = HAN_S + [(127.45, 37.55), (127.62, 37.58), (127.80, 37.60), (127.95, 37.62), (128.15, 37.66), (128.45, 37.78), (128.75, 37.88),
                (129.30, 37.94)]
# 7 Jan, line D: west-coast anchor below Pyongtaek - Pyongtaek - Ansong - Changhowon-ni - the Han beyond it - Wonju - north-east
# toward Wonpo-ri (the eastern part a sieve: North Korean forces in the Hongchon - Wonju area).
JAN7 = [(125.95, 36.90), (126.80, 36.97), (126.95, 37.00), (127.09, 37.02), (127.20, 37.03), (127.28, 37.04), (127.45, 37.07),
        (127.64, 37.13), (127.74, 37.24), (127.85, 37.32), (127.95, 37.36), (128.15, 37.45), (128.45, 37.62), (128.75, 37.76), (129.30, 37.82)]
STATES = {"dec26": DEC26, "jan1": JAN1, "jan3": JAN3, "jan4": JAN4, "jan7": JAN7}


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]; self.W, self.H = J["size"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("L")) > 127
    def P(self, lon, lat):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)
    def poly(self, polys):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0


def save(M, path, un, co):
    land = M.land; un &= land; co &= land & ~un
    d_un = ndimage.distance_transform_edt(~co) if co.any() else np.full(un.shape, 1e9)
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[un, :3] = UN; out[un, 3] = (0.36 + 0.24 * np.exp(-d_un / 40.0))[un]
    out[co, :3] = CO; out[co, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((un & ndimage.binary_dilation(co, iterations=3)).astype(np.float32), 6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)          # the approved _mx strength
    out[sel & (rim > 0.35), :3] = RIM
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "UN px", int(un.sum()), "communist px", int(co.sum()))


if __name__ == "__main__":
    M = Map("seoul")
    for state, line in STATES.items():
        south = M.poly([line + [(line[-1][0], 30.0), (line[0][0], 30.0)]])
        save(M, f"assets/media/seoul_ctl_{state}_mx.png", south.copy(), ~south)
        # option 2: the same line in map px, clipped to the frame (+ a margin), only where it runs over land (coast rims dropped)
        pts = [[round(c, 1) for c in M.P(*q)] for q in line]
        segs, cur = [], []
        for x, y in pts:
            ok = -200 < x < M.W + 200 and -200 < y < M.H + 200
            if ok: cur.append([x, y])
            elif cur: segs.append(cur); cur = []
        if cur: segs.append(cur)
        json.dump(segs, open(f"assets/media/seoul_front_{state}.json", "w"))
