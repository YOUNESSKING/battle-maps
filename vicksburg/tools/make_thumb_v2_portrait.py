"""Grant portrait for the v2 thumbnails (2026-11-19).
Source: LoC 2018666428 "[Portrait of Maj. Gen. Ulysses S. Grant, officer of the Federal Army]", Brady's National Photographic
Portrait Galleries, 1860-65, glass negative cwpb 06941 (master TIFF), public domain (LoC: no known restrictions).
Major-general shoulder strap (two stars), NOT the 1864 three-star lieutenant-general strap.
Input : youtube/thumb/work_v2/grant_loc06941_crop.png + grant_cut_isnet-general-use.png (rembg isnet cut-out of that crop)
Output: youtube/thumb/work_v2/grant_sepia_cut.png (Back Door recipe) and grant_colour_cut.png (Grand Maneuver recipe, hand-tinted)
usage (from vicksburg/): python3 tools/make_thumb_v2_portrait.py"""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
D = "youtube/thumb/work_v2/"
src = np.array(Image.open(D + "grant_loc06941_crop.png").convert("L")).astype(np.float32)
cut = np.array(Image.open(D + "grant_cut_isnet-general-use.png").convert("RGBA"))
H, W = src.shape
# ---- dust clean-up: small dark specks (black-hat) and small white specks (top-hat), inpainted ----
g8 = src.astype(np.uint8)
bh = cv2.morphologyEx(g8, cv2.MORPH_BLACKHAT, np.ones((9, 9), np.uint8)); th = cv2.morphologyEx(g8, cv2.MORPH_TOPHAT, np.ones((7, 7), np.uint8))
spk = ((bh > 38) | (th > 45)).astype(np.uint8) * 255
n, lab, st, _ = cv2.connectedComponentsWithStats(spk)
keep = np.zeros_like(spk)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] <= 40: keep[lab == i] = 255
# never touch eyes / mouth (they are dark legitimately)
for (x0, y0, x1, y1) in [(570, 380, 820, 440), (590, 560, 790, 600), (630, 470, 760, 530)]: keep[y0:y1, x0:x1] = 0
g8 = cv2.inpaint(g8, cv2.dilate(keep, np.ones((3, 3), np.uint8)), 3, cv2.INPAINT_TELEA)
_u = ((g8 > 175) & (np.mgrid[0:H, 0:W][0] > 800)).astype(np.uint8) * 255
n3, lab3, st3, _ = cv2.connectedComponentsWithStats(_u); _k = np.zeros_like(_u)
for i in range(1, n3):
    if st3[i, cv2.CC_STAT_AREA] < 260: _k[lab3 == i] = 255
g8 = cv2.inpaint(g8, cv2.dilate(_k, np.ones((7, 7), np.uint8)), 5, cv2.INPAINT_TELEA)
L = g8.astype(np.float32) / 255.0
# ---- alpha: hard 2 px matte from the isnet cut-out ----
a = cut[..., 3].astype(np.float32)
a = cv2.erode(a, np.ones((5, 5), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)
# ---- sepia (Back Door, like the published Grant + Marion BD) ----
def ramp(l, stops):
    out = np.zeros(l.shape + (3,), np.float32); xs = [s[0] for s in stops]
    for c in range(3): out[..., c] = np.interp(l, xs, [s[1][c] for s in stops])
    return out
Ls = np.clip((L - 0.04) / 0.9, 0, 1) ** 1.05
sep = ramp(Ls, [(0, (22, 15, 10)), (0.45, (128, 96, 66)), (0.8, (214, 188, 150)), (1, (246, 232, 206))])
Image.fromarray(np.dstack([sep.clip(0, 255).astype(np.uint8), a.astype(np.uint8)])).save(D + "grant_sepia_cut.png")
# ---- hand-tinted colour (Grand Maneuver): skin / hair / beard / navy uniform / gold buttons + strap ----
head = Image.new("L", (W, H), 0)
ImageDraw.Draw(head).polygon([(400, 100), (560, 70), (700, 140), (810, 250), (870, 400), (870, 560), (860, 700), (800, 790), (700, 815),
                              (590, 800), (505, 735), (482, 640), (420, 570), (395, 420), (380, 250)], fill=255)
head = np.array(head.filter(ImageFilter.GaussianBlur(10))).astype(np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W]
hair = ((yy < 255) | ((xx < 475) & (yy < 420)) | ((xx > 800) & (yy < 520))).astype(np.float32)
beard = ((yy > 515) | ((xx < 545) & (yy > 470)) | ((xx > 790) & (yy > 470))).astype(np.float32)
lips = ((xx > 610) & (xx < 780) & (yy > 560) & (yy < 600)).astype(np.float32)
hair = cv2.GaussianBlur(hair, (0, 0), 14); beard = cv2.GaussianBlur(beard, (0, 0), 14) * (1 - cv2.GaussianBlur(lips, (0, 0), 6) * 0.6)
Lc = np.clip((L - 0.03) / 0.92, 0, 1)
skin = ramp(Lc, [(0, (38, 20, 14)), (0.35, (122, 72, 50)), (0.65, (196, 136, 104)), (0.85, (232, 186, 156)), (1, (252, 226, 204))])
hairc = ramp(Lc, [(0, (24, 14, 8)), (0.4, (92, 58, 34)), (0.7, (150, 104, 66)), (1, (222, 190, 150))])
beardc = ramp(Lc, [(0, (26, 16, 10)), (0.4, (96, 66, 44)), (0.7, (156, 118, 86)), (1, (226, 202, 172))])
uni = ramp(Lc, [(0, (5, 7, 16)), (0.35, (15, 21, 42)), (0.6, (29, 39, 72)), (0.85, (64, 78, 118)), (1, (140, 150, 186))])
gold = ramp(Lc, [(0, (40, 26, 8)), (0.5, (150, 110, 40)), (0.8, (220, 178, 84)), (1, (255, 238, 170))])
hs = np.clip(hair - beard * 0.5, 0, 1)[..., None]; bs = beard[..., None]
headc = skin * (1 - hs) + hairc * hs; headc = headc * (1 - bs) + beardc * bs
# buttons + strap border/stars: bright blobs on the uniform
bright = ((L > 0.72) & (head < 0.5) & (yy > 700)).astype(np.uint8) * 255
bright = cv2.morphologyEx(bright, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n2, lab2, st2, _ = cv2.connectedComponentsWithStats(bright)
for i in range(1, n2):
    if st2[i, cv2.CC_STAT_AREA] < 260: bright[lab2 == i] = 0          # dust flecks, not buttons
gm = cv2.GaussianBlur(cv2.dilate(bright, np.ones((5, 5), np.uint8)).astype(np.float32) / 255, (0, 0), 2)[..., None]
strap = np.zeros((H, W), np.float32); cv2.fillPoly(strap, [np.array([(190, 880), (330, 850), (460, 900), (420, 990), (300, 990), (190, 940)])], 1.0)
silver = ramp(Lc, [(0, (10, 12, 22)), (0.5, (120, 122, 130)), (1, (242, 242, 236))])
ornament = gold * (1 - strap[..., None]) + (gold * 0.55 + silver * 0.45) * strap[..., None]
unic = uni * (1 - gm) + ornament * gm
col = headc * head[..., None] + unic * (1 - head[..., None])
Image.fromarray(np.dstack([col.clip(0, 255).astype(np.uint8), a.astype(np.uint8)])).save(D + "grant_colour_cut.png")
print("ok", W, H)
