"""Vicksburg v2 thumbnail, ALT (Test & Compare), in the Grand Maneuver recipe (PACKAGING_GUIDE 0c item 3B; built on
marion/tools/make_thumb_v10.py gm()). Dark navy map, faint hairline rivers + the glowing Mississippi, colour Grant cut-out on the
left (real LoC Brady photo, hand-tinted), huge cream Anton word top-right + one Cinzel line, red wax seal with crossed sabres at
the start (Bruinsburg, crossing 30 Apr 1863), ONE glowing blue arrow that swings east (Jackson) and back west to the payoff object
(painted Vicksburg on its bluff, vidIQ purpose image, transparent: youtube/thumb/work_v2/icon_vidiq_vicksburg_v1.png).
usage (from vicksburg/): python3 tools/make_thumb_v2_gm.py "CUT LOOSE." "5 BATTLES IN 18 DAYS" ALT-GM
(no "THEN": Port Gibson, 1 May, came before the 3 May cut-loose decision)"""
import sys, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; MT = "/home/user/battle-maps/marion/tools/"
AN = MT + "Anton-Regular.ttf"; SER = MT + "cinzel-600.ttf"
word = sys.argv[1] if len(sys.argv) > 1 else "CUT LOOSE."
sub = sys.argv[2] if len(sys.argv) > 2 else "5 BATTLES IN 18 DAYS"
tag_out = sys.argv[3] if len(sys.argv) > 3 else "ALT-GM"
def text_shadow(im, xy, txt, font, fill, anchor, off=(6, 8), blur=10, op=170, **kw):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((xy[0] + off[0], xy[1] + off[1]), txt, font=font, fill=(0, 0, 0, op), anchor=anchor, **kw)
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(blur))); ImageDraw.Draw(im).text(xy, txt, font=font, fill=fill, anchor=anchor, **kw); return im
def bez(pts, t):
    (a, b, c, d) = pts; return ((1 - t) ** 3 * a[0] + 3 * (1 - t) ** 2 * t * b[0] + 3 * (1 - t) * t ** 2 * c[0] + t ** 3 * d[0],
                                (1 - t) ** 3 * a[1] + 3 * (1 - t) ** 2 * t * b[1] + 3 * (1 - t) * t ** 2 * c[1] + t ** 3 * d[1])
def glow_arrow(im, pts, w0, w1, col, glow, tmax=0.9):
    P = [bez(pts, t) for t in np.linspace(0, tmax, 160)]; L, R = [], []
    for i in range(len(P)):
        a, b = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]; ang = math.atan2(b[1] - a[1], b[0] - a[0]); w = (w0 + (w1 - w0) * i / len(P)) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    a = math.atan2(P[-1][1] - P[-4][1], P[-1][0] - P[-4][0]); hw, hl = w1 * 1.9, w1 * 2.6; ex, ey = P[-1]
    head = [(ex + math.cos(a + math.pi / 2) * hw, ey + math.sin(a + math.pi / 2) * hw), (ex + math.cos(a) * hl, ey + math.sin(a) * hl), (ex - math.cos(a + math.pi / 2) * hw, ey - math.sin(a + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    g = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).polygon(poly, fill=glow); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(12)))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + 4, y + 6) for x, y in poly], fill=(0, 0, 0, 130)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6)))
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(lay).polygon(poly, fill=col); return Image.alpha_composite(im, lay)
def glossy_seal(im, c, R):
    sx, sy = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(22):
        a = i / 22 * 2 * math.pi; rr = R * 0.27; d.ellipse([sx + math.cos(a) * R * 0.92 - rr, sy + math.sin(a) * R * 0.92 - rr, sx + math.cos(a) * R * 0.92 + rr, sy + math.sin(a) * R * 0.92 + rr], fill=(120, 10, 16, 255))
    for r in range(int(R), 0, -1):
        t = r / R; d.ellipse([sx - r - (1 - t) * R * 0.2, sy - r - (1 - t) * R * 0.2, sx + r - (1 - t) * R * 0.2, sy + r - (1 - t) * R * 0.2], fill=(int(96 + 134 * (1 - t) ** 1.2), int(10 + 60 * (1 - t) ** 2), int(16 + 56 * (1 - t) ** 2), 255))
    d.ellipse([sx - R * 0.7, sy - R * 0.7, sx + R * 0.7, sy + R * 0.7], outline=(80, 6, 10, 255), width=5)
    for s in (1, -1):
        pts = [(sx - R * 0.48 * s + (R * 0.86 * s) * t, sy + R * 0.46 - R * 0.9 * t - math.sin(t * math.pi) * R * 0.12) for t in np.linspace(0, 1, 18)]
        d.line(pts, fill=(40, 40, 46, 255), width=11); d.line(pts, fill=(217, 221, 226, 255), width=7); d.line(pts[3:], fill=(255, 255, 255, 255), width=2)
        gx, gy = pts[3]; d.line([gx - 9 * s, gy - 9, gx + 9 * s, gy + 9], fill=(212, 170, 80, 255), width=6); d.line([pts[0], pts[3]], fill=(70, 40, 20, 255), width=8)
    hl = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(hl).ellipse([sx - R * 0.75, sy - R * 0.85, sx - R * 0.05, sy - R * 0.35], fill=(255, 210, 210, 110))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([sx - R + 6, sy - R + 11, sx + R + 6, sy + R + 11], fill=(0, 0, 0, 180))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(9))); im = Image.alpha_composite(im, lay); return Image.alpha_composite(im, hl.filter(ImageFilter.GaussianBlur(10)))
