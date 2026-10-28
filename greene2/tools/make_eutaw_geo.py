"""1781 battlefield geography for the Eutaw Springs map (`eutaw`, z15, ~3.9 m/px), BATTLEFIELD agent (greene2).
Very flat coastal plain: everything is drawn by hand. Pine/oak woods everywhere, the British camp clearing (tents are drawn by the
scene), the brick Eutaw house + its walled garden on the east side, the springs + Eutaw Creek running north into the Santee
(today Lake Marion), the blackjack-oak thicket along the creek on the British right, the River road from the west (Burdell's) east
towards Charleston, the Santee along the top.  Positions: American Battlefield Trust Eutaw Springs map, the SC state historic site
marker (33.4074 N, 80.2986 W = the house site), Lee's / Greene's accounts; spacing exaggerated ~1.4x (research/FACT_NOTES_eutaw.md).
usage (from greene2/): python3 tools/make_eutaw_geo.py
-> assets/media/eutaw_1781_ref.jpg (5760x3240, eutaw_hd_ref + geography, shown full-frame over the relief at t=0)
-> assets/media/eutaw_geo.json    {road, creek, santee, places, ...} in map px (2880x1620)"""
import json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BASE = "eutaw"
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
ROAD = [(33.3985, -80.3560), (33.4005, -80.3400), (33.4025, -80.3250), (33.4042, -80.3120), (33.4052, -80.3040), (33.4056, -80.2990),
        (33.4054, -80.2930), (33.4046, -80.2850), (33.4030, -80.2720), (33.4010, -80.2560), (33.3990, -80.2400), (33.3975, -80.2280)]
SPRINGS = (33.4060, -80.2928)
CREEK = [SPRINGS, (33.4085, -80.2930), (33.4110, -80.2950), (33.4134, -80.2985), (33.4145, -80.3030), (33.4152, -80.3075),
         (33.4182, -80.3095), (33.4222, -80.3090), (33.4258, -80.3100)]
SANTEE = [(33.4330, -80.3560), (33.4300, -80.3400), (33.4268, -80.3250), (33.4255, -80.3100), (33.4262, -80.2950), (33.4285, -80.2800),
          (33.4300, -80.2650), (33.4320, -80.2500), (33.4345, -80.2300)]
CLEARING = [(33.4100, -80.3050), (33.4108, -80.3000), (33.4102, -80.2955), (33.4080, -80.2935), (33.4048, -80.2935), (33.4030, -80.2960),
            (33.4025, -80.3010), (33.4030, -80.3055), (33.4060, -80.3068)]
THICKET = [(33.4138, -80.3068), (33.4136, -80.3030), (33.4128, -80.2992), (33.4114, -80.2972), (33.4104, -80.2990), (33.4106, -80.3035), (33.4114, -80.3070)]
HOUSE = (33.4074, -80.2975)
GARDEN = [(33.4083, -80.2967), (33.4083, -80.2944), (33.4064, -80.2944), (33.4064, -80.2967)]
FIELDS = [[(33.4025, -80.3330), (33.4030, -80.3270), (33.4005, -80.3262), (33.3995, -80.3325)],     # Burdell's side: small plantation fields
          [(33.4075, -80.2880), (33.4080, -80.2820), (33.4050, -80.2815), (33.4045, -80.2878)]]
PLACES = {"house": HOUSE, "springs": SPRINGS, "camp": (33.4068, -80.3010), "thicket": (33.4122, -80.3025), "brit_line": (33.4060, -80.3070),
          "us_l1": (33.4045, -80.3135), "us_l2": (33.4040, -80.3175), "rooting": (33.4015, -80.3300), "charleston_dir": (33.3990, -80.2420)}

