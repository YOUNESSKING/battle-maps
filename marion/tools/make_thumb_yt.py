"""Yorktown thumbnails (PACKAGING_GUIDE 0b + STYLE_LOCK 6): our own rendered map frame (dark, desaturated context) on the left 2/3,
Washington's REAL public-domain portrait (C. W. Peale) cut out in COLOUR on the right third with a face pop, red brush banner 1-3 words.
usage: python3 tools/make_thumb_yt.py KEY FRAME.png "TEXT"  -> youtube/thumb/yorktown-thumb-KEY.jpg ; then --sheet makes the review sheet"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
os.makedirs("youtube/thumb", exist_ok=True)

def cutout():
    p = "youtube/thumb/washington_cut.png"
    if not os.path.exists(p):
        from rembg import remove, new_session
        cut = remove(Image.open("assets/media/src/washington.jpg").convert("RGB"), session=new_session("isnet-general-use"))
        cut.crop(cut.getbbox()).save(p)
    return Image.open(p).convert("RGBA")

def brush(d, x, y, w, h, rng):
    """rough torn red brush-stroke banner"""
    pts_top = [(x + i, y + rng.integers(-6, 7)) for i in range(0, w + 1, 18)]
    pts_bot = [(x + i, y + h + rng.integers(-7, 8)) for i in range(w, -1, -18)]
    d.polygon(pts_top + [(x + w + rng.integers(4, 22), y + h // 2)] + pts_bot + [(x - rng.integers(4, 18), y + h // 2)], fill=(176, 18, 24))

def make(key, frame, text):
    rng = np.random.default_rng(len(text))
    bg = Image.open(frame).convert("RGB").resize((W, H), Image.LANCZOS)
    bg = ImageEnhance.Color(bg).enhance(0.72); bg = ImageEnhance.Brightness(bg).enhance(0.78); bg = ImageEnhance.Contrast(bg).enhance(1.12)
    bg = bg.convert("RGBA")
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
    for i in range(460): sd.line([(W - 460 + i, 0), (W - 460 + i, H)], fill=(8, 8, 6, int(185 * i / 460)))
    bg = Image.alpha_composite(bg, shade)
    cut = cutout()
    h = int(H * 1.10); w = int(cut.width * h / cut.height); g = cut.resize((w, h), Image.LANCZOS)
    a = g.split()[3]
    rgb = ImageEnhance.Contrast(ImageEnhance.Color(g.convert("RGB")).enhance(1.25)).enhance(1.18)   # face pop
    g = rgb.convert("RGBA"); g.putalpha(a)
    rim = Image.new("RGBA", g.size, (255, 236, 200, 0)); rim.putalpha(a.filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.22)))
    x0 = W - int(w * 0.92); y0 = H - h + int(h * 0.06)
    bg.alpha_composite(rim, (x0 - 3, y0)); bg.alpha_composite(g, (x0, y0))
    d = ImageDraw.Draw(bg)
    f = ImageFont.truetype(F, 112 if len(text) <= 10 else 92)
    tw = d.textlength(text, font=f); bx, by, bh = 38, H - 196, 148
    brush(d, bx, by, int(tw + 70), bh, rng)
    d.text((bx + 36, by + bh // 2 + 4), text, font=f, fill=(250, 246, 236), anchor="lm", stroke_width=3, stroke_fill=(20, 10, 8))
    out = f"youtube/thumb/yorktown-thumb-{key}.jpg"; bg.convert("RGB").save(out, quality=94); print(out)

def sheet(keys):
    ims = [Image.open(f"youtube/thumb/yorktown-thumb-{k}.jpg") for k in keys]
    big = 640; sh = Image.new("RGB", (big * len(ims) + 20 * (len(ims) + 1), 360 + 40 + 94 + 60), (24, 22, 20)); d = ImageDraw.Draw(sh)
    f = ImageFont.truetype(F, 22)
    for i, (k, im) in enumerate(zip(keys, ims)):
        x = 20 + i * (big + 20)
        sh.paste(im.resize((big, 360), Image.LANCZOS), (x, 40)); d.text((x, 10), f"THUMB {k}", font=f, fill=(230, 220, 200))
        sh.paste(im.resize((168, 94), Image.LANCZOS), (x, 420)); d.text((x + 180, 450), "feed size 168x94", font=f, fill=(170, 160, 140))
    sh.save("youtube/thumb/thumb_sheet.jpg", quality=92); print("youtube/thumb/thumb_sheet.jpg")

if __name__ == "__main__":
    if sys.argv[1] == "--sheet": sheet(sys.argv[2:])
    else: make(sys.argv[1], sys.argv[2], sys.argv[3])