def block(im, c, col, w=34, h=22):
    x, y = c; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x - w / 2 + 3, y - h / 2 + 5, x + w / 2 + 3, y + h / 2 + 5], fill=(0, 0, 0, 150))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3))); d = ImageDraw.Draw(im)
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], fill=col + (255,), outline=(240, 234, 220, 255), width=2)
    d.line([x - w / 2 + 4, y + h / 2 - 4, x + w / 2 - 4, y - h / 2 + 4], fill=(240, 234, 220, 255), width=2); return im
rng = np.random.default_rng(9)
# ---------- navy base ----------
base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H))
base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
# ---------- word + subtitle mask (rivers are cut away under the text) ----------
f0 = ImageFont.truetype(AN, 250); tmp = Image.new("L", (1700, 330), 0); ImageDraw.Draw(tmp).text((0, 0), word, font=f0, fill=255); glyph = tmp.crop(tmp.getbbox())
glyph = glyph.resize((min(900, int(glyph.width * 1.0)), int(glyph.height * 0.95)), Image.LANCZOS)
CX = 815; gx, gy = int(CX - glyph.width / 2), 26
fs = ImageFont.truetype(SER, 36); s_ = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 22
tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((CX, sy_), s_, font=fs, fill=255, anchor="ma")
# ---------- hairline rivers + the glowing Mississippi (west = left, running N-S past Vicksburg and Bruinsburg) ----------
S = 2; lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); gl = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d, g = ImageDraw.Draw(lay), ImageDraw.Draw(gl)
def walk(x, y, ang, nn, wdt, depth, bright=1.0):
    pts = [(x, y)]
    for _ in range(nn):
        ang += rng.normal(0, 0.28); step = rng.uniform(14, 26) * S; x += math.cos(ang) * step; y += math.sin(ang) * step; pts.append((x, y))
        if depth < 2 and rng.random() < 0.05: walk(x, y, ang + rng.choice([-1, 1]) * rng.uniform(0.6, 1.1), int(nn * 0.5), wdt * 0.7, depth + 1, bright)
    g.line(pts, fill=(80, 150, 235, int(90 * bright)), width=int(9 * wdt)); d.line(pts, fill=(207, 228, 255, int(210 * bright)), width=max(2, int(3 * wdt)))
