"""Vicksburg v4 thumbnail, MAIN (v3 + critic round 2: curved arrow with its tip in the town, tag moved clear, chunkier blue formations,
battlefield contrast 1.06, ear blotch softened). Built on the v3 script; v3 notes follow.
Vicksburg v3 thumbnail, MAIN, 'Back Door' recipe (PACKAGING_GUIDE 0c item 3A; Marion marion/tools/make_thumb_backdoor.py).
v3 = every fix of youtube/thumb/critic_MAIN.md (2026-11-19):
 - new painted aerial (vidIQ purpose image, prompt in thumb/fixes_v3.md): warm golden-sepia oil look, NO sky, Champion Hill crest burning
   (farmhouse fire + black smoke + gunsmoke along the crest), dust on the roads, Vicksburg on its bluff with the Mississippi BEHIND it
   (east-bank town, Union coming from the viewer's side = east). Graded down to the Grant-published mood (BF S ~30, R-B ~+28).
 - flames protected from the grade; extra fire glow + musket-smoke puffs between the lines + dust under the blue columns.
 - blue cut to ~1.1 % of the field (2-row columns ON the roads, (40,66,135)); red line on the crest grown to a real threat.
 - ONE grunge sweep arrow from the blue columns over the red line into Vicksburg; head below/next to the VICKSBURG tag.
 - tags: VICKSBURG 33 px, CHAMPION HILL 28 px.
 - portrait: real LoC Brady photo, hard 2 px matte (no rim), strap painted out, s 0.66, hair at the top edge, panel from x 840
   ramp 180, max alpha 0.85; drawn AFTER the band so the sleeve overlaps the band end cleanly.
usage (from vicksburg/): python3 tools/make_thumb_v4_backdoor.py "CUT LOOSE." MAIN-BD   -> youtube/thumb/vicksburg-v4-MAIN-BD-CUT_LOOSE.jpg"""
import sys, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
W, H = 1280, 720; MT = "/home/user/battle-maps/marion/tools/"
AN = MT + "Anton-Regular.ttf"; SERB = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
word = sys.argv[1] if len(sys.argv) > 1 else "CUT LOOSE."
tag_out = sys.argv[2] if len(sys.argv) > 2 else "MAIN-BD"
rng = np.random.default_rng(8)
# ---------- background + warm moody grade (flames protected) ----------
src = Image.open("youtube/thumb/work_v3/bg_vidiq_champion_v3.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
im = ImageEnhance.Contrast(ImageEnhance.Brightness(ImageEnhance.Color(src).enhance(0.355)).enhance(1.08)).enhance(1.12)
a = np.array(src).astype(int); fm = ((a[..., 0] > 200) & (a[..., 1] > 70) & (a[..., 2] < 110) & (a[..., 0] - a[..., 2] > 110)).astype(np.uint8) * 255
box = np.zeros_like(fm); box[150:250, 560:720] = 1; box[150:215, 900:1010] = 1; fm = fm * box
fm = Image.fromarray(fm).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(2))
hv = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2HSV).astype(np.float32)                     # foliage (yellow-green hues) a little richer than the
fol = ((hv[..., 0] > 17) & (hv[..., 0] < 45)).astype(np.float32); fol = cv2.GaussianBlur(fol, (0, 0), 2)   # golden fields: Grant-pub variety
hv[..., 1] = np.clip(hv[..., 1] * (1 + 0.55 * fol), 0, 255); im = Image.fromarray(cv2.cvtColor(hv.astype(np.uint8), cv2.COLOR_HSV2RGB))
im = Image.merge("RGB", [ch.point(lambda v, k=k: min(255, int(v * k))) for ch, k in zip(im.split(), (0.94, 0.99, 1.11))])   # pull R-B into the Grant-pub band
im = Image.composite(ImageEnhance.Brightness(src).enhance(1.16), im, fm)          # flames kept hot
top = Image.linear_gradient("L").resize((W, 130))      # 0 at the top -> 255 at y 130: darken the river strip a little
dark = Image.new("RGB", (W, H), (0, 0, 0)); vm = Image.new("L", (W, H), 0); vm.paste(top.point(lambda v: int((255 - v) * 0.30)), (0, 0))
im = Image.composite(dark, im, vm)
im = ImageEnhance.Contrast(im).enhance(1.06).convert("RGBA")          # round 2 (R2-4): feed-size contrast on the battlefield (portrait comes later)
# ---------- action: fire glow on the crest, musket smoke between the lines, dust under the blue ----------
def soft(im, col, shapes, blur):
    """solid colour layer whose ALPHA alone is drawn + blurred (no dark fringes from transparent black)"""
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
    for (box, a) in shapes: d.ellipse(box, fill=a)
    lay = Image.new("RGBA", (W, H), col + (0,)); lay.putalpha(m.filter(ImageFilter.GaussianBlur(blur))); return Image.alpha_composite(im, lay)
