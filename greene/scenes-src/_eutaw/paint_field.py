"""Paint a stylised 1781 parchment battlefield for Eutaw Springs over the z15 bake.
writes greene/assets/eutaw_field1781.jpg (+ .json copied from eutaw_field.json)"""
import json, math, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

A = "/home/user/battle-maps/greene/assets"
W, H = 2880, 1620
rng = np.random.default_rng(1781)

bake = np.asarray(Image.open(f"{A}/eutaw_field.jpg").convert("L"), float)
detail = bake - np.asarray(Image.fromarray(bake.astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)), float)
PARCH = np.array([222, 208, 172], float)
base = np.ones((H, W, 3)) * PARCH + detail[..., None] * 0.35

def smooth(pts, n=16):
    out = []
    for i in range(len(pts) - 1):
        p0, p1, p2, p3 = pts[max(i - 1, 0)], pts[i], pts[i + 1], pts[min(i + 2, len(pts) - 1)]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in range(2)))
    out.append(tuple(pts[-1]))
    return out

# ---- geometry (shared with scenes-src/eutaw-3.js) ----
SANTEE = [(-40, 150), (400, 120), (800, 175), (1200, 140), (1600, 95), (1950, 150), (2250, 120), (2600, 170), (2920, 140)]
CREEK = [(2330, 1010), (2285, 850), (2215, 690), (2170, 520), (2185, 350), (2150, 160)]
ROAD = [(-40, 935), (500, 905), (1000, 925), (1450, 900), (1960, 885), (2400, 905), (2920, 945)]
CLEARING = [(1080, 770), (1260, 700), (1520, 610), (1800, 590), (2080, 640), (2250, 740), (2280, 900), (2230, 1080), (2000, 1160), (1700, 1170), (1320, 1110), (1080, 1060), (1030, 920)]
FIELD = [(820, 1080), (1000, 1060), (1120, 1120), (1110, 1250), (950, 1290), (810, 1230)]  # potato patch
THICKET = [(2010, 500), (2110, 450), (2180, 480), (2200, 600), (2150, 690), (2050, 700), (1990, 620)]
HOUSE = (1925, 775, 2010, 840)
GARDEN = (2015, 750, 2195, 880)

# woods mask: everything except clearing, field and river band
mask = Image.new("L", (W, H), 255)
d = ImageDraw.Draw(mask)
d.polygon(smooth(CLEARING + [CLEARING[0]], 10), fill=0)
d.polygon(smooth(FIELD + [FIELD[0]], 8), fill=0)
d.line(smooth(SANTEE), fill=0, width=200)
d.line(smooth(ROAD), fill=0, width=46)
mask = mask.filter(ImageFilter.GaussianBlur(10))
m = np.asarray(mask, float)[..., None] / 255

WOOD = np.array([168, 164, 118], float)
CLEAR = np.array([230, 218, 180], float)
img = base * 0 + (CLEAR + detail[..., None] * 0.3) * (1 - m) + (WOOD + detail[..., None] * 0.3) * m
im = Image.fromarray(img.clip(0, 255).astype(np.uint8)).convert("RGBA")

# tree crowns stippled in woods
lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dl = ImageDraw.Draw(lay)
mm = np.asarray(mask)
for _ in range(26000):
    x, y = rng.integers(0, W), rng.integers(0, H)
    if mm[y, x] < 170:
        continue
    r = rng.uniform(7, 13)
    g = rng.uniform(-12, 12)
    dl.ellipse((x - r + 2, y - r + 3, x + r + 2, y + r + 3), fill=(70, 66, 40, 70))
    dl.ellipse((x - r, y - r, x + r, y + r), fill=(int(142 + g), int(142 + g), int(96 + g), 235), outline=(78, 76, 46, 200), width=2)
    dl.ellipse((x - r * 0.45 - 2, y - r * 0.5 - 2, x + r * 0.2 - 2, y + r * 0.1 - 2), fill=(170, 168, 118, 160))
im = Image.alpha_composite(im, lay)

# grass tufts in clearing / field
lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dl = ImageDraw.Draw(lay)
for _ in range(5000):
    x, y = rng.integers(0, W), rng.integers(0, H)
    if mm[y, x] > 60 or y < 300:
        continue
    dl.line((x, y, x - 3, y - 6), fill=(140, 132, 90, 150), width=2)
    dl.line((x, y, x + 3, y - 6), fill=(140, 132, 90, 150), width=2)
