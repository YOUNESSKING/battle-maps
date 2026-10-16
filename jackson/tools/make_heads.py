#!/usr/bin/env python3
"""Square face crops (400x400 RGB) from jackson/assets/media/<name>_src.jpg.
Box = (left, top, right, bottom) in source pixels. Run: python3 jackson/tools/make_heads.py [name ...]"""
import sys
from PIL import Image
M = "/home/user/battle-maps/jackson/assets/media/"
BOXES = {
    "peng":      ("peng_src.jpg",      (50, 40, 320, 310)),
    "walker":    ("walker_src.jpg",    (60, 10, 440, 390)),
    "keiser":    ("keiser_src.jpg",    (0, 40, 1000, 1040)),
    "macarthur": ("macarthur_src.jpg", (600, 580, 860, 840)),
    "gay":       ("gay_src.jpg",       (105, 10, 275, 180)),
    "peng53":    ("peng53_src.jpg",    (250, 150, 480, 380)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    im = Image.open(M + f).convert("RGB").crop(box).resize((400, 400), Image.LANCZOS)
    im.save(M + k + "_head.png")
    print(k, box)
