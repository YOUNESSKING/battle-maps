"""Designed archive cards for the Peng video (our own artwork, no real masthead): 2 newspaper-style headline cards + 4 date cards.
run from peng/:  python3 tools/make_cards_peng.py"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage
sys.path.insert(0, "tools")
from archive_shots import headline_layer
rng = np.random.default_rng(7)
PW, PH = 2400, 1350
SB = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"; SR = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
ink = (28, 24, 20)

def newspaper(lines, top, sub, out):
    pap = np.full((PH, PW, 3), (214, 203, 176), np.float32) + rng.normal(0, 7, (PH, PW, 1)) + ndimage.gaussian_filter(rng.normal(0, 25, (PH, PW)), 40)[..., None]
    yy, xx = np.mgrid[0:PH, 0:PW]; v = 1 - 0.35 * (((xx - PW / 2) / (PW / 2)) ** 2 + ((yy - PH / 2) / (PH / 2)) ** 2); pap *= v[..., None]
    im = Image.fromarray(pap.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.line((260, 200, PW - 260, 200), fill=ink, width=6); d.line((260, 214, PW - 260, 214), fill=ink, width=2)
    d.text((PW / 2, 160), top, font=ImageFont.truetype(SR, 44), fill=ink, anchor="mm")
    for i, line in enumerate(lines):
        d.text((PW / 2, 360 + i * 185), line, font=ImageFont.truetype(SB, 165), fill=ink, anchor="mm")
    d.text((PW / 2, 730), sub, font=ImageFont.truetype(SR, 54), fill=ink, anchor="mm")
    d.line((260, 800, PW - 260, 800), fill=ink, width=3)
    for col in range(4):
        x0 = 260 + col * (PW - 520) / 4 + 20
        for k in range(12):
            w = (PW - 520) / 4 - 60 - (rng.random() * 120 if k % 5 == 4 else 0)
            d.rectangle((x0, 840 + k * 32, x0 + w, 840 + k * 32 + 12), fill=(70, 62, 52))
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    a = np.asarray(im, np.float32) * np.array([0.86, 0.98, 1.02])
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(out, quality=92)

def datecard(photo, year, text, out, box=None):
    im = Image.open(photo).convert("RGB")
    W, H = 1920, 1080
    k = max(W / im.width, H / im.height); im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    x0 = (im.width - W) // 2; y0 = int(min(max(im.height * 0.35 - H / 2, 0), im.height - H))
    im = im.crop((x0, y0, x0 + W, y0 + H))
    a = np.asarray(im, np.float32) * 0.5; im = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
    im = Image.alpha_composite(im, headline_layer(year, text, W, H)).convert("RGB")
    im.save(out, quality=92)

M = "assets/media/"

def wide(src, out, W=1920, H=1080, fx=0.5):
    """portrait photo centred (fx) at full height over a blurred, darkened copy of itself: 16:9 without a face-band crop"""
    im = Image.open(src).convert("RGB")
    k = max(W / im.width, H / im.height); bg = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 3, (bg.width - W) // 2 + W, (bg.height - H) // 3 + H)).filter(ImageFilter.GaussianBlur(40))
    bg = Image.fromarray((np.asarray(bg, np.float32) * 0.45).astype(np.uint8))
    h = H; w = int(im.width * h / im.height); fg = im.resize((w, h), Image.LANCZOS)
    bg.paste(fg, (int(W * fx - w / 2), 0)); bg.save(out, quality=93)

wide(M + "peng_src.jpg", M + "peng_wide.jpg")
wide(M + "peng_src.jpg", M + "peng_wide_right.jpg", fx=0.72)
newspaper(["CHINESE ARMIES", "CROSS THE YALU"], "THE KOREAN WAR  ·  WAR EDITION  ·  OCTOBER 1950", "Some two hundred thousand men march into Korea by night", M + "headline_peng.jpg")
newspaper(["PENG WRITES", "TO MAO"], "LUSHAN CONFERENCE  ·  JULY 1959", "A private letter on the Great Leap Forward", M + "headline_lushan.jpg")
datecard(M + "peng37_src.jpg", "1928", "HUNAN, CHINA", M + "card_1928_hunan.jpg")
datecard(M + "peng_wide_right.jpg", "1959", "LUSHAN", M + "card_1959_lushan.jpg")
datecard(M + "peng_wide_right.jpg", "1966", "RED GUARDS", M + "card_1966_redguards.jpg")
datecard(M + "peng_wide_right.jpg", "1974", "BEIJING", M + "card_1974_beijing.jpg")
print("cards ok")
