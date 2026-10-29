"""Build the labelled ideas sheet + individual images + metrics for the map-colour study."""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont
SP = os.path.dirname(os.path.abspath(__file__))
OUT = "/home/user/battle-maps/research/map_colour"
os.makedirs(OUT, exist_ok=True)
FONT = "/home/user/battle-maps/sherman/tools/oswald-latin-700-normal.ttf"
F = lambda n: ImageFont.truetype(FONT, n)
SHOTS = [("hook-a", "5s", "WIDE option 1 (0:05)"), ("move1b", "14.48s", "DAY close-up option 2 (2:55)"), ("move2d", "46.5s", "NIGHT (11:00)")]
NAMES = {0: "C0  CURRENT  _hd_ref  (dark grey-green)", 1: "C1  LIFTED FRONTLINES  (same hue, +exposure)",
         2: "C2  STONE  (warm neutral mid-key, dark sea)", 3: "C3  PARCHMENT HD  (_hd, Goose Green)",
         4: "C4  TOPO DAYLIGHT  (light hypsometric, blue sea)", 5: "C5  STONE + SPOTLIGHT  (C2 + edge vignette)"}

def vignette(im):  # C5: screen-space spotlight, clear centre, edges darkened to 50 % towards (10,12,14)
    w, h = im.size; y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((x - w * 0.5) / (w * 0.5)) ** 2 + ((y - h * 0.52) / (h * 0.5)) ** 2)
    a = np.clip((r - 0.55) / 0.75, 0, 1) ** 1.4 * 0.50
    arr = np.asarray(im, np.float32); arr = arr * (1 - a[..., None]) + np.array([10, 12, 14]) * a[..., None]
    return Image.fromarray(arr.astype(np.uint8))

def frame(k, s, t):
    p = f"{SP}/snap/c{2 if k == 5 else k}_{s}/frame-00-at-{t}.png"
    im = Image.open(p).convert("RGB")
    return vignette(im) if k == 5 else im

def lin(c): c = np.asarray(c, np.float64) / 255; return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def Y(c): return float(lin(c) @ [0.2126, 0.7152, 0.0722])
def cr(a, b): ya, yb = Y(a), Y(b); return (max(ya, yb) + 0.05) / (min(ya, yb) + 0.05)
def hexc(h): return [int(h[i:i + 2], 16) for i in (1, 3, 5)]
# Machado et al. 2009 CVD matrices (severity 1.0), applied in linear RGB
MD = {"deutan": np.array([[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]]),
      "protan": np.array([[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]])}
def sim(c, m):
    l = np.clip(MD[m] @ lin(c), 0, 1); s = np.where(l <= 0.0031308, l * 12.92, 1.055 * l ** (1 / 2.4) - 0.055); return (s * 255).round().tolist()

metrics = {}
for k in range(6):
    b = np.asarray(Image.open(f"{SP}/bases/corridor_c{2 if k == 5 else k}.jpg").convert("RGB").resize((1440, 810)), np.float32)
    med = np.median(b.reshape(-1, 3), axis=0).round().tolist()
    m = {"close_base_median_rgb": med, "close_base_Y": round(Y(med), 3)}
    for nm, h in [("text_f7f3ea", "#f7f3ea"), ("label_box_0e0c0a", "#0e0c0a"), ("line_blue_2c57b7", "#2c57b7"), ("line_red_bc2528", "#bc2528"),
                  ("counter_blue_1f4fc4", "#1f4fc4"), ("counter_red_c4121f", "#c4121f")]:
        m["CR_" + nm] = round(cr(hexc(h), med), 2)
    for s, t, _ in SHOTS:
        a = np.asarray(frame(k, s, t), np.float32)
        m["frame_mean_luma_" + s] = round(float((a @ [0.2126, 0.7152, 0.0722]).mean()), 1)
    metrics[k] = m
