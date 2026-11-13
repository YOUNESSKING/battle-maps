"""Thumbnail set v5 = the fixes both independent reviewers asked for (youtube/thumb_review_1.md + _2.md), 2026-11-13.
A main: Peale close-up + THE TRAP banner, YORKTOWN as a big second line, one thick allied-blue arrow (white edge) sweeping round the town, plume off the wig.
B: our map, darker title band hides the cut labels/box, tighter crop (fewer boxes), blue arrow with white edge, bigger THE TRAP.
C: Trumbull crop ~2.2x on O'Hara + Lincoln, circle on O'Hara alone, rest darkened, question WHERE'S CORNWALLIS? (true: he stayed away, FACT_NOTES)."""
import sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W, H = 1280, 720; F = "tools/oswald-latin-700-normal.ttf"
def arrow(img, pts, col=(31, 79, 196), width=44, head=86):
    big = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    P = [(2 * x, 2 * y) for x, y in pts]
    x1, y1 = P[-1]; x0, y0 = P[-4]; ang = math.atan2(y1 - y0, x1 - x0)
    tip = (x1 + 2 * head * math.cos(ang), y1 + 2 * head * math.sin(ang))
    l = (x1 + 2 * head * 0.8 * math.cos(ang + 1.95), y1 + 2 * head * 0.8 * math.sin(ang + 1.95)); r = (x1 + 2 * head * 0.8 * math.cos(ang - 1.95), y1 + 2 * head * 0.8 * math.sin(ang - 1.95))
    dense = []
    for (xa, ya), (xb, yb) in zip(P, P[1:]):
        n = max(1, int(math.hypot(xb - xa, yb - ya) / 3))
        dense += [(xa + (xb - xa) * k / n, ya + (yb - ya) * k / n) for k in range(n)]
    for c, wv, grow in (((255, 255, 255, 255), 2 * width + 22, 14), (col + (255,), 2 * width, 0)):
        rr = wv / 2
        for (xq, yq) in dense: d.ellipse([xq - rr, yq - rr, xq + rr, yq + rr], fill=c)
        cxp = (tip[0] + l[0] + r[0]) / 3; cyp = (tip[1] + l[1] + r[1]) / 3
        g = lambda p: (p[0] + (p[0] - cxp) * grow / 60, p[1] + (p[1] - cyp) * grow / 60)
        d.polygon([g(tip), g(l), g(r)], fill=c)
    big = big.resize((W, H), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.putalpha(big.split()[3].filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.5)))
    img.alpha_composite(sh, (5, 7)); img.alpha_composite(big)
def ell(cx, cy, rx, ry, a0, a1, step=-2):
    return [(cx + rx * math.cos(math.radians(t)), cy + ry * math.sin(math.radians(t))) for t in range(a0, a1, step)]
