"""Tactical Genius-style thumbnail: dark aerial battle map with dense unit blocks + white arrows (left),
large general portrait (right), red brush banner with a 1-3 word quote (bottom-left)."""
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720
random.seed(3)
F = "tools/oswald-latin-700-normal.ttf"

# --- background: painted Guilford battlefield, graded dark and gritty
bg = Image.open("assets/gf_battle.jpg").convert("RGB").crop((0, 180, 1900, 1249)).resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Color(bg).enhance(0.55)
bg = ImageEnhance.Contrast(bg).enhance(1.35)
bg = ImageEnhance.Brightness(bg).enhance(0.62)
bg = bg.convert("RGBA")

def smoke(img, x, y, r, a=150):
    s = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(s)
    for _ in range(9):
        dx, dy, rr = random.randint(-r, r), random.randint(-r, r // 2), random.randint(r // 2, r)
        d.ellipse([x + dx - rr, y + dy - rr, x + dx + rr, y + dy + rr], fill=(70, 68, 64, a))
    img.alpha_composite(s.filter(ImageFilter.GaussianBlur(r / 2.5)))

def block(d, x, y, col, s=15):
    dark = tuple(int(c * 0.55) for c in col); light = tuple(min(255, int(c * 1.35)) for c in col)
    d.polygon([(x, y), (x + s, y), (x + s + 5, y - 5), (x + 5, y - 5)], fill=light)       # top
    d.polygon([(x + s, y), (x + s + 5, y - 5), (x + s + 5, y + s - 5), (x + s, y + s)], fill=dark)  # side
    d.rectangle([x, y, x + s, y + s], fill=col, outline=(20, 16, 14))

def formation(d, x0, y0, cols, rows, col, dx=21, dy=21, jitter=3):
    for r in range(rows):
        for c in range(cols):
            block(d, x0 + c * dx + random.randint(-jitter, jitter), y0 + r * dy + random.randint(-jitter, jitter), col)

RED, BLUE = (190, 30, 34), (40, 90, 200)
smoke(bg, 330, 250, 60, 120); smoke(bg, 560, 170, 50, 110); smoke(bg, 180, 120, 45, 90)
d = ImageDraw.Draw(bg)
# British lines advancing east across the first clearing
formation(d, 130, 250, 4, 7, RED); formation(d, 215, 405, 4, 6, RED); formation(d, 290, 120, 4, 5, RED); formation(d, 40, 330, 2, 6, RED)
# Greene's three lines in depth
formation(d, 520, 150, 2, 16, BLUE, dy=24); formation(d, 640, 180, 2, 14, BLUE, dy=24); formation(d, 755, 230, 2, 11, BLUE, dy=24)

def arrow(img, pts, width=26):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
    # quadratic bezier sampled
    (x0, y0), (x1, y1), (x2, y2) = pts
    P = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t * t * x2, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t * t * y2) for t in [i / 40 for i in range(41)]]
    ex, ey = P[-1]; px, py = P[-4]
    import math
    ang = math.atan2(ey - py, ex - px); L = width * 1.7
    head = [(ex + math.cos(ang) * L * 0.6, ey + math.sin(ang) * L * 0.6),
            (ex + math.cos(ang + 2.4) * L, ey + math.sin(ang + 2.4) * L), (ex + math.cos(ang - 2.4) * L, ey + math.sin(ang - 2.4) * L)]
    for w, colr in ((width + 8, (25, 20, 16, 230)), (width, (236, 230, 216, 255))):
        dd.line(P[:-2], fill=colr, width=w, joint="curve")
        grow = 6 if colr[0] < 100 else 0
        dd.polygon([(hx + math.cos(ang) * grow * 0, hy) for hx, hy in head], fill=colr)
    shadow = lay.filter(ImageFilter.GaussianBlur(6)); img.alpha_composite(Image.eval(shadow, lambda v: v) if False else lay)

arrow(bg, [(110, 560), (300, 470), (500, 420)])
arrow(bg, [(120, 200), (320, 150), (500, 250)])

def tag(img, face, name, x, y, flag):
    f = ImageFont.truetype(F, 20)
    fc = Image.open(face).convert("RGBA"); fc.thumbnail((58, 70))
    box = Image.new("RGBA", (fc.width + 8, fc.height + 8), (235, 228, 210, 255)); box.alpha_composite(fc, (4, 4))
    img.alpha_composite(box, (x, y))
    dd = ImageDraw.Draw(img); tw = dd.textlength(name, font=f)
    cx = x + box.width / 2
    dd.rectangle([cx - tw / 2 - 6, y + box.height + 2, cx + tw / 2 + 6, y + box.height + 28], fill=(20, 18, 16, 235), outline=(235, 228, 210))
    dd.text((cx - tw / 2, y + box.height + 1), name, font=f, fill=(240, 235, 225))

tag(bg, "assets/media/cornwallis_head.png", "CORNWALLIS", 190, 30, "gb")
tag(bg, "assets/media/greene_head.png", "GREENE", 668, 60, "us")

# --- vignette
vg = Image.new("L", (W, H), 0); dv = ImageDraw.Draw(vg)
for i in range(60):
    dv.rectangle([i * 6, i * 4, W - i * 6, H - i * 4], outline=int(255 * (1 - i / 60) ** 2))
bg = Image.composite(Image.new("RGBA", (W, H), (8, 6, 5, 255)), bg, vg.filter(ImageFilter.GaussianBlur(30)))

# --- general on the right
gr = Image.open("assets/media/greene_full.png").convert("RGBA")
r = H * 1.25 / gr.height; gr = gr.resize((int(gr.width * r), int(gr.height * r)), Image.LANCZOS)
gr = ImageEnhance.Contrast(gr).enhance(1.15)
# dark rim so he separates from the map
a = gr.split()[3]
rim = Image.new("RGBA", gr.size, (0, 0, 0, 0)); rim.putalpha(a.filter(ImageFilter.GaussianBlur(22)).point(lambda v: int(v * 0.8)))
gx, gy = W - gr.width + 150, H - gr.height + 110
bg.alpha_composite(rim, (gx - 10, gy)); bg.alpha_composite(gr, (gx, gy))

# --- red brush banner + quote
ban = Image.new("RGBA", (W, H), (0, 0, 0, 0)); db = ImageDraw.Draw(ban)
x0, y0, x1, y1 = 0, 548, 720, 700
pts = [(x0, y0 + 10)]
for x in range(x0, x1, 14): pts.append((x, y0 + random.randint(-8, 10)))
for y in range(y0, y1, 12): pts.append((x1 + random.randint(-22, 8), y))
for x in range(x1, x0, -14): pts.append((x, y1 + random.randint(-10, 8)))
db.polygon(pts, fill=(176, 18, 24, 245))
for _ in range(260):  # dry-brush streaks
    yy = random.randint(y0 + 4, y1 - 4); xx = random.randint(x0, x1 - 120)
    db.line([(xx, yy), (xx + random.randint(20, 90), yy)], fill=(150, 10, 16, 200), width=2)
bg.alpha_composite(ban)
d = ImageDraw.Draw(bg)
f1, f2 = ImageFont.truetype(F, 50), ImageFont.truetype(F, 104)
d.text((34, 548), "ANOTHER SUCH", font=f1, fill=(248, 245, 238), stroke_width=3, stroke_fill=(30, 10, 10))
d.text((30, 586), "“VICTORY”", font=f2, fill=(248, 245, 238), stroke_width=4, stroke_fill=(30, 10, 10))
bg.convert("RGB").save("build/thumb/thumbnail.jpg", quality=93)
print("ok")
