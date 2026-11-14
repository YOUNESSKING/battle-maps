"""Marion #18 thumbnails (PACKAGING_GUIDE 0b: face pop + ONE context image + 1-3 words), 2026-11-14.
usage (from marion/): python3 tools/make_thumb_marion.py
Images only from assets/media (PD/CC0, CREDITS.md) + our own map frames (hyperframes snapshot, saved in youtube/thumb/frame_*.jpg).
Face = Marion from John Blake White's painting (1810, PD; painted long after his death; no life portrait exists), cut out with rembg.
 A SWAMP FOX     : face left + Ranney's "Marion Crossing the Pee Dee" (1850) darkened on the right.        titles A, C (B ok)
 B INTO THE SWAMP: our map, 8 Nov 1780 chase (scene m2b 21 s), Tarleton's red route + Marion's blue route.  titles B, C (A ok)
 C NO CANNON     : our map, Fort Watson 23 Apr 1781 (scene m3b 56 s), Maham's log tower over the stockade.  titles C, A
Writes youtube/thumb/marion-thumb-{A_SWAMP_FOX,B_INTO_THE_SWAMP,C_NO_CANNON}.jpg + sheet.jpg (big + feed strip)."""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
M = "assets/media/"
T = "youtube/thumb/"
RED = (196, 22, 28)


def cutout():
    p = T + "marion_white_cut.png"
    if not os.path.exists(p):
        from rembg import new_session, remove
        im = Image.open(M + "src/white.jpg").convert("RGB").crop((930, 580, 1200, 960))
        im = im.resize((im.width * 3, im.height * 3), Image.LANCZOS)
        o = remove(im, session=new_session("isnet-general-use"))
        a = np.array(o.split()[3]).astype(np.float32)
        a[:620, :220] = 0                      # ghost of the neighbouring figure (left)
        a[a < 110] = 0
        o.putalpha(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)))
        o.save(p)
    return Image.open(p).convert("RGBA")


def face(img, x, hh, crop_bottom=0.78):
    c = cutout()
    c = c.crop((0, 60, c.width, int(c.height * crop_bottom)))
    ww = int(c.width * hh / c.height)
    c = c.resize((ww, hh), Image.LANCZOS)
    a = c.split()[3]
    rgb = c.convert("RGB").filter(ImageFilter.UnsharpMask(4, 90, 2))
    rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(1.25)).enhance(1.15)
    rgb = ImageEnhance.Brightness(rgb).enhance(1.12)
    c = rgb.convert("RGBA"); c.putalpha(a)
    rim = Image.new("RGBA", c.size, (255, 232, 196, 0))
    rim.putalpha(a.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.35)))
    y = H - hh + 10
    img.alpha_composite(rim, (x + 4, y)); img.alpha_composite(rim, (x - 4, y)); img.alpha_composite(c, (x, y))


def shade(img, side, width, alpha=225):
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
    for i in range(width):
        x = i if side == "left" else W - 1 - i
        d.line([(x, 0), (x, H)], fill=(8, 7, 5, int(alpha * (1 - i / width) ** 1.3)))
    img.alpha_composite(sh)


