"""Marion thumbnails v7 (owner 2026-11-17; harsh critics round 4): vidIQ oil repaint of the 1876 lithograph (plume cropped, cooler/higher-contrast
grade, hard edge, no halo), vidIQ story background (burning Richardson house, dusty road, campfires, ferry, swamp) with OUR troops: many small
grounded unit boxes with shadows + dust + thick glowing arrows. GM style: GONE. headline, glowing river network, bevelled seal and 3D blocks,
vidIQ fog-island payoff.  usage (from marion/): python3 tools/make_thumb_v7.py"""
import math, numpy as np, runpy, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
W, H = 1280, 720; AN = "tools/Anton-Regular.ttf"; OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
v5 = runpy.run_path("tools/make_thumb_v5.py", run_name="lib")
OIL = Image.open("youtube/thumb/marion_oil_cut.png").convert("RGBA").crop((0, 500, 1152, 2048))
OILF = Image.open("youtube/thumb/marion_oil_cut.png").convert("RGBA")   # full, with plume (GM portrait)    # plume cropped; face centre (560, 390), face ~260 px
def portrait(face_h, flip=False, grade="cool"):
    b = OIL.copy(); a = np.array(b.split()[3]); a = cv2.erode(a, np.ones((5, 5), np.uint8), 1); a = cv2.GaussianBlur(a, (3, 3), 0)
    rgb = b.convert("RGB")
    if grade == "cool": rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(0.65)).enhance(1.28); rgb = Image.blend(rgb, ImageChops.screen(rgb, Image.new("RGB", rgb.size, (207, 216, 230))), 0.12)
    else: rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
    b = rgb.convert("RGBA"); b.putalpha(Image.fromarray(a)); fx = 560
    if flip: b = b.transpose(Image.FLIP_LEFT_RIGHT); fx = b.width - 560
    s = face_h / 260.0; return b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS), (fx * s, 390 * s)
def block(im, c, col, w, h, depth=6, glyph=True):
    """grounded 3D unit block: darker side face, lighter top edge, soft ground shadow"""
    x, y = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse([x - w * 0.62, y + h * 0.25, x + w * 0.7, y + h * 0.75 + depth], fill=(0, 0, 0, 140))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(4)))
    dark = tuple(int(v * 0.55) for v in col); light = tuple(min(255, int(v * 1.35) + 30) for v in col)
    d.polygon([(x - w / 2, y + h / 2), (x + w / 2, y + h / 2), (x + w / 2, y + h / 2 + depth), (x - w / 2, y + h / 2 + depth)], fill=dark + (255,))
    d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], fill=col + (255,), outline=(244, 238, 221, 255), width=2)
    d.line([x - w / 2 + 2, y - h / 2 + 2, x + w / 2 - 2, y - h / 2 + 2], fill=light + (255,), width=2)
    if glyph: d.line([x - w / 2 + 5, y + h / 2 - 5, x + w / 2 - 5, y - h / 2 + 5], fill=(244, 238, 221, 255), width=max(2, int(h / 9)))
    return Image.alpha_composite(im, lay)
def dust(im, pts, col=(217, 195, 154)):
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay); rng = np.random.default_rng(7)
    for (x, y) in pts:
        for _ in range(3): r = rng.uniform(10, 22); dx, dy = rng.normal(0, 8), rng.normal(0, 4); d.ellipse([x + dx - r, y + dy - r * 0.6, x + dx + r, y + dy + r * 0.6], fill=col + (70,))
    return Image.alpha_composite(im, lay.filter(ImageFilter.GaussianBlur(7)))
def label(im, xy, t, fill, size=28):
    d = ImageDraw.Draw(im); fo = ImageFont.truetype(OS, size); w = d.textlength(t, font=fo); x, y = xy
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([x + 3, y + 5, x + w + 27, y + size + 19], fill=(0, 0, 0, 150)); im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(3)))
    d = ImageDraw.Draw(im); d.rectangle([x, y, x + w + 24, y + size + 14], fill=fill); d.text((x + 12, y + 4), t, font=fo, fill=(247, 243, 234)); return im
