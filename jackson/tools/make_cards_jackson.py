"""Designed archive cards for the Jackson video (our own artwork): date cards (headline style), quote cards, wide portraits.
run from jackson/:  python3 tools/make_cards_jackson.py"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
sys.path.insert(0, "tools")
from archive_shots import headline_layer
M = "assets/media/"; W, H = 1920, 1080
OS = "tools/oswald-latin-700-normal.ttf"; SE = "tools/special-elite-latin-400-normal.ttf"

def cover(src, fy=0.35):
    im = Image.open(src).convert("RGB"); k = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    x0 = (im.width - W) // 2; y0 = int(min(max(im.height * fy - H / 2, 0), im.height - H)); return im.crop((x0, y0, x0 + W, y0 + H))

def wide(src, out, fx=0.5):
    """portrait at full height over a blurred, darkened copy of itself"""
    im = Image.open(src).convert("RGB"); bg = cover(src, 0.33).filter(ImageFilter.GaussianBlur(40))
    bg = Image.fromarray((np.asarray(bg, np.float32) * 0.45).astype(np.uint8))
    w = int(im.width * H / im.height); fg = im.resize((w, H), Image.LANCZOS); bg.paste(fg, (int(W * fx - w / 2), 0)); bg.save(out, quality=93)

def datecard(photo, year, text, out):
    a = np.asarray(cover(photo), np.float32) * 0.5; im = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
    Image.alpha_composite(im, headline_layer(year, text, W, H)).convert("RGB").save(out, quality=92)

def quotecard(photo, lines, credit, out, fx=0.78):
    """dark blurred photo plate, the speaker's photo on the right, the verbatim quote in a typewriter face, credit line in gold"""
    im = Image.open(photo).convert("RGB"); bg = cover(photo).filter(ImageFilter.GaussianBlur(30))
    bg = Image.fromarray((np.asarray(bg, np.float32) * 0.28).astype(np.uint8)); fh = int(H * 0.9)
    w = int(im.width * fh / im.height); fg = im.resize((w, fh), Image.LANCZOS)
    fade = np.linspace(0, 1, w)[None, :].repeat(fh, 0); fade = np.clip(fade * 3, 0, 1) * 0.85
    bg.paste(fg, (int(W * fx - w / 2), (H - fh) // 2), Image.fromarray((fade * 255).astype(np.uint8)))
    d = ImageDraw.Draw(bg); f = ImageFont.truetype(SE, 64); y = 300
    for i, l in enumerate(lines):
        d.text((140, y), l, font=f, fill=(247, 243, 234)); y += 92
    d.line((140, y + 30, 520, y + 30), fill=(201, 180, 138), width=4)
    d.text((140, y + 50), credit, font=ImageFont.truetype(OS, 40), fill=(201, 180, 138)); bg.save(out, quality=93)

wide(M + "jackson_src.jpg", M + "jackson_wide.jpg")
datecard(M + "archive_jackson_portrait1864.jpg", "1824", "CLARKSBURG, VIRGINIA", M + "card_1824_clarksburg.jpg")
datecard(M + "archive_jackson_stereo_l.jpg", "1851", "LEXINGTON, VIRGINIA", M + "card_1851_lexington.jpg")
datecard(M + "archive_guinea_house.jpg", "10 MAY 1863", "GUINEA STATION, VIRGINIA", M + "card_1863_guinea.jpg")
quotecard(M + "lee_crop.jpg", ["“He has lost his left arm;", "but I have lost my right arm.”"],
          "ROBERT E. LEE, AS REPORTED BY JACKSON'S CHAPLAIN", M + "quote_lee_rightarm.jpg")
quotecard(M + "jackson_src.jpg", ["“Let us cross over the river,", "and rest under the shade", "of the trees.”"],
          "JACKSON'S LAST WORDS, RECORDED BY DR. HUNTER McGUIRE", M + "quote_jackson_lastwords.jpg")
print("cards ok")
