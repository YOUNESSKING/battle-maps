"""Vicksburg v3 thumbnail, ALT (Test & Compare), Grand Maneuver recipe (PACKAGING_GUIDE 0c item 3B; marion/tools/make_thumb_v10.py gm()).
v3 = every fix of youtube/thumb/critic_ALT.md (2026-11-19):
 - heavy word: tracking +12, 1.1x stretch, MaxFilter 11 -> stem >= 27 % of word height, letter gaps >= 8 px (9 glyphs: 173 px tall, 977 wide)
 - ONE calm left-to-right story: seal at BRUINSBURG (560,590) -> one glowing arc bowing down (the inland march east of the river)
   -> big glowing VICKSBURG payoff at the right end (x ~1080). Map turned so north points up-right: the Mississippi runs lower-left
   to upper-right, Bruinsburg and Vicksburg both on its EAST (lower-right) bank, Vicksburg NNE of Bruinsburg (true).
 - payoff = vidIQ dusk vignette (Vicksburg on its bluff, lamplit, fires + smoke of the bombardment), 380 px, bottom feathered,
   orange bloom + hot core: the hottest warm accent, at the far right.
 - declutter: 2 labels (BRUINSBURG, VICKSBURG, Cinzel 40), no unit blocks, no star, thin Mississippi kept >= 70 px from the seal.
 - subtitle = twist line "THEN VICKSBURG FELL" (decision 3 May, surrender 4 July 1863).
 - portrait: vidIQ oil repaint of the LoC Brady photo (likeness, pose, two-star strap kept), hard 2 px matte, NO rim composite.
usage (from vicksburg/): python3 tools/make_thumb_v3_gm.py "CUT LOOSE." "THEN VICKSBURG FELL" ALT-GM"""
import sys, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
from scipy.interpolate import splprep, splev
W, H = 1280, 720; MT = "/home/user/battle-maps/marion/tools/"
AN = MT + "Anton-Regular.ttf"; SER = MT + "cinzel-600.ttf"
word = sys.argv[1] if len(sys.argv) > 1 else "CUT LOOSE."
sub = sys.argv[2] if len(sys.argv) > 2 else "THEN VICKSBURG FELL"
tag_out = sys.argv[3] if len(sys.argv) > 3 else "ALT-GM"
THICK = int(sys.argv[4]) if len(sys.argv) > 4 else 11
def text_shadow(im, xy, txt, font, fill, anchor, off=(6, 8), blur=10, op=170, **kw):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((xy[0] + off[0], xy[1] + off[1]), txt, font=font, fill=(0, 0, 0, op), anchor=anchor, **kw)
    im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(blur))); ImageDraw.Draw(im).text(xy, txt, font=font, fill=fill, anchor=anchor, **kw); return im
def soft(im, col, mask, blur):
    lay = Image.new("RGBA", im.size, col + (0,)); lay.putalpha(mask.filter(ImageFilter.GaussianBlur(blur))); return Image.alpha_composite(im, lay)
def bez(pts, t):
    (a, b, c, d) = pts; return ((1 - t) ** 3 * a[0] + 3 * (1 - t) ** 2 * t * b[0] + 3 * (1 - t) * t ** 2 * c[0] + t ** 3 * d[0],
                                (1 - t) ** 3 * a[1] + 3 * (1 - t) ** 2 * t * b[1] + 3 * (1 - t) * t ** 2 * c[1] + t ** 3 * d[1])
