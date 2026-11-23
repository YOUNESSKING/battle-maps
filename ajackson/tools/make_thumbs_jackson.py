"""Andrew Jackson thumbnails, word HE DUG. (PACKAGING_GUIDE 0c). Run from ajackson/: python3 tools/make_thumbs_jackson.py
A = Back Door recipe (painted aerial Chalmette plain, our unit blocks, one grungy arrow, parchment tags, sepia portrait, red brush band)
B = Grand Maneuver recipe (navy map, colour portrait left, cream Anton word + Cinzel line, seal -> glowing arrow -> mud rampart)."""
import sys, os, numpy as np, cv2, math
sys.path.insert(0, "tools")
import _jh as J
from _jh import *
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops, ImageOps
AN = "tools/Anton-Regular.ttf"; SER = "tools/cinzel-600.ttf"; OS = "tools/oswald-latin-700-normal.ttf"
WORD = "HE DUG."; T = "youtube/thumb/"
RAW = Image.open(T + "jackson_cut_raw.png").convert("RGBA")     # rembg isnet cut of the Jarvis c.1819 portrait (1280x1704); hair top 360, chin 700, face centre (700,580)
FACE = (700, 580); FH = 340.0; CROP = (330, 330, 1280, 1704)

def cutout(face_h, grade):
    b = RAW.crop(CROP); a = np.array(b.split()[3]).astype(np.float32)
    a = cv2.erode(a, np.ones((7, 7), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)   # hard 2 px matte
    rgb = b.convert("RGB")
    if grade == "sepia":
        g = ImageOps.autocontrast(ImageEnhance.Contrast(ImageOps.grayscale(rgb)).enhance(1.45), cutoff=1).point(lambda v: int(255 * (v / 255.0) ** 0.8))
        rgb = ImageOps.colorize(g, black=(22, 15, 10), mid=(150, 114, 80), white=(250, 236, 210))
    else:
        rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(0.7)).enhance(1.12)
        rgb = Image.blend(rgb, ImageChops.multiply(rgb, Image.new("RGB", rgb.size, (255, 234, 208))), 0.5)   # natural warm skin, no green-grey cast
    b = rgb.convert("RGBA"); b.putalpha(Image.fromarray(a.astype(np.uint8)))
    s = face_h / FH; b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS)
    return b, ((FACE[0] - CROP[0]) * s, (FACE[1] - CROP[1]) * s)

def place(im, b, x0, y0, rim_col, rim_side, shadow=0.75):
    a = b.split()[3]; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(a.point(lambda v: int(v * shadow)))
    sh.alpha_composite(sb, (x0 + (-10 if rim_side == "left" else 10), y0 + 8)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12)))
    rim = Image.new("RGBA", b.size, rim_col + (0,)); edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
    side = np.linspace(1, 0, b.width) if rim_side == "left" else np.linspace(0, 1, b.width)
    rim.putalpha(Image.fromarray((np.array(edge).astype(float) * side[None, :] * 0.3).astype(np.uint8)))
    im.alpha_composite(b, (x0, y0)); im.alpha_composite(rim, (x0, y0)); return im

