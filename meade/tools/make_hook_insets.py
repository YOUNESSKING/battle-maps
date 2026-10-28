"""Snap-cut inset images for hook-b (Meade #12, hook agent). hook-4 is one scene on `penn_hd_ref`; each of the three snap cuts shows a
1920x1080 crop of a close basemap (dark HD relief) placed as an image in the penn world at the real place, so the camera can cut in
and pull back out to the overview. Roads / the RF&P railroad are baked into the crop (OSM, period roads only).
-> assets/media/hook_inset_<name>.jpg (1920x1080) + assets/media/hook_insets.json {name: {z, ox, oy, x0, y0, w, h}}: the crop origin
   (x0, y0) and size (w, h) in the SOURCE map px; in the scene: world = X + (srcpx - x0) * (W_world / w).
usage (from meade/): python3 tools/make_hook_insets.py"""
import json, math
from PIL import Image, ImageDraw

def proj(J):
    Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P

def ways(osm):
    O = json.load(open(osm)); w = O["ways"]
    return list(w.values()) if isinstance(w, dict) else w

def inset(name, base, center, wpx, lines):
    J = json.load(open(f"assets/{base}.json")); P = proj(J)
    cx, cy = P(*center); hpx = wpx * 9 / 16
    x0, y0 = cx - wpx / 2, cy - hpx / 2
    im = Image.open(f"assets/{base}_hd_ref.jpg").convert("RGB")
    crop = im.crop((round(x0 * 2), round(y0 * 2), round((x0 + wpx) * 2), round((y0 + hpx) * 2))).resize((1920, 1080), Image.LANCZOS)
    k = 1920 / wpx
    d = ImageDraw.Draw(crop, "RGBA")
    for pts, case, fill, wid in lines(P):
        q = [((x - x0) * k, (y - y0) * k) for x, y in pts]
        d.line(q, fill=case, width=wid + 4, joint="curve"); d.line(q, fill=fill, width=wid, joint="curve")
    crop.save(f"assets/media/hook_inset_{name}.jpg", quality=90)
    return {"z": J["zoom"], "ox": J["origin_world_px"][0], "oy": J["origin_world_px"][1], "x0": round(x0, 2), "y0": round(y0, 2), "w": wpx, "h": round(hpx, 2)}

GETTY_ROADS = {"Chambersburg Road", "Chambersburg Street", "Mummasburg Road", "Biglerville Road", "Carlisle Street", "Old Harrisburg Road",
               "Harrisburg Street", "York Street", "York Road", "Hanover Road", "West Hanover Street", "Baltimore Street", "Baltimore Pike",
               "Taneytown Road", "Steinwehr Avenue", "Emmitsburg Road", "Fairfield Road", "West Middle Street", "Lincoln Square"}

def getty_lines(P):
    out = []
    for el in ways("assets/src/getty_osm.json"):
        t = el.get("tags", {}); g = el.get("geom") or []
        if len(g) > 1 and t.get("highway") and t.get("highway") not in ("motorway", "motorway_link") and t.get("name") in GETTY_ROADS:
            out.append(([P(a, b) for a, b in g], (12, 14, 14, 150), (226, 214, 186, 170), 4))
    return out

def fred_lines(P):
    out = []
    for el in ways("assets/src/prospect_osm.json"):
        t = el.get("tags", {}); g = el.get("geom") or []
        if len(g) < 2: continue
        if t.get("railway") == "rail" and t.get("name") == "CSX RF&P Subdivision":
            out.append(([P(a, b) for a, b in g], (12, 14, 14, 170), (150, 140, 120, 220), 4))
        elif t.get("name") == "Tidewater Trail":            # the Richmond Stage Road (Old Stage Road, today's Route 2/17 south of town)
            out.append(([P(a, b) for a, b in g], (12, 14, 14, 150), (226, 214, 186, 170), 4))
        elif t.get("waterway") in ("stream", "river") and t.get("name") in ("Deep Run", "Massaponax Creek"):
            out.append(([P(a, b) for a, b in g], (10, 20, 26, 0), (96, 150, 190, 200), 3))
    return out

if __name__ == "__main__":
    M = {}
    M["fred"] = inset("fred", "prospect", (38.2410, -77.4250), 1000, fred_lines)       # Prospect Hill, the gap, the plain to the Stage Road
    M["getty"] = inset("getty", "getty", (39.8075, -77.2345), 1150, getty_lines)       # the whole fishhook + Seminary Ridge
    M["angle"] = inset("angle", "getty15", (39.8125, -77.2395), 900, getty_lines)      # the Angle, the Copse of Trees, the field to Seminary Ridge
    json.dump(M, open("assets/media/hook_insets.json", "w"), indent=1)
    print(json.dumps(M))
