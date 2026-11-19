"""Grant portraits for the v3 thumbnails (2026-11-19, critic fixes).
MAIN (Back Door, sepia): the REAL LoC Brady photo (LoC 2018666428, cwpb 06941, Maj. Gen. strap with two stars), as in v2, plus
  - Marion's hard matte: erode 7x7, threshold 128, Gaussian 3x3 (no halo / fringe),
  - the shoulder strap painted out (it falls at the frame edge once the portrait is flipped: critic MAIN fix 9, "stray insignia"),
  - face highlights pulled down (p95 L 92 -> ~86, critic MAIN fix 10).
ALT (Grand Maneuver, colour): vidIQ oil repaint of the same LoC photo (purpose image, reference = the LoC hosted jpeg 06941v; face,
  pose, uniform and two-star strap kept), rembg isnet cut, Marion's hard matte, strap toned down to button luminance, coat sat x0.8.
Inputs : youtube/thumb/work_v2/grant_loc06941_crop.png, work_v2/grant_cut_isnet-general-use.png,
         youtube/thumb/work_v3/grant_oil_vidiq_v3.jpg + work_v3/grant_oil_cut_isnet.png
Outputs: youtube/thumb/work_v3/grant_sepia_cut_v4.png, work_v3/grant_oil_cut_v4.png
usage (from vicksburg/): python3 tools/make_thumb_v3_portrait.py"""
import numpy as np, cv2
from PIL import Image, ImageEnhance
D2, D3 = "youtube/thumb/work_v2/", "youtube/thumb/work_v3/"

def hard_matte(a):
    a = cv2.erode(a.astype(np.float32), np.ones((7, 7), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY)
    return cv2.GaussianBlur(a, (3, 3), 0)

def ramp(l, stops):
    out = np.zeros(l.shape + (3,), np.float32); xs = [s[0] for s in stops]
    for c in range(3): out[..., c] = np.interp(l, xs, [s[1][c] for s in stops])
    return out

# ---------------- MAIN: sepia from the real photo ----------------
src = np.array(Image.open(D2 + "grant_loc06941_crop.png").convert("L"))
cut = np.array(Image.open(D2 + "grant_cut_isnet-general-use.png").convert("RGBA"))
H, W = src.shape
g8 = src.copy()
bh = cv2.morphologyEx(g8, cv2.MORPH_BLACKHAT, np.ones((9, 9), np.uint8)); th = cv2.morphologyEx(g8, cv2.MORPH_TOPHAT, np.ones((7, 7), np.uint8))
spk = ((bh > 38) | (th > 45)).astype(np.uint8) * 255
n, lab, st, _ = cv2.connectedComponentsWithStats(spk); keep = np.zeros_like(spk)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] <= 40: keep[lab == i] = 255
for (x0, y0, x1, y1) in [(570, 380, 820, 440), (590, 560, 790, 600), (630, 470, 760, 530)]: keep[y0:y1, x0:x1] = 0
g8 = cv2.inpaint(g8, cv2.dilate(keep, np.ones((3, 3), np.uint8)), 3, cv2.INPAINT_TELEA)
# extra dust specks at the left ear (critic zoom, v3): stronger black-hat in that box only
bx = (slice(330, 470), slice(370, 500)); sub = g8[bx]
bh2 = cv2.morphologyEx(sub, cv2.MORPH_BLACKHAT, np.ones((11, 11), np.uint8)); sp = ((bh2 > 18).astype(np.uint8) * 255)
g8[bx] = cv2.inpaint(sub, cv2.dilate(sp, np.ones((3, 3), np.uint8)), 4, cv2.INPAINT_TELEA)
# paint out the shoulder strap with the coat tone (sampled just below it), then soft texture from the inpaint
strap = np.zeros((H, W), np.uint8)
cv2.fillPoly(strap, [np.array([(170, 940), (190, 900), (325, 842), (472, 902), (432, 992), (300, 996), (176, 952)])], 255)
strap = cv2.dilate(strap, np.ones((9, 9), np.uint8))
patch = np.roll(g8, -150, axis=0)                     # coat texture from the sleeve 150 px below the strap
soft = cv2.GaussianBlur(strap, (0, 0), 6).astype(np.float32) / 255
g8 = (g8 * (1 - soft) + patch * soft).astype(np.uint8)
L = g8.astype(np.float32) / 255.0
a = hard_matte(cut[..., 3])
lip = np.zeros_like(strap)
cv2.fillPoly(lip, [np.array([(150, 985), (232, 932), (290, 862), (290, 820), (150, 820)])], 255); a[lip > 0] = 0; a = cv2.GaussianBlur(a, (3, 3), 0)
Ls = np.clip((L - 0.04) / 0.9, 0, 1) ** 1.05
Ls = np.where(Ls > 0.7, 0.7 + (Ls - 0.7) * 0.72, Ls)   # compress the high-key cheeks (p95 L ~92 -> ~86)
sep = ramp(Ls, [(0, (22, 15, 10)), (0.45, (128, 96, 66)), (0.8, (214, 188, 150)), (1, (246, 232, 206))])
Image.fromarray(np.dstack([sep.clip(0, 255).astype(np.uint8), a.astype(np.uint8)])).save(D3 + "grant_sepia_cut_v4.png")

# ---------------- ALT: oil repaint in colour ----------------
oil = Image.open(D3 + "grant_oil_vidiq_v3.jpg").convert("RGB")
oc = np.array(Image.open(D3 + "grant_oil_cut_isnet.png").convert("RGBA"))
rgb = np.array(ImageEnhance.Contrast(oil).enhance(1.08)).astype(np.float32)
hsv = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
coat = (hsv[..., 0] > 95) & (hsv[..., 0] < 135)                 # blue coat pixels (OpenCV hue 0-180)
hsv[..., 1] = np.where(coat, hsv[..., 1] * 0.8, hsv[..., 1])
yy = np.mgrid[0:hsv.shape[0], 0:hsv.shape[1]][0]
warmskin = (hsv[..., 0] < 25) & (yy < 1000)                       # face, hair, beard: calm the orange cast (target skin ~ (200,150,115))
hsv[..., 1] = np.where(warmskin, hsv[..., 1] * 0.74, hsv[..., 1]); hsv[..., 2] = np.where(warmskin, np.minimum(255, hsv[..., 2] * 1.0), hsv[..., 2])
rgb = cv2.cvtColor(hsv.clip(0, 255).astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)
# shoulder strap (gold border + stars, upper-left of the oil, x 60-380, y 1060-1210): bring it down to the brass-button level
sm = np.zeros(rgb.shape[:2], np.uint8); cv2.fillPoly(sm, [np.array([(60, 1150), (290, 1065), (385, 1120), (310, 1215), (70, 1175)])], 255)
sm = cv2.GaussianBlur(sm, (0, 0), 4).astype(np.float32)[..., None] / 255
rgb = rgb * (1 - sm) + rgb * 0.72 * sm
a = hard_matte(oc[..., 3])
Image.fromarray(np.dstack([rgb.clip(0, 255).astype(np.uint8), a.astype(np.uint8)])).save(D3 + "grant_oil_cut_v4.png")
print("ok")
