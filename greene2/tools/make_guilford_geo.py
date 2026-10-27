"""1781 battlefield geography for the Guilford Courthouse map (`guilford`, z15, 3.86 m/px), BATTLEFIELD agent (greene2).
Woods everywhere (1781 Guilford County = forest with a few farms), the three clearings (Hoskins farm, the small field in the
2nd-line woods, the courthouse clearing), the rail fence, the Great Salisbury (New Garden) road W -> E up to the courthouse, the
Reedy Fork road north from the courthouse, the creeks (traced from the elevation, assets/src/guilford_dem_rivers.json), the
courthouse + a few buildings.  Positions: NPS Guilford Courthouse NMP park map + American Battlefield Trust map + Babits & Howard;
spacing between the three lines exaggerated ~1.3x for readability (research/FACT_NOTES_guilford.md).
usage (from greene2/): python3 tools/make_guilford_geo.py
-> assets/media/guilford_1781_ref.jpg  (5760x3240: guilford_hd_ref + the geography, shown full-frame over the relief at t=0)
-> assets/media/guilford_geo.json     {roads, streams, fence, places} in map px (2880x1620)"""
import json, math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "guilford"
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=S):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * s)
def smooth(pts, n=10, closed=False):
    P_ = ([pts[-1]] + pts + [pts[0], pts[1]]) if closed else ([pts[0]] + pts + [pts[-1]])
    out = []
    for i in range(1, len(P_) - 2):
        p0, p1, p2, p3 = P_[i - 1], P_[i], P_[i + 1], P_[i + 2]
        for k in range(n):
            t = k / n
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t ** 3) for j in (0, 1)))
    if not closed: out.append(pts[-1])
    return out

# ---------- geography (lat, lon) ----------
# Great Salisbury road (New Garden road): from New Garden (WSW, off the frame) east up the slope to the courthouse, on to the east
ROAD = [(36.1050, -79.9130), (36.1150, -79.8930), (36.1205, -79.8790), (36.1252, -79.8680), (36.1282, -79.8605), (36.1296, -79.8550), (36.1301, -79.8500),
        (36.1306, -79.8455), (36.1318, -79.8418), (36.1332, -79.8392), (36.1340, -79.8378), (36.1352, -79.8330), (36.1378, -79.8240),
        (36.1410, -79.8130), (36.1440, -79.8000), (36.1470, -79.7860)]
REEDY = [(36.1340, -79.8378), (36.1378, -79.8392), (36.1430, -79.8418), (36.1490, -79.8450), (36.1540, -79.8462), (36.1600, -79.8480)]
COURTHOUSE = (36.1341, -79.8374)
# clearings
C1 = [(36.1342, -79.8566), (36.1340, -79.8530), (36.1336, -79.8502), (36.1266, -79.8500), (36.1258, -79.8528), (36.1262, -79.8566), (36.1290, -79.8580)]  # Hoskins farm
C2 = [(36.1292, -79.8480), (36.1292, -79.8462), (36.1279, -79.8460), (36.1275, -79.8478)]   # small field in the 2nd-line woods
C3 = [(36.1378, -79.8440), (36.1380, -79.8395), (36.1372, -79.8352), (36.1338, -79.8340), (36.1302, -79.8352), (36.1292, -79.8395),
      (36.1296, -79.8440), (36.1338, -79.8448)]  # the courthouse clearing (third line on the rise at its west/centre)
HOSKINS = (36.1310, -79.8548)
FENCE = [(36.1336, -79.8501), (36.1266, -79.8501)]   # rail fence along the east edge of the Hoskins fields
PLACES = {"courthouse": COURTHOUSE, "hoskins": HOSKINS, "l1": (36.1301, -79.8503), "l2": (36.1306, -79.8457), "l3": (36.1322, -79.8400),
          "brit_start": (36.1298, -79.8560), "new_garden_dir": (36.1210, -79.8775)}