outs = []
# ================= (1) GRANT STYLE =================
src = Image.open("youtube/thumb/bg_vidiq_story.jpg").convert("RGB")
bg = src.crop((0, 70, 1760, 70 + 990)).resize((W, H), Image.LANCZOS)          # k = 0.7273 ; house ~(395,220), road (430,290)->(1030,540)
bg = ImageEnhance.Contrast(bg).enhance(1.05)
K = W / 1760.0
def P(x, y): return (x * K, (y - 70) * K)
def grant(word, key):
    rng = np.random.default_rng(3); im = bg.copy().convert("RGBA")
    # Tarleton's Legion: a long red column down the road from the burning house (14 small grounded blocks, two files)
    road = [P(600, 440), P(700, 470), P(800, 505), P(900, 545), P(1000, 575), P(1100, 605), P(1190, 640)]
    pts = []
    for i in range(len(road) - 1):
        (x0, y0), (x1, y1) = road[i], road[i + 1]
        for t in (0.0, 0.5): pts.append((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t))
    im = dust(im, [(x - 14, y + 4) for x, y in pts])
    for j, (x, y) in enumerate(pts[:12]):
        for off in (-9, 9): im = block(im, (x + off * 0.4, y + off), (200, 30, 36), 26, 17, 4)
    # Marion's men: 6 blue blocks leaving the road into the swamp (lower-left), thick glowing escape arrow
    blue = [P(560, 640), P(500, 670), P(440, 700), P(520, 720), P(460, 752), P(400, 728)]
    for c in blue: im = block(im, c, (31, 79, 176), 26, 17, 4)
    im = v5["taper_arrow"](im, [P(600, 600), P(440, 640), P(230, 800)], 34, 18, (255, 255, 255, 245), glow=(255, 214, 140, 210))
    im = v5["taper_arrow"](im, [P(1180, 600), P(900, 520), P(700, 470)], 18, 9, (220, 38, 44, 230))   # Tarleton follows the road
    im = label(im, P(150, 560), "MARION", (34, 78, 190)); im = label(im, P(820, 420), "TARLETON", (178, 24, 30))
    # portrait: right, on a near-black panel, cool/contrasty grade, hard edge
    panel = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(panel)
    for i in range(420): pd.line([(W - 1 - i, 0), (W - 1 - i, H)], fill=(11, 11, 11, int(255 * min(1, (1 - i / 420) * 2.0))))
    im = Image.alpha_composite(im, panel)
    b, (fx, fy) = portrait(255, grade="cool"); x0, y0 = int(1070 - fx), int(290 - fy)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sb = Image.new("RGBA", b.size, (0, 0, 0, 255)); sb.putalpha(b.split()[3].point(lambda v: int(v * 0.7))); sh.alpha_composite(sb, (x0 - 14, y0 + 8))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(18))); im.alpha_composite(b, (x0, y0))
    d = ImageDraw.Draw(im); d.rectangle([28, 26, 28 + 330, 26 + 52], fill=(17, 17, 17)); d.text((44, 30), "BLACK RIVER · 1780", font=ImageFont.truetype(OS, 34), fill=(247, 243, 234))
    f = ImageFont.truetype(AN, 150); tw = sum(d.textlength(ch, font=f) + 2 for ch in word)
    bx, by, bw, bh = 30, 524, int(tw + 80), 166
    v5["torn"](d, bx, by, bw, bh, rng)
    x = bx + 40
    for ch in word:
        im = v5["text_shadow"](im, (x, by + bh / 2 + 6), ch, f, (255, 255, 255), "lm", stroke_width=5, stroke_fill=(26, 6, 6)); x += ImageDraw.Draw(im).textlength(ch, font=f) + 2
    out = f"youtube/thumb/marion-V7-grant-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
grant("OUTFOXED", "OUTFOXED")
# ================= (2) GRAND MANEUVER STYLE =================
T, OX, BEN = v5["T"], v5["OX"], v5["BEN"]; water = v5["water"]; swamp = v5["g"]["swamp"] if "g" in v5 else None
def river_net():
    S = 2; wm = np.array(water.resize((W * S, H * S), Image.LANCZOS)); wm = cv2.GaussianBlur(wm, (0, 0), 4); _, th = cv2.threshold(wm, 40, 255, cv2.THRESH_BINARY)
    sk = cv2.ximgproc.thinning(th) if hasattr(cv2, "ximgproc") else cv2.Canny(th, 50, 150)
    core = Image.fromarray(sk).filter(ImageFilter.MaxFilter(3)).resize((W, H), Image.LANCZOS)
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); g.paste(Image.new("RGBA", (W, H), (90, 160, 240, 255)), (0, 0), core.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(5)).point(lambda v: int(v * 0.5)))
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); c.paste(Image.new("RGBA", (W, H), (210, 230, 250, 255)), (0, 0), core.point(lambda v: int(min(255, v * 1.6) * 0.85)))
    return Image.alpha_composite(g, c)