def glow_arrow(im, pts, w0, w1, col, glow, tmax=0.9):
    P = [bez(pts, t) for t in np.linspace(0, tmax, 160)]; L, R = [], []
    for i in range(len(P)):
        a, b = P[max(i - 1, 0)], P[min(i + 1, len(P) - 1)]; ang = math.atan2(b[1] - a[1], b[0] - a[0]); w = (w0 + (w1 - w0) * i / len(P)) / 2
        L.append((P[i][0] + math.cos(ang + math.pi / 2) * w, P[i][1] + math.sin(ang + math.pi / 2) * w)); R.append((P[i][0] - math.cos(ang + math.pi / 2) * w, P[i][1] - math.sin(ang + math.pi / 2) * w))
    a = math.atan2(P[-1][1] - P[-4][1], P[-1][0] - P[-4][0]); hw, hl = w1 * 1.9, w1 * 2.6; ex, ey = P[-1]
    head = [(ex + math.cos(a + math.pi / 2) * hw, ey + math.sin(a + math.pi / 2) * hw), (ex + math.cos(a) * hl, ey + math.sin(a) * hl), (ex - math.cos(a + math.pi / 2) * hw, ey - math.sin(a + math.pi / 2) * hw)]
    poly = L + head + R[::-1]
    gm_ = Image.new("L", im.size, 0); ImageDraw.Draw(gm_).polygon(poly, fill=glow[3]); im = soft(im, glow[:3], gm_, 12)
    sm = Image.new("L", im.size, 0); ImageDraw.Draw(sm).polygon([(x + 4, y + 6) for x, y in poly], fill=130); im = soft(im, (0, 0, 0), sm, 6)
    lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(lay).polygon(poly, fill=col); return Image.alpha_composite(im, lay)
def glossy_seal(im, c, R):
    sx, sy = c; lay = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    for i in range(22):
        a = i / 22 * 2 * math.pi; rr = R * 0.27; d.ellipse([sx + math.cos(a) * R * 0.92 - rr, sy + math.sin(a) * R * 0.92 - rr, sx + math.cos(a) * R * 0.92 + rr, sy + math.sin(a) * R * 0.92 + rr], fill=(120, 10, 16, 255))
    for r in range(int(R), 0, -1):
        t = r / R; d.ellipse([sx - r - (1 - t) * R * 0.2, sy - r - (1 - t) * R * 0.2, sx + r - (1 - t) * R * 0.2, sy + r - (1 - t) * R * 0.2], fill=(int(96 + 134 * (1 - t) ** 1.2), int(10 + 60 * (1 - t) ** 2), int(16 + 56 * (1 - t) ** 2), 255))
    d.ellipse([sx - R * 0.7, sy - R * 0.7, sx + R * 0.7, sy + R * 0.7], outline=(80, 6, 10, 255), width=5)
    for s in (1, -1):
        pts = [(sx - R * 0.48 * s + (R * 0.86 * s) * t, sy + R * 0.46 - R * 0.9 * t - math.sin(t * math.pi) * R * 0.12) for t in np.linspace(0, 1, 18)]
        d.line(pts, fill=(40, 40, 46, 255), width=11); d.line(pts, fill=(217, 221, 226, 255), width=7); d.line(pts[3:], fill=(255, 255, 255, 255), width=2)
        gx, gy = pts[3]; d.line([gx - 9 * s, gy - 9, gx + 9 * s, gy + 9], fill=(212, 170, 80, 255), width=6); d.line([pts[0], pts[3]], fill=(70, 40, 20, 255), width=8)
    hl = Image.new("L", im.size, 0); ImageDraw.Draw(hl).ellipse([sx - R * 0.75, sy - R * 0.85, sx - R * 0.05, sy - R * 0.35], fill=110)
    sh = Image.new("L", im.size, 0); ImageDraw.Draw(sh).ellipse([sx - R + 6, sy - R + 11, sx + R + 6, sy + R + 11], fill=180)
    im = soft(im, (0, 0, 0), sh, 9); im = Image.alpha_composite(im, lay); return soft(im, (255, 210, 210), hl, 10)
