"""Thumbnail B (map + movement, Pillow only). Run from /home/user/battle-maps/patton:
python3 youtube/thumb/agentB/make_thumb_B.py"""
import math, json, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageEnhance
os.chdir("/home/user/battle-maps/patton")
OUTD = "youtube/thumb/agentB/"
F = "tools/oswald-latin-700-normal.ttf"
Z, ORG, S = 9, (66098, 43528), 2
SS = 2; W, H = 1280 * SS, 720 * SS
def wpx(lat, lon):
    n = 256 * 2 ** Z
    x = (lon + 180) / 360 * n; y = (0.5 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / (2 * math.pi)) * n
    return ((x - ORG[0]) * S, (y - ORG[1]) * S)
c = wpx(49.56, 6.30); cw = 3.8 * 256 * 2 ** Z / 360 * S; ch = cw * 9 / 16
box = (c[0] - cw / 2, c[1] - ch / 2, c[0] + cw / 2, c[1] + ch / 2)
def M(x, y): return ((x - box[0]) / cw * W, (y - box[1]) / ch * H)     # HD map px -> canvas
def P(lat, lon): return M(*wpx(lat, lon))
relief = Image.open("assets/media/pc_ard_relief.jpg").convert("RGB")
ctl = Image.open("assets/media/m2b_ard_ctl_dec19_mx.png").convert("RGBA").resize(relief.size, Image.LANCZOS)
base = ImageChops.multiply(relief, Image.alpha_composite(Image.new("RGBA", relief.size, (255, 255, 255, 255)), ctl).convert("RGB"))
im = base.crop(tuple(int(v) for v in box)).resize((W, H), Image.LANCZOS)
im = ImageEnhance.Contrast(ImageEnhance.Brightness(im).enhance(0.9)).enhance(1.3)
im = ImageEnhance.Color(im).enhance(1.25).convert("RGBA")
# rivers (real DEM-traced rivers) -- dark under-stroke + light core
rv = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(rv)
for r in json.load(open("assets/src/ardennes_dem_rivers.json")):
    if r["order"] < 2: continue
    pts = [M(x, y) for x, y in r["pts"]]
    if max(p[0] for p in pts) < 0 or min(p[0] for p in pts) > W or max(p[1] for p in pts) < 0 or min(p[1] for p in pts) > H: continue
    w = (2.2 if r["order"] == 2 else 4.2) * SS
    rd.line(pts, fill=(10, 30, 60, 150), width=int(w + 2 * SS), joint="curve")
    rd.line(pts, fill=(120, 190, 255, 235), width=int(w), joint="curve")
im = Image.alpha_composite(im, rv)
# real front line of 19 Dec (overlay edge): crisp dark edge + red glow
fr = json.load(open("assets/media/m2b_ard_front.json"))["dec19"][0]
fp = [M(x * 2, y * 2) for x, y in fr]
fl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fl)
fd.line(fp, fill=(255, 70, 50, 150), width=14 * SS, joint="curve")
fl = fl.filter(ImageFilter.GaussianBlur(7 * SS)); fd = ImageDraw.Draw(fl)
fd.line(fp, fill=(40, 6, 6, 255), width=7 * SS, joint="curve"); fd.line(fp, fill=(255, 90, 70, 255), width=int(3.5 * SS), joint="curve")
im = Image.alpha_composite(im, fl)
# vignette (dark, cinematic)
v = Image.new("L", (W, H), 0); ImageDraw.Draw(v).ellipse((W * .02, -H * .15, W * 1.0, H * 1.15), fill=255); v = v.filter(ImageFilter.GaussianBlur(190))
vg = Image.eval(v, lambda p: int(60 + p * 195 / 255))
im = ImageChops.multiply(im.convert("RGB"), Image.merge("RGB", [vg] * 3)).convert("RGBA")

