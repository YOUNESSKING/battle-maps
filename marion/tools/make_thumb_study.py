"""Thumbnail test set from research/competitors_top20/SUMMARY.md ('What this means for us' item 1):
B = our own map frame, ONE named place big + ONE arrow (HistoryMarche 'HATTIN, 1187' / Eastory pattern);
C = archive picture with NO text and ONE circled detail (Dark Docs / Felton pattern). A = the close-up face set (make_thumb_face.py).
usage: python3 tools/make_thumb_study.py RING_FRAME.png"""
import sys, math
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
W, H = 1280, 720; F = "tools/oswald-latin-700-normal.ttf"
# ---- B: map + place name + one arrow
fr = Image.open(sys.argv[1]).convert("RGB").crop((260, 236, 260 + 1500, 236 + 844)).resize((W, H), Image.LANCZOS)
fr = ImageEnhance.Contrast(ImageEnhance.Color(fr).enhance(1.15)).enhance(1.1).convert("RGBA")
ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
for i in range(170): d.line([(0, i), (W, i)], fill=(0, 0, 0, int(150 * (1 - i / 170))))      # dark top band for the title
fr = Image.alpha_composite(fr, ov)
# one big white arrow sweeping round the south of the town (the ring closing)
arr = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); a = ImageDraw.Draw(arr)
cx, cy, rx, ry = 1180, 560, 840, 690; pts = [(cx + rx * math.cos(math.radians(t)), cy + ry * math.sin(math.radians(t))) for t in range(165, 52, -2)]
a.line(pts, fill=(255, 255, 255, 240), width=58, joint="curve")
x1, y1 = pts[-1]; x0, y0 = pts[-4]; ang = math.atan2(y1 - y0, x1 - x0)
tip = (x1 + 95 * math.cos(ang), y1 + 95 * math.sin(ang)); l = (x1 + 70 * math.cos(ang + 1.9), y1 + 70 * math.sin(ang + 1.9)); r = (x1 + 70 * math.cos(ang - 1.9), y1 + 70 * math.sin(ang - 1.9))
a.polygon([tip, l, r], fill=(255, 255, 255, 240))
arr = arr.resize((W, H), Image.LANCZOS)
sh = arr.copy(); sh.putalpha(arr.split()[3].filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.55))); sh = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), Image.new("RGBA", (W, H), (0, 0, 0, 0)), sh.split()[3])
fr.alpha_composite(sh, (4, 6)); fr.alpha_composite(arr)
d = ImageDraw.Draw(fr); f = ImageFont.truetype(F, 112)
d.text((W / 2, 22), "YORKTOWN, 1781", font=f, fill=(255, 255, 255), anchor="ma", stroke_width=6, stroke_fill=(10, 8, 6))
fs = ImageFont.truetype(F, 44); t = "THE TRAP"; tw = d.textlength(t, font=fs)
d.rectangle([W / 2 - tw / 2 - 22, 158, W / 2 + tw / 2 + 22, 214], fill=(196, 22, 28)); d.text((W / 2, 160), t, font=fs, fill=(255, 255, 255), anchor="ma")
fr.convert("RGB").save("youtube/thumb/yorktown-thumbS-B_MAP.jpg", quality=94)
# ---- C: Trumbull, no text, one red circle on the British officer who surrendered the sword (Cornwallis stayed away)
tr = Image.open("assets/archive/trumbull_surrender.jpg").convert("RGB").crop((520, 340, 1820, 1071)).resize((W, H), Image.LANCZOS)
tr = ImageEnhance.Contrast(ImageEnhance.Color(tr).enhance(1.1)).enhance(1.12).convert("RGBA")
c = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); cd = ImageDraw.Draw(c)
ox, oy, R = 2 * 268, 2 * 470, 2 * 150
cd.ellipse([ox - R, oy - R * 1.25, ox + R, oy + R * 1.25], outline=(225, 20, 28, 255), width=22)
c = c.resize((W, H), Image.LANCZOS); tr.alpha_composite(c)
tr.convert("RGB").save("youtube/thumb/yorktown-thumbS-C_CIRCLE.jpg", quality=94)
print("ok")