def build():
    rel = Image.open(f"assets/{BASE}_hd_ref.jpg").convert("RGB")
    a = np.asarray(rel, float)
    clear = Image.new("L", (W, H), 0); cd = ImageDraw.Draw(clear)
    for c in (C1, C2, C3): cd.polygon(smooth([P(*q) for q in c], 8, True), fill=255)
    clear = clear.filter(ImageFilter.GaussianBlur(5))
    cm = np.asarray(clear, float)[..., None] / 255
    woods = 1 - cm
    # woods: darker, greener; clearings: warm, lighter (old fields)
    wood_col = a * np.array([0.60, 0.68, 0.60])
    field_col = a * 0.55 + np.array([150, 142, 108]) * 0.45
    out = wood_col * woods + field_col * cm
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8)).convert("RGBA")
    rng = np.random.default_rng(1781)
    # tree crowns (stipple) in the woods
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    cmm = np.asarray(clear)
    for y in range(0, H, 13):
        for x in range(0, W, 14):
            px, py = x + rng.uniform(-6, 6) + (7 if (y // 13) % 2 else 0), y + rng.uniform(-5, 5)
            xi, yi = int(min(max(px, 0), W - 1)), int(min(max(py, 0), H - 1))
            if cmm[yi, xi] > 40 or rng.random() < 0.18: continue
            r = rng.uniform(4.5, 7.5); g = rng.uniform(-8, 8)
            d.ellipse((px - r + 1.5, py - r + 2.5, px + r + 1.5, py + r + 2.5), fill=(18, 24, 18, 70))
            d.ellipse((px - r, py - r, px + r, py + r), fill=(int(70 + g), int(90 + g), int(68 + g), 120))
            d.ellipse((px - r * 0.55, py - r * 0.6, px + r * 0.1, py - r * 0.05), fill=(140, 158, 120, 45))
    img.alpha_composite(lay)
    # furrows in the clearings + field edge
    fur = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fur)
    for c in range(-H, W + H, 12): fd.line([(c, 0), (c + H * 0.35, H)], fill=(60, 54, 36, 55), width=2)
    fm = Image.fromarray((cmm > 150).astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(2))
    blank = Image.new("RGBA", (W, H), (0, 0, 0, 0)); blank.paste(fur, (0, 0), fm); img.alpha_composite(blank)
    top = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(top)
    for c in (C1, C2, C3): td.line(smooth([P(*q) for q in c], 8, True) + [smooth([P(*q) for q in c], 8, True)[0]], fill=(40, 34, 22, 140), width=3)
    # creeks (DEM traced): order >= 2 drawn, order 1 faint
    streams = []
    try:
        R = json.load(open(f"assets/src/{BASE}_dem_rivers.json"))
    except FileNotFoundError:
        R = []
    for s in R:
        pts = [tuple(p) for p in s["pts"]]
        if s["order"] == 1: continue
        if s["order"] == 2: continue
        td.line(pts, fill=(20, 30, 40, 150), width=10, joint="curve"); td.line(pts, fill=(80, 130, 168, 235), width=6, joint="curve")
        streams.append([[round(x / S, 1), round(y / S, 1)] for x, y in pts[::3] + [pts[-1]]])
    # roads: light casing + tan surface
    for pts, wd in ((ROAD, 9), (REEDY, 7)):
        sp = smooth([P(*q) for q in pts], 10)
        td.line(sp, fill=(30, 24, 16, 210), width=wd + 6, joint="curve")
        td.line(sp, fill=(196, 178, 136, 245), width=wd, joint="curve")
    # rail fence (zig-zag) along the east edge of the Hoskins fields
    f0, f1 = P(*FENCE[0]), P(*FENCE[1]); L = math.hypot(f1[0] - f0[0], f1[1] - f0[1]); n = int(L / 9)
    zz = [(f0[0] + (f1[0] - f0[0]) * k / n + (4 if k % 2 else -4), f0[1] + (f1[1] - f0[1]) * k / n) for k in range(n + 1)]
    td.line(zz, fill=(20, 14, 8, 220), width=7, joint="curve"); td.line(zz, fill=(170, 128, 80, 255), width=3, joint="curve")
    # the courthouse + a few log buildings (jail, tavern) around the crossroads
    cx, cy = P(*COURTHOUSE)
    for dx, dy, w, h in ((26, 22, 16, 12), (-34, 26, 14, 10), (34, -26, 12, 10), (-22, -30, 14, 11)):
        td.rectangle((cx + dx - w, cy + dy - h, cx + dx + w, cy + dy + h), fill=(92, 70, 46, 255), outline=(20, 14, 8, 255), width=3)
    td.rectangle((cx - 22, cy - 15, cx + 22, cy + 15), fill=(150, 108, 66, 255), outline=(20, 14, 8, 255), width=4)
    td.polygon([(cx - 27, cy - 13), (cx, cy - 33), (cx + 27, cy - 13)], fill=(96, 60, 34, 255), outline=(20, 14, 8, 255))
    hx, hy = P(*HOSKINS)
    td.rectangle((hx - 14, hy - 10, hx + 14, hy + 10), fill=(120, 90, 58, 255), outline=(20, 14, 8, 255), width=3)
    img.alpha_composite(top)
    img.convert("RGB").save(f"assets/media/{BASE}_1781_ref.jpg", quality=88)
    P1 = lambda q: [round(v, 1) for v in P(*q, s=1)]
    json.dump({"road": [P1(q) for q in smooth(ROAD, 4)], "reedy": [P1(q) for q in smooth(REEDY, 4)], "fence": [P1(q) for q in FENCE],
               "streams": streams, "places": {k: P1(v) for k, v in PLACES.items()},
               "c1": [P1(q) for q in C1], "c3": [P1(q) for q in C3]},
              open(f"assets/media/{BASE}_geo.json", "w"), separators=(",", ":"))
    print("wrote", f"assets/media/{BASE}_1781_ref.jpg", {k: P1(v) for k, v in PLACES.items()})

if __name__ == "__main__":
    build()
