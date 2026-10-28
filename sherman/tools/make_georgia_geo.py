"""Geography layers for the MOVE 2 basemaps (Sherman #13, MOVE 2 agent): `georgia` (z9, 32.95N 82.70W) and `savannah` (z11, 31.98N 81.15W).
Copy of make_south_geo.py (hook agent, read-only): Natural Earth 10m river centerlines (assets/src/south_ne_rivers.json) and admin-1 state
lines (assets/src/south_ne_states.geojson; 1864 lines = today's here), faint state names, big towns of 1860 only (small labels, dark halo).
Story places (Milledgeville, Griswoldville, Millen, Ebenezer Creek, Fort McAllister ...) are NOT here: scenes add them as white-box labels.
-> assets/media/<base>_geo_ref.png (2x), assets/media/<base>_rivers.json (map px, for LV.shimmer)
usage (from sherman/): python3 tools/make_georgia_geo.py [georgia|savannah ...]"""
import json, math, os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

CFG = {
    "georgia": dict(
        cities=[("ATLANTA", 33.749, -84.388, "l"), ("MACON", 32.841, -83.632, "l"), ("AUGUSTA", 33.471, -81.975, "r"),
                ("SAVANNAH", 32.081, -81.091, "r"), ("CHARLESTON", 32.776, -79.931, "r"), ("COLUMBIA", 34.000, -81.035, "r"),
                ("COLUMBUS", 32.461, -84.988, "l"), ("MONTGOMERY", 32.377, -86.300, "r"), ("CHATTANOOGA", 35.046, -85.310, "r")],
        states=[("GEORGIA", 32.05, -83.75), ("ALABAMA", 32.95, -86.15), ("SOUTH CAROLINA", 33.75, -80.55), ("TENNESSEE", 35.25, -84.3),
                ("FLORIDA", 30.85, -83.6), ("NORTH CAROLINA", 35.25, -82.2)],
        water=[("ATLANTIC OCEAN", 31.35, -79.9, 35)], lw=(5, 3), font=30, strong_rank=6),
    "savannah": dict(
        cities=[("SAVANNAH", 32.081, -81.091, "r")],
        states=[("GEORGIA", 31.80, -81.75), ("SOUTH CAROLINA", 32.35, -80.75)],
        water=[("ATLANTIC OCEAN", 31.72, -80.55, 40), ("OSSABAW SOUND", 31.80, -81.07, 0)], lw=(9, 5), font=34, strong_rank=12),
}
BIG = {"Chattahoochee", "Savannah", "Altamaha", "Ocmulgee", "Oconee", "Ogeechee", "Etowah", "Oostanaula", "Flint", "Alabama", "Tallapoosa",
       "Broad", "Saluda", "Congaree", "Santee", "Edisto", "North Fork Edisto", "S.  Fk.  Edisto", "Tennessee", "Tugaloo", "Satilla",
       "Alcovy", "Wateree", "Combahee", "Salkehatchie", "Hiwassee"}
STRONG = {"Chattahoochee", "Savannah", "Altamaha", "Ocmulgee", "Oconee", "Ogeechee", "Tennessee", "Congaree", "Santee", "Alabama", "Flint"}

def lines_of(g):
    if g["type"] == "Polygon": return g["coordinates"]
    if g["type"] == "MultiPolygon": return [r for p in g["coordinates"] for r in p]
    return []

def main(base):
    c = CFG[base]
    J = json.load(open(f"assets/{base}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
    W, H = J["size"][0] * S, J["size"][1] * S
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)
    st = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
        for ring in lines_of(f["geometry"]):
            sd.line([P(la, lo) for lo, la in ring], fill=(236, 230, 214, 70), width=3, joint="curve")
    land = Image.open(f"assets/{base}_land.png").convert("L").resize((W, H))
    a = st.getchannel("A"); a = Image.composite(a, Image.new("L", (W, H), 0), land); st.putalpha(a)
    im = st.copy(); rd = ImageDraw.Draw(im); shimmer = []
    for r in json.load(open("assets/src/south_ne_rivers.json")):
        nm, sr = r["name"] or "", r["scalerank"] or 12
        pts = [P(la, lo) for lo, la in r["pts"]]
        if len(pts) < 2 or not any(0 <= x < W and 0 <= y < H for x, y in pts): continue
        if sr <= 7 or nm in BIG:
            strong = sr <= c["strong_rank"] and (sr <= 6 or nm in STRONG) or nm in STRONG
            rd.line(pts, fill=(96, 150, 190, 225 if strong else 150), width=c["lw"][0] if strong else c["lw"][1], joint="curve")
            if strong: shimmer.append([[round(x / S), round(y / S)] for x, y in pts[::2]])
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", c["font"])
    fs = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo in c["states"]:
        x, y = P(la, lo); ImageDraw.Draw(im).text((x, y), " ".join(nm), font=fs, fill=(236, 230, 214, 60), anchor="mm")
    for nm, la, lo, side in c["cities"]:
        x, y = P(la, lo)
        r = 6; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    fw = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo, rot in c["water"]:
        x, y = P(la, lo); t = Image.new("RGBA", (1100, 140), (0, 0, 0, 0)); ImageDraw.Draw(t).text((550, 70), " ".join(nm), font=fw, fill=(150, 195, 225, 190), anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    im.save(f"assets/media/{base}_geo_ref.png", optimize=True)
    json.dump(shimmer, open(f"assets/media/{base}_rivers.json", "w"))
    print(f"wrote {base}_geo_ref.png + {base}_rivers.json ({len(shimmer)} rivers)")

if __name__ == "__main__":
    for b in (sys.argv[1:] or ["georgia"]):
        if os.path.exists(f"assets/{b}_land.png"): main(b)
        else: print("no basemap yet:", b)
