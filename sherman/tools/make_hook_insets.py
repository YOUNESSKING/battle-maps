"""Snap-cut inset images for hook-b (Sherman #13, hook agent; the Meade #12 technique). hook-4 is one scene on `south_hd_ref`; each
snap cut shows a 1920x1080 crop of a closer basemap (dark HD relief) placed as an image in the south world at its true place, so the
camera cuts in and pulls back out to the theatre. Rivers (Natural Earth 10m, assets/src/south_ne_rivers.json) are drawn on the crops.
-> assets/media/hook_inset_<name>.jpg (1920x1080) + assets/media/hook_insets.json {name: {z, ox, oy, x0, y0, w, h}}: crop origin
   (x0, y0) and size (w, h) in the SOURCE map px; in the scene: world = X + (srcpx - x0) * (W_world / w).
usage (from sherman/): python3 tools/make_hook_insets.py"""
import json, math
from PIL import Image, ImageDraw

def proj(J):
    Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P

RIV = json.load(open("assets/src/south_ne_rivers.json"))
STRONG = {"Chattahoochee", "Savannah", "Ogeechee", "Oconee", "Ocmulgee", "Altamaha", "Edisto", "Combahee", "Salkehatchie", "Congaree",
          "North Fork Edisto", "S.  Fk.  Edisto", "Broad", "Saluda", "Flint", "Etowah"}

def inset(name, base, center, wpx):
    J = json.load(open(f"assets/{base}.json")); P = proj(J)
    cx, cy = P(*center); hpx = wpx * 9 / 16
    x0, y0 = cx - wpx / 2, cy - hpx / 2
    im = Image.open(f"assets/{base}_hd_ref.jpg").convert("RGB")
    crop = im.crop((round(x0 * 2), round(y0 * 2), round((x0 + wpx) * 2), round((y0 + hpx) * 2))).resize((1920, 1080), Image.LANCZOS)
    k = 1920 / wpx; d = ImageDraw.Draw(crop, "RGBA")
    for r in RIV:
        nm = r["name"] or ""
        if not ((r["scalerank"] or 12) <= 8 or nm in STRONG): continue
        q = [((P(la, lo)[0] - x0) * k, (P(la, lo)[1] - y0) * k) for lo, la in r["pts"]]
        d.line(q, fill=(96, 150, 190, 220), width=6 if nm in STRONG else 4, joint="curve")
    crop.save(f"assets/media/hook_inset_{name}.jpg", quality=90)
    return {"z": J["zoom"], "ox": J["origin_world_px"][0], "oy": J["origin_world_px"][1], "x0": round(x0, 2), "y0": round(y0, 2), "w": wpx, "h": round(hpx, 2)}

if __name__ == "__main__":
    M = {}
    M["atl"] = inset("atl", "atlanta", (33.64, -84.42), 1400)        # Atlanta, the swing round the west side, Jonesboro
    M["ga"] = inset("ga", "georgia", (32.92, -82.70), 1620)           # Atlanta - Macon - Milledgeville - Augusta - Savannah
    M["sc"] = inset("sc", "carolinas", (33.15, -80.95), 640)          # Salkehatchie / Combahee / Edisto swamps
    json.dump(M, open("assets/media/hook_insets.json", "w"), indent=1)
    print(json.dumps(M))