for (x, y, a) in [(1320, 640, 3.0), (900, 760, -1.5), (1320, 330, 3.2), (700, 760, -1.2)]: walk(x * S, y * S, a, 60, 0.8, 0, 0.8)
rv = Image.alpha_composite(gl.filter(ImageFilter.GaussianBlur(8)), lay).resize((W, H), Image.LANCZOS)
rv.putalpha(ImageChops.subtract(rv.split()[3].point(lambda v: int(v * 0.30)), tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, rv)
# the Mississippi: one glowing meandering line with the hairpin at Vicksburg
MS = [(585, 322), (610, 345), (640, 380), (600, 420), (520, 400), (500, 440), (520, 500), (560, 540), (520, 600), (480, 660), (500, 730)]
from scipy.interpolate import splprep, splev
tck, _ = splprep(np.array(MS).T, s=0); xs, ys = splev(np.linspace(0, 1, 300), tck); mp = list(zip(xs, ys))
mg = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(mg).line(mp, fill=(80, 150, 235, 150), width=26); im = Image.alpha_composite(im, mg.filter(ImageFilter.GaussianBlur(10)))
ml = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(ml).line(mp, fill=(190, 220, 255, 230), width=7); im = Image.alpha_composite(im, ml)
# ---------- payoff: painted Vicksburg on its bluff (east bank of the hairpin) ----------
VX, VY = 735, 418
ic = Image.open("youtube/thumb/work_v2/icon_vidiq_vicksburg_v1.png").convert("RGBA"); ic = ic.crop(ic.getbbox())
ia = np.array(ic.split()[3]).astype(float); h0 = int(ic.height * 0.80); ia[h0:] *= np.linspace(1, 0, ic.height - h0)[:, None] ** 1.6; ic.putalpha(Image.fromarray(ia.astype(np.uint8)))
ic.thumbnail((236, 236), Image.LANCZOS); px, py = int(VX - ic.width / 2), int(VY - ic.height * 0.62)
bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([VX - 150, VY - 130, VX + 150, VY + 130], fill=(255, 150, 60, 110)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(55)))
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", ic.size, (0, 0, 0, 255)); sb.putalpha(ic.split()[3].point(lambda v: int(v * 0.6))); sh.alpha_composite(sb, (px + 6, py + 10))
im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(10))); im.alpha_composite(ic, (px, py))
# ---------- the move: seal at Bruinsburg -> east to Jackson -> back west to Vicksburg ----------
BX, BY = 628, 604
for q in [(566, 556), (538, 586)]: im = block(im, q, (31, 79, 196))
im = glow_arrow(im, [(BX + 70, BY - 2), (1330, 690), (1220, 330), (VX + 150, VY + 6)], 34, 18, (126, 195, 255, 255), (70, 150, 240, 170), tmax=0.93)
for q in [(972, 440), (1008, 458)]: im = block(im, q, (200, 16, 46), 30, 20)            # Pemberton at Champion Hill, on the way back
im = glossy_seal(im, (BX, BY), 58)
fl = ImageFont.truetype(SER, 38); fsm = ImageFont.truetype(SER, 24)
for t, (x, y), anc, fnt in [("BRUINSBURG", (BX, 652), "ma", ImageFont.truetype(SER, 34)), ("VICKSBURG", (VX + 20, VY + 86), "ma", fl), ("JACKSON", (1140, 534), "ra", fsm), ("CHAMPION HILL", (990, 476), "ma", fsm)]:
    gg = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(gg).text((x, y), t, font=fnt, fill=(255, 210, 140, 150), anchor=anc); im = Image.alpha_composite(im, gg.filter(ImageFilter.GaussianBlur(6)))
    im = text_shadow(im, (x, y), t, fnt, (246, 232, 196), anc, off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
# small star for Jackson (state capital)
d = ImageDraw.Draw(im); jx, jy = 1167, 545; d.regular_polygon((jx, jy, 9), 5, fill=(246, 232, 196))
# ---------- word + subtitle ----------
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
im = text_shadow(im, (CX, sy_), s_, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
# ---------- colour portrait, left, facing right (toward the map) ----------
b = Image.open("youtube/thumb/work_v2/grant_colour_cut.png").convert("RGBA")
b = ImageEnhance.Contrast(b).enhance(1.15); a = b.split()[3]
s = 0.56; b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS); a = b.split()[3]
fx, fy = 690 * s, 480 * s; x0, y0 = int(215 - fx), int(300 - fy)
shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(a.point(lambda v: int(v * 0.75))); shd.alpha_composite(sb, (x0 + 12, y0 + 8))
im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(12)))
rim = Image.new("RGBA", b.size, (156, 196, 255, 0)); edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
rim.putalpha(Image.fromarray((np.array(edge).astype(float) * np.linspace(0, 1, b.width)[None, :] * 0.7).astype(np.uint8)))
im.alpha_composite(rim, (x0, y0)); im.alpha_composite(b, (x0, y0))
key = word.replace(" ", "_").replace(".", "")
out = f"youtube/thumb/vicksburg-v2-{tag_out}-{key}.jpg"; im.convert("RGB").save(out, quality=94); print(out)
