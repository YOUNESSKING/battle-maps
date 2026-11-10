"""farms/preview.jpg: the farm sprites composited on a crop of grant/assets/vicksburg_w.jpg (+ the 2e overlays: painted
Champion Hill, lanes, texture, rivers, roads approximated from roads_px.json, the Edwards + Raymond town sprites) at
screen scale (1.9 screen px per map px), with a 3x zoom panel. Usage: python3 make_preview.py [farms.json]"""
import json, math, os, sys
sys.dont_write_bytecode = True   # never leave caches in the shared roads_towns folders
import numpy as np
from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
RT = "/home/user/battle-maps/research/style_tests/roads_towns"
RTA = "/home/user/battle-maps/grant/scenes/s12d_rt/assets/rt"
sys.path.insert(0, RT)
from road_fix import fixed_roads  # noqa

S = 1.9                                   # screen px per map px
X0, Y0, X1, Y1 = 1545, 650, 1775, 800     # crop in map px
TOWNS = {"edwards": dict(left=1566.11, top=683.11, w=66.32, h=59.74),
         "raymond": dict(left=1668.63, top=719.0, w=92.63, h=77.37)}


def over(dst, src, x, y):
    """alpha-over an RGBA PIL image onto float RGB array dst at (x, y) (top-left, may be fractional -> rounded)"""
    a = np.asarray(src).astype(float)
    x, y = int(round(x)), int(round(y))
    h, w = a.shape[:2]
    sx0, sy0 = max(0, -x), max(0, -y)
    dx0, dy0 = max(0, x), max(0, y)
    dx1, dy1 = min(dst.shape[1], x + w), min(dst.shape[0], y + h)
    if dx1 <= dx0 or dy1 <= dy0:
        return
    s = a[sy0:sy0 + dy1 - dy0, sx0:sx0 + dx1 - dx0]
    al = s[..., 3:4] / 255
    dst[dy0:dy1, dx0:dx1] = dst[dy0:dy1, dx0:dx1] * (1 - al) + s[..., :3] * al