im = soft(im, (255, 130, 40), [([x - r, y - r * 0.7, x + r, y + r * 0.7], 110) for (x, y, r) in [(632, 214, 64), (952, 188, 34)]], 26)
im = soft(im, (255, 200, 110), [([612, 198, 662, 236], 130)], 9)
im = soft(im, (232, 224, 208), [([x - r * 1.5, y - r, x + r * 1.5, y + r], 95) for (x, y, r) in [(380, 300, 16), (470, 292, 14), (540, 300, 13), (300, 312, 13), (735, 268, 12)]], 10)
im = soft(im, (214, 182, 132), [([x - rx, y - ry, x + rx, y + ry], 70) for (x, y, rx, ry) in [(370, 478, 70, 22), (330, 430, 50, 16), (690, 482, 80, 22), (800, 430, 70, 18), (560, 520, 70, 18)]], 22)
# ---------- unit blocks ----------
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
RED, BLUE = (176, 34, 40), (40, 66, 135)
# Pemberton's line on the Champion Hill crest (left of the burning house and beyond it) + a second line down the slope
for (x, y, c, r, a_) in [(282, 262, 7, 2, -0.10), (392, 250, 6, 2, -0.06), (474, 244, 4, 2, -0.08), (676, 236, 6, 2, -0.12), (770, 222, 5, 2, -0.14),
                         (330, 300, 6, 2, -0.08), (410, 294, 6, 2, -0.05), (500, 284, 5, 2, -0.06), (700, 272, 5, 2, -0.12)]:
    im = formation(im, (x, y), RED, c, r, cw=11, ch=7, gap=2, ang=a_)
# Grant's columns coming up the two roads from the east (west = up the picture): round 2 = chunky 2 x 5-6 blocks of 13x8, gap 2 (Marion clusters)
for (x, y, c, r, a_) in [(400, 500, 6, 2, -0.95), (318, 430, 5, 2, -0.85), (505, 478, 6, 2, -0.35), (640, 446, 6, 2, -0.30),
                         (690, 506, 6, 2, -0.36), (790, 474, 5, 2, -0.40)]:
    im = formation(im, (x, y), BLUE, c, r, cw=13, ch=8, gap=2, ang=a_)
# ---------- wide grungy white sweep arrow: from the blue columns, over the red line, into Vicksburg ----------
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
ARROW = [(735, 505), (770, 320), (540, 222), (352, 92)]
im = grunge_arrow(im, ARROW, 62, 44)
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
    return out, (x, y, pw, ph)
