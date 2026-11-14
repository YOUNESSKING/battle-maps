"""lat/lon <-> map px for the Yorktown basemaps (same formula as tools/bake.py: web mercator, origin_world_px from assets/<map>.json).
Map px = the 2880 x 1620 world of the scenes; basemap image px (5760 x 3240) = 2 x map px."""
import json, math, os
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
_J = {}
def meta(m):
    if m not in _J: _J[m] = json.load(open(f"{A}/{m}.json"))
    return _J[m]
def ll2px(m, lat, lon):
    J = meta(m); n = 256 * 2 ** J["zoom"]; ox, oy = J["origin_world_px"]
    return ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy)
def px2ll(m, x, y):
    J = meta(m); n = 256 * 2 ** J["zoom"]; ox, oy = J["origin_world_px"]
    return (math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (oy + y) / n)))), (ox + x) / n * 360 - 180)
