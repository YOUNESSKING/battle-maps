"""Marion thumbnails in the GRAND MANEUVER template (owner 2026-11-17; research/competitors_top20/grand_maneuver/GM_STUDY.md):
one giant cream condensed word (the outcome, never the title's words) + spaced serif PLACE YEAR line + dark navy simplified map
(our real blackriver map: rivers + swamp) + our unit boxes (Marion blue, Tarleton's Legion red) + red wax seal + bold arrows,
+ Marion's REAL portrait close-up bottom-left (1876 Currier & Ives lithograph, PD) + a small fox mark by Marion's men.
usage (from marion/): python3 tools/make_thumb_gm.py"""
import math, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
W, H = 1280, 720
OS = "tools/oswald-latin-700-normal.ttf"; SER = "tools/cinzel-600.ttf"
M = __import__("json").load(open("assets/blackriver_m.json")); Z = M["zoom"]; OX0, OY0 = M["origin_world_px"]
def px(lat, lon):
    n = 256 * 2 ** Z; x = n * (lon + 180) / 360
    y = n * (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2
    return x - OX0, y - OY0
RICH, OX, BEN = (33.672, -80.470), (33.716, -80.198), (33.6995, -80.0115)
ROAD = [BEN, (33.712, -80.040), (33.718, -80.100), (33.722, -80.150), OX, (33.705, -80.260), (33.690, -80.360), (33.680, -80.430), RICH]
# crop: Richardson's .. Benbow's, 16:9
x1, _ = px(*RICH); x2, _ = px(*BEN); cx = (x1 + x2) / 2 + 60; cw = (x2 - x1) * 1.32; ch = cw * 9 / 16
_, cyy = px(33.70, -80.2); box = (cx - cw / 2, cyy - ch * 0.62, cx + cw / 2, cyy + ch * 0.38)
k = W / cw
def T(p): x, y = px(*p); return ((x - box[0]) * k, (y - box[1]) * k)
def lay(f): return Image.open(f).crop(tuple(int(v) for v in box)).resize((W, H), Image.LANCZOS).split()[3]
water, swamp = lay("assets/blackriver_m_water.png"), lay("assets/blackriver_m_swamp.png")
NAVY = (14, 26, 48)
base = Image.new("RGB", (W, H), NAVY)
noise = Image.effect_noise((W, H), 18).convert("L"); base = Image.composite(Image.new("RGB", (W, H), (20, 34, 60)), base, noise.point(lambda v: 60 if v > 140 else 0))
sw = Image.new("RGB", (W, H), (22, 44, 58)); base.paste(sw, (0, 0), swamp.point(lambda v: int(v * 0.85)))
riv = Image.new("RGB", (W, H), (88, 150, 205)); base.paste(riv, (0, 0), water.filter(ImageFilter.MaxFilter(3)))
d0 = ImageDraw.Draw(base)
pts = [T(p) for p in ROAD]   # (critic: no stray road line)
base = base.filter(ImageFilter.GaussianBlur(0.6))
# portrait (real lithograph, rembg cut-out), close-up, warm-toned
head = Image.open("assets/media/marion_head.png").convert("RGBA"); a = head.split()[3]
g = ImageOps.grayscale(head.convert("RGB")); g = ImageEnhance.Contrast(g).enhance(1.35)
warm = ImageOps.colorize(g, black=(28, 18, 10), mid=(170, 130, 95), white=(250, 238, 215)).convert("RGBA"); warm.putalpha(a)
FS = 500; warm = warm.resize((FS, FS), Image.LANCZOS); a2 = warm.split()[3]
def box_unit(d, c, col, w=58, h=36, slash=True):
    x, y = c; d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], 4, fill=col, outline=(245, 240, 228), width=3)
    if slash: d.line([x - w / 2 + 6, y + h / 2 - 6, x + w / 2 - 6, y - h / 2 + 6], fill=(245, 240, 228), width=4)
def arrow(im, path, col, wid=26):
    d = ImageDraw.Draw(im); d.line(path[:-1] + [path[-1]], fill=col, width=wid, joint="curve")
    (xa, ya), (xb, yb) = path[-2], path[-1]; ang = math.atan2(yb - ya, xb - xa); L = wid * 2.2
    tip = (xb + math.cos(ang) * L * 0.6, yb + math.sin(ang) * L * 0.6)
    l = (xb + math.cos(ang + 2.3) * L * 0.75, yb + math.sin(ang + 2.3) * L * 0.75); r = (xb + math.cos(ang - 2.3) * L * 0.75, yb + math.sin(ang - 2.3) * L * 0.75)
    d.polygon([tip, l, r], fill=col)
def seal(im, c, r=40):
    d = ImageDraw.Draw(im); x, y = c
    for i in range(14):
        ang = i / 14 * 2 * math.pi; d.ellipse([x + math.cos(ang) * r * 0.85 - r * 0.32, y + math.sin(ang) * r * 0.85 - r * 0.32, x + math.cos(ang) * r * 0.85 + r * 0.32, y + math.sin(ang) * r * 0.85 + r * 0.32], fill=(150, 18, 24))
    d.ellipse([x - r, y - r, x + r, y + r], fill=(170, 24, 30)); d.ellipse([x - r * 0.72, y - r * 0.72, x + r * 0.72, y + r * 0.72], outline=(110, 10, 16), width=3)
    for s in (1, -1): d.line([x - r * 0.45 * s, y - r * 0.45, x + r * 0.45 * s, y + r * 0.45], fill=(240, 220, 200), width=5)