# ---------- geometry helpers ----------
def catmull(pts, n=24):
    out = []; p = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(p) - 2):
        for k in range(n):
            t = k / n; t2, t3 = t * t, t * t * t
            out.append(tuple(.5 * ((2 * p[i][j]) + (-p[i-1][j] + p[i+1][j]) * t + (2*p[i-1][j] - 5*p[i][j] + 4*p[i+1][j] - p[i+2][j]) * t2 + (-p[i-1][j] + 3*p[i][j] - 3*p[i+1][j] + p[i+2][j]) * t3) for j in (0, 1)))
    out.append(pts[-1]); return out
def ribbon(path, w0, w1, off=0.0, shrink=1.0):
    """polygon of a tapered ribbon; off shifts centre line sideways (fraction of width) for highlight"""
    n = len(path); L, R = [], []
    for i, (x, y) in enumerate(path):
        a, b = path[max(i - 1, 0)], path[min(i + 1, n - 1)]
        ang = math.atan2(b[1] - a[1], b[0] - a[0]); nx, ny = -math.sin(ang), math.cos(ang)
        w = (w0 + (w1 - w0) * (i / (n - 1))) * shrink / 2; cx, cy = x + nx * off * w, y + ny * off * w
        L.append((cx + nx * w, cy + ny * w)); R.append((cx - nx * w, cy - ny * w))
    return L + R[::-1]
def head(tip, ang, length, width, notch=.28):
    ux, uy = math.cos(ang), math.sin(ang); nx, ny = -uy, ux
    bx, by = tip[0] - ux * length, tip[1] - uy * length
    return [tip, (bx + nx * width / 2, by + ny * width / 2), (bx + ux * length * notch, by + uy * length * notch), (bx - nx * width / 2, by - ny * width / 2)]
def draw_arrow(layer_glow, layer, path, w0, w1, hl, hw, cols, glowc):
    gd, d = ImageDraw.Draw(layer_glow), ImageDraw.Draw(layer)
    ang = math.atan2(path[-1][1] - path[-8][1], path[-1][0] - path[-8][0])
    ux, uy = math.cos(ang), math.sin(ang)
    tip = (path[-1][0] + ux * hl * .85, path[-1][1] + uy * hl * .85)
    hp = head(tip, ang, hl, hw)
    body = ribbon(path, w0, w1)
    gd.polygon(ribbon(path, w0 * 1.7, w1 * 1.7), fill=glowc); gd.polygon(head(tip, ang, hl * 1.2, hw * 1.35), fill=glowc)
    dark, mid, light, edge = cols
    for poly in (body, hp): d.polygon(poly, fill=edge)
    d.polygon(ribbon(path, w0, w1, 0, .84), fill=dark); d.polygon(head(tip, ang, hl * .88, hw * .84, .3), fill=dark)
    d.polygon(ribbon(path, w0, w1, -.18, .6), fill=mid)
    d.polygon(ribbon(path, w0, w1, -.38, .26), fill=light)
    # head shading: lighter upper-left half
    h2 = head(tip, ang, hl * .88, hw * .84, .3); d.polygon([h2[0], h2[1], h2[2]], fill=mid)
    h3 = [h2[0], ((h2[0][0] + h2[1][0]) / 2, (h2[0][1] + h2[1][1]) / 2), ((h2[2][0] + h2[1][0]) / 2, (h2[2][1] + h2[1][1]) / 2)]
    d.polygon(h3, fill=light)

glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); top = Image.new("RGBA", (W, H), (0, 0, 0, 0))
BLUE = ((14, 52, 150, 255), (40, 120, 255, 255), (150, 210, 255, 255), (235, 245, 255, 255))
RED = ((120, 8, 14, 255), (222, 36, 36, 255), (255, 140, 120, 255), (255, 225, 215, 255))
BAS = P(50.0, 5.72)
# ---- German ring and two clean red arrows
for (a, b, bend) in ((P(50.22, 7.15), (BAS[0] + 92 * SS, BAS[1] - 30 * SS), -40), (P(49.90, 7.0), (BAS[0] + 86 * SS, BAS[1] + 34 * SS), 30)):
    mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + bend * SS)
    draw_arrow(glow, top, catmull([a, ((a[0] + mid[0]) / 2, (a[1] + mid[1]) / 2), mid, b]), 18 * SS, 30 * SS, 70 * SS, 86 * SS, RED, (255, 50, 40, 120))