def brush(d, x, y, w, h, seed):
    rng = np.random.default_rng(seed)
    top = [(x + i, y + int(rng.integers(-7, 8))) for i in range(0, w + 1, 20)]; bot = [(x + i, y + h + int(rng.integers(-8, 9))) for i in range(w, -1, -20)]
    d.polygon(top + [(x + w + 16, y + h // 2)] + bot + [(x - 12, y + h // 2)], fill=(196, 22, 28))
# ---------- A
bg = Image.open("youtube/thumb/bg_vidiq_D.jpg").convert("RGB").crop((330, 60, 2030, 1016)).resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Color(bg).enhance(0.85); bg = ImageEnhance.Brightness(bg).enhance(0.9).convert("RGBA")
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
for i in range(620): sd.line([(i, 0), (i, H)], fill=(8, 6, 4, int(235 * (1 - i / 620) ** 1.2)))
sh2 = Image.new("L", (W, H), 0); ImageDraw.Draw(sh2).ellipse([-260, -260, 560, 300], fill=120); sh2 = sh2.filter(ImageFilter.GaussianBlur(70))
sh = Image.alpha_composite(sh, Image.merge("RGBA", (Image.new("L", (W, H), 8),) * 3 + (sh2,)))   # soft: plume off the wig
A = Image.alpha_composite(bg, sh)
arrow(A, ell(600, 340, 250, 150, 162, 6, -1), width=34, head=62)   # closes round the town (ring), head points back in              # round the town + fort, from the land side to the shore
cut = Image.open("youtube/thumb/washington_cut.png").convert("RGBA").crop((540, 120, 1330, 1020))
hh = int(H * 1.04); ww = int(cut.width * hh / cut.height); face = cut.resize((ww, hh), Image.LANCZOS); a = face.split()[3]
rgb = ImageEnhance.Sharpness(ImageEnhance.Contrast(ImageEnhance.Color(face.convert("RGB")).enhance(1.22)).enhance(1.2)).enhance(1.6)
face = rgb.convert("RGBA"); face.putalpha(a)
rim = Image.new("RGBA", face.size, (255, 230, 190, 0)); rim.putalpha(a.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.25)))
x0 = -int(ww * 0.06); A.alpha_composite(rim, (x0 + 3, H - hh + 20)); A.alpha_composite(face, (x0, H - hh + 20))
d = ImageDraw.Draw(A); f = ImageFont.truetype(F, 120); f2 = ImageFont.truetype(F, 70)
tw = d.textlength("THE TRAP", font=f); bw = int(tw + 70); bx, by = W - bw - 36, 30
brush(d, bx, by, bw, 150, 3); d.text((bx + bw / 2, by + 14), "THE TRAP", font=f, fill=(252, 248, 238), anchor="ma", stroke_width=3, stroke_fill=(30, 8, 8))
d.text((bx + bw / 2, by + 168), "YORKTOWN", font=f2, fill=(255, 255, 255), anchor="ma", stroke_width=5, stroke_fill=(10, 8, 6))
A.convert("RGB").save("youtube/thumb/yorktown-thumb5-A_MAIN.jpg", quality=94)
# ---------- B
fr = Image.open(sys.argv[1]).convert("RGB").crop((420, 300, 420 + 1250, 300 + 703)).resize((W, H), Image.LANCZOS)
fr = ImageEnhance.Contrast(ImageEnhance.Color(fr).enhance(1.15)).enhance(1.1).convert("RGBA")
ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); o = ImageDraw.Draw(ov)
for i in range(250): o.line([(0, i), (W, i)], fill=(10, 9, 7, int(250 if i < 175 else 250 * (1 - (i - 175) / 75))))
B = Image.alpha_composite(fr, ov)
arrow(B, ell(700, 330, 420, 270, 192, 12, -1), width=36, head=70)   # inside the frame, round the British works, ends at the river east of the redoubts
d = ImageDraw.Draw(B)
d.text((W / 2, 14), "YORKTOWN · 1781", font=ImageFont.truetype(F, 116), fill=(255, 255, 255), anchor="ma", stroke_width=6, stroke_fill=(10, 8, 6))
fs = ImageFont.truetype(F, 66); t = "THE TRAP"; tw = d.textlength(t, font=fs)
d.rectangle([W / 2 - tw / 2 - 26, 166, W / 2 + tw / 2 + 26, 252], fill=(196, 22, 28)); d.text((W / 2, 170), t, font=fs, fill=(255, 255, 255), anchor="ma")
B.convert("RGB").save("youtube/thumb/yorktown-thumb5-B_MAP.jpg", quality=94)
# ---------- C
tr = Image.open("assets/archive/trumbull_surrender.jpg").convert("RGB")
tr = tr.crop((560, 470, 560 + 960, 470 + 540)).resize((W, H), Image.LANCZOS)
tr = ImageEnhance.Contrast(tr).enhance(1.12)
ox, oy, rx, ry = 330, 470, 100, 250
m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).ellipse([ox - rx, oy - ry, ox + rx, oy + ry], fill=255); m = m.filter(ImageFilter.GaussianBlur(10))
dark = ImageEnhance.Color(ImageEnhance.Brightness(tr).enhance(0.55)).enhance(0.5)
C = Image.composite(tr, dark, m).convert("RGBA")
c = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([2 * (ox - rx), 2 * (oy - ry), 2 * (ox + rx), 2 * (oy + ry)], outline=(225, 20, 28, 255), width=28)
C.alpha_composite(c.resize((W, H), Image.LANCZOS))
d = ImageDraw.Draw(C); f = ImageFont.truetype(F, 104)
d.text((960, 110), "WHERE'S", font=f, fill=(255, 255, 255), anchor="ma", stroke_width=6, stroke_fill=(10, 8, 6))
d.text((960, 220), "CORNWALLIS?", font=f, fill=(255, 220, 210), anchor="ma", stroke_width=6, stroke_fill=(120, 10, 14))
C.convert("RGB").save("youtube/thumb/yorktown-thumb5-C_CIRCLE.jpg", quality=94)
# ---------- sheet
F2 = ImageFont.truetype(F, 22)
s = Image.new("RGB", (3 * 640 + 80, 560), (24, 22, 20)); d = ImageDraw.Draw(s)
for i, (p, t) in enumerate([("A_MAIN", "A (main) face + THE TRAP + arrow"), ("B_MAP", "B our map: YORKTOWN, 1781 + one arrow"), ("C_CIRCLE", "C Trumbull: O'Hara circled")]):
    im = Image.open(f"youtube/thumb/yorktown-thumb5-{p}.jpg"); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), t, font=F2, fill=(230, 220, 200))
    s.paste(im.resize((168, 94), Image.LANCZOS), (x, 420)); d.text((x + 180, 455), "feed size 168x94", font=F2, fill=(170, 160, 140))
s.save("youtube/thumb/thumb5_sheet.jpg", quality=92); print("ok")
