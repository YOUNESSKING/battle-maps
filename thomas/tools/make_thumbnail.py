"""YouTube thumbnail (1280x720) in the channel style: map frame background, 1-2 white lines, one red box line,
small place/date tag, general's cut-out on the right. usage: edit THUMBS below, run from <name>/."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"


def font(sz): return ImageFont.truetype(F, sz)


def bg(frame, crop):
    im = Image.open(frame).convert("RGB").crop(crop).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    dark = Image.new("RGB", (W, H), (0, 0, 0))
    mask = Image.linear_gradient("L").rotate(90).resize((W, H))  # darker on the left, where the text sits
    return Image.composite(im, Image.blend(im, dark, 0.45), mask)


def text(d, xy, s, sz, fill="white", stroke=10):
    d.text(xy, s, font=font(sz), fill=fill, stroke_width=stroke, stroke_fill="black")


def make(out, frame, crop, white, red, tag, portrait, pscale=0.54):
    im = bg(frame, crop)
    p = Image.open(portrait).convert("RGBA")
    p = p.resize((int(p.width * H * pscale * 1.6 / p.height), int(H * pscale * 1.6)), Image.LANCZOS)
    glow = Image.new("RGBA", p.size, (0, 0, 0, 0)); glow.putalpha(p.split()[3].filter(ImageFilter.GaussianBlur(18)))
    px, py = W - p.width + 110, H - p.height + 10
    im.paste(Image.new("RGB", p.size, (255, 236, 180)), (px, py), glow.split()[3].point(lambda v: int(v * 0.55)))
    im.paste(p, (px, py), p)
    d = ImageDraw.Draw(im)
    y = 40
    for line in white:
        text(d, (48, y), line, 118); y += 128
    f = font(112); bw = d.textlength(red, font=f) + 60
    d.rectangle((38, y + 18, 38 + bw, y + 178), fill=(196, 18, 31))
    text(d, (68, y + 20), red, 112, fill=(255, 225, 90), stroke=6)
    text(d, (52, H - 92), tag, 44, fill=(243, 230, 194), stroke=6)
    im.save(out.replace(".png", ".jpg"), quality=92); im.save(out)
    im.resize((168, 94), Image.LANCZOS).save(out.replace(".png", "_phone.png"))
    print("wrote", out)


PORTRAIT = "assets/media/thomas_full.png"
make("youtube/thumbnail.png", "youtube/frames/f1000.jpg", (80, 0, 1680, 900), ["ALMOST FIRED"], "ARMY CRUSHED", "NASHVILLE · 1864", PORTRAIT)
make("youtube/thumbnail_B.png", "youtube/frames/f262.jpg", (60, 0, 1660, 900), ["HALF THE ARMY", "RAN"], "HE STAYED", "CHICKAMAUGA · 1863", PORTRAIT)
make("youtube/thumbnail_C.png", "youtube/frames/f255.jpg", (0, 0, 1600, 900), ["THE ROCK OF"], "CHICKAMAUGA", "GEORGE H. THOMAS · 1863", PORTRAIT)