r = 66 * SS; d = ImageDraw.Draw(top); gd = ImageDraw.Draw(glow)
# ring with a gap where the blue breaks through (south-south-west)
def arc_gap(dr_, col, w):
    dr_.arc((BAS[0] - r, BAS[1] - r, BAS[0] + r, BAS[1] + r), 125 + 45, 125 + 45 + 270 - 0, fill=col, width=int(w))
for dr_, col, w in ((gd, (255, 50, 40, 140), 26 * SS), (d, (30, 4, 6, 255), 14 * SS), (d, (235, 40, 40, 255), 8 * SS)): arc_gap(dr_, col, w)
# ---- blue movement: faint east-facing start (Saar, 19 Dec), hairpin, then north via Luxembourg + Arlon to Bastogne
st = P(49.40, 6.58)
ghost_end = P(49.40, 7.0); 
gl = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gdd = ImageDraw.Draw(gl)
a0 = P(49.40, 6.30)
for k in range(0, 14):
    t0, t1 = k / 14, (k + .6) / 14
    gdd.line([(a0[0] + (ghost_end[0] - a0[0]) * t0, a0[1]), (a0[0] + (ghost_end[0] - a0[0]) * t1, a0[1])], fill=(190, 215, 255, 200), width=10 * SS)
gdd.polygon(head(( ghost_end[0] + 52 * SS, ghost_end[1]), 0, 64 * SS, 56 * SS), fill=(190, 215, 255, 200))
route = [P(49.40, 6.52), P(49.36, 6.28), P(49.30, 6.08), P(49.37, 5.97), P(49.52, 6.06), P(49.61, 6.13), P(49.68, 5.82)]
path = catmull(route[:7], 22)      # Saar -> hairpin -> Thionville/Luxembourg -> Arlon
A = path[-1]; dx, dy = BAS[0] - A[0], BAS[1] - A[1]; dl = math.hypot(dx, dy); E = (BAS[0] - dx / dl * 135 * SS, BAS[1] - dy / dl * 135 * SS)
path += [(A[0] + (E[0] - A[0]) * k / 20, A[1] + (E[1] - A[1]) * k / 20) for k in range(1, 21)]   # Arlon -> Bastogne (road north)
draw_arrow(glow, top, path, 18 * SS, 54 * SS, 112 * SS, 132 * SS, BLUE, (70, 150, 255, 150))
im = Image.alpha_composite(im, gl)
im = Image.alpha_composite(Image.alpha_composite(im, glow.filter(ImageFilter.GaussianBlur(12 * SS))), top)
d = ImageDraw.Draw(im)
# ---- unit markers
def nato(cx, cy, wd, col, sym):
    x0, y0, x1, y1 = cx - wd / 2, cy - wd * .36, cx + wd / 2, cy + wd * .36
    d.rectangle([x0 - 3 * SS, y0 - 3 * SS, x1 + 3 * SS, y1 + 3 * SS], fill=(255, 255, 255, 255)); d.rectangle([x0, y0, x1, y1], fill=col)
    if sym == "x": d.line([x0, y0, x1, y1], fill=(255, 255, 255, 255), width=4 * SS); d.line([x0, y1, x1, y0], fill=(255, 255, 255, 255), width=4 * SS)
    if sym == "para":      # parachute canopy + lines + man
        d.pieslice([cx - wd * .3, cy - wd * .3, cx + wd * .3, cy + wd * .12], 180, 360, fill=(255, 255, 255, 255))
        for dx in (-.28, 0, .28): d.line([cx + dx * wd, cy - wd * .09, cx, cy + wd * .2], fill=(255, 255, 255, 255), width=2 * SS)
        d.ellipse([cx - 3 * SS, cy + wd * .17, cx + 3 * SS, cy + wd * .27], fill=(255, 255, 255, 255))
