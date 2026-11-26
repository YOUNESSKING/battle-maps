#!/usr/bin/env python3
# sheet.py <tag> <out.jpg> <col1> <col2> ...   col = "lineblocks" (base dir /tmp/tbx/LB_<tag>) or variant letter
import sys
from PIL import Image, ImageDraw, ImageFont
tag, out, cols = sys.argv[1], sys.argv[2], sys.argv[3:]
NAMES = {"lineblocks": "v14 lineblocks (approved motion)", "A": "A raised enamel counter", "B": "B bevelled slab, gold frame, pennant", "C": "C thin tile, strong drop shadow"}
ROWS = [("S09", "59.5", "S09 59.5 s lines + smoke"), ("S09", "65", "S09 65.0 s line advancing"), ("S09", "86.2", "S09 86.2 s on the march"),
        ("S09", "103.5", "S09 103.5 s crest fight"), ("S10", "28.5", "S10 28.5 s rout over the bridge")]
ZOOM = [("S09", "59.5", (330, 340, 650, 520), "2x S09 59.5 s"), ("S10", "25", (440, 250, 760, 430), "2x S10 25 s bridge"), ("S10", "22", (560, 340, 880, 520), "2x S10 22 s counter")]
def src(c, scn, t):
    d = f"/tmp/tbx/{'LB' if c == 'lineblocks' else c}_{tag}_{scn}"
    import glob
    f = glob.glob(f"{d}/frame-*-at-{t}s.png")
    return Image.open(f[0]).convert("RGB")
TW = min(600, 2400 // len(cols)); TH = round(TW * 9 / 16)
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
rows = ROWS + [(s, t, None, l) for s, t, b, l in []]
sheet = Image.new("RGB", (TW * len(cols), TH * (len(ROWS) + len(ZOOM))), "black")
d = ImageDraw.Draw(sheet)
def lab(x, y, s):
    w = d.textlength(s, font=font); d.rectangle((x, y, x + w + 8, y + 20), fill=(0, 0, 0)); d.text((x + 4, y + 1), s, font=font, fill=(255, 230, 160))
for ci, c in enumerate(cols):
    for ri, (scn, t, l) in enumerate(ROWS):
        im = src(c, scn, t).resize((TW, TH), Image.LANCZOS); sheet.paste(im, (ci * TW, ri * TH)); lab(ci * TW, ri * TH, f"{NAMES[c].split(' (')[0][:22]} | {l}")
    for zi, (scn, t, box, l) in enumerate(ZOOM):
        im = src(c, scn, t).crop(box).resize((TW, TH), Image.LANCZOS); y = (len(ROWS) + zi) * TH; sheet.paste(im, (ci * TW, y)); lab(ci * TW, y, f"{NAMES[c][:30]} | {l}")
sheet.save(out, quality=85); print(out, sheet.size)