rng = np.random.default_rng(9)
# ---------- navy base ----------
base = Image.new("RGB", (W, H), (14, 26, 46)); grad = Image.linear_gradient("L").resize((W, H))
base = Image.composite(Image.new("RGB", (W, H), (20, 39, 68)), base, grad.point(lambda v: int(v * 0.6)))
n = Image.effect_noise((W, H), 22).convert("RGB"); base = Image.blend(base, ImageChops.overlay(base, n), 0.12); im = base.convert("RGBA")
# ---------- heavy word (thickened glyph mask) + subtitle ----------
# 9 glyphs cannot take Marion's 1.35x stretch inside the 960 px slot, so: per-letter tracking (+12), 1.1x stretch, then a 5 px/side
# dilation (MaxFilter 11) -> stem 27 % of the word height with >= 9 px between letters and open counters (searched, see fixes_v3.md)
WH, SX, TRK = 174, 1.1, 12
f0 = ImageFont.truetype(AN, int(WH * 250 / 219)); tmp = Image.new("L", (3000, 500), 0); d0 = ImageDraw.Draw(tmp); x_ = 20
for ch in word: d0.text((x_, 20), ch, font=f0, fill=255); x_ += d0.textlength(ch, font=f0) + TRK / SX
glyph = tmp.crop(tmp.getbbox()); glyph = glyph.resize((int(glyph.width * SX), glyph.height), Image.LANCZOS)
if THICK: glyph = glyph.filter(ImageFilter.MaxFilter(THICK))
glyph = glyph.crop(glyph.getbbox()); GH = glyph.height
CX = 778; gx, gy = int(CX - glyph.width / 2), 34
fs = ImageFont.truetype(SER, 36); s_ = "   ".join(" ".join(w) for w in sub.split()); sy_ = gy + glyph.height + 24
tm = Image.new("L", (W, H), 0); tm.paste(glyph, (gx, gy)); ImageDraw.Draw(tm).text((CX, sy_), s_, font=fs, fill=255, anchor="ma")
# ---------- faint hairline rivers (cut away under the text, the portrait side and the seal) ----------
S = 2; lay = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); gl = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d, g = ImageDraw.Draw(lay), ImageDraw.Draw(gl)
def walk(x, y, ang, nn, wdt, depth, bright=1.0):
    pts = [(x, y)]
    for _ in range(nn):
        ang += rng.normal(0, 0.18); step = rng.uniform(14, 26) * S; x += math.cos(ang) * step; y += math.sin(ang) * step; pts.append((x, y))
        if depth < 2 and rng.random() < 0.06: walk(x, y, ang + rng.choice([-1, 1]) * rng.uniform(0.6, 1.0), int(nn * 0.5), wdt * 0.7, depth + 1, bright)
    g.line(pts, fill=(80, 150, 235, int(90 * bright)), width=int(9 * wdt)); d.line(pts, fill=(207, 228, 255, int(210 * bright)), width=max(2, int(3 * wdt)))
for (x, y, a) in [(1320, 640, 3.2), (900, 760, -1.9), (1320, 300, 2.9), (700, 760, -1.4), (480, 760, -1.1)]: walk(x * S, y * S, a, 60, 0.8, 0, 0.8)
rv = Image.alpha_composite(gl.filter(ImageFilter.GaussianBlur(8)), lay).resize((W, H), Image.LANCZOS)
cut = tm.filter(ImageFilter.MaxFilter(31)); ImageDraw.Draw(cut).ellipse([615 - 110, 590 - 110, 615 + 110, 590 + 110], fill=255)
rv.putalpha(ImageChops.subtract(rv.split()[3].point(lambda v: int(v * 0.30)), cut)); im = Image.alpha_composite(im, rv)
# ---------- the Mississippi: lower-left to upper-right (north = up-right), west of Bruinsburg and Vicksburg ----------
MS = [(330, 730), (380, 640), (430, 560), (470, 500), (560, 456), (660, 470), (760, 440), (860, 400), (960, 404), (1060, 360), (1160, 330), (1290, 300)]
tck, _ = splprep(np.array(MS).T, s=0); xs, ys = splev(np.linspace(0, 1, 400), tck); mp = list(zip(xs, ys))
dmin = min(math.hypot(x - 615, y - 590) for x, y in mp)
mg = Image.new("L", (W, H), 0); ImageDraw.Draw(mg).line(mp, fill=120, width=20); im = soft(im, (80, 150, 235), mg, 9)
ml = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(ml).line(mp, fill=(190, 220, 255, 220), width=5); im = Image.alpha_composite(im, ml)
# ---------- payoff: Vicksburg on its bluff at dusk, burning (right end) ----------
IX, IY = 1080, 540
ic = Image.open("youtube/thumb/work_v3/icon_vidiq_vicksburg_dusk_v3.png").convert("RGBA"); ic = ic.crop(ic.getbbox())
ia = np.array(ic.split()[3]).astype(float); h0 = int(ic.height * 0.66); ia[h0:] *= np.linspace(1, 0, ic.height - h0)[:, None] ** 2.2; ic.putalpha(Image.fromarray(ia.astype(np.uint8)))
ic.thumbnail((380, 380), Image.LANCZOS); px, py = int(IX - ic.width / 2), int(IY - ic.height * 0.62)
bm = Image.new("L", (W, H), 0); ImageDraw.Draw(bm).ellipse([IX - 150, IY - 190, IX + 150, IY + 110], fill=150); im = soft(im, (255, 138, 42), bm, 60)
im.alpha_composite(ic, (px, py))
hm = Image.new("L", (W, H), 0); ImageDraw.Draw(hm).ellipse([IX - 100, IY - 150, IX + 60, IY + 10], fill=120); im = soft(im, (255, 160, 60), hm, 30)
# ---------- the move: Bruinsburg -> one arc inland (east of the river) -> Vicksburg ----------
SX, SY = 615, 590
im = glow_arrow(im, [(SX + 72, SY + 4), (720, 650), (880, 640), (IX - 60, IY + 40)], 32, 15, (126, 195, 255, 255), (70, 150, 240, 170), tmax=0.78)
im = glossy_seal(im, (SX, SY), 66)
fl = ImageFont.truetype(SER, 40)
for t, (x, y) in [("BRUINSBURG", (SX, 667)), ("VICKSBURG", (IX, 668))]:
    gg = Image.new("L", (W, H), 0); ImageDraw.Draw(gg).text((x, y), t, font=fl, fill=160, anchor="ma"); im = soft(im, (255, 210, 140), gg, 6)
    im = text_shadow(im, (x, y), t, fl, (246, 232, 196), "ma", off=(2, 3), blur=3, op=220, stroke_width=1, stroke_fill=(246, 232, 196))
