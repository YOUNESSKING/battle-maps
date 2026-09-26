"""Convert lat/lon to basemap pixel coords (2880x1620).  usage: python3 tools/px.py BASEMAP LAT LON [LAT LON ...]"""
import json, math, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def px(basemap, lat, lon):
    P = json.load(open(f"{ROOT}/assets/{basemap}.json"))
    n, (ox, oy) = 256 * 2 ** P["zoom"], P["origin_world_px"]
    return round((lon + 180) / 360 * n - ox), round((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy)


if __name__ == "__main__":
    a = sys.argv[1:]
    for i in range(1, len(a), 2):
        print(a[i], a[i + 1], px(a[0], float(a[i]), float(a[i + 1])))