def build(farms, labels=False):
    # work at basemap resolution (2 image px per map px), then resample to screen scale
    bx0, by0, bx1, by1 = X0 * 2, Y0 * 2, X1 * 2, Y1 * 2
    img = np.asarray(Image.open("/home/user/battle-maps/grant/assets/vicksburg_w.jpg").convert("RGB").crop((bx0, by0, bx1, by1))).astype(float)
    for f in (f"{RTA}/hill_champion_hill.png", f"{RTA}/lanes_w_1794345544.png", f"{RTA}/texture_w_1794345544.png", f"{RTA}/rivers_w_1794345544.png"):
        if os.path.exists(f):
            over(img, Image.open(f).convert("RGBA").crop((bx0, by0, bx1, by1)), 0, 0)
    # farms (under the roads, like the towns)
    for fm in farms:
        if fm.get("left") is None:
            continue
        im = Image.open(os.path.join(HERE, fm["png"])).convert("RGBA")
        k = 2.0 * fm["map_px_per_img_px"]
        im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        over(img, im, (fm["left"] - X0) * 2, (fm["top"] - Y0) * 2)
    # towns
    for k_, T in TOWNS.items():
        im = Image.open(f"{RTA}/town_{k_}.png").convert("RGBA").resize((round(T["w"] * 2), round(T["h"] * 2)), Image.LANCZOS)
        over(img, im, (T["left"] - X0) * 2, (T["top"] - Y0) * 2)
    # roads: hand-pressed double ruts (approximation of the scene's SVG)
    SS = 4
    W, H = img.shape[1], img.shape[0]
    lay = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    u = 2 / S   # basemap px per screen px
    for col, wd, al, off in [((169, 156, 106), 5.5, .15, 0), ((74, 69, 34), 3.4, .17, 0)]:
        L = Image.new("RGBA", lay.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        for r in fixed_roads():
            P = [((x - X0) * 2 * SS, (y - Y0) * 2 * SS) for x, y in r["pts"]]
            d.line(P, fill=col + (int(255 * al),), width=max(1, round(wd * u * SS)), joint="curve")
        lay = Image.alpha_composite(lay, L)
    for col, wd, al, sh in [((36, 34, 12), 1.25, .86, -0.4), ((221, 211, 160), .85, .31, .65), ((70, 64, 30), .9, .7, 0)]:
        L = Image.new("RGBA", lay.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        for r in fixed_roads():
            P = r["pts"]
            for side in (-1, 1):
                Q = []
                for i, (x, y) in enumerate(P):
                    a, b = P[max(0, i - 1)], P[min(len(P) - 1, i + 1)]
                    tx, ty = b[0] - a[0], b[1] - a[1]; n = math.hypot(tx, ty) + 1e-9
                    o = side * 1.0 / S
                    Q.append((((x - ty / n * o) - X0 + sh / S) * 2 * SS, ((y + tx / n * o) - Y0 + sh / S) * 2 * SS))
                d.line(Q, fill=col + (int(255 * al),), width=max(1, round(wd * u * SS)), joint="curve")
        lay = Image.alpha_composite(lay, L)
    lay = lay.resize((W, H), Image.LANCZOS)
    over(img, lay, 0, 0)
    if labels:   # farm names as on their spoken word (2e item 2 look, towns/label.py)
        for fm in farms:
            L = fm.get("label_png")
            if not L or fm.get("left") is None:
                continue
            im = Image.open(os.path.join(HERE, L["png"])).convert("RGBA")
            k = 2.0 * fm["map_px_per_img_px"]
            im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
            mpu = 2.0 * fm["map_px_per_img_px"] / 2.0 * 2.0   # map px per u (= 1 / S)
            over(img, im, (fm["c"][0] - L["ax"] * mpu - X0) * 2, (fm["c"][1] - L["ay"] * mpu - Y0) * 2)
    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    screen = base.resize((round((X1 - X0) * S), round((Y1 - Y0) * S)), Image.LANCZOS)
    return screen


def sheet(farms, out):
    scr = build(farms)
    z = 3
    zoom = scr.resize((scr.width * z, scr.height * z), Image.LANCZOS)
    pad = 24
    # extra: the four sprites alone, on a grass swatch, at screen size x3
    W = zoom.width + 2 * pad
    sprites = []
    for fm in farms:
        im = Image.open(os.path.join(HERE, fm["png"])).convert("RGBA")
        sc = z / 2.0   # sprite is ppu 2 image px per screen px -> x3 zoom
        sprites.append((fm["name"], im.resize((round(im.width * sc), round(im.height * sc)), Image.LANCZOS)))
    sh_h = max(s.height for _, s in sprites) + 40
    Ht = pad + 30 + scr.height + pad + 30 + zoom.height + pad + 30 + zoom.height // 2 + pad + 30 + sh_h + pad
    out_im = Image.new("RGB", (W, Ht), (28, 26, 22))
    d = ImageDraw.Draw(out_im)
    try:
        ft = ImageFont.truetype(f"{RT}/towns/fonts/eb-garamond-latin-600-normal.ttf", 22)
    except Exception:
        ft = None
    y = pad
    d.text((pad, y), "1) screen scale (s = 1.9 screen px per map px): Edwards, Champion Hill, Coker house, Raymond", fill=(230, 220, 190), font=ft); y += 30
    out_im.paste(scr, (pad, y)); y += scr.height + pad
    d.text((pad, y), "2) same view, 3x zoom", fill=(230, 220, 190), font=ft); y += 30
    out_im.paste(zoom, (pad, y)); y += zoom.height + pad
    lab = build(farms, labels=True).resize((zoom.width // 2, zoom.height // 2), Image.LANCZOS)
    d.text((pad, y), "3) 1.5x zoom with the farm names (label hook, shown only on their spoken word)", fill=(230, 220, 190), font=ft); y += 30
    out_im.paste(lab, (pad, y)); y += lab.height + pad
    d.text((pad, y), "4) sprites alone on the map green (3x screen size)", fill=(230, 220, 190), font=ft); y += 30
    x = pad
    grass = (106, 110, 60)
    for nm, s in sprites:
        bg = Image.new("RGBA", (s.width + 20, s.height + 20), grass + (255,))
        bg.alpha_composite(s, (10, 10))
        if x + bg.width > W:
            break
        out_im.paste(bg.convert("RGB"), (x, y)); d.text((x + 6, y + bg.height + 2), nm, fill=(230, 220, 190), font=ft)
        x += bg.width + pad
    out_im.save(out, quality=92)
    print("wrote", out, out_im.size)


if __name__ == "__main__":
    mp = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "farms.json")
    meta = json.load(open(mp))
    farms = [dict(name=k, **v) for k, v in meta["farms"].items() if v.get("left") is not None]
    if "--bare" in sys.argv:
        farms = []
    if not farms:
        build([]).save(os.path.join(HERE, "_bare.jpg"), quality=92)
    else:
        sheet([dict(name=k, **v) for k, v in meta["farms"].items()], os.path.join(HERE, "preview.jpg"))
