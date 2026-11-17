"""Marion thumbnails v8 (owner 2026-11-17; harsh critics round 5). Grant style: vidIQ high-oblique story background (Georgian brick house
burning, dusty road, fog in the swamp), FEW small solid grounded unit blocks (our style, no white sticker border), one cream escape arrow
into the fog, hand-torn banner with grain, oil portrait on a dark radial panel. GM style: wide GONE. headline, branching hairline rivers,
embossed seal, level arrow, flat lantern-island payoff, portrait facing right (no unit blocks).  usage (from marion/): python3 tools/make_thumb_v8.py"""
import math, numpy as np, runpy, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
v5 = runpy.run_path("tools/make_thumb_v5.py", run_name="lib")
OILF = Image.open("youtube/thumb/marion_oil_cut.png").convert("RGBA")          # face centre (560, 890), face ~260 px
def oil(face_h, crop_top, grade):
    b = OILF.crop((0, crop_top, 1152, 2048)); a = np.array(b.split()[3]); a = cv2.erode(a, np.ones((5, 5), np.uint8), 1); a = cv2.GaussianBlur(a, (3, 3), 0)
    rgb = b.convert("RGB")
    rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(0.7)).enhance(1.25) if grade == "cool" else ImageEnhance.Contrast(rgb).enhance(1.12)
    b = rgb.convert("RGBA"); b.putalpha(Image.fromarray(a)); s = face_h / 260.0
    return b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS), (560 * s, (890 - crop_top) * s)
def solid_block(im, c, col, w=30, h=20):
    x, y = c; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x - w / 2 + 2, y - h / 2 + 3, x + w / 2 + 2, y + h / 2 + 3], fill=(0, 0, 0, 160))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(2))); d = ImageDraw.Draw(im)
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], fill=col + (255,), outline=(20, 10, 8, 200), width=1)
    d.line([x - w / 2 + 1, y - h / 2 + 1, x + w / 2 - 1, y - h / 2 + 1], fill=tuple(min(255, v + 70) for v in col) + (255,), width=2)
    return im
def cream_arrow(im, pts, w0, w1):
    """cream -> transparent gradient body with soft shadow"""
    (x0, y0), (cx, cy), (x1, y1) = pts; N = 90
    P = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.86, N)]
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); d, ds = ImageDraw.Draw(lay), ImageDraw.Draw(sh)
    for i in range(N - 1):
        t = i / N; w = w0 + (w1 - w0) * t; a = int(90 + 165 * t)
        d.line([P[i], P[i + 1]], fill=(243, 230, 196, a), width=int(w)); ds.line([(P[i][0] + 4, P[i][1] + 6), (P[i + 1][0] + 4, P[i + 1][1] + 6)], fill=(0, 0, 0, int(a * 0.5)), width=int(w))
    ang = math.atan2(P[-1][1] - P[-4][1], P[-1][0] - P[-4][0]); ex, ey = P[-1]; hw, hl = w1 * 1.7, w1 * 2.4
    head = [(ex + math.cos(ang + math.pi / 2) * hw, ey + math.sin(ang + math.pi / 2) * hw), (ex + math.cos(ang) * hl, ey + math.sin(ang) * hl), (ex - math.cos(ang + math.pi / 2) * hw, ey - math.sin(ang + math.pi / 2) * hw)]
    d.polygon(head, fill=(250, 240, 214, 255)); ds.polygon([(x + 4, y + 6) for x, y in head], fill=(0, 0, 0, 130))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6))); return Image.alpha_composite(im, lay)
def label(im, xy, t, fill, size=26):
    d = ImageDraw.Draw(im); fo = ImageFont.truetype(OS, size); w = d.textlength(t, font=fo); x, y = xy
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x + 3, y + 5, x + w + 25, y + size + 17], fill=(0, 0, 0, 150)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
    d = ImageDraw.Draw(im); d.rectangle([x, y, x + w + 22, y + size + 12], fill=fill); d.text((x + 11, y + 4), t, font=fo, fill=(247, 243, 234)); return im
