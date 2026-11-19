"""Vicksburg v3 thumbnail sheet (2026-11-19): ours next to the approved Marion references at the same sizes
(full 1280x720, 360x202, 168x94 + 168x94 shown 2x), the published Grant 'THE BACK DOOR' beside the MAIN, and the v2 'before' strip.
No Grand Maneuver (other channel) pixels: only our own thumbnails.
Also thumb/sidebar_v3.jpg: the v2 YouTube "Up next" sidebar mock (same neighbours, i.ytimg.com images) with the v3 MAIN.
usage (from vicksburg/): python3 tools/make_thumb_v3_sheet.py   -> youtube/thumb/sheet_v3.jpg + sidebar_v3.jpg"""
from PIL import Image, ImageDraw, ImageFont
T = "youtube/thumb/"; RT = "/home/user/battle-maps/"
OS = RT + "marion/tools/oswald-latin-700-normal.ttf"
F = ImageFont.truetype(OS, 34); Fs = ImageFont.truetype(OS, 24); Ft = ImageFont.truetype(OS, 18)
ROWS = [("MAIN  (Back Door recipe)", [("OURS v3 MAIN  CUT LOOSE.", T + "vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg"),
                                      ("APPROVED Marion MAIN  HE RAN.", RT + "marion/youtube/thumb/marion-BD-HE_RAN.jpg"),
                                      ("PUBLISHED Grant  THE BACK DOOR", RT + "grant/youtube/grant-thumb-PUBLISHED_THE_BACK_DOOR.jpg")]),
        ("ALT  (Grand Maneuver recipe, Test & Compare)", [("OURS v3 ALT  CUT LOOSE. / THEN VICKSBURG FELL", T + "vicksburg-v3-ALT-GM-CUT_LOOSE.jpg"),
                                      ("APPROVED Marion ALT  HE RAN.", RT + "marion/youtube/thumb/marion-V10-gm-HE_RAN.jpg")]),
        ("OPTIONAL 3rd  (Back Door, number word)", [("OURS v3 OPT3  5 BATTLES.", T + "vicksburg-v3-OPT3-BD-5_BATTLES.jpg"),
                                      ("APPROVED Marion MAIN  HE RAN.", RT + "marion/youtube/thumb/marion-BD-HE_RAN.jpg")])]
FULLW, GAP = 1280, 40; SW = 3 * FULLW + 4 * GAP
blk = 50 + 720 + 40 + 230 + 30
s = Image.new("RGB", (SW, 70 + blk * len(ROWS) + 330), (22, 21, 20)); d = ImageDraw.Draw(s)
d.text((GAP, 16), "VICKSBURG 1863  -  thumbnails v3 (2026-11-19)  -  ours vs the approved Marion references at the same sizes: full, 360x202, 168x94 (+2x)", font=F, fill=(240, 230, 210))
y = 70
for title, items in ROWS:
    d.text((GAP, y), title, font=F, fill=(255, 200, 120)); y0 = y + 50
    for i, (lab, f) in enumerate(items):
        x = GAP + i * (FULLW + GAP); im = Image.open(f).convert("RGB").resize((1280, 720), Image.LANCZOS)
        s.paste(im, (x, y0)); d.text((x, y0 + 726), lab, font=Fs, fill=(232, 220, 196))
        yy = y0 + 770; s.paste(im.resize((360, 202), Image.LANCZOS), (x, yy)); sm = im.resize((168, 94), Image.LANCZOS)
        s.paste(sm, (x + 380, yy)); s.paste(sm.resize((336, 188), Image.NEAREST), (x + 568, yy)); d.text((x + 380, yy + 100), "168x94", font=Ft, fill=(150, 140, 120))
        d.text((x + 568, yy + 192), "168x94 shown 2x", font=Ft, fill=(150, 140, 120))
    y += blk
# before -> after strip at 360 px
d.text((GAP, y), "Before (v2, critics 5/10)  ->  after (v3)  at 360x202", font=F, fill=(255, 200, 120)); y += 50
pairs = [T + "vicksburg-v2-MAIN-BD-CUT_LOOSE.jpg", T + "vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg", T + "vicksburg-v2-ALT-GM-CUT_LOOSE.jpg", T + "vicksburg-v3-ALT-GM-CUT_LOOSE.jpg",
         T + "vicksburg-v2-OPT3-BD-5_BATTLES.jpg", T + "vicksburg-v3-OPT3-BD-5_BATTLES.jpg"]
