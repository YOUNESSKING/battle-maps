"""Yorktown thumbnails in the Grant #16 'D' combination (owner 2026-11-13: ~7% day-1 CTR): bright golden vidIQ battlefield,
place-year tag top-left, small map labels, Washington's real PD portrait (C. W. Peale) cut out on the right in colour, red banner bottom-left.
usage: python3 tools/make_thumb_d.py  -> youtube/thumb/yorktown-thumbD-<TEXT>.jpg + thumbD_sheet.jpg"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W, H = 1280, 720; F = "tools/oswald-latin-700-normal.ttf"
base = Image.open("youtube/thumb/bg_vidiq_D.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
cut = Image.open("youtube/thumb/washington_cut.png").convert("RGBA")
def tag(d, text, x, y, fill=(18, 16, 12), fg=(247, 243, 234), size=24):
    f = ImageFont.truetype(F, size); w = d.textlength(text, font=f)
    d.rectangle([x, y, x + w + 20, y + size + 14], fill=fill); d.text((x + 10, y + 5), text, font=f, fill=fg)
def brush(d, x, y, w, h, rng):
    top = [(x + i, y + int(rng.integers(-6, 7))) for i in range(0, w + 1, 18)]
    bot = [(x + i, y + h + int(rng.integers(-7, 8))) for i in range(w, -1, -18)]
    d.polygon(top + [(x + w + 14, y + h // 2)] + bot + [(x - 10, y + h // 2)], fill=(196, 22, 28))
def make(lines):
    rng = np.random.default_rng(7)
    im = base.copy().convert("RGBA")
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    for i in range(380): sd.line([(W - 380 + i, 0), (W - 380 + i, H)], fill=(10, 8, 6, int(205 * i / 380)))
    im = Image.alpha_composite(im, sh)
    h = int(H * 1.08); w = int(cut.width * h / cut.height); g = cut.resize((w, h), Image.LANCZOS)
    a = g.split()[3]; rgb = ImageEnhance.Contrast(ImageEnhance.Color(g.convert("RGB")).enhance(1.2)).enhance(1.15)
    g = rgb.convert("RGBA"); g.putalpha(a)
    im.alpha_composite(g, (W - int(w * 0.86), H - h + int(h * 0.05)))
    d = ImageDraw.Draw(im)
    tag(d, "YORKTOWN · 1781", 22, 20)
    tag(d, "YORK RIVER", 560, 205, size=18)
    tag(d, "WASHINGTON", 300, 300, fill=(31, 79, 196), size=20)
    tag(d, "CORNWALLIS", 380, 230, fill=(196, 18, 31), size=18)
    f = ImageFont.truetype(F, 96 if max(len(l) for l in lines) <= 11 else 80)
    lh = f.size * 1.02; bw = int(max(d.textlength(l, font=f) for l in lines) + 60); bh = int(lh * len(lines) + 34)
    bx, by = 26, H - bh - 26
    brush(d, bx, by, bw, bh, rng)
    for i, l in enumerate(lines):
        d.text((bx + 30, by + 14 + i * lh), l, font=f, fill=(250, 246, 236), stroke_width=3, stroke_fill=(30, 8, 8))
    key = "_".join(lines).replace(" ", "_").replace("?", "")
    out = f"youtube/thumb/yorktown-thumbD-{key}.jpg"; im.convert("RGB").save(out, quality=94); return out
outs = [make(["THE TRAP"]), make(["SAFE HARBOR?"]), make(["NO WAY", "OUT"])]
F2 = ImageFont.truetype(F, 22)
sh = Image.new("RGB", (3 * 640 + 80, 560), (24, 22, 20)); d = ImageDraw.Draw(sh)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    sh.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("thumbD-")[1][:-4], font=F2, fill=(230, 220, 200))
    sh.paste(im.resize((168, 94), Image.LANCZOS), (x, 420)); d.text((x + 180, 455), "feed size 168x94", font=F2, fill=(170, 160, 140))
sh.save("youtube/thumb/thumbD_sheet.jpg", quality=92); print(outs)