def build():
    a = np.asarray(Image.open(f"assets/{BASE}_hd_ref.jpg").convert("RGB"), float)
    clear = Image.new("L", (W, H), 0); cd = ImageDraw.Draw(clear)
    for c in [CLEARING] + FIELDS: cd.polygon(smooth([P(*q) for q in c], 8, True), fill=255)
    rd = smooth([P(*q) for q in ROAD], 10); cd.line(rd, fill=200, width=16)
    clear = clear.filter(ImageFilter.GaussianBlur(5)); cmm = np.asarray(clear)
    cm = cmm[..., None].astype(float) / 255
    thick = Image.new("L", (W, H), 0); ImageDraw.Draw(thick).polygon(smooth([P(*q) for q in THICKET], 8, True), fill=255)
    thick = thick.filter(ImageFilter.GaussianBlur(4)); tm = np.asarray(thick)
    water = Image.new("L", (W, H), 0); wd = ImageDraw.Draw(water)
    sant = smooth([P(*q) for q in SANTEE], 10); wd.line(sant, fill=200, width=48, joint="curve")
    swamp = Image.new("L", (W, H), 0); ImageDraw.Draw(swamp).line(sant, fill=255, width=360, joint="curve"); swamp = swamp.filter(ImageFilter.GaussianBlur(40))
    sm = np.asarray(swamp, float)[..., None] / 255
    wood_col = a * np.array([0.60, 0.68, 0.60])
    field_col = a * 0.55 + np.array([150, 142, 108]) * 0.45
    out = wood_col * (1 - cm) + field_col * cm
    out = out * (1 - sm * 0.35) + np.array([70, 92, 84]) * sm * 0.35     # the Santee swamp: darker, wetter
    wm = np.asarray(water.filter(ImageFilter.GaussianBlur(3)), float)[..., None] / 255
    out = out * (1 - wm) + np.array([58, 88, 108]) * wm
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8)).convert("RGBA")
    rng = np.random.default_rng(1781)
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    wmm = np.asarray(water)
    for y in range(0, H, 13):
        for x in range(0, W, 14):
            px, py = x + rng.uniform(-6, 6) + (7 if (y // 13) % 2 else 0), y + rng.uniform(-5, 5)
            xi, yi = int(min(max(px, 0), W - 1)), int(min(max(py, 0), H - 1))
            if cmm[yi, xi] > 40 or wmm[yi, xi] > 20: continue
            dense = tm[yi, xi] > 100
            if not dense and rng.random() < 0.2: continue
            r = rng.uniform(3.5, 5.5) if dense else rng.uniform(4.5, 7.5); g = rng.uniform(-8, 8)
            col = (int(52 + g), int(70 + g), int(46 + g), 190) if dense else (int(70 + g), int(90 + g), int(68 + g), 120)
            d.ellipse((px - r + 1.5, py - r + 2.5, px + r + 1.5, py + r + 2.5), fill=(18, 24, 18, 70))
            d.ellipse((px - r, py - r, px + r, py + r), fill=col)
            d.ellipse((px - r * 0.55, py - r * 0.6, px + r * 0.1, py - r * 0.05), fill=(140, 158, 120, 45))
            if dense:   # a second, offset crown: the thicket is denser
                q = (px + 6, py + 5); d.ellipse((q[0] - r, q[1] - r, q[0] + r, q[1] + r), fill=col)
    img.alpha_composite(lay)
    fur = Image.new("RGBA", (W, H), (0, 0, 0, 0)); fd = ImageDraw.Draw(fur)
    for c in range(-H, W + H, 12): fd.line([(c, 0), (c + H * 0.35, H)], fill=(60, 54, 36, 40), width=2)
    fm = Image.fromarray((cmm > 150).astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(2))
    blank = Image.new("RGBA", (W, H), (0, 0, 0, 0)); blank.paste(fur, (0, 0), fm); img.alpha_composite(blank)
    top = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(top)
    for c in [CLEARING] + FIELDS:
        sp = smooth([P(*q) for q in c], 8, True); td.line(sp + [sp[0]], fill=(40, 34, 22, 140), width=3)
    sp = smooth([P(*q) for q in THICKET], 8, True); td.line(sp + [sp[0]], fill=(24, 30, 18, 160), width=3)
    # creek + springs
    ck = smooth([P(*q) for q in CREEK], 10); td.line(ck, fill=(20, 30, 40, 160), width=12, joint="curve"); td.line(ck, fill=(84, 136, 176, 255), width=7, joint="curve")
    sx, sy = P(*SPRINGS); td.ellipse((sx - 12, sy - 9, sx + 12, sy + 9), fill=(84, 136, 176, 255), outline=(20, 30, 40, 200), width=3)
    td.line(sant, fill=(150, 190, 214, 90), width=3, joint="curve")
    # the River road
    td.line(rd, fill=(30, 24, 16, 210), width=15, joint="curve"); td.line(rd, fill=(196, 178, 136, 245), width=9, joint="curve")
    # walled garden (high brick wall) + the brick house (two storeys, the windows the British fired from)
    g = [P(*q) for q in GARDEN]
    td.polygon(g, fill=(96, 112, 74, 200)); td.line(g + [g[0]], fill=(20, 12, 8, 255), width=12); td.line(g + [g[0]], fill=(168, 84, 56, 255), width=7)
    for k in range(5):   # garden beds
        y0 = g[0][1] + (g[3][1] - g[0][1]) * (k + 0.6) / 5.4
        td.line([(g[0][0] + 12, y0), (g[1][0] - 12, y0)], fill=(70, 84, 52, 200), width=4)
    hx, hy = P(*HOUSE)
    td.rectangle((hx - 30, hy - 22, hx + 30, hy + 22), fill=(150, 66, 44, 255), outline=(20, 12, 8, 255), width=5)
    td.line([(hx - 30, hy), (hx + 30, hy)], fill=(84, 36, 24, 255), width=4)
    for wx in (-18, -6, 6, 18):
        for wy in (-10, 10): td.rectangle((hx + wx - 3, hy + wy - 4, hx + wx + 3, hy + wy + 4), fill=(240, 220, 160, 255))
    img.alpha_composite(top)
    img.convert("RGB").save(f"assets/media/{BASE}_1781_ref.jpg", quality=88)
    P1 = lambda q: [round(v, 1) for v in P(*q, s=1)]
    json.dump({"road": [P1(q) for q in smooth(ROAD, 4)], "creek": [P1(q) for q in smooth(CREEK, 4)], "santee": [P1(q) for q in smooth(SANTEE, 3)],
               "clearing": [P1(q) for q in CLEARING], "thicket": [P1(q) for q in THICKET], "garden": [P1(q) for q in GARDEN],
               "places": {k: P1(v) for k, v in PLACES.items()}}, open(f"assets/media/{BASE}_geo.json", "w"), separators=(",", ":"))
    print("wrote", {k: P1(v) for k, v in PLACES.items()})

if __name__ == "__main__":
    build()
