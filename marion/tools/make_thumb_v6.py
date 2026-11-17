"""Marion thumbnails v6 (owner 2026-11-17, credits topped up): vidIQ oil repaint of the 1876 Currier & Ives lithograph (LoC pga 08919,
same face/pose/helmet; youtube/thumb/marion_oil_vidiq.jpg -> marion_oil_cut.png) + vidIQ golden-hour aerial of the Black River chase
(bg_vidiq_golden.jpg: Legion dragoons in green halted on the road, Marion's riders slipping into the swamp, Richardson's house burning).
(1) channel GRANT style, (2) GRAND MANEUVER 'HE WON.' style.  usage (from marion/): python3 tools/make_thumb_v6.py"""
import math, numpy as np, runpy
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
BLK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
v5 = runpy.run_path("tools/make_thumb_v5.py", run_name="lib")   # helpers only (taper_arrow, unit, text_shadow, torn, seal, smooth rivers, T ...)
OIL = Image.open("youtube/thumb/marion_oil_cut.png").convert("RGBA")   # 1152x2048, face centre ~(600, 860), brow..chin ~300 px
def portrait(face_h, flip=False):
    b = OIL.transpose(Image.FLIP_LEFT_RIGHT) if flip else OIL; fx = (OIL.width - 600) if flip else 600
    a = b.split()[3].filter(ImageFilter.MinFilter(3)); b.putalpha(a)
    s = face_h / 300.0; return b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS), (fx * s, 860 * s)
def rim(b, col, op, side_shift):
    r = Image.new("RGBA", b.size, col + (0,)); a = b.split()[3]; r.putalpha(ImageChops.subtract(a.filter(ImageFilter.MaxFilter(7)), a).filter(ImageFilter.GaussianBlur(2)).point(lambda v: int(v * op))); return r
outs = []
# ================= (1) GRANT STYLE =================
bg = Image.open("youtube/thumb/bg_vidiq_terrain.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Contrast(bg).enhance(1.06)
def grant(word, key):
    rng = np.random.default_rng(3); im = bg.copy().convert("RGBA")
    wedge = Image.new("RGBA", (W, H), (0, 0, 0, 0)); wd = ImageDraw.Draw(wedge)
    for i in range(400): wd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(10, 7, 4, int(235 * min(1, (1 - i / 400) * 1.7))))
    im = Image.alpha_composite(im, wedge); d = ImageDraw.Draw(im)
    # OUR troops (owner 2026-11-17): Style W unit boxes + arrows on the painted terrain, no painted soldiers
    U = v5["unit"]
    road = [(735, 170), (770, 215), (812, 262), (850, 305), (862, 350), (838, 392), (800, 410)]    # Richardson's (burning house) -> down the road to the ferry
    for i, c in enumerate(road[:6]): U(d, c, (198, 40, 40), 46, 30)
    for c in [(560, 405), (612, 418), (520, 360), (575, 345)]: U(d, c, (30, 79, 163), 46, 30)          # Marion's men across at the ferry
    im = v5["taper_arrow"](im, [(800, 182), (880, 300), (812, 402)], 22, 10, (214, 40, 40, 235), glow=None)   # Tarleton's chase
    im = v5["taper_arrow"](im, [(520, 330), (400, 270), (250, 230)], 30, 13, (255, 255, 255, 240), glow=(255, 179, 71, 200))   # Marion vanishes into the swamp
    d = ImageDraw.Draw(im); fo = ImageFont.truetype(OS, 28)
    for (x, y), t, c in [((470, 440), "MARION", (34, 78, 190)), ((560, 150), "TARLETON", (178, 24, 30)), ((560, 470), "BENBOW'S FERRY", (17, 17, 17))]:
        w = d.textlength(t, font=fo); d.rectangle([x + 3, y + 4, x + w + 27, y + 46], fill=(0, 0, 0, 120)); d.rectangle([x, y, x + w + 24, y + 42], fill=c); d.text((x + 12, y + 4), t, font=fo, fill=(247, 243, 234))
    b, (fx, fy) = portrait(150, flip=False); x0, y0 = int(1060 - fx), int(310 - fy)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(b.split()[3].point(lambda v: int(v * 0.7))); sh.alpha_composite(sb, (x0 - 16, y0 + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(20))); im.alpha_composite(b, (x0, y0)); im.alpha_composite(rim(b, (255, 200, 130), 0.55, -1), (x0 - 3, y0))
    d = ImageDraw.Draw(im); d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 150); tw = sum(d.textlength(ch, font=f) + 2 for ch in word)
    bx, by, bw, bh = 30, 520, int(tw + 80), 170
    v5["torn"](d, bx, by, bw, bh, rng)
    x = bx + 40
    for ch in word: im = v5["text_shadow"](im, (x, by + bh / 2 + 6), ch, f, (255, 255, 255), "lm"); x += ImageDraw.Draw(im).textlength(ch, font=f) + 2
    out = f"youtube/thumb/marion-V6-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
