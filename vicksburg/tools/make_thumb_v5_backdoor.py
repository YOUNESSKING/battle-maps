"""Vicksburg v5 thumbnail, MAIN, 'Back Door' recipe (PACKAGING_GUIDE 0c item 3A, locked 2026-11-19; code = marion/tools/make_thumb_backdoor.py,
only inputs, positions and labels changed). Owner on v4: "the colors don't match, it looks washed off, the background doesn't match; the character
of that one [the published Grant] was great; why cut loose?"  ->  v5:
 - background: vidIQ purpose image in the PUBLISHED Grant look (vivid painted aerial, only slightly desaturated: olive woods, grey-blue river,
   brown roads, orange fires): Vicksburg on its bluffs over the Mississippi (upper left), the railroad east to Jackson burning (upper centre).
   Colour graded only to the published thumbnail's numbers (fixes_v5.md), no sepia wash.
 - portrait: the published thumbnail's own Grant panel (reference/thumbnails/ref-A-backdoor-PUBLISHED-grant.jpg, x >= ~830), same photo, tone,
   size and place ("the character of that one was great"), feathered into our scene.
 - word WRONG WAY. (0c item 1): viewers expect a general to march on the fortress; Grant marched EAST, away from Vicksburg, took Jackson
   (14 May), then turned back west and shut Vicksburg in (FACT_NOTES §7 Turn east, §19).
 - ONE grungy arrow: up from the Union columns, east to Jackson, hooking back west to Vicksburg. Tags VICKSBURG + JACKSON.
usage (from vicksburg/): python3 tools/make_thumb_v5_backdoor.py "WRONG WAY." MAIN-BD   -> youtube/thumb/vicksburg-v5-MAIN-BD-WRONG_WAY.jpg"""
import sys, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
W, H = 1280, 720; MT = "/home/user/battle-maps/marion/tools/"; RT = "/home/user/battle-maps/"
AN = MT + "Anton-Regular.ttf"; SERB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
word = sys.argv[1] if len(sys.argv) > 1 else "WRONG WAY."
tag_out = sys.argv[2] if len(sys.argv) > 2 else "MAIN-BD"
WORD_SIZE = int(sys.argv[3]) if len(sys.argv) > 3 else 150          # published Grant band ends at x ~829; 150 keeps ours there
COLOR, CONTRAST, BRIGHT = 1.20, 1.20, 0.77
rng = np.random.default_rng(8)
# ---------- background: painted aerial, graded only to the published thumbnail's numbers ----------
im = Image.open("youtube/thumb/work_v5/bg_vidiq_vicksburg_jackson_v5.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
im = ImageEnhance.Brightness(ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(COLOR)).enhance(CONTRAST)).enhance(BRIGHT)
im = Image.merge("RGB", [ch.point(lambda v, k=k: min(255, int(v * k))) for ch, k in zip(im.split(), (1.0, 0.975, 1.09))])
_src = Image.open("youtube/thumb/work_v5/bg_vidiq_vicksburg_jackson_v5.jpg").convert("RGB").resize((W, H), Image.LANCZOS); _a = np.array(_src).astype(int)
_fm = ((_a[..., 0] > 170) & (_a[..., 0] - _a[..., 2] > 90) & (_a[..., 1] > 60) & (_a[..., 1] < _a[..., 0] - 30)).astype(np.uint8) * 255; _fm[:, 860:] = 0
_fm = Image.fromarray(_fm).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(3))
im = Image.composite(ImageEnhance.Color(ImageEnhance.Brightness(_src).enhance(1.12)).enhance(1.15), im, _fm)   # the painted fires keep their heat (published Grant: orange fires)
im = im.convert("RGBA")   # published Grant: cooler river/haze
def soft(im, col, shapes, blur):
    """solid colour layer whose ALPHA alone is drawn + blurred (no dark fringes from transparent black)"""
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for (box, a) in shapes: d.ellipse(box, fill=a)
    lay = Image.new("RGBA", (W, H), col + (0,)); lay.putalpha(m.filter(ImageFilter.GaussianBlur(blur))); return Image.alpha_composite(im, lay)
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
RED, BLUE = (176, 34, 40), (38, 64, 120)
# Pemberton's army between Vicksburg and Jackson (the Champion Hill / Edwards Station ground), Johnston's men at Jackson
for (x, y, c, r, a_) in [(300, 300, 6, 2, -0.10), (395, 292, 6, 2, -0.08), (330, 336, 5, 2, -0.06), (430, 330, 5, 2, -0.05), (230, 330, 4, 2, -0.10)]:
    im = formation(im, (x, y), RED, c, r, cw=12, ch=8, gap=2, ang=a_)
