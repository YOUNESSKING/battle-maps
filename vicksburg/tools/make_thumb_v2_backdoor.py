"""Vicksburg v2 thumbnail, MAIN, in the channel's 'Back Door' recipe (PACKAGING_GUIDE 0c item 3A; copied from
marion/tools/make_thumb_backdoor.py, only inputs/positions/labels changed).
Scene (different from the published Grant 'THE BACK DOOR' = city + river close-up): Champion Hill, 16 May 1863, seen from the east,
with Vicksburg small on its bluffs on the horizon and the Mississippi behind it. Painted aerial = vidIQ (purpose image, no people,
no flags, no text): youtube/thumb/work_v2/bg_vidiq_champion_v2.jpg.
Troops = OUR unit blocks only (Pemberton's red line on the crest, Grant's blue columns on the roads from the east).
usage (from vicksburg/): python3 tools/make_thumb_v2_backdoor.py "CUT LOOSE."   -> youtube/thumb/vicksburg-v2-MAIN-BD-<word>.jpg"""
import sys, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
W, H = 1280, 720; MT = "/home/user/battle-maps/marion/tools/"
AN = MT + "Anton-Regular.ttf"; SERB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
word = sys.argv[1] if len(sys.argv) > 1 else "CUT LOOSE."
tag_out = sys.argv[2] if len(sys.argv) > 2 else "MAIN-BD"
rng = np.random.default_rng(8)
# ---------- background ----------
im = Image.open("youtube/thumb/work_v2/bg_vidiq_champion_v2.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(0.72)).enhance(1.08).convert("RGBA")
def formation(im, c, col, cols, rows, cw=11, ch=7, gap=3, ang=-0.42):
    x0, y0 = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); d, ds = ImageDraw.Draw(lay), ImageDraw.Draw(sh)
    ca, sa = math.cos(ang), math.sin(ang)
    for i in range(cols):
        for j in range(rows):
            u, v = i * (cw + gap), j * (ch + gap); x = x0 + u * ca - v * sa; y = y0 + u * sa + v * ca
            pts = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in [(0, 0), (cw, 0), (cw, ch), (0, ch)]]
            ds.polygon([(p[0] + 2, p[1] + 3) for p in pts], fill=(0, 0, 0, 150))
            shade = tuple(int(v_ * rng.uniform(0.85, 1.05)) for v_ in col); d.polygon(pts, fill=shade + (255,), outline=tuple(int(v_ * 0.55) for v_ in col) + (255,))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(2))); return Image.alpha_composite(im, lay)
RED, BLUE = (176, 34, 40), (38, 78, 168)
# Pemberton's line along the crest of Champion Hill (smaller = further away)
for (x, y, c, r) in [(545, 199, 6, 2), (628, 195, 6, 2), (712, 192, 6, 2), (796, 190, 3, 2), (585, 226, 5, 2), (675, 222, 5, 2)]:
    im = formation(im, (x, y), RED, c, r, cw=9, ch=6, gap=2, ang=-0.03)
# Grant's columns coming up the roads from the east (foreground, bigger)
for (x, y, c, r, a) in [(285, 462, 6, 3, -0.42), (130, 445, 5, 3, -0.3), (470, 500, 7, 3, -0.55), (700, 305, 5, 3, -0.4),
                        (655, 386, 6, 3, -0.45), (230, 505, 4, 2, -0.42), (700, 470, 5, 3, -0.5)]:
    im = formation(im, (x, y), BLUE, c, r, ang=a)
