"""s12d_rt: softer hills (rough 0.8, blur ~1 px at 1080p, cooler highlights) -> hills/soft/ (originals untouched)"""
import json, sys
sys.path.insert(0, '/home/user/battle-maps/research/style_tests/roads_towns/hills')
import numpy as np
from PIL import Image
import make_hill as M
OUT = '/home/user/battle-maps/research/style_tests/roads_towns/hills/soft'
KW = dict(rough=1.0, blur=0.9, warm=0.75, crest=0.55)   # round 2 compromise (coordinator 2026-11-08)
ridge = [(x * 2, y * 2) for x, y in json.load(open(f'{M.REPO}/grant/assets/src/vicksburg_story.json'))['ridge']]
for key, suffix in (('w', ''), ('w_close', '_close')):
    base = np.asarray(Image.open(f'{M.ASSETS}/vicksburg_{key}.jpg').convert('RGB'))
    rgba, comp, bb = M.render_hills(base, M.champion_shapes(), erase=[('circle', 3268, 1414, 74)], seed=11, shadow=1.0, **KW)
    Image.fromarray(rgba).save(f'{OUT}/champion_hill{suffix}.png', optimize=True)
    rgba2, comp2, bb2 = M.render_hills(base, M.bluffs_shapes(), erase=[('line', ridge, 46)], seed=5, shadow=0.9, weight=0.8, **KW)   # bluffs ~20 % lighter
    Image.fromarray(rgba2).save(f'{OUT}/vicksburg_bluffs{suffix}.png', optimize=True)
    print(key, bb, bb2)
