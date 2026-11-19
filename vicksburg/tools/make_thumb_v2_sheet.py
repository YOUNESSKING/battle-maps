"""Vicksburg v2 thumbnail sheets (2026-11-19).
thumb/sheet_v2.jpg  : every variant full size + 360 px and 168x94 feed strips + comparison row (3 real Tactical Genius thumbnails,
                      our last approved Marion MAIN (Back Door) + ALT (Grand Maneuver), the published Grant 'THE BACK DOOR').
thumb/sidebar_v2.jpg: YouTube 'Up next' sidebar mock (dark theme, 168x94 thumbs) with our MAIN among the top results for
                      'Vicksburg campaign' (vidIQ youtube_search 2026-11-19; images from i.ytimg.com only).
usage (from vicksburg/): python3 tools/make_thumb_v2_sheet.py"""
from PIL import Image, ImageDraw, ImageFont
T = "youtube/thumb/"; R = T + "work_v2/refs/"; RT = "/home/user/battle-maps/"
OS = RT + "marion/tools/oswald-latin-700-normal.ttf"; SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"; SANSB = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
V = [("MAIN  -  Back Door recipe  -  CUT LOOSE.  (titles A, B, C)", T + "vicksburg-v2-MAIN-BD-CUT_LOOSE.jpg"),
     ("ALT  -  Grand Maneuver recipe  -  CUT LOOSE. / 5 BATTLES IN 18 DAYS  (titles A, C; B ok)", T + "vicksburg-v2-ALT-GM-CUT_LOOSE.jpg"),
     ("OPTIONAL 3rd  -  Back Door recipe  -  5 BATTLES.  (best with title B)", T + "vicksburg-v2-OPT3-BD-5_BATTLES.jpg")]
CMP = [("TG Ridgway (1.0M)", RT + "research/tg_thumbs/tVpl949Nk0M.jpg"), ("TG Patton (773k)", RT + "research/tg_thumbs/5EoX2EYJ_WI.jpg"),
       ("TG Zhukov (585k)", RT + "research/tg_thumbs/BvJN3pyPL6E.jpg"), ("OURS approved: Marion MAIN (BD)", RT + "marion/youtube/thumb/marion-BD-HE_RAN.jpg"),
       ("OURS approved: Marion ALT (GM)", RT + "reference/thumbnails/example-B-grandmaneuver-marion-HE_RAN.jpg"),
       ("OURS published: Grant THE BACK DOOR", RT + "grant/youtube/grant-thumb-PUBLISHED_THE_BACK_DOOR.jpg")]
F = ImageFont.truetype(OS, 30); Fs = ImageFont.truetype(OS, 22)
SW = 2 * 1280 + 3 * 40
rows_h = 60 + 2 * (720 + 70) + 400 + 420 + 60
s = Image.new("RGB", (SW, rows_h), (22, 21, 20)); d = ImageDraw.Draw(s)
d.text((40, 14), "VICKSBURG 1863  -  thumbnails v2 (2026-11-19)  -  full size, feed strips, comparison", font=F, fill=(240, 230, 210))
pos = [(40, 70), (1360, 70), (40, 860)]
for (lab, f), (x, y) in zip(V, pos):
    d.text((x, y), lab, font=Fs, fill=(232, 220, 196)); s.paste(Image.open(f).convert("RGB"), (x, y + 34))
# feed strips next to the third variant
x0, y0 = 1360, 860; d.text((x0, y0), "Feed size: 360x202 (desktop home) and 168x94 (sidebar / phone)", font=Fs, fill=(232, 220, 196))
for i, (lab, f) in enumerate(V):
    im = Image.open(f).convert("RGB"); y = y0 + 40 + i * 225
    s.paste(im.resize((360, 202), Image.LANCZOS), (x0, y)); s.paste(im.resize((168, 94), Image.LANCZOS), (x0 + 380, y))
    s.paste(im.resize((168, 94), Image.LANCZOS).resize((336, 188), Image.NEAREST), (x0 + 570, y)); d.text((x0 + 570, y + 190), "168x94 shown 2x", font=ImageFont.truetype(OS, 16), fill=(150, 140, 120))
    d.text((x0 + 930, y + 70), lab.split("  -  ")[0] + ": " + lab.split("  -  ")[2].split("  (")[0].split(" / ")[0], font=Fs, fill=(200, 190, 170))
# comparison row
y = 860 + 34 + 720 + 50; d.text((40, y), "Side by side at 400 px: 3 real Tactical Genius thumbnails | our last approved (Marion) | our published Grant (must differ)", font=Fs, fill=(232, 220, 196))
for i, (lab, f) in enumerate(CMP):
    x = 40 + i * 425; s.paste(Image.open(f).convert("RGB").resize((400, 225), Image.LANCZOS), (x, y + 36)); d.text((x, y + 266), lab, font=Fs, fill=(200, 190, 170))
y2 = y + 310
d.text((40, y2), "Ours at the same 400 px:", font=Fs, fill=(232, 220, 196))
for i, (lab, f) in enumerate(V):
    x = 40 + i * 425; s.paste(Image.open(f).convert("RGB").resize((400, 225), Image.LANCZOS), (x, y2 + 36)); d.text((x, y2 + 266), lab.split("  -  ")[0], font=Fs, fill=(200, 190, 170))
s = s.crop((0, 0, SW, y2 + 310)); s.save(T + "sheet_v2.jpg", quality=90); print(T + "sheet_v2.jpg", s.size)
# ---------------- sidebar mock (YouTube dark theme, 'Up next' column, 2x scale) ----------------
SB = [("OURS", T + "vicksburg-v2-MAIN-BD-CUT_LOOSE.jpg", "The Campaign That Split the Confederacy: 5 Battles in 18 Days | Vicksburg 1863", "Our channel", "new", "18:46"),
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
sb.save(T + "sidebar_v2.jpg", quality=92); print(T + "sidebar_v2.jpg", sb.size)