for i, f in enumerate(pairs):
    x = GAP + i * 400 + (i // 2) * 120; s.paste(Image.open(f).convert("RGB").resize((360, 202), Image.LANCZOS), (x, y))
    d.text((x, y + 208), ("v2 " if i % 2 == 0 else "v3 ") + ["MAIN", "MAIN", "ALT", "ALT", "OPT3", "OPT3"][i], font=Fs, fill=(200, 190, 170))
s = s.crop((0, 0, SW, y + 250)); s.save(T + "sheet_v3.jpg", quality=88); print(T + "sheet_v3.jpg", s.size)
R = T + "work_v2/refs/"; SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"; SANSB = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
# ---------------- sidebar mock (YouTube dark theme, 'Up next' column, 2x scale) ----------------
SB = [("OURS", T + "vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg", "The Campaign That Split the Confederacy: 5 Battles in 18 Days | Vicksburg 1863", "Our channel", "new", "18:46"),
      ("qnq-df4MQzI", R + "qnq-df4MQzI.jpg", "Grant: Massive Siege of Vicksburg Leads to Union Victory | History", "HISTORY", "2.3M views", "10:46"),
      ("1eSgimZ8GKQ", R + "1eSgimZ8GKQ.jpg", "Vicksburg: Animated Battle Map", "American Battlefield Trust", "1.5M views", "20:32"),
      ("_VyV1CklHZs", R + "_VyV1CklHZs.jpg", "The Massive Siege of Vicksburg That Secured a Union Victory | Grant | Biography", "Biography", "387K views", "10:46"),
      ("OktdqgBKD9E", R + "OktdqgBKD9E.jpg", "Vicksburg Campaign: The Civil War in Four Minutes", "American Battlefield Trust", "217K views", "4:59"),
      ("ltx7u5vApWc", R + "ltx7u5vApWc.jpg", "Grant's Masterpiece: The Vicksburg Campaign 1862-63 (All Parts)", "Warhawk", "160K views", "2:45:56"),
      ("Gcb2a9skJH4", R + "Gcb2a9skJH4.jpg", "Taking Down The Citadel: The Siege of Vicksburg (1863)", "Threads from the National Tapestry", "87K views", "57:52")]
order = [1, 2, 0, 3, 4, 5, 6]                       # ours sits third, between the two biggest
K = 2; tw, th = 168 * K, 94 * K; rowh = th + 16 * K; Wd = 402 * K
sb = Image.new("RGB", (Wd, 30 * K + rowh * len(order)), (15, 15, 15)); d = ImageDraw.Draw(sb)
ft = ImageFont.truetype(SANSB, 14 * K); fm = ImageFont.truetype(SANS, 12 * K); fd = ImageFont.truetype(SANSB, 11 * K)
d.text((8 * K, 6 * K), "Up next  -  mock: our MAIN among the top 'Vicksburg campaign' results (168x94, shown 2x)", font=ImageFont.truetype(SANS, 9 * K), fill=(170, 170, 170))
def wrap(t, f, w):
    out, line = [], ""
    for wd in t.split():
        if d.textlength((line + " " + wd).strip(), font=f) <= w: line = (line + " " + wd).strip()
        else: out.append(line); line = wd
    out.append(line); return out[:2]
for r, i in enumerate(order):
    key, f, title, ch, views, dur = SB[i]; y = 30 * K + r * rowh; x = 8 * K
    im = Image.open(f).convert("RGB")
    if im.size != (1280, 720):
        w_, h_ = im.size; nh = int(w_ * 9 / 16); im = im.crop((0, (h_ - nh) // 2, w_, (h_ - nh) // 2 + nh))
    t = im.resize((168, 94), Image.LANCZOS).resize((tw, th), Image.LANCZOS)
    m = Image.new("L", (tw, th), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, tw - 1, th - 1], 8 * K, fill=255); sb.paste(t, (x, y), m)
    dw = d.textlength(dur, font=fd); d.rounded_rectangle([x + tw - dw - 10 * K, y + th - 18 * K, x + tw - 4 * K, y + th - 4 * K], 3 * K, fill=(0, 0, 0)); d.text((x + tw - dw - 7 * K, y + th - 17 * K), dur, font=fd, fill=(255, 255, 255))
    tx = x + tw + 8 * K
    for j, l in enumerate(wrap(title, ft, Wd - tx - 8 * K)): d.text((tx, y + j * 19 * K), l, font=ft, fill=(241, 241, 241))
    d.text((tx, y + 42 * K), ch, font=fm, fill=(170, 170, 170)); d.text((tx, y + 58 * K), views, font=fm, fill=(170, 170, 170))
    if key == "OURS": d.rectangle([2 * K, y - 4 * K, 5 * K, y + th + 4 * K], fill=(230, 40, 40))
sb.save(T + "sidebar_v3.jpg", quality=92); print(T + "sidebar_v3.jpg", sb.size)
