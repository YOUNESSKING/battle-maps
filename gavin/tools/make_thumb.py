"""SUPERSEDED (owner 2026-10-26: the portrait must be in COLOUR and the thumbnail generated whole by vidIQ; the final Gavin thumbnails are bg_vidiq_full_A/B.png). Kept only as the old composing approach.
Gavin thumbnails, Tactical Genius formula (HANDOVER 1b + face pop STYLE_LOCK 6), redone 2026-10-26 after the owner rejected the first version:
vidIQ battlefield (dark aerial, Waal crossing = the hook scene = the title promise) on the left 2/3, Gavin's REAL PD photo cut out on the right third
(fades into the dark edge, NO glow; a mild face pop: contrast + a thin faint rim), rough red brush-stroke banner bottom-left, 1-3 words.
Wrong/ambiguous AI labels are inpainted; the AI 'GAVIN' tag portrait is replaced by the real photo (never a fake likeness).
usage (from gavin/): python3 tools/make_thumb.py -> youtube/thumb/gavin-thumb-A-cross-the-river.jpg, gavin-thumb-B-in-broad-daylight.jpg"""
import random
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageChops

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
T = "youtube/thumb"
bg = Image.open(f"{T}/bg_vidiq_nijmegen.png").convert("RGB").resize((W, H), Image.LANCZOS)

# 1) remove the ambiguous 'RAILWAY BRIDGE' label + its pointer (the picture shows one bridge; the other label, ROAD BRIDGE, stays): paste clean grass
#    from just above / beside it (exact box measured on the grid: label x 440-562, y 46-73; pointer x 518-542, y 72-90)
def patch(box_dst, box_src, feather=2):
    w, h = box_dst[2] - box_dst[0], box_dst[3] - box_dst[1]
    src = bg.crop(box_src); m = Image.new("L", (w, h), 0); ImageDraw.Draw(m).rectangle([feather, feather, w - feather - 1, h - feather - 1], fill=255)
    bg.paste(src, box_dst[:2], m.filter(ImageFilter.GaussianBlur(feather)))
patch((430, 38, 574, 80), (430, 0, 574, 42), feather=5)
patch((516, 74, 546, 90), (480, 74, 510, 90), feather=3)
# 2) replace the AI portrait on the GAVIN map tag with the real photo
head = Image.open("assets/media/gavin_head.png").convert("RGBA"); head = head.crop(head.getbbox())
sq = min(head.size); head = head.crop(((head.width - sq) // 2, 0, (head.width - sq) // 2 + sq, sq)).resize((50, 54), Image.LANCZOS)
d0 = ImageDraw.Draw(bg); d0.rectangle([591, 566, 641, 622], fill=(20, 22, 26)); bg.paste(head.convert("RGB"), (592, 567))
d0.rectangle([590, 565, 642, 623], outline=(235, 235, 230), width=2)

# 3) the real photo cut-out, right third
cut = Image.open(f"{T}/gavin_cut.png").convert("RGBA"); cut = cut.crop(cut.getbbox())
h = int(H * 1.0); w = int(cut.width * h / cut.height)
if w > int(W * 0.40): w = int(W * 0.40); h = int(cut.height * w / cut.width)
cut = cut.resize((w, h), Image.LANCZOS); a = cut.split()[3]
g = cut.convert("L"); g = ImageEnhance.Contrast(g).enhance(1.22); g = ImageEnhance.Brightness(g).enhance(1.04)
g = g.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=3))
face = Image.merge("RGBA", (g, g, g, a))
x0 = W - w + int(w * 0.06); y0 = H - h + 4
base = bg.convert("RGBA")
# darken the right third so the portrait sits in smoke, like the TG / Rokossovsky thumbnails
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(470):
    sd.line([(W - 470 + i, 0), (W - 470 + i, H)], fill=(4, 5, 8, int(190 * (i / 470) ** 1.2)))
base.alpha_composite(shade)
big = Image.new("L", (W, H), 0); big.paste(a, (x0, y0))
rim = ImageChops.subtract(big.filter(ImageFilter.GaussianBlur(3)), big).point(lambda v: min(255, v * 3))   # thin faint rim only
glow = Image.new("RGBA", (W, H), (235, 230, 220, 0)); glow.putalpha(rim.point(lambda v: int(v * 0.22)))
base.alpha_composite(glow); base.alpha_composite(face, (x0, y0))

# 4) rough red brush-stroke banner (torn edges), big white condensed text
def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx, by = 22, H - size - 78; rnd = random.Random(7)
    x1, y1, y2 = bx + tw + 96, by + 6, by + size + 52
    pts_top = [(bx + i * (x1 - bx) / 40, y1 - 6 + rnd.uniform(-9, 9)) for i in range(41)]
    pts_bot = [(x1 - i * (x1 - bx) / 40 + rnd.uniform(-6, 6), y2 + rnd.uniform(-10, 10)) for i in range(41)]
    left = [(bx - 10 + rnd.uniform(-6, 6), y1 + (y2 - y1) * k / 8) for k in range(8, -1, -1)]
    right = [(x1 + 12 + rnd.uniform(-10, 10), y1 + (y2 - y1) * k / 8) for k in range(9)]
    poly = pts_top + right + pts_bot + left
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush); bd.polygon(poly, fill=(186, 16, 24, 252))
    for _ in range(26):   # dry-brush streaks
        yy = rnd.uniform(y1, y2); xa = rnd.uniform(bx, x1 - 80)
        bd.line([(xa, yy), (xa + rnd.uniform(60, 220), yy + rnd.uniform(-2, 2))], fill=(222, 38, 44, 120), width=rnd.randint(1, 3))
    shadow = brush.filter(ImageFilter.GaussianBlur(9)); sa = shadow.split()[3].point(lambda v: int(v * 0.55))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.putalpha(sa); im.alpha_composite(sh, (4, 6)); im.alpha_composite(brush)
    dr = ImageDraw.Draw(im)
    dr.text((bx + 34, by - 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(70, 0, 4))
    im.convert("RGB").save(out, quality=93); print(out)

banner("CROSS THE RIVER", f"{T}/gavin-thumb-A-cross-the-river.jpg", 122)
banner("IN BROAD DAYLIGHT", f"{T}/gavin-thumb-B-in-broad-daylight.jpg", 104)
