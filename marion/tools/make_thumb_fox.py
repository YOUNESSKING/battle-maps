"""Marion thumbnails v3 (owner 2026-11-17): Marion's REAL portrait (John Blake White, 1810, PD) as a big close-up face on the right,
the vidIQ night-swamp battle behind (Legion dragoons in green, Marion's riders firing, a small red fox in the foreground),
huge white text on a red brush banner top-left.  usage (from marion/): python3 tools/make_thumb_fox.py"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W, H = 1280, 720; F = "tools/oswald-latin-700-normal.ttf"
bg = Image.open("youtube/thumb/bg_vidiq_fox.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Contrast(bg).enhance(1.1)
cut = Image.open("youtube/thumb/marion_white_cut.png").convert("RGBA")
face = cut.crop((215, 70, 790, 960))                      # Marion's head + shoulders (no Oscar)
a = face.split()[3]; m = np.array(a); m[:, :25] = (m[:, :25] * np.linspace(0, 1, 25)).astype("uint8"); a = Image.fromarray(m)
hh = int(H * 1.12); ww = int(face.width * hh / face.height)
face = face.resize((ww, hh), Image.LANCZOS); a = a.resize((ww, hh), Image.LANCZOS)
rgb = face.convert("RGB")
rgb = ImageEnhance.Color(rgb).enhance(1.25); rgb = ImageEnhance.Contrast(rgb).enhance(1.22); rgb = ImageEnhance.Brightness(rgb).enhance(1.12)
rgb = rgb.filter(ImageFilter.UnsharpMask(radius=3, percent=140, threshold=2))
face = rgb.convert("RGBA"); face.putalpha(a)
def brush(d, x, y, w, h, rng):
    top = [(x + i, y + int(rng.integers(-7, 8))) for i in range(0, w + 1, 20)]
    bot = [(x + i, y + h + int(rng.integers(-8, 9))) for i in range(w, -1, -20)]
    d.polygon(top + [(x + w + 16, y + h // 2)] + bot + [(x - 12, y + h // 2)], fill=(196, 22, 28))
def make(lines, small, key):
    rng = np.random.default_rng(7)
    im = bg.copy().convert("RGBA")
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)   # darken behind the face (right) so it pops
    for i in range(520): sd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(6, 5, 4, int(200 * (1 - i / 520) ** 1.4)))
    im = Image.alpha_composite(im, sh)
    rim = Image.new("RGBA", face.size, (255, 225, 170, 0)); rim.putalpha(a.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.35)))
    x0 = W - ww + int(ww * 0.04); y0 = H - hh + 30
    im.alpha_composite(rim, (x0 - 4, y0)); im.alpha_composite(face, (x0, y0))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(F, 112 if max(len(l) for l in lines) <= 11 else 92)
    lh = f.size * 1.0; tw = max(d.textlength(l, font=f) for l in lines); bw = int(tw + 70); bh = int(lh * len(lines) + 40)
    bx, by = 40, 34
    brush(d, bx, by, bw, bh, rng)
    for i, l in enumerate(lines):
        d.text((bx + bw / 2, by + 18 + i * lh), l, font=f, fill=(252, 248, 238), anchor="ma", stroke_width=3, stroke_fill=(30, 8, 8))
    if small:
        fs = ImageFont.truetype(F, 30); sw = d.textlength(small, font=fs)
        d.rectangle([bx, by + bh + 22, bx + sw + 30, by + bh + 70], fill=(14, 12, 10)); d.text((bx + 15, by + bh + 27), small, font=fs, fill=(247, 243, 234))
    out = f"youtube/thumb/marion-thumbV3-{key}.jpg"; im.convert("RGB").save(out, quality=94); return out
outs = [make(["UNCATCHABLE"], "FRANCIS MARION · 1780", "A_UNCATCHABLE"),
        make(["CHASED", "7 HOURS"], "FRANCIS MARION · 1780", "B_7_HOURS"),
        make(["NIGHT RAIDER"], "FRANCIS MARION · 1780", "C_NIGHT_RAIDER")]
F2 = ImageFont.truetype(F, 22)
s = Image.new("RGB", (3 * 640 + 80, 560), (24, 22, 20)); d = ImageDraw.Draw(s)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("thumbV3-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 420 - 10)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 420 + 50))
s.save("youtube/thumb/sheet_v3.jpg", quality=92); print(outs)
