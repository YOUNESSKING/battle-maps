"""George Washington thumbnails, word HE SNUCK OUT. (PACKAGING_GUIDE 0c). Run from washington/: python3 tools/make_thumbs_washington.py
A = Back Door recipe (painted aerial Delaware at McConkey's Ferry, our unit blocks, one grungy arrow, parchment tags, sepia portrait, red brush band)
B = Grand Maneuver recipe (navy map, colour portrait left, cream Anton word + Cinzel line, seal -> glowing arrow -> Nassau Hall).
AI images (vidIQ/gpt-image): the river backdrop and the Nassau Hall painting only (no people). Portrait = Peale 1776 (Brooklyn Museum), rembg isnet cut + hand-drawn body matte."""
import sys, os, numpy as np, cv2, math
sys.path.insert(0, "tools")
from _jh import *
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
AN = "tools/Anton-Regular.ttf"; SER = "tools/cinzel-600.ttf"; OS = "tools/oswald-latin-700-normal.ttf"
WORD = "HE SNUCK OUT."; TWIST = "THEN HE STRUCK BEHIND THEM"; T = "youtube/thumb/"
RAW = Image.open(T + "washington_cut_raw.png").convert("RGBA")   # rembg isnet cut of the Peale 1776 portrait upscaled to 1920x2236
ORIG = Image.open("assets/portraits/washington_peale_1776_brooklyn_museum.jpg").convert("RGB").resize(RAW.size, Image.LANCZOS)   # rembg zeroes RGB outside its matte, so colour comes from the original
FACE = (940, 490); FH = 400.0                                    # face centre, hair-top to chin
BODY = [(280, 1190), (300, 1140), (380, 960), (580, 790), (810, 700), (1120, 690), (1320, 750), (1400, 1040), (1410, 1280), (1380, 1400), (440, 1400)]
CROP = (150, 200, 1600, 1400)

def cutout(face_h, grade):
    a = np.array(RAW.split()[3]); m = Image.new("L", RAW.size, 0); ImageDraw.Draw(m).polygon(BODY, fill=255)   # dark left sleeve is lost by rembg: add a body matte
    a = np.maximum(a, np.array(m)); a[1400:] = 0
    b = ORIG.crop(CROP).convert("RGBA"); a = a[CROP[1]:CROP[3], CROP[0]:CROP[2]].astype(np.float32)
    a = cv2.GaussianBlur(a, (9, 9), 0); a = cv2.erode(a, np.ones((5, 5), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)
    rgb = b.convert("RGB")
    if grade == "sepia":
        g = ImageOps.autocontrast(ImageEnhance.Contrast(ImageOps.grayscale(rgb)).enhance(1.45), cutoff=1).point(lambda v: int(255 * (v / 255.0) ** 0.8))
        rgb = ImageOps.colorize(g, black=(22, 15, 10), mid=(150, 114, 80), white=(250, 236, 210))
    else:
        rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(1.0)).enhance(1.15); rgb = ImageEnhance.Brightness(rgb).enhance(1.1).point(lambda v: int(255 * (v / 255.0) ** 0.75))
    bb = rgb.convert("RGBA"); bb.putalpha(Image.fromarray(a.astype(np.uint8)))
    s = face_h / FH; bb = bb.resize((int(bb.width * s), int(bb.height * s)), Image.LANCZOS)
    return bb, ((FACE[0] - CROP[0]) * s, (FACE[1] - CROP[1]) * s)

def place(im, b, x0, y0, rim_col, rim_side, shadow=0.75, rim=0.3):
    a = b.split()[3]; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(a.point(lambda v: int(v * shadow)))
    sh.alpha_composite(sb, (x0 + (-10 if rim_side == "left" else 10), y0 + 8)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12)))
    r = Image.new("RGBA", b.size, rim_col + (0,)); edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
    side = np.linspace(1, 0, b.width) if rim_side == "left" else np.linspace(0, 1, b.width)
    r.putalpha(Image.fromarray((np.array(edge).astype(float) * side[None, :] * rim).astype(np.uint8)))
    im.alpha_composite(b, (x0, y0)); im.alpha_composite(r, (x0, y0)); return im

# ====================================== A: BACK DOOR ======================================
def boat(im, c, ang, L=70):
    x, y = c; ca, sa = math.cos(ang), math.sin(ang); lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay); sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    pts = [(-L / 2, 0), (-L / 3, 8), (L / 3, 8), (L / 2, 0), (L / 3, -8), (-L / 3, -8)]; P = [(x + a * ca - b * sa, y + a * sa + b * ca) for a, b in pts]
    ds.polygon([(p[0] + 4, p[1] + 6) for p in P], fill=(0, 0, 0, 170)); d.polygon(P, fill=(40, 28, 20, 255), outline=(120, 96, 70, 255))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3))); return Image.alpha_composite(im, lay)