im, TAG_V = parchment(im, (34, 112), ["VICKSBURG"], 33)
im, TAG_C = parchment(im, (36, 330), ["CHAMPION HILL"], 28)
# ---------- bottom red brush band with speckled white text ----------
f = ImageFont.truetype(AN, 168); tw = ImageDraw.Draw(im).textlength(word, font=f)
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
# ---------- big sepia portrait right (flipped to face the action), drawn after the band ----------
PX0, RAMP, AMAX = 840, 180, 0.85
pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
for x in range(PX0, W): pd.line([(x, 0), (x, H)], fill=(16, 13, 10, int(255 * AMAX * min(1, (x - PX0) / RAMP) ** 1.2)))
bandmask = m.filter(ImageFilter.MaxFilter(9)); pan.putalpha(ImageChops.subtract(pan.split()[3], bandmask))   # band stays red under the panel
im = Image.alpha_composite(im, pan)
sep = Image.open("youtube/thumb/work_v3/grant_sepia_cut_v4.png").convert("RGBA").transpose(Image.FLIP_LEFT_RIGHT)
S = 0.66; sep = sep.resize((int(sep.width * S), int(sep.height * S)), Image.LANCZOS)
fx, fy = (1366 - 690) * S, 480 * S
x0, y0 = int(1075 - fx), int(272 - fy)
shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", sep.size, (0, 0, 0, 255)); sb.putalpha(sep.split()[3].point(lambda v: int(v * 0.7)))
shd.alpha_composite(sb, (x0 - 14, y0 + 8)); im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(14)))
im.alpha_composite(sep, (x0, y0))
key = word.replace(" ", "_").replace(".", "").replace("'", "")
out = f"youtube/thumb/vicksburg-v4-{tag_out}-{key}.jpg"; im.convert("RGB").save(out, quality=94)
pa = np.zeros((H, W), np.uint8); pa_full = np.array(sep.split()[3])
ys, xs = slice(max(0, y0), min(H, y0 + sep.height)), slice(max(0, x0), min(W, x0 + sep.width))
pa[ys, xs] = pa_full[max(0, -y0):max(0, -y0) + (ys.stop - ys.start), max(0, -x0):max(0, -x0) + (xs.stop - xs.start)]
rows = np.nonzero(pa.max(1) > 128)[0]; sleeve = [np.nonzero(pa[y] > 128)[0].min() for y in range(560, 700) if (pa[y] > 128).any()]
_P = [(lambda t: ((1-t)**3*ARROW[0][0]+3*(1-t)**2*t*ARROW[1][0]+3*(1-t)*t**2*ARROW[2][0]+t**3*ARROW[3][0], (1-t)**3*ARROW[0][1]+3*(1-t)**2*t*ARROW[1][1]+3*(1-t)*t**2*ARROW[2][1]+t**3*ARROW[3][1]))(t) for t in np.linspace(0, 0.9 * 139 / 139, 126)]
_ang = math.atan2(_P[-1][1] - _P[-5][1], _P[-1][0] - _P[-5][0]); _tip = (_P[-1][0] + math.cos(_ang) * 44 * 1.5, _P[-1][1] + math.sin(_ang) * 44 * 1.5)
(_ax, _ay), (_bx, _by) = _P[0], _tip; _sag = max(abs((_by - _ay) * px_ - (_bx - _ax) * py_ + _bx * _ay - _by * _ax) / math.hypot(_by - _ay, _bx - _ax) for px_, py_ in _P)
_hw = 44 * 1.15; _tx, _ty, _tw, _th = TAG_V; _clear = min(math.hypot(max(_tx - qx, 0, qx - (_tx + _tw)), max(_ty - qy, 0, qy - (_ty + _th))) for qx, qy in
         [(_tip[0], _tip[1]), (_P[-1][0] + math.cos(_ang + math.pi / 2) * _hw, _P[-1][1] + math.sin(_ang + math.pi / 2) * _hw), (_P[-1][0] - math.cos(_ang + math.pi / 2) * _hw, _P[-1][1] - math.sin(_ang + math.pi / 2) * _hw)])
print(f"arrow tip=({_tip[0]:.0f},{_tip[1]:.0f}) sagitta={_sag:.0f}px head-to-tag clearance={_clear:.0f}px")
print(out, f"band_end_x={BAND_END} sleeve_left_x={min(sleeve) if sleeve else -1} hair_top_y={rows.min()} tagV={TAG_V} tagC={TAG_C}")
