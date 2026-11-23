import math, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageOps
W,H=1280,720
rng=np.random.default_rng(8)
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
def glossy_seal(im, c, R):
    sx, sy = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(22):
        a = i / 22 * 2 * math.pi; rr = R * 0.27; d.ellipse([sx + math.cos(a) * R * 0.92 - rr, sy + math.sin(a) * R * 0.92 - rr, sx + math.cos(a) * R * 0.92 + rr, sy + math.sin(a) * R * 0.92 + rr], fill=(120, 10, 16, 255))
    for r in range(int(R), 0, -1):
        t = r / R; d.ellipse([sx - r - (1 - t) * R * 0.2, sy - r - (1 - t) * R * 0.2, sx + r - (1 - t) * R * 0.2, sy + r - (1 - t) * R * 0.2], fill=(int(96 + 134 * (1 - t) ** 1.2), int(10 + 60 * (1 - t) ** 2), int(16 + 56 * (1 - t) ** 2), 255))
    d.ellipse([sx - R * 0.7, sy - R * 0.7, sx + R * 0.7, sy + R * 0.7], outline=(80, 6, 10, 255), width=5)
    for s in (1, -1):   # curved steel sabres with grip and guard
        pts = [(sx - R * 0.48 * s + (R * 0.86 * s) * t, sy + R * 0.46 - R * 0.9 * t - math.sin(t * math.pi) * R * 0.12) for t in np.linspace(0, 1, 18)]
        d.line(pts, fill=(40, 40, 46, 255), width=11); d.line(pts, fill=(217, 221, 226, 255), width=7); d.line(pts[3:], fill=(255, 255, 255, 255), width=2)
        gx, gy = pts[3]; d.line([gx - 9 * s, gy - 9, gx + 9 * s, gy + 9], fill=(212, 170, 80, 255), width=6); d.line([pts[0], pts[3]], fill=(70, 40, 20, 255), width=8)
    hl = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(hl).ellipse([sx - R * 0.75, sy - R * 0.85, sx - R * 0.05, sy - R * 0.35], fill=(255, 210, 210, 110))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([sx - R + 6, sy - R + 11, sx + R + 6, sy + R + 11], fill=(0, 0, 0, 180))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(9))); im = Image.alpha_composite(im, lay); return Image.alpha_composite(im, hl.filter(ImageFilter.GaussianBlur(10)))
def text_shadow(im, xy, txt, font, fill, anchor, off=(6, 8), blur=10, op=170, **kw):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((xy[0] + off[0], xy[1] + off[1]), txt, font=font, fill=(0, 0, 0, op), anchor=anchor, **kw)
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(blur))); ImageDraw.Draw(im).text(xy, txt, font=font, fill=fill, anchor=anchor, **kw); return im
def taper_arrow(im, pts, w0, w1, col, glow=None):
    """quadratic bezier through 3 points, tapered body + head; optional outer glow"""
    (x0, y0), (cx, cy), (x1, y1) = pts; P = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.86, 80)]
    L, R = [], []
    for i in range(len(P)):
        a, b = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]; ang = math.atan2(b[1] - a[1], b[0] - a[0]); w = (w0 + (w1 - w0) * i / len(P)) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    a = math.atan2(P[-1][1] - P[-3][1], P[-1][0] - P[-3][0]); hw, hl = w1 * 1.9, w1 * 2.6; ex, ey = P[-1]
    head = [(ex + math.cos(a + math.pi / 2) * hw, ey + math.sin(a + math.pi / 2) * hw), (ex + math.cos(a) * hl, ey + math.sin(a) * hl), (ex - math.cos(a + math.pi / 2) * hw, ey - math.sin(a + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(lay).polygon(poly, fill=col)
    if glow:
        g = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).polygon(poly, fill=glow); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(10)))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + 4, y + 6) for x, y in poly], fill=(0, 0, 0, 130))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6))); return Image.alpha_composite(im, lay)
def branch_rivers(seed=4):
    rng = np.random.default_rng(seed); S = 2; lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); gl = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d, g = ImageDraw.Draw(lay), ImageDraw.Draw(gl)
    def walk(x, y, ang, n, wdt, depth):
        pts = [(x, y)]
        for _ in range(n):
            ang += rng.normal(0, 0.28); step = rng.uniform(14, 26) * S; x += math.cos(ang) * step; y += math.sin(ang) * step; pts.append((x, y))
            if depth < 2 and rng.random() < 0.05: walk(x, y, ang + rng.choice([-1, 1]) * rng.uniform(0.6, 1.1), int(n * 0.5), wdt * 0.7, depth + 1)
        g.line(pts, fill=(80, 150, 235, 90), width=int(9 * wdt)); d.line(pts, fill=(207, 228, 255, 210), width=max(2, int(3 * wdt)))
    for (x, y, a) in [(-40, 300, 0.05), (640, 760, -1.45), (1320, 400, 3.1), (300, -40, 1.35), (-40, 80, 0.3)]: walk(x * S, y * S, a, 80, 1.0, 0)
    return Image.alpha_composite(gl.filter(ImageFilter.GaussianBlur(8)), lay).resize((W, H), Image.LANCZOS)
