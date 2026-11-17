"""Marion thumbnails v5 (owner 2026-11-17, 2 harsh critics x 2 rounds): own sources only, no AI credits.
Portrait = the 1876 Currier & Ives lithograph from the Library of Congress MASTER scan (pga 08919, 6660 px), sharp warm B&W
(youtube/thumb/marion_bw_master.png: CLAHE + unsharp, tone #1a1410..#f3ead8), crisp edge, no halo, no hand colouring.
(1) channel GRANT style ("THE BACK DOOR"), (2) GRAND MANEUVER style ("HE WON.").  usage (from marion/): python3 tools/make_thumb_v5.py"""
import math, cv2, numpy as np, runpy
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
BLK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
BW = Image.open("youtube/thumb/marion_bw_master.png").convert("RGBA").crop((440, 90, 1120, 1300))
_a = BW.split()[3]; BW = BW.convert("RGB").filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.UnsharpMask(1.5, 80, 2)).convert("RGBA"); BW.putalpha(_a)   # face centre (300, 510), face ~190 px
def portrait(face_h, flip):
    b = BW.transpose(Image.FLIP_LEFT_RIGHT) if flip else BW; fx = (b.width - 300) if flip else 300
    s = face_h / 190.0; return b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS), (fx * s, 510 * s)
def soft_shadow(im, layer, off=(0, 0), blur=25, op=0.6):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); a = layer.split()[3].point(lambda v: int(v * op))
    blk = Image.new("RGBA", layer.size, (0, 0, 0, 255)); blk.putalpha(a); return blk.filter(ImageFilter.GaussianBlur(blur))
def text_shadow(im, xy, txt, font, fill, anchor, off=(6, 8), blur=10, op=170, **kw):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((xy[0] + off[0], xy[1] + off[1]), txt, font=font, fill=(0, 0, 0, op), anchor=anchor, **kw)
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(blur))); ImageDraw.Draw(im).text(xy, txt, font=font, fill=fill, anchor=anchor, **kw); return im
def unit(d, c, col, w=40, h=27):
    x, y = c; d.rectangle([x - w / 2 + 3, y - h / 2 + 4, x + w / 2 + 3, y + h / 2 + 4], fill=(0, 0, 0, 120))
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], fill=col, outline=(245, 240, 228), width=2)
    d.line([x - w / 2 + 4, y + h / 2 - 4, x + w / 2 - 4, y - h / 2 + 4], fill=(245, 240, 228), width=3)
def taper_arrow(im, pts, w0, w1, col, glow=None):
    """quadratic bezier through 3 points, tapered body + head; optional outer glow"""
    (x0, y0), (cx, cy), (x1, y1) = pts; P = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.86, 80)]
    L, R = [], []
    for i in range(len(P)):
        a, b = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]; ang = math.atan2(b[1] - a[1], b[0] - a[0]); w = (w0 + (w1 - w0) * i / len(P)) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    a = math.atan2(P[-1][1] - P[-3][1], P[-1][0] - P[-3][0]); hw, hl = w1 * 1.9, w1 * 2.6; ex, ey = P[-1]
    head = [(ex + math.cos(a + math.pi / 2) * hw, ey + math.sin(a + math.pi / 2) * hw), (ex + math.cos(a) * hl, ey + math.sin(a) * hl), (ex - math.cos(a + math.pi / 2) * hw, ey - math.sin(a + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(lay).polygon(poly, fill=col)
    if glow:
        g = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(g).polygon(poly, fill=glow); im = Image.alpha_composite(im, g.filter(ImageFilter.GaussianBlur(10)))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + 4, y + 6) for x, y in poly], fill=(0, 0, 0, 130))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6))); return Image.alpha_composite(im, lay)
