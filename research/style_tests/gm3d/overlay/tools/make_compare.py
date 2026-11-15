#!/usr/bin/env python3
"""compare.jpg: Grand Maneuver (real frames, France 1814) vs our overlay (demo snapshots), one row per element.
usage: python3 make_compare.py GM_FRAMEDIR OUR_SNAPDIR OUT.jpg   (our snapshots named frame-NN-at-<t>s.png by `hyperframes snapshot --at`)"""
import glob, os, re, sys
from PIL import Image, ImageDraw, ImageFont

GM, OURS, OUT = sys.argv[1:4]
# element: (GM frame no, box in 1280 px), (our time s, box in 1920 px)
ROWS = [
    ("Date plaque", (241, (20, 30, 330, 120)), (52, (40, 45, 560, 180))),
    ("Clock plaque + pocket watch", (270, (20, 15, 330, 115)), (21, (40, 25, 560, 175))),
    ("Timeline + wax seals", (420, (280, 620, 1000, 705)), (52, (420, 940, 1500, 1067))),
    ("THE ARMIES legend", (106, (20, 560, 310, 700)), (21, (30, 880, 470, 1060))),
    ("Medallion, ivory card + leader line", (106, (280, 160, 440, 330)), (21, (600, 200, 980, 500))),
    ("Medallion, dark plate", (22, (20, 550, 490, 690)), (3.5, (80, 850, 600, 1010))),
    ("Oval inset + ribbon caption", (43, (35, 230, 380, 505)), (29.5, (1300, 130, 1830, 540))),
    ("Letter card", (223, (0, 455, 1280, 612)), (35.5, (0, 680, 1920, 920))),
    ("Centred quote on dim map", (300, (220, 415, 1060, 615)), (44, (380, 580, 1540, 760))),
    ("Event label + marker", (80, (600, 495, 860, 555)), (21, (1240, 735, 1680, 830))),
    ("Title card", (25, (110, 170, 1170, 550)), (10, (100, 220, 1820, 680))),
    ("3D number", (6, (750, 60, 1230, 200)), (29.5, (1040, 500, 1500, 640))),
]
snaps = {float(re.search(r"at-([\d.]+)s", f).group(1)): f for f in glob.glob(f"{OURS}/*.png")}
CW, PAD, LH = 900, 12, 30
try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
except Exception: font = ImageFont.load_default()
tiles = []
for name, (gf, gb), (ot, ob) in ROWS:
    a = Image.open(f"{GM}/f_{gf:04d}.jpg").crop(gb); a = a.resize((int(a.width * 1.5), int(a.height * 1.5)), Image.LANCZOS)
    b = Image.open(snaps[ot]).convert("RGB").crop(ob)
    s = min(CW / max(a.width, b.width), 1.0, 300 / max(a.height, b.height)); a = a.resize((int(a.width * s), int(a.height * s))); b = b.resize((int(b.width * s), int(b.height * s)))
    h = max(a.height, b.height) + LH; t = Image.new("RGB", (CW * 2 + PAD * 3, h + PAD), (24, 24, 24)); d = ImageDraw.Draw(t)
    d.text((PAD, 4), f"{name} - THEIRS (f_{gf:04d}, x1.5)", fill=(240, 200, 120), font=font); d.text((CW + PAD * 2, 4), f"OURS (demo {ot}s)", fill=(140, 210, 255), font=font)
    t.paste(a, (PAD, LH)); t.paste(b, (CW + PAD * 2, LH)); tiles.append(t)
W = tiles[0].width; out = Image.new("RGB", (W, sum(t.height for t in tiles)), (24, 24, 24)); y = 0
for t in tiles: out.paste(t, (0, y)); y += t.height
out.save(OUT, quality=82); print(OUT, out.size)
