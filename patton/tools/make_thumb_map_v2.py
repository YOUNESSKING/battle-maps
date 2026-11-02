"""Map thumbnail (owner 2026-11-02): the WHOLE move on our own accurate Ardennes map: Third Army starts facing EAST at the Saar, swings north
through Arlon and breaks the red ring at Bastogne. + the vidIQ Patton portrait (collar clean, 3 helmet stars) + red banner.
usage: python3 tools/make_thumb_map_v2.py [BANNER TEXT] [OUT.jpg]"""
import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
BAN = sys.argv[1] if len(sys.argv) > 1 else "BROKE THE SIEGE"
OUT = sys.argv[2] if len(sys.argv) > 2 else "youtube/thumb/patton-thumb-MAP2-broke-the-siege.jpg"
F = "tools/oswald-latin-700-normal.ttf"
Z, ORG, S = 9, (66098, 43528), 2           # ardennes_hd_lift: z9, origin world px, hd scale 2 (5760 x 3240)
def wpx(lat, lon):
    n = 256 * 2 ** Z
    x = (lon + 180) / 360 * n; y = (0.5 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / (2 * math.pi)) * n
    return ((x - ORG[0]) * S, (y - ORG[1]) * S)
SS = 2; W, H = 1280 * SS, 720 * SS
# crop box in the 5760 map: centre on (49.62N, 5.95E), width 3.4 deg lon
c = wpx(49.60, 6.45); cw = 3.5 * 256 * 2 ** Z / 360 * S; ch = cw * 9 / 16
box = (c[0] - cw / 2, c[1] - ch / 2, c[0] + cw / 2, c[1] + ch / 2)
relief = Image.open("assets/media/pc_ard_relief.jpg").convert("RGB")
ctl = Image.open("assets/media/m2b_ard_ctl_dec19_mx.png").convert("RGBA").resize(relief.size, Image.LANCZOS)
base = ImageChops.multiply(relief, Image.alpha_composite(Image.new("RGBA", relief.size, (255, 255, 255, 255)), ctl).convert("RGB"))
im = base.crop(tuple(int(v) for v in box)).resize((W, H), Image.LANCZOS)
from PIL import ImageEnhance
im = ImageEnhance.Brightness(im).enhance(0.85); im = ImageEnhance.Contrast(im).enhance(1.12)
def P(lat, lon):
    x, y = wpx(lat, lon); return ((x - box[0]) / (box[2] - box[0]) * W, (y - box[1]) / (box[3] - box[1]) * H)
# vignette
v = Image.new("L", (W, H), 0); vd = ImageDraw.Draw(v); vd.ellipse((-W * .25, -H * .35, W * 1.25, H * 1.35), fill=255); v = v.filter(ImageFilter.GaussianBlur(160))
im = ImageChops.multiply(im, Image.merge("RGB", [ImageChops.add(v.point(lambda p: int(p * .55)), Image.new("L", (W, H), 115))] * 3))
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); top = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow); td = ImageDraw.Draw(top)
def bez(pts, n=60):
    out = []
    for k in range(n + 1):
        t = k / n; xs = ys = 0; m = len(pts) - 1
        for i, p in enumerate(pts):
            b = math.comb(m, i) * (1 - t) ** (m - i) * t ** i; xs += b * p[0]; ys += b * p[1]
        out.append((xs, ys))
    return out
def arrow(path, col, wid, head, glowcol, taper=True):
    for pass_, (dr, w0, c) in enumerate(((gd, wid * 2.6, glowcol), (td, wid, col))):
        n = len(path)
        for i in range(n - 1):
            k = i / n; w = w0 * (0.55 + 0.45 * k) if taper else w0
            dr.line([path[i], path[i + 1]], fill=c, width=int(w), joint="curve")
            dr.ellipse((path[i][0] - w / 2, path[i][1] - w / 2, path[i][0] + w / 2, path[i][1] + w / 2), fill=c)
    (x1, y1), (x0, y0) = path[-1], path[-6]; a = math.atan2(y1 - y0, x1 - x0); L, B = head, head * .62
    tip = (x1 + math.cos(a) * L * .5, y1 + math.sin(a) * L * .5)
    p = [tip, (x1 - math.cos(a) * L * .5 + math.cos(a + 1.5708) * B, y1 - math.sin(a) * L * .5 + math.sin(a + 1.5708) * B),
         (x1 - math.cos(a) * L * .5 + math.cos(a - 1.5708) * B, y1 - math.sin(a) * L * .5 + math.sin(a - 1.5708) * B)]
    gd.polygon(p, fill=glowcol); td.polygon(p, fill=col)
BLUE, BLUEG, RED, REDG = (46, 130, 255, 255), (60, 150, 255, 120), (225, 40, 40, 255), (255, 60, 50, 110)
BAS, ARL, SAAR = P(50.0, 5.72), P(49.68, 5.82), P(49.32, 6.55)
# German drive: red arrows from the east, ring round Bastogne
for (la, lo, la2, lo2) in ((50.25, 7.3, 50.10, 5.95), (49.95, 7.2, 49.99, 5.86), (50.38, 6.7, 50.12, 5.78)):
    a, b = P(la, lo), P(la2, lo2); mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 20)
    arrow(bez([a, mid, b]), RED, 22 * SS, 70 * SS, REDG)