def torn_grain(im, x, y, w, h, seed=11, col=(192, 22, 30)):
    rng = np.random.default_rng(seed)
    top = [(x + i, y + int(rng.integers(-14, 15) * rng.uniform(0.3, 1))) for i in range(0, w + 1, 9)]
    bot = [(x + i, y + h + int(rng.integers(-14, 15) * rng.uniform(0.3, 1))) for i in range(w, -1, -9)]
    poly = top + [(x + w + int(rng.integers(10, 26)), y + h // 2)] + bot + [(x - int(rng.integers(8, 20)), y + h // 2)]
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    fill = Image.new("RGBA", im.size, col + (255,)); gr = Image.effect_noise(im.size, 34).convert("L")
    fill = Image.composite(Image.new("RGBA", im.size, tuple(int(v * 0.78) for v in col) + (255,)), fill, gr.point(lambda v: 90 if v > 150 else 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.paste(Image.new("RGBA", im.size, (0, 0, 0, 150)), (6, 8), m); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(8)))
    out = im.copy(); out.paste(fill, (0, 0), m); return out
outs = []
# ================= (1) GRANT STYLE =================
def grant(bgfile, word, key, house, road, swamp_end):
    rng = np.random.default_rng(5)
    im = Image.open(bgfile).convert("RGB").crop((0, 100, 1500, 944)).resize((W, H), Image.LANCZOS); im = ImageEnhance.Contrast(im).enhance(1.05).convert("RGBA")
    # fog thickened where Marion vanishes
    fog = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fog)
    for k in range(5): r = 110 + k * 30; fd.ellipse([swamp_end[0] - r * 1.5, swamp_end[1] - r * 0.6, swamp_end[0] + r * 1.5, swamp_end[1] + r * 0.6], fill=(238, 234, 222, 26))
    im = Image.alpha_composite(im, fog.filter(ImageFilter.GaussianBlur(40)))
    # our troops: 7 small solid red blocks on the road (irregular), 4 blue at the swamp edge
    for i, t in enumerate([0.0, 0.13, 0.27, 0.42, 0.55, 0.7, 0.84]):
        x = road[0][0] + (road[1][0] - road[0][0]) * t + rng.normal(0, 5); y = road[0][1] + (road[1][1] - road[0][1]) * t + rng.normal(0, 4)
        im = solid_block(im, (x, y), (179, 32, 42))
    bl = [(swamp_end[0] + 210, swamp_end[1] - 44), (swamp_end[0] + 250, swamp_end[1] - 22), (swamp_end[0] + 190, swamp_end[1] - 8), (swamp_end[0] + 232, swamp_end[1] + 12)]
    for c in bl: im = solid_block(im, c, (31, 79, 168))
    im = cream_arrow(im, [(bl[0][0] - 20, bl[0][1] - 10), (swamp_end[0] + 40, swamp_end[1] - 120), (swamp_end[0] - 110, swamp_end[1] - 40)], 34, 12)
    im = label(im, (bl[0][0] - 60, bl[0][1] - 80), "MARION", (34, 78, 190)); im = label(im, (road[0][0] - 10, road[0][1] - 54), "TARLETON", (178, 24, 30))
    # portrait on a dark radial panel
    pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(pan).ellipse([860, -260, 1700, 980], fill=(11, 11, 11, 245)); im = Image.alpha_composite(im, pan.filter(ImageFilter.GaussianBlur(70)))
    b, (fx, fy) = oil(185, 640, "cool"); x0, y0 = int(1075 - fx), int(300 - fy)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(b.split()[3].point(lambda v: int(v * 0.7))); sh.alpha_composite(sb, (x0 - 14, y0 + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(18))); im.alpha_composite(b, (x0, y0))
    d = ImageDraw.Draw(im); d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 150); trk = 6; tw = sum(ImageDraw.Draw(im).textlength(ch, font=f) + trk for ch in word) - trk
    bx, by, bh = 34, 528, 160; bw = int(tw + 80)
    im = torn_grain(im, bx, by, bw, bh)
    x = bx + 40
    for ch in word:
        im = v5["text_shadow"](im, (x, by + bh / 2 + 6), ch, f, (255, 255, 255), "lm", off=(0, 6), blur=8, op=170, stroke_width=3, stroke_fill=(42, 0, 0)); x += ImageDraw.Draw(im).textlength(ch, font=f) + trk
    out = f"youtube/thumb/marion-V8-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