# Grant's columns: up the road from the south, turning east toward Jackson, and the head of the column near Jackson
for (x, y, c, r, a_) in [(440, 500, 5, 2, -0.35), (540, 470, 5, 2, -0.35), (630, 430, 5, 2, -0.40), (712, 380, 5, 2, -0.55),
                         (760, 300, 4, 2, -0.85), (500, 420, 4, 2, -0.30)]:
    im = formation(im, (x, y), BLUE, c, r, cw=13, ch=8, gap=2, ang=a_)
# fire glow around the burning towns (Jackson burned by Sherman 14-15 May; Vicksburg = siege illustration) and the bursts below
im = soft(im, (255, 120, 30), [([590, 92, 740, 150], 120), ([620, 70, 700, 130], 140), ([80, 52, 150, 92], 90), ([170, 50, 330, 92], 60)], 16)
im = soft(im, (255, 175, 70), [([628, 100, 700, 138], 150), ([96, 62, 132, 84], 150), ([190, 60, 300, 82], 120)], 7)
# battle action between the lines (the published Grant has small orange bursts + gunsmoke across the field)
for (x, y) in [(470, 372), (395, 392), (300, 372), (560, 360), (620, 312)]:
    im = soft(im, (226, 220, 206), [([x - 30, y - 30, x + 26, y - 4], 120), ([x - 12, y - 40, x + 18, y - 18], 90)], 8)
    im = soft(im, (255, 110, 25), [([x - 16, y - 10, x + 16, y + 10], 190)], 5)
    im = soft(im, (255, 200, 110), [([x - 4, y - 3, x + 4, y + 3], 255)], 1.5)
im = soft(im, (210, 186, 140), [([x - rx, y - ry, x + rx, y + ry], 60) for (x, y, rx, ry) in [(500, 470, 70, 24), (640, 390, 70, 22), (740, 300, 50, 30)]], 20)
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
ARROW = [(470, 600), (880, 450), (760, 150), (330, 135)]
im = grunge_arrow(im, ARROW, 60, 44)
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
    return out, (x, y, pw, ph)
im, TAG_V = parchment(im, (36, 168), ["VICKSBURG"], 30)
im, TAG_J = parchment(im, (560, 60), ["JACKSON"], 30)
# ---------- bottom red brush band with speckled white text ----------
f = ImageFont.truetype(AN, WORD_SIZE); tw = ImageDraw.Draw(im).textlength(word, font=f)
bx0, by0, bx1, by1 = -10, 538, int(40 + tw + 70), 712
m = Image.new("L", (W, H), 0); topb = [(x, by0 + int(rng.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(rng.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
right = [(bx1 + int(rng.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
ImageDraw.Draw(m).polygon(topb + right + bot, fill=255)
band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
bsh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bsh.paste(Image.new("RGBA", (W, H), (0, 0, 0, 150)), (0, -6), m); im = Image.alpha_composite(im, bsh.filter(ImageFilter.GaussianBlur(8)))
im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 627), word, font=f, fill=255, anchor="lm")
speck = Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255)
tm = ImageChops.multiply(tm, speck)
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
BAND_END = max(p[0] for p in right)
# ---------- portrait: the PUBLISHED Grant thumbnail's own right panel (same photo, tone, size and place) ----------
ref = Image.open(RT + "reference/thumbnails/ref-A-backdoor-PUBLISHED-grant.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
head = Image.open("youtube/thumb/work_v5/grant_pub_cut_isnet.png").split()[3]           # rembg cut of the ref crop x 800-1280 (head)
hm = Image.new("L", (W, H), 0); hm.paste(head.point(lambda v: 255 if v > 100 else 0), (800, 0)); hm = hm.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(6))
ramp = Image.new("L", (W, H), 0); rd = ImageDraw.Draw(ramp)
for x in range(880, W): rd.line([(x, 0), (x, H)], fill=int(255 * min(1, (x - 880) / 90)))
coat = Image.new("L", (W, H), 0); ImageDraw.Draw(coat).polygon([(905, 500), (880, 560), (850, 640), (842, 720), (W, H), (W, 480)], fill=255)
coat = coat.filter(ImageFilter.GaussianBlur(10))
pm = ImageChops.lighter(ImageChops.lighter(hm, ramp), coat)
im = Image.composite(ref.convert("RGBA"), im, pm)
key = word.replace(" ", "_").replace(".", "").replace("'", "")
out = f"youtube/thumb/vicksburg-v5-{tag_out}-{key}.jpg"; im.convert("RGB").save(out, quality=94)
print(out, f"band_end_x={BAND_END} tagV={TAG_V} tagJ={TAG_J}")
