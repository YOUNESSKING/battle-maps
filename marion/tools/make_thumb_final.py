"""Marion final thumbnails (owner 2026-11-17): (1) GRAND MANEUVER 'HE WON.' style, (2) the channel's GRANT 'THE BACK DOOR' style.
Portrait = Marion's REAL portrait (Currier & Ives lithograph 1876, PD, LoC), bust cut from the 4K scan (youtube/thumb/marion_lc_bust_cut.png).
usage (from marion/): python3 tools/make_thumb_final.py"""
import math, runpy, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
W, H = 1280, 720; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
bust = Image.open("youtube/thumb/marion_lc_bust_cut.png").convert("RGBA").crop((230, 10, 650, 760))
def tone(im, warm=True):
    a = im.split()[3]; g = ImageEnhance.Contrast(ImageOps.grayscale(im.convert("RGB")).filter(ImageFilter.GaussianBlur(1.1))).enhance(1.12)
    c = ImageOps.colorize(g, black=(22, 16, 10), mid=(160, 128, 98), white=(250, 240, 222)) if warm else ImageOps.colorize(g, black=(14, 12, 10), mid=(150, 140, 126), white=(250, 245, 236))
    c = c.filter(ImageFilter.UnsharpMask(2, 60, 3)).convert("RGBA"); c.putalpha(a); return c
