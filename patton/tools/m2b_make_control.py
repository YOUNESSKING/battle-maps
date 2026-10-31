"""Who holds the ground for Patton #15 move 2 (map agent B: move2c-move2g), per date (STYLE_LOCK 2 + 2a; option 1 multiply `_mx`
look of collins/tools/make_bulge_control.py, A4 light red + E1 tone-down in the scene CSS).
usage (from patton/): python3 tools/m2b_make_control.py [assenois]
-> assets/media/m2b_ard_ctl_<dec19|dec22>_mx.png   ardennes (z9): the salient on 19 Dec (Bastogne still open to the south-west) and
                                                   22 Dec (Bastogne ringed since the night of 20-21 Dec, III Corps attacks north)
-> assets/media/m2b_bas_ctl_<dec19|dec22|dec26>_mx.png   bastogne (z11): 19 Dec, 22 Dec (ring + the German south flank facing
                                                   III Corps), 26 Dec (the corridor through Assenois)
-> assets/media/m2b_<map>_front_<state>.json       front polylines (map px) for option-2 close-ups (K.front; flank traced west -> east
                                                   so sideA = north = German; ring traced clockwise so sideA = outside = German)
Sources (positions approximate, a few km): FACTCHECK_B rows 8 (ring clamped shut night 20-21 Dec), 23-27, 30-31 (Cole ch. XIX/XXIII:
CCB Burnon 22 Dec, Chaumont 23 Dec, Martelange bridges blown 22 Dec, Warnach night 23 Dec, Bigonville 24 Dec, Ettelbruck 24-25 Dec,
CCR Remonville 25 Dec, Remichampagne - Clochimont - Assenois 26 Dec). Ardennes salient: collins/tools/make_bulge_control.py (Cole)."""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

DE, AL, RIM = (240, 105, 95), (110, 160, 255), (255, 140, 120)   # A4 light red, Allied blue, rim


class Map:
    def __init__(self, name):
        J = json.load(open(f"assets/{name}.json")); self.z, (self.ox, self.oy) = J["zoom"], J["origin_world_px"]; self.W, self.H = J["size"]
        self.mpp = J["meters_per_px"]
        self.land = np.array(Image.open(f"assets/{name}_land.png").convert("RGBA").resize((self.W, self.H)))[..., 3] > 127
    def P(self, lon, lat):
        n = 256 * 2 ** self.z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - self.ox, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - self.oy)
    def poly(self, polys):
        im = Image.new("L", (self.W, self.H), 0); d = ImageDraw.Draw(im)
        for pts in polys: d.polygon([self.P(*q) for q in pts], fill=255)
        return np.array(im) > 0
    def line(self, pts): return [[round(c, 1) for c in self.P(*q)] for q in pts]


def save(M, path, axis, al):
    land = M.land; axis = axis & land; al = al & land & ~axis
    d = ndimage.distance_transform_edt(~al) if al.any() else np.full(axis.shape, 1e9)
    k = max(6.0, min(1260.0 / M.mpp, 26.0))
    out = np.zeros((M.H, M.W, 4), np.float32)
    out[axis, :3] = DE; out[axis, 3] = (0.32 + 0.22 * np.exp(-d / (k * 6)))[axis]
    out[al, :3] = AL; out[al, 3] = 0.30
    rim = np.clip(ndimage.gaussian_filter((axis & ndimage.binary_dilation(al, iterations=3)).astype(np.float32), k * 0.6) * 3.0, 0, 1) * land
    sel = rim > 0.02
    out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array(RIM, np.float32) * rim[sel, None]
    out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    out[..., 3] = np.minimum(out[..., 3] * 1.9, 234 / 255)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(path, optimize=True)
    print("wrote", path, "german px", int(axis.sum()), "allied px", int(al.sum()))


# ---------------- the ring round Bastogne (101st Airborne + CCB 10th Armd + Team SNAFU), clamped shut the night of 20-21 Dec ----------
# clockwise on screen from the west: Mande-St-Etienne, Champs, Longchamps, Foy/Recogne, Bizory, Marvie (inside), Remoifosse, north of
# Assenois (German until 26 Dec), Senonchamps
RING = [(5.615, 50.008), (5.640, 50.036), (5.690, 50.052), (5.737, 50.041), (5.765, 50.018), (5.762, 49.985), (5.728, 49.967),
        (5.690, 49.973), (5.648, 49.984)]