# ====================================== A: BACK DOOR ======================================
def variant_a():
    im = Image.open(T + "bg_vidiq_chalmette.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(0.8)).enhance(1.12).convert("RGBA")
    RED, BLUE = (176, 34, 40), (38, 78, 168)
    # THE DIG: thick earth rampart bar with shadow + canal strip in front of it (the painting's wall is a hairline at feed size)
    bar = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(bar); x0_, x1_ = 190, 1000
    sh_ = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh_).rectangle([x0_, 352, x1_, 392], fill=(0, 0, 0, 170)); im = Image.alpha_composite(im, sh_.filter(ImageFilter.GaussianBlur(5)))
    bd.rectangle([x0_, 372, x1_, 378], fill=(120, 150, 170, 255))                       # canal strip
    bd.polygon([(x0_ - 8, 366), (x0_ + 6, 342), (x1_ - 6, 342), (x1_ + 8, 366)], fill=(104, 70, 40, 255))   # rampart body
    bd.rectangle([x0_ - 8, 358, x1_ + 8, 368], fill=(78, 52, 30, 255)); bd.line([(x0_ + 6, 342), (x1_ - 6, 342)], fill=(168, 124, 78, 255), width=3)
    nz = np.array(Image.effect_noise((W, H), 40).convert("L")).astype(float) / 255; ba = np.array(bar).astype(float); ba[..., :3] *= (0.82 + 0.3 * nz)[..., None]; bar = Image.fromarray(np.clip(ba, 0, 255).astype(np.uint8))
    im = Image.alpha_composite(im, bar)
    for gx in (222, 355, 488, 621, 754):                                               # American line: 2 ranks, big blocks with shadows
        im = formation(im, (gx, 318), BLUE, 5, 2, cw=21, ch=11, gap=3, ang=0.0)
    for (x, y, n) in [(420, 505, 6), (540, 515, 6), (660, 505, 6), (780, 495, 5)]:     # British columns marching at the wall
        im = formation(im, (x, y), RED, n, 2, cw=17, ch=11, gap=3, ang=-1.57)
    # grungy sweep arrow = JACKSON's move: from New Orleans down to the line
    im = grunge_arrow(im, [(500, 150), (330, 170), (270, 240), (300, 312)], 46, 36)
    im = parchment(im, (470, 60), ["NEW ORLEANS"], 38); im = parchment(im, (525, 228), ["THE MUD WALL"], 36); im = parchment(im, (36, 448), ["BRITISH ARMY"], 36)
    # dark panel + sepia portrait right
    pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
    for x in range(900, W): pd.line([(x, 0), (x, H)], fill=(18, 14, 10, int(235 * min(1, (x - 900) / 260))))
    im = Image.alpha_composite(im, pan)
    b, (fx, fy) = cutout(250, "sepia"); im = place(im, b, int(1050 - fx), int(335 - fy), (255, 200, 140), "left", shadow=0.85)
    # red brush band with speckled white word
    f = ImageFont.truetype(AN, 205); tw = ImageDraw.Draw(im).textlength(WORD, font=f)
    bx0, by0, bx1, by1 = -10, 520, int(40 + tw + 70), 714; r = np.random.default_rng(8)
    m = Image.new("L", (W, H), 0); top = [(x, by0 + int(r.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(r.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
    right = [(bx1 + int(r.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
    ImageDraw.Draw(m).polygon(top + right + bot, fill=255)
    band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
    band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
    im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
    tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 622), WORD, font=f, fill=255, anchor="lm")
    tm = ImageChops.multiply(tm, Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
    im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
    out = T + "jackson-thumb-A_HE_DUG.jpg"; im.convert("RGB").save(out, quality=94); return out

# ====================================== B: GRAND MANEUVER ======================================
def variant_b():
    base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H)); base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
    n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
    f0 = ImageFont.truetype(AN, 250); tmp = Image.new("L", (1600, 330), 0); ImageDraw.Draw(tmp).text((0, 0), WORD, font=f0, fill=255); glyph = tmp.crop(tmp.getbbox())
    glyph = glyph.resize((min(900, int(glyph.width * 1.45)), glyph.height), Image.LANCZOS); gx, gy = int(810 - glyph.width / 2), 30
    sub = "THEN THE BRITISH ATTACKED"; fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 24
    tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((810, sy_), s, font=fs, fill=255, anchor="ma")
    rv = branch_rivers(seed=9); rv.putalpha(ImageChops.subtract(rv.split()[3].point(lambda v: int(v * 0.32)), tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, rv)
    sx, sy = 715, 580; ix, iy = 1035, 450
    # payoff = a crop of OUR OWN 3D film frame of the wall (S07, 8 Jan): wall + guns + blue ranks + red columns coming, soft vignette + thin gold frame
    fr = Image.open(T + "film_wall_S07_60s.png").convert("RGB").crop((10, 215, 1010, 665)); fw, fh = 480, 216; fr = fr.resize((fw, fh), Image.LANCZOS)
    fr = ImageEnhance.Contrast(ImageEnhance.Color(fr).enhance(1.25)).enhance(1.1); fr = ImageEnhance.Brightness(fr).enhance(1.08)
    msk = Image.new("L", (fw, fh), 0); ImageDraw.Draw(msk).rounded_rectangle([6, 6, fw - 7, fh - 7], radius=14, fill=255); msk = msk.filter(ImageFilter.GaussianBlur(4))
    px, py = int(ix - fw / 2), int(iy - fh / 2); fr = fr.convert("RGBA"); fr.putalpha(msk)
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([ix - 290, iy - 150, ix + 290, iy + 150], fill=(255, 170, 70, 80)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(45)))
    shd = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb_ = Image.new("RGBA", fr.size, (0, 0, 0, 255)); sb_.putalpha(msk.point(lambda v: int(v * 0.7))); shd.alpha_composite(sb_, (px + 6, py + 10)); im = Image.alpha_composite(im, shd.filter(ImageFilter.GaussianBlur(9)))
    im.alpha_composite(fr, (px, py)); ImageDraw.Draw(im).rounded_rectangle([px + 6, py + 6, px + fw - 7, py + fh - 7], radius=14, outline=(214, 176, 96, 255), width=3)
    im = glossy_seal(im, (sx, sy), 58)
    im = taper_arrow(im, [(sx + 64, sy - 6), (sx + 130, sy - 70), (px - 6, py + fh - 70)], 24, 13, (126, 195, 255, 255), glow=(70, 150, 240, 190))
    fl = ImageFont.truetype(SER, 36)
    for t, (x, y) in [("NEW ORLEANS", (sx + 40, sy + 66)), ("THE MUD WALL", (ix, py + fh + 12))]:
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text((x, y), t, font=fl, fill=(255, 210, 140, 160), anchor="ma"); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(6)))
        im = text_shadow(im, (x, y), t, fl, (246, 232, 196), "ma", off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
    im = text_shadow(im, (810, sy_), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = cutout(290, "warm"); x0, y0 = int(225 - fx), int(300 - fy)
    im = place(im, b, x0, y0, (255, 200, 140), "right", shadow=0.85)
    out = T + "jackson-thumb-B_HE_DUG.jpg"; im.convert("RGB").save(out, quality=94); return out

def sheet(outs):
    s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
    for i, o in enumerate(outs):
        im = Image.open(o); x = 20 + i * 660; s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), ["A MAIN (Back Door)", "B Test & Compare (Grand Maneuver)"][i], font=F2, fill=(230, 220, 200))
        s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410)); d.text((x + 380, 510), "168x94 feed size", font=F2, fill=(180, 170, 150))
    s.save("youtube/thumbs_sheet.jpg", quality=92)
outs = [variant_a(), variant_b()]; sheet(outs); print(outs)
