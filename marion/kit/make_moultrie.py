"""The Moultrie flag (2nd South Carolina Regiment, 1775; MAP_BRIEF: representative symbol for Marion's partisans) + its banner pennant.
Indigo-blue field, a plain white crescent in the upper hoist corner (horns toward the upper fly), no lettering; same pixel size + style as
assets/media/us_flag_13star.png (600 x 316 RGBA, flat colours, no keyline: the kit frames every flag). The pennant (banner lower flag, ~60 x 32 px on screen)
uses a bigger crescent and a gold edge so it still reads at banner size (cf. kit/make_pennant.py, the French pennant).
Writes NEW files assets/media/moultrie_flag.png + moultrie_pennant.png.  python3 kit/make_moultrie.py   (from marion/)"""
import os
from PIL import Image, ImageDraw
INDIGO, WHITE, KEY = (34, 58, 112, 255), (246, 243, 234, 255), (20, 24, 40, 255)
GOLD, GOLD_D = (218, 172, 58, 255), (120, 84, 24, 255)
def crescent(d, cx, cy, r, S, col, bg):
    """a crescent: white disc minus an offset disc of the field colour; horns point up-right (toward the upper fly)"""
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    k = 0.80; ox, oy = 0.36 * r, -0.30 * r
    d.ellipse([cx + ox - r * k, cy + oy - r * k, cx + ox + r * k, cy + oy + r * k], fill=bg)
def make(out, W=600, H=316, S=4, pennant=False):
    im = Image.new("RGBA", (W * S, H * S), INDIGO); d = ImageDraw.Draw(im)
    if pennant:   # gold edge + dark keyline like the French pennant, crescent big and central-left
        d.rectangle([0, 0, W * S - 1, H * S - 1], fill=GOLD_D); d.rectangle([5 * S, 5 * S, W * S - 5 * S, H * S - 5 * S], fill=GOLD)
        e = 20 * S; d.rectangle([e, e, W * S - e, H * S - e], fill=KEY); d.rectangle([e + 3 * S, e + 3 * S, W * S - e - 3 * S, H * S - e - 3 * S], fill=INDIGO)
        crescent(d, 0.40 * W * S, 0.52 * H * S, 0.30 * H * S, S, WHITE, INDIGO)
    else:
        crescent(d, 0.205 * W * S, 0.30 * H * S, 0.19 * H * S, S, WHITE, INDIGO)
    p = f"assets/media/{out}"
    if os.path.exists(p) and os.stat(p).st_nlink > 1: os.unlink(p)
    im.resize((W, H), Image.LANCZOS).save(p); print(p)
make("moultrie_flag.png"); make("moultrie_pennant.png", pennant=True)