def torn(d, x, y, w, h, rng, col=(183, 28, 28)):
    top = [(x + i, y + int(rng.integers(-9, 10))) for i in range(0, w + 1, 14)]; bot = [(x + i, y + h + int(rng.integers(-10, 11))) for i in range(w, -1, -14)]
    d.polygon(top + [(x + w + 18, y + h // 2)] + bot + [(x - 14, y + h // 2)], fill=col)
outs = []
# ================= (1) GRANT STYLE =================
src = cv2.cvtColor(np.array(Image.open("youtube/thumb/vidiq_A_SWAMP_FOX.png").convert("RGB").resize((W, H))), cv2.COLOR_RGB2BGR)
m = np.zeros(src.shape[:2], np.uint8); cv2.rectangle(m, (110, 222), (236, 300), 255, -1); cv2.line(m, (200, 292), (450, 392), 255, 70); cv2.circle(m, (205, 290), 45, 255, -1)
src = cv2.inpaint(src, m, 11, cv2.INPAINT_TELEA)
patch = src[440:600, 20:330].copy(); mk = np.zeros(patch.shape[:2], np.float32); cv2.ellipse(mk, (155, 80), (150, 76), 0, 0, 360, 1.0, -1); mk = cv2.GaussianBlur(mk, (41, 41), 0)[..., None]
for (yy, xx) in [(250, 230), (300, 330), (205, 120)]:
    roi = src[yy:yy + 160, xx:xx + 310].astype(np.float32); src[yy:yy + 160, xx:xx + 310] = (patch * mk + roi * (1 - mk)).astype(np.uint8)
hsv = cv2.cvtColor(src, cv2.COLOR_BGR2HSV); reg = np.zeros(m.shape, bool); reg[380:640, 430:740] = True
red = ((hsv[..., 0] < 9) | (hsv[..., 0] > 168)) & (hsv[..., 1] > 90) & (hsv[..., 2] > 60) & reg
hsv[..., 0][red] = 55; hsv[..., 1][red] = (hsv[..., 1][red] * 0.55).astype(np.uint8); hsv[..., 2][red] = (hsv[..., 2][red] * 0.45).astype(np.uint8)   # Legion green #2f4a2a-ish
src = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
bg = Image.fromarray(cv2.cvtColor(src, cv2.COLOR_BGR2RGB)).crop((0, 134, 1046, 720)).resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Color(bg).enhance(0.65)
grad = Image.linear_gradient("L").resize((W, H)); warmtop = Image.new("RGB", (W, H), (255, 179, 71)); dark = Image.new("RGB", (W, H), (58, 42, 16))
bg = ImageChops.multiply(bg, Image.composite(dark, warmtop, grad).point(lambda v: min(255, v + 60)))
bg = ImageEnhance.Brightness(bg).enhance(1.45)
haze = Image.new("RGB", (W, H), (255, 210, 138)); hm = Image.linear_gradient("L").resize((W, H)).point(lambda v: int(max(0, 255 - v * 3.2) * 0.45)); bg = Image.composite(haze, bg, hm)
glow = Image.new("L", (W, H), 0); ImageDraw.Draw(glow).ellipse([-300, -300, 500, 300], fill=255); bg = ImageChops.screen(bg, Image.composite(Image.new("RGB", (W, H), (255, 196, 107)), Image.new("RGB", (W, H), (0, 0, 0)), glow.filter(ImageFilter.GaussianBlur(120)).point(lambda v: int(v * 0.35))))
vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-260, -200, W + 260, H + 200], fill=255); bg = Image.composite(bg, ImageEnhance.Brightness(bg).enhance(0.55), vig.filter(ImageFilter.GaussianBlur(140)))
def smoke(im, c, r):
    rng = np.random.default_rng(int(c[0])); lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(14):
        x = c[0] + rng.normal(0, r * 0.35) + i * 3; y = c[1] - i * r * 0.18 + rng.normal(0, 6); rr = r * (0.35 + i * 0.05)
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(92, 88, 82, 70))
    return Image.alpha_composite(im, lay.filter(ImageFilter.GaussianBlur(14)))