RN = river_net()
ISL = Image.open("youtube/thumb/icon_vidiq_fog_island.jpg").convert("RGB")
def gm(word, sub, key):
    base = Image.new("RGB", (W, H), (15, 26, 43)); n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12)
    vig = Image.new("L", (W, H), 0); ImageDraw.Draw(vig).ellipse([-200, -260, W + 200, H + 260], fill=255); base = Image.composite(base, Image.new("RGB", (W, H), (7, 13, 23)), vig.filter(ImageFilter.GaussianBlur(170)))
    im = base.convert("RGBA")
    fH = ImageFont.truetype(AN, 230); fs = ImageFont.truetype(SER, 34); s = "   ".join(" ".join(w) for w in sub.split()); cx = 800
    tm = Image.new("L", (W, H), 0); dd = ImageDraw.Draw(tm); dd.text((cx, 4), word, font=fH, anchor="ma", fill=255); dd.text((cx, 268), s, font=fs, anchor="ma", fill=255)
    rn = RN.copy(); rn.putalpha(ImageChops.subtract(rn.split()[3], tm.filter(ImageFilter.MaxFilter(29)))); im = Image.alpha_composite(im, rn)
    # payoff island (vidIQ) at Benbow's Ferry, blended into the navy
    isl = ISL.resize((420, 420), Image.LANCZOS); m = Image.new("L", isl.size, 0); ImageDraw.Draw(m).ellipse([20, 40, 400, 380], fill=255); m = m.filter(ImageFilter.GaussianBlur(30))
    ix, iy = 880, 330; im.paste(isl.convert("RGBA"), (ix, iy), m)
    sx, sy = 640, 560
    for c in [(sx - 250, sy + 10), (sx - 172, sy + 4), (sx - 94, sy - 2)]: im = block(im, c, (200, 24, 32), 66, 42, 8)
    im = v5["seal"](im, (sx, sy), 58)
    for i, (c, a) in enumerate([((ix + 70, iy + 300), 255), ((ix + 140, iy + 284), 170), ((ix + 205, iy + 270), 90)]):
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); lay = block(lay, c, (31, 79, 176), 56, 36, 7); lay.putalpha(lay.split()[3].point(lambda v, a=a: int(v * a / 255))); im = Image.alpha_composite(im, lay)
    im = v5["taper_arrow"](im, [(sx + 64, sy + 20), (sx + 260, sy + 110), (ix + 30, iy + 300)], 30, 14, (126, 190, 255, 255), glow=(70, 140, 230, 150))
    fl = ImageFont.truetype(SER, 30)
    for t, (x, y) in [("OX SWAMP", (sx - 76, sy + 70)), ("BENBOW'S FERRY", (ix + 60, iy + 10))]: im = v5["text_shadow"](im, (x, y), t, fl, (244, 234, 210), "la", off=(2, 3), blur=3, op=200)
    im = v5["text_shadow"](im, (cx, 4), word, fH, (243, 234, 215), "ma", off=(0, 8), blur=12, op=120)
    im = v5["text_shadow"](im, (cx, 268), s, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
    bb = OILF.transpose(Image.FLIP_LEFT_RIGHT); sc = 150 / 260.0; bb = bb.resize((int(bb.width * sc), int(bb.height * sc)), Image.LANCZOS)
    bb = ImageEnhance.Contrast(bb.convert("RGB")).enhance(1.12).convert("RGBA"); bb.putalpha(OILF.transpose(Image.FLIP_LEFT_RIGHT).split()[3].resize(bb.size))
    b = bb; fx, fy = (1152 - 560) * sc, 890 * sc; x0, y0 = int(170 - fx), int(500 - fy)
    vg = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(vg).ellipse([-260, 340, 440, 980], fill=(4, 8, 16, 200)); im = Image.alpha_composite(im, vg.filter(ImageFilter.GaussianBlur(60)))
    im.alpha_composite(b, (x0, y0))
    out = f"youtube/thumb/marion-V7-gm-{key}.jpg"; im.convert("RGB").save(out, quality=94); outs.append(out)
gm("GONE.", "THEN TARLETON TURNED BACK", "GONE")
s = Image.new("RGB", (2 * 640 + 60, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
for i, o in enumerate(outs):
    im = Image.open(o); x = 20 + i * 660
    s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("V7-")[1][:-4], font=F2, fill=(230, 220, 200))
    s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410))
s.save("youtube/thumb/sheet_v7.jpg", quality=92); print(outs)
