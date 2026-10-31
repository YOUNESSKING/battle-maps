"""Repaint the garbled map labels on a vidIQ thumbnail: python3 tools/make_thumb_labels.py IN.png OUT.jpg
Boxes are (x0,y0,x1,y1) of the AI's labels in the 1280x720 image; each is painted over with the label plate colour and re-lettered."""
import sys
from PIL import Image, ImageDraw, ImageFont
im = Image.open(sys.argv[1]).convert("RGB"); d = ImageDraw.Draw(im)
F = ImageFont.truetype("/home/user/battle-maps/patton/tools/oswald-latin-700-normal.ttf", 12)
LAB = [((176, 32, 250, 54), "TO CHATTANOOGA"), ((458, 14, 544, 40), "EAST CHICKAMAUGA CREEK"), ((24, 346, 112, 368), "TO CHATTANOOGA"), ((606, 304, 682, 324), "RINGGOLD GAP")]
for (x0, y0, x1, y1), t in LAB:
    d.rectangle((x0, y0, x1, y1), fill=(196, 184, 160), outline=(60, 54, 44))
    w = d.textlength(t, font=F)
    if w > x1 - x0 - 4: f = ImageFont.truetype(F.path, int(12 * (x1 - x0 - 6) / w))
    else: f = F
    d.text(((x0 + x1) / 2, (y0 + y1) / 2), t, font=f, fill=(40, 34, 26), anchor="mm")
im.save(sys.argv[2], quality=95)
