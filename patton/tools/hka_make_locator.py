"""Dark screen-space locator cards (hook-3 Dalton, ending Franklin), Cleburne #14 hook/ending agent. 1920x1080 transparent PNGs:
state outlines from Natural Earth admin-1 (sherman/assets/src/south_ne_states.geojson), faint state names, the story state glowing gold
(gold = a place, not a side colour). The town dot + label are drawn in the scene (so they can pop on their words).
-> assets/media/hka_loc_<name>_base.png (outlines + names) and hka_loc_<name>_fill.png (state fill + glow); prints the town's screen px.
usage (from cleburne/): python3 tools/hka_make_locator.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
STATES = "/home/user/battle-maps/sherman/assets/src/south_ne_states.geojson"
CARDS = {   # name: (view lat, lon, fractional zoom, glowing state, town (name, lat, lon), state labels)
    "dalton": (34.75, -85.2, 7.3, "Georgia", ("DALTON", 34.770, -84.970),
               [("TENNESSEE", 35.85, -86.4), ("ALABAMA", 33.6, -86.9), ("GEORGIA", 33.4, -83.6), ("NORTH CAROLINA", 35.6, -81.6),
                ("SOUTH CAROLINA", 34.0, -81.2), ("KENTUCKY", 37.3, -85.6)]),
    "franklin": (35.6, -86.4, 7.3, "Tennessee", ("FRANKLIN", 35.925, -86.869),
                 [("KENTUCKY", 37.25, -85.4), ("ALABAMA", 33.9, -86.9), ("GEORGIA", 33.9, -83.9), ("MISSISSIPPI", 33.9, -89.6),
                  ("TENNESSEE", 35.35, -85.2), ("NORTH CAROLINA", 35.55, -81.3)]),
}

def rings(g):
    return g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]

def make(name, lat0, lon0, z, glow_state, town, labels):
    def P(lat, lon):
        n = 256 * 2 ** z; r = math.radians(lat); r0 = math.radians(lat0)
        x = (lon + 180) / 360 * n; y = (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n
        return (x - (lon0 + 180) / 360 * n + W / 2, y - (1 - math.asinh(math.tan(r0)) / math.pi) / 2 * n + H / 2)
    F = {f["properties"]["name"]: f for f in json.load(open(STATES))["features"]}
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(base)
    for f in F.values():
        for r in rings(f["geometry"]):
            d.line([P(la, lo) for lo, la in r], fill=(200, 196, 186, 95), width=2, joint="curve")
    fo = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26)
    for nm, la, lo in labels:
        if nm.upper() == glow_state.upper(): continue
        d.text(P(la, lo), " ".join(nm), font=fo, fill=(200, 196, 186, 90), anchor="mm")
    base.save(f"assets/media/hka_loc_{name}_base.png", optimize=True)
    st = [[P(la, lo) for lo, la in r] for r in rings(F[glow_state]["geometry"])]
    fill = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fill)
    for r in st: fd.polygon(r, fill=(200, 160, 70, 50))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    for r in st: gd.line(r + [r[0]], fill=(240, 190, 90, 255), width=10, joint="curve")
    fill.alpha_composite(glow.filter(ImageFilter.GaussianBlur(9)))
    ld = ImageDraw.Draw(fill)
    for r in st: ld.line(r + [r[0]], fill=(255, 226, 160, 255), width=3, joint="curve")
    fo2 = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 44)
    lab = [l for l in labels if l[0].upper() == glow_state.upper()][0]
    ld.text(P(lab[1], lab[2]), " ".join(glow_state.upper()), font=fo2, fill=(243, 215, 154, 200), anchor="mm")
    fill.save(f"assets/media/hka_loc_{name}_fill.png", optimize=True)
    print(name, town[0], "at", [round(v) for v in P(town[1], town[2])])

if __name__ == "__main__":
    for k, v in CARDS.items(): make(k, *v)
