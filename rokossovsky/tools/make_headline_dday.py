import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage
rng = np.random.default_rng(5)
# newspaper-style headline card (designed; no real paper's name)
PW, PH = 2400, 1350
pap = np.full((PH, PW, 3), (214, 203, 176), np.float32) + rng.normal(0, 7, (PH, PW, 1)) + ndimage.gaussian_filter(rng.normal(0, 25, (PH, PW)), 40)[..., None]
yy, xx = np.mgrid[0:PH, 0:PW]; v = 1 - 0.35 * (((xx - PW / 2) / (PW / 2)) ** 2 + ((yy - PH / 2) / (PH / 2)) ** 2); pap *= v[..., None]
im = Image.fromarray(pap.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
SB = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"; SR = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
ink = (28, 24, 20)
d.line((260, 200, PW - 260, 200), fill=ink, width=6); d.line((260, 214, PW - 260, 214), fill=ink, width=2)
d.text((PW / 2, 160), "SPECIAL WAR EDITION  ·  TUESDAY, JUNE 6, 1944", font=ImageFont.truetype(SR, 44), fill=ink, anchor="mm")
for i, line in enumerate(["ALLIES INVADE", "FRANCE"]):
    d.text((PW / 2, 360 + i * 185), line, font=ImageFont.truetype(SB, 165), fill=ink, anchor="mm")
d.text((PW / 2, 730), "Paratroops dropped behind the coast in the night", font=ImageFont.truetype(SR, 54), fill=ink, anchor="mm")
d.line((260, 800, PW - 260, 800), fill=ink, width=3)
for col in range(4):  # unreadable body columns
    x0 = 260 + col * (PW - 520) / 4 + 20
    for k in range(12):
        w = (PW - 520) / 4 - 60 - (rng.random() * 120 if k % 5 == 4 else 0)
        d.rectangle((x0, 840 + k * 32, x0 + w, 840 + k * 32 + 12), fill=(70, 62, 52))
im = im.filter(ImageFilter.GaussianBlur(1.2))
a = np.asarray(im, np.float32); a = a * np.array([0.86, 0.98, 1.02])  # teal grade like the reference
Image.fromarray(a.clip(0, 255).astype(np.uint8)).save("assets/media/headline_dday.jpg", quality=92)
print("headline ok")
