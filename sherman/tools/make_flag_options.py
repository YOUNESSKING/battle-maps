"""Flag-options sheet for the owner (Sherman #13, 1864-65). Never the battle flag on its own.
run from sherman/: python3 tools/make_flag_options.py -> build/flag-options.jpg"""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M = "assets/media/"; F = "tools/oswald-latin-700-normal.ttf"
meta = json.load(open("assets/south_hd_ref.json")); ox, oy = meta["origin_world_px"]; Z = meta["zoom"]
base = Image.open("assets/south_hd_ref.jpg").convert("RGB").resize((2880, 1620))
BLUE, RED, TXT, GOLD = (31, 79, 196), (196, 18, 31), (247, 243, 234), (201, 180, 138)
def px(lat, lon):
    n = 256 * 2 ** Z
    return (lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy
def font(s): return ImageFont.truetype(F, s)
TOWNS = {"CHATTANOOGA": (35.046, -85.31), "ATLANTA": (33.749, -84.388), "SAVANNAH": (32.081, -81.091),
         "COLUMBIA": (34.0, -81.035), "CHARLESTON": (32.776, -79.931), "RALEIGH": (35.78, -78.64), "RICHMOND": (37.54, -77.436),
         "BENTONVILLE": (35.305, -78.324), "MACON": (32.84, -83.63), "AUGUSTA": (33.47, -81.97)}
def panel(us, csa, ring, label=None):
    im = base.copy(); d = ImageDraw.Draw(im, "RGBA")
    for name, (la, lo) in TOWNS.items():
        x, y = px(la, lo); d.ellipse((x-9, y-9, x+9, y+9), fill=TXT); d.text((x+16, y-22), name, font=font(34), fill=TXT)
    x, y = px(*TOWNS[ring]); d.ellipse((x-60, y-60, x+60, y+60), outline=GOLD, width=6)
    def put_flag(path, la, lo, name):
        x, y = px(la, lo); w = 230
        if path:
            fl = Image.open(M + path).convert("RGBA"); fl = fl.resize((w, int(fl.height * w / fl.width)))
            sh = Image.new("RGBA", (fl.width + 40, fl.height + 40), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((20, 20, 20 + fl.width, 20 + fl.height), fill=(0, 0, 0, 150))
            b = sh.filter(ImageFilter.GaussianBlur(10)); im.paste(b, (int(x - w/2 - 14), int(y - 6)), b)
            im.paste(fl, (int(x - w/2), int(y)), fl); d.rectangle((x - w/2, y, x + w/2, y + fl.height), outline=TXT, width=3); hh = fl.height + 8
        else: hh = 0
        f = font(40 if path else 58); tw = d.textlength(name, font=f); d.text((x - tw/2, y + hh), name, font=f, fill=TXT)
    put_flag(us, 36.9, -83.6, "UNITED STATES"); put_flag(csa, 32.6, -86.4, "CONFEDERATE STATES")
    d.rounded_rectangle((1040, 40, 1840, 130), 14, fill=(15, 18, 22, 210))
    d.rectangle((1080, 68, 1120, 102), fill=BLUE); d.text((1135, 58), "UNION", font=font(44), fill=TXT)
    d.rectangle((1400, 68, 1440, 102), fill=RED); d.text((1455, 58), "CONFEDERATE", font=font(44), fill=TXT)
    return im.resize((1440, 810))
opts = [("us35_flag.png", "csa1_13_flag.png", "ATLANTA", "A1: US 35 stars + Confederate FIRST National everywhere (as Jackson #11 / Meade #12)"),
        ("us35_flag.png", "csa2_flag.png", "ATLANTA", "A2, 1864 maps (moves 1-2): US 35 stars + SECOND National (official May 1863 - Mar 1865)"),
        ("us35_flag.png", "csa3_flag.png", "BENTONVILLE", "A2, from 4 MARCH 1865 (Bentonville, Bennett Place): US 35 + THIRD National"),
        (None, None, "ATLANTA", "B: no flags on the maps, text labels only (UNITED STATES / CONFEDERATE STATES)")]
sheet = Image.new("RGB", (2900, 2380), (20, 22, 26)); d = ImageDraw.Draw(sheet)
d.text((30, 18), "WILLIAM T. SHERMAN #13: WHICH FLAGS ON THE MAPS? (owner to pick; the battle flag is never used on its own)", font=font(44), fill=TXT)
pos = [(10, 90), (1450, 90), (10, 920), (1450, 920)]
for (us, cs, ring, cap), (x, y) in zip(opts, pos):
    sheet.paste(panel(us, cs, ring), (x, y)); d.rectangle((x, y + 750, x + 1440, y + 815), fill=(0, 0, 0)); d.text((x + 16, y + 758), cap, font=font(29), fill=GOLD)
d.text((30, 1760), "Notes", font=font(44), fill=GOLD)
notes = ["- Blue = Sherman / Union (the format's hero side); red = Confederates. Unit counters' small flag chips follow the same choice.",
         "- US flag: 35 stars is right for the WHOLE video (35th star = West Virginia, official 4 July 1863; the 36th came only on 4 July 1865,",
         "  after Bennett Place). Meade/Jackson used 34 stars because their battles were before July 1863. Star layout was not fixed by law: 5 rows of 7.",
         "- Confederate national flag in 1864-65 = the SECOND National ('Stainless Banner', 1 May 1863) and, from 4 March 1865, the THIRD National",
         "  (red bar at the fly). Both are the period-correct flags (A2), BUT the top-left corner of both IS the battle-flag cross.",
         "- A1 (First National everywhere) avoids any battle-flag design, same as the last two videos; it is out of date for 1864-65 (replaced May 1863).",
         "- B (text only) avoids the question entirely, but breaks the locked rule 'period nation flags on every map' (STYLE_LOCK 2).",
         "- The 35-star flag and the Third National here were drawn by us from the public-domain designs (Wikimedia was rate-limiting this machine).",
         "- Archive prints / AI thumbnail: every one will be checked; none showing the battle flag (cropped, skipped or painted out)."]
for i, t in enumerate(notes): d.text((30, 1830 + i * 52), t, font=font(31), fill=TXT)
sheet.save("build/flag-options.jpg", quality=86); print("ok")