# ================= (2) GRAND MANEUVER STYLE =================
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
def emboss_seal(im, c, R):
    sx, sy = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(20):
        a = i / 20 * 2 * math.pi; rr = R * 0.29; d.ellipse([sx + math.cos(a) * R * 0.9 - rr, sy + math.sin(a) * R * 0.9 - rr, sx + math.cos(a) * R * 0.9 + rr, sy + math.sin(a) * R * 0.9 + rr], fill=(118, 10, 14, 255))
    for r in range(int(R), 0, -1):
        t = r / R; d.ellipse([sx - r - (1 - t) * R * 0.22, sy - r - (1 - t) * R * 0.22, sx + r - (1 - t) * R * 0.22, sy + r - (1 - t) * R * 0.22], fill=(int(90 + 136 * (1 - t) ** 1.3), int(10 + 75 * (1 - t) ** 2), int(14 + 70 * (1 - t) ** 2), 255))
    d.ellipse([sx - R * 0.68, sy - R * 0.68, sx + R * 0.68, sy + R * 0.68], outline=(84, 6, 10, 255), width=5)
    d.arc([sx - R * 0.68, sy - R * 0.68, sx + R * 0.68, sy + R * 0.68], 200, 300, fill=(226, 85, 79, 255), width=3)
    for s in (1, -1):
        d.line([sx - R * 0.42 * s, sy + R * 0.42, sx + R * 0.38 * s, sy - R * 0.38], fill=(70, 4, 8, 255), width=9)
        d.line([sx - R * 0.42 * s, sy + R * 0.40, sx + R * 0.38 * s, sy - R * 0.40], fill=(233, 217, 176, 255), width=6)
        d.line([sx - R * 0.52 * s, sy + R * 0.24, sx - R * 0.26 * s, sy + R * 0.5], fill=(233, 217, 176, 255), width=6)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([sx - R + 6, sy - R + 10, sx + R + 6, sy + R + 10], fill=(0, 0, 0, 170))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(8))); return Image.alpha_composite(im, lay)
def gm(word, sub, key, icon):
    base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H)); base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
    n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
    f0 = ImageFont.truetype(AN, 236); tmp = Image.new("L", (1400, 320), 0); ImageDraw.Draw(tmp).text((0, 0), word, font=f0, fill=255); bb = tmp.getbbox()
    glyph = tmp.crop(bb); glyph = glyph.resize((int(glyph.width * 1.28), glyph.height), Image.LANCZOS)
    gx, gy = int(810 - glyph.width / 2), 34
    fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 26
    tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((810, sy_), s, font=fs, fill=255, anchor="ma")
    rv = branch_rivers(); rv.putalpha(ImageChops.subtract(rv.split()[3], tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, rv)
    sx, sy = 470, 575
    im = emboss_seal(im, (sx, sy), 56)
    im = v5["taper_arrow"](im, [(sx + 64, sy), (760, sy - 22), (960, sy)], 30, 14, (126, 195, 255, 255), glow=(70, 140, 230, 140))
    ic = Image.open(icon).convert("RGBA"); ic = ic.crop(ic.getbbox()); ic.thumbnail((310, 310), Image.LANCZOS)
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([1040, 470, 1220, 650], fill=(255, 176, 64, 90)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(40)))
    im.alpha_composite(ic, (int(1110 - ic.width / 2), int(575 - ic.height * 0.62)))
    fl = ImageFont.truetype(SER, 34)
    im = v5["text_shadow"](im, (sx - 90, sy + 70), "OX SWAMP", fl, (244, 234, 210), "la", off=(2, 3), blur=3, op=200)
    im = v5["text_shadow"](im, (1110, 660), "BENBOW'S FERRY", fl, (244, 234, 210), "ma", off=(2, 3), blur=3, op=200)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
    im = v5["text_shadow"](im, (810, sy_), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = oil(132, 640, "warm"); x0, y0 = int(165 - fx), int(520 - fy)
    vg = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(vg).ellipse([-300, 220, 460, 1000], fill=(6, 12, 22, 200)); im = Image.alpha_composite(im, vg.filter(ImageFilter.GaussianBlur(50)))
    a = b.split()[3].filter(ImageFilter.GaussianBlur(1)); b.putalpha(a); im.alpha_composite(b, (x0, y0))
    out = f"youtube/thumb/marion-V8-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
if __name__ == "__main__":
    import sys; cfg = __import__("json").loads(sys.argv[1])
    grant(cfg["bg"], "OUTFOXED", "OUTFOXED", None, cfg["road"], cfg["swamp"])
    gm("GONE.", "THEN TARLETON TURNED BACK", "GONE", cfg["icon"])
    s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
    for i, o in enumerate(outs):
        im = Image.open(o); x = 20 + i * 660
        s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V8-")[1][:-4], font=F2, fill=(230, 220, 200))
        s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
    s.save("youtube/thumb/sheet_v8.jpg", quality=92); print(outs)
