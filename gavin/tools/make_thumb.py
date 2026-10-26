"""Gavin thumbnails (HANDOVER 1b formula + FACE POP rule, STYLE_LOCK 6, 2026-10-26): vidIQ battlefield + Gavin's real PD photo cut-out on the right
third with extra face contrast and a light rim against the map + red brush banner, 1-3 words.
usage (from gavin/): python3 tools/make_thumb.py -> youtube/thumb/gavin-thumb-{A-no-retreat,B-tigers-incoming}.jpg (old ones kept as *-before-facepop.jpg)"""
import os, shutil
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageChops

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
T = "youtube/thumb"
for n in ("gavin-thumb-A-no-retreat", "gavin-thumb-B-tigers-incoming"):
    if not os.path.exists(f"{T}/{n}-before-facepop.jpg"):
        shutil.copy(f"{T}/{n}.jpg", f"{T}/{n}-before-facepop.jpg")
bg = Image.open(f"{T}/bg.png").convert("RGB").resize((W, H), Image.LANCZOS)
cut = Image.open(f"{T}/gavin_cut.png").convert("RGBA"); cut = cut.crop(cut.getbbox())
h = int(H * 1.02); w = int(cut.width * h / cut.height); cut = cut.resize((w, h), Image.LANCZOS)
a = cut.split()[3]
g = cut.convert("L")
g = ImageEnhance.Contrast(g).enhance(1.45)            # FACE POP: stronger contrast
g = ImageEnhance.Brightness(g).enhance(1.10)
g = g.filter(ImageFilter.UnsharpMask(radius=2.2, percent=90, threshold=2))
face = Image.merge("RGBA", (g, g, g, a))
x0 = W - w + int(w * 0.08); y0 = H - h + 10
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(420):
    sd.line([(W - 420 + i, 0), (W - 420 + i, H)], fill=(0, 0, 0, int(150 * i / 420)))
base = bg.convert("RGBA"); base.alpha_composite(shade)
# light rim against the map: a soft white edge glow just outside the silhouette
big = Image.new("L", (W, H), 0); big.paste(a, (x0, y0))
rim = ImageChops.subtract(big.filter(ImageFilter.GaussianBlur(7)), big.filter(ImageFilter.GaussianBlur(1))).point(lambda v: min(255, v * 2))
glow = Image.new("RGBA", (W, H), (255, 245, 225, 0)); glow.putalpha(rim.point(lambda v: int(v * 0.55)))
base.alpha_composite(glow); base.alpha_composite(face, (x0, y0))

def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx, by = 34, H - size - 92
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon([(bx - 10, by + 14), (bx + tw + 60, by - 4), (bx + tw + 74, by + size + 40), (bx + 6, by + size + 54)], fill=(176, 18, 26, 240))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(1.2)))
    dr.text((bx + 26, by + 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(60, 0, 0))
    im.convert("RGB").save(out, quality=92); print(out)

banner("NO RETREAT", f"{T}/gavin-thumb-A-no-retreat.jpg", 118)
banner("TIGERS INCOMING", f"{T}/gavin-thumb-B-tigers-incoming.jpg", 96)
