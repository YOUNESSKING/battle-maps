"""Render one archive clip: slow Ken Burns move over a still image, with vignette, grain and a small credit line.

usage (module): kenburns(src, out, dur, move="in"|"out"|"left"|"right"|"up", credit="", quote=None)
Tall images (portraits) are fitted to height over a blurred, darkened copy of themselves.
A quote (text, attribution) turns the clip into a quote card: image darkened on the left, quote on the right.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1920, 1080, 30
HERE = os.path.dirname(os.path.abspath(__file__))
FONT_Q = os.path.join(HERE, "special-elite-latin-400-normal.ttf")
FONT_C = os.path.join(HERE, "oswald-latin-700-normal.ttf")


def _vignette():
    y, x = np.mgrid[0:H, 0:W]
    d = np.sqrt(((x - W / 2) / (W / 2)) ** 2 + ((y - H / 2) / (H / 2)) ** 2)
    return np.clip(1.0 - 0.55 * np.clip(d - 0.55, 0, 1) ** 1.6, 0, 1)[..., None]


def _canvas(img, scale=1.25):
    """Big canvas (scale x output) the camera moves over."""
    cw, ch = int(W * scale), int(H * scale)
    iw, ih = img.size
    if iw / ih >= 1.45:  # landscape: cover
        r = max(cw / iw, ch / ih)
        im = img.resize((int(iw * r + 1), int(ih * r + 1)), Image.LANCZOS)
        l, t = (im.width - cw) // 2, (im.height - ch) // 2
        return im.crop((l, t, l + cw, t + ch))
    bg = img.resize((cw, int(cw * ih / iw)), Image.LANCZOS)
    t = (bg.height - ch) // 2
    bg = bg.crop((0, t, cw, t + ch)).filter(ImageFilter.GaussianBlur(40))
    bg = Image.eval(bg, lambda v: int(v * 0.35))
    r = ch / ih
    fg = img.resize((int(iw * r), ch), Image.LANCZOS)
    bg.paste(fg, ((cw - fg.width) // 2, 0))
    return bg


def _quote_layer(quote):
    text, who = quote
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rectangle([W * 0.5, 0, W, H], fill=(12, 10, 8, 200))
    f, fs = ImageFont.truetype(FONT_Q, 64), ImageFont.truetype(FONT_C, 34)
    words, lines, cur = text.split(), [], ""
    for w_ in words:
        if d.textlength(cur + " " + w_, font=f) > W * 0.42 and cur:
            lines.append(cur); cur = w_
        else:
            cur = (cur + " " + w_).strip()
    lines.append(cur)
    y = H / 2 - len(lines) * 44 - 30
    for ln in lines:
        d.text((W * 0.54, y), ln, font=f, fill=(244, 241, 234, 255)); y += 88
    d.rectangle([W * 0.54, y + 22, W * 0.54 + 90, y + 28], fill=(196, 18, 31, 255))
    d.text((W * 0.54, y + 44), who.upper(), font=fs, fill=(210, 200, 180, 255))
    return lay


def kenburns(src, out, dur, move="in", credit="", quote=None):
    img = Image.open(src).convert("RGB")
    if quote:  # portrait on the left half
        iw, ih = img.size
        r = H * 1.1 / ih
        img_s = img.resize((int(iw * r), int(ih * r)), Image.LANCZOS)
        base = Image.new("RGB", (int(W * 1.1), int(H * 1.1)), (14, 12, 10))
        base.paste(img_s, (int(W * 0.26 - img_s.width / 2 + W * 0.05), 0))
        canvas = base
    else:
        canvas = _canvas(img)
    cw, ch = canvas.size
    arr = np.asarray(canvas, np.float32)
    vig = _vignette()
    grain_rng = np.random.default_rng(7)
    over = None
    if quote:
        over = _quote_layer(quote)
    elif credit:
        over = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(over)
        fc = ImageFont.truetype(FONT_C, 22)
        tw = d.textlength(credit, font=fc)
        d.rectangle([28, H - 64, 28 + tw + 28, H - 28], fill=(0, 0, 0, 120))
        d.text((42, H - 60), credit, font=fc, fill=(235, 230, 218, 230))
    over_a = None if over is None else np.asarray(over, np.float32)
    n = int(round(dur * FPS))
    # (zoom, cx, cy) start -> end, zoom 1 = the output shows W x H canvas pixels
    zmax = min(cw / W, ch / H)
    moves = {
        "in": ((1.0, 0.5, 0.5), (zmax, 0.5, 0.45)),
        "out": ((zmax, 0.5, 0.45), (1.0, 0.5, 0.5)),
        "left": ((zmax * 0.92, 0.62, 0.5), (zmax * 0.92, 0.38, 0.5)),
        "right": ((zmax * 0.92, 0.38, 0.5), (zmax * 0.92, 0.62, 0.5)),
        "up": ((zmax * 0.95, 0.5, 0.6), (zmax, 0.5, 0.38)),
    }
    (z0, x0, y0), (z1, x1, y1) = moves[move]
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                           "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    ease = lambda t: t * t * (3 - 2 * t)
    for i in range(n):
        t = ease(i / max(n - 1, 1))
        z = z0 + (z1 - z0) * t
        vw, vh = W * (cw / W) / z, H * (ch / H) / z
        vw, vh = min(vw, cw), min(vh, ch)
        cx = np.clip((x0 + (x1 - x0) * t) * cw, vw / 2, cw - vw / 2)
        cy = np.clip((y0 + (y1 - y0) * t) * ch, vh / 2, ch - vh / 2)
        box = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)
        fr = np.asarray(canvas.transform((W, H), Image.EXTENT, box, Image.BICUBIC), np.float32)
        fr = fr * vig
        if over_a is not None:
            a = over_a[..., 3:4] / 255
            fr = fr * (1 - a) + over_a[..., :3] * a
        fr += grain_rng.normal(0, 5, (H // 4, W // 4, 1)).repeat(4, 0).repeat(4, 1)
        fade = min(1, i / 9, (n - 1 - i) / 9) if dur > 2 else 1
        ff.stdin.write(np.clip(fr * (0.35 + 0.65 * fade), 0, 255).astype(np.uint8).tobytes())
    ff.stdin.close(); ff.wait()


if __name__ == "__main__":
    kenburns(sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4] if len(sys.argv) > 4 else "in")
