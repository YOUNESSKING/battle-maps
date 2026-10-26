"""Flag-options sheet for the owner (Meade #12): which Confederate NATIONAL flag on the Gettysburg maps (July 1863).
Never the battle flag. run from meade/: python3 tools/make_flag_options.py -> build/flag-options.jpg"""
import json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M = "assets/media/"; F = "tools/oswald-latin-700-normal.ttf"
meta = json.load(open("assets/virginia_hd_ref.json")); ox, oy = meta["origin_world_px"]
base = Image.open("assets/virginia_hd_ref.jpg").convert("RGB").resize((2880, 1620))
BLUE, RED, TXT, GOLD = (31, 79, 196), (196, 18, 31), (247, 243, 234), (201, 180, 138)
def px(lat, lon, z=9):
    n = 256 * 2 ** z
    return (lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy
def font(s): return ImageFont.truetype(F, s)
TOWNS = {"GETTYSBURG": (39.83, -77.23), "FREDERICK": (39.414, -77.41), "WASHINGTON": (38.895, -77.036),
         "FREDERICKSBURG": (38.303, -77.46), "RICHMOND": (37.54, -77.436), "WINCHESTER": (39.186, -78.163)}
def panel(csa, ring):
    im = base.copy(); d = ImageDraw.Draw(im, "RGBA")
    for name, (la, lo) in TOWNS.items():
        x, y = px(la, lo); d.ellipse((x-9, y-9, x+9, y+9), fill=TXT); d.text((x+16, y-22), name, font=font(34), fill=TXT)
    x, y = px(*TOWNS[ring]); d.ellipse((x-60, y-60, x+60, y+60), outline=GOLD, width=6)
    def put_flag(path, la, lo, label):
        x, y = px(la, lo); fl = Image.open(M + path).convert("RGBA"); w = 230; fl = fl.resize((w, int(fl.height * w / fl.width)))
        sh = Image.new("RGBA", (fl.width + 40, fl.height + 40), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((20, 20, 20 + fl.width, 20 + fl.height), fill=(0, 0, 0, 150))
        b = sh.filter(ImageFilter.GaussianBlur(10)); im.paste(b, (int(x - w/2 - 14), int(y - 6)), b)
        im.paste(fl, (int(x - w/2), int(y)), fl); d.rectangle((x - w/2, y, x + w/2, y + fl.height), outline=TXT, width=3)
        tw = d.textlength(label, font=font(40)); d.text((x - tw/2, y + fl.height + 8), label, font=font(40), fill=TXT)
    put_flag("us34_flag.png", 39.55, -76.55, "UNITED STATES"); put_flag(csa, 38.0, -78.75, "CONFEDERATE STATES")
    d.rounded_rectangle((140, 40, 940, 130), 14, fill=(15, 18, 22, 210))  # legend (top-centre in the video; top-left here so Gettysburg shows)
    d.rectangle((180, 68, 220, 102), fill=BLUE); d.text((235, 58), "UNION", font=font(44), fill=TXT)
    d.rectangle((500, 68, 540, 102), fill=RED); d.text((555, 58), "CONFEDERATE", font=font(44), fill=TXT)
    return im.resize((1440, 810))
opts = [("csa1_13_flag.png", "FREDERICKSBURG", "MOVE 1, DEC 1862 (both options): US 34 stars + Confederate First National, 13 stars (= Jackson A1)"),
        ("csa1_13_flag.png", "GETTYSBURG", "OPTION A1 for GETTYSBURG, JULY 1863: keep the First National (same as Jackson #11)"),
        ("csa2_flag.png", "GETTYSBURG", "OPTION A2 for GETTYSBURG, JULY 1863: Second National (adopted 1 May 1863)")]
sheet = Image.new("RGB", (2900, 1700), (20, 22, 26)); d = ImageDraw.Draw(sheet)
d.text((30, 18), "GEORGE MEADE #12: CONFEDERATE FLAG FOR GETTYSBURG? (owner to pick; the battle flag is never used on its own)", font=font(44), fill=TXT)
pos = [(10, 90), (1450, 90), (10, 880)]
for (fl, ring, cap), (x, y) in zip(opts, pos):
    sheet.paste(panel(fl, ring), (x, y)); d.rectangle((x, y + 740, x + 1440, y + 810), fill=(0, 0, 0)); d.text((x + 16, y + 750), cap, font=font(29), fill=GOLD)
d.text((1470, 900), "Notes", font=font(44), fill=GOLD)
notes = ["- Blue = Meade / Union (the format's hero side); red = Confederates.",
         "- US flag: 34 stars is right for both battles (the 35th star,",
         "  West Virginia, became official on 4 July 1863, after the battle).",
         "- Second National ('Stainless Banner'): adopted 1 May 1863, so it",
         "  was the official national flag at Gettysburg (A2 = most exact).",
         "  BUT its top-left corner IS the battle-flag cross (red, blue",
         "  St Andrew's cross, white stars). A1 avoids that entirely.",
         "- A1 = First National everywhere: no battle-flag design anywhere,",
         "  same flags as Jackson #11; slightly out of date for July 1863.",
         "- Unit counters' small flag chips follow the same choice.",
         "- Archive prints: every one will be checked; none showing the battle flag."]
for i, t in enumerate(notes): d.text((1470, 960 + i * 50), t, font=font(31), fill=TXT)
sheet.save("build/flag-options.jpg", quality=88); print("ok")
