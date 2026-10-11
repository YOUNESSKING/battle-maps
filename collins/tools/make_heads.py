#!/usr/bin/env python3
"""Square face crops (400x400 RGB, like rokossovsky/collins heads) from collins/assets/media/<name>_src.jpg.
Box = (left, top, right, bottom) in source pixels. Run: python3 collins/tools/make_heads.py [name ...]"""
import sys
from PIL import Image
M = "/home/user/battle-maps/collins/assets/media/"
BOXES = {
    "bradley":    ("bradley_src.jpg",    (180, 100, 840, 760)),
    "montgomery": ("montgomery_src.jpg", (330, 230, 990, 890)),
    "patton":     ("patton_src.jpg",     (680, 170, 1040, 530)),
    "schlieben":  ("schlieben_src.jpg",  (210, 50, 570, 410)),
    "white":      ("white_src.jpg",      (60, 10, 560, 510)),
    "collins48":  ("collins48_src.jpg",  (200, 60, 800, 660)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    im = Image.open(M + f).convert("RGB").crop(box).resize((400, 400), Image.LANCZOS)
    im.save(M + k + "_head.png")
    print(k, box)
