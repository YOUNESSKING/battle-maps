#!/usr/bin/env python3
"""Square face crops (400x400 RGB) from jackson/assets/media/<name>_src.jpg.
Box = (left, top, right, bottom) in source pixels. Run: python3 jackson/tools/make_heads.py [name ...]"""
import sys
from PIL import Image
M = "/home/user/battle-maps/jackson/assets/media/"
BOXES = {
    "jackson":    ("jackson_src.jpg",    (180, 80, 1000, 900)),
    "banks":      ("banks_src.jpg",      (318, 200, 482, 364)),
    "fremont":    ("fremont_src.jpg",    (110, 190, 390, 470)),
    "shields":    ("shields_src.jpg",    (277, 300, 444, 466)),
    "pope":       ("pope_src.jpg",       (218, 141, 397, 320)),
    "hooker":     ("hooker_src.jpg",     (281, 204, 447, 370)),
    "howard":     ("howard_src.jpg",     (192, 230, 448, 486)),
    "lee":        ("lee_src.jpg",        (205, 154, 486, 435)),
    "longstreet": ("longstreet_src.jpg", (270, 351, 540, 621)),
    "mcdowell":   ("mcdowell_src.jpg",   (390, 284, 646, 540)),
    "lincoln":    ("lincoln_src.jpg",    (197, 243, 376, 422)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    im = Image.open(M + f).convert("RGB").crop(box).resize((400, 400), Image.LANCZOS)
    im.save(M + k + "_head.png")
    print(k, box)
