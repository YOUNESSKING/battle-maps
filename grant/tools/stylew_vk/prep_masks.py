"""Grant #16 move 2 Style W: river layers for msw_vk.py (run from grant/: python3 tools/stylew_vk/prep_masks.py).
Writes tools/stylew_vk/assets/media/<map>_det_riv(S).png; the originals in assets/media/ are never touched.
- mississippi (z8): main = the Mississippi on its 1863 course (the m2a RIV polyline, extended to the frame edges); the Gulf comes from sea=.
- vicksburg (z10): the modern main channel with the 1876 cut-off across De Soto Point erased and the 1863 hairpin (m2a LOOP63) drawn.
- vicksburg_siege (z12): main = the 1863 course of m2b (RIV63) + the channel above it; the modern cut-off and the post-1863 lakes erased.
- grandgulf (z12): the modern channel (= the 1863 one there, m2d), unchanged."""
import json, math, numpy as np, cv2
from PIL import Image
OUT = "tools/stylew_vk/assets/media"
def proj(m):
    J = json.load(open(f"assets/{m}_hd_lift.json")); z = J["zoom"]; ox, oy = J["origin_world_px"]; n = 256 * 2 ** z
    return lambda la, lo: ((lo + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(la))) / math.pi) / 2 * n - oy)
def load(m, n): return np.asarray(Image.open(f"assets/media/{m}_{n}.png"))[..., 3] > 25
def save(m, n, mask):
    a = np.zeros(mask.shape + (4,), np.uint8); a[mask] = (40, 90, 160, 255); Image.fromarray(a).save(f"{OUT}/{m}_{n}.png")
def chaikin(pts, n=3):
    P = np.array(pts, np.float64)
    for _ in range(n): P = np.vstack([P[:1]] + [np.array([0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]) for a, b in zip(P[:-1], P[1:])] + [P[-1:]])
    return P
def line(mask, pts, w):   # pts in scene px (2880 frame) -> map px (5760); Chaikin-rounded so the river has no corners
    cv2.polylines(mask, [np.array([[x * 2, y * 2] for x, y in chaikin(pts)], np.int32)], False, 1, int(w), cv2.LINE_AA); return mask
H, W = 3240, 5760
RIV = [[37.0, -89.18], [36.6, -89.5], [36.0, -89.7], [35.5, -90.0], [35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08],
       [33.05, -91.12], [32.80, -91.16], [32.60, -91.12], [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90],
       [32.247, -90.935], [32.13, -91.04], [32.04, -91.07], [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32],
       [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.70, -89.75], [29.30, -89.40]]
LOOP63 = [[32.402, -90.994], [32.394, -90.960], [32.387, -90.930], [32.381, -90.903], [32.376, -90.889], [32.367, -90.884], [32.352, -90.887], [32.336, -90.894], [32.321, -90.903]]
CUT = [[32.383, -91.001], [32.366, -91.003], [32.352, -90.975], [32.343, -90.945], [32.334, -90.922], [32.327, -90.909]]

def lakes(m, k=25):   # thick water bodies (oxbow lakes, reservoirs, the wide modern channel) -> removed from the creek source
    return cv2.dilate(cv2.morphologyEx(m.astype(np.uint8), cv2.MORPH_OPEN, np.ones((k, k), np.uint8)), np.ones((15, 15), np.uint8)) > 0

# ---- mississippi (z8): main = the 1863 RIV line (the same polyline the scenes use for the boats); creeks = the S layer outside it (longest paths)
M = proj("mississippi"); sea = cv2.dilate((np.asarray(Image.open("assets/mississippi_land.png").convert("L").resize((W, H))) < 128).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
S0 = load("mississippi", "det_rivS") & ~sea
big = line(np.zeros((H, W), np.uint8), [M(*p) for p in RIV], 10) > 0
cor = line(np.zeros((H, W), np.uint8), [M(*p) for p in RIV], 90) > 0
save("mississippi", "det_rivS", big); save("mississippi", "det_riv", S0 & ~cor)

# ---- vicksburg (z10): main = RIV with the 1863 hairpin (LOOP63) at the city (the 1876 cut-off never drawn); creeks = the S layer outside it
V = proj("vicksburg"); S0 = load("vicksburg", "det_rivS").copy()
R10 = RIV[:RIV.index([32.40, -91.00]) + 1] + LOOP63 + RIV[RIV.index([32.30, -90.90]):]
big = line(np.zeros((H, W), np.uint8), [V(*p) for p in R10], 14) > 0
cor = line(np.zeros((H, W), np.uint8), [V(*p) for p in R10], 140) > 0
cut = line(np.zeros((H, W), np.uint8), [V(*p) for p in CUT], 60) > 0
save("vicksburg", "det_rivS", big); save("vicksburg", "det_riv", S0 & ~cor & ~lakes(S0, 15) & ~cut)

# ---- vicksburg_siege (z12): scene px of m2b; main = the 1863 course (RIV63 + the channel above it); creeks = the S layer minus lakes/channel
RIV63 = [[750, -60], [758, 100], [772, 210], [800, 310], [840, 390], [960, 424], [1060, 520], [1160, 560], [1260, 600], [1350, 630], [1400, 656], [1418, 676],
         [1392, 700], [1365, 780], [1342, 860], [1310, 920], [1230, 980], [1180, 1060], [1140, 1160], [1100, 1280], [1060, 1400], [1020, 1520], [1000, 1680]]
SCUT = [[1030, 450], [1055, 540], [1070, 640], [1100, 720], [1170, 760], [1250, 778], [1330, 792]]
big = line(np.zeros((H, W), np.uint8), RIV63, 40) > 0
S0 = load("vicksburg_siege", "det_rivS")
er = (line(np.zeros((H, W), np.uint8), SCUT, 200) > 0) | (line(np.zeros((H, W), np.uint8), RIV63, 260) > 0)
save("vicksburg_siege", "det_rivS", big); save("vicksburg_siege", "det_riv", S0 & ~er & ~lakes(S0))

# ---- grandgulf (z12): main = the channel past Grand Gulf to Bruinsburg (m2d GGRIV, modern = 1863 here); creeks = the S layer minus lakes/channel
GGRIV = [[1545, -40], [1515, 100], [1480, 210], [1420, 290], [1340, 325], [1250, 300], [1215, 380], [1262, 500], [1290, 600], [1262, 690], [1180, 770], [1070, 835],
         [985, 915], [935, 1010], [900, 1100], [850, 1175], [740, 1240], [610, 1290], [520, 1370], [470, 1490], [440, 1660]]
big = line(np.zeros((H, W), np.uint8), GGRIV, 40) > 0
S0 = load("grandgulf", "det_rivS")
er = line(np.zeros((H, W), np.uint8), GGRIV, 300) > 0
save("grandgulf", "det_rivS", big); save("grandgulf", "det_riv", S0 & ~er & ~lakes(S0))
print("ok")