cvd = {}
for mname in ("deutan", "protan"):
    rb, bb = sim(hexc("#bc2528"), mname), sim(hexc("#2c57b7"), mname)
    cvd[mname] = {"red_line_sim": rb, "blue_line_sim": bb, "CR_red_vs_blue_sim": round(cr(rb, bb), 2)}
cvd["normal"] = {"CR_red_vs_blue": round(cr(hexc("#bc2528"), hexc("#2c57b7")), 2)}
json.dump({"candidates": metrics, "cvd": cvd}, open(f"{OUT}/metrics.json", "w"), indent=1)

# individual images (1280 wide) + phone-width (390) versions
for k in range(6):
    for s, t, lab in SHOTS:
        im = frame(k, s, t)
        tag = {"hook-a": "wide", "move1b": "dayclose", "move2d": "night"}[s]
        im.resize((1280, 720), Image.LANCZOS).save(f"{OUT}/c{k}_{tag}.jpg", quality=86)
        im.resize((390, 219), Image.LANCZOS).save(f"{OUT}/c{k}_{tag}_phone390.jpg", quality=90)

# the sheet
FW, FH, PW, PH, LW, G = 640, 360, 390, 219, 340, 16
W = LW + 3 * (FW + G) + G + 3 * (PW + G)
H = 150 + 6 * (FH + 70)
S = Image.new("RGB", (W, H), (22, 22, 24)); d = ImageDraw.Draw(S)
d.text((G, 14), "MAP COLOUR / GRADE IDEAS  -  same 3 Sherman frames, re-rendered with each basemap (overlays untouched)", font=F(40), fill=(247, 243, 234))
d.text((G, 70), "columns: wide option 1 (0:05)  |  day close-up option 2 (2:55)  |  night (11:00)   ||   the same three at PHONE WIDTH (390 px)", font=F(24), fill=(201, 180, 138))
d.text((G, 104), "night = locked GG.night wash on top of each base (unchanged).  C5 vignette is applied in screen space after compositing (approximation of an overlay layer).", font=F(20), fill=(170, 170, 170))
for k in range(6):
    y = 150 + k * (FH + 70)
    d.text((G, y - 4), NAMES[k].split("  ")[0], font=F(64), fill=(255, 210, 120) if k else (247, 243, 234))
    words = NAMES[k].split("  ", 1)[1]
    import textwrap
    for i, line in enumerate(textwrap.wrap(words, 26)):
        d.text((G, y + 84 + i * 30), line.strip(), font=F(24), fill=(247, 243, 234))
    m = metrics[k]
    d.text((G, y + 190), f"close-up base luma Y={m['close_base_Y']}", font=F(20), fill=(190, 190, 190))
    d.text((G, y + 216), f"white text CR {m['CR_text_f7f3ea']}:1", font=F(20), fill=(190, 190, 190))
    d.text((G, y + 242), f"blue line CR {m['CR_line_blue_2c57b7']}  red {m['CR_line_red_bc2528']}", font=F(20), fill=(190, 190, 190))
    d.text((G, y + 268), f"frame luma W/D/N {m['frame_mean_luma_hook-a']:.0f}/{m['frame_mean_luma_move1b']:.0f}/{m['frame_mean_luma_move2d']:.0f}", font=F(20), fill=(190, 190, 190))
    for j, (s, t, lab) in enumerate(SHOTS):
        im = frame(k, s, t)
        S.paste(im.resize((FW, FH), Image.LANCZOS), (LW + j * (FW + G), y))
        S.paste(im.resize((PW, PH), Image.LANCZOS), (LW + 3 * (FW + G) + G + j * (PW + G), y + (FH - PH) // 2))
        if k == 0:
            d.text((LW + j * (FW + G), 150 - 30), "", font=F(20))
    d.text((LW + 3 * (FW + G) + G, y + (FH - PH) // 2 + PH + 6), "phone width 390 px (wide / day close / night)", font=F(18), fill=(150, 150, 150))
S.save(f"{OUT}/ideas-sheet.jpg", quality=85)
print(S.size, json.dumps(cvd))
for k in range(6): print(k, metrics[k])