# 26 Dec: the narrow corridor from Clochimont / Remichampagne north through Assenois into the ring (4th Armd CCR, 16:50)
CORR = [(5.650, 49.942), (5.668, 49.944), (5.684, 49.958), (5.696, 49.970), (5.700, 49.980), (5.684, 49.982), (5.672, 49.970),
        (5.658, 49.956)]
# Luxembourg - Germany border (Our, Sauer, Moselle), north -> south; Germany east of it
BORDER = [(6.13, 50.25), (6.13, 50.17), (6.17, 50.06), (6.25, 49.95), (6.32, 49.87), (6.42, 49.81), (6.50, 49.73), (6.52, 49.70),
          (6.42, 49.60), (6.37, 49.40)]
EAST_CLOSE = [(7.2, 49.40), (7.2, 50.30)]
# German south flank on the bastogne map (west -> east). 19 Dec: the drive has reached Noville / Neffe / Wardin east of Bastogne,
# Wiltz has fallen, the 7th Army is across the Sauer toward Ettelbruck; Bastogne still open to the south and west.
FL19 = [(5.62, 50.30), (5.62, 50.21), (5.70, 50.15), (5.75, 50.10), (5.762, 50.06), (5.768, 50.01), (5.79, 49.97), (5.86, 49.94),
        (5.93, 49.925), (5.98, 49.88), (6.05, 49.86), (6.10, 49.85), (6.20, 49.83), (6.33, 49.80), (6.42, 49.81)]
# 22 Dec (06:00, III Corps attacks): German ground from the St-Hubert road east past Sibret, Chaumont, Warnach (German), Martelange
# (Sauer bridges blown), Bigonville (German until 24 Dec), the Sauer at Ettelbruck (German until 24-25 Dec) to Echternach
FL22 = [(4.60, 50.03), (5.20, 50.00), (5.40, 49.965), (5.52, 49.93), (5.58, 49.905), (5.645, 49.896), (5.70, 49.874), (5.735, 49.845),
        (5.78, 49.838), (5.83, 49.835), (5.90, 49.84), (5.98, 49.84), (6.06, 49.84), (6.09, 49.837), (6.20, 49.82), (6.33, 49.80), (6.42, 49.81)]
# 26 Dec: CCR through Remonville / Remichampagne / Clochimont (25-26 Dec), CCB past Chaumont toward Hompre, CCA past Warnach / Tintange,
# the 26th Division at Eschdorf, the 80th at Ettelbruck; the corridor opens at 16:50
FL26 = [(4.60, 50.03), (5.20, 50.00), (5.40, 49.965), (5.52, 49.935), (5.60, 49.940), (5.650, 49.942), (5.668, 49.944), (5.684, 49.958),
        (5.700, 49.948), (5.712, 49.930), (5.745, 49.905), (5.80, 49.89), (5.88, 49.885), (5.95, 49.882), (6.02, 49.866), (6.08, 49.856),
        (6.20, 49.83), (6.33, 49.80), (6.42, 49.81)]


def german_bas(M, flank):
    north = flank + [(p) for p in BORDER[5:]] + [EAST_CLOSE[0], EAST_CLOSE[1], (flank[0][0], 50.30)]
    return M.poly([north]) | M.poly([BORDER + EAST_CLOSE])


def bastogne():
    M = Map("bastogne")
    ring, corr = M.poly([RING]), M.poly([CORR])
    st = {"dec19": german_bas(M, FL19), "dec22": german_bas(M, FL22) & ~ring, "dec26": german_bas(M, FL26) & ~ring & ~corr}
    for s, ax in st.items():
        save(M, f"assets/media/m2b_bas_ctl_{s}_mx.png", ax, ~ax)
    r = M.line(RING); r.append(r[0])
    fronts = {"dec19": [M.line(FL19[1:])], "dec22": [M.line(FL22), r],
              # 26 Dec: the flank runs up the west side of the corridor, round the ring and back down the east side
              "dec26": [M.line(FL26[:6] + [(5.672, 49.970), (5.684, 49.982)]), M.line([(5.700, 49.980), (5.696, 49.970)] + FL26[7:]), r]}
    for s, fr in fronts.items(): json.dump(fr, open(f"assets/media/m2b_bas_front_{s}.json", "w"))


