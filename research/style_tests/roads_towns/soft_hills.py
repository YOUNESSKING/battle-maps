"""s12d_rt: softer hills (rough 0.8, blur ~1 px at 1080p, cooler highlights) -> hills/soft/ (originals untouched)"""
import json, sys
sys.path.insert(0, '/home/user/battle-maps/research/style_tests/roads_towns/hills')
import numpy as np
from PIL import Image
import make_hill as M
OUT = '/home/user/battle-maps/research/style_tests/roads_towns/hills/soft'
KW = dict(rough=1.0, blur=0.9, warm=0.75, crest=0.55)   # round 2 compromise (coordinator 2026-11-08)
import math
def champion_small():
    """round 4 (critic 1 blocker): Champion Hill at ~100 x 75 px on screen at s 1.9 (~4 x 3 mi, compromise between the real
    ~1-2 mi ridge and the owner's chunky reference), centred just SW of the battle cross (screen ~1122,524 -> image px 3260,1397),
    a NW-SE crescent bowed to the NE, Edwards on open ground to the west, the Raymond road south of it."""
    cx, cy = 3262.0, 1400.0   # screen ~(1123, 527), at the battle cross (further SW would run into Edwards)
    u = (math.cos(math.radians(45)), math.sin(math.radians(45)))       # NW -> SE (image y down)
    n = (u[1], -u[0])                                                   # NE normal
    pts, wd, hs = [], [], []
    for i in range(7):
        t = -1 + 2 * i / 6
        b = 14 * (1 - t * t)
        pts.append((cx + 40 * t * u[0] + b * n[0], cy + 40 * t * u[1] + b * n[1]))
        wd.append(28 + 16 * (1 - t * t)); hs.append(0.55 + 0.45 * (1 - t * t) ** 0.7)
    return [M.Ridge(pts, 20, widths=wd, heights=hs, irregular=0.22),
            M.Blob(cx + 6 * n[0] - 6 * u[0], cy + 6 * n[1] - 6 * u[1], 50, 38, rot=45, height=0.95, irregular=0.25)]
CH_KW = dict(rough=0.85, blur=1.0, warm=1.0, crest=0.62, lit=0.9, hi_desat=0.5, mass=1.3)   # round 4 (critic 2): olive-tan, ~17 % dimmer, softer, deeper SE
ridge = [(x * 2, y * 2) for x, y in json.load(open(f'{M.REPO}/grant/assets/src/vicksburg_story.json'))['ridge']]
for key, suffix in (('w', ''), ('w_close', '_close')):
    base = np.asarray(Image.open(f'{M.ASSETS}/vicksburg_{key}.jpg').convert('RGB'))
    rgba, comp, bb = M.render_hills(base, champion_small(), erase=[('circle', 3268, 1414, 74)], clean_extra=[(3268, 1414, 84)], seed=11, shadow=1.25, **CH_KW)
    Image.fromarray(rgba).save(f'{OUT}/champion_hill{suffix}.png', optimize=True)
    rgba2, comp2, bb2 = M.render_hills(base, M.bluffs_shapes(), erase=[('line', ridge, 46)], seed=5, shadow=0.9, weight=0.8, **KW)   # bluffs ~20 % lighter
    Image.fromarray(rgba2).save(f'{OUT}/vicksburg_bluffs{suffix}.png', optimize=True)
    print(key, bb, bb2)
