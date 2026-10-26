"""Flag-options sheet for the owner (Confederate flags need the owner's OK): option A period flags, option B text labels only."""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M = "assets/media/"; F = "tools/oswald-latin-700-normal.ttf"
meta = json.load(open("assets/virginia_hd_ref.json")); ox, oy = meta["origin_world_px"]
base = Image.open("assets/virginia_hd_ref.jpg").convert("RGB").resize((2880, 1620))
def px(lat, lon, z=9):
    n = 256 * 2 ** z
    return (lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy
def font(s): return ImageFont.truetype(F, s)
TOWNS = {"WASHINGTON": (38.895, -77.036), "RICHMOND": (37.54, -77.436), "WINCHESTER": (39.186, -78.163),
         "MANASSAS JCT.": (38.751, -77.475), "FREDERICKSBURG": (38.303, -77.46), "HARRISONBURG": (38.449, -78.869)}
def panel(kind, flags):
    im = base.copy(); d = ImageDraw.Draw(im, "RGBA")
    for name, (la, lo) in TOWNS.items():
        x, y = px(la, lo); d.ellipse((x-9, y-9, x+9, y+9), fill=(247, 243, 234)); d.text((x+16, y-22), name, font=font(34), fill=(247, 243, 234))
    def put_flag(path, la, lo, label):
        x, y = px(la, lo); fl = Image.open(M + path).convert("RGBA"); w = 230; fl = fl.resize((w, int(fl.height * w / fl.width)))
        sh = Image.new("RGBA", (fl.width + 40, fl.height + 40), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((20, 20, 20 + fl.width, 20 + fl.height), fill=(0, 0, 0, 150))
        im.paste(sh.filter(ImageFilter.GaussianBlur(10)), (int(x - w/2 - 14), int(y - 6)), sh.filter(ImageFilter.GaussianBlur(10)))
        im.paste(fl, (int(x - w/2), int(y)), fl); d.rectangle((x - w/2, y, x + w/2, y + fl.height), outline=(247, 243, 234), width=3)
        tw = d.textlength(label, font=font(40)); d.text((x - tw/2, y + fl.height + 8), label, font=font(40), fill=(247, 243, 234))
    def put_chip(col, la, lo, label):
        x, y = px(la, lo); tw = d.textlength(label, font=font(58)); d.rounded_rectangle((x - tw/2 - 70, y, x + tw/2 + 24, y + 86), 12, fill=(15, 18, 22, 210))
        d.rounded_rectangle((x - tw/2 - 52, y + 22, x - tw/2 - 10, y + 64), 6, fill=col); d.text((x - tw/2 + 6, y + 8), label, font=font(58), fill=(247, 243, 234))
    if kind == "A":
        put_flag("us34_flag.png", 39.35, -77.35, "UNITED STATES"); put_flag(flags, 37.95, -78.75, "CONFEDERATE STATES")
    else:
        put_chip((196, 18, 31), 39.35, -77.35, "UNION"); put_chip((31, 79, 196), 37.95, -78.75, "CONFEDERATE")
    # legend top-centre (locked: legend card top-centre)
    lg = "CONFEDERATE" ; d.rounded_rectangle((1040, 40, 1840, 130), 14, fill=(15, 18, 22, 210))
    d.rectangle((1080, 68, 1120, 102), fill=(31, 79, 196)); d.text((1135, 58), "CONFEDERATE", font=font(44), fill=(247, 243, 234))
    d.rectangle((1480, 68, 1520, 102), fill=(196, 18, 31)); d.text((1535, 58), "UNION", font=font(44), fill=(247, 243, 234))
    return im.resize((1440, 810))
opts = [("A1", "csa1_13_flag.png", "OPTION A1: period national flags, 1862 = US 34 stars + Confederate First National ('Stars and Bars')"),
        ("A2", "csa2_flag.png", "OPTION A2: period national flags, May 1863 = US 34 stars + Second National (adopted 1 May 1863)"),
        ("B", None, "OPTION B: no Confederate flag at all = text labels CONFEDERATE / UNION + plain colour chips")]
sheet = Image.new("RGB", (2900, 1700), (20, 22, 26)); d = ImageDraw.Draw(sheet)
d.text((30, 18), "STONEWALL JACKSON #11: FLAG OPTIONS (owner to pick; the battle flag is never used)", font=font(46), fill=(247, 243, 234))
pos = [(10, 90), (1450, 90), (10, 880)]
for (k, fl, cap), (x, y) in zip(opts, pos):
    sheet.paste(panel("A" if k != "B" else "B", fl), (x, y)); d.rectangle((x, y + 740, x + 1440, y + 810), fill=(0, 0, 0)); d.text((x + 16, y + 750), cap, font=font(30), fill=(201, 180, 138))
d.text((1470, 900), "Notes", font=font(44), fill=(201, 180, 138))
notes = ["- Blue = Jackson / Confederate (the format's hero side); red = Union (channel convention only).",
         "- A1 for every 1862 map (Valley, Second Manassas).",
         "- Chancellorsville (2 May 1863): the Second National was adopted",
         "  by the Confederate Congress on 1 May 1863, so it was not yet in",
         "  the field; A1 (First National) is the accurate choice there too.",
         "  A2 shown only so you can see it.",
         "- Option A = what every past video did (period national flags).",
         "- Option B = safest for YouTube / advertisers; flags of neither side,",
         "  so the US flag is dropped too (both sides treated the same).",
         "- Unit counters: same choice for their small flag chips",
         "  (A = flag chips, B = plain blue / red chips)."]
for i, t in enumerate(notes): d.text((1470, 960 + i * 50), t, font=font(32), fill=(247, 243, 234))
sheet.save("build/flag-options.jpg", quality=88); print("ok")
