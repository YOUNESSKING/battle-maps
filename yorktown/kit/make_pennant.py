"""French royal pennant for the banners (critic r1: the plain white royal flag read as blank at 1080p): white field, gold edge,
three big gold fleurs-de-lis (drawn as bezier shapes), dark keyline. Writes assets/media/fr_royal_pennant.png (new file). python3 kit/make_pennant.py"""
from PIL import Image, ImageDraw
W, H, S = 600, 316, 4
im = Image.new("RGBA", (W * S, H * S), (246, 242, 230, 255)); d = ImageDraw.Draw(im)
GOLD, GOLD_D = (218, 172, 58, 255), (120, 84, 24, 255)
e = 24 * S; d.rectangle([0, 0, W * S - 1, H * S - 1], fill=GOLD_D); d.rectangle([5 * S, 5 * S, W * S - 5 * S, H * S - 5 * S], fill=GOLD)
d.rectangle([e, e, W * S - e, H * S - e], fill=GOLD_D); d.rectangle([e + 4 * S, e + 4 * S, W * S - e - 4 * S, H * S - e - 4 * S], fill=(246, 242, 230, 255))
def bez(p, n=40):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t**3 * p[3][0], u**3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t**3 * p[3][1]))
    return out
def fleur(cx, cy, k, col):
    P = lambda pts: [(cx + x * k, cy + y * k) for x, y in pts]
    centre = bez([(0, -50), (14, -32), (14, -4), (0, 12)]) + bez([(0, 12), (-14, -4), (-14, -32), (0, -50)])
    d.polygon(P(centre), fill=col)
    for sx in (1, -1):   # curled side petals
        pet = bez([(sx * 4, 8), (sx * 10, -22), (sx * 40, -34), (sx * 40, -12)]) + bez([(sx * 40, -12), (sx * 40, -2), (sx * 28, 0), (sx * 26, -10)]) + \
              bez([(sx * 26, -10), (sx * 22, -2), (sx * 12, 4), (sx * 6, 14)])
        d.polygon(P(pet), fill=col)
        foot = bez([(sx * 4, 22), (sx * 12, 24), (sx * 20, 34), (sx * 16, 44)]) + bez([(sx * 16, 44), (sx * 10, 36), (sx * 6, 32), (0, 34)])
        d.polygon(P(foot), fill=col)
    d.rectangle([cx - 22 * k, cy + 12 * k, cx + 22 * k, cy + 21 * k], fill=col)   # the band
for cx, cy in ((0.27, 0.38), (0.73, 0.38), (0.5, 0.64)):
    for off, col in ((4, GOLD_D), (0, GOLD)):
        fleur(W * S * cx + off * S, H * S * cy + off * S, 1.65 * S, col)
im.resize((W, H), Image.LANCZOS).save("assets/media/fr_royal_pennant.png"); print("assets/media/fr_royal_pennant.png")
