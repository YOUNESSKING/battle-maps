"""Designed newspaper / letter headline cards for the Greene remake (no real masthead). -> assets/media/headline_<id>.jpg"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage
SB = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"; SR = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
CARDS = {
    "greene": ("CAROLINA INTELLIGENCE  ·  DECEMBER 1780", ["GREENE TO COMMAND", "IN THE SOUTH"], "General Washington's choice takes over the remnant of the Southern army at Charlotte"),
    "ohara": ("GEN. CHARLES O'HARA  ·  LETTER  ·  1781", ["“THE MOST BARREN,", "INHOSPITABLE, UNHEALTHY PART", "OF NORTH AMERICA”"], "The British army after the race to the Dan, in the words of one of its own generals"),
    "fox": ("HOUSE OF COMMONS  ·  1781", ["“ANOTHER SUCH VICTORY", "WOULD RUIN THE BRITISH ARMY”"], "Charles James Fox on the news from Guilford Courthouse"),
    "fight": ("NATHANAEL GREENE  ·  TO THE CHEVALIER DE LA LUZERNE  ·  1781", ["“WE FIGHT, GET BEAT,", "RISE, AND FIGHT AGAIN”"], "Greene's own summary of his southern campaign"),
}
PW, PH = 2400, 1350
for key, (top, lines, sub) in CARDS.items():
    rng = np.random.default_rng(len(key) * 7)
    pap = np.full((PH, PW, 3), (214, 203, 176), np.float32) + rng.normal(0, 7, (PH, PW, 1)) + ndimage.gaussian_filter(rng.normal(0, 25, (PH, PW)), 40)[..., None]
    yy, xx = np.mgrid[0:PH, 0:PW]; v = 1 - 0.35 * (((xx - PW / 2) / (PW / 2)) ** 2 + ((yy - PH / 2) / (PH / 2)) ** 2); pap *= v[..., None]
    im = Image.fromarray(pap.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(im); ink = (28, 24, 20)
    d.line((260, 200, PW - 260, 200), fill=ink, width=6); d.line((260, 214, PW - 260, 214), fill=ink, width=2)
    d.text((PW / 2, 160), top, font=ImageFont.truetype(SR, 44), fill=ink, anchor="mm")
    fs = 165 if len(lines) == 2 else 130; step = fs * 1.12
    for i, line in enumerate(lines):
        f = ImageFont.truetype(SB, fs)
        while d.textlength(line, font=f) > PW - 480: f = ImageFont.truetype(SB, f.size - 6)
        d.text((PW / 2, 330 + i * step), line, font=f, fill=ink, anchor="mm")
    y = 330 + len(lines) * step + 10
    d.text((PW / 2, y), sub, font=ImageFont.truetype(SR, 50), fill=ink, anchor="mm")
    d.line((260, y + 70, PW - 260, y + 70), fill=ink, width=3)
    for col in range(4):
        x0 = 260 + col * (PW - 520) / 4 + 20
        for k in range(int((PH - y - 140) / 32)):
            w = (PW - 520) / 4 - 60 - (rng.random() * 120 if k % 5 == 4 else 0)
            d.rectangle((x0, y + 110 + k * 32, x0 + w, y + 110 + k * 32 + 12), fill=(70, 62, 52))
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    a = np.asarray(im, np.float32) * np.array([0.86, 0.98, 1.02])
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(f"assets/media/headline_{key}.jpg", quality=92)
    print("ok", key)
