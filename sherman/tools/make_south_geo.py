"""Geography layer for the `south` theatre basemap (z8, 34.50N 81.50W, Sherman #13; hook/bg/ending agent, shared read-only).
Big rivers (Natural Earth 10m centerlines, assets/src/south_ne_rivers.json), state lines as thin faint lines (Natural Earth admin-1,
assets/src/south_ne_states.geojson; 1864 lines = today's here, West Virginia drawn faint as today), faint state names, big towns of
1860 only (small labels, dark halo, Frontlines look) + a few water names. Story places (Dalton, Resaca, Kennesaw, Jonesboro, Millen,
Bentonville, Bennett Place ...) are NOT here: scenes add them as small white-box labels.
-> assets/media/south_geo_ref.png (2x: 5760x3240, shown at 2880x1620), assets/media/south_rivers.json (map px, LV.shimmer),
   assets/media/south_states.png (2x, state lines only, for scenes that want them without the towns)
usage (from sherman/): python3 tools/make_south_geo.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/south.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)

# big towns of 1860 (census >= ~5,000 or state capitals in the story); side = label right/left/above/below
CITIES = [("NASHVILLE", 36.162, -86.781, "r"), ("CHATTANOOGA", 35.046, -85.310, "l"), ("KNOXVILLE", 35.961, -83.921, "r"),
          ("ATLANTA", 33.749, -84.388, "l"), ("MACON", 32.841, -83.632, "l"), ("AUGUSTA", 33.471, -81.975, "r"),
          ("SAVANNAH", 32.081, -81.091, "l"), ("CHARLESTON", 32.776, -79.931, "r"), ("COLUMBIA", 34.000, -81.035, "l"),
          ("WILMINGTON", 34.236, -77.946, "r"), ("RALEIGH", 35.780, -78.639, "r"), ("PETERSBURG", 37.228, -77.402, "b"),
          ("RICHMOND", 37.541, -77.436, "r"), ("NORFOLK", 36.851, -76.286, "r"), ("LYNCHBURG", 37.414, -79.142, "r"),
          ("MONTGOMERY", 32.377, -86.300, "r"), ("COLUMBUS", 32.461, -84.988, "l")]
WATER = [("ATLANTIC OCEAN", 31.6, -77.4, 32), ("CHESAPEAKE BAY", 37.75, -75.75, -70)]
STATES = [("TENNESSEE", 35.75, -86.6), ("KENTUCKY", 37.45, -85.2), ("GEORGIA", 32.55, -83.45), ("ALABAMA", 33.0, -86.9),
          ("SOUTH CAROLINA", 33.55, -80.6), ("NORTH CAROLINA", 35.55, -79.6), ("VIRGINIA", 37.15, -78.7)]
BIG = {"Tennessee", "Cumberland", "Ohio", "Chattahoochee", "Savannah", "Great Pee Dee", "Cape Fear", "Roanoke", "James",
       "Congaree", "Santee", "Altamaha", "Ocmulgee", "Oconee", "Ogeechee", "Etowah", "Oostanaula", "Coosa", "Neuse", "Wateree",
       "Broad", "Saluda", "Edisto", "Flint", "Alabama", "Tallapoosa", "Catawba", "Yadkin", "Dan", "Holston", "Clinch", "Hiwassee",
       "Appomattox", "Rappahannock", "Potomac", "Tar", "Little Pee Dee", "Lynches", "Combahee", "Salkehatchie", "North Fork Edisto",
       "S.  Fk.  Edisto", "Black", "Haw", "Deep", "Kanawha", "Kentucky", "Green", "New", "French Broad"}

def lines_of(g):
    if g["type"] == "Polygon": return g["coordinates"]
    if g["type"] == "MultiPolygon": return [r for p in g["coordinates"] for r in p]
    return []

def main():
    st = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        for ring in lines_of(f["geometry"]):
            sd.line([P(la, lo) for lo, la in ring], fill=(236, 230, 214, 70), width=3, joint="curve")
    land = Image.open("assets/south_land.png").convert("L").resize((W, H))          # keep the lines off the sea
    a = st.getchannel("A"); a = Image.composite(a, Image.new("L", (W, H), 0), land); st.putalpha(a)
    st.save("assets/media/south_states.png", optimize=True)
    im = st.copy(); rd = ImageDraw.Draw(im); shimmer = []
    for r in json.load(open("assets/src/south_ne_rivers.json")):
        nm, sr = r["name"] or "", r["scalerank"] or 12
        pts = [P(la, lo) for lo, la in r["pts"]]
        if len(pts) < 2: continue
        if sr <= 7 or nm in BIG:
            strong = sr <= 6 or nm in {"Tennessee", "Savannah", "Chattahoochee", "Cumberland", "Ohio", "James", "Congaree", "Great Pee Dee", "Cape Fear", "Roanoke", "Altamaha"}
            rd.line(pts, fill=(96, 150, 190, 225 if strong else 150), width=5 if strong else 3, joint="curve")
            if strong: shimmer.append([[round(x / S), round(y / S)] for x, y in pts[::3]])
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 32)
    fs = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo in STATES:       # faint spaced state names under everything else
        x, y = P(la, lo); t = " ".join(nm)
        im_ = ImageDraw.Draw(im); im_.text((x, y), t, font=fs, fill=(236, 230, 214, 60), anchor="mm")
    for nm, la, lo, side in CITIES:
        x, y = P(la, lo)
        r = 6; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    fw = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo, rot in WATER:
        x, y = P(la, lo); t = Image.new("RGBA", (1100, 140), (0, 0, 0, 0)); ImageDraw.Draw(t).text((550, 70), " ".join(nm), font=fw, fill=(150, 195, 225, 190), anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    im.save("assets/media/south_geo_ref.png", optimize=True)
    json.dump(shimmer, open("assets/media/south_rivers.json", "w"))
    print("wrote south_geo_ref.png + south_states.png + south_rivers.json (%d rivers)" % len(shimmer))

if __name__ == "__main__":
    main()
