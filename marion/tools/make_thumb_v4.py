"""Marion thumbnails v4 (owner 2026-11-17 + two harsh critics): rebuilt from our own sources only.
(1) GRANT style ("THE BACK DOOR"): golden aerial swamp (first vidIQ image, text/face/blue block removed, dragoons recoloured to Legion green),
    Style W unit boxes, white curved arrow, painted-look Marion (tools/paint_marion.py) big on the right bleeding off, red torn banner bottom-left.
(2) GRAND MANEUVER style ("HE WON."): Anton headline, spaced serif twist line, navy map with hairline glowing rivers, ONE move, 3D wax seal,
    Marion's blue boxes fading into a glowing mist (= vanished), painted portrait bottom-left bleeding off.  usage (from marion/): python3 tools/make_thumb_v4.py"""
import math, cv2, numpy as np, runpy
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
P = Image.open("youtube/thumb/marion_painted.png").convert("RGBA")
def portrait(face_h, flip=False):
    """returns (image, face_centre_in_image): the crop's face (brow..chin ~110 px) sits at (185, 300) unflipped"""
    b = P.crop((240, 0, 650, 900)); fx = 185
    if flip: b = b.transpose(Image.FLIP_LEFT_RIGHT); fx = b.width - 185
    s = face_h / 110.0; b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS); return b, (fx * s, 300 * s)
def torn(d, x, y, w, h, rng, col=(196, 30, 36)):
    top = [(x + i, y + int(rng.integers(-9, 10))) for i in range(0, w + 1, 14)]
    bot = [(x + i, y + h + int(rng.integers(-10, 11))) for i in range(w, -1, -14)]
    d.polygon(top + [(x + w + int(rng.integers(8, 22)), y + h // 2)] + bot + [(x - int(rng.integers(8, 18)), y + h // 2)], fill=col)
def tag(d, xy, text, fill, size=28):
    f = ImageFont.truetype(OS, size); w = d.textlength(text, font=f); x, y = xy
    d.rectangle([x, y, x + w + 24, y + size + 14], fill=fill); d.text((x + 12, y + 4), text, font=f, fill=(247, 243, 234))
def unit(d, c, col, w=46, h=30):
    x, y = c; d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], fill=col, outline=(245, 240, 228), width=3)
    d.line([x - w / 2 + 5, y + h / 2 - 5, x + w / 2 - 5, y - h / 2 + 5], fill=(245, 240, 228), width=3)
def curve(im, p0, p1, bend, col=(255, 255, 255), w0=6, w1=20):
    d = ImageDraw.Draw(im); (x0, y0), (x1, y1) = p0, p1; nx, ny = -(y1 - y0), (x1 - x0); L = math.hypot(nx, ny)
    cx, cy = (x0 + x1) / 2 + nx / L * bend, (y0 + y1) / 2 + ny / L * bend
    pts = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.88, 50)]
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    for i in range(len(pts) - 1):
        wd = int(w0 + (w1 - w0) * i / len(pts)); sd.line([pts[i], pts[i + 1]], fill=(0, 0, 0, 150), width=wd + 4); d.line([pts[i], pts[i + 1]], fill=col, width=wd)
    (xa, ya), (xb, yb) = pts[-2], pts[-1]; a = math.atan2(yb - ya, xb - xa); Lh = w1 * 2.4
    tri = [(xb + math.cos(a) * Lh, yb + math.sin(a) * Lh), (xb + math.cos(a + 2.4) * Lh * 0.8, yb + math.sin(a + 2.4) * Lh * 0.8), (xb + math.cos(a - 2.4) * Lh * 0.8, yb + math.sin(a - 2.4) * Lh * 0.8)]
    d.polygon(tri, fill=col)
