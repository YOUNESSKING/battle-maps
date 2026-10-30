"""Archive plates for the Cleburne video (our own artwork): wide portraits (portrait over a blurred plate), date cards (headline style).
Sources: assets/media/_src_*.jpg (LoC masters, see CREDITS.md). Run from cleburne/:  python3 tools/make_cards_cleburne.py"""
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
def wide(im, out, fx=0.5):
    bg = cover(im, 0.33).filter(ImageFilter.GaussianBlur(40)); bg = Image.fromarray((np.asarray(bg, np.float32) * 0.45).astype(np.uint8))
    w = int(im.width * H / im.height); fg = im.resize((w, H), Image.LANCZOS); bg.paste(fg, (int(W * fx - w / 2), 0)); bg.save(M + out, quality=93)
def full(im, out):
    im = im.resize((max(1920, im.width), int(im.height * max(1920, im.width) / im.width)), Image.LANCZOS) if im.width < 1920 else im
    im.save(M + out, quality=92)
def datecard(im, year, text, out):
    a = np.asarray(cover(im), np.float32) * 0.5; b = Image.fromarray(a.astype(np.uint8)).convert("RGBA")
    Image.alpha_composite(b, headline_layer(year, text, W, H)).convert("RGB").save(M + out, quality=92)
cl = crop("_src_cleburne_oppenheimer.jpg", (0.09, 0.12, 0.90, 0.84)); wide(cl, "archive_cleburne_w.jpg")
wide(crop("_src_bragg.jpg", (0.10, 0.14, 0.90, 0.70)), "archive_bragg_w.jpg")
wide(crop("_src_grant.jpg", (0.20, 0.17, 0.80, 0.76)), "archive_grant_w.jpg")
wide(crop("_src_hooker.jpg", (0.06, 0.04, 0.94, 0.90)), "archive_hooker_w.jpg")
Image.open(M + "sherman_wide.jpg") if False else None
wide(Image.open(M + "_src_sherman.jpg").convert("RGB"), "archive_sherman_w.jpg")
q = crop("_src_queenstown.jpg", (0.03, 0.045, 0.975, 0.84)); full(q, "archive_cork_queenstown.jpg")
wide(crop("_src_cove1861.jpg", (0.115, 0.08, 0.49, 0.90)), "archive_cork_cove1861_w.jpg")
full(crop("_src_helena.jpg", (0.03, 0.04, 0.97, 0.92)), "archive_helena_fortcurtis.jpg")
wide(crop("_src_depot.jpg", (0.04, 0.05, 0.96, 0.90)), "archive_chattanooga_depot_w.jpg")
datecard(q, "1828", "COUNTY CORK, IRELAND", "card_1828_cork.jpg")
datecard(crop("_src_depot.jpg", (0.04, 0.05, 0.96, 0.90)), "1863", "CHATTANOOGA, TENNESSEE", "card_1863_chattanooga.jpg")
print("ok")
