"""Geography layer for the `carolinas` basemap (z9, 35.80N 80.20W), Greene #2 remake (MOVE 1 agent), Frontlines look:
rivers traced from the HD elevation (tools/make_carolinas_rivers.py -> assets/src/carolinas_rivers.json): the named rivers strong
(CATAWBA, YADKIN, DAN a little wider: they are the story), the stream network faint; the 1781 towns of size only, small labels with a
dark halo; river names along the water; the three colony names small; the Virginia - North Carolina line (surveyed 1728/1749/1779)
and the North - South Carolina line (1735-37 / 1772 surveys) faint and dashed. Story places (Cowpens, Ramsour's Mill, Cowan's Ford,
Trading Ford, Guilford Courthouse, Cheraw, the Dan ferries) are NOT baked: scenes add them as small white-box labels.
No modern towns, no modern lakes (the traced rivers run through Lake Norman / High Rock / Kerr as the 1781 rivers did).
-> assets/media/carolinas_geo_ref.png (rivers + colony lines) + carolinas_lbl_ref.png (towns, river + colony names), 2x: 5760x3240, shown at 2880x1620
-> assets/media/carolinas_rivers.json  {"shimmer": [[[x, y], ...], ...], "named": {NAME: [[x, y], ...]}}  map px, smoothed
usage (from greene2/): python3 tools/make_carolinas_geo.py"""
import json, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