# ---------------- ardennes (z9): the whole salient + the Third Army front on the Saar ----------------
NL_ROER = [(2.6, 53.6), (3.9, 51.78), (4.6, 51.70), (5.3, 51.76), (5.75, 51.90), (6.02, 51.85), (6.10, 51.60), (6.05, 51.40),
           (5.95, 51.15), (6.10, 51.00), (6.30, 50.92), (6.45, 50.80), (6.40, 50.66)]
START = [(6.24, 50.55), (6.27, 50.42), (6.38, 50.30), (6.18, 50.18), (6.13, 50.06), (6.18, 49.94), (6.30, 49.84), (6.42, 49.80)]
SAAR = [(6.50, 49.68), (6.40, 49.48), (6.62, 49.38), (6.78, 49.30), (7.00, 49.15), (7.40, 49.10), (7.95, 49.03), (8.18, 48.97),
        (7.82, 48.62), (7.72, 48.40)]   # Third Army on the Saar (Saarlautern bridgehead, Sarreguemines), Seventh Army to Alsace
WEST = NL_ROER + START + SAAR
# 19 Dec: north shoulder at Elsenborn, Peiper at Stoumont, St-Vith still held (US pocket), Houffalize, Noville, Wiltz, Ettelbruck
B19 = [(6.24, 50.55), (6.12, 50.46), (5.95, 50.43), (5.80, 50.41), (5.86, 50.33), (5.88, 50.22), (5.78, 50.15), (5.75, 50.10),
       (5.762, 50.06), (5.768, 50.01), (5.79, 49.97), (5.86, 49.94), (5.93, 49.925), (5.98, 49.88), (6.05, 49.86), (6.15, 49.84),
       (6.30, 49.82), (6.42, 49.80)] + START[::-1]
STVITH19 = [(5.95, 50.37), (6.13, 50.37), (6.22, 50.30), (6.12, 50.19), (5.97, 50.21)]
# 22 Dec: St-Vith lost (21 Dec), the tip at Hotton / Marche, the south flank from St-Hubert past Bastogne (ringed) to Echternach
B22 = [(6.24, 50.55), (6.20, 50.46), (6.06, 50.44), (5.93, 50.41), (5.86, 50.36), (5.72, 50.31), (5.60, 50.29), (5.47, 50.26),
       (5.36, 50.22), (5.28, 50.20), (5.25, 50.15), (5.28, 50.08), (5.33, 50.02), (5.40, 49.965), (5.52, 49.93), (5.645, 49.896),
       (5.70, 49.874), (5.735, 49.845), (5.83, 49.835), (5.98, 49.84), (6.09, 49.837), (6.20, 49.82), (6.33, 49.80), (6.42, 49.80)] + START[::-1]


def ardennes():
    M = Map("ardennes")
    base = M.poly([WEST + [(WEST[-1][0], 45), (12, 45), (12, 56), (WEST[0][0], 56)]])
    st = {"dec19": base | (M.poly([B19]) & ~M.poly([STVITH19])), "dec22": base | (M.poly([B22]) & ~M.poly([RING]))}
    for s, ax in st.items(): save(M, f"assets/media/m2b_ard_ctl_{s}_mx.png", ax, ~ax)
    pre = [(6.30, 50.95), (6.45, 50.80), (6.40, 50.66)]
    fr19 = [M.line(pre + B19[:len(B19) - len(START) + 1] + SAAR[:6])]
    r = M.line(RING); r.append(r[0])
    fr22 = [M.line(pre + B22[:len(B22) - len(START) + 1] + SAAR[:6]), r]
    json.dump({"dec19": fr19, "dec22": fr22}, open("assets/media/m2b_ard_front.json", "w"))


def assenois():
    M = Map("assenois")
    ring, corr = M.poly([RING]), M.poly([CORR])
    for s, fl, cut in (("dec26a", FL22, ring), ("dec26", FL26, ring | corr)):
        ax = german_bas(M, fl) & ~cut
        save(M, f"assets/media/m2b_ass_ctl_{s}_mx.png", ax, ~ax)
    r = M.line(RING); r.append(r[0])
    json.dump({"ring": r, "fl22": M.line(FL22), "fl26w": M.line(FL26[:6] + [(5.672, 49.970), (5.684, 49.982)]),
               "fl26e": M.line([(5.700, 49.980), (5.696, 49.970)] + FL26[7:])}, open("assets/media/m2b_ass_front.json", "w"))


if __name__ == "__main__":
    if "assenois" in sys.argv[1:]: assenois()
    else: bastogne(); ardennes()
