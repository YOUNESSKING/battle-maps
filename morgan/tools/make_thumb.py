"""Thumbnail in the Tactical Genius style (HANDOVER 1b / STYLE_LOCK 0b): vidIQ battlefield (dense 3D unit counters,
gritty, desaturated; references = TG Ridgway / Patton / Zhukov) on the left 2/3, Morgan's real portrait (Charles Willson
Peale, public domain) emerging from the dark on the right third, small photo name tags on the map, red brush banner bottom-left.
usage (from morgan/): python3 tools/make_thumb.py -> youtube/thumb/morgan-thumb-{A,B}.jpg/.png"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance, ImageOps

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
rng = np.random.default_rng(3)

# 1) battlefield, shifted left so the British mass + both envelopment arrows stay clear of the portrait
bg = Image.open("youtube/thumb/bg_vidiq2.png").convert("RGB").resize((W, H), Image.LANCZOS)
SHIFT = -215
canvas = Image.new("RGB", (W, H), (14, 14, 14)); canvas.paste(bg, (SHIFT, 0))
canvas = ImageEnhance.Color(canvas).enhance(0.85); canvas = ImageEnhance.Contrast(canvas).enhance(1.08)
base = canvas.convert("RGBA")

# 2) dark right third (TG: the commander stands in shadow at the edge of the map)
shade = Image.new("L", (W, H), 0); sd = ImageDraw.Draw(shade)
for i in range(520):
    sd.line([(W - 520 + i, 0), (W - 520 + i, H)], fill=int(235 * min(1, (i / 520) ** 0.8)))
base.alpha_composite(Image.merge("RGBA", (*[Image.new("L", (W, H), 10)] * 3, shade)))

# 3) Morgan: real portrait (Peale, PD) CUT OUT cleanly (rembg birefnet-portrait on the inside of the painted oval, so no dark
#    painted background / halo around him - owner v6), desaturated + contrast (gritty), bleeding off the bottom/right edges
cut = Image.open("assets/media/morgan_peale_cut.png").convert("RGBA")
alpha = cut.split()[3]
g = ImageEnhance.Color(cut.convert("RGB")).enhance(0.6); g = ImageEnhance.Contrast(g).enhance(1.2)
h = 800; w = int(cut.width * h / cut.height)
g = g.resize((w, h), Image.LANCZOS); alpha = alpha.resize((w, h), Image.LANCZOS).point(lambda v: 0 if v < 40 else min(255, int((v - 40) * 1.2)))
port = g.convert("RGBA"); port.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.8)))
px, py = W - w + 70, H - h + 60
base.alpha_composite(port, (px, py))

# 4) TG name tags: small square photo + dark plate under it
d = ImageDraw.Draw(base); ft = ImageFont.truetype(F, 18)


def photo_tag(img, name, x, y, col):
    p = Image.open(img).convert("RGBA"); p = ImageOps.fit(p, (64, 72), centering=(0.5, 0.25))
    frame = Image.new("RGBA", (70, 78), (20, 18, 14, 255)); frame.alpha_composite(p, (3, 3))
    ImageDraw.Draw(frame).rectangle([0, 0, 69, 77], outline=col, width=3)
    base.alpha_composite(frame, (x, y))
    tw = d.textlength(name, font=ft); d.rectangle([x + 35 - tw / 2 - 8, y + 80, x + 35 + tw / 2 + 8, y + 106], fill=(18, 16, 12))
    d.text((x + 35 - tw / 2, y + 81), name, font=ft, fill=(240, 236, 226))


def place(t, x, y):
    tw = d.textlength(t, font=ft); d.rectangle([x, y, x + tw + 16, y + 28], fill=(18, 16, 12)); d.rectangle([x, y, x + tw + 16, y + 28], outline=(200, 196, 186), width=1)
    d.text((x + 8, y + 2), t, font=ft, fill=(240, 236, 226))


photo_tag("assets/media/morgan_head.png", "MORGAN", 150, 130, (70, 110, 220))
photo_tag("assets/media/tarleton_head.png", "TARLETON", 520, 355, (210, 45, 45))
place("COWPENS", 300, 40)


# 5) red brush banner (rough edges), bottom-left, overlapping the map
def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); fnt = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=fnt); x0, y0 = 22, H - size - 70; x1, y1 = x0 + tw + 70, H - 26
    m = Image.new("L", (W, H), 0); md = ImageDraw.Draw(m)
    top = [(x, y0 + 10 + rng.normal(0, 4)) for x in np.linspace(x0 + 14, x1 - 20, 40)]
    bot = [(x, y1 - 6 + rng.normal(0, 5)) for x in np.linspace(x1 - 10, x0 + 4, 40)]
    md.polygon(top + [(x1 + 8, (y0 + y1) / 2)] + bot + [(x0 - 6, (y0 + y1) / 2 + 6)], fill=255)
    for _ in range(90):  # dry-brush streaks at the ends
        yy0 = rng.uniform(y0 + 12, y1 - 10); L = rng.uniform(20, 70); th = rng.uniform(2, 6)
        xe = x1 + rng.uniform(-30, 10) if rng.random() < 0.6 else x0 + rng.uniform(-10, 25)
        md.line([(xe, yy0), (xe + (L if xe > x0 + 40 else -L), yy0 + rng.normal(0, 2))], fill=int(rng.uniform(120, 255)), width=int(th))
    m = m.filter(ImageFilter.GaussianBlur(1.1))
    tex = (np.asarray(Image.new("RGB", (W, H), (178, 20, 26)), np.float32) * (0.82 + 0.18 * rng.random((H, W, 1)))).clip(0, 255).astype(np.uint8)
    red = Image.fromarray(tex).convert("RGBA"); red.putalpha(m)
    im.alpha_composite(red)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(shadow).text((x0 + 40, y0 + 2), text, font=fnt, fill=(0, 0, 0, 200))
    im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(4)), (4, 6))
    dr = ImageDraw.Draw(im); dr.text((x0 + 36, y0 - 2), text, font=fnt, fill=(255, 255, 255))
    im = im.convert("RGB"); im.save(out, quality=93); im.save(out[:-4] + ".png"); print(out)


banner("LET THEM RUN", "youtube/thumb/morgan-thumb-A-let-them-run.jpg", 112)
banner("ONE HOUR", "youtube/thumb/morgan-thumb-B-one-hour.jpg", 124)
