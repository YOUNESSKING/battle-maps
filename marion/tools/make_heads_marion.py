#!/usr/bin/env python3
"""Marion #18 banner heads: 600x600 RGB crops <key>_head_flat.png from /tmp-free sources in marion/assets/media/src/.
Run: python3 marion/tools/make_heads_marion.py [key ...]; then python3 marion/tools/cutout_heads.py key ... (rembg)."""
import sys
from PIL import Image
M = "/home/user/battle-maps/marion/assets/media/"
S = M + "src/"
BOXES = {
    "marion":   ("marion_lc4k.jpg", (1895, 640, 2335, 1080)),
    "greene":   ("greene.jpg",   (420, 400, 1560, 1540)),
    "tarleton": ("tarleton.jpg", (650, 500, 1500, 1350)),
    "lee":      ("lee2.jpg",     (300, 250, 1400, 1350)),
    "rawdon":   ("rawdon.jpg",   (620, 420, 1220, 1020)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    Image.open(S + f).convert("RGB").crop(box).resize((600, 600), Image.LANCZOS).save(M + k + "_head_flat.png")
    print(k, box)
