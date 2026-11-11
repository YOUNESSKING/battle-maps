"""s12d_full: camps v2 (research/style_tests/banners_units_camps/camps/make_camp.py, style v2), no flags -> out14/full_camps.json"""
import json, sys
import numpy as np
from scipy import ndimage as ndi
sys.path.insert(0, "/home/user/battle-maps/research/style_tests/banners_units_camps/camps")
from make_camp import render_camp, crop
S, PPU = 1.9, 2.0
SZ = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
C = [("full_wagon_park.png", dict(seed=518, kind="wagon_park", size=165 * SZ, orientation=20, side="union"), (1736, 832)),
     ("full_camp_union.png", dict(seed=1863, kind="camp", size=170 * SZ, orientation=10, side="union"), (1655, 882)),
     ("full_depot_cs.png", dict(seed=522, kind="supply_depot", size=140 * SZ, orientation=0, side="confederate", date="1863-04-20"), (1438, 796))]
out = []
for fn, kw, (mx, my) in C:
    im, c, g = render_camp(ppu=PPU, flag=False, **kw); im, c, g = crop(im, c, g)
    k = PPU * S; im.save("out14/" + fn)
    A = np.asarray(im).astype(int); fm = (A[..., 0] > 200) & (A[..., 1] > 110) & (A[..., 1] < 200) & (A[..., 2] < 110) & (A[..., 3] > 100)
    lab, nl = ndi.label(ndi.binary_dilation(fm, iterations=2))
    fires = []
    if nl:
        cs = ndi.center_of_mass(fm, lab, range(1, nl + 1)); sz = ndi.sum(fm, lab, range(1, nl + 1))
        fires = [(round(mx - c[0] / k + x / k, 1), round(my - c[1] / k + y / k, 1)) for (y, x), s_ in sorted(zip(cs, sz), key=lambda q: -q[1])[:2]]
    out.append(dict(fires=fires, png=fn, left=round(mx - c[0] / k, 2), top=round(my - c[1] / k, 2), w=round(im.width / k, 2), h=round(im.height / k, 2)))
    print(fn, im.size, out[-1])
json.dump(out, open("out14/full_camps.json", "w"))
