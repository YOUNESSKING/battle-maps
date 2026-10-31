"""Archive plates for the Patton video: wide portrait (portrait over a blurred plate), date cards (headline style), plain stills.
Sources: assets/media/_src_*.jpg (see CREDITS.md). Run from patton/:  python3 tools/make_cards_patton.py"""
import sys
import numpy as np
from PIL import Image, ImageFilter
sys.path.insert(0, "tools")
from archive_shots import headline_layer
M = "assets/media/"; W, H = 1920, 1080
def cover(im, fy=0.35):
    k = max(W / im.width, H / im.height); im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    x0 = (im.width - W) // 2; y0 = int(min(max(im.height * fy - H / 2, 0), im.height - H)); return im.crop((x0, y0, x0 + W, y0 + H))
def crop(src, box):
    im = Image.open(M + src).convert("RGB"); w, h = im.size
    return im.crop((int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h)))
def wide(im, out, fx=0.5, fy=0.33):
    bg = cover(im, fy).filter(ImageFilter.GaussianBlur(40)); bg = Image.fromarray((np.asarray(bg, np.float32) * 0.45).astype(np.uint8))
    w = int(im.width * H / im.height); fg = im.resize((w, H), Image.LANCZOS); bg.paste(fg, (int(W * fx - w / 2), 0)); bg.save(M + out, quality=93)
def full(im, out):
    im = im.resize((1920, int(im.height * 1920 / im.width)), Image.LANCZOS) if im.width < 1920 else im
    im.save(M + out, quality=92)
def datecard(im, year, text, out):
    a = np.asarray(cover(im), np.float32) * 0.5; b = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
    Image.alpha_composite(b, headline_layer(year, text, W, H)).convert("RGB").save(M + out, quality=92)
la = crop("_src_la1885.jpg", (0.045, 0.045, 0.965, 0.965))
wide(crop("_src_patton_portrait.jpg", (0, 0, 1, 1)), "archive_patton_w.jpg", fx=0.5)
full(la, "archive_la1885.jpg")
full(crop("_src_sicily.jpg", (0.0, 0.0, 1.0, 1.0)), "archive_sicily1943.jpg")
datecard(la, "1885", "CALIFORNIA", "card_1885_california.jpg")
datecard(crop("_src_sicily.jpg", (0, 0, 1, 1)), "AUGUST 1943", "SICILY", "card_1943_sicily.jpg")
datecard(Image.open(M + "_src_frame_normandy.png").convert("RGB"), "1 AUGUST 1944", "NORMANDY", "card_1944_normandy.jpg")
print("ok")
