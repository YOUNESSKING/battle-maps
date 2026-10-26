"""Geography layer for the `korea` overview basemap (z7): big rivers traced from the HD elevation (tools/make_rivers_dem.py korea ->
assets/src/korea_dem_rivers.json) + big towns only, small 1950 labels with a dark halo (Frontlines look). Story places (Unsan,
Kunu-ri, Chosin ...) are NOT here: scenes add them as small white-box labels.
-> assets/media/korea_geo_ref.png (2x: 5760x3240, shown at 2880x1620), assets/media/korea_rivers.json (map px, for LV.shimmer)
usage (from peng/): python3 tools/make_korea_geo.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/korea.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)

# big towns only (1950 spellings); side = label right (r) / left (l) / above (a) / below (b)
CITIES = [("PYONGYANG", 39.02, 125.75, "r"), ("SEOUL", 37.57, 126.98, "r"), ("PUSAN", 35.10, 129.04, "r"), ("TAEGU", 35.87, 128.60, "r"),
          ("TAEJON", 36.35, 127.38, "r"), ("INCHON", 37.46, 126.63, "l"), ("KAESONG", 37.97, 126.55, "l"), ("WONSAN", 39.15, 127.44, "r"),
          ("HAMHUNG", 39.92, 127.54, "r"), ("SINUIJU", 40.10, 124.40, "l"), ("CHONGJIN", 41.79, 129.78, "r"), ("KWANGJU", 35.16, 126.85, "l"),
          ("MUKDEN", 41.80, 123.43, "r"), ("PEKING", 39.90, 116.40, "r"), ("DAIREN", 38.91, 121.60, "l"), ("CHANGCHUN", 43.88, 125.32, "r"),
          ("VLADIVOSTOK", 43.12, 131.89, "r"), ("TOKYO", 35.68, 139.76, "b"), ("OSAKA", 34.69, 135.50, "b"), ("FUKUOKA", 33.59, 130.40, "b"),
          ("TIENTSIN", 39.13, 117.20, "r")]

def main():
    riv = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(riv)
    R = json.load(open("assets/src/korea_dem_rivers.json"))       # HD px = 2x map px
    shimmer = []
    for r in R:
        if r["order"] < 2: continue
        pts = [tuple(p) for p in r["pts"]]
        w = 3 if r["order"] == 2 else 5
        rd.line(pts, fill=(96, 150, 190, 200 if r["order"] == 2 else 235), width=w, joint="curve")
        if r["order"] == 3: shimmer.append([[round(x / S), round(y / S)] for x, y in pts[::4]])
    im = riv
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 24)
    for nm, la, lo, side in CITIES:
        x, y = P(la, lo)
        if not (0 <= x < W and 0 <= y < H): continue
        r = 5; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 11, y), "l": ("rm", x - 11, y), "a": ("mb", x, y - 9), "b": ("mt", x, y + 9)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    im.save("assets/media/korea_geo_ref.png", optimize=True)
    json.dump(shimmer, open("assets/media/korea_rivers.json", "w"))
    print("wrote korea_geo_ref.png + korea_rivers.json (%d rivers)" % len(shimmer))

if __name__ == "__main__":
    main()
