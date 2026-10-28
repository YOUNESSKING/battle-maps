"""Hook-3 Kentucky locator (dark twist, 1861), Sherman #13 hook agent. A dark 1920x1080 screen-space locator: state outlines from
Natural Earth admin-1 (assets/src/south_ne_states.geojson), Kentucky glowing gold (not a side colour: Kentucky stayed in the Union), Louisville (Sherman's HQ, Department of the
Cumberland, Oct 1861) marked. Faint neighbour names. No towns that did not exist in 1861.
-> assets/media/hook_ky_base.png (outlines + labels, transparent) and assets/media/hook_ky_fill.png (Kentucky fill + glow, transparent)
usage (from sherman/): python3 tools/make_hook_ky.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
LAT0, LON0, Z = 37.55, -85.50, 7.55          # view centre + fractional zoom (Kentucky ~1000 px wide)
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    x = (lon + 180) / 360 * n; y = (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n
    r0 = math.radians(LAT0); x0 = (LON0 + 180) / 360 * n; y0 = (1 - math.asinh(math.tan(r0)) / math.pi) / 2 * n
    return (x - x0 + W / 2, y - y0 + H / 2)

def rings(g):
    if g["type"] == "Polygon": return g["coordinates"]
    return [r for p in g["coordinates"] for r in p]

def main():
    F = {f["properties"]["name"]: f for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]}
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(base)
    for nm, f in F.items():
        for r in rings(f["geometry"]):
            d.line([P(la, lo) for lo, la in r], fill=(200, 196, 186, 90), width=2, joint="curve")
    fo = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26)
    for nm, la, lo in [("OHIO", 39.2, -82.9), ("INDIANA", 39.1, -86.3), ("ILLINOIS", 38.4, -89.0), ("TENNESSEE", 35.85, -86.4),
                       ("VIRGINIA", 37.3, -79.6), ("WEST VIRGINIA", 38.7, -80.7), ("MISSOURI", 37.6, -91.0)]:
        d.text(P(la, lo), " ".join(nm), font=fo, fill=(200, 196, 186, 85), anchor="mm")
    base.save("assets/media/hook_ky_base.png", optimize=True)
    ky = [[P(la, lo) for lo, la in r] for r in rings(F["Kentucky"]["geometry"])]
    fill = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fill)
    for r in ky: fd.polygon(r, fill=(200, 160, 70, 55))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    for r in ky: gd.line(r + [r[0]], fill=(240, 190, 90, 255), width=10, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(9)); fill.alpha_composite(glow)
    ld = ImageDraw.Draw(fill)
    for r in ky: ld.line(r + [r[0]], fill=(255, 226, 160, 255), width=3, joint="curve")
    fill.save("assets/media/hook_ky_fill.png", optimize=True)
    print("wrote hook_ky_base.png + hook_ky_fill.png; Louisville at", [round(v) for v in P(38.253, -85.759)], "KY label at", [round(v) for v in P(37.45, -85.6)])

if __name__ == "__main__":
    main()
