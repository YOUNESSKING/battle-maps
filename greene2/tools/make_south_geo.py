"""Geography layer for the `south` overview basemap (z8, 34.70N 79.60W), Greene remake (HOOK/SOUTH agent).
- land mask from the HD elevation (elev > 0.5)                         -> assets/media/south_land.png (2880x1620, white = land)
- rivers: Natural Earth 10m (rivers_lake_centerlines + rivers_north_america, public domain), cut to the map, cached in
  assets/src/south_rivers_ne.json; the James (missing from NE 10m in Virginia) is a hand polyline through its known reaches
  (Lynchburg - Scottsville - Columbia - Richmond - City Point - Jamestown - Hampton Roads).
  Story rivers (Catawba-Wateree, Yadkin-Pee Dee, Dan-Roanoke, Haw, Deep, Cape Fear, Congaree, Santee, Savannah, James) strong, others faint.
- 1780-81 places only: big towns of the period as dots + small labels; story places are white-box labels in the scenes.
- water + river + colony names (small, faint).                       -> assets/media/south_geo_ref.png (5760x3240, shown at 2880x1620)
  + the same rivers without any label (for close camera moves)        -> assets/media/south_rivers_ref.png
- river paths in map px for LV.shimmer                                -> assets/src/south_rivers_shimmer.json (inlined into scenes by
  tools/make_south_inline.py)
usage (from greene2/): python3 tools/make_south_geo.py [NE_DIR]   (NE_DIR = folder with the two unzipped NE shapefile folders;
only needed the first time, afterwards the cached json is used)"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/south.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
N = 256 * 2 ** Z
def P(lat, lon, s=S):
    r = math.radians(lat)
    return (((lon + 180) / 360 * N - OX) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * N - OY) * s)

STORY = {"Catawba", "Wateree", "Yadkin", "Great Pee Dee", "Dan", "Roanoke", "Haw", "Deep", "Cape Fear", "Congaree", "Santee",
         "Savannah", "Tugaloo", "James", "Broad", "Saluda", "Little Pee Dee", "Lynches"}
MAIN = {"Catawba", "Wateree", "Yadkin", "Great Pee Dee", "Dan", "Roanoke", "Haw", "Deep", "Cape Fear", "Congaree", "Santee", "Savannah", "James"}
JAMES = [(37.42, -79.14), (37.53, -78.83), (37.62, -78.68), (37.79, -78.49), (37.71, -78.30), (37.75, -78.16), (37.66, -78.00),
         (37.67, -77.85), (37.60, -77.65), (37.53, -77.44), (37.45, -77.42), (37.38, -77.33), (37.31, -77.27), (37.30, -77.10),
         (37.21, -76.95), (37.21, -76.78), (37.12, -76.62), (37.00, -76.45), (36.97, -76.33)]
# big towns of 1780 only (label side r/l/a/b)
CITIES = [("CHARLESTON", 32.776, -79.931, "l"), ("SAVANNAH", 32.081, -81.091, "l"), ("AUGUSTA", 33.474, -81.967, "l"),
          ("WILMINGTON", 34.236, -77.946, "r"), ("RICHMOND", 37.541, -77.434, "l"), ("PETERSBURG", 37.228, -77.402, "l"),
          ("WILLIAMSBURG", 37.271, -76.707, "b"), ("HILLSBOROUGH", 36.075, -79.100, "r"), ("HALIFAX", 36.329, -77.589, "r"),
          ("CAMDEN", 34.246, -80.607, "r"), ("CHARLOTTE", 35.227, -80.843, "l"), ("SALISBURY", 35.671, -80.474, "a")]
WATER = [("ATLANTIC OCEAN", 32.30, -77.60, 28, 40), ("CHESAPEAKE BAY", 37.62, -76.12, -80, 24)]
COLONIES = [("VIRGINIA", 37.55, -79.30, 0), ("NORTH CAROLINA", 35.75, -78.55, 0), ("SOUTH CAROLINA", 34.40, -81.62, 0), ("GEORGIA", 32.95, -82.55, 0)]
RIVER_LBL = [("CATAWBA", 35.40, -81.10, -80), ("WATEREE", 34.02, -80.80, -70), ("YADKIN", 35.92, -80.68, -40), ("PEE DEE", 34.60, -79.66, -62),
             ("DAN", 36.66, -79.35, 8), ("HAW", 36.10, -79.43, -45), ("DEEP", 35.62, -79.55, 10), ("CAPE FEAR", 35.05, -78.80, -55),
             ("CONGAREE", 33.86, -80.88, -38), ("SANTEE", 33.47, -79.86, -22), ("SAVANNAH", 32.80, -81.56, -58), ("JAMES", 37.60, -77.78, 14)]

def load_rivers(ne_dir):
    cache = "assets/src/south_rivers_ne.json"
    if os.path.exists(cache) and not ne_dir: return json.load(open(cache))
    import shapefile
    out = []
    for f in ("ne_10m_rivers_lake_centerlines/ne_10m_rivers_lake_centerlines.shp", "ne_10m_rivers_north_america/ne_10m_rivers_north_america.shp"):
        for sr in shapefile.Reader(os.path.join(ne_dir, f)).iterShapeRecords():
            if not hasattr(sr.shape, "bbox"): continue
            b = sr.shape.bbox
            if b[2] < -87.6 or b[0] > -71.6 or b[3] < 30.9 or b[1] > 38.3: continue
            nm = sr.record.as_dict().get("name") or ""
            if nm == "James": continue
            pp = list(sr.shape.parts) + [len(sr.shape.points)]
            for a, c in zip(pp[:-1], pp[1:]):
                out.append({"name": nm, "pts": [[round(lo, 4), round(la, 4)] for lo, la in sr.shape.points[a:c]]})
    out.append({"name": "James", "pts": [[lo, la] for la, lo in JAMES]})
    json.dump(out, open(cache, "w")); return out

def smooth(pts, k=1):
    for _ in range(k):
        if len(pts) < 3: return pts
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        pts = q + [pts[-1]]
    return pts

def main():
    ne_dir = sys.argv[1] if len(sys.argv) > 1 else None
    e = np.load("assets/src/south_hd_elev.npy")
    land2 = (e > 0.5).astype(np.float32).reshape(1620, 2, 2880, 2).mean(axis=(1, 3)) >= 0.5
    Image.fromarray((land2 * 255).astype(np.uint8), "L").save("assets/media/south_land.png", optimize=True)
    landHD = e > 0.5
    R = load_rivers(ne_dir)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(im); shimmer = []
    for r in sorted(R, key=lambda r: r["name"] in MAIN):
        pts = smooth([P(la, lo) for lo, la in r["pts"]], 2 if r["name"] == "James" else 1)
        # stop at the coast (estuaries are already water in the relief)
        pts = [p for p in pts if 0 <= p[0] < W and 0 <= p[1] < H and landHD[int(p[1]), int(p[0])]] if r["name"] != "James" else pts
        if len(pts) < 2: continue
        if r["name"] in MAIN:
            rd.line(pts, fill=(96, 150, 190, 235), width=6, joint="curve")
            shimmer.append([[round(x / S, 1), round(y / S, 1)] for x, y in pts[::3]])
        elif r["name"] in STORY: rd.line(pts, fill=(96, 150, 190, 170), width=4, joint="curve")
        else: rd.line(pts, fill=(96, 150, 190, 90), width=3, joint="curve")
    im.save("assets/media/south_rivers_ref.png", optimize=True)          # rivers only (close camera: no labels)
    f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    def rot_text(nm, x, y, rot, size, fill, spacing=True):
        ft = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", size)
        t = Image.new("RGBA", (1400, 200), (0, 0, 0, 0)); d = ImageDraw.Draw(t)
        txt = " ".join(nm) if spacing else nm
        hl = Image.new("RGBA", t.size, (0, 0, 0, 0)); ImageDraw.Draw(hl).text((700, 100), txt, font=ft, fill=(8, 12, 16, 200), anchor="mm")
        hl = hl.filter(ImageFilter.GaussianBlur(3)); t.alpha_composite(hl); d.text((700, 100), txt, font=ft, fill=fill, anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    for nm, la, lo, rot, sz in WATER: rot_text(nm, *P(la, lo), rot, sz, (150, 195, 225, 190))
    for nm, la, lo, rot in COLONIES: rot_text(nm, *P(la, lo), rot, 30, (230, 224, 210, 120))
    for nm, la, lo, rot in RIVER_LBL: rot_text(nm, *P(la, lo), rot, 21, (165, 205, 235, 225), spacing=False)
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo)
    for nm, la, lo, side in CITIES:
        x, y = P(la, lo); r = 6
        td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    im.save("assets/media/south_geo_ref.png", optimize=True)
    json.dump(shimmer, open("assets/src/south_rivers_shimmer.json", "w"))
    print("wrote south_land.png, south_geo_ref.png, south_rivers_shimmer.json (%d rivers, %d NE segments)" % (len(shimmer), len(R)))

if __name__ == "__main__":
    main()