J = json.load(open("assets/carolinas.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * S, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * S)

# towns of size in 1780-81 (all existed then; coordinates Nominatim 2026-10-27); side = label r / l / a(bove) / b(elow)
CITIES = [("CHARLOTTE", 35.227, -80.843, "r"), ("SALISBURY", 35.671, -80.474, "l"), ("HILLSBOROUGH", 36.075, -79.100, "r"),
          ("HALIFAX", 36.329, -77.590, "r"), ("WILMINGTON", 34.236, -77.946, "l"), ("PETERSBURG", 37.228, -77.402, "b"),
          ("CAMDEN", 34.246, -80.607, "r")]
# river names: (name, river key, fraction along the smoothed river, label offset px (map px), font size)
RLAB = [("CATAWBA", "CATAWBA", 0.47, (-22, 0), 24), ("YADKIN", "YADKIN", 0.30, (-4, -18), 24), ("DAN", "DAN", 0.38, (0, -18), 24),
        ("PEE DEE", "PEE DEE", 0.45, (20, 0), 20), ("HAW", "HAW", 0.45, (14, -8), 18), ("DEEP", "DEEP", 0.62, (0, 16), 18),
        ("CAPE FEAR", "CAPE FEAR", 0.40, (24, 0), 20), ("ROANOKE", "ROANOKE", 0.30, (0, -16), 20), ("WATEREE", "WATEREE", 0.45, (18, 0), 18),
        ("BROAD", "BROAD", 0.55, (16, 0), 18), ("APPOMATTOX", "APPOMATTOX", 0.55, (0, -14), 16)]
STATES = [("VIRGINIA", 36.98, -79.20), ("NORTH CAROLINA", 35.95, -78.55), ("SOUTH CAROLINA", 34.42, -81.55)]
VA_NC = [(36.588, -83.68), (36.60, -81.68), (36.57, -80.60), (36.545, -79.51), (36.55, -78.50), (36.55, -77.20), (36.55, -75.87)]
NC_SC = [(33.85, -78.54), (34.33, -79.10), (34.81, -79.67), (34.82, -80.79), (35.08, -80.93), (35.15, -81.04), (35.17, -82.30), (35.21, -83.10)]

def smooth(pts, k=4, step=2):
    out = []
    for i in range(0, len(pts), step):
        a, b = max(0, i - k), min(len(pts), i + k + 1)
        out.append([sum(p[0] for p in pts[a:b]) / (b - a), sum(p[1] for p in pts[a:b]) / (b - a)])
    if out[-1] != pts[-1]: out.append(list(pts[-1]))
    out[0] = list(pts[0]); return out

def at_frac(pts, f):
    L = [0.0]
    for i in range(1, len(pts)): L.append(L[-1] + math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    d = f * L[-1]; i = next(j for j in range(1, len(pts)) if L[j] >= d)
    a, b = pts[max(0, i - 6)], pts[min(len(pts) - 1, i + 6)]
    ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    return pts[i], ang

def dashed(d, pts, fill, w, on=22, off=14):
    for i in range(1, len(pts)):
        (x0, y0), (x1, y1) = pts[i - 1], pts[i]; L = math.hypot(x1 - x0, y1 - y0); s = 0.0
        while s < L:
            e = min(L, s + on); d.line([(x0 + (x1 - x0) * s / L, y0 + (y1 - y0) * s / L), (x0 + (x1 - x0) * e / L, y0 + (y1 - y0) * e / L)], fill=fill, width=w); s += on + off

def main():
    R = json.load(open("assets/src/carolinas_rivers.json"))
    named = {k: smooth(v) for k, v in R["named"].items()}
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); rd = ImageDraw.Draw(im)
    # colony lines first (under everything), faint
    dashed(rd, [P(*q) for q in VA_NC], (226, 214, 190, 70), 3); dashed(rd, [P(*q) for q in NC_SC], (226, 214, 190, 70), 3)
    for n in R["net"]:
        pts = [(x * S, y * S) for x, y in smooth(n["pts"], 2, 1)]
        if len(pts) > 1: rd.line(pts, fill=(96, 150, 190, 55 if n["o"] == 1 else 105), width=2 if n["o"] == 1 else 3, joint="curve")
    shimmer = []
    for k, v in named.items():
        story = k in ("CATAWBA", "YADKIN", "DAN")
        rd.line([(x * S, y * S) for x, y in v], fill=(110, 165, 205, 240), width=7 if story else 5, joint="curve")
        shimmer.append([[round(x), round(y)] for x, y in v[::3]])
    im.save("assets/media/carolinas_geo_ref.png", optimize=True)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))                     # labels on their own layer (scenes fade it on close-ups)
    lab = Image.new("RGBA", (W, H), (0, 0, 0, 0)); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td, hd = ImageDraw.Draw(lab), ImageDraw.Draw(halo); f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 30)
    for nm, la, lo, side in CITIES:
        x, y = P(la, lo)
        r = 6; td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 3, y - r - 3, x + r + 3, y + r + 3), fill=(10, 14, 16, 190))
        anc, tx, ty = {"r": ("lm", x + 13, y), "l": ("rm", x - 13, y), "a": ("mb", x, y - 11), "b": ("mt", x, y + 11)}[side]
        hd.text((tx, ty), nm, font=f, fill=(10, 14, 16, 230), anchor=anc); td.text((tx, ty), nm, font=f, fill=(240, 236, 226, 235), anchor=anc)
    halo = halo.filter(ImageFilter.GaussianBlur(4)); im.alpha_composite(halo); im.alpha_composite(lab)
    for nm, la, lo in STATES:
        x, y = P(la, lo); t = Image.new("RGBA", (900, 120), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((450, 60), " ".join(nm), font=ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34), fill=(232, 222, 200, 120), anchor="mm")
        im.alpha_composite(t, (int(x - 450), int(y - 60)))
    for nm, key, fr, (dx, dy), fs in RLAB:
        (x, y), ang = at_frac(named[key], fr); x, y = (x + dx) * S, (y + dy) * S
        t = Image.new("RGBA", (700, 110), (0, 0, 0, 0)); ImageDraw.Draw(t).text((350, 55), " ".join(nm), font=ImageFont.truetype("tools/oswald-latin-700-normal.ttf", fs + 6), fill=(160, 205, 235, 225), anchor="mm")
        hl = t.filter(ImageFilter.GaussianBlur(3)); hl = Image.merge("RGBA", (*[Image.new("L", t.size, 8)] * 3, hl.getchannel("A").point(lambda a: min(255, a * 2))))
        hl.alpha_composite(t); t = hl.rotate(-ang, resample=Image.BICUBIC, expand=True)
        im.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    t = Image.new("RGBA", (900, 120), (0, 0, 0, 0)); ImageDraw.Draw(t).text((450, 60), "A T L A N T I C   O C E A N", font=ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34), fill=(150, 195, 225, 170), anchor="mm")
    x, y = P(34.20, -76.95); im.alpha_composite(t, (int(x - 450), int(y - 60)))
    im.save("assets/media/carolinas_lbl_ref.png", optimize=True)
    json.dump({"shimmer": shimmer, "named": {k: [[round(x, 1), round(y, 1)] for x, y in v] for k, v in named.items()}}, open("assets/media/carolinas_rivers.json", "w"))
    print("wrote carolinas_geo_ref.png + carolinas_rivers.json (%d rivers)" % len(shimmer))

if __name__ == "__main__":
    main()
