"""Geography layer for the `virginia` overview basemap (z9, 38.55N 78.15W): big rivers traced from the HD elevation
(tools/make_rivers_dem.py virginia -> assets/src/virginia_dem_rivers.json, order 3 strong, order 2 faint) + big towns of 1860-63 only,
small labels with a dark halo (Frontlines look) + a few water names. Story places (Front Royal, Manassas, Chancellorsville,
Gettysburg ...) are NOT here: scenes add them as small white-box labels.
-> assets/media/virginia_geo_ref.png (2x: 5760x3240, shown at 2880x1620), assets/media/virginia_rivers.json (map px, LV.shimmer)
usage (from meade/): python3 tools/make_virginia_geo.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/virginia.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)

# big towns of 1860 (census) only; side = label right (r) / left (l) / above (a) / below (b)
CITIES = [("WASHINGTON", 38.895, -77.036, "r"), ("BALTIMORE", 39.290, -76.612, "r"), ("PHILADELPHIA", 39.952, -75.165, "r"),
          ("RICHMOND", 37.541, -77.436, "r"), ("NORFOLK", 36.851, -76.286, "r"), ("PETERSBURG", 37.228, -77.402, "b"),
          ("FREDERICKSBURG", 38.303, -77.461, "r"), ("LYNCHBURG", 37.414, -79.142, "r"), ("WINCHESTER", 39.186, -78.163, "l"),
          ("STAUNTON", 38.150, -79.072, "l"), ("WHEELING", 40.064, -80.721, "r"), ("WILMINGTON", 39.746, -75.547, "r"),
          ("FREDERICK", 39.414, -77.411, "r")]
WATER = [("POTOMAC", 38.36, -76.86, -20), ("RAPPAHANNOCK", 37.86, -76.86, -35), ("JAMES", 37.24, -76.93, -10),
         ("CHESAPEAKE BAY", 38.15, -76.25, -70)]

def main():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(im)
    R = json.load(open("assets/src/virginia_dem_rivers.json"))       # HD px = 2x map px
    shimmer = []
    for r in R:
        if r["order"] < 2: continue
        pts = [tuple(p) for p in r["pts"]]
        if r["order"] == 2: rd.line(pts, fill=(96, 150, 190, 95), width=2, joint="curve")
        else:
            rd.line(pts, fill=(96, 150, 190, 230), width=5, joint="curve")
            shimmer.append([[round(x / S), round(y / S)] for x, y in pts[::4]])
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo, side in CITIES:
        x, y = P(la, lo)
        r = 6; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    fw = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 24)
    for nm, la, lo, rot in WATER:
        x, y = P(la, lo); t = Image.new("RGBA", (900, 120), (0, 0, 0, 0)); ImageDraw.Draw(t).text((450, 60), " ".join(nm), font=fw, fill=(150, 195, 225, 200), anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    im.save("assets/media/virginia_geo_ref.png", optimize=True)
    json.dump(shimmer, open("assets/media/virginia_rivers.json", "w"))
    print("wrote virginia_geo_ref.png + virginia_rivers.json (%d rivers)" % len(shimmer))

if __name__ == "__main__":
    main()
