"""Thumbnail v3 (STYLE_LOCK 0b / HANDOVER 1b + §10, after the first live numbers): vidIQ battlefield (left 2/3) + O.P. Smith's
REAL public-domain photo cut out on the right third + red brush banner bottom-left, 1-3 words, no negation, same promise as
the title "O.P. Smith's Top 3 Legendary Tactical Moves | The Man Who Broke Out of Chosin". Based on rokossovsky/tools/make_thumb.py.
usage (from smith/): python3 tools/make_thumb.py  -> build/thumb/smith-thumb-{A,B}.jpg
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
os.makedirs("build/thumb", exist_ok=True)
bg = Image.open("build/thumb/bg_vidiq.png").convert("RGB").resize((W, H), Image.LANCZOS)
d = ImageDraw.Draw(bg); f = ImageFont.truetype(F, 22)
def tag(t, x, y):  # commander name tags on the map (formula), same style as the vidIQ place labels
    w = d.textlength(t, font=f); d.rectangle([x, y, x + w + 18, y + 32], fill=(18, 16, 12)); d.rectangle([x, y, x + w + 18, y + 32], outline=(201, 180, 138), width=2)
    d.text((x + 9, y + 2), t, font=f, fill=(247, 243, 234))
tag("SMITH", 586, 318); tag("SONG SHILUN", 690, 236)  # Smith on the blue column, Song on the red masses
bg = ImageEnhance.Brightness(bg).enhance(0.92)
cut = Image.open("assets/media/smith_full.png").convert("RGBA")  # rembg cut-out of the PD official portrait
cut = cut.crop(cut.getbbox())
g = ImageEnhance.Contrast(cut.convert("LA").convert("RGBA")).enhance(1.25)
g.putalpha(cut.split()[3])
h = int(H * 1.02); w = int(g.width * h / g.height); g = g.resize((w, h), Image.LANCZOS)
# soften the cut-out's straight left/bottom edges (the photo's own crop) into the background
fade = Image.new("L", (w, h), 255); fd = ImageDraw.Draw(fade)
for i in range(int(w * 0.32)):
    fd.line([(i, 0), (i, h)], fill=int(255 * (i / (w * 0.32)) ** 1.4))
a = g.split()[3]; g.putalpha(Image.composite(a, Image.new("L", (w, h), 0), fade))
x0 = W - w + int(w * 0.06)
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(460):
    sd.line([(W - 460 + i, 0), (W - 460 + i, H)], fill=(0, 0, 0, int(165 * i / 460)))
base = bg.convert("RGBA"); base.alpha_composite(shade); base.alpha_composite(g, (x0, H - h + 10))


def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx, by = 34, H - size - 92
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon([(bx - 10, by + 14), (bx + tw + 60, by - 4), (bx + tw + 74, by + size + 40), (bx + 6, by + size + 54)], fill=(176, 18, 26, 240))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(1.2)))
    dr.text((bx + 26, by + 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(60, 0, 0))
    im.convert("RGB").save(out, quality=92); print(out)


banner("SURROUNDED", "build/thumb/smith-thumb-A-surrounded.jpg", 124)      # type 3 stakes: completes "Broke Out of Chosin"
banner("8 TO 1", "build/thumb/smith-thumb-B-8-to-1.jpg", 150)              # type 3 stakes: 15,000 vs 120,000, zero context needed
