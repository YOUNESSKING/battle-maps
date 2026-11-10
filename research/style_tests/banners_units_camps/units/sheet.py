# python3 sheet.py <frames dir> <out.jpg> : contact sheet for the owner (frames from shot.js at t = 0, 3.0, 6)
import sys
from PIL import Image, ImageDraw, ImageFont
D, OUT = sys.argv[1], sys.argv[2]
REF = "/home/user/battle-maps/research/style_tests/banners_units_camps/ref_units.png"
F = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 26)
A, M, B = (Image.open(f"{D}/frame_{t}.png").convert("RGB") for t in ("0", "3", "6"))
W, pad, hdr = 1920, 20, 44
rows = []
def label(img, txt):
    c = Image.new("RGB", (img.width, img.height + hdr), (24, 22, 18)); c.paste(img, (0, hdr))
    ImageDraw.Draw(c).text((10, 8), txt, font=F, fill=(240, 232, 210)); return c
rows.append(label(A, "1  Union corps in COLUMN (single file, XXX), Confederate division LINE (8 blocks, 2 brigades, XX) + skirmish dots, cavalry (dots + slash), batteries (gun), old kit boxes bottom left"))
rows.append(label(B, "2  same corps DEPLOYED in line (blocks slid into place), skirmishers thrown out, name tags only once spoken"))
# row 3: mid-morph crop | ours vs reference at 2x | 480 px downscale (phone)
mid = M.crop((60, 280, 700, 860))
ours = B.crop((700, 320, 900, 620)).resize((400, 600), Image.LANCZOS)
ref = Image.open(REF).convert("RGB").crop((120, 500, 320, 800)).resize((400, 600), Image.LANCZOS)
cmp_ = Image.new("RGB", (820, 600), (24, 22, 18)); cmp_.paste(ours, (0, 0)); cmp_.paste(ref, (420, 0))
oldz = B.crop((90, 920, 300, 1010)).resize((420, 180), Image.LANCZOS)
small = B.resize((480, 270), Image.LANCZOS); smallA = A.resize((480, 270), Image.LANCZOS)
p3 = Image.new("RGB", (W, 600 + hdr), (24, 22, 18)); d = ImageDraw.Draw(p3)
p3.paste(mid.resize((620, 562)), (0, hdr)); d.text((10, 8), "3  mid-deploy (t = 3.0 s)", font=F, fill=(240, 232, 210))
p3.paste(cmp_, (640, hdr)); d.text((650, 8), "4  ours 2x   |   owner reference 2x", font=F, fill=(240, 232, 210))
p3.paste(smallA, (1440, hdr)); p3.paste(small, (1440, hdr + 290)); d.text((1450, 8), "5  480 px (phone)", font=F, fill=(240, 232, 210))
rows.append(p3)
oldrow = Image.new("RGB", (W, 200), (24, 22, 18)); oldrow.paste(oldz, (0, 10)); ImageDraw.Draw(oldrow).text((440, 80), "6  the OLD kit boxes (2x) for comparison: one box per corps, no line, no depth", font=F, fill=(240, 232, 210))
rows.append(oldrow)
H = sum(r.height for r in rows) + pad * (len(rows) - 1)
sheet = Image.new("RGB", (W, H), (12, 11, 9)); y = 0
for r in rows: sheet.paste(r, (0, y)); y += r.height + pad
sheet.save(OUT, quality=88); print(OUT, sheet.size)
