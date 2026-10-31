#!/usr/bin/env python3
"""RGBA cut-out <name>_head.png from <name>_head_flat.png with rembg (isnet-general-use). python3 patton/tools/cutout_heads_patton.py name ..."""
import sys
from PIL import Image
from rembg import new_session, remove
M = "/home/user/battle-maps/patton/assets/media/"
s = new_session("isnet-general-use")
for k in sys.argv[1:]:
    remove(Image.open(M + k + "_head_flat.png").convert("RGB"), session=s).save(M + k + "_head.png"); print(k)
