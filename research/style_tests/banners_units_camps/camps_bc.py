import json, sys
sys.path.insert(0, "/tmp/claude-0/-home-user-battle-maps/30cbeb75-6ac3-5d4d-bd68-7dfc496a4a58/scratchpad/rt")
from camp_bc_lib import render_camp, crop   # scratch copy: lighter canvas + visible smoke (the camps agent's file untouched)
S, PPU = 1.9, 2.0
C = [("bc_wagon_park.png", dict(seed=518, kind="wagon_park", size=115, orientation=20, side="union", date="1863-05-17", flag=False), (1640, 808)),
     ("bc_camp_union.png", dict(seed=1863, kind="camp", size=105, orientation=10, side="union", date="1863-05-17", flag=False), (1565, 800)),
     ("bc_depot_cs.png", dict(seed=522, kind="supply_depot", size=72, orientation=0, side="confederate", date="1863-04-20", soft=0.08), (1458, 790))]
out = []
for fn, kw, (mx, my) in C:
    im, c, g = render_camp(ppu=PPU, **kw); im, c, g = crop(im, c, g)
    k = PPU * S; im.save("out14/" + fn)
    import numpy as np
    A = np.asarray(im).astype(int); fm = (A[..., 0] > 200) & (A[..., 1] > 110) & (A[..., 1] < 200) & (A[..., 2] < 110) & (A[..., 3] > 100)
    from scipy import ndimage as ndi
    lab, nl = ndi.label(ndi.binary_dilation(fm, iterations=2)); cs = ndi.center_of_mass(fm, lab, range(1, nl + 1)) if nl else []
    sz = ndi.sum(fm, lab, range(1, nl + 1)) if nl else []
    fires = [(round(mx - c[0] / k + x / k, 1), round(my - c[1] / k + y / k, 1)) for (y, x), s_ in sorted(zip(cs, sz), key=lambda q: -q[1])[:2]] if nl else []
    out.append(dict(fires=fires, png=fn, left=round(mx - c[0] / k, 2), top=round(my - c[1] / k, 2), w=round(im.width / k, 2), h=round(im.height / k, 2)))
    print(fn, im.size, out[-1])
json.dump(out, open("out14/bc_camps.json", "w"))