def grant(word, key):
    rng = np.random.default_rng(3); im = bg.copy().convert("RGBA")
    im = smoke(im, (700, 470), 70); im = smoke(im, (560, 520), 50)
    d = ImageDraw.Draw(im)
    for i in range(7): unit(d, (470 + i * 46, 560 - i * 22), (198, 40, 40))           # Tarleton's Legion column on the road
    for i in range(6): unit(d, (500 + i * 46, 618 - i * 22), (198, 40, 40))
    for i in range(4): unit(d, (120 + i * 46, 268 - i * 14), (30, 79, 163))            # Marion's men slipping into the swamp
    for i in range(3): unit(d, (150 + i * 46, 314 - i * 14), (30, 79, 163))
    im = taper_arrow(im, [(560, 470), (420, 260), (285, 220)], 30, 14, (255, 255, 255, 235), glow=(255, 179, 71, 200))
    d = ImageDraw.Draw(im); fo = ImageFont.truetype(OS, 28)
    for (x, y), t, c in [((470, 600), "TARLETON", (178, 24, 30)), ((110, 160), "MARION", (34, 78, 190))]:
        w = d.textlength(t, font=fo); d.rectangle([x, y, x + w + 24, y + 42], fill=c); d.text((x + 12, y + 4), t, font=fo, fill=(247, 243, 234))
    wedge = Image.new("RGBA", (W, H), (0, 0, 0, 0)); wd = ImageDraw.Draw(wedge)
    for i in range(520): wd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(8, 6, 4, int(255 * min(1, (1 - i / 520) * 1.9))))
    im = Image.alpha_composite(im, wedge)
    b, (fx, fy) = portrait(205, flip=True); x0, y0 = int(1020 - fx), int(320 - fy)
    rim = Image.new("RGBA", b.size, (255, 217, 160, 0)); ra = b.split()[3]; rim.putalpha(ImageChops.subtract(ra.filter(ImageFilter.MaxFilter(9)), ra).filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * 0.55)))
    im.alpha_composite(soft_shadow(im, b, blur=22, op=0.7), (x0 - 18, y0 + 10)); im.alpha_composite(b, (x0, y0)); im.alpha_composite(rim, (x0 - 4, y0))
    d = ImageDraw.Draw(im); d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 150); tw = d.textlength(word, font=f) + 2 * (len(word) - 1)
    bx, by, bw, bh = 30, 520, int(tw + 80), 170
    torn(d, bx, by, bw, bh, rng)
    tex = Image.effect_noise((bw + 40, bh + 40), 30).convert("L").point(lambda v: int(abs(v - 128) * 0.6)); tl = Image.new("RGBA", tex.size, (0, 0, 0, 0)); tl.putalpha(tex)
    ban = Image.new("L", (W, H), 0); torn(ImageDraw.Draw(ban), bx, by, bw, bh, np.random.default_rng(3), col=255)
    nt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); nt.paste(tl, (bx - 20, by - 20)); nt.putalpha(ImageChops.multiply(nt.split()[3], ban)); im = Image.alpha_composite(im, nt)
    x = bx + 40
    for ch in word:
        im = text_shadow(im, (x, by + bh / 2 + 6), ch, f, (255, 255, 255), "lm"); x += ImageDraw.Draw(im).textlength(ch, font=f) + 2
    out = f"youtube/thumb/marion-V5-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
if __name__ == "__main__": grant("OUTFOXED", "OUTFOXED")
# ================= (2) GRAND MANEUVER STYLE =================
g = runpy.run_path("tools/make_thumb_gm.py", run_name="lib"); T = g["T"]; OX, RICH, BEN = g["OX"], g["RICH"], g["BEN"]; water = g["water"]
def smooth_rivers():
    S = 2; wm = np.array(water.resize((W * S, H * S), Image.LANCZOS)); wm = cv2.GaussianBlur(wm, (0, 0), 6); _, th = cv2.threshold(wm, 90, 255, cv2.THRESH_BINARY)
    cs, _ = cv2.findContours(th, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); gl = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d1, d2 = ImageDraw.Draw(lay), ImageDraw.Draw(gl)
    for c in cs:
        if len(c) < 40: continue
        p = cv2.approxPolyDP(c, 2.5, True)[:, 0, :].astype(float).tolist()
        for _ in range(3):   # Chaikin
            q = []
            for i in range(len(p)): a, b = p[i], p[(i + 1) % len(p)]; q += [[0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]]
            p = q
        pts = [tuple(v) for v in p] + [tuple(p[0])]
        d2.line(pts, fill=(111, 168, 208, 70), width=10); d1.line(pts, fill=(207, 227, 240, 180), width=4)
    return Image.alpha_composite(gl.filter(ImageFilter.GaussianBlur(6)), lay).resize((W, H), Image.LANCZOS)
RIV = smooth_rivers()
def seal(im, c, R):
    sx, sy = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(18):
        a = i / 18 * 2 * math.pi; d.ellipse([sx + math.cos(a) * R * 0.88 - R * 0.27, sy + math.sin(a) * R * 0.88 - R * 0.27, sx + math.cos(a) * R * 0.88 + R * 0.27, sy + math.sin(a) * R * 0.88 + R * 0.27], fill=(130, 0, 0, 255))
    for r in range(int(R), 0, -2):
        t = r / R; d.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(int(139 + (211 - 139) * (1 - t)), int(0 + 47 * (1 - t)), int(0 + 47 * (1 - t)), 255))
    d.ellipse([sx - R * 0.66, sy - R * 0.66, sx + R * 0.66, sy + R * 0.66], outline=(100, 0, 0, 255), width=4)
    for s in (1, -1):   # crossed sabres
        d.line([sx - R * 0.42 * s, sy + R * 0.42, sx + R * 0.36 * s, sy - R * 0.36], fill=(243, 217, 160, 255), width=6)
        d.line([sx - R * 0.5 * s, sy + R * 0.28, sx - R * 0.28 * s, sy + R * 0.5], fill=(243, 217, 160, 255), width=6)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([sx - R + 5, sy - R + 9, sx + R + 5, sy + R + 9], fill=(0, 0, 0, 160))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(7))); return Image.alpha_composite(im, lay)