r = 62 * SS
gd.ellipse((BAS[0] - r, BAS[1] - r, BAS[0] + r, BAS[1] + r), outline=REDG, width=int(26 * SS)); td.ellipse((BAS[0] - r, BAS[1] - r, BAS[0] + r, BAS[1] + r), outline=RED, width=int(9 * SS))
# the move: ghost EAST arrow (where the army was facing), then the bold swing north to Bastogne
ge = P(49.42, 6.88); ghost = bez([P(49.42, 6.30), ((P(49.42, 6.30)[0] + ge[0]) / 2, ge[1] + 8), ge])
for i in range(0, len(ghost) - 1, 4): td.line([ghost[i], ghost[i + 1]], fill=(150, 170, 200, 220), width=int(12 * SS))
(x1, y1) = ghost[-1]; td.polygon([(x1 + 38 * SS, y1), (x1 - 8 * SS, y1 - 24 * SS), (x1 - 8 * SS, y1 + 24 * SS)], fill=(150, 170, 200, 230))
main = bez([P(49.42, 6.30), P(49.28, 5.75), P(49.55, 5.62), P(49.70, 5.84), P(49.86, 5.86), (BAS[0] + 18 * SS, BAS[1] + 70 * SS)])
arrow(main, BLUE, 34 * SS, 95 * SS, BLUEG)
im = Image.alpha_composite(Image.alpha_composite(im.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(14 * SS))), top)
d = ImageDraw.Draw(im)
fT = ImageFont.truetype(F, 27 * SS)
def tag(t, p, dx=14, dy=-18, col=(18, 16, 12)):
    x, y = p[0] + dx * SS, p[1] + dy * SS; w = d.textlength(t, font=fT)
    d.rectangle([x, y, x + w + 22 * SS, y + 42 * SS], fill=col + (235,), outline=(201, 180, 138, 255), width=2 * SS); d.text((x + 11 * SS, y + 3 * SS), t, font=fT, fill=(247, 243, 234, 255))
for nm, la, lo, dx, dy in (("BASTOGNE", 50.0, 5.72, 70, -58), ("ARLON", 49.68, 5.82, 18, -14), ("LUXEMBOURG", 49.61, 6.13, 14, 8), ("METZ", 49.12, 6.18, 14, -10), ("VERDUN", 49.16, 5.38, -150, -20)):
    p = P(la, lo); d.ellipse((p[0] - 7 * SS, p[1] - 7 * SS, p[0] + 7 * SS, p[1] + 7 * SS), fill=(247, 243, 234, 255), outline=(20, 20, 20, 255)); tag(nm, p, dx, dy)
tag("THIRD ARMY", P(49.42, 6.30), -60, 22, (31, 79, 196))
# portrait (vidIQ, collar clean): right third, feathered
por = Image.open("youtube/thumb/patton-thumb-MAP-broke-the-siege.jpg").convert("RGB").resize((W, H), Image.LANCZOS).crop((int(W * .60), 0, W, H))
pm = Image.linear_gradient("L").rotate(90).resize((por.width, H)); pm = pm.point(lambda p: min(255, int(p * 2.4))).transpose(Image.FLIP_LEFT_RIGHT)
pm = Image.eval(pm, lambda p: p); mask = Image.new("L", por.size, 255); ramp = int(por.width * .3)
for x in range(ramp): ImageDraw.Draw(mask).line([(x, 0), (x, H)], fill=int(255 * (x / ramp) ** 1.4))
im.paste(por, (int(W * .60), 0), mask)
# red torn banner bottom-left
bn = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(bn)
fB = ImageFont.truetype(F, 104 * SS); tw = bd.textlength(BAN, font=fB); y0, y1 = H - 172 * SS, H - 34 * SS; x1 = 70 * SS + tw + 60 * SS
pts = [(0, y0 + 20 * SS)] + [(x, y0 + (8 if (x // (30 * SS)) % 2 else -6) * SS) for x in range(0, int(x1), 30 * SS)] + [(x1, y0 + 12 * SS), (x1 + 25 * SS, (y0 + y1) / 2), (x1 - 5 * SS, y1 - 6 * SS)] + [(x, y1 + (6 if (x // (34 * SS)) % 2 else -8) * SS) for x in range(int(x1), 0, -34 * SS)] + [(0, y1)]
bd.polygon(pts, fill=(176, 18, 28, 255)); bn = bn.filter(ImageFilter.GaussianBlur(1.2 * SS))
im = Image.alpha_composite(im, bn); d = ImageDraw.Draw(im)
d.text((70 * SS + 3 * SS, (y0 + y1) / 2 + 5 * SS), BAN, font=fB, fill=(0, 0, 0, 160), anchor="lm"); d.text((70 * SS, (y0 + y1) / 2), BAN, font=fB, fill=(247, 243, 234, 255), anchor="lm")
im.convert("RGB").resize((1280, 720), Image.LANCZOS).save(OUT, quality=93); print(OUT)
