"""r18 dive_v6copy: the gm3d v6 clip's 3D world with OUR ground. Writes assets/ for index.html:
  ground_wide.jpg  = the Lowcountry Style W basemap (marion/assets/lowcountry_m*.jpg), as v6's wide ground texture
  ground_close.jpg = the Santee basemap (marion/assets/santee_m*.jpg), as v6's close ground texture (the landing)
  height_*.png     = flat (our maps are painted flat; world.js decodes h = (R*256+G)/200 - 20 m -> R 15, G 160 = 0 m)
  world_data.js    = GM3D_DATA: v6's geo; the two regions placed so that Nelson's Ferry sits on v6's dive target (1518, 706) and our map
                     is scaled by 1/K into v6's map units (K = 2.9: the Lowcountry map, 2880 x 1620 px, fills v6's 1000 x 640 wide box), the
                     Santee inset at its true place inside it; no rivers / trees / houses / bridge (the painted maps carry them)
  pins.js          = our overlay anchors (units, wagons' road, flags, the ONE ROAD stamp) in v6 units
usage: python3 tools/make_assets.py   (run from dive_v6copy/)"""
import json, os, sys
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = "/home/user/battle-maps/marion/assets"
K = 2.9                    # our map px per v6 unit
ANCHOR = (1518.0, 706.0)   # v6's dive target (its deck centre / landing look-at)
R = json.load(open(os.path.join(HERE, "tools", "r15_hook_data.json")))
NFL = R["NFL"]
def V(p): return [round(ANCHOR[0] + (p[0] - NFL[0]) / K, 3), round(ANCHOR[1] + (p[1] - NFL[1]) / K, 3)]
def ver(m):
    for v in range(9, 1, -1):
        if os.path.exists(f"{M}/{m}_m{v}.jpg"): return f"{m}_m{v}"
    return f"{m}_m"
A = os.path.join(HERE, "assets"); os.makedirs(A, exist_ok=True)
LW, LH = 2880, 1620                      # lowcountry map px (texture 5760 x 3240 = 2x)
SAN = [1114.875, 779, 360, 202.5]        # the santee inset box in lowcountry px (INSET("santee"), k 1/8)
wide = V((0, 0)) + [round(LW / K, 3), round(LH / K, 3)]
close = V((SAN[0], SAN[1])) + [round(SAN[2] / K, 3), round(SAN[3] / K, 3)]
Image.open(f"{M}/{ver('lowcountry')}.jpg").convert("RGB").save(f"{A}/ground_wide.jpg", quality=90)
Image.open(f"{M}/{ver('santee')}.jpg").convert("RGB").save(f"{A}/ground_close.jpg", quality=90)
for n, (w, h) in (("wide", (600, 338)), ("close", (480, 270))):
    Image.new("RGB", (w, h), (15, 160, 0)).save(f"{A}/height_{n}.png")
D = {"geo": {"zoom": 10, "origin": [63513, 105473], "mpu": 129.36}, "towns": {"Vicksburg": ANCHOR}, "towns_wide": {},
     "regions": {"wide": {"box": wide, "hm": [600, 338], "tex": [5760, 3240], "rivers": [], "trees": [], "houses": []},
                 "close": {"box": close, "hm": [480, 270], "tex": [5760, 3240], "rivers": [], "trees": [], "houses": [], "pontoons": [], "breastworks": [],
                           "bridge": {"x": ANCHOR[0], "z": ANCHOR[1], "angle": 0, "len": 1, "deck": 0, "wl": 0, "hidden": True}}}}
open(f"{A}/world_data.js", "w").write("window.GM3D_DATA=" + json.dumps(D) + ";\n")
P = {"K": K, "units": {k: V(v[:2]) for k, v in R["units"].items()}, "roadCN": [V(p) for p in R["R_CN"]], "roadNC": [V(p) for p in R["R_NC"]],
     "gb": V(R["gb"]), "sc": V(R["sc"]), "stamp": V((860, 1110)), "nfl": V(NFL), "T": R["T"]}
open(f"{A}/pins.js", "w").write("window.PINS=" + json.dumps(P) + ";\n")
print("wide box", wide, "close box", close, "NFL", V(NFL))
