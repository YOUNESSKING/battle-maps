# Guilford battlefield overlay: woods, clearings (fields), roads -> greene/assets/gf_terrain.png
import numpy as np, math
from PIL import Image, ImageDraw, ImageFilter
W, H = 2880, 1620
OUT = "/tmp/claude-0/-home-user-battle-maps/93ea7f31-a762-5d4b-b1ac-1683f6be4e94/scratchpad/gf_terrain.png"
def cr(pts, n=16):
    P = [pts[-1]] + pts + [pts[0], pts[1]]  # closed Catmull-Rom
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2*p1[j]) + (-p0[j]+p2[j])*t + (2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t + (-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t**3) for j in (0, 1)))
    return out
def crline(pts, n=16):
    P = [pts[0]] + pts + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i-1], P[i], P[i+1], P[i+2]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2*p1[j]) + (-p0[j]+p2[j])*t + (2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t*t + (-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t**3) for j in (0, 1)))
    out.append(pts[-1]); return out
fields = [
    [(170, 720), (520, 650), (975, 668), (985, 1130), (620, 1210), (210, 1160)],          # 1st clearing (Hoskins farm)
    [(1480, 900), (1640, 880), (1660, 1040), (1500, 1070)],                                # small clearing in the woods
    [(1740, 540), (2080, 450), (2420, 470), (2700, 520), (2760, 760), (2440, 820), (2300, 990), (1900, 1020), (1720, 860)],  # 3rd clearing + village
]
fm = Image.new("L", (W, H), 0); d = ImageDraw.Draw(fm)
for f in fields: d.polygon(f, fill=255)
fm = fm.filter(ImageFilter.GaussianBlur(3))
F = np.asarray(fm, float) / 255
img = np.zeros((H, W, 4), float)
# woods wash
woods = 1 - F
img[..., :3] = np.array([96, 112, 62]); img[..., 3] = woods * 72
# fields: light wash
fl = np.array([238, 226, 190]); a = F * 70
img[..., :3] = (img[..., :3] * img[..., 3:4] + fl * a[..., None]) / np.maximum(img[..., 3:4] + a[..., None], 1)
img[..., 3] = np.maximum(img[..., 3], a)
base = Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGBA")
top = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(top)
# furrows in fields
fur = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fur)
for c in range(-2000, 4000, 16):
    fd.line([(c, 0), (c + 700, H)], fill=(150, 125, 80, 60), width=2)
fmask = Image.fromarray((F > 0.6).astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(2))
top.paste(fur, (0, 0), fmask)
# field outlines
for f in fields: td.line(f + [f[0]], fill=(120, 95, 60, 150), width=3)
# trees
rng = np.random.default_rng(1781)
trees = []
for y in range(-10, H + 20, 24):
    for x in range(-10, W + 20, 26):
        px, py = x + rng.uniform(-9, 9) + (13 if (y // 24) % 2 else 0), y + rng.uniform(-8, 8)
        xi, yi = int(min(max(px, 0), W - 1)), int(min(max(py, 0), H - 1))
        if F[yi, xi] < 0.15 and rng.random() < 0.7: trees.append((px, py, rng.uniform(7, 11)))
trees.sort(key=lambda t: t[1])
for px, py, r in trees:
    td.ellipse([px - r + 2, py - r + 4, px + r + 2, py + r + 4], fill=(60, 60, 30, 70))
    g = int(rng.uniform(-10, 10))
    td.ellipse([px - r, py - r, px + r, py + r], fill=(112 + g, 128 + g, 70 + g, 200), outline=(58, 66, 34, 220), width=2)
road = crline([(0, 960), (420, 925), (960, 880), (1400, 835), (1800, 785), (2130, 730), (2440, 648), (2880, 560)])
reedy = crline([(2440, 648), (2340, 470), (2200, 280), (2080, 100), (2010, -20)])
for pts, w in ((road, 20), (reedy, 14)):
    td.line(pts, fill=(96, 70, 40, 235), width=w, joint="curve")
    td.line(pts, fill=(214, 190, 142, 255), width=w - 8, joint="curve")
out = Image.alpha_composite(base, top)
out.save(OUT, optimize=True)
prev = Image.open("/home/user/battle-maps/greene/assets/gf_field.jpg").convert("RGBA")
Image.alpha_composite(prev, out).convert("RGB").resize((1440, 810)).save("/tmp/claude-0/-home-user-battle-maps/93ea7f31-a762-5d4b-b1ac-1683f6be4e94/scratchpad/gf_terrain_prev.jpg")
print(len(trees))
