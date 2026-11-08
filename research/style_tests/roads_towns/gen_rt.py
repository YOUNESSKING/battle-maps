"""s12d_rt: render the five town sprites (real basemap river + real road entry angles) + reference labels for the
Champion Hill frame (camera s = S). Writes PNGs + rt_meta.json into OUT. Map px = vicksburg_w world box (0..2880)."""
import json, math, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.morphology import skeletonize

TW = "/home/user/battle-maps/research/style_tests/roads_towns/towns"
sys.path.insert(0, TW)
from make_town import render_town, map_to_local  # noqa
from label import render_label, render_label_curve  # noqa

Image.MAX_IMAGE_PIXELS = None
OUT = sys.argv[1]
S = float(os.environ.get("S", 1.9))           # camera scale of the snapshot frame
PPU = 2.0                                     # image px per on-screen px at S
SC = float(os.environ.get("TOWN_SCALE", 1.0))
LBL = float(os.environ.get("LBL", 28))
MAP_PPU = 1.0 / S                             # map px per on-screen px
os.makedirs(OUT, exist_ok=True)
base = np.asarray(Image.open("/home/user/battle-maps/grant/assets/vicksburg_w.jpg").convert("RGB")).astype(int)
R_, G_, B_ = base[..., 0], base[..., 1], base[..., 2]
BLUE = (B_ > R_ + 45) & (B_ > G_ + 10)        # pale-blue river ribbons (image px, 2 per map px)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from road_fix import fixed_roads, ED1  # noqa
roads = fixed_roads()

TOWNS = {   # name: (label, centre map px, radius u, size, seed, grid, label curve (Bezier, 1080p px from the town point), sprite offset map px)
    # curves hug the town edge / follow the river or road beside it (hand-lettered look, each different)
    "vicksburg": ("Vicksburg", (1388, 681), 66, "city", 1863, None, [(-6, 140), (50, 160), (130, 164), (190, 150)], (7, 2)),
    "jackson": ("Jackson", (1885, 724), 56, "town", 1822, None, [(-205, 66), (-140, 94), (-66, 100), (-14, 86)], (0, 0)),
    "raymond": ("Raymond", (1716, 759), 40, "village", 1829, None, [(-80, 58), (-10, 80), (80, 74), (140, 44)], (0, 0)),
    "port_gibson": ("Port Gibson", (1306, 1015), 40, "village", 1803, None, [(-110, 62), (-10, 90), (110, 84), (190, 46)], (0, 0)),
    "edwards": ("Edwards", ED1, 36, "village", 1840, None, [(-60, 50), (0, 64), (60, 58), (110, 34)], (0, 0)),
}


def river_near(c, rad_map):
    """skeleton of the basemap's blue river within rad_map map px of c -> polyline(s) in map px + width in map px"""
    x0, y0 = int((c[0] - rad_map) * 2), int((c[1] - rad_map) * 2)
    x1, y1 = int((c[0] + rad_map) * 2), int((c[1] + rad_map) * 2)
    m = BLUE[y0:y1, x0:x1]
    m = ndi.binary_opening(m, iterations=1)
    lab, n = ndi.label(m)
    if n == 0:
        return None, 0
    sizes = ndi.sum(m, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    if sizes[k - 1] < 300:
        return None, 0
    mk = lab == k
    width = 2 * np.median(ndi.distance_transform_edt(mk)[skeletonize(mk)]) / 2   # map px
    sk = skeletonize(mk)
    ys, xs = np.nonzero(sk)
    pts = list(zip(xs.tolist(), ys.tolist()))
    S_ = set(pts)
    nb = lambda p: [(p[0] + dx, p[1] + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and (p[0] + dx, p[1] + dy) in S_]
    ends = [p for p in pts if len(nb(p)) == 1] or [pts[0]]
    # walk from the end nearest the window border, greedy nearest-unvisited
    cur = min(ends, key=lambda p: min(p[0], p[1], mk.shape[1] - p[0], mk.shape[0] - p[1]))
    seen, path = {cur}, [cur]
    rest = set(pts) - seen
    while rest:
        cand = [q for q in nb(cur) if q not in seen]
        if not cand:
            q = min(rest, key=lambda r: (r[0] - cur[0]) ** 2 + (r[1] - cur[1]) ** 2)
            if (q[0] - cur[0]) ** 2 + (q[1] - cur[1]) ** 2 > 400:
                break
        else:
            q = cand[0]
        seen.add(q); rest.discard(q); path.append(q); cur = q
    path = path[::6] + [path[-1]]
    return [((x + x0) / 2, (y + y0) / 2) for x, y in path], width


def road_angles(c, r_map):
    angs = []
    for rd in roads:
        P = rd["pts"]
        d = [math.hypot(x - c[0], y - c[1]) for x, y in P]
        if min(d) > 10:
            continue
        i0 = int(np.argmin(d))
        for dirn in (-1, 1):
            j = i0
            while 0 <= j + dirn < len(P) and d[j] < r_map:
                j += dirn
            if j != i0 and d[j] >= r_map * 0.7:
                angs.append(round(math.degrees(math.atan2(P[j][1] - c[1], P[j][0] - c[0])), 1))
    return angs


meta = {"S": S, "ppu": PPU, "towns": {}}
for key, (name, c0, Ru, size, seed, grid, lp, off) in TOWNS.items():
    c = (c0[0] + off[0], c0[1] + off[1])
    Ru = Ru * SC
    r_map = Ru * MAP_PPU
    riv, wmap = river_near(c, r_map * 1.6)
    kw = {}
    if riv:
        kw = dict(river=map_to_local(riv, c, MAP_PPU), river_width=max(2.5, 2 * wmap / MAP_PPU * 0.5), one_bank=True)
    angs = road_angles(c, r_map * 1.1)
    rl = [map_to_local(rd["pts"], c, MAP_PPU) for rd in roads if min(math.hypot(x - c[0], y - c[1]) for x, y in rd["pts"]) < r_map * 1.2]
    im, (cx, cy) = render_town(seed, size, roads=angs, grid=grid, ppu=PPU, radius=Ru, road_lines=rl, lobes=True,
                               soft=float(os.environ.get("SOFT", 0.9)), feather=float(os.environ.get("FEATHER", 18)), palette="soft", **kw)
    bb = im.getbbox(); im = im.crop(bb); cx -= bb[0]; cy -= bb[1]
    im.save(f"{OUT}/town_{key}.png")
    k = MAP_PPU / PPU     # map px per image px
    lsz, ltr = {"vicksburg": (36, 0.2)}.get(key, (LBL, float(os.environ.get("TRK", 0.32))))   # Vicksburg: fits between the bluff hachures and the Big Black
    li, (ax, ay) = render_label_curve(name, lp, size=lsz, ppu=2.0, tracking=ltr, seed=seed)
    li.save(f"{OUT}/label_{key}.png")
    meta["towns"][key] = dict(name=name, c=c0, R_u=Ru, river=bool(riv), river_w_u=kw.get("river_width"), roads=angs,
                              img=[im.width, im.height], left=round(c[0] - cx * k, 2), top=round(c[1] - cy * k, 2),
                              w=round(im.width * k, 2), h=round(im.height * k, 2),
                              label=dict(w=li.width / 2, h=li.height / 2, ax=ax / 2, ay=ay / 2, dx=0, dy=0))
    print(key, meta["towns"][key])
json.dump(meta, open(f"{OUT}/rt_meta.json", "w"), indent=1)
