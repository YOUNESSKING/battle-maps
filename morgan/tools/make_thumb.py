"""Thumbnail (HANDOVER 1b / STYLE_LOCK 0b formula): vidIQ battlefield (left 2/3; its wrong-way arrows inpainted out and
redrawn as the real double envelopment) + Morgan's real portrait (Peale, PD) cut out on the right third + red brush banner.
usage (from morgan/): python3 tools/make_thumb.py -> youtube/thumb/morgan-thumb-{A,B}.jpg"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
from rembg import remove, new_session

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
bg = Image.open("youtube/thumb/bg_clean.png").convert("RGB").resize((W, H), Image.LANCZOS)


def bez(p0, c, p1, n=60):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1])
            for t in np.linspace(0, 1, n)]


def arrow(layer, p0, c, p1, w=30):
    pts = bez(p0, c, p1)
    d = ImageDraw.Draw(layer)
    (x1, y1), (x2, y2) = pts[-6], pts[-1]
    v = np.array([x2 - x1, y2 - y1]); v = v / np.linalg.norm(v); nrm = np.array([-v[1], v[0]])
    tip = np.array([x2, y2]) + v * 26
    head = [tuple(tip), tuple(np.array([x2, y2]) + nrm * w * 1.25), tuple(np.array([x2, y2]) - nrm * w * 1.25)]
    dense = bez(p0, c, p1, 400)[:-8]
    for col, ww, hd in (((25, 20, 15, 230), w + 8, 6), ((250, 250, 250, 255), w, 0)):
        for (x, y) in dense:  # smooth stroke: overlapping discs (PIL wide polylines show segment joints)
            d.ellipse([x - ww / 2, y - ww / 2, x + ww / 2, y + ww / 2], fill=col)
        hh = [tuple(tip + v * hd)] + [tuple(np.array(p) + (np.array(p) - np.array([x2, y2])) * (hd / 40)) for p in head[1:]]
        d.polygon(hh, fill=col)


lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
arrow(lay, (235, 350), (215, 545), (455, 575))       # American left (militia + cavalry) around the British right
arrow(lay, (590, 268), (770, 240), (800, 345))       # American right around the British left
base = bg.convert("RGBA"); base.alpha_composite(lay.filter(ImageFilter.GaussianBlur(0.6)))
d = ImageDraw.Draw(base); f = ImageFont.truetype(F, 24)


def tag(t, x, y, col):
    w = d.textlength(t, font=f); d.rectangle([x, y, x + w + 20, y + 34], fill=(18, 16, 12)); d.rectangle([x, y, x + w + 20, y + 34], outline=col, width=3)
    d.text((x + 10, y + 2), t, font=f, fill=(247, 243, 234))


tag("MORGAN", 96, 236, (60, 110, 230)); tag("TARLETON", 640, 610, (210, 40, 40)); tag("COWPENS · 1781", 560, 196, (201, 180, 138))
# right third: shade + Morgan cut-out (Peale portrait, background removed), looking toward the map
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(460):
    sd.line([(W - 460 + i, 0), (W - 460 + i, H)], fill=(0, 0, 0, int(170 * i / 460)))
base.alpha_composite(shade)
src = Image.open("assets/media/morgan_head.png").convert("RGBA")
flat = Image.new("RGB", src.size, (40, 40, 40)); flat.paste(src, mask=src.split()[3])
cut = remove(flat, session=new_session("isnet-general-use")); cut = cut.crop(cut.getbbox())
g = ImageEnhance.Contrast(cut).enhance(1.12); g.putalpha(cut.split()[3])
h = int(H * 0.98); w = int(g.width * h / g.height); g = g.resize((w, h), Image.LANCZOS)
glow = Image.new("RGBA", g.size, (255, 210, 140, 0)); glow.putalpha(g.split()[3].filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * 0.45)))
x0 = W - w + int(w * 0.06)
base.alpha_composite(glow, (x0, H - h)); base.alpha_composite(g, (x0, H - h))


def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx, by = 34, 40  # top-left over the empty sky: bottom-left would hide the British line
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon([(bx - 10, by + 14), (bx + tw + 60, by - 4), (bx + tw + 74, by + size + 40), (bx + 6, by + size + 54)], fill=(176, 18, 26, 240))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(1.2)))
    dr.text((bx + 26, by + 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(60, 0, 0))
    im.convert("RGB").save(out, quality=92); im.convert("RGB").save(out[:-4] + ".png"); print(out)


banner("LET THEM RUN", "youtube/thumb/morgan-thumb-A-let-them-run.jpg", 118)
banner("ONE HOUR", "youtube/thumb/morgan-thumb-B-one-hour.jpg", 128)
