"""Geography layers for the MOVE 3 basemaps (Sherman #13, MOVE 3 agent): `carolinas` (z9, 34.25N 79.90W) and `bentonville` (z13,
35.30N 78.32W). Same look as tools/make_georgia_geo.py (MOVE 2): Natural Earth admin-1 state lines (1865 lines = today's here), faint state
names, big towns of 1860 only (small labels, dark halo); rivers = the DEM-traced named rivers + faint stream net from
tools/make_m3_rivers.py (assets/src/<base>_m3_rivers.json). Story places (Rivers' Bridge, Orangeburg, Cheraw, Fayetteville, Averasboro,
Bentonville, Goldsboro, Durham's Station ...) are NOT here: the scenes add them as white-box labels.
Also the FLOODED SWAMP layer (winter 1865): blue-grey mottled water spread along the low courses of the rivers across Sherman's path
(coastal plain only, elevation < ~70 m), faded in and shimmered by the scenes.
-> assets/media/<base>_geo_ref.png (2x), <base>_rivers.json (map px, for LV.shimmer), <base>_swamp.png (1x, 2880x1620)
usage (from sherman/): python3 tools/make_m3_geo.py [carolinas bentonville]"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

CFG = {
    "carolinas": dict(
        cities=[("SAVANNAH", 32.081, -81.091, "l"), ("AUGUSTA", 33.471, -81.975, "l"), ("CHARLESTON", 32.776, -79.931, "r"),
                ("COLUMBIA", 34.000, -81.035, "l"), ("WILMINGTON", 34.235, -77.949, "r"), ("RALEIGH", 35.780, -78.639, "r"),
                ("NEW BERN", 35.107, -77.040, "r")],
        states=[("SOUTH CAROLINA", 33.55, -81.55), ("NORTH CAROLINA", 35.62, -79.65), ("GEORGIA", 32.75, -82.95), ("VIRGINIA", 36.75, -79.2)],
        water=[("ATLANTIC OCEAN", 33.05, -77.9, 35)],
        strong={"SAVANNAH", "SALKEHATCHIE", "COMBAHEE", "EDISTO", "CONGAREE", "SANTEE", "PEE DEE", "CAPE FEAR", "NEUSE", "WATEREE"},
        swamp={"SAVANNAH": 16, "SALKEHATCHIE": 22, "COMBAHEE": 20, "EDISTO": 16, "CONGAREE": 14, "SANTEE": 16, "PEE DEE": 16, "CAPE FEAR": 14,
               "WATEREE": 10, "NEUSE": 10}, swamp_net=6, elev_max=70, lw=(5, 2), font=30),
    "bentonville": dict(
        cities=[], states=[], water=[],
        strong={"MILL CREEK"}, swamp={"MILL CREEK": 26, "FALLING CREEK": 12}, swamp_net=8, elev_max=999, lw=(8, 3), font=30, net_o=1),
}

def main(base):
    c = CFG[base]
    J = json.load(open(f"assets/{base}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
    W, H = J["size"][0] * S, J["size"][1] * S
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)
    R = json.load(open(f"assets/src/{base}_m3_rivers.json"))
    land = Image.open(f"assets/{base}_land.png").convert("L").resize((W, H))
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if c["states"]:
        sd = ImageDraw.Draw(im)
        for f in json.load(open("assets/src/south_ne_states.geojson"))["features"]:
            g = f["geometry"]; rings = g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]
            for ring in rings: sd.line([P(la, lo) for lo, la in ring], fill=(236, 230, 214, 70), width=3, joint="curve")
        a = im.getchannel("A"); im.putalpha(Image.composite(a, Image.new("L", (W, H), 0), land))
    rd = ImageDraw.Draw(im)
    for n in R["net"]:
        if n["o"] < c.get("net_o", 2): continue
        rd.line([(x * S, y * S) for x, y in n["pts"]], fill=(96, 150, 190, 95), width=2, joint="curve")
    shimmer = []
    for nm, pts in R["named"].items():
        strong = nm in c["strong"]
        rd.line([(x * S, y * S) for x, y in pts], fill=(96, 150, 190, 225 if strong else 150), width=c["lw"][0] if strong else c["lw"][1], joint="curve")
        if strong: shimmer.append([[round(x), round(y)] for x, y in pts[::2]])
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", c["font"])
    fs = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo in c["states"]:
        x, y = P(la, lo); ImageDraw.Draw(im).text((x, y), " ".join(nm), font=fs, fill=(236, 230, 214, 60), anchor="mm")
    for nm, la, lo, side in c["cities"]:
        x, y = P(la, lo); r = 6
        td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    for nm, la, lo, rot in c["water"]:
        x, y = P(la, lo); t = Image.new("RGBA", (1100, 140), (0, 0, 0, 0)); ImageDraw.Draw(t).text((550, 70), " ".join(nm), font=fs, fill=(150, 195, 225, 190), anchor="mm")
        t = t.rotate(rot, resample=Image.BICUBIC, expand=True); im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    im.save(f"assets/media/{base}_geo_ref.png", optimize=True)
    json.dump(shimmer, open(f"assets/media/{base}_rivers.json", "w"))
    # ---- flooded swamp (1x) ----
    W1, H1 = J["size"]; sw = Image.new("L", (W1, H1), 0); sd = ImageDraw.Draw(sw)
    for nm, pts in R["named"].items():
        if nm in c["swamp"]: sd.line([tuple(p) for p in pts], fill=255, width=c["swamp"][nm], joint="curve")
    for n in R["net"]:
        if n["o"] == 2: sd.line([tuple(p) for p in n["pts"]], fill=200, width=c["swamp_net"], joint="curve")
    m = np.array(sw.filter(ImageFilter.GaussianBlur(5)), np.float32) / 255.0
    e = np.load(f"assets/src/{base}_hd_elev.npy").astype(np.float32); e = e[: H1 * 2, : W1 * 2].reshape(H1, 2, W1, 2).mean(axis=(1, 3))
    low = np.clip((c["elev_max"] - e) / 25.0, 0, 1) if c["elev_max"] < 900 else np.ones_like(e)
    rng = np.random.default_rng(7); noise = ndimage.gaussian_filter(rng.random((H1, W1)).astype(np.float32), 3)
    noise = (noise - noise.min()) / (noise.max() - noise.min())
    a = np.clip(m * low * (0.55 + 0.9 * noise), 0, 1) * (np.array(land.resize((W1, H1))) > 127)
    out = np.zeros((H1, W1, 4), np.uint8); out[..., 0] = 120; out[..., 1] = 160; out[..., 2] = 190; out[..., 3] = (a * 170).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(f"assets/media/{base}_swamp.png", optimize=True)
    print(f"wrote {base}_geo_ref.png, {base}_rivers.json ({len(shimmer)}), {base}_swamp.png")

if __name__ == "__main__":
    for b in (sys.argv[1:] or ["carolinas", "bentonville"]): main(b)