nato(st[0], st[1], 70 * SS, (30, 100, 235, 255), "x")
nato(BAS[0], BAS[1], 62 * SS, (30, 100, 235, 255), "para")
# ---- labels
fT = ImageFont.truetype(F, 30 * SS)
def tag(t, x, y, bg=(14, 12, 10), fg=(250, 246, 236), bd=(210, 190, 140)):
    w = d.textlength(t, font=fT)
    d.rectangle([x + 4 * SS, y + 4 * SS, x + w + 28 * SS, y + 52 * SS], fill=(0, 0, 0, 150))
    d.rectangle([x, y, x + w + 24 * SS, y + 48 * SS], fill=bg + (240,), outline=bd + (255,), width=2 * SS); d.text((x + 12 * SS, y + 2 * SS), t, font=fT, fill=fg + (255,))
def dot(p): d.ellipse((p[0] - 8 * SS, p[1] - 8 * SS, p[0] + 8 * SS, p[1] + 8 * SS), fill=(250, 246, 236, 255), outline=(10, 10, 10, 255), width=2 * SS)
ARL, LUX = P(49.68, 5.82), P(49.61, 6.13)
dot(ARL); dot(LUX)
tag("BASTOGNE", BAS[0] - 292 * SS, BAS[1] - 30 * SS)
tag("ARLON", ARL[0] - 175 * SS, ARL[1] - 20 * SS)
tag("LUXEMBOURG", LUX[0] + 30 * SS, LUX[1] - 40 * SS)
tag("THIRD ARMY", st[0] - 70 * SS, st[1] + 50 * SS, bg=(20, 70, 190), bd=(235, 245, 255))
# ---- portrait (right third, feathered)
por = Image.open("youtube/thumb/patton-thumb-MAP-broke-the-siege.jpg").convert("RGB").resize((W, H), Image.LANCZOS).crop((int(W * .60), 0, W, H))
mask = Image.new("L", por.size, 255); ramp = int(por.width * .3); md = ImageDraw.Draw(mask)
for x in range(ramp): md.line([(x, 0), (x, H)], fill=int(255 * (x / ramp) ** 1.4))
im.paste(por, (int(W * .60), 0), mask)
# ---- red torn banner
BAN = "BROKE THE SIEGE"
bn = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(bn)
fB = ImageFont.truetype(F, 96 * SS); tw = bd.textlength(BAN, font=fB); y0, y1 = H - 152 * SS, H - 28 * SS; x1 = 70 * SS + tw + 60 * SS
pts = [(0, y0 + 20 * SS)] + [(x, y0 + (8 if (x // (30 * SS)) % 2 else -6) * SS) for x in range(0, int(x1), 30 * SS)] + [(x1, y0 + 12 * SS), (x1 + 25 * SS, (y0 + y1) / 2), (x1 - 5 * SS, y1 - 6 * SS)] + [(x, y1 + (6 if (x // (34 * SS)) % 2 else -8) * SS) for x in range(int(x1), 0, -34 * SS)] + [(0, y1)]
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + 6 * SS, y + 8 * SS) for x, y in pts], fill=(0, 0, 0, 170))
im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6 * SS)))
bd.polygon(pts, fill=(176, 18, 28, 255)); bn = bn.filter(ImageFilter.GaussianBlur(1.2 * SS))
im = Image.alpha_composite(im, bn); d = ImageDraw.Draw(im)
d.text((70 * SS + 3 * SS, (y0 + y1) / 2 + 5 * SS), BAN, font=fB, fill=(0, 0, 0, 160), anchor="lm"); d.text((70 * SS, (y0 + y1) / 2), BAN, font=fB, fill=(247, 243, 234, 255), anchor="lm")
out = im.convert("RGB").resize((1280, 720), Image.LANCZOS); out.save(OUTD + "thumb_B.jpg", quality=94)
card = Image.new("RGB", (200, 120), (15, 15, 15)); card.paste(out.resize((168, 94), Image.LANCZOS), (16, 13)); card.save(OUTD + "thumb_B_feed.jpg", quality=95)
print("ok")