def brush(d, x, y, w, h, rng, col=(196, 22, 28)):
    top = [(x + i, y + int(rng.integers(-7, 8))) for i in range(0, w + 1, 20)]
    bot = [(x + i, y + h + int(rng.integers(-8, 9))) for i in range(w, -1, -20)]
    d.polygon(top + [(x + w + 16, y + h // 2)] + bot + [(x - 12, y + h // 2)], fill=col)
def tag(d, xy, text, fill, size=26, fg=(247, 243, 234)):
    f = ImageFont.truetype(OS, size); w = d.textlength(text, font=f); x, y = xy
    d.rectangle([x, y, x + w + 24, y + size + 14], fill=fill); d.text((x + 12, y + 4), text, font=f, fill=fg)
def curved_arrow(im, p0, p1, bend, col=(250, 250, 250), wid=16):
    d = ImageDraw.Draw(im); (x0, y0), (x1, y1) = p0, p1; mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    nx, ny = -(y1 - y0), (x1 - x0); L = math.hypot(nx, ny); cx, cy = mx + nx / L * bend, my + ny / L * bend
    pts = [((1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1) for t in np.linspace(0, 0.9, 40)]
    for i in range(len(pts) - 1): d.line([pts[i], pts[i + 1]], fill=col, width=int(wid * (0.35 + 0.65 * i / len(pts))))
    (xa, ya), (xb, yb) = pts[-2], pts[-1]; ang = math.atan2(yb - ya, xb - xa); Lh = wid * 2.6
    d.polygon([(xb + math.cos(ang) * Lh, yb + math.sin(ang) * Lh), (xb + math.cos(ang + 2.4) * Lh * 0.8, yb + math.sin(ang + 2.4) * Lh * 0.8),
               (xb + math.cos(ang - 2.4) * Lh * 0.8, yb + math.sin(ang - 2.4) * Lh * 0.8)], fill=col)
outs = []
# ---------- (2) GRANT 'THE BACK DOOR' style: battle left, real portrait right on dark, red banner bottom-left ----------
import cv2
_b = cv2.imread("youtube/thumb/bg_vidiq_fox.jpg"); _m = np.zeros(_b.shape[:2], np.uint8)
cv2.ellipse(_m, (1150, 412), (95, 42), 0, 0, 360, 255, -1)          # the lead rider's muzzle flash: he escapes, he does not fire
_b = cv2.inpaint(_b, _m, 9, cv2.INPAINT_TELEA)
bg = Image.fromarray(cv2.cvtColor(_b, cv2.COLOR_BGR2RGB))
bg = bg.crop((0, 0, 2048, 1152)).resize((W, H), Image.LANCZOS); bg = ImageEnhance.Brightness(ImageEnhance.Contrast(bg).enhance(1.1)).enhance(1.12)
def grant(words, key):
    rng = np.random.default_rng(5); im = bg.copy().convert("RGBA")
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    for i in range(430): sd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(3, 3, 3, int(252 * min(1, (1 - i / 430) * 1.6) ** 1.1)))
    im = Image.alpha_composite(im, sh)
    b = tone(bust.crop((0, 0, bust.width, 580)), warm=False); hh = int(H * 1.12); ww = int(b.width * hh / b.height); b = b.resize((ww, hh), Image.LANCZOS)
    rim = Image.new("RGBA", b.size, (255, 240, 210, 0)); rim.putalpha(b.split()[3].filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.3)))
    x0 = W - ww + 30; y0 = H - hh + 40; im.alpha_composite(rim, (x0 - 4, y0)); im.alpha_composite(b, (x0, y0))
    d = ImageDraw.Draw(im)
    tag(d, (30, 28), "BLACK RIVER · 1780", (16, 14, 12), 34)
    tag(d, (330, 150), "TARLETON'S LEGION", (178, 24, 30), 26); tag(d, (690, 175), "MARION", (34, 78, 190), 26)
    curved_arrow(im, (720, 330), (430, 420), -80)
    f = ImageFont.truetype(OS, 128); lines = words; lh = 128; tw = max(d.textlength(l, font=f) for l in lines)
    bw, bh = int(tw + 70), int(lh * len(lines) + 30); bx, by = 26, H - bh - 30
    brush(d, bx, by, bw, bh, rng)
    for i, l in enumerate(lines): d.text((bx + bw / 2, by + 8 + i * lh), l, font=f, fill=(252, 248, 238), anchor="ma", stroke_width=3, stroke_fill=(30, 8, 8))
    out = f"youtube/thumb/marion-FINAL-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
grant(["UNCATCHABLE"], "UNCATCHABLE")
# ---------- (1) GRAND MANEUVER 'HE WON.' style: navy map + giant cream word + spaced serif line + portrait bottom-left ----------
g = runpy.run_path("tools/make_thumb_gm.py", run_name="lib")   # reuse its navy map + units + seal + fox
def gm(word, sub, key):
    im = g["base"].copy().convert("RGBA"); T = g["T"]; ROAD = g["ROAD"]
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([-300, H - 640, 520, H + 260], fill=(5, 9, 18, 225))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(60))); d = ImageDraw.Draw(im)
    p = [T(q) for q in ROAD]; ox, rx, bx = T(g["OX"]), T(g["RICH"]), T(g["BEN"])
    RB = [(p[6][0] - 40, p[6][1] - 50), (p[6][0] + 34, p[6][1] - 58), (p[6][0] + 108, p[6][1] - 64)]
    for q in RB: g["box_unit"](d, q, (200, 16, 46), 66, 42)
    g["arrow"](im, [(RB[-1][0] + 40, RB[-1][1] + 10), p[5], (ox[0] - 40, ox[1] + 2)], (200, 16, 46), 30)
    sx, sy, r = ox[0] + 6, ox[1] - 6, 44; dd = ImageDraw.Draw(im)
    for i in range(14):
        a_ = i / 14 * 2 * math.pi; dd.ellipse([sx + math.cos(a_) * r * 0.85 - r * 0.32, sy + math.sin(a_) * r * 0.85 - r * 0.32, sx + math.cos(a_) * r * 0.85 + r * 0.32, sy + math.sin(a_) * r * 0.85 + r * 0.32], fill=(150, 18, 24))
    dd.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(176, 26, 34)); dd.ellipse([sx - r * 0.66, sy - r * 0.66, sx + r * 0.66, sy + r * 0.66], outline=(118, 12, 18), width=3)
    tag(d, (sx - 98, sy - 92), "TARLETON HALTS", (200, 16, 46), 24)
    bp = [(ox[0] + 20, ox[1] + 70), (ox[0] + 200, ox[1] + 84), (bx[0] - 90, bx[1] + 40), (bx[0] - 14, bx[1] + 6)]
    g["arrow"](im, bp, (88, 160, 235), 30)
    for q in [(bx[0] + 44, bx[1] - 48), (bx[0] + 116, bx[1] - 16)]: g["box_unit"](d, q, (31, 79, 196), 66, 42)
    fxc = Image.open("youtube/thumb/fox_cut.png"); fxc = fxc.crop(fxc.getbbox()); fxc.thumbnail((200, 140)); im.alpha_composite(fxc, (int(bx[0] - 70), int(bx[1] + 12)))
    fl = ImageFont.truetype(SER, 26)
    for txt, (x, y) in [("OX SWAMP", (ox[0] - 64, ox[1] + 50)), ("BENBOW'S FERRY", (bx[0] - 300, bx[1] + 40))]: d.text((x, y), txt, font=fl, fill=(244, 238, 221))
    f = ImageFont.truetype(OS, 150); d.text((W / 2 + 150 + 3, 10 + 5), word, font=f, fill=(0, 0, 0), anchor="ma"); d.text((W / 2 + 150, 10), word, font=f, fill=(244, 238, 221), anchor="ma")
    fs = ImageFont.truetype(SER, 38); s = "   ".join(" ".join(w) for w in sub.split()); d.text((W / 2 + 150, 190), s, font=fs, fill=(244, 238, 221), anchor="ma")
    b = tone(bust.crop((0, 0, bust.width, 600)), warm=True); hh = int(H * 1.0); ww = int(b.width * hh / b.height); b = b.resize((ww, hh), Image.LANCZOS)
    rim = Image.new("RGBA", b.size, (130, 180, 240, 0)); rim.putalpha(b.split()[3].filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.4)))
    x0, y0 = -30, H - hh + 40; im.alpha_composite(rim, (x0 - 4, y0)); im.alpha_composite(b, (x0, y0))
    out = f"youtube/thumb/marion-FINAL-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
gm("HE VANISHED.", "SOUTH CAROLINA · 1780", "HE_VANISHED")
s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("FINAL-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410)); d.text((x + 380, 515), "feed 360 / phone 168", font=F2, fill=(170, 160, 140))
s.save("youtube/thumb/sheet_final.jpg", quality=92); print(outs)