outs = []
# ======================= (1) GRANT STYLE =======================
src = cv2.cvtColor(np.array(Image.open("youtube/thumb/vidiq_A_SWAMP_FOX.png").convert("RGB").resize((W, H))), cv2.COLOR_RGB2BGR)
m = np.zeros(src.shape[:2], np.uint8)
cv2.rectangle(m, (110, 222), (236, 300), 255, -1)                         # parade-ground blue block
cv2.line(m, (200, 292), (450, 392), 255, 70); cv2.circle(m, (205, 290), 45, 255, -1)   # baked blue arrow
src = cv2.inpaint(src, m, 11, cv2.INPAINT_TELEA)
patch = src[440:600, 20:330].copy()                                                  # untouched trees lower-left
mk = np.zeros(patch.shape[:2], np.float32); cv2.ellipse(mk, (155, 80), (150, 76), 0, 0, 360, 1.0, -1); mk = cv2.GaussianBlur(mk, (41, 41), 0)[..., None]
for (yy, xx) in [(250, 230), (300, 330), (205, 120)]:
    roi = src[yy:yy + 160, xx:xx + 310].astype(np.float32); src[yy:yy + 160, xx:xx + 310] = (patch * mk + roi * (1 - mk)).astype(np.uint8)
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV); reg = np.zeros(m.shape, bool); reg[380:640, 430:740] = True
red = ((hsv[..., 0] < 9) | (hsv[..., 0] > 168)) & (hsv[..., 1] > 90) & (hsv[..., 2] > 60) & reg
hsv[..., 0][red] = 62; hsv[..., 2][red] = (hsv[..., 2][red] * 0.62).astype(np.uint8)   # Legion green
src = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
bgA = Image.fromarray(cv2.cvtColor(src, cv2.COLOR_BGR2RGB))
bgA = bgA.crop((0, 140, 1060, 140 + 596)).resize((W, H), Image.LANCZOS)        # drop the baked headline, push the scene left
warm = Image.new("RGB", (W, H), (255, 176, 96)); bgA = ImageChops.soft_light(bgA, warm); bgA = Image.blend(bgA, ImageChops.soft_light(bgA, warm), 0.6)
bgA = ImageEnhance.Brightness(ImageEnhance.Contrast(bgA).enhance(1.12)).enhance(1.08)
def grant(word, key):
    rng = np.random.default_rng(3); im = bgA.copy().convert("RGBA")
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    for i in range(470): sd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(20, 14, 8, int(255 * min(1, (1 - i / 470) * 2.2))))
    im = Image.alpha_composite(im, sh); d = ImageDraw.Draw(im)
    for c in [(560, 470), (612, 520), (664, 570)]: unit(d, c, (200, 24, 32))
    for c in [(205, 260), (255, 238)]: unit(d, c, (36, 80, 196))
    tag(d, (520, 400), "TARLETON", (178, 24, 30)); tag(d, (150, 180), "MARION", (34, 78, 190))
    curve(im, (600, 560), (210, 300), 110)
    b, (fx, fy) = portrait(205); x0 = int(1035 - fx); y0 = int(268 - fy)
    rim = Image.new("RGBA", b.size, (255, 180, 100, 0)); rim.putalpha(b.split()[3].filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.5)))
    im.alpha_composite(rim, (x0 - 6, y0)); im.alpha_composite(b, (x0, y0)); d = ImageDraw.Draw(im)
    d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 132); tw = d.textlength(word, font=f)
    bx, by, bw, bh = 28, 548, int(tw + 64), 152
    torn(d, bx, by, bw, bh, rng)
    d.text((bx + bw / 2, by + bh / 2 + 4), word, font=f, fill=(255, 248, 236), anchor="mm", stroke_width=4, stroke_fill=(58, 12, 12))
    out = f"youtube/thumb/marion-V4-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
