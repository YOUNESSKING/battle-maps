"""Map agent hook (Grant #16, prefix gh_): kit + data + body -> scenes-src/<scene>.js, copies the extra map layers into assets/media,
then builds the scene with build_scene.py.  usage (from grant/): python3 tools/gh_inline.py SCENE BASEMAP FIRST_TAG LAST_TAG
  reads tools/gh_kitw.js (STYLE W kit) and tools/gh_body_<SCENE>.js; GD.riv = traced rivers (tools/gh_rivers.py) of the tennessee map (map px).
  STYLE W:  python3 tools/gh_inline.py hook-a donelson_w hook-1 hook-2 ;  python3 tools/gh_inline.py hook-b donelson_w hook-3 hook-4"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__))); import _linkcopy  # noqa: hard-link assets (disk)
import json, os, shutil, subprocess, sys
from PIL import Image
scene, base, first, last = sys.argv[1:5]
# STYLE W (2026-11-06, grant/STYLEW_BRIEF.md): the extra world layers are the Style W maps (assets/<map>_w.jpg + _close), hard-linked into
# assets/media/ghw_*.jpg (same world boxes as the old gh_*_relief.jpg layers, which are no longer used). Basemap: donelson_w (+ _close = #relief2).
LAY = {"ghw_ten.jpg": "tennessee_w", "ghw_hen.jpg": "henry_w", "ghw_hen_close.jpg": "henry_w_close", "ghw_vks.jpg": "vicksburg_siege_w",
       "ghw_vks_close.jpg": "vicksburg_siege_w_close", "ghw_jam.jpg": "jamesriver_w", "ghw_jam_close.jpg": "jamesriver_w_close"}
for out, m in LAY.items():
    src, dst = f"assets/{m}.jpg", f"assets/media/{out}"
    if not os.path.exists(src): sys.exit(f"MISSING Style W map {src} (made by the map agents; poll and rebuild)")
    if not (os.path.exists(dst) and os.path.samefile(src, dst)):
        if os.path.lexists(dst): os.remove(dst)
        os.link(src, dst); print("layer", out, "<-", src)
import math
def origin(m, lat, lon, z):
    if os.path.exists(f"assets/{m}_hd_lift.json"): J = json.load(open(f"assets/{m}_hd_lift.json")); return [J["zoom"], *J["origin_world_px"]]
    n = 256 * 2 ** z; cx, cy = (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return [z, int(cx - 1440), int(cy - 810)]
# STYLE W: snap the DEM-traced river centrelines onto the rivers drawn on tennessee_w (nearest river centre-line pixel within 14 map px, then smoothed)
import numpy as np
from scipy import ndimage
def snap_rivers(riv, img, R=14):
    a = np.asarray(Image.open(img).convert("RGB").resize((2880, 1620), Image.BILINEAR)).astype(np.int16)
    wat = (a[..., 2] > a[..., 0] + 30) & (a[..., 2] > a[..., 1])
    from skimage.morphology import skeletonize
    wat = skeletonize(ndimage.binary_closing(wat, iterations=2))   # the river's centre line
    d, (iy, ix) = ndimage.distance_transform_edt(~wat, return_indices=True)
    out = {}
    for nm, pts in riv.items():
        q = []
        for x, y in pts:
            xi, yi = min(2879, max(0, int(round(x)))), min(1619, max(0, int(round(y))))
            q.append([float(ix[yi, xi]), float(iy[yi, xi])] if d[yi, xi] <= R else [x, y])
        q = np.array(q)
        if len(q) > 5: q = np.stack([ndimage.uniform_filter1d(q[:, 0], 5, mode="nearest"), ndimage.uniform_filter1d(q[:, 1], 5, mode="nearest")], 1)
        out[nm] = [[round(float(u), 1), round(float(v), 1)] for u, v in q]
    return out
GD = {"riv": snap_rivers(json.load(open("assets/media/gh_tennessee_rivers.json")), "assets/tennessee_w.jpg"),
      "maps": {"vicksburg_siege": origin("vicksburg_siege", 32.33, -90.87, 12), "jamesriver": origin("jamesriver", 37.3, -77.05, 12)}}
# the gunboat run past Vicksburg (16 Apr 1863) on the river as drawn on vicksburg_siege_w (densified, snapped to the river's centre line)
def proj(m, lat, lon):
    z, ox, oy = origin(m, 0, 0, 0); n = 256 * 2 ** z
    return [(lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy]
_run = [[940, 418], [1030, 466], [1150, 546], [1240, 584], [1330, 620], [1390, 670], [1395, 720], [1370, 800], [1330, 880], [1270, 950], [1200, 1020]]   # map px seeds
_den = [[_run[i][0] + (_run[i + 1][0] - _run[i][0]) * k / 8, _run[i][1] + (_run[i + 1][1] - _run[i][1]) * k / 8] for i in range(len(_run) - 1) for k in range(8)] + [_run[-1]]
GD["vrun"] = snap_rivers({"r": _den}, "assets/vicksburg_siege_w.jpg", R=40)["r"]
kit = open("tools/gh_kitw.js").read()
body = open(f"tools/gh_body_{scene}.js").read()
out = body.replace("// @@KIT", "// @@KIT (tools/gh_kitw.js)\n" + kit + "// @@END-KIT").replace("// @@DATA", "// @@DATA (tools/gh_inline.py)\nconst GD = " + json.dumps(GD, separators=(",", ":")) + ";\n// @@END-DATA")
open(f"scenes-src/{scene}.js", "w").write(out)
print(f"scenes-src/{scene}.js", len(out) // 1024, "KB")
r = subprocess.run(["python3", "tools/build_scene.py", scene, base, first, last], capture_output=True, text=True); print(r.stdout.strip(), r.stderr.strip()[-800:])
