"""Marion thumbnails v9 (owner 2026-11-17; harsh critics round 6): the portrait is now a TRUE cut-out (oil repaint of the lithograph,
helmet in frame, top feathered, shoulders bleeding off the bottom, facing the action, warm rim light + drop shadow, overlapping the scene).
Grant style: 14 red + 6 blue small grounded blocks (perspective shrink), thick solid cream escape arrow with dark outline.
GM style: wide GONE., one glowing main river + few hairlines, glossy seal with steel sabres, bold ivory labels, big lit island payoff.
usage (from marion/): python3 tools/make_thumb_v10.py"""
import math, numpy as np, runpy, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
v5 = runpy.run_path("tools/make_thumb_v5.py", run_name="lib")
v8 = runpy.run_path("tools/make_thumb_v8.py", run_name="lib")
SRC = Image.open("youtube/thumb/marion_oil_cut_clean.png").convert("RGBA")   # 1152x2048; face centre (560, 890), brow..chin ~260
def cutout(face_h, flip, grade, crop_top=0, feather=0):
    b = SRC.crop((0, crop_top, 1152, 2048)); a = np.array(b.split()[3]).astype(np.float32)
    a = cv2.erode(a, np.ones((7, 7), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)   # hard 2 px matte
    if feather: a[:feather] *= np.linspace(0, 1, feather)[:, None]
    rgb = b.convert("RGB")
    if grade == "cool":
        rgb = ImageEnhance.Color(rgb).enhance(0.62); rgb = ImageEnhance.Contrast(rgb).enhance(1.25)
        rgb = Image.blend(rgb, ImageChops.multiply(rgb, Image.new("RGB", rgb.size, (215, 225, 240))), 0.5)
        rgb = rgb.point(lambda v: min(255, int(v * 1.06)))
    else: rgb = ImageEnhance.Contrast(rgb).enhance(1.1)
    b = rgb.convert("RGBA"); b.putalpha(Image.fromarray(a.astype(np.uint8))); fx = 560
    if flip: b = b.transpose(Image.FLIP_LEFT_RIGHT); fx = 1152 - 560
    s = face_h / 260.0; return b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS), (fx * s, (890 - crop_top) * s)
def place(im, b, x0, y0, rim_col, rim_side):
    a = b.split()[3]
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(a.point(lambda v: int(v * 0.75)))
    sh.alpha_composite(sb, (x0 + (-10 if rim_side == "left" else 10), y0 + 8)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(10)))
    rim = Image.new("RGBA", b.size, rim_col + (0,)); edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
    side = np.linspace(1, 0, b.width) if rim_side == "left" else np.linspace(0, 1, b.width)
    rim.putalpha(Image.fromarray((np.array(edge).astype(float) * side[None, :] * 0.8).astype(np.uint8)))
    im.alpha_composite(b, (x0, y0)); return im
def solid_arrow(im, pts, w0, w1, fill=(243, 230, 200), outline=(40, 26, 16)):
    (x0, y0), (cx, cy), (x1, y1) = pts; N = 120
    P = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.85, N)]
    L, R = [], []
    for i in range(N):
        a_, b_ = P[max(i - 1, 0)], P[min(i + 1, N - 1)]; ang = math.atan2(b_[1] - a_[1], b_[0] - a_[0]); w = (w0 + (w1 - w0) * i / N) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    ang = math.atan2(P[-1][1] - P[-4][1], P[-1][0] - P[-4][0]); ex, ey = P[-1]; hw, hl = w1 * 1.25, w1 * 1.7
    head = [(ex + math.cos(ang + math.pi / 2) * hw, ey + math.sin(ang + math.pi / 2) * hw), (ex + math.cos(ang) * hl, ey + math.sin(ang) * hl), (ex - math.cos(ang + math.pi / 2) * hw, ey - math.sin(ang + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + 5, y + 8) for x, y in poly], fill=(0, 0, 0, 150)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(7)))
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay); d.polygon(poly, fill=fill + (255,)); d.line(poly + [poly[0]], fill=outline + (255,), width=3)
    return Image.alpha_composite(im, lay)
def block(im, c, col, w, h):
    x, y = c; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([x - w * 0.6, y + h * 0.2, x + w * 0.7, y + h * 0.9], fill=(0, 0, 0, 150))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3))); d = ImageDraw.Draw(im)
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2 + 2], fill=tuple(int(v * 0.55) for v in col) + (255,))
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2 - 1], fill=col + (255,), outline=(22, 12, 8, 220), width=1)
    d.line([x - w / 2 + 1, y - h / 2 + 1, x + w / 2 - 1, y - h / 2 + 1], fill=tuple(min(255, v + 80) for v in col) + (255,), width=1)
    return im