# ---------- wide grungy white sweep arrow: from the east, up over Champion Hill, on to Vicksburg ----------
def grunge_arrow(im, pts, w0, w1):
    N = 140; P = []
    for t in np.linspace(0, 1, N):
        (a, b, c, d) = pts; x = (1 - t) ** 3 * a[0] + 3 * (1 - t) ** 2 * t * b[0] + 3 * (1 - t) * t ** 2 * c[0] + t ** 3 * d[0]; y = (1 - t) ** 3 * a[1] + 3 * (1 - t) ** 2 * t * b[1] + 3 * (1 - t) * t ** 2 * c[1] + t ** 3 * d[1]; P.append((x, y))
    P = P[:int(N * 0.9)]; L, R = [], []
    for i in range(len(P)):
        p0, p1 = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]; ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0]); w = (w0 + (w1 - w0) * i / len(P)) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    ang = math.atan2(P[-1][1] - P[-5][1], P[-1][0] - P[-5][0]); ex, ey = P[-1]; hw, hl = w1 * 1.15, w1 * 1.5
    head = [(ex + math.cos(ang + math.pi / 2) * hw, ey + math.sin(ang + math.pi / 2) * hw), (ex + math.cos(ang) * hl, ey + math.sin(ang) * hl), (ex - math.cos(ang + math.pi / 2) * hw, ey - math.sin(ang + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    tex = Image.effect_noise(im.size, 60).convert("L").filter(ImageFilter.GaussianBlur(1.2)); tex = ImageOps.autocontrast(tex)
    col = Image.composite(Image.new("RGBA", im.size, (214, 206, 190, 255)), Image.new("RGBA", im.size, (246, 242, 232, 255)), tex.point(lambda v: 255 if v < 70 else 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.paste(Image.new("RGBA", im.size, (0, 0, 0, 140)), (5, 8), m); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6)))
    out = im.copy(); out.paste(col, (0, 0), m.filter(ImageFilter.GaussianBlur(0.8))); return out
im = grunge_arrow(im, [(610, 620), (660, 390), (570, 262), (430, 192)], 62, 42)
# ---------- torn parchment place tags ----------
def parchment(im, xy, lines, size=30):
    f = ImageFont.truetype(SERB, size); d0 = ImageDraw.Draw(im); w = max(d0.textlength(l, font=f) for l in lines); h = len(lines) * (size + 6)
    x, y = xy; pw, ph = int(w + 36), int(h + 22)
    m = Image.new("L", im.size, 0); pts = [(x + i, y + rng.integers(-3, 4)) for i in range(0, pw + 1, 8)] + [(x + pw + rng.integers(-3, 4), y + j) for j in range(0, ph + 1, 8)] + [(x + i, y + ph + rng.integers(-3, 4)) for i in range(pw, -1, -8)] + [(x + rng.integers(-3, 4), y + j) for j in range(ph, -1, -8)]
    ImageDraw.Draw(m).polygon(pts, fill=255)
    paper = Image.new("RGBA", im.size, (232, 214, 172, 255)); n = Image.effect_noise(im.size, 30).convert("L").filter(ImageFilter.GaussianBlur(2))
    paper = Image.composite(Image.new("RGBA", im.size, (206, 182, 136, 255)), paper, n.point(lambda v: 120 if v > 150 else 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.paste(Image.new("RGBA", im.size, (0, 0, 0, 150)), (4, 6), m); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(4)))
    out = im.copy(); out.paste(paper, (0, 0), m); d = ImageDraw.Draw(out)
    for i, l in enumerate(lines): d.text((x + pw / 2, y + 11 + i * (size + 6)), l, font=f, fill=(40, 28, 16), anchor="ma")
    return out
im = parchment(im, (120, 30), ["VICKSBURG"], 44)
im = parchment(im, (575, 118), ["CHAMPION HILL"], 28)
# ---------- big sepia portrait right, on dark (Grant flipped to face the action) ----------
pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
for x in range(800, W): pd.line([(x, 0), (x, H)], fill=(16, 13, 10, int(255 * min(1, (x - 800) / 170) ** 1.2)))
im = Image.alpha_composite(im, pan)
sep = Image.open("youtube/thumb/work_v2/grant_sepia_cut.png").convert("RGBA").transpose(Image.FLIP_LEFT_RIGHT)
s = 0.6; sep = sep.resize((int(sep.width * s), int(sep.height * s)), Image.LANCZOS)
fx, fy = (1366 - 690) * s, 480 * s                      # face centre in the (flipped) crop
x0, y0 = int(1075 - fx), int(300 - fy)
shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", sep.size, (0, 0, 0, 255)); sb.putalpha(sep.split()[3].point(lambda v: int(v * 0.7)))
shd.alpha_composite(sb, (x0 - 14, y0 + 8)); im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(14)))
rim = Image.new("RGBA", sep.size, (255, 214, 150, 0)); a = sep.split()[3]
edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
rim.putalpha(Image.fromarray((np.array(edge).astype(float) * np.linspace(0.9, 0, sep.width)[None, :] * 0.6).astype(np.uint8)))
im.alpha_composite(rim, (x0, y0)); im.alpha_composite(sep, (x0, y0))
# ---------- bottom red brush band with speckled white text ----------
f = ImageFont.truetype(AN, 168); tw = ImageDraw.Draw(im).textlength(word, font=f)
bx0, by0, bx1, by1 = -10, 538, int(40 + tw + 70), 712
m = Image.new("L", (W, H), 0); top = [(x, by0 + int(rng.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(rng.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
right = [(bx1 + int(rng.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
ImageDraw.Draw(m).polygon(top + right + bot, fill=255)
band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
bsh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bsh.paste(Image.new("RGBA", (W, H), (0, 0, 0, 150)), (0, -6), m); im = Image.alpha_composite(im, bsh.filter(ImageFilter.GaussianBlur(8)))
im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 627), word, font=f, fill=255, anchor="lm")
speck = Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255)
tm = ImageChops.multiply(tm, speck)
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
key = word.replace(" ", "_").replace(".", "").replace("'", "")
out = f"youtube/thumb/vicksburg-v2-{tag_out}-{key}.jpg"; im.convert("RGB").save(out, quality=94); print(out)
