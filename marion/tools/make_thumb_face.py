"""Yorktown thumbnails in the Grant #16 close-up style (owner 2026-11-13): Washington's REAL portrait (C. W. Peale, PD) as a big close-up face
on the left, the golden vidIQ battle on the right, huge white text on a red brush banner top-right.
usage: python3 tools/make_thumb_face.py -> youtube/thumb/yorktown-thumbF-<TEXT>.jpg + thumbF_sheet.jpg"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W, H = 1280, 720; F = "tools/oswald-latin-700-normal.ttf"
bg = Image.open("youtube/thumb/bg_vidiq_D.jpg").convert("RGB")
bg = bg.crop((330, 60, 330 + 1700, 60 + 956)).resize((W, H), Image.LANCZOS)   # town + ships centre-right
bg = ImageEnhance.Contrast(bg).enhance(1.08)
src = Image.open("assets/media/src/washington.jpg").convert("RGB")
cut = Image.open("youtube/thumb/washington_cut.png").convert("RGBA")
box = (540, 120, 1330, 1020)                                     # head and shoulders
face = cut.crop(box); hh = int(H * 1.04); ww = int(face.width * hh / face.height)
face = face.resize((ww, hh), Image.LANCZOS)
a = face.split()[3]
rgb = ImageEnhance.Sharpness(ImageEnhance.Contrast(ImageEnhance.Color(face.convert("RGB")).enhance(1.22)).enhance(1.18)).enhance(1.6)
face = rgb.convert("RGBA"); face.putalpha(a)
def brush(d, x, y, w, h, rng):
    top = [(x + i, y + int(rng.integers(-7, 8))) for i in range(0, w + 1, 20)]
    bot = [(x + i, y + h + int(rng.integers(-8, 9))) for i in range(w, -1, -20)]
    d.polygon(top + [(x + w + 16, y + h // 2)] + bot + [(x - 12, y + h // 2)], fill=(196, 22, 28))
def make(lines, small=None):
    rng = np.random.default_rng(11)
    im = bg.copy().convert("RGBA")
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    for i in range(560): sd.line([(i, 0), (i, H)], fill=(8, 6, 4, int(215 * (1 - i / 560) ** 1.3)))
    im = Image.alpha_composite(im, sh)
    rim = Image.new("RGBA", face.size, (255, 230, 190, 0)); rim.putalpha(a.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.25)))
    x0 = -int(ww * 0.06); im.alpha_composite(rim, (x0 + 3, H - hh + 20)); im.alpha_composite(face, (x0, H - hh + 20))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(F, 118 if max(len(l) for l in lines) <= 9 else 96)
    lh = f.size * 1.0; tw = max(d.textlength(l, font=f) for l in lines); bw = int(tw + 70); bh = int(lh * len(lines) + 40)
    bx = W - bw - 40; by = 34
    brush(d, bx, by, bw, bh, rng)
    for i, l in enumerate(lines):
        d.text((bx + bw / 2, by + 18 + i * lh), l, font=f, fill=(252, 248, 238), anchor="ma", stroke_width=3, stroke_fill=(30, 8, 8))
    if small:
        fs = ImageFont.truetype(F, 30); sw = d.textlength(small, font=fs)
        d.rectangle([W - sw - 70, by + bh + 22, W - 40, by + bh + 70], fill=(14, 12, 10)); d.text((W - sw - 55, by + bh + 27), small, font=fs, fill=(247, 243, 234))
    key = "_".join(lines).replace(" ", "_").replace("?", "")
    out = f"youtube/thumb/yorktown-thumbF-{key}.jpg"; im.convert("RGB").save(out, quality=94); return out
outs = [make(["THE TRAP"], "YORKTOWN · 1781"), make(["YORKTOWN"], "THE TRAP · 1781"), make(["NO WAY", "OUT"], "YORKTOWN · 1781")]
F2 = ImageFont.truetype(F, 22)
s = Image.new("RGB", (3 * 640 + 80, 560), (24, 22, 20)); d = ImageDraw.Draw(s)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("thumbF-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((168, 94), Image.LANCZOS), (x, 420)); d.text((x + 180, 455), "feed size 168x94", font=F2, fill=(170, 160, 140))
s.save("youtube/thumb/thumbF_sheet.jpg", quality=92); print(outs)
