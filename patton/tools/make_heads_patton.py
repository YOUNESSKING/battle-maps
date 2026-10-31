#!/usr/bin/env python3
"""Square face crops (400x400 RGB) -> assets/media/<name>_head_flat.png from <name>_src.jpg (patton video #15).
Then cutout_heads_patton.py makes the RGBA <name>_head.png (rembg isnet-general-use). Run: python3 patton/tools/make_heads_patton.py [name ...]
Names whose flat crop was copied from collins/assets/media (bradley, montgomery, collins) have no box here."""
import sys
from PIL import Image
M = "/home/user/battle-maps/patton/assets/media/"
BOXES = {
    "patton":    ("patton_src.jpg",    (265, 100, 585, 420)),
    "mcauliffe": ("mcauliffe_src.jpg", (190, 0, 470, 280)),
    "haislip":   ("haislip_src.jpg",   (35, 0, 235, 200)),
    "middleton": ("middleton_src.jpg", (350, 0, 550, 200)),
    "abrams":    ("abrams_src.jpg",    (55, 5, 255, 205)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    im = Image.open(M + f).convert("RGB").crop(box).resize((400, 400), Image.LANCZOS)
    im.save(M + k + "_head_flat.png"); print(k, box)