# potato rows in the field
fm = Image.new("L", (W, H), 0); ImageDraw.Draw(fm).polygon(smooth(FIELD + [FIELD[0]], 8), fill=255)
fma = np.asarray(fm)
for yy in range(1060, 1300, 18):
    xs = [x for x in range(780, 1140, 6) if fma[yy, x] > 0]
    if xs:
        dl.line((xs[0] + 10, yy, xs[-1] - 10, yy + 8), fill=(120, 104, 70, 170), width=4)
im = Image.alpha_composite(im, lay)

# thicket: dense dark scrub
lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dl = ImageDraw.Draw(lay)
tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).polygon(smooth(THICKET + [THICKET[0]], 8), fill=255)
tma = np.asarray(tm)
for _ in range(9000):
    x, y = rng.integers(1960, 2220), rng.integers(430, 720)
    if tma[y, x] == 0:
        continue
    r = rng.uniform(5, 9)
    dl.ellipse((x - r, y - r, x + r, y + r), fill=(86, 94, 52, 245), outline=(44, 48, 26, 220), width=2)
im = Image.alpha_composite(im, lay)

# rivers, road
d = ImageDraw.Draw(im)
S = smooth(SANTEE)
d.line(S, fill=(96, 110, 100, 255), width=150, joint="curve")
d.line(S, fill=(150, 176, 180, 255), width=138, joint="curve")
d.line([(x, y - 30) for x, y in S], fill=(168, 192, 194, 255), width=18, joint="curve")
C = smooth(CREEK)
d.line(C, fill=(88, 104, 96, 255), width=24, joint="curve")
d.line(C, fill=(140, 170, 178, 255), width=16, joint="curve")
d.ellipse((2300, 985, 2370, 1035), fill=(140, 170, 178, 255), outline=(88, 104, 96, 255), width=4)  # the springs
R = smooth(ROAD)
d.line(R, fill=(120, 96, 64, 255), width=30, joint="curve")
d.line(R, fill=(214, 192, 146, 255), width=22, joint="curve")
for i in range(0, len(R) - 1, 2):
    d.line([R[i], R[i + 1]], fill=(170, 146, 104, 255), width=3)

# tents in the camp (rows of A-frames), skipping the road
for row, y in enumerate(range(660, 1120, 52)):
    for x in range(1520 + (row % 2) * 30, 1900, 62):
        if abs(y - 895) < 40:
            continue
        inside = Image.new("L", (1, 1))
        d.polygon([(x - 17, y + 12), (x + 17, y + 12), (x, y - 14)], fill=(242, 236, 220, 255), outline=(70, 60, 44, 255))
        d.line([(x, y - 14), (x, y + 12)], fill=(120, 110, 90, 255), width=2)
        d.line([(x - 17, y + 13), (x + 17, y + 13)], fill=(70, 60, 44, 255), width=2)

# walled garden with beds
gx0, gy0, gx1, gy1 = GARDEN
d.rectangle(GARDEN, fill=(196, 196, 140, 255))
for yy in range(gy0 + 16, gy1 - 8, 16):
    d.line([(gx0 + 14, yy), (gx1 - 14, yy)], fill=(122, 138, 80, 255), width=6)
d.rectangle(GARDEN, outline=(84, 58, 40, 255), width=9)
d.rectangle((gx0 + 4, gy0 + 4, gx1 - 4, gy1 - 4), outline=(160, 96, 70, 255), width=3)
# brick house
hx0, hy0, hx1, hy1 = HOUSE
d.rectangle((hx0 + 6, hy0 + 8, hx1 + 6, hy1 + 8), fill=(60, 40, 30, 120))
d.rectangle(HOUSE, fill=(160, 72, 50, 255), outline=(50, 30, 22, 255), width=5)
d.line([(hx0 + 4, (hy0 + hy1) / 2), (hx1 - 4, (hy0 + hy1) / 2)], fill=(90, 40, 28, 255), width=4)  # roof ridge
for k in range(3):
    xx = hx0 + 14 + k * 28
    d.rectangle((xx, hy1 - 12, xx + 10, hy1 - 4), fill=(236, 222, 170, 255))

out = im.convert("RGB")
# gentle vignette of paper tone
out.save(f"{A}/eutaw_field1781.jpg", quality=90)
j = json.load(open(f"{A}/eutaw_field.json")); j["name"] = "eutaw_field1781"
json.dump(j, open(f"{A}/eutaw_field1781.json", "w"), indent=1)
out.resize((1440, 810)).save("/tmp/claude-0/-home-user-battle-maps/93ea7f31-a762-5d4b-b1ac-1683f6be4e94/scratchpad/f2.png")