def brush(d, x, y, w, h, seed):
    rng = np.random.default_rng(seed)
    top = [(x + i, y + int(rng.integers(-7, 8))) for i in range(0, w + 1, 20)]
    bot = [(x + i, y + h + int(rng.integers(-8, 9))) for i in range(w, -1, -20)]
    d.polygon(top + [(x + w + 16, y + h // 2)] + bot + [(x - 12, y + h // 2)], fill=RED)


def banner(img, text, cx, y, size=124, tag=None, seed=3):
    d = ImageDraw.Draw(img); f = ImageFont.truetype(F, size)
    tw = d.textlength(text, font=f); bw = int(tw + 64); bx = int(cx - bw / 2)
    brush(d, bx, y, bw, int(size * 1.25), seed)
    d.text((cx, y + size * 0.1), text, font=f, fill=(252, 248, 238), anchor="ma", stroke_width=3, stroke_fill=(30, 8, 8))
    if tag:
        d.text((cx, y + size * 1.38), tag, font=ImageFont.truetype(F, 50), fill=(255, 255, 255), anchor="ma", stroke_width=4, stroke_fill=(10, 8, 6))


def arrow(img, pts, col, width=30, head=58):
    big = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    P = [(2 * x, 2 * y) for x, y in pts]
    x1, y1 = P[-1]; x0, y0 = P[-2]; ang = math.atan2(y1 - y0, x1 - x0)
    tip = (x1 + 2 * head * math.cos(ang), y1 + 2 * head * math.sin(ang))
    l = (x1 + 2 * head * 0.8 * math.cos(ang + 1.95), y1 + 2 * head * 0.8 * math.sin(ang + 1.95))
    r = (x1 + 2 * head * 0.8 * math.cos(ang - 1.95), y1 + 2 * head * 0.8 * math.sin(ang - 1.95))
    dense = []
    for (xa, ya), (xb, yb) in zip(P, P[1:]):
        n = max(1, int(math.hypot(xb - xa, yb - ya) / 3))
        dense += [(xa + (xb - xa) * k / n, ya + (yb - ya) * k / n) for k in range(n + 1)]
    for c, wv, grow in (((255, 255, 255, 255), 2 * width + 18, 12), (col + (255,), 2 * width, 0)):
        rr = wv / 2
        for (xq, yq) in dense: d.ellipse([xq - rr, yq - rr, xq + rr, yq + rr], fill=c)
        cx = (tip[0] + l[0] + r[0]) / 3; cy = (tip[1] + l[1] + r[1]) / 3
        g = lambda p: (p[0] + (p[0] - cx) * grow / 60, p[1] + (p[1] - cy) * grow / 60)
        d.polygon([g(tip), g(l), g(r)], fill=c)
    big = big.resize((W, H), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh.putalpha(big.split()[3].filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.5)))
    img.alpha_composite(sh, (4, 6)); img.alpha_composite(big)


def smooth(pts, n=40):
    """Catmull-Rom through the points."""
    P = [pts[0]] + pts + [pts[-1]]; out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    return out + [pts[-1]]


def save(img, name):
    p = T + f"marion-thumb-{name}.jpg"; img.convert("RGB").save(p, quality=92); return p


# ---------- A: SWAMP FOX (Ranney 1850 + White's Marion)
rn = Image.open(M + "arch_ranney.jpg").convert("RGB")             # 1613x1112, frame cropped off
rn = rn.crop((250, 210, 250 + 1290, 210 + 726)).resize((W, H), Image.LANCZOS)
rn = ImageEnhance.Brightness(ImageEnhance.Color(rn).enhance(0.6)).enhance(0.72)
rn = ImageEnhance.Contrast(rn).enhance(1.1)
A = rn.convert("RGBA"); shade(A, "left", 640)
face(A, -60, 735)
banner(A, "SWAMP FOX", 900, 40, size=132, tag="1780")
pA = save(A, "A_SWAMP_FOX")

# ---------- B: INTO THE SWAMP (our map, 8 Nov 1780 chase)
mp = Image.open(T + "frame_m2b_21s.jpg").convert("RGBA")
# the scene's small Union flag under Tarleton's banner shows St Patrick's red saltire (post-1801): our 1606 flag on top
mp.alpha_composite(Image.open(M + "gb_flag_1606.png").convert("RGBA").resize((41, 19), Image.LANCZOS), (660, 494))
# (Marion's small map banner stays: a patch would cut the river and the road; its head is unreadable at feed size)
mp = mp.convert("RGB").resize((W, H), Image.LANCZOS)  # full frame x0.667
mp = ImageEnhance.Brightness(mp).enhance(0.88)
B = mp.convert("RGBA")
k = 2 / 3
red = [(240 * k, 725 * k), (310 * k, 630 * k), (375 * k, 548 * k), (440 * k, 462 * k)]          # the red route (Tarleton)
blue = [(290 * k, 800 * k), (540 * k, 705 * k), (800 * k, 628 * k), (1010 * k, 490 * k), (1250 * k, 455 * k)]  # blue route (Marion)
arrow(B, smooth(blue), (31, 79, 196), width=20, head=40)
arrow(B, smooth(red), (200, 24, 30), width=18, head=38)
shade(B, "right", 560, alpha=200)
face(B, W - 440, 735)
banner(B, "INTO THE SWAMP", 420, 26, size=104, seed=5)
pB = save(B, "B_INTO_THE_SWAMP")

# ---------- C: NO CANNON (our map, Fort Watson, Maham tower)
fw = Image.open(T + "frame_m3b_56s.jpg").convert("RGB")
# the scene's fort flag has St Patrick's red saltire (post-1801): replace it with our 1606 Union flag for 1781
uf = Image.open(M + "gb_flag_1606.png").convert("RGBA").resize((50, 30), Image.LANCZOS)
fw = fw.convert("RGBA")
# hide the small map banner of Marion (its lithograph head next to the big painted face would read as two different men)
fw.paste(fw.crop((1090, 250, 1260, 480)), (1262, 250))
fw.alpha_composite(Image.new("RGBA", (54, 34), (60, 44, 30, 255)), (808, 488)); fw.alpha_composite(uf, (810, 490))
x0, y0 = 420, 190
fw = fw.crop((x0, y0, x0 + 1000, y0 + 563)).resize((W, H), Image.LANCZOS)
fw = ImageEnhance.Brightness(fw.convert("RGB")).enhance(0.9)
C = fw.convert("RGBA")
s = W / 1000   # short arrow: the riflemen on the tower fire down into the stockade
arrow(C, smooth([((1045 - x0) * s, (395 - y0) * s), ((985 - x0) * s, (470 - y0) * s), ((930 - x0) * s, (545 - y0) * s)]), (31, 79, 196), width=14, head=30)
shade(C, "left", 560, alpha=215)
face(C, -80, 735)
banner(C, "NO CANNON", 960, 22, size=120, seed=7)
ImageDraw.Draw(C).text((1250, 690), "FORT WATSON, 1781", font=ImageFont.truetype(F, 46), fill=(255, 255, 255), anchor="rb", stroke_width=4, stroke_fill=(10, 8, 6))
pC = save(C, "C_NO_CANNON")

# ---------- sheet: the three big + a feed-size strip next to dark competitor-style tiles
paths = [(pA, "A  SWAMP FOX  (MAIN: titles A, C)"), (pB, "B  INTO THE SWAMP  (titles B, C)"), (pC, "C  NO CANNON  (titles C, A)")]
SW = 3 * 640 + 4 * 20; sheet = Image.new("RGB", (SW, 800), (22, 21, 19)); d = ImageDraw.Draw(sheet)
f24 = ImageFont.truetype(F, 24); f18 = ImageFont.truetype(F, 18)
for i, (p, lab) in enumerate(paths):
    x = 20 + i * 660; d.text((x, 8), lab, font=f24, fill=(235, 225, 205))
    sheet.paste(Image.open(p).convert("RGB").resize((640, 360), Image.LANCZOS), (x, 40))
# feed strip: ours at 360x203 (sidebar size) + 168x94 (phone), with dark competitor-style tiles (plain dark paintings, no face pop)
y = 460; d.text((20, y - 34), "feed strip: ours (360 px) between dark competitor-style tiles (plain dark painting / dark battle, small text) + 168x94 phone size", font=f18, fill=(170, 160, 140))


def dark_tile(src, text):
    im = Image.open(src).convert("RGB")
    w, h = im.size; r = 16 / 9
    if w / h > r: cw = int(h * r); im = im.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
    else: ch = int(w / r); im = im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch))
    im = ImageEnhance.Brightness(ImageEnhance.Color(im.resize((360, 203), Image.LANCZOS)).enhance(0.35)).enhance(0.45)
    dt = ImageDraw.Draw(im); dt.text((180, 170), text, font=ImageFont.truetype(F, 22), fill=(200, 190, 170), anchor="mm")
    return im


tiles = [dark_tile(M + "arch_eutaw.jpg", "THE SOUTHERN CAMPAIGN"), Image.open(pA).convert("RGB").resize((360, 203), Image.LANCZOS),
         dark_tile(M + "arch_white.jpg", "AMERICAN REVOLUTION EXPLAINED"), Image.open(pB).convert("RGB").resize((360, 203), Image.LANCZOS),
         Image.open(pC).convert("RGB").resize((360, 203), Image.LANCZOS)]
for i, t in enumerate(tiles): sheet.paste(t, (20 + i * 375, y))
for i, (p, _) in enumerate(paths): sheet.paste(Image.open(p).convert("RGB").resize((168, 94), Image.LANCZOS), (20 + i * 188, y + 218))
d.text((600, y + 260), "phone feed size 168x94: A | B | C", font=f18, fill=(170, 160, 140))
sheet = sheet.crop((0, 0, SW, y + 330))
sheet.save(T + "sheet.jpg", quality=90)
for p in [pA, pB, pC, T + "sheet.jpg"]: print(p, Image.open(p).size, round(os.path.getsize(p) / 1e6, 2), "MB")