grant("OUTFOXED", "OUTFOXED")
# ================= (2) GRAND MANEUVER STYLE =================
T, OX, BEN = v5["T"], v5["OX"], v5["BEN"]; RIV = v5["RIV"]
def gm(word, sub, key):
    base = Image.new("RGB", (W, H), (15, 26, 43)); n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12)
    vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-200, -260, W + 200, H + 260], fill=255); base = Image.composite(base, Image.new("RGB", (W, H), (7, 13, 23)), vig.filter(ImageFilter.GaussianBlur(170)))
    im = base.convert("RGBA")
    fH = ImageFont.truetype(BLK, 140); fs = ImageFont.truetype(SER, 36); s = "   ".join(" ".join(w) for w in sub.split()); cx = 790
    tm = Image.new("L", (W, H), 0); dd = ImageDraw.Draw(tm); dd.text((cx, 22), word, font=fH, anchor="ma", fill=255); dd.text((cx, 214), s, font=fs, anchor="ma", fill=255)
    riv = RIV.copy(); riv.putalpha(ImageChops.subtract(riv.split()[3], tm.filter(ImageFilter.MaxFilter(31))))
    im = Image.alpha_composite(im, riv)
    ox, bx = T(OX), T(BEN); sx, sy = ox[0] - 40, ox[1] + 34
    d = ImageDraw.Draw(im)
    for c in [(sx - 220, sy + 6), (sx - 158, sy + 2), (sx - 96, sy - 2)]: v5["unit"](d, c, (200, 24, 32), 54, 36)
    im = v5["seal"](im, (sx, sy), 52)
    # payoff: Marion's riders (painted) melting into a warm lit mist at Benbow's Ferry
    tx, ty = bx[0] - 30, bx[1] + 70
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    for rr, a in [(230, 60), (160, 90), (95, 120)]: gd.ellipse([tx - rr * 1.3, ty - rr * 0.65, tx + rr * 1.3, ty + rr * 0.65], fill=(255, 196, 120, a))
    im = Image.alpha_composite(im, glow.filter(ImageFilter.GaussianBlur(34)))
    for i, (c, a) in enumerate([((tx - 70, ty + 4), 255), ((tx - 8, ty - 10), 190), ((tx + 54, ty - 24), 110), ((tx + 114, ty - 38), 45)]):   # our blue boxes fading into the mist
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); v5["unit"](ImageDraw.Draw(lay), c, (30, 79, 163), 54, 36); lay.putalpha(lay.split()[3].point(lambda v, a=a: int(v * a / 255))); im = Image.alpha_composite(im, lay)
    mist = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(mist).ellipse([tx + 10, ty - 90, tx + 260, ty + 60], fill=(255, 236, 205, 150)); im = Image.alpha_composite(im, mist.filter(ImageFilter.GaussianBlur(30)))
    im = v5["taper_arrow"](im, [(sx + 56, sy + 20), (sx + 270, sy + 120), (tx - 120, ty + 14)], 26, 10, (111, 179, 255, 255), glow=(70, 140, 230, 140))
    fl = ImageFont.truetype(SER, 30)
    for t, (x, y) in [("OX SWAMP", (sx - 72, sy + 62)), ("BENBOW'S FERRY", (tx - 110, ty - 150))]: im = v5["text_shadow"](im, (x, y), t, fl, (244, 234, 210), "la", off=(2, 3), blur=3, op=200)
    im = v5["text_shadow"](im, (cx, 22), word, fH, (244, 233, 210), "ma", off=(0, 10), blur=18, op=150)
    im = v5["text_shadow"](im, (cx, 214), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    b, (fx, fy) = portrait(128, flip=True); x0, y0 = int(170 - fx), int(500 - fy)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(b.split()[3].point(lambda v: int(v * 0.6))); sh.alpha_composite(sb, (x0 + 18, y0 + 10))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(24))); im.alpha_composite(b, (x0, y0)); im.alpha_composite(rim(b, (156, 196, 255), 0.6, 1), (x0 + 3, y0))
    out = f"youtube/thumb/marion-V6-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
gm("HE VANISHED.", "THEN TARLETON TURNED BACK", "HE_VANISHED")
s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V6-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
s.save("youtube/thumb/sheet_v6.jpg", quality=92); print(outs)
