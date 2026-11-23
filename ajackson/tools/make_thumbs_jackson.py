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
    a = cv2.erode(a, np.ones((5, 5), np.uint8), 1); _, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY); a = cv2.GaussianBlur(a, (3, 3), 0)   # hard 2 px matte
    rgb = b.convert("RGB")
    if grade == "sepia":
        g = ImageEnhance.Contrast(ImageOps.grayscale(rgb)).enhance(1.3)
        rgb = ImageOps.colorize(g, black=(26, 18, 12), mid=(140, 108, 78), white=(246, 232, 206))
    else:
        rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(1.12)).enhance(1.12)
    b = rgb.convert("RGBA"); b.putalpha(Image.fromarray(a.astype(np.uint8)))
    s = face_h / FH; b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS)
    return b, ((FACE[0] - CROP[0]) * s, (FACE[1] - CROP[1]) * s)

def place(im, b, x0, y0, rim_col, rim_side, shadow=0.75):
    a = b.split()[3]; sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(a.point(lambda v: int(v * shadow)))
    sh.alpha_composite(sb, (x0 + (-10 if rim_side == "left" else 10), y0 + 8)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12)))
    rim = Image.new("RGBA", b.size, rim_col + (0,)); edge = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2))
    side = np.linspace(1, 0, b.width) if rim_side == "left" else np.linspace(0, 1, b.width)
    rim.putalpha(Image.fromarray((np.array(edge).astype(float) * side[None, :] * 0.8).astype(np.uint8)))
    im.alpha_composite(b, (x0, y0)); im.alpha_composite(rim, (x0, y0)); return im

# ====================================== A: BACK DOOR ======================================
def variant_a():
    im = Image.open(T + "bg_vidiq_chalmette.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Contrast(ImageEnhance.Color(im).enhance(0.8)).enhance(1.12).convert("RGBA")
    RED, BLUE = (176, 34, 40), (38, 78, 168)
    # American line: two ranks of blue blocks just behind (north of) the mud rampart, which runs y~357 from the river bank (x~190) to the swamp
    for (x, y) in [(215, 336), (330, 334), (445, 333), (560, 333), (675, 333), (790, 333)]:
        im = formation(im, (x, y), BLUE, 6, 2, cw=15, ch=9, gap=3, ang=0.0)
    for (x, y) in [(262, 312), (500, 310), (730, 310)]: im = formation(im, (x, y), BLUE, 4, 1, cw=15, ch=9, gap=3, ang=0.0)
    # British columns: long red columns marching up the fields toward the wall (in front, south of it)
    for (x, y, n) in [(330, 500, 6), (420, 520, 7), (510, 510, 7), (600, 520, 7), (690, 500, 6), (780, 490, 5)]:
        im = formation(im, (x, y), RED, n, 3, cw=17, ch=11, gap=3, ang=-1.57)
    # grungy sweep arrow: the British advance into the wall (from behind the band, curving up to the rampart)
    im = grunge_arrow(im, [(250, 600), (330, 470), (480, 430), (560, 380)], 52, 38)
    im = parchment(im, (95, 405), ["BRITISH ARMY"], 28); im = parchment(im, (470, 118), ["NEW ORLEANS"], 30)
    # dark panel + sepia portrait right
    pan = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pan)
    for x in range(700, W): pd.line([(x, 0), (x, H)], fill=(18, 14, 10, int(255 * min(1, (x - 700) / 330))))
    im = Image.alpha_composite(im, pan)
    b, (fx, fy) = cutout(250, "sepia"); im = place(im, b, int(1050 - fx), int(335 - fy), (255, 206, 140), "left")
    # red brush band with speckled white word
    f = ImageFont.truetype(AN, 168); tw = ImageDraw.Draw(im).textlength(WORD, font=f)
    bx0, by0, bx1, by1 = -10, 538, int(40 + tw + 70), 712; r = np.random.default_rng(8)
    m = Image.new("L", (W, H), 0); top = [(x, by0 + int(r.integers(-12, 13))) for x in range(bx0, bx1 + 1, 10)]; bot = [(x, by1 + int(r.integers(-10, 11))) for x in range(bx1, bx0 - 1, -10)]
    right = [(bx1 + int(r.integers(0, 30)), y) for y in range(by0, by1 + 1, 12)]
    ImageDraw.Draw(m).polygon(top + right + bot, fill=255)
    band = Image.new("RGBA", (W, H), (192, 24, 30, 255)); n = Image.effect_noise((W, H), 40).convert("L")
    band = Image.composite(Image.new("RGBA", (W, H), (160, 16, 22, 255)), band, n.point(lambda v: 110 if v > 160 else 0))
    im.paste(band, (0, 0), m.filter(ImageFilter.GaussianBlur(1)))
    tm = Image.new("L", (W, H), 0); ImageDraw.Draw(tm).text((40, 627), WORD, font=f, fill=255, anchor="lm")
    tm = ImageChops.multiply(tm, Image.effect_noise((W, H), 70).convert("L").point(lambda v: 0 if v > 238 else 255))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.paste(Image.new("RGBA", (W, H), (40, 0, 0, 180)), (4, 6), tm); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
    im.paste(Image.new("RGBA", (W, H), (250, 246, 238, 255)), (0, 0), tm)
    out = T + "jackson-thumb-A_HE_DUG.jpg"; im.convert("RGB").save(out, quality=94); return out