def fox(im, c, s=1.0, col=(232, 120, 40)):
    d = ImageDraw.Draw(im); x, y = c; S = 30 * s
    body = [(x - S, y), (x - S * 0.2, y - S * 0.45), (x + S * 0.55, y - S * 0.4), (x + S * 0.75, y - S * 0.9), (x + S * 0.95, y - S * 0.6), (x + S * 1.25, y - S * 0.95),
            (x + S * 1.2, y - S * 0.35), (x + S * 1.55, y - S * 0.15), (x + S * 1.1, y), (x + S * 0.9, y + S * 0.55), (x + S * 0.7, y + S * 0.55), (x + S * 0.6, y + S * 0.1),
            (x - S * 0.2, y + S * 0.1), (x - S * 0.35, y + S * 0.55), (x - S * 0.55, y + S * 0.55), (x - S * 0.5, y + S * 0.05)]
    d.polygon(body, fill=col, outline=(30, 16, 8))
    d.polygon([(x - S * 0.95, y - S * 0.05), (x - S * 2.1, y - S * 0.55), (x - S * 2.3, y - S * 0.2), (x - S * 1.4, y + S * 0.25)], fill=col, outline=(30, 16, 8))   # brush tail
    d.polygon([(x - S * 2.1, y - S * 0.55), (x - S * 2.3, y - S * 0.2), (x - S * 1.85, y - S * 0.3)], fill=(250, 245, 235))
def make(word, sub, key, wsize=190):
    im = base.copy().convert("RGBA"); d = ImageDraw.Draw(im)
    p = [T(q) for q in ROAD]
    ox, rx, bx = T(OX), T(RICH), T(BEN)
    # Tarleton's chase: red column on the road from Richardson's, red arrow stopping at Ox Swamp (red wax seal = where he gave up)
    arrow(im, [(rx[0] + 40, rx[1] - 6), p[6], p[5], (ox[0] - 34, ox[1] + 4)], (196, 24, 32), 24)
    for i, q in enumerate([p[7], p[6], (p[6][0] + 70, p[6][1] - 6)]): box_unit(d, (q[0] + 10, q[1] - 46), (196, 24, 32))
    seal(im, (ox[0] + 6, ox[1] - 6), 40)
    # Marion: blue boxes across the swamp to Benbow's, bold blue arrow + the fox mark
    bp = [(ox[0] + 50, ox[1] + 40), (ox[0] + 200, ox[1] + 70), (bx[0] - 90, bx[1] + 45), (bx[0] - 10, bx[1] + 18)]
    arrow(im, bp, (88, 160, 235), 26)
    for q in [(bx[0] + 40, bx[1] - 34), (bx[0] + 108, bx[1] - 4)]: box_unit(d, q, (31, 79, 196))
    fox(im, (bx[0] + 95, bx[1] + 70), 1.15)
    # words: giant cream condensed word + spaced serif line
    f = ImageFont.truetype(OS, wsize); tw = d.textlength(word, font=f)
    while tw > W - 80: wsize -= 8; f = ImageFont.truetype(OS, wsize); tw = d.textlength(word, font=f)
    d.text((W / 2 + 2, 10 + 4), word, font=f, fill=(0, 0, 0, 160), anchor="ma"); d.text((W / 2, 10), word, font=f, fill=(244, 238, 221), anchor="ma")
    fs = ImageFont.truetype(SER, 40); s = "  ".join(" ".join(w) for w in sub.split()); d.text((W / 2, 10 + wsize * 1.02), s, font=fs, fill=(244, 238, 221), anchor="ma")
    # portrait bottom-left with a soft dark falloff behind
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh); sd.ellipse([-260, H - 520, 520, H + 260], fill=(6, 10, 20, 210))
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(60)))
    rim = Image.new("RGBA", (FS, FS), (120, 170, 230, 0)); rim.putalpha(a2.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.45)))
    im.alpha_composite(rim, (-70, H - FS + 40)); im.alpha_composite(warm, (-66, H - FS + 40))
    out = f"youtube/thumb/marion-thumbGM-{key}.jpg"; im.convert("RGB").save(out, quality=94); return out
if __name__ == "__main__":
  outs = [make("UNCATCHABLE", "OX SWAMP 1780", "A_UNCATCHABLE"), make("7 HOURS", "OX SWAMP 1780", "B_7_HOURS"), make("HE VANISHED.", "SOUTH CAROLINA 1780", "C_HE_VANISHED")]
  s = Image.new("RGB", (3 * 640 + 80, 620), (24, 22, 20)); d = ImageDraw.Draw(s); F2 = ImageFont.truetype(OS, 22)
  for i, o in enumerate(outs):
      im = Image.open(o); x = 20 + i * 660
      s.paste(im.resize((640, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), o.split("thumbGM-")[1][:-4], font=F2, fill=(230, 220, 200))
      s.paste(im.resize((360, 202), Image.LANCZOS), (x, 410)); s.paste(im.resize((168, 94), Image.LANCZOS), (x + 380, 410)); d.text((x + 380, 515), "feed 360 / phone 168", font=F2, fill=(170, 160, 140))
  s.save("youtube/thumb/sheet_gm.jpg", quality=92); print(outs)