grant("INTO THE SWAMP", "INTO_THE_SWAMP")
# ======================= (2) GRAND MANEUVER STYLE =======================
g = runpy.run_path("tools/make_thumb_gm.py", run_name="lib"); T = g["T"]; OX, RICH, BEN, ROAD = g["OX"], g["RICH"], g["BEN"], g["ROAD"]
water = g["water"]
def gm(word, sub, key):
    base = Image.new("RGB", (W, H), (15, 28, 46)); vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-200, -260, W + 200, H + 260], fill=255)
    base = Image.composite(base, Image.new("RGB", (W, H), (8, 17, 29)), vig.filter(ImageFilter.GaussianBlur(160)))
    noise = Image.effect_noise((W, H), 14).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, noise), 0.18)
    edge = water.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 40 else 0)
    glow = Image.new("RGB", (W, H), (59, 127, 208)); base.paste(glow, (0, 0), edge.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.45)))
    base.paste(Image.new("RGB", (W, H), (178, 214, 252)), (0, 0), edge.point(lambda v: int(v * 0.85)))
    im = base.convert("RGBA"); d = ImageDraw.Draw(im)
    ox, rx, bx = T(OX), T(RICH), T(BEN)
    # mist patch where Marion vanishes (focal point)
    mist = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(mist).ellipse([bx[0] - 170, bx[1] - 70, bx[0] + 140, bx[1] + 110], fill=(236, 230, 210, 120))
    im = Image.alpha_composite(im, mist.filter(ImageFilter.GaussianBlur(38))); d = ImageDraw.Draw(im)
    # red column -> seal at Ox Swamp (one move)
    for i, c in enumerate([(ox[0] - 330, ox[1] - 8), (ox[0] - 262, ox[1] - 12), (ox[0] - 194, ox[1] - 16)]): unit(d, c, (200, 24, 32), 56, 36)
    # blue boxes fading into the mist
    for i, (c, a) in enumerate([((ox[0] + 120, ox[1] + 70), 255), ((ox[0] + 260, ox[1] + 74), 150), ((bx[0] - 60, bx[1] + 26), 70)]):
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); unit(ImageDraw.Draw(lay), c, (36, 80, 196), 56, 36); lay.putalpha(lay.split()[3].point(lambda v: int(v * a / 255)))
        im = Image.alpha_composite(im, lay)
    d = ImageDraw.Draw(im)
    # one tapered gradient arrow: from Ox Swamp along Marion's escape into the mist
    path = [(ox[0] + 40, ox[1] + 40), (ox[0] + 220, ox[1] + 108), (bx[0] - 120, bx[1] + 70)]
    for i in range(60):
        t = i / 60; x = (1 - t) ** 2 * path[0][0] + 2 * (1 - t) * t * path[1][0] + t * t * path[2][0]; y = (1 - t) ** 2 * path[0][1] + 2 * (1 - t) * t * path[1][1] + t * t * path[2][1]
        r = 17 - 9 * t; col = (int(90 + 69 * t), int(168 + 40 * t), 255); d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    a = math.atan2(path[2][1] - path[1][1], path[2][0] - path[1][0]); xb, yb = path[2]; L = 46
    d.polygon([(xb + math.cos(a) * L, yb + math.sin(a) * L), (xb + math.cos(a + 2.5) * L * 0.8, yb + math.sin(a + 2.5) * L * 0.8), (xb + math.cos(a - 2.5) * L * 0.8, yb + math.sin(a - 2.5) * L * 0.8)], fill=(159, 208, 255))
    # 3D wax seal at Ox Swamp (where Tarleton halted)
    sx, sy, R = ox[0] - 118, ox[1] - 18, 46
    seal = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(seal)
    for i in range(16):
        aa = i / 16 * 2 * math.pi; sd.ellipse([sx + math.cos(aa) * R * 0.86 - R * 0.3, sy + math.sin(aa) * R * 0.86 - R * 0.3, sx + math.cos(aa) * R * 0.86 + R * 0.3, sy + math.sin(aa) * R * 0.86 + R * 0.3], fill=(150, 22, 28, 255))
    sd.ellipse([sx - R, sy - R, sx + R, sy + R], fill=(158, 27, 31, 255))
    hl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(hl).ellipse([sx - R * 0.8, sy - R * 0.85, sx + R * 0.2, sy + R * 0.1], fill=(216, 66, 74, 150))
    seal = Image.alpha_composite(seal, hl.filter(ImageFilter.GaussianBlur(9))); sd = ImageDraw.Draw(seal)
    sd.ellipse([sx - R * 0.62, sy - R * 0.62, sx + R * 0.62, sy + R * 0.62], outline=(110, 12, 18, 255), width=4)
    sd.text((sx, sy + 2), "HALT", font=ImageFont.truetype(SER, 20), fill=(240, 205, 190, 230), anchor="mm")
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(shadow).ellipse([sx - R + 4, sy - R + 8, sx + R + 4, sy + R + 8], fill=(0, 0, 0, 150))
    im = Image.alpha_composite(im, shadow.filter(ImageFilter.GaussianBlur(6))); im = Image.alpha_composite(im, seal); d = ImageDraw.Draw(im)
    fl = ImageFont.truetype(SER, 30)
    for txt, (x, y) in [("OX SWAMP", (sx - 70, sy + 56)), ("BENBOW'S FERRY", (bx[0] - 140, bx[1] - 90))]:
        d.text((x + 2, y + 3), txt, font=fl, fill=(0, 0, 0)); d.text((x, y), txt, font=fl, fill=(244, 234, 210))
    # headline + twist line
    f = ImageFont.truetype(AN, 176); cx = 800
    sh2 = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh2).text((cx, 26 + 6), word, font=f, fill=(0, 0, 0, 150), anchor="ma")
    im = Image.alpha_composite(im, sh2.filter(ImageFilter.GaussianBlur(10))); d = ImageDraw.Draw(im)
    d.text((cx, 26), word, font=f, fill=(244, 234, 210), anchor="ma")
    fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split()); d.text((cx, 242), s, font=fs, fill=(244, 234, 210), anchor="ma")
    # portrait bottom-left, looking right, bleeding off two edges, rim glow
    b, (fx, fy) = portrait(160, flip=True); x0 = int(190 - fx); y0 = int(520 - fy)
    rim = Image.new("RGBA", b.size, (111, 179, 255, 0)); rim.putalpha(b.split()[3].filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.55)))
    im.alpha_composite(rim, (x0 + 6, y0)); im.alpha_composite(b, (x0, y0))
    out = f"youtube/thumb/marion-V4-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
gm("HE VANISHED.", "THEN TARLETON TURNED BACK", "HE_VANISHED")
s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V4-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
s.save("youtube/thumb/sheet_v4.jpg", quality=92); print(outs)
