"""Thumbnail (HANDOVER 1b formula): vidIQ battlefield (left 2/3, labels redone with correct geography) + Rokossovsky's PD photo
cut out on the right third + red brush banner bottom-left. usage: python3 tools/make_thumb.py -> youtube/thumb/rokossovsky-thumb-{A,B}.jpg"""
import io
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
from rembg import remove

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
bg = Image.open("youtube/thumb/bg_vidiq.png").convert("RGB").resize((W, H), Image.LANCZOS)
# hide the generated labels (Parichi is placed wrongly) by blurring their boxes, then add correct small labels
for box in [(380, 122, 462, 156), (818, 120, 914, 154), (686, 212, 780, 246), (852, 388, 940, 420)]:
    x0, y0, x1, y1 = box; src_box = (x0, y0 + 46, x1, y1 + 46)  # cover with the terrain just below (no blur box)
    bg.paste(bg.crop(src_box).filter(ImageFilter.GaussianBlur(1.2)), box)
d = ImageDraw.Draw(bg); f = ImageFont.truetype(F, 22)
def tag(t, x, y):
    w = d.textlength(t, font=f); d.rectangle([x, y, x + w + 18, y + 32], fill=(18, 16, 12)); d.rectangle([x, y, x + w + 18, y + 32], outline=(201, 180, 138), width=2)
    d.text((x + 9, y + 2), t, font=f, fill=(247, 243, 234))
tag("BOBRUISK", 686, 212); tag("PARICHI", 556, 448)
# right third: darken, then the photo cut-out (grayscale, contrast), looking toward the map
bg = ImageEnhance.Brightness(bg).enhance(0.92)
src = Image.open("assets/media/rokossovsky_src.jpg").convert("RGB")
cut = remove(src)  # RGBA
cut = cut.crop(cut.getbbox())
g = ImageEnhance.Contrast(cut.convert("LA").convert("RGBA")).enhance(1.25)
g.putalpha(cut.split()[3])
h = int(H * 1.02); w = int(g.width * h / g.height); g = g.resize((w, h), Image.LANCZOS)
x0 = W - w + int(w * 0.08)
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(420):
    sd.line([(W - 420 + i, 0), (W - 420 + i, H)], fill=(0, 0, 0, int(150 * i / 420)))
base = bg.convert("RGBA"); base.alpha_composite(shade); base.alpha_composite(g, (x0, H - h + 10))

def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx, by = 34, H - size - 92
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon([(bx - 10, by + 14), (bx + tw + 60, by - 4), (bx + tw + 74, by + size + 40), (bx + 6, by + size + 54)], fill=(176, 18, 26, 240))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(1.2)))
    dr.text((bx + 26, by + 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(60, 0, 0))
    im.convert("RGB").save(out, quality=92); print(out)

banner("IMPASSABLE", "youtube/thumb/rokossovsky-thumb-A-impassable.jpg", 118)
banner("TWO BLOWS", "youtube/thumb/rokossovsky-thumb-B-two-blows.jpg", 128)