outs = []
def grant(word, key):
    rng = np.random.default_rng(5)
    im = Image.open("youtube/thumb/bg_vidiq_brick.jpg").convert("RGB").crop((0, 100, 1500, 944)).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.05).convert("RGBA")
    fog = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fog)
    for k in range(5): r = 100 + k * 30; fd.ellipse([150 - r * 1.5, 470 - r * 0.6, 150 + r * 1.5, 470 + r * 0.6], fill=(238, 234, 222, 26))
    im = Image.alpha_composite(im, fog.filter(ImageFilter.GaussianBlur(40)))
    # red Legion column packed on the dusty road (2 files, shrinking toward the house)
    a0, a1 = (612, 284), (872, 432)
    for i in range(9):
        t = i / 8; x = a0[0] + (a1[0] - a0[0]) * t; y = a0[1] + (a1[1] - a0[1]) * t; sc = 0.7 + 0.45 * t
        for off in (-1, 1): im = block(im, (x + off * 7 * sc, y - off * 10 * sc), (184, 30, 40), 20 * sc, 13 * sc)
    blue = [(330, 440), (356, 452), (306, 458), (332, 470), (380, 436), (356, 426)]
    for c in blue: im = block(im, c, (30, 76, 172), 22, 14)
    im = v5["taper_arrow"](im, [(300, 432), (210, 352), (80, 410)], 34, 16, (246, 236, 210, 225), glow=(255, 214, 150, 170))
    im = v8["label"](im, (280, 368), "MARION", (34, 78, 190)); im = v8["label"](im, (600, 216), "TARLETON", (178, 24, 30))
    pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
    for x in range(840, W): pd.line([(x, 0), (x, H)], fill=(11, 11, 11, int(255 * min(1, (x - 840) / 120))))
    im = Image.alpha_composite(im, pan)
    b, (fx, fy) = cutout(190, flip=True, grade="cool"); x0, y0 = int(1060 - fx), int(355 - fy)
    im = place(im, b, x0, y0, (255, 214, 150), "left")
    d = ImageDraw.Draw(im); d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 150); trk = 6; tw = sum(ImageDraw.Draw(im).textlength(ch, font=f) + trk for ch in word) - trk
    bx, by, bh = 34, 528, 160; im = v8["torn_grain"](im, bx, by, int(tw + 80), bh)
    x = bx + 40
    for ch in word: im = v5["text_shadow"](im, (x, by + bh / 2 + 6), ch, f, (255, 255, 255), "lm", off=(0, 6), blur=8, op=170, stroke_width=3, stroke_fill=(42, 0, 0)); x += ImageDraw.Draw(im).textlength(ch, font=f) + trk
    out = f"youtube/thumb/marion-V10-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
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
def gm(word, sub, key):
    base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H)); base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
    n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
    f0 = ImageFont.truetype(AN, 250); tmp = Image.new("L", (1600, 330), 0); ImageDraw.Draw(tmp).text((0, 0), word, font=f0, fill=255); glyph = tmp.crop(tmp.getbbox())
    glyph = glyph.resize((min(1000, int(glyph.width * 1.35)), glyph.height), Image.LANCZOS); gx, gy = int(790 - glyph.width / 2), 30
    fs = ImageFont.truetype(SER, 36); s = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 24
    tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((790, sy_), s, font=fs, fill=255, anchor="ma")
    rv = v8["branch_rivers"](seed=9); rv.putalpha(ImageChops.subtract(rv.split()[3].point(lambda v: int(v * 0.32)), tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, rv)
    sx, sy = 560, 585; ix, iy = 1090, 560
    ic = Image.open("youtube/thumb/icon_vidiq_lantern.png").convert("RGBA"); ic = ic.crop(ic.getbbox())
    ia = np.array(ic.split()[3]).astype(float); h0 = int(ic.height * 0.66); ia[h0:] *= np.linspace(1, 0, ic.height - h0)[:, None] ** 2.2; ic.putalpha(Image.fromarray(ia.astype(np.uint8)))   # no white cloud plate
    ic.thumbnail((380, 380), Image.LANCZOS); px, py = int(ix - ic.width / 2), int(iy - ic.height * 0.62)
    lx, ly = px + ic.width * 0.565, py + ic.height * 0.47                  # lantern position in the icon
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([lx - 150, ly - 150, lx + 150, ly + 150], fill=(255, 138, 42, 150)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(60)))
    im.alpha_composite(ic, (px, py))
    hot = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(hot).ellipse([lx - 90, ly - 90, lx + 90, ly + 90], fill=(255, 160, 60, 120)); im = Image.alpha_composite(im, hot.filter(ImageFilter.GaussianBlur(30)))
    im = glossy_seal(im, (sx, sy), 66)
    im = v5["taper_arrow"](im, [(sx + 72, sy - 4), (760, sy - 46), (ix - 150, sy - 8)], 36, 16, (126, 195, 255, 255), glow=(70, 150, 240, 170))
    fl = ImageFont.truetype(SER, 40)
    for t, (x, y), anc in [("OX SWAMP", (sx, sy + 82), "ma"), ("BENBOW'S FERRY", (ix, 668), "ma")]:
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text((x, y), t, font=fl, fill=(255, 210, 140, 160), anchor=anc); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(6)))
        im = v5["text_shadow"](im, (x, y), t, fl, (246, 232, 196), anc, off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
    im = v5["text_shadow"](im, (790, sy_), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = cutout(140, flip=False, grade="warm"); x0, y0 = int(240 - fx), int(560 - fy)
    im = place(im, b, x0, y0, (156, 196, 255), "right")
    out = f"youtube/thumb/marion-V10-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
grant("OUTFOXED", "OUTFOXED"); gm("GONE", "THEN TARLETON TURNED BACK", "GONE")
s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V10-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
s.save("youtube/thumb/sheet_v10.jpg", quality=92); print(outs)