def variant_a():
    # background MIRRORED so the crossing reads west (PA, left) -> east (NJ, right); Trenton lies downstream (far, right bank)
    im = ImageOps.mirror(Image.open(T + "bg_vidiq_delaware.jpg").convert("RGB")).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(1.0)).enhance(1.2); im = ImageEnhance.Brightness(im).enhance(0.9).convert("RGBA")
    RED, BLUE = (200, 30, 36), (40, 92, 205)
    for (x, y, c, r, a_) in [(800, 226, 4, 2, 0.18), (880, 238, 4, 2, 0.18), (950, 256, 3, 2, 0.3)]:   # Hessians at Trenton, NJ bank ridge
        im = formation(im, (x, y), RED, c, r, cw=18, ch=11, gap=3, ang=a_)
    for (x, y, c, r, a_) in [(70, 330, 6, 2, 0.5), (130, 392, 6, 2, 0.5), (170, 436, 5, 2, 0.5)]:      # Washington at McConkey's Ferry, PA bank slope
        im = formation(im, (x, y), BLUE, c, r, cw=23, ch=14, gap=3, ang=a_)
    im = grunge_arrow(im, [(310, 470), (640, 580), (520, 290), (772, 246)], 84, 58, shadow=(235, 7, 10, 5))
    im = parchment(im, (28, 205), ["MCCONKEY'S", "FERRY"], 44); im = parchment(im, (560, 120), ["TRENTON"], 46)
    pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
    for x in range(700, W): pd.line([(x, 0), (x, H)], fill=(16, 12, 9, int(215 * min(1, ((x - 700) / 420) ** 1.2))))
    im = Image.alpha_composite(im, pan)
    b, (fx, fy) = cutout(240, "sepia"); im = place(im, b, int(1115 - fx), int(250 - fy), (255, 200, 140), "left", shadow=0.85)
    f = ImageFont.truetype(AN, 138); tw = ImageDraw.Draw(im).textlength(WORD, font=f)
    bx0, by0, bx1, by1 = -10, 540, int(40 + tw + 50), 714; r = np.random.default_rng(8)
    m = Image.new("L", (W, H), 0); top = [(x, by0 + int(r.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(r.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
    right = [(bx1 + int(r.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
    ImageDraw.Draw(m).polygon(top + right + bot, fill=255)
    band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
    band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
    im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
    tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 630), WORD, font=f, fill=255, anchor="lm")
    tm = ImageChops.multiply(tm, Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
    im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
    out = "youtube/thumb_A_MAIN_HE_SNUCK_OUT.jpg"; im.convert("RGB").save(out, quality=94); return out

# ====================================== B: GRAND MANEUVER ======================================
def variant_b():
    base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H)); base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
    n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
    f0 = ImageFont.truetype(AN, 215); tmp = Image.new("L", (2000, 330), 0); ImageDraw.Draw(tmp).text((0, 0), WORD, font=f0, fill=255); glyph = tmp.crop(tmp.getbbox())
    glyph = glyph.resize((min(640, int(glyph.width * 1.3)), glyph.height), Image.LANCZOS); gx, gy = int(925 - glyph.width / 2), 28
    sub = TWIST; fs = ImageFont.truetype(SER, 42); s = " ".join(" ".join(w) if False else w for w in sub.split()); s = " ".join(sub.split()); sy_ = gy + glyph.height + 22
    tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((905, sy_), s, font=fs, fill=255, anchor="ma")
    # faint hairline rivers: Delaware (down the right-centre), Assunpink (short branch), roads to Princeton (dashed hairlines)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    def chaikin(p, n=4):
        for _ in range(n): p = [p[0]] + [q for a, b in zip(p, p[1:]) for q in ((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))] + [p[-1]]
        return p
    delaware = chaikin([(520, -20), (545, 150), (640, 300), (610, 430), (690, 540), (790, 620), (880, 740)])
    d.line(delaware, fill=(207, 228, 255, 215), width=4, joint="curve"); d.line(chaikin([(705, 548), (790, 520), (880, 500), (960, 505)]), fill=(207, 228, 255, 200), width=3)  # Assunpink
    for _ in range(0): pass
    g = lay.filter(ImageFilter.GaussianBlur(5)); lay = Image.alpha_composite(g, lay)
    rd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rdd = ImageDraw.Draw(rd)
    pts = chaikin([(740, 600), (850, 560), (960, 545), (1040, 520), (1130, 470)], 3)
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]; L = math.hypot(x1 - x0, y1 - y0)
        for k in range(int(L // 14)): rdd.line([(x0 + (x1 - x0) * k * 14 / L, y0 + (y1 - y0) * k * 14 / L), (x0 + (x1 - x0) * (k * 14 + 7) / L, y0 + (y1 - y0) * (k * 14 + 7) / L)], fill=(190, 205, 225, 90), width=2)
    lay = Image.alpha_composite(lay, rd)
    lay.putalpha(ImageChops.subtract(lay.split()[3], tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, lay)
    sx, sy = 690, 575
    # payoff = painted Nassau Hall (vidIQ), crop of the building, soft vignette + thin gold frame
    fr = Image.open(T + "icon_vidiq_nassau.jpg").convert("RGB").crop((170, 150, 1830, 1000)); fw, fh = 500, 270; fr = fr.resize((fw, fh), Image.LANCZOS)
    fr = ImageEnhance.Contrast(ImageEnhance.Color(fr).enhance(1.1)).enhance(1.05)
    msk = Image.new("L", (fw, fh), 0); ImageDraw.Draw(msk).ellipse([36, 22, fw - 37, fh - 23], fill=255); msk = msk.filter(ImageFilter.GaussianBlur(24))
    ix, iy = 1040, 420; px, py = int(ix - fw / 2), int(iy - fh / 2); fr = fr.convert("RGBA"); fr.putalpha(msk)
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([ix - 280, iy - 150, ix + 280, iy + 150], fill=(255, 170, 70, 80)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(45)))
    shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb_ = Image.new("RGBA", fr.size, (0, 0, 0, 255)); sb_.putalpha(msk.point(lambda v: int(v * 0.7))); shd.alpha_composite(sb_, (px + 6, py + 10)); im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(9)))
    im.alpha_composite(fr, (px, py))
    im = glossy_seal(im, (sx, sy), 76)
    # ONE glowing blue arrow: from Trenton round (behind the British) to Princeton
    im = taper_arrow(im, [(sx + 70, sy - 50), (sx + 100, sy - 170), (px + 70, py + fh - 90)], 44, 24, (126, 195, 255, 255), glow=(70, 150, 240, 190))
    fl = ImageFont.truetype(SER, 44)
    for t, (x, y) in [("TRENTON", (sx + 5, sy + 84)), ("PRINCETON", (ix, py + fh + 12))]:
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text((x, y), t, font=fl, fill=(255, 210, 140, 160), anchor="ma"); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(6)))
        im = text_shadow(im, (x, y), t, fl, (246, 232, 196), "ma", off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
    im = text_shadow(im, (905, sy_), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = cutout(285, "warm"); x0, y0 = int(235 - fx), int(262 - fy)
    im = place(im, b, x0, y0, (255, 200, 140), "right", shadow=0.85)
    out = "youtube/thumb_B_HE_SNUCK_OUT.jpg"; im.convert("RGB").save(out, quality=94); return out

def sheet(outs):
    s = Image.new("RGB", (2 * 1280 + 60, 1500), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 26)
    for i, o in enumerate(outs):
        x = 20 + i * 1300; s.paste(Image.open(o), (x, 40)); d.text((x, 8), ["A MAIN (Back Door)", "B Test & Compare (Grand Maneuver)"][i], font=F2, fill=(230, 220, 200))
    y = 800; d.text((20, y - 34), "168x94 feed size: ours A, B | published Grant 'Back Door' | Marion A, B", font=F2, fill=(180, 170, 150))
    refs = [outs[0], outs[1], "../reference/thumbnails/ref-A-backdoor-PUBLISHED-grant.jpg", "../reference/thumbnails/example-A-backdoor-marion-HE_RAN.jpg", "../reference/thumbnails/example-B-grandmaneuver-marion-HE_RAN.jpg"]
    for i, o in enumerate(refs):
        im = Image.open(o).convert("RGB"); s.paste(im.resize((168, 94), Image.LANCZOS), (20 + i * 190, y)); s.paste(im.resize((336, 188), Image.LANCZOS), (20 + i * 350, y + 130))
    s.crop((0, 0, s.width, 1160)).save("youtube/thumbs_sheet.jpg", quality=92)
outs = [variant_a(), variant_b()]; sheet(outs); print(outs)
