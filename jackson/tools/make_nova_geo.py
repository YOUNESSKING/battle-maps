"""Geography layer + scene data for the `nova` basemap (z10, 38.60N 77.70W; Stonewall Jackson #11, MOVE 2 owner; MOVE 3 + hook reuse
it read-only). make_geo_layer "ref" look: thin blue rivers, the 1862 railroads (dark line + ties), BIG towns only with small 1862
labels, mountain names; story places (Jeffersonton, Amissville, Orlean, Salem, Thoroughfare Gap, Gainesville, Bristoe Station,
Manassas Junction, Centreville, Aquia Landing...) are white boxes in the scenes.
Rivers = OSM geometry via Nominatim (assets/src/nova_rivers_nominatim.json; Overpass was down on 2026-10-16). Railroads = hand-traced
through the 1862 stations (checked points, research/FACT_NOTES_nova.md): Orange & Alexandria RR (Alexandria - Manassas Junction -
Bristoe - Catlett - Warrenton Junction - Rappahannock Station - Culpeper - Orange - Gordonsville), Manassas Gap RR (Manassas Junction -
Gainesville - Thoroughfare Gap - Salem - Manassas Gap - Front Royal - Strasburg), Richmond, Fredericksburg & Potomac RR (Aquia Landing -
Fredericksburg - south). Data (c) OpenStreetMap contributors (ODbL).
usage (from jackson/): python3 tools/make_nova_geo.py
 -> assets/media/nova_geo_ref.png (5760x3240, shown at 2880x1620, ABOVE the territory layer)
 -> assets/media/nova_data.json {places, rivers (shimmer), oarr, mgrr, rfp, march (Jeffersonton -> Bristoe, with cumulative miles),
                                 potomac (map px)}"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "nova"
J = json.load(open(f"assets/{BASE}.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]; S = 2
W, H = J["size"][0] * S, J["size"][1] * S
def P(lat, lon, s=1):
    n = 256 * 2 ** Z; r = math.radians(lat)
    return (((lon + 180) / 360 * n - OX) * s, ((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY) * s)
def miles(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (*a, *b))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 3958.8 * 2 * math.asin(math.sqrt(h))

PLACES = dict(
    jeffersonton=(38.6371, -77.9150), hinsons_mill=(38.6800, -77.9650), amissville=(38.6715, -77.9956), orlean=(38.7526, -77.9639),
    salem=(38.8647, -77.8580), the_plains=(38.8625, -77.7741), thoroughfare_gap=(38.8246, -77.7158), haymarket=(38.8121, -77.6368),
    gainesville=(38.7961, -77.6126), bristoe=(38.7225, -77.5405), manassas_jct=(38.7509, -77.4753), centreville=(38.8388, -77.4316),
    groveton=(38.8126, -77.5483), stony_ridge=(38.8300, -77.5800), stone_bridge=(38.8245, -77.5035), warrenton=(38.7135, -77.7954),
    waterloo=(38.6960, -77.9061), sulphur_springs=(38.6600, -77.8650), rappahannock_stn=(38.5337, -77.8081), kellys_ford=(38.4790, -77.7810),
    catlett=(38.6537, -77.6405), warrenton_jct=(38.6370, -77.6880), culpeper=(38.4734, -77.9961), fredericksburg=(38.3001, -77.4571),
    falmouth=(38.3240, -77.4680), aquia=(38.3960, -77.3180), alexandria=(38.8051, -77.0470), washington=(38.8950, -77.0365),
    fairfax=(38.8462, -77.3064), chantilly=(38.8770, -77.4000), leesburg=(39.1155, -77.5646), whites_ford=(39.1642, -77.4756),
    frederick=(39.4158, -77.4128), harpers_ferry=(39.3254, -77.7389), winchester=(39.1857, -78.1633), front_royal=(38.9182, -78.1945),
    gordonsville=(38.1374, -78.1878), orange=(38.2454, -78.1108), thoroughfare_mtn=(38.8500, -77.7300))
# Jackson's march, 25-26 Aug 1862 (NPS / Henderson): Jeffersonton - Hinson's Mill ford - Amissville - Orlean - Salem (night 25) -
# The Plains - Thoroughfare Gap - Haymarket - Gainesville - Bristoe Station (sunset 26). Road bends approximated through the towns.
MARCH = ["jeffersonton", (38.660, -77.945), "hinsons_mill", "amissville", (38.715, -77.985), "orlean", (38.800, -77.925), (38.840, -77.885),
         "salem", "the_plains", (38.845, -77.745), "thoroughfare_gap", "haymarket", "gainesville", (38.760, -77.585), "bristoe"]
MARCH = [PLACES[q] if isinstance(q, str) else q for q in MARCH]
OARR = [(38.8051, -77.0470), (38.7900, -77.1500), (38.7950, -77.2600), (38.7900, -77.3300), (38.7760, -77.4300), (38.7509, -77.4753),
        (38.7225, -77.5405), (38.6880, -77.5900), (38.6537, -77.6405), (38.6370, -77.6880), (38.5720, -77.7630), (38.5337, -77.8081),
        (38.5020, -77.8920), (38.4734, -77.9961), (38.4000, -78.0300), (38.3150, -78.0600), (38.2454, -78.1108), (38.1374, -78.1878)]
MGRR = [(38.7509, -77.4753), (38.7640, -77.5350), (38.7850, -77.5900), (38.7935, -77.6115), (38.8115, -77.6360), (38.8246, -77.7158),
        (38.8625, -77.7741), (38.8647, -77.8580), (38.9000, -77.9200), (38.9050, -78.0000), (38.9300, -78.0800), (38.9182, -78.1945),
        (38.9600, -78.2900), (38.9890, -78.3580)]
RFP = [(38.3960, -77.3180), (38.3700, -77.3700), (38.3400, -77.4300), (38.3240, -77.4600), (38.3001, -77.4571), (38.2300, -77.4400),
       (38.1000, -77.3800), (37.9000, -77.4200), (37.7400, -77.4600)]

def chaikin(pts, k=3):
    pts = np.array(pts, float)
    for _ in range(k):
        q = [pts[0]]
        for a, b in zip(pts[:-1], pts[1:]): q += [0.75 * a + 0.25 * b, 0.25 * a + 0.75 * b]
        pts = np.array(q + [pts[-1]])
    return pts

if __name__ == "__main__":
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    NM = json.load(open(f"assets/src/{BASE}_rivers_nominatim.json"))
    WID = {"potomac": 10, "rappahannock": 7, "shenandoah": 6, "rapidan": 6, "occoquan": 5, "bullrun": 4, "broadrun": 3, "hazel": 4}
    shimmer, rivers, potomac = [], {}, None
    for key, wid in WID.items():
        for x in NM.get(key, []):
            if x["osm_type"] != "relation" or x["category"] != "waterway": continue
            g = x["geojson"]; L = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
            for l in L:
                if len(l) < 3: continue
                pts = [P(la, lo, S) for lo, la in l]
                d.line(pts, fill=(96, 150, 190, 240), width=wid, joint="curve")
                pm = [[round(a / S, 1), round(b / S, 1)] for a, b in pts]
                if len(pm) > 6: shimmer.append(pm[::2] + [pm[-1]])
                rivers.setdefault(key, []).append(pm)
                if key == "potomac": potomac = [(la, lo) for lo, la in l]
            break
    # lower Rapidan (missing from the Nominatim relation): hand-traced from the DEM valley, Rapidan Station -> the confluence (38.40N 77.63W)
    RAPL = chaikin([(38.3108, -78.0959), (38.3150, -78.0500), (38.3350, -77.9900), (38.3650, -77.9300), (38.3700, -77.8600), (38.3550, -77.8000),
                    (38.3650, -77.7400), (38.3900, -77.6900), (38.4000, -77.6346)], 2)
    g = [P(la, lo, S) for la, lo in RAPL]; d.line(g, fill=(96, 150, 190, 240), width=6, joint="curve")
    shimmer.append([[round(a / S, 1), round(b / S, 1)] for a, b in g])
    def rail(line):
        g = [P(la, lo, S) for la, lo in line]
        d.line(g, fill=(16, 14, 10, 215), width=7, joint="curve"); d.line(g, fill=(206, 198, 180, 170), width=2)
        for a, b in zip(g[:-1], g[1:]):
            L = math.dist(a, b); ux, uy = (b[0] - a[0]) / (L or 1), (b[1] - a[1]) / (L or 1)
            for k in range(0, int(L), 20):
                x, y = a[0] + ux * k, a[1] + uy * k; d.line((x - uy * 6, y + ux * 6, x + uy * 6, y - ux * 6), fill=(16, 14, 10, 200), width=3)
    for r in (OARR, MGRR, RFP): rail(r)
    # big towns only (1862), small labels
    TOWNS = [("Washington", 38.8950, -77.0365, 1), ("Baltimore", 39.2904, -76.6122, 1), ("Alexandria", 38.8051, -77.0470, 2, "rm"),
             ("Fredericksburg", 38.3001, -77.4571, 2), ("Frederick", 39.4158, -77.4128, 2), ("Winchester", 39.1857, -78.1633, 2),
             ("Leesburg", 39.1155, -77.5646, 3), ("Warrenton", 38.7135, -77.7954, 3, "rm"), ("Culpeper", 38.4734, -77.9961, 3, "rm"),
             ("Front Royal", 38.9182, -78.1945, 3, "rm"), ("Gordonsville", 38.1374, -78.1878, 3), ("Annapolis", 38.9784, -76.4922, 3),
             ("Charlottesville", 38.0293, -78.4767, 3), ("Harpers Ferry", 39.3254, -77.7389, 3, "rm")]
    ft = {1: ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 34), 2: ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 28),
          3: ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 24)}
    fr = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 24)
    txt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(txt); halo = Image.new("RGBA", (W, H), (0, 0, 0, 0)); hd = ImageDraw.Draw(halo)
    for t in TOWNS:
        nm, la, lo, rank = t[:4]; anc = t[4] if len(t) > 4 else "lm"
        x, y = P(la, lo, S); r = {1: 8, 2: 6, 3: 5}[rank]
        if not (20 < x < W - 20 and 20 < y < H - 20): continue
        tx = x - r - 6 if anc == "rm" else x + r + 6
        td.ellipse((x - r, y - r, x + r, y + r), fill=(240, 236, 226, 235)); hd.ellipse((x - r - 2, y - r - 2, x + r + 2, y + r + 2), fill=(10, 14, 16, 170))
        hd.text((tx, y), nm.upper(), font=ft[rank], fill=(10, 14, 16, 220), anchor=anc); td.text((tx, y), nm.upper(), font=ft[rank], fill=(240, 236, 226, 240), anchor=anc)
    def rot_label(lab, cx, cy, ang, col, font):
        tw = int(td.textlength(lab, font=font)) + 40
        for layer, c in ((halo, (10, 14, 16, 210)), (txt, col)):
            t = Image.new("RGBA", (tw, 60), (0, 0, 0, 0)); ImageDraw.Draw(t).text((tw / 2, 30), lab, font=font, fill=c, anchor="mm")
            t = t.rotate(ang, resample=Image.BICUBIC, expand=True); layer.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
    def along(lab, key, lat, lon, off):
        pts = max(rivers[key], key=len); pts = [(a * S, b * S) for a, b in pts]; q = P(lat, lon, S)
        i = min(range(len(pts)), key=lambda k: math.dist(pts[k], q)); a, b = pts[max(0, i - 6)], pts[min(len(pts) - 1, i + 6)]
        ang = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
        if ang > 90: ang -= 180
        if ang < -90: ang += 180
        nx, ny = -math.sin(math.radians(ang)), math.cos(math.radians(ang))
        rot_label(lab, pts[i][0] + nx * off, pts[i][1] + ny * off, -ang, (150, 195, 230, 240), fr)
    along("P O T O M A C", "potomac", 38.60, -77.22, 30)
    along("R A P P A H A N N O C K", "rappahannock", 38.42, -77.62, -30)
    along("R A P I D A N", "rapidan", 38.30, -78.05, 28)
    mf = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 26)
    for lab, la, lo, ang in (("B U L L   R U N   M T S", 38.93, -77.66, 62), ("B L U E   R I D G E", 38.80, -78.13, 55)):
        x, y = P(la, lo, S); rot_label(lab, x, y, ang, (214, 200, 168, 215), mf)
    im.alpha_composite(halo.filter(ImageFilter.GaussianBlur(4))); im.alpha_composite(txt)
    im.save(f"assets/media/{BASE}_geo_ref.png", optimize=True)
    cum = [0.0]
    for a, b in zip(MARCH[:-1], MARCH[1:]): cum.append(cum[-1] + miles(a, b))
    r1 = lambda line: [[round(v, 1) for v in P(la, lo)] for la, lo in line]
    data = {"places": {k: [round(v, 1) for v in P(*q)] for k, q in PLACES.items()}, "rivers": shimmer,
            "oarr": r1(OARR), "mgrr": r1(MGRR), "rfp": r1(RFP), "march": r1(MARCH), "march_mi": [round(c, 1) for c in cum],
            "potomac": r1(potomac[::3]) if potomac else []}
    json.dump(data, open(f"assets/media/{BASE}_data.json", "w"), separators=(",", ":"))
    print("wrote", BASE, "march miles (straight legs)", round(cum[-1], 1), "salem at", round(cum[MARCH.index(PLACES['salem'])], 1), "rivers", {k: len(v) for k, v in rivers.items()})
