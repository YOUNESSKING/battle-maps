"""F2 (owner 2026-11-13): F (Epic History cream/red template) + D's idea on its map: Yorktown highlighted and big blue block arrows closing on it
(3 from the land, 1 from the sea = the French fleet). -> youtube/thumb/yorktown-thumb7-F2.jpg + thumb7_F2_vs_refs.jpg"""
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1280, 720; O = "tools/oswald-latin-700-normal.ttf"
F = Image.open("youtube/thumb/bg_vidiq_F_epic.jpg").convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")
T = (490, 592)   # the red Yorktown peninsula on the vidIQ map
# highlight: glow + outline round the red peninsula
hl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
hd.ellipse([T[0] - 92, T[1] - 40, T[0] + 92, T[1] + 40], outline=(225, 20, 28, 255), width=7)
g = hl.filter(ImageFilter.GaussianBlur(5)); F.alpha_composite(g); F.alpha_composite(hl)
def block_arrow(im, p0, p1, w=46, head=74, col=(32, 92, 230)):
    big = Image.new("RGBA", (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(big)
    x0, y0 = 2 * p0[0], 2 * p0[1]; x1, y1 = 2 * p1[0], 2 * p1[1]
    a = math.atan2(y1 - y0, x1 - x0); ca, sa = math.cos(a), math.sin(a); nx, ny = -sa, ca
    hb = (x1 - 2 * head * ca, y1 - 2 * head * sa)
    poly = [(x0 + nx * w, y0 + ny * w), (hb[0] + nx * w, hb[1] + ny * w), (hb[0] + nx * 2.1 * w, hb[1] + ny * 2.1 * w), (x1, y1),
            (hb[0] - nx * 2.1 * w, hb[1] - ny * 2.1 * w), (hb[0] - nx * w, hb[1] - ny * w), (x0 - nx * w, y0 - ny * w)]
    d.polygon(poly, fill=col + (245,), outline=(10, 30, 90, 255), width=8)
    big = big.resize((W, H), Image.LANCZOS)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sh.putalpha(big.split()[3].filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.45)))
    im.alpha_composite(sh, (5, 7)); im.alpha_composite(big)
for p0, p1 in [((170, 480), (398, 570)), ((215, 690), (412, 628)), ((540, 700), (508, 645)), ((700, 528), (588, 578))]:
    block_arrow(F, p0, p1)
d = ImageDraw.Draw(F)
d.text((40, 6), "YORKTOWN", font=ImageFont.truetype(O, 190), fill=(18, 16, 14))
d.rectangle([44, 238, 240, 290], fill=(18, 16, 14)); d.text((142, 264), "1781", font=ImageFont.truetype(O, 40), fill=(245, 240, 228), anchor="mm")
d.rectangle([262, 232, 560, 296], fill=(200, 24, 30)); d.text((411, 264), "THE TRAP", font=ImageFont.truetype(O, 48), fill=(255, 255, 255), anchor="mm")
F.convert("RGB").save("youtube/thumb/yorktown-thumb7-F2.jpg", quality=94)
F2 = ImageFont.truetype(O, 24)
s = Image.new("RGB", (3 * 640 + 2 * 20 + 40, 360 + 40 + 94 + 70), (24, 22, 20)); d = ImageDraw.Draw(s)
for k, (f, lab) in enumerate([("youtube/thumb/yorktown-thumb7-F2.jpg", "F2 (new): F + D's arrows on the map"), ("youtube/thumb/ref_F_epichistory.jpg", "ref F: Epic History 'Alexander' (29.3M)"), ("youtube/thumb/ref_D_eastory.jpg", "ref D: Eastory 'Eastern Front 1944/45' (10.3M)")]):
    im = Image.open(f).convert("RGB"); x = 20 + k * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 8), lab, font=F2, fill=(235, 225, 205))
    s.paste(im.resize((168, 94), Image.LANCZOS), (x, 420)); d.text((x + 180, 455), "feed size 168x94", font=F2, fill=(170, 160, 140))
s.save("youtube/thumb/thumb7_F2_vs_refs.jpg", quality=92); print("ok")