# ====================================== B: GRAND MANEUVER ======================================
def variant_b():
    base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H)); base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
    n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
    f0 = ImageFont.truetype(AN, 250); tmp = Image.new("L", (1600, 330), 0); ImageDraw.Draw(tmp).text((0, 0), WORD, font=f0, fill=255); glyph = tmp.crop(tmp.getbbox())
    glyph = glyph.resize((min(900, int(glyph.width * 1.45)), glyph.height), Image.LANCZOS); gx, gy = int(800 - glyph.width / 2), 30
    sub = "THEN THE BRITISH ATTACKED"; fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 24
    tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((800, sy_), s, font=fs, fill=255, anchor="ma")
    rv = branch_rivers(seed=9); rv.putalpha(ImageChops.subtract(rv.split()[3].point(lambda v: int(v * 0.32)), tm.filter(ImageFilter.MaxFilter(31)))); im = Image.alpha_composite(im, rv)
    sx, sy = 710, 560; ix, iy = 1100, 520
    ic = Image.open(T + "icon_vidiq_rampart.png").convert("RGBA"); ic = ic.crop(ic.getbbox()); ic.thumbnail((400, 400), Image.LANCZOS); px, py = int(ix - ic.width / 2), int(iy - ic.height * 0.55)
    bloom = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(bloom).ellipse([ix - 190, iy - 120, ix + 190, iy + 120], fill=(255, 150, 60, 110)); im = Image.alpha_composite(im, bloom.filter(ImageFilter.GaussianBlur(50)))
    im.alpha_composite(ic, (px, py))
    im = glossy_seal(im, (sx, sy), 62)
    im = taper_arrow(im, [(sx + 70, sy - 4), (800, sy - 60), (px + 12, sy - 10)], 34, 15, (126, 195, 255, 255), glow=(70, 150, 240, 170))
    fl = ImageFont.truetype(SER, 38)
    for t, (x, y) in [("NEW ORLEANS", (sx, sy + 78)), ("THE MUD WALL", (ix, 668))]:
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text((x, y), t, font=fl, fill=(255, 210, 140, 160), anchor="ma"); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(6)))
        im = text_shadow(im, (x, y), t, fl, (246, 232, 196), "ma", off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shg = Image.new("RGBA", glyph.size, (0, 0, 0, 255)); shg.putalpha(glyph.point(lambda v: int(v * 0.5))); sh.alpha_composite(shg, (gx, gy + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(12))); col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
    im = text_shadow(im, (800, sy_), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = cutout(250, "warm"); x0, y0 = int(235 - fx), int(300 - fy)
    im = place(im, b, x0, y0, (156, 196, 255), "right")
    out = T + "jackson-thumb-B_HE_DUG.jpg"; im.convert("RGB").save(out, quality=94); return out

def sheet(outs):
    s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
    for i, o in enumerate(outs):
        im = Image.open(o); x = 20 + i * 660; s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), ["A MAIN (Back Door)", "B Test & Compare (Grand Maneuver)"][i], font=F2, fill=(230, 220, 200))
        s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410)); d.text((x + 380, 510), "168x94 feed size", font=F2, fill=(180, 170, 150))
    s.save("youtube/thumbs_sheet.jpg", quality=92)
outs = [variant_a(), variant_b()]; sheet(outs); print(outs)
