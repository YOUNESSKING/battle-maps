"""Satellite image aligned with a baked basemap (same 2880x1620 frame), or a free-standing one.

usage: python3 tools/sat.py --intro BASEMAP              -> assets/media/BASEMAP_sat.jpg (same frame as the basemap) + _sat_mid.jpg (2 zooms out)
                                                            + _sat_region.jpg (4 zooms out), all centred on the basemap centre: inputs for B.satIntro()
       python3 tools/sat.py BASEMAP [OUT.jpg]            -> assets/BASEMAP_sat.jpg, same frame as assets/BASEMAP.jpg
       python3 tools/sat.py --free LAT LON ZOOM OUT.jpg   -> 2880x1620 centred on LAT/LON at ZOOM
Imagery: Sentinel-2 cloudless 2016 by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0.
Credit line for the video description: "Satellite imagery: Sentinel-2 cloudless (https://s2maps.eu) by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0"
"""
import io, json, math, os, sys, time, urllib.request
from PIL import Image

W, H = 2880, 1620
URL = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CACHE = os.path.join(ROOT, "tools", ".sattiles")
MAXZ = 14  # 10 m imagery: deeper zooms are upsampled


def tile(z, x, y):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, f"{z}_{x}_{y}.jpg")
    if not os.path.exists(p):
        req = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={"User-Agent": "battle-maps-documentary/1.0"})
        for k in range(4):
            try:
                open(p, "wb").write(urllib.request.urlopen(req, timeout=30).read()); break
            except Exception:
                time.sleep(2 ** k)
    return Image.open(p).convert("RGB")


def render(x0, y0, z, out):
    zt = min(z, MAXZ); f = 2 ** (z - zt)
    wx0, wy0 = x0 / f, y0 / f
    tx0, ty0, tx1, ty1 = int(wx0) // 256, int(wy0) // 256, int(wx0 + W / f) // 256, int(wy0 + H / f) // 256
    mos = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            mos.paste(tile(zt, tx, ty), ((tx - tx0) * 256, (ty - ty0) * 256))
    ox, oy = wx0 - tx0 * 256, wy0 - ty0 * 256
    img = mos.transform((W, H), Image.AFFINE, (1 / f, 0, ox, 0, 1 / f, oy), resample=Image.BICUBIC)
    img.save(out, quality=88)
    print(out, f"z{z} (tiles z{zt})")


if sys.argv[1] == "--intro":
    b = sys.argv[2]; P = json.load(open(f"{ROOT}/assets/{b}.json")); z = P["zoom"]; x0, y0 = P["origin_world_px"]
    os.makedirs(f"{ROOT}/assets/media", exist_ok=True)
    render(x0, y0, z, f"{ROOT}/assets/media/{b}_sat.jpg")
    for dz, tag in ((2, "mid"), (4, "region")):
        cx, cy = (x0 + W / 2) / 2 ** dz, (y0 + H / 2) / 2 ** dz
        render(int(cx - W / 2), int(cy - H / 2), z - dz, f"{ROOT}/assets/media/{b}_sat_{tag}.jpg")
elif sys.argv[1] == "--free":
    lat, lon, z, out = float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    n = 256 * 2 ** z
    cx, cy = (lon + 180) / 360 * n, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    render(int(cx - W / 2), int(cy - H / 2), z, out)
else:
    P = json.load(open(f"{ROOT}/assets/{sys.argv[1]}.json"))
    render(*P["origin_world_px"], P["zoom"], sys.argv[2] if len(sys.argv) > 2 else f"{ROOT}/assets/{sys.argv[1]}_sat.jpg")