# ---------- word + subtitle ----------
shm = Image.new("L", (W, H), 0); shm.paste(glyph.point(lambda v: int(v * 0.5)), (gx, gy + 8)); im = soft(im, (0, 0, 0), shm, 12)
col = Image.new("RGBA", glyph.size, (244, 236, 216, 255)); col.putalpha(glyph); im.alpha_composite(col, (gx, gy))
im = text_shadow(im, (CX, sy_), s_, fs, (232, 220, 192), "ma", off=(0, 3), blur=4, op=180)
# ---------- colour oil portrait, left, facing the map; hard matte, NO rim ----------
b = Image.open("youtube/thumb/work_v3/grant_oil_cut_v4.png").convert("RGBA")
s = 0.54; b = b.resize((int(b.width * s), int(b.height * s)), Image.LANCZOS); a = b.split()[3]
fx, fy = 585 * s, 660 * s; x0, y0 = int(178 - fx), int(318 - fy)
shd = Image.new("L", (W, H), 0); shd.paste(a.point(lambda v: int(v * 0.75)), (x0 + 12, y0 + 8)); im = soft(im, (0, 0, 0), shd, 12)
im.alpha_composite(b, (x0, y0))
key = word.replace(" ", "_").replace(".", "")
out = f"youtube/thumb/vicksburg-v4-{tag_out}-{key}.jpg"; im.convert("RGB").save(out, quality=94)
# ---------- self-measure: stem width / word height, letter gaps, payoff ----------
gm = np.array(glyph) > 128; runs = []
for fr in (0.35, 0.5, 0.65):
    row = gm[int(GH * fr)]; e = np.diff(np.r_[0, row.astype(int), 0]); st_, en_ = np.nonzero(e == 1)[0], np.nonzero(e == -1)[0]; runs += list(en_ - st_)
cols = gm.any(0); e = np.diff(np.r_[1, cols.astype(int), 1]); gs, ge = np.nonzero(e == -1)[0], np.nonzero(e == 1)[0]; gaps = [q - p for p, q in zip(gs, ge) if q - p < 60]
print(out, f"word {glyph.width}x{GH}  stem(median run)={int(np.median(runs))} = {np.median(runs) / GH * 100:.0f}% H  min letter gap={min(gaps) if gaps else -1}px  "
      f"payoff {ic.width}x{ic.height} at x={IX}  river-seal min dist={dmin:.0f}")
