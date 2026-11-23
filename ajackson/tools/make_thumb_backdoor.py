"""Marion thumbnail in the PUBLISHED Grant 'THE BACK DOOR' recipe (grant/youtube/grant-thumb-PUBLISHED_THE_BACK_DOOR.jpg):
painted aerial battlefield with dense troop formations (our unit blocks in formation clusters), two torn-parchment place tags,
one wide grungy white sweep arrow into the objective, big SEPIA portrait right on dark, bottom red brush band with speckled white text.
usage (from marion/): python3 tools/make_thumb_backdoor.py "HE RAN."   -> youtube/thumb/marion-BD-<word>.jpg"""
import sys, math, numpy as np, runpy, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; SERB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
v9 = runpy.run_path("tools/make_thumb_v10.py", run_name="lib") if False else None
word = sys.argv[1] if len(sys.argv) > 1 else "HE RAN."
rng = np.random.default_rng(8)
# ---------- background: painted aerial (vidIQ, Georgian house burning, dusty road, swamp + fog) ----------
im = Image.open("youtube/thumb/bg_vidiq_brick.jpg").convert("RGB").crop((0, 60, 1560, 938)).resize((W, H), Image.LANCZOS)
im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(0.72)).enhance(1.1).convert("RGBA")
def formation(im, c, col, cols, rows, cw=11, ch=7, gap=3, ang=-0.42):
    """a painted-looking block formation: grid of small blocks, rotated along the road, shadowed"""
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
# Tarleton's Legion: formations stretched down the dusty road from the burning house
for (x, y, c, r) in [(560, 262, 6, 2), (650, 300, 7, 2), (752, 344, 7, 2), (855, 388, 6, 2), (600, 300, 4, 2), (708, 352, 5, 2)]:
    im = formation(im, (x, y), RED, c, r)
# Marion's men: small blue formations at the swamp edge (lower-left), slipping into the fog
for (x, y, c, r) in [(250, 470, 4, 2), (300, 500, 4, 2), (205, 505, 3, 2), (360, 470, 4, 2), (150, 480, 3, 2)]:
    im = formation(im, (x, y), BLUE, c, r, ang=-0.15)
# fog swallowing the escape
fog = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fog)
for k in range(6): r = 70 + k * 26; fd.ellipse([95 - r * 1.6, 390 - r * 0.6, 95 + r * 1.6, 390 + r * 0.6], fill=(240, 236, 226, 30))
im = Image.alpha_composite(im, fog.filter(ImageFilter.GaussianBlur(30)))
# ---------- wide grungy white sweep arrow (from behind the band, up and into the swamp) ----------
def grunge_arrow(im, pts, w0, w1):
    N = 140; P = []
    for t in np.linspace(0, 1, N):
        # cubic bezier through 4 points
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
im = grunge_arrow(im, [(330, 600), (560, 470), (330, 400), (140, 360)], 56, 44)
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
im = parchment(im, (500, 150), ["TARLETON"]); im = parchment(im, (70, 250), ["BLACK RIVER", "SWAMPS"], 28)
# ---------- big sepia portrait right, on dark ----------
pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
for x in range(820, W): pd.line([(x, 0), (x, H)], fill=(18, 14, 10, int(255 * min(1, (x - 820) / 150))))
im = Image.alpha_composite(im, pan)
src = Image.open("youtube/thumb/marion_oil_cut_clean.png").convert("RGBA").crop((0, 250, 1152, 2048))
a = np.array(src.split()[3]); a = cv2.erode(a, np.ones((7, 7), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)
g = ImageEnhance.Contrast(ImageOps.grayscale(src.convert("RGB"))).enhance(1.25)
sep = ImageOps.colorize(g, black=(26, 18, 12), mid=(140, 108, 78), white=(244, 230, 204)).convert("RGBA"); sep.putalpha(Image.fromarray(a))
sep = sep.transpose(Image.FLIP_LEFT_RIGHT); s = 228 / 260.0; sep = sep.resize((int(sep.width * s), int(sep.height * s)), Image.LANCZOS)
fx, fy = (1152 - 560) * s, (890 - 250) * s; x0, y0 = int(1060 - fx), int(345 - fy)
shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", sep.size, (0, 0, 0, 255)); sb.putalpha(sep.split()[3].point(lambda v: int(v * 0.7))); shd.alpha_composite(sb, (x0 - 14, y0 + 8))
im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(14))); im.alpha_composite(sep, (x0, y0))
# ---------- bottom red brush band with speckled white text ----------
f = ImageFont.truetype(AN, 168); tw = ImageDraw.Draw(im).textlength(word, font=f)
bx0, by0, bx1, by1 = -10, 538, int(40 + tw + 70), 712
m = Image.new("L", (W, H), 0); top = [(x, by0 + int(rng.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(rng.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
right = [(bx1 + int(rng.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
ImageDraw.Draw(m).polygon(top + right + bot, fill=255)
band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 627), word, font=f, fill=255, anchor="lm")
speck = Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255)
tm = ImageChops.multiply(tm, speck)
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
key = word.replace(" ", "_").replace(".", "")
out = f"youtube/thumb/marion-BD-{key}.jpg"; im.convert("RGB").save(out, quality=94); print(out)