def gm(word, sub, key):
    base = Image.new("RGB", (W, H), (15, 26, 43)); n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12)
    vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-200, -260, W + 200, H + 260], fill=255); base = Image.composite(base, Image.new("RGB", (W, H), (7, 13, 23)), vig.filter(ImageFilter.GaussianBlur(170)))
    im = base.convert("RGBA")
    fH = ImageFont.truetype(BLK, 140); fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split())
    txtmask = Image.new("L", (W, H), 0); tm = ImageDraw.Draw(txtmask); tm.text((790, 30), word, font=fH, anchor="ma"); tm.text((790, 206), s, font=fs, anchor="ma")
    riv = RIV.copy(); riv.putalpha(ImageChops.subtract(riv.split()[3], txtmask.filter(ImageFilter.MaxFilter(41))))
    im = Image.alpha_composite(im, riv)
    ox, bx = T(OX), T(BEN)
    sx, sy = ox[0] - 60, ox[1] + 30
    d = ImageDraw.Draw(im)
    for i, c in enumerate([(sx - 230, sy + 6), (sx - 168, sy + 2), (sx - 106, sy - 2)]): unit(d, c, (200, 24, 32), 54, 36)
    im = seal(im, (sx, sy), 45)
    # payoff: Marion's rider dissolving into fog at Benbow's Ferry
    tx, ty = bx[0] - 40, bx[1] + 60
    fog = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    for k, (rr, a) in enumerate([(210, 70), (150, 90), (90, 110)]):
        ImageDraw.Draw(fog).ellipse([tx - rr * 1.4, ty - rr * 0.7, tx + rr * 1.4, ty + rr * 0.7], fill=(230, 232, 236, a))
    rider = Image.open("youtube/thumb/rider_cut.png").convert("RGBA"); rider.thumbnail((190, 250))
    ra = np.array(rider.split()[3]).astype(float); fade = np.linspace(0.85, 0.15, rider.width)[None, :]; rider.putalpha(Image.fromarray((ra * fade).astype(np.uint8)))
    im.alpha_composite(rider, (int(tx - rider.width / 2), int(ty - rider.height * 0.7)))
    im = Image.alpha_composite(im, fog.filter(ImageFilter.GaussianBlur(30)))
    im = taper_arrow(im, [(sx + 50, sy + 18), (sx + 280, sy + 120), (tx - 110, ty)], 24, 10, (111, 179, 255, 255), glow=(70, 140, 230, 140))
    d = ImageDraw.Draw(im); fl = ImageFont.truetype(SER, 30)
    for t, (x, y) in [("OX SWAMP", (sx - 70, sy + 56)), ("BENBOW'S FERRY", (tx - 120, ty - 150))]:
        im = text_shadow(im, (x, y), t, fl, (244, 234, 210), "la", off=(2, 3), blur=3, op=200)
    im = text_shadow(im, (790, 30), word, fH, (244, 233, 210), "ma", off=(0, 10), blur=18, op=150)
    im = text_shadow(im, (790, 206), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = portrait(175, flip=True); x0, y0 = int(175 - fx), int(520 - fy)
    im.alpha_composite(soft_shadow(im, b, blur=25, op=0.6), (x0 + 16, y0 + 8)); im.alpha_composite(b, (x0, y0))
    out = f"youtube/thumb/marion-V5-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
if __name__ == "__main__": gm("HE VANISHED.", "THEN TARLETON TURNED BACK", "HE_VANISHED")
if __name__ == "__main__":
  s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
  for i, o in enumerate(outs):
      im = Image.open(o); x = 20 + i * 660
      s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V5-")[1][:-4], font=F2, fill=(230, 220, 200))
      s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
  s.save("youtube/thumb/sheet_v5.jpg", quality=92); print(outs)
